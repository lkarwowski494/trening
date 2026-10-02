/* Runda 72 — testy z audytu T7 (weryfikacja poprawek T6). */
/* T7 audit repros (temporary). Each test asserts CORRECT behaviour; failing = defect. */
import * as store from '@/lib/store';
import * as stats from '@/lib/stats';
import * as backup from '@/lib/backup';
import { fresh, ex, addWorkout, set } from './helpers';

jest.setTimeout(60000);
const at = (y: number, m: number, d: number, h = 18) => new Date(y, m - 1, d, h).getTime();
afterEach(() => jest.restoreAllMocks());

test('H1 band carries to next set when "Poprzednio" for that set is hidden (deleted band) — tick uses same hint as screen', async () => {
  await fresh(); const st = store.getState(); const [A, B] = st.bands;
  addWorkout(at(2026, 9, 1), [['Pull Up', [{ reps: 8, bandId: A.id }, { reps: 8, bandId: B.id }]]]);
  st.bands = st.bands.filter(b => b.id !== B.id); store.save();
  jest.spyOn(Date, 'now').mockReturnValue(at(2026, 9, 3));
  store.startEmpty(); store.addExerciseToActive(ex('Pull Up')); store.addSet(0);
  const a = store.getState().active!; const e = a.exercises[0];
  const prev = store.previousBlockFor(ex('Pull Up').id, 0, 1, undefined, null);
  expect(store.hintFor(prev?.sets, e.sets, 1, ex('Pull Up'))).toBeNull(); // screen shows "—" for set 2
  e.sets[0].bandId = A.id; e.sets[0].reps = 8; store.toggleDone(0, 0);
  // reps typed in set 1 carried over to set 2; the band (assistance) must carry with them
  expect(e.sets[1].reps).toBe(8);
  expect(e.sets[1].bandId).toBe(A.id); // got '' -> set 2 logged as 8 unassisted reps
});

test('H1b consequence: set 2 ticked as unassisted -> false reps PR', async () => {
  await fresh(); const st = store.getState(); const [A, B] = st.bands;
  addWorkout(at(2026, 8, 20), [['Pull Up', [{ reps: 6, addKg: 0 }]]]);
  addWorkout(at(2026, 9, 1), [['Pull Up', [{ reps: 8, bandId: A.id }, { reps: 8, bandId: B.id }]]]);
  st.bands = st.bands.filter(b => b.id !== B.id); store.save();
  jest.spyOn(Date, 'now').mockReturnValue(at(2026, 9, 3));
  store.startEmpty(); store.addExerciseToActive(ex('Pull Up')); store.addSet(0);
  const a = store.getState().active!; const e = a.exercises[0];
  e.sets[0].bandId = A.id; e.sets[0].reps = 8; store.toggleDone(0, 0); store.toggleDone(0, 1);
  expect(stats.prMap(a).get(e.sets[1].id) ?? []).not.toContain('powtórzenia');
});

test('H3 header "bez przerwy → następne" vs restAfter in a superset (out-of-order round end)', async () => {
  await fresh(); jest.spyOn(Date, 'now').mockReturnValue(at(2026, 9, 10));
  store.startEmpty(); store.addExerciseToActive(ex('Bench Press (sztanga)')); store.addExerciseToActive(ex('Bent Over Row (sztanga)'));
  const a = store.getState().active!; store.linkWithNext(a.exercises, 0, a);
  a.exercises.forEach(e => { e.sets[0].weight = 60; e.sets[0].reps = 5; });
  expect(store.toggleDone(1, 0)).toBeNull(); // B1 first
  const r = store.toggleDone(0, 0); // A1 completes round
  // T7: nagłówek każdego ćwiczenia supersetu mówi „przerwa po rundzie” — zgodnie z tym, że rundę może zamknąć dowolne ćwiczenie
  expect(r).toBe(store.roundRest(0));
});

test('H5 non-bodyweight exercise with an old bandId (band exists, bandAssistable off): weight hint kept', async () => {
  await fresh(); const st = store.getState(); const A = st.bands[0];
  expect(ex('Back Squat').bandAssistable).toBe(false);
  addWorkout(at(2026, 9, 1), [['Back Squat', [{ weight: 100, reps: 5, bandId: A.id }]]]);
  store.startEmpty(); store.addExerciseToActive(ex('Back Squat'));
  const a = store.getState().active!;
  const prev = store.previousBlockFor(ex('Back Squat').id, 0, 1, undefined, null);
  expect(store.hintFor(prev?.sets, a.exercises[0].sets, 0, ex('Back Squat'))?.weight).toBe(100); // got null ("—")
});

test('S1 staleRef: future startedAt -> immediate prompt, Kontynuuj stops it for 2h (no loop)', async () => {
  await fresh(); const now = at(2026, 9, 10);
  const spy = jest.spyOn(Date, 'now').mockReturnValue(now + 3600e3); store.startEmpty();
  spy.mockReturnValue(now);
  expect(store.staleSince(now)).not.toBeNull();
  store.ackStale();
  for (let m = 1; m < 119; m++) expect(store.staleSince(now + m * 60e3)).toBeNull();
  expect(store.staleSince(now + 3 * 3600e3 + 1)).not.toBeNull(); // 2h after (now-valid) startedAt
  expect(store.autoFinishStale(now + 3 * 3600e3)).toBeNull();
});

