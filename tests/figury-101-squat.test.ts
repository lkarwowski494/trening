/*
 * Linia 1.0.1, pakiet C (przysiady; 29.10.2026; L-056 A — każda poprawka ma dwie miary: naprawianą cechę i styk ciężar–ciało, kadry co 0,05).
 * 101-09 Zercher Squat: gryf w zgięciach łokci przez cały ruch. 101-10 Sumo Squat (hantel): pionowy tor pod barkami.
 * 101-11 Overhead Squat / One-Arm Overhead Kettlebell Squat: wyjątek kontraktu barku (reguła zależna od pochylenia tułowia).
 */
import { FIG_DATA } from '@/lib/figures';
import { figureSpec, frameAt, proj, jointAngles, bodyColliders, equipColliders, gap, distSegSeg, SIDES, assignAll, validatePose, exampleFor, overheadShoulderRange, trunkLeanDeg, OVERHEAD_SHOULDER_EXCEPTION, type Frame, type RomData, type Collider } from '@/lib/figures/v2';
import { KADRY_STYKU, dwieMiary } from './helpers/styk-figur';
import * as fs from 'fs';
import * as path from 'path';

const spec = (k: string) => figureSpec(k)!;
const bar = (f: Frame) => equipColliders(f.props).find(c => c.id === 'bar' && c.k === 'capsule') as Extract<Collider, { k: 'capsule' }>;

describe('101-09 Zercher Squat: gryf w zgięciach łokci', () => {
  /** Największa odległość osi gryfu od stawu łokciowego (cm), z obu rąk, na kadrach co 0,05. */
  const odlLokiec = (k: string, kadry: readonly number[]): number => Math.max(...kadry.flatMap(u => { const f = frameAt(spec(k), u); const b = bar(f); return SIDES.map(s => distSegSeg(f.sk.arms[s].elbow, f.sk.arms[s].elbow, b.a, b.b)); }));
  const m = dwieMiary('Zercher Squat', odlLokiec);
  test('miara 1 (cecha): oś gryfu najwyżej 9 cm od stawu łokciowego na każdym kadrze (gryf leży w zgięciu: promień ramienia 4,7 + gryf 1,4 = 6,1 cm od osi kości, dwusieczna kąta 8 cm od stawu; było 18,5 cm)', () => {
    expect(m.cecha).toBeLessThanOrEqual(9);
  });
  test('miara 1b: gryf nie opuszcza zgięcia też w pionie — odstęp od najbliższego przedramienia lub ramienia ≤ 1,5 cm na każdym kadrze (było ok. 12 cm pod przedramionami na dole)', () => {
    const najdalszy = Math.max(...KADRY_STYKU.map(u => { const f = frameAt(spec('Zercher Squat'), u); const b = bar(f); const ciala = bodyColliders(f.sk).filter(c => /^(uarm|farm)/.test(c.id)); return Math.min(...ciala.map(c => gap(c, b))); }));
    expect(najdalszy).toBeLessThanOrEqual(1.5);
  });
  test('miara 2 (styk): gryf nie przenika ud, podudzi, tułowia ani miednicy (≤ 0,5 cm); w zgięciu łokcia obie kości ramienia i przedramienia ≥ 1,8 cm od osi gryfu, a wejście w miękką tkankę najwyżej 3,5 cm (promienie ramienia 4,7 + gryf 1,4 przy zgięciu ok. 130°)', () => {
    expect(m.styk.maxPrzenikanie).toBeLessThanOrEqual(0.5);
    let kosc = Infinity, wglab = 0;
    for (const u of KADRY_STYKU) {
      const f = frameAt(spec('Zercher Squat'), u); const b = bar(f);
      for (const s of SIDES) { const A = f.sk.arms[s]; kosc = Math.min(kosc, distSegSeg(A.shoulder, A.elbow, b.a, b.b), distSegSeg(A.elbow, A.wrist, b.a, b.b)); }
      wglab = Math.max(wglab, -Math.min(...bodyColliders(f.sk).filter(c => /^(uarm|farm)/.test(c.id)).map(c => gap(c, b))));
    }
    expect(kosc).toBeGreaterThanOrEqual(1.8); expect(wglab).toBeLessThanOrEqual(3.5);
  });
  test('miara potrafi paść: gryf przesunięty o 20 cm w dół (jak na dawnym rigu, na udach) przekracza próg odległości od łokcia', () => {
    const f = frameAt(spec('Zercher Squat'), 1); const b = bar(f); const el = f.sk.arms.R.elbow;
    expect(distSegSeg(el, el, [b.a[0], b.a[1] - 20, b.a[2]], [b.b[0], b.b[1] - 20, b.b[2]])).toBeGreaterThan(9);
  });
});

