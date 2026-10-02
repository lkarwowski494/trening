/* Runda 72 — testy z audytu T7 (weryfikacja poprawek T6, UI). */
/* T7 audit UI repros (temporary). */
import * as store from '@/lib/store';
import * as timer from '@/lib/timer';
import { ex, pressAlert, set } from './helpers';
import { renderApp, flushAll, act, screen, tap } from './app';

jest.setTimeout(30000);
afterEach(async () => { try { store.getState(); } catch { return; } await timer.stop(); await timer.stopSet(); });

test('H2 remeasure of a timed set followed by an unticked drop set does not start a rest', async () => {
  await renderApp();
  await act(async () => { store.startEmpty(); store.addExerciseToActive(ex('Plank')); const a = store.getState().active!; const e = a.exercises[0];
    e.sets = [set({ done: false }), { ...set({ done: false }), kind: 'drop' }]; store.save(a); });
  await flushAll(10);
  await tap(screen.getAllByLabelText('Start stopera serii')[0]); await flushAll(20e3); await tap(screen.getAllByText(/Zakończ serię/)[0]); await flushAll(10);
  const s0 = store.getState().active!.exercises[0].sets[0]; expect(s0.done).toBe(true);
  expect(timer.T.on).toBe(false); // first measure: no rest (drop follows) — OK
  await tap(screen.getAllByLabelText('Start stopera serii')[0]); pressAlert('Zmierzyć serię od nowa?', 'Zmierz'); await flushAll(15e3);
  await tap(screen.getAllByText(/Zakończ serię/)[0]); await flushAll(10);
  expect(timer.T.on).toBe(false); // remeasure: rest started via `?? roundRest`
});

test('H2b same in a non-drop context: remeasure still starts a rest (regression guard)', async () => {
  await renderApp();
  await act(async () => { store.startEmpty(); store.addExerciseToActive(ex('Plank')); }); await flushAll(10);
  await tap(screen.getAllByLabelText('Start stopera serii')[0]); await flushAll(20e3); await tap(screen.getAllByText(/Zakończ serię/)[0]); await flushAll(10);
  await tap(screen.getAllByLabelText('Start stopera serii')[0]); pressAlert('Zmierzyć serię od nowa?', 'Zmierz'); await flushAll(15e3);
  await tap(screen.getAllByText(/Zakończ serię/)[0]); await flushAll(10);
  expect(timer.T.on).toBe(true);
});

test('S3 UI: future startedAt -> prompt once; Kontynuuj -> no re-open on minute ticks', async () => {
  await renderApp(); const now = Date.now();
  await act(async () => { store.startEmpty(); const a = store.getState().active!; a.startedAt = now + 5 * 3600e3; store.save(a); store.refreshViews(); });
  await flushAll(10);
  const n0 = global.__alerts.filter(x => x.title === 'Trening wciąż trwa').length; expect(n0).toBe(1);
  await act(async () => { pressAlert('Trening wciąż trwa', 'Kontynuuj'); }); await flushAll(10);
  for (let i = 0; i < 10; i++) await flushAll(60e3);
  expect(global.__alerts.filter(x => x.title === 'Trening wciąż trwa').length).toBe(1);
  const rem = (global.__notifications as any[]).filter(x => x.identifier === 'stale-reminder').pop();
  expect(rem?.trigger?.seconds).toBeGreaterThan(100 * 60);
});
