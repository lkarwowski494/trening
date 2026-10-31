// Arkusz recenzji ruchu z nałożonym śladem toru ciężaru (L-050, L-056 A): kadry co 0,05 (u = 0 … 1, 21 kadrów) w każdym widoku figury v2, z linią śladu (trailFor)
// i z odstępem ciężaru od nóg/tułowia w podpisie kadru (ta sama miara co tests/helpers/styk-figur.ts, powierzchnia nogi jak na rysunku).
// Użycie: node scripts/figures/arkusz-slad.mjs --out <katalog> --key "Deadlift (sztanga)" [--key "..."] [--theme light|dark] [--cols 7]
// PNG powstaje, gdy dostępny jest playwright (NODE_PATH=/opt/node-tools/node_modules); bez niego tylko HTML z osadzonym SVG. Wyniki nie trafiają do repozytorium.
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { loadV2 } from './v2-build.mjs';

const args = process.argv.slice(2); const arg = (n, d) => { const i = args.indexOf('--' + n); return i >= 0 ? args[i + 1] : d; };
const keys = args.flatMap((a, i) => a === '--key' ? [args[i + 1]] : []);
if (!keys.length) { console.error('Podaj co najmniej jedno --key "<ćwiczenie>"'); process.exit(1); }
const out = path.resolve(arg('out', 'arkusze')); fs.mkdirSync(out, { recursive: true });
const tmp = fs.mkdtempSync(path.join(out, '.build-'));
const { v2, tokens } = loadV2(tmp);
const theme = arg('theme', 'light'); const cols = Number(arg('cols', 7)); const pal = v2.figurePalette(tokens[theme]);
const U = Array.from({ length: 21 }, (_, i) => +(i / 20).toFixed(2));

/** Odstęp ciężaru od nóg (powierzchnia jak na rysunku) i tułowia, cm; ujemny = przenikanie. */
function odstep(f) {
  const eq = v2.equipColliders(f.props).filter(c => c.k === 'capsule' && /^(bar|db|kb)/.test(c.id));
  const items = eq.length ? eq.map(c => ({ a: c.a, b: c.b, r: c.r })) : (() => { const c = f.info.load; const h = Math.min(Math.abs(f.sk.arms.R.grip[2]), Math.abs(f.sk.arms.L.grip[2])); return [{ a: [c[0], c[1], -h], b: [c[0], c[1], h], r: 2 }]; })();
  let m = Infinity;
  for (const it of items) {
    for (const s of v2.SIDES) { const L = f.sk.legs[s]; for (const [seg, a, b] of [['thigh', L.hip, L.knee], ['shank', L.knee, L.ankle]])
      for (let i = 0; i <= 40; i++) { const t = i / 40; const q = [0, 1, 2].map(j => a[j] + (b[j] - a[j]) * t); m = Math.min(m, v2.distSegSeg(q, q, it.a, it.b) - it.r - v2.legRadius(seg, t)); } }
    m = Math.min(m, v2.distSegSeg(f.sk.pelvis, f.sk.shoulderC, it.a, it.b) - it.r - v2.GIRTH.trunkCollide, v2.distSegSeg(f.sk.pelvis, f.sk.pelvis, it.a, it.b) - it.r - v2.GIRTH.pelvis);
  }
  return m;
}

const pages = [];
for (const key of keys) {
  const spec = v2.figureSpec(key); if (!spec) { console.error('Brak figury v2:', key); continue; }
  for (const view of spec.views) {
    const box = v2.boxFor(spec, view); const trail = v2.trailFor(spec, view); const cells = [];
    for (const u of U) {
      const f = v2.frameAt(spec, u); const g = odstep(f);
      const svg = v2.svgDocument([...v2.shapesAt(spec, u, view, false), ...trail], box, pal, 1.5);
      cells.push(`<div style="padding:4px;break-inside:avoid"><div style="font:11px monospace;color:${tokens[theme].text}">u=${u.toFixed(2)} · odstęp ${g.toFixed(1)} cm</div>${svg}</div>`);
    }
    const name = (key.replace(/\W+/g, '-') + '-' + view).replace(/-+/g, '-');
    pages.push({ name, html: `<html><body style="margin:0;background:${tokens[theme].surface}"><div style="font:14px sans-serif;padding:8px;color:${tokens[theme].text}">${key} — widok: ${view}, kadry co 0,05, ślad toru ciężaru (linia przerywana)</div><div style="display:grid;grid-template-columns:repeat(${cols},1fr);gap:2px;padding:4px">${cells.join('')}</div></body></html>` });
  }
}
for (const p of pages) fs.writeFileSync(path.join(out, `${p.name}.html`), p.html);
fs.rmSync(tmp, { recursive: true, force: true });
try {
  const { chromium } = createRequire(import.meta.url)('playwright');
  const b = await chromium.launch(); const pg = await b.newPage({ viewport: { width: Number(arg('width', 2100)), height: 900 } });
  for (const p of pages) { await pg.setContent(p.html); await pg.screenshot({ path: path.join(out, `${p.name}.png`), fullPage: true }); }
  await b.close(); console.log(`PNG: ${pages.length} arkuszy w ${out}`);
} catch (e) { console.log('Bez PNG (brak playwright):', e.message.split('\n')[0], `— HTML: ${pages.length} plików w ${out}`); }
