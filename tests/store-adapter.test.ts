/*
 * 0.17.0, adapter sklepu (docs/27 7.2, docs/30): produkty i stałe (lib/products.ts), sztuczny sklep (lib/store-fake.ts), natywny adapter na makiecie expo-iap 5.8.1
 * (lib/store-native.ts; kontrakt zgodny z node_modules/expo-iap/build/*.d.ts), wybór adaptera, straże: sztuczny sklep tylko w buildzie E2E, brak usługi weryfikacji
 * (IAPKit) i jakiejkolwiek sieci poza StoreKit, ceny tylko z App Store, plik .storekit zgodny ze stałymi. Rodzaje (docs/20): logika, dane, macierz (plany ×
 * źródła), regresja straży. Ekrany: tests/subscription-ui.test.tsx; runtime uprawnień: tests/entitlement.test.ts.
 */
import * as fs from 'fs';
import * as path from 'path';
import { ENTITLEMENT_PLANS, PAYWALL, entitlementActive } from '@/lib/access';
import { PRODUCT_IDS, PLAN_ORDER, SUBSCRIPTION_PLANS, SUBSCRIPTION_GROUP_NAME, TRIAL_MONTHS, planOfProduct, isSubscriptionPlan, PRIVACY_URL, TERMS_URL, PAYWALL_MOMENTS,
  STORE_TIMING, E2E_FREE_LIVE_PER_MONTH, isFakeStoreBuild } from '@/lib/products';
import { getStoreAdapter, setStoreAdapter, resetStoreAdapterForTests, E2E_START_ENTITLEMENTS } from '@/lib/store-adapter';
import { createFakeStore, FAKE_PRICES } from '@/lib/store-fake';
import { createNativeStore, entitlementFromPurchase, productFromStore } from '@/lib/store-native';
import { paywallConfig } from '@/lib/entitlement';

const root = path.join(__dirname, '..'); const read = (f: string) => fs.readFileSync(path.join(root, f), 'utf8');
const walk = (d: string): string[] => fs.readdirSync(path.join(root, d), { withFileTypes: true }).flatMap(e => e.isDirectory() ? walk(path.join(d, e.name)) : /\.(ts|tsx)$/.test(e.name) ? [path.join(d, e.name)] : []);
const SRC = ['app', 'components', 'lib'].flatMap(walk).filter(f => !/lib[\\/]locales/.test(f));
const noComments = (s: string) => s.replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|[^:])\/\/.*$/gm, '$1');
const DAY = 86400e3;
const iap = () => global.__iap;
beforeEach(() => { Object.assign(global.__iap, { calls: [], products: [], purchases: [], status: [], eligible: true, fail: null, purchaseError: null, purchaseResult: undefined, listeners: { updated: [], error: [] } }); resetStoreAdapterForTests(); delete process.env.EXPO_PUBLIC_STORE_FAKE; });
afterEach(() => { jest.useRealTimers(); resetStoreAdapterForTests(); delete process.env.EXPO_PUBLIC_STORE_FAKE; });

