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
const SENS = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/zrodla/figury-sens.json'), 'utf8')) as { rodziny: Record<string, { zakres_wyjatki?: Record<string, unknown> }> };

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
  /* ponowna recenzja p4b (27.10.2026, nr 3): Toes to Bar zaczynał z nogami uniesionymi o 45° (biodro 45°), a nie ze zwisu */
  test.each(Object.keys(POZY.core_hang.cwiczenia))('%s: ruch zaczyna się ze zwisu (u = 0: biodro ≤ 15°, kostki pod barkami: przód ≤ 15 cm od pionu barku, stopy pod miednicą)', (c) => {
    const sk = keyframeFrame(POZY.core_hang.cwiczenia[c], 0).sk;
    for (const s of SIDES) { expect(jointAngles(sk, s).hip).toBeLessThanOrEqual(15); expect(Math.abs(sk.legs[s].ankle[0] - sk.shoulderC[0])).toBeLessThanOrEqual(15); }
    expect(sk.legs.R.ankle[1]).toBeLessThan(sk.pelvis[1] - 60);
  });
  test('dłonie trzymają drążek przez cały ruch (ręce proste albo lekko ugięte, łokieć ≤ 30°)', () => {
    for (let i = 0; i <= 20; i++) { const sk = keyframeFrame(POZY.core_hang.cwiczenia['Toes to Bar'], i / 20).sk; expect(jointAngles(sk, 'R').elbow).toBeLessThanOrEqual(30); }
  });
});

