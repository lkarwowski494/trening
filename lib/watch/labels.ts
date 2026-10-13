import { LANGS, applyLang, lang, t, type Lang } from '../i18n';

/*
 * Stałe etykiety zegarka — jedyne teksty, których zegarek nie dostaje w migawce (przyciski, komunikaty stanów). Wszystkie z `t()` i słownika,
 * w 35 językach aplikacji; klienty (Apple: Localizable.strings, Garmin: strings.xml) są GENEROWANE z `watch-fixtures/labels/<język>.json`
 * (tests/watch-fixtures.test.ts, UPDATE_WATCH=1) — nikt ich nie przepisuje ręcznie (wzór: tests/widget-i18n.test.ts). Teksty dynamiczne
 * (ćwiczenie, seria, ciężar, zapowiedź przerwy) przychodzą gotowe z telefonu.
 * Wzorce docs/32: etykiety jak na telefonie („Seria zrobiona”, „Pomiń”, „Anuluj”, „Cofnij”), „Pomiń” pyta o potwierdzenie.
 */
export const WATCH_LABEL_IDS = ['done', 'differ', 'skip', 'skipAsk', 'cancel', 'undo', 'rest', 'set', 'pause', 'connect', 'idle', 'finished', 'update', 'nothingLeft'] as const;
export type WatchLabelId = typeof WATCH_LABEL_IDS[number];

/** Etykiety w bieżącym języku aplikacji. Każdy tekst jako literał w wywołaniu tłumaczenia, żeby check:i18n widział klucze. */
export function watchLabels(): Record<WatchLabelId, string> {
  return {
    done: t('Seria zrobiona'), differ: t('Zrobione inaczej'), skip: t('Pomiń'), skipAsk: t('Pominąć ćwiczenie?'), cancel: t('Anuluj'), undo: t('Cofnij'),
    rest: t('Przerwa'), set: t('Seria'), pause: t('Pauza'), connect: t('Połącz z telefonem'), idle: t('Zacznij trening na telefonie'),
    finished: t('Trening zakończony'), update: t('Zaktualizuj aplikację na zegarku'), nothingLeft: t('nic więcej do zrobienia'),
  };
}
/** Etykiety dla języka `l` (język aplikacji zostaje taki, jaki był). */
export function watchLabelsFor(l: Lang): Record<WatchLabelId, string> {
  const prev = lang(); applyLang(l);
  try { return watchLabels(); } finally { applyLang(prev); }
}
/** Wszystkie języki aplikacji → etykiety (do plików wzorcowych). */
export const allWatchLabels = (): Record<Lang, Record<WatchLabelId, string>> => Object.fromEntries(LANGS.map(l => [l, watchLabelsFor(l)])) as Record<Lang, Record<WatchLabelId, string>>;
