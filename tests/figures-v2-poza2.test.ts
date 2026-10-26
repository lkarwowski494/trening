/*
 * Figury v2 — kontrakt poza@2 (26.10.2026): obrót i skręt tułowia, skłon boczny (przechylTulowia), przechył miednicy i głowy, uniesienie i wysunięcie barków, zgięcie nadgarstka i obrót przedramienia.
 * Rodzaje (docs/20): logika (osie, kierunki, znaki), niezmienniki (długości kości, chwyt = cel, ortonormalność), przypadki graniczne (zakresy, 0 = poza@1), przenikanie (kolidery),
 * dane (schemat, opis kontraktu, zgodność poza@1), błędy jako delty (deklaracje). Zgodność wsteczna rysunku: figures-v2-zgodnosc-wsteczna.test.ts.
 */
import {
  CONTRACT, EXT_ROM, SIDES, BODY, solveSkeleton, trunkAxes, hipPoint, jointAngles, checkFrame, keyframeFrame, poseAt, deltaAt, applyDelta, toPoseIn, validatePose, poseSchema, describeContract, bodyShapes,
  rotAxis, hasTrunkExt, TRUNK_EXT, ARM_EXT, dot, len, sub, dist, type PoseIn, type PoseData, type KeyFrame, type V3, type RomData, type DataError,
} from '@/lib/figures/v2';
import { FIG_DATA } from '@/lib/figures';

const ROM = FIG_DATA.rom as unknown as RomData;
const near = (a: V3, b: V3, tol = 1e-6): boolean => dist(a, b) < tol;
const STAND: PoseIn = { pelvis: [0, 88, 0], trunkPitch: 0, legs: { R: { ankle: [0, 7, 14] }, L: { ankle: [0, 7, -14] } }, arms: { R: { grip: [8, 80, 24] }, L: { grip: [8, 80, -24] } } };
const withP = (o: Partial<PoseIn>): PoseIn => ({ ...STAND, ...o });

