/*
 * Silnik v2: stopa skierowana do tyłu (grzbietem do podpory) — decyzja właściciela 27.10.2026 (przysiad bułgarski: tylna stopa leży grzbietem na ławce).
 * Rozszerzenie zgodne wstecz: `podbicie` 91…270° = oś stopy obraca się za pion ku tyłowi (180° = palce do tyłu poziomo, 180° + a = palce opadają o a°);
 * dla podbicia ≤ 90° geometria nie zmienia się (pilnują tego odciski pozostałych póz w tests/figury-recenzja-p2.test.ts i złote kształty).
 */
import { solveSkeleton, poseSchema, type PoseIn } from '@/lib/figures/v2';

const baza = (pitch: number): PoseIn => ({ pelvis: [0, 90, 0], trunkPitch: 0, headPitch: 0, legs: { R: { ankle: [0, 7, 9], footPitch: pitch }, L: { ankle: [0, 7, -9], footPitch: pitch } }, arms: { R: { grip: [10, 90, 20] }, L: { grip: [10, 90, -20] } } } as unknown as PoseIn);
describe('stopa grzbietem (podbicie 91…270°)', () => {
  test('podbicie 0: palce do przodu (jak dotąd)', () => { const L = solveSkeleton(baza(0)).legs.R; expect(L.toe[0]).toBeGreaterThan(L.ankle[0] + 15); });
  test('podbicie 205°: palce skierowane do tyłu i w dół, pięta za kostką po stronie przodu, podeszwa u góry', () => {
    const L = solveSkeleton(baza(205)).legs.R; /* rotacja stopy domyślnie 10° skraca rzut na x, kierunek zostaje */
    expect(L.toe[0]).toBeLessThan(L.ankle[0] - 15); expect(L.toe[1]).toBeLessThan(L.ankle[1] + 7 * Math.cos(25 * Math.PI / 180) - 5);
    expect(L.heel[0]).toBeGreaterThan(L.ankle[0]); expect(L.heel[1]).toBeGreaterThan(L.ankle[1]); /* podeszwa nad kostką (stopa leży grzbietem w dół) */
  });
  test('kontrakt dopuszcza podbicie do 270° (poza), a zmiany w błędach zostają w ±90°', () => {
    const t = JSON.stringify(poseSchema('lunge')); const m = [...t.matchAll(/"podbicie":\{"type":"number","minimum":(-?\d+),"maximum":(\d+)/g)].map(x => `${x[1]}..${x[2]}`);
    expect(m).toContain('-90..270'); expect(m).toContain('-90..90');
  });
});
