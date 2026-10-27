/*
 * Figury v2 — szkielet 3D (kinematyka). Jedna figura dorosłego (ok. 175 cm) — proporcje i wymiary to UPROSZCZENIE ILUSTRACYJNE (schemat, nie pomiar;
 * figura nie twierdzi nic o proporcjach ciała). Wszystkie wymiary ciała w jednym miejscu: BODY (cm). Układ świata i jednostki: ./math.ts.
 *
 * Wejście (PoseIn): miednica (środek stawów biodrowych), pochylenie tułowia w płaszczyźnie strzałkowej, zgięcie kręgosłupa, głowa, cele stóp (kostka) i dłoni
 * (środek chwytu) dla obu stron. Kolana i łokcie liczy dwukostny IK z biegunem (kierunek zgięcia). Wyjście: punkty stawów obu stron + kręgosłup + głowa.
 * Ten sam szkielet rzutuje się na widok z boku (kamera po prawej stronie osoby, z = bliższa strona) i z przodu (kamera przed osobą) — project.ts.
 */
import { add, clamp, deg, dot, ik2, len, mul, norm, rad, rotAxis, sag, sagFront, sub, type V3 } from './math';

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

/**
 * Zakresy nowych stopni swobody (poza@2, 26.10.2026). Liczby w jednym miejscu; granica pozy na rysunku, nie norma pokazywana użytkownikowi. Od 26.10.2026 (badacz,
 * data/zrodla/figury-zakresy-poza2.json; tests/zrodla-pelne-zakresy.test.ts pilnuje zgodności): skręt tułowia ±40° i nadgarstek −65…75° mają po dwa przeczytane źródła, skłon
 * boczny tułowia, skłon głowy i przedramię po jednym; przechył miednicy i barki w cm to UPROSZCZENIE ILUSTRACYJNE (brak norm). `roll` to orientacja całego ciała (deska bokiem), nie staw: bez ograniczenia stawowego.
 * Znaki: obrót, skręt i skłon dodatnie = klatka/głowa ku PRAWEJ stronie osoby (+z); przechył dodatni = prawe biodro wyżej; barki: cm wzdłuż osi tułowia (dodatnie = w górę);
 * nadgarstek: zgięcie dodatnie (dłoń ku przedramieniu), wyprost ujemny; obrót przedramienia: 0 = kciuk w górę, dodatni = supinacja (dłoń w górę), ujemny = pronacja (dłoń w dół); skłon boczny głowy dodatni = ucho ku prawemu barkowi; wysunięcie barku w cm wzdłuż przodu klatki (dodatnie = protrakcja).
 */
export const EXT_ROM = {
  roll: { min: -180, max: 180 },
  twist: { min: -40, max: 40 },
  lean: { min: -35, max: 35 },
  tilt: { min: -15, max: 15 },
  shrug: { min: -3, max: 6 },
  wrist: { min: -65, max: 75 },
  forearm: { min: -80, max: 80 },
  headTilt: { min: -35, max: 35 },
  protract: { min: -4, max: 6 },
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
export type ArmIn = {
  grip: V3; elbowPole?: V3; lower?: number;
  /** Uniesienie (+) albo obniżenie (−) barku wzdłuż osi tułowia (cm); szrugsy. Domyślnie 0. */
  shrug?: number;
  /** Zgięcie (+) albo wyprost (−) nadgarstka (stopnie): dłoń odchyla się od osi przedramienia ku stronie dłoni (+) albo grzbietu (−). Domyślnie 0 (dłoń w linii przedramienia). */
  wristFlex?: number;
  /** Wysunięcie (+, protrakcja) albo cofnięcie (−) barku wzdłuż przodu klatki (cm). Domyślnie 0. */
  protract?: number;
  /** Obrót przedramienia (stopnie): 0 = kciuk w górę, dodatni = supinacja (dłoń w górę), ujemny = pronacja (dłoń w dół). Wyznacza płaszczyznę zgięcia nadgarstka i kierunek dłoni (`Arm.palm`). Domyślnie 0. */
  forearmRoll?: number;
};
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
  /** Obrót całego tułowia z miednicą wokół osi długiej (stopnie; 0 = klatka do przodu, +90 = klatka ku prawej stronie osoby; deska bokiem, Copenhagen). Domyślnie 0. */
  trunkRoll?: number;
  /** Skręt klatki piersiowej względem miednicy wokół osi tułowia (stopnie; + = klatka ku prawej stronie). Domyślnie 0. */
  trunkTwist?: number;
  /** Skłon boczny tułowia (stopnie; + = głowa ku prawej stronie): sztywny przechył osi tułowia w płaszczyźnie czołowej, w stawie biodrowym. Domyślnie 0. */
  trunkLean?: number;
  /** Przechył miednicy w płaszczyźnie czołowej (stopnie; + = prawe biodro wyżej): przesuwa tylko stawy biodrowe. Domyślnie 0. */
  pelvisTilt?: number;
  /** Skłon boczny głowy względem tułowia (stopnie; + = ucho ku prawemu barkowi). Domyślnie 0. */
  headTilt?: number;
  /** Boczne przesunięcie korzenia (cm; + = ku prawej stronie osoby, oś z): przesuwa stawy biodrowe i barki (kroki boczne, skoki boczne). `pelvis` podaje się już z tym przesunięciem; kostki i chwyty nadal w układzie świata. Domyślnie 0 (jak dotąd). */
  lateral?: number;
  legs: Record<Side, LegIn>;
  arms: Record<Side, ArmIn>;
};

