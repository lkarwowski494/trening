// skanuje: tests
/*
 * TST2-07 (audyt kontrolny 1, 09.10.2026; decyzja wg zasady z 20:20 — wariant A): testy własności (fast-check) przy każdym wypchnięciu na stałym
 * ziarnie (przewidywalne CI — porażka nie trafia na niezwiązany commit), nocą na losowym (nightly.yml), ziarno zawsze w logu.
 * Jedno miejsce: tests/prop-seed.js (PROP_SEED_DEFAULT; PROP_SEED=<liczba> albo random); global-setup.js ustala ziarno przebiegu raz
 * (procesy robocze je dziedziczą), setup.js ustawia je w fast-check (fc.configureGlobal) dla każdego pliku.
 */
import * as fc from 'fast-check';
import { readFileSync } from 'fs';
import { join } from 'path';

const root = join(__dirname, '..');
const { PROP_SEED_DEFAULT, resolvePropSeed, PROP_RUNS_SKALA_DEFAULT, PROP_RUNS_SKALA_NOC, resolveRunsScale, propRuns } = require('./prop-seed');

describe('TST2-07: ziarno testów własności', () => {
  test('w tym przebiegu fast-check ma ziarno z PROP_SEED (domyślnie stałe) — każde fc.assert bez własnego ziarna jest powtarzalne', () => {
    const want = process.env.PROP_SEED ? Number(process.env.PROP_SEED) : PROP_SEED_DEFAULT;
    expect(Number.isInteger(want)).toBe(true);
    expect(fc.readConfigureGlobal().seed).toBe(want);
    /* dwa przebiegi tej samej własności dają te same przypadki */
    const draw = () => fc.sample(fc.integer(), { numRuns: 5, seed: fc.readConfigureGlobal().seed });
    expect(draw()).toEqual(draw());
  });

  test('resolvePropSeed: brak → stałe ziarno; liczba → ta liczba; random → losowa liczba całkowita dodatnia; inne → błąd', () => {
    expect(resolvePropSeed(undefined)).toEqual({ seed: PROP_SEED_DEFAULT, mode: 'stałe' });
    expect(resolvePropSeed('')).toEqual({ seed: PROP_SEED_DEFAULT, mode: 'stałe' });
    expect(resolvePropSeed('531137545')).toEqual({ seed: 531137545, mode: 'podane' });
    const r = resolvePropSeed('random'); expect(r.mode).toBe('losowe'); expect(Number.isInteger(r.seed) && r.seed > 0 && r.seed < 2 ** 31).toBe(true);
    expect(() => resolvePropSeed('abc')).toThrow(/PROP_SEED/);
  });

  test('global-setup: random zamienia na liczbę w process.env (procesy robocze dziedziczą) i wypisuje ziarno w logu', () => {
    const before = process.env.PROP_SEED; const log = jest.spyOn(console, 'log').mockImplementation(() => {});
    try {
      process.env.PROP_SEED = 'random'; require('./global-setup')();
      expect(process.env.PROP_SEED).toMatch(/^\d+$/);
      expect(log.mock.calls.flat().join(' ')).toContain(`PROP_SEED=${process.env.PROP_SEED}`);
      log.mockClear(); delete process.env.PROP_SEED; require('./global-setup')();
      expect(process.env.PROP_SEED).toBeUndefined();
      expect(log.mock.calls.flat().join(' ')).toContain(`PROP_SEED=${PROP_SEED_DEFAULT}`);
    } finally { log.mockRestore(); if (before == null) delete process.env.PROP_SEED; else process.env.PROP_SEED = before; }
  });

  test('CI: przy każdym wypchnięciu bez PROP_SEED (stałe), nocą pełny zestaw z PROP_SEED=random', () => {
    const tests = readFileSync(join(root, '.github/workflows/tests.yml'), 'utf8');
    const testflight = readFileSync(join(root, '.github/workflows/testflight.yml'), 'utf8');
    for (const y of [tests, testflight]) expect(y).not.toMatch(/PROP_SEED/);
    const nightly = readFileSync(join(root, '.github/workflows/nightly.yml'), 'utf8');
    expect(nightly).toMatch(/PROP_SEED=random npx jest --maxWorkers=2/);
  });

  test('pliki z fc.assert nie przypinają ziarna na stałe obok PROP_SEED (wyjątek: matrix-invariants i matrix-data-fuzz — MATRIX_SEED, invariants — INV_SEED)', () => {
    const fs = require('fs');
    const files = fs.readdirSync(join(root, 'tests')).filter((f: string) => /\.test\.tsx?$/.test(f) && f !== 'prop-seed.test.ts');
    const bad: string[] = [];
    for (const f of files) {
      const s: string = fs.readFileSync(join(root, 'tests', f), 'utf8'); if (!/fc\.assert/.test(s)) continue;
      if (/seed:\s*\d/.test(s)) bad.push(f);
    }
    expect(bad).toEqual([]);
  });
});