describe('stałe w jednym miejscu (lib/products.ts)', () => {
  test('identyfikatory: po jednym na plan, unikalne, w jednej rodzinie; planOfProduct odwraca mapę; obcy produkt → null', () => {
    expect(Object.keys(PRODUCT_IDS).sort()).toEqual([...ENTITLEMENT_PLANS].sort());
    expect(new Set(Object.values(PRODUCT_IDS)).size).toBe(3);
    for (const p of ENTITLEMENT_PLANS) { expect(planOfProduct(PRODUCT_IDS[p])).toBe(p); expect(PRODUCT_IDS[p]).toMatch(/^pl\.lukasz\.trening\.full\.[a-z]+$/); }
    expect(planOfProduct('obcy.produkt')).toBeNull(); expect(planOfProduct('')).toBeNull();
  });
  test('kolejność planów to permutacja planów; subskrypcje = miesięczny i roczny; isSubscriptionPlan dla każdego planu', () => {
    expect([...PLAN_ORDER].sort()).toEqual([...ENTITLEMENT_PLANS].sort()); expect(PLAN_ORDER[0]).toBe('yearly');
    expect([...SUBSCRIPTION_PLANS].sort()).toEqual(['monthly', 'yearly']);
    for (const p of ENTITLEMENT_PLANS) expect(isSubscriptionPlan(p)).toBe(p !== 'lifetime');
    expect(TRIAL_MONTHS).toBe(1); expect(SUBSCRIPTION_GROUP_NAME).toBe('Pełna wersja');
  });
  test('decyzje właściciela 12.10.2026 jako stałe: P2 B (ekran po pierwszym treningu), P5 A (2 dni), liczby czasowe', () => {
    expect(PAYWALL_MOMENTS).toEqual({ AFTER_FIRST_WORKOUT: true, TRIAL_END_REMINDER_DAYS: 2 });
    expect(STORE_TIMING).toEqual({ CALL_TIMEOUT_MS: 15000, REVIEW_DELAY_MS: 1500 }); expect(E2E_FREE_LIVE_PER_MONTH).toBe(1);
  });
  test('P9 A: link do standardowej licencji Apple i do polityki prywatności; włączenie PAYWALL.ENABLED wymaga obu linków (Apple 3.1.2)', () => {
    expect(TERMS_URL).toBe('https://www.apple.com/legal/internet-services/itunes/dev/stdeula/'); expect(PRIVACY_URL).toMatch(/^https:\/\/.+\/privacy\.html$/);
    expect(read('site/privacy.html').length).toBeGreaterThan(500);
    if (PAYWALL.ENABLED) { expect(TERMS_URL).toBeTruthy(); expect(PRIVACY_URL).toBeTruthy(); }
  });
  test('plik store/Trening.storekit: te same trzy identyfikatory, próba 1 miesiąc w obu subskrypcjach, dożywotni bez okresu, Chmura rodzinna we wszystkich', () => {
    const f = JSON.parse(read('store/Trening.storekit')); const subs = f.subscriptionGroups.flatMap((g: any) => g.subscriptions); const prods = f.products;
    expect([...subs.map((s: any) => s.productID), ...prods.map((p: any) => p.productID)].sort()).toEqual(Object.values(PRODUCT_IDS).sort());
    expect(subs.find((s: any) => s.productID === PRODUCT_IDS.monthly).recurringSubscriptionPeriod).toBe('P1M'); expect(subs.find((s: any) => s.productID === PRODUCT_IDS.yearly).recurringSubscriptionPeriod).toBe('P1Y');
    for (const s of subs) { expect(s.introductoryOffer).toMatchObject({ paymentMode: 'free', subscriptionPeriod: 'P' + TRIAL_MONTHS + 'M', numberOfPeriods: 1 }); expect(s.familyShareable).toBe(true); expect(s.subscriptionGroupID).toBe(f.subscriptionGroups[0].id); }
    expect(prods[0]).toMatchObject({ productID: PRODUCT_IDS.lifetime, type: 'NonConsumable', familyShareable: true }); expect(f.subscriptionGroups[0].name).toBe(SUBSCRIPTION_GROUP_NAME);
  });
  test('ceny nie występują w kodzie ekranów: ani kwoty z walutą, ani „zł”/„$” w tekstach ekranu zakupu i karty (poza sztucznym sklepem)', () => {
    for (const f of ['app/paywall.tsx', 'components/SubscriptionCard.tsx']) expect({ f, m: noComments(read(f)).match(/\d+[.,]\d{2}\s?(zł|PLN|USD|EUR|GBP|\$|€|£)|[$€£]\s?\d/g) }).toEqual({ f, m: null });
  });
});

