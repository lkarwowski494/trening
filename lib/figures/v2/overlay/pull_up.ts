/*
 * Nakładka techniki: podciąganie (etap 2, 04.11.2026). Reguły rodziny mają status „ustalone” po łatce badacza i recenzji niezależnej (L-047, 04.11.2026) — elementy E3:
 * - `broda_nad_drazkiem` (pu.pull: „aż broda znajdzie się nad drążkiem”): poziom drążka przedłużony przez chwyt; na szczycie broda ma sięgnąć tej linii (margines 0 cm, część wspólna kart);
 * - `miednica_nie_buja` (pu.noSwing: „bez bujania”): pion pod drążkiem przez chwyt; ciało wisi na tym pionie.
 * Bez elementu `dol_rece_proste` (łuk łokcia): na dole linia ramienia leży na pionie pod drążkiem (podwójna linia), a zdanie pu.pull jest już reprezentowane przez poziom drążka.
 */
import type { TechniqueDef } from '../overlay';

export const PULL_UP_TECHNIQUE: TechniqueDef[] = [
  { id: 'pullChinBarRef', kind: 'ref', cue: ['pu.pull'], rule: 'broda_nad_drazkiem', views: ['side', 'front'], ref: { shape: 'horizontal', through: 'grip' } },
  { id: 'pullPlumbRef', kind: 'ref', cue: ['pu.noSwing'], rule: 'miednica_nie_buja', views: ['side', 'front'], ref: { shape: 'vertical', through: 'grip', dir: 'down' } },
];
