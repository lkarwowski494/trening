/*
 * Figury v2 — nakładka techniki na rysunku (04.11.2026, spec „rysunek pokazuje technikę”): elementy GEOMETRYCZNE liczone z szkieletu klatki, bez liczb na rysunku
 * (liczba kąta tylko w podpisie „Kąt na rysunku”). E1: linia przerywana przez segment proksymalny i poza staw mierzony; E2: łuk kąta w tym stawie w każdej klatce
 * (rozwarcie łuku = zgięcie stawu = wartość measuredAngle); odwiedzenie ramienia: liczone w 2D na płaszczyźnie rzutu z góry — linia = rzut osi tułowia, łuk do rzutu ramienia (W2). Dane elementów rodzin:
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
import { SQUAT_TECHNIQUE } from './overlay/squat';
import { HINGE_TECHNIQUE } from './overlay/hinge';
import { CURL_TECHNIQUE } from './overlay/curl';
import { PULL_UP_TECHNIQUE } from './overlay/pull_up';
import { OLYMPIC_TECHNIQUE } from './overlay/olympic';
import { TRICEPS_TECHNIQUE } from './overlay/triceps';
import { CHEST_FLY_TECHNIQUE } from './overlay/chest_fly';
import { solid, OVERLAY_LINE_W } from './overlay/common';
import REGULY from './reguly-cwiczen.json';

export const OVERLAY_MAX_LINES = 3, OVERLAY_MAX_ARCS = 1;
/** Długość przedłużenia linii za staw i promienie łuków (cm rysunku). */
export const OVERLAY_EXTEND = 14, OVERLAY_ARC_R = 9, OVERLAY_REF_LEN = 22, OVERLAY_ARC_MIN_DEG = 3;
/** Najmniejsza długość ramienia w rzucie (cm rysunku), od której pokazujemy odwiedzenie; łuk w rzucie ma co najmniej OVERLAY_ARC_R (jedno miejsce progu rozmiaru, W2). */
export const OVERLAY_ARM_MIN_PROJ = 2, OVERLAY_ARC_MIN_CHORD = 4;
export type TechniqueKind = 'limb' | 'abduction' | 'ref';
/**
 * Prowadnica prostej ręki (09.11.2026, decyzja właściciela, wariant B studia): odcinek bark → chwyt przesunięty NA ZEWNĄTRZ ciała o `offset` cm, z kreskami na końcach (rzut z przodu).
 * Widoczność wg zgięcia łokcia: pełna do `fullDeg` (= max_lokiec_deg reguły dol_rece_proste, data/zrodla/figury-sens.json), liniowo do zera przy `zeroDeg`; w widoku błędu łamiącego regułę
 * — pełna w dolnej części ruchu (u < `errorUBelow`), żeby było widać, jak zgięta ręka odstaje od prostej; w widoku błędu to cięciwa bark–chwyt (`errorOffset` 0 — tam leżałaby prosta ręka),
 * bo odcinek przesunięty o `offset` przecinał zgiętą rękę (recenzja niezależna 09.11.2026, ŚREDNIE; decyzja właściciela 09.11.2026 A). Kolor i grubość jak inne elementy nakładki (guide/error, OVERLAY_LINE_W), bez liczb na rysunku.
 */
