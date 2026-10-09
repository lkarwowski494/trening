/* Runda 72 — testy z audytu T10 (weryfikacja końcowa). */
const log = (..._a: unknown[]) => { /* diagnostyka audytu wyciszona */ };
import * as store from '@/lib/store';
import * as timer from '@/lib/timer';
import { renderApp, tap, flushAll, screen } from './app';
import { ex, saved, addWorkout } from './helpers';

jest.setTimeout(60000);
afterEach(async () => { try { store.getState(); } catch { return; } await timer.stop(); await timer.stopSet(); });

async function killDuringFarmer(hours: number) {
  const r1 = await renderApp();
  addWorkout(Date.now() - 48 * 3600e3, [['Crucifix' /* ciężar + czas (Farmer's Walk od 09.10.2026: ciężar + dystans) */, [{ weight: 40, durationSec: 60 }]]]);
  store.startEmpty(); store.addExerciseToActive(ex('Bench Press (sztanga)')); store.addExerciseToActive(ex('Crucifix' /* ciężar + czas (Farmer's Walk od 09.10.2026: ciężar + dystans) */));
  const a = store.getState().active!; a.exercises[0].sets[0].weight = 100; a.exercises[0].sets[0].reps = 5; a.exercises[1].sets[0].durationSec = 60; store.save(a);
  await flushAll(400);
  await tap(screen.getByLabelText(/Seria 1 zrobiona — Wyciskanie|Seria 1 zrobiona — Bench/));
  await flushAll(60e3);
  await tap(screen.getByLabelText('Start stopera serii'));
  await flushAll(20e3); await store.flush();
  const st = saved(); log("pre", JSON.stringify(st.active!.exercises[1].sets[0])); r1.unmount();
  const D = hours * 3600e3; const sh = (x: any) => typeof x === 'number' ? x - D : x;
  st.active!.startedAt = sh(st.active!.startedAt); st.active!.exercises.forEach(e => e.sets.forEach(s => { s.completedAt = sh(s.completedAt); }));
  st.timer.setStartAt = sh(st.timer.setStartAt); st.timer.restEndAt = sh(st.timer.restEndAt);
  await renderApp({ saved: st });
  await flushAll(1500);
}

const farmerSet = () => {
  const w = store.getState().active ?? [...store.getState().workouts].sort((p, q) => q.startedAt - p.startedAt).find(x => x.exercises.some(e => e.exerciseId === ex('Crucifix' /* ciężar + czas (Farmer's Walk od 09.10.2026: ciężar + dystans) */).id))!;
  return w.exercises.find(e => e.exerciseId === ex('Crucifix' /* ciężar + czas (Farmer's Walk od 09.10.2026: ciężar + dystans) */).id)!.sets[0];
};

test('U1 3 h kill during Farmer walk (empty weight, hint 40): saved weight', async () => {
  await killDuringFarmer(3);
  const s = farmerSet(); log('3h', JSON.stringify({ done: s.done, w: s.weight, d: s.durationSec, r: s.actualRest }));
  expect(s.done).toBe(true); expect(s.weight).toBe(40);
});
test('U2 7 h kill during Farmer walk (empty weight, hint 40): saved weight should match 3 h path', async () => {
  await killDuringFarmer(7);
  expect(store.getState().active).toBeNull();
  const s = farmerSet(); log('7h', JSON.stringify({ done: s.done, w: s.weight, d: s.durationSec, r: s.actualRest }));
  expect(s.weight).toBe(40);
});
