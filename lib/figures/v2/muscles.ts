/*
 * Figury v2 — podświetlenie mięśni. Dane NIE z makiety (jej mapa mięśni przeczy zbadanym danym): `muscleLoad` z docs/research/equipment/catalog.json (709/709 ćwiczeń,
 * z pewnością i źródłami; generuje scripts/figures/v2-gen.mjs → muscles.generated.ts). 1 = główny, 0,5 = pomocniczy, 0,25 = mały udział (nie podświetlany).
 * Podświetlenie jest STAŁE (bez animowanej „krzywej napięcia” — brak źródła). Regiony bez odpowiednika w katalogu (zębaty przedni, podział czworobocznego) nie są rysowane.
 * Kształt: pasmo na odpowiednim odcinku ciała (przód/tył/oba boki), kolory muscleMain / muscleAux z palette.ts.
 */
import { add, mul, norm, sub, type V2, type V3 } from './math';
import { BODY, GIRTH, type Skeleton } from './skeleton';
import { depthOf, proj, spineAt, TORSO_SIDE, TORSO_FRONT } from './draw';
import { LAYER, type Shape, type View } from './scene';

export type MuscleId = 'chest' | 'triceps' | 'front_delt' | 'biceps' | 'abs' | 'lower_back' | 'hamstrings' | 'glutes' | 'quads' | 'upper_back' | 'forearms' | 'lats' | 'adductors' | 'rear_delt' | 'obliques' | 'side_delt' | 'calves' | 'abductors' | 'neck';
export const MUSCLES: MuscleId[] = ['chest', 'triceps', 'front_delt', 'biceps', 'abs', 'lower_back', 'hamstrings', 'glutes', 'quads', 'upper_back', 'forearms', 'lats', 'adductors', 'rear_delt', 'obliques', 'side_delt', 'calves', 'abductors', 'neck'];
/** Poniżej tego udziału mięsień nie jest podświetlany (0,25 = mały udział). */
export const MUSCLE_MIN_LOAD = 0.5;

type Limb = 'thigh' | 'shank' | 'uarm' | 'farm';
type Reg = { limb: Limb; t0: number; t1: number; side: 'front' | 'back' | 'inner' | 'outer' };
type TorsoReg = { a0: number; a1: number; side: 'front' | 'back' | 'both' };
const LIMB_REGIONS: Partial<Record<MuscleId, Reg[]>> = {
  quads: [{ limb: 'thigh', t0: 0.1, t1: 0.92, side: 'front' }], hamstrings: [{ limb: 'thigh', t0: 0.1, t1: 0.92, side: 'back' }],
  calves: [{ limb: 'shank', t0: 0.1, t1: 0.62, side: 'back' }],
  adductors: [{ limb: 'thigh', t0: 0.15, t1: 0.85, side: 'inner' }], abductors: [{ limb: 'thigh', t0: 0.05, t1: 0.6, side: 'outer' }],
  biceps: [{ limb: 'uarm', t0: 0.15, t1: 0.85, side: 'front' }], triceps: [{ limb: 'uarm', t0: 0.15, t1: 0.85, side: 'back' }],
  front_delt: [{ limb: 'uarm', t0: 0, t1: 0.38, side: 'front' }], rear_delt: [{ limb: 'uarm', t0: 0, t1: 0.38, side: 'back' }], side_delt: [{ limb: 'uarm', t0: 0, t1: 0.3, side: 'outer' }],
  forearms: [{ limb: 'farm', t0: 0.05, t1: 0.75, side: 'front' }, { limb: 'farm', t0: 0.05, t1: 0.75, side: 'back' }],
};
const TORSO_REGIONS: Partial<Record<MuscleId, TorsoReg>> = {
  chest: { a0: 28, a1: 46, side: 'front' }, abs: { a0: 6, a1: 28, side: 'front' }, lats: { a0: 20, a1: 44, side: 'back' }, upper_back: { a0: 40, a1: 53, side: 'back' },
  lower_back: { a0: 2, a1: 22, side: 'back' }, obliques: { a0: 8, a1: 30, side: 'both' },
};
const RADII: Record<Limb, [number, number]> = { thigh: [GIRTH.thigh[0], GIRTH.thigh[2]], shank: [GIRTH.shank[0], GIRTH.shank[2]], uarm: [GIRTH.uarm[0], GIRTH.uarm[1]], farm: [GIRTH.farm[0], GIRTH.farm[1]] };

