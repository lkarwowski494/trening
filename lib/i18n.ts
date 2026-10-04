import { EN } from './i18n.en';

/*
 * Języki (T-040, LOC-01, ADR-027). Kluczem jest polski tekst źródłowy — kod czyta się jak dotąd,
 * a brak tłumaczenia pokazuje po prostu polski tekst zamiast pustego klucza. Kompletność słownika EN
 * pilnuje test (scripts/check-i18n.mjs): każde wywołanie t('…') w kodzie musi mieć wpis w i18n.en.ts.
 *
 * Wartości domenowe zapisane w danych (partie, sprzęt, typy) zostają polskimi identyfikatorami — tłumaczy
 * je tylko warstwa wyświetlania (t(wartość)), więc zmiana języka nie wymaga migracji danych.
 */

export type Lang = 'pl' | 'en';
export type LangSetting = 'auto' | Lang;

let deviceTag = 'pl-PL';
let current: Lang = 'pl';

/** Język systemu: polski → pl, każdy inny → en. Bez modułu natywnego (testy) → pl. */
export function detectLang(): Lang {
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const loc = (require('expo-localization') as typeof import('expo-localization')).getLocales()[0];
    deviceTag = loc?.languageTag || deviceTag;
    return loc?.languageCode === 'pl' ? 'pl' : 'en';
  } catch { return 'pl'; }
}
/** Język z ustawień; tag urządzenia czytany zawsze (także przy wymuszonym języku — np. English na brytyjskim telefonie → daty en-GB). */
export function applyLang(setting: LangSetting | undefined) { const sys = detectLang(); current = !setting || setting === 'auto' ? sys : setting; }
export const lang = () => current;
/** Locale do dat i liczb: pl-PL albo angielski tag urządzenia (en-GB, en-US…), domyślnie en-US. */
export const locale = () => current === 'pl' ? 'pl-PL' : (deviceTag.startsWith('en') ? deviceTag : 'en-US');

/** Tłumaczenie z interpolacją {nazwa}. */
/** Runda 55: tylko własne klucze słownika (tekst „constructor” nie zwraca funkcji). */
const enOf = (k: string): string | undefined => Object.prototype.hasOwnProperty.call(EN, k) ? EN[k] : undefined;
export function t(pl: string, params?: Record<string, string | number>): string {
  let s = current === 'en' ? (enOf(pl) ?? pl) : pl;
  if (params) for (const k of Object.keys(params)) s = s.split(`{${k}}`).join(String(params[k]));
  return s;
}

/**
 * Liczebnik: formy polskie 'jeden|kilka|wiele' (np. 'sesja|sesje|sesji'), angielskie w słowniku 'one|other'.
 * Zwraca samo słowo — liczbę wstawia wywołujący.
 */
export function tp(n: number, forms: string): string {
  const abs = Math.abs(n);
  if (!Number.isInteger(abs)) { if (current === 'en') { const f = (enOf(forms) ?? forms).split('|'); return f[1] ?? f[0]; } return forms.split('|')[2] ?? forms; } // ułamki: „2,5 serii”
  if (current === 'en') { const [one, other] = (enOf(forms) ?? forms).split('|'); return abs === 1 ? one : (other ?? one); }
  const [one, few, many] = forms.split('|');
  if (abs === 1) return one;
  const d = abs % 10, dd = abs % 100;
  return d >= 2 && d <= 4 && (dd < 12 || dd > 14) ? few : many;
}

/* ---------- nazwy ćwiczeń z biblioteki ---------- */
/** Nazwy biblioteki są w większości angielskie; tłumaczymy polskie nazwy i dopiski w nawiasach. */
const EX_FULL: Record<string, string> = {
  'Wyciskanie na linkach (stojąc)': 'Standing Cable Press', 'Wiosłowanie na linkach (siedząc)': 'Seated Cable Row (home)',
  'Wyciskanie nad głowę (linki)': 'Cable Overhead Press', 'Przysiad z pasem (linki)': 'Belt Squat (cable)',
  'Łydki na stopniu': 'Calf Raise on Step', 'Bieg': 'Running', 'Rower': 'Cycling', 'Skakanka': 'Jump Rope',
};
const EX_PAREN: Record<string, string> = { 'sztanga': 'Barbell', 'hantle': 'Dumbbell', 'hantel': 'Dumbbell', 'linki': 'Cable', 'ławka': 'Bench', 'bieżnia': 'Treadmill', 'hantle/linki': 'Dumbbell/Cable', 'dwie linki': 'Two Cables' /* katalog 04.10.2026 */ };
/** Nazwa ćwiczenia do wyświetlenia. Ćwiczenia własne i przemianowane pokazujemy tak, jak je nazwał użytkownik. */
export function exName(e: { name: string; lib?: boolean } | undefined | null): string {
  if (!e) return '?';
  if (current !== 'en' || !e.lib) return e.name;
  { const f = Object.prototype.hasOwnProperty.call(EX_FULL, e.name) ? EX_FULL[e.name] : undefined; if (f) return f; }
  return e.name.replace(/\(([^)]+)\)/g, (m, inner: string) => Object.prototype.hasOwnProperty.call(EX_PAREN, inner) ? `(${EX_PAREN[inner]})` : m);
}

// Język systemu od razu przy starcie modułu — ekran błędu startu (zanim wczytają się ustawienia) też jest przetłumaczony (runda 3).
applyLang('auto');

/** Runda 32: porównanie w wyszukiwaniu bez wielkości liter i polskich znaków („lydki” znajduje „Łydki”). */
const FOLD: Record<string, string> = { ą: 'a', ć: 'c', ę: 'e', ł: 'l', ń: 'n', ó: 'o', ś: 's', ź: 'z', ż: 'z' };
export const fold = (s: string) => s.toLowerCase().replace(/[ąćęłńóśźż]/g, ch => FOLD[ch] ?? ch).replace(/\s+/g, ' ').trim();
/** Runda 36: tekst w konkretnym języku danych (ustawienie 'auto' → język telefonu), niezależnie od bieżącego języka ekranu. */
export function tIn(setting: unknown, pl: string): string { const l = setting === 'pl' || setting === 'en' ? setting : detectLang(); return l === 'en' ? (enOf(pl) ?? pl) : pl; }
