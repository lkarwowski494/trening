/* Rodzina v2 „core_standing”: plik póz, prezentacja (DATA_UI) — jeden plik na rodzinę, poseData.ts tylko składa rejestr (KO-022, 10.11.2026). */
/* core_standing (partia 8, 10.11.2026): domyślnie skręt i powrót (Russian Twist, woodchop, landmine, judo flip); skłony boczne i wiatrak to opuszczanie tułowia (u 0 → 1 barki w dół), Pallof — wypychanie rąk, Bent Press — opuszczanie pod ciężar.
 * Mierzone: Pallof łokieć, wiatrak i Bent Press biodro; skręty i skłony boczne bez linii kąta (silnik nie ma stawu skrętu ani skłonu tułowia — ramię i biodro zmieniałyby się tylko razem z tułowiem). */
import type { RodzinaPoz, PhaseOverride } from '../poseData';

const rodzina: RodzinaPoz = {
  load: () => require('../poses/core_standing.json'),
  ui: { names: { first: 'Obrót', second: 'Powrót' }, lowerFirst: false, joints: ['hip'],
    exceptions: { ...Object.fromEntries(['Russian Twist', 'Medicine Ball Full Twist', 'Cable Russian Twists', 'Cable Woodchop', 'Cable Judo Flip', 'Landmine Rotation'].map((k): [string, PhaseOverride] => [k, { hideAngle: true, lowerFirst: false }])),
      ...Object.fromEntries(['Barbell Side Bend', 'Side Bend (hantel)', 'One-Arm High-Pulley Cable Side Bends', 'Weighted Ball Side Bend', 'Bosu Ball Cable Crunch With Side Bends'].map((k): [string, PhaseOverride] => [k, { names: { first: 'Opuszczanie', second: 'Powrót' }, lowerFirst: true, hideAngle: true }])),
      ...Object.fromEntries(['Pallof Press', 'Pallof Press With Rotation'].map((k): [string, PhaseOverride] => [k, { names: { first: 'Wypychanie', second: 'Powrót' }, lowerFirst: false, joints: ['elbow'] }])),
      ...Object.fromEntries(['Kettlebell Windmill', 'Double Kettlebell Windmill'].map((k): [string, PhaseOverride] => [k, { names: { first: 'Opuszczanie', second: 'Wstawanie' }, lowerFirst: true, joints: ['hip'] }])),
      'Bent Press': { names: { first: 'Opuszczanie', second: 'Wstawanie' }, lowerFirst: true, joints: ['hip'] } } },
};
export default rodzina;
