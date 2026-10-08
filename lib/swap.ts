import { getState, visibleExercises, workoutsWith, finishedWorkouts, memoHist, locationById } from './store';
import { availability, capsOf, implsAt } from './equipment';
import { t, exName, locale, fold } from './i18n';
import { libExtraRevOf, LIB_EXTRA_REVS, catalogKey, isNiche, type Exercise, type Impl, type Location, type Workout } from './seed';

/*
 * E2 „Zamiana ćwiczenia w trakcie treningu” (docs/14) — ranking propozycji zamiennika. Czysta funkcja nad stanem (bez zapisu):
 * arkusz zamiany w treningu w toku i w edytorze historii oraz tabela D7 (tests/swap-top3.test.ts → docs/14a-e2-top3.md) liczą z tego samego miejsca.
 */

/** Wagi rankingu (docs/14 pkt 6). Propozycja z docs/13 A4 — NIE mają źródła w badaniach ani danych; decyzja P7 a (04.10.2026): start z nimi,
 * ocena na tabeli D7 przed wydaniem, korekty w tym samym commicie co nowa tabela. */
export const SWAP_WEIGHTS = { pattern: 3, muscle: 3, firstMuscle: 1, group: 1, secondary: 1, secondaryMax: 2, swapped: 4, history: 1 } as const;
/** Liczba propozycji w arkuszu (decyzja P7 a: 3). */
export const SWAP_TOP = 3;
/** Krok katalogu z pełną bazą (free-exercise-db, 05.10.2026) — przy remisie w rankingu po bibliotece przejrzanej przez właściciela. */
export const FULL_BASE_REV = 'katalog-2026-10-05';
/** Lista „Inne” w arkuszu zamiany: wiersze renderowane porcjami (pełna baza ~870 ćwiczeń, lista w ScrollView arkusza — bez wirtualizacji). */
export const SWAP_PAGE = 50;
/** Wzorce ruchu, które same nie świadczą o podobieństwie (liczą się tylko przy wspólnym mięśniu głównym). */
const WEAK_PATTERNS = new Set(['isolation', 'other', 'mobility']); /* audyt pełnej bazy (MEDIUM 1): rozciąganie nie jest „tym samym ruchem” bez wspólnej partii */

export type SwapReason = 'pattern' | 'muscle' | 'firstMuscle' | 'group' | 'secondary' | 'swapped' | 'history';
export interface SwapCandidate { exId: string; score: number; reasons: SwapReason[]; /** dostępne w miejscu (bez miejsca — zawsze) */ available: boolean; /** już jest w treningu (dopisek, nie blokuje) */ inWorkout: boolean; /** liczba sesji z tym ćwiczeniem (remis, „robione 12×”) */ sessions: number }
export interface SwapCtx { locationId?: string | null; /** pokaż także niedostępne w miejscu */ showAll: boolean; inWorkout: ReadonlySet<string>; /** edytor historii: liczniki tylko z sesji sprzed tej chwili */ before?: number }

/** „Wcześniej zamieniane”: A → (B → liczba bloków historii z swappedFrom = A). */
function swapCounts(ws: readonly Workout[]): Map<string, Map<string, number>> {
  const m = new Map<string, Map<string, number>>();
  for (const w of ws) for (const e of w.exercises) if (e.swappedFrom && e.swappedFrom !== e.exerciseId) { let x = m.get(e.swappedFrom); if (!x) m.set(e.swappedFrom, x = new Map()); x.set(e.exerciseId, (x.get(e.exerciseId) ?? 0) + 1); }
  return m;
}
const swapIndex = memoHist(() => swapCounts(finishedWorkouts()));

