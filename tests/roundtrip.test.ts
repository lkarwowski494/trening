/* Runda 72 — testy z audytu tematycznego T4 (trwałość/porzucony trening, wymiana danych). Nazwy części testów opisują scenariusz dawnego błędu; asercje sprawdzają poprawne zachowanie. */
import fc from 'fast-check';
import * as store from '@/lib/store';
import * as units from '@/lib/units';
import { buildBackup, parseBackup } from '@/lib/backup';
import { fresh, ex, addWorkout } from './helpers';

const strip = (s: any) => { const c = JSON.parse(JSON.stringify(s)); delete c.metaUpdatedAt; delete c.saveSeq; delete c.userTouched; return c; };

const kg = fc.integer({ min: 0, max: 30000 }).map(n => n / 100);
const setArb = fc.record({
  weight: fc.oneof(fc.constant(''), kg), reps: fc.oneof(fc.constant(''), fc.integer({ min: 0, max: 100 })),
  rpe: fc.oneof(fc.constant(''), fc.integer({ min: 0, max: 100 }).map(n => n / 10)),
  addKg: fc.oneof(fc.constant(''), fc.integer({ min: -5000, max: 5000 }).map(n => n / 100)),
  durationSec: fc.oneof(fc.constant(''), fc.integer({ min: 0, max: 86400 })), distanceM: fc.oneof(fc.constant(''), fc.integer({ min: 0, max: 100000 })),
  kind: fc.constantFrom('normal', 'warmup', 'drop', 'failure'), note: fc.string(),
});
const NAMES = ['Back Squat', 'Pull Up', 'Bench Press (hantle)', 'Plank', 'Bieg', "Farmer's Walk", 'Burpees'];

describe('roundtrip', () => {
  test('export→import preserves state (property)', async () => {
    await fc.assert(fc.asyncProperty(fc.array(fc.tuple(fc.constantFrom(...NAMES), fc.array(setArb, { minLength: 1, maxLength: 4 })), { minLength: 1, maxLength: 4 }), fc.constantFrom('kg', 'lb'), async (blocks, unit) => {
      await fresh(); const st = store.getState(); st.settings.unit = unit as any; store.applyPrefs();
      addWorkout(Date.UTC(2026, 8, 1, 10), blocks.map(([n, sets]) => [n, sets.map(s => ({ ...s, warmup: s.kind === 'warmup' } as any))]));
      const before = strip(store.getState());
      const after = parseBackup(JSON.stringify(buildBackup())); store.replaceState(after);
      expect(strip(store.getState())).toEqual(before);
      units.applyUnit('kg');
    }), { numRuns: 60 });
  });
});
