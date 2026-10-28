/*
 * Dostęp do funkcji w modelu M5 S1 (docs/monetyzacja.md; docs/27 rozdz. 2, 3.4–3.6; decyzja właściciela 22.10.2026: cała aplikacja darmowa do
 * 5 dni treningowych w miesiącu, Pro — subskrypcja albo dostęp dożywotni — zdejmuje limit; wcześniej, 12.10.2026: przełącznik PAYWALL.ENABLED).
 *
 * Moduł jest CZYSTY: bez StoreKit, bez magazynu, bez Date.now() i bez strefy telefonu w środku — czas i przesunięcie strefy przychodzą
 * jako argumenty. Podłączony w 0.17.0: lib/entitlement.ts (stan, zapamiętany wynik, strażnik startu w lib/start.ts), adapter sklepu lib/store-adapter.ts, ekran zakupu app/paywall.tsx.
 * Przy PAYWALL.ENABLED = false każda funkcja zwraca pełny dostęp (zachowanie aplikacji bez zmian).
 */

/** Liczby i przełączniki produktu — JEDNO miejsce (CLAUDE.md). Ceny nie są tu nigdy: pochodzą z App Store (docs/27 rozdz. 1). */
export interface PaywallConfig {
  /** Główny przełącznik: false → zawsze pełny dostęp, bez limitu (model darmowy = zmiana tej wartości + wydanie). */
  ENABLED: boolean;
  /** Darmowe DNI TRENINGOWE w miesiącu kalendarzowym w stanie `free` (M5 S1, decyzja właściciela 22.10.2026; dzień = data startu ukończonego treningu na żywo). */
  FREE_TRAINING_DAYS_PER_MONTH: number;
  /** Decyzja właściciela 12.10.2026, P3 B (docs/27): czy treningi rozpoczęte w stanie `full` liczą się do limitu miesiąca, w którym dostęp wygasł.
   * false = wariant B, WYBRANY (liczone tylko starty od chwili wygaśnięcia); true = wariant A (limit „4 w miesiącu” bez wyjątków). */
  COUNT_FULL_STARTS_IN_EXPIRY_MONTH: boolean;
  /** Decyzja właściciela 12.10.2026, P6 A (docs/27 3.6): dni karencji offline: bez odpowiedzi sklepu (`unknown`) zapamiętany `full` z datą wygaśnięcia trwa jeszcze tyle
   * dni po tej dacie, potem `free`. 7 = wariant A, WYBRANY (liczba produktowa, nie merytoryczna); 0 = wariant B (od razu `free`). */
  OFFLINE_GRACE_DAYS: number;
}
export const PAYWALL: PaywallConfig = {
  ENABLED: true,
  FREE_TRAINING_DAYS_PER_MONTH: 5,
  COUNT_FULL_STARTS_IN_EXPIRY_MONTH: false,
  OFFLINE_GRACE_DAYS: 7,
};

/** Trening na żywo zużywa dzień limitu, dopiero gdy trwał DŁUŻEJ niż tyle minut (czas bez pauz, jak `workoutDurSec` w historii) — decyzja właściciela 22.10.2026: „Limit używają tylko sesje w treningu na żywo które trwały ponad 20 minut”; zmiana 23.10.2026 (test na telefonie, build 1030): próg 7 minut. Jedno miejsce. */
export const MIN_LIVE_MINUTES_FOR_DAY = 7;

const MIN_MS = 60e3;
const DAY_MS = 86400e3;

/** Stany dostępu (docs/27 rozdz. 2). */
export const ACCESS_STATES = ['full', 'free', 'unknown', 'testflight'] as const;
export type AccessState = (typeof ACCESS_STATES)[number];
/** Poziom faktycznie stosowany do limitu (unknown i testflight sprowadzone do jednego z dwóch). */
export type AccessLevel = 'full' | 'free';

export const ENTITLEMENT_PLANS = ['monthly', 'yearly', 'lifetime'] as const;
export type EntitlementPlan = (typeof ENTITLEMENT_PLANS)[number];
/** Skąd uprawnienie: zakup, Chmura rodzinna (`ownershipType = familyShared`), kod ofertowy. */
export const ENTITLEMENT_SOURCES = ['purchase', 'family', 'code'] as const;
export type EntitlementSource = (typeof ENTITLEMENT_SOURCES)[number];

