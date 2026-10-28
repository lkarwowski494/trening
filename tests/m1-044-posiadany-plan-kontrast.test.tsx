/*
 * M1-audytor-generalny-044 (regresja od M1-010 / DEC-09 a, reaudyt 28.10.2026; 04-studio-projektowe-602): posiadany plan na liście „Zmień plan” był wyszarzony
 * przezroczystością (opacity 0,7), przez co nazwa i opis planu (muted) spadały do 3,52:1 / 4,06:1. Reguła A11-16 (components/ui.tsx): wyszarzenie kolorem,
 * nie przezroczystością. Test: karta posiadanego planu i jej przodkowie bez opacity < 1; stan niesie „Aktualny plan” i brak ramki wyboru.
 */
import { StyleSheet } from 'react-native';
import * as store from '@/lib/store';
import { PAYWALL, type Entitlement } from '@/lib/access';
import { setStoreAdapter, resetStoreAdapterForTests } from '@/lib/store-adapter';
import { createFakeStore } from '@/lib/store-fake';
import { resetEntitlementsForTests } from '@/lib/entitlement';
import { applyLang } from '@/lib/i18n';
import { fresh, saved } from './helpers';
import { renderApp, flushAll, screen, tap, act } from './app';

jest.setTimeout(120000);
afterEach(() => { PAYWALL.ENABLED = false; resetEntitlementsForTests(); resetStoreAdapterForTests(); applyLang('pl'); jest.useRealTimers(); });
const flat = (st: unknown) => (StyleSheet.flatten((typeof st === 'function' ? (st as (s: { pressed: boolean }) => unknown)({ pressed: false }) : st) as never) ?? {}) as Record<string, unknown>;

describe('M1-044: posiadany plan bez przezroczystości', () => {
  test('plan roczny posiadany: karta „plan-yearly” i przodkowie bez opacity < 1, z „Aktualny plan”', async () => {
    const NOW = Date.now(); const ents: Entitlement[] = [{ plan: 'yearly', source: 'purchase', expiresAt: NOW + 200 * 86400e3 }];
    await fresh(undefined, 'pl'); resetEntitlementsForTests(); PAYWALL.ENABLED = true;
    setStoreAdapter(createFakeStore(ents)); store.save(); await act(async () => { await store.flush(); });
    await renderApp({ saved: JSON.parse(JSON.stringify(saved())), locale: 'pl', url: '/paywall?reason=settings' }); for (let i = 0; i < 8; i++) await flushAll(10);
    await tap(screen.getByTestId('paywall-change-plan')); await flushAll(10);
    expect(screen.getByTestId('plan-yearly-own')).toBeTruthy();
    const card = screen.getByTestId('plan-yearly');
    const zle: string[] = []; for (let n: any = card; n; n = n.parent) { const o = flat(n.props?.style).opacity; if (typeof o === 'number' && o < 1) zle.push(`${String(n.props?.testID ?? n.type)}: ${o}`); }
    expect(zle).toEqual([]);
  });
});
