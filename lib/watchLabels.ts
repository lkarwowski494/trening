import { t, APP_NAME, LANGS, applyLang, type Lang } from './i18n';

/*
 * Stałe etykiety aplikacji na Apple Watch (0.20 „Zegarki i głos”, docs/36). Teksty dynamiczne (ćwiczenie, ciężar, zapowiedź przerwy) przychodzą
 * z telefonu gotowe w migawce; tu jest tylko kilkanaście etykiet przycisków i komunikatów — z TEGO SAMEGO słownika co telefon (t()), więc bez
 * rozjazdu w 35 językach. Identyfikatory i teksty WSPÓLNE z protokołem (lib/watch/labels.ts z gałęzi f020-protokol: WATCH_LABEL_IDS) mają te same
 * klucze słownika; po scaleniu obu gałęzi ten plik zastępuje się importem z lib/watch/labels.ts i zostają tylko dodatki Apple (`APPLE_ONLY_LABEL_IDS`,
 * `watchInfoPlist`). Pliki zegarka są GENEROWANE z tego pliku przez tests/watch-apple-i18n.test.ts (UPDATE_WATCH_APPLE=1):
 *   targets/watch-app/Core/WatchLabelTable.swift — tabela język → etykieta (zegarek wybiera język z migawki, nie z systemu),
 *   targets/watch-app/<język>.lproj/InfoPlist.strings — nazwa i opisy zgód HealthKit w języku systemu.
 * Klucze = wartości enuma WatchLabelKey w targets/watch-app/Core/WatchLabels.swift (test porównuje oba).
 */
export const WATCH_LABEL_IDS = ['done', 'differ', 'skip', 'skipAsk', 'cancel', 'undo', 'rest', 'set', 'pause', 'connect', 'idle', 'finished', 'update', 'nothingLeft'] as const;
export type WatchLabelId = typeof WATCH_LABEL_IDS[number];
/** Etykiety tylko Apple Watch (wskaźnik trwającej sesji treningu — wymóg Apple dla HKWorkoutSession). */
export const APPLE_ONLY_LABEL_IDS = ['workoutOn'] as const;
export type AppleOnlyLabelId = typeof APPLE_ONLY_LABEL_IDS[number];
export type WatchLabelKey = WatchLabelId | AppleOnlyLabelId;
export const WATCH_LABEL_KEYS: readonly WatchLabelKey[] = [...WATCH_LABEL_IDS, ...APPLE_ONLY_LABEL_IDS];

/** Etykiety w bieżącym języku (applyLang). Każdy tekst jako literał w wywołaniu tłumaczenia, żeby check:i18n widział klucze. */
export function watchLabels(): Record<WatchLabelKey, string> {
  return {
    done: t('Seria zrobiona'), differ: t('Zrobione inaczej'), skip: t('Pomiń'), skipAsk: t('Pominąć ćwiczenie?'), cancel: t('Anuluj'), undo: t('Cofnij'),
    rest: t('Przerwa'), set: t('Seria'), pause: t('Pauza'), connect: t('Połącz z telefonem'), idle: t('Zacznij trening na telefonie'),
    finished: t('Trening zakończony'), update: t('Zaktualizuj aplikację na zegarku'), nothingLeft: t('nic więcej do zrobienia'),
    workoutOn: t('Trening wciąż trwa'),
  };
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
