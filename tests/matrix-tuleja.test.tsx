/*
 * Macierz stylu „Tuleja” (07.10.2026): widok treningu (WORKOUT_VIEWS) × jednostka × reprezentant każdej metryki, kolory talerzy IWF (IWF_DISC).
 * Nowa wartość w lib/seed.ts WORKOUT_VIEWS albo lib/plates.ts IWF_DISC wchodzi do pętli sama (docs/20, rodzaj 4).
 */
import React from 'react';
import { render } from '@testing-library/react-native';
import * as store from '@/lib/store';
import * as timer from '@/lib/timer';
import { WORKOUT_VIEWS, hasWeight, hasTime } from '@/lib/seed';
import { IWF_DISC, PLATE_COLORS } from '@/lib/plates';
import { PlateBar } from '@/components/PlateBar';
import { addLocation } from '@/lib/locations';
import { renderApp, flushAll, screen, tap, act } from './app';
import { fresh, ex, saved } from './helpers';
import { UNITS, REPS, setUnit, S } from './matrix-shared';

jest.setTimeout(120000);
afterEach(async () => { await timer.stop(); await timer.stopSet(); });

describe('widok treningu × jednostka × metryka', () => {
  /* @matrix WORKOUT_VIEWS */
  const cases = WORKOUT_VIEWS.flatMap(v => UNITS.flatMap(u => REPS.map(r => [v, u, r.name, r.metric] as const)));
  test.each(cases)('%s / %s / %s (%s): karta „teraz” tylko w widoku skupionym; przycisk karty odhacza tę samą serię co ✓ w wierszu', async (v, u, name, metric) => {
    await fresh(); addLocation('gym'); setUnit(u); S().settings.workoutView = v; store.startEmpty(); store.addExerciseToActive(ex(name)); store.addSet(0);
    await act(async () => { await store.flush(); }); await renderApp({ saved: JSON.parse(JSON.stringify(saved())) }); await flushAll(10);
    /* audyt 0.10 (LIVE-06, wariant A): seria na czas — duży „▶ Start” i mały „Odhacz bez pomiaru” (ten odhacza jak ✓ w wierszu) */
    const btn = hasTime(metric) ? screen.queryByText('Odhacz bez pomiaru') : screen.queryByText('Seria zrobiona');
    if (v === 'list') { expect(btn).toBeNull(); expect(screen.queryByText('▶ Start')).toBeNull(); return; }
    expect(!!screen.queryByText('▶ Start')).toBe(hasTime(metric));
    expect(btn).not.toBeNull(); expect(screen.getByText('seria 1 z 2')).toBeTruthy();
    await tap(btn!); await flushAll(10);
    expect(S().active!.exercises[0].sets.map(x => x.done)).toEqual([true, false]);
    expect(screen.getByText('seria 2 z 2')).toBeTruthy();
  });
  test.each(UNITS)('sztanga, jednostka %s: talerze w jednostce opisu sprzętu (kg w presecie siłowni), duża liczba w jednostce aplikacji', async u => {
    await fresh(); addLocation('gym'); setUnit(u); store.startEmpty(); store.addExerciseToActive(ex('Back Squat'));
    const a = S().active!; a.exercises[0].sets[0].weight = 80; a.exercises[0].sets[0].reps = 5; store.save(a); await act(async () => { await store.flush(); });
    await renderApp({ saved: JSON.parse(JSON.stringify(saved())) }); await flushAll(10);
    expect(screen.getByLabelText('Na każdą stronę: 25 + 5 kg')).toBeTruthy();
    expect(screen.getByLabelText(u === 'kg' ? 'Teraz: 80 kg × 5' : 'Teraz: 176,4 lb × 5')).toBeTruthy(); /* audyt 0.10 (UI-10, wariant A): jednostka przy ciężarze */
    expect(hasWeight(ex('Back Squat').metric ?? 'weight_reps')).toBe(true);
  });
});

describe('kolory talerzy IWF na rysunku', () => {
  /* @matrix IWF_DISC */
  test.each(Object.entries(IWF_DISC).map(([g, c]) => [Number(g) / 1000, c] as const))('talerz %s kg: kolor %s i liczba na talerzu', async (w, c) => {
    await fresh();
    const r = render(<PlateBar plan={{ unit: 'kg', base: 20, plates: [w] }} />);
    const label = String(w).replace('.', ',');
    expect(r.getByLabelText(`Na każdą stronę: ${label} kg`)).toBeTruthy();
    const num = r.getAllByText(label).find(x => x.parent?.parent?.props?.style?.backgroundColor === PLATE_COLORS[c]);
    expect([w, c, !!num]).toEqual([w, c, true]);
  });
});
