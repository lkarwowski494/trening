/*
 * Liczba mnoga dla języków aplikacji (decyzja właściciela 05.10.2026: języki Europy Środkowo-Wschodniej + hiszpański i portugalski).
 * Reguły CLDR dla liczb całkowitych, zapisane ręcznie (bez zależności od Intl.PluralRules w Hermesie). Ułamek → ostatnia forma.
 * Formy w słowniku: kolejne warianty rozdzielone „|”, w kolejności z PLURAL_FORMS (np. cs: 'one|few|other').
 */
export const PLURAL_FORMS = {
  pl: ['one', 'few', 'many'], en: ['one', 'other'], cs: ['one', 'few', 'other'], sk: ['one', 'few', 'other'], hu: ['one', 'other'],
  ro: ['one', 'few', 'other'], bg: ['one', 'other'], hr: ['one', 'few', 'other'], sl: ['one', 'two', 'few', 'other'], sr: ['one', 'few', 'other'],
  lt: ['one', 'few', 'other'], lv: ['zero', 'one', 'other'], et: ['one', 'other'], uk: ['one', 'few', 'many'], es: ['one', 'other'], pt: ['one', 'other'],
  /* 09.10.2026 (fala 1): es-419 jak es; pt-BR jak fr — „one” = 0 i 1 (CLDR plurals.xml: locales="fr pt" one: i = 0..1; pt_PT osobno: i = 1) */ 'es-419': ['one', 'other'], 'pt-BR': ['one', 'other'],
  /* 07.10.2026 (wariant B): dla liczb całkowitych dwie formy; fr: „one” = 0 i 1 */
  /* 09.10.2026 (fala 2): id, ms, vi — bez odmiany liczby, jedna forma „other” (CLDR plurals.xml: <pluralRules locales="… id … ms … vi …"> tylko other) */
  id: ['other'], ms: ['other'], vi: ['other'],
  de: ['one', 'other'], fr: ['one', 'other'], it: ['one', 'other'], nl: ['one', 'other'], sv: ['one', 'other'], da: ['one', 'other'], nb: ['one', 'other'], fi: ['one', 'other'], tr: ['one', 'other'], el: ['one', 'other'],
} as const;
export type PluralLang = keyof typeof PLURAL_FORMS;

/** Indeks formy dla liczby `n` w języku `l`. */
export function pluralIndex(l: PluralLang, n: number): number {
  const forms = PLURAL_FORMS[l]; const last = forms.length - 1; const a = Math.abs(n);
  if (!Number.isInteger(a)) return last;
  const d = a % 10, dd = a % 100;
  const slavic = () => (d === 1 && dd !== 11 ? 0 : d >= 2 && d <= 4 && (dd < 12 || dd > 14) ? 1 : 2);
  switch (l) {
    case 'pl': return a === 1 ? 0 : d >= 2 && d <= 4 && (dd < 12 || dd > 14) ? 1 : 2;
    case 'cs': case 'sk': return a === 1 ? 0 : a >= 2 && a <= 4 ? 1 : 2;
    case 'uk': case 'hr': case 'sr': return slavic();
    case 'lt': return d === 1 && (dd < 11 || dd > 19) ? 0 : d >= 2 && d <= 9 && (dd < 11 || dd > 19) ? 1 : 2;
    case 'lv': return d === 0 || (dd >= 11 && dd <= 19) ? 0 : d === 1 && dd !== 11 ? 1 : 2;
    case 'sl': return dd === 1 ? 0 : dd === 2 ? 1 : dd === 3 || dd === 4 ? 2 : 3;
    case 'ro': return a === 1 ? 0 : a === 0 || (dd >= 1 && dd <= 19) ? 1 : 2;
    case 'fr': case 'pt-BR': return a === 0 || a === 1 ? 0 : 1;
    case 'id': case 'ms': case 'vi': return 0; /* jedna forma */
    default: return a === 1 ? 0 : 1; /* en, hu, bg, et, es, es-419, pt, de, it, nl, sv, da, nb, fi, tr, el */
  }
}
