/*
 * M1-audytor-generalny-010 (audyt 1.0, 27.10.2026; 02-monetyzacja-001, 02-monetyzacja-504, 04-studio-projektowe-001, 08-programista-002, 03-zakres-005,
 * 07-jakosc-003; T-11 z telefonu, build 1031). Decyzja właściciela DEC-09 a (27.10.2026): przy aktywnym planie ekran „Pełna wersja” pokazuje stan
 * „Masz plan: {rodzaj planu}” (np. „Masz plan: roczny” — 1A, właściciel 28.10.2026) zamiast oferty — bez wstępu o darmowych dniach, bez „Subskrybuj” przy posiadanym planie, zmiana planu ZWINIĘTA pod przyciskiem
 * „Zmień plan” (wzorzec 20 docs/32: `expanded`, etykieta stała, stan niezapamiętywany). BRD: BR-ZAK-003. Rodzaje (docs/20): ekran, języki (PL, EN), VoiceOver.
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
const ent = (plan: Entitlement['plan'], extra: Partial<Entitlement> = {}): Entitlement => ({ plan, source: 'purchase', expiresAt: plan === 'lifetime' ? null : NOW + 9 * DAY, ...extra });
let fake: ReturnType<typeof createFakeStore>;
const settle = async () => { for (let i = 0; i < 8; i++) await flushAll(10); };
async function boot(ents: Entitlement[], locale: 'pl' | 'en' = 'en') {
  jest.useFakeTimers({ now: NOW }); await fresh(undefined, locale); resetEntitlementsForTests(); PAYWALL.ENABLED = true;
  fake = createFakeStore(ents); setStoreAdapter(fake); store.save(); await act(async () => { await store.flush(); });
  await renderApp({ saved: JSON.parse(JSON.stringify(saved())), locale, url: '/paywall?reason=settings' }); jest.setSystemTime(NOW); await settle();
}
afterEach(() => { PAYWALL.ENABLED = false; resetEntitlementsForTests(); resetStoreAdapterForTests(); applyLang('pl'); jest.useRealTimers(); });
const NAME_EN = { monthly: 'monthly', yearly: 'yearly', lifetime: 'lifetime' } as const; /* rodzaj planu, nie nazwa z wyboru (DEC-09 a + 1A, właściciel 28.10.2026) */
const PLANS = ['yearly', 'monthly', 'lifetime'] as const;
const noOffer = () => {
  expect(screen.queryByTestId('paywall-headline')).toBeNull(); expect(screen.queryByText(/^Train 5 days a month for free/)).toBeNull();
  for (const p of PLANS) expect(screen.queryByTestId(`plan-${p}`)).toBeNull();
  expect(screen.queryByText('Subscribe')).toBeNull(); expect(screen.queryByText('Buy forever')).toBeNull();
};

