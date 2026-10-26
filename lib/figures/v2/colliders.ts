/*
 * Figury v2 — kolidery i sprawdzenia geometrii klatki (do testów i do skryptów kontrolnych). Ciało = kapsuły na kościach, sprzęt = kapsuły i graniastosłupy.
 * Odstęp (gap) = odległość powierzchni; ujemny = przenikanie. Kontakty dozwolone deklaruje klatka (Frame.contacts); reszta par nie może się przenikać.
 */
import { distSegSeg, dist, type V2, type V3 } from './math';
import { BODY, GIRTH, SIDES, soleY, type Skeleton } from './skeleton';
import { benchPolys, EQUIP } from './draw';
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
    c.push({ k: 'capsule', id: 'farm' + s, a: A.elbow, b: A.grip, r: 3.3 });
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
      case 'barbell': c.push({ k: 'capsule', id: 'bar', a: [p.c[0], p.c[1], -(p.len ?? EQUIP.barLen) / 2], b: [p.c[0], p.c[1], (p.len ?? EQUIP.barLen) / 2], r: EQUIP.barR }); break;
      case 'trapbar': for (const sg of [-1, 1]) c.push({ k: 'capsule', id: 'bar', a: [p.c[0] - 7, p.c[1], sg * (p.w ?? EQUIP.trapW)], b: [p.c[0] + 7, p.c[1], sg * (p.w ?? EQUIP.trapW)], r: 1.8 }); break;
      case 'dumbbell': c.push({ k: 'capsule', id: 'db' + p.side, a: p.c, b: p.c, r: p.r ?? EQUIP.dbHeadR }); break;
      case 'kettlebell': { const d = p.dir ?? [0, -1, 0]; const o = p.r === undefined ? 12 : p.r + 2.5; const q: V3 = [p.c[0] + d[0] * o, p.c[1] + d[1] * o, p.c[2] + d[2] * o]; c.push({ k: 'capsule', id: 'kb', a: q, b: q, r: p.r ?? EQUIP.kbBallR }); break; }
      case 'ball': c.push({ k: 'capsule', id: 'ball', a: p.c, b: p.c, r: p.r ?? EQUIP.medBallR }); break;
      case 'plate': c.push(...plateColliders(p)); break;
      case 'bench': { const bp = benchPolys(p); const w = (p.w ?? EQUIP.benchW) / 2; c.push(prism('benchSeat', bp.seat, -w, w), prism('benchBack', bp.back, -w, w)); break; }
      case 'box': { const w = (p.w ?? EQUIP.boxW) / 2; c.push(prism('box', rectPoly(p.x0, 0, p.x1, p.top), -w, w)); break; }
      case 'wall': c.push(prism('wall', rectPoly(p.x - EQUIP.wallW, 0, p.x, p.h), -100, 100)); break;
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
    const bones: [string, number, number][] = [['thigh', dist(L.hip, L.knee), BODY.thigh], ['shank', dist(L.knee, L.ankle), BODY.shank], ['uarm', dist(A.shoulder, A.elbow), BODY.uarm], ['farm', dist(A.elbow, A.grip), A.lower]];
    for (const [n, got, want] of bones) if (Math.abs(got - want) > 1e-4) out.push({ code: 'bone', detail: `${n}${s}: ${got.toFixed(4)} ≠ ${want}` });
    if (L.err > TOL.reach) out.push({ code: 'reach', detail: `noga ${s}: cel poza zasięgiem o ${L.err.toFixed(2)} cm` });
    if (A.err > TOL.reach) out.push({ code: 'reach', detail: `ręka ${s}: cel poza zasięgiem o ${A.err.toFixed(2)} cm` });
  }
  const body = bodyColliders(sk), eq = equipColliders(f.props);
  for (const b of body) if (b.k === 'capsule') { const low = Math.min(b.a[1], b.b[1]) - b.r; if (low < -TOL.floor && !/^(torso|pelvis|head|uarm|farm)/.test(b.id)) out.push({ code: 'floor', detail: `${b.id} poniżej podłogi o ${(-low).toFixed(2)} cm` }); }
  for (const s of SIDES) if (soleY(sk.legs[s]) < -TOL.floor) out.push({ code: 'floor', detail: `stopa ${s} poniżej podłogi` });
  const lowest = new Map<string, number>(); /* sprzęt trzymany (talerz = wiele kapsuł): jeden komunikat na rekwizyt, z najniższym punktem */
  for (const e of equipColliders(f.props)) if (e.k === 'capsule' && /^(ball|plate)/.test(e.id)) lowest.set(e.id, Math.min(lowest.get(e.id) ?? Infinity, Math.min(e.a[1], e.b[1]) - e.r));
  for (const [id, low] of lowest) if (low < -TOL.floor) out.push({ code: 'floor', detail: `${id} poniżej podłogi o ${(-low).toFixed(2)} cm` });
  for (const b of body) for (const e of eq) {
    const g = gap(b, e); const allowed = f.contacts.find(c => matches(b.id, c.body) && matches(e.id, c.equip));
    const heldHand = /^farm/.test(b.id) && /^(bar|db|kb|plate|ball)/.test(e.id);
    const tol = heldHand ? (/^kb/.test(e.id) ? 14 : 12) : allowed ? allowed.tol : TOL.pen;
    if (g < -tol) out.push({ code: 'pen', detail: `${b.id} × ${e.id}: przenikanie ${(-g).toFixed(2)} cm (dopuszczalne ${tol})` });
  }
  const head = body.find(b => b.id === 'head'); const bodyOther = body.filter(b => /^(uarm|farm)/.test(b.id));
  if (head) for (const o of bodyOther) { const g = gap(head, o); if (g < -0.5) out.push({ code: 'self', detail: `głowa × ${o.id}: ${(-g).toFixed(2)} cm` }); }
  for (const r of f.props) if (r.k === 'rail') for (const b of f.props) if (b.k === 'barbell' && Math.abs(b.c[0] - r.x) > TOL.rail) out.push({ code: 'rail', detail: `sztanga × prowadnica: x sztangi ${b.c[0].toFixed(1)} cm, x prowadnicy ${r.x.toFixed(1)} cm (różnica ${Math.abs(b.c[0] - r.x).toFixed(1)} cm, dopuszczalne ${TOL.rail})` });
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
    if (p.k === 'barbell' && p.held !== false) for (const s of p.held === 'R' ? ['R' as const] : p.held === 'L' ? ['L' as const] : SIDES) out.push({ name: `gryf/${s}`, err: seg(sk.arms[s].grip, [p.c[0], p.c[1], -60], [p.c[0], p.c[1], 60]), tol: 0.6 });
    if (p.k === 'trapbar') for (const s of SIDES) { const z = (s === 'R' ? 1 : -1) * (p.w ?? EQUIP.trapW); out.push({ name: `uchwyt/${s}`, err: seg(sk.arms[s].grip, [p.c[0] - 7, p.c[1], z], [p.c[0] + 7, p.c[1], z]), tol: 0.6 }); }
    if (p.k === 'dumbbell' && p.held !== false) for (const s of p.vertical ? SIDES : [p.side]) out.push({ name: `hantel/${s}`, err: dist(sk.arms[s].grip, p.c), tol: p.vertical ? 6.5 : 0.6 });
    if (p.k === 'kettlebell' && p.held !== false) for (const s of p.side === 'R' || p.side === 'L' ? [p.side] : SIDES) out.push({ name: `kettlebell/${s}`, err: dist(sk.arms[s].grip, p.c), tol: 7 });
    if (p.k === 'plate' && p.held !== false) for (const s of p.held === 'R' || p.held === 'L' ? [p.held] : SIDES) out.push({ name: `talerz/${s}`, err: distToRingYZ(sk.arms[s].grip, p.c, p.r ?? EQUIP.plateR), tol: HOLD.plateRim, hint: 'dłoń musi leżeć na obręczy talerza (okrąg o promieniu talerza wokół środka w płaszczyźnie y–z); środek talerza = środek między dłońmi + przesuniecie' });
    if (p.k === 'ball' && p.held !== false) for (const s of p.held === 'R' || p.held === 'L' ? [p.held] : SIDES) out.push({ name: `pilka/${s}`, err: Math.abs(dist(sk.arms[s].grip, p.c) - (p.r ?? EQUIP.medBallR)), tol: HOLD.ballSurface, hint: 'dłoń musi leżeć na powierzchni piłki (odległość od środka = promień piłki); środek piłki = środek między dłońmi + przesuniecie' });
  }
  return out;
}

