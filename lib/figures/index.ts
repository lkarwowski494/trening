import { catalogKey, type Exercise } from '@/lib/seed';
import { t, lang, type Lang } from '@/lib/i18n';
import { CUE_DATA, cueText } from '@/lib/cues';
import { resolveFigure, framePoints, shapes, bounds, loopAt, poseBetween, type FigDef, type Figure, type FrameName, type Shape, type Pt } from './geom';

/*
 * Figury ruchu, etap 2–3 (decyzja właściciela 08.10.2026 ok. 23:50 — wariant A etapami; research docs/research/26 pkt 7).
 * Dane: lib/figures/data.json — dla każdego ćwiczenia 1–3 pozy (kąty stawów) z odwołaniem do zdań wskazówek etapu 1 (lib/cues),
 * z których wynika poza; reszta kątów to nazwane uproszczenie ilustracyjne. Geometria: ./geom.ts (jeden moduł, bez React).
 * Dokument docs/research/28-figury.md generuje scripts/figures/gen.mjs (--check w verify). Ćwiczenia bez figury: „open” z powodem.
 */

export type RomRange = { min: number; max: number; src: string };
type FigData = { rom: { note: string; side: Record<string, RomRange>; front: Record<string, RomRange> }; exercises: Record<string, FigDef>; open: Record<string, string> };
/* eslint-disable-next-line @typescript-eslint/no-var-requires */
export const FIG_DATA: FigData = require('./data.json');

/** Figura ćwiczenia z biblioteki (po kluczu katalogu — przemianowane też ją mają); własne, otwarte i bez wskazówek → null. */
export function figureFor(e: Pick<Exercise, 'lib' | 'libKey'> | null | undefined): Figure | null {
  const key = catalogKey(e); if (!key) return null;
  return figureByKey(key);
}
/** Figura po kluczu katalogu (tylko ćwiczenia, które mają wskazówki etapu 1 — figura opisuje ruch z tych zdań). */
export function figureByKey(key: string): Figure | null {
  if (!Object.prototype.hasOwnProperty.call(CUE_DATA.exercises, key)) return null;
  return resolveFigure(FIG_DATA.exercises, key);
}

/** Opis ruchu dla VoiceOver: zdania „Ruch” ze wskazówek etapu 1 w języku interfejsu (te same, co pod rysunkiem). */
export function figureLabel(key: string, l: Lang = lang()): string {
  const move = Object.prototype.hasOwnProperty.call(CUE_DATA.exercises, key) ? CUE_DATA.exercises[key].move : [];
  return t('Rysunek ruchu: {opis}', { opis: move.map(r => cueText(r.c, l)).join(' ') });
}
/** Podpis klatki przy statycznym widoku (Ogranicz ruch / pauza). */
export function frameLabel(n: FrameName): string {
  return n === 'start' ? t('Pozycja wyjściowa') : n === 'mid' ? t('W trakcie') : t('Pozycja końcowa');
}

/** Kształty wszystkich klatek i wspólny kadr (do statycznego widoku i do stałego kadru animacji). */
export function figureFrames(f: Figure): { shapes: Shape[][]; box: { x: number; y: number; w: number; h: number } } {
  const all = f.frames.map((fr, i) => shapes(fr.p, f.view, framePoints(f, i), f.props));
  return { shapes: all, box: bounds(all, 4, f.floor) };
}

/** Punkty rysunku → współrzędne SVG (y w dół, początek w lewym górnym rogu kadru). */
export const toSvg = (p: Pt, box: { x: number; y: number; h: number }): Pt => [Math.round((p[0] - box.x) * 10) / 10, Math.round((box.y + box.h - p[1]) * 10) / 10];
/** Ścieżka SVG łamanej. */
export function svgPath(pts: Pt[], box: { x: number; y: number; h: number }, close = false): string {
  return pts.map((p, i) => { const [x, y] = toSvg(p, box); return `${i ? 'L' : 'M'}${x} ${y}`; }).join(' ') + (close ? ' Z' : '');
}

/** Kształty pozy pośredniej w chwili `ms` pętli. */
export function figureAt(f: Figure, ms: number): Shape[] {
  const { from, to, k } = loopAt(ms, f.frames.length);
  const { p, P } = poseBetween(f, from, to, k);
  return shapes(p, f.view, P, f.props);
}
