import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';
import * as DocumentPicker from 'expo-document-picker';
import { bandColor, getState, save, replaceState, clearRecovery, migrate, finishedWorkouts, exById, shownLoad, bandById, localISODate, flush, readRecovery, getRecovery } from './store';
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
/** Kopie po treningu: trening-RRRR-MM-DD-GGMMSS[-N].json (grupa 1 = data i godzina — nazwy sortują się chronologicznie; grupa 2 = numer
 * kolejnej kopii z tej samej sekundy, od rundy 83b — LOW 4: wcześniej druga kopia w tej samej sekundzie nadpisywała pierwszą). */
const AUTO_RE = /^trening-(\d{4}-\d{2}-\d{2}-\d{6})(?:-(\d{1,3}))?\.json$/;
/** Q-019: kopie bezpieczeństwa przed importem i „Wyczyść dane” — osobna pula (nie wypychają kopii po treningu i odwrotnie). */
export const SAFETY_RE = /^trening-przed-(?:importem|czyszczeniem)-(\d{4}-\d{2}-\d{2}-\d{6})(?:-(\d{1,3}))?\.json$/;
const stampOf = (d: Date) => `${localISODate(d)}-${String(d.getHours()).padStart(2, '0')}${String(d.getMinutes()).padStart(2, '0')}${String(d.getSeconds()).padStart(2, '0')}`;
/** Klucz sortowania w puli: data i godzina, potem numer kopii z tej samej sekundy (bez numeru = 1). */
const poolKey = (m: RegExpExecArray) => `${m[1]}-${(m[2] ?? '1').padStart(3, '0')}`;
/** Zapis bieżącego stanu (koperta jak eksport — z treningiem w toku; `extra` dokłada pola do koperty) do Backup/<prefix><data>[-N].json
 * i rotacja puli `re` do AUTO_KEEP najnowszych. Pliki spoza puli (inne kopie, pliki użytkownika) zostają.
 * Runda 83b (LOW 4):
 *  - rzuca TYLKO gdy kopii nie udało się zapisać; zapis jest atomowy (expo-file-system „legacy” na iOS: 18 i 19 — String.write(toFile:atomically: true), 57.0.7 — Data.write(options: .atomic), sprawdzone w źródle przy T-051; nowe API File.write w 19 i 57 pisze NIEatomowo — przy przejściu na nie zachować tę gwarancję —
 *    plik tymczasowy i podmiana), więc udany zapis = kompletny plik; błąd sprzątania puli po udanym zapisie nie przerywa działania;
 *  - po nieudanym zapisie usuwamy plik docelowy (na wypadek platformy bez zapisu atomowego), żeby w puli nie został ucięty JSON;
 *  - nazwa zajęta (druga kopia w tej samej sekundzie) → przyrostek -2, -3, … zamiast nadpisania. */
