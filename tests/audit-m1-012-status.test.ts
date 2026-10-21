/*
 * Audyt M1 z 19.10.2026, partia 2 — M1-audytor-generalny-012: błąd zapytania o karencję płatności (subscriptionStatusIOS) nie może unieważniać
 * całego odczytu zakupów. Płacący z zakupem widocznym w getAvailablePurchases ma dostęp także wtedy, gdy zapytanie pomocnicze rzuca;
 * odczyt bez żadnego uprawnienia i z błędem zapytania nadal kończy się wyjątkiem (stan „unknown”, nigdy „free” — docs/30 3.3).
 * Czerwone na 8273448: wyjątek z pomocniczego zapytania przechodził do currentEntitlements().
 */
import { ENTITLEMENT_PLANS, entitlementActive } from '@/lib/access';
import { PRODUCT_IDS } from '@/lib/products';
import { createNativeStore } from '@/lib/store-native';
import { resetStoreAdapterForTests, setStoreAdapter } from '@/lib/store-adapter';
import { PAYWALL } from '@/lib/access';
import { initEntitlements, resetEntitlementsForTests, useAccess } from '@/lib/entitlement';
import { renderHook, act } from '@testing-library/react-native';
import { fresh } from './helpers';

const DAY = 86400e3; const iap = () => (global as any).__iap;
const buy = (plan: keyof typeof PRODUCT_IDS, extra: Record<string, unknown> = {}) => ({ productId: PRODUCT_IDS[plan], expirationDateIOS: plan === 'lifetime' ? null : Date.now() + 10 * DAY, ownershipTypeIOS: 'purchased', revocationDateIOS: null, ...extra });
beforeEach(() => { Object.assign(iap(), { calls: [], products: [], purchases: [], status: [], eligible: true, fail: null, statusFail: null, purchaseError: null, purchaseResult: undefined, listeners: { updated: [], error: [] } }); resetStoreAdapterForTests(); });
afterEach(() => { iap().statusFail = null; PAYWALL.ENABLED = false; resetEntitlementsForTests(); resetStoreAdapterForTests(); });

describe('M1-012: błąd zapytania o karencję nie unieważnia odczytu zakupów', () => {
  test('dożywotni z getAvailablePurchases + subscriptionStatusIOS rzuca → uprawnienie dożywotnie zwrócone', async () => {
    iap().purchases = [buy('lifetime')]; iap().statusFail = 'status niedostępny';
    const list = await createNativeStore().currentEntitlements(); expect(list.map(e => e.plan)).toEqual(['lifetime']); expect(entitlementActive(list[0], Date.now())).toBe(true);
  });
  test('roczny aktywny; status miesięcznego (jedyny pytany plan) rzuca → roczny zwrócony', async () => {
    iap().purchases = [buy('yearly')]; iap().statusFail = 'status niedostępny';
    const list = await createNativeStore().currentEntitlements(); expect(list.map(e => e.plan)).toEqual(['yearly']);
    expect(iap().calls.filter((c: any[]) => c[0] === 'subscriptionStatusIOS').map((c: any[]) => c[1])).toEqual([PRODUCT_IDS.monthly]);
  });
  test('przywracanie zakupów (ponowna instalacja) z błędem zapytania pomocniczego daje dostęp', async () => {
    iap().purchases = [buy('lifetime')]; iap().statusFail = 'status niedostępny';
    const list = await createNativeStore().restore(); expect(list.map(e => e.plan)).toEqual(['lifetime']);
  });
  test('start aplikacji: stan „full” mimo błędu zapytania pomocniczego (bez zapamiętanego stanu — ponowna instalacja)', async () => {
    await fresh(); resetEntitlementsForTests(); PAYWALL.ENABLED = true; iap().purchases = [buy('lifetime')]; iap().statusFail = 'status niedostępny';
    setStoreAdapter(createNativeStore()); await initEntitlements();
    const { result } = renderHook(() => useAccess()); await act(async () => { await Promise.resolve(); });
    expect(result.current.level).toBe('full'); expect(result.current.active?.plan).toBe('lifetime');
  });
  test('brak jakiegokolwiek uprawnienia i błąd zapytania pomocniczego → wyjątek (aplikacja: unknown, nie free)', async () => {
    iap().purchases = []; iap().statusFail = 'status niedostępny';
    await expect(createNativeStore().currentEntitlements()).rejects.toThrow('status niedostępny');
  });
  test('karencja nadal działa, gdy zapytanie się udaje (bez regresji)', async () => {
    iap().purchases = []; iap().status = [{ state: 'inGracePeriod', renewalInfo: { gracePeriodExpirationDate: Date.now() + 5 * DAY } }];
    const list = await createNativeStore().currentEntitlements(); expect(list.map(e => e.plan).sort()).toEqual([...ENTITLEMENT_PLANS].filter(p => p !== 'lifetime').sort());
  });
});
