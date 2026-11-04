/* Strażnik znaczników konfliktu scalenia (koordynator 1.1, 04.11.2026; lekcja „znaczniki konfliktu scalenia”, docs/40; wpis w docs/18 z 04.11.2026).
   Znaczniki budujemy z fragmentów, żeby ten plik sam nie miał wiersza-znacznika. */
import { mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'fs';
import { tmpdir } from 'os';
import { join } from 'path';
import { spawnSync } from 'child_process';

const root = join(__dirname, '..');
const SKRYPT = join(root, 'scripts/check-znaczniki-konfliktu.mjs');
const pkg = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'));
const L = '<'.repeat(7), R = '>'.repeat(7), S = '='.repeat(7);
const konflikt = `a\n${L} HEAD\nmoje\n${S}\ncudze\n${R} galaz\nb\n`;

const tmp: string[] = [];
afterAll(() => { for (const d of tmp) rmSync(d, { recursive: true, force: true }); });
const ENV = { ...process.env, GIT_AUTHOR_NAME: 't', GIT_AUTHOR_EMAIL: 't@example.invalid', GIT_COMMITTER_NAME: 't', GIT_COMMITTER_EMAIL: 't@example.invalid' };
const git = (cwd: string, ...a: string[]) => spawnSync('git', a, { cwd, env: ENV, encoding: 'utf8' });
function repo(): string {
  const d = mkdtempSync(join(tmpdir(), 'znaczniki-')); tmp.push(d);
  git(d, 'init', '-q', '-b', 'main');
  mkdirSync(join(d, 'docs')); mkdirSync(join(d, 'tests'));
  writeFileSync(join(d, 'docs/a.md'), 'czysto\n');
  git(d, 'add', '-A'); git(d, 'commit', '-q', '-m', 'start');
  return d;
}
const zapisz = (d: string, f: string, tresc: string, msg: string) => { writeFileSync(join(d, f), tresc); git(d, 'add', '-A'); git(d, 'commit', '-q', '-m', msg); };
const uruchom = (d: string) => spawnSync(process.execPath, [SKRYPT, '--root', d], { encoding: 'utf8' });

describe('check:znaczniki — strażnik znaczników konfliktu (04.11.2026)', () => {
  test('negatyw: czyste repo → kod 0', () => {
    expect(uruchom(repo()).status).toBe(0);
  });
  test('pozytyw: komplet znaczników w pliku śledzonym → kod 1, plik:linia w komunikacie', () => {
    const d = repo(); zapisz(d, 'docs/09.md', konflikt, 'konflikt');
    const r = uruchom(d);
    expect(r.status).toBe(1);
    expect(r.stderr).toContain('docs/09.md:2'); expect(r.stderr).toContain('docs/09.md:4'); expect(r.stderr).toContain('docs/09.md:6');
  });
  test.each([[`${L} HEAD`], [`${R} galaz`], [S]])('każdy znacznik osobno odrzucany: %s', (w) => {
    const d = repo(); zapisz(d, 'docs/x.md', `x\n${w}\ny\n`, 'jeden');
    expect(uruchom(d).status).toBe(1);
  });
  test('CRLF: znacznik z \\r\\n też odrzucony', () => {
    const d = repo(); zapisz(d, 'docs/x.md', `x\r\n${S}\r\ny\r\n`, 'crlf');
    expect(uruchom(d).status).toBe(1);
  });
  test('negatyw: znaczniki nie na początku wiersza albo dłuższa linia z "=" to nie konflikt', () => {
    const d = repo();
    zapisz(d, 'docs/x.md', `tekst ${L} w środku\n  ${S}\n${S}=\n${'<'.repeat(6)} x\n${L}bez spacji\n`, 'ok');
    expect(uruchom(d).status).toBe(0);
  });
  test('plik nieśledzony nie jest sprawdzany (zakres = git ls-files); binarny pomijany', () => {
    const d = repo(); writeFileSync(join(d, 'docs/nowy.md'), konflikt);
    expect(uruchom(d).status).toBe(0);
    writeFileSync(join(d, 'tests/b.bin'), Buffer.concat([Buffer.from([0]), Buffer.from(konflikt)]));
    git(d, 'add', 'tests/b.bin'); expect(uruchom(d).status).toBe(0);
  });
  test('wyjątek z powodem w tests/znaczniki-konfliktu-wyjatki.json → kod 0; wyjątek bez powodu → błąd', () => {
    const d = repo(); zapisz(d, 'docs/przyklad.md', konflikt, 'przyklad');
    expect(uruchom(d).status).toBe(1);
    zapisz(d, 'tests/znaczniki-konfliktu-wyjatki.json', JSON.stringify([{ plik: 'docs/przyklad.md', powod: 'przykład konfliktu w dokumencie' }]), 'wyjatek');
    expect(uruchom(d).status).toBe(0);
    zapisz(d, 'tests/znaczniki-konfliktu-wyjatki.json', JSON.stringify([{ plik: 'docs/przyklad.md' }]), 'bez powodu');
    expect(uruchom(d).status).not.toBe(0);
  });
  test('H1 / L-080: gałąź z wcześniejszymi zmianami względem main — znacznik w pierwszym commicie, drugi commit tylko z dokumentem → nadal odrzucone; po naprawie przechodzi', () => {
    const d = repo(); git(d, 'checkout', '-q', '-b', 'funkcja');
    zapisz(d, 'docs/09.md', konflikt, 'wczesniejszy konflikt');
    zapisz(d, 'docs/b.md', 'tylko dokument\n', 'drugi, same dokumenty');
    expect(uruchom(d).status).toBe(1);
    zapisz(d, 'docs/09.md', 'rozstrzygnięte\n', 'naprawa');
    expect(uruchom(d).status).toBe(0);
  });
  test('repo Trening: brak znaczników w plikach śledzonych', () => {
    expect(uruchom(root).status).toBe(0);
  });
  test('podpięcie: package.json (skrypt, verify, verify:szybkie), verify:docs i krok check:pochodne uruchamiany przez hak pre-push', () => {
    expect(pkg.scripts['check:znaczniki']).toBe('node scripts/check-znaczniki-konfliktu.mjs');
    expect(pkg.scripts.verify).toContain('npm run check:znaczniki');
    expect(pkg.scripts['verify:szybkie']).toContain('npm run check:znaczniki');
    expect(readFileSync(join(root, 'scripts/verify-docs.mjs'), 'utf8')).toContain("'npm run check:znaczniki'");
    expect(readFileSync(join(root, 'scripts/pochodne.mjs'), 'utf8')).toContain("'scripts/check-znaczniki-konfliktu.mjs'");
    expect(readFileSync(join(root, 'scripts/hooks/pre-push'), 'utf8')).toMatch(/sprawdz check:pochodne/);
  });
});
