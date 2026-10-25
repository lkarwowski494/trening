/*
 * Rodzina „przysiad” (obustronny przysiad stojący): sztanga na plecach (wysoko/nisko), z przodu, Zercher, nad głową, goblet (hantel/kettlebell),
 * hantle przy bokach, ciężar własny, linka, landmine, suwnica Smitha, skrzynia, ściana (siad przy ścianie), taśmy i łańcuchy.
 *
 * Model: stopy płasko na podłodze (kostka 7 cm nad podłogą), kąt zgięcia kolana K narasta z u (0 = wyprost, K_end = dół), podudzie pochyla się do przodu
 * proporcjonalnie do K (σ, limit zgięcia grzbietowego 36° — poniżej granicy z docs/research/28), udo wynika z K i σ. Pochylenie tułowia τ w przysiadach ze sztangą
 * jest WYZNACZANE: gryf ma być nad śródstopiem (zasada równowagi układu człowiek + sztanga — ilustracyjna, bez liczb w UI); w pozostałych — z harmonogramu.
 * Kąty bez podanego źródła (K_end, τ, rozstaw) to UPROSZCZENIE ILUSTRACYJNE.
 */
import { BODY } from '../skeleton';
import { add, type V3 } from '../math';
import type { Frame, Prop, Contact } from '../scene';
import { ease, legFK, mkFrame, solveRoot, trunkPoint, type ShinRule } from './common';
import type { PoseIn } from '../skeleton';

export type SquatLoad = 'highBar' | 'lowBar' | 'frontBar' | 'zercher' | 'overhead' | 'goblet' | 'dbSides' | 'dbSumo' | 'bodyweight' | 'belt' | 'landmine' | 'behind' | 'kbRack' | 'kbOverhead1';
export type SquatImpl = 'barbell' | 'db' | 'kb' | 'none' | 'cable';
export type SquatParams = {
  load: SquatLoad; impl: SquatImpl;
  /** Zgięcie kolana na dole (stopnie; uproszczenie ilustracyjne, granica: ROM kolana 141°). */
  depth: number;
  /** Połowa rozstawu kostek (cm) i rotacja zewnętrzna stóp (stopnie). */
  stance: number; toeOut: number;
  /** Reguła podudzia (domyślnie przysiad); dzień dobry używa pionowego podudzia. */
  shin?: ShinRule;
  box?: number; wall?: boolean; smith?: boolean; band?: boolean; chain?: boolean;
};

export const SQUAT = {
  /** Pochylenie podudzia (od pionu) w pozycji stojącej i limit w głębi (zgięcie grzbietowe stopy ≤ limit z docs/research/28, 37°). */
  shinStand: 4, shinMax: 36, shinPerKnee: 0.3,
  /** Śródstopie względem kostki (x, cm): środek między piętą a palcami. */
  midfoot: (BODY.toeFwd - BODY.heelBack) / 2,
  /** Pochylenie tułowia w pozycji stojącej dla ciężaru własnego i dół (harmonogram), stopnie. */
  tauBody: [3, 32] as [number, number],
  gripHalf: { highBar: 28, lowBar: 30, frontBar: 21, overhead: 36, goblet: 5, zercher: 8 },
  /** Środek gryfu w układzie tułowia: odsunięcie od osi (cm) wysoko/nisko na plecach i z przodu (powierzchnia tułowia + promień gryfu). */
  barBack: { high: 12.8, low: 12.6 }, barFront: 9.0,
  landminePivot: 150, cablePulley: [95, 12] as [number, number],
  sit: 9, /* wysokość stawu biodrowego nad siedziskiem (pośladek) */
} as const;

const SHIN: ShinRule = { stand: SQUAT.shinStand, perKnee: SQUAT.shinPerKnee, max: SQUAT.shinMax };
/** Wysokość stawu biodrowego i pozycje kolana dla kąta zgięcia kolana K (stopa płasko, kostka w x = 0). */
export function legChain(K: number, rule: ShinRule = SHIN, dz = 0): { knee: V3; hip: V3; sigma: number } { return legFK(K, rule, [0, BODY.ankleH, 0], dz); }

