/* Audyt M1 z 19.10.2026, partia 1 — M1-audytor-generalny-006 (import przy nieudanym zapisie do bazy). Czerwone na commicie 8273448, zielone po poprawce. */
import * as store from '@/lib/store';
import * as fs from 'fs';
import * as path from 'path';
import * as FS from 'expo-file-system/legacy';
import * as DocumentPicker from 'expo-document-picker';
import { importBackup, isPersistError } from '@/lib/backup';
import { parseImport } from '@/lib/csvparse';
import { commitCsvImport } from '@/lib/csvimport';
import { SCHEMA_VERSION } from '@/lib/seed';
import { fresh, seedState } from './helpers';

jest.setTimeout(30000);
afterEach(() => { (global as any).__dbFail = false; });

describe('M1-006: import przy nieudanym zapisie do bazy kończy się błędem zapisu, nie „Zaimportowano”', () => {
  const failState = (k: string) => k === 'state';
  const pick = (txt: string) => { (DocumentPicker.getDocumentAsync as jest.Mock).mockResolvedValueOnce({ canceled: false, assets: [{ uri: 'file:///x.json' }] }); (FS.readAsStringAsync as jest.Mock).mockResolvedValueOnce(txt); };
  const restart = async () => { store.__resetForTests(); await store.init(); return store.getState(); };
  test('importBackup: __dbFail dla „state” -> błąd zapisu, dane i baza bez zmian; po naprawie ponowny import trafia do bazy (po restarcie)', async () => {
    await fresh(); store.getState().settings.defaultRest = 91; store.save(); await store.flush();
    const other: any = seedState('pl'); other.settings.defaultRest = 33; const txt = JSON.stringify({ format: 'trening-backup', schemaVersion: SCHEMA_VERSION, exportedAt: new Date().toISOString(), state: other });
    (global as any).__dbFail = failState; pick(txt);
    const err = await importBackup().then(() => null, e => e); expect(isPersistError(err)).toBe(true);
    expect(store.getState().settings.defaultRest).toBe(91); /* import cofnięty w pamięci */
    expect(JSON.parse(global.__kv.get('state')!).settings.defaultRest).toBe(91);
    (global as any).__dbFail = false; pick(txt); await expect(importBackup()).resolves.toBe(true);
    expect((await restart()).settings.defaultRest).toBe(33);
  });
  test('commitCsvImport: __dbFail dla „state” -> błąd zapisu, historia bez zmian; po naprawie ponowny import dopisuje treningi do bazy', async () => {
    await fresh(); const csv = fs.readFileSync(path.join(__dirname, 'fixtures', 'import-formatA.csv'), 'utf8'); const NOW = new Date(2026, 9, 11, 12).getTime();
    const w0 = store.getState().workouts.length, e0 = store.getState().exercises.length;
    (global as any).__dbFail = failState;
    const err = await commitCsvImport(parseImport(csv, NOW), { unit: 'kg' }).then(() => null, e => e); expect(isPersistError(err)).toBe(true);
    expect([store.getState().workouts.length, store.getState().exercises.length]).toEqual([w0, e0]);
    (global as any).__dbFail = false;
    await expect(commitCsvImport(parseImport(csv, NOW), { unit: 'kg' })).resolves.toEqual({ workouts: 3, exercises: 2 });
    const st = await restart(); expect([st.workouts.length, st.exercises.length]).toEqual([w0 + 3, e0 + 2]);
  });
});
