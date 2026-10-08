/*
 * Ręczne oznaczenie tygodnia jako deload (pakiet C, 08.10.2026): etykieta użytkownika, bez porad i bez automatyki — brak podstaw dla
 * automatycznego deloadu (docs/21 sekcja 5, B8). State.deloadWeeks (poniedziałki RRRR-MM-DD), store.isDeloadWeek / toggleDeloadWeek.
 * Rodzaje (docs/20): logika (dowolny dzień tygodnia → ten sam tydzień), dane (sanityzacja, brak pola przy pustej liście, zapis/odczyt),
 * ekran (przełącznik w podsumowaniu tygodnia, opis, poprzedni tydzień, „D” na wykresach), języki (EN). E2E: .maestro/05.
 */
import * as store from '@/lib/store';
import { applyLang } from '@/lib/i18n';
import { fresh, addWorkout, saved } from './helpers';
import { renderApp, flushAll, screen, tap, act } from './app';

const NOW = new Date(2026, 9, 8, 18, 0); /* czwartek; poniedziałek 5.10 */
const S = () => store.getState();
beforeEach(async () => { jest.useFakeTimers({ now: NOW }); await fresh(); });
afterEach(() => { applyLang('pl'); });

describe('logika i dane', () => {
  test('oznaczenie dotyczy całego tygodnia od poniedziałku; ponowne — zdejmuje; pusta lista znika', () => {
    store.toggleDeloadWeek(new Date(2026, 9, 8, 7).getTime()); expect(S().deloadWeeks).toEqual(['2026-10-05']);
    expect([new Date(2026, 9, 5, 0, 0).getTime(), new Date(2026, 9, 11, 23, 59).getTime()].map(store.isDeloadWeek)).toEqual([true, true]);
    expect([new Date(2026, 9, 4, 23, 59).getTime(), new Date(2026, 9, 12, 0, 0).getTime()].map(store.isDeloadWeek)).toEqual([false, false]);
    store.toggleDeloadWeek(new Date(2026, 9, 11).getTime()); expect(S().deloadWeeks).toBeUndefined();
  });
  test('sanityzacja: tylko poniedziałki w formacie daty, bez powtórzeń, posortowane; zapis i odczyt', async () => {
    (S() as any).deloadWeeks = ['2026-10-05', '2026-10-06', 'x', 7, '2026-09-28', '2026-10-05']; store.save(); await store.flush();
    await fresh(saved()); expect(S().deloadWeeks).toEqual(['2026-09-28', '2026-10-05']);
    (S() as any).deloadWeeks = ['zły']; store.save(); await store.flush(); await fresh(saved()); expect('deloadWeeks' in S()).toBe(false);
  });
});

describe('ekran Postępy', () => {
  const boot = async (fn: () => void = () => {}, locale: 'pl' | 'en' = 'pl') => { await fresh(undefined, locale); addWorkout(new Date(2026, 9, 6, 18).getTime(), [['Back Squat', [{ weight: 100, reps: 5 }]]]); fn(); await act(async () => { await store.flush(); }); await renderApp({ saved: JSON.parse(JSON.stringify(saved())), locale, url: '/more/progress' }); jest.setSystemTime(NOW.getTime()); await flushAll(10); };
  test('przełącznik „Tydzień deload” z opisem; oznaczenie zapisuje się i dodaje „D” na wykresach tygodniowych z objaśnieniem', async () => {
    await boot();
    expect(screen.getByText('Twoje oznaczenie, np. lżejszy tydzień. Aplikacja go nie ocenia ani nie planuje.')).toBeTruthy();
    expect(screen.queryByText(/D — tydzień oznaczony jako deload\./)).toBeNull();
    await tap(screen.getByText('Tydzień deload')); await flushAll(5);
    expect(S().deloadWeeks).toEqual(['2026-10-05']); expect(screen.getAllByLabelText(/^Wykres słupkowy: .* D: /).length).toBe(2); /* oba wykresy tygodniowe — etykieta tygodnia z „D” */
    const legend = 'D — tydzień oznaczony jako deload.'; expect(screen.getByText(new RegExp(' ' + legend.replace(/[.]/g, '\\.') + '$'))).toBeTruthy(); /* dopisek po opisie wykresów */
  });
  test('poprzedni tydzień oznaczony — informacja pod przełącznikiem; w widoku miesiąca przełącznika nie ma', async () => {
    await boot(() => { store.toggleDeloadWeek(new Date(2026, 8, 30).getTime()); });
    expect(screen.getByText('Poprzedni tydzień jest oznaczony jako deload.')).toBeTruthy();
    await tap(screen.getByText('Miesiąc')); await flushAll(5); expect(screen.queryByText('Tydzień deload')).toBeNull();
  });
  test('English', async () => {
    await boot(() => {}, 'en'); expect(screen.getByText('Deload week')).toBeTruthy();
    expect(screen.getByText('Your own label, e.g. a lighter week. The app does not judge or plan it.')).toBeTruthy();
  });
});
