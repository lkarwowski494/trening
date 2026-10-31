/*
 * Figury v2 — kolidery i sprawdzenia geometrii klatki (do testów i do skryptów kontrolnych). Ciało = kapsuły na kościach, sprzęt = kapsuły i graniastosłupy.
 * Odstęp (gap) = odległość powierzchni; ujemny = przenikanie. Kontakty dozwolone deklaruje klatka (Frame.contacts); reszta par nie może się przenikać.
 */
import { distSegSeg, dist, sub, type V2, type V3 } from './math';
import { BODY, GIRTH, SIDES, soleY, type Skeleton } from './skeleton';
import { benchPolys, preacherPolys, hyperPolys, rollerAt, EQUIP } from './draw';
import type { Collider, Frame, Prop } from './scene';

export const TOL = {
  /** Dopuszczalne przenikanie (cm) przy zaokrągleniach kształtów — bez kontaktu zadeklarowanego. */
  pen: 0.3,
  /** Podłoga: najniższy punkt ciała nie niżej niż (cm). */
  floor: 0.3,
  /** Długość kości (cm). */
  bone: 1e-6,
  /** Zasięg IK: odległość osiągniętego chwytu od celu (cm). */
  reach: 0.5,
  /** Suwnica Smitha: odchylenie osi sztangi od prowadnicy w x (cm); sztanga porusza się tylko w pionie (uproszczenie: prowadnica bez pochylenia). */
  rail: 1.5,
  /** Landmine: odchylenie długości gryfu (odległość osi obrotu od dłoni) od nominalnej (cm). */
  pivot: 3,
} as const;

/** Kapsuły ciała jednej klatki (id: nazwa części + strona). */
export function bodyColliders(sk: Skeleton): Collider[] {
  const c: Collider[] = [];
  for (const s of SIDES) {
    const L = sk.legs[s], A = sk.arms[s];
    c.push({ k: 'capsule', id: 'thigh' + s, a: L.hip, b: L.knee, r: (GIRTH.thigh[0] + GIRTH.thigh[2]) / 2 });
    c.push({ k: 'capsule', id: 'shank' + s, a: L.knee, b: L.ankle, r: (GIRTH.shank[0] + GIRTH.shank[2]) / 2 });
    c.push({ k: 'capsule', id: 'foot' + s, a: [L.heel[0], L.heel[1] + 3.5, L.heel[2]], b: [L.toe[0], L.toe[1] + 3.5, L.toe[2]], r: 3.4 });
    c.push({ k: 'capsule', id: 'uarm' + s, a: A.shoulder, b: A.elbow, r: (GIRTH.uarm[0] + GIRTH.uarm[1]) / 2 });
    if (A.bent) { c.push({ k: 'capsule', id: 'farm' + s, a: A.elbow, b: A.wrist, r: 3.3 }); c.push({ k: 'capsule', id: 'hand' + s, a: A.wrist, b: A.grip, r: 3.3 }); } /* zgięty nadgarstek: przedramię i dłoń osobno */
    else c.push({ k: 'capsule', id: 'farm' + s, a: A.elbow, b: A.grip, r: 3.3 });
  }
  c.push({ k: 'capsule', id: 'torso', a: sk.pelvis, b: sk.shoulderC, r: GIRTH.trunkCollide });
  c.push({ k: 'capsule', id: 'pelvis', a: sk.pelvis, b: sk.pelvis, r: GIRTH.pelvis });
  c.push({ k: 'capsule', id: 'head', a: sk.head, b: sk.head, r: BODY.headR });
  return c;
}

