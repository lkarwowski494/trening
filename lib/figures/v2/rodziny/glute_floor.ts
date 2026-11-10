/* Rodzina v2 „glute_floor”: plik póz, prezentacja (DATA_UI) — jeden plik na rodzinę, poseData.ts tylko składa rejestr (KO-022, 10.11.2026). */
/* glute_floor (10.11.2026): u = 0 pozycja wyjściowa (noga w dół/przy drugiej), u = 1 noga uniesiona/odwiedziona — unoszenie 1 s, opuszczanie 2 s */
import type { RodzinaPoz } from '../poseData';

const rodzina: RodzinaPoz = {
  load: () => require('../poses/glute_floor.json'),
  ui: { names: { first: 'Unoszenie', second: 'Opuszczanie' }, lowerFirst: false, joints: ['hip'],
    /* kąt biodra ukryty tam, gdzie ruch nie jest zgięciem biodra (Fire Hydrant, Clamshell: odwodzenie; flutter: dwie nogi naprzemiennie); kierunku u nie da się zmierzyć z miednicy i kolan — deklaracja wprost (strażnik kierunek-u) */
    exceptions: { 'Fire Hydrant': { hideAngle: true, lowerFirst: false }, 'Clamshell': { hideAngle: true, lowerFirst: false, names: { first: 'Rozsuwanie', second: 'Powrót' } },
      'Hip Extension with Bands': { lowerFirst: false }, 'Prone Flutter Kicks': { hideAngle: true, lowerFirst: false, names: { first: 'Naprzemiennie', second: 'Naprzemiennie' } } } },
};
export default rodzina;
