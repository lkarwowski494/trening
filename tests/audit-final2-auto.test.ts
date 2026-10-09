/* Runda 72 — testy z audytu T10 (weryfikacja końcowa). */
const log = (..._a: unknown[]) => { /* diagnostyka audytu wyciszona */ };
import * as store from '@/lib/store';
import * as timer from '@/lib/timer';
import { fresh, ex, addWorkout, set } from './helpers';

const H = 3600e3;
let now = 0;
beforeEach(() => { now = new Date(2026, 8, 1, 10, 0, 0).getTime(); jest.spyOn(Date, 'now').mockImplementation(() => now); });
afterEach(async () => { jest.restoreAllMocks(); try { store.getState(); await timer.stop(); await timer.stopSet(); } catch {} });

test('A: >=6h auto-finish of running Farmer walk (weight_time) — weight from hint filled like 2-6h path', async () => {
  await fresh();
  addWorkout(now - 48 * H, [['Crucifix' /* ciężar + czas (Farmer's Walk od 09.10.2026: ciężar + dystans) */, [{ weight: 40, durationSec: 60 }]]]);
  store.startEmpty(); store.addExerciseToActive(ex('Bench Press (sztanga)')); store.addExerciseToActive(ex('Crucifix' /* ciężar + czas (Farmer's Walk od 09.10.2026: ciężar + dystans) */));
  const a = store.getState().active!; a.exercises[0].sets[0].weight = 100; a.exercises[0].sets[0].reps = 5; store.save(a);
  now += 60e3; store.toggleDone(0, 0);
  now += 60e3; const fid = a.exercises[1].sets[0].id; await timer.startSet(fid, 60);
  now += 7 * H;
  const w = store.autoFinishStale(now)!;
  expect(w).toBeTruthy();
  const fw = w.exercises.find(e => e.exerciseId === ex('Crucifix' /* ciężar + czas (Farmer's Walk od 09.10.2026: ciężar + dystans) */).id)!;
  // 2–6 h path (toggleDone) would fill the empty weight from the visible "Poprzednio" hint (40 kg)
  expect(fw.sets[0].weight).toBe(40);
});

test('B: compare 2-6h path — toggleDone with at fills the weight', async () => {
  await fresh();
  addWorkout(now - 48 * H, [['Crucifix' /* ciężar + czas (Farmer's Walk od 09.10.2026: ciężar + dystans) */, [{ weight: 40, durationSec: 60 }]]]);
  store.startEmpty(); store.addExerciseToActive(ex('Crucifix' /* ciężar + czas (Farmer's Walk od 09.10.2026: ciężar + dystans) */));
  const a = store.getState().active!;
  store.toggleDone(0, 0, now);
  expect(a.exercises[0].sets[0].weight).toBe(40);
});

test('C: >=6h auto-finish warmup timed set only, then restore — timer state cleaned?', async () => {
  await fresh();
  store.startEmpty(); store.addExerciseToActive(ex('Plank'));
  const a = store.getState().active!; a.exercises[0].sets[0].kind = 'warmup'; a.exercises[0].sets[0].warmup = true; store.save(a);
  const id = a.exercises[0].sets[0].id; await timer.startSet(id, 60);
  now += 7 * H;
  expect(store.autoFinishStale(now)).toBeNull();
  const s0 = a.exercises[0].sets[0];
  expect(s0.done).toBe(true);
  log('timer state after', JSON.stringify(store.getState().timer), 'staleSince', store.staleSince(now));
});

test('D: actualRest for auto-completed set', async () => {
  await fresh();
  store.startEmpty(); store.addExerciseToActive(ex('Bench Press (sztanga)')); store.addExerciseToActive(ex('Plank'));
  const a = store.getState().active!; a.exercises[0].sets[0].weight = 100; a.exercises[0].sets[0].reps = 5; store.save(a);
  store.toggleDone(0, 0);
  now += 90e3; await timer.startSet(a.exercises[1].sets[0].id, 60);
  now += 7 * H;
  const w = store.autoFinishStale(now)!;
  const p = w.exercises.find(e => e.exerciseId === ex('Plank').id)!.sets[0];
  log('plank', JSON.stringify(p), 'finishedAt-start', (w.finishedAt! - w.startedAt) / 1000);
  // via toggleDone(at) the 2-6h path would record actualRest = 150 s (start+target − previous tick)
  expect(p.actualRest).toBe(150);
});
