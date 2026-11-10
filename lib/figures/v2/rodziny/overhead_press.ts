/* Rodzina v2 „overhead_press”: plik póz, prezentacja (DATA_UI) — jeden plik na rodzinę, poseData.ts tylko składa rejestr (KO-022, 10.11.2026). */
/* overhead_press (09.11.2026, partia 1): u = 0 dłonie przy barkach (landmine: gryf przy klatce), u = 1 ręce wyprostowane nad głową / przed sobą: wypychanie 1 s, opuszczanie 2 s; mierzony staw — łokieć.
 * Pike Push Up jest odwrócony (u = 0 ręce proste, biodra w górze; u = 1 łokcie zgięte, głowa przy podłodze), więc wyjątek: najpierw opuszczanie (2 s), potem wypychanie. */
/* 10.11.2026 (partia 1): ćwiczenia bez ruchu miednicy i kolan między u = 0 i u = 1 (ruch tylko w rękach; push press wraca do stania) deklarują kierunek wprost — strażnik tests/figures-v2-kierunek-u.test.ts
 * (rodzina ma ćwiczenia mierzalne: Pike Push Up, Linear Jammer). Wartość = wpis rodziny, więc rysunek i fazy bez zmian. */
import type { RodzinaPoz } from '../poseData';

const rodzina: RodzinaPoz = {
  load: () => require('../poses/overhead_press.json'),
  ui: { names: { first: 'Wypychanie', second: 'Opuszczanie' }, lowerFirst: false, joints: ['elbow'],
    exceptions: { 'Pike Push Up': { names: { first: 'Opuszczanie', second: 'Wypychanie' }, lowerFirst: true },
      ...Object.fromEntries(['Overhead Press (sztanga)', 'Overhead Press (hantle)', 'Band Shoulder Press', 'Double Kettlebell Press', 'Kettlebell Press', 'Single Arm Overhead Press (hantel)',
        'See-Saw Press (Alternating Side Press)', 'Arnold Press', 'Kettlebell Arnold Press', 'Seated Shoulder Press (hantle)', 'Kettlebell Seated Press', 'Seated Barbell Military Press',
        'Seated Cable Shoulder Press', 'Wyciskanie nad głowę (linki)', 'Standing Barbell Press Behind Neck', 'Push Press', 'Push Press - Behind the Neck', 'Landmine Press'].map(k => [k, { lowerFirst: false }])) } },
};
export default rodzina;
