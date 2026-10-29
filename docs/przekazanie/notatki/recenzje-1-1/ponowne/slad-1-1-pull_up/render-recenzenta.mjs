// Render własny recenzenta: wszystkie klatki (13 na ruch) × widoki × (poza poprawna + wiersze błędów), z nałożonym śladem (trailFor / info.trail) i własnym śladem głowy.
import fs from 'node:fs'; import path from 'node:path'; import { createRequire } from 'node:module';
const ROOT = '/home/user/wt/rec-1-1'; const OUT = process.argv[2]; const TMP = process.argv[3];
const { loadV2 } = await import(ROOT + '/scripts/figures/v2-build.mjs');
const { v2, tokens } = loadV2(TMP);
const { Resvg } = createRequire(process.argv[4] + '/x.js')('@resvg/resvg-js');
const poses = JSON.parse(fs.readFileSync(ROOT + '/lib/figures/v2/poses/pull_up.json', 'utf8')).cwiczenia;
const pal = v2.figurePalette(tokens.light);
const N = 12; const us = Array.from({ length: N + 1 }, (_, i) => i / N);
const deg = (a, b, c) => { const u = [a[0]-b[0],a[1]-b[1],a[2]-b[2]], w = [c[0]-b[0],c[1]-b[1],c[2]-b[2]]; const d = u[0]*w[0]+u[1]*w[1]+u[2]*w[2]; return 180 - Math.acos(Math.max(-1, Math.min(1, d / Math.hypot(...u) / Math.hypot(...w)))) * 180 / Math.PI; };
const f1 = (x) => (Math.round(x * 10) / 10).toFixed(1);
const raport = {};
for (const [name, d] of Object.entries(poses)) {
  const spec = v2.figureSpec(name); const views = spec ? spec.views : v2.viewsOf(name, 'pull_up');
  const rows = [undefined, ...d.bledy.map((_, i) => i)];
  const boxes = views.map(view => v2.boundsOf(rows.flatMap(e => us.map(u => v2.dataShapes(d, u, view, e)))));
  const px = 1.6; const pad = 6; const lab = 18;
  const cellW = boxes.map(b => b.w * px); const cellH = Math.max(...boxes.map(b => b.h * px));
  const totalW = views.reduce((t, _, vi) => t + (cellW[vi] + pad) * us.length + 20, 0) + 20;
  let svg = []; let y = 4;
  raport[name] = { widoki: views, static: !!spec?.static, wiersze: [] };
  for (const e of rows) {
    const label = e === undefined ? 'poza poprawna' : 'błąd: ' + d.bledy[e].cue;
    svg.push(`<text x="6" y="${y + 13}" font-family="DejaVu Sans, sans-serif" font-size="13" fill="#222">${name} — ${label} — ślad: kreska = info.trail/load (silnik), czerwona = środek głowy, niebieska = środek barków; zielona pionowa = drążek x</text>`);
    y += lab; let x = 6;
    const fr = us.map(u => v2.keyframeFrame(d, u, e));
    const met = us.map((u, i) => { const f = fr[i], sk = f.sk; const A = sk.arms, L = sk.legs; return { u: f1(u), miednica: sk.pelvis.map(f1).join(';'), barkC: sk.shoulderC.map(f1).join(';'), glowa: sk.head.map(f1).join(';'), lokiecR: f1(deg(A.R.shoulder, A.R.elbow, A.R.grip)), lokiecL: f1(deg(A.L.shoulder, A.L.elbow, A.L.grip)), kolanoR: f1(deg(L.R.hip, L.R.knee, L.R.ankle)), biodroR: f1(deg(sk.shoulderC, L.R.hip, L.R.knee)), shrugR: f1(A.R.shrug), kostkaR: L.R.ankle.map(f1).join(';'), gripR: A.R.grip.map(f1).join(';'), gripL: A.L.grip.map(f1).join(';') }; });
    raport[name].wiersze.push({ label, met });
    views.forEach((view, vi) => {
      const b = boxes[vi];
      const trail = v2.trailShapes(fr, view); const pr = (p) => v2.proj(p, view);
      const tr = (key) => fr.map(f => pr(key(f.sk)));
      const poly = (pts, col) => ({ k: 'poly', pts, w: 0.6, stroke: col });
      for (let i = 0; i < us.length; i++) {
        const sh = [...v2.dataShapes(d, us[i], view, e), ...trail];
        let inner = v2.svgDocument(sh, b, pal, px);
        // własne ślady: głowa i barki (wszystkie klatki), pionowa linia drążka
        const T = (p) => [(p[0] - b.x), (b.y + b.h - p[1])];
        const line = (pts, col, dash) => `<polyline points="${pts.map(p => T(p).map(f1).join(',')).join(' ')}" fill="none" stroke="${col}" stroke-width="0.7" ${dash ? 'stroke-dasharray="3 2"' : ''}/>`;
        const bar = d.sprzet.find(g => g.rodzaj === 'sztanga'); const bp = pr([bar.x, bar.y, 0]);
        const extra = [line(tr(s => s.head), '#d22', false), line(tr(s => s.shoulderC), '#24c', false), view === 'side' ? `<line x1="${f1(T(bp)[0])}" y1="0" x2="${f1(T(bp)[0])}" y2="${f1(b.h)}" stroke="#2a2" stroke-width="0.6" stroke-dasharray="2 3"/>` : '', `<circle cx="${f1(T(pr(fr[i].sk.head))[0])}" cy="${f1(T(pr(fr[i].sk.head))[1])}" r="1.6" fill="#d22"/>`].join('');
        inner = inner.replace('</svg>', extra + '</svg>');
        svg.push(`<g transform="translate(${f1(x)},${f1(y)})"><rect width="${f1(cellW[vi])}" height="${f1(cellH)}" fill="#fff" stroke="#ddd"/>${inner}<text x="3" y="${f1(cellH - 4)}" font-family="DejaVu Sans, sans-serif" font-size="11" fill="#555">${view} u=${us[i].toFixed(2)}</text></g>`);
        x += cellW[vi] + pad;
      }
      x += 20;
    });
    y += cellH + 10;
  }
  const doc = `<svg xmlns="http://www.w3.org/2000/svg" width="${Math.ceil(totalW)}" height="${Math.ceil(y)}"><rect width="100%" height="100%" fill="#fafafa"/>${svg.join('\n')}</svg>`;
  const base = path.join(OUT, name.replace(/\W+/g, '-') + '-slad');
  fs.writeFileSync(base + '.svg', doc);
  fs.writeFileSync(base + '.png', new Resvg(doc, { font: { loadSystemFonts: true } }).render().asPng());
  process.stderr.write(name + ' ok ' + views.join('+') + ' rows ' + rows.length + '\n');
}
fs.writeFileSync(path.join(OUT, 'metryki.json'), JSON.stringify(raport, null, 1));
