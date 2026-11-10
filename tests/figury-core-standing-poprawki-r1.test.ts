/*
 * core_standing, poprawki po recenzji niezależnej r1 (10.11.2026, partia 8; raport audytora: W1–W5, Ś1–Ś3). Każdy test odtwarza miarę z raportu (czerwony przed poprawką):
 * W1 prowadnica prostej ręki wiatraka przy ręce z kettlebellem (R), W2 gryf Barbell Side Bend idzie z barkami, W3 Cable Russian Twists zgodny z kartą (góra pleców na piłce, biodra w górze, proste ręce),
 * W4 Landmine Rotation bez poprzecznej sztangi, koniec gryfu zatacza łuk, W5 ślad toru piłki lekarskiej na piłce, Ś1 nazwy faz skłonów z wyciągiem (istniejąca PhaseName), Ś3 łokieć Pallofa bez pełnego zablokowania.
 */
jest.mock('@/lib/figures/data.json', () => require('./figure-gate-open').openFigureGate(jest.requireActual('@/lib/figures/data.json')));
import { figureSpec, frameAt, overlayShapes, proj, type FigureSpec, type Shape } from '@/lib/figures/v2';
import { dataUiFor, lowerFirstOf } from '@/lib/figures/v2/poseData';

const spec = (k: string): FigureSpec => figureSpec(k) as FigureSpec;
const US = Array.from({ length: 11 }, (_, i) => i / 10);
const ang = (a: number[], b: number[], c: number[]) => { const u = a.map((x, i) => x - b[i]), v = c.map((x, i) => x - b[i]); const d = u.reduce((s, x, i) => s + x * v[i], 0) / (Math.hypot(...u) * Math.hypot(...v)); return Math.acos(Math.max(-1, Math.min(1, d))) * 180 / Math.PI; };
const elbow = (sk: ReturnType<typeof frameAt>['sk'], s: 'R' | 'L') => ang(sk.arms[s].shoulder, sk.arms[s].elbow, sk.arms[s].wrist);

describe('core_standing r1: W1 prowadnica prostej ręki wiatraka przy ręce z kettlebellem', () => {
  test.each(['Kettlebell Windmill', 'Double Kettlebell Windmill'])('%s: środek prowadnicy (rzut z przodu) bliżej chwytu R (ręka z ciężarem nad głową) niż chwytu L w każdej klatce', (k) => {
    for (const u of US) {
      const g = overlayShapes(spec(k), u, 'front', ['windmillArmStraightRef']).find((x): x is Extract<Shape, { k: 'poly' }> => x.k === 'poly'); if (!g) continue; /* bez prowadnicy w tej klatce (przezroczystość) — nic do porównania */
      const m = [(g.pts[2][0] + g.pts[3][0]) / 2, (g.pts[2][1] + g.pts[3][1]) / 2]; const sk = frameAt(spec(k), u).sk;
      const d = (s: 'R' | 'L') => { const p = proj(sk.arms[s].grip, 'front'); return Math.hypot(p[0] - m[0], p[1] - m[1]); };
      expect([k, u, d('R') < d('L')]).toEqual([k, u, true]);
    }
    expect(US.some(u => overlayShapes(spec(k), u, 'front', ['windmillArmStraightRef']).length > 0)).toBe(true);
  });
});

describe('core_standing r1: W2 gryf Barbell Side Bend idzie z barkami', () => {
  /* OTWARTE (10.11.2026): wymaga zmiany silnika — rekwizyt „barbell” nie ma obrotu w płaszczyźnie czołowej (oś z, tylko axis „x”); potrzebne pole nachylenia w Gear/schemacie, rysunku (draw.ts ma zapas 140 B), kolidera i testu GEAR_EXTRA_FIELDS. Miara poniżej zostaje jako strażnik do czasu decyzji. */
  test.failing('kąt gryfu w rzucie z przodu = przechył linii barków (± 3°), odległość gryfu od obu barków stała (± 2 cm)', () => {
    const k = 'Barbell Side Bend'; const odl: number[][] = [];
    for (const u of US) {
      const f = frameAt(spec(k), u); const b = f.props.find((p): p is Extract<typeof p, { k: 'barbell' }> => p.k === 'barbell')!; const t = ((b as unknown as { tilt?: number }).tilt ?? 0) * Math.PI / 180;
      const sR = f.sk.arms.R.shoulder, sL = f.sk.arms.L.shoulder; const sh = Math.atan2(sR[1] - sL[1], sR[2] - sL[2]);
      expect([u, Math.abs(t - sh) * 180 / Math.PI <= 3]).toEqual([u, true]);
      const dist = (s: number[]) => Math.abs((s[2] - b.c[2]) * Math.sin(t) - (s[1] - b.c[1]) * Math.cos(t)); /* odległość barku od prostej gryfu w płaszczyźnie z–y */
      const sc = (s: number[]) => Math.hypot(s[2] - b.c[2], s[1] - b.c[1]);
      odl.push([sc(sR), sc(sL), dist(sR), dist(sL)]);
    }
    for (let i = 0; i < 4; i++) { const v = odl.map(r => r[i]); expect([i, Math.max(...v) - Math.min(...v) <= 2]).toEqual([i, true]); }
  });
});

