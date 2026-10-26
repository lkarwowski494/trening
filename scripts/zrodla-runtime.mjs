// Pliki runtime wskazówek techniki i figur BEZ nazw źródeł (decyzja właściciela 25.10.2026, docs/18: „całkiem anonimowo” — nazwy organizacji, autorów, tytuły i adresy źródeł
// nie trafiają do paczki aplikacji). Jedno źródło prawdy: katalog data/zrodla (cues.json, figures.json — pełne dane ze źródłami; czytają je tylko generatory dokumentów
// scripts/cues/gen.mjs i scripts/figures/gen.mjs, ten skrypt i testy tests/zrodla-pelne-*.test.ts). Stąd generuje się pliki, które importuje aplikacja:
//   lib/cues/data.json    — { exercises: id zdań, basis: rodzaje źródeł ćwiczenia (podpis), open: klucze bez wskazówek, partial: klucze z niepełnym zestawem sekcji }
//   lib/figures/data.json — { rom: granice kątów (min/max, bez źródeł), exercises: figury, open: klucze bez figury }
//   lib/muscleRoles/data.json — role mięśni w ruchu (26.10.2026): zdania gotowe (PL, z fazą), reguły, wyjątki, listy po nazwie; bez źródeł i bez funkcji niewyświetlanych
//   (status uproszczenie / jedno źródło: reguła zostaje z flagą show:false, bez tekstu); angielskie zdania — blok między znacznikami ROLE-MIESNI w lib/i18n.en.ts
// Użycie: node scripts/zrodla-runtime.mjs --write  (zapis) | node scripts/zrodla-runtime.mjs --check  (verify: nieaktualny plik runtime → kod 1; wzór: scripts/cues/gen.mjs)
import { fileURLToPath } from 'node:url';
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const root = fileURLToPath(new URL('..', import.meta.url));
const FULL_CUES = join(root, 'data/zrodla/cues.json'), FULL_FIG = join(root, 'data/zrodla/figures.json');
export const OUT_CUES = join(root, 'lib/cues/data.json'), OUT_FIG = join(root, 'lib/figures/data.json');
const FULL_ROLES = join(root, 'data/zrodla/role-miesni.json'); export const OUT_ROLES = join(root, 'lib/muscleRoles/data.json');
export const EN_FILE = join(root, 'lib/i18n.en.ts'); export const EN_BEGIN = '  /* ROLE-MIESNI:BEGIN — generowane przez scripts/zrodla-runtime.mjs z data/zrodla/role-miesni.json, nie edytować ręcznie */', EN_END = '  /* ROLE-MIESNI:END */';
const FULL_SENS = join(root, 'data/zrodla/figury-sens.json'); export const OUT_STYKI = join(root, 'lib/figures/v2/styki.json');
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
/** Styki wymagane w pozie poprawnej (reguły sensu, bez źródeł): { rodzina: { wymagane, pomijane_gdy? } }. */
export function buildStyki(full) {
  return Object.fromEntries(Object.entries(full.styki).filter(([k]) => !k.startsWith('_')).map(([k, v]) => [k, { wymagane: v.wymagane, ...(v.pomijane_gdy ? { pomijane_gdy: v.pomijane_gdy } : {}) }]));
}
/** Funkcje wyświetlane: status „ustalone” albo „dwa_zrodla” (decyzja właściciela 26.10.2026: tylko pary z ≥ 2 źródłami). */
export const roleShown = f => f.status === 'ustalone' || f.status === 'dwa_zrodla';
/** Złożenie zdania: rola + opcjonalna faza (PL: „, faza.”, EN: „ faza.”). */
const sentence = (lang, base, phase) => base + (phase ? (lang === 'pl' ? ', ' : ' ') + phase : '') + '.';
/** Zdania i reguły roli mięśnia: { runtime, en } — en: lista [pl, en] zdań (bez duplikatów). */
export function buildRoles(full) {
  const f = {}, en = new Map();
  const need = (fid, role, variant) => {
    const fn = full.functions[fid]; if (!fn) throw new Error(`role-miesni: brak funkcji ${fid}`);
    if (!roleShown(fn)) return;
    const ph = variant === '_' ? null : full.phases[variant];
    const pl = sentence('pl', fn.pl[role], ph?.pl), e = sentence('en', fn.en[role], ph?.en);
    ((f[fid] ??= { r: fn.region, t: {} }).t[role] ??= {})[variant] = pl;
    if (en.has(pl) && en.get(pl) !== e) throw new Error(`role-miesni: dwa angielskie brzmienia dla „${pl}”`); en.set(pl, e);
  };
  const rules = full.rules.map(r => {
    for (const role of r.roles) need(r.function, role, r.phase && full.phases[r.pattern] ? r.pattern : '_');
    return { p: r.pattern, m: r.muscle, o: r.roles, f: r.function, ...(r.phase && full.phases[r.pattern] ? { ph: 1 } : {}), ...(r.requireMain ? { rm: r.requireMain } : {}), s: roleShown(full.functions[r.function]) ? 1 : 0 };
  });
  const names = full.nameRules.reguly.map(r => { for (const role of r.roles) need(r.function, role, '_'); return { x: r.exercises, m: r.muscle, o: r.roles, f: r.function, s: roleShown(full.functions[r.function]) ? 1 : 0 }; });
  for (const fid of Object.keys(full.functions)) f[fid] ??= { r: full.functions[fid].region, t: {} };
  return {
    runtime: { phases: Object.keys(full.phases), functions: f, rules, names, noRole: full.exceptions.noRole.map(x => ({ e: x.exercise, m: x.muscles })), noRegions: ['neck'] },
    en: [...en.entries()].sort((a, b) => a[0].localeCompare(b[0], 'pl')),
  };
}
const q = s => "'" + s.replace(/\\/g, '\\\\').replace(/'/g, "\\'") + "'";
export const enBlock = pairs => [EN_BEGIN, ...pairs.map(([pl, e]) => `  ${q(pl)}: ${q(e)},`), EN_END].join('\n');
/** Treść lib/i18n.en.ts z aktualnym blokiem zdań ról (znaczniki muszą istnieć). */
export function withEnBlock(src, pairs) {
  const a = src.indexOf(EN_BEGIN), b = src.indexOf(EN_END);
  if (a < 0 || b < a) throw new Error('lib/i18n.en.ts: brak znaczników ROLE-MIESNI:BEGIN/END');
  return src.slice(0, a) + enBlock(pairs) + src.slice(b + EN_END.length);
}
export const serialize = obj => JSON.stringify(obj) + '\n';

export function outputs() {
  return [
    [OUT_CUES, serialize(buildCues(JSON.parse(readFileSync(FULL_CUES, 'utf8'))))],
    [OUT_FIG, serialize(buildFigures(JSON.parse(readFileSync(FULL_FIG, 'utf8'))))],
    [OUT_STYKI, serialize(buildStyki(JSON.parse(readFileSync(FULL_SENS, 'utf8'))))],
    ...(() => { const r = buildRoles(JSON.parse(readFileSync(FULL_ROLES, 'utf8'))); return [[OUT_ROLES, serialize(r.runtime)], [EN_FILE, withEnBlock(readFileSync(EN_FILE, 'utf8'), r.en)]]; })(),
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