/** Kąt zgięcia kolana, przy którym staw biodrowy jest na wysokości `h` (do skrzyni). */
export const kneeForHipHeight = (h: number, dz = 0): number => solveRoot(K => legChain(K, SHIN, dz).hip[1] - h, 0, 141);

export function squatFrame(p: SquatParams, u: number): Frame {
  const wallSit = !!p.wall;
  const boxH = p.box;
  const Kend = boxH !== undefined ? kneeForHipHeight(boxH + SQUAT.sit, Math.abs(p.stance - BODY.hipHalf)) : p.depth;
  const K = Kend * ease(u);
  const rule = p.shin ?? SHIN; const dzL = Math.abs(p.stance - BODY.hipHalf); const ch = legChain(K, rule, dzL);
  const ankX = 0; const mid = SQUAT.midfoot;
  const ankles: Record<'R' | 'L', V3> = { R: [ankX, BODY.ankleH, p.stance], L: [ankX, BODY.ankleH, -p.stance] };

  let hip = ch.hip;
  let ankleX = ankX;
  if (wallSit) {
    /* siad przy ścianie: podudzie pionowo, miednica przy ścianie (stała), stopy wysuwają się do przodu */
    const hx = 0; const sinK = Math.sin(K * Math.PI / 180), cosK = Math.cos(K * Math.PI / 180); const cg = Math.cos(Math.asin(Math.min(0.9, dzL / (BODY.thigh + BODY.shank))));
    hip = [hx, BODY.ankleH + BODY.shank * cg + BODY.thigh * cg * cosK, 0]; ankleX = hx + BODY.thigh * cg * sinK;
    ankles.R = [ankleX, BODY.ankleH, p.stance]; ankles.L = [ankleX, BODY.ankleH, -p.stance];
  }
  const hipC = (): V3 => hip;

  const tauSched = (): number => SQUAT.tauBody[0] + (SQUAT.tauBody[1] - SQUAT.tauBody[0]) * ease(u);
  const props: Prop[] = []; const info: Record<string, V3> = {}; const contacts: Contact[] = [];
  props.push({ k: 'floor', x0: -95, x1: 120 });
  let tau = 0; let load: V3 | null = null;
  const gh = SQUAT.gripHalf; const armsHeld = (g: V3, half: number, pole: V3) => ({ R: { grip: [g[0], g[1], half] as V3, elbowPole: [pole[0], pole[1], pole[2]] as V3 }, L: { grip: [g[0], g[1], -half] as V3, elbowPole: [pole[0], pole[1], -pole[2]] as V3 } });
  let arms: PoseIn['arms'];
  const target = (off: number) => ankX + mid + off;
  const barAt = (kind: 'high' | 'low' | 'front', t: number): V3 => kind === 'high' ? trunkPoint(hipC(), t, BODY.trunk - 3, -SQUAT.barBack.high, 0) : kind === 'low' ? trunkPoint(hipC(), t, BODY.trunk - 9, -SQUAT.barBack.low, 0) : trunkPoint(hipC(), t, BODY.trunk + 1, SQUAT.barFront, 0);
  const balanceTau = (anchor: (t: number) => V3, off: number): number => wallSit ? 0 : solveRoot(t => anchor(t)[0] - target(off), -5, 80);
  const barOff = p.smith ? -14 : 0;
  const poleBack: V3 = [-0.7, -1, 0.5];

  switch (p.load) {
    case 'highBar': case 'lowBar': {
      const kind = p.load === 'highBar' ? 'high' : 'low';
      tau = balanceTau(t => barAt(kind, t), barOff); load = barAt(kind, tau);
      arms = armsHeld(load, gh[p.load], poleBack); break;
    }
    case 'frontBar': {
      tau = balanceTau(t => barAt('front', t), barOff); load = barAt('front', tau);
      arms = armsHeld(load, gh.frontBar, [1, 0.5, 0.25]); break;
    }
    case 'zercher': {
      const anc = (t: number) => trunkPoint(hipC(), t, 24, 14.5, 0);
      tau = balanceTau(anc, 0); load = anc(tau);
      const hand = trunkPoint(hipC(), tau, 36, 12.5, 0); arms = armsHeld(hand, gh.zercher, [0.6, -1, 0.3]); break;
    }
    case 'overhead': {
      tau = SQUAT.tauBody[0] + 10 + (28 - 10) * ease(u); const sh = trunkPoint(hipC(), tau, BODY.trunk, 0, 0);
      const L = BODY.uarm + BODY.farm + BODY.hand - 3; const dx = target(0) - sh[0]; const dy = Math.sqrt(Math.max(0, L * L - dx * dx - (gh.overhead - 19) ** 2));
      load = [sh[0] + dx, sh[1] + dy, 0]; arms = armsHeld(load, gh.overhead, [0, 0, 0.1]); break;
    }
    case 'goblet': {
      const anc = (t: number) => trunkPoint(hipC(), t, BODY.trunk - 12, 16.5, 0);
      tau = wallSit ? 0 : tauSched(); load = anc(tau);
      arms = armsHeld(load, gh.goblet, [0.2, -1, 0.5]); break;
    }
    case 'kbRack': {
      tau = balanceTau(t => barAt('front', t), 0); load = barAt('front', tau);
      arms = armsHeld(trunkPoint(hipC(), tau, BODY.trunk - 2, 15, 0), 14, [0.8, -0.6, 0.3]); break;
    }
    case 'kbOverhead1': {
      tau = tauSched() * 0.7; const sh = trunkPoint(hipC(), tau, BODY.trunk, 0, BODY.shHalf);
      const L = BODY.uarm + BODY.farm + BODY.hand - 3; const dx = (ankX + mid) - sh[0];
      load = [sh[0] + dx, sh[1] + Math.sqrt(Math.max(0, L * L - dx * dx)), BODY.shHalf];
      arms = { R: { grip: load, elbowPole: [0, 0, 0.1] }, L: { grip: add(trunkPoint(hipC(), tau, BODY.trunk - 6, 24, 0), [0, 0, -14]), elbowPole: [0.2, -1, -0.5] } }; break;
    }
    case 'dbSides': case 'dbSumo': {
      tau = tauSched(); const sh = trunkPoint(hipC(), tau, BODY.trunk, 0, 0);
      if (p.load === 'dbSides') { const g: V3 = [sh[0] + 3, sh[1] - (BODY.uarm + BODY.farm + BODY.hand - 8), 0]; load = g; arms = armsHeld(g, BODY.shHalf + 13, [-0.2, -0.2, 1]); }
      else { const g = trunkPoint(hipC(), tau, 2, 19, 0); load = g; arms = armsHeld(g, 4, [0.1, -0.2, 1]); }
      break;
    }
    case 'landmine': {
      const anc = (t: number) => trunkPoint(hipC(), t, BODY.trunk - 8, 13, 0);
      tau = tauSched(); load = anc(tau); arms = armsHeld(load, 5, [0.2, -1, 0.5]); break;
    }
    case 'belt': {
      tau = tauSched(); const sh = trunkPoint(hipC(), tau, BODY.trunk, 0, 0); const g: V3 = [sh[0] + 22, sh[1] - 8, 0];
      load = hipC(); arms = armsHeld(g, 8, [0, -1, 0.6]); break;
    }
    case 'behind': {
      tau = tauSched(); const sh = trunkPoint(hipC(), tau, BODY.trunk, 0, 0); const bx = hipC()[0] - 11.8; const L = BODY.uarm + BODY.farm + BODY.hand - 1;
      const g: V3 = [bx, sh[1] - Math.sqrt(Math.max(1, L * L - (sh[0] - bx) ** 2 - 25)), 0]; load = g; arms = armsHeld(g, 24, [-0.4, -0.2, 1]); break;
    }
    default: { /* bodyweight */
      tau = wallSit ? 0 : tauSched(); const sh = trunkPoint(hipC(), tau, BODY.trunk, 0, 0); const g: V3 = [sh[0] + (wallSit ? 22 : 54), sh[1] - (wallSit ? 22 : 4), 0];
      load = g; arms = armsHeld(g, 7, [0, -1, 0.5]);
    }
  }
  const pose: PoseIn = { pelvis: hipC(), trunkPitch: tau, legs: { R: { ankle: ankles.R, toeOut: p.toeOut }, L: { ankle: ankles.L, toeOut: p.toeOut } }, arms: arms! };
  info.load = load!; info.hip = hipC(); info.midfoot = [ankleX + mid, 0, 0];

  /* sprzęt */
  const c = load!;
  if (p.load === 'landmine') {
    props.push({ k: 'pivot', from: [SQUAT.landminePivot, 0, 0], to: add(c, [-8, -6, 0]) }); info.bar = c;
  }
  if (p.impl === 'cable' && p.load === 'goblet') props.push({ k: 'cable', from: [SQUAT.cablePulley[0], SQUAT.cablePulley[1], 0], to: c });
  if (p.load === 'belt' && p.impl === 'none') { const w: V3 = [hipC()[0] + 4, Math.max(hipC()[1] - 36, 14), 0]; props.push({ k: 'chain', from: hipC(), to: w }, { k: 'kettlebell', c: [w[0], w[1] + 10, 0], side: 'C', r: 6, held: false }); }
  if (p.band && p.load === 'bodyweight') props.push({ k: 'band', from: [info.midfoot[0], 0, 0], to: c });
  if (p.impl === 'barbell' && p.load !== 'dbSides' && p.load !== 'kbRack' && p.load !== 'landmine') {
    props.push({ k: 'barbell', c, held: p.load !== 'zercher' });
    info.bar = c;
    if (p.band) props.push({ k: 'band', from: c, to: [c[0], 0, 0] });
    if (p.chain) props.push({ k: 'chain', from: c, to: [c[0], 0, 0] });
    if (p.smith) props.push({ k: 'rail', x: c[0], h: 200 });
    if (p.load === 'highBar' || p.load === 'lowBar') contacts.push({ body: 'torso', equip: 'bar', tol: 1.6 });
    if (p.load === 'frontBar') contacts.push({ body: 'torso', equip: 'bar', tol: 2.6 });
    if (p.load === 'zercher') contacts.push({ body: 'torso', equip: 'bar', tol: 6 }, { body: 'uarm', equip: 'bar', tol: 6 }, { body: 'farm', equip: 'bar', tol: 6 });
    if (p.load === 'behind') contacts.push({ body: 'thigh', equip: 'bar', tol: 1.5 });
  }
  if (p.impl === 'db' && p.load === 'goblet') props.push({ k: 'dumbbell', c, side: 'R', vertical: true });
  if (p.impl === 'kb' && p.load === 'goblet') props.push({ k: 'kettlebell', c: add(c, [0, 6, 0]), side: 'C' });
  if (p.impl === 'db' && p.load === 'dbSides') for (const s of ['R', 'L'] as const) props.push({ k: 'dumbbell', c: [c[0], c[1], s === 'R' ? BODY.shHalf + 13 : -(BODY.shHalf + 13)], side: s });
  if (p.impl === 'db' && p.load === 'dbSumo') props.push({ k: 'dumbbell', c, side: 'R', vertical: true });
  if (p.impl === 'kb' && p.load === 'kbRack') for (const s of ['R', 'L'] as const) props.push({ k: 'kettlebell', c: trunkPoint(hipC(), tau, BODY.trunk - 2, 15, s === 'R' ? 14 : -14), side: s });
  if (p.impl === 'kb' && p.load === 'kbOverhead1') props.push({ k: 'kettlebell', c: add(c, [0, 6, 0]), side: 'R' });
  if (p.impl === 'kb' && p.load === 'dbSumo') props.push({ k: 'kettlebell', c: add(c, [0, 0, 0]), side: 'C' });
  if (p.load === 'belt') props.push({ k: 'cable', from: [info.midfoot[0], 0, 0], to: hipC() });
  if (boxH !== undefined) { const hx = legChain(Kend, rule, dzL).hip[0]; const bx1 = Math.min(hx + 12, -BODY.heelBack - 4); props.push({ k: 'box', x0: bx1 - 40, x1: bx1, top: boxH }); contacts.push({ body: 'pelvis', equip: 'box', tol: 1.5 }, { body: 'thigh', equip: 'box', tol: 1.5 }, { body: 'torso', equip: 'box', tol: 1.5 }); }
  if (wallSit) { props.push({ k: 'wall', x: hipC()[0] - 10.5, h: 190 }); contacts.push({ body: 'torso', equip: 'wall', tol: 1.5 }, { body: 'pelvis', equip: 'wall', tol: 1.5 }); }
  return mkFrame(pose, props, info, contacts);
}
