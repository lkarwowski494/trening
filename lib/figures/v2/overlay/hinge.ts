/*
 * Nakładka techniki: zawias — linie odniesienia (decyzja właściciela 25.10.2026: linie bez liczb, tylko przy wskazówce ze źródłem; id wskazówki w `cue`)
 * oraz element kończyny (etap 2, 04.11.2026): linia przez tułów i łuk zgięcia w biodrze, tylko z regułą „ustalone” i wskazówką obecną na karcie ćwiczenia.
 * Linia pleców (`backLine`) jest wspólna z przysiadem (wskazówka sq.back, reguła plecy_neutralne rodziny squat) i z przysiadem przy ścianie (wall.back).
 */
import type { GuideDef } from '../guides';
import type { TechniqueDef } from '../overlay';
import type { V2 } from '../math';
import { proj } from '../draw';
import { BODY } from '../skeleton';
import { dash } from './common';

export const HINGE_GUIDES: GuideDef[] = [
  /** „sztanga tuż przy piszczelach, nad środkiem stopy” (dl.feet): pionowa linia przez środek stopy. */
  { id: 'plumbMidfoot', cue: ['dl.feet'], views: ['side'], build: (f, v) => { const m = f.info.midfoot ? proj(f.info.midfoot, v) : null; return m ? [dash([m[0], 0], [m[0], 150], 'guidePlumb')] : []; } },
  /** „plecy proste (neutralne) przez cały ruch” (hinge.back): prosta od miednicy przez bark do głowy. */
  { id: 'backLine', cue: ['hinge.back', 'sq.back', 'wall.back'], views: ['side'], build: (f, v) => { const p = proj(f.sk.pelvis, v), s = proj(f.sk.shoulderC, v); const d: V2 = [s[0] - p[0], s[1] - p[1]]; const L = Math.hypot(d[0], d[1]) || 1; const e = (BODY.trunk + 30) / L; return [dash([p[0] - d[0] * 0.25, p[1] - d[1] * 0.25], [p[0] + d[0] * e, p[1] + d[1] * e], 'guideBack')]; } },
];

export const HINGE_TECHNIQUE: TechniqueDef[] = [
  /** „wyprost na górze” (wyprost_na_gorze, ustalone): linia bark–biodro przedłużona poza biodro i łuk zgięcia biodra — u góry łuk znika, a linia leży na osi uda (tułów i noga w jednej linii). Kąt = „Kąt na rysunku: zgięcie biodra”. */
  { id: 'hingeHipLimb', kind: 'limb', cue: ['dl.lift', 'tb.lift', 'sumo.lift', 'dbdl.hips', 'rdl.move', 'rdl.dbMove', 'gm.move'], rule: 'wyprost_na_gorze', views: ['side'], joint: 'hip' },
];
