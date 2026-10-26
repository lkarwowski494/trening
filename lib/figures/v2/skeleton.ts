/*
 * Figury v2 — szkielet 3D (kinematyka). Jedna figura dorosłego (ok. 175 cm) — proporcje i wymiary to UPROSZCZENIE ILUSTRACYJNE (schemat, nie pomiar;
 * figura nie twierdzi nic o proporcjach ciała). Wszystkie wymiary ciała w jednym miejscu: BODY (cm). Układ świata i jednostki: ./math.ts.
 *
 * Wejście (PoseIn): miednica (środek stawów biodrowych), pochylenie tułowia w płaszczyźnie strzałkowej, zgięcie kręgosłupa, głowa, cele stóp (kostka) i dłoni
 * (środek chwytu) dla obu stron. Kolana i łokcie liczy dwukostny IK z biegunem (kierunek zgięcia). Wyjście: punkty stawów obu stron + kręgosłup + głowa.
 * Ten sam szkielet rzutuje się na widok z boku (kamera po prawej stronie osoby, z = bliższa strona) i z przodu (kamera przed osobą) — project.ts.
 */
import { add, clamp, deg, dot, ik2, len, mul, norm, rad, sag, sagFront, sub, type V3 } from './math';

export const BODY = {
  thigh: 42, shank: 41, ankleH: 7, heelBack: 6, toeFwd: 19,
  trunk: 50, neckUp: 4, headR: 9.5, headFromC7: 18,
  uarm: 31, farm: 26, hand: 7,
  hipHalf: 8.5, shHalf: 19,
} as const;

/** Promienie przekrojów do rysunku i do testów kolizji (cm) — uproszczenie ilustracyjne. */
export const GIRTH = {
  thigh: [9.2, 8.6, 6.0], shank: [5.8, 6.4, 4.2], uarm: [4.7, 4.4], farm: [4.0, 2.9], hand: 3.6, neck: 4.6, trunkDepth: 10.5, trunkCollide: 9.5, trunkWidth: 16.5, pelvis: 9.5,
} as const;

export type Side = 'R' | 'L';
export const SIDES: Side[] = ['R', 'L'];

export type LegIn = {
  /** Środek stawu skokowego. */
  ankle: V3;
  /** Pochylenie stopy w płaszczyźnie strzałkowej (stopnie; 0 = płasko, dodatnie = palce wyżej niż pięta). */
  footPitch?: number;
  /** Rotacja zewnętrzna stopy (stopień), kierunek „na zewnątrz” liczony dla danej strony. */
  toeOut?: number;
  /** Odchylenie kolana na zewnątrz w płaszczyźnie poziomej (stopnie); domyślnie podwójna rotacja stopy (kolano „idzie” w stronę palców). */
  kneeOut?: number;
  /** Kierunek zgięcia kolana (domyślnie wynika z kneeOut). */
  kneePole?: V3;
};
/** `lower`: odległość łokieć–środek chwytu (domyślnie przedramię + dłoń); krótsza przy chwycie z zagiętymi palcami i nadgarstkiem (rack przedni). */
export type ArmIn = { grip: V3; elbowPole?: V3; lower?: number };
/** Wymiary rąk i barków nadpisywane dla jednej figury (domyślnie BODY): wyciskanie leżąc ma sylwetkę z mediany ANSUR II (M), reszta rodzin zostaje na wspólnym BODY. */
export type ArmDims = { uarm?: number; farm?: number; shHalf?: number };
export type PoseIn = {
  dims?: ArmDims;
  pelvis: V3;
  /** Pochylenie tułowia od pionu w płaszczyźnie strzałkowej (stopnie, do przodu dodatnie; 90 = poziomo głową do przodu, 180 = do góry nogami). */
  trunkPitch: number;
  /** Zgięcie kręgosłupa (stopnie): 0 = neutralny, dodatnie = zaokrąglony grzbiet. */
  spineBend?: number;
  /** Pochylenie głowy od pionu (stopnie, bezwzględne, do przodu dodatnie). Domyślnie 40% pochylenia tułowia (patrzy przed siebie). */
  headPitch?: number;
  legs: Record<Side, LegIn>;
  arms: Record<Side, ArmIn>;
};

export type Leg = { hip: V3; knee: V3; ankle: V3; heel: V3; toe: V3; err: number };
export type Arm = { shoulder: V3; elbow: V3; wrist: V3; grip: V3; err: number; lower: number; uarm: number };
export type Skeleton = {
  pelvis: V3; spineMid: V3; shoulderC: V3; neck: V3; head: V3;
  /** Jednostkowy kierunek tułowia (miednica → barki) i normalna „przód” (klatka piersiowa). */
  up: V3; front: V3; headUp: V3;
  legs: Record<Side, Leg>; arms: Record<Side, Arm>;
};

/** Współczynnik skrócenia cięciwy tułowia przy zgięciu kręgosłupa (jak w solveSkeleton). */
export const trunkChord = (bendDeg: number): number => Math.cos(rad(bendDeg * 0.55));

const outSign = (s: Side): number => s === 'R' ? 1 : -1;

/** Biodro (staw) i kolano nogi dla miednicy `pelvis` i celu kostki — ten sam IK, którego używa solveSkeleton (do rigów, które liczą odstępy od nóg). */
export function legJoints(pelvis: V3, s: Side, li: LegIn): { hip: V3; knee: V3; err: number } {
  const sg = outSign(s); const hip: V3 = [pelvis[0], pelvis[1], sg * BODY.hipHalf];
  const yaw = rad(li.toeOut ?? 10); const ko = rad(li.kneeOut ?? (li.toeOut ?? 10) * 2);
  const pole = li.kneePole ?? [Math.cos(ko), 0, sg * Math.sin(ko)];
  const r = ik2(hip, li.ankle, BODY.thigh, BODY.shank, pole); void yaw;
  return { hip, knee: r.mid, err: r.err };
}

