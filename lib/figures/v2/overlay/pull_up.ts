/*
 * Nakładka techniki: podciąganie (etap 2, 04.11.2026). Reguły rodziny mają status „ustalone” po łatce badacza i recenzji niezależnej (L-047, 04.11.2026) — elementy E3:
 * - `broda_nad_drazkiem` (pu.pull: „aż broda znajdzie się nad drążkiem”): poziom drążka przedłużony przez chwyt; na szczycie broda ma sięgnąć tej linii (margines 0 cm, część wspólna kart);
 * - `miednica_nie_buja` (pu.noSwing: „bez bujania”): pion pod drążkiem przez chwyt; ciało wisi na tym pionie (tylko Pull Up i Chin Up — tam reguła jest „ustalone”).
 * Oba elementy tylko w rzucie z boku: z przodu bujanie przód–tył nie jest widoczne, a poziom drążka pokrywa się z narysowanym drążkiem (recenzja 2R S3).
 * Bez elementu `dol_rece_proste` (łuk łokcia): na dole linia ramienia leży na pionie pod drążkiem (podwójna linia), a zdanie pu.pull jest już reprezentowane przez poziom drążka.
 */
import type { TechniqueDef } from '../overlay';

/** miednica_nie_buja: „ustalone” tylko dla Pull Up i Chin Up (figury-sens.json pull_up.reguly.miednica_nie_buja.pewnosc; pozostałe odmiany — analogia albo brak reguły w wariancie; recenzja 2R W2). */
export const PULL_UP_PLUMB_EXERCISES = ['Pull Up', 'Chin Up'];
export const PULL_UP_TECHNIQUE: TechniqueDef[] = [
  { id: 'pullChinBarRef', kind: 'ref', cue: ['pu.pull'], rule: 'broda_nad_drazkiem', views: ['side'], ref: { shape: 'horizontal', through: 'grip' } },
  { id: 'pullPlumbRef', kind: 'ref', cue: ['pu.noSwing'], rule: 'miednica_nie_buja', views: ['side'], exercises: PULL_UP_PLUMB_EXERCISES, ref: { shape: 'vertical', through: 'grip', dir: 'down' } },
];
