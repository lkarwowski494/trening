/*
 * ZB-029 T1 (decyzja właściciela 31.10.2026): tests.yml dzieli verify na zadania — `kontrole` (scripts/ci/kontrole.mjs, kroki z łańcucha verify bez Jest),
 * `jest` w czterech częściach (`--shard`, scripts/jest-ponow.mjs) i zbiorcze `verify`. Rodzaje (docs/20): logika (wybór kroków), scenariusz (uruchomienie na próbnym
 * repozytorium, przekazanie --shard do Jest), niezmiennik (kontrole + Jest = cały verify; zbiorcze wymaga obu), L-080 (gałąź z wcześniejszymi zmianami względem main).
 */
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import { spawnSync } from 'child_process';

const ROOT = path.join(__dirname, '..');
const SKRYPT = path.join(ROOT, 'scripts/ci/kontrole.mjs');
const pkg = JSON.parse(fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8'));
const yml = fs.readFileSync(path.join(ROOT, '.github/workflows/tests.yml'), 'utf8');
const czasy = JSON.parse(fs.readFileSync(path.join(ROOT, 'scripts/ci/czasy-tests.json'), 'utf8')) as { czesci_jest: number };
const kroki = (v: string) => v.split(/\s+&&\s+/).map(s => s.trim()).filter(Boolean);

/** Próbne repozytorium: scripts/ci/kontrole.mjs (kopia) + package.json z podanym łańcuchem verify; ROOT skryptu = to repozytorium. */
function probne(verify: string) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'kontrole-'));
  fs.mkdirSync(path.join(dir, 'scripts/ci'), { recursive: true });
  fs.copyFileSync(SKRYPT, path.join(dir, 'scripts/ci/kontrole.mjs'));
  fs.writeFileSync(path.join(dir, 'package.json'), JSON.stringify({ scripts: { verify } }));
  return dir;
}
const uruchom = (dir: string, ...args: string[]) => spawnSync(process.execPath, [path.join(dir, 'scripts/ci/kontrole.mjs'), ...args], { cwd: dir, encoding: 'utf8' });
const git = (cwd: string, ...a: string[]) => spawnSync('git', a, { cwd, encoding: 'utf8', env: { ...process.env, GIT_AUTHOR_NAME: 't', GIT_AUTHOR_EMAIL: 't@example.invalid', GIT_COMMITTER_NAME: 't', GIT_COMMITTER_EMAIL: 't@example.invalid' } });

describe('kontrole.mjs: kroki z verify bez Jest i bez znacznika', () => {
  test('--wypisz: pomija jest-ponow i verify-znacznik, zachowuje kolejność reszty (próbny łańcuch)', () => {
    const dir = probne('echo a && npm run b && node scripts/jest-ponow.mjs && echo c && node scripts/verify-znacznik.mjs --zapisz pelne');
    try { expect(uruchom(dir, '--wypisz').stdout.trim().split('\n')).toEqual(['echo a', 'npm run b', 'echo c']); } finally { fs.rmSync(dir, { recursive: true, force: true }); }
  });
  test('uruchomienie: kroki po kolei, pierwszy nieudany kończy z jego kodem i dalsze nie biegną', () => {
    const dir = probne('echo pierwszy && sh -c "exit 7" && echo trzeci && node scripts/jest-ponow.mjs');
    try { const r = uruchom(dir); expect(r.status).toBe(7); expect(r.stdout).toContain('pierwszy'); expect(r.stdout).not.toContain('trzeci'); expect(r.stderr).toContain('sh -c "exit 7"'); } finally { fs.rmSync(dir, { recursive: true, force: true }); }
  });
  test('uruchomienie zielone: wszystkie kroki udane → kod 0; krok z cudzysłowem (node -e) działa', () => {
    const dir = probne('echo a && node -e "process.stdout.write(\'ok\')" && node scripts/verify-znacznik.mjs');
    try { const r = uruchom(dir); expect(r.status).toBe(0); expect(r.stdout).toContain('ok'); } finally { fs.rmSync(dir, { recursive: true, force: true }); }
  });
  test('L-080: gałąź z wcześniejszymi zmianami względem main — wynik zależy od łańcucha verify w drzewie roboczym, nie od historii ani od ostatniego commitu', () => {
    const dir = probne('echo a && node scripts/jest-ponow.mjs');
    try {
      git(dir, 'init', '-q', '-b', 'main'); git(dir, 'add', '-A'); git(dir, 'commit', '-q', '-m', 'main');
      git(dir, 'checkout', '-q', '-b', 'galaz');
      fs.writeFileSync(path.join(dir, 'package.json'), JSON.stringify({ scripts: { verify: 'echo a && echo nowa && node scripts/jest-ponow.mjs' } })); git(dir, 'commit', '-q', '-am', 'kod 1');
      fs.writeFileSync(path.join(dir, 'notatka.md'), 'tylko dokument'); git(dir, 'add', '-A'); git(dir, 'commit', '-q', '-m', 'dokument (ostatni commit bez zmiany verify)');
      expect(uruchom(dir, '--wypisz').stdout.trim().split('\n')).toEqual(['echo a', 'echo nowa']);
    } finally { fs.rmSync(dir, { recursive: true, force: true }); }
  });
});

