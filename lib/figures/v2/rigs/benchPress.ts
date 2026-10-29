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
  /** JM Press (badacz 28.10.2026, źródła szczebla 4): łokcie przez cały ruch wysoko, sztanga prawie pionowo ku szyi (na dole `xb` cm za osią barków ku głowie i `yb` cm nad nią; kąt ramienia ku stopom i zgięcie łokcia WYNIKAJĄ z tego), odwiedzenie z góry stałe (`abd` stopni od osi tułowia), przedramię opada ku szyi (zgięcie łokcia `flex` na dole, `inward` = zbieżność przedramion). Elbow z geometrii, nie z IK. */
  jm?: { xb: number; yb: number; abd: number; hz?: number };
  /** Decline Close-Grip Bench To Skull Crusher: figura pokazuje fazę prostowania (uproszczenie, recenzja r2 28.10.2026: faza wyciskania pominięta, bo jedna oś u w pętli ping-pong nie pozwala na dwie fazy bez cyklicznej osi czasu): ramię nieruchome (`aHead` stopni ku głowie, łokcie na szerokość barków), przedramię opada ku głowie, sztanga nad głowę na wysokość `clear` cm nad czubkiem głowy. */
  skull?: { aHead: number; clear: number; inward: number };
  /** Siła odchylenia łokci na boki (biegun IK): 0,45 domyślnie; wąski chwyt / JM — łokcie bliżej, ale poza obrysem ławki. */
  flare?: number;
  /** Przedramiona pionowo w płaszczyźnie czołowej (łokieć dokładnie pod dłonią) w całym ruchu: biegun łokcia liczony z geometrii (NSCA Basics 2012 s. 53–55: nadgarstki nad łokciami, przedramiona prostopadle do podłogi). Kąt odwiedzenia łokci wynika wtedy z szerokości chwytu i punktu dotyku. */
  vert?: boolean;
  /** Dwa uchwyty (rączki) w dłoniach zamiast sztangi (Band Bench Press: guma przypięta do uchwytów i przełożona pod ławką; Chain Press: do każdego uchwytu przypięty łańcuch). */
  handles?: boolean;
};

