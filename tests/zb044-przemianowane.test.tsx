/*
 * ZB-044 W-1 (recenzja audytora 08.11.2026; decyzja koordynatora 08.11/09.11.2026, docs/18): ćwiczenie z biblioteki PRZEMIANOWANE przez użytkownika pokazuje jego nazwę
 * we wszystkich językach i miejscach (jak własne, jedna nazwa, bez nazwy lokalnej, głos języka interfejsu); nieprzemianowane — nazwa angielska z katalogu.
 * Rozpoznanie bez migracji: zapisana nazwa ≠ nazwy katalogowe ćwiczenia (klucz, nazwa ogólna LIB_DISPLAY_NAME, dawne klucze, nazwy EN: obecna i dawne).
 */
import * as store from '@/lib/store';
import { indexExercises, matchExercise } from '@/lib/csvparse';
import { exName, exRenamed, exNameLang, exLocal, applyLang, LANGS, type Lang } from '@/lib/i18n';
import { NAZWY_LOKALNE } from '@/lib/nazwy-lokalne';
import { formerNamesOf, type Exercise } from '@/lib/seed';
import { fresh, saved, ex } from './helpers';
import { renderApp, flushAll, screen, act, type as typeText } from './app';

jest.setTimeout(60000);
const LIST = NAZWY_LOKALNE as Record<string, Record<string, string>>;
afterEach(() => { applyLang('pl'); for (const k of Object.keys(LIST)) delete LIST[k]; });
const renamed = (e: Exercise, name: string): Exercise => ({ ...e, name });

describe('ZB-044 W-1 logika: przemianowanie ćwiczenia z biblioteki (08.11.2026)', () => {
  test.each(LANGS.map(l => [l] as const))('%s: przemianowane — nazwa użytkownika, głos języka, bez nazwy lokalnej; nieprzemianowane — angielska', async l => {
    await fresh(); applyLang(l as Lang);
    for (const key of ['Bench Press (sztanga)', 'Decline Bench Press', 'Back Squat']) {
      const e = ex(key); const r = renamed(e, 'Moje wyciskanie');
      expect([l, key, exName(r)]).toEqual([l, key, 'Moje wyciskanie']); expect(exNameLang(r)).toBe(l); expect(exLocal(r)).toBeUndefined();
      expect([l, key, exName(e)]).toEqual([l, key, exName({ name: key, lib: true, libKey: key })]); expect(exNameLang(e)).toBe('en');
    }
    expect(exName(renamed(ex('Bench Press (sztanga)'), 'Wyciskanie płaskie'))).toBe('Wyciskanie płaskie');
  });
  test('polski: nazwa katalogowa, ogólna, dawna i angielska NIE są przemianowaniem', async () => {
    await fresh(); applyLang('pl');
    const bench = ex('Bench Press (sztanga)'); expect(exName(bench)).toBe('Bench Press'); expect(exName(renamed(bench, 'Bench Press'))).toBe('Bench Press');
    const db = ex('Bench Press (hantle)'); const former = formerNamesOf(db)[0]; expect(former).toBeTruthy();
    expect(exNameLang(renamed(db, former))).toBe('en'); /* dawny klucz = jeszcze nie przemianowane */
    const air = store.getState().exercises.find(e => e.libKey === 'Assault Bike')!; expect(air.name).toBe('Rower powietrzny'); expect(exName(air)).toBe('Air Bike'); expect(exNameLang(air)).toBe('en');
    expect(exName(renamed(air, 'Mój rower'))).toBe('Mój rower');
  });
  test('polski: ćwiczenie z biblioteki bez klucza (przemianowane przed libKey) pokazuje zapisaną nazwę; bez klucza z nazwą katalogową — po staremu', async () => {
    await fresh(); applyLang('pl');
    expect(exName({ name: 'Wyciskanie płaskie', lib: true })).toBe('Wyciskanie płaskie'); expect(exNameLang({ name: 'Wyciskanie płaskie', lib: true } as Exercise)).toBe('pl');
    expect(exName({ name: 'Bench Press (sztanga)', lib: true })).toBe('Bench Press');
  });
  test('exRenamed: przemianowane tak, nazwa katalogowa/ogólna/dawna/EN i ćwiczenie własne lub brak — nie', async () => {
    await fresh(); const e = ex('Bench Press (sztanga)');
    expect(exRenamed(renamed(e, 'Wyciskanie płaskie'))).toBe(true); expect(exRenamed(e)).toBe(false); expect(exRenamed(renamed(e, 'Bench Press'))).toBe(false);
    expect(exRenamed({ name: 'Moje', lib: false })).toBe(false); expect(exRenamed(undefined)).toBe(false); expect(exRenamed(null)).toBe(false);
  });
  test('zapis przemianowania w stanie: e.name = nazwa użytkownika, libKey i lib bez zmian (bez migracji)', async () => {
    await fresh(); const e = ex('Bench Press (sztanga)'); e.name = 'Wyciskanie płaskie'; store.save(e);
    const s = store.getState().exercises.find(x => x.id === e.id)!; expect([s.lib, s.libKey]).toEqual([true, 'Bench Press (sztanga)']); applyLang('pl'); expect(exName(s)).toBe('Wyciskanie płaskie');
  });
});

