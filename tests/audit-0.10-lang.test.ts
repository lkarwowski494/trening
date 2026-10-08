/*
 * Audyt 0.10 — języki (docs/25 grupa K, docs/audyt-0.10/A11.md). Logika i słowniki; ekrany: tests/audit-0.10-lang-ui.test.tsx.
 * K1 (A11-01): „Przerwa” (odpoczynek między seriami) i „Pauza” (zatrzymanie zegara treningu) to różne słowa w każdym języku.
 */
import { EN } from '@/lib/i18n.en';
import { LOCALES } from '@/lib/locales';
import { LANGS, upper, LOCALE_UPPER, type Lang } from '@/lib/i18n';

const dictOf = (l: Lang): Record<string, string> => l === 'en' ? EN : (LOCALES[l] ?? {});
const tr = (l: Lang, k: string) => l === 'pl' ? k : dictOf(l)[k] ?? EN[k] ?? k;
type NonPl = Exclude<Lang, 'pl'>;
const NON_PL = LANGS.filter(l => l !== 'pl') as NonPl[];

/**
 * Termin przerwy (rest) i pauzy (pause) w każdym języku — rdzenie (wyrażenia regularne, bez wielkości liter). Wybór 09.10.2026 (A11-01):
 * tam, gdzie słowo „pauza” jest zwykłym terminem przerwy między seriami w ~30 tekstach (cs, sk, ro, et, de), pauza treningu dostaje
 * czasownik jak w iOS (cs/sk „Pozastavit”, ro „Întrerupe”, et „Peata”, de „Anhalten”); w da/nb przerwa = „hvile” (już w tekstach),
 * pauza zostaje „pause”; fi przerwa = „palautus”, pauza = „tauko”. Pozostałe języki miały już dwa różne słowa.
 */
export const TERMS: Record<NonPl, { rest: RegExp; pause: RegExp }> = {
  en: { rest: /\brest/i, pause: /paus/i },
  cs: { rest: /pauz/i, pause: /pozastav/i }, sk: { rest: /pauz/i, pause: /pozastav/i },
  hu: { rest: /pihen/i, pause: /szünet/i }, ro: { rest: /pauz/i, pause: /întrerup/i },
  bg: { rest: /почив/i, pause: /пауз/i }, hr: { rest: /odmor/i, pause: /pauz/i }, sl: { rest: /počit/i, pause: /premor|ustav/i },
  sr: { rest: /одмор/i, pause: /пауз/i }, lt: { rest: /poils/i, pause: /pauz|pristabd/i }, lv: { rest: /atpūt/i, pause: /pauz|aptur/i },
  et: { rest: /paus/i, pause: /peat/i }, uk: { rest: /відп/i /* także skrót „відп.” w nagłówku kolumny */, pause: /пауз|призупин/i },
  es: { rest: /descans/i, pause: /paus/i }, pt: { rest: /descans/i, pause: /paus/i },
  de: { rest: /pause/i, pause: /anhalt|angehalten/i }, fr: { rest: /repos/i, pause: /pause/i }, it: { rest: /recuper/i, pause: /paus/i },
  nl: { rest: /rust/i, pause: /pauz/i }, sv: { rest: /vil[ao]/i, pause: /paus/i }, da: { rest: /hvil/i, pause: /pause/i }, nb: { rest: /hvil/i, pause: /pause/i },
  fi: { rest: /palaut/i, pause: /tauk|tauo|keskeyt/i }, tr: { rest: /dinlen/i, pause: /durakla/i }, el: { rest: /δι[άα]λε[ίι]μμ/i, pause: /παύσ|παυσ/i },
};
const KEYS = Object.keys(EN);
/** Przerwa między seriami (bez „Import przerwany”, „przerwie pomiar” i „dzień przerwy” — dzień odpoczynku między treningami). */
const REST_DAY = /dzie[ńn] przerwy|dniem przerwy/;
const REST_KEYS = KEYS.filter(k => /przerw/i.test(k) && !/przerwan|przerwie pomiar/i.test(k) && !REST_DAY.test(k) && !/pauz/i.test(k));
const PAUSE_KEYS = KEYS.filter(k => /pauz/i.test(k) && !/przerw/i.test(k));
const MIXED_KEYS = KEYS.filter(k => /pauz/i.test(k) && /przerw/i.test(k));
const words = (s: string) => new Set(s.toLowerCase().match(/\p{L}+/gu) ?? []);

