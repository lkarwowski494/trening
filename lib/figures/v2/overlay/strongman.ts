/*
 * Nakładka techniki: strongman (Yoke Walk; rzut z boku). 10.11.2026 (decyzja właściciela „żadna rodzina nie wychodzi bez nakładki”, docs/18). Rodzina ma jedno rysowane ćwiczenie — Yoke Walk (pozostałe 8 jest OTWARTYCH, Jefferson Squat wyjątkiem K3).
 * ŻADEN element się nie kwalifikuje, więc rejestr jest pusty (jak mobility_floor): reguły „ustalone” z data/zrodla/figury-sens.json (strongman) to tylko `tulow_pion_marsz` i `tulow_bez_przechylu` (analogia, nie „ustalone”;
 * cue carry.noLean) oraz `plecy` i `kolana` (analogia; cue sq.back, sq.kneesToes) — wszystkie z pewnością „analogia”, a Yoke Walk ma na karcie zestaw ogólny carry z jedną wskazówką (carry.walk, cue-sets.json),
 * bez powiązania z żadną regułą (wskazowki_na_reguly strongman nie ma carry.walk). Nowej reguły ani zdania nie wymyślamy; pytanie do leada: dopisanie carry.noLean do zestawu Yoke Walk (komentarz w figury-sens.json mówi,
 * że zestaw go ma, a cue-sets.json nie) i podniesienie pewności reguły tulow_pion_marsz — decyzja badacza.
 */
import type { TechniqueDef } from '../overlay';

export const STRONGMAN_TECHNIQUE: TechniqueDef[] = [];
