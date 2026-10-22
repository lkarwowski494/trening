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

const NEW = 'Trenuj {n} dni w miesiącu za darmo. Pro zdejmuje limit. Anulujesz w ustawieniach Apple ID, kiedy zechcesz.'; const GONE = 'Treningi na żywo bez miesięcznego limitu.'; const OLD = 'Treningi bez limitu. Bez reklam. Wszystko zostaje na Twoim telefonie.';
const SHARED = /reklam|\bads?\b|Werbung|publicit|pubblicit|reclam|annons|reklame|mainos|\bphone\b|telefon|iPhone/i;
afterEach(() => { PAYWALL.ENABLED = false; resetEntitlementsForTests(); resetStoreAdapterForTests(); applyLang('pl'); });
async function boot(locale: 'pl' | 'en') {
  await fresh(undefined, locale); resetEntitlementsForTests(); PAYWALL.ENABLED = true; setStoreAdapter(createFakeStore([]));
  await renderApp({ locale, url: '/paywall?reason=settings' }); for (let i = 0; i < 8; i++) await flushAll(10);
}
describe('M1-016: korzyść pełnej wersji na ekranie zakupu', () => {
  /* M5 S1 (22.10.2026): nagłówek ekranu z Ustawień = limit dni + „Pro zdejmuje limit” (bez cech wspólnych z darmową). Tekst przy starcie ponad limit (wariant B, decyzja
   * właściciela 22.10.2026) świadomie mówi „bez reklam, bez zbierania danych” — to nie opis korzyści Pro, tylko przedstawienie autora (T-042/T-043). */
  test.each([['pl', 'Trenuj 5 dni w miesiącu za darmo. Pro zdejmuje limit. Anulujesz w ustawieniach Apple ID, kiedy zechcesz.'], ['en', 'Train 5 days a month for free. Pro removes the limit. Cancel anytime in your Apple ID settings.']] as const)('ekran zakupu z Ustawień (%s): nagłówek o limicie i Pro, bez cech wspólnych z wersją darmową', async (locale, text) => {
    await boot(locale); expect(screen.getByText(text)).toBeTruthy(); expect(screen.queryByText(SHARED)).toBeNull();
  });
  test('słowniki: stare teksty usunięte, nowy w EN; tam, gdzie język go ma, bez cech wspólnych z wersją darmową (reklamy, telefon)', () => {
    expect(EN[OLD]).toBeUndefined(); expect(EN[GONE]).toBeUndefined(); expect(EN[NEW]).toBe('Train {n} days a month for free. Pro removes the limit. Cancel anytime in your Apple ID settings.');
    for (const l of LANGS.filter(x => x !== 'pl' && x !== 'en')) { const d = LOCALES[l] as Record<string, string>; expect([l, d[OLD]]).toEqual([l, undefined]); expect([l, d[GONE]]).toEqual([l, undefined]); if (d[NEW] !== undefined) expect([l, SHARED.test(d[NEW])]).toEqual([l, false]); /* komplet tłumaczeń pilnuje tests/i18n-locales.test.ts */ }
  });
});
