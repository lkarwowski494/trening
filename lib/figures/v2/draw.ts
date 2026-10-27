/*
 * Figury v2 — rysunek: szkielet 3D + rekwizyty → kształty 2D (widok z boku albo z przodu). Kapsuły kończyn, kontur tułowia, głowa, stopy w butach,
 * sprzęt. Brak kolorów — tylko role (palette.ts). Liczby wymiarów sprzętu w EQUIP (jedno miejsce).
 */
import { add, mul, norm, sub, rad, distSegSeg, type V2, type V3 } from './math';
import { BODY, GIRTH, SIDES, type Skeleton } from './skeleton';
import { LAYER, type Prop, type Role, type Shape, type View } from './scene';

/** Wymiary sprzętu (cm). Jedno źródło wartości: ta stała; opis, status i źródło każdego wymiaru — data/zrodla/figury-sprzet.json (test tests/zrodla-pelne-sprzet.test.ts).
 * Gryf, tuleje, talerze i ławka zgodne z normą sprzętu startowego; barR 1,6 to jawna konwencja „pogrubienie dla czytelności”; reszta — uproszczenie ilustracyjne.
 * plateZ = środki dwóch talerzy na tulei (od osi gryfu; pierwszy tuż za wewnętrznym kołnierzem), chainZ = łańcuchy sztangi tuż za zewnętrznym talerzem. */
export const EQUIP = {
  barR: 1.6, barLen: 220, sleeveR: 2.6, plateR: 22.5, plateZ: [66, 71] as [number, number], plateW: 2.8, chainZ: 73,
  dbHeadR: 6.0, dbHandle: 13, kbBallR: 9.5, kbHandleR: 6, medBallR: 11,
  benchW: 30, benchPad: 8, benchLegW: 3.2, floorLine: 1.2,
  trapW: 29, landmineLen: 200, landmineR: 1.8, landmineHand: 10, gymBallR: 32.5, foamR: 7.5, foamLen: 90, rollerR: 4.5, rollerDx: -8, rollerDy: 19, rollerHalf: 28, domeR: 30, hyperTop: 75, hyperKat: 45, hyperLen: 30, hyperT: 10, hyperW: 30, hyperRollerDx: 55, hyperRollerDy: -45, tireR: 60, tireW: 25, logR: 15, logLen: 60, hammerLen: 90, hammerHead: 16, beltLen: 35, beltPlateR: 12, wristBar: 30, wristRope: 60, boxSide: 45, sliderR: 8, sliderH: 2, wheelR: 8, wheelW: 4, suspensionFree: 15, suspensionY: 220, sledHalf: 25, sledBase: 12, sledLen: 60, sledPostH: 100, ropeR: 1.9, ropeTop: 400, ropeBottom: 20, dipHalf: 22, dipLen: 60, dipH: 115, dipR: 1.75, preacherTop: 95, preacherKat: 60, preacherLen: 45, preacherSeatDx: 28, preacherSeatY: 48, preacherW: 50, preacherT: 8, preacherSeatW: 30, preacherSeatL: 34, machinePad: 36, leverEnd: 25, leverArm: 60, leverStroke: 60, towerW: 10, cableR: 0.6, cableEnd: 12, cableSpan: 45, handleR: 1.8, strapR: 3.4, boxW: 45, postW: 3.5, postSpan: 64, railW: 1.2, railSpan: 56, wallW: 3,
} as const;

export const proj = (p: V3, v: View): V2 => v === 'side' ? [p[0], p[1]] : v === 'front' ? [-p[2], p[1]] : [-p[2], -p[0]];
export const depthOf = (p: V3, v: View): number => v === 'side' ? p[2] : v === 'front' ? p[0] : p[1];
const zKey = (layer: number, depth: number): number => layer * 1000 + depth;

/** Wielokąt kapsuły stożkowej (okręgi a–b o promieniach ra, rb) w 2D. */
export function capsule2(a: V2, ra: number, b: V2, rb: number, segs = 8): V2[] {
  const dx = b[0] - a[0], dy = b[1] - a[1], L = Math.hypot(dx, dy);
  const circle = (c: V2, r: number): V2[] => Array.from({ length: segs * 2 }, (_, i) => [c[0] + r * Math.cos(i * Math.PI / segs), c[1] + r * Math.sin(i * Math.PI / segs)] as V2);
  if (L < 1e-6) return circle(a, Math.max(ra, rb));
  if (Math.abs(ra - rb) >= L) return ra > rb ? circle(a, ra) : circle(b, rb);
  const th = Math.atan2(dy, dx), phi = Math.acos((ra - rb) / L), pts: V2[] = [];
  for (let i = 0; i <= segs; i++) { const t = th - phi + (2 * phi) * i / segs; pts.push([b[0] + rb * Math.cos(t), b[1] + rb * Math.sin(t)]); }
  for (let i = 0; i <= segs; i++) { const t = th + phi + (2 * Math.PI - 2 * phi) * i / segs; pts.push([a[0] + ra * Math.cos(t), a[1] + ra * Math.sin(t)]); }
  return pts;
}

type Prof = [number, number][];
/** Profil tułowia z boku: [odległość wzdłuż tułowia od miednicy (cm), tył, przód] (przesunięcie od osi, cm). */
export const TORSO_SIDE: [number, number, number][] = [
  [-8, -5.5, 3], [-3, -10.5, 7.5], [6, -10.2, 9.8], [16, -8.4, 9.4], [26, -8.8, 11.0], [36, -10.0, 12.4], [45, -11.5, 11.0], [51, -10.5, 7.6], [55, -6.0, 4.0],
];
/** Profil tułowia z przodu: [odległość wzdłuż tułowia, połowa szerokości]. */
export const TORSO_FRONT: Prof = [[-8, 8.5], [-2, 14.5], [8, 15.8], [20, 13.6], [34, 16.0], [44, 18.6], [50, 19.0], [54, 12.5]];

export function spineAt(sk: Skeleton, a: number): { p: V3; up: V3 } {
  const pts = [sk.pelvis, sk.spineMid, sk.shoulderC];
  const half = BODY.trunk / 2; const seg = a < half ? 0 : 1; const A = pts[seg], B = pts[seg + 1];
  const up = norm(sub(B, A)); const k = (a - seg * half) / half;
  return { p: add(A, mul(sub(B, A), k)), up };
}

/** Czy szkielet ma obrót, skręt, skłon boczny albo przechył (poza@2): wtedy rysunek tułowia i miednicy uwzględnia obrót przekroju; bez nich rysunek jest taki sam jak w poza@1 (bajtowo). */
export const hasTrunkExt = (sk: Skeleton): boolean => sk.roll !== 0 || sk.twist !== 0 || sk.lean !== 0 || sk.tilt !== 0;
/** Wartość profilu [a, v] w odległości a od miednicy (interpolacja liniowa). */
function profAt(prof: [number, number][], a: number): number {
  if (a <= prof[0][0]) return prof[0][1]; if (a >= prof[prof.length - 1][0]) return prof[prof.length - 1][1];
  let i = 0; while (i < prof.length - 2 && a >= prof[i + 1][0]) i++;
  const [a0, v0] = prof[i], [a1, v1] = prof[i + 1]; return v0 + (v1 - v0) * (a - a0) / (a1 - a0);
}
/** Obrót przekroju tułowia na wysokości a (stopnie): obrót ciała + skręt klatki narastający od miednicy (0) do barków (pełny). */
const sectionYaw = (sk: Skeleton, a: number): number => sk.roll + sk.twist * Math.max(0, Math.min(1, a / BODY.trunk));

