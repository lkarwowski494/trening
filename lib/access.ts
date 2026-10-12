/*
 * Dostęp do funkcji w modelu subskrypcji (docs/27 rozdz. 2, 3.4–3.6, 4.4 wydanie N; decyzja właściciela 12.10.2026: monetyzacja B — subskrypcja
 * na start, z możliwością przejścia na darmowe zmianą JEDNEJ wartości: PAYWALL.ENABLED).
 *
 * Moduł jest CZYSTY: bez StoreKit, bez magazynu, bez Date.now() i bez strefy telefonu w środku — czas i przesunięcie strefy przychodzą
 * jako argumenty. Podłączony w 0.17.0: lib/entitlement.ts (stan, zapamiętany wynik, strażnik startu w lib/start.ts), adapter sklepu lib/store-adapter.ts, ekran zakupu app/paywall.tsx.
 * Przy PAYWALL.ENABLED = false każda funkcja zwraca pełny dostęp (zachowanie aplikacji bez zmian).
 */

/** Liczby i przełączniki produktu — JEDNO miejsce (CLAUDE.md). Ceny nie są tu nigdy: pochodzą z App Store (docs/27 rozdz. 1). */
export interface PaywallConfig {
  /** Główny przełącznik: false → zawsze pełny dostęp, bez limitu (model darmowy = zmiana tej wartości + wydanie). */
  ENABLED: boolean;
  /** Darmowe treningi na żywo w miesiącu kalendarzowym w stanie `free` (docs/15, 09.10.2026 pkt 5). */
  FREE_LIVE_PER_MONTH: number;
  /** Decyzja właściciela 12.10.2026, P3 B (docs/27): czy treningi rozpoczęte w stanie `full` liczą się do limitu miesiąca, w którym dostęp wygasł.
   * false = wariant B, WYBRANY (liczone tylko starty od chwili wygaśnięcia); true = wariant A (limit „4 w miesiącu” bez wyjątków). */
  COUNT_FULL_STARTS_IN_EXPIRY_MONTH: boolean;
  /** Decyzja właściciela 12.10.2026, P6 A (docs/27 3.6): dni karencji offline: bez odpowiedzi sklepu (`unknown`) zapamiętany `full` z datą wygaśnięcia trwa jeszcze tyle
   * dni po tej dacie, potem `free`. 7 = wariant A, WYBRANY (liczba produktowa, nie merytoryczna); 0 = wariant B (od razu `free`). */
  OFFLINE_GRACE_DAYS: number;
}
export const PAYWALL: PaywallConfig = {
  ENABLED: false,
  FREE_LIVE_PER_MONTH: 4,
  COUNT_FULL_STARTS_IN_EXPIRY_MONTH: false,
  OFFLINE_GRACE_DAYS: 7,
};

const MIN_MS = 60e3;
const DAY_MS = 86400e3;

/** Stany dostępu (docs/27 rozdz. 2). */
export const ACCESS_STATES = ['full', 'free', 'unknown', 'testflight'] as const;
export type AccessState = (typeof ACCESS_STATES)[number];
/** Poziom faktycznie stosowany do limitu (unknown i testflight sprowadzone do jednego z dwóch). */
export type AccessLevel = 'full' | 'free';

export const ENTITLEMENT_PLANS = ['monthly', 'yearly', 'lifetime'] as const;
export type EntitlementPlan = (typeof ENTITLEMENT_PLANS)[number];
/** Skąd uprawnienie: zakup, Chmura rodzinna (`ownershipType = familyShared`), kod ofertowy. Okres próbny to oferta zakupu (source: purchase). */
export const ENTITLEMENT_SOURCES = ['purchase', 'family', 'code'] as const;
export type EntitlementSource = (typeof ENTITLEMENT_SOURCES)[number];