/** Talerz trzymany jako obręcz i szprychy z kapsuł (tarcza w płaszczyźnie y–z, grubość EQUIP.plateW): 16 odcinków obręczy i 4 średnice. */
export function plateColliders(p: Extract<Prop, { k: 'plate' }>): Collider[] {
  const r = p.r ?? EQUIP.plateR; const rim = 16; const pt = (a: number, k = 1): V3 => [p.c[0], p.c[1] + Math.sin(a) * r * k, p.c[2] + Math.cos(a) * r * k];
  const out: Collider[] = [];
  for (let i = 0; i < rim; i++) out.push({ k: 'capsule', id: 'plate', a: pt(2 * Math.PI * i / rim), b: pt(2 * Math.PI * (i + 1) / rim), r: EQUIP.plateW / 2 });
  for (let i = 0; i < 4; i++) out.push({ k: 'capsule', id: 'plate', a: pt(Math.PI * i / 4), b: pt(Math.PI * i / 4 + Math.PI), r: EQUIP.plateW / 2 });
  return out;
}

const prism = (id: string, poly: V2[], z0: number, z1: number): Collider => ({ k: 'prism', id, poly, z0, z1 });
const rectPoly = (x0: number, y0: number, x1: number, y1: number): V2[] => [[x0, y0], [x1, y0], [x1, y1], [x0, y1]];

