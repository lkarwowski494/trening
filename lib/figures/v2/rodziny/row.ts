/* Rodzina v2 „row”: plik póz, prezentacja (DATA_UI) — jeden plik na rodzinę, poseData.ts tylko składa rejestr (KO-022, 10.11.2026). */
/* row (09.11.2026, partia 1): u = 0 ręce w zwisie (łokcie prawie proste), u = 1 łokcie za tułowiem: przyciąganie ciężaru 1 s, opuszczanie 2 s; mierzony staw — łokieć */
import type { RodzinaPoz } from '../poseData';

const rodzina: RodzinaPoz = {
  load: () => require('../poses/row.json'),
  ui: { names: { first: 'Podciąganie', second: 'Opuszczanie' }, lowerFirst: false, joints: ['elbow'] },
};
export default rodzina;
