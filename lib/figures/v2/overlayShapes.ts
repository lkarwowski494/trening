/*
 * Figury v2 — linie odniesienia i nakładka techniki w klatce (wydzielone z figure.ts, limit 20 KB; zmiana strukturalna, zachowanie bez zmian).
 * Zależy od figure.ts (klatka, pomiar, opis błędu); figure.ts nie importuje tego modułu.
 */
import { GUIDES, type GuideId } from './guides';
import { techniqueShapes, techniqueDef, type TechniqueDef } from './overlay';
import type { Shape, View } from './scene';
import { frameAt, errorDefOf, measuredJoint, measuredSide, angleLineShown, type FigureSpec } from './figure';
import type { FigError } from './errors';

/** Linie odniesienia dla pozycji u (tylko z wskazanych id i widoków, w których linia ma sens). */
export function guideShapes(spec: FigureSpec, u: number, view: View, ids: GuideId[], error?: FigError): Shape[] {
  const f = frameAt(spec, u, error);
  return ids.flatMap(id => { const g = GUIDES[id]; if (!g.views.includes(view)) return []; const sh = g.build(f, view); return g.rule && errorBreaksRule(spec, error, g.rule) ? sh.map(x => x.k === 'line' ? { ...x, role: 'error' as const } : x) : sh; });
}

/** Grupy reguł i błędów rodzin (data/zrodla/figury-sens.json → lib/figures/v2/grupy.json, generuje scripts/zrodla-runtime.mjs): reguła → grupa, id wskazówki błędu → grupa reguł, które ten błąd łamie. */
/* eslint-disable-next-line @typescript-eslint/no-var-requires */
export const GROUP_DATA: Record<string, { reguly: Record<string, string>; bledy: Record<string, string> }> = require('./grupy.json');
/** Czy błąd łamie regułę elementu nakładki: grupa błędu (grupy_bledow wskazówki) = grupa reguły; bez wpisu — nie (W2b: kolor danger tylko dla elementu reguły złamanej przez błąd). */
export function errorBreaksRule(spec: FigureSpec, error: FigError | undefined, rule: string): boolean {
  if (!error || !Object.prototype.hasOwnProperty.call(GROUP_DATA, spec.family)) return false;
  const def = errorDefOf(spec, error); if (!def) return false; const g = GROUP_DATA[spec.family];
  const eg = Object.prototype.hasOwnProperty.call(g.bledy, def.cue[0]) ? g.bledy[def.cue[0]] : undefined;
  const rg = Object.prototype.hasOwnProperty.call(g.reguly, rule) ? g.reguly[rule] : undefined;
  return !!eg && eg === rg;
}
/** Elementy nakładki techniki (E1 linia przez kończynę, E2 łuk kąta, odwiedzenie ramienia) w klatce u i widoku; `ids` = id elementów dopuszczonych przez wskazówki ćwiczenia (ui.techniquesOf). Bez liczb. `guides` = linie odniesienia pokazane w tym rzucie: wchodzą do limitu linii (W3). */
export function overlayShapes(spec: FigureSpec, u: number, view: View, ids: string[], error?: FigError, guides: GuideId[] = []): Shape[] {
  const defs = ids.map(techniqueDef).filter((d): d is TechniqueDef => !!d); if (!defs.length) return [];
  const f = frameAt(spec, u, error);
  return techniqueShapes(f.sk, view, defs, { joint: measuredJoint(spec), side: view === 'top' ? 'R' : measuredSide(spec), limbShown: angleLineShown(spec), danger: rule => errorBreaksRule(spec, error, rule), u, guideLines: guideShapes(spec, u, view, guides, error).filter(x => x.k === 'line').length });
}
