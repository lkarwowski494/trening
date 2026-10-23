/* L-028 (23.10.2026, decyzja właściciela: wariant A): każdy krok dla właściciela w App Store Connect / ustawieniach Apple
 * ma w tej samej sekcji dokumentu adres źródła Apple (developer.apple.com albo support.apple.com) — krok bez źródła bywa nieaktualny. */
import fs from 'fs';
import path from 'path';

const ROOT = path.join(__dirname, '..');
const DOCS = ['docs/43-przekazanie.md', 'docs/15-app-store.md'];
const KROK = /App Store Connect →|Ustawienia → App Store|Users and Access/;
const ZRODLO = /https:\/\/(developer|support)\.apple\.com\//;
/* sekcje sprzed reguły — nagłówek: powód (zapis decyzji albo pojedyncze pole formularza, nie procedura Apple) */
const WYJATKI: Record<string, string> = {
  'K-013. Polityka prywatności: adres w App Store Connect (M1-013)': 'wpisanie adresu w jedno pole formularza ASC, adres pochodzi z repo',
  'Decyzje właściciela': 'zapis decyzji, nie instrukcja krok po kroku',
  'Wzrost i promocja — ustalenia (właściciel 06.10.2026)': 'wzmianka, gdzie szukać liczb po premierze, nie krok',
  'TestFlight — testy wewnętrzne (decyzja właściciela 06.10.2026: „TestFlight — testy wewnętrzne”)': 'procedura jednorazowa wykonana 06–08.10.2026 (aplikacja, klucz API i grupa testerów istnieją)',
};

describe('L-028: kroki dla właściciela w Apple mają źródło', () => {
  for (const plik of DOCS) {
    test(plik, () => {
      const sekcje = fs.readFileSync(path.join(ROOT, plik), 'utf8').split(/^## /m).slice(1);
      const bez = sekcje
        .filter((s) => KROK.test(s) && !ZRODLO.test(s))
        .map((s) => s.split('\n')[0].trim())
        .filter((h) => !(h in WYJATKI));
      expect(bez).toEqual([]);
    });
  }
  test('wyjątki są aktualne (każdy nagłówek nadal istnieje)', () => {
    const wszystko = DOCS.map((p) => fs.readFileSync(path.join(ROOT, p), 'utf8')).join('\n');
    for (const h of Object.keys(WYJATKI)) expect(wszystko).toContain(`## ${h}`);
  });
});
