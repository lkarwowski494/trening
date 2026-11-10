/*
 * Nakładka techniki: suwnice i maszyny nóg (leg_machine; partia 3 linii 1.1, 09.11.2026 — decyzja właściciela „żadna rodzina nie wychodzi bez nakładki”, docs/18).
 * Tylko reguły „ustalone” z data/zrodla/figury-sens.json (leg_machine) i wskazówki obecne na karcie albo w zestawie (id w `cue` = klucze wskazowki_na_reguly tej reguły); bez nowych liczb:
 * - `zakres` (lp.move, lp.setup, lp.noLock, hack.move: „Wypchnij platformę, prostując biodra i kolana; opuść ją powoli”, „Opuść się, uginając biodra i kolana”): linia przez udo i łuk zgięcia
 *   kolana (rzut z boku), jak squatKneeLimb; kąt = „Kąt na rysunku: zgięcie kolana” (progi zgięcia zostają w regule).
 * Bez elementu: `przysiad` (Belt Squat Machine, pewność „ustalone (kierunek)”, a zdanie sq.down w wskazowki_na_reguly tej rodziny nie występuje); `kolana_nad_stopami` (sq.kneesToes) — linia
 * kolano–palce to linia odniesienia przysiadu (guides.ts, kneeToe), a rodzina rysuje suwnicę tylko z boku (Leg Press, Single Leg Press — families.ts); `miednica_stala`, `piety`,
 * `stopa_na_platformie` — styki (poświata styku), nie elementy nakładki.
 */
import type { TechniqueDef } from '../overlay';

export const LEG_MACHINE_TECHNIQUE: TechniqueDef[] = [
  { id: 'legMachineKneeLimb', kind: 'limb', cue: ['lp.move', 'lp.setup', 'lp.noLock', 'hack.move'], rule: 'zakres', views: ['side'], joint: 'knee' },
];
