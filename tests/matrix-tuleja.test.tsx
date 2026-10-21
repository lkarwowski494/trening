/*
 * Macierz stylu „Tuleja” (07.10.2026): widok treningu (WORKOUT_VIEWS) × jednostka × reprezentant każdej metryki, (kolory talerzy IWF na rysunku zniknęły z paskiem talerzy, DEC-06 20.10.2026).
 * Nowa wartość w lib/seed.ts WORKOUT_VIEWS wchodzi do pętli sama (docs/20, rodzaj 4).
 */
import React from 'react';
import { render } from '@testing-library/react-native';
import * as store from '@/lib/store';
import * as timer from '@/lib/timer';
import { WORKOUT_VIEWS, hasWeight, hasTime } from '@/lib/seed';
import { addLocation } from '@/lib/locations';
import { renderApp, flushAll, screen, tap, act } from './app';
import { fresh, ex, saved } from './helpers';
import { UNITS, REPS, setUnit, S } from './matrix-shared';

jest.setTimeout(120000);
afterEach(async () => { await timer.stop(); await timer.stopSet(); });

describe('widok treningu × jednostka × metryka', () => {
  /* @matrix WORKOUT_VIEWS */
  const cases = WORKOUT_VIEWS.flatMap(v => UNITS.flatMap(u => REPS.map(r => [v, u, r.name, r.metric] as const)));
  test.each(cases)('%s / %s / %s (%s): tablica „teraz” tylko w widoku skupionym; przycisk tablicy bez wyniku nie odhacza, z wynikiem odhacza tę samą serię co ✓ w wierszu', async (v, u, name, metric) => {
    await fresh(); addLocation('gym'); setUnit(u); S().settings.workoutView = v; store.startEmpty(); store.addExerciseToActive(ex(name)); store.addSet(0);
    await act(async () => { await store.flush(); }); await renderApp({ saved: JSON.parse(JSON.stringify(saved())) }); await flushAll(10);
    /* audyt 0.10 (LIVE-06, wariant A): seria na czas — duży „▶ Start” i mały „Odhacz bez pomiaru” (ten odhacza jak ✓ w wierszu) */
    const btn = hasTime(metric) ? screen.queryByText('Odhacz bez pomiaru') : screen.queryByText('Seria zrobiona');
    if (v === 'list') { expect(btn).toBeNull(); expect(screen.queryByText('▶ Start')).toBeNull(); return; }
    expect(!!screen.queryByText('▶ Start')).toBe(hasTime(metric));
    expect(btn).not.toBeNull(); expect(screen.getByText('seria 1 z 2')).toBeTruthy();
    await tap(btn!); await flushAll(10);
    expect(S().active!.exercises[0].sets.map(x => x.done)).toEqual([false, false]); /* M3 p2 (ZM-01): „Seria zrobiona” / „Odhacz bez pomiaru” bez wyniku nie odhacza serii (kursor w polu) */
    expect(screen.getByTestId(/^board-input-/)).toBeTruthy();
    await act(async () => { S().active!.exercises[0].sets.forEach(x => Object.assign(x, { weight: 50, reps: 5, durationSec: 30, distanceM: 100 })); store.save(S().active!); }); await flushAll(10);
    await tap(screen.getByText(hasTime(metric) ? 'Odhacz bez pomiaru' : 'Seria zrobiona')); await flushAll(10);
    expect(S().active!.exercises[0].sets.map(x => x.done)).toEqual([true, false]);
    expect(screen.getByText(/seria\s2\sz\s2/)).toBeTruthy(); /* po odhaczeniu tablica pokazuje przerwę z wierszem „Następna: seria 2 z 2, …” */
  });
  test.each(UNITS)('sztanga, jednostka %s: bez paska talerzy, duża liczba w jednostce aplikacji', async u => {
    await fresh(); addLocation('gym'); setUnit(u); store.startEmpty(); store.addExerciseToActive(ex('Back Squat'));
    const a = S().active!; a.exercises[0].sets[0].weight = 80; a.exercises[0].sets[0].reps = 5; store.save(a); await act(async () => { await store.flush(); });
    await renderApp({ saved: JSON.parse(JSON.stringify(saved())) }); await flushAll(10);
    expect(screen.queryByLabelText(/Na każdą stronę/, { includeHiddenElements: true })).toBeNull();
    expect(screen.getByTestId('board-desc').props.accessibilityLabel).toContain(u === 'kg' ? '80 kilogramów, 5 powtórzeń' : '176,4 funta, 5 powtórzeń'); /* audyt 0.10 (UI-10, wariant A): jednostka przy ciężarze */
    expect(hasWeight(ex('Back Squat').metric ?? 'weight_reps')).toBe(true);
  });
});
