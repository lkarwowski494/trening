/* E2 (docs/14 pkt 2, testy 23 i 25 z pkt 7) — schemat 16: sanityzacja pól zamiany (M1–M4), kopia i restart w trakcie treningu po podziale.
 * Test 24 (idempotencja) — generatory w tests/migrate-idem.test.ts; test 26 (niezmienniki) — tests/invariants.test.ts. */
import * as store from '@/lib/store';
import { buildBackup, parseBackup } from '@/lib/backup';
import { SCHEMA_VERSION, seedState } from '@/lib/seed';
import { fresh, ex, addWorkout, saved } from './helpers';

const H = Date.UTC(2026, 8, 10, 10);
const blockOf = (o: Record<string, unknown>) => ({ id: 'b1', exerciseId: 'E', restSec: 90, repMin: null, repMax: null, groupId: null, sets: [{ id: 's1', weight: 10, reps: 5, done: true, kind: 'normal' }], ...o });

describe('schemat 16 — migracja pól zamiany', () => {
  test('M1–M7: śmieci z importu w swappedFrom/implPinned/splitFrom/altSkip/alternates — poprawione albo usunięte; historia bez splitFrom i altSkip', async () => {
    await fresh(); const raw: any = seedState('pl'); const E = raw.exercises[0].id; raw.schemaVersion = 15;
    raw.workouts = [{ id: 'w1', startedAt: H, finishedAt: H + 1, exercises: [
      blockOf({ id: 'h1', exerciseId: E, swappedFrom: 42, implPinned: true, impl: 'dumbbell', splitFrom: 'x', altSkip: true }),
      blockOf({ id: 'h2', exerciseId: E, swappedFrom: E, implPinned: true /* bez impl */ }),
      blockOf({ id: 'h3', exerciseId: E, swappedFrom: {}, implPinned: 'true', impl: 'dumbbell' }),
    ] }];
    raw.active = { id: 'a1', startedAt: H, exercises: [
      blockOf({ id: 'a1', exerciseId: E, swappedFrom: 'S', splitFrom: 7, altSkip: true, implPinned: true, impl: 'zz' }),
      blockOf({ id: 'a2', exerciseId: E, splitFrom: '', altSkip: 'yes' }),
    ] };
    const m = store.migrate(JSON.parse(JSON.stringify(raw)));
    const [h1, h2, h3] = m.workouts[0].exercises; const [a1, a2] = m.active!.exercises;
    expect(h1).toMatchObject({ swappedFrom: '42', implPinned: true, impl: 'dumbbell' }); expect(h1.splitFrom).toBeUndefined(); expect(h1.altSkip).toBeUndefined();
    expect('swappedFrom' in h2).toBe(false); expect('implPinned' in h2).toBe(false); /* równe exerciseId; przypięcie bez znanego przyrządu */
    expect('swappedFrom' in h3).toBe(false); expect('implPinned' in h3).toBe(false);
    expect(a1).toMatchObject({ swappedFrom: 'S', splitFrom: '7', altSkip: true }); expect('implPinned' in a1).toBe(false); expect('impl' in a1).toBe(false);
    expect('splitFrom' in a2).toBe(false); expect('altSkip' in a2).toBe(false);
    expect(m.schemaVersion).toBe(16);
    /* blok bez zamiany wygląda bit w bit jak w schemacie 15 */
    expect(Object.keys(m.workouts[0].exercises[0]).filter(k => !['swappedFrom', 'implPinned', 'impl'].includes(k)).sort()).toEqual(['exerciseId', 'groupId', 'id', 'repMax', 'repMin', 'restSec', 'sets']);
  });

  test('eksport → import 1:1 z nowymi polami; restart w trakcie treningu po podziale (klucz „live”) zachowuje splitFrom; kopia 16 odrzucona przez wersję 15 (symulacja SCHEMA_VERSION)', async () => {
    await fresh(); store.startEmpty(); store.addExerciseToActive(ex('Bench Press (sztanga)')); const a = store.getState().active!;
    a.exercises[0].sets = [{ ...store.emptySet(), weight: 100, reps: 5 }, store.emptySet()]; store.toggleDone(0, 0);
    store.swapBlock(a.exercises[0].id, ex('Bench Press (hantle)').id); await store.flush();
    const live = saved().active!; expect(live.exercises[1].splitFrom).toBe(a.exercises[0].id); expect(live.exercises[1].swappedFrom).toBe(ex('Bench Press (sztanga)').id);
    /* restart: trening w toku z klucza „live” */
    const st2 = await fresh(saved()); expect(st2.active!.exercises[1].splitFrom).toBe(st2.active!.exercises[0].id); expect(st2.active!.exercises[1].swappedFrom).toBe(ex('Bench Press (sztanga)').id);
    /* eksport → import */
    const env = JSON.parse(JSON.stringify(buildBackup())); expect(env.schemaVersion).toBe(16);
    const back = parseBackup(JSON.stringify(env)); expect(back.active!.exercises).toEqual(st2.active!.exercises);
    /* historia po „Zakończ”: bez splitFrom, z swappedFrom */
    store.toggleDone(1, 0); const w = store.finishWorkout()!; expect(w.exercises[1].splitFrom).toBeUndefined(); expect(w.exercises[1].swappedFrom).toBe(ex('Bench Press (sztanga)').id);
    const env2 = JSON.stringify(buildBackup()); expect(parseBackup(env2).workouts.at(-1)!.exercises[1].swappedFrom).toBe(ex('Bench Press (sztanga)').id);
    /* wersja 15 odrzuca kopię 16 (pkt 2.4) */
    let err = '';
    jest.isolateModules(() => { jest.doMock('@/lib/seed', () => ({ ...jest.requireActual('@/lib/seed'), SCHEMA_VERSION: 15 }));
      const old = require('@/lib/backup'); try { old.parseBackup(env2); } catch (e) { err = (e as Error).message; } });
    expect(err).toMatch(/16.*15/); expect(SCHEMA_VERSION).toBe(16);
  });

  test('putHistoryWorkout (edytor historii) usuwa splitFrom i altSkip — historia = to samo, co zwraca migracja', async () => {
    await fresh(); const w = addWorkout(H, [['Bench Press (hantle)', [{ weight: 20, reps: 10 }]]]);
    const c = JSON.parse(JSON.stringify(w)); c.exercises[0].splitFrom = 'x'; c.exercises[0].altSkip = true; c.exercises[0].swappedFrom = ex('Bench Press (sztanga)').id;
    store.putHistoryWorkout(c, w.id); const got = store.getState().workouts.find(x => x.id === w.id)!.exercises[0];
    expect(got.splitFrom).toBeUndefined(); expect(got.altSkip).toBeUndefined(); expect(got.swappedFrom).toBe(ex('Bench Press (sztanga)').id);
    expect(store.migrate(JSON.parse(JSON.stringify(store.getState()))).workouts.find(x => x.id === w.id)!.exercises[0]).toEqual(JSON.parse(JSON.stringify(got)));
  });
});
