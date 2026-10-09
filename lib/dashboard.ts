import { getRev, wallTs, finishedWorkouts, getState, isWorking, exById, volume, workoutDurSec, workingSets } from '@/lib/store';
import { dayStatus, hasPlan, addDays, dayKeyOf, type DayStatus, plannedOn } from '@/lib/plan';
import { periodSummary } from '@/lib/period';
import { thisMonday, prCount } from '@/lib/stats';

/*
 * Dashboard ekranu Trening (decyzja właściciela 08.10.2026, wariant A): karta „Dziś” z paskiem bieżącego tygodnia (pon…nd: zrobione /
 * zaplanowany / opuszczony / wolne), trzy kafelki tygodnia z poprzednim tygodniem obok (te same definicje co podsumowanie w Postępach —
 * lib/period), karta ostatniego treningu. Nowa osoba (bez treningów): „Pierwsze kroki”. Same dane użytkownika, bez ocen.
 */
export type WeekDay = { date: string; status: DayStatus; templateId: string | null; today: boolean };
/** Bieżący tydzień od poniedziałku. */
/** PERF-04: wynik pamiętany do następnej zmiany stanu (store.getRev) i dnia — karta „Dziś” i kafelki tygodnia liczą go raz. */
let stripMemo: { key: string; st: object; v: WeekDay[] } | null = null;
export function weekStrip(now = Date.now()): WeekDay[] {
  const key = `${getRev()}|${dayKeyOf(now)}`; const st = getState(); if (stripMemo?.key === key && stripMemo.st === st) return stripMemo.v; /* ten sam stan (nie tylko licznik — nowy stan po imporcie/starcie) */
  const v = weekStripOf(now); stripMemo = { key, st, v }; return v;
}
function weekStripOf(now: number): WeekDay[] {
  const today = dayKeyOf(now); const mon = dayKeyOf(thisMonday(0, new Date(now)));
  return Array.from({ length: 7 }, (_, i) => { const k = addDays(mon, i); const s = dayStatus(k, today); return { date: k, status: s.status, templateId: s.templateId, today: k === today }; });
}
/** Treningi, serie robocze i czas w tym tygodniu, poprzedni tydzień obok; `planned` — dni z planem w tym tygodniu (null bez planu), `planDone` —
 * z nich zrobione zaplanowanym szablonem (audyt 0.10 A5: ta sama funkcja stanu dnia co kalendarz i pasek; inny trening nie zalicza dnia z planu). */
export function weekTiles(now = Date.now(), days: WeekDay[] = weekStrip(now) /* PERF-04: ekran podaje gotowy pasek — bez drugiego liczenia */) {
  const s = periodSummary('week', 0, new Date(now));
  const plan = hasPlan(dayKeyOf(now)) || days.some(d => d.templateId);
  const planned = plan ? days.filter(d => d.templateId).length : null; const planDone = plan ? days.filter(d => d.templateId && d.status === 'done').length : null;
  return { workouts: s.workouts, sets: s.sets, durationSec: s.durationSec, prev: s.prev, planned, planDone };
}
/** Ostatni zakończony trening: nazwa, start, czas bez pauz, serie robocze, objętość, liczba rekordów. */
export function lastWorkout() {
  const w = finishedWorkouts()[0]; if (!w) return null;
  /* audyt 0.10: serie jak wszędzie (D3, store.workingSets), rekordy jak okno po treningu (E3, stats.prCount — liczba rekordów, nie serii) */
  return { id: w.id, name: w.templateName, startedAt: wallTs(w) /* J3: data w strefie startu */, durationSec: Math.round(workoutDurSec(w)), sets: workingSets(w), volume: volume(w), prs: prCount(w) };
}
/** „Pierwsze kroki” przy pustych szablonach (decyzja właściciela 09.10.2026): niezarchiwizowane szablony bez ćwiczeń, ostatnio zmieniany pierwszy —
 * krok 2 prowadzi do jego edycji zamiast „Najpierw utwórz szablon”. */
export const emptyTemplates = () => getState().templates.filter(x => !x.archived && !x.items.length).sort((a, b) => b.updatedAt - a.updatedAt);
/** „Pierwsze kroki” — widoczne do pierwszego zakończonego treningu. */
export function firstSteps() {
  if (finishedWorkouts().length) return null;
  return { template: getState().templates.some(x => !x.archived && x.items.length), plan: hasPlan() };
}
