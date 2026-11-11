/* Rodzina v2 „cable_row”: plik póz, prezentacja (DATA_UI) — jeden plik na rodzinę, poseData.ts tylko składa rejestr (KO-022, 10.11.2026). */
/* cable_row: u = 0 ręce wyprostowane (start), u = 1 uchwyt przy tułowiu albo twarzy; przyciąganie 1 s, powrót 2 s (tempo ilustracyjne). Mierzony łokieć (zakres_lokcia). */
import type { RodzinaPoz } from '../poseData';

const rodzina: RodzinaPoz = {
  load: () => require('../poses/cable_row.json'),
  ui: { names: { first: 'Przyciąganie', second: 'Powrót' }, lowerFirst: false, joints: ['elbow'] } /* KO-047, 11.11.2026: poziome przyciąganie, nie „Ściąganie” */,
};
export default rodzina;
