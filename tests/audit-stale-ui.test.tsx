/* Runda 72 — testy z audytu tematycznego T4 (trwałość/porzucony trening, wymiana danych). Nazwy części testów opisują scenariusz dawnego błędu; asercje sprawdzają poprawne zachowanie. */
import * as store from '@/lib/store';
import * as timer from '@/lib/timer';
import { ex, pressAlert } from './helpers';
import { renderApp, flushAll, act, screen, tap } from './app';

jest.mock('expo-notifications', () => ({
  setNotificationHandler: jest.fn(),
  getPermissionsAsync: async () => ({ granted: true }),
  requestPermissionsAsync: async () => ({ granted: true }),
  scheduleNotificationAsync: async (req: any) => { (global as any).__nlog.push(['schedule', req.identifier, req.trigger?.seconds]); (global as any).__notifications.push(req); return req.identifier; },
  cancelScheduledNotificationAsync: async (id: string) => { (global as any).__nlog.push(['cancel', id]); },
  getAllScheduledNotificationsAsync: async () => [],
  SchedulableTriggerInputTypes: { TIME_INTERVAL: 'timeInterval', DATE: 'date' },
}));
(global as any).__nlog = [];

jest.setTimeout(30000);
const H = 3600e3;
afterEach(async () => { try { store.getState(); } catch { return; } await timer.stop(); await timer.stopSet(); });

/** Czy po ostatnim „cancel stale-reminder” zostało zaplanowane przypomnienie (osierocone). */
const staleOrphan = () => { const l = (global as any).__nlog.filter((x: any) => x[1] === 'stale-reminder'); const last = l[l.length - 1]; return last && last[0] === 'schedule'; };

test('U1: finishing with a running stopwatch leaves no orphan stale reminder', async () => {
  await renderApp(); (global as any).__nlog = [];
  await act(async () => { store.startEmpty(); store.addExerciseToActive(ex('Plank')); }); await flushAll(10);
  const id = store.getState().active!.exercises[0].sets[0].id;
  await act(async () => { await timer.startSet(id, 0); }); await flushAll(10);
  await act(async () => { jest.advanceTimersByTime(5000); }); await flushAll(10);
  await tap(screen.getAllByText('Zakończ')[0]); await flushAll(5);
  (global as any).__nlog = [];
  await act(async () => { pressAlert('Zakończyć trening?', 'Zakończ'); }); for (let i = 0; i < 10; i++) await flushAll(50);
  expect(store.getState().active).toBeNull();
  // eslint-disable-next-line no-console
  console.log(JSON.stringify((global as any).__nlog));
  expect(staleOrphan()).toBeFalsy();
});

test('U2: stale prompt "Zakończ i zapisz" leaves no orphan reminder', async () => {
  await renderApp(); const now = Date.now();
  await act(async () => { store.startEmpty(); store.addExerciseToActive(ex('Back Squat')); const a = store.getState().active!; a.startedAt = now - 3 * H; const s = a.exercises[0].sets[0]; s.weight = 100; s.reps = 5; s.done = true; s.completedAt = now - 2.5 * H; store.save(a); store.refreshViews(); });
  await flushAll(10); (global as any).__nlog = [];
  await act(async () => { pressAlert('Trening wciąż trwa', 'Zakończ i zapisz'); }); for (let i = 0; i < 10; i++) await flushAll(50);
  expect(store.getState().active).toBeNull();
  // eslint-disable-next-line no-console
  console.log(JSON.stringify((global as any).__nlog));
  expect(staleOrphan()).toBeFalsy();
});

test('U3: warmup done but completedAt earlier than start (clock set back) -> prompt says "no sets", reminder says warmup', async () => {
  await renderApp(); const now = Date.now();
  await act(async () => { store.startEmpty(); store.addExerciseToActive(ex('Back Squat')); const a = store.getState().active!; a.startedAt = now - 3 * H; const s = a.exercises[0].sets[0]; s.kind = 'warmup'; s.warmup = true; s.weight = 40; s.reps = 5; s.done = true; s.completedAt = null; store.save(a); store.refreshViews(); });
  await flushAll(10);
  const al: any = global.__alerts.filter((x: any) => x.title === 'Trening wciąż trwa').pop();
  const n: any = (global.__notifications as any[]).filter(x => x.identifier === 'stale-reminder').pop();
  // eslint-disable-next-line no-console
  console.log(al?.msg, '|', n?.content?.body);
  expect(al.msg).toMatch(/rozgrzewka/);
});

test('U4: autoFinish on foreground while stale prompt open: buttons inert, no second prompt, reminder cancelled', async () => {
  await renderApp(); const now = Date.now();
  await act(async () => { store.startEmpty(); store.addExerciseToActive(ex('Back Squat')); const a = store.getState().active!; a.startedAt = now - 3 * H; const s = a.exercises[0].sets[0]; s.weight = 100; s.reps = 5; s.done = true; s.completedAt = now - 2.5 * H; store.save(a); store.refreshViews(); });
  await flushAll(10);
  const c0 = global.__alerts.filter((x: any) => x.title === 'Trening wciąż trwa').length; expect(c0).toBe(1);
  (global as any).__nlog = [];
  await act(async () => { jest.setSystemTime(now + 5 * H); const { AppState } = require('react-native'); AppState.currentState = 'active'; (AppState as any).emit?.('change', 'active'); });
  await act(async () => { const w = store.autoFinishStale(); expect(w).toBeTruthy(); store.refreshViews(); }); for (let i = 0; i < 5; i++) await flushAll(50);
  expect(store.getState().active).toBeNull();
  await act(async () => { pressAlert('Trening wciąż trwa', 'Zakończ i zapisz'); }); await flushAll(10);
  expect(store.getState().workouts.length).toBe(1);
  // eslint-disable-next-line no-console
  console.log(JSON.stringify((global as any).__nlog));
});

test('U5: after "Kontynuuj", un-checking the last set leaves reminder text pointing at the removed set', async () => {
  await renderApp(); const now = Date.now();
  await act(async () => { store.startEmpty(); store.addExerciseToActive(ex('Back Squat')); store.addSet(0); const a = store.getState().active!; a.startedAt = now - 3 * H;
    const [s1, s2] = a.exercises[0].sets; Object.assign(s1, { weight: 100, reps: 5, done: true, completedAt: now - 2.8 * H }); Object.assign(s2, { weight: 100, reps: 5, done: true, completedAt: now - 2.5 * H }); store.save(a); store.refreshViews(); });
  await flushAll(10); await act(async () => { pressAlert('Trening wciąż trwa', 'Kontynuuj'); }); await flushAll(10);
  await act(async () => { store.toggleDone(0, 1); }); await flushAll(10);
  const n: any = (global.__notifications as any[]).filter(x => x.identifier === 'stale-reminder').pop();
  const expected = timer.staleBody('work', now - 2.8 * H);
  // eslint-disable-next-line no-console
  console.log(n.content.body, '| expected:', expected);
  expect(n.content.body).toBe(expected);
});
