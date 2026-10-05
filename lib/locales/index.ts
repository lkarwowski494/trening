/* Słowniki języków innych niż polski i angielski (decyzja właściciela 05.10.2026). Klucz = polski tekst źródłowy (jak w i18n.en.ts);
 * pliki JSON tłumaczone z lib/locales/_source.json (generowane z kodu: tests/i18n-locales.test.ts, UPDATE_I18N=1). */
import type { Lang } from '../i18n';
/* eslint-disable @typescript-eslint/no-var-requires */
export const LOCALES: Partial<Record<Lang, Record<string, string>>> = {
  cs: require('./cs.json'), sk: require('./sk.json'), hu: require('./hu.json'), ro: require('./ro.json'), bg: require('./bg.json'), hr: require('./hr.json'),
  sl: require('./sl.json'), sr: require('./sr.json'), lt: require('./lt.json'), lv: require('./lv.json'), et: require('./et.json'), uk: require('./uk.json'),
  es: require('./es.json'), pt: require('./pt.json'),
};
