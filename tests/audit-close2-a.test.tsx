/* Runda 72 — testy z audytu T12 (runda zamykająca, bez błędów wysokich/średnich). */
/* T12 audit — temporary */
import * as store from '@/lib/store';
import * as timer from '@/lib/timer';
import { exName } from '@/lib/i18n';
import { AppState } from 'react-native';
import { renderApp, tap, flushAll, screen, act } from './app';
import { ex, pressAlert, saved } from './helpers';

jest.setTimeout(90000);
const H = 3600e3;
afterEach(async () => { jest.restoreAllMocks(); try { store.getState(); } catch { return; } await timer.stop(); await timer.stopSet(); });
const prompts = () => global.__alerts.filter(x => x.title === 'Trening wciąż trwa');

async function killDuringPlank(target: number, hours: number, warmupPlank = false, withBench = true) {
  const r1 = await renderApp();
  await act(async () => {
    store.startEmpty(); if (withBench) store.addExerciseToActive(ex('Bench Press (sztanga)')); store.addExerciseToActive(ex('Plank'));
    const a = store.getState().active!; if (withBench) { a.exercises[0].sets[0].weight = 100; a.exercises[0].sets[0].reps = 5; }
    const p = a.exercises[a.exercises.length - 1].sets[0]; p.durationSec = target || ''; if (warmupPlank) { p.kind = 'warmup'; p.warmup = true; } store.save(a);
  });
  await flushAll(400);
  if (withBench) await tap(screen.getByLabelText(`Seria 1 zrobiona — ${exName(ex('Bench Press (sztanga)'))}`));
  await flushAll(60e3);
  await tap(screen.getByLabelText('Start stopera serii')); expect(timer.S.on).toBe(true);
  await flushAll(5e3); await act(async () => { await store.flush(); });
  const st: any = saved(); r1.unmount();
  const D = hours * H; const sh = (x: any) => typeof x === 'number' ? x - D : x;
  st.active.startedAt = sh(st.active.startedAt); st.active.exercises.forEach((e: any) => e.sets.forEach((s: any) => { s.completedAt = sh(s.completedAt); }));
  st.timer.setStartAt = sh(st.timer.setStartAt); st.timer.restEndAt = sh(st.timer.restEndAt);
  if (st.active.staleAck) st.active.staleAck = sh(st.active.staleAck);
  await renderApp({ saved: st });
  for (let i = 0; i < 6; i++) await flushAll(300);
  return { plankStart: st.timer.setStartAt as number };
}

test('A1 cold start 3 h, plank target 60: exactly one prompt across minute ticks; finish saves end = plank end', async () => {
  const { plankStart } = await killDuringPlank(60, 3);
  const a = store.getState().active!; const pl = a.exercises[1].sets[0];
  expect(pl.done).toBe(true); expect(pl.durationSec).toBe(60); expect(pl.completedAt).toBe(plankStart + 60e3);
  for (let i = 0; i < 5; i++) await flushAll(60e3);
  expect(prompts().length).toBe(1);
  expect(prompts()[0].buttons!.map(b => b.text)).toContain('Zakończ i zapisz');
  pressAlert('Trening wciąż trwa', 'Zakończ i zapisz'); await flushAll(1000);
  const w = store.getState().workouts[store.getState().workouts.length - 1];
  expect(store.getState().active).toBeNull();
  expect(w.exercises.length).toBe(2); expect(w.finishedAt).toBe(plankStart + 60e3);
  expect(timer.S.on).toBe(false); expect(timer.T.on).toBe(false);
  expect(saved().timer.setStartAt ?? null).toBeNull();
});

test('A2 cold start 3 h: Odrzuć → Wróć → prompt again (once), Kontynuuj → no prompt for 2 h, then once more', async () => {
  await killDuringPlank(60, 3);
  expect(prompts().length).toBe(1);
  pressAlert('Trening wciąż trwa', 'Odrzuć'); pressAlert('Odrzucić trening?', 'Wróć'); await flushAll(10);
  expect(prompts().length).toBe(2);
  pressAlert('Trening wciąż trwa', 'Kontynuuj'); await flushAll(10);
  for (let i = 0; i < 119; i++) await flushAll(60e3);
  expect(prompts().length).toBe(2);
  await flushAll(2 * 60e3);
  expect(prompts().length).toBe(3);
});