describe('ZB-044 W-1 ekran: karta, edycja, lista', () => {
  const boot = async (locale: 'pl' | 'de', url: string) => { await act(async () => { await store.flush(); }); await renderApp({ saved: JSON.parse(JSON.stringify(saved())), locale: locale as never, url }); await flushAll(20); };
  test.each(['pl', 'de'] as const)('%s: karta przemianowanego — tytuł to nazwa użytkownika (głos języka), bez nazwy lokalnej nawet z listą', async l => {
    await fresh(undefined, 'pl'); const e = ex('Bench Press (sztanga)'); LIST[l] = { [e.libKey!]: 'Wyciskanie sztangi leżąc' }; e.name = 'Wyciskanie płaskie'; store.save(e);
    await boot(l, `/exercise/${e.id}`);
    const h = screen.getByText('Wyciskanie płaskie'); expect(h.props.accessibilityLanguage).toBe(l); expect(screen.queryByTestId('exercise-local-name')).toBeNull(); expect(screen.queryByText('Bench Press')).toBeNull();
  });
  test('pl: edycja pola Nazwa — nowa nazwa widoczna od razu, bez „Wyświetlane jako”', async () => {
    await fresh(undefined, 'pl'); const e = ex('Bench Press (sztanga)'); await boot('pl', `/exercise/${e.id}`);
    await act(async () => { const { startEdit } = require('./app'); await startEdit(); }); await flushAll(10);
    expect(screen.getByText('Wyświetlane jako: Bench Press')).toBeTruthy();
    await typeText(screen.getByDisplayValue('Bench Press (sztanga)'), 'Wyciskanie płaskie'); await flushAll(10);
    expect(screen.queryByText(/Wyświetlane jako/)).toBeNull(); expect(screen.getByDisplayValue('Wyciskanie płaskie')).toBeTruthy();
  });
  test('pl i de: lista ćwiczeń pokazuje przemianowane pod nazwą użytkownika, nieprzemianowane po angielsku', async () => {
    for (const l of ['pl', 'de'] as const) {
      await fresh(undefined, 'pl'); const e = ex('Bench Press (sztanga)'); e.name = 'Wyciskanie płaskie'; store.save(e); await boot(l, '/exercises'); await typeText(screen.getByPlaceholderText(require('@/lib/i18n').t('Szukaj ćwiczenia…')), 'Wyciskanie płaskie'); await flushAll(300);
      expect(screen.getAllByText('Wyciskanie płaskie').length).toBeGreaterThan(0); expect(screen.queryByText(/\(sztanga\)|\(hantle\)/)).toBeNull();
    }
  });
});

describe('ZB-044 Ś-2 import CSV: kolizja nazwy z ćwiczeniem własnym (09.11.2026)', () => {
  test.each(['pl', 'de', 'en'] as const)('%s: „Bench Press” własne z 1.0 + biblioteka — dokładna nazwa trafia do własnego; nazwy biblioteki (z dopiskiem, dawne) dalej do biblioteki', async l => {
    await fresh(); applyLang(l);
    const mine = store.newExercise('Bench Press'); mine.lib = false; store.save(mine);
    const ix = indexExercises(store.getState().exercises);
    expect(matchExercise('Bench Press', ix)?.id).toBe(mine.id); expect(matchExercise('bench press', ix)?.id).toBe(mine.id);
    const lib = ex('Bench Press (sztanga)'); expect(matchExercise('Bench Press (sztanga)', ix)?.id).toBe(lib.id); expect(matchExercise('Bench Press (Barbell)', ix)?.id).toBe(lib.id);
  });
  test('bez własnego: „Bench Press” trafia do biblioteki (po angielskiej nazwie); własne zarchiwizowane nie wygrywa z aktywną biblioteką', async () => {
    await fresh(); applyLang('pl'); const lib = ex('Bench Press (sztanga)');
    expect(matchExercise('Bench Press', indexExercises(store.getState().exercises))?.id).toBe(lib.id);
    const mine = store.newExercise('Bench Press'); mine.lib = false; mine.archived = true; store.save(mine);
    expect(matchExercise('Bench Press', indexExercises(store.getState().exercises))?.id).toBe(lib.id);
  });
});
