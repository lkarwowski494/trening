/*
 * Figury v2 — boczne przesunięcie korzenia (wersja 1.1, 26.10.2026, decyzja właściciela: wariant A): opcjonalne pole kontraktu poza@2 `przesuniecieBoczne` (cm; + = ku prawej stronie osoby)
 * przesuwa miednicę, stawy biodrowe i barki w osi z (kroki boczne, skoki boczne, odwodzenie z przestawieniem). Kostki i chwyty nadal w układzie świata.
 * Rodzaje (docs/20): logika (przesunięcie stawów i środka tułowia, nogi i ręce w tym samym układzie), niezmienniki (długości kości, zgodność wsteczna: brak pola = ten sam szkielet,
 * pole = 0 = ten sam szkielet), przypadki graniczne (z tułowiem pochylonym, obróconym, przechylonym), dane (schemat, poza@1, interpolacja, delta), macierz (ćwiczenia odblokowane w danych).
 * Rysunek gotowych rodzin bez zmian: figures-v2-zgodnosc-wsteczna.test.ts (odciski).
 */
import * as fs from 'fs';
import * as path from 'path';
import {
  CONTRACT, BODY, solveSkeleton, hipPoint, jointAngles, keyframeFrame, poseAt, deltaAt, applyDelta, toPoseIn, validatePose, poseSchema, describeContract, TRUNK_EXT, EXT_FIELDS,
  dist, type PoseIn, type PoseData, type KeyFrame, type V3, type RomData,
} from '@/lib/figures/v2';
import { FIG_DATA } from '@/lib/figures';

const ROM = FIG_DATA.rom as unknown as RomData;
const near = (a: V3, b: V3, tol = 1e-9): boolean => dist(a, b) < tol;
const STAND: PoseIn = { pelvis: [0, 88, 0], trunkPitch: 0, legs: { R: { ankle: [0, 7, 14] }, L: { ankle: [0, 7, -14] } }, arms: { R: { grip: [8, 80, 24] }, L: { grip: [8, 80, -24] } } };
const withP = (o: Partial<PoseIn>): PoseIn => ({ ...STAND, ...o });
const DZ = 40;
/** Ciało przesunięte o DZ: kostki i chwyty przesunięte o tyle samo (układ świata). */
const SHIFTED: PoseIn = { ...STAND, pelvis: [0, 88, DZ], lateral: DZ, legs: { R: { ankle: [0, 7, 14 + DZ] }, L: { ankle: [0, 7, -14 + DZ] } }, arms: { R: { grip: [8, 80, 24 + DZ] }, L: { grip: [8, 80, -24 + DZ] } } };

describe('szkielet z przesunięciem bocznym (logika, niezmienniki)', () => {
  test('wszystkie stawy przesuwają się o DZ w z, x i y bez zmian; długości kości te same; kąty stawów te same', () => {
    const a = solveSkeleton(STAND), b = solveSkeleton(SHIFTED);
    const pts = (s: typeof a): V3[] => [s.pelvis, s.spineMid, s.shoulderC, s.neck, s.head, ...(['R', 'L'] as const).flatMap((k) => [s.legs[k].hip, s.legs[k].knee, s.legs[k].ankle, s.legs[k].heel, s.legs[k].toe, s.arms[k].shoulder, s.arms[k].elbow, s.arms[k].grip])];
    pts(a).forEach((p, i) => { const q = pts(b)[i]; expect(q[0]).toBeCloseTo(p[0], 6); expect(q[1]).toBeCloseTo(p[1], 6); expect(q[2]).toBeCloseTo(p[2] + DZ, 6); });
    for (const k of ['R', 'L'] as const) { const ja = jointAngles(a, k), jb = jointAngles(b, k); for (const f of ['hip', 'knee', 'ankle', 'elbow', 'shSag', 'shElev'] as const) expect(jb[f]).toBeCloseTo(ja[f], 6); }
    expect(b.legs.R.hip[2]).toBeCloseTo(DZ + BODY.hipHalf, 9); expect(b.arms.L.shoulder[2]).toBeCloseTo(DZ - BODY.shHalf, 9);
  });
  test('hipPoint: z biodra = lateral ± hipHalf także przy obrocie i przechyle miednicy; lateral = 0 albo brak pola = bez zmian', () => {
    for (const ext of [{}, { trunkRoll: 90 }, { pelvisTilt: 10 }, { trunkLean: 15 }]) {
      const base = { pelvis: [0, 88, 0] as V3, trunkPitch: 20, ...ext };
      for (const s of ['R', 'L'] as const) {
        const h0 = hipPoint(base, s); expect(near(hipPoint({ ...base, lateral: 0 }, s), h0)).toBe(true);
        const h1 = hipPoint({ ...base, pelvis: [0, 88, DZ] as V3, lateral: DZ }, s); expect(h1[0]).toBeCloseTo(h0[0], 9); expect(h1[1]).toBeCloseTo(h0[1], 9); expect(h1[2]).toBeCloseTo(h0[2] + DZ, 9);
      }
    }
  });
  test('zgodność wsteczna: brak pola i lateral = 0 dają ten sam szkielet co dotąd (także z pochylonym i obróconym tułowiem)', () => {
    for (const o of [{}, { trunkPitch: 55 }, { trunkRoll: 90, trunkPitch: 90 }, { pelvisTilt: 8 }, { trunkLean: 12, trunkTwist: 20 }]) {
      const a = solveSkeleton(withP(o)), b = solveSkeleton(withP({ ...o, lateral: 0 }));
      expect(JSON.stringify(b)).toBe(JSON.stringify(a));
    }
  });
});

