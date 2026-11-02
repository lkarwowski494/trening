/*
 * Decyzja koordynatora 02.11.2026 (zb010, wariant A): stała, jawna sterta workerów Jest, jedno miejsce na liczbę (scripts/ci/jest-sterta.json).
 * Powód: workery Jest kończyły się „out of memory” przy domyślnej stercie ~2 GB w równoległym verify (maestro-flows, matrix-dim-langs-routes3, audit-k1-bl-mer).
 * Rodzaje (docs/20): logika (global-setup), niezmiennik (verify i CI nie mają własnych liczb), strażnik procesu z przypadkiem „gałąź z wcześniejszymi zmianami
 * względem main” (CLAUDE.md, L-080; wzór: tests/hak-pre-push.test.ts „H1”).
 * Zakres strażnika (L-089) = jawna lista plików poniżej; każdy workflow uruchamiający Jest jest albo na liście, albo na liście wyjątków z powodem.
 */
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import { spawnSync } from 'child_process';

const ROOT = path.join(__dirname, '..');
const czytaj = (p: string) => fs.readFileSync(path.join(ROOT, p), 'utf8');
const STERTA = JSON.parse(czytaj('scripts/ci/jest-sterta.json')) as { workerowMB: number; ponowienieMB: number };
const pkg = JSON.parse(czytaj('package.json'));

/** Workflowy, w których pełny Jest idzie przez `npm run verify` (sterta z tests/global-setup.js) albo gołym `npx jest` (też global-setup) — żaden nie ustawia własnej sterty. */
const WORKFLOWY_JEST = ['tests.yml', 'testflight.yml', 'nightly.yml', 'tests-tz.yml'];
/** Workflowy z Jest tylko na jednym małym pliku (nasiona zrzutów) — sterta bez znaczenia, ale też bez własnej liczby. */
const WORKFLOWY_MALE = ['store-screenshots.yml', 'watch-sim.yml'];

const tmp: string[] = [];
afterAll(() => { for (const d of tmp) fs.rmSync(d, { recursive: true, force: true }); });

