/* Rodzina v2 „triceps”: plik póz, prezentacja (DATA_UI) — jeden plik na rodzinę, poseData.ts tylko składa rejestr (KO-022, 10.11.2026). */
import type { RodzinaPoz } from '../poseData';

const rodzina: RodzinaPoz = {
  load: () => require('../poses/triceps.json'),
  ui: { names: { first: 'Prostowanie', second: 'Opuszczanie' }, lowerFirst: false, joints: ['elbow'] },
};
export default rodzina;
