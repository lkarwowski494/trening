/*
 * Deload A+B (decyzje właściciela 08.10.2026; źródła: docs/research/22 sekcja 2).
 * A: podpowiedź „zwykle co 4–6 tygodni” — praktyka trenerów (S5, jeden zespół: Bell 2022/2023, Rogerson 2024), oznaczona jako praktyka; liczona z
 *    tygodni treningu z rzędu (uproszczenie: tydzień bez treningu albo tydzień deload przerywa serię). Bez wyzwalaczy z danych (Meeusen 2013 — brak walidacji).
 * B: w tygodniu deload start z szablonu może zostawić około połowy serii roboczych (ceil(n/2): cięcie 33–50%; źródła: cięcie objętości ~30–70% przy
 *    utrzymanym ciężarze nie odbiera efektów — Travis 2020, Pritchard 2016, Bickel 2011), ciężary bez zmian, rozgrzewki zostają, szablon bez zmian.
 */
import * as store from '@/lib/store';
import { deloadKeep, deloadSets, trainingStreakWeeks, deloadHint, DELOAD_EVERY, nextMonday } from '@/lib/deload';
import { fresh, addWorkout, withDemoTemplates } from './helpers';
import type { WSet } from '@/lib/seed';

const S = () => store.getState();
const at = (m: number, d: number, h = 18) => new Date(2026, m, d, h).getTime();
const NOW = at(9, 8, 9); /* czwartek 8.10.2026 */
beforeEach(async () => { jest.useFakeTimers({ now: NOW }); await fresh(); });
const train = (...days: [number, number][]) => days.forEach(([m, d]) => addWorkout(at(m, d), [['Back Squat', [{ weight: 100, reps: 5 }]]]));

describe('B: mniej serii', () => {
  test('około połowy serii roboczych: 1→1, 2→1, 3→2, 4→2, 5→3, 6→3; cięcie 0–50%', () => {
    expect([1, 2, 3, 4, 5, 6].map(deloadKeep)).toEqual([1, 1, 2, 2, 3, 3]);
    for (let n = 2; n <= 12; n++) { const cut = 1 - deloadKeep(n) / n; expect(cut).toBeGreaterThanOrEqual(0.33); expect(cut).toBeLessThanOrEqual(0.5); }
  });
  test('rozgrzewki zostają, drop sety idą z serią, po której są; kolejność i wartości bez zmian', () => {
    let id = 0; const k = (kind: WSet['kind'], weight = 100): WSet => ({ id: `s${id++}`, weight, reps: 5, durationSec: '', distanceM: '', rpe: '', bandId: '', addKg: '', kind, warmup: kind === 'warmup', note: '', done: false, completedAt: null, actualRest: null });
    const sets = [k('warmup', 40), k('normal'), k('drop', 80), k('normal'), k('normal'), k('failure')];
    const out = deloadSets(sets); expect(out.map(s => s.kind)).toEqual(['warmup', 'normal', 'drop', 'normal']);
    expect(out[1]).toBe(sets[1]); expect(out.map(s => s.weight)).toEqual([40, 100, 80, 100]);
    expect(deloadSets([k('warmup'), k('normal')]).length).toBe(2); expect(deloadSets([])).toEqual([]);
  });
  test('start z szablonu w wariancie deload: mniej serii, szablon nietknięty', () => {
    const [tpl] = withDemoTemplates(); const before = JSON.stringify(tpl);
    store.startFromTemplate(tpl); const full = S().active!.exercises.map(e => e.sets.length); S().active = null;
    store.startFromTemplate(tpl, { deload: true }); const less = S().active!.exercises.map(e => e.sets.filter(s => s.kind !== 'warmup').length);
    expect(less).toEqual(full.map(deloadKeep)); expect(JSON.stringify(tpl)).toBe(before);
  });
});

describe('A: podpowiedź w kalendarzu', () => {
  test('stałe z dokumentu: zwykle co 4–6 tygodni', () => { expect(DELOAD_EVERY).toEqual([4, 6]); });
  test('tygodnie z rzędu: liczone od bieżącego (albo poprzedniego, gdy w bieżącym jeszcze nic), przerywa pusty tydzień i tydzień deload', () => {
    expect(trainingStreakWeeks(NOW)).toBe(0);
    train([8, 14], [8, 21], [8, 28], [9, 6]); expect(trainingStreakWeeks(NOW)).toBe(4); /* 14.09 … 6.10 — cztery tygodnie */
    train([8, 2]); expect(trainingStreakWeeks(NOW)).toBe(4); /* tydzień 7.09 pusty — przerwa */
    store.toggleDeloadWeek(at(8, 21)); expect(trainingStreakWeeks(NOW)).toBe(2); /* od deloadu 21.09: 28.09, 5.10 */
  });
  test('podpowiedź od 4 tygodni; oznaczony ten lub następny tydzień — informacja zamiast podpowiedzi', () => {
    train([8, 21], [8, 28], [9, 6]); expect(deloadHint(NOW)).toEqual({ kind: 'none' });
    train([8, 14]); expect(deloadHint(NOW)).toEqual({ kind: 'suggest', weeks: 4, from: '2026-10-12' });
    store.toggleDeloadWeek(at(9, 12)); expect(deloadHint(NOW)).toEqual({ kind: 'next', from: '2026-10-12' });
    store.toggleDeloadWeek(at(9, 12)); store.toggleDeloadWeek(NOW); expect(deloadHint(NOW)).toEqual({ kind: 'current' });
  });
  test('następny poniedziałek (także z niedzieli i z poniedziałku)', () => {
    expect([at(9, 5, 0), at(9, 8), at(9, 11, 23)].map(store.mondayKey)).toEqual(['2026-10-05', '2026-10-05', '2026-10-05']); expect(store.mondayKey(at(9, 12, 0))).toBe('2026-10-12');
    expect([at(9, 8), at(9, 11, 23), at(9, 12, 0)].map(nextMonday)).toEqual(['2026-10-12', '2026-10-12', '2026-10-19']);
  });
});
