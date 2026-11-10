/* Rodzina v2 „dip”: plik póz, prezentacja (DATA_UI) — jeden plik na rodzinę, poseData.ts tylko składa rejestr (KO-022, 10.11.2026). */
/* dip (09.11.2026): u = 0 podpór na wyprostowanych rękach, u = 1 dół (łokieć ≈ 95°) — faza 0 → 1 to opuszczanie (2 s), powrót to podnoszenie (1 s) */
import type { RodzinaPoz } from '../poseData';

const rodzina: RodzinaPoz = {
  load: () => require('../poses/dip.json'),
  ui: { names: { first: 'Opuszczanie', second: 'Podnoszenie' }, lowerFirst: true, joints: ['elbow'],
    /* Dip Machine: siedzący, miednica stoi; u = 0 uchwyty w górze (łokieć 90°), u = 1 wypchnięte w dół (łokieć 21°) — faza 0 → 1 to wysiłek (1 s), powrót 2 s */
    exceptions: { 'Dip Machine': { names: { first: 'Wypychanie', second: 'Powrót' }, lowerFirst: false } } },
};
export default rodzina;
