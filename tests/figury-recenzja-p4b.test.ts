/*
 * Figury v2 — poprawki po niezależnej recenzji ruchu 1.1 (27.10.2026, bramka 4, decyzja właściciela: wariant A): rodziny plyo, sled_throw, strongman, core_hang, core_standing.
 * Każdy błąd z recenzji ma test odtwarzający (poza zapisana w poses/<rodzina>.json mierzona silnikiem v2, nie opisem generatora):
 *  - niezmiennik „stopa w kontakcie z podłożem nie sunie” (wszystkie ćwiczenia pięciu rodzin; marsz w miejscu: stopa podporowa tylko do tyłu względem miednicy),
 *  - Split Jump, Alternate Leg Diagonal Bound, Lateral Bound, Side to Side Box Shuffle, oba Push-Off (plyo), Sled Push / Sled Drag / Yoke Walk (chód), Toes to Bar, oba Windmill i Bent Press,
 *  - błąd warunkowy W: rodzina plyo ma rzut z przodu (ruch boczny widać tylko z przodu),
 *  - „inne pozy bez zmian”: odcisk każdego ćwiczenia, którego recenzja nie dotyczyła, jest taki jak przed poprawką.
 * Rodzaje (docs/20): logika, scenariusze, macierz (każde ćwiczenie pięciu rodzin w niezmienniku), niezmienniki, dane, regresja.
 */
import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';
import { keyframeFrame, jointAngles, FAMILIES, type PoseData } from '@/lib/figures/v2';

jest.setTimeout(240000);
const ROOT = path.join(__dirname, '..');
type PoseFile = { cwiczenia: Record<string, PoseData> };
const load = (f: string): PoseFile => JSON.parse(fs.readFileSync(path.join(ROOT, 'lib/figures/v2/poses', `${f}.json`), 'utf8')) as PoseFile;
const FILES = ['plyo', 'sled_throw', 'strongman', 'core_hang', 'core_standing'] as const;
const POZY: Record<string, PoseFile> = Object.fromEntries(FILES.map((f) => [f, load(f)]));

type Box = { x0: number; x1: number; top: number; z: number; w: number };
const skrzynie = (d: PoseData): Box[] => d.sprzet.filter((g) => g.rodzaj === 'skrzynia').map((g) => ({ x0: g.x0 ?? 0, x1: g.x1 ?? 40, top: g.top ?? 40, z: g.z ?? 0, w: 45 }));
/** Wysokość podparcia pod punktem (x, z): blat skrzyni pod punktem albo podłoga (0). */
const podparcie = (b: Box[], x: number, z: number): number => b.reduce((h, k) => (x >= k.x0 && x <= k.x1 && z >= k.z - k.w / 2 && z <= k.z + k.w / 2 ? Math.max(h, k.top) : h), 0);

type Probka = { u: number; pelvis: number[]; R: Stopa; L: Stopa };
type Stopa = { ankle: number[]; sole: number; naSkrzyni: boolean; kontakt: boolean; toe: number[] };
const SIDES = ['R', 'L'] as const;
const N = 160;
const cache = new Map<string, Probka[]>();
/** Próbki ruchu (siatka co 1/N): pozycja miednicy i kostek, wysokość podeszwy nad podparciem (niższy z punktów pięta/palce), kontakt = podeszwa < 1,5 cm. */
function probki(d: PoseData): Probka[] {
  const k = `${d.rodzina}/${d.cwiczenie}`; const c = cache.get(k); if (c) return c;
  const b = skrzynie(d); const out: Probka[] = [];
  for (let i = 0; i <= N; i++) {
    const u = i / N; const sk = keyframeFrame(d, u).sk; const o = { u, pelvis: sk.pelvis as number[] } as Probka;
    for (const s of SIDES) { const l = sk.legs[s]; const pts = [l.heel, l.toe]; const sole = Math.min(...pts.map((p) => p[1] - podparcie(b, p[0], p[2]))); o[s] = { ankle: l.ankle as number[], toe: l.toe as number[], sole, naSkrzyni: podparcie(b, l.ankle[0], l.ankle[2]) > 0, kontakt: sole < 1.5 }; }
    out.push(o);
  }
  cache.set(k, out); return out;
}
/** Ciągłe odcinki kontaktu stopy (indeksy próbek). */
function odcinki(p: Probka[], s: 'R' | 'L'): [number, number][] {
  const r: [number, number][] = []; let a = -1;
  p.forEach((q, i) => { if (q[s].kontakt) { if (a < 0) a = i; } else if (a >= 0) { r.push([a, i - 1]); a = -1; } });
  if (a >= 0) r.push([a, p.length - 1]); return r;
}
const zakres = (v: number[]): number => Math.max(...v) - Math.min(...v);

