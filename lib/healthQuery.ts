import type { Workout } from './seed';
import { getState, noClock, mondayKey, localISODate } from './store';
import { hk, type HK, type HKFilter, type HKSource, type HKWorkoutProxy } from './hkModule';
import { HK_STEP_TYPE, HK_HEART_RATE_TYPE, HK_ACTIVE_ENERGY_TYPE, HK_UNITS, WATCH_MATCH_TYPES, STEPS_AVG_DAYS, HEALTH_UUID_WATCH, WATCH_RECONCILE_WINDOW_DAYS,
  parseWorkout, isWatchCandidate, matchWatchWorkouts, otherActivities, startingIn, dayBounds, stepsByDay, avgDailySteps, watchStatsFrom, overlapMs,
  type HkWorkout, type SessionSpan, type WatchStats } from './healthRead';

/*
 * Zapytania do Apple Health (0.16.0, docs/29): kroki dnia i tygodnia, treningi, tętno i aktywne kcal dopasowanego treningu z zegarka. Wszystko tylko do wyświetlenia —
 * wyniki żyją w pamięci ekranu (nie w stanie, kopii ani CSV; niezmiennik docs/29 rozdz. 9). Błąd zapytania albo brak modułu = „brak danych” (bez alertu, bez logów
 * z danymi). Uchwyty treningów (WorkoutProxy) są zwalniane `dispose()` po odczycie (docs/28). Czysta logika: lib/healthRead.ts.
 */
export const readEnabled = (): boolean => getState().settings.healthRead === true;
const dayKey = (ts: number) => localISODate(new Date(ts));
const ownSource = (h: HK): HKSource | undefined => { try { const s = h.currentAppSource?.(); return s && typeof s === 'object' ? s : undefined; } catch { return undefined; } };
const ownIdSet = (): Set<string> => { const st = getState(); return new Set([...st.workouts.map(w => w.id), ...(st.active ? [st.active.id] : [])]); };
/** Przedziały zakończonych sesji z godziną (bez „godzina nieznana”). */
export const spansOf = (workouts: readonly Workout[]): SessionSpan[] => workouts.filter(w => w.finishedAt != null && !noClock(w)).map(w => ({ id: w.id, start: w.startedAt, end: w.finishedAt as number }));
/** Sesje z historii, których przedział ma część wspólną z [from, to]. */
export const sessionSpans = (from: number, to: number): SessionSpan[] => spansOf(getState().workouts).filter(s => overlapMs(s.start, s.end, from, to) > 0);

interface Found { list: HkWorkout[]; proxies: Map<string, HKWorkoutProxy>; ownBundle: string | null; dispose: () => void }
/** Treningi ze Zdrowia w przedziale (nakładające się z nim), bez wpisów tej aplikacji (filtr źródła + sprawdzenie w JS); `strength` — tylko rodzaje z WATCH_MATCH_TYPES. */
async function findWorkouts(h: HK, from: number, to: number, strength: boolean): Promise<Found | null> {
  if (!h.queryWorkoutSamples) return null;
  const own = ownSource(h);
  const filter: HKFilter = { date: { startDate: new Date(from), endDate: new Date(to) },
    ...(strength ? { OR: WATCH_MATCH_TYPES.map(t => ({ workoutActivityType: t })) } : {}), ...(own ? { NOT: [{ sources: [own] }] } : {}) };
  const raw = await h.queryWorkoutSamples({ filter, limit: 0, ascending: true });
  const proxies = new Map<string, HKWorkoutProxy>(); const list: HkWorkout[] = [];
  for (const p of raw ?? []) { const w = parseWorkout(p); if (w) { list.push(w); proxies.set(w.uuid, p); } }
  const dispose = () => { for (const p of raw ?? []) { try { p.dispose?.(); } catch { /* zwolnienie uchwytu — bez znaczenia dla wyniku */ } } };
  return { list, proxies, ownBundle: own?.bundleIdentifier ?? null, dispose };
}

