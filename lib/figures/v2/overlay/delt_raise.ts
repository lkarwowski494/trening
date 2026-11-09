/*
 * Nakładka techniki: unoszenie ramion (delt_raise; bokiem, przodem, tyłem, wiosłowanie pionowe). 09.11.2026 (decyzja właściciela „żadna rodzina nie wychodzi bez nakładki”, docs/18),
 * tylko reguły „ustalone” z data/zrodla/figury-sens.json (delt_raise) i wskazówki obecne na karcie ćwiczenia (id w `cue` = klucze wskazowki_na_reguly tej reguły); bez nowych liczb —
 * na rysunku tylko geometria (linia i łuk), próg reguły zostaje w danych reguły:
 * - `ramie_unosi_sie` (lat.move, front.move: „unoś ramiona …”): kąt ramię–tułów — linia osi tułowia od barku i łuk do ramienia (rodzaj „abduction”: rzut osi tułowia bark → miednica
 *   oraz rzut łokcia względem barku, rzut z przodu dla unoszenia bokiem (deltArmElevationFront), z boku dla unoszenia przodem (deltArmElevationSide) — lista ćwiczeń w `exercises`, bo w rzucie poprzecznym do ruchu łuk jest artefaktem, recenzja 09.11.2026); łuk rośnie razem z ramieniem;
 * - `lokcie_na_wysokosci_barkow_u1` (lat.height: „do wysokości barków”): poziom przez bark, do którego ramię ma sięgnąć na szczycie (rzut z przodu), jak poziom drążka w podciąganiu.
 * Bez elementu: `lokiec_staly` (łokieć ugięty stałym kątem) — staw mierzony na rysunku to bark (shElev/shAbd), nie łokieć, a rodzaju elementu „kąt łokcia przy mierzonym barku” nie ma w silniku;
 * `rear_dlonie_w_linii_barkow` i `rear_dlonie_w_bok` (odległość dłoni od płaszczyzny barków i odejście w bok — strefy liczbowe, kind „zone” nieobsługiwany, E5);
 * `lokcie_nad_dlonmi_u1` (jedno źródło + analogia), `ciezar_blisko_glowy` (strefa liczbowa), `tulow_nieruchomy` (analogia), `ramie_unosi_sie_skos` (uproszczenie) — reguła nie „ustalone” albo bez rodzaju elementu.
 */
import type { TechniqueDef } from '../overlay';

/** Ćwiczenia, w których płaszczyzną ruchu jest płaszczyzna czołowa (rzut z przodu): unoszenie bokiem oraz Dumbbell Scaption i Cable Y Raise; łuk w rzucie z boku byłby artefaktem (ramię prostopadle do rzutu; recenzja nakładki 09.11.2026). */
export const DELT_FRONTAL_EXERCISES = ['Lateral Raise (hantle)', 'Cable Lateral Raise', 'One-Arm Lateral Raise (hantel)', 'Band Lateral Raise', 'Machine Lateral Raise', 'Cable Seated Lateral Raise', 'Dumbbell Scaption', 'Cable Y Raise'];
/** Ćwiczenia w płaszczyźnie strzałkowej (rzut z boku): unoszenie przodem; w rzucie z przodu ramię rzutuje się na pion. */
export const DELT_SAGITTAL_EXERCISES = ['Front Raise', 'Cable Front Raise', 'Front Plate Raise', 'Single Dumbbell Front Raise', 'Barbell Front Raise to Overhead', 'Dumbbell Front Raise to Overhead'];
const ELEVATION_CUES = ['lat.move', 'front.move', 'lat.height', 'lat.elbows', 'front.elbows', 'cyr.move', 'fro.move'];

export const DELT_RAISE_TECHNIQUE: TechniqueDef[] = [
  { id: 'deltArmElevationFront', kind: 'abduction', cue: ELEVATION_CUES, rule: 'ramie_unosi_sie', views: ['front'], exercises: DELT_FRONTAL_EXERCISES },
  { id: 'deltArmElevationSide', kind: 'abduction', cue: ELEVATION_CUES, rule: 'ramie_unosi_sie', views: ['side'], exercises: DELT_SAGITTAL_EXERCISES },
  { id: 'deltShoulderLevelRef', kind: 'ref', cue: ['lat.height', 'cdr.move'], rule: 'lokcie_na_wysokosci_barkow_u1', views: ['front'], ref: { shape: 'horizontal', through: 'shoulder' } },
];
