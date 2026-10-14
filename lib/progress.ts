import { getState, getRev, exById, tplRows, workCount, setVolume, startableItem, previousBlockFor, occurrence, occurrences, startLocationId, implAtLoc, srcSetAt, isBW, isDeloadWeek } from '@/lib/store';
import { dayKeyOf, addDays, dayStatus, pending } from '@/lib/plan';
import { thisMonday, setsSplitByMuscle, volumeByMuscle, setsGoal } from '@/lib/stats';
import { addSplitSets, emptySplit, mergeSplits, splitTotals, type SetSplit } from '@/lib/setSplit';
import { periodRange, totals } from '@/lib/period';
import { t } from '@/lib/i18n';
import { MUSCLES, hasReps, hasWeight, type Muscle, type Template, type WSet } from '@/lib/seed';

/*
 * „Progresja” (docs/22 krok 3 pkt 5; decyzja właściciela 11.10.2026, P8 B): porównania tygodnia i miesiąca, zawsze najpierw objętość, potem serie, per partia.
 * To RACHUNEK z planu i historii użytkownika, nie twierdzenie dziedzinowe (szczebel 1 — bez oceny „dobrze / źle”):
 *  - tydzień bieżący = wykonane (historia) + zaplanowane z szablonów na dni od dziś do niedzieli, które jeszcze czekają (dayStatus → pending);
 *  - zaplanowany szablon liczymy wierszami: serie robocze jak w treningu (workCount), objętość jak wszędzie (setVolume) z wartości wiersza szablonu;
 *    wiersz bez ciężaru albo powtórzeń bierze brakującą wartość z „Poprzednio” (ostatnie wykonanie tego wiersza — store.previousBlockFor, ten sam dobór
 *    co przy starcie treningu); bez „Poprzednio” seria liczy się do serii, ale nie do objętości (`unknownSets` → kafelek „≥ …”, decyzja właściciela 14.10.2026);
 *  - objętość i serie wykonane — te same funkcje co Postępy i podsumowanie (period.totals, stats.setsSplitByMuscle, stats.volumeByMuscle);
 *  - miesiąc: bieżący (do dziś) z poprzednim w tym samym zakresie dni miesiąca (uproszczenie nazwane — pełny poprzedni miesiąc zawyżyłby różnicę).
 * Partia „wzrosła”, gdy jej objętość jest większa niż w okresie porównawczym (bez progów — progu nie wolno zgadywać).
 */
export type CmpKind = 'week' | 'prevWeek' | 'month';
type Rec = Record<string, number>;
/** Serie i objętość razem z podziałem na partie (partia główna 1, pomocnicza 0,5 — jak „Serie per partia”). */
export type Part = { workouts: number; sets: number; volume: number; bySets: Rec; byVolume: Rec; /** serie per partia z podziałem na bezpośrednie i pośrednie (bySets = ich `total`) */ bySplit: Record<string, SetSplit> };
export type Planned = Part & { /** serie robocze, których objętości nie da się policzyć (brak wartości w szablonie i „Poprzednio”) */ unknownSets: number };
const emptyPart = (): Part => ({ workouts: 0, sets: 0, volume: 0, bySets: {}, byVolume: {}, bySplit: {} });
const add = (a: Rec, k: string, v: number) => { a[k] = (a[k] ?? 0) + v; };

/** Oszacowanie jednego szablonu: serie i objętość z wierszy (wartość wiersza, a przy braku — „Poprzednio”). */
export function estimateTemplate(tpl: Template): Planned {
  const out: Planned = { ...emptyPart(), unknownSets: 0 }; const loc = startLocationId(tpl.locationId);
  tpl.items.forEach((it, ii) => {
    if (!startableItem(it)) return; const ex = exById(it.exerciseId)!; const rows = tplRows(it); const n = workCount(rows.map(r => r.kind));
    const m = ex.metric ?? 'weight_reps'; const counted = hasWeight(m) && hasReps(m); const bw = isBW(ex);
    const impl = implAtLoc(ex, loc);
    const prev = counted ? previousBlockFor(it.exerciseId, occurrence(tpl.items, ii), occurrences(tpl.items, it.exerciseId), it.id, tpl.id, impl) : null;
    const src = prev ? prev.sets.filter(x => x.kind !== 'drop') : []; let j = 0; let vol = 0; let unknown = 0;
    for (const r of rows) {
      if (r.kind === 'warmup') continue;
      const p = r.kind === 'drop' ? null : srcSetAt(src, j++); /* drop set bez własnych wartości — nieznany (jak przy starcie: pusty) */
      if (!counted) continue;
      const w = r.weight !== '' ? r.weight : p ? (bw ? p.addKg : p.weight) : ''; const reps = r.reps !== '' ? r.reps : p ? p.reps : '';
      if (reps === '' || (!bw && w === '')) { unknown++; continue; }
      vol += setVolume(ex, { kind: r.kind, warmup: false, done: true, weight: bw ? '' : w, addKg: bw ? w : '', reps } as WSet, impl);
    }
    out.sets += n; out.volume += vol; out.unknownSets += unknown;
    addSplitSets(out.bySplit, ex.muscles ?? [], ex.secondaryMuscles ?? [], n);
    (ex.muscles ?? []).forEach(mu => { add(out.byVolume, mu, vol); });
    (ex.secondaryMuscles ?? []).forEach(mu => { add(out.byVolume, mu, vol * 0.5); });
  });
  out.bySets = splitTotals(out.bySplit);
  return out;
}

