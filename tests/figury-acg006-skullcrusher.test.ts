/*
 * ACG-006 (audyt ćwiczeń 31.10.2026, weryfikacja niezależna: WYSOKIE) — Skullcrusher (EZ), figura v1, klatka „end”.
 * Błąd: gryf w dole był ok. 11–12 cm od czoła i ok. 6 cm za czubkiem głowy, a karta (skull.setup / skull.move / skull.depth) mówi „nad czołem”;
 * sprawdzenie touch skull.depth (tolerancja 12) przechodziło za luźno (wynik 10,3). Ocena realności: realny (Biblioteka → Skullcrusher (EZ) → Technika).
 * Decyzja właściciela 31.10.2026: poprawka w linii 1.1, w 1.0 bez zmian (docs/18). Jedyna figura skullcrushera w danych (sztanga/hantle nie mają figury).
 * Czoło = górno-przednia część głowy: środek głowy + 4,6 j. w stronę czubka głowy + 4,6 j. w górę (rachunek z raportu ACG-006).
 */
import * as fs from 'fs';
import * as path from 'path';
import { framePoints, posePoints, resolveFigure, evalCheck, poseBetween, SEG, type Figure } from '@/lib/figures/geom';

const FULL = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'data/zrodla/figures.json'), 'utf8'));
const F = () => resolveFigure(FULL.exercises, 'Skullcrusher (EZ)') as Figure;
const end = (f: Figure) => f.frames.findIndex(x => x.n === 'end');

describe('ACG-006 Skullcrusher (EZ): gryf w dole nad czołem', () => {
  it('dolna klatka: gryf blisko czoła, nie za czubkiem głowy', () => {
    const f = F(), P = framePoints(f, end(f)), h = P.head, g = P.hand;
    const czolo: [number, number] = [h[0] - 4.6, h[1] + 4.6];
    expect(Math.hypot(g[0] - czolo[0], g[1] - czolo[1])).toBeLessThanOrEqual(6); /* przed: 7,4 */
    expect(h[0] - g[0]).toBeLessThanOrEqual(SEG.headR + 1); /* gryf nie dalej za środkiem głowy niż jej obrys (przed: 10,3) */
    expect(g[1] - h[1]).toBeGreaterThan(SEG.headR - 1); /* nad głową, nie w niej */
  });
  it('sprawdzenie touch skull.depth jest ostre (tolerancja ≤ 6) i nie przechodzi dla starej pozy', () => {
    const f = F(), fr = f.frames[end(f)], ch = fr.why.find(w => w.c === 'skull.depth')!;
    expect(ch.tol).toBeLessThanOrEqual(6);
    const P = framePoints(f, end(f));
    expect(evalCheck(ch, fr.p, f.view, P).ok).toBe(true);
    const stara = { ...fr.p, sh: 100, el: 105 } as typeof fr.p;
    const Pold = posePoints(stara, f.view, f.anchor, fr.at);
    expect(evalCheck(ch, stara, f.view, Pold).ok).toBe(false);
  });
  it('ramię prawie nieruchome: obie klatki w granicy „mniej więcej pionowo”, łokcie zgięte w dole', () => {
    const f = F();
    for (const fr of f.frames) { const c = fr.why.find(w => w.c === 'skull.upperArm')!; expect(evalCheck(c, fr.p, f.view, framePoints(f, f.frames.indexOf(fr))).ok).toBe(true); }
    const a = f.frames[0].p as { sh: number }, b = f.frames[end(f)].p as { sh: number };
    expect(Math.abs(a.sh - b.sh)).toBeLessThanOrEqual(10);
  });
  it('cały ruch: gryf w żadnej pozie pośredniej nie wchodzi w głowę (odległość od środka głowy ≥ promień głowy)', () => {
    const f = F(); const i = end(f);
    for (let s = 0; s <= 8; s++) { const { P } = poseBetween(f, i - 1, i, s / 8); expect(Math.hypot(P.hand[0] - P.head[0], P.hand[1] - P.head[1])).toBeGreaterThanOrEqual(SEG.headR); }
  });
});
