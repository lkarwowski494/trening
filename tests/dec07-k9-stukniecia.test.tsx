/*
 * DEC-07 K9 (właściciel, 23.10.2026) — wymaganie: od ekranu treningu do odhaczonej serii NAJWYŻEJ 1 stuknięcie (przy wartościach z szablonu).
 * Licznik: `MAX_TAPS_TO_FIRST_DONE_SET`; test stuka tylko to, co użytkownik stuka, i liczy stuknięcia do pierwszej odhaczonej serii.
 */
import * as store from '@/lib/store';
import * as timer from '@/lib/timer';
import { fresh, saved, withDemoTemplates } from './helpers';
import { renderApp, flushAll, screen, tap, startTpl, act } from './app';

jest.setTimeout(120000);
const MAX_TAPS_TO_FIRST_DONE_SET = 1;
const S = () => store.getState();
afterEach(async () => { jest.restoreAllMocks(); try { S(); } catch { return; } await timer.stop(); await timer.stopSet(); });

describe('K9: stuknięcia od ekranu treningu do odhaczonej serii', () => {
  test.each(['pl', 'en'] as const)('szablon z wartościami (%s): po starcie jedno stuknięcie „Seria zrobiona” odhacza pierwszą serię', async locale => {
    await fresh(undefined, locale); const tpls = withDemoTemplates(locale); await act(async () => { await store.flush(); });
    await renderApp({ saved: JSON.parse(JSON.stringify(saved())), locale }); await flushAll(10);
    await startTpl(tpls[0].name); await flushAll(10);
    expect(S().active).toBeTruthy(); const sets = () => S().active!.exercises.flatMap(e => e.sets); expect(sets().some(s => s.done)).toBe(false);
    let taps = 0;
    while (!sets().some(s => s.done) && taps < 5) { await tap(screen.getByTestId('focus-done')); await flushAll(10); taps++; }
    expect(sets().some(s => s.done)).toBe(true); expect(taps).toBeLessThanOrEqual(MAX_TAPS_TO_FIRST_DONE_SET);
  });
});
