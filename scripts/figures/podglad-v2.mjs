// Podgląd figur v2 (narzędzie deweloperskie): arkusz kontaktowy SVG/PNG dla rodziny albo ćwiczeń.
// Użycie: node scripts/figures/podglad-v2.mjs --out <katalog> [--family squat] [--key "Back Squat"] [--theme light|dark] [--us 0,0.5,1] [--cols 3] [--per 8] [--muscles] [--error kneesIn|heels|roundBack|arch|barAway|kneesBent]
// PNG powstaje, gdy dostępny jest playwright (NODE_PATH=/opt/node-tools/node_modules); bez niego tylko plik HTML z osadzonym SVG.
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { loadV2 } from './v2-build.mjs';

const arg = (n, d) => { const i = process.argv.indexOf('--' + n); return i > 0 ? process.argv[i + 1] : d; };
const out = path.resolve(arg('out', 'podglad-v2')); fs.mkdirSync(out, { recursive: true });
const tmp = fs.mkdtempSync(path.join(out, '.build-'));
const { v2, tokens } = loadV2(tmp);
const theme = arg('theme', 'light'); const pal = v2.figurePalette(tokens[theme]);
const us = arg('us', '0,0.5,1').split(',').map(Number); const cols = Number(arg('cols', '2'));
const muscles = process.argv.includes('--muscles'); const errorArg = arg('error', ''); const family = arg('family', ''); const only = arg('key', '');
const keys = Object.keys(v2.assignAll()).filter(k => (!family || v2.familyOf(k) === family) && (!only || k === only) && v2.figureSpec(k));
const bg = tokens[theme].surface;
const cells = keys.map(k => {
  const spec = v2.figureSpec(k); const parts = [];
  for (const view of spec.views) {
    const box = v2.boxFor(spec, view);
    for (const u of spec.static ? [1] : us) parts.push(v2.svgDocument(v2.shapesAt(spec, u, view, muscles, errorArg && v2.faultApplicable(spec, errorArg) ? errorArg : undefined), box, pal, 1.5));
  }
  return `<div style="break-inside:avoid;padding:6px;border-bottom:1px solid #8884"><div style="font:12px sans-serif;color:${tokens[theme].text}">${k}</div><div style="display:flex;gap:10px;align-items:flex-end">${parts.join('')}</div></div>`;
});
const per = Number(arg('per', 8)); const name = family || only.replace(/\W+/g, '-') || 'wszystko';
const pages = []; for (let i = 0; i < cells.length; i += per) pages.push(cells.slice(i, i + per));
const htmlOf = list => `<html><body style="margin:0;background:${bg}"><div style="column-count:${cols};padding:8px">${list.join('')}</div></body></html>`;
pages.forEach((l, i) => fs.writeFileSync(path.join(out, `${name}-${theme}-${i}.html`), htmlOf(l)));
fs.rmSync(tmp, { recursive: true, force: true });
try {
  const { chromium } = createRequire(import.meta.url)('playwright');
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: Number(arg('width', 1500)), height: 800 } });
  for (let i = 0; i < pages.length; i++) { await p.setContent(htmlOf(pages[i])); await p.screenshot({ path: path.join(out, `${name}-${theme}-${i}.png`), fullPage: true }); }
  await b.close();
  console.log(`PNG: ${path.join(out, name + '-' + theme)}-0..${pages.length - 1}.png (${keys.length} ćwiczeń)`);
} catch (e) { console.log('Bez PNG (brak playwright):', e.message.split('\n')[0]); }
