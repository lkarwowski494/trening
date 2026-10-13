/*
 * Natywny adapter sklepu: biblioteka expo-iap 5.8.1 (StoreKit 2; wybór właściciela P10 A, docs/30). Moduł ładowany leniwie — w Expo Go i w testach
 * go nie ma, wtedy każde wywołanie kończy się wyjątkiem „sklep niedostępny” (aplikacja traktuje to jak brak odpowiedzi sklepu, stan `unknown`).
 *
 * Zasady (docs/30 rozdz. 3 i 7, przegląd kodu biblioteki przy wdrożeniu — „Ustalenia przy wdrożeniu”):
 *  - dostęp liczymy WYŁĄCZNIE z getAvailablePurchases({ onlyIncludeActiveItemsIOS: true }) (= Transaction.currentEntitlements); nigdy z
 *    hasActiveSubscriptions / getActiveSubscriptions (w nowszych wersjach karencja płatności = „nieaktywny”);
 *  - NIE używamy verifyPurchaseWithProvider, kitApi ani opcji iapkit* (jedyne wywołanie sieciowe biblioteki poza StoreKit — usługa IAPKit); pilnuje tego
 *    tests/store-adapter.test.ts (przeszukuje kod aplikacji i app.json);
 *  - zweryfikowane przez StoreKit transakcje przyjmujemy bez własnej weryfikacji JWS (docs/30 3.4); niezweryfikowana transakcja = wyjątek całej listy → `unknown`.
 */
import { Platform } from 'react-native';
import type { Entitlement, EntitlementPlan } from '@/lib/access';
import { PRODUCT_IDS, SUBSCRIPTION_PLANS, STORE_TIMING, planOfProduct } from '@/lib/products';
import type { PurchaseOutcome, StoreAdapter, StoreProduct } from '@/lib/store-adapter';

/** Podzbiór expo-iap używany przez aplikację (kontrakt sprawdza tests/store-native-contract.test.ts na makiecie zgodnej z build/*.d.ts paczki). */
export interface IapModule {
  initConnection(): Promise<boolean>;
  fetchProducts(req: { skus: string[]; type: 'subs' | 'in-app' | 'all' }): Promise<unknown[] | null | undefined>;
  requestPurchase(req: { request: { apple: { sku: string } }; type: 'subs' | 'in-app' }): Promise<unknown>;
  getAvailablePurchases(opts?: { onlyIncludeActiveItemsIOS?: boolean; alsoPublishToEventListenerIOS?: boolean }): Promise<unknown[]>;
  restorePurchases(): Promise<void>;
  finishTransaction(args: { purchase: unknown; isConsumable?: boolean }): Promise<void>;
  purchaseUpdatedListener(l: (p: unknown) => void): { remove(): void };
  purchaseErrorListener(l: (e: unknown) => void): { remove(): void };
  isEligibleForIntroOfferIOS(groupId: string): Promise<boolean>;
  subscriptionStatusIOS(sku: string): Promise<{ state: string; renewalInfo?: { gracePeriodExpirationDate?: number | null } | null }[]>;
  openRedeemOfferCode(): Promise<unknown>;
  deepLinkToSubscriptions(opts?: Record<string, unknown>): Promise<void>;
}
let mod: IapModule | null | undefined;
function iap(): IapModule {
  if (mod === undefined) { if (Platform.OS !== 'ios') mod = null; else { try { mod = require('expo-iap') as IapModule; } catch { mod = null; } } }
  if (!mod) throw new Error('Sklep niedostępny (brak modułu expo-iap)');
  return mod;
}
const withTimeout = <T,>(p: Promise<T>): Promise<T> => new Promise<T>((res, rej) => {
  const to = setTimeout(() => rej(new Error('Sklep nie odpowiedział w czasie')), STORE_TIMING.CALL_TIMEOUT_MS); p.then(v => { clearTimeout(to); res(v); }, e => { clearTimeout(to); rej(e); });
});
const num = (v: unknown): number | null => (typeof v === 'number' && Number.isFinite(v) ? v : null);
type Rec = Record<string, unknown>;

/** Zakup z expo-iap → uprawnienie aplikacji; nieznany produkt → null. Kod ofertowy (offerIOS.type = „code”) i Chmura rodzinna (ownership family_shared) rozpoznawane. */
export function entitlementFromPurchase(p: unknown): Entitlement | null {
  const x = (p ?? {}) as Rec; const plan = typeof x.productId === 'string' ? planOfProduct(x.productId) : null; if (!plan) return null;
  const offerType = String(((x.offerIOS ?? {}) as Rec).type ?? '').toLowerCase();
  const source = String(x.ownershipTypeIOS ?? '').toLowerCase() === 'family_shared' ? 'family' : offerType === 'code' ? 'code' : 'purchase';
  const offer = (x.offerIOS ?? {}) as Rec; const trial = offerType === 'introductory' && String(offer.paymentMode ?? '').toLowerCase() === 'free-trial';
  return { plan, source, expiresAt: plan === 'lifetime' ? null : num(x.expirationDateIOS), revokedAt: num(x.revocationDateIOS), ...(trial ? { trial: true as const } : {}) };
}
/** Wiersz z fetchProducts → produkt aplikacji (cena wyłącznie `displayPrice` Apple); obce identyfikatory pomijane. */
export function productFromStore(p: unknown, trialEligible: boolean): StoreProduct | null {
  const x = (p ?? {}) as Rec; const plan = typeof x.id === 'string' ? planOfProduct(x.id) : null; if (!plan || typeof x.displayPrice !== 'string' || !x.displayPrice) return null;
  const unit = String(x.subscriptionPeriodUnitIOS ?? ''); const sub = SUBSCRIPTION_PLANS.includes(plan);
  const period = !sub ? null : unit === 'year' ? 'year' as const : unit === 'month' ? 'month' as const : null;
  const hasTrial = sub && String(x.introductoryPricePaymentModeIOS ?? '') === 'free-trial';
  return { plan, productId: x.id as string, displayPrice: x.displayPrice, period, trial: hasTrial && trialEligible };
}
const DEFAULT_ERR = 'Nie udało się';
const code = (e: unknown): string => String(((e ?? {}) as Rec).code ?? '');

