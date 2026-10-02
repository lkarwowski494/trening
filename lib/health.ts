import { Platform } from 'react-native';
import type { Workout } from './seed';
import { t } from './i18n';
import { getState, save, exById, volume, isWorking } from './store';

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
const TRADITIONAL_STRENGTH = 50; // HKWorkoutActivityType.traditionalStrengthTraining
const FUNCTIONAL_STRENGTH = 20;

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
/** Zapisuje zakończony trening jako HKWorkout (siłowy). Idempotentne — drugi zapis tego samego treningu jest pomijany. */
const inFlight = new Set<string>();
export async function saveWorkout(w: Workout): Promise<'saved' | 'skipped' | 'unavailable' | 'failed'> {
  const h = lib(); if (!h || !w.finishedAt) return 'unavailable';
  if (w.healthUUID || inFlight.has(w.id)) return 'skipped'; // podwójne wywołanie nie zapisze treningu dwa razy
  inFlight.add(w.id);
  const bw = w.exercises.length > 0 && w.exercises.every(e => { const ex = exById(e.exerciseId); return ex?.equipment === 'masa ciała'; });
  try {
    const res = await h.saveWorkoutSample(bw ? FUNCTIONAL_STRENGTH : TRADITIONAL_STRENGTH, [], new Date(w.startedAt), {
      end: new Date(w.finishedAt),
      metadata: { HKMetadataKeySyncIdentifier: w.id, HKMetadataKeySyncVersion: 1 /* T4b: HealthKit sam odrzuca drugi zapis tego treningu (np. po przywróceniu kopii sprzed zapisu) */, 'Workout': w.templateName || t('Trening'), 'VolumeKg': Math.round(volume(w)), 'Sets': w.exercises.reduce((a, e) => a + e.sets.filter(isWorking).length, 0) } // runda 7: jak w historii (bez rozgrzewek),
    });
    if (res === false) return 'failed'; // biblioteka zwraca false przy odmowie zapisu — nie oznaczamy jako zapisane
    // Gdy HealthKit nie zwróci UUID, zapisujemy znacznik 'saved' (nie identyfikator) — tylko po to, by nie dublować zapisu.
    w.healthUUID = typeof res === 'string' && res ? res : 'saved'; save(w);
    return 'saved';
  } catch { return 'failed'; } finally { inFlight.delete(w.id); }
}
/** Zapisuje po zakończeniu treningu, jeśli użytkownik włączył synchronizację; błędy nie przerywają zapisu w apce. */
export async function syncAfterFinish(w: Workout): Promise<void> { if (!getState().settings.healthSync) return; try { await saveWorkout(w); } catch {} }
