/*
 * Nakładka techniki: brzuch na leżąco i w klęku podpartym (core_floor; brzuszki, unoszenie nóg, Dead Bug, Bird Dog, Superman). 10.11.2026 (decyzja właściciela „żadna rodzina nie wychodzi bez nakładki”, docs/18),
 * tylko reguły „ustalone” z data/zrodla/figury-sens.json (core_floor) i wskazówki obecne na karcie ćwiczenia (id w `cue` = klucze wskazowki_na_reguly tej reguły); bez nowych liczb —
 * na rysunku tylko geometria (łuk i linia), progi reguł zostają w danych reguł:
 * - `lopatki_od_podlogi` (crunch.move: „zbliżaj żebra do miednicy, unosząc łopatki od podłogi”): kąt biodra — linia tułowia i uda z łukiem (rodzaj „limb”, staw „hip”); łuk rośnie razem z tułowiem.
 *   Element dostają ćwiczenia z tą wskazówką na karcie, w których mierzone jest biodro (Crunch, Crunch - Hands Overhead, Toe Touchers, Cross-Body Crunch);
 * - `bird_dog_linia` (bd.move: „unieś jednocześnie przeciwną rękę i nogę do linii tułowia”): dwie poziome linie odniesienia — przez bark (dokąd ma sięgnąć dłoń) i przez miednicę (dokąd ma sięgnąć kostka);
 *   bark i miednica w Bird Dog stoją, więc linie nie uciekają razem z ruchem.
 * Bez elementu:
 * - `miednica_na_podlodze` (crunch.lowBack, db.back), `miednica_nieruchoma` — pozioma linia przez miednicę leżącej osoby poruszałaby się razem z nią i nie pokazałaby oderwania lędźwi; potrzebna linia stała z klatki u = 0 (rodzaj „zone”, E5);
 * - `szyja_neutralna` (crunch.neck) — kąt głowa–tułów nie jest mierzonym stawem (MeasuredJoint), więc rodzaju elementu nie ma;
 * - `miednica_unosi_sie`, `kolana_ku_barkom` (rcrunch.move, rcrunch.hips) — w Reverse Crunch i Leg Pull-In mierzone jest kolano, a łuk kolana pokazałby zgięcie nóg, nie unoszenie miednicy;
 * - reguły „analogia”, „jedno źródło” i „konwencja” (miednica_nieruchoma na ławce, lopatki_od_podlogi_obustronnie, tulow_zwija_sie_biodra_stoja, superman_*, vup_*, szkielet_nieruchomy) — poniżej „ustalone” albo bez wskazówki na karcie.
 */
import type { TechniqueDef } from '../overlay';

export const CORE_FLOOR_TECHNIQUE: TechniqueDef[] = [
  { id: 'coreCrunchHipLimb', kind: 'limb', cue: ['crunch.move'], rule: 'lopatki_od_podlogi', views: ['side'], joint: 'hip' },
  { id: 'coreBirdDogShoulderLevel', kind: 'ref', cue: ['bd.move'], rule: 'bird_dog_linia', views: ['side'], ref: { shape: 'horizontal', through: 'shoulder' } },
  { id: 'coreBirdDogHipLevel', kind: 'ref', cue: ['bd.move'], rule: 'bird_dog_linia', views: ['side'], ref: { shape: 'horizontal', through: 'pelvis' } },
];