describe('Kettlebell Windmill, Double Kettlebell Windmill, Bent Press (core_standing)', () => {
  const nad = (k: ReturnType<typeof keyframeFrame>['sk'], s: 'R' | 'L') => k.arms[s].grip[1];
  const WIATRAKI = ['Kettlebell Windmill', 'Double Kettlebell Windmill'];
  const sk = (c: string, u: number) => keyframeFrame(POZY.core_standing.cwiczenia[c], u).sk;
  const siatka = (c: string, n = 40) => Array.from({ length: n + 1 }, (_, i) => sk(c, i / n));
  test.each(WIATRAKI)('%s: w u = 1 wolna dłoń ≤ 45 cm nad podłogą, biodro zgięte ≥ 60°, miednica wypchnięta w stronę ciężaru', (c) => {
    const sk1 = sk(c, 1), sk0 = sk(c, 0);
    expect(nad(sk1, 'L')).toBeLessThanOrEqual(45); expect(jointAngles(sk1, 'R').hip).toBeGreaterThanOrEqual(60); expect(sk1.pelvis[2] - sk0.pelvis[2]).toBeGreaterThanOrEqual(5);
    expect(sk1.arms.R.grip[1]).toBeGreaterThan(sk1.arms.R.shoulder[1] + 55); /* ręka z ciężarem nad barkiem (pionowo) */
    expect(Math.abs(sk1.arms.R.grip[0] - sk1.arms.R.shoulder[0])).toBeLessThanOrEqual(12);
  });
  /* ponowna recenzja p4b (27.10.2026, nr 4): dolna ręka (z kettlebellem albo wolna) wisiała na ugiętym ramieniu (łokieć 45°), 29 cm na zewnątrz od stopy */
  test.each(WIATRAKI)('%s: dolna ręka prosta w całym ruchu (łokieć ≤ 15°), dłoń przy wewnętrznej stronie nogi (≤ 10 cm na zewnątrz od kostki, ≤ 25 cm przed nią)', (c) => {
    for (const k of siatka(c)) expect(jointAngles(k, 'L').elbow).toBeLessThanOrEqual(15);
    const s1 = sk(c, 1); const g = s1.arms.L.grip, a = s1.legs.L.ankle; expect(g[2] - a[2]).toBeGreaterThanOrEqual(-10); expect(g[0] - a[0]).toBeLessThanOrEqual(25);
  });
  /* nr 4 (wyjątek zakresu): klatka skręca się ku ciężarowi (skretTulowia, w granicach kontraktu ±40°), a wyjątek zakresu barku ma PRAWDZIWE uzasadnienie i ścisły limit */
  test.each([...WIATRAKI, 'Bent Press'])('%s: klatka skręcona ku ciężarowi (skręt ≥ 30° w u = 1, ≤ 40° w całym ruchu), zgięcie barku ramienia z ciężarem nie przekracza zadeklarowanego wyjątku', (c) => {
    expect(jointAngles(sk(c, 1), 'R').trunkTwist).toBeGreaterThanOrEqual(30);
    const lim = (SENS.rodziny.core_standing.zakres_wyjatki?.[c] as { shSag: number }).shSag; let max = 0;
    for (const k of siatka(c, 80)) { const a = jointAngles(k, 'R'); expect(Math.abs(a.trunkTwist)).toBeLessThanOrEqual(40.5); max = Math.max(max, a.shSag); }
    expect(max).toBeLessThanOrEqual(lim); expect(lim - max).toBeLessThanOrEqual(6); /* limit wyjątku ścisły: zmierzone maksimum + najwyżej 6° */
  });
  test('wyjątek zakresu wiatraków i Bent Press: uzasadnienie nie twierdzi, że model nie ma obrotu klatki (ma: skretTulowia), tylko wskazuje skręt ku ciężarowi i granicę kontraktu', () => {
    for (const c of [...WIATRAKI, 'Bent Press']) { const w = SENS.rodziny.core_standing.zakres_wyjatki?.[c] as { powod: string }; expect(w.powod).not.toMatch(/model nie ma obrotu/i); expect(w.powod).toMatch(/skręt/); expect(w.powod).toMatch(/granic/); }
  });
  /* ponowna recenzja p4b (nr 1): Bent Press = ciało schodzi w skłon POD (względnie) nieruchomym ciężarem; łokieć na starcie przy boku tułowia */
  test('Bent Press (konwencja „ciężar stoi”): wysokość hantla zmienia się ≤ 15 cm, a barki opadają ≥ 25 cm i co najmniej 2 razy więcej niż hantel', () => {
    const k = siatka('Bent Press', 80); const h = k.map((x) => x.arms.R.grip[1]); const b = k.map((x) => x.shoulderC[1]);
    const zmianaHantla = Math.max(...h) - Math.min(...h); const spadekBarkow = b[0] - Math.min(...b);
    expect({ zmianaHantla: Math.round(zmianaHantla * 10) / 10, spadekBarkow: Math.round(spadekBarkow * 10) / 10 }).toEqual({ zmianaHantla: expect.any(Number), spadekBarkow: expect.any(Number) });
    expect(zmianaHantla).toBeLessThanOrEqual(15); expect(spadekBarkow).toBeGreaterThanOrEqual(25); expect(spadekBarkow).toBeGreaterThanOrEqual(2 * zmianaHantla);
  });
  test('Bent Press: start z hantlem przy barku, łokieć przy boku tułowia (zgięty ≥ 90°, odwiedzenie ramienia ≤ 30°, łokieć ≥ 15 cm poniżej barku); koniec: ręka prosta nad głową, wolna dłoń ≤ 75 cm', () => {
    const sk0 = sk('Bent Press', 0), sk1 = sk('Bent Press', 1); const a0 = jointAngles(sk0, 'R');
    expect(a0.elbow).toBeGreaterThanOrEqual(90); expect(a0.shAbd).toBeLessThanOrEqual(30); expect(sk0.shoulderC[1] - sk0.arms.R.elbow[1]).toBeGreaterThanOrEqual(15);
    expect(jointAngles(sk1, 'R').elbow).toBeLessThanOrEqual(25);
    expect(nad(sk0, 'R')).toBeLessThan(sk0.arms.R.shoulder[1] + 20); expect(nad(sk1, 'R')).toBeGreaterThan(sk1.arms.R.shoulder[1] + 50); expect(nad(sk1, 'L')).toBeLessThanOrEqual(75);
  });
  /* ponowna recenzja p4b r2 (nr 1, 1b): ciężar stoi nad stopami (≤ 15 cm w poziomie), przedramię pionowo, ciało schodzi pod ciężar */
  test('Bent Press: chwyt przesuwa się w poziomie ≤ 15 cm od startu, przedramię ≤ 15° od pionu w całym ruchu, miednica cofnięta w tył ≥ 15 cm', () => {
    const k = siatka('Bent Press', 80); const g0 = k[0].arms.R.grip; let dMax = 0, tMax = 0;
    for (const x of k) { const g = x.arms.R.grip; dMax = Math.max(dMax, Math.hypot(g[0] - g0[0], g[2] - g0[2])); const a = x.arms.R; const d = [a.wrist[0] - a.elbow[0], a.wrist[1] - a.elbow[1], a.wrist[2] - a.elbow[2]]; tMax = Math.max(tMax, (Math.acos(d[1] / Math.hypot(d[0], d[1], d[2])) * 180) / Math.PI); }
    expect(dMax).toBeLessThanOrEqual(15); expect(tMax).toBeLessThanOrEqual(15); expect(Math.min(...k.map((x) => x.pelvis[0]))).toBeLessThanOrEqual(-15);
  });
  test.each([...WIATRAKI])('%s: miednica cofnięta w tył ≥ 10 cm (biodro w tył, nie nad kostkami)', (c) => { expect(Math.min(...siatka(c).map((x) => x.pelvis[0]))).toBeLessThanOrEqual(-10); });
  test('Bent Press różni się od Kettlebell Windmill (nie ten sam ruch: start przy barku, nie nad głową)', () => {
    expect(nad(sk('Kettlebell Windmill', 0), 'R') - nad(sk('Bent Press', 0), 'R')).toBeGreaterThan(40);
  });
});

