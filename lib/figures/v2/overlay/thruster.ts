/*
 * Nakładka techniki: thruster i ruchy złożone przysiad + wyciskanie (thruster; rzut z boku). 10.11.2026 (decyzja właściciela „żadna rodzina nie wychodzi bez nakładki”, docs/18), tylko reguły „ustalone”
 * z data/zrodla/figury-sens.json (thruster) i wskazówki obecne na karcie ćwiczenia (id w `cue` = klucze wskazowki_na_reguly tej reguły); bez nowych liczb — na rysunku tylko geometria, próg reguły zostaje w danych reguły:
 * - `plecy_neutralne` (oly.back „plecy proste”; Clean and Press): linia pleców = odcinek miednica → bark przedłużony za bark, jak w olympic;
 * - `ciezar_blisko` (oly.close „sztanga blisko ciała”; Clean and Press): odcinek kostka → kolano przedłużony za kolano, jak w olympic (ślad toru ciężaru jest rysowany osobno).
 * Element rysuje się tylko tam, gdzie reguła jest przypisana wariantowi (reguly-cwiczen.json) i wskazówka jest na karcie — Thruster (hantle) i Kettlebell Thruster nie mają tych reguł.
 * Bez elementu:
 * - `kolana_nad_stopami` (ustalone, sq.kneesToes): jej linia (guide kneeToe) jest tylko w rzucie z przodu, a rodzina thruster ma tylko rzut z boku — w rzucie z boku kolano nad stopą nie ma rodzaju elementu w silniku;
 * - `piety` (ustalone): reguła styku, bez wskazówki w `wskazowki_na_reguly` (cue sq.mis.heels jest błędem, nie wskazówką), poświata styku istnieje już w silniku;
 * - `przysiad` (analogia), `start_przy_barkach` (analogia), `nad_glowa` (analogia; ohp.tall): nie „ustalone”.
 */
import type { TechniqueDef } from '../overlay';

export const THRUSTER_TECHNIQUE: TechniqueDef[] = [
  { id: 'thrusterBackRef', kind: 'ref', cue: ['oly.back'], rule: 'plecy_neutralne', views: ['side'], ref: { shape: 'segment', from: 'pelvis', to: 'shoulderC' } },
  { id: 'thrusterBarCloseRef', kind: 'ref', cue: ['oly.close'], rule: 'ciezar_blisko', views: ['side'], ref: { shape: 'segment', from: 'ankle', to: 'knee' } },
];
