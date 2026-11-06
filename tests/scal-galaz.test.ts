/* L-090, wariant A (decyzja właściciela 02.11.2026): scripts/scal-galaz.mjs scala gałąź tylko przy zielonym tests.yml dla SHA jej głowy.
   Bez sieci: lokalny serwer HTTP udaje API Actions (SCAL_API_BAZA); prawdziwe repozytoria git w katalogach tymczasowych.
   Przypadek L-080: gałąź z wcześniejszymi zmianami względem celu — ostatni commit to dokument, ale diff od wspólnego przodka ma kod. */
import { existsSync, mkdtempSync, mkdirSync, rmSync, symlinkSync, writeFileSync } from 'fs';
import { createServer, Server } from 'http';
import { tmpdir } from 'os';
import { join } from 'path';
import { spawn, spawnSync } from 'child_process';

const root = join(__dirname, '..');
const SKRYPT = join(root, 'scripts/scal-galaz.mjs');
const tmp: string[] = [];
const nowy = (p: string) => { const d = mkdtempSync(join(tmpdir(), p)); tmp.push(d); return d; };
const ENV = { ...process.env, GIT_AUTHOR_NAME: 't', GIT_AUTHOR_EMAIL: 't@example.invalid', GIT_COMMITTER_NAME: 't', GIT_COMMITTER_EMAIL: 't@example.invalid' } as NodeJS.ProcessEnv;
const git = (cwd: string, ...a: string[]) => { const r = spawnSync('git', a, { cwd, env: ENV, encoding: 'utf8' }); if (r.status !== 0) throw new Error(`git ${a.join(' ')}: ${r.stderr}`); return r.stdout.trim(); };

type Run = Record<string, unknown>;
let generowane = ''; /* SCAL_GENEROWANE dla uruchom (G1) */
let serwer: Server; let baza = ''; let odpowiedz: Run[] = []; let zapytania: string[] = [];
beforeAll(async () => {
  serwer = createServer((req, res) => { zapytania.push(req.url ?? ''); res.setHeader('content-type', 'application/json'); res.end(JSON.stringify({ workflow_runs: odpowiedz })); });
  await new Promise<void>(ok => serwer.listen(0, '127.0.0.1', () => ok()));
  baza = `http://127.0.0.1:${(serwer.address() as { port: number }).port}`;
});
afterAll(async () => { await new Promise(ok => serwer.close(ok)); for (const d of tmp) rmSync(d, { recursive: true, force: true }); });
beforeEach(() => { odpowiedz = []; zapytania = []; generowane = ''; });

/* repo próbne: zdalne (bare) + klon na gałęzi integracja-1-1 z jednym commitem; gałąź źródłowa „zrodlo” wypchnięta do zdalnego */
function srodowisko() {
  const zdalne = nowy('scal-zdalne-'); const dir = nowy('scal-repo-');
  git(zdalne, 'init', '-q', '--bare');
  git(dir, 'init', '-q', '-b', 'integracja-1-1');
  mkdirSync(join(dir, 'docs')); writeFileSync(join(dir, 'plik.txt'), '1\n'); writeFileSync(join(dir, 'docs/a.md'), 'a\n');
  git(dir, 'add', '-A'); git(dir, 'commit', '-q', '-m', 'start'); git(dir, 'remote', 'add', 'origin', zdalne);
  git(dir, 'push', '-q', 'origin', 'integracja-1-1');
  const zatwierdz = (plik: string, tresc: string) => { writeFileSync(join(dir, plik), tresc); git(dir, 'add', '-A'); git(dir, 'commit', '-q', '-m', `zmiana ${plik}`); };
  /* gałąź źródłowa: lista [plik, treść]; po wypchnięciu wracamy na integracja-1-1 */
  const gałąź = (nazwa: string, zmiany: [string, string][]) => {
    git(dir, 'checkout', '-q', '-b', nazwa); zmiany.forEach(([p, t]) => zatwierdz(p, t));
    git(dir, 'push', '-q', 'origin', nazwa); const sha = git(dir, 'rev-parse', 'HEAD'); git(dir, 'checkout', '-q', 'integracja-1-1'); return sha;
  };
  return { dir, zdalne, zatwierdz, gałąź };
}
const uruchom = (dir: string, ...arg: string[]) => new Promise<{ status: number | null; out: string }>(ok => {
  const p = spawn(process.execPath, [SKRYPT, ...arg], { cwd: dir, env: { ...ENV, SCAL_API_BAZA: baza, ...(generowane ? { SCAL_GENEROWANE: generowane } : {}) } });
  let out = ''; p.stdout.on('data', d => (out += d)); p.stderr.on('data', d => (out += d)); p.on('close', status => ok({ status, out }));
});
const run = (sha: string, o: Run = {}): Run => ({ id: 1, path: '.github/workflows/tests.yml', head_sha: sha, status: 'completed', conclusion: 'success', created_at: '2026-11-02T10:00:00Z', run_number: 1, ...o });
const scalone = (dir: string, sha: string) => spawnSync('git', ['merge-base', '--is-ancestor', sha, 'HEAD'], { cwd: dir }).status === 0;

