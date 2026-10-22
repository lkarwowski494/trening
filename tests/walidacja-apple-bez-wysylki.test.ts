/*
 * 22.10.2026 (decyzja właściciela, docs/18; docs/40 Rejestr ryzyk): przebieg `testflight.yml` z `bez_wysylki` waliduje gotowe .ipa tą samą kontrolą Apple,
 * co wysyłka (xcrun altool --validate-app). Powód: build 39723671701 odrzucony przy wysyłce (brak CFBundleIconName w zegarku), a przebieg dowodowy go nie widział.
 * Model po L-001: te testy sprawdzają plik i skrypt, NIE zastępują przebiegu dowodowego (on pada na braku CFBundleIconName, przechodzi po poprawce).
 */
import { readFileSync, mkdtempSync, writeFileSync, chmodSync, mkdirSync, existsSync, readdirSync } from 'fs';
import { tmpdir } from 'os';
import { join } from 'path';
import { spawnSync } from 'child_process';

const root = join(__dirname, '..');
const read = (f: string) => readFileSync(join(root, f), 'utf8');
const y = read('.github/workflows/testflight.yml');
const at = (n: string) => y.indexOf(`- name: ${n}`);
const step = (n: string) => { const i = at(n); const j = y.indexOf('\n      - ', i + 1); return y.slice(i, j < 0 ? undefined : j); };

