/* Runda 72 — testy z audytu T9 (weryfikacja końcowa). */
const log = (..._a: unknown[]) => { /* diagnostyka audytu wyciszona */ };
import * as store from '@/lib/store';
import * as timer from '@/lib/timer';
import { ex, pressAlert, set } from './helpers';
import { renderApp, flushAll, act, screen, tap } from './app';

jest.setTimeout(30000);
afterEach(async () => { try { store.getState(); } catch { return; } await timer.stop(); await timer.stopSet(); });

const mkTpl = (restSec = 90, target = 60, extra: any[] = []) => { const tpl = store.newTemplate(); tpl.name = 'TT';
  tpl.items.push({ id: 'pl', exerciseId: ex('Plank').id, sets: 2, repMin: null, repMax: null, restSec, startWeight: '', targetSec: target, groupId: null }, ...extra); store.save(tpl); return tpl; };

test('T1 first measure, suspended past target: completedAt = start+target, rest ends at start+target+rest', async () => {
  await renderApp();
  await act(async () => { store.startFromTemplate(mkTpl()); }); await flushAll(10);
  await tap(screen.getAllByLabelText('Start stopera serii')[0]); const t0 = timer.S.startAt; expect(timer.S.targetSec).toBe(60);
  jest.setSystemTime(t0 + 100e3); await flushAll(600);
  const s0 = store.getState().active!.exercises[0].sets[0];
  expect(s0.done).toBe(true); expect(s0.completedAt).toBe(t0 + 60e3); expect(s0.durationSec).toBe(60);
  expect(timer.T.on).toBe(true); expect(timer.T.endAt).toBe(t0 + 150e3); expect(timer.T.total).toBe(90);
  const n = (global.__notifications as any[]).filter(x => x.identifier === 'rest-end').pop(); log(JSON.stringify(n), JSON.stringify(global.__la.slice(-3))); expect(Math.abs(n.trigger.seconds - 50)).toBeLessThanOrEqual(1);
  const la = (global.__la as any[]).pop(); expect(JSON.stringify(la)).toContain(String(t0 + 150e3));
});

test('T2 remeasure, suspended past target: rest should also be counted from the set end (consistency with first measure)', async () => {
  await renderApp();
  await act(async () => { store.startFromTemplate(mkTpl()); }); await flushAll(10);
  await tap(screen.getAllByLabelText('Start stopera serii')[0]); await flushAll(61e3); await flushAll(600);
  expect(store.getState().active!.exercises[0].sets[0].done).toBe(true);
  await act(async () => { await timer.stop(); });
  await tap(screen.getAllByLabelText('Start stopera serii')[0]); await act(async () => { pressAlert('Zmierzyć serię od nowa?', 'Zmierz'); }); await flushAll(10);
  const t0 = timer.S.startAt; expect(timer.S.targetSec).toBe(60);
  jest.setSystemTime(t0 + 10 * 60e3); await flushAll(600);
  // set ended at t0+60s, rest 90 s → over at t0+150 s, i.e. 7.5 min ago
  log('T2 rest left s', (timer.T.endAt - Date.now())/1000, 'total', timer.T.total);
  expect(timer.T.on && timer.T.endAt > Date.now()).toBe(false);
});

test('T3 superset with timed set: past at mid-round gives no rest; round end via timed set rests from end', async () => {
  await renderApp();
  await act(async () => { const tpl = mkTpl(90, 60, [{ id: 'pu', exerciseId: ex('Push Up').id, sets: 2, repMin: 10, repMax: 10, restSec: 120, startWeight: '', targetSec: '', groupId: null }]);
    tpl.items[0].groupId = 'g'; tpl.items[1].groupId = 'g'; store.startFromTemplate(tpl); }); await flushAll(10);
  const a = store.getState().active!; expect(a.exercises[0].groupId).toBeTruthy();
  // tick Pompki 1 first, then plank 1 (round end) via timer suspended
  await tap(screen.getAllByLabelText(/Seria 1 zrobiona/)[1]); await flushAll(10);
  expect(timer.T.on).toBe(false);
  await tap(screen.getAllByLabelText('Start stopera serii')[0]); const t0 = timer.S.startAt;
  jest.setSystemTime(t0 + 80e3); await flushAll(600);
  const s0 = store.getState().active!.exercises[0].sets[0]; expect(s0.completedAt).toBe(t0 + 60e3);
  expect(timer.T.on).toBe(true); expect(timer.T.endAt).toBe(t0 + 60e3 + 120e3); // round rest = last exercise (Pompki 120)
  expect(s0.actualRest).toBe(Math.round((t0 + 60e3 - store.getState().active!.exercises[1].sets[0].completedAt!) / 1000));
});

test('T4 kill during a rest started from a past end: restore keeps end', async () => {
  await renderApp();
  await act(async () => { store.startFromTemplate(mkTpl()); }); await flushAll(10);
  await tap(screen.getAllByLabelText('Start stopera serii')[0]); const t0 = timer.S.startAt;
  jest.setSystemTime(t0 + 100e3); await flushAll(600); await act(async () => { await store.flush(); });
  const st = JSON.parse(global.__kv.get('state')!); const lv = JSON.parse(global.__kv.get('live')!);
  expect(lv.timer.restEndAt).toBe(t0 + 150e3); expect(lv.timer.restTotal).toBe(90);
  timer.T.on = false; timer.T.endAt = 0; jest.setSystemTime(t0 + 120e3);
  await act(async () => { await timer.restore(); });
  expect(timer.T.on).toBe(true); expect(timer.T.endAt).toBe(t0 + 150e3); expect(timer.T.alarmed).toBe(false);
  const n = (global.__notifications as any[]).filter(x => x.identifier === 'rest-end').pop(); expect(n.trigger.seconds).toBe(30);
});

test('T5 untick/retick timed set after past-at completion', async () => {
  await renderApp();
  await act(async () => { store.startFromTemplate(mkTpl()); }); await flushAll(10);
  await tap(screen.getAllByLabelText('Start stopera serii')[0]); const t0 = timer.S.startAt;
  jest.setSystemTime(t0 + 100e3); await flushAll(600);
  await tap(screen.getAllByLabelText(/Seria 1 zrobiona — Plank/)[0]); await flushAll(10);
  const s0 = store.getState().active!.exercises[0].sets[0]; expect(s0.done).toBe(false); expect(timer.T.on).toBe(false); expect(s0.durationSec).toBe(60);
  await tap(screen.getAllByLabelText(/Seria 1 zrobiona — Plank/)[0]); await flushAll(10);
  expect(s0.done).toBe(true); expect(timer.T.on).toBe(true); expect(timer.T.endAt - Date.now()).toBeGreaterThan(89e3);
});
