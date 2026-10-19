/*
 * M1-audytor-generalny-010: warstwa bazy na PRAWDZIWYM SQLite (node:sqlite, w pamięci) zamiast atrapy z mapą — przeniesienie bazy (copyKv w transakcji), zapis kluczy
 * state/live/cfg (INSERT OR REPLACE), odkładanie nieczytelnego zapisu, kopia sprzed migracji. Atrapa z tests/setup.js nie zna transakcji, ograniczeń kolumn ani SQL-a,
 * więc nie złapałaby błędu w zapytaniu. Osobny plik bez importu store na górze (jak tests/db-location.test.ts): store ładowany przez isolateModules z atrapą expo-sqlite
 * opartą o node:sqlite. Pełna atrapa-mapa zostaje w pozostałych testach (szybka, wspólna).
 */
import { DatabaseSync } from 'node:sqlite';

type Dbs = Map<string, DatabaseSync>;
const DOCS = '/c/Documents/SQLite'; const LIB = '/c/Library/SQLite';

/** expo-sqlite na node:sqlite: każdy katalog bazy to osobna baza w pamięci; `failNthInsert` — n-ty zapis INSERT OR REPLACE do kv rzuca (przerwanie w środku). */
function realSqlite(dbs: Dbs, opts: { failNthInsert?: number } = {}) {
  const opened: string[] = []; let inserts = 0;
  const open = async (_n: string, _o?: unknown, dir?: string) => {
    const key = dir ?? DOCS; opened.push(key); if (!dbs.has(key)) dbs.set(key, new DatabaseSync(':memory:')); const d = dbs.get(key)!;
    return {
      execAsync: async (q: string) => { d.exec(q); },
      getFirstAsync: async (q: string, ...p: unknown[]) => ((d.prepare(q).get(...(p as never[])) as unknown) ?? null) as any,
      getAllAsync: async (q: string, ...p: unknown[]) => d.prepare(q).all(...(p as never[])) as any,
      runAsync: async (q: string, ...p: unknown[]) => {
        if (opts.failNthInsert && key === LIB && /INSERT OR REPLACE INTO kv/.test(q) && ++inserts === opts.failNthInsert) throw new Error('dysk');
        return d.prepare(q).run(...(p as never[]));
      },
      withTransactionAsync: async (f: () => Promise<void>) => { d.exec('BEGIN'); try { await f(); d.exec('COMMIT'); } catch (e) { d.exec('ROLLBACK'); throw e; } },
      closeAsync: async () => {},
    };
  };
  return { mod: { defaultDatabaseDirectory: DOCS, openDatabaseAsync: open, deleteDatabaseAsync: async (_n: string, dir?: string) => { dbs.delete(dir ?? DOCS); } }, opened };
}
const rows = (d: DatabaseSync) => Object.fromEntries((d.prepare('SELECT k, v FROM kv ORDER BY k').all() as { k: string; v: string }[]).map(r => [r.k, r.v]));
const count = (d: DatabaseSync) => (d.prepare('SELECT count(*) AS n FROM kv').get() as { n: number }).n;
const withKv = (...entries: [string, string][]) => { const d = new DatabaseSync(':memory:'); d.exec('CREATE TABLE kv (k TEXT PRIMARY KEY, v TEXT NOT NULL)'); for (const [k, v] of entries) d.prepare('INSERT INTO kv (k, v) VALUES (?, ?)').run(k, v); return d; };
const seed = () => require('@/lib/seed') as typeof import('@/lib/seed');
const savedState = (name = 'MOJ PLAN', schema?: number) => {
  const { seedState } = seed(); const st: any = seedState('pl'); st.templates = require('./fixtures/demo-templates').demoTemplates(st.exercises, 'pl'); st.templates[0].name = name;
  if (schema != null) st.schemaVersion = schema; return JSON.stringify(st);
};
type Store = typeof import('@/lib/store');
/** Świeży store (osobny egzemplarz modułów) nad podanymi bazami; zwraca store i opened. */
async function start(dbs: Dbs, opts?: { failNthInsert?: number }) {
  const f = realSqlite(dbs, opts); let s!: Store; let err: unknown = null;
  await jest.isolateModulesAsync(async () => { jest.doMock('expo-sqlite', () => f.mod); s = require('@/lib/store'); try { await s.init(); } catch (e) { err = e; } });
  await new Promise(r => setTimeout(r, 0));
  return { s, err, opened: f.opened };
}

