/* Zapis efektywnego limitu czasu każdego przypadku (05.11.2026, poprawka strażnika czasu testu po przebiegu dowodowym tests.yml 42039115183 — limit
 * wyznaczany statycznie z tekstu pliku dawał 129 fałszywych zgłoszeń). Podpięty w package.json (jest.setupFilesAfterEnv).
 * Działa tylko przy ustawionej zmiennej JEST_LIMITY_PLIK (ścieżka pliku; brak zmiennej = hak nie jest rejestrowany, lokalnie zero narzutu).
 * Hak beforeEach każdego przypadku (także test.each i .only — hak jest na poziomie pliku, nie opakowuje test/it; test.concurrent hak pomija: kontrola zgłosi go jako przypadek bez znanego limitu) czyta od jest-circus
 * to, czego circus faktycznie użyje: `test.timeout` (trzeci argument test/it) albo `testTimeout` (konfiguracja albo jest.setTimeout na wierszu głównym pliku).
 * Wiersz JSON na przypadek, dopisywany (równoległe workery): { plik, test, limit }. Nazwa = expect.getState().currentTestName (ancestorTitles + title,
 * jak fullName w assertionResults wyniku Jest). Odczyt stanu circus: symbol JEST_STATE_SYMBOL jest prywatny (Symbol bez rejestru) — szukamy go po opisie. */
const fs = require('fs');
const path = require('path');

const PLIK = process.env.JEST_LIMITY_PLIK;

function stan() {
  const sym = Object.getOwnPropertySymbols(globalThis).find(s => s.description === 'JEST_STATE_SYMBOL');
  return sym ? globalThis[sym] : null;
}

if (PLIK) {
  const korzen = path.resolve(__dirname, '..');
  beforeEach(() => {
    const s = stan();
    const limit = s && s.currentlyRunningTest ? (s.currentlyRunningTest.timeout || s.testTimeout) : null;
    const { currentTestName, testPath } = expect.getState();
    /* limit null = nie udało się odczytać (kontrola zgłosi przypadek bez znanego limitu — nie cichy sukces) */
    fs.appendFileSync(PLIK, JSON.stringify({ plik: path.relative(korzen, testPath || ''), test: currentTestName, limit }) + '\n');
  });
}
