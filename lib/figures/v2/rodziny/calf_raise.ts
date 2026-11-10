/* Rodzina v2 „calf_raise”: plik póz, prezentacja (DATA_UI) — jeden plik na rodzinę, poseData.ts tylko składa rejestr (KO-022, 10.11.2026). */
/* calf_raise (09.11.2026): wspięcie na palce — u = 0 pięty na dole, u = 1 pięty w górze (1 s), opuszczanie 2 s. Mierzonym stawem byłaby kostka, ale MeasuredJoint jej nie ma (silnik, bez zmian w tej partii — zgłoszone w raporcie);
 * kandydat 'knee' (ruch kolana w wspięciu < 15°) powoduje, że linia „Kąt na rysunku” się nie pokazuje (MIN_MEASURED_ROM) — zamiast liczby, która nie jest ruchem wspięcia. */
import type { RodzinaPoz } from '../poseData';

const rodzina: RodzinaPoz = {
  load: () => require('../poses/calf_raise.json'),
  ui: { names: { first: 'Unoszenie', second: 'Opuszczanie' }, lowerFirst: false, joints: ['knee'] },
};
export default rodzina;
