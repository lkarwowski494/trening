/* L-118 wariant A (decyzja właściciela 08.11.2026): hak SessionStart (startup) w .claude/settings.json pobiera origin/integracja-1-1 i wypisuje różnicę CLAUDE.md
   względem bieżącej gałęzi; bez sieci — ostrzeżenie, nigdy błąd. Test jak dla haka „compact”: uruchamiamy polecenie z settings.json w repozytoriach próbnych. */
import { mkdtempSync, readFileSync, realpathSync, rmSync, writeFileSync } from 'fs';
import { tmpdir } from 'os';
import { join } from 'path';
import { spawnSync } from 'child_process';

const root = join(__dirname, '..');
const settings = JSON.parse(readFileSync(join(root, '.claude/settings.json'), 'utf8'));
const wpisy: { matcher: string; hooks: { type: string; command: string; timeout: number }[] }[] = settings.hooks.SessionStart;
const startup = wpisy.find(w => w.matcher === 'startup')!;
const compact = wpisy.find(w => w.matcher === 'compact')!;
const ENV = { ...process.env, GIT_AUTHOR_NAME: 't', GIT_AUTHOR_EMAIL: 't@example.invalid', GIT_COMMITTER_NAME: 't', GIT_COMMITTER_EMAIL: 't@example.invalid' };
const tmp: string[] = [];
const kat = (p: string) => { const d = mkdtempSync(join(realpathSync(tmpdir()), p)); tmp.push(d); return d; };
afterAll(() => { for (const d of tmp) rmSync(d, { recursive: true, force: true }); });
const git = (cwd: string, ...a: string[]) => { const r = spawnSync('git', a, { cwd, env: ENV, encoding: 'utf8' }); if (r.status !== 0) throw new Error(r.stderr); return r.stdout; };
const uruchom = (dir: string) => spawnSync('sh', ['-c', startup.hooks[0].command], { cwd: dir, env: { ...ENV, CLAUDE_PROJECT_DIR: dir }, encoding: 'utf8' });

/* zdalne z gałęzią integracja-1-1 (CLAUDE.md „nowy”) i kopia robocza na gałęzi z CLAUDE.md „stary” */
function repo(integracjaClaude: string, lokalnyClaude: string, zRemote = true) {
  const zdalne = kat('startup-zdalne-'); const dir = kat('startup-repo-');
  git(zdalne, 'init', '-q', '--bare');
  git(dir, 'init', '-q', '-b', 'main'); writeFileSync(join(dir, 'CLAUDE.md'), lokalnyClaude); git(dir, 'add', '-A'); git(dir, 'commit', '-q', '-m', 'start');
  git(dir, 'checkout', '-q', '-b', 'integracja-1-1'); writeFileSync(join(dir, 'CLAUDE.md'), integracjaClaude); git(dir, 'commit', '-q', '--allow-empty', '-am', 'integracja');
  if (zRemote) { git(dir, 'remote', 'add', 'origin', zdalne); git(dir, 'push', '-q', 'origin', 'integracja-1-1'); }
  git(dir, 'checkout', '-q', 'main');
  return dir;
}

describe('hak SessionStart startup — różnica CLAUDE.md względem integracji (L-118, 08.11.2026)', () => {
  test('konfiguracja: osobny wpis startup z krótkim limitem czasu, obok haka compact (który zostaje)', () => {
    expect(startup.hooks[0].type).toBe('command'); expect(startup.hooks[0].timeout).toBeLessThanOrEqual(15);
    expect(startup.hooks[0].command).toContain('origin integracja-1-1'); expect(startup.hooks[0].command).toContain('git diff HEAD origin/integracja-1-1 -- CLAUDE.md');
    expect(compact.hooks[0].command).toContain('CLAUDE.md z dysku');
  });
  test('CLAUDE.md w integracji inny niż na bieżącej gałęzi → wypisuje różnicę; kod wyjścia 0', () => {
    const r = uruchom(repo('zasada A\nzasada NOWA\n', 'zasada A\n'));
    expect(r.status).toBe(0); expect(r.stdout).toContain('L-118'); expect(r.stdout).toContain('+zasada NOWA');
  });
  test('ten sam CLAUDE.md → cisza', () => {
    const r = uruchom(repo('a\n', 'a\n')); expect(r.status).toBe(0); expect(r.stdout).toBe('');
  });
  test('brak dostępu do zdalnego (bez sieci) → ostrzeżenie, nie błąd', () => {
    const r = uruchom(repo('a\nb\n', 'a\n', false)); expect(r.status).toBe(0); expect(r.stdout).toContain('Ostrzeżenie (L-118)');
  });
  test('różnica jest ucinana do 300 linii (długi plik nie zalewa kontekstu)', () => {
    const dlugi = Array.from({ length: 1000 }, (_, i) => `linia ${i}`).join('\n') + '\n';
    const r = uruchom(repo(dlugi, 'x\n')); expect(r.status).toBe(0); expect(r.stdout.split('\n').length).toBeLessThan(320);
  });
});
