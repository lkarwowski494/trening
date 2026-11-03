/*
 * Poprawki wspólne po recenzji curl (03.11.2026, W1 i W2; pliki lib/figures/v2/contract.ts i draw.ts — zmieniają skróty rodzin v2, dlatego w osobnym commicie):
 * W1 ślad toru ćwiczeń z ciężarem w dłoni (hantel, wyciąg, dźwignia, bez sztangi) = chwyt, nie miednica; W2 talerze gryfu krótszego niż 220 cm leżą na jego końcach.
 */
import * as fs from 'fs';
import * as path from 'path';
import { keyframeFrame, plateZs, EQUIP, type PoseData } from '@/lib/figures/v2';

const CURL: Record<string, PoseData> = JSON.parse(fs.readFileSync(path.join(__dirname, '../lib/figures/v2/poses/curl.json'), 'utf8')).cwiczenia;
const dist = (a: number[], b: number[]) => Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);

describe('W1: ślad toru ciężaru w dłoni = chwyt', () => {
  test('hantle obiema rękami: ślad w środku między chwytami, nie w miednicy (Hammer Curl, u = 0 i 0,5)', () => {
    for (const u of [0, 0.5]) { const f = keyframeFrame(CURL['Hammer Curl'], u); const g = [0, 1, 2].map(i => (f.sk.arms.R.grip[i] + f.sk.arms.L.grip[i]) / 2);
      expect([u, dist(f.info.trail!, g) < 1e-6, dist(f.info.trail!, f.sk.pelvis) > 5]).toEqual([u, true, true]); }
  });
  test('jedna ręka z hantlem: ślad = chwyt ręki trzymającej (Cross Body Hammer Curl)', () => {
    const f = keyframeFrame(CURL['Cross Body Hammer Curl'], 0.5); expect(dist(f.info.trail!, f.sk.arms.R.grip)).toBeLessThan(1e-6);
  });
  test('wyciąg i dźwignia maszyny: ślad = chwyt (Cable Curl, Machine Biceps Curl)', () => {
    for (const k of ['Cable Curl', 'Machine Biceps Curl']) { const f = keyframeFrame(CURL[k], 0.5); const g = [0, 1, 2].map(i => (f.sk.arms.R.grip[i] + f.sk.arms.L.grip[i]) / 2); expect([k, dist(f.info.trail!, g) < 1e-6 || dist(f.info.trail!, f.sk.arms.R.grip) < 1e-6]).toEqual([k, true]); }
  });
  test('sztanga: zasada bez zmian (EZ Bar Curl: ślad jak dotąd — bez zmian)', () => {
    const f = keyframeFrame(CURL['EZ Bar Curl'], 0.5); expect(f.info.load).toBeDefined(); expect(dist(f.info.trail!, f.sk.pelvis)).toBeLessThan(1e-6);
  });
});

describe('W2: talerze gryfu łamanego (dlugosc 120) na końcach gryfu', () => {
  test('plateZs: pełny gryf 220 i brak długości bez zmian (EQUIP.plateZ)', () => { expect(plateZs()).toEqual(EQUIP.plateZ); expect(plateZs(220)).toEqual(EQUIP.plateZ); expect(plateZs(250)).toEqual(EQUIP.plateZ); });
  test('plateZs(120): oba talerze wewnątrz gryfu (|z| < 60 − promień połowy grubości), zewnętrzny 7 cm od końca', () => {
    const z = plateZs(120); expect(z[0]).toBeLessThan(z[1]); expect(z[1]).toBeLessThan(60 - EQUIP.plateW / 2); expect(60 - z[1]).toBe(7);
  });
});