describe('K1 (A11-01): przerwa ≠ pauza w każdym języku', () => {
  test('zestawy kluczy nie są puste (kontrola filtra)', () => {
    expect(REST_KEYS.length).toBeGreaterThanOrEqual(25); expect(PAUSE_KEYS.length).toBeGreaterThanOrEqual(5); expect(MIXED_KEYS.length).toBeGreaterThanOrEqual(1);
    expect(REST_KEYS).toEqual(expect.arrayContaining(['Przerwa', 'przerwa', 'przerwa {s}', 'Wydłuż przerwę o 15 sekund']));
    expect(PAUSE_KEYS).toEqual(expect.arrayContaining(['⏸ Pauza', 'pauza', 'Pauza treningu']));
  });
  test('słownik terminów obejmuje każdy język poza polskim', () => { expect(Object.keys(TERMS).sort()).toEqual([...NON_PL].sort()); });
  test.each(NON_PL)('%s: wyrazy „Przerwa” i „⏸ Pauza” / „pauza” / „Pauza treningu” są rozłączne', l => {
    const rest = new Set([...words(tr(l, 'Przerwa')), ...words(tr(l, 'przerwa'))]);
    const clash = ['⏸ Pauza', 'pauza', 'Pauza treningu'].flatMap(k => [...words(tr(l, k))].filter(w => rest.has(w)));
    expect([l, clash]).toEqual([l, []]);
  });
  test.each(NON_PL)('%s: każdy tekst o przerwie ma termin przerwy i nie ma terminu pauzy; każdy tekst o pauzie odwrotnie', l => {
    const { rest, pause } = TERMS[l]; const bad: string[] = [];
    for (const k of REST_KEYS) { const v = tr(l, k); if (!rest.test(v) || pause.test(v)) bad.push(`R ${k} → ${v}`); }
    for (const k of PAUSE_KEYS) { const v = tr(l, k); if (!pause.test(v) || rest.test(v)) bad.push(`P ${k} → ${v}`); }
    for (const k of MIXED_KEYS) { const v = tr(l, k); if (!pause.test(v) || !rest.test(v)) bad.push(`M ${k} → ${v}`); }
    for (const k of KEYS.filter(x => REST_DAY.test(x))) { const v = tr(l, k); if (pause.test(v)) bad.push(`D ${k} → ${v}`); }
    expect([l, bad]).toEqual([l, []]);
  });
});

describe('K2 (A11-02): upper() — wersaliki z regułami języka zamiast textTransform (iOS: uppercaseString bez języka)', () => {
  test('el: bez tonosu, dialytika zostaje, „άι/άυ” → „ΑΪ/ΑΫ”; tr: i → İ, ı → I; inne języki jak toUpperCase', () => {
    expect(upper('Γενικά', 'el')).toBe('ΓΕΝΙΚΑ'); expect(upper('Προπόνηση', 'el')).toBe('ΠΡΟΠΟΝΗΣΗ'); expect(upper('Μάιος', 'el')).toBe('ΜΑΪΟΣ');
    expect(upper('άυλος', 'el')).toBe('ΑΫΛΟΣ'); expect(upper('είναι', 'el')).toBe('ΕΙΝΑΙ'); expect(upper('ΐ', 'el')).toBe('Ϊ'); expect(upper('σετ ή όχι', 'el')).toBe('ΣΕΤ Ή ΟΧΙ' /* samodzielne „ή” = albo */); expect(upper('κοροϊδεύω', 'el')).toBe('ΚΟΡΟΪΔΕΥΩ');
    expect(upper('Bildirimler', 'tr')).toBe('BİLDİRİMLER'); expect(upper('ılık', 'tr')).toBe('ILIK');
    expect(upper('Ogólne', 'pl')).toBe('OGÓLNE'); expect(upper('Maß', 'de')).toBe('MASS'); expect(upper('Ελληνικά', 'en')).toBe('ΕΛΛΗΝΙΚΆ' /* poza el — jak system */); expect(upper('', 'el')).toBe('');
  });
  test.each(LANGS.filter(l => !LOCALE_UPPER.includes(l)))('%s: systemowe wersaliki bez języka (iOS textTransform = toUpperCase) dają to samo co reguły języka — textTransform zostaje', l => {
    const vals = l === 'pl' ? Object.keys(EN) : Object.values(dictOf(l));
    expect([l, vals.filter(v => v.toUpperCase() !== v.toLocaleUpperCase(l)).slice(0, 5)]).toEqual([l, []]);
  });
  test('LOCALE_UPPER = dokładnie języki, w których systemowe wersaliki są błędne (el, tr)', () => {
    expect(LANGS.filter(l => (l === 'pl' ? Object.keys(EN) : Object.values(dictOf(l))).some(v => v.toUpperCase() !== v.toLocaleUpperCase(l))).sort()).toEqual([...LOCALE_UPPER].sort());
  });
  test.each([...LANGS])('%s: każdy tekst słownika — upper() = toLocaleUpperCase(język) z ICU (reguły CLDR)', l => {
    const bad = Object.values(l === 'pl' ? Object.fromEntries(Object.keys(EN).map(k => [k, k])) : dictOf(l)).filter(v => upper(v, l) !== v.toLocaleUpperCase(l)).slice(0, 5);
    expect([l, bad]).toEqual([l, []]);
  });
});

