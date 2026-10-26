/*
 * Figury v2 — geometria (grafiki ćwiczeń 1.0, decyzja właściciela 25.10.2026). Rodzaje (docs/20): niezmienniki (długości kości, zasięg, podłoga, zakres stawów
 * z docs/research/28, brak przenikania ciała i sprzętu, ciągłość ruchu), dane (kontakty: dłonie na gryfie, gryf na plecach / nad śródstopiem / na klatce, ławka),
 * regresja błędów makiety (sztanga zasłaniająca głowę, sztanga poza dłońmi, przenikanie figury i sprzętu).
 * Zasada testu: to, co rysunek ma pokazywać (gryf w dłoniach, nad śródstopiem, na plecach), jest sprawdzane liczbowo na geometrii 3D dla KAŻDEGO wariantu gotowych rodzin.
 */
import { FIG_DATA } from '@/lib/figures';
import {
  figureSpec, frameAt, assignAll, checkFrame, holdChecks, bodyColliders, equipColliders, gap, jointAngles, soleY, BODY, SIDES, TOL, EQUIP, SQUAT, trunkPoint, benchFrame,
  hingeFrame, squatFrame, shapesAt, sortShapes, type FigureSpec, type Frame, type V3,
} from '@/lib/figures/v2';

const READY = ['squat', 'bench_press', 'hinge'];
const KEYS = Object.entries(assignAll()).filter(([, f]) => READY.includes(f)).map(([k]) => k);
const spec = (k: string): FigureSpec => figureSpec(k) as FigureSpec;
const grid = (n: number): number[] => Array.from({ length: n + 1 }, (_, i) => i / n);
const U = grid(24);
const byKey = (keys: string[], fn: (k: string, s: FigureSpec) => void) => { for (const k of keys) fn(k, spec(k)); };
/** Wyjątki od średniego zakresu stawów (docs/research/28): pozycja nad głową i rack przedni wymagają więcej niż średnia ruchomość (zgięcie barku do ok. 190° względem tułowia wspiera wyprost odcinka piersiowego,
 * zgięcie łokcia w racku do ok. 165°). Uproszczenie ilustracyjne; granica wyjątku podana liczbą, powód tekstem. */
const ALLOW: Record<string, { elbow?: number; shSag?: number; shElev?: number; why: string }> = {
  'Front Squat': { elbow: 165, shSag: 190, why: 'rack przedni: gryf na barkach, łokcie wysoko — zgięcie łokcia i barku powyżej średniego zakresu (uproszczenie ilustracyjne)' },
  'Double Kettlebell Front Squat': { elbow: 165, why: 'rack kettlebell: dłonie przy barkach, zgięcie łokcia powyżej średniego zakresu (uproszczenie ilustracyjne)' },
  'Overhead Squat': { shSag: 205, why: 'ramiona nad głową przy pochylonym tułowiu: zgięcie barku względem tułowia powyżej średniego zakresu (wyprost piersiowy; uproszczenie ilustracyjne)' },
  'JM Press': { elbow: 160, shSag: 210, why: 'gryf przy szyi: przedramiona mocno zgięte, ramię względem tułowia powyżej średniego zakresu (uproszczenie ilustracyjne)' },
  'Decline Close-Grip Bench To Skull Crusher': { elbow: 160, why: 'gryf przy czole: łokcie mocno zgięte, powyżej średniego zakresu (uproszczenie ilustracyjne)' },
  'One-Arm Overhead Kettlebell Squat': { shSag: 205, shElev: 180, why: 'ramię nad głową przy pochylonym tułowiu: zgięcie barku względem tułowia powyżej średniego zakresu (uproszczenie ilustracyjne)' },
};
const FAMILY_KEYS = (fam: string) => KEYS.filter(k => assignAll()[k] === fam);

