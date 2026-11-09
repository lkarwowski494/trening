/*
 * Nakładka techniki: rozpiętki i pullover (chest_fly; hantle leżąc, wyciągi, guma, pec deck, przenoszenie za głowę). 09.11.2026 (decyzja właściciela „żadna rodzina nie wychodzi bez nakładki”, docs/18),
 * tylko reguły „ustalone” z data/zrodla/figury-sens.json (chest_fly) i wskazówki obecne na karcie ćwiczenia (id w `cue` = klucze wskazowki_na_reguly tej reguły); bez nowych liczb na rysunku — tylko geometria:
 * - `luk_dloni` (dfly.move, cfly.move: „hantle szerokim łukiem na boki i z powrotem nad klatkę”): kąt ramię–tułów — linia osi tułowia od barku i łuk do ramienia (rodzaj „abduction”, rzut z góry: ramię wędruje od
 *   prostopadłego do tułowia (ramiona w bok) do pionowego (nad klatką, w rzucie punkt — łuk znika, gdy ramię jest krótsze niż OVERLAY_ARM_MIN_PROJ)); tylko rozpiętki leżąc na ławce (`exercises`), bo w stojących i na pec decku
 *   oś tułowia jest pionowa i w rzucie z góry jest punktem, a w rzucie z boku ramię jest prawie stałe względem niej.
 * Bez elementu (rodzaju elementu nie ma w silniku albo reguła nie „ustalone”): `lokiec_staly` i `pullover_rece_proste` — łokieć stoi (zmiana ≤ 12°), nakładka „limb” rysuje się tylko przy mierzonym i pokazanym stawie (overlay.ts:158),
 * a mierzone jest ramię; `luk_dloni` poza ćwiczeniami leżąc — strefa liczbowa (kind „zone” nieobsługiwany, E5); `dol_na_wysokosci_barkow` i `pullover_ramie` (jedno źródło); `trzymanie_*` (Crucifix; analogia).
 */
import type { TechniqueDef } from '../overlay';

/** Rozpiętki leżąc na ławce (płaska, skośna, ujemna): oś tułowia w rzucie z góry jest odcinkiem poziomym albo ukośnym, ramię w płaszczyźnie czołowej. */
export const CHEST_FLY_LYING_EXERCISES = ['Chest Fly (hantle)', 'Incline Chest Fly (hantle)', 'Decline Dumbbell Fly', 'One-Arm Flat Bench Dumbbell Fly', 'Flat Bench Cable Fly', 'Incline Cable Fly'];
export const CHEST_FLY_TECHNIQUE: TechniqueDef[] = [
  { id: 'flyArmArc', kind: 'abduction', cue: ['dfly.move', 'cfly.move'], rule: 'luk_dloni', views: ['top'], exercises: CHEST_FLY_LYING_EXERCISES },
];