/** Marsz w miejscu (figura stoi, podłoże „przesuwa się”): stopa podporowa porusza się względem miednicy tylko do tyłu (wzór: rodzina carry). */
const MARSZ = ['Sled Push', 'Sled Drag (Harness)', 'Yoke Walk'];
const TOL_SLIZG = 3; /* cm: stopa w kontakcie przesuwa się najwyżej o tyle (obrót stopy wokół kostki) */

const WSZYSTKIE = FILES.flatMap((f) => Object.keys(POZY[f].cwiczenia).map((c) => [f, c] as const));

describe('niezmiennik: stopa w kontakcie z podłożem nie sunie (pięć rodzin, każde ćwiczenie)', () => {
  test('macierz obejmuje wszystkie ćwiczenia z danych pięciu rodzin', () => { expect(WSZYSTKIE.length).toBe(55); });
  test.each(WSZYSTKIE.filter(([, c]) => !MARSZ.includes(c)))('%s / %s: kostka w kontakcie przesuwa się o ≤ 3 cm w osi x (widok z boku)', (f, c) => {
    const p = probki(POZY[f].cwiczenia[c]);
    for (const s of SIDES) for (const [a, b] of odcinki(p, s)) { const xs = p.slice(a, b + 1).map((q) => q[s].ankle[0]); expect({ c, s, u: [a / N, b / N], zakresX: Math.round(zakres(xs) * 10) / 10 }).toEqual(expect.objectContaining({ zakresX: expect.any(Number) })); expect(zakres(xs)).toBeLessThanOrEqual(TOL_SLIZG); }
  });
  test.each(WSZYSTKIE.filter(([f, c]) => f === 'plyo' && !MARSZ.includes(c)))('plyo / %s / %s: także w osi z (rodzina ma rzut z przodu)', (f, c) => {
    const p = probki(POZY[f].cwiczenia[c]);
    for (const s of SIDES) for (const [a, b] of odcinki(p, s)) expect(zakres(p.slice(a, b + 1).map((q) => q[s].ankle[2]))).toBeLessThanOrEqual(TOL_SLIZG);
  });
  test.each(MARSZ)('%s: stopa podporowa względem miednicy tylko do tyłu, oba kroki mają fazę podporu', (c) => {
    const f = c === 'Yoke Walk' ? 'strongman' : 'sled_throw'; const p = probki(POZY[f].cwiczenia[c]); let najdluzszy = 0;
    for (const s of SIDES) for (const [a, b] of odcinki(p, s)) {
      const rel = p.slice(a, b + 1).map((q) => q[s].ankle[0] - q.pelvis[0]);
      let wzrost = 0; for (let i = 0; i < rel.length; i++) for (let j = i + 1; j < rel.length; j++) wzrost = Math.max(wzrost, rel[j] - rel[i]);
      expect({ c, s, wzrost: Math.round(wzrost * 10) / 10 }).toEqual({ c, s, wzrost: expect.any(Number) }); expect(wzrost).toBeLessThanOrEqual(2);
      najdluzszy = Math.max(najdluzszy, rel[0] - rel[rel.length - 1]);
    }
    expect(najdluzszy).toBeGreaterThanOrEqual(c === 'Yoke Walk' ? 25 : 40); /* stopa podporowa naprawdę się cofa (krok), nie stoi */
    for (const s of SIDES) expect(odcinki(p, s).length).toBeGreaterThan(0);
  });
});

