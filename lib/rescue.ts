/*
 * Kopia ratunkowa plików bazy dla ekranu błędu startu (M1-audytor-generalny-004): gdy bazy nie da się otworzyć, komplet jej plików trafia do folderu
 * widocznego w aplikacji Pliki. Tylko odczyt oryginału. Zależy od: lib/state/db, lib/state/time. Tu mieszka AUTO_DIR (folder kopii w Plikach), bo lib/backup importuje ten moduł — bez cyklu importów.
 */
import * as FileSystem from 'expo-file-system/legacy';
import * as SQLite from 'expo-sqlite';
import { dbDirectory } from './state/db';
import { localISODate } from './state/time';

/** Folder kopii w Dokumentach (widoczny w Plikach: Na moim iPhonie → aplikacja → Backup); lib/backup eksportuje go dalej. */
export const AUTO_DIR = 'Backup/';

/** M1-audytor-generalny-004: pliki bazy, które razem tworzą jej stan (bez dziennika sama baza bywa niespójna — sqlite.org/howtocorrupt.html). */
export const DB_FILES = ['trening.db', 'trening.db-wal', 'trening.db-shm', 'trening.db-journal'] as const;
/** Kopia ratunkowa plików bazy, gdy baza się nie otwiera (M1-audytor-generalny-004, decyzja właściciela 27.10.2026 — folder w Plikach): komplet plików bazy
 * z katalogu bazy do Pliki → {app} → Backup → Rescue-RRRR-MM-DD-GGMM, żeby dało się go zapisać poza telefonem przed ewentualną reinstalacją. Tylko odczyt
 * oryginału (kopiowanie, nigdy przeniesienie ani usunięcie); bazy nie otwiera. Zwraca nazwę folderu albo null (brak pliku bazy, web, błąd kopiowania).
 * `dir` i `copy` — do testów na prawdziwych plikach. */
export async function rescueDbCopy(now: Date = new Date(), dir: string | undefined = dbDirectory(SQLite.defaultDatabaseDirectory),
  copy: (from: string, to: string) => Promise<void> = (from, to) => FileSystem.copyAsync({ from, to })): Promise<string | null> {
  try {
    if (!dir || !FileSystem.documentDirectory) return null;
    const src = (dir.startsWith('file://') ? dir : 'file://' + dir).replace(/\/$/, '') + '/';
    if (!(await FileSystem.getInfoAsync(src + DB_FILES[0])).exists) return null;
    const p2 = (n: number) => String(n).padStart(2, '0');
    const name = `Rescue-${localISODate(now)}-${p2(now.getHours())}${p2(now.getMinutes())}`; const dest = FileSystem.documentDirectory + AUTO_DIR + name + '/';
    await FileSystem.makeDirectoryAsync(dest, { intermediates: true });
    for (const f of DB_FILES) if ((await FileSystem.getInfoAsync(src + f)).exists) await copy(src + f, dest + f);
    return name;
  } catch { return null; }
}
