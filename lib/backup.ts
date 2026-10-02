import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import * as DocumentPicker from 'expo-document-picker';
import { bandColor, getState, save, replaceState, clearRecovery, migrate, finishedWorkouts, exById, isBW, bandById, localISODate, flush, readRecovery } from './store';
import { t, exName } from './i18n';
import { wOut } from './units';
import { ensureAuthorization, syncAfterFinish } from './health';
import { scheduleWeighReminder } from './timer';
import { SCHEMA_VERSION, SET_KIND_MARK, type State, type Exercise, type WSet, type Workout } from './seed';

/** Koperta backupu (ADR-013): format + wersja schematu, żeby przyszłe wersje mogły migrować świadomie. */
export interface BackupEnvelope { format: 'trening-backup'; schemaVersion: number; exportedAt: string; state: State }

export function buildBackup(): BackupEnvelope {
  return { format: 'trening-backup', schemaVersion: SCHEMA_VERSION, exportedAt: new Date().toISOString(), state: getState() };
}

export async function exportBackup(): Promise<void> {
  const d = localISODate();
  const path = `${FileSystem.cacheDirectory}trening-backup-${d}.json`;
  await FileSystem.writeAsStringAsync(path, JSON.stringify(buildBackup()));
  if (await Sharing.isAvailableAsync()) await Sharing.shareAsync(path, { mimeType: 'application/json', dialogTitle: t('Backup treningów') });
}

/** Runda 75 (T-012): automatyczna kopia JSON po każdym zapisanym treningu, w katalogu dokumentów aplikacji — widoczna w Plikach
 * (Na moim iPhonie → Trening → Backup) dzięki UIFileSharingEnabled. Trzymamy ostatnie AUTO_KEEP kopii; błąd zapisu nie przerywa niczego. */
export const AUTO_DIR = 'Backup/'; export const AUTO_KEEP = 10;
export async function autoBackup(): Promise<string | null> {
  if (!getState().settings.autoBackup || !FileSystem.documentDirectory) return null;
  try {
    const dir = FileSystem.documentDirectory + AUTO_DIR; const info = await FileSystem.getInfoAsync(dir);
    if (!info.exists) await FileSystem.makeDirectoryAsync(dir, { intermediates: true });
    const d = new Date(); const name = `trening-${localISODate(d)}-${String(d.getHours()).padStart(2, '0')}${String(d.getMinutes()).padStart(2, '0')}${String(d.getSeconds()).padStart(2, '0')}.json`;
    await FileSystem.writeAsStringAsync(dir + name, JSON.stringify(buildBackup()));
    const old = (await FileSystem.readDirectoryAsync(dir)).filter(f => /^trening-\d{4}-\d{2}-\d{2}-\d{6}\.json$/.test(f)) /* tylko nasze kopie — plik dorzucony przez użytkownika zostaje */.sort().reverse().slice(AUTO_KEEP); /* nazwy z datą sortują się chronologicznie */
    for (const f of old) await FileSystem.deleteAsync(dir + f, { idempotent: true });
    return dir + name;
  } catch { return null; }
}
/** Po zapisaniu treningu (przycisk „Zakończ”, pytanie o porzucony trening, cichy zapis po 6 h): Apple Health i kopia automatyczna — jedno miejsce. */
export async function onWorkoutSaved(w: Workout): Promise<void> { await syncAfterFinish(w).catch(() => {}); await autoBackup(); /* po Zdrowiu — kopia ma już healthUUID (audyt T14) */ }
/** Docs/12: po zapisaniu edycji treningu albo treningu wstecz — ta sama kopia automatyczna co po „Zakończ”. Apple Health świadomie
 * pominięte: zmienione treningi nie są tam aktualizowane, a treningi wstecz nie są zapisywane (bez duplikatów i „cofania” zdrowia). */
export async function onHistoryEdited(): Promise<void> { await autoBackup(); }

/**
 * Eksport CSV w układzie kolumn Strong (0.2.1): Date, Workout Name, Duration, Exercise Name, Set Order,
 * Weight, Reps, Distance, Seconds, Notes, Workout Notes, RPE. Ciężar hantli zostaje per hantel (jak w Strong na iOS).
 * Guma i typ serii trafiają do Notes, bo Strong nie ma na nie pól.
 */
