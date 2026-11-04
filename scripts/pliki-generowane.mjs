// Pliki generowane z kodu i testów — jedno miejsce (ZB-041 G1, decyzja właściciela 04.11.2026 ~06:00 PL, wariant A): scripts/scal-galaz.mjs przy konflikcie scalenia
// dotyczącym WYŁĄCZNIE tych plików bierze wersję docelową, uruchamia generatory i zatwierdza scalenie; konflikt w jakimkolwiek innym pliku przerywa scalenie jak dotąd.
// Lista: tylko pliki z generatorem `--write`, których zawartość jest funkcją reszty drzewa (po scaleniu wynik jest deterministyczny, a check:readme/check:matrix/check:pokrycie
// w verify i w CI i tak go sprawdzają). Poza listą celowo: docs/lokalizacja/skroty-przekladu.json (zapis tylko `UPDATE_SKROTY=1` i tylko gdy żaden przekład nie stoi w miejscu —
// to rejestr decyzji o przekładzie, nie pochodna), docs/18 i docs/40 (dopisywane ręcznie).
// SCAL_GENEROWANE (JSON: [{ plik, polecenie }]) zastępuje listę — tylko testy.
export const GENEROWANE = [
  { plik: 'README.md', polecenie: ['node', 'scripts/readme.mjs', '--write'] },
  { plik: 'docs/19-macierz-testow.md', polecenie: ['node', 'scripts/test-matrix.mjs', '--write'] },
  { plik: 'docs/55-pokrycie-katalogu.md', polecenie: ['node', 'scripts/pokrycie-katalogu.mjs', '--write'] },
  { plik: 'tests/fixtures/pokrycie-katalogu.json', polecenie: ['node', 'scripts/pokrycie-katalogu.mjs', '--write'] },
  { plik: 'docs/lokalizacja/konteksty.json', polecenie: ['node', 'scripts/i18n-context.mjs', '--write'] },
];
export const generowane = () => (process.env.SCAL_GENEROWANE ? JSON.parse(process.env.SCAL_GENEROWANE) : GENEROWANE);
