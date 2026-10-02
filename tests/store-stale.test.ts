/* Runda 74 — porzucony trening na poziomie logiki (staleRef, lastActivity, staleSince, markActivity, autoFinishStale):
 * przypadki brzegowe dopisane po testach mutacyjnych lib/store.ts (wcześniej pokryte głównie testami ekranów). */
import * as store from '@/lib/store';
import { fresh, ex, saved } from './helpers';

const H = 3600e3; let now = 0;
beforeEach(() => { now = new Date(2026, 8, 1, 10, 0, 0).getTime(); jest.spyOn(Date, 'now').mockImplementation(() => now); });
afterEach(() => jest.restoreAllMocks());

async function start(names: string[] = ['Bench Press (sztanga)']) {
  await fresh(); store.startEmpty(); names.forEach(n => store.addExerciseToActive(ex(n)));
  return store.getState().active!;
}
const tick = (a: any, ei: number, si: number, vals: object) => { Object.assign(a.exercises[ei].sets[si], vals); store.save(a); store.toggleDone(ei, si); };
const timerSet = (p: object) => store.setTimerState({ restEndAt: null, restTotal: 0, restSetId: null, setStartAt: null, setTarget: 0, setId: null, ...p });

describe('lastActivity / staleRef', () => {
  test('lastActivity: najpóźniejsza odhaczona seria z liczbową godziną; nieodhaczona i bez godziny nie liczą się; remis nie przesuwa', async () => {
    const a = await start(); const t0 = a.startedAt; store.addSet(0); store.addSet(0);
    expect(store.lastActivity(a)).toBe(t0);
    now += 60e3; tick(a, 0, 0, { weight: 100, reps: 5 });
    a.exercises[0].sets[1].completedAt = t0 + 5 * H; /* nieodhaczona z godziną — nie */
    a.exercises[0].sets[2].done = true; a.exercises[0].sets[2].completedAt = null; /* odhaczona bez godziny — nie */
    expect(store.lastActivity(a)).toBe(t0 + 60e3);
    a.exercises[0].sets[2].completedAt = t0 - H; expect(store.lastActivity(a)).toBe(t0 + 60e3); /* starsza niż start/seria */
  });
  test('staleRef: stoper serii z tego treningu przesuwa aktywność; stoper serii spoza treningu — nie', async () => {
    const a = await start(['Plank']); const t0 = a.startedAt;
    timerSet({ setStartAt: t0 + H, setTarget: 60, setId: a.exercises[0].sets[0].id }); now = t0 + 2 * H;
    expect(store.staleRef(a, now)).toBe(t0 + H);
    timerSet({ setStartAt: t0 + H, setTarget: 60, setId: 'obca-seria' }); expect(store.staleRef(a, now)).toBe(t0);
    timerSet({ setStartAt: null, setId: a.exercises[0].sets[0].id }); expect(store.staleRef(a, now)).toBe(t0);
    timerSet({ setStartAt: t0 + H, setId: null }); expect(store.staleRef(a, now)).toBe(t0);
  });
  test('staleRef: znaczniki z przyszłości (> 10 min) pomijane, do 10 min — liczone; bez wiarygodnych = −∞', async () => {
    const a = await start(); const t0 = a.startedAt;
    a.staleAck = now + 10 * 60e3; expect(store.staleRef(a, now)).toBe(now + 10 * 60e3);
    a.staleAck = now + 10 * 60e3 + 1; expect(store.staleRef(a, now)).toBe(t0);
    a.exercises[0].sets[0].done = true; a.exercises[0].sets[0].completedAt = now + H; expect(store.staleRef(a, now)).toBe(t0);
    delete a.staleAck; a.exercises[0].sets[0].completedAt = t0 + 60e3; expect(store.staleRef(a, now + H)).toBe(t0 + 60e3);
    a.startedAt = now + H; a.exercises[0].sets[0].completedAt = now + H; delete a.staleAck; expect(store.staleRef(a, now)).toBe(-Infinity);
    a.staleAck = Number.NaN as never; expect(store.staleRef(a, now)).toBe(-Infinity);
    a.staleAck = '5' as never; expect(store.staleRef(a, now)).toBe(-Infinity);
  });
  test('staleKind / hasWorkDone: robocza > rozgrzewka > nic', async () => {
    const a = await start(); store.addSet(0);
    expect(store.staleKind(a)).toBe('none'); expect(store.hasWorkDone(a)).toBe(false);
    a.exercises[0].sets[0].kind = 'warmup'; tick(a, 0, 0, { weight: 40, reps: 10 });
    expect(store.staleKind(a)).toBe('warmup'); expect(store.hasWorkDone(a)).toBe(false);
    tick(a, 0, 1, { weight: 100, reps: 5 }); expect(store.staleKind(a)).toBe('work'); expect(store.hasWorkDone(a)).toBe(true);
  });
});