/** Zaplanowane, jeszcze niezrobione treningi od dziś do niedzieli bieżącego tygodnia (stan dnia jak w kalendarzu i na pasku). */
export function plannedRest(now = Date.now()): Planned {
  const out: Planned = { ...emptyPart(), unknownSets: 0 }; const today = dayKeyOf(now); const sun = addDays(dayKeyOf(thisMonday(0, new Date(now))), 6);
  for (let k = today; k <= sun; k = addDays(k, 1)) {
    const ds = dayStatus(k, today); if (!ds.templateId || !pending(ds)) continue;
    const tpl = getState().templates.find(x => x.id === ds.templateId && !x.archived); if (!tpl) continue;
    const e = estimateTemplate(tpl); if (!e.sets) continue;
    out.workouts++; out.sets += e.sets; out.volume += e.volume; out.unknownSets += e.unknownSets;
    for (const [mu, v] of Object.entries(e.byVolume)) add(out.byVolume, mu, v); out.bySplit = mergeSplits(out.bySplit, e.bySplit);
  }
  out.bySets = splitTotals(out.bySplit);
  return out;
}

const doneIn = (start: number, end: number): Part => { const tt = totals(start, end); const bySplit = setsSplitByMuscle(start, end); return { workouts: tt.workouts, sets: tt.sets, volume: tt.volume, bySets: splitTotals(bySplit), byVolume: volumeByMuscle(start, end), bySplit }; };

export type MuscleRow = { muscle: Muscle; doneSets: number; plannedSets: number; prevSets: number; doneVolume: number; plannedVolume: number; prevVolume: number; setsUp: boolean; volumeUp: boolean };
/** Wiersz paska serii per partia wraz z celem tygodniowym tej partii (ręcznym albo automatycznym). */
export type SetRow = { part: Muscle; doneSets: number; plannedSets: number; prevSets: number; setsUp: boolean; goal: number; /** wykonane z podziałem bezpośrednio / pośrednio (doneSets = doneSplit.total) */ doneSplit: SetSplit; /** zaplanowane z podziałem */ plannedSplit: SetSplit };
export type Comparison = {
  kind: CmpKind; /** zakres porównywanego okresu [start, end) */ cur: { start: number; end: number }; prev: { start: number; end: number };
  done: Part; planned: Planned | null; before: Part;
  /** wykonane + zaplanowane (dolne ograniczenie objętości, gdy `unknown`) */ total: { workouts: number; sets: number; volume: number };
  unknown: boolean; volumePct: number | null; setsPct: number | null; volumeDelta: number; setsDelta: number;
  rows: MuscleRow[]; /** serie per partia z celem — paski serii (kolejność: najwięcej serii, remis wg MUSCLES) */ setRows: SetRow[]; improved: Muscle[]; deloadCur: boolean; deloadPrev: boolean;
};
const pct = (cur: number, prev: number): number | null => (prev > 0 ? Math.round(((cur - prev) / prev) * 100) : null);
/** Epsilon: różnica objętości poniżej 1e-6 to ten sam wynik (błąd zmiennoprzecinkowy), nie wzrost. */
const UP_EPS = 1e-6;

/** Porównanie: 'week' — bieżący tydzień (wykonane + zaplanowane) z poprzednim; 'prevWeek' — poprzedni z tym sprzed dwóch tygodni (tylko wykonane);
 * 'month' — bieżący miesiąc do dziś z poprzednim w tym samym zakresie dni (tylko wykonane). */
