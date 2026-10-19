#!/usr/bin/env node
// Podział scenariuszy Maestro na części (maszyny) dla e2e-ios.yml — deterministyczny i zrównoważony czasowo.
//   node scripts/ci/e2e-shards.mjs plan  [--dir .maestro] [--config scripts/ci/e2e-shards.json]   → JSON z całym podziałem (do testów i podglądu)
//   node scripts/ci/e2e-shards.mjs czesc N [--out .maestro-czesc] [--dir ...] [--config ...]      → przygotowuje katalog części N (1..czesci)
// Wejście środowiska ONLY ("31 35") = wejście workflow „tylko_scenariusze” (puste = wszystkie). Podział liczy się ZAWSZE dla pełnego zestawu,
// dopiero potem jest filtrowany — numer części scenariusza nie zależy od tego, co wybrano.
// Pakiet (decyzja właściciela 19.10.2026): PAKIET=podstawowy (domyślnie; też gdy puste) = tylko scenariusze z scripts/ci/e2e-podstawowy.json na `czesci_podstawowy` maszynach;
// PAKIET=pelny = wszystkie (podział na `czesci`). ONLY (wejście „tylko_scenariusze”) ma pierwszeństwo przed pakietem i nie zmienia numeru części scenariusza.
// Wyjście dla workflow ($GITHUB_OUTPUT): main (true/false — są scenariusze zwykłe), update (true/false — ta część robi test aktualizacji), any.
// Algorytm: największe obciążenie najpierw (LPT) na najmniej obciążoną część; remisy wg nazwy pliku i numeru części. Scenariusze z tagiem
// `aktualizacja` (33–34) tworzą jedną niepodzielną grupę — uruchamia ją jedna część (krok „Aktualizacja”), po zwykłych scenariuszach.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');

export function readConfig(file) { return JSON.parse(fs.readFileSync(file, 'utf8')); }

/** Scenariusz z tagiem `eksperyment` (katalog przepływów, docs/38 pkt 5): jeszcze nie sprawdzony na symulatorze — NIE wchodzi do podziału na części, idzie osobnym, niewiążącym zadaniem. */
export const isExperiment = (dir, f) => /^tags:\n\s+- eksperyment\s*$/m.test(fs.readFileSync(path.join(dir, f), 'utf8'));

export function scenarioFiles(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).filter(e => e.isFile() && /^[^.].*\.yaml$/.test(e.name) && e.name !== 'config.yaml')
    .map(e => e.name).filter(f => !isExperiment(dir, f)).sort();
}

export const isUpdateFlow = (dir, f) => /^tags:\n\s+- aktualizacja\s*$/m.test(fs.readFileSync(path.join(dir, f), 'utf8'));

/** Numery scenariuszy pakietu podstawowego (scripts/ci/e2e-podstawowy.json) → nazwy plików; 33 i 34 (grupa aktualizacji) zawsze razem. */
export function pakietFiles(dir, list, spec) {
  const nums = new Set(spec.scenariusze);
  return list.filter(f => nums.has(f.slice(0, f.indexOf('-'))));
}

export function buildPlan(dir, cfg, opt = {}) {
  const files = opt.files ?? scenarioFiles(dir);
  const czesci = opt.czesci ?? cfg.czesci;
  const w = f => cfg.wagi_s[f] ?? cfg.domyslna_waga_s;
  const upd = files.filter(f => isUpdateFlow(dir, f));
  const items = files.filter(f => !upd.includes(f)).map(f => ({ files: [f], weight: w(f) }));
  if (upd.length) items.push({ files: upd, weight: upd.reduce((s, f) => s + w(f), 0) + cfg.narzut_aktualizacji_s, update: true });
  items.sort((a, b) => b.weight - a.weight || a.files[0].localeCompare(b.files[0]));
  const parts = Array.from({ length: czesci }, (_, i) => ({ czesc: i + 1, files: [], update: [], waga_s: 0 }));
  for (const it of items) {
    const p = parts.reduce((m, x) => (x.waga_s < m.waga_s ? x : m), parts[0]);
    (it.update ? p.update : p.files).push(...it.files); p.waga_s += it.weight;
  }
  for (const p of parts) { p.files.sort(); p.update.sort(); }
  return parts;
}

