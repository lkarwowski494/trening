/* Runda 75 (audyt T14/T14b): baza poza Dokumentami. Dokumenty są widoczne w Plikach (kopie automatyczne), więc init() otwiera bazę
 * w Library/SQLite i jednorazowo przenosi do niej wiersze ze starej bazy w Dokumentach — przez SQLite (expo-file-system nie pisze do Library/SQLite).
 * Osobny plik bez importu store na górze: atrapa expo-sqlite z setup.js byłaby już zbudowana i jest.doMock nie miałby efektu. */
type KV = Map<string, string>;

function fakeSqlite(dbs: Map<string, KV>, opts: { failRun?: boolean } = {}) {
  const DOCS = '/c/Documents/SQLite'; const opened: string[] = []; const deleted: string[] = [];
  const open = async (_n: string, _o?: unknown, dir?: string) => {
    const key = dir ?? DOCS; opened.push(key); if (!dbs.has(key)) dbs.set(key, new Map()); const kv = dbs.get(key)!;
    return {
      execAsync: async () => {},
      getFirstAsync: async (q: string, k?: string) => (/sqlite_master/.test(q) ? (kv.size ? { name: 'kv' } : null) : kv.has(k!) ? { k, v: kv.get(k!) } : null) as any,
      getAllAsync: async () => [...kv].map(([k, v]) => ({ k, v })) as any,
      runAsync: async (q: string, k: string, v: string) => { if (opts.failRun && /INSERT OR REPLACE INTO kv \(k, v\) VALUES/.test(q)) throw new Error('dysk'); if (/^\s*DELETE/i.test(q)) kv.delete(k); else kv.set(k, v); },
      withTransactionAsync: async (f: () => Promise<void>) => { const snap = new Map(kv); try { await f(); } catch (e) { kv.clear(); snap.forEach((v, k2) => kv.set(k2, v)); throw e; } },
      closeAsync: async () => {},
    };
  };
  const mod = { defaultDatabaseDirectory: DOCS, openDatabaseAsync: open, deleteDatabaseAsync: async (_n: string, dir?: string) => { const k = dir ?? DOCS; deleted.push(k); dbs.delete(k); } };
  return { mod, opened, deleted };
}
async function start(dbs: Map<string, KV>, opts?: { failRun?: boolean }) {
  const f = fakeSqlite(dbs, opts); let st: any;
  await jest.isolateModulesAsync(async () => { jest.doMock('expo-sqlite', () => f.mod); const s = require('@/lib/store'); await s.init(); st = s.getState(); });
  await new Promise(r => setTimeout(r, 0)); /* kasowanie starej bazy jest „w tle” */
  return { ...f, st };
}
const savedState = () => { const st = require('@/lib/seed').seedState('pl'); st.templates[0].name = 'MOJ PLAN'; return JSON.stringify(st); };

test('stare dane w Dokumentach → przeniesione do Library/SQLite, stara baza skasowana; drugi start nie otwiera już Dokumentów', async () => {
  const dbs = new Map<string, KV>([['/c/Documents/SQLite', new Map([['state', savedState()], ['state_corrupt_1', 'x']])]]);
  const r1 = await start(dbs);
  expect(r1.st.templates[0].name).toBe('MOJ PLAN'); expect([...dbs.get('/c/Library/SQLite')!.keys()]).toEqual(expect.arrayContaining(['state', 'state_corrupt_1']));
  expect(r1.deleted).toContain('/c/Documents/SQLite'); expect(dbs.has('/c/Documents/SQLite')).toBe(false);
  const r2 = await start(dbs);
  expect(r2.st.templates[0].name).toBe('MOJ PLAN'); expect(r2.opened).toEqual(['/c/Library/SQLite']);
});

test('nowa instalacja: baza od razu w Library/SQLite, pusta baza w Dokumentach (utworzona przy sprawdzeniu) sprzątnięta', async () => {
  const dbs = new Map<string, KV>(); const r = await start(dbs);
  expect(r.st.templates.length).toBeGreaterThan(0); expect(dbs.get('/c/Library/SQLite')!.has('state')).toBe(true); expect(dbs.has('/c/Documents/SQLite')).toBe(false);
});

test('błąd przy przenoszeniu → start ze starej bazy (dane są), stara nieskasowana, nowa bez „state” — ponowienie przy następnym starcie', async () => {
  const dbs = new Map<string, KV>([['/c/Documents/SQLite', new Map([['state', savedState()]])]]);
  const r = await start(dbs, { failRun: true });
  expect(r.st.templates[0].name).toBe('MOJ PLAN'); expect(dbs.get('/c/Documents/SQLite')!.has('state')).toBe(true);
  expect(dbs.get('/c/Library/SQLite')?.has('state') ?? false).toBe(false); expect(r.deleted).toEqual([]);
  const r2 = await start(dbs); expect(r2.st.templates[0].name).toBe('MOJ PLAN'); expect(dbs.get('/c/Library/SQLite')!.has('state')).toBe(true);
});

test('audyt T14c: nowa baza nieczytelna, a stara w Dokumentach pusta (dane już przeniesione) → błąd startu, nie pusta aplikacja', async () => {
  const dbs = new Map<string, KV>([['/c/Library/SQLite', new Map([['state', savedState()]])]]);
  const f = fakeSqlite(dbs); const orig = f.mod.openDatabaseAsync;
  f.mod.openDatabaseAsync = async (n: string, o?: unknown, dir?: string) => { const d: any = await orig(n, o, dir); if (dir) d.execAsync = async () => { throw new Error('file is not a database'); }; return d; };
  let err: unknown = null; let st: any = null;
  await jest.isolateModulesAsync(async () => { jest.doMock('expo-sqlite', () => f.mod); const s = require('@/lib/store'); try { await s.init(); st = s.getState(); } catch (e) { err = e; } });
  expect(String(err)).toMatch(/not a database/); expect(st).toBeNull(); expect(dbs.get('/c/Documents/SQLite')?.has('state') ?? false).toBe(false);
});
test('audyt T14c: nowa baza nieczytelna, ale stara w Dokumentach ma dane (nieprzeniesione) → start ze starej', async () => {
  const dbs = new Map<string, KV>([['/c/Documents/SQLite', new Map([['state', savedState()]])]]);
  const f = fakeSqlite(dbs); const orig = f.mod.openDatabaseAsync;
  f.mod.openDatabaseAsync = async (n: string, o?: unknown, dir?: string) => { if (dir) throw new Error('disk I/O error'); return orig(n, o, dir); };
  let st: any = null; await jest.isolateModulesAsync(async () => { jest.doMock('expo-sqlite', () => f.mod); const s = require('@/lib/store'); await s.init(); st = s.getState(); });
  expect(st.templates[0].name).toBe('MOJ PLAN');
});
