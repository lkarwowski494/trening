/*
 * Figury v2 — wspólne elementy nakładki techniki: kreska przerywana (linie odniesienia i linia przez kończynę). Dane nakładek rodzin: overlay/<rodzina>.ts.
 */
import type { V2 } from '../math';
import type { Shape } from '../scene';

/** Kreska przerywana roli „guide” (token doneLine); przy błędzie złamanej reguły rola „error” (token danger). */
export const dash = (a: V2, b: V2, id: string, role: 'guide' | 'error' = 'guide'): Shape => ({ k: 'line', a, b, w: 0.9, role, dash: [3, 2.2], z: 4000, id });
