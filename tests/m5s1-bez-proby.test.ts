/*
 * M5 S1 (22.10.2026): BRAK oferty wprowadzającej (okresu próbnego). Zastępuje audyty M1-011 (14 dni) i M1-017 (wnioskowanie próby na iOS 16.4–17.1) oraz test przypomnienia
 * o końcu próby. Strażnik: stałe, plik trialReminder, pole `trial`, .storekit, sztuczny sklep, natywny adapter, ekran zakupu, słowniki, scenariusze Maestro, kontrola ASC.
 * Ryzyko R-M5-3 (docs/40): produkty w App Store Connect z ofertą wprowadzającą — zamyka kontrola ASC (store/asc-kontrola.json, „oferta.brak”).
 */
import * as fs from 'fs';
import * as path from 'path';
import * as products from '@/lib/products';
import { LANGS, applyLang, t } from '@/lib/i18n';
import { LOCALES } from '@/lib/locales';
import { EN } from '@/lib/i18n.en';
import { createFakeStore } from '@/lib/store-fake';
import { entitlementFromPurchase, productFromStore } from '@/lib/store-native';
import { priceLine, planName, planBlurb } from '@/app/paywall';
import { ENTITLEMENT_PLANS } from '@/lib/access';
import { PLAN_ORDER } from '@/lib/products';

const root = path.join(__dirname, '..'); const read = (f: string) => fs.readFileSync(path.join(root, f), 'utf8'); const DAY = 86400e3;
const GONE = ['{days} dni za darmo, potem {price}/{period}', 'Zacznij {days} dni za darmo', 'Okres próbny do {date}', 'Okres próbny dobiega końca',
  'Okres próbny kończy się {date}. Jeśli nie chcesz subskrypcji, anuluj ją w ustawieniach konta Apple.', 'Treningi na żywo bez miesięcznego limitu.', 'Rocznie', 'Miesięcznie', 'Na zawsze',
  'Bez zakupu: {n} {s} na żywo w miesiącu; historia, kopia zapasowa i eksport są zawsze dostępne.', 'Darmowe treningi w tym miesiącu: {n} z {limit}',
  'Wykorzystano limit darmowych treningów w tym miesiącu ({n}). Kolejne od {date}.'];
afterEach(() => { applyLang('pl'); jest.useRealTimers(); });

