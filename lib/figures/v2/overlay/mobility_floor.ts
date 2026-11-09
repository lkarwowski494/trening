/*
 * Nakładka techniki: mobilność i rozciąganie na podłodze (mobility_floor). 09.11.2026 (decyzja właściciela „żadna rodzina nie wychodzi bez nakładki”, docs/18) — rodzina bez elementów:
 * dla tej rodziny żadna reguła „ustalona” (data/zrodla/figury-sens.json → rodziny.mobility_floor) nie ma jednocześnie wskazówki obecnej na karcie (`wskazowki_na_reguly`) i rodzaju elementu,
 * który ją pokaże na rysunku:
 * - `poza_nieruchoma` (st.noBounce, „ustalone”): to bezruch szkieletu (ruch ≤ 2 cm) — nie geometria klatki; rodzaje elementów w silniku (limb, abduction, ref) rysują kąt albo linię w jednej klatce, nie brak ruchu;
 * - pozostałe reguły „ustalone” (kolana_proste, jedna_noga_prosta, plecy_plasko, sklon_z_bioder, lezenie_miednica) mają w danych cue `st.tension` (ogólne „poczuj rozciąganie”), ale `wskazowki_na_reguly` mapuje na regułę
 *   tylko st.noBounce; karty własne (np. n.hingeFlat, n.tall) nie są powiązane z regułami. Powiązanie wskazówki z regułą, której karta nie wypowiada, byłoby wymyśleniem treści;
 * - reguły „jedno źródło”/„analogia”/„konwencja” (siad_prosto, posladki_na_pietach, kolano_tylne_na_podlodze …) i Cat-Cow (kregoslup_koci_grzbiet: zgięcie kręgosłupa — nie ma go wśród mierzonych stawów, MeasuredJoint) nie kwalifikują się albo nie mają rodzaju elementu.
 * Ślad toru ciężaru: brak (bez ciężaru i przyrządu; guma w Seated Calf Stretch jest zaczepem, nie torem). Decyzja właściciela 04.11.2026 (4) B: bez ról mięśni. Pytanie do leada: czy zostawić pustą nakładkę, czy powiązać st.tension z regułami (zmiana danych sens).
 */
import type { TechniqueDef } from '../overlay';

export const MOBILITY_FLOOR_TECHNIQUE: TechniqueDef[] = [];
