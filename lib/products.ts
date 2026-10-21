/*
 * Produkty sklepu i stałe zakupów — JEDNO miejsce (CLAUDE.md: liczby i identyfikatory w jednym miejscu; docs/27 rozdz. 1 i 6, docs/30).
 * Ceny NIE są tu nigdy: wyświetlamy wyłącznie to, co zwraca App Store (`displayPrice`). Kod zna identyfikatory produktów i limity czasowe wywołań.
 * Przełącznik całości (PAYWALL.ENABLED) i liczby limitu: lib/access.ts. Moduł bez zależności od StoreKit i od magazynu — importowalny z każdego miejsca.
 */
import type { EntitlementPlan } from '@/lib/access';

/**
 * Identyfikatory produktów (docs/27 rozdz. 6 pkt 4–5; propozycja agenta z 11.10.2026).
 * [DO POTWIERDZENIA w App Store Connect] — po utworzeniu produktu identyfikatora nie da się zmienić. Te same trzy wartości stoją w pliku
 * `store/Trening.storekit` (test sprawdza zgodność).
 */
export const PRODUCT_IDS: Record<EntitlementPlan, string> = {
  monthly: 'pl.lukasz.trening.full.monthly',
  yearly: 'pl.lukasz.trening.full.yearly',
  lifetime: 'pl.lukasz.trening.full.lifetime',
};
/** Kolejność planów na ekranie zakupu (roczny najpierw — docs/27 5.2, szkic B). */
export const PLAN_ORDER: readonly EntitlementPlan[] = ['yearly', 'monthly', 'lifetime'];
/** Plany będące subskrypcją odnawianą automatycznie (grupa „Pełna wersja”); dożywotni to zakup jednorazowy. */
export const SUBSCRIPTION_PLANS: readonly EntitlementPlan[] = ['monthly', 'yearly'];
/** [DO POTWIERDZENIA w App Store Connect] Nazwa referencyjna grupy subskrypcji (docs/27 rozdz. 6 pkt 3); w aplikacji nieużywana, tylko w pliku `.storekit`. */
export const SUBSCRIPTION_GROUP_NAME = 'Pełna wersja';
/** Długość okresu próbnego w dniach — oferta wprowadzająca Apple (2 tygodnie, w ASC „2 weeks”), w obu planach subskrypcji. Model stały, decyzja właściciela 19.10.2026 (zastępuje „1 miesiąc” z 09.10.2026); audyt M1-011. */
export const TRIAL_DAYS = 14;

export const planOfProduct = (productId: string): EntitlementPlan | null => (Object.keys(PRODUCT_IDS) as EntitlementPlan[]).find(p => PRODUCT_IDS[p] === productId) ?? null;
export const isSubscriptionPlan = (p: EntitlementPlan): boolean => SUBSCRIPTION_PLANS.includes(p);

/** Polityka prywatności (decyzja właściciela 14.10.2026, D-2 A — docs/41: strona marki apps4brew.com, adres niezależny od repozytorium; treść źródłowa
 * w `site/privacy.html`). Apple wymaga linku na ekranie zakupu (docs/27 5.4). Ten sam adres w App Store Connect: store/app-store-urls.json. */
export const PRIVACY_URL = 'https://apps4brew.com/trening/privacy.html';
/** Strona wsparcia (D-2 A; App Store Connect → Support URL; treść źródłowa w `site/support.html`). */
export const SUPPORT_URL = 'https://apps4brew.com/trening/support.html';
/**
 * Warunki korzystania (Terms of Use) — decyzja właściciela 12.10.2026, P9 A: standardowa licencja Apple dla użytkownika (Licensed Application End User
 * License Agreement). Apple: „If you don’t provide a custom EULA, the standard EULA is applied to your app” (App Store Connect → Provide a custom license
 * agreement, developer.apple.com/help/app-store-connect/manage-app-information/provide-a-custom-license-agreement); treść pod adresem poniżej:
 * „Your license to each App is subject to your prior acceptance of either this Licensed Application End User License Agreement (“Standard EULA”), or a
 * custom end user license agreement” (przeczytane 12.10.2026). W App Store Connect nie dodajemy własnej umowy — wtedy obowiązuje standardowa.
 */
export const TERMS_URL = 'https://www.apple.com/legal/internet-services/itunes/dev/stdeula/';

/**
 * Decyzje właściciela 12.10.2026 (docs/27 „Decyzje właściciela (12.10.2026)”) wdrożone w kodzie jako stałe — wszystko nadal za PAYWALL.ENABLED.
 * P4 B (bez okna przed ostatnim darmowym treningiem), P7 A i P8 A (App Store Connect) nie mają stałych: nic do wdrożenia w aplikacji poza obsługą karencji.
 */
export const PAYWALL_MOMENTS = {
  /** P2 B: ekran zakupu raz po pierwszym ukończonym treningu na żywo (osoba bez pełnego dostępu), potem tylko Ustawienia i start ponad limit. */
  AFTER_FIRST_WORKOUT: true,
  /** P5 A: lokalne powiadomienie tyle dni przed końcem okresu próbnego (zgoda na powiadomienia jak przy przerwach). */
  TRIAL_END_REMINDER_DAYS: 2,
} as const;

/** Limity czasowe wywołań sklepu (ms) — jedno miejsce. */
export const STORE_TIMING = {
  /** Odpowiedź sklepu na pobranie cen / uprawnień dłużej niż tyle = jak brak odpowiedzi (offline, „unknown”). */
  CALL_TIMEOUT_MS: 15000,
  /** Opóźnienie prośby o ocenę po wejściu na ekran podsumowania (karta rekordów zdąża się pokazać). */
  REVIEW_DELAY_MS: 1500,
} as const;

/** Wyłącznie build E2E na symulatorze (e2e-ios.yml): sztuczny sklep + limit 1 trening. Nigdy TestFlight ani App Store (test pilnuje workflowów). */
export const E2E_FREE_LIVE_PER_MONTH = 1;
export const isFakeStoreBuild = (): boolean => process.env.EXPO_PUBLIC_STORE_FAKE === '1';
