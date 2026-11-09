/*
 * Nakładka techniki: kettlebell i hantel balistycznie (kb_ballistic: swing, zarzut, rwanie, wyciskania z nóg; rzut z boku). 09.11.2026 (decyzja właściciela „żadna rodzina nie wychodzi bez nakładki”, docs/18;
 * strażnik tests/figures-v2-nakladka-kazda-rodzina.test.tsx), tylko reguły „ustalone” z data/zrodla/figury-sens.json (kb_ballistic) i wskazówki obecne na karcie ćwiczenia; bez nowych liczb na rysunku — tylko geometria:
 * - `plecy` (hinge.back „plecy proste”; swing, swing jednorącz, Sumo High Pull): linia pleców = odcinek miednica → bark przedłużony za bark (jak w zawiasie), przez cały ruch;
 * - `wyprost_swing` (kb.move „biodra napędzają ruch”; swing i swing jednorącz — „ustalone (kierunek) + jedno źródło pomiarowe”): linia przez kończynę i łuk w biodrze (kąt w podpisie), staw, który napędza ruch.
 * Bez elementu: `zawias_swing` (kierunek + jedno źródło), `reka_na_wysokosc` (jedno źródło + konwencja), `sumo_kolana` (ustalone, ale rozstaw kolan względem stóp to rzut z przodu; ta rodzina ma tylko widok z boku),
 * wszystkie reguły zarzutu, rwania i wyciskań (`kbo_*`, `pp_*`) mają pewność „analogia” (do ćwiczeń ze sztangą) — nie są „ustalone”, więc bez linii na rysunku.
 */
import type { TechniqueDef } from '../overlay';

export const KB_BALLISTIC_TECHNIQUE: TechniqueDef[] = [
  { id: 'kbBackRef', kind: 'ref', cue: ['hinge.back'], rule: 'plecy', views: ['side'], ref: { shape: 'segment', from: 'pelvis', to: 'shoulderC' } },
  { id: 'kbHipLimb', kind: 'limb', cue: ['kb.move'], rule: 'wyprost_swing', views: ['side'], joint: 'hip' },
];
