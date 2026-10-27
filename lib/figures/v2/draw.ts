/*
 * Figury v2 — rysunek: szkielet 3D + rekwizyty → kształty 2D (widok z boku albo z przodu). Kapsuły kończyn, kontur tułowia, głowa, stopy w butach,
 * sprzęt. Brak kolorów — tylko role (palette.ts). Liczby wymiarów sprzętu w EQUIP (jedno miejsce).
 */
import { add, mul, norm, sub, rad, type V2, type V3 } from './math';
import { BODY, GIRTH, SIDES, type Skeleton } from './skeleton';
import { LAYER, type Prop, type Role, type Shape, type View } from './scene';

/** Wymiary sprzętu (cm). Jedno źródło wartości: ta stała; opis, status i źródło każdego wymiaru — data/zrodla/figury-sprzet.json (test tests/zrodla-pelne-sprzet.test.ts).
 * Gryf, tuleje, talerze i ławka zgodne z normą sprzętu startowego; barR 1,6 to jawna konwencja „pogrubienie dla czytelności”; reszta — uproszczenie ilustracyjne.
 * plateZ = środki dwóch talerzy na tulei (od osi gryfu; pierwszy tuż za wewnętrznym kołnierzem), chainZ = łańcuchy sztangi tuż za zewnętrznym talerzem. */