describe('osie tułowia i znaki (logika)', () => {
  test('bez nowych pól osie to osie płaszczyzny strzałkowej; wszystkie osie ortonormalne dla dowolnych wartości', () => {
    const a = trunkAxes({ trunkPitch: 30 }); expect(a.ext).toBe(false); expect(a.right).toEqual([0, 0, 1]);
    for (const [r, t, l, p] of [[90, 0, 0, 0], [30, 40, 20, 10], [-120, -30, -35, -15], [180, 45, 35, 15]]) {
      const x = trunkAxes({ trunkPitch: 55, trunkRoll: r, trunkTwist: t, trunkLean: l, pelvisTilt: p });
      for (const v of [x.up, x.front, x.right, x.pelvisFront, x.pelvisRight]) expect(len(v)).toBeCloseTo(1, 9);
      expect(dot(x.up, x.front)).toBeCloseTo(0, 9); expect(dot(x.up, x.right)).toBeCloseTo(0, 9); expect(dot(x.front, x.right)).toBeCloseTo(0, 9);
    }
  });
  test('obrót +90 przy poziomym tułowiu (deska bokiem): klatka ku +z, prawe biodro nad lewym, barki jedno nad drugim', () => {
    const sk = solveSkeleton(withP({ pelvis: [0, 40, 0], trunkPitch: 90, trunkRoll: 90, legs: { R: { ankle: [-70, 40, 0] }, L: { ankle: [-70, 32, 0] } }, arms: { R: { grip: [40, 45, 0] }, L: { grip: [40, 5, 0] } } }));
    expect(sk.front[2]).toBeCloseTo(1, 9); expect(sk.legs.R.hip[1] - sk.legs.L.hip[1]).toBeCloseTo(2 * BODY.hipHalf, 6); expect(sk.arms.R.shoulder[1] - sk.arms.L.shoulder[1]).toBeCloseTo(2 * BODY.shHalf, 6);
    expect(sk.legs.R.hip[2]).toBeCloseTo(0, 9); expect(sk.up[0]).toBeCloseTo(1, 9);
  });
  test('skręt +: barki obracają się ku prawej stronie, miednica zostaje; skręt względem ciała (tułów pochylony i leżący)', () => {
    for (const pitch of [0, 60, 90, -90]) {
      const a = solveSkeleton(withP({ trunkPitch: pitch })), b = solveSkeleton(withP({ trunkPitch: pitch, trunkTwist: 30 }));
      expect(near(a.legs.R.hip, b.legs.R.hip)).toBe(true); expect(near(a.pelvis, b.pelvis)).toBe(true); expect(near(a.shoulderC, b.shoulderC)).toBe(true);
      expect(dot(b.front, a.right)).toBeCloseTo(Math.sin(Math.PI / 6), 9); /* klatka obrócona o 30° ku prawej stronie ciała, niezależnie od ułożenia */
      const ang = Math.acos(dot(a.right, b.right)) * 180 / Math.PI; expect(ang).toBeCloseTo(30, 6);
    }
  });
  test('skłon boczny +: głowa i barki przesuwają się ku +z o sin(kąt)·długość tułowia; miednica i biodra bez zmian', () => {
    const a = solveSkeleton(STAND), b = solveSkeleton(withP({ trunkLean: 20 }));
    expect(b.shoulderC[2]).toBeCloseTo(BODY.trunk * Math.sin(Math.PI / 9), 6); expect(b.head[2]).toBeGreaterThan(a.head[2] + 5); expect(near(a.legs.R.hip, b.legs.R.hip)).toBe(true);
    expect(b.arms.R.shoulder[2] - b.arms.L.shoulder[2]).toBeGreaterThan(2 * BODY.shHalf * 0.9);
  });
  test('przechył miednicy +: prawe biodro wyżej o 2·hipHalf·sin(kąt), odległość bioder stała, tułów bez zmian', () => {
    const b = solveSkeleton(withP({ pelvisTilt: 10 })); expect(b.legs.R.hip[1] - b.legs.L.hip[1]).toBeCloseTo(2 * BODY.hipHalf * Math.sin(Math.PI / 18), 6);
    expect(dist(b.legs.R.hip, b.legs.L.hip)).toBeCloseTo(2 * BODY.hipHalf, 9); expect(near(b.shoulderC, solveSkeleton(STAND).shoulderC)).toBe(true);
    expect(jointAngles(b, 'R').pelvisTilt).toBe(10);
  });
  test('przechył głowy +: oś głowy odchyla się ku +z o właściwy kąt; głowa podąża za skłonem', () => {
    const a = solveSkeleton(STAND), b = solveSkeleton(withP({ headTilt: 25 }));
    expect(Math.acos(dot(a.headUp, b.headUp)) * 180 / Math.PI).toBeCloseTo(25, 6); expect(b.headUp[2]).toBeGreaterThan(0.4);
  });
  test('uniesienie barku: bark idzie wzdłuż osi tułowia (w górę), tylko po wskazanej stronie; wysunięcie: wzdłuż przodu klatki', () => {
    const a = solveSkeleton(STAND), b = solveSkeleton(withP({ arms: { R: { ...STAND.arms.R, shrug: 5, protract: 3 }, L: STAND.arms.L } }));
    expect(b.arms.R.shoulder[1] - a.arms.R.shoulder[1]).toBeCloseTo(5, 9); expect(b.arms.R.shoulder[0] - a.arms.R.shoulder[0]).toBeCloseTo(3, 9); expect(near(a.arms.L.shoulder, b.arms.L.shoulder)).toBe(true);
    const lean = solveSkeleton(withP({ trunkPitch: 40, arms: { R: { ...STAND.arms.R, shrug: 4, grip: [30, 90, 30] }, L: STAND.arms.L } })); const base = solveSkeleton(withP({ trunkPitch: 40, arms: { R: { ...STAND.arms.R, grip: [30, 90, 30] }, L: STAND.arms.L } }));
    expect(near(sub(lean.arms.R.shoulder, base.arms.R.shoulder), [4 * lean.up[0], 4 * lean.up[1], 0])).toBe(true);
  });
});

