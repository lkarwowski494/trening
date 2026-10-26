// Wejście silnika figur v2 dla przeglądarki (strona z biblioteką ćwiczeń). Kopiowane obok zbudowanych modułów (silnik-build.mjs). Dane: próbki klatek z figury.json
// (poza + rekwizyty w 25 punktach ruchu); między próbkami interpolacja liniowa, potem ten sam szkielet (solveSkeleton) i rysunek (draw, render) co w aplikacji.
// Kolory: zmienne CSS --f-<rola> (strona ustawia je w CSS; jasny / ciemny motyw bez przeliczania kształtów).
import { solveSkeleton } from './skeleton.js';
import { bodyShapes, propShapes } from './draw.js';
import { boundsOf, svgInner } from './render.js';
import { uAt, TEMPO } from './anim.js';

export { uAt, TEMPO, boundsOf };
/** Role kolorów rysunku (= klucze figurePalette; sprawdza je test w repo aplikacji). */
export const ROLES = ['skinHi', 'clothHi', 'error', 'floor', 'frame', 'pad', 'steel', 'plate', 'load', 'skin', 'skinFar', 'cloth', 'clothFar', 'shoe', 'hair', 'guide', 'cable', 'muscleMain', 'muscleAux'];
/** Paleta „rola → var(--f-rola)”. */
export const VAR_PALETTE = Object.fromEntries(ROLES.map(r => [r, `var(--f-${r})`]));

/** Interpolacja liniowa liczb, tablic i obiektów o tym samym kształcie (teksty i znaczniki logiczne — z pierwszej próbki). */
export function lerp(a, b, t) {
  if (typeof a === 'number') return typeof b === 'number' ? a + (b - a) * t : a;
  if (Array.isArray(a)) return a.map((x, i) => lerp(x, b?.[i], t));
  if (a && typeof a === 'object') return Object.fromEntries(Object.keys(a).map(k => [k, lerp(a[k], b?.[k], t)]));
  return a;
}
/** Klatka (poza + rekwizyty) w chwili u (0–1) z próbek równomiernie rozłożonych na [0, 1]. */
export function frameAt(frames, u) {
  const x = Math.min(1, Math.max(0, u)) * (frames.length - 1), i = Math.min(frames.length - 2, Math.floor(x));
  return lerp(frames[i], frames[i + 1], x - i);
}
/** Kształty 2D klatki w widoku 'side' | 'front' | 'top'. */
export function shapesOf(frame, view) { return [...bodyShapes(solveSkeleton(frame.pose), view), ...propShapes(frame.props, view)]; }
export const shapesAt = (frames, u, view) => shapesOf(frameAt(frames, u), view);
/** Wspólny kadr całej pętli (próbkowanie co 1/20, także próbki błędów) — rysunek nie skacze między klatkami. */
export function boxOf(framesList, view) {
  const lists = []; for (const fr of framesList) for (let i = 0; i <= 20; i++) lists.push(shapesAt(fr, i / 20, view));
  return boundsOf(lists);
}
/** Wnętrze grupy SVG (elementy kształtów) w chwili u. */
export const innerAt = (frames, u, view) => svgInner(shapesAt(frames, u, view), VAR_PALETTE);
/** Atrybut transform grupy (odbicie osi y) i viewBox dla kadru. */
export const groupTransform = box => `matrix(1 0 0 -1 ${-box.x} ${box.y + box.h})`;
export const viewBox = box => `0 0 ${box.w} ${box.h}`;