test('S2 normal workout right after start, and 5 min clock jitter', async () => {
  await fresh(); const now = at(2026, 9, 10);
  const spy = jest.spyOn(Date, 'now').mockReturnValue(now); store.startEmpty();
  expect(store.staleSince(now)).toBeNull(); expect(store.staleRef(store.getState().active!, now)).toBe(now);
  spy.mockReturnValue(now - 5 * 60e3); expect(store.staleSince(now - 5 * 60e3)).toBeNull();
});

test('B1 recovery envelope merge: newer live by seq wins over older at', async () => {
  await fresh();
  const st = JSON.parse(JSON.stringify(store.getState())); st.saveSeq = 5; st.metaUpdatedAt = 9e12; st.active = null;
  const live = { seq: 6, at: 1, active: { id: 'x', startedAt: 1000, exercises: [] }, timer: null };
  const s = backup.parseBackup(JSON.stringify({ format: 'trening-recovery', state: st, live }));
  expect(s.active?.id).toBe('x');
});

test('P1 previousBlockFor: light block k=1 without own data -> null; heavy from other template', async () => {
  await fresh(); const X = ex('Back Squat').id;
  const item = (id: string) => ({ id, exerciseId: X, sets: 1, repMin: null, repMax: null, restSec: null, startWeight: '' as const, targetSec: '' as const, groupId: null });
  const T = store.newTemplate(); T.items.push(item('h') as any, item('l') as any); store.save(T);
  addWorkout(at(2026, 9, 3), [['Back Squat', [{ weight: 90, reps: 8 }]]], 'Other');
  expect(store.previousBlockFor(X, 1, 2, 'l', T.id)).toBeNull();
  expect(store.previousBlockFor(X, 0, 2, 'h', T.id)?.sets[0].weight).toBe(90);
});

test('R1 drop next (unticked) -> no rest; ticked drop -> rest; untick/retick', async () => {
  await fresh(); jest.spyOn(Date, 'now').mockReturnValue(at(2026, 9, 10));
  store.startEmpty(); store.addExerciseToActive(ex('Back Squat')); const a = store.getState().active!; const e = a.exercises[0];
  e.restSec = 77; e.sets = [set({ done: false, weight: 100, reps: 5 }), { ...set({ done: false, weight: 70, reps: 8 }), kind: 'drop' }, set({ done: false, weight: 100, reps: 5 })]; store.save(a);
  expect(store.toggleDone(0, 0)).toBeNull();
  expect(store.toggleDone(0, 1)).toBe(77);
  expect(store.toggleDone(0, 0)).toBeNull(); // untick
  expect(store.toggleDone(0, 0)).toBe(77); // retick: drop already done
});

test('ST1 reps PR badge vs "Max powtórzeń w serii" record (progress screen shows maxReps incl. assisted)', async () => {
  await fresh(); store.save();
  addWorkout(at(2026, 9, 1), [['Chin Up', [{ reps: 10, addKg: 0 }, { reps: 15, addKg: -20 }]]]);
  const w = addWorkout(at(2026, 9, 3), [['Chin Up', [{ reps: 12, addKg: 0 }]]]);
  const shown = stats.recordsFor(ex('Chin Up'), w.startedAt).maxRepsFree; // T7: karta pokazuje „bez asysty” (próg rekordu) osobno od „z asystą”
  const pr = stats.prMap(w).get(w.exercises[0].sets[0].id) ?? [];
  expect(pr.includes('powtórzenia') ? 12 > shown : true).toBe(true); // PR for 12 while record card says 15
});

test('P2 prevByItem: own block whose latest occurrence is drop-only does not erase working-weight prefill (like T5-07)', async () => {
  await fresh(); const X = ex('Back Squat').id;
  const item = (id: string) => ({ id, exerciseId: X, sets: 1, repMin: null, repMax: null, restSec: null, startWeight: '' as const, targetSec: '' as const, groupId: null });
  const T = store.newTemplate(); T.items.push(item('h') as any, item('l') as any); store.save(T);
  const w1 = addWorkout(at(2026, 9, 1), [['Back Squat', [{ weight: 100, reps: 5 }]], ['Back Squat', [{ weight: 60, reps: 12 }]]]);
  const w2 = addWorkout(at(2026, 9, 2), [['Back Squat', [{ weight: 100, reps: 5 }]], ['Back Squat', [{ weight: 40, reps: 15, kind: 'drop' }]]]);
  for (const w of [w1, w2]) { w.templateId = T.id; w.exercises[0].tplItemId = 'h'; w.exercises[1].tplItemId = 'l'; }
  addWorkout(at(2026, 9, 3), [['Back Squat', [{ weight: 90, reps: 8 }]]], 'Other'); store.save();
  store.startFromTemplate(T);
  expect(store.getState().active!.exercises[1].sets[0].weight).toBe(60);
});
