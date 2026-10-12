/*
 * 0.17.0, subskrypcja — EKRANY (docs/27 rozdz. 5, 9; decyzje właściciela 12.10.2026): ekran zakupu (stany: ładowanie, offline, błąd, zakupione; ceny z App Store; miesiąc za
 * darmo tylko dla uprawnionych; Przywróć zakupy; linki Prywatność + standardowa licencja Apple; powody otwarcia limit/first/settings), karta „Subskrypcja” w Ustawieniach
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
const liveW = (n: number) => { for (let i = 0; i < n; i++) { const w = addWorkout(NOW - 3600e3 - i * 60e3, [['Back Squat', [{ weight: 100, reps: 5, done: true }]]], 'Upper A'); w.live = true; } };
async function boot(opts: { on?: boolean; ents?: Entitlement[] | null; live?: number; url?: string; locale?: 'pl' | 'en'; theme?: 'dark'; tpl?: boolean; fn?: (f: typeof fake) => void } = {}) {
  jest.useFakeTimers({ now: NOW }); await fresh(undefined, opts.locale ?? 'pl'); resetEntitlementsForTests(); PAYWALL.ENABLED = opts.on !== false;
  fake = createFakeStore(opts.ents === undefined ? [] : opts.ents); opts.fn?.(fake); setStoreAdapter(fake);
  if (opts.tpl) withDemoTemplates(opts.locale ?? 'pl'); liveW(opts.live ?? 0); if (opts.theme) S().settings.theme = opts.theme; store.save(); await act(async () => { await store.flush(); });
  await renderApp({ saved: JSON.parse(JSON.stringify(saved())), locale: opts.locale ?? 'pl', url: opts.url ?? '/paywall?reason=settings' }); jest.setSystemTime(NOW); await settle();
}
afterEach(() => { PAYWALL.ENABLED = false; resetEntitlementsForTests(); resetStoreAdapterForTests(); applyLang('pl'); jest.restoreAllMocks(); jest.useRealTimers(); });
const txt = (s: string | RegExp) => screen.queryByText(s); const lbl = (s: string | RegExp) => screen.queryByLabelText(s);

describe('ekran zakupu: ceny, plany, miesiąc za darmo', () => {
  test('EN, kwalifikacja do próby: trzy plany w kolejności roczny, miesięczny, na zawsze; ceny dokładnie ze sklepu; tekst „1 month free, then …”; cena po próbie w etykiecie VoiceOver', async () => {
    await boot({ locale: 'en' });
    expect(screen.getByText('Full version')).toBeTruthy();
    const labels = ['yearly', 'monthly', 'lifetime'].map(p => screen.getByTestId(`plan-${p}`).props.accessibilityLabel);
    expect(labels).toEqual([`Yearly, 1 month free, then ${FAKE_PRICES.yearly}/year`, `Monthly, 1 month free, then ${FAKE_PRICES.monthly}/month`, `Forever, ${FAKE_PRICES.lifetime} one-time`]);
    const order = screen.getAllByTestId(/^plan-/).map(n => n.props.testID); expect(order).toEqual(['plan-yearly', 'plan-monthly', 'plan-lifetime']);
    expect(screen.getByTestId('plan-yearly').props.accessibilityState.selected).toBe(true); expect(screen.getByTestId('plan-monthly').props.accessibilityState.selected).toBe(false);
    expect(screen.getByText('Start your free month')).toBeTruthy(); expect(screen.getByText('The subscription renews automatically until you cancel it in your Apple account settings.')).toBeTruthy();
    expect(screen.getByText('Without a purchase: 4 live workouts per month; history, backup and export are always available.')).toBeTruthy();
    expect(screen.queryByTestId('paywall-limit')).toBeNull();
  });
  test('PL: teksty po polsku, okresy „miesiąc”/„rok”', async () => {
    await boot(); expect(screen.getByTestId('plan-monthly').props.accessibilityLabel).toBe(`Miesięcznie, 1 miesiąc za darmo, potem ${FAKE_PRICES.monthly}/miesiąc`);
    expect(screen.getByTestId('plan-yearly').props.accessibilityLabel).toBe(`Rocznie, 1 miesiąc za darmo, potem ${FAKE_PRICES.yearly}/rok`); expect(screen.getByTestId('plan-lifetime').props.accessibilityLabel).toBe(`Na zawsze, ${FAKE_PRICES.lifetime} jednorazowo`);
    expect(screen.getByText('Zacznij miesiąc za darmo')).toBeTruthy(); expect(screen.getByText('Bez zakupu: 4 treningi na żywo w miesiącu; historia, kopia zapasowa i eksport są zawsze dostępne.')).toBeTruthy();
  });
  test('próba wykorzystana (brak kwalifikacji): bez „za darmo”, przycisk „Subskrybuj”; plan na zawsze: „Kup na zawsze”', async () => {
    await boot({ locale: 'en', fn: f => { f.trialEligible = false; } }); expect(screen.getByTestId('plan-yearly').props.accessibilityLabel).toBe(`Yearly, ${FAKE_PRICES.yearly}/year`);
    expect(screen.queryByText(/free/)).toBeNull(); expect(screen.getByText('Subscribe')).toBeTruthy();
    await tap(screen.getByTestId('plan-lifetime')); expect(screen.getByText('Buy forever')).toBeTruthy(); expect(screen.queryByText('The subscription renews automatically until you cancel it in your Apple account settings.')).toBeNull();
    await tap(screen.getByTestId('plan-monthly')); expect(screen.getByTestId('plan-monthly').props.accessibilityState.selected).toBe(true); expect(screen.getByText('Subscribe')).toBeTruthy();
  });
  test('ładowanie cen: wskaźnik i tekst, przycisk zakupu jeszcze nie ma', async () => {
    await boot({ locale: 'en', fn: f => { f.getProducts = () => new Promise(() => {}); } }); expect(screen.getByTestId('paywall-loading')).toBeTruthy(); expect(screen.getByText('Loading prices…')).toBeTruthy(); expect(screen.queryByText('Start your free month')).toBeNull();
  });
  test('offline: „Ceny są niedostępne…” i „Spróbuj ponownie”; ponowienie po powrocie sieci pokazuje ceny; ceny z kodu nigdy', async () => {
    await boot({ locale: 'en', fn: f => { f.offline = true; } }); expect(screen.getByTestId('paywall-offline')).toBeTruthy(); expect(screen.getByText('Prices are unavailable without an internet connection.')).toBeTruthy();
    expect(screen.queryByTestId('plan-yearly')).toBeNull(); expect(screen.queryByText(/\$|zł/)).toBeNull();
    fake.offline = false; await tap(screen.getByText('Try again')); await settle(); expect(screen.getByTestId('plan-monthly')).toBeTruthy(); expect(screen.queryByTestId('paywall-offline')).toBeNull();
    expect(screen.getByText('Restore purchases')).toBeTruthy(); expect(screen.getByText('Redeem code')).toBeTruthy();
  });
  test('sklep nie zna naszych produktów (pusta lista) — komunikat jak offline', async () => {
    await boot({ locale: 'en', fn: f => { f.getProducts = async () => []; } }); expect(screen.getByTestId('paywall-empty')).toBeTruthy(); expect(screen.queryByText('Start your free month')).toBeNull();
  });
});

describe('ekran zakupu: zakup, przywracanie, kod, linki', () => {
  test('wybór miesięcznego i zakup: wywołanie sklepu dla właściwego planu, stan „zakupione” z datą końca próby i przyciskiem „Zarządzaj”; dane treningowe nietknięte', async () => {
    await boot({ locale: 'en', live: 2 }); const before = JSON.stringify(S().workouts);
    await tap(screen.getByTestId('plan-monthly')); await tap(screen.getByText('Start your free month')); await settle();
    expect(fake.calls.purchase).toBe(1); expect(fake.entitlements()![0].plan).toBe('monthly'); expect(screen.getByTestId('paywall-owned')).toBeTruthy(); expect(screen.getByText('You have the full version')).toBeTruthy();
    expect(screen.getByText(/^Free trial until /)).toBeTruthy(); expect(screen.getByText('Manage subscription')).toBeTruthy(); expect(JSON.stringify(S().workouts)).toBe(before);
    await tap(screen.getByText('Manage subscription')); expect(fake.calls.manageSubscriptions).toBe(1);
  });
  test('anulowanie w oknie Apple: bez komunikatu i bez zmiany; oczekiwanie na zgodę (Ask to Buy): komunikat; błąd: alert „Nie udało się”', async () => {
    await boot({ locale: 'en' }); fake.nextPurchase = 'cancelled'; await tap(screen.getByText('Start your free month')); await settle(); expect(screen.queryByTestId('paywall-note')).toBeNull(); expect(screen.queryByTestId('paywall-owned')).toBeNull(); expect(global.__alerts).toHaveLength(0);
    fake.nextPurchase = 'pending'; await tap(screen.getByText('Start your free month')); await settle(); expect(screen.getByTestId('paywall-note').props.children).toBe('Waiting for approval from the family organizer.');
    fake.nextPurchase = 'error'; await tap(screen.getByText('Start your free month')); await settle(); expect(global.__alerts.find(a => a.title === 'Something went wrong')!.msg).toBe('Please try again.'); expect(fake.entitlements()).toEqual([]);
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
  test('limit: nagłówek z liczbą i datą odnowienia, „Dopisz trening wstecz” prowadzi do trybu wstecz, „Nie teraz” wraca', async () => {
    await boot({ locale: 'en', live: 4, url: '/paywall?reason=limit' });
    expect(screen.getByTestId('paywall-limit').props.children).toBe("You've used this month's free workouts (4). More from Sun 1 Nov."); expect(screen.getByTestId('paywall-limit').props.accessibilityRole).toBe('header');
    await tap(screen.getByText('Log a past workout')); await settle(); expect(screen.queryByTestId('paywall-limit')).toBeNull(); expect(screen.getByText('Empty workout')).toBeTruthy(); /* ekran „Trening wstecz” (app/history/add.tsx) */
  });
  test('limit: „Nie teraz” zamyka ekran; first i settings — bez nagłówka limitu; first ma „Nie teraz”, settings nie', async () => {
    await boot({ locale: 'en', live: 4, url: '/more/settings' }); const { router } = require('expo-router'); await act(async () => { router.push('/paywall?reason=limit'); }); await settle(); await tap(screen.getByText('Not now')); await settle(); expect(screen.queryByTestId('paywall-limit')).toBeNull(); expect(screen.getByLabelText(/^Full version\./)).toBeTruthy();
    await act(async () => { router.push('/paywall?reason=first'); }); await settle(); expect(screen.queryByTestId('paywall-limit')).toBeNull(); expect(screen.getByText('Not now')).toBeTruthy(); expect(screen.queryByText('Log a past workout')).toBeNull();
    await act(async () => { router.back(); }); await act(async () => { router.push('/paywall?reason=settings'); }); await settle(); expect(screen.queryByText('Not now')).toBeNull();
  });
});

