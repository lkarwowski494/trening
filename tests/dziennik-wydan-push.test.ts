/* L-117 (08.11.2026): scripts/ci/dziennik-wydan-push.sh — zadanie `tag` w testflight.yml dopisuje wiersz dziennika wydań i wypycha go na gałąź builda.
 * Dowód na kopii repozytorium: lokalne repozytorium zdalne (bare), klon z docs/09, skrypt wykonany jak w CI. Scenariusze: sukces, wyścig (gałąź przesunięta), odrzucone wypchnięcie
 * (hak pre-receive) — wtedy kod 0 i ostrzeżenie z instrukcją, idempotencja, hak pre-push z core.hooksPath nie blokuje.
 * Niezależnie sprawdzamy strukturę workflowu testflight.yml (uprawnienia, kolejność, brak wpływu na wynik wydania). */
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import { spawnSync } from 'child_process';

const root = path.join(__dirname, '..');
const skrypt = path.join(root, 'scripts/ci/dziennik-wydan-push.sh');
const doc = fs.readFileSync(path.join(root, 'docs/09-plan-testow.md'), 'utf8');
const tmp = fs.realpathSync(fs.mkdtempSync(path.join(os.tmpdir(), 'dz-push-')));
afterAll(() => fs.rmSync(tmp, { recursive: true, force: true }));
const git = (cwd: string, ...a: string[]) => { const r = spawnSync('git', a, { cwd, encoding: 'utf8' }); if (r.status !== 0) throw new Error(`git ${a.join(' ')}: ${r.stderr}`); return r.stdout.trim(); };
const G = ['-c', 'user.name=t', '-c', 'user.email=t@t'];

function srodowisko(nazwa: string) {
  const d = path.join(tmp, nazwa); fs.mkdirSync(d);
  const zdalne = path.join(d, 'zdalne.git'); git(d, 'init', '-q', '--bare', '-b', 'galaz-x', zdalne);
  const klon = path.join(d, 'klon'); git(d, 'clone', '-q', zdalne, klon);
  fs.mkdirSync(path.join(klon, 'docs')); fs.writeFileSync(path.join(klon, 'docs/09-plan-testow.md'), doc);
  git(klon, ...G, 'add', '.'); git(klon, ...G, 'commit', '-q', '-m', 'start'); git(klon, 'push', '-q', 'origin', 'HEAD:refs/heads/galaz-x');
  return { d, zdalne, klon, sha: git(klon, 'rev-parse', 'HEAD'), summary: path.join(d, 'summary.md') };
}
function uruchom(s: ReturnType<typeof srodowisko>, extra: Record<string, string> = {}) {
  const r = spawnSync('bash', [skrypt], { cwd: s.klon, encoding: 'utf8', env: { ...process.env, T: 'v1.1.0-b1040', GITHUB_SHA: s.sha, GITHUB_RUN_NUMBER: '40', GITHUB_RUN_ID: '999', REF_NAME: 'galaz-x', GITHUB_STEP_SUMMARY: s.summary, GIT_CONFIG_GLOBAL: '/dev/null', ...extra } });
  return { status: r.status, out: r.stdout + r.stderr, summary: fs.existsSync(s.summary) ? fs.readFileSync(s.summary, 'utf8') : '' };
}
const dokZdalny = (s: ReturnType<typeof srodowisko>) => git(s.zdalne, 'show', 'galaz-x:docs/09-plan-testow.md');
const liczWiersze = (t: string) => t.split('\n').filter(l => l.includes('`v1.1.0-b1040`')).length;

