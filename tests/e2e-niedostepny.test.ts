/*
 * E2E (101-23, decyzja właściciela D7 = B, 29.10.2026): „Device became unreachable” → restart tego samego symulatora i ponowna instalacja aplikacji przed JEDNYM
 * ponowieniem scenariusza. Inny błąd → bez restartu. Test uruchamia scripts/ci/sim-restart-niedostepny.sh na atrapie xcrun (bez macOS) oraz pilnuje podpięcia w e2e-ios.yml.
 */
import { execFileSync } from 'child_process';
import { chmodSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync, existsSync } from 'fs';
import { tmpdir } from 'os';
import { join } from 'path';

const root = join(__dirname, '..');
const tmp: string[] = [];
afterAll(() => tmp.forEach(d => rmSync(d, { recursive: true, force: true })));

function run(logText: string | null, { bootstatusFails = false } = {}) {
  const d = mkdtempSync(join(tmpdir(), 'nd-')); tmp.push(d);
  const bin = join(d, 'bin'); mkdirSync(bin);
  writeFileSync(join(bin, 'xcrun'), `#!/bin/bash\necho "$*" >> "${d}/xcrun.log"\n${bootstatusFails ? '[ "$2" = bootstatus ] && exit 1\n' : ''}exit 0\n`); chmodSync(join(bin, 'xcrun'), 0o755);
  const log = join(d, 'maestro.log'); if (logText !== null) writeFileSync(log, logText);
  let code = 0; let out = '';
  try { out = execFileSync('bash', [join(root, 'scripts/ci/sim-restart-niedostepny.sh'), log, 'SIM-UDID', '/x/Trening.app'], { encoding: 'utf8', env: { ...process.env, PATH: `${bin}:${process.env.PATH}` } }); }
  catch (e: any) { code = e.status; out = String(e.stdout); }
  const calls = existsSync(join(d, 'xcrun.log')) ? readFileSync(join(d, 'xcrun.log'), 'utf8').trim().split('\n') : [];
  return { code, out, calls };
}

describe('sim-restart-niedostepny.sh', () => {
  test('„Device became unreachable” w logu: shutdown, boot, bootstatus i install — każde raz, w tej kolejności, na tym samym symulatorze', () => {
    const r = run('Running flow 05\nio.grpc.StatusRuntimeException: Device became unreachable\n');
    expect(r.code).toBe(0);
    expect(r.calls).toEqual(['simctl shutdown SIM-UDID', 'simctl boot SIM-UDID', 'simctl bootstatus SIM-UDID -b', 'simctl install SIM-UDID /x/Trening.app']);
    expect(r.out).toMatch(/restart symulatora/);
  });
  test.each(['Assertion is false: "Zapisz" is visible', 'iOS driver not ready in time', 'Element not found: Text matching regex: Plan', ''])('inny błąd (%s): bez restartu', text => {
    const r = run(text);
    expect(r.code).toBe(0); expect(r.calls).toEqual([]); expect(r.out).toMatch(/bez restartu/);
  });
  // Brzmienie z kodu Maestro 2.12.0 (wersja z logu e2e-ios 41036041281, 30.10.2026): DeviceUnreachableException.kt:56 i drivers/IOSDriver.kt:657 (tag cli-2.12.0).
  test.each(['Device became unreachable during tap', 'ERROR maestro.drivers.IOSDriver - Device unreachable while processing isScreenStatic command'])('brzmienie Maestro 2.12.0 (%s): restart', text => {
    expect(run(text).calls).toHaveLength(4);
  });
  test.each(["warning: code will never be executed [-Wunreachable-code]", "warning: 'catch' block is unreachable because no errors are thrown in 'do' block"])('ostrzeżenie kompilatora (%s): bez restartu', text => {
    expect(run(text).calls).toEqual([]);
  });
  test('brak pliku logu: bez restartu', () => { const r = run(null); expect(r.code).toBe(0); expect(r.calls).toEqual([]); });
  test('restart się nie udał (symulator nie wstał): kod 1 i komunikat błędu, bez instalacji', () => {
    const r = run('Device became unreachable', { bootstatusFails: true });
    expect(r.code).toBe(1); expect(r.calls.some(c => c.startsWith('simctl install'))).toBe(false); expect(r.out).toMatch(/nie wstał/);
  });
  test('w logu nie ma identyfikatora urządzenia (repo publiczne)', () => {
    expect(run('Device became unreachable').out).not.toMatch(/SIM-UDID/);
  });
});

describe('e2e-ios.yml: podpięcie restartu przy „unreachable”', () => {
  const yml = readFileSync(join(root, '.github/workflows/e2e-ios.yml'), 'utf8');
  test('skrypt wołany przed pętlą ponowień i po nieudanym ponowieniu', () => {
    const calls = yml.split('\n').filter(l => l.includes('sim-restart-niedostepny.sh'));
    expect(calls.length).toBe(2);
    expect(yml.indexOf('sim-restart-niedostepny.sh')).toBeLessThan(yml.indexOf('for f in $FAILED'));
  });
  test('limit ponowień bez zmian: jedno ponowienie na scenariusz (jedno maestro test na plik w pętli, bez drugiej pętli)', () => {
    expect(yml.match(/for f in \$FAILED/g)).toHaveLength(1);
    expect(yml.match(/Ponowienie scenariusza \$f \(jedno, osobno\)/g)).toHaveLength(1);
    expect(yml).toMatch(/STRICT" != "true"/); // tryb ścisły nadal bez ponowień, więc i bez restartu
  });
  test('workflow bez nowych sekretów (poza GITHUB_TOKEN)', () => {
    const sekrety = new Set([...yml.matchAll(/secrets\.([A-Z_]+)/g)].map(m => m[1]));
    expect([...sekrety]).toEqual(['GITHUB_TOKEN']);
  });
});
