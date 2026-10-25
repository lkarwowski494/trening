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
import { bodyShapes, propShapes, proj } from './draw';
import { boundsOf, type Box } from './render';
import { muscleShapes } from './muscles';
import { MUSCLE_DATA, type MuscleEntry } from './muscles.generated';
import type { Frame, Shape, View } from './scene';
import type { V3 } from './math';
import { GUIDES, trailShapes, type GuideId } from './guides';
import { phasesOf, TEMPO, type Tempo, type Phase, type PhaseNames } from './anim';
import { ERRORS, type ErrorId, type Fault } from './errors';
import { ease } from './rigs/common';

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
export function frameAt(spec: FigureSpec, u: number, error?: ErrorId): Frame {
  const v = spec.variant; const fault = error ? faultFor(spec, error, u) : undefined;
  return v.family === 'squat' ? squatFrame(v.p, u, fault) : v.family === 'bench_press' ? benchFrame(v.p, u, fault) : hingeFrame(v.p, u, fault);
}

/** Waga błędu w pozycji u: rośnie z postępem ruchu (z podłogi: największa tuż po oderwaniu ciężaru, maleje ku wyprostowi). */
export function faultWeight(spec: FigureSpec, u: number): number {
  const v = spec.variant; return v.family === 'hinge' && v.p.style === 'floor' ? 1 - 0.6 * ease(u) : ease(u);
}
/** Czy błąd da się pokazać pozą w tym wariancie (np. „pięty” nie dotyczą siadu przy ścianie, „kolana jak w przysiadzie” tylko RDL ze sztywnymi kolanami). */
export function faultApplicable(spec: FigureSpec, error: ErrorId): boolean {
  const v = spec.variant;
  switch (error) {
    case 'kneesIn': return v.family === 'squat' && !v.p.wall && v.p.stance < 30 && v.p.load !== 'dbSumo';
    case 'heels': return v.family === 'squat' && !v.p.wall;
    case 'roundBack': return v.family === 'hinge' || (v.family === 'squat' && v.p.load === 'behind');
    case 'arch': return v.family === 'bench_press' && !v.p.floor && v.p.touch < 55;
    case 'barAway': return v.family === 'hinge' && v.p.style === 'floor' && (v.p.impl === 'barbell' || v.p.impl === 'cable');
    case 'kneesBent': return v.family === 'hinge' && v.p.style === 'rdl';
    case 'jerk': return true;
  }
}
function faultFor(spec: FigureSpec, error: ErrorId, u: number): Fault { return { m: ERRORS[error].mods, w: faultWeight(spec, u) }; }

/** Pozycje u rysowane statycznie (Ogranicz ruch, pauza): start i koniec (jedna dla izometrii). */
export const staticPositions = (spec: FigureSpec): number[] => spec.static ? [1] : [0, 1];

/** Udział mięśni w ćwiczeniu z katalogu (docs/research/equipment/catalog.json → muscleLoad) wraz z pewnością; null, gdy brak. */
export function musclesFor(key: string): MuscleEntry | null { return Object.prototype.hasOwnProperty.call(MUSCLE_DATA, key) ? MUSCLE_DATA[key] : null; }

/** Kształty klatki w widoku (ciało + sprzęt + opcjonalnie podświetlenie mięśni; nieposortowane — sortuje renderer). */
export function shapesAt(spec: FigureSpec, u: number, view: View, muscles = false, error?: ErrorId): Shape[] {
  const f = frameAt(spec, u, error); const out = [...bodyShapes(f.sk, view), ...propShapes(f.props, view)];
  if (muscles) { const m = musclesFor(spec.key); if (m) out.push(...muscleShapes(f.sk, view, m.load)); }
  if (error) out.push(...errorMarks(f, view, error));
  return out;
}

