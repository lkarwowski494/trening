/*
 * 101-28 (1.0.1, zgłoszenie 29.10.2026): po anulowaniu subskrypcji (dostęp trwa do końca okresu) uwaga „nadal się odnawia — anuluj” nie może się pokazywać.
 * Sklep podaje stan w renewalInfoIOS.willAutoRenew (expo-iap 5.8.1, build/types.d.ts RenewalInfoIOS; StoreKit 2 Product.SubscriptionInfo.RenewalInfo.willAutoRenew).
 * Brak informacji (undefined: brak renewalInfo, starszy zapis, kod promocyjny) → jak dotąd uwaga jest (bezpieczniej ostrzec niż przemilczeć podwójną opłatę).
 * Rodzaje (docs/20): logika (adapter), ekran (PL/EN), odczyt zapisu bez pola.
 */
import * as store from '@/lib/store';
import { applyLang } from '@/lib/i18n';
import { PAYWALL, type Entitlement } from '@/lib/access';
import { setStoreAdapter, resetStoreAdapterForTests } from '@/lib/store-adapter';
import { createFakeStore } from '@/lib/store-fake';
import { entitlementFromPurchase } from '@/lib/store-native';
import { PRODUCT_IDS } from '@/lib/products';
import { resetEntitlementsForTests, parseLastKnown } from '@/lib/entitlement';
import { fresh, saved } from './helpers';
import { renderApp, flushAll, screen, tap, act } from './app';

const NOW = new Date(2026, 9, 29, 12, 0).getTime(); const DAY = 86400e3;
const sub = (extra: Partial<Entitlement> = {}): Entitlement => ({ plan: 'monthly', source: 'purchase', expiresAt: NOW + 1 * DAY, ...extra });
const settle = async () => { for (let i = 0; i < 8; i++) await flushAll(10); };
async function boot(ents: Entitlement[], locale: 'pl' | 'en') {
  jest.useFakeTimers({ now: NOW }); await fresh(undefined, locale); resetEntitlementsForTests(); PAYWALL.ENABLED = true;
  setStoreAdapter(createFakeStore(ents)); store.save(); await act(async () => { await store.flush(); });
  await renderApp({ saved: JSON.parse(JSON.stringify(saved())), locale, url: '/paywall?reason=settings' }); jest.setSystemTime(NOW); await settle();
}
afterEach(() => { PAYWALL.ENABLED = false; resetEntitlementsForTests(); resetStoreAdapterForTests(); applyLang('pl'); jest.useRealTimers(); });
const EN = 'Your subscription still renews — cancel it so you don\'t pay twice.';
const PL = 'Twoja subskrypcja nadal się odnawia — anuluj ją, żeby nie płacić podwójnie.';

describe('101-28: adapter natywny przenosi stan odnawiania', () => {
  const tx = (renewalInfoIOS?: unknown) => ({ productId: PRODUCT_IDS.monthly, expirationDateIOS: NOW + DAY, ownershipTypeIOS: 'purchased', revocationDateIOS: null, ...(renewalInfoIOS === undefined ? {} : { renewalInfoIOS }) });
  test('willAutoRenew false/true z renewalInfoIOS trafia do uprawnienia', () => {
    expect(entitlementFromPurchase(tx({ willAutoRenew: false }))!.willAutoRenew).toBe(false);
    expect(entitlementFromPurchase(tx({ willAutoRenew: true }))!.willAutoRenew).toBe(true);
  });
  test('brak renewalInfoIOS, null albo pole nie-boolean → brak pola (nieznane), nie false', () => {
    for (const r of [undefined, null, {}, { willAutoRenew: 'no' }]) expect('willAutoRenew' in entitlementFromPurchase(tx(r))!).toBe(false);
  });
  test('dożywotni nie niesie pola odnawiania', () => {
    const e = entitlementFromPurchase({ productId: PRODUCT_IDS.lifetime, expirationDateIOS: null, renewalInfoIOS: { willAutoRenew: false } })!; expect('willAutoRenew' in e).toBe(false);
  });
});

describe('101-28: zapamiętany wynik (kv) nie zawiera uprawnień — stary zapis bez pola czyta się bez zmian', () => {
  test('zapis sprzed zmiany', () => { expect(parseLastKnown(JSON.stringify({ level: 'full', expiresAt: NOW + DAY, at: NOW }))).toEqual({ level: 'full', expiresAt: NOW + DAY }); });
});

describe('101-28: uwaga o odnawianiu na ekranie zakupu', () => {
  test.each([['en', EN], ['pl', PL]] as const)('%s: subskrypcja anulowana (willAutoRenew=false) → po wyborze dożywotniego brak uwagi', async (loc, txt) => {
    await boot([sub({ willAutoRenew: false })], loc); await tap(screen.getByTestId('paywall-change-plan')); await tap(screen.getByTestId('plan-lifetime'));
    expect(screen.queryByTestId('paywall-lifetime-warning')).toBeNull(); expect(screen.queryByText(txt)).toBeNull();
  });
  test('subskrypcja odnawiająca się (willAutoRenew=true) → uwaga jest', async () => {
    await boot([sub({ willAutoRenew: true })], 'en'); await tap(screen.getByTestId('paywall-change-plan')); await tap(screen.getByTestId('plan-lifetime'));
    expect(screen.getByTestId('paywall-lifetime-warning').props.children).toBe(EN);
  });
  test('brak informacji (undefined) → uwaga jest (zachowanie dotychczasowe)', async () => {
    await boot([sub()], 'en'); await tap(screen.getByTestId('paywall-change-plan')); await tap(screen.getByTestId('plan-lifetime'));
    expect(screen.getByTestId('paywall-lifetime-warning').props.children).toBe(EN);
  });
  test('dożywotni posiadany + anulowana subskrypcja → bez linii „nadal się odnawia”', async () => {
    await boot([sub({ willAutoRenew: false }), { plan: 'lifetime', source: 'purchase', expiresAt: null }], 'en'); expect(screen.queryByText(EN)).toBeNull();
  });
  test('dożywotni posiadany + odnawiająca się subskrypcja → linia jest', async () => {
    await boot([sub({ willAutoRenew: true }), { plan: 'lifetime', source: 'purchase', expiresAt: null }], 'en'); expect(screen.getByText(EN)).toBeTruthy();
  });
});
