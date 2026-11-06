/**
 * Wydanie 1.0.0 — pierwsza wersja w App Store (decyzja właściciela 14.10.2026, docs/18; docs/48 Z-05): zawartość 0.20 + poprawki z audytu, bez nowych funkcji.
 * Wersja projektu i historia „Co nowego” od 1.0.1: tests/release-1.0.1.test.tsx (decyzja właściciela 06.11.2026); wersja 1.0.0 (b1033) jest wydana w App Store 05.11.2026. Wpisy 0.10–0.20 i ich testy (release-0.12…0.20) są w historii git.
 * Pole „What's New” w App Store Connect nie dotyczy pierwszej wersji (docs/48, pkt 8); „What to Test” dla TestFlight: docs/49.
 */
import { WHATS_NEW } from '@/lib/whatsnew';

const fs = require('fs') as typeof import('fs'); const path = require('path') as typeof import('path');
const J = (f: string) => JSON.parse(fs.readFileSync(path.join(__dirname, '..', f), 'utf8'));

describe('wydanie 1.0.0', () => {
  test('historia „Co nowego”: w 1.0.0 była pusta (decyzja 14.10.2026), od 1.0.1 ma jeden wpis (zastąpione 06.11.2026; tests/release-1.0.1.test.tsx)', () => {
    expect(WHATS_NEW.length).toBe(1);
  });
  test('dziennik wydań (docs/09) ma wiersz złożenia 1.0.0', () => {
    const d09 = fs.readFileSync(path.join(__dirname, '..', 'docs/09-plan-testow.md'), 'utf8');
    expect(d09).toMatch(/\| Wydanie 1\.0\.0 /);
  });
});