/** Kolidery sprzętu (gryf, hantle, ławka, skrzynia, ściana, mata). Talerze „duchy” nie są solidne. */
export function equipColliders(props: Prop[]): Collider[] {
  const c: Collider[] = [];
  for (const p of props) {
    switch (p.k) {
      case 'barbell': { const h = (p.len ?? EQUIP.barLen) / 2; c.push(p.axis === 'x' ? { k: 'capsule', id: 'bar', a: [p.c[0] - h, p.c[1], p.c[2]], b: [p.c[0] + h, p.c[1], p.c[2]], r: EQUIP.barR } : { k: 'capsule', id: 'bar', a: [p.c[0], p.c[1], -h], b: [p.c[0], p.c[1], h], r: EQUIP.barR }); break; }
      case 'trapbar': for (const sg of [-1, 1]) c.push({ k: 'capsule', id: 'bar', a: [p.c[0] - 7, p.c[1], sg * (p.w ?? EQUIP.trapW)], b: [p.c[0] + 7, p.c[1], sg * (p.w ?? EQUIP.trapW)], r: 1.8 }); break;
      case 'dumbbell': c.push({ k: 'capsule', id: 'db' + p.side, a: p.c, b: p.c, r: p.r ?? EQUIP.dbHeadR }); break;
      case 'kettlebell': { const d = p.dir ?? [0, -1, 0]; const o = p.r === undefined ? 12 : p.r + 2.5; const q: V3 = [p.c[0] + d[0] * o, p.c[1] + d[1] * o, p.c[2] + d[2] * o]; c.push({ k: 'capsule', id: 'kb', a: q, b: q, r: p.r ?? EQUIP.kbBallR }); break; }
      case 'pivot': { /* tylko gryf/dźwignia z danych kontraktu (len): rigi gotowych rodzin nie mają tego kolidera; ostatnie EQUIP.landmineHand cm (dłonie na końcu) bez kolidera */
        if (p.len === undefined) break; const d = sub(p.to, p.from); const l = Math.hypot(...d) || 1; const k = Math.max(0, l - (p.cut ?? EQUIP.landmineHand)) / l;
        c.push({ k: 'capsule', id: 'barPivot', a: p.from, b: [p.from[0] + d[0] * k, p.from[1] + d[1] * k, p.from[2] + d[2] * k], r: EQUIP.landmineR }); break; }
      case 'cable': { /* tylko linka z danych kontraktu (solid); ostatnie EQUIP.cableEnd cm przy osprzęcie (dłonie, kostka) bez kolidera */
        if (!p.solid) break; const d = sub(p.to, p.from); const l = Math.hypot(...d) || 1; const k = Math.max(0, l - (p.free ?? EQUIP.cableEnd)) / l;
        c.push({ k: 'capsule', id: 'cable', a: p.from, b: [p.from[0] + d[0] * k, p.from[1] + d[1] * k, p.from[2] + d[2] * k], r: EQUIP.cableR }); break; }
      case 'tower': if (p.solid) c.push(prism('tower', rectPoly(p.x - EQUIP.towerW / 2, 0, p.x + EQUIP.towerW / 2, p.h), p.z - EQUIP.towerW / 2, p.z + EQUIP.towerW / 2)); break;
      case 'ball': c.push({ k: 'capsule', id: p.held === false ? 'gymBall' : 'ball', a: p.c, b: p.c, r: p.r ?? (p.held === false ? EQUIP.gymBallR : EQUIP.medBallR) }); break;
      case 'dome': c.push({ k: 'capsule', id: 'gymBall', a: p.c, b: p.c, r: p.r }); break;
      case 'hyper': { const hp = hyperPolys(p); c.push(prism('hyperPad', hp.pad, -EQUIP.hyperW / 2, EQUIP.hyperW / 2)); if (p.roller) c.push({ k: 'capsule', id: 'hyperRoller', a: [p.roller[0], p.roller[1], -EQUIP.rollerHalf], b: [p.roller[0], p.roller[1], EQUIP.rollerHalf], r: EQUIP.rollerR }); break; }
      case 'hammer': c.push({ k: 'capsule', id: 'barHammer', a: p.a, b: p.b, r: 2 }); break;
      case 'roll': c.push({ k: 'capsule', id: p.held ? 'barLog' : 'roll', a: [p.c[0], p.c[1], -p.len / 2], b: [p.c[0], p.c[1], p.len / 2], r: p.r }); break;
      case 'plate': c.push(...plateColliders(p)); break;
      case 'bench': { const bp = benchPolys(p); const w = (p.w ?? EQUIP.benchW) / 2; c.push(prism('benchSeat', bp.seat, -w, w), prism('benchBack', bp.back, -w, w)); if (p.rollers) { const r = rollerAt(p); c.push({ k: 'capsule', id: 'benchRoller', a: [r[0], r[1], -EQUIP.rollerHalf], b: [r[0], r[1], EQUIP.rollerHalf], r: EQUIP.rollerR }); } break; }
      case 'sled': { c.push(prism('sled', rectPoly(p.x, 0, p.x + p.len, EQUIP.sledBase), -EQUIP.sledHalf - 5, EQUIP.sledHalf + 5)); for (const sg of [-1, 1]) c.push({ k: 'capsule', id: 'barSled', a: [p.x, EQUIP.sledBase, sg * EQUIP.sledHalf], b: [p.x, p.h, sg * EQUIP.sledHalf], r: 1.8 }); break; }
      case 'wheel': c.push({ k: 'capsule', id: 'wheel', a: p.c, b: p.c, r: p.r }); break;
      case 'rope': c.push({ k: 'capsule', id: 'rope', a: [p.x, p.bottom, p.z], b: [p.x, p.top, p.z], r: EQUIP.ropeR }); break;
      case 'dipbars': for (const sg of [-1, 1]) c.push({ k: 'capsule', id: 'barDip', a: [p.x0, p.h, sg * p.z], b: [p.x1, p.h, sg * p.z], r: EQUIP.dipR }); break;
      case 'preacher': { const pp = preacherPolys(p); c.push(prism('preacherPad', pp.pad, -EQUIP.preacherW / 2, EQUIP.preacherW / 2), prism('preacherSeat', pp.seat, -EQUIP.preacherSeatW / 2, EQUIP.preacherSeatW / 2)); break; }
      case 'box': { const w = (p.w ?? EQUIP.boxW) / 2; const cz = p.z ?? 0; c.push(prism('box', rectPoly(p.x0, 0, p.x1, p.top), cz - w, cz + w)); break; }
      case 'wall': c.push(prism('wall', p.front ? rectPoly(p.x, 0, p.x + EQUIP.wallW, p.h) : rectPoly(p.x - EQUIP.wallW, 0, p.x, p.h), -100, 100)); break;
      case 'mat': c.push(prism('mat', rectPoly(p.x0, 0, p.x1, p.h), -60, 60)); break;
      case 'post': for (const sg of [-1, 1]) c.push(prism('post', rectPoly(p.x - EQUIP.postW / 2, 0, p.x + EQUIP.postW / 2, p.h), sg * EQUIP.postSpan - 2, sg * EQUIP.postSpan + 2)); break;
      case 'rail': for (const sg of [-1, 1]) c.push(prism('rail', rectPoly(p.x - EQUIP.railW / 2, 0, p.x + EQUIP.railW / 2, p.h), sg * EQUIP.railSpan - 1, sg * EQUIP.railSpan + 1)); break;
      default: break;
    }
  }
  return c;
}

