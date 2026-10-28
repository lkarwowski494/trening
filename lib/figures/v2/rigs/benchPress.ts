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
import { trunkChord, type PoseIn } from '../skeleton';
import type { Fault } from '../errors';

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
  /** Odmiana „reverse”: guma zwisa z góry stojaka do gryfu (zamiast od gryfu do podłogi). */
  reverse?: boolean;
  /** Deska na klatce (Board Press): grubość (cm) — gryf zatrzymuje się na desce, więc dotyk jest o tyle wyżej niż na klatce (`touchB` wynika z grubości). */
  board?: number;
  /** Bolce w stojaku (Pin Press): gryf opiera się na bolcach w dolnym punkcie ruchu — rysunek bolców i słupków pod gryfem. */
  pins?: boolean;
  /** Siła odchylenia łokci na boki (biegun IK): 0,45 domyślnie; wąski chwyt / JM — łokcie bliżej, ale poza obrysem ławki. */
  flare?: number;
  /** Przedramiona pionowo w płaszczyźnie czołowej (łokieć dokładnie pod dłonią) w całym ruchu: biegun łokcia liczony z geometrii (NSCA Basics 2012 s. 53–55: nadgarstki nad łokciami, przedramiona prostopadle do podłogi). Kąt odwiedzenia łokci wynika wtedy z szerokości chwytu i punktu dotyku. */
  vert?: boolean;
};

export const BENCH = {
  /** Kotwica gumy „reverse” nad najwyższym położeniem gryfu (górna belka stojaka), cm. */
  bandHangAbove: 35,
  seatTop: 43, declineSeat: 60, padBack: 10.2, backLen: 75, seatLen: 55,
  /** Stopy: odległość kostki od miednicy w stronę stóp (cm) i rozstaw. */
  footBack: 40, footHalf: 24,
  /** Sylwetka wyciskania: mediany ANSUR II, mężczyźni (połowa szerokości dwubarkowej 41 cm → 20,5; akromion–radiale 33,5 ≈ 0,189 × wzrost 175,6 = 33,2; radiale–stylion 26,7 / 0,145 × 175,6 = 25,5) — zgodne źródła; „staw = akromion bocznie” to uproszczenie (docs/50). */
  dims: { uarm: 33, farm: 26.5, shHalf: 20.5 },
} as const;

