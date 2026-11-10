/*
 * Nakładka techniki: mobilność i rozciąganie stojąc / w ruchu (mobility_stand). 10.11.2026 (decyzja właściciela „żadna rodzina nie wychodzi bez nakładki”, docs/18),
 * tylko reguły „ustalone” z data/zrodla/figury-sens.json (mobility_stand) i wskazówki obecne na karcie ćwiczenia (id w `cue` = klucze wskazowki_na_reguly tej reguły); bez nowych liczb — na rysunku tylko geometria:
 * - `sklon_boczny_statyczny` (sb.plane: „zginaj się tylko w bok — bez skrętu i bez pochylenia do przodu”, Standing Lateral Stretch; „ustalone”, ACE #212 i NHS): pion od miednicy w rzucie z przodu —
 *   tułów odchyla się od niego w bok (próg reguły, przechył ≥ 15°, zostaje w danych reguły); jak pion tułowia w wiosłowaniu na linkach (cable_row.ts: cableRowTorsoPlumb). Rzut z boku bez elementu:
 *   pion nie pokazuje tam niczego, czego reguła wymaga (przechył w bok jest prostopadły do rzutu); „bez skrętu” (bez_skretu) to „jedno źródło”, nie „ustalone”.
 *   Powiązanie sb.plane → sklon_boczny_statyczny dopisane w `wskazowki_na_reguly` (reguła ma to samo `cue` w danych; brakowało tylko wpisu odwrotnego, jak w core_standing).
 * Bez elementu (powód):
 * - `poza_nieruchoma` (st.noBounce, „ustalone”): to bezruch szkieletu (ruch ≤ 2 cm), nie geometria klatki — rodzaje elementów silnika (limb, abduction, ref) rysują kąt albo linię w jednej klatce, nie brak ruchu;
 * - `tylna_noga_prosta`, `przednia_noga_ugieta`, `tulow_pion`, `glowa_w_bok`, `rece_proste` („ustalone”, cue st.tension — ogólne „poczuj rozciąganie”): `wskazowki_na_reguly` nie mapuje st.tension na żadną z nich,
 *   a karty własne (np. chinSet, neckSideMove, wallCalfMove) nie są powiązane z regułami; powiązanie zdania, którego karta nie wypowiada, byłoby wymyśleniem treści (jak w mobility_floor);
 * - reguły „jedno źródło” / „analogia” / „konwencja” (obie_kolana_lekko, glowa_do_klatki, lokiec_nad_barkiem, rece_proste_za_plecami, piety_do_posladka, lat_*, krążenia, wymachy) i ćwiczenia dynamiczne bez rysunku.
 * Ślad toru ciężaru: brak (bez ciężaru i przyrządu; ściana jest oparciem dłoni, nie torem). Decyzja właściciela 04.11.2026 (4) B: bez ról mięśni.
 */
import type { TechniqueDef } from '../overlay';

export const MOBILITY_STAND_TECHNIQUE: TechniqueDef[] = [
  { id: 'standLateralPlumb', kind: 'ref', cue: ['sb.plane'], rule: 'sklon_boczny_statyczny', views: ['front'], ref: { shape: 'vertical', through: 'pelvis', dir: 'up' } },
];
