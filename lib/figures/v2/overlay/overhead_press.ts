/*
 * Nakładka techniki: wyciskanie nad głowę i pionowe (overhead_press). 09.11.2026 (partia 1, decyzja właściciela „żadna rodzina nie wychodzi bez nakładki”, docs/18),
 * tylko reguły „ustalone” z data/zrodla/figury-sens.json (overhead_press) i wskazówki obecne na karcie ćwiczenia (id w `cue` = klucze wskazowki_na_reguly tej reguły); bez nowych liczb na rysunku:
 * - `wyprost_lokci` (ohp.fullExt, press.noLock, ohp.move: „na górze wyprostuj ręce”): linia ramienia przedłużona za łokieć i łuk zgięcia łokcia w rzucie z boku (rodzaj „limb”, staw łokciowy = mierzony w DATA_UI);
 *   łuk maleje do zera, gdy ręka jest prosta nad głową (próg ≤ 20° zostaje w danych reguły);
 * - `lokcie_pod_dlonmi` (ohp.elbowsUnder: „łokcie pod nadgarstkami przez cały ruch”): pion przez NADGARSTEK w dół do wysokości łokcia (rodzaj „ref”, kształt „vertical”, rzut z boku i z przodu) — miara reguły to odległość
 *   chwytu od łokcia w osiach x i z (v2-sens.mjs `lokiec_pod_chwytem`), czyli łokieć ma leżeć na tym pionie; nadgarstek, nie chwyt, bo tak brzmi zdanie karty (różnica chwyt–nadgarstek < 10 cm, test: tests/figures-v2-ohp-p1.test.ts);
 * - `ciezar_nad_barkami` (ohp.tall: „ciężar idzie prosto w górę nad głowę”): pion przez bark w górę (rzut z boku) — na szczycie chwyt ma leżeć nad tą linią (miara reguły: |x chwytu − x barku| w najwyższym punkcie, v2-sens.mjs `ciezar_nad_barkami`).
 * Bez elementu (rodzaju elementu nie ma w silniku albo reguła nie „ustalone”): `ciezar_nad_glowe` i `start_przy_barkach` (progi liczbowe względem głowy i barków — strefy, kind „zone”, E5, nieobsługiwany), `tulow_wysoko` (rodzaj „pochylenie tułowia w ruchu”
 * nieobsługiwany; pion przez bark z `ciezar_nad_barkami` nie mierzy pochylenia tułowia), `krotkie_ugiecie` i `nogi_pracuja` (push press, Landmine Linear Jammer: staw mierzony na rysunku to łokieć, nie kolano — DATA_UI; element „limb” kolana wymagałby zmiany
 * mierzonego stawu), `tulow_podrzut` (jedno źródło + analogia), `landmine_wyprost` i `pike_zakres` (analogia — reguły ćwiczeń ich nie wpuszczają). Ćwiczenia, których karta nie ma wskazówki powiązanej z regułą
 * (Arnold, Kettlebell Press, Single Arm Overhead Press, Landmine, Pike Push Up, zza karku, See-Saw…), nie mają elementu — sama nakładka wynika z kart, nie z figury.
 */
import type { TechniqueDef } from '../overlay';

export const OHP_TECHNIQUE: TechniqueDef[] = [
  { id: 'ohpElbowLimb', kind: 'limb', cue: ['ohp.fullExt', 'press.noLock', 'ohp.move'], rule: 'wyprost_lokci', views: ['side'], joint: 'elbow' },
  { id: 'ohpElbowsUnderRef', kind: 'ref', cue: ['ohp.elbowsUnder'], rule: 'lokcie_pod_dlonmi', views: ['side', 'front'], ref: { shape: 'vertical', through: 'wrist', dir: 'down', until: 'elbow' } },
  { id: 'ohpBarOverShoulderRef', kind: 'ref', cue: ['ohp.tall'], rule: 'ciezar_nad_barkami', views: ['side'], ref: { shape: 'vertical', through: 'shoulder', dir: 'up' } },
];
