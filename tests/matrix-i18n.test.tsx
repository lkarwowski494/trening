/*
 * Języki — jakość słowników, liczba mnoga wg CLDR, daty i liczby, długie teksty (polecenie właściciela 06.10.2026: najpełniejsze darmowe
 * testy automatyczne; docs/20 rodzaj 7). Uzupełnia — nie powtarza:
 *  - tests/i18n-locales.test.ts: komplet kluczy, {parametry} każdego słownika, liczba form, litery ąęłńśźż w każdym słowniku, nazwa aplikacji;
 *  - scripts/check-i18n.mjs: każdy t()/tp() w kodzie ma wpis EN z tymi samymi {parametrami};
 *  - tests/matrix-dim-langs1–4: ekrany w każdym języku bez polskich tekstów, separator dziesiętny w opisie serii i CSV.
 * Tu: słownik EN tak samo jak 14 pozostałych (litery polskie, formy mnogie), litery ć/ó tam, gdzie język ich nie ma, tekst identyczny
 * z polskim tylko z listy z powodem, białe znaki, nawiasy {…}, mieszanie alfabetów, interpunkcja końcowa; liczba mnoga — indeks formy
 * z lib/plural.ts porównany z Intl.PluralRules (CLDR) dla n = 0…10 000 i tp() na każdym wpisie; fmtDate/fmtTime/fmtNum/locale()/
 * decimalComma() w każdym języku i regionie telefonu; szacunek szerokości najdłuższych tłumaczeń w elementach o stałej szerokości.
 */
import { EN } from '@/lib/i18n.en';
import { LOCALES } from '@/lib/locales';
import { LANGS, APP_NAME, LANG_NAME, applyLang, tp, locale, decimalComma, lang, type Lang } from '@/lib/i18n';
import { PLURAL_FORMS, pluralIndex } from '@/lib/plural';
import { allLabels } from '@/lib/equipment';
import { fmtDate, fmtTime } from '@/lib/store';
import { fmtNum } from '@/lib/units';

const NON_PL = LANGS.filter(l => l !== 'pl');
const dictOf = (l: Lang): Record<string, string> => l === 'en' ? EN : (LOCALES[l] ?? {});
/** Polskie teksty źródłowe (jak tests/i18n-locales.test.ts source(): słownik EN + etykiety sprzętu). */
const SOURCE: string[] = [...new Set([...Object.keys(EN), ...allLabels().map(x => x.pl)])];
const PLURAL_KEYS = Object.keys(EN).filter(k => k.includes('|'));
const entries = (l: Lang) => Object.entries(dictOf(l));

/* ======================================================================================================================== */
/* Tekst identyczny z polskim kluczem — dozwolony tylko z powodem. Lista ma być minimalna: test niżej pilnuje, że każdy wpis jest użyty. */
/** We wszystkich językach: nazwy własne (marki i modele sprzętu), symbole/wzory oraz angielskie nazwy z siłowni, których polski tekst
 * źródłowy używa bez tłumaczenia (te same w innych językach — tak jak nazwy ćwiczeń z biblioteki po angielsku, lib/i18n.ts exName). */
