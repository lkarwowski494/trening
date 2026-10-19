/*
 * Wytyczna Apple 3.1.2 (14.10.2026, decyzja właściciela: Standard EULA): Warunki korzystania (standardowa licencja Apple) i Prywatność dostępne
 * z ekranu zakupu (tests/subscription-ui.test.tsx) ORAZ z Więcej → O aplikacji. Adresy tylko z lib/products.ts. Teksty przez t() — klucze wspólne z ekranem zakupu (35 języków).
 */
import { Linking } from 'react-native';
import { applyLang, t, LANGS } from '@/lib/i18n';
import { openWebPage } from '@/lib/support';
import { PRIVACY_URL, TERMS_URL } from '@/lib/products';
import { fresh, seedWithDemo } from './helpers';
import { renderApp, flushAll, screen, tap } from './app';

jest.setTimeout(120000);
afterEach(() => { applyLang('pl'); jest.restoreAllMocks(); });
const boot = async (locale: 'pl' | 'en' = 'pl') => { await fresh(seedWithDemo(), locale); await renderApp({ locale, url: '/more/about' }); await flushAll(10); };

describe('lib/support: openWebPage', () => {
  test('woła Linking.openURL z adresem; odrzucenie jest ciche (bez wyjątku)', async () => {
    const open = jest.spyOn(Linking, 'openURL').mockRejectedValue(new Error('x')); open.mockClear();
    expect(() => openWebPage(TERMS_URL)).not.toThrow(); await Promise.resolve(); await Promise.resolve(); expect(open).toHaveBeenCalledWith(TERMS_URL);
  });
});

describe('O aplikacji: Warunki korzystania i Prywatność', () => {
  test('adresy: Standard EULA Apple i strona prywatności (https)', () => {
    expect(TERMS_URL).toBe('https://www.apple.com/legal/internet-services/itunes/dev/stdeula/'); expect(PRIVACY_URL).toMatch(/^https:\/\/.+privacy\.html$/);
  });
  test('PL: dwa przyciski przed licencjami; stuknięcie otwiera właściwe adresy; podpowiedź „Otwiera stronę w przeglądarce.”', async () => {
    const open = jest.spyOn(Linking, 'openURL').mockResolvedValue(undefined as never); open.mockClear(); await boot();
    const terms = screen.getByLabelText('Warunki korzystania'); const priv = screen.getByLabelText('Prywatność');
    for (const r of [terms, priv]) { expect(r.props.accessibilityRole).toBe('button'); expect(r.props.accessibilityHint).toBe('Otwiera stronę w przeglądarce.'); expect(r.props.accessibilityLanguage).toBe('pl'); }
    const order = screen.getAllByRole('button').map(b => b.props.accessibilityLabel).filter(Boolean);
    expect(order.indexOf('Warunki korzystania')).toBeLessThan(order.findIndex((l: string) => /licencje/i.test(l))); expect(order.indexOf('Prywatność')).toBeLessThan(order.findIndex((l: string) => /licencje/i.test(l)));
    await tap(terms); await tap(priv); expect(open.mock.calls.map(c => c[0])).toEqual([TERMS_URL, PRIVACY_URL]);
  });
  test('EN: Terms of Use i Privacy', async () => {
    const open = jest.spyOn(Linking, 'openURL').mockResolvedValue(undefined as never); open.mockClear(); await boot('en');
    await tap(screen.getByLabelText('Terms of Use')); await tap(screen.getByLabelText('Privacy')); expect(open.mock.calls.map(c => c[0])).toEqual([TERMS_URL, PRIVACY_URL]);
    expect(screen.getByLabelText('Privacy').props.accessibilityHint).toBe('Opens the page in your browser.');
  });
  test('błąd otwarcia (openURL odrzuca) nie wywala ekranu ani nie pokazuje okna', async () => {
    jest.spyOn(Linking, 'openURL').mockRejectedValue(new Error('x')); await boot(); await tap(screen.getByLabelText('Warunki korzystania')); await flushAll(5);
    expect(screen.getByLabelText('Prywatność')).toBeTruthy(); expect(global.__alerts).toHaveLength(0);
  });
  test('35 języków: etykiety i podpowiedź przetłumaczone (niepuste)', () => {
    expect(LANGS.length).toBe(35);
    for (const l of LANGS) { applyLang(l); for (const k of ['Warunki korzystania', 'Prywatność', 'Otwiera stronę w przeglądarce.']) expect(t(k).length).toBeGreaterThan(0); }
  });
});
