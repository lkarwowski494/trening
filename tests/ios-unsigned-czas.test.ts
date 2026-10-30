/*
 * ios-unsigned.yml (30.10.2026, koordynator 1.0.1): przebieg 41036034159 przerwany limitem zadania 60 min — Jest na macOS trwał 47 min
 * (11466 testów, --maxWorkers=2), na kompilację zostało 10 min. Jest biegnie w całości w tests.yml (npm run verify) przy każdym wypchnięciu,
 * więc ios-unsigned sprawdza tylko to, czego Linux nie sprawdzi (konfiguracja natywna, Swift, kompilacja), plus szybkie typy i tłumaczenia.
 */
import { readFileSync } from 'fs';
import { join } from 'path';

const wf = (n: string) => readFileSync(join(__dirname, '..', '.github/workflows', n), 'utf8');

describe('ios-unsigned.yml: bez zdublowanego Jesta (30.10.2026)', () => {
  const ios = wf('ios-unsigned.yml');
  test('nie uruchamia Jesta (npm test / jest)', () => {
    expect(ios).not.toMatch(/npm (run )?test\b|npx jest|jest-ponow|run:.*\bjest\b/);
  });
  test('zostają typy, tłumaczenia, konfiguracja natywna, Swift i kompilacja', () => {
    for (const s of ['npm run typecheck', 'npm run check:i18n', 'npm run verify:native', 'swift test', 'xcodebuild']) expect(ios).toContain(s);
  });
  test('tests.yml uruchamia pełne verify (z Jestem) przy każdym wypchnięciu', () => {
    const t = wf('tests.yml');
    expect(t).toMatch(/on:\s*\n\s*push:/);
    expect(t).toMatch(/run: npm run verify\s*$/m);
  });
});