describe('niezmiennik: kontrole + Jest = cały verify (prawdziwy package.json)', () => {
  const wypisane = () => spawnSync(process.execPath, [SKRYPT, '--wypisz'], { cwd: ROOT, encoding: 'utf8' }).stdout.trim().split('\n');
  test('kroki kontroli to dokładnie kroki verify bez jest-ponow i verify-znacznik; Jest i znacznik zostają w verify; kontrole zawierają typecheck, lint, macierz, eksport iOS i sprawdzenie natywne', () => {
    const wszystkie = kroki(pkg.scripts.verify);
    const pominiete = wszystkie.filter(k => /jest-ponow\.mjs|verify-znacznik\.mjs/.test(k));
    expect(pominiete.map(k => k.split(' ')[1])).toEqual(['scripts/jest-ponow.mjs', 'scripts/verify-znacznik.mjs']);
    expect(wypisane()).toEqual(wszystkie.filter(k => !pominiete.includes(k)));
    for (const c of ['npm run typecheck', 'npm run lint', 'npm run check:matrix', 'npm run check:pokrycie', 'npx expo export --platform ios --output-dir .expo/verify-export', 'npm run verify:native']) expect(wypisane()).toContain(c);
    expect(wypisane().some(k => /jest/.test(k))).toBe(false);
  });
  test('package.json: verify:kontrole woła skrypt; verify nie woła verify:kontrole (hak i znacznik L-049 widzą dalej płaski łańcuch)', () => {
    expect(pkg.scripts['verify:kontrole']).toBe('node scripts/ci/kontrole.mjs');
    expect(pkg.scripts.verify).not.toContain('verify:kontrole');
  });
});