/** Odciski póz (sha1 JSON-u pozy, 12 znaków) PRZED poprawkami 27.10.2026 (origin/integracja-1-1). Ćwiczenia spoza listy POPRAWIONE nie mogą się zmienić; poprawione muszą się różnić. */
const PRZED: Record<string, Record<string, string>> = {
  plyo: {
    "Jump Squat": '1b9cd924f7c3',
    "Tuck Jump": 'd57f8a21d4fb',
    "Double Leg Butt Kick": 'b903a460dd19',
    "Star Jump": '0bf153c75e54',
    "Box Jump": '0daa87a2a361',
    "Bench Jump": 'b4964fa7efbc',
    "Broad Jump": '8da050aa73b2',
    "Frog Hops": '5b2d6701e8d2',
    "Front Cone Hops": 'a4ca1a1b4e97',
    "Single-Leg Hop Progression": 'b51577051d3d',
    "Single Leg Butt Kick": '181d08af42ee',
    "Box Skip": '1d655e4beb4c',
    "Single-Leg Stride Jump": '6318f58da6c7',
    "Weighted Jump Squat": '9122745539be',
    "Alternate Leg Push-Off": 'a164cfe66572',
    "Single Leg Push-Off": 'e7441e931033',
    "Split Jump": 'cbbbd0d24840',
    "Alternate Leg Diagonal Bound": 'feaa15ada01b',
    "Depth Jump": 'a3949a7b56ab',
    "Dumbbell Seated Box Jump": '549c7b1b5de8',
    "Lateral Cone Hops": '549786d88f25',
    "Side Hop-Sprint": 'e724c8c69959',
    "Side Standing Long Jump": '0ce9259d6396',
    "Lateral Bound": 'd1ab9b13d293',
    "Single-Leg Lateral Hop": '0ca98b1eadfc',
    "Lateral Box Jump": 'c7bfd0e572cd',
    "Side to Side Box Shuffle": '4ae4e20bf7ce',
  },
  sled_throw: {
    "Medicine Ball Slam": 'ac30c06e1ac9',
    "One-Arm Medicine Ball Slam": 'a454a64702e6',
    "Standing Two-Arm Overhead Throw": '42937c7a3181',
    "Backward Medicine Ball Throw": '44bf63109ef3',
    "Medicine Ball Scoop Throw": '60c002cfce14',
    "Wall Ball": 'f7b7b8426ed0',
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
const POPRAWIONE: Record<string, string[]> = {"plyo":["Depth Jump","Split Jump","Alternate Leg Diagonal Bound","Lateral Bound","Side to Side Box Shuffle","Single Leg Push-Off","Alternate Leg Push-Off"],"sled_throw":["Sled Push","Sled Drag (Harness)"],"strongman":["Yoke Walk"],"core_hang":["Toes to Bar"],"core_standing":["Kettlebell Windmill","Double Kettlebell Windmill","Bent Press"]};
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
