/* 0.14.0 (gałąź f014-bledy): logika funkcji dodanych przy naprawach backlogu — timedLabel (Q-004), relocalize / refreshStale (Q-004), whenText / noClock (import bez godzin),
 * restampUntouched z parametrem `all` (T-057). Testy ekranów i scenariuszy tych samych zmian: tests/regress.test.tsx, tests/integration-090.test.tsx. */
import * as store from '@/lib/store';
import * as timer from '@/lib/timer';
import { timedLabel, restLabel } from '@/lib/live';
import { applyLang } from '@/lib/i18n';
import { fresh, ex, addWorkout } from './helpers';
import { userHome } from './locations-fixtures';

jest.setTimeout(30000);
afterEach(async () => { applyLang('pl'); try { store.getState(); } catch { return; } await timer.stop(); await timer.stopSet(); });
const at = (y: number, m: number, d: number, h = 18) => new Date(y, m - 1, d, h).getTime();

describe('live.timedLabel (Q-004)', () => {
  test('jeden blok: „nazwa · seria n”; dwa bloki tego samego ćwiczenia: „nazwa (k) · seria n”; brak bloku: pusty tekst; język z t()', async () => {
    await fresh(); store.startEmpty(); store.addExerciseToActive(ex('Plank')); const a = store.getState().active!;
    expect(timedLabel(a, 0, 0)).toBe('Plank · seria 1'); expect(timedLabel(a, 5, 0)).toBe('');
    store.addExerciseToActive(ex('Plank')); expect([timedLabel(a, 0, 0), timedLabel(a, 1, 0)]).toEqual(['Plank (1) · seria 1', 'Plank (2) · seria 1']);
    applyLang('en'); expect(timedLabel(a, 1, 0)).toBe('Plank (2) · set 1');
  });
});

describe('timer.relocalize / timer.refreshStale (Q-004)', () => {
  test('bez treningu w toku i bez timerów: nic nie robią (bez wyjątku, bez Live Activity i powiadomień)', async () => {
    await fresh(); global.__la.length = 0; global.__notifications.length = 0;
    await timer.relocalize(); await timer.refreshStale(); expect(global.__la).toEqual([]); expect((global.__notifications as any[]).filter(n => n.identifier === 'stale-reminder')).toEqual([]);
  });
  test('trwająca przerwa: relocalize przelicza podpis (T.sub, labels) w bieżącym języku i startuje Live Activity z tym samym końcem; refreshStale planuje przypomnienie', async () => {
    await fresh(); store.startEmpty(); store.addExerciseToActive(ex('Back Squat')); store.addExerciseToActive(ex('Pull Up'));
    const a = store.getState().active!; const sid = a.exercises[0].sets[0].id; store.toggleDone(0, 0);
    const lb = restLabel(a, 0, 0); timer.labels.title = 'Trening'; timer.labels.subtitle = lb.sub; timer.labels.last = lb.last; await timer.start(90, sid);
    expect(timer.T.sub).toBe('dalej: Pull Up, masa ciała'); /* 0.20: restCue */ const end = timer.T.endAt; applyLang('en'); global.__la.length = 0; global.__notifications.length = 0;
    await timer.relocalize();
    expect(timer.T.sub).toBe('next: Pull Up, body weight'); expect(timer.labels.subtitle).toBe('next: Pull Up, body weight');
    expect((global.__la as any[][]).map(x => [x[0], x[2], x[3], x[5]])).toEqual([['start', 'next: Pull Up, body weight', end, 'rest|Rest']]);
    const st = (global.__notifications as any[]).filter(n => n.identifier === 'stale-reminder'); expect(st).toHaveLength(1); expect(st[0].content.title).toBe('Workout still in progress');
    global.__notifications.length = 0; await timer.refreshStale(); expect((global.__notifications as any[]).filter(n => n.identifier === 'stale-reminder')).toHaveLength(1);
  });
  test('przerwa po czasie (alarm): relocalize nie wskrzesza Live Activity', async () => {
    await fresh(); store.startEmpty(); store.addExerciseToActive(ex('Back Squat')); const sid = store.getState().active!.exercises[0].sets[0].id; await timer.start(60, sid);
    timer.T.alarmed = true; global.__la.length = 0; await timer.relocalize(); expect((global.__la as any[][]).filter(x => x[0] === 'start')).toEqual([]);
  });
});

describe('store.noClock / store.whenText (import bez godzin)', () => {
  test('noClock: koniec równy startowi; zwykła sesja i trening w toku — nie; whenText: bez godziny tylko dla noClock', async () => {
    await fresh(); const w = addWorkout(at(2026, 3, 2, 12), [['Back Squat', [{ weight: 100, reps: 5 }]]], 'A');
    expect(store.noClock(w)).toBe(false); expect(store.whenText(w)).toBe(`${store.fmtDate(w.startedAt)} ${store.fmtTime(w.startedAt)}`);
    w.finishedAt = w.startedAt; expect(store.noClock(w)).toBe(true); expect(store.whenText(w)).toBe(store.fmtDate(w.startedAt)); expect(store.whenText(w)).not.toMatch(/12:00/);
    w.finishedAt = null; expect(store.noClock(w)).toBe(false);
  });
});

describe('store.restampUntouched (T-057, parametr all)', () => {
  test('bez all: blok z odhaczoną serią zostaje przy dawnym przyrządzie; z all: przyrządy wszystkich bloków liczone od nowa wg miejsca treningu', async () => {
    await fresh(); const s = store.getState().settings; const home = userHome([2, 4, 6, 8, 10, 12]); s.locations.push(home); s.mainLocationId = home.id;
    const gym = require('@/lib/locations').addLocation('gym', 'Siłownia'); const db = ex('Bench Press (hantle)');
    const w = addWorkout(at(2026, 3, 2), [['Bench Press (hantle)', [{ weight: 10, reps: 8 }]]], 'Dom'); w.locationId = home.id; w.exercises[0].impl = 'electric' as any; store.save();
    w.locationId = gym.id; expect(store.restampUntouched(w)).toBe(false); expect(w.exercises[0].impl).toBe('electric');
    const want = store.implAtLoc(db, gym.id); expect(store.restampUntouched(w, true)).toBe(want !== 'electric'); expect(w.exercises[0].impl).toBe(want);
    w.locationId = undefined; store.restampUntouched(w, true); expect(w.exercises[0].impl).toBeUndefined();
  });
});
