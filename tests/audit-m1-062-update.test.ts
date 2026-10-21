/*
 * M1-audytor-generalny-062 / DEC-27 (20.10.2026): test aktualizacji w E2E bierze poprzednią wersję z PLIKU WYDANIA przy tagu (Trening-sim.zip — build symulatora,
 * bez podpisu i bez sekretów), a jej brak w przebiegu wydania to porażka z komunikatem, nie zielone pominięcie. ZMIENIA decyzję z 06.10.2026 o artefaktach
 * trzymanych 1 dzień (dla tego jednego pliku); artefakty przebiegów nadal 1 dzień. Model po L-001: testy samych plików workflowu nie zastępują przebiegu dowodowego CI.
 */
import { readFileSync, mkdtempSync, writeFileSync, chmodSync, mkdirSync, existsSync, readdirSync } from 'fs';
import { tmpdir } from 'os';
import { join } from 'path';
import { spawnSync } from 'child_process';

const root = join(__dirname, '..'); const read = (f: string) => readFileSync(join(root, f), 'utf8'); const wf = (n: string) => read('.github/workflows/' + n);
const e2e = wf('e2e-ios.yml'); const tf = wf('testflight.yml');
const SCRIPT = join(root, 'scripts/ci/poprzednia-wersja.sh');

/** Atrapa `gh`: lista wydań (tagi z plikiem Trening-sim.zip, najnowsze pierwsze), SHA tagów i pobranie pliku. */
function fakeGh(tags: string[], shas: Record<string, string>) {
  const d = mkdtempSync(join(tmpdir(), 'gh062-')); const bin = join(d, 'bin'); mkdirSync(bin); const log = join(d, 'log');
  writeFileSync(join(bin, 'gh'), `#!/usr/bin/env bash
echo "$*" >> "${log}"
case "$*" in
  "api repos/o/r/releases?per_page=30 "*) printf '%s\\n' ${tags.map(t => `'${t}'`).join(' ')} ;;
${Object.entries(shas).map(([t, s]) => `  "api repos/o/r/git/ref/tags/${t} "*) echo '${s}' ;;`).join('\n')}
  "release download "*) tag=$3; dir=""; while [ $# -gt 0 ]; do [ "$1" = "--dir" ] && dir=$2; shift; done; mkdir -p "$dir"; echo "zip:$tag" > "$dir/Trening-sim.zip" ;;
  *) echo "nieoczekiwane gh $*" >&2; exit 9 ;;
esac
`); chmodSync(join(bin, 'gh'), 0o755);
  return { bin, log, d };
}
const run = (tags: string[], shas: Record<string, string>, sha = 'cur') => {
  const g = fakeGh(tags, shas); const out = join(g.d, 'out'); const gho = join(g.d, 'gho');
  const r = spawnSync('bash', [SCRIPT, 'o/r', sha, out], { encoding: 'utf8', env: { ...process.env, PATH: `${g.bin}:${process.env.PATH}`, GITHUB_OUTPUT: gho } });
  return { rc: r.status, out: r.stdout + r.stderr, file: existsSync(join(out, 'Trening-sim.zip')) ? readFileSync(join(out, 'Trening-sim.zip'), 'utf8').trim() : null, gho: existsSync(gho) ? readFileSync(gho, 'utf8') : '' };
};

describe('M1-062: poprzednia-wersja.sh — poprzednia wersja z pliku wydania', () => {
  test('bierze najnowsze wydanie z plikiem Trening-sim.zip i wypisuje jego tag', () => {
    const r = run(['v0.20.0-b1020', 'v0.20.0-b1019'], { 'v0.20.0-b1020': 'aaa', 'v0.20.0-b1019': 'bbb' });
    expect(r.rc).toBe(0); expect(r.file).toBe('zip:v0.20.0-b1020'); expect(r.out).toContain('v0.20.0-b1020'); expect(r.gho).toContain('tag=v0.20.0-b1020');
  });
  test('pomija wydanie z tego samego commitu (to nie jest „poprzednia” wersja) i bierze następne', () => {
    const r = run(['v0.20.0-b1020', 'v0.20.0-b1019'], { 'v0.20.0-b1020': 'cur', 'v0.20.0-b1019': 'bbb' });
    expect(r.rc).toBe(0); expect(r.file).toBe('zip:v0.20.0-b1019');
  });
  test('brak jakiegokolwiek wydania z plikiem → porażka z komunikatem i instrukcją, nic nie pobrane', () => {
    const r = run([], {});
    expect(r.rc).toBe(1); expect(r.file).toBeNull(); expect(r.out).toContain('::error::'); expect(r.out).toContain('Trening-sim.zip'); expect(r.out).toContain('poprzednia_wersja_z_przebiegu');
  });
  test('jedyne wydanie jest z tego samego commitu → porażka (brak poprzedniej wersji)', () => {
    const r = run(['v0.20.0-b1020'], { 'v0.20.0-b1020': 'cur' });
    expect(r.rc).toBe(1); expect(r.out).toContain('::error::');
  });
});

