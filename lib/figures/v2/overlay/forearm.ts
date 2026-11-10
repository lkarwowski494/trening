/*
 * Nakładka techniki: przedramiona i chwyt (forearm; uginanie nadgarstków, odwrotne uginanie z talerzem). 10.11.2026 (partia 5; decyzja właściciela 09.11.2026 „żadna rodzina nie wychodzi bez nakładki”, docs/18),
 * tylko reguły „ustalone” z data/zrodla/figury-sens.json (forearm) i wskazówki obecne na karcie ćwiczenia (id w `cue` = klucze wskazowki_na_reguly tej reguły); bez nowych liczb:
 * - `nadgarstek_zakres` (wr.range: „zgięcie z powrotem … powoli w wyprost”, ACE #30; kierunek ustalony, ≥ 50° to konwencja trzymana w danych reguły): element kończyny w nadgarstku — linia przez przedramię
 *   (łokieć → nadgarstek) przedłużona za nadgarstek i łuk między przedramieniem a dłonią (rzut z boku; kąt = „Kąt na rysunku: zgięcie nadgarstka”). Wymaga trójki łokieć–nadgarstek–chwyt w limbTriple (staw `wristFlex`).
 * - `lokiec_przy_tulowiu` (curl.elbows, odwrotne uginanie z talerzem; ustalone): pion od barku w dół do wysokości miednicy — łokieć ma zostać na tym pionie, jak w nakładce curl.
 * Bez elementu:
 * - `przedramie_podparte_lokiec` i `przedramie_podparte_ramie` (wr.forearms, wr.mis.lift: „przedramiona na udach”): reguła mówi o stałym kącie łokcia (±10°) i nieruchomym łokciu względem barku —
 *   potrzebny nieruchomy punkt odniesienia łokcia (E3/E4), a linia poziomu przedramienia nie jest treścią reguły; rodzaju elementu „łokieć nie wędruje” w silniku nie ma.
 * - `obrot_przedramienia` (Dumbbell Lying Pronation / Supination) — „jedno źródło” i zestaw wskazówek „open”; `lokiec_zgina_sie` (Reverse Plate Curls) — „analogia”;
 *   `tulow_nieruchomy` (curl.noSwing) — linia tułowia leżałaby na pionie łokcia (jak w nakładce curl, recenzja 04.11.2026).
 */
import type { TechniqueDef } from '../overlay';

export const FOREARM_TECHNIQUE: TechniqueDef[] = [
  { id: 'forearmWristLimb', kind: 'limb', cue: ['wr.range'], rule: 'nadgarstek_zakres', views: ['side'], joint: 'wristFlex' },
  { id: 'forearmElbowPlumb', kind: 'ref', cue: ['curl.elbows'], rule: 'lokiec_przy_tulowiu', views: ['side'], ref: { shape: 'vertical', through: 'shoulder', dir: 'down', until: 'pelvis' } },
];
