/*
 * Adapter sklepu (docs/27 7.2, docs/30 pkt 5): jedyny interfejs, przez który aplikacja rozmawia ze StoreKit. Dwie implementacje:
 *   - natywna (lib/store-native.ts, biblioteka expo-iap, StoreKit 2) — w buildach TestFlight i App Store zawsze ta;
 *   - sztuczna (lib/store-fake.ts) — Jest i build E2E na symulatorze (zmienna EXPO_PUBLIC_STORE_FAKE=1 tylko w e2e-ios.yml).
 * Interfejs nie zna StoreKit: uprawnienia wracają jako `Entitlement` z lib/access.ts. Błąd odczytu uprawnień to ZAWSZE wyjątek (wołający traktuje go
 * jako stan `unknown`, nigdy `free` — docs/30 3.3, pułapka 2).
 */
import type { Entitlement, EntitlementPlan } from '@/lib/access';
import { isFakeStoreBuild } from '@/lib/products';
import { createFakeStore } from '@/lib/store-fake';
import { createNativeStore } from '@/lib/store-native';

/** Produkt z App Store: cena zawsze gotowa do wyświetlenia (`displayPrice` Apple, lokalna waluta). */
export interface StoreProduct {
  plan: EntitlementPlan;
  productId: string;
  /** Cena sformatowana przez Apple, np. „3,99 zł”. */
  displayPrice: string;
  /** Okres rozliczenia subskrypcji; null = zakup jednorazowy. */
  period: 'month' | 'year' | null;
  /** Kwalifikuje się do darmowego miesiąca (oferta wprowadzająca, `isEligibleForIntroOffer`); false także gdy produkt nie ma oferty. */
  trial: boolean;
}

export type PurchaseOutcome =
  | { status: 'success' }
  | { status: 'cancelled' }
  /** Czeka na zgodę (Ask to Buy / zakup odroczony). */
  | { status: 'pending' }
  | { status: 'error'; message?: string };

export interface StoreAdapter {
  readonly kind: 'native' | 'fake';
  /** Produkty z App Store (pusta lista = sklep odpowiedział, ale nie zna naszych produktów). Wyjątek = brak odpowiedzi (offline, błąd). */
  getProducts(): Promise<StoreProduct[]>;
  /** Zakup planu w systemowym oknie Apple. Anulowanie przez użytkownika to wynik `cancelled`, nie błąd. */
  purchase(plan: EntitlementPlan): Promise<PurchaseOutcome>;
  /** „Przywróć zakupy” (AppStore.sync + odczyt uprawnień). Wyjątek = błąd lub brak sieci. */
  restore(): Promise<Entitlement[]>;
  /** Aktualne uprawnienia (Transaction.currentEntitlements). Wyjątek = brak odpowiedzi. */
  currentEntitlements(): Promise<Entitlement[]>;
  /** Nasłuch transakcji od startu aplikacji (zakup, odnowienie, kod, zwrot, Chmura rodzinna). Zwraca funkcję kończącą nasłuch. */
  onTransaction(listener: () => void): () => void;
  /** Systemowe okno realizacji kodu ofertowego. */
  redeemCode(): Promise<void>;
  /** Systemowy arkusz zarządzania subskrypcją. */
  manageSubscriptions(): Promise<void>;
}

/** Build E2E startuje z dostępem „na zawsze” (kod), żeby scenariusze 01–20 działały bez limitu; scenariusz 21 wygasza go panelem „Test store”. */
export const E2E_START_ENTITLEMENTS: Entitlement[] = [{ plan: 'lifetime', source: 'code', expiresAt: null }];
let override: StoreAdapter | null = null; let cached: StoreAdapter | null = null;
/** Testy i build E2E: podmiana adaptera (null = domyślny wybór). */
export function setStoreAdapter(a: StoreAdapter | null) { override = a; }
/** Adapter bieżącego buildu: sztuczny tylko przy EXPO_PUBLIC_STORE_FAKE=1 (build E2E), w pozostałych przypadkach natywny (StoreKit). */
export function getStoreAdapter(): StoreAdapter {
  if (override) return override;
  if (!cached) cached = isFakeStoreBuild() ? createFakeStore(E2E_START_ENTITLEMENTS) : createNativeStore();
  return cached;
}
/** Tylko testy: zapomnienie wybranego adaptera (zmiana zmiennej środowiskowej między testami). */
export function resetStoreAdapterForTests() { override = null; cached = null; }
