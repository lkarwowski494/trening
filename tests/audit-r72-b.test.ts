/* Runda 72 — testy z audytu T6 (regresje po zmianach rundy 72). */
/* T6 audit repros part b (temporary). */
import fc from 'fast-check';
import * as store from '@/lib/store';
import * as stats from '@/lib/stats';
import * as backup from '@/lib/backup';
import { fresh, ex, addWorkout, set, legacyBandKg } from './helpers';

jest.setTimeout(120000);
const at = (y: number, m: number, d: number, h = 18) => new Date(y, m - 1, d, h).getTime();
afterEach(() => jest.restoreAllMocks());
const item = (id: string, exerciseId: string, sets: number) => ({ id, exerciseId, sets, repMin: null, repMax: null, restSec: null, startWeight: '' as const, targetSec: '' as const, groupId: null });

test('B1 band-only assistance (nominalKg empty) with band deleted: reps not copied as unassisted on start', async () => {
  await fresh();
  const st = store.getState(); const b = st.bands[0];
  addWorkout(at(2026, 9, 1), [['Pull Up', [{ addKg: '', bandId: b.id, reps: 12 }]]]);
  st.bands = st.bands.filter(x => x.id !== b.id); store.save();
  const tpl = { id: 'T', ownerId: 'local', createdAt: 0, updatedAt: 0, name: 'T', items: [item('i1', ex('Pull Up').id, 1)] };
  st.templates.push(tpl as any); store.save();
  jest.spyOn(Date, 'now').mockReturnValue(at(2026, 9, 3));
  store.startFromTemplate(tpl as any);
  expect(store.getState().active!.exercises[0].sets[0].reps).toBe(''); // got 12
});

test('B2 "Poprzednio" shown on screen but tick does not use it (assistLost) — hint/UI mismatch', async () => {
  await fresh();
  const st = store.getState(); const b = st.bands[0]; legacyBandKg(b, 20);
  addWorkout(at(2026, 9, 1), [['Pull Up', [{ addKg: -20, bandId: b.id, reps: 8 }]]]);
  st.bands = st.bands.filter(x => x.id !== b.id); store.save();
  jest.spyOn(Date, 'now').mockReturnValue(at(2026, 9, 3));
  store.startEmpty(); store.addExerciseToActive(ex('Pull Up'));
  const a = store.getState().active!; const prev = store.previousBlockFor(ex('Pull Up').id, 0, 1, undefined, null);
  const shown = store.hintFor(prev?.sets, a.exercises[0].sets, 0, ex('Pull Up'));
  store.toggleDone(0, 0);
  const s = a.exercises[0].sets[0];
  // either the screen must not show the hint, or the tick must use it
  expect(shown == null || s.reps !== '').toBe(true);
});

test('B3 template with the exercise twice, older same-template data has no tplItemId (pre-round-10) → light block loses hint', async () => {
  await fresh();
  const st = store.getState(); const X = ex('Back Squat').id;
  const tpl = { id: 'T', ownerId: 'local', createdAt: 0, updatedAt: 0, name: 'T', items: [item('h', X, 1), item('l', X, 1)] };
  st.templates.push(tpl as any);
  const old = addWorkout(at(2026, 9, 1), [['Back Squat', [{ weight: 100, reps: 5 }]], ['Back Squat', [{ weight: 80, reps: 10 }]]]); old.templateId = 'T';
  addWorkout(at(2026, 9, 3), [['Back Squat', [{ weight: 90, reps: 8 }]]], 'Other');
  store.save();
  const light = store.previousBlockFor(X, 1, 2, 'l', 'T');
  expect(light?.sets.map(s => s.weight)).toEqual([80]); // got null
});

test('B4 recovery envelope without seqs: older live must not overwrite newer state (init compares "at")', async () => {
  await fresh();
  const st = JSON.parse(JSON.stringify(store.getState())); delete st.saveSeq; st.metaUpdatedAt = 2000; st.active = null;
  const live = { at: 1000, active: { id: 'old', startedAt: 500, exercises: [] }, timer: null };
  const s = backup.parseBackup(JSON.stringify({ format: 'trening-recovery', state: st, live }));
  expect(s.active).toBeNull();
});