function limbPts(sk: Skeleton, limb: Limb, s: 'R' | 'L'): [V3, V3] {
  const L = sk.legs[s], A = sk.arms[s];
  return limb === 'thigh' ? [L.hip, L.knee] : limb === 'shank' ? [L.knee, L.ankle] : limb === 'uarm' ? [A.shoulder, A.elbow] : [A.elbow, A.wrist];
}
/** Wektor „przód” kończyny (3D): nogi — kierunek stopy, ręce — przód tułowia. */
function frontOf(sk: Skeleton, limb: Limb, s: 'R' | 'L'): V3 {
  if (limb === 'uarm' || limb === 'farm') return sk.front;
  const L = sk.legs[s]; return norm(sub(L.toe, L.heel));
}

/** Pasmo na kończynie: t0–t1 wzdłuż odcinka, strona względem „przodu” kończyny (w rzucie). */
function limbBand(sk: Skeleton, view: View, r: Reg, s: 'R' | 'L'): Shape | null {
  const [A, B] = limbPts(sk, r.limb, s); const z = (depthOf(A, view) + depthOf(B, view)) / 2; const a = proj(A, view), b = proj(B, view);
  const d: V2 = [b[0] - a[0], b[1] - a[1]]; const L = Math.hypot(d[0], d[1]); if (L < 1e-6) return null;
  const u: V2 = [d[0] / L, d[1] / L]; let n: V2 = [-u[1], u[0]];
  const f3 = frontOf(sk, r.limb, s); const f = proj(add(A, f3), view); const f0 = proj(A, view); const fv: V2 = [f[0] - f0[0], f[1] - f0[1]];
  let lateral = false;
  if (view !== 'side') { /* z przodu: strona = przód/tył nie jest widoczna, mięsień rysowany na całej szerokości; bok = wewnętrzny/zewnętrzny */ lateral = true; }
  if (!lateral) { if (n[0] * fv[0] + n[1] * fv[1] < 0) n = [-n[0], -n[1]]; }
  else { const out = s === 'R' ? 1 : -1; const lat: V2 = [-out, 0]; if (n[0] * lat[0] < 0) n = [-n[0], -n[1]]; }
  const [r0, r1] = RADII[r.limb]; const rad = (t: number) => r0 + (r1 - r0) * t;
  const sign = r.side === 'back' || r.side === 'inner' ? -1 : 1;
  const pts: V2[] = []; const N = 8;
  const lo = lateral ? (r.side === 'inner' ? -1 : r.side === 'outer' ? 1 : 0) : sign;
  for (let i = 0; i <= N; i++) { const t = r.t0 + (r.t1 - r.t0) * i / N; const c: V2 = [a[0] + d[0] * t, a[1] + d[1] * t]; const w = rad(t); const o = lateral ? (lo === 0 ? -w * 0.85 : lo * w * 0.98) : lo * w * 0.98; const o2 = lateral ? (lo === 0 ? w * 0.85 : lo * w * 0.2) : lo * w * 0.2; pts.push([c[0] + n[0] * o, c[1] + n[1] * o]); void o2; }
  for (let i = N; i >= 0; i--) { const t = r.t0 + (r.t1 - r.t0) * i / N; const c: V2 = [a[0] + d[0] * t, a[1] + d[1] * t]; const w = rad(t); const o2 = lateral ? (lo === 0 ? w * 0.85 : lo * w * 0.2) : lo * w * 0.2; pts.push([c[0] + n[0] * o2, c[1] + n[1] * o2]); }
  return { k: 'poly', pts, fill: 'muscleMain', close: true, smooth: true, z: LAYER.body * 1000 + z + 0.2 };
}