/** Jedno uprawnienie z magazynu (odpowiednik wpisu `Transaction.currentEntitlements`, bez zależności od StoreKit). Czasy w ms (epoch). */
export interface Entitlement {
  plan: EntitlementPlan;
  source: EntitlementSource;
  /** Koniec opłaconego okresu (próby); null/brak = bez końca (dożywotni). Subskrypcja bez daty = uszkodzone dane → nieaktywna. */
  expiresAt?: number | null;
  /** Koniec okresu karencji płatności (Billing Grace Period): dostęp trwa do późniejszego z expiresAt i graceUntil. */
  graceUntil?: number | null;
  /** Okres próbny (oferta wprowadzająca „za darmo”) — potrzebne tylko do przypomnienia przed jego końcem (lib/trialReminder.ts); nie wpływa na dostęp. */
  trial?: true;
  /** Zwrot / cofnięcie (też wyjście z rodziny): od tej chwili uprawnienie nie działa. */
  revokedAt?: number | null;
}

/** Ostatni znany wynik sklepu, zapamiętany na telefonie (docs/27 2 „unknown”, 3.6). */
export interface LastKnownAccess {
  level: AccessLevel;
  /** Koniec ostatnio znanego dostępu (ms); null = bez końca (dożywotni). Dla level 'free' pomijane. */
  expiresAt?: number | null;
}

/** Kontekst (pierwszy argument `access`): środowisko i pamięć aplikacji. */
export interface AccessContext {
  /** Build z TestFlight (piaskownica Apple) — docs/27 3.12. */
  testflight?: boolean;
  lastKnown?: LastKnownAccess | null;
}

const finite = (n: unknown): n is number => typeof n === 'number' && Number.isFinite(n);

/** Chwila, do której uprawnienie działa (ms), +Infinity = bez końca, null = uszkodzone dane (nieaktywne). Zwrot/cofnięcie skraca do `revokedAt`. */
export function entitlementEnd(e: Entitlement): number | null {
  if (!e || !ENTITLEMENT_PLANS.includes(e.plan)) return null;
  let end: number;
  if (e.expiresAt == null) { if (e.plan !== 'lifetime') return null; end = Infinity; }
  else if (!finite(e.expiresAt)) return null;
  else { end = e.expiresAt; if (finite(e.graceUntil) && e.graceUntil > end) end = e.graceUntil; }
  if (e.revokedAt != null) { if (!finite(e.revokedAt)) return null; end = Math.min(end, e.revokedAt); }
  return end;
}

/** Czy uprawnienie działa w chwili `now` (koniec jest wyłączny: w chwili końca już nie). */
export const entitlementActive = (e: Entitlement, now: number): boolean => { const end = entitlementEnd(e); return end != null && now < end; };

/** Wynik sklepu bez TestFlight i bez przełącznika: 'full' | 'free' | 'unknown' (entitlements === null: sklep jeszcze nie odpowiedział / brak danych). */
function storeState(entitlements: readonly Entitlement[] | null | undefined, now: number): 'full' | 'free' | 'unknown' {
  if (entitlements == null) return 'unknown'; /* null/undefined = brak odpowiedzi; pusta tablica = sklep odpowiedział „brak uprawnień” */
  return entitlements.some(e => entitlementActive(e, now)) ? 'full' : 'free';
}

/** Poziom dla stanu `unknown`: ostatni zapamiętany (z karencją offline dla `full` po dacie wygaśnięcia); bez zapamiętanego — `free` (cicho). */
function unknownLevel(ctx: AccessContext, now: number, cfg: PaywallConfig): { level: AccessLevel; silent: boolean } {
  const lk = ctx.lastKnown;
  if (!lk || (lk.level !== 'full' && lk.level !== 'free')) return { level: 'free', silent: true };
  if (lk.level === 'free') return { level: 'free', silent: false };
  if (lk.expiresAt == null) return { level: 'full', silent: false }; /* dożywotni */
  if (!finite(lk.expiresAt)) return { level: 'free', silent: true };
  const grace = Math.max(0, cfg.OFFLINE_GRACE_DAYS) * DAY_MS;
  return { level: now < lk.expiresAt + grace ? 'full' : 'free', silent: false };
}

