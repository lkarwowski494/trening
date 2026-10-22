/*
 * 0.17.0, uprawnienia w działaniu (lib/entitlement.ts): zapamiętany ostatni wynik, offline 7 dni (P6 A), unknown, nasłuch od startu, strażnik startu na wszystkich
 * drogach (GUARDED_STARTS), P3 B, zmiana miesiąca (fałszywy zegar), brak ekranu zakupu po pierwszym treningu (M5 S1; dawne P2 B), niezmiennik „zakup nie dotyka treningów”, zachowanie
 * bez zmian przy PAYWALL.ENABLED = false. Rodzaje (docs/20): logika, scenariusz (restart + zegar), dane (klucz kv poza stanem i kopią), macierz (drogi startu × stany).
 */
import * as store from '@/lib/store';
import { PAYWALL, GUARDED_STARTS, ENTITLEMENT_PLANS, type Entitlement } from '@/lib/access';
import { setStoreAdapter, resetStoreAdapterForTests } from '@/lib/store-adapter';
import { createFakeStore } from '@/lib/store-fake';
import * as ent from '@/lib/entitlement';
import { buildBackup } from '@/lib/backup';
import { E2E_START_ENTITLEMENTS } from '@/lib/store-adapter';
import { startEmptyWorkout } from '@/lib/start';
import { fresh, addWorkout } from './helpers';

const DAY = 86400e3;
const at = (y: number, m: number, d: number, h = 12) => new Date(y, m - 1, d, h).getTime();
const NOW = at(2026, 10, 14);
const S = () => store.getState();
const live = (when: number) => { const w = addWorkout(when, [['Back Squat', [{ weight: 100, reps: 5, done: true }]]], 'Live'); w.live = true; w.tzOffsetMin = -new Date(when).getTimezoneOffset(); store.recordLiveDayFor(w); return w; };
/** Ukończony trening na żywo `i`-tego dnia przed NOW (różne dni = różne dni treningowe, M5 S1). */
const liveDay = (i: number) => live(NOW - (i + 1) * DAY);
const back = (when: number) => addWorkout(when, [['Back Squat', [{ weight: 100, reps: 5, done: true }]]], 'Past');
const sub = (end: number, extra: Partial<Entitlement> = {}): Entitlement => ({ plan: 'monthly', source: 'purchase', expiresAt: end, ...extra });
const life: Entitlement = { plan: 'lifetime', source: 'purchase', expiresAt: null };
let fake: ReturnType<typeof createFakeStore>; const opened: string[] = []; const open = (h: string) => { opened.push(h); };
const flush = async () => { for (let i = 0; i < 6; i++) await Promise.resolve(); };
async function boot(entitlements: Entitlement[] | null = [], opts: { on?: boolean; now?: number } = {}) {
  jest.useFakeTimers({ now: opts.now ?? NOW }); await fresh(); ent.resetEntitlementsForTests(); opened.length = 0;
  PAYWALL.ENABLED = opts.on !== false; fake = createFakeStore(entitlements); setStoreAdapter(fake); await ent.initEntitlements(); await flush();
}
const kvAccess = () => JSON.parse(global.__kv.get('access') ?? 'null');
afterEach(() => { PAYWALL.ENABLED = false; PAYWALL.COUNT_FULL_STARTS_IN_EXPIRY_MONTH = false; PAYWALL.OFFLINE_GRACE_DAYS = 7; ent.resetEntitlementsForTests(); resetStoreAdapterForTests(); jest.useRealTimers(); });

