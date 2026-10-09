import { catalogKey, type Exercise } from '@/lib/seed';
import { lang, type Lang } from '@/lib/i18n';

/*
 * Wskazówki techniki, etap 1 (decyzja właściciela 08.10.2026 ok. 23:50, wariant A etapami; research docs/research/26).
 * Własne sformułowania dla ćwiczeń bazowych biblioteki (seed.LIB_BASE_NAMES): ustawienie, ruch, 2–4 wskazówki, częste błędy.
 * Każda wskazówka ma ≥ 2 przeczytane źródła z różnych organizacji (data.json → „s”: [źródło, miejsce w źródle]);
 * dokument źródeł docs/research/27-wskazowki-zrodla.md generuje scripts/cues/gen.mjs (--check w verify).
 *
 * Dlaczego osobne dane, a nie klucze słownika t() (lib/locales): treść katalogu (nazwy ćwiczeń — exName) żyje poza słownikiem
 * interfejsu i jest związana z kluczem katalogu (Exercise.libKey), nie z tekstem na ekranie. Tu to samo: ok. 700 zdań × 26 języków
 * w słowniku UI potroiłoby lib/locales, a zdania mają stałe id (zmiana polskiego brzmienia nie gubi tłumaczeń), wspólne między
 * ćwiczeniami (jedno tłumaczenie zdania używanego w kilku ćwiczeniach) i źródła, których słownik UI nie ma gdzie zapisać.
 * Teksty: lib/cues/text/<język>.json (id zdania → tekst), komplet w każdym języku pilnuje tests/cues.test.tsx.
 */

export const CUE_SECTIONS = ['setup', 'move', 'tips', 'mistakes'] as const;
export type CueSection = typeof CUE_SECTIONS[number];
/** Odwołanie do źródła: [id źródła z data.json „sources”, miejsce w źródle (krok, sekcja), opcjonalnie „analogia” — inne ćwiczenie, nie liczy się
 * do ≥ 2 źródeł (audyt kontrolny 1 MER2-04; sprawdza scripts/cues/gen.mjs)]. */
export type CueRef = { c: string; s: ([string, string] | [string, string, 'analogia'])[] };
export type CueSource = { org: string; title: string; url: string; archive?: string; level: 2 | 3 | 4 };
/** Rodzaj organizacji źródła (podpis w aplikacji — audyt kontrolny 1 MER2-07 = SEC2-02, decyzja właściciela 09.10.2026 wariant A: bez nazw
 * organizacji i marek w tekstach aplikacji, pełna lista w docs/research/27): organizacja szkoleniowa (biblioteka ćwiczeń), serwis specjalistyczny,
 * producent sprzętu, badanie w recenzowanym czasopiśmie. Kolejność = kolejność w podpisie. */
export const CUE_BASIS_KINDS = ['org', 'site', 'maker', 'study'] as const;
export type CueBasisKind = typeof CUE_BASIS_KINDS[number];
type CueData = { orgs: Record<string, { name: string; level: 2 | 3 | 4; kind: CueBasisKind }>; sources: Record<string, CueSource>; exercises: Record<string, Record<CueSection, CueRef[]>>; open: Record<string, string> };

/* eslint-disable @typescript-eslint/no-var-requires */
export const CUE_DATA: CueData = require('./data.json');
/* SEC2-07 (audyt kontrolny 1, wzór PERF-05 z lib/locales/index.ts): słowniki zdań (26 × JSON, ok. 744 KB) wczytywane przy pierwszym odczycie zdania
 * w danym języku — `require` w funkcji wykonuje moduł dopiero przy wywołaniu (Metro i Jest); rezerwa en/pl dopiero, gdy zdania brakuje. */
const LOAD: Record<Lang, () => Record<string, string>> = {
  pl: () => require('./text/pl.json'), en: () => require('./text/en.json'), cs: () => require('./text/cs.json'), sk: () => require('./text/sk.json'),
  hu: () => require('./text/hu.json'), ro: () => require('./text/ro.json'), bg: () => require('./text/bg.json'), hr: () => require('./text/hr.json'),
  sl: () => require('./text/sl.json'), sr: () => require('./text/sr.json'), lt: () => require('./text/lt.json'), lv: () => require('./text/lv.json'),
  et: () => require('./text/et.json'), uk: () => require('./text/uk.json'), es: () => require('./text/es.json'), pt: () => require('./text/pt.json'),
  de: () => require('./text/de.json'), fr: () => require('./text/fr.json'), it: () => require('./text/it.json'), nl: () => require('./text/nl.json'),
  sv: () => require('./text/sv.json'), da: () => require('./text/da.json'), nb: () => require('./text/nb.json'), fi: () => require('./text/fi.json'),
  tr: () => require('./text/tr.json'), el: () => require('./text/el.json'),
};
const TEXT: Partial<Record<Lang, Record<string, string>>> = {};
const dict = (l: Lang): Record<string, string> => (TEXT[l] ??= LOAD[l]());
/* eslint-enable @typescript-eslint/no-var-requires */

const own = <T>(o: Record<string, T>, k: string): T | undefined => Object.prototype.hasOwnProperty.call(o, k) ? o[k] : undefined;
/** Tekst zdania w języku `l`; brak → angielski, brak → polski (jak t()). */
export function cueText(id: string, l: Lang = lang()): string { return own(dict(l), id) ?? own(dict('en'), id) ?? own(dict('pl'), id) ?? id; }
/** Słownik zdań języka (testy kompletności). */
export const cueDict = (l: Lang): Readonly<Record<string, string>> => dict(l);

export type ExerciseCues = { key: string; sections: { id: CueSection; items: string[] }[]; basis: CueBasisKind[] };
/** Wskazówki ćwiczenia z biblioteki (po kluczu katalogu — przemianowane też je mają); własne ćwiczenia i ćwiczenia bez wskazówek → null. */
export function cuesFor(e: Pick<Exercise, 'lib' | 'libKey'> | null | undefined, l: Lang = lang()): ExerciseCues | null {
  const key = catalogKey(e); if (!key) return null;
  const x = own(CUE_DATA.exercises, key); if (!x) return null;
  const sections = CUE_SECTIONS.map(id => ({ id, items: (x[id] ?? []).map(r => cueText(r.c, l)) })).filter(s => s.items.length);
  return { key, sections, basis: cueBasis(key) };
}
/** Rodzaje źródeł wskazówek ćwiczenia (podpis „Na podstawie: …” — MER2-07: opis ogólny zamiast nazw), w kolejności CUE_BASIS_KINDS. */
export function cueBasis(key: string): CueBasisKind[] {
  const kinds = new Set(cueOrgs(key).map(o => own(CUE_DATA.orgs, o)?.kind));
  return CUE_BASIS_KINDS.filter(k => kinds.has(k));
}
/** Organizacje, na których opierają się wskazówki ćwiczenia (dokument źródeł; w aplikacji tylko rodzaje — cueBasis), w kolejności pierwszego użycia. */
export function cueOrgs(key: string): string[] {
  const x = own(CUE_DATA.exercises, key); if (!x) return [];
  const out: string[] = [];
  for (const sec of CUE_SECTIONS) for (const r of x[sec] ?? []) for (const [sid] of r.s) { const o = own(CUE_DATA.sources, sid)?.org; if (o && !out.includes(o)) out.push(o); }
  return out;
}
