/** Dźwignia maszyny z przodu: jedna decyzja „rysować / nie” na całe ćwiczenie (p2-r4, U-H1: Hack Squat miał pręt tylko w początku ruchu). */
import { keyframeFrame, type PoseData } from './contract';
import { dzwigniaDotykaGlowy } from './draw';
import { DZWIGNIA_BEZ_GLOWY, type FamilyId } from './families';

const STEPS = 20;
const cache = new WeakMap<PoseData, boolean>();
/** Czy dźwignia maszyny przechodzi przez głowę z przodu w KTÓREJKOLWIEK klatce ruchu (poza poprawna i wszystkie wiersze błędów, siatka co 1/20 ruchu). Tylko rodziny z DZWIGNIA_BEZ_GLOWY. */
export function dzwigniaPrzezGlowe(d: PoseData): boolean {
  if (!DZWIGNIA_BEZ_GLOWY.includes(d.rodzina as FamilyId)) return false;
  const hit = cache.get(d); if (hit !== undefined) return hit;
  let r = false;
  for (const w of [undefined, ...d.bledy.map((_, i) => i)]) { for (let i = 0; i <= STEPS && !r; i++) { const f = keyframeFrame(d, i / STEPS, w); if (dzwigniaDotykaGlowy(f.props, f.sk)) r = true; } if (r) break; }
  cache.set(d, r); return r;
}
