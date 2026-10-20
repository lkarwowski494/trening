/* M1-audytor-generalny-060: pomiary czasu rekordów i sesji z asercjami (przeniesione z bramki verify — asercje na zegar ścienny padały na obciążonej
 * maszynie): prMap na 2500 treningach (L7, limit 16 ms na render) oraz prMap / recordsFor / sessionsFor na 300 i 1000 treningach. `npm run perf`. */
import * as store from '@/lib/store';
import * as stats from '@/lib/stats';
import { fresh, ex } from '../../tests/helpers';

const realPerf = require('perf_hooks').performance; const now = () => realPerf.now() as number;
const names = ['Back Squat', 'Bench Press (hantle)', 'Pull Up', 'Plank', 'Bieg', 'Leg Press'];
const at = (y: number, m: number, d: number, h = 18) => new Date(y, m - 1, d, h).getTime();
function mkW(atTs: number, blocks: [string, any[]][]) {
  const mk = (p: any, i: number) => ({ id: Math.random().toString(36).slice(2), weight: '', reps: '', durationSec: '', distanceM: '', rpe: '', bandId: '', addKg: '', kind: 'normal', warmup: false, note: '', done: true, completedAt: atTs + i * 1000, actualRest: null, ...p });
  return { id: Math.random().toString(36).slice(2), ownerId: 'local', createdAt: atTs, updatedAt: atTs, loggedBy: 'local', sessionMode: 'solo', healthUUID: null, templateId: null, templateName: 'T', startedAt: atTs, finishedAt: atTs + 3600e3, note: '', exercises: blocks.map(([n, sets], bi) => ({ id: Math.random().toString(36).slice(2), exerciseId: ex(n).id, restSec: 90, repMin: null, repMax: null, groupId: null, sets: sets.map((s, i) => mk(s, bi * 10 + i)) })) } as any;
}
const history = (n: number) => {
  const base = at(2018, 1, 1);
  for (let i = 0; i < n; i++) store.getState().workouts.push(mkW(base + i * 86400e3, names.map(x => [x, [{ weight: 50 + i % 30, reps: 5, addKg: i % 3, durationSec: 60, distanceM: 3000 }, { weight: 50, reps: 5, durationSec: 60, distanceM: 2000 }, { weight: 50, reps: 5 }]] as any)));
  store.save();
  return mkW(at(2026, 9, 30), names.map(x => [x, [{ weight: 90, reps: 5, durationSec: 60, distanceM: 3000 }, { weight: 90, reps: 5 }]] as any));
};
/** Średnia z `n` powtórzeń, najlepsza z kilku prób (odporna na GC i JIT). */
const ms = (f: () => unknown, n = 20, tries = 3) => { let best = Infinity; for (let k = 0; k < tries; k++) { const t = now(); for (let i = 0; i < n; i++) f(); best = Math.min(best, (now() - t) / n); } return best; };

jest.setTimeout(600000);
test('L7: prMap na 2500 treningach — poniżej 16 ms na render', async () => {
  await fresh(); const live = history(2500); stats.prMap(live);
  expect(ms(() => stats.prMap(live))).toBeLessThan(16);
});
test.each([300, 1000])('prMap, recordsFor i sessionsFor na %i treningach — poniżej 16 ms (prMap) i 50 ms (rekordy / sesje 6 ćwiczeń)', async N => {
  await fresh(); const live = history(N); stats.prMap(live);
  expect(ms(() => stats.prMap(live))).toBeLessThan(16);
  expect(ms(() => names.forEach(x => stats.recordsFor(ex(x), live.startedAt)))).toBeLessThan(50);
  expect(ms(() => names.forEach(x => stats.sessionsFor(ex(x), live.startedAt)))).toBeLessThan(50);
});
