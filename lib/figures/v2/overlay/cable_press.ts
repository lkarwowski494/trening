/*
 * Nakładka techniki: wyciskanie na linkach (cable_press; stojąc, jednorącz, siedząc, ławka skośna). 10.11.2026 (decyzja właściciela „żadna rodzina nie wychodzi bez nakładki”, docs/18),
 * tylko reguły „ustalone” z data/zrodla/figury-sens.json (cable_press) i wskazówki obecne na karcie ćwiczenia (id w `cue` = klucze wskazowki_na_reguly tej reguły); bez nowych liczb —
 * progi reguł zostają w danych reguł:
 * - `zakres` (mcp.move, press.noLock: „wypchnij uchwyty do prostych rąk”, „wyprostuj ręce, bez blokowania łokci”): linia bark–łokieć przedłużona za łokieć i łuk zgięcia łokcia
 *   (rzut z boku); kąt w podpisie „Kąt na rysunku: zgięcie łokcia”;
 * - `tulow_stabilny` (cpress.base: „stopy w podłogę, napięty brzuch, tułów stabilny”): linia tułowia miednica → bark (nieruchomy odcinek, rzut z boku) — w ruchu rąk linia ma stać w miejscu
 *   (jak olympicBackRef, ale z innej reguły i wskazówki).
 * Bez elementu:
 * - `lawka_kontakt` (bp.contact, bp.mis.arch: Incline Cable Chest Press): pewność „analogia” (reguła z wyciskania sztangą), nie „ustalone”;
 * - cpress.seated / cpress.seatedMove / cpress.setup / mcp.blades (karta własna siedzącego i stojącego): nie są w wskazowki_na_reguly żadnej reguły — Seated Cable Chest Press ma więc rysunek bez nakładki,
 *   dopóki badacz nie przypisze jej wskazówek;
 * - Single Arm Cable Chest Press: `otwarte_czesciowo` — reguła zakresu łokcia wymaga oznaczenia ręki pracującej (sprzet.trzyma), generator ją ustawia; rysunek mierzy rękę pracującą.
 */
import type { TechniqueDef } from '../overlay';

export const CABLE_PRESS_TECHNIQUE: TechniqueDef[] = [
  /** Zdania ruchu z regułą `zakres` (lokiec_zakres_ruch, ustalone): linia przez ramię i łuk zgięcia łokcia. Kąt = „Kąt na rysunku: zgięcie łokcia”. */
  { id: 'cablePressElbowLimb', kind: 'limb', cue: ['mcp.move', 'press.noLock'], rule: 'zakres', views: ['side'], joint: 'elbow' },
  /** Zdanie podstawy z regułą `tulow_stabilny` (tulow_nieruchomy, ustalone (kierunek)): linia tułowia miednica → bark; w ruchu rąk stoi w miejscu. */
  { id: 'cablePressTorsoRef', kind: 'ref', cue: ['cpress.base'], rule: 'tulow_stabilny', views: ['side'], ref: { shape: 'segment', from: 'pelvis', to: 'shoulderC' } },
];
