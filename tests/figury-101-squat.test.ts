/*
 * Linia 1.0.1, pakiet C (przysiady; 29.10.2026; L-056 A — każda poprawka ma dwie miary: naprawianą cechę i styk ciężar–ciało, kadry co 0,05).
 * 101-09 Zercher Squat: gryf w zgięciach łokci przez cały ruch. 101-10 Sumo Squat (hantel): pionowy tor pod barkami.
 * 101-11 Overhead Squat / One-Arm Overhead Kettlebell Squat: wyjątek kontraktu barku (reguła zależna od pochylenia tułowia).
 */
import { figureSpec, frameAt, jointAngles, bodyColliders, equipColliders, gap, distSegSeg, SIDES, type Frame } from '@/lib/figures/v2';
import { KADRY_STYKU, dwieMiary } from './helpers/styk-figur';

const spec = (k: string) => figureSpec(k)!;
const bar = (f: Frame) => equipColliders(f.props).find(c => c.id === 'bar' && c.k === 'capsule') as { a: [number, number, number]; b: [number, number, number]; r: number };

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
