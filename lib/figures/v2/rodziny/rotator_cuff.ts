/* Rodzina v2 „rotator_cuff”: prezentacja (DATA_UI) — jeden plik na rodzinę, poseData.ts tylko składa rejestr (KO-022, 10.11.2026). */
import type { RodzinaPoz } from '../poseData';

const rodzina: RodzinaPoz = {
  ui: { names: { first: 'Obrót', second: 'Powrót' }, lowerFirst: false, joints: ['shRot'],
    exceptions: { 'Band Pull Apart': { names: { first: 'Rozsuwanie', second: 'Powrót' }, joints: ['shAbd'] }, 'Reverse Flyes With External Rotation': { names: { first: 'Unoszenie', second: 'Opuszczanie' }, joints: ['shAbd'] } } },
};
export default rodzina;