/**
 * Uprawnienia: aktywne z currentEntitlements + subskrypcje w karencji płatności (P7 A, Billing Grace Period). Biblioteka (pod openiap 3.6.0) przy
 * onlyIncludeActiveItemsIOS odrzuca transakcje z expirationDate w przeszłości, więc subskrybent w karencji nie pojawia się na liście — dla subskrypcji bez
 * aktywnego uprawnienia pytamy o status odnowienia i przyjmujemy gracePeriodExpirationDate jako koniec dostępu. Błąd odczytu statusu → wyjątek (`unknown`).
 */
async function readEntitlements(m: IapModule): Promise<Entitlement[]> {
  const rows = await withTimeout(m.getAvailablePurchases({ onlyIncludeActiveItemsIOS: true }));
  const out = rows.map(entitlementFromPurchase).filter((e): e is Entitlement => !!e); const now = Date.now();
  for (const plan of SUBSCRIPTION_PLANS) {
    if (out.some(e => e.plan === plan && e.expiresAt != null && e.expiresAt > now)) continue;
    for (const st of await withTimeout(m.subscriptionStatusIOS(PRODUCT_IDS[plan]))) {
      const g = num(st?.renewalInfo?.gracePeriodExpirationDate); if (g != null && g > now && st.state !== 'revoked') out.push({ plan, source: 'purchase', expiresAt: g });
    }
  }
  return out;
}

export function createNativeStore(): StoreAdapter {
  let connected: Promise<unknown> | null = null;
  const connect = () => { const m = iap(); return (connected ??= m.initConnection().catch(e => { connected = null; throw e; })); };
  return {
    kind: 'native',
    async getProducts() {
      const m = iap(); await withTimeout(connect());
      const rows = (await withTimeout(m.fetchProducts({ skus: Object.values(PRODUCT_IDS), type: 'all' }))) ?? [];
      /* Kwalifikacja do próby: jedna oferta wprowadzająca na grupę subskrypcji (docs/27 3.2) — pytamy raz o grupę pierwszej subskrypcji. */
      const group = (rows as Rec[]).map(r => r.subscriptionGroupIdIOS).find(g => typeof g === 'string' && g) as string | undefined;
      let eligible = false; if (group) { try { eligible = !!(await withTimeout(m.isEligibleForIntroOfferIOS(group))); } catch { eligible = false; } }
      return rows.map(r => productFromStore(r, eligible)).filter((r): r is StoreProduct => !!r);
    },
    async purchase(plan: EntitlementPlan): Promise<PurchaseOutcome> {
      const m = iap();
      try {
        await connect();
        const res = await m.requestPurchase({ request: { apple: { sku: PRODUCT_IDS[plan] } }, type: SUBSCRIPTION_PLANS.includes(plan) ? 'subs' : 'in-app' });
        for (const p of Array.isArray(res) ? res : res ? [res] : []) await m.finishTransaction({ purchase: p, isConsumable: false }).catch(() => {});
        return { status: 'success' };
      } catch (e) {
        const c = code(e);
        if (c === 'user-cancelled') return { status: 'cancelled' };
        if (c === 'pending' || c === 'deferred-payment') return { status: 'pending' };
        return { status: 'error', message: e instanceof Error ? e.message : DEFAULT_ERR };
      }
    },
    async currentEntitlements() {
      const m = iap(); await withTimeout(connect());
      return readEntitlements(m);
    },
    async restore() {
      const m = iap(); await withTimeout(connect()); await withTimeout(m.restorePurchases());
      return readEntitlements(m);
    },
    onTransaction(listener) {
      let subs: { remove(): void }[] = []; let off = false;
      /* Nasłuch od startu aplikacji (Apple: „Set up a transaction listener as soon as your app launches”): połączenie, potem zdarzenia zakupu. */
      void (async () => { try { const m = iap(); await connect();
        if (off) return;
        subs = [m.purchaseUpdatedListener(p => { m.finishTransaction({ purchase: p, isConsumable: false }).catch(() => {}).finally(() => listener()); }), m.purchaseErrorListener(() => listener())]; } catch { /* brak sklepu: bez nasłuchu */ } })();
      return () => { off = true; subs.forEach(s => s.remove()); subs = []; };
    },
    async redeemCode() { const m = iap(); await withTimeout(connect()); await m.openRedeemOfferCode(); },
    async manageSubscriptions() { const m = iap(); await m.deepLinkToSubscriptions(); },
  };
}
