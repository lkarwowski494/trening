/*
 * Figury v2 — API figury ćwiczenia: specyfikacja z klucza katalogu, klatka w chwili u (0–1), kształty 2D w widoku, wspólny kadr.
 * Statyczne (izometria, np. siad przy ścianie) = jedna pozycja końcowa bez animacji.
 */
import { CATALOG } from '../../catalog.generated';
import { FAMILY, familyOf, type FamilyId } from './families';
import { VARIANTS, type Variant } from './variants';
import { squatFrame } from './rigs/squat';
import { benchFrame } from './rigs/benchPress';
import { hingeFrame } from './rigs/hinge';
import { bodyShapes, propShapes } from './draw';
import { boundsOf, type Box } from './render';
import { muscleShapes } from './muscles';
import { MUSCLE_DATA, type MuscleEntry } from './muscles.generated';
import type { Frame, Shape, View } from './scene';

export type FigureSpec = { key: string; family: FamilyId; variant: Variant; views: View[]; static: boolean; lowerFirst: boolean };

/** Specyfikacja figury ćwiczenia; null, gdy rodzina ćwiczenia nie jest jeszcze gotowa (status „planned”) albo klucza nie ma w katalogu. */
export function figureSpec(key: string): FigureSpec | null {
  if (!Object.prototype.hasOwnProperty.call(CATALOG, key)) return null;
  const family = familyOf(key); const fam = FAMILY[family];
  if (fam.status !== 'ready') return null;
  const variant = Object.prototype.hasOwnProperty.call(VARIANTS, key) ? VARIANTS[key] : null;
  if (!variant || variant.family !== family) return null;
  const lowerFirst = variant.family === 'hinge' ? variant.lowerFirst : true;
  return { key, family, variant, views: fam.views, static: variant.family === 'squat' && !!variant.static, lowerFirst };
}

/** Klatka figury w pozycji u (0 = wyjściowa, 1 = skrajna). */
export function frameAt(spec: FigureSpec, u: number): Frame {
  const v = spec.variant;
  return v.family === 'squat' ? squatFrame(v.p, u) : v.family === 'bench_press' ? benchFrame(v.p, u) : hingeFrame(v.p, u);
}

/** Pozycje u rysowane statycznie (Ogranicz ruch, pauza): start i koniec (jedna dla izometrii). */
export const staticPositions = (spec: FigureSpec): number[] => spec.static ? [1] : [0, 1];

/** Udział mięśni w ćwiczeniu z katalogu (docs/research/equipment/catalog.json → muscleLoad) wraz z pewnością; null, gdy brak. */
export function musclesFor(key: string): MuscleEntry | null { return Object.prototype.hasOwnProperty.call(MUSCLE_DATA, key) ? MUSCLE_DATA[key] : null; }

/** Kształty klatki w widoku (ciało + sprzęt + opcjonalnie podświetlenie mięśni; nieposortowane — sortuje renderer). */
export function shapesAt(spec: FigureSpec, u: number, view: View, muscles = false): Shape[] {
  const f = frameAt(spec, u); const out = [...bodyShapes(f.sk, view), ...propShapes(f.props, view)];
  if (muscles) { const m = musclesFor(spec.key); if (m) out.push(...muscleShapes(f.sk, view, m.load)); }
  return out;
}

const boxCache = new Map<string, Box>();
/** Wspólny kadr całej pętli (próbkowanie co 1/20): rysunek nie skacze między klatkami. */
export function boxFor(spec: FigureSpec, view: View): Box {
  const id = spec.key + '|' + view; const hit = boxCache.get(id); if (hit) return hit;
  const lists: Shape[][] = []; for (let i = 0; i <= 20; i++) lists.push(shapesAt(spec, spec.static ? 1 : i / 20, view));
  const b = boundsOf(lists); boxCache.set(id, b); return b;
}
