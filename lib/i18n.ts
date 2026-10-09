import { EN } from './i18n.en';
import { LOCALES } from './locales';
import { pluralIndex } from './plural';

/*
 * Języki (T-040, LOC-01, ADR-027). Kluczem jest polski tekst źródłowy — kod czyta się jak dotąd,
 * a brak tłumaczenia pokazuje po prostu polski tekst zamiast pustego klucza. Kompletność słownika EN
 * pilnuje test (scripts/check-i18n.mjs): każde wywołanie t('…') w kodzie musi mieć wpis w i18n.en.ts.
 *
 * Wartości domenowe zapisane w danych (partie, sprzęt, typy) zostają polskimi identyfikatorami — tłumaczy
 * je tylko warstwa wyświetlania (t(wartość)), więc zmiana języka nie wymaga migracji danych.
 */

/** Języki aplikacji (decyzja właściciela 05.10.2026: Europa Środkowo-Wschodnia + hiszpański i portugalski; 07.10.2026 wariant B: + niemiecki, francuski,
 * włoski, niderlandzki, szwedzki, duński, norweski (bokmål), fiński, turecki, grecki; 09.10.2026 fala 1 nowych języków: hiszpański Ameryki Łacińskiej
 * es-419 i portugalski brazylijski pt-BR — docs/18; fala 2: indonezyjski, malajski, wietnamski — docs/16; fala 3: rosyjski — docs/16). Kolejność = lista w ustawieniach. */
export const LANGS = ['pl', 'en', 'cs', 'sk', 'hu', 'ro', 'bg', 'hr', 'sl', 'sr', 'lt', 'lv', 'et', 'uk', 'es', 'es-419', 'pt', 'pt-BR', 'de', 'fr', 'it', 'nl', 'sv', 'da', 'nb', 'fi', 'tr', 'el', 'id', 'ms', 'vi', 'ru'] as const;
export type Lang = typeof LANGS[number];
export type LangSetting = 'auto' | Lang;
/** Nazwa języka w nim samym (lista w ustawieniach). */
export const LANG_NAME: Record<Lang, string> = { pl: 'Polski', en: 'English', cs: 'Čeština', sk: 'Slovenčina', hu: 'Magyar', ro: 'Română', bg: 'Български', hr: 'Hrvatski', sl: 'Slovenščina', sr: 'Српски', lt: 'Lietuvių', lv: 'Latviešu', et: 'Eesti', uk: 'Українська', es: 'Español (España)', 'es-419': 'Español (Latinoamérica)', pt: 'Português (Portugal)', 'pt-BR': 'Português (Brasil)', de: 'Deutsch', fr: 'Français', it: 'Italiano', nl: 'Nederlands', sv: 'Svenska', da: 'Dansk', nb: 'Norsk', fi: 'Suomi', tr: 'Türkçe', el: 'Ελληνικά', id: 'Bahasa Indonesia', ms: 'Bahasa Melayu', vi: 'Tiếng Việt', ru: 'Русский' };
/** Nazwa aplikacji pod ikoną i w tekstach (folder w Plikach, Zdrowie, powiadomienia, stopka). Decyzja właściciela 05.10.2026 (potwierdzona 06.10):
 * lokalne słowo tam, gdzie jest podobne do „Trening” (to samo co nazwa zakładki), w pozostałych językach „Training”. Teksty biorą ją parametrem {app}
 * (jedno źródło); test i18n-locales pilnuje locales/<kod>.json (CFBundleDisplayName) i store/app-store-names.json. */
export const APP_NAME: Record<Lang, string> = { pl: 'Trening', en: 'Training', cs: 'Trénink', sk: 'Tréning', hu: 'Training', ro: 'Training', bg: 'Training', hr: 'Trening', sl: 'Trening', sr: 'Тренинг', lt: 'Treniruotė', lv: 'Treniņš', et: 'Treening', uk: 'Training', es: 'Training', 'es-419': 'Training', pt: 'Treino', 'pt-BR': 'Treino', de: 'Training', fr: 'Training', it: 'Training', nl: 'Training', sv: 'Träning', da: 'Træning', nb: 'Trening', fi: 'Treeni', tr: 'Training', el: 'Training', id: 'Training', ms: 'Training', vi: 'Training', ru: 'Training' /* fala 3: „Тренировка” niepodobne do „Trening” (jak uk) */ };
/** Domyślny tag regionu do dat i liczb, gdy telefon ma inny region. */
const TAG: Record<Lang, string> = { pl: 'pl-PL', en: 'en-US', cs: 'cs-CZ', sk: 'sk-SK', hu: 'hu-HU', ro: 'ro-RO', bg: 'bg-BG', hr: 'hr-HR', sl: 'sl-SI', sr: 'sr-RS', lt: 'lt-LT', lv: 'lv-LV', et: 'et-EE', uk: 'uk-UA', es: 'es-ES', 'es-419': 'es-419', pt: 'pt-PT', 'pt-BR': 'pt-BR', de: 'de-DE', fr: 'fr-FR', it: 'it-IT', nl: 'nl-NL', sv: 'sv-SE', da: 'da-DK', nb: 'nb-NO', fi: 'fi-FI', tr: 'tr-TR', el: 'el-GR', id: 'id-ID', ms: 'ms-MY', vi: 'vi-VN', ru: 'ru-RU' };
export const isLang = (x: unknown): x is Lang => typeof x === 'string' && (LANGS as readonly string[]).includes(x);
/** Warianty regionalne (fala 1, 09.10.2026, wariant B): słownik wariantu zawiera tylko teksty różne od języka bazowego (lib/locales/<kod>.json
 * nakładany na bazowy — lib/locales/index.ts, lib/cues/index.ts); liczba mnoga, wielkie litery i porównania jak w języku bazowym. */