/** copyKv z lib/state/db.ts załadowane w izolowanym rejestrze (żeby atrapa expo-sqlite z setup.js nie trafiła do głównego rejestru przed doMock). */
async function dbModule() {
  let copyKv!: (old: unknown, next: unknown) => Promise<number>;
  await jest.isolateModulesAsync(async () => { jest.doMock('expo-sqlite', () => realSqlite(new Map()).mod); copyKv = require('@/lib/state/db').copyKv; });
  return copyKv;
}
describe('M1-010: copyKv na prawdziwej bazie', () => {
  test('przenosi wszystkie wiersze w transakcji, zwraca ich liczbę; istniejący klucz w nowej bazie jest zastąpiony, stara baza nietknięta', async () => {
    const copyKv = await dbModule(); const old = withKv(['state', 'A'], ['live', 'B'], ['cfg', 'C']); const next = withKv(['state', 'STARE'], ['inny', 'X']);
    const wrap = (d: DatabaseSync) => ({ getFirstAsync: async (q: string) => d.prepare(q).get() ?? null, getAllAsync: async (q: string) => d.prepare(q).all(), runAsync: async (q: string, ...p: unknown[]) => d.prepare(q).run(...(p as never[])),
      withTransactionAsync: async (f: () => Promise<void>) => { d.exec('BEGIN'); try { await f(); d.exec('COMMIT'); } catch (e) { d.exec('ROLLBACK'); throw e; } }, closeAsync: async () => {} });
    expect(await copyKv(wrap(old), wrap(next))).toBe(3);
    expect(rows(next)).toEqual({ state: 'A', live: 'B', cfg: 'C', inny: 'X' }); expect(rows(old)).toEqual({ state: 'A', live: 'B', cfg: 'C' });
  });
  test('stara baza bez tabeli kv: 0 wierszy, nowa bez zmian', async () => {
    const copyKv = await dbModule(); const old = new DatabaseSync(':memory:'); const next = withKv(['state', 'X']);
    const wrap = (d: DatabaseSync) => ({ getFirstAsync: async (q: string) => d.prepare(q).get() ?? null, getAllAsync: async (q: string) => d.prepare(q).all(), runAsync: async (q: string, ...p: unknown[]) => d.prepare(q).run(...(p as never[])),
      withTransactionAsync: async (f: () => Promise<void>) => { d.exec('BEGIN'); try { await f(); d.exec('COMMIT'); } catch (e) { d.exec('ROLLBACK'); throw e; } }, closeAsync: async () => {} });
    expect(await copyKv(wrap(old), wrap(next))).toBe(0); expect(rows(next)).toEqual({ state: 'X' });
  });
  test('przerwanie w środku copyKv (3. zapis rzuca) zostawia nową bazę BEZ wierszy (rollback), stara baza nietknięta; ponowny start przenosi wszystko', async () => {
    const dbs: Dbs = new Map([[DOCS, withKv(['state', savedState()], ['live', '{"seq":1}'], ['cfg', '{"seq":2}'], ['state_corrupt_1', 'x'])]]);
    const r1 = await start(dbs, { failNthInsert: 3 });
    expect(r1.s.getState().templates[0].name).toBe('MOJ PLAN'); /* start ze starej bazy — dane są */
    expect(count(dbs.get(LIB)!)).toBe(0); /* nowa baza: żaden z wierszy nie został zatwierdzony */
    expect(Object.keys(rows(dbs.get(DOCS)!))).toEqual(expect.arrayContaining(['state', 'live', 'cfg', 'state_corrupt_1'])); /* stara kompletna */
    const r2 = await start(dbs); /* ponowienie bez awarii */
    expect(r2.err).toBeNull(); expect(Object.keys(rows(dbs.get(LIB)!))).toEqual(expect.arrayContaining(['state', 'live', 'cfg', 'state_corrupt_1'])); expect(dbs.has(DOCS)).toBe(false);
  });
  test('stare dane w Dokumentach → przeniesione do Library/SQLite, stara baza skasowana; drugi start otwiera tylko nową', async () => {
    const dbs: Dbs = new Map([[DOCS, withKv(['state', savedState()], ['state_corrupt_1', 'x'])]]);
    const r1 = await start(dbs); expect(r1.s.getState().templates[0].name).toBe('MOJ PLAN'); expect(Object.keys(rows(dbs.get(LIB)!))).toEqual(expect.arrayContaining(['state', 'state_corrupt_1'])); expect(dbs.has(DOCS)).toBe(false);
    const r2 = await start(dbs); expect(r2.s.getState().templates[0].name).toBe('MOJ PLAN'); expect(r2.opened).toEqual([LIB]);
  });
});

