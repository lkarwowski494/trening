import { Platform } from 'react-native';
import type { Workout } from './seed';
import { t } from './i18n';
import { getState, save, exById, volume, workingSets, pausedTotal, flush } from './store';
import { catalogKey } from './seed';

/*
 * Zapis treningu do Apple Health (0.6, HealthKit write). Biblioteka @kingstinct/react-native-healthkit 8.x
 * (bez Nitro — zgodna z RN 0.76). Wymaga dev buildu / IPA z config pluginem; w Expo Go moduł nie istnieje,
 * więc ładujemy go leniwie i każdy brak traktujemy jako „niedostępne”, nie jako błąd.
 */
type HK = { authorizationStatusFor?: (type: string) => Promise<number>; isHealthDataAvailable: () => Promise<boolean>; requestAuthorization: (read: readonly string[], write?: readonly string[]) => Promise<boolean>; saveWorkoutSample: (type: number, quantities: readonly unknown[], start: Date, options?: { end?: Date; totals?: { distance?: number; energyBurned?: number }; metadata?: Record<string, string | number | boolean> }) => Promise<string | boolean> };
let mod: HK | null | undefined;
function lib(): HK | null {
  if (mod !== undefined) return mod;
  if (Platform.OS !== 'ios') { mod = null; return mod; }
  try { mod = (require('@kingstinct/react-native-healthkit') as { default: HK }).default; } catch { mod = null; }
  return mod;
}
const WORKOUT_TYPE = 'HKWorkoutTypeIdentifier';
/** HKWorkoutActivityType (@kingstinct/react-native-healthkit 8.x, native-types.ts). Audyt 0.10 MER-18: trening z samych ćwiczeń cardio nie jest siłowy. */
export const HK_ACTIVITY = { traditionalStrength: 50, functionalStrength: 20, running: 37, walking: 52, cycling: 13, rowing: 35, elliptical: 16, stairClimbing: 44, jumpRope: 64, mixedCardio: 73 } as const;
/** Ćwiczenia cardio z biblioteki → rodzaj treningu w Zdrowiu. Audyt 0.10 (fala 2): po kluczu katalogu `libKey` (seed.catalogKey), nie po nazwie —
 * ćwiczenie biblioteki przemianowane przez użytkownika (np. „Bieg” → „Jogging”) dalej trafia do Zdrowia jako bieg (jak E2: nazwa tylko do wyświetlania).
 * Ćwiczenia własne i inne cardio — mixedCardio. */
export const CARDIO_KIND: Readonly<Record<string, number>> = { 'Bieg': HK_ACTIVITY.running, 'Incline Walk (bieżnia)': HK_ACTIVITY.walking, 'Treadmill Walking': HK_ACTIVITY.walking, 'Rower': HK_ACTIVITY.cycling, 'Assault Bike': HK_ACTIVITY.cycling,
  'Rowing Machine': HK_ACTIVITY.rowing, 'Orbitrek': HK_ACTIVITY.elliptical, 'Stair Climber': HK_ACTIVITY.stairClimbing, 'Skakanka': HK_ACTIVITY.jumpRope };
/** Rodzaj treningu w Zdrowiu: same ćwiczenia cardio — jedno znane z biblioteki → jego rodzaj, inne → mixedCardio; same ćwiczenia z masą ciała — functionalStrength;
 * pozostałe — traditionalStrength (jak dotąd). */
export function workoutActivityType(w: Workout): number {
  const exs = w.exercises.map(e => exById(e.exerciseId));
  if (exs.length && exs.every(e => e?.group === 'cardio' || e?.pattern === 'cardio')) { const keys = [...new Set(exs.map(e => catalogKey(e) ?? ''))]; return keys.length === 1 && Object.prototype.hasOwnProperty.call(CARDIO_KIND, keys[0]) ? CARDIO_KIND[keys[0]] : HK_ACTIVITY.mixedCardio; }
  return exs.length && exs.every(e => e?.equipment === 'masa ciała') ? HK_ACTIVITY.functionalStrength : HK_ACTIVITY.traditionalStrength;
}

