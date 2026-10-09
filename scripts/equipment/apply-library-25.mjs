// Wdrożenie researchu biblioteki ćwiczeń (docs/research/25-biblioteka/L1…L6.json, decyzja właściciela 09.10.2026 ok. 00:10 — docs/18, wariant B)
// do źródła prawdy katalogu: docs/research/equipment/catalog.json. Jednorazowe przekształcenie (wynik w repozytorium), zapisane jako skrypt,
// żeby dało się je sprawdzić i powtórzyć na danych sprzed zmiany (git show a5e7ca9:docs/research/equipment/catalog.json).
//   node scripts/equipment/apply-library-25.mjs            — przekształca catalog.json i zapisuje krok danych użytkownika (catalog-step-2026-10-09.json)
// Potem: node scripts/equipment/gen.mjs (lib/catalog.generated.ts). Ćwiczenia bazowe (125, lib/seed.ts: LIB_BASE, MUSCLES_BY_NAME, METRIC_BY_NAME,
// LOAD_MODE_BY_NAME) mają partie, grupę, metrykę i tryb w kodzie — skrypt tylko wypisuje dla nich zmiany do wprowadzenia (i zapisuje je w kroku danych);
// zgodność kodu z researchem sprawdza test tests/catalog-library25.test.ts (każdy rekord wdrożony albo w jawnym wyjątku z powodem).
import { fileURLToPath } from 'node:url';
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const root = fileURLToPath(new URL('../..', import.meta.url));
const SRC = join(root, 'docs/research/equipment/catalog.json');
const STEP = join(root, 'docs/research/equipment/catalog-step-2026-10-09.json');
export const STEP_REV = 'katalog-2026-10-09';

/** Wartości ćwiczeń bazowych SPRZED zmiany (lib/seed.ts w a5e7ca9; partie — docs/research/24-przypisanie-partii.json „current”) — „from” w kroku danych. */
const BASE_OLD = {
  'Deadlift (sztanga)': { muscles: ['plecy', 'dwugłowe'], secondaryMuscles: ['pośladki', 'czworogłowe'] },
  'Deadlift (hantle)': { muscles: ['plecy', 'dwugłowe'], secondaryMuscles: ['pośladki'] },
  'Trap Bar Deadlift': { muscles: ['czworogłowe', 'plecy'], secondaryMuscles: ['pośladki', 'dwugłowe'] },
  'Back Extension': { muscles: ['plecy'], secondaryMuscles: ['pośladki', 'dwugłowe'] },
  'Back Squat': { secondaryMuscles: ['pośladki', 'dwugłowe'] },
  'Leg Press': { secondaryMuscles: ['pośladki'] },
  'Bulgarian Split Squat (hantle)': { secondaryMuscles: ['dwugłowe'] },
  'Hip Thrust (sztanga)': { secondaryMuscles: ['dwugłowe'] },
  'Hip Thrust (hantel)': { secondaryMuscles: ['dwugłowe'] },
  'Glute Bridge': { secondaryMuscles: ['dwugłowe'] },
  'Concentration Curl (hantle)': { loadMode: 'per_dumbbell' },
  'Triceps Kickback': { loadMode: 'per_dumbbell' },
  'Pallof Press': { loadMode: 'total' },
  'Box Jump': { group: 'cardio', muscles: [], secondaryMuscles: [] },
  "Farmer's Walk": { metric: 'weight_time' },
  'Suitcase Carry': { metric: 'weight_time' },
};
/** Pola kopiowane do ćwiczenia użytkownika przy tworzeniu (zmiana katalogu → krok danych „from → to”, tylko gdy użytkownik ich nie zmienił). */
const USER_FIELDS = ['group', 'metric', 'loadMode', 'bandAssistable', 'muscles', 'secondaryMuscles'];
/** Pola katalogu sprzętowego (odświeżane w danych użytkownika przez catalogRev). */
const CATALOG_FIELDS = ['requires', 'recommended', 'pattern', 'cables', 'muscleLoad', 'note', 'loadSource', 'unmapped'];

/**
 * Zmiany wynikające z rozstrzygnięć pytań otwartych (docs/18, 09.10.2026 ok. 00:10), których rekordy researchu nie zawierają wprost.
 * Każda z powodem — test catalog-library25 sprawdza je tak samo jak poprawki z rekordów.
 */
