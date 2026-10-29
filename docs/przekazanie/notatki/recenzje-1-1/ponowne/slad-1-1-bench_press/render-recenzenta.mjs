// Render własny recenzenta (tylko odczyt repo): wszystkie klatki u=0..1 (13), każdy widok, wiersze błędu pozy; ślad toru (trailFor) nałożony na KAŻDĄ klatkę.
import fs from 'node:fs'; import path from 'node:path'; import { createRequire } from 'node:module';
const REPO = '/home/user/wt/rec-1-1';
const { loadV2 } = await import(REPO + '/scripts/figures/v2-build.mjs');
const OUT = process.argv[2]; const TMP = process.argv[3]; fs.mkdirSync(OUT, { recursive: true }); fs.mkdirSync(TMP, { recursive: true });
const { v2, tokens } = loadV2(TMP);
const pal = v2.figurePalette(tokens.light);
const N = 12; const us = Array.from({ length: N + 1 }, (_, i) => i / N);
const keys = Object.keys(v2.assignAll()).filter(k => v2.familyOf(k) === 'bench_press' && v2.figureSpec(k));
const req = createRequire(import.meta.url); const { chromium } = req('/opt/node-tools/node_modules/playwright');
const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1600, height: 800 } });
const meta = {};
for (const k of keys) {
  const spec = v2.figureSpec(k); const errs = ['arch'].filter(e => v2.faultApplicable(spec, e));
  const rows = [];
  for (const e of [undefined, ...errs]) {
    const cells = [];
    for (const view of spec.views) {
      const box = v2.boxFor(spec, view, errs); const trail = v2.trailFor(spec, view);
      for (const u of us) cells.push(`<div style="text-align:center;font:10px sans-serif">${view} u=${u.toFixed(2)}<br>${v2.svgDocument([...v2.shapesAt(spec, u, view, false, e), ...trail], box, pal, 1.3)}</div>`);
      cells.push('<div style="width:14px"></div>');
    }
    rows.push(`<div style="font:13px sans-serif;margin:4px">${k} — ${e ? 'błąd: ' + e : 'poza poprawna'} (ślad toru nałożony na każdą klatkę)</div><div style="display:flex;gap:4px;align-items:flex-end;width:max-content">${cells.join('')}</div>`);
  }
  const html = `<html><body style="margin:0;padding:6px;background:${tokens.light.surface}">${rows.join('')}</body></html>`;
  await p.setContent(html); const w = await p.evaluate(() => document.documentElement.scrollWidth); await p.setViewportSize({ width: Math.max(1600, w + 20), height: 800 });
  const f = path.join(OUT, k.replace(/\W+/g, '-') + '.png'); await p.screenshot({ path: f, fullPage: true });
  meta[k] = { plik: path.basename(f), widoki: spec.views, klatki: us.length, bledy: errs };
}
await b.close();
fs.writeFileSync(path.join(OUT, 'manifest.json'), JSON.stringify({ commit: '15e3ab45', klatki_u: us, cwiczenia: meta }, null, 1));
console.log(keys.length, 'ćwiczeń');
