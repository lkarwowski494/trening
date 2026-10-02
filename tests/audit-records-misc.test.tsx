/* Runda 73 — testy z audytu T13 (nowa definicja rekordu: suma na treningu + e1RM). */
const log = (..._a: unknown[]) => { /* diagnostyka audytu wyciszona */ };
import * as store from '@/lib/store';
import * as stats from '@/lib/stats';
import * as timer from '@/lib/timer';
import { ex, addWorkout, pressAlert, fresh } from './helpers';
import { renderApp, flushAll, screen, act, tap, go } from './app';

jest.setTimeout(60000);
afterEach(async () => { try { store.getState(); } catch { return; } await timer.stop(); await timer.stopSet(); });
const day = 86400e3;
const at = (y: number, m: number, d: number, h = 18) => new Date(y, m - 1, d, h).getTime();

test('M1 BW e1RM detail: "(seria 6)" reads like set number 6', async () => {
  await fresh();
  addWorkout(at(2026, 9, 1), [['Pull Up', [{ reps: 5 }]]]);
  const w = addWorkout(at(2026, 9, 3), [['Pull Up', [{ reps: 6 }]]]);
  const d = stats.workoutPRs(w).flatMap(x => x.details);
  // eslint-disable-next-line no-console
  log('M1', d);
  expect(d.join(' ')).not.toMatch(/\(seria \d+\)/);
});

test('M2 EN: one-rep session total reads "1 reps"', async () => {
  await fresh(undefined, 'en'); const b = store.getState().bands[0];
  addWorkout(at(2026, 9, 1), [['Pull Up', [{ reps: 8, bandId: b.id }]]]);
  const w = addWorkout(at(2026, 9, 3), [['Pull Up', [{ reps: 1 }, { reps: 6, bandId: b.id }]]]);
  const d = stats.workoutPRs(w).flatMap(x => x.details);
  // eslint-disable-next-line no-console
  log('M2', d);
  expect(d.join(' ')).not.toMatch(/\b1 reps\b/);
});

test('M3 summary title says "Nowy rekord!" for two records on one set', async () => {
  await renderApp(); addWorkout(Date.now() - 2 * day, [['Back Squat', [{ weight: 100, reps: 5 }]]]);
  await act(async () => { store.startEmpty(); store.addExerciseToActive(ex('Back Squat')); const a = store.getState().active!; a.exercises[0].sets[0].weight = 110; a.exercises[0].sets[0].reps = 5; store.save(a); });
  await flushAll(10); await act(async () => { store.toggleDone(0, 0); }); await flushAll(1000);
  await tap(screen.getAllByText('Zakończ trening i zapisz')[0]); pressAlert('Zakończyć trening?', 'Zakończ'); await flushAll(600);
  const al = (global.__alerts as any[]).filter(x => /rekord/i.test(x.title)).map(x => [x.title, x.msg]);
  // eslint-disable-next-line no-console
  log('M3', JSON.stringify(al));
  expect(al[0][0]).toBe('Nowe rekordy: 2');
});

test('M4 deleting a band mid-workout turns assisted sets into unassisted records', async () => {
  await renderApp(); const b = store.getState().bands[0]; b.nominalKg = 20;
  addWorkout(Date.now() - 2 * day, [['Pull Up', [{ reps: 5 }, { reps: 5 }]]]);
  await act(async () => { store.startEmpty(); store.addExerciseToActive(ex('Pull Up')); const a = store.getState().active!;
    a.exercises[0].sets[0] = { ...a.exercises[0].sets[0], reps: 8, bandId: b.id, addKg: -20 }; store.save(a); });
  await flushAll(10); await act(async () => { store.toggleDone(0, 0); }); await flushAll(1000);
  await act(async () => { const a = store.getState().active!; a.exercises[0].sets.push({ ...a.exercises[0].sets[0], id: 'x2', done: false, completedAt: null }); store.save(a); });
  await act(async () => { store.toggleDone(0, 1); }); await flushAll(1000);
  const a = store.getState().active!;
  expect(stats.prMap(a).size).toBe(0); // assisted: no record
  await go('/more/bands'); await flushAll(10);
  await tap(screen.getAllByLabelText('Usuń gumę')[0]); pressAlert('Usunąć gumę?', 'Usuń'); await flushAll(10);
  // eslint-disable-next-line no-console
  log('M4', JSON.stringify(a.exercises[0].sets.map(s => [s.reps, s.bandId, s.addKg])), JSON.stringify([...stats.prMap(a).values()]));
  expect(stats.prMap(a).size).toBe(0);
});

test('M5 lb: 3×10 @ 100 lb session volume shows 2999 lb (and 10×10 @ 135 lb shows 13503 lb)', async () => {
  const units = require('@/lib/units');
  await fresh(); units.applyUnit('lb');
  try {
    const w = (x: number) => units.wIn(x) as number;
    addWorkout(at(2026, 9, 1), [['Back Squat', [{ weight: w(95), reps: 10 }]]]);
    const a = addWorkout(at(2026, 9, 3), [['Back Squat', [1, 2, 3].map(() => ({ weight: w(100), reps: 10 }))]]);
    const b = addWorkout(at(2026, 9, 5), [['Back Squat', Array.from({ length: 10 }, () => ({ weight: w(135), reps: 10 }))]]);
    const da = stats.workoutPRs(a).flatMap(x => x.details), db = stats.workoutPRs(b).flatMap(x => x.details);
    const card = stats.fmtTotal(ex('Back Squat'), stats.recordsFor(ex('Back Squat')).bestTotal);
    // eslint-disable-next-line no-console
    log('M5', da, db, 'card', card);
    expect(da.join(' ')).toMatch(/3000 lb/); expect(db.join(' ')).toMatch(/13500 lb/); expect(card).toBe('13500 lb');
  } finally { units.applyUnit('kg'); }
});
