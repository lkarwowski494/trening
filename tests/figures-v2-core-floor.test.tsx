/*
 * (10.11.2026, partia 7 linii 1.1) Rodzina core_floor (21 ćwiczeń: brzuszki, unoszenie nóg, Dead Bug, Bird Dog, Superman, V-Up …) po włączeniu:
 *  - dane: 21 ćwiczeń z rysunkiem w widoku z boku; miednica leżącej osoby przy podłodze (reguła miednica_na_podlodze, próg z danych reguły: K5), stopy na podłodze w ćwiczeniach ze stopami płasko;
 *  - kierunek u i fazy: unoszenie 1 s / opuszczanie 2 s; Dead Bug (opuszczanie od u = 0) i Scissor Kick (naprzemiennie) jako wyjątki; Hollow Hold = izometria (jedna pozycja);
 *  - Superman: błąd cobra.mis wstrzymany (bledy-wstrzymane.json) — plik póz bez pozy błędu;
 *  - nakładka: element łuku biodra tylko przy wskazówce crunch.move i mierzonym biodrze, dwie linie poziome w Bird Dog tylko przy bd.move; reszta reguł bez elementu (powód w nagłówku overlay/core_floor.ts).
 * Nie jest strażnikiem procesu — przypadek „gałąź z wcześniejszymi zmianami” (L-080) nie dotyczy.
 */
jest.mock('@/lib/figures/data.json', () => require('./figure-gate-open').openFigureGate(jest.requireActual('@/lib/figures/data.json'))); /* bramka 4 otwarta: ten test sprawdza rysowanie, nie recenzję rodziny */
import * as fs from 'fs';
import * as path from 'path';
import { figureSpec, frameAt, keyframeFrame, measuredJoint, phasesFor, poseKeys, staticPositions, DATA_UI, ISOMETRIC, type PoseData } from '@/lib/figures/v2';
import { techniquesFor, TECHNIQUE } from '@/lib/figures/v2/overlay';
import { CORE_FLOOR_TECHNIQUE } from '@/lib/figures/v2/overlay/core_floor';
import { techniquesOf } from '@/lib/figures/v2/ui';

const ROOT = path.join(__dirname, '..');
const poses = JSON.parse(fs.readFileSync(path.join(ROOT, 'lib/figures/v2/poses/core_floor.json'), 'utf8')).cwiczenia as Record<string, PoseData>;
const sens = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/zrodla/figury-sens.json'), 'utf8')).rodziny.core_floor;
const KLUCZE = ['Crunch', 'Frog Sit-Ups', 'Janda Sit-Up', 'Oblique Crunches - On The Floor', 'Sit Up', 'Toe Touchers', 'Bicycle Crunch', 'Cross-Body Crunch', 'Scissor Kick', 'Bird Dog', 'Crunch - Hands Overhead', 'Dead Bug', 'Hollow Hold', 'Lying Leg Raise', 'Reverse Crunch', 'Tuck Crunch', 'Cocoons', 'Leg Pull-In', 'Superman', 'V-Up', 'Alternate Heel Touchers'];
const US = Array.from({ length: 21 }, (_, i) => +(i / 20).toFixed(2));
const LEZACE = KLUCZE.filter(k => k !== 'Bird Dog' && k !== 'Superman'); /* leżenie na plecach; Superman na brzuchu (miednica przy podłodze też), Bird Dog w klęku */

describe('core_floor: dane i rysunek', () => {
  test('21 ćwiczeń z rysunkiem w widoku z boku, wszystkie z generatora (plik póz = generuj(), tests/figury-generator-odtwarza.test.ts)', () => {
    expect(poseKeys('core_floor').sort()).toEqual([...KLUCZE].sort());
    for (const k of KLUCZE) { const s = figureSpec(k)!; expect([k, !!s, s.views]).toEqual([k, true, ['side']]); }
  });
  test('leżenie: miednica w każdym kadrze co 0,05 nie wyżej niż max_y_cm reguły miednica_na_podlodze (z danych reguły, nie z póz) — Reverse Crunch i Leg Pull-In unoszą miednicę z założenia, więc tylko w u = 0', () => {
    const max = sens.reguly.miednica_na_podlodze.parametry.max_y_cm as number;
    for (const k of [...LEZACE, 'Superman']) for (const u of US) {
      if (u > 0 && ['Reverse Crunch', 'Leg Pull-In', 'Cocoons'].includes(k)) continue;
      expect([k, u, keyframeFrame(poses[k], u).sk.pelvis[1] <= max]).toEqual([k, u, true]);
    }
  });
  test('negatyw: miednica 6 cm nad podłogą w Crunch jest wykrywana przez ten sam próg', () => {
    const d = JSON.parse(JSON.stringify(poses['Crunch'])) as PoseData; for (const kf of (d as any).klatki) kf.miednica[1] += 6;
    expect(keyframeFrame(d, 0).sk.pelvis[1] <= sens.reguly.miednica_na_podlodze.parametry.max_y_cm).toBe(false);
  });
  test('Superman: plik póz bez pozy błędu (cobra.mis wstrzymany w bledy-wstrzymane.json do recenzji pozy błędu)', () => {
    expect((poses['Superman'] as any).bledy).toEqual([]);
    expect(JSON.parse(fs.readFileSync(path.join(ROOT, 'scripts/figures/agent-pozy/bledy-wstrzymane.json'), 'utf8'))['cobra.mis']).toEqual(expect.stringContaining('core_floor'));
  });
});

