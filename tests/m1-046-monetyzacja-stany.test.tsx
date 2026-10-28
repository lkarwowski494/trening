/*
 * M1-audytor-generalny-046 (reaudyt 28.10.2026; pozycja zbiorcza P2, istniało wcześniej): trzy stany monetyzacji, które mówiły nieprawdę.
 *  - 02-monetyzacja-601: bez sieci płacący (dostęp „full” z pamięci, plan nieznany) widział na ekranie zakupu ofertę dla darmowych — wstęp o darmowych dniach,
 *    listę planów i stopkę „Bez zakupu…” (wariant b raportu: ukryć je przy pełnym dostępie, bez nowego tekstu);
 *  - 02-monetyzacja-602: po zakupie dożywotniego członek Chmury rodzinnej czytał „anuluj subskrypcję, żeby nie płacić podwójnie” (warunek bez wyłączenia rodziny);
 *  - 11-wzrost-601: były subskrybent po dziesiątkach treningów dostawał okno „Pierwszy trening za Tobą!” (wariant a: tylko po pierwszym treningu na żywo).
 */
import * as store from '@/lib/store';
import { PAYWALL, type Entitlement } from '@/lib/access';
import { resetEntitlementsForTests, refreshEntitlements } from '@/lib/entitlement';
import { setStoreAdapter, resetStoreAdapterForTests } from '@/lib/store-adapter';
import { createFakeStore } from '@/lib/store-fake';
import { fairRulesDue } from '@/lib/fairrules';
import { applyLang } from '@/lib/i18n';
import { fresh, saved, addWorkout } from './helpers';
import { renderApp, flushAll, screen, act } from './app';

jest.setTimeout(120000);
afterEach(() => { PAYWALL.ENABLED = false; resetEntitlementsForTests(); resetStoreAdapterForTests(); applyLang('pl'); jest.useRealTimers(); });
const NOW = Date.now(); const DAY = 86400e3;
const ODNAWIA = 'Twoja subskrypcja nadal się odnawia — anuluj ją, żeby nie płacić podwójnie.';

const paywall = async (ents: Entitlement[], przed?: (f: ReturnType<typeof createFakeStore>) => Promise<void>) => {
  await fresh(undefined, 'pl'); resetEntitlementsForTests(); PAYWALL.ENABLED = true;
  const fake = createFakeStore(ents); setStoreAdapter(fake); if (przed) await przed(fake);
  store.save(); await act(async () => { await store.flush(); });
  await renderApp({ saved: JSON.parse(JSON.stringify(saved())), locale: 'pl', url: '/paywall?reason=settings' }); for (let i = 0; i < 8; i++) await flushAll(10);
  return fake;
};

describe('M1-046 (02-602): uwaga o odnawianiu po zakupie dożywotniego tylko przy subskrypcji, za którą płaci sama osoba', () => {
  test('dożywotni + roczny z Chmury rodzinnej: bez rady „anuluj”', async () => {
    await paywall([{ plan: 'lifetime', source: 'purchase', expiresAt: null }, { plan: 'yearly', source: 'family', expiresAt: NOW + 200 * DAY }]);
    expect(screen.getByTestId('paywall-owned')).toBeTruthy(); expect(screen.queryByText(ODNAWIA)).toBeNull();
  });
  test('dożywotni + roczny kupiony samodzielnie: rada „anuluj” jest', async () => {
    await paywall([{ plan: 'lifetime', source: 'purchase', expiresAt: null }, { plan: 'yearly', source: 'purchase', expiresAt: NOW + 200 * DAY }]);
    expect(screen.getByText(ODNAWIA)).toBeTruthy();
  });
});

describe('M1-046 (02-601): bez sieci, pełny dostęp z pamięci — bez oferty dla darmowych', () => {
  test('dostęp „full” zapamiętany, sklep nie odpowiada: brak wstępu o darmowych dniach, listy planów i stopki „Bez zakupu”', async () => {
    const fake = await paywall([{ plan: 'monthly', source: 'purchase', expiresAt: NOW + 20 * DAY }]); /* jak sonda roli 02: sieć znika po starcie ekranu */
    fake.offline = true; await act(async () => { await refreshEntitlements(); }); for (let i = 0; i < 6; i++) await flushAll(10);
    expect(require('@/lib/entitlement').accessNow(Date.now())).toMatchObject({ level: 'full', active: null });
    expect(screen.queryByTestId('paywall-headline')).toBeNull();
    expect(screen.queryByText(/^Bez zakupu:/)).toBeNull();
    expect(screen.queryByTestId('paywall-buy')).toBeNull(); expect(screen.queryByTestId('paywall-offline')).toBeNull();
  });
});

describe('M1-046 (11-601): okno „Pierwszy trening za Tobą!” nie dla byłego subskrybenta', () => {
  const live = (at: number) => { const w = addWorkout(at, [['Back Squat', [{ weight: 100, reps: 5, done: true }]]], 'A'); w.live = true; return w; };
  test('bez zakupów: okno po treningu na żywo (także z wcześniejszymi treningami — MAN-01)', async () => {
    await fresh(); resetEntitlementsForTests(); PAYWALL.ENABLED = true; setStoreAdapter(createFakeStore([])); await refreshEntitlements();
    live(NOW - 3 * DAY); expect(fairRulesDue(live(NOW), NOW)).toBe(true);
  });
  test('po wygaśnięciu subskrypcji: 21. trening na żywo bez okna (sonda A raportu 11)', async () => {
    await fresh(); resetEntitlementsForTests(); PAYWALL.ENABLED = true;
    setStoreAdapter(createFakeStore([{ plan: 'monthly', source: 'purchase', expiresAt: NOW - DAY }])); await refreshEntitlements();
    for (let i = 20; i >= 1; i--) live(NOW - i * DAY);
    expect(fairRulesDue(live(NOW), NOW)).toBe(false);
  });
});
