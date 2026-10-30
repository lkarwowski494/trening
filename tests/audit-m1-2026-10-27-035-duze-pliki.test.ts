/*
 * M1-audytor-generalny-035 (audyt 1.0, 27.10.2026; 05-architekt-004): pliki źródłowe ponad ok. 20 KB — decyzja z planu napraw: backlog z wersją (podział przy
 * najbliższej zmianie danego pliku po 1.0, zamrożenie zakresu przed 1.0), a nowy plik ponad limit blokuje verify (strażnik z listą wyjątków).
 * Rodzaje (docs/20): dane (backlog), regresja (strażnik limitu).
 */
import * as fs from 'fs';
import * as path from 'path';

const read = (f: string) => fs.readFileSync(path.join(__dirname, '..', f), 'utf8');

describe('M1-035: duże pliki źródłowe — backlog z wersją i strażnik', () => {
  test('strażnik limitu 20 KB z listą wyjątków istnieje (tests/architecture-limits.test.ts)', () => {
    const s = read('tests/architecture-limits.test.ts'); expect(s).toMatch(/const LIMIT = 20 \* 1024;/); expect(s).toMatch(/Wyjątki od limitu 20 KB/);
  });
});
