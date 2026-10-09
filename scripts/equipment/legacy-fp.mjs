// DAT2-02 (audyt kontrolny 1, 09.10.2026): odciski pól ćwiczeń biblioteki z katalogu poprzednich wersji (build 1001 = 5a8bcc5 i 1002 = f435c8c —
// katalog identyczny) → lib/catalog-fp-legacy.generated.ts. Ćwiczenie biblioteki przemianowane przez użytkownika w tamtej wersji (bez libKey) ma
// pola z TAMTEGO katalogu (krok katalogu 09.10 zmienił wymagania i partie wielu ćwiczeń), a warianty mają te same pola co ćwiczenie podstawowe
// (Bench Press = Board Press) — stąd lista kandydatów zamiast jednej nazwy (seed.libKeyCandidates, rozstrzyga migrate).
// Źródło: scripts/equipment/catalog-1002-fields.json — [nazwa, [pola jak seed.fpOf]] dla każdego wpisu LIB, wypisane kodem f435c8c (libExercise).
// Do tabeli trafiają wszystkie ćwiczenia o danym odcisku (warianty mają te same pola — rozstrzyga migrate: klucze już zajęte odpadają).
// Klucz — skrót cyrb53 (ta sama funkcja co seed.fpHash).
// Użycie: node scripts/equipment/legacy-fp.mjs  |  --check (test tests/backlog-0.10.1-dane.test.ts; kod wyjścia 1 = plik nieaktualny)
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const SRC = join(here, 'catalog-1002-fields.json');
const OUT = join(here, '..', '..', 'lib', 'catalog-fp-legacy.generated.ts');

/** cyrb53 (domena publiczna, bryc) — ten sam kod co seed.fpHash. */
export function fpHash(s) {
  let h1 = 0xdeadbeef, h2 = 0x41c6ce57;
  for (let i = 0; i < s.length; i++) { const ch = s.charCodeAt(i); h1 = Math.imul(h1 ^ ch, 2654435761); h2 = Math.imul(h2 ^ ch, 1597334677); }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
  return (4294967296 * (2097151 & h2) + (h1 >>> 0)).toString(36);
}

export function render(rows) {
  const by = new Map(); for (const [name, f] of rows) { const k = fpHash(JSON.stringify(f)); by.set(k, [...(by.get(k) ?? []), name]); }
  const out = [...by].sort((a, b) => (a[0] < b[0] ? -1 : a[0] > b[0] ? 1 : 0));
  return [
    '/* WYGENEROWANE — nie edytuj ręcznie. Źródło: scripts/equipment/catalog-1002-fields.json, skrypt: node scripts/equipment/legacy-fp.mjs (DAT2-02). */',
    '/** Odciski pól ćwiczeń biblioteki z katalogu buildów 1001/1002: skrót seed.fpHash → nazwy (w tamtym katalogu) wszystkich ćwiczeń o tych polach. */',
    'export const LEGACY_FP: Readonly<Record<string, readonly string[]>> = {',
    ...out.map(([k, n]) => `  ${JSON.stringify(k)}: ${JSON.stringify(n)},`),
    '};',
    '',
  ].join('\n');
}

const isMain = process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1];
if (isMain) {
  const out = render(JSON.parse(readFileSync(SRC, 'utf8')));
  if (process.argv.includes('--check')) {
    const cur = existsSync(OUT) ? readFileSync(OUT, 'utf8') : '';
    if (cur !== out) { console.error('lib/catalog-fp-legacy.generated.ts jest nieaktualny — uruchom: node scripts/equipment/legacy-fp.mjs'); process.exit(1); }
    console.log('catalog-fp-legacy.generated.ts: aktualny');
  } else { writeFileSync(OUT, out); console.log('zapisano lib/catalog-fp-legacy.generated.ts'); }
}
