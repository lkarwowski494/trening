// P-003 E1: generuje lib/catalog.generated.ts z docs/research/equipment/catalog.json (wymagania sprzętowe 125 ćwiczeń biblioteki).
// Jedno źródło prawdy to plik JSON z researchu — nie przepisujemy go ręcznie. Po zmianie katalogu: node scripts/equipment/gen.mjs
// Tryb sprawdzania (test tests/locations-catalog.test.ts): node scripts/equipment/gen.mjs --check  (kod wyjścia 1 = plik nieaktualny)
import { fileURLToPath } from 'node:url';
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { createHash } from 'node:crypto';

const root = fileURLToPath(new URL('../..', import.meta.url));
const SRC = join(root, 'docs/research/equipment/catalog.json');
const OUT = join(root, 'lib/catalog.generated.ts');

const LOAD_SOURCES = ['barbell', 'dumbbell', 'cable', 'machine_stack', 'bodyweight', 'trap_bar', 'ez_bar', 'plate_loaded_machine', 'kettlebell', 'smith', 'band', 'none'];
const PATTERNS = ['h_push', 'h_pull', 'v_push', 'v_pull', 'squat', 'hinge', 'lunge_single_leg', 'isolation', 'core_flexion', 'core_anti_ext', 'core_anti_rot', 'core_other', 'carry', 'cardio', 'other'];

/* Katalog ćwiczeń 04.10.2026 (decyzja właściciela: rozbudowa własnego katalogu + obciążenie partii): regiony mięśni do „muscleLoad”
 * (1 = główny, 0,5 = znaczący pomocniczy, 0,25 = stabilizacja), mapowanie regionu na zgrubną partię (seed.ts MUSCLES) — reguła spójności. */
export const REGIONS = { chest: 'klatka', front_delt: 'barki', side_delt: 'barki', rear_delt: 'barki', lats: 'plecy', upper_back: 'plecy', lower_back: 'plecy', biceps: 'biceps', triceps: 'triceps', forearms: 'przedramiona', abs: 'core', obliques: 'core', glutes: 'pośladki', quads: 'czworogłowe', hamstrings: 'dwugłowe', adductors: null, abductors: 'pośladki', calves: 'łydki' };
const WEIGHTS = [1, 0.5, 0.25];
const GROUPS = ['klatka', 'plecy', 'barki', 'biceps', 'triceps', 'nogi', 'pośladki', 'łydki', 'core', 'cardio', 'inne'];
const EQUIPS = ['hantle', 'sztanga', 'masa ciała', 'maszyna', 'linki', 'inne'];
const METRICS = ['weight_reps', 'reps', 'time', 'distance_time', 'weight_time'];
const LOAD_MODES = ['per_dumbbell', 'total', 'unilateral'];
const MUSCLES = ['klatka', 'plecy', 'barki', 'biceps', 'triceps', 'czworogłowe', 'dwugłowe', 'pośladki', 'łydki', 'core', 'przedramiona'];

