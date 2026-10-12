/*
 * Import historii z CSV — odczyt pliku i zapis (parser i budowa: lib/csvparse.ts). Zasady bezpieczeństwa danych (CLAUDE.md, audyty):
 *  1. plik błędny/obcy → ImportError przed jakąkolwiek zmianą stanu;
 *  2. kandydat = kopia JSON bieżącego stanu + nowe wpisy, przepuszczona przez `migrate` — wyjątek = zero zmian;
 *  3. kopia bezpieczeństwa w Plikach (safetyBackup, ta sama pula co przy imporcie kopii) PRZED zapisem; nieudana = import przerwany;
 *  4. zapis jedną zmianą stanu (push + save + flush); istniejące treningi, szablony, ustawienia i trening w toku nie są ruszane;
 *  5. idempotencja: ten sam plik drugi raz → wszystkie treningi są duplikatami (ten sam czas startu), 0 nowych ćwiczeń.
 */
import * as FileSystem from 'expo-file-system/legacy';
import * as DocumentPicker from 'expo-document-picker';
import { getState, save, flush, migrate } from './store';
import { safetyBackup } from './backup';
import { buildImport, parseImport, ImportError, IMPORT_MAX_CHARS, type ImportOptions, type ParsedFile } from './csvparse';

/** Wybór pliku i odczyt (tylko odczyt — stan bez zmian). null = anulowano wybór. Rzuca ImportError. */
export async function pickCsv(): Promise<ParsedFile | null> {
  const res = await DocumentPicker.getDocumentAsync({ type: ['text/csv', 'text/comma-separated-values', 'text/plain', '*/*'], copyToCacheDirectory: true });
  if (res.canceled || !res.assets?.[0]) return null;
  const a = res.assets[0]; let txt: string;
  try {
    if (typeof a.size === 'number' && a.size > IMPORT_MAX_CHARS * 2) throw new ImportError('toolarge');
    txt = await FileSystem.readAsStringAsync(a.uri);
  } finally { if (FileSystem.cacheDirectory && a.uri.startsWith(FileSystem.cacheDirectory)) await FileSystem.deleteAsync(a.uri, { idempotent: true }).catch(() => {}); /* SEC-09 */ }
  return parseImport(txt);
}

/** Dopisuje nowe treningi (i nowe ćwiczenia) do historii. Zwraca liczby dopisanych; 0/0 = nic do zrobienia (stan i pliki bez zmian). */
export async function commitCsvImport(file: ParsedFile, opts: ImportOptions): Promise<{ workouts: number; exercises: number }> {
  const st = getState(); const plan = buildImport(file, st, opts);
  if (!plan.workouts.length) return { workouts: 0, exercises: 0 };
  const cand = JSON.parse(JSON.stringify(st)); cand.exercises.push(...JSON.parse(JSON.stringify(plan.exercises))); cand.workouts.push(...JSON.parse(JSON.stringify(plan.workouts)));
  const next = migrate(cand); /* wyjątek = przerwanie przed zapisem */
  const wIds = new Set(plan.workouts.map(w => w.id)), eIds = new Set(plan.exercises.map(e => e.id));
  const newW = next.workouts.filter(w => wIds.has(w.id)), newE = next.exercises.filter(e => eIds.has(e.id));
  if (newW.length !== plan.workouts.length || newE.length !== plan.exercises.length) throw new Error('import: migrate odrzuciło część danych');
  await safetyBackup('import'); /* Q-019: nieudana kopia przerywa import (dane bez zmian) */
  st.exercises.push(...newE); st.workouts.push(...newW); st.workouts.sort((x, y) => x.startedAt - y.startedAt); st.userTouched = true;
  save(); await flush();
  return { workouts: newW.length, exercises: newE.length };
}