describe('ekran zakupu: stan „zakupione”', () => {
  test('dożywotni: „Masz dostęp na zawsze”, bez planów i bez „Zarządzaj”; dożywotni + aktywna subskrypcja: ostrzeżenie przed podwójną opłatą i „Zarządzaj”', async () => {
    await boot({ locale: 'en', ents: [life] }); expect(screen.getByText('You have access forever')).toBeTruthy(); expect(screen.queryByTestId('plan-yearly')).toBeNull(); expect(screen.queryByText('Manage subscription')).toBeNull(); expect(screen.queryByText(/still renews/)).toBeNull();
    expect(screen.getByText('Restore purchases')).toBeTruthy();
    await boot({ locale: 'en', ents: [life, sub(NOW + 9 * DAY)] }); expect(screen.getByText("Your subscription still renews — cancel it so you don't pay twice.")).toBeTruthy(); expect(screen.getByText('Manage subscription')).toBeTruthy();
  });
  test.each([
    ['okres próbny', sub(NOW + 9 * DAY, { trial: true }), /^Free trial until /], ['subskrypcja', sub(NOW + 9 * DAY), /^Access until /], ['kod', sub(NOW + 9 * DAY, { source: 'code' }), /^Access from a code until /],
  ])('%s: pełna wersja z datą końca; plany do zmiany nadal widoczne', async (_n, e, re) => {
    await boot({ locale: 'en', ents: [e as Entitlement] }); expect(screen.getByText('You have the full version')).toBeTruthy(); expect(screen.getByText(re as RegExp)).toBeTruthy(); expect(screen.getByTestId('plan-yearly')).toBeTruthy();
  });
  test('Chmura rodzinna: „Dostęp z Chmury rodzinnej”', async () => { await boot({ locale: 'en', ents: [sub(NOW + 9 * DAY, { source: 'family' })] }); expect(screen.getByText('Access through Family Sharing')).toBeTruthy(); });
  test('wygasły dostęp po zdarzeniu transakcji: ekran wraca do planów bez restartu', async () => {
    await boot({ locale: 'en', ents: [life] }); expect(screen.getByTestId('paywall-owned')).toBeTruthy(); await act(async () => { fake.setEntitlements([]); }); await settle(); expect(screen.queryByTestId('paywall-owned')).toBeNull(); expect(screen.getByTestId('plan-monthly')).toBeTruthy();
  });
});

