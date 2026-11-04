/*
 * Gest powrotu z lewej krawędzi (04.11.2026): scenariusz 17 kończy kartę ćwiczenia `swipe: { start: "2%, 50%", end: "80%, 50%" }` (karta ma gestureEnabled: true,
 * app/exercise/[id].tsx). Interpreter znał tylko przewijanie w pionie i ściąganie okna modalnego, więc krok padał na „pod punktem startu nie ma listy”.
 * Teraz: start x ≤ 5% szerokości, |dy| małe, dx > 30% → goBack() wiernie iOS: tylko gdy ekran ma gestureEnabled ≠ false i nawigator ma ekran pod spodem.
 */
import { Runner } from './maestro-runner';

jest.setTimeout(60000);
const mk = (opts: Record<string, unknown>, canGoBack: boolean) => {
  const goBack = jest.fn(); const r = new Runner('swipe-krawedz') as any;
  r.nav = () => ({ getCurrentOptions: () => opts, canGoBack: () => canGoBack, goBack }); r.tick = async () => {}; r.relayout = () => {}; r.candidates = () => []; /* fail() wypisuje widoczne teksty — bez renderowanej aplikacji lista pusta */
  return { r: r as Runner & { swipeScroll(s: string, a: string, b: string): Promise<void> }, goBack };
};
const EDGE: [string, string] = ['2%, 50%', '80%, 50%'];

describe('swipe z lewej krawędzi = gest powrotu iOS', () => {
  test('ekran z gestureEnabled: true i ekranem pod spodem → goBack()', async () => {
    const { r, goBack } = mk({ gestureEnabled: true }, true); await r.swipeScroll('s', ...EDGE); expect(goBack).toHaveBeenCalledTimes(1);
  });
  test('gestureEnabled nieustawione (domyślnie włączony) → goBack()', async () => {
    const { r, goBack } = mk({}, true); await r.swipeScroll('s', ...EDGE); expect(goBack).toHaveBeenCalledTimes(1);
  });
  test('ekran z gestureEnabled: false → czytelny błąd, bez goBack()', async () => {
    const { r, goBack } = mk({ gestureEnabled: false }, true); await expect(r.swipeScroll('s', ...EDGE)).rejects.toThrow(/gestureEnabled: false/); expect(goBack).not.toHaveBeenCalled();
  });
  test('brak ekranu pod spodem → czytelny błąd, bez goBack()', async () => {
    const { r, goBack } = mk({ gestureEnabled: true }, false); await expect(r.swipeScroll('s', ...EDGE)).rejects.toThrow(/bez ekranu pod spodem/); expect(goBack).not.toHaveBeenCalled();
  });
  test('start poza krawędzią (x = 30%) albo zbyt krótki ruch (dx 20%) albo ruch pionowy nie jest gestem powrotu', async () => {
    for (const [a, b] of [['30%, 50%', '90%, 50%'], ['2%, 50%', '22%, 50%'], ['2%, 50%', '40%, 90%']]) {
      const { r, goBack } = mk({}, true); await r.swipeScroll('s', a, b).catch(() => {}); expect(goBack).not.toHaveBeenCalled();
    }
  });
});
