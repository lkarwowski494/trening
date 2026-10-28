/* check:pochodne (decyzja właściciela 8a, 28.10.2026; lekcja z docs/40 „naprawy M2 partia 1”, akcja 3 opcja A): jedno polecenie sprawdza wszystkie pliki
   pochodne i szybkie strażniki czytające źródła jako tekst. Pełny przebieg na repo to zadanie haku pre-push i CI (tu: lista kroków i zachowanie na krokach wstrzykniętych). */
import { mkdtempSync, rmSync, writeFileSync, existsSync, readFileSync } from 'fs';
import { tmpdir } from 'os';
import { join } from 'path';
import { spawnSync } from 'child_process';

const root = join(__dirname, '..');
const SKRYPT = join(root, 'scripts/pochodne.mjs');
const pkg = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'));
const tmp: string[] = [];
afterAll(() => { for (const d of tmp) rmSync(d, { recursive: true, force: true }); });
const nowyKatalog = () => { const d = mkdtempSync(join(tmpdir(), 'pochodne-')); tmp.push(d); return d; };
const uruchom = (args: string[] = [], env: Record<string, string> = {}) =>
  spawnSync(process.execPath, [SKRYPT, ...args], { cwd: root, env: { ...process.env, ...env }, encoding: 'utf8' });
const lista = () => uruchom(['--lista']).stdout.trim().split('\n');

describe('check:pochodne — lista kroków (decyzja 8a, 28.10.2026)', () => {
  test('skrypt npm check:pochodne wskazuje scripts/pochodne.mjs', () => {
    expect(pkg.scripts['check:pochodne']).toBe('node scripts/pochodne.mjs');
  });
  test('zawiera wszystkie generatory w trybie --check, wektory BRD, _source.json, zegarek/widżet i strażniki tekstowe', () => {
    const kod = readFileSync(SKRYPT, 'utf8');
    for (const g of ['readme.mjs', 'test-matrix.mjs', 'i18n-context.mjs', 'cues/gen.mjs', 'figures/gen.mjs', 'figures/v2-gen.mjs', 'figures/v2-validate.mjs', 'equipment/gen.mjs', 'flows-catalog.mjs', 'zrodla-runtime.mjs', 'licenses.mjs', 'claims.mjs'])
      expect(kod).toMatch(new RegExp(`'scripts/${g.replace(/[./]/g, '\\$&')}'[^\\n]*'--check'`));
    expect(kod).toContain('kontrola-brd.mjs');
    expect(kod).toContain('tests/wektory/brd.json');
    expect(kod).toContain("'-t', '_source.json'");
    for (const t of ['watch-fixtures', 'watch-apple-i18n', 'widget-i18n']) expect(kod).toContain(`tests/${t}.test.ts`);
    expect(lista()).toHaveLength(16); /* +1: strażniki słowników warunkowo (L-048 A, 28.10.2026) */
  });
  test.each([
    'tests/interaction-guards.test.ts', 'tests/public-repo.test.ts', 'tests/architecture-limits.test.ts',
    'tests/przeplywy.test.ts', 'tests/maestro-tap-tekst-guard.test.ts', 'tests/m3-token-guard.test.ts',
  ])('strażnik tekstowy %s istnieje i jest na liście', plik => {
    expect(existsSync(join(root, plik))).toBe(true);
    expect(readFileSync(SKRYPT, 'utf8')).toContain(`'${plik}'`);
  });
  test('nie wchodzi lint, typecheck ani pełny jest (to robi verify)', () => {
    expect(readFileSync(SKRYPT, 'utf8').split('\n').filter(l => !l.startsWith('//')).join('\n')).not.toMatch(/'lint'|typecheck|'verify'/);
  });
});

describe('check:pochodne — działanie na krokach wstrzykniętych', () => {
  const kroki = (lista: unknown[]) => { const p = join(nowyKatalog(), 'kroki.json'); writeFileSync(p, JSON.stringify(lista)); return p; };
  /* „Generator” z trybem --check: porównuje plik pochodny z wzorcem, jak scripts/*.mjs --check. */
  const generator = (pochodny: string, wzor: string) => {
    const d = nowyKatalog(); const g = join(d, 'gen.mjs'); const p = join(d, 'pochodny.txt');
    writeFileSync(p, pochodny);
    writeFileSync(g, `import {readFileSync} from 'fs'; process.exit(readFileSync(${JSON.stringify(p)},'utf8') === ${JSON.stringify(wzor)} ? 0 : 1);`);
    return g;
  };

  test('wszystkie kroki zielone: kod 0, komunikat „zielone”', () => {
    const g = generator('a\n', 'a\n');
    const r = uruchom([], { POCHODNE_KROKI: kroki([{ nazwa: 'plik A', polecenie: ['node', g], jak: 'x' }, { nazwa: 'plik B', polecenie: ['node', '-e', '0'], jak: 'y' }]) });
    expect(r.status).toBe(0);
    expect(r.stderr).toContain('check:pochodne: zielone (2 kroków');
  });
  test('nieaktualny plik pochodny: kod 1, nazwa kroku i „Jak naprawić” po polsku; pozostałe kroki nadal biegną', () => {
    const stary = generator('stare\n', 'nowe\n');
    const r = uruchom([], { POCHODNE_KROKI: kroki([
      { nazwa: 'plik pochodny', polecenie: ['node', stary], jak: 'node gen.mjs --write, potem git add.' },
      { nazwa: 'drugi, zielony', polecenie: ['node', '-e', '0'], jak: 'z' },
    ]) });
    expect(r.status).toBe(1);
    expect(r.stderr).toContain('BŁĄD plik pochodny');
    expect(r.stderr).toContain('ok  drugi, zielony');
    expect(r.stderr).toContain('Jak naprawić: node gen.mjs --write, potem git add.');
    expect(r.stderr).toContain('1 z 2 kroków czerwone: plik pochodny');
  });
  test('wynik błędnego kroku (stdout/stderr) jest pokazany', () => {
    const r = uruchom([], { POCHODNE_KROKI: kroki([{ nazwa: 'padający', polecenie: ['node', '-e', 'console.error("DOWÓD-BŁĘDU");process.exit(3)'], jak: 'j' }]) });
    expect(r.status).toBe(1);
    expect(r.stderr).toContain('DOWÓD-BŁĘDU');
  });
  test('wektory BRD na prawdziwym repo: zielone', () => {
    const r = uruchom([], { POCHODNE_KROKI: kroki([{ nazwa: 'wektory BRD', funkcja: 'wektoryBrd', jak: 'x' }]) });
    expect(r.stderr).toContain('ok  wektory BRD');
    expect(r.status).toBe(0);
  });
});
