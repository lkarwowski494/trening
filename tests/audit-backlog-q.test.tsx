/* Runda 74 — niskie z backlogu (Q-…) naprawione bez decyzji projektowych; każde z testem. */
import * as store from '@/lib/store';
import * as stats from '@/lib/stats';
import * as timer from '@/lib/timer';
import { fresh, ex, addWorkout } from './helpers';
import { renderApp, flushAll, act } from './app';
import { AppState } from 'react-native';

jest.setTimeout(30000);
const H = 3600e3;
afterEach(async () => { jest.restoreAllMocks(); try { store.getState(); } catch { return; } await timer.stop(); await timer.stopSet(); });

describe('Q-005 / Q-008 — maksima informacyjne', () => {
  test('Q-005: drop set nie jest „max powtórzeń w serii” (rekord, wykres)', async () => {
    await fresh(); const at = new Date(2026, 8, 1, 18).getTime();
    addWorkout(at, [['Bench Press (sztanga)', [{ weight: 100, reps: 6 }, { weight: 50, reps: 20, kind: 'drop' }]]]); store.save();
    const e = ex('Bench Press (sztanga)');
    expect(stats.recordsFor(e).maxReps).toBe(6); expect(stats.sessionsFor(e)[0].maxReps).toBe(6);
  });
  test('Q-005 (audyt 74): także „max powtórzeń bez asysty” nie liczy drop setu', async () => {
    await fresh(); addWorkout(new Date(2026, 8, 1, 18).getTime(), [['Pull Up', [{ reps: 6, addKg: 20 }, { reps: 15, kind: 'drop' }]]]); store.save();
    const r = stats.recordsFor(ex('Pull Up')); expect([r.maxReps, r.maxRepsFree]).toEqual([6, 6]);
  });
  test('Q-008: seria z gumą bez wpisanych kg nie rysuje się na „max ±” jako ±0; z wpisaną asystą — tak', async () => {
    await fresh(); const band = store.getState().bands[0].id; const day = (d: number) => new Date(2026, 8, d, 18).getTime();
    addWorkout(day(1), [['Pull Up', [{ reps: 8, bandId: band }]]]);
    addWorkout(day(2), [['Pull Up', [{ reps: 8, bandId: band, addKg: -15 }]]]);
    addWorkout(day(3), [['Pull Up', [{ reps: 5 }]]]); store.save();
    const ss = stats.sessionsFor(ex('Pull Up'));
    expect(ss.map(s => [s.hasLoad, s.maxLoad])).toEqual([[false, 0], [true, -15], [true, 0]]);
  });
});

