/*
 * Migawki dla zrzutów zegarka do App Store (watch-sim.yml → scripts/ci/watch-screenshots.sh; A7 planu 1.1, 27.10.2026).
 * Pliki wzorcowe protokołu (watch-fixtures/snapshots) mają teksty danych po polsku („seria 1 z 3”, nazwa ćwiczenia) — na zrzutach w innych lokalizacjach
 * byłyby obce. Tu te same stany (tests/watch-scenarios.ts: `snapshots()`) budujemy prawdziwą funkcją telefonu (lib/watch/snapshot.ts) w KAŻDYM języku aplikacji,
 * więc nazwa ćwiczenia, licznik serii i ciężar są w języku zrzutu. Dane zmyślone (wytyczne Apple 2.3.9), te same co w testach zegarka.
 * Stałe etykiety zegarka („Przerwa”, „Seria zrobiona”) tłumaczy sama aplikacja na zegarku (Localizable.strings z labels/<język>.json).
 */
import { LANGS, type Lang } from '@/lib/i18n';
import { snapshots } from '../../tests/watch-scenarios';


/** Stany zrzutów zegarka (kolejność jak w watch-screenshots.sh) → nazwa migawki w `snapshots()`. */
export const WATCH_SHOT_STATES = {
  'set-first': 'set1', 'rest-after-first': 'rest1', paused: 'paused', 'last-rest': 'lastRest', done: 'done', idle: 'idle',
} as const;
export type WatchShotState = keyof typeof WATCH_SHOT_STATES;

/** Migawki wszystkich stanów zrzutów w jednym języku. */
export async function watchSnapshotsFor(lang: Lang): Promise<Record<WatchShotState, Record<string, unknown>>> {
  const S = await snapshots(lang);
  const out = {} as Record<WatchShotState, Record<string, unknown>>;
  for (const [state, key] of Object.entries(WATCH_SHOT_STATES) as [WatchShotState, keyof typeof S][]) out[state] = S[key] as unknown as Record<string, unknown>;
  return out;
}

export const watchShotLangs = (): readonly Lang[] => LANGS as readonly Lang[];