function torsoPoly(sk: Skeleton, view: View): V2[] {
  const out: V2[] = [];
  const ext = hasTrunkExt(sk);
  if (view === 'side') {
    const back: V2[] = [], front: V2[] = [];
    for (const [a, bk, fr] of TORSO_SIDE) {
      const { p, up } = spineAt(sk, a);
      if (!ext) { const n: V3 = [up[1], -up[0], 0]; back.push(proj(add(p, mul(n, bk)), view)); front.push(proj(add(p, mul(n, fr)), view)); continue; }
      /* przekrój obrócony wokół osi tułowia: widoczna głębokość = głębokość·|cos| + połowa szerokości·|sin| (przekrój eliptyczny, uproszczenie ilustracyjne) */
      const y = rad(sectionYaw(sk, a)), c = Math.abs(Math.cos(y)), sn = Math.abs(Math.sin(y)), W = profAt(TORSO_FRONT, a); const nl = Math.hypot(up[0], up[1]) || 1; const n: V3 = [up[1] / nl, -up[0] / nl, 0];
      back.push(proj(add(p, mul(n, bk * c - W * sn)), view)); front.push(proj(add(p, mul(n, fr * c + W * sn)), view));
    }
    return [...back, ...front.reverse()];
  }
  const left: V2[] = [], right: V2[] = [];
  for (const [a, w] of TORSO_FRONT) {
    const { p, up } = spineAt(sk, a); const c = proj(p, view);
    if (!ext) { left.push([c[0] - w, c[1]]); right.push([c[0] + w, c[1]]); continue; }
    const y = rad(sectionYaw(sk, a)); const D = (Math.abs(profAt(TORSO_SIDE.map(([x, b, f]) => [x, (f - b) / 2] as [number, number]), a)));
    const wv = w * Math.abs(Math.cos(y)) + D * Math.abs(Math.sin(y)); const t = proj(up, view); const tl = Math.hypot(t[0], t[1]) || 1; const n: V2 = [t[1] / tl, -t[0] / tl];
    left.push([c[0] - wv * n[0], c[1] - wv * n[1]]); right.push([c[0] + wv * n[0], c[1] + wv * n[1]]);
  }
  out.push(...left, ...right.reverse()); return out;
}

/** Kierunek światła w rzucie (z przodu-góry). */
const LIGHT: V2 = [0.6, 0.8];

/** Zarys buta w układzie stopy (wzdłuż stopy, w górę względem kostki), cm. */
const SHOE: V2[] = [[-6.8, -4], [-6.6, -7], [-3, -7.2], [10, -7.2], [19, -7.2], [21.2, -6], [21.4, -3.8], [18, -1.4], [11, 0.6], [5, 3.6], [1.5, 5.2], [-3.2, 5.6], [-5.8, 3.2]];

