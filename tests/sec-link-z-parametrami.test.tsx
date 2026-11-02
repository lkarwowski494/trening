/*
 * Podatność zależności decode-uri-component (npm audit: GHSA-vcc3-ghjq-m6fr, DoS przy wykładniczym dekodowaniu zniekształconego %-kodowania; zakres <= 0.4.2; w aplikacji
 * tylko przez query-string 7.1.3 → expo-router, czyli przy parsowaniu LINKU DO APLIKACJI). docs/21, sekcja „Podatność zależności decode-uri-component (1.0.1)”.
 * Od SDK 58 (02.11.2026) query-string nie ma w drzewie zależności — testy samego parsera usunięte (strażnik braku: tests/zb010-sdk.test.ts), zostają testy ekranowe.
 * Próba `overrides` na 0.5.x (ESM) zepsuła parsowanie: query-string 7 jest CommonJS i robi require('decode-uri-component'), a 0.5.x ma tylko `export default` —
 * require zwraca przestrzeń nazw zamiast funkcji („decodeComponent is not a function”). Ten test jest strażnikiem: każda zmiana wersji tej zależności (override albo
 * aktualizacja SDK) musi zachować otwieranie linków z parametrami, także spreparowanych (`%E0%A4%A` — niepełna sekwencja UTF-8).
 * Realność: brzegowy (link z zewnątrz otwiera ekran z parametrem; zniekształcony link tylko od złośliwego nadawcy; skutek — chwilowe zawieszenie, bez utraty danych).
 * Kroki: dotknięcie linku trening://progress?s=guard%E0%A4%A w innej aplikacji → aplikacja otwiera Postępy bez awarii.
 */
import { fresh, saved } from './helpers';
import { renderApp, flushAll, screen } from './app';

jest.setTimeout(60000);
describe('ekran: otwarcie linku z parametrami', () => {
  const open = async (url: string) => { await fresh(); await renderApp({ saved: JSON.parse(JSON.stringify(saved())), url }); await flushAll(20); };
  test('link z poprawnym parametrem otwiera Postępy', async () => {
    await open('/progress?s=guard');
    expect(screen.getByTestId('progress-scroll')).toBeTruthy();
  });
  test('link ze spreparowanym parametrem (%E0%A4%A) otwiera ten sam ekran bez awarii', async () => {
    await open('/progress?s=guard%E0%A4%A');
    expect(screen.getByTestId('progress-scroll')).toBeTruthy();
  });
  test('link do Progresji z nieznaną wartością parametru nie wysypuje aplikacji', async () => {
    await open('/progression?c=week%E0%A4%A');
    expect(screen.toJSON()).not.toBeNull();
  });
});