describe('dziennik-wydan-push.sh', () => {
  test('sukces: wiersz na gałęzi zdalnej, commit tylko docs/09, kod 0', () => {
    const s = srodowisko('ok'); const r = uruchom(s);
    expect(r.status).toBe(0);
    expect(liczWiersze(dokZdalny(s))).toBe(1);
    expect(git(s.zdalne, 'diff', '--name-only', 'HEAD~1', 'HEAD')).toBe('docs/09-plan-testow.md');
  });

  test('idempotencja: wiersz już jest (np. dopisany ręcznie) — brak nowego commitu, kod 0', () => {
    const s = srodowisko('idem'); uruchom(s); const przed = git(s.zdalne, 'rev-parse', 'galaz-x');
    const r = uruchom(s);
    expect(r.status).toBe(0); expect(git(s.zdalne, 'rev-parse', 'galaz-x')).toBe(przed); expect(liczWiersze(dokZdalny(s))).toBe(1);
  });

  test('wyścig: gałąź przesunięta w trakcie — jedno powtórzenie, wiersz jest, cudzy commit zachowany', () => {
    const s = srodowisko('wyscig');
    const inny = path.join(s.d, 'inny'); git(s.d, 'clone', '-q', s.zdalne, inny);
    fs.writeFileSync(path.join(inny, 'cudzy.txt'), 'x'); git(inny, ...G, 'add', '.'); git(inny, ...G, 'commit', '-q', '-m', 'cudzy'); git(inny, 'push', '-q', 'origin', 'HEAD:refs/heads/galaz-x');
    const r = uruchom(s);
    expect(r.status).toBe(0); expect(r.out).toContain('przesunięta');
    expect(liczWiersze(dokZdalny(s))).toBe(1);
    expect(git(s.zdalne, 'show', 'galaz-x:cudzy.txt')).toBe('x');
  });

  test('odrzucone wypchnięcie (ochrona gałęzi): kod 0 — wydanie nie przepada — ostrzeżenie i instrukcja ręcznego dopisania w podsumowaniu', () => {
    const s = srodowisko('odrzut');
    fs.writeFileSync(path.join(s.zdalne, 'hooks/pre-receive'), '#!/bin/sh\necho "chroniona" >&2\nexit 1\n', { mode: 0o755 });
    const r = uruchom(s);
    expect(r.status).toBe(0); expect(r.out).toContain('::warning::Dziennik wydań');
    expect(r.summary).toContain('node scripts/dziennik-wydan.mjs --tag v1.1.0-b1040');
    expect(liczWiersze(dokZdalny(s))).toBe(0);
  });

  test('zły tag/numer: kod 0 i ostrzeżenie (błąd skryptu wiersza nie zatrzymuje wydania)', () => {
    const s = srodowisko('zlytag'); const r = uruchom(s, { GITHUB_RUN_NUMBER: '41' });
    expect(r.status).toBe(0); expect(r.out).toContain('::warning::'); expect(liczWiersze(dokZdalny(s))).toBe(0);
  });

  test('hak pre-push (core.hooksPath ustawione jak po npm ci) nie blokuje wypchnięcia z CI', () => {
    const s = srodowisko('hak'); const hooks = path.join(s.d, 'hooks'); fs.mkdirSync(hooks);
    fs.writeFileSync(path.join(hooks, 'pre-push'), '#!/bin/sh\necho "hak zatrzymał" >&2\nexit 1\n', { mode: 0o755 });
    git(s.klon, 'config', 'core.hooksPath', hooks);
    const r = uruchom(s);
    expect(r.status).toBe(0); expect(liczWiersze(dokZdalny(s))).toBe(1);
  });
});

describe('testflight.yml — zadanie tag woła skrypt dziennika', () => {
  const y = fs.readFileSync(path.join(root, '.github/workflows/testflight.yml'), 'utf8');
  const tag = y.slice(y.indexOf('\n  tag:\n'));
  test('uprawnienie contents: write, krok po utworzeniu tagu i przed plikiem wydania, bez wpływu na wynik (continue-on-error)', () => {
    expect(tag).toMatch(/permissions:\s*\n\s+contents: write/);
    const i = tag.indexOf('Tag wydania i mapa'), j = tag.indexOf('scripts/ci/dziennik-wydan-push.sh'), k = tag.indexOf('Plik wydania Trening-sim.zip');
    expect(i).toBeGreaterThan(0); expect(j).toBeGreaterThan(i); expect(k).toBeGreaterThan(j);
    const krok = tag.slice(tag.lastIndexOf('      - name:', j), k);
    expect(krok).toContain('continue-on-error: true');
    expect(krok).toContain('REF_NAME: ${{ github.ref_name }}');
  });
  test('wypychanie na gałąź builda jest tylko w skrypcie (workflow nie ma własnego `git push` poza tagiem)', () => {
    expect(tag.match(/git push/g)?.length).toBe(1);
  });
});
