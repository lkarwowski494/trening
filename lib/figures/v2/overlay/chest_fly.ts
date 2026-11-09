/*
 * Nakładka techniki: rozpiętki i pullover (chest_fly; hantle leżąc, wyciągi, guma, pec deck, przenoszenie za głowę). 09.11.2026 (decyzja właściciela „żadna rodzina nie wychodzi bez nakładki”, docs/18),
 * tylko reguły „ustalone” z data/zrodla/figury-sens.json (chest_fly) i wskazówki obecne na karcie ćwiczenia (id w `cue` = klucze wskazowki_na_reguly tej reguły); bez nowych liczb na rysunku —
 * tylko geometria (linia ramienia i łuk zgięcia łokcia), próg reguły zostaje w danych reguły:
 * - `lokiec_staly` (fly.elbows: „łokcie lekko ugięte przez cały ruch”): linia bark–łokieć przedłużona poza łokieć i łuk zgięcia łokcia (rodzaj „limb”, staw „elbow”) — łuk ma przez cały ruch
 *   zostać tej samej wielkości; rzut z góry i z boku (rodzina ma te dwa rzuty; w obu ramię wędruje w płaszczyźnie czołowej, więc w jednym rzucie bywa skrócone, w drugim czytelne);
 * - `pullover_rece_proste` (po.arms: „ręce proste”): ten sam element łokcia w rzucie z boku (ramię przenoszone w płaszczyźnie strzałkowej); Bent-Arm Barbell Pullover go nie dostaje (łokieć ugięty celowo, reguła nie dotyczy).
 * Bez elementu: `luk_dloni` (odległość dłoni — strefa liczbowa, kind „zone” nieobsługiwany, E5), `dol_na_wysokosci_barkow` (jedno źródło), `pullover_ramie` (jedno źródło),
 * `trzymanie_lokiec` i `trzymanie_wysokosc` (Crucifix; analogia do unoszenia ramion, nie „ustalone”).
 */
import type { TechniqueDef } from '../overlay';

export const CHEST_FLY_TECHNIQUE: TechniqueDef[] = [
  { id: 'flyElbowLimb', kind: 'limb', cue: ['fly.elbows'], rule: 'lokiec_staly', views: ['top', 'side'], joint: 'elbow' },
  { id: 'pulloverElbowLimb', kind: 'limb', cue: ['po.arms'], rule: 'pullover_rece_proste', views: ['side'], joint: 'elbow' },
];
