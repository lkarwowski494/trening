/* Rodzina v2 „plyo”: plik póz, pętla jednokierunkowa (ONE_WAY_UI) — jeden plik na rodzinę, poseData.ts tylko składa rejestr (KO-022, 10.11.2026). */
import type { RodzinaPoz } from '../poseData';

const rodzina: RodzinaPoz = {
  load: () => require('../poses/plyo.json'),
  oneWay: { names: { first: 'Skok', second: 'Skok' }, lowerFirst: false, joints: ['knee', 'hip'] },
};
export default rodzina;
