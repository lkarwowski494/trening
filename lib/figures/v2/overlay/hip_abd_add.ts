/*
 * Nakładka techniki: przywodzenie i odwodzenie nóg (hip_abd_add; rzut z przodu; partia 3 linii 1.1, 09.11.2026 — decyzja właściciela „żadna rodzina nie wychodzi bez nakładki”, docs/18).
 * Tylko reguły „ustalone” z data/zrodla/figury-sens.json (hip_abd_add) i wskazówki obecne na karcie albo w zestawie (id w `cue` = klucze wskazowki_na_reguly tej reguły); bez nowych liczb:
 * - `tulow_stoi` (hab.hips: „Biodra i tułów nieruchomo — pracuje tylko noga”; pewność „ustalone (kierunek)”): pion od środka miednicy w górę do linii barków (rzut z przodu) — tułów zostaje na tym
 *   pionie, rusza się tylko noga (próg zmiany pochylenia zostaje w regule).
 * Bez elementu: `polprzysiad` (bw.squat, kąt kolana) — rodzina ma tylko rzut z przodu, w którym zgięcie kolana jest w skrócie; `krok_w_bok`, `rozstaw_kostek`, `rozstaw_kolan` (rozstaw, strefa
 * liczbowa — rodzaju elementu „odległość między punktami” nie ma w silniku; rozstaw_kolan/rozstaw_kostek bez zdania w wskazowki_na_reguly); `miednica_bez_przechylu` (bez zdania w wskazowki_na_reguly).
 */
import type { TechniqueDef } from '../overlay';

export const HIP_ABD_ADD_TECHNIQUE: TechniqueDef[] = [
  { id: 'hipAbdTorsoPlumb', kind: 'ref', cue: ['hab.hips'], rule: 'tulow_stoi', views: ['front'], ref: { shape: 'vertical', through: 'pelvis', dir: 'up', until: 'shoulderC' } },
];