describe('testflight.yml: walidacja Apple przy bez_wysylki', () => {
  test('krok walidacji istnieje, działa tylko przy bez_wysylki i wywołuje skrypt z .ipa z eksportu oraz kluczem z pliku tymczasowego', () => {
    const s = step('Walidacja Apple na gotowym .ipa');
    expect(s).toContain('if: ${{ inputs.bez_wysylki == true }}');
    expect(s).toContain('scripts/ci/waliduj-ipa.sh');
    expect(s).toContain('$RUNNER_TEMP"/export/*.ipa');
    expect(s).toContain('$RUNNER_TEMP/AuthKey.p8');
  });
  test('kolejność: eksport → strażnik uprawnień w .ipa → walidacja → wysyłka → usunięcie klucza (klucz jest na dysku w chwili walidacji)', () => {
    const order = ['Klucz API na dysk', 'Eksport do pliku', 'Strażnik uprawnień w .ipa', 'Walidacja Apple na gotowym .ipa', 'Wysyłka do App Store Connect', 'Usunięcie klucza z maszyny'].map(at);
    expect(order.every(i => i > 0)).toBe(true);
    expect([...order].sort((a, b) => a - b)).toEqual(order);
  });
  test('wysyłka nadal tylko bez bez_wysylki (walidacja jej nie zastępuje ani nie wyłącza)', () => {
    expect(step('Wysyłka do App Store Connect')).toContain('if: ${{ inputs.bez_wysylki != true }}');
  });
  test('bez nowych sekretów: krok używa wyłącznie ASC_KEY_ID i ASC_ISSUER_ID; zadanie „build” zostaje w środowisku release; uprawnienia workflow bez zmian', () => {
    const s = step('Walidacja Apple na gotowym .ipa');
    const used = [...s.matchAll(/secrets\.([A-Z0-9_]+)/g)].map(m => m[1]).sort();
    expect(used).toEqual(['ASC_ISSUER_ID', 'ASC_KEY_ID']);
    expect(s).not.toContain('ASC_KEY_P8');
    const all = [...new Set([...y.matchAll(/secrets\.([A-Z0-9_]+)/g)].map(m => m[1]))].sort();
    expect(all).toEqual(['ASC_ISSUER_ID', 'ASC_KEY_ID', 'ASC_KEY_P8']);
    const build = y.slice(y.indexOf('\n  build:\n'), y.indexOf('\n  tag:\n'));
    expect(build).toMatch(/\n    environment: release\n/);
    expect(y).toMatch(/\npermissions:\n  contents: read\n/);
  });
  test('log walidacji jest maskowany przed artefaktem awarii (identyfikatory klucza) i dołączany do artefaktu tylko po maskowaniu', () => {
    const mask = step('Identyfikatory klucza wycięte z logów');
    expect(mask).toContain('validate.log');
    expect(y.indexOf('validate.log', y.indexOf('uses: actions/upload-artifact@v4\n        if: failure()'))).toBeGreaterThan(0);
    expect(at('Identyfikatory klucza wycięte z logów')).toBeLessThan(y.indexOf('uses: actions/upload-artifact@v4\n        if: failure()'));
  });
  test('log kroku walidacji nie wypisuje klucza ani identyfikatorów (brak echo/set -x z sekretami)', () => {
    const s = step('Walidacja Apple na gotowym .ipa') + read('scripts/ci/waliduj-ipa.sh');
    expect(s).not.toMatch(/set -x|set -o xtrace/);
    expect(s).not.toMatch(/echo[^\n]*\$\{?(KID|ISS|ASC_KEY_ID|ASC_ISSUER_ID|ASC_KEY_P8)/);
    expect(s).not.toMatch(/cat[^\n]*\.p8/);
  });
});

describe('scripts/ci/waliduj-ipa.sh (z udawanym xcrun)', () => {
  const setup = (altoolRc: number) => {
    const d = mkdtempSync(join(tmpdir(), 'walid-')); const bin = join(d, 'bin'); mkdirSync(bin);
    const seen = join(d, 'seen.txt');
    writeFileSync(join(bin, 'xcrun'), `#!/bin/bash\n{ echo "ARGS: $*"; echo "DIR: $API_PRIVATE_KEYS_DIR"; ls "$API_PRIVATE_KEYS_DIR"; } > "${seen}"\nexit ${altoolRc}\n`);
    chmodSync(join(bin, 'xcrun'), 0o755);
    const ipa = join(d, 'a.ipa'); writeFileSync(ipa, 'x'); const p8 = join(d, 'AuthKey.p8'); writeFileSync(p8, 'KLUCZ-TESTOWY');
    const rt = join(d, 'rt'); mkdirSync(rt);
    const run = (extra: Record<string, string> = {}, args = [ipa, p8]) => spawnSync('bash', [join(root, 'scripts/ci/waliduj-ipa.sh'), ...args], { encoding: 'utf8', env: { ...process.env, PATH: `${bin}:${process.env.PATH}`, RUNNER_TEMP: rt, ASC_KEY_ID: 'KID1234567', ASC_ISSUER_ID: 'ISS-UUID', ...extra } });
    return { d, rt, seen, ipa, p8, run };
  };
  test('Apple akceptuje (altool 0): kod 0; altool dostaje --validate-app, -t ios, plik .ipa i klucz w katalogu tymczasowym pod nazwą AuthKey_<ID>.p8; katalog usunięty po walidacji', () => {
    const t = setup(0); const r = t.run();
    expect(r.status).toBe(0); expect(r.stdout).toContain('Walidacja Apple (altool --validate-app): OK');
    const seen = readFileSync(t.seen, 'utf8');
    expect(seen).toContain('--validate-app'); expect(seen).toContain('-t ios'); expect(seen).toContain(`-f ${t.ipa}`); expect(seen).toContain('AuthKey_KID1234567.p8');
    expect(seen).toContain(`DIR: ${t.rt}/asc-keys.`);
    expect(readdirSync(t.rt)).toEqual([]);
  });
  test('Apple odrzuca (altool ≠ 0): skrypt pada (kod ≠ 0), nie wypisuje treści klucza, katalog z kluczem też usunięty', () => {
    const t = setup(3); const r = t.run();
    expect(r.status).not.toBe(0); expect(r.stdout + r.stderr).not.toContain('KLUCZ-TESTOWY'); expect(r.stdout).not.toContain('OK');
    expect(readdirSync(t.rt)).toEqual([]);
  });
  test('brak .ipa, brak klucza albo brak sekretów = błąd bez wywołania altool', () => {
    const t = setup(0);
    expect(t.run({}, [join(t.d, 'brak.ipa'), t.p8]).status).not.toBe(0);
    expect(t.run({}, [t.ipa, join(t.d, 'brak.p8')]).status).not.toBe(0);
    expect(t.run({ ASC_KEY_ID: '' }).status).not.toBe(0);
    expect(existsSync(t.seen)).toBe(false);
  });
});