describe('101-10 Sumo Squat (hantel): pionowy tor pod barkami', () => {
  const K = 'Sumo Squat (hantel)';
  /** Miara 1: najwyższe odchylenie poziome hantla od osi barków (cm) na kadrach co 0,05 i kąt łączącej pierwszy i ostatni kadr od pionu (stopnie). */
  const tor = (kadry: readonly number[]) => { const fr = kadry.map(u => frameAt(spec(K), u)); const xs = fr.map(f => f.info.load[0]); const ys = fr.map(f => f.info.load[1]);
    return { poBarkach: Math.max(...fr.map(f => Math.abs(f.info.load[0] - f.sk.shoulderC[0]))), kat: Math.abs(Math.atan2(xs[xs.length - 1] - xs[0], ys[0] - ys[ys.length - 1]) * 180 / Math.PI), rozrzut: Math.max(...xs) - Math.min(...xs) }; };
  const m = dwieMiary(K, (_k, kadry) => tor(kadry).poBarkach);
  test('miara 1 (cecha): hantel najwyżej 10 cm przed osią barków (ręce ≤ 9° od pionu; stałe 9 cm — hantel zwisa przed pachwiną, nie w tułowiu), kąt toru od pionu ≤ 8°, rozrzut poziomy ≤ 6 cm; było ok. 26° od pionu, 24 cm w tył', () => {
    expect(m.cecha).toBeLessThanOrEqual(10);
    const t = tor(KADRY_STYKU); expect(t.kat).toBeLessThanOrEqual(8); expect(t.rozrzut).toBeLessThanOrEqual(6);
  });
  test('miara 1b: ręce prawie proste (zgięcie łokcia ≤ 35°), hantel pod barkami niżej o 45–65 cm (zasięg rąk 61 cm)', () => {
    for (const u of KADRY_STYKU) { const f = frameAt(spec(K), u); const d = f.sk.shoulderC[1] - f.info.load[1]; expect([u, d >= 45 && d <= 65]).toEqual([u, true]); expect([u, jointAngles(f.sk, 'R').elbow <= 35]).toEqual([u, true]); }
  });
  test('miara 2 (styk): hantel nie przenika ud, podudzi ani tułowia (≤ 0,5 cm) przy szerokim rozstawie', () => {
    expect(m.styk.maxPrzenikanie).toBeLessThanOrEqual(0.5);
  });
  test('miara potrafi paść: dawny tor (hantel w układzie tułowia: 2 cm w górę, 21 cm w przód od miednicy) odchodzi od pionu przez bark o ponad 10 cm', () => {
    let najgorszy = 0; for (const u of KADRY_STYKU) { const f = frameAt(spec(K), u); const p = f.sk; najgorszy = Math.max(najgorszy, Math.abs(p.pelvis[0] + p.up[0] * 2 + p.front[0] * 21 - p.shoulderC[0])); }
    expect(najgorszy).toBeGreaterThan(10);
  });
});

