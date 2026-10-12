/* lib/access.ts — stany dostępu, licznik 4 treningów, strażnik startu, funkcje zawsze dostępne (docs/27, wydanie 0.17 — logika bez UI). */
import fc from 'fast-check';
import {
  PAYWALL, ACCESS_STATES, ENTITLEMENT_PLANS, ENTITLEMENT_SOURCES, ALWAYS_AVAILABLE, GUARDED_STARTS,
  access, effectiveAccess, entitlementActive, entitlementEnd, freeSince, freeUsed, monthKey, nextMonthStart, canStartLive, isAlwaysAvailable,
  type PaywallConfig, type Entitlement, type LiveStart, type AccessContext,
} from '@/lib/access';

const ON: PaywallConfig = { ...PAYWALL, ENABLED: true };
/** Chwila na zegarze o przesunięciu `off` min (na wschód od UTC). */
const at = (y: number, m: number, d: number, h = 0, mi = 0, off = 0) => Date.UTC(y, m - 1, d, h, mi) - off * 60e3;
const NOW = at(2026, 11, 15, 12, 0);
const DAY = 86400e3;
const sub = (plan: 'monthly' | 'yearly', end: number, extra: Partial<Entitlement> = {}): Entitlement => ({ plan, source: 'purchase', expiresAt: end, ...extra });
const life: Entitlement = { plan: 'lifetime', source: 'purchase' };
const starts = (n: number, ts = NOW - DAY): LiveStart[] => Array.from({ length: n }, (_, i) => ({ startedAt: ts + i * 60e3, tzOffsetMin: 0 }));
const OFFS = [-600, -480, -300, 0, 60, 120, 330, 345, 525, 720, 840];

describe('stałe w jednym miejscu', () => {
  test('wartości domyślne: przełącznik WYŁĄCZONY, limit 4, P3 = B (nie liczy), P6 = 7 dni', () => {
    expect(PAYWALL).toEqual({ ENABLED: false, FREE_LIVE_PER_MONTH: 4, COUNT_FULL_STARTS_IN_EXPIRY_MONTH: false, OFFLINE_GRACE_DAYS: 7 });
  });
  test('wymiary: stany, plany, źródła, funkcje zawsze dostępne, drogi startu', () => {
    expect(ACCESS_STATES).toEqual(['full', 'free', 'unknown', 'testflight']);
    expect(ENTITLEMENT_PLANS).toEqual(['monthly', 'yearly', 'lifetime']);
    expect(ENTITLEMENT_SOURCES).toEqual(['purchase', 'family', 'code']);
    expect(GUARDED_STARTS).toEqual(['template', 'empty', 'repeatLast', 'calendar', 'deloadHint']);
    for (const f of ['history', 'historyEdit', 'backdated', 'backup', 'restoreBackup', 'exportCsv', 'restorePurchases', 'redeemCode', 'manageSubscription']) expect(ALWAYS_AVAILABLE).toContain(f);
    expect(ALWAYS_AVAILABLE).not.toContain('startLive');
  });
  test.each([...ALWAYS_AVAILABLE])('isAlwaysAvailable(%s) = true, a start treningu na żywo nie', f => {
    expect(isAlwaysAvailable(f)).toBe(true); expect(isAlwaysAvailable('startLive')).toBe(false);
  });
});

describe('przełącznik wyłączony (domyślnie): zawsze pełny dostęp, zachowanie aplikacji bez zmian', () => {
  test.each([[null], [[]], [[sub('monthly', NOW - DAY)]]])('access/effectiveAccess/canStartLive przy uprawnieniach %j', ent => {
    expect(access({}, ent as any, NOW)).toBe('full');
    expect(access({ testflight: true }, ent as any, NOW)).toBe('full');
    expect(effectiveAccess({}, ent as any, NOW)).toEqual({ state: 'full', level: 'full', silent: false });
    const d = canStartLive({}, ent as any, starts(50), NOW, 0);
    expect(d.allowed).toBe(true); expect(d.level).toBe('full'); expect(d.used).toBe(0); expect(d.resetsAt).toBeNull();
  });
});

