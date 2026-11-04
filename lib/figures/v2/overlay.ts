/*
 * Figury v2 — nakładka techniki na rysunku (04.11.2026, spec „rysunek pokazuje technikę”): elementy GEOMETRYCZNE liczone z szkieletu klatki, bez liczb na rysunku
 * (liczba kąta tylko w podpisie „Kąt na rysunku”). E1: linia przerywana przez segment proksymalny i poza staw mierzony; E2: łuk kąta w tym stawie w każdej klatce
 * (rozwarcie łuku = zgięcie stawu = wartość measuredAngle); odwiedzenie ramienia: linia w płaszczyźnie strzałkowej i łuk do ramienia (rzut z góry). Dane elementów rodzin:
 * overlay/<rodzina>.ts (id wskazówki `cue` + reguła `rule`). Limit czytelności: OVERLAY_MAX_LINES linii i OVERLAY_MAX_ARCS łuk na rzut (jedno miejsce).
 * Punkt rozszerzenia: kind 'zone' (E5, strefy liczbowe) — dopiero po decyzji badacza i właściciela; dziś nieobsługiwany.
 */
import type { V2, V3 } from './math';
import { add, dot, mul, norm, sub } from './math';
import { proj } from './draw';
import type { Shape, View } from './scene';
import type { Skeleton, Side } from './skeleton';
import type { MeasuredJoint } from './poseData';
import { BENCH_TECHNIQUE } from './overlay/bench_press';
import { dash } from './overlay/common';

export const OVERLAY_MAX_LINES = 3, OVERLAY_MAX_ARCS = 1;
/** Długość przedłużenia linii za staw i promienie łuków (cm rysunku). */
export const OVERLAY_EXTEND = 14, OVERLAY_ARC_R = 9, OVERLAY_REF_LEN = 22, OVERLAY_ARC_MIN_DEG = 3;
export type TechniqueKind = 'limb' | 'abduction';
export type TechniqueDef = { id: string; kind: TechniqueKind; cue: string[]; rule: string; views: View[]; /** staw, który musi być mierzony na rysunku (kind „limb”) */ joint?: MeasuredJoint };

/** Elementy nakładki wg rodziny (dane: overlay/<rodzina>.ts). */
export const TECHNIQUE: Record<string, TechniqueDef[]> = { bench_press: BENCH_TECHNIQUE };
export const techniqueDef = (id: string): TechniqueDef | undefined => Object.values(TECHNIQUE).flat().find(d => d.id === id);
/** Elementy rodziny, które wolno pokazać przy zestawie wskazówek ćwiczenia (id wskazówek karty). */
export function techniquesFor(family: string, cueIds: Iterable<string>): TechniqueDef[] {
  const have = new Set(cueIds); return (Object.prototype.hasOwnProperty.call(TECHNIQUE, family) ? TECHNIQUE[family] : []).filter(d => d.cue.some(c => have.has(c)));
}

const angleDeg = (a: V3, b: V3): number => Math.acos(Math.max(-1, Math.min(1, dot(a, b)))) * 180 / Math.PI;
/** Trójka punktów mierzonego stawu: bliższy koniec, staw, dalszy koniec (null — staw bez nakładki w tym etapie). */
export function limbTriple(sk: Skeleton, side: Side, joint: MeasuredJoint): [V3, V3, V3] | null {
  const A = sk.arms[side], L = sk.legs[side];
  switch (joint) {
    case 'elbow': return [A.shoulder, A.elbow, A.bent ? A.wrist : A.grip];
    case 'knee': return [L.hip, L.knee, L.ankle];
    case 'hip': return [sk.shoulderC, L.hip, L.knee];
    default: return null;
  }
}
/** Łuk między dwoma wersorami (interpolacja sferyczna) o środku `c` i promieniu `r`, n+1 punktów w 3D. */
export function arcPoints3(c: V3, u: V3, v: V3, r: number, n = 12): V3[] {
  const th = Math.acos(Math.max(-1, Math.min(1, dot(u, v)))); const s = Math.sin(th) || 1; const out: V3[] = [];
  for (let i = 0; i <= n; i++) { const t = i / n; out.push(add(c, mul(add(mul(u, Math.sin((1 - t) * th) / s), mul(v, Math.sin(t * th) / s)), r))); }
  return out;
}
const arcShape = (pts: V3[], view: View, role: 'guide' | 'error', id: string): Shape => ({ k: 'poly', pts: pts.map(p => proj(p, view)), stroke: role, w: 1.1, close: false, z: 4001, id });

/** Geometria elementu (bez rzutu): linia 3D, łuk 3D i rozwarcie w stopniach; null, gdy element jest zdegenerowany w tej klatce. */
export type TechniqueGeom = { line: [V3, V3]; arc: V3[] | null; sweepDeg: number };
export function techniqueGeom(kind: TechniqueKind, sk: Skeleton, side: Side, joint: MeasuredJoint): TechniqueGeom | null {
  if (kind === 'limb') {
    const t = limbTriple(sk, side, joint); if (!t) return null; const [A, B, C] = t;
    const ext = norm(sub(B, A)), fore = norm(sub(C, B)); const sweep = angleDeg(ext, fore);
    return { line: [A, add(B, mul(ext, OVERLAY_EXTEND))], arc: sweep >= OVERLAY_ARC_MIN_DEG ? arcPoints3(B, ext, fore, OVERLAY_ARC_R) : null, sweepDeg: sweep };
  }
  /* odwiedzenie ramienia: kąt między ramieniem a jego rzutem na płaszczyznę strzałkową (z = 0) — jak jointAngles.shAbd */
  const S = sk.arms[side].shoulder, ua = norm(sub(sk.arms[side].elbow, S)); const flat: V3 = [ua[0], ua[1], 0]; const len = Math.hypot(flat[0], flat[1]); if (len < 1e-6) return null;
  const ref = norm(flat); const sweep = angleDeg(ref, ua);
  return { line: [S, add(S, mul(ref, OVERLAY_REF_LEN))], arc: sweep >= OVERLAY_ARC_MIN_DEG ? arcPoints3(S, ref, ua, OVERLAY_ARC_R) : null, sweepDeg: sweep };
}

export type OverlayCtx = { joint: MeasuredJoint; side: Side; limbShown: boolean; /** czy reguła elementu jest złamana przez pokazany błąd (kolor danger) */ danger: (rule: string) => boolean };
/** Kształty elementów nakładki w widoku; z limitem OVERLAY_MAX_LINES linii i OVERLAY_MAX_ARCS łuku na rzut (kolejność = kolejność danych). */
export function techniqueShapes(sk: Skeleton, view: View, defs: TechniqueDef[], ctx: OverlayCtx): Shape[] {
  const out: Shape[] = []; let lines = 0, arcs = 0;
  for (const d of defs) {
    if (!d.views.includes(view) || (d.kind === 'limb' && (!ctx.limbShown || (d.joint && d.joint !== ctx.joint)))) continue;
    const g = techniqueGeom(d.kind, sk, ctx.side, ctx.joint); if (!g) continue;
    const role = ctx.danger(d.rule) ? 'error' : 'guide';
    if (lines < OVERLAY_MAX_LINES) { const a: V2 = proj(g.line[0], view), b: V2 = proj(g.line[1], view); out.push(dash(a, b, d.id + 'Line', role)); lines++; }
    if (g.arc && arcs < OVERLAY_MAX_ARCS) { out.push(arcShape(g.arc, view, role, d.id + 'Arc')); arcs++; }
  }
  return out;
}
