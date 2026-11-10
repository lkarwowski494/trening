/* Rodzina v2 „delt_raise”: plik póz, prezentacja (DATA_UI) — jeden plik na rodzinę, poseData.ts tylko składa rejestr (KO-022, 10.11.2026). */
/* Rodziny z danymi, jeszcze niepodłączone (status „planned”, families.ts) — wpisy gotowe, żeby podłączenie nie pokazało kąta stawu, który się nie rusza (S2, 27.10.2026). */
import type { RodzinaPoz } from '../poseData';

const rodzina: RodzinaPoz = {
  load: () => require('../poses/delt_raise.json'),
  ui: { names: { first: 'Unoszenie', second: 'Opuszczanie' }, lowerFirst: false, joints: ['shElev', 'shAbd'],
    exceptions: { 'Car Drivers': { hideAngle: true, names: { first: 'Obrót', second: 'Powrót' } }, /* r5-W1 08.11.2026: kierownica obraca się, nie unosi */ 'Alternating Deltoid Raise': { names: { first: 'Naprzemiennie', second: 'Naprzemiennie' } } } },
};
export default rodzina;
