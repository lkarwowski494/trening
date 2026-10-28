import { figureSpec, frameAt, proj, type View } from '@/lib/figures/v2';
import * as fs from 'fs';
import * as path from 'path';
const W: Record<string, string> = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'tests/tor-wyjatki.json'), 'utf8'));
function ks(pts: [number, number][]) { const [a, b] = [pts[0], pts[pts.length - 1]]; const dx = b[0] - a[0], dy = b[1] - a[1], L = Math.hypot(dx, dy) || 1;
  const o = Math.max(...pts.map(p => Math.abs((p[0] - a[0]) * dy - (p[1] - a[1]) * dx) / L)); let z = 0, sg = 0;
  for (let i = 1; i < pts.length; i++) { const d = pts[i][0] - pts[i - 1][0]; if (Math.abs(d) < 0.05) continue; const s = Math.sign(d); if (sg && s !== sg) z++; sg = s; }
  const xs = pts.map(p => p[0]); return { o: +o.toFixed(1), z, rozrzutX: +(Math.max(...xs) - Math.min(...xs)).toFixed(1) }; }
test('sonda tor wyjątków', () => {
  const out: string[] = [];
  for (const id of Object.keys(W)) { const [k, v] = id.split('|') as [string, View]; const s = figureSpec(k)!;
    const pts = Array.from({ length: 25 }, (_, i) => frameAt(s, i / 24).info.load).filter(Boolean).map(p => proj(p!, v) as [number, number]);
    out.push(`${id}: ${JSON.stringify(ks(pts))} load=${s.variant.family === 'squat' ? (s.variant.p as { load?: string }).load : '-'}`); }
  console.log(out.join('\n'));
});
