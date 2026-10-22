/*
 * M5 S1 (decyzja właściciela 22.10.2026; docs/monetyzacja-badanie-2026-10.md rozdz. 11): limit 5 DNI TRENINGOWYCH w miesiącu kalendarzowym.
 * Dziesięć wektorów z kontraktu E3 (czysta logika `canStartLive`; ten sam scenariusz przez magazyn: tests/m5s1-dni-zapis.test.ts),
 * granice dnia i miesiąca (strefa startu), P3 B, jedna stała limitu. Rodzaje (docs/20): logika, scenariusz, macierz (wektory × strefy), niezmienniki.
 */
import fs from 'fs';
import path from 'path';
import {
  PAYWALL, freeUsed, canStartLive, nextMonthStart, type PaywallConfig, type Entitlement, type LiveStart,
} from '@/lib/access';

const ON: PaywallConfig = { ...PAYWALL, ENABLED: true };
const at = (y: number, m: number, d: number, h = 12, mi = 0, off = 0) => Date.UTC(y, m - 1, d, h, mi) - off * 60e3;
const DAY = 86400e3;
const day = (d: number, h = 12, off = 0): LiveStart => ({ startedAt: at(2026, 11, d, h, 0, off), tzOffsetMin: off });
const decide = (starts: LiveStart[], now: number, ents: Entitlement[] | null = [], off = 0) => canStartLive({}, ents, starts, now, off, ON);
const N = 5;

