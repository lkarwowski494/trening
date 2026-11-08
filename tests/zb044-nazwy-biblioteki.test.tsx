/*
 * ZB-044 (decyzje właściciela 07.11.2026 i 08.11.2026, docs/18; zastępuje DEC-13): nazwy ćwiczeń z biblioteki po angielsku we WSZYSTKICH językach, także polskim;
 * karta ćwiczenia: tytuł angielski, pod nim nazwa lokalna (wariant A „Podpis”) — tylko z listy po recenzji (lib/nazwy-lokalne.ts, dziś pusta);
 * ćwiczenie własne — jedna nazwa; wyszukiwanie także po nazwie lokalnej. Rodzaje (docs/20): logika, macierz języków, ekran (karta, listy), VoiceOver, niezmienniki danych.
 */
import * as store from '@/lib/store';
import { exName, exNameLang, exLocal, exLocalFold, applyLang, fold, LANGS, type Lang } from '@/lib/i18n';
import { NAZWY_LOKALNE } from '@/lib/nazwy-lokalne';
import { CATALOG } from '@/lib/catalog.generated';
import { fresh, saved, ex } from './helpers';
import { renderApp, flushAll, screen, act, type as typeText } from './app';

jest.setTimeout(60000);
const LIST = NAZWY_LOKALNE as Record<string, Record<string, string>>;
afterEach(() => { applyLang('pl'); for (const k of Object.keys(LIST)) delete LIST[k]; });
const own = (n = 'Moje ćwiczenie') => { const e = store.newExercise(n); e.lib = false; store.save(e); return e; };

describe('ZB-044 logika: exName / exNameLang / exLocal w każdym języku', () => {
  test.each(LANGS.map(l => [l] as const))('%s: ćwiczenie z biblioteki — nazwa angielska, głos en; własne — jak wpisane, głos języka', async l => {
    await fresh(); applyLang(l as Lang);
    for (const [name, want] of [['Bench Press (sztanga)', 'Bench Press'], ['Wyciskanie na linkach (stojąc)', 'Standing Cable Chest Press'], ['Back Squat', 'Back Squat']] as const) {
      const e = store.getState().exercises.find(x => x.name === name || x.libKey === name); expect([l, name, e ? exName(e) : '(brak)']).toEqual([l, name, want]);
      expect(exNameLang(e)).toBe('en');
    }
    const m = { name: 'Moje ćwiczenie', lib: false }; expect(exName(m)).toBe('Moje ćwiczenie'); expect(exNameLang(m)).toBe(l); expect(exLocal(m)).toBeUndefined();
  });
  test('polski: żadna nazwa biblioteki nie zostaje z polskim dopiskiem w nawiasie (sztanga/hantle/linki/ławka)', async () => {
    await fresh(); applyLang('pl');
    const bad = store.getState().exercises.filter(e => e.lib && /\((sztanga|hantle|hantel|linki|ławka|bieżnia)\)/.test(exName(e))).map(e => exName(e));
    expect(bad).toEqual([]);
  });
  test('lista nazw po recenzji jest pusta, dopóki nie powstanie recenzja — nazwa lokalna nie bierze się z dawnego katalogu PL', async () => {
    await fresh(); expect(Object.keys(NAZWY_LOKALNE)).toEqual([]);
    for (const l of LANGS) { applyLang(l as Lang); for (const e of store.getState().exercises.filter(x => x.lib)) expect([l, exLocal(e)]).toEqual([l, undefined]); }
  });
  test('z listą: pl/de pokazują nazwę lokalną; en, ćwiczenie własne, nazwa identyczna z angielską (wielkość liter) i brak wpisu — nie', async () => {
    await fresh(); const e = ex('Bench Press (sztanga)'); const k = e.libKey ?? e.name;
    LIST.pl = { [k]: 'Wyciskanie sztangi leżąc' }; LIST.de = { [k]: 'bench press' };
    applyLang('pl'); expect(exLocal(e)).toBe('Wyciskanie sztangi leżąc'); expect(exLocalFold(e)).toBe(fold('Wyciskanie sztangi leżąc')); expect(exName(e)).toBe('Bench Press');
    applyLang('de'); expect(exLocal(e)).toBeUndefined(); /* identyczna z angielską */
    applyLang('en'); expect(exLocal(e)).toBeUndefined();
    applyLang('fr'); expect(exLocal(e)).toBeUndefined(); expect(exLocalFold(e)).toBe('');
    applyLang('pl'); expect(exLocal({ ...e, name: 'Moje', lib: false })).toBeUndefined(); expect(exLocal(ex('Back Squat'))).toBeUndefined();
  });
  test('strażnik listy: wpisy tylko dla znanych języków i kluczy katalogu, nazwa niepusta', () => {
    for (const [l, m] of Object.entries(NAZWY_LOKALNE)) { expect(LANGS).toContain(l); for (const [k, v] of Object.entries(m)) { expect(Object.keys(CATALOG)).toContain(k); expect(v.trim().length).toBeGreaterThan(0); } }
  });
  test('dane użytkownika bez migracji: zapisana nazwa ćwiczenia (e.name) zostaje polska, zmienia się tylko wyświetlanie', async () => {
    await fresh(); const e = ex('Wyciskanie na linkach (stojąc)'); const before = e.name; applyLang('pl');
    expect(exName(e)).toBe('Standing Cable Chest Press'); expect(e.name).toBe(before);
  });
});