/**
 * Stan dostępu (docs/27 rozdz. 2). Kolejność: przełącznik wyłączony → 'full'; build z TestFlight → 'testflight' (poziom: `effectiveAccess`);
 * sklep bez odpowiedzi → 'unknown'; inaczej 'full' (jest aktywne uprawnienie) albo 'free'.
 * `entitlements`: tablica (także pusta) = sklep odpowiedział; null/undefined = nie odpowiedział.
 */
export function access(ctx: AccessContext, entitlements: readonly Entitlement[] | null | undefined, now: number, cfg: PaywallConfig = PAYWALL): AccessState {
  if (!cfg.ENABLED) return 'full';
  if (ctx?.testflight) return 'testflight';
  return storeState(entitlements, now);
}

export interface EffectiveAccess {
  state: AccessState;
  /** Poziom stosowany do limitu: 'full' bez limitu, 'free' z limitem. */
  level: AccessLevel;
  /** true = stan niepewny bez zapamiętanego wyniku: jak `free`, ale bez komunikatu o blokadzie, dopóki start nie przekroczy limitu (docs/27 2). */
  silent: boolean;
}

/** Stan dostępu sprowadzony do poziomu (full/free): 'testflight' → wynik sklepu (zakupy w piaskownicy bez opłat); 'unknown' → ostatni zapamiętany. */
export function effectiveAccess(ctx: AccessContext, entitlements: readonly Entitlement[] | null | undefined, now: number, cfg: PaywallConfig = PAYWALL): EffectiveAccess {
  const state = access(ctx, entitlements, now, cfg);
  const base = state === 'testflight' ? storeState(entitlements, now) : state;
  if (base === 'full' || base === 'free') return { state, level: base, silent: false };
  const u = unknownLevel(ctx ?? {}, now, cfg); return { state, level: u.level, silent: u.silent };
}

/** Początek „darmowego” okresu: najpóźniejszy koniec uprawnień (ms) albo null, gdy żadnego nie było. Dla P3 = wariant B. Dożywotnie/aktywne → null. */
export function freeSince(entitlements: readonly Entitlement[] | null | undefined, now: number): number | null {
  let since: number | null = null;
  for (const e of entitlements ?? []) {
    const end = entitlementEnd(e); if (end == null || end === Infinity) continue;
    if (end > now) return null; /* aktywne — nie ma okresu darmowego */
    if (since == null || end > since) since = end;
  }
  return since;
}

/* ---------- licznik treningów na żywo ---------- */

/** Start treningu na żywo (z historii/aktywnego; wołający wybiera tylko treningi ze znacznikiem „na żywo” — docs/27 4.3, bez treningów wstecz). */
export interface LiveStart { startedAt: number; /** przesunięcie strefy przy starcie, min na wschód od UTC (Workout.tzOffsetMin); brak = bieżące */ tzOffsetMin?: number }

