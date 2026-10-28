/*
 * Prośba o ocenę w działaniu (docs/26; decyzja właściciela 11.10.2026: B+A, N = 5, 14 dni, 1 na wersję; bez linku w Ustawieniach): klej między bramką z lib/review.ts,
 * danymi aplikacji i modułem expo-store-review. Wywoływana WYŁĄCZNIE z ekranu podsumowania świeżo zakończonego treningu (nigdy z przycisku, nigdy w trakcie
 * treningu). Okno pokazuje wyłącznie system (StoreReview.requestReview) — aplikacja nie ma własnego okna oceny (App Review 5.6.1). Data i wersja ostatniej prośby:
 * Settings.reviewAsked (opcjonalne pole, bez zmiany SCHEMA_VERSION). System sam ogranicza prośby (3 na 365 dni), więc nie zakładamy „pokazano”.
 */
import Constants from 'expo-constants';
import { reviewDecision, ideaDecision, type ReviewBlockReason } from '@/lib/review';
import { STORE_TIMING } from '@/lib/products';
import { getState, saveCfg, finishedWorkouts, getPersistError } from '@/lib/store';
import { workoutPRs, prCountOf } from '@/lib/stats';
import { nextStartBlocked } from '@/lib/entitlement';
import { fairRulesDue } from '@/lib/fairrules';
import type { Workout } from '@/lib/seed';

interface ReviewModule { isAvailableAsync(): Promise<boolean>; requestReview(): Promise<void> }
function storeReview(): ReviewModule | null { try { return require('expo-store-review') as ReviewModule; } catch { return null; } }

/* Trening świeżo zakończony przez użytkownika (nie porzucony i zapisany sam, nie otwarty z historii) — ekran podsumowania zużywa znacznik raz. */
let justFinished: string | null = null;
export const markJustFinished = (id: string) => { justFinished = id; };
export function takeJustFinished(id: string): boolean { if (justFinished !== id) return false; justFinished = null; return true; }

export type ReviewRunResult = 'asked' | ReviewBlockReason | 'unavailable' | 'error';
/** Bramka prośby o ocenę dla świeżo zakończonego treningu — jedna funkcja dla prośby i dla reguły linku „Poproś o funkcję” (kolizja: ocena ma pierwszeństwo). */
function reviewGate(w: Workout, now: number): 'ask' | ReviewBlockReason {
  const st = getState();
  /* M1-audytor-generalny-018: liczą się tylko treningi na żywo — import i trening wstecz nie są doświadczeniem z aplikacją (docs/26 zasada 2) */
  return reviewDecision({ now, finishedWorkouts: finishedWorkouts().filter(x => x.live === true).length, justFinishedHasRecord: prCountOf(workoutPRs(w)) > 0, version: String(Constants.expoConfig?.version ?? ''),
    lastAsked: st.settings.reviewAsked ?? null, workoutActive: !!st.active, blocked: nextStartBlocked(now), ioBusy: false, lastFailed: !!getPersistError() });
}

/** Bramka + wywołanie systemowe. Data i wersja zapisują się PO wywołaniu modułu (system może nie pokazać okna — i tak liczymy odstęp; wyjątek modułu = prośby nie było). Brak modułu / TestFlight → 'unavailable', bez zapisu. */
export async function maybeRequestReview(w: Workout, now: number = Date.now()): Promise<ReviewRunResult> {
  const st = getState();
  const d = reviewGate(w, now);
  if (d !== 'ask') return d;
  const m = storeReview(); if (!m) return 'unavailable';
  try {
    if (!(await m.isAvailableAsync())) return 'unavailable'; /* TestFlight: brak okna (Apple) — nie zużywamy odstępu */
    await m.requestReview(); /* rzuca, gdy nie ma aktywnej sceny na pierwszym planie (expo-store-review 57.0.3) — wtedy prośby nie było i odstępu nie zużywamy */
    st.settings.reviewAsked = { at: now, version: String(Constants.expoConfig?.version ?? '') }; saveCfg(); return 'asked';
  } catch { return 'error'; }
}

/**
 * Link „Czego Ci brakuje? Poproś o funkcję” (decyzja właściciela 14.10.2026): czy pokazać go na podsumowaniu świeżo zakończonego treningu. Co N-ty trening (lib/review.ts IDEA);
 * gdy w tym samym treningu wypada prośba o ocenę (bramka 'ask'), ocena ma pierwszeństwo, a link czeka na następny trening. Pokazanie zapisuje licznik
 * (Settings.ideaShownAt) — zamknięcie linku (×) niczego już nie zmienia. Wołana raz na świeżo zakończony trening.
 */
export function ideaLinkDue(w: Workout, now: number = Date.now()): boolean {
  const st = getState(); const finished = finishedWorkouts().length;
  if (ideaDecision({ finishedWorkouts: finished, lastShownAt: st.settings.ideaShownAt ?? null, review: reviewGate(w, now) }) !== 'show') return false;
  st.settings.ideaShownAt = finished; saveCfg(); return true;
}

/**
 * Wejście z ekranu podsumowania (od 1.0 także okno „Uczciwe zasady” — lib/fairrules.ts, raz, tylko `free`): prośba o ocenę po krótkim opóźnieniu (karta rekordów zdąża się pokazać). Od M5 S1 (22.10.2026) ekran zakupu nie otwiera się
 * samoczynnie po pierwszym treningu (pokazuje się tylko przy starcie ponad limit i z Ustawień). Zwraca anulowanie opóźnionej prośby (wyjście z ekranu).
 */
export function onSummaryShown(w: Workout, onIdeaLink?: () => void, onFairRules?: () => void): () => void {
  if (!takeJustFinished(w.id)) return () => {};
  let off = false; let timer: ReturnType<typeof setTimeout> | null = null;
  void Promise.resolve().then(() => { if (off) return; if (onFairRules && fairRulesDue(w)) { onFairRules(); return; } /* M1-audytor-generalny-018: najwyżej jedno okno na podsumowaniu — „Uczciwe zasady” wyklucza link i prośbę o ocenę */ if (onIdeaLink && ideaLinkDue(w)) onIdeaLink(); timer = setTimeout(() => { void maybeRequestReview(w); }, STORE_TIMING.REVIEW_DELAY_MS); });
  return () => { off = true; if (timer) clearTimeout(timer); };
}
