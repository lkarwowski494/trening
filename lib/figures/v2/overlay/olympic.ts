/*
 * Nakładka techniki: podrzut i rwanie oraz ich ciągi (olympic; rzut z boku). 04.11.2026 (decyzja właściciela „żadna rodzina nie wychodzi bez nakładki”, docs/18), tylko reguły „ustalone”
 * z data/zrodla/figury-sens.json (olympic) i wskazówki obecne na karcie ćwiczenia (id w `cue` = klucze wskazowki_na_reguly tej reguły; tests/figures-v2-nakladka-triceps-olympic.test.tsx):
 * - `plecy_neutralne` (oly.back „plecy proste”): linia pleców = odcinek miednica → bark przedłużony za bark (jak linia pleców zawiasu); przy błędzie oly.mis (grupa plecy_tor) w kolorze błędu;
 * - `sztanga_blisko` (oly.close „sztanga blisko ciała”): odcinek kostka → kolano przedłużony za kolano = pierwszy odcinek osi „kostka → kolano → miednica → barki” z reguły (cały łamany ślad
 *   nie mieści się w limicie 3 linii; ślad toru sztangi jest rysowany osobno); błąd oly.mis (plecy_tor) zapala go na czerwono;
 * - `wyprost_bioder_kolan` (oly.legs „sztangę wybijają nogi i biodra”): linia przez kończynę i łuk w mierzonym stawie (kolano albo biodro — staw, który rusza się w ćwiczeniu najbardziej), kąt w podpisie.
 * Pętla jednokierunkowa (rwanie, zarzut, podrzut z lotem — 05.11.2026 r6-W1/W2): elementy liczą się z szkieletu każdej klatki całego powtórzenia (u 0 → 1), bez zależności od kierunku pętli.
 * Bez elementu (reguła nie „ustalone” albo bez zdania na karcie): rece_proste_do_wyprostu i rece_proste (jedno źródło), odbior_nad_glowa (jedno źródło + analogia), kolana_nad_stopami (analogia),
 * odbior_na_barkach, start_z_podlogi (bez wskazówki), przy_barkach_start, ugiecie_nog, ugiecie_krotkie (zdania pp.dip / pp.legs są tylko w ćwiczeniach, których wariant tych reguł nie zawiera).
 */
import type { TechniqueDef } from '../overlay';

/** Biodro ma element tylko tam, gdzie nie nakłada się na linię pleców (Block Power Snatch ma oba zdania: oly.back + oly.legs — linia biodra leżałaby na linii pleców, jak w zawiasie). */
export const OLYMPIC_HIP_EXERCISES = ['Clean', 'Power Clean', 'Power Snatch', 'Snatch Pull'];
export const OLYMPIC_TECHNIQUE: TechniqueDef[] = [
  { id: 'olympicBackRef', kind: 'ref', cue: ['oly.back'], rule: 'plecy_neutralne', views: ['side'], ref: { shape: 'segment', from: 'pelvis', to: 'shoulderC' } },
  { id: 'olympicBarCloseRef', kind: 'ref', cue: ['oly.close'], rule: 'sztanga_blisko', views: ['side'], ref: { shape: 'segment', from: 'ankle', to: 'knee' } },
  { id: 'olympicKneeLimb', kind: 'limb', cue: ['oly.legs'], rule: 'wyprost_bioder_kolan', views: ['side'], joint: 'knee' },
  { id: 'olympicHipLimb', kind: 'limb', cue: ['oly.legs'], rule: 'wyprost_bioder_kolan', views: ['side'], joint: 'hip', exercises: OLYMPIC_HIP_EXERCISES },
];
