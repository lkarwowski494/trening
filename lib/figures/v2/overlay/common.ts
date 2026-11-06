/*
 * Figury v2 — wspólne elementy nakładki techniki: kreska przerywana (linie odniesienia i linia przez kończynę). Dane nakładek rodzin: overlay/<rodzina>.ts.
 */
import type { V2 } from '../math';
import type { Shape } from '../scene';

/** Kreska przerywana roli „guide” (token doneLine); przy błędzie złamanej reguły rola „error” (token danger). */
export const dash = (a: V2, b: V2, id: string, role: 'guide' | 'error' = 'guide'): Shape => ({ k: 'line', a, b, w: 0.9, role, dash: [3, 2.2], z: 4000, id });
/** Linia elementu nakładki (przez kończynę, odniesienie odwiedzenia): CIĄGŁA i grubsza niż ślad toru (kreskowany 0,8) i linie odniesienia (kreskowane) — W6, recenzja 1R: ta sama rola/kolor, inna kreska i grubość. */
export const OVERLAY_LINE_W = 1.5;
export const solid = (a: V2, b: V2, id: string, role: 'guide' | 'error' = 'guide'): Shape => ({ k: 'line', a, b, w: OVERLAY_LINE_W, role, z: 4000, id });
