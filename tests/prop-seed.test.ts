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
const { PROP_SEED_DEFAULT, resolvePropSeed } = require('./prop-seed');

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
