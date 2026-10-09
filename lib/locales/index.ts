/* Słowniki języków innych niż polski i angielski (decyzja właściciela 05.10.2026). Klucz = polski tekst źródłowy (jak w i18n.en.ts);
 * pliki JSON tłumaczone z lib/locales/_source.json (generowane z kodu: tests/i18n-locales.test.ts, UPDATE_I18N=1). */
import type { Lang } from '../i18n';
/* eslint-disable @typescript-eslint/no-var-requires */
/* PERF-05 (audyt 0.10): słowniki (2,1 MB JSON) ładowane przy pierwszym użyciu języka, nie wszystkie 24 przy starcie aplikacji — `require` w funkcji
 * wykonuje moduł dopiero przy wywołaniu (Metro i Jest). LOCALES zachowuje kształt obiektu (Object.keys/entries działa jak dotąd). */
const LOAD: Partial<Record<Lang, () => Record<string, string>>> = {
  cs: () => require('./cs.json'), sk: () => require('./sk.json'), hu: () => require('./hu.json'), ro: () => require('./ro.json'), bg: () => require('./bg.json'), hr: () => require('./hr.json'),
  sl: () => require('./sl.json'), sr: () => require('./sr.json'), lt: () => require('./lt.json'), lv: () => require('./lv.json'), et: () => require('./et.json'), uk: () => require('./uk.json'),
  es: () => require('./es.json'), pt: () => require('./pt.json'),
  /* 09.10.2026 (fala 1, wariant B): wariant regionalny = słownik bazowy + nakładka z tekstami, które w wariancie brzmią inaczej (pt-BR.json, es-419.json
   * zawierają tylko różnice; test tests/i18n-variants.test.ts). Wynik ma komplet kluczy, więc testy kompletności i jakości działają bez zmian. */
  'es-419': () => ({ ...require('./es.json'), ...require('./es-419.json') }), 'pt-BR': () => ({ ...require('./pt.json'), ...require('./pt-BR.json') }),
  /* 07.10.2026 (wariant B) */
  de: () => require('./de.json'), fr: () => require('./fr.json'), it: () => require('./it.json'), nl: () => require('./nl.json'), sv: () => require('./sv.json'), da: () => require('./da.json'),
  nb: () => require('./nb.json'), fi: () => require('./fi.json'), tr: () => require('./tr.json'), el: () => require('./el.json'),
  /* 09.10.2026 (fala 2, docs/16): pełne słowniki */
  id: () => require('./id.json'), ms: () => require('./ms.json'), vi: () => require('./vi.json'),
};
export const LOCALES: Partial<Record<Lang, Record<string, string>>> = {};
for (const [k, load] of Object.entries(LOAD) as [Lang, () => Record<string, string>][]) { let v: Record<string, string> | undefined; Object.defineProperty(LOCALES, k, { enumerable: true, get: () => (v ??= load()) }); }
