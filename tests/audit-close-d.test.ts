/* Runda 72 — testy z audytu T11 (runda zamykająca). */
const log = (..._a: unknown[]) => { /* diagnostyka audytu wyciszona */ };
import * as store from '@/lib/store';
import * as stats from '@/lib/stats';
import { buildBackup, parseBackup, buildCsv } from '@/lib/backup';
import { wIn, fmtW } from '@/lib/units';
import { fresh, ex } from './helpers';
const H = 3600e3; let now = 0;
beforeEach(() => { now = new Date(2026, 8, 1, 18, 0, 0).getTime(); jest.spyOn(Date, 'now').mockImplementation(() => now); });
afterEach(() => jest.restoreAllMocks());

test('J1 EN/lb journey: superset + drop + failure + band pull-ups → finish → backup → next day', async () => {
  const st = await fresh(undefined, 'en'); st.settings.unit = 'lb'; store.applyPrefs(); store.save();
  const band = st.bands[0]; band.nominalKg = 20; store.save(band);
  const pu = ex('Pull Up'); pu.bandAssistable = true; store.save(pu);
  store.startEmpty(); store.addExerciseToActive(ex('Bench Press (sztanga)')); store.addExerciseToActive(ex('Bent Over Row (hantle)')); store.addExerciseToActive(pu);
  let a = store.getState().active!; store.linkWithNext(a.exercises, 0, a);
  // bench: 2 sets + drop
  a.exercises[0].sets[0].weight = wIn(225) as number; a.exercises[0].sets[0].reps = 5; store.save(a);
  store.addSet(0); store.addSet(0); a.exercises[0].sets[2].kind = 'drop'; a.exercises[0].sets[2].weight = wIn(185) as number; a.exercises[0].sets[2].reps = 8;
  // row: 2 sets, second failure
  a.exercises[1].sets[0].weight = wIn(50) as number; a.exercises[1].sets[0].reps = 10; store.addSet(1); a.exercises[1].sets[1].kind = 'failure'; store.save(a);
  now += 60e3; const r1 = store.toggleDone(0, 0); expect(r1).toBeNull(); // superset, B pending
  now += 60e3; const r2 = store.toggleDone(1, 0); expect(r2).toBeGreaterThan(0);
  now += 120e3; const r3 = store.toggleDone(0, 1); expect(r3).toBeNull(); // next is drop
  expect(a.exercises[0].sets[1].weight).toBe(a.exercises[0].sets[0].weight);
  now += 20e3; const r4 = store.toggleDone(0, 2); expect(r4).toBeNull(); // B round 2 pending
  expect(a.exercises[0].sets[2].weight).toBe(wIn(185));
  now += 30e3; a.exercises[1].sets[1].reps = 12; const r5 = store.toggleDone(1, 1); expect(r5).toBeGreaterThan(0);
  expect(a.exercises[1].sets[1].weight).toBe(a.exercises[1].sets[0].weight);
  // band pull-ups
  a.exercises[2].sets[0].bandId = band.id; store.applyBandAssist(a.exercises[2].sets[0]); a.exercises[2].sets[0].reps = 8; store.addSet(2); store.save(a);
  now += 120e3; store.toggleDone(2, 0); expect(a.exercises[2].sets[0].addKg).toBe(-20);
  expect(a.exercises[2].sets[1].bandId).toBe(band.id); expect(a.exercises[2].sets[1].addKg).toBe(-20);
  a.exercises[2].sets[1].reps = 7; now += 120e3; store.toggleDone(2, 1);
  const w = store.finishWorkout()!;
  expect(w.exercises.length).toBe(3);
  const prs1 = stats.workoutPRs(w); expect(prs1.length).toBe(0); // first session
  log('history vol', fmtW(store.volume(w)), store.volume(w));
  // backup round trip
  const txt = JSON.stringify(buildBackup()); const csv1 = buildCsv();
  store.replaceState(parseBackup(txt)); expect(buildCsv()).toBe(csv1);
  // next day: repeat last
  now += 24 * H; store.repeatLast(); a = store.getState().active!;
  log('repeat kinds', JSON.stringify(a.exercises.map(e => e.sets.map(s => s.kind + ':' + s.weight + 'x' + s.reps + (s.bandId ? 'b' + s.addKg : '')))));
  expect(a.exercises[0].groupId).toBeTruthy();
  expect(a.exercises[1].sets[1].kind).not.toBe('failure');
});
