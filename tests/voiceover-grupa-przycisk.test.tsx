/*
 * M1-audytor-generalny-039 (04-studio-projektowe-601; DEC-11 a, właściciel 28.10.2026): „Zarządzaj subskrypcją” niedostępne dla VoiceOver — karta stanu planu
 * na ekranie zakupu (`paywall-owned`) była grupą `accessible`, a iOS zamienia taką grupę w jeden element (`isAccessibilityElement`) i chowa jej potomków przed
 * VoiceOver i XCTest (to samo co E2E-11 na tablicy „teraz”, components/NowBoard.tsx). Przycisk w środku nie dawał się wybrać ani aktywować.
 * Naprawa (a): karta bez `accessible`, nagłówek zostaje nagłówkiem, przycisk osobnym elementem. Scenariusz Maestro: .maestro/21-subskrypcja.yaml stuka „Manage subscription”.
 * Rodzaje (docs/20): ekran (render karty z aktywnym planem, PL/EN), regresja; niezmiennik S19 (skan AST całego UI) — tests/interaction-guards.test.ts. docs/32 wzorzec 23, tabela strażników S19.
 */
import * as store from '@/lib/store';
import { PAYWALL, type Entitlement } from '@/lib/access';
import { setStoreAdapter, resetStoreAdapterForTests } from '@/lib/store-adapter';
import { createFakeStore } from '@/lib/store-fake';
import { resetEntitlementsForTests } from '@/lib/entitlement';
import { applyLang } from '@/lib/i18n';
import { fresh, saved } from './helpers';
import { renderApp, flushAll, screen, tap, act } from './app';

jest.setTimeout(120000);

/* Na najwyższym poziomie, jak w tests/subscription-ui.test.tsx: hak w describe biegnie PRZED sprzątaniem drzewa przez bibliotekę testową, a powrót do prawdziwych
 * zegarów przed odmontowaniem zawieszał przebieg (sprawdzone 28.10.2026). */
afterEach(() => { PAYWALL.ENABLED = false; resetEntitlementsForTests(); resetStoreAdapterForTests(); applyLang('pl'); jest.useRealTimers(); });

describe('ekran zakupu z aktywnym planem: „Zarządzaj subskrypcją” osobnym elementem VoiceOver', () => {
  const NOW = Date.now(); const DAY = 86400e3;
  let fake: ReturnType<typeof createFakeStore>;
  const boot = async (ents: Entitlement[], locale: 'pl' | 'en' = 'pl') => {
    await fresh(undefined, locale); resetEntitlementsForTests(); PAYWALL.ENABLED = true;
    fake = createFakeStore(ents); setStoreAdapter(fake); store.save(); await act(async () => { await store.flush(); });
    await renderApp({ saved: JSON.parse(JSON.stringify(saved())), locale, url: '/paywall?reason=settings' }); for (let i = 0; i < 8; i++) await flushAll(10);
  };
  /** Najbliższy natywny przodek `accessible` (grupa VoiceOver). Liczą się tylko elementy natywne (typ-napis, np. View) — komponent Pressable nad własnym hostem nie jest grupą. */
  const grupaNad = (el: { parent: any; props: any }): string | null => { for (let p = el.parent; p; p = p.parent) if (typeof p.type === 'string' && p.props?.accessible === true) return String(p.props.testID ?? p.props.accessibilityLabel ?? p.type); return null; };
  /** Natywny host przycisku `Btn` (View z rolą button) nad tekstem etykiety. */
  const przycisk = (label: string) => { let n: any = screen.getByText(label); while (n && !(typeof n.type === 'string' && n.props?.accessibilityRole === 'button')) n = n.parent; return n; };

  test.each([
    ['miesięczna', [{ plan: 'monthly', source: 'purchase', expiresAt: NOW + 20 * DAY }] as Entitlement[]],
    ['dożywotni przy odnawiającej się subskrypcji', [{ plan: 'lifetime', source: 'purchase', expiresAt: null }, { plan: 'yearly', source: 'purchase', expiresAt: NOW + 200 * DAY }] as Entitlement[]],
  ])('%s: karta stanu nie jest grupą accessible; przycisk ma rolę przycisku, nie leży w grupie i działa; nagłówek karty zostaje nagłówkiem', async (_n, ents) => {
    await boot(ents);
    const card = screen.getByTestId('paywall-owned'); expect(card.props.accessible).not.toBe(true);
    const btn = przycisk('Zarządzaj subskrypcją'); expect(btn).toBeTruthy(); expect(btn.props.accessibilityRole).toBe('button'); expect(grupaNad(btn)).toBeNull();
    const title = screen.getByTestId('paywall-owned-title'); expect(title.props.accessibilityRole).toBe('header'); expect(grupaNad(title)).toBeNull(); expect(title.props.accessibilityLanguage).toBe('pl');
    const before = fake.calls.manageSubscriptions; await tap(btn); await flushAll(10); expect(fake.calls.manageSubscriptions).toBe(before + 1);
  });
  test('EN: etykieta przycisku „Manage subscription” (ten sam literał stuka scenariusz Maestro 21), język wymowy nagłówka karty en', async () => {
    await boot([{ plan: 'yearly', source: 'purchase', expiresAt: NOW + 200 * DAY }], 'en');
    const btn = przycisk('Manage subscription'); expect(btn).toBeTruthy(); expect(grupaNad(btn)).toBeNull();
    expect(screen.getByTestId('paywall-owned-title').props.accessibilityLanguage).toBe('en');
  });
});