describe('staleSince / ackStale / markActivity', () => {
  test('pytanie dokładnie po 2 h (granica włącznie) i godzina ostatniej serii; bez treningu — null', async () => {
    const a = await start(); now += 60e3; tick(a, 0, 0, { weight: 100, reps: 5 }); const last = now;
    expect(store.staleSince(last + store.STALE_ASK_MS - 1)).toBeNull();
    expect(store.staleSince(last + store.STALE_ASK_MS)).toBe(last);
    now = last + 3 * H; store.ackStale(); expect(a.staleAck).toBe(now); expect(store.staleSince(now + H)).toBeNull();
    store.cancelWorkout(); expect(store.staleSince(now + 9 * H)).toBeNull(); expect(() => store.ackStale()).not.toThrow();
  });
  test('markActivity: tylko do przodu, nie w przyszłość, nie z NaN', async () => {
    const a = await start(); delete a.staleAck;
    store.markActivity(a, now - H); expect(a.staleAck).toBe(now - H);
    store.markActivity(a, now - 2 * H); expect(a.staleAck).toBe(now - H);
    store.markActivity(a, now - H); expect(a.staleAck).toBe(now - H);
    store.markActivity(a, now + H); expect(a.staleAck).toBe(now);
    store.markActivity(a, Number.NaN); expect(a.staleAck).toBe(now);
  });
});

describe('autoFinishStale', () => {
  test('granica 6 h (włącznie), bez treningu i bez wiarygodnej godziny — nic', async () => {
    expect(store.autoFinishStale(now)).toBeNull();
    const a = await start(); now += 60e3; tick(a, 0, 0, { weight: 100, reps: 5 }); const last = now;
    expect(store.autoFinishStale(last + store.STALE_AUTO_MS - 1)).toBeNull(); expect(store.getState().active).toBeTruthy();
    now = last + store.STALE_AUTO_MS; const w = store.autoFinishStale(now)!; expect(w.finishedAt).toBe(last); expect(store.getState().active).toBeNull();
    const b = await start(); b.startedAt = now + H; store.save(b); expect(store.autoFinishStale(now + 9 * H)).toBeNull();
  });
  test('seria czasowa z celem w toku: odhaczona o starcie + cel, czas = cel; stoper zdjęty z zapisu', async () => {
    const a = await start(['Plank', 'Bench Press (sztanga)']); now += 60e3; tick(a, 1, 0, { weight: 100, reps: 5 });
    const t0 = now + 60e3; timerSet({ setStartAt: t0, setTarget: 90, setId: a.exercises[0].sets[0].id });
    now = t0 + 7 * H; const w = store.autoFinishStale(now)!;
    const p = w.exercises.find(e => e.exerciseId === ex('Plank').id)!.sets[0];
    expect(p.durationSec).toBe(90); expect(p.completedAt).toBe(t0 + 90e3); expect(store.getState().timer.setStartAt).toBeNull();
  });
  test('ponowny pomiar odhaczonej serii (sama rozgrzewka): czas zapisany, aktywność przesunięta na koniec pomiaru, trening czeka', async () => {
    const a = await start(['Plank']); a.exercises[0].sets[0].kind = 'warmup'; now += 60e3; tick(a, 0, 0, { durationSec: 30 });
    const t0 = now + 60e3; timerSet({ setStartAt: t0, setTarget: 45, setId: a.exercises[0].sets[0].id });
    now = t0 + 7 * H; expect(store.autoFinishStale(now)).toBeNull();
    const cur = store.getState().active!; expect(cur.exercises[0].sets[0].durationSec).toBe(45); expect(cur.staleAck).toBe(t0 + 45e3);
    expect(store.getState().timer.setId).toBeNull();
    await store.flush(); expect(saved().active?.staleAck).toBe(t0 + 45e3); /* zapisane, nie tylko w pamięci */
  });
  test('stoper z celem dłuższym niż minęło — czas nie dłuższy niż faktycznie (min. 1 s)', async () => {
    const a = await start(['Plank', 'Bench Press (sztanga)']); now += 60e3; tick(a, 1, 0, { weight: 100, reps: 5 });
    const t0 = now; timerSet({ setStartAt: t0, setTarget: 86400, setId: a.exercises[0].sets[0].id });
    now = t0 + 7 * H; const w = store.autoFinishStale(now)!;
    const p = w.exercises.find(e => e.exerciseId === ex('Plank').id)!.sets[0]; expect(p.durationSec).toBe(7 * 3600); expect(p.completedAt).toBe(now);
  });
  test('stoper wskazuje serię spoza treningu — nic nie odhacza, stoper zdjęty; trening z robocza serią zapisany', async () => {
    const a = await start(); now += 60e3; tick(a, 0, 0, { weight: 100, reps: 5 });
    timerSet({ setStartAt: now, setTarget: 60, setId: 'obca' }); now += 7 * H;
    const w = store.autoFinishStale(now)!; expect(w.exercises[0].sets).toHaveLength(1); expect(store.getState().timer.setStartAt).toBeNull();
  });
});

