/*
 * KO-038 (koordynator 11.11.2026, analogia ZB-041 G3/G8, do weta właściciela; lekcja sesji K o SIGTERM workerów Jest w kontenerze): plik, którego worker Jest
 * został ubity z zewnątrz, jest uruchamiany ponownie raz, osobno (--runInBand), z wpisem w logu; verify zapisuje znacznik tylko po zielonym ponowieniu.
 * Pokrewne komunikaty Jest 29.7 (jest-worker, ChildProcessWorker._onExit) — sprawdzone na prawdziwym Jest 11.11.2026:
 *   „was terminated by another process: signal=SIGTERM|SIGKILL” (od 29.10.2026), „crashed for an unknown reason: exitCode=143|137” (128 + 15/9: sygnał przez proces
 *   pośredni) i „Jest worker ran out of memory and crashed” (ponowienie dostaje większą stertę, scripts/ci/jest-sterta.json).
 * W odróżnieniu od tests/jest-ponow-29-10-2026.test.ts (sztuczny uruchamiacz) tu działa PRAWDZIWY Jest: plik testowy sam zabija swój worker przy pierwszym uruchomieniu.
 * Przypadek L-080: repozytorium próbne na gałęzi z wcześniejszymi zmianami kodu względem main (i commitem z samymi dokumentami na końcu) — ponowienie nie zależy od bazy.
 */
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import { execFileSync, spawnSync } from 'child_process';

const ROOT = path.join(__dirname, '..');
const JEST = path.join(ROOT, 'node_modules/jest/bin/jest.js');
const ENV_GIT = { GIT_AUTHOR_NAME: 't', GIT_AUTHOR_EMAIL: 't@t', GIT_COMMITTER_NAME: 't', GIT_COMMITTER_EMAIL: 't@t' };

/** Sposób, w jaki plik b.test.js kończy swój worker przy pierwszym uruchomieniu (marker w katalogu = drugie uruchomienie przechodzi). */
const ZABICIE = {
  sigterm: "process.kill(process.pid, 'SIGTERM'); return new Promise(() => {});",
  sigkill: "process.kill(process.pid, 'SIGKILL'); return new Promise(() => {});",
  kod143: 'process.exit(143);',
  kod137: 'process.exit(137);',
  pamiec: "process.stderr.write('FATAL ERROR: Reached heap limit Allocation failed - JavaScript heap out of memory\\n'); setTimeout(() => process.exit(134), 50); return new Promise(() => {});",
  kod0: 'process.exit(0);', /* „crashed for an unknown reason: exitCode=0” — nie sygnał, bez ponowienia */
  asercja: 'expect(1).toBe(2);',
} as const;

/** Repozytorium próbne (L-080): main → gałąź z kodem → commit z samymi dokumentami; skrypt i liczby sterty skopiowane z repo. */
function repo(zabicie: keyof typeof ZABICIE, zawsze = false) {
  const dir = fs.realpathSync(fs.mkdtempSync(path.join(os.tmpdir(), 'ko038-')));
  const git = (...a: string[]) => execFileSync('git', a, { cwd: dir, env: { ...process.env, ...ENV_GIT } });
  fs.mkdirSync(path.join(dir, 'scripts/ci'), { recursive: true });
  fs.copyFileSync(path.join(ROOT, 'scripts/jest-ponow.mjs'), path.join(dir, 'scripts/jest-ponow.mjs'));
  fs.copyFileSync(path.join(ROOT, 'scripts/ci/jest-sterta.json'), path.join(dir, 'scripts/ci/jest-sterta.json'));
  fs.writeFileSync(path.join(dir, 'jest.config.json'), JSON.stringify({ rootDir: dir, testEnvironment: 'node', testMatch: ['**/tests/*.test.js'], transform: {}, cacheDirectory: path.join(dir, '.cache') }));
  fs.writeFileSync(path.join(dir, '.gitignore'), '.cache\nmarker\n');
  git('init', '-q', '-b', 'main'); git('add', '-A'); git('commit', '-q', '-m', 'baza');
  git('checkout', '-q', '-b', 'integracja-proba');
  fs.mkdirSync(path.join(dir, 'tests'));
  fs.writeFileSync(path.join(dir, 'tests/a.test.js'), "test('a', () => { expect(1).toBe(1); });\n");
  const warunek = zawsze ? 'true' : `!fs.existsSync(${JSON.stringify(path.join(dir, 'marker'))})`;
  fs.writeFileSync(path.join(dir, 'tests/b.test.js'), `const fs = require('fs');
test('b', () => {
  if (${warunek}) { fs.writeFileSync(${JSON.stringify(path.join(dir, 'marker'))}, '1'); ${ZABICIE[zabicie]} }
  expect(1).toBe(1);
});
`);
  git('add', '-A'); git('commit', '-q', '-m', 'kod na gałęzi');
  fs.mkdirSync(path.join(dir, 'docs')); fs.writeFileSync(path.join(dir, 'docs/x.md'), 'dok\n'); git('add', '-A'); git('commit', '-q', '-m', 'same dokumenty');
  expect(execFileSync('git', ['diff', '--name-only', 'main...HEAD'], { cwd: dir, encoding: 'utf8' })).toMatch(/tests\/b\.test\.js/); /* gałąź z wcześniejszym kodem względem main */
  return dir;
}

