/*
 * M1-audytor-generalny-002 (audyt 1.0, 27.10.2026; 02-monetyzacja-501): decyzja P3 B (docs/18, 12.10.2026) — po wygaśnięciu albo cofnięciu Pro liczą się
 * tylko dni treningowe od chwili wygaśnięcia. Prawdziwy sklep (StoreKit przez getAvailablePurchases({ onlyIncludeActiveItemsIOS: true })) po wygaśnięciu
 * NIE zwraca wygasłej transakcji — lista jest pusta. Test działa na tym kształcie (pusta lista po wygaśnięciu), nie na liście z wygasłym wpisem.
 * Rodzaje (docs/20): logika, scenariusz (fałszywy zegar + restart modułu), dane (klucz kv „access” poza stanem i kopią).
 */
import * as store from '@/lib/store';
import { PAYWALL, type Entitlement } from '@/lib/access';
import { setStoreAdapter, resetStoreAdapterForTests } from '@/lib/store-adapter';
import { createFakeStore } from '@/lib/store-fake';
import * as ent from '@/lib/entitlement';
import { fresh, addWorkout } from './helpers';

const DAY = 86400e3;
const at = (y: number, m: number, d: number, h = 12) => new Date(y, m - 1, d, h).getTime();
const live = (when: number) => { const w = addWorkout(when, [['Back Squat', [{ weight: 100, reps: 5, done: true }]]], 'Live'); w.live = true; w.tzOffsetMin = -new Date(when).getTimezoneOffset(); store.recordLiveDayFor(w); };
const flush = async () => { for (let i = 0; i < 6; i++) await Promise.resolve(); };
const END = at(2026, 11, 20, 9);
const sub = (source: Entitlement['source'] = 'purchase'): Entitlement => ({ plan: 'monthly', source, expiresAt: END });
afterEach(() => { PAYWALL.ENABLED = false; ent.resetEntitlementsForTests(); resetStoreAdapterForTests(); jest.useRealTimers(); });

/** 7 dni treningowych w Pro (2–8.11), potem sklep jak natywny: pusta lista po wygaśnięciu. */
async function scenario(source: Entitlement['source'], restart: boolean) {
  jest.useFakeTimers({ now: at(2026, 11, 1) }); await fresh(); ent.resetEntitlementsForTests(); PAYWALL.ENABLED = true;
  const fake = createFakeStore([sub(source)]); setStoreAdapter(fake); await ent.initEntitlements(); await flush();
  for (let d = 2; d <= 8; d++) { jest.setSystemTime(at(2026, 11, d)); live(at(2026, 11, d)); }
  expect(ent.accessNow(at(2026, 11, 9)).level).toBe('full');
  const after = at(2026, 11, 21); jest.setSystemTime(after);
  fake.setEntitlements([]); /* kształt natywny: StoreKit nie zwraca wygasłej ani cofniętej transakcji */
  await ent.refreshEntitlements(); await flush();
  if (restart) { ent.resetEntitlementsForTests(); await ent.initEntitlements(); await flush(); } /* ponowne uruchomienie aplikacji: stan z kv */
  return ent.accessNow(after).decision;
}