/** Klucz miesiąca RRRR-MM dla chwili `ts` na zegarze o przesunięciu `offMin` (minuty na wschód od UTC). Czyste, niezależne od strefy procesu. */
export function monthKey(ts: number, offMin: number): string {
  const d = new Date(ts + (finite(offMin) ? offMin : 0) * MIN_MS);
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}`;
}

/** Chwila (ms) północy 1. dnia następnego miesiąca na zegarze o przesunięciu `offMin` — kiedy licznik wraca do pełnego limitu. */
export function nextMonthStart(ts: number, offMin: number): number {
  const off = finite(offMin) ? offMin : 0; const d = new Date(ts + off * MIN_MS);
  return Date.UTC(d.getUTCFullYear(), d.getUTCMonth() + 1, 1) - off * MIN_MS;
}

/**
 * Ile treningów na żywo zużyło limit w bieżącym miesiącu (docs/27 „Licznik 4 treningów”): start w miesiącu `now` (miesiąc startu wg strefy
 * startu — `tzOffsetMin` treningu; bieżący miesiąc wg `nowOffMin`). Trening rozpoczęty 31. o 23:30 liczy się do miesiąca startu.
 * `freeSince` (P3): przy COUNT_FULL_STARTS_IN_EXPIRY_MONTH = false starty sprzed tej chwili nie liczą się (rozpoczęte w `full`).
 */
export function freeUsed(starts: readonly LiveStart[], now: number, nowOffMin: number, freeSinceTs: number | null = null, cfg: PaywallConfig = PAYWALL): number {
  const cur = monthKey(now, nowOffMin); let n = 0;
  for (const s of starts) {
    if (!s || !finite(s.startedAt)) continue;
    if (monthKey(s.startedAt, s.tzOffsetMin ?? nowOffMin) !== cur) continue;
    if (!cfg.COUNT_FULL_STARTS_IN_EXPIRY_MONTH && freeSinceTs != null && s.startedAt < freeSinceTs) continue;
    n++;
  }
  return n;
}

export interface StartDecision {
  /** Czy wolno rozpocząć nowy trening na żywo. */
  allowed: boolean;
  state: AccessState;
  level: AccessLevel;
  /** Pozostałe darmowe treningi w miesiącu (Infinity przy pełnym dostępie). */
  remaining: number;
  /** Zużyte w tym miesiącu (0 przy pełnym dostępie). */
  used: number;
  limit: number;
  /** Kiedy limit się odnowi (ms) — tylko gdy zablokowano. */
  resetsAt: number | null;
  /** Odmowa przy niepewnym stanie bez zapamiętanego wyniku nie pokazuje komunikatu o blokadzie, dopóki nie przekroczono limitu (docs/27 2). */
  silent: boolean;
}

/**
 * Strażnik startu treningu na żywo (docs/27 2, 3.4): jedyny blokowany przypadek to start PONAD limit w stanie `free`. Trening w toku nigdy
 * nie jest przerywany (strażnik działa tylko przy starcie), trening wstecz i „Kontynuuj” porzuconego nie przechodzą przez tę funkcję.
 * `starts` — treningi na żywo (zakończone lub trwający); `nowOffMin` — bieżące przesunięcie strefy telefonu (tzOffsetAt).
 */
export function canStartLive(
  ctx: AccessContext, entitlements: readonly Entitlement[] | null | undefined, starts: readonly LiveStart[], now: number, nowOffMin: number,
  cfg: PaywallConfig = PAYWALL,
): StartDecision {
  const eff = effectiveAccess(ctx, entitlements, now, cfg); const limit = cfg.FREE_LIVE_PER_MONTH;
  if (eff.level === 'full') return { allowed: true, state: eff.state, level: 'full', remaining: Infinity, used: 0, limit, resetsAt: null, silent: false };
  const used = freeUsed(starts, now, nowOffMin, freeSince(entitlements, now), cfg);
  const allowed = used < limit;
  return { allowed, state: eff.state, level: 'free', remaining: Math.max(0, limit - used), used, limit, resetsAt: allowed ? null : nextMonthStart(now, nowOffMin), silent: eff.silent && allowed };
}

/* ---------- funkcje zawsze dostępne (dane) ---------- */

/** Zawsze dostępne niezależnie od stanu (docs/27 2, wymaganie twarde; ryzyko R3 — utrata dostępu do danych). */
export const ALWAYS_AVAILABLE = [
  'history', 'historyEdit', 'backdated', 'progress', 'templatesAndPlan', 'library', 'settings',
  'backup', 'restoreBackup', 'exportCsv', 'restorePurchases', 'redeemCode', 'manageSubscription',
] as const;
export type AlwaysAvailable = (typeof ALWAYS_AVAILABLE)[number];

/** Drogi startu nowego treningu na żywo, które obejmuje strażnik (docs/27 2) — jedno miejsce w kodzie (lib/start.ts, wydanie 0.17). */
export const GUARDED_STARTS = ['template', 'empty', 'repeatLast', 'calendar', 'deloadHint'] as const;
export type GuardedStart = (typeof GUARDED_STARTS)[number];

export const isAlwaysAvailable = (feature: string): feature is AlwaysAvailable => (ALWAYS_AVAILABLE as readonly string[]).includes(feature);
