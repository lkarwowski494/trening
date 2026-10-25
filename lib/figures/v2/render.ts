/*
 * Figury v2 — z kształtów 2D do ścieżek SVG i do pełnego dokumentu SVG (testy, zrzuty, podgląd). Komponent aplikacji (components/ExerciseFigureV2.tsx)
 * używa tych samych funkcji, więc zrzut z testów = to, co widzi użytkownik. Współrzędne rysunku mają y w górę; SVG dostaje transformację odbicia.
 */
import type { V2 } from './math';
import { sortShapes } from './draw';
import type { FigurePalette } from './palette';
import type { Shape } from './scene';

export type Box = { x: number; y: number; w: number; h: number };
const f1 = (n: number): string => (Math.round(n * 100) / 100).toString();

/** Ścieżka SVG łamanej albo gładkiej krzywej zamkniętej (Catmull-Rom → Béziera). */
export function pathD(pts: V2[], close = false, smooth = false, tension = 0.17): string {
  if (!pts.length) return '';
  if (!smooth || pts.length < 3) return pts.map((p, i) => `${i ? 'L' : 'M'}${f1(p[0])} ${f1(p[1])}`).join('') + (close ? 'Z' : '');
  const n = pts.length; let d = `M${f1(pts[0][0])} ${f1(pts[0][1])}`;
  const at = (i: number): V2 => pts[((i % n) + n) % n];
  for (let i = 0; i < (close ? n : n - 1); i++) {
    const p0 = close ? at(i - 1) : pts[Math.max(i - 1, 0)], p1 = at(i), p2 = close ? at(i + 1) : pts[i + 1], p3 = close ? at(i + 2) : pts[Math.min(i + 2, n - 1)];
    d += `C${f1(p1[0] + (p2[0] - p0[0]) * tension)} ${f1(p1[1] + (p2[1] - p0[1]) * tension)} ${f1(p2[0] - (p3[0] - p1[0]) * tension)} ${f1(p2[1] - (p3[1] - p1[1]) * tension)} ${f1(p2[0])} ${f1(p2[1])}`;
  }
  return d + (close ? 'Z' : '');
}
/** Wielokąt elipsy (obrót rot w stopniach, matematycznie) — do rysunku bez atrybutu transform. */
export function ellipsePts(c: V2, rx: number, ry: number, rotDeg: number, n = 28): V2[] {
  const a = rotDeg * Math.PI / 180, ca = Math.cos(a), sa = Math.sin(a);
  return Array.from({ length: n }, (_, i) => { const t = 2 * Math.PI * i / n; const x = rx * Math.cos(t), y = ry * Math.sin(t); return [c[0] + x * ca - y * sa, c[1] + x * sa + y * ca] as V2; });
}
export const shapePath = (s: Shape): string => s.k === 'poly' ? pathD(s.pts, !!s.close, !!s.smooth) : s.k === 'line' ? pathD([s.a, s.b]) : s.k === 'ellipse' ? pathD(ellipsePts(s.c, s.rx, s.ry, s.rot), true, true, 0.2) : '';

/** Prostokąt obejmujący kształty (z grubością kresek). Podłoga (y = 0) w kadrze. */
export function boundsOf(lists: Shape[][], pad = 5): Box {
  let x0 = Infinity, y0 = 0, x1 = -Infinity, y1 = 0;
  const take = (p: V2, m: number) => { x0 = Math.min(x0, p[0] - m); x1 = Math.max(x1, p[0] + m); y0 = Math.min(y0, p[1] - m); y1 = Math.max(y1, p[1] + m); };
  for (const l of lists) for (const s of l) {
    if (s.k === 'circle') take(s.c, s.r + (s.w ?? 0));
    else if (s.k === 'ellipse') take(s.c, Math.max(s.rx, s.ry));
    else if (s.k === 'line') { if (s.id === 'floor') continue; take(s.a, s.w / 2); take(s.b, s.w / 2); }
    else for (const p of s.pts) take(p, (s.w ?? 0) / 2);
  }
  if (!isFinite(x0)) { x0 = 0; x1 = 0; }
  return { x: x0 - pad, y: y0 - pad, w: x1 - x0 + 2 * pad, h: y1 - y0 + 2 * pad };
}

/** Atrybuty SVG jednego kształtu (kolory z palety). */
export function shapeAttrs(s: Shape, pal: FigurePalette): Record<string, string | number | undefined> {
  if (s.k === 'line') return { stroke: pal[s.role], strokeWidth: s.w, strokeLinecap: 'round', strokeDasharray: s.dash ? s.dash.join(' ') : undefined, strokeOpacity: s.alpha };
  const fill = s.fill ? pal[s.fill] : 'none', stroke = s.stroke ? pal[s.stroke] : undefined;
  return { fill, fillOpacity: s.fill ? s.a : undefined, stroke, strokeWidth: stroke ? (s.w ?? 1) : undefined, strokeOpacity: stroke ? Math.min(1, (s.a ?? 1) * 2.2) : undefined, strokeLinejoin: 'round' };
}

const kebab = (k: string): string => k.replace(/[A-Z]/g, m => '-' + m.toLowerCase());
/** Pełny dokument SVG (do zrzutów i testów migawkowych). `shapes` w kolejności rysowania wyznacza sortShapes. */
export function svgDocument(shapes: Shape[], box: Box, pal: FigurePalette, px = 1): string {
  const out: string[] = [`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${f1(box.w)} ${f1(box.h)}" width="${f1(box.w * px)}" height="${f1(box.h * px)}">`, `<g transform="matrix(1 0 0 -1 ${f1(-box.x)} ${f1(box.y + box.h)})">`];
  for (const s of sortShapes(shapes)) {
    const at = shapeAttrs(s, pal); const attrs = Object.entries(at).filter(([, v]) => v !== undefined).map(([k, v]) => `${kebab(k)}="${v}"`).join(' ');
    if (s.k === 'circle') out.push(`<circle cx="${f1(s.c[0])}" cy="${f1(s.c[1])}" r="${f1(s.r)}" ${attrs}/>`);
    else out.push(`<path d="${shapePath(s)}" ${attrs}/>`);
  }
  out.push('</g></svg>');
  return out.join('\n');
}
