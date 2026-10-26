/*
 * Okno „Uczciwe zasady” i karta po imporcie (1.0, decyzja właściciela 25.10.2026; docs/monetyzacja.md): informacja o modelu dla użytkownika w stanie `free`.
 * Okno: raz, po ukończonym treningu na żywo, tylko gdy PAYWALL włączony i poziom dostępu `free` (stan niepewny bez zapamiętanego wyniku liczy się jak brak — nie pokazujemy).
 * Karta po imporcie CSV: za każdym razem po udanym imporcie, te same warunki poziomu. Żadna z tych funkcji nie dotyka treningów ani limitu dni.
 */
import { getState, save, flush } from '@/lib/store';
import { accessNow, paywallOn } from '@/lib/entitlement';
import type { Workout } from '@/lib/seed';

/** Czy poziom dostępu jest pewnie `free` (oferta ma sens tylko wtedy). */
export function offerAudience(now: number = Date.now()): boolean {
  if (!paywallOn()) return false;
  const v = accessNow(now); return v.level === 'free' && !v.silent;
}

/** Czy pokazać okno po zapisaniu treningu `w`: trening na żywo, jeszcze nie pokazane, użytkownik `free`; liczba ukończonych treningów na żywo ≥ 1. */
export function fairRulesDue(w: Workout, now: number = Date.now()): boolean {
  const st = getState(); if (st.seenFairRulesManifest === true || w.live !== true) return false;
  if (!st.workouts.some(x => x.live === true && x.finishedAt != null)) return false;
  return offerAudience(now);
}

/** Zapamiętuje, że okno zostało pokazane (zamknięcie dowolnym przyciskiem); idempotentne. */
export function markFairRulesSeen() {
  const st = getState(); if (st.seenFairRulesManifest === true) return;
  st.seenFairRulesManifest = true; save(); flush();
}
