/*
 * Figury v2, rodzina core_floor (planned) — poprawki z audytu ćwiczeń 31.10.2026 (ACG-008, ACG-009; zadanie ACG-T-012).
 * ACG-008: karta Crunch mówi „dłonie przy głowie” (crunch.setup), a dłonie były 13 cm za miednicą, ręce wzdłuż ciała.
 * ACG-009: Crunch, Sit Up, Janda Sit-Up, Oblique Crunches - On The Floor: brak biegunKolana → kolano opadało na boki (14 cm nad podłogą, 48 cm od osi).
 * Miara: keyframeFrame na klatkach kluczowych i na siatce u = 0…1 co 0,125 (jak w pętli). Progi to konwencje testowe: kolano ≥ 30 cm nad podłogą (ćwiczenia z biegunKolana mają 45 cm),
 * odchylenie kolana od osi ≤ 30 cm, dłoń ≤ 15 cm od środka głowy (zadanie ACG-T-012).
 */
import * as fs from 'fs';
import * as path from 'path';
import { SIDES, keyframeFrame, type PoseData } from '@/lib/figures/v2';

const CW: Record<string, PoseData> = JSON.parse(fs.readFileSync(path.join(__dirname, '../lib/figures/v2/poses/core_floor.json'), 'utf8')).cwiczenia;
const KOLANA = ['Crunch', 'Sit Up', 'Janda Sit-Up', 'Oblique Crunches - On The Floor'];
const GRID = Array.from({ length: 9 }, (_, i) => i / 8);
const us = (d: PoseData): number[] => [...new Set([...(d.klatki as { u: number }[]).map(k => k.u), ...GRID])];
const dist = (a: number[], b: number[]): number => Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);

describe('ACG-009 (31.10.2026): kolana w górę, nie na boki — Crunch, Sit Up, Janda Sit-Up, Oblique Crunches', () => {
  test.each(KOLANA)('%s: kolano ≥ 30 cm nad podłogą i ≤ 30 cm od osi ciała w każdej klatce', k => {
    const bad: string[] = [];
    for (const u of us(CW[k])) { const sk = keyframeFrame(CW[k], u).sk; for (const s of SIDES) { const kn = sk.legs[s].knee; if (kn[1] < 30 || Math.abs(kn[2]) > 30) bad.push(`u=${u} ${s} kolano [${kn.map(x => x.toFixed(1))}]`); } }
    expect(bad).toEqual([]);
  });
  test('Frog Sit-Ups zostaje z kolanami na boki (wyróżnik ćwiczenia, odchylenieKolana)', () => {
    const kn = keyframeFrame(CW['Frog Sit-Ups'], 0).sk.legs.R.knee; expect(Math.abs(kn[2])).toBeGreaterThan(40);
  });
});
describe('ACG-008 (31.10.2026): Crunch — dłonie przy głowie jak na karcie', () => {
  test('dłoń ≤ 15 cm od środka głowy w każdej klatce, obie strony', () => {
    const bad: string[] = [];
    for (const u of us(CW['Crunch'])) { const sk = keyframeFrame(CW['Crunch'], u).sk; for (const s of SIDES) { const d = dist(sk.arms[s].grip, sk.head); if (d > 15) bad.push(`u=${u} ${s} ${d.toFixed(1)} cm`); } }
    expect(bad).toEqual([]);
  });
  test('dłonie nie wchodzą w głowę (≥ 6 cm od środka głowy, promień głowy 9,5)', () => {
    for (const u of us(CW['Crunch'])) { const sk = keyframeFrame(CW['Crunch'], u).sk; for (const s of SIDES) expect(dist(sk.arms[s].grip, sk.head)).toBeGreaterThan(6); }
  });
});