describe('nadgarstek i przedramię (logika, niezmienniki)', () => {
  const arm = (o: object): PoseIn => withP({ trunkPitch: 0, arms: { R: { grip: [38, 105, 22], elbowPole: [0, -1, 0.3], ...o }, L: STAND.arms.L } });
  test('zgięcie 0: dłoń w linii przedramienia, jak w poza@1 (chwyt = koniec IK, nadgarstek na prostej łokieć–chwyt)', () => {
    const sk = solveSkeleton(arm({})); const A = sk.arms.R; expect(A.bent).toBe(false); expect(near(A.grip, [38, 105, 22], 0.6)).toBe(true); expect(dist(A.wrist, A.elbow)).toBeCloseTo(BODY.farm, 6);
  });
  test('zgięcie nadgarstka: chwyt zostaje w celu (≤ 0,01 cm), przedramię i dłoń mają stałe długości, kąt między nimi = zgięcie', () => {
    for (const w of [-60, -30, 25, 70]) for (const roll of [-70, 0, 70]) {
      const A = solveSkeleton(arm({ wristFlex: w, forearmRoll: roll })).arms.R; expect(A.bent).toBe(true);
      expect(dist(A.grip, [38, 105, 22])).toBeLessThan(0.01); expect(dist(A.elbow, A.wrist)).toBeCloseTo(BODY.farm, 6); expect(dist(A.wrist, A.grip)).toBeCloseTo(BODY.hand, 6);
      const f = sub(A.wrist, A.elbow), h = sub(A.grip, A.wrist); expect(Math.acos(dot(f, h) / (len(f) * len(h))) * 180 / Math.PI).toBeCloseTo(Math.abs(w), 2);
    }
  });
  test('obrót przedramienia wyznacza stronę zgięcia: supinacja + zgięcie unosi dłoń ku górze (łokieć zgięty 90°), pronacja + zgięcie opuszcza; wyprost odwrotnie', () => {
    const base = (roll: number, w: number): V3 => solveSkeleton(arm({ forearmRoll: roll, wristFlex: w })).arms.R.hand;
    /* przedramię w przód, łokieć zgięty: strona dłoni przy supinacji (+80) to góra */
    expect(base(80, 40)[1]).toBeGreaterThan(base(0, 0)[1] + 0.2); expect(base(-80, 40)[1]).toBeLessThan(base(0, 0)[1] - 0.2); expect(base(80, -40)[1]).toBeLessThan(base(0, 0)[1] - 0.2);
    const sup = solveSkeleton(arm({ forearmRoll: 80 })).arms.R.palm, pro = solveSkeleton(arm({ forearmRoll: -80 })).arms.R.palm; expect(sup[1]).toBeGreaterThan(0.7); expect(pro[1]).toBeLessThan(-0.7);
  });
  test('lustro: lewa ręka z tym samym obrotem daje dłoń w tę samą stronę w górę/dół (symetria stron)', () => {
    const L = solveSkeleton(withP({ arms: { R: STAND.arms.R, L: { grip: [38, 105, -22], elbowPole: [0, -1, -0.3], forearmRoll: 80 } } })).arms.L.palm; expect(L[1]).toBeGreaterThan(0.7);
  });
  test('przypadek graniczny: ułamek stopnia zgięcia jest ciągły z brakiem zgięcia (skok chwytu i łokcia < 0,05 cm)', () => {
    const a = solveSkeleton(arm({})).arms.R, b = solveSkeleton(arm({ wristFlex: 0.001 })).arms.R; expect(dist(a.elbow, b.elbow)).toBeLessThan(0.05); expect(dist(a.grip, b.grip)).toBeLessThan(0.05);
  });
  test('jointAngles: łokieć liczony do nadgarstka przy zgiętym nadgarstku (zgięcie nadgarstka nie zmienia kąta łokcia o więcej niż IK)', () => {
    const e0 = jointAngles(solveSkeleton(arm({})), 'R').elbow, e1 = jointAngles(solveSkeleton(arm({ wristFlex: 40 })), 'R').elbow; expect(Math.abs(e0 - e1)).toBeLessThan(25);
  });
});

