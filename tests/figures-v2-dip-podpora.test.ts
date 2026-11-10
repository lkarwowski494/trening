/*
 * (10.11.2026, poprawki po recenzji niezależnej r1 rodziny dip, W1/W2 + luka K5) Każda dłoń leży na swojej podporze w każdym kadrze:
 * poręcze (dipbars), kółka (koniec taśmy), dźwignia maszyny (osobna dla każdej ręki), krawędź ławki (cała dłoń w obrysie ławki).
 * Test ma negatywy: dłoń przesunięta poza podporę i maszyna z jedną dźwignią są wykrywane.
 * Nie jest strażnikiem procesu — przypadek „gałąź z wcześniejszymi zmianami” (L-080) nie dotyczy.
 */
import * as fs from 'fs';
import * as path from 'path';
import { keyframeFrame, type PoseData } from '@/lib/figures/v2';
import { GIRTH } from '@/lib/figures/v2/skeleton';
import { EQUIP } from '@/lib/figures/v2/draw';

const poses = JSON.parse(fs.readFileSync(path.join(__dirname, '../lib/figures/v2/poses/dip.json'), 'utf8')).cwiczenia as Record<string, PoseData>;
const NAMES = ['Chest Dip', 'Triceps Dip', 'Ring Dips', 'Dip Machine', 'Triceps Dips (ławka)'];
const US = [0, 0.125, 0.25, 0.5, 0.75, 0.875, 1];
const TOL = 1; /* cm */
const dist = (a: number[], b: number[]) => Math.hypot(...a.map((x, i) => x - b[i]));
const distSeg = (p: number[], a: number[], b: number[]) => { const ab = b.map((v, i) => v - a[i]); const t = Math.max(0, Math.min(1, ab.reduce((s, v, i) => s + v * (p[i] - a[i]), 0) / ab.reduce((s, v) => s + v * v, 0))); return dist(p, a.map((v, i) => v + t * ab[i])); };

/** Błędy podpory dłoni: [opis, u, strona, wartość] — pusta lista = każda dłoń na podporze. */
function bladPodpory(d: PoseData): unknown[] {
  const out: unknown[] = [];
  for (const u of US) {
    const f = keyframeFrame(d, u); const props = f.props as any[];
    for (const s of ['R', 'L'] as const) {
      const g = f.sk.arms[s].grip as number[];
      const bars = props.filter(p => p.k === 'dipbars'); const cab = props.filter(p => p.k === 'cable'); const piv = props.filter(p => p.k === 'pivot');
      if (bars.length) { const e = Math.min(...bars.flatMap(b => [1, -1].map(sg => distSeg(g, [b.x0, b.h, sg * b.z], [b.x1, b.h, sg * b.z])))); if (e > TOL) out.push(['poręcz', u, s, e]); }
      else if (cab.length) { const e = Math.min(...cab.map(c => dist(g, c.to))); if (e > TOL) out.push(['kółko', u, s, e]); }
      else if (piv.length) { const e = Math.min(...piv.map(p => dist(g, p.to))); if (e > TOL) out.push(['dźwignia', u, s, e]); }
      else {
        const b = (d.sprzet as any[]).find(x => x.rodzaj === 'lawka'); if (!b) { out.push(['brak podpory', u, s, 0]); continue; }
        const w = (b.w ?? EQUIP.benchW) / 2; const over = Math.abs(g[2]) + GIRTH.hand - w; const dy = Math.abs(g[1] - b.top - GIRTH.hand);
        if (over > 0) out.push(['dłoń poza ławką', u, s, over]); if (dy > TOL) out.push(['dłoń nie na blacie', u, s, dy]);
      }
    }
  }
  return out;
}

