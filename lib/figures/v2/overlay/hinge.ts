/*
 * Nakładka techniki: zawias — linie odniesienia (decyzja właściciela 25.10.2026: linie bez liczb, tylko przy wskazówce ze źródłem; id wskazówki w `cue`).
 */
import type { GuideDef } from '../guides';
import type { V2 } from '../math';
import { proj } from '../draw';
import { BODY } from '../skeleton';
import { dash } from './common';

export const HINGE_GUIDES: GuideDef[] = [
  /** „sztanga tuż przy piszczelach, nad środkiem stopy” (dl.feet): pionowa linia przez środek stopy. */
  { id: 'plumbMidfoot', cue: ['dl.feet'], views: ['side'], build: (f, v) => { const m = f.info.midfoot ? proj(f.info.midfoot, v) : null; return m ? [dash([m[0], 0], [m[0], 150], 'guidePlumb')] : []; } },
  /** „plecy proste (neutralne) przez cały ruch” (hinge.back): prosta od miednicy przez bark do głowy. */
  { id: 'backLine', cue: ['hinge.back'], rule: 'plecy_neutralne', views: ['side'], build: (f, v) => { const p = proj(f.sk.pelvis, v), s = proj(f.sk.shoulderC, v); const d: V2 = [s[0] - p[0], s[1] - p[1]]; const L = Math.hypot(d[0], d[1]) || 1; const e = (BODY.trunk + 30) / L; return [dash([p[0] - d[0] * 0.25, p[1] - d[1] * 0.25], [p[0] + d[0] * e, p[1] + d[1] * e], 'guideBack')]; } },
];
