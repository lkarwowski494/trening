/*
 * Nakładka techniki: pośladki i biodra na podłodze, linkach i maszynie (glute_floor; partia 7 linii 1.1, 10.11.2026 — decyzja właściciela „żadna rodzina nie wychodzi bez nakładki”, docs/18).
 * Wpis zarejestrowany BEZ elementów: żadna reguła rodziny nie kwalifikuje się dziś do rysunku (tylko reguły „ustalone” i wskazówki obecne na karcie ćwiczenia):
 * - `miednica_bez_przechylu` (Clamshell, Fire Hydrant): pewność zawyżona — wynik badacza 10.11.2026 (docs/research/glute-floor-pewnosc-regul-2026-11-10.md): dla Clamshell to analogia, a pole przechylMiednicy
 *   to przechył w płaszczyźnie czołowej, nie obrót miednicy opisany w źródłach Fire Hydrant; wyłączona z nakładki decyzją leada partii 7;
 * - `miednica_bez_skretu` (Clamshell; cue reguły `hab.hips`): pewność właściwa, ale karta Clamshell nie ma wskazówki hab.hips (ma clam.noRoll, clam.mis.roll), a w `wskazowki_na_reguly` rodziny
 *   nie ma odwzorowania wskazówek karty na tę regułę — dopisanie go to decyzja merytoryczna (pytanie do leada), więc elementu nie wymyślam;
 * - `plecy` (hext.range, hext.mis.arch; Donkey Kick, kickbacki): pewność „jedno źródło bezpośrednie + analogia” — poniżej „ustalone”;
 * - `biodro_do_linii`, `miednica_podpora`, `rozstaw_kolan`: „analogia” / „konwencja”;
 * - otwarte: kąt biodra w kickbackach (stojąc, na maszynie) — figury-sens.json, otwarte_czesciowo.
 * Strażnik „każda rodzina ready ma nakładkę” (tests/figures-v2-nakladka-kazda-rodzina.test.tsx) jest przez to czerwony do decyzji leada.
 */
import type { TechniqueDef } from '../overlay';

export const GLUTE_FLOOR_TECHNIQUE: TechniqueDef[] = [];