export const BASE_LANG: Partial<Record<Lang, Lang>> = { 'es-419': 'es', 'pt-BR': 'pt' };
export const baseLang = (l: Lang): Lang => BASE_LANG[l] ?? l;
/** Regiony, w których hiszpański dziedziczy po es-419 (CLDR supplementalData.xml, parentLocales: parent="es_419"); dodatkowo sam kod 419. */
export const ES_419_REGIONS = ['419', 'AR', 'BO', 'BR', 'BZ', 'CL', 'CO', 'CR', 'CU', 'DO', 'EC', 'GT', 'HN', 'JP', 'MX', 'NI', 'PA', 'PE', 'PR', 'PY', 'SV', 'US', 'UY', 'VE'] as const;
/** Przestarzałe kody języka (CLDR supplementalMetadata.xml, languageAlias: „in” → „id”, „zsm” → „ms”) — fala 2 (09.10.2026). */
const LANG_ALIAS: Record<string, string> = { in: 'id', zsm: 'ms' };
/**
 * Język aplikacji dla tagu języka telefonu (BCP 47, np. „pt-BR”, „es-419”, „es_MX”, „sr-Latn-RS”). Obsługiwany → ten, inny → angielski.
 * Portugalski: region BR albo sam „pt” (CLDR likelySubtags: pt → pt_Latn_BR) → pt-BR; każdy inny region (PT oraz dziedziczące po pt_PT: AO, MZ, CV…) → pt.
 * Hiszpański: region z ES_419_REGIONS → es-419; ES, inne (GQ, PH, EA, IC…) i sam „es” (CLDR: es → es_Latn_ES) → es.
 */
export function resolveLang(tag: string | null | undefined, code?: string | null): Lang {
  const parts = (tag || code || '').split(/[-_]/); const base0 = (code || parts[0] || '').toLowerCase();
  const base = LANG_ALIAS[base0] ?? base0;
  const region = (parts.slice(1).find(x => /^([A-Za-z]{2}|\d{3})$/.test(x)) ?? '').toUpperCase();
  if (base === 'pt') return !region || region === 'BR' ? 'pt-BR' : 'pt';
  if (base === 'es') return (ES_419_REGIONS as readonly string[]).includes(region) ? 'es-419' : 'es';
  return isLang(base) ? base : 'en';
}

let deviceTag = 'pl-PL';
let current: Lang = 'pl';

/** Język systemu: obsługiwany → ten, każdy inny → angielski. Bez modułu natywnego (testy) → pl. */
export function detectLang(): Lang {
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const loc = (require('expo-localization') as typeof import('expo-localization')).getLocales()[0];
    deviceTag = loc?.languageTag || deviceTag;
    return resolveLang(loc?.languageTag, loc?.languageCode);
  } catch { return 'pl'; }
}
/** Język z ustawień; tag urządzenia czytany zawsze (także przy wymuszonym języku — np. English na brytyjskim telefonie → daty en-GB). */
export function applyLang(setting: LangSetting | undefined) { const sys = detectLang(); current = !setting || setting === 'auto' || !isLang(setting) ? sys : setting; }
export const lang = () => current;
export const appName = () => APP_NAME[current];
/** Locale do dat i liczb: region telefonu, gdy pasuje do języka (en-GB, pt-BR…), inaczej domyślny region języka. */
/* Audyt ac5d764 LOW 2: porównanie po podtagu języka; serbski interfejs jest cyrylicą, więc daty też (telefon może mieć sr-Latn). */
/** Regiony, w których ciężary podaje się zwyczajowo w funtach (H4 / UX-12, audyt 0.10) — tylko domyślna jednostka świeżej instalacji
 * (uproszczenie produktowe, nie twierdzenie pokazywane w aplikacji; jednostkę zmienia się w Ustawieniach). */
