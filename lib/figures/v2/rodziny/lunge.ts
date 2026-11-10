/* Rodzina v2 „lunge”: plik póz, prezentacja (DATA_UI) — jeden plik na rodzinę, poseData.ts tylko składa rejestr (KO-022, 10.11.2026). */
/* lunge (partia 9, 10.11.2026; `side: 'R'` = noga przednia/pracująca mierzona wprost, gdy zamach nogi tylnej zgina jej kolano dalej niż pracę nogi przedniej — recenzja r1, W1): u = 0 stanie, u = 1 dół wykroku, przysiadu na jednej nodze albo bułgarskiego — opuszczanie 2 s, wstawanie 1 s; wejście na stopień (Step Up, Barbell Step Up) ma u = 0 stopę na podłodze, u = 1 stanie na stopniu: wstawanie 1 s, opuszczanie 2 s (strażnik: tests/figures-v2-kierunek-u.test.ts) */
import type { RodzinaPoz } from '../poseData';

const rodzina: RodzinaPoz = {
  load: () => require('../poses/lunge.json'),
  ui: { names: { first: 'Opuszczanie', second: 'Wstawanie' }, lowerFirst: true, joints: ['knee'],
    exceptions: { 'Step Up': { side: 'R', names: { first: 'Wstawanie', second: 'Opuszczanie' }, lowerFirst: false }, 'Barbell Step Up': { side: 'R', names: { first: 'Wstawanie', second: 'Opuszczanie' }, lowerFirst: false },
      'Reverse Lunge': { side: 'R' }, 'Curtsy Lunge': { side: 'R' }, 'Crossover Reverse Lunge': { side: 'R' }, 'Elevated Back Lunge': { side: 'R' }, 'Lunge Pass Through': { side: 'R' } } },
};
export default rodzina;
