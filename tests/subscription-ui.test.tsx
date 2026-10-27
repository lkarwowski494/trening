/*
 * 0.17.0, subskrypcja — EKRANY (docs/27 rozdz. 5, 9; decyzje właściciela 12.10.2026; M5 S1 22.10.2026: limit 5 dni treningowych, bez okresu próbnego): ekran zakupu (stany: ładowanie, offline, błąd, zakupione; ceny
 * z App Store; nazwy i opisy planów; Przywróć zakupy; linki Prywatność + standardowa licencja Apple; powody otwarcia limit/settings), licznik na ekranie startu, karta „Subskrypcja” w Ustawieniach
 * (tylko przy PAYWALL.ENABLED), blokada startu ze wszystkich dróg UI, trening wstecz i dane przy wyczerpanym limicie, EN/PL, ciemny wygląd, VoiceOver, restart.
 * Sztuczny sklep w miejscu modułu natywnego (lib/store-fake.ts). Rodzaje (docs/20): ekran, scenariusz, języki i wygląd. E2E: .maestro/21.
 */
import { Linking } from 'react-native';
import * as store from '@/lib/store';
import { applyLang } from '@/lib/i18n';
import { PAYWALL, type Entitlement } from '@/lib/access';
import { PRIVACY_URL, TERMS_URL, PRODUCT_IDS } from '@/lib/products';
import { setStoreAdapter, resetStoreAdapterForTests } from '@/lib/store-adapter';
import { createFakeStore, FAKE_PRICES } from '@/lib/store-fake';
import { resetEntitlementsForTests } from '@/lib/entitlement';
import { fresh, saved, addWorkout, withDemoTemplates } from './helpers';
import { renderHook } from '@testing-library/react-native';
import { useAccess } from '@/lib/entitlement';
import { renderApp, flushAll, screen, tap, act, fromHome, startTpl } from './app';

const NOW = new Date(2026, 9, 14, 12, 0).getTime(); const DAY = 86400e3; const S = () => store.getState();
const sub = (end: number, extra: Partial<Entitlement> = {}): Entitlement => ({ plan: 'monthly', source: 'purchase', expiresAt: end, ...extra });
const life: Entitlement = { plan: 'lifetime', source: 'purchase', expiresAt: null };
let fake: ReturnType<typeof createFakeStore>;
const settle = async () => { for (let i = 0; i < 8; i++) await flushAll(10); };
/** n ukończonych treningów na żywo w n RÓŻNYCH dniach przed dzisiejszym (dzień treningowy = data startu; dziś bez treningu). */
const liveW = (n: number) => { for (let i = 0; i < n; i++) { const w = addWorkout(NOW - (i + 1) * DAY, [['Back Squat', [{ weight: 100, reps: 5, done: true }]]], 'Upper A'); w.live = true; w.tzOffsetMin = -new Date(w.startedAt).getTimezoneOffset(); store.recordLiveDayFor(w); } };
async function boot(opts: { on?: boolean; ents?: Entitlement[] | null; live?: number; url?: string; locale?: 'pl' | 'en'; theme?: 'dark'; tpl?: boolean; fn?: (f: typeof fake) => void } = {}) {
  jest.useFakeTimers({ now: NOW }); await fresh(undefined, opts.locale ?? 'pl'); resetEntitlementsForTests(); PAYWALL.ENABLED = opts.on !== false;
  fake = createFakeStore(opts.ents === undefined ? [] : opts.ents); opts.fn?.(fake); setStoreAdapter(fake);
  if (opts.tpl) withDemoTemplates(opts.locale ?? 'pl'); liveW(opts.live ?? 0); if (opts.theme) S().settings.theme = opts.theme; store.save(); await act(async () => { await store.flush(); });
  await renderApp({ saved: JSON.parse(JSON.stringify(saved())), locale: opts.locale ?? 'pl', url: opts.url ?? '/paywall?reason=settings' }); jest.setSystemTime(NOW); await settle();
}
afterEach(() => { PAYWALL.ENABLED = false; resetEntitlementsForTests(); resetStoreAdapterForTests(); applyLang('pl'); jest.restoreAllMocks(); jest.useRealTimers(); });
const txt = (s: string | RegExp) => screen.queryByText(s); const lbl = (s: string | RegExp) => screen.queryByLabelText(s);

