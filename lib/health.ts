import type { Workout } from './seed';
import { t } from './i18n';
import { getState, save, exById, volume, workingSets, pausedTotal, flush } from './store';
import { catalogKey } from './seed';
import { hk as lib } from './hkModule';
import { HEALTH_READ_TYPES, HEALTH_UUID_WATCH, ownCopyFilter } from './healthRead';
import { hasWatchMatch, matchesFor, ownCopySessions, readEnabled } from './healthQuery';

/*
 * Zapis treningu do Apple Health (0.6, HealthKit write); ładowanie biblioteki i kształty wywołań: lib/hkModule.ts. Biblioteka @kingstinct/react-native-healthkit 16.x (Nitro Modules; od 0.15.0,
 * wcześniej 8.x). Wymaga dev buildu / IPA z config pluginem; w Expo Go moduł nie istnieje, więc ładujemy go leniwie i każdy brak
 * traktujemy jako „niedostępne”, nie jako błąd. Kontrakt 16.x: requestAuthorization({ toRead, toShare }), authorizationStatusFor synchroniczne,
 * saveWorkoutSample(rodzaj, próbki, start, koniec, sumy, metadane) → WorkoutProxy (UUID w `uuid`, po użyciu `dispose()`), błąd zapisu = odrzucona obietnica.
 */
const WORKOUT_TYPE = 'HKWorkoutTypeIdentifier';
/** HKWorkoutActivityType (@kingstinct/react-native-healthkit 16.x, enum WorkoutActivityType; wartości liczbowe jak w 8.x). Audyt 0.10 MER-18: trening z samych ćwiczeń cardio nie jest siłowy. */
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
    if (!(await h.isHealthDataAvailableAsync())) return false;
    const processed = await h.requestAuthorization({ toRead: [], toShare: [WORKOUT_TYPE] }); if (!processed) return false;
    // requestAuthorization mówi tylko, że prośba została obsłużona — zgodę sprawdzamy osobno (2 = sharingAuthorized).
    if (h.authorizationStatusFor) return (await h.authorizationStatusFor(WORKOUT_TYPE)) === 2;
    return true;
  } catch { return false; }
}
/**
 * Prosi o zgodę na ODCZYT (0.16.0, P2 A): kroki, treningi, tętno, aktywne kcal (HEALTH_READ_TYPES); zapisu nie dotyka (toShare: []). 'unavailable' = brak modułu albo
 * HealthKit (iPad, Expo Go); 'failed' = prośba nieobsłużona albo wyjątek; 'ok' = arkusz zamknięty. iOS nie mówi aplikacji, czy użytkownik zezwolił na odczyt
 * (prywatność Apple, docs/28) — dlatego 'ok' nie znaczy „są dane”; brak danych pokazują ekrany neutralnym stanem pustym.
 */
