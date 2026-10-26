/*
 * Figury v2 — talerze i łańcuchy na właściwych miejscach gryfu (naprawy po audycie 1.0, 26.10.2026; wymiary: data/zrodla/figury-sprzet.json).
 * Wcześniej talerze leżały w z = ±44…49 cm, czyli na części chwytnej gryfu (chwyt szeroki: dłoń do ±49 cm). Teraz: dłonie między wewnętrznymi kołnierzami,
 * talerz nie zachodzi na dłoń w żadnej klatce żadnego wariantu, łańcuchy wiszą na tulejach (±chainZ), widok z przodu mieści się w kadrze bez zmiany skali.
 */
import { figureSpec, frameAt, assignAll, shapesAt, boxFor, SIDES, EQUIP, GIRTH, type FigureSpec, type Shape, type View } from '@/lib/figures/v2';

const KEYS = Object.entries(assignAll()).filter(([, f]) => ['squat', 'bench_press', 'hinge'].includes(f)).map(([k]) => k);
const spec = (k: string): FigureSpec => figureSpec(k) as FigureSpec;
const U = Array.from({ length: 25 }, (_, i) => i / 24);
const COLLAR = 65.5;                                   /* wewnętrzne kołnierze: odległość 1,31–1,32 m → ±65,5…66 cm */
const WITH_BAR = KEYS.filter(k => [0, 0.5, 1].some(u => frameAt(spec(k), u).props.some(p => p.k === 'barbell' && p.plates !== false)));
const WITH_CHAIN = KEYS.filter(k => /Chain/.test(k));
const xs = (s: Shape): number[] => s.k === 'poly' ? s.pts.map(p => p[0]) : s.k === 'line' ? [s.a[0], s.b[0]] : s.k === 'circle' ? [s.c[0] - s.r, s.c[0] + s.r] : [];

describe('talerze i dłonie na gryfie (wszystkie warianty, 25 klatek)', () => {
  test('są warianty ze sztangą i talerzami (przysiad, wyciskanie, martwy ciąg), w tym chwyt szeroki', () => {
    expect(WITH_BAR.length).toBeGreaterThan(30); expect(WITH_BAR).toEqual(expect.arrayContaining(['Back Squat', 'Wide-Grip Barbell Bench Press', 'Deadlift (sztanga)']));
  });
  test('dłonie (chwyt) są między wewnętrznymi kołnierzami: |z chwytu| + szerokość dłoni ≤ ±65,5 cm', () => {
    const bad: string[] = [];
    for (const k of WITH_BAR) for (const u of U) { const f = frameAt(spec(k), u); for (const s of SIDES) { const z = Math.abs(f.sk.arms[s].grip[2]) + GIRTH.hand; if (z > COLLAR) bad.push(`${k} u=${u} ${s} ${z.toFixed(1)}`); } }
    expect(bad).toEqual([]);
  });
  test('talerz nie zachodzi na dłoń: wewnętrzna krawędź pierwszego talerza leży dalej niż najdalszy punkt dłoni (3D i na rysunku z przodu)', () => {
    const inner = EQUIP.plateZ[0] - EQUIP.plateW / 2; const bad: string[] = [];
    for (const k of WITH_BAR) for (const u of U) {
      const f = frameAt(spec(k), u); const reach = Math.max(...SIDES.map(s => Math.abs(f.sk.arms[s].grip[2]))) + GIRTH.hand;
      if (reach >= inner) bad.push(`${k} u=${u} dłoń do ${reach.toFixed(1)} ≥ talerz od ${inner.toFixed(1)}`);
      const plates = shapesAt(spec(k), u, 'front').filter(s => s.id === 'plate'); if (!plates.length) bad.push(`${k} brak talerzy w widoku z przodu`);
      for (const p of plates) { const near = Math.min(...xs(p).map(Math.abs)); if (near < inner - 0.01) bad.push(`${k} u=${u} talerz od ${near.toFixed(1)}`); }
    }
    expect(bad).toEqual([]);
  });
  test('w widoku z przodu talerze są po obu stronach, po dwa na tulei, na pozycjach plateZ', () => {
    const p = shapesAt(spec('Back Squat'), 0, 'front').filter(s => s.id === 'plate'); expect(p.length).toBe(4);
    const centers = p.map(s => (Math.min(...xs(s)) + Math.max(...xs(s))) / 2).sort((a, b) => a - b);
    expect(centers.map(c => +c.toFixed(2))).toEqual([-71, -66, 66, 71]);
  });
});
describe('łańcuchy na tulejach', () => {
  test('warianty z łańcuchami: w widoku z przodu dwa łańcuchy na ±chainZ (za zewnętrznym talerzem), w widoku z boku jeden pion', () => {
    expect(WITH_CHAIN.length).toBeGreaterThanOrEqual(6);
    for (const k of WITH_CHAIN) {
      const fr = shapesAt(spec(k), 0, 'front').filter(s => s.id === 'chain'); expect([k, fr.length]).toEqual([k, 2]);
      expect(fr.map(s => +xs(s)[0].toFixed(2)).sort((a, b) => a - b)).toEqual([-EQUIP.chainZ, EQUIP.chainZ]);
      for (const s of fr) expect(Math.abs(xs(s)[0])).toBeGreaterThan(EQUIP.plateZ[1] + EQUIP.plateW / 2);
      if (spec(k).views.includes('side' as View)) expect([k, shapesAt(spec(k), 0, 'side').filter(s => s.id === 'chain').length]).toEqual([k, 1]);
    }
  });
  test('łańcuch pasa (przysiad z obciążeniem na pasie) nie jest łańcuchem sztangi: pojedynczy, bez przesunięcia', () => {
    const k = KEYS.find(x => /Belt/.test(x)); if (!k) return;
    const sh = shapesAt(spec(k), 0, 'front').filter(s => s.id === 'chain'); for (const s of sh) expect(Math.abs(xs(s)[0])).toBeLessThan(EQUIP.chainZ - 1);
  });
});
describe('kadr widoku z przodu', () => {
  test('talerze i łańcuchy mieszczą się w kadrze, a kadr nie poszerza się ponad gryf (skala bez zmian)', () => {
    const bad: string[] = [];
    for (const k of WITH_BAR.concat(WITH_CHAIN)) {
      if (!spec(k).views.includes('front' as View)) continue;
      const box = boxFor(spec(k), 'front'); const lim = EQUIP.barLen + 2 * 5 + 2 * EQUIP.barR + 0.01;
      if (box.w > lim + 60) bad.push(`${k} kadr ${box.w.toFixed(0)} cm`);
      for (const u of U) for (const s of shapesAt(spec(k), u, 'front')) if (['plate', 'chain'].includes(s.id ?? '')) for (const x of xs(s)) if (x < box.x || x > box.x + box.w) bad.push(`${k} u=${u} ${s.id} poza kadrem`);
    }
    expect(bad).toEqual([]);
  });
});
