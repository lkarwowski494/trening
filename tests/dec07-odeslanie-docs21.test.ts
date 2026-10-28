/*
 * Odesłanie z wpisu DEC-07 (karty P2, docs/18) do docs/21 musi mieć pokrycie w pozycjach backlogu
 * [M1-audytor-generalny-009; 04-studio-projektowe-003; decyzja DEC-02 a, 27.10.2026].
 * Powód: wpis DEC-07 mówił „1.0.1: podgląd liczb (DEC-01 a) i krok importu (DEC-04 a) — docs/21”, a w docs/21 nie było żadnej z tych pozycji.
 * Rodzaje (docs/20): dane (zgodność dwóch dokumentów), regresja (04-studio-projektowe-003).
 */
import * as fs from 'fs';
import * as path from 'path';

const ROOT = path.join(__dirname, '..');
const czytaj = (p: string) => fs.readFileSync(path.join(ROOT, p), 'utf8');
const D18 = czytaj('docs/18-przekazanie.md');
const D21 = czytaj('docs/21-roadmapa-offline.md');

/** Pozycje 1.0.1 wymienione we wpisie DEC-07 po „1.0.1:” — każda ma pozycję backlogu z wersją 1.0.1 w docs/21. */
const POZYCJE: { nazwa: string; wpisD18: RegExp; wD21: RegExp }[] = [
  { nazwa: 'podgląd liczb (DEC-01 a)', wpisD18: /1\.0\.1: podgląd liczb \(DEC-01 a\)/, wD21: /^- \*\*Podgląd liczb po przytrzymaniu\*\*.*DEC-01 a.*Wersja:\*\* 1\.0\.1/m },
  { nazwa: 'krok importu (DEC-04 a)', wpisD18: /krok importu \(DEC-04 a\)/, wD21: /^- \*\*Krok „zaimportuj historię” w Pierwszych krokach\*\*.*DEC-04 a.*Wersja:\*\* 1\.0\.1/m },
];

describe('DEC-07 w docs/18 odsyła do docs/21 tylko po pozycje, które tam są', () => {
  const wpis = D18.split('\n').find(l => l.startsWith('- DEC-07 — karty P2')) ?? '';
  it('wpis DEC-07 (karty P2) istnieje i odsyła do docs/21', () => {
    expect(wpis).not.toBe('');
    expect(wpis).toContain('docs/21');
  });
  it.each(POZYCJE)('$nazwa: wpis w docs/18 ma pozycję 1.0.1 w docs/21', ({ wpisD18, wD21 }) => {
    expect(wpis).toMatch(wpisD18);
    expect(D21).toMatch(wD21);
  });
});