describe('Ustawienia: karta „Subskrypcja”', () => {
  test('przełącznik wyłączony: karty nie ma (Ustawienia jak przed 0.17); sklep nietknięty', async () => {
    await boot({ on: false, locale: 'en', url: '/more/settings' }); expect(txt(/^Subscription$/i)).toBeNull(); expect(lbl(/^Full version/)).toBeNull(); expect(fake.calls.currentEntitlements).toBe(0);
  });
  test('przełącznik włączony, darmowy: licznik „Free workouts this month: 2 of 4”, wejście na ekran zakupu; PL', async () => {
    await boot({ locale: 'en', live: 2, url: '/more/settings' }); expect(screen.getByText('Subscription')).toBeTruthy(); expect(lbl('Full version. Free workouts this month: 2 of 4')).toBeTruthy();
    await tap(screen.getByLabelText('Full version. Free workouts this month: 2 of 4')); await settle(); expect(screen.getByTestId('plan-yearly')).toBeTruthy();
    await boot({ locale: 'pl', live: 1, url: '/more/settings' }); expect(lbl('Pełna wersja. Darmowe treningi w tym miesiącu: 1 z 4')).toBeTruthy();
  });
  test.each([
    ['dożywotni', life, 'Full version. You have access forever'], ['okres próbny', sub(NOW + 9 * DAY, { trial: true }), /^Full version\. Free trial until /], ['subskrypcja', sub(NOW + 9 * DAY), /^Full version\. Access until /],
  ])('karta przy pełnym dostępie (%s)', async (_n, e, want) => { await boot({ locale: 'en', ents: [e as Entitlement], url: '/more/settings' }); expect(screen.getByLabelText(want as string | RegExp)).toBeTruthy(); expect(screen.queryByText(/Free workouts this month/)).toBeNull(); });
  test('ciemny wygląd: karta i ekran zakupu renderują się bez błędu', async () => { await boot({ locale: 'en', theme: 'dark', url: '/more/settings' }); expect(screen.getByText('Subscription')).toBeTruthy(); await tap(screen.getByLabelText(/^Full version\./)); await settle(); expect(screen.getByTestId('plan-yearly')).toBeTruthy(); });
});