describe('access() — wszystkie stany i uprawnienia (przełącznik włączony)', () => {
  const st = (ent: Entitlement[] | null | undefined, ctx: AccessContext = {}, now = NOW) => access(ctx, ent, now, ON);
  test('brak uprawnień (pusta lista = sklep odpowiedział) → free', () => { expect(st([])).toBe('free'); });
  test('brak odpowiedzi sklepu (null / undefined) → unknown', () => { expect(st(null)).toBe('unknown'); expect(st(undefined)).toBe('unknown'); });
  test.each(ENTITLEMENT_SOURCES.map(s => [s]))('subskrypcja miesięczna ze źródła %s, aktywna → full', source => { expect(st([sub('monthly', NOW + DAY, { source })])).toBe('full'); });
  test.each(ENTITLEMENT_SOURCES.map(s => [s]))('subskrypcja roczna ze źródła %s, aktywna → full', source => { expect(st([sub('yearly', NOW + 300 * DAY, { source })])).toBe('full'); });
  test('okres próbny to zwykła subskrypcja przed końcem → full; po końcu bez odnowienia → free', () => {
    expect(st([sub('monthly', NOW + 5 * DAY)])).toBe('full'); expect(st([sub('monthly', NOW - 1)])).toBe('free');
  });
  test('dożywotni (bez daty końca) → full, także po latach', () => { expect(st([life])).toBe('full'); expect(st([life], {}, NOW + 5000 * DAY)).toBe('full'); });
  test('dożywotni z Chmury rodzinnej → full; po cofnięciu (wyjście z rodziny) → free', () => {
    expect(st([{ ...life, source: 'family' }])).toBe('full');
    expect(st([{ ...life, source: 'family', revokedAt: NOW - 1 }])).toBe('free');
  });
  test('granica końca: w chwili wygaśnięcia już free, milisekundę wcześniej full', () => {
    expect(st([sub('monthly', NOW)])).toBe('free'); expect(st([sub('monthly', NOW + 1)])).toBe('full');
  });
  test('zwrot (revokedAt w przeszłości) → free; zwrot w przyszłości jeszcze nie działa', () => {
    expect(st([sub('yearly', NOW + 100 * DAY, { revokedAt: NOW - 1 })])).toBe('free');
    expect(st([sub('yearly', NOW + 100 * DAY, { revokedAt: NOW + DAY })])).toBe('full');
  });
  test('karencja płatności (graceUntil po expiresAt) → full do końca karencji, potem free', () => {
    const e = sub('monthly', NOW - DAY, { graceUntil: NOW + 15 * DAY });
    expect(st([e])).toBe('full'); expect(st([e], {}, NOW + 15 * DAY)).toBe('free');
    expect(st([sub('monthly', NOW + DAY, { graceUntil: NOW - 5 * DAY })])).toBe('full'); /* karencja wcześniejsza niż koniec nie skraca */
  });
  test('dowolne aktywne uprawnienie wystarcza (wygasła miesięczna + aktywna dożywotnia)', () => { expect(st([sub('monthly', NOW - DAY), life])).toBe('full'); });
  test('uszkodzone dane (subskrypcja bez daty, NaN, nieznany plan) → nieaktywne, bez wyjątku', () => {
    expect(st([{ plan: 'monthly', source: 'purchase' }])).toBe('free');
    expect(st([sub('monthly', NaN)])).toBe('free');
    expect(st([sub('monthly', NOW + DAY, { revokedAt: NaN })])).toBe('free');
    expect(st([{ plan: 'weekly' as any, source: 'purchase', expiresAt: NOW + DAY }])).toBe('free');
    expect(st([null as any])).toBe('free');
  });
  test('TestFlight → testflight niezależnie od uprawnień (poziom: wynik sklepu)', () => {
    for (const ent of [null, [], [life]]) expect(st(ent, { testflight: true })).toBe('testflight');
  });
});

