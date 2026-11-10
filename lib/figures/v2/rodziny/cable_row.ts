/* Rodzina v2 „cable_row”: plik póz, prezentacja (DATA_UI) — jeden plik na rodzinę, poseData.ts tylko składa rejestr (KO-022, 10.11.2026). */
/* cable_row: u = 0 ręce wyprostowane (start), u = 1 uchwyt przy tułowiu albo twarzy; ściąganie 1 s, powrót 2 s (tempo ilustracyjne). Mierzony łokieć (zakres_lokcia). */
import type { RodzinaPoz } from '../poseData';

const rodzina: RodzinaPoz = {
  load: () => require('../poses/cable_row.json'),
  ui: { names: { first: 'Ściąganie', second: 'Powrót' }, lowerFirst: false, joints: ['elbow'] },
};
export default rodzina;