describe('dip: dłoń na podporze w każdym kadrze (10.11.2026, W1/W2/K5)', () => {
  test.each(NAMES)('%s: każda dłoń na swojej podporze (≤ 1 cm; ławka: cała dłoń w obrysie)', (k) => { expect(bladPodpory(poses[k])).toEqual([]); });
  test('Dip Machine: dwie dźwignie (R i L), każda dłoń przy końcu własnej dźwigni (≤ 1 cm)', () => {
    const lev = (poses['Dip Machine'].sprzet as any[]).filter(g => g.rodzaj === 'dzwignia');
    expect(lev.map(g => g.trzyma).sort()).toEqual(['L', 'R']);
    for (const u of US) { const f = keyframeFrame(poses['Dip Machine'], u); const piv = (f.props as any[]).filter(p => p.k === 'pivot'); expect(piv).toHaveLength(2);
      for (const [i, s] of (['R', 'L'] as const).entries()) { const g = f.sk.arms[s].grip as number[]; const own = piv.find(p => Math.sign(p.to[2]) === Math.sign(g[2]))!; expect([u, s, dist(g, own.to) <= TOL]).toEqual([u, s, true]); expect(i).toBeLessThan(2); } }
  });
  test('Triceps Dips (ławka): dłonie na krawędzi ławki, ręce w ławce nie dalej niż pół szerokości', () => {
    const f = keyframeFrame(poses['Triceps Dips (ławka)'], 0); expect(Math.abs(f.sk.arms.R.grip[2]) + GIRTH.hand).toBeLessThanOrEqual(EQUIP.benchW / 2);
  });
  describe('negatywy (test wykrywa błąd)', () => {
    test('ławka: chwyt z = ±22 (stan sprzed poprawki) → dłoń poza ławką', () => {
      const d = JSON.parse(JSON.stringify(poses['Triceps Dips (ławka)'])) as PoseData; for (const kf of (d as any).klatki) for (const h of ['R', 'L'] as const) kf.rece[h].chwyt[2] = Math.sign(kf.rece[h].chwyt[2]) * 22;
      expect(JSON.stringify(d)).not.toEqual(JSON.stringify(poses['Triceps Dips (ławka)'])); expect(bladPodpory(d).length).toBeGreaterThan(0);
    });
    test('maszyna: tylko prawa dźwignia → lewa dłoń bez podpory', () => {
      const d = JSON.parse(JSON.stringify(poses['Dip Machine'])) as PoseData; (d as any).sprzet = (d.sprzet as any[]).filter(g => g.rodzaj !== 'dzwignia' || g.trzyma === 'R');
      expect(bladPodpory(d).some((e: any) => e[2] === 'L')).toBe(true);
    });
  });
});

/* (10.11.2026, r2 W4) Ławka: łokcie nie rozchodzą się na boki — |z łokcia| ≤ max(|z barku|, |z dłoni|) + 3 cm i ≥ min(|z barku|, |z dłoni|) − 3 cm w każdym kadrze (karta: łokcie prosto do tyłu — nad dłońmi, nie na boki i nie zbiegające się do środka). */
const bladLokci = (d: PoseData) => { const out: unknown[] = []; for (let i = 0; i <= 20; i++) { const u = i / 20; const f = keyframeFrame(d, u); for (const s of ['R', 'L'] as const) { const a = f.sk.arms[s]; const hi = Math.max(Math.abs(a.shoulder[2]), Math.abs(a.grip[2])) + 3; const lo = Math.min(Math.abs(a.shoulder[2]), Math.abs(a.grip[2])) - 3; const e = Math.abs(a.elbow[2]); if (e > hi || e < lo) out.push([u, s, e, lo, hi]); } } return out; };
describe('Triceps Dips (ławka): łokcie do tyłu, bez rozchylania (10.11.2026, W4)', () => {
  test('w każdym kadrze min(|z barku|,|z dłoni|) − 3 ≤ |z łokcia| ≤ max(...) + 3 cm', () => { expect(bladLokci(poses['Triceps Dips (ławka)'])).toEqual([]); });
  test('negatyw: biegun łokcia zbiegający łokcie do środka (z = 1,7 cm przy u = 1; wariant z r2) jest wykrywany', () => {
    const d = JSON.parse(JSON.stringify(poses['Triceps Dips (ławka)'])) as PoseData; for (const kf of (d as any).klatki) for (const h of ['R', 'L'] as const) kf.rece[h].biegunLokcia = [-0.4, -1, (h === 'R' ? -1 : 1) * 0.35];
    expect(bladLokci(d).length).toBeGreaterThan(0);
  });
  test('negatyw: biegun łokcia na zewnątrz (stan sprzed poprawki) jest wykrywany', () => {
    const d = JSON.parse(JSON.stringify(poses['Triceps Dips (ławka)'])) as PoseData; for (const kf of (d as any).klatki) for (const h of ['R', 'L'] as const) kf.rece[h].biegunLokcia = [-0.4, -1, (h === 'R' ? 1 : -1) * 0.3];
    expect(bladLokci(d).length).toBeGreaterThan(0);
  });
});
