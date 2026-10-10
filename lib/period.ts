import { wallTs, finishedWorkouts, volume, workingSets, workoutDurSec } from './store';
import { thisMonday, workoutPRs, type WorkoutPR } from './stats';
import { locale } from './i18n';

/*
 * Podsumowanie tygodnia i miesiąca (decyzja właściciela 08.10.2026, docs/21 4b „Raport tygodnia / miesiąca”): same liczby z historii
 * użytkownika — treningi, serie robocze, objętość, łączny czas, rekordy z okresu — i te same liczby z poprzedniego okresu obok.
 * Bez ocen i zaleceń. Tydzień od poniedziałku (jak statystyki i kalendarz), miesiąc kalendarzowy; granice z dat kalendarzowych (DST).
 * Definicje jak w reszcie aplikacji: serie robocze = store.workingSets (bez rozgrzewki, drop razem z serią — D3, audyt 0.10), objętość = store.volume (jak historia i Postępy),
 * rekordy = workoutPRs (ten sam silnik co odznaki przy seriach i podsumowanie po treningu), trening liczy się w okresie swojego startu.
 */
export type PeriodKind = 'week' | 'month';
export type PeriodTotals = { workouts: number; sets: number; volume: number; durationSec: number };
export type PeriodPR = { workoutId: string; at: number; pr: WorkoutPR };
export type PeriodSummary = PeriodTotals & { kind: PeriodKind; start: number; end: number; prev: PeriodTotals; prs: PeriodPR[] };

/** Granice okresu przesuniętego o `offset` (0 = bieżący, −1 = poprzedni) — [start, end). */
export function periodRange(kind: PeriodKind, offset = 0, now = new Date()): { start: number; end: number } {
  if (kind === 'week') return { start: thisMonday(offset, now), end: thisMonday(offset + 1, now) };
  return { start: new Date(now.getFullYear(), now.getMonth() + offset, 1).getTime(), end: new Date(now.getFullYear(), now.getMonth() + offset + 1, 1).getTime() };
}

const inRange = (start: number, end: number) => finishedWorkouts().filter(w => { const x = wallTs(w); return x >= start && x < end; }) /* J3: dzień w strefie startu */;

function totals(start: number, end: number): PeriodTotals {
  const ws = inRange(start, end); let sets = 0, vol = 0, dur = 0;
  for (const w of ws) {
    vol += volume(w); dur += Math.round(workoutDurSec(w)); /* bez pauz (decyzja 08.10.2026) */
    sets += workingSets(w); /* D3 (audyt 0.10): jedna definicja serii roboczych */
  }
  return { workouts: ws.length, sets, volume: vol, durationSec: dur };
}

export function periodSummary(kind: PeriodKind, offset = 0, now = new Date()): PeriodSummary {
  const { start, end } = periodRange(kind, offset, now); const p = periodRange(kind, offset - 1, now);
  const prs = inRange(start, end).slice().sort((a, b) => a.startedAt - b.startedAt).flatMap(w => workoutPRs(w).map(pr => ({ workoutId: w.id, at: wallTs(w) /* X2-02: data na zegarze strefy startu, jak przydział do okresu */, pr })));
  return { kind, start, end, ...totals(start, end), prev: totals(p.start, p.end), prs };
}

/** Tytuł okresu: „6–12 paź 2026” (tydzień) albo „październik 2026” (miesiąc), w języku aplikacji. */
export function periodTitle(kind: PeriodKind, start: number): string {
  const d = new Date(start);
  if (kind === 'month') return d.toLocaleDateString(locale(), { month: 'long', year: 'numeric' });
  const e = new Date(d.getFullYear(), d.getMonth(), d.getDate() + 6);
  const day = (x: Date, o: Intl.DateTimeFormatOptions) => x.toLocaleDateString(locale(), o);
  return `${day(d, { day: 'numeric', month: 'short' })} – ${day(e, { day: 'numeric', month: 'short', year: 'numeric' })}`;
}
