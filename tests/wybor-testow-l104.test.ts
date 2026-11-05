/* L-104 (04.11.2026, koordynator 1.1, wariant A): test, który uruchamia skrypt repo (execFileSync/spawnSync/execSync/execFile/spawn/fork ze ścieżką scripts/**, także przez zmienną, join
   albo `npm run <skrypt z package.json>`), dziedziczy w wyborze testów (test:fast, verify:szybkie, verify:docs — scripts/testy-dla-plikow.mjs, testyUruchamiajaceSkrypty) zależności skryptu:
   graf importów (rekurencyjnie) i pliki oraz katalogi, które skrypt wymienia jako ścieżki. Przypadek wyjściowy: tests/figury-sens-pokrycie.test.ts uruchamia scripts/figures/pokrycie-sensu.mjs,
   który czyta karty (lib/cues/data.json) i data/zrodla/figury-sens.json — zmiana karty nie wybierała testu (tests.yml 41817725563).
   Strażnik na całym katalogu tests/: każdy test z procesem potomnym ma rozpoznany skrypt albo wpis z powodem w tests/uruchomienia-skryptow-wyjatki.json.
   Przypadek „gałąź z wcześniejszymi zmianami względem main” (L-080, wzór tests/hak-pre-push.test.ts „H1”): test:fast --od-bazy na gałęzi z kilkoma commitami względem origin/integracja-1-1. */
import { cpSync, existsSync, mkdirSync, mkdtempSync, readdirSync, readFileSync, rmSync, symlinkSync, writeFileSync } from 'fs';
import { join } from 'path';
import { tmpdir } from 'os';
import { spawnSync } from 'child_process';

const root = join(__dirname, '..');
const MODUL = join(root, 'scripts/testy-dla-plikow.mjs');
const wMjs = <T>(kod: string, dane: unknown): T => {
  const r = spawnSync(process.execPath, ['--input-type=module', '-e', `import * as m from ${JSON.stringify(MODUL)}; const d = JSON.parse(process.argv[1]); console.log(JSON.stringify(${kod}));`, JSON.stringify(dane)], { encoding: 'utf8', maxBuffer: 1 << 26 });
  expect([r.status, r.stderr]).toEqual([0, '']); return JSON.parse(r.stdout);
};
const wybor = (pliki: string[], r = root): string[] => wMjs('m.testyUruchamiajaceSkrypty(d, ' + JSON.stringify(r) + ')', pliki);

describe('L-104: skryptyUruchamianePrzezTest — rozpoznanie uruchomienia skryptu repo w źródle testu', () => {
  const S = 'scripts/figures/pokrycie-sensu.mjs';
  test.each([
    ["execFileSync(process.execPath, [path.join(ROOT, 'scripts/figures/pokrycie-sensu.mjs'), '--json'])", [S]],
    ["const SKRYPT = path.join(ROOT, 'scripts', 'figures', 'pokrycie-sensu.mjs'); spawnSync(process.execPath, [SKRYPT, '--check'])", [S]],
    ["const SKRYPT = join(root, 'scripts/figures', 'pokrycie-sensu.mjs'); spawnSync(process.execPath, [SKRYPT])", [S]],
    ["execSync('node scripts/figures/pokrycie-sensu.mjs --json')", [S]],
    ['execSync(`node ${ROOT}/scripts/figures/pokrycie-sensu.mjs`)', [S]],
    ["spawnSync('bash', [join(ROOT, 'scripts/figures/pokrycie-sensu.mjs')])", [S]],
    ["const mod = (f) => path.join(ROOT, 'scripts/figures', f); execFileSync(process.execPath, ['-e', `import ${JSON.stringify(mod('pokrycie-sensu.mjs'))}`])", [S]],
    ["execSync('npm run check:matrix')", ['scripts/test-matrix.mjs']],
    ["fork(path.join(ROOT, 'scripts/figures/pokrycie-sensu.mjs'))", [S]],
    // bez uruchomienia procesu: samo wspomnienie ścieżki nie jest uruchomieniem (import i odczyt wybiera inny mechanizm)
    ["const s = path.join(ROOT, 'scripts/figures/pokrycie-sensu.mjs'); expect(readFileSync(s, 'utf8')).toContain('x')", []],
    // proces potomny, ale nie skrypt repo
    ["execFileSync('git', ['tag', '-l'])", []],
    ["const m = /a/.exec(x); execFileSync('git', ['show', 'scripts/nie-ma.mjs'])", []],
  ])('%s', (src, oczekiwane) => {
    const w = wMjs<string[]>('m.skryptyUruchamianePrzezTest(d[0], d[1])', [src, root]);
    if (oczekiwane.length) expect(w).toEqual(expect.arrayContaining(oczekiwane)); else expect(w).toEqual([]);
  });
});

