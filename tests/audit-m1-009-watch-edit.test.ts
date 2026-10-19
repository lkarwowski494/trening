/* Audyt M1 z 19.10.2026, partia 1 — M1-audytor-generalny-009 (edycja treningu czekającego na raport zegarka). Czerwone na commicie 8273448, zielone po poprawce. */
import * as store from '@/lib/store';
import * as health from '@/lib/health';
import { WATCH } from '@/lib/watch/protocol';
import { fresh, ex } from './helpers';

jest.setTimeout(30000);

describe('M1-009: edycja treningu czekającego na raport zegarka nie gubi sesji zegarka', () => {
  const NOW = Date.UTC(2026, 9, 13, 18); const W = { client: 'apple' as const, startedAt: NOW - 3600e3 };
  const hk = () => require('@kingstinct/react-native-healthkit').default;
  beforeEach(() => { jest.useFakeTimers({ now: NOW }); });
  afterEach(() => { jest.restoreAllMocks(); jest.useRealTimers(); });
  test('putHistoryWorkout (edycja) zachowuje watch i healthPending; raport zegarka „zapisano” ustawia znacznik „watch”, telefon nie zapisuje kopii', async () => {
    await fresh(); const st = () => store.getState(); st().settings.healthSync = true;
    const sv = jest.spyOn(hk(), 'saveWorkoutSample').mockImplementation(async () => (global as any).__hkProxy('u1'));
    store.startEmpty(); store.addExerciseToActive(ex('Back Squat')); const s = st().active!.exercises[0].sets[0]; s.weight = 100; s.reps = 5; store.toggleDone(0, 0); st().active!.watch = W;
    const w = store.finishWorkout()!; await health.syncAfterFinish(w);
    expect(w.healthPending).toBe(true); expect(w.watch).toEqual(W); expect(sv).not.toHaveBeenCalled();
    /* edycja w historii (jak lib/edit.ts commitDraft: szkic to głęboka kopia zapisanego treningu) */
    const draft = JSON.parse(JSON.stringify(st().workouts.find(x => x.id === w.id))); draft.note = 'po edycji';
    expect(store.putHistoryWorkout(draft, w.id)).toBe(true);
    const cur = st().workouts.find(x => x.id === w.id)!; expect(cur.note).toBe('po edycji');
    expect(cur.watch).toEqual(W); expect(cur.healthPending).toBe(true);
    expect(health.reportWatchSession(cur, NOW - 1000, true)).toBe(true);
    expect([cur.healthUUID, cur.healthPending, cur.watch]).toEqual(['watch', undefined, undefined]);
    jest.setSystemTime(NOW + (WATCH.HEALTH_WAIT_SEC + 1) * 1000); expect(await health.retryHealth()).toBe(0); expect(sv).not.toHaveBeenCalled(); /* bez dubla w Zdrowiu */
  });
  test('edycja treningu bez sesji zegarka nie dopisuje watch ani healthPending; po zapisie w Zdrowiu (healthUUID) nie wraca znacznik', async () => {
    await fresh(); const st = () => store.getState();
    store.startEmpty(); store.addExerciseToActive(ex('Back Squat')); const s = st().active!.exercises[0].sets[0]; s.weight = 100; s.reps = 5; store.toggleDone(0, 0);
    const w = store.finishWorkout()!; const draft = JSON.parse(JSON.stringify(w)); draft.healthPending = true; draft.watch = W; /* szkic ze starym znacznikiem */
    w.healthUUID = 'u9'; /* zapis do Zdrowia skończył się w trakcie edycji */
    store.putHistoryWorkout(draft, w.id); const cur = st().workouts.find(x => x.id === w.id)!;
    expect([cur.healthUUID, cur.healthPending, cur.watch]).toEqual(['u9', undefined, undefined]);
  });
});

