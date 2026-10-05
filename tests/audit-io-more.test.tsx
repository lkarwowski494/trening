/* Runda 72 — testy z audytu tematycznego T4 (trwałość/porzucony trening, wymiana danych). Nazwy części testów opisują scenariusz dawnego błędu; asercje sprawdzają poprawne zachowanie. */
import * as store from '@/lib/store';
import * as timer from '@/lib/timer';
import { buildBackup, buildCsv } from '@/lib/backup';
import { renderApp, tap, flushAll, go, screen, act } from './app';
import { fresh, ex, addWorkout, pressAlert } from './helpers';

describe('T4b more', () => {
  test('CSV Weight column after equipment change keeps logged load', async () => {
    await fresh();
    const e = store.newExercise('Dips X'); // 'inne' → weight field
    addWorkout(Date.now() - 86400e3, [['Dips X', [{ weight: 20, reps: 8 }]]]);
    store.setEquipment(e, 'masa ciała'); // later the user marks it as bodyweight
    const row = buildCsv().trim().split('\n')[1];
    expect(row.split(',')[5]).toBe('20');
  });

  test('stale reminder cancelled after import of backup without active workout', async () => {
    const spy = jest.spyOn(timer, 'cancelStaleReminder');
    await fresh(); const env = JSON.stringify(buildBackup());
    await renderApp();
    await act(async () => { store.startEmpty(); store.addExerciseToActive(ex('Back Squat')); }); await flushAll(10);
    const FS = require('expo-file-system/legacy'); const DP = require('expo-document-picker');
    FS.readAsStringAsync.mockImplementationOnce(async () => env); DP.getDocumentAsync.mockImplementationOnce(async () => ({ canceled: false, assets: [{ uri: 'file:///x.json' }] }));
    await go('/more/backup'); await flushAll(10);
    spy.mockClear();
    await tap(screen.getByText('Importuj backup')); await act(async () => { pressAlert('Nadpisać dane?', 'Importuj'); }); await flushAll(50); await flushAll(50);
    expect(store.getState().active).toBeNull();
    expect(spy).toHaveBeenCalled(); expect(timer.T.on).toBe(false);
    spy.mockRestore();
  });

  test('stale reminder cancelled after "clear all data"', async () => {
    const spy = jest.spyOn(timer, 'cancelStaleReminder');
    await renderApp();
    await act(async () => { store.startEmpty(); store.addExerciseToActive(ex('Back Squat')); }); await flushAll(10);
    await go('/more/settings'); await flushAll(10); spy.mockClear();
    await tap(screen.getByText('Wyczyść wszystkie dane')); await act(async () => { pressAlert('Na pewno?', 'Wyczyść'); }); await flushAll(50);
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });

  test('stale reminder text after language switch', async () => {
    await renderApp();
    await act(async () => { store.startEmpty(); store.addExerciseToActive(ex('Back Squat')); }); await flushAll(10);
    await go('/more/settings'); await flushAll(10);
    await tap(screen.getByText('Język')); await flushAll(5); await tap(screen.getByText('English')); await flushAll(10); /* 05.10.2026: wybór języka na osobnej liście */ await flushAll(10);
    const n = (global.__notifications as any[]).filter(x => x.identifier === 'stale-reminder').pop();
    expect(n.content.title).toBe('Workout still in progress');
  });
});

describe('T4b health dup', () => {
  test('R72 przywrócenie kopii sprzed zapisu do Zdrowia: zapis z identyfikatorem synchronizacji (bez duplikatu w HealthKit)', async () => {
    const { parseBackup } = require('@/lib/backup'); const health = require('@/lib/health');
    const hk = require('@kingstinct/react-native-healthkit').default; let n = 0;
    const sv = jest.spyOn(hk, 'saveWorkoutSample').mockImplementation(async () => 'uuid-' + (++n));
    await fresh(); store.getState().settings.healthSync = true;
    store.startEmpty(); store.addExerciseToActive(ex('Back Squat')); const s = store.getState().active!.exercises[0].sets[0]; s.weight = 100; s.reps = 5; store.toggleDone(0, 0);
    const id = store.getState().active!.id;
    const env = JSON.stringify(buildBackup()); // backup taken during the workout
    await health.syncAfterFinish(store.finishWorkout()!); expect(sv).toHaveBeenCalledTimes(1);
    store.replaceState(parseBackup(env)); // later: restore (reinstall / new phone)
    const w2 = store.finishWorkout()!; expect(w2.id).toBe(id);
    await health.syncAfterFinish(w2);
    // R72: aplikacja nie wie, że trening już jest w Zdrowiu (kopia sprzed zapisu) — identyfikator synchronizacji pozwala HealthKit odrzucić duplikat.
    expect(sv).toHaveBeenCalledTimes(2); for (const c of sv.mock.calls as any[]) { expect(c[3].metadata.HKMetadataKeySyncIdentifier).toBe(id); expect(c[3].metadata.HKMetadataKeySyncVersion).toBe(1); }
    sv.mockRestore();
  });
});

test('recovery copy (state + live) cannot be imported back', async () => {
  await fresh(); store.startEmpty(); store.save(store.getState().active); await store.flush();
  const st = JSON.parse(global.__kv.get('state')!); st.exercises = { broken: true }; global.__kv.set('state', JSON.stringify(st)); // valid JSON, migrate() rejects (e.g. bug in an older build)
  store.__resetForTests(); await store.init();
  const txt = (await store.readRecovery())!;
  const fixed = JSON.parse(global.__kv.get(store.getRecovery()!.key)!); fixed.exercises = []; // user fixes the field by hand…
  const { parseBackup } = require('@/lib/backup');
  expect(() => parseBackup(txt.replace(/"exercises":\{"broken":true\}/, '"exercises":[]'))).not.toThrow(); // …but the shared file has the live block appended → not JSON
});