export const LB_REGIONS = ['US', 'LR', 'MM'] as const;
/** Domyślna jednostka masy z regionu urządzenia (np. en-US → lb). */
export function deviceUnit(tag: string = deviceTag): 'kg' | 'lb' { const r = (tag.split(/[-_]/).find((x, i) => i > 0 && /^[A-Za-z]{2}$/.test(x)) ?? '').toUpperCase(); return (LB_REGIONS as readonly string[]).includes(r) ? 'lb' : 'kg'; }
export const locale = () => current === 'pl' ? 'pl-PL' : current === 'sr' ? 'sr-Cyrl-RS' : deviceTag.split(/[-_]/)[0].toLowerCase() === baseLang(current) ? deviceTag : TAG[current];
/** Przecinek dziesiętny w polach liczbowych — ten sam separator co w fmtNum (audyt ac5d764 MEDIUM 1: dotąd tylko po polsku). */
let commaCache: [string, boolean] | null = null; /* audyt cd60eec LOW: bez toLocaleString przy każdym renderze pola */
export const decimalComma = () => { const l = locale(); if (commaCache?.[0] === l) return commaCache[1]; let c: boolean; try { c = (1.5).toLocaleString(l).includes(','); } catch { c = current !== 'en'; } commaCache = [l, c]; return c; };

/** Runda 55: tylko własne klucze słownika (tekst „constructor” nie zwraca funkcji). */
const own = (d: Record<string, string> | undefined, k: string): string | undefined => d && Object.prototype.hasOwnProperty.call(d, k) ? d[k] : undefined;
const dictOf = (l: Lang): Record<string, string> | undefined => l === 'en' ? EN : LOCALES[l];
/** Tekst w języku `l`: polski — klucz; inne — słownik języka, brak → angielski, brak → polski. */
function lookup(l: Lang, pl: string): string { return l === 'pl' ? pl : own(dictOf(l), pl) ?? own(EN, pl) ?? pl; }
const enOf = (k: string): string | undefined => own(EN, k);
/** Tłumaczenie z interpolacją {nazwa}. */
export function t(pl: string, params?: Record<string, string | number>): string {
  let s = lookup(current, pl);
  if (params) for (const k of Object.keys(params)) s = s.split(`{${k}}`).join(String(params[k]));
  return s;
}
/** Etykieta zapisana parą {pl, en} (sprzęt, presety): polski / angielski wprost, inne języki — słownik po polskim tekście, brak → angielski. */
export function lbl(x: { pl: string; en: string }): string { return current === 'pl' ? x.pl : current === 'en' ? x.en : own(LOCALES[current], x.pl) ?? x.en; }

/**
 * Liczebnik: formy polskie 'jeden|kilka|wiele' (np. 'sesja|sesje|sesji'); w słownikach innych języków formy w kolejności
 * z lib/plural.ts PLURAL_FORMS (np. cs 'one|few|other'). Zwraca samo słowo — liczbę wstawia wywołujący.
 */
export function tp(n: number, forms: string): string {
  const pick = (l: Lang, v: string) => { const f = v.split('|'); return f[Math.min(pluralIndex(l, n), f.length - 1)]; };
  if (current === 'pl') return pick('pl', forms);
  const mine = own(dictOf(current), forms); if (mine) return pick(current, mine);
  const en = enOf(forms); return en ? pick('en', en) : pick('pl', forms);
}

/* ---------- nazwy ćwiczeń z biblioteki ---------- */
/** Nazwy biblioteki są w większości angielskie; tłumaczymy polskie nazwy i dopiski w nawiasach. */
const EX_FULL: Record<string, string> = {
  'Wyciskanie na linkach (stojąc)': 'Standing Cable Press', 'Wiosłowanie na linkach (siedząc)': 'Seated Cable Row (home)',
  'Wyciskanie nad głowę (linki)': 'Cable Overhead Press', 'Przysiad z pasem (linki)': 'Belt Squat (cable)',
  'Łydki na stopniu': 'Calf Raise on Step', 'Bieg': 'Running', 'Rower': 'Cycling', 'Skakanka': 'Jump Rope', 'Orbitrek': 'Elliptical',
  /* SEC2-01 (09.10.2026): nazwy ogólne zamiast znaków towarowych (lib/seed.ts LIB_DISPLAY_NAME) */ 'Rower powietrzny': 'Air Bike', 'Ergometr narciarski': 'Ski Ergometer',
};
const EX_PAREN: Record<string, string> = { 'sztanga': 'Barbell', 'hantle': 'Dumbbell', 'hantel': 'Dumbbell', 'linki': 'Cable', 'ławka': 'Bench', 'bieżnia': 'Treadmill', 'hantle/linki': 'Dumbbell/Cable', 'hantel/linka': 'Dumbbell/Cable', 'dwie linki': 'Two Cables' /* katalog 04.10.2026 */, 'talerz': 'Plate' /* research biblioteki 09.10.2026: Lying Neck Extension (talerz) */, 'półkula balansowa': 'Balance Dome' /* SEC2-01 */ };
/** Nazwa ćwiczenia do wyświetlenia. Ćwiczenia własne i przemianowane pokazujemy tak, jak je nazwał użytkownik. */
export function exName(e: { name: string; lib?: boolean } | undefined | null): string {
  if (!e) return '?';
  if (current === 'pl' || !e.lib) return e.name; /* inne języki: nazwy biblioteki po angielsku (jak na siłowniach) */
  { const f = Object.prototype.hasOwnProperty.call(EX_FULL, e.name) ? EX_FULL[e.name] : undefined; if (f) return f; }
  return e.name.replace(/\(([^)]+)\)/g, (m, inner: string) => Object.prototype.hasOwnProperty.call(EX_PAREN, inner) ? `(${EX_PAREN[inner]})` : m);
}

