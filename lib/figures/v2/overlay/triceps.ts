/*
 * Nakładka techniki: prostowanie ramion (triceps; wszystkie rzuty rodziny: z boku). 04.11.2026 (decyzja właściciela „żadna rodzina nie wychodzi bez nakładki”, docs/18), tylko reguły „ustalone”
 * z data/zrodla/figury-sens.json (triceps) i wskazówki obecne na karcie ćwiczenia (id w `cue` = klucze wskazowki_na_reguly tej reguły; pilnuje tego tests/figures-v2-nakladka-triceps-olympic.test.tsx):
 * - `lokiec_prostuje_sie` (ruch definiujący rodzinę, zdania „Zginaj/Prostuj łokcie…”): linia bark–łokieć przedłużona za łokieć i łuk zgięcia łokcia; kąt w podpisie „Kąt na rysunku: zgięcie łokcia”;
 * - `ramie_nieruchome` dla „Łokcie przy bokach” (tpd.elbows, ściąganie liny/drążka): pion od barku w dół do wysokości miednicy — łokieć ma zostać na tym pionie (jak curlElbowPlumb).
 * Bez elementu (nie ma tu rodzaju elementu, który nie dubluje linii kończyny): `ramie_nieruchome` dla zdań ote.upperArm / skull.upperArm („ramiona nieruchomo, nad głową / pionowo”) — linia bark–łokieć
 * elementu ruchu jest tym samym odcinkiem (podwójna linia), a pion „nad głową” wymagałby wyższego kadru; zdania kick.upperArm, ote1.upperArm, tpd1.elbow nie są w wskazowki_na_reguly (badacz).
 */
import type { TechniqueDef } from '../overlay';

export const TRICEPS_TECHNIQUE: TechniqueDef[] = [
  /** Zdania ruchu „zginaj/prostuj łokcie” (lokiec_prostuje_sie): linia przez ramię i łuk zgięcia łokcia. Kąt = „Kąt na rysunku: zgięcie łokcia”. */
  { id: 'tricepsElbowLimb', kind: 'limb', cue: ['tpd.move', 'ote.move', 'skull.move', 'cote.move', 'ote.moveLoad', 'ote1.move', 'lpote.move', 'rgpd.move', 'tpd1.move', 'tate.move', 'kick.move', 'skullDb.move', 'tri.bandOte.move', 'tri.chainExt.move', 'tri.kick2.move', 'tri.skullBand.move', 'tri.skullBb.move', 'tri.skullBehind.move', 'tri.skullCb.move', 'tri.skullDb1.move'], rule: 'lokiec_prostuje_sie', views: ['side'], joint: 'elbow' },
  /** „Łokcie przy bokach” (ramie_nieruchome, ustalone): pion od barku w dół do wysokości miednicy; złamana reguła → kolor błędu. */
  { id: 'tricepsElbowPlumb', kind: 'ref', cue: ['tpd.elbows'], rule: 'ramie_nieruchome', views: ['side'], ref: { shape: 'vertical', through: 'shoulder', dir: 'down', until: 'pelvis' } },
];
