/* ZB-041 (sesja wąskich gardeł, decyzje właściciela 04.11.2026 ~06:00 PL): G2 czysta kopia na starcie verify, G4 baza H1 z zielonego tests.yml gałęzi (i znacznik „szybkie”),
   G3 fraza katalogu tylko dla testów przeglądających katalog, G5 (L-100) test:fast dokłada testy czytające dane przez fs, G8 jedno ponowienie pliku padłego tylko na limicie czasu.
   Repozytoria próbne w katalogach tymczasowych, bez sieci (CI_RUNY_PLIK zastępuje API Actions). Testy G4 odtwarzają przypadek L-080: gałąź integracji z kodem względem main + commit tylko z dokumentami. */
import { chmodSync, copyFileSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'fs';
import { tmpdir } from 'os';
import { join } from 'path';
import { spawnSync } from 'child_process';

const root = join(__dirname, '..');
const pkg = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'));
const tmp: string[] = [];
const nowy = (p: string) => { const d = mkdtempSync(join(tmpdir(), p)); tmp.push(d); return d; };
afterAll(() => { for (const d of tmp) rmSync(d, { recursive: true, force: true }); });
const ENV = { ...process.env, GIT_AUTHOR_NAME: 't', GIT_AUTHOR_EMAIL: 't@example.invalid', GIT_COMMITTER_NAME: 't', GIT_COMMITTER_EMAIL: 't@example.invalid' } as NodeJS.ProcessEnv;
delete ENV.CI; delete ENV.VERIFY_DOCS_CHANGED; delete ENV.CI_RUNY_PLIK;
const git = (cwd: string, ...a: string[]) => { const r = spawnSync('git', a, { cwd, env: ENV, encoding: 'utf8' }); if (r.status !== 0) throw new Error(`git ${a.join(' ')}: ${r.stderr}`); return r.stdout.trim(); };
const node = (cwd: string, skrypt: string, args: string[], env: Record<string, string> = {}) =>
  spawnSync(process.execPath, [join(cwd, 'scripts', skrypt), ...args], { cwd, env: { ...ENV, ...env }, encoding: 'utf8' });

const SKRYPTY = ['verify-docs.mjs', 'verify-znacznik.mjs', 'dokumenty.mjs', 'ci-wynik.mjs', 'testy-dla-plikow.mjs'];
/** main (plik.txt + docs/a.md) wypchnięty do zdalnego; kopia robocza na gałęzi `galaz`. */
function repo(galaz = 'integracja-1-1') {
  const zdalne = nowy('zb041-zdalne-'); const dir = nowy('zb041-repo-');
  git(zdalne, 'init', '-q', '--bare'); git(dir, 'init', '-q', '-b', 'main');
  mkdirSync(join(dir, 'scripts'), { recursive: true }); mkdirSync(join(dir, 'docs'), { recursive: true }); mkdirSync(join(dir, 'tests'));
  for (const f of SKRYPTY) copyFileSync(join(root, 'scripts', f), join(dir, 'scripts', f));
  writeFileSync(join(dir, 'plik.txt'), '1\n'); writeFileSync(join(dir, 'docs/a.md'), 'a\n');
  git(dir, 'add', '-A'); git(dir, 'commit', '-q', '-m', 'start'); git(dir, 'remote', 'add', 'origin', zdalne); git(dir, 'push', '-q', 'origin', 'main');
  git(dir, 'checkout', '-q', '-b', galaz);
  const zatwierdz = (plik: string, tresc: string) => { writeFileSync(join(dir, plik), tresc); git(dir, 'add', '-A'); git(dir, 'commit', '-q', '-m', `zmiana ${plik}`); };
  return { dir, zdalne, zatwierdz };
}
const plikCi = (sha: string, conclusion: string | null, status = 'completed') => {
  const f = join(nowy('zb041-ci-'), 'runy.json');
  writeFileSync(f, JSON.stringify({ workflow_runs: [{ id: 7, path: '.github/workflows/tests.yml', head_sha: sha, status, conclusion, created_at: '2026-11-04T05:00:00Z', run_number: 1 }] }));
  return f;
};
const plan = (dir: string, env: Record<string, string> = {}) => { const r = node(dir, 'verify-docs.mjs', ['--plan'], env); expect([r.status, r.stderr]).toEqual([0, '']); return JSON.parse(r.stdout.trim().split('\n').pop()!); };
const sprawdz = (dir: string, env: Record<string, string> = {}, galaz = 'integracja-1-1') =>
  node(dir, 'verify-znacznik.mjs', ['--sprawdz', 'HEAD', '--galaz', galaz], { VERIFY_ZNACZNIK_PLIK: `${dir}.znaczniki.json`, ...env });
const oznacz = (dir: string, rodzaj: string) => node(dir, 'verify-znacznik.mjs', ['--zapisz', rodzaj], { VERIFY_ZNACZNIK_PLIK: `${dir}.znaczniki.json` });

describe('G2 (04.11.2026): czysta kopia robocza na starcie verify', () => {
  test('--czysta: nieśledzony albo zmieniony plik → kod 1 z listą plików; czysta kopia → 0; w CI pomijane', () => {
    const { dir } = repo();
    expect(node(dir, 'verify-znacznik.mjs', ['--czysta']).status).toBe(0);
    writeFileSync(join(dir, 'STAN.txt'), 'x\n'); writeFileSync(join(dir, 'plik.txt'), '2\n');
    const r = node(dir, 'verify-znacznik.mjs', ['--czysta']);
    expect(r.status).toBe(1); expect(r.stderr).toContain('STAN.txt'); expect(r.stderr).toContain('plik.txt'); expect(r.stderr).toContain('commit');
    expect(node(dir, 'verify-znacznik.mjs', ['--czysta'], { CI: 'true' }).status).toBe(0);
  });
  test('npm run verify i verify:szybkie zaczynają od sprawdzenia haka, a zaraz po nim kontrolują czystą kopię', () => {
    for (const k of ['verify', 'verify:szybkie']) expect(pkg.scripts[k]).toMatch(/^node scripts\/hooks\/sprawdz-instalacje\.mjs && node scripts\/verify-znacznik\.mjs --czysta && /);
  });
  test('verify:docs: brudna kopia → błąd od razu (kod 1, lista plików), żadna kontrola nie jest uruchamiana; --plan i --czy-dokumenty bez zmian', () => {
    const { dir } = repo(); writeFileSync(join(dir, 'docs/b.md'), 'b\n');
    const r = node(dir, 'verify-docs.mjs', []);
    expect(r.status).toBe(1); expect(r.stderr).toContain('docs/b.md'); expect(r.stdout).not.toContain('npm run check');
    expect(node(dir, 'verify-docs.mjs', ['--plan']).status).toBe(0);
    expect(node(dir, 'verify-docs.mjs', ['--czy-dokumenty']).status).toBe(0);
  });
  test('STAN-AGENTA.md jest w .gitignore (nie brudzi kopii, więc nie psuje znacznika)', () => {
    expect(spawnSync('git', ['check-ignore', '-q', 'STAN-AGENTA.md'], { cwd: root }).status).toBe(0);
  });
});

describe('G4 (04.11.2026): baza H1 = origin/<bieżąca gałąź> z zielonym tests.yml, oraz znacznik „szybkie”', () => {
  /** gałąź integracji z kodem względem main, wypchnięta do zdalnego; potem commit tylko z dokumentem */
  function integracja() {
    const r = repo(); r.zatwierdz('plik.txt', '2\n'); git(r.dir, 'push', '-q', 'origin', 'integracja-1-1');
    const zdalny = git(r.dir, 'rev-parse', 'HEAD'); r.zatwierdz('docs/a.md', 'b\n');
    return { ...r, zdalny };
  }
  test('zielony tests.yml dla origin/<gałąź>: commit tylko z dokumentami = dokumenty, baza = SHA zdalnej gałęzi', () => {
    const x = integracja(); const p = plan(x.dir, { CI_RUNY_PLIK: plikCi(x.zdalny, 'success') });
    expect(p.dokumenty).toBe(true); expect(p.zmienione).toEqual(['docs/a.md']); expect(p.baza).toBe(x.zdalny);
  });
  test('czerwony, w toku albo brak przebiegu → jak dotąd: zmiany poza dokumentami', () => {
    const x = integracja();
    for (const f of [plikCi(x.zdalny, 'failure'), plikCi(x.zdalny, null, 'in_progress'), plikCi('inny', 'success')]) expect(plan(x.dir, { CI_RUNY_PLIK: f }).dokumenty).toBe(false);
    expect(plan(x.dir).dokumenty).toBe(false);
  });
  test('zielony CI innego SHA niż baza (przebieg dla innego commitu niż origin/<gałąź>) nie wystarcza', () => {
    const x = integracja(); const stary = git(x.dir, 'rev-parse', 'HEAD');
    expect(plan(x.dir, { CI_RUNY_PLIK: plikCi(stary, 'success') }).dokumenty).toBe(false);
  });
  test('zmiana kodu po zielonej bazie → nadal nie dokumenty', () => {
    const x = integracja(); x.zatwierdz('plik.txt', '3\n');
    expect(plan(x.dir, { CI_RUNY_PLIK: plikCi(x.zdalny, 'success') }).dokumenty).toBe(false);
  });
  test('znacznik „szybkie” jest bazą verify:docs (wcześniej tylko „pelne”)', () => {
    const r = repo(); r.zatwierdz('plik.txt', '2\n'); expect(oznacz(r.dir, 'szybkie').stdout).toContain('szybkie');
    r.zatwierdz('docs/a.md', 'b\n');
    const p = plan(r.dir, { VERIFY_ZNACZNIK_PLIK: `${r.dir}.znaczniki.json` }); expect(p.dokumenty).toBe(true); expect(p.zmienione).toEqual(['docs/a.md']);
  });
  test('hak (verify-znacznik --sprawdz --galaz): znacznik „dokumenty” + zielony CI gałęzi → 0; bez CI, z czerwonym CI albo z inną gałęzią → 1', () => {
    const x = integracja(); oznacz(x.dir, 'dokumenty');
    expect(sprawdz(x.dir, { CI_RUNY_PLIK: plikCi(x.zdalny, 'success') }).status).toBe(0);
    expect(sprawdz(x.dir, { CI_RUNY_PLIK: plikCi(x.zdalny, 'failure') }).status).toBe(1);
    expect(sprawdz(x.dir, { CI_RUNY_PLIK: plikCi('inny', 'success') }).status).toBe(1);
    expect(sprawdz(x.dir, { CI_RUNY_PLIK: plikCi(x.zdalny, 'success') }, 'inna').status).toBe(1);
  });
  test('hak: kod po zielonej bazie zdalnej + znacznik „dokumenty” → 1 (to nie są same dokumenty)', () => {
    const x = integracja(); x.zatwierdz('plik.txt', '3\n'); oznacz(x.dir, 'dokumenty');
    expect(sprawdz(x.dir, { CI_RUNY_PLIK: plikCi(x.zdalny, 'success') }).status).toBe(1);
  });
  test('scalenie do main (--wymagaj pelne) nie korzysta z bazy zdalnej', () => {
    const x = integracja(); oznacz(x.dir, 'dokumenty');
    const r = node(x.dir, 'verify-znacznik.mjs', ['--sprawdz', 'HEAD', '--wymagaj', 'pelne', '--galaz', 'integracja-1-1'], { VERIFY_ZNACZNIK_PLIK: `${x.dir}.znaczniki.json`, CI_RUNY_PLIK: plikCi(x.zdalny, 'success') });
    expect(r.status).toBe(1);
  });
  test('scal-galaz i ci-wynik: jedna implementacja oceny przebiegu (scal-galaz importuje ją z scripts/ci-wynik.mjs)', () => {
    const s = readFileSync(join(root, 'scripts/scal-galaz.mjs'), 'utf8');
    expect(s).toContain("from './ci-wynik.mjs'"); expect(s).not.toMatch(/export function (ocen|najnowszyTests)/);
  });
});

/* G3 (04.11.2026): fraza katalogu liczy się tylko w teście, który ten katalog przegląda albo buduje z niego ścieżki */
describe('G3 (04.11.2026): verify:docs — wybór testów dla dokumentów', () => {
  const MODUL = join(root, 'scripts/testy-dla-plikow.mjs');
  const wybierz = (testy: Record<string, string>, pliki: string[]): string[] => {
    const d = nowy('zb041-testy-'); mkdirSync(join(d, 'tests'));
    for (const [n, tresc] of Object.entries(testy)) writeFileSync(join(d, 'tests', n), tresc);
    const r = spawnSync(process.execPath, ['--input-type=module', '-e', `import { testyCzytajace } from ${JSON.stringify(MODUL)}; console.log(JSON.stringify(testyCzytajace(${JSON.stringify(pliki)}, ${JSON.stringify(d)})));`], { encoding: 'utf8' });
    expect([r.status, r.stderr]).toEqual([0, '']); return JSON.parse(r.stdout);
  };
  const TESTY = {
    'komentarz.test.ts': "// dane w docs/research/ są ręczne\nexpect(1).toBe(1);\n",
    'przeglada.test.ts': "fs.readdirSync(path.join(ROOT, 'docs', 'research'))\n",
    'przeglada2.test.ts': "const D = 'docs/research'; fs.readdirSync(D)\n",
    'sciezki.test.ts': 'read(`docs/research/${f}`)\n',
    'nazwa.test.ts': "read('docs/research/nowy.md')\n",
    'inny-katalog.test.ts': "fs.readdirSync('docs/lokalizacja')\n",
  };
  test('nowy plik w katalogu: testy tylko przeglądające katalog, budujące z niego ścieżki albo wymieniające plik; komentarz i inny katalog nie', () => {
    expect(wybierz(TESTY, ['docs/research/nowy.md'])).toEqual(['tests/nazwa.test.ts', 'tests/przeglada.test.ts', 'tests/przeglada2.test.ts', 'tests/sciezki.test.ts']);
  });
  test('plik bez katalogu (docs/NN-….md) i nazwa numerowanego dokumentu bez rozszerzenia', () => {
    expect(wybierz({ 'a.test.ts': "x('51-figury-v2-pokrycie')", 'b.test.ts': "x('docs/inne.md')" }, ['docs/51-figury-v2-pokrycie.md'])).toEqual(['tests/a.test.ts']);
  });
  test('prawdziwe repo: nowy plik w docs/research nie wybiera testu, który wspomina katalog tylko w komentarzu (tests/audit-0.10-gen.test.ts)', () => {
    const r = spawnSync(process.execPath, [join(root, 'scripts/verify-docs.mjs'), '--plan'], { cwd: root, encoding: 'utf8', env: { ...ENV, VERIFY_DOCS_CHANGED: 'docs/research/nowy-plik-zb041.md' } });
    const testy: string[] = JSON.parse(r.stdout).testy;
    expect(testy).not.toContain('tests/audit-0.10-gen.test.ts'); expect(testy).toContain('tests/l047-recenzja-niezalezna.test.ts'); expect(testy.length).toBeLessThan(40);
  });
});

/* G5 / L-100 (04.11.2026): test:fast dokłada testy czytające zmienione dokumenty i dane przez fs — --findRelatedTests ich nie wiąże (nie ma importu) */
describe('G5 / L-100 (04.11.2026): test:fast — testy czytające dokumenty i dane', () => {
  const skrypt = join(root, 'scripts/test-fast.mjs');
  const fastPlan = (zm: string[]) => JSON.parse(spawnSync(process.execPath, [skrypt, '--plan'], { encoding: 'utf8', env: { ...ENV, TEST_FAST_CHANGED: zm.join('\n') } }).stdout);
  test.each([
    ['docs/51-figury-v2-pokrycie.md', 'tests/gemini-polecenia.test.ts'],
    ['docs/research/recenzje/p1-r1.json', 'tests/l047-recenzja-niezalezna.test.ts'],
    ['lib/cues/text/pl.json', 'tests/audit-m1-049-critical-content.test.ts'],
    ['tests/fixtures/pokrycie-katalogu.json', 'tests/pokrycie-katalogu.test.ts'],
  ])('L-100: zmiana %s uruchamia %s', (zmiana, test_) => {
    expect(fastPlan([zmiana]).files).toEqual(expect.arrayContaining([test_]));
  });
  test('plik, którego nie czyta żaden test, nie dokłada nic; kod bez zmian (findRelatedTests)', () => {
    expect(fastPlan(['docs/nieistniejacy-' + 'dokument.md']).files).toEqual([]);
    expect(fastPlan(['lib/units.ts']).files).toEqual(['lib/units.ts']);
  });
  test('verify:szybkie bierze te testy: --od-bazy używa tego samego wyboru (jedna lista zmian)', () => {
    expect(readFileSync(skrypt, 'utf8')).toContain("from './testy-dla-plikow.mjs'");
  });
});