describe('core_floor: prezentacja (fazy, staw, kierunek)', () => {
  const f = (k: string) => phasesFor(figureSpec(k)!).map(p => [p.name, p.ms]);
  test('domyślnie Unoszenie 1 s, Opuszczanie 2 s (u 0 → 1 = szczyt skurczu); Dead Bug: Opuszczanie 2 s, potem Unoszenie 1 s; Scissor Kick: jedna faza Naprzemiennie', () => {
    for (const k of KLUCZE.filter(x => !['Dead Bug', 'Scissor Kick', 'Hollow Hold'].includes(x))) expect([k, f(k)]).toEqual([k, [['Unoszenie', 1000], ['Pauza', 500], ['Opuszczanie', 2000], ['Pauza', 500]]]);
    expect(f('Dead Bug')).toEqual([['Opuszczanie', 2000], ['Pauza', 500], ['Unoszenie', 1000], ['Pauza', 500]]);
    expect(f('Scissor Kick').map(x => x[0])).toEqual(expect.arrayContaining(['Naprzemiennie']));
    expect(Object.keys(DATA_UI.core_floor.exceptions!).sort()).toEqual(['Dead Bug', 'Scissor Kick']);
  });
  test('Hollow Hold (czas): izometria — jedna pozycja statyczna; pozostałe ćwiczenia animowane', () => {
    expect(ISOMETRIC.has('Hollow Hold')).toBe(true); expect(figureSpec('Hollow Hold')!.static).toBe(true); expect(staticPositions(figureSpec('Hollow Hold')!)).toEqual([1]);
    for (const k of KLUCZE.filter(x => x !== 'Hollow Hold')) expect([k, figureSpec(k)!.static]).toEqual([k, false]);
  });
  test('staw mierzony: kolano w Bird Dog, Dead Bug i Leg Pull-In, biodro w pozostałych (to, które rusza się najbardziej)', () => {
    for (const k of KLUCZE.filter(x => x !== 'Hollow Hold')) { const j = measuredJoint(figureSpec(k)!); expect(DATA_UI.core_floor.joints).toContain(j); if (['Bird Dog', 'Dead Bug', 'Leg Pull-In'].includes(k)) expect([k, j]).toEqual([k, 'knee']); }
  });
  test('Bird Dog: bark i miednica nieruchome w całym ruchu (≤ 2 cm), ręka i przeciwna noga unoszone razem (kierunek u 0 → 1 = wyprost)', () => {
    const y = (u: number) => { const s = frameAt(figureSpec('Bird Dog')!, u).sk; return [s.shoulderC[1], s.pelvis[1]]; };
    for (const u of US) { expect([u, Math.abs(y(u)[0] - y(0)[0]) <= 2 && Math.abs(y(u)[1] - y(0)[1]) <= 2]).toEqual([u, true]); }
  });
});

describe('core_floor: nakładka techniki', () => {
  test('trzy elementy: łuk biodra (crunch.move, lopatki_od_podlogi) i dwie linie poziome Bird Dog (bd.move, bird_dog_linia); reguły elementów mają pewność „ustalone” w danych', () => {
    expect(TECHNIQUE.core_floor).toBe(CORE_FLOOR_TECHNIQUE);
    expect(CORE_FLOOR_TECHNIQUE.map(d => [d.id, d.kind, d.rule, d.cue])).toEqual([
      ['coreCrunchHipLimb', 'limb', 'lopatki_od_podlogi', ['crunch.move']], ['coreBirdDogShoulderLevel', 'ref', 'bird_dog_linia', ['bd.move']], ['coreBirdDogHipLevel', 'ref', 'bird_dog_linia', ['bd.move']]]);
    for (const d of CORE_FLOOR_TECHNIQUE) { expect([d.id, sens.reguly[d.rule].pewnosc]).toEqual([d.id, 'ustalone']); expect(d.views).toEqual(['side']); expect(sens.wskazowki_na_reguly[d.cue[0]]).toContain(d.rule); }
  });
  test('element tylko przy wskazówce: bez crunch.move / bd.move brak, z nią jest (techniquesFor)', () => {
    expect(techniquesFor('core_floor', ['crunch.lowBack'], 'Crunch')).toEqual([]);
    expect(techniquesFor('core_floor', ['crunch.move'], 'Crunch').map(d => d.id)).toEqual(['coreCrunchHipLimb']);
    expect(techniquesFor('core_floor', ['bd.move'], 'Bird Dog').map(d => d.id)).toEqual(['coreBirdDogShoulderLevel', 'coreBirdDogHipLevel']);
  });
  test('ćwiczenia z elementem: Crunch (własna karta crunch.move) ma łuk biodra, Bird Dog dwie linie; ćwiczenia bez wskazówki crunch.move/bd.move (Dead Bug, Superman, V-Up, Reverse Crunch) bez elementów', () => {
    expect(techniquesOf('Crunch')).toEqual(['coreCrunchHipLimb']); expect(techniquesOf('Bird Dog')).toEqual(['coreBirdDogShoulderLevel', 'coreBirdDogHipLevel']);
    for (const k of ['Dead Bug', 'Superman', 'V-Up', 'Reverse Crunch', 'Hollow Hold']) expect([k, techniquesOf(k)]).toEqual([k, []]);
  });
});
