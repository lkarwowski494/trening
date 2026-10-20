/*
 * Audyt M1 z 19.10.2026, partia 2 — M1-audytor-generalny-016: opis korzyści pełnej wersji na ekranie zakupu nie może zawierać cech wspólnych z wersją darmową
 * (brak reklam, dane tylko na telefonie, historia / kopia / eksport) — wersja darmowa też je ma. Czerwone na 8273448 („Bez reklam”).
 */
import { applyLang, LANGS } from '@/lib/i18n';
import { LOCALES } from '@/lib/locales';
import { EN } from '@/lib/i18n.en';
import { PAYWALL } from '@/lib/access';
import { setStoreAdapter, resetStoreAdapterForTests } from '@/lib/store-adapter';
import { createFakeStore } from '@/lib/store-fake';
import { resetEntitlementsForTests } from '@/lib/entitlement';
import { fresh } from './helpers';
import { renderApp, flushAll, screen, act } from './app';

const NEW = 'Treningi na żywo bez miesięcznego limitu.'; const OLD = 'Treningi bez limitu. Bez reklam. Wszystko zostaje na Twoim telefonie.';
const SHARED = /reklam|\bads?\b|Werbung|publicit|pubblicit|reclam|annons|reklame|mainos|\bphone\b|telefon|iPhone/i;
afterEach(() => { PAYWALL.ENABLED = false; resetEntitlementsForTests(); resetStoreAdapterForTests(); applyLang('pl'); });
async function boot(locale: 'pl' | 'en') {
  await fresh(undefined, locale); resetEntitlementsForTests(); PAYWALL.ENABLED = true; setStoreAdapter(createFakeStore([]));
  await renderApp({ locale, url: '/paywall?reason=settings' }); for (let i = 0; i < 8; i++) await flushAll(10);
}
describe('M1-016: korzyść pełnej wersji na ekranie zakupu', () => {
  test.each([['pl', NEW], ['en', 'Live workouts without the monthly limit.']] as const)('ekran zakupu (%s): jedno zdanie o braku limitu, bez cech wspólnych z wersją darmową', async (locale, text) => {
    await boot(locale); expect(screen.getByText(text)).toBeTruthy(); expect(screen.queryByText(SHARED)).toBeNull();
  });
  test('słowniki: stary tekst usunięty, nowy w każdym z 35 języków, bez cech wspólnych z wersją darmową (reklamy, telefon)', () => {
    expect(EN[OLD]).toBeUndefined(); expect(EN[NEW]).toBe('Live workouts without the monthly limit.');
    for (const l of LANGS.filter(x => x !== 'pl' && x !== 'en')) { const d = LOCALES[l] as Record<string, string>; expect([l, d[OLD]]).toEqual([l, undefined]); expect([l, typeof d[NEW]]).toEqual([l, 'string']); expect([l, SHARED.test(d[NEW])]).toEqual([l, false]); }
  });
});
