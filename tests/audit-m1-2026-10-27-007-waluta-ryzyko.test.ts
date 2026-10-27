/*
 * M1-audytor-generalny-007 (audyt 1.0, 27.10.2026; 02-monetyzacja-502, 01-odkrywanie-001, 09-lokalizacja-002): ryzyko „cena na liście w innej walucie
 * niż pobierana” (T-11, build 1031) jest w rejestrze ryzyk z warunkiem zamknięcia, a lista zgłoszenia 1.0 ma krok sprawdzenia cen w zł na buildzie
 * z App Store przy koncie PL — z jednoznacznym numerem kroku. Rodzaje (docs/20): dane (dokumenty wydania), regresja.
 */
import * as fs from 'fs';
import * as path from 'path';

const read = (f: string) => fs.readFileSync(path.join(__dirname, '..', f), 'utf8');

describe('M1-007: ryzyko waluty w rejestrze i krok listy wydania', () => {
  test('docs/40: wiersz R-WAL w rejestrze ryzyk ma warunek zamknięcia (ceny w PLN w wersji z App Store, konto PL) i stan', () => {
    const row = read('docs/40-lekcje.md').split('\n').find(l => l.startsWith('| R-WAL |'));
    expect(row).toBeTruthy(); const cols = row!.split(' | ');
    expect(cols.length).toBeGreaterThanOrEqual(4); expect(cols[2]).toMatch(/App Store/); expect(cols[2]).toMatch(/PLN|zł/); expect(cols[3]).toMatch(/otwarte|zamknięte/);
    expect(row).toMatch(/konto żony|prawdziwe konto|konto z regionem Polska/); /* fakt od właściciela 27.10.2026: nie konto piaskownicy, tylko prawdziwe konto z regionem PL */
  });
  test('docs/48: krok sprawdzenia cen w zł odsyła do R-WAL; numery kroków Z-NN są jednoznaczne', () => {
    const rows = read('docs/48-zgloszenie-1-0.md').split('\n').filter(l => /^\| Z-\d+ \|/.test(l));
    expect(rows.some(l => /R-WAL/.test(l) && /zł/.test(l))).toBe(true);
    const ids = rows.map(l => l.split(' | ')[0].replace('| ', '')); const dup = ids.filter((x, i) => ids.indexOf(x) !== i);
    expect(dup).toEqual([]);
  });
});
