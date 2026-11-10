/*
 * Nakładka techniki: core stojąc i rotacje (core_standing; Pallof, skłony boczne, skręty, wiatrak, Bent Press). 10.11.2026 (partia 8; decyzja właściciela „żadna rodzina nie wychodzi bez nakładki”, docs/18),
 * tylko reguły „ustalone” z data/zrodla/figury-sens.json (core_standing) i wskazówki obecne na karcie ćwiczenia (id w `cue` = klucze wskazowki_na_reguly tej reguły); bez nowych liczb —
 * na rysunku tylko geometria (linia i łuk), progi reguł zostają w danych reguł:
 * - `pallof_wypchniecie` (pallof.move: „wypchnij dłonie od klatki, bez blokowania łokci”; Pallof Press): linia bark–łokieć i łuk zgięcia łokcia (rzut z boku), kąt w podpisie „Kąt na rysunku: zgięcie łokcia”;
 * - `sklon_boczny` (sb.plane: „skłon tylko w bok, bez skrętu i bez pochylenia w przód”; zestaw ogólny skłonów bocznych): pion od miednicy w rzucie z przodu — tułów odchyla się od niego w bok
 *   (jak standLateralPlumb w mobility_stand; ten sam rodzaj ruchu, ta sama wskazówka). Rzut z boku bez elementu: przechył w bok jest prostopadły do rzutu;
 * - `odchylenie_45` (rt.setup: „odchyl się do ok. 45°”; Russian Twist): pion od miednicy w rzucie z boku — tułów odchylony w tył od pionu (rodzaj ruchu jak pion tułowia przy wiosłowaniu);
 * - `plecy_proste` (rt.back: „plecy proste”; Russian Twist): linia miednica → bark przedłużona za bark (jak olympicBackRef): kręgosłup ma leżeć na tej prostej;
 * - `wiatrak_reka_prosta` (wm.arm: „ręka z ciężarem prosta”; wiatraki): prowadnica prostej ręki bark → chwyt przesunięta na zewnątrz ciała (rzut z przodu), jak w podciąganiu (pullArmStraightRef).
 * Bez elementu (powód):
 * - `pallof_tulow` (pallof.noTwist: „nie daj się skręcić”), `skret_w_obie_strony`, `skret_jednostronny`, `bez_skłonu_bocznego`, `sklon_bez_skretu`, `wiatrak_bok`: skręt tułowia (wokół osi pionowej) nie jest widoczny w rzucie z przodu ani z boku
 *   (jest widoczny tylko z góry, a rodzina ma rzuty front i side), a rodzaje elementów silnika (limb, abduction, ref) nie mają stopnia swobody „skręt”; skręty bez elementu to też reguły „analogia” (skret_jednostronny) i „uproszczenie”;
 * - `pallof_wysokosc` (pallof.setup, „część wspólna”): to strefa liczbowa (chwyt 0–35 cm pod barkami w całym ruchu), a kind „zone” jest nieobsługiwany (E5); linia poziomu barku pokazałaby tylko górną granicę strefy;
 * - `sklon_bez_pochylenia` (pochylenie_tulowia_ruch, „ustalone” bez własnego cue poza sb.plane): ten sam cue już rysuje `sklon_boczny`; drugi element tej wskazówki wymagałby rzutu z boku, w którym nie niesie treści;
 * - `wiatrak_ciezar_nad_barkiem`, `wiatrak_plecy` (Kettlebell Windmill; „jedno źródło”), wiatrak_plecy/wiatrak_bok dla Bent Press i Double Kettlebell Windmill („analogia”), reguły ćwiczeń bez karty ruchu (woodchop, judo flip, landmine: tylko „analogia”).
 * Ślad toru ciężaru: brak (ciężar i uchwyt nie mają ustalonej reguły toru w tej rodzinie; decyzja właściciela 04.11.2026 (4) B: bez ról mięśni).
 */
import type { TechniqueDef } from '../overlay';

/** Wiatraki, których wskazówka wm.arm (ręka z ciężarem prosta) jest na karcie: Kettlebell Windmill i Double Kettlebell Windmill (reguła _wiatrak „ustalone”); Bent Press ma regułę tylko z analogii. */
export const WINDMILL_EXERCISES = ['Kettlebell Windmill', 'Double Kettlebell Windmill'];
export const CORE_STANDING_TECHNIQUE: TechniqueDef[] = [
  { id: 'pallofElbowLimb', kind: 'limb', cue: ['pallof.move'], rule: 'pallof_wypchniecie', views: ['side'], joint: 'elbow', exercises: ['Pallof Press'] },
  { id: 'sideBendPlumb', kind: 'ref', cue: ['sb.plane'], rule: 'sklon_boczny', views: ['front'], ref: { shape: 'vertical', through: 'pelvis', dir: 'up' } },
  { id: 'twistLeanPlumb', kind: 'ref', cue: ['rt.setup'], rule: 'odchylenie_45', views: ['side'], ref: { shape: 'vertical', through: 'pelvis', dir: 'up' } },
  { id: 'twistBackRef', kind: 'ref', cue: ['rt.back'], rule: 'plecy_proste', views: ['side'], ref: { shape: 'segment', from: 'pelvis', to: 'shoulderC' } },
  { id: 'windmillArmStraightRef', kind: 'ref', cue: ['wm.arm'], rule: 'wiatrak_reka_prosta', views: ['front'], exercises: WINDMILL_EXERCISES, ref: { shape: 'parallel', from: 'shoulder', to: 'grip' } },
];
