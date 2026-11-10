/*
 * Nakładka techniki: rotacje barku i taśmy do ramion (rotator_cuff; rzut z przodu i z boku). 10.11.2026 (decyzja właściciela „żadna rodzina nie wychodzi bez nakładki”, docs/18),
 * tylko reguły „ustalone” z data/zrodla/figury-sens.json (rotator_cuff) i wskazówki obecne na karcie ćwiczenia (id w `cue` = klucze wskazowki_na_reguly tej reguły); bez nowych liczb —
 * na rysunku tylko geometria (pion), próg reguły (łokieć ≤ 6 cm od ramienia) zostaje w danych reguły:
 * - `lokiec_przy_boku` (rot.elbow na kartach External Rotation (linki), External Rotation with Band, Internal Rotation with Band i w zestawie ogólnym rotCuff: „łokieć przy tułowiu”):
 *   pion od barku w dół do wysokości miednicy — łokieć ma zostać na tym pionie przez cały ruch (ramię nie odchodzi od tułowia), jak „łokcie przy bokach” w uginaniu (curl).
 *   Element tylko dla ćwiczeń stojących (pole `exercises`): External Rotation (hantel) wykonuje się leżąc na boku, gdzie pion od barku nie jest „przy tułowiu”, a karta nie ma rot.elbow.
 * Bez elementu: `lokiec_zgiety_staly` (kąt 90°: reguła „jedno źródło” w części kąta, nie „ustalone”), `obrot_na_zewnatrz` (konwencja ≥ 15 cm) i reguły Band Pull Apart / Reverse Flyes
 * (`pa_*`: pewność „analogia”, rear.* nie jest wskazówką rotacji).
 */
import type { TechniqueDef } from '../overlay';

export const ROTATOR_CUFF_TECHNIQUE: TechniqueDef[] = [
  { id: 'rotElbowPlumb', kind: 'ref', cue: ['rot.elbow'], rule: 'lokiec_przy_boku', views: ['front', 'side'], ref: { shape: 'vertical', through: 'shoulder', dir: 'down', until: 'pelvis' },
    exercises: ['External Rotation (linki)', 'External Rotation with Band', 'Internal Rotation with Band', 'Cable Internal Rotation'] },
];