export type Leg = { hip: V3; knee: V3; ankle: V3; heel: V3; toe: V3; err: number };
export type Arm = {
  shoulder: V3; elbow: V3; wrist: V3; grip: V3; err: number; lower: number;
  /** Jednostkowy kierunek dłoni (nadgarstek → środek chwytu) i normalna dłoni (od grzbietu ku wnętrzu dłoni). */
  hand: V3; palm: V3;
  /** Zastosowane uniesienie barku (cm), zgięcie nadgarstka i obrót przedramienia (stopnie). */
  shrug: number; protract: number; wristFlex: number; forearmRoll: number;
  /** Długość przedramienia (łokieć → nadgarstek, cm); gdy `bent` (zgięty nadgarstek), środek chwytu nie leży na prostej łokieć–nadgarstek. */
  forearm: number; bent: boolean;
  /** Długość ramienia (bark → łokieć, cm) tej figury (BODY.uarm albo wymiar z `dims`). */
  uarm: number;
};
export type Skeleton = {
  pelvis: V3; spineMid: V3; shoulderC: V3; neck: V3; head: V3;
  /** Jednostkowy kierunek tułowia (miednica → barki) i normalna „przód” (klatka piersiowa). */
  up: V3; front: V3; headUp: V3;
  /** Oś barków (ku prawej stronie osoby), oś bioder po przechyle oraz kierunek twarzy (normalna przód głowy). */
  right: V3; pelvisRight: V3; headFront: V3;
  /** Zastosowane: obrót, skręt, skłon boczny tułowia i przechył miednicy (stopnie). */
  roll: number; twist: number; lean: number; tilt: number; headTilt: number;
  legs: Record<Side, Leg>; arms: Record<Side, Arm>;
};

/** Współczynnik skrócenia cięciwy tułowia przy zgięciu kręgosłupa (jak w solveSkeleton). */
export const trunkChord = (bendDeg: number): number => Math.cos(rad(bendDeg * 0.55));

const outSign = (s: Side): number => s === 'R' ? 1 : -1;

/** Biodro (staw) i kolano nogi dla miednicy `pelvis` i celu kostki — ten sam IK, którego używa solveSkeleton (do rigów, które liczą odstępy od nóg). */
export function legJoints(pelvis: V3, s: Side, li: LegIn, hipAt?: V3): { hip: V3; knee: V3; err: number } {
  const sg = outSign(s); const hip: V3 = hipAt ?? [pelvis[0], pelvis[1], sg * BODY.hipHalf];
  const yaw = rad(li.toeOut ?? 10); const ko = rad(li.kneeOut ?? (li.toeOut ?? 10) * 2);
  const pole = li.kneePole ?? [Math.cos(ko), 0, sg * Math.sin(ko)];
  const r = ik2(hip, li.ankle, BODY.thigh, BODY.shank, pole); void yaw;
  return { hip, knee: r.mid, err: r.err };
}

