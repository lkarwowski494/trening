/*
 * M1-audytor-generalny-042: ręczne reguły liczby mnogiej (lib/plural.ts) zamiast reguł CLDR z platformy. Dziś zgodne z CLDR (porównanie wszystkich języków: tests/matrix-i18n.test.tsx),
 * zamiana na Intl.PluralRules w Hermesie nie jest potrzebna — ma być strażnik: (1) każdy język z LANGS ma regułę (nowy język bez reguły → czerwone, bez wyjątku w czasie działania),
 * (2) platforma zna każdy kod języka (porównanie nie przechodzi po cichu na zapasowym „en”), (3) każda forma ze słownika jest osiągalna, (4) kategorie CLDR liczb całkowitych mają formę.
 */
import { LANGS } from '@/lib/i18n';
import { PLURAL_FORMS, pluralIndex, type PluralLang } from '@/lib/plural';
import { LOCALES } from '@/lib/locales';
import { EN } from '@/lib/i18n.en';

/** Języki bez reguły liczby mnogiej (pusta lista = każdy język z `langs` ma wpis w PLURAL_FORMS i działającą pluralIndex). */
const noRule = (langs: readonly string[]): string[] => langs.filter(l => { try { return !(l in PLURAL_FORMS) || !Number.isInteger(pluralIndex(l as PluralLang, 2)); } catch { return true; } });

describe('liczba mnoga: strażnik zgodności zbioru języków', () => {
  test('(1) każdy język z LANGS ma regułę; „nowy język” bez reguły jest wykrywany (dowód, że strażnik potrafi paść)', () => {
    expect(noRule(LANGS)).toEqual([]); expect(noRule([...LANGS, 'xx'])).toEqual(['xx']); expect(Object.keys(PLURAL_FORMS).sort()).toEqual([...LANGS].sort());
  });
  test('(2) platforma zna każdy kod języka aplikacji (Intl.PluralRules.supportedLocalesOf) — porównanie z CLDR nie liczy się z zapasowym „en”', () => {
    const tag = (l: string) => (l === 'zh-Hant' ? 'zh-Hant' : l);
    const unknown = LANGS.filter(l => Intl.PluralRules.supportedLocalesOf([tag(l)]).length === 0); expect(unknown).toEqual([]);
  });
  test('(3) dla każdego języka formy słownika (PLURAL_FORMS) są osiągalne dla liczb całkowitych, a kategorie CLDR liczb całkowitych mają formę', () => {
    for (const l of LANGS) {
      const pr = new Intl.PluralRules(l); const forms = PLURAL_FORMS[l] as readonly string[]; const reach = new Set<number>(); const cats = new Set<string>();
      for (let n = 0; n <= 1000; n++) { reach.add(pluralIndex(l, n)); cats.add(pr.select(n)); }
      expect([l, reach.size]).toEqual([l, forms.length]); expect([l, [...cats].filter(c => !forms.includes(c) && c !== 'other')]).toEqual([l, []]);
    }
  });
  test('(4) wpisy liczby mnogiej w słownikach mają tyle form, ile reguła języka (żaden język nie ma wpisu o złej liczbie form)', () => {
    const keys = Object.keys(EN).filter(k => k.includes('|')); expect(keys.length).toBeGreaterThan(10);
    for (const l of LANGS) { if (l === 'pl' || l === 'en' || l === 'es-419' || l === 'pt-BR') continue; const d = (LOCALES as Record<string, Record<string, string>>)[l] ?? {}; const bad = keys.filter(k => d[k] !== undefined && d[k].split('|').length !== PLURAL_FORMS[l].length); expect([l, bad]).toEqual([l, []]); }
  });
});