describe('biodro ze znakiem (przeprost)', () => {
  test('udo za linią tułowia daje kąt ujemny, do przodu dodatni, w linii ≈ 0; udo odwiedzone bokiem bez zmiany znaku', () => {
    const k = (ankle: V3): number => jointAngles(solveSkeleton(withP({ legs: { R: { ankle }, L: STAND.legs.L } })), 'R').hip;
    expect(k([-35, 12, 8.5])).toBeLessThan(-5); expect(k([30, 40, 8.5])).toBeGreaterThan(20); expect(Math.abs(k([0, 5.5, 8.5]))).toBeLessThan(12) /* tułów nad środkiem, biodro 8,5 cm z boku: ≈ 9,7° z geometrii bioder (jak w poza@1) */; expect(k([0, 30, 60])).toBeGreaterThan(0);
  });
});

/* ---------- walidator: dane poza@2 ---------- */
const kf = (u: number, o: Partial<KeyFrame> = {}): KeyFrame => ({ u, miednica: [0, 88, 0], pochylenieTulowia: 0, nogi: { R: { kostka: [0, 7, 14] }, L: { kostka: [0, 7, -14] } }, rece: { R: { chwyt: [8, 80, 24] }, L: { chwyt: [8, 80, -24] } }, ...o });
const dane = (klatki: KeyFrame[], bledy: DataError[] = [], kontrakt: string = CONTRACT.id): PoseData => ({ kontrakt, rodzina: 'core_standing', cwiczenie: 'Russian Twist', sprzet: [{ rodzaj: 'podloga', x0: -120, x1: 120 }], klatki, bledy });
const ctx = { family: 'core_standing', exercise: 'Russian Twist', errorCues: ['x.err'], rom: ROM };
const gr = (kfs: KeyFrame[]): PoseData => dane(kfs);
const twistPose = (a: number, b: number): PoseData => gr([kf(0, { skretTulowia: a, rece: { R: { chwyt: [8, 80, 24] }, L: { chwyt: [8, 80, -24] } } }), kf(1, { skretTulowia: b, rece: { R: { chwyt: [8, 80, 24], uniesienieBarkow: 0 }, L: { chwyt: [8, 80, -24] } } })]);
const kody = (d: PoseData, c = ctx): string => validatePose(d, c).map(i => `${i.kod}:${i.szczegol}`).join(' | ');

