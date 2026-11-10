/* Skan historii przed publikacją (lekcja z docs/40 o briefie z adresem e-mail w stopce, 10.11.2026): strażnik public-repo widzi tylko stan końcowy plików,
   a adres dodany w jednym commicie i usunięty w następnym trafił do publicznej historii gałęzi. scripts/skan-publiczny.mjs czyta dodane linie commitów,
   których nie ma jeszcze w żadnej gałęzi zdalnej; uruchamia go check:pochodne (hak pre-push). */
import { mkdtempSync, rmSync, writeFileSync, mkdirSync, readFileSync, realpathSync } from 'fs';
import { tmpdir } from 'os';
import { join, dirname } from 'path';
import { spawnSync } from 'child_process';

const root = join(__dirname, '..');
const SKRYPT = join(root, 'scripts/skan-publiczny.mjs');
const tmp: string[] = [];
afterAll(() => { for (const d of tmp) rmSync(d, { recursive: true, force: true }); });
const ENV = { ...process.env, GIT_AUTHOR_NAME: 't', GIT_AUTHOR_EMAIL: 't@t.invalid', GIT_COMMITTER_NAME: 't', GIT_COMMITTER_EMAIL: 't@t.invalid', GIT_CONFIG_NOSYSTEM: '1', HOME: tmpdir() };
const git = (cwd: string, args: string[]) => { const r = spawnSync('git', args, { cwd, env: ENV, encoding: 'utf8' }); if (r.status !== 0) throw new Error(r.stderr); return r.stdout; };
const zapisz = (dir: string, plik: string, tresc: string) => { mkdirSync(dirname(join(dir, plik)), { recursive: true }); writeFileSync(join(dir, plik), tresc); };
const commit = (dir: string, plik: string, tresc: string) => { zapisz(dir, plik, tresc); git(dir, ['add', '-A']); git(dir, ['commit', '-qm', `zmiana ${plik}`]); };
const skan = (dir: string, rev?: string) => spawnSync(process.execPath, [SKRYPT, ...(rev ? [rev] : [])], { cwd: dir, env: ENV, encoding: 'utf8' });
/* Adres złożony w czasie testu — w pliku testu nie ma pełnego adresu spoza listy (strażnik public-repo i ten skan nie skanują tests/, ale to bez znaczenia). */
const ADRES = ['jan.kowalski', 'example.org'].join('@');

/** Repo próbne: main z jednym commitem wypchniętym do zdalnego (bare), gałąź funkcji `f`. */
function repo(): string {
  const d = realpathSync(mkdtempSync(join(tmpdir(), 'skan-pub-'))); tmp.push(d);
  const zdalne = join(d, 'zdalne.git'); const dir = join(d, 'praca');
  git(d, ['init', '-q', '--bare', zdalne]); git(d, ['init', '-q', '-b', 'main', dir]);
  commit(dir, 'README.md', '# repo\n');
  git(dir, ['remote', 'add', 'origin', zdalne]); git(dir, ['push', '-q', 'origin', 'main']);
  git(dir, ['checkout', '-qb', 'f']);
  return dir;
}

describe('skan-publiczny (lekcja 10.11.2026: adres e-mail w historii gałęzi)', () => {
  test('przypadek z lekcji: adres dodany w briefie i usunięty w następnym commicie — stan końcowy czysty, skan zatrzymuje (kod 1, commit i plik, bez samego adresu)', () => {
    const dir = repo();
    commit(dir, 'docs/brief.md', `Stopka: Co-Authored-By: X <${ADRES}>\n`);
    const zly = git(dir, ['rev-parse', '--short=8', 'HEAD']).trim();
    commit(dir, 'docs/brief.md', 'Stopka: z przypomnienia systemowego sesji.\n');
    expect(readFileSync(join(dir, 'docs/brief.md'), 'utf8')).not.toContain('@');
    const r = skan(dir);
    expect(r.status).toBe(1);
    expect(r.stderr).toContain(`${zly} docs/brief.md: e-mail`);
    expect(r.stderr).not.toContain(ADRES);
  });
  test('L-080: gałąź z wcześniejszymi zmianami względem main — znalezisko kilka commitów przed głową i commit scalenia nie ukrywają go', () => {
    const dir = repo();
    commit(dir, 'docs/a.md', 'raport: /tmp/claude-0/x/scratchpad/arkusz.png\n');
    commit(dir, 'lib/b.ts', 'export const b = 1;\n');
    git(dir, ['checkout', '-q', 'main']); commit(dir, 'docs/c.md', 'main\n'); git(dir, ['checkout', '-q', 'f']);
    git(dir, ['merge', '-q', '--no-edit', 'main']);
    commit(dir, 'docs/d.md', 'czysto\n');
    const r = skan(dir);
    expect(r.status).toBe(1);
    expect(r.stderr).toMatch(/docs\/a\.md: ścieżka lokalna/);
    expect(r.stderr.match(/^ {2}\S+ /gm)).toHaveLength(1);
  });
  test('commity już opublikowane (w gałęzi zdalnej) są pomijane — tylko nowe commity blokują', () => {
    const dir = repo();
    commit(dir, 'docs/brief.md', `adres ${ADRES}\n`);
    git(dir, ['push', '-q', '--no-verify', 'origin', 'f']);
    commit(dir, 'docs/brief.md', 'czysto\n');
    const r = skan(dir);
    expect([r.status, r.stdout.trim()]).toEqual([0, 'skan-publiczny: czysto (commity nieopublikowane)']);
  });
  test('zakres jak w public-repo: adresy dozwolone, tests/, plik licencji i ścieżki poza docs/README/CLAUDE przechodzą', () => {
    const dir = repo();
    commit(dir, 'docs/ok.md', 'support@apps4brew.com hello@apps4brew.com\n');
    commit(dir, 'tests/x.test.ts', `const a = '${ADRES}'; const p = '/tmp/claude-0/x/';\n`);
    commit(dir, 'lib/licenses.generated.ts', `// Wygenerowane ${ADRES}\n`);
    commit(dir, 'lib/c.ts', "const p = '/tmp/claude-0/x/';\n");
    expect(skan(dir).status).toBe(0);
    commit(dir, 'site/index.html', `<a>${ADRES}</a>\n`);
    expect(skan(dir).status).toBe(1);
  });
  test('reguły zgodne z tests/public-repo.test.ts (jedna reguła w dwóch miejscach — ta sama treść)', () => {
    const skrypt = readFileSync(SKRYPT, 'utf8'); const pr = readFileSync(join(root, 'tests/public-repo.test.ts'), 'utf8');
    const re = (s: string) => /const EMAIL_RE = (\/.+\/g);/.exec(s)?.[1];
    const dozw = (s: string) => /const ALLOWED_EMAILS = (\[[^\]]+\]);/.exec(s)?.[1];
    expect([re(skrypt), dozw(skrypt)]).toEqual([re(pr), dozw(pr)]);
    expect(re(skrypt)).toBeTruthy();
    expect(pr).toContain("const EXEMPT = ['lib/licenses.generated.ts'];");
    expect(pr).toContain('/\\/tmp\\/claude-\\d+\\//');
  });
  test('check:pochodne (hak pre-push) uruchamia skan', () => {
    expect(readFileSync(join(root, 'scripts/pochodne.mjs'), 'utf8')).toContain("polecenie: ['node', 'scripts/skan-publiczny.mjs']");
  });
});
