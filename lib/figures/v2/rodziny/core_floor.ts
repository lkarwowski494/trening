/* Rodzina v2 „core_floor”: plik póz, prezentacja (DATA_UI) — jeden plik na rodzinę, poseData.ts tylko składa rejestr (KO-022, 10.11.2026). */
/* core_floor (10.11.2026, partia 7): brzuszki, unoszenie nóg i ćwiczenia stabilizacji na podłodze — u = 0 pozycja leżąca / wyjściowa, u = 1 szczyt skurczu (tułów albo nogi uniesione, miednica unoszona w Reverse Crunch i Leg Pull-In):
 * unoszenie 1 s, opuszczanie 2 s; mierzone biodro (zgięcie tułowia i nóg względem miednicy) albo kolano (Bird Dog, Dead Bug); Hollow Hold to utrzymanie (ISOMETRIC). Scissor Kick, Bicycle Crunch i Cross-Body Crunch są naprzemienne: dwie strony w jednym przebiegu. */
import type { RodzinaPoz } from '../poseData';

const rodzina: RodzinaPoz = {
  load: () => require('../poses/core_floor.json'),
  ui: { names: { first: 'Unoszenie', second: 'Opuszczanie' }, lowerFirst: false, joints: ['hip', 'knee'],
    /* Dead Bug: u 0 → 1 to opuszczanie ręki i przeciwnej nogi ku podłodze (kierunek z pionu kostek), powrót to unoszenie; Scissor Kick: nogi naprzemiennie, średnia kostek stoi — kierunku nie da się zmierzyć, deklaracja wprost (tests/figures-v2-kierunek-u.test.ts) */
    exceptions: { 'Dead Bug': { names: { first: 'Opuszczanie', second: 'Unoszenie' }, lowerFirst: true }, 'Scissor Kick': { names: { first: 'Naprzemiennie', second: 'Naprzemiennie' }, lowerFirst: false } } },
};
export default rodzina;
