// check:slowniki (L-048 A, decyzja właściciela 28.10.2026; docs/40 L-048): strażniki jakości słowników w jednym miejscu — po zmianie lib/locales/,
// lib/cues/text/, lib/i18n.en.ts, store/ albo docs/lokalizacja/ (tłumacz, przekład przez API, poprawki tekstów). Uruchamia je check:pochodne warunkowo
// (scripts/pochodne.mjs, dotykaSlownikow), żeby hak pre-push nie rósł przy zmianach bez tekstów; pełny jest i tak biegnie w verify i CI.
// Użycie: npm run check:slowniki   (kod 1 = któryś strażnik czerwony). Test: tests/l048-check-slowniki.test.ts.
import { spawnSync } from 'node:child_process';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
/* Jedna lista strażników jakości słowników (L-048). */
export const STRAZNIKI_SLOWNIKOW = [
  'tests/i18n-locales.test.ts', 'tests/slownik-terminow.test.ts', 'tests/skroty-przekladu.test.ts', 'tests/units-label.test.ts',
  'tests/audit-m1-029-kropka-srodkowa.test.ts', 'tests/i18n-variants.test.ts', 'tests/i18n-wave2.test.ts', 'tests/i18n-wave3.test.ts', 'tests/i18n-wave4.test.ts',
  'tests/matrix-i18n.test.tsx',
];
export const POLECENIA = [
  ['node', 'scripts/check-i18n.mjs'],
  ['npx', 'jest', '--maxWorkers=1', '--silent', ...STRAZNIKI_SLOWNIKOW],
  ['npx', 'jest', '--maxWorkers=1', '--silent', 'tests/audit-k1-bl-mer.test.tsx', '-t', 'A11N-03'], /* fr: spacja nierozdzielająca — bez reszty pliku */
];

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const t0 = Date.now(); let kod = 0;
  for (const p of POLECENIA) {
    const r = spawnSync(p[0], p.slice(1), { cwd: ROOT, stdio: 'inherit', env: process.env });
    if (r.status !== 0) { kod = 1; process.stderr.write(`check:slowniki: BŁĄD ${p.slice(0, 6).join(' ')}…\n`); }
  }
  process.stderr.write(`check:slowniki: ${kod ? 'czerwone' : 'zielone'} (${((Date.now() - t0) / 1000).toFixed(0)} s)\n`);
  process.exit(kod);
}