const SAME_ANY = new Set([
  /* marki i modele (nazwy własne) */ 'Beyond Power Voltra I (5–200 lb)', 'Gymtek 2,5–24 kg', 'Hop-Sport 2×10 kg', 'ViShape SmartGym Lite (1,5–35 kg/str.)', 'ViShape SmartGym Pro (1,5–65 kg/str.)',
  /* symbole i wzory */ '{k}: {v}', 'max ±', 'e1RM', '{n} min' /* jednostka (generator, 08.10.2026) */, '{n} s', '{n} h', '{n} m', '{n} km', 'max' /* jednostki SI i skrót — audyt 0.10 A11-17 (cyrylica i el mają własne) */, 'Rekord: {list}' /* „rekord” w wielu językach (A11-18, etykieta plakietki PR) */,
  /* angielskie terminy siłowni użyte w polskim źródle */ 'drop set', '+ drop set', 'Drop set (D)', 'superset', 'Deload' /* termin (tytuł tematu przewodnika, 08.10.2026) */, 'core', 'kettlebell', 'Kettlebell', 'landmine', 'T-bar', 'trap bar', 'kettlebell: {v}' /* 07.10.2026: podpis grafiki na karcie */,
  'GHD', 'GHD (glute-ham developer)', 'glute-ham raise', 'reverse hyper', 'ski erg', 'Ski erg', 'Strongman', 'hack squat', 'Hack squat', 'pendulum squat', 'Pendulum squat',
  'butterfly (pec deck)', 'Butterfly (pec deck)', 'tempo', 'biceps', 'triceps',
  /* zapożyczenia międzynarodowe (to samo słowo w języku docelowym) */ 'cardio', 'Cardio', 'Backup', 'Start', '▶ Start' /* audyt 0.10 (LIVE-06): przycisk karty jak „Start” */, 'start {u}', 'Start: {name}', 'Hotel',
]);
/** W jednym języku: wyraz pokrewny o tym samym zapisie i znaczeniu (słowa sprawdzone w języku docelowym). */
const SAME_IN: Partial<Record<Lang, string[]>> = {
  cs: ['guma: {v}' /* guma (07.10.2026) */, '{n} z {all}', '{n} z {m}' /* „z” = z (czes.) */, '{u}/str.' /* strana */, '+ Guma', 'guma', 'Guma', 'gumy', 'Gumy' /* guma */, 'do', 'od', 'krok', 'obj.' /* objem */, 'REKORDY', 'Guma: {b}' /* guma (A11-18: etykieta bez instrukcji) */ /* „pauza” (08.10.2026) usunięte 09.10.2026: pauza treningu = „pozastavit”, A11-01 */],
  sk: ['guma: {v}' /* guma (07.10.2026) */, '{n} z {all}', '{n} z {m}', '{u}/str.', '+ Guma', 'guma', 'Guma', 'gumy', 'Gumy', 'do', 'od', 'krok', 'obj.', 'REKORDY', 'nie', 'Nie' /* „nie” = nie (słow.) */, 'Partia' /* svalová partia */, 'sek.', 'Teraz: {v}' /* teraz = teraz (słow.) */, 'Guma: {b}' /* A11-18 */ /* „pauza” usunięte 09.10.2026: pauza treningu = „pozastaviť”, A11-01 */],
  hr: ['guma: {v}' /* guma (07.10.2026) */, 'Masa' /* masa = masa (chorw., cel generatora 08.10.2026) */, '{u}/str.' /* strana */, 'do', 'od', 'Dom', 'normalna', 'sek.', 'Trening' /* APP_NAME.hr */, 'pauza', '⏸ Pauza' /* pauza = pauza (08.10.2026) */, 'Dodaj trening' /* „dodaj” = dodaj (08.10.2026) */, 'Plan do {date}' /* plan do = plan do (chorw.; nazwa planu bez nazwy po wyłączeniu, audyt 0.10 B2) */],
  sl: ['{u}/str.' /* stran */, 'do', 'od', 'Dom', 'sek.', 'Trening' /* APP_NAME.sl */, 'Treningi' /* sl: mn. „trening” — to samo słowo */, 'Dodaj trening' /* „dodaj” = dodaj (08.10.2026) */],
  ro: ['seria {n}', 'Seria {n}', 'Seria {n} — {ex}', 'serii', 'e1RM {v} (seria {s})' /* rum. seria = seria (forma z rodzajnikiem), serii = serie */],
  lt: ['guma: {v}' /* guma (07.10.2026) */, '{u}/hant.' /* hantelis */, '+ Guma', 'guma', 'Guma', 'Guma: {b}' /* guma */, 'sek.'],
  lv: ['{u}/hant.' /* hantele */, 'sek.'],
  et: ['{u}/hant.', '{u}/hantel' /* hantel (est.) */],
  es: ['Dieta', 'Lista', 'Masa' /* masa (hiszp., cel generatora 08.10.2026) */], pt: ['Dieta', 'Lista'] /* lista = lista (hiszp., port.) */, hu: ['Lista'] /* lista = lista (węg.) */,
  /* 07.10.2026 (wariant B) — te same słowa w języku docelowym */
  it: ['Dieta', 'serie' /* wł. serie = serie (l.mn.) */, 'Serie' /* nagłówek kafelka (08.10.2026) */], sv: ['(kopia)' /* kopia (szw.) */, '{u}/hantel', 'e1RM (Epley, per hantel)', 'per hantel (×2)' /* hantel, per (szw.) */, 'Lista', 'sek.'],
  da: ['sek.'], nb: ['sek.', 'Trening' /* APP_NAME.nb */], fi: ['Historia', 'Lista' /* fiń. historia, lista */],
  en: ['Folder' /* folder (ang.) — 07.10.2026 wieczór, foldery szablonów */],
};
const sameOk = (l: Lang, k: string) => SAME_ANY.has(k) || (SAME_IN[l] ?? []).includes(k);

/* Litery polskie, których dany język nie ma (ąęłńśźż w każdym słowniku sprawdza i18n-locales — tu ć i ó oraz cały komplet w EN). */
const HAS_C_ACUTE: Lang[] = ['hr']; /* chorwacki: ć; serbski w aplikacji cyrylicą */
const HAS_O_ACUTE: Lang[] = ['cs', 'sk', 'hu', 'es', 'pt', 'nl' /* niderl. akcent wyróżniający: „vóór”, „óf” (07.10.2026) */];
const plLeak = (l: Lang): RegExp => l === 'en' ? /[ąćęłńóśźżĄĆĘŁŃÓŚŹŻ]/ : new RegExp(`[${HAS_C_ACUTE.includes(l) ? '' : 'ćĆ'}${HAS_O_ACUTE.includes(l) ? '' : 'óÓ'}]`);

/* Interpunkcja końcowa: ta sama klasa co w kluczu (. ? ! : …). Kropka skrótu to nie koniec zdania: polskie skróty po stronie klucza
 * i krótkie skróty (≤ 3 wyrazy, ostatni ≤ 6 liter) po stronie tłumaczenia (np. „peso máx.”, „vnt.”). */
