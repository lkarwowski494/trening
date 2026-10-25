// Pliki runtime wskazówek techniki i figur BEZ nazw źródeł (decyzja właściciela 25.10.2026, docs/18: „całkiem anonimowo” — nazwy organizacji, autorów, tytuły i adresy źródeł
// nie trafiają do paczki aplikacji). Jedno źródło prawdy: katalog data/zrodla (cues.json, figures.json — pełne dane ze źródłami; czytają je tylko generatory dokumentów
// scripts/cues/gen.mjs i scripts/figures/gen.mjs, ten skrypt i testy tests/zrodla-pelne-*.test.ts). Stąd generuje się pliki, które importuje aplikacja:
//   lib/cues/data.json    — { exercises: id zdań, basis: rodzaje źródeł ćwiczenia (podpis), open: klucze bez wskazówek, partial: klucze z niepełnym zestawem sekcji }
//   lib/figures/data.json — { rom: granice kątów (min/max, bez źródeł), exercises: figury, open: klucze bez figury }
// Użycie: node scripts/zrodla-runtime.mjs --write  (zapis) | node scripts/zrodla-runtime.mjs --check  (verify: nieaktualny plik runtime → kod 1; wzór: scripts/cues/gen.mjs)
import { fileURLToPath } from 'node:url';
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const root = fileURLToPath(new URL('..', import.meta.url));
const FULL_CUES = join(root, 'data/zrodla/cues.json'), FULL_FIG = join(root, 'data/zrodla/figures.json');
export const OUT_CUES = join(root, 'lib/cues/data.json'), OUT_FIG = join(root, 'lib/figures/data.json');
/** Kolejność rodzajów w podpisie = CUE_BASIS_KINDS w lib/cues/index.ts. */
export const BASIS_ORDER = ['org', 'site', 'maker', 'study'];
const SECTIONS = ['setup', 'move', 'tips', 'mistakes'];

export function buildCues(full) {
  const exercises = {}, basis = {};
  for (const [ex, x] of Object.entries(full.exercises)) {
    exercises[ex] = Object.fromEntries(Object.keys(x).map(sec => [sec, x[sec].map(r => ({ c: r.c }))]));
    const kinds = new Set();
    for (const sec of SECTIONS) for (const r of x[sec] ?? []) for (const [sid] of r.s) kinds.add(full.orgs[full.sources[sid].org].kind);
    basis[ex] = BASIS_ORDER.filter(k => kinds.has(k));
  }
  return { exercises, basis, open: Object.keys(full.open), partial: full.partial ?? [] };
}
export function buildFigures(full) {
  const rom = {};
  for (const v of Object.keys(full.rom)) if (v !== 'note') rom[v] = Object.fromEntries(Object.entries(full.rom[v]).map(([j, r]) => [j, { min: r.min, max: r.max }]));
  return { rom, exercises: full.exercises, open: Object.keys(full.open) };
}
export const serialize = obj => JSON.stringify(obj) + '\n';

export function outputs() {
  return [
    [OUT_CUES, serialize(buildCues(JSON.parse(readFileSync(FULL_CUES, 'utf8'))))],
    [OUT_FIG, serialize(buildFigures(JSON.parse(readFileSync(FULL_FIG, 'utf8'))))],
  ];
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const check = process.argv.includes('--check');
  if (!check && !process.argv.includes('--write')) { console.error('użycie: node scripts/zrodla-runtime.mjs --write | --check'); process.exit(2); }
  let bad = 0;
  for (const [file, text] of outputs()) {
    if (check) { if (!existsSync(file) || readFileSync(file, 'utf8') !== text) { console.error(`nieaktualny: ${file.slice(root.length)} — uruchom node scripts/zrodla-runtime.mjs --write`); bad = 1; } }
    else { writeFileSync(file, text); console.log(`zapisano ${file}`); }
  }
  process.exit(bad);
}
