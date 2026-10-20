/* M1-audytor-generalny-059: `npm run test:fast` działa na Windows (bez spawnSync('npx') → ENOENT) i zmiana scenariusza Maestro uruchamia
   tests/maestro-flows.test.tsx. Skrypt ma tryb --plan (bez uruchamiania Jesta); zmienione pliki można podać w TEST_FAST_CHANGED. */
import { execFileSync } from 'child_process';
import { readFileSync } from 'fs';
import { join } from 'path';

const script = join(__dirname, '../scripts/test-fast.mjs');
const plan = (changed: string[]) => JSON.parse(execFileSync('node', [script, '--plan'], { encoding: 'utf8', env: { ...process.env, TEST_FAST_CHANGED: changed.join('\n') } }));

describe('test:fast (M1-059)', () => {
  test('jest uruchamiany przez node i plik jest.js, nie przez npx (npx na Windows to npx.cmd → ENOENT)', () => {
    const p = plan(['lib/units.ts']);
    expect(p.command).toBe(process.execPath);
    expect(p.args[0]).toMatch(/jest[\\/]bin[\\/]jest\.js$/);
    expect(p.args).toEqual(expect.arrayContaining(['--findRelatedTests', 'lib/units.ts']));
    expect(readFileSync(script, 'utf8')).not.toMatch(/spawnSync\(\s*'npx'/);
  });
  test('zmiana samego scenariusza .maestro/NN-*.yaml dodaje tests/maestro-flows.test.tsx', () => {
    const p = plan(['.maestro/09-jezyk-wyglad.yaml']);
    expect(p.files).toEqual(expect.arrayContaining(['.maestro/09-jezyk-wyglad.yaml', 'tests/maestro-flows.test.tsx']));
  });
  test('dokumenty i pliki bez kodu nie uruchamiają testów; brak zmian — pusty plan', () => {
    expect(plan(['docs/40-lekcje.md', 'README.md']).files).toEqual([]);
    expect(plan([]).files).toEqual([]);
  });
  test('zmiana pliku testu i kodu: pliki bez duplikatów', () => {
    expect(plan(['lib/units.ts', 'lib/units.ts', 'tests/units.test.ts']).files).toEqual(['lib/units.ts', 'tests/units.test.ts']);
  });
});
