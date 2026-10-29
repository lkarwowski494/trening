/*
 * Pomoc testowa (bramka 4, fail-closed, scalenie main 28.10.2026): w aplikacji rysunek v2 pokazuje tylko rodzina z aktualnym wpisem recenzji ruchu
 * (lib/figures/data.json, pole `v2`). Testy komponentu rysunku (animacja, znaczki, kąty, fazy) sprawdzają rysowanie, nie bramkę — otwierają ją podmianą pliku:
 *   jest.mock('@/lib/figures/data.json', () => require('./figure-gate-open').openFigureGate(jest.requireActual('@/lib/figures/data.json')));
 * Sama bramka jest sprawdzana bez podmiany w tests/recenzja-wyjatki-1-1.test.ts i tests/figures-v2-wstrzymane.test.ts.
 */
export function openFigureGate<T extends object>(data: T): T & { v2: string[] } {
  const all: string[] = [];
  all.includes = () => true;
  return { ...data, v2: all };
}
