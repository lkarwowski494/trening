/* Rodzina v2 „strongman”: plik póz — jeden plik na rodzinę, poseData.ts tylko składa rejestr (KO-022, 10.11.2026). */
/* Bez wpisu DATA_UI: Yoke Walk jest marszem (petla cykl_lustro) — prezentacja GAIT_UI z dataUiForPose (partia 8, 10.11.2026). */
import type { RodzinaPoz } from '../poseData';

const rodzina: RodzinaPoz = {
  load: () => require('../poses/strongman.json'),
};
export default rodzina;
