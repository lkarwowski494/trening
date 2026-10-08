import { finishedWorkouts, isDeloadWeek, mondayKey, getState, save } from '@/lib/store';
export { deloadKeep, deloadSets } from '@/lib/deload-sets';

/*
 * Deload A (decyzja właściciela 08.10.2026): podpowiedź w Kalendarzu „zwykle co 4–6 tygodni”. To opis praktyki trenerów (S5; Bell 2022/2023 i
 * Rogerson 2024 — jeden zespół, „5.6 ± 2.3 weeks”), nie wynik badań — tak też jest opisana w aplikacji. Bez wyzwalaczy z danych (spadek e1RM,
 * wzrost RPE): brak walidacji (Meeusen 2013, Grandou 2020). docs/research/22 sekcja 2.
 * Uproszczenie: liczymy tygodnie treningu z rzędu; tydzień bez treningu albo oznaczony jako deload przerywa serię.
 */
export const DELOAD_EVERY: [number, number] = [4, 6];
const WEEK = 7 * 86400e3;
const keyTs = (k: string) => new Date(+k.slice(0, 4), +k.slice(5, 7) - 1, +k.slice(8, 10), 12).getTime();

/** Poniedziałek następnego tygodnia (RRRR-MM-DD). */
export const nextMonday = (ts: number) => mondayKey(keyTs(mondayKey(ts)) + WEEK);

/** Tygodnie treningu z rzędu do bieżącego (gdy w bieżącym jeszcze nic — do poprzedniego). */
export function trainingStreakWeeks(now: number): number {
  const weeks = new Set(finishedWorkouts().map(w => mondayKey(w.startedAt)));
  let k = mondayKey(now); if (!weeks.has(k) && !isDeloadWeek(now)) k = mondayKey(keyTs(k) - WEEK);
  let n = 0;
  for (let i = 0; i < 520; i++) { const ts = keyTs(k); if (!weeks.has(k) || isDeloadWeek(ts)) break; n++; k = mondayKey(ts - WEEK); }
  return n;
}

export type DeloadHint = { kind: 'none' } | { kind: 'current' } | { kind: 'next'; from: string } | { kind: 'suggest'; weeks: number; from: string };
export function deloadHint(now: number): DeloadHint {
  if (isDeloadWeek(now)) return { kind: 'current' };
  const from = nextMonday(now); if (isDeloadWeek(keyTs(from))) return { kind: 'next', from };
  const weeks = trainingStreakWeeks(now); return weeks >= DELOAD_EVERY[0] && getState().deloadSnooze !== from ? { kind: 'suggest', weeks, from } : { kind: 'none' };
}
/** Audyt 0.10 D4 (UX-06): „Nie teraz” — podpowiedź znika do następnego tygodnia (wraca, gdy proponowany tydzień się zmieni). */
export function snoozeDeloadHint(from: string) { getState().deloadSnooze = from; save(); }
