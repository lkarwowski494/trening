/* Runda 72 — testy z audytu T8 (pełna ścieżka użytkownika, weryfikacja końcowa). */
import * as store from '@/lib/store';
import * as timer from '@/lib/timer';
import { exName } from '@/lib/i18n';
import { renderApp, tap, flushAll, screen } from './app';
import { ex, pressAlert, saved } from './helpers';

jest.setTimeout(60000);
afterEach(async () => { await timer.stop(); await timer.stopSet(); });

/** Workout: bench set ticked at t0, plank stopwatch started at t0+60 s, app killed 20 s later; reopened `hours` later. */
async function killDuringPlank(target: number, hours: number) {
  const r1 = await renderApp();
  store.startEmpty(); store.addExerciseToActive(ex('Bench Press (sztanga)')); store.addExerciseToActive(ex('Plank'));
  const a = store.getState().active!; a.exercises[0].sets[0].weight = 100; a.exercises[0].sets[0].reps = 5; a.exercises[1].sets[0].durationSec = target || ''; store.save(a);
  await flushAll(400);
  await tap(screen.getByLabelText(`Seria 1 zrobiona — ${exName(ex('Bench Press (sztanga)'))}`));
  const t0 = Date.now();
  await flushAll(60e3);
  await tap(screen.getByLabelText('Start stopera serii')); expect(timer.S.on).toBe(true); expect(timer.S.targetSec).toBe(target);
  await flushAll(20e3); await store.flush();
  const st = saved(); r1.unmount();
  // renderRouter re-installs the fake clock at "now", so we move the saved timestamps back instead of the clock forward
  const D = hours * 3600e3; const sh = (x: any) => typeof x === 'number' ? x - D : x;
  st.active!.startedAt = sh(st.active!.startedAt); st.active!.exercises.forEach(e => e.sets.forEach(s => { s.completedAt = sh(s.completedAt); }));
  st.timer.setStartAt = sh(st.timer.setStartAt); st.timer.restEndAt = sh(st.timer.restEndAt);
  global.__alerts.length = 0;
  await renderApp({ saved: st });
  await flushAll(1500);
  return { t0: t0 - D, plankStart: st.timer.setStartAt as number };
}

test('B1 MEDIUM: killed during a timed set with a target, reopened 3 h later — "finish with that end time" saves now as the end', async () => {
  const { t0, plankStart } = await killDuringPlank(60, 3);
  const prompt = global.__alerts.find(x => x.title === 'Trening wciąż trwa')!;
  expect(prompt.msg).toMatch(/^Ostatnia seria o .*Zakończyć trening z tą godziną końca\?$/); // promises the last-set time as end
  // meanwhile the screen silently ticked the plank "now" (3 h late) and started a 90 s rest
  const plankSet = store.getState().active!.exercises[1].sets[0];
  expect(plankSet.done).toBe(true); expect(plankSet.durationSec).toBe(60);
  pressAlert('Trening wciąż trwa', 'Zakończ i zapisz'); await flushAll(500);
  const w = store.getState().workouts[0];
  // expected: end at the last real activity (plank ended at plankStart + 60 s), ~2 min after start
  expect(w.finishedAt!).toBeLessThanOrEqual(plankStart + 60e3); // FAILS: finishedAt ≈ t0 + 3 h
  expect(w.finishedAt! - t0).toBeLessThan(10 * 60e3);
});

test('B2 (Q-002, runda 75): stoper bez celu nie wraca po zamknięciu aplikacji — pusta seria zostaje nieodhaczona, nic nie zapisuje 3 h planku', async () => {
  await killDuringPlank(0, 3);
  expect(timer.S.on).toBe(false); expect(store.getState().timer.setStartAt).toBeNull();
  expect(store.getState().active!.exercises[1].sets[0].done).toBe(false);
  pressAlert('Trening wciąż trwa', 'Kontynuuj'); await flushAll(10);
  await tap(screen.getAllByText('Zakończ trening i zapisz')[0]); pressAlert('Zakończyć trening?', 'Zakończ'); await flushAll(600);
  const w = store.getState().workouts[0]; expect(w.exercises.find(e => e.exerciseId === ex('Plank').id)).toBeUndefined();
});
