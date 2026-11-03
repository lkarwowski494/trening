/*
 * L-096-A (decyzja właściciela 03.11.2026): krok „Maestro” w e2e-ios.yml ma logikę ponowień (jedno powtórzenie przy awarii sterownika XCTest, jedno ponowienie
 * pojedynczego nieudanego scenariusza, tryb ścisły bez ponowień). Test wykonuje cały skrypt kroku w `bash -e` ze stubami (guard, maestro, node, bash scripts/ci/…),
 * w katalogu tymczasowym — wzór tests/e2e-ios-ponowienie-aktualizacji.test.ts. Wpis kroku: tests/ponowienia-workflow.json.
 */
import { readFileSync, mkdtempSync } from 'fs';
import { join } from 'path';
import { tmpdir } from 'os';
import { spawnSync } from 'child_process';
import * as yaml from 'js-yaml';

const wf = yaml.load(readFileSync(join(__dirname, '..', '.github/workflows/e2e-ios.yml'), 'utf8')) as { jobs: Record<string, { steps: { name?: string; run?: string }[] }> };
const krok = Object.values(wf.jobs).flatMap(j => j.steps).find(s => s.name === 'Maestro')!.run!;

type Opcje = { pelnyRc?: number[]; ponowienieRc?: number[]; nieudane?: string; strict?: boolean; logPelny?: string };

/** Uruchamia skrypt kroku w `bash -e`; maestro zwraca kolejne kody z list (pełny katalog = wywołanie z --exclude-tags, ponowienie = plik .yaml). */
function uruchom(o: Opcje) {
  const dir = mkdtempSync(join(tmpdir(), 'maestro-'));
  const skrypt = krok.split('\n').map(l => (/^\s*guard\(\) \{/.test(l) ? 'guard() { "$@"; }' : l.replace(/\/tmp\//g, `${dir}/`))).join('\n');
  // maestro bywa wywoływany w podpowłoce potoku (| tee), więc liczniki wywołań trzymamy w plikach
  const stuby = `
cd ${dir}; export SIM=sim STRICT=${o.strict ? 'true' : 'false'}
FULL=(${(o.pelnyRc ?? [0]).join(' ')}); RETRY=(${(o.ponowienieRc ?? [0]).join(' ')}); echo 0 > nf; echo 0 > nr
maestro() { case "$*" in
  *--exclude-tags*) echo "CALL pelny"; echo "${o.logPelny ?? ''}"; n=$(cat nf); echo $((n+1)) > nf; return \${FULL[$n]:-0} ;;
  *) echo "CALL ponowienie $*" | sed 's/--device sim test //'; n=$(cat nr); echo $((n+1)) > nr; return \${RETRY[$n]:-0} ;;
esac; }
node() { echo "${o.nieudane ?? ''}" | tr ' ' '\\n' | sed '/^$/d'; }
bash() { echo "CALL restart"; }
`;
  const r = spawnSync('bash', ['-e', '-c', `${stuby}\n${skrypt}`], { encoding: 'utf8' });
  const calls = r.stdout.split('\n').filter(l => l.startsWith('CALL'));
  return { status: r.status, calls, stderr: r.stderr };
}

describe('krok „Maestro” (e2e-ios.yml): ponowienia działają pod bash -e', () => {
  test('pełny katalog zielony -> bez ponowień, wynik 0', () => {
    const r = uruchom({}); expect(r.calls).toEqual(['CALL pelny']); expect(r.status).toBe(0);
  });
  test('scenariusz czerwony, ponowienie zielone -> jedno ponowienie tego scenariusza, wynik 0', () => {
    const r = uruchom({ pelnyRc: [1], nieudane: '05-a.yaml', ponowienieRc: [0] });
    expect(r.calls.filter(c => c.startsWith('CALL ponowienie'))).toHaveLength(1); expect(r.calls.join()).toContain('05-a.yaml'); expect(r.status).toBe(0);
  });
  test('scenariusz czerwony dwa razy -> jedno ponowienie, wynik niezerowy', () => {
    const r = uruchom({ pelnyRc: [1], nieudane: '05-a.yaml', ponowienieRc: [1] });
    expect(r.calls.filter(c => c.startsWith('CALL ponowienie'))).toHaveLength(1); expect(r.status).not.toBe(0);
  });
  test('dwa scenariusze czerwone, pierwsze ponowienie czerwone, drugie zielone -> każdy ponowiony raz, wynik niezerowy', () => {
    const r = uruchom({ pelnyRc: [1], nieudane: '05-a.yaml 06-b.yaml', ponowienieRc: [1, 0] });
    expect(r.calls.filter(c => c.startsWith('CALL ponowienie'))).toHaveLength(2); expect(r.status).not.toBe(0);
  });
  test('tryb ścisły -> bez ponowień, wynik niezerowy', () => {
    const r = uruchom({ pelnyRc: [1], nieudane: '05-a.yaml', strict: true });
    expect(r.calls.filter(c => c.startsWith('CALL ponowienie'))).toHaveLength(0); expect(r.status).not.toBe(0);
  });
  test('porażka bez wskazanego scenariusza -> bez ponowienia, wynik niezerowy', () => {
    const r = uruchom({ pelnyRc: [1], nieudane: '' });
    expect(r.calls).toEqual(['CALL pelny']); expect(r.status).not.toBe(0);
  });
  test('sterownik XCTest nie wystartował -> jedno powtórzenie pełnego katalogu (nie ponowienie scenariusza), wynik 0', () => {
    const r = uruchom({ pelnyRc: [1, 0], logPelny: 'iOS driver not ready in time' });
    expect(r.calls).toEqual(['CALL pelny', 'CALL pelny']); expect(r.status).toBe(0);
  });
});