/** Znacznik ✕ w miejscu błędu (kolana, pięty, plecy, miednica, gryf) — rola „error” (token danger), nad wszystkim. */
export function errorMarks(f: Frame, view: View, error: ErrorId): Shape[] {
  const pts: V3[] = []; const sk = f.sk;
  switch (ERRORS[error].mark) {
    case 'knees': pts.push(sk.legs.R.knee, ...(view === 'side' ? [] : [sk.legs.L.knee])); break;
    case 'heels': pts.push(sk.legs.R.heel, ...(view === 'side' ? [] : [sk.legs.L.heel])); break;
    case 'back': pts.push(sk.spineMid); break;
    case 'pelvis': pts.push(sk.pelvis); break;
    case 'bar': pts.push(f.info.load ?? sk.pelvis); break;
  }
  const out: Shape[] = [];
  for (const p of pts) {
    const c = proj(p, view); const r = 6;
    out.push({ k: 'circle', c, r: r + 1.6, fill: 'skinHi', a: 0.92, stroke: 'error', w: 1.2, z: 5000, id: 'errorRing' });
    out.push({ k: 'line', a: [c[0] - r * 0.6, c[1] - r * 0.6], b: [c[0] + r * 0.6, c[1] + r * 0.6], w: 2, role: 'error', z: 5001, id: 'errorMark' });
    out.push({ k: 'line', a: [c[0] - r * 0.6, c[1] + r * 0.6], b: [c[0] + r * 0.6, c[1] - r * 0.6], w: 2, role: 'error', z: 5001, id: 'errorMark' });
  }
  return out;
}

const boxCache = new Map<string, Box>();
/** Wspólny kadr całej pętli (próbkowanie co 1/20; z pozami błędów, żeby przełączenie błędu nie zmieniało kadru): rysunek nie skacze między klatkami. */
export function boxFor(spec: FigureSpec, view: View, errors: ErrorId[] = []): Box {
  const id = spec.key + '|' + view + '|' + errors.join(','); const hit = boxCache.get(id); if (hit) return hit;
  const lists: Shape[][] = []; for (const e of [undefined, ...errors.filter(x => ERRORS[x].kind === 'pose')]) for (let i = 0; i <= 20; i++) lists.push(shapesAt(spec, spec.static ? 1 : i / 20, view, false, e));
  const b = boundsOf(lists); boxCache.set(id, b); return b;
}

/** Nazwy faz licznika tempa dla ćwiczenia (klucze t()). */
export function phaseNames(spec: FigureSpec): PhaseNames {
  const v = spec.variant;
  if (v.family === 'bench_press') return { first: 'Opuszczanie', second: 'Wypychanie' };
  if (v.family === 'hinge') return v.p.style === 'floor' ? { first: 'Podnoszenie', second: 'Opuszczanie' } : { first: 'Opuszczanie', second: 'Prostowanie' };
  return { first: 'Opuszczanie', second: 'Wstawanie' };
}
/** Fazy pętli ćwiczenia z czasami (tempo ilustracyjne; błąd tempa podaje własne czasy). */
/** Tempo figury: z błędu tempa albo domyślne; przysiad bez pauzy na dole (NSCA Basics 2012 s. 49–50; pauza 0,5 s to konwencja bez źródła). */
export const tempoFor = (spec: FigureSpec, error?: ErrorId): Tempo => ({ ...(error ? ERRORS[error].mods.tempo : undefined) ?? TEMPO, ...(spec.family === 'squat' && !spec.static ? { holdLowMs: 0 } : {}) });
export const phasesFor = (spec: FigureSpec, tempo?: Tempo): Phase[] => phasesOf(phaseNames(spec), spec.lowerFirst, tempo);

const trailCache = new Map<string, Shape[]>();
/** Tor ruchu środka ciężaru/dłoni w widoku (próbkowanie co 1/24; cache). */
export function trailFor(spec: FigureSpec, view: View): Shape[] {
  const id = spec.key + '|' + view; const hit = trailCache.get(id); if (hit) return hit;
  const fr: Frame[] = []; for (let i = 0; i <= 24; i++) fr.push(frameAt(spec, spec.static ? 1 : i / 24));
  const out = spec.static ? [] : trailShapes(fr, view); trailCache.set(id, out); return out;
}
/** Linie odniesienia dla pozycji u (tylko z wskazanych id i widoków, w których linia ma sens). */
export function guideShapes(spec: FigureSpec, u: number, view: View, ids: GuideId[], error?: ErrorId): Shape[] {
  const f = frameAt(spec, u, error); return ids.flatMap(id => GUIDES[id].views.includes(view) ? GUIDES[id].build(f, view) : []);
}