describe('zapamiętany ostatni wynik: odczyt i obliczenie', () => {
  test.each([
    [{ level: 'full', expiresAt: 5 }, { level: 'full', expiresAt: 5 }], [{ level: 'full', expiresAt: null }, { level: 'full', expiresAt: null }], [{ level: 'free' }, { level: 'free' }],
    [JSON.stringify({ level: 'full', expiresAt: 7, at: 1 }), { level: 'full', expiresAt: 7 }], [{ level: 'full' }, null], [{ level: 'full', expiresAt: 'x' }, null], [{ level: 'full', expiresAt: Infinity }, null],
    [{ level: 'pro' }, null], ['{', null], [null, null], [42, null], [[], null], [{}, null],
  ])('parseLastKnown(%j) → %j', (raw, want) => { expect(ent.parseLastKnown(raw)).toEqual(want); });
  test('lastKnownFrom: brak → free; dożywotni → bez końca; najpóźniejszy koniec z aktywnych; wygasłe i cofnięte ignorowane; dożywotni wygrywa z subskrypcją', () => {
    expect(ent.lastKnownFrom([], NOW)).toEqual({ level: 'free' }); expect(ent.lastKnownFrom([life], NOW)).toEqual({ level: 'full', expiresAt: null });
    expect(ent.lastKnownFrom([sub(NOW + DAY), sub(NOW + 5 * DAY), sub(NOW - DAY)], NOW)).toEqual({ level: 'full', expiresAt: NOW + 5 * DAY });
    expect(ent.lastKnownFrom([sub(NOW + DAY, { revokedAt: NOW - 1 }), sub(NOW - DAY)], NOW)).toEqual({ level: 'free' });
    expect(ent.lastKnownFrom([sub(NOW + DAY), life], NOW)).toEqual({ level: 'full', expiresAt: null });
  });
});

describe('nextMonthDay: pierwszy dzień następnego miesiąca do tekstu „Kolejne od …”', () => {
  test.each([[at(2026, 10, 14), [2026, 10, 1]], [at(2026, 10, 31, 23), [2026, 10, 1]], [at(2026, 12, 31, 12), [2027, 0, 1]], [at(2026, 1, 31, 12), [2026, 1, 1]], [at(2028, 2, 29, 8), [2028, 2, 1]], [at(2026, 3, 15), [2026, 3, 1]]])('%#', (now, [y, m, d]) => {
    const r = new Date(ent.nextMonthDay(now)); expect([r.getFullYear(), r.getMonth(), r.getDate(), r.getHours()]).toEqual([y, m, d, 12]);
  });
  test('dzień jest zawsze 1., także w miesiącach ze zmianą czasu (DST)', () => { for (const m of [3, 10]) for (const d of [1, 15, 25, 28, 30]) expect(new Date(ent.nextMonthDay(at(2026, m, d, 23))).getDate()).toBe(1); });
});

describe('PAYWALL.ENABLED = false: zachowanie aplikacji bez zmian', () => {
  test('nic nie rusza sklepu ani bazy; strażnik wpuszcza każdą drogę nawet przy 99 treningach; widok: pełny dostęp, bez limitu', async () => {
    await boot([], { on: false }); for (let i = 0; i < 12; i++) live(NOW - i * 60e3);
    await ent.refreshEntitlements();
    expect(fake.calls.currentEntitlements).toBe(0); expect(fake.listenerCount()).toBe(0); expect(global.__kv.has('access')).toBe(false); expect(global.__kv.has('paywallSeen')).toBe(false);
    for (const k of GUARDED_STARTS) expect(ent.guardLiveStart(k, NOW, open)).toBe(true);
    expect(opened).toEqual([]); const v = ent.accessNow(NOW); expect(v).toMatchObject({ enabled: false, state: 'full', level: 'full' }); expect(v.decision.allowed).toBe(true);
    expect(ent.nextStartBlocked(NOW)).toBe(false); expect(ent.paywallOn()).toBe(false); expect(ent.paywallConfig()).toBe(PAYWALL);
  });
});

describe('odświeżanie uprawnień', () => {
  test('start: nasłuch transakcji od razu (jeden), pierwsze odświeżenie, zapis ostatniego wyniku w kv poza stanem; powtórny init nie dubluje nasłuchu', async () => {
    await boot([sub(NOW + 10 * DAY)]); expect(fake.listenerCount()).toBe(1); expect(fake.calls.currentEntitlements).toBe(1);
    expect(ent.accessNow(NOW)).toMatchObject({ state: 'full', level: 'full' }); expect(kvAccess()).toEqual({ level: 'full', expiresAt: NOW + 10 * DAY, at: NOW });
    await ent.initEntitlements(); expect(fake.listenerCount()).toBe(1); expect(JSON.stringify(store.getState())).not.toContain('"access"');
    expect(JSON.stringify(buildBackup())).not.toContain(String(NOW + 10 * DAY));
  });
  test('zdarzenie transakcji (zakup, odnowienie, kod, zwrot) zmienia stan bez restartu', async () => {
    await boot([]); expect(ent.accessNow(NOW).level).toBe('free');
    fake.setEntitlements([sub(NOW + DAY)]); await flush(); expect(ent.accessNow(NOW).level).toBe('full');
    fake.setEntitlements([sub(NOW + DAY, { revokedAt: NOW - 1 })]); await flush(); expect(ent.accessNow(NOW).level).toBe('free'); expect(kvAccess().level).toBe('free');
  });
  test('współbieżne odświeżenia łączą się w jedno wywołanie sklepu', async () => {
    await boot([]); const n = fake.calls.currentEntitlements; await Promise.all([ent.refreshEntitlements(), ent.refreshEntitlements(), ent.refreshEntitlements()]); expect(fake.calls.currentEntitlements).toBe(n + 1);
  });
  test('uprawnienia z nieznanym planem są odfiltrowane; błąd odczytu → unknown (nie free), zapamiętany wynik nie jest nadpisywany', async () => {
    await boot([sub(NOW + 3 * DAY), { plan: 'obcy' as never, source: 'purchase', expiresAt: NOW + DAY }]); expect(ent.accessNow(NOW).entitlements).toHaveLength(1);
    fake.offline = true; await ent.refreshEntitlements(); const v = ent.accessNow(NOW); expect(v.state).toBe('unknown'); expect(v.level).toBe('full'); expect(kvAccess().expiresAt).toBe(NOW + 3 * DAY);
  });
});

