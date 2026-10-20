/*
 * Audyt M1 z 19.10.2026, partia 2 — M1-audytor-generalny-017: na iOS 16.4–17.1 transakcja nie ma pola offerIOS, więc zakup z okresem próbnym
 * nie dostawał znacznika `trial` i przypomnienie przed końcem próby się nie planowało. Znacznik wnioskujemy wtedy z samej transakcji:
 * pierwsza transakcja subskrypcji, której okres trwa najwyżej TRIAL_DAYS (+1 dzień zapasu) — odnowienie płatne trwa miesiąc albo rok.
 * Czerwone na 8273448.
 */
import { entitlementFromPurchase } from '@/lib/store-native';
import { trialReminderAt } from '@/lib/trialReminder';
import { PRODUCT_IDS, PAYWALL_MOMENTS, TRIAL_DAYS } from '@/lib/products';

const DAY = 86400e3; const T0 = Date.UTC(2026, 9, 20, 10);
const tx = (plan: keyof typeof PRODUCT_IDS, days: number | null, extra: Record<string, unknown> = {}) => ({ productId: PRODUCT_IDS[plan], transactionDate: T0, originalTransactionDateIOS: T0, expirationDateIOS: days == null ? null : T0 + days * DAY, ownershipTypeIOS: 'purchased', ...extra });

describe('M1-017: próba rozpoznana bez offerIOS (iOS 16.4–17.1)', () => {
  test.each(['monthly', 'yearly'] as const)('%s: pierwsza transakcja na TRIAL_DAYS dni bez offerIOS → trial; przypomnienie na koniec − 2 dni', plan => {
    const e = entitlementFromPurchase(tx(plan, TRIAL_DAYS))!; expect(e.trial).toBe(true); expect(e.expiresAt).toBe(T0 + TRIAL_DAYS * DAY);
    expect(trialReminderAt([e], T0 + 1000)).toEqual({ at: T0 + TRIAL_DAYS * DAY - PAYWALL_MOMENTS.TRIAL_END_REMINDER_DAYS * DAY, end: T0 + TRIAL_DAYS * DAY });
  });
  test('zakup płatny (miesiąc, rok), dożywotni, odnowienie po próbie i transakcja z innym offerIOS — bez znacznika', () => {
    expect(entitlementFromPurchase(tx('monthly', 30))!.trial).toBeUndefined(); expect(entitlementFromPurchase(tx('yearly', 365))!.trial).toBeUndefined();
    expect(entitlementFromPurchase(tx('lifetime', null))!.trial).toBeUndefined();
    expect(entitlementFromPurchase(tx('monthly', 14, { transactionDate: T0 + 14 * DAY, originalTransactionDateIOS: T0, expirationDateIOS: T0 + 44 * DAY }))!.trial).toBeUndefined();
    expect(entitlementFromPurchase(tx('monthly', 14, { transactionDate: T0 + 14 * DAY, originalTransactionDateIOS: T0, expirationDateIOS: T0 + 28 * DAY }))!.trial).toBeUndefined(); /* odnowienie w piaskownicy: nie pierwsza transakcja */
    expect(entitlementFromPurchase(tx('monthly', 14, { offerIOS: { id: 'x', type: 'promotional', paymentMode: 'pay-as-you-go' } }))!.trial).toBeUndefined();
  });
  test('iOS 17.2+: offerIOS nadal rozstrzyga (introductory + free-trial → trial; kod ofertowy → źródło „code”)', () => {
    expect(entitlementFromPurchase(tx('monthly', 30, { offerIOS: { id: 'x', type: 'introductory', paymentMode: 'free-trial' } }))!.trial).toBe(true);
    expect(entitlementFromPurchase(tx('monthly', 14, { offerIOS: { id: 'x', type: 'code', paymentMode: 'free-trial' } }))!.source).toBe('code');
  });
  test('brak dat w transakcji (stary format) — bez zgadywania', () => {
    expect(entitlementFromPurchase({ productId: PRODUCT_IDS.monthly, expirationDateIOS: T0 + 14 * DAY })!.trial).toBeUndefined();
  });
});