/** Punkty podobieństwa B do A (bez historii). Zwraca null, gdy B nie jest podobne (inny wzorzec i brak wspólnego mięśnia głównego). */
function similarity(a: Exercise, b: Exercise): { score: number; reasons: SwapReason[] } | null {
  const W = SWAP_WEIGHTS; const reasons: SwapReason[] = []; let score = 0;
  const shared = a.muscles.some(m => b.muscles.includes(m));
  const samePat = !!a.pattern && a.pattern === b.pattern && (!WEAK_PATTERNS.has(a.pattern) || shared);
  if (!samePat && !shared) return null;
  if (samePat) { score += W.pattern; reasons.push('pattern'); }
  if (shared) { score += W.muscle; reasons.push('muscle'); if (a.muscles[0] && a.muscles[0] === b.muscles[0]) { score += W.firstMuscle; reasons.push('firstMuscle'); } }
  if (a.group === b.group) { score += W.group; reasons.push('group'); }
  const sec = Math.min(W.secondaryMax, a.secondaryMuscles.filter(m => b.secondaryMuscles.includes(m)).length);
  if (sec) { score += sec * W.secondary; reasons.push('secondary'); }
  return { score, reasons };
}

/** Propozycje zamiany ćwiczenia `exId` od najlepszej (docs/14 pkt 6). Kandydaci: widoczne ćwiczenia z tą samą metryką, podobne (wzorzec
 * ruchu albo mięsień główny); przy miejscu i `showAll` false — tylko dostępne w miejscu. Remis: więcej sesji, potem nazwa w języku interfejsu. */
export function swapCandidates(exId: string, ctx: SwapCtx): SwapCandidate[] {
  const a = getState().exercises.find(e => e.id === exId); if (!a) return [];
  const loc = locationById(ctx.locationId); const caps = loc ? capsOf(loc) : null;
  const before = ctx.before;
  const swaps = (before == null ? swapIndex() : swapCounts(finishedWorkouts().filter(w => w.startedAt < before))).get(a.id);
  const sessionsOf = (id: string) => { const ws = workoutsWith(id); return before == null ? ws.length : ws.filter(w => w.startedAt < before).length; };
  const out: SwapCandidate[] = [];
  for (const b of visibleExercises()) {
    if (b.id === a.id || (b.metric ?? 'weight_reps') !== (a.metric ?? 'weight_reps')) continue;
    const available = loc ? availability(b, loc, caps!).ok : true; if (!available && !ctx.showAll) continue;
    const sim = similarity(a, b); if (!sim) continue;
    let { score } = sim; const reasons = [...sim.reasons];
    if ((swaps?.get(b.id) ?? 0) > 0) { score += SWAP_WEIGHTS.swapped; reasons.push('swapped'); }
    const sessions = sessionsOf(b.id); if (sessions > 0) { score += SWAP_WEIGHTS.history; reasons.push('history'); }
    out.push({ exId: b.id, score, reasons, available, inWorkout: ctx.inWorkout.has(b.id), sessions });
  }
  const name = new Map(out.map(c => [c.exId, exName(getState().exercises.find(e => e.id === c.exId))]));
  /* decyzja właściciela 04.10.2026 (przegląd D7): remis rozstrzyga najpierw ten sam sprzęt co oryginał (sztanga → sztanga), potem sesje i nazwa */
  const sameEq = new Map(out.map(c => [c.exId, getState().exercises.find(e => e.id === c.exId)?.equipment === a.equipment ? 1 : 0]));
  /* pełna baza (05.10.2026, ~870): przy remisie punktów najpierw biblioteka przejrzana przez właściciela (kroki katalogu 04.10 i własne
   * ćwiczenia), dopiero potem pełna baza (krok 05.10) — inaczej remisy „ten sam sprzęt” i nazwa wypychały znane ćwiczenia rzadkimi wariantami
   * (Bench Press with Chains przed Bench Press (hantle)). W obrębie każdej z tych dwóch części — decyzja D7: ten sam sprzęt, sesje, nazwa. */
  const step = new Map(out.map(c => { const b = getState().exercises.find(e => e.id === c.exId); const k = catalogKey(b); const r = k ? libExtraRevOf(k) : undefined; /* E2 (audyt 0.10): krok katalogu po kluczu */ return [c.exId, r ? LIB_EXTRA_REVS.indexOf(r) : -1]; }));
  const full = LIB_EXTRA_REVS.indexOf(FULL_BASE_REV); const niche = new Set(out.filter(c => { const b = getState().exercises.find(e => e.id === c.exId); return !!b && isNiche(b); }).map(c => c.exId));
  /* research biblioteki (decyzja 09.10.2026, wariant B): ćwiczenia niszowe na końcu remisu — po bibliotece przejrzanej i reszcie podstawowych */
  const tier = (id: string) => niche.has(id) ? 2 : full >= 0 && step.get(id)! >= full ? 1 : 0;
  return out.sort((x, y) => y.score - x.score || tier(x.exId) - tier(y.exId) || sameEq.get(y.exId)! - sameEq.get(x.exId)! || y.sessions - x.sessions || step.get(x.exId)! - step.get(y.exId)! || name.get(x.exId)!.localeCompare(name.get(y.exId)!, locale()));
}

