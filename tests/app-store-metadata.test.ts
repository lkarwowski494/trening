/*
 * Metadane App Store (docs/15, zadanie 13.10.2026): limity Apple, brak nazw innych firm (wytyczne 2.3.7, 5.2.1), brak cen poza blokiem cenowym,
 * zgodność z kodem (liczba języków, ceny sklepu w pliku fałszywym, liczba lokalizacji) i z docs/15 (ten sam tekst — dokument nie rozjeżdża się z plikiem).
 * Dane: store/app-store-metadata.json (+ store/app-store-names.json). Wzór: tests/forbidden-names.test.ts.
 */
import * as fs from 'fs';
import * as path from 'path';
import { namesIn } from './forbidden-names';
import { LANG_NAME } from '@/lib/i18n';
import { FAKE_PRICES } from '@/lib/store-fake';
import { PAYWALL } from '@/lib/access';

const ROOT = path.join(__dirname, '..');
const META: { locales: Record<string, Record<string, string | null>> } = JSON.parse(fs.readFileSync(path.join(ROOT, 'store/app-store-metadata.json'), 'utf8'));
const NAMES: Record<string, string> = JSON.parse(fs.readFileSync(path.join(ROOT, 'store/app-store-names.json'), 'utf8')).names;
const DOC = fs.readFileSync(path.join(ROOT, 'docs/15-app-store.md'), 'utf8');
const LIMITS = { name: 30, subtitle: 30, keywordsBytes: 100, promo: 170, description: 4000 };
const chars = (s: string) => [...s].length;
const bytes = (s: string) => Buffer.byteLength(s, 'utf8');
const strings = (): { loc: string; field: string; s: string }[] => Object.entries(META.locales).flatMap(([loc, v]) => Object.entries(v).filter(([, s]) => typeof s === 'string').map(([field, s]) => ({ loc, field, s: s as string })));
const words = (s: string) => s.toLowerCase().split(/[^\p{L}\p{N}]+/u).filter(Boolean);
const NLANG = Object.keys(LANG_NAME).length;
const SKIP = ['en-GB'];

describe('metadane App Store: limity Apple', () => {
  test.each(Object.keys(NAMES))('nazwa %s ≤ 30 znaków', loc => { expect(chars(NAMES[loc])).toBeLessThanOrEqual(LIMITS.name); });
  test.each(Object.entries(META.locales))('%s: podtytuł ≤ 30 znaków, słowa kluczowe ≤ 100 bajtów, promo ≤ 170, opis (z blokiem cenowym) ≤ 4000', (_loc, v) => {
    expect(chars(v.subtitle ?? '')).toBeLessThanOrEqual(LIMITS.subtitle); expect((v.subtitle ?? '').length).toBeGreaterThan(0);
    expect(bytes(v.keywords ?? '')).toBeLessThanOrEqual(LIMITS.keywordsBytes);
    expect(chars(v.promo ?? '')).toBeLessThanOrEqual(LIMITS.promo);
    expect(chars((v.description ?? '') + '\n\n' + (v.pricingBlock ?? ''))).toBeLessThanOrEqual(LIMITS.description);
  });
  test.each(Object.entries(META.locales))('%s: słowa kluczowe bez spacji, powtórzeń i słów z nazwy lub podtytułu', (loc, v) => {
    const kw = (v.keywords ?? '').split(',');
    expect(kw.every(k => k.length > 0 && !/\s/.test(k))).toBe(true);
    expect(new Set(kw.map(k => k.toLowerCase())).size).toBe(kw.length);
    const used = new Set([...words(NAMES[loc] ?? ''), ...words(v.subtitle ?? '')]);
    expect(kw.filter(k => used.has(k.toLowerCase()))).toEqual([]);
  });
  test('rejestr nazw: 31 lokalizacji zgodnie z docs/15; en-GB jak en-US', () => {
    expect(Object.keys(NAMES).length).toBe(31); expect(DOC).toContain('31 lokalizacji');
    for (const loc of Object.keys(META.locales)) expect(NAMES[loc]).toBeDefined();
  });
});