const interp = (tab: [number, number, number][], a: number): [number, number] => {
  for (let i = 1; i < tab.length; i++) if (a <= tab[i][0]) { const k = (a - tab[i - 1][0]) / (tab[i][0] - tab[i - 1][0] || 1); return [tab[i - 1][1] + (tab[i][1] - tab[i - 1][1]) * k, tab[i - 1][2] + (tab[i][2] - tab[i - 1][2]) * k]; }
  return [tab[tab.length - 1][1], tab[tab.length - 1][2]];
};

function torsoBand(sk: Skeleton, view: View, r: TorsoReg): Shape | null {
  const N = 6; const pts: V2[] = []; const inner: V2[] = [];
  for (let i = 0; i <= N; i++) {
    const a = r.a0 + (r.a1 - r.a0) * i / N; const { p, up } = spineAt(sk, a);
    if (view === 'side') {
      const n: V3 = [up[1], -up[0], 0]; const [bk, fr] = interp(TORSO_SIDE, a);
      const o0 = r.side === 'front' ? 0 : bk * 0.98, o1 = r.side === 'back' ? 0 : fr * 0.98;
      const c0 = r.side === 'front' ? fr * 0.98 : bk * 0.98, c1 = r.side === 'front' ? 1.5 : r.side === 'back' ? bk * -0.0 - 1.5 : fr * 0.98;
      pts.push(proj(add(p, mul(n, c0)), view)); inner.push(proj(add(p, mul(n, r.side === 'both' ? c1 : r.side === 'front' ? 1.5 : -1.5)), view)); void o0; void o1;
    } else {
      const c = proj(p, view); const w = interpF(a); pts.push([c[0] - w * 0.85, c[1]]); inner.push([c[0] + w * 0.85, c[1]]);
    }
  }
  const poly = [...pts, ...inner.reverse()]; return { k: 'poly', pts: poly, fill: 'muscleMain', close: true, smooth: true, z: LAYER.body * 1000 + (view === 'side' ? 0 : (sk.pelvis[0] + sk.shoulderC[0]) / 2) + 0.15 };
}
const interpF = (a: number): number => { const t = TORSO_FRONT; for (let i = 1; i < t.length; i++) if (a <= t[i][0]) return t[i - 1][1] + (t[i][1] - t[i - 1][1]) * (a - t[i - 1][0]) / (t[i][0] - t[i - 1][0] || 1); return t[t.length - 1][1]; };

/**
 * Kształty podświetlenia: `loads` = muscleLoad ćwiczenia (id → 1 / 0,5 / 0,25). Główne (1) rysowane mocniej niż pomocnicze (0,5); 0,25 pomijane.
 * Zwraca kształty z rolami muscleMain / muscleAux (kolory z palette.ts), z przezroczystością przez pole `a`.
 */
export function muscleShapes(sk: Skeleton, view: View, loads: Partial<Record<MuscleId, number>>): Shape[] {
  const out: Shape[] = []; const sides: ('R' | 'L')[] = view === 'side' ? ['R'] : ['R', 'L'];
  for (const m of MUSCLES) {
    const v = loads[m] ?? 0; if (v < MUSCLE_MIN_LOAD) continue;
    const main = v >= 1; const push = (s: Shape | null) => { if (s && s.k === 'poly') out.push({ ...s, fill: main ? 'muscleMain' : 'muscleAux', a: main ? 0.78 : 0.55, id: 'muscle-' + m }); };
    for (const r of LIMB_REGIONS[m] ?? []) for (const s of sides) { if (view === 'side' && (r.side === 'inner' || r.side === 'outer')) continue; push(limbBand(sk, view, r, s)); }
    const t = TORSO_REGIONS[m]; if (t && !(view !== 'side' && (t.side === 'back'))) push(torsoBand(sk, view, t));
    if (m === 'glutes' && view === 'side') { const c = proj(add(sk.pelvis, mul(sk.front, -4.5)), view); out.push({ k: 'circle', c, r: 7, fill: main ? 'muscleMain' : 'muscleAux', a: main ? 0.78 : 0.55, z: LAYER.body * 1000 + 0.3, id: 'muscle-glutes' }); }
  }
  void BODY;
  return out;
}