/** T4b: ciężar serii z tego pola, które ma wartość — po zmianie sprzętu ćwiczenia (np. z maszyny na masę ciała) stare serie nie dają 0. */
const loadOf = (ex: Exercise | undefined, s: WSet) => { const bw = !!ex && isBW(ex); const a = bw ? s.addKg : s.weight, b = bw ? s.weight : s.addKg; return a !== '' && a != null ? a : b !== '' && b != null ? b : 0; };
export function buildCsv(): string {
  // Runda 21: tekst zaczynający się od = + - @ nie staje się formułą w arkuszu (liczby, także ujemne, zostają liczbami).
  const q = (v: unknown) => { let s = v == null ? '' : String(v); if (typeof v === 'string' && /^[=+\-@\t\r]/.test(s)) s = "'" + s; return /[",\r\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s; };
  const pad = (n: number) => String(n).padStart(2, '0');
  const dt = (ts: number) => { const d = new Date(ts); return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`; };
  const rows: string[] = ['Date,Workout Name,Duration,Exercise Name,Set Order,Weight,Reps,Distance,Seconds,Notes,Workout Notes,RPE'];
  for (const w of [...finishedWorkouts()].reverse()) {
    const dur = Math.round(Math.max(0, (w.finishedAt ?? w.startedAt) - w.startedAt) / 60000) + 'm';
    w.exercises.forEach(e => { const ex = exById(e.exerciseId); /* T4b: usunięte ćwiczenie eksportujemy jako „?”, jak w historii — serie nie znikają z pliku */
      let n = 0; // numer serii roboczej — rozgrzewki mają „W” i nie przesuwają numeracji
      e.sets.forEach(s => { const b = s.bandId ? bandById(s.bandId) : null; const bandTxt = b ? `${t('guma')} ${bandColor(b)} ${b.level}` : s.bandId ? `${t('guma')} ?` : ''; const mark = SET_KIND_MARK[s.kind ?? (s.warmup ? 'warmup' : 'normal')]; if (mark !== 'W') n++;
        const notes = [s.note, bandTxt, mark === 'D' ? 'drop set' : mark === 'F' ? t('do upadku') : ''].filter(Boolean).join('; ');
        rows.push([dt(w.startedAt), w.templateName || t('Trening'), dur, exName(ex), mark === 'W' ? 'W' : String(n), wOut(Number(loadOf(ex, s)) || 0) /* runda 7: w jednostce użytkownika, jak eksport Stronga */, s.reps || 0, s.distanceM || 0, s.durationSec || 0, notes, w.note, s.rpe === '' || s.rpe == null ? '' : s.rpe /* runda 18: RIR 0 też */].map(q).join(','));
      }); });
  }
  return rows.join('\n') + '\n';
}
/** Znacznik UTF-8 (BOM) na początku pliku CSV — bez niego Excel w Windows czyta plik jako ANSI i psuje polskie litery. */
export const CSV_BOM = '\uFEFF';
export async function exportCsv(): Promise<void> {
  const d = localISODate();
  const path = `${FileSystem.cacheDirectory}trening-${d}.csv`;
  await FileSystem.writeAsStringAsync(path, CSV_BOM + buildCsv()); /* runda 75 (Q-007): BOM — Excel czyta polskie znaki */
  if (await Sharing.isAvailableAsync()) await Sharing.shareAsync(path, { mimeType: 'text/csv', dialogTitle: t('Eksport CSV') });
}

/** Przyjmuje kopertę (natywna ≥0.1.1) albo goły stan (web 0.3 / natywna 0.1.0). */
export function parseBackup(txt: string): State {
  const d = JSON.parse(txt.replace(/^\uFEFF/, '')); // runda 7: plik zapisany w edytorze z BOM
  // T4b: kopia nieczytelnego zapisu (exportRecovery) — koperta ze stanem i treningiem w toku; po ręcznej poprawce da się ją wczytać.
  if (d && d.format === 'trening-recovery') { const st = typeof d.state === 'string' ? JSON.parse(d.state) : d.state; const lv = typeof d.live === 'string' ? (() => { try { return JSON.parse(d.live); } catch { return null; } })() : d.live;
    if (st && typeof st === 'object' && lv && typeof lv === 'object' && 'active' in lv && (Number.isFinite(lv.seq) && Number.isFinite(st.saveSeq) ? lv.seq >= st.saveSeq : Number(lv.at) >= (Number(st.metaUpdatedAt) || 0)) /* T6: jak przy starcie aplikacji */) { st.active = lv.active; if (lv.timer && typeof lv.timer === 'object') st.timer = lv.timer; }
    d.state = st; d.format = 'trening-backup'; }
  const raw = d && d.format === 'trening-backup' && d.state ? d.state : d;
  const ver = Math.max(Number(d?.schemaVersion) || 0, Number(raw?.schemaVersion) || 0); // także goły stan z nowszej wersji
  if (ver > SCHEMA_VERSION)
    throw new Error(t('Plik ma schemat {a}, a ta wersja obsługuje do {b}. Zaktualizuj aplikację.', { a: ver, b: SCHEMA_VERSION }));
  const s = migrate(raw);
  s.userTouched = true;
  return s;
}

/** T4b: kopia z włączonym zapisem do Apple Health nie włącza go po cichu na tym telefonie — prosimy o zgodę od razu przy imporcie;
 * bez zgody (albo bez HealthKit) zapis zostaje wyłączony, a Ustawienia pokazują to zgodnie z prawdą. */
export async function recheckHealthAfterImport(): Promise<void> {
  const st = getState(); if (!st.settings.healthSync) return;
  let ok = false; try { ok = await ensureAuthorization(); } catch {}
  if (!ok) { st.settings.healthSync = false; save(); }
}
/** Import pliku JSON — z tej apki albo z wersji webowej. */
export async function importBackup(): Promise<boolean> {
  const res = await DocumentPicker.getDocumentAsync({ type: ['application/json', 'text/plain', '*/*'], copyToCacheDirectory: true });
  if (res.canceled || !res.assets?.[0]) return false;
  const txt = await FileSystem.readAsStringAsync(res.assets[0].uri);
  replaceState(parseBackup(txt)); await flush(); clearRecovery(); await recheckHealthAfterImport(); await scheduleWeighReminder(); /* runda 75: ustawienie z kopii */
  return true;
}

/** Udostępnia surową kopię zapisu, którego nie dało się odczytać przy starcie (store.getRecovery). */
export async function exportRecovery(): Promise<boolean> {
  try { // runda 36: każdy błąd (np. brak miejsca) = false → komunikat „Nie udało się”
    const txt = await readRecovery(); if (!txt) return false;
    const path = `${FileSystem.cacheDirectory}trening-odzysk-${localISODate()}.json`;
    await FileSystem.writeAsStringAsync(path, txt);
    if (!(await Sharing.isAvailableAsync())) return false;
    await Sharing.shareAsync(path, { mimeType: 'application/json', dialogTitle: t('Kopia nieczytelnych danych') });
    return true;
  } catch { return false; }
}