/** Odległość punktu od wielokąta 2D ze znakiem (ujemna wewnątrz). */
export function sdPoly(p: V2, poly: V2[]): number {
  let d = Infinity, inside = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const a = poly[j], b = poly[i]; const ab: V2 = [b[0] - a[0], b[1] - a[1]]; const l2 = ab[0] * ab[0] + ab[1] * ab[1] || 1e-12;
    const t = Math.max(0, Math.min(1, ((p[0] - a[0]) * ab[0] + (p[1] - a[1]) * ab[1]) / l2));
    d = Math.min(d, Math.hypot(p[0] - a[0] - ab[0] * t, p[1] - a[1] - ab[1] * t));
    if ((a[1] > p[1]) !== (b[1] > p[1]) && p[0] < (b[0] - a[0]) * (p[1] - a[1]) / (b[1] - a[1]) + a[0]) inside = !inside;
  }
  return inside ? -d : d;
}

/** Odstęp powierzchni dwóch koliderów (cm); ujemny = przenikanie. */
export function gap(a: Collider, b: Collider): number {
  if (a.k === 'capsule' && b.k === 'capsule') return distSegSeg(a.a, a.b, b.a, b.b) - a.r - b.r;
  const [cap, pr] = a.k === 'capsule' ? [a, b] : [b, a];
  if (cap.k !== 'capsule' || pr.k !== 'prism') return Infinity;
  let m = Infinity; const N = 18;
  for (let i = 0; i <= N; i++) {
    const t = i / N; const P: V3 = [cap.a[0] + (cap.b[0] - cap.a[0]) * t, cap.a[1] + (cap.b[1] - cap.a[1]) * t, cap.a[2] + (cap.b[2] - cap.a[2]) * t];
    const sd = sdPoly([P[0], P[1]], pr.poly); const dz = Math.max(pr.z0 - P[2], P[2] - pr.z1, 0);
    m = Math.min(m, (dz > 0 ? Math.hypot(Math.max(sd, 0), dz) : sd) - cap.r);
  }
  return m;
}

const matches = (id: string, prefix: string): boolean => id === prefix || id.startsWith(prefix);

export type Issue = { code: string; detail: string; /** Wskazówka naprawy (chwyt: gdzie ma leżeć dłoń). */ hint?: string };

/**
 * Sprawdzenia klatki: skończone współrzędne, stałe długości kości, zasięg IK, podłoga, przenikanie ciało–sprzęt (poza zadeklarowanymi kontaktami),
 * dłonie na sprzęcie trzymanym (chwyt), głowa nie przenika rąk ani sprzętu.
 */
