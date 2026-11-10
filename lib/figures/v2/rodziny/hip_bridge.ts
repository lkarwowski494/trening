/* Rodzina v2 „hip_bridge”: plik póz, prezentacja (DATA_UI) — jeden plik na rodzinę, poseData.ts tylko składa rejestr (KO-022, 10.11.2026). */
/* hip_bridge (09.11.2026): u = 0 miednica nisko (podłoga, ławka), u = 1 pełny wyprost bioder; unoszenie 1 s, opuszczanie 2 s; mierzone biodro */
import type { RodzinaPoz } from '../poseData';

const rodzina: RodzinaPoz = {
  load: () => require('../poses/hip_bridge.json'),
  ui: { names: { first: 'Unoszenie', second: 'Opuszczanie' }, lowerFirst: false, joints: ['hip'] },
};
export default rodzina;
