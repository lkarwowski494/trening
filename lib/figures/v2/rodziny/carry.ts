/* Rodzina v2 „carry”: plik póz, prezentacja (DATA_UI) — jeden plik na rodzinę, poseData.ts tylko składa rejestr (KO-022, 10.11.2026). */
import type { RodzinaPoz } from '../poseData';

const rodzina: RodzinaPoz = {
  load: () => require('../poses/carry.json'),
  ui: { names: { first: 'Marsz', second: 'Marsz' }, lowerFirst: false, joints: ['knee', 'hip'], walk: true },
};
export default rodzina;