describe('metadane App Store: treść', () => {
  test('bez nazw innych aplikacji i marek (lista z tests/forbidden-names.json)', () => {
    expect(strings().map(x => ({ ...x, n: namesIn(x.s) })).filter(x => x.n.length).map(x => `${x.loc}.${x.field}: ${x.n}`)).toEqual([]);
  });
  test('bez cen w podtytule, słowach, tekście promocyjnym i opisie (Apple 2.3.7); ceny tylko w pricingBlock', () => {
    for (const x of strings().filter(y => y.field !== 'pricingBlock' && y.field !== 'keywords')) expect({ ...x, price: /\d[.,]\d\d\s?(zł|PLN|USD|EUR|GBP|\$|€|£)|[$€£]\s?\d/.test(x.s) }).toEqual({ ...x, price: false });
  });
  test('liczba języków w opisie = liczba języków aplikacji (LANG_NAME)', () => {
    expect(NLANG).toBe(35);
    expect(META.locales.pl.description).toContain(`${NLANG} języków`); expect(META.locales['en-US'].description).toContain(`${NLANG} languages`);
  });
  test('blok cenowy EN: kwoty = ceny w pliku sklepu (FAKE_PRICES); 4 darmowe treningi = PAYWALL.FREE_LIVE_PER_MONTH', () => {
    const en = META.locales['en-US'].pricingBlock as string;
    for (const p of Object.values(FAKE_PRICES)) expect(en).toContain(p.replace('$', ''));
    expect(en).toContain(`${PAYWALL.FREE_LIVE_PER_MONTH} live workouts`); expect(META.locales.pl.pricingBlock).toContain(`${PAYWALL.FREE_LIVE_PER_MONTH} treningi na żywo`);
  });
  test('opis nie obiecuje płatności ani zegarków/głosu (wydanie 0.20 — dopiero po wydaniu); zakup wyłączony → blok cenowy poza opisem', () => {
    expect(PAYWALL.ENABLED).toBe(false);
    for (const x of strings().filter(y => y.field === 'description' || y.field === 'descriptionOpening')) expect({ ...x, bad: /subskrypc|subscription|Abo|zegark|watch|Uhr|słuchawk|earbuds|głos|voice/i.test(x.s) }).toEqual({ ...x, bad: false });
  });
  test('opis wymienia integrację z Apple Health (wytyczne Apple 2.5.1)', () => {
    for (const l of ['pl', 'en-US']) expect(META.locales[l].description).toContain('Apple Health');
  });
  test('opis: zastrzeżenie medyczne; bez superlatywów i obietnic efektów', () => {
    expect(META.locales.pl.description).toContain('nie jest poradnikiem medycznym'); expect(META.locales['en-US'].description).toContain('not medical advice');
    for (const x of strings().filter(y => y.field === 'description')) expect({ ...x, bad: /najlepsz|\bnr 1\b|#1|best\b|guarantee|gwarantuj/i.test(x.s) }).toEqual({ ...x, bad: false });
  });
});

describe('metadane App Store: zgodność z docs/15', () => {
  test('każde pole z pliku występuje w docs/15 dosłownie', () => {
    expect(strings().filter(x => !DOC.includes(x.s)).map(x => `${x.loc}.${x.field}`)).toEqual([]);
  });
  test('lokalizacje bez gotowych tekstów są w tabeli „do tłumaczenia” (en-GB — kopia en-US)', () => {
    const todo = Object.keys(NAMES).filter(l => !(l in META.locales) && !SKIP.includes(l));
    expect(todo.length).toBe(27);
    const tab = DOC.slice(DOC.indexOf('### Do tłumaczenia'));
    expect(todo.filter(l => !tab.includes('`' + l + '`'))).toEqual([]);
  });
});