describe('scal-galaz — bramka tests.yml (L-090 A, 02.11.2026)', () => {
  test('success → scala --no-ff i pyta API o SHA głowy gałęzi', async () => {
    const e = srodowisko(); const sha = e.gałąź('f', [['plik.txt', '2\n']]); odpowiedz = [run(sha)];
    const r = await uruchom(e.dir, 'f');
    expect(r.status).toBe(0); expect(scalone(e.dir, sha)).toBe(true);
    expect(git(e.dir, 'log', '-1', '--format=%p').split(' ')).toHaveLength(2); /* commit scalający (--no-ff) */
    expect(zapytania[0]).toContain(`head_sha=${sha}`);
  });
  test('w toku → kod 3, bez scalenia', async () => {
    const e = srodowisko(); const sha = e.gałąź('f', [['plik.txt', '2\n']]); odpowiedz = [run(sha, { status: 'in_progress', conclusion: null })];
    const r = await uruchom(e.dir, 'f');
    expect(r.status).toBe(3); expect(r.out).toContain('trwa'); expect(scalone(e.dir, sha)).toBe(false);
  });
  test.each(['failure', 'cancelled', 'timed_out', 'skipped'])('wynik %s → odmowa z powodem, bez scalenia', async (wynik) => {
    const e = srodowisko(); const sha = e.gałąź('f', [['plik.txt', '2\n']]); odpowiedz = [run(sha, { conclusion: wynik })];
    const r = await uruchom(e.dir, 'f');
    expect(r.status).toBe(1); expect(r.out).toContain(wynik); expect(scalone(e.dir, sha)).toBe(false);
  });
  test('brak przebiegu dla SHA → odmowa', async () => {
    const e = srodowisko(); const sha = e.gałąź('f', [['plik.txt', '2\n']]); odpowiedz = [];
    const r = await uruchom(e.dir, 'f'); expect(r.status).toBe(1); expect(r.out).toContain('brak przebiegu'); expect(scalone(e.dir, sha)).toBe(false);
  });
  test('przebieg innego workflowu (ios-unsigned) nie wystarcza', async () => {
    const e = srodowisko(); const sha = e.gałąź('f', [['plik.txt', '2\n']]); odpowiedz = [run(sha, { path: '.github/workflows/ios-unsigned.yml' })];
    expect((await uruchom(e.dir, 'f')).status).toBe(1); expect(scalone(e.dir, sha)).toBe(false);
  });
  test('wiele przebiegów dla SHA → liczy się najnowszy tests.yml (stary czerwony + nowy zielony → scala; stary zielony + nowy czerwony → odmowa)', async () => {
    const e = srodowisko(); const sha = e.gałąź('f', [['plik.txt', '2\n']]);
    odpowiedz = [run(sha, { id: 1, conclusion: 'failure', created_at: '2026-11-02T09:00:00Z' }), run(sha, { id: 2, created_at: '2026-11-02T11:00:00Z' })];
    expect((await uruchom(e.dir, 'f')).status).toBe(0); expect(scalone(e.dir, sha)).toBe(true);
    const e2 = srodowisko(); const sha2 = e2.gałąź('f', [['plik.txt', '2\n']]);
    odpowiedz = [run(sha2, { id: 3, created_at: '2026-11-02T09:00:00Z' }), run(sha2, { id: 4, conclusion: 'failure', created_at: '2026-11-02T11:00:00Z' })];
    expect((await uruchom(e2.dir, 'f')).status).toBe(1); expect(scalone(e2.dir, sha2)).toBe(false);
  });
  test('brudne drzewo (zmiana albo nieśledzony plik) → odmowa, bez zapytania o CI', async () => {
    const e = srodowisko(); const sha = e.gałąź('f', [['plik.txt', '2\n']]); odpowiedz = [run(sha)];
    writeFileSync(join(e.dir, 'nowy.txt'), 'x\n');
    const r = await uruchom(e.dir, 'f'); expect(r.status).toBe(1); expect(r.out).toContain('nie jest czyste'); expect(scalone(e.dir, sha)).toBe(false);
  });
  test('zła gałąź docelowa: bieżąca ≠ --do, bieżąca spoza integracja-1-1/main bez --do, źródło = bieżąca', async () => {
    const e = srodowisko(); const sha = e.gałąź('f', [['plik.txt', '2\n']]); odpowiedz = [run(sha)];
    const a = await uruchom(e.dir, 'f', '--do', 'main'); expect(a.status).toBe(1); expect(a.out).toContain('docelowa „main”');
    git(e.dir, 'checkout', '-q', '-b', 'inna');
    const b = await uruchom(e.dir, 'f'); expect(b.status).toBe(1); expect(b.out).toContain('nie jest docelową');
    const c = await uruchom(e.dir, 'f', '--do', 'inna'); expect(c.status).toBe(0); /* jawne --do zgodne z bieżącą — dozwolone */
    git(e.dir, 'checkout', '-q', 'f');
    const d = await uruchom(e.dir, 'f', '--do', 'f'); expect(d.status).toBe(1); expect(d.out).toContain('źródłowa jest gałęzią docelową');
    expect(scalone(e.dir, sha)).toBe(true); /* tylko wywołanie „c” (--do inna) scaliło */
  });
  test('użycie: brak argumentu, dwa argumenty, --do bez wartości → kod 2', async () => {
    const e = srodowisko();
    for (const arg of [[], ['a', 'b'], ['f', '--do']]) expect((await uruchom(e.dir, ...arg)).status).toBe(2);
  });
  test('nieistniejąca gałąź źródłowa → odmowa', async () => {
    const e = srodowisko(); expect((await uruchom(e.dir, 'nie-ma')).status).toBe(1);
  });
  test('same dokumenty względem celu → scala bez CI (verify:docs), API nie pytane', async () => {
    const e = srodowisko(); const sha = e.gałąź('d', [['docs/a.md', 'b\n'], ['docs/b.md', 'c\n']]);
    const r = await uruchom(e.dir, 'd'); expect(r.status).toBe(0); expect(scalone(e.dir, sha)).toBe(true); expect(zapytania).toHaveLength(0);
  });
  test('zmiana pliku danych w docs/ (json) to nie dokument → wymaga CI', async () => {
    const e = srodowisko(); const sha = e.gałąź('d', [['docs/dane.json', '{}\n']]); odpowiedz = [];
    expect((await uruchom(e.dir, 'd')).status).toBe(1); expect(scalone(e.dir, sha)).toBe(false);
  });
  /* L-080: gałąź z wcześniejszymi zmianami względem celu — nie wystarczy, że OSTATNI commit to dokument */
  test('L-080: kod, a na wierzchu commit tylko z dokumentem → wymaga CI (diff od wspólnego przodka ma kod)', async () => {
    const e = srodowisko(); const sha = e.gałąź('f', [['plik.txt', '2\n'], ['docs/a.md', 'b\n']]); odpowiedz = [];
    const r = await uruchom(e.dir, 'f'); expect(r.status).toBe(1); expect(r.out).toContain('brak przebiegu'); expect(scalone(e.dir, sha)).toBe(false);
    odpowiedz = [run(sha)]; expect((await uruchom(e.dir, 'f')).status).toBe(0); expect(scalone(e.dir, sha)).toBe(true);
  });
  test('L-080: kod już w celu (scalony wcześniej), na gałęzi dalej tylko dokument → bez CI', async () => {
    const e = srodowisko(); e.gałąź('f', [['plik.txt', '2\n']]);
    git(e.dir, 'merge', '-q', '--no-ff', '-m', 'wcześniejsze scalenie', 'origin/f'); git(e.dir, 'push', '-q', 'origin', 'integracja-1-1');
    git(e.dir, 'checkout', '-q', 'f'); e.zatwierdz('docs/a.md', 'dalej\n'); git(e.dir, 'push', '-q', 'origin', 'f'); const sha = git(e.dir, 'rev-parse', 'HEAD');
    git(e.dir, 'checkout', '-q', 'integracja-1-1');
    const r = await uruchom(e.dir, 'f'); expect(r.status).toBe(0); expect(scalone(e.dir, sha)).toBe(true); expect(zapytania).toHaveLength(0);
  });
  test('nie czeka na lokalny stan gałęzi źródłowej: liczy SHA origin/<gałąź> po fetch', async () => {
    const e = srodowisko(); const stary = e.gałąź('f', [['plik.txt', '2\n']]);
    git(e.dir, 'checkout', '-q', 'f'); e.zatwierdz('plik.txt', '3\n'); git(e.dir, 'push', '-q', 'origin', 'f'); const nowySha = git(e.dir, 'rev-parse', 'HEAD');
    git(e.dir, 'reset', '-q', '--hard', stary); git(e.dir, 'checkout', '-q', 'integracja-1-1'); odpowiedz = [run(nowySha)];
    const r = await uruchom(e.dir, 'f'); expect(r.status).toBe(0); expect(zapytania[0]).toContain(`head_sha=${nowySha}`);
  });
  test('reguła w CLAUDE.md wskazuje skrypt; skrypt nie używa tokenu ani sekretów', () => {
    const fs = require('fs');
    expect(fs.readFileSync(join(root, 'CLAUDE.md'), 'utf8')).toMatch(/node scripts\/scal-galaz\.mjs[\s\S]{0,400}L-090 A, właściciel 02\.11\.2026/);
    expect(fs.readFileSync(SKRYPT, 'utf8')).not.toMatch(/GITHUB_TOKEN|Authorization|authorization|secrets\./);
  });
});

