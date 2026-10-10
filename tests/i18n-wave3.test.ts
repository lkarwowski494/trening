/*
 * Fala 3 nowych języków (docs/16 „Fala 3”, 09.10.2026): rosyjski (ru) — pełny słownik (UI + wskazówki techniki).
 * Rodzaje (docs/20): logika (resolveLang / detectLang z tagu telefonu ru-RU, ru-KZ, ru-UA, ru-BY; ukraiński telefon dalej → uk; locale,
 * separator dziesiętny; liczba mnoga one/few/many wg CLDR), dane (komplet kluczy UI i wskazówek, parametry, trzy formy liczby mnogiej,
 * locales/ru.json), języki (bez śladów angielskich i polskich, terminologia siłowni, rosyjskie cudzysłowy «», jednostki cyrylicą,
 * ru ≠ uk: bez liter i słów ukraińskich w ru, bez rosyjskich w uk, słowniki nie są kopią), wygląd (cyrylica rosyjska z „ё” w IBM Plex).
 * Ekran: tests/i18n-wave3-ui.test.tsx; 320 pt / 200 %, ekrany × język, widżet, kompletność, przerwa ≠ pauza, jednostki (K3) —
 * testy z pętlą po LANGS (matrix-i18n, matrix-dim-langs*, widget-i18n, i18n-locales, cues, audit-0.10-lang) obejmują ru automatycznie
 * albo przez ręczne listy uzupełnione w tej fali (TERMS, LOCAL, cues — cyrylica, matrix-i18n — ALT i daty cyrylicą).
 */
import * as fs from 'fs';
import * as path from 'path';
import { LANGS, resolveLang, applyLang, lang, locale, decimalComma, tp, detectLang, LANG_NAME, APP_NAME } from '@/lib/i18n';
import { EN } from '@/lib/i18n.en';
import { LOCALES } from '@/lib/locales';
import { PLURAL_FORMS, pluralIndex } from '@/lib/plural';
import { cueDict } from '@/lib/cues';
import { fmtSec, fmtDist, reps } from '@/lib/store';