export function checkFrame(f: Frame): Issue[] {
  const out: Issue[] = []; const sk = f.sk;
  const allPts: V3[] = [sk.pelvis, sk.spineMid, sk.shoulderC, sk.neck, sk.head, ...SIDES.flatMap(s => [sk.legs[s].knee, sk.legs[s].ankle, sk.legs[s].heel, sk.legs[s].toe, sk.arms[s].elbow, sk.arms[s].wrist, sk.arms[s].grip])];
  if (allPts.some(p => p.some(v => !Number.isFinite(v)))) { out.push({ code: 'finite', detail: 'niefinitywne współrzędne' }); return out; }
  for (const s of SIDES) {
    const L = sk.legs[s], A = sk.arms[s];
    const bones: [string, number, number][] = [['thigh', dist(L.hip, L.knee), BODY.thigh], ['shank', dist(L.knee, L.ankle), BODY.shank], ['uarm', dist(A.shoulder, A.elbow), A.uarm], A.bent ? ['farm', dist(A.elbow, A.wrist), A.forearm] : ['farm', dist(A.elbow, A.grip), A.lower]];
    for (const [n, got, want] of bones) if (Math.abs(got - want) > 1e-4) out.push({ code: 'bone', detail: `${n}${s}: ${got.toFixed(4)} ≠ ${want}` });
    if (L.err > TOL.reach) out.push({ code: 'reach', detail: `noga ${s}: cel poza zasięgiem o ${L.err.toFixed(2)} cm` });
    if (A.err > TOL.reach) out.push({ code: 'reach', detail: `ręka ${s}: cel poza zasięgiem o ${A.err.toFixed(2)} cm` });
  }
  const body = bodyColliders(sk), eq = equipColliders(f.props);
  for (const b of body) if (b.k === 'capsule') { const low = Math.min(b.a[1], b.b[1]) - b.r; if (low < -TOL.floor && !/^(torso|pelvis|head|uarm|farm|hand)/.test(b.id)) out.push({ code: 'floor', detail: `${b.id} poniżej podłogi o ${(-low).toFixed(2)} cm` }); }
  for (const s of SIDES) if (soleY(sk.legs[s]) < -TOL.floor) out.push({ code: 'floor', detail: `stopa ${s} poniżej podłogi` });
  const lowest = new Map<string, number>(); /* sprzęt trzymany (talerz = wiele kapsuł): jeden komunikat na rekwizyt, z najniższym punktem */
  for (const e of equipColliders(f.props)) if (e.k === 'capsule' && /^(ball|plate)/.test(e.id)) lowest.set(e.id, Math.min(lowest.get(e.id) ?? Infinity, Math.min(e.a[1], e.b[1]) - e.r));
  for (const [id, low] of lowest) if (low < -TOL.floor) out.push({ code: 'floor', detail: `${id} poniżej podłogi o ${(-low).toFixed(2)} cm` });
  for (const b of body) for (const e of eq) {
    const g = gap(b, e); const allowed = f.contacts.find(c => matches(b.id, c.body) && matches(e.id, c.equip));
    const heldHand = /^(farm|hand)/.test(b.id) && /^(bar|db|kb|plate|ball|rope|wheel)/.test(e.id);
    const tol = heldHand ? (/^kb/.test(e.id) ? 14 : /^(db|barLog)/.test(e.id) && e.k === 'capsule' ? Math.max(12, e.r + 6) : 12) : allowed ? allowed.tol : TOL.pen; /* hantel: chwyt w jego środku, więc tolerancja rośnie z promieniem główki */
    if (g < -tol) out.push({ code: 'pen', detail: `${b.id} × ${e.id}: przenikanie ${(-g).toFixed(2)} cm (dopuszczalne ${tol})` });
  }
  const head = body.find(b => b.id === 'head'); const bodyOther = body.filter(b => /^(uarm|farm|hand)/.test(b.id));
  if (head) for (const o of bodyOther) { const g = gap(head, o); if (g < -0.5) out.push({ code: 'self', detail: `głowa × ${o.id}: ${(-g).toFixed(2)} cm` }); }
  for (const r of f.props) if (r.k === 'rail') for (const b of f.props) if (b.k === 'barbell' && Math.abs(b.c[0] - r.x) > TOL.rail) out.push({ code: 'rail', detail: `sztanga × prowadnica: x sztangi ${b.c[0].toFixed(1)} cm, x prowadnicy ${r.x.toFixed(1)} cm (różnica ${Math.abs(b.c[0] - r.x).toFixed(1)} cm, dopuszczalne ${TOL.rail})` });
  for (const p of f.props) if (p.k === 'pivot' && p.len !== undefined) { const d = dist(p.from, p.to); if (Math.abs(d - p.len) > TOL.pivot) out.push({ code: 'pivot', detail: `${p.label ?? 'landmine'}: ${p.label ? 'punkt mocowania' : 'dłonie'} ${d.toFixed(1)} cm od osi obrotu, a ${p.label ? 'ramię' : 'gryf'} ma ${p.len} cm (dopuszczalne ± ${TOL.pivot})` }); }
  for (const p of f.props) if (p.k === 'wheel' && Math.abs(p.c[1] - p.r) > TOL.rail) out.push({ code: 'wheel', detail: `kółko: oś na wysokości ${p.c[1].toFixed(1)} cm, a kółko toczy się po podłodze (promień ${p.r} cm; dopuszczalne ± ${TOL.rail})` });
  for (const p of f.props) if (p.k === 'slide') { const w = sub(p.to, p.from); const t = w[0] * p.dir[0] + w[1] * p.dir[1] + w[2] * p.dir[2]; const tc = Math.max(0, Math.min(p.len, t)); const e = Math.hypot(w[0] - p.dir[0] * tc, w[1] - p.dir[1] * tc, w[2] - p.dir[2] * tc); if (e > TOL.pivot) out.push({ code: 'slide', detail: `dźwignia (prowadnica): punkt mocowania ${e.toFixed(1)} cm od prowadnicy (skok ${t.toFixed(1)} cm z ${p.len} cm; dopuszczalne ± ${TOL.pivot})` }); }
  for (const h of holdChecks(f)) if (h.err > h.tol) out.push({ code: 'grip', detail: `${h.name}: dłoń ${h.err.toFixed(2)} cm od chwytu (dopuszczalne ${h.tol})`, ...(h.hint ? { hint: h.hint } : {}) });
  return out;
}

