import { finishedWorkouts, getState, workingSets, volume, workoutDurSec } from '@/lib/store';
import { dayStatus, plannedOn, hasPlan, addDays, dayKeyOf, type DayStatus } from '@/lib/plan';
import { periodSummary } from '@/lib/period';
import { thisMonday, prCount } from '@/lib/stats';

/*
 * Dashboard ekranu Trening (decyzja właściciela 08.10.2026, wariant A): karta „Dziś” z paskiem bieżącego tygodnia (pon…nd: zrobione /
 * zaplanowany / opuszczony / wolne), trzy kafelki tygodnia z poprzednim tygodniem obok (te same definicje co podsumowanie w Postępach —
 * lib/period), karta ostatniego treningu. Nowa osoba (bez treningów): „Pierwsze kroki”. Same dane użytkownika, bez ocen.
 */
export type WeekDay = { date: string; status: DayStatus; templateId: string | null; today: boolean };
/** Bieżący tydzień od poniedziałku. */
export function weekStrip(now = Date.now()): WeekDay[] {
  const today = dayKeyOf(now); const mon = dayKeyOf(thisMonday(0, new Date(now)));
  return Array.from({ length: 7 }, (_, i) => { const k = addDays(mon, i); const s = dayStatus(k, today); return { date: k, status: s.status, templateId: s.templateId, today: k === today }; });
}
/** Treningi, serie robocze i czas w tym tygodniu, poprzedni tydzień obok; `planned` — dni z planem w tym tygodniu (null bez planu). */
export function weekTiles(now = Date.now()) {
  const s = periodSummary('week', 0, new Date(now)); const days = weekStrip(now);
  const planned = hasPlan() ? days.filter(d => plannedOn(d.date)).length : null;
  return { workouts: s.workouts, sets: s.sets, durationSec: s.durationSec, prev: s.prev, planned };
}
/** Ostatni zakończony trening: nazwa, start, czas bez pauz, serie robocze, objętość, liczba rekordów. */
export function lastWorkout() {
  const w = finishedWorkouts()[0]; if (!w) return null;
  /* audyt 0.10: serie jak wszędzie (D3, store.workingSets), rekordy jak okno po treningu (E3, stats.prCount — liczba rekordów, nie serii) */
  return { id: w.id, name: w.templateName, startedAt: w.startedAt, durationSec: Math.round(workoutDurSec(w)), sets: workingSets(w), volume: volume(w), prs: prCount(w) };
}
/** „Pierwsze kroki” — widoczne do pierwszego zakończonego treningu. */
export function firstSteps() {
  if (finishedWorkouts().length) return null;
  return { template: getState().templates.some(x => !x.archived && x.items.length), plan: hasPlan() };
}
