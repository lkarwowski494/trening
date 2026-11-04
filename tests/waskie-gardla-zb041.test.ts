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

/* G4b (04.11.2026, błąd „883 pliki poza dokumentami”): koniec origin/<gałąź> bywa sam commitem z dokumentami (wypchniętym po verify:docs) — jego tests.yml jeszcze trwa albo go nie ma;
   baza H1 to wtedy najbliższy przodek z zielonym tests.yml, o ile od niego zmieniły się same dokumenty. Gałąź z wcześniejszymi zmianami kodu względem main (L-080). */
describe('G4b (04.11.2026): baza H1 = najbliższy wypchnięty commit gałęzi z zielonym tests.yml (końcówka origin/<gałąź> z samymi dokumentami bez przebiegu)', () => {
  const plikCiWiele = (wpisy: Array<[string, string | null, string?]>) => {
    const f = join(nowy('zb041-ci-'), 'runy.json');
    writeFileSync(f, JSON.stringify({ workflow_runs: wpisy.map(([sha, conclusion, status = 'completed'], i) => ({ id: 7 + i, path: '.github/workflows/tests.yml', head_sha: sha, status, conclusion, created_at: '2026-11-04T05:00:00Z', run_number: 1 + i })) }));
    return f;
  };
  const push = (dir: string) => { git(dir, 'push', '-q', 'origin', 'integracja-1-1'); return git(dir, 'rev-parse', 'HEAD'); };
  /** kod (zielony) → wypchnięty commit z dokumentami (bez przebiegu) → lokalny commit z dokumentami */
  function lancuch() {
    const r = repo(); r.zatwierdz('plik.txt', '2\n'); const kod = push(r.dir);
    r.zatwierdz('docs/b.md', 'b\n'); const koniecZdalnej = push(r.dir); r.zatwierdz('docs/c.md', 'c\n');
    return { ...r, kod, koniecZdalnej };
  }
  test('verify:docs: koniec origin/<gałąź> = dokumenty bez przebiegu, wcześniejszy kod zielony → dokumenty, baza = commit z kodem', () => {
    const x = lancuch(); const p = plan(x.dir, { CI_RUNY_PLIK: plikCiWiele([[x.kod, 'success']]) });
    expect(p.dokumenty).toBe(true); expect(p.baza).toBe(x.kod); expect([...p.zmienione].sort()).toEqual(['docs/b.md', 'docs/c.md']);
  });
  test('verify:docs: koniec origin/<gałąź> w toku albo czerwony z samymi dokumentami → też baza = wcześniejszy zielony', () => {
    const x = lancuch();
    for (const koniec of [[x.koniecZdalnej, null, 'in_progress'], [x.koniecZdalnej, 'cancelled']] as Array<[string, string | null, string?]>)
      expect(plan(x.dir, { CI_RUNY_PLIK: plikCiWiele([[x.kod, 'success'], koniec]) }).baza).toBe(x.kod);
  });
  test('verify:docs: kod między zielonym commitem a końcem gałęzi (przebieg anulowany) → nadal zmiany poza dokumentami', () => {
    const r = repo(); r.zatwierdz('plik.txt', '2\n'); const zielony = push(r.dir); r.zatwierdz('plik.txt', '3\n'); const anulowany = push(r.dir); r.zatwierdz('docs/c.md', 'c\n');
    const p = plan(r.dir, { CI_RUNY_PLIK: plikCiWiele([[zielony, 'success'], [anulowany, 'cancelled']]) });
    expect(p.dokumenty).toBe(false); expect(p.poza).toContain('plik.txt');
  });
  test('verify:docs: żaden przodek bez zielonego przebiegu → jak dotąd', () => {
    const x = lancuch(); expect(plan(x.dir, { CI_RUNY_PLIK: plikCiWiele([[x.kod, 'failure']]) }).dokumenty).toBe(false);
  });
  test('hak (--sprawdz --galaz): znacznik „dokumenty” + zielony wcześniejszy commit gałęzi → 0; kod po nim → 1', () => {
    const x = lancuch(); oznacz(x.dir, 'dokumenty');
    expect(sprawdz(x.dir, { CI_RUNY_PLIK: plikCiWiele([[x.kod, 'success']]) }).status).toBe(0);
    expect(sprawdz(x.dir, { CI_RUNY_PLIK: plikCiWiele([[x.kod, 'failure']]) }).status).toBe(1);
    x.zatwierdz('plik.txt', '9\n'); oznacz(x.dir, 'dokumenty');
    expect(sprawdz(x.dir, { CI_RUNY_PLIK: plikCiWiele([[x.kod, 'success']]) }).status).toBe(1);
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

/* G8 (04.11.2026, decyzja właściciela ~06:00 PL; L-098): plik, który padł WYŁĄCZNIE przez przekroczenie limitu czasu testu (obciążona maszyna), jest ponawiany raz osobno (--runInBand);
   asercja, błąd kompilacji, przerwanie innym sygnałem i mieszanka z asercją — bez ponawiania. Sztuczny Jest jak w tests/jest-ponow-29-10-2026.test.ts. */
describe('G8 (04.11.2026): jest-ponow — jedno ponowienie pliku padłego tylko na limicie czasu testu', () => {
  const SKRYPT = join(root, 'scripts/jest-ponow.mjs');
  const FAKE = `const fs=require('fs');const dir=process.env.FAKE_DIR;const n=fs.readdirSync(dir).filter(f=>f.startsWith('call-')).length;
fs.writeFileSync(dir+'/call-'+n+'.json',JSON.stringify(process.argv.slice(2)));const w=JSON.parse(fs.readFileSync(dir+'/scenariusz.json','utf8'))[n];
fs.writeFileSync(process.argv.find(a=>a.startsWith('--outputFile=')).slice(13),JSON.stringify(w));process.exit(w.success?0:1);`;
  const uruchom = (...przebiegi: object[]) => {
    const d = nowy('zb041-ponow-'); writeFileSync(join(d, 'fake.js'), FAKE); writeFileSync(join(d, 'scenariusz.json'), JSON.stringify(przebiegi));
    const r = spawnSync(process.execPath, [SKRYPT], { cwd: root, encoding: 'utf8', env: { ...ENV, JEST_PONOW_JEST: join(d, 'fake.js'), FAKE_DIR: d } });
    const wywolania = require('fs').readdirSync(d).filter((f: string) => f.startsWith('call-')).sort().map((f: string) => JSON.parse(readFileSync(join(d, f), 'utf8')) as string[]);
    return { kod: r.status, log: r.stderr, wywolania };
  };
  const limit = (m = 'thrown: "Exceeded timeout of 5000 ms for a test."') => ({ status: 'failed', failureMessages: [m] });
  const plik = (name: string, status: string, assertionResults: object[], message = '') => ({ name, status, message, assertionResults });
  const zielony = (name: string) => plik(name, 'passed', [{ status: 'passed', failureMessages: [] }]);
  const wynik = (...testResults: { status: string }[]) => ({ success: testResults.every(t => t.status === 'passed'), testResults });
  const TIMEOUT = (name: string) => plik(name, 'failed', [{ status: 'passed', failureMessages: [] }, limit(), limit()], 'thrown: "Exceeded timeout of 5000 ms for a test."');

  test('plik padły tylko na limicie czasu testu, ponowienie zielone → kod 0; ponowiony tylko ten plik, osobno (--runInBand), w logu powód', () => {
    const r = uruchom(wynik(zielony('/a.test.ts'), TIMEOUT('/b.test.ts')), wynik(zielony('/b.test.ts')));
    expect(r.kod).toBe(0); expect(r.wywolania).toHaveLength(2);
    expect(r.wywolania[1]).toEqual(expect.arrayContaining(['--runInBand', '--runTestsByPath', '/b.test.ts'])); expect(r.wywolania[1]).not.toContain('/a.test.ts');
    expect(r.log).toMatch(/ponawiam TYLKO je/); expect(r.log).toMatch(/limicie czasu testu/);
  });
  test('limit czasu także w haku (beforeAll) jest ponawiany', () => {
    const r = uruchom(wynik(plik('/h.test.ts', 'failed', [limit('thrown: "Exceeded timeout of 5000 ms for a hook."')])), wynik(zielony('/h.test.ts')));
    expect(r.kod).toBe(0); expect(r.wywolania).toHaveLength(2);
  });
  test('ponowienie znowu na limicie czasu → kod 1 (jedno ponowienie, bez trzeciego)', () => {
    const r = uruchom(wynik(TIMEOUT('/b.test.ts')), wynik(TIMEOUT('/b.test.ts')));
    expect(r.kod).toBe(1); expect(r.wywolania).toHaveLength(2);
  });
  test('jedna nieudana asercja w pliku obok limitu czasu → bez ponawiania (kod 1)', () => {
    const r = uruchom(wynik(plik('/b.test.ts', 'failed', [limit(), { status: 'failed', failureMessages: ['Error: expect(received).toBe(expected)'] }])));
    expect(r.kod).toBe(1); expect(r.wywolania).toHaveLength(1);
  });
  test('plik z asercją nieudaną w innym pliku niż limit czasu → bez ponawiania (nie maskujemy prawdziwej porażki)', () => {
    const r = uruchom(wynik(TIMEOUT('/b.test.ts'), plik('/c.test.ts', 'failed', [{ status: 'failed', failureMessages: ['Error: expect(received).toBe(expected)'] }])));
    expect(r.kod).toBe(1); expect(r.wywolania).toHaveLength(1);
  });
  test('błąd kompilacji (suite failed to run) i nieudany test bez komunikatu o limicie → bez ponawiania', () => {
    for (const zly of [plik('/k.test.ts', 'failed', [], 'Test suite failed to run\n\n  SyntaxError: Unexpected token'), plik('/n.test.ts', 'failed', [{ status: 'failed', failureMessages: [] }])]) {
      const r = uruchom(wynik(zly)); expect([zly.name, r.kod, r.wywolania.length]).toEqual([zly.name, 1, 1]);
    }
  });
  test('limit czasu i przerwanie z zewnątrz w jednym przebiegu → oba ponawiane razem, raz', () => {
    const przerwany = plik('/p.test.ts', 'failed', [], 'Test suite failed to run\n\n  A jest worker process (pid=1) was terminated by another process: signal=SIGTERM, exitCode=null.');
    const r = uruchom(wynik(TIMEOUT('/b.test.ts'), przerwany), wynik(zielony('/b.test.ts'), zielony('/p.test.ts')));
    expect(r.kod).toBe(0); expect(r.wywolania[1]).toEqual(expect.arrayContaining(['/b.test.ts', '/p.test.ts']));
  });
  test('test:fast i verify:docs uruchamiają Jest przez scripts/jest-ponow.mjs (L-098: dokumenty bez ponowień padały na limicie czasu)', () => {
    for (const f of ['scripts/test-fast.mjs', 'scripts/verify-docs.mjs']) expect(readFileSync(join(root, f), 'utf8')).toContain('jest-ponow.mjs');
  });
});
