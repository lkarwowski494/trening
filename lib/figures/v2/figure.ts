/*
 * Figury v2 — API figury ćwiczenia: specyfikacja z klucza katalogu, klatka w chwili u (0–1), kształty 2D w widoku, wspólny kadr.
 * Statyczne (izometria, np. siad przy ścianie) = jedna pozycja końcowa bez animacji.
 */
import { CATALOG } from '../../catalog.generated';
import { FAMILY, familyOf, viewsOf, type FamilyId } from './families';
import { dzwigniaPrzezGlowe } from './leverGuard';
import { VARIANTS, type Variant } from './variants';
import { squatFrame } from './rigs/squat';
import { benchFrame } from './rigs/benchPress';
import { hingeFrame } from './rigs/hinge';
import { bodyShapes, propShapes, proj } from './draw';
import { boundsOf, type Box } from './render';
import { muscleShapes } from './muscles';
import { MUSCLE_DATA, type MuscleEntry } from './muscles.generated';
import type { Frame, Shape, View } from './scene';
import { SIDES, jointAngles, type Side } from './skeleton';
import type { V3 } from './math';
import { GUIDES, trailShapes, type GuideId } from './guides';
import { phasesOf, walkPhases, TEMPO, type Tempo, type Phase, type PhaseNames } from './anim';
import { ERRORS, isDataError, dataErrorIndex, type ErrorId, type FigError, type AnyErrorDef, type Fault } from './errors';
import { keyframeFrame, poseLoopSpan, type LoopMode } from './contract';
import { contactGlows, type ContactId } from './contacts';
import { DATA_UI, GAIT_UI, ISOMETRIC, MEASURE_UNIT, MIN_MEASURED_ROM, dataUiForPose, poseDataFor, type MeasuredJoint } from './poseData';
import { ease } from './rigs/common';

export type FigureSpec = { key: string; family: FamilyId; variant: Variant; views: View[]; static: boolean; lowerFirst: boolean };

/** Specyfikacja figury ćwiczenia; null, gdy rodzina ćwiczenia nie jest jeszcze gotowa (status „planned”), klucza nie ma w katalogu albo ćwiczenie rodziny z danymi nie ma wpisu w pliku póz. */
export function figureSpec(key: string): FigureSpec | null {
  if (!Object.prototype.hasOwnProperty.call(CATALOG, key)) return null;
  const family = familyOf(key); const fam = FAMILY[family];
  if (fam.status !== 'ready') return null;
  const data = poseDataFor(key, family); const ui = data ? dataUiForPose(family, data) : null;
  if (data && ui) return { key, family, variant: { family, data } as Variant, views: viewsOf(key, family), static: ISOMETRIC.has(key), lowerFirst: ui.lowerFirst };
  const variant = Object.prototype.hasOwnProperty.call(VARIANTS, key) ? VARIANTS[key] : null;
  if (!variant || variant.family !== family || 'data' in variant) return null;
  const lowerFirst = variant.family === 'hinge' ? variant.lowerFirst : true;
  return { key, family, variant, views: viewsOf(key, family), static: variant.family === 'squat' && !!variant.static, lowerFirst };
}

/* Podręczna pamięć klatek: w jednym kroku animacji ta sama klatka jest potrzebna kilka razy (kształty, linie odniesienia, styki, znaczki, oba widoki) — liczymy ją raz. Klatki są niezmienne. */
const FRAME_CACHE = new Map<string, Frame>(); const FRAME_CACHE_MAX = 48;
/** Klatka figury w pozycji u (0 = wyjściowa, 1 = skrajna). */
export function frameAt(spec: FigureSpec, u: number, error?: FigError): Frame {
  const id = spec.key + '|' + u + '|' + (error ?? ''); const hit = FRAME_CACHE.get(id); if (hit) return hit;
  const f = computeFrame(spec, u, error); if (FRAME_CACHE.size >= FRAME_CACHE_MAX) FRAME_CACHE.clear(); FRAME_CACHE.set(id, f); return f;
}
function computeFrame(spec: FigureSpec, u: number, error?: FigError): Frame {
  const v = spec.variant;
  if ('data' in v) return keyframeFrame(v.data, u, error && isDataError(error) ? dataErrorIndex(error) : undefined);
  const fault = error && !isDataError(error) ? faultFor(spec, error, u) : undefined;
  return v.family === 'squat' ? squatFrame(v.p, u, fault) : v.family === 'bench_press' ? benchFrame(v.p, u, fault) : hingeFrame(v.p, u, fault);
}

