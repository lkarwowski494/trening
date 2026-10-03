/* Runda 72 — testy z audytu tematycznego T5 (logika treningu: rekordy, podpowiedzi, supersety). Nazwy T5-xx = numer z raportu. */
/* T5 audit repros — each test asserts the CORRECT behaviour and currently FAILS. */
import fc from 'fast-check';
import * as store from '@/lib/store';
import * as stats from '@/lib/stats';
import * as units from '@/lib/units';
import { fresh, ex, addWorkout, legacyBandKg } from './helpers';

const at = (y: number, m: number, d: number, h = 18) => new Date(y, m - 1, d, h).getTime();
const item = (id: string, exerciseId: string, sets: number) => ({ id, exerciseId, sets, repMin: null, repMax: null, restSec: null, startWeight: '' as const, targetSec: '' as const, groupId: null });
const morning = (id: string, date: string, weight: number) => ({ id, ownerId: 'local', createdAt: 0, updatedAt: 0, date, bb: '', sleepScore: '', sleepH: '', weight } as any);
afterEach(() => units.applyUnit('kg'));

test('T5-01 lb: retyping the weight shown for an earlier set is not a PR (22.68 kg = "50 lb")', async () => {
  await fresh();
  addWorkout(at(2026, 9, 1), [['Bench Press (hantle)', [{ weight: 22.68, reps: 10 }]]]);
  units.applyUnit('lb'); expect(units.fmtW(22.68)).toBe('50 lb');
  const typed = units.wIn(50) as number; // 22.7
  const w = addWorkout(at(2026, 9, 3), [['Bench Press (hantle)', [{ weight: typed, reps: 10 }]]]);
  expect([...stats.prMap(w).values()]).toEqual([]); // got [['ciężar','objętość serii']]
});
test('T5-01b property: same displayed lb value => no PR', async () => {
  await fresh();
  fc.assert(fc.property(fc.integer({ min: 100, max: 30000 }), c => {
    store.getState().workouts = []; store.save(); const kg = c / 100;
    addWorkout(at(2026, 9, 1), [['Back Squat', [{ weight: kg, reps: 5 }]]]);
    units.applyUnit('lb'); try { const typed = units.wIn(units.wOut(kg)) as number;
    const w = addWorkout(at(2026, 9, 3), [['Back Squat', [{ weight: typed, reps: 5 }]]]);
    return stats.prMap(w).size === 0; /* dawniej np. 1,03 → 1,05, 100,04 → 100,05; porównanie w lb, jak na ekranie */ } finally { units.applyUnit('kg'); }
  }));
});
test('T5-02 same exercise twice in template: back-off block is not prefilled from another template\'s top sets', async () => {
  await fresh(); const sq = ex('Back Squat').id;
  const A = store.newTemplate(); A.items.push(item('a', sq, 3), item('b', sq, 2)); store.save(A);
  const w1 = addWorkout(at(2026, 9, 1), [['Back Squat', [{ weight: 100, reps: 5 }, { weight: 100, reps: 5 }, { weight: 100, reps: 5 }]], ['Back Squat', [{ weight: 60, reps: 12 }, { weight: 60, reps: 12 }]]]);
  w1.templateId = A.id; w1.exercises[0].tplItemId = 'a'; w1.exercises[1].tplItemId = 'b';
  addWorkout(at(2026, 9, 3), [['Back Squat', [{ weight: 90, reps: 8 }, { weight: 90, reps: 8 }, { weight: 90, reps: 8 }]]], 'B'); store.save();
  store.startFromTemplate(A);
  expect(store.getState().active!.exercises[1].sets.map(s => s.weight)).toEqual([60, 60]); // got [90, 90]
});
test('T5-03 deleted band: hint "8@-20" must not be logged as 8 unassisted reps (false e1RM/volume PR)', async () => {
  await fresh(); const s = store.getState();
  const band = s.bands[0]; legacyBandKg(band, 20); store.save(band);
  addWorkout(at(2026, 9, 1), [['Chin Up', [{ reps: 8, addKg: -20, bandId: band.id }]]]);
  s.bands = s.bands.filter(b => b.id !== band.id); store.save();
  store.startEmpty(); store.addExerciseToActive(ex('Chin Up')); store.toggleDone(0, 0);
  const a = store.getState().active!; const set0 = a.exercises[0].sets[0];
  expect(set0.reps === '' || set0.addKg === -20).toBe(true); // got reps 8, addKg ''
  expect(stats.prMap(a).size).toBe(0); // got e1RM + objętość serii
});
test('T5-04 band-assisted set is not a "powtórzenia" (reps) PR over unassisted reps', async () => {
  await fresh(); store.save();
  addWorkout(at(2026, 9, 1), [['Chin Up', [{ reps: 10 }]]]);
  const w = addWorkout(at(2026, 9, 3), [['Chin Up', [{ reps: 15, addKg: -40 }]]]);
  expect([...stats.prMap(w).values()]).toEqual([]); // got [['powtórzenia']]
});
test('T5-05 e1RM record is not set by a 30-rep set or a drop set', async () => {
  await fresh();
  addWorkout(at(2026, 9, 1), [['Back Squat', [{ weight: 140, reps: 1 }]]]);
  const w = addWorkout(at(2026, 9, 3), [['Back Squat', [{ weight: 130, reps: 1 }, { weight: 80, reps: 25, kind: 'drop' }]]]);
  const w2 = addWorkout(at(2026, 9, 5), [['Back Squat', [{ weight: 72, reps: 30 }]]]);
  expect([...stats.prMap(w).values(), ...stats.prMap(w2).values()].filter(k => k.includes('e1RM')).length).toBe(0); /* runda 72: objętość drop setu może być rekordem objętości — e1RM nie */
  expect(stats.recordsFor(ex('Back Squat')).bestE1rm).toBe(140); // got 146.67 (drop set 80x25)
});
test('T5-06 (runda 75, Q-001): podciąganie bez dociążenia nie ma e1RM; zakończony trening nie zapisuje masy ciała', async () => {
  await fresh();
  store.startEmpty(); store.addExerciseToActive(ex('Chin Up')); const s0 = store.getState().active!.exercises[0].sets[0]; s0.reps = 10; store.toggleDone(0, 0); const w = store.finishWorkout()!;
  expect('bodyWeightKg' in w).toBe(false); expect(stats.recordsFor(ex('Chin Up')).bestE1rm).toBe(0); expect(stats.recordsFor(ex('Chin Up')).bestTotal).toBe(10);
});
test('T5-07 latest session with only a drop set does not erase the working-weight hint', async () => {
  await fresh(); const sq = ex('Back Squat').id;
  addWorkout(at(2026, 9, 1), [['Back Squat', [{ weight: 100, reps: 5 }]]]);
  addWorkout(at(2026, 9, 3), [['Back Squat', [{ weight: 60, reps: 12, kind: 'drop' }]]]);
  const T = store.newTemplate(); T.items.push({ ...item('a', sq, 1), startWeight: 40 } as any); store.save(T);
  store.startFromTemplate(T);
  expect(store.getState().active!.exercises[0].sets[0].weight).toBe(100); // got 40 (template start weight), hint "—"
});
test('T5-08 ramp sets: summary lists one weight PR per exercise, not every superseded set', async () => {
  await fresh();
  addWorkout(at(2026, 9, 1), [['Back Squat', [{ weight: 95, reps: 5 }]]]);
  const w = addWorkout(at(2026, 9, 3), [['Back Squat', [{ weight: 100, reps: 5 }, { weight: 105, reps: 5 }, { weight: 110, reps: 3 }]]]);
  expect(stats.workoutPRs(w).filter(p => p.kinds.includes('e1RM'))).toHaveLength(1); /* runda 73: e1RM zamiast rekordu ciężaru */
});
test('T5-09 superset: checking the LAST exercise first does not start the round rest', async () => {
  await fresh(); store.startEmpty(); store.addExerciseToActive(ex('Bench Press (sztanga)')); store.addExerciseToActive(ex('Bent Over Row (sztanga)'));
  const a = store.getState().active!; store.linkWithNext(a.exercises, 0, a);
  a.exercises.forEach(e => { e.sets[0].weight = 60; e.sets[0].reps = 5; });
  expect(store.toggleDone(1, 0)).toBeNull(); // got 90 while A1 is still pending
});
test('T5-10 + seria after a failure set adds a normal set', async () => {
  await fresh(); store.startEmpty(); store.addExerciseToActive(ex('Back Squat')); const a = store.getState().active!;
  Object.assign(a.exercises[0].sets[0], { weight: 100, reps: 5, kind: 'failure' }); store.toggleDone(0, 0); store.addSet(0);
  expect(a.exercises[0].sets[1].kind).toBe('normal'); // got 'failure'
});