export async function ensureReadAuthorization(): Promise<'ok' | 'unavailable' | 'failed'> {
  const h = lib(); if (!h) return 'unavailable';
  try {
    if (!(await h.isHealthDataAvailableAsync())) return 'unavailable';
    return (await h.requestAuthorization({ toRead: HEALTH_READ_TYPES, toShare: [] })) ? 'ok' : 'failed';
  } catch { return 'failed'; }
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
    /* 08.10.2026 (decyzja właściciela, wariant A): biblioteka (8.x i 16.x: saveWorkoutSample bez parametru zdarzeń) zapisuje HKWorkout bez zdarzeń pauzy (workoutEvents: nil), a Zdrowie liczy
     * czas jako koniec − start — więc start w Zdrowiu przesunięty o sumę pauz: czas trwania jak w aplikacji, koniec prawdziwy, start później
     * o długość pauz (w aplikacji start bez zmian). Prawdziwe zdarzenia pauzy (Workout.pauses): 16.x też nie ma parametru zdarzeń w saveWorkoutSample — inna droga do sprawdzenia (docs/28 §2). */
    const res = await h.saveWorkoutSample(workoutActivityType(w), [], new Date(healthStart(w)), new Date(w.finishedAt), undefined,
      { HKMetadataKeySyncIdentifier: w.id, HKMetadataKeySyncVersion: 1 /* T4b: HealthKit sam odrzuca drugi zapis tego treningu (np. po przywróceniu kopii sprzed zapisu) */, 'Workout': w.templateName || t('Trening'), 'VolumeKg': Math.round(volume(w)), 'Sets': workingSets(w) } // runda 7: jak w historii (bez rozgrzewek); X-15 (audyt 0.10): ta sama funkcja co lista Historii i kafelki
    );
    // 16.x: odmowa/błąd zapisu = odrzucona obietnica (trafia do catch → 'failed'); pusty wynik też nie oznacza zapisu.
    if (!res) return 'failed';
    // Gdy HealthKit nie zwróci UUID, zapisujemy znacznik 'saved' (nie identyfikator) — tylko po to, by nie dublować zapisu.
    /* docs/12 (weryfikacja 2, L3): trening mógł zostać w międzyczasie podmieniony edycją — znacznik trafia też do obiektu, który jest teraz w historii */
    const uuid = typeof res.uuid === 'string' && res.uuid ? res.uuid : 'saved'; try { res.dispose?.(); } catch {} w.healthUUID = uuid; delete w.healthPending; const cur = getState().workouts.find(x => x.id === w.id); if (cur && cur !== w) { cur.healthUUID = uuid; delete cur.healthPending; } save(cur ?? w);
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
/*
 * 0.16.0 (docs/29 5.7, decyzja 11.10.2026 etap 2 A): bez dubla w Zdrowiu. Gdy włączony jest też odczyt i do sesji pasuje trening z zegarka (reguła: lib/healthRead),
 * aplikacja NIE zapisuje własnej kopii (`healthUUID = 'watch'`), a własną kopię zapisaną wcześniej usuwa po późniejszej synchronizacji zegarka — tylko filtrem
 * znacznik synchronizacji = id sesji ORAZ źródło = ta aplikacja (healthRead.ownCopyFilter). Błąd zapytania / brak modułu = „nie wiadomo” → zapis jak dotąd.
 */
function markWatch(w: Workout) {
  w.healthUUID = HEALTH_UUID_WATCH; delete w.healthPending; const cur = getState().workouts.find(x => x.id === w.id);
  if (cur && cur !== w) { cur.healthUUID = HEALTH_UUID_WATCH; delete cur.healthPending; } save(cur ?? w);
}
/** Sesja ma trening z zegarka w Zdrowiu → znacznik 'watch' bez zapisu kopii. Zwraca true, gdy tak. Wymaga włączonego odczytu. */
async function adoptWatch(w: Workout): Promise<boolean> {
  if (!readEnabled() || w.healthUUID || !w.finishedAt) return false;
  try { if ((await hasWatchMatch(w)) === true) { markWatch(w); return true; } } catch {}
  return false;
}
/** Usuwa WŁASNĄ kopię sesji z Apple Health (filtr id + własne źródło); true = usunięto albo już jej nie ma (0 obiektów). Bez źródła aplikacji / bez funkcji — false. */
export async function deleteOwnCopy(w: Workout): Promise<boolean> {
  const h = lib(); if (!h?.deleteObjects || !h.currentAppSource) return false;
  try { const f = ownCopyFilter(w.id, h.currentAppSource()); if (!f) return false; const n = await h.deleteObjects(WORKOUT_TYPE, f); return typeof n === 'number' && n >= 0; } catch { return false; }
}
/** Po późniejszej synchronizacji zegarka: sesje z własną kopią, do których pasuje trening z zegarka → usunięcie kopii i 'watch'. Tylko przy włączonym zapisie I odczycie
 * (bez odczytu nie wiemy nic o zegarku; bez zapisu nie mamy kopii do usuwania). Zwraca liczbę sesji przestawionych na 'watch'. */
export async function reconcileWatchCopies(): Promise<number> {
  const st = getState().settings; if (!st.healthSync || !st.healthRead) return 0;
  const mine = ownCopySessions(); if (!mine.length) return 0;
  let n = 0;
  try {
    const m = await matchesFor(mine); if (!m) return 0;
    for (const w of mine) if (m.has(w.id) && (await deleteOwnCopy(w))) { markWatch(w); n++; }
    if (n) await flush();
  } catch {}
  return n;
}
/** Po zakończeniu treningu, jeśli użytkownik włączył synchronizację: znacznik „czeka na Zdrowie”, potem — gdy do sesji pasuje trening z zegarka — 'watch' bez zapisu,
 * inaczej zapis; błędy nie przerywają zapisu w apce. */
export async function syncAfterFinish(w: Workout): Promise<void> {
  if (!getState().settings.healthSync || w.healthUUID) return;
  try { if (w.healthPending !== true) { w.healthPending = true; const cur = getState().workouts.find(x => x.id === w.id); if (cur && cur !== w) cur.healthPending = true; save(cur ?? w); await flush(); }
    if (await adoptWatch(w)) { await flush(); return; } await saveWorkout(w); } catch {}
}
/** J2: ponawia zapis treningów ze znacznikiem (po kolei — HealthKit i tak zapisuje jeden naraz), a potem usuwa własne kopie zastąpione treningiem z zegarka (0.16.0).
 * Zwraca liczbę zapisanych. Bez synchronizacji — nic. */
let retrying: Promise<number> | null = null;
export function retryHealth(): Promise<number> {
  if (!getState().settings.healthSync) return Promise.resolve(0);
  if (retrying) return retrying; /* start i powrót z tła tuż po sobie — jedno przejście */
  const run = (async () => { let n = 0; try { for (const w of healthPending()) { if (await adoptWatch(w)) continue; if ((await saveWorkout(w)) === 'saved') n++; } } catch {} await reconcileWatchCopies().catch(() => 0); return n; })();
  retrying = run; run.finally(() => { if (retrying === run) retrying = null; }).catch(() => {});
  return run;
}