/** Kroki dni od `fromKey` do `toKey` włącznie (klucze RRRR-MM-DD, dni wg strefy telefonu); HealthKit sam scala telefon i zegarek. Błąd / brak modułu → null. */
export async function queryStepsByDay(fromKey: string, toKey: string): Promise<Map<string, number> | null> {
  const h = hk(); if (!h?.queryStatisticsCollectionForQuantity) return null;
  try {
    const from = dayBounds(fromKey).from, to = dayBounds(toKey).to; if (!Number.isFinite(from) || !Number.isFinite(to) || to <= from) return null;
    const items = await h.queryStatisticsCollectionForQuantity(HK_STEP_TYPE, ['cumulativeSum'], new Date(from), { day: 1 }, { filter: { date: { startDate: new Date(from), endDate: new Date(to) } }, unit: HK_UNITS.steps });
    return stepsByDay(items, dayKey);
  } catch { return null; }
}

export interface DayHealth { steps: number | null; activities: HkWorkout[] }
/** Blok „Apple Health” jednego dnia: kroki (null = brak danych) i inne aktywności (bez własnych wpisów i bez dopasowanych do sesji; aktywność z północy liczy się do dnia startu). */
export async function loadDay(key: string): Promise<DayHealth> {
  const out: DayHealth = { steps: null, activities: [] }; const h = hk(); if (!h) return out;
  const { from, to } = dayBounds(key); if (!Number.isFinite(from)) return out;
  const steps = await queryStepsByDay(key, key); if (steps?.has(key)) out.steps = steps.get(key) ?? null;
  let f: Found | null = null;
  try {
    f = await findWorkouts(h, from, to, false);
    if (f) {
      const cands = f.list.filter(w => isWatchCandidate(w, ownIdSet(), f!.ownBundle)); const lo = Math.min(from, ...cands.map(c => c.start)), hi = Math.max(to, ...cands.map(c => c.end));
      const matched = new Set(matchWatchWorkouts(sessionSpans(lo, hi), cands).values());
      out.activities = startingIn(otherActivities(f.list, ownIdSet(), f.ownBundle, matched), from, to);
    }
  } catch { out.activities = []; } finally { f?.dispose(); }
  return out;
}

export interface WeekHealth { avgSteps: number | null; others: number }
/** Linia tygodnia: średnia dzienna kroków z ostatnich STEPS_AVG_DAYS pełnych dni (bez dzisiejszego) i liczba innych aktywności od poniedziałku bieżącego tygodnia. */
export async function loadWeek(now = Date.now()): Promise<WeekHealth> {
  const out: WeekHealth = { avgSteps: null, others: 0 }; const h = hk(); if (!h) return out;
  const t = new Date(now); const keys = Array.from({ length: STEPS_AVG_DAYS }, (_, i) => localISODate(new Date(t.getFullYear(), t.getMonth(), t.getDate() - (i + 1)))).reverse();
  const steps = await queryStepsByDay(keys[0], keys[keys.length - 1]); if (steps) out.avgSteps = avgDailySteps(steps, keys);
  let f: Found | null = null;
  try {
    const from = dayBounds(mondayKey(now)).from; f = await findWorkouts(h, from, now, false);
    if (f) {
      const cands = f.list.filter(w => isWatchCandidate(w, ownIdSet(), f!.ownBundle)); const lo = Math.min(from, ...cands.map(c => c.start)), hi = Math.max(now, ...cands.map(c => c.end));
      const matched = new Set(matchWatchWorkouts(sessionSpans(lo, hi), cands).values());
      out.others = startingIn(otherActivities(f.list, ownIdSet(), f.ownBundle, matched), from, now + 1).length;
    }
  } catch { out.others = 0; } finally { f?.dispose(); }
  return out;
}

