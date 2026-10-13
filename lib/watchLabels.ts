import { t, APP_NAME, LANGS, applyLang, type Lang } from './i18n';
import { WATCH_LABEL_IDS, watchLabels as protocolLabels, type WatchLabelId } from './watch/labels';

/*
 * Etykiety aplikacji na Apple Watch (0.20 „Zegarki i głos”, docs/35-zegarek-apple): stałe etykiety z protokołu (lib/watch/labels.ts — te same co na drugim zegarku, identyczne teksty
 * i klucze słownika) plus to, co dotyczy tylko Apple Watch: wskaźnik trwającej sesji treningu (wymóg Apple dla HKWorkoutSession) i opisy zgód HealthKit zegarka.
 * Teksty dynamiczne (ćwiczenie, ciężar, zapowiedź przerwy) przychodzą z telefonu gotowe w migawce. Pliki zegarka są GENEROWANE z tego pliku przez
 * tests/watch-apple-i18n.test.ts (UPDATE_WATCH_APPLE=1):
 *   targets/watch-app/Core/WatchLabelTable.swift — tabela język → etykieta (zegarek wybiera język z migawki, nie z systemu),
 *   targets/watch-app/<język>.lproj/InfoPlist.strings — nazwa i opisy zgód HealthKit w języku systemu.
 * Klucze = wartości enuma WatchLabelKey w targets/watch-app/Core/WatchLabels.swift (test porównuje oba).
 */
export { WATCH_LABEL_IDS, type WatchLabelId };
/** Etykiety tylko Apple Watch. */
export const APPLE_ONLY_LABEL_IDS = ['workoutOn'] as const;
export type AppleOnlyLabelId = typeof APPLE_ONLY_LABEL_IDS[number];
export type WatchLabelKey = WatchLabelId | AppleOnlyLabelId;
export const WATCH_LABEL_KEYS: readonly WatchLabelKey[] = [...WATCH_LABEL_IDS, ...APPLE_ONLY_LABEL_IDS];

/** Etykiety w bieżącym języku (applyLang). */
export function watchLabels(): Record<WatchLabelKey, string> {
  return { ...protocolLabels(), workoutOn: t('Trening wciąż trwa') };
}

/** Wpisy InfoPlist.strings zegarka w bieżącym języku: nazwa pod ikoną i opisy zgód HealthKit. */
export function watchInfoPlist(l: Lang): { CFBundleDisplayName: string; NSHealthShareUsageDescription: string; NSHealthUpdateUsageDescription: string } {
  return {
    CFBundleDisplayName: APP_NAME[l],
    NSHealthShareUsageDescription: t('Zegarek odczytuje tętno i energię aktywną z trwającego treningu. Dane nie są wysyłane poza Twoje urządzenia.'),
    NSHealthUpdateUsageDescription: t('Zegarek zapisuje zakończony trening siłowy, z tętnem i energią aktywną, w Apple Health.'),
  };
}

/** Wszystkie języki: etykiety i wpisy InfoPlist (język aplikacji wraca do `restore`). */
export function watchLabelTable(restore: Lang | 'auto' = 'pl'): Record<Lang, { labels: Record<WatchLabelKey, string>; plist: ReturnType<typeof watchInfoPlist> }> {
  const out = {} as Record<Lang, { labels: Record<WatchLabelKey, string>; plist: ReturnType<typeof watchInfoPlist> }>;
  for (const l of LANGS) { applyLang(l); out[l] = { labels: watchLabels(), plist: watchInfoPlist(l) }; }
  applyLang(restore);
  return out;
}