export function compare(kind: CmpKind, now = Date.now()): Comparison {
  const d = new Date(now); let cur: { start: number; end: number }; let prev: { start: number; end: number };
  if (kind === 'month') {
    const a = periodRange('month', 0, d); const b = periodRange('month', -1, d); const span = d.getDate(); /* dni od 1. do dziś włącznie */
    cur = { start: a.start, end: new Date(d.getFullYear(), d.getMonth(), 1 + span).getTime() };
    prev = { start: b.start, end: Math.min(b.end, new Date(d.getFullYear(), d.getMonth() - 1, 1 + span).getTime()) };
  } else {
    const o = kind === 'week' ? 0 : -1; cur = periodRange('week', o, d); prev = periodRange('week', o - 1, d);
  }
  const done = doneIn(cur.start, cur.end); const before = doneIn(prev.start, prev.end); const planned = kind === 'week' ? plannedRest(now) : null;
  const total = { workouts: done.workouts + (planned?.workouts ?? 0), sets: done.sets + (planned?.sets ?? 0), volume: done.volume + (planned?.volume ?? 0) };
  const rows: MuscleRow[] = MUSCLES.map(mu => {
    const r = { muscle: mu, doneSets: done.bySets[mu] ?? 0, plannedSets: planned?.bySets[mu] ?? 0, prevSets: before.bySets[mu] ?? 0,
      doneVolume: done.byVolume[mu] ?? 0, plannedVolume: planned?.byVolume[mu] ?? 0, prevVolume: before.byVolume[mu] ?? 0 };
    return { ...r, setsUp: r.doneSets + r.plannedSets > r.prevSets + UP_EPS, volumeUp: r.doneVolume + r.plannedVolume > r.prevVolume + UP_EPS };
  }).filter(r => r.doneSets + r.plannedSets + r.prevSets + r.doneVolume + r.plannedVolume + r.prevVolume > 0)
    .sort((x, y) => (y.doneVolume + y.plannedVolume) - (x.doneVolume + x.plannedVolume) || (y.doneSets + y.plannedSets) - (x.doneSets + x.plannedSets)); /* najpierw objętość */
  const setRows: SetRow[] = MUSCLES.map(p => { const r = { part: p, doneSets: done.bySets[p] ?? 0, plannedSets: planned?.bySets[p] ?? 0, prevSets: before.bySets[p] ?? 0 };
    return { ...r, setsUp: r.doneSets + r.plannedSets > r.prevSets + UP_EPS, goal: setsGoal(p), doneSplit: done.bySplit[p] ?? emptySplit(), plannedSplit: planned?.bySplit[p] ?? emptySplit() }; })
    .filter(r => r.doneSets + r.plannedSets + r.prevSets > 0).sort((x, y) => (y.doneSets + y.plannedSets) - (x.doneSets + x.plannedSets)); /* sort stabilny: remis zostaje w kolejności MUSCLES */
  return { kind, cur, prev, done, planned, before, total, unknown: (planned?.unknownSets ?? 0) > 0, volumePct: pct(total.volume, before.volume), setsPct: pct(total.sets, before.sets),
    volumeDelta: total.volume - before.volume, setsDelta: total.sets - before.sets, rows, setRows, improved: rows.filter(r => r.volumeUp).map(r => r.muscle),
    deloadCur: kind !== 'month' && isDeloadWeek(cur.start), deloadPrev: kind !== 'month' && isDeloadWeek(prev.start) };
}

/** Pamięć podręczna do następnej zmiany stanu (store.getRev) i dnia — ekran główny wywołuje to przy każdym odświeżeniu (jak weekStrip, PERF-04). */
const memo = new Map<CmpKind, { key: string; st: object; v: Comparison }>();
export function compareCached(kind: CmpKind, now = Date.now()): Comparison {
  const key = `${getRev()}|${dayKeyOf(now)}`; const st = getState(); const m = memo.get(kind); if (m && m.key === key && m.st === st) return m.v;
  const v = compare(kind, now); memo.set(kind, { key, st, v }); return v;
}

/** Zmiana w procentach; pusty poprzedni okres (`null`) = „brak poprzedniego okresu” (jedno sformułowanie dla objętości i serii — decyzja właściciela 14.10.2026). */
export const pctText = (p: number | null): string => (p === null ? t('brak poprzedniego okresu') : p > 0 ? `+${p}%` : p < 0 ? `−${Math.abs(p)}%` : '0%');
/** Liczba ze znakiem (różnica bezwzględna w szczegółach Progresji). */
export const signedNum = (n: number, f: (v: number) => string = String): string => (n > 0 ? `+${f(n)}` : n < 0 ? `−${f(Math.abs(n))}` : f(0));
