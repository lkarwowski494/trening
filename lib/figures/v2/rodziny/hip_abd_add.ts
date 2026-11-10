/* Rodzina v2 „hip_abd_add”: plik póz, prezentacja (DATA_UI) — jeden plik na rodzinę, poseData.ts tylko składa rejestr (KO-022, 10.11.2026). */
/* hip_abd_add (partia 3, 09.11.2026): u = 0 start, u = 1 noga(i) odwiedzione / przywiedzione; wysiłek 1 s, powrót 2 s. Kąt ukryty we wszystkich ćwiczeniach: jedyny staw biodra w silniku
 * („hip”) nazywa się w podpisie „zgięcie biodra”, a ruch tej rodziny to odwodzenie/przywodzenie — podpis byłby nieprawdziwy (brak stawu „odwiedzenie biodra” w MeasuredJoint). */
import type { RodzinaPoz } from '../poseData';

const rodzina: RodzinaPoz = {
  load: () => require('../poses/hip_abd_add.json'),
  ui: { names: { first: 'Rozsuwanie', second: 'Powrót' }, lowerFirst: false, joints: ['hip'], /* lowerFirst jawnie w wyjątkach: kierunku u nie da się zmierzyć z kolan i miednicy (strażnik figures-v2-kierunek-u) — u = 0 → 1 to wysiłek (noga od pozycji wyjściowej) */
    exceptions: { 'Hip Abduction': { hideAngle: true, lowerFirst: false }, 'Cable Hip Abduction': { hideAngle: true, lowerFirst: false }, 'Lateral Band Walk': { hideAngle: true }, 'Monster Walk': { hideAngle: true },
      'Hip Adduction': { hideAngle: true, lowerFirst: false, names: { first: 'Ściąganie', second: 'Powrót' } }, 'Cable Hip Adduction': { hideAngle: true, lowerFirst: false, names: { first: 'Ściąganie', second: 'Powrót' } } } },
};
export default rodzina;