describe('ekran zakupu: ceny, nazwy i opisy planów (bez okresu próbnego)', () => {
  test('EN: trzy plany w kolejności roczny, miesięczny, dożywotni; ceny dokładnie ze sklepu; nazwa, cena i opis w etykiecie VoiceOver; nagłówek z limitem 5 dni', async () => {
    await boot({ locale: 'en' });
    expect(require('expo-router/build/global-state/router-store').store.navigationRef.getCurrentOptions()?.title).toBe('Full version'); /* H1 zdublowany z nagłówkiem usunięty (N28) */
    const labels = ['yearly', 'monthly', 'lifetime'].map(p => screen.getByTestId(`plan-${p}`).props.accessibilityLabel);
    expect(labels).toEqual([`Training is part of my week, ${FAKE_PRICES.yearly}/year. A whole year of workouts, billed yearly.`, `Still finding my rhythm, ${FAKE_PRICES.monthly}/month. Pay month by month and stop whenever you like.`, `Training is my life, ${FAKE_PRICES.lifetime} one-time. Pay once, keep it forever.`]);
    expect(screen.getByText('Train 5 days a month for free. Pro removes the limit. Cancel anytime in your Apple account settings.')).toBeTruthy(); expect(screen.queryByText(/free trial|days free/i)).toBeNull();
    const order = screen.getAllByTestId(/^plan-/).map(n => n.props.testID); expect(order).toEqual(['plan-yearly', 'plan-monthly', 'plan-lifetime']);
    expect(screen.getByTestId('plan-yearly').props.accessibilityState.selected).toBe(true); expect(screen.getByTestId('plan-monthly').props.accessibilityState.selected).toBe(false);
    expect(screen.getByText('Subscribe')).toBeTruthy(); expect(screen.getByText('The subscription renews automatically until you cancel it in your Apple account settings.')).toBeTruthy();
    expect(screen.getByText('Without a purchase: up to 5 training days per month; history, backup and export always available.')).toBeTruthy();
    expect(screen.queryByTestId('paywall-limit')).toBeNull();
  });
  test('PL: teksty po polsku, okresy „miesiąc”/„rok”', async () => {
    await boot(); expect(screen.getByTestId('plan-monthly').props.accessibilityLabel).toBe(`Szukam swojego rytmu, ${FAKE_PRICES.monthly}/miesiąc. Płacisz co miesiąc i kończysz, kiedy chcesz.`);
    expect(screen.getByTestId('plan-yearly').props.accessibilityLabel).toBe(`Trening to część mojego tygodnia, ${FAKE_PRICES.yearly}/rok. Cały rok treningów, rozliczany rocznie.`); expect(screen.getByTestId('plan-lifetime').props.accessibilityLabel).toBe(`Trening to moje życie, ${FAKE_PRICES.lifetime} jednorazowo. Płacisz raz i masz na zawsze.`);
    expect(screen.getByText('Subskrybuj')).toBeTruthy(); expect(screen.getByText('Trenuj 5 dni w miesiącu za darmo. Pro zdejmuje limit. Anulujesz w ustawieniach konta Apple, kiedy zechcesz.')).toBeTruthy();
    expect(screen.getByText('Bez zakupu: do 5 dni treningowych w miesiącu; historia, kopia i eksport zawsze dostępne.')).toBeTruthy();
  });
  test('przycisk: „Subskrybuj” dla subskrypcji, „Kup na zawsze” dla planu dożywotniego; informacja o odnawianiu tylko przy subskrypcji', async () => {
    await boot({ locale: 'en' }); expect(screen.getByText('Subscribe')).toBeTruthy();
    await tap(screen.getByTestId('plan-lifetime')); expect(screen.getByText('Buy forever')).toBeTruthy(); expect(screen.queryByText('The subscription renews automatically until you cancel it in your Apple account settings.')).toBeNull();
    await tap(screen.getByTestId('plan-monthly')); expect(screen.getByTestId('plan-monthly').props.accessibilityState.selected).toBe(true); expect(screen.getByText('Subscribe')).toBeTruthy();
  });
  test('ładowanie cen: wskaźnik i tekst, przycisk zakupu jeszcze nie ma', async () => {
    await boot({ locale: 'en', fn: f => { f.getProducts = () => new Promise(() => {}); } }); expect(screen.getByTestId('paywall-loading')).toBeTruthy(); expect(screen.getByText('Loading prices…')).toBeTruthy(); expect(screen.queryByText('Subscribe')).toBeNull();
  });
  test('offline: „Ceny są niedostępne…” i „Spróbuj ponownie”; ponowienie po powrocie sieci pokazuje ceny; ceny z kodu nigdy', async () => {
    await boot({ locale: 'en', fn: f => { f.offline = true; } }); expect(screen.getByTestId('paywall-offline')).toBeTruthy(); expect(screen.getByText('Prices are unavailable without an internet connection.')).toBeTruthy();
    expect(screen.queryByTestId('plan-yearly')).toBeNull(); expect(screen.queryByText(/\$|zł/)).toBeNull();
    fake.offline = false; await tap(screen.getByText('Try again')); await settle(); expect(screen.getByTestId('plan-monthly')).toBeTruthy(); expect(screen.queryByTestId('paywall-offline')).toBeNull();
    expect(screen.getByText('Restore purchases')).toBeTruthy(); expect(screen.getByText('Redeem code')).toBeTruthy();
  });
  test('sklep nie zna naszych produktów (pusta lista) — osobny komunikat „Sklep chwilowo niedostępny” (M1-013, DEC-05), nie komunikat o braku internetu; „Spróbuj ponownie” działa', async () => {
    await boot({ locale: 'en', fn: f => { f.getProducts = async () => []; } }); expect(screen.getByTestId('paywall-empty')).toBeTruthy(); expect(screen.queryByText('Subscribe')).toBeNull();
    expect(screen.getByText('Store temporarily unavailable')).toBeTruthy(); expect(screen.queryByText('Prices are unavailable without an internet connection.')).toBeNull();
    expect(screen.getByText('Try again')).toBeTruthy();
  });
  test('brak sieci (stan „unavailable”) zostaje przy komunikacie o internecie, bez „Sklep chwilowo niedostępny” (M1-013)', async () => {
    await boot({ locale: 'en', fn: f => { f.offline = true; } }); expect(screen.getByTestId('paywall-offline')).toBeTruthy(); expect(screen.queryByText('Store temporarily unavailable')).toBeNull();
  });
});

