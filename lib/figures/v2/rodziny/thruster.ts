/* Rodzina v2 „thruster”: plik póz, prezentacja (DATA_UI) — jeden plik na rodzinę, poseData.ts tylko składa rejestr (KO-022, 10.11.2026). */
/* thruster (10.11.2026): całe powtórzenie w jednej pętli (petla = jednokierunkowa, jak olympic z lotem): przysiad z ciężarem na barkach i wyciskanie nad głowę — jedna faza „Podnoszenie”, bez opuszczania */
import type { RodzinaPoz } from '../poseData';

const rodzina: RodzinaPoz = {
  load: () => require('../poses/thruster.json'),
  ui: { names: { first: 'Podnoszenie', second: 'Podnoszenie' }, lowerFirst: false, joints: ['knee', 'hip'] },
};
export default rodzina;
