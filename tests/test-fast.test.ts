/* M1-audytor-generalny-059: `npm run test:fast` działa na Windows (bez spawnSync('npx') → ENOENT) i zmiana scenariusza Maestro uruchamia
   tests/maestro-flows.test.tsx. Skrypt ma tryb --plan (bez uruchamiania Jesta); zmienione pliki można podać w TEST_FAST_CHANGED. */
import { execFileSync } from 'child_process';
import { readFileSync } from 'fs';
import { join } from 'path';

const script = join(__dirname, '../scripts/test-fast.mjs');
const plan = (changed: string[]) => JSON.parse(execFileSync('node', [script, '--plan'], { encoding: 'utf8', env: { ...process.env, TEST_FAST_CHANGED: changed.join('\n') } }));

/* 05.11.2026: testy renderujące router dokładane do planu przy zmianie kodu aplikacji nie należą do asercji o samym powiązaniu importami */
/* składane, by źródło tego testu samo nie wyglądało jak test renderujący router */
const RR = 'renderRouter(' + "'./app'";
const bezDymnych = (f: string) => f !== 'tests/smoke.test.tsx';

/** Korzeń próbny z własną kopią skryptów i katalogiem tests/ (korzeń wyboru testów to katalog skryptu, nie bieżący katalog): bez niego plan czytałby prawdziwe tests/. */
const korzenProbny = (testy: Record<string, string> = {}): { script: string; root: string } => {
  const { cpSync, mkdirSync, mkdtempSync, symlinkSync, writeFileSync } = require('fs'); const { tmpdir } = require('os');
  const root = mkdtempSync(join(tmpdir(), 'tfk-')); mkdirSync(join(root, 'scripts')); mkdirSync(join(root, 'tests'));
  for (const f of ['test-fast.mjs', 'testy-dla-plikow.mjs']) cpSync(join(__dirname, '../scripts', f), join(root, 'scripts', f));
  for (const [n, z] of Object.entries(testy)) writeFileSync(join(root, 'tests', n), z);
  symlinkSync(join(__dirname, '../node_modules'), join(root, 'node_modules')); return { script: join(root, 'scripts/test-fast.mjs'), root };
};

