/* Rodzina v2 „chest_fly”: plik póz, prezentacja (DATA_UI) — jeden plik na rodzinę, poseData.ts tylko składa rejestr (KO-022, 10.11.2026). */
/* chest_fly (09.11.2026): rozpiętki (u = 0 ramiona szeroko, u = 1 dłonie nad klatką / przed klatką) i pullover (u = 0 ciężar za głową, u = 1 nad klatką). Mierzone ramię jak w delt_raise: odsunięcie w bok (shAbd, rozpiętki) albo zgięcie
 * w płaszczyźnie strzałkowej (shElev, pullover i Crucifix — pierwszy staw przy utrzymaniu); łokieć w rozpiętce stoi (zmiana ≤ 12°), więc nie jest mierzonym stawem (nakładka „limb” wymaga, by staw był pokazany: overlay.ts). */
import type { RodzinaPoz } from '../poseData';

const rodzina: RodzinaPoz = {
  load: () => require('../poses/chest_fly.json'),
  ui: { names: { first: 'Unoszenie', second: 'Opuszczanie' }, lowerFirst: false, joints: ['shElev', 'shAbd'] },
};
export default rodzina;
