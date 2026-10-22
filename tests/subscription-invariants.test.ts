/*
 * 0.17.0, niezmienniki subskrypcji (docs/27 7.1 pkt 5, docs/20 rodzaj 5): losowe sekwencje działań użytkownika i sklepu na PRAWDZIWYM strażniku (lib/entitlement.ts) i
 * sztucznym sklepie, z fałszywym zegarem. Po każdym kroku: (1) zakup/przywracanie/odświeżenie/wygaśnięcie/zwrot/sieć nie zmieniają treningów, (2) strażnik wpuszcza ⇔ pełny dostęp albo
 * limit dni nie wyczerpany albo dziś już jest dniem treningowym (niezależny model licznika: różne dni startów w bieżącym miesiącu po ostatnim wygaśnięciu), (3) w stanie free w żadnym miesiącu nie powstaje więcej niż 5 dni treningowych
 * od ostatniego wygaśnięcia (M5 S1), (4) dane treningowe (kopia) zawsze zawierają wszystkie treningi, (5) trening wstecz nigdy nie jest blokowany ani liczony. Ziarno: MATRIX_SEED jak w matrix-invariants.
 */
import fc from 'fast-check';
import * as store from '@/lib/store';
import { PAYWALL, ENTITLEMENT_PLANS, entitlementEnd, type EntitlementPlan } from '@/lib/access';
import { setStoreAdapter, resetStoreAdapterForTests } from '@/lib/store-adapter';
import { createFakeStore } from '@/lib/store-fake';
import * as ent from '@/lib/entitlement';
import { buildBackup } from '@/lib/backup';
import { fresh, addWorkout } from './helpers';

jest.setTimeout(300000);
const DAY = 86400e3; const START = new Date(2026, 9, 14, 12, 0).getTime();
const SEED = process.env.MATRIX_SEED === 'random' ? Date.now() % 2147483647 : Number(process.env.MATRIX_SEED || 20261006);
type Act = { k: 'buy'; plan: EntitlementPlan } | { k: 'expire' } | { k: 'refund' } | { k: 'restore' } | { k: 'offline'; on: boolean } | { k: 'refresh' } | { k: 'start' } | { k: 'back' } | { k: 'days'; d: number } | { k: 'family' };
const actArb: fc.Arbitrary<Act> = fc.oneof(
  { weight: 3, arbitrary: fc.constantFrom(...ENTITLEMENT_PLANS).map(plan => ({ k: 'buy', plan }) as Act) },
  { weight: 2, arbitrary: fc.constant<Act>({ k: 'expire' }) }, { weight: 1, arbitrary: fc.constant<Act>({ k: 'refund' }) }, { weight: 1, arbitrary: fc.constant<Act>({ k: 'restore' }) },
  { weight: 2, arbitrary: fc.boolean().map(on => ({ k: 'offline', on }) as Act) }, { weight: 1, arbitrary: fc.constant<Act>({ k: 'refresh' }) },
  { weight: 8, arbitrary: fc.constant<Act>({ k: 'start' }) }, { weight: 2, arbitrary: fc.constant<Act>({ k: 'back' }) },
  { weight: 4, arbitrary: fc.integer({ min: 1, max: 45 }).map(d => ({ k: 'days', d }) as Act) }, { weight: 1, arbitrary: fc.constant<Act>({ k: 'family' }) },
);
const dayOf = (ts: number) => { const d = new Date(ts); return d.getFullYear() * 400 + d.getMonth() * 32 + d.getDate(); };
const monthOf = (ts: number) => { const d = new Date(ts); return d.getFullYear() * 12 + d.getMonth(); };
const snapW = () => JSON.stringify(store.getState().workouts);
afterEach(() => { PAYWALL.ENABLED = false; ent.resetEntitlementsForTests(); resetStoreAdapterForTests(); jest.useRealTimers(); });

test(`niezmienniki subskrypcji w losowych sekwencjach (ziarno ${SEED})`, async () => {
  await fc.assert(fc.asyncProperty(fc.array(actArb, { minLength: 1, maxLength: 40 }), async acts => {
    jest.useFakeTimers({ now: START }); await fresh(); ent.resetEntitlementsForTests(); PAYWALL.ENABLED = true;
    const fake = createFakeStore([]); setStoreAdapter(fake); await ent.initEntitlements(); const open = jest.fn();
    const live: number[] = []; let backs = 0;
    const lastExpiry = (now: number): number | null => { let best: number | null = null; for (const e of fake.entitlements() ?? []) { const end = entitlementEnd(e); if (end != null && end !== Infinity && end <= now && (best == null || end > best)) best = end; } return best; };
    for (const a of acts) {
      const before = snapW(); const now = Date.now();
      if (a.k === 'buy') await ent.purchasePlan(a.plan);
      else if (a.k === 'expire') fake.setEntitlements([]);
      else if (a.k === 'refund') fake.setEntitlements((fake.entitlements() ?? []).map(e => ({ ...e, revokedAt: now - 1 })));
      else if (a.k === 'family') fake.setEntitlements([...(fake.entitlements() ?? []), { plan: 'monthly', source: 'family', expiresAt: now + 20 * DAY }]);
      else if (a.k === 'restore') await ent.restorePurchases();
      else if (a.k === 'offline') { fake.offline = a.on; await ent.refreshEntitlements(); }
      else if (a.k === 'refresh') await ent.refreshEntitlements();
      else if (a.k === 'days') { jest.setSystemTime(now + a.d * DAY); await ent.refreshEntitlements(); }
      else if (a.k === 'back') { addWorkout(now - 1000, [['Back Squat', [{ weight: 100, reps: 5, done: true }]]], 'Past'); backs++; }
      else {
        const v = ent.accessNow(now); const open0 = open.mock.calls.length; const ok = ent.guardLiveStart('empty', now, open);
        const since = lastExpiry(now); const days = new Set(live.filter(t => monthOf(t) === monthOf(now) && (since == null || t >= since)).map(dayOf)); const used = days.size;
        const expected = v.level === 'full' || used < PAYWALL.FREE_TRAINING_DAYS_PER_MONTH || days.has(dayOf(now));
        expect({ ok, expected, level: v.level, used }).toEqual({ ok: expected, expected, level: v.level, used });
        expect(open.mock.calls.length - open0).toBe(ok ? 0 : 1);
        if (ok) { const w = addWorkout(now, [['Back Squat', [{ weight: 100, reps: 5, done: true }]]], 'Live'); w.live = true; w.tzOffsetMin = -new Date(now).getTimezoneOffset(); store.recordLiveDayFor(w); live.push(now);
          if (v.level === 'free') { const since2 = lastExpiry(now); const freeInMonth = new Set(live.filter(t => monthOf(t) === monthOf(now) && (since2 == null || t >= since2)).map(dayOf)).size; expect(freeInMonth).toBeLessThanOrEqual(PAYWALL.FREE_TRAINING_DAYS_PER_MONTH); } }
      }
      if (['buy', 'expire', 'refund', 'restore', 'offline', 'refresh', 'days', 'family'].includes(a.k)) expect(snapW()).toBe(before);
      expect(buildBackup().state.workouts).toHaveLength(live.length + backs);
      if (a.k === 'back') expect(ent.accessNow(Date.now()).decision.used).toBeLessThanOrEqual(live.length);
    }
  }), { numRuns: Number(process.env.MATRIX_RUNS || 60), seed: SEED });
});
