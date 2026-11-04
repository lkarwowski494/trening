/*
 * Nakładka techniki: przysiad — linie odniesienia (decyzja właściciela 25.10.2026: linie bez liczb, tylko przy wskazówce ze źródłem; id wskazówki w `cue`).
 */
import type { GuideDef } from '../guides';
import { proj } from '../draw';
import { dash } from './common';

export const SQUAT_GUIDES: GuideDef[] = [
  /** „co najmniej do równoległego ud” (sq.depth): pozioma linia na wysokości kolana — na dole przysiadu uda leżą na niej. */
  { id: 'thighParallel', cue: ['sq.depth'], views: ['side'], build: (f, v) => { const k = proj(f.sk.legs.R.knee, v), h = proj(f.sk.legs.R.hip, v); return [dash([Math.min(h[0], k[0]) - 14, k[1]], [Math.max(h[0], k[0]) + 14, k[1]], 'guideThigh')]; } },
  /** „kolana idą w linii palców stóp” (sq.kneesToes): pionowa linia przez palce każdej stopy (widok z przodu). */
  { id: 'kneeToe', cue: ['sq.kneesToes'], views: ['front'], build: (f, v) => (['R', 'L'] as const).map(s => { const t = proj(f.sk.legs[s].toe, v), k = proj(f.sk.legs[s].knee, v); return dash([t[0], 0], [t[0], k[1] + 12], 'guideKnee' + s); }) },
];