export const EQUIP = {
  barR: 1.6, barLen: 220, sleeveR: 2.6, plateR: 22.5, plateZ: [66, 71] as [number, number], plateW: 2.8, chainZ: 73,
  dbHeadR: 6.0, dbHandle: 13, kbBallR: 9.5, kbHandleR: 6,
  benchW: 30, benchPad: 8, benchLegW: 3.2, floorLine: 1.2,
  trapW: 29, boxW: 45, postW: 3.5, railW: 1.2, wallW: 3,
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

function torsoPoly(sk: Skeleton, view: View): V2[] {
  const out: V2[] = [];
  if (view === 'side') {
    const back: V2[] = [], front: V2[] = [];
    for (const [a, bk, fr] of TORSO_SIDE) { const { p, up } = spineAt(sk, a); const n: V3 = [up[1], -up[0], 0]; back.push(proj(add(p, mul(n, bk)), view)); front.push(proj(add(p, mul(n, fr)), view)); }
    return [...back, ...front.reverse()];
  }
  const left: V2[] = [], right: V2[] = [];
  for (const [a, w] of TORSO_FRONT) { const { p } = spineAt(sk, a); const c = proj(p, view); left.push([c[0] - w, c[1]]); right.push([c[0] + w, c[1]]); }
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
      const c = proj(add(L.ankle, [0, 0, 0]), view); const w = 5.4;
      push({ k: 'poly', pts: [[c[0] - w, c[1] - BODY.ankleH], [c[0] + w, c[1] - BODY.ankleH], [c[0] + w - 0.5, c[1] - 1], [c[0] + 3, c[1] + 4.5], [c[0] - 3, c[1] + 4.5], [c[0] - w + 0.5, c[1] - 1]], fill: 'shoe', z: zKey(LAYER.body, L.toe[0]), id: 'foot' + sx, close: true, smooth: true });
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
  if (side) push({ k: 'ellipse', c: pc, rx: GIRTH.pelvis + 0.4, ry: 8.6, rot: 0, fill: 'cloth', z: tz + 0.1, id: 'pelvis' });
  else push({ k: 'ellipse', c: pc, rx: 15.5, ry: 8.0, rot: 0, fill: 'cloth', z: tz + 0.1, id: 'pelvis' });
  cap('neck', sk.shoulderC, GIRTH.neck, add(sk.head, mul(sk.headUp, -BODY.headR * 0.5)), GIRTH.neck - 0.3, 'skin', side ? 0.2 : sk.neck[0]);
  const hc = proj(sk.head, view); const ha = Math.atan2(sk.headUp[1], side ? sk.headUp[0] : 0) * 180 / Math.PI;
  const hz = zKey(LAYER.body, side ? 0.3 : sk.head[0] + 0.3);
  if (side) {
    push({ k: 'ellipse', c: hc, rx: 8.6, ry: 10.6, rot: ha - 90, fill: 'skin', z: hz, id: 'head' });
    const hu = proj(sk.headUp, view);
    const norm2 = Math.hypot(hu[0], hu[1]) || 1; const u2: V2 = [hu[0] / norm2, hu[1] / norm2], f2: V2 = [u2[1], -u2[0]];
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

/** Wielokąty ławki w widoku z boku: siedzisko, oparcie (górna krawędź = powierzchnia, na której leży osoba) i x nóg. Wspólne dla rysunku i kolizji. */
export function benchPolys(pr: Extract<Prop, { k: 'bench' }>): { seat: V2[]; back: V2[]; legs: number[] } {
  const T = EQUIP.benchPad; const [sx0, sy] = pr.seatFrom, [hx, hy] = pr.hinge, [bx, by] = pr.backTo;
  const dir: V2 = [bx - hx, by - hy]; const L = Math.hypot(dir[0], dir[1]) || 1; let n: V2 = [-dir[1] / L, dir[0] / L]; if (n[1] < 0) n = [-n[0], -n[1]]; /* normalna w górę */
  return {
    seat: [[sx0, sy - T], [hx, hy - T], [hx, hy], [sx0, sy]],
    back: [[hx, hy - T], [bx - n[0] * T, by - n[1] * T], [bx, by], [hx, hy]],
    legs: [sx0 + Math.sign(hx - sx0) * 8, bx + Math.sign(hx - bx) * 6],
  };
}

/** Kształty rekwizytów. */
export function propShapes(props: Prop[], view: View): Shape[] {
  const S: Shape[] = []; const side = view === 'side';
  const E = EQUIP;
  for (const pr of props) {
    switch (pr.k) {
      case 'floor': if (view === 'top') break; else S.push({ k: 'line', a: [pr.x0, 0], b: [pr.x1, 0], w: E.floorLine, role: 'floor', z: zKey(LAYER.back, -100), id: 'floor' }); break;
      case 'mat': if (view === 'top') break; else S.push({ k: 'poly', pts: side ? rect(pr.x0, 0, pr.x1, pr.h) : rect(-30, 0, 30, pr.h), fill: 'pad', stroke: 'floor', w: 0.6, close: true, z: zKey(LAYER.backEquip, -50), id: 'mat' }); break;
      case 'wall': S.push({ k: 'poly', pts: side ? rect(pr.x - E.wallW, 0, pr.x, pr.h) : rect(-110, 0, 110, pr.h), fill: 'frame', a: side ? 0.35 : 0.12, close: true, z: zKey(LAYER.back, -90), id: 'wall' }); break;
      case 'rail': if (view === 'top') break; else if (side) S.push({ k: 'line', a: [pr.x, 0], b: [pr.x, pr.h], w: E.railW, role: 'frame', z: zKey(LAYER.back, -80), id: 'rail' }); else for (const sg of [-1, 1]) S.push({ k: 'line', a: [sg * 56, 0], b: [sg * 56, pr.h], w: E.railW, role: 'frame', z: zKey(LAYER.back, -80), id: 'rail' }); break;
      case 'post': {
        if (side) S.push({ k: 'line', a: [pr.x, 0], b: [pr.x, pr.h], w: E.postW, role: 'frame', z: zKey(LAYER.back, -70), id: 'post' });
        else for (const sg of [-1, 1]) S.push({ k: 'line', a: [sg * 64, 0], b: [sg * 64, pr.h], w: E.postW, role: 'frame', z: zKey(LAYER.back, -70), id: 'post' });
        if (pr.hook !== undefined && side) S.push({ k: 'line', a: [pr.x, pr.hook], b: [pr.x + 5, pr.hook], w: 2.4, role: 'frame', z: zKey(LAYER.back, -69), id: 'hook' });
        break;
      }
      case 'box': S.push({ k: 'poly', pts: side ? rect(pr.x0, 0, pr.x1, pr.top) : rect(-(pr.w ?? E.boxW) / 2, 0, (pr.w ?? E.boxW) / 2, pr.top), fill: 'pad', stroke: 'frame', w: 1, close: true, z: zKey(LAYER.backEquip, -40), id: 'box' }); break;
      case 'bench': {
        const w = pr.w ?? E.benchW; const bp = benchPolys(pr);
        if (side) {
          S.push({ k: 'poly', pts: bp.seat, fill: 'pad', stroke: 'frame', w: 0.8, close: true, z: zKey(LAYER.backEquip, -30), id: 'benchSeat' });
          S.push({ k: 'poly', pts: bp.back, fill: 'pad', stroke: 'frame', w: 0.8, close: true, z: zKey(LAYER.backEquip, -29), id: 'benchBack' });
          for (const x of bp.legs) S.push({ k: 'line', a: [x, 0], b: [x, Math.max(pr.seatFrom[1] - E.benchPad, 0)], w: E.benchLegW, role: 'frame', z: zKey(LAYER.backEquip, -31), id: 'benchLeg' });
        } else if (view === 'top') S.push({ k: 'poly', pts: rect(-w / 2, pr.seatFrom[0], w / 2, pr.backTo[0]), fill: 'pad', stroke: 'frame', w: 0.8, close: true, z: zKey(LAYER.backEquip, -30), id: 'benchSeat' });
        else S.push({ k: 'poly', pts: rect(-w / 2, pr.seatFrom[1] - E.benchPad, w / 2, pr.seatFrom[1]), fill: 'pad', stroke: 'frame', w: 0.8, close: true, z: zKey(LAYER.backEquip, -30), id: 'benchSeat' });
        break;
      }
      case 'cable': { const a = proj(pr.from, view), b = proj(pr.to, view); S.push({ k: 'line', a, b, w: 0.7, role: 'cable', z: zKey(LAYER.frontEquip, 0), id: 'cable' }); S.push({ k: 'circle', c: a, r: 2.6, fill: 'frame', z: zKey(LAYER.back, -60), id: 'pulley' }); break; }
      case 'band': {
        /* guma sztangi (bar): dwie gumy przy końcach gryfu w widoku z przodu i z góry (jak łańcuchy); z boku jedna linia. Guma chwytana w dłoniach (bez bar) — jedna. */
        const zs = pr.bar && !side ? [-E.chainZ, E.chainZ] : [pr.from[2]];
        for (const zz of zs) { const a = proj([pr.from[0], pr.from[1], zz], view), b = proj([pr.to[0], pr.to[1], pr.bar && !side ? zz : pr.to[2]], view); S.push({ k: 'line', a, b, w: 0.9, role: 'load', dash: [2.5, 2], z: zKey(LAYER.frontEquip, 0), id: 'band' }); }
        break; }
      case 'chain': {
        /* łańcuchy sztangi (bar) wiszą na obu tulejach: w widoku z przodu i z góry dwa, na ±chainZ; z boku jeden. Łańcuch pasa (bez bar) — jeden, jak dotąd. */
        const zs = pr.bar && !side ? [-E.chainZ, E.chainZ] : [pr.from[2]];
        for (const zz of zs) { const a = proj([pr.from[0], pr.from[1], zz], view), b = proj([pr.to[0], pr.to[1], pr.bar && !side ? zz : pr.to[2]], view); S.push({ k: 'line', a, b, w: 1.2, role: 'steel', dash: [0.8, 1.4], z: zKey(LAYER.frontEquip, 0), id: 'chain' }); }
        break; }
      case 'pivot': { const a = proj(pr.from, view), b = proj(pr.to, view); S.push({ k: 'line', a, b, w: 2.8, role: 'steel', z: zKey(LAYER.frontEquip, 1), id: 'landmine' }); S.push({ k: 'circle', c: a, r: 3, fill: 'frame', z: zKey(LAYER.back, -60), id: 'pivot' }); break; }
      case 'barbell': {
        const c = pr.c; const o = proj(c, view);
        if (pr.axis === 'x') {
          /* gryf wzdłuż x (z boku ciała): z boku i z góry — linia z talerzami na końcach; z przodu — widok wzdłuż gryfu (talerz jako koło) */
          if (side || view === 'top') {
            const half = (pr.len ?? E.barLen) / 2; const a = proj([c[0] - half, c[1], c[2]], view), b = proj([c[0] + half, c[1], c[2]], view);
            S.push({ k: 'line', a, b, w: E.barR * 2, role: 'steel', z: zKey(LAYER.frontEquip, 0.3), id: 'bar' });
            if (pr.plates !== false && side) for (const sg of [-1, 1]) for (const zz of E.plateZ) S.push({ k: 'poly', pts: rect(o[0] + sg * zz - E.plateW / 2, o[1] - E.plateR, o[0] + sg * zz + E.plateW / 2, o[1] + E.plateR), fill: 'plate', a: 0.55, stroke: 'plate', w: 0.7, close: true, z: zKey(LAYER.frontEquip, 0.2), id: 'plate' });
          } else {
            if (pr.plates !== false) S.push({ k: 'circle', c: o, r: E.plateR, fill: 'plate', a: 0.42, stroke: 'plate', w: 0.8, z: zKey(LAYER.frontEquip, 0), id: 'plateNear' });
            S.push({ k: 'circle', c: o, r: E.barR, fill: 'steel', z: zKey(LAYER.overlay, 0), id: 'bar' });
          }
          break;
        }
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
        const o = proj(pr.c, view); const r = pr.r ?? E.kbBallR; const zz = zKey(LAYER.frontEquip, side ? pr.c[2] : pr.c[0]);
        S.push({ k: 'circle', c: [o[0], o[1] - r - 2], r, fill: 'load', a: 0.9, z: zz, id: 'kb' });
        S.push({ k: 'circle', c: [o[0], o[1] - 1], r: E.kbHandleR, stroke: 'steel', w: 1.8, z: zz + 0.1, id: 'kbHandle' });
        break;
      }
    }
  }
  return S;
}

export const sortShapes = (s: Shape[]): Shape[] => s.map((x, i) => [x, i] as const).sort((a, b) => (a[0].z - b[0].z) || (a[1] - b[1])).map(x => x[0]);
