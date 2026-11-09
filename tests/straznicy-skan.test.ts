// skanuje: tests
/* L-122 (09.11.2026): strażnicy skanujący katalogi przez fs (np. no-wallclock-asserts i straznik-zegar czytają cały tests/) nie mają krawędzi importu do skanowanych plików, więc
   `test:fast` nie wybierał ich po dodaniu nowego testu (lokalnie zielono, w CI czerwono; klasa L-100/L-104/L-114). Mechanizm: znacznik w nagłówku testu (patrz scripts/testy-dla-plikow.mjs,
   `testySkanujace`) + ten strażnik: każdy test czytający tests/ ma znacznik, a znaczniki wskazują istniejące ścieżki. */
import { execFileSync } from 'child_process';
import { existsSync, readdirSync, readFileSync } from 'fs';
import { join } from 'path';

const ROOT = join(__dirname, '..');
const script = join(ROOT, 'scripts/test-fast.mjs');
const plan = (changed: string[]) => JSON.parse(execFileSync('node', [script, '--plan'], { encoding: 'utf8', env: { ...process.env, TEST_FAST_CHANGED: changed.join('\n') } })) as { files: string[] };
const testy = readdirSync(__dirname).filter(f => /\.test\.tsx?$/.test(f));
const zrodlo = (f: string) => readFileSync(join(__dirname, f), 'utf8');
/** Deklaracje w nagłówku: wiersz zaczynający się od dwóch ukośników i słowa „skanuje” z dwukropkiem. */
const deklaracje = (src: string) => [...src.matchAll(/^[ \t]*\/\/[ \t]*skanuje:[ \t]*(.+)$/gm)].flatMap(m => m[1].split(',')).map(s => s.trim()).filter(Boolean);
/** Test czyta katalog tests/: readdirSync(__dirname), readdirSync(<zmienna = __dirname>) albo readdirSync(join(…, 'tests')). */
const czytaTests = (src: string) => {
  const zmienne = [...src.matchAll(/\b(?:const|let|var)\s+(\w+)\s*=\s*__dirname\b/g)].map(m => m[1]);
  const arg = `(?:__dirname|${zmienne.length ? zmienne.join('|') + '|' : ''}(?:path\\.)?join\\([^)]*['"]tests['"]\\s*\\))`;
  return new RegExp(`\\breaddirSync\\(\\s*${arg}\\s*[,)]`).test(src);
};
const ZE_ZNACZNIKIEM = testy.filter(f => deklaracje(zrodlo(f)).length);

describe('strażnicy skanujący pliki przez fs deklarują skanowane ścieżki (L-122, 09.11.2026)', () => {
  test('każdy test czytający katalog tests/ ma znacznik skanuje: tests', () => {
    const bez = testy.filter(f => czytaTests(zrodlo(f)) && !deklaracje(zrodlo(f)).includes('tests'));
    expect(bez).toEqual([]);
  });
  test('wykrywacz rozpoznaje znane przypadki (no-wallclock-asserts, straznik-zegar)', () => {
    expect(testy.filter(f => czytaTests(zrodlo(f)))).toEqual(expect.arrayContaining(['no-wallclock-asserts.test.ts', 'straznik-zegar.test.ts']));
  });
  test('każda deklarowana ścieżka istnieje w repozytorium (literówka nie wyłącza wyboru po cichu)', () => {
    const brak = ZE_ZNACZNIK_SCIEZKI().filter(([, p]) => !existsSync(join(ROOT, p))).map(([f, p]) => `${f}: ${p}`);
    expect(brak).toEqual([]);
  });
  test('nowy plik testu w tests/ wybiera strażników skanujących tests/ (przypadek wyjściowy: no-wallclock-asserts, straznik-zegar)', () => {
    const p = plan(['tests/nowy-test-z-asercja-czasu.test.ts']).files;
    expect(p).toEqual(expect.arrayContaining(['tests/no-wallclock-asserts.test.ts', 'tests/straznik-zegar.test.ts']));
    const wszyscy = ZE_ZNACZNIK_SCIEZKI().filter(([, s]) => s === 'tests').map(([f]) => `tests/${f}`);
    expect(p).toEqual(expect.arrayContaining(wszyscy));
  });
  test('zmiana kodu pod deklarowaną ścieżką (nie tylko dodanie) też wybiera strażnika; plik spoza deklaracji nie', () => {
    expect(plan(['tests/setup-limity-czasu.js']).files).toContain('tests/kontrola-czasu-testu.test.ts');
    expect(plan(['tests/czas-testu-wyjatki.json']).files).toContain('tests/kontrola-czasu-testu.test.ts');
    expect(plan(['lib/units.ts']).files).not.toContain('tests/no-wallclock-asserts.test.ts');
    expect(plan(['docs/20-definicja-ukonczenia.md']).files).not.toContain('tests/straznik-zegar.test.ts');
  });
  test('usunięcie albo zmiana nazwy testu (plik już nie istnieje) też wybiera strażników tests/', () => {
    expect(plan(['tests/usuniety-test.test.tsx']).files).toContain('tests/no-wallclock-asserts.test.ts');
  });
});

function ZE_ZNACZNIK_SCIEZKI(): [string, string][] {
  return ZE_ZNACZNIKIEM.flatMap(f => deklaracje(zrodlo(f)).map((p): [string, string] => [f, p]));
}