describe('101-11 Overhead Squat i One-Arm Overhead Kettlebell Squat: wyjątek kontraktu barku (D1 = A)', () => {
  const TE = ['Overhead Squat', 'One-Arm Overhead Kettlebell Squat'];
  const ROM = FIG_DATA.rom as unknown as RomData;
  /** Miara 1: dla ręki nad głową (zgięcie barku ≥ 90°) zgięcie mieści się w [180 + θ − 5, 180 + θ + 10] (θ = pochylenie tułowia), zgięcie czołowe ≤ 180; zwraca największe przekroczenie (cm→stopnie, ≤ 0 = ok). */
  const przekroczenie = (k: string, kadry: readonly number[]): number => Math.max(...kadry.flatMap(u => { const f = frameAt(spec(k), u); const th = trunkLeanDeg(f.sk); const r = overheadShoulderRange(k, th)!;
    return SIDES.flatMap(s => { const a = jointAngles(f.sk, s); return a.shSag >= 90 ? [r.min - a.shSag, a.shSag - r.max, a.shElev - OVERHEAD_SHOULDER_EXCEPTION.elevMax] : []; }); }));
  test.each(TE)('%s: na kadrach co 0,05 ręka nad głową mieści się w regule zależnej od θ (kąt 183–198°, θ 2–22°); zgięcie czołowe ≤ 180°', k => {
    expect(przekroczenie(k, KADRY_STYKU)).toBeLessThanOrEqual(0);
    const kąty = KADRY_STYKU.flatMap(u => { const a = jointAngles(frameAt(spec(k), u).sk, 'R'); return [a.shSag]; });
    expect(Math.min(...kąty)).toBeGreaterThan(171); expect(Math.max(...kąty)).toBeLessThanOrEqual(200);
  });
  test.each(TE)('%s — miara 2 (styk): hantel/gryf nad głową nie przenika ciała (≤ 0,5 cm); rysunek bez zmiany: kąt 183–198° jak przed wdrożeniem wyjątku', k => {
    const m = dwieMiary(k, przekroczenie); expect(m.cecha).toBeLessThanOrEqual(0); expect(m.styk.maxPrzenikanie).toBeLessThanOrEqual(0.5);
  });
  test('reguła: ramię pionowo → 180° + θ; do 5° przed pionem i 10° za pionem; poza przedziałem (ramię 15° przed pionem) nie przechodzi; bez wyjątku dla innych ćwiczeń', () => {
    const r = overheadShoulderRange('Overhead Squat', 15)!; expect(r).toEqual({ min: 190, max: 205 });
    expect(180 + 15 - 15 < r.min).toBe(true); /* ramię 15° przed pionem: 180 + θ − 15 = 180 < 190 */
    expect(overheadShoulderRange('Back Squat', 15)).toBeUndefined(); expect(overheadShoulderRange('Front Squat', 15)).toBeUndefined();
    expect(OVERHEAD_SHOULDER_EXCEPTION.keys).toEqual(TE); expect(OVERHEAD_SHOULDER_EXCEPTION.why.length).toBeGreaterThan(40);
  });
  test('kontrast: walidator kontraktu przepuszcza bark 183–198° tylko tym dwóm; to samo ułożenie pod inną nazwą (limit ok. 171°) dostaje błąd zakresu barku', () => {
    const E = { kneesIn: 'sq.mis.kneesIn', heels: 'sq.mis.heels' } as const; const cues = ['sq.mis.kneesIn', 'sq.mis.heels'];
    const d = exampleFor('Overhead Squat', E)!; expect(d).not.toBeNull();
    const zakres = (name: string) => validatePose(JSON.parse(JSON.stringify({ ...d, cwiczenie: name })), { family: 'squat', exercise: name, errorCues: cues, rom: ROM }).filter(i => i.kod === 'zakres' && /shSag|barku|staw shSag/.test(i.szczegol));
    expect(zakres('Overhead Squat')).toEqual([]);
    expect(zakres('Front Squat').length).toBeGreaterThan(0);
  });
  test('inne figury nadal mają limit: Back Squat, Front Squat i pozostałe gotowe rodziny nie przekraczają zgięcia barku 171° (ALLOW w figures-v2-geometry tylko dla czterech wyjątków)', () => {
    const KEYS = Object.entries(assignAll()).filter(([, f]) => ['squat', 'bench_press', 'hinge'].includes(f)).map(([k]) => k).filter(k => !TE.includes(k) && k !== 'Front Squat' && k !== 'Double Kettlebell Front Squat');
    let max = 0; for (const k of KEYS) for (const u of [0, 0.25, 0.5, 0.75, 1]) { const f = frameAt(spec(k), u); for (const s of SIDES) { const a = jointAngles(f.sk, s); if (a.shAbd < 30) max = Math.max(max, a.shSag); } }
    expect(max).toBeLessThanOrEqual(ROM.side.sh.max + 0.5);
  });
});

