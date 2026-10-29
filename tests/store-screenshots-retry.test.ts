/*
 * Zrzuty do App Store: akcja ekranu (Maestro) zgubiona na wolnym symulatorze nie może po cichu zostawić błędnego zrzutu (przebieg 40487178778: pl/10-import miało
 * otwarte puste okno wyboru plików zamiast podglądu importu, a skrypt tylko ostrzegł). Skrypt powtarza ekran raz, a po drugiej porażce odkłada zrzut do .nieudane i wpisuje go na listę.
 * Test uruchamia prawdziwy scripts/ci/store-screenshots.sh na atrapach xcrun, maestro i sleep (bez symulatora).
 */
import { execFileSync } from 'child_process';
import { chmodSync, existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'fs';
import { tmpdir } from 'os';
import { join } from 'path';

const root = join(__dirname, '..');
const tmp: string[] = [];
afterAll(() => tmp.forEach(d => rmSync(d, { recursive: true, force: true })));

function run(failImports: number, ekrany = '') {
  const d = mkdtempSync(join(tmpdir(), 'zr-')); tmp.push(d);
  const bin = join(d, 'bin'); const data = join(d, 'data'); const app = join(d, 'app'); const out = join(d, 'out'); mkdirSync(bin); mkdirSync(data); mkdirSync(app);
  const stub = (n: string, body: string) => { writeFileSync(join(bin, n), `#!/bin/bash\n${body}\n`); chmodSync(join(bin, n), 0o755); };
  stub('sleep', 'exit 0');
  stub('xcrun', `case "$2" in get_app_container) echo "${app}";; io) [ "$4" = screenshot ] && touch "$5"; exit 0;; esac; exit 0`);
  stub('maestro', `f="$4"; case "$f" in *import.yaml) n=$(cat "${d}/n" 2>/dev/null || echo 0); echo $((n+1)) > "${d}/n"; [ "$n" -lt ${failImports} ] && { echo "Assert FAILED"; exit 1; };; esac; exit 0`);
  writeFileSync(join(data, 'routes-pl.json'), JSON.stringify([['plan', '/plan', 'jasny', ''], ['import', '/more/import', 'jasny', 'import']]));
  writeFileSync(join(data, 'state-pl-jasny.json'), '{}'); writeFileSync(join(data, 'trening-historia.csv'), 'a');
  const summary = join(d, 'summary.md');
  const log = execFileSync('bash', [join(root, 'scripts/ci/store-screenshots.sh'), 'UDID', out, data, 'pl'], {
    encoding: 'utf8', env: { ...process.env, PATH: `${bin}:${process.env.PATH}`, GITHUB_STEP_SUMMARY: summary, EKRANY: ekrany },
  });
  return { out, log, summary: existsSync(summary) ? readFileSync(summary, 'utf8') : '', imports: Number(readFileSync(join(d, 'n'), 'utf8')) };
}

describe('store-screenshots.sh: ponawianie ekranu po porażce akcji', () => {
  test('akcja udana za pierwszym razem: jeden zrzut na ekran, bez powtórki', () => {
    const r = run(0);
    expect(existsSync(join(r.out, 'pl/01-plan.png'))).toBe(true); expect(existsSync(join(r.out, 'pl/02-import.png'))).toBe(true);
    expect(r.imports).toBe(1); expect(r.log).not.toMatch(/ponawiam/); expect(r.summary).not.toMatch(/do powtórzenia/);
  });
  test('akcja nieudana raz: ekran powtórzony, zrzut w zestawie, bez wpisu o porażce', () => {
    const r = run(1);
    expect(r.imports).toBe(2); expect(r.log).toMatch(/ponawiam ekran/);
    expect(existsSync(join(r.out, 'pl/02-import.png'))).toBe(true); expect(existsSync(join(r.out, '.nieudane'))).toBe(false); expect(r.summary).not.toMatch(/do powtórzenia/);
  });
  test('akcja nieudana dwa razy: zrzut poza zestawem (.nieudane), ekran na liście, skrypt kończy się kodem 0', () => {
    const r = run(2);
    expect(r.imports).toBe(2);
    expect(existsSync(join(r.out, 'pl/02-import.png'))).toBe(false); expect(existsSync(join(r.out, '.nieudane/pl/02-import.png'))).toBe(true);
    expect(existsSync(join(r.out, 'pl/01-plan.png'))).toBe(true);
    expect(r.summary).toMatch(/do powtórzenia[^\n]*pl\/import/);
  });
  test('EKRANY: tylko wskazany ekran, numeracja z pełnego scenorysu (02-import.png)', () => {
    const r = run(0, 'import');
    expect(existsSync(join(r.out, 'pl/02-import.png'))).toBe(true); expect(existsSync(join(r.out, 'pl/01-plan.png'))).toBe(false);
  });
});
