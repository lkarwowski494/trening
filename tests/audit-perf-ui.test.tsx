/* Runda 74 — optymalizacje widoku: kropki wykresu przy długiej historii, leniwe etykiety dat, lista wyboru w Postępach. */
import React from 'react';
import { act } from '@testing-library/react-native';
import * as store from '@/lib/store';
import { fresh, ex, addWorkout } from './helpers';
import { renderApp, flushAll, screen } from './app';

const chart = (n: number, bestAt: number) => {
  const { render } = require('@testing-library/react-native'); const { LineChart } = require('@/components/Chart'); const { Circle } = require('react-native-svg');
  const pts = Array.from({ length: n }, (_, i) => ({ x: i, y: i === bestAt ? 500 : 100 + (i % 7), label: `d${i}` }));
  const r = render(<LineChart points={pts} fmt={(v: number) => `${v} kg`} />);
  act(() => { r.UNSAFE_root.findAll((x: any) => typeof x.props?.onLayout === 'function')[0].props.onLayout({ nativeEvent: { layout: { width: 320 } } }); });
  return { r, circles: r.UNSAFE_getAllByType(Circle) };
};

describe('R74 — wykres i Postępy', () => {
  test('do MAX_DOTS punktów — kropka na każdej sesji; powyżej tylko pierwsza, najlepsza i ostatnia (najlepsza wyróżniona)', async () => {
    await fresh(); const { MAX_DOTS } = require('@/components/Chart');
    expect(chart(MAX_DOTS, 3).circles).toHaveLength(MAX_DOTS);
    const { circles } = chart(500, 250); expect(circles).toHaveLength(3); expect(circles.filter((c: any) => c.props.r === 4.5)).toHaveLength(1);
    expect(chart(500, 499).circles).toHaveLength(2); /* najlepsza = ostatnia — bez podwójnej kropki */
  });
  test('opis wykresu dla VoiceOver i podpisy osi nadal mają daty (etykiety liczone leniwie)', async () => {
    await fresh(); const day = (d: number) => new Date(2026, 0, d, 18).getTime();
    for (let d = 1; d <= 70; d++) addWorkout(day(d), [['Back Squat', [{ weight: d === 30 ? 200 : 100, reps: 5 }]]]);
    const id = ex('Back Squat').id; store.save(); await renderApp({ saved: JSON.parse(JSON.stringify(store.getState())), url: '/more/progress?ex=' + id }); await flushAll(20);
    const a11y = screen.UNSAFE_root.findAll((n: any) => typeof n.props?.accessibilityLabel === 'string' && /^Wykres, 70 sesji/.test(n.props.accessibilityLabel))[0]?.props.accessibilityLabel;
    expect(a11y).toBeTruthy(); const fmt = (d: number) => new Date(day(d)).toLocaleDateString('pl-PL', { day: 'numeric', month: 'short', ...(new Date().getFullYear() !== 2026 ? { year: 'numeric' as const } : {}) });
    expect(a11y).toContain(fmt(1)); expect(a11y).toContain(fmt(70)); expect(a11y).toContain(fmt(30));
  });
  test('lista wyboru: ćwiczenia z historią najpierw, także zarchiwizowane z historią; bez historii (same rozgrzewki) — nie', async () => {
    await fresh(); const day = new Date(2026, 0, 5, 18).getTime();
    addWorkout(day, [['Leg Curl', [{ weight: 40, reps: 10 }]], ['Leg Extension', [{ weight: 40, reps: 10, kind: 'warmup', warmup: true }]]]);
    ex('Leg Curl').archived = true; store.save();
    const { hasHistory } = require('@/lib/stats');
    expect(hasHistory(ex('Leg Curl').id)).toBe(true); expect(hasHistory(ex('Leg Extension').id)).toBe(false);
    await renderApp({ saved: JSON.parse(JSON.stringify(store.getState())), url: '/more/progress' }); await flushAll(20);
    expect(screen.queryAllByText(/Leg Curl/).length).toBeGreaterThan(0);
  });
});
