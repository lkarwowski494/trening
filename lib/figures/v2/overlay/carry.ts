/*
 * Nakładka techniki: noszenie ciężaru (carry; farmer, suitcase, trap bar, riksza, nad głową, rack; rzut z boku). 10.11.2026 (decyzja właściciela „żadna rodzina nie wychodzi bez nakładki”, docs/18),
 * tylko reguły „ustalone” z data/zrodla/figury-sens.json (carry) i wskazówki obecne na karcie ćwiczenia (id w `cue` = klucze wskazowki_na_reguly tej reguły); bez nowych liczb —
 * na rysunku tylko geometria (pion), próg reguły (tułów ±10° od pionu) zostaje w danych reguły:
 * - `tulow_pion` (lunge.torso na karcie Farmer's Walk; carry.noLean w zestawie ogólnym i na karcie Suitcase Carry: „idź prosto, nie przechylaj się”): pion przez miednicę w górę — tułów ma zostać
 *   blisko tego pionu przez cały marsz, jak w wiosłowaniu na linkach (cable_row, tulow_stabilny).
 * Bez elementu: `rece_proste` i `ciezar_przy_biodrach` (carry.two, carry.one) — prowadnica prostej ręki (kind „ref”, shape „parallel”) jest zdefiniowana tylko dla rzutu z przodu, a rodzina ma jeden widok (z boku);
 * `ciezar_przy_biodrach` to strefa liczbowa (kind „zone”, E5 — nieobsługiwany); `tulow_bez_przechylu` — przechył boczny (pole przechylTulowia) nie jest widoczny w rzucie z boku;
 * `nad_glowa_caly` i `rack_caly` — reguły „konwencja” (definicja z nazwy), nie „ustalone”.
 */
import type { TechniqueDef } from '../overlay';

export const CARRY_TECHNIQUE: TechniqueDef[] = [
  { id: 'carryTorsoPlumb', kind: 'ref', cue: ['lunge.torso', 'carry.noLean'], rule: 'tulow_pion', views: ['side'], ref: { shape: 'vertical', through: 'pelvis', dir: 'up' } },
];
