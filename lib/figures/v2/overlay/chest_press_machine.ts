/*
 * Nakładka techniki: maszyny wyciskające siedząc (chest_press_machine; klatka prosto, skośnie, w dół; barki na maszynie i suwnicy Smitha). 09.11.2026 (decyzja właściciela „żadna rodzina nie wychodzi bez nakładki”, docs/18),
 * tylko reguły „ustalone” z data/zrodla/figury-sens.json (chest_press_machine) i wskazówki obecne na karcie ćwiczenia (id w `cue` = klucze wskazowki_na_reguly tej reguły); bez nowych liczb —
 * na rysunku tylko geometria (linia i łuk), progi reguł zostają w danych reguł:
 * - `zakres_klatka` (mcp.move, press.noLock: „wypchnij uchwyty do wyprostu rąk”, „bez blokowania”): linia przez ramię i łokieć + łuk zgięcia łokcia (rzut z boku), jak w wyciskaniu leżąc;
 * - `nad_glowa` (ohp.move, ohp.fullExt: wyciskanie nad głowę do wyprostu rąk): ten sam łuk zgięcia łokcia; reguła ma też próg „chwyt nad głową” (strefa liczbowa, kind „zone” nieobsługiwany, E5) — pokazujemy tylko część o łokciu;
 * - `plecy_przy_oparciu` (mcp.blades): linia tułowia miednica → barki (nieruchoma przy oparciu), jak linia pleców w martwym ciągu; wskazówki mcp.seat i ohp.seat nie są kluczami tej reguły w `wskazowki_na_reguly`, więc nie uruchamiają elementu;
 * - `start_przy_barkach` (msp.seat): poziom przez bark, przy którym uchwyty zaczynają ruch (jak poziom barków w unoszeniu ramion).
 * Reguła aktywuje element tylko w ćwiczeniach, których wariant ją ma (`warianty` w danych), więc np. Smith Machine Shoulder Press nie dostaje `zakres_klatka`.
 */
import type { TechniqueDef } from '../overlay';

export const CHEST_PRESS_MACHINE_TECHNIQUE: TechniqueDef[] = [
  { id: 'machineChestElbowLimb', kind: 'limb', cue: ['mcp.move', 'press.noLock'], rule: 'zakres_klatka', views: ['side'], joint: 'elbow' },
  { id: 'machineOverheadElbowLimb', kind: 'limb', cue: ['ohp.move', 'ohp.fullExt'], rule: 'nad_glowa', views: ['side'], joint: 'elbow' },
  { id: 'machineBackRef', kind: 'ref', cue: ['mcp.blades'], rule: 'plecy_przy_oparciu', views: ['side'], ref: { shape: 'segment', from: 'pelvis', to: 'shoulderC' } },
  { id: 'machineShoulderLevelRef', kind: 'ref', cue: ['msp.seat'], rule: 'start_przy_barkach', views: ['side'], ref: { shape: 'horizontal', through: 'shoulder' } },
];
