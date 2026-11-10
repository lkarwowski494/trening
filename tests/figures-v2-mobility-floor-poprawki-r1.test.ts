/*
 * Figury v2 mobility_floor — poprawki po recenzji niezależnej r1 (09.11.2026, audytor; W1). Progi z karty, nie z danych (K5):
 * - W1: Child's Pose — karta: „oprzyj dłonie o podłogę przed sobą”, „Ręce zostaw wyciągnięte przed sobą”: w każdej klatce chwyt R/L jest przed barkiem (x chwytu > x barku) i na podłodze (y ≈ 3 cm, styk ≤ 1 cm).
 * - Ś2: Butterfly Stretch — karta: „łokciami delikatnie dociśnij uda w dół”: ramię (bark–łokieć) styka się z udem (odstęp kapsuł ≤ 1 cm).
 * - Ś1: Side-Lying Quad Stretch — pięta wraca do pośladka w płaszczyźnie ciała: składowa boczna (oś miednicy) goleni górnej nogi ≤ 0,35 (obrót wewnętrzny biodra ≲ 40°; recenzja: 0,56 ≈ 59°).
 * Przypadek negatywny: dane sprzed poprawki (ręce wzdłuż tułowia: chwyt x ≈ −2 cm, bark x ≈ 51 cm) oblewają ten test.
 */
import { figureSpec, frameAt, bodyColliders, gap, type FigureSpec } from '@/lib/figures/v2';

const spec = (k: string): FigureSpec => figureSpec(k) as FigureSpec;
const US = Array.from({ length: 21 }, (_, i) => i / 20);

describe("mobility_floor r1 — W1: Child's Pose, ręce wyciągnięte przed sobą", () => {
  test.each(['R', 'L'] as const)('ręka %s: w każdej klatce chwyt przed barkiem (≥ 20 cm) i na podłodze (y 2–4 cm)', (s) => {
    for (const u of US) {
      const a = frameAt(spec("Child's Pose"), u).sk.arms[s];
      expect([u, a.grip[0] - a.shoulder[0] > 20]).toEqual([u, true]);
      expect([u, a.grip[1] >= 2 && a.grip[1] <= 4]).toEqual([u, true]);
    }
  });
  test('ręce wyciągnięte: łokieć niemal prosty (odległość bark–chwyt ≥ 90% sięgu)', () => {
    const a = frameAt(spec("Child's Pose"), 0).sk.arms.R; const d = Math.hypot(a.grip[0] - a.shoulder[0], a.grip[1] - a.shoulder[1], a.grip[2] - a.shoulder[2]);
    expect(d).toBeGreaterThan(0.9 * 62.8);
  });
});

describe('mobility_floor r1 — Ś2: Butterfly Stretch, łokcie na udach', () => {
  test.each(['R', 'L'] as const)('strona %s: odstęp ramienia od uda ≤ 1 cm w każdej klatce', (s) => {
    for (const u of US) {
      const c = bodyColliders(frameAt(spec('Butterfly Stretch'), u).sk); const f = (id: string) => c.find(x => x.id === id + s)!;
      const g = gap(f('uarm'), f('thigh')); expect([u, g <= 1, Math.round(g * 10) / 10]).toEqual([u, true, Math.round(g * 10) / 10]);
    }
  });
});

describe('mobility_floor r1 — Ś1: Side-Lying Quad Stretch, goleń w płaszczyźnie ciała', () => {
  test('składowa boczna goleni górnej nogi (R) względem osi miednicy ≤ 0,35 w każdej klatce', () => {
    for (const u of US) {
      const sk = frameAt(spec('Side-Lying Quad Stretch'), u).sk; const L = sk.legs.R; const d = [L.ankle[0] - L.knee[0], L.ankle[1] - L.knee[1], L.ankle[2] - L.knee[2]]; const n = Math.hypot(d[0], d[1], d[2]);
      const lat = Math.abs(d[0] * sk.pelvisRight[0] + d[1] * sk.pelvisRight[1] + d[2] * sk.pelvisRight[2]) / n;
      expect([u, lat <= 0.35, Math.round(lat * 100) / 100]).toEqual([u, true, Math.round(lat * 100) / 100]);
    }
  });
});