describe('core_standing r1: W3 Cable Russian Twists zgodny z kartą (góra pleców na piłce, biodra w górze, proste ręce)', () => {
  test('tułów prawie poziomo (≥ 70° od pionu), biodro ≥ 160°, łokcie ≥ 165° w całym ruchu; piłka pod górą pleców', () => {
    const k = 'Cable Russian Twists';
    for (const u of US) {
      const { sk, props } = frameAt(spec(k), u); const tr = [sk.shoulderC[0] - sk.pelvis[0], sk.shoulderC[1] - sk.pelvis[1]]; const od = Math.atan2(Math.abs(tr[0]), tr[1]) * 180 / Math.PI;
      expect([u, 'tulow', od >= 70]).toEqual([u, 'tulow', true]);
      for (const s of ['R', 'L'] as const) { expect([u, s, 'biodro', ang(sk.shoulderC, sk.pelvis, sk.legs[s].knee) >= 160]).toEqual([u, s, 'biodro', true]); expect([u, s, 'lokiec', elbow(sk, s) >= 165]).toEqual([u, s, 'lokiec', true]); }
      const ball = props.find(p => p.k === 'ball' || (p as { k: string }).k === 'gymball') as unknown as { c: number[]; r: number } | undefined; if (ball) expect([u, Math.hypot(ball.c[0] - sk.spineMid[0], ball.c[1] - sk.spineMid[1]) <= ball.r + 12]).toEqual([u, true]);
    }
  });
});

describe('core_standing r1: W4 Landmine Rotation — koniec gryfu po łuku', () => {
  test.todo('W4 (otwarte, decyzja modelu sprzętu): brak poprzecznego kolidera „bar” — wpis „sztanga” wymusza katalog (requires: landmine + barbell), a chwyt musi leżeć na jej osi z');
  test('koniec gryfu ≤ 3 cm od środka chwytów; długość gryfu stała (łuk sfery), koniec porusza się w bok i zmienia wysokość', () => {
    const k = 'Landmine Rotation'; const z: number[] = [], y: number[] = [];
    for (const u of US) {
      const f = frameAt(spec(k), u); expect(f.props.some(p => p.k === 'barbell')).toBe(true); /* wymóg katalogu: Landmine Rotation wymaga wpisu „sztanga” (tests/figures-v2-gear.test.ts: landmine sam go nie spełnia) */
      const pv = f.props.find((p): p is Extract<typeof p, { k: 'pivot' }> => p.k === 'pivot')!; const mid = [0, 1, 2].map(i => (f.sk.arms.R.grip[i] + f.sk.arms.L.grip[i]) / 2);
      expect([u, Math.hypot(...pv.to.map((x, i) => x - mid[i])) <= 3]).toEqual([u, true]); expect([u, Math.abs(Math.hypot(...pv.to.map((x, i) => x - pv.from[i])) - pv.len) <= 1]).toEqual([u, true]);
      z.push(pv.to[2]); y.push(pv.to[1]);
    }
    expect(Math.max(...z) - Math.min(...z)).toBeGreaterThanOrEqual(36); expect(Math.max(...y) - Math.min(...y)).toBeGreaterThanOrEqual(4);
  });
});

describe('core_standing r1: W5 ślad toru Medicine Ball Full Twist na piłce, nie na miednicy', () => {
  test('ślad ≤ 3 cm od środka piłki w każdej klatce', () => {
    for (const u of US) { const f = frameAt(spec('Medicine Ball Full Twist'), u); const ball = f.props.find(p => p.k === 'ball') as unknown as { c: number[] }; const t = f.info.trail; expect([u, !!t && Math.hypot(...ball.c.map((x, i) => x - t[i])) <= 3]).toEqual([u, true]); }
  });
});

describe('core_standing r1: Ś1 nazwy faz skłonów z wyciągiem (ruch koncentryczny, istniejąca PhaseName)', () => {
  test.each(['One-Arm High-Pulley Cable Side Bends', 'Bosu Ball Cable Crunch With Side Bends'])('%s: „Ściąganie” / „Powrót”, bez opuszczania na początku', (k) => {
    const ui = dataUiFor('core_standing')!; expect(ui.exceptions![k].names).toEqual({ first: 'Ściąganie', second: 'Powrót' }); expect(lowerFirstOf(ui, k)).toBe(false);
  });
  test('skłony z ciężarem opadającym (sztanga, hantel, piłka) zostają przy „Opuszczanie”', () => { const ui = dataUiFor('core_standing')!; for (const k of ['Barbell Side Bend', 'Side Bend (hantel)', 'Weighted Ball Side Bend']) expect([k, lowerFirstOf(ui, k)]).toEqual([k, true]); });
});

describe('core_standing r1: Ś3 Pallof — łokieć na końcu ruchu lekko ugięty (bez blokowania)', () => {
  test.each(['Pallof Press', 'Pallof Press With Rotation'])('%s: łokieć w u = 1 w przedziale 160–175°', (k) => {
    const sk = frameAt(spec(k), 1).sk; for (const s of ['R', 'L'] as const) { const e = elbow(sk, s); expect([k, s, e >= 160 && e <= 175]).toEqual([k, s, true]); }
  });
});
