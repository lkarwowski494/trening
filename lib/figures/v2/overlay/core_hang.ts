/*
 * Nakładka techniki: brzuch w zwisie (core_hang; unoszenie kolan i nóg, toes to bar; rzut z boku). 10.11.2026 (decyzja właściciela „żadna rodzina nie wychodzi bez nakładki”, docs/18),
 * tylko reguły „ustalone” z data/zrodla/figury-sens.json (core_hang) i wskazówki obecne na karcie ćwiczenia (id w `cue` = klucze wskazowki_na_reguly tej reguły); bez nowych liczb —
 * na rysunku tylko geometria (linia i łuk), próg reguły zostaje w danych reguły:
 * - `kolana_ku_klatce` (hang.ribs: „Żebra w dół, tułów spokojny — podwijaj miednicę”; tylko Hanging Knee Raise — wariant Hanging Leg Raise ma w figury-sens.json inne reguły: nogi proste, `nogi_uniesione`, `kolana_lekko`): oś tułowia (bark → biodro) przedłużona za biodro i łuk zgięcia biodra do uda,
 *   kąt w podpisie „Kąt na rysunku: zgięcie biodra”. Reguła jest „ustalone (kierunek)”: kolana zbliżają się do barków — łuk rośnie od zwisu ku górze ruchu, jak w mostku (hip_bridge, staw biodra).
 *   Mierzony staw rodziny to biodro (DATA_UI.core_hang), więc element pokazuje się tylko wtedy, gdy kąt na rysunku jest tym stawem.
 * Bez elementu: `rece_proste` (analogia z wiszenia na drążku, nie „ustalone”; prowadnica prostej ręki jest zdefiniowana dla rzutu z przodu), `nogi_uniesione` (jedno źródło + konwencja),
 *   `kolana_lekko` (jedno źródło), `palce_do_drazka` (konwencja z nazwy ćwiczenia); Hanging Leg Raise i Toes to Bar nie mają reguły `kolana_ku_klatce` (Toes to Bar nie ma też hang.ribs na karcie; hang.t2b.move, hang.t2b.straight, hang.pressBar nie mają reguły w wskazowki_na_reguly).
 */
import type { TechniqueDef } from '../overlay';

/** kolana_ku_klatce: „ustalone” tylko w wariancie Hanging Knee Raise (figury-sens.json warianty); Hanging Leg Raise ma hang.ribs na karcie, ale inne reguły — lista `exercises` zamiast odcięcia filtrem reguł (tests/figures-v2-nakladka-fix4.test.tsx). */
export const CORE_HANG_KNEE_EXERCISES = ['Hanging Knee Raise'];
export const CORE_HANG_TECHNIQUE: TechniqueDef[] = [
  { id: 'hangHipLimb', kind: 'limb', cue: ['hang.ribs'], rule: 'kolana_ku_klatce', views: ['side'], joint: 'hip', exercises: CORE_HANG_KNEE_EXERCISES },
];
