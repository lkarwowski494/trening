/*
 * lib/watch/health.ts + lib/health.ts (syncAfterFinish, retryHealth, reportWatchSession) — zapis treningu do Apple Zdrowia, gdy trening prowadził też zegarek (docs/35 rozdz. 6;
 * decyzja właściciela 13.10.2026): z zegarka, jeśli prowadził sesję (bogatsze źródło), inaczej z telefonu; bez duplikatów.
 */
import * as store from '@/lib/store';
import * as health from '@/lib/health';
import { watchHealthPlan } from '@/lib/watch/health';
import { WATCH } from '@/lib/watch/protocol';
import { fresh, ex, saved } from './helpers';

const NOW = Date.UTC(2026, 9, 13, 18);
const S = () => store.getState();
const hk = () => require('@kingstinct/react-native-healthkit').default;
beforeEach(async () => { jest.useFakeTimers({ now: NOW }); await fresh(); });
afterEach(() => { jest.restoreAllMocks(); jest.useRealTimers(); });
const finishOne = (watch?: { client: 'apple' | 'garmin'; startedAt: number; endedAt?: number; saved?: boolean }) => {
  store.startEmpty(); store.addExerciseToActive(ex('Back Squat')); const s = S().active!.exercises[0].sets[0]; s.weight = 100; s.reps = 5; store.toggleDone(0, 0);
  if (watch) S().active!.watch = watch; return store.finishWorkout()!;
};
const W = { client: 'apple' as const, startedAt: NOW - 3600e3 };

describe('watchHealthPlan (czysta decyzja)', () => {
  const fin = NOW;
  test.each([
    ['bez sesji zegarka', undefined, NOW, 'phone', 'no-session'],
    ['sesja zakończona i zapisana przez zegarek', { ...W, endedAt: NOW - 1000, saved: true }, NOW, 'watch', 'saved-by-watch'],
    ['sesja zakończona, zegarek nie zapisał', { ...W, endedAt: NOW - 1000, saved: false }, NOW, 'phone', 'not-saved'],
    ['sesja zakończona bez pola saved', { ...W, endedAt: NOW - 1000 }, NOW, 'phone', 'not-saved'],
    ['sesja trwa, raportu jeszcze nie ma (w czasie oczekiwania)', W, NOW + WATCH.HEALTH_WAIT_SEC * 1000 - 1, 'wait', 'waiting'],
    ['sesja trwa, brak raportu po czasie oczekiwania', W, NOW + WATCH.HEALTH_WAIT_SEC * 1000, 'phone', 'timeout'],
  ] as const)('%s → %s', (_n, watch, now, writer, reason) => { expect(watchHealthPlan({ watch: watch as never, finishedAt: fin }, now)).toEqual({ writer, reason }); });
  test('trening bez godziny końca: czekamy (nie ma od czego liczyć czasu)', () => { expect(watchHealthPlan({ watch: W, finishedAt: null }, NOW)).toEqual({ writer: 'wait', reason: 'waiting' }); });
});