describe('ekran zakupu: zakup, przywracanie, kod, linki', () => {
  test('wybór miesięcznego i zakup: wywołanie sklepu dla właściwego planu, stan „zakupione” z datą końca okresu i przyciskiem „Zarządzaj”; dane treningowe nietknięte', async () => {
    await boot({ locale: 'en', live: 2 }); const before = JSON.stringify(S().workouts);
    await tap(screen.getByTestId('plan-monthly')); await tap(screen.getByText('Subscribe')); await settle();
    expect(fake.calls.purchase).toBe(1); expect(fake.entitlements()![0].plan).toBe('monthly'); expect(screen.getByTestId('paywall-owned')).toBeTruthy(); expect(screen.getByText('Your plan: Still finding my rhythm')).toBeTruthy(); /* DEC-09 a, 27.10.2026 */
    expect(screen.getByText(/^Access until /)).toBeTruthy(); expect(screen.getByText('Manage subscription')).toBeTruthy(); expect(JSON.stringify(S().workouts)).toBe(before);
    await tap(screen.getByText('Manage subscription')); expect(fake.calls.manageSubscriptions).toBe(1);
  });
  test('po udanym zakupie ekran wraca na górę (karta „Masz plan: X” poza polem widzenia po zakupie z dołu — E2E 39825973624); anulowanie nie przewija', async () => {
    await boot({ locale: 'en' }); const spy = jest.fn();
    const proto = require('react-native').ScrollView.prototype; const orig = proto.scrollTo; proto.scrollTo = spy;
    try { fake.nextPurchase = 'cancelled'; await tap(screen.getByText('Subscribe')); await settle(); expect(spy).not.toHaveBeenCalled();
      await tap(screen.getByText('Subscribe')); await settle(); expect(screen.getByTestId('paywall-owned')).toBeTruthy(); expect(spy).toHaveBeenCalledWith({ y: 0, animated: false }); } finally { proto.scrollTo = orig; }
  }, 60000);
  test('anulowanie w oknie Apple: bez komunikatu i bez zmiany; oczekiwanie na zgodę (Ask to Buy): komunikat; błąd: alert „Nie udało się”', async () => {
    await boot({ locale: 'en' }); fake.nextPurchase = 'cancelled'; await tap(screen.getByText('Subscribe')); await settle(); expect(screen.queryByTestId('paywall-note')).toBeNull(); expect(screen.queryByTestId('paywall-owned')).toBeNull(); expect(global.__alerts).toHaveLength(0);
    fake.nextPurchase = 'pending'; await tap(screen.getByText('Subscribe')); await settle(); expect(screen.getByTestId('paywall-note').props.children).toBe('Waiting for approval from the family organizer.');
    fake.nextPurchase = 'error'; await tap(screen.getByText('Subscribe')); await settle(); expect(global.__alerts.find(a => a.title === "Couldn't complete the purchase")!.msg).toBe('Please try again.'); expect(fake.entitlements()).toEqual([]);
  });
  test('Przywróć zakupy: przywrócono / brak zakupów dla konta / błąd sieci (EN i PL), przycisk działa też bez cen (offline)', async () => {
    await boot({ locale: 'en' }); await tap(screen.getByText('Restore purchases')); await settle(); expect(screen.getByTestId('paywall-note').props.children).toBe('No purchases found for this Apple account.');
    fake.restorable = [life]; await tap(screen.getByText('Restore purchases')); await settle(); expect(screen.getByTestId('paywall-note').props.children).toBe('Purchases restored.'); expect(screen.getByText('You have access forever')).toBeTruthy();
    fake.offline = true; await tap(screen.getByText('Restore purchases')); await settle(); expect(screen.getByTestId('paywall-note').props.children).toBe("Couldn't restore purchases. Check your internet connection.");
    await boot({ locale: 'pl', fn: f => { f.offline = true; } }); await tap(screen.getByText('Przywróć zakupy')); await settle(); expect(screen.getByTestId('paywall-note').props.children).toBe('Nie udało się przywrócić zakupów. Sprawdź połączenie z internetem.');
    expect(screen.getByText('Zakupy są przypisane do konta Apple. Treningi przywrócisz z kopii zapasowej.')).toBeTruthy();
  });
  test('Zrealizuj kod: systemowe okno Apple, potem odświeżenie uprawnień; bez sieci — komunikat', async () => {
    await boot({ locale: 'en' }); const n = fake.calls.currentEntitlements; await tap(screen.getByText('Redeem code')); await settle(); expect(fake.calls.redeemCode).toBe(1); expect(fake.calls.currentEntitlements).toBeGreaterThan(n);
    fake.offline = true; await tap(screen.getByText('Redeem code')); await settle(); expect(screen.getByTestId('paywall-note').props.children).toBe('An internet connection is needed.');
  });
  test('linki: Prywatność i Warunki korzystania (standardowa licencja Apple) otwierają adresy z lib/products.ts; dostępne także bez cen', async () => {
    const open = jest.spyOn(Linking, 'openURL').mockResolvedValue(undefined as never);
    await boot({ locale: 'en', fn: f => { f.offline = true; } }); await tap(screen.getByText('Privacy')); await tap(screen.getByText('Terms of Use'));
    expect(open.mock.calls.map(c => c[0])).toEqual([PRIVACY_URL, TERMS_URL]); expect(screen.getByText('Privacy').props.accessibilityHint ?? screen.getByLabelText('Privacy').props.accessibilityHint).toBe('Opens the page in your browser.');
  });
});

