// Pliki runtime wskazówek techniki i figur BEZ nazw źródeł (decyzja właściciela 25.10.2026, docs/18: „całkiem anonimowo” — nazwy organizacji, autorów, tytuły i adresy źródeł
// nie trafiają do paczki aplikacji). Jedno źródło prawdy: katalog data/zrodla (cues.json, figures.json — pełne dane ze źródłami; czytają je tylko generatory dokumentów
// scripts/cues/gen.mjs i scripts/figures/gen.mjs, ten skrypt i testy tests/zrodla-pelne-*.test.ts). Stąd generuje się pliki, które importuje aplikacja:
//   lib/cues/data.json    — { exercises: id zdań, basis: rodzaje źródeł ćwiczenia (podpis), open: klucze bez wskazówek, partial: klucze z niepełnym zestawem sekcji }
//   lib/figures/data.json — { rom: granice kątów (min/max, bez źródeł), exercises: figury, open: klucze bez figury }
// Bramka 4 (CLAUDE.md 27.10.2026, DEC-01 b; M1-audytor-generalny-005, 06-tresci-001): do lib/figures/data.json trafia tylko figura z wpisem recenzji
// w docs/research/figury-recenzja.json o werdykcie „wyswietlana” albo „zastapiona” (figura v1 ćwiczenia, które wyświetla figurę v2) i skrócie równym bieżącemu
// (figuraSkrot: figura po rozwinięciu „like” + id i polskie teksty wskazówek ćwiczenia). Figura bez wpisu, ukryta po recenzji albo zmieniona po recenzji
// trafia na listę otwartą — aplikacja jej nie rysuje, a test tests/figury-recenzja.test.tsx czerwieni verify.
// Użycie: node scripts/zrodla-runtime.mjs --write  (zapis) | --check  (verify: nieaktualny plik runtime → kod 1; wzór: scripts/cues/gen.mjs)
//         | --skroty  (bieżące skróty do wpisu recenzji: { v1: { ćwiczenie: skrót }, v2: { rodzina: skrót } })
import { fileURLToPath } from 'node:url';
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { createHash } from 'node:crypto';
import { resolve as resolveFig } from './figures/gen.mjs';

const root = fileURLToPath(new URL('..', import.meta.url));
const FULL_CUES = join(root, 'data/zrodla/cues.json'), FULL_FIG = join(root, 'data/zrodla/figures.json');
export const OUT_CUES = join(root, 'lib/cues/data.json'), OUT_FIG = join(root, 'lib/figures/data.json');
export const REVIEW = join(root, 'docs/research/figury-recenzja.json'), PL = join(root, 'lib/cues/text/pl.json');
/** Werdykty recenzji, przy których figura v1 trafia do aplikacji. */
export const SHOWN = ['wyswietlana', 'zastapiona'];
/** Pliki rigu gotowych rodzin v2 (skrót recenzji rodziny = rig + wspólny moduł rigów + warianty). */
export const V2_RIGS = { squat: 'squat.ts', bench_press: 'benchPress.ts', hinge: 'hinge.ts' };
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
/** JSON z kluczami w stałej kolejności (bez pól undefined) — podstawa skrótu. */
const stable = v => Array.isArray(v) ? `[${v.map(stable).join(',')}]` : v && typeof v === 'object' ? `{${Object.keys(v).sort().filter(k => v[k] !== undefined).map(k => `${JSON.stringify(k)}:${stable(v[k])}`).join(',')}}` : JSON.stringify(v);
const sha12 = text => createHash('sha256').update(text).digest('hex').slice(0, 12);
/** Skrót recenzowanej wersji figury v1: figura po rozwinięciu „like” (bez samego odwołania) + id wskazówek w sekcjach + ich polskie teksty. */
export function figuraSkrot(full, cues, pl, key) {
  const { like, ...f } = resolveFig(full.exercises, key) ?? {};
  const c = cues.exercises[key] ?? {};
  const sections = Object.fromEntries(['setup', 'move', 'tips', 'mistakes'].map(s => [s, (c[s] ?? []).map(r => r.c)]));
  const texts = Object.fromEntries(Object.values(sections).flat().map(id => [id, pl[id] ?? null]));
  return sha12(stable({ figura: f, wskazowki: sections, teksty: texts }));
}
/** Skrót recenzji gotowej rodziny v2 (tekst plików rigu). */
export const rodzinaSkrot = fam => sha12([`lib/figures/v2/rigs/${V2_RIGS[fam]}`, 'lib/figures/v2/rigs/common.ts', 'lib/figures/v2/variants.ts'].map(p => readFileSync(join(root, p), 'utf8')).join('\n'));
export const recenzja = () => JSON.parse(readFileSync(REVIEW, 'utf8'));
export function skroty(full = JSON.parse(readFileSync(FULL_FIG, 'utf8')), cues = JSON.parse(readFileSync(FULL_CUES, 'utf8')), pl = JSON.parse(readFileSync(PL, 'utf8'))) {
  return { v1: Object.fromEntries(Object.keys(full.exercises).map(k => [k, figuraSkrot(full, cues, pl, k)])), v2: Object.fromEntries(Object.keys(V2_RIGS).map(f => [f, rodzinaSkrot(f)])) };
}
export function buildFigures(full, rec = recenzja(), cues = JSON.parse(readFileSync(FULL_CUES, 'utf8')), pl = JSON.parse(readFileSync(PL, 'utf8'))) {
  const rom = {};
  for (const v of Object.keys(full.rom)) if (v !== 'note') rom[v] = Object.fromEntries(Object.entries(full.rom[v]).map(([j, r]) => [j, { min: r.min, max: r.max }]));
  const ok = k => { const e = rec.v1?.[k]; return !!e && SHOWN.includes(e.werdykt) && e.sha === figuraSkrot(full, cues, pl, k); };
  const exercises = Object.fromEntries(Object.entries(full.exercises).filter(([k]) => ok(k)));
  return { rom, exercises, open: [...Object.keys(full.open), ...Object.keys(full.exercises).filter(k => !ok(k))] };
}
export const serialize = obj => JSON.stringify(obj) + '\n';

export function outputs() {
  return [
    [OUT_CUES, serialize(buildCues(JSON.parse(readFileSync(FULL_CUES, 'utf8'))))],
    [OUT_FIG, serialize(buildFigures(JSON.parse(readFileSync(FULL_FIG, 'utf8'))))],
  ];
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  if (process.argv.includes('--skroty')) { console.log(JSON.stringify(skroty(), null, 1)); process.exit(0); }
  const check = process.argv.includes('--check');
  if (!check && !process.argv.includes('--write')) { console.error('użycie: node scripts/zrodla-runtime.mjs --write | --check | --skroty'); process.exit(2); }
  let bad = 0;
  for (const [file, text] of outputs()) {
    if (check) { if (!existsSync(file) || readFileSync(file, 'utf8') !== text) { console.error(`nieaktualny: ${file.slice(root.length)} — uruchom node scripts/zrodla-runtime.mjs --write (figura zmieniona po recenzji bramki 4 wypada z pliku: nowa recenzja i skrót w docs/research/figury-recenzja.json)`); bad = 1; } }
    else { writeFileSync(file, text); console.log(`zapisano ${file}`); }
  }
  process.exit(bad);
}