const RIGHT: V3 = [0, 0, 1];
/** Osie tułowia: miednicy (przed skłonem i skrętem) i klatki. Bez nowych pól (obrót, skręt, skłon, przechył = 0) dokładnie osie płaszczyzny strzałkowej (jak w poza@1). */
export type TrunkAxes = { up: V3; front: V3; right: V3; pelvisFront: V3; pelvisRight: V3; ext: boolean; roll: number; twist: number; lean: number; tilt: number };
export function trunkAxes(p: Pick<PoseIn, 'trunkPitch' | 'trunkRoll' | 'trunkTwist' | 'trunkLean' | 'pelvisTilt'>): TrunkAxes {
  const roll = p.trunkRoll ?? 0, twist = p.trunkTwist ?? 0, lean = p.trunkLean ?? 0, tilt = p.pelvisTilt ?? 0;
  const up0 = sag(p.trunkPitch), fr0 = sagFront(p.trunkPitch);
  if (roll === 0 && twist === 0 && lean === 0 && tilt === 0) return { up: up0, front: fr0, right: RIGHT, pelvisFront: fr0, pelvisRight: RIGHT, ext: false, roll, twist, lean, tilt };
  /* kolejność: obrót ciała wokół osi długiej → skłon boczny wokół „przodu” miednicy → skręt klatki wokół nowej osi tułowia; przechył miednicy osobno (tylko biodra) */
  const fr1 = rotAxis(fr0, up0, -roll), rt1 = rotAxis(RIGHT, up0, -roll);
  const up1 = rotAxis(up0, fr1, lean), rt2 = rotAxis(rt1, fr1, lean);
  const fr3 = rotAxis(fr1, up1, -twist), rt3 = rotAxis(rt2, up1, -twist);
  return { up: up1, front: fr3, right: rt3, pelvisFront: fr1, pelvisRight: rotAxis(rt1, fr1, -tilt), ext: true, roll, twist, lean, tilt };
}

/** Staw biodrowy strony `s` (z przechyłem i obrotem miednicy). Bez nowych pól: [x, y, ±hipHalf] jak dotąd (z miednicy nie wchodzi do bioder). */
export function hipPoint(p: Pick<PoseIn, 'pelvis' | 'trunkPitch' | 'trunkRoll' | 'trunkTwist' | 'trunkLean' | 'pelvisTilt' | 'lateral'>, s: Side): V3 {
  const sg = outSign(s); const ax = trunkAxes(p); const lat = p.lateral ?? 0;
  if (!ax.ext) return [p.pelvis[0], p.pelvis[1], lat + sg * BODY.hipHalf];
  const r = ax.pelvisRight; return [p.pelvis[0] + sg * BODY.hipHalf * r[0], p.pelvis[1] + sg * BODY.hipHalf * r[1], lat + sg * BODY.hipHalf * r[2]];
}

/** Kierunek dłoni i jej normalna dla przedramienia o kierunku `f` (łokieć → nadgarstek), biegunie łokcia `pole`, zgięciu `w` i obrocie `roll` strony `sg`. */
function handOf(f: V3, pole: V3, sg: number, w: number, roll: number, fallback: V3): { hand: V3; palm: V3 } {
  let c = mul(sub(pole, mul(f, dot(pole, f))), -1); /* strona, ku której zamyka się łokieć (przeciwna do jego wypukłości) */
  if (len(c) < 1e-6) c = sub(fallback, mul(f, dot(fallback, f)));
  if (len(c) < 1e-6) c = [0, 1, 0];
  const supinated = norm(c); const palm = rotAxis(supinated, f, -sg * (90 - roll));
  const hand = w === 0 ? f : norm(add(mul(f, Math.cos(rad(w))), mul(palm, Math.sin(rad(w)))));
  return { hand, palm };
}