describe('blokada startu ze wszystkich dróg w interfejsie', () => {
  test('limit wyczerpany: „Pusty trening”, start z szablonu i „Powtórz ostatni” otwierają ekran zakupu, trening w toku się nie tworzy', async () => {
    await boot({ locale: 'en', live: 4, tpl: true, url: '/' });
    await fromHome('Empty workout'); await settle(); expect(S().active).toBeNull(); expect(screen.getByTestId('paywall-limit')).toBeTruthy();
    await act(async () => { require('expo-router').router.back(); }); await settle();
    await startTpl('Upper A'); await settle(); expect(S().active).toBeNull(); expect(screen.getByTestId('paywall-limit')).toBeTruthy();
    await act(async () => { require('expo-router').router.dismissAll?.(); require('expo-router').router.replace('/'); }); await settle();
    await fromHome(/^Repeat last/); await settle(); expect(S().active).toBeNull(); expect(screen.getByTestId('paywall-limit')).toBeTruthy();
  });
  test('trening wstecz i historia przy wyczerpanym limicie: dostępne; kopia zapasowa dostępna', async () => {
    await boot({ locale: 'en', live: 4, url: '/history/add' }); expect(screen.getByText('Empty workout')).toBeTruthy(); expect(S().workouts).toHaveLength(4);
    await act(async () => { require('expo-router').router.replace('/more/backup'); }); await settle(); expect(screen.getByText('Export backup (JSON file)')).toBeTruthy();
  });
  test('przełącznik wyłączony: te same drogi startują normalnie (zachowanie bez zmian)', async () => {
    await boot({ on: false, locale: 'en', live: 9, tpl: true, url: '/' }); await fromHome('Empty workout'); await settle(); expect(S().active).not.toBeNull(); expect(screen.queryByTestId('paywall-limit')).toBeNull(); expect(fake.calls.currentEntitlements).toBe(0);
  });
  test('4 treningi → piąty zablokowany; po zakupie ten sam start działa bez restartu aplikacji (nasłuch)', async () => {
    await boot({ locale: 'en', live: 4, url: '/' }); await fromHome('Empty workout'); await settle(); expect(S().active).toBeNull();
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
    expect(h.result.current).toMatchObject({ enabled: true, level: 'free' }); expect(h.result.current.decision).toMatchObject({ used: 3, remaining: 1, limit: 4, allowed: true });
    await act(async () => { fake.setEntitlements([life]); }); await settle(); expect(h.result.current).toMatchObject({ level: 'full', active: expect.objectContaining({ plan: 'lifetime' }) }); h.unmount();
  });
});