describe('L-104: prawdziwe repo — zmiana zależności skryptu wybiera test, który go uruchamia', () => {
  const T = 'tests/figury-sens-pokrycie.test.ts';
  test.each([
    ['lib/cues/data.json', 'karta ćwiczenia, którą czyta v2-sens.mjs (wskazowkiCwiczenia) — przypadek tests.yml 41817725563'],
    ['data/zrodla/figury-sens.json', 'dane reguł sensu czytane przez skrypt'],
    ['lib/figures/v2/cue-sets.json', 'zestawy wskazówek czytane przez v2-sens.mjs'],
    ['scripts/figures/v2-sens.mjs', 'moduł importowany (rekurencyjnie) przez skrypt'],
    ['scripts/figures/v2-build.mjs', 'import drugiego poziomu (v2-build → transpilacja lib/figures/v2)'],
    ['scripts/figures/pokrycie-sensu.mjs', 'sam skrypt'],
    ['lib/figures/v2/index.ts', 'plik z katalogu transpilowanego przez v2-build.mjs'],
  ])('%s (%s) → %s', (plik) => { expect(wybor([plik])).toContain(T); });

  test('negatyw: pliki spoza zależności skryptu nie wybierają testu', () => {
    for (const plik of ['lib/units.ts', 'docs/40-lekcje.md', 'app/index.tsx', 'assets/icon.png']) expect(wybor([plik])).not.toContain(T);
  });
  test('negatyw: zmiana dokumentu albo kodu aplikacji nie wybiera wielu testów (zakres wyboru jest wąski)', () => {
    expect(wybor(['lib/units.ts']).length).toBe(0);
    expect(wybor(['docs/40-lekcje.md']).length).toBeLessThanOrEqual(15);
  });
  test('test uruchamiający skrypt przez katalog + nazwę pliku (przeklad-kontekst) dziedziczy zależności skryptu', () => {
    expect(wybor(['scripts/i18n/kontekst.mjs'])).toContain('tests/przeklad-kontekst.test.ts');
  });
});