/** Rozwiązuje szkielet z wejścia (IK kończyn, kręgosłup, głowa). */
export function solveSkeleton(p: PoseIn): Skeleton {
  const ax = trunkAxes(p); const up = ax.up, front = ax.front;
  const bend = p.spineBend ?? 0;
  const chord = trunkChord(bend);
  const shoulderC = add(p.pelvis, mul(up, BODY.trunk * chord));
  const spineMid = add(add(p.pelvis, mul(up, BODY.trunk * 0.5 * chord)), mul(ax.pelvisFront, -Math.sin(rad(bend)) * BODY.trunk * 0.24));
  const neck = add(shoulderC, mul(up, BODY.neckUp));
  const hp = p.headPitch ?? clamp(p.trunkPitch * 0.4, -20, 60);
  let headUp = sag(hp), headFront = sagFront(hp);
  if (ax.ext) { /* głowa podąża za obrotem, skłonem i skrętem tułowia */
    const up0 = sag(p.trunkPitch);
    headUp = rotAxis(rotAxis(rotAxis(headUp, up0, -ax.roll), ax.pelvisFront, ax.lean), up, -ax.twist);
    headFront = rotAxis(rotAxis(rotAxis(headFront, up0, -ax.roll), ax.pelvisFront, ax.lean), up, -ax.twist);
  }
  const htl = p.headTilt ?? 0;
  if (htl !== 0) { headUp = rotAxis(headUp, headFront, htl); } /* skłon boczny głowy: obrót osi głowy wokół jej „przodu” */
  const head = add(neck, mul(headUp, BODY.headFromC7));

  const legs = {} as Record<Side, Leg>, arms = {} as Record<Side, Arm>;
  for (const s of SIDES) {
    const sg = outSign(s);
    const hip: V3 = hipPoint(p, s);
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

    const D = p.dims ?? {}; const shH = D.shHalf ?? BODY.shHalf, farm = D.farm ?? BODY.farm, uarm = D.uarm ?? BODY.uarm;
    const ai = p.arms[s];
    const lift = ai.shrug ?? 0;
    const prot = ai.protract ?? 0;
    let shoulder: V3 = ax.ext ? [shoulderC[0] + sg * shH * ax.right[0], shoulderC[1] + sg * shH * ax.right[1], (shoulderC[2] - p.pelvis[2]) + (p.lateral ?? 0) + sg * shH * ax.right[2]] : [shoulderC[0], shoulderC[1], (p.lateral ?? 0) + sg * shH];
    if (lift !== 0) shoulder = add(shoulder, mul(up, lift));
    if (prot !== 0) shoulder = add(shoulder, mul(front, prot));
    const aPole = ai.elbowPole ?? [-0.3, -1, sg * 0.4];
    const lower = ai.lower ?? farm + BODY.hand;
    const wf = ai.wristFlex ?? 0, fr = ai.forearmRoll ?? 0;
    const fLen = Math.min(farm, lower - 1);
    const ra = ik2(shoulder, ai.grip, uarm, lower, aPole);
    const dirF = norm(sub(ra.end, ra.mid));
    if (wf === 0) {
      const hd = handOf(dirF, aPole, sg, 0, fr, up);
      arms[s] = { shoulder, elbow: ra.mid, wrist: add(ra.mid, mul(dirF, fLen)), grip: ra.end, err: ra.err, lower, hand: hd.hand, palm: hd.palm, shrug: lift, protract: prot, wristFlex: 0, forearmRoll: fr, forearm: fLen, bent: false, uarm };
    } else {
      /* zgięty nadgarstek: dłoń (lower − fLen) odchylona od osi przedramienia o wf w płaszczyźnie wyznaczonej obrotem przedramienia; nadgarstek = chwyt − dłoń, iteracyjnie (zbieżne, dłoń ≪ ręka) */
      const handLen = lower - fLen; let elbow = ra.mid, wrist = ra.end, f = dirF, hd = handOf(f, aPole, sg, wf, fr, up), err = ra.err;
      for (let i = 0; i < 8; i++) {
        const target = sub(ai.grip, mul(hd.hand, handLen)); const q = ik2(shoulder, target, uarm, fLen, aPole);
        elbow = q.mid; wrist = q.end; f = norm(sub(q.end, q.mid)); hd = handOf(f, aPole, sg, wf, fr, up);
      }
      const grip = add(wrist, mul(hd.hand, handLen)); err = dist3(grip, ai.grip);
      arms[s] = { shoulder, elbow, wrist, grip, err, lower, hand: hd.hand, palm: hd.palm, shrug: lift, protract: prot, wristFlex: wf, forearmRoll: fr, forearm: fLen, bent: true, uarm };
    }
  }
  return { pelvis: p.pelvis, spineMid, shoulderC, neck, head, up, front, headUp, right: ax.right, pelvisRight: ax.pelvisRight, headFront, roll: ax.roll, twist: ax.twist, lean: ax.lean, tilt: ax.tilt, headTilt: htl, legs, arms };
}
const dist3 = (a: V3, b: V3): number => len(sub(a, b));