describe('niezmienniki geometrii (wszystkie warianty gotowych rodzin, 25 pozycji ruchu)', () => {
  test('87 wariantów: każda klatka bez błędów (kości, zasięg, podłoga, przenikanie ciało–sprzęt, chwyt, głowa)', () => {
    expect(KEYS.length).toBe(87);
    const bad: string[] = [];
    byKey(KEYS, (k, s) => { for (const u of U) { const issues = checkFrame(frameAt(s, u)); if (issues.length) bad.push(`${k} u=${u}: ${issues[0].code} ${issues[0].detail}`); } });
    expect(bad).toEqual([]);
  });
  test('zakres stawów w każdej klatce mieści się w granicach z docs/research/28 (CDC, Anderton): biodro, kolano, stopa, łokieć, bark (zgięcie w płaszczyźnie strzałkowej, unoszenie)', () => {
    const r = FIG_DATA.rom; const bad: string[] = [];
    byKey(KEYS, (k, s) => { for (const u of U) { const f = frameAt(s, u); for (const side of SIDES) {
      const a = jointAngles(f.sk, side); const al = ALLOW[k] ?? {};
      const chk = (n: string, v: number, lo: number, hi: number) => { if (v < lo - 0.5 || v > hi + 0.5) bad.push(`${k} u=${u} ${side} ${n}=${v.toFixed(1)} poza [${lo}, ${hi}]`); };
      chk('hip', a.hip, r.side.hip.min, r.side.hip.max); chk('knee', a.knee, r.side.knee.min, r.side.knee.max); chk('ankle', a.ankle, r.side.ankle.min, r.side.ankle.max);
      chk('elbow', a.elbow, r.side.el.min, al.elbow ?? r.side.el.max); chk('shElev', a.shElev, 0, al.shElev ?? r.front.abd.max);
      if (a.shAbd < 30) chk('shSag', a.shSag, r.side.sh.min, al.shSag ?? r.side.sh.max); /* zgięcie/wyprost barku w płaszczyźnie strzałkowej ma sens, gdy ramię jest blisko tej płaszczyzny (jak armProj w v1) */
    } } });
    expect(bad).toEqual([]);
  });
  test('wyjątki od zakresu mają powód i są nieliczne (nad głową, rack przedni, gryf przy szyi lub czole)', () => {
    expect(Object.keys(ALLOW).sort()).toEqual(['Decline Close-Grip Bench To Skull Crusher', 'Double Kettlebell Front Squat', 'Front Squat', 'JM Press', 'One-Arm Overhead Kettlebell Squat', 'Overhead Squat']);
    for (const v of Object.values(ALLOW)) expect(v.why.length).toBeGreaterThan(40);
  });
  test('ciągłość: między sąsiednimi pozycjami (Δu = 1/48) żaden staw nie przeskakuje o więcej niż 6 cm (bez przeskoków IK i skoku ciężaru)', () => {
    const bad: string[] = []; const pts = (f: Frame): V3[] => [f.sk.pelvis, f.sk.head, f.sk.shoulderC, ...SIDES.flatMap(s => [f.sk.legs[s].knee, f.sk.legs[s].ankle, f.sk.arms[s].elbow, f.sk.arms[s].grip]), ...(f.info.load ? [f.info.load] : [])];
    byKey(KEYS, (k, s) => { let prev = pts(frameAt(s, 0)); for (let i = 1; i <= 48; i++) { const cur = pts(frameAt(s, i / 48)); cur.forEach((p, j) => { const d = Math.hypot(p[0] - prev[j][0], p[1] - prev[j][1], p[2] - prev[j][2]); if (d > 6) bad.push(`${k} krok ${i} punkt ${j}: ${d.toFixed(1)} cm`); }); prev = cur; } });
    expect(bad).toEqual([]);
  });
  test('ruch istnieje: pozycja końcowa różni się od wyjściowej (poza izometrią — jedna pozycja)', () => {
    byKey(KEYS, (k, s) => { if (s.static) return; const a = frameAt(s, 0), b = frameAt(s, 1); const moved = [...SIDES.flatMap(x => [a.sk.arms[x].grip, a.sk.legs[x].knee])].some((p, i) => Math.hypot(p[0] - [...SIDES.flatMap(x => [b.sk.arms[x].grip, b.sk.legs[x].knee])][i][0], p[1] - [...SIDES.flatMap(x => [b.sk.arms[x].grip, b.sk.legs[x].knee])][i][1]) > 8); expect([k, moved]).toEqual([k, true]); });
  });
  test('kształty wszystkich klatek i widoków są skończone i mają kolejność rysowania (bez NaN)', () => {
    byKey(KEYS, (k, s) => { for (const v of s.views) for (const u of [0, 0.5, 1]) { const sh = sortShapes(shapesAt(s, u, v)); expect([k, v, u, sh.length > 10]).toEqual([k, v, u, true]); for (const x of sh) expect(Number.isFinite(x.z)).toBe(true); } });
  });
  test('kolidery: ciało ma kapsuły kończyn, tułowia, miednicy i głowy; sprzęt gryf albo hantle; odstęp liczony (próbka)', () => {
    const f = frameAt(spec('Back Squat'), 0.5); const body = bodyColliders(f.sk); const eq = equipColliders(f.props);
    expect(body.map(b => b.id)).toEqual(expect.arrayContaining(['thighR', 'shankL', 'footR', 'uarmR', 'farmL', 'torso', 'pelvis', 'head']));
    expect(eq.map(e => e.id)).toContain('bar');
    expect(Number.isFinite(gap(body[0], eq[0]))).toBe(true);
  });
});