describe('L-104: repo tymczasowe — zależności przechodnie, katalogi i brak fałszywych trafień', () => {
  const tmp = mkdtempSync(join(tmpdir(), 'l104-'));
  afterAll(() => rmSync(tmp, { recursive: true, force: true }));
  mkdirSync(join(tmp, 'tests'), { recursive: true }); mkdirSync(join(tmp, 'scripts/x'), { recursive: true }); mkdirSync(join(tmp, 'data/zbior'), { recursive: true }); mkdirSync(join(tmp, 'lib'), { recursive: true });
  writeFileSync(join(tmp, 'tests/a.test.ts'), "import { execFileSync } from 'child_process'; execFileSync(process.execPath, [path.join(ROOT, 'scripts/x/glowny.mjs')]);\n");
  writeFileSync(join(tmp, 'tests/b.test.ts'), "import { execFileSync } from 'child_process'; execFileSync('git', ['status']);\n");
  writeFileSync(join(tmp, 'tests/c.test.ts'), "const s = 'scripts/x/glowny.mjs'; it('x', () => {});\n"); // wspomnienie bez uruchomienia
  writeFileSync(join(tmp, 'scripts/x/glowny.mjs'), "import { a } from './pomocniczy.mjs';\nimport fs from 'node:fs';\nfs.readFileSync(path.join(root, 'data', 'zbior', 'plik.json'));\n");
  writeFileSync(join(tmp, 'scripts/x/pomocniczy.mjs'), "import b from '../glebszy.js';\nfs.readFileSync(path.join(root, 'lib/dane.json'));\nfs.readdirSync(path.join(root, 'data/katalog'));\n");
  writeFileSync(join(tmp, 'scripts/glebszy.js'), 'module.exports = {};\n');
  writeFileSync(join(tmp, 'lib/dane.json'), '{}\n'); writeFileSync(join(tmp, 'lib/inne.json'), '{}\n'); writeFileSync(join(tmp, 'data/zbior/plik.json'), '{}\n');
  mkdirSync(join(tmp, 'data/katalog')); writeFileSync(join(tmp, 'data/katalog/nowy.json'), '{}\n'); writeFileSync(join(tmp, 'data/zbior/obcy.json'), '{}\n');
  test.each([
    ['scripts/x/glowny.mjs', true], ['scripts/x/pomocniczy.mjs', true], ['scripts/glebszy.js', true], // graf importów rekurencyjnie
    ['data/zbior/plik.json', true], ['lib/dane.json', true], // pliki czytane przez skrypt i jego moduły
    ['data/katalog/nowy.json', true], // katalog przeglądany przez moduł
    ['lib/inne.json', false], ['data/zbior/obcy.json', false], ['docs/x.md', false], // poza zależnościami
  ])('%s → test a.test.ts wybrany: %s', (plik, ma) => {
    const w = wybor([plik], tmp);
    expect(w.includes('tests/a.test.ts')).toBe(ma);
    expect(w).not.toContain('tests/b.test.ts'); expect(w).not.toContain('tests/c.test.ts');
  });
});

describe('L-104 + L-080: gałąź z wcześniejszymi zmianami względem origin/integracja-1-1 (test:fast --od-bazy)', () => {
  const tmp = mkdtempSync(join(tmpdir(), 'l104g-'));
  afterAll(() => rmSync(tmp, { recursive: true, force: true }));
  const git = (...a: string[]) => { const r = spawnSync('git', ['-c', 'user.email=t@t', '-c', 'user.name=t', ...a], { cwd: tmp, encoding: 'utf8' }); expect(r.status).toBe(0); return r.stdout.trim(); };
  test('commit 1: dane czytane przez skrypt, commit 2: tylko dokument → plan zawiera test uruchamiający skrypt (zmiany z całej gałęzi, nie tylko ostatniego commitu)', () => {
    mkdirSync(join(tmp, 'scripts'), { recursive: true }); mkdirSync(join(tmp, 'tests')); mkdirSync(join(tmp, 'data')); mkdirSync(join(tmp, 'docs'));
    for (const f of ['test-fast.mjs', 'testy-dla-plikow.mjs']) cpSync(join(root, 'scripts', f), join(tmp, 'scripts', f));
    symlinkSync(join(root, 'node_modules'), join(tmp, 'node_modules'));
    writeFileSync(join(tmp, 'scripts/czytaj.mjs'), "import fs from 'node:fs'; console.log(fs.readFileSync(new URL('../data/karta.json', import.meta.url)));\n");
    writeFileSync(join(tmp, 'tests/skrypt.test.ts'), "import { execFileSync } from 'child_process'; import path from 'path'; test('x', () => { execFileSync(process.execPath, [path.join(__dirname, '..', 'scripts/czytaj.mjs')]); });\n");
    writeFileSync(join(tmp, 'tests/obcy.test.ts'), "test('y', () => {});\n");
    writeFileSync(join(tmp, 'data/karta.json'), '{"v":1}\n'); writeFileSync(join(tmp, 'data/inna.json'), '{}\n'); writeFileSync(join(tmp, 'docs/a.md'), 'a\n');
    git('init', '-q', '-b', 'main'); git('add', '-A'); git('commit', '-q', '-m', 'baza'); git('update-ref', 'refs/remotes/origin/integracja-1-1', 'HEAD');
    git('checkout', '-q', '-b', 'galaz');
    writeFileSync(join(tmp, 'data/karta.json'), '{"v":2}\n'); git('commit', '-q', '-am', 'zmiana karty'); // „karta” — dane, nie kod
    writeFileSync(join(tmp, 'docs/a.md'), 'b\n'); git('commit', '-q', '-am', 'tylko dokument');
    const plan = (zm?: string) => { const r = spawnSync(process.execPath, ['scripts/test-fast.mjs', '--plan', '--od-bazy'], { cwd: tmp, encoding: 'utf8', env: { ...process.env, ...(zm !== undefined ? { TEST_FAST_CHANGED: zm } : {}) } }); expect([r.status, r.stderr]).toEqual([0, '']); return JSON.parse(r.stdout) as { files: string[] }; };
    expect(plan().files).toContain('tests/skrypt.test.ts'); expect(plan().files).not.toContain('tests/obcy.test.ts');
    // zmiana samego modułu skryptu (kod .mjs, poza grafem importów testu) też wybiera test
    expect(plan('scripts/czytaj.mjs').files).toContain('tests/skrypt.test.ts');
    expect(plan('data/inna.json').files).not.toContain('tests/skrypt.test.ts');
  });
});

