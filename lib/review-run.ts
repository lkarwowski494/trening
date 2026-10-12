/*
 * Prośba o ocenę w działaniu (docs/26; decyzja właściciela 11.10.2026: B+A, N = 5, 14 dni, 1 na wersję; bez linku w Ustawieniach): klej między bramką z lib/review.ts,
 * danymi aplikacji i modułem expo-store-review. Wywoływana WYŁĄCZNIE z ekranu podsumowania świeżo zakończonego treningu (nigdy z przycisku, nigdy w trakcie
 * treningu). Okno pokazuje wyłącznie system (StoreReview.requestReview) — aplikacja nie ma własnego okna oceny (App Review 5.6.1). Data i wersja ostatniej prośby:
 * Settings.reviewAsked (opcjonalne pole, bez zmiany SCHEMA_VERSION). System sam ogranicza prośby (3 na 365 dni), więc nie zakładamy „pokazano”.
 */
import Constants from 'expo-constants';
import { reviewDecision, type ReviewBlockReason } from '@/lib/review';
import { STORE_TIMING } from '@/lib/products';
import { getState, saveCfg, finishedWorkouts, getPersistError } from '@/lib/store';
import { workoutPRs, prCountOf } from '@/lib/stats';
import { nextStartBlocked, maybeShowPaywallAfterFirstWorkout } from '@/lib/entitlement';
import type { Workout } from '@/lib/seed';

interface ReviewModule { isAvailableAsync(): Promise<boolean>; requestReview(): Promise<void> }
function storeReview(): ReviewModule | null { try { return require('expo-store-review') as ReviewModule; } catch { return null; } }

/* Trening świeżo zakończony przez użytkownika (nie porzucony i zapisany sam, nie otwarty z historii) — ekran podsumowania zużywa znacznik raz. */
let justFinished: string | null = null;
export const markJustFinished = (id: string) => { justFinished = id; };
export function takeJustFinished(id: string): boolean { if (justFinished !== id) return false; justFinished = null; return true; }

export type ReviewRunResult = 'asked' | ReviewBlockReason | 'unavailable' | 'error';
/** Bramka + wywołanie systemowe. Data i wersja zapisują się PO wywołaniu modułu (system może nie pokazać okna — i tak liczymy odstęp; wyjątek modułu = prośby nie było). Brak modułu / TestFlight → 'unavailable', bez zapisu. */
export async function maybeRequestReview(w: Workout, now: number = Date.now()): Promise<ReviewRunResult> {
  const st = getState();
  const d = reviewDecision({ now, finishedWorkouts: finishedWorkouts().length, justFinishedHasRecord: prCountOf(workoutPRs(w)) > 0, version: String(Constants.expoConfig?.version ?? ''),
    lastAsked: st.settings.reviewAsked ?? null, workoutActive: !!st.active, blocked: nextStartBlocked(now), ioBusy: false, lastFailed: !!getPersistError() });
  if (d !== 'ask') return d;
  const m = storeReview(); if (!m) return 'unavailable';
  try {
    if (!(await m.isAvailableAsync())) return 'unavailable'; /* TestFlight: brak okna (Apple) — nie zużywamy odstępu */
    await m.requestReview(); /* rzuca, gdy nie ma aktywnej sceny na pierwszym planie (expo-store-review 57.0.3) — wtedy prośby nie było i odstępu nie zużywamy */
    st.settings.reviewAsked = { at: now, version: String(Constants.expoConfig?.version ?? '') }; saveCfg(); return 'asked';
  } catch { return 'error'; }
}

/**
 * Wejście z ekranu podsumowania: najpierw ewentualny ekran zakupu po pierwszym treningu (P2 B), w przeciwnym razie prośba o ocenę po krótkim opóźnieniu
 * (karta rekordów zdąża się pokazać). Zwraca anulowanie opóźnionej prośby (wyjście z ekranu).
 */
export function onSummaryShown(w: Workout): () => void {
  if (!takeJustFinished(w.id)) return () => {};
  let off = false; let timer: ReturnType<typeof setTimeout> | null = null;
  void maybeShowPaywallAfterFirstWorkout(w.id).then(opened => { if (off || opened) return; timer = setTimeout(() => { void maybeRequestReview(w); }, STORE_TIMING.REVIEW_DELAY_MS); });
  return () => { off = true; if (timer) clearTimeout(timer); };
}
