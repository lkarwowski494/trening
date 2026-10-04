/* CI (E2E): logi przebiegów są publiczne, a artefakty (zrzuty) bywają nieosiągalne — po porażce Maestro skrypt wypisuje
 * nieudane polecenie, kilka poprzednich i teksty z ekranu w chwili błędu (scripts/ci/maestro-failures.py). */
import { execFileSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

const root = path.join(__dirname, '..');
const run = (dir: string) => execFileSync('python3', [path.join(root, 'scripts/ci/maestro-failures.py'), dir], { encoding: 'utf8' });

test('maestro-failures: nieudane polecenie, poprzednie kroki i teksty z ekranu; UUID zamaskowany', () => {
  const out = run(path.join(__dirname, 'fixtures/maestro-out'));
  expect(out).toMatch(/Flow A/);
  expect(out).toMatch(/FAILED.*assertConditionCommand/);
  expect(out).toMatch(/Assertion is false: "Exercise order" is visible/);
  expect(out).toMatch(/tapOnElement.*Reorder exercises/);
  expect(out).toMatch(/Swap exercise/);
  expect(out).toMatch(/Suggestion 1: Push Up, same movement/);
  expect(out).not.toMatch(/1A2B3C4D-1111-2222-3333-444455556666/);
  expect(out).toMatch(/<UUID>/);
});

test('maestro-failures: bez nieudanych kroków i bez katalogu — kod 0, krótka informacja', () => {
  const tmp = fs.mkdtempSync(path.join(require('os').tmpdir(), 'mf-'));
  expect(run(tmp)).toMatch(/brak nieudanych/);
  expect(run(path.join(tmp, 'nie-ma'))).toMatch(/brak katalogu/);
});

test('e2e-ios.yml: podsumowanie porażki uruchamiane tylko po błędzie, przed wysyłką artefaktów', () => {
  const y = fs.readFileSync(path.join(root, '.github/workflows/e2e-ios.yml'), 'utf8');
  const i = y.indexOf('python3 scripts/ci/maestro-failures.py e2e-out');
  expect(i).toBeGreaterThan(0);
  expect(y.slice(y.lastIndexOf('- name:', i), i)).toMatch(/if: failure\(\)/);
  expect(i).toBeLessThan(y.indexOf('name: e2e-ios'));
});