describe('ekran zakupu: powód otwarcia', () => {
  const PROUD = "You've trained hard this month and used all 5 free training days. Good job!";
  const ABOUT = 'Training is made by an independent developer: no ads, no data collection. If it helps you, choose a plan to keep training without limits. Your free days come back on Sun 1 Nov.';
  test('limit (wariant B, 22.10.2026): pochwała, 5 darmowych dni, autor bez reklam i zbierania danych, data powrotu dni z i18n; „Dopisz trening wstecz” prowadzi do trybu wstecz', async () => {
    await boot({ locale: 'en', live: 5, url: '/paywall?reason=limit' });
    expect(screen.getByTestId('paywall-limit')).toBeTruthy(); expect(screen.getByText("We're proud of you!").props.accessibilityRole).toBe('header'); expect(screen.getByText(PROUD)).toBeTruthy(); expect(screen.getByText(ABOUT)).toBeTruthy();
    expect(screen.queryByTestId('paywall-headline')).toBeNull(); /* zamiast nagłówka z Ustawień */
    await tap(screen.getByText('Log a past workout')); await settle(); expect(screen.queryByTestId('paywall-limit')).toBeNull(); expect(screen.getByText('Empty workout')).toBeTruthy(); /* ekran „Trening wstecz” (app/history/add.tsx) */
  });
  test('limit (PL): te same trzy części po polsku, data 1. dnia następnego miesiąca', async () => {
    await boot({ locale: 'pl', live: 5, url: '/paywall?reason=limit' });
    expect(screen.getByText('Jesteśmy z Ciebie dumni!')).toBeTruthy(); expect(screen.getByText('W tym miesiącu ciężko trenujesz i wykorzystujesz wszystkie darmowe dni treningowe (5). Dobra robota!')).toBeTruthy();
    expect(screen.getByText(/^Trening tworzy niezależny deweloper: bez reklam, bez zbierania danych\. Jeśli Ci pomaga, wybierz plan i trenuj bez limitu\. Darmowe dni wracają .*1 lis/)).toBeTruthy();
  });
  test('limit: „Nie teraz” zamyka ekran; z Ustawień — nagłówek „Train 5 days a month for free…”, bez tekstu limitu i bez „Nie teraz”; nieznany powód (dawne first) = jak Ustawienia', async () => {
    await boot({ locale: 'en', live: 5, url: '/more/settings' }); const { router } = require('expo-router'); await act(async () => { router.push('/paywall?reason=limit'); }); await settle(); await tap(screen.getByText('Not now')); await settle(); expect(screen.queryByTestId('paywall-limit')).toBeNull(); expect(screen.getByLabelText(/^Full version\./)).toBeTruthy();
    await act(async () => { router.push('/paywall?reason=first'); }); await settle(); expect(screen.queryByTestId('paywall-limit')).toBeNull(); expect(screen.getByTestId('paywall-headline')).toBeTruthy(); expect(screen.queryByText('Not now')).toBeNull(); expect(screen.queryByText('Log a past workout')).toBeNull();
    await act(async () => { router.back(); }); await act(async () => { router.push('/paywall?reason=settings'); }); await settle(); expect(screen.queryByText('Not now')).toBeNull(); expect(screen.getByText('Train 5 days a month for free. Pro removes the limit. Cancel anytime in your Apple account settings.')).toBeTruthy();
  });
});

