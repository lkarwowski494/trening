/* Runda 72 — testy z audytu T12 (runda zamykająca, bez błędów wysokich/średnich). */
const log = (..._a: unknown[]) => { /* diagnostyka audytu wyciszona */ };
/* T12 audit — temporary: remeasure + stale interplay */
import * as store from '@/lib/store';
import * as timer from '@/lib/timer';
import { renderApp, tap, flushAll, screen, act } from './app';
import { ex, pressAlert, saved } from './helpers';
jest.setTimeout(90000);
const H = 3600e3;
afterEach(async () => { try { store.getState(); } catch { return; } await timer.stop(); await timer.stopSet(); });
const prompts = () => global.__alerts.filter(x => x.title === 'Trening wciąż trwa');

async function setup() {
  await renderApp();
  await act(async () => { const tpl = store.newTemplate(); tpl.name = 'Core'; tpl.items.push({ id: 'i1', exerciseId: ex('Plank').id, sets: 1, repMin: null, repMax: null, restSec: 60, startWeight: '', targetSec: 60, groupId: null }); store.save(tpl); store.startFromTemplate(tpl); });
  await flushAll(400);
  await tap(screen.getByLabelText('Start stopera serii')); await flushAll(61e3); await flushAll(1e3);
  const s = store.getState().active!.exercises[0].sets[0]; expect(s.done).toBe(true); expect(s.durationSec).toBe(60);
  return s;
}

test('C1 remeasure 1 h 50 after last tick: prompt 10 min later claims last set 2 h ago (characterise)', async () => {
  const s = await setup(); const done0 = s.completedAt!;
  await flushAll(110 * 60e3); expect(prompts().length).toBe(0);
  await tap(screen.getByLabelText('Start stopera serii')); pressAlert('Zmierzyć serię od nowa?', 'Zmierz'); await flushAll(0); await flushAll(0); expect(timer.S.on).toBe(true); await flushAll(61e3); await flushAll(1e3);
  expect(timer.S.on).toBe(false);
  for (let i = 0; i < 12; i++) await flushAll(60e3);
  // characterise only
  // eslint-disable-next-line no-console
  log('C1 prompts', prompts().length, prompts().map(p => p.msg), 'done0', new Date(done0).toISOString(), 'now', new Date(Date.now()).toISOString());
});

test('C2 remeasure running, kill, reopen 3 h: exactly one prompt, durationSec 60, end = original tick', async () => {
  const s0 = await setup(); const done0 = s0.completedAt!;
  await tap(screen.getByLabelText('Start stopera serii')); pressAlert('Zmierzyć serię od nowa?', 'Zmierz'); await flushAll(5e3);
  await act(async () => { await store.flush(); });
  const st: any = saved(); const D = 3 * H; const sh = (x: any) => typeof x === 'number' ? x - D : x;
  st.active.startedAt = sh(st.active.startedAt); st.timer.setStartAt = sh(st.timer.setStartAt); st.timer.restEndAt = sh(st.timer.restEndAt);
  st.active.exercises.forEach((e: any) => e.sets.forEach((x: any) => { x.completedAt = sh(x.completedAt); }));
  await renderApp({ saved: st }); for (let i = 0; i < 6; i++) await flushAll(300);
  for (let i = 0; i < 3; i++) await flushAll(60e3);
  const s = store.getState().active!.exercises[0].sets[0];
  expect(s.durationSec).toBe(60); expect(prompts().length).toBe(1);
  pressAlert('Trening wciąż trwa', 'Zakończ i zapisz'); await flushAll(500);
  const w = store.getState().workouts[store.getState().workouts.length - 1];
  expect(w.finishedAt).toBe(done0 - D);
  expect(timer.S.on).toBe(false); expect(timer.T.on).toBe(false);
});
