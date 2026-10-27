/*
 * M1-audytor-generalny-023 (audyt 1.0, 27.10.2026; 07-jakosc-008): dokumenty bramek wydania zgodne z CLAUDE.md (jedno źródło: bramka App Store = jeden
 * pełny katalog E2E na standardowym iPhonie z jednym ponowieniem scenariusza, decyzja właściciela 21.10.2026), z rejestrem ryzyk docs/40 (R-006) i z kodem
 * (interpreter Maestro ma własny zegar 12:00 — tests/maestro-runner.ts maestroNow). Rodzaje (docs/20): dane (dokumenty), regresja.
 */
import * as fs from 'fs';
import * as path from 'path';

const read = (f: string) => fs.readFileSync(path.join(__dirname, '..', f), 'utf8');

describe('M1-023: bramki wydania w dokumentach zgodne z CLAUDE.md', () => {
  test('CLAUDE.md: bramka App Store = pełny katalog z jednym ponowieniem (źródło)', () => {
    expect(read('CLAUDE.md')).toMatch(/Wydanie do App Store blokuje \*\*jeden pełny katalog E2E\s+na standardowym iPhonie\*\* \(jedno ponowienie scenariusza dozwolone\)/);
  });
  test('docs/20: wiersz bramki App Store bez „trybu ścisłego” i z odesłaniem do CLAUDE.md', () => {
    const line = read('docs/20-definicja-ukonczenia.md').split('\n').find(l => l.startsWith('- **Przed buildem (TestFlight):**'))!;
    expect(line).not.toMatch(/trybie ścisłym/); expect(line).toMatch(/jednym ponowieniem scenariusza/); expect(line).toMatch(/CLAUDE\.md/);
  });
  test('docs/48 i docs/40: stan R-006 zgodny (zamknięte w rejestrze ↔ spełnione na liście zgłoszenia)', () => {
    const r40 = read('docs/40-lekcje.md').split('\n').find(l => l.startsWith('| R-006 |'))!; const r48 = read('docs/48-zgloszenie-1-0.md').split('\n').find(l => l.startsWith('| R-006 |'))!;
    expect(r40).toMatch(/zamknięte/); expect(r48).toMatch(/spełnione/);
  });
  test('docs/18: lista znanych problemów nie opisuje błędu zegara interpretera Maestro usuniętego w tests/maestro-runner.ts (maestroNow)', () => {
    expect(read('tests/maestro-runner.ts')).toMatch(/export const maestroNow/);
    expect(read('docs/18-przekazanie.md')).not.toMatch(/Interpreter Maestro w Jest \(tests\/maestro-flows\) liczy czas od zegara maszyny/);
  });
});
