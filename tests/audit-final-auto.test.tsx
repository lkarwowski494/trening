/* Runda 72 — testy z audytu T9 (weryfikacja końcowa). */
const log = (..._a: unknown[]) => { /* diagnostyka audytu wyciszona */ };
import * as store from '@/lib/store';
import * as timer from '@/lib/timer';
import { exName } from '@/lib/i18n';
import { renderApp, tap, flushAll, screen } from './app';
import { ex, saved } from './helpers';

jest.setTimeout(60000);
afterEach(async () => { await timer.stop(); await timer.stopSet(); });

async function killDuringPlank(target: number, hours: number) {
  const r1 = await renderApp();
  store.startEmpty(); store.addExerciseToActive(ex('Bench Press (sztanga)')); store.addExerciseToActive(ex('Plank'));
  const a = store.getState().active!; a.exercises[0].sets[0].weight = 100; a.exercises[0].sets[0].reps = 5; a.exercises[1].sets[0].durationSec = target || ''; store.save(a);
  await flushAll(400);
  await tap(screen.getByLabelText(`Seria 1 zrobiona — ${exName(ex('Bench Press (sztanga)'))}`));
  await flushAll(60e3);
  await tap(screen.getByLabelText('Start stopera serii'));
  await flushAll(20e3); await store.flush();
  const st = saved(); r1.unmount();
  const D = hours * 3600e3; const sh = (x: any) => typeof x === 'number' ? x - D : x;
  st.active!.startedAt = sh(st.active!.startedAt); st.active!.exercises.forEach(e => e.sets.forEach(s => { s.completedAt = sh(s.completedAt); }));
  st.timer.setStartAt = sh(st.timer.setStartAt); st.timer.restEndAt = sh(st.timer.restEndAt);
  const plankStart = st.timer.setStartAt as number;
  global.__alerts.length = 0;
  await renderApp({ saved: st });
  await flushAll(1500);
  return { plankStart };
}

test('A1 auto-finish after >6 h while a target timed set was running: the plank (ended at start+target) is kept', async () => {
  const { plankStart } = await killDuringPlank(60, 7);
  expect(store.getState().active).toBeNull();
  const w = store.getState().workouts[0];
  const plank = w.exercises.find(e => e.exerciseId === ex('Plank').id);
  log('alerts', global.__alerts.map(a => a.title + ': ' + a.msg).join(' | '), 'finishedAt-plankStart', w.finishedAt! - plankStart);
  expect(plank?.sets.length ?? 0).toBe(1);
});
