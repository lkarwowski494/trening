/*
 * Stan automatycznej kopii po treningu (M1-audytor-generalny-008): data ostatniej UDANEJ kopii i znacznik, że ostatnia próba się nie udała. Mały klucz kv „autobackup”
 * (poza stanem aplikacji i poza kopiami — dotyczy tego telefonu). Pokazuje go baner na ekranie Trening (app/(tabs)/index.tsx); udana kopia gasi znacznik.
 * Zależy od: ./core, ./util.
 */
import { db, emit, bump } from './core';
import { isObj } from './util';

export interface BackupStat { okAt: number | null; failed: boolean }
const KEY = 'autobackup';
let stat: BackupStat = { okAt: null, failed: false };

export const getBackupStat = (): BackupStat => stat;
/** Start aplikacji: stan z bazy (brak/uszkodzony zapis = nic nie wiadomo, bez ostrzeżenia). */
export async function loadBackupStat(): Promise<void> {
  stat = { okAt: null, failed: false };
  try {
    const r = await db!.getFirstAsync<{ v: string }>('SELECT v FROM kv WHERE k = ?', KEY); const o = r ? JSON.parse(r.v) : null;
    if (isObj(o)) stat = { okAt: typeof o.okAt === 'number' && Number.isFinite(o.okAt) ? o.okAt : null, failed: o.failed === true };
  } catch {}
}
/** Wynik próby kopii po treningu: udana ustawia datę i gasi znacznik, nieudana zostawia datę ostatniej udanej. Zapis do bazy jest „best effort”. */
export function noteBackup(ok: boolean, at = Date.now()): void {
  stat = ok ? { okAt: at, failed: false } : { okAt: stat.okAt, failed: true };
  bump(false); emit();
  db?.runAsync('INSERT OR REPLACE INTO kv (k, v) VALUES (?, ?)', KEY, JSON.stringify(stat)).catch(() => {});
}
