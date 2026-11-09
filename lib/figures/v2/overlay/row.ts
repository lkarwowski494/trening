/*
 * Nakładka techniki: wiosłowanie (row; w pochyleniu, jednorącz, z podparciem). 09.11.2026 (decyzja właściciela „żadna rodzina nie wychodzi bez nakładki”, docs/18),
 * tylko reguły „ustalone” z data/zrodla/figury-sens.json (row) i wskazówki obecne na karcie ćwiczenia (id w `cue` = klucze wskazowki_na_reguly tej reguły); bez nowych liczb na rysunku:
 * - `zakres_lokcia` (row.fullStretch, row.bbPull, row.dbPull, tbar.pull, csr.pull, row1.pull: „na dole ręce proste, przyciągnij …”): linia bark–łokieć i łuk zgięcia łokcia w rzucie z boku
 *   (rodzaj „limb”, staw łokciowy = mierzony w DATA_UI); rozwarcie łuku rośnie od prawie prostej ręki do zgięcia ≥ 70° (próg reguły zostaje w danych reguły);
 * - `lokiec_za_plecami` (row.bbPull, row.dbPull, tbar.pull, csr.pull, row1.pull, row.elbowsPast, row1.top: „łokieć za linię pleców”): pion przez bark w rzucie z boku — łokieć ma go minąć w stronę pleców
 *   (miara reguły: łokieć ≥ 5 cm za linią barku, v2-sens.mjs `lokiec_za_tulowiem`); element TYLKO dla wiosłowania z podparciem (Chest Supported Row, Lying T-Bar Row, Seal Row), bo w opadzie reguła
 *   jest „analogią” (źródło mówi o podporze), a rzut „za linią barku” przy pochylonym tułowiu to wniosek geometryczny, nie ustalenie.
 * Bez elementu (rodzaju elementu nie ma w silniku albo reguła nie „ustalone”): `tulow_pochylony` (rodzaj „pochylenie tułowia w ruchu” — nieobsługiwany; kierunek ustalony, liczba to uproszczenie),
 * `plecy_neutralne` (zdanie hinge.back ma linię pleców z guides.ts, wspólną z zawiasem — bez dublowania), `kolana_lekko` (kolano mierzone przy łydce, rodzaj nieobsługiwany),
 * `tulow_stabilny` (jedno źródło + analogia). Widok z góry (top) bez nakładki: łokieć i pion barku są w rzucie z góry zakryte przez tułów, a zgięcie łokcia nie jest tam rozróżnialne.
 */
import type { TechniqueDef } from '../overlay';

/** Wiosłowanie z podparciem (ławka pod klatką lub brzuchem): reguła „łokieć za linią pleców” ma tu źródło „ustalone (podpora)”. */
export const ROW_SUPPORTED_EXERCISES = ['Chest Supported Row', 'Lying T-Bar Row', 'Seal Row (sztanga)'];
export const ROW_TECHNIQUE: TechniqueDef[] = [
  { id: 'rowElbowLimb', kind: 'limb', cue: ['row.fullStretch', 'row.bbPull', 'row.dbPull', 'tbar.pull', 'csr.pull', 'row1.pull'], rule: 'zakres_lokcia', views: ['side'], joint: 'elbow' },
  { id: 'rowElbowPastBackRef', kind: 'ref', cue: ['row.bbPull', 'row.dbPull', 'tbar.pull', 'csr.pull', 'row1.pull', 'row.elbowsPast', 'row1.top'], rule: 'lokiec_za_plecami', views: ['side'], ref: { shape: 'vertical', through: 'shoulder', dir: 'both' }, exercises: ROW_SUPPORTED_EXERCISES },
];