test('B5 CSV: deleted band "guma ?" and missing exercise "?" rows are present; order oldest first', async () => {
  await fresh();
  const st = store.getState(); const b = st.bands[0];
  addWorkout(at(2026, 9, 2), [['Pull Up', [{ addKg: -10, bandId: b.id, reps: 5 }]]], 'B');
  const w1 = addWorkout(at(2026, 9, 1), [['Back Squat', [{ weight: 100, reps: 5 }]]], 'A');
  w1.exercises[0].exerciseId = 'missing'; st.bands = []; store.save();
  const csv = backup.buildCsv().trim().split('\n');
  expect(csv[1]).toContain(',A,'); expect(csv[1]).toContain(',?,'); expect(csv[2]).toContain('guma ?'); expect(csv[2]).toContain(',-10,');
});

/* B6–B8 (masa ciała zamrożona w treningu, schemat 12) — nieaktualne od rundy 75 (Q-001: masa ciała poza obliczeniami). */
test('B7/B8 (runda 75): stare pola masy ciała (Ustawienia, trening, udział %) usuwane przy migracji do schematu 13; objętość podciągania bez dociążenia = 0', async () => {
  await fresh();
  const st = JSON.parse(JSON.stringify(store.getState())); st.schemaVersion = 12;
  const pu = st.exercises.find((e: any) => e.name === 'Pull Up'); pu.bodyweightPct = 100;
  st.workouts = [at(2026, 9, 1)].map((t, i) => ({ id: 'w' + i, startedAt: t, finishedAt: t + 1, bodyWeightKg: 80, exercises: [{ exerciseId: pu.id, sets: [set({ addKg: 0, reps: 5 })] }] }));
  const s = backup.parseBackup(JSON.stringify({ format: 'trening-backup', schemaVersion: 12, state: st }));
  expect('bodyWeightKg' in s.settings).toBe(false); expect('bodyWeightKg' in s.workouts[0]).toBe(false); expect('bodyweightPct' in s.exercises.find(e => e.name === 'Pull Up')!).toBe(false);
  expect(s.schemaVersion).toBe(15); /* P-003 E1: schemat 14 (miejsca treningu); 15 — przyrząd bloku (8c); migracja P-004 usunięta w rundzie 82 */
  store.replaceState(s); expect(store.volume(store.getState().workouts[0])).toBe(0);
});

test('B9 property: superset with drop sets — rest only after complete round (rounds counted without drop sets)', async () => {
  await fresh(); jest.spyOn(Date, 'now').mockReturnValue(at(2026, 9, 10));
  let fails = 0; let first: any = null;
  fc.assert(fc.property(fc.array(fc.array(fc.constantFrom('normal', 'drop'), { minLength: 1, maxLength: 4 }), { minLength: 2, maxLength: 3 }), fc.array(fc.nat(2), { maxLength: 20 }), (kinds, order) => {
    store.getState().active = null; store.startEmpty(); const a = store.getState().active!;
    const names = ['Bench Press (sztanga)', 'Bent Over Row (sztanga)', 'Back Squat'];
    kinds.forEach((_, i) => store.addExerciseToActive(ex(names[i])));
    a.exercises.forEach((e, i) => { e.groupId = 'g'; e.restSec = 10; e.sets = kinds[i].map(k => ({ ...set({ done: false, weight: 50, reps: 8 }), kind: k as any })); });
    store.save(a);
    const rounds = (x: any) => x.sets.filter((s: any) => s.done && s.kind !== 'drop').length;
    for (const o of order) { const ei = o % kinds.length; const e = a.exercises[ei]; const si = e.sets.findIndex(s => !s.done); if (si < 0) continue;
      const r = store.toggleDone(ei, si);
      const nxtDrop = e.sets[si + 1] && !e.sets[si + 1].done && e.sets[si + 1].kind === 'drop';
      const k = rounds(e);
      const closes = ei === a.exercises.length - 1 && !e.sets.some(s => !s.done && s.kind !== 'drop') && a.exercises.every(x => x.sets.some(s => s.done && s.kind !== 'drop') || !x.sets.some(s => !s.done && s.kind !== 'drop')); /* runda 75 (Q-006): ostatnia seria ostatniego ćwiczenia grupy zamyka rundę, gdy reszta już zaczęła */
      const complete = !nxtDrop && (closes || a.exercises.every(x => rounds(x) >= k || x.sets.every(s => s.done || s.kind === 'drop'))); /* T9: pominięty drop set nie blokuje rundy */
      const ok = complete ? r === 10 : r === null;
      if (!ok) { fails++; if (!first) first = { kinds, order, ei, si, r }; }
    }
  }), { numRuns: 300 });
  if (fails) console.log('B9 mismatches', fails, JSON.stringify(first));
  expect(fails).toBe(0);
});
