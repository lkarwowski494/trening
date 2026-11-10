/* Rodzina v2 „pushup_plank”: plik póz, prezentacja (DATA_UI) — jeden plik na rodzinę, poseData.ts tylko składa rejestr (KO-022, 10.11.2026). */
/* pushup_plank (09.11.2026): pompki u = 0 góra (podpór na wyprostowanych rękach), u = 1 dół (klatka przy podłożu) → faza 0 → 1 to opuszczanie (2 s), powrót wypychanie (1 s); mierzony łokieć. */
import type { RodzinaPoz } from '../poseData';

const rodzina: RodzinaPoz = {
  load: () => require('../poses/pushup_plank.json'),
  ui: { names: { first: 'Opuszczanie', second: 'Wypychanie' }, lowerFirst: true, joints: ['elbow'],
    /* ruchy naprzemienne w podporze: cykl bez opuszczania; rollouty: u = 0 start, u = 1 najdalsze wysunięcie (opuszczanie ciała, powrót), mierzone biodro (wysunięcie) albo ramię (Suspended Fallout); Inverted Row: u = 0 zwis, u = 1 klatka przy drążku */
    exceptions: { 'Mountain Climbers': { names: { first: 'Naprzemiennie', second: 'Naprzemiennie' }, joints: ['hip', 'knee'], lowerFirst: false }, 'Plank Shoulder Taps': { names: { first: 'Naprzemiennie', second: 'Naprzemiennie' }, lowerFirst: false },
      'Rollout (sztanga)': { joints: ['hip'] }, 'Barbell Rollout from Bench': { joints: ['hip'] }, 'Standing Barbell Rollout': { joints: ['hip'] }, 'Suspended Fallout': { joints: ['shElev'] },
      'Plyo Push-Up': { names: { first: 'Skok', second: 'Skok' }, lowerFirst: false }, /* lot: pętla jednokierunkowa (jedna faza „Skok”) */
      'Inverted Row': { names: { first: 'Podciąganie', second: 'Opuszczanie' }, lowerFirst: false } } },
};
export default rodzina;
