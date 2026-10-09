/*
 * Backlog audytu kontrolnego 1 (09.10.2026), obszary DAT/LOG/X/LIVE — testy regresji na ekranach (0.10.1). Każdy test odtwarza dowód audytora
 * (raporty audytu kontrolnego 1, docs/25 „Audyt kontrolny 1”) i sprawdza poprawne zachowanie. Logika: tests/backlog-0.10.1-dane.test.ts.
 */
import * as store from '@/lib/store';
import * as timer from '@/lib/timer';
import { fresh, ex, saved, pressAlert } from './helpers';
import { renderApp, tap, flushAll, screen, act } from './app';

jest.setTimeout(120000);
const S = () => store.getState();
afterEach(async () => { try { S(); } catch { return; } await timer.stop(); await timer.stopSet(); });
const boot = async (url?: string) => { await act(async () => { await store.flush(); }); await renderApp({ saved: JSON.parse(JSON.stringify(saved())), url }); await flushAll(10); };
const lastAlert = (title?: string) => title ? [...global.__alerts].reverse().find(x => x.title === title) : global.__alerts[global.__alerts.length - 1];

describe('LIVE2-02: okno „Zakończyć trening?” liczy serie robocze jak workingSets (D3 — drop razem z serią)', () => {
  test('LIVE2-02: 3 serie + drop set, wszystkie odhaczone → „Zapisane zostaną serie robocze: 3.” (= workingSets po zapisie)', async () => {
    await fresh(); store.startEmpty(); store.addExerciseToActive(ex('Bench Press (sztanga)')); store.addSet(0); store.addSet(0); store.addSet(0, 'drop');
    const a = S().active!; expect(a.exercises[0].sets.map(s => s.kind)).toEqual(['normal', 'normal', 'normal', 'drop']);
    a.exercises[0].sets.forEach((s, i) => { s.weight = 60 - i * 5; s.reps = 8; }); a.exercises[0].sets.forEach((_, i) => store.toggleDone(0, i));
    await boot();
    await tap(screen.getAllByText('Zakończ trening i zapisz')[0]);
    expect(lastAlert()!.msg).toBe('Zapisane zostaną serie robocze: 3.');
    await act(async () => { pressAlert('Zakończyć trening?', 'Zakończ'); }); await flushAll(600);
    expect(store.workingSets(S().workouts.at(-1)!)).toBe(3);
  });
  test('LIVE2-02: rozgrzewka + drop bez serii przed nim liczy się sam; trwający pomiar liczy się jak odhaczony', async () => {
    await fresh(); store.startEmpty(); store.addExerciseToActive(ex('Plank')); store.addSet(0, 'warmup'); store.addSet(0, 'drop');
    const a = S().active!; expect(a.exercises[0].sets.map(s => s.kind)).toEqual(['warmup', 'normal', 'drop']);
    /* rozgrzewka i drop odhaczone, seria normalna w trakcie pomiaru — jej drop liczy się razem z nią: 1 seria robocza */
    a.exercises[0].sets.forEach(s => { s.durationSec = 30; }); store.toggleDone(0, 0); store.toggleDone(0, 2);
    await boot();
    expect(store.workCount(['drop'])).toBe(1);
    await act(async () => { await timer.startSet(a.exercises[0].sets[1].id, 30); });
    await tap(screen.getAllByText('Zakończ trening i zapisz')[0]);
    expect(lastAlert()!.msg).toBe('Zapisane zostaną serie robocze: 1.');
  });
});
