/*
 * Pauza treningu (decyzja właściciela 08.10.2026: „pauzy odejmujemy od czasu trwania treningu”). store: pauseWorkout / resumeWorkout /
 * pausedTotal / workoutDurSec; pola Workout.pauses (zakończone przedziały [od, do]) i pausedAt (trwająca, tylko w toku) — opcjonalne, bez zmiany schematu.
 * Rodzaje (docs/20): logika (suma pauz, koniec przy pauzie, auto-zapis, odhaczenie serii wznawia), dane (sanityzacja, zapis/odczyt,
 * edycja historii, eksport CSV, podsumowanie okresu), ekran (przycisk, zegar stoi, opis, historia), języki (EN), niezmiennik
 * (czas trwania nigdy ujemny i nie dłuższy niż koniec − start). E2E: .maestro/01 (Pauza → Wznów).
 */
import * as store from '@/lib/store';
import { applyLang } from '@/lib/i18n';
import { beginEdit, draftSetWhen, commitDraft } from '@/lib/edit';
import { buildCsv } from '@/lib/backup';
import { periodSummary } from '@/lib/period';
import { fresh, addWorkout, saved, ex } from './helpers';
import { renderApp, flushAll, screen, tap, act } from './app';

const T0 = new Date(2026, 9, 8, 17, 0).getTime(); const MIN = 60e3;
const clock = (ms: number) => jest.setSystemTime(T0 + ms);
beforeEach(async () => { jest.useFakeTimers({ now: T0 }); await fresh(); });
afterEach(() => { applyLang('pl'); });
const start = () => { store.startEmpty(); store.addExerciseToActive(ex('Back Squat')); const a = store.getState().active!; a.exercises[0].sets[0].weight = 100; a.exercises[0].sets[0].reps = 5; store.save(a); return a; };

describe('logika', () => {
  test('pauza i wznowienie: suma pauz, czas trwania bez pauz; trwająca pauza liczy się do „teraz”; podwójne wywołania bez skutku', () => {
    const a = start(); clock(10 * MIN); store.pauseWorkout(); store.pauseWorkout(); expect(a.pausedAt).toBe(T0 + 10 * MIN);
    clock(15 * MIN); expect(store.pausedTotal(a)).toBe(5 * MIN); expect(store.workoutDurSec(a)).toBe(600);
    store.resumeWorkout(); store.resumeWorkout(); expect([a.pauses, a.pausedAt]).toEqual([[[T0 + 10 * MIN, T0 + 15 * MIN]], undefined]); expect([store.isPaused(a), store.isPaused(null)]).toEqual([false, false]);
    clock(20 * MIN); expect(store.workoutDurSec(a)).toBe(900);
    clock(21 * MIN); store.pauseWorkout(); clock(23 * MIN); store.resumeWorkout(); expect(a.pauses).toEqual([[T0 + 10 * MIN, T0 + 15 * MIN], [T0 + 21 * MIN, T0 + 23 * MIN]]); expect(store.pausedTotal(a)).toBe(7 * MIN);
  });
  test('bez treningu w toku — nic; pauza nie wcześniej niż start', () => {
    expect(() => { store.pauseWorkout(); store.resumeWorkout(); }).not.toThrow(); expect(store.getState().active).toBeNull();
    const a = start(); store.pauseWorkout(T0 - 3600e3); expect(a.pausedAt).toBe(a.startedAt);
  });
  test('„Zakończ” w trakcie pauzy kończy pauzę razem z treningiem; czas w historii bez pauzy', () => {
    start(); store.toggleDone(0, 0); clock(30 * MIN); store.pauseWorkout(); clock(40 * MIN);
    const w = store.finishWorkout()!; expect([w.pauses, w.pausedAt]).toEqual([[[T0 + 30 * MIN, T0 + 40 * MIN]], undefined]); expect(store.workoutDurSec(w)).toBe(30 * 60);
  });
  test('auto-zapis po 6 h (koniec = ostatnia seria): pauza zaczęta po ostatniej serii się nie liczy', () => {
    start(); clock(5 * MIN); store.toggleDone(0, 0); clock(10 * MIN); store.pauseWorkout();
    clock(7 * 3600e3); const w = store.autoFinishStale()!; expect(w.finishedAt).toBe(T0 + 5 * MIN); expect(w.pauses).toBeUndefined(); expect(store.workoutDurSec(w)).toBe(300);
  });
  test('odhaczenie serii w trakcie pauzy wznawia trening od godziny serii', () => {
    const a = start(); clock(10 * MIN); store.pauseWorkout(); clock(12 * MIN); store.toggleDone(0, 0);
    expect([a.pausedAt, a.pauses]).toEqual([undefined, [[T0 + 10 * MIN, T0 + 12 * MIN]]]);
  });
  test('niezmiennik: czas trwania ≥ 0 i ≤ koniec − start dla losowych pauz', () => {
    for (let i = 0; i < 50; i++) { const w = { startedAt: 0, finishedAt: Math.round(Math.random() * 1e7), pauses: store.cleanPauses([[Math.random() * 2e7, Math.random() * 2e7], [Math.random() * 1e7, 2e7]].map(([a, b]) => [Math.min(a, b), Math.max(a, b)]), 0, null) } as any;
      const d = store.workoutDurSec(w); expect(d).toBeGreaterThanOrEqual(0); expect(d).toBeLessThanOrEqual(w.finishedAt / 1000); }
  });
});

