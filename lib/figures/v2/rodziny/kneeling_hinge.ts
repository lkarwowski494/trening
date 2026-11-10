/* Rodzina v2 „kneeling_hinge”: plik póz, prezentacja (DATA_UI) — jeden plik na rodzinę, poseData.ts tylko składa rejestr (KO-022, 10.11.2026). */
/* kneeling_hinge (10.11.2026): u = 0 siad, tułów pionowo; u = 1 skłon w biodrach; mierzone biodro */
import type { RodzinaPoz } from '../poseData';

const rodzina: RodzinaPoz = {
  load: () => require('../poses/kneeling_hinge.json'),
  ui: { names: { first: 'Opuszczanie', second: 'Prostowanie' }, lowerFirst: true, joints: ['hip'] },
};
export default rodzina;
