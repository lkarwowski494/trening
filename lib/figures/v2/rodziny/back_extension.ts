/* Rodzina v2 „back_extension”: plik póz, prezentacja (DATA_UI) — jeden plik na rodzinę, poseData.ts tylko składa rejestr (KO-022, 10.11.2026). */
import type { RodzinaPoz } from '../poseData';

const rodzina: RodzinaPoz = {
  load: () => require('../poses/back_extension.json'),
  ui: { names: { first: 'Unoszenie', second: 'Opuszczanie' }, lowerFirst: false, joints: ['hip'],
    /* u = 0 góra (tułów w linii z nogami), u = 1 dół (biodro ≥ 70°): ruch od u = 0 to opuszczanie; Reverse Hyperextension (u = 0 nogi w dół → u = 1 w linii z tułowiem) i Lower Back Curl (u = 1 barki w górę) mają wysiłek w u: 0 → 1 jak wpis rodziny */
    exceptions: { 'Back Extension': { names: { first: 'Opuszczanie', second: 'Unoszenie' }, lowerFirst: true }, 'Lower Back Curl': { hideAngle: true } /* r1-W1 10.11.2026: pomiar 3D biodra z odsunięciem w bok daje 9° i skok znaku; rzeczywisty zakres ok. 7° */ } },
};
export default rodzina;
