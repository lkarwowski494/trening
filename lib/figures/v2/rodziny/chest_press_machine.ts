/* Rodzina v2 „chest_press_machine”: plik póz, prezentacja (DATA_UI) — jeden plik na rodzinę, poseData.ts tylko składa rejestr (KO-022, 10.11.2026). */
/* u = 0 uchwyty przy barkach, u = 1 ręce wyprostowane (wypychanie 1 s, powrót 2 s) */
import type { RodzinaPoz } from '../poseData';

const rodzina: RodzinaPoz = {
  load: () => require('../poses/chest_press_machine.json'),
  ui: { names: { first: 'Wypychanie', second: 'Opuszczanie' }, lowerFirst: false, joints: ['elbow'] },
};
export default rodzina;
