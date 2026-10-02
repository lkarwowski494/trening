/* Runda 72 — testy z audytu T11 (runda zamykająca). */
const log = (..._a: unknown[]) => { /* diagnostyka audytu wyciszona */ };
import * as store from '@/lib/store';
import * as timer from '@/lib/timer';
import { renderApp, tap, flushAll, screen, act } from './app';
import { ex, saved } from './helpers';
jest.setTimeout(60000);
const H = 3600e3;
afterEach(async () => { try { store.getState(); } catch { return; } await timer.stop(); await timer.stopSet(); });

test('P1 only set is a running plank (target 60), kill, reopen 3 h later: prompt must not claim "no sets"', async () => {
  await renderApp();
  await act(async () => { store.startEmpty(); store.addExerciseToActive(ex('Plank')); const a = store.getState().active!; a.exercises[0].sets[0].durationSec = 60; store.save(a); });
  await flushAll(400);
  await tap(screen.getByLabelText('Start stopera serii')); await flushAll(5e3);
  await act(async () => { await store.flush(); });
  const D = 3 * H; const st: any = saved(); const sh = (x: any) => typeof x === 'number' ? x - D : x;
  st.active.startedAt = sh(st.active.startedAt); st.timer.setStartAt = sh(st.timer.setStartAt);
  await renderApp({ saved: st }); for (let i = 0; i < 6; i++) await flushAll(300);
  const a = store.getState().active!; const s0 = a.exercises[0].sets[0];
  const p = global.__alerts.filter(x => x.title === 'Trening wciąż trwa');
  log('set', JSON.stringify({ done: s0.done, d: s0.durationSec }), 'alerts', JSON.stringify(p.map(x => [x.msg, x.buttons?.map(b => b.text)])));
  expect(s0.done).toBe(true);
  expect(p.length).toBeGreaterThan(0);
  expect(p[p.length - 1].msg).not.toMatch(/bez odhaczonych serii/);
});

import { AppState } from 'react-native';
test('P2 foreground variant (no kill), 3 h in background', async () => {
  const handlers: ((s: string) => void)[] = [];
  jest.spyOn(AppState, 'addEventListener').mockImplementation(((ev: string, cb: any) => { if (ev === 'change') handlers.push(cb); return { remove: () => {} }; }) as any);
  await renderApp();
  await act(async () => { store.startEmpty(); store.addExerciseToActive(ex('Plank')); const a = store.getState().active!; a.exercises[0].sets[0].durationSec = 60; store.save(a); });
  await flushAll(400);
  await tap(screen.getByLabelText('Start stopera serii')); const t0 = timer.S.startAt;
  await act(async () => { handlers.forEach(h => h('background')); });
  jest.setSystemTime(t0 + 3 * H);
  await act(async () => { handlers.forEach(h => h('active')); });
  for (let i = 0; i < 6; i++) await flushAll(300);
  const s0 = store.getState().active!.exercises[0].sets[0];
  const p = global.__alerts.filter(x => x.title === 'Trening wciąż trwa');
  log('P2', JSON.stringify({ done: s0.done }), JSON.stringify(p.map(x => [x.msg, x.buttons?.map(b => b.text)])));
  expect(s0.done).toBe(true);
  expect(p[p.length - 1].msg).not.toMatch(/bez odhaczonych serii/);
  jest.restoreAllMocks();
});