// „31 35” → filtr po numerach (całe słowa); 33 lub 34 wybiera grupę aktualizacji
export function selectFiles(list, only) {
  const nums = (only || '').split(/\s+/).filter(Boolean);
  if (!nums.length) return list;
  return list.filter(f => nums.includes(f.slice(0, f.indexOf('-'))));
}

function arg(name, def) { const i = process.argv.indexOf(name); return i > 0 ? process.argv[i + 1] : def; }

function main() {
  const cmd = process.argv[2];
  const dir = path.resolve(arg('--dir', path.join(root, '.maestro')));
  const cfg = readConfig(path.resolve(arg('--config', path.join(root, 'scripts/ci/e2e-shards.json'))));
  const only = process.env.ONLY || '';
  const pakiet = only.trim() ? 'wybrane' : (process.env.PAKIET || 'podstawowy');
  if (!['podstawowy', 'pelny', 'wybrane'].includes(pakiet)) { console.error(`Pakiet musi być „podstawowy” albo „pelny” (jest: ${pakiet})`); process.exit(2); }
  const spec = JSON.parse(fs.readFileSync(path.resolve(arg('--pakiet', path.join(root, 'scripts/ci/e2e-podstawowy.json'))), 'utf8'));
  /* pakiet podstawowy: plan liczony na jego zestawie i `czesci_podstawowy` maszynach (zrównoważony, krótki); pełny i wybrane: pełny podział (numer części nie zależy od wyboru) */
  const parts = pakiet === 'podstawowy' ? buildPlan(dir, cfg, { files: pakietFiles(dir, scenarioFiles(dir), spec), czesci: cfg.czesci_podstawowy }) : buildPlan(dir, cfg);
  if (cmd === 'plan') { console.log(JSON.stringify(buildPlan(dir, cfg), null, 2)); return; }
  if (cmd === 'plan-podstawowy') { console.log(JSON.stringify(buildPlan(dir, cfg, { files: pakietFiles(dir, scenarioFiles(dir), spec), czesci: cfg.czesci_podstawowy }), null, 2)); return; }
  if (cmd !== 'czesc') { console.error('Użycie: e2e-shards.mjs plan | czesc N'); process.exit(2); }
  const n = Number(process.argv[3]);
  if (!Number.isInteger(n) || n < 1 || n > cfg.czesci) { console.error(`Numer części musi być od 1 do ${cfg.czesci} (jest: ${process.argv[3]})`); process.exit(2); }
  const all = parts.flatMap(p => [...p.files, ...p.update]);
  const unknown = only.split(/\s+/).filter(Boolean).filter(x => !selectFiles(all, x).length);
  if (unknown.length) console.log(`::warning::Wybrane numery bez scenariusza: ${unknown.join(' ')}`);
  const mine = parts[n - 1] ?? { files: [], update: [], waga_s: 0 }; /* pakiet podstawowy ma mniej części niż macierz workflow — nadmiarowe maszyny kończą od razu (any=false) */
  const main = selectFiles(mine.files, only), update = selectFiles(mine.update, only);
  const out = path.resolve(arg('--out', '.maestro-czesc'));
  fs.rmSync(out, { recursive: true, force: true }); fs.mkdirSync(out, { recursive: true });
  if (main.length) {
    fs.cpSync(path.join(dir, 'subflows'), path.join(out, 'subflows'), { recursive: true });
    for (const f of main) fs.copyFileSync(path.join(dir, f), path.join(out, f));
  }
  console.log(`Pakiet: ${pakiet}. Część ${n}/${parts.length}: ${main.length} scenariuszy zwykłych${update.length ? ' + test aktualizacji' : ''} (waga części ok. ${Math.round(mine.waga_s / 60)} min)`);
  for (const f of main) console.log(`  ${f}`);
  for (const f of update) console.log(`  ${f} (krok „Aktualizacja”)`);
  const o = { main: main.length > 0, update: update.length > 0 };
  const lines = [`main=${o.main}`, `update=${o.update}`, `any=${o.main || o.update}`];
  if (process.env.GITHUB_OUTPUT) fs.appendFileSync(process.env.GITHUB_OUTPUT, lines.join('\n') + '\n');
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main();