describe('Split Jump: odbicie wprost z wykroku (stopy stoją do oderwania), zamiana nóg w locie', () => {
  const d = POZY.plyo.cwiczenia['Split Jump']; const p = probki(d);
  test('przed lotem każda stopa w kontakcie stoi w miejscu (≤ 3 cm), nie zjeżdża ku drugiej', () => {
    const lot = p.findIndex((q) => !q.R.kontakt && !q.L.kontakt); expect(lot).toBeGreaterThan(10);
    for (const s of SIDES) { const o = odcinki(p, s)[0]; expect(o[0]).toBe(0); expect(zakres(p.slice(o[0], o[1] + 1).map((q) => q[s].ankle[0]))).toBeLessThanOrEqual(TOL_SLIZG); }
    const x0 = p[0].R.ankle[0] - p[0].L.ankle[0]; const xl = p[lot - 1].R.ankle[0] - p[lot - 1].L.ankle[0]; expect(Math.abs(xl - x0)).toBeLessThanOrEqual(6); /* rozkrok zachowany do chwili oderwania */
  });
  test('w locie nogi się mijają: prawa z przodu na starcie, z tyłu po lądowaniu (i odwrotnie lewa)', () => {
    expect(p[0].R.ankle[0]).toBeGreaterThan(p[0].L.ankle[0] + 40); expect(p[N].R.ankle[0]).toBeLessThan(p[N].L.ankle[0] - 40);
    expect(p[N].R.kontakt && p[N].L.kontakt).toBe(true);
  });
});

/** Ostatnie stopy w kontakcie przed najdłuższym lotem i pierwsze po nim. */
function lot(p: Probka[]): { przed: ('R' | 'L')[]; po: ('R' | 'L')[]; a: number; b: number } {
  let best: [number, number] = [-1, -1]; let a = -1;
  p.forEach((q, i) => { const w = !q.R.kontakt && !q.L.kontakt; if (w && a < 0) a = i; if ((!w || i === p.length - 1) && a >= 0) { const e = w ? i : i - 1; if (e - a > best[1] - best[0]) best = [a, e]; a = -1; } });
  const [x, y] = best; const ktore = (i: number): ('R' | 'L')[] => SIDES.filter((s) => p[Math.max(0, Math.min(p.length - 1, i))][s].kontakt) as ('R' | 'L')[];
  return { przed: ktore(x - 1), po: ktore(y + 1), a: x, b: y };
}
describe('skoki „z nogi na nogę” (Lateral Bound, Alternate Leg Diagonal Bound): wybicie z jednej nogi, lądowanie na drugiej, przemieszczenie widoczne z przodu', () => {
  test.each([['Lateral Bound', 60, 0], ['Alternate Leg Diagonal Bound', 30, 60]] as const)('%s', (c, dz, dx) => {
    const p = probki(POZY.plyo.cwiczenia[c]); const l = lot(p);
    expect(l.a).toBeGreaterThan(0); expect(l.przed.length).toBe(1); expect(l.po.length).toBe(1); expect(l.przed[0]).not.toBe(l.po[0]);
    expect(Math.abs(p[N].pelvis[2] - p[0].pelvis[2]) + 0).toBeGreaterThanOrEqual(dz); expect(Math.abs(p[N].pelvis[0] - p[0].pelvis[0])).toBeGreaterThanOrEqual(dx);
    expect(l.b - l.a).toBeGreaterThanOrEqual(8); /* realny lot, nie tylko oderwanie palców */
    /* stopa lądowania stoi po stronie kierunku skoku (dalej niż stopa wybicia) */
    const Z = (i: number, s: 'R' | 'L') => p[i][s].ankle[2]; expect(Math.abs(Z(N, l.po[0]) - Z(0, l.przed[0]))).toBeGreaterThanOrEqual(dz);
  });
  test('Single-Leg Lateral Hop (ta sama noga) pozostaje poprawny: wybicie i lądowanie na tej samej nodze', () => {
    const l = lot(probki(POZY.plyo.cwiczenia['Single-Leg Lateral Hop'])); expect(l.przed).toEqual(l.po);
  });
});

