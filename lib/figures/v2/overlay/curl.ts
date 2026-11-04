/*
 * Nakładka techniki: uginanie ramion (etap 2, 04.11.2026). Element kończyny: linia przez ramię i łuk zgięcia łokcia (rzut z boku), tylko z regułą „ustalone”
 * (lokiec_zgina_sie) i wskazówką ruchu obecną na karcie ćwiczenia (curl.dbMove / bbMove / hammerMove / cableMove / preacher.range = wskazowki_na_reguly tej reguły).
 * Bez elementu (rodzaju elementu nie ma w silniku): łokieć przy tułowiu (lokiec_przy_tulowiu) — potrzebna linia ramienia z nieruchomym punktem łokcia (E3/E4),
 * tułów nieruchomo (tulow_nieruchomy) — linia tułowia leżałaby na pionie łokcia (tułów i bark nad sobą, recenzja 2R W1, 04.11.2026), więc zdanie curl.noSwing zostaje bez elementu.
 */
import type { TechniqueDef } from '../overlay';

export const CURL_TECHNIQUE: TechniqueDef[] = [
  /** „zginaj łokieć … opuść do pełnego wyprostu ręki” (lokiec_zgina_sie): linia bark–łokieć przedłużona poza łokieć i łuk zgięcia łokcia. Kąt = „Kąt na rysunku: zgięcie łokcia”. */
  { id: 'curlElbowLimb', kind: 'limb', cue: ['curl.dbMove', 'curl.bbMove', 'curl.hammerMove', 'curl.cableMove', 'preacher.range'], rule: 'lokiec_zgina_sie', views: ['side'], joint: 'elbow' },
  /** „Łokcie zostają przy bokach” (lokiec_przy_tulowiu, ustalone; E3): pion od barku w dół do wysokości miednicy (nie pod podłogę) — łokieć ma zostać na tym pionie (nie wędrować do przodu); złamana reguła → kolor błędu. */
  { id: 'curlElbowPlumb', kind: 'ref', cue: ['curl.elbows'], rule: 'lokiec_przy_tulowiu', views: ['side'], ref: { shape: 'vertical', through: 'shoulder', dir: 'down', until: 'pelvis' } },
];
