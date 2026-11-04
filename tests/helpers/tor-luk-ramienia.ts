// Próg odchylenia toru łukowego ramienia (delt_raise, K1-przygotowanie 04.11.2026): z geometrii pozy, nie z oka. Używają: tests/figures-v2-tor.test.ts i tests/figures-v2-delt-raise-p2.test.ts.
import { keyframeFrame, type PoseData } from '@/lib/figures/v2';

/** Najmniejszy próg odchylenia (cm) — tor prostoliniowy (gryf, hantle w ruchach liniowych). */
export const PROG_ODCHYLENIA_PROSTY = 4;
/** Dryf łokcia (stale lekko zgięty) i tułowia w śladzie chwytu, cm. */
export const DRYF_RAMIE = 2;
/** r·(1 − cos(Δθ/2)) + dryf; Δθ = kąt między wektorem bark → chwyt w u = 0 i w u = 1, r = jego długość w u = 1 (ręka R). Przykłady: Front Raise to Overhead Δθ 155° → 48,6 cm (pomiar 47,5–48,5); Lateral Raise Δθ 79° → 14,3 cm (pomiar 13,2); Y Raise (hantle) Δθ 125° → 34 cm (pomiar 28,5 z boku). */
export const progLukuRamienia = (d: PoseData): number => {
  const w = (u: number) => { const a = keyframeFrame(d, u).sk.arms.R; return [0, 1, 2].map(i => a.grip[i] - a.shoulder[i]); };
  const v0 = w(0), v1 = w(1); const n = (v: number[]) => Math.hypot(v[0], v[1], v[2]); const cos = (v0[0] * v1[0] + v0[1] * v1[1] + v0[2] * v1[2]) / (n(v0) * n(v1));
  return Math.max(PROG_ODCHYLENIA_PROSTY, n(v1) * (1 - Math.cos(Math.acos(Math.max(-1, Math.min(1, cos))) / 2)) + DRYF_RAMIE);
};
