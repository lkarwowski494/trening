/* Audyt jakości 007 i 012 (01.11.2026) — tests.yml: (007) limit czasu wyliczony z pomiaru, nie zgadywany (60 min przy realnych 22–40); (012) kasa z tagami i pełną historią,
 * bo test dziennika wydań bez tagów jest pusty. Dowód na gotowym produkcie: przebieg tests.yml na gałęzi (zielony, z log „tests/audit-m1-050-release-log” liczący tagi). */
import { readFileSync } from 'fs';
import { join } from 'path';

const root = join(__dirname, '..');
const yml = readFileSync(join(root, '.github/workflows/tests.yml'), 'utf8');
const czasy = JSON.parse(readFileSync(join(root, 'scripts/ci/czasy-tests.json'), 'utf8')) as { zapas: number; krok_zaokraglenia_min: number; probka_min: { przebieg: number; min: number }[] };
const p95 = (xs: number[]) => [...xs].sort((a, b) => a - b)[Math.ceil(0.95 * xs.length) - 1];

describe('tests.yml: limit czasu z pomiaru (007)', () => {
  const limit = Number(/timeout-minutes: (\d+)/.exec(yml)?.[1]);
  const wyliczony = Math.ceil((p95(czasy.probka_min.map(p => p.min)) * czasy.zapas) / czasy.krok_zaokraglenia_min) * czasy.krok_zaokraglenia_min;
  test('timeout-minutes = p95 próbki × zapas, w górę do kroku (liczba w jednym miejscu: scripts/ci/czasy-tests.json)', () => { expect(limit).toBe(wyliczony); });
  test('limit mieści najdłuższy zmierzony przebieg z zapasem i jest niższy niż dawne 60 min; próbka ≥ 10 przebiegów', () => {
    const max = Math.max(...czasy.probka_min.map(p => p.min)); expect(limit).toBeGreaterThan(max * 1.2); expect(limit).toBeLessThan(60); expect(czasy.probka_min.length).toBeGreaterThanOrEqual(10);
  });
  test('tylko jedno zadanie z limitem, bez zmian pozostałych ustawień (verify, ubuntu-latest)', () => { expect((yml.match(/timeout-minutes:/g) ?? []).length).toBe(1); expect(yml).toContain('run: npm run verify'); });
});

describe('tests.yml: tagi i historia dla dziennika wydań (012)', () => {
  test('actions/checkout z fetch-depth: 0 i fetch-tags: true', () => {
    expect(yml).toMatch(/actions\/checkout@v\d+\s*\n\s+with:\s*\n(?:\s+#.*\n|\s+\S.*\n)*?\s+fetch-depth: 0/); expect(yml).toMatch(/fetch-tags: true/);
  });
  test('test dziennika wydań w CI nie bywa pusty: wymaga co najmniej jednego tagu v*-b* (L-080: tagi z innych gałęzi niż testowana też trafiają do kasy dzięki fetch-tags)', () => {
    const t = readFileSync(join(root, 'tests/audit-m1-050-release-log.test.ts'), 'utf8'); expect(t).toMatch(/GITHUB_ACTIONS[\s\S]*tags\.length[\s\S]*toBeGreaterThan\(0\)/);
  });
});