export function render(catalog) {
  if (!Array.isArray(catalog)) throw new Error('catalog: oczekiwana tablica');
  const names = new Set(); const caps = new Set(); const loads = []; const cables = []; const extra = [];
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
    if (e.muscleLoad !== undefined) { if (!e.muscleLoad || typeof e.muscleLoad !== 'object' || !Object.keys(e.muscleLoad).length) throw new Error(where + ': muscleLoad');
      for (const [r, w] of Object.entries(e.muscleLoad)) { if (!(r in REGIONS)) throw new Error(where + ': region ' + r); if (!WEIGHTS.includes(w)) throw new Error(where + ': waga ' + r + '=' + w); }
      loads.push(`  ${JSON.stringify(e.name)}: ${JSON.stringify(e.muscleLoad)},`); }
    if (e.cables !== undefined) { if (e.cables !== 1 && e.cables !== 2) throw new Error(where + ': cables'); if (e.loadSource !== 'cable' && !e.requires.flat().concat(e.recommended).some(c => c.startsWith('cable.'))) throw new Error(where + ': cables bez wyciągu'); cables.push(`  ${JSON.stringify(e.name)}: ${e.cables},`); }
    if (e.group !== undefined) { /* nowe ćwiczenie biblioteki (spoza lib/seed.ts LIB) — komplet pól */
      if (!GROUPS.includes(e.group) || !EQUIPS.includes(e.equipment) || !METRICS.includes(e.metric) || !LOAD_MODES.includes(e.loadMode) || typeof e.bandAssistable !== 'boolean') throw new Error(where + ': pola nowego ćwiczenia');
      if (!Array.isArray(e.muscles) || !e.muscles.every(m => MUSCLES.includes(m)) || !Array.isArray(e.secondaryMuscles) || !e.secondaryMuscles.every(m => MUSCLES.includes(m))) throw new Error(where + ': mięśnie');
      if (!e.muscleLoad) throw new Error(where + ': nowe ćwiczenie bez muscleLoad');
      extra.push(`  ${JSON.stringify([e.name, e.group, e.equipment, e.bandAssistable, e.metric, e.loadMode, e.muscles, e.secondaryMuscles])},`); }
    const o = { requires: e.requires, recommended: e.recommended, loadSource: e.loadSource, pattern: e.pattern };
    if (e.implements !== undefined) o.implements = e.implements;
    return `  ${JSON.stringify(e.name)}: ${JSON.stringify(o)},`;
  });
  /* audyt E1 (M6): wersja katalogu = skrót treści — ćwiczenia z biblioteki z inną wersją dostają przy starcie aktualne wymagania */
  const rev = createHash('sha256').update(rows.join('\n')).digest('hex').slice(0, 12);
  return [
    '/* AUTOMATYCZNIE WYGENEROWANE przez scripts/equipment/gen.mjs z docs/research/equipment/catalog.json — nie edytować ręcznie.',
    ' * Wymagania sprzętowe ćwiczeń biblioteki (P-003): requires = każda grupa musi być spełniona, w grupie wystarczy jedna możliwość. */',
    `export type LoadSource = ${LOAD_SOURCES.map(x => `'${x}'`).join(' | ')};`,
    `export type Pattern = ${PATTERNS.map(x => `'${x}'`).join(' | ')};`,
    'export interface CatalogEntry { requires: string[][]; recommended: string[]; loadSource: LoadSource; pattern: Pattern; implements?: 1 | 2 }',
    '/** Wersja treści katalogu (skrót) — zapisywana w ćwiczeniu jako catalogRev. */',
    `export const CATALOG_REV = '${rev}';`,
    '/** Słownik możliwości użytych w katalogu (wymagane i zalecane), posortowany. */',
    `export const CATALOG_CAPS: readonly string[] = ${JSON.stringify([...caps].sort())};`,
    'export const CATALOG: Readonly<Record<string, CatalogEntry>> = {',
    ...rows,
    '};',
    '/** Regiony mięśni (obciążenie partii) → zgrubna partia z lib/seed.ts MUSCLES (null = bez odpowiednika). */',
    `export const MUSCLE_REGIONS = ${JSON.stringify(REGIONS)} as const;`,
    'export type MuscleRegion = keyof typeof MUSCLE_REGIONS;',
    '/** Obciążenie partii przez ćwiczenie: 1 = główny, 0,5 = znaczący pomocniczy, 0,25 = stabilizacja. */',
    'export const MUSCLE_LOAD: Readonly<Record<string, Partial<Record<MuscleRegion, number>>>> = {',
    ...loads,
    '};',
    '/** Liczba linek obciążonych naraz (ćwiczenia na wyciągu) — do objętości na stacji (Q-024, po decyzji). */',
    'export const CABLES: Readonly<Record<string, 1 | 2>> = {',
    ...cables,
    '};',
    '/** Ćwiczenia biblioteki dodane w katalogu (04.10.2026): [nazwa, partia, sprzęt, asysta gumą, miara, tryb liczenia, mięśnie główne, pomocnicze]. */',
    'export const CATALOG_LIB_EXTRA: readonly [string, string, string, boolean, string, string, string[], string[]][] = [',
    ...extra,
    '];',
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
