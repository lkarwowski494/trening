/* Runda 73 — testy z audytu T13 (nowa definicja rekordu: suma na treningu + e1RM). */
import * as store from '@/lib/store';
import * as stats from '@/lib/stats';
import { fresh, ex } from './helpers';
jest.setTimeout(60000);
const at = (y: number, m: number, d: number, h = 18) => new Date(y, m - 1, d, h).getTime();
function mkW(atTs: number, blocks: [string, any[]][]) {
  const mk = (p: any, i: number) => ({ id: Math.random().toString(36).slice(2), weight: '', reps: '', durationSec: '', distanceM: '', rpe: '', bandId: '', addKg: '', kind: 'normal', warmup: false, note: '', done: true, completedAt: atTs + i * 1000, actualRest: null, ...p });
  return { id: Math.random().toString(36).slice(2), ownerId: 'local', createdAt: atTs, updatedAt: atTs, loggedBy: 'local', sessionMode: 'solo', healthUUID: null, templateId: null, templateName: 'T', startedAt: atTs, finishedAt: atTs + 3600e3, note: '', exercises: blocks.map(([n, sets], bi) => ({ id: Math.random().toString(36).slice(2), exerciseId: ex(n).id, restSec: 90, repMin: null, repMax: null, groupId: null, sets: sets.map((s, i) => mk(s, bi * 10 + i)) })) } as any;
}
test('rekordy i sesje na 300 i 1000 treningach: wyniki kompletne (czasy: scripts/perf/records.perf.tsx)', async () => {
  await fresh(); const names = ['Back Squat', 'Bench Press (hantle)', 'Pull Up', 'Plank', 'Bieg', 'Leg Press'];
  for (const N of [300, 1000]) {
    await fresh(); const base = at(2018, 1, 1);
    for (let i = 0; i < N; i++) store.getState().workouts.push(mkW(base + i * 86400e3, names.map(n => [n, [{ weight: 50 + i % 30, reps: 5, durationSec: 60, distanceM: 3000 }, { weight: 50, reps: 5, durationSec: 60, distanceM: 2000 }, { weight: 50, reps: 5 }]] as any)));
    store.save();
    const live = mkW(at(2026, 9, 30), names.map(n => [n, [{ weight: 90, reps: 5, durationSec: 60, distanceM: 3000 }, { weight: 90, reps: 5 }]] as any));
    /* M1-060: test miał tylko pomiary (bez asercji); czasy mierzy scripts/perf/records.perf.tsx (z limitami), tu — wyniki na dużej historii */
    const pm = stats.prMap(live); expect(pm.size).toBeGreaterThan(0);
    for (const n of names) { expect(stats.sessionsFor(ex(n), live.startedAt)).toHaveLength(N); expect(stats.recordsFor(ex(n), live.startedAt)).toBeTruthy(); }
  }
});