describe('stała limitu: jedno miejsce, 5 dni treningowych, przełącznik włączony w kodzie', () => {
  test('PAYWALL.FREE_TRAINING_DAYS_PER_MONTH = 5, brak starej stałej FREE_LIVE_PER_MONTH', () => {
    expect(PAYWALL.FREE_TRAINING_DAYS_PER_MONTH).toBe(N);
    expect((PAYWALL as unknown as Record<string, unknown>).FREE_LIVE_PER_MONTH).toBeUndefined();
  });
  test('źródło lib/access.ts: ENABLED: true (w Jest przełącznik jest wyłączony w setup.js, żeby testy dziedzin nie zależały od limitu)', () => {
    const src = fs.readFileSync(path.join(__dirname, '../lib/access.ts'), 'utf8');
    expect(src).toMatch(/export const PAYWALL: PaywallConfig = \{\s*ENABLED: true,/);
  });
  test('zmiana stałej zmienia limit (liczba w jednym miejscu)', () => {
    const cfg = { ...ON, FREE_TRAINING_DAYS_PER_MONTH: 2 };
    expect(canStartLive({}, [], [day(1), day(2)], at(2026, 11, 15), 0, cfg).allowed).toBe(false);
    expect(canStartLive({}, [], [day(1)], at(2026, 11, 15), 0, cfg).allowed).toBe(true);
  });
});

describe('wektory E3 (N = 5, miesiąc bieżący, stan free)', () => {
  const now15 = at(2026, 11, 15, 18);
  test('1. nowy użytkownik: start dozwolony, zostało 5 z 5', () => {
    const d = decide([], now15); expect(d).toMatchObject({ allowed: true, used: 0, remaining: 5, limit: 5, level: 'free', resetsAt: null });
  });
  test('2. dwa treningi jednego dnia zużywają 1 dzień', () => {
    const d = decide([day(3, 8), day(3, 19)], at(2026, 11, 3, 20)); expect(d).toMatchObject({ allowed: true, used: 1, remaining: 4 });
  });
  test('3. limit, a dziś już był trening: start dozwolony (ten sam dzień)', () => {
    const d = decide([day(1), day(4), day(8), day(12), day(15, 7)], now15); expect(d).toMatchObject({ allowed: true, used: 5, remaining: 0, resetsAt: null });
  });
  test('4. limit, nowy dzień: zablokowany, odnowienie 1. dnia następnego miesiąca', () => {
    const now16 = at(2026, 11, 16, 9); const d = decide([day(1), day(4), day(8), day(12), day(15)], now16);
    expect(d).toMatchObject({ allowed: false, used: 5, remaining: 0, resetsAt: at(2026, 12, 1, 0), silent: false });
  });
  test('5. trening przez północ liczy się do dnia i miesiąca startu', () => {
    const s: LiveStart[] = [{ startedAt: at(2026, 10, 31, 23, 50), tzOffsetMin: 0 }];
    expect(freeUsed(s, at(2026, 10, 31, 23, 55), 0)).toBe(1); /* w październiku */
    const nov = decide(s, at(2026, 11, 1, 0, 45)); expect(nov).toMatchObject({ allowed: true, used: 0, remaining: 5 });
  });
  test('10a. Pro aktywne (subskrypcja) i dożywotni: dozwolony, bez licznika', () => {
    const many = [1, 3, 5, 7, 9, 11, 13].map(d => day(d));
    for (const e of [{ plan: 'monthly', source: 'purchase', expiresAt: now15 + DAY }, { plan: 'yearly', source: 'purchase', expiresAt: now15 + 300 * DAY }, { plan: 'lifetime', source: 'purchase', expiresAt: null }] as Entitlement[])
      expect(decide(many, now15, [e])).toMatchObject({ allowed: true, level: 'full', used: 0, remaining: Infinity });
  });
  test('10b. Pro wygasło 10.11: dni 2, 5, 8 (przed) nie liczą się, 12 i 14 (po) tak → zużyte 2 (P3 B)', () => {
    const expired: Entitlement = { plan: 'monthly', source: 'purchase', expiresAt: at(2026, 11, 10, 12) };
    const d = decide([day(2), day(5), day(8), day(12), day(14)], at(2026, 11, 20), [expired]);
    expect(d).toMatchObject({ allowed: true, used: 2, remaining: 3 });
    expect(canStartLive({}, [expired], [day(2), day(5), day(8), day(12), day(14)], at(2026, 11, 20), 0, { ...ON, COUNT_FULL_STARTS_IN_EXPIRY_MONTH: true }).used).toBe(5);
  });
});

describe('granice dnia i miesiąca wg strefy startu (macierz)', () => {
  test.each([-600, -300, 0, 120, 330, 840])('dzień = data startu na zegarze strefy %i min; dwa starty tej samej lokalnej doby = 1 dzień', off => {
    const a: LiveStart = { startedAt: at(2026, 11, 7, 0, 5, off), tzOffsetMin: off }; const b: LiveStart = { startedAt: at(2026, 11, 7, 23, 55, off), tzOffsetMin: off };
    expect(freeUsed([a, b], at(2026, 11, 20, 12, 0, off), off)).toBe(1);
    const c: LiveStart = { startedAt: at(2026, 11, 8, 0, 5, off), tzOffsetMin: off }; expect(freeUsed([a, b, c], at(2026, 11, 20, 12, 0, off), off)).toBe(2);
  });
  test('start 23:50 w strefie +2 (21:50 UTC) i start 00:10 następnego dnia lokalnie to dwa dni, mimo że różnica to 20 min', () => {
    const s: LiveStart[] = [{ startedAt: at(2026, 11, 7, 23, 50, 120), tzOffsetMin: 120 }, { startedAt: at(2026, 11, 8, 0, 10, 120), tzOffsetMin: 120 }];
    expect(freeUsed(s, at(2026, 11, 20, 12, 0, 120), 120)).toBe(2);
  });
  test('start bez strefy używa bieżącej; start nieskończony i pusty wpis są pomijane', () => {
    expect(freeUsed([{ startedAt: at(2026, 11, 2, 12, 0, 60) }, { startedAt: NaN }, null as never], at(2026, 11, 10, 12, 0, 60), 60)).toBe(1);
  });
  test('ostatni dzień miesiąca: 30.11 był dniem treningowym, 1.12 zaczyna od zera i odnowienie liczy się od północy', () => {
    const s = [day(26), day(27), day(28), day(29), day(30)]; expect(decide(s, at(2026, 11, 30, 20))).toMatchObject({ allowed: true, used: 5 });
    expect(decide(s, at(2026, 12, 1, 0, 1))).toMatchObject({ allowed: true, used: 0, remaining: 5 });
    expect(nextMonthStart(at(2026, 11, 30, 20), 0)).toBe(at(2026, 12, 1, 0));
  });
  test('dzień treningowy z poprzedniego miesiąca nie odblokowuje i nie zużywa: w nowym miesiącu liczy się tylko dzisiejsza data', () => {
    const s = [day(26), day(27), day(28), day(29), day(30)];
    expect(decide(s, at(2026, 11, 30, 23, 59))).toMatchObject({ allowed: true });
    expect(freeUsed(s, at(2026, 12, 1, 8), 0)).toBe(0);
  });
});
