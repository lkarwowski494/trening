/*
 * Podobieństwo ćwiczeń do zamiany (E2, docs/14 pkt 6) — czysta część rankingu zamiennika, bez stanu aplikacji: używa jej lib/swap.ts (arkusz zamiany w treningu)
 * i eksport danych dla strony z biblioteką ćwiczeń (scripts/strona/eksport.mjs), więc propozycje zamienników na stronie i w aplikacji liczą się tym samym kodem.
 */
import type { Exercise } from './seed';

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

