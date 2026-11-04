/*
 * Nakładka techniki: uginanie ramion (etap 2, 04.11.2026). Element kończyny: linia przez ramię i łuk zgięcia łokcia (rzut z boku), tylko z regułą „ustalone”
 * (lokiec_zgina_sie) i wskazówką ruchu obecną na karcie ćwiczenia (curl.dbMove / bbMove / hammerMove / cableMove / preacher.range = wskazowki_na_reguly tej reguły).
 * Bez elementu (rodzaju elementu nie ma w silniku): łokieć przy tułowiu (lokiec_przy_tulowiu) — potrzebna linia ramienia z nieruchomym punktem łokcia (E3/E4),
 * tułów nieruchomo (tulow_nieruchomy) — linia tułowia (E3). Opis w raporcie etapu 2; do dodania z nowym rodzajem elementu (decyzja koordynatora).
 */
import type { TechniqueDef } from '../overlay';

export const CURL_TECHNIQUE: TechniqueDef[] = [
  /** „zginaj łokieć … opuść do pełnego wyprostu ręki” (lokiec_zgina_sie): linia bark–łokieć przedłużona poza łokieć i łuk zgięcia łokcia. Kąt = „Kąt na rysunku: zgięcie łokcia”. */
  { id: 'curlElbowLimb', kind: 'limb', cue: ['curl.dbMove', 'curl.bbMove', 'curl.hammerMove', 'curl.cableMove', 'preacher.range'], rule: 'lokiec_zgina_sie', views: ['side'], joint: 'elbow' },
];
