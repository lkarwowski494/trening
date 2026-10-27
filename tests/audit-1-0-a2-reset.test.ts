/* Audyt 1.0, A-2 (dane i prywatność): „Wyczyść wszystkie dane” usuwa też kopie techniczne w bazie — premigrate*, state_corrupt_*, recovery, drafts.
 * Polityka prywatności obiecuje usunięcie danych w aplikacji; kopia sprzed migracji (z masą ciała) zostawała w bazie do 30 dni. */
import * as store from '@/lib/store';
import { SCHEMA_VERSION } from '@/lib/seed';
import { fresh, seedState } from './helpers';

jest.setTimeout(30000);
const DANE = /^(premigrate|state_corrupt_|recovery|drafts)/;
const daneKeys = () => [...global.__kv.keys()].filter(k => DANE.test(k));

describe('A-2: resetAll sprząta kopie techniczne', () => {
  test('po migracji schematu N-1 reset usuwa premigrate_* i indeks; w bazie nie zostaje masa ciała ze starego zapisu', async () => {
    const raw: any = seedState('pl'); raw.schemaVersion = SCHEMA_VERSION - 1; raw.metaUpdatedAt = 1; raw.saveSeq = 3; raw.bodyweight = [{ d: '2026-10-01', kg: 81.5 }];
    await fresh(JSON.stringify(raw));
    expect(daneKeys().length).toBeGreaterThan(0); /* wyjście: kopia istnieje */
    await store.resetAll();
    expect(daneKeys()).toEqual([]);
    expect([...global.__kv.values()].some(v => v.includes('81.5'))).toBe(false);
  });
  test('reset usuwa state_corrupt_* (z _live i _cfg), recovery i drafts', async () => {
    await fresh();
    global.__kv.set('state_corrupt_111', 'x{'); global.__kv.set('state_corrupt_111_live', '{}'); global.__kv.set('state_corrupt_111_cfg', '{}');
    global.__kv.set('recovery', JSON.stringify({ key: 'state_corrupt_111', at: 1 })); global.__kv.set('drafts', '{"exercise":null}');
    await store.resetAll();
    expect(daneKeys()).toEqual([]);
  });
  test('reset nie rusza kluczy niezwiązanych z danymi (zapis stanu, strażnik startu, dostęp)', async () => {
    await fresh();
    global.__kv.set('bootguard', '{"starts":0}'); global.__kv.set('access', '{"x":1}');
    await store.resetAll();
    expect(global.__kv.has('state')).toBe(true); expect(global.__kv.has('bootguard')).toBe(true); expect(global.__kv.has('access')).toBe(true);
  });
});
