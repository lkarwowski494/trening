/* Rodzina v2 „kb_ballistic”: plik póz, prezentacja (DATA_UI) — jeden plik na rodzinę, poseData.ts tylko składa rejestr (KO-022, 10.11.2026). */
/* kb_ballistic (09.11.2026): swing, zarzut i wysoki ciąg to wahadło: u = 0 dół (zawias, zawis między nogami) → u = 1 góra (swing: ręce przed sobą; zarzut: rack), powrót tą samą drogą.
 * Rwanie, wyciskanie z nóg i podrzut (9 ćwiczeń, miednica nie monotoniczna — wyrzut i ugięcie pod ciężarem) mają petla = jednokierunkowa (całe powtórzenie w jednym przebiegu, jak w olympic): jedna faza „Podnoszenie” bez opuszczania — wyjątki poniżej,
 * wpis rodziny pozostaje jeden. Mierzone biodro (swing, zarzut, rwanie) albo kolano (dip w podrzucie) — pokazany jest staw, który rusza się najbardziej. */
import type { RodzinaPoz, PhaseOverride } from '../poseData';

const rodzina: RodzinaPoz = {
  load: () => require('../poses/kb_ballistic.json'),
  ui: { names: { first: 'Podnoszenie', second: 'Opuszczanie' }, lowerFirst: false, joints: ['hip', 'knee'],
    exceptions: Object.fromEntries(['Kettlebell Snatch', 'Double Kettlebell Snatch', 'Snatch (hantel)', 'Double Kettlebell Push Press', 'Double Kettlebell Jerk', 'One-Arm Kettlebell Push Press', 'One-Arm Kettlebell Jerk', 'One-Arm Kettlebell Split Jerk', 'One-Arm Kettlebell Clean and Jerk'].map((k): [string, PhaseOverride] => [k, { names: { first: 'Podnoszenie', second: 'Podnoszenie' } }])) },
};
export default rodzina;
