/*
 * Nakładka techniki: mostki i hip thrust (hip_bridge). 09.11.2026 (decyzja właściciela „żadna rodzina nie wychodzi bez nakładki”, docs/18),
 * tylko reguły „ustalone” z data/zrodla/figury-sens.json (hip_bridge) i wskazówki obecne na karcie ćwiczenia (id w `cue` = klucze wskazowki_na_reguly tej reguły); bez nowych liczb —
 * na rysunku tylko linia, próg reguły (8 cm od linii) zostaje w danych reguły:
 * - `linia_na_gorze` (gb.move, ht.move: „unieś biodra …”): linia barki → kolano przedłużona za kolano, jak odniesienie „segment” (E3); na szczycie miednica ma leżeć na tej linii.
 *   Pewność reguły: „ustalone (most); analogia (hip thrust)” — wpis mieszany przechodzi filtr reguly-cwiczen.json dla wszystkich wariantów, więc zakres ogranicza lista `exercises`:
 *   tylko mostek z podłogi (Glute Bridge i z obciążeniem sztangi); hip thrust (ławka, maszyna, Smith), Stability Ball Hip Bridge (barki na piłce, stopy na podłodze — wg recenzji r1; linia pominięta, bo reguła `linia_na_gorze` ma źródła dla mostka z podłogi) bez linii.
 * Bez elementu: `miednica_w_gore_podloga` i `miednica_w_gore_lawka` (wysokość miednicy względem startu — silnik nie ma rodzaju elementu „przyrost wysokości”, a linia pozioma
 *   przez miednicę przesuwałaby się razem z nią), `plecy_bez_przeprostu` (zgięcie kręgosłupa — brak stawu kręgosłupa w MeasuredJoint i w limbTriple), `piety_na_podlodze`
 *   (strefa liczbowa 2 cm — kind „zone” nieobsługiwany, E5; brak punktu „pięta” w RefPoint).
 */
import type { TechniqueDef } from '../overlay';

/** Mostek z podłogi — jedyne ćwiczenia, w których reguła `linia_na_gorze` ma pewność „ustalone” (źródła opisują mostek z podłogi, hip thrust to analogia). */
export const BRIDGE_LINE_EXERCISES = ['Glute Bridge', 'Glute Bridge (sztanga)'];
export const HIP_BRIDGE_TECHNIQUE: TechniqueDef[] = [
  { id: 'bridgeTopLine', kind: 'ref', cue: ['gb.move', 'ht.move'], rule: 'linia_na_gorze', views: ['side'], ref: { shape: 'segment', from: 'shoulder', to: 'knee' }, exercises: BRIDGE_LINE_EXERCISES },
];
