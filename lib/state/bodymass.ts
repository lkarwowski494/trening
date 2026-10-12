/*
 * Masa ciała z datą (fala 2 audytu 0.10): pomiary, masa obowiązująca w dniu treningu, dopisanie i usunięcie pomiaru.
 * Zależy od: ./core, ./time, ./util; zewnętrzne: ../seed, ../i18n, ../units.
 */
import { t } from '../i18n';
import { fmtW } from '../units';
import { BODY_MASS_MAX, BODY_MASS_LOG_MAX, type BodyMassEntry } from '../seed';
import { kg2 } from './util';
import { localISODate, workoutDay, realDay } from './time';
import { S, save, getState } from './core';

/*
 * Masa ciała z datą (fala 2 audytu 0.10, decyzja: wdrożyć; E1 wariant B). e1RM ćwiczenia z masą ciała w dawnej sesji liczy się z masy ciała z TAMTEGO dnia:
 * ostatni pomiar nie późniejszy niż dzień treningu (w strefie startu — J3). Sesja sprzed pierwszego pomiaru — bez masy ciała, więc bez e1RM w tych
 * ćwiczeniach (nie zgadujemy wstecz; pomiar można dopisać z wcześniejszą datą). Zmiana pomiaru przelicza rekordy (save → histRev).
 */
export const bodyMassLog = (): readonly BodyMassEntry[] => S?.bodyMassLog ?? [];
/** Masa ciała obowiązująca w dniu `day` (RRRR-MM-DD) albo undefined. Lista rosnąco — wyszukiwanie binarne. */
export function bodyMassOn(day: string): number | undefined {
  const l = bodyMassLog(); let lo = 0, hi = l.length; while (lo < hi) { const mid = (lo + hi) >> 1; if (l[mid].date <= day) lo = mid + 1; else hi = mid; }
  return lo ? l[lo - 1].kg : undefined;
}
/** Masa ciała do obliczeń treningu `w` (dzień w strefie startu). */
export const bodyMassFor = (w: { startedAt: number; tzOffsetMin?: number }) => bodyMassOn(workoutDay(w));
/** Ostatni pomiar (Ustawienia) albo undefined. */
export const latestBodyMass = (): BodyMassEntry | undefined => { const l = bodyMassLog(); return l[l.length - 1]; };
/** Zapisuje pomiar (kg na siatce 0,01) z dniem `date` (domyślnie dziś); ten sam dzień — zastępuje. Zwraca błąd tekstem albo null. */
export function addBodyMass(kg: number, date: string = localISODate()): string | null {
  const st = getState(); const v = kg2(kg);
  if (!realDay(date)) return t('Nieprawidłowa data. Wpisz RRRR-MM-DD, np. {d}.', { d: localISODate() });
  if (date > localISODate()) return t('Data pomiaru nie może być w przyszłości.');
  if (!(v > 0) || kg > BODY_MASS_MAX) return t('Masa ciała musi być większa od zera i nie większa niż {max}.', { max: fmtW(BODY_MASS_MAX) });
  const log = (st.bodyMassLog ?? []).filter(x => x.date !== date);
  log.push({ date, kg: v });
  log.sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : 0));
  st.bodyMassLog = log.slice(-BODY_MASS_LOG_MAX); st.userTouched = true; save(); return null;
}
/** Usuwa pomiar z dnia `date` (ostatni — lista znika). */
export function removeBodyMass(date: string) {
  const st = getState(); const log = (st.bodyMassLog ?? []).filter(x => x.date !== date); if (log.length === (st.bodyMassLog ?? []).length) return;
  if (log.length) st.bodyMassLog = log; else delete st.bodyMassLog; save();
}
