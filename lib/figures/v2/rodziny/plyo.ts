/* Rodzina v2 „plyo”: pętla jednokierunkowa (ONE_WAY_UI) — jeden plik na rodzinę, poseData.ts tylko składa rejestr (KO-022, 10.11.2026). */
import type { RodzinaPoz } from '../poseData';

const rodzina: RodzinaPoz = {
  oneWay: { names: { first: 'Skok', second: 'Skok' }, lowerFirst: false, joints: ['knee', 'hip'] },
};
export default rodzina;