describe('Side to Side Box Shuffle: start z jedną stopą na skrzyni i drugą na podłodze, przeskok w bok z zamianą stóp', () => {
  const d = POZY.plyo.cwiczenia['Side to Side Box Shuffle']; const p = probki(d); const top = skrzynie(d)[0].top;
  test('u = 0: jedna stopa na blacie skrzyni, druga na podłodze obok (obie w kontakcie)', () => {
    const q = p[0]; expect(q.R.kontakt && q.L.kontakt).toBe(true); expect([q.R.naSkrzyni, q.L.naSkrzyni].filter(Boolean).length).toBe(1);
    const nb = q.R.naSkrzyni ? q.R : q.L; const pod = q.R.naSkrzyni ? q.L : q.R; expect(nb.toe[1]).toBeGreaterThan(top - 1); expect(pod.toe[1]).toBeLessThan(2);
  });
  test('u = 1: na skrzyni jest druga stopa, pierwsza stoi na podłodze po drugiej stronie', () => {
    const a = p[0], b = p[N]; expect(b.R.kontakt && b.L.kontakt).toBe(true); expect(b.R.naSkrzyni).toBe(!a.R.naSkrzyni); expect(b.L.naSkrzyni).toBe(!a.L.naSkrzyni);
    const strona = (q: Probka) => (q.R.naSkrzyni ? q.L : q.R).ankle[2] - (q.R.naSkrzyni ? q.R : q.L).ankle[2]; expect(Math.sign(strona(a))).toBe(-Math.sign(strona(b))); /* stopa podłogowa po przeciwnej stronie skrzyni */
  });
  test('w środku ruchu faza lotu (obie stopy nad podparciem)', () => { expect(lot(p).b - lot(p).a).toBeGreaterThanOrEqual(5); });
});

describe('Push-Off (Single / Alternate Leg): w u = 0 i u = 1 każda stopa stoi (podłoga albo skrzynia), nie wisi w powietrzu', () => {
  test.each(['Single Leg Push-Off', 'Alternate Leg Push-Off'])('%s', (c) => {
    const d = POZY.plyo.cwiczenia[c]; const p = probki(d); const top = skrzynie(d)[0].top;
    for (const i of [0, N]) for (const s of SIDES) expect({ c, u: i / N, s, sole: p[i][s].sole < 1.5 }).toEqual({ c, u: i / N, s, sole: true });
    for (const i of [0, N]) expect([p[i].R.naSkrzyni, p[i].L.naSkrzyni].filter(Boolean).length).toBe(1); /* jedna stopa na skrzyni (blat), druga na podłodze */
    expect(top).toBeGreaterThan(20);
    const lead = (i: number) => (p[i].R.naSkrzyni ? 'R' : 'L');
    if (c === 'Single Leg Push-Off') expect(lead(N)).toBe(lead(0)); else expect(lead(N)).not.toBe(lead(0)); /* Alternate: nogi zamienione */
  });
});

describe('rzut z przodu dla rodziny plyo (błąd warunkowy W): skoki w bok i Star Jump czytelne', () => {
  test('plyo ma widoki side i front (pierwszy = główny: side)', () => { const v = FAMILIES.find((x) => x.id === 'plyo')!.views; expect(v).toEqual(['side', 'front']); });
  test.each(['Lateral Cone Hops', 'Side Hop-Sprint', 'Side Standing Long Jump', 'Lateral Bound', 'Single-Leg Lateral Hop', 'Lateral Box Jump', 'Side to Side Box Shuffle'])('%s: ruch w osi z widoczny (≥ 30 cm)', (c) => {
    const p = probki(POZY.plyo.cwiczenia[c]); expect(zakres(p.map((q) => q.pelvis[2]))).toBeGreaterThanOrEqual(30);
  });
  test('Star Jump: rozkrok nóg w locie widoczny z przodu (rozstaw kostek ≥ 50 cm)', () => {
    const p = probki(POZY.plyo.cwiczenia['Star Jump']); expect(Math.max(...p.map((q) => Math.abs(q.R.ankle[2] - q.L.ankle[2])))).toBeGreaterThanOrEqual(50);
  });
});

