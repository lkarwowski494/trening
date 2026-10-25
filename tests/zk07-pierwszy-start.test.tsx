/*
 * ZK-07 (test właściciela, TestFlight 1030): awaria przy pierwszym uruchomieniu po ponownej instalacji. Przyczyna w kodzie (lib/state/boot.ts + crashguard.ts, M1-003):
 * JEDEN start bez „kamienia” (użytkownik wychodzi do tła albo system zabija wolny pierwszy start, zanim pierwszy ekran dotrwał BOOT_STABLE_MS) kazał następnemu
 * startowi wejść w tryb awaryjny („Aplikacja zamknęła się nieoczekiwanie…”) — także na świeżej instalacji, gdzie nie ma żadnych danych do ochrony.
 * Tu: (1) świeża instalacja nigdy nie wchodzi w tryb awaryjny, (2) dane użytkownika dalej są chronione (M1-003 bez zmian), (3) wyjście do tła przed końcem
 * ładowania nie liczy się jako awaria, (4) ekran błędu nie zeruje licznika, (5) diagnostyka ostatniego startu bez danych osobowych.
 */
import { AppState } from 'react-native';
import * as Font from 'expo-font';
import * as store from '@/lib/store';
import { t } from '@/lib/i18n';
import { BOOT_GUARD_KEY, BOOT_STABLE_MS } from '@/lib/state/crashguard';
import { BOOT_PHASE_KEY, parseBootPhase, describeBootPhase } from '@/lib/state/bootphase';
import { fresh, seedState } from './helpers';
import { renderApp, flushAll, screen } from './app';

jest.mock('expo-font', () => ({ ...jest.requireActual('expo-font'), loadAsync: jest.fn(() => Promise.resolve()) }));
jest.setTimeout(60000);
const guardInDb = () => JSON.parse(global.__kv.get(BOOT_GUARD_KEY) ?? 'null');
const phaseInDb = () => JSON.parse(global.__kv.get(BOOT_PHASE_KEY) ?? 'null');
const SAFE = () => t('Aplikacja zamknęła się nieoczekiwanie przy ostatnich uruchomieniach.');

describe('ZK-07: świeża instalacja nie wchodzi w tryb awaryjny', () => {
  test.each([1, 2, 5, 100])('pusta baza, licznik %i: init({ guard }) otwiera aplikację z danymi startowymi', async starts => {
    await fresh(); global.__kv.clear(); global.__kv.set(BOOT_GUARD_KEY, JSON.stringify({ starts })); store.__resetForTests();
    await store.init({ guard: true });
    expect(store.isReadyForTests()).toBe(true); expect(global.__kv.has('state')).toBe(true); expect(guardInDb()).toEqual({ starts: Math.min(100, starts + 1) });
  });
  test('ekran: pierwszy start po przerwanym pierwszym starcie (pusta baza, licznik 1) pokazuje aplikację, nie ekran awaryjny', async () => {
    await renderApp({ navTimers: false, kv: { [BOOT_GUARD_KEY]: JSON.stringify({ starts: 1 }) } }); await flushAll(50);
    expect(screen.queryByText(SAFE())).toBeNull(); expect(screen.queryByTestId('start-error')).toBeNull(); expect(store.isReadyForTests()).toBe(true);
  });
  test('są dane (zapis „state”): drugi start z rzędu bez „kamienia” nadal awaryjny (M1-003 bez zmian)', async () => {
    await fresh(seedState('pl')); global.__kv.set(BOOT_GUARD_KEY, JSON.stringify({ starts: 1 })); store.__resetForTests();
    await expect(store.init({ guard: true })).rejects.toMatchObject({ crashLoop: true }); expect(store.isReadyForTests()).toBe(false);
  });
  test('są tylko kopie odzyskiwania (bez „state”): dane do ochrony — tryb awaryjny zostaje', async () => {
    await fresh(); global.__kv.clear(); global.__kv.set('state_corrupt_1', '{"x":1}'); global.__kv.set('recovery', JSON.stringify({ key: 'state_corrupt_1', at: 1 })); global.__kv.set(BOOT_GUARD_KEY, JSON.stringify({ starts: 1 })); store.__resetForTests();
    await expect(store.init({ guard: true })).rejects.toMatchObject({ crashLoop: true });
  });
});

