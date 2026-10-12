/*
 * Plik bazy SQLite: katalog bazy poza Dokumentami (runda 75, T14) i jednorazowe przeniesienie wierszy kv ze starej bazy. Bez stanu modułu.
 * Zależy od: (żadnego modułu store); zewnętrzne: expo-sqlite, expo-file-system/legacy.
 */
import * as SQLite from 'expo-sqlite';
import * as FileSystem from 'expo-file-system/legacy';

/** Runda 75 (audyt T14): baza poza katalogiem Dokumenty. Dokumenty są widoczne w Plikach (kopie automatyczne, T-012), a bazy w toku
 * nie wolno dać do usunięcia ani podmiany. Library/SQLite jest prywatne dla aplikacji i wchodzi do kopii telefonu. Bez ścieżki
 * domyślnej (web, testy) — baza zostaje tam, gdzie chce expo-sqlite. */
export function dbDirectory(def: string | null | undefined = SQLite.defaultDatabaseDirectory): string | undefined {
  return def && /\/Documents\/SQLite\/?$/.test(def) ? def.replace(/\/Documents\/SQLite\/?$/, '/Library/SQLite') : undefined;
}
/** Minimalny interfejs bazy do przeniesienia wierszy (testowalny bez natywnego SQLite). */
export type KvDb = { getFirstAsync<T>(q: string, ...p: unknown[]): Promise<T | null>; getAllAsync<T>(q: string, ...p: unknown[]): Promise<T[]>;
    runAsync(q: string, ...p: unknown[]): Promise<unknown>; withTransactionAsync(f: () => Promise<void>): Promise<void>; closeAsync(): Promise<void> };
/** Przenosi wiersze kv ze starej bazy (Dokumenty, wersje sprzed rundy 75) do nowej — w jednej transakcji; stara baza kasowana dopiero
 * po udanym zapisie. Przez SQLite, nie przez expo-file-system: ten pozwala pisać tylko do Dokumentów, Caches i Application Support
 * (audyt T14b). Przerwanie w dowolnym momencie nie gubi danych: bez zatwierdzonej transakcji stara baza zostaje i przeniesienie
 * powtarza się przy następnym starcie; po zatwierdzonej — nowa ma już „state” i stara jest tylko sprzątana. Zwraca liczbę wierszy. */
export async function copyKv(old: KvDb, next: KvDb): Promise<number> {
  const t = await old.getFirstAsync<{ name: string }>("SELECT name FROM sqlite_master WHERE type = 'table' AND name = 'kv'");
  const rows = t ? await old.getAllAsync<{ k: string; v: string }>('SELECT k, v FROM kv') : [];
  if (rows.length) await next.withTransactionAsync(async () => {
    for (const r of rows) await next.runAsync('INSERT OR REPLACE INTO kv (k, v) VALUES (?, ?)', r.k, r.v);
  });
  return rows.length;
}
export async function openDb(): Promise<SQLite.SQLiteDatabase> {
  const def: string | null | undefined = SQLite.defaultDatabaseDirectory; const dir = dbDirectory(def);
  if (!dir) return SQLite.openDatabaseAsync('trening.db');
  const KV = 'CREATE TABLE IF NOT EXISTS kv (k TEXT PRIMARY KEY, v TEXT NOT NULL)';
  let next: SQLite.SQLiteDatabase | null = null; let hasState = false;
  try {
    next = await SQLite.openDatabaseAsync('trening.db', undefined, dir);
    await next.execAsync(KV);
    hasState = !!(await next.getFirstAsync('SELECT k FROM kv WHERE k = ?', 'state'));
  }
  catch (e) { /* nowa baza nieczytelna: stara w Dokumentach tylko wtedy, gdy naprawdę ma dane (jeszcze nieprzeniesione) — inaczej błąd startu
               z ponowieniem, a nie pusta aplikacja nad prawdziwymi danymi (audyt T14c) */
    try { await next?.closeAsync(); } catch {}
    const old = await SQLite.openDatabaseAsync('trening.db'); let ok = false;
    try {
      ok = !!(await old.getFirstAsync("SELECT name FROM sqlite_master WHERE type = 'table' AND name = 'kv'"))
          && !!(await old.getFirstAsync('SELECT k FROM kv WHERE k = ?', 'state'));
    } catch {}
    if (ok) return old;
    await old.closeAsync().catch(() => {}); throw e;
  }
  if (hasState) { void cleanupLegacy(def!); /* Q-015: aplikacja ubita po zatwierdzeniu przeniesienia, a przed sprzątaniem, zostawiła starą kopię — kasujemy ją przy najbliższym starcie */ return next; }
  /* pierwszy start w nowym miejscu: przeniesienie ze starej bazy (albo nic — nowa instalacja) */
  const old = await SQLite.openDatabaseAsync('trening.db');
  try { await copyKv(old, next); }
  catch {
    await next.closeAsync().catch(() => {});
    return old; /* przeniesienie się nie udało — dane zostają w starej bazie, ponowienie przy następnym starcie */
  }
  await old.closeAsync().catch(() => {}); /* błąd zamknięcia nie cofa udanego przeniesienia */
  void cleanupLegacy(def!);
  return next;
}
/** Sprząta starą bazę i pusty katalog Dokumenty/SQLite (widoczny w Plikach). Tylko po przeniesieniu; błędy bez znaczenia. */
async function cleanupLegacy(def: string) {
  try { await SQLite.deleteDatabaseAsync('trening.db'); } catch {}
  try {
    const uri = 'file://' + def.replace(/\/$/, '');
    const left = await FileSystem.readDirectoryAsync(uri);
    if (left.every(f => /^trening\.db-(journal|wal|shm)$/.test(f)))
      await FileSystem.deleteAsync(uri, { idempotent: true }); /* tylko resztki dziennika — bez samej bazy */
  } catch {}
}
