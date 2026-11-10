/*
 * Nakładka techniki: pośladki i biodra na podłodze, linkach i maszynie (glute_floor; partia 7 linii 1.1, 10.11.2026 — decyzja właściciela „żadna rodzina nie wychodzi bez nakładki”, docs/18).
 * Element (jedna linia, tylko rzut z boku):
 * - `plecy_wprost` (hext.range; tylko Donkey Kick): linia pleców = odcinek miednica → bark przedłużony za bark (rodzaj „ref”, jak linia pleców w olympic/thruster); pewność „ustalone (kierunek)” —
 *   2 źródła szczebla 4 wprost dla Donkey Kick (ACE #270, ISSA; docs/research/glute-floor-pewnosc-regul-2026-11-10.md). Dobór przez wariant: tylko ćwiczenie z regułą `plecy_wprost` w `warianty`.
 * Bez elementu:
 * - `plecy` (Hip Extension with Bands, Cable Kickback, Machine Glute Kickback, Prone Flutter Kicks): jedno źródło wprost o lędźwiach (Cable Kickback) albo analogia — poniżej „ustalone”;
 * - `miednica_bez_przechylu` (Clamshell, Fire Hydrant): analogia (ACE #38 dotyczy odwodzenia prostej nogi; brak źródła wprost o przechyle czołowym);
 * - `miednica_bez_skretu` (Clamshell): pewność „ustalone (kierunek)”, ale w rzucie nie ma rodzaju elementu „skręt miednicy” (pole skretTulowia), a karta Clamshell nie ma wskazówki hab.hips
 *   (clam.noRoll, clam.mis.roll) i `wskazowki_na_reguly` nie odwzorowuje ich na tę regułę — dopisanie to decyzja merytoryczna;
 * - `biodro_do_linii`, `miednica_podpora`, `rozstaw_kolan`: „analogia” / „konwencja”;
 * - otwarte: kąt biodra w kickbackach (stojąc, na maszynie) — figury-sens.json, otwarte_czesciowo.
 */
import type { TechniqueDef } from '../overlay';

export const GLUTE_FLOOR_TECHNIQUE: TechniqueDef[] = [
  { id: 'gluteBackRef', kind: 'ref', cue: ['hext.range'], rule: 'plecy_wprost', views: ['side'], ref: { shape: 'segment', from: 'pelvis', to: 'shoulderC' } },
];