/** jest-ponow z prawdziwym Jest; pierwszy przebieg na 2 workerach (2 pliki, pusta pamięć podręczna → bez trybu w jednym procesie). */
function uruchom(dir: string) {
  const r = spawnSync(process.execPath, [path.join(dir, 'scripts/jest-ponow.mjs'), '--config', path.join(dir, 'jest.config.json'), '--maxWorkers=2'],
    { cwd: dir, encoding: 'utf8', env: { ...process.env, JEST_PONOW_JEST: JEST, NODE_OPTIONS: '' }, timeout: 120_000 });
  return { kod: r.status, log: `${r.stdout}\n${r.stderr}` };
}

describe('KO-038 (11.11.2026): jest-ponow na prawdziwym Jest — worker ubity z zewnątrz → jedno ponowienie osobno', () => {
  const dirs: string[] = [];
  afterAll(() => { for (const d of dirs) fs.rmSync(d, { recursive: true, force: true }); });
  const przypadek = (z: keyof typeof ZABICIE, zawsze = false) => { const d = repo(z, zawsze); dirs.push(d); return uruchom(d); };

  test.each([
    ['sigterm', /signal=SIGTERM/],
    ['sigkill', /signal=SIGKILL/],
    ['kod143', /exitCode=143/],
    ['kod137', /exitCode=137/],
    ['pamiec', /ran out of memory/],
  ] as const)('%s przy pierwszym uruchomieniu, ponowienie zielone → kod 0; w logu plik, powód i wynik ponowienia (gałąź z kodem względem main, L-080)', (z, komunikat) => {
    const r = przypadek(z);
    expect(r.log).toMatch(komunikat); /* komunikat prawdziwego Jest, nie wpisany ręcznie */
    expect(r.log).toMatch(/ponawiam TYLKO je/);
    expect(r.log).toMatch(/tests\/b\.test\.js — /); /* wpis w logu: plik i powód */
    expect(r.log).not.toMatch(/tests\/a\.test\.js — /);
    expect(r.log).toMatch(/ponowień zielone — Jest zielony/);
    expect(r.kod).toBe(0);
  }, 120_000);

  test('worker ubijany także przy ponowieniu → kod 1 (jedno ponowienie, bez trzeciego)', () => {
    const r = przypadek('sigterm', true);
    expect(r.log).toMatch(/ponawiam TYLKO je/);
    expect(r.log).toMatch(/ponowienie czerwone/);
    expect(r.kod).toBe(1);
  }, 120_000);

  test.each([['kod0', /crashed for an unknown reason: exitCode=0/], ['asercja', /expect\(received\)\.toBe\(expected\)/]] as const)(
    '%s (nie sygnał ani brak pamięci) → bez ponawiania, kod 1', (z, komunikat) => {
      const r = przypadek(z);
      expect(r.log).toMatch(komunikat);
      expect(r.log).not.toMatch(/ponawiam/);
      expect(r.kod).toBe(1);
    }, 120_000);
});

describe('KO-038: znacznik verify tylko po zielonym Jest (z ponowieniem)', () => {
  const s = JSON.parse(fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8')).scripts as Record<string, string>;
  test.each([['verify', 'node scripts/jest-ponow.mjs', 'pelne'], ['verify:szybkie', 'node scripts/test-fast.mjs --od-bazy', 'szybkie']])(
    '%s: krok Jest przez jest-ponow przed zapisem znacznika, łańcuch tylko „&&”', (k, krokJest, znacznik) => {
      const kroki = s[k].split(' && ');
      expect(s[k].replace(/"[^"]*"/g, '')).not.toMatch(/\|\||;/);
      const j = kroki.indexOf(krokJest), z = kroki.indexOf(`node scripts/verify-znacznik.mjs --zapisz ${znacznik}`);
      expect(j).toBeGreaterThan(-1);
      expect(z).toBe(kroki.length - 1);
      expect(j).toBeLessThan(z);
    });
  test('test:fast kończy się kodem jest-ponow (zielony tylko przy zielonym ponowieniu)', () => {
    const src = fs.readFileSync(path.join(ROOT, 'scripts/test-fast.mjs'), 'utf8');
    expect(src).toContain("'jest-ponow.mjs'");
    expect(src).toContain('process.exit(r.status ?? 1)');
  });
});