const PL_ABBR = /(?:^|[\s/(])(pow|rozgrz|sek|obj|poprz|hant|str|ćw|max|maks|godz|min|kg)\.$/i;
const endCls = (s: string, greek = false) => { const m = s.trimEnd().match(/(\.\.\.|[.?!:…;\u037e])$/); if (!m) return ''; const c = m[1] === '...' ? '…' : m[1]; return c === ';' || c === '\u037e' ? (greek ? '?' : '') : c; }; /* el: „;” = znak zapytania (07.10.2026) */
const isAbbrevEnd = (s: string) => /(?:^|[\s/(])\p{L}{1,6}\.$/u.test(s) && s.trim().split(/\s+/).filter(w => /\p{L}/u.test(w)).length <= 3; /* „+ plage de rép.” — znak „+” to nie wyraz */
function punctMismatch(k: string, v: string, l?: Lang): boolean {
  const a = endCls(k), b = endCls(v, l === 'el'); if (a === b) return false;
  if (a === '.' && b === '' && PL_ABBR.test(k)) return false; /* „max pow.” → „max reps” */
  if (a === '' && b === '.' && isAbbrevEnd(v)) return false; /* „max ciężar” → „peso máx.” */
  if (a === '.' && b === '' && isAbbrevEnd(k) && !/\s/.test(v.trim().replace(/\{\w+\}/g, ''))) return false;
  return true;
}

describe('słowniki — jakość tekstów w każdym języku', () => {
  /* @matrix LANGS */
  test('źródło: klucze bez zbędnych spacji i z poprawnymi nawiasami {param}', () => {
    expect(SOURCE.filter(k => k !== k.trim() || / {2}/.test(k) || /[\t\n]/.test(k))).toEqual([]);
    expect(SOURCE.filter(k => /[{}]/.test(k.replace(/\{\w+\}/g, '')))).toEqual([]);
  });
  test.each(NON_PL)('%s: bez spacji na początku/końcu, podwójnych spacji, tabulatorów i nowych linii (poza tymi z klucza)', l => {
    expect(entries(l).filter(([k, v]) => v !== v.trim() || (/ {2}/.test(v) && !/ {2}/.test(k)) || (/[\t\n\r]/.test(v) && !/[\t\n\r]/.test(k))).map(([k, v]) => `${k} → ${JSON.stringify(v)}`)).toEqual([]);
  });
  test.each(NON_PL)('%s: nawiasy klamrowe tylko jako {parametr}; bez śladów „undefined/null/TODO/???”', l => {
    expect(entries(l).filter(([, v]) => /[{}]/.test(v.replace(/\{\w+\}/g, ''))).map(([k, v]) => `${k} → ${v}`)).toEqual([]);
    expect(entries(l).filter(([k, v]) => /\b(undefined|null|NaN|TODO|FIXME|XXX)\b|\?\?\?|\[missing/.test(v) /* wielkość liter ma znaczenie: hiszp./port. „todo” = wszystko */).map(([k, v]) => `${k} → ${v}`)).toEqual([]);
  });
  test.each(NON_PL)('%s: bez liter polskich, których język nie ma (EN: ąćęłńóśźż; pozostałe: ć poza hr, ó poza cs/sk/hu/es/pt)', l => {
    const re = plLeak(l); const names = new Set<string>([...Object.values(APP_NAME), ...Object.values(LANG_NAME)]); /* nazwy własne */
    expect(entries(l).filter(([, v]) => re.test(v) && !names.has(v)).map(([k, v]) => `${k} → ${v}`)).toEqual([]);
  });
  test.each(NON_PL)('%s: żaden wyraz nie miesza alfabetu łacińskiego z cyrylicą (literówka z podobną literą)', l => {
    expect(entries(l).filter(([, v]) => v.split(/[^\p{L}]+/u).some(w => /[A-Za-z]/.test(w) && /\p{Script=Cyrillic}/u.test(w))).map(([k, v]) => `${k} → ${v}`)).toEqual([]);
  });
  test.each(NON_PL)('%s: tłumaczenie różne od polskiego klucza (wyjątki tylko z listy z powodem)', l => {
    expect(entries(l).filter(([k, v]) => v === k && !sameOk(l, k)).map(([k]) => k)).toEqual([]);
  });
  test('kontrola reguły interpunkcji (zdanie ≠ skrót)', () => {
    expect([punctMismatch('Usunąć gumę?', 'Delete band'), punctMismatch('Zapisano.', 'Saved'), punctMismatch('Uwaga:', 'Note'), punctMismatch('Usuń gumy…', 'Delete bands')]).toEqual([true, true, true, true]);
    expect([punctMismatch('max pow.', 'max reps'), punctMismatch('max ciężar', 'peso máx.'), punctMismatch('Usunąć gumę?', 'Delete band?'), punctMismatch('sztuk', 'vnt.')]).toEqual([false, false, false, false]);
  });
  test('{parametry} — ten sam zestaw w KAŻDYM słowniku (EN z importu modułu, nie z wyrażenia regularnego jak check-i18n)', () => {
    const ps = (x: string) => (x.match(/\{\w+\}/g) ?? []).sort().join(',');
    expect(NON_PL.flatMap(l => entries(l).filter(([k, v]) => ps(k) !== ps(v)).map(([k, v]) => `${l}: ${k} → ${v}`))).toEqual([]);
  });
  test('lista wyjątków „jak po polsku” jest minimalna: każdy wpis jest naprawdę użyty', () => {
    const unusedAny = [...SAME_ANY].filter(k => !NON_PL.some(l => dictOf(l)[k] === k));
    const unusedIn = Object.entries(SAME_IN).flatMap(([l, ks]) => ks!.filter(k => dictOf(l as Lang)[k] !== k).map(k => `${l}: ${k}`));
    const redundant = Object.entries(SAME_IN).flatMap(([l, ks]) => ks!.filter(k => SAME_ANY.has(k)).map(k => `${l}: ${k}`));
    expect([unusedAny, unusedIn, redundant]).toEqual([[], [], []]);
  });
  test.each(NON_PL)('%s: interpunkcja końcowa (. ? ! : …) jak w kluczu — poza kropką skrótu', l => {
    expect(entries(l).filter(([k, v]) => punctMismatch(k, v, l)).map(([k, v]) => `${k} → ${v}`)).toEqual([]);
  });
  test.each(NON_PL)('%s: zdanie pytające zostaje pytaniem, wielokropek wielokropkiem (także w środku: „Usuń gumy…”)', l => {
    expect(entries(l).filter(([k, v]) => (k.includes('?') && !/[?;？]/.test(v)) || (/…$/.test(k) && !/(…|\.\.\.)$/.test(v))).map(([k, v]) => `${k} → ${v}`)).toEqual([]);
  });
  test('słownik EN: liczba mnoga ma dokładnie 2 formy (one|other); klucz polski 3 (jeden|kilka|wiele); każda forma niepusta, bez spacji na brzegach', () => {
    expect(PLURAL_KEYS.length).toBeGreaterThan(3);
    expect(PLURAL_KEYS.filter(k => k.split('|').length !== PLURAL_FORMS.pl.length)).toEqual([]);
    expect(PLURAL_KEYS.filter(k => EN[k].split('|').length !== PLURAL_FORMS.en.length).map(k => `${k} → ${EN[k]}`)).toEqual([]);
    for (const l of NON_PL) {
      const d = dictOf(l);
      expect([l, PLURAL_KEYS.filter(k => d[k] !== undefined && d[k].split('|').some(f => !f.trim() || f !== f.trim())).map(k => `${k} → ${d[k]}`)]).toEqual([l, []]);
      /* tekst bez „|” w kluczu nie ma „|” w tłumaczeniu (inaczej t() pokazałby formy rozdzielone kreską) */
      expect([l, entries(l).filter(([k, v]) => !k.includes('|') && v.includes('|')).map(([k, v]) => `${k} → ${v}`)]).toEqual([l, []]);
    }
  });
});

/* ======================================================================================================================== */
/** Locale CLDR, wg którego aplikacja odmienia (domyślny region języka — locale() przy telefonie z innym językiem). */
function langLocale(l: Lang): string { global.__locales = [{ languageCode: 'de', languageTag: 'de-DE' }]; applyLang(l); const x = locale(); return x; }
/** Indeks formy wg CLDR: kategoria Intl.PluralRules → pozycja w PLURAL_FORMS; „other” bez własnej formy (pl, uk: one|few|many) → ostatnia. */
function cldrIndex(l: Lang, pr: Intl.PluralRules, n: number): number {
  const forms = PLURAL_FORMS[l] as readonly string[]; const c = pr.select(n); const i = forms.indexOf(c);
  return i >= 0 ? i : c === 'other' ? forms.length - 1 : -1;
}

describe('liczba mnoga: lib/plural.ts zgodnie z CLDR (Intl.PluralRules) i tp() w każdym języku', () => {
  /* @matrix LANGS */
  afterAll(() => { global.__locales = [{ languageCode: 'pl', languageTag: 'pl-PL' }]; applyLang('pl'); });
  test.each([...LANGS])('%s: pluralIndex = kategoria CLDR dla każdej liczby całkowitej 0…10 000; formy z PLURAL_FORMS = kategorie liczb całkowitych CLDR', l => {
    const loc = langLocale(l); const pr = new Intl.PluralRules(loc); const bad: string[] = []; const used = new Set<string>();
    for (let n = 0; n <= 10000; n++) { const want = cldrIndex(l, pr, n); used.add(pr.select(n)); if (pluralIndex(l, n) !== want) { bad.push(`${n}: ${pluralIndex(l, n)} ≠ ${want} (${pr.select(n)})`); if (bad.length > 10) break; } }
    expect([l, loc, bad]).toEqual([l, loc, []]);
    /* każda forma słownika jest osiągalna dla jakiejś liczby całkowitej (żadna nadmiarowa), a każda kategoria CLDR liczb całkowitych ma formę */
    const reach = new Set<number>(); for (let n = 0; n <= 200; n++) reach.add(pluralIndex(l, n));
    expect([l, reach.size]).toEqual([l, PLURAL_FORMS[l].length]);
    expect([l, [...used].filter(c => !(PLURAL_FORMS[l] as readonly string[]).includes(c) && c !== 'other')]).toEqual([l, []]);
    expect(pluralIndex(l, -2)).toBe(pluralIndex(l, 2)); /* wartość bezwzględna */
  });
  test.each([...LANGS])('%s: tp(n, wpis) wybiera formę wg CLDR dla każdego wpisu liczby mnogiej i n = 0…300', l => {
    const pr = new Intl.PluralRules(langLocale(l)); const d = l === 'pl' ? null : dictOf(l); const bad: string[] = [];
    expect(lang()).toBe(l);
    for (const k of PLURAL_KEYS) {
      const forms = (d ? d[k] ?? EN[k] : k).split('|');
      expect([l, k, forms.length]).toEqual([l, k, d && d[k] === undefined ? 2 : PLURAL_FORMS[l].length]);
      for (let n = 0; n <= 300; n++) { const want = forms[cldrIndex(l, pr, n)]; const got = tp(n, k); if (got !== want) bad.push(`${k} n=${n}: ${got} ≠ ${want}`); }
    }
    expect(bad.slice(0, 10)).toEqual([]);
  });
  /* Uproszczenie zapisane w lib/plural.ts („Ułamek → ostatnia forma”): CLDR ma dla ułamków osobne reguły (np. cs/sk „many” = 1,5 kilogramu,
   * ro/sl „few”, lv/hr/sr zależnie od cyfr po przecinku). Dziś każde wywołanie tp() w app/, components/ i lib/ podaje liczbę całkowitą
   * (liczba serii, sesji, dni, pozycji; Math.round przy sumie powtórzeń) — więc różnica nie jest widoczna. Test przypina obie rzeczy. */
  test('ułamki: tp() wybiera ostatnią formę (uproszczenie); języki, w których CLDR wybrałby inaczej — lista przypięta', () => {
    const FR = [0.5, 1.5, 2.5, 1.1, 2.3, 21.1, 0.1];
    const differs: string[] = [];
    for (const l of LANGS) {
      const pr = new Intl.PluralRules(langLocale(l)); const last = PLURAL_FORMS[l].length - 1;
      for (const n of FR) expect([l, n, pluralIndex(l, n)]).toEqual([l, n, last]);
      if (FR.some(n => cldrIndex(l, pr, n) !== last)) differs.push(l);
    }
    expect(differs).toEqual(['cs', 'sk', 'ro', 'hr', 'sl', 'sr', 'lt', 'lv', 'fr' /* fr: „one” dla 0 ≤ n < 2 (CLDR) — 0,5 i 1,5 */, 'da' /* da: „one” także dla 0,5 i 1,5 (t ≠ 0, i = 0/1) */]);
    /* wywołania tp() w kodzie: pierwszy argument to licznik (całkowity) — gdy ktoś poda wartość ułamkową, ten test trzeba rozszerzyć */
    const fs = require('fs') as typeof import('fs'); const path = require('path') as typeof import('path');
    const files: string[] = []; const walk = (d: string) => { for (const f of fs.readdirSync(d)) { const p = path.join(d, f); if (fs.statSync(p).isDirectory()) walk(p); else if (/\.tsx?$/.test(f) && !/i18n(\.en)?\.ts$/.test(f)) files.push(p); } };
    for (const d of ['app', 'components', 'lib']) walk(path.join(__dirname, '..', d));
    const args = files.flatMap(f => [...fs.readFileSync(f, 'utf8').matchAll(/\btp\(([^,]+),\s*'/g)].map(m => m[1].trim()));
    expect(args.length).toBeGreaterThan(10);
    expect(args.filter(a => !/(\.length|^Math\.round\(.*\)?|^(n|sets|days|w|ws\.length|points\.length|last\.sets|last\.prs))$/.test(a))).toEqual([]);
  });
});

/* ======================================================================================================================== */
describe('daty i liczby: fmtDate / fmtTime / fmtNum / locale() / decimalComma() w każdym języku i regionie telefonu', () => {
  /* @matrix LANGS */
  afterAll(() => { global.__locales = [{ languageCode: 'pl', languageTag: 'pl-PL' }]; applyLang('pl'); });
  /** Ten sam język, inny region (telefon) — locale() bierze region telefonu (poza pl → pl-PL i sr → cyrylica). */
  const ALT: Partial<Record<Lang, string>> = { en: 'en-GB', pt: 'pt-BR', es: 'es-MX', sr: 'sr-Latn-RS', hr: 'hr-BA', uk: 'uk-UA', hu: 'hu-HU', ro: 'ro-MD', pl: 'pl-GB', cs: 'cs-CZ', sk: 'sk-SK', bg: 'bg-BG', sl: 'sl-SI', lt: 'lt-LT', lv: 'lv-LV', et: 'et-EE',
    de: 'de-AT', fr: 'fr-CA', it: 'it-CH', nl: 'nl-BE', sv: 'sv-FI', da: 'da-DK', nb: 'nb-NO', fi: 'fi-FI', tr: 'tr-TR', el: 'el-CY' /* 07.10.2026 */ };
  const now = new Date(); const D = new Date(now.getFullYear(), 2, 15, 9, 5).getTime(); const D_OLD = new Date(now.getFullYear() - 1, 10, 3, 18, 40).getTime();
  const cases = LANGS.flatMap(l => [[l, 'de-DE'], [l, ALT[l]!]] as [Lang, string][]);
  test.each(cases)('%s przy telefonie %s', (l, device) => {
    global.__locales = [{ languageCode: device.split('-')[0], languageTag: device }]; applyLang(l); expect(lang()).toBe(l);
    const loc = locale();
    /* locale(): pl zawsze pl-PL, sr zawsze cyrylica, ten sam język — region telefonu, inny język — domyślny region języka */
    if (l === 'pl') expect(loc).toBe('pl-PL'); else if (l === 'sr') expect(loc).toBe('sr-Cyrl-RS'); else if (device.startsWith(l + '-')) expect(loc).toBe(device); else expect(loc.startsWith(l + '-')).toBe(true);
    expect(Intl.DateTimeFormat.supportedLocalesOf([loc])).toEqual([loc]);
    /* data: miesiąc i dzień tygodnia z CLDR tego regionu (część krajów pisze miesiąc liczbą: cs/sk „ne 15. 3.”, bg „нд, 15.03”, pt „15/03”),
     * nigdy angielskie nazwy poza en; rok tylko dla innego roku */
    const s = fmtDate(D); const opts = { weekday: 'short', day: 'numeric', month: 'short' } as const;
    const parts = new Intl.DateTimeFormat(loc, opts).formatToParts(new Date(D)); const month = parts.find(p => p.type === 'month')!.value; const wd = parts.find(p => p.type === 'weekday')!.value;
    expect([l, device, s.includes(month), s.includes(wd), s.includes('15')]).toEqual([l, device, true, true, true]);
    if (l !== 'en' && l !== 'tr' /* tur. „Mar” = Mart (marzec) — skrót CLDR */) expect([l, device, /\b(Mar|Sun)\b/.test(s)]).toEqual([l, device, false]);
    if (['bg', 'sr', 'uk'].includes(l)) expect([l, s]).toEqual([l, expect.stringMatching(/\p{Script=Cyrillic}/u)]);
    expect(s.includes(String(now.getFullYear()))).toBe(false);
    expect(fmtDate(D_OLD).includes(String(now.getFullYear() - 1))).toBe(true);
    /* godzina: 9:05 / 18:40 (12- albo 24-godzinna wg regionu), cyfry arabskie */
    const tm = fmtTime(D), tm2 = fmtTime(D_OLD);
    expect([l, device, /0?9\D{1,3}05/.test(tm), /(18|0?6)\D{1,3}40/.test(tm2) /* fr-CA: „09 h 05” */, /^[\d\s:.,APMapm  hu\p{L}.]+$/u.test(tm)]).toEqual([l, device, true, true, true]);
    /* liczby: separator dziesiętny = decimalComma() = CLDR regionu; bez grupowania tysięcy; cyfry ASCII */
    const sep = decimalComma() ? ',' : '.';
    const intlSep = new Intl.NumberFormat(loc).formatToParts(1.5).find(p => p.type === 'decimal')!.value;
    expect([l, device, sep]).toEqual([l, device, intlSep]);
    const minus = new Intl.NumberFormat(loc).formatToParts(-1).find(p => p.type === 'minusSign')!.value; /* hr, sl, lt, et: „−” (U+2212) wg CLDR */
    expect([fmtNum(1234.5), fmtNum(62.5), fmtNum(-0.25), fmtNum(100), fmtNum(1 / 3), fmtNum(2.005, 0)]).toEqual([`1234${sep}5`, `62${sep}5`, `${minus}0${sep}25`, '100', `0${sep}33`, '2']);
    expect([l, device, /^[0-9.,\u2212-]+$/.test(fmtNum(-98765.4321, 3))]).toEqual([l, device, true]); /* cyfry ASCII, bez grupowania */
  });
  test('przecinek dziesiętny: wszystkie języki poza angielskim (domyślny region) — jak w polu liczbowym NumInput', () => {
    const comma = LANGS.filter(l => { global.__locales = [{ languageCode: 'de', languageTag: 'de-DE' }]; applyLang(l); return decimalComma(); });
    expect(comma).toEqual(LANGS.filter(l => l !== 'en'));
  });
});

/* ======================================================================================================================== */
/** Minimalny czytnik TTF (tabele head/hhea/hmtx/cmap format 4): szerokość tekstu z prawdziwych szerokości znaków kroju (bez kerningu). */
function ttf(file: string) {
  const fs = require('fs') as typeof import('fs'); const b: Buffer = fs.readFileSync(file); const T: Record<string, number> = {};
  for (let i = 0; i < b.readUInt16BE(4); i++) { const o = 12 + 16 * i; T[b.toString('latin1', o, o + 4)] = b.readUInt32BE(o + 8); }
  const upm = b.readUInt16BE(T.head + 18), nh = b.readUInt16BE(T.hhea + 34); const adv = (g: number) => b.readUInt16BE(T.hmtx + 4 * Math.min(g, nh - 1));
  let sub = -1; for (let i = 0; i < b.readUInt16BE(T.cmap + 2); i++) { const p = b.readUInt16BE(T.cmap + 4 + 8 * i), e = b.readUInt16BE(T.cmap + 6 + 8 * i), off = b.readUInt32BE(T.cmap + 8 + 8 * i); if (b.readUInt16BE(T.cmap + off) === 4 && ((p === 3 && e === 1) || p === 0)) { sub = T.cmap + off; break; } }
  const seg = b.readUInt16BE(sub + 6) / 2, ends = sub + 14, starts = ends + 2 * seg + 2, deltas = starts + 2 * seg, ros = deltas + 2 * seg;
  const gid = (cp: number) => { for (let i = 0; i < seg; i++) { if (cp > b.readUInt16BE(ends + 2 * i)) continue; const st = b.readUInt16BE(starts + 2 * i); if (cp < st) return 0; const d = b.readInt16BE(deltas + 2 * i), ro = b.readUInt16BE(ros + 2 * i); if (!ro) return (cp + d) & 0xffff; const g = b.readUInt16BE(ros + 2 * i + ro + 2 * (cp - st)); return g ? (g + d) & 0xffff : 0; } return 0; };
  /** Znak bez glifu (np. cyrylica w Archivo) — iOS rysuje go krojem systemowym; szacunek 0,6 em. */
  const width = (s: string, pt: number) => [...s].reduce((a, ch) => { const g = gid(ch.codePointAt(0)!); return a + (g ? adv(g) / upm : 0.6); }, 0) * pt;
  return { has: (ch: string) => gid(ch.codePointAt(0)!) > 0, width };
}
const FONT_DIR = require('path').join(__dirname, '..', 'node_modules', '@expo-google-fonts') as string;
const SANS = { regular: ttf(`${FONT_DIR}/ibm-plex-sans/400Regular/IBMPlexSans_400Regular.ttf`), semibold: ttf(`${FONT_DIR}/ibm-plex-sans/600SemiBold/IBMPlexSans_600SemiBold.ttf`) };
const BOLD = ttf(`${FONT_DIR}/ibm-plex-sans/700Bold/IBMPlexSans_700Bold.ttf`); /* nagłówki i duże liczby (decyzja właściciela 07.10.2026 wieczór: zamiast Tektur) */
const PLEX = ttf(`${FONT_DIR}/ibm-plex-mono/500Medium/IBMPlexMono_500Medium.ttf`);
const trIn = (l: Lang, k: string) => l === 'pl' ? k : dictOf(l)[k] ?? EN[k] ?? k;
/** Litery (\p{L}) użyte w tekstach języka — bez symboli (strzałki, ★, ✓ są celowo z kroju systemowego, także po polsku). */
const lettersOf = (l: Lang) => [...new Set((l === 'pl' ? SOURCE : Object.values(dictOf(l))).join('').match(/\p{L}/gu) ?? [])];

describe('kroje pisma marki (IBM Plex Sans 400/600/700, IBM Plex Mono) mają znaki każdego języka', () => {
  /* @matrix LANGS */
  /* Styl „Tuleja” (decyzja właściciela 07.10.2026, wariant A „mieszany”): jeden zestaw krojów dla każdego języka — wcześniej Archivo bez cyrylicy
   * wymagał zamiany kroju dla bg/sr/uk (06.10.2026). Każda litera tłumaczeń musi być w kroju tekstu (Plex Sans 400/600) i nagłówków (Plex Sans 700; do 07.10.2026 wieczór Tektur). */
  test.each([...LANGS])('%s: każda litera tłumaczeń jest w IBM Plex Sans 400/600/700 (bez zastępowania krojem systemowym)', l => {
    expect([l, lettersOf(l).filter(ch => !(SANS.regular.has(ch) && SANS.semibold.has(ch) && BOLD.has(ch))).join('')]).toEqual([l, '']);
  });
  test('jeden zestaw krojów dla wszystkich języków: F wskazuje Plex Sans / Plex Mono, każdy z plikiem; bez Tektur', () => {
    const th = require('@/lib/theme');
    expect([th.F.regular, th.F.semibold, th.F.heavy, th.F.display]).toEqual(['IBMPlexSans_400Regular', 'IBMPlexSans_600SemiBold', 'IBMPlexSans_700Bold', 'IBMPlexSans_700Bold']);
    expect(Object.keys(th.FONT_FILES).sort()).toEqual([...new Set(Object.values(th.F).map(String))].sort());
    expect(JSON.stringify(Object.keys(th.FONT_FILES))).not.toMatch(/Tektur/); expect(require('../package.json').dependencies['@expo-google-fonts/tektur']).toBeUndefined();
    expect(th.applyFontsFor).toBeUndefined(); expect(th.CYRILLIC_LANGS).toBeUndefined();
  });
  test('IBM Plex Sans Bold (duże liczby w widoku skupionym) ma cyfry i znaki liczb (przecinek, kropka, ×, :)', () => {
    expect([...'0123456789,.:×−-'].filter(ch => !BOLD.has(ch))).toEqual([]);
  });
  /* Audyt 0.10 (A11-11): docs/16 twierdził, że Plex Mono ma greckie litery — nie ma. Litery, których brakuje w Plex Mono, to dokładnie te, które
   * monoSafe (components/ui.tsx) przełącza na krój tekstu; inne litery (łacina, cyrylica) są w Plex Mono. */
  test.each([...LANGS])('%s: litery spoza IBM Plex Mono to tylko te, które monoSafe przełącza na Plex Sans (MONO_MISSING)', l => {
    const { MONO_MISSING } = require('@/components/ui') as typeof import('@/components/ui');
    expect([l, lettersOf(l).filter(ch => !PLEX.has(ch) && !MONO_MISSING.test(ch)).join('')]).toEqual([l, '']);
    if (l === 'el') expect(lettersOf(l).filter(ch => /\p{Script=Greek}/u.test(ch)).some(ch => !PLEX.has(ch))).toBe(true); /* fakt z A11-11 przypięty */
  });
  test('IBM Plex Mono (liczby: czas, ciężar) ma cyfry i znaki liczb we wszystkich regionach (przecinek, kropka, minus U+2212, ×, –, :)', () => {
    expect([...'0123456789,.:−-+×–—…/ ±%'].filter(ch => ch !== ' ' && !PLEX.has(ch))).toEqual([]);
  });
});

/*
 * Długie teksty. Zasada aplikacji (components/ui.tsx): teksty przycisków, wierszy i chipów się ZAWIJAJĄ (bez numberOfLines), z limitem
 * powiększenia 1,3–1,4; ucinane są tylko: etykiety zakładek (React Navigation: numberOfLines=1, 10 pt, IBM Plex Sans 600), opcje kontrolki
 * segmentowej (numberOfLines=2, równe kolumny) i kolumny wiersza serii (szerokości liczy rowLayout — test w tests/ux.test.tsx).
 * Zawijanie na ekranach sprawdza tests/matrix-a11y.test.tsx (numberOfLines=1 tylko z listy). Tu: w każdym języku szerokość tłumaczenia
 * liczona z prawdziwych szerokości znaków kroju (czytnik TTF wyżej; bez kerningu, znak bez glifu 0,6 em) na najwęższym ekranie 375 pt
 * (iPhone SE 2/3, 12/13 mini). Wynik to szacunek — potwierdzenie wyglądu na symulatorze.
 */
describe('długie tłumaczenia w miejscach, gdzie tekst może być ucięty', () => {
  /* @matrix LANGS */
  const W = 375;
  const lines = (s: string, w: (x: string) => number, avail: number) => { let n = 1, cur = 0; const sp = w(' '); for (const word of s.split(/\s+/)) { const ww = w(word); if (ww > avail) { n += Math.ceil(ww / avail) - (cur ? 0 : 1); cur = ww % avail; continue; } if (cur && cur + sp + ww > avail) { n++; cur = ww; } else cur += (cur ? sp : 0) + ww; } return n; };
  const TABS = ['Trening', 'Szablony', 'Ćwiczenia', 'Kalendarz', 'Więcej'];
  /** Zakładka: 1/5 szerokości, padding 5 (BottomTabItem tabVerticalUiKit), etykieta 10 pt (labelBeneath), numberOfLines=1. */
  const TAB_AVAIL = W / 5 - 2 * 5;
  const tabOverflow = (l: Lang) => TABS.map(k => trIn(l, k)).filter(s => SANS.semibold.width(s, 10) > TAB_AVAIL).map(s => `${s} (${SANS.semibold.width(s, 10).toFixed(1)} > ${TAB_AVAIL} pt)`);
  const TAB_KNOWN: Lang[] = []; /* es naprawione 06.10.2026 (decyzja właściciela, wariant A): „Entreno” zamiast „Entrenamiento” */
  test.each(LANGS.filter(l => !TAB_KNOWN.includes(l)))('%s: etykiety zakładek mieszczą się w jednej linii bez „…” na ekranie 375 pt', l => { expect([l, tabOverflow(l)]).toEqual([l, []]); });
  /* ZNALEZISKO (NISKIE): lib/locales/es.json „Trening” → „Entrenamiento” — na pasku zakładek (app/(tabs)/_layout.tsx:28, etykieta 10 pt,
   * numberOfLines=1) ok. 68 pt przy 65 pt miejsca na iPhonie 375 pt → „Entrenamien…”. Na 390+ pt się mieści. Opcje dla właściciela:
   * krótsza etykieta zakładki (np. „Entreno”) albo zostawić (ucięcie tylko na najmniejszych iPhone'ach). */
  if (TAB_KNOWN.length) test.failing.each(TAB_KNOWN)('ZNALEZISKO: %s — etykiety zakładek mieszczą się na ekranie 375 pt', l => { expect([l, tabOverflow(l)]).toEqual([l, []]); });
  /* Audyt 0.10 (A11-03): ekran 320 pt (SE 2/3, 12/13 mini z Display Zoom) — 54 pt na etykietę; długie tłumaczenia (bg, el, hu, it, lt, lv, ro, uk)
   * się nie mieszczą, więc etykieta (components/TabIcon.tsx TabLabel) zmniejsza krój do TAB_LABEL_MIN_SCALE zamiast „…”. */
  test.each([...LANGS])('%s: etykiety zakładek na ekranie 320 pt mieszczą się po zmniejszeniu kroju (adjustsFontSizeToFit, min. skala TabLabel)', l => {
    const { TAB_LABEL_MIN_SCALE } = require('@/components/TabIcon') as typeof import('@/components/TabIcon'); const avail = 320 / 5 - 2 * 5;
    expect(TAB_LABEL_MIN_SCALE).toBeGreaterThanOrEqual(0.75); /* 7,5 pt — dolna granica czytelności */
    expect([l, TABS.map(k => trIn(l, k)).filter(s => SANS.semibold.width(s, 10 * TAB_LABEL_MIN_SCALE) > avail)]).toEqual([l, []]);
  });
  test.each([...LANGS])('%s: kontrolka „Wygląd” (3 opcje, 14 pt, max 2 linie) — każda opcja mieści się w 2 liniach, także przy powiększeniu 1,3 (limit Segmented)', l => {
    const avail = (W - 2 * 14 - 2 * 1 - 2 * 2) / 3 - 2 * 6; /* Screen 14, ramka 1, padding 2, segItem padding 6 (ui.tsx) */
    const opts = ['Jasny', 'Ciemny', 'Jak w telefonie'].map(k => trIn(l, k));
    for (const scale of [1, 1.3]) expect([l, scale, opts.filter(s => lines(s, x => SANS.semibold.width(x, 14 * scale), avail) > 2)]).toEqual([l, scale, []]);
  });
  /* Audyt 0.10 (A11-12): każda kontrolka segmentowa na ekranie 320 pt — opcja jednowyrazowa (1 linia) mieści się po zmniejszeniu do SEG_MIN_SCALE;
   * opcja z kilku wyrazów: żaden wyraz nie jest szerszy niż opcja (bez łamania w środku wyrazu) i najwyżej 2 linie; przy powiększonym tekście
   * opcje są jedna pod drugą (components/ui.tsx Segmented) — wyraz mieści się w wierszu przy 200%. */
  test.each([...LANGS])('%s: wszystkie Segmented (Wygląd, Widok treningu, Cel w generatorze) na ekranie 320 pt — bez łamania wyrazu i bez „…”', l => {
    const { SEG_MIN_SCALE } = require('@/components/ui') as typeof import('@/components/ui');
    const SEGS: string[][] = [['Jasny', 'Ciemny', 'Jak w telefonie'], ['Skupiony', 'Lista'], ['Siła', 'Masa', 'Redukcja']];
    const bad: string[] = [];
    for (const keys of SEGS) {
      const avail = (320 - 2 * 14 - 2 * 1 - 2 * 2) / keys.length - 2 * 6; /* Screen 14, ramka 1, padding 2, segItem padding 6 (ui.tsx) */
      for (const k of keys) {
        const s = trIn(l, k); const w = (x: string, sc = 1) => SANS.semibold.width(x, 14 * sc);
        if (!/\s/.test(s.trim())) { if (w(s, SEG_MIN_SCALE) > avail) bad.push(`${s} (1 linia: ${w(s, SEG_MIN_SCALE).toFixed(1)} > ${avail.toFixed(1)})`); continue; }
        { const long = s.split(/\s+/).filter(x => w(x) > avail); /* zmniejszanie kroju nie chroni przed łamaniem wyrazu w tekście 2-liniowym — wyraz musi się zmieścić w pełnym rozmiarze */ if (long.length) bad.push(`${s} (wyraz ${long.join(', ')})`); }
        if (lines(s, x => w(x, SEG_MIN_SCALE), avail) > 2) bad.push(`${s} (> 2 linie)`);
      }
      /* powiększony tekst: opcje jedna pod drugą na pełnej szerokości, do 200% — żaden wyraz nie szerszy niż wiersz */
      const full = 320 - 2 * 14 - 2 * 1 - 2 * 2 - 2 * 6;
      for (const k of keys) for (const x of trIn(l, k).split(/\s+/)) if (SANS.semibold.width(x, 14 * 2) > full) bad.push(`${x} (pionowo, 200%)`);
    }
    expect([l, bad]).toEqual([l, []]);
  });
  test('czytnik TTF liczy szerokości jak krój (kontrola: „i” węższe niż „m”, szerokość rośnie liniowo z rozmiarem)', () => {
    const f = SANS.semibold; expect(f.width('i', 10)).toBeLessThan(f.width('m', 10)); expect(f.width('Trening', 20)).toBeCloseTo(2 * f.width('Trening', 10), 6);
    expect(f.has('ą') && f.has('ő') && f.has('ș') && f.has('ė') && f.has('ā')).toBe(true); expect(PLEX.width('0000', 10)).toBeCloseTo(4 * PLEX.width('0', 10), 6);
  });
});
