/*
 * Podatność zależności decode-uri-component (npm audit: GHSA-vcc3-ghjq-m6fr, DoS przy wykładniczym dekodowaniu zniekształconego %-kodowania; zakres <= 0.4.2; w aplikacji
 * tylko przez query-string 7.1.3 → expo-router, czyli przy parsowaniu LINKU DO APLIKACJI). docs/21, sekcja „Podatność zależności decode-uri-component (1.0.1)”.
 * Próba `overrides` na 0.5.x (ESM) zepsuła parsowanie: query-string 7 jest CommonJS i robi require('decode-uri-component'), a 0.5.x ma tylko `export default` —
 * require zwraca przestrzeń nazw zamiast funkcji („decodeComponent is not a function”). Ten test jest strażnikiem: każda zmiana wersji tej zależności (override albo
 * aktualizacja SDK) musi zachować otwieranie linków z parametrami, także spreparowanych (`%E0%A4%A` — niepełna sekwencja UTF-8).
 * Realność: brzegowy (link z zewnątrz otwiera ekran z parametrem; zniekształcony link tylko od złośliwego nadawcy; skutek — chwilowe zawieszenie, bez utraty danych).
 * Kroki: dotknięcie linku trening://progress?s=guard%E0%A4%A w innej aplikacji → aplikacja otwiera Postępy bez awarii.
 */
import { createRequire } from 'module';
import { fresh, saved } from './helpers';
import { renderApp, flushAll, screen } from './app';

jest.setTimeout(60000);
const qs = createRequire(__filename)('query-string') as { parse: (s: string) => Record<string, string | string[] | null>; stringify: (o: Record<string, unknown>) => string };

describe('query-string (parser linków expo-router) po zmianie decode-uri-component', () => {
  test('poprawne parametry: zwykłe, z polskimi znakami i kodowaniem UTF-8', () => {
    expect(qs.parse('s=guard&c=week')).toEqual({ s: 'guard', c: 'week' });
    expect(qs.parse('q=%C5%82%C3%B3d%C5%BA')).toEqual({ q: 'łódź' });
  });
  test('spreparowane %-kodowanie nie rzuca wyjątku: niepełna sekwencja zostaje dosłownie, reszta parametrów się parsuje', () => {
    expect(() => qs.parse('a=%E0%A4%A&b=1')).not.toThrow();
    expect(qs.parse('a=%E0%A4%A&b=1')).toEqual({ a: '%E0%A4%A', b: '1' });
    expect(qs.parse('x=%&y=%G1&z=ok')).toEqual({ x: '%', y: '%G1', z: 'ok' });
  });
  test('długi zniekształcony parametr (5000 powtórzeń) parsuje się w rozsądnym czasie', () => {
    const r = qs.parse('a=' + '%E0%A4%A'.repeat(5000)); expect(String(r.a).length).toBe(40000);
  });
});

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
