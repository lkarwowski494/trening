// Arkusz recenzji ruchu z NAKŁADKĄ techniki (04.11.2026; L-050): kadry co 0,05 (u = 0 … 1, 21 kadrów) w każdym rzucie figury v2: sylwetka + ślad toru ciężaru (trailFor) + linie odniesienia + elementy nakładki
// (te same funkcje co aplikacja: guidesOf/techniquesOf z doboru po kartach, bez bramki recenzji kart; overlayShapes). Podpis kadru: kąt mierzonego stawu (measuredAngle) i odstęp ciężaru od nóg/tułowia.
// Każde ćwiczenie ma też arkusz dla każdej pozy błędu (kolor elementu złamanej reguły). Użycie: node scripts/figures/arkusz-nakladka.mjs --out <katalog> --family olympic [--family triceps] [--key "Power Clean"] [--theme light|dark] [--cols 7]
// PNG powstaje, gdy dostępny jest playwright (NODE_PATH=/opt/node-tools/node_modules); bez niego tylko HTML z osadzonym SVG. Wyniki nie trafiają do repozytorium.
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { appRequire } from '../strona/ts-loader.mjs';
import { wskazowkiSurowe } from '../skrot-v2-dobor.mjs';

const args = process.argv.slice(2); const arg = (n, d) => { const i = args.indexOf('--' + n); return i >= 0 ? args[i + 1] : d; };
const multi = n => args.flatMap((a, i) => a === '--' + n ? [args[i + 1]] : []);
const families = multi('family'); const keysArg = multi('key');
if (!families.length && !keysArg.length) { console.error('Podaj --family <rodzina> albo --key "<ćwiczenie>"'); process.exit(1); }
const out = path.resolve(arg('out', 'arkusze')); fs.mkdirSync(out, { recursive: true });
const rq = appRequire(); const fam = rq('lib/figures/v2/families.ts'), fg = rq('lib/figures/v2/figure.ts'), ui = rq('lib/figures/v2/ui.ts'), gd = rq('lib/figures/v2/guides.ts'), ov = rq('lib/figures/v2/overlay.ts'), os = rq('lib/figures/v2/overlayShapes.ts'), rn = rq('lib/figures/v2/render.ts'), pal0 = rq('lib/figures/v2/palette.ts'), tokens = rq('lib/tokens.ts');
const all = fam.assignAll(); const theme = arg('theme', 'light'); const cols = Number(arg('cols', 7)); const th = tokens[theme];
const pal = pal0.figurePalette(th);
const keys = [...new Set([...families.flatMap(f => Object.keys(all).filter(k => all[k] === f).sort()), ...keysArg])];
const U = Array.from({ length: 21 }, (_, i) => +(i / 20).toFixed(2));
const pages = [], lista = [];
for (const key of keys) {
  let spec = null; try { spec = fg.figureSpec(key); } catch { spec = null; } if (!spec) { console.error('Brak figury v2:', key); continue; }
  const { ids, errs } = wskazowkiSurowe(key); const guides = gd.guidesFor(ids); const tech = ov.techniquesFor(spec.family, ids, key).map(d => d.id);
  const errors = ui.errorsOf(spec, errs); lista.push({ key, family: spec.family, views: spec.views, elementy: tech, linie: guides, bledy: errors.map(e => [e.error, e.cue]) });
  for (const view of spec.views) for (const err of [undefined, ...errors.filter(e => fg.errorDefOf(spec, e.error)?.kind === 'pose').map(e => e.error)]) {
    const box = fg.boxFor(spec, view, err ? [err] : []); const trail = fg.trailFor(spec, view); const cells = [];
    for (const u of U) {
      const m = fg.measuredAngle(spec, u);
      const shapes = [...fg.shapesAt(spec, u, view, false, err), ...trail, ...os.guideShapes(spec, u, view, guides, err), ...os.overlayShapes(spec, u, view, tech, err, guides)];
      cells.push(`<div style="padding:4px;break-inside:avoid"><div style="font:11px monospace;color:${th.text}">u=${u.toFixed(2)} · ${m.joint} ${m.deg.toFixed(0)}°</div>${rn.svgDocument(shapes, box, pal, 1.5)}</div>`);
    }
    const name = (key.replace(/\W+/g, '-') + '-' + view + (err ? '-' + err.replace(/\W+/g, '-') : '')).replace(/-+/g, '-');
    pages.push({ name, html: `<html><body style="margin:0;background:${th.surface}"><div style="font:14px sans-serif;padding:8px;color:${th.text}">${key} — rzut: ${view}${err ? ', poza błędu: ' + err : ''}; elementy: ${tech.join(', ') || 'brak'}; linie: ${guides.join(', ') || 'brak'}; kadry co 0,05, ślad toru (przerywana), nakładka (ciągła, łuk)</div><div style="display:grid;grid-template-columns:repeat(${cols},1fr);gap:2px;padding:4px">${cells.join('')}</div></body></html>` });
  }
}
for (const p of pages) fs.writeFileSync(path.join(out, `${p.name}.html`), p.html);
fs.writeFileSync(path.join(out, 'cwiczenia.json'), JSON.stringify(lista, null, 1));
try {
  const { chromium } = createRequire(import.meta.url)('playwright');
  const b = await chromium.launch(); const pg = await b.newPage({ viewport: { width: Number(arg('width', 2100)), height: 900 } });
  for (const p of pages) { await pg.setContent(p.html); await pg.screenshot({ path: path.join(out, `${p.name}.png`), fullPage: true }); }
  await b.close(); console.log(`PNG: ${pages.length} arkuszy w ${out}`);
} catch (e) { console.log('Bez PNG (brak playwright):', e.message.split('\n')[0], `— HTML: ${pages.length} plików w ${out}`); }
process.exit(0);
