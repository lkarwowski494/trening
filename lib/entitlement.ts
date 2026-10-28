/*
 * Uprawnienia w działaniu (docs/27 rozdz. 2–3, wydanie 0.17.0): stan sklepu w pamięci, zapamiętany ostatni wynik (offline, P6 A), nasłuch transakcji
 * od startu, strażnik startu treningu na żywo. Logika decyzji jest czysta i leży w lib/access.ts; tu tylko klej: adapter sklepu ↔ access.ts ↔ stan aplikacji.
 *
 * Wszystko za PAYWALL.ENABLED: przy false (`paywallConfig().ENABLED`) nic się nie uruchamia — ani sklep, ani zapis, ani strażnik (`guardLiveStart` zwraca
 * true bez skutków ubocznych), czyli aplikacja zachowuje się jak przed 0.17. Build E2E (EXPO_PUBLIC_STORE_FAKE=1) włącza przełącznik i limit 1 trening.
 */
import { useSyncExternalStore } from 'react';
import { router } from 'expo-router';
import { PAYWALL, ENTITLEMENT_PLANS, canStartLive, effectiveAccess, entitlementEnd, entitlementActive, type AccessContext, type EffectiveAccess, type Entitlement,
  type EntitlementPlan, type GuardedStart, type LastKnownAccess, type PaywallConfig, type StartDecision, type LiveStart } from '@/lib/access';
import { E2E_FREE_TRAINING_DAYS, isFakeStoreBuild } from '@/lib/products';
import { getStoreAdapter, type PurchaseOutcome } from '@/lib/store-adapter';
import { getState, tzOffsetAt, useTick } from '@/lib/store';
import { db } from '@/lib/state/core';

/** Klucz kv z ostatnim znanym wynikiem sklepu: poza stanem aplikacji i poza kopią (zakup należy do konta Apple, nie do danych treningowych). */
export const ACCESS_KEY = 'access';

/** Konfiguracja stosowana w aplikacji: PAYWALL z lib/access.ts; w buildzie E2E przełącznik włączony i limit 0 dni (jednego dnia nie da się przekroczyć limitu ≥ 1 — scenariusz Maestro krótki). */
export function paywallConfig(): PaywallConfig { return isFakeStoreBuild() ? { ...PAYWALL, ENABLED: true, FREE_TRAINING_DAYS_PER_MONTH: E2E_FREE_TRAINING_DAYS } : PAYWALL; }
export const paywallOn = (): boolean => paywallConfig().ENABLED;

/* ---------- stan ---------- */
let ent: Entitlement[] | null = null; let lastKnown: LastKnownAccess | null = null;
let started = false; let unsub: (() => void) | null = null; let inflight: Promise<void> | null = null; let tick = 0;
const listeners = new Set<() => void>();
const emit = () => { tick++; listeners.forEach(l => l()); };
const subscribe = (l: () => void) => { listeners.add(l); return () => { listeners.delete(l); }; };

const fin = (n: unknown): n is number => typeof n === 'number' && Number.isFinite(n);
/** Odczyt zapamiętanego wyniku: zły kształt, nieznany poziom albo nieskończona data → null (traktowane jak brak). */
export function parseLastKnown(raw: unknown): LastKnownAccess | null {
  let o: any = raw; if (typeof raw === 'string') { try { o = JSON.parse(raw); } catch { return null; } }
  if (!o || typeof o !== 'object' || (o.level !== 'full' && o.level !== 'free')) return null;
  if (o.level === 'free') return fin(o.endedAt) ? { level: 'free', endedAt: o.endedAt } : { level: 'free' };
  if (o.expiresAt === null) return { level: 'full', expiresAt: null };
  return fin(o.expiresAt) ? { level: 'full', expiresAt: o.expiresAt } : null;
}
/** Ostatni znany poziom z listy uprawnień w chwili `now`: aktywne uprawnienie → full (z najpóźniejszym końcem; null gdy dożywotni), brak → free. */
export function lastKnownFrom(list: readonly Entitlement[], now: number): LastKnownAccess {
  let best: number | null | undefined; /* undefined = nic aktywnego */
  for (const e of list) { if (!entitlementActive(e, now)) continue; const end = entitlementEnd(e); const v = end === Infinity ? null : end; if (v === null) { best = null; break; } if (best === undefined || (best !== null && v! > best)) best = v; }
  return best === undefined ? { level: 'free' } : { level: 'full', expiresAt: best };
}
/** M1-audytor-generalny-002 (P3 B): przejście z pełnego dostępu na `free` zapisuje chwilę końca (koniec okresu albo „teraz” przy zwrocie/cofnięciu przed końcem);
 * kolejne odczyty `free` zachowują zapisany koniec. Ponowny pełny dostęp go czyści (następne wygaśnięcie zapisze nowy). */