describe('walidator poza@2: zakresy nowych stopni swobody', () => {
  test('poprawna poza ze skrętem −30…+30 i wszystkimi nowymi polami w zakresie przechodzi walidator', () => {
    const d = gr([kf(0, { skretTulowia: -30, przechylTulowia: -10, przechylMiednicy: -5, przechylGlowy: 10, rece: { R: { chwyt: [8, 80, 24], uniesienieBarkow: 1, wysuniecieBarkow: 1 }, L: { chwyt: [8, 80, -24] } } }),
      kf(1, { skretTulowia: 30, przechylTulowia: 10, przechylMiednicy: 5, przechylGlowy: -10, rece: { R: { chwyt: [8, 80, 24], uniesienieBarkow: 3, wysuniecieBarkow: -1 }, L: { chwyt: [8, 80, -24] } } })]);
    expect(validatePose(d, ctx)).toEqual([]);
  });
  test.each([
    ['skretTulowia', { skretTulowia: EXT_ROM.twist.max + 5 }, 'skretTulowia'],
    ['przechylTulowia', { przechylTulowia: EXT_ROM.lean.max + 5 }, 'przechylTulowia'],
    ['przechylMiednicy', { przechylMiednicy: EXT_ROM.tilt.max + 5 }, 'przechylMiednicy'],
    ['przechylGlowy', { przechylGlowy: EXT_ROM.headTilt.max + 5 }, 'przechylGlowy'],
  ])('%s poza zakresem (graniczne: max + 5) → kod zakres z nazwą pola; na granicy (max) bez błędu', (_n, over, pole) => {
    const bad = gr([kf(0), kf(1, { ...over, rece: { R: { chwyt: [8, 80, 24] }, L: { chwyt: [8, 80, -24] } } })]);
    const t = kody(bad); expect(t).toContain('zakres'); expect(t).toContain(pole);
  });
  test('na granicy zakresu (skręt = 40°) poza przechodzi; 40,6° jest już poza (tolerancja 0,5°)', () => {
    expect(kody(twistPose(0, EXT_ROM.twist.max))).not.toContain('zakres'); expect(kody(twistPose(0, EXT_ROM.twist.max + 0.6))).toContain('skretTulowia');
  });
  test.each([
    ['uniesienieBarkow', (v: number) => ({ chwyt: [8, 80, 24] as V3, uniesienieBarkow: v }), EXT_ROM.shrug.max],
    ['wysuniecieBarkow', (v: number) => ({ chwyt: [8, 80, 24] as V3, wysuniecieBarkow: v }), EXT_ROM.protract.max],
    ['zgiecieNadgarstka', (v: number) => ({ chwyt: [8, 80, 24] as V3, zgiecieNadgarstka: v }), EXT_ROM.wrist.max],
    ['obrotPrzedramienia', (v: number) => ({ chwyt: [8, 80, 24] as V3, obrotPrzedramienia: v }), EXT_ROM.forearm.max],
  ])('%s: wartość ponad zakres → zakres (rece.R.%s); wartość równa granicy bez błędu zakresu', (pole, mk, max) => {
    const mkd = (v: number): PoseData => gr([kf(0, { rece: { R: { chwyt: [8, 80, 24] }, L: { chwyt: [8, 80, -24] } } }), kf(1, { rece: { R: mk(v), L: { chwyt: [8, 80, -24] } } })]);
    expect(kody(mkd(max + 3))).toContain(`rece.R.${pole}`); expect(kody(mkd(max))).not.toContain('zakres');
  });
  test('schemat odrzuca wartość spoza przedziału schematu i nieznane pole (np. stara nazwa sklonBoczny)', () => {
    const d = gr([kf(0), kf(1, { skretTulowia: 200 })]); expect(kody(d)).toContain('schemat');
    const e = JSON.parse(JSON.stringify(gr([kf(0), kf(1)]))); e.klatki[1].sklonBoczny = 5; expect(kody(e)).toContain('nieznane pole „sklonBoczny”');
  });
});