const ru = (): Record<string, string> => LOCALES.ru!;
const uk = (): Record<string, string> => LOCALES.uk!;
const entries = () => Object.entries(ru());
const allRu = () => [...Object.values(ru()), ...Object.values(cueDict('ru'))];
const allUk = () => [...Object.values(uk()), ...Object.values(cueDict('uk'))];
/** Wyrazy (litery, apostrof ukraiński, dywiz) — \b w JS działa tylko dla ASCII, więc dzielimy tekst po literach Unicode. */
const words = (s: string) => s.toLowerCase().split(/[^\p{L}’ʼ'-]+/u).filter(Boolean);

describe('resolveLang / detectLang: telefon po rosyjsku (każdy region) i po ukraińsku', () => {
  test.each([
    ['ru-RU', 'ru'], ['ru-KZ', 'ru'], ['ru-UA', 'ru'], ['ru-BY', 'ru'], ['ru', 'ru'], ['ru_RU', 'ru'], ['ru-Cyrl-RU', 'ru'], ['ru-KG', 'ru'], ['ru-MD', 'ru'],
    ['uk-UA', 'uk'], ['uk', 'uk'], ['uk-RU', 'uk'] /* język telefonu decyduje, nie region */,
    ['be-BY', 'en'] /* białoruski — nie jest językiem aplikacji */, ['kk-KZ', 'en'] /* kazachski — odłożony (docs/16) */, ['en-RU', 'en'],
  ] as const)('%s → %s', (tag, want) => { expect(resolveLang(tag)).toBe(want); });
  test('kod języka z expo-localization (languageCode) bez tagu', () => {
    expect(resolveLang(null, 'ru')).toBe('ru'); expect(resolveLang(null, 'uk')).toBe('uk'); expect(resolveLang('ru-UA', 'ru')).toBe('ru');
  });

  afterEach(() => { global.__locales = [{ languageCode: 'pl', languageTag: 'pl-PL' }]; applyLang('pl'); });
  const dev = (code: string, tag: string) => { global.__locales = [{ languageCode: code, languageTag: tag }]; };
  test.each([
    ['ru', 'ru-RU', 'ru', 'ru-RU'], ['ru', 'ru-KZ', 'ru', 'ru-KZ'], ['ru', 'ru-UA', 'ru', 'ru-UA'], ['ru', 'ru-BY', 'ru', 'ru-BY'], ['uk', 'uk-UA', 'uk', 'uk-UA'],
  ] as const)('„Jak w telefonie”: %s / %s → język %s, daty i liczby %s (region telefonu), przecinek dziesiętny', (code, tag, want, loc) => {
    dev(code, tag); expect(detectLang()).toBe(want); applyLang('auto');
    expect([lang(), locale(), decimalComma()]).toEqual([want, loc, true]);
  });
  test('wymuszony rosyjski przy telefonie z innym językiem: domyślny region ru-RU; daty cyrylicą', () => {
    dev('de', 'de-DE'); applyLang('ru'); expect([lang(), locale()]).toEqual(['ru', 'ru-RU']);
    expect(new Intl.DateTimeFormat(locale(), { month: 'long' }).format(new Date(2026, 2, 15))).toMatch(/\p{Script=Cyrillic}/u);
  });
  test('wymuszony ukraiński na telefonie rosyjskim: interfejs uk, daty uk-UA (nie ru-RU)', () => {
    dev('ru', 'ru-RU'); applyLang('uk'); expect([lang(), locale()]).toEqual(['uk', 'uk-UA']);
  });
  test('LANGS: ru na końcu listy (kolejność w ustawieniach), nazwa „Русский”, nazwa aplikacji „Training” (jak uk — „Тренировка” niepodobne do „Trening”)', () => {
    expect(LANGS[LANGS.indexOf('vi') + 1]).toBe('ru'); /* fala 4 (ja, ko, zh-Hant) dopisana za nim */
    expect([LANG_NAME.ru, APP_NAME.ru]).toEqual(['Русский', 'Training']);
  });
});

describe('liczba mnoga: ru — one / few / many (CLDR, liczby całkowite)', () => {
  afterAll(() => applyLang('pl'));
  test('PLURAL_FORMS.ru = one|few|many; kategorie Intl.PluralRules(ru) dla 1, 2, 5, 11, 21, 22, 25 (+ 12, 14, 111, 112, 0)', () => {
    expect(PLURAL_FORMS.ru).toEqual(['one', 'few', 'many']);
    const pr = new Intl.PluralRules('ru'); const N = [1, 2, 5, 11, 21, 22, 25, 12, 14, 111, 112, 0, 101, 104];
    expect(N.map(n => pr.select(n))).toEqual(['one', 'few', 'many', 'many', 'one', 'few', 'many', 'many', 'many', 'many', 'many', 'many', 'one', 'few']);
    expect(N.map(n => PLURAL_FORMS.ru[pluralIndex('ru', n)])).toEqual(N.map(n => pr.select(n)));
  });
  test('tp(): „подход / подхода / подходов”, „тренировка / тренировки / тренировок”, „упражнение / упражнения / упражнений”', () => {
    applyLang('ru');
    const N = [1, 2, 5, 11, 21, 22, 25];
    expect(N.map(n => tp(n, 'seria|serie|serii'))).toEqual(['подход', 'подхода', 'подходов', 'подходов', 'подход', 'подхода', 'подходов']);
    expect(N.map(n => tp(n, 'sesja|sesje|sesji'))).toEqual(['тренировка', 'тренировки', 'тренировок', 'тренировок', 'тренировка', 'тренировки', 'тренировок']);
    expect(N.map(n => tp(n, 'ćwiczenie|ćwiczenia|ćwiczeń'))).toEqual(['упражнение', 'упражнения', 'упражнений', 'упражнений', 'упражнение', 'упражнения', 'упражнений']);
    expect(N.map(n => tp(n, 'dzień|dni|dni'))).toEqual(['день', 'дня', 'дней', 'дней', 'день', 'дня', 'дней']);
  });
  test('każdy wpis liczby mnogiej ma 3 różne formy (one ≠ few ≠ many — rosyjskie przypadki: mianownik, dopełniacz lp., dopełniacz lm.)', () => {
    const keys = Object.keys(EN).filter(k => k.includes('|'));
    expect(keys.length).toBeGreaterThan(3);
    for (const k of keys) { const f = ru()[k].split('|'); expect([k, f.length, new Set(f).size]).toEqual([k, 3, 3]); }
  });
});

describe('dane: komplet słownika UI i wskazówek techniki', () => {
  const src = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'lib', 'locales', '_source.json'), 'utf8')) as { pl: string }[];
  const params = (s: string) => (s.match(/\{\w+\}/g) ?? []).sort().join(',');
  test('każdy klucz źródła ma niepuste tłumaczenie z tymi samymi {parametrami}; bez nadmiarowych kluczy; wskazówki — każde zdanie', () => {
    const d = ru();
    expect(src.filter(s => !d[s.pl]?.trim()).map(s => s.pl)).toEqual([]);
    expect(src.filter(s => params(d[s.pl]) !== params(s.pl)).map(s => s.pl)).toEqual([]);
    expect(Object.keys(d).length).toBe(src.length);
    const en = cueDict('en'), c = cueDict('ru');
    expect(Object.keys(c).sort()).toEqual(Object.keys(en).sort());
    expect(Object.entries(c).filter(([, v]) => !v.trim())).toEqual([]);
  });
  test('locales/ru.json (iOS: nazwa pod ikoną, opisy uprawnień Zdrowia) — po rosyjsku, z nazwą aplikacji', () => {
    const f = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'locales', 'ru.json'), 'utf8'));
    expect(f.CFBundleDisplayName).toBe('Training');
    expect(f.NSHealthShareUsageDescription).toMatch(/здоровье/); expect(f.NSHealthUpdateUsageDescription).toMatch(/Apple Health/);
    for (const v of Object.values(f) as string[]) expect(/[іїєґ’]/.test(v)).toBe(false);
  });
  test('nazwa w App Store (store/app-store-names.json, lokalizacja „ru”) — APP_NAME przed dwukropkiem, ≤ 30 znaków', () => {
    const n = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'store', 'app-store-names.json'), 'utf8')).names.ru as string;
    expect(n.startsWith(`${APP_NAME.ru}: `)).toBe(true); expect(n.length).toBeLessThanOrEqual(30);
  });
});