/** Lista „Inne” w arkuszu zamiany: dokładne trafienie nazwy (w języku interfejsu albo kanonicznej) na początku, reszta alfabetycznie
 * (audyt pełnej bazy, LOW 4: przy porcjach SWAP_PAGE dokładne trafienie nie może utknąć za „Pokaż więcej”). `ql` — zapytanie po fold(). */
export function sortOthers(list: readonly Exercise[], ql: string): Exercise[] {
  const exact = (e: Exercise) => !!ql && (fold(e.name) === ql || fold(exName(e)) === ql);
  return [...list].sort((x, y) => Number(exact(y)) - Number(exact(x)) || exName(x).localeCompare(exName(y), locale()));
}
/** Nazwa przyrządu (decyzja 8c) do arkusza i tabeli D7. */
export function implLabel(i: Impl): string {
  switch (i) {
    case 'barbell': return t('sztanga'); case 'ez_bar': return t('gryf łamany'); case 'trap_bar': return t('trap bar');
    case 'dumbbell': return t('hantle'); case 'kettlebell': return t('kettlebell'); case 'cable': return t('wyciąg');
    case 'electric': return t('stacja'); case 'machine': return t('maszyna');
  }
}
/** D5: przyrządy w miejscu inne niż bieżący (docs/14 pkt 3.7.1). Bez miejsca — pusto. */
export function otherImpls(ex: Exercise, loc: Location | null | undefined, cur: Impl | null | undefined): Impl[] {
  return implsAt(ex, loc).filter(i => i !== cur);
}

/** Linijka „dlaczego” pod propozycją: „ten sam ruch · hantle · robione 12×” (jedno źródło dla arkusza i tabeli D7). */
export function reasonText(c: SwapCandidate): string {
  const b = getState().exercises.find(e => e.id === c.exId);
  return [c.reasons.includes('pattern') ? t('ten sam ruch') : c.reasons.includes('muscle') ? t('te same mięśnie') : '',
    b ? t(b.equipment) : '',
    c.reasons.includes('swapped') ? t('wcześniej zamieniane') : '',
    c.sessions > 0 ? t('robione {n}×', { n: c.sessions }) : ''].filter(Boolean).join(' · ');
}

/** Cel arkusza: 'active:<id bloku>' (trening w toku, W1) albo 'edit:<klucz szkicu>:<id bloku>' (edytor historii, D6). */
export function parseSwapTarget(target: string): { kind: 'active'; blockId: string } | { kind: 'edit'; key: string; blockId: string } | null {
  if (target.startsWith('active:')) return { kind: 'active', blockId: target.slice(7) };
  if (target.startsWith('edit:')) { const r = target.slice(5); const i = r.lastIndexOf(':'); return i > 0 ? { kind: 'edit', key: r.slice(0, i), blockId: r.slice(i + 1) } : null; }
  return null;
}