/** Kształty ciała jednej klatki. `far` = barwy dalszej strony (widok z boku). */
export function bodyShapes(sk: Skeleton, view: View): Shape[] {
  const S: Shape[] = [];
  const side = view === 'side';
  const push = (s: Shape) => { S.push(s); };
  const cap = (id: string, a: V3, ra: number, b: V3, rb: number, fill: Role, depth?: number): void => {
    const z = zKey(LAYER.body, depth ?? (depthOf(a, view) + depthOf(b, view)) / 2); const pa = proj(a, view), pb = proj(b, view);
    push({ k: 'poly', pts: capsule2(pa, ra, pb, rb), fill, z, id, close: true });
    /* światło z przodu i z góry: węższa kapsuła przesunięta ku światłu daje objętość (tylko bliższa strona ciała i ubranie, nie rzut z góry) */
    const hiRole: Role | null = fill === 'skin' ? 'skinHi' : fill === 'cloth' ? 'clothHi' : null;
    if (hiRole && view !== 'top') { const o: V2 = [LIGHT[0] * ra * 0.34, LIGHT[1] * ra * 0.34]; push({ k: 'poly', pts: capsule2([pa[0] + o[0], pa[1] + o[1]], ra * 0.42, [pb[0] + o[0], pb[1] + o[1]], rb * 0.42, 6), fill: hiRole, a: 0.55, z: z + 0.003, id: id + 'Hi', close: true }); }
  };
  const mid = (a: V3, b: V3, t: number): V3 => add(a, mul(sub(b, a), t));

  for (const s of SIDES) {
    const near = s === 'R' || !side; const skin: Role = near ? 'skin' : 'skinFar', cloth: Role = near ? 'cloth' : 'clothFar';
    const L = sk.legs[s], A = sk.arms[s]; const sx = s;
    const kneeMid = mid(L.hip, L.knee, 0.45), shankMid = mid(L.knee, L.ankle, 0.3);
    const td = (depthOf(L.hip, view) + depthOf(L.knee, view)) / 2; /* jedna głębokość dla całego uda: spodenki nad udem, podświetlenie mięśnia nad spodenkami */
    cap('thigh' + sx, L.hip, GIRTH.thigh[0], kneeMid, GIRTH.thigh[1], skin, td); cap('thigh' + sx, kneeMid, GIRTH.thigh[1], L.knee, GIRTH.thigh[2], skin, td);
    cap('shorts' + sx, L.hip, GIRTH.thigh[0] + 0.7, mid(L.hip, L.knee, 0.52), GIRTH.thigh[1] + 0.7, cloth, td + 0.1);
    cap('shank' + sx, L.knee, GIRTH.shank[0], shankMid, GIRTH.shank[1], skin); cap('shank' + sx, shankMid, GIRTH.shank[1], L.ankle, GIRTH.shank[2], skin);
    /* stopa w bucie */
    if (side) {
      const f = norm([L.toe[0] - L.heel[0], L.toe[1] - L.heel[1], 0]); const nU: V3 = [-f[1], f[0], 0];
      const pts = SHOE.map(([al, up]) => proj(add(add(L.ankle, mul(f, al)), mul(nU, up)), view));
      push({ k: 'poly', pts, fill: 'shoe', z: zKey(LAYER.body, L.ankle[2] + 0.5), id: 'foot' + sx, close: true, smooth: true });
    } else if (view === 'top') {
      push({ k: 'poly', pts: capsule2(proj(L.heel, view), 3.6, proj(L.toe, view), 4.4), fill: 'shoe', z: zKey(LAYER.body, L.ankle[1] - 3), id: 'foot' + sx, close: true });
    } else {
      const c = proj(add(L.ankle, [0, 0, 0]), view); const w = 5.4; const dno = Math.min(c[1] - BODY.ankleH, L.toe[1], L.heel[1]); /* dno buta sięga podeszwy także przy stopie na palcach (v2-jakosc: styk z podłogą z przodu) */
      push({ k: 'poly', pts: [[c[0] - w, dno], [c[0] + w, dno], [c[0] + w - 0.5, c[1] - 1], [c[0] + 3, c[1] + 4.5], [c[0] - 3, c[1] + 4.5], [c[0] - w + 0.5, c[1] - 1]], fill: 'shoe', z: zKey(LAYER.body, L.toe[0]), id: 'foot' + sx, close: true, smooth: true });
    }
    /* ramię */
    const sh = A.shoulder, elbMid = mid(sh, A.elbow, 0.5), frMid = mid(A.elbow, A.wrist, 0.4);
    cap('uarm' + sx, sh, GIRTH.uarm[0] + 0.6, elbMid, GIRTH.uarm[0], skin); cap('uarm' + sx, elbMid, GIRTH.uarm[0], A.elbow, GIRTH.uarm[1], skin);
    cap('farm' + sx, A.elbow, GIRTH.farm[0], frMid, GIRTH.farm[0] - 0.2, skin); cap('farm' + sx, frMid, GIRTH.farm[0] - 0.2, A.wrist, GIRTH.farm[1], skin);
    cap('hand' + sx, A.wrist, GIRTH.farm[1] + 0.3, A.grip, GIRTH.hand * 0.82, skin);
  }

  /* tułów, miednica, szyja, głowa (środek: głębokość 0) */
  const tz = zKey(LAYER.body, side ? 0 : (sk.pelvis[0] + sk.shoulderC[0]) / 2);
  push({ k: 'poly', pts: torsoPoly(sk, view), fill: 'cloth', z: tz, id: 'torso', close: true, smooth: true });
  if (side) { const { p: cp } = spineAt(sk, 34); const c = proj(add(cp, mul(sk.front, 5)), view); const ang = Math.atan2(sk.up[1], sk.up[0]) * 180 / Math.PI; push({ k: 'ellipse', c, rx: 2.6, ry: 11, rot: ang - 90, fill: 'clothHi', a: 0.7, z: tz + 0.05, id: 'torsoHi' }); }
  const pc = proj(sk.pelvis, view);
  if (!hasTrunkExt(sk)) {
    if (side) push({ k: 'ellipse', c: pc, rx: GIRTH.pelvis + 0.4, ry: 8.6, rot: 0, fill: 'cloth', z: tz + 0.1, id: 'pelvis' });
    else push({ k: 'ellipse', c: pc, rx: 15.5, ry: 8.0, rot: 0, fill: 'cloth', z: tz + 0.1, id: 'pelvis' });
  } else { /* miednica obrócona (deska bokiem) i/lub przechylona: szerokość i głębokość mieszane wg obrotu, oś wzdłuż linii bioder w widoku z przodu */
    const y = rad(sk.roll), cy = Math.abs(Math.cos(y)), sy = Math.abs(Math.sin(y)); const wide = 15.5, deep = GIRTH.pelvis + 0.4;
    const hr = proj(sk.legs.R.hip, view), hl = proj(sk.legs.L.hip, view); const rot = side ? 0 : Math.atan2(hl[1] - hr[1], hl[0] - hr[0]) * 180 / Math.PI;
    push({ k: 'ellipse', c: pc, rx: side ? deep * cy + wide * sy : wide * cy + deep * sy, ry: 8.4, rot, fill: 'cloth', z: tz + 0.1, id: 'pelvis' });
  }
  cap('neck', sk.shoulderC, GIRTH.neck, add(sk.head, mul(sk.headUp, -BODY.headR * 0.5)), GIRTH.neck - 0.3, 'skin', side ? 0.2 : sk.neck[0]);
  const hc = proj(sk.head, view); const ha = Math.atan2(sk.headUp[1], side ? sk.headUp[0] : 0) * 180 / Math.PI;
  const hz = zKey(LAYER.body, side ? 0.3 : sk.head[0] + 0.3);
  if (side) {
    push({ k: 'ellipse', c: hc, rx: 8.6, ry: 10.6, rot: ha - 90, fill: 'skin', z: hz, id: 'head' });
    const hu = proj(sk.headUp, view);
    const norm2 = Math.hypot(hu[0], hu[1]) || 1; const u2: V2 = [hu[0] / norm2, hu[1] / norm2], f2: V2 = hasTrunkExt(sk) ? [sk.headFront[0], sk.headFront[1]] : [u2[1], -u2[0]]; /* z obrotem twarz zwrócona częściowo do/od kamery */
    const hairPts: V2[] = [];
    for (let i = 0; i <= 10; i++) { const t = rad(-20 + i * 18); const lu = Math.cos(t) * 10.8, lf = -Math.sin(t) * 8.8; hairPts.push([hc[0] + u2[0] * lu + f2[0] * lf, hc[1] + u2[1] * lu + f2[1] * lf]); }
    hairPts.push([hc[0] + u2[0] * 2 + f2[0] * -0.5, hc[1] + u2[1] * 2 + f2[1] * -0.5]);
    push({ k: 'poly', pts: hairPts, fill: 'hair', z: hz + 0.1, id: 'hair', close: true, smooth: true });
    push({ k: 'circle', c: [hc[0] + f2[0] * 8.8 + u2[0] * -0.5, hc[1] + f2[1] * 8.8 + u2[1] * -0.5], r: 1.5, fill: 'skin', z: hz + 0.05, id: 'nose' });
  } else {
    push({ k: 'ellipse', c: hc, rx: 8.0, ry: 10.8, rot: 0, fill: 'skin', z: hz, id: 'head' });
    push({ k: 'ellipse', c: [hc[0], hc[1] + 4.6], rx: 8.3, ry: 6.4, rot: 0, fill: 'hair', z: hz + 0.1, id: 'hair' });
  }
  return S;
}

const rect = (x0: number, y0: number, x1: number, y1: number): V2[] => [[x0, y0], [x1, y0], [x1, y1], [x0, y1]];

/** Położenie nóg pod oparciem maszyny (ułamek długości oparcia od zawiasu). */
const BACK_FRAME_T: [number, number] = [0.08, 0.75];