describe('offline i unknown (P6 A: 7 dni)', () => {
  test('sklep bez odpowiedzi, zapamiętany pełny dostęp: pełny do końca + 7 dni, potem free; dożywotni zapamiętany — zawsze pełny', async () => {
    await boot([sub(NOW + 2 * DAY)]); fake.offline = true; await ent.refreshEntitlements();
    for (const [d, lvl] of [[1, 'full'], [2, 'full'], [8.9, 'full'], [9.1, 'free'], [40, 'free']] as const) expect({ d, l: ent.accessNow(NOW + d * DAY).level }).toEqual({ d, l: lvl });
    await boot([life]); fake.offline = true; await ent.refreshEntitlements(); expect(ent.accessNow(NOW + 900 * DAY)).toMatchObject({ state: 'unknown', level: 'full' });
  });
  test('P6 jako parametr: 0 dni = od razu free po dacie wygaśnięcia', async () => {
    await boot([sub(NOW + DAY)]); PAYWALL.OFFLINE_GRACE_DAYS = 0; fake.offline = true; await ent.refreshEntitlements(); expect(ent.accessNow(NOW + 0.9 * DAY).level).toBe('full'); expect(ent.accessNow(NOW + 1.1 * DAY).level).toBe('free');
  });
  test('restart aplikacji w trybie samolotowym: zapamiętany wynik wczytany z bazy; bez zapamiętanego — cicho jak free, strażnik wpuszcza do limitu', async () => {
    await boot([sub(NOW + 5 * DAY)]); const kv = global.__kv.get('access')!; const st = JSON.parse(JSON.stringify(store.getState()));
    await fresh(st); ent.resetEntitlementsForTests(); global.__kv.set('access', kv); fake = createFakeStore(null); setStoreAdapter(fake); await ent.initEntitlements(); await flush();
    expect(ent.accessNow(NOW)).toMatchObject({ state: 'unknown', level: 'full', silent: false });
    await fresh(st); ent.resetEntitlementsForTests(); global.__kv.delete('access'); fake = createFakeStore(null); setStoreAdapter(fake); await ent.initEntitlements(); await flush();
    expect(ent.accessNow(NOW)).toMatchObject({ state: 'unknown', level: 'free', silent: true }); for (let i = 0; i < 5; i++) { expect(ent.guardLiveStart('empty', NOW, open)).toBe(true); liveDay(i); }
    expect(ent.guardLiveStart('empty', NOW, open)).toBe(false); expect(opened).toEqual(['/paywall?reason=limit']);
  });
  test('uszkodzony wpis w kv (nie JSON, zły poziom) → jak brak wpisu, bez wyjątku', async () => {
    for (const bad of ['{', '"x"', JSON.stringify({ level: 'x' })]) { await fresh(); ent.resetEntitlementsForTests(); PAYWALL.ENABLED = true; global.__kv.set('access', bad); fake = createFakeStore(null); setStoreAdapter(fake); await ent.initEntitlements(); await flush(); expect(ent.accessNow(NOW)).toMatchObject({ level: 'free', silent: true }); }
  });
});