describe('zgodność wsteczna kontraktu (poza@1 nadal przyjmowana)', () => {
  const baza = (kontrakt: string): PoseData => dane([kf(0), kf(1, { rece: { R: { chwyt: [8, 92, 24] }, L: { chwyt: [8, 92, -24] } } })], [], kontrakt);
  test('kontrakt poza@1 przechodzi walidator, poza@2 też; inna wersja odrzucona; poza@1 z polem poza@2 odrzucona z komunikatem', () => {
    expect(CONTRACT.id).toBe('figury-v2/poza@2'); expect(validatePose(baza('figury-v2/poza@1'), ctx)).toEqual([]); expect(validatePose(baza(CONTRACT.id), ctx)).toEqual([]);
    expect(kody(baza('figury-v2/poza@3'))).toContain('schemat');
    const stara = baza('figury-v2/poza@1'); stara.klatki[1].skretTulowia = 10; const t = kody(stara); expect(t).toContain('kontrakt'); expect(t).toContain('skretTulowia');
  });
  test('interpolacja: poza bez nowych pól nie dostaje nowych kluczy; z polem tylko w jednej klatce interpoluje ku wartości (brak = 0 nie jest zakładany)', () => {
    const p = poseAt([kf(0), kf(1)], 0.5); expect(Object.keys(p).filter(k => ['obrotTulowia', 'skretTulowia', 'przechylTulowia', 'przechylMiednicy', 'przechylGlowy'].includes(k))).toEqual([]); expect(Object.keys(p.rece.R)).toEqual(['chwyt', 'biegunLokcia', 'dolnaCzesc']);
    expect(poseAt([kf(0, { skretTulowia: 10 }), kf(1, { skretTulowia: 30 })], 0.5).skretTulowia).toBeCloseTo(20, 9);
    expect(toPoseIn(kf(0, { skretTulowia: 10, przechylGlowy: 3 })).trunkTwist).toBe(10);
  });
  test('delta: deltaAt/applyDelta dodają nowe pola do pozy poprawnej (też na rękach)', () => {
    const d = deltaAt([{ u: 0 }, { u: 1, skretTulowia: 20, rece: { R: { zgiecieNadgarstka: 30 } } }], 0.5); expect(d.skretTulowia).toBe(10); expect(d.rece?.R?.zgiecieNadgarstka).toBe(15);
    const a = applyDelta(kf(0, { skretTulowia: 5 }), { u: 0.5, skretTulowia: 10, rece: { R: { zgiecieNadgarstka: 15 } } }); expect(a.skretTulowia).toBe(15); expect(a.rece.R.zgiecieNadgarstka).toBe(15); expect(a.rece.L.zgiecieNadgarstka).toBeUndefined();
  });
  test('schemat i opis kontraktu wymieniają wszystkie nowe pola (nazwy zgodne z regułami sensu: data/zrodla/figury-sens.json → _poza2)', () => {
    const j = JSON.stringify(poseSchema('core_standing')); const opis = describeContract('core_standing');
    for (const f of ['obrotTulowia', 'skretTulowia', 'przechylTulowia', 'przechylMiednicy', 'przechylGlowy', 'uniesienieBarkow', 'wysuniecieBarkow', 'zgiecieNadgarstka', 'obrotPrzedramienia']) { expect(j).toContain(`"${f}"`); expect(opis).toContain(f); }
    expect(opis).toContain('poza@2');
  });
});