/** Waga błędu w pozycji u: rośnie z postępem ruchu (z podłogi: największa tuż po oderwaniu ciężaru, maleje ku wyprostowi). */
export function faultWeight(spec: FigureSpec, u: number): number {
  const v = spec.variant; return v.family === 'hinge' && v.p.style === 'floor' ? 1 - 0.6 * ease(u) : ease(u);
}
/** Czy błąd da się pokazać pozą w tym wariancie (np. „pięty” nie dotyczą siadu przy ścianie, „kolana jak w przysiadzie” tylko RDL ze sztywnymi kolanami). */
export function faultApplicable(spec: FigureSpec, error: FigError): boolean {
  const v = spec.variant;
  /* rodzina z danych: błędy to wpisy bledy[] ćwiczenia (poza = poprawna + delty); z rigowych tylko błąd tempa („szarpanie”) */
  if ('data' in v) return isDataError(error) ? dataErrorIndex(error) < v.data.bledy.length : error === 'jerk';
  if (isDataError(error)) return false;
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

/** Ustawienia prezentacji ćwiczenia z danych: wpis rodziny (DATA_UI) z wyjątkiem ćwiczenia; null dla rodzin z rigiem. */
function dataUiOf(spec: FigureSpec): { names: PhaseNames; joints: readonly MeasuredJoint[]; hideAngle: boolean; walk: boolean } | null {
  if (!('data' in spec.variant)) return null;
  const u = DATA_UI[spec.family] ?? GAIT_UI; const x = u.exceptions && Object.prototype.hasOwnProperty.call(u.exceptions, spec.key) ? u.exceptions[spec.key] : undefined;
  return { names: x?.names ?? u.names, joints: x?.joints ?? u.joints, hideAngle: !!x?.hideAngle, walk: !!u.walk || loopOf(spec) === 'cykl_lustro' };
}
/** Pomiar na rysunku (decyzja właściciela 25.10.2026: kąt jako opis figury, nie zalecenie). Rig: przysiad — kolano, wyciskanie — łokieć, zawias — biodro (średnia obu stron). Dane (27.10.2026, S2): spośród stawów rodziny
 * pokazujemy ten, który w ćwiczeniu rusza się najbardziej, i tę stronę, która pracuje (największy zakres; przy równych — prawa), więc ćwiczenie jednoręczne nie dostaje średniej z ręką nieruchomą;
 * linia jest pokazana tylko, gdy zakres > MIN_MEASURED_ROM (izometria: zawsze, bo nic się nie rusza) i ćwiczenie nie ma wyjątku „ukryj”. */
type Measure = { joint: MeasuredJoint; sides: readonly Side[]; shown: boolean };
const MEASURE_CACHE = new Map<string, Measure>(); const MEASURE_SAMPLES = 24;
function measureOf(spec: FigureSpec): Measure {
  const id = spec.family + '|' + spec.key; const hit = MEASURE_CACHE.get(id); if (hit) return hit;
  const ui = dataUiOf(spec); let m: Measure;
  if (!ui) m = { joint: spec.family === 'bench_press' ? 'elbow' : spec.family === 'hinge' ? 'hip' : 'knee', sides: SIDES, shown: true };
  else {
    const frames = Array.from({ length: MEASURE_SAMPLES + 1 }, (_, i) => computeFrame(spec, loopSpan(spec) * i / MEASURE_SAMPLES));
    const candidates = spec.static ? ui.joints.slice(0, 1) : ui.joints; let best = { joint: ui.joints[0], side: SIDES[0], range: -1 };
    for (const joint of candidates) for (const side of SIDES) { const a = frames.map(f => jointAngles(f.sk, side)[joint]); const range = Math.max(...a) - Math.min(...a); if (range > best.range + 1e-9) best = { joint, side, range }; }
    m = { joint: best.joint, sides: [best.side], shown: !ui.hideAngle && (spec.static || best.range > MIN_MEASURED_ROM[MEASURE_UNIT[best.joint]]) };
  }
  MEASURE_CACHE.set(id, m); return m;
}
/** Staw mierzony na rysunku. */
export const measuredJoint = (spec: FigureSpec): MeasuredJoint => measureOf(spec).joint;
/** Czy pokazać linię pomiaru: mierzony staw rusza się w ćwiczeniu o więcej niż próg (MIN_MEASURED_ROM). */
export const angleLineShown = (spec: FigureSpec): boolean => measureOf(spec).shown;
/** Wartość mierzona (stopnie: zgięcie dodatnie, wyprost ujemny, konwencja docs/research/28; cm: przesunięcie barków) POLICZONA Z GEOMETRII klatki w pozycji u. `deg` ma jednostkę `unit`. */
export function measuredAngle(spec: FigureSpec, u: number, error?: FigError): { joint: MeasuredJoint; deg: number; unit: 'deg' | 'cm' } {
  const f = frameAt(spec, u, error); const m = measureOf(spec); const a = m.sides.map(s => jointAngles(f.sk, s)[m.joint]);
  return { joint: m.joint, deg: a.reduce((x, y) => x + y, 0) / a.length, unit: MEASURE_UNIT[m.joint] };
}

/** Tryb pętli figury: cykl_lustro tylko dla ćwiczeń z danych z polem `petla` (marsz); reszta wahadło. */
export const loopOf = (spec: FigureSpec): LoopMode => 'data' in spec.variant && spec.variant.data.petla === 'cykl_lustro' ? 'cykl_lustro' : 'wahadlo';
/** Zakres pozycji u pętli: 2 w trybie cyklicznym (druga połowa w lustrze), 1 w wahadle. */
export const loopSpan = (spec: FigureSpec): number => 'data' in spec.variant ? poseLoopSpan(spec.variant.data) : 1;

/** Pozycje u rysowane statycznie (Ogranicz ruch, pauza): start i koniec (jedna dla izometrii). */
export const staticPositions = (spec: FigureSpec): number[] => spec.static ? [1] : [0, 1];

/** Udział mięśni w ćwiczeniu z katalogu (docs/research/equipment/catalog.json → muscleLoad) wraz z pewnością; null, gdy brak. */
export function musclesFor(key: string): MuscleEntry | null { return Object.prototype.hasOwnProperty.call(MUSCLE_DATA, key) ? MUSCLE_DATA[key] : null; }

/** Kształty klatki w widoku (ciało + sprzęt + opcjonalnie podświetlenie mięśni; nieposortowane — sortuje renderer). */
export function shapesAt(spec: FigureSpec, u: number, view: View, muscles = false, error?: FigError): Shape[] {
  const f = frameAt(spec, u, error); const out = [...bodyShapes(f.sk, view), ...propShapes(f.props, view, 'data' in spec.variant && dzwigniaPrzezGlowe(spec.variant.data))];
  if (muscles) { const m = musclesFor(spec.key); if (m) out.push(...muscleShapes(f.sk, view, m.load)); }
  if (error) out.push(...errorMarks(f, view, error, spec));
  return out;
}

/** Opis błędu rysunku: rigowy z ERRORS, z danych — z wpisu bledy[] ćwiczenia (poza = poprawna + delty, znacznik i deklarowane wielkości z danych). */
export function errorDefOf(spec: FigureSpec | undefined, error: FigError): AnyErrorDef | null {
  if (!isDataError(error)) return ERRORS[error];
  const v = spec?.variant; const b = v && 'data' in v ? v.data.bledy[dataErrorIndex(error)] : undefined; if (!b) return null;
  return { id: error, cue: [b.cue], kind: 'pose', mods: {}, affects: b.dotyczy, mark: b.znacznik, why: b.cue };
}

/** Znacznik ✕ w miejscu błędu (kolana, pięty, plecy, miednica, gryf) — rola „error” (token danger), nad wszystkim. */
export function markPoints(f: Frame, view: View, mark: AnyErrorDef['mark']): V3[] {
  const pts: V3[] = []; const sk = f.sk;
  switch (mark) {
    case 'knees': pts.push(sk.legs.R.knee, ...(view === 'side' ? [] : [sk.legs.L.knee])); break;
    case 'heels': pts.push(sk.legs.R.heel, ...(view === 'side' ? [] : [sk.legs.L.heel])); break;
    case 'back': pts.push(sk.spineMid); break;
    case 'pelvis': pts.push(sk.pelvis); break;
    case 'bar': pts.push(f.info.load ?? sk.pelvis); break;
  }
  return pts;
}
export function errorMarks(f: Frame, view: View, error: FigError, spec?: FigureSpec): Shape[] {
  const def = errorDefOf(spec, error); if (!def) return []; const pts = markPoints(f, view, def.mark);
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
export function boxFor(spec: FigureSpec, view: View, errors: FigError[] = []): Box {
  const id = spec.key + '|' + view + '|' + errors.join(','); const hit = boxCache.get(id); if (hit) return hit;
  const lists: Shape[][] = []; for (const e of [undefined, ...errors.filter(x => errorDefOf(spec, x)?.kind === 'pose')]) for (let i = 0; i <= 20; i++) lists.push(shapesAt(spec, spec.static ? 1 : loopSpan(spec) * i / 20, view, false, e));
  const b = boundsOf(lists); boxCache.set(id, b); return b;
}

/** Nazwy faz licznika tempa dla ćwiczenia (klucze t()). */
export function phaseNames(spec: FigureSpec): PhaseNames {
  const v = spec.variant;
  if ('data' in v) return dataUiOf(spec)!.names;
  if (v.family === 'bench_press') return { first: 'Opuszczanie', second: 'Wypychanie' };
  if (v.family === 'hinge') return v.p.style === 'floor' ? { first: 'Podnoszenie', second: 'Opuszczanie' } : { first: 'Opuszczanie', second: 'Prostowanie' };
  return { first: 'Opuszczanie', second: 'Wstawanie' };
}
/** Fazy pętli ćwiczenia z czasami (tempo ilustracyjne; błąd tempa podaje własne czasy). */
/** Tempo figury: z błędu tempa albo domyślne; przysiad bez pauzy na dole (NSCA Basics 2012 s. 49–50; pauza 0,5 s to konwencja bez źródła). */
export const tempoFor = (spec: FigureSpec, error?: FigError): Tempo => ({ ...(error && !isDataError(error) ? ERRORS[error].mods.tempo : undefined) ?? TEMPO, ...(spec.family === 'squat' && !spec.static ? { holdLowMs: 0 } : {}) });
export const phasesFor = (spec: FigureSpec, tempo?: Tempo): Phase[] => dataUiOf(spec)?.walk ? walkPhases(tempo) : phasesOf(phaseNames(spec), spec.lowerFirst, tempo);

const trailCache = new Map<string, Shape[]>();
/** Tor ruchu środka ciężaru/dłoni w widoku (próbkowanie co 1/24; cache). */
export function trailFor(spec: FigureSpec, view: View): Shape[] {
  const id = spec.key + '|' + view; const hit = trailCache.get(id); if (hit) return hit;
  const fr: Frame[] = []; for (let i = 0; i <= 24; i++) fr.push(frameAt(spec, spec.static ? 1 : loopSpan(spec) * i / 24));
  const out = spec.static ? [] : trailShapes(fr, view); trailCache.set(id, out); return out;
}
/** Linie odniesienia dla pozycji u (tylko z wskazanych id i widoków, w których linia ma sens). */
export function guideShapes(spec: FigureSpec, u: number, view: View, ids: GuideId[], error?: FigError): Shape[] {
  const f = frameAt(spec, u, error); return ids.flatMap(id => GUIDES[id].views.includes(view) ? GUIDES[id].build(f, view) : []);
}

/** Poświaty stref styku klatki (poza poprawna: styki „dobrze”; poza błędu: styk utracony względem pozy poprawnej w tej samej pozycji — „błąd”). Poza kadrem `shapesAt`. */
export function contactShapes(spec: FigureSpec, u: number, view: View, error?: FigError): Shape[] {
  const f = frameAt(spec, u, error); const pose = error && errorDefOf(spec, error)?.kind === 'pose';
  return contactGlows(f, view, pose ? frameAt(spec, u) : undefined);
}

/** Styki wymagane w pozie poprawnej: dane z data/zrodla/figury-sens.json (sekcja „styki”; runtime styki.json, generuje scripts/zrodla-runtime.mjs). */
/* eslint-disable-next-line @typescript-eslint/no-var-requires */
export const REQUIRED_DATA: Record<string, { wymagane: ContactId[]; pomijane_gdy?: Record<string, ContactId[]> }> = require('./styki.json');
/** Nazwane warunki wariantu, przy których odpadają wymagane styki: ławka ujemna (stopy pod wałkami), zawias jednonóż (stopa wolna), podciąganie jednorącz (ręka wolna). */
export function contactConditions(spec: FigureSpec): string[] {
  const v = spec.variant;
  if ('data' in v) { const bar = v.data.sprzet.find(g => g.rodzaj === 'sztanga'); return bar?.trzyma === 'R' ? ['jednorecz_R'] : bar?.trzyma === 'L' ? ['jednorecz_L'] : []; }
  if (v.family === 'bench_press') return v.p.angle < 0 ? ['lawka_ujemna'] : [];
  if (v.family === 'hinge') return v.p.style === 'singleLeg' ? ['jednonoz'] : [];
  return [];
}
/** Styki wymagane w POZIE POPRAWNEJ rodziny (reguła sensu, docs/53) — z danych REQUIRED_DATA po odjęciu pominięć warunków wariantu; rodzina bez wpisu: brak wymagań. */
export function requiredContacts(spec: FigureSpec): ContactId[] {
  const r = Object.prototype.hasOwnProperty.call(REQUIRED_DATA, spec.family) ? REQUIRED_DATA[spec.family] : null; if (!r) return [];
  const skip = new Set(contactConditions(spec).flatMap(c => r.pomijane_gdy?.[c] ?? []));
  return r.wymagane.filter(c => !skip.has(c));
}
