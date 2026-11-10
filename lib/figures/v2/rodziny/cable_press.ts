/* Rodzina v2 „cable_press”: plik póz, prezentacja (DATA_UI) — jeden plik na rodzinę, poseData.ts tylko składa rejestr (KO-022, 10.11.2026). */
/* cable_press (10.11.2026): u = 0 dłonie przy klatce (łokieć ≥ 70°), u = 1 wyprost przed sobą (łokieć ≤ 25°) — faza 0 → 1 to wypychanie (1 s), powrót 2 s */
import type { RodzinaPoz } from '../poseData';

const rodzina: RodzinaPoz = {
  load: () => require('../poses/cable_press.json'),
  ui: { names: { first: 'Wypychanie', second: 'Powrót' }, lowerFirst: false, joints: ['elbow'] },
};
export default rodzina;
