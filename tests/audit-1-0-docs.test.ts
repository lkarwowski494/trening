/* Audyt 1.0 (B-03, C-1, R10): liczba minut w notatkach dla recenzenta pochodzi z kodu; propozycje opisu sklepu (docs/48 pkt 6) nie odwołują się do źródeł,
 * ekranu „Źródła wiedzy” ani rysunków dla całej biblioteki (1.1). */
import fs from 'fs';
import path from 'path';
import { MIN_LIVE_MINUTES_FOR_DAY } from '@/lib/access';

const read = (f: string) => fs.readFileSync(path.join(__dirname, '..', f), 'utf8');
const doc = read('docs/48-zgloszenie-1-0.md');
const sekcja = (h: string, next: string) => doc.slice(doc.indexOf(h), doc.indexOf(next));

describe('docs/48: notatki dla recenzenta', () => {
  test(`próg dnia treningowego = ${MIN_LIVE_MINUTES_FOR_DAY} min z lib/access.ts, nie 20`, () => {
    const notatki = sekcja('Co się zmieniło względem wersji z 23.10.2026', 'Dodany akapit o imporcie');
    expect(notatki).toContain(`ponad ${MIN_LIVE_MINUTES_FOR_DAY} minut`);
    expect(notatki).not.toMatch(/20 minut/);
    expect(doc).toContain(`longer than ${MIN_LIVE_MINUTES_FOR_DAY} minutes`);
    expect(doc).not.toMatch(/longer than 20 minutes/);
  });
  test('komentarz pola liveDays w lib/seed.ts podaje próg 7 min (nie 20)', () => {
    expect(read('lib/seed.ts')).not.toMatch(/kwalifikującego się treningu na żywo > 20 min/);
    expect(read('lib/seed.ts')).toContain(`> MIN_LIVE_MINUTES_FOR_DAY (${MIN_LIVE_MINUTES_FOR_DAY} min)`);
  });
});
describe('docs/48 pkt 6: propozycje opisu sklepu', () => {
  const pkt6 = sekcja('**Propozycja zmian (do decyzji D4', '## 7. Otwarte ryzyka');
  test('bez odwołań do źródeł, ekranu „Źródła wiedzy” i rysunków dla całej biblioteki', () => {
    expect(pkt6.length).toBeGreaterThan(500);
    const tabela = pkt6.slice(0, pkt6.indexOf('Uwagi:'));
    expect(tabela).not.toMatch(/źródł|sourc|each with its|Źródła wiedzy/i);
    const nowe = sekcja('**Nowe wyróżniki 1.0**', '**Propozycja zmian');
    expect(nowe).not.toMatch(/źródł|Źródła wiedzy|dla całej biblioteki/i);
  });
});
