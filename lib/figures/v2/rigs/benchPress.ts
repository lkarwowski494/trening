/*
 * Rodzina „wyciskanie leżąc” (ławka płaska, skośna, ujemna, podłoga): sztanga, hantle, suwnica Smitha, kettlebell, taśmy i łańcuchy; chwyty szeroki, wąski,
 * odwrotny, gilotyna (do szyi), JM Press. Leży na plecach, twarz w górę: głowa po lewej (−x), stopy po prawej (osoba zwrócona „przodem” w górę).
 *
 * Model: plecy leżą na oparciu (oś tułowia 10,2 cm nad powierzchnią), miednica przy zawiasie ławki, stopy na podłodze (ujemna: pod wałkami). Ruch to wyłącznie
 * ręce: u = 0 → łokcie wyprostowane, gryf nad barkami; u = 1 → gryf dotyka klatki (punkt dotyku w układzie tułowia: `touch`). Łokcie z IK (biegun: w dół i na zewnątrz).
 * Podłoga (floor): u = 1 → łokcie dotykają podłogi (zakres ograniczony). Kąty i szerokość chwytu bez źródła = UPROSZCZENIE ILUSTRACYJNE.
 */
import { BODY } from '../skeleton';
import { add, rad, type V2, type V3 } from '../math';
import type { Contact, Frame, Prop } from '../scene';
import { EQUIP } from '../draw';
import { ease, mkFrame, solveRoot, trunkPoint } from './common';
import { ik2 } from '../math';
import type { PoseIn } from '../skeleton';

export type BenchImpl = 'barbell' | 'smith' | 'db' | 'kb' | 'band' | 'chain';
export type BenchParams = {
  impl: BenchImpl;
  /** Kąt oparcia (stopnie): 0 = płasko, dodatni = skos (głowa wyżej), ujemny = ujemna (głowa niżej). */
  angle: number;
  /** Połowa rozstawu dłoni na dole i na górze (cm); hantle mogą się zbliżać na górze. */
  grip: number; gripTop?: number;
  /** Punkt dotyku w układzie tułowia: odległość od miednicy wzdłuż tułowia (cm). */
  touch: number;
  /** Wysokość dotyku nad osią tułowia (cm) — przód klatki / szyi + promień gryfu. */
  touchB?: number;
  floor?: boolean; oneArm?: boolean; squeeze?: boolean; band?: boolean; chain?: boolean;
  /** Siła odchylenia łokci na boki (biegun IK): 0,45 domyślnie; wąski chwyt / JM — łokcie bliżej, ale poza obrysem ławki. */
  flare?: number;
};

export const BENCH = {
  seatTop: 43, declineSeat: 60, padBack: 10.2, backLen: 75, seatLen: 55,
  /** Stopy: odległość kostki od miednicy w stronę stóp (cm) i rozstaw. */
  footBack: 40, footHalf: 24,
  arm: BODY.uarm + BODY.farm + BODY.hand - 0.05,
} as const;