describe('M1-010: zapis i odczyt kluczy na prawdziwej bazie', () => {
  test('świeża instalacja: state zapisany jako poprawny JSON bieżącego schematu; zmiana + flush + restart = ten sam stan; PRAGMA integrity_check ok', async () => {
    const dbs: Dbs = new Map(); const r = await start(dbs); const S = r.s; const lib = dbs.get(LIB)!;
    expect(JSON.parse(rows(lib).state).schemaVersion).toBe(seed().SCHEMA_VERSION);
    S.getState().settings.defaultRest = 77; S.save(); await S.flush();
    expect(JSON.parse(rows(lib).state).settings.defaultRest).toBe(77); expect(JSON.parse(rows(lib).live).seq).toBeGreaterThan(0);
    const r2 = await start(dbs); expect(r2.s.getState().settings.defaultRest).toBe(77);
    expect(lib.prepare('PRAGMA integrity_check').get()).toEqual({ integrity_check: 'ok' }); expect(count(lib)).toBeLessThan(10);
  });
  test('wielokrotny zapis tego samego klucza (INSERT OR REPLACE) nie dubluje wierszy', async () => {
    const dbs: Dbs = new Map(); const r = await start(dbs); const lib = dbs.get(LIB)!;
    for (let i = 0; i < 5; i++) { r.s.getState().settings.defaultRest = 60 + i; r.s.save(); await r.s.flush(); }
    expect(lib.prepare("SELECT count(*) AS n FROM kv WHERE k = 'state'").get()).toEqual({ n: 1 }); expect(JSON.parse(rows(lib).state).settings.defaultRest).toBe(64);
  });
  test('M1-001 na prawdziwej bazie: nieczytelny zapis + „live” → state_corrupt_*, _live, recovery; dane nie są nadpisane', async () => {
    const dbs: Dbs = new Map([[LIB, withKv(['state', '{zepsute'], ['live', '{"seq":7,"at":1,"active":null,"timer":null}'], ['cfg', '{"seq":8,"at":2,"data":{}}'])]]);
    const r = await start(dbs); const k = Object.keys(rows(dbs.get(LIB)!)); expect(r.s.getRecovery()).not.toBeNull();
    const key = k.find(x => /^state_corrupt_\d+$/.test(x))!; expect(rows(dbs.get(LIB)!)[key]).toBe('{zepsute');
    expect(k).toEqual(expect.arrayContaining([`${key}_live`, `${key}_cfg`, 'recovery'])); expect(rows(dbs.get(LIB)!)[`${key}_live`]).toBe('{"seq":7,"at":1,"active":null,"timer":null}');
  });
  test('M1-002 na prawdziwej bazie: start na schemacie N-1 zostawia premigrate_<schemat> z surowym zapisem', async () => {
    const raw = savedState('MOJ PLAN', 18); const dbs: Dbs = new Map([[LIB, withKv(['state', raw])]]);
    const r = await start(dbs); const lib = dbs.get(LIB)!; expect(r.err).toBeNull();
    expect(JSON.parse(rows(lib).premigrate_18).state).toEqual(JSON.parse(raw)); expect(JSON.parse(rows(lib).state).schemaVersion).toBe(seed().SCHEMA_VERSION);
    expect(Object.keys(JSON.parse(rows(lib).premigrate))).toEqual(['18']);
  });
  test('sprzątanie kopii sprzed migracji (DELETE) po PREMIGRATE_KEEP_MS działa na prawdziwej bazie', async () => {
    const { PREMIGRATE_KEEP_MS } = require('@/lib/state/util'); const old = Date.now() - PREMIGRATE_KEEP_MS - 1000;
    const dbs: Dbs = new Map([[LIB, withKv(['state', savedState()], ['premigrate_18', '{"format":"trening-recovery"}'], ['premigrate', JSON.stringify({ 18: old })])]]);
    const r = await start(dbs); expect(r.err).toBeNull(); expect(Object.keys(rows(dbs.get(LIB)!))).not.toEqual(expect.arrayContaining(['premigrate_18']));
    expect(rows(dbs.get(LIB)!).premigrate).toBeUndefined();
  });
});
