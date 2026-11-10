/* Rodzina v2 „pulldown”: plik póz, prezentacja (DATA_UI) — jeden plik na rodzinę, poseData.ts tylko składa rejestr (KO-022, 10.11.2026). */
/* pulldown (partia 3, 09.11.2026): u = 0 ręce w górze (rozciągnięcie), u = 1 drążek przy górnej klatce — ściąganie 1 s, powrót 2 s (tempo ilustracyjne, anim.ts); Straight Arm Pulldown: łokieć prosty, rusza się bark */
import type { RodzinaPoz } from '../poseData';

const rodzina: RodzinaPoz = {
  load: () => require('../poses/pulldown.json'),
  ui: { names: { first: 'Ściąganie', second: 'Powrót' }, lowerFirst: false, joints: ['elbow'],
    exceptions: { 'Straight Arm Pulldown': { joints: ['shElev'] } } },
};
export default rodzina;