describe('ZB-044 ekran: karta ćwiczenia (wariant A „Podpis”)', () => {
  const boot = async (locale: 'pl' | 'en' | 'de', url: string) => { await fresh(undefined, 'pl'); await act(async () => { await store.flush(); }); await renderApp({ saved: JSON.parse(JSON.stringify(saved())), locale: locale as never, url }); await flushAll(20); };
  test.each(['pl', 'de', 'en'] as const)('%s, bez listy nazw: tytuł angielski z głosem en, bez drugiej linii', async l => {
    await fresh(undefined, 'pl'); const id = ex('Wyciskanie na linkach (stojąc)').id; await boot(l, `/exercise/${id}`);
    const h = screen.getByText('Standing Cable Chest Press'); expect(h.props.accessibilityLanguage).toBe('en'); expect(h.props.accessibilityRole).toBe('header');
    expect(screen.queryByTestId('exercise-local-name')).toBeNull();
  });
  test.each(['pl', 'de'] as const)('%s, z listą: pod tytułem nazwa lokalna (osobny element w języku interfejsu), tytuł dalej angielski', async l => {
    await fresh(undefined, 'pl'); const e = ex('Wyciskanie na linkach (stojąc)'); LIST[l] = { [e.libKey ?? e.name]: 'Wyciskanie na linkach stojąc (nazwa testowa)' }; await boot(l, `/exercise/${e.id}`);
    const h = screen.getByText('Standing Cable Chest Press'); expect(h.props.accessibilityLanguage).toBe('en');
    const loc = screen.getByTestId('exercise-local-name'); expect(loc.props.children).toBe('Wyciskanie na linkach stojąc (nazwa testowa)'); expect(loc.props.accessibilityLanguage).toBe(l);
    expect(loc.props.accessibilityRole).not.toBe('header'); expect(loc.props.style).toEqual(expect.arrayContaining([expect.objectContaining({ marginTop: 4 })]));
  });
  test('ćwiczenie własne: jedna nazwa, bez drugiej linii (także z listą)', async () => {
    await fresh(undefined, 'pl'); LIST.pl = { 'Back Squat': 'Przysiad (test)' }; const m = own(); await act(async () => { await store.flush(); });
    await renderApp({ saved: JSON.parse(JSON.stringify(saved())), locale: 'pl', url: `/exercise/${m.id}` }); await flushAll(20);
    expect(screen.getByText('Moje ćwiczenie').props.accessibilityLanguage).toBe('pl'); expect(screen.queryByTestId('exercise-local-name')).toBeNull();
  });
  test('edycja po polsku pokazuje „Wyświetlane jako: …” (nazwa zapisana ≠ wyświetlana), pole Nazwa zachowuje zapisaną', async () => {
    await fresh(undefined, 'pl'); const e = ex('Wyciskanie na linkach (stojąc)'); await boot('pl', `/exercise/${e.id}`);
    await act(async () => { const { startEdit } = require('./app'); await startEdit(); }); await flushAll(10);
    expect(screen.getByText('Wyświetlane jako: Standing Cable Chest Press')).toBeTruthy(); expect(screen.getByDisplayValue('Wyciskanie na linkach (stojąc)')).toBeTruthy();
  });
});

describe('ZB-044 ekran: wyszukiwanie po nazwie angielskiej, zapisanej i lokalnej', () => {
  async function list(l: 'pl' | 'de', q: string) {
    await fresh(undefined, 'pl'); await act(async () => { await store.flush(); });
    await renderApp({ saved: JSON.parse(JSON.stringify(saved())), locale: l as never, url: '/exercises' }); await flushAll(20);
    await typeText(screen.getByPlaceholderText(require('@/lib/i18n').t('Szukaj ćwiczenia…')), q); await flushAll(300);
  }
  test('pl: lista pokazuje nazwy angielskie; wpis po angielsku i po zapisanej polskiej nazwie znajduje to samo ćwiczenie', async () => {
    await list('pl', 'Standing Cable'); expect(screen.getAllByText('Standing Cable Chest Press').length).toBeGreaterThan(0);
    await act(async () => { await store.flush(); }); expect(screen.queryByText(/\(sztanga\)|\(hantle\)/)).toBeNull();
  });
  test('pl: wyszukiwanie po nazwie lokalnej z listy znajduje ćwiczenie (wiersz nadal angielski)', async () => {
    await fresh(); const e = ex('Wyciskanie na linkach (stojąc)'); LIST.pl = { [e.libKey ?? e.name]: 'Zażółć stojący wyciąg' };
    await list('pl', 'zazolc stojacy'); expect(screen.getAllByText('Standing Cable Chest Press').length).toBeGreaterThan(0);
  });
});
