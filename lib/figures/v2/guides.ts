/*
 * Figury v2 — linie odniesienia i tor ruchu. ZASADA (decyzja właściciela 25.10.2026): linie BEZ liczb i tylko tam, gdzie wskazówka ma źródło — każda linia jest
 * związana z id wskazówki (`cue`), a UI pokazuje ją tylko, gdy wskazówka należy do zestawu ćwiczenia (własne lib/cues albo ogólny cue-sets.json). Tor ruchu to
 * narysowana droga środka ciężaru/dłoni (geometria rysunku, nie twierdzenie).
 */
import type { V2 } from './math';
import { proj } from './draw';
import { SQUAT_GUIDES } from './overlay/squat';
import { HINGE_GUIDES } from './overlay/hinge';
import type { Frame, Shape, View } from './scene';

/** Wielkość grota na końcach toru (cm rysunku). */
export const TRAIL_ARROW = 4.2;
export type GuideId = 'thighParallel' | 'plumbMidfoot' | 'kneeToe' | 'backLine';
export type GuideDef = { id: GuideId; cue: string[]; views: View[]; /** reguła z data/zrodla/figury-sens.json (rodziny, w której linia jest pokazana) — przy błędzie łamiącym jej grupę linia jest w kolorze błędu; brak = linia nigdy nie jest czerwona (reguła nie „ustalone” albo bez odpowiednika) */ rule?: string; build: (f: Frame, view: View) => Shape[] };

/** Linie odniesienia z danych rodzin (overlay/<rodzina>.ts) — jedno miejsce złożenia; kolejność = kolejność rodzin. */
const ALL_GUIDES = [...SQUAT_GUIDES, ...HINGE_GUIDES];
export const GUIDES: Record<GuideId, GuideDef> = Object.fromEntries((['thighParallel', 'plumbMidfoot', 'kneeToe', 'backLine'] as GuideId[]).map(id => [id, ALL_GUIDES.find(g => g.id === id)])) as Record<GuideId, GuideDef>;

/** Linie odniesienia, które wolno pokazać przy zestawie wskazówek ćwiczenia (id wskazówek własnych i ogólnych). */
export function guidesFor(cueIds: Iterable<string>): GuideId[] {
  const have = new Set(cueIds); return (Object.values(GUIDES) as GuideDef[]).filter(g => g.cue.some(c => have.has(c))).map(g => g.id);
}

/** Tor ruchu: łamana przez położenia środka ciężaru/dłoni w kolejnych pozycjach (z `frames`), znacznik startu. */
export function trailShapes(frames: Frame[], view: View): Shape[] {
  const pts = frames.map(f => f.info.trail ?? f.info.load).filter((p): p is NonNullable<typeof p> => !!p).map(p => proj(p, view));
  if (pts.length < 2) return [];
  const out: Shape[] = [];
  for (let i = 1; i < pts.length; i++) out.push({ k: 'line', a: pts[i - 1], b: pts[i], w: 0.8, role: 'guide', dash: [1.6, 1.6], alpha: 0.9, z: 3900, id: 'trail' });
  out.push({ k: 'circle', c: pts[0], r: 2.2, fill: 'guide', a: 0.9, z: 3901, id: 'trailStart' });
  /* grot na obu końcach (jak w makiecie właściciela): na końcu u = 1 w stronę pierwszej fazy, na początku w stronę powrotu */
  const k = Math.min(3, pts.length - 1);
  const arrow = (tip: V2, from: V2): Shape[] => {
    const dx = tip[0] - from[0], dy = tip[1] - from[1], L = Math.hypot(dx, dy); if (L < 1e-6) return [];
    const ux = dx / L, uy = dy / L, h = TRAIL_ARROW, w = h * 0.55;
    return [{ k: 'poly', pts: [tip, [tip[0] - ux * h - uy * w, tip[1] - uy * h + ux * w], [tip[0] - ux * h + uy * w, tip[1] - uy * h - ux * w]], fill: 'guide', a: 0.95, close: true, z: 3902, id: 'trailArrow' }];
  };
  out.push(...arrow(pts[pts.length - 1], pts[pts.length - 1 - k]), ...arrow(pts[0], pts[k]));
  return out;
}