describe('przenikanie i geometria przy nowych stopniach swobody', () => {
  test('deska bokiem: ciało obrócone o 90° nie przenika podłogi; skrzynia w miejscu tułowia daje przenikanie (kolider tułowia działa po obrocie)', () => {
    const pose = (box: boolean): PoseData => ({ kontrakt: CONTRACT.id, rodzina: 'pushup_plank', cwiczenie: 'Side Plank', sprzet: [{ rodzaj: 'podloga', x0: -150, x1: 150 }, ...(box ? [{ rodzaj: 'skrzynia' as const, x0: -40, x1: 20, top: 60 }] : [])],
      klatki: [0, 1].map(u => ({ u, miednica: [0, 24, 0] as V3, pochylenieTulowia: 90, obrotTulowia: 90, nogi: { R: { kostka: [-80, 17, 0] as V3 }, L: { kostka: [-80, 7, 0] as V3 } }, rece: { R: { chwyt: [45, 40, 0] as V3 }, L: { chwyt: [45, 9, 0] as V3 } } })), bledy: [] });
    expect(checkFrame(keyframeFrame(pose(false), 0.5)).filter(i => i.code === 'pen' || i.code === 'floor')).toEqual([]);
    expect(checkFrame(keyframeFrame(pose(true), 0.5)).some(i => i.code === 'pen')).toBe(true);
  });
  test('zgięty nadgarstek: kolider dłoni działa (dłoń wciśnięta w podłogę nie jest karana jak przedramię, ale kości mają stałą długość)', () => {
    const d: PoseData = { kontrakt: CONTRACT.id, rodzina: 'forearm', cwiczenie: 'Wrist Curl', sprzet: [{ rodzaj: 'podloga' }], klatki: [0, 1].map(u => kf(u, { rece: { R: { chwyt: [30, 100, 25], zgiecieNadgarstka: u * 60 - 20, obrotPrzedramienia: 80 }, L: { chwyt: [30, 100, -25] } } })), bledy: [] };
    for (const u of [0, 0.5, 1]) expect(checkFrame(keyframeFrame(d, u)).filter(i => i.code === 'bone' || i.code === 'reach')).toEqual([]);
  });
  test('rysunek z nowymi polami: kształty skończone w widokach z boku, z przodu i z góry dla skrajnych wartości', () => {
    const sk = solveSkeleton(withP({ trunkPitch: 20, trunkRoll: 135, trunkTwist: 45, trunkLean: -35, pelvisTilt: 15, headTilt: 35, arms: { R: { ...STAND.arms.R, shrug: 6, protract: 6, wristFlex: 80, forearmRoll: 80 }, L: { ...STAND.arms.L, shrug: -3, wristFlex: -70, forearmRoll: -80 } } }));
    for (const v of ['side', 'front', 'top'] as const) { const sh = bodyShapes(sk, v); expect(sh.length).toBeGreaterThan(20); expect(JSON.stringify(sh)).not.toMatch(/null|NaN/); }
  });
  test('ciągłość: obrót o 1e-9° daje ten sam szkielet (≤ 1e-6 cm) co brak obrotu', () => {
    const a = solveSkeleton(STAND), b = solveSkeleton(withP({ trunkRoll: 1e-9, trunkTwist: 1e-9, trunkLean: 1e-9, pelvisTilt: 1e-9, headTilt: 1e-9 }));
    for (const s of SIDES) for (const k of ['hip', 'knee', 'ankle'] as const) expect(dist(a.legs[s][k], b.legs[s][k])).toBeLessThan(1e-6);
    expect(dist(a.arms.R.shoulder, b.arms.R.shoulder)).toBeLessThan(1e-6); expect(dist(a.head, b.head)).toBeLessThan(1e-6);
  });
  test('rotAxis: obrót o 0 zwraca ten sam wektor; o 90° wokół z przekłada x na y', () => {
    const v: V3 = [1, 2, 3]; expect(rotAxis(v, [0, 0, 1], 0)).toBe(v); expect(near(rotAxis([1, 0, 0], [0, 0, 1], 90), [0, 1, 0])).toBe(true);
  });
  test('hipPoint bez nowych pól = [x, y, ±hipHalf] (z miednicy nie wchodzi do bioder, jak w poza@1)', () => {
    expect(hipPoint({ pelvis: [3, 50, 9], trunkPitch: 10 }, 'R')).toEqual([3, 50, BODY.hipHalf]); expect(hipPoint({ pelvis: [3, 50, 9], trunkPitch: 10 }, 'L')).toEqual([3, 50, -BODY.hipHalf]);
  });
});

