import { Platform } from 'react-native';

/*
 * Dostęp do biblioteki @kingstinct/react-native-healthkit 16.x (Nitro Modules) — jedno miejsce ładowania i opisu kształtów używanych wywołań
 * (kontrakt przeczytany w node_modules/@kingstinct/react-native-healthkit/src/specs i @react-native-healthkit/core, docs/28 i docs/29).
 * Wymaga dev buildu / IPA z config pluginem; w Expo Go i w testach moduł nie istnieje (albo jest makietą), więc ładujemy go leniwie
 * i każdy brak traktujemy jako „niedostępne”, nie jako błąd. Zapis: lib/health.ts, odczyt: lib/healthQuery.ts.
 */
/** Źródło danych (aplikacja albo urządzenie) — SourceProxy z currentAppSource(); do filtrów przekazywany jako obiekt, nie jako tekst. */
export type HKSource = { name?: string; bundleIdentifier?: string };
export type HKQuantity = { unit?: string; quantity: number };
export type HKStatistics = { sumQuantity?: HKQuantity; averageQuantity?: HKQuantity; maximumQuantity?: HKQuantity; startDate?: Date; endDate?: Date };
/** Filtr próbek (FilterForSamples z biblioteki): metadane + źródła są łączone ORAZ; pusta lista źródeł nie zawęża zapytania, więc nigdy jej nie podajemy. */
export type HKFilter = { metadata?: { withMetadataKey: string; operatorType?: number; value?: string | number | boolean }; sources?: HKSource[]; date?: { startDate?: Date; endDate?: Date };
  NOT?: HKFilter[]; OR?: HKFilter[]; AND?: HKFilter[]; workoutActivityType?: number };
export type HKProxy = { uuid: string; dispose?: () => void };
/** WorkoutProxy z queryWorkoutSamples: pola próbki + getStatistic (Promise<QueryStatisticsResponse | undefined>) i dispose(). */
export type HKWorkoutProxy = { uuid: string; startDate: Date; endDate: Date; workoutActivityType: number; duration?: HKQuantity; totalDistance?: HKQuantity; totalEnergyBurned?: HKQuantity;
  metadata?: Record<string, unknown>; sourceRevision?: { source?: HKSource }; getStatistic?: (type: string, unit?: string) => Promise<HKStatistics | undefined>; dispose?: () => void };
export type HK = {
  authorizationStatusFor?: (type: string) => number | Promise<number>;
  isHealthDataAvailableAsync: () => Promise<boolean>;
  requestAuthorization: (options: { toRead?: readonly string[]; toShare?: readonly string[] }) => Promise<boolean>;
  saveWorkoutSample: (type: number, quantities: readonly unknown[], start: Date, end: Date, totals?: { distance?: number; energyBurned?: number }, metadata?: Record<string, string | number | boolean>) => Promise<HKProxy>;
  queryStatisticsCollectionForQuantity?: (type: string, statistics: readonly string[], anchorDate: Date, interval: { day?: number }, options?: { filter?: HKFilter; unit?: string }) => Promise<readonly HKStatistics[]>;
  queryWorkoutSamples?: (options: { filter?: HKFilter; limit: number; ascending?: boolean }) => Promise<readonly HKWorkoutProxy[]>;
  deleteObjects?: (type: string, filter: HKFilter) => Promise<number>;
  currentAppSource?: () => HKSource;
};
let mod: HK | null | undefined;
export function hk(): HK | null {
  if (mod !== undefined) return mod;
  if (Platform.OS !== 'ios') { mod = null; return mod; }
  try { mod = (require('@kingstinct/react-native-healthkit') as { default: HK }).default; } catch { mod = null; }
  return mod;
}