/* Decyzja właściciela 03.11.2026 (wariant A): do main tylko stan z lokalnym PEŁNYM verify (znacznik „pelne”); „szybkie” wystarcza w haku, nie tutaj. */
describe('scal-galaz --do main — znacznik pełnego verify (03.11.2026)', () => {
  const ZN = join(root, 'scripts/verify-znacznik.mjs');
  const naMain = () => { const e = srodowisko(); const sha = e.gałąź('f', [['plik.txt', '2\n']]); git(e.dir, 'checkout', '-q', '-b', 'main'); odpowiedz = [run(sha)];
    const plik = join(nowy('zn-'), 'z.json'); const znacz = (rodzaj: string) => { git(e.dir, 'checkout', '-q', 'f'); const r = spawnSync(process.execPath, [ZN, '--zapisz', rodzaj], { cwd: e.dir, env: { ...ENV, VERIFY_ZNACZNIK_PLIK: plik, CI: '' }, encoding: 'utf8' }); git(e.dir, 'checkout', '-q', 'main'); return r; };
    return { ...e, sha, plik, znacz }; };
  const scalDoMain = (x: ReturnType<typeof naMain>) => new Promise<{ status: number | null; out: string }>(ok => {
    const p = spawn(process.execPath, [SKRYPT, 'f', '--do', 'main'], { cwd: x.dir, env: { ...ENV, SCAL_API_BAZA: baza, VERIFY_ZNACZNIK_PLIK: x.plik } });
    let out = ''; p.stdout.on('data', d => (out += d)); p.stderr.on('data', d => (out += d)); p.on('close', status => ok({ status, out })); });
  test('bez znacznika albo ze znacznikiem „szybkie” → odmowa mimo zielonego CI; z „pelne” → scala', async () => {
    const x = naMain(); let r = await scalDoMain(x); expect(r.status).toBe(1); expect(r.out).toContain('pełnego npm run verify'); expect(scalone(x.dir, x.sha)).toBe(false);
    x.znacz('szybkie'); r = await scalDoMain(x); expect(r.status).toBe(1); expect(scalone(x.dir, x.sha)).toBe(false);
    x.znacz('pelne'); r = await scalDoMain(x); expect(r.status).toBe(0); expect(scalone(x.dir, x.sha)).toBe(true);
  });
});

