/*
 * Figury v2 — linie odniesienia i tor ruchu. ZASADA (decyzja właściciela 25.10.2026): linie BEZ liczb i tylko tam, gdzie wskazówka ma źródło — każda linia jest
 * związana z id wskazówki (`cue`), a UI pokazuje ją tylko, gdy wskazówka należy do zestawu ćwiczenia (własne lib/cues albo ogólny cue-sets.json). Tor ruchu to
 * narysowana droga środka ciężaru/dłoni (geometria rysunku, nie twierdzenie).
 */
import type { V2 } from './math';
import { proj } from './draw';
import { BODY } from './skeleton';
import type { Frame, Shape, View } from './scene';

export type GuideId = 'thighParallel' | 'plumbMidfoot' | 'kneeToe' | 'backLine' | 'elbows45';
export type GuideDef = { id: GuideId; cue: string[]; views: View[]; build: (f: Frame, view: View) => Shape[] };

const dash = (a: V2, b: V2, id: string): Shape => ({ k: 'line', a, b, w: 0.9, role: 'guide', dash: [3, 2.2], z: 4000, id });

export const GUIDES: Record<GuideId, GuideDef> = {
  /** „co najmniej do równoległego ud” (sq.depth): pozioma linia na wysokości kolana — na dole przysiadu uda leżą na niej. */
  thighParallel: { id: 'thighParallel', cue: ['sq.depth'], views: ['side'], build: (f, v) => { const k = proj(f.sk.legs.R.knee, v), h = proj(f.sk.legs.R.hip, v); return [dash([Math.min(h[0], k[0]) - 14, k[1]], [Math.max(h[0], k[0]) + 14, k[1]], 'guideThigh')]; } },
  /** „sztanga tuż przy piszczelach, nad środkiem stopy” (dl.feet): pionowa linia przez środek stopy. */
  plumbMidfoot: { id: 'plumbMidfoot', cue: ['dl.feet'], views: ['side'], build: (f, v) => { const m = f.info.midfoot ? proj(f.info.midfoot, v) : null; return m ? [dash([m[0], 0], [m[0], 150], 'guidePlumb')] : []; } },
  /** „kolana idą w linii palców stóp” (sq.kneesToes): pionowa linia przez palce każdej stopy (widok z przodu). */
  kneeToe: { id: 'kneeToe', cue: ['sq.kneesToes'], views: ['front'], build: (f, v) => (['R', 'L'] as const).map(s => { const t = proj(f.sk.legs[s].toe, v), k = proj(f.sk.legs[s].knee, v); return dash([t[0], 0], [t[0], k[1] + 12], 'guideKnee' + s); }) },
  /** „plecy proste (neutralne) przez cały ruch” (hinge.back): prosta od miednicy przez bark do głowy. */
  backLine: { id: 'backLine', cue: ['hinge.back'], views: ['side'], build: (f, v) => { const p = proj(f.sk.pelvis, v), s = proj(f.sk.shoulderC, v); const d: V2 = [s[0] - p[0], s[1] - p[1]]; const L = Math.hypot(d[0], d[1]) || 1; const e = (BODY.trunk + 30) / L; return [dash([p[0] - d[0] * 0.25, p[1] - d[1] * 0.25], [p[0] + d[0] * e, p[1] + d[1] * e], 'guideBack')]; } },
  /**
   * „łokcie ok. 45° od tułowia” (decyzja właściciela 25.10.2026; dane: docs/research katy-oddech.json, bp.elbowsAngle — Stronger by Science „How to Bench” (45–60°), Catalyst Athletics (do ok. 45°),
   * NSCA Basics 2012 s. 55 (45°); wybrane „ok. 45°”): w widoku z góry promień 45° od osi tułowia na zewnątrz, od każdego barku. Linia nie jest wiązana z id wskazówki (brak tekstu wskazówki) — pokazuje ją ui.guidesOf dla ELBOW45_KEYS.
   */
  elbows45: { id: 'elbows45', cue: ['bp.elbowsAngle'], views: ['top'], build: (f, v) => (['R', 'L'] as const).map(s => {
    const sh = f.sk.arms[s].shoulder; const hip = f.sk.pelvis; const dx = Math.sign(hip[0] - sh[0]) || 1;
    const c = Math.SQRT1_2, L = 34; const end: [number, number, number] = [sh[0] + dx * c * L, sh[1], sh[2] + (s === 'R' ? 1 : -1) * c * L];
    return dash(proj(sh, v), proj(end, v), 'guideElbows45'); }) },
};

/** Ćwiczenia, przy których pokazujemy łokcie „ok. 45°” (wyciskanie sztangi i hantli na płasko i skosie; nie pompki — źródła się spierają). Rig ma dla nich `flare` dobrane tak, by kąt na dole wynosił 45° (test). */
export const ELBOW45_KEYS: ReadonlySet<string> = new Set(['Bench Press (sztanga)', 'Bench Press (hantle)', 'Incline Bench Press (sztanga)', 'Incline Bench Press (hantle)']);

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
  return out;
}
