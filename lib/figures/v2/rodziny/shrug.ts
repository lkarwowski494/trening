/* Rodzina v2 „shrug”: plik póz, prezentacja (DATA_UI) — jeden plik na rodzinę, poseData.ts tylko składa rejestr (KO-022, 10.11.2026). */
import type { RodzinaPoz } from '../poseData';

const rodzina: RodzinaPoz = {
  load: () => require('../poses/shrug.json'),
  ui: { names: { first: 'Unoszenie', second: 'Opuszczanie' }, lowerFirst: false, joints: ['shrug', 'protract'],
    exceptions: { 'Middle Back Shrug': { names: { first: 'Ściąganie', second: 'Powrót' }, joints: ['protract'] /* partia 3, 09.11.2026: łopatki ściągają się (wysunięcie barków), uniesienie stoi */ } } },
};
export default rodzina;
