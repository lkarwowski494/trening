/*
 * M1-audytor-generalny-037 część C (03-zakres-008; DEC-07 b, właściciel 27.10.2026: „wybrane przed zgłoszeniem 1.0”): żadna funkcja nie miała
 * kryterium ani wyniku testu pierwszego użycia — T-04 i T-11 znalazł dopiero właściciel na telefonie. Teraz: zapis przejścia poznawczego 5 zadań
 * pętli (docs/design/test-pierwszego-uzycia.md) z Q1–Q4 przy każdym kroku i wynikiem zadania; porażka wskazuje znalezisko; test z ludźmi (część B)
 * jest krokiem właściciela Z-37 w docs/48. Mechanizm: etykiety, na których stoi przejście, muszą istnieć w słowniku — zmiana etykiety czerwieni test
 * i wymusza ponowne przejście kroku (zamiast cichego rozjazdu zapisu z aplikacją). Rodzaje (docs/20): dokument, strażnik.
 */
import * as fs from 'fs';
import * as path from 'path';

const root = path.join(__dirname, '..');
const read = (f: string) => fs.readFileSync(path.join(root, f), 'utf8');
const DOC = 'docs/design/test-pierwszego-uzycia.md';
const ZADANIA = ['Z1', 'Z2', 'Z3', 'Z4', 'Z5'];
const doc = () => read(DOC);
const sekcja = (d: string, z: string) => { const i = d.indexOf(`## ${z}.`); const j = d.indexOf('\n## ', i + 1); return i < 0 ? '' : d.slice(i, j < 0 ? undefined : j); };
/** wiersze tabeli kroków: | # | … | Q1/Q2/Q3/Q4 | … | */
const kroki = (s: string) => s.split('\n').filter(l => /^\| \d+ \|/.test(l)).map(l => l.split('|').map(c => c.trim()));

describe('M1-037 C / 03-zakres-008: zapis przejścia poznawczego 5 zadań pętli (27.10.2026)', () => {
  test('dokument istnieje, ma datę i metodę (Q1–Q4) oraz odwołanie do decyzji DEC-07 b', () => {
    expect(fs.existsSync(path.join(root, DOC))).toBe(true);
    const d = doc();
    expect(d).toMatch(/27\.10\.2026/); expect(d).toMatch(/DEC-07 b/);
    for (const q of ['Q1', 'Q2', 'Q3', 'Q4']) expect(d).toContain(q);
  });
  test.each(ZADANIA)('%s: tabela kroków z oceną Q1–Q4 przy każdym kroku i linia „Wynik”', (z) => {
    const s = sekcja(doc(), z);
    expect(s.length).toBeGreaterThan(100);
    const k = kroki(s);
    expect(k.length).toBeGreaterThan(0);
    for (const w of k) expect({ krok: w[1], ocena: w[4] }).toEqual({ krok: w[1], ocena: expect.stringMatching(/^(\*\*)?(tak|nie|częściowo)(\*\*)?(\/(\*\*)?(tak|nie|częściowo)(\*\*)?){3}$/) });
    expect(s).toMatch(new RegExp(`Wynik ${z}: \\*\\*(pozytywny|negatywny)`));
  });
  test('każda porażka („nie”) wskazuje znalezisko (ID roli albo NZ z wyniku roli 03)', () => {
    for (const z of ZADANIA) for (const w of kroki(sekcja(doc(), z))) {
      if (!/nie/.test(w[4])) continue;
      expect({ z, krok: w[1], id: /\b(\d{2}-[a-z-]+-\d{3}|NZ-\d{3}-\d+)\b/.test(w[5]) }).toEqual({ z, krok: w[1], id: true });
    }
  });
  test('etykiety, na których stoi przejście, istnieją w słowniku (zmiana etykiety = ponowne przejście)', () => {
    const m = /```json\n(\[[\s\S]*?\])\n```/.exec(doc());
    expect(m).not.toBeNull();
    const etykiety = JSON.parse(m![1]) as string[];
    expect(etykiety.length).toBeGreaterThanOrEqual(15);
    const dict = read('lib/i18n.en.ts');
    for (const e of etykiety) expect({ e, wSlowniku: dict.includes(`'${e}':`) }).toEqual({ e, wSlowniku: true });
  });
  test('część (B) — test z 3–5 osobami bez instrukcji: krok właściciela Z-37 w docs/48 i protokół w dokumencie', () => {
    const z37 = read('docs/48-zgloszenie-1-0.md').split('\n').find(l => l.startsWith('| Z-37 |')) ?? '';
    expect(z37).toMatch(/3–5/); expect(z37).toMatch(/bez instrukcji/); expect(z37).toMatch(/właściciel/); expect(z37).toContain(DOC);
    expect(doc()).toMatch(/## Protokół części \(B\)/);
  });
});