/** Prosi o zgodę na zapis treningów (tylko write). false = brak modułu, brak zgody albo brak HealthKit (iPad/symulator). */
export async function ensureAuthorization(): Promise<boolean> {
  const h = lib(); if (!h) return false;
  try {
    if (!(await h.isHealthDataAvailable())) return false;
    const processed = await h.requestAuthorization([], [WORKOUT_TYPE]); if (!processed) return false;
    // requestAuthorization mówi tylko, że prośba została obsłużona — zgodę sprawdzamy osobno (2 = sharingAuthorized).
    if (h.authorizationStatusFor) return (await h.authorizationStatusFor(WORKOUT_TYPE)) === 2;
    return true;
  } catch { return false; }
}
/** Start treningu w Zdrowiu: koniec − czas bez pauz (= start + suma pauz). */
export const healthStart = (w: Workout) => Math.min(w.finishedAt ?? w.startedAt, w.startedAt + pausedTotal(w, w.finishedAt ?? w.startedAt));
/** Zapisuje zakończony trening jako HKWorkout (rodzaj: workoutActivityType). Idempotentne — drugi zapis tego samego treningu jest pomijany. */
const inFlight = new Set<string>();
export async function saveWorkout(w: Workout): Promise<'saved' | 'skipped' | 'unavailable' | 'failed'> {
  const h = lib(); if (!h || !w.finishedAt) return 'unavailable';
  if (w.healthUUID || inFlight.has(w.id)) return 'skipped'; // podwójne wywołanie nie zapisze treningu dwa razy
  inFlight.add(w.id);
  try {
    /* 08.10.2026 (decyzja właściciela, wariant A): biblioteka 8.x zapisuje HKWorkout bez zdarzeń pauzy (workoutEvents: nil), a Zdrowie liczy
     * czas jako koniec − start — więc start w Zdrowiu przesunięty o sumę pauz: czas trwania jak w aplikacji, koniec prawdziwy, start później
     * o długość pauz (w aplikacji start bez zmian). Prawdziwe zdarzenia pauzy (Workout.pauses) — w wydaniu Health po aktualizacji biblioteki. */
    const res = await h.saveWorkoutSample(workoutActivityType(w), [], new Date(healthStart(w)), {
      end: new Date(w.finishedAt),
      metadata: { HKMetadataKeySyncIdentifier: w.id, HKMetadataKeySyncVersion: 1 /* T4b: HealthKit sam odrzuca drugi zapis tego treningu (np. po przywróceniu kopii sprzed zapisu) */, 'Workout': w.templateName || t('Trening'), 'VolumeKg': Math.round(volume(w)), 'Sets': workingSets(w) } // runda 7: jak w historii (bez rozgrzewek); X-15 (audyt 0.10): ta sama funkcja co lista Historii i kafelki,
    });
    if (res === false) return 'failed'; // biblioteka zwraca false przy odmowie zapisu — nie oznaczamy jako zapisane
    // Gdy HealthKit nie zwróci UUID, zapisujemy znacznik 'saved' (nie identyfikator) — tylko po to, by nie dublować zapisu.
    /* docs/12 (weryfikacja 2, L3): trening mógł zostać w międzyczasie podmieniony edycją — znacznik trafia też do obiektu, który jest teraz w historii */
    const uuid = typeof res === 'string' && res ? res : 'saved'; w.healthUUID = uuid; delete w.healthPending; const cur = getState().workouts.find(x => x.id === w.id); if (cur && cur !== w) { cur.healthUUID = uuid; delete cur.healthPending; } save(cur ?? w);
    return 'saved';
  } catch { return 'failed'; } finally { inFlight.delete(w.id); }
}
/*
 * Audyt 0.10 J2 (DAT-04, LIVE-16; decyzja: wariant A + B — rekomendacja z docs/25). Nieudany zapis do Zdrowia nie znika po cichu:
 *  - przy zakończeniu treningu z włączoną synchronizacją trening dostaje znacznik `healthPending` ZANIM zacznie się zapis (zapis stanu wymuszony —
 *    zabicie aplikacji między „Zakończ” a zapisem do Zdrowia też zostawia znacznik); udany zapis go zdejmuje;
 *  - przy starcie i każdym powrocie aplikacji na pierwszy plan (`retryHealth`) treningi ze znacznikiem są zapisywane ponownie — bez duplikatów
 *    (HKMetadataKeySyncIdentifier = id treningu; HealthKit odrzuca drugi zapis);
 *  - Ustawienia pokazują liczbę treningów czekających na zapis i przycisk „Ponów teraz”, a szczegóły sesji — „Nie zapisano w Apple Health”.
 * Treningi bez znacznika (trening wstecz, edycja, dane sprzed tej zmiany) nie są dosyłane — jak dotąd (onHistoryEdited).
 */
export const healthPending = (): Workout[] => getState().workouts.filter(w => w.healthPending === true && !w.healthUUID && w.finishedAt);
/** Po zakończeniu treningu, jeśli użytkownik włączył synchronizację: znacznik „czeka na Zdrowie”, potem zapis; błędy nie przerywają zapisu w apce. */
export async function syncAfterFinish(w: Workout): Promise<void> {
  if (!getState().settings.healthSync || w.healthUUID) return;
  try { if (w.healthPending !== true) { w.healthPending = true; const cur = getState().workouts.find(x => x.id === w.id); if (cur && cur !== w) cur.healthPending = true; save(cur ?? w); await flush(); } await saveWorkout(w); } catch {}
}
/** J2: ponawia zapis treningów ze znacznikiem (po kolei — HealthKit i tak zapisuje jeden naraz). Zwraca liczbę zapisanych. Bez synchronizacji — nic. */
let retrying: Promise<number> | null = null;
export function retryHealth(): Promise<number> {
  if (!getState().settings.healthSync) return Promise.resolve(0);
  if (retrying) return retrying; /* start i powrót z tła tuż po sobie — jedno przejście */
  const run = (async () => { let n = 0; try { for (const w of healthPending()) if ((await saveWorkout(w)) === 'saved') n++; } catch {} return n; })();
  retrying = run; run.finally(() => { if (retrying === run) retrying = null; }).catch(() => {});
  return run;
}
