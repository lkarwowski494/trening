/*
 * Nakładka techniki: wiosłowanie na linkach i maszynie, face pull (cable_row; rzut z boku). 09.11.2026 (decyzja właściciela „żadna rodzina nie wychodzi bez nakładki”, docs/18),
 * tylko reguły „ustalone” z data/zrodla/figury-sens.json (cable_row) i wskazówki obecne na karcie ćwiczenia (id w `cue` = klucze wskazowki_na_reguly tej reguły); bez nowych liczb —
 * na rysunku tylko geometria (linia, łuk, pion), progi reguł zostają w danych reguł:
 * - `zakres_lokcia` (scr.pull, fp.move: „przyciągnij uchwyt…”): linia bark–łokieć przedłużona za łokieć i łuk zgięcia łokcia, kąt w podpisie „Kąt na rysunku: zgięcie łokcia” (jak curl, triceps);
 * - `tulow_stabilny` (scr.control — wiosłowanie siedząc/klęcząc/jednorącz z zestawu ogólnego): pion przez miednicę w górę; tułów ma zostać blisko tego pionu, bez bujania;
 * - `lokiec_za_plecami` (fp.elbowsBack, tylko Face Pull i Cable Rope Rear-Delt Rows — te odmiany mają regułę „ustalone”; w wiosłowaniu to analogia): pion przez bark; łokieć ma przejść za ten pion;
 * Bez elementu: `plecy_neutralne` (scr.sit, scr.chest) — jedyna linia pleców `backLine` należy do squat/hinge (overlay/hinge.ts; testy pilnują jej listy wskazówek i reguł), a nowy element nakładki dublowałby tułów w pionie (`tulow_stabilny`); pytanie do leada: rozszerzyć `backLine` o rodzinę row/cable_row?
 * Bez elementu: `tulow_stabilny` dla fp.chest (Face Pull, Rope Rear-Delt) — pion przez miednicę pokrywałby się z pionem przez bark (`lokiec_za_plecami`: tułów stoi pionowo), podwójna linia;
 * scrow.* i mrow.* (karty własne Standing Cable Row i Machine Row) — ich id nie są w `wskazowki_na_reguly` rodziny (badacz), więc bez reguły nie ma elementu;
 * `Sled Row` — bez rysunku (zestaw „open”).
 */
import type { TechniqueDef } from '../overlay';

/** lokiec_za_plecami: pewność „ustalone (face pull); analogia (wiosłowanie)” — element tylko dla ćwiczeń face pull (figury-sens.json cable_row.reguly.lokiec_za_plecami). */
export const CABLE_ROW_ELBOW_BACK_EXERCISES = ['Face Pull', 'Cable Rope Rear-Delt Rows'];
/** tulow_stabilny z pionem przez miednicę: wiosłowania; Face Pull i Rope Rear-Delt mają pion przez bark (podwójna linia). */
export const CABLE_ROW_TORSO_EXERCISES = ['Seated Cable Row', 'Wiosłowanie na linkach (siedząc)', 'Single Arm Cable Row', 'Leverage High Row', 'Kneeling High Pulley Row'];
export const CABLE_ROW_TECHNIQUE: TechniqueDef[] = [
  { id: 'cableRowElbowLimb', kind: 'limb', cue: ['scr.pull', 'fp.move'], rule: 'zakres_lokcia', views: ['side'], joint: 'elbow' },
  { id: 'cableRowTorsoPlumb', kind: 'ref', cue: ['scr.control'], rule: 'tulow_stabilny', views: ['side'], exercises: CABLE_ROW_TORSO_EXERCISES, ref: { shape: 'vertical', through: 'pelvis', dir: 'up' } },
  { id: 'cableRowElbowBackPlumb', kind: 'ref', cue: ['fp.elbowsBack'], rule: 'lokiec_za_plecami', views: ['side'], exercises: CABLE_ROW_ELBOW_BACK_EXERCISES, ref: { shape: 'vertical', through: 'shoulder', dir: 'both' } },
];