describe('dane', () => {
  test('zapis i odczyt: trening w pauzie po ponownym uruchomieniu nadal w pauzie', async () => {
    start(); clock(10 * MIN); store.pauseWorkout(); await store.flush();
    await fresh(saved()); expect(store.getState().active!.pausedAt).toBe(T0 + 10 * MIN);
  });
  test('sanityzacja: złe pauzy usunięte, pausedAt w historii usunięte, pauzy przycięte do treningu, posortowane i scalone; pausedAt sprzed startu usunięte', async () => {
    const w1 = addWorkout(T0 - 86400e3, [['Back Squat', [{ weight: 100, reps: 5 }]]]); (w1 as any).pauses = 'x'; (w1 as any).pausedAt = T0;
    const w2 = addWorkout(T0 - 2 * 86400e3, [['Back Squat', [{ weight: 100, reps: 5 }]]]); w2.pauses = [[w2.startedAt + 20 * MIN, w2.startedAt + 99 * 3600e3], [w2.startedAt + 5 * MIN, w2.startedAt + 25 * MIN], [w2.startedAt - 9e5, w2.startedAt + MIN], ['a', 3] as any, [w2.startedAt + 2 * MIN, w2.startedAt + 2 * MIN]];
    const a = start(); a.pausedAt = a.startedAt - 1000; await store.flush();
    await fresh(saved()); const st = store.getState();
    const h1 = st.workouts.find(w => w.id === w1.id)!, h2 = st.workouts.find(w => w.id === w2.id)!;
    expect([h1.pauses, h1.pausedAt]).toEqual([undefined, undefined]); expect(h2.pauses).toEqual([[h2.startedAt, h2.startedAt + MIN], [h2.startedAt + 5 * MIN, h2.finishedAt!]]); expect(st.active!.pausedAt).toBeUndefined();
  });
  test('edycja historii: pole „min” = czas bez pauz; zmiana minut zachowuje pauzy (koniec = start + min + pauzy); bez zmian — bez zmian', () => {
    const w = addWorkout(T0 - 86400e3, [['Back Squat', [{ weight: 100, reps: 5 }]]]); w.pauses = [[w.startedAt + 10 * MIN, w.startedAt + 25 * MIN]]; store.save();
    const d = beginEdit(w.id)!; expect(d.min).toBe('45');
    draftSetWhen(w.id, { min: '50' }); const r = commitDraft(w.id); if ('error' in r) throw new Error(r.error);
    const h = store.getState().workouts.find(x => x.startedAt === w.startedAt)!; expect(h.pauses).toEqual([[h.startedAt + 10 * MIN, h.startedAt + 25 * MIN]]); expect(h.finishedAt! - h.startedAt).toBe(65 * MIN); expect(store.workoutDurSec(h)).toBe(50 * 60);
  });
  test('eksport CSV i podsumowanie okresu liczą czas bez pauz', () => {
    const w = addWorkout(T0 - 3600e3 * 2, [['Back Squat', [{ weight: 100, reps: 5 }]]]); w.pauses = [[w.startedAt + 5 * MIN, w.startedAt + 25 * MIN]]; store.save();
    expect(buildCsv().split('\n')[1]).toMatch(/,40m,/);
    expect(periodSummary('week', 0, new Date(T0)).durationSec).toBe(40 * 60);
  });
});

