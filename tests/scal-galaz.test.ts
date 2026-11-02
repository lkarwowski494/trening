/* L-090, wariant A (decyzja właściciela 02.11.2026): scripts/scal-galaz.mjs scala gałąź tylko przy zielonym tests.yml dla SHA jej głowy.
   Bez sieci: lokalny serwer HTTP udaje API Actions (SCAL_API_BAZA); prawdziwe repozytoria git w katalogach tymczasowych.
   Przypadek L-080: gałąź z wcześniejszymi zmianami względem celu — ostatni commit to dokument, ale diff od wspólnego przodka ma kod. */
import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from 'fs';
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
let serwer: Server; let baza = ''; let odpowiedz: Run[] = []; let zapytania: string[] = [];
beforeAll(async () => {
  serwer = createServer((req, res) => { zapytania.push(req.url ?? ''); res.setHeader('content-type', 'application/json'); res.end(JSON.stringify({ workflow_runs: odpowiedz })); });
  await new Promise<void>(ok => serwer.listen(0, '127.0.0.1', () => ok()));
  baza = `http://127.0.0.1:${(serwer.address() as { port: number }).port}`;
});
afterAll(async () => { await new Promise(ok => serwer.close(ok)); for (const d of tmp) rmSync(d, { recursive: true, force: true }); });
beforeEach(() => { odpowiedz = []; zapytania = []; });

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
  const p = spawn(process.execPath, [SKRYPT, ...arg], { cwd: dir, env: { ...ENV, SCAL_API_BAZA: baza } });
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