/** Dopasowania sesja → trening z zegarka dla podanych sesji (jedno zapytanie o treningi siłowe innych źródeł w ich przedziale; w dopasowaniu biorą udział WSZYSTKIE
 * sesje nakładające się na kandydatów, żeby jeden trening z zegarka nie trafił do dwóch sesji). null = nie wiadomo (brak modułu, błąd) — nic wtedy nie zmieniamy. */
async function matchFor(h: HK, sessions: readonly Workout[], keep: boolean): Promise<{ matches: Map<string, string>; found: Found } | null> {
  const spans = spansOf(sessions); if (!spans.length) return null;
  const from = Math.min(...spans.map(s => s.start)), to = Math.max(...spans.map(s => s.end));
  let f: Found | null = null;
  try {
    f = await findWorkouts(h, from, to, true); if (!f) return null;
    const cands = f.list.filter(w => isWatchCandidate(w, ownIdSet(), f!.ownBundle));
    const lo = Math.min(from, ...cands.map(c => c.start)), hi = Math.max(to, ...cands.map(c => c.end));
    const all = sessionSpans(lo, hi); for (const s of spans) if (!all.some(a => a.id === s.id)) all.push(s);
    const matches = matchWatchWorkouts(all, cands); const found = f;
    if (!keep) { f.dispose(); }
    return { matches, found };
  } catch { f?.dispose(); return null; }
}
/** Czy do sesji pasuje trening z zegarka (reguła z lib/healthRead). null = nie wiadomo. */
export async function hasWatchMatch(w: Workout): Promise<boolean | null> {
  const h = hk(); if (!h || w.finishedAt == null || noClock(w)) return null;
  const r = await matchFor(h, [w], false); return r ? r.matches.has(w.id) : null;
}
/** Które z podanych sesji mają trening z zegarka: id sesji → uuid treningu; null = nie wiadomo. */
export async function matchesFor(sessions: readonly Workout[]): Promise<Map<string, string> | null> {
  const h = hk(); if (!h) return null; const r = await matchFor(h, sessions, false); return r ? r.matches : null;
}
/** Sesje z własną kopią w Zdrowiu (UUID albo znacznik zapisu, nie 'watch'), zakończone, z godziną i — gdy ustawione — w oknie WATCH_RECONCILE_WINDOW_DAYS. */
export function ownCopySessions(now = Date.now()): Workout[] {
  const lim = WATCH_RECONCILE_WINDOW_DAYS == null ? -Infinity : now - WATCH_RECONCILE_WINDOW_DAYS * 864e5;
  return getState().workouts.filter(w => !!w.healthUUID && w.healthUUID !== HEALTH_UUID_WATCH && w.finishedAt != null && !noClock(w) && (w.finishedAt as number) >= lim);
}

/** Tętno śr./maks. i aktywne kcal z treningu z zegarka dopasowanego do sesji; null = brak dopasowania, brak modułu albo błąd (ekran nic nie pokazuje). */
export async function loadWatchStats(w: Workout): Promise<WatchStats | null> {
  const h = hk(); if (!h || w.finishedAt == null || noClock(w)) return null;
  const r = await matchFor(h, [w], true); if (!r) return null;
  try {
    const uuid = r.matches.get(w.id); const p = uuid ? r.found.proxies.get(uuid) : undefined; if (!p) return null;
    const stat = async (type: string, unit: string) => { try { return await p.getStatistic?.(type, unit); } catch { return undefined; } };
    const [hr, en] = await Promise.all([stat(HK_HEART_RATE_TYPE, HK_UNITS.heartRate), stat(HK_ACTIVE_ENERGY_TYPE, HK_UNITS.energy)]);
    const te = p.totalEnergyBurned; const total = te && (te.unit === undefined || te.unit === HK_UNITS.energy) ? te.quantity : null;
    return watchStatsFrom(hr, en, total);
  } catch { return null; } finally { r.found.dispose(); }
}
