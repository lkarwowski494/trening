/*
 * Figury v2 — znaczki ✓/✕ przy częściach ciała, powiązane ze wskazówkami (polecenie właściciela 26.10.2026). ✓: wskazówka techniki ćwiczenia (id z lib/cues albo zestawu ogólnego), która dotyczy
 * widocznej części ciała lub sprzętu, w pozie poprawnej; ✕: błąd w widoku błędu (znacznik ✕ błędu, figure.errorMarks). Powiązanie id wskazówki → część ciała to tablica CUE_ANCHOR (jedno miejsce);
 * wskazówka bez wpisu nie ma znaczka. Maks. BADGE_MAX znaczków naraz (czytelność na 390 px). Stuknięcie pokazuje tekst wskazówki (komponent), VoiceOver — etykieta z tekstem.
 */
import type { V2, V3 } from './math';
import { mul, sub } from './math';
import { proj } from './draw';
import type { Frame, Shape, View } from './scene';

export const BADGE_MAX = 3;
export type Anchor = 'knees' | 'heels' | 'back' | 'pelvis' | 'bar' | 'head' | 'shoulders' | 'elbows' | 'hands' | 'feet';
export const ANCHORS: Anchor[] = ['knees', 'heels', 'back', 'pelvis', 'bar', 'head', 'shoulders', 'elbows', 'hands', 'feet'];

/** Id wskazówki „ok” → część ciała, której dotyczy (✓ w pozie poprawnej). */
export const CUE_ANCHOR: Record<string, Anchor> = {
  'bp.contact': 'back', 'bp.blades': 'shoulders', 'bp.control': 'bar', 'bp.grip': 'hands', 'cgbp.grip': 'hands', 'dl.grip': 'hands', 'sumo.grip': 'hands', 'pu.grip': 'hands', 'cu.grip': 'hands', 'npu.hang': 'hands',
  'cgbp.elbows': 'elbows', 'pu.elbowsDown': 'elbows', 'fsq.elbows': 'elbows', 'lpd.fullStretch': 'elbows',
  'dl.close': 'bar', 'gob.close': 'bar', 'dl.feet': 'feet', 'sq.stance': 'feet', 'gob.stance': 'feet', 'sumo.stance': 'feet', 'pu.noSwing': 'feet',
  'hinge.back': 'back', 'sq.back': 'back', 'wall.back': 'back', 'gob.hold': 'bar',
  'sq.kneesToes': 'knees', 'sumo.kneesOut': 'knees', 'sq.kneesPast': 'knees',
  'sq.depth': 'pelvis', 'dl.lift': 'pelvis', 'rdl.depth': 'pelvis', 'dbdl.hips': 'pelvis', 'sumo.lift': 'pelvis', 'tb.lift': 'pelvis',
  'pu.pull': 'head', 'pu.shoulders': 'shoulders',
};

/** Punkt świata części ciała dla klatki. */
export function anchorPoint(f: Frame, a: Anchor): V3 {
  const sk = f.sk;
  switch (a) {
    case 'knees': return sk.legs.R.knee; case 'heels': return sk.legs.R.heel; case 'feet': return sk.legs.R.ankle;
    case 'back': return sub(sk.shoulderC, mul(sk.up, 14)); case 'pelvis': return sk.pelvis; case 'head': return sk.head; case 'shoulders': return sk.arms.R.shoulder;
    case 'elbows': return sk.arms.R.elbow; case 'hands': return sk.arms.R.grip; case 'bar': return f.info.load ?? sk.arms.R.grip;
  }
}

export type Badge = { id: string; kind: 'ok' | 'err'; cue: string; /** środek znaczka we współrzędnych rysunku (cm) */ at: V2 };
const OFF: V2 = [8, 8];

/** Znaczki ✓: wskazówki ćwiczenia (w kolejności) z częścią ciała, każda część ciała raz, maks. BADGE_MAX. */
export function okBadges(f: Frame, view: View, cues: string[]): Badge[] {
  const out: Badge[] = []; const used = new Set<Anchor>();
  for (const cue of cues) {
    const a = Object.prototype.hasOwnProperty.call(CUE_ANCHOR, cue) ? CUE_ANCHOR[cue] : undefined; if (!a || used.has(a)) continue;
    used.add(a); const p = proj(anchorPoint(f, a), view); out.push({ id: `ok:${cue}`, kind: 'ok', cue, at: [p[0] + OFF[0], p[1] + OFF[1]] });
    if (out.length >= BADGE_MAX) break;
  }
  return out;
}

/** Kształty znaczków ✓ (znaczki ✕ to znaczniki błędu z figure.errorMarks). */
export function badgeShapes(badges: Badge[]): Shape[] {
  const out: Shape[] = [];
  for (const b of badges) if (b.kind === 'ok') {
    const [x, y] = b.at;
    out.push({ k: 'circle', c: b.at, r: 5.2, fill: 'skinHi', a: 0.95, stroke: 'contactOk', w: 1.3, z: 5000, id: 'badgeOk' });
    out.push({ k: 'line', a: [x - 2.6, y - 0.1], b: [x - 0.8, y - 2.1], w: 1.8, role: 'contactOk', z: 5001, id: 'badgeOkMark' });
    out.push({ k: 'line', a: [x - 0.8, y - 2.1], b: [x + 2.7, y + 2.3], w: 1.8, role: 'contactOk', z: 5001, id: 'badgeOkMark' });
  }
  return out;
}