describe('K3 (A11-17): jednostki przez t() — w cyrylicy i po grecku bez łacińskich „s”, „min”, „h”, „m”, „km”, „max”', () => {
  const LOCAL: Lang[] = ['uk', 'bg', 'sr', 'el'];
  test.each(LOCAL)('%s: żaden tekst słownika nie ma łacińskiej jednostki po liczbie/parametrze ani łacińskiego „max/min”', l => {
    const bad = Object.entries(dictOf(l)).filter(([, v]) => /(\d|\})\s?(s|min|h|m|km)\b|\b(max|min)\b/.test(v.replace(/\{(min|max)\}/g, ''))).map(([k, v]) => `${k} → ${v}`);
    expect([l, bad]).toEqual([l, []]);
  });
  test('fmtSec / fmtDist / reps / czas na kafelku w języku aplikacji (uk, el, hu, tr); pl i en jak dotąd', () => {
    const store = require('@/lib/store'); const { applyLang } = require('@/lib/i18n');
    const out = (l: Lang) => { applyLang(l); const r = [store.fmtSec(45), store.fmtSec(95), store.fmtDist(800), store.fmtDist(1500), store.reps(null, null), store.reps(8, 12)]; applyLang('pl'); return r; };
    expect(out('pl')).toEqual(['45 s', '1:35', '800 m', '1,5 km', 'max', '8–12']);
    expect(out('en')).toEqual(['45 s', '1:35', '800 m', '1.5 km', 'max', '8–12']);
    expect(out('uk')).toEqual(['45 с', '1:35', '800 м', '1,5 км', 'макс.', '8–12']);
    expect(out('el')).toEqual(['45 δευτ.', '1:35', '800 μ', '1,5 χλμ', 'μέγ.', '8–12']);
    expect(out('hu').slice(0, 1)).toEqual(['45 mp']); expect(out('tr').slice(0, 1)).toEqual(['45 sn']);
  });
});

describe('K2 (A11-08, A11-20): jeden termin dla jednego pojęcia w obrębie języka', () => {
  /** Synonimy, które zastąpiono jednym terminem (09.10.2026): it „scheda” (zakładka „Schede”), lt „serija”, et „seeria”, sl przerwa „počitek”. */
  const FORBIDDEN: [Lang, RegExp, string][] = [['it', /modell/i, 'Szablon = „scheda”'], ['lt', /priėjim/i, 'Seria = „serija”'],
    ['et', /\bsar(i|ja|ju|jad|jade|jas)\b|töösarj|abisarj/i, 'Seria = „seeria”'], ['sl', /odmor/i, 'Przerwa = „počitek”']];
  test.each(FORBIDDEN)('%s: bez synonimu %s (%s)', (l, re) => {
    expect([l, Object.entries(dictOf(l)).filter(([, v]) => re.test(v)).map(([k, v]) => `${k} → ${v}`)]).toEqual([l, []]);
  });
  test('it: „scheda” nie oznacza karty ekranu — „Nella scheda Schede” → „Nella sezione Schede”', () => { expect(Object.values(dictOf('it')).filter(v => /scheda Schede/.test(v))).toEqual([]); });
  test('lv: liczba mnoga — forma „zero” (0, 10–20, 30…) w dopełniaczu l.mn. we wszystkich wpisach (jak CLDR: „{0} dienu”)', () => {
    const plural = Object.keys(EN).filter(k => k.includes('|'));
    expect(plural.filter(k => !/u$/.test(dictOf('lv')[k].split('|')[0]))).toEqual([]);
  });
  test.each(LANGS.filter(l => l !== 'pl'))('%s: A11-20 — nagłówek „Inne”, przełącznik „Inne ▾/▴” i cytat w komunikacie to ta sama forma', l => {
    const h = tr(l, 'Inne'); const tog = tr(l, 'Inne ▾').replace(/\s*▾$/, ''); const tog2 = tr(l, 'Inne ▴').replace(/\s*▴$/, '');
    const msg = tr(l, 'Brak podobnych ćwiczeń w tym miejscu — rozwiń „Inne”.');
    expect([l, h === tog, h === tog2, msg.includes(h)]).toEqual([l, true, true, true]);
  });
});