describe('ekran zakupu: stan „zakupione”', () => {
  test('dożywotni: „Masz dostęp na zawsze”, bez planów i bez „Zarządzaj”; dożywotni + aktywna subskrypcja: ostrzeżenie przed podwójną opłatą i „Zarządzaj”', async () => {
    await boot({ locale: 'en', ents: [life] }); expect(screen.getByText('You have access forever')).toBeTruthy(); expect(screen.queryByTestId('plan-yearly')).toBeNull(); expect(screen.queryByText('Manage subscription')).toBeNull(); expect(screen.queryByText(/still renews/)).toBeNull();
    expect(screen.getByText('Restore purchases')).toBeTruthy();
    await boot({ locale: 'en', ents: [life, sub(NOW + 9 * DAY)] }); expect(screen.getByText("Your subscription still renews — cancel it so you don't pay twice.")).toBeTruthy(); expect(screen.getByText('Manage subscription')).toBeTruthy();
  });
  test.each([
    ['subskrypcja', sub(NOW + 9 * DAY), /^Access until /], ['kod', sub(NOW + 9 * DAY, { source: 'code' }), /^Access from a code until /],
  ])('%s: plan z nazwą i datą końca; plany do zmiany pod „Zmień plan” (DEC-09 a, 27.10.2026: zwinięte)', async (_n, e, re) => {
    await boot({ locale: 'en', ents: [e as Entitlement] }); expect(screen.getByText('Your plan: Still finding my rhythm')).toBeTruthy(); expect(screen.getByText(re as RegExp)).toBeTruthy();
    expect(screen.queryByTestId('plan-yearly')).toBeNull(); await tap(screen.getByTestId('paywall-change-plan')); expect(screen.getByTestId('plan-yearly')).toBeTruthy();
  });
  test('Chmura rodzinna: „Dostęp z Chmury rodzinnej”', async () => { await boot({ locale: 'en', ents: [sub(NOW + 9 * DAY, { source: 'family' })] }); expect(screen.getByText('Access through Family Sharing')).toBeTruthy(); });
  test('wygasły dostęp po zdarzeniu transakcji: ekran wraca do planów bez restartu', async () => {
    await boot({ locale: 'en', ents: [life] }); expect(screen.getByTestId('paywall-owned')).toBeTruthy(); await act(async () => { fake.setEntitlements([]); }); await settle(); expect(screen.queryByTestId('paywall-owned')).toBeNull(); expect(screen.getByTestId('plan-monthly')).toBeTruthy();
  });
});