export function withEndedAt(next: LastKnownAccess, prev: LastKnownAccess | null, now: number): LastKnownAccess {
  if (next.level !== 'free') return next;
  if (prev?.level === 'full') return { level: 'free', endedAt: prev.expiresAt != null && fin(prev.expiresAt) ? Math.min(prev.expiresAt, now) : now };
  return prev?.level === 'free' && fin(prev.endedAt) ? { level: 'free', endedAt: prev.endedAt } : next;
}
async function persist(v: LastKnownAccess, now: number) {
  try { await db?.runAsync('INSERT OR REPLACE INTO kv (k, v) VALUES (?, ?)', ACCESS_KEY, JSON.stringify({ ...v, at: now })); } catch { /* brak zapisu nie psuje stanu w pamięci */ }
}
async function load() {
  try { const r = await db?.getFirstAsync<{ v: string }>('SELECT v FROM kv WHERE k = ?', ACCESS_KEY); lastKnown = r ? parseLastKnown(r.v) : null; } catch { lastKnown = null; }
}

/** Zastosowanie odpowiedzi sklepu: tablica (także pusta) = sklep odpowiedział; null = brak odpowiedzi (`unknown`, ostatni zapamiętany wynik). */
async function apply(list: Entitlement[] | null, now: number) {
  ent = list;
  if (list) { lastKnown = withEndedAt(lastKnownFrom(list, now), lastKnown, now); await persist(lastKnown, now); }
  emit();
}
/** Odświeżenie uprawnień ze sklepu (start, powrót z tła, zdarzenie transakcji). Błąd odczytu → `unknown`, nigdy `free` (docs/30 3.3 pułapka 2). Współbieżne wywołania łączą się w jedno. */
export function refreshEntitlements(): Promise<void> {
  if (!paywallOn()) return Promise.resolve();
  if (inflight) return inflight;
  inflight = (async () => { let list: Entitlement[] | null = null; try { list = (await getStoreAdapter().currentEntitlements()).filter(e => ENTITLEMENT_PLANS.includes(e.plan)); } catch { list = null; } await apply(list, Date.now()); })()
    .finally(() => { inflight = null; });
  return inflight;
}
/** Start modułu (po `init()` magazynu): zapamiętany wynik, nasłuch transakcji, pierwsze odświeżenie. Przy wyłączonym przełączniku nic nie robi. */
export async function initEntitlements(): Promise<void> {
  if (!paywallOn() || started) return; started = true;
  await load(); emit();
  unsub = getStoreAdapter().onTransaction(() => { void refreshEntitlements(); });
  await refreshEntitlements();
}
/** Tylko panel „Test store” (build E2E, scenariusz Maestro 56) i testy: stan nowej instalacji bez zakupów — zapomina zapamiętany poziom dostępu
 * (pamięć i kv), żeby następna pusta lista sklepu nie zapisała końca pełnego dostępu (M1-046: były subskrybent nie dostaje okna „Pierwszy trening”). */
export async function forgetAccessMemory(): Promise<void> {
  lastKnown = null; try { await db?.runAsync('DELETE FROM kv WHERE k = ?', ACCESS_KEY); } catch { /* brak zapisu nie psuje stanu w pamięci */ }
}
/** Tylko testy i wyłączenie przełącznika w trakcie działania: zatrzymuje nasłuch i czyści stan w pamięci. */
export function resetEntitlementsForTests() { unsub?.(); unsub = null; started = false; ent = null; lastKnown = null; inflight = null; emit(); }

