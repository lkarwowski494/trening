/*
 * Nakładka techniki: przysiad — linie odniesienia (decyzja właściciela 25.10.2026: linie bez liczb, tylko przy wskazówce ze źródłem; id wskazówki w `cue`)
 * oraz element kończyny (etap 2, 04.11.2026): linia przez udo + łuk zgięcia kolana, tylko z regułą „ustalone” i wskazówką obecną na karcie ćwiczenia.
 * Linię pleców (`backLine`, plik hinge.ts) przysiad dostaje przy wskazówce sq.back (reguła plecy_neutralne rodziny squat: ustalone).
 * Bez elementu (brak reguły „ustalone” z wskazówką na karcie lub rodzaju elementu w silniku): kolana nad stopami i pięty (styki) — w obu istnieje linia / poświata styku.
 */
import type { GuideDef } from '../guides';
import type { TechniqueDef } from '../overlay';
import { proj } from '../draw';
import { dash } from './common';

export const SQUAT_GUIDES: GuideDef[] = [
  /** „co najmniej do równoległego ud” (sq.depth): pozioma linia na wysokości kolana — na dole przysiadu uda leżą na niej. */
  { id: 'thighParallel', cue: ['sq.depth'], rule: 'udo_rownolegle', views: ['side'], build: (f, v) => { const k = proj(f.sk.legs.R.knee, v), h = proj(f.sk.legs.R.hip, v); return [dash([Math.min(h[0], k[0]) - 14, k[1]], [Math.max(h[0], k[0]) + 14, k[1]], 'guideThigh')]; } },
  /** „kolana idą w linii palców stóp” (sq.kneesToes): pionowa linia przez palce każdej stopy (widok z przodu). */
  { id: 'kneeToe', cue: ['sq.kneesToes'], rule: 'kolana_nad_stopami', views: ['front'], build: (f, v) => (['R', 'L'] as const).map(s => { const t = proj(f.sk.legs[s].toe, v), k = proj(f.sk.legs[s].knee, v); return dash([t[0], 0], [t[0], k[1] + 12], 'guideKnee' + s); }) },
];

export const SQUAT_TECHNIQUE: TechniqueDef[] = [
  /** „biodra i kolana zginają się razem” (sq.down; Goblet: gob.move): linia przez udo i łuk zgięcia kolana (rzut z boku); kąt = „Kąt na rysunku: zgięcie kolana”. */
  { id: 'squatKneeLimb', kind: 'limb', cue: ['sq.down', 'gob.move'], rule: 'zejscie_biodra_i_kolana', views: ['side'], joint: 'knee' },
];