describe('Sled Push / Sled Drag / Yoke Walk: chód jak w rodzinie carry (stopa podporowa cofa się, wykroczna idzie nad podłożem)', () => {
  test.each([['sled_throw', 'Sled Push'], ['sled_throw', 'Sled Drag (Harness)'], ['strongman', 'Yoke Walk']] as const)('%s / %s: noga wykroczna przechodzi do przodu NAD podłożem (≥ 6 cm), miednica nie faluje', (f, c) => {
    const p = probki(POZY[f].cwiczenia[c]);
    const wolne = SIDES.flatMap((s) => { const o = odcinki(p, s); return p.filter((_, i) => !o.some(([a, b]) => i >= a && i <= b)).map((q) => q[s].sole); }); /* w półkroku jedna stopa przenosi się nad podłożem */
    expect(Math.max(...wolne, 0)).toBeGreaterThanOrEqual(6);
    expect(zakres(p.map((q) => q.pelvis[1]))).toBeLessThanOrEqual(c === 'Yoke Walk' ? 8 : 12);
  });
  test('Yoke Walk: krótkie kroki pod ciężarem (rozstaw kostek w osi x ≤ 50 cm)', () => {
    const p = probki(POZY.strongman.cwiczenia['Yoke Walk']); expect(Math.max(...p.map((q) => Math.abs(q.R.ankle[0] - q.L.ankle[0])))).toBeLessThanOrEqual(50);
  });
});

describe('Toes to Bar: palce dochodzą do drążka (≤ 12 cm), Knee Raise i Leg Raise bez zmian', () => {
  const toe = (c: string, u: number) => { const d = POZY.core_hang.cwiczenia[c]; const sk = keyframeFrame(d, u).sk; const bar = d.sprzet.find((g) => g.rodzaj === 'sztanga')!; const t = [sk.legs.R.toe, sk.legs.L.toe]; return { dist: Math.min(...t.map((x) => Math.hypot(x[0] - (bar.x ?? 0), x[1] - (bar.y ?? 0)))), sk }; };
  test('u = 1: odległość palca od osi drążka ≤ 12 cm, biodro zgięte ≥ 120°, kolana wyprostowane', () => {
    const { dist, sk } = toe('Toes to Bar', 1); expect(dist).toBeLessThanOrEqual(12); const a = jointAngles(sk, 'R'); expect(a.hip).toBeGreaterThanOrEqual(120); expect(a.knee).toBeLessThanOrEqual(30);
  });
  test('na początku (zwis) palce są daleko od drążka; Hanging Leg Raise nie dochodzi do drążka (różni się od Toes to Bar)', () => {
    expect(toe('Toes to Bar', 0).dist).toBeGreaterThan(100); expect(toe('Hanging Leg Raise', 1).dist).toBeGreaterThan(40);
  });
  test('dłonie trzymają drążek przez cały ruch (ręce proste albo lekko ugięte, łokieć ≤ 30°)', () => {
    for (let i = 0; i <= 20; i++) { const sk = keyframeFrame(POZY.core_hang.cwiczenia['Toes to Bar'], i / 20).sk; expect(jointAngles(sk, 'R').elbow).toBeLessThanOrEqual(30); }
  });
});