/* ---------- widok stanu ---------- */
export interface AccessView extends EffectiveAccess {
  enabled: boolean;
  /** Aktywne uprawnienie wybrane do pokazania (najsilniejsze: dożywotni > roczne > miesięczne); null = brak. */
  active: Entitlement | null;
  entitlements: readonly Entitlement[] | null;
  lastKnown: LastKnownAccess | null;
  decision: StartDecision;
}
const RANK: Record<EntitlementPlan, number> = { lifetime: 3, yearly: 2, monthly: 1 };
/** Dni treningowe do licznika (M5 S1, decyzja właściciela 22.10.2026): ZAPISANE osobno w stanie (`State.liveDays`), nie liczone z historii — usunięcie treningu nie zwraca dnia.
 * Wpis powstaje przy ukończeniu („Zakończ” albo zapis po 6 h) treningu na żywo dłuższego niż MIN_LIVE_MINUTES_FOR_DAY; trwający, anulowany, krótki, wstecz i import nie zapisują. */
export function liveStarts(): LiveStart[] { return getState().liveDays ?? []; }
export function accessNow(now: number = Date.now()): AccessView {
  const cfg = paywallConfig(); const ctx: AccessContext = { lastKnown }; const eff = effectiveAccess(ctx, ent, now, cfg);
  const decision = canStartLive(ctx, ent, liveStarts(), now, tzOffsetAt(now), cfg);
  const active = (ent ?? []).filter(e => entitlementActive(e, now)).sort((a, b) => RANK[b.plan] - RANK[a.plan])[0] ?? null;
  return { ...eff, enabled: cfg.ENABLED, active, entitlements: ent, lastKnown, decision };
}
/** Hook widoku: przelicza się przy zmianie uprawnień i przy zmianie stanu aplikacji (treningi). Czas bieżący pobierany przy renderze. */
export function useAccess(): AccessView {
  useSyncExternalStore(subscribe, () => tick, () => tick); useTick();
  return accessNow();
}

/* ---------- strażnik startu ---------- */
/**
 * Strażnik startu treningu na żywo — JEDNO miejsce dla wszystkich dróg startu (GUARDED_STARTS). Zwraca true, gdy wolno rozpocząć; w przeciwnym razie
 * otwiera ekran zakupu i zwraca false. Przy PAYWALL.ENABLED = false oraz przy trwającym treningu (start i tak nic nie zrobi) — true, bez skutków.
 * Trening w toku nigdy nie jest przerywany, „Kontynuuj” porzuconego nie jest startem (docs/27 3.4).
 */
export function guardLiveStart(_path: GuardedStart, now: number = Date.now(), open: (href: string) => void = href => router.push(href as never)): boolean {
  if (!paywallOn()) return true;
  if (getState().active) return true;
  const v = accessNow(now); if (v.decision.allowed) return true;
  open('/paywall?reason=limit'); return false;
}
/** Dzień (południe, czas telefonu) pierwszego dnia następnego miesiąca — do tekstu „Kolejne od …”. Liczony z dat kalendarza, nie z `resetsAt`: ten przy zmianie czasu (DST) w miesiącu bywa o godzinę przed północą (lib/access.ts nextMonthStart liczy ze stałego przesunięcia). */
export const nextMonthDay = (now: number = Date.now()): number => { const d = new Date(now); return new Date(d.getFullYear(), d.getMonth() + 1, 1, 12).getTime(); };
/** Czy limit dni jest wyczerpany, więc start w NOWYM dniu byłby zablokowany (prośba o ocenę nie wchodzi w blokadę — docs/26 zasada 3; dziś już zaliczony dzień nie odblokowuje oceny). */
export const nextStartBlocked = (now: number = Date.now()): boolean => { if (!paywallOn()) return false; const v = accessNow(now); return v.level === 'free' && v.decision.used >= v.decision.limit; };

/* ---------- akcje użytkownika (ekran zakupu, Ustawienia) ---------- */
/** Zakup planu; po sukcesie uprawnienia odświeżają się od razu (nasłuch dopełni resztę). Żadna z tych funkcji nie dotyka treningów. */
export async function purchasePlan(plan: EntitlementPlan): Promise<PurchaseOutcome> {
  const r = await getStoreAdapter().purchase(plan); if (r.status === 'success') await refreshEntitlements(); return r;
}
/** „Przywróć zakupy”: 'restored' (jest aktywne uprawnienie), 'none' (konto Apple bez zakupów), 'error' (brak sieci/błąd — stan bez zmian). */
export async function restorePurchases(): Promise<'restored' | 'none' | 'error'> {
  try { const list = await getStoreAdapter().restore(); await apply(list, Date.now()); return list.some(e => entitlementActive(e, Date.now())) ? 'restored' : 'none'; } catch { return 'error'; }
}