describe('L-104: verify:docs — dokument czytany przez skrypt wybiera test uruchamiający ten skrypt', () => {
  test('docs/research/27-wskazowki-zrodla.md (czytany przez scripts/readme.mjs) → plan verify:docs zawiera tests/readme.test.ts', () => {
    const r = spawnSync(process.execPath, [join(root, 'scripts/verify-docs.mjs'), '--plan'], { cwd: root, encoding: 'utf8', env: { ...process.env, VERIFY_DOCS_CHANGED: 'docs/research/27-wskazowki-zrodla.md' } });
    expect([r.status, r.stderr]).toEqual([0, '']);
    const plan = JSON.parse(r.stdout) as { dokumenty: boolean; testy: string[] };
    expect(plan.dokumenty).toBe(true); expect(plan.testy).toContain('tests/readme.test.ts');
  });
});

describe('L-104: strażnik na całym katalogu tests/ — każde uruchomienie procesu potomnego jest rozpoznane', () => {
  // Zakres: wszystkie pliki tests/*.test.ts(x) (readdirSync niżej) — nie lista; wzorzec wywołań to URUCHOMIENIE w scripts/testy-dla-plikow.mjs.
  const testy = readdirSync(join(root, 'tests')).filter(f => /\.test\.tsx?$/.test(f));
  const URUCHOMIENIE = /\b(execFileSync|spawnSync|execSync|execFile|spawn|fork)\s*\(/;
  const wyjatki: Record<string, string> = JSON.parse(readFileSync(join(root, 'tests/uruchomienia-skryptow-wyjatki.json'), 'utf8')).wyjatki;
  const rozpoznane = wMjs<Record<string, string[]>>('Object.fromEntries(m.uruchomieniaSkryptow(' + JSON.stringify(root) + '))', null);
  const wywolujace = testy.filter(t => URUCHOMIENIE.test(readFileSync(join(root, 'tests', t), 'utf8')) && /child_process/.test(readFileSync(join(root, 'tests', t), 'utf8')));

  test('strażnik nie jest pusty (kilkadziesiąt testów uruchamia skrypty)', () => { expect(Object.keys(rozpoznane).length).toBeGreaterThan(30); });
  test('lista wywołań nierozpoznanych jest pusta: test z procesem potomnym ma skrypt scripts/** albo wyjątek z powodem', () => {
    const nierozpoznane = wywolujace.filter(t => !rozpoznane[t] && !wyjatki[t]);
    expect(nierozpoznane).toEqual([]);
  });
  test('każdy wyjątek ma powód i wskazuje istniejący test, który nadal nie uruchamia skryptu repo (wpis nieaktualny → usuń)', () => {
    for (const [t, powod] of Object.entries(wyjatki)) {
      expect([t, existsSync(join(root, 'tests', t))]).toEqual([t, true]);
      expect(powod.length).toBeGreaterThan(20);
      expect([t, rozpoznane[t] ?? null]).toEqual([t, null]);
    }
  });
});
