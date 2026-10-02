/* Runda 73 — testy z audytu T13 (nowa definicja rekordu: suma na treningu + e1RM). */
const log = (..._a: unknown[]) => { /* diagnostyka audytu wyciszona */ };
import * as store from '@/lib/store';
import * as stats from '@/lib/stats';
import * as units from '@/lib/units';
import { fresh, ex, addWorkout } from './helpers';

jest.setTimeout(60000);
const at = (y: number, m: number, d: number, h = 18) => new Date(y, m - 1, d, h).getTime();
afterEach(() => { units.applyUnit('kg'); jest.restoreAllMocks(); });

describe('t13 logic', () => {
  test('L1 volume total: warm-up out, drop in', async () => {
    await fresh();
    const w = addWorkout(at(2026, 9, 1), [['Back Squat', [{ weight: 60, reps: 5, kind: 'warmup', warmup: true }, { weight: 100, reps: 5 }, { weight: 80, reps: 8, kind: 'drop' }]]]);
    const s = stats.sessionsFor(ex('Back Squat'));
    expect(s[0].total).toBe(500 + 640);
    void w;
  });
  test('L2 bodyweight total: band and negative kg excluded, +kg included', async () => {
    await fresh(); const b = store.getState().bands[0];
    addWorkout(at(2026, 9, 1), [['Pull Up', [{ reps: 5 }, { reps: 5, addKg: 10 }, { reps: 8, bandId: b.id }, { reps: 8, addKg: -20 }, { reps: 8, bandId: b.id, addKg: -20 }]]]);
    expect(stats.sessionsFor(ex('Pull Up'))[0].total).toBe(10);
  });
  test('L3 lb: same entries -> no PR; one set +5 lb -> PR', async () => {
    await fresh(); units.applyUnit('lb'); const w = (x: number) => units.wIn(x) as number;
    addWorkout(at(2026, 9, 1), [['Bench Press (hantle)', [{ weight: w(52.5), reps: 8 }, { weight: w(52.5), reps: 8 }, { weight: w(52.5), reps: 8 }]]]);
    const same = addWorkout(at(2026, 9, 2), [['Bench Press (hantle)', [{ weight: w(52.5), reps: 8 }, { weight: w(52.5), reps: 8 }, { weight: w(52.5), reps: 8 }]]]);
    expect([...stats.prMap(same).values()]).toEqual([]);
    const up = addWorkout(at(2026, 9, 3), [['Bench Press (hantle)', [{ weight: w(52.5), reps: 8 }, { weight: w(52.5), reps: 8 }, { weight: w(57.5), reps: 8 }]]]);
    expect(stats.prMap(up).get(up.exercises[0].sets[2].id)).toContain('objętość treningu');
  });
  test('L4 summary details strings', async () => {
    await fresh(); addWorkout(at(2026, 9, 1), [['Back Squat', [{ weight: 90, reps: 5 }]]]);
    const w = addWorkout(at(2026, 9, 3), [['Back Squat', [{ weight: 100, reps: 5 }, { weight: 100, reps: 5 }]]]);
    const p = stats.workoutPRs(w); const d = p.flatMap(x => x.details);
    expect(d).toContain('e1RM 116,67 kg (seria 100×5)'); expect(d.some(x => /objętość treningu: 1000 kg/.test(x))).toBe(true);
  });
  test('L5 first-ever session gives nothing', async () => {
    await fresh(); const w = addWorkout(at(2026, 9, 1), [['Back Squat', [{ weight: 100, reps: 5 }]], ['Plank', [{ durationSec: 60 }]], ['Pull Up', [{ reps: 10 }]]]);
    expect(stats.workoutPRs(w)).toEqual([]); expect(stats.prMap(w).size).toBe(0);
  });
  test('L6 distance total PR without visible difference', async () => {
    await fresh(); addWorkout(at(2026, 9, 1), [['Bieg', [{ distanceM: 5000, durationSec: 1500 }]]]);
    const w = addWorkout(at(2026, 9, 3), [['Bieg', [{ distanceM: 5004, durationSec: 1490 }]]]);
    const p = stats.workoutPRs(w); const best = stats.fmtTotal(ex('Bieg'), stats.recordsFor(ex('Bieg'), w.startedAt).bestTotal);
    // eslint-disable-next-line no-console
    log('L6', p.map(x => x.details), 'prev best', best);
    expect(p).toEqual([]);
  });
  test('L7 performance: prMap over many sessions', async () => {
    await fresh(); const names = ['Back Squat', 'Bench Press (hantle)', 'Pull Up', 'Plank', 'Bieg', 'Leg Press'];
    const base = at(2018, 1, 1);
    for (let i = 0; i < 2500; i++) { const st = store.getState(); const w = addWorkoutNoSave(base + i * 86400e3, names.map(n => [n, [{ weight: 50 + i % 30, reps: 5, addKg: i % 3, durationSec: 60, distanceM: 3000 }, { weight: 50, reps: 5, durationSec: 60, distanceM: 2000 }, { weight: 50, reps: 5 }]] as any)); st.workouts.push(w); }
    store.save();
    const live = addWorkoutNoSave(at(2026, 9, 30), names.map(n => [n, [{ weight: 90, reps: 5, durationSec: 60, distanceM: 3000 }, { weight: 90, reps: 5 }]] as any));
    stats.prMap(live); // warm caches
    const t0 = performance.now(); for (let i = 0; i < 20; i++) stats.prMap(live); const ms = (performance.now() - t0) / 20;
    // eslint-disable-next-line no-console
    log('L7 prMap ms/render', ms.toFixed(2));
    store.save(); const t1 = performance.now(); stats.prMap(live); const cold = performance.now() - t1;
    // eslint-disable-next-line no-console
    log('L7 prMap cold ms', cold.toFixed(1));
    expect(ms).toBeLessThan(16);
  });
});

function addWorkoutNoSave(atTs: number, blocks: [string, any[]][]) {
  const mk = (p: any, i: number) => ({ id: Math.random().toString(36).slice(2), weight: '', reps: '', durationSec: '', distanceM: '', rpe: '', bandId: '', addKg: '', kind: 'normal', warmup: false, note: '', done: true, completedAt: atTs + i * 1000, actualRest: null, ...p });
  return { id: Math.random().toString(36).slice(2), ownerId: 'local', createdAt: atTs, updatedAt: atTs, loggedBy: 'local', sessionMode: 'solo', healthUUID: null, templateId: null, templateName: 'T', startedAt: atTs, finishedAt: atTs + 3600e3, note: '', exercises: blocks.map(([n, sets], bi) => ({ id: Math.random().toString(36).slice(2), exerciseId: ex(n).id, restSec: 90, repMin: null, repMax: null, groupId: null, sets: sets.map((s, i) => mk(s, bi * 10 + i)) })) } as any;
}
