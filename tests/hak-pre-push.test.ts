/* L-009 (decyzja właściciela 21.10.2026): hak pre-push w repo (lint + check:readme + check:matrix), instalowany przez `prepare`,
   plus krok „sprawdź wynik tests.yml po wypchnięciu” w poleceniach dla agentów, które wypychają. Sprawdzamy hak na prawdziwym git push
   (także z worktree), z podstawionym `npm`, żeby nie uruchamiać lintu w teście. */
import { chmodSync, copyFileSync, existsSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, rmSync, statSync, symlinkSync, writeFileSync } from 'fs';
import { tmpdir } from 'os';
import { join } from 'path';
import { spawnSync } from 'child_process';

const root = join(__dirname, '..');
const HAK = join(root, 'scripts/hooks/pre-push');
const INSTALATOR = join(root, 'scripts/hooks/instaluj.mjs');
const SPRAWDZ = join(root, 'scripts/hooks/sprawdz-instalacje.mjs');
const pkg = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'));
const hakTekst = () => readFileSync(HAK, 'utf8');
const bezKomentarzy = (s: string) => s.split('\n').filter(l => !/^\s*#/.test(l)).join('\n');

const tmp: string[] = [];
const nowyKatalog = (p: string) => { const d = mkdtempSync(join(tmpdir(), p)); tmp.push(d); return d; };
afterAll(() => { for (const d of tmp) rmSync(d, { recursive: true, force: true }); });

const GIT_ENV = { GIT_AUTHOR_NAME: 't', GIT_AUTHOR_EMAIL: 't@example.invalid', GIT_COMMITTER_NAME: 't', GIT_COMMITTER_EMAIL: 't@example.invalid' };
const bezCI = () => { const e = { ...process.env, ...GIT_ENV } as Record<string, string | undefined>; delete e.CI; return e as NodeJS.ProcessEnv; };
const git = (cwd: string, args: string[], env: NodeJS.ProcessEnv = bezCI()) => spawnSync('git', args, { cwd, env, encoding: 'utf8' });

/* Podstawiony `npm`: dopisuje argumenty do $NPM_LOG i kończy się kodem 1 dla polecenia z $NPM_FAIL. */
function falszywyNpm(): { bin: string; log: string } {
  const d = nowyKatalog('fake-npm-');
  const log = join(d, 'npm.log');
  writeFileSync(join(d, 'npm'), '#!/bin/sh\necho "$*" >> "$NPM_LOG"\n[ "$2" = "$NPM_FAIL" ] && exit 1\nexit 0\n');
  chmodSync(join(d, 'npm'), 0o755);
  return { bin: d, log };
}
const wywolania = (log: string) => (existsSync(log) ? readFileSync(log, 'utf8').trim().split('\n').filter(Boolean) : []);

/* Repozytorium próbne z hakiem skopiowanym tak, jak leży w repo (tryb wykonywalny zachowany), bez zdalnego. */
function repoProbne(): { dir: string; zdalne: string } {
  const dir = nowyKatalog('hak-repo-');
  const zdalne = nowyKatalog('hak-zdalne-');
  expect(git(zdalne, ['init', '--bare', '-q']).status).toBe(0);
  expect(git(dir, ['init', '-q', '-b', 'main']).status).toBe(0);
  mkdirSync(join(dir, 'scripts/hooks'), { recursive: true });
  for (const f of ['pre-push', 'instaluj.mjs', 'sprawdz-instalacje.mjs']) copyFileSync(join(root, 'scripts/hooks', f), join(dir, 'scripts/hooks', f));
  copyFileSync(join(root, 'scripts/verify-docs.mjs'), join(dir, 'scripts/verify-docs.mjs'));
  chmodSync(join(dir, 'scripts/hooks/pre-push'), 0o755);
  writeFileSync(join(dir, 'plik.txt'), '1\n');
  git(dir, ['add', '-A']);
  expect(git(dir, ['commit', '-q', '-m', 'start']).status).toBe(0);
  git(dir, ['remote', 'add', 'origin', zdalne]);
  return { dir, zdalne };
}
const zainstaluj = (dir: string, env: NodeJS.ProcessEnv = bezCI()) =>
  spawnSync(process.execPath, [INSTALATOR], { cwd: dir, env, encoding: 'utf8' });
const hooksPath = (dir: string) => git(dir, ['config', '--local', '--get', 'core.hooksPath']).stdout.trim();
const zNpm = (npm: { bin: string; log: string }, fail = '') =>
  ({ ...bezCI(), PATH: `${npm.bin}:${process.env.PATH}`, NPM_LOG: npm.log, NPM_FAIL: fail }) as NodeJS.ProcessEnv;
const gałęzieZdalne = (zdalne: string) => git(zdalne, ['for-each-ref', '--format=%(refname:short)', 'refs/heads']).stdout.trim().split('\n').filter(Boolean);

describe('hak pre-push — plik (L-009)', () => {
  test('istnieje, jest wykonywalny, ma shebang sh i poprawną składnię POSIX', () => {
    expect(existsSync(HAK)).toBe(true);
    expect(statSync(HAK).mode & 0o111).not.toBe(0);
    expect(hakTekst().startsWith('#!/bin/sh\n')).toBe(true);
    expect(spawnSync('sh', ['-n', HAK], { encoding: 'utf8' }).status).toBe(0);
    expect(bezKomentarzy(hakTekst())).not.toMatch(/\[\[|\bfunction\b|<<<|\bsource\b|\bshopt\b/); /* bez składni bash */
  });
  test('uruchamia dokładnie lint, check:readme, check:matrix — w tej kolejności i nic więcej', () => {
    const wywolaniaNpm = [...bezKomentarzy(hakTekst()).matchAll(/^\s*sprawdz\s+(\S+)/gm)].map(m => m[1]);
    expect(wywolaniaNpm).toEqual(['lint', 'check:readme', 'check:matrix']);
    expect(bezKomentarzy(hakTekst()).match(/^\s*if ! npm run "\$1" >&2; then$/gm) || []).toHaveLength(1); /* jedyne wywołanie npm */
    expect(bezKomentarzy(hakTekst())).not.toMatch(/npm run (jest|verify|typecheck|test)|\bnpx\b|expo export/);
  });
  test('komentarz opisuje świadome obejście `git push --no-verify` i zmierzony czas', () => {
    const komentarze = hakTekst().split('\n').filter(l => /^\s*#/.test(l)).join('\n');
    expect(komentarze).toContain('git push --no-verify');
    expect(komentarze).toMatch(/Czas[^\n]*\d+\s*(–|-|do)?\s*\d*\s*s\b/);
    expect(komentarze).not.toContain('CZAS_HAKA');
  });
  test('skrypt `prepare` wywołuje instalator, a instalator istnieje', () => {
    expect(pkg.scripts.prepare).toBe('node scripts/hooks/instaluj.mjs');
    expect(existsSync(INSTALATOR)).toBe(true);
  });
});

describe('hak pre-push — działanie z podstawionym npm', () => {
  const uruchom = (npm: ReturnType<typeof falszywyNpm>, fail = '', input = 'refs/heads/x 1234567890abcdef refs/heads/x 0000000000000000\n') =>
    spawnSync(HAK, [], { cwd: root, env: zNpm(npm, fail), input, encoding: 'utf8' });

  test('zielone: trzy polecenia w kolejności, kod 0, czas w komunikacie', () => {
    const npm = falszywyNpm();
    const r = uruchom(npm);
    expect(r.status).toBe(0);
    expect(wywolania(npm.log)).toEqual(['run lint', 'run check:readme', 'run check:matrix']);
    expect(r.stderr).toMatch(/zielone po \d+ s/);
  });
  test.each([
    ['lint', ['run lint'], 'npm run lint'],
    ['check:readme', ['run lint', 'run check:readme'], 'node scripts/readme.mjs --write'],
    ['check:matrix', ['run lint', 'run check:readme', 'run check:matrix'], 'node scripts/test-matrix.mjs --write'],
  ])('błąd w %s: przerywa tutaj, kod 1, po polsku mówi jak naprawić', (nazwa, oczekiwane, naprawa) => {
    const npm = falszywyNpm();
    const r = uruchom(npm, nazwa);
    expect(r.status).toBe(1);
    expect(wywolania(npm.log)).toEqual(oczekiwane);
    expect(r.stderr).toContain('WYPCHNIĘCIE ZATRZYMANE');
    expect(r.stderr).toContain(`npm run ${nazwa}`);
    expect(r.stderr).toContain('Jak naprawić');
    expect(r.stderr).toContain(naprawa);
    expect(r.stderr).toContain('git push --no-verify');
  });
  test('samo usuwanie gałęzi (same zera) nie uruchamia sprawdzeń', () => {
    const npm = falszywyNpm();
    const r = uruchom(npm, 'lint', '(delete) 0000000000000000 refs/heads/x 1234567890abcdef\n');
    expect(r.status).toBe(0);
    expect(wywolania(npm.log)).toEqual([]);
  });
  test('wypchnięcie razem z usunięciem nadal sprawdza', () => {
    const npm = falszywyNpm();
    const r = uruchom(npm, '', '(delete) 0000 refs/heads/a 1234\nrefs/heads/b 1234567890 refs/heads/b 0000\n');
    expect(r.status).toBe(0);
    expect(wywolania(npm.log)).toHaveLength(3);
  });
});

describe('instalator (skrypt `prepare`)', () => {
  test('w repozytorium git ustawia core.hooksPath jako ścieżkę względną; powtórzenie nic nie psuje', () => {
    const { dir } = repoProbne();
    const r = zainstaluj(dir);
    expect(r.status).toBe(0);
    expect(hooksPath(dir)).toBe('scripts/hooks');
    expect(zainstaluj(dir).status).toBe(0);
    expect(hooksPath(dir)).toBe('scripts/hooks');
  });
  test('w CI (zmienna CI) nie robi nic i nie wywraca `npm ci`', () => {
    const { dir } = repoProbne();
    const r = zainstaluj(dir, { ...bezCI(), CI: 'true' });
    expect(r.status).toBe(0);
    expect(hooksPath(dir)).toBe('');
  });
  test('w katalogu bez .git (paczka) kończy się kodem 0 i nic nie zapisuje — także gdy wyżej leży inne repo', () => {
    const nadrzedne = nowyKatalog('hak-nadrzedne-');
    expect(git(nadrzedne, ['init', '-q']).status).toBe(0);
    const paczka = join(nadrzedne, 'paczka');
    mkdirSync(paczka);
    const r = zainstaluj(paczka);
    expect(r.status).toBe(0);
    expect(hooksPath(nadrzedne)).toBe('');
    const sam = nowyKatalog('hak-paczka-');
    expect(zainstaluj(sam).status).toBe(0);
  });
  test('bez gita w PATH też kończy się kodem 0', () => {
    const { dir } = repoProbne();
    const r = zainstaluj(dir, { ...bezCI(), PATH: nowyKatalog('hak-pusty-path-') });
    expect(r.status).toBe(0);
    expect(hooksPath(dir)).toBe('');
  });
  test('cudzego core.hooksPath nie nadpisuje', () => {
    const { dir } = repoProbne();
    git(dir, ['config', '--local', 'core.hooksPath', '.cudze-haki']);
    expect(zainstaluj(dir).status).toBe(0);
    expect(hooksPath(dir)).toBe('.cudze-haki');
  });
});

describe('hak na prawdziwym git push (także z worktree)', () => {
  test('zielone sprawdzenia przepuszczają push, czerwone go odrzucają, --no-verify omija', () => {
    const { dir, zdalne } = repoProbne();
    zainstaluj(dir);
    const npm = falszywyNpm();
    const dobry = git(dir, ['push', '-u', 'origin', 'main'], zNpm(npm));
    expect(dobry.status).toBe(0);
    expect(wywolania(npm.log)).toEqual(['run lint', 'run check:readme', 'run check:matrix']);
    expect(gałęzieZdalne(zdalne)).toEqual(['main']);

    git(dir, ['checkout', '-q', '-b', 'zla']);
    const zly = git(dir, ['push', 'origin', 'zla'], zNpm(npm, 'check:readme'));
    expect(zly.status).not.toBe(0);
    expect(zly.stderr).toContain('node scripts/readme.mjs --write');
    expect(gałęzieZdalne(zdalne)).toEqual(['main']);

    const obejscie = git(dir, ['push', '--no-verify', 'origin', 'zla'], zNpm(npm, 'check:readme'));
    expect(obejscie.status).toBe(0);
    expect(gałęzieZdalne(zdalne).sort()).toEqual(['main', 'zla']);
  });
  test('zmiany tylko w dokumentach (względem origin/main) pomijają lint; zmiana kodu przywraca wszystkie trzy', () => {
    const { dir } = repoProbne();
    zainstaluj(dir);
    const npm = falszywyNpm();
    expect(git(dir, ['push', '-u', 'origin', 'main'], zNpm(npm)).status).toBe(0);
    writeFileSync(npm.log, '');
    git(dir, ['checkout', '-q', '-b', 'dok']);
    mkdirSync(join(dir, 'docs'));
    writeFileSync(join(dir, 'docs/a.md'), 'opis\n');
    git(dir, ['add', '-A']);
    expect(git(dir, ['commit', '-q', '-m', 'dok']).status).toBe(0);
    const dok = git(dir, ['push', 'origin', 'dok'], zNpm(npm));
    expect(dok.status).toBe(0);
    expect(wywolania(npm.log)).toEqual(['run check:readme', 'run check:matrix']);
    expect(dok.stderr).toContain('tylko w dokumentach');
    writeFileSync(npm.log, '');
    writeFileSync(join(dir, 'plik.txt'), '2\n');
    git(dir, ['commit', '-q', '-am', 'kod']);
    expect(git(dir, ['push', 'origin', 'dok'], zNpm(npm)).status).toBe(0);
    expect(wywolania(npm.log)).toEqual(['run lint', 'run check:readme', 'run check:matrix']);
  });
  test('usunięcie gałęzi na zdalnym nie uruchamia sprawdzeń', () => {
    const { dir, zdalne } = repoProbne();
    zainstaluj(dir);
    const npm = falszywyNpm();
    expect(git(dir, ['push', '--no-verify', 'origin', 'main:refs/heads/doUsuniecia']).status).toBe(0);
    const r = git(dir, ['push', 'origin', '--delete', 'doUsuniecia'], zNpm(npm, 'lint'));
    expect(r.status).toBe(0);
    expect(wywolania(npm.log)).toEqual([]);
    expect(gałęzieZdalne(zdalne)).not.toContain('doUsuniecia');
  });
  test('worktree współdzieli konfigurację, a hak biegnie z katalogu worktree (ścieżka względna)', () => {
    const { dir, zdalne } = repoProbne();
    zainstaluj(dir);
    const wt = join(nowyKatalog('hak-wt-'), 'wt');
    expect(git(dir, ['worktree', 'add', '-q', '-b', 'funkcja', wt]).status).toBe(0);
    expect(hooksPath(wt)).toBe('scripts/hooks');
    const npm = falszywyNpm();
    /* hak podstawia pwd do dziennika: dowód, że `npm` biegł w katalogu worktree, nie głównego repo */
    writeFileSync(join(npm.bin, 'npm'), '#!/bin/sh\necho "$PWD" >> "$NPM_LOG"\n[ "$2" = "$NPM_FAIL" ] && exit 1\nexit 0\n');
    const r = git(wt, ['push', '-u', 'origin', 'funkcja'], zNpm(npm));
    expect(r.status).toBe(0);
    const katalogi = new Set(wywolania(npm.log).map(p => p.replace(/^\/private/, '')));
    expect([...katalogi]).toHaveLength(1);
    expect([...katalogi][0].endsWith('/wt')).toBe(true);
    expect(gałęzieZdalne(zdalne)).toContain('funkcja');
  });
});

describe('polecenia agentów, które wypychają: krok o wyniku tests.yml po wypchnięciu (L-009)', () => {
  const dir = join(root, '.claude/agents');
  /* Role z narzędziem Bash albo bez ograniczenia narzędzi i mogące wypychać; audytor i badacze nie wypychają. */
  const WYPYCHAJA = ['programista', 'tester-e2e', 'tlumacz', 'wydawca'];
  test('lista ról istnieje', () => {
    const pliki = readdirSync(dir).map(f => f.replace(/\.md$/, ''));
    for (const r of WYPYCHAJA) expect(pliki).toContain(r);
  });
  test.each(WYPYCHAJA)('%s: po wypchnięciu sprawdza wynik tests.yml i czeka na zielony', rola => {
    const t = readFileSync(join(dir, `${rola}.md`), 'utf8');
    expect(t).toMatch(/po wypchnięciu[^\n]*`tests\.yml`|`tests\.yml`[^\n]*po wypchnięciu/i);
    expect(t).toMatch(/zielon/i);
    expect(t).toContain('mcp__github__actions_list');
    expect(t).toContain('--no-verify');
  });
  test('każda rola z Bash i bez zakazu pushu jest na liście albo jawnie wyłączona', () => {
    const zBash = readdirSync(dir).filter(f => f.endsWith('.md')).map(f => f.replace(/\.md$/, '')).filter(r => {
      const t = readFileSync(join(dir, `${r}.md`), 'utf8');
      const tools = /^tools:\s*(.*)$/m.exec(t.split('---')[1] || '')?.[1];
      return !tools || /\bBash\b/.test(tools);
    });
    const WYJATKI: Record<string, string> = { audytor: 'przegląd tylko do odczytu, niczego nie wypycha', 'recenzent-lokalizacji': 'czyta teksty i zwraca listę poprawek, niczego nie edytuje ani nie wypycha' };
    expect(zBash.filter(r => !WYPYCHAJA.includes(r) && !(r in WYJATKI))).toEqual([]);
  });
});

/* L-014 (akcja 4): `npm run verify` zaczyna się od sprawdzenia, że hak jest zainstalowany (npm ci --ignore-scripts go nie instaluje). */
describe('verify sprawdza zainstalowany hak pre-push (L-014)', () => {
  const sprawdz = (dir: string, env: NodeJS.ProcessEnv = bezCI()) => spawnSync(process.execPath, [join(dir, 'scripts/hooks/sprawdz-instalacje.mjs')], { cwd: dir, env, encoding: 'utf8' });
  test('pierwszy krok skryptu verify to sprawdzenie haka, przed typecheck', () => {
    expect(pkg.scripts.verify.startsWith('node scripts/hooks/sprawdz-instalacje.mjs && npm run typecheck')).toBe(true);
    expect(existsSync(SPRAWDZ)).toBe(true);
  });
  test('hak niezainstalowany: kod 1 i polecenie instalacji', () => {
    const { dir } = repoProbne();
    const r = sprawdz(dir);
    expect(r.status).toBe(1);
    expect(r.stderr).toContain('node scripts/hooks/instaluj.mjs');
    expect(r.stderr).toMatch(/--ignore-scripts/);
  });
  test('hak zainstalowany (core.hooksPath = scripts/hooks): kod 0', () => {
    const { dir } = repoProbne();
    zainstaluj(dir);
    expect(sprawdz(dir).status).toBe(0);
  });
  test('po poleceniu z komunikatu sprawdzenie przechodzi', () => {
    const { dir } = repoProbne();
    expect(sprawdz(dir).status).toBe(1);
    expect(zainstaluj(dir).status).toBe(0);
    expect(sprawdz(dir).status).toBe(0);
  });
  test('hak skopiowany do .git/hooks też się liczy', () => {
    const { dir } = repoProbne();
    mkdirSync(join(dir, '.git/hooks'), { recursive: true });
    copyFileSync(join(dir, 'scripts/hooks/pre-push'), join(dir, '.git/hooks/pre-push'));
    expect(sprawdz(dir).status).toBe(0);
  });
  test('cudzy core.hooksPath bez haka: kod 1', () => {
    const { dir } = repoProbne();
    git(dir, ['config', '--local', 'core.hooksPath', '.cudze-haki']);
    expect(sprawdz(dir).status).toBe(1);
  });
  test('worktree współdzieli konfigurację: sprawdzenie przechodzi także tam', () => {
    const { dir } = repoProbne();
    zainstaluj(dir);
    const wt = join(nowyKatalog('hak-wt2-'), 'wt');
    expect(git(dir, ['worktree', 'add', '-q', '-b', 'f', wt]).status).toBe(0);
    expect(sprawdz(wt).status).toBe(0);
  });
  /* Agenci pracują w worktree, a core.hooksPath bywa ustawione bezwzględnie na scripts/hooks innego checkoutu tego samego repo. */
  describe('core.hooksPath bezwzględny, wskazujący na inny worktree (22.10.2026)', () => {
    const zWorktree = () => {
      const { dir } = repoProbne();
      const wt = join(nowyKatalog('hak-wt3-'), 'wt');
      expect(git(dir, ['worktree', 'add', '-q', '-b', 'g', wt]).status).toBe(0);
      return { dir, wt };
    };
    test('hooksPath = scripts/hooks głównego checkoutu (identyczny hak): kontrola w worktree przechodzi', () => {
      const { dir, wt } = zWorktree();
      git(dir, ['config', '--local', 'core.hooksPath', join(dir, 'scripts/hooks')]);
      expect(sprawdz(wt).status).toBe(0);
      expect(sprawdz(dir).status).toBe(0);
    });
    test('to samo przez dowiązanie symboliczne (realpath)', () => {
      const { dir, wt } = zWorktree();
      const link = join(nowyKatalog('hak-link-'), 'haki');
      symlinkSync(join(dir, 'scripts/hooks'), link);
      git(dir, ['config', '--local', 'core.hooksPath', link]);
      expect(sprawdz(wt).status).toBe(0);
    });
    test('hooksPath nieustawione: nadal kod 1 w worktree', () => {
      const { wt } = zWorktree();
      expect(sprawdz(wt).status).toBe(1);
    });
    test('hooksPath wskazuje katalog bez naszego haka: kod 1', () => {
      const { dir, wt } = zWorktree();
      git(dir, ['config', '--local', 'core.hooksPath', nowyKatalog('hak-pusty-')]);
      expect(sprawdz(wt).status).toBe(1);
    });
    test('hooksPath wskazuje hak o innej treści: kod 1', () => {
      const { dir, wt } = zWorktree();
      const inny = nowyKatalog('hak-inny-');
      writeFileSync(join(inny, 'pre-push'), '#!/bin/sh\nexit 0\n');
      chmodSync(join(inny, 'pre-push'), 0o755);
      git(dir, ['config', '--local', 'core.hooksPath', inny]);
      expect(sprawdz(wt).status).toBe(1);
    });
    test('hak o tej samej treści, ale niewykonywalny: kod 1', () => {
      const { dir, wt } = zWorktree();
      const kopia = nowyKatalog('hak-nx-');
      copyFileSync(join(dir, 'scripts/hooks/pre-push'), join(kopia, 'pre-push'));
      chmodSync(join(kopia, 'pre-push'), 0o644);
      git(dir, ['config', '--local', 'core.hooksPath', kopia]);
      expect(sprawdz(wt).status).toBe(1);
    });
  });
  test('w CI (zmienna CI) pomija z komunikatem, kod 0', () => {
    const { dir } = repoProbne();
    const r = sprawdz(dir, { ...bezCI(), CI: 'true' });
    expect(r.status).toBe(0);
    expect(r.stdout + r.stderr).toMatch(/CI/);
  });
});