describe('sterta workerów Jest — jedno miejsce na liczbę (02.11.2026)', () => {
  test('stałe: workerów ≥ 4 GB, ponowienie nie mniejsze niż workerzy, workerIdleMemoryLimit poniżej sterty workerów', () => {
    expect(STERTA.workerowMB).toBeGreaterThanOrEqual(4096);
    expect(STERTA.ponowienieMB).toBeGreaterThanOrEqual(STERTA.workerowMB);
    const idle = Number(/^(\d+)MB$/.exec(pkg.jest.workerIdleMemoryLimit)?.[1]);
    expect(idle).toBeGreaterThan(0);
    expect(idle).toBeLessThan(STERTA.workerowMB);
  });

  describe('tests/global-setup.js ustawia NODE_OPTIONS dla workerów', () => {
    const ZAPIS = ['NODE_OPTIONS', 'TZ', 'PROP_SEED'] as const;
    const kopia: Record<string, string | undefined> = {};
    beforeEach(() => { for (const k of ZAPIS) kopia[k] = process.env[k]; jest.spyOn(console, 'log').mockImplementation(() => undefined); });
    afterEach(() => { for (const k of ZAPIS) { if (kopia[k] === undefined) delete process.env[k]; else process.env[k] = kopia[k]; } jest.restoreAllMocks(); });
    const uruchomSetup = (opcje?: string) => { if (opcje === undefined) delete process.env.NODE_OPTIONS; else process.env.NODE_OPTIONS = opcje; delete process.env.PROP_SEED; require('./global-setup')(); return process.env.NODE_OPTIONS; };

    test('brak NODE_OPTIONS → sama sterta workerów', () => { expect(uruchomSetup()).toBe(`--max-old-space-size=${STERTA.workerowMB}`); });
    test('inne opcje zostają, sterta dopisana raz', () => { expect(uruchomSetup('--no-warnings')).toBe(`--no-warnings --max-old-space-size=${STERTA.workerowMB}`); });
    test('jawna sterta z otoczenia (np. ponowienie) ma pierwszeństwo i nie jest dublowana', () => {
      expect(uruchomSetup(`--max-old-space-size=${STERTA.ponowienieMB}`)).toBe(`--max-old-space-size=${STERTA.ponowienieMB}`);
    });
    test('wywołanie dwukrotne nie dubluje flagi', () => { uruchomSetup(); expect(uruchomSetup(process.env.NODE_OPTIONS)).toBe(`--max-old-space-size=${STERTA.workerowMB}`); });
  });

  test('prawdziwy worker Jest dostaje stertę ≥ workerowMB (pomiar v8.heap_size_limit w procesie roboczym)', () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'jest-sterta-')); tmp.push(dir);
    const wynik = path.join(dir, 'limit.txt');
    const plik = (n: number) => path.join(ROOT, 'tests', `zz-sterta-tmp-${process.pid}-${n}.test.ts`);
    const tresc = `test('limit sterty', () => { require('fs').appendFileSync(${JSON.stringify(wynik)}, Math.round(require('v8').getHeapStatistics().heap_size_limit / 1048576) + '\\n'); });\n`;
    try {
      for (const n of [1, 2]) fs.writeFileSync(plik(n), tresc);
      const env = { ...process.env }; delete env.NODE_OPTIONS;
      const r = spawnSync(process.execPath, [path.join(ROOT, 'node_modules/jest/bin/jest.js'), `zz-sterta-tmp-${process.pid}`, '--maxWorkers=2', '--ci', '--silent'], { cwd: ROOT, env, encoding: 'utf8' });
      expect(r.status).toBe(0);
      const limity = fs.readFileSync(wynik, 'utf8').trim().split('\n').map(Number);
      expect(limity).toHaveLength(2);
      for (const l of limity) expect(l).toBeGreaterThanOrEqual(STERTA.workerowMB);
    } finally { for (const n of [1, 2]) fs.rmSync(plik(n), { force: true }); }
  }, 180_000);
});

