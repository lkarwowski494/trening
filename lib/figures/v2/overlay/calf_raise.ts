/*
 * Nakładka techniki: wspięcia na palce (calf_raise; stojąc, na jednej nodze, w siadzie, maszyny). 09.11.2026 (decyzja właściciela „żadna rodzina nie wychodzi bez nakładki”, docs/18;
 * strażnik tests/figures-v2-nakladka-kazda-rodzina.test.tsx wymaga ≥ 1 elementu, który się rysuje), tylko reguły „ustalone” z data/zrodla/figury-sens.json (calf_raise)
 * i wskazówki obecne na karcie ćwiczenia; bez nowych liczb na rysunku — tylko geometria:
 * - `kolana_proste` (kolano ≤ 20°, „ustalone”, cue `calf.knees`: „kolana proste lub tylko lekko ugięte — ruch wyłącznie w stawach skokowych”): linia uda przedłużona poniżej kolana (rodzaj „ref”, segment
 *   biodro → kolano, strona pracująca, rzut z boku); goleń ma biec wzdłuż tej linii — widać, że kolano się nie zgina; kąt kolana nie jest tu mierzony (linia „Kąt na rysunku” jest ukryta, bo kolano w ruchu stoi).
 *   Element dostają tylko ćwiczenia, których reguły „ustalone” zawierają `kolana_proste` ORAZ których karta ma wskazówkę calf.knees: 5 ćwiczeń (Łydki na stopniu, Standing Calf Raise — wstrzymane 09.11.2026,
 *   Smith Machine Calf Raise, Calf Raise (sztanga), Calf Raise (linki)); Band i Donkey mają regułę, ale nie mają calf.knees; jednonóż ma wariant „podporowa” (analogia), w siadzie kolana są zgięte celowo (recenzja r1, 09.11.2026).
 * Bez elementu: `wspiecie` / `wspiecie_jednonoz` (zgięcie podeszwowe kostki ≥ 15°) — staw mierzony to kostka, a MeasuredJoint (poseData.ts) jej nie zawiera, więc rodzaj „limb” (linia osi goleni i łuk)
 * nie ma czego mierzyć; zgłoszone jako potrzeba silnika (bez zmiany silnika w tej partii); `kolana_proste_podporowa` (analogia), `kolana_zgiete_siad` (jedno źródło + definicja) — pewność inna niż „ustalone”.
 */
import type { TechniqueDef } from '../overlay';

export const CALF_RAISE_TECHNIQUE: TechniqueDef[] = [
  { id: 'calfKneeStraightRef', kind: 'ref', cue: ['calf.knees'], rule: 'kolana_proste', views: ['side'], ref: { shape: 'segment', from: 'hip', to: 'knee' } },
];