describe('effectiveAccess() — poziom dla unknown i testflight, karencja offline (P6)', () => {
  const ef = (ent: Entitlement[] | null, ctx: AccessContext = {}, now = NOW) => effectiveAccess(ctx, ent, now, ON);
  test('full / free z uprawnień nie są ciche', () => {
    expect(ef([life])).toEqual({ state: 'full', level: 'full', silent: false }); expect(ef([])).toEqual({ state: 'free', level: 'free', silent: false });
  });
  test('unknown bez zapamiętanego wyniku → free, cicho (bez komunikatu o blokadzie)', () => {
    expect(ef(null)).toEqual({ state: 'unknown', level: 'free', silent: true });
    expect(ef(null, { lastKnown: null })).toEqual({ state: 'unknown', level: 'free', silent: true });
    expect(ef(null, { lastKnown: { level: 'x' as any } })).toMatchObject({ level: 'free', silent: true });
  });
  test('unknown z zapamiętanym free → free (nie cicho); z zapamiętanym dożywotnim → full', () => {
    expect(ef(null, { lastKnown: { level: 'free' } })).toEqual({ state: 'unknown', level: 'free', silent: false });
    expect(ef(null, { lastKnown: { level: 'full', expiresAt: null } })).toEqual({ state: 'unknown', level: 'full', silent: false });
  });
  test('unknown z zapamiętanym full: przed datą, w karencji [DO DECYZJI P6: 7 dni], po karencji', () => {
    const exp = NOW - 3 * DAY; const lk = { level: 'full', expiresAt: exp } as const;
    expect(ef(null, { lastKnown: { ...lk, expiresAt: NOW + DAY } }).level).toBe('full');
    expect(ef(null, { lastKnown: lk }).level).toBe('full'); /* 3 dni po wygaśnięciu — jeszcze w karencji */
    expect(ef(null, { lastKnown: lk }, exp + 7 * DAY - 1).level).toBe('full');
    expect(ef(null, { lastKnown: lk }, exp + 7 * DAY).level).toBe('free'); /* koniec karencji wyłączny */
    expect(ef(null, { lastKnown: { level: 'full', expiresAt: NaN } })).toMatchObject({ level: 'free', silent: true });
  });
  test('P6 jako parametr: 0 dni = wariant B (od razu free po dacie)', () => {
    const cfg = { ...ON, OFFLINE_GRACE_DAYS: 0 }; const lk = { level: 'full', expiresAt: NOW - 1 } as const;
    expect(effectiveAccess({ lastKnown: lk }, null, NOW, cfg).level).toBe('free');
    expect(effectiveAccess({ lastKnown: lk }, null, NOW, { ...cfg, OFFLINE_GRACE_DAYS: -5 }).level).toBe('free'); /* ujemna wartość = 0 */
  });
  test('odpowiedź sklepu ma pierwszeństwo przed zapamiętanym stanem (wygasło → free mimo lastKnown full)', () => {
    expect(ef([], { lastKnown: { level: 'full', expiresAt: null } }).level).toBe('free');
  });
  test('testflight: poziom z wyniku sklepu (piaskownica); bez odpowiedzi — jak unknown', () => {
    expect(ef([life], { testflight: true })).toEqual({ state: 'testflight', level: 'full', silent: false });
    expect(ef([], { testflight: true })).toEqual({ state: 'testflight', level: 'free', silent: false });
    expect(ef(null, { testflight: true })).toEqual({ state: 'testflight', level: 'free', silent: true });
    expect(ef(null, { testflight: true, lastKnown: { level: 'full', expiresAt: null } }).level).toBe('full');
  });
});