describe('Apple Health (wariant A, decyzja 08.10.2026)', () => {
  test('start w Zdrowiu = start + suma pauz (czas trwania jak w aplikacji, koniec prawdziwy); bez pauz — start prawdziwy', () => {
    const { healthStart } = require('@/lib/health');
    const w = addWorkout(T0 - 86400e3, [['Back Squat', [{ weight: 100, reps: 5 }]]]); expect(healthStart(w)).toBe(w.startedAt);
    w.pauses = [[w.startedAt + 5 * MIN, w.startedAt + 15 * MIN], [w.startedAt + 30 * MIN, w.startedAt + 35 * MIN]];
    expect(healthStart(w)).toBe(w.startedAt + 15 * MIN); expect((w.finishedAt! - healthStart(w)) / 1000).toBe(store.workoutDurSec(w));
  });
  test('zapis do Zdrowia przekazuje przesunięty start i prawdziwy koniec', async () => {
    const hk = require('@kingstinct/react-native-healthkit').default; const calls: unknown[][] = []; const orig = hk.saveWorkoutSample;
    hk.saveWorkoutSample = async (...a: unknown[]) => { calls.push(a); return 'uuid-1'; };
    try {
      const { saveWorkout } = require('@/lib/health');
      const w = addWorkout(T0 - 86400e3, [['Back Squat', [{ weight: 100, reps: 5 }]]]); w.pauses = [[w.startedAt + 10 * MIN, w.startedAt + 30 * MIN]];
      expect(await saveWorkout(w)).toBe('saved');
      expect((calls[0][2] as Date).getTime()).toBe(w.startedAt + 20 * MIN); expect(((calls[0][3] as { end: Date }).end).getTime()).toBe(w.finishedAt);
    } finally { hk.saveWorkoutSample = orig; }
  });
});

describe('edycja terminu', () => {
  test('zmiana godziny startu przesuwa pauzy razem z treningiem', () => {
    const w = addWorkout(new Date(2026, 9, 7, 10).getTime(), [['Back Squat', [{ weight: 100, reps: 5 }]]]); w.pauses = [[w.startedAt + 10 * MIN, w.startedAt + 20 * MIN]]; store.save();
    beginEdit(w.id); draftSetWhen(w.id, { time: '12:00' }); const r = commitDraft(w.id); if ('error' in r) throw new Error(r.error);
    const h = store.getState().workouts.find(x => x.startedAt === new Date(2026, 9, 7, 12).getTime())!;
    expect(h.pauses).toEqual([[h.startedAt + 10 * MIN, h.startedAt + 20 * MIN]]); expect(store.workoutDurSec(h)).toBe(50 * 60);
  });
});

describe('ekran', () => {
  const boot = async (locale: 'pl' | 'en' = 'pl') => { await fresh(undefined, locale); start(); await act(async () => { await store.flush(); }); await renderApp({ saved: JSON.parse(JSON.stringify(saved())), locale }); await flushAll(10); };
  test('„Pauza” zatrzymuje zegar treningu i pokazuje opis; „Wznów” — zegar liczy dalej bez czasu pauzy', async () => {
    await boot(); clock(5 * MIN); await flushAll(1000);
    expect(screen.getByText(/^start \d{2}:\d{2} · 5:0\d$/)).toBeTruthy();
    expect(screen.getByText('⏸ Pauza')).toBeTruthy(); await tap(screen.getByLabelText('Pauza treningu')); await flushAll(10); expect(screen.getByText('▶ Wznów')).toBeTruthy(); expect(store.isPaused(store.getState().active)).toBe(true);
    expect(screen.getByLabelText('Wznów trening')).toBeTruthy(); expect(screen.getByText(/ · pauza$/)).toBeTruthy();
    expect(screen.getByText('Zegar treningu stoi i pauza nie wlicza się do czasu trwania. Przerwa między seriami liczy dalej; odhaczenie serii wznawia trening.')).toBeTruthy();
    const frozen = screen.getByText(/ · pauza$/).props.children; clock(9 * MIN); await flushAll(1000); expect(screen.getByText(/ · pauza$/).props.children).toEqual(frozen);
    await tap(screen.getByLabelText('Wznów trening')); clock(10 * MIN); await flushAll(1000);
    expect(screen.getByText(/^start \d{2}:\d{2} · 6:0\d$/)).toBeTruthy(); expect(screen.getByLabelText('Pauza treningu')).toBeTruthy();
    expect(screen.queryByText(/odhaczenie serii wznawia trening/)).toBeNull();
  });
  test('ekran sesji w historii pokazuje czas bez pauz', async () => {
    await fresh(); const w = addWorkout(T0 - 86400e3, [['Back Squat', [{ weight: 100, reps: 5 }]]]); w.pauses = [[w.startedAt + MIN, w.startedAt + 16 * MIN]]; store.save(); await act(async () => { await store.flush(); });
    await renderApp({ saved: JSON.parse(JSON.stringify(saved())), url: `/history/${w.id}` }); await flushAll(10);
    expect(screen.getByText(/ · 45:00/)).toBeTruthy();
  });
  test('English', async () => {
    await boot('en'); await tap(screen.getByLabelText('Pause workout')); await flushAll(10);
    expect(screen.getByLabelText('Resume workout')).toBeTruthy(); expect(screen.getByText(/ · paused$/)).toBeTruthy(); expect(screen.getByText('▶ Resume')).toBeTruthy();
  });
});