// Język systemu od razu przy starcie modułu — ekran błędu startu (zanim wczytają się ustawienia) też jest przetłumaczony (runda 3).
applyLang('auto');

/** Runda 32: porównanie w wyszukiwaniu bez wielkości liter i znaków diakrytycznych („lydki” znajduje „Łydki”, „cestina” — „Čeština”). */
const FOLD: Record<string, string> = { ł: 'l', đ: 'd', ø: 'o', ß: 'ss' };
/** PERF-01/05 (audyt 0.10): jeden Intl.Collator na język zamiast localeCompare(…, locale()) w każdym porównaniu (sortowanie 854+ ćwiczeń). */
let coll: { tag: string; c: Intl.Collator } | null = null;
export const collator = (): Intl.Collator => { const tag = locale(); if (!coll || coll.tag !== tag) coll = { tag, c: new Intl.Collator(tag) }; return coll.c; };
export const fold = (s: string) => s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[łđøß]/g, ch => FOLD[ch] ?? ch).replace(/\s+/g, ' ').trim();
/**
 * Audyt 0.10 (A11-02): wielkie litery zgodnie z językiem — zamiast `textTransform: 'uppercase'`, które iOS robi bez języka
 * ([NSString uppercaseString]): po grecku wersaliki bez tonosu (ΓΕΝΙΚΑ, nie ΓΕΝΙΚΆ; dialytika zostaje, „άι” → „ΑΪ”), po turecku i → İ.
 * Bez zależności od toLocaleUpperCase (Hermes nie gwarantuje reguł języka).
 */
/** Języki, w których wersaliki zależą od języka (tu robi je upper(); w pozostałych systemowe textTransform daje ten sam wynik co reguły CLDR — test). */
export const LOCALE_UPPER: readonly Lang[] = ['el', 'tr'];
export function upper(s: string, l: Lang = current): string {
  if (l === 'tr') return s.replace(/i/g, 'İ').toUpperCase();
  if (l !== 'el') return s.toUpperCase();
  const d = s.normalize('NFD');
  let out = '';
  for (let i = 0; i < d.length; i++) {
    const ch = d[i];
    if (ch === '́') {
      /* tonos na pierwszej samogłosce dwuznaku (άι, έυ…): w wersalikach druga dostaje dialytikę, żeby nie czytać jej jako dwuznaku */
      const prev = d[i - 1], next = d[i + 1], after = d[i + 2];
      const letter = (c?: string) => !!c && /\p{L}/u.test(c);
      if (prev && /[ηΗ]/.test(prev) && !letter(d[i - 2]) && !letter(next)) { out += ch; continue; } /* samodzielne „ή” (= albo) zachowuje akcent: Ή */
      if (prev && /[αεοηΑΕΟΗ]/.test(prev) && next && /[ιυΙΥ]/.test(next) && after !== '̈') { out += next + '̈'; i++; }
      continue;
    }
    out += ch;
  }
  return out.toUpperCase().normalize('NFC');
}

/**
 * Audyt 0.10 (A11-19): bez złamań linii między liczbą a sąsiednim wyrazem („1 / rekord”, „seria 1 z / 4”) i po półpauzie zakresu („8– / 12”):
 * spacja nierozdzielająca (NBSP) i łącznik bez szerokości (U+2060) po „–” między cyframi. Tylko do wyświetlania.
 */
export const glue = (s: string) => s.replace(/(\d) (?=\p{L})/gu, '$1\u00a0').replace(/(\p{L}) (?=\d)/gu, '$1\u00a0').replace(/(\d)–(?=\d)/g, '$1–\u2060');

/** Runda 36: tekst w konkretnym języku danych (ustawienie 'auto' → język telefonu), niezależnie od bieżącego języka ekranu. */
export function tIn(setting: unknown, pl: string): string { const l = isLang(setting) ? setting : detectLang(); return lookup(l, pl); }
