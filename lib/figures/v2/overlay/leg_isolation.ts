/*
 * Nakładka techniki: prostowanie i uginanie nóg (leg_isolation; partia 9 linii 1.1, 10.11.2026 — decyzja właściciela „żadna rodzina nie wychodzi bez nakładki”, docs/18).
 * Tylko reguły „ustalone” z data/zrodla/figury-sens.json (leg_isolation) i wskazówki obecne na karcie albo w zestawie ogólnym (id w `cue` = klucze wskazowki_na_reguly tej reguły); bez nowych liczb:
 * - `wyprost_kolan` / `wyprost_kolan_jednonoz` (lext.range, „od zgięcia pod kątem prostym do pełnego wyprostu”): linia przez udo i łuk zgięcia kolana (rzut z boku); kąt = „Kąt na rysunku: zgięcie kolana”, progi zostają w regule;
 * - `uginanie_kolan` (llc.move, lcurl.move, „pięty w stronę pośladków”): ta sama linia i łuk w kolanie (Leg Curl, Lying Leg Curl — ćwiczenia, których karta ma te wskazówki).
 * Dwa elementy prostowania mają `exercises` (wspólna wskazówka lext.range, różne reguły: obie nogi / jednonóż), żeby wskazówka karty nie dawała elementu cudzej reguły.
 * Bez elementu: `uginanie_kolan` i `uginanie_kolan_jednonoz` w ćwiczeniach, których karta ani zestaw ogólny nie mają wskazówki ruchu (Standing Leg Curl, Standing Cable Leg Curl — zestaw „lcurl.still”;
 * Seated Band Hamstring Curl i Slider Hamstring Curl — własne wskazówki ruchu bandcurl.move / slcurl.move nie są kluczami reguł); `biodra_nieruchome_poziom` i `biodra_nieruchome_pion` (lcurl.still, llc.hips —
 * nieruchomość miednicy w cm, strefa liczbowa kind „zone” nieobsługiwany, E5); `nordic_biodra_proste`, `nordic_zakres` (ćwiczenia bez pozy v2); `plecy_most` (reguła „analogia”).
 */
import type { TechniqueDef } from '../overlay';

export const LEG_ISOLATION_TECHNIQUE: TechniqueDef[] = [
  { id: 'legExtKneeLimb', kind: 'limb', cue: ['lext.range'], rule: 'wyprost_kolan', views: ['side'], joint: 'knee', exercises: ['Leg Extension'] },
  { id: 'legExtSingleKneeLimb', kind: 'limb', cue: ['lext.range'], rule: 'wyprost_kolan_jednonoz', views: ['side'], joint: 'knee', exercises: ['Single-Leg Leg Extension'] },
  { id: 'legCurlKneeLimb', kind: 'limb', cue: ['llc.move', 'lcurl.move'], rule: 'uginanie_kolan', views: ['side'], joint: 'knee' },
];