describe('strażnik startu treningu na żywo', () => {
  test.each(GUARDED_STARTS.map(k => [k]))('droga „%s”: 5 darmowych dni przechodzi, 6. dzień otwiera ekran zakupu (reason=limit) i zwraca false; ten sam dzień przechodzi', async kind => {
    await boot([]); for (let i = 0; i < 5; i++) { expect(ent.guardLiveStart(kind, NOW, open)).toBe(true); liveDay(i); }
    expect(opened).toEqual([]); expect(ent.guardLiveStart(kind, NOW, open)).toBe(false); expect(opened).toEqual(['/paywall?reason=limit']); expect(ent.nextStartBlocked(NOW)).toBe(true);
    live(NOW - 1000); expect(ent.guardLiveStart(kind, NOW, open)).toBe(true); expect(opened).toHaveLength(1); /* dziś już trening → ten sam dzień */
  });
  test('trening wstecz i treningi bez znacznika nie liczą się; trening w toku nie jest blokowany (strażnik wpuszcza)', async () => {
    await boot([]); for (let i = 0; i < 9; i++) back(NOW - 60e3 * (i + 1)); expect(ent.liveStarts()).toEqual([]); expect(ent.guardLiveStart('empty', NOW, open)).toBe(true);
    for (let i = 0; i < 5; i++) liveDay(i); expect(ent.guardLiveStart('template', NOW, open)).toBe(false);
    S().active = { ...back(NOW - 5000), finishedAt: null, live: true } as never; store.getState().workouts.pop(); expect(ent.guardLiveStart('template', NOW, open)).toBe(true); expect(ent.liveStarts()).toHaveLength(5); /* trwający nie wchodzi do licznika */
  });
  test('pełny dostęp (subskrypcja, dożywotni, rodzina, kod) — bez limitu; po wygaśnięciu P3 B: starty sprzed wygaśnięcia nie liczą się, po — tak', async () => {
    for (const e of [sub(NOW + DAY), life, sub(NOW + DAY, { source: 'family' }), sub(NOW + DAY, { source: 'code' })]) { await boot([e]); for (let i = 0; i < 9; i++) liveDay(i); expect(ent.guardLiveStart('empty', NOW, open)).toBe(true); }
    await boot([sub(NOW - 6 * DAY)]); for (let i = 6; i < 12; i++) liveDay(i); for (let i = 0; i < 5; i++) { expect(ent.guardLiveStart('empty', NOW, open)).toBe(true); liveDay(i); }
    expect(ent.guardLiveStart('empty', NOW, open)).toBe(false);
    PAYWALL.COUNT_FULL_STARTS_IN_EXPIRY_MONTH = true; expect(ent.accessNow(NOW).decision.used).toBe(11); /* wariant A: 6 dni sprzed wygaśnięcia + 5 po */
  });
  test('scenariusz z fałszywym zegarem: wygaśnięcie → 5 dni → nowy dzień zablokowany, ten sam dzień wolny → nowy miesiąc odblokowuje; zakup odblokowuje od razu', async () => {
    const d = (day: number, h = 9) => at(2026, 10, day, h); const oct31 = d(31); await boot([sub(d(26))], { now: d(27) });
    for (const day of [27, 28, 29, 30, 31]) { jest.setSystemTime(d(day)); expect(ent.guardLiveStart('empty', d(day), open)).toBe(true); live(d(day)); }
    expect(ent.accessNow(oct31).decision).toMatchObject({ used: 5, allowed: true }); expect(ent.guardLiveStart('empty', oct31 + 3600e3, open)).toBe(true); /* 31.10. już był dniem treningowym */
    jest.setSystemTime(at(2026, 11, 1, 0) + 60e3); expect(ent.guardLiveStart('empty', Date.now(), open)).toBe(true); expect(ent.accessNow(Date.now()).decision.used).toBe(0);
    for (const day of [1, 2, 3, 4, 5]) live(at(2026, 11, day, 9)); jest.setSystemTime(at(2026, 11, 6, 9));
    expect(ent.guardLiveStart('empty', Date.now(), open)).toBe(false); expect(opened).toEqual(['/paywall?reason=limit']);
    expect((await ent.purchasePlan('yearly')).status).toBe('success'); expect(ent.guardLiveStart('empty', Date.now(), open)).toBe(true);
  });
});