export const DECISION_FIXES = [
  /* L5 Q1 A: warianty z kettlebell scalone z wiosłowaniem / floor pressem hantlami → kettlebell jako drugi przyrząd */
  ...['One Arm Row (hantle)', 'Bent Over Row (hantle)', 'Floor Press (hantle)'].map(name => ({ name, why: 'L5 Q1 A — scalone warianty z kettlebell: kettlebell jako drugi przyrząd', set: e => ({ requires: e.requires.map(g => g.includes('db') && !g.includes('kb') ? [...g, 'kb'] : g) }) })),
  /* L1 Q1 A / L2 Q4: ćwiczenia przedramion w grupie „biceps” do czasu porządkowania sekcji */
  ...['Wrist Curl (hantle)', 'Reverse Wrist Curl (hantle)'].map(name => ({ name, why: 'L1 Q1 A — przedramiona w grupie „biceps” do czasu porządkowania sekcji', set: () => ({ group: 'biceps' }) })),
  /* docs/research/24 Q1 B (decyzja 09.10.2026: pytania produktowe — rekomendacje): przywodziciele pomocnicze tam, gdzie wzrost zmierzono (Kubo 2019,
   * Plotkin 2023 — przysiad; Kinoshita 2026 — suwnica); warianty przysiadu — dopiero po decyzji o analogii (Q-L4-5, otwarte) */
  { name: 'Back Squat', why: 'docs/24 Q1 B — przywodziciele pomocnicze (wzrost zmierzony: S1, S2)', set: () => ({ secondaryMuscles: ['pośladki', 'przywodziciele'] }) },
  { name: 'Leg Press', why: 'docs/24 Q1 B — przywodziciele pomocnicze (wzrost zmierzony: S3)', set: () => ({ secondaryMuscles: ['pośladki', 'przywodziciele'] }) },
  /* L5 Q7: brakujący sprzęt w słowniku — ściana (ćwiczenia, których definicją jest ściana), maszyna do dipów */
  ...['Handstand Push Up', 'Wall Sit', 'Calf Stretch Hands Against Wall', 'One Arm Against Wall', 'Wall Ball'].map(name => ({ name, why: 'L5 Q7 — ściana w słowniku sprzętu (ćwiczenie wykonywane przy ścianie)', set: e => ({ requires: [...e.requires.filter(g => !g.includes('wall')), ['wall']] }) })),
  /* L2 Q1/Q2/Q5 (decyzja: do czasu dodania regionu — bez partii głównej, z oznaczeniem): mięsień docelowy spoza mapy */
  ...['External Rotation (hantel)', 'External Rotation (linki)', 'External Rotation with Band', 'Internal Rotation with Band', 'Cable Internal Rotation'].map(name => ({ name, why: 'L2 Q1 A — stożek rotatorów poza mapą mięśni: oznaczenie', set: () => ({ unmapped: 'rotator_cuff' }) })),
  ...['Barbell Incline Shoulder Raise', 'Dumbbell Incline Shoulder Raise', 'Smith Incline Shoulder Raise'].map(name => ({ name, why: 'L2 Q2 A — zębaty przedni poza mapą mięśni: oznaczenie', set: () => ({ unmapped: 'serratus_anterior' }) })),
  { name: 'Hip Flexion with Band', why: 'L2 (zasada jak Q1/Q2) — zginacze biodra poza mapą mięśni: bez partii głównej, z oznaczeniem', set: () => ({ unmapped: 'hip_flexors' }) },
  { name: 'Smith Machine Reverse Calf Raises', why: 'L2 Q5 A — piszczelowy przedni poza mapą mięśni: bez partii i obciążenia, z oznaczeniem', set: () => ({ unmapped: 'tibialis_anterior' }) },
  { name: 'Dip Machine', why: 'L5 Q7 — maszyna do dipów w słowniku (dotąd zmapowana na maszynę do tricepsa)', set: () => ({ requires: [['dip_machine']] }) },
  /* L3 Q2 (a) i L6 Q-L6-3 B: miara ciężar + dystans dla noszenia i sanek (ACE Farmer's Carry: „walk a specified, pre-determined distance”;
   * Hindle 2021: „over a set distance as quickly as possible”; sanki: „zadaje się dystans z ciężarem”) */
  ...["Farmer's Walk", 'Suitcase Carry', 'Overhead Carry (hantle)', 'Double Kettlebell Front Rack Carry', "Farmer's Walk (trap bar)", "Farmer's Walk (Farmers Handles)", 'Rickshaw Carry', 'Yoke Walk', "Conan's Wheel",
    'Sled Push', 'Sled Forward Drag with Press', 'Sled Overhead Backward Walk', 'Backward Drag', 'Sled Drag (Harness)', 'Bear Crawl Sled Drag']
    .map(name => ({ name, why: 'L3 Q2 (a), L6 Q-L6-3 — noszenie i sanki mierzone dystansem z ciężarem: miara ciężar + dystans', set: () => ({ metric: 'weight_distance' }) })),
];

