/*
 * Nakładka techniki: sanki, rzuty i slamy piłką lekarską, Wall Ball (sled_throw; rzut z boku). 10.11.2026 (decyzja właściciela „żadna rodzina nie wychodzi bez nakładki”, docs/18), tylko reguły „ustalone”
 * z data/zrodla/figury-sens.json (sled_throw) i wskazówki obecne na karcie ćwiczenia (id w `cue` = id wskazówki karty tej reguły); bez nowych liczb — na rysunku tylko geometria, próg reguły zostaje w danych reguły:
 * - `sanki_pochylenie` (sled.lean „pochylenie w przód”; Sled Push, Sled Drag (Harness) — „ustalone (kierunek)”, stopień to konwencja i nie jest rysowany): linia tułowia = odcinek miednica → bark przedłużony za bark
 *   oraz pion przez miednicę w górę; kąt między nimi to pochylenie od pionu (jak w rodzinie, której reguła liczy kąt od pionu);
 * - `rzut_wyprost` (mb.legs „wyprost nóg i bioder”; Medicine Ball Scoop Throw — jedyne ćwiczenie z tą wskazówką na karcie): kolano albo biodro (łuk i linia przez staw, kąt w podpisie „Kąt na rysunku”);
 *   pokazany jest staw, który rusza się najbardziej (figure.ts: measuredJoint), więc oba warianty są zarejestrowane, a rysuje się jeden;
 * - `slam_nad_glowa` (slam.move „piłka nad głowę, potem w podłogę”; Medicine Ball Slam): poziom przez głowę, nad który chwyt ma sięgnąć na szczycie (jak poziom barków w unoszeniu ramion);
 * Bez elementu:
 * - `slam_plecy` (ustalone, Medicine Ball Slam; cue hinge.back jest na karcie, ale poza wskazowki_na_reguly sled_throw — strażnik „elementy związane z regułami ze źródłem” wymaga mapowania; dopisanie to zmiana danych badacza, pytanie do leada);
 * - `sanki_plecy` (Sled Push: jedno źródło; Sled Drag (Harness): uproszczenie), `rzut_ugiecie` (uproszczenie, wywiedziona z mb.legs), `wallball_przysiad` (analogia), `wallball_rzut` (konwencja), `tgu_*` (ćwiczenie spoza rysowanych);
 * - `wallball_kolana` (ustalone, sq.kneesToes) — wskazówki sq.kneesToes nie ma na karcie Wall Ball (karta własna: wb.setup, wb.move, wb.mis.shallow), a linia kolano nad stopą jest tylko w rzucie z przodu;
 * - Standing Two-Arm Overhead Throw, Backward Medicine Ball Throw, One-Arm Medicine Ball Slam: karta bez wskazówki powiązanej z regułą „ustalone” (własne soht.*, bmbt.*; zestaw ogólny One-Arm bez zdań) — bez elementu.
 */
import type { TechniqueDef } from '../overlay';

export const SLED_THROW_TECHNIQUE: TechniqueDef[] = [
  { id: 'sledLeanTrunkRef', kind: 'ref', cue: ['sled.lean'], rule: 'sanki_pochylenie', views: ['side'], ref: { shape: 'segment', from: 'pelvis', to: 'shoulderC' } },
  { id: 'sledLeanPlumbRef', kind: 'ref', cue: ['sled.lean'], rule: 'sanki_pochylenie', views: ['side'], ref: { shape: 'vertical', through: 'pelvis', dir: 'up' } },
  { id: 'throwKneeLimb', kind: 'limb', cue: ['mb.legs'], rule: 'rzut_wyprost', views: ['side'], joint: 'knee' },
  { id: 'throwHipLimb', kind: 'limb', cue: ['mb.legs'], rule: 'rzut_wyprost', views: ['side'], joint: 'hip' },
  { id: 'slamOverheadRef', kind: 'ref', cue: ['slam.move'], rule: 'slam_nad_glowa', views: ['side'], ref: { shape: 'horizontal', through: 'head' } },
];