describe('entitlementEnd / entitlementActive / freeSince', () => {
  test('koniec: data, karencja, cofnięcie, bez końca, uszkodzone', () => {
    expect(entitlementEnd(sub('monthly', 100))).toBe(100);
    expect(entitlementEnd(sub('monthly', 100, { graceUntil: 500 }))).toBe(500);
    expect(entitlementEnd(sub('monthly', 100, { graceUntil: 500, revokedAt: 200 }))).toBe(200);
    expect(entitlementEnd(life)).toBe(Infinity);
    expect(entitlementEnd({ plan: 'yearly', source: 'code' })).toBeNull();
    expect(entitlementActive(sub('monthly', 100), 99)).toBe(true); expect(entitlementActive(sub('monthly', 100), 100)).toBe(false);
  });
  test('freeSince: najpóźniejszy koniec; aktywne/dożywotnie → null; brak uprawnień → null', () => {
    expect(freeSince([sub('monthly', NOW - 10 * DAY), sub('yearly', NOW - 3 * DAY)], NOW)).toBe(NOW - 3 * DAY);
    expect(freeSince([sub('monthly', NOW - 10 * DAY), sub('yearly', NOW + DAY)], NOW)).toBeNull();
    expect(freeSince([life], NOW)).toBeNull(); expect(freeSince([], NOW)).toBeNull(); expect(freeSince(null, NOW)).toBeNull();
    expect(freeSince([{ plan: 'monthly', source: 'purchase' }], NOW)).toBeNull();
  });
});

describe('miesiąc kalendarzowy — granice, strefy', () => {
  test('monthKey: przełom roku, luty przestępny, północ', () => {
    expect(monthKey(at(2026, 12, 31, 23, 59), 0)).toBe('2026-12'); expect(monthKey(at(2027, 1, 1, 0, 0), 0)).toBe('2027-01');
    expect(monthKey(at(2028, 2, 29, 12), 0)).toBe('2028-02'); expect(monthKey(at(2028, 3, 1, 0, 0), 0)).toBe('2028-03');
  });
  test.each(OFFS.map(o => [o]))('strefa %i min: trening 31. o 23:30 liczy się do miesiąca startu, 1. o 00:00 do następnego', off => {
    expect(monthKey(at(2026, 10, 31, 23, 30, off), off)).toBe('2026-10'); expect(monthKey(at(2026, 11, 1, 0, 0, off), off)).toBe('2026-11');
    expect(monthKey(at(2026, 11, 1, 0, 0, off) - 1, off)).toBe('2026-10');
  });
  test.each(OFFS.map(o => [o]))('strefa %i min: nextMonthStart = północ 1. dnia następnego miesiąca na zegarze strefy', off => {
    expect(nextMonthStart(at(2026, 10, 31, 23, 30, off), off)).toBe(at(2026, 11, 1, 0, 0, off));
    expect(nextMonthStart(at(2026, 12, 15, 8, 0, off), off)).toBe(at(2027, 1, 1, 0, 0, off));
  });
  test('licznik: ta sama chwila w różnych miesiącach zależnie od strefy startu (J3: strefa z treningu)', () => {
    const s: LiveStart = { startedAt: Date.UTC(2026, 10, 30, 23, 30), tzOffsetMin: 120 }; /* 1.12. 01:30 w Polsce, 30.11. 23:30 UTC */
    expect(freeUsed([s], at(2026, 12, 5, 12, 0, 120), 120)).toBe(1); /* teraz grudzień → liczy się */
    expect(freeUsed([{ ...s, tzOffsetMin: 0 }], at(2026, 12, 5, 12, 0, 120), 120)).toBe(0); /* start w listopadzie wg strefy UTC */
  });
  test('licznik: trening bez strefy używa bieżącej; start w innym miesiącu / roku nie liczy się', () => {
    expect(freeUsed([{ startedAt: at(2026, 11, 1, 0, 0, 120) }], at(2026, 11, 20, 0, 0, 120), 120)).toBe(1);
    expect(freeUsed([{ startedAt: at(2025, 11, 10) }, { startedAt: at(2026, 10, 31, 23, 59) }], NOW, 0)).toBe(0);
  });
  test('licznik: uszkodzone wpisy pomijane', () => { expect(freeUsed([null as any, { startedAt: NaN }, { startedAt: NOW - DAY }], NOW, 0)).toBe(1); });
  test('licznik: pusta lista → 0', () => { expect(freeUsed([], NOW, 0)).toBe(0); });
});

