/* Rodzina v2 „curl”: plik póz, prezentacja (DATA_UI) — jeden plik na rodzinę, poseData.ts tylko składa rejestr (KO-022, 10.11.2026). */
/* u = 0 zwis, u = 1 górna pozycja: podciąganie 1 s, opuszczanie 2 s (tempo ilustracyjne, anim.ts) */
import type { RodzinaPoz } from '../poseData';

const rodzina: RodzinaPoz = {
  load: () => require('../poses/curl.json'),
  ui: { names: { first: 'Uginanie', second: 'Opuszczanie' }, lowerFirst: false, joints: ['elbow'] },
};
export default rodzina;
