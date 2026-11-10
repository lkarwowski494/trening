/*
 * Nakładka techniki: ściąganie drążka wyciągu górnego (pulldown; partia 3 linii 1.1, 09.11.2026 — decyzja właściciela „żadna rodzina nie wychodzi bez nakładki”, docs/18).
 * Tylko reguły „ustalone” z data/zrodla/figury-sens.json (pulldown) i wskazówki obecne na karcie ćwiczenia (id w `cue` = klucze wskazowki_na_reguly tej reguły); bez nowych liczb —
 * na rysunku tylko geometria (linia i łuk), próg reguły zostaje w danych reguły:
 * - `wyprost_u_gory` (lpd.fullStretch: „Na górze wyprostuj ręce do końca”): linia bark–łokieć przedłużona za łokieć i łuk zgięcia łokcia (rzut z boku); kąt = „Kąt na rysunku: zgięcie łokcia”;
 * - `do_gornej_klatki` (lpd.toChest, lpd.pull: „do górnej części klatki”): poziom przez bark (rzut z boku) — na dole drążek dochodzi w okolice tej linii (próg ±10/15 cm zostaje w regule);
 * - `ramie_w_dol` (sapd.move, tylko Straight Arm Pulldown): kąt ramię–tułów (rodzaj „abduction” w rzucie z boku — ruch w płaszczyźnie strzałkowej), łuk maleje razem z ramieniem.
 * Bez elementu: `lokcie_w_dol` (pu.elbowsDown) — poziom przez bark już rysuje `do_gornej_klatki` (druga linia w tym samym miejscu); `bez_odchylania` (pewność „ustalone (kierunek)”,
 * granica −30° z jednego źródła; linia tułowia leżałaby na tułowiu); `proste_rece` (sapd.arms) — prowadnica prostej ręki istnieje tylko w rzucie z przodu, gdzie ręka Straight Arm Pulldown
 * jest w skrócie (ruch w płaszczyźnie strzałkowej).
 */
import type { TechniqueDef } from '../overlay';

export const PULLDOWN_STRAIGHT_ARM_EXERCISES = ['Straight Arm Pulldown'];
export const PULLDOWN_TECHNIQUE: TechniqueDef[] = [
  { id: 'pulldownElbowLimb', kind: 'limb', cue: ['lpd.fullStretch'], rule: 'wyprost_u_gory', views: ['side'], joint: 'elbow' },
  { id: 'pulldownChestRef', kind: 'ref', cue: ['lpd.toChest', 'lpd.pull'], rule: 'do_gornej_klatki', views: ['side'], ref: { shape: 'horizontal', through: 'shoulder' } },
  { id: 'pulldownStraightArmSweep', kind: 'abduction', cue: ['sapd.move'], rule: 'ramie_w_dol', views: ['side'], exercises: PULLDOWN_STRAIGHT_ARM_EXERCISES },
];