describe('kod: żadnej pozostałości po okresie próbnym', () => {
  test('stałe i moduły usunięte: TRIAL_DAYS, PAYWALL_MOMENTS, lib/trialReminder.ts', () => {
    expect((products as any).TRIAL_DAYS).toBeUndefined(); expect((products as any).PAYWALL_MOMENTS).toBeUndefined(); expect((products as any).E2E_FREE_LIVE_PER_MONTH).toBeUndefined();
    expect(fs.existsSync(path.join(root, 'lib/trialReminder.ts'))).toBe(false);
  });
  test('źródła aplikacji nie zawierają: trial/próby (pole, wnioskowanie), przypomnienia, ekranu po pierwszym treningu (reason=first)', () => {
    const files = ['lib/access.ts', 'lib/entitlement.ts', 'lib/products.ts', 'lib/store-adapter.ts', 'lib/store-fake.ts', 'lib/store-native.ts', 'lib/review-run.ts', 'app/paywall.tsx', 'components/SubscriptionCard.tsx', 'app/more/language.tsx'];
    for (const f of files) {
      const code = read(f).split('\n').filter(l => !/^\s*(\/\/|\/\*|\*)/.test(l)).join('\n').replace(/\/\*[\s\S]*?\*\//g, '');
      expect([f, /\btrial\b|TRIAL_|trialReminder|resyncTrialReminder|isEligibleForIntroOffer|free-trial|reason=first|maybeShowPaywallAfterFirstWorkout|PAYWALL_SEEN_KEY|AFTER_FIRST_WORKOUT/.test(code)]).toEqual([f, false]);
    }
  });
});

describe('store/Trening.storekit i kontrola ASC: bez ofert wprowadzających', () => {
  test('żadna subskrypcja nie ma introductoryOffer; okresy odnowienia: miesiąc i rok', () => {
    const f = JSON.parse(read('store/Trening.storekit')); const subs = f.subscriptionGroups.flatMap((g: any) => g.subscriptions);
    expect(subs).toHaveLength(2); for (const s of subs) expect(s.introductoryOffer).toBeUndefined();
    expect(subs.map((s: any) => s.recurringSubscriptionPeriod).sort()).toEqual(['P1M', 'P1Y']);
  });
  test('store/asc-kontrola.json: oferta.brak = true dla miesięcznej i rocznej (R-M5-3), bez trybu FREE_TRIAL', () => {
    const c = JSON.parse(read('store/asc-kontrola.json')); expect(c.oferta).toEqual({ produkty: ['monthly', 'yearly'], brak: true });
    expect(JSON.stringify(c)).not.toMatch(/FREE_TRIAL|TWO_WEEKS/);
  });
  test('docs/40: ryzyka R-M5-1, R-M5-2, R-M5-3 w rejestrze, R-M5-3 z warunkiem zamknięcia (kontrola ASC)', () => {
    const d = read('docs/40-lekcje.md'); for (const id of ['R-M5-1', 'R-M5-2', 'R-M5-3']) expect(d).toContain(id);
    const row = d.split('\n').find(l => l.includes('R-M5-3')) ?? ''; expect(row).toMatch(/kontrol[ai]\s+ASC/i);
  });
});

describe('adapter sklepu: zakup to zwykła subskrypcja na okres, produkt bez pola próby', () => {
  test('sztuczny sklep: miesięczna 30 dni, roczna 365 dni od zakupu; dożywotni bez końca; ponowny zakup tego samego planu nie daje „próby”', async () => {
    const now = Date.UTC(2026, 9, 22); jest.useFakeTimers({ now });
    for (const [plan, days] of [['monthly', 30], ['yearly', 365]] as const) {
      const f = createFakeStore([]); await f.purchase(plan); const e = (await f.currentEntitlements())[0];
      expect(e.expiresAt).toBe(now + days * DAY); expect(Object.keys(e)).not.toContain('trial');
    }
    const f = createFakeStore([]); await f.purchase('lifetime'); expect((await f.currentEntitlements())[0]).toEqual({ plan: 'lifetime', source: 'purchase', expiresAt: null });
    for (const p of await f.getProducts()) expect(Object.keys(p).sort()).toEqual(['displayPrice', 'period', 'plan', 'productId']);
  });
  test('natywny: pierwsza transakcja krótkiego okresu NIE jest wnioskowana jako próba (dawne M1-017); oferta „free-trial” w produkcie nie tworzy pola', () => {
    const start = Date.UTC(2026, 9, 1); const tx = { productId: 'pl.lukasz.trening.full.monthly', transactionDate: start, originalTransactionDateIOS: start, expirationDateIOS: start + 7 * DAY };
    expect(entitlementFromPurchase(tx)).toEqual({ plan: 'monthly', source: 'purchase', expiresAt: start + 7 * DAY, revokedAt: null });
    expect(entitlementFromPurchase({ ...tx, offerIOS: { type: 'introductory', paymentMode: 'free-trial' } })).toEqual({ plan: 'monthly', source: 'purchase', expiresAt: start + 7 * DAY, revokedAt: null });
    const p = productFromStore({ id: 'pl.lukasz.trening.full.yearly', displayPrice: '$6.99', subscriptionPeriodUnitIOS: 'year', introductoryPricePaymentModeIOS: 'free-trial' });
    expect(p).toEqual({ plan: 'yearly', productId: 'pl.lukasz.trening.full.yearly', displayPrice: '$6.99', period: 'year' });
  });
});

describe('ekran zakupu: wiersz ceny, nazwy i opisy planów', () => {
  const sub = (period: 'month' | 'year' | null) => ({ plan: period === 'month' ? 'monthly' : period === 'year' ? 'yearly' : 'lifetime', productId: 'x', displayPrice: '$6.99', period }) as const;
  test('priceLine: cena za okres albo jednorazowa, w PL i EN, bez „za darmo”', () => {
    expect(priceLine(sub('year'))).toBe('$6.99/rok'); expect(priceLine(sub('month'))).toBe('$6.99/miesiąc'); expect(priceLine(sub(null))).toBe('$6.99 jednorazowo');
    applyLang('en'); expect(priceLine(sub('year'))).toBe('$6.99/year'); expect(priceLine(sub('month'))).toBe('$6.99/month'); expect(priceLine(sub(null))).toBe('$6.99 one-time');
    expect(t('Subskrybuj')).toBe('Subscribe');
  });
  test.each([['pl', ['Trening to część mojego tygodnia', 'Szukam swojego rytmu', 'Trening to moje życie']], ['en', ['Training is part of my week', 'Still finding my rhythm', 'Training is my life']]] as const)(
    'nazwy planów (%s): roczny, miesięczny, dożywotni; opisy bez cyfr i procentów', (lang, names) => {
      applyLang(lang); expect([planName('yearly'), planName('monthly'), planName('lifetime')]).toEqual(names);
      for (const p of ENTITLEMENT_PLANS) expect([p, planBlurb(p)]).toEqual([p, expect.not.stringMatching(/\d|%|percent|procent/i)]);
    });
  test('kolejność planów bez zmian: roczny, miesięczny, dożywotni', () => { expect(PLAN_ORDER).toEqual(['yearly', 'monthly', 'lifetime']); });
});

describe('słowniki i scenariusze', () => {
  test('stare teksty (próba, stare nazwy planów, stary limit) usunięte ze słownika EN i ze wszystkich 33 słowników', () => {
    for (const k of GONE) expect([k, EN[k]]).toEqual([k, undefined]);
    for (const l of LANGS.filter(x => x !== 'pl' && x !== 'en')) { const d = LOCALES[l] as Record<string, string>; for (const k of GONE) expect([l, k, d[k]]).toEqual([l, k, undefined]); }
  });
  test('Maestro, katalog przepływów i dokumenty modelu nie obiecują „14 days free” ani „1 month free”', () => {
    const bad = fs.readdirSync(path.join(root, '.maestro')).filter(x => x.endsWith('.yaml') && /14 days free|1 month free|free month|Start 14 days/.test(read('.maestro/' + x)));
    expect(bad).toEqual([]); expect(read('tests/przeplywy.json')).not.toMatch(/miesiąc za darmo|14 dni za darmo/);
    expect(read('docs/monetyzacja.md')).not.toMatch(/\*\*14 dni\*\*/);
  });
});
