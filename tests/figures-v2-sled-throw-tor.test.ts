/*
 * sled_throw (partia 8, 10.11.2026; K4/K5 planu recenzji rodzin): ślad toru piłki lekarskiej w dłoniach leży przy piłce (chwyt R/L albo środek między dłońmi), nie w miednicy.
 * Wada sprzed poprawki (arkusz Medicine Ball Slam): ślad piłki rysował się przy biodrze, bo `pilka_lekarska` nie było w gałęzi „ciężar w dłoniach” (contract.ts); próg ≤ 3 cm jak C1 (tests/figures-v2-tor.test.ts).
 */
import { keyframeFrame, type PoseData } from '@/lib/figures/v2';
import { EQUIP } from '@/lib/figures/v2/draw';
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
      /* scalenie partii 8 (10.11.2026, contract.ts wariant E — wersja core_standing r1 W5): ślad piłki = środek piłki (props `ball`), nie chwyt; piłka przy dłoni: środek ≤ promień + 3 cm od chwytu (jedna dłoń trzyma piłkę od spodu) */
      const b = f.props.find(p => p.k === 'ball'); expect([key, i, b?.k]).toEqual([key, i, 'ball']); if (!b || b.k !== 'ball') continue;
      expect([key, i, dist3(f.info.trail!, b.c) <= MAX_OD_CHWYTU]).toEqual([key, i, true]);
      const o = odChwytu(b.c, f.sk.arms.R.grip, f.sk.arms.L.grip, tz); expect([key, i, o <= (b.r ?? EQUIP.medBallR) + MAX_OD_CHWYTU]).toEqual([key, i, true]); }
  });
  test('warunek potrafi paść (przypadek negatywny): miednica (stary ślad) w Medicine Ball Slam jest > 9 cm od dłoni w którejś klatce', () => {
    const d = D['Medicine Ball Slam']; const max = Math.max(...Array.from({ length: 13 }, (_, i) => { const f = keyframeFrame(d, i / 12); return odChwytu(f.sk.pelvis, f.sk.arms.R.grip, f.sk.arms.L.grip); }));
    expect(max).toBeGreaterThan(MAX_OD_CHWYTU * 3);
  });
});

describe('sled_throw: Backward Medicine Ball Throw kończy rzut piłką za głową (W1, recenzja r1 10.11.2026)', () => {
  /* Wada: w u = 1 chwyt był 5,3 cm PRZED linią barków (piłka nad głową, nie „za siebie”; karta: „przerzuć ją nad głową za siebie”). */
  const f1 = () => keyframeFrame(D['Backward Medicine Ball Throw'], 1);
  test('u = 1: x chwytu (środek dłoni) < x barku, piłka za linią barków', () => {
    const f = f1(); const R = f.sk.arms.R.grip, L = f.sk.arms.L.grip; const gx = (R[0] + L[0]) / 2;
    expect(gx).toBeLessThan(f.sk.shoulderC[0]);
  });
  test('u = 1: tułów odchylony w tył wyraźniej niż 6° (odchylenie ≥ 12° za pionem)', () => {
    const f = f1(); const dx = f.sk.shoulderC[0] - f.sk.pelvis[0], dy = f.sk.shoulderC[1] - f.sk.pelvis[1];
    expect(Math.atan2(dx, dy) * 180 / Math.PI).toBeLessThanOrEqual(-12);
  });
});
