/*
 * Podobieństwo ćwiczeń do zamiany (E2, docs/14 pkt 6) — czysta część rankingu zamiennika, bez stanu aplikacji: używa jej lib/swap.ts (arkusz zamiany w treningu)
 * i eksport danych dla strony z biblioteką ćwiczeń (scripts/strona/eksport.mjs), więc propozycje zamienników na stronie i w aplikacji liczą się tym samym kodem.
 */
import { libExtraRevOf, LIB_EXTRA_REVS, catalogKey, isNiche, type Exercise } from './seed';

/** Krok katalogu z pełną bazą (free-exercise-db, 05.10.2026) — przy remisie w rankingu po bibliotece przejrzanej przez właściciela. */
export const FULL_BASE_REV = 'katalog-2026-10-05';

/** Wagi rankingu (docs/14 pkt 6). Propozycja z docs/13 A4 — NIE mają źródła w badaniach ani danych; decyzja P7 a (04.10.2026): start z nimi,
 * ocena na tabeli D7 przed wydaniem, korekty w tym samym commicie co nowa tabela. */
export const SWAP_WEIGHTS = { pattern: 3, muscle: 3, firstMuscle: 1, group: 1, secondary: 1, secondaryMax: 2, swapped: 4, history: 1 } as const;
/** Wzorce ruchu, które same nie świadczą o podobieństwie (liczą się tylko przy wspólnym mięśniu głównym). */
const WEAK_PATTERNS = new Set(['isolation', 'other', 'mobility']); /* audyt pełnej bazy (MEDIUM 1): rozciąganie nie jest „tym samym ruchem” bez wspólnej partii */

export type SwapReason = 'pattern' | 'muscle' | 'firstMuscle' | 'group' | 'secondary' | 'swapped' | 'history';

/** Punkty podobieństwa B do A (bez historii). Zwraca null, gdy B nie jest podobne (inny wzorzec i brak wspólnego mięśnia głównego). */
export function similarity(a: Exercise, b: Exercise): { score: number; reasons: SwapReason[] } | null {
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


/**
 * Kolejność propozycji zamiany od najlepszej (docs/14 pkt 6): punkty, potem remisy — część katalogu (biblioteka przejrzana przed pełną bazą i niszowymi), ten sam sprzęt co oryginał,
 * liczba sesji, krok katalogu, nazwa w języku interfejsu (`compare` = collator języka). Czysta: lib/swap.ts podaje stan użytkownika, strona z biblioteką — profil nowego użytkownika.
 */
export function orderSwaps<T extends { exId: string; score: number; sessions: number }>(rows: T[], a: Pick<Exercise, 'equipment'>, get: (id: string) => Exercise | undefined, nameOf: (id: string) => string, compare: (x: string, y: string) => number): T[] {
  const name = new Map(rows.map(c => [c.exId, nameOf(c.exId)]));
  /* decyzja właściciela 04.10.2026 (przegląd D7): remis rozstrzyga najpierw ten sam sprzęt co oryginał (sztanga → sztanga), potem sesje i nazwa */
  const sameEq = new Map(rows.map(c => [c.exId, get(c.exId)?.equipment === a.equipment ? 1 : 0]));
  /* pełna baza (05.10.2026, ~870): przy remisie punktów najpierw biblioteka przejrzana przez właściciela (kroki katalogu 04.10 i własne
   * ćwiczenia), dopiero potem pełna baza (krok 05.10) — inaczej remisy „ten sam sprzęt” i nazwa wypychały znane ćwiczenia rzadkimi wariantami
   * (Bench Press with Chains przed Bench Press (hantle)). W obrębie każdej z tych dwóch części — decyzja D7: ten sam sprzęt, sesje, nazwa. */
  const step = new Map(rows.map(c => { const k = catalogKey(get(c.exId)); const r = k ? libExtraRevOf(k) : undefined; /* E2 (audyt 0.10): krok katalogu po kluczu */ return [c.exId, r ? LIB_EXTRA_REVS.indexOf(r) : -1]; }));
  const full = LIB_EXTRA_REVS.indexOf(FULL_BASE_REV); const niche = new Set(rows.filter(c => { const b = get(c.exId); return !!b && isNiche(b); }).map(c => c.exId));
  /* research biblioteki (decyzja 09.10.2026, wariant B): ćwiczenia niszowe na końcu remisu — po bibliotece przejrzanej i reszcie podstawowych */
  const tier = (id: string) => niche.has(id) ? 2 : full >= 0 && step.get(id)! >= full ? 1 : 0;
  return rows.sort((x, y) => y.score - x.score || tier(x.exId) - tier(y.exId) || sameEq.get(y.exId)! - sameEq.get(x.exId)! || y.sessions - x.sessions || step.get(x.exId)! - step.get(y.exId)! || compare(name.get(x.exId)!, name.get(y.exId)!));
}
