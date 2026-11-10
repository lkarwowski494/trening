/*
 * Nakładka techniki: szrugsy (shrug; partia 3 linii 1.1, 09.11.2026 — decyzja właściciela „żadna rodzina nie wychodzi bez nakładki”, docs/18).
 * Tylko reguły „ustalone” z data/zrodla/figury-sens.json (shrug) i wskazówki obecne na karcie (id w `cue` = klucze wskazowki_na_reguly tej reguły); bez nowych liczb:
 * - `barki_w_gore` (shrug.move, shrug.high: „Unieś barki w górę”, „tak wysoko, jak się da”; pewność „ustalone (kierunek)”): pion w górę od barku (rzut z przodu) — kierunek ruchu barku prosto do ucha;
 *   bark idzie po tej linii (próg uniesienia zostaje w regule).
 * Bez elementu: `tulow_prosto` (shrug.tall) — pion przez tułów leżałby na sylwetce tułowia (jak w curl, recenzja 2R W1, 04.11.2026); `bez_rolowania` (jedno źródło);
 * `lopatki_sciagaja_sie` (Middle Back Shrug, konwencja z nazwy).
 */
import type { TechniqueDef } from '../overlay';

export const SHRUG_TECHNIQUE: TechniqueDef[] = [
  { id: 'shrugShoulderUpRef', kind: 'ref', cue: ['shrug.move', 'shrug.high'], rule: 'barki_w_gore', views: ['front'], ref: { shape: 'vertical', through: 'shoulder', dir: 'up' } },
];