test('A3 cold start 7 h: auto-saved, plank 60 s, no stale prompt, no running timers', async () => {
  const { plankStart } = await killDuringPlank(60, 7);
  for (let i = 0; i < 3; i++) await flushAll(60e3);
  expect(store.getState().active).toBeNull();
  expect(prompts().length).toBe(0);
  expect(global.__alerts.some(x => x.title === 'Zapisałem trening')).toBe(true);
  const w = store.getState().workouts[store.getState().workouts.length - 1];
  expect(w.exercises[1].sets[0].durationSec).toBe(60); expect(w.finishedAt).toBe(plankStart + 60e3);
  expect(timer.S.on).toBe(false);
});

test('A4 cold start 7 h, only a warmup plank running: kept active, one warmup prompt, duration 60', async () => {
  await killDuringPlank(60, 7, true, false);
  for (let i = 0; i < 3; i++) await flushAll(60e3);
  const a = store.getState().active!; expect(a).toBeTruthy();
  expect(a.exercises[0].sets[0].done).toBe(true); expect(a.exercises[0].sets[0].durationSec).toBe(60);
  expect(prompts().length).toBe(1); expect(prompts()[0].msg).toMatch(/rozgrzewka/);
  expect(timer.S.on).toBe(false);
});

async function fgDuringPlank(hours: number, warmupPlank = false) {
  const handlers: ((s: string) => void)[] = [];
  const orig = AppState.addEventListener;
  jest.spyOn(AppState, 'addEventListener').mockImplementation(((ev: string, cb: any) => { if (ev === 'change') handlers.push(cb); return { remove: () => {} }; }) as any);
  void orig;
  await renderApp();
  await act(async () => { store.startEmpty(); store.addExerciseToActive(ex('Bench Press (sztanga)')); store.addExerciseToActive(ex('Plank')); const a = store.getState().active!; a.exercises[0].sets[0].weight = 100; a.exercises[0].sets[0].reps = 5; const p = a.exercises[1].sets[0]; p.durationSec = 60; if (warmupPlank) { p.kind = 'warmup'; p.warmup = true; } store.save(a); });
  await flushAll(400);
  if (!warmupPlank) await tap(screen.getByLabelText(`Seria 1 zrobiona — ${exName(ex('Bench Press (sztanga)'))}`));
  await flushAll(30e3);
  await tap(screen.getByLabelText('Start stopera serii')); const t0 = timer.S.startAt;
  await act(async () => { handlers.forEach(h => h('background')); });
  jest.setSystemTime(t0 + hours * H);
  await act(async () => { handlers.forEach(h => h('active')); });
  await act(async () => { handlers.forEach(h => h('active')); }); // double foreground event
  for (let i = 0; i < 6; i++) await flushAll(300);
  return { t0, handlers };
}

test('A5 foreground 3 h (no kill): one prompt, plank 60 s, completedAt = start + 60', async () => {
  const { t0 } = await fgDuringPlank(3);
  for (let i = 0; i < 3; i++) await flushAll(60e3);
  const pl = store.getState().active!.exercises[1].sets[0];
  expect(pl.done).toBe(true); expect(pl.durationSec).toBe(60); expect(pl.completedAt).toBe(t0 + 60e3);
  expect(prompts().length).toBe(1);
});

test('A6 foreground 7 h (no kill): auto-saved with plank 60 s, no stale prompt', async () => {
  const { t0 } = await fgDuringPlank(7);
  for (let i = 0; i < 3; i++) await flushAll(60e3);
  expect(store.getState().active).toBeNull(); expect(prompts().length).toBe(0);
  const w = store.getState().workouts[store.getState().workouts.length - 1];
  expect(w.exercises[1].sets[0].durationSec).toBe(60); expect(w.finishedAt).toBe(t0 + 60e3);
  expect(timer.S.on).toBe(false);
});

test('A7 foreground 7 h warmup-only plank (S still on in memory): one prompt, duration 60, timers off', async () => {
  await fgDuringPlank(7, true);
  for (let i = 0; i < 3; i++) await flushAll(60e3);
  const a = store.getState().active!; expect(a).toBeTruthy();
  expect(a.exercises[1].sets[0].durationSec).toBe(60); expect(a.exercises[1].sets[0].done).toBe(true);
  expect(prompts().length).toBe(1);
  expect(timer.S.on).toBe(false); expect(timer.T.on).toBe(false);
});
