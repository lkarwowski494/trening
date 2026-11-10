/*
 * Figury v2 lunge — poprawki po recenzji niezależnej r1 (10.11.2026, partia 9; audytor: W1–W5, Ś1, Ś2, N1). Progi z karty, reguł sensu i konwencji kontraktu, nie z danych (K5).
 * Dane sprzed poprawki oblewają te testy (liczby „było” w nazwach testów):
 * - W1: strona mierzonej nogi (kolano nad stopą z przodu, linia kąta) = R (noga przednia/pracująca); było L (zamach nogi tylnej zgina jej kolano najdalej) w Curtsy, Crossover Reverse Lunge, Elevated Back Lunge, Lunge Pass Through, Reverse Lunge, Step Up, Barbell Step Up;
 * - W2: stopa nogi pracującej w ruchach bocznych nie skręca palców do środka (było −20°, Cossack −28°) i kolano leży w linii palców (było 10,0 cm, Cossack 13,1 cm na zewnątrz od palców);
 * - W3: sztanga w Barbell Side Split Squat leży na barkach (było z gryfu 0, barki z = 21,5 cm, chwyty 21,5 cm w bok od gryfu);
 * - W4: Elevated Back Lunge: start „stanie” na stopniu, obie stopy na nim, kolana prawie proste (było 63,1°, tylna stopa na podłodze). Split Squat i Split Squat (linki): start „stanie”, kolana ≤ 25° (było 56,8° / 55,7°; wyjątek zakresu biodra −25°);
 * - W5: Pistol Squat i Smith Machine Pistol Squat: wolna noga wyprostowana w przód (było kolano 30,6–30,8°);
 * - Ś1: Step Up, Barbell Step Up: na górze stopa dostawiona na stopień (było 24 cm nad nim), kolano nogi wolnej ≤ 105° (było 116°);
 * - Ś2: przysiad bułgarski: palce tylnej stopy na blacie ławki ± 1 cm (było 2,1 cm nad siedziskiem);
 * - N1: opisy wyjątków toru Pistol Squat i Single-Leg High Box Squat: ślad = tor miednicy.
 */
import * as fs from 'fs';
import * as path from 'path';
import { figureSpec, frameAt, jointAngles, measuredSide, type FigureSpec } from '@/lib/figures/v2';

const spec = (k: string): FigureSpec => figureSpec(k) as FigureSpec;
const US = Array.from({ length: 21 }, (_, i) => i / 20);
const r1 = (x: number) => Math.round(x * 10) / 10;
type Prop = Record<string, unknown> & { k: string };
const prop = (k: string, u: number, kind: string): Prop => frameAt(spec(k), u).props.find((p: { k: string }) => p.k === kind) as unknown as Prop;
const mid = (a: number[], b: number[]) => a.map((x, i) => (x + b[i]) / 2);

describe('W1: mierzona noga rzutu z przodu i linii kąta to noga przednia/pracująca (R)', () => {
  test.each(['Reverse Lunge', 'Curtsy Lunge', 'Crossover Reverse Lunge', 'Elevated Back Lunge', 'Lunge Pass Through', 'Step Up', 'Barbell Step Up'])('%s — mierzona strona R (było L w 5 z 7)', k => {
    expect([k, measuredSide(spec(k))]).toEqual([k, 'R']);
  });
  test.each(['Reverse Lunge', 'Curtsy Lunge', 'Crossover Reverse Lunge', 'Elevated Back Lunge', 'Lunge Pass Through'])('%s — R to noga przednia: w dole kostka R przed kostką L', k => {
    const sk = frameAt(spec(k), 1).sk; expect([k, sk.legs.R.ankle[0] > sk.legs.L.ankle[0]]).toEqual([k, true]);
  });
  test.each(['Step Up', 'Barbell Step Up'])('%s — R to noga na stopniu: kostka R na wysokości stopnia + 7 cm w całym ruchu', k => {
    const b = prop(k, 0, 'box') as unknown as { top: number };
    for (const u of US) expect([k, u, Math.abs(frameAt(spec(k), u).sk.legs.R.ankle[1] - (b.top + 7)) <= 0.5]).toEqual([k, u, true]);
  });
});

describe('W2: ruchy boczne — stopa nogi pracującej prosto, kolano w linii palców', () => {
  test.each(['Lateral Lunge', 'Barbell Side Split Squat', 'Cossack Squat'])('%s — palce nie do środka (toeOut ≥ 0) i kolano zgięte ≥ 30° leży w linii palców (od −4 cm przyśrodkowo do +5 cm na zewnątrz)', k => {
    for (const u of US) {
      const f = frameAt(spec(k), u); const R = f.sk.legs.R; const toeOut = f.pose.legs.R.toeOut ?? 0; expect([k, u, toeOut >= 0]).toEqual([k, u, true]);
      if (jointAngles(f.sk, 'R').knee >= 30) { const d = R.knee[2] - R.toe[2]; expect([k, u, d >= -4 && d <= 5, r1(d)]).toEqual([k, u, true, r1(d)]); }
    }
  });
});