/** Wielokąty ławki w widoku z boku: siedzisko, oparcie (górna krawędź = powierzchnia, na której leży osoba) i x nóg. Wspólne dla rysunku i kolizji. */
export function benchPolys(pr: Extract<Prop, { k: 'bench' }>): { seat: V2[]; back: V2[]; legs: number[]; legTops: number[] } {
  const T = EQUIP.benchPad; const [sx0, sy] = pr.seatFrom, [hx, hy] = pr.hinge, [bx, by] = pr.backTo;
  const dir: V2 = [bx - hx, by - hy]; const L = Math.hypot(dir[0], dir[1]) || 1; let n: V2 = [-dir[1] / L, dir[0] / L]; if (n[1] < 0) n = [-n[0], -n[1]]; /* normalna w górę */
  const back: V2[] = [[hx, hy - T], [bx - n[0] * T, by - n[1] * T], [bx, by], [hx, hy]];
  /* Oparcie bez siedziska (maszyny: backFrame): nogi stoją pod spodem oparcia i dochodzą do niego (nie wiszą pod zawiasem) — jedna przy zawiasie, druga w trzech czwartych długości. */
  const pod = (t: number): V2 => [back[0][0] + (back[1][0] - back[0][0]) * t, back[0][1] + (back[1][1] - back[0][1]) * t];
  const frame = pr.backFrame ? [pod(BACK_FRAME_T[0]), pod(BACK_FRAME_T[1])] : null; const seatTop = Math.max(sy - EQUIP.benchPad, 0);
  return {
    seat: [[sx0, sy - T], [hx, hy - T], [hx, hy], [sx0, sy]],
    back,
    legs: frame ? frame.map(p => p[0]) : [sx0 + Math.sign(hx - sx0) * 8, bx + Math.sign(hx - bx) * 6],
    legTops: frame ? frame.map(p => p[1]) : [seatTop, seatTop],
  };
}

/** Wielokąty modlitewnika w widoku z boku: pochyła podpórka (powierzchnia od górnego do dolnego końca, grubość preacherT w głąb) i siedzisko. Wspólne dla rysunku i kolizji. */
export function preacherPolys(pr: Extract<Prop, { k: 'preacher' }>): { pad: V2[]; seat: V2[] } {
  const [tx, ty] = pr.top, [bx, by] = pr.bottom; const dx = bx - tx, dy = by - ty; const l = Math.hypot(dx, dy) || 1; let n: V2 = [dy / l, -dx / l]; if (n[1] < 0) n = [-n[0], -n[1]]; /* normalna do powierzchni, ku górze (ku osobie) */
  const T = EQUIP.preacherT; const [sx, sy] = pr.seat; const h = EQUIP.preacherSeatL / 2;
  return { pad: [[tx, ty], [bx, by], [bx - n[0] * T, by - n[1] * T], [tx - n[0] * T, ty - n[1] * T]], seat: [[sx - h, sy - EQUIP.benchPad], [sx + h, sy - EQUIP.benchPad], [sx + h, sy], [sx - h, sy]] };
}

/** Wielokąt podpórki bioder ławki do prostowania tułowia w widoku z boku: powierzchnia o długości hyperLen wokół środka, pochylona w dół ku stopom (+x), grubość hyperT w głąb. */
export function hyperPolys(pr: Extract<Prop, { k: 'hyper' }>): { pad: V2[] } {
  const th = rad(pr.kat); const d: V2 = [Math.cos(th), -Math.sin(th)], n: V2 = [Math.sin(th), Math.cos(th)]; const h = pr.len / 2, T = EQUIP.hyperT; const [px, py] = pr.pad;
  const a: V2 = [px - d[0] * h, py - d[1] * h], b: V2 = [px + d[0] * h, py + d[1] * h];
  return { pad: [a, b, [b[0] - n[0] * T, b[1] - n[1] * T], [a[0] - n[0] * T, a[1] - n[1] * T]] };
}

/** Środek wałków na nogi ławki ujemnej (x, y w widoku z boku): nad kostkami przy końcu siedziska. */
export const rollerAt = (pr: Extract<Prop, { k: 'bench' }>): V2 => [pr.seatFrom[0] + EQUIP.rollerDx, pr.seatFrom[1] + EQUIP.rollerDy];

