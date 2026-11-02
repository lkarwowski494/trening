/* L-087 (decyzja właściciela 02.11.2026, wariant A; docs/40): test z warunkiem środowiska CI (zmienna GITHUB_ACTIONS) ma strażnika, który obejmuje
 * WSZYSTKIE workflowy uruchamiające ten test. Poprawka 07-jakosc-012 objęła tylko tests.yml i tests-tz.yml padł we wszystkich strefach.
 * Lista: tests/ci-srodowisko.json (plik → strażnik + powód); wzór strażnika: tests/ci-tagi-jest.test.ts. */
import { existsSync, readFileSync, readdirSync } from 'fs';
import { join, relative } from 'path';

const root = join(__dirname, '..');
const WARUNEK = new RegExp('process\\.env\\.' + 'GITHUB_ACTIONS');
type Wpis = { straznik: string; powod: string };
const lista = JSON.parse(readFileSync(join(__dirname, 'ci-srodowisko.json'), 'utf8')) as Record<string, Wpis | string>;
const wpisy = Object.entries(lista).filter(([k]) => !k.startsWith('_')) as [string, Wpis][];

function pliki(d: string): string[] { return readdirSync(d, { withFileTypes: true }).flatMap(e => e.isDirectory() ? pliki(join(d, e.name)) : /\.(ts|tsx|js|mjs)$/.test(e.name) ? [join(d, e.name)] : []); }
/** Pliki z warunkiem CI (poza tym strażnikiem) bez wpisu na liście. */
function bezStraznika(teksty: Record<string, string>, znane: string[], ten = 'tests/ci-srodowisko.test.ts'): string[] {
  return Object.entries(teksty).filter(([p, t]) => p !== ten && WARUNEK.test(t) && !znane.includes(p)).map(([p]) => p);
}

describe('CI: testy z warunkiem GITHUB_ACTIONS mają strażnika (L-087, 02.11.2026)', () => {
  const teksty = Object.fromEntries(pliki(__dirname).map(f => [relative(root, f), readFileSync(f, 'utf8')]));
  test('każdy test z warunkiem CI jest na liście tests/ci-srodowisko.json', () => { expect(bezStraznika(teksty, wpisy.map(([k]) => k))).toEqual([]); });
  test('wpis na liście: test istnieje i nadal ma warunek CI; strażnik istnieje i ma powód', () => {
    for (const [plik, w] of wpisy) {
      expect([plik, existsSync(join(root, plik)) && WARUNEK.test(teksty[plik] ?? '')]).toEqual([plik, true]);
      expect([plik, existsSync(join(root, w.straznik)), w.powod.length > 20]).toEqual([plik, true, true]);
    }
  });
  test('strażnik wpisu pilnuje workflowów: czyta katalog workflowów (nie jeden plik)', () => {
    for (const [, w] of wpisy) expect(readFileSync(join(root, w.straznik), 'utf8')).toMatch(/\.github\/workflows/);
  });
  test('strażnik potrafi paść: nowy test z warunkiem CI bez wpisu jest wykryty', () => {
    const t = { 'tests/nowy.test.ts': 'if (process.env.' + 'GITHUB_ACTIONS) expect(1).toBe(1);', 'tests/inny.test.ts': 'expect(1).toBe(1);' };
    expect(bezStraznika(t, [])).toEqual(['tests/nowy.test.ts']); expect(bezStraznika(t, ['tests/nowy.test.ts'])).toEqual([]);
  });
});