describe('W3: Barbell Side Split Squat — sztanga na barkach, ślad przy chwycie', () => {
  test('środek gryfu = środek chwytów (≤ 3 cm) i na wysokości barków w z (≤ 3 cm) w całym ruchu', () => {
    for (const u of US) {
      const f = frameAt(spec('Barbell Side Split Squat'), u); const b = prop('Barbell Side Split Squat', u, 'barbell') as unknown as { c: number[] };
      const g = mid(f.sk.arms.R.grip, f.sk.arms.L.grip); const d = Math.hypot(b.c[0] - g[0], b.c[1] - g[1], b.c[2] - g[2]);
      expect([u, d <= 3, r1(d)]).toEqual([u, true, r1(d)]);
      const dz = Math.abs(b.c[2] - f.sk.shoulderC[2]); expect([u, dz <= 3, r1(dz)]).toEqual([u, true, r1(dz)]);
    }
  });
});

describe('W4: Elevated Back Lunge — start „stanie” na stopniu', () => {
  test('u = 0: kolana ≤ 20° (było 63,1°), obie kostki na wysokości stopnia + 7 cm (było: tylna na podłodze)', () => {
    const f = frameAt(spec('Elevated Back Lunge'), 0); const b = prop('Elevated Back Lunge', 0, 'box') as unknown as { top: number };
    for (const s of ['R', 'L'] as const) { expect([s, jointAngles(f.sk, s).knee <= 20]).toEqual([s, true]); expect([s, Math.abs(f.sk.legs[s].ankle[1] - (b.top + 7)) <= 1]).toEqual([s, true]); }
  });
  test.each(['Split Squat', 'Split Squat (linki)'])('%s — u = 0 („wstań”): kolana ≤ 25° (było 56,8° / 55,7°; wyjątek zakresu biodra w figury-sens.json, uproszczenie jak Suspended Split Squat)', k => {
    const sk = frameAt(spec(k), 0).sk; for (const s of ['R', 'L'] as const) { const a = jointAngles(sk, s).knee; expect([k, s, a <= 25, r1(a)]).toEqual([k, s, true, r1(a)]); }
  });
});

describe('W5: przysiad jednonóż — wolna noga wyprostowana w przód', () => {
  test.each(['Pistol Squat', 'Smith Machine Pistol Squat'])('%s — kolano nogi wolnej ≤ 15° w całym ruchu (karta pistol.setup: „drugą wyprostuj w przód”; było 30,6–30,8°)', k => {
    for (const u of US) { const a = jointAngles(frameAt(spec(k), u).sk, 'L').knee; expect([k, u, a <= 15, r1(a)]).toEqual([k, u, true, r1(a)]); }
  });
});

describe('Ś1: Step Up / Barbell Step Up — bez wymachu piętą, na górze stopa na stopniu', () => {
  test.each(['Step Up', 'Barbell Step Up'])('%s — od u = 0,9 kostka L na stopniu (wysokość + 7 cm ± 1, w obrysie stopnia), kolano L w całym ruchu ≤ 105° (było 116°)', k => {
    const b = prop(k, 0, 'box') as unknown as { x0: number; x1: number; top: number };
    for (const u of US.filter(x => x >= 0.9)) { const a = frameAt(spec(k), u).sk.legs.L.ankle; expect([k, u, Math.abs(a[1] - (b.top + 7)) <= 1, a[0] > b.x0 + 5 && a[0] < b.x1 - 5]).toEqual([k, u, true, true]); }
    for (const u of US) { const a = jointAngles(frameAt(spec(k), u).sk, 'L').knee; expect([k, u, a <= 105, r1(a)]).toEqual([k, u, true, r1(a)]); }
  });
});

describe('Ś2: przysiad bułgarski — grzbiet tylnej stopy na ławce', () => {
  test.each(['Bulgarian Split Squat (hantle)', 'Bulgarian Split Squat (sztanga)', 'Smith Machine Bulgarian Split Squat'])('%s — palce tylnej stopy ≤ 1 cm od blatu ławki w całym ruchu (było 2,1 cm nad siedziskiem)', k => {
    for (const u of US) {
      const bench = prop(k, u, 'bench') as unknown as { seatFrom: number[] }; const d = frameAt(spec(k), u).sk.legs.L.toe[1] - bench.seatFrom[1];
      expect([k, u, Math.abs(d) <= 1, r1(d)]).toEqual([k, u, true, r1(d)]);
    }
  });
});

describe('N1: opisy wyjątków toru — ślad = tor miednicy', () => {
  const W = JSON.parse(fs.readFileSync(path.join(__dirname, 'tor-wyjatki.json'), 'utf8')) as Record<string, string>;
  test.each(['Pistol Squat|side', 'Single-Leg High Box Squat|side'])('%s — opis mówi „ślad = tor miednicy”, nie „ślad dłoni”', k => {
    expect(W[k]).toContain('ślad = tor miednicy'); expect(W[k]).not.toMatch(/^ślad dłoni/);
  });
});