/** Wysokość najniższego punktu stopy (podeszwa) — do kotwiczenia i testów podłogi. */
export const soleY = (l: Leg): number => Math.min(l.heel[1], l.toe[1]);

/** Kąty stawów do sprawdzeń zakresu (konwencja jak w lib/figures/geom: zgięcie dodatnie, wyprost ujemny; stopa: zgięcie grzbietowe dodatnie). Biodro ma znak: przeprost (udo za linią tułowia) jest ujemny (poza@2). */
export function jointAngles(k: Skeleton, s: Side): { hip: number; knee: number; ankle: number; shSag: number; shElev: number; shAbd: number; elbow: number; trunkRoll: number; trunkTwist: number; trunkLean: number; pelvisTilt: number; headTilt: number; shrug: number; protract: number; wristFlex: number; forearmRoll: number } {
  const L = k.legs[s], A = k.arms[s];
  const ang = (a: V3, b: V3, c: V3): number => { const u = sub(a, b), v = sub(c, b); return deg(Math.acos(clamp(dot(u, v) / ((len(u) * len(v)) || 1), -1, 1))); };
  const thigh = sub(L.knee, L.hip); const behind = dot(thigh, k.front) < -HIP_SIGN_TOL_CM; /* udo za linią tułowia o więcej niż tolerancja → przeprost (poniżej: bez znaku, jak dotąd) */
  const hipFlex = (behind ? -1 : 1) * (180 - ang(k.shoulderC, L.hip, L.knee));
  const kneeFlex = 180 - ang(L.hip, L.knee, L.ankle);
  const footDir = norm(sub(L.toe, L.heel));
  const ankleDors = 90 - deg(Math.acos(clamp(dot(norm(sub(L.knee, L.ankle)), footDir), -1, 1)));
  const down = mul(k.up, -1); const ua = norm(sub(A.elbow, A.shoulder));
  const shElev = deg(Math.acos(clamp(dot(down, ua), -1, 1)));
  const sagUa = [dot(ua, k.front), dot(ua, k.up)]; /* rzut na płaszczyznę strzałkową tułowia: przód, góra */
  let shSag = deg(Math.atan2(sagUa[0], -sagUa[1])); /* 0 = wzdłuż tułowia w dół, dodatnie = zgięcie (do przodu i w górę) */
  if (shSag < -90) shSag += 360; /* ramię za pionem nad głową = zgięcie powyżej 180°, nie wyprost */
  const elbowFlex = 180 - ang(A.shoulder, A.elbow, A.bent ? A.wrist : A.grip);
  const shAbd = deg(Math.asin(clamp(Math.abs(ua[2]), 0, 1))); /* odchylenie ramienia od płaszczyzny strzałkowej (0 = w płaszczyźnie, 90 = bokiem) */
  return { hip: hipFlex, knee: kneeFlex, ankle: ankleDors, shSag, shElev, shAbd, elbow: elbowFlex, trunkRoll: k.roll, trunkTwist: k.twist, trunkLean: k.lean, pelvisTilt: k.tilt, headTilt: k.headTilt, shrug: A.shrug, protract: A.protract, wristFlex: A.wristFlex, forearmRoll: A.forearmRoll };
}
/** Tolerancja znaku biodra (cm, odległość kolana za linią tułowia): poniżej niej biodro liczone jak dotąd (bez znaku), żeby udo odwiedzione bokiem nie zmieniało znaku od szumu. */
const HIP_SIGN_TOL_CM = 2;
