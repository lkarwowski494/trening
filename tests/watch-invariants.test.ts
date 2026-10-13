/*
 * Niezmienniki zegarka (docs/20 rodzaj 5): losowe sekwencje działań na telefonie (odhaczenie, cofnięcie, pominięcie bloku, dodanie serii, zmiana ciężaru, pauza) przeplatane
 * zdarzeniami z zegarka (poprawnymi, powtórzonymi, z nieznanymi id, z dziwnym czasem). Po każdym kroku: spójność treningu, znacznik „do uzupełnienia” tylko przy odhaczonej serii
 * bez rekordu, ograniczony dziennik zdarzeń, powtórzone zdarzenie nie zmienia danych, migawka mieści się w budżecie, model zegarka nie rzuca wyjątku.
 */
import fc from 'fast-check';
import * as store from '@/lib/store';
import { applyWatchEvent } from '@/lib/watch/apply';
import { buildSnapshot } from '@/lib/watch/snapshot';
import { snapshotBytes } from '@/lib/watch/link';
import { clientStep, clientView, initialClient } from '@/lib/watch/client';
import { WATCH, WATCH_EVENT_TYPES, type WatchEvent } from '@/lib/watch/protocol';
import { completeSet } from '@/lib/setFlow';
import { prMap } from '@/lib/stats';
import * as timer from '@/lib/timer';
import { world, A, NOW, teardownWorld } from './watch-world';

jest.setTimeout(300000);
afterEach(teardownWorld);
type Act = { k: 'tick' | 'undo' | 'skip' | 'addSet' | 'weight' | 'pause' | 'ev' | 'dup'; a: number; b: number; t: number };
const act = fc.record({ k: fc.constantFrom<Act['k']>('tick', 'undo', 'skip', 'addSet', 'weight', 'pause', 'ev', 'ev', 'ev', 'ev', 'dup'), a: fc.nat(8), b: fc.nat(3), t: fc.integer({ min: -30, max: 120 }) });
const seq = fc.array(act, { minLength: 4, maxLength: 28 });

let n = 0;
async function run(steps: Act[], ss: boolean) {
  await world({ ss }); const log: WatchEvent[] = []; let cs = initialClient({ client: 'apple', app: '0.20.0', session: true }); let clock = NOW;
  for (const s of steps) {
    clock += 3000; jest.setSystemTime(clock); const w = A(); const sets = w.exercises.flatMap(e => e.sets);
    if (s.k === 'tick') { timer.tick(); }
    else if (s.k === 'undo') { const e = w.exercises[s.a % w.exercises.length]; await completeSet(w.exercises.indexOf(e), s.b % e.sets.length); }
    else if (s.k === 'skip') { const e = w.exercises[s.a % w.exercises.length]; e.skipped ? store.unskipExercise(e.id) : store.skipExercise(e.id); }
    else if (s.k === 'addSet') store.addSet(s.a % w.exercises.length);
    else if (s.k === 'weight') { sets[s.a % sets.length].weight = 60 + s.b * 5; store.save(w); }
    else if (s.k === 'pause') (w.pausedAt != null ? store.resumeWorkout() : store.pauseWorkout());
    else if (s.k === 'dup' && log.length) { const before = JSON.stringify(A()); const r = await applyWatchEvent(log[s.a % log.length], 1); expect(r.status).not.toBe('applied'); expect(JSON.stringify(A())).toBe(before); }
    else if (s.k === 'ev') {
      const type = WATCH_EVENT_TYPES[s.a % WATCH_EVENT_TYPES.length]; const target = s.b === 3 ? { setId: 'nie ma', blockId: 'nie ma' } : { setId: sets[(s.a + s.b) % sets.length].id, blockId: w.exercises[s.a % w.exercises.length].id };
      const ev = { v: 1, kind: 'event', eventId: `i-${++n}`, workoutId: w.id, baseRev: 1, at: clock + s.t * 1000, client: 'apple', type, saved: true, ...target } as unknown as WatchEvent;
      const r = await applyWatchEvent(ev, 1); if (r.status === 'applied') log.push(ev);
    }
    /* niezmienniki */
    const a = A(); const ids = a.exercises.flatMap(e => e.sets.map(x => x.id)); expect(new Set(ids).size).toBe(ids.length);
    for (const e of a.exercises) for (const x of e.sets) { if (x.toFill) expect(x.done).toBe(true); if (x.done) expect(x.completedAt).not.toBeNull(); }
    const pr = prMap(a); for (const e of a.exercises) for (const x of e.sets) if (x.toFill) expect(pr.has(x.id)).toBe(false);
    expect((a.watchEvents ?? []).length).toBeLessThanOrEqual(WATCH.EVENT_LOG_MAX);
    const T = timer.T; const snap = buildSnapshot(a, { rev: 1, nowMs: Date.now(), rest: { on: T.on, setId: T.setId, endAt: T.endAt, total: T.total } });
    expect(snapshotBytes(snap)).toBeLessThanOrEqual(WATCH.MSG_MAX_BYTES); if (snap.phase === 'rest') expect(ids).toContain(snap.rest!.setId); if (snap.phase === 'idle') expect(snap.now).toBeNull();
    expect(snap.doneCount).toBeLessThanOrEqual(snap.totalCount); expect(snap.toFillCount).toBeLessThanOrEqual(snap.doneCount);
    cs = clientStep(cs, { at: clock, input: { t: 'receive', msg: snap } }).state; const v = clientView(cs, clock); expect(v.actions.every(x => ['done', 'differ', 'skip', 'undo'].includes(x))).toBe(true);
    cs = clientStep(cs, { at: clock, input: { t: 'press', button: 'main' } }).state; cs = { ...cs, queue: [] };
  }
}
test('losowe sekwencje (telefon + zegarek): spójność danych, rekordy bez serii „do uzupełnienia”, idempotencja zdarzeń, migawka w budżecie', async () => {
  await fc.assert(fc.asyncProperty(seq, fc.boolean(), async (steps, ss) => { await run(steps, ss); }), { numRuns: Number(process.env.MATRIX_RUNS || 40) });
});
