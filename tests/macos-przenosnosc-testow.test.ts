/* Testy procesu na runnerze macOS (06.11.2026, testflight.yml 42265419689: 42 z 17719 testów czerwone na macOS, zielone na Linuksie — lekcja w docs/40).
 * Trzy przyczyny źródłowe i ich strażnicy: (1) katalog tymczasowy przez symlink /var → /private/var psuje strażnika „uruchomiony jako skrypt” w kopiach skryptów,
 * (2) bash 3.2 (/bin/sh macOS) odrzuca `case` w $(…) w haku, (3) lista licencji zależała od zainstalowanych binarek platformowych. Linux tych błędów nie pokaże — stąd testy tekstowe. */
import { readFileSync } from 'fs';
import { join } from 'path';

const root = join(__dirname, '..');
const czytaj = (f: string) => readFileSync(join(root, f), 'utf8');

describe('przenośność testów procesu na macOS (06.11.2026)', () => {
  test.each([['tests/hak-pre-push.test.ts', /mkdtempSync\(join\(realpathSync\(tmpdir\(\)\)/], ['tests/waskie-gardla-zb041.test.ts', /mkdtempSync\(join\(realpathSync\(tmpdir\(\)\)/], ['tests/kontrole-ci.test.ts', /mkdtempSync\(path\.join\(fs\.realpathSync\(os\.tmpdir\(\)\)/]])(
    '%s: katalogi próbne ze skryptami po realpath (macOS: /var/folders to symlink)', (plik, wzor) => { expect(czytaj(plik)).toMatch(wzor); });
  test('inna arytmetyka: wspólna stała i tolerancja w jednym miejscu, użyte przez dwa testy figur; na Linuksie porównanie bajtowe', () => {
    const h = czytaj('tests/helpers/inna-arytmetyka.ts');
    expect(h).toMatch(/INNA_ARYTMETYKA = process\.platform !== 'linux'/); expect(h).toMatch(/TOLERANCJA_POZ = 1;/);
    for (const f of ['tests/figures-v2-zgodnosc-wsteczna.test.ts', 'tests/figury-generator-odtwarza.test.ts']) expect(czytaj(f)).toContain("from './helpers/inna-arytmetyka'");
    expect(czytaj('scripts/figures/odtwarzanie-poz.mjs')).toMatch(/const TOL = Number\(process\.env\.ODTWARZANIE_TOLERANCJA\) \|\| 0;/); /* domyślnie 0 = bajtowo */
  });
});
