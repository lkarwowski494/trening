/*
 * Nakładka techniki: pompki, deski, rollouty i ruchy w podporze (pushup_plank; rzut z boku). 09.11.2026 (decyzja właściciela „żadna rodzina nie wychodzi bez nakładki”, docs/18),
 * tylko reguły „ustalone” z data/zrodla/figury-sens.json (pushup_plank) i wskazówki obecne na karcie ćwiczenia (id w `cue` = klucze wskazowki_na_reguly tej reguły); bez nowych liczb —
 * na rysunku tylko geometria (linia, łuk), progi reguł zostają w danych reguł:
 * - `pompka_zakres` (push.move, ipush.move: „w dół, aż klatka prawie dotknie podłogi…”): linia bark–łokieć przedłużona za łokieć i łuk zgięcia łokcia, kąt w podpisie „Kąt na rysunku: zgięcie łokcia” (jak curl, triceps);
 * - `cialo_w_linii` (push.rigid, plank.noSag, splank.noSag, inv.rigid: „ciało w jednej linii”): linia bark → kostka przedłużona za kostkę (odcinek segment); miednica ma zostać na tej linii (biodra nie opadają i nie unoszą się);
 * - `rollout_linia_kolana` (ro.back: „plecy proste, biodra nie wypychają się w przód”): linia bark → kolano; element tylko dla odmian z regułą „ustalone” (rollout z kolan: Ab Wheel, Rollout (sztanga)).
 * Bez elementu: `rollout_linia_kostki` (Standing Barbell Rollout, Suspended Fallout) — pewność „analogia”; `klatka_przy_dloniach` (strefa liczbowa: oś barków ≤ 20 cm nad dłońmi, kind „zone” nieobsługiwany, E5);
 * `miednica_stala_wysokosc` (mc.stable: Mountain Climbers) — pozioma linia przez miednicę poruszałaby się razem z nią, więc nie pokazałaby, czy wysokość się zmienia (potrzebna linia stała z klatki u = 0; element „zone”);
 * `lokcie_nie_w_bok` (konwencja — część wspólna sprzecznych źródeł, nie „ustalone”).
 */
import type { TechniqueDef } from '../overlay';

export const PUSHUP_PLANK_TECHNIQUE: TechniqueDef[] = [
  { id: 'pushupElbowLimb', kind: 'limb', cue: ['push.move', 'ipush.move'], rule: 'pompka_zakres', views: ['side'], joint: 'elbow' },
  { id: 'pushupBodyLine', kind: 'ref', cue: ['push.rigid', 'plank.noSag', 'splank.noSag', 'inv.rigid'], rule: 'cialo_w_linii', views: ['side'], ref: { shape: 'segment', from: 'shoulder', to: 'ankle' } },
  { id: 'rolloutKneeLine', kind: 'ref', cue: ['ro.back'], rule: 'rollout_linia_kolana', views: ['side'], ref: { shape: 'segment', from: 'shoulder', to: 'knee' } },
];
