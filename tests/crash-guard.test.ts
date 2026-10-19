/* M1-audytor-generalny-003: strażnik pętli awarii przy starcie. Logika (wektory) i zapis w bazie. Czerwone na commicie 8273448 (brak modułu). */
import * as store from '@/lib/store';
import { CRASH_LOOP_THRESHOLD, BOOT_STABLE_MS, BOOT_GUARD_KEY, parseBootGuard, decideBoot } from '@/lib/state/crashguard';
import { fresh, seedState } from './helpers';

jest.setTimeout(30000);
const guardInDb = () => JSON.parse(global.__kv.get(BOOT_GUARD_KEY) ?? 'null');

describe('decideBoot / parseBootGuard — wektory', () => {
  test('próg to 2: pierwszy start normalny, drugi z rzędu bez „kamienia” awaryjny', () => {
    expect(CRASH_LOOP_THRESHOLD).toBe(2);
    expect(decideBoot(parseBootGuard(null))).toEqual({ mode: 'normal', next: { starts: 1 } });
    expect(decideBoot({ starts: 0 })).toEqual({ mode: 'normal', next: { starts: 1 } });
    expect(decideBoot({ starts: 1 })).toEqual({ mode: 'safe', next: { starts: 2 } });
    expect(decideBoot({ starts: 2 })).toEqual({ mode: 'safe', next: { starts: 3 } });
  });
  test.each([
    ['brak zapisu', null, 0], ['nie-json', 'nie-json', 0], ['pusty tekst', '', 0], ['null', 'null', 0], ['tablica', '[1]', 0],
    ['pole nie-liczba', '{"starts":"x"}', 0], ['ujemne', '{"starts":-3}', 0], ['NaN jako tekst', '{"starts":"NaN"}', 0], ['ułamek', '{"starts":1.9}', 1], ['poprawny', '{"starts":1}', 1],
    ['absurdalnie duży', '{"starts":1e9}', 100],
  ])('parseBootGuard: %s -> stan początkowy albo poprawna liczba', (_n, raw, starts) => { expect(parseBootGuard(raw as string | null)).toEqual({ starts }); });
  test('zapis nie-json daje start normalny (stan początkowy)', () => { expect(decideBoot(parseBootGuard('nie-json')).mode).toBe('normal'); });
});

describe('init({ guard }) — zapis licznika w bazie', () => {
  const start = async (opts?: { retry?: boolean }) => { store.__resetForTests(); await store.init({ guard: true, ...opts }); };
  test('start bez zapisu: normalny, licznik 1; „kamień” zeruje; kolejny start znów normalny', async () => {
    await fresh(); global.__kv.delete(BOOT_GUARD_KEY);
    await start(); expect(guardInDb()).toEqual({ starts: 1 });
    await store.markBootStable(); expect(guardInDb()).toEqual({ starts: 0 });
    await start(); expect(guardInDb()).toEqual({ starts: 1 });
  });
  test('drugi start z rzędu bez „kamienia”: init rzuca błąd z crashLoop, nie ładuje ani nie zmienia danych', async () => {
    await fresh(seedState('pl')); global.__kv.set(BOOT_GUARD_KEY, JSON.stringify({ starts: 1 }));
    const before = new Map(global.__kv); store.__resetForTests();
    const err = await store.init({ guard: true }).then(() => null, e => e);
    expect(err).toMatchObject({ crashLoop: true }); expect(store.isReadyForTests()).toBe(false);
    expect([...global.__kv].filter(([k]) => k !== BOOT_GUARD_KEY)).toEqual([...before].filter(([k]) => k !== BOOT_GUARD_KEY)); /* dane bez zmian */
    expect(guardInDb()).toEqual({ starts: 2 });
  });
  test('„Spróbuj ponownie” (retry): start normalny mimo licznika; licznik 1; padający start zostawia 1 -> następny uruchomiony start znów awaryjny', async () => {
    await fresh(seedState('pl')); global.__kv.set(BOOT_GUARD_KEY, JSON.stringify({ starts: 2 }));
    await start({ retry: true }); expect(store.isReadyForTests()).toBe(true); expect(guardInDb()).toEqual({ starts: 1 });
    store.__resetForTests(); await expect(store.init({ guard: true })).rejects.toMatchObject({ crashLoop: true });
  });
  test('uszkodzony zapis strażnika: start normalny', async () => {
    await fresh(seedState('pl')); global.__kv.set(BOOT_GUARD_KEY, 'nie-json'); await start(); expect(store.isReadyForTests()).toBe(true); expect(guardInDb()).toEqual({ starts: 1 });
  });
  test('init bez opcji nie dotyka strażnika (testy i narzędzia startują wielokrotnie)', async () => {
    await fresh(seedState('pl')); global.__kv.set(BOOT_GUARD_KEY, JSON.stringify({ starts: 5 })); store.__resetForTests(); await store.init();
    expect(store.isReadyForTests()).toBe(true); expect(guardInDb()).toEqual({ starts: 5 });
  });
  test('BOOT_STABLE_MS to krótki, dodatni czas', () => { expect(BOOT_STABLE_MS).toBeGreaterThan(0); expect(BOOT_STABLE_MS).toBeLessThanOrEqual(5000); });
});
