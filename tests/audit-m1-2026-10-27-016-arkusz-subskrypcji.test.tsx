/*
 * M1-audytor-generalny-016 (audyt 1.0, 27.10.2026; decyzja subskrypcji 0.17 z 12.10.2026, docs/27 3.10; 08-programista-001, 02-monetyzacja-505): „Zarządzaj subskrypcją” otwiera systemowy arkusz StoreKit
 * w aplikacji (expo-iap showManageSubscriptionsIOS → AppStore.showManageSubscriptions; działa w piaskownicy i TestFlight), a strona App Store
 * (deepLinkToSubscriptions) jest tylko zapasem przy błędzie arkusza; po zamknięciu arkusza ekran odświeża uprawnienia (zmiana planu albo anulowanie).
 * Rodzaje (docs/20): kontrakt adaptera na makiecie expo-iap, ekran, regresja.
 */
import { createNativeStore } from '@/lib/store-native';
import { resetStoreAdapterForTests, setStoreAdapter } from '@/lib/store-adapter';
import { PAYWALL, type Entitlement } from '@/lib/access';
import { resetEntitlementsForTests } from '@/lib/entitlement';
import { createFakeStore } from '@/lib/store-fake';
import { applyLang, t } from '@/lib/i18n';
import * as store from '@/lib/store';
import { fresh, saved } from './helpers';
import { renderApp, flushAll, screen, tap, act } from './app';

const iap = () => global.__iap;
beforeEach(() => { Object.assign(global.__iap, { calls: [], products: [], purchases: [], status: [], eligible: true, fail: null, manageFail: null, listeners: { updated: [], error: [] } }); resetStoreAdapterForTests(); });
afterEach(() => { PAYWALL.ENABLED = false; resetEntitlementsForTests(); resetStoreAdapterForTests(); applyLang('pl'); jest.useRealTimers(); });

describe('M1-016: arkusz zarządzania subskrypcją', () => {
  test('adapter natywny: arkusz systemowy, bez strony App Store', async () => {
    await createNativeStore().manageSubscriptions(); const names = iap().calls.map((c: unknown[]) => c[0]);
    expect(names).toContain('showManageSubscriptionsIOS'); expect(names).not.toContain('deepLinkToSubscriptions');
  });
  test('arkusz rzuca → zapas: strona App Store', async () => {
    iap().manageFail = 'no scene'; await createNativeStore().manageSubscriptions(); const names = iap().calls.map((c: unknown[]) => c[0]);
    expect(names).toContain('showManageSubscriptionsIOS'); expect(names.indexOf('showManageSubscriptionsIOS')).toBeLessThan(names.indexOf('deepLinkToSubscriptions')); expect(names).toContain('deepLinkToSubscriptions');
  });
  test('ekran zakupu: po „Zarządzaj subskrypcją” uprawnienia są odświeżane (anulowanie w arkuszu widać od razu)', async () => {
    const now = Date.now(); const sub: Entitlement = { plan: 'monthly', source: 'purchase', expiresAt: now + 9 * 86400e3 };
    await fresh(); resetEntitlementsForTests(); PAYWALL.ENABLED = true; const fake = createFakeStore([sub]); setStoreAdapter(fake); store.save(); await act(async () => { await store.flush(); });
    await renderApp({ saved: JSON.parse(JSON.stringify(saved())), url: '/paywall?reason=settings' }); for (let i = 0; i < 8; i++) await flushAll(10);
    const before = fake.calls.currentEntitlements; await tap(screen.getByText(t('Zarządzaj subskrypcją'))); for (let i = 0; i < 8; i++) await flushAll(10);
    expect(fake.calls.manageSubscriptions ?? 1).toBeGreaterThan(0); expect(fake.calls.currentEntitlements).toBeGreaterThan(before);
  });
});