describe('tests.yml: zadania kontrole, jest (części), zbiorcze verify', () => {
  const kod = yml.split('\n').map(l => l.replace(/\s+#.*$/, '').replace(/^\s*#.*$/, '')).join('\n'); /* bez komentarzy */
  const zadania = kod.slice(kod.indexOf('\njobs:')).split(/^  (?=[\w-]+:\s*$)/m).slice(1);
  const zadanie = (n: string) => zadania.find(z => z.startsWith(`${n}:`)) ?? '';
  test('trzy zadania: kontrole, jest, verify (nazwa zbiorczego sprawdzenia zachowana)', () => { expect(zadania.map(z => z.split(':')[0])).toEqual(['kontrole', 'jest', 'verify']); });
  test('jest: macierz części 1..N = czesci_jest z scripts/ci/czasy-tests.json, każda część woła jest-ponow z --shard=<część>/N, fail-fast wyłączony (pełna lista porażek)', () => {
    const j = zadanie('jest'); const n = czasy.czesci_jest;
    expect(n).toBeGreaterThanOrEqual(2);
    expect(j).toContain(`czesc: [${Array.from({ length: n }, (_, i) => i + 1).join(', ')}]`);
    expect(j).toContain(`run: node scripts/jest-ponow.mjs --shard=\${{ matrix.czesc }}/${n}`);
    expect(j).toMatch(/fail-fast: false/);
  });
  test('zbiorcze verify: needs kontrole i jest, always(), czerwone gdy któreś niezielone (także pominięte/anulowane), bez uprawnień i sekretów', () => {
    const v = zadanie('verify');
    expect(v).toMatch(/needs: \[kontrole, jest\]/); expect(v).toMatch(/if: always\(\) && /);
    expect(v).toContain('test "$KONTROLE" = success && test "$JEST" = success');
    expect(v).toContain('KONTROLE: ${{ needs.kontrole.result }}'); expect(v).toContain('JEST: ${{ needs.jest.result }}');
    expect(kod).not.toMatch(/secrets\.|contents: write|pull_request_target/);
  });
  test('te same zmienne środowiska co dotąd: żadne zadanie nie ustawia PROP_SEED, GITHUB_REF_NAME ani GITHUB_BASE_REF (test numeracji lekcji czyta je z otoczenia GitHuba — L-053); kasa z tagami w każdym zadaniu z npm ci', () => {
    expect(kod).not.toMatch(/PROP_SEED|GITHUB_REF_NAME|GITHUB_BASE_REF/);
    for (const z of [zadanie('kontrole'), zadanie('jest')]) { expect(z).toContain('fetch-depth: 0'); expect(z).toContain('fetch-tags: true'); expect(z).toContain('run: npm ci'); }
  });
  test('zakres Jest: kontrole nie uruchamiają Jest, a cały katalog testów należy do części jest (bez --testPathPattern ani wskazania plików)', () => {
    expect(zadanie('kontrole')).not.toMatch(/npx jest|jest-ponow/);
    expect(zadanie('jest')).not.toMatch(/testPathPattern|runTestsByPath|tests\//);
  });
});

describe('jest-ponow przekazuje --shard do pierwszego przebiegu i nie do ponowienia', () => {
  test('sztuczny Jest: pierwsze wywołanie dostaje --shard=2/4, ponowienie plików przerwanych idzie bez --shard (--runTestsByPath)', () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'shard-'));
    const fake = path.join(dir, 'fake.js');
    fs.writeFileSync(fake, `
const fs = require('fs'); const d = process.env.FAKE_DIR; const n = fs.readdirSync(d).filter(f => f.startsWith('c-')).length;
fs.writeFileSync(d + '/c-' + n + '.json', JSON.stringify(process.argv.slice(2)));
const out = process.argv.find(a => a.startsWith('--outputFile=')).slice(13);
const przerwany = { name: '/x/a.test.ts', status: 'failed', message: 'Test suite failed to run\\n A jest worker process (pid=1) was terminated by another process: signal=SIGTERM', assertionResults: [] };
const ok = { name: '/x/a.test.ts', status: 'passed', message: '', assertionResults: [{ status: 'passed' }] };
const t = n === 0 ? przerwany : ok; fs.writeFileSync(out, JSON.stringify({ success: n !== 0, testResults: [t] })); process.exit(n === 0 ? 1 : 0);`);
    try {
      const r = spawnSync(process.execPath, [path.join(ROOT, 'scripts/jest-ponow.mjs'), '--shard=2/4'], { encoding: 'utf8', env: { ...process.env, JEST_PONOW_JEST: fake, FAKE_DIR: dir } });
      expect(r.status).toBe(0);
      const c0 = JSON.parse(fs.readFileSync(path.join(dir, 'c-0.json'), 'utf8')); const c1 = JSON.parse(fs.readFileSync(path.join(dir, 'c-1.json'), 'utf8'));
      expect(c0).toContain('--shard=2/4'); expect(c1.join(' ')).not.toContain('--shard'); expect(c1).toContain('--runTestsByPath');
    } finally { fs.rmSync(dir, { recursive: true, force: true }); }
  });
});