/* ZB-029 T2 (decyzja właściciela 31.10.2026): mniej przypadków testów własności w ciągu dnia (verify, tests.yml, testflight), pełna liczba w nocy. */
describe('ZB-029 T2: skala liczby przypadków testów własności (31.10.2026)', () => {
  test('resolveRunsScale: brak → domyślna (0,25); liczba z (0, 1] → ta liczba; poza przedziałem lub nie liczba → błąd', () => {
    expect(PROP_RUNS_SKALA_DEFAULT).toBe(0.25); expect(PROP_RUNS_SKALA_NOC).toBe(1);
    expect(resolveRunsScale(undefined)).toBe(0.25); expect(resolveRunsScale('')).toBe(0.25);
    expect(resolveRunsScale('1')).toBe(1); expect(resolveRunsScale('0.5')).toBe(0.5);
    for (const zle of ['0', '-1', '1.5', 'abc', 'NaN', 'Infinity']) expect(() => resolveRunsScale(zle)).toThrow(/PROP_RUNS_SKALA/);
  });
  test('propRuns: 3000 × skala, zaokrąglone, minimum 1; skala 1 daje pełną liczbę (noc), domyślna — 750', () => {
    expect(propRuns(3000, 1)).toBe(3000); expect(propRuns(3000, 0.25)).toBe(750); expect(propRuns(3, 0.1)).toBe(1); expect(propRuns(1, 0.0001)).toBe(1);
    expect(propRuns(3000, resolveRunsScale(undefined))).toBe(750);
    const przed = process.env.PROP_RUNS_SKALA;
    try { delete process.env.PROP_RUNS_SKALA; expect(propRuns(3000)).toBe(750); process.env.PROP_RUNS_SKALA = '1'; expect(propRuns(3000)).toBe(3000); }
    finally { if (przed == null) delete process.env.PROP_RUNS_SKALA; else process.env.PROP_RUNS_SKALA = przed; }
  });
  test('nocny przebieg ma pełną skalę (PROP_RUNS_SKALA = stała nocna) obok losowego ziarna; tests.yml, testflight.yml i tests-tz.yml nie ustawiają skali', () => {
    const nightly = readFileSync(join(root, '.github/workflows/nightly.yml'), 'utf8').split('\n').filter(l => !/^\s*#/.test(l)).join('\n');
    expect(nightly).toMatch(new RegExp(`PROP_RUNS_SKALA=${PROP_RUNS_SKALA_NOC} PROP_SEED=random npx jest --maxWorkers=2`));
    for (const f of ['tests.yml', 'testflight.yml', 'tests-tz.yml']) expect(readFileSync(join(root, '.github/workflows', f), 'utf8')).not.toMatch(/PROP_RUNS_SKALA/);
  });
  test('pliki z dawnym numRuns: 3000 liczą przez propRuns(3000), bez własnej liczby przypadków na stałe', () => {
    for (const f of ['audit-r72-c', 'migrate-idem', 'invariants']) {
      const s = readFileSync(join(root, 'tests', `${f}.test.ts`), 'utf8');
      expect(s).toMatch(/propRuns\(3000\)/); expect(s).not.toMatch(/numRuns: 3000/);
    }
  });
});

