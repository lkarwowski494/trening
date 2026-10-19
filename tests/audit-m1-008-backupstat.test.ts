/* M1-audytor-generalny-008: stan automatycznej kopii po treningu (lib/state/backupstat.ts) — logika bez ekranu. */
import * as store from '@/lib/store';
import { fresh } from './helpers';

test('noteBackup: udana ustawia datę i gasi porażkę; nieudana zostawia datę ostatniej udanej; stan trafia do klucza „autobackup” i wraca po restarcie', async () => {
  await fresh(); expect(store.getBackupStat()).toEqual({ okAt: null, failed: false });
  store.noteBackup(true, 1000); expect(store.getBackupStat()).toEqual({ okAt: 1000, failed: false });
  store.noteBackup(false, 2000); expect(store.getBackupStat()).toEqual({ okAt: 1000, failed: true }); /* data ostatniej UDANEJ bez zmian */
  await new Promise(r => setTimeout(r, 0)); expect(JSON.parse(global.__kv.get('autobackup')!)).toEqual({ okAt: 1000, failed: true });
  store.__resetForTests(); await store.init(); expect(store.getBackupStat()).toEqual({ okAt: 1000, failed: true });
  store.noteBackup(true, 3000); expect(store.getBackupStat()).toEqual({ okAt: 3000, failed: false });
});
test('porażka bez wcześniejszej udanej kopii: okAt = null; uszkodzony zapis w bazie = brak ostrzeżenia', async () => {
  await fresh(); store.noteBackup(false); expect(store.getBackupStat()).toEqual({ okAt: null, failed: true });
  for (const bad of ['nie-json', 'null', '{"okAt":"x","failed":1}']) { global.__kv.set('autobackup', bad); store.__resetForTests(); await store.init(); expect(store.getBackupStat()).toEqual({ okAt: null, failed: false }); }
});
test('błąd zapisu stanu kopii do bazy nie przerywa działania (best effort)', async () => {
  await fresh(); (global as any).__dbFail = (k: string) => k === 'autobackup'; expect(() => store.noteBackup(false, 5)).not.toThrow(); expect(store.getBackupStat().failed).toBe(true);
  await new Promise(r => setTimeout(r, 0)); (global as any).__dbFail = false;
});