export const OVERLAY_ARM_REF = { offset: 8, errorOffset: 0, fullDeg: 8, zeroDeg: 20, errorUBelow: 0.5, tick: 1.8 } as const;
/** Punkt szkieletu, przez który prowadzi linia odniesienia E3 (ręka/noga: strona pracująca rysunku, w rzucie z góry R). */
export type RefPoint = 'grip' | 'wrist' | 'elbow' | 'shoulder' | 'hip' | 'knee' | 'ankle' | 'toe' | 'pelvis' | 'shoulderC' | 'head';
/**
 * E3 — linia odniesienia z regułą (kind „ref”), jedna linia ciągła w rzucie (rzut z góry: tylko „segment”; pion i poziom to pojęcia rzutu bocznego i z przodu):
 * - vertical: pion przez punkt `through` (w górę `up`, w dół `down` albo w obie strony `both`) — dłonie/kostka/bark nad sobą;
 * - horizontal: poziom przez punkt `through` (np. przedłużony poziom drążka);
 * - segment: linia segmentu `from` → `to` przedłużona za `to` o OVERLAY_EXTEND (nieruchomy odcinek: ramię przy tułowiu, linia tułowia);
 * - parallel: odcinek `from` → `to` przesunięty na zewnątrz ciała o OVERLAY_ARM_REF.offset (prowadnica prostej ręki, tylko rzut z przodu; kreski końców i widoczność: parallelGuide).
 */
export type RefSpec = { shape: 'vertical'; through: RefPoint; dir: 'up' | 'down' | 'both'; /** pion kończy się na wysokości tego punktu (zamiast OVERLAY_PLUMB_LEN) — tylko dla dir „down”/„up” */ until?: RefPoint } | { shape: 'horizontal'; through: RefPoint } | { shape: 'segment'; from: RefPoint; to: RefPoint } | { shape: 'parallel'; from: RefPoint; to: RefPoint };
export type TechniqueDef = { id: string; kind: TechniqueKind; cue: string[]; rule: string; views: View[]; /** staw, który musi być mierzony na rysunku (kind „limb”) */ joint?: MeasuredJoint; /** linia odniesienia (kind „ref”, E3) */ ref?: RefSpec; /** element tylko dla tych ćwiczeń (klucz katalogu), gdy reguła ma pewność „ustalone” tylko dla części odmian rodziny */ exercises?: string[] };

/** Elementy nakładki wg rodziny (dane: overlay/<rodzina>.ts). */
export const TECHNIQUE: Record<string, TechniqueDef[]> = { bench_press: BENCH_TECHNIQUE, squat: SQUAT_TECHNIQUE, hinge: HINGE_TECHNIQUE, curl: CURL_TECHNIQUE, pull_up: PULL_UP_TECHNIQUE, olympic: OLYMPIC_TECHNIQUE, triceps: TRICEPS_TECHNIQUE, chest_fly: CHEST_FLY_TECHNIQUE };
export const techniqueDef = (id: string): TechniqueDef | undefined => Object.values(TECHNIQUE).flat().find(d => d.id === id);
/** Elementy rodziny, które wolno pokazać przy zestawie wskazówek ćwiczenia (id wskazówek karty). */
/**
 * Reguły „ustalone” wariantu ćwiczenia (generowane z data/zrodla/figury-sens.json przez scripts/zrodla-runtime.mjs: regulyDla ∩ pewność „ustalone”, bez źródeł) — fix4 R1, 04.11.2026:
 * element nakładki jest rysowany tylko wtedy, gdy jego reguła należy do tej listy (np. Single Leg RDL ma wyprost na górze tylko jako „analogia” → bez pionu).
 */