describe('M1-010 / DEC-09 a (27.10.2026): stan „Masz plan X” zamiast oferty, zmiana planu zwinięta', () => {
  const cases: [string, Entitlement][] = [
    ['miesięczny kupiony', ent('monthly')], ['roczny kupiony', ent('yearly')],
    ['miesięczny z kodu', ent('monthly', { source: 'code' })], ['roczny z Chmury rodzinnej', ent('yearly', { source: 'family' })],
  ];
  test.each(cases)('%s: nagłówek karty nazywa plan (VoiceOver: nagłówek w karcie), brak wstępu o darmowych dniach i listy ofert; „Zmień plan” zwinięty', async (_n, e) => {
    await boot([e]);
    const title = screen.getByTestId('paywall-owned-title');
    expect(title.props.children).toBe(`Your plan: ${NAME_EN[e.plan]}`); expect(title.props.accessibilityRole).toBe('header');
    expect(screen.queryByText('You have the full version')).toBeNull(); expect(screen.queryByTestId('paywall-owned-plan')).toBeNull(); /* dawne „Plan: X” pod „Masz pełną wersję” */
    noOffer();
    const tog = screen.getByTestId('paywall-change-plan');
    expect(tog.props.accessibilityLabel).toBe('Change plan'); expect(tog.props.accessibilityState).toEqual({ expanded: false });
  });

  test('„Zmień plan” rozwija listę: posiadany plan oznaczony i niewybieralny, przycisk zakupu inny niż „Subskrybuj”, drugie stuknięcie zwija (etykieta stała)', async () => {
    await boot([ent('monthly')]);
    await tap(screen.getByTestId('paywall-change-plan'));
    const tog = screen.getByTestId('paywall-change-plan'); expect(tog.props.accessibilityState).toEqual({ expanded: true }); expect(tog.props.accessibilityLabel).toBe('Change plan');
    expect(screen.getAllByTestId(/^plan-(yearly|monthly|lifetime)$/).map(n => n.props.testID)).toEqual(['plan-yearly', 'plan-monthly', 'plan-lifetime']);
    expect(screen.getByTestId('plan-monthly').props.accessibilityState).toEqual({ selected: false, disabled: true }); expect(screen.getByTestId('plan-monthly-own')).toBeTruthy();
    expect(screen.getByTestId('plan-yearly').props.accessibilityState.selected).toBe(true);
    expect(screen.queryByText('Subscribe')).toBeNull(); expect(screen.getAllByText('Change plan')).toHaveLength(1); /* jeden przycisk o tej nazwie: przełącznik; zakup ma własną etykietę */
    expect(screen.getByTestId('paywall-buy').props.accessibilityLabel).toBe('Switch to this plan');
    await tap(screen.getByTestId('paywall-change-plan'));
    expect(screen.getByTestId('paywall-change-plan').props.accessibilityState).toEqual({ expanded: false }); noOffer();
  });

  test('zmiana planu po rozwinięciu: zakup wybranego planu, potem karta z nową nazwą i lista znowu zwinięta', async () => {
    await boot([ent('monthly')]);
    await tap(screen.getByTestId('paywall-change-plan')); await tap(screen.getByTestId('paywall-buy')); await settle();
    expect(fake.calls.purchase).toBe(1); expect(fake.entitlements()!.map(e => e.plan)).toEqual(['yearly']);
    expect(screen.getByTestId('paywall-owned-title').props.children).toBe(`Your plan: ${NAME_EN.yearly}`);
    expect(screen.getByTestId('paywall-change-plan').props.accessibilityState).toEqual({ expanded: false }); noOffer();
  });

  test('dożywotni po rozwinięciu przy aktywnej subskrypcji: „Kup na zawsze” z uwagą o odnawianiu przed zakupem (M1-001 bez zmian)', async () => {
    await boot([ent('monthly')]);
    await tap(screen.getByTestId('paywall-change-plan')); await tap(screen.getByTestId('plan-lifetime'));
    expect(screen.getByTestId('paywall-buy').props.accessibilityLabel).toBe('Buy forever'); expect(screen.getByTestId('paywall-lifetime-warning')).toBeTruthy();
  });

  test('PL: „Masz plan: roczny”, „Zmień plan” zwinięty, po rozwinięciu „Przejdź na ten plan”', async () => {
    await boot([ent('yearly')], 'pl');
    expect(screen.getByTestId('paywall-owned-title').props.children).toBe('Masz plan: roczny');
    expect(screen.queryByText(/^Trenuj 5 dni w miesiącu za darmo/)).toBeNull(); expect(screen.queryByTestId('plan-monthly')).toBeNull();
    expect(screen.getByTestId('paywall-change-plan').props.accessibilityLabel).toBe('Zmień plan'); await tap(screen.getByText('Zmień plan'));
    expect(screen.getByTestId('paywall-buy').props.accessibilityLabel).toBe('Przejdź na ten plan'); expect(screen.queryByText('Subskrybuj')).toBeNull();
  });

  test('dożywotni: nagłówek z nazwą planu i „Masz dostęp na zawsze”, bez listy i bez „Zmień plan”', async () => {
    await boot([ent('lifetime')]);
    expect(screen.getByTestId('paywall-owned-title').props.children).toBe(`Your plan: ${NAME_EN.lifetime}`); expect(screen.getByText('You have access forever')).toBeTruthy();
    noOffer(); expect(screen.queryByTestId('paywall-change-plan')).toBeNull();
  });

  test('bez dostępu: oferta jak dotąd — wstęp o darmowych dniach, lista od razu widoczna, „Subskrybuj”, bez „Zmień plan” i bez karty stanu', async () => {
    await boot([]);
    expect(screen.getByTestId('paywall-headline')).toBeTruthy(); expect(screen.getByTestId('plan-yearly')).toBeTruthy(); expect(screen.getByText('Subscribe')).toBeTruthy();
    expect(screen.queryByTestId('paywall-change-plan')).toBeNull(); expect(screen.queryByTestId('paywall-owned-title')).toBeNull();
  });
});