/** Rozwiązuje szkielet z wejścia (IK kończyn, kręgosłup, głowa). */
export function solveSkeleton(p: PoseIn): Skeleton {
  const up = sag(p.trunkPitch), front = sagFront(p.trunkPitch);
  const bend = p.spineBend ?? 0;
  const chord = trunkChord(bend);
  const shoulderC = add(p.pelvis, mul(up, BODY.trunk * chord));
  const spineMid = add(add(p.pelvis, mul(up, BODY.trunk * 0.5 * chord)), mul(front, -Math.sin(rad(bend)) * BODY.trunk * 0.24));
  const neck = add(shoulderC, mul(up, BODY.neckUp));
  const hp = p.headPitch ?? clamp(p.trunkPitch * 0.4, -20, 60);
  const headUp = sag(hp);
  const head = add(neck, mul(headUp, BODY.headFromC7));

  const legs = {} as Record<Side, Leg>, arms = {} as Record<Side, Arm>;
  for (const s of SIDES) {
    const sg = outSign(s);
    const hip: V3 = [p.pelvis[0], p.pelvis[1], sg * BODY.hipHalf];
    const li = p.legs[s]; const yaw = rad((li.toeOut ?? 10));
    const ko = rad(li.kneeOut ?? (li.toeOut ?? 10) * 2); const pole = li.kneePole ?? [Math.cos(ko), 0, sg * Math.sin(ko)];
    const r = ik2(hip, li.ankle, BODY.thigh, BODY.shank, pole);
    const fp = rad(li.footPitch ?? 0);
    const f: [number, number] = [Math.cos(fp), Math.sin(fp)], nUp: [number, number] = [-Math.sin(fp), Math.cos(fp)];
    const foot = (along: number): V3 => {
      const dx = f[0] * along - nUp[0] * BODY.ankleH, dy = f[1] * along - nUp[1] * BODY.ankleH;
      return [li.ankle[0] + dx * Math.cos(yaw), li.ankle[1] + dy, li.ankle[2] + sg * dx * Math.sin(yaw)];
    };
    legs[s] = { hip, knee: r.mid, ankle: r.end, heel: foot(-BODY.heelBack), toe: foot(BODY.toeFwd), err: r.err };

    const D = p.dims ?? {}; const shoulder: V3 = [shoulderC[0], shoulderC[1], sg * (D.shHalf ?? BODY.shHalf)];
    const ai = p.arms[s]; const aPole = ai.elbowPole ?? [-0.3, -1, sg * 0.4];
    const farm = D.farm ?? BODY.farm; const uarm = D.uarm ?? BODY.uarm; const lower = ai.lower ?? farm + BODY.hand;
    const ra = ik2(shoulder, ai.grip, uarm, lower, aPole);
    const dirF = norm(sub(ra.end, ra.mid));
    arms[s] = { shoulder, elbow: ra.mid, wrist: add(ra.mid, mul(dirF, Math.min(farm, lower - 1))), grip: ra.end, err: ra.err, lower, uarm };
  }
  return { pelvis: p.pelvis, spineMid, shoulderC, neck, head, up, front, headUp, legs, arms };
}

/** Wysokość najniższego punktu stopy (podeszwa) — do kotwiczenia i testów podłogi. */
export const soleY = (l: Leg): number => Math.min(l.heel[1], l.toe[1]);

/** Kąty stawów do sprawdzeń zakresu (konwencja jak w lib/figures/geom: zgięcie dodatnie, wyprost ujemny; stopa: zgięcie grzbietowe dodatnie). */
export function jointAngles(k: Skeleton, s: Side): { hip: number; knee: number; ankle: number; shSag: number; shElev: number; shAbd: number; elbow: number } {
  const L = k.legs[s], A = k.arms[s];
  const ang = (a: V3, b: V3, c: V3): number => { const u = sub(a, b), v = sub(c, b); return deg(Math.acos(clamp(dot(u, v) / ((len(u) * len(v)) || 1), -1, 1))); };
  const hipFlex = 180 - ang(k.shoulderC, L.hip, L.knee);
  const kneeFlex = 180 - ang(L.hip, L.knee, L.ankle);
  const footDir = norm(sub(L.toe, L.heel));
  const ankleDors = 90 - deg(Math.acos(clamp(dot(norm(sub(L.knee, L.ankle)), footDir), -1, 1)));
  const down = mul(k.up, -1); const ua = norm(sub(A.elbow, A.shoulder));
  const shElev = deg(Math.acos(clamp(dot(down, ua), -1, 1)));
  const sagUa = [dot(ua, k.front), dot(ua, k.up)]; /* rzut na płaszczyznę strzałkową tułowia: przód, góra */
  let shSag = deg(Math.atan2(sagUa[0], -sagUa[1])); /* 0 = wzdłuż tułowia w dół, dodatnie = zgięcie (do przodu i w górę) */
  if (shSag < -90) shSag += 360; /* ramię za pionem nad głową = zgięcie powyżej 180°, nie wyprost */
  const elbowFlex = 180 - ang(A.shoulder, A.elbow, A.grip);
  const shAbd = deg(Math.asin(clamp(Math.abs(ua[2]), 0, 1))); /* odchylenie ramienia od płaszczyzny strzałkowej (0 = w płaszczyźnie, 90 = bokiem) */
  return { hip: hipFlex, knee: kneeFlex, ankle: ankleDors, shSag, shElev, shAbd, elbow: elbowFlex };
}