describe('kontrakt: pole przesuniecieBoczne (dane)', () => {
  const frame = (u: number, over: Partial<KeyFrame> = {}): KeyFrame => ({ u, miednica: [0, 88, 0], pochylenieTulowia: 0, nogi: { R: { kostka: [0, 7, 14] }, L: { kostka: [0, 7, -14] } }, rece: { R: { chwyt: [8, 80, 24] }, L: { chwyt: [8, 80, -24] } }, ...over });
  const shift = (u: number, dz: number): KeyFrame => frame(u, { przesuniecieBoczne: dz, nogi: { R: { kostka: [0, 7, 14 + dz] }, L: { kostka: [0, 7, -14 + dz] } }, rece: { R: { chwyt: [8, 80, 24 + dz] }, L: { chwyt: [8, 80, -24 + dz] } } });
  test('schemat: pole opcjonalne w klatce poprawnej i w delcie, nie jest wymagane; należy do pól poza@2 (EXT_FIELDS, TRUNK_EXT)', () => {
    const s = poseSchema('plyo') as { properties: Record<string, { items?: { properties?: Record<string, unknown>; required?: string[] } }> };
    const kl = s.properties.klatki.items!; expect(Object.keys(kl.properties!)).toContain('przesuniecieBoczne'); expect(kl.required).not.toContain('przesuniecieBoczne');
    expect(EXT_FIELDS).toContain('przesuniecieBoczne'); expect(TRUNK_EXT).toContain('przesuniecieBoczne');
    expect(describeContract('plyo')).toContain('przesuniecieBoczne');
  });
  test('interpolacja i delta: pole interpolowane liniowo, brak pola = brak klucza; delta dodaje się do pozy', () => {
    const k = [shift(0, 0), shift(1, 60)]; expect(poseAt(k, 0.5).przesuniecieBoczne).toBeCloseTo(30, 9); expect(poseAt([frame(0), frame(1)], 0.5).przesuniecieBoczne).toBeUndefined();
    const ap = applyDelta(frame(0.5), { u: 0.5, przesuniecieBoczne: 12 }); expect(ap.przesuniecieBoczne).toBeCloseTo(12, 9);
    expect(deltaAt([{ u: 0 }, { u: 1, przesuniecieBoczne: 20 }], 0.5).przesuniecieBoczne).toBeCloseTo(10, 9);
  });
  test('toPoseIn przekazuje przesunięcie do szkieletu; poza z przesunięciem przechodzi walidator (ruch boczny z przesunięciem miednicy), poza@1 z tym polem jest odrzucona', () => {
    expect(toPoseIn(shift(0, 25)).lateral).toBe(25); expect(toPoseIn(frame(0)).lateral).toBeUndefined();
    const d: PoseData = { kontrakt: CONTRACT.id, rodzina: 'plyo', cwiczenie: 'Lateral Bound', sprzet: [{ rodzaj: 'podloga', x0: -120, x1: 120 }], klatki: [shift(0, 0), shift(0.5, 30), shift(1, 60)], bledy: [] };
    const is = validatePose(d, { family: 'plyo', exercise: 'Lateral Bound', errorCues: [], rom: ROM, dynamic: true });
    expect(is.filter((i) => ['schemat', 'kontrakt', 'geometria', 'zakres', 'chwyt'].includes(i.kod))).toEqual([]);
    const stary = validatePose({ ...d, kontrakt: 'figury-v2/poza@1' }, { family: 'plyo', exercise: 'Lateral Bound', errorCues: [], rom: ROM }); expect(stary.map((i) => i.kod)).toContain('kontrakt');
    const f = keyframeFrame(d, 1); expect(f.sk.legs.R.hip[2]).toBeCloseTo(60 + BODY.hipHalf, 6); expect(f.sk.arms.R.shoulder[2]).toBeCloseTo(60 + BODY.shHalf, 6);
  });
  test('poza bez pola daje ten sam szkielet co z polem = 0 (zgodność wsteczna danych)', () => {
    const d = (k: KeyFrame[]): PoseData => ({ kontrakt: CONTRACT.id, rodzina: 'plyo', cwiczenie: 'x', sprzet: [{ rodzaj: 'podloga', x0: -120, x1: 120 }], klatki: k, bledy: [] });
    const a = d([frame(0), frame(1, { miednica: [4, 80, 0] })]), b = d([frame(0, { przesuniecieBoczne: 0 }), frame(1, { miednica: [4, 80, 0], przesuniecieBoczne: 0 })]);
    for (const u of [0, 0.3, 1]) expect(JSON.stringify(keyframeFrame(a, u).sk)).toBe(JSON.stringify(keyframeFrame(b, u).sk));
  });
});

describe('macierz: ćwiczenia z ruchem bocznym odblokowane w danych plyo', () => {
  const BOCZNE = ['Lateral Cone Hops', 'Side Hop-Sprint', 'Side Standing Long Jump', 'Lateral Bound', 'Single-Leg Lateral Hop', 'Lateral Box Jump', 'Side to Side Box Shuffle'];
  const plik = path.join(__dirname, '..', 'lib/figures/v2/poses/plyo.json');
  const cw = JSON.parse(fs.readFileSync(plik, 'utf8')).cwiczenia as Record<string, PoseData>;
  test.each(BOCZNE)('%s ma pozę z niezerowym przesunięciem bocznym', (nazwa) => {
    const p = cw[nazwa]; expect(p).toBeDefined(); const z = p.klatki.map((k) => k.przesuniecieBoczne ?? 0); expect(Math.max(...z.map(Math.abs))).toBeGreaterThan(20);
  });
});