describe('canStartLive() — limit 4 w stanie free', () => {
  const can = (ent: Entitlement[] | null, st: LiveStart[], ctx: AccessContext = {}, now = NOW, off = 0) => canStartLive(ctx, ent, st, now, off, ON);
  test.each([0, 1, 2, 3])('%i zużyte → start dozwolony (zostaje 4 − n)', n => {
    const d = can([], starts(n)); expect(d.allowed).toBe(true); expect(d.used).toBe(n); expect(d.remaining).toBe(4 - n); expect(d.limit).toBe(4); expect(d.resetsAt).toBeNull(); expect(d.level).toBe('free');
  });
  test.each([4, 5, 9])('%i zużyte → start zablokowany, limit wraca 1. dnia następnego miesiąca', n => {
    const d = can([], starts(n)); expect(d.allowed).toBe(false); expect(d.remaining).toBe(0); expect(d.resetsAt).toBe(at(2026, 12, 1, 0, 0));
  });
  test('zmiana miesiąca odblokowuje (północ 1.12.), a ostatnia sekunda listopada jeszcze blokuje', () => {
    const st = starts(4, at(2026, 11, 10, 10));
    expect(can([], st, {}, at(2026, 11, 30, 23, 59)).allowed).toBe(false); expect(can([], st, {}, at(2026, 12, 1, 0, 0)).allowed).toBe(true);
  });
  test('trening rozpoczęty 31. o 23:30 liczy się do miesiąca startu, nie następnego', () => {
    const st = starts(4, at(2026, 10, 31, 23, 30)); expect(can([], st, {}, at(2026, 11, 1, 8, 0)).allowed).toBe(true); expect(can([], st, {}, at(2026, 10, 31, 23, 45)).allowed).toBe(false);
  });
  test.each(OFFS.map(o => [o]))('strefa %i min: 4 starty w miesiącu blokują, nowy miesiąc na zegarze strefy odblokowuje', off => {
    const st = Array.from({ length: 4 }, (_, i) => ({ startedAt: at(2026, 11, 3 + i, 9, 0, off), tzOffsetMin: off }));
    expect(can([], st, {}, at(2026, 11, 30, 23, 59, off), off).allowed).toBe(false); expect(can([], st, {}, at(2026, 12, 1, 0, 0, off), off).allowed).toBe(true);
  });
  test('pełny dostęp: bez limitu, licznik 0 (także przy 100 treningach w miesiącu)', () => {
    for (const ent of [[life], [sub('monthly', NOW + DAY)], [sub('yearly', NOW + DAY, { source: 'family' })]]) {
      const d = can(ent, starts(100)); expect(d).toMatchObject({ allowed: true, level: 'full', used: 0, remaining: Infinity, resetsAt: null });
    }
  });
  test('unknown bez pamięci: cichy, ale po przekroczeniu limitu odmowa z silent=false', () => {
    const ok = can(null, starts(2)); expect(ok.allowed).toBe(true); expect(ok.silent).toBe(true);
    const no = can(null, starts(4)); expect(no.allowed).toBe(false); expect(no.silent).toBe(false);
  });
  test('unknown z zapamiętanym full (offline) nie blokuje płacącego', () => {
    expect(can(null, starts(50), { lastKnown: { level: 'full', expiresAt: NOW + DAY } }).allowed).toBe(true);
    expect(can(null, starts(50), { lastKnown: { level: 'full', expiresAt: NOW - 8 * DAY } }).allowed).toBe(false);
  });
  test('testflight: limit według wyniku sklepu (piaskownica)', () => {
    expect(can([life], starts(50), { testflight: true }).allowed).toBe(true); expect(can([], starts(4), { testflight: true }).allowed).toBe(false);
  });
  describe('[DO DECYZJI P3] treningi rozpoczęte w full po wygaśnięciu w tym samym miesiącu', () => {
    const expiry = at(2026, 11, 10, 12, 0);
    const ent = [sub('monthly', expiry)]; /* wygasła 10.11. */
    const st: LiveStart[] = [
      ...[1, 2, 3].map(d => ({ startedAt: at(2026, 11, d, 9), tzOffsetMin: 0 })), /* 3 starty w full (przed wygaśnięciem) */
      { startedAt: at(2026, 11, 12, 9), tzOffsetMin: 0 }, /* 1 po wygaśnięciu */
    ];
    test('domyślnie (wariant B, rekomendowany): liczą się tylko starty od wygaśnięcia → zostają 3', () => {
      const d = can(ent, st); expect(d.used).toBe(1); expect(d.remaining).toBe(3); expect(d.allowed).toBe(true);
    });
    test('wariant A (stała true): wszystkie starty miesiąca → 4 zużyte, blokada', () => {
      const d = canStartLive({}, ent, st, NOW, 0, { ...ON, COUNT_FULL_STARTS_IN_EXPIRY_MONTH: true }); expect(d.used).toBe(4); expect(d.allowed).toBe(false);
    });
    test('start dokładnie w chwili wygaśnięcia liczy się (od chwili wygaśnięcia włącznie); bez wygaśnięcia (nigdy nie kupił) liczą się wszystkie', () => {
      expect(can(ent, [{ startedAt: expiry, tzOffsetMin: 0 }]).used).toBe(1); expect(can(ent, [{ startedAt: expiry - 1, tzOffsetMin: 0 }]).used).toBe(0);
      expect(can([], st).used).toBe(4);
    });
  });
  test('liczba w jednym miejscu: zmiana FREE_LIVE_PER_MONTH zmienia limit', () => {
    const cfg = { ...ON, FREE_LIVE_PER_MONTH: 2 }; expect(canStartLive({}, [], starts(2), NOW, 0, cfg).allowed).toBe(false); expect(canStartLive({}, [], starts(1), NOW, 0, cfg).allowed).toBe(true);
  });
  test('przełącznik: ta sama sytuacja zablokowana po włączeniu, dozwolona po wyłączeniu', () => {
    expect(canStartLive({}, [], starts(4), NOW, 0, ON).allowed).toBe(false); expect(canStartLive({}, [], starts(4), NOW, 0, { ...ON, ENABLED: false }).allowed).toBe(true);
    expect(canStartLive({}, [], starts(4), NOW, 0).allowed).toBe(true); /* domyślna konfiguracja: wyłączone */
  });
});

