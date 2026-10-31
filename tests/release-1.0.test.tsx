/**
 * Wydanie 1.0.0 — pierwsza wersja w App Store (decyzja właściciela 14.10.2026, docs/18; docs/48 Z-05): zawartość 0.20 + poprawki z audytu, bez nowych funkcji.
 * Wersja projektu 1.0.0 w app.json, package.json i package-lock.json; historia „Co nowego” wyczyszczona (to pierwsza wersja, nie ma zmian względem poprzedniej),
 * więc ekran Trening nie ma przycisku ✦ — zachowanie pustej historii: tests/whats-new.test.tsx. Wpisy 0.10–0.20 i ich testy (release-0.12…0.20) są w historii git.
 * Pole „What's New” w App Store Connect nie dotyczy pierwszej wersji (docs/48, pkt 8); „What to Test” dla TestFlight: docs/49.
 */
import { WHATS_NEW } from '@/lib/whatsnew';

const fs = require('fs') as typeof import('fs'); const path = require('path') as typeof import('path');
const J = (f: string) => JSON.parse(fs.readFileSync(path.join(__dirname, '..', f), 'utf8'));

describe('wydanie 1.0.0', () => {
  /* 31.10.2026 (właściciel ~07:00 PL, 1A, przez koordynatora 1.0): linia 1.0.1 nie wychodzi osobno, ale build TestFlight do testu na telefonie
     ma wersję 1.0.1, żeby nie mylić go z buildem 1.0.0 w zgłoszeniu do recenzji Apple; historia „Co nowego” zostaje pusta (to nie wydanie w App Store). */
  test('app.json, package.json i package-lock.json (projekt) — 1.0.1 (build testowy linii 1.0.1, 31.10.2026)', () => {
    const lock = J('package-lock.json');
    expect([J('app.json').expo.version, J('package.json').version, lock.version, lock.packages[''].version]).toEqual(['1.0.1', '1.0.1', '1.0.1', '1.0.1']);
  });
  test('historia „Co nowego” pusta (pierwsza wersja w App Store)', () => {
    expect(WHATS_NEW).toEqual([]);
  });
  test('dziennik wydań (docs/09) ma wiersz złożenia 1.0.0', () => {
    const d09 = fs.readFileSync(path.join(__dirname, '..', 'docs/09-plan-testow.md'), 'utf8');
    expect(d09).toMatch(/\| Wydanie 1\.0\.0 /);
  });
});