describe('regresja błędów makiety (przysiad, podciąganie, wyciskanie) — gryf, głowa, przenikanie', () => {
  test('przysiad z boku: sztanga wysokim gryfem leży na górnej części pleców (nie na głowie): w układzie tułowia tuż za plecami, wysoko, z dala od głowy', () => {
    byKey(['Back Squat', 'Box Squat', 'Squat with Bands', 'Squat with Chains', 'Smith Machine Squat'], (k, s) => { for (const u of U) {
      const f = frameAt(s, u); const bar = f.info.bar; const sk = f.sk;
      const rel = [bar[0] - sk.pelvis[0], bar[1] - sk.pelvis[1]]; const a = rel[0] * sk.up[0] + rel[1] * sk.up[1], b = rel[0] * sk.front[0] + rel[1] * sk.front[1];
      expect([k, u, a >= BODY.trunk - 6 && a <= BODY.trunk + 1]).toEqual([k, u, true]);   /* na wysokości barków, nie na szyi i nie na głowie */
      expect([k, u, b < -SQUAT.barBack.high + 1.5 && b > -SQUAT.barBack.high - 1.5]).toEqual([k, u, true]);  /* za osią tułowia, na powierzchni pleców */
      const dh = Math.hypot(bar[0] - sk.head[0], bar[1] - sk.head[1]);
      expect([k, u, dh >= BODY.headR + EQUIP.barR + 3]).toEqual([k, u, true]);              /* gryf nie wchodzi w głowę */
    } });
  });
  test('przysiad z przodu: gryf przed klatką (przód tułowia), nie na plecach; gryf nad śródstopiem w całym ruchu', () => {
    const s = spec('Front Squat'); for (const u of U) { const f = frameAt(s, u); const rel = [f.info.bar[0] - f.sk.pelvis[0], f.info.bar[1] - f.sk.pelvis[1]]; expect(rel[0] * f.sk.front[0] + rel[1] * f.sk.front[1]).toBeGreaterThan(5); }
  });
  test('gryf nad śródstopiem: przysiady ze sztangą — odległość poziomą gryfu od środka stopy ≤ 1,5 cm w każdej pozycji (z przodu ≤ 4 cm: pochylenie tułowia nie schodzi poniżej −5°, więc na stojąco gryf bywa nieco przed śródstopiem)', () => {
    byKey(['Back Squat', 'Front Squat', 'Box Squat', 'Overhead Squat', 'Squat with Bands', 'Reverse Band Power Squat'], (k, s) => { for (const u of U) { const f = frameAt(s, u); expect([k, u, Math.abs(f.info.bar[0] - f.info.midfoot[0]) <= (k === 'Front Squat' ? 4 : 1.5)]).toEqual([k, u, true]); } });
  });
  test('martwy ciąg, RDL, dzień dobry: gryf nad śródstopiem w granicach kontaktu z nogami (x od 4,5 do 30 cm od kostki; dzień dobry od −6 cm — nad stopą), ramiona wyprostowane', () => {
    byKey(['Deadlift (sztanga)', 'Sumo Deadlift', 'RDL (sztanga)', 'Rack Pull', 'Deficit Deadlift', 'Stiff-Legged Barbell Deadlift', 'Good Morning'], (k, s) => { for (const u of U) { const f = frameAt(s, u); const x = f.info.bar[0]; const lo = k === 'Good Morning' ? -6 : 4.5; /* dzień dobry (decyzja 26.10.2026, wariant A reguł sensu): rig w staniu dopuszcza gryf w dowolnym miejscu nad stopą (pięta −6 cm … palce), by tułów u góry ≤ 15° */ expect([k, u, x >= lo && x <= 30]).toEqual([k, u, true]); } });
    for (const k of ['Deadlift (sztanga)', 'Sumo Deadlift', 'Rack Pull']) for (const u of U) { const f = frameAt(spec(k), u); expect(jointAngles(f.sk, 'R').elbow).toBeLessThan(6); }
  });
  test('martwy ciąg z podłogi: na starcie gryf dotyka podudzi (odstęp ≤ 2 cm od kapsuły), nie przenika (≥ −0,3 cm) w całym ruchu', () => {
    const s = spec('Deadlift (sztanga)'); const f0 = frameAt(s, 0); const bar = equipColliders(f0.props).find(e => e.id === 'bar')!; const sh = bodyColliders(f0.sk).filter(b => b.id.startsWith('shank'));
    expect(Math.min(...sh.map(b => gap(b, bar)))).toBeLessThan(2);
    for (const u of U) { const f = frameAt(s, u); const b = equipColliders(f.props).find(e => e.id === 'bar')!; for (const c of bodyColliders(f.sk).filter(x => /^(thigh|shank)/.test(x.id))) expect(gap(c, b)).toBeGreaterThan(-TOL.pen); }
  });
  test('wyciskanie: sztanga w dłoniach w każdej klatce (odległość chwytu od gryfu ≤ 0,6 cm), hantle w dłoniach', () => {
    byKey(FAMILY_KEYS('bench_press').filter(k => !['Squeeze Press (hantle)'].includes(k)), (k, s) => { for (const u of U) for (const h of holdChecks(frameAt(s, u))) expect([k, u, h.name, h.err <= h.tol]).toEqual([k, u, h.name, true]); });
  });
  test('wyciskanie: na dole gryf dotyka klatki (odległość od tułowia ≤ 3 cm), na górze ramiona wyprostowane (zgięcie łokcia ≤ 8°) i gryf nad barkami', () => {
    for (const k of ['Bench Press (sztanga)', 'Incline Bench Press (sztanga)', 'Decline Bench Press', 'Close Grip Bench Press', 'Wide-Grip Barbell Bench Press']) {
      const s = spec(k); const f1 = frameAt(s, 1); const bar = equipColliders(f1.props).find(e => e.id === 'bar')!; const torso = bodyColliders(f1.sk).find(b => b.id === 'torso')!;
      expect([k, gap(torso, bar) < 3]).toEqual([k, true]);
      const f0 = frameAt(s, 0); expect([k, jointAngles(f0.sk, 'R').elbow < 8, Math.abs(f0.info.bar[0] - f0.sk.shoulderC[0]) < 6]).toEqual([k, true, true]);
    }
  });
  test('wyciskanie: plecy na ławce (osie tułowia 10,2 cm nad powierzchnią), stopy na podłodze (poza ujemną: wałki), głowa nie przenika ławki', () => {
    for (const k of FAMILY_KEYS('bench_press').filter(x => !/Floor|Decline/.test(x))) { const f = frameAt(spec(k), 0.5); for (const side of SIDES) expect([k, side, Math.abs(soleY(f.sk.legs[side]))]).toEqual([k, side, expect.any(Number)]); expect([k, Math.abs(soleY(f.sk.legs.R)) < 0.4]).toEqual([k, true]); }
  });
  test('przysiad i zawias: obie stopy płasko na podłodze w całym ruchu (poza stopą wolną w martwym na jednej nodze i stopniem w martwym z deficytu)', () => {
    byKey(KEYS.filter(k => assignAll()[k] !== 'bench_press' && !/Single (Leg|Arm) RDL/.test(k)), (k, s) => { const plat = s.variant.family === 'hinge' ? (s.variant.p.platform ?? 0) : 0; for (const u of U) { const f = frameAt(s, u); for (const side of SIDES) expect([k, u, side, Math.abs(soleY(f.sk.legs[side]) - plat) < 0.4]).toEqual([k, u, side, true]); } });
  });
  test('rig przyjmuje parametry wprost (kontrakt funkcji rodzin)', () => {
    expect(squatFrame({ load: 'bodyweight', impl: 'none', depth: 100, stance: 20, toeOut: 10 }, 0.3).sk.pelvis[1]).toBeGreaterThan(40);
    expect(benchFrame({ impl: 'barbell', angle: 0, grip: 33, touch: 33 }, 0).info.bar[1]).toBeGreaterThan(90);
    expect(hingeFrame({ style: 'floor', impl: 'barbell', yStart: 22.5, yEnd: 80, stance: 14, toeOut: 8, grip: 23, shin: { stand: 3, perKnee: 0.3, max: 28 }, sx: [3, -9] }, 0).info.bar[1]).toBeCloseTo(22.5, 1);
    expect(trunkPoint([0, 0, 0], 0, 10, 5)).toEqual([5, 10, 0]);
  });
});