describe('Q-010 / Q-011 — porzucony trening', () => {
  test('Q-010: ponowny pomiar serii czasowej to aktywność — pytanie liczy 2 h od niego, nie od pierwszego odhaczenia', async () => {
    await renderApp();
    await act(async () => { store.startEmpty(); store.addExerciseToActive(ex('Plank')); const a = store.getState().active!; a.exercises[0].sets[0].durationSec = 45; store.save(a); store.toggleDone(0, 0); }); await flushAll(10);
    await act(async () => { jest.advanceTimersByTime(1.5 * H); }); await flushAll(10);
    const id = store.getState().active!.exercises[0].sets[0].id;
    await act(async () => { await timer.startSet(id, 60); }); await flushAll(10);
    await flushAll(61e3); await flushAll(1000); /* ekran domyka pomiar po celu */
    expect(timer.S.on).toBe(false); expect(store.getState().active!.exercises[0].sets[0].durationSec).toBe(60);
    await flushAll(1 * H); /* 2,5 h po odhaczeniu, ~1 h po pomiarze */
    expect(store.staleSince()).toBeNull(); expect((global as any).__alerts.some((x: any) => /Trening wciąż trwa/.test(x.title ?? x[0] ?? ''))).toBe(false);
    await flushAll(1.1 * H);
    expect(store.staleSince()).not.toBeNull();
  });
  test('Q-011: cichy zapis po 6 h nie zostawia w zapisie stopera bez celu', async () => {
    let now = new Date(2026, 8, 1, 10).getTime(); jest.spyOn(Date, 'now').mockImplementation(() => now);
    await fresh(); store.startEmpty(); store.addExerciseToActive(ex('Plank')); store.addExerciseToActive(ex('Bench Press (sztanga)'));
    const a = store.getState().active!; Object.assign(a.exercises[1].sets[0], { weight: 100, reps: 5 }); store.save(a); store.toggleDone(1, 0);
    now += 60e3; await timer.startSet(a.exercises[0].sets[0].id, 0);
    now += 7 * H; const w = store.autoFinishStale(now);
    expect(w).toBeTruthy(); expect(store.getState().timer.setStartAt).toBeNull(); expect(store.getState().timer.setId).toBeNull();
  });
  test('Q-011: także gdy trening czeka na decyzję (sama rozgrzewka) — stoper bez celu znika z zapisu, trening zostaje', async () => {
    let now = new Date(2026, 8, 1, 10).getTime(); jest.spyOn(Date, 'now').mockImplementation(() => now);
    await fresh(); store.startEmpty(); store.addExerciseToActive(ex('Plank'));
    const a = store.getState().active!; a.exercises[0].sets[0].kind = 'warmup'; a.exercises[0].sets[0].warmup = true; a.exercises[0].sets[0].durationSec = 30; store.save(a); store.toggleDone(0, 0);
    now += 60e3; await timer.startSet(a.exercises[0].sets[0].id, 0);
    now += 7 * H; expect(store.autoFinishStale(now)).toBeNull();
    expect(store.getState().active).toBeTruthy(); expect(store.getState().timer.setStartAt).toBeNull();
  });
  test('Q-011 (audyt 74): powrót z tła po 6 h przy samej rozgrzewce — stoper bez celu zatrzymany także w pamięci (nie zapisze 7 h)', async () => {
    const handlers: any[] = []; jest.spyOn(AppState, 'addEventListener').mockImplementation(((ev: string, cb: any) => { if (ev === 'change') handlers.push(cb); return { remove: () => {} }; }) as any);
    await renderApp();
    await act(async () => { store.startEmpty(); store.addExerciseToActive(ex('Plank')); const a = store.getState().active!; a.exercises[0].sets[0].kind = 'warmup'; a.exercises[0].sets[0].durationSec = 30; store.save(a); store.toggleDone(0, 0); store.addSet(0); }); await flushAll(10);
    const id = store.getState().active!.exercises[0].sets[1].id;
    await act(async () => { await timer.startSet(id, 0); }); await flushAll(10); expect(timer.S.on).toBe(true);
    await act(async () => { jest.advanceTimersByTime(7 * H); handlers.forEach(h => h('active')); }); await flushAll(10);
    expect(store.getState().active).toBeTruthy(); expect(timer.S.on).toBe(false); expect(store.getState().active!.exercises[0].sets[1].done).toBe(false);
  });
});

describe('Q-007 (runda 75)', () => {
  test('plik CSV zaczyna się od BOM (Excel), a treść to dokładnie buildCsv()', async () => {
    await fresh(); addWorkout(new Date(2026, 8, 1, 18).getTime(), [['Back Squat', [{ weight: 100, reps: 5, note: 'łatwo, żółw' }]]]); store.save();
    const FS = require('expo-file-system'); const backup = require('@/lib/backup'); (FS.writeAsStringAsync as jest.Mock).mockClear();
    await backup.exportCsv(); const [path, text] = (FS.writeAsStringAsync as jest.Mock).mock.calls[0];
    expect(path).toMatch(/\.csv$/); expect(text.charCodeAt(0)).toBe(0xFEFF); expect(text.slice(1)).toBe(backup.buildCsv()); expect(text).toContain('żółw');
  });
});
