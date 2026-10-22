/* lib/review.ts — bramka prośby o ocenę (docs/26; decyzja 11.10.2026: po 5. treningu z rekordem, 14 dni, 1 na wersję). Logika bez UI. */
import fc from 'fast-check';
import { REVIEW, REVIEW_BLOCK_REASONS, reviewDecision, shouldAskForReview, type ReviewInput, type ReviewBlockReason } from '@/lib/review';

const DAY = 86400e3; const NOW = Date.UTC(2026, 10, 15, 12, 0);
const base: ReviewInput = { now: NOW, finishedWorkouts: 5, justFinishedHasRecord: true, version: '0.17.0' };
const w = (o: Partial<ReviewInput>): ReviewInput => ({ ...base, ...o });

describe('stałe w jednym miejscu', () => {
  test('N = 3 (M5 S1, 22.10.2026; wcześniej 5), odstęp 14 dni', () => { expect(REVIEW).toEqual({ MIN_WORKOUTS: 3, MIN_GAP_DAYS: 14 }); });
});

describe('shouldAskForReview — przypadki', () => {
  test('5. trening z rekordem, nigdy nie prosiliśmy → pytamy', () => { expect(shouldAskForReview(base)).toBe(true); expect(reviewDecision(base)).toBe('ask'); });
  test.each([0, 1, 2])('%i ukończonych treningów (poniżej N) → nie (pierwszy trening też)', n => { expect(reviewDecision(w({ finishedWorkouts: n }))).toBe('tooFewWorkouts'); });
  test.each([5, 6, 50, 1000])('%i ukończonych (N i więcej) z rekordem → pytamy', n => { expect(shouldAskForReview(w({ finishedWorkouts: n }))).toBe(true); });
  test('brak rekordu w ostatnim treningu → nie (czekamy do następnego)', () => { expect(reviewDecision(w({ justFinishedHasRecord: false }))).toBe('noRecord'); });
  test('rekord, ale za mało treningów → powód „za mało treningów” (próg przed rekordem)', () => { expect(reviewDecision(w({ finishedWorkouts: 2, justFinishedHasRecord: false }))).toBe('tooFewWorkouts'); });
  test('odstęp: dzień przed progiem → nie; równo 14 dni → tak; po progu → tak', () => {
    const last = (ms: number) => ({ at: NOW - ms, version: '0.16.0' });
    expect(reviewDecision(w({ lastAsked: last(14 * DAY - 1) }))).toBe('tooSoon');
    expect(reviewDecision(w({ lastAsked: last(13 * DAY) }))).toBe('tooSoon');
    expect(reviewDecision(w({ lastAsked: last(14 * DAY) }))).toBe('ask');
    expect(shouldAskForReview(w({ lastAsked: last(400 * DAY) }))).toBe(true);
  });
  test('max 1 na wersję: ta sama wersja → nie, nawet po latach; nowa wersja po odstępie → tak', () => {
    expect(reviewDecision(w({ lastAsked: { at: NOW - 365 * DAY, version: '0.17.0' } }))).toBe('sameVersion');
    expect(reviewDecision(w({ lastAsked: { at: NOW - 20 * DAY, version: '0.16.0' } }))).toBe('ask');
  });
  test('nowa wersja, ale odstęp krótszy niż 14 dni → nie', () => { expect(reviewDecision(w({ lastAsked: { at: NOW - 3 * DAY, version: '0.16.0' } }))).toBe('tooSoon'); });
  test('zegar cofnięty (data prośby w przyszłości) → nie', () => { expect(reviewDecision(w({ lastAsked: { at: NOW + 1, version: '0.16.0' } }))).toBe('clockBack'); });
  test.each([
    ['workoutActive', { workoutActive: true }], ['blocked', { blocked: true }], ['ioBusy', { ioBusy: true }], ['lastFailed', { lastFailed: true }],
  ] as [ReviewBlockReason, Partial<ReviewInput>][])('zasada twarda %s → nie', (reason, o) => { expect(reviewDecision(w(o))).toBe(reason); });
  test('trening w toku wygrywa z pozostałymi warunkami (nigdy w trakcie)', () => { expect(reviewDecision(w({ workoutActive: true, finishedWorkouts: 100 }))).toBe('workoutActive'); });
  test.each([
    [{ now: NaN }], [{ now: Infinity }], [{ finishedWorkouts: NaN }], [{ version: '' }], [{ version: undefined as any }],
    [{ lastAsked: { at: NaN, version: '0.16.0' } }], [{ lastAsked: { at: NOW - 20 * DAY, version: undefined as any } }],
  ] as [Partial<ReviewInput>][])('złe dane wejściowe %j → nie (badInput), bez wyjątku', o => { expect(reviewDecision(w(o))).toBe('badInput'); expect(shouldAskForReview(w(o))).toBe(false); });
  test('brak argumentu → nie', () => { expect(shouldAskForReview(undefined as any)).toBe(false); });
  test('lastAsked: null i brak pola są równoważne (nie prosiliśmy)', () => { expect(shouldAskForReview(w({ lastAsked: null }))).toBe(true); });
  test.each(REVIEW_BLOCK_REASONS.filter(r => r !== 'badInput').map(r => [r]))('powód %s ma odtwarzający przypadek', reason => {
    const cases: Record<string, ReviewInput> = {
      workoutActive: w({ workoutActive: true }), blocked: w({ blocked: true }), ioBusy: w({ ioBusy: true }), lastFailed: w({ lastFailed: true }),
      tooFewWorkouts: w({ finishedWorkouts: 1 }), noRecord: w({ justFinishedHasRecord: false }), clockBack: w({ lastAsked: { at: NOW + DAY, version: 'a' } }),
      sameVersion: w({ lastAsked: { at: NOW - 99 * DAY, version: base.version } }), tooSoon: w({ lastAsked: { at: NOW - DAY, version: 'a' } }),
    };
    expect(reviewDecision(cases[reason])).toBe(reason);
  });
});

