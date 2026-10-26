// Generator danych i dokumentu figur v2 (wzór: scripts/figures/gen.mjs). Użycie: node scripts/figures/v2-gen.mjs [--write | --check]
//  - lib/figures/v2/muscles.generated.ts — muscleLoad i pewność z docs/research/equipment/catalog.json (709 ćwiczeń; nie z makiety)
//  - docs/51-figury-v2-pokrycie.md — rodziny ruchu, liczba ćwiczeń, stan i szacunek pracy, lista ćwiczeń na rodzinę
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadV2 } from './v2-build.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const write = process.argv.includes('--write'); const check = process.argv.includes('--check');
if (!write && !check) { console.log('Użycie: node scripts/figures/v2-gen.mjs --write | --check'); process.exit(1); }

const cat = JSON.parse(fs.readFileSync(path.join(root, 'docs/research/equipment/catalog.json'), 'utf8'));
const lines = [];
lines.push('/* AUTOMATYCZNIE WYGENEROWANE przez scripts/figures/v2-gen.mjs z docs/research/equipment/catalog.json (muscleLoad, research.confidence) — nie edytować ręcznie.');
lines.push(' * Udział mięśnia w ćwiczeniu: 1 = główny, 0,5 = pomocniczy, 0,25 = mały udział. Pewność: pole research.confidence katalogu (np. „mocne”, „umiarkowane”, „jedno źródło”, „brak źródła — uproszczenie”). */');
lines.push("import type { MuscleId } from './muscles';");
lines.push('export type MuscleEntry = { load: Partial<Record<MuscleId, number>>; confidence: string };');
lines.push('export const MUSCLE_DATA: Readonly<Record<string, MuscleEntry>> = {');
for (const e of [...cat].sort((a, b) => a.name.localeCompare(b.name, 'en'))) {
  const load = Object.entries(e.muscleLoad ?? {}).sort(([a], [b]) => a.localeCompare(b)).map(([k, v]) => `${k}:${v}`).join(',');
  lines.push(`  ${JSON.stringify(e.name)}: {load:{${load}},confidence:${JSON.stringify(e.research?.confidence ?? 'brak')}},`);
}
lines.push('};', '');
const musclesTs = lines.join('\n');

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'v2gen-'));
const { v2 } = loadV2(tmp);
const assign = v2.assignAll(); const by = {}; for (const [k, f] of Object.entries(assign)) (by[f] ??= []).push(k);
const ready = v2.FAMILIES.filter(f => f.status === 'ready'); const planned = v2.FAMILIES.filter(f => f.status !== 'ready');
const total = Object.keys(assign).length; const withFig = k => !!v2.figureSpec(k); const nFig = fam => (by[fam] ?? []).filter(withFig).length; const nReady = ready.reduce((s, f) => s + nFig(f.id), 0);
const md = [];
md.push('# 51 — Figury v2: rodziny ruchu i pokrycie ćwiczeń (generowane)', '');
md.push('AUTOMATYCZNIE WYGENEROWANE przez `scripts/figures/v2-gen.mjs` z `lib/figures/v2/families.ts` i katalogu `lib/catalog.generated.ts` — nie edytować ręcznie.');
md.push('Sprawdzanie: `node scripts/figures/v2-gen.mjs --check` (część `npm run check:figures-v2`). Projekt i zasady: `docs/50-figury-v2.md`.', '');
md.push(`Ćwiczeń w katalogu: **${total}**; rodzin ruchu: **${v2.FAMILIES.length}** (gotowe: ${ready.length}, do zrobienia: ${planned.length}); ćwiczeń z gotową figurą: **${nReady}** (${(100 * nReady / total).toFixed(1).replace('.', ',')}%).`, '');
md.push('## Rodziny', '', '| Rodzina | Stan | Ćwiczeń | Widoki | Szacunek pracy agenta (h) | Opis |', '|---|---|---|---|---|---|');
for (const f of v2.FAMILIES) md.push(`| \`${f.id}\` | ${f.status === 'ready' ? 'gotowa' : 'do zrobienia'} | ${by[f.id]?.length ?? 0} | ${f.views.join(', ')} | ${f.status === 'ready' ? '—' : f.effort} | ${f.label}${f.note ? ' — ' + f.note : ''} |`);
const sumEffort = planned.reduce((s, f) => s + f.effort, 0); const sumEx = planned.reduce((s, f) => s + (by[f.id]?.length ?? 0), 0);
md.push('', `Razem do zrobienia: ${planned.length} rodzin, ${sumEx} ćwiczeń, ok. **${sumEffort} h pracy agenta** (rig + testy geometrii + przegląd zrzutów; bez czekania na CI i bez czasu właściciela).`, '');
const partial = ready.filter(f => (by[f.id] ?? []).some(k => !withFig(k)));
if (partial.length) { md.push('## Gotowe rodziny: ćwiczenia bez figury v2 (brak pozy w danych — v1 albo brak)', ''); for (const f of partial) md.push(`- \`${f.id}\` (z figurą ${nFig(f.id)} z ${by[f.id].length}): ${by[f.id].filter(k => !withFig(k)).sort((a, b) => a.localeCompare(b, 'en')).join('; ')}`); md.push(''); }
md.push('## Ćwiczenia według rodzin', '');
for (const f of v2.FAMILIES) { md.push(`### ${f.id} (${by[f.id]?.length ?? 0}) — ${f.status === 'ready' ? 'gotowa' : 'do zrobienia'}`, '', (by[f.id] ?? []).sort((a, b) => a.localeCompare(b, 'en')).join('; '), ''); }
const mdText = md.join('\n');
fs.rmSync(tmp, { recursive: true, force: true });

const targets = [[path.join(root, 'lib/figures/v2/muscles.generated.ts'), musclesTs], [path.join(root, 'docs/51-figury-v2-pokrycie.md'), mdText]];
let bad = 0;
for (const [f, text] of targets) {
  if (write) { fs.writeFileSync(f, text); console.log('zapisano', path.relative(root, f)); }
  else if (!fs.existsSync(f) || fs.readFileSync(f, 'utf8') !== text) { console.log('NIEAKTUALNE:', path.relative(root, f), '— uruchom: node scripts/figures/v2-gen.mjs --write'); bad++; }
}
if (check) { console.log(bad ? 'figury v2: różnice' : 'figury v2: aktualne'); process.exit(bad ? 1 : 0); }