describe('test:fast (M1-059)', () => {
  test('jest uruchamiany przez node i plik jest.js, nie przez npx (npx na Windows to npx.cmd → ENOENT)', () => {
    const p = plan(['lib/units.ts']);
    expect(p.command).toBe(process.execPath);
    expect(p.args[0]).toMatch(/jest[\\/]bin[\\/]jest\.js$/);
    expect(p.args).toEqual(expect.arrayContaining(['--findRelatedTests', 'lib/units.ts']));
    expect(readFileSync(script, 'utf8')).not.toMatch(/spawnSync\(\s*'npx'/);
  });
  test('zmiana samego scenariusza .maestro/NN-*.yaml dodaje tests/maestro-flows.test.tsx', () => {
    const p = plan(['.maestro/09-jezyk-wyglad.yaml']);
    expect(p.files).toEqual(expect.arrayContaining(['.maestro/09-jezyk-wyglad.yaml', 'tests/maestro-flows.test.tsx']));
  });
  test('dokumenty i pliki bez kodu, których nie czyta żaden test, nie uruchamiają testów; brak zmian — pusty plan (od 04.11.2026, L-100: dokument czytany przez test uruchamia ten test — tests/waskie-gardla-zb041.test.ts)', () => {
    expect(plan(['docs/nikt-tego-' + 'nie-czyta.md', 'notatka-' + 'nikt.md']).files).toEqual([]);
    expect(plan([]).files).toEqual([]);
  });
  test('zmiana pliku testu i kodu: pliki bez duplikatów', () => {
    expect(plan(['lib/units.ts', 'lib/units.ts', 'tests/units.test.ts']).files.filter(bezDymnych)).toEqual(['lib/units.ts', 'tests/units.test.ts']);
  });
  test('1.0.1 (lekcja L-NNN): zmiana słownika (lib/locales, locales, lib/i18n.en.ts) uruchamia testy plików generowanych z niego — jest ich nie wiąże import', () => {
    for (const f of ['lib/locales/pt-BR.json', 'locales/el.json', 'lib/i18n.en.ts']) {
      expect(plan([f]).files).toEqual(expect.arrayContaining([f, 'tests/watch-apple-i18n.test.ts', 'tests/widget-i18n.test.ts', 'tests/health-permissions.test.ts', 'tests/i18n-locales.test.ts']));
    }
    expect(plan(['lib/units.ts']).files.filter(bezDymnych)).toEqual(['lib/units.ts']);
  });
});

/* Decyzja właściciela 03.11.2026 (wariant A): verify:szybkie liczy zmienione pliki od wspólnego przodka z origin/integracja-1-1 albo origin/main — nie tylko niezacommitowane. */
describe('test:fast --od-bazy (03.11.2026)', () => {
  const { mkdtempSync, writeFileSync, mkdirSync, rmSync } = require('fs'); const { tmpdir } = require('os');
  const E = { ...process.env, GIT_AUTHOR_NAME: 't', GIT_AUTHOR_EMAIL: 't@e.invalid', GIT_COMMITTER_NAME: 't', GIT_COMMITTER_EMAIL: 't@e.invalid' } as NodeJS.ProcessEnv; delete E.TEST_FAST_CHANGED;
  const g = (cwd: string, ...a: string[]) => execFileSync('git', a, { cwd, env: E, encoding: 'utf8' }).trim();
  const dirs: string[] = []; afterAll(() => { for (const d of dirs) rmSync(d, { recursive: true, force: true }); });
  test('gałąź z kilkoma commitami: plan zawiera pliki ze wszystkich commitów od merge-base, bez plików, które już są na bazie', () => {
    const d = mkdtempSync(join(tmpdir(), 'tf-')); dirs.push(d);
    g(d, 'init', '-q', '-b', 'main'); mkdirSync(join(d, 'lib')); writeFileSync(join(d, 'lib/stare.ts'), '1\n'); g(d, 'add', '-A'); g(d, 'commit', '-q', '-m', 's');
    g(d, 'update-ref', 'refs/remotes/origin/main', 'HEAD'); g(d, 'checkout', '-q', '-b', 'f');
    writeFileSync(join(d, 'lib/a.ts'), '1\n'); g(d, 'add', '-A'); g(d, 'commit', '-q', '-m', '1');
    writeFileSync(join(d, 'lib/b.ts'), '1\n'); g(d, 'add', '-A'); g(d, 'commit', '-q', '-m', '2');
    writeFileSync(join(d, 'lib/c.ts'), '1\n'); /* nieśledzony */
    const k = korzenProbny(); dirs.push(k.root); /* 05.11.2026: pusty tests/ — wynik zależy tylko od różnicy gałęzi, nie od testów prawdziwego repozytorium */
    const p = JSON.parse(execFileSync('node', [k.script, '--plan', '--od-bazy'], { cwd: d, env: E, encoding: 'utf8' }));
    expect(p.files.sort()).toEqual(['lib/a.ts', 'lib/b.ts', 'lib/c.ts']); expect(p.baza).toMatch(/^[0-9a-f]{40}$/);
    const bez = JSON.parse(execFileSync('node', [k.script, '--plan'], { cwd: d, env: E, encoding: 'utf8' }));
    expect(bez.files).toEqual(['lib/c.ts']); /* dotychczasowe zachowanie (względem HEAD) bez zmian */
  });
  test('wybiera bliższą bazę z origin/integracja-1-1 i origin/main; bez żadnej — względem HEAD', () => {
    const d = mkdtempSync(join(tmpdir(), 'tf-')); dirs.push(d);
    g(d, 'init', '-q', '-b', 'main'); writeFileSync(join(d, 'x.ts'), '1\n'); g(d, 'add', '-A'); g(d, 'commit', '-q', '-m', 's');
    const plan = () => JSON.parse(execFileSync('node', [script, '--plan', '--od-bazy'], { cwd: d, env: E, encoding: 'utf8' }));
    expect(plan().baza).toBe(g(d, 'rev-parse', 'HEAD'));
    g(d, 'update-ref', 'refs/remotes/origin/main', 'HEAD'); writeFileSync(join(d, 'y.ts'), '1\n'); g(d, 'add', '-A'); g(d, 'commit', '-q', '-m', 'i');
    g(d, 'update-ref', 'refs/remotes/origin/integracja-1-1', 'HEAD'); writeFileSync(join(d, 'z.ts'), '1\n'); g(d, 'add', '-A'); g(d, 'commit', '-q', '-m', 'f');
    expect(plan().files).toEqual(['z.ts']);
  });
});

/* L-NNN (05.11.2026): tests/smoke.test.tsx renderuje całą aplikację przez renderRouter ze ścieżką napisową ./app i nie importuje ekranów — `jest --findRelatedTests` go nie wybierał, więc zielone
   verify:szybkie wpuściło zmianę etykiety ekranu nowej osoby (tests.yml 42103130652 czerwony). Zmiana kodu app/components/lib dokłada takie testy automatycznie (scripts/testy-dla-plikow.mjs). */
describe('test:fast — testy renderujące router bez krawędzi importu (05.11.2026)', () => {
  const { mkdtempSync, writeFileSync, mkdirSync, rmSync, readdirSync } = require('fs'); const { tmpdir } = require('os');
  const E = { ...process.env, GIT_AUTHOR_NAME: 't', GIT_AUTHOR_EMAIL: 't@e.invalid', GIT_COMMITTER_NAME: 't', GIT_COMMITTER_EMAIL: 't@e.invalid' } as NodeJS.ProcessEnv; delete E.TEST_FAST_CHANGED;
  const g = (cwd: string, ...a: string[]) => execFileSync('git', a, { cwd, env: E, encoding: 'utf8' }).trim();
  const dirs: string[] = []; afterAll(() => { for (const d of dirs) rmSync(d, { recursive: true, force: true }); });
  test.each(['components/Dashboard.tsx', 'app/(tabs)/index.tsx', 'lib/units.ts', 'lib/store.tsx'])('zmiana %s dokłada tests/smoke.test.tsx', f => {
    expect(plan([f]).files).toEqual(expect.arrayContaining([f, 'tests/smoke.test.tsx']));
  });
  test.each([['docs/20-definicja-ukonczenia.md'], ['.maestro/09-jezyk-wyglad.yaml'], ['lib/locales/pt-BR.json'], ['scripts/test-fast.mjs'], ['tests/units.test.ts']])('zmiana %s (nie kod ekranów) nie dokłada tests/smoke.test.tsx', f => {
    expect(plan([f]).files).not.toContain('tests/smoke.test.tsx');
  });
  test('wybór jest automatyczny: każdy test z bezpośrednim wywołaniem renderRouter dla ścieżki ./app w źródle trafia do planu, nowy też', () => {
    const tests = join(__dirname);
    const bezposrednie = readdirSync(tests).filter((f: string) => /\.test\.tsx?$/.test(f) && /\brenderRouter\(\s*['"`]\.\/app['"`]/.test(readFileSync(join(tests, f), 'utf8'))).map((f: string) => `tests/${f}`);
    expect(bezposrednie).toContain('tests/smoke.test.tsx');
    expect(plan(['components/Dashboard.tsx']).files).toEqual(expect.arrayContaining(bezposrednie));
  });
  test('H1 (L-080): gałąź z wcześniejszymi zmianami względem bazy — zmiana kodu w starszym commicie też dokłada test renderujący router; sam commit z dokumentami nie', () => {
    const d = mkdtempSync(join(tmpdir(), 'tf-')); dirs.push(d);
    mkdirSync(join(d, 'components')); mkdirSync(join(d, 'docs'));
    const k = korzenProbny({ 'dym.test.tsx': `await ${RR}, { initialUrl: '/' });\n`, 'inny.test.tsx': `// ${RR}) tylko w komentarzu\n/* ${RR}) */\nexpect(1).toBe(1);\n` }); dirs.push(k.root);
    const planOd = () => JSON.parse(execFileSync('node', [k.script, '--plan', '--od-bazy'], { cwd: d, env: E, encoding: 'utf8' }));
    writeFileSync(join(d, 'README.txt'), 'r\n');
    g(d, 'init', '-q', '-b', 'main'); g(d, 'add', '-A'); g(d, 'commit', '-q', '-m', 's'); g(d, 'update-ref', 'refs/remotes/origin/main', 'HEAD'); g(d, 'checkout', '-q', '-b', 'f');
    writeFileSync(join(d, 'components/X.tsx'), '1\n'); g(d, 'add', '-A'); g(d, 'commit', '-q', '-m', 'kod');
    writeFileSync(join(d, 'docs/n.md'), 'x\n'); g(d, 'add', '-A'); g(d, 'commit', '-q', '-m', 'doc');
    const p = planOd();
    expect(p.files).toEqual(expect.arrayContaining(['components/X.tsx', 'tests/dym.test.tsx'])); expect(p.files).not.toContain('tests/inny.test.tsx');
    g(d, 'checkout', '-q', '-b', 'g', 'main'); mkdirSync(join(d, 'docs'), { recursive: true }); writeFileSync(join(d, 'docs/n.md'), 'x\n'); g(d, 'add', '-A'); g(d, 'commit', '-q', '-m', 'doc');
    expect(planOd().files).not.toContain('tests/dym.test.tsx');
  });
});
