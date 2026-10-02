/* Runda 72 — testy z audytu T11 (runda zamykająca). */
import * as store from '@/lib/store';
import * as timer from '@/lib/timer';
import { fresh, ex } from './helpers';
const H = 3600e3; let now = 0;
beforeEach(() => { now = new Date(2026, 8, 1, 10, 0, 0).getTime(); jest.spyOn(Date, 'now').mockImplementation(() => now); });
afterEach(async () => { jest.restoreAllMocks(); try { store.getState(); await timer.stop(); await timer.stopSet(); } catch {} });

async function setup() {
  await fresh();
  store.startEmpty(); store.addExerciseToActive(ex('Plank'));
  const a = store.getState().active!; a.exercises[0].sets[0].durationSec = 45; store.save(a);
  now += 60e3; store.toggleDone(0, 0); // done, 45 s
  now += 60e3; const id = a.exercises[0].sets[0].id; await timer.startSet(id, 60); // remeasure with template target 60
  return { a, t0: now };
}
test('R1 remeasure + 3 h: screen path (finishTimedSet) writes 60', async () => {
  const { a, t0 } = await setup();
  now = t0 + 3 * H;
  // replicate finishTimedSet for a done set
  const { setId, sec } = await timer.stopSet(); const pos = store.findSet(setId)!; const s = a.exercises[pos.ei].sets[pos.si]; s.durationSec = Math.max(1, sec); store.save(a);
  expect(s.durationSec).toBe(60);
});
test('R2 remeasure + 7 h: auto-finish should save same as 3 h path (60)', async () => {
  const { t0 } = await setup();
  now = t0 + 7 * H;
  const w = store.autoFinishStale(now)!;
  expect(w).toBeTruthy();
  expect(w.exercises[0].sets[0].durationSec).toBe(60);
});
test('R3 target longer than elapsed (8 h target, 7 h elapsed): duration must not exceed elapsed', async () => {
  await fresh();
  store.startEmpty(); store.addExerciseToActive(ex('Bench Press (sztanga)')); store.addExerciseToActive(ex('Plank'));
  const a = store.getState().active!; a.exercises[0].sets[0].weight = 100; a.exercises[0].sets[0].reps = 5; store.save(a); store.toggleDone(0, 0);
  now += 60e3; const t0 = now; await timer.startSet(a.exercises[1].sets[0].id, 8 * 3600);
  now = t0 + 7 * H;
  const w = store.autoFinishStale(now)!; const p = w.exercises[1].sets[0];
  expect(Number(p.durationSec)).toBeLessThanOrEqual((p.completedAt! - t0) / 1000);
});
