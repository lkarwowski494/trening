/*
 * Nakładka techniki: prostowanie tułowia (back_extension; ławka rzymska, reverse hyper, unoszenie tułowia leżąc). 10.11.2026 (decyzja właściciela „żadna rodzina nie wychodzi bez nakładki”, docs/18),
 * tylko reguły „ustalone” z data/zrodla/figury-sens.json (back_extension) i wskazówki obecne na karcie ćwiczenia (id w `cue` = klucze wskazowki_na_reguly tej reguły); bez nowych liczb —
 * na rysunku tylko geometria (linia i łuk), progi (70°, 15°) zostają w danych reguł:
 * - `zgiecie_w_biodrach` (bext.move: „do zgięcia w biodrach ok. 90°”): kąt biodra — linia uda i tułowia z łukiem (rodzaj „limb”, staw „hip”: bark – biodro – kolano); łuk rośnie przy zejściu tułowia
 *   i zmniejsza się do niemal prostej linii na górze, więc pokazuje oba końce ruchu. Element dostaje tylko ćwiczenie z tą wskazówką na karcie: własna karta Back Extension (Reverse Hyperextension ma zestaw ogólny bez bext.move).
 * Bez elementu:
 * - `wyprost_na_gorze` (ta sama wskazówka bext.move): pion przez kostkę z zawiasu (hingeUprightRef) nie pasuje — tułów i nogi leżą na górze pod kątem ok. 40° do poziomu, nie w pionie, a ten sam łuk biodra
 *   pokazuje już szczyt ruchu (kąt ≤ 15°); drugi element z tą samą wskazówką dublowałby łuk;
 * - `plecy_neutralne` (hinge.back, bext.noArch): linię pleców (`backLine`, guides.ts) pokazuje już silnik przy wskazówce hinge.back (Back Extension); przy bext.noArch (Reverse Hyperextension) linia nie jest dopisana
 *   — wskazówka „bez przeprostu” dotyczy szczytu, a linia pleców nie ma kierunku odniesienia dla przeprostu (próg −10° jest w danych reguły, nie na rysunku);
 * - `miednica_podpora`, `barki_w_gore` (Lower Back Curl; cobra.hips, cobra.control): pewność „analogia” — poniżej „ustalone”, więc bez elementu.
 */
import type { TechniqueDef } from '../overlay';

export const BACK_EXTENSION_TECHNIQUE: TechniqueDef[] = [
  { id: 'bextHipLimb', kind: 'limb', cue: ['bext.move'], rule: 'zgiecie_w_biodrach', views: ['side'], joint: 'hip' },
];