/** Tolerancje chwytu sprzętu trzymanego na powierzchni (cm): dłoń na obręczy talerza i na powierzchni piłki. */
export const HOLD = { plateRim: 3, ballSurface: 3 } as const;
/** Odległość punktu od okręgu o środku c i promieniu r w płaszczyźnie y–z (oś x = normalna). */
export function distToRingYZ(p: V3, c: V3, r: number): number { const dx = p[0] - c[0], inPlane = Math.hypot(p[1] - c[1], p[2] - c[2]); return Math.hypot(dx, inPlane - r); }

/** Odległość chwytu od uchwytu sprzętu trzymanego w rękach (błąd dłoni na gryfie/hantlu/uchwycie). */
export function holdChecks(f: Frame): { name: string; err: number; tol: number; hint?: string }[] {
  const out: { name: string; err: number; tol: number; hint?: string }[] = []; const sk = f.sk;
  const seg = (p: V3, a: V3, b: V3): number => distSegSeg(p, p, a, b);
  for (const p of f.props) {
    if (p.k === 'barbell' && p.held !== false) for (const s of p.held === 'R' ? ['R' as const] : p.held === 'L' ? ['L' as const] : SIDES) out.push({ name: `gryf/${s}`, err: p.axis === 'x' ? seg(sk.arms[s].grip, [p.c[0] - 60, p.c[1], p.c[2]], [p.c[0] + 60, p.c[1], p.c[2]]) : seg(sk.arms[s].grip, [p.c[0], p.c[1], -60], [p.c[0], p.c[1], 60]), tol: 0.6 });
    if (p.k === 'trapbar') for (const s of SIDES) { const z = (s === 'R' ? 1 : -1) * (p.w ?? EQUIP.trapW); out.push({ name: `uchwyt/${s}`, err: seg(sk.arms[s].grip, [p.c[0] - 7, p.c[1], z], [p.c[0] + 7, p.c[1], z]), tol: 0.6, hint: `dłonie na uchwytach gryfu sześciokątnego: z = ±${p.w ?? EQUIP.trapW} cm, x i y wspólne dla obu dłoni (środek gryfu = środek między dłońmi)` }); }
    if (p.k === 'dumbbell' && p.held !== false) for (const s of p.vertical ? SIDES : [p.side]) out.push({ name: `hantel/${s}`, err: dist(sk.arms[s].grip, p.c), tol: p.vertical ? 6.5 : 0.6 });
    if (p.k === 'handle' && p.held !== false) out.push({ name: `uchwyt/${p.side}`, err: dist(sk.arms[p.side].grip, p.c), tol: 0.6 });
    if (p.k === 'kettlebell' && p.held !== false) for (const s of p.side === 'R' || p.side === 'L' ? [p.side] : SIDES) out.push({ name: `kettlebell/${s}`, err: dist(sk.arms[s].grip, p.c), tol: 7 });
    if (p.k === 'sled' && p.posts) for (const s of SIDES) out.push({ name: `slupek/${s}`, err: seg(sk.arms[s].grip, [p.x, EQUIP.sledBase, (s === 'R' ? 1 : -1) * EQUIP.sledHalf], [p.x, p.h, (s === 'R' ? 1 : -1) * EQUIP.sledHalf]), tol: 1.5, hint: `dłonie na słupkach sań: x = x słupków, z = ±${EQUIP.sledHalf} cm, y między ${EQUIP.sledBase} cm a wysokością słupków (± 1,5 cm)` });
    if (p.k === 'rope' && p.held !== false) for (const s of p.held === 'R' || p.held === 'L' ? [p.held] : SIDES) out.push({ name: `lina/${s}`, err: seg(sk.arms[s].grip, [p.x, p.bottom, p.z], [p.x, p.top, p.z]), tol: 3, hint: 'dłoń musi obejmować linę: środek chwytu na osi liny (x, z liny; y między dołem a górą liny), odchylenie ≤ 3 cm' });
    if (p.k === 'dipbars' && p.held !== false) for (const s of SIDES) out.push({ name: `poreczy/${s}`, err: seg(sk.arms[s].grip, [p.x0, p.h, (s === 'R' ? 1 : -1) * p.z], [p.x1, p.h, (s === 'R' ? 1 : -1) * p.z]), tol: 1, hint: `dłonie na poręczach: y = wysokość poręczy, z = ±${p.z} cm (R dodatnie), x między początkiem a końcem poręczy (± 1 cm)` });
    if (p.k === 'roll' && p.held) for (const s of SIDES) out.push({ name: `kloda/${s}`, err: Math.max(0, seg(sk.arms[s].grip, [p.c[0], p.c[1], p.c[2] - p.len / 2], [p.c[0], p.c[1], p.c[2] + p.len / 2]) - p.r), tol: 3, hint: `dłonie na kłodzie: środek chwytu w odległości ≤ promień + 3 cm od osi kłody (oś wzdłuż z, długość ${p.len} cm)` });
    if (p.k === 'plate' && p.held !== false) for (const s of p.held === 'R' || p.held === 'L' ? [p.held] : SIDES) out.push({ name: `talerz/${s}`, err: distToRingYZ(sk.arms[s].grip, p.c, p.r ?? EQUIP.plateR), tol: HOLD.plateRim, hint: 'dłoń musi leżeć na obręczy talerza (okrąg o promieniu talerza wokół środka w płaszczyźnie y–z); środek talerza = środek między dłońmi + przesuniecie' });
    if (p.k === 'ball' && p.held !== false) for (const s of p.held === 'R' || p.held === 'L' ? [p.held] : SIDES) out.push({ name: `pilka/${s}`, err: Math.abs(dist(sk.arms[s].grip, p.c) - (p.r ?? EQUIP.medBallR)), tol: HOLD.ballSurface, hint: 'dłoń musi leżeć na powierzchni piłki (odległość od środka = promień piłki); środek piłki = środek między dłońmi + przesuniecie' });
  }
  return out;
}

