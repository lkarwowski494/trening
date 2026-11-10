/* Rodzina v2 „core_hang”: plik póz, prezentacja (DATA_UI) — jeden plik na rodzinę, poseData.ts tylko składa rejestr (KO-022, 10.11.2026). */
/* core_hang (10.11.2026): u = 0 zwis, u = 1 nogi uniesione; mierzone biodro */
import type { RodzinaPoz } from '../poseData';

const rodzina: RodzinaPoz = {
  load: () => require('../poses/core_hang.json'),
  ui: { names: { first: 'Unoszenie', second: 'Opuszczanie' }, lowerFirst: false, joints: ['hip'] },
};
export default rodzina;
