/*
 * M3 p5d — ZM-07 pkt 2 (STOP 2, 21.10.2026): krótka wibracja (impactLight z mapy HAPTICS) przy odhaczeniu serii — „Seria zrobiona” na tablicy „teraz”
 * i ✓ w wierszu serii dają TĘ SAMĄ wibrację (jedna ścieżka: ActiveWorkout.onDone). Wg „Wibracji” (settings.haptics), brak pola = jak „Dźwięk” (sound).
 * Cofnięcie odhaczenia nie wibruje. Zegarek (osobna platforma) poza zakresem.
 */
import * as store from '@/lib/store';
import * as timer from '@/lib/timer';
import { HAPTICS } from '@/lib/theme';
import { playHaptic } from '@/lib/haptics';
import { __resetRestNoticesForTests } from '@/components/ActiveWorkout';
import { fresh, ex, saved } from './helpers';
import { renderApp, tap, flushAll, screen, act } from './app';

jest.setTimeout(120000);
const S = () => store.getState(); const A = () => S().active!;
const H = () => global.__haptics as string[];
afterEach(async () => { jest.restoreAllMocks(); try { S(); } catch { return; } await timer.stop(); await timer.stopSet(); });
beforeEach(() => { __resetRestNoticesForTests(); H().length = 0; });
const boot = async () => { await act(async () => { await store.flush(); }); await renderApp({ saved: JSON.parse(JSON.stringify(saved())), locale: 'pl' }); };
const start = () => { store.startEmpty(); store.addExerciseToActive(ex('Bench Press (sztanga)')); store.addSet(0); Object.assign(A().exercises[0].sets[0], { weight: 80, reps: 6 }); Object.assign(A().exercises[0].sets[1], { weight: 80, reps: 6 }); };
const settings = (p: { sound?: boolean; haptics?: boolean }, drop: ('sound' | 'haptics')[] = []) => { Object.assign(S().settings, p); for (const k of drop) delete (S().settings as unknown as Record<string, unknown>)[k]; };
const combos: [string, { sound?: boolean; haptics?: boolean }, string[]][] = [
  ['haptics=true', { sound: false, haptics: true }, ['impact:light']],
  ['haptics=false, sound=true', { sound: true, haptics: false }, []],
  ['brak haptics, sound=true (zastępstwo)', { sound: true }, ['impact:light']],
  ['brak haptics, sound=false (zastępstwo)', { sound: false }, []],
];

describe('mapa HAPTICS: „Seria zrobiona (✓…)” = impactLight', () => {
  test('wpis w mapie i playHaptic("done") wykonuje impact:light', async () => {
    await fresh(); H().length = 0;
    expect(HAPTICS.find(h => h.kiedy.startsWith('Seria zrobiona (✓'))).toMatchObject({ haptyka: 'impactLight' });
    playHaptic('done'); expect(H()).toEqual(['impact:light']);
  });
});

describe.each(combos)('odhaczenie serii (%s)', (_n, cfg, want) => {
  test('„Seria zrobiona” na tablicy', async () => {
    await fresh(); start(); settings(cfg, 'haptics' in cfg ? [] : ['haptics']); await boot(); H().length = 0;
    await tap(screen.getByTestId('focus-done')); await flushAll(20);
    expect(A().exercises[0].sets[0].done).toBe(true); expect(H()).toEqual(want);
  });
  test('✓ w wierszu serii — ta sama wibracja; cofnięcie bez wibracji', async () => {
    await fresh(); start(); settings(cfg, 'haptics' in cfg ? [] : ['haptics']); await boot(); H().length = 0;
    await tap(screen.getByLabelText(/^Seria 2 zrobiona — Bench Press/)); await flushAll(20);
    expect(A().exercises[0].sets[1].done).toBe(true); expect(H()).toEqual(want);
    H().length = 0; await tap(screen.getByLabelText(/^Seria 2 zrobiona — Bench Press/)); await flushAll(20);
    expect(A().exercises[0].sets[1].done).toBe(false); expect(H()).toEqual([]);
  });
});