export function benchFrame(p: BenchParams, u: number): Frame {
  const th = rad(p.angle); const d: V2 = [-Math.cos(th), Math.sin(th)], nrm: V2 = [Math.sin(th), Math.cos(th)];
  const floorPress = !!p.floor; const decline = p.angle < 0;
  const seatY = floorPress ? 2 : decline ? BENCH.declineSeat : BENCH.seatTop;
  const H: V2 = [0, seatY];
  /* tułów leży wzdłuż oparcia: kierunek od miednicy do barków = d; pochylenie od pionu = 90 − kąt */
  const trunkPitch = p.angle - 90;
  const hip: V3 = [H[0] + nrm[0] * BENCH.padBack, H[1] + nrm[1] * BENCH.padBack, 0];
  const props: Prop[] = []; const info: Record<string, V3> = {}; const contacts: Contact[] = [];
  if (floorPress) props.push({ k: 'floor', x0: -120, x1: 95 }, { k: 'mat', x0: -90, x1: 80, h: 2 });
  else props.push({ k: 'floor', x0: -120, x1: 95 }, { k: 'bench', seatFrom: [BENCH.seatLen, seatY], hinge: H, backTo: [H[0] + d[0] * BENCH.backLen, H[1] + d[1] * BENCH.backLen], legH: seatY });

  const shoulderC = trunkPoint(hip, trunkPitch, BODY.trunk, 0, 0);
  const grip0 = p.gripTop ?? p.grip;
  const gripAt = (k: number): number => grip0 + (p.grip - grip0) * ease(k);
  const g = gripAt(u);
  const L = BENCH.arm;
  /* góra: ręce wyprostowane, gryf nad barkiem (lekko w stronę stóp) */
  const dz0 = grip0 - BODY.shHalf; const x0 = shoulderC[0] + 2;
  const top: V3 = [x0, shoulderC[1] + Math.sqrt(Math.max(1, L * L - 4 - dz0 * dz0)), 0];
  /* dół: dotyk w układzie tułowia (u podłogi: wysokość, przy której łokcie dotykają podłogi) */
  const touchB = p.touchB ?? 11.9 + EQUIP.barR;
  let bottom = trunkPoint(hip, trunkPitch, p.touch, touchB, 0);
  const fl = p.flare ?? (p.grip < 20 ? 1.1 : 0.8); const elbowPole: V3 = [0, -1, fl];
  if (floorPress) {
    const f = (y: number): number => { const sh: V3 = [shoulderC[0], shoulderC[1], BODY.shHalf]; const r = ik2(sh, [bottom[0], y, g], BODY.uarm, BODY.farm + BODY.hand, elbowPole); return r.mid[1] - (2 + 4.6); };
    bottom = [bottom[0], solveRoot(f, bottom[1] - 4, bottom[1] + 30), 0];
  }
  const k = ease(u);
  const c: V3 = [top[0] + (bottom[0] - top[0]) * k, top[1] + (bottom[1] - top[1]) * k, 0];

  const arms = { R: { grip: [c[0], c[1], g] as V3, elbowPole }, L: { grip: [c[0], c[1], -g] as V3, elbowPole: [elbowPole[0], elbowPole[1], -elbowPole[2]] as V3 } };
  if (p.oneArm) arms.L = { grip: trunkPoint(hip, trunkPitch, 26, 12.5, -7), elbowPole: [0, -0.2, -1] as V3 };
  /* nogi: stopy na podłodze (ujemna: na wałkach przy końcu siedziska) */
  const ankleX = decline ? hip[0] + 44 : hip[0] + BENCH.footBack; const ankleY = decline ? seatY + 6 : floorPress ? 2 + BODY.ankleH : BODY.ankleH;
  const kneePole: V3 = [0.25, 1, 0.35];
  const pose: PoseIn = {
    pelvis: hip, trunkPitch, headPitch: trunkPitch + 8,
    legs: { R: { ankle: [ankleX, ankleY, BENCH.footHalf], toeOut: 8, kneePole }, L: { ankle: [ankleX, ankleY, -BENCH.footHalf], toeOut: 8, kneePole: [kneePole[0], kneePole[1], -kneePole[2]] } },
    arms,
  };
  info.load = c; info.hip = hip; info.shoulder = shoulderC; info.top = top; info.bottom = bottom;

  if (p.impl === 'db' || p.impl === 'kb') {
    for (const s of p.oneArm ? ['R'] as const : ['R', 'L'] as const) {
      const cc: V3 = [c[0], c[1], s === 'R' ? g : -g];
      props.push(p.impl === 'db' ? { k: 'dumbbell', c: cc, side: s } : { k: 'kettlebell', c: cc, side: s });
    }
  } else {
    props.push({ k: 'barbell', c });
    info.bar = c;
    if (p.impl === 'smith') props.push({ k: 'rail', x: c[0], h: 190 });
    if (p.band || p.impl === 'band') props.push({ k: 'band', from: c, to: [c[0], 0, 0] });
    if (p.chain || p.impl === 'chain') props.push({ k: 'chain', from: c, to: [c[0], 0, 0] });
  }
  /* dozwolone kontakty: plecy na oparciu, miednica i uda na siedzisku, gryf/hantle na klatce (tylko na dole) */
  contacts.push({ body: 'torso', equip: 'benchBack', tol: 1.5 }, { body: 'pelvis', equip: 'benchSeat', tol: 1.5 }, { body: 'pelvis', equip: 'benchBack', tol: 1.5 },
    { body: 'thigh', equip: 'benchSeat', tol: 1.5 }, { body: 'torso', equip: 'benchSeat', tol: 1.5 }, { body: 'uarm', equip: 'benchBack', tol: 6 }, { body: 'uarm', equip: 'benchSeat', tol: 6 }, { body: 'farm', equip: 'benchBack', tol: 2.5 }, { body: 'farm', equip: 'benchSeat', tol: 2.5 }, { body: 'uarm', equip: 'mat', tol: 1.5 },
    { body: 'torso', equip: 'bar', tol: 2.6 }, { body: 'uarm', equip: 'bar', tol: 2.2 }, { body: 'head', equip: 'benchBack', tol: 1.5 }, { body: 'torso', equip: 'mat', tol: 1.5 }, { body: 'pelvis', equip: 'mat', tol: 1.5 }, { body: 'head', equip: 'mat', tol: 1.5 });
  void add;
  return mkFrame(pose, props, info, contacts);
}
