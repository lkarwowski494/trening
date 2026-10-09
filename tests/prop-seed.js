/* Ziarno testów własności fast-check (TST2-07, audyt kontrolny 1, 09.10.2026 — wariant A): jedno miejsce.
 * PROP_SEED nieustawione → stałe ziarno (każde wypchnięcie, verify, testflight — powtarzalnie); PROP_SEED=<liczba> → odtworzenie przebiegu;
 * PROP_SEED=random → losowe (nocą, nightly.yml). global-setup.js ustala ziarno raz na przebieg i wypisuje je w logu, setup.js ustawia je
 * w fast-check (fc.configureGlobal) — fc.assert bez własnego `seed` dostaje je automatycznie. matrix-invariants i matrix-data-fuzz mają
 * własne MATRIX_SEED (opis w nagłówku matrix-invariants), invariants — INV_SEED. */
const PROP_SEED_DEFAULT = 20261006;
function resolvePropSeed(v) {
  if (v == null || v === '') return { seed: PROP_SEED_DEFAULT, mode: 'stałe' };
  if (v === 'random') return { seed: 1 + Math.floor(Math.random() * (2 ** 31 - 2)), mode: 'losowe' };
  if (/^\d+$/.test(v) && Number(v) < 2 ** 31) return { seed: Number(v), mode: 'podane' };
  throw new Error(`PROP_SEED: oczekiwano liczby całkowitej albo „random”, jest „${v}”`);
}
module.exports = { PROP_SEED_DEFAULT, resolvePropSeed };
