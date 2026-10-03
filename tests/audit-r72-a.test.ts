/* Runda 72 — testy z audytu T6 (regresje po zmianach rundy 72). */
/* T6 audit repros (temporary). Each test asserts CORRECT behaviour; failing = defect. */
import fc from 'fast-check';
import * as store from '@/lib/store';
import * as stats from '@/lib/stats';
import * as units from '@/lib/units';
import { fresh, ex, addWorkout, set } from './helpers';

jest.setTimeout(120000);
const at = (y: number, m: number, d: number, h = 18) => new Date(y, m - 1, d, h).getTime();
const strip = (s: any) => { const c = JSON.parse(JSON.stringify(s)); delete c.metaUpdatedAt; delete c.saveSeq; delete c.userTouched; return c; };
afterEach(() => { units.applyUnit('kg'); jest.restoreAllMocks(); });

test('D1 migrate idempotent with tiny bodyWeightKg on a finished workout', async () => {
  await fresh();
  const st = JSON.parse(JSON.stringify(store.getState()));
  const id = st.exercises[0].id;
  st.workouts = [{ id: 'w', startedAt: at(2026, 9, 1), finishedAt: at(2026, 9, 1) + 1, bodyWeightKg: 0.004, exercises: [{ exerciseId: id, sets: [set({ weight: 10, reps: 5 })] }] }];
  const a = strip(store.migrate(JSON.parse(JSON.stringify(st))));
  const b = strip(store.migrate(JSON.parse(JSON.stringify(a))));
  expect(a.workouts[0].bodyWeightKg).toBeUndefined(); // got 0
  expect(b).toEqual(a);
});

test('D1b property: migrate idempotent with arbitrary bodyWeightKg', async () => {
  await fresh();
  const base = JSON.parse(JSON.stringify(store.getState())); const id = base.exercises[0].id;
  fc.assert(fc.property(fc.oneof(fc.double({ noNaN: false }), fc.string({ maxLength: 5 }), fc.constantFrom('0,004', '1000.004', '-0', 0.005, 0.0049, 999.999)), fc.constantFrom(undefined, 5, 11, 12), (bw, ver) => {
    const st = { ...base, schemaVersion: ver, workouts: [{ id: 'w', startedAt: at(2026, 9, 1), finishedAt: at(2026, 9, 1) + 1, bodyWeightKg: bw, exercises: [{ exerciseId: id, sets: [set({ weight: 10, reps: 5 })] }] }] };
    const a = strip(store.migrate(JSON.parse(JSON.stringify(st))));
    const b = strip(store.migrate(JSON.parse(JSON.stringify(a))));
    expect(b).toEqual(a);
  }), { numRuns: 500 });
});

function superset(sets: [string[], string[]]) {
  store.startEmpty(); const a = store.getState().active!;
  store.addExerciseToActive(ex('Bench Press (sztanga)')); store.addExerciseToActive(ex('Bent Over Row (sztanga)'));
  a.exercises.forEach((e, i) => { e.restSec = i === 0 ? 30 : 120; e.groupId = 'g'; e.sets = sets[i].map(k => ({ ...set({ done: false, weight: 50, reps: 8 }), kind: k as any, warmup: k === 'warmup' })); });
  store.save(a); return a;
}
test('D2 superset: drop sets of the 2nd exercise do not end the next round early', async () => {
  await fresh(); jest.spyOn(Date, 'now').mockReturnValue(at(2026, 9, 10));
  superset([['normal', 'normal'], ['normal', 'drop', 'normal', 'drop']]);
  expect(store.toggleDone(0, 0)).toBeNull(); // A1
  expect(store.toggleDone(1, 0)).toBeNull(); // B1 (drop follows)  -- old & new both rest here? see report
});
test('D2b superset: A2 after round 1 (B1+B1D) must not start rest before B2', async () => {
  await fresh(); jest.spyOn(Date, 'now').mockReturnValue(at(2026, 9, 10));
  superset([['normal', 'normal'], ['normal', 'drop', 'normal', 'drop']]);
  store.toggleDone(0, 0); store.toggleDone(1, 0); store.toggleDone(1, 1); // A1, B1, B1D
  expect(store.toggleDone(0, 1)).toBeNull(); // A2: round 2 not complete (B2 pending) — got 120
});

test('D3 band-assisted pull-up with default band (nominalKg empty) is not a reps PR', async () => {
  await fresh();
  const band = store.getState().bands[0]; expect(band).not.toHaveProperty('nominalKg');
  addWorkout(at(2026, 9, 1), [['Pull Up', [{ addKg: 0, reps: 6 }]]]);
  const w = addWorkout(at(2026, 9, 3), [['Pull Up', [{ addKg: '', bandId: band.id, reps: 12 }]]]);
  expect(stats.prMap(w).get(w.exercises[0].sets[0].id) ?? []).not.toContain('powtórzenia');
});