describe('niezmienniki (fast-check)', () => {
  const planA = fc.constantFrom(...ENTITLEMENT_PLANS); const srcA = fc.constantFrom(...ENTITLEMENT_SOURCES);
  const entA = fc.record({ plan: planA, source: srcA, expiresAt: fc.option(fc.integer({ min: NOW - 400 * DAY, max: NOW + 400 * DAY }), { nil: undefined }),
    graceUntil: fc.option(fc.integer({ min: NOW - 400 * DAY, max: NOW + 400 * DAY }), { nil: null }), revokedAt: fc.option(fc.integer({ min: NOW - 400 * DAY, max: NOW + 400 * DAY }), { nil: null }) }, { requiredKeys: ['plan', 'source'] }) as fc.Arbitrary<Entitlement>;
  const entsA = fc.option(fc.array(entA, { maxLength: 4 }), { nil: null });
  const startA = fc.record({ startedAt: fc.integer({ min: NOW - 120 * DAY, max: NOW + DAY }), tzOffsetMin: fc.option(fc.constantFrom(...OFFS), { nil: undefined }) });
  const ctxA = fc.record({ testflight: fc.boolean(), lastKnown: fc.option(fc.record({ level: fc.constantFrom('full', 'free') as fc.Arbitrary<'full' | 'free'>, expiresAt: fc.option(fc.integer({ min: NOW - 30 * DAY, max: NOW + 30 * DAY }), { nil: null }) }), { nil: null }) });
  const nowA = fc.integer({ min: NOW - 60 * DAY, max: NOW + 60 * DAY }); const offA = fc.constantFrom(...OFFS);

  test('przełącznik wyłączony → zawsze full i start dozwolony, niezależnie od danych', () => {
    fc.assert(fc.property(ctxA, entsA, fc.array(startA, { maxLength: 12 }), nowA, offA, (ctx, ent, st, now, off) => {
      expect(access(ctx, ent, now, { ...PAYWALL, ENABLED: false })).toBe('full'); expect(canStartLive(ctx, ent, st, now, off, { ...PAYWALL, ENABLED: false }).allowed).toBe(true);
    }));
  });
  test('w stanie free: zużyte ≤ liczba startów w miesiącu; allowed ⇔ used < limit; remaining = limit − used ≥ 0; odmowa ma datę odnowienia po „teraz”', () => {
    fc.assert(fc.property(ctxA, entsA, fc.array(startA, { maxLength: 12 }), nowA, offA, (ctx, ent, st, now, off) => {
      const d = canStartLive(ctx, ent, st, now, off, ON);
      if (d.level === 'full') { expect(d.allowed).toBe(true); return; }
      expect(d.used).toBeLessThanOrEqual(st.length); expect(d.allowed).toBe(d.used < 4); expect(d.remaining).toBe(Math.max(0, 4 - d.used));
      if (!d.allowed) { expect(d.resetsAt!).toBeGreaterThan(now); expect(d.resetsAt! - now).toBeLessThanOrEqual(31 * DAY + DAY); expect(monthKey(d.resetsAt!, off)).not.toBe(monthKey(now, off)); } else expect(d.resetsAt).toBeNull();
    }));
  });
  test('dodanie startu nigdy nie zmniejsza zużycia; usunięcie nigdy nie zwiększa (monotoniczność)', () => {
    fc.assert(fc.property(fc.array(startA, { maxLength: 10 }), startA, nowA, offA, (st, extra, now, off) => {
      expect(freeUsed([...st, extra], now, off)).toBeGreaterThanOrEqual(freeUsed(st, now, off)); expect(freeUsed(st.slice(1), now, off)).toBeLessThanOrEqual(freeUsed(st, now, off));
    }));
  });
  test('pamięć o P3: wariant B nigdy nie liczy więcej niż wariant A', () => {
    fc.assert(fc.property(entsA, fc.array(startA, { maxLength: 12 }), nowA, offA, (ent, st, now, off) => {
      const fs = freeSince(ent, now);
      expect(freeUsed(st, now, off, fs, ON)).toBeLessThanOrEqual(freeUsed(st, now, off, fs, { ...ON, COUNT_FULL_STARTS_IN_EXPIRY_MONTH: true }));
    }));
  });
  test('uprawnienie aktywne ⇒ full (bez TestFlight); brak aktywnych i odpowiedź sklepu ⇒ free; wynik niezależny od kolejności listy', () => {
    fc.assert(fc.property(fc.array(entA, { maxLength: 4 }), nowA, (ent, now) => {
      const any = ent.some(e => entitlementActive(e, now));
      expect(access({}, ent, now, ON)).toBe(any ? 'full' : 'free'); expect(access({}, [...ent].reverse(), now, ON)).toBe(access({}, ent, now, ON));
    }));
  });
  test('monthKey/nextMonthStart: początek następnego miesiąca jest w nowym miesiącu, a chwila przed nim w starym', () => {
    fc.assert(fc.property(nowA, offA, (ts, off) => {
      const n = nextMonthStart(ts, off); expect(n).toBeGreaterThan(ts); expect(monthKey(n, off)).not.toBe(monthKey(ts, off)); expect(monthKey(n - 1, off)).toBe(monthKey(ts, off));
    }));
  });
  test('funkcje nie mutują argumentów', () => {
    const ent = [sub('monthly', NOW + DAY)]; const st = starts(3); const snap = JSON.stringify([ent, st]);
    canStartLive({ lastKnown: { level: 'full' } }, ent, st, NOW, 0, ON); expect(JSON.stringify([ent, st])).toBe(snap);
  });
});
