/*
 * M1-audytor-generalny-018 (audyt 1.0, 27.10.2026; 11-wzrost-001): po imporcie historii (treningi bez znacznika „na żywo”) pierwszy trening na żywo
 * z rekordem dawał naraz okno „Uczciwe zasady” i systemową prośbę o ocenę. Bramka oceny liczy tylko treningi na żywo, a na jednym podsumowaniu
 * pokazuje się najwyżej jedno z {okno „Uczciwe zasady”, prośba o ocenę, link „Poproś o funkcję”}. Rodzaje (docs/20): scenariusz, niezmiennik, regresja.
 */
import Constants from 'expo-constants';
import * as store from '@/lib/store';
import { PAYWALL } from '@/lib/access';
import { STORE_TIMING } from '@/lib/products';
import { setStoreAdapter, resetStoreAdapterForTests } from '@/lib/store-adapter';
import { createFakeStore } from '@/lib/store-fake';
import { resetEntitlementsForTests, initEntitlements } from '@/lib/entitlement';
import { markJustFinished, onSummaryShown } from '@/lib/review-run';
import { fresh, addWorkout } from './helpers';
import { act } from './app';

jest.mock('expo-constants', () => ({ __esModule: true, default: { expoConfig: { version: '1.0.0' } } }));
const DAY = 86400e3; const NOW = new Date(2026, 10, 14, 12, 0).getTime();
afterEach(() => { PAYWALL.ENABLED = false; resetEntitlementsForTests(); resetStoreAdapterForTests(); jest.useRealTimers(); global.__review.requested = 0; global.__review.available = true; });
void Constants;

async function setup(imported: number) {
  jest.useFakeTimers({ now: NOW }); await fresh(); resetEntitlementsForTests(); PAYWALL.ENABLED = true; setStoreAdapter(createFakeStore([])); await initEntitlements();
  for (let i = 0; i < imported; i++) addWorkout(NOW - (imported - i + 1) * 2 * DAY, [['Back Squat', [{ weight: 60 + i, reps: 5, done: true }]]], 'Import'); /* import CSV: bez „live” */
  const w = addWorkout(NOW - 3600e3, [['Back Squat', [{ weight: 200, reps: 5, done: true }]]], 'Upper A'); w.live = true; store.recordLiveDayFor(w); /* pierwszy na żywo, z rekordem */
  return w;
}
async function summary(w: ReturnType<typeof addWorkout>) {
  const fair = jest.fn(); const idea = jest.fn(); markJustFinished(w.id); onSummaryShown(w, idea, fair);
  await act(async () => { for (let i = 0; i < 6; i++) await Promise.resolve(); jest.advanceTimersByTime(STORE_TIMING.REVIEW_DELAY_MS + 10); for (let i = 0; i < 6; i++) await Promise.resolve(); });
  return { fair: fair.mock.calls.length, idea: idea.mock.calls.length, review: global.__review.requested };
}

describe('M1-018: najwyżej jedno okno na podsumowaniu', () => {
  test('import 10 treningów + pierwszy na żywo z rekordem (free): okno „Uczciwe zasady”, bez prośby o ocenę', async () => {
    const r = await summary(await setup(10)); expect(r).toEqual({ fair: 1, idea: 0, review: 0 });
  });
  test('niezmiennik: dla 0–12 importowanych treningów suma okien na jednym podsumowaniu ≤ 1', async () => {
    for (const n of [0, 2, 5, 12]) { global.__review.requested = 0; const r = await summary(await setup(n)); expect([n, r.fair + r.idea + r.review <= 1]).toEqual([n, true]); }
  });
});
