/*
 * M1-audytor-generalny-040: kolory gum z zestawu startowego zapisywały się w języku INSTALACJI (seedState('en') → „red”), więc po zmianie języka zostawały w nim.
 * Po naprawie seed zapisuje polskie klucze (jak nazwy z biblioteki), a bandColor tłumaczy je na język interfejsu; zapisy sprzed zmiany (nazwa w języku instalacji,
 * np. „red”, „Rot”) też są rozpoznawane po słownikach i pokazują się w bieżącym języku. Własne kolory użytkownika — bez zmian.
 */
import { seedState } from '@/lib/seed';
import { applyLang, tIn, LANGS } from '@/lib/i18n';
import { bandColor, shortBand, bandA11y } from '@/lib/state/sets';
import { bandHex } from '@/lib/equipvis';

afterEach(() => { applyLang('pl'); });
const KEYS = ['czerwona', 'czarna', 'fioletowa'];

describe('gumy z zestawu startowego', () => {
  test.each(LANGS.map(l => [l]))('seedState(%s) zapisuje polskie klucze kolorów', l => {
    expect(seedState(l).bands.map(b => b.color)).toEqual(KEYS);
  });
  test('seedState(en) → po applyLang(de) bandColor zwraca niemiecką nazwę, po applyLang(en) angielską, po pl polską', () => {
    const bands = seedState('en').bands; for (const l of ['de', 'en', 'fr', 'ja', 'pl'] as const) { applyLang(l); expect([l, bands.map(b => bandColor(b))]).toEqual([l, KEYS.map(k => tIn(l, k))]); }
    applyLang('de'); expect(bandColor(bands[0])).toBe(tIn('de', 'czerwona')); expect(bandColor(bands[0])).not.toBe('czerwona');
  });
  test('skrót gumy i opis dla VoiceOver idą za językiem', () => {
    const b = seedState('en').bands[1]; applyLang('de'); expect(shortBand(b)).toBe(tIn('de', 'czarna')[0].toUpperCase() + b.level); expect(bandA11y(b)).toContain(tIn('de', 'czarna'));
  });
});
describe('zapisy sprzed zmiany (kolor w języku instalacji)', () => {
  test.each([['en', 'czerwona'], ['de', 'czerwona'], ['fr', 'czerwona'], ['en', 'czarna'], ['ja', 'fioletowa']] as const)('instalacja %s, kolor „%s” zapisany w jej języku → w innym języku nazwa w tym języku', (l, key) => {
    const stored = tIn(l, key); /* tak zapisywał stary seed: nazwa w języku instalacji */ expect(stored).not.toBe(key); const b = { color: stored, level: 2 };
    applyLang('fr'); expect([stored, bandColor(b)]).toEqual([stored, tIn('fr', key)]); applyLang('pl'); expect(bandColor(b)).toBe(key);
  });
  test('własny kolor użytkownika zostaje bez zmian w każdym języku', () => {
    for (const l of ['pl', 'en', 'de'] as const) { applyLang(l); expect(bandColor({ color: 'turkusowa' })).toBe('turkusowa'); expect(bandColor({ color: '' })).toBe('?'); }
  });
  test('rysunek gumy: kolor z nazwy także dla klucza polskiego i nazw w innych językach', () => {
    expect(bandHex('czerwona')).toBe('#D7263D'); expect(bandHex(tIn('de', 'czerwona'))).toBe('#D7263D'); expect(bandHex('turkusowa')).toBeNull();
  });
});
