/* Podział Jest na części w tests.yml (10.11.2026): części 3 ucinana limitem 20 min (przebiegi 42751102557, 42747133427, 42743654166), bo domyślny podział Jesta
 * (skrót sha1 ścieżki) dał sumy czasów plików 903 s … 2929 s. Sekwencer scripts/ci/jest-sekwencer.js rozdziela pliki zachłannie po zmierzonym czasie
 * (scripts/ci/czasy-plikow.json); liczba części = czesci_jest z scripts/ci/czasy-tests.json. */
import { execSync } from 'child_process';
import { readFileSync } from 'fs';
import { join } from 'path';

const ROOT = join(__dirname, '..');
// eslint-disable-next-line @typescript-eslint/no-require-imports
const Sekwencer = require('../scripts/ci/jest-sekwencer.js');
const { przydziel } = Sekwencer;
const czasy = JSON.parse(readFileSync(join(ROOT, 'scripts/ci/czasy-plikow.json'), 'utf8')) as { domyslny_s: number; pliki: Record<string, number> };
const N = (JSON.parse(readFileSync(join(ROOT, 'scripts/ci/czasy-tests.json'), 'utf8')) as { czesci_jest: number }).czesci_jest;
const pliki = execSync("git ls-files 'tests/*.test.*'", { cwd: ROOT, encoding: 'utf8' }).split('\n').filter(f => /\.test\.[jt]sx?$/.test(f));

describe('sekwencer części Jest', () => {
  test('package.json wskazuje sekwencer, a plik czasów istnieje i ma wpisy', () => {
    const pkg = JSON.parse(readFileSync(join(ROOT, 'package.json'), 'utf8'));
    expect(pkg.jest.testSequencer).toBe('<rootDir>/scripts/ci/jest-sekwencer.js');
    expect(Object.keys(czasy.pliki).length).toBeGreaterThan(100);
  });
  test('każdy plik trafia do dokładnie jednej części 1..N, wynik jest deterministyczny', () => {
    const a = przydziel(pliki, N); const b = przydziel([...pliki].reverse(), N);
    expect(Object.keys(a.wynik).sort()).toEqual([...pliki].sort());
    for (const p of pliki) { expect(a.wynik[p]).toBeGreaterThanOrEqual(1); expect(a.wynik[p]).toBeLessThanOrEqual(N); }
    expect(b.wynik).toEqual(a.wynik);
  });
  test('części wyrównane: najcięższa nie przekracza średniej o więcej niż 5% (domyślny podział Jesta: 2929 s przy średniej 2115 s)', () => {
    const sumy: number[] = przydziel(pliki, N).sumy; const srednia = sumy.reduce((x, y) => x + y, 0) / N;
    expect(Math.max(...sumy)).toBeLessThanOrEqual(srednia * 1.05);
  });
  test('shard() zwraca rozłączne części pokrywające cały zestaw; plik bez wpisu liczy się jako domyslny_s', () => {
    const rootDir = '/r'; const tests = [...pliki, 'tests/nowy-bez-wpisu.test.ts'].map(p => ({ path: `${rootDir}/${p}`, context: { config: { rootDir } } }));
    const s = new Sekwencer({} as never);
    const czesci = Array.from({ length: N }, (_, i) => s.shard(tests, { shardIndex: i + 1, shardCount: N }));
    expect(czesci.flat().length).toBe(tests.length); expect(new Set(czesci.flat()).size).toBe(tests.length);
    expect(czasy.pliki['tests/nowy-bez-wpisu.test.ts']).toBeUndefined(); expect(czasy.domyslny_s).toBeGreaterThan(0);
  });
});
