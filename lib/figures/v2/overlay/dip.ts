/*
 * Nakładka techniki: dipy (dip; poręcze, ławka, maszyna, kółka). 09.11.2026 (decyzja właściciela „żadna rodzina nie wychodzi bez nakładki”, docs/18), tylko reguły „ustalone”
 * z data/zrodla/figury-sens.json (dip) i wskazówki obecne na karcie ćwiczenia (id w `cue` = klucze wskazowki_na_reguly tej reguły); bez nowych liczb — próg reguły zostaje w danych reguły:
 * - `zakres` (bdip.move, bdip.range: „zginając łokcie, do lekkiego rozciągnięcia … wypchnij się do wyprostu”, „pełny zakres”): linia bark–łokieć przedłużona za łokieć i łuk zgięcia łokcia
 *   (rzut z boku); kąt w podpisie „Kąt na rysunku: zgięcie łokcia”. Element rysuje się tylko tam, gdzie reguła jest przypisana wariantowi (reguly-cwiczen.json) i wskazówka jest na karcie.
 * Bez elementu:
 * - `tulow_pion` (pochylenie tułowia −10°…25° od pionu): reguła „ustalone” tylko dla dipów na ławce, a jej wskazówka bdip.move nie mówi nic o tułowiu (zdanie tylko o łokciach) —
 *   linia tułowia bez zdania na karcie byłaby elementem bez opisu; klucza wskazowki_na_reguly dla niej nie ma (badacz);
 * - dip.move / dip.setup (karta własna Chest Dip): nie są w wskazowki_na_reguly reguły `zakres` (źródła reguły opisują dipy na ławce), więc Chest Dip ma rysunek bez nakładki, dopóki badacz nie przypisze
 *   jej wskazówki. Triceps Dip, Ring Dips i Dip Machine mają w zestawie ogólnym bdip.move i bdip.range, więc dostają element po recenzji zestawu („zestawy”); `otwarte_czesciowo`: pochylenie tułowia na poręczach — kąta nie znaleziono.
 */
import type { TechniqueDef } from '../overlay';

export const DIP_TECHNIQUE: TechniqueDef[] = [
  /** Zdania ruchu z regułą `zakres` (lokiec_zakres_ruch, ustalone): linia przez ramię i łuk zgięcia łokcia. Kąt = „Kąt na rysunku: zgięcie łokcia”. */
  { id: 'dipElbowLimb', kind: 'limb', cue: ['bdip.move', 'bdip.range'], rule: 'zakres', views: ['side'], joint: 'elbow' },
];
