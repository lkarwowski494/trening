/* Runda 72 — testy z audytu tematycznego T4 (trwałość/porzucony trening, wymiana danych). Nazwy części testów opisują scenariusz dawnego błędu; asercje sprawdzają poprawne zachowanie. */
import * as store from '@/lib/store';
import * as timer from '@/lib/timer';
import { buildBackup, parseBackup, buildCsv } from '@/lib/backup';
import { renderApp, tap, flushAll, go, screen, act } from './app';
import { fresh, ex, addWorkout, pressAlert } from './helpers';

const notes = (id: string) => (global.__notifications as any[]).filter(x => x.identifier === id);

describe('T4b flows', () => {
  test('language switch during rest: scheduled rest + stale notifications are rescheduled in the new language', async () => {
    await renderApp();
    await act(async () => { store.startEmpty(); store.addExerciseToActive(ex('Back Squat')); }); await flushAll(10);
    await act(async () => { await timer.start(600); }); await flushAll(10); /* 05.10.2026: każde przejście ekranu w testach przesuwa zegar ~60 s — przerwa musi przetrwać dwa */
    expect(notes('rest-end').pop().content.title).toBe('Przerwa minęła');
    expect(notes('stale-reminder').pop().content.title).toBe('Trening wciąż trwa');
    await go('/more/settings'); await flushAll(10);
    await tap(screen.getByText('Język')); await flushAll(5); await tap(screen.getByText('English')); await flushAll(10); /* 05.10.2026: wybór języka na osobnej liście */ await flushAll(10);
    // pending notifications still carry the Polish text that will be shown in 2 min / 2 h
    expect(notes('rest-end').pop().content.title).toBe('Rest is over');
    expect(notes('stale-reminder').pop().content.title).not.toBe('Trening wciąż trwa');
    await act(async () => { await timer.stop(); });
  });

  test('R72 import kopii z włączonym Apple Health: prośba o zgodę na tym telefonie; bez zgody zapis wyłączony', async () => {
    await fresh(); store.getState().settings.healthSync = true; const env = JSON.stringify(buildBackup());
    await fresh();
    const hk = require('@kingstinct/react-native-healthkit').default; const avail = hk.isHealthDataAvailable;
    const req = jest.spyOn(hk, 'requestAuthorization'); hk.isHealthDataAvailable = async () => true;
    try {
      store.replaceState(parseBackup(env)); await require('@/lib/backup').recheckHealthAfterImport();
      expect(req).toHaveBeenCalled(); expect(store.getState().settings.healthSync).toBe(false); // mock: brak zgody
    } finally { req.mockRestore(); hk.isHealthDataAvailable = avail; }
  });

  test('CSV drops sets whose exercise is missing from the exercise list (import of older/partial backup)', async () => {
    await fresh();
    const raw: any = JSON.parse(JSON.stringify(store.getState()));
    const sq = raw.exercises.find((e: any) => e.name === 'Back Squat');
    raw.workouts.push({ startedAt: Date.now() - 86400e3, finishedAt: Date.now() - 86000e3, exercises: [{ exerciseId: 'gone', sets: [{ weight: 50, reps: 5, done: true }] }, { exerciseId: sq.id, sets: [{ weight: 100, reps: 5, done: true }] }] });
    store.replaceState(parseBackup(JSON.stringify(raw)));
    expect(store.getState().workouts[0].exercises).toHaveLength(2); // history keeps both blocks (shows "?")
    const rows = buildCsv().trim().split('\n');
    expect(rows).toHaveLength(3); // header + 2 sets
  });
});
