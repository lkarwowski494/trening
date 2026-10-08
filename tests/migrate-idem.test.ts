/* Runda 72 — testy z audytu tematycznego T4 (trwałość/porzucony trening, wymiana danych). Nazwy części testów opisują scenariusz dawnego błędu; asercje sprawdzają poprawne zachowanie. */
import fc from 'fast-check';
import * as store from '@/lib/store';
import { seedState } from '@/lib/seed';
import { fresh } from './helpers';

const strip = (s: any) => { const c = JSON.parse(JSON.stringify(s)); delete c.metaUpdatedAt; delete c.saveSeq; delete c.userTouched; return c; };
const val = fc.oneof(fc.constant(''), fc.constant(null), fc.integer({ min: -100000, max: 100000 }).map(n => n / 1000), fc.double({ noNaN: false }), fc.string({ maxLength: 6 }), fc.constantFrom('62,5', ' 5 ', '-0', '1e3', '-,5', '0x10', '2026-09-01', 'Infinity', '4.999', '-0.005', '0.005', '0.015', '1.005'), fc.boolean(), fc.integer());
const idv = fc.oneof(fc.constantFrom('a', 'b', 'c', '', 1, 2), fc.constant(undefined));
const setArb = fc.record({ id: idv, weight: val, reps: val, durationSec: val, distanceM: val, rpe: val, addKg: val, bandId: idv, kind: fc.constantFrom('normal', 'warmup', 'drop', 'failure', 'x', undefined), warmup: fc.boolean(), done: fc.boolean(), completedAt: val, actualRest: val, note: val, noBand: fc.boolean(), hinted: fc.oneof(fc.constant(undefined), fc.record({ weight: val, reps: val, bandId: idv, kind: val })) }, { requiredKeys: [] });
const wexArb = fc.record({ id: idv, exerciseId: idv, restSec: val, repMin: val, repMax: val, groupId: fc.constantFrom(null, 'g1', 'g2', 3), sets: fc.array(setArb, { maxLength: 3 }), tplItemId: idv, impl: fc.constantFrom('dumbbell', 'electric', 'x', undefined), swappedFrom: fc.oneof(idv, fc.constantFrom(null, 0, {})), implPinned: fc.constantFrom(true, false, 'true', 1, undefined), splitFrom: fc.oneof(idv, fc.constant(null)), altSkip: fc.constantFrom(true, false, 1, 'x', undefined) /* E2 (schemat 16) */ }, { requiredKeys: [] });
const wArb = fc.record({ id: idv, startedAt: val, finishedAt: val, staleAck: val, bodyWeightKg: val /* runda 72 */, healthUUID: val, templateName: val, note: val, templateId: idv, exercises: fc.array(wexArb, { maxLength: 3 }), createdAt: val, updatedAt: val }, { requiredKeys: [] });
const exArb = fc.record({ id: idv, name: fc.constantFrom('Back Squat', ' X  y ', '', 'Pull Up', 'Goblet Squat', 'toString', 'Plank'), group: fc.constantFrom('nogi', 'zz', undefined), equipment: fc.constantFrom('hantle', 'masa ciała', 'zz', undefined), metric: fc.constantFrom('reps', 'time', 'zz', undefined), loadMode: fc.constantFrom('per_dumbbell', 'total', 'zz', undefined), restSec: val, restWarmupSec: val, bodyweightPct: val, archived: fc.constantFrom(true, false, 'yes', undefined), lib: fc.constantFrom(true, false, undefined), muscles: fc.constantFrom(undefined, ['klatka'], [1]), bandAssistable: val }, { requiredKeys: ['name'] });
const morningArb = fc.record({ id: idv, date: fc.constantFrom('2026-09-01', '2026-9-1', '2026-02-30', '2026-09-01T10:00', '2026-09-02'), bb: val, sleepScore: val, sleepH: val, weight: val, updatedAt: val }, { requiredKeys: ['date'] });
const bandArb = fc.record({ id: idv, color: val, level: val, nominalKg: val }, { requiredKeys: [] });
const tplArb = fc.record({ id: idv, name: val, items: fc.array(fc.record({ id: idv, exerciseId: idv, sets: val, repMin: val, repMax: val, restSec: val, startWeight: val, targetSec: val, groupId: fc.constantFrom(null, 'g1', 'g2'), alternates: fc.oneof(fc.constantFrom(undefined, null, 'x', {}), fc.array(fc.record({ locationId: idv, exerciseId: idv, restSec: val, impl: fc.constantFrom('dumbbell', 'x', undefined), junk: val }, { requiredKeys: [] }), { maxLength: 3 })) /* E2 W3 (schemat 16) */ }, { requiredKeys: [] }), { maxLength: 3 }) }, { requiredKeys: [] });
/* audyt 0.10 DAT-06 (B4) i A1/B1: pola planu z 08.10 — nazwy ze spacjami i emoji na granicy 40, zmiany dni, historia planu, zapisane plany ze zmianami dni */
const nameArb = fc.oneof(val, fc.constantFrom('A'.repeat(32) + ' ' + 'B'.repeat(7), 'A'.repeat(39) + '💪', ' x'.repeat(30), 'Plan  na  jesień ', '💪'.repeat(25)));
const dayArb = fc.oneof(fc.constant(null), idv, fc.constantFrom('t1', 't2', 5));
const daysArb = fc.oneof(fc.array(dayArb, { maxLength: 9 }), val);
const keyArb = fc.constantFrom('2026-09-01', '2026-10-06', '2026-10-09', '2026-13-45', 'zła', '2026-9-1');
const ovArb = fc.oneof(fc.constant(undefined), val, fc.dictionary(keyArb, dayArb, { maxKeys: 4 }));
const planArb = {
  weekPlan: fc.oneof(fc.constant(undefined), val, fc.record({ days: daysArb, name: nameArb }, { requiredKeys: [] })),
  savedPlans: fc.oneof(fc.constant(undefined), val, fc.array(fc.oneof(val, fc.record({ id: idv, name: nameArb, days: daysArb, overrides: ovArb }, { requiredKeys: [] })), { maxLength: 4 })),
  planOverrides: ovArb,
  planHistory: fc.oneof(fc.constant(undefined), val, fc.array(fc.oneof(val, fc.record({ from: keyArb, days: daysArb }, { requiredKeys: [] })), { maxLength: 5 })),
  deloadSnooze: fc.oneof(keyArb, val, fc.constant(undefined)),
};
const stateArb = fc.record({
  ...planArb,
  schemaVersion: fc.constantFrom(undefined, 5, 9, 10, 11, '11', 12, 17, 18),
  exercises: fc.array(exArb, { maxLength: 4 }), templates: fc.array(tplArb, { maxLength: 2 }), workouts: fc.array(wArb, { maxLength: 3 }),
  active: fc.oneof(fc.constant(null), wArb), mornings: fc.array(morningArb, { maxLength: 3 }), bands: fc.array(bandArb, { maxLength: 2 }),
  settings: fc.record({ unit: fc.constantFrom('kg', 'lb', 'x'), bodyWeightKg: val, defaultRest: val, language: fc.constantFrom('pl', 'en', 'auto', 'x'), futureSetting: val /* audyt 0.10 J1: nieznane ustawienie zostaje */ }, { requiredKeys: [] }),
  timer: fc.record({ restEndAt: val, restTotal: val, restSetId: idv, setStartAt: val, setTarget: val, setId: idv }, { requiredKeys: [] }),
});

test('migrate is idempotent through JSON (export→import is a no-op)', async () => {
  await fresh();
  fc.assert(fc.property(stateArb, raw => {
    const a = strip(store.migrate(JSON.parse(JSON.stringify(raw))));
    const b = strip(store.migrate(JSON.parse(JSON.stringify(a))));
    expect(b).toEqual(a);
  }), { numRuns: 3000 });
});
