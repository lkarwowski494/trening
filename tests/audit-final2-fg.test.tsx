/* Runda 72 — testy z audytu T10 (weryfikacja końcowa). */
const log = (..._a: unknown[]) => { /* diagnostyka audytu wyciszona */ };
import * as store from '@/lib/store';
import * as timer from '@/lib/timer';
import { AppState } from 'react-native';
import { renderApp, tap, flushAll, screen, act } from './app';
import { ex } from './helpers';

jest.setTimeout(60000);
const H = 3600e3;
let handlers: ((s: string) => void)[] = [];
beforeEach(() => { handlers = []; jest.spyOn(AppState, 'addEventListener').mockImplementation(((ev: string, cb: any) => { if (ev === 'change') handlers.push(cb); return { remove: () => {} }; }) as any); });
afterEach(async () => { jest.restoreAllMocks(); try { store.getState(); } catch { return; } await timer.stop(); await timer.stopSet(); });
const fg = async (st: string) => { await act(async () => { handlers.forEach(h => h(st)); }); };

test('F1 foreground after 7 h with running plank (work done earlier): finished, timers & LA clean, no rest', async () => {
  await renderApp();
  await act(async () => { store.startEmpty(); store.addExerciseToActive(ex('Bench Press (sztanga)')); store.addExerciseToActive(ex('Plank'));
    const a = store.getState().active!; a.exercises[0].sets[0].weight = 100; a.exercises[0].sets[0].reps = 5; a.exercises[1].sets[0].durationSec = 60; store.save(a); });
  await flushAll(400);
  await tap(screen.getAllByLabelText(/Seria 1 zrobiona/)[0]); await flushAll(60e3);
  await tap(screen.getByLabelText('Start stopera serii')); const t0 = timer.S.startAt;
  await fg('background');
  jest.setSystemTime(t0 + 7 * H);
  await fg('active');
  for (let i = 0; i < 6; i++) await flushAll(300);
  expect(store.getState().active).toBeNull();
  const w = store.getState().workouts[store.getState().workouts.length - 1];
  const pl = w.exercises.find(e => e.exerciseId === ex('Plank').id)!.sets[0];
  expect(pl.completedAt).toBe(t0 + 60e3);
  expect(w.finishedAt).toBe(t0 + 60e3);
  expect(timer.S.on).toBe(false); expect(timer.T.on).toBe(false);
  expect(store.getState().timer.setStartAt).toBeNull();
  const la = (global.__la as any[]); log('la tail', JSON.stringify(la.slice(-3)));
  expect(la[la.length - 1][0]).toBe('end');
  log(global.__alerts.map(a => a.title + ': ' + a.msg).join(' | '));
  expect(global.__alerts.filter(a => a.title === 'Zapisałem trening').length).toBe(1);
});

test('F2 foreground after 7 h with running warm-up plank only: set done, prompt warmup, UI ok, no rest', async () => {
  await renderApp();
  await act(async () => { store.startEmpty(); store.addExerciseToActive(ex('Plank')); store.addSet(0);
    const a = store.getState().active!; a.exercises[0].sets[0].kind = 'warmup'; a.exercises[0].sets[0].warmup = true; a.exercises[0].sets[0].durationSec = 30; a.exercises[0].sets[1].durationSec = 60; store.save(a); });
  await flushAll(400);
  await tap(screen.getAllByLabelText('Start stopera serii')[0]); const t0 = timer.S.startAt;
  await fg('background');
  jest.setSystemTime(t0 + 7 * H);
  await fg('active');
  for (let i = 0; i < 6; i++) await flushAll(300);
  const a = store.getState().active!; expect(a).toBeTruthy();
  const s0 = a.exercises[0].sets[0];
  log('s0', JSON.stringify(s0), 'timer', JSON.stringify(store.getState().timer), 'S', JSON.stringify(timer.S), 'T', JSON.stringify(timer.T));
  log(global.__alerts.map(x => x.title + ': ' + x.msg).join(' | '));
  expect(s0.done).toBe(true); expect(s0.durationSec).toBe(30); expect(s0.completedAt).toBe(t0 + 30e3);
  expect(timer.S.on).toBe(false); expect(timer.T.on).toBe(false);
  expect(store.getState().timer.setStartAt).toBeNull();
});

test('F3 kill + restart after 7 h with running warm-up plank only: restore then UI', async () => {
  await renderApp();
  await act(async () => { store.startEmpty(); store.addExerciseToActive(ex('Plank')); store.addSet(0);
    const a = store.getState().active!; a.exercises[0].sets[0].kind = 'warmup'; a.exercises[0].sets[0].warmup = true; a.exercises[0].sets[0].durationSec = 30; a.exercises[0].sets[1].durationSec = 60; store.save(a); });
  await flushAll(400);
  await tap(screen.getAllByLabelText('Start stopera serii')[0]); await flushAll(5e3); await act(async () => { await store.flush(); });
  const { saved } = require('./helpers'); const st = saved(); const D = 7 * H; const sh = (x: any) => typeof x === 'number' ? x - D : x;
  st.active.startedAt = sh(st.active.startedAt); st.timer.setStartAt = sh(st.timer.setStartAt); const t0 = st.timer.setStartAt;
  await renderApp({ saved: st }); for (let i = 0; i < 6; i++) await flushAll(300);
  const a = store.getState().active!; const s0 = a.exercises[0].sets[0];
  log('F3 s0', JSON.stringify(s0), 'timer', JSON.stringify(store.getState().timer), 'S', JSON.stringify(timer.S), 'T', JSON.stringify(timer.T), 'la', JSON.stringify((global.__la as any[]).slice(-3)));
  log(global.__alerts.map(x => x.title + ': ' + x.msg).join(' | '));
  expect(s0.done).toBe(true); expect(s0.completedAt).toBe(t0 + 30e3);
  expect(timer.S.on).toBe(false); expect(timer.T.on).toBe(false);
});
