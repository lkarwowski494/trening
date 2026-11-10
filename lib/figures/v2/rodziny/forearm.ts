/* Rodzina v2 „forearm”: prezentacja (DATA_UI) — jeden plik na rodzinę, poseData.ts tylko składa rejestr (KO-022, 10.11.2026). */
import type { RodzinaPoz } from '../poseData';

const rodzina: RodzinaPoz = {
  ui: { names: { first: 'Uginanie', second: 'Opuszczanie' }, lowerFirst: false, joints: ['wristFlex', 'forearmRoll', 'elbow'],
    exceptions: { 'Dumbbell Lying Pronation': { names: { first: 'Obrót', second: 'Powrót' } }, 'Dumbbell Lying Supination': { names: { first: 'Obrót', second: 'Powrót' } } } },
};
export default rodzina;
