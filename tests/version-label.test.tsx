/* Numerowanie wersji (decyzja właściciela 09.10.2026, wariant A, docs/18): w „O aplikacji” widać „<wersja> (<build>)”, np. „0.11.0 (1005)”,
 * żeby tester mógł podać build przy zgłoszeniu. Build wpisuje CI (testflight.yml → EXPO_PUBLIC_BUILD_NUMBER, ten sam co CFBundleVersion);
 * bez niego (lokalnie, testy, E2E) — sama wersja. Bez nowych modułów natywnych. */
import * as fs from 'fs';
import { versionLabel } from '@/lib/version';

describe('wersja z numerem buildu', () => {
  test('wersja + build; bez buildu — sama wersja; puste i niecyfrowe wartości pomijane', () => {
    expect(versionLabel('0.11.0', '1005')).toBe('0.11.0 (1005)');
    expect(versionLabel('0.11.0', undefined)).toBe('0.11.0');
    expect(versionLabel('0.11.0', '')).toBe('0.11.0');
    expect(versionLabel('0.11.0', 'abc')).toBe('0.11.0');
    expect(versionLabel(undefined, '1005')).toBe('— (1005)');
  });
  test('CI: testflight.yml przekazuje numer buildu do aplikacji (ta sama wartość co CFBundleVersion)', () => {
    const y = fs.readFileSync('.github/workflows/testflight.yml', 'utf8');
    expect(y).toMatch(/EXPO_PUBLIC_BUILD_NUMBER=\$\(\(BUILD_BASE \+ GITHUB_RUN_NUMBER\)\)/);
  });
  test('ekran „O aplikacji” używa versionLabel', () => {
    expect(fs.readFileSync('app/more/about.tsx', 'utf8')).toContain('versionLabel(');
  });
});