describe('ekran zakupu: posiadany plan subskrypcji (27.10.2026, uwaga z telefonu: build 1031; DEC-09 a: lista pod „Zmień plan”, tu po rozwinięciu)', () => {
  const yearSub = (end: number): Entitlement => ({ plan: 'yearly', source: 'purchase', expiresAt: end });
  const expand = async () => { await tap(screen.getByTestId('paywall-change-plan')); };
  test('miesięczny aktywny (EN): bez wstępu o darmowych dniach, karta z nazwą planu, „Current plan” przy miesięcznym, miesięczny niewybieralny, domyślnie roczny z „Change plan”', async () => {
    await boot({ locale: 'en', ents: [sub(NOW + 9 * DAY)] });
    expect(screen.queryByTestId('paywall-headline')).toBeNull(); expect(screen.queryByText(/^Train 5 days a month for free/)).toBeNull(); expect(screen.queryByText(/^Without a purchase/)).toBeNull();
    expect(screen.getByTestId('paywall-owned-title').props.children).toBe('Your plan: Still finding my rhythm'); await expand();
    const m = screen.getByTestId('plan-monthly'); expect(m.props.accessibilityState).toEqual({ selected: false, disabled: true }); expect(m.props.accessibilityLabel).toMatch(/Current plan$/); expect(screen.getByTestId('plan-monthly-own')).toBeTruthy();
    expect(screen.getByTestId('plan-yearly').props.accessibilityState).toEqual({ selected: true, disabled: false }); expect(screen.queryByTestId('plan-yearly-own')).toBeNull();
    expect(screen.queryByText('Subscribe')).toBeNull(); expect(screen.getByText('Switch to this plan')).toBeTruthy(); expect(screen.getByText('The subscription renews automatically until you cancel it in your Apple account settings.')).toBeTruthy();
  });
  test('stuknięcie posiadanego planu nic nie zaznacza i nie kupuje; „Switch to this plan” kupuje wybrany inny plan; dożywotni nadal „Buy forever”', async () => {
    await boot({ locale: 'en', ents: [sub(NOW + 9 * DAY)] }); await expand();
    await tap(screen.getByTestId('plan-monthly')); expect(screen.getByTestId('plan-yearly').props.accessibilityState.selected).toBe(true); expect(screen.getByTestId('plan-monthly').props.accessibilityState.selected).toBe(false);
    await tap(screen.getByTestId('plan-lifetime')); expect(screen.getByText('Buy forever')).toBeTruthy(); await tap(screen.getByTestId('plan-yearly')); expect(fake.calls.purchase).toBe(0);
    await tap(screen.getByText('Switch to this plan')); await settle(); expect(fake.calls.purchase).toBe(1); expect(fake.entitlements()!.map(e => e.plan)).toEqual(['yearly']);
    expect(screen.getByTestId('paywall-owned-title').props.children).toBe('Your plan: Training is part of my week'); expect(screen.queryByTestId('plan-yearly')).toBeNull(); /* po zmianie lista zwinięta */
    await expand(); expect(screen.getByTestId('plan-yearly-own')).toBeTruthy(); expect(screen.queryByTestId('plan-monthly-own')).toBeNull();
    expect(screen.getByTestId('plan-monthly').props.accessibilityState.selected).toBe(true); /* zaznaczenie przeskakuje na pierwszy plan do wyboru */
  });
  test('roczny aktywny (PL): „Aktualny plan” przy rocznym, domyślnie zaznaczony miesięczny, przycisk „Przejdź na ten plan”, nazwa planu w nagłówku karty', async () => {
    await boot({ locale: 'pl', ents: [yearSub(NOW + 200 * DAY)] });
    expect(screen.getByTestId('paywall-owned-title').props.children).toBe('Masz plan: Trening to część mojego tygodnia'); expect(screen.queryByText(/^Trenuj 5 dni w miesiącu za darmo/)).toBeNull(); await expand();
    expect(screen.getByTestId('plan-yearly').props.accessibilityState).toEqual({ selected: false, disabled: true }); expect(screen.getByTestId('plan-yearly').props.accessibilityLabel).toMatch(/Aktualny plan$/);
    expect(screen.getByTestId('plan-monthly').props.accessibilityState.selected).toBe(true); expect(screen.getByText('Przejdź na ten plan')).toBeTruthy(); expect(screen.queryByText('Subskrybuj')).toBeNull();
  });
  test('bez dostępu: wstęp o darmowych dniach, brak „Aktualny plan”, „Subscribe”, domyślnie roczny (stan sprzed zakupu bez zmian)', async () => {
    await boot({ locale: 'en' }); expect(screen.getByTestId('paywall-headline')).toBeTruthy(); expect(screen.queryByTestId('plan-yearly-own')).toBeNull(); expect(screen.queryByTestId('plan-monthly-own')).toBeNull(); expect(screen.queryByTestId('paywall-owned-title')).toBeNull();
    expect(screen.getByText('Subscribe')).toBeTruthy(); expect(screen.queryByText('Change plan')).toBeNull(); expect(screen.getByTestId('plan-yearly').props.accessibilityState.selected).toBe(true);
    expect(screen.getByText(/^Without a purchase/)).toBeTruthy();
  });
  test('kod promocyjny (źródło „code”): plan też oznaczony jako aktualny i niewybieralny', async () => {
    await boot({ locale: 'en', ents: [sub(NOW + 9 * DAY, { source: 'code' })] }); await expand(); expect(screen.getByTestId('plan-monthly-own')).toBeTruthy(); expect(screen.getByTestId('plan-monthly').props.accessibilityState.disabled).toBe(true);
  });
  test('dożywotni: lista planów ukryta jak dotąd, bez „Zmień plan”; nagłówek z nazwą planu', async () => {
    await boot({ locale: 'en', ents: [life] }); expect(screen.queryByTestId('plan-yearly')).toBeNull(); expect(screen.queryByTestId('paywall-change-plan')).toBeNull(); expect(screen.getByTestId('paywall-owned-title').props.children).toBe('Your plan: Training is my life'); expect(screen.queryByText(/^Train 5 days a month for free/)).toBeNull();
  });
});

