/* Audyt jakości 008 (01.11.2026): bramka TestFlight (scripts/ci/bramka-e2e.sh) rozpoznawała przebieg E2E po swobodnym tytule. Teraz: ścieżka workflowu z API +
 * pola klucz=wartość w run-name + PEŁNY SHA commitu. Testy: format run-name zgodny z wzorcem bramki (jedno źródło pól), przebieg innego workflowu, wcześniejszego
 * commitu gałęzi (L-080: gałąź z wcześniejszymi zmianami względem main) i starego formatu tytułu nie liczą się. Dowód na gotowym produkcie: przebieg e2e-ios.yml + TestFlight bez_wysylki. */
import { readFileSync, mkdtempSync, mkdirSync, writeFileSync, chmodSync } from 'fs';
import { join } from 'path';
import { tmpdir } from 'os';
import { spawnSync } from 'child_process';

const root = join(__dirname, '..');
const yml = readFileSync(join(root, '.github/workflows/e2e-ios.yml'), 'utf8');
const sh = readFileSync(join(root, 'scripts/ci/bramka-e2e.sh'), 'utf8');
const SHA = 'a'.repeat(40); const WCZESNIEJSZY = 'b'.repeat(40);
const PATH_E2E = '.github/workflows/e2e-ios.yml';
const tyt = (o: { pakiet?: string; tryb?: string; zakres?: string; app?: string; sha?: string } = {}) => `E2E iOS · pakiet=${o.pakiet ?? 'podstawowy'} · tryb=${o.tryb ?? 'zwykly'} · zakres=${o.zakres ?? 'wszystkie'} · aplikacja=${o.app ?? 'wlasna'} · sha=${o.sha ?? SHA}`;
const gate = (rows: string[]) => {
  const d = mkdtempSync(join(tmpdir(), 'br-id-')); const bin = join(d, 'bin'); mkdirSync(bin);
  writeFileSync(join(bin, 'gh'), `#!/usr/bin/env bash\nprintf '%s' '${rows.join('\n').replace(/'/g, "'\\''")}'\n`); chmodSync(join(bin, 'gh'), 0o755);
  const r = spawnSync('bash', [join(root, 'scripts/ci/bramka-e2e.sh'), 'o/r', SHA], { encoding: 'utf8', env: { ...process.env, PATH: `${bin}:${process.env.PATH}`, BRAMKA_POLL_SEC: '0', BRAMKA_GRACE_POLLS: '1', BRAMKA_MAX_POLLS: '2' } });
  return { rc: r.status, out: r.stdout + r.stderr };
};
const row = (id: string, concl: string, path: string, title: string) => `${id}\tcompleted\t${concl}\t${path}\t${title}`;

describe('bramka E2E: pewny identyfikator przebiegu (audyt jakości 008)', () => {
  test('run-name e2e-ios.yml: te same pola i kolejność co wzorzec w bramce, SHA z github.sha', () => {
    const rn = /^run-name: \$\{\{ format\('([^']+)'/m.exec(yml)?.[1] ?? '';
    expect(rn).toBe('E2E iOS · pakiet={0} · tryb={1} · zakres={2} · aplikacja={3} · sha={4}');
    expect(yml).toMatch(/aplikacja_z_przebiegu != ''\s*&&\s*'obca'\) \|\| 'wlasna', github\.sha\)/);
    const klucze = [...rn.matchAll(/(\w+)=\{/g)].map(m => m[1]); expect(klucze).toEqual(['pakiet', 'tryb', 'zakres', 'aplikacja', 'sha']);
    for (const k of klucze) expect(sh).toContain(`${k}=`);
    expect(sh).toContain("WORKFLOW_PATH='.github/workflows/e2e-ios.yml'"); expect(sh).toContain('.path');
  });
  test('przebieg tego workflowu, pakiet podstawowy/pełny, ten commit → przechodzi', () => {
    for (const o of [{}, { pakiet: 'pelny' }, { pakiet: 'pelny', tryb: 'scisly' }]) expect(gate([row('1', 'success', PATH_E2E, tyt(o))]).rc).toBe(0);
  });
  test('L-080: zielony przebieg wcześniejszego commitu tej samej gałęzi (inny SHA w tytule) nie otwiera bramki', () => {
    const r = gate([row('1', 'success', PATH_E2E, tyt({ sha: WCZESNIEJSZY }))]); expect(r.rc).toBe(1); expect(r.out).toContain('brak przebiegu');
  });
  test('tytuł innego workflowu o tej samej treści (ścieżka różna od e2e-ios.yml) nie liczy się', () => {
    expect(gate([row('1', 'success', '.github/workflows/nightly.yml', tyt())]).rc).toBe(1);
  });
  test('stary format tytułu („E2E iOS · podstawowy”) i zawężenia (zakres=wybrane, aplikacja=obca) nie liczą się', () => {
    expect(gate([row('1', 'success', PATH_E2E, 'E2E iOS · podstawowy')]).rc).toBe(1);
    expect(gate([row('1', 'success', PATH_E2E, tyt({ zakres: 'wybrane' }))]).rc).toBe(1);
    expect(gate([row('1', 'success', PATH_E2E, tyt({ app: 'obca' }))]).rc).toBe(1);
  });
  test('czerwony przebieg tego commitu → błąd „czerwony”, mimo zielonego z wcześniejszego commitu', () => {
    const r = gate([row('1', 'success', PATH_E2E, tyt({ sha: WCZESNIEJSZY })), row('2', 'failure', PATH_E2E, tyt())]); expect(r.rc).toBe(1); expect(r.out).toMatch(/czerwon/i);
  });
});
