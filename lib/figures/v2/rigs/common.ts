/*
 * Figury v2 — wspólne elementy rigów (rodzin ruchu): punkty w układzie tułowia, bisekcja, ramiona z celów chwytu, budowa klatki.
 * Rodzina ruchu = jeden plik w rigs/ z funkcją `frame(params, u)`; u: 0 = pozycja wyjściowa, 1 = pozycja skrajna (dół przysiadu, sztanga na klatce…).
 */
import { add, clamp, mul, sag, sagFront, type V3 } from '../math';
import { BODY, solveSkeleton, type PoseIn, type Side } from '../skeleton';
import type { Contact, Frame, Prop } from '../scene';

/** Punkt w układzie tułowia: `a` cm od miednicy wzdłuż tułowia (w stronę barków), `b` cm do przodu (od pleców ku klatce), `z` na boki. */
export function trunkPoint(hip: V3, tau: number, a: number, b: number, z = 0): V3 {
  const up = sag(tau), fr = sagFront(tau);
  return [hip[0] + up[0] * a + fr[0] * b, hip[1] + up[1] * a + fr[1] * b, z];
}

/** Bisekcja funkcji monotonicznej f(x) = 0 na [lo, hi]; gdy brak zmiany znaku, zwraca skrajny koniec bliższy zera. */
export function solveRoot(f: (x: number) => number, lo: number, hi: number, it = 40): number {
  let a = lo, b = hi; const fa = f(a), fb = f(b);
  if (fa === 0) return a; if (fb === 0) return b;
  if (fa * fb > 0) return Math.abs(fa) < Math.abs(fb) ? a : b;
  for (let i = 0; i < it; i++) { const m = (a + b) / 2, fm = f(m); if (fm * fa <= 0) b = m; else a = m; }
  return (a + b) / 2;
}

/** Łagodne tempo 0–1 (start i koniec ruchu wolniejsze). */
export const ease = (u: number): number => { const x = clamp(u, 0, 1); return x * x * (3 - 2 * x); };

export type Grips = Record<Side, { grip: V3; pole?: V3 }>;
export const sym = (p: V3, half: number): Record<Side, V3> => ({ R: [p[0], p[1], half], L: [p[0], p[1], -half] });

/** Klatka z wejścia pozy: rozwiązuje szkielet i dokleja rekwizyty, punkty znaczące i dozwolone kontakty. */
export function mkFrame(pose: PoseIn, props: Prop[], info: Record<string, V3>, contacts: Contact[] = []): Frame {
  return { sk: solveSkeleton(pose), props, info, contacts };
}

/** Reguła pochylenia podudzia: σ = min(max, stand + perKnee·K) — stopa płasko, zgięcie grzbietowe stopy = σ (limit ≤ 37° z docs/research/28). */
export type ShinRule = { stand: number; perKnee: number; max: number };
/**
 * Łańcuch nogi od kostki (stopa płasko): kolano i biodro dla zgięcia kolana K. `dz` = odległość boczna kostka–biodro (cm): przy szerokim rozstawie noga
 * jest odwiedziona, więc jej rzut na płaszczyznę strzałkową jest krótszy (długości × cos γ, γ = asin(dz / długość nogi)) — dzięki temu cel IK jest w zasięgu.
 */
export function legFK(K: number, rule: ShinRule, ankle: V3, dz = 0): { knee: V3; hip: V3; sigma: number } {
  const sigma = Math.min(rule.max, rule.stand + rule.perKnee * K);
  const cg = Math.cos(Math.asin(Math.min(0.9, dz / (BODY.thigh + BODY.shank))));
  const knee = add(ankle, mul(sag(sigma), BODY.shank * cg));
  const hip = add(knee, mul(sag(sigma - K), BODY.thigh * cg));
  return { knee, hip, sigma };
}

export const nearTo = (a: V3, b: V3): number => Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);
export { add, mul };