describe('akcje użytkownika nie dotykają danych treningowych', () => {
  const snap = () => JSON.stringify({ w: S().workouts, a: S().active, t: S().templates, x: S().exercises });
  test.each(ENTITLEMENT_PLANS.map(p => [p]))('zakup %s, przywrócenie, odświeżenie i błąd zakupu nie zmieniają workouts/szablonów/ćwiczeń', async plan => {
    await boot([]); live(NOW - 1000); back(NOW - 2000); const before = snap();
    await ent.purchasePlan(plan); fake.nextPurchase = 'cancelled'; await ent.purchasePlan('monthly'); fake.nextPurchase = 'error'; await ent.purchasePlan('monthly'); await ent.restorePurchases(); fake.offline = true; await ent.restorePurchases(); await ent.refreshEntitlements();
    expect(snap()).toBe(before);
  });
  test('w stanie free dane są dostępne: kopia zapasowa zawiera wszystkie treningi (także ponad limit), historia bez zmian', async () => {
    await boot([]); for (let i = 0; i < 6; i++) liveDay(i); expect(ent.guardLiveStart('empty', NOW, open)).toBe(false); expect(buildBackup().state.workouts).toHaveLength(6);
  });
  test('przywracanie: restored (aktywne uprawnienie), none (konto bez zakupów), error (brak sieci — stan bez zmian)', async () => {
    await boot([]); expect(await ent.restorePurchases()).toBe('none'); fake.restorable = [life]; expect(await ent.restorePurchases()).toBe('restored'); expect(ent.accessNow(NOW).active).toMatchObject({ plan: 'lifetime' });
    fake.offline = true; expect(await ent.restorePurchases()).toBe('error'); expect(ent.accessNow(NOW).level).toBe('full');
  });
  test('widok: najsilniejsze uprawnienie jest „active” (dożywotni > roczne > miesięczne)', async () => {
    await boot([sub(NOW + DAY), { plan: 'yearly', source: 'purchase', expiresAt: NOW + DAY }, life]); expect(ent.accessNow(NOW).active!.plan).toBe('lifetime');
    await boot([sub(NOW + DAY), { plan: 'yearly', source: 'purchase', expiresAt: NOW + DAY }]); expect(ent.accessNow(NOW).active!.plan).toBe('yearly');
  });
});

describe('M5 S1: ekran zakupu nie otwiera się sam po pierwszym treningu', () => {
  test('brak funkcji i znacznika „paywallSeen”: po ukończeniu pierwszego treningu na żywo nic nie otwiera ekranu zakupu', async () => {
    expect((ent as unknown as Record<string, unknown>).maybeShowPaywallAfterFirstWorkout).toBeUndefined(); expect((ent as unknown as Record<string, unknown>).PAYWALL_SEEN_KEY).toBeUndefined();
    await boot([]); live(NOW - 1000); expect(opened).toEqual([]); expect(global.__kv.has('paywallSeen')).toBe(false);
  });
});

describe('startEmptyWorkout: pusty trening przez strażnik', () => {
  test('wolno → trening w toku, `after` wywołane; ponad limit → ekran zakupu, brak treningu, `after` nie; przełącznik wyłączony → zawsze startuje', async () => {
    await boot([]); const router = require('expo-router').router; const push = jest.spyOn(router, 'push').mockImplementation(() => {}); let after = 0;
    expect(startEmptyWorkout(() => { after++; })).toBe(true); expect(S().active).not.toBeNull(); expect(after).toBe(1); S().active = null;
    for (let i = 0; i < 5; i++) liveDay(i); expect(startEmptyWorkout(() => { after++; })).toBe(false); expect(S().active).toBeNull(); expect(after).toBe(1); expect(push).toHaveBeenCalledWith('/paywall?reason=limit');
    PAYWALL.ENABLED = false; expect(startEmptyWorkout()).toBe(true); expect(S().active).not.toBeNull(); push.mockRestore();
  });
  test('start przy trwającym treningu nie tworzy drugiego (jak dotąd), strażnik go nie blokuje', async () => { await boot([]); expect(startEmptyWorkout()).toBe(true); expect(startEmptyWorkout()).toBe(false); expect(S().active).not.toBeNull(); });
});
describe('wymiar: uprawnienia startowe buildu E2E', () => {
  test('każde uprawnienie startowe to aktywny dostęp bez końca (scenariusze 01–20 działają bez limitu)', () => { for (const e of E2E_START_ENTITLEMENTS) { expect(e.plan).toBe('lifetime'); expect(e.expiresAt).toBeNull(); } expect(E2E_START_ENTITLEMENTS).toHaveLength(1); });
});
