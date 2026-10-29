// Render własny recenzenta (tylko odczyt repo): wszystkie klatki u = 0..1 (krok 1/12) × każdy widok, ślad toru (trailFor) nałożony na każdą klatkę,
// rzędy błędów (errorsOf jak w ui.ts) z tym samym śladem; liczby: tor, kąty, położenie ciężaru, styki.
// Użycie: node render.mjs <repo> <wyjscie> <rodzina>
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
const [repo, out, fam] = process.argv.slice(2);
const { loadV2 } = await import(path.join(repo, 'scripts/figures/v2-build.mjs'));
fs.mkdirSync(out, { recursive: true });
const tmp = fs.mkdtempSync(path.join(path.dirname(out), '.b-'));
const { v2, tokens } = loadV2(tmp);
const req = createRequire(path.join(repo, 'x.js'));
const CUE = req('./lib/cues/data.json'); const CS = req('./lib/figures/v2/cue-sets.json');
const pal = v2.figurePalette(tokens.light); const bg = tokens.light.surface;
const keys = Object.keys(v2.assignAll()).filter(k => v2.familyOf(k) === fam && v2.figureSpec(k));
const N = 12; const US = Array.from({ length: N + 1 }, (_, i) => i / N);
function errsOf(spec) {
  const own = CUE.exercises[spec.key]; let errs = [];
  if (own) errs = (own.mistakes ?? []).map(r => r.c); else { const e = CS.items[spec.key]; if (e && e.b === 'general') errs = e.err ?? []; }
  const o = []; for (const c of errs) { const er = v2.CUE_TO_ERROR[c]; if (er && v2.faultApplicable(spec, er) && !o.some(x => x.error === er)) o.push({ error: er, cue: c }); } return o;
}
function ksztalt(pts) {
  const [a, b] = [pts[0], pts[pts.length - 1]]; const dx = b[0] - a[0], dy = b[1] - a[1], L = Math.hypot(dx, dy) || 1;
  const odch = Math.max(...pts.map(p => Math.abs((p[0] - a[0]) * dy - (p[1] - a[1]) * dx) / L));
  let z = 0, sg = 0; for (let i = 1; i < pts.length; i++) { const d = pts[i][0] - pts[i - 1][0]; if (Math.abs(d) < 0.05) continue; const s = Math.sign(d); if (sg && s !== sg) z++; sg = s; }
  return { odch: +odch.toFixed(2), zawr: z, dx: +(b[0] - a[0]).toFixed(1), dy: +(b[1] - a[1]).toFixed(1), xr: [+Math.min(...pts.map(p => p[0])).toFixed(1), +Math.max(...pts.map(p => p[0])).toFixed(1)] };
}
const r1 = x => Math.round(x * 10) / 10;
const raport = {};
const b = await (async () => { const { chromium } = createRequire(import.meta.url)('/opt/node-tools/node_modules/playwright'); return chromium.launch(); })();
const page = await b.newPage({ viewport: { width: 2400, height: 800 } });
for (const k of keys) {
  const spec = v2.figureSpec(k); const errs = errsOf(spec); const rows = [];
  const R = { views: spec.views, static: !!spec.static, errors: errs.map(e => e.error + ':' + e.cue), tor: {}, tor_load: {}, katy: {}, klatki: [] };
  for (const view of spec.views) {
    const box = v2.boxFor(spec, view, errs.map(e => e.error)); const trail = v2.trailFor(spec, view);
    const us = spec.static ? [1] : US;
    for (const err of [undefined, ...errs.filter(e => v2.errorDefOf(spec, e.error)?.kind === 'pose').map(e => e.error)]) {
      const cells = us.map(u => { const sh = v2.sortShapes ? v2.sortShapes([...v2.shapesAt(spec, u, view, false, err), ...trail]) : [...v2.shapesAt(spec, u, view, false, err), ...trail];
        return `<div style="text-align:center"><div style="font:11px sans-serif">u=${u.toFixed(2)}</div>${v2.svgDocument(sh, box, pal, 1.6)}</div>`; });
      rows.push(`<div style="font:14px sans-serif;margin-top:6px"><b>${view}</b> ${err ? 'BŁĄD: ' + err : 'poprawna'}</div><div style="display:flex;gap:4px;align-items:flex-end;flex-wrap:nowrap">${cells.join('')}</div>`);
    }
    const fr = Array.from({ length: 25 }, (_, i) => v2.frameAt(spec, i / 24));
    const pl = fr.map(f => f.info.load).filter(Boolean).map(p => v2.proj(p, view)); if (pl.length > 1) R.tor_load[view] = ksztalt(pl);
    const pt = fr.map(f => f.info.trail ?? f.info.load).filter(Boolean).map(p => v2.proj(p, view)); if (pt.length > 1) R.tor[view] = ksztalt(pt);
  }
  for (const s of ['R', 'L']) { const a = Array.from({ length: 25 }, (_, i) => v2.jointAngles(v2.frameAt(spec, i / 24).sk, s)); R.katy[s] = Object.fromEntries(Object.keys(a[0]).map(j => [j, [r1(Math.min(...a.map(x => x[j]))), r1(Math.max(...a.map(x => x[j])))]])); }
  for (const u of [0, 0.5, 1]) { const f = v2.frameAt(spec, u); const sk = f.sk; const L = sk.legs.R, A = sk.arms.R;
    R.klatki.push({ u, load: f.info.load?.map(r1), trail: f.info.trail?.map(r1), midfoot: f.info.midfoot?.map(r1), hip: f.info.hip?.map(r1), shoulderR: A.shoulder.map(r1), elbowR: A.elbow.map(r1), gripR: A.grip.map(r1), gripL: sk.arms.L.grip.map(r1), heelR: L.heel.map(r1), toeR: L.toe.map(r1), kneeR: L.knee.map(r1), ankleR: L.ankle.map(r1), head: sk.head?.map?.(r1), props: f.props.map(p => ({ k: p.k, ...(p.from ? { from: p.from.map(r1), to: p.to.map(r1) } : {}), ...(p.c ? { c: p.c.map?.(r1) } : {}), ...(p.x !== undefined ? { x: r1(p.x) } : {}), ...(p.hang ? { hang: true } : {}), ...(p.bar ? { bar: true } : {}) })) }); }
  raport[k] = R;
  const html = `<html><body style="margin:0;background:${bg};padding:8px"><div style="font:16px sans-serif"><b>${k}</b> — render własny recenzenta, ${spec.static ? 1 : N + 1} klatek × ${spec.views.join('+')}, ślad toru (trailFor) na każdej klatce; błędy: ${errs.map(e => e.error).join(', ') || 'brak'}</div>${rows.join('')}</body></html>`;
  const name = k.replace(/\W+/g, '-').replace(/-+$/, '');
  await page.setContent(html); await page.screenshot({ path: path.join(out, `${name}-slad.png`), fullPage: true });
  if (process.env.PRZ) { fs.mkdirSync(process.env.PRZ, { recursive: true });
    const mk = (view, us2, err, px) => { const box = v2.boxFor(spec, view, errs.map(e => e.error)); const tr = v2.trailFor(spec, view); return us2.map(u => `<div style="text-align:center"><div style="font:11px sans-serif">${view} ${err||''} u=${u}</div>${v2.svgDocument(v2.sortShapes([...v2.shapesAt(spec, u, view, false, err), ...tr]), box, pal, px)}</div>`).join(''); };
    const uu = spec.static ? [1] : [0, 0.25, 0.5, 0.75, 1];
    let h = `<div id="x" style="display:inline-block;background:${bg};padding:4px"><div style="display:flex;gap:6px;align-items:flex-end">${mk('side', uu, undefined, 2.2)}</div><div style="display:flex;gap:6px;align-items:flex-end">${mk('front', spec.static ? [1] : [0, 0.5, 1], undefined, 1.6)}</div>`;
    for (const e of errs.filter(e => v2.errorDefOf(spec, e.error)?.kind === 'pose')) h += `<div style="display:flex;gap:6px;align-items:flex-end">${mk('side', [0.5, 1], e.error, 1.6)}${mk('front', [1], e.error, 1.2)}</div>`;
    await page.setContent(`<html><body style="margin:0">${h}</div></body></html>`); await (await page.$('#x')).screenshot({ path: path.join(process.env.PRZ, `${name}.png`) }); }
  if (process.env.ROWS) { fs.mkdirSync(process.env.ROWS, { recursive: true }); for (let i = 0; i < rows.length; i++) { await page.setContent(`<html><body style="margin:0;background:${bg};padding:4px;width:max-content">${rows[i]}</body></html>`); await page.screenshot({ path: path.join(process.env.ROWS, `${name}-${i}.png`), fullPage: true }); } }
  process.stdout.write('.');
}
await b.close();
fs.writeFileSync(path.join(path.dirname(out), `raport-${fam}.json`), JSON.stringify(raport, null, 1));
fs.rmSync(tmp, { recursive: true, force: true });
console.log('\n', keys.length, 'ćwiczeń');