export const BENCH = {
  /** Kotwica gumy „reverse” nad najwyższym położeniem gryfu (górna belka stojaka), cm. */
  bandHangAbove: 35,
  /** Guma uchwytów przełożona pod ławką (katalog: „band with handles looped under the bench”): wysokość pętli nad podłogą i połowa szerokości, przy której guma schodzi obok ławki (ławka ma 30 cm → 15), cm — uproszczenie ilustracyjne. */
  bandUnder: { y: 6, z: 16 },
  /** Łańcuch uchwytów: zwisa pionowo z uchwytu, resztę leży na podłodze. Długość całkowita wynika z tego, że w górnym położeniu leży `chainLieTop` cm (źródło: jedno, szczebel 4; „czy w górze odrywa się całkiem — do ustalenia”, docs/research/1-0-1-zrodla pkt 3); na dole zwisa krócej, więc leży więcej. */
  chainLieTop: 12,
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
  /* skull crusher: figura pokazuje fazę prostowania (R2-2, recenzja r2 28.10.2026: dwie fazy na jednej osi u dawały w pętli ping-pong 2 wyciskania na 1 prostowanie) */
  const k = ease(u);
  const skAt = (sg: 1 | -1) => {
    const j = p.skull!; const sh: V3 = [shoulderC[0], shoulderC[1], sg * D.shHalf]; const Lf = D.farm + BODY.hand;
    const headTop = trunkPoint(hip, trunkPitch, BODY.trunk + BODY.headFromC7, 0, 0)[1] + BODY.headR + j.clear; /* czubek głowy (poza poprawna, bez błędu) + odstęp */
    const yTop = sh[1] + D.uarm + Lf - 0.05; const ty = yTop + (headTop - yTop) * k; const a = rad(j.aHead * k);
    const v: V3 = [-Math.sin(a), Math.cos(a), 0]; const elbow: V3 = [sh[0] + D.uarm * v[0], sh[1] + D.uarm * v[1], sh[2]];
    const w0: V3 = [-Math.cos(a), -Math.sin(a), -sg * j.inward]; const wl = Math.hypot(w0[0], w0[1], w0[2]); const w: V3 = [w0[0] / wl, w0[1] / wl, w0[2] / wl]; const wv = w[0] * v[0] + w[1] * v[1] + w[2] * v[2];
    const wp: V3 = [w[0] - wv * v[0], w[1] - wv * v[1], w[2] - wv * v[2]]; const wpl = Math.hypot(wp[0], wp[1], wp[2]); const wn: V3 = [wp[0] / wpl, wp[1] / wpl, wp[2] / wpl];
    const at = (thDeg: number): V3 => { const th = rad(thDeg); return [elbow[0] + Lf * (Math.cos(th) * v[0] + Math.sin(th) * wn[0]), elbow[1] + Lf * (Math.cos(th) * v[1] + Math.sin(th) * wn[1]), elbow[2] + Lf * (Math.cos(th) * v[2] + Math.sin(th) * wn[2])]; };
    const th = solveRoot(t => at(t)[1] - ty, 0, 149);
    return { elbow, hand: at(th), sh };
  };
  const skR = p.skull ? skAt(1) : null, skL = p.skull ? skAt(-1) : null;
  /* JM Press: ramię i przedramię z kątów (łokieć nad barkiem, ramię ku stopom, przedramię ku szyi); dłoń wynika z łańcucha bark–łokieć–dłoń */
  const jmAt = (uu: number, sg: 1 | -1) => {
    const j = p.jm!; const kk = ease(uu); const al = rad(j.abd); const sh: V3 = [shoulderC[0], shoulderC[1], sg * D.shHalf];
    const Lf = D.farm + BODY.hand; const yTop = sh[1] + D.uarm + Lf - 0.05;
    const at = (aDeg: number, thDeg: number, inw: number) => {
      const th = rad(thDeg);
      const a = rad(aDeg); const v: V3 = [Math.sin(a) * Math.cos(al), Math.cos(a), sg * Math.sin(a) * Math.sin(al)]; const e: V3 = [-1, 0, -sg * inw]; const ev = e[0] * v[0] + e[1] * v[1] + e[2] * v[2];
      const w0: V3 = [e[0] - ev * v[0], e[1] - ev * v[1], e[2] - ev * v[2]]; const wl = Math.hypot(w0[0], w0[1], w0[2]) || 1; const w: V3 = [w0[0] / wl, w0[1] / wl, w0[2] / wl];
      const elbow: V3 = [sh[0] + D.uarm * v[0], sh[1] + D.uarm * v[1], sh[2] + D.uarm * v[2]];
      return { elbow, hand: [elbow[0] + Lf * (Math.cos(th) * v[0] + Math.sin(th) * w[0]), elbow[1] + Lf * (Math.cos(th) * v[1] + Math.sin(th) * w[1]), elbow[2] + Lf * (Math.cos(th) * v[2] + Math.sin(th) * w[2])] as V3 };
    };
    /* kąt ramienia ku stopom dobrany tak, by dłoń (sztanga) szła od osi barków prawie pionowo ku szyi: x dłoni = x barku + xb·ease(u) */
    const tx = sh[0] + j.xb * kk, ty = yTop + (sh[1] + j.yb - yTop) * kk;
    /* trzecia niewiadoma: zbieżność przedramion `inward` tak, by |z| dłoni był stały = szerokość barków (R2-3, recenzja r2: dłonie nie suną po gryfie) */
    const aFor = (thDeg: number, inw: number) => solveRoot(x => at(x, thDeg, inw).hand[0] - tx, 0, 70, 22);
    const thFor = (inw: number) => solveRoot(t => at(aFor(t, inw), t, inw).hand[1] - ty, 0, 149, 22);
    const inw = solveRoot(w => sg * at(aFor(thFor(w), w), thFor(w), w).hand[2] - (j.hz ?? D.shHalf), 0, 6, 22);
    const th = thFor(inw);
    return at(aFor(th, inw), th, inw);
  };
  const jmCache = new Map<string, ReturnType<typeof jmAt>>(); const jmGet = (uu: number, sg: 1 | -1) => { const key = uu + '|' + sg; let v = jmCache.get(key); if (!v) { v = jmAt(uu, sg); jmCache.set(key, v); } return v; };
  if (p.jm) { top = [jmGet(0, 1).hand[0], jmGet(0, 1).hand[1], 0]; bottom = [jmGet(1, 1).hand[0], jmGet(1, 1).hand[1], 0]; }
  const c: V3 = skR ? [skR.hand[0], skR.hand[1], 0] : p.jm ? [jmGet(u, 1).hand[0], jmGet(u, 1).hand[1], 0] : [top[0] + (bottom[0] - top[0]) * k, top[1] + (bottom[1] - top[1]) * k, 0];

  /* biegun łokcia ku „łokciowi idealnemu” pod dłonią (przedramię pionowo): IK wybiera na okręgu dozwolonych łokci (długości segmentów stałe) punkt najbliższy pionowemu przedramieniu */
  const underGrip = underGripAt;
  const poleR: V3 = p.vert ? underGrip([c[0], c[1], g]) : elbowPole;
  const arms = { R: { grip: [c[0], c[1], g] as V3, elbowPole: poleR }, L: { grip: [c[0], c[1], -g] as V3, elbowPole: [poleR[0], poleR[1], -poleR[2]] as V3 } };
  if (p.jm) { const R = jmGet(u, 1), L = jmGet(u, -1); arms.R = { grip: R.hand, elbowPole: [R.elbow[0] - shoulderC[0], R.elbow[1] - shoulderC[1], R.elbow[2] - D.shHalf] }; arms.L = { grip: L.hand, elbowPole: [L.elbow[0] - shoulderC[0], L.elbow[1] - shoulderC[1], L.elbow[2] + D.shHalf] }; }
  if (skR && skL) { arms.R = { grip: skR.hand, elbowPole: [skR.elbow[0] - skR.sh[0], skR.elbow[1] - skR.sh[1], 0.01] }; arms.L = { grip: skL.hand, elbowPole: [skL.elbow[0] - skL.sh[0], skL.elbow[1] - skL.sh[1], -0.01] }; }
  if (p.oneArm) arms.L = { grip: trunkPoint(hipT, pitchT, 26, 12.5, -7), elbowPole: [0, -0.2, -1] as V3 };
  /* nogi: stopy na podłodze (ujemna: na wałkach przy końcu siedziska) */
  const ankleX = decline ? hip[0] + 44 : hip[0] + BENCH.footBack; const ankleY = decline ? seatY + 6 : floorPress ? 2 + BODY.ankleH : BODY.ankleH;
  const kneePole: V3 = [0.25, 1, 0.35];
  const pose: PoseIn = {
    dims: p.vert ? BENCH.dims : undefined, pelvis: hipT, trunkPitch: pitchT, spineBend: bend, headPitch: trunkPitch + 8,
    legs: { R: { ankle: [ankleX, ankleY, BENCH.footHalf], toeOut: 8, kneePole }, L: { ankle: [ankleX, ankleY, -BENCH.footHalf], toeOut: 8, kneePole: [kneePole[0], kneePole[1], -kneePole[2]] } },
    arms,
  };
  info.load = p.impl === 'db' || p.handles ? [c[0], c[1], g] : c; info.hip = hip; info.shoulder = shoulderC; /* hantle: ślad toru przy hantlu (widok z góry), nie w osi ciała */ info.top = top; info.bottom = bottom;

  if (p.impl === 'db' || p.impl === 'kb') {
    for (const s of p.oneArm ? ['R'] as const : ['R', 'L'] as const) {
      const cc: V3 = [c[0], c[1], s === 'R' ? g : -g];
      props.push(p.impl === 'db' ? { k: 'dumbbell', c: cc, side: s } : { k: 'kettlebell', c: cc, side: s });
    }
  } else if (p.handles) {
    /* dwa uchwyty w dłoniach (ruch jak wyciskanie hantli); pętla gumy pod ławką stoi w miejscu, łańcuch zwisa pionowo z uchwytu, a jego długość na podłodze zmienia się z wysokością dłoni (podłoga = stały punkt styku) */
    const chainLen = top[1] + BENCH.chainLieTop; const dir = 1; /* leżąca część ciągnie się ku stopom (obok ławki, w jej obrysie) */
    for (const sg of [1, -1] as const) {
      const hand: V3 = [c[0], c[1], sg * g];
      props.push({ k: 'handle', c: hand, side: sg > 0 ? 'R' : 'L' });
      if (p.impl === 'band') props.push({ k: 'band', from: hand, to: [top[0], BENCH.bandUnder.y, sg * BENCH.bandUnder.z] });
      else { props.push({ k: 'chain', from: hand, to: [hand[0], 0, hand[2]] }); props.push({ k: 'chain', from: [hand[0], 0, hand[2]], to: [hand[0] + dir * Math.max(0, chainLen - hand[1]), 0, hand[2]] }); }
    }
    if (p.impl === 'band') props.push({ k: 'band', from: [top[0], BENCH.bandUnder.y, BENCH.bandUnder.z], to: [top[0], BENCH.bandUnder.y, -BENCH.bandUnder.z], under: true });
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