describe('ZK-07: wyjście do tła przed końcem ładowania to nie awaria', () => {
  test('store: markBootStable przed otwarciem bazy — licznik po starcie 0, nie 1', async () => {
    await fresh(seedState('pl')); global.__kv.set(BOOT_GUARD_KEY, JSON.stringify({ starts: 0 })); store.__resetForTests();
    const p = store.init({ guard: true }); const m = store.markBootStable(); await Promise.all([p, m]);
    expect(store.isReadyForTests()).toBe(true); expect(guardInDb()).toEqual({ starts: 0 });
  });
  test('store: wyjście do tła wcześniej zaznaczone nie ratuje już zapisanego trybu awaryjnego (decyzja zapada z poprzedniego licznika)', async () => {
    await fresh(seedState('pl')); global.__kv.set(BOOT_GUARD_KEY, JSON.stringify({ starts: 1 })); store.__resetForTests();
    const p = store.init({ guard: true }).then(() => null, e => e); const m = store.markBootStable(); const [err] = await Promise.all([p, m]);
    expect(err).toMatchObject({ crashLoop: true });
  });
  test('ekran: aplikacja w tle, zanim dane się wczytały (krój nie odpowiada) — licznik wraca do 0; kolejny start normalny', async () => {
    const handlers: ((s: string) => void)[] = [];
    const orig = AppState.addEventListener; AppState.addEventListener = ((ev: string, cb: (s: string) => void) => { if (ev === 'change') handlers.push(cb); return { remove: () => {} }; }) as never;
    (Font.loadAsync as jest.Mock).mockImplementationOnce(() => new Promise(() => {}));
    try {
      await renderApp({ saved: seedState('pl'), navTimers: false }); await flushAll(20);
      expect(store.isReadyForTests()).toBe(true); /* init skończony, ale krój jeszcze się ładuje: ekran gotowy dopiero po nim (do 3 s) */
      expect(guardInDb()).toEqual({ starts: 1 });
      await flushAll(0); for (const h of handlers) h('background'); await flushAll(10);
      expect(guardInDb()).toEqual({ starts: 0 });
    } finally { AppState.addEventListener = orig; }
    await renderApp({ saved: seedState('pl'), navTimers: false, kv: { [BOOT_GUARD_KEY]: JSON.stringify({ starts: 0 }) } }); await flushAll(50);
    expect(screen.queryByText(SAFE())).toBeNull();
  });
  test('ekran błędu startu nie zeruje licznika przy wyjściu do tła (pętla awarii nie jest maskowana)', async () => {
    const handlers: ((s: string) => void)[] = [];
    const orig = AppState.addEventListener; AppState.addEventListener = ((ev: string, cb: (s: string) => void) => { if (ev === 'change') handlers.push(cb); return { remove: () => {} }; }) as never;
    try {
      await renderApp({ saved: seedState('pl'), navTimers: false, kv: { [BOOT_GUARD_KEY]: JSON.stringify({ starts: 1 }) } }); await flushAll(50);
      expect(screen.getByText(SAFE())).toBeTruthy(); for (const h of handlers) h('background'); await flushAll(BOOT_STABLE_MS + 100);
      expect(guardInDb()).toEqual({ starts: 2 });
    } finally { AppState.addEventListener = orig; }
  });
});

describe('ZK-07: diagnostyka ostatniego startu (bez danych osobowych)', () => {
  test('start zapisuje etapy: begin -> loaded; po „kamieniu” stable; w zapisie tylko etap, czas, tryb, licznik, schemat, flaga danych', async () => {
    await fresh(seedState('pl')); global.__kv.delete(BOOT_GUARD_KEY); store.__resetForTests();
    await store.init({ guard: true });
    expect(phaseInDb()).toMatchObject({ phase: 'loaded', mode: 'normal', starts: 1, hadData: true }); expect(typeof phaseInDb().ms).toBe('number');
    await store.markBootStable(); expect(phaseInDb()).toMatchObject({ phase: 'stable' });
    expect(Object.keys(phaseInDb()).sort()).toEqual(['hadData', 'mode', 'ms', 'phase', 'schema', 'starts']);
  });
  test('świeża instalacja: hadData false', async () => {
    await fresh(); global.__kv.clear(); store.__resetForTests(); await store.init({ guard: true }); expect(phaseInDb()).toMatchObject({ phase: 'loaded', hadData: false });
  });
  test('tryb awaryjny pokazuje, do jakiego etapu doszedł poprzedni start, i niczego nie zapisuje poza licznikiem', async () => {
    await fresh(seedState('pl'));
    global.__kv.set(BOOT_GUARD_KEY, JSON.stringify({ starts: 1 })); global.__kv.set(BOOT_PHASE_KEY, JSON.stringify({ phase: 'begin', ms: 12, mode: 'normal', starts: 1, hadData: true, schema: 1 }));
    store.__resetForTests(); const before = new Map(global.__kv);
    const err = await store.init({ guard: true }).then(() => null, e => e);
    expect(err.crashLoop).toBe(true); expect(err.bootDiag).toContain('begin');
    expect([...global.__kv].filter(([k]) => k !== BOOT_GUARD_KEY)).toEqual([...before].filter(([k]) => k !== BOOT_GUARD_KEY));
  });
});

describe('ZK-07: parseBootPhase / describeBootPhase — wektory', () => {
  test.each([[null], [undefined], [''], ['nie-json'], ['null'], ['[1]'], ['{"phase":"x"}'], ['{}']])('zły zapis %p -> null', raw => { expect(parseBootPhase(raw as string | null)).toBeNull(); });
  test('poprawny zapis; złe liczby i tryb dają wartości bezpieczne', () => {
    expect(parseBootPhase('{"phase":"loaded","ms":840.7,"mode":"normal","starts":1,"hadData":true,"schema":19}')).toEqual({ phase: 'loaded', ms: 840, mode: 'normal', starts: 1, hadData: true, schema: 19 });
    expect(parseBootPhase('{"phase":"begin","ms":-5,"mode":"x","starts":"a","hadData":"tak","schema":null}')).toEqual({ phase: 'begin', ms: 0, mode: 'normal', starts: 0, hadData: false, schema: 0 });
  });
  test('opis: kod bez tekstów do tłumaczenia; brak etapu -> kreska', () => {
    expect(describeBootPhase({ phase: 'begin', ms: 12, mode: 'normal', starts: 1, hadData: false, schema: 19 })).toBe('start: begin, 12 ms, empty, schema 19, n=1');
    expect(describeBootPhase(null)).toBe('start: -');
  });
});
