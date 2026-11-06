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

/* Skala liczby przypadków testów własności (ZB-029 T2, decyzja właściciela 31.10.2026): JEDNO miejsce na liczby. Pliki z dużą liczbą przypadków na stałym ziarnie
 * (audit-r72-c, migrate-idem, invariants — dawniej 3000) liczą `propRuns(3000)`. PROP_RUNS_SKALA nieustawione → PROP_RUNS_SKALA_DEFAULT (verify, każde wypchnięcie, testflight:
 * te same przypadki co dotąd, tylko ich początek — przy stałym ziarnie fast-check generuje przypadki w tej samej kolejności); nocny przebieg (nightly.yml) ustawia
 * PROP_RUNS_SKALA=1 (PROP_RUNS_SKALA_NOC) i liczy pełną liczbę na losowym ziarnie. */
const PROP_RUNS_SKALA_DEFAULT = 0.25;
const PROP_RUNS_SKALA_NOC = 1;
function resolveRunsScale(v) {
  if (v == null || v === '') return PROP_RUNS_SKALA_DEFAULT;
  const n = Number(v);
  if (!Number.isFinite(n) || n <= 0 || n > 1) throw new Error(`PROP_RUNS_SKALA: oczekiwano liczby z przedziału (0, 1], jest „${v}”`);
  return n;
}
/** Liczba przypadków: pełna liczba × skala (min. 1), zaokrąglona. */
function propRuns(pelna, skala = resolveRunsScale(process.env.PROP_RUNS_SKALA)) { return Math.max(1, Math.round(pelna * skala)); }
module.exports = { PROP_SEED_DEFAULT, resolvePropSeed, PROP_RUNS_SKALA_DEFAULT, PROP_RUNS_SKALA_NOC, resolveRunsScale, propRuns };