/** Jedno uprawnienie z magazynu (odpowiednik wpisu `Transaction.currentEntitlements`, bez zależności od StoreKit). Czasy w ms (epoch). */
export interface Entitlement {
  plan: EntitlementPlan;
  source: EntitlementSource;
  /** Koniec opłaconego okresu; null/brak = bez końca (dożywotni). Subskrypcja bez daty = uszkodzone dane → nieaktywna. */
  expiresAt?: number | null;
  /** Koniec okresu karencji płatności (Billing Grace Period): dostęp trwa do późniejszego z expiresAt i graceUntil. */
  graceUntil?: number | null;
  /** Zwrot / cofnięcie (też wyjście z rodziny): od tej chwili uprawnienie nie działa. */
  revokedAt?: number | null;
}

/** Ostatni znany wynik sklepu, zapamiętany na telefonie (docs/27 2 „unknown”, 3.6). */
export interface LastKnownAccess {
  level: AccessLevel;
  /** Koniec ostatnio znanego dostępu (ms); null = bez końca (dożywotni). Dla level 'free' pomijane. */
  expiresAt?: number | null;
  /** Tylko level 'free': chwila, w której aplikacja zobaczyła koniec pełnego dostępu (ms). Sklep natywny po wygaśnięciu, zwrocie albo cofnięciu nie zwraca
   * już transakcji, więc bez tego zapisu P3 B nie ma od czego liczyć (M1-audytor-generalny-002). Brak = nigdy nie widziano pełnego dostępu. */
  endedAt?: number;
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

/** P3 B z pamięcią aplikacji: koniec uprawnień z listy sklepu albo zapamiętany koniec pełnego dostępu (`lastKnown.endedAt`) — późniejszy z nich.
 * Aktywne uprawnienie → null (jak freeSince). M1-audytor-generalny-002: sklep natywny nie zwraca wygasłych transakcji. */
export function freeSinceWithMemory(ctx: AccessContext, entitlements: readonly Entitlement[] | null | undefined, now: number): number | null {
  if ((entitlements ?? []).some(e => entitlementActive(e, now))) return null;
  const fromList = freeSince(entitlements, now); const lk = ctx?.lastKnown; const mem = lk?.level === 'free' && finite(lk.endedAt) && lk.endedAt <= now ? lk.endedAt : null;
  return fromList == null ? mem : mem == null ? fromList : Math.max(fromList, mem);
}

/* ---------- licznik treningów na żywo ---------- */

/** Start dnia treningowego: ukończonego treningu na żywo > MIN_LIVE_MINUTES_FOR_DAY (7 min) (zapisane dni `State.liveDays`, nie historia; wołający wybiera tylko treningi ze znacznikiem „na żywo” — docs/27 4.3, bez wstecz; trwający i anulowany nie wchodzą). */
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

/** Klucz dnia RRRR-MM-DD dla chwili `ts` na zegarze o przesunięciu `offMin` (minuty na wschód od UTC). Czyste, niezależne od strefy procesu. */
export function dayKey(ts: number, offMin: number): string {
  const d = new Date(ts + (finite(offMin) ? offMin : 0) * MIN_MS);
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}-${String(d.getUTCDate()).padStart(2, '0')}`;
}

/** Dni treningowe bieżącego miesiąca (klucze dni): różne daty STARTU ukończonych treningów na żywo; data i miesiąc wg strefy startu (`tzOffsetMin` treningu).
 * `freeSince` (P3): przy COUNT_FULL_STARTS_IN_EXPIRY_MONTH = false starty sprzed tej chwili nie liczą się (rozpoczęte w `full`). */
function trainingDays(starts: readonly LiveStart[], now: number, nowOffMin: number, freeSinceTs: number | null, cfg: PaywallConfig): Set<string> {
  const cur = monthKey(now, nowOffMin); const days = new Set<string>();
  for (const s of starts) {
    if (!s || !finite(s.startedAt)) continue;
    const off = s.tzOffsetMin ?? nowOffMin;
    if (monthKey(s.startedAt, off) !== cur) continue;
    if (!cfg.COUNT_FULL_STARTS_IN_EXPIRY_MONTH && freeSinceTs != null && s.startedAt < freeSinceTs) continue;
    days.add(dayKey(s.startedAt, off));
  }
  return days;
}

/**
 * Ile dni treningowych zużyło limit w bieżącym miesiącu (docs/monetyzacja.md, M5 S1): liczba RÓŻNYCH dni (data startu wg strefy startu) z ukończonym
 * treningiem na żywo. Drugi trening tego samego dnia nie zużywa limitu. Trening rozpoczęty 31. o 23:50 liczy się do dnia i miesiąca startu.
 * `starts` — tylko ukończone treningi na żywo (wołający odfiltrowuje trening w toku, wstecz i anulowany). `freeSince` (P3): jak w `trainingDays`.
 */
export function freeUsed(starts: readonly LiveStart[], now: number, nowOffMin: number, freeSinceTs: number | null = null, cfg: PaywallConfig = PAYWALL): number {
  return trainingDays(starts, now, nowOffMin, freeSinceTs, cfg).size;
}

/** Czy ukończony trening na żywo o takim czasie trwania (s, bez pauz) zużywa dzień limitu. */
export const qualifiesForDay = (durationSec: number): boolean => finite(durationSec) && durationSec > MIN_LIVE_MINUTES_FOR_DAY * 60;

/** Najdłużej pamiętane dni treningowe (ms wstecz od najnowszego zapisu): wystarcza na bieżący miesiąc i cofnięcie zegara; starsze odpadają przy zapisie. */
const KEEP_DAYS_MS = 400 * DAY_MS;
/**
 * Zapis dnia treningowego (M5 S1, decyzja właściciela 22.10.2026: dni zapisane OSOBNO w danych użytkownika, usunięcie treningu nie zwraca dnia): dodaje start
 * kwalifikującego się treningu na żywo do listy dni — jeden wpis na dzień (data startu wg strefy startu), z NAJPÓŹNIEJSZYM startem tego dnia (P3 B porównuje start z chwilą wygaśnięcia).
 * Zwraca nową listę posortowaną rosnąco; stare wpisy (ponad KEEP_DAYS_MS przed najnowszym) odpadają.
 */
export function recordLiveDay(days: readonly LiveStart[], start: LiveStart): LiveStart[] {
  if (!start || !finite(start.startedAt)) return days.filter(d => d && finite(d.startedAt));
  const off = (s: LiveStart) => (finite(s.tzOffsetMin) ? (s.tzOffsetMin as number) : 0);
  const key = (s: LiveStart) => dayKey(s.startedAt, off(s)); const byDay = new Map<string, LiveStart>();
  for (const d of [...days, start]) { if (!d || !finite(d.startedAt)) continue; const k = key(d); const cur = byDay.get(k); if (!cur || d.startedAt > cur.startedAt) byDay.set(k, { startedAt: d.startedAt, ...(finite(d.tzOffsetMin) ? { tzOffsetMin: d.tzOffsetMin } : {}) }); }
  const all = [...byDay.values()].sort((a, b) => a.startedAt - b.startedAt); const newest = all[all.length - 1].startedAt;
  return all.filter(d => d.startedAt >= newest - KEEP_DAYS_MS);
}

export interface StartDecision {
  /** Czy wolno rozpocząć nowy trening na żywo. */
  allowed: boolean;
  state: AccessState;
  level: AccessLevel;
  /** Pozostałe darmowe dni treningowe w miesiącu (Infinity przy pełnym dostępie). */
  remaining: number;
  /** Zużyte dni treningowe w tym miesiącu (0 przy pełnym dostępie). */
  used: number;
  limit: number;
  /** Kiedy limit się odnowi (ms) — tylko gdy zablokowano. */
  resetsAt: number | null;
  /** Odmowa przy niepewnym stanie bez zapamiętanego wyniku nie pokazuje komunikatu o blokadzie, dopóki nie przekroczono limitu (docs/27 2). */
  silent: boolean;
}

/**
 * Strażnik startu treningu na żywo (docs/27 2, 3.4; M5 S1): jedyny blokowany przypadek to start PONAD limit dni w stanie `free` — gdy w miesiącu jest
 * już `FREE_TRAINING_DAYS_PER_MONTH` dni treningowych, a dziś jeszcze nie jest dniem treningowym (kolejny trening tego samego dnia zawsze wolno).
 * Trening w toku nigdy nie jest przerywany (strażnik działa tylko przy starcie), trening wstecz i „Kontynuuj” porzuconego nie przechodzą przez tę funkcję.
 * `starts` — ukończone treningi na żywo; `nowOffMin` — bieżące przesunięcie strefy telefonu (tzOffsetAt).
 */
export function canStartLive(
  ctx: AccessContext, entitlements: readonly Entitlement[] | null | undefined, starts: readonly LiveStart[], now: number, nowOffMin: number,
  cfg: PaywallConfig = PAYWALL,
): StartDecision {
  const eff = effectiveAccess(ctx, entitlements, now, cfg); const limit = cfg.FREE_TRAINING_DAYS_PER_MONTH;
  if (eff.level === 'full') return { allowed: true, state: eff.state, level: 'full', remaining: Infinity, used: 0, limit, resetsAt: null, silent: false };
  const days = trainingDays(starts, now, nowOffMin, freeSinceWithMemory(ctx, entitlements, now), cfg); const used = days.size;
  const allowed = used < limit || days.has(dayKey(now, nowOffMin));
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
