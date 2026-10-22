/*
 * 0.17.0, prośba o ocenę w działaniu (docs/26; decyzja właściciela 11.10.2026: B+A, N = 5 → od 22.10.2026 (M5 S1) N = 3, 14 dni, 1 na wersję, data w polu ustawień, bez linku w Ustawieniach):
 * normalizacja pola Settings.reviewAsked (migrate/import/kopia), podłączenie bramki lib/review.ts po zakończeniu treningu na ekranie podsumowania (tylko StoreReview.requestReview
 * przez moduł), niezmienniki (nigdy w trakcie treningu, nigdy bez rekordu, nigdy częściej niż odstęp, nigdy własne okno). Rodzaje (docs/20): logika, ekran, scenariusz
 * (zakończenie treningu w interfejsie), dane (zapis → restart, kopia → import, SCHEMA_VERSION bez zmian), niezmienniki. E2E: pominięte z powodem w docs/09 (okno systemowe).
 */
import fc from 'fast-check';
import Constants from 'expo-constants';
import * as store from '@/lib/store';
import { SCHEMA_VERSION } from '@/lib/seed';
import { REVIEW, normalizeReviewAsked, reviewDecision } from '@/lib/review';
import { PAYWALL } from '@/lib/access';
import { STORE_TIMING } from '@/lib/products';
import { setStoreAdapter, resetStoreAdapterForTests } from '@/lib/store-adapter';
import { createFakeStore } from '@/lib/store-fake';
import { resetEntitlementsForTests } from '@/lib/entitlement';
import { maybeRequestReview, markJustFinished, takeJustFinished, onSummaryShown } from '@/lib/review-run';
import { workoutPRs, prCountOf } from '@/lib/stats';
import { buildBackup, parseBackup } from '@/lib/backup';
import { fresh, saved, addWorkout, ex, pressAlert } from './helpers';
import { renderApp, flushAll, screen, tap, act } from './app';

jest.setTimeout(120000);
/* w Jest expo-constants nie zna wersji z app.json — jak w aplikacji ustawiamy ją jawnie (bez wersji bramka odmawia: badInput) */
jest.mock('expo-constants', () => ({ __esModule: true, default: { expoConfig: { version: '0.17.0' } } }));
const DAY = 86400e3; const NOW = new Date(2026, 9, 14, 12, 0).getTime(); const S = () => store.getState(); const VERSION = String(Constants.expoConfig?.version ?? '');
/** n treningów na żywo z rosnącym ciężarem; ostatni (najnowszy) ma rekord. */
function history(n: number, record = true) {
  const out = []; for (let i = 0; i < n; i++) { const kg = record ? 60 + i * 5 : 100 - i; const w = addWorkout(NOW - (n - i) * 2 * DAY, [['Back Squat', [{ weight: kg, reps: 5, done: true }]]], 'Upper A'); w.live = true; store.recordLiveDayFor(w); out.push(w); }
  return out;
}
const reset = () => { global.__review.available = true; global.__review.requested = 0; global.__review.fail = false; };
afterEach(() => { PAYWALL.ENABLED = false; resetEntitlementsForTests(); resetStoreAdapterForTests(); jest.useRealTimers(); reset(); });

describe('normalizeReviewAsked', () => {
  test.each([
    [{ at: 1, version: '0.17.0' }, { at: 1, version: '0.17.0' }], [{ at: NOW, version: '1' }, { at: NOW, version: '1' }], [{ at: 0, version: '1' }, { at: 0, version: '1' }],
    [{ at: NOW + 1, version: '1' }, undefined], [{ at: -1, version: '1' }, undefined], [{ at: NaN, version: '1' }, undefined], [{ at: Infinity, version: '1' }, undefined], [{ at: '5', version: '1' }, undefined],
    [{ at: 5 }, undefined], [{ at: 5, version: '' }, undefined], [{ at: 5, version: 7 }, undefined], [null, undefined], [undefined, undefined], ['x', undefined], [5, undefined], [[], undefined],
  ])('%j → %j', (raw, want) => { expect(normalizeReviewAsked(raw, NOW)).toEqual(want); });
  test('własność: wynik zawsze undefined albo poprawna para z datą nie późniejszą niż „teraz”', () => {
    fc.assert(fc.property(fc.anything(), fc.integer({ min: 0, max: 4e12 }), (raw, now) => { const r = normalizeReviewAsked(raw, now); if (r) { expect(Number.isFinite(r.at) && r.at >= 0 && r.at <= now).toBe(true); expect(r.version.length).toBeGreaterThan(0); } }), { numRuns: 300 });
  });
});

