/*
 * Nakładka techniki: skoki i plyometria (plyo; rzut z boku, skoki w bok i Star Jump także z przodu). 10.11.2026 (decyzja właściciela „żadna rodzina nie wychodzi bez nakładki”, docs/18), tylko reguły
 * „ustalone” z data/zrodla/figury-sens.json (plyo) i wskazówki obecne na karcie ćwiczenia (id w `cue` = klucze wskazowki_na_reguly tej reguły); bez nowych liczb — na rysunku tylko geometria, progi zostają w danych reguł:
 * - `miekkie_ladowanie` (jump.land / bj.land „ląduj miękko na ugiętych nogach”): linia przez kończynę i łuk w stawie mierzonym ćwiczenia (rodzaj „limb”, bez stałego
 *   stawu: biodro albo kolano — ten z kandydatów rodziny, który rusza się najbardziej; reguła wymaga ugięcia obu: kolano ≥ 30°, biodro ≥ 20°) — łuk prostuje się przy wybiciu i rośnie po lądowaniu,
 *   więc pokazuje oba końce skoku; tylko rzut z boku (kąt zgięcia w rzucie z przodu nie jest kątem zgięcia);
 * - `zamach_rak` (jump.drive / bj.move „wybij się z zamachem rąk”): poziom przez bark — dłoń przy zamachu dochodzi do tej linii albo wyżej; reguła nie należy do wariantów `_podskok` i `_obciazony`,
 *   więc element nie rysuje się przy podskokach i skoku ze sztangą (wybór przez reguły wariantu w reguly-cwiczen.json).
 * Bez elementu:
 * - `wyprost_przy_wybiciu` (ustalone, ta sama wskazówka jump.drive): drugi łuk przekroczyłby OVERLAY_MAX_ARCS = 1, a łuk stawu mierzonego pokazuje już wyprost przy wybiciu;
 * - `faza_lotu` (definicja) i `kolana_do_klatki` (jedno źródło; Tuck Jump): nie „ustalone”.
 */
import type { TechniqueDef } from '../overlay';

export const PLYO_TECHNIQUE: TechniqueDef[] = [
  { id: 'plyoLandLimb', kind: 'limb', cue: ['jump.land', 'bj.land'], rule: 'miekkie_ladowanie', views: ['side'] },
  { id: 'plyoShoulderLevelRef', kind: 'ref', cue: ['jump.drive', 'bj.move'], rule: 'zamach_rak', views: ['side', 'front'], ref: { shape: 'horizontal', through: 'shoulder' } },
];
