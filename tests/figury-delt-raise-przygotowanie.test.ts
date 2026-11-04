/*
 * Rodzina delt_raise przed recenzją niezależną (fala F1, linia 1.1, 04.11.2026): dane póz czytane wprost z pliku (rodzina niepodłączona, status „planned”).
 * Pokrycie póz, ślad toru przy chwycie (W1b), stały promień ręki prostej (bez wybrzuszeń łuku), poza leżąca na ławce (ćwiczenie dorobione w F1), wyjątek halo.
 */
import * as fs from 'fs';
import * as path from 'path';
import { keyframeFrame, type PoseData } from '@/lib/figures/v2';
import { stykPozy } from './helpers/styk-figur';

const P: Record<string, PoseData> = JSON.parse(fs.readFileSync(path.join(__dirname, '../lib/figures/v2/poses/delt_raise.json'), 'utf8')).cwiczenia;
const GEN = fs.readFileSync(path.join(__dirname, '../scripts/figures/agent-pozy/delt_raise.mjs'), 'utf8');
const d3 = (a: number[], b: number[]) => Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);
const U = Array.from({ length: 21 }, (_, i) => i / 20);
const LEZY = 'Dumbbell Lying One-Arm Rear Lateral Raise';
const ARM_RAISE = ['Lateral Raise (hantle)', 'One-Arm Lateral Raise (hantel)', 'Dumbbell Scaption', 'Front Raise', 'Alternating Deltoid Raise', 'Dumbbell Front Raise to Overhead', 'Cable Front Raise', 'Cable Lateral Raise',
  'Reverse Fly (hantle)', 'One-Arm Cable Rear Lateral Raise', 'Y Raise (hantle)', 'Cable Y Raise', 'Cable Reverse Fly', 'Machine Lateral Raise', 'Reverse Pec Deck', 'Front Incline Dumbbell Raise', LEZY];
/** Ślad bierze punkt ciężaru z klatki (info.trail), a przy braku — info.load. */
const slad = (k: string, u: number) => { const f = keyframeFrame(P[k], u); return { t: ((f.info as { trail?: number[] }).trail ?? (f.info as { load: number[] }).load) as number[], f }; };
const reka = (k: string) => (P[k].sprzet.find(g => (g as { trzyma?: string }).trzyma) as { trzyma?: 'R' | 'L' } | undefined)?.trzyma ?? 'R';
const rozrzutPromienia = (k: string) => { const r = U.map(u => { const { t, f } = slad(k, u); return d3(t, f.sk.arms[reka(k)].shoulder); }); return Math.max(...r) - Math.min(...r); };

describe('delt_raise: pokrycie póz', () => {
  test('31 póz, w tym dorobiona leżąca na ławce; halo zostaje wyjątkiem z powodem', () => {
    expect(Object.keys(P)).toHaveLength(31); expect(P[LEZY]).toBeDefined();
    expect(GEN).toMatch(/WYJATKI = \{[\s\S]*'Kettlebell Halo':/); expect(Object.keys(P)).not.toContain('Kettlebell Halo');
    expect(GEN).not.toMatch(/WYJATKI = \{[\s\S]*?'Dumbbell Lying One-Arm Rear Lateral Raise': '[^']*'[\s\S]*?\n\};\nexport const PRZYBLIZENIA/);
  });
});

describe('delt_raise: ślad toru przy chwycie (W1b)', () => {
  const PARA = ['Lateral Raise (hantle)', 'Front Raise', 'Dumbbell Scaption', 'Reverse Fly (hantle)', 'Upright Row (hantle)', 'Y Raise (hantle)', 'Alternating Deltoid Raise', 'Cable Seated Lateral Raise', 'Cable Reverse Fly', 'Cable Y Raise'];
  test.each(PARA)('%s: ślad ≤ 0,5 cm od chwytu R, a nie w osi ciała', k => {
    for (const u of U) { const { t, f } = slad(k, u); expect([k, u, d3(t, f.sk.arms.R.grip) <= 0.5]).toEqual([k, u, true]); }
  });
  test.each(['One-Arm Lateral Raise (hantel)', 'Cable Lateral Raise', 'Cable Front Raise', 'One-Arm Cable Rear Lateral Raise', 'Dumbbell One-Arm Upright Row', LEZY, 'Machine Lateral Raise'])('%s: jedna ręka — ślad przy chwycie tej ręki', k => {
    for (const u of U) { const { t, f } = slad(k, u); expect([k, u, d3(t, f.sk.arms[reka(k)].grip) <= 0.5]).toEqual([k, u, true]); }
  });
  test('miara potrafi paść: chwyt L przy parze hantli byłby poza progiem 3 cm', () => {
    const { t, f } = slad('Lateral Raise (hantle)', 1); expect(d3(t, f.sk.arms.L.grip)).toBeGreaterThan(3);
  });
});

describe('delt_raise: stały promień ręki (bez wybrzuszeń łuku)', () => {
  test.each(ARM_RAISE)('%s: odległość ciężaru od barku zmienia się o ≤ 1,5 cm w całym ruchu', k => { expect([k, rozrzutPromienia(k) <= 1.5]).toEqual([k, true]); });
  test('miara potrafi paść: wiosłowanie pionowe (łokcie zgięte) zmienia promień o > 30 cm', () => { expect(rozrzutPromienia('Upright Row (hantle)')).toBeGreaterThan(30); });
});

describe('delt_raise: poza leżąca na boku na ławce (Dumbbell Lying One-Arm Rear Lateral Raise)', () => {
  test('ławka płaska, hantel trzyma R, ciężar w górę od poziomu do pionu nad barkiem', () => {
    const g = P[LEZY].sprzet; expect(g.some(x => x.rodzaj === 'lawka' && (x as { kat: number }).kat === 0)).toBe(true); expect(reka(LEZY)).toBe('R');
    const a = slad(LEZY, 0), b = slad(LEZY, 1); expect(b.t[1] - a.t[1]).toBeGreaterThan(40);
    expect(Math.abs(b.t[0] - b.f.sk.arms.R.shoulder[0])).toBeLessThan(4); /* na końcu hantel nad barkiem */
    for (const u of U) { const f = slad(LEZY, u).f; expect([u, f.sk.pelvis[1] > 43]).toEqual([u, true]); }
  });
  test('styk: ciało na ławce, bez wnikania > 1 cm', () => { for (const x of stykPozy(P[LEZY])) expect([x.u, x.przenikanie <= 1]).toEqual([x.u, true]); });
});
