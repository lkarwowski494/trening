/* Runda 72 — testy z audytu T11 (runda zamykająca). */
import * as store from '@/lib/store';
import * as timer from '@/lib/timer';
import { renderApp, tap, flushAll, screen, act } from './app';
import { ex, saved, pressAlert } from './helpers';
jest.setTimeout(60000);
const H = 3600e3;
afterEach(async () => { try { store.getState(); } catch { return; } await timer.stop(); await timer.stopSet(); });

async function run(D: number) {
  await renderApp();
  await act(async () => { const tpl = store.newTemplate(); tpl.name = 'Core'; tpl.items.push({ id: 'i1', exerciseId: ex('Plank').id, sets: 1, repMin: null, repMax: null, restSec: 60, startWeight: '', targetSec: 60, groupId: null }); store.save(tpl); store.startFromTemplate(tpl); });
  await flushAll(400);
  await tap(screen.getByLabelText('Start stopera serii')); await flushAll(45e3);
  await tap(screen.getAllByLabelText(/Seria 1 zrobiona/)[0]); await flushAll(2e3);
  const a0 = store.getState().active!; expect(a0.exercises[0].sets[0].done).toBe(true); expect(a0.exercises[0].sets[0].durationSec).toBe(45);
  await tap(screen.getByLabelText('Start stopera serii')); pressAlert('Zmierzyć serię od nowa?', 'Zmierz'); await flushAll(5e3);
  expect(timer.S.on).toBe(true); expect(timer.S.targetSec).toBe(60);
  await act(async () => { await store.flush(); });
  const st: any = saved(); const sh = (x: any) => typeof x === 'number' ? x - D : x;
  st.active.startedAt = sh(st.active.startedAt); st.timer.setStartAt = sh(st.timer.setStartAt); st.timer.restEndAt = sh(st.timer.restEndAt);
  st.active.exercises.forEach((e: any) => e.sets.forEach((s: any) => { s.completedAt = sh(s.completedAt); }));
  await renderApp({ saved: st }); for (let i = 0; i < 6; i++) await flushAll(300);
  const w = store.getState().active ?? store.getState().workouts[store.getState().workouts.length - 1];
  return w.exercises[0].sets[0];
}
test('U3h remeasure kill restart 3 h', async () => { const s = await run(3 * H); expect(s.durationSec).toBe(60); });
test('U7h remeasure kill restart 7 h', async () => { const s = await run(7 * H); expect(s.durationSec).toBe(60); });
