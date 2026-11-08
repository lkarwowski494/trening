/* Nocne 08.11.2026: instalacja Maestro (curl | bash) bez ponowień — 504 z get.maestro.mobile.dev, krok kończył się 0, potem kod 127 w kroku „Maestro” i zero scenariuszy.
 * Test wykonuje scripts/ci/instaluj-maestro.sh ze stubem curl (ile razy zawodzi, zadajemy) i stubem instalatora; sprawdza też, że workflowy używają skryptu zamiast `curl | bash`. */
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import { spawnSync } from 'child_process';

const root = path.join(__dirname, '..');
const skrypt = path.join(root, 'scripts/ci/instaluj-maestro.sh');
const dir = fs.realpathSync(fs.mkdtempSync(path.join(os.tmpdir(), 'maestro-')));
afterAll(() => fs.rmSync(dir, { recursive: true, force: true }));

function uruchom(porazki: number, instalator = 'ok') {
  const d = fs.mkdtempSync(path.join(dir, 'p-')); const bin = path.join(d, 'bin'); const home = path.join(d, 'home');
  fs.mkdirSync(bin); fs.mkdirSync(home);
  fs.writeFileSync(path.join(d, 'licznik'), '0');
  /* curl: pierwsze `porazki` wywołań kończy się kodem 22 (jak -f przy HTTP 504), potem zapisuje „instalator” do pliku -o */
  fs.writeFileSync(path.join(bin, 'curl'), `#!/bin/bash
n=$(( $(cat "${d}/licznik") + 1 )); echo $n > "${d}/licznik"
[ "$n" -le ${porazki} ] && exit 22
while [ $# -gt 0 ]; do [ "$1" = -o ] && out="$2"; shift; done
if [ "${instalator}" = pusty ]; then : > "$out"; else printf 'mkdir -p "$HOME/.maestro/bin"; printf "#!/bin/sh\\\\n" > "$HOME/.maestro/bin/maestro"; chmod +x "$HOME/.maestro/bin/maestro"\\n' > "$out"; fi
`, { mode: 0o755 });
  const r = spawnSync('bash', [skrypt], { encoding: 'utf8', env: { ...process.env, PATH: `${bin}:${process.env.PATH}`, HOME: home, MAESTRO_PAUZA: '0' } });
  return { status: r.status, out: r.stdout + r.stderr, wywolania: Number(fs.readFileSync(path.join(d, 'licznik'), 'utf8')) };
}

describe('instaluj-maestro.sh — trzy próby', () => {
  test('pierwsza próba się udaje: jedno pobranie, kod 0', () => {
    const r = uruchom(0); expect(r.status).toBe(0); expect(r.wywolania).toBe(1);
  });
  test('dwie porażki (504), trzecia próba działa: kod 0, trzy pobrania, ostrzeżenia w logu', () => {
    const r = uruchom(2); expect(r.status).toBe(0); expect(r.wywolania).toBe(3); expect(r.out).toContain('próba 1 z 3 nieudana');
  });
  test('trzy porażki: kod 1 i błąd, dokładnie trzy próby (nie więcej)', () => {
    const r = uruchom(3); expect(r.status).toBe(1); expect(r.wywolania).toBe(3); expect(r.out).toContain('nieudana po 3 próbach');
  });
  test('pusty instalator (curl „sukces” bez treści) nie liczy się jako instalacja', () => {
    const r = uruchom(0, 'pusty'); expect(r.status).toBe(1);
  });
});

describe('workflowy używają skryptu zamiast curl | bash', () => {
  test.each(['e2e-ios.yml', 'store-screenshots.yml'])('%s: brak `curl … | bash` dla Maestro, każdy krok instalacji woła scripts/ci/instaluj-maestro.sh', (f) => {
    const y = fs.readFileSync(path.join(root, '.github/workflows', f), 'utf8');
    expect(y).not.toMatch(/get\.maestro\.mobile\.dev"?\s*\|\s*bash/);
    const kroki = y.split('\n').filter(l => /name: Install Maestro/.test(l)).length;
    expect(kroki).toBeGreaterThan(0);
    expect(y.split('instaluj-maestro.sh').length - 1).toBe(kroki);
  });
});
