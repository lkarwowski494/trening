/* Audyt M1 z 19.10.2026, partia 1 — M1-audytor-generalny-002 (kopia surowego zapisu sprzed migracji). Czerwone na commicie 8273448, zielone po poprawce. */
import * as store from '@/lib/store';
import { parseBackup } from '@/lib/backup';
import { SCHEMA_VERSION } from '@/lib/seed';
import { fresh, seedState } from './helpers';

jest.setTimeout(30000);
afterEach(() => { (global as any).__dbFail = false; });

/** Zapis w bazie w kształcie poprzedniego schematu (N-1): stan z historią, bez zmian w polach (różnica schematów to sam numer). */
function previousSchemaRaw() {
  const s: any = seedState('pl'); s.schemaVersion = SCHEMA_VERSION - 1; s.metaUpdatedAt = 1; s.saveSeq = 3;
  return s;
}

describe('M1-002: kopia surowego zapisu sprzed migracji', () => {
  const key = `premigrate_${SCHEMA_VERSION - 1}`;
  test('start na schemacie N-1 zostawia w bazie kopię; import jej odtwarza dane; kopia znika dopiero po PREMIGRATE_KEEP_MS', async () => {
    const raw = previousSchemaRaw(); raw.settings.defaultRest = 77;
    await fresh(JSON.stringify(raw));
    const env = JSON.parse(global.__kv.get(key)!);
    expect(env.format).toBe('trening-recovery'); expect(env.fromSchema).toBe(SCHEMA_VERSION - 1);
    expect(env.state).toEqual(raw); /* surowy zapis, 1:1 */
    expect(JSON.parse(global.__kv.get('state')!).schemaVersion).toBe(SCHEMA_VERSION); /* a zapis główny jest już zmigrowany */
    /* import kopii: dane z koperty wracają (przez zwykły parseBackup/migrate) */
    const txt = await store.readPreMigrate(); expect(txt).not.toBeNull();
    const back = parseBackup(txt!); expect(back.settings.defaultRest).toBe(77); expect(back.schemaVersion).toBe(SCHEMA_VERSION);
    /* kolejny start (schemat bieżący) przed upływem terminu — kopia zostaje */
    store.__resetForTests(); await store.init(); expect(global.__kv.has(key)).toBe(true);
    /* po terminie — znika */
    global.__kv.set('premigrate', JSON.stringify({ [SCHEMA_VERSION - 1]: Date.now() - store.PREMIGRATE_KEEP_MS - 1000 })); /* indeks czasów kopii */
    store.__resetForTests(); await store.init(); expect(global.__kv.has(key)).toBe(false); expect(global.__kv.has('premigrate')).toBe(false);
  });
  test('start na bieżącym schemacie nie tworzy kopii', async () => {
    await fresh(); store.__resetForTests(); await store.init();
    expect([...global.__kv.keys()].filter(k => k.startsWith('premigrate_'))).toEqual([]);
  });
  test('kopia zawiera też trening w toku z klucza „live” i konfigurację z „cfg”', async () => {
    const raw = previousSchemaRaw(); const live = { seq: 4, at: 5, active: null, timer: null }; const cfg = { seq: 5, at: 6, data: { templates: [] } };
    await fresh(JSON.stringify(raw)); global.__kv.clear(); global.__kv.set('state', JSON.stringify(raw)); global.__kv.set('live', JSON.stringify(live)); global.__kv.set('cfg', JSON.stringify(cfg));
    store.__resetForTests(); await store.init();
    const env = JSON.parse(global.__kv.get(key)!); expect(env.live).toEqual(live); expect(env.cfg).toEqual(cfg);
  });
  test('kopia się nie udaje (dysk pełny) -> zmigrowany zapis NIE nadpisuje starego „state”', async () => {
    const raw = previousSchemaRaw(); const txt = JSON.stringify(raw);
    await fresh(); global.__kv.clear(); global.__kv.set('state', txt);
    (global as any).__dbFail = (k: string) => k.startsWith('premigrate_');
    store.__resetForTests(); await store.init();
    expect(global.__kv.get('state')).toBe(txt); /* nietknięty */
    expect(store.getState().schemaVersion).toBe(SCHEMA_VERSION); /* aplikacja działa na zmigrowanym stanie w pamięci */
  });
});