async function writeKopia(prefix: string, re: RegExp, extra?: Record<string, unknown>): Promise<string> {
  if (!FileSystem.documentDirectory) throw new Error('no document directory');
  const dir = FileSystem.documentDirectory + AUTO_DIR; const info = await FileSystem.getInfoAsync(dir);
  if (!info.exists) await FileSystem.makeDirectoryAsync(dir, { intermediates: true });
  const stamp = stampOf(new Date()); let name = `${prefix}${stamp}.json`;
  for (let n = 2; n < 1000 && (await FileSystem.getInfoAsync(dir + name)).exists; n++) name = `${prefix}${stamp}-${n}.json`;
  try { await FileSystem.writeAsStringAsync(dir + name, JSON.stringify({ ...buildBackup(), ...extra })); }
  catch (e) { await FileSystem.deleteAsync(dir + name, { idempotent: true }).catch(() => {}); throw e; }
  try {
    const old = (await FileSystem.readDirectoryAsync(dir)).map(f => [f, re.exec(f)] as const).filter((x): x is readonly [string, RegExpExecArray] => !!x[1])
      .map(([f, m]) => [f, poolKey(m)] as const).sort((a, b) => (a[1] < b[1] ? 1 : a[1] > b[1] ? -1 : 0)).slice(AUTO_KEEP);
    for (const [f] of old) await FileSystem.deleteAsync(dir + f, { idempotent: true });
  } catch {} /* kopia już jest — nieposprzątana pula to mniejsze zło niż przerwany import */
  return dir + name;
}
export async function autoBackup(): Promise<string | null> {
  if (!getState().settings.autoBackup || !FileSystem.documentDirectory) return null;
  try { return await writeKopia('trening-', AUTO_RE); } catch { return null; }
}
/**
 * Q-019: kopia bezpieczeństwa tuż przed importem (zanim plik zastąpi dane) i przed „Wyczyść wszystkie dane” — ZAWSZE, także przy wyłączonej
 * kopii automatycznej (ustawienie dotyczy kopii po treningu; tu chodzi o cofnięcie pomyłki). Ten sam katalog Backup/ i format co kopia
 * po treningu (da się ją zaimportować), osobna pula AUTO_KEEP najnowszych. Nieudany zapis rzuca błąd z `safety: true` — import i czyszczenie
 * są wtedy przerywane (dane zostają bez zmian).
 * Runda 83b (LOW 3, decyzja): gdy przy starcie nie dało się odczytać zapisu (store.getRecovery), stan w pamięci to dane startowe, a import
 * i czyszczenie kasują komunikat o nieczytelnych danych (clearRecovery) — dlatego kopia bezpieczeństwa niesie też surowy tekst tamtego zapisu
 * w polu `recovery` (dokładnie to, co wysyła „Kopia nieczytelnych danych”, store.readRecovery). Import kopii czyta `state` (jak dotąd);
 * `recovery` jest do ręcznego odzyskania. Błąd odczytu tego tekstu z bazy → kopia się nie udaje i operacja jest przerywana
 * (brak samego tekstu — readRecovery = null — nie blokuje: nie ma czego chronić).
 * (Alternatywa — nie kasować komunikatu po imporcie — zostawiałaby komunikat o danych, których import już nie dotyczy.)
 */
export async function safetyBackup(kind: 'import' | 'reset'): Promise<string> {
  try {
    const rec = getRecovery() ? await readRecovery() : null; /* błąd odczytu bazy → wyjątek → operacja przerwana */
    return await writeKopia(kind === 'import' ? 'trening-przed-importem-' : 'trening-przed-czyszczeniem-', SAFETY_RE, rec != null ? { recovery: rec } : undefined);
  } catch { throw Object.assign(new Error(t('Nie udało się zapisać kopii bezpieczeństwa w Plikach — dane nie zostały zmienione.')), { safety: true }); }
}
/** Runda 83b (LOW 3): dopisek do potwierdzenia importu / czyszczenia, gdy kopia bezpieczeństwa obejmie też nieczytelny zapis (safetyBackup). */
export const safetyRecoveryNote = (): string => getRecovery() ? ' ' + t('Kopia obejmie też poprzednie, nieczytelne dane.') : '';
export const isSafetyError = (e: unknown): e is Error => e instanceof Error && (e as Error & { safety?: boolean }).safety === true;
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
        rows.push([dt(w.startedAt), w.templateName || t('Trening'), dur, exName(ex), mark === 'W' ? 'W' : String(n), wOut(shownLoad(ex, s)) /* runda 7: w jednostce użytkownika, jak eksport Stronga; T4b/Q-018/83b: store.shownLoad — jak ekran sesji w historii */, s.reps || 0, s.distanceM || 0, s.durationSec || 0, notes, w.note, s.rpe === '' || s.rpe == null ? '' : s.rpe /* runda 18: RIR 0 też */].map(q).join(','));
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
  const next = parseBackup(txt); await safetyBackup('import'); /* Q-019: dopiero gdy plik jest poprawny — przed zastąpieniem danych */
  replaceState(next); await flush(); clearRecovery(); await recheckHealthAfterImport(); await scheduleWeighReminder(); /* runda 75: ustawienie z kopii */
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
