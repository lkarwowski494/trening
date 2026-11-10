/* Rodzina v2 „leg_isolation”: plik póz, prezentacja (DATA_UI) — jeden plik na rodzinę, poseData.ts tylko składa rejestr (KO-022, 10.11.2026). */
/* leg_isolation (partia 9, 10.11.2026): uginanie nóg (siad, leżąc, stojąc, guma): u = 0 noga prosta, u = 1 zgięta — uginanie 1 s, powrót 2 s; prostowanie na maszynie (u = 0 kolano 90°, u = 1 wyprost) — prostowanie 1 s, opuszczanie 2 s;
 * Slider Hamstring Curl zaczyna się od zgięcia (u = 0 pięty pod miednicą, u = 1 nogi wysunięte): wysuwanie to faza opuszczania (2 s), powrót to uginanie (1 s). Mierzone kolano. */
import type { RodzinaPoz } from '../poseData';

const rodzina: RodzinaPoz = {
  load: () => require('../poses/leg_isolation.json'),
  ui: { names: { first: 'Uginanie', second: 'Powrót' }, lowerFirst: false, joints: ['knee'],
    exceptions: { 'Leg Extension': { names: { first: 'Prostowanie', second: 'Opuszczanie' }, lowerFirst: false }, 'Single-Leg Leg Extension': { names: { first: 'Prostowanie', second: 'Opuszczanie' }, lowerFirst: false },
      'Slider Hamstring Curl': { names: { first: 'Opuszczanie', second: 'Uginanie' }, lowerFirst: true } } },
};
export default rodzina;
