/*
 * M1-023 (DEC-07 K2, 23.10.2026): turkus zostaje do 1.0 jako „drugi akcent informacyjny”. Decyzja ma być zapisana w docs/32 (wzorce)
 * i zgadzać się z kodem: token `band` istnieje w obu motywach, jest innym kolorem niż akcent główny i nie jest tokenem przycisku głównego.
 */
import * as fs from 'fs';
import * as path from 'path';
import { light, dark } from '../docs/design/tokeny';

const root = path.join(__dirname, '..');
const doc = fs.readFileSync(path.join(root, 'docs/32-wzorce-interakcji.md'), 'utf8');

describe('turkus jako drugi akcent informacyjny (M1-023)', () => {
  test('docs/32 zapisuje decyzję DEC-07 K2 z datą, tokenem i porządkiem w 1.0.x', () => {
    expect(doc).toMatch(/Turkus jako drugi akcent informacyjny \(DEC-07 K2, właściciel 23\.10\.2026/);
    expect(doc).toContain('`band`');
    expect(doc).toMatch(/orządek użycia turkusu w całej aplikacji — w 1\.0\.x/);
  });
  test('wartości tokenu `band` z docs/32 = tokeny w obu motywach', () => {
    expect(doc).toContain(`\`${light.band}\``);
    expect(doc).toContain(`\`${dark.band}\``);
  });
  test('turkus nie jest akcentem głównym ani kolorem przycisku głównego', () => {
    for (const th of [light, dark]) {
      expect(th.band.toLowerCase()).not.toBe(th.accent.toLowerCase());
      expect(th.band.toLowerCase()).not.toBe(th.accentInk.toLowerCase());
    }
  });
});