describe('wybór adaptera: prawdziwy w buildach dla telefonu, sztuczny tylko przy EXPO_PUBLIC_STORE_FAKE=1', () => {
  test('domyślnie natywny; zmienna „1” → sztuczny z dostępem „na zawsze” (E2E); inna wartość → natywny', () => {
    expect(isFakeStoreBuild()).toBe(false); expect(getStoreAdapter().kind).toBe('native');
    for (const v of ['0', 'true', '', 'yes']) { process.env.EXPO_PUBLIC_STORE_FAKE = v; resetStoreAdapterForTests(); expect(isFakeStoreBuild()).toBe(false); expect(getStoreAdapter().kind).toBe('native'); }
    process.env.EXPO_PUBLIC_STORE_FAKE = '1'; resetStoreAdapterForTests(); expect(isFakeStoreBuild()).toBe(true); expect(getStoreAdapter().kind).toBe('fake');
    expect(E2E_START_ENTITLEMENTS).toEqual([{ plan: 'lifetime', source: 'code', expiresAt: null }]);
  });
  test('adapter jest zapamiętany; setStoreAdapter podmienia, null wraca do domyślnego', () => {
    const a = getStoreAdapter(); expect(getStoreAdapter()).toBe(a); const f = createFakeStore(); setStoreAdapter(f); expect(getStoreAdapter()).toBe(f); setStoreAdapter(null); expect(getStoreAdapter()).toBe(a);
  });
  test('paywallConfig: zwykły build = PAYWALL; build E2E = przełącznik włączony i limit 1 (reszta bez zmian)', () => {
    expect(paywallConfig()).toBe(PAYWALL); process.env.EXPO_PUBLIC_STORE_FAKE = '1';
    expect(paywallConfig()).toEqual({ ...PAYWALL, ENABLED: true, FREE_LIVE_PER_MONTH: 1 });
  });
  test('STRAŻ: zmienna sztucznego sklepu jest ustawiana tylko w e2e-ios.yml; testflight.yml ma krok blokujący; reszta workflowów, app.json, eas.json i pliki .env jej nie zna', () => {
    const wf = fs.readdirSync(path.join(root, '.github/workflows')).filter(f => /\.ya?ml$/.test(f));
    for (const f of wf) { const t = read('.github/workflows/' + f); const sets = /EXPO_PUBLIC_STORE_FAKE\s*:\s*['"]?\d/.test(t); expect({ f, sets }).toEqual({ f, sets: f === 'e2e-ios.yml' }); }
    expect(read('.github/workflows/testflight.yml')).toMatch(/-n "\$\{EXPO_PUBLIC_STORE_FAKE:-\}"[\s\S]*exit 1/);
    expect(read('.github/workflows/e2e-ios.yml')).toMatch(/EXPO_PUBLIC_STORE_FAKE: '1'/);
    for (const f of ['app.json', 'eas.json', 'package.json']) expect({ f, has: read(f).includes('STORE_FAKE') }).toEqual({ f, has: false });
    expect(fs.readdirSync(root).filter(f => /^\.env/.test(f))).toEqual([]);
    expect(SRC.filter(f => noComments(read(f)).includes('EXPO_PUBLIC_STORE_FAKE')).sort()).toEqual([path.join('lib', 'products.ts')]);
  });
  test('STRAŻ: panel „Test store” i sztuczny sklep w ekranie zakupu tylko za isFakeStoreBuild()', () => {
    const s = noComments(read('app/paywall.tsx')); expect(s).toMatch(/isFakeStoreBuild\(\) \? /); expect(s.split('fake-store-panel').length).toBe(2);
    expect(s.indexOf('fake ? <View testID="fake-store-panel"')).toBeGreaterThan(s.indexOf('isFakeStoreBuild()'));
  });
});

describe('bez sieci poza StoreKit (R9 z docs/27, docs/30 3.1)', () => {
  test('kod aplikacji nie używa usługi weryfikacji (kitApi, verifyPurchaseWithProvider, iapkit*), fetch/XMLHttpRequest w warstwie sklepu ani getActiveSubscriptions/hasActiveSubscriptions', () => {
    const bad = /kitApi|verifyPurchaseWithProvider|verifyPurchase\b|iapkit|KitApiError|hasActiveSubscriptions|getActiveSubscriptions/i;
    expect(SRC.filter(f => bad.test(noComments(read(f))))).toEqual([]);
    for (const f of ['lib/store-native.ts', 'lib/store-adapter.ts', 'lib/store-fake.ts', 'lib/entitlement.ts', 'lib/products.ts', 'lib/trialReminder.ts', 'lib/review-run.ts']) expect(noComments(read(f))).not.toMatch(/\bfetch\(|XMLHttpRequest|WebSocket/);
  });
  test('app.json: wtyczka expo-iap bez opcji (żadnego klucza iapkit, alternatywnych sklepów ani Androida), brak extra.iapkitApiKey', () => {
    const app = JSON.parse(read('app.json')).expo; expect(app.plugins).toContain('expo-iap'); expect(JSON.stringify(app)).not.toMatch(/iapkit|onside|vega|alternativeBilling/i);
  });
  test('package.json: expo-iap przypięte dokładnie (bez ^ ani ~) do wersji sprawdzonej w docs/30; expo-store-review w zakresie SDK 57; lockfile zgodny', () => {
    const pkg = JSON.parse(read('package.json')); expect(pkg.dependencies['expo-iap']).toBe('5.8.1'); expect(pkg.dependencies['expo-store-review']).toMatch(/^~57\./);
    const lock = JSON.parse(read('package-lock.json')); expect(lock.packages['node_modules/expo-iap'].version).toBe('5.8.1'); expect(lock.packages['node_modules/expo-iap'].license).toBe('MIT');
    expect(fs.existsSync(path.join(root, 'node_modules/expo-iap/ios/ExpoIap.podspec'))).toBe(true);
  });
});

describe('sztuczny sklep', () => {
  test('produkty: trzy plany z cenami testowymi; okres: miesiąc/rok/brak; próba tylko w subskrypcjach i tylko dla uprawnionych', async () => {
    const f = createFakeStore(); const ps = await f.getProducts(); expect(ps.map(p => p.plan).sort()).toEqual([...ENTITLEMENT_PLANS].sort());
    for (const p of ps) { expect(p.displayPrice).toBe(FAKE_PRICES[p.plan]); expect(p.productId).toBe(PRODUCT_IDS[p.plan]); expect(p.period).toBe(p.plan === 'monthly' ? 'month' : p.plan === 'yearly' ? 'year' : null); expect(p.trial).toBe(p.plan !== 'lifetime'); }
    f.trialEligible = false; expect((await f.getProducts()).every(p => !p.trial)).toBe(true);
  });
  test('zakup każdego planu: uprawnienie aktywne; próba tylko raz (kolejny zakup już bez próby); dożywotni bez końca; nasłuch dostaje zdarzenie', async () => {
    jest.useFakeTimers({ now: new Date(2026, 9, 14, 12).getTime() }); const now = Date.now();
    for (const plan of ENTITLEMENT_PLANS) {
      const f = createFakeStore(); let n = 0; f.onTransaction(() => { n++; });
      expect(await f.purchase(plan)).toEqual({ status: 'success' }); const e = (await f.currentEntitlements())[0];
      expect(e.plan).toBe(plan); expect(entitlementActive(e, now)).toBe(true); expect(n).toBe(1);
      if (plan === 'lifetime') expect(e.expiresAt).toBeNull(); else { expect(e.expiresAt).toBe(now + 30 * DAY); expect(e.trial).toBe(true); }
    }
    const f = createFakeStore(); await f.purchase('monthly'); await f.purchase('yearly'); const e = (await f.currentEntitlements()); expect(e).toHaveLength(1); expect(e[0]).toMatchObject({ plan: 'yearly', expiresAt: now + 365 * DAY }); expect(e[0].trial).toBeUndefined();
  });
  test('wymuszone wyniki zakupu (anulowanie, oczekiwanie, błąd) nie zmieniają uprawnień; potem znów sukces', async () => {
    const f = createFakeStore(); for (const s of ['cancelled', 'pending', 'error'] as const) { f.nextPurchase = s; expect((await f.purchase('monthly')).status).toBe(s); expect(f.entitlements()).toEqual([]); }
    expect((await f.purchase('monthly')).status).toBe('success'); expect(f.calls.purchase).toBe(4);
  });
  test('brak sieci: ceny, uprawnienia i przywracanie rzucają, zakup kończy się błędem, nasłuch milczy; null w uprawnieniach = brak odpowiedzi', async () => {
    const f = createFakeStore(null); let n = 0; f.onTransaction(() => { n++; }); await expect(f.currentEntitlements()).rejects.toThrow();
    f.offline = true; await expect(f.getProducts()).rejects.toThrow(); await expect(f.restore()).rejects.toThrow(); await expect(f.redeemCode()).rejects.toThrow(); await expect(f.manageSubscriptions()).rejects.toThrow();
    expect((await f.purchase('monthly')).status).toBe('error'); f.setEntitlements([]); expect(n).toBe(0); f.offline = false; f.setEntitlements([]); expect(n).toBe(1);
  });
  test('przywracanie: konto Apple z wcześniejszym zakupem dostaje uprawnienie; bez zakupów — pusta lista; nasłuch można zakończyć', async () => {
    const f = createFakeStore(); expect(await f.restore()).toEqual([]); f.restorable = [{ plan: 'lifetime', source: 'purchase', expiresAt: null }];
    expect(await f.restore()).toEqual([{ plan: 'lifetime', source: 'purchase', expiresAt: null }]);
    const off = f.onTransaction(() => {}); expect(f.listenerCount()).toBe(1); off(); expect(f.listenerCount()).toBe(0);
    await f.redeemCode(); await f.manageSubscriptions(); expect(f.calls).toMatchObject({ redeemCode: 1, manageSubscriptions: 1, restore: 2 });
  });
});

describe('natywny adapter na makiecie expo-iap 5.8.1', () => {
  const EXP = Date.now() + 10 * DAY; const buy = (plan: keyof typeof PRODUCT_IDS, extra: Record<string, unknown> = {}) => ({ productId: PRODUCT_IDS[plan], expirationDateIOS: plan === 'lifetime' ? null : EXP, ownershipTypeIOS: 'purchased', revocationDateIOS: null, ...extra });
  const prod = (plan: keyof typeof PRODUCT_IDS, extra: Record<string, unknown> = {}) => ({ id: PRODUCT_IDS[plan], displayPrice: '3,99 zł', subscriptionGroupIdIOS: 'G1', subscriptionPeriodUnitIOS: plan === 'yearly' ? 'year' : 'month', introductoryPricePaymentModeIOS: 'free-trial', ...extra });

  test.each(ENTITLEMENT_PLANS.map(p => [p]))('uprawnienie z zakupu planu %s: plan, źródło „purchase”, koniec z expirationDateIOS (dożywotni: null)', plan => {
    const e = entitlementFromPurchase(buy(plan))!; expect(e).toMatchObject({ plan, source: 'purchase', revokedAt: null }); expect(e.expiresAt).toBe(plan === 'lifetime' ? null : buy(plan).expirationDateIOS);
  });
  test('źródła i znaczniki: family_shared → family, kod ofertowy → code, oferta wprowadzająca „free-trial” → trial, zwrot → revokedAt, nieznany produkt i śmieci → null', () => {
    expect(entitlementFromPurchase(buy('yearly', { ownershipTypeIOS: 'family_shared' }))!.source).toBe('family');
    expect(entitlementFromPurchase(buy('monthly', { offerIOS: { id: 'x', type: 'code', paymentMode: 'free-trial' } }))!.source).toBe('code');
    expect(entitlementFromPurchase(buy('monthly', { offerIOS: { id: 'x', type: 'introductory', paymentMode: 'free-trial' } }))!.trial).toBe(true);
    expect(entitlementFromPurchase(buy('monthly', { offerIOS: { id: 'x', type: 'introductory', paymentMode: 'pay-as-you-go' } }))!.trial).toBeUndefined();
    expect(entitlementFromPurchase(buy('monthly', { revocationDateIOS: 123 }))!.revokedAt).toBe(123);
    expect(entitlementFromPurchase(buy('monthly', { expirationDateIOS: 'x' }))!.expiresAt).toBeNull();
    for (const bad of [null, undefined, 5, {}, { productId: 'obcy' }, { productId: 7 }]) expect(entitlementFromPurchase(bad)).toBeNull();
  });
  test('produkt ze sklepu: cena wyłącznie displayPrice, okres z jednostki, próba tylko z ofertą „free-trial” i kwalifikacją; bez ceny / obcy → null', () => {
    expect(productFromStore(prod('monthly'), true)).toEqual({ plan: 'monthly', productId: PRODUCT_IDS.monthly, displayPrice: '3,99 zł', period: 'month', trial: true });
    expect(productFromStore(prod('yearly'), true)!.period).toBe('year'); expect(productFromStore(prod('yearly'), false)!.trial).toBe(false);
    expect(productFromStore(prod('monthly', { introductoryPricePaymentModeIOS: 'pay-up-front' }), true)!.trial).toBe(false);
    expect(productFromStore(prod('lifetime'), true)).toMatchObject({ period: null, trial: false });
    for (const bad of [null, {}, { id: 'obcy', displayPrice: '1' }, prod('monthly', { displayPrice: '' }), prod('monthly', { displayPrice: undefined })]) expect(productFromStore(bad, true)).toBeNull();
  });
  test('getProducts: jedno połączenie, trzy identyfikatory, kwalifikacja do próby pytana raz dla grupy; nieznane produkty pominięte', async () => {
    iap().products = [prod('monthly'), prod('yearly'), prod('lifetime'), { id: 'obcy', displayPrice: '1' }]; const s = createNativeStore();
    const ps = await s.getProducts(); expect(ps.map(p => p.plan).sort()).toEqual([...ENTITLEMENT_PLANS].sort()); expect(ps.find(p => p.plan === 'monthly')!.trial).toBe(true);
    const calls = iap().calls; expect(calls.filter((c: any[]) => c[0] === 'initConnection')).toHaveLength(1); expect(calls.find((c: any[]) => c[0] === 'fetchProducts')![1]).toEqual({ skus: Object.values(PRODUCT_IDS), type: 'all' });
    expect(calls.filter((c: any[]) => c[0] === 'isEligibleForIntroOfferIOS')).toEqual([['isEligibleForIntroOfferIOS', 'G1']]);
    iap().eligible = false; expect((await s.getProducts()).every(p => !p.trial)).toBe(true); expect(calls.filter((c: any[]) => c[0] === 'initConnection')).toHaveLength(1);
  });
  test('getProducts: błąd sklepu i brak odpowiedzi w czasie → wyjątek (offline); pusta lista produktów to odpowiedź, nie błąd', async () => {
    iap().fail = 'offline'; await expect(createNativeStore().getProducts()).rejects.toThrow(); iap().fail = null; expect(await createNativeStore().getProducts()).toEqual([]);
    jest.useFakeTimers(); const mod = require('expo-iap'); const orig = mod.fetchProducts; mod.fetchProducts = () => new Promise(() => {});
    const p = createNativeStore().getProducts(); const assertion = expect(p).rejects.toThrow('nie odpowiedział'); await jest.advanceTimersByTimeAsync(STORE_TIMING.CALL_TIMEOUT_MS + 10); await assertion; mod.fetchProducts = orig;
  });
  test('currentEntitlements: ZAWSZE getAvailablePurchases({ onlyIncludeActiveItemsIOS: true }); lista zmapowana; błąd odczytu → wyjątek (aplikacja: unknown, nigdy free)', async () => {
    iap().purchases = [buy('monthly'), buy('lifetime'), { productId: 'obcy' }]; const s = createNativeStore(); const list = await s.currentEntitlements();
    expect(list.map(e => e.plan).sort()).toEqual(['lifetime', 'monthly']);
    const gaps = iap().calls.filter((c: any[]) => c[0] === 'getAvailablePurchases'); expect(gaps.length).toBeGreaterThan(0); for (const c of gaps) expect(c[1]).toEqual({ onlyIncludeActiveItemsIOS: true });
    iap().fail = 'transakcja niezweryfikowana'; await expect(s.currentEntitlements()).rejects.toThrow();
  });
  test('karencja płatności (P7 A): subskrypcja bez aktywnego uprawnienia, ale z gracePeriodExpirationDate w przyszłości → uprawnienie do końca karencji; cofnięta i minięta — nie', async () => {
    const g = Date.now() + 5 * DAY; const s = createNativeStore(); iap().purchases = [];
    iap().status = [{ state: 'inGracePeriod', renewalInfo: { gracePeriodExpirationDate: g } }]; const list = await s.currentEntitlements();
    expect(list).toHaveLength(2); expect(list.every(e => e.expiresAt === g && e.source === 'purchase')).toBe(true); expect(entitlementActive(list[0], Date.now())).toBe(true); expect(entitlementActive(list[0], g)).toBe(false);
    iap().status = [{ state: 'revoked', renewalInfo: { gracePeriodExpirationDate: g } }]; expect(await s.currentEntitlements()).toEqual([]);
    iap().status = [{ state: 'inGracePeriod', renewalInfo: { gracePeriodExpirationDate: Date.now() - DAY } }]; expect(await s.currentEntitlements()).toEqual([]);
    iap().status = [{ state: 'expired', renewalInfo: null }, { state: 'subscribed' }]; expect(await s.currentEntitlements()).toEqual([]);
    iap().purchases = [buy('monthly')]; iap().status = [{ state: 'inGracePeriod', renewalInfo: { gracePeriodExpirationDate: g } }]; const both = await s.currentEntitlements();
    expect(both.filter(e => e.plan === 'monthly')).toHaveLength(1); expect(both.filter(e => e.plan === 'yearly')).toHaveLength(1);
  });
  test('zakup: żądanie subs dla subskrypcji, in-app dla dożywotniego; zwrócone transakcje kończone; wynik success', async () => {
    const s = createNativeStore(); for (const plan of ENTITLEMENT_PLANS) {
      iap().calls.length = 0; iap().purchaseResult = [buy(plan)]; expect(await s.purchase(plan)).toEqual({ status: 'success' });
      expect(iap().calls.find((c: any[]) => c[0] === 'requestPurchase')![1]).toEqual({ request: { apple: { sku: PRODUCT_IDS[plan] } }, type: plan === 'lifetime' ? 'in-app' : 'subs' });
      expect(iap().calls.filter((c: any[]) => c[0] === 'finishTransaction')).toHaveLength(1);
    }
  });
  test.each([['user-cancelled', 'cancelled'], ['pending', 'pending'], ['deferred-payment', 'pending'], ['network-error', 'error'], ['', 'error']])('zakup: kod błędu „%s” → %s (anulowanie nie jest błędem)', async (code, status) => {
    iap().purchaseError = code || 'x'; const r = await createNativeStore().purchase('monthly'); expect(r.status).toBe(status);
  });
  test('zakup bez modułu sklepu / przy błędzie połączenia → error, bez wyjątku', async () => { iap().fail = 'brak połączenia'; expect((await createNativeStore().purchase('yearly')).status).toBe('error'); });
  test('przywracanie: sync (restorePurchases) przed odczytem uprawnień; kod i zarządzanie subskrypcją wołają odpowiednie funkcje biblioteki', async () => {
    iap().purchases = [buy('lifetime')]; const s = createNativeStore(); const list = await s.restore(); expect(list.map(e => e.plan)).toEqual(['lifetime']);
    const names = iap().calls.map((c: any[]) => c[0]); expect(names.indexOf('restorePurchases')).toBeGreaterThan(-1); expect(names.indexOf('restorePurchases')).toBeLessThan(names.lastIndexOf('getAvailablePurchases'));
    await s.redeemCode(); await s.manageSubscriptions(); expect(iap().calls.some((c: any[]) => c[0] === 'openRedeemOfferCode')).toBe(true); expect(iap().calls.some((c: any[]) => c[0] === 'deepLinkToSubscriptions')).toBe(true);
    iap().fail = 'x'; await expect(s.restore()).rejects.toThrow();
  });
  test('nasłuch transakcji od startu: po połączeniu rejestruje zdarzenia zakupu i błędu, kończy transakcję i budzi słuchacza; zakończenie nasłuchu usuwa rejestrację', async () => {
    const s = createNativeStore(); let n = 0; const off = s.onTransaction(() => { n++; }); await jest.requireActual('timers').setImmediate ? await new Promise(r => setTimeout(r, 0)) : null;
    expect(iap().listeners.updated).toHaveLength(1); expect(iap().listeners.error).toHaveLength(1);
    iap().listeners.updated[0](buy('monthly')); await new Promise(r => setTimeout(r, 0)); expect(n).toBe(1); expect(iap().calls.some((c: any[]) => c[0] === 'finishTransaction')).toBe(true);
    iap().listeners.error[0]({ code: 'x' }); expect(n).toBe(2); off(); expect(iap().listeners.updated).toHaveLength(0); expect(iap().listeners.error).toHaveLength(0);
  });
  test('nasłuch zakończony przed połączeniem nie zostawia rejestracji', async () => { const s = createNativeStore(); const off = s.onTransaction(() => {}); off(); await new Promise(r => setTimeout(r, 0)); expect(iap().listeners.updated).toHaveLength(0); });
  test('nasłuch przy braku sklepu (połączenie rzuca) — cicho, bez wyjątku', async () => { iap().fail = 'x'; const off = createNativeStore().onTransaction(() => {}); await new Promise(r => setTimeout(r, 0)); off(); expect(iap().listeners.updated).toHaveLength(0); });
});