const REGULY_CWICZEN = REGULY as Record<string, Record<string, string[]>>;
const has = (o: object, k: string): boolean => Object.prototype.hasOwnProperty.call(o, k);
export function techniquesFor(family: string, cueIds: Iterable<string>, exercise?: string): TechniqueDef[] {
  const have = new Set(cueIds); const rules = exercise !== undefined && has(REGULY_CWICZEN, family) && has(REGULY_CWICZEN[family], exercise) ? REGULY_CWICZEN[family][exercise] : [];
  /* bez ćwiczenia (wywołanie na poziomie rodziny) reguły wariantu nie są znane — filtr tylko po wskazówkach; z ćwiczeniem bez wpisu reguł → brak elementu */
  return (has(TECHNIQUE, family) ? TECHNIQUE[family] : []).filter(d => d.cue.some(c => have.has(c)) && (!d.exercises || (exercise !== undefined && d.exercises.includes(exercise))) && (exercise === undefined || rules.includes(d.rule)));
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
const arcShape = (pts: V2[], view: View, role: 'guide' | 'error', id: string): Shape => ({ k: 'poly', pts, stroke: role, w: 1.1, close: false, z: 4001, id });

/** Geometria elementu kończyny (bez rzutu): linia 3D, łuk 3D i rozwarcie w stopniach; null, gdy element jest zdegenerowany w tej klatce. */
export type TechniqueGeom = { line: [V3, V3]; arc: V3[] | null; sweepDeg: number };
export function techniqueGeom(kind: TechniqueKind, sk: Skeleton, side: Side, joint: MeasuredJoint): TechniqueGeom | null {
  if (kind !== 'limb') return null; /* odwiedzenie ramienia liczy abductionGeom2D w płaszczyźnie rzutu (W2, recenzja 1R) */
  const t = limbTriple(sk, side, joint); if (!t) return null; const [A, B, C] = t;
  const ext = norm(sub(B, A)), fore = norm(sub(C, B)); const sweep = angleDeg(ext, fore);
  return { line: [A, add(B, mul(ext, OVERLAY_EXTEND))], arc: sweep >= OVERLAY_ARC_MIN_DEG ? arcPoints3(B, ext, fore, OVERLAY_ARC_R) : null, sweepDeg: sweep };
}
/** Geometria 2D elementu w płaszczyźnie rzutu: linia, łuk i rozwarcie w stopniach (kąt NA RYSUNKU). */
export type Geom2D = { line: [V2, V2]; arc: V2[] | null; sweepDeg: number };
const ang2 = (v: V2): number => Math.atan2(v[1], v[0]);
/**
 * Odwiedzenie ramienia w rzucie (W2, recenzja 1R 04.11.2026): odniesienie = rzut osi tułowia (bark → miednica) poprowadzony od barku, ramię = rzut łokcia względem barku;
 * linia ma stałą długość OVERLAY_REF_LEN, łuk stały promień OVERLAY_ARC_R (rysunek czytelny także wtedy, gdy ramię jest prawie prostopadłe do płaszczyzny rzutu).
 * Zwraca null, gdy oś tułowia albo ramię są w rzucie punktem (ramię < OVERLAY_ARM_MIN_PROJ cm — brak kierunku do pokazania).
 */
export function abductionGeom2D(sk: Skeleton, side: Side, view: View): Geom2D | null {
  const S = proj(sk.arms[side].shoulder, view), P = proj(sk.pelvis, view), E = proj(sk.arms[side].elbow, view);
  const t: V2 = [P[0] - proj(sk.shoulderC, view)[0], P[1] - proj(sk.shoulderC, view)[1]], e: V2 = [E[0] - S[0], E[1] - S[1]];
  const lt = Math.hypot(t[0], t[1]), le = Math.hypot(e[0], e[1]); if (lt < 1e-6 || le < OVERLAY_ARM_MIN_PROJ) return null;
  const a0 = ang2(t); let d = ang2(e) - a0; while (d > Math.PI) d -= 2 * Math.PI; while (d < -Math.PI) d += 2 * Math.PI;
  const sweep = Math.abs(d) * 180 / Math.PI; const n = 12;
  const chord = 2 * OVERLAY_ARC_R * Math.sin(Math.abs(d) / 2);
  const arc: V2[] | null = chord >= OVERLAY_ARC_MIN_CHORD ? Array.from({ length: n + 1 }, (_, i) => { const a = a0 + d * i / n; return [S[0] + OVERLAY_ARC_R * Math.cos(a), S[1] + OVERLAY_ARC_R * Math.sin(a)] as V2; }) : null;
  return { line: [S, [S[0] + t[0] / lt * OVERLAY_REF_LEN, S[1] + t[1] / lt * OVERLAY_REF_LEN]], arc, sweepDeg: sweep };
}

/** Długość pionu (cm rysunku) w górę/w dół od punktu i połowa długości poziomu (jedno miejsce). */
export const OVERLAY_PLUMB_LEN = 150, OVERLAY_LEVEL_HALF = 30;
/** Punkt szkieletu wskazany przez RefPoint. */
export function refPoint(sk: Skeleton, side: Side, p: RefPoint): V3 {
  const A = sk.arms[side], L = sk.legs[side];
  switch (p) {
    case 'grip': return A.grip; case 'wrist': return A.wrist; case 'elbow': return A.elbow; case 'shoulder': return A.shoulder;
    case 'hip': return L.hip; case 'knee': return L.knee; case 'ankle': return L.ankle; case 'toe': return L.toe;
    case 'pelvis': return sk.pelvis; case 'shoulderC': return sk.shoulderC; default: return sk.head;
  }
}
/** Linia odniesienia E3 w rzucie (cm rysunku); null, gdy rzut nie ma sensu (pion/poziom w rzucie z góry) albo segment jest w rzucie punktem (< OVERLAY_ARM_MIN_PROJ cm). */
export function refGeom2D(sk: Skeleton, side: Side, view: View, ref: RefSpec, offset: number = OVERLAY_ARM_REF.offset): [V2, V2] | null {
  if (ref.shape === 'segment') {
    const a = proj(refPoint(sk, side, ref.from), view), b = proj(refPoint(sk, side, ref.to), view); const d: V2 = [b[0] - a[0], b[1] - a[1]]; const l = Math.hypot(d[0], d[1]);
    if (l < OVERLAY_ARM_MIN_PROJ) return null; return [a, [b[0] + d[0] / l * OVERLAY_EXTEND, b[1] + d[1] / l * OVERLAY_EXTEND]];
  }
  if (ref.shape === 'parallel') {
    if (view !== 'front') return null;
    const a = proj(refPoint(sk, side, ref.from), view), b = proj(refPoint(sk, side, ref.to), view), d: V2 = [b[0] - a[0], b[1] - a[1]], l = Math.hypot(d[0], d[1]); if (l < OVERLAY_ARM_MIN_PROJ) return null;
    const n: V2 = [-d[1] / l, d[0] / l], c = proj(sk.pelvis, view), out = n[0] * ((a[0] + b[0]) / 2 - c[0]) >= 0 ? 1 : -1, o: V2 = [n[0] * out * offset, n[1] * out * offset];
    return [[a[0] + o[0], a[1] + o[1]], [b[0] + o[0], b[1] + o[1]]];
  }
  if (view === 'top') return null; const p = proj(refPoint(sk, side, ref.through), view);
  if (ref.shape === 'horizontal') return [[p[0] - OVERLAY_LEVEL_HALF, p[1]], [p[0] + OVERLAY_LEVEL_HALF, p[1]]];
  const end = ref.until ? proj(refPoint(sk, side, ref.until), view)[1] : undefined;
  return [[p[0], ref.dir === 'up' ? p[1] : end ?? p[1] - OVERLAY_PLUMB_LEN], [p[0], ref.dir === 'down' ? p[1] : end ?? p[1] + OVERLAY_PLUMB_LEN]];
}

export type OverlayCtx = { joint: MeasuredJoint; side: Side; limbShown: boolean; /** czy reguła elementu jest złamana przez pokazany błąd (kolor danger) */ danger: (rule: string) => boolean; /** linie odniesienia (GUIDES) już narysowane w tym rzucie — wchodzą do limitu OVERLAY_MAX_LINES (W3) */ guideLines?: number; /** pozycja ruchu 0..1 (0 = start); tylko dla widoczności prowadnicy prostej ręki w widoku błędu */ u?: number };
/** Przezroczystość prowadnicy prostej ręki (0 = niewidoczna): pełna przy zgięciu łokcia ≤ fullDeg, liniowo do zera przy zeroDeg; w widoku błędu łamiącego regułę pełna w dolnej części ruchu. */
export function armGuideAlpha(elbowDeg: number, danger: boolean, u: number | undefined): number {
  if (danger && (u ?? 0) < OVERLAY_ARM_REF.errorUBelow) return 1;
  const { fullDeg, zeroDeg } = OVERLAY_ARM_REF; return Math.max(0, Math.min(1, (zeroDeg - elbowDeg) / (zeroDeg - fullDeg)));
}
/** Jeden kształt prowadnicy: odcinek z kreskami na końcach (jedna łamana — liczy się jako jedna linia nakładki); null, gdy niewidoczna w tej klatce. */
function parallelGuide(sk: Skeleton, view: View, d: TechniqueDef, ctx: OverlayCtx): Shape | null {
  if (!d.ref) return null; const danger = ctx.danger(d.rule); const g = refGeom2D(sk, ctx.side, view, d.ref, danger ? OVERLAY_ARM_REF.errorOffset : OVERLAY_ARM_REF.offset); const e = techniqueGeom('limb', sk, ctx.side, 'elbow'); if (!g || !e) return null;
  const alpha = armGuideAlpha(e.sweepDeg, danger, ctx.u); if (alpha <= 0.02) return null;
  const [s, t] = g, dx = t[0] - s[0], dy = t[1] - s[1], l = Math.hypot(dx, dy), k = OVERLAY_ARM_REF.tick / l, n: V2 = [-dy * k, dx * k];
  return { k: 'poly', pts: [[s[0] - n[0], s[1] - n[1]], [s[0] + n[0], s[1] + n[1]], s, t, [t[0] - n[0], t[1] - n[1]], [t[0] + n[0], t[1] + n[1]]], stroke: danger ? 'error' : 'guide', w: OVERLAY_LINE_W, a: alpha / 2.2, close: false, z: 4000, id: d.id + 'Bracket' };
}
/** Kształty elementów nakładki w widoku; z limitem OVERLAY_MAX_LINES linii (łącznie ze starymi liniami odniesienia `ctx.guideLines`) i OVERLAY_MAX_ARCS łuku na rzut (kolejność = kolejność danych). */
export function techniqueShapes(sk: Skeleton, view: View, defs: TechniqueDef[], ctx: OverlayCtx): Shape[] {
  const out: Shape[] = []; let lines = ctx.guideLines ?? 0, arcs = 0;
  for (const d of defs) {
    if (!d.views.includes(view) || (d.kind === 'limb' && (!ctx.limbShown || (d.joint && d.joint !== ctx.joint)))) continue;
    let line: [V2, V2], arc: V2[] | null;
    if (d.kind === 'ref' && d.ref?.shape === 'parallel') { const p = lines < OVERLAY_MAX_LINES ? parallelGuide(sk, view, d, ctx) : null; if (p) { out.push(p); lines++; } continue; }
    if (d.kind === 'ref') { const g = d.ref ? refGeom2D(sk, view === 'top' ? 'R' : ctx.side, view, d.ref) : null; if (!g) continue; line = g; arc = null; }
    else if (d.kind === 'limb') { const g = techniqueGeom('limb', sk, ctx.side, ctx.joint); if (!g) continue; line = [proj(g.line[0], view), proj(g.line[1], view)]; arc = g.arc ? g.arc.map(p => proj(p, view)) : null; }
    else { const g = abductionGeom2D(sk, ctx.side, view); if (!g) continue; line = g.line; arc = g.arc; }
    const role = ctx.danger(d.rule) ? 'error' : 'guide';
    if (lines < OVERLAY_MAX_LINES) { out.push(solid(line[0], line[1], d.id + 'Line', role)); lines++; }
    if (arc && arcs < OVERLAY_MAX_ARCS) { out.push(arcShape(arc, view, role, d.id + 'Arc')); arcs++; }
  }
  return out;
}
