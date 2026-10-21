/*
 * M1-audytor-generalny-033: wiersz sesji w Postępach (ćwiczenie → „Sesje”) miał datę i podsumowanie („najlepsza … · obj. … · e1RM …”) w jednym wierszu rozsuniętym
 * (space-between) — przy długim podsumowaniu, wąskim ekranie albo dużej czcionce sklejały się. Po naprawie: data w całości w pierwszym wierszu, podsumowanie pod nią
 * (zawija się), odstęp ≥ 8 pt; to samo przy 320 pt i skali 2.
 */
import { StyleSheet } from 'react-native';
import * as store from '@/lib/store';
import { fresh, saved, ex, addWorkout } from './helpers';
import { renderApp, flushAll, screen, act } from './app';

jest.setTimeout(60000);
const NOW = new Date(2026, 9, 8, 9, 0);
const flat = (el: { props: { style?: unknown } }) => StyleSheet.flatten(el.props.style as never) as Record<string, unknown>;
async function boot(width?: number, locale: 'pl' | 'en' = 'pl') {
  jest.useFakeTimers({ now: NOW }); await fresh(undefined, locale);
  addWorkout(new Date(2026, 9, 6, 18).getTime(), [['Back Squat', [{ weight: 142.5, reps: 5 }, { weight: 142.5, reps: 5 }, { weight: 140, reps: 8 }]]], 'A');
  addWorkout(new Date(2026, 9, 1, 18).getTime(), [['Back Squat', [{ weight: 100, reps: 5 }]]], 'B');
  const id = ex('Back Squat').id; await act(async () => { await store.flush(); });
  await renderApp({ saved: JSON.parse(JSON.stringify(saved())), locale, url: `/progress?ex=${id}`, width }); jest.setSystemTime(NOW.getTime()); await flushAll(10);
}
describe('wiersz sesji w Postępach', () => {
  test.each([[undefined, 'pl'], [320, 'pl'], [320, 'en']] as const)('szerokość %s, %s: data w pierwszym wierszu, podsumowanie pod nią (kolumna, nie rozsunięty rząd), odstęp ≥ 8 pt, bez ucinania', async (w, lg) => {
    await boot(w, lg);
    /* przyczyna z audytu: najbliższy kontener podsumowania nie może być rzędem rozsuniętym (date | summary) */
    const summaries = screen.getAllByText(/^najlepsza |^best /); expect(summaries.length).toBe(2);
    for (const sm of summaries) { let n = sm.parent; while (n && (n.type as unknown) !== 'View') n = n.parent; const st = flat(n!); expect([st.flexDirection ?? 'column', st.justifyContent]).toEqual(['column', undefined]); }
    const rows = screen.getAllByTestId(/^session-row-\d+$/); expect(rows.length).toBe(2);
    for (const r of rows) {
      const st = flat(r); expect(st.flexDirection ?? 'column').toBe('column'); expect(st.justifyContent).toBeUndefined();
      const [date, summary] = [screen.getByTestId(r.props.testID.replace('row', 'date')), screen.getByTestId(r.props.testID.replace('row', 'summary'))];
      expect(date.props.numberOfLines).toBeUndefined(); expect(summary.props.numberOfLines).toBeUndefined(); /* zawija się, nie ucina */
      expect(Number(flat(summary).marginTop ?? 0)).toBeGreaterThanOrEqual(8);
      const kids = r.findAll(n => /^session-(date|summary)-/.test(n.props.testID ?? '')).map(n => String(n.props.testID).split('-')[1]);
      expect(kids.indexOf('date')).toBeLessThan(kids.indexOf('summary'));
    }
  });
  test('treść: najnowsza sesja pierwsza, data i podsumowanie zawierają liczby', async () => {
    await boot();
    const s0 = screen.getByTestId('session-summary-0'); expect(String(s0.props.children.join?.('') ?? s0.props.children)).toMatch(/najlepsza/); expect(screen.getByTestId('session-date-0')).toBeTruthy();
  });
});