/* ====================================================================================================================================== */
/** Wyrazy angielskie — ślad nieprzetłumaczonego tekstu (nazwy sprzętu w nawiasach po angielsku ich nie zawierają). */
const EN_WORDS = /\b(the|and|with|your|you|of|for|this|that|is|are|will|not|from|when|after|before|only|all|tap|weight|workout|exercise|template|rest|set|sets|reps)\b/i;
/** Polskie wyrazy częste w kluczach — ślad nieprzetłumaczonego tekstu. */
const PL_WORDS = /\b(nie|jest|albo|oraz|przy|trening|treningu|seria|serii|szablon|ciężar|przerwa|dodaj|usuń|zapisz)\b/i;
/** Tłumaczenie identyczne z angielskim — tylko symbole, skróty i terminy siłowni pisane po angielsku (lista minimalna). */
const SAME_AS_EN = new Set(['{k}: {v}', 'e1RM', 'OK', 'GHD', 'GHD (glute-ham developer)', 'glute-ham raise', 'circus bell', 'landmine', 'pendulum squat', 'reverse hyper', 'Full Body', 'Full Body A', 'Full Body B']);
/** Wyrazy wyłącznie ukraińskie (bez liter і ї є ґ, które łapie osobny test) — kalka z uk w tekście rosyjskim. */
const UK_ONLY_WORDS = new Set(['або', 'додати', 'додайте', 'тиждень', 'вага', 'ваги', 'вагу', 'вправа', 'вправи', 'вправ', 'вправу', 'зберегти', 'збережено', 'тренування', 'тренувань', 'щоб', 'доки', 'лише', 'потім', 'немає', 'буде', 'параметри', 'програми', 'скасувати', 'видалити', 'розминка', 'повторень', 'зміни', 'коли', 'якщо', 'також', 'дні', 'й']);
/** Wyrazy wyłącznie rosyjskie — w słowniku ukraińskim byłyby śladem pomieszania. */
const RU_ONLY_WORDS = new Set(['или', 'неделя', 'неделю', 'вес', 'веса', 'упражнение', 'упражнения', 'добавить', 'сохранить', 'настройки', 'отдых', 'подход', 'подходы', 'если', 'чтобы', 'также', 'нет', 'тренировка', 'тренировки', 'только', 'затем', 'удалить', 'отменить', 'ещё', 'разминка']);
describe('języki: jakość tekstów rosyjskich', () => {
  test('bez angielskich wyrazów-śladów (the, and, workout, rest, set…) poza nazwami w nawiasach i bez polskich (nie, jest, trening…)', () => {
    const strip = (v: string) => v.replace(/\{\w+\}/g, '').replace(/\([^)]*\)/g, '').replace(/\b(glute-ham raise|circus bell|landmine|pendulum squat|reverse hyper|Full Body|Apple Health|Apple ID|TestFlight|iCloud|iPhone|iOS|Backup|Circus bell|Landmine|Zourdos|Helms|JSCR)\b/g, '');
    expect([...entries().map(([k, v]) => [k, v]), ...Object.entries(cueDict('ru'))].filter(([, v]) => EN_WORDS.test(strip(v))).map(([k, v]) => `${k} → ${v}`)).toEqual([]);
    expect(allRu().filter(v => PL_WORDS.test(v))).toEqual([]);
  });
  test('tłumaczenie identyczne z angielskim tylko dla symboli i terminów z listy; dłuższe teksty (≥ 3 wyrazy) zawsze po rosyjsku', () => {
    expect(entries().filter(([k, v]) => v === EN[k] && !SAME_AS_EN.has(v)).map(([k]) => k)).toEqual([]);
    expect(entries().filter(([, v]) => v.replace(/\{\w+\}/g, '').split(/\s+/).filter(w => /\p{L}/u.test(w)).length >= 3 && !/\p{Script=Cyrillic}/u.test(v) && !SAME_AS_EN.has(v)).map(([k, v]) => `${k} → ${v}`)).toEqual([]);
  });
  test('wskazówki techniki: każde zdanie cyrylicą, żadne nie jest identyczne z angielskim, polskim ani ukraińskim', () => {
    const en = cueDict('en'), pl = cueDict('pl'), u = cueDict('uk'), c = cueDict('ru');
    expect(Object.keys(c).filter(k => c[k] === en[k] || c[k] === pl[k] || c[k] === u[k] || !/\p{Script=Cyrillic}/u.test(c[k]))).toEqual([]);
  });
  test('ru ≠ uk: w tekstach rosyjskich nie ma liter ukraińskich (і ї є ґ, apostrof ’), a w ukraińskich — rosyjskich (ы э ъ ё)', () => {
    expect(allRu().filter(v => /[іїєґІЇЄҐ’ʼ]/.test(v))).toEqual([]);
    expect(allUk().filter(v => /[ыэъёЫЭЪЁ]/.test(v))).toEqual([]);
    expect(allRu().filter(v => /[ыэё]/.test(v)).length).toBeGreaterThan(300); /* kontrola: rosyjskie litery są naprawdę w użyciu */
  });
  test('ru ≠ uk: bez wyrazów wyłącznie ukraińskich w ru (kalka) i wyłącznie rosyjskich w uk', () => {
    expect(allRu().filter(v => words(v).some(w => UK_ONLY_WORDS.has(w)))).toEqual([]);
    expect(allUk().filter(v => words(v).some(w => RU_ONLY_WORDS.has(w)))).toEqual([]);
    /* kontrola listy: każdy wyraz ukraiński naprawdę występuje w uk, każdy rosyjski w ru — lista nie jest martwa */
    const ukW = new Set(allUk().flatMap(words)), ruW = new Set(allRu().flatMap(words));
    expect([...UK_ONLY_WORDS].filter(w => !ukW.has(w))).toEqual([]); expect([...RU_ONLY_WORDS].filter(w => !ruW.has(w))).toEqual([]);
  });
  test('ru ≠ uk: słowniki nie są kopią — teksty z ≥ 3 wyrazami identyczne w obu językach to < 2 % (dziś kilka wpisów jak „пара: {a} ({r}); одна гантель: {b} ({r1})”)', () => {
    const keys = Object.keys(uk()); const same = keys.filter(k => uk()[k] === ru()[k] && uk()[k].split(/\s+/).length > 2).length;
    expect(same / keys.length).toBeLessThan(0.02);
  });
  /* Nazwy aplikacji i ekranów iOS po rosyjsku (Apple: Настройки, Файлы, приложение «Здоровье»). */
  test('Ustawienia = „Настройки”; teksty o Ustawieniach iOS, Plikach i Zdrowiu używają nazw systemu', () => {
    const d = ru();
    expect(d['Ustawienia']).toBe('Настройки');
    expect(d['Otwórz Ustawienia iOS']).toMatch(/Настройки iOS/);
    expect(d['Automatyczna kopia po każdym treningu trafia do Plików (Ustawienia).']).toMatch(/Файлах/);
    expect(d['Brak zgody na zapis treningów. Włącz ją w aplikacji Zdrowie: profil → Aplikacje → {app}.']).toMatch(/«Здоровье»/);
  });
  test('terminologia siłowni jednolita: тренировка / упражнение / подход / повторения / отдых / пауза / шаблон / резинка / до отказа / разгрузка', () => {
    const d = ru();
    expect([d['Trening'], d['Ćwiczenie'], d['Seria'], d['Powtórzenia'], d['Przerwa'], d['⏸ Pauza'], d['Szablon'], d['Guma'], d['do upadku'], d['Deload']])
      .toEqual(['Тренировка', 'Упражнение', 'Подход', 'Повторения', 'Отдых', '⏸ Пауза', 'Шаблон', 'Резинка', 'до отказа', 'Разгрузка']);
    /* seria = „подход” (nie kalka „серия”/„сет”), ćwiczenie = „упражнение” (nie „вправа”) */
    expect(allRu().filter(v => /(^|[^\p{L}])(сери[яиюей]|сет[ыа]?|сетов)([^\p{L}]|$)/u.test(v.toLowerCase().replace(/дроп-сет/g, '')))).toEqual([]); /* „дроп-сет” — termin siłowni */
  });
  test('typografia: rosyjskie cudzysłowy «…» zamiast „…” i “…”', () => {
    expect(allRu().filter(v => /[„“”]/.test(v))).toEqual([]);
    expect(entries().filter(([k]) => /[„“]/.test(k)).every(([, v]) => /«/.test(v))).toBe(true);
  });
  test('jednostki i skróty cyrylicą: 45 с, 1,5 км, макс. (fmtSec, fmtDist, reps)', () => {
    applyLang('ru');
    try { expect([fmtSec(45), fmtSec(95), fmtDist(800), fmtDist(1500), reps(null, null), reps(8, 12)]).toEqual(['45 с', '1:35', '800 м', '1,5 км', 'макс.', '8–12']); } finally { applyLang('pl'); }
  });
});

