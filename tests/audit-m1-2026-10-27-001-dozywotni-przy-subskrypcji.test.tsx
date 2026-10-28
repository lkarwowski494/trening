/*
 * M1-audytor-generalny-001 (audyt 1.0, 27.10.2026; 02-monetyzacja-503): przy aktywnej subskrypcji wybór planu dożywotniego pokazuje PRZED arkuszem Apple
 * uwagę o odnawianiu subskrypcji (docs/27 3.11: „Na ekranie zakupu przy aktywnej subskrypcji ta sama uwaga przed zakupem”). Subskrypcja z Chmury rodzinnej
 * (płaci organizator) — bez sugestii „anuluj”; z kodu promocyjnego po promocji odnawia się płatnie — z uwagą (decyzja 5a, 28.10.2026). Rodzaje (docs/20): ekran, języki (PL, EN), VoiceOver (tekst w drzewie dostępności).
 */
import * as store from '@/lib/store';
import { applyLang } from '@/lib/i18n';
import { PAYWALL, type Entitlement } from '@/lib/access';
import { setStoreAdapter, resetStoreAdapterForTests } from '@/lib/store-adapter';
import { createFakeStore } from '@/lib/store-fake';
import { resetEntitlementsForTests } from '@/lib/entitlement';
import { fresh, saved } from './helpers';
import { renderApp, flushAll, screen, tap, act } from './app';

const NOW = new Date(2026, 9, 27, 12, 0).getTime(); const DAY = 86400e3;
const sub = (extra: Partial<Entitlement> = {}): Entitlement => ({ plan: 'monthly', source: 'purchase', expiresAt: NOW + 9 * DAY, ...extra });
const settle = async () => { for (let i = 0; i < 8; i++) await flushAll(10); };
async function boot(ents: Entitlement[], locale: 'pl' | 'en') {
  jest.useFakeTimers({ now: NOW }); await fresh(undefined, locale); resetEntitlementsForTests(); PAYWALL.ENABLED = true;
  setStoreAdapter(createFakeStore(ents)); store.save(); await act(async () => { await store.flush(); });
  await renderApp({ saved: JSON.parse(JSON.stringify(saved())), locale, url: '/paywall?reason=settings' }); jest.setSystemTime(NOW); await settle();
}
afterEach(() => { PAYWALL.ENABLED = false; resetEntitlementsForTests(); resetStoreAdapterForTests(); applyLang('pl'); jest.useRealTimers(); });
const EN = 'Your subscription still renews — cancel it so you don\'t pay twice.';
const PL = 'Twoja subskrypcja nadal się odnawia — anuluj ją, żeby nie płacić podwójnie.';

describe('M1-001: dożywotni przy aktywnej subskrypcji — uwaga przed zakupem', () => {
  test('EN: miesięczny kupiony sam → wybór dożywotniego pokazuje uwagę nad „Buy forever”; przy innym planie uwagi nie ma', async () => {
    await boot([sub()], 'en'); await tap(screen.getByTestId('paywall-change-plan')); /* DEC-09 a (27.10.2026): przy aktywnym planie lista pod „Zmień plan” */
    expect(screen.queryByTestId('paywall-lifetime-warning')).toBeNull();
    await tap(screen.getByTestId('plan-lifetime'));
    expect(screen.getByText('Buy forever')).toBeTruthy();
    expect(screen.getByTestId('paywall-lifetime-warning').props.children).toBe(EN);
    await tap(screen.getByTestId('plan-yearly')); expect(screen.queryByTestId('paywall-lifetime-warning')).toBeNull();
  });
  test('PL: ta sama uwaga po polsku', async () => {
    await boot([sub()], 'pl'); await tap(screen.getByTestId('paywall-change-plan')); await tap(screen.getByTestId('plan-lifetime'));
    expect(screen.getByTestId('paywall-lifetime-warning').props.children).toBe(PL);
  });
  test('bez subskrypcji: dożywotni bez uwagi', async () => {
    await boot([], 'en'); await tap(screen.getByTestId('plan-lifetime')); expect(screen.queryByTestId('paywall-lifetime-warning')).toBeNull();
  });
  test('subskrypcja z Chmury rodzinnej (płaci organizator): bez sugestii „anuluj”', async () => {
    await boot([sub({ source: 'family' })], 'en'); await tap(screen.getByTestId('paywall-change-plan')); await tap(screen.getByTestId('plan-lifetime'));
    expect(screen.queryByTestId('paywall-lifetime-warning')).toBeNull(); expect(screen.queryByText(EN)).toBeNull();
  });
  test('subskrypcja z kodu promocyjnego: po promocji odnawia się płatnie — ta sama uwaga (decyzja właściciela 5a, 28.10.2026; M2-koordynator-napraw-001)', async () => {
    await boot([sub({ source: 'code' })], 'en'); await tap(screen.getByTestId('paywall-change-plan')); await tap(screen.getByTestId('plan-lifetime'));
    expect(screen.getByTestId('paywall-lifetime-warning').props.children).toBe(EN);
  });
});
