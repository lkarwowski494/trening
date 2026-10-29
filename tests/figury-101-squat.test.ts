/*
 * Linia 1.0.1, pakiet C (przysiady; 29.10.2026; L-056 A — każda poprawka ma dwie miary: naprawianą cechę i styk ciężar–ciało, kadry co 0,05).
 * 101-09 Zercher Squat: gryf w zgięciach łokci przez cały ruch. 101-10 Sumo Squat (hantel): pionowy tor pod barkami.
 * 101-11 Overhead Squat / One-Arm Overhead Kettlebell Squat: wyjątek kontraktu barku (reguła zależna od pochylenia tułowia).
 */
import { figureSpec, frameAt, bodyColliders, equipColliders, gap, distSegSeg, SIDES, type Frame } from '@/lib/figures/v2';
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
