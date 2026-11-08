/*
 * ZB-044 Ś-1 (recenzja audytora 08.11.2026; poprawka 09.11.2026): VoiceOver — język samej nazwy ćwiczenia w wierszach planu dnia (pulpit) i w nagłówku Postępów:
 * ćwiczenie z biblioteki — głos angielski, przemianowane przez użytkownika (exRenamed) i własne — głos języka interfejsu (lib/i18n.ts exNameLang).
 */
import { within } from '@testing-library/react-native';
import * as store from '@/lib/store';
import * as plan from '@/lib/plan';
import { exName, applyLang } from '@/lib/i18n';
import { fresh, saved, ex, addWorkout, withDemoTemplates } from './helpers';
import { renderApp, flushAll, screen, act } from './app';

jest.setTimeout(120000);
describe('ZB-044 Ś-1 VoiceOver: język samej nazwy ćwiczenia w planie dnia i w Postępach (09.11.2026)', () => {
  const NOW = new Date(2026, 9, 8, 9, 0); /* czwartek */
  test.each([['pl', false], ['pl', true], ['de', false], ['de', true]] as const)('%s, przemianowane=%s: pulpit — wiersz planu dnia: nazwa z biblioteki głosem angielskim, przemianowana głosem języka', async (l, ren) => {
    jest.useFakeTimers({ now: NOW }); await fresh(undefined, 'pl'); const t = withDemoTemplates('pl');
    jest.setSystemTime(new Date(2026, 9, 5, 6).getTime()); plan.setWeekDay(3, t[0].id); plan.setPlanName('Plan'); jest.setSystemTime(NOW.getTime());
    addWorkout(new Date(2026, 9, 6, 18).getTime(), [['Back Squat', [{ weight: 100, reps: 5 }]]], 'Nogi');
    const first = store.getState().exercises.find(e => e.id === t[0].items[0].exerciseId)!; applyLang(l); const nm = ren ? 'Moja nazwa' : exName(first);
    if (ren) { first.name = nm; store.save(first); }
    await act(async () => { await store.flush(); }); await renderApp({ saved: JSON.parse(JSON.stringify(saved())), locale: l as never }); jest.setSystemTime(NOW.getTime()); await flushAll(10);
    const row = within(screen.getAllByTestId('today-item')[0]);
    expect(row.getByText(nm).props.accessibilityLanguage).toBe(ren ? l : 'en'); expect(row.getByText(/× /).props.accessibilityLanguage).toBe(l);
  });
  test.each([['pl', false], ['pl', true], ['de', false], ['de', true]] as const)('%s, przemianowane=%s: Postępy — nagłówek ćwiczenia: z biblioteki głos angielski, przemianowanego głos języka', async (l, ren) => {
    await fresh(undefined, 'pl'); const e = ex('Bench Press (sztanga)'); if (ren) { e.name = 'Wyciskanie płaskie'; store.save(e); }
    addWorkout(Date.now() - 86400000, [[e.name, [{ weight: 60, reps: 8 }]]], 'Góra');
    await act(async () => { await store.flush(); }); await renderApp({ saved: JSON.parse(JSON.stringify(saved())), locale: l as never, url: '/progress' }); await flushAll(20);
    expect(within(screen.getByTestId('progress-hero')).getByRole('header').props.accessibilityLanguage).toBe(ren ? l : 'en');
  });
});