describe('Ustawienia: karta „Subskrypcja”', () => {
  test('przełącznik wyłączony: karty nie ma (Ustawienia jak przed 0.17); sklep nietknięty', async () => {
    await boot({ on: false, locale: 'en', url: '/more/settings' }); expect(txt(/^Subscription$/i)).toBeNull(); expect(lbl(/^Full version/)).toBeNull(); expect(fake.calls.currentEntitlements).toBe(0);
  });
  test('przełącznik włączony, darmowy: licznik „Free training days this month: 2 of 5 used”, wejście na ekran zakupu; PL', async () => {
    await boot({ locale: 'en', live: 2, url: '/more/settings' }); expect(screen.getByText('Subscription')).toBeTruthy(); expect(lbl('Full version. Free training days this month: 2 of 5 used')).toBeTruthy();
    await tap(screen.getByLabelText('Full version. Free training days this month: 2 of 5 used')); await settle(); expect(screen.getByTestId('plan-yearly')).toBeTruthy();
    await boot({ locale: 'pl', live: 1, url: '/more/settings' }); expect(lbl('Pełna wersja. Darmowe dni treningowe w tym miesiącu: wykorzystano 1 z 5')).toBeTruthy();
  });
  test.each([
    ['dożywotni', life, 'Full version. You have access forever'], ['subskrypcja', sub(NOW + 9 * DAY), /^Full version\. Access until /],
  ])('karta przy pełnym dostępie (%s)', async (_n, e, want) => { await boot({ locale: 'en', ents: [e as Entitlement], url: '/more/settings' }); expect(screen.getByLabelText(want as string | RegExp)).toBeTruthy(); expect(screen.queryByText(/Free training days this month/)).toBeNull(); });
  test('ciemny wygląd: karta i ekran zakupu renderują się bez błędu', async () => { await boot({ locale: 'en', theme: 'dark', url: '/more/settings' }); expect(screen.getByText('Subscription')).toBeTruthy(); await tap(screen.getByLabelText(/^Full version\./)); await settle(); expect(screen.getByTestId('plan-yearly')).toBeTruthy(); });
});

describe('blokada startu ze wszystkich dróg w interfejsie', () => {
  test('limit wyczerpany: „Pusty trening”, start z szablonu i „Powtórz ostatni” otwierają ekran zakupu, trening w toku się nie tworzy', async () => {
    await boot({ locale: 'en', live: 5, tpl: true, url: '/' });
    await fromHome('Empty workout'); await settle(); expect(S().active).toBeNull(); expect(screen.getByTestId('paywall-limit')).toBeTruthy();
    await act(async () => { require('expo-router').router.back(); }); await settle();
    await startTpl('Upper A'); await settle(); expect(S().active).toBeNull(); expect(screen.getByTestId('paywall-limit')).toBeTruthy();
    await act(async () => { require('expo-router').router.dismissAll?.(); require('expo-router').router.replace('/'); }); await settle();
    await fromHome(/^Repeat last/); await settle(); expect(S().active).toBeNull(); expect(screen.getByTestId('paywall-limit')).toBeTruthy();
  });
  test('trening wstecz i historia przy wyczerpanym limicie: dostępne; kopia zapasowa dostępna', async () => {
    await boot({ locale: 'en', live: 5, url: '/history/add' }); expect(screen.getByText('Empty workout')).toBeTruthy(); expect(S().workouts).toHaveLength(5);
    await act(async () => { require('expo-router').router.replace('/more/backup'); }); await settle(); expect(screen.getByText('Export backup (JSON file)')).toBeTruthy();
  });
  test('przełącznik wyłączony: te same drogi startują normalnie (zachowanie bez zmian)', async () => {
    await boot({ on: false, locale: 'en', live: 9, tpl: true, url: '/' }); await fromHome('Empty workout'); await settle(); expect(S().active).not.toBeNull(); expect(screen.queryByTestId('paywall-limit')).toBeNull(); expect(fake.calls.currentEntitlements).toBe(0);
  });
  test('5 dni treningowych → szósty dzień zablokowany; po zakupie ten sam start działa bez restartu aplikacji (nasłuch)', async () => {
    await boot({ locale: 'en', live: 5, url: '/' }); await fromHome('Empty workout'); await settle(); expect(S().active).toBeNull();
    await act(async () => { await fake.purchase('yearly'); }); await settle(); expect(screen.getByTestId('paywall-owned')).toBeTruthy();
    await act(async () => { require('expo-router').router.replace('/'); }); await settle(); await fromHome('Empty workout'); await settle(); expect(S().active).not.toBeNull();
  });
  test('restart aplikacji po zakupie bez sieci: zapamiętany pełny dostęp pozwala startować', async () => {
    await boot({ locale: 'en', ents: [sub(NOW + 9 * DAY)], live: 6, url: '/' }); const kv = global.__kv.get('access')!; expect(kv).toBeTruthy();
    resetEntitlementsForTests(); fake = createFakeStore(null); setStoreAdapter(fake); await renderApp({ saved: JSON.parse(JSON.stringify(saved())), locale: 'en', url: '/', kv: { access: kv } }); jest.setSystemTime(NOW); await settle();
    await fromHome('Empty workout'); await settle(); expect(S().active).not.toBeNull();
  });
});