describe('M1-002: P3 B na kształcie danych sklepu natywnego', () => {
  test.each([['purchase', false], ['purchase', true], ['family', false], ['code', true]] as const)('źródło %s, restart %s: 7 dni w Pro → po wygaśnięciu used=0, start dozwolony', async (source, restart) => {
    const d = await scenario(source, restart);
    expect(d).toMatchObject({ level: 'free', used: 0, allowed: true, remaining: 5 });
  });
  test('dni po wygaśnięciu liczą się dalej (limit działa): 5 dni po 21.11 → szósty nowy dzień zablokowany', async () => {
    await scenario('purchase', false);
    for (let d = 21; d <= 25; d++) { jest.setSystemTime(at(2026, 11, d)); expect(ent.accessNow(at(2026, 11, d)).decision.allowed).toBe(true); live(at(2026, 11, d)); }
    expect(ent.accessNow(at(2026, 11, 26)).decision).toMatchObject({ used: 5, allowed: false });
  });
  test('ktoś, kto nigdy nie miał Pro: wszystkie dni miesiąca się liczą (bez zmian)', async () => {
    jest.useFakeTimers({ now: at(2026, 11, 1) }); await fresh(); ent.resetEntitlementsForTests(); PAYWALL.ENABLED = true;
    setStoreAdapter(createFakeStore([])); await ent.initEntitlements(); await flush();
    for (let d = 2; d <= 6; d++) live(at(2026, 11, d));
    expect(ent.accessNow(at(2026, 11, 21)).decision).toMatchObject({ used: 5, allowed: false });
  });
});

describe('M1-002: funkcje (logika)', () => {
  const { freeSinceWithMemory } = jest.requireActual('@/lib/access') as typeof import('@/lib/access');
  test('freeSinceWithMemory: aktywne → null; pusta lista + pamięć → pamięć; lista z wygasłym + pamięć → późniejszy; pamięć z przyszłości pomijana; brak obu → null', () => {
    const now = at(2026, 11, 21); const exp = (end: number): Entitlement => ({ plan: 'monthly', source: 'purchase', expiresAt: end });
    expect(freeSinceWithMemory({ lastKnown: { level: 'free', endedAt: END } }, [exp(now + DAY)], now)).toBeNull();
    expect(freeSinceWithMemory({ lastKnown: { level: 'free', endedAt: END } }, [], now)).toBe(END);
    expect(freeSinceWithMemory({ lastKnown: { level: 'free', endedAt: END } }, null, now)).toBe(END); /* sklep bez odpowiedzi */
    expect(freeSinceWithMemory({ lastKnown: { level: 'free', endedAt: END } }, [exp(END + DAY)], now)).toBe(END + DAY);
    expect(freeSinceWithMemory({ lastKnown: { level: 'free', endedAt: now + DAY } }, [], now)).toBeNull();
    expect(freeSinceWithMemory({}, [], now)).toBeNull(); expect(freeSinceWithMemory({ lastKnown: { level: 'free' } }, [], now)).toBeNull();
  });
  test('withEndedAt: full → free zapisuje koniec okresu albo „teraz” przy zwrocie przed końcem; free → free zachowuje; full czyści; brak poprzedniego → bez końca', () => {
    const now = at(2026, 11, 21);
    expect(ent.withEndedAt({ level: 'free' }, { level: 'full', expiresAt: END }, now)).toEqual({ level: 'free', endedAt: END });
    expect(ent.withEndedAt({ level: 'free' }, { level: 'full', expiresAt: now + 9 * DAY }, now)).toEqual({ level: 'free', endedAt: now }); /* zwrot / cofnięcie z rodziny */
    expect(ent.withEndedAt({ level: 'free' }, { level: 'full', expiresAt: null }, now)).toEqual({ level: 'free', endedAt: now }); /* cofnięty dożywotni */
    expect(ent.withEndedAt({ level: 'free' }, { level: 'free', endedAt: END }, now)).toEqual({ level: 'free', endedAt: END });
    expect(ent.withEndedAt({ level: 'full', expiresAt: now + DAY }, { level: 'free', endedAt: END }, now)).toEqual({ level: 'full', expiresAt: now + DAY });
    expect(ent.withEndedAt({ level: 'free' }, null, now)).toEqual({ level: 'free' });
  });
  test('parseLastKnown: free z endedAt zachowany; zły endedAt pominięty (dane z kv)', () => {
    expect(ent.parseLastKnown({ level: 'free', endedAt: END })).toEqual({ level: 'free', endedAt: END });
    expect(ent.parseLastKnown({ level: 'free', endedAt: 'x' })).toEqual({ level: 'free' });
  });
});
