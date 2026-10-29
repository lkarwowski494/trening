/*
 * Strażnik limitu maszyn macOS (decyzja właściciela 27.10.2026, A+C, lekcja w docs/40): plan darmowy GitHuba daje 5 równoległych zadań macOS na repozytorium, a przebieg
 * zrzutów z 5 zadaniami (40499391220) zajął je wszystkie na ok. 1,5 h i zablokował E2E buildu 1.0. Każde zadanie macOS w macierzy (wiele równoległych instancji) musi mieć
 * `strategy.max-parallel` ≤ MACOS_MAX_PARALLEL (3; wartość w scripts/ci/store-shards.mjs) — 2 maszyny zostają wolne dla E2E i buildu.
 */
import * as fs from 'fs';
import * as path from 'path';
import { execFileSync } from 'child_process';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const yaml = require('js-yaml');

const root = path.join(__dirname, '..');
const dir = path.join(root, '.github/workflows');
const LIMIT: number = JSON.parse(execFileSync('node', ['--input-type=module', '-e', `import { MACOS_MAX_PARALLEL as L } from ${JSON.stringify(path.join(root, 'scripts/ci/store-shards.mjs'))}; console.log(L)`], { encoding: 'utf8' }));

type Job = { 'runs-on'?: string | string[]; strategy?: { matrix?: unknown; 'max-parallel'?: unknown } };
const isMac = (j: Job) => [j['runs-on']].flat().some(r => typeof r === 'string' && /^macos/i.test(r));
const workflows = fs.readdirSync(dir).filter(f => /\.ya?ml$/.test(f)).map(f => ({ f, doc: yaml.safeLoad(fs.readFileSync(path.join(dir, f), 'utf8')) as { jobs?: Record<string, Job> } }));
const macMatrixJobs = workflows.flatMap(({ f, doc }) => Object.entries(doc.jobs ?? {}).filter(([, j]) => isMac(j) && j.strategy?.matrix !== undefined).map(([name, j]) => ({ f, name, j })));

describe('workflowy: zadania macOS w macierzy mają max-parallel ≤ limit', () => {
  test('limit to 3 (z 5 maszyn planu darmowego 2 zostają dla E2E i buildu)', () => { expect(LIMIT).toBe(3); });
  test('znaleziono macierze macOS (strażnik nie jest pusty): zrzuty sklepu i E2E', () => {
    const names = macMatrixJobs.map(m => `${m.f}:${m.name}`);
    expect(names).toEqual(expect.arrayContaining(['store-screenshots.yml:zrzuty', 'e2e-ios.yml:e2e']));
  });
  test.each(macMatrixJobs.map(m => [`${m.f}:${m.name}`, m] as const))('%s', (_n, { j }) => {
    const mp = j.strategy?.['max-parallel'];
    expect(typeof mp).toBe('number');
    expect(mp as number).toBeGreaterThanOrEqual(1); expect(mp as number).toBeLessThanOrEqual(LIMIT);
  });
  test('strażnik wykrywa naruszenie: macierz macOS bez max-parallel albo z 5 jest czerwona (próba na kopii)', () => {
    const bad = yaml.safeLoad('jobs:\n  a:\n    runs-on: macos-26\n    strategy:\n      matrix: { s: [1,2,3,4,5] }\n  b:\n    runs-on: macos-26\n    strategy:\n      max-parallel: 5\n      matrix: { s: [1,2] }\n') as { jobs: Record<string, Job> };
    const verdict = Object.values(bad.jobs).map(j => { const mp = j.strategy?.['max-parallel']; return typeof mp === 'number' && mp <= LIMIT; });
    expect(verdict).toEqual([false, false]);
  });
});