describe('niezmienniki (fast-check)', () => {
  const inA = fc.record({
    now: fc.integer({ min: NOW - 400 * DAY, max: NOW + 400 * DAY }), finishedWorkouts: fc.integer({ min: 0, max: 30 }), justFinishedHasRecord: fc.boolean(),
    version: fc.constantFrom('0.16.0', '0.17.0', '0.18.0'), workoutActive: fc.boolean(), blocked: fc.boolean(), ioBusy: fc.boolean(), lastFailed: fc.boolean(),
    lastAsked: fc.option(fc.record({ at: fc.integer({ min: NOW - 800 * DAY, max: NOW + 400 * DAY }), version: fc.constantFrom('0.16.0', '0.17.0', '0.18.0') }), { nil: null }),
  }) as fc.Arbitrary<ReviewInput>;
  test('pytanie ⇒ wszystkie zasady twarde spełnione (nie w trakcie treningu, nie przy błędzie/blokadzie, ≥ N treningów, rekord, odstęp, inna wersja)', () => {
    fc.assert(fc.property(inA, i => {
      if (!shouldAskForReview(i)) return;
      expect(i.workoutActive || i.blocked || i.ioBusy || i.lastFailed).toBeFalsy(); expect(i.finishedWorkouts).toBeGreaterThanOrEqual(REVIEW.MIN_WORKOUTS); expect(i.justFinishedHasRecord).toBe(true);
      if (i.lastAsked) { expect(i.lastAsked.version).not.toBe(i.version); expect(i.now - i.lastAsked.at).toBeGreaterThanOrEqual(REVIEW.MIN_GAP_DAYS * DAY); }
    }));
  });
  test('po zapisaniu prośby (at=now, wersja) kolejne pytanie jest niemożliwe w tej wersji i przez 14 dni', () => {
    fc.assert(fc.property(inA, fc.integer({ min: 0, max: 14 * DAY - 1 }), (i, dt) => {
      expect(shouldAskForReview({ ...i, workoutActive: false, blocked: false, ioBusy: false, lastFailed: false, finishedWorkouts: 99, justFinishedHasRecord: true, now: i.now + dt, lastAsked: { at: i.now, version: i.version } })).toBe(false);
    }));
  });
  test('wynik zależy tylko od argumentów (deterministyczny) i ma dokładnie jeden powód z listy', () => {
    fc.assert(fc.property(inA, i => { const a = reviewDecision(i); expect(reviewDecision({ ...i })).toBe(a); expect(a === 'ask' || (REVIEW_BLOCK_REASONS as readonly string[]).includes(a)).toBe(true); }));
  });
  test('monotoniczność: więcej treningów nie odbiera zgody (przy tych samych pozostałych danych)', () => {
    fc.assert(fc.property(inA, fc.integer({ min: 0, max: 20 }), (i, more) => { if (shouldAskForReview(i)) expect(shouldAskForReview({ ...i, finishedWorkouts: i.finishedWorkouts + more })).toBe(true); }));
  });
});