/** Czy rzut dźwigni maszyny w widoku z przodu przechodzi przez głowę w tej klatce (odcinek dźwigni bliżej środka głowy niż promień głowy + 1,4 cm). Ruch jako całość ocenia `dzwigniaPrzezGlowe` (leverGuard.ts). */
export function dzwigniaDotykaGlowy(props: Prop[], sk: Skeleton): boolean {
  const h = proj(sk.head, 'front');
  return props.some(pr => pr.k === 'pivot' && pr.label === 'dzwignia' && distSegSeg([...proj(pr.from, 'front'), 0] as V3, [...proj(pr.to, 'front'), 0] as V3, [h[0], h[1], 0], [h[0], h[1], 0]) < BODY.headR + 1.4);
}
/** Kształty rekwizytów. `hideLever`: nie rysuj dźwigni maszyny w widoku z przodu (decyzja na cały ruch, patrz `dzwigniaPrzezGlowe`). */
export function propShapes(props: Prop[], view: View, hideLever = false): Shape[] {
  const S: Shape[] = []; const side = view === 'side';
  const E = EQUIP;
  for (const pr of props) {
    switch (pr.k) {
      case 'floor': if (view === 'top') break; else S.push({ k: 'line', a: [pr.x0, 0], b: [pr.x1, 0], w: E.floorLine, role: 'floor', z: zKey(LAYER.back, -100), id: 'floor' }); break;
      case 'mat': if (view === 'top') break; else S.push({ k: 'poly', pts: side ? rect(pr.x0, 0, pr.x1, pr.h) : rect(-30, 0, 30, pr.h), fill: 'pad', stroke: 'floor', w: 0.6, close: true, z: zKey(LAYER.backEquip, -50), id: 'mat' }); break;
      case 'wall': if (pr.front && view === 'front') break; else S.push({ k: 'poly', pts: side ? (pr.front ? rect(pr.x, 0, pr.x + E.wallW, pr.h) : rect(pr.x - E.wallW, 0, pr.x, pr.h)) : rect(-110, 0, 110, pr.h), fill: 'frame', a: side ? 0.35 : 0.12, close: true, z: zKey(LAYER.back, -90), id: 'wall' }); break;
      case 'rail': if (view === 'top') break; else if (side) S.push({ k: 'line', a: [pr.x, 0], b: [pr.x, pr.h], w: E.railW, role: 'frame', z: zKey(LAYER.back, -80), id: 'rail' }); else for (const sg of [-1, 1]) S.push({ k: 'line', a: [sg * E.railSpan, 0], b: [sg * E.railSpan, pr.h], w: E.railW, role: 'frame', z: zKey(LAYER.back, -80), id: 'rail' }); break;
      case 'post': {
        if (side) S.push({ k: 'line', a: [pr.x, 0], b: [pr.x, pr.h], w: E.postW, role: 'frame', z: zKey(LAYER.back, -70), id: 'post' });
        else for (const sg of [-1, 1]) S.push({ k: 'line', a: [sg * E.postSpan, 0], b: [sg * E.postSpan, pr.h], w: E.postW, role: 'frame', z: zKey(LAYER.back, -70), id: 'post' });
        if (pr.hook !== undefined && side) S.push({ k: 'line', a: [pr.x, pr.hook], b: [pr.x + 5, pr.hook], w: 2.4, role: 'frame', z: zKey(LAYER.back, -69), id: 'hook' });
        break;
      }
      case 'box': { const bw = (pr.w ?? E.boxW) / 2; const cz = pr.z ?? 0; S.push({ k: 'poly', pts: side ? rect(pr.x0, 0, pr.x1, pr.top) : view === 'front' ? rect(-cz - bw, 0, -cz + bw, pr.top) : rect(-cz - bw, -pr.x1, -cz + bw, -pr.x0), fill: 'pad', stroke: 'frame', w: 1, close: true, z: view === 'front' ? zKey(LAYER.body, pr.x1 + 0.5) : zKey(LAYER.backEquip, -40), id: 'box' }); break; } /* z przodu skrzynia leży w warstwie ciała wg głębokości (x): bliższa widza zasłania dalsze części ciała */
      case 'bench': {
        const w = pr.w ?? E.benchW; const bp = benchPolys(pr); const ro = rollerAt(pr); const zb = (d: number): number => zKey(LAYER.backEquip, d);
        if (side) {
          S.push({ k: 'poly', pts: bp.seat, fill: 'pad', stroke: 'frame', w: 0.8, close: true, z: zb(-30), id: 'benchSeat' });
          S.push({ k: 'poly', pts: bp.back, fill: 'pad', stroke: 'frame', w: 0.8, close: true, z: zb(-29), id: 'benchBack' });
          bp.legs.forEach((x, i) => S.push({ k: 'line', a: [x, 0], b: [x, bp.legTops[i]], w: E.benchLegW, role: 'frame', z: zb(-31), id: 'benchLeg' }));
          if (pr.rollers) S.push({ k: 'circle', c: ro, r: E.rollerR, fill: 'pad', stroke: 'frame', w: 0.8, z: zb(-28), id: 'benchRoller' });
        } else if (view === 'top') {
          S.push({ k: 'poly', pts: rect(-w / 2, pr.seatFrom[0], w / 2, pr.backTo[0]), fill: 'pad', stroke: 'frame', w: 0.8, close: true, z: zb(-30), id: 'benchSeat' });
          if (pr.rollers) S.push({ k: 'poly', pts: rect(-E.rollerHalf, ro[0] - E.rollerR, E.rollerHalf, ro[0] + E.rollerR), fill: 'pad', stroke: 'frame', w: 0.8, close: true, z: zb(-27), id: 'benchRoller' });
        } else {
          S.push({ k: 'poly', pts: rect(-w / 2, pr.seatFrom[1] - E.benchPad, w / 2, pr.seatFrom[1]), fill: 'pad', stroke: 'frame', w: 0.8, close: true, z: zb(-30), id: 'benchSeat' });
          if (pr.rollers) for (const sg of [-1, 1]) S.push({ k: 'circle', c: [sg * E.rollerHalf / 2, ro[1]], r: E.rollerR, fill: 'pad', stroke: 'frame', w: 0.8, z: zb(-27), id: 'benchRoller' });
        }
        break;
      }
      case 'preacher': {
        const pp = preacherPolys(pr); const zb = (d: number): number => zKey(LAYER.backEquip, d); const wp = E.preacherW / 2, ws = E.preacherSeatW / 2;
        if (side) {
          S.push({ k: 'poly', pts: pp.pad, fill: 'pad', stroke: 'frame', w: 0.8, close: true, z: zb(-26), id: 'preacherPad' });
          S.push({ k: 'poly', pts: pp.seat, fill: 'pad', stroke: 'frame', w: 0.8, close: true, z: zb(-26), id: 'preacherSeat' });
          S.push({ k: 'line', a: [pr.bottom[0] - 3, 0], b: [pr.bottom[0] - 3, pr.bottom[1] - E.preacherT], w: E.benchLegW, role: 'frame', z: zb(-27), id: 'preacherLeg' });
          S.push({ k: 'line', a: [pr.seat[0], 0], b: [pr.seat[0], pr.seat[1] - E.benchPad], w: E.benchLegW, role: 'frame', z: zb(-27), id: 'preacherLeg' });
        } else if (view === 'top') {
          S.push({ k: 'poly', pts: rect(-wp, -Math.max(pr.top[0], pr.bottom[0]), wp, -Math.min(pr.top[0], pr.bottom[0])), fill: 'pad', stroke: 'frame', w: 0.8, close: true, z: zb(-26), id: 'preacherPad' });
          S.push({ k: 'poly', pts: rect(-ws, -(pr.seat[0] + E.preacherSeatL / 2), ws, -(pr.seat[0] - E.preacherSeatL / 2)), fill: 'pad', stroke: 'frame', w: 0.8, close: true, z: zb(-26), id: 'preacherSeat' });
        } else {
          S.push({ k: 'poly', pts: rect(-wp, Math.min(pr.top[1], pr.bottom[1]) - E.preacherT, wp, Math.max(pr.top[1], pr.bottom[1])), fill: 'pad', stroke: 'frame', w: 0.8, close: true, z: zb(-26), id: 'preacherPad' });
          S.push({ k: 'poly', pts: rect(-ws, pr.seat[1] - E.benchPad, ws, pr.seat[1]), fill: 'pad', stroke: 'frame', w: 0.8, close: true, z: zb(-25), id: 'preacherSeat' });
        }
        break;
      }
      case 'sled': {
        const zb = (d: number): number => zKey(LAYER.backEquip, d); const x1 = pr.x + pr.len; const B = E.sledBase; const hz = E.sledHalf;
        if (side) {
          S.push({ k: 'poly', pts: rect(pr.x, 0, x1, B), fill: 'frame', a: 0.45, stroke: 'frame', w: 0.8, close: true, z: zb(-24), id: 'sledBase' });
          S.push({ k: 'circle', c: [pr.x + pr.len * 0.55, B + 14], r: 14, fill: 'plate', a: 0.55, stroke: 'plate', w: 0.8, z: zb(-23), id: 'sledPlate' });
          S.push({ k: 'line', a: [pr.x, B], b: [pr.x, pr.h], w: 3, role: 'frame', z: zb(-22), id: 'sledPost' });
        } else if (view === 'front') {
          S.push({ k: 'poly', pts: rect(-hz - 5, 0, hz + 5, B), fill: 'frame', a: 0.45, stroke: 'frame', w: 0.8, close: true, z: zb(-24), id: 'sledBase' });
          for (const sg of [-1, 1]) S.push({ k: 'line', a: [sg * hz, B], b: [sg * hz, pr.h], w: 3, role: 'frame', z: zb(-22), id: 'sledPost' });
        } else {
          S.push({ k: 'poly', pts: rect(-hz - 5, -x1, hz + 5, -pr.x), fill: 'frame', a: 0.45, stroke: 'frame', w: 0.8, close: true, z: zb(-24), id: 'sledBase' });
          for (const sg of [-1, 1]) S.push({ k: 'circle', c: [sg * hz, -pr.x], r: 1.8, fill: 'frame', z: zb(-22), id: 'sledPost' });
        }
        break;
      }
      case 'rope': {
        const zb = zKey(LAYER.backEquip, -21); const R = E.ropeR;
        if (side) S.push({ k: 'line', a: [pr.x, pr.bottom], b: [pr.x, pr.top], w: R * 2, role: 'steel', z: zb, id: 'rope' });
        else if (view === 'front') S.push({ k: 'line', a: [-pr.z, pr.bottom], b: [-pr.z, pr.top], w: R * 2, role: 'steel', z: zb, id: 'rope' });
        else S.push({ k: 'circle', c: [-pr.z, -pr.x], r: R, fill: 'steel', z: zb, id: 'rope' });
        break;
      }
      case 'dipbars': {
        const zb = zKey(LAYER.backEquip, -20); const R = E.dipR;
        if (side) S.push({ k: 'line', a: [pr.x0, pr.h], b: [pr.x1, pr.h], w: R * 2, role: 'steel', z: zb, id: 'dipBar' });
        else if (view === 'front') for (const sg of [-1, 1]) S.push({ k: 'circle', c: [sg * pr.z, pr.h], r: R, fill: 'steel', z: zb, id: 'dipBar' });
        else for (const sg of [-1, 1]) S.push({ k: 'line', a: [sg * pr.z, -pr.x0], b: [sg * pr.z, -pr.x1], w: R * 2, role: 'steel', z: zb, id: 'dipBar' });
        break;
      }
      case 'slider': {
        const o = proj(pr.c, view); const zb = zKey(LAYER.backEquip, -19); const r = pr.r;
        if (view === 'top') S.push({ k: 'circle', c: o, r, fill: 'pad', stroke: 'frame', w: 0.8, z: zb, id: 'slider' });
        else S.push({ k: 'poly', pts: rect(o[0] - r, 0, o[0] + r, E.sliderH), fill: 'pad', stroke: 'frame', w: 0.8, close: true, z: zb, id: 'slider' });
        break;
      }
      case 'wheel': {
        const o = proj(pr.c, view); const zz = zKey(LAYER.frontEquip, 0.3);
        if (side) { S.push({ k: 'circle', c: o, r: pr.r, fill: 'pad', stroke: 'frame', w: 1.2, z: zz, id: 'wheel' }); S.push({ k: 'circle', c: o, r: 1.5, fill: 'steel', z: zz + 0.1, id: 'wheelHub' }); }
        else if (view === 'front') S.push({ k: 'poly', pts: rect(o[0] - E.wheelW / 2, o[1] - pr.r, o[0] + E.wheelW / 2, o[1] + pr.r), fill: 'pad', stroke: 'frame', w: 0.8, close: true, z: zz, id: 'wheel' });
        else S.push({ k: 'poly', pts: rect(o[0] - E.wheelW / 2, o[1] - pr.r, o[0] + E.wheelW / 2, o[1] + pr.r), fill: 'pad', stroke: 'frame', w: 0.8, close: true, z: zz, id: 'wheel' });
        break;
      }
      case 'dome': {
        const zk = zKey(LAYER.backEquip, -33); const r = pr.r;
        if (view === 'top') S.push({ k: 'circle', c: proj(pr.c, view), r, fill: 'pad', stroke: 'frame', w: 0.9, z: zk, id: 'dome' });
        else { const o = proj(pr.c, view); const pts: V2[] = Array.from({ length: 17 }, (_, i) => { const t = Math.PI * i / 16; return [o[0] + r * Math.cos(t), o[1] + r * Math.sin(t)] as V2; }); S.push({ k: 'poly', pts, fill: 'pad', stroke: 'frame', w: 0.9, close: true, z: zk, id: 'dome' }); }
        break;
      }
      case 'hyper': {
        const hp = hyperPolys(pr); const zb = (d: number): number => zKey(LAYER.backEquip, d); const ro = pr.roller; const wp = E.hyperW / 2;
        if (side) {
          S.push({ k: 'poly', pts: hp.pad, fill: 'pad', stroke: 'frame', w: 0.8, close: true, z: zb(-26), id: 'hyperPad' });
          S.push({ k: 'line', a: [pr.pad[0], 0], b: [pr.pad[0], pr.pad[1] - E.hyperT], w: E.benchLegW, role: 'frame', z: zb(-27), id: 'hyperLeg' });
          if (ro) { S.push({ k: 'circle', c: ro, r: E.rollerR, fill: 'pad', stroke: 'frame', w: 0.8, z: zb(-25), id: 'hyperRoller' }); S.push({ k: 'line', a: [ro[0] + 6, 0], b: [ro[0] + 6, ro[1] - E.rollerR], w: E.benchLegW, role: 'frame', z: zb(-27), id: 'hyperLeg' }); }
        } else if (view === 'top') {
          S.push({ k: 'poly', pts: rect(-wp, -(pr.pad[0] + pr.len / 2), wp, -(pr.pad[0] - pr.len / 2)), fill: 'pad', stroke: 'frame', w: 0.8, close: true, z: zb(-26), id: 'hyperPad' });
          if (ro) S.push({ k: 'poly', pts: rect(-E.rollerHalf, -(ro[0] + E.rollerR), E.rollerHalf, -(ro[0] - E.rollerR)), fill: 'pad', stroke: 'frame', w: 0.8, close: true, z: zb(-25), id: 'hyperRoller' });
        } else {
          S.push({ k: 'poly', pts: rect(-wp, pr.pad[1] - E.hyperT - 4, wp, pr.pad[1] + 4), fill: 'pad', stroke: 'frame', w: 0.8, close: true, z: zb(-26), id: 'hyperPad' });
          if (ro) for (const sg of [-1, 1]) S.push({ k: 'circle', c: [sg * E.rollerHalf / 2, ro[1]], r: E.rollerR, fill: 'pad', stroke: 'frame', w: 0.8, z: zb(-25), id: 'hyperRoller' });
        }
        break;
      }
      case 'hammer': {
        const a = proj(pr.a, view), b = proj(pr.b, view); const zz = zKey(LAYER.frontEquip, 0.4); const dx = b[0] - a[0], dy = b[1] - a[1]; const l = Math.hypot(dx, dy) || 1; const u: V2 = [dx / l, dy / l], n: V2 = [-u[1], u[0]]; const hh = E.hammerHead / 2;
        S.push({ k: 'line', a, b, w: 2.6, role: 'steel', z: zz, id: 'hammerHandle' });
        S.push({ k: 'poly', pts: [[b[0] - n[0] * hh - u[0] * 3, b[1] - n[1] * hh - u[1] * 3], [b[0] + n[0] * hh - u[0] * 3, b[1] + n[1] * hh - u[1] * 3], [b[0] + n[0] * hh + u[0] * 5, b[1] + n[1] * hh + u[1] * 5], [b[0] - n[0] * hh + u[0] * 5, b[1] - n[1] * hh + u[1] * 5]], fill: 'load', a: 0.9, close: true, z: zz + 0.1, id: 'hammerHead' });
        break;
      }
      case 'cable': {
        const a = proj(pr.from, view), b = proj(pr.to, view); S.push({ k: 'line', a, b, w: 0.7, role: 'cable', z: zKey(LAYER.frontEquip, 0), id: 'cable' }); S.push({ k: 'circle', c: a, r: 2.6, fill: 'frame', z: zKey(LAYER.back, -60), id: 'pulley' });
        const ends = (pr.ends ?? []).map(e => proj(e, view)); const zz = zKey(LAYER.frontEquip, 0.2);
        if (pr.attach === 'handle') for (const e of ends) S.push({ k: 'circle', c: e, r: E.handleR, fill: 'steel', z: zz, id: 'cableHandle' });
        else if (pr.attach === 'rope') for (const e of ends) { S.push({ k: 'line', a: b, b: e, w: 1.4, role: 'cable', z: zz, id: 'cableRope' }); S.push({ k: 'circle', c: e, r: E.handleR, fill: 'steel', z: zz, id: 'cableHandle' }); }
        else if (pr.attach === 'bar' && ends.length) S.push({ k: 'line', a: ends[0], b: ends[ends.length - 1], w: 2.2, role: 'steel', z: zz, id: 'cableBar' });
        else if (pr.attach === 'strap') for (const e of ends) S.push({ k: 'circle', c: e, r: E.strapR, stroke: 'steel', w: 1.6, z: zz, id: 'cableStrap' });
        break;
      }
      case 'tower': {
        const W = E.towerW; const zk = zKey(LAYER.backEquip, -20);
        if (side) S.push({ k: 'poly', pts: rect(pr.x - W / 2, 0, pr.x + W / 2, pr.h), fill: 'frame', a: 0.28, stroke: 'frame', w: 0.6, close: true, z: zk, id: 'tower' });
        else if (view === 'front') S.push({ k: 'poly', pts: rect(-pr.z - W / 2, 0, -pr.z + W / 2, pr.h), fill: 'frame', a: 0.28, stroke: 'frame', w: 0.6, close: true, z: zk, id: 'tower' });
        else S.push({ k: 'poly', pts: rect(-pr.z - W / 2, -pr.x - W / 2, -pr.z + W / 2, -pr.x + W / 2), fill: 'frame', a: 0.28, stroke: 'frame', w: 0.6, close: true, z: zk, id: 'tower' });
        break;
      }
      case 'band': { const a = proj(pr.from, view), b = proj(pr.to, view); S.push({ k: 'line', a, b, w: 0.9, role: 'load', dash: [2.5, 2], z: zKey(LAYER.frontEquip, 0), id: 'band' }); break; }
      case 'chain': {
        /* łańcuchy sztangi (bar) wiszą na obu tulejach: w widoku z przodu i z góry dwa, na ±chainZ; z boku jeden. Łańcuch pasa (bez bar) — jeden, jak dotąd. */
        const zs = pr.bar && !side ? [-E.chainZ, E.chainZ] : [pr.from[2]];
        for (const zz of zs) { const a = proj([pr.from[0], pr.from[1], zz], view), b = proj([pr.to[0], pr.to[1], pr.bar && !side ? zz : pr.to[2]], view); S.push({ k: 'line', a, b, w: 1.2, role: 'steel', dash: [0.8, 1.4], z: zKey(LAYER.frontEquip, 0), id: 'chain' }); }
        break; }
      case 'slide': {
        const a = proj(pr.from, view); const e = proj(add(pr.from, mul(pr.dir, pr.len)), view); const b = proj(pr.to, view); const zk = zKey(LAYER.backEquip, -25);
        S.push({ k: 'line', a, b: e, w: 2, role: 'frame', z: zk, id: 'slideRail' });
        if (side) { const dx = e[0] - a[0], dy = e[1] - a[1]; const l = Math.hypot(dx, dy) || 1; const n: V2 = [-dy / l, dx / l]; S.push({ k: 'line', a: [b[0] - n[0] * E.machinePad / 2, b[1] - n[1] * E.machinePad / 2], b: [b[0] + n[0] * E.machinePad / 2, b[1] + n[1] * E.machinePad / 2], w: 3, role: 'steel', z: zKey(LAYER.frontEquip, 1), id: 'slidePad' }); }
        else S.push({ k: 'circle', c: b, r: 3, fill: 'steel', z: zKey(LAYER.frontEquip, 1), id: 'slidePad' });
        break;
      }
      case 'pivot': { const a = proj(pr.from, view), b = proj(pr.to, view);
        /* dźwignia maszyny leży w płaszczyźnie ruchu, więc z przodu rzutuje się na pionową kreskę przez środek ciała; gdy przechodzi przez głowę w którejkolwiek klatce ruchu (Lying Machine Squat, Hack Squat: pręt przez twarz, recenzja p2-r2 U-L2, p2-r3 U-H1), nie rysujemy jej (ani punktu obrotu) w całym ruchu — decyzja jest stała, żeby pręt nie migał (hideLever liczy dźwigniaPrzezGlowe) */
        if (view === 'front' && pr.label === 'dzwignia' && hideLever) break;
        S.push({ k: 'line', a, b, w: 2.8, role: 'steel', z: zKey(LAYER.frontEquip, 1), id: 'landmine' }); S.push({ k: 'circle', c: a, r: 3, fill: 'frame', z: zKey(LAYER.back, -60), id: 'pivot' }); break; }
      case 'barbell': {
        const c = pr.c; const o = proj(c, view);
        if (side) {
          if (pr.plates !== false) {
            /* talerz za konturą ciała (pełny, ale blady), z przodu tylko cienki obrys — ciało nie jest zasłonięte */
            S.push({ k: 'circle', c: o, r: E.plateR, fill: 'plate', a: 0.42, z: zKey(LAYER.backEquip, 0), id: 'plateFar' });
            S.push({ k: 'circle', c: o, r: E.plateR, stroke: 'plate', w: 0.8, a: 0.2, z: zKey(LAYER.frontEquip, 0), id: 'plateNear' });
            S.push({ k: 'circle', c: o, r: E.sleeveR + 0.8, stroke: 'plate', w: 0.7, z: zKey(LAYER.frontEquip, 0.5), id: 'plateHub' });
          }
          S.push({ k: 'circle', c: o, r: E.barR, fill: 'steel', z: zKey(LAYER.overlay, 0), id: 'bar' });
        } else {
          const half = (pr.len ?? E.barLen) / 2; const d = c[0];
          S.push({ k: 'line', a: [-half, o[1]], b: [half, o[1]], w: E.barR * 2, role: 'steel', z: zKey(LAYER.body, d), id: 'bar' });
          if (pr.plates !== false) for (const sg of [-1, 1]) for (const zz of E.plateZ) S.push({ k: 'poly', pts: rect(sg * zz - E.plateW / 2, o[1] - E.plateR, sg * zz + E.plateW / 2, o[1] + E.plateR), fill: 'plate', a: 0.55, stroke: 'plate', w: 0.7, close: true, z: zKey(LAYER.body, d - 0.2), id: 'plate' });
        }
        break;
      }
      case 'trapbar': {
        const o = proj(pr.c, view);
        if (side) { S.push({ k: 'poly', pts: [[o[0] - 28, o[1] - 1.5], [o[0] + 28, o[1] - 1.5], [o[0] + 28, o[1] + 1.5], [o[0] - 28, o[1] + 1.5]], fill: 'steel', close: true, z: zKey(LAYER.overlay, 0), id: 'bar' });
          S.push({ k: 'circle', c: o, r: E.plateR, fill: 'plate', a: 0.16, stroke: 'plate', w: 1.1, z: zKey(LAYER.frontEquip, 0), id: 'plateNear' }); }
        else { S.push({ k: 'line', a: [-30, o[1]], b: [30, o[1]], w: 3, role: 'steel', z: zKey(LAYER.body, pr.c[0]), id: 'bar' }); }
        break;
      }
      case 'dumbbell': {
        const o = proj(pr.c, view); const r = pr.r ?? E.dbHeadR; const near = side ? pr.side === 'R' : true;
        const role: Role = 'load'; const zz = zKey(LAYER.frontEquip, side ? pr.c[2] : pr.c[0]);
        if (pr.vertical) {
          for (const dy of [-1, 1]) S.push({ k: 'circle', c: [o[0], o[1] + dy * (E.dbHandle * 0.75)], r: r * 0.9, fill: role, a: 0.9, z: zz, id: 'db' + pr.side });
          S.push({ k: 'line', a: [o[0], o[1] - E.dbHandle * 0.75], b: [o[0], o[1] + E.dbHandle * 0.75], w: 2, role: 'steel', z: zz + 0.1, id: 'dbGrip' + pr.side });
        } else if (side) { S.push({ k: 'circle', c: o, r, fill: role, a: near ? 0.85 : 0.55, z: zz, id: 'db' + pr.side }); S.push({ k: 'circle', c: o, r: 1.5, fill: 'steel', z: zz + 0.1, id: 'dbGrip' + pr.side }); }
        else { S.push({ k: 'poly', pts: rect(o[0] - E.dbHandle / 2 - r * 0.6, o[1] - r, o[0] - E.dbHandle / 2 + r * 0.2, o[1] + r), fill: role, a: 0.85, close: true, z: zz, id: 'db' + pr.side }); S.push({ k: 'poly', pts: rect(o[0] + E.dbHandle / 2 - r * 0.2, o[1] - r, o[0] + E.dbHandle / 2 + r * 0.6, o[1] + r), fill: role, a: 0.85, close: true, z: zz, id: 'db' + pr.side }); S.push({ k: 'line', a: [o[0] - E.dbHandle / 2, o[1]], b: [o[0] + E.dbHandle / 2, o[1]], w: 2, role: 'steel', z: zz + 0.1, id: 'dbGrip' + pr.side }); }
        break;
      }
      case 'kettlebell': {
        const r = pr.r ?? E.kbBallR; const d = pr.dir ?? [0, -1, 0]; const zz = zKey(LAYER.frontEquip, side ? pr.c[2] : pr.c[0]);
        S.push({ k: 'circle', c: proj(add(pr.c, mul(d, r + 2)), view), r, fill: 'load', a: 0.9, z: zz, id: 'kb' });
        S.push({ k: 'circle', c: proj(add(pr.c, mul(d, 1)), view), r: E.kbHandleR, stroke: 'steel', w: 1.8, z: zz + 0.1, id: 'kbHandle' });
        break;
      }
      case 'roll': {
        const o = proj(pr.c, view); const zk = zKey(LAYER.backEquip, -34);
        if (side) S.push({ k: 'circle', c: o, r: pr.r, fill: 'pad', stroke: 'frame', w: 0.9, z: zk, id: 'roll' });
        else if (view === 'front') S.push({ k: 'poly', pts: rect(-pr.len / 2, pr.c[1] - pr.r, pr.len / 2, pr.c[1] + pr.r), fill: 'pad', stroke: 'frame', w: 0.9, close: true, z: zk, id: 'roll' });
        else S.push({ k: 'poly', pts: rect(-pr.len / 2, o[1] - pr.r, pr.len / 2, o[1] + pr.r), fill: 'pad', stroke: 'frame', w: 0.9, close: true, z: zk, id: 'roll' });
        break;
      }
      case 'plate': {
        const o = proj(pr.c, view); const r = pr.r ?? E.plateR; const T = E.plateW; const zz = zKey(LAYER.frontEquip, side ? pr.c[2] : view === 'front' ? pr.c[0] : pr.c[1]);
        if (side) S.push({ k: 'poly', pts: rect(o[0] - T / 2, o[1] - r, o[0] + T / 2, o[1] + r), fill: 'plate', a: 0.8, stroke: 'plate', w: 0.8, close: true, z: zz, id: 'plateHeld' });
        else if (view === 'top') S.push({ k: 'poly', pts: rect(o[0] - r, o[1] - T / 2, o[0] + r, o[1] + T / 2), fill: 'plate', a: 0.8, stroke: 'plate', w: 0.8, close: true, z: zz, id: 'plateHeld' });
        else { S.push({ k: 'circle', c: o, r, fill: 'plate', a: 0.45, stroke: 'plate', w: 0.9, z: zz, id: 'plateHeld' }); S.push({ k: 'circle', c: o, r: E.sleeveR + 0.8, stroke: 'plate', w: 0.7, z: zz + 0.1, id: 'plateHub' }); }
        break;
      }
      case 'ball': {
        const o = proj(pr.c, view); const r = pr.r ?? (pr.held === false ? E.gymBallR : E.medBallR); const zz = zKey(LAYER.frontEquip, side ? pr.c[2] : view === 'front' ? pr.c[0] : pr.c[1]);
        const gym = pr.held === false; /* leżąca na podłodze (piłka gimnastyczna): barwa sprzętu stałego i warstwa za ciałem */
        S.push({ k: 'circle', c: o, r, fill: gym ? 'pad' : 'load', a: gym ? 1 : 0.8, stroke: gym ? 'frame' : 'steel', w: 0.9, z: gym ? zKey(LAYER.backEquip, -35) : zz, id: gym ? 'gymBall' : 'ball' });
        S.push({ k: 'ellipse', c: o, rx: r, ry: r * 0.34, rot: 0, stroke: gym ? 'frame' : 'steel', w: 0.6, a: 0.5, z: (gym ? zKey(LAYER.backEquip, -35) : zz) + 0.1, id: 'ballSeam' });
        S.push({ k: 'ellipse', c: o, rx: r * 0.34, ry: r, rot: 0, stroke: gym ? 'frame' : 'steel', w: 0.6, a: 0.5, z: (gym ? zKey(LAYER.backEquip, -35) : zz) + 0.1, id: 'ballSeam' });
        break;
      }
    }
  }
  return S;
}

export const sortShapes = (s: Shape[]): Shape[] => s.map((x, i) => [x, i] as const).sort((a, b) => (a[0].z - b[0].z) || (a[1] - b[1])).map(x => x[0]);