describe('M1-062: e2e-ios.yml — brak poprzedniej wersji nie jest zielonym pominięciem', () => {
  const sel = e2e.slice(e2e.indexOf('- name: Aktualizacja — wybór poprzedniej wersji'), e2e.indexOf('- name: Wyniki scenariuszy'));
  test('wybór: wejście = ręczny numer przebiegu, „brak” = świadome pominięcie, pusty = plik wydania ze skryptu; bez „ostatni zielony przebieg” i bez ostrzeżenia-pominięcia', () => {
    expect(sel).toContain('scripts/ci/poprzednia-wersja.sh'); expect(sel).toContain("inputs.poprzednia_wersja_z_przebiegu != 'brak'");
    expect(sel).not.toMatch(/gh run list/); expect(sel).not.toMatch(/Test aktualizacji pominięty/);
    expect(sel).not.toMatch(/continue-on-error/);
  });
  test('pobranie z przebiegu (ręczne) bez continue-on-error; artefakt bez Trening.app = błąd, nie ostrzeżenie', () => {
    expect(sel).toMatch(/::error::Poprzednia wersja \(Trening-sim\.zip\) bez Trening\.app[^\n]*exit 1/); expect(sel).not.toMatch(/Trening\.app — test aktualizacji pominięty/);
  });
  test('log wypisuje wersję i build poprzedniej oraz bieżącej aplikacji', () => {
    expect(sel).toContain('CFBundleShortVersionString'); expect(sel).toContain('CFBundleVersion'); expect(sel).toMatch(/Poprzednia wersja: /);
  });
  test('uprawnienia e2e-ios.yml bez zmian: tylko odczyt treści, bez zapisu i bez sekretów poza tokenem', () => {
    expect(e2e).toMatch(/permissions:\n\s+contents: read/); expect(e2e).not.toMatch(/contents: write/); expect(e2e).not.toMatch(/secrets\.(?!GITHUB_TOKEN)/);
  });
});

describe('M1-062: testflight.yml — plik wydania z buildem symulatora przy tagu', () => {
  const tag = tf.slice(tf.indexOf('\n  tag:\n'));
  test('bramka zwraca numer zielonego przebiegu E2E, build go przekazuje dalej', () => {
    expect(read('scripts/ci/bramka-e2e.sh')).toMatch(/GITHUB_OUTPUT/); expect(tf).toMatch(/outputs:\n\s+numer_e2e: \$\{\{ steps\.e2e\.outputs\.run \}\}/);
    expect(tf).toMatch(/numer_e2e: \$\{\{ needs\.bramka\.outputs\.numer_e2e \}\}/);
  });
  test('zadanie tag pobiera trening-sim-app z tego przebiegu i dołącza Trening-sim.zip do wydania; bez sekretów', () => {
    expect(tag).toContain('gh run download'); expect(tag).toContain('trening-sim-app'); expect(tag).toMatch(/gh release (upload|create)[^\n]*Trening-sim\.zip/);
    expect(tag).toMatch(/actions: read/); expect(tag).not.toMatch(/secrets\./); expect(tag).toContain('needs.build.outputs.numer_e2e');
  });
  test('bez zielonego przebiegu (awaryjne pominięcie bramki) tag powstaje z ostrzeżeniem, a brak pliku przy dostępnym przebiegu kończy zadanie błędem', () => {
    expect(tag).toMatch(/::warning::[^\n]*Trening-sim\.zip/); expect(tag).toMatch(/exit 1/);
  });
});

describe('M1-062: bramka-e2e.sh zapisuje numer przebiegu', () => {
  test('na sukces dopisuje run=<id> do GITHUB_OUTPUT', () => {
    const d = mkdtempSync(join(tmpdir(), 'br062-')); const bin = join(d, 'bin'); mkdirSync(bin); const gho = join(d, 'gho');
    writeFileSync(join(bin, 'gh'), `#!/usr/bin/env bash\nprintf '777\\tcompleted\\tsuccess\\tE2E iOS · podstawowy\\n'\n`); chmodSync(join(bin, 'gh'), 0o755);
    const r = spawnSync('bash', [join(root, 'scripts/ci/bramka-e2e.sh'), 'o/r', 'abc'], { encoding: 'utf8', env: { ...process.env, PATH: `${bin}:${process.env.PATH}`, GITHUB_OUTPUT: gho } });
    expect(r.status).toBe(0); expect(readFileSync(gho, 'utf8')).toContain('run=777');
  });
});
