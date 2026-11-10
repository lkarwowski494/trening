/* Rodzina v2 „mobility_floor”: plik póz, prezentacja (DATA_UI) — jeden plik na rodzinę, poseData.ts tylko składa rejestr (KO-022, 10.11.2026). */
/* mobility_floor (09.11.2026): osiem ćwiczeń to pozycje statyczne (ISOMETRIC — bez licznika faz i kąta), jedyny ruch to Cat-Cow (nazwy faz: PHASES_BY_EXERCISE); ruch jest w kręgosłupie, którego nie mierzymy (MeasuredJoint) → bez linii „Kąt na rysunku” */
import type { RodzinaPoz } from '../poseData';

const rodzina: RodzinaPoz = {
  load: () => require('../poses/mobility_floor.json'),
  ui: { names: { first: 'Grzbiet w dół', second: 'Koci grzbiet' }, lowerFirst: false, joints: ['hip'], exceptions: { 'Cat-Cow': { hideAngle: true } } },
};
export default rodzina;
