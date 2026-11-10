/* Rodzina v2 „leg_machine”: plik póz, prezentacja (DATA_UI) — jeden plik na rodzinę, poseData.ts tylko składa rejestr (KO-022, 10.11.2026). */
/* leg_machine (partia 3, 09.11.2026): maszyny przysiadu (Hack, Pendulum, Lying Machine, Belt Squat) — u = 0 góra, u = 1 dół: opuszczanie 2 s, wstawanie 1 s (jak przysiad);
 * suwnica (Leg Press, Single Leg Press) — u = 0 nogi zgięte, u = 1 platforma wypchnięta: wypychanie 1 s, opuszczanie 2 s. Staw: kolano. */
import type { RodzinaPoz } from '../poseData';

const rodzina: RodzinaPoz = {
  load: () => require('../poses/leg_machine.json'),
  ui: { names: { first: 'Opuszczanie', second: 'Wstawanie' }, lowerFirst: true, joints: ['knee'],
    exceptions: { 'Leg Press': { names: { first: 'Wypychanie', second: 'Opuszczanie' }, lowerFirst: false }, 'Single Leg Press': { names: { first: 'Wypychanie', second: 'Opuszczanie' }, lowerFirst: false } } },
};
export default rodzina;
