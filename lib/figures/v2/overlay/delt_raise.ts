/*
 * Nakładka techniki: unoszenie ramion (delt_raise; bokiem, przodem, tyłem, wiosłowanie pionowe). 09.11.2026 (decyzja właściciela „żadna rodzina nie wychodzi bez nakładki”, docs/18),
 * tylko reguły „ustalone” z data/zrodla/figury-sens.json (delt_raise) i wskazówki obecne na karcie ćwiczenia (id w `cue` = klucze wskazowki_na_reguly tej reguły); bez nowych liczb —
 * na rysunku tylko geometria (linia i łuk), próg reguły zostaje w danych reguły:
 * - `ramie_unosi_sie` (lat.move, front.move: „unoś ramiona …”): kąt ramię–tułów — linia osi tułowia od barku i łuk do ramienia (rodzaj „abduction”: rzut osi tułowia bark → miednica
 *   oraz rzut łokcia względem barku, rzut z przodu dla unoszenia bokiem, z boku dla unoszenia przodem); łuk rośnie razem z ramieniem;
 * - `lokcie_na_wysokosci_barkow_u1` (lat.height: „do wysokości barków”): poziom przez bark, do którego ramię ma sięgnąć na szczycie (rzut z przodu), jak poziom drążka w podciąganiu.
 * Bez elementu: `lokiec_staly` (łokieć ugięty stałym kątem) — staw mierzony na rysunku to bark (shElev/shAbd), nie łokieć, a rodzaju elementu „kąt łokcia przy mierzonym barku” nie ma w silniku;
 * `rear_dlonie_w_linii_barkow` i `rear_dlonie_w_bok` (odległość dłoni od płaszczyzny barków i odejście w bok — strefy liczbowe, kind „zone” nieobsługiwany, E5);
 * `lokcie_nad_dlonmi_u1` (jedno źródło + analogia), `ciezar_blisko_glowy` (strefa liczbowa), `tulow_nieruchomy` (analogia), `ramie_unosi_sie_skos` (uproszczenie) — reguła nie „ustalone” albo bez rodzaju elementu.
 */
import type { TechniqueDef } from '../overlay';

export const DELT_RAISE_TECHNIQUE: TechniqueDef[] = [
  { id: 'deltArmElevation', kind: 'abduction', cue: ['lat.move', 'front.move', 'lat.height', 'lat.elbows', 'front.elbows', 'cyr.move', 'fro.move'], rule: 'ramie_unosi_sie', views: ['front', 'side'] },
  { id: 'deltShoulderLevelRef', kind: 'ref', cue: ['lat.height', 'cdr.move'], rule: 'lokcie_na_wysokosci_barkow_u1', views: ['front'], ref: { shape: 'horizontal', through: 'shoulder' } },
];
