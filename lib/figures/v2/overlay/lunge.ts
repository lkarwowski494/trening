/*
 * Nakładka techniki: wykroki, przysiad bułgarski, wejścia na stopień, pistolet i wykroki boczne (lunge; partia 9 linii 1.1, 10.11.2026 — decyzja właściciela „żadna rodzina nie wychodzi bez nakładki”, docs/18).
 * Tylko reguły „ustalone” z data/zrodla/figury-sens.json (lunge) i wskazówki obecne na karcie albo w zestawie ćwiczenia (id w `cue` = klucze wskazowki_na_reguly tej reguły); bez nowych liczb —
 * na rysunku tylko geometria, progi reguł (zgięcie kręgosłupa, 4 cm do środka, 20 cm) zostają w danych reguł:
 * - `plecy_proste` (lunge.torso „plecy proste przez cały ruch”, sq.back; rzut z boku): linia pleców = odcinek miednica → bark przedłużony za bark, jak w olympic i zawiasie;
 *   przy ćwiczeniach, w których reguła jest przypisana wariantowi (wykroki, wejścia, wykroki boczne — nie pistolet);
 * - `kolano_nad_stopa` (lunge.knee, stepup.knee, pistol.knee „kolano w linii palców stopy”; rzut z przodu): pion przez palce mierzonej nogi do wysokości jej kolana — kolano ma leżeć na tej linii,
 *   jak linia kneeToe przysiadu (guides.ts); strona = noga mierzona (ta, której kolano zgina się najbardziej).
 * Bez elementu:
 * - `glebokosc_wykroku` (lunge.fwd, lunge.back, lunge.walk, bss.move; ustalone tylko co do kierunku): reguła mierzy wysokość TYLNEGO kolana nad podłogą (≤ 20 cm), a silnik nie ma punktu „tylne kolano”
 *   w RefPoint (punkty dotyczą nogi mierzonej = przedniej) ani rodzaju elementu „strefa nad podłogą” (E5) — linia przez kolano przedniej nogi byłaby fałszywa;
 * - `wejscie` (stepup.move): przyrost wysokości miednicy ≥ 15 cm — silnik nie ma rodzaju elementu „przyrost wysokości” (jak miednica_w_gore w hip_bridge);
 * - `wolna_noga_w_przod` (pistol.setup): wolna noga to druga strona szkieletu, a RefPoint odnosi się do nogi mierzonej; pewność „ustalone (wg cues.json)”, bez rodzaju elementu „strefa” (E5).
 */
import type { TechniqueDef } from '../overlay';

export const LUNGE_TECHNIQUE: TechniqueDef[] = [
  { id: 'lungeBackRef', kind: 'ref', cue: ['lunge.torso', 'sq.back'], rule: 'plecy_proste', views: ['side'], ref: { shape: 'segment', from: 'pelvis', to: 'shoulderC' } },
  { id: 'lungeKneeToeRef', kind: 'ref', cue: ['lunge.knee', 'stepup.knee', 'pistol.knee'], rule: 'kolano_nad_stopa', views: ['front'], ref: { shape: 'vertical', through: 'toe', dir: 'up', until: 'knee' } },
];