describe('Kettlebell Windmill, Double Kettlebell Windmill, Bent Press (core_standing)', () => {
  const nad = (sk: ReturnType<typeof keyframeFrame>['sk'], s: 'R' | 'L') => sk.arms[s].grip[1];
  test.each(['Kettlebell Windmill', 'Double Kettlebell Windmill'])('%s: w u = 1 wolna dłoń ≤ 45 cm nad podłogą, biodro zgięte ≥ 60°, miednica wypchnięta w stronę ciężaru', (c) => {
    const d = POZY.core_standing.cwiczenia[c]; const sk1 = keyframeFrame(d, 1).sk; const sk0 = keyframeFrame(d, 0).sk;
    expect(nad(sk1, 'L')).toBeLessThanOrEqual(45); expect(jointAngles(sk1, 'R').hip).toBeGreaterThanOrEqual(60); expect(sk1.pelvis[2] - sk0.pelvis[2]).toBeGreaterThanOrEqual(5);
    expect(sk1.arms.R.grip[1]).toBeGreaterThan(sk1.arms.R.shoulder[1] + 55); /* ręka z ciężarem nad barkiem (pionowo) */
    expect(Math.abs(sk1.arms.R.grip[0] - sk1.arms.R.shoulder[0])).toBeLessThanOrEqual(12);
  });
  test('Bent Press: start z hantlem przy barku (łokieć ≥ 90°), koniec: ręka prosta nad głową, ruch w dół pod ciężarem (wolna dłoń ≤ 75 cm)', () => {
    const d = POZY.core_standing.cwiczenia['Bent Press']; const sk0 = keyframeFrame(d, 0).sk, sk1 = keyframeFrame(d, 1).sk;
    expect(jointAngles(sk0, 'R').elbow).toBeGreaterThanOrEqual(90); expect(jointAngles(sk1, 'R').elbow).toBeLessThanOrEqual(25);
    expect(nad(sk0, 'R')).toBeLessThan(sk0.arms.R.shoulder[1] + 20); expect(nad(sk1, 'R')).toBeGreaterThan(sk1.arms.R.shoulder[1] + 50); expect(nad(sk1, 'L')).toBeLessThanOrEqual(75);
  });
  test('Bent Press różni się od Kettlebell Windmill (nie ten sam ruch: start przy barku, nie nad głową)', () => {
    const a = keyframeFrame(POZY.core_standing.cwiczenia['Bent Press'], 0).sk.arms.R.grip[1], b = keyframeFrame(POZY.core_standing.cwiczenia['Kettlebell Windmill'], 0).sk.arms.R.grip[1]; expect(b - a).toBeGreaterThan(40);
  });
});