describe('dane: Settings.reviewAsked bez zmiany schematu', () => {
  test('SCHEMA_VERSION bez zmian (18); stan bez prośby nie ma pola; zapis → restart zachowuje; zła i przyszła data znikają przy wczytaniu', async () => {
    expect(SCHEMA_VERSION).toBe(19); jest.useFakeTimers({ now: NOW });
    await fresh(); expect('reviewAsked' in S().settings).toBe(false); S().settings.reviewAsked = { at: NOW - DAY, version: '0.17.0' }; store.saveCfg(); await store.flush();
    const raw = JSON.parse(global.__kv.get('state')!); expect(raw.settings.reviewAsked).toEqual({ at: NOW - DAY, version: '0.17.0' });
    await fresh(raw); expect(S().settings.reviewAsked).toEqual({ at: NOW - DAY, version: '0.17.0' });
    for (const bad of [{ at: NOW + DAY, version: 'x' }, { at: 'a', version: 'x' }, 'x', { at: 1 }]) { await fresh({ ...raw, settings: { ...raw.settings, reviewAsked: bad } }); expect('reviewAsked' in S().settings).toBe(false); }
  });
  test('kopia zapasowa → import: pole wraca (po przywróceniu nie pytamy od razu ponownie); kopia bez pola — bez pola; migracja idempotentna', async () => {
    jest.useFakeTimers({ now: NOW }); await fresh(); S().settings.reviewAsked = { at: NOW - 2 * DAY, version: '0.17.0' };
    const b = JSON.parse(JSON.stringify(buildBackup())); expect(b.state.settings.reviewAsked).toEqual({ at: NOW - 2 * DAY, version: '0.17.0' });
    const p = parseBackup(JSON.stringify(b)); expect(p.settings.reviewAsked).toEqual({ at: NOW - 2 * DAY, version: '0.17.0' });
    delete b.state.settings.reviewAsked; expect('reviewAsked' in parseBackup(JSON.stringify(b)).settings).toBe(false);
    const once = store.migrate(JSON.parse(JSON.stringify(p))); expect(store.migrate(JSON.parse(JSON.stringify(once)))).toEqual(once);
  });
});

