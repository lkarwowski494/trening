/* L-028 (23.10.2026, decyzja właściciela: wariant A): każdy krok dla właściciela w App Store Connect / ustawieniach Apple
 * ma w tej samej sekcji dokumentu adres źródła Apple (developer.apple.com albo support.apple.com) — krok bez źródła bywa nieaktualny. */
import fs from 'fs';
import path from 'path';

const ROOT = path.join(__dirname, '..');
const DOCS = ['docs/15-app-store.md']; /* docs/43: tests/dokumenty-na-dysk.test.ts (idzie na Dysk przy przeniesieniu, docs/46) */
const KROK = /App Store Connect →|Ustawienia → App Store|Users and Access/;
const ZRODLO = /https:\/\/(developer|support)\.apple\.com\//;
/* sekcje sprzed reguły — nagłówek: powód (zapis decyzji albo pojedyncze pole formularza, nie procedura Apple) */
const WYJATKI: Record<string, string> = {
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

/* Decyzja właściciela 30.10.2026, wariant A (lekcja o krokach zgłoszenia 1.0 w docs/40): w docs/48 żadne „nieprzeczytane” ani otwarte pytanie
 * ([OTWARTE], [DO USTALENIA]) poza tabelą kroków nie wisi bez kroku Z-NN — Content Rights było „nieprzeczytane” bez kroku i zablokowało „Add for Review”. */
describe('docs/48: luka bez kroku (30.10.2026)', () => {
  const linie = fs.readFileSync(path.join(ROOT, 'docs/48-zgloszenie-1-0.md'), 'utf8').split('\n');
  const KONWENCJA = 'Gdzie dokumentacja Apple czegoś nie mówi'; /* zdanie opisujące samo oznaczenie */
  test('brak słowa „nieprzeczytane” (przeczytaj stronę Apple albo dodaj krok Z-NN)', () => {
    expect(linie.filter(l => /nieprzeczytan/i.test(l))).toEqual([]);
  });
  test('[OTWARTE] / [DO USTALENIA] poza wierszem tabeli kroków wskazuje krok Z-NN', () => {
    const bez = linie.filter(l => /\[(OTWARTE|DO USTALENIA)\]/.test(l) && !l.startsWith('| Z-') && !/^\| D\d/.test(l) /* tabela decyzji: opis opcji */ && !/\bZ-\d+/.test(l) && !l.includes(KONWENCJA) && !/wcześniej \[OTWARTE\]/.test(l));
    expect(bez).toEqual([]);
  });
});
