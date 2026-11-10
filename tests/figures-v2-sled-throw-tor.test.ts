/*
 * sled_throw (partia 8, 10.11.2026; K4/K5 planu recenzji rodzin): ślad toru piłki lekarskiej w dłoniach leży przy piłce (chwyt R/L albo środek między dłońmi), nie w miednicy.
 * Wada sprzed poprawki (arkusz Medicine Ball Slam): ślad piłki rysował się przy biodrze, bo `pilka_lekarska` nie było w gałęzi „ciężar w dłoniach” (contract.ts); próg ≤ 3 cm jak C1 (tests/figures-v2-tor.test.ts).
 */
import { keyframeFrame, type PoseData } from '@/lib/figures/v2';
import * as fs from 'fs';
import * as path from 'path';

const D = JSON.parse(fs.readFileSync(path.join(__dirname, '../lib/figures/v2/poses/sled_throw.json'), 'utf8')).cwiczenia as Record<string, PoseData>;
const PILKA = Object.keys(D).filter(k => D[k].sprzet.some(g => g.rodzaj === 'pilka_lekarska'));
const MAX_OD_CHWYTU = 3;
const dist3 = (a: number[], b: number[]) => Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);
const odChwytu = (tr: number[], R: number[], L: number[], trzyma?: string) => trzyma === 'R' ? dist3(tr, R) : trzyma === 'L' ? dist3(tr, L) : dist3(tr, [0, 1, 2].map(i => (R[i] + L[i]) / 2));

describe('sled_throw: ślad piłki lekarskiej przy dłoniach (K4)', () => {
  test('zestaw obejmuje 6 ćwiczeń z piłką (slamy, rzuty, Wall Ball)', () => { expect(PILKA.length).toBe(6); });
  test.each(PILKA)('%s: ślad w każdej klatce ≤ 3 cm od piłki w dłoniach (u = 0…1)', key => {
    const d = D[key]; const tz = (d.sprzet.find(g => g.rodzaj === 'pilka_lekarska') as { trzyma?: string }).trzyma;
    for (let i = 0; i <= 12; i++) { const f = keyframeFrame(d, i / 12); expect([key, i, !!f.info.trail]).toEqual([key, i, true]);
      const o = odChwytu(f.info.trail!, f.sk.arms.R.grip, f.sk.arms.L.grip, tz); expect([key, i, o <= MAX_OD_CHWYTU]).toEqual([key, i, true]); }
  });
  test('warunek potrafi paść (przypadek negatywny): miednica (stary ślad) w Medicine Ball Slam jest > 9 cm od dłoni w którejś klatce', () => {
    const d = D['Medicine Ball Slam']; const max = Math.max(...Array.from({ length: 13 }, (_, i) => { const f = keyframeFrame(d, i / 12); return odChwytu(f.sk.pelvis, f.sk.arms.R.grip, f.sk.arms.L.grip); }));
    expect(max).toBeGreaterThan(MAX_OD_CHWYTU * 3);
  });
});
