/*
 * 07-jakosc-001 (audyt 12.11.2026, KO-058 A): testflight.yml — pełny Jest na macOS w częściach (zadanie `testy`), limit z pomiaru, nie stały.
 * Przyczyna: krok `npm run verify` w zadaniu build rósł z danymi (38 → 57 → ponad 89 min) i przekroczył stały `timeout-minutes: 90` (przebieg 43267558799, build nie powstał).
 * Rodzaje (docs/20): logika (limit = pomiar), niezmienniki (zestaw plików Jest w częściach = pełny zestaw, bez pominięć i powtórzeń; te same kontrole co verify), dane (czasy-tests.json),
 * regresja (build nie uruchamia już verify w jednym kroku; limit build nie wzrósł). Gałąź długo żyjąca (L-080): strażnik czyta stan drzewa, więc obejmuje nowe pliki testów z gałęzi.
 * Wzór: tests/tests-yml-czas.test.ts (tests.yml). Data decyzji: 12.11.2026.
 */
import { execFileSync } from 'child_process';
import { readFileSync } from 'fs';
import { join } from 'path';

const root = join(__dirname, '..');
const yml = readFileSync(join(root, '.github/workflows/testflight.yml'), 'utf8');
type Probka = { przebieg: number; czesc?: number; min: number };
const czasy = JSON.parse(readFileSync(join(root, 'scripts/ci/czasy-tests.json'), 'utf8')) as {
  zapas: number; krok_zaokraglenia_min: number; testflight_macos: { czesci_jest: number; testy: { minimalna_probka: number; limit_tymczasowy_min: number; probka_min: Probka[] } };
};
const tf = czasy.testflight_macos;
const p95 = (xs: number[]) => [...xs].sort((a, b) => a - b)[Math.ceil(0.95 * xs.length) - 1];
const wylicz = (xs: number[]) => Math.ceil((p95(xs) * czasy.zapas) / czasy.krok_zaokraglenia_min) * czasy.krok_zaokraglenia_min;
const zadania = yml.slice(yml.indexOf('\njobs:')).split(/^  (?=[\w-]+:\s*$)/m).slice(1);
const zadanie = (n: string) => zadania.find(z => z.startsWith(`${n}:`)) ?? '';
const limit = (n: string) => Number(/timeout-minutes: (\d+)/.exec(zadanie(n))?.[1]);
const jest = (...a: string[]) => execFileSync('node', [join(root, 'node_modules/jest/bin/jest.js'), '--listTests', ...a], { cwd: root, encoding: 'utf8', maxBuffer: 1 << 26 }).split('\n').filter(Boolean);

describe('testflight.yml: testy Jest na macOS w częściach (07-jakosc-001, 12.11.2026)', () => {
  test('limit zadania testy = p95 próbki × zapas, w górę do kroku (albo limit tymczasowy do pełnej próbki) — z scripts/ci/czasy-tests.json', () => {
    const t = tf.testy;
    expect(limit('testy')).toBe(t.probka_min.length >= t.minimalna_probka ? wylicz(t.probka_min.map(p => p.min)) : t.limit_tymczasowy_min);
    expect(limit('testy')).toBeLessThan(90); /* cel: część ≤ 45 min, zapas do limitu; limit nie przekracza dawnego limitu całego zadania */
    expect(t.probka_min.every(p => p.czesc === undefined || (p.czesc >= 1 && p.czesc <= tf.czesci_jest))).toBe(true);
    if (t.probka_min.length >= t.minimalna_probka) expect(limit('testy')).toBeGreaterThan(Math.max(...t.probka_min.map(p => p.min)) * 1.2);
  });
  test('liczba części w macierzy i w --shard = czesci_jest; zadanie biegnie na macos-26 po bramce E2E; build czeka na testy', () => {
    const z = zadanie('testy');
    expect(z).toContain(`czesc: [${Array.from({ length: tf.czesci_jest }, (_, i) => i + 1).join(', ')}]`);
    expect(z).toContain(`--shard=\${{ matrix.czesc }}/${tf.czesci_jest}`);
    expect(z).toContain('name: testy macOS (część ${{ matrix.czesc }} z ' + tf.czesci_jest + ')');
    expect(Number(/max-parallel: (\d+)/.exec(z)?.[1])).toBeLessThanOrEqual(3); /* plan darmowy: macierz macOS najwyżej 3 równolegle (tests/macos-max-parallel.test.ts) */
    expect(z).toContain('runs-on: macos-26'); expect(z).toMatch(/needs: bramka\b/);
    expect(zadanie('build')).toMatch(/needs: \[bramka, testy\]/);
  });
  test('te same kontrole co verify: część 1 uruchamia npm run verify:kontrole (łańcuch verify poza Jest), Jest przez jest-ponow, a build nie uruchamia już npm run verify', () => {
    const z = zadanie('testy');
    expect(z).toMatch(/if: matrix\.czesc == 1\s*\n\s+run: npm run verify:kontrole\s*\n/);
    expect(z).toMatch(/run: node scripts\/jest-ponow\.mjs --shard=/);
    expect(yml).not.toMatch(/run: npm run verify\s*$/m);
    const bezKomentarzy = zadanie('build').split('\n').map(l => l.replace(/(^|\s)#.*$/, '')).join('\n'); /* komentarze wolno opisywać historię */
    expect(bezKomentarzy).not.toMatch(/npm run verify|jest-ponow|npx jest/);
  });
  test('limit czasu zadania build nie wzrósł (90 min) i żaden limit nie został podniesiony poza zapisany w pliku pomiarów', () => {
    expect(limit('build')).toBeLessThanOrEqual(90);
    expect(limit('bramka')).toBeLessThanOrEqual(125);
    expect((yml.match(/timeout-minutes:/g) ?? []).length).toBe(3); /* bramka, testy, build — nowy limit wymaga wpisu w pomiarach */
  });
  test('zestaw plików Jest w częściach = pełny zestaw: każdy plik w dokładnie jednej części, bez pominięć', () => {
    const wszystkie = jest();
    const czesci = Array.from({ length: tf.czesci_jest }, (_, i) => jest(`--shard=${i + 1}/${tf.czesci_jest}`));
    const suma = czesci.flat();
    expect(suma.length).toBe(wszystkie.length); /* bez powtórzeń */
    expect([...suma].sort()).toEqual([...wszystkie].sort()); /* bez pominięć */
    expect(wszystkie.length).toBeGreaterThan(700); /* strażnik zakresu: pusty zestaw nie jest dowodem */
  }, 120000);
});