describe('maybeRequestReview: bramka + moduł systemowy', () => {
  async function boot(n = 3, record = true) { jest.useFakeTimers({ now: NOW }); await fresh(); reset(); const ws = history(n, record); S().active = null; return ws[ws.length - 1]; }
  test('3 treningi (N), rekord, nigdy nie prosiliśmy: system dostaje prośbę RAZ, data i wersja zapisane w ustawieniach (zapis w bazie)', async () => {
    const w = await boot(); expect(prCountOf(workoutPRs(w))).toBeGreaterThan(0);
    expect(await maybeRequestReview(w, NOW)).toBe('asked'); expect(global.__review.requested).toBe(1); expect(S().settings.reviewAsked).toEqual({ at: NOW, version: VERSION });
    await store.flush(); expect(JSON.parse(global.__kv.get('state')!).settings.reviewAsked).toEqual({ at: NOW, version: VERSION });
  });
  test.each([
    ['za mało treningów (2)', 2, true, 'tooFewWorkouts'], ['brak rekordu', 3, false, 'noRecord'],
  ])('%s → %s, system nie dostaje prośby', async (_n, n, rec, want) => { const w = await boot(n, rec); expect(await maybeRequestReview(w, NOW)).toBe(want); expect(global.__review.requested).toBe(0); expect(S().settings.reviewAsked).toBeUndefined(); });
  test('1 na wersję i odstęp 14 dni: ta sama wersja → sameVersion; inna wersja przed upływem 14 dni → tooSoon; po 14 dniach → asked; zegar cofnięty → clockBack', async () => {
    const w = await boot(); S().settings.reviewAsked = { at: NOW - 30 * DAY, version: VERSION }; expect(await maybeRequestReview(w, NOW)).toBe('sameVersion');
    S().settings.reviewAsked = { at: NOW - (REVIEW.MIN_GAP_DAYS * DAY - 1), version: 'inna' }; expect(await maybeRequestReview(w, NOW)).toBe('tooSoon');
    S().settings.reviewAsked = { at: NOW + DAY, version: 'inna' }; expect(await maybeRequestReview(w, NOW)).toBe('clockBack'); expect(global.__review.requested).toBe(0);
    S().settings.reviewAsked = { at: NOW - REVIEW.MIN_GAP_DAYS * DAY, version: 'inna' }; expect(await maybeRequestReview(w, NOW)).toBe('asked'); expect(global.__review.requested).toBe(1);
  });
  test('trening w toku → workoutActive; limit subskrypcji (następny start zablokowany) → blocked; błąd zapisu → lastFailed', async () => {
    const w = await boot(); S().active = { ...w, id: 'a', finishedAt: null } as never; expect(await maybeRequestReview(w, NOW)).toBe('workoutActive'); S().active = null;
    PAYWALL.ENABLED = true; resetEntitlementsForTests(); setStoreAdapter(createFakeStore([])); for (const d of [1, 3]) { const x = addWorkout(NOW - d * DAY, [['Back Squat', [{ weight: 50, reps: 5, done: true }]]], 'Upper A'); x.live = true; store.recordLiveDayFor(x); } /* 5 różnych dni = limit dni wyczerpany */
    expect(await maybeRequestReview(w, NOW)).toBe('blocked'); PAYWALL.ENABLED = false;
    global.__dbFail = true; store.save(); await act(async () => { await store.flush().catch(() => {}); }); expect(await maybeRequestReview(w, NOW)).toBe('lastFailed'); global.__dbFail = false; expect(global.__review.requested).toBe(0);
  });
  test('TestFlight (moduł niedostępny): cicho, bez zapisu, bez zużycia odstępu; błąd modułu → error bez zapisu', async () => {
    const w = await boot(); global.__review.available = false; expect(await maybeRequestReview(w, NOW)).toBe('unavailable'); expect(S().settings.reviewAsked).toBeUndefined();
    global.__review.available = true; global.__review.fail = true; expect(await maybeRequestReview(w, NOW)).toBe('error'); expect(global.__review.requested).toBe(0); expect(S().settings.reviewAsked).toBeUndefined(); /* wyjątek modułu (np. brak sceny) nie zużywa odstępu */
  });
  test('niezmiennik (własność): w losowych sekwencjach prośba idzie do systemu tylko gdy reviewDecision = ask, najwyżej raz na wersję i nie częściej niż co 14 dni', async () => {
    const w = await boot(); const asks: { at: number; version: string }[] = [];
    await fc.assert(fc.asyncProperty(fc.array(fc.record({ dt: fc.integer({ min: 0, max: 40 }), ver: fc.constantFrom('a', 'b', VERSION), active: fc.boolean(), rec: fc.boolean() }), { maxLength: 12 }), async steps => {
      delete S().settings.reviewAsked; asks.length = 0; let t = NOW; global.__review.requested = 0;
      for (const s of steps) { t += s.dt * DAY; S().active = s.active ? ({ ...w, id: 'a', finishedAt: null } as never) : null; const before = global.__review.requested;
        const want = s.active ? false : reviewDecision({ now: t, finishedWorkouts: 3, justFinishedHasRecord: prCountOf(workoutPRs(w)) > 0, version: VERSION, lastAsked: S().settings.reviewAsked ?? null, workoutActive: false });
        const r = await maybeRequestReview(w, t); expect(global.__review.requested - before).toBe(r === 'asked' ? 1 : 0); if (r === 'asked') { asks.push(S().settings.reviewAsked!); expect(want === 'ask').toBe(true); }
        if (s.active) expect(r).toBe('workoutActive'); }
      for (let i = 1; i < asks.length; i++) { expect(asks[i].at - asks[i - 1].at).toBeGreaterThanOrEqual(REVIEW.MIN_GAP_DAYS * DAY); }
    }), { numRuns: 40 });
    S().active = null;
  });
});

describe('znacznik świeżo zakończonego treningu i ekran podsumowania', () => {
  test('takeJustFinished zużywa znacznik raz i tylko dla tego samego id', () => { markJustFinished('a'); expect(takeJustFinished('b')).toBe(false); expect(takeJustFinished('a')).toBe(true); expect(takeJustFinished('a')).toBe(false); });
  test('onSummaryShown: bez znacznika nic; ze znacznikiem — prośba po opóźnieniu (REVIEW_DELAY_MS), nie wcześniej; wyjście z ekranu anuluje', async () => {
    jest.useFakeTimers({ now: NOW }); await fresh(); reset(); const ws = history(5); const w = ws[4];
    const off0 = onSummaryShown(w); await act(async () => { jest.advanceTimersByTime(5000); await Promise.resolve(); }); expect(global.__review.requested).toBe(0); off0();
    markJustFinished(w.id); const off = onSummaryShown(w); await act(async () => { for (let i = 0; i < 6; i++) await Promise.resolve(); jest.advanceTimersByTime(STORE_TIMING.REVIEW_DELAY_MS - 1); }); expect(global.__review.requested).toBe(0);
    await act(async () => { jest.advanceTimersByTime(2); await Promise.resolve(); await Promise.resolve(); }); expect(global.__review.requested).toBe(1); off();
    markJustFinished(w.id); delete S().settings.reviewAsked; const cancel = onSummaryShown(w); await act(async () => { await Promise.resolve(); await Promise.resolve(); }); cancel(); await act(async () => { jest.advanceTimersByTime(5000); await Promise.resolve(); }); expect(global.__review.requested).toBe(1);
  });
  test('M5 S1: po treningu ekran zakupu NIE otwiera się sam (dawne P2 B usunięte); prośba o ocenę idzie normalnie, gdy limit dni nie jest wyczerpany', async () => {
    jest.useFakeTimers({ now: NOW }); await fresh(); reset(); PAYWALL.ENABLED = true; resetEntitlementsForTests(); setStoreAdapter(createFakeStore([])); const { initEntitlements } = require('@/lib/entitlement'); await initEntitlements();
    const ws = history(3); const w = ws[2]; markJustFinished(w.id); const { router } = require('expo-router'); const push = jest.spyOn(router, 'push').mockImplementation(() => {});
    onSummaryShown(w); await act(async () => { for (let i = 0; i < 6; i++) await Promise.resolve(); jest.advanceTimersByTime(5000); await Promise.resolve(); await Promise.resolve(); }); expect(push).not.toHaveBeenCalled(); expect(global.__review.requested).toBe(1); push.mockRestore();
  });
});

