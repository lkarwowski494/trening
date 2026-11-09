/*
 * (09.11.2026, D1 wariant A koordynatora linii 1.1, partia 3) Ślad toru ciężaru dźwigni maszyny z punktem styku poza dłońmi (`punkt`: podeszwy, kostki, miednica):
 * ślad = punkt styku dźwigni z ciałem (podeszwy/kostki → kostka strony `trzyma`, przy „obie” — R; miednica → miednica), a nie chwyt dłoni (nieruchomy uchwyt) ani brak śladu (Leg Press, trzyma „obie”).
 * Zmiana pliku wspólnego (contract.ts): rodziny ready bez dźwigni poza dłońmi mają ten sam wynik rysunku (skróty `node scripts/zrodla-runtime.mjs --skroty` przed i po równe).
 * Przypadek „gałąź z wcześniejszymi zmianami” (L-080) nie dotyczy: to nie strażnik procesu, tylko logika silnika.
 */
import * as fs from 'fs';
import * as path from 'path';
import { keyframeFrame, type PoseData } from '@/lib/figures/v2';

const poses = (f: string) => JSON.parse(fs.readFileSync(path.join(__dirname, `../lib/figures/v2/poses/${f}.json`), 'utf8')).cwiczenia as Record<string, PoseData>;
const dist = (a: number[], b: number[]) => Math.hypot(...a.map((x, i) => x - b[i]));
const US = [0, 0.25, 0.5, 0.75, 1];

describe('ślad dźwigni poza dłońmi = punkt styku (09.11.2026)', () => {
  test('Leg Press (podeszwy, trzyma „obie”): ślad istnieje w każdej klatce i jest kostką R; porusza się (platforma wypychana)', () => {
    const d = poses('leg_machine')['Leg Press'];
    const tr = US.map(u => { const f = keyframeFrame(d, u); expect(f.info.trail).toBeDefined(); expect(dist(f.info.trail!, f.sk.legs.R.ankle)).toBeLessThan(1e-6); return f.info.trail!; });
    expect(dist(tr[0], tr[4])).toBeGreaterThan(10);
  });
  test('kostki (Leg Extension, Seated Calf Raise) → kostka strony trzyma; miednica (Hack Squat, Standing Calf Raise, Machine Hip Thrust) → miednica', () => {
    const cases: [string, string, 'ankle' | 'pelvis'][] = [['leg_isolation', 'Leg Extension', 'ankle'], ['calf_raise', 'Seated Calf Raise', 'ankle'], ['leg_machine', 'Hack Squat', 'pelvis'], ['calf_raise', 'Standing Calf Raise', 'pelvis'], ['hip_bridge', 'Machine Hip Thrust', 'pelvis']];
    for (const [fam, k, pt] of cases) {
      const d = poses(fam)[k]; expect([k, !!d]).toEqual([k, true]);
      const lever = d.sprzet.find(g => g.rodzaj === 'dzwignia') as { trzyma?: string }; const side = lever.trzyma === 'L' ? 'L' : 'R';
      for (const u of US) { const f = keyframeFrame(d, u); const want = pt === 'pelvis' ? f.sk.pelvis : f.sk.legs[side].ankle; expect([k, u, dist(f.info.trail!, want) < 1e-6]).toEqual([k, u, true]); }
    }
  });
  test('dźwignia w dłoniach (punkt „dlonie”, Leverage Shrug) bez zmian: ślad = chwyt dłoni R', () => {
    const d = poses('shrug')['Leverage Shrug']; const f = keyframeFrame(d, 0.5);
    expect(dist(f.info.trail!, f.sk.arms.R.grip)).toBeLessThan(1e-6);
  });
});
