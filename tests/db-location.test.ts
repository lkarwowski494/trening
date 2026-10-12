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
/* szablon użytkownika (dane testowe — świeża instalacja nie ma szablonów od 03.10.2026); fixture importuje tylko lib/seed, nie store */
const savedState = () => { const st = require('@/lib/seed').seedState('pl'); st.templates = require('./fixtures/demo-templates').demoTemplates(st.exercises, 'pl'); st.templates[0].name = 'MOJ PLAN'; return JSON.stringify(st); };

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
  expect(r.st.exercises.length).toBeGreaterThan(0); expect(r.st.templates).toEqual([]); /* świeży stan startowy: biblioteka bez szablonów (decyzja 03.10.2026) */ expect(dbs.get('/c/Library/SQLite')!.has('state')).toBe(true); expect(dbs.has('/c/Documents/SQLite')).toBe(false);
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

/* Q-015 (0.14.0): zabicie aplikacji między zatwierdzeniem przeniesienia a sprzątaniem zostawia starą kopię w Dokumentach (widoczną w Plikach).
 * Kroki: pierwszy start po aktualizacji → aplikacja ubita w ułamku sekundy po przeniesieniu → kolejny start. Dawniej stara kopia zostawała na stałe
 * i przy nieczytelnej nowej bazie stanowiłaby cichy powrót do starych danych. Realność: brzegowy (wąskie okno), ale dotyczy danych → naprawione. */
test('Q-015: nowa baza ma już „state”, a stara kopia w Dokumentach została po ubitym sprzątaniu → następny start ją kasuje i używa nowej', async () => {
  const stale = JSON.parse(savedState()); stale.templates[0].name = 'STARA KOPIA';
  const dbs = new Map<string, KV>([['/c/Documents/SQLite', new Map([['state', JSON.stringify(stale)]])], ['/c/Library/SQLite', new Map([['state', savedState()]])]]);
  const r = await start(dbs);
  expect(r.st.templates[0].name).toBe('MOJ PLAN'); expect(r.deleted).toContain('/c/Documents/SQLite'); expect(dbs.has('/c/Documents/SQLite')).toBe(false);
  expect(r.opened).toEqual(['/c/Library/SQLite']); /* nowa baza nietknięta, stara nawet nie otwierana */
  expect(dbs.get('/c/Library/SQLite')!.get('state')).toContain('MOJ PLAN');
});
test('Q-015: po sprzątnięciu nieczytelna nowa baza nie cofa do starych danych (błąd startu, nie stara kopia)', async () => {
  const dbs = new Map<string, KV>([['/c/Library/SQLite', new Map([['state', savedState()]])]]);
  const f = fakeSqlite(dbs); const orig = f.mod.openDatabaseAsync;
  f.mod.openDatabaseAsync = async (n: string, o?: unknown, dir?: string) => { if (dir) throw new Error('disk I/O error'); return orig(n, o, dir); };
  let err: unknown = null; await jest.isolateModulesAsync(async () => { jest.doMock('expo-sqlite', () => f.mod); const s = require('@/lib/store'); try { await s.init(); } catch (e) { err = e; } });
  expect(String(err)).toMatch(/disk I\/O/);
});

/* Q-015 (audyt 0.14.0): kasowanie starej bazy nie może zgubić nowszych danych. Kroki: (1) aplikacja ubita po przeniesieniu, przed sprzątaniem — kopia w Dokumentach
 * zostaje; (2) nowa baza chwilowo się nie otwiera → start ze starej, trening zapisany w starej; (3) nowa znów się otwiera. Dawniej cleanupLegacy kasował starą
 * z tym treningiem. Teraz: stara nowsza od nowej → jej wiersze trafiają do nowej (potem sprzątanie); kopia nieudana → stara zostaje. Realność: brzegowy, dane → naprawione. */
/* plik ze starą bazą „istnieje” wg atrapy katalogów (setup.js zwraca exists: false) */
const fsExists = (v: () => boolean) => require('expo-file-system/legacy').getInfoAsync.mockImplementation(async () => ({ exists: v() }));
const withAt = (name: string, at: number) => { const st = JSON.parse(savedState()); st.templates[0].name = name; st.metaUpdatedAt = at; return JSON.stringify(st); };
test('Q-015: trzy kroki — trening zapisany w starej bazie (nowa chwilowo nieczytelna) przetrwa następny start', async () => {
  const dbs = new Map<string, KV>([['/c/Documents/SQLite', new Map([['state', withAt('PRZED', 1000)]])], ['/c/Library/SQLite', new Map([['state', withAt('PRZED', 1000)]])]]);
  const f = fakeSqlite(dbs); const orig = f.mod.openDatabaseAsync; let failNew = true;
  f.mod.openDatabaseAsync = async (n: string, o?: unknown, dir?: string) => { if (dir && failNew) throw new Error('disk I/O error'); return orig(n, o, dir); };
  await jest.isolateModulesAsync(async () => { jest.doMock('expo-sqlite', () => f.mod); const s = require('@/lib/store'); await s.init();
    expect(s.getState().templates[0].name).toBe('PRZED'); s.getState().templates[0].name = 'PO TRENINGU'; s.save(s.getState().templates[0]); await s.flush(); });
  expect(dbs.has('/c/Documents/SQLite')).toBe(true); failNew = false;
  let st: any; await jest.isolateModulesAsync(async () => { jest.doMock('expo-sqlite', () => f.mod);
    const s = require('@/lib/store'); fsExists(() => dbs.has('/c/Documents/SQLite')); await s.init(); st = s.getState(); });
  await new Promise(r => setTimeout(r, 0));
  expect(st.templates[0].name).toBe('PO TRENINGU'); expect(dbs.get('/c/Library/SQLite')!.get('state')).toContain('PO TRENINGU');
});
test('Q-015: stara nowsza, a kopia do nowej się nie udaje → stara nieskasowana, start z niej', async () => {
  const dbs = new Map<string, KV>([['/c/Documents/SQLite', new Map([['state', withAt('NOWSZA', 2000)]])], ['/c/Library/SQLite', new Map([['state', withAt('STARSZA', 1000)]])]]);
  const f = fakeSqlite(dbs, { failRun: true }); let st: any;
  await jest.isolateModulesAsync(async () => { jest.doMock('expo-sqlite', () => f.mod);
    const s = require('@/lib/store'); fsExists(() => true); await s.init(); st = s.getState(); });
  await new Promise(r => setTimeout(r, 0));
  expect(st.templates[0].name).toBe('NOWSZA'); expect(dbs.has('/c/Documents/SQLite')).toBe(true); expect(f.deleted).toEqual([]);
});
test('Q-015: stara starsza od nowej → nowa zostaje, stara skasowana (nic nie kopiujemy)', async () => {
  const dbs = new Map<string, KV>([['/c/Documents/SQLite', new Map([['state', withAt('STARSZA', 1000)]])], ['/c/Library/SQLite', new Map([['state', withAt('NOWSZA', 2000)]])]]);
  const f = fakeSqlite(dbs); let st: any;
  await jest.isolateModulesAsync(async () => { jest.doMock('expo-sqlite', () => f.mod);
    const s = require('@/lib/store'); fsExists(() => true); await s.init(); st = s.getState(); });
  await new Promise(r => setTimeout(r, 0));
  expect(st.templates[0].name).toBe('NOWSZA'); expect(dbs.has('/c/Documents/SQLite')).toBe(false);
});