test('D4 stale prompt not blocked forever by a future startedAt', async () => {
  await fresh(); const now = at(2026, 9, 10);
  jest.spyOn(Date, 'now').mockReturnValue(now + 24 * 3600e3); store.startEmpty(); // clock 1 day ahead at start
  (Date.now as jest.Mock).mockReturnValue(now + 3 * 3600e3); // clock corrected, 3h later
  expect(store.staleSince(now + 3 * 3600e3)).not.toBeNull();
});

test('D5 e1RM PR not awarded to a lighter, shorter set when history has only >12-rep sets', async () => {
  await fresh();
  addWorkout(at(2026, 9, 1), [['Back Squat', [{ weight: 100, reps: 20 }]]]);
  const w = addWorkout(at(2026, 9, 3), [['Back Squat', [{ weight: 50, reps: 10 }]]]);
  expect(stats.prMap(w).get(w.exercises[0].sets[0].id) ?? []).not.toContain('e1RM');
});

test('P1 property: PR map of the active workout equals history PR map after finishing (BW exercise, mornings, settings)', async () => {
  await fresh();
  fc.assert(fc.property(
    fc.array(fc.record({ d: fc.integer({ min: 1, max: 9 }), add: fc.integer({ min: -30, max: 30 }), reps: fc.integer({ min: 1, max: 20 }) }), { maxLength: 4 }),
    fc.option(fc.integer({ min: 50, max: 120 }), { nil: undefined }), fc.option(fc.integer({ min: 50, max: 120 }), { nil: undefined }),
    fc.array(fc.record({ add: fc.integer({ min: -30, max: 30 }), reps: fc.integer({ min: 0, max: 20 }), kind: fc.constantFrom('normal', 'drop', 'warmup', 'failure') }), { minLength: 1, maxLength: 5 }),
    (hist, sbw, mbw, cur) => {
      const st = store.getState(); st.workouts = []; st.active = null; st.mornings = []; void sbw; /* runda 75: masa ciała z Ustawień usunięta */ store.save();
      if (mbw) st.mornings.push({ id: 'm', ownerId: 'local', createdAt: 0, updatedAt: 0, date: '2026-09-05', bb: '', sleepScore: '', sleepH: '', weight: mbw } as any);
      hist.forEach(h => addWorkout(at(2026, 9, h.d), [['Chin Up', [{ addKg: h.add, reps: h.reps }]]]));
      const now = at(2026, 9, 12); const spy = jest.spyOn(Date, 'now').mockReturnValue(now);
      store.startEmpty(); store.addExerciseToActive(ex('Chin Up')); const a = store.getState().active!;
      a.exercises[0].sets = cur.map((c, i) => ({ ...set({ addKg: c.add, reps: c.reps, completedAt: now + i }), kind: c.kind as any, warmup: c.kind === 'warmup' }));
      const before = [...stats.prMap(a).entries()]; const sum = stats.workoutPRs(a).map(x => x.set.id);
      const w = store.finishWorkout(now + 1000)!;
      const after = [...stats.prMap(w).entries()];
      spy.mockRestore();
      expect(after).toEqual(before);
      sum.forEach(id => expect(after.map(x => x[0])).toContain(id));
    }), { numRuns: 150 });
});

test('P2 property: superset rest only after a complete round (2-3 exercises, random order, unequal counts)', async () => {
  await fresh(); jest.spyOn(Date, 'now').mockReturnValue(at(2026, 9, 10));
  fc.assert(fc.property(fc.array(fc.integer({ min: 1, max: 4 }), { minLength: 2, maxLength: 3 }), fc.array(fc.nat(2), { maxLength: 20 }), (counts, order) => {
    store.getState().active = null; store.startEmpty(); const a = store.getState().active!;
    const names = ['Bench Press (sztanga)', 'Bent Over Row (sztanga)', 'Back Squat'];
    counts.forEach((_, i) => store.addExerciseToActive(ex(names[i])));
    a.exercises.forEach((e, i) => { e.groupId = 'g'; e.restSec = 10 * (i + 1); e.sets = Array.from({ length: counts[i] }, () => set({ done: false, weight: 50, reps: 8 })); });
    store.save(a);
    for (const o of order) { const ei = o % counts.length; const e = a.exercises[ei]; const si = e.sets.findIndex(s => !s.done); if (si < 0) continue;
      const r = store.toggleDone(ei, si);
      const rounds = a.exercises.map(x => x.sets.filter(s => s.done).length); const k = rounds[ei];
      const closes = ei === counts.length - 1 && e.sets.every(s => s.done) && a.exercises.every(x => x.sets.some(s => s.done)); /* runda 75 (Q-006): ostatnia seria ostatniego ćwiczenia zamyka rundę, gdy reszta już zaczęła */
      const complete = closes || a.exercises.every(x => x.sets.filter(s => s.done).length >= k || x.sets.every(s => s.done));
      if (complete) expect(r).toBe(10 * counts.length); else expect(r).toBeNull();
    }
  }), { numRuns: 300 });
});