describe('syncAfterFinish / retryHealth z zegarkiem', () => {
  test('bez sesji zegarka: zapis z telefonu jak dotąd', async () => {
    S().settings.healthSync = true; const sv = jest.spyOn(hk(), 'saveWorkoutSample').mockImplementation(async () => (global as any).__hkProxy('u1'));
    const w = finishOne(); await health.syncAfterFinish(w); expect(sv).toHaveBeenCalledTimes(1); expect(w.healthUUID).toBe('u1');
  });
  test('zegarek zapisał (sessionEnded saved): telefon NIE zapisuje, trening dostaje znacznik „watch” i traci pole watch', async () => {
    S().settings.healthSync = true; const sv = jest.spyOn(hk(), 'saveWorkoutSample').mockImplementation(async () => (global as any).__hkProxy('u1'));
    const w = finishOne({ ...W, endedAt: NOW - 1000, saved: true }); await health.syncAfterFinish(w);
    expect(sv).not.toHaveBeenCalled(); expect([w.healthUUID, w.healthPending, w.watch]).toEqual(['watch', undefined, undefined]); expect(health.healthPending()).toEqual([]);
  });
  test('zegarek jeszcze nie odpowiedział: telefon czeka (znacznik zostaje), po czasie oczekiwania zapisuje sam (retryHealth)', async () => {
    S().settings.healthSync = true; const sv = jest.spyOn(hk(), 'saveWorkoutSample').mockImplementation(async () => (global as any).__hkProxy('u1'));
    const w = finishOne(W); await health.syncAfterFinish(w); expect(sv).not.toHaveBeenCalled(); expect(w.healthPending).toBe(true);
    expect(await health.retryHealth()).toBe(0); expect(sv).not.toHaveBeenCalled();
    jest.setSystemTime(NOW + (WATCH.HEALTH_WAIT_SEC + 1) * 1000); await jest.advanceTimersByTimeAsync(0);
    expect(await health.retryHealth()).toBe(1); expect(sv).toHaveBeenCalledTimes(1); expect([w.healthUUID, w.watch]).toEqual(['u1', undefined]);
  });
  test('samo wywołanie syncAfterFinish planuje ponowienie po czasie oczekiwania (bez udziału użytkownika)', async () => {
    S().settings.healthSync = true; const sv = jest.spyOn(hk(), 'saveWorkoutSample').mockImplementation(async () => (global as any).__hkProxy('u2'));
    const w = finishOne(W); await health.syncAfterFinish(w); expect(sv).not.toHaveBeenCalled();
    jest.setSystemTime(NOW + (WATCH.HEALTH_WAIT_SEC + 2) * 1000); await jest.advanceTimersByTimeAsync((WATCH.HEALTH_WAIT_SEC + 2) * 1000); await Promise.resolve(); await Promise.resolve();
    expect(sv).toHaveBeenCalledTimes(1); expect(w.healthUUID).toBe('u2');
  });
  test('zegarek zakończył sesję bez zapisu: telefon zapisuje', async () => {
    S().settings.healthSync = true; const sv = jest.spyOn(hk(), 'saveWorkoutSample').mockImplementation(async () => (global as any).__hkProxy('u3'));
    const w = finishOne({ ...W, endedAt: NOW, saved: false }); await health.syncAfterFinish(w); expect(sv).toHaveBeenCalledTimes(1); expect(w.healthUUID).toBe('u3');
  });
  test('synchronizacja wyłączona: nic się nie dzieje, sesja zegarka sprzątana przez migrate (brak healthPending)', async () => {
    const sv = jest.spyOn(hk(), 'saveWorkoutSample'); const w = finishOne(W); await health.syncAfterFinish(w); expect(sv).not.toHaveBeenCalled();
    await store.flush(); await fresh(JSON.parse(JSON.stringify(saved()))); expect(S().workouts[0].watch).toBeUndefined();
  });
});

describe('reportWatchSession (raport po zakończeniu treningu)', () => {
  test('saved=true → znacznik „watch”; saved=false → ponowienie zapisu z telefonu; nie dotyka treningu bez sesji ani już rozstrzygniętego', async () => {
    S().settings.healthSync = true; const sv = jest.spyOn(hk(), 'saveWorkoutSample').mockImplementation(async () => (global as any).__hkProxy('p1'));
    const a = finishOne(W); a.healthPending = true; expect(health.reportWatchSession(a, NOW, true)).toBe(true); expect(a.healthUUID).toBe('watch'); expect(sv).not.toHaveBeenCalled();
    expect(health.reportWatchSession(a, NOW, true)).toBe(false);
    S().active = null; const b = finishOne(W); b.healthPending = true; expect(health.reportWatchSession(b, NOW, false)).toBe(true); await jest.advanceTimersByTimeAsync(0); await Promise.resolve();
    expect(b.watch).toBeUndefined(); expect(sv).toHaveBeenCalledTimes(1); expect(b.healthUUID).toBe('p1');
    S().active = null; const c = finishOne(); expect(health.reportWatchSession(c, NOW, true)).toBe(false);
  });
});

describe('dane: migracja pól zegarka', () => {
  test('sesja zegarka zostaje tylko w treningu czekającym na Zdrowie; reszta czyszczona; złe wartości odrzucone; migrate idempotentne', async () => {
    S().settings.healthSync = true; const w = finishOne({ ...W, endedAt: NOW - 1000 }); w.healthPending = true; store.save(w); await store.flush();
    const disk = JSON.parse(JSON.stringify(saved())); disk.workouts[0].watch = { client: 'pebble', startedAt: 5 }; await fresh(disk); expect(S().workouts[0].watch).toBeUndefined();
    disk.workouts[0].watch = { client: 'garmin', startedAt: 7, endedAt: 'x', saved: 'tak' }; await fresh(disk); expect(S().workouts[0].watch).toEqual({ client: 'garmin', startedAt: 7 });
    disk.workouts[0].healthUUID = 'u'; await fresh(disk); expect(S().workouts[0].watch).toBeUndefined();
    const again = store.migrate(JSON.parse(JSON.stringify(S()))); expect(JSON.stringify(again)).toBe(JSON.stringify(store.migrate(JSON.parse(JSON.stringify(again)))));
  });
});
