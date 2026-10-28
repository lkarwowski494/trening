/*
 * M1-audytor-generalny-033 (audyt 1.0, 27.10.2026; 11-wzrost-003): opis opcji metryki Androida w docs/wzrost.md zgodny z modelem M5 S1 (bez okresu
 * próbnego, 22.10.2026). Próg i data oceny wybiera właściciel (zasada roli 9) — do tego czasu pola zostają [DO USTALENIA] (zadanie z blokadą w planie).
 * Rodzaje (docs/20): dane (dokument), regresja.
 */
import * as fs from 'fs';
import * as path from 'path';

const doc = () => fs.readFileSync(path.join(__dirname, '..', 'docs/wzrost.md'), 'utf8');

describe('M1-033: hipoteza Androidu bez nieistniejącego okresu próbnego', () => {
  test('docs/wzrost.md nie odwołuje się do okresu próbnego (model bez okresu próbnego)', () => {
    expect(doc()).not.toMatch(/okres(u|ie)? próbn|po okresie próbnym|14 dni \(`docs\/monetyzacja/);
  });
  test('opcja B opisuje kupujących wobec pobrań (model stały M5 S1)', () => {
    expect(doc()).toMatch(/- \*\*B\. Odsetek płacących wśród pobierających\*\*/);
  });
});
