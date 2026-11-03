/* M1-audytor-generalny-059: `npm run test:fast` działa na Windows (bez spawnSync('npx') → ENOENT) i zmiana scenariusza Maestro uruchamia
   tests/maestro-flows.test.tsx. Skrypt ma tryb --plan (bez uruchamiania Jesta); zmienione pliki można podać w TEST_FAST_CHANGED. */
import { execFileSync } from 'child_process';
import { readFileSync } from 'fs';
import { join } from 'path';

const script = join(__dirname, '../scripts/test-fast.mjs');
const plan = (changed: string[]) => JSON.parse(execFileSync('node', [script, '--plan'], { encoding: 'utf8', env: { ...process.env, TEST_FAST_CHANGED: changed.join('\n') } }));

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
  test('dokumenty i pliki bez kodu nie uruchamiają testów; brak zmian — pusty plan', () => {
    expect(plan(['docs/40-lekcje.md', 'README.md']).files).toEqual([]);
    expect(plan([]).files).toEqual([]);
  });
  test('zmiana pliku testu i kodu: pliki bez duplikatów', () => {
    expect(plan(['lib/units.ts', 'lib/units.ts', 'tests/units.test.ts']).files).toEqual(['lib/units.ts', 'tests/units.test.ts']);
  });
  test('1.0.1 (lekcja L-NNN): zmiana słownika (lib/locales, locales, lib/i18n.en.ts) uruchamia testy plików generowanych z niego — jest ich nie wiąże import', () => {
    for (const f of ['lib/locales/pt-BR.json', 'locales/el.json', 'lib/i18n.en.ts']) {
      expect(plan([f]).files).toEqual(expect.arrayContaining([f, 'tests/watch-apple-i18n.test.ts', 'tests/widget-i18n.test.ts', 'tests/health-permissions.test.ts', 'tests/i18n-locales.test.ts']));
    }
    expect(plan(['lib/units.ts']).files).toEqual(['lib/units.ts']);
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
    const p = JSON.parse(execFileSync('node', [script, '--plan', '--od-bazy'], { cwd: d, env: E, encoding: 'utf8' }));
    expect(p.files.sort()).toEqual(['lib/a.ts', 'lib/b.ts', 'lib/c.ts']); expect(p.baza).toMatch(/^[0-9a-f]{40}$/);
    const bez = JSON.parse(execFileSync('node', [script, '--plan'], { cwd: d, env: E, encoding: 'utf8' }));
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