describe('101-12 (squat): wyjątki toru — naprawione albo uzasadnione liczbą', () => {
  const WYJ: Record<string, string> = JSON.parse(fs.readFileSync(path.join(__dirname, 'tor-wyjatki.json'), 'utf8'));
  /** Miara 1: ślad ciężaru z boku (kadry co 0,05): największe odchylenie od prostej między końcami (cm) i liczba zawróceń w poziomie (jak tests/figures-v2-tor.test.ts, ruchy < 0,05 cm pomijane). */
  const ksztalt = (k: string, kadry: readonly number[] = KADRY_STYKU) => { const pts = kadry.map(u => proj(frameAt(spec(k), u).info.load, 'side') as [number, number]); const [a, b] = [pts[0], pts[pts.length - 1]]; const dx = b[0] - a[0], dy = b[1] - a[1], L = Math.hypot(dx, dy) || 1;
    let zawr = 0, sg = 0; for (let i = 1; i < pts.length; i++) { const d = pts[i][0] - pts[i - 1][0]; if (Math.abs(d) < 0.05) continue; if (sg && Math.sign(d) !== sg) zawr++; sg = Math.sign(d); }
    return { odch: Math.max(...pts.map(p => Math.abs((p[0] - a[0]) * dy - (p[1] - a[1]) * dx) / L)), zawr, pion: Math.abs(dy) }; };
  const NAPRAWIONE: Record<string, { bylo: string }> = {
    'Goblet Squat': { bylo: '6,1 cm, 3 zawr.' }, 'Cable Squat': { bylo: '5,1 cm, 2 zawr.' }, 'Bodyweight Squat': { bylo: '4,3 cm, 1 zawr. (ślad rąk)' }, 'Zercher Squat': { bylo: '7,6 cm' },
    'Landmine Squat': { bylo: '4,8 cm, 2 zawr.' }, 'Dumbbell Squat': { bylo: '3,5 cm, 3 zawr.' }, 'Band Squat': { bylo: '5,1 cm, 3 zawr.' },
  };
  test.each(Object.keys(NAPRAWIONE))('%s: tor to prosta (odchylenie ≤ 1 cm, bez zawróceń), ruch w pionie ≥ 40 cm, brak wyjątku w tor-wyjatki.json', k => {
    const t = ksztalt(k); expect(t.odch).toBeLessThanOrEqual(1); expect(t.zawr).toBe(0); expect(t.pion).toBeGreaterThanOrEqual(40); expect(WYJ[`${k}|side`]).toBeUndefined();
  });
  test.each(Object.keys(NAPRAWIONE))('%s — miara 2 (styk): ciężar nie przenika ciała (≤ 0,5 cm) i nie oddala się od niego więcej niż przed poprawką', k => {
    const m = dwieMiary(k, (kk, kadry) => ksztalt(kk, kadry).odch); expect(m.styk.maxPrzenikanie).toBeLessThanOrEqual(0.5); expect(m.styk.maxOdstep).toBeLessThanOrEqual(43);
  });
  test('miara potrafi paść: dawny harmonogram pochylenia (3° → 32°, gładka krzywa) dawał łamaną z zawróceniami — goblet: sprawdzenie na łamanej z dawnych kadrów', () => {
    const stary = [[24, 126], [23, 125], [19, 120], [16, 107], [16, 87], [16, 69], [17, 60]] as [number, number][]; const [a, b] = [stary[0], stary[stary.length - 1]]; const dx = b[0] - a[0], dy = b[1] - a[1], L = Math.hypot(dx, dy);
    expect(Math.max(...stary.map(p => Math.abs((p[0] - a[0]) * dy - (p[1] - a[1]) * dx) / L))).toBeGreaterThan(4);
  });
  test('wyjątki, które zostają (pas biodrowy ×2, Barbell Hack Squat): ślad ciężaru = tor bioder (pas) albo bioder przesunięty o stałe 11,8 cm (gryf za nogami); wybrzuszenie 8–9,5 cm zgodne z podanym w powodzie', () => {
    for (const k of ['Dip Belt Squat', 'Przysiad z pasem (linki)', 'Barbell Hack Squat']) {
      expect([k, (WYJ[`${k}|side`] ?? '').length > 120]).toEqual([k, true]); expect(WYJ[`${k}|side`]).toMatch(/pomiar 29\.10\.2026/); expect(WYJ[`${k}|side`]).toMatch(/8,6 cm/);
      const t = ksztalt(k); expect([k, t.odch >= 8 && t.odch <= 9.5]).toEqual([k, true]);
    }
    for (const u of KADRY_STYKU) { const b = frameAt(spec('Dip Belt Squat'), u); expect(b.info.load).toEqual(b.info.hip); const h = frameAt(spec('Barbell Hack Squat'), u); expect(Math.abs(h.info.load[0] - (h.info.hip[0] - 11.8))).toBeLessThan(0.01); }
  });
  test('lista wyjątków squat: pozostają tylko trzy (inne rodziny w pliku — nie ta paczka)', () => {
    const squat = Object.keys(WYJ).filter(k => /Squat|Przysiad/.test(k)).sort(); expect(squat).toEqual(['Barbell Hack Squat|side', 'Dip Belt Squat|side', 'Przysiad z pasem (linki)|side']);
  });
});
