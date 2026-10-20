/*
 * M1-audytor-generalny-061: docs/20 (definicja ukończenia) twierdziła „26 języków” i „24 plikach” (jest 35), a o E2E mówiła stanem sprzed podziału
 * na pakiet podstawowy i pełny katalog (19.10.2026). Test: docs/20 nie podaje liczby języków innej niż LANGS.length (albo żadnej)
 * oraz opisuje E2E zgodnie z workflowami (pakiet podstawowy blokuje TestFlight, pełny katalog nocą).
 * Nagłówek e2e-ios.yml (workflow) jest poza zakresem tej poprawki — patrz raport partii 4.
 */
import * as fs from 'fs';
import * as path from 'path';
import { LANGS } from '@/lib/i18n';

const doc = fs.readFileSync(path.join(__dirname, '..', 'docs', '20-definicja-ukonczenia.md'), 'utf8');

describe('docs/20: deklaracje jakości zgodne ze stanem', () => {
  test('liczba języków w docs/20 (jeśli podana) = LANGS.length', () => {
    const counts = [...doc.matchAll(/(\d+)\s*(?:języków|języki|języka|plikach|plików)/gi)].map((m) => Number(m[1]));
    expect(counts.filter((n) => n !== LANGS.length)).toEqual([]);
  });
  test('rodzaj 7: „od 07.10.2026” z liczbą 26 nie występuje (liczba z kodu, nie z dokumentu)', () => {
    expect(doc).not.toMatch(/\b26\b/);
  });
  test('E2E: pakiet podstawowy blokuje TestFlight, pełny katalog nocą (zgodnie z CLAUDE.md i nightly.yml)', () => {
    expect(doc).toMatch(/pakiet podstawowy/i);
    expect(doc).toMatch(/pełny katalog/i);
    expect(doc).not.toMatch(/GOTOWE DO BUILDU/);
  });
  test('workflowy wymienione w docs/20 istnieją', () => {
    for (const m of doc.matchAll(/`([a-z0-9-]+\.yml)`/g)) {
      expect(fs.existsSync(path.join(__dirname, '..', '.github', 'workflows', m[1]))).toBe(true);
    }
  });
});