/* ZB-041 G1 (decyzja właściciela 04.11.2026 ~06:00 PL, wariant A): konflikt scalenia wyłącznie w plikach generowanych (scripts/pliki-generowane.mjs) rozwiązuje skrypt:
   wersja docelowa, generatory, zatwierdzenie. Każdy inny konflikt przerywa scalenie jak dotąd. Lista i generator w repo próbnym: SCAL_GENEROWANE (tylko testy). */
describe('scal-galaz — konflikty w plikach generowanych (ZB-041 G1, 04.11.2026)', () => {
  const GEN = JSON.stringify([{ plik: 'gen.txt', polecenie: ['node', 'gen.js'] }]);
  const GEN_JS = "const fs=require('fs');fs.writeFileSync('gen.txt','pochodna:'+fs.readFileSync('plik.txt','utf8'));\n";
  /** integracja ma gen.js + gen.txt (pochodna plik.txt); gałąź f zmienia plik.txt i gen.txt; integracja po rozejściu zmienia gen.txt (konflikt tylko w gen.txt) */
  function zKonfliktem(dodatkowo: 'brak' | 'plik' | 'generator-pada' = 'brak') {
    const e = srodowisko();
    e.zatwierdz('gen.js', dodatkowo === 'generator-pada' ? 'process.exit(1);\n' : GEN_JS); e.zatwierdz('gen.txt', 'pochodna:1\n'); git(e.dir, 'push', '-q', 'origin', 'integracja-1-1');
    const sha = e.gałąź('f', [['plik.txt', '2\n'], ['gen.txt', 'pochodna:2\n']]);
    e.zatwierdz('gen.txt', 'pochodna:docelowa\n');
    if (dodatkowo === 'plik') e.zatwierdz('plik.txt', 'konflikt\n');
    odpowiedz = [run(sha)]; generowane = GEN;
    return { ...e, sha, głowa: git(e.dir, 'rev-parse', 'HEAD') };
  }
  const bezScalania = (dir: string, głowa: string) => {
    expect(git(dir, 'rev-parse', 'HEAD')).toBe(głowa); expect(git(dir, 'status', '--porcelain')).toBe('');
    expect(spawnSync('git', ['rev-parse', '-q', '--verify', 'MERGE_HEAD'], { cwd: dir }).status).not.toBe(0);
  };
  test('konflikt tylko w pliku generowanym → scala; plik przeliczony generatorem z drzewa po scaleniu, drzewo czyste, scalenie ma dwoje rodziców', async () => {
    const x = zKonfliktem(); const r = await uruchom(x.dir, 'f');
    expect(r.status).toBe(0); expect(scalone(x.dir, x.sha)).toBe(true);
    expect(git(x.dir, 'show', 'HEAD:gen.txt')).toBe('pochodna:2'); expect(git(x.dir, 'show', 'HEAD:plik.txt')).toBe('2');
    expect(git(x.dir, 'status', '--porcelain')).toBe(''); expect(git(x.dir, 'log', '-1', '--format=%p').split(' ')).toHaveLength(2);
    expect(git(x.dir, 'log', '-1', '--format=%s')).toContain('gen.txt'); expect(r.out).toContain('gen.txt');
  });
  test('konflikt w pliku generowanym i w zwykłym → odmowa, scalenie przerwane, HEAD i drzewo bez zmian', async () => {
    const x = zKonfliktem('plik'); const r = await uruchom(x.dir, 'f');
    expect(r.status).toBe(1); expect(r.out).toContain('przerwane'); expect(scalone(x.dir, x.sha)).toBe(false); bezScalania(x.dir, x.głowa);
  });
  test('konflikt tylko w pliku spoza listy generowanych → odmowa jak dotąd', async () => {
    const e = srodowisko(); const sha = e.gałąź('f', [['plik.txt', '2\n']]); e.zatwierdz('plik.txt', 'inaczej\n'); const głowa = git(e.dir, 'rev-parse', 'HEAD');
    odpowiedz = [run(sha)]; generowane = GEN; const r = await uruchom(e.dir, 'f');
    expect(r.status).toBe(1); expect(scalone(e.dir, sha)).toBe(false); bezScalania(e.dir, głowa);
  });
  test('generator kończy się błędem → odmowa, scalenie przerwane', async () => {
    const x = zKonfliktem('generator-pada'); const r = await uruchom(x.dir, 'f');
    expect(r.status).toBe(1); expect(r.out).toContain('generator'); expect(scalone(x.dir, x.sha)).toBe(false); bezScalania(x.dir, x.głowa);
  });
  test('L-080 / bramka CI: konflikt tylko w generowanym nie omija tests.yml — czerwony przebieg → odmowa przed scaleniem', async () => {
    const x = zKonfliktem(); odpowiedz = [run(x.sha, { conclusion: 'failure' })];
    const r = await uruchom(x.dir, 'f'); expect(r.status).toBe(1); bezScalania(x.dir, x.głowa);
  });
  test('lista w jednym miejscu: pliki z generatorem --write istnieją w repo, a skrypty generatorów też', () => {
    const fs = require('fs');
    const { GENEROWANE } = JSON.parse(require('child_process').execFileSync(process.execPath, ['--input-type=module', '-e', `import { GENEROWANE } from ${JSON.stringify(join(root, 'scripts/pliki-generowane.mjs'))}; console.log(JSON.stringify({ GENEROWANE }));`], { encoding: 'utf8' }));
    expect(GENEROWANE.length).toBeGreaterThanOrEqual(5);
    for (const g of GENEROWANE) { expect(fs.existsSync(join(root, g.plik))).toBe(true); expect(fs.existsSync(join(root, g.polecenie[1]))).toBe(true); expect(g.polecenie).toContain('--write'); }
    expect(GENEROWANE.map((g: { plik: string }) => g.plik)).not.toContain('docs/lokalizacja/skroty-przekladu.json');
  });
});