export function loadResearch() {
  const out = [];
  for (let n = 1; n <= 6; n++) for (const r of JSON.parse(readFileSync(join(root, `docs/research/25-biblioteka/L${n}.json`), 'utf8'))) out.push({ ...r, part: `L${n}` });
  return out;
}

export function apply(catalog, research) {
  const byName = new Map(catalog.map(e => [e.name, e]));
  const renamed = {}, merged = {}, removed = [], fieldFixes = [], baseChanges = [];
  const isBase = e => e.group === undefined;
  /* audyt kontrolny 1 (DAT2-01): „dawna” wartość z KOPII katalogu sprzed zmian — wcześniej old() zwracał zmieniany obiekt i poprawki pól ćwiczeń
   * niebazowych z rekordów researchu wypadały z kroku (dawna = nowa); decyzje po rekordzie też biorą wartość sprzed obu zmian */
  const orig = new Map(catalog.map(e => [e.name, JSON.parse(JSON.stringify(e))]));
  const old = name => { const e = orig.get(name); return isBase(e) ? BASE_OLD[name] ?? {} : e; };
  const fix = (name, field, from, to) => { const i = fieldFixes.findIndex(f => f.name === name && f.field === field); if (i >= 0) fieldFixes.splice(i, 1); if (JSON.stringify(from) !== JSON.stringify(to)) fieldFixes.push({ name, field, from, to }); }; /* ta sama zmiana z rekordu i decyzji — jedna poprawka (dawna → końcowa) */
  for (const r of research) {
    const e = byName.get(r.name); if (!e) throw new Error('brak w katalogu: ' + r.name);
    if (r.verdict === 'USUNĄĆ') { removed.push(r.name); byName.delete(r.name); continue; }
    if (r.verdict === 'SCALIĆ') { merged[r.name] = r.mergeInto; byName.delete(r.name); continue; }
    for (const [k, v] of Object.entries(r.fixes)) {
      if (k === 'name') continue;
      if (USER_FIELDS.includes(k)) { if (isBase(e)) baseChanges.push([r.name, k, v]); else e[k] = v; fix(r.name, k, old(r.name)[k], v); }
      else if (CATALOG_FIELDS.includes(k)) e[k] = v;
      else throw new Error('nieznane pole poprawki ' + k + ' w ' + r.name);
    }
    e.research = { part: r.part, confidence: r.confidence, sources: r.sources };
    if (r.scope === 'NISZOWE') e.scope = 'niche'; else delete e.scope;
  }
  for (const d of DECISION_FIXES) {
    const e = byName.get(d.name); if (!e) throw new Error('decyzja: brak ' + d.name);
    for (const [k, v] of Object.entries(d.set(e))) {
      if (USER_FIELDS.includes(k)) { if (isBase(e)) baseChanges.push([d.name, k, v]); else e[k] = v; fix(d.name, k, old(d.name)[k], v); }
      else e[k] = v;
    }
  }
  /* zmiany nazw na końcu — klucze kroku danych i odwołania scaleń po nazwie końcowej */
  for (const r of research) if (r.fixes.name && byName.has(r.name)) { const e = byName.get(r.name); renamed[r.name] = r.fixes.name; e.name = r.fixes.name; }
  const final = n => renamed[n] ?? n;
  const names = new Set([...byName.values()].map(e => e.name));
  for (const k of Object.keys(merged)) { merged[k] = final(merged[k]); if (!names.has(merged[k])) throw new Error('scalenie do nieistniejącego: ' + k + ' → ' + merged[k]); }
  fieldFixes.forEach(f => { f.name = final(f.name); });
  const keep = new Set(byName.values()); const out = catalog.filter(e => keep.has(e));
  return { catalog: out, step: { rev: STEP_REV, renamed, merged, removed, fieldFixes }, baseChanges };
}

const isMain = process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1];
if (isMain) {
  const { catalog, step, baseChanges } = apply(JSON.parse(readFileSync(SRC, 'utf8')), loadResearch());
  writeFileSync(SRC, JSON.stringify(catalog, null, 1)); writeFileSync(STEP, JSON.stringify(step, null, 1) + '\n');
  console.log(`catalog.json: ${catalog.length} ćwiczeń; zmiany nazw ${Object.keys(step.renamed).length}, scalenia ${Object.keys(step.merged).length}, usunięcia ${step.removed.length}, poprawki pól danych ${step.fieldFixes.length}`);
  console.log('Ćwiczenia bazowe — do wprowadzenia w lib/seed.ts:'); for (const c of baseChanges) console.log('  ' + JSON.stringify(c));
}