export function benchFrame(p: BenchParams, u: number, fault?: Fault): Frame {
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

  /* błąd „wygięcie lędźwi”: barki zostają na oparciu, miednica unosi się nad ławkę, kręgosłup wygięty (tułów pochyla się o wynikający kąt) */
  const bend = (fault?.m.spineBend ?? 0) * (fault?.w ?? 0); const lift = (fault?.m.archLift ?? 0) * (fault?.w ?? 0); const Tl = BODY.trunk * trunkChord(bend);
  const shoulderC = trunkPoint(hip, trunkPitch, Tl, 0, 0);
  const sgn = Math.sign(hip[0] - shoulderC[0]) || 1; const dyP = lift; const hipT: V3 = [shoulderC[0] + sgn * Math.sqrt(Math.max(0, Tl * Tl - (hip[1] + dyP - shoulderC[1]) ** 2)), hip[1] + dyP, 0];
  const pitchT = lift ? Math.atan2(shoulderC[0] - hipT[0], shoulderC[1] - hipT[1]) * 180 / Math.PI : trunkPitch;
  const grip0 = p.gripTop ?? p.grip;
  const gripAt = (k: number): number => grip0 + (p.grip - grip0) * ease(k);
  const g = gripAt(u);
  const D = p.vert ? BENCH.dims : { uarm: BODY.uarm, farm: BODY.farm, shHalf: BODY.shHalf }; /* sylwetka ANSUR tylko dla wariantów z `vert` (reszta rodziny bez zmian) */
  const L = D.uarm + D.farm + BODY.hand - 0.05;
  /* góra: ręce wyprostowane, gryf nad barkiem (lekko w stronę stóp) */
  const dz0 = grip0 - D.shHalf; const x0 = shoulderC[0] + 2;
  let top: V3 = [x0, shoulderC[1] + Math.sqrt(Math.max(1, L * L - 4 - dz0 * dz0)), 0];
  /* dół: dotyk w układzie tułowia (u podłogi: wysokość, przy której łokcie dotykają podłogi) */
  const touchB = p.touchB ?? 11.9 + EQUIP.barR + (p.board ?? 0);
  let bottom = trunkPoint(hipT, pitchT, p.touch, touchB, 0);
  const fl = p.flare ?? (p.grip < 20 ? 1.1 : 0.8); const elbowPole: V3 = [0, -1, fl];
  const underGripAt = (grip: V3): V3 => { const sh: V3 = [shoulderC[0], shoulderC[1], D.shHalf]; return [grip[0] - sh[0], grip[1] - (D.farm + BODY.hand) - sh[1], grip[2] - sh[2]]; };
  if (floorPress) {
    const f = (y: number): number => { const sh: V3 = [shoulderC[0], shoulderC[1], D.shHalf]; const r = ik2(sh, [bottom[0], y, g], D.uarm, D.farm + BODY.hand, p.vert ? underGripAt([bottom[0], y, g]) : elbowPole); return r.mid[1] - (2 + 4.6); };
    bottom = [bottom[0], solveRoot(f, bottom[1] - 4, bottom[1] + 30), 0];
  }
  /* maszyna Smitha: gryf jedzie po pionowej szynie — x stały (punkt dotyku), góra = wyprost ramion nad tym x (skan torów 28.10.2026, lekcja w docs/40; było: ukos 15–18 cm, szyna jechała z gryfem) */
  if (p.impl === 'smith') { const dxs = bottom[0] - shoulderC[0]; top = [bottom[0], shoulderC[1] + Math.sqrt(Math.max(1, L * L - dxs * dxs - dz0 * dz0)), 0]; }
  const k = ease(u);
  const c: V3 = [top[0] + (bottom[0] - top[0]) * k, top[1] + (bottom[1] - top[1]) * k, 0];

  /* biegun łokcia ku „łokciowi idealnemu” pod dłonią (przedramię pionowo): IK wybiera na okręgu dozwolonych łokci (długości segmentów stałe) punkt najbliższy pionowemu przedramieniu */
  const underGrip = underGripAt;
  const poleR: V3 = p.vert ? underGrip([c[0], c[1], g]) : elbowPole;
  const arms = { R: { grip: [c[0], c[1], g] as V3, elbowPole: poleR }, L: { grip: [c[0], c[1], -g] as V3, elbowPole: [poleR[0], poleR[1], -poleR[2]] as V3 } };
  if (p.oneArm) arms.L = { grip: trunkPoint(hipT, pitchT, 26, 12.5, -7), elbowPole: [0, -0.2, -1] as V3 };
  /* nogi: stopy na podłodze (ujemna: na wałkach przy końcu siedziska) */
  const ankleX = decline ? hip[0] + 44 : hip[0] + BENCH.footBack; const ankleY = decline ? seatY + 6 : floorPress ? 2 + BODY.ankleH : BODY.ankleH;
  const kneePole: V3 = [0.25, 1, 0.35];
  const pose: PoseIn = {
    dims: p.vert ? BENCH.dims : undefined, pelvis: hipT, trunkPitch: pitchT, spineBend: bend, headPitch: trunkPitch + 8,
    legs: { R: { ankle: [ankleX, ankleY, BENCH.footHalf], toeOut: 8, kneePole }, L: { ankle: [ankleX, ankleY, -BENCH.footHalf], toeOut: 8, kneePole: [kneePole[0], kneePole[1], -kneePole[2]] } },
    arms,
  };
  info.load = p.impl === 'db' ? [c[0], c[1], g] : c; info.hip = hip; info.shoulder = shoulderC; /* hantle: ślad toru przy hantlu (widok z góry), nie w osi ciała */ info.top = top; info.bottom = bottom;

  if (p.impl === 'db' || p.impl === 'kb') {
    for (const s of p.oneArm ? ['R'] as const : ['R', 'L'] as const) {
      const cc: V3 = [c[0], c[1], s === 'R' ? g : -g];
      props.push(p.impl === 'db' ? { k: 'dumbbell', c: cc, side: s } : { k: 'kettlebell', c: cc, side: s });
    }
  } else {
    props.push({ k: 'barbell', c });
    info.bar = c;
    if (p.impl === 'smith') props.push({ k: 'rail', x: c[0], h: 190 });
    if (p.band || p.impl === 'band') props.push(p.reverse ? { k: 'band', from: [top[0], top[1] + BENCH.bandHangAbove, 0], to: c, bar: true, hang: true } : { k: 'band', from: c, to: [top[0], 0, 0], bar: true }); /* dolny zaczep gumy stały (pod gryfem na górze), nie jedzie z gryfem */
    if (p.chain || p.impl === 'chain') props.push({ k: 'chain', from: c, to: [c[0], 0, 0], bar: true });
  }
  /* deska na klatce: leży na powierzchni klatki w punkcie dotyku (wysokość 11,9 nad osią tułowia), gryf spoczywa na jej górze; bolce: gryf opiera się na nich w dolnym punkcie */
  if (p.board) { const ch = trunkPoint(hipT, pitchT, p.touch, 11.9, 0); props.push({ k: 'board', x: ch[0], y: ch[1], h: p.board }); }
  if (p.pins) props.push({ k: 'rack', x: bottom[0], y: bottom[1] - EQUIP.barR, h: EQUIP.rackH });
  /* dozwolone kontakty: plecy na oparciu, miednica i uda na siedzisku, gryf/hantle na klatce (tylko na dole) */
  contacts.push({ body: 'torso', equip: 'benchBack', tol: 1.5 }, { body: 'pelvis', equip: 'benchSeat', tol: 1.5 }, { body: 'pelvis', equip: 'benchBack', tol: 1.5 },
    { body: 'thigh', equip: 'benchSeat', tol: 1.5 }, { body: 'torso', equip: 'benchSeat', tol: 1.5 }, { body: 'uarm', equip: 'benchBack', tol: 6 }, { body: 'uarm', equip: 'benchSeat', tol: 6 }, { body: 'farm', equip: 'benchBack', tol: 2.5 }, { body: 'farm', equip: 'benchSeat', tol: 2.5 }, { body: 'uarm', equip: 'mat', tol: 1.5 },
    { body: 'torso', equip: 'bar', tol: 2.6 }, { body: 'uarm', equip: 'bar', tol: 2.2 }, { body: 'head', equip: 'benchBack', tol: 1.5 }, { body: 'torso', equip: 'mat', tol: 1.5 }, { body: 'pelvis', equip: 'mat', tol: 1.5 }, { body: 'head', equip: 'mat', tol: 1.5 });
  void add;
  return mkFrame(pose, props, info, contacts);
}
