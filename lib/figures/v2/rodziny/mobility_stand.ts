/* Rodzina v2 „mobility_stand”: plik póz, prezentacja (DATA_UI) — jeden plik na rodzinę, poseData.ts tylko składa rejestr (KO-022, 10.11.2026). */
/* mobility_stand (10.11.2026): osiem ćwiczeń to pozycje statyczne (ISOMETRIC — bez licznika faz; nazwy faz nieużywane), mierzone kolano (rozciąganie łydki: noga tylna i przednia); w rozciąganiu szyi, ramion i skłonie bocznym kolano nie jest istotą pozycji → bez linii „Kąt na rysunku” */
import type { RodzinaPoz, PhaseOverride } from '../poseData';

const rodzina: RodzinaPoz = {
  load: () => require('../poses/mobility_stand.json'),
  ui: { names: { first: 'Unoszenie', second: 'Opuszczanie' }, lowerFirst: false, joints: ['knee'],
    exceptions: Object.fromEntries(['Chin To Chest Stretch', 'Side Neck Stretch', 'Overhead Triceps Stretch', 'Standing Chest Stretch', 'Standing Lateral Stretch'].map((k): [string, PhaseOverride] => [k, { hideAngle: true }])) },
};
export default rodzina;
