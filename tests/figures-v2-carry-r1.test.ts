/*
 * Recenzja niezależna r1 rodziny carry (audytor, 10.11.2026), poprawki programisty:
 * W1 — Double Kettlebell Front Rack Carry: prawdziwa pozycja „rack” (chwyt ≤ 18 cm przed barkiem, zgięcie łokcia ≥ 140°; wzorzec: zrecenzowany Double Kettlebell Front Squat u 0: 15,1 cm / 149°);
 * przed poprawką chwyt 34,0 cm przed barkiem, łokieć 115°.
 * S2 — hantle noszone wzdłuż boków (Farmer's Walk, Farmers Handles) i nad głową: chwyt neutralny (obrotPrzedramienia 0), nie poprzeczny.
 * S1 (Overhead Carry: chwyt ≤ 5 cm przed barkiem) NIE poprawiono — wymaga wyprostu barku > 170° (zakres ruchu rodziny) przy rękach prostych; do backlogu.
 * (W2 — ślad toru przy gryfie sześciokątnym — pilnuje C1 w tests/figures-v2-tor.test.ts.)
 */
import { figureSpec, frameAt } from '@/lib/figures/v2';
import * as fs from 'fs';
import * as path from 'path';

const kat = (a: number[], b: number[], c: number[]) => { const v = [0, 1, 2].map(i => a[i] - b[i]), w = [0, 1, 2].map(i => c[i] - b[i]); return Math.acos(v.reduce((s, x, i) => s + x * w[i], 0) / (Math.hypot(...v) * Math.hypot(...w))) * 180 / Math.PI; };
const klatki = (k: string) => Array.from({ length: 25 }, (_, i) => frameAt(figureSpec(k)!, i / 24));

describe('W1 (r1, 10.11.2026): Double Kettlebell Front Rack Carry — pozycja rack w każdej klatce', () => {
  const K = 'Double Kettlebell Front Rack Carry';
  test.each(['R', 'L'] as const)('ręka %s: chwyt ≤ 18 cm przed barkiem i zgięcie łokcia (180° − kąt we wnętrzu) ≥ 140°', side => {
    for (const [i, f] of klatki(K).entries()) { const a = f.sk.arms[side];
      expect([i, a.grip[0] - a.shoulder[0] <= 18, 180 - kat(a.shoulder, a.elbow, a.grip) >= 140]).toEqual([i, true, true]); }
  });
  test('pomiar potrafi paść: stara pozycja (chwyt 34 cm przed barkiem, łokieć 115°) łamie oba progi', () => {
    expect(34 <= 18).toBe(false); expect(115 >= 140).toBe(false);
  });
});

describe('S2 (r1, 10.11.2026): hantle w chwycie neutralnym (oś przód–tył)', () => {
  const POSES = JSON.parse(fs.readFileSync(path.join(__dirname, '../lib/figures/v2/poses/carry.json'), 'utf8')).cwiczenia as Record<string, { klatki: { rece: Record<'R' | 'L', { obrotPrzedramienia?: number }> }[] }>;
  test.each(["Farmer's Walk", "Farmer's Walk (Farmers Handles)", 'Overhead Carry (hantle)'])('%s: obrotPrzedramienia = 0 w każdej klatce obu rąk', k => {
    for (const [i, kl] of POSES[k].klatki.entries()) for (const s of ['R', 'L'] as const) expect([k, i, s, kl.rece[s].obrotPrzedramienia]).toEqual([k, i, s, 0]);
  });
  test('uchwyt gryfu sześciokątnego i kettlebell nie mają obrotu przedramienia (nie dotyczy ich oś hantla)', () => {
    for (const k of ["Farmer's Walk (trap bar)", 'Rickshaw Carry', 'Suitcase Carry']) expect([k, POSES[k].klatki.some(kl => kl.rece.R.obrotPrzedramienia !== undefined)]).toEqual([k, false]);
  });
});