describe('verify i CI używają tej stałej, nie własnych liczb (zakres: jawna lista plików)', () => {
  test('verify woła scripts/jest-ponow.mjs (stała ponowienia z JSON), skrypt czyta scripts/ci/jest-sterta.json i nie ma własnej liczby', () => {
    expect(pkg.scripts.verify).toContain('node scripts/jest-ponow.mjs');
    const s = czytaj('scripts/jest-ponow.mjs');
    expect(s).toContain("scripts/ci/jest-sterta.json");
    expect(s).not.toMatch(/STERTA_PONOWIENIA_MB\s*=\s*\d/);
    expect(czytaj('tests/global-setup.js')).toContain('../scripts/ci/jest-sterta.json');
  });
  test('package.json: jest.globalSetup wskazuje tests/global-setup.js (tam ustawiana jest sterta)', () => {
    expect(pkg.jest.globalSetup).toBe('<rootDir>/tests/global-setup.js');
  });
  test.each([...WORKFLOWY_JEST, ...WORKFLOWY_MALE])('.github/workflows/%s: bez własnego --max-old-space-size', f => {
    expect(czytaj(`.github/workflows/${f}`)).not.toMatch(/max-old-space-size/);
  });
  test('tests.yml i testflight.yml uruchamiają pełny Jest przez `npm run verify`; nightly i tests-tz przez gołe `npx jest` (global-setup)', () => {
    expect(czytaj('.github/workflows/tests.yml')).toMatch(/run: npm run verify\s*$/m);
    expect(czytaj('.github/workflows/testflight.yml')).toMatch(/run: npm run verify\s*$/m);
    expect(czytaj('.github/workflows/nightly.yml')).toMatch(/npx jest --maxWorkers=2/);
    expect(czytaj('.github/workflows/tests-tz.yml')).toMatch(/npx jest --maxWorkers=2/);
  });
  test('kompletność: każdy workflow z `jest` jest na liście objętej (pełny/mały) albo to wyjątek bez uruchamiania Jest', () => {
    const znane = new Set([...WORKFLOWY_JEST, ...WORKFLOWY_MALE]);
    const uruchamiaJest = fs.readdirSync(path.join(ROOT, '.github/workflows')).filter(f => f.endsWith('.yml'))
      .filter(f => /(?:npx jest|npm test|npm run verify(?![:\w-])|jest-ponow)/.test(czytaj(`.github/workflows/${f}`).split('\n').filter(l => !/^\s*#/.test(l)).join('\n')));
    expect(uruchamiaJest.filter(f => !znane.has(f))).toEqual([]);
  });
});

/* L-080 (CLAUDE.md): strażnik procesu musi działać na gałęzi długo żyjącej — zmiana konfiguracji sterty (jest-sterta.json, global-setup) w ciągu wielu commitów
 * względem main. Wzór: tests/hak-pre-push.test.ts „H1”. Tu: repozytorium próbne z gałęzią, na której konfiguracja sterty zmieniała się w kilku commitach; strażnik czyta
 * drzewo robocze (nie historię ani main), więc wynik zależy tylko od bieżącej zawartości plików. */
describe('gałąź z wcześniejszymi zmianami względem main (L-080)', () => {
  const GIT_ENV = { ...process.env, GIT_AUTHOR_NAME: 't', GIT_AUTHOR_EMAIL: 't@example.invalid', GIT_COMMITTER_NAME: 't', GIT_COMMITTER_EMAIL: 't@example.invalid' };
  const git = (cwd: string, args: string[]) => spawnSync('git', args, { cwd, env: GIT_ENV, encoding: 'utf8' });

  test('stałe odczytane z drzewa roboczego gałęzi po kilku commitach zmieniających jest-sterta.json: wartość z ostatniego commitu, nie z main; main-bazowy plik inny', () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'sterta-gal-')); tmp.push(dir);
    fs.mkdirSync(path.join(dir, 'scripts/ci'), { recursive: true });
    const plik = path.join(dir, 'scripts/ci/jest-sterta.json');
    expect(git(dir, ['init', '-q', '-b', 'main']).status).toBe(0);
    fs.writeFileSync(plik, JSON.stringify({ workerowMB: 2048, ponowienieMB: 4096 }));
    git(dir, ['add', '.']); expect(git(dir, ['commit', '-qm', 'main']).status).toBe(0);
    expect(git(dir, ['checkout', '-q', '-b', 'zb010/sdk']).status).toBe(0);
    for (const [w, p] of [[3072, 4096], [4096, 6144]]) {
      fs.writeFileSync(plik, JSON.stringify({ workerowMB: w, ponowienieMB: p }));
      git(dir, ['commit', '-qam', `sterta ${w}`]);
    }
    /* skrypt ponowienia liczy NODE_OPTIONS z pliku JSON w SWOIM katalogu głównym — uruchom kopię w repo próbnym */
    fs.mkdirSync(path.join(dir, 'scripts'), { recursive: true });
    fs.copyFileSync(path.join(ROOT, 'scripts/jest-ponow.mjs'), path.join(dir, 'scripts/jest-ponow.mjs'));
    const r = spawnSync(process.execPath, ['--input-type=module', '-e', "import { opcjePonowienia, STERTA_PONOWIENIA_MB } from './scripts/jest-ponow.mjs'; console.log(STERTA_PONOWIENIA_MB, '|', opcjePonowienia('--max-old-space-size=2048 --no-warnings'));"], { cwd: dir, encoding: 'utf8' });
    expect(r.status).toBe(0);
    expect(r.stdout.trim()).toBe('6144 | --no-warnings --max-old-space-size=6144');
    expect(git(dir, ['rev-list', '--count', 'main..zb010/sdk']).stdout.trim()).toBe('2'); /* gałąź rzeczywiście ma wcześniejsze commity względem main */
    expect(JSON.parse(git(dir, ['show', 'main:scripts/ci/jest-sterta.json']).stdout).ponowienieMB).toBe(4096);
  });
});
