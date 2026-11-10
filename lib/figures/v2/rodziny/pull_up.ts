/* Rodzina v2 „pull_up”: plik póz, prezentacja (DATA_UI) — jeden plik na rodzinę, poseData.ts tylko składa rejestr (KO-022, 10.11.2026). */
import type { RodzinaPoz } from '../poseData';

const rodzina: RodzinaPoz = {
  load: () => require('../poses/pull_up.json'),
  ui: { names: { first: 'Podciąganie', second: 'Opuszczanie' }, lowerFirst: false, joints: ['elbow'] },
};
export default rodzina;