describe('scenariusz w interfejsie: zakończenie treningu', () => {
  const finishOnScreen = async () => { await tap(screen.getByText('Finish')); await act(async () => { pressAlert('Finish workout?', 'Finish'); }); await flushAll(600); };
  async function session(prior: number, opts: { record?: boolean; paywall?: boolean } = {}) {
    jest.useFakeTimers({ now: NOW }); await fresh(undefined, 'en'); reset(); history(prior, true);
    store.startEmpty(); store.addExerciseToActive(ex('Back Squat')); S().active!.exercises[0].sets = S().active!.exercises[0].sets.slice(0, 1);
    if (opts.paywall) { PAYWALL.ENABLED = true; resetEntitlementsForTests(); setStoreAdapter(createFakeStore([])); }
    await act(async () => { await store.flush(); }); await renderApp({ saved: JSON.parse(JSON.stringify(saved())), locale: 'en' }); jest.setSystemTime(NOW); await flushAll(10);
    await act(async () => { const s = S().active!.exercises[0].sets[0]; s.weight = opts.record === false ? 40 : 200; s.reps = 5; store.toggleDone(0, 0); }); await flushAll(10);
  }
  test('3. trening z rekordem: po „Finish” ekran sesji z kartą rekordów, po 1,5 s jedna systemowa prośba o ocenę; ekran nie ma własnego okna ani przycisku oceny', async () => {
    await session(2); await finishOnScreen(); expect(screen.getByTestId('record-card')).toBeTruthy(); expect(global.__review.requested).toBe(0);
    await act(async () => { jest.advanceTimersByTime(STORE_TIMING.REVIEW_DELAY_MS + 50); await Promise.resolve(); await Promise.resolve(); }); expect(global.__review.requested).toBe(1); expect(S().settings.reviewAsked!.version).toBe(VERSION);
    expect(global.__alerts.filter(a => /rate|review|rating/i.test(String(a.title)))).toEqual([]); expect(screen.queryByText(/rate|review/i)).toBeNull();
    await act(async () => { jest.advanceTimersByTime(60000); await Promise.resolve(); }); expect(global.__review.requested).toBe(1);
  });
  test('2. trening (poniżej N) i 3. bez rekordu: bez prośby; otwarcie sesji z historii nigdy nie prosi', async () => {
    await session(1); await finishOnScreen(); await act(async () => { jest.advanceTimersByTime(5000); await Promise.resolve(); }); expect(global.__review.requested).toBe(0);
    await session(2, { record: false }); await finishOnScreen(); await act(async () => { jest.advanceTimersByTime(5000); await Promise.resolve(); }); expect(global.__review.requested).toBe(0);
    await session(2); const id = S().workouts[S().workouts.length - 1].id; await finishOnScreen(); await act(async () => { jest.advanceTimersByTime(5000); await Promise.resolve(); }); const n = global.__review.requested;
    await act(async () => { require('expo-router').router.push(`/history/${S().workouts.find((x: { id: string }) => x.id === id)!.id}`); }); await act(async () => { jest.advanceTimersByTime(5000); await Promise.resolve(); }); expect(global.__review.requested).toBe(n);
  });
  test('M5 S1 w interfejsie: pierwszy trening bez pełnego dostępu → po zakończeniu bez ekranu zakupu (bez „Not now” i planów)', async () => {
    await session(0, { paywall: true }); await finishOnScreen(); await act(async () => { jest.advanceTimersByTime(300); await Promise.resolve(); await Promise.resolve(); }); await flushAll(50);
    expect(screen.queryByText('Not now')).toBeNull(); expect(screen.queryByTestId('plan-yearly')).toBeNull(); expect(S().workouts).toHaveLength(1); expect(S().active).toBeNull();
  });

});
