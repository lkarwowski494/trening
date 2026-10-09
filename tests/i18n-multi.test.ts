/* Wiele języków (decyzja właściciela 05.10.2026): reguły liczby mnogiej, wykrywanie języka telefonu, zapasowy angielski. */
import { pluralIndex, PLURAL_FORMS } from '@/lib/plural';
import { LANGS, applyLang, t, tp, lang, locale, fold, tIn, exName, LANG_NAME } from '@/lib/i18n';

const forms = (l: any, ns: number[]) => ns.map(n => PLURAL_FORMS[l as keyof typeof PLURAL_FORMS][pluralIndex(l, n)]);
describe('liczba mnoga (CLDR, liczby całkowite)', () => {
  test('przykłady dla każdej rodziny reguł', () => {
    expect(forms('pl', [1, 2, 5, 12, 22, 25, 1.5])).toEqual(['one', 'few', 'many', 'many', 'few', 'many', 'many']);
    expect(forms('cs', [1, 2, 4, 5, 22])).toEqual(['one', 'few', 'few', 'other', 'other']);
    expect(forms('uk', [1, 2, 5, 11, 21, 22, 111])).toEqual(['one', 'few', 'many', 'many', 'one', 'few', 'many']);
    expect(forms('hr', [1, 21, 3, 13, 25])).toEqual(['one', 'one', 'few', 'other', 'other']);
    expect(forms('lt', [1, 2, 9, 10, 11, 21, 19])).toEqual(['one', 'few', 'few', 'other', 'other', 'one', 'other']);
    expect(forms('lv', [0, 1, 2, 10, 11, 21])).toEqual(['zero', 'one', 'other', 'zero', 'zero', 'one']);
    expect(forms('sl', [1, 2, 3, 5, 101, 102, 104])).toEqual(['one', 'two', 'few', 'other', 'one', 'two', 'few']);
    expect(forms('ro', [0, 1, 2, 19, 20, 101, 119, 120])).toEqual(['few', 'one', 'few', 'few', 'other', 'few', 'few', 'other']);
    expect(forms('hu', [1, 2])).toEqual(['one', 'other']);
  });
  test('każdy język aplikacji ma reguły', () => { for (const l of LANGS) expect([l, !!PLURAL_FORMS[l]]).toEqual([l, true]); });
});

describe('języki aplikacji', () => {
  afterEach(() => applyLang('pl'));
  test('lista języków (LANGS, 26 od 07.10.2026, 28 od fali 1 — es-419, pt-BR) z nazwami własnymi; ustawienie języka i locale do dat/liczb', () => {
    expect(LANGS).toEqual(['pl', 'en', 'cs', 'sk', 'hu', 'ro', 'bg', 'hr', 'sl', 'sr', 'lt', 'lv', 'et', 'uk', 'es', 'es-419', 'pt', 'pt-BR', 'de', 'fr', 'it', 'nl', 'sv', 'da', 'nb', 'fi', 'tr', 'el']);
    expect(LANG_NAME.cs).toBe('Čeština'); expect(LANG_NAME.uk).toBe('Українська'); expect(LANG_NAME.de).toBe('Deutsch'); expect(LANG_NAME.el).toBe('Ελληνικά'); expect(LANG_NAME.nb).toBe('Norsk');
    applyLang('cs'); expect(lang()).toBe('cs'); expect(locale()).toMatch(/^cs/);
    applyLang('uk'); expect(locale()).toMatch(/^uk/);
  });
  test('brak tłumaczenia w danym języku → angielski (nie polski); polski bez zmian', () => {
    applyLang('cs'); expect(t('__brak__klucza__')).toBe('__brak__klucza__'); expect(t('Zakończ trening i zapisz').length).toBeGreaterThan(0); expect(t('Zakończ trening i zapisz')).not.toBe('Zakończ trening i zapisz');
    applyLang('pl'); expect(t('Zakończ trening i zapisz')).toBe('Zakończ trening i zapisz');
  });
  test('nazwy ćwiczeń z biblioteki w językach innych niż polski — po angielsku', () => {
    applyLang('hu'); expect(exName({ name: 'Wiosłowanie na linkach (siedząc)', lib: true })).toBe(applyLangThen('en', () => exName({ name: 'Wiosłowanie na linkach (siedząc)', lib: true })));
  });
  test('tp: formy z słownika danego języka wg reguł; brak — angielskie', () => {
    applyLang('en'); expect(tp(2, 'sesja|sesje|sesji')).toBe('sessions');
  });
  test('fold: wyszukiwanie bez znaków diakrytycznych w każdym języku', () => {
    expect(fold('Čeština Łódź Őrült Ăă Ș')).toBe('cestina lodz orult aa s');
  });
  test('tIn: tekst w języku danych', () => { expect(tIn('en', 'Nowy szablon')).toBe('New template'); expect(tIn('pl', 'Nowy szablon')).toBe('Nowy szablon'); });
});
function applyLangThen<T>(l: any, f: () => T): T { applyLang(l); const r = f(); return r; }

import * as store from '@/lib/store';
import { renderApp, flushAll, screen, go, tap } from './app';
describe('wybór języka (ekran)', () => {
  afterEach(() => applyLang('pl'));
  test('Ustawienia → Język → lista wszystkich języków (LANGS) + „Jak w telefonie”; wybór zapisuje się i wraca do ustawień', async () => {
    await renderApp(); await go('/more/settings'); await flushAll(10);
    await tap(screen.getByText('Język')); await flushAll(5);
    for (const l of LANGS) expect(screen.getByText(LANG_NAME[l])).toBeTruthy();
    await tap(screen.getByText('Čeština')); await flushAll(10);
    expect(store.getState().settings.language).toBe('cs'); expect(lang()).toBe('cs');
    const raw = JSON.parse(JSON.stringify(store.getState())); expect(store.migrate(raw).settings.language).toBe('cs');
  });
});