describe('rysunek tułowia przy nowych polach i lista pól', () => {
  test('hasTrunkExt: fałsz bez obrotu, skrętu, skłonu i przechyłu miednicy (rysunek jak w poza@1), prawda dla każdego z nich; przechył głowy nie zmienia kształtu tułowia', () => {
    expect(hasTrunkExt(solveSkeleton(STAND))).toBe(false); expect(hasTrunkExt(solveSkeleton(withP({ headTilt: 20 })))).toBe(false);
    for (const o of [{ trunkRoll: 10 }, { trunkTwist: 10 }, { trunkLean: 10 }, { pelvisTilt: 10 }]) expect(hasTrunkExt(solveSkeleton(withP(o)))).toBe(true);
  });
  test('tułów obrócony o 90° wygląda z boku jak przekrój poprzeczny (szerszy niż głębszy): obrys w widoku z boku zmienia szerokość, z przodu węższy', () => {
    const w = (sk: ReturnType<typeof solveSkeleton>, v: 'side' | 'front'): number => { const t = bodyShapes(sk, v).find(x => x.id === 'torso'); if (!t || t.k !== 'poly') return 0; const xs = t.pts.map(p => p[0]); return Math.max(...xs) - Math.min(...xs); };
    const a = solveSkeleton(STAND), b = solveSkeleton(withP({ trunkRoll: 90 }));
    expect(w(b, 'side')).toBeGreaterThan(w(a, 'side')); expect(w(b, 'front')).toBeLessThan(w(a, 'front'));
  });
  test('lista pól poza@2 w kontrakcie: 5 pól tułowia i 4 pola ręki (nazwy zgodne z regułami sensu)', () => {
    expect([...TRUNK_EXT]).toEqual(['obrotTulowia', 'skretTulowia', 'przechylTulowia', 'przechylMiednicy', 'przechylGlowy']); expect([...ARM_EXT]).toEqual(['uniesienieBarkow', 'wysuniecieBarkow', 'zgiecieNadgarstka', 'obrotPrzedramienia']);
  });
});

describe('błędy jako delty z nowymi polami: deklaracje', () => {
  const baza = (): KeyFrame[] => [kf(0, { rece: { R: { chwyt: [8, 80, 24] }, L: { chwyt: [8, 80, -24] } } }), kf(1, { rece: { R: { chwyt: [8, 92, 24] }, L: { chwyt: [8, 92, -24] } } })];
  const blad = (delta: object, dotyczy: DataError['dotyczy']): DataError => ({ cue: 'x.err', znacznik: 'back', dotyczy, klatki: [{ u: 0 }, { u: 1, ...delta }] });
  test('przechył miednicy w błędzie bez deklaracji pelvis → blad-niedeklarowane; z deklaracją przechodzi', () => {
    const zle = dane(baza(), [blad({ przechylMiednicy: 12 }, ['bar'])]); expect(kody(zle)).toContain('blad-niedeklarowane'); expect(kody(zle)).toContain('pelvisTilt');
    expect(kody(dane(baza(), [blad({ przechylMiednicy: 12 }, ['pelvis', 'hip', 'knee', 'ankle'])]))).not.toContain('blad-niedeklarowane');
  });
  test('uniesienie barku o 5 cm w błędzie wymaga shoulder; sam obrót przedramienia jest widoczny i wymaga elbow', () => {
    const z = dane(baza(), [blad({ rece: { R: { uniesienieBarkow: 5 }, L: { uniesienieBarkow: 5 } } }, ['bar'])]); expect(kody(z)).toContain('uniesienie barku');
    expect(kody(dane(baza(), [blad({ rece: { R: { uniesienieBarkow: 5 }, L: { uniesienieBarkow: 5 } } }, ['shoulder', 'elbow', 'hip'])]))).not.toContain('niedeklarowane');
  });
  test('delta zerowa w pierwszej klatce błędu: niezerowy skręt w u = 0 → blad-start', () => {
    const e: DataError = { cue: 'x.err', znacznik: 'back', dotyczy: ['spine'], klatki: [{ u: 0, skretTulowia: 10 }, { u: 1, skretTulowia: 20 }] }; expect(kody(dane(baza(), [e]))).toContain('blad-start');
  });
  test('skręt w błędzie z deklaracją spine jest widoczny (≥ 8°) i przechodzi', () => {
    const t = kody(dane(baza(), [blad({ skretTulowia: 25 }, ['spine', 'shoulder', 'elbow'])])); expect(t).not.toContain('blad-niewidoczny'); expect(t).not.toContain('niedeklarowane');
  });
});
