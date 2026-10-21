/*
 * Sztuczny sklep (docs/27 7.2): ten sam interfejs co natywny adapter, stan w pamięci. Używany w Jest i w buildzie E2E na symulatorze
 * (EXPO_PUBLIC_STORE_FAKE=1 — tylko e2e-ios.yml; tests/store-adapter.test.ts pilnuje, że nie trafia do TestFlight ani App Store).
 * Zegar: Date.now() (testy ustawiają fałszywy zegar Jesta). Ceny to wartości testowe, nie ceny sklepu.
 */
import type { Entitlement, EntitlementPlan } from '@/lib/access';
import { PRODUCT_IDS, SUBSCRIPTION_PLANS, TRIAL_DAYS } from '@/lib/products';
import type { PurchaseOutcome, StoreAdapter, StoreProduct } from '@/lib/store-adapter';

const DAY_MS = 86400e3;
/** Ceny testowe (jak w docs/27 rozdz. 1 w USD, M1 z 13.10.2026) — jedno źródło dla sztucznego sklepu i testów; tests/prices-decision.test.ts pilnuje zgodności z .storekit i docs. */
export const FAKE_PRICES: Record<EntitlementPlan, string> = { monthly: '$0.99', yearly: '$6.99', lifetime: '$14.99' };
/** Ceny w Polsce w App Store Connect (14.10.2026, docs/18): miesięczna 4,99 (3,99 nie ma w siatce Apple), roczna i dożywotnia ustawione ręcznie. Tylko dokumentacja i testy — aplikacja pokazuje cenę z App Store. */
export const PLN_PRICES: Record<EntitlementPlan, string> = { monthly: '4,99 zł', yearly: '19,99 zł', lifetime: '59,99 zł' };

/** Sterowanie sztucznym sklepem z testów i z panelu „Test store” (build E2E). */
export interface FakeStoreControl {
  /** Brak sieci: pobranie cen, uprawnień i przywracanie rzucają wyjątek; nasłuch nie dostaje zdarzeń. */
  offline: boolean;
  /** Następny zakup kończy się tym wynikiem (potem wraca do `success`). */
  nextPurchase: PurchaseOutcome['status'] | null;
  /** Czy użytkownik jest jeszcze uprawniony do darmowego miesiąca (po pierwszej próbie: false). */
  trialEligible: boolean;
  /** Ustawia uprawnienia (null = jak przed pierwszą odpowiedzią sklepu — odczyt rzuca wyjątek) i wysyła zdarzenie transakcji. */
  setEntitlements(e: Entitlement[] | null): void;
  entitlements(): Entitlement[] | null;
  /** Uprawnienia, które pojawią się po „Przywróć zakupy” (konto Apple z wcześniejszym zakupem). */
  restorable: Entitlement[];
  /** Liczniki wywołań (testy: „akcja zakupu nie dotyka danych”, „nasłuch od startu”). */
  calls: { purchase: number; restore: number; getProducts: number; currentEntitlements: number; redeemCode: number; manageSubscriptions: number };
  listenerCount(): number;
}

export function createFakeStore(initial: Entitlement[] | null = []): StoreAdapter & FakeStoreControl {
  let ent: Entitlement[] | null = initial; const listeners = new Set<() => void>();
  const emit = () => { if (!ctl.offline) listeners.forEach(l => l()); };
  const offlineError = () => new Error('Brak połączenia (sztuczny sklep)');
  const ctl: StoreAdapter & FakeStoreControl = {
    kind: 'fake', offline: false, nextPurchase: null, trialEligible: true, restorable: [],
    calls: { purchase: 0, restore: 0, getProducts: 0, currentEntitlements: 0, redeemCode: 0, manageSubscriptions: 0 },
    entitlements: () => ent,
    setEntitlements(e) { ent = e; emit(); },
    listenerCount: () => listeners.size,
    async getProducts(): Promise<StoreProduct[]> {
      ctl.calls.getProducts++; if (ctl.offline) throw offlineError();
      return (Object.keys(PRODUCT_IDS) as EntitlementPlan[]).map(plan => ({ plan, productId: PRODUCT_IDS[plan], displayPrice: FAKE_PRICES[plan],
        period: plan === 'monthly' ? 'month' as const : plan === 'yearly' ? 'year' as const : null, trial: SUBSCRIPTION_PLANS.includes(plan) && ctl.trialEligible }));
    },
    async purchase(plan): Promise<PurchaseOutcome> {
      ctl.calls.purchase++; if (ctl.offline) return { status: 'error', message: 'offline' };
      const forced = ctl.nextPurchase; ctl.nextPurchase = null; if (forced && forced !== 'success') return forced === 'error' ? { status: 'error', message: 'fake' } : { status: forced };
      const now = Date.now(); const trial = SUBSCRIPTION_PLANS.includes(plan) && ctl.trialEligible; ctl.trialEligible = ctl.trialEligible && !SUBSCRIPTION_PLANS.includes(plan);
      const periodMs = plan === 'yearly' ? 365 * DAY_MS : 30 * DAY_MS;
      const e: Entitlement = plan === 'lifetime' ? { plan, source: 'purchase', expiresAt: null } : { plan, source: 'purchase', expiresAt: now + (trial ? TRIAL_DAYS * DAY_MS : periodMs), ...(trial ? { trial: true as const } : {}) };
      ent = [...(ent ?? []).filter(x => x.plan === 'lifetime' || plan === 'lifetime'), e]; emit(); return { status: 'success' };
    },
    async restore() { ctl.calls.restore++; if (ctl.offline) throw offlineError(); if (ctl.restorable.length) { ent = [...(ent ?? []), ...ctl.restorable]; ctl.restorable = []; emit(); } return ent ?? []; },
    async currentEntitlements() { ctl.calls.currentEntitlements++; if (ctl.offline || ent == null) throw offlineError(); return ent; },
    onTransaction(listener) { listeners.add(listener); return () => { listeners.delete(listener); }; },
    async redeemCode() { ctl.calls.redeemCode++; if (ctl.offline) throw offlineError(); },
    async manageSubscriptions() { ctl.calls.manageSubscriptions++; if (ctl.offline) throw offlineError(); },
  };
  return ctl;
}
