/* 28.10.2026 [M1-audytor-generalny-019; 09-lokalizacja-003]: klucze „… {n} ćw.” w źródle używają skrótu, żeby ominąć odmianę
 * liczebnika (1 ćwiczenie, 2–4 ćwiczenia, 5+ ćwiczeń). Przekład ma zachować skrót języka (klucz „ćw.”), a nie rozwijać go do jednej
 * formy („4 вправ”, „4 vaj”) — w językach z formami few/many to błąd gramatyczny. Alternatywa: klucz liczebnikowy przez tp(). */
import { EN } from '@/lib/i18n.en';
import { LANGS } from '@/lib/i18n';
import { LOCALES } from '@/lib/locales';
import { PLURAL_FORMS, type PluralLang } from '@/lib/plural';

const dict = (l: string): Record<string, string> => (l === 'en' ? EN : (LOCALES as Record<string, Record<string, string>>)[l]) ?? {};
const SKROT = 'ćw.';
const keys = Object.keys(EN).filter(k => /\{\w+\} ćw\.$/.test(k));

test('źródło ma klucze ze skrótem „{n} ćw.” (zabezpieczenie testu przed pustą pętlą)', () => {
  expect(keys.length).toBeGreaterThanOrEqual(3);
});

/* Języki, w których rzeczownik po liczebniku zmienia formę (few/two). Bez odmiany lub z jedną formą (fi, ko, ja, zh-Hant, id…) dopuszczają pełne słowo/klasyfikator. */
const ODMIENNE = LANGS.filter(l => l !== 'pl' && PLURAL_FORMS[l as PluralLang].some(f => f === 'few' || f === 'two'));

test('lista języków z odmianą obejmuje uk i sl', () => {
  expect(ODMIENNE).toEqual(expect.arrayContaining(['uk', 'sl']));
});

describe.each(ODMIENNE)('skrót liczebnika ćwiczeń: %s', l => {
  test('każdy klucz „{n} ćw.” kończy się skrótem tego języka (klucz „ćw.”), nie rozwiniętą formą', () => {
    const d = dict(l), skrot = d[SKROT];
    expect(typeof skrot).toBe('string');
    const zle = keys.filter(k => d[k] !== undefined && !d[k].endsWith(`{n} ${skrot}`)).map(k => `${k} → ${d[k]} (skrót: ${skrot})`);
    expect(zle).toEqual([]);
  });
});