/* ====================================================================================================================================== */
/** Czytnik cmap TTF (format 4) — czy krój ma znak. */
function hasGlyph(file: string) {
  const b = fs.readFileSync(file); const T: Record<string, number> = {};
  for (let i = 0; i < b.readUInt16BE(4); i++) { const o = 12 + 16 * i; T[b.toString('latin1', o, o + 4)] = b.readUInt32BE(o + 8); }
  let sub = -1; for (let i = 0; i < b.readUInt16BE(T.cmap + 2); i++) { const p = b.readUInt16BE(T.cmap + 4 + 8 * i), e = b.readUInt16BE(T.cmap + 6 + 8 * i), off = b.readUInt32BE(T.cmap + 8 + 8 * i); if (b.readUInt16BE(T.cmap + off) === 4 && ((p === 3 && e === 1) || p === 0)) { sub = T.cmap + off; break; } }
  const seg = b.readUInt16BE(sub + 6) / 2, ends = sub + 14, starts = ends + 2 * seg + 2, deltas = starts + 2 * seg, ros = deltas + 2 * seg;
  return (ch: string) => { const cp = ch.codePointAt(0)!; for (let i = 0; i < seg; i++) { if (cp > b.readUInt16BE(ends + 2 * i)) continue; const st = b.readUInt16BE(starts + 2 * i); if (cp < st) return false; const d = b.readInt16BE(deltas + 2 * i), ro = b.readUInt16BE(ros + 2 * i); if (!ro) return ((cp + d) & 0xffff) > 0; const g = b.readUInt16BE(ros + 2 * i + ro + 2 * (cp - st)); return g ? ((g + d) & 0xffff) > 0 : false; } return false; };
}
describe('wygląd: rosyjska cyrylica w IBM Plex', () => {
  const FONTS = path.join(__dirname, '..', 'node_modules', '@expo-google-fonts');
  test('cały alfabet rosyjski (z „ё” i „Ё”) w IBM Plex Sans 400/600/700 i IBM Plex Mono 500 — bez kroju zastępczego', () => {
    const files = ['ibm-plex-sans/400Regular/IBMPlexSans_400Regular.ttf', 'ibm-plex-sans/600SemiBold/IBMPlexSans_600SemiBold.ttf', 'ibm-plex-sans/700Bold/IBMPlexSans_700Bold.ttf', 'ibm-plex-mono/500Medium/IBMPlexMono_500Medium.ttf'].map(f => hasGlyph(`${FONTS}/${f}`));
    const abc = 'абвгдеёжзийклмнопрстуфхцчшщъыьэюя'; const all = abc + abc.toUpperCase() + '«»—–№';
    expect(files.map(has => [...all].filter(ch => !has(ch)).join(''))).toEqual(['', '', '', '']);
  });
});
