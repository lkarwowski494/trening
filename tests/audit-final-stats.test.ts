/* Runda 72 — testy z audytu T9 (weryfikacja końcowa). */
import * as store from '@/lib/store';
import * as units from '@/lib/units';
import { prMap, workoutPRs, recordsFor, setPRs } from '@/lib/stats';
import { fresh, ex, addWorkout, set } from './helpers';
afterEach(() => { units.applyUnit('kg'); jest.restoreAllMocks(); });

test('S1 BW: band w/o kg excluded; free improvement gets e1RM/vol/reps', async () => {
  const st = await fresh(); const b = st.bands[0]; b.nominalKg = ''; const pu = ex('Pull Up'); pu.bandAssistable = true; store.save();
  const now = Date.now(); addWorkout(now - 2 * 86400e3, [['Pull Up', [{ addKg: '', reps: 10, bandId: b.id }, { addKg: '', reps: 5 }]]]);
  const rec = recordsFor(pu); expect(rec.maxRepsFree).toBe(5); expect(rec.maxReps).toBe(10);
  expect(setPRs(pu, set({ reps: 12, bandId: b.id }), rec)).toEqual([]);
  expect(setPRs(pu, set({ reps: 6, addKg: 0 }), rec)).toEqual([]); /* runda 75 (Q-001): bez dociążenia nie ma e1RM — masa ciała poza obliczeniami */
  const w = addWorkout(now, [['Pull Up', [{ addKg: '', reps: 12, bandId: b.id }, { addKg: 0, reps: 6 }]]]); const m = prMap(w);
  expect(m.get(w.exercises[0].sets[0].id)).toBeUndefined(); expect(m.get(w.exercises[0].sets[1].id)).toEqual(['suma powtórzeń']); /* suma bez asysty: 6 > 5 */
});

test('S2 lb display: 100.02 kg vs 100 kg same 220.5 lb → no PR; kg mode → weight PR', async () => {
  const st = await fresh(); const now = Date.now(); addWorkout(now - 86400e3, [['Bench Press (sztanga)', [{ weight: 100, reps: 5 }]]]);
  const bp = ex('Bench Press (sztanga)'); const rec = recordsFor(bp);
  units.applyUnit('lb'); expect(setPRs(bp, set({ weight: 100.02, reps: 5 }), rec)).toEqual([]);
  units.applyUnit('kg'); expect(setPRs(bp, set({ weight: 100.02, reps: 5 }), rec)).toContain('e1RM'); /* runda 73 */
  void st;
});

test('S3 workoutPRs dedupe: ascending sets → one weight entry; first session → none', async () => {
  await fresh(); const now = Date.now(); addWorkout(now - 86400e3, [['Bench Press (sztanga)', [{ weight: 90, reps: 5 }]]]);
  store.startEmpty(); store.addExerciseToActive(ex('Bench Press (sztanga)')); const a = store.getState().active!;
  a.exercises[0].sets = [set({ weight: 95, reps: 5, completedAt: now + 1 }), set({ weight: 100, reps: 5, completedAt: now + 2 }), set({ weight: 105, reps: 3, completedAt: now + 3 })];
  const p = workoutPRs(a); expect(p.filter(x => x.kinds.includes('e1RM')).length).toBe(1); expect(p.find(x => x.kinds.includes('e1RM'))!.set.weight).toBe(100); /* runda 73: 100×5 = najwyższe e1RM */
  const tot = p.find(x => x.kinds.includes('objętość treningu'))!; expect(tot.details.join(' ')).toMatch(/objętość treningu: 1[\s\u00a0]?290 kg/);
  store.addExerciseToActive(ex('Back Squat')); a.exercises[1].sets = [set({ weight: 100, reps: 5, completedAt: now + 4 })];
  expect(prMap(a).get(a.exercises[1].sets[0].id)).toBeUndefined();
});
