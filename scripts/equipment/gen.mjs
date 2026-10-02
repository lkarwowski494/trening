// P-003 E1: generuje lib/catalog.generated.ts z docs/research/equipment/catalog.json (wymagania sprzętowe 125 ćwiczeń biblioteki).
// Jedno źródło prawdy to plik JSON z researchu — nie przepisujemy go ręcznie. Po zmianie katalogu: node scripts/equipment/gen.mjs
// Tryb sprawdzania (test tests/locations-catalog.test.ts): node scripts/equipment/gen.mjs --check  (kod wyjścia 1 = plik nieaktualny)
import { fileURLToPath } from 'node:url';
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const root = fileURLToPath(new URL('../..', import.meta.url));
const SRC = join(root, 'docs/research/equipment/catalog.json');
const OUT = join(root, 'lib/catalog.generated.ts');

const LOAD_SOURCES = ['barbell', 'dumbbell', 'cable', 'machine_stack', 'bodyweight', 'trap_bar', 'ez_bar', 'plate_loaded_machine', 'kettlebell', 'smith', 'band', 'none'];
const PATTERNS = ['h_push', 'h_pull', 'v_push', 'v_pull', 'squat', 'hinge', 'lunge_single_leg', 'isolation', 'core_flexion', 'core_anti_ext', 'core_anti_rot', 'core_other', 'carry', 'cardio', 'other'];

export function render(catalog) {
  if (!Array.isArray(catalog)) throw new Error('catalog: oczekiwana tablica');
  const names = new Set(); const caps = new Set();
  const rows = catalog.map((e, i) => {
    const where = `catalog[${i}] ${e && e.name}`;
    if (!e || typeof e.name !== 'string' || !e.name) throw new Error(where + ': brak nazwy');
    if (names.has(e.name)) throw new Error(where + ': powtórzona nazwa'); names.add(e.name);
    if (!Array.isArray(e.requires) || !e.requires.every(g => Array.isArray(g) && g.length && g.every(c => typeof c === 'string' && c))) throw new Error(where + ': requires musi być listą niepustych grup');
    if (!Array.isArray(e.recommended) || !e.recommended.every(c => typeof c === 'string' && c)) throw new Error(where + ': recommended');
    if (!LOAD_SOURCES.includes(e.loadSource)) throw new Error(where + ': loadSource ' + e.loadSource);
    if (!PATTERNS.includes(e.pattern)) throw new Error(where + ': pattern ' + e.pattern);
    if (e.implements !== undefined && e.implements !== 1 && e.implements !== 2) throw new Error(where + ': implements');
    e.requires.flat().forEach(c => caps.add(c)); e.recommended.forEach(c => caps.add(c));
    const o = { requires: e.requires, recommended: e.recommended, loadSource: e.loadSource, pattern: e.pattern };
    if (e.implements !== undefined) o.implements = e.implements;
    return `  ${JSON.stringify(e.name)}: ${JSON.stringify(o)},`;
  });
  return [
    '/* AUTOMATYCZNIE WYGENEROWANE przez scripts/equipment/gen.mjs z docs/research/equipment/catalog.json — nie edytować ręcznie.',
    ' * Wymagania sprzętowe ćwiczeń biblioteki (P-003): requires = każda grupa musi być spełniona, w grupie wystarczy jedna możliwość. */',
    `export type LoadSource = ${LOAD_SOURCES.map(x => `'${x}'`).join(' | ')};`,
    `export type Pattern = ${PATTERNS.map(x => `'${x}'`).join(' | ')};`,
    'export interface CatalogEntry { requires: string[][]; recommended: string[]; loadSource: LoadSource; pattern: Pattern; implements?: 1 | 2 }',
    '/** Słownik możliwości użytych w katalogu (wymagane i zalecane), posortowany. */',
    `export const CATALOG_CAPS: readonly string[] = ${JSON.stringify([...caps].sort())};`,
    'export const CATALOG: Readonly<Record<string, CatalogEntry>> = {',
    ...rows,
    '};',
    '',
  ].join('\n');
}

const isMain = process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1];
if (isMain) {
  const out = render(JSON.parse(readFileSync(SRC, 'utf8')));
  if (process.argv.includes('--check')) {
    const cur = existsSync(OUT) ? readFileSync(OUT, 'utf8') : '';
    if (cur !== out) { console.error('lib/catalog.generated.ts jest nieaktualny — uruchom: node scripts/equipment/gen.mjs'); process.exit(1); }
    console.log('catalog.generated.ts: aktualny');
  } else { writeFileSync(OUT, out); console.log('zapisano lib/catalog.generated.ts'); }
}