describe('useAccess (hook widoku)', () => {
  test('odzwierciedla stan sklepu i licznik treningów; po zdarzeniu transakcji odświeża się bez restartu', async () => {
    await boot({ locale: 'en', live: 3, url: '/' }); const h = renderHook(() => useAccess());
    expect(h.result.current).toMatchObject({ enabled: true, level: 'free' }); expect(h.result.current.decision).toMatchObject({ used: 3, remaining: 2, limit: 5, allowed: true });
    await act(async () => { fake.setEntitlements([life]); }); await settle(); expect(h.result.current).toMatchObject({ level: 'full', active: expect.objectContaining({ plan: 'lifetime' }) }); h.unmount();
  });
});

describe('ekran startu: licznik darmowych dni treningowych', () => {
  test('free: „5 of 5…” bez treningów, „3 of 5 free training days left this month” po 2 dniach (EN), po polsku z odmianą (Zostały 3 / Został 1 / Zostało 0); testID start-free-days', async () => {
    await boot({ locale: 'en', live: 0, url: '/' }); expect(screen.getByTestId('start-free-days').props.children).toBe('5 of 5 free training days left this month.');
    await boot({ locale: 'en', live: 2, url: '/' }); expect(screen.getByTestId('start-free-days').props.children).toBe('3 of 5 free training days left this month.');
    await boot({ locale: 'pl', live: 2, url: '/' }); expect(screen.getByTestId('start-free-days').props.children).toBe('Zostały 3 z 5 darmowych dni treningowych w tym miesiącu.');
    await boot({ locale: 'pl', live: 4, url: '/' }); expect(screen.getByTestId('start-free-days').props.children).toBe('Został 1 z 5 darmowych dni treningowych w tym miesiącu.');
    await boot({ locale: 'pl', live: 5, url: '/' }); expect(screen.getByTestId('start-free-days').props.children).toBe('Zostało 0 z 5 darmowych dni treningowych w tym miesiącu.');
  });
  test('limit wyczerpany: „0 of 5…”', async () => {
    await boot({ locale: 'en', live: 5, url: '/' }); expect(screen.getByTestId('start-free-days').props.children).toBe('0 of 5 free training days left this month.');
  });
  test('nie pokazuje się: pełny dostęp (subskrypcja, dożywotni), przełącznik wyłączony, sklep bez odpowiedzi i bez zapamiętanego wyniku, trening w toku', async () => {
    await boot({ locale: 'en', ents: [life], url: '/' }); expect(screen.queryByTestId('start-free-days')).toBeNull();
    await boot({ locale: 'en', ents: [sub(NOW + 9 * DAY)], live: 3, url: '/' }); expect(screen.queryByTestId('start-free-days')).toBeNull();
    await boot({ on: false, locale: 'en', url: '/' }); expect(screen.queryByTestId('start-free-days')).toBeNull();
    await boot({ locale: 'en', ents: null, url: '/' }); expect(screen.queryByTestId('start-free-days')).toBeNull();
    await boot({ locale: 'en', tpl: true, url: '/' }); await fromHome('Empty workout'); await settle(); expect(S().active).not.toBeNull();
    await act(async () => { require('expo-router').router.replace('/'); }); await settle(); expect(screen.queryByTestId('start-free-days')).toBeNull();
  });
});