/* L-105, wariant A (decyzja właściciela 04.11.2026): po UDANYM scaleniu skrypt usuwa czysty worktree scalonej gałęzi (dysk kontenera). */
describe('scal-galaz — sprzątanie worktree po scaleniu (L-105, 04.11.2026)', () => {
  /** worktree gałęzi „f” obok repo próbnego; node_modules w nim to dowiązanie do katalogu z plikiem-świadkiem */
  function zWorktree(zmiany: [string, string][] = [['plik.txt', '2\n']]) {
    const e = srodowisko(); const sha = e.gałąź('f', zmiany); odpowiedz = [run(sha)];
    const wt = join(nowy('scal-wt-'), 'wt'); git(e.dir, 'worktree', 'add', '-q', wt, 'f');
    const cel = nowy('scal-nm-'); writeFileSync(join(cel, 'swiadek.txt'), 'x\n'); symlinkSync(cel, join(wt, 'node_modules'));
    return { ...e, sha, wt, cel };
  }
  test('czysty worktree (z dowiązaniem node_modules) → usunięty po scaleniu, cel dowiązania nietknięty', async () => {
    const x = zWorktree(); const r = await uruchom(x.dir, 'f');
    expect(r.status).toBe(0); expect(scalone(x.dir, x.sha)).toBe(true);
    expect(existsSync(x.wt)).toBe(false); expect(existsSync(join(x.cel, 'swiadek.txt'))).toBe(true);
    expect(git(x.dir, 'worktree', 'list', '--porcelain')).not.toContain(x.wt); expect(r.out).toContain('usunięto worktree');
  });
  test('brudny worktree (plik nieśledzony albo zmiana) → zostaje, komunikat, kod 0', async () => {
    for (const brud of ['nowy.txt', 'plik.txt']) {
      const x = zWorktree(); writeFileSync(join(x.wt, brud), 'brud\n');
      const r = await uruchom(x.dir, 'f');
      expect(r.status).toBe(0); expect(scalone(x.dir, x.sha)).toBe(true);
      expect(existsSync(join(x.wt, brud))).toBe(true); expect(r.out).toContain('zostawiam');
    }
  });
  test('odmowa (czerwone CI) albo w toku → worktree zostaje', async () => {
    const x = zWorktree(); odpowiedz = [run(x.sha, { conclusion: 'failure' })];
    expect((await uruchom(x.dir, 'f')).status).toBe(1); expect(existsSync(x.wt)).toBe(true);
    odpowiedz = [run(x.sha, { status: 'in_progress', conclusion: null })];
    expect((await uruchom(x.dir, 'f')).status).toBe(3); expect(existsSync(x.wt)).toBe(true);
  });
  test('--zostaw-worktree → scala, worktree zostaje', async () => {
    const x = zWorktree(); const r = await uruchom(x.dir, 'f', '--zostaw-worktree');
    expect(r.status).toBe(0); expect(scalone(x.dir, x.sha)).toBe(true); expect(existsSync(x.wt)).toBe(true);
  });
  test('gałąź bez worktree → scala jak dotąd (kod 0)', async () => {
    const e = srodowisko(); const sha = e.gałąź('f', [['plik.txt', '2\n']]); odpowiedz = [run(sha)];
    expect((await uruchom(e.dir, 'f')).status).toBe(0);
  });
  test('worktree bieżącego katalogu nie jest usuwany (skrypt uruchomiony z worktree gałęzi docelowej = źródłowej odpada; docelowa w drugim worktree)', async () => {
    const e = srodowisko(); const sha = e.gałąź('f', [['plik.txt', '2\n']]); odpowiedz = [run(sha)];
    git(e.dir, 'checkout', '-q', '-b', 'tmp'); const wt = join(nowy('scal-wt-'), 'cel'); git(e.dir, 'worktree', 'add', '-q', wt, 'integracja-1-1');
    const r = await uruchom(wt, 'f'); expect(r.status).toBe(0); expect(existsSync(wt)).toBe(true); /* worktree bieżący (cel) zostaje */
  });
  test('L-080: gałąź z wcześniejszymi zmianami względem celu (kod + dokument na wierzchu) → po scaleniu z CI worktree usunięty; bez CI odmowa i worktree zostaje', async () => {
    const x = zWorktree([['plik.txt', '2\n'], ['docs/a.md', 'b\n']]); odpowiedz = [];
    expect((await uruchom(x.dir, 'f')).status).toBe(1); expect(existsSync(x.wt)).toBe(true);
    odpowiedz = [run(x.sha)]; expect((await uruchom(x.dir, 'f')).status).toBe(0); expect(existsSync(x.wt)).toBe(false);
  });
  test('same dokumenty (bez CI) → worktree też usunięty po scaleniu', async () => {
    const x = zWorktree([['docs/a.md', 'b\n']]); odpowiedz = [];
    expect((await uruchom(x.dir, 'f')).status).toBe(0); expect(existsSync(x.wt)).toBe(false);
  });
  test('brief agenta (programista, tester-e2e): przed npm ci sprawdź df, próg 3 GB (04.11.2026)', () => {
    const fs = require('fs');
    for (const rola of ['programista', 'tester-e2e']) expect(fs.readFileSync(join(root, `.claude/agents/${rola}.md`), 'utf8')).toMatch(/df -h[\s\S]{0,200}3 GB/);
  });
});