/** Odciski póz (sha1 JSON-u pozy, 12 znaków) PRZED poprawkami 27.10.2026 (origin/integracja-1-1). Ćwiczenia spoza listy POPRAWIONE nie mogą się zmienić; poprawione muszą się różnić. */
const PRZED: Record<string, Record<string, string>> = {
  plyo: {
    "Jump Squat": 'cf9484064994',
    "Tuck Jump": 'f27bff73cac6',
    "Double Leg Butt Kick": 'd4d76c2e9b54',
    "Star Jump": '9c83c461c118',
    "Box Jump": '6b840bba35c6',
    "Bench Jump": '569fcf268b22',
    "Broad Jump": 'a28789a73b45',
    "Frog Hops": '61c48092e6fb',
    "Front Cone Hops": 'e0d60f51ad35',
    "Single-Leg Hop Progression": '7dc96c463d08',
    "Single Leg Butt Kick": 'eb1208408cc9',
    "Box Skip": '0553c5ce35e4',
    "Single-Leg Stride Jump": '6d3b2324eaa2',
    "Weighted Jump Squat": 'ae8612aea268',
    "Alternate Leg Push-Off": 'a164cfe66572',
    "Single Leg Push-Off": 'e7441e931033',
    "Split Jump": 'cbbbd0d24840',
    "Alternate Leg Diagonal Bound": 'feaa15ada01b',
    "Depth Jump": 'a3949a7b56ab',
    "Dumbbell Seated Box Jump": '28bbc1e2de52',
    "Lateral Cone Hops": '8dc39600ca5d',
    "Side Hop-Sprint": 'a72b85b7970b',
    "Side Standing Long Jump": 'b99ab19d2692',
    "Lateral Bound": 'd1ab9b13d293',
    "Single-Leg Lateral Hop": '2f1d4dd98a64',
    "Lateral Box Jump": '7a1d5affb30a',
    "Side to Side Box Shuffle": '4ae4e20bf7ce',
  },
  sled_throw: {
    "Medicine Ball Slam": '47069f20e6eb',
    "One-Arm Medicine Ball Slam": '4c17a1e06ffd',
    "Standing Two-Arm Overhead Throw": 'ff087b720b9e',
    "Backward Medicine Ball Throw": '6c101d129537',
    "Medicine Ball Scoop Throw": '477c79d7849a',
    "Wall Ball": '07855217adfd',
    "Sled Push": 'b47e5f32f781',
    "Sled Drag (Harness)": '9859f373c666',
  },
  strongman: {
    "Yoke Walk": '6524de554a2b',
  },
  core_hang: {
    "Hanging Knee Raise": 'fbb0bd7f7348',
    "Hanging Leg Raise": '6f8b20e6e40b',
    "Toes to Bar": 'f5cd758c3c13',
  },
  core_standing: {
    "Barbell Side Bend": '8d341084a350',
    "Side Bend (hantel)": '19737e2f47dc',
    "One-Arm High-Pulley Cable Side Bends": '50aacaa61f00',
    "Weighted Ball Side Bend": '36d5021c7e76',
    "Bosu Ball Cable Crunch With Side Bends": '3bed3440c96f',
    "Russian Twist": '6e46b812dc9e',
    "Medicine Ball Full Twist": '1ea37fc76ceb',
    "Cable Russian Twists": '8fa954706f6e',
    "Pallof Press": 'c8046348bfdd',
    "Pallof Press With Rotation": '5b20d5c8391d',
    "Cable Woodchop": '4f69f791fb2a',
    "Cable Judo Flip": '85c4f8922b26',
    "Landmine Rotation": 'db65bb5a5063',
    "Kettlebell Windmill": 'fb53beb5345c',
    "Double Kettlebell Windmill": '129e5c2286b0',
    "Bent Press": '9fa40088e109',
  },
};
const POPRAWIONE: Record<string, string[]> = {"plyo":["Split Jump","Alternate Leg Diagonal Bound","Lateral Bound","Side to Side Box Shuffle","Single Leg Push-Off","Alternate Leg Push-Off"],"sled_throw":["Sled Push","Sled Drag (Harness)"],"strongman":["Yoke Walk"],"core_hang":["Toes to Bar"],"core_standing":["Kettlebell Windmill","Double Kettlebell Windmill","Bent Press"]};
describe('inne pozy bez zmian (regresja)', () => {
  const odcisk = (d: PoseData) => crypto.createHash('sha1').update(JSON.stringify(d)).digest('hex').slice(0, 12);
  const pary = FILES.flatMap((f) => Object.entries(PRZED[f]).map(([c, h]) => ({ f, c, h, zmiana: (POPRAWIONE[f] ?? []).includes(c) })));
  test('pięć rodzin: ten sam zbiór ćwiczeń co przed poprawką (nic nie zniknęło ani nie doszło); lista POPRAWIONE ma tylko istniejące ćwiczenia', () => {
    for (const f of FILES) expect(Object.keys(POZY[f].cwiczenia).sort()).toEqual(Object.keys(PRZED[f]).sort());
    for (const f of FILES) for (const c of POPRAWIONE[f] ?? []) expect(PRZED[f][c]).toBeDefined();
  });
  test.each(pary.filter((p) => !p.zmiana).map((p) => [p.f, p.c, p.h]))('%s / %s: poza bez zmian', (f, c, h) => { expect(odcisk(POZY[f].cwiczenia[c])).toBe(h); });
  test.each(pary.filter((p) => p.zmiana).map((p) => [p.f, p.c, p.h]))('%s / %s: poza poprawiona (różni się od pozy przed recenzją)', (f, c, h) => { expect(odcisk(POZY[f].cwiczenia[c])).not.toBe(h); });
});