describe('przypadki z testów mutacyjnych (runda 74)', () => {
  test('lastActivity: godzina zapisana tekstem nie jest godziną (bez porównania tekst > liczba)', async () => {
    const a = await start(); a.exercises[0].sets[0].done = true; a.exercises[0].sets[0].completedAt = String(a.startedAt + H) as never;
    expect(store.lastActivity(a)).toBe(a.startedAt);
  });
  test('staleRef: nieodhaczona seria z godziną nie jest aktywnością; stoper serii w drugim ćwiczeniu — jest', async () => {
    const a = await start(['Bench Press (sztanga)', 'Plank']); const t0 = a.startedAt;
    a.exercises[0].sets[0].completedAt = t0 + H; expect(store.staleRef(a, t0 + 2 * H)).toBe(t0);
    timerSet({ setStartAt: t0 + H, setTarget: 60, setId: a.exercises[1].sets[0].id }); expect(store.staleRef(a, t0 + 2 * H)).toBe(t0 + H);
  });
  test('staleKind / hasWorkDone: wystarczy jedno ćwiczenie z odhaczoną serią', async () => {
    const a = await start(['Bench Press (sztanga)', 'Plank']); a.exercises[0].sets[0].kind = 'warmup'; tick(a, 0, 0, { weight: 40, reps: 10 });
    expect(store.staleKind(a)).toBe('warmup'); expect(store.hasWorkDone(a)).toBe(false);
    const b = await start(['Bench Press (sztanga)', 'Plank']); tick(b, 0, 0, { weight: 100, reps: 5 }); expect(store.hasWorkDone(b)).toBe(true); expect(store.staleKind(b)).toBe('work');
  });
  test('stoper bez celu na nieodhaczonej serii po 6 h: seria nietknięta (nie „1 s”), stoper zdjęty z zapisu (Q-011)', async () => {
    const a = await start(['Plank', 'Bench Press (sztanga)']); now += 60e3; tick(a, 1, 0, { weight: 100, reps: 5 });
    timerSet({ setStartAt: now, setTarget: 0, setId: a.exercises[0].sets[0].id }); now += 7 * H;
    const w = store.autoFinishStale(now)!; expect(w.exercises.some(e => e.exerciseId === ex('Plank').id)).toBe(false);
    expect(store.getState().timer.setStartAt).toBeNull(); expect(store.getState().timer.setId).toBeNull();
  });
  test('stoper bez celu na samej rozgrzewce: trening czeka, stoper zdjęty z zapisu (Q-011)', async () => {
    const a = await start(['Plank']); a.exercises[0].sets[0].kind = 'warmup'; now += 60e3; tick(a, 0, 0, { durationSec: 30 }); store.addSet(0);
    timerSet({ setStartAt: now, setTarget: 0, setId: a.exercises[0].sets[1].id }); now += 7 * H;
    expect(store.autoFinishStale(now)).toBeNull(); expect(store.getState().active!.exercises[0].sets[1].done).toBe(false); expect(store.getState().timer.setStartAt).toBeNull();
  });
  test('zapis timera bez startu (sam cel i id) — nic nie odhacza', async () => {
    const a = await start(['Plank', 'Bench Press (sztanga)']); now += 60e3; tick(a, 1, 0, { weight: 100, reps: 5 });
    timerSet({ setStartAt: null, setTarget: 60, setId: a.exercises[0].sets[0].id }); now += 7 * H;
    const w = store.autoFinishStale(now)!; expect(w.exercises.some(e => e.exerciseId === ex('Plank').id)).toBe(false);
  });
});

describe('resolveColdStopwatch (runda 75, Q-002)', () => {
  test('stoper bez celu po zamknięciu aplikacji: czas z pola → seria odhaczona o starcie + czas; puste pole → nieodhaczona; stoper zdjęty', async () => {
    let a = await start(['Plank']); store.addSet(0); const t0 = now;
    a.exercises[0].sets[0].durationSec = 45; timerSet({ setStartAt: t0, setTarget: 0, setId: a.exercises[0].sets[0].id }); now += 3 * H;
    store.resolveColdStopwatch(now); let s0 = store.getState().active!.exercises[0].sets[0];
    expect([s0.done, s0.durationSec, s0.completedAt]).toEqual([true, 45, t0 + 45e3]); expect(store.getState().timer.setStartAt).toBeNull();
    a = await start(['Plank']); timerSet({ setStartAt: now, setTarget: 0, setId: a.exercises[0].sets[0].id }); now += H;
    store.resolveColdStopwatch(now); s0 = store.getState().active!.exercises[0].sets[0]; expect([s0.done, s0.durationSec]).toEqual([false, '']); expect(store.getState().timer.setId).toBeNull();
  });
  test('ponowny pomiar bez celu: odhaczona seria zachowuje poprzedni czas; stoper z celem zostaje do odtworzenia', async () => {
    const a = await start(['Plank']); now += 60e3; tick(a, 0, 0, { durationSec: 40 });
    timerSet({ setStartAt: now, setTarget: 0, setId: a.exercises[0].sets[0].id }); now += H; store.resolveColdStopwatch(now);
    expect(store.getState().active!.exercises[0].sets[0].durationSec).toBe(40); expect(store.getState().timer.setStartAt).toBeNull();
    timerSet({ setStartAt: now, setTarget: 60, setId: a.exercises[0].sets[0].id }); store.resolveColdStopwatch(now + H); expect(store.getState().timer.setStartAt).toBe(now);
  });
});
