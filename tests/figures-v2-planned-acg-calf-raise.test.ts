/*
 * Figury v2, rodzina calf_raise (planned) — ACG-020 (audyt ćwiczeń 31.10.2026, zadanie ACG-T-022).
 * Seated Calf Raise i 3 warianty w siadzie: stopy płasko na podłodze (pięta = palce = 0 cm), więc w dole nie było rozciągnięcia ani opuszczenia pięt poniżej palców,
 * przed którym ostrzega zestaw (calf.move „opuść pięty…”, calf.mis.partial „skrócony zakres”). Stojące warianty mają podest (skrzynia) pod przodostopiem, pięta w dole poniżej krawędzi.
 * Miara: keyframeFrame, noga ruchoma R. Podest = wpis sprzętu `skrzynia` z blatem < 15 cm (siedzisko ma ok. 38 cm). Progi (konwencje testowe, jak w stojących Standing Calf Raise): pięta ≥ 2 cm poniżej krawędzi,
 * palce ≤ 2 cm od blatu, pięta poza krawędzią, pięta unosi się o ≥ 12 cm między dołem a górą.
 */
import * as fs from 'fs';
import * as path from 'path';
import { keyframeFrame, type PoseData } from '@/lib/figures/v2';

const CW: Record<string, PoseData> = JSON.parse(fs.readFileSync(path.join(__dirname, '../lib/figures/v2/poses/calf_raise.json'), 'utf8')).cwiczenia;
const SIEDZACE = ['Seated Calf Raise', 'Seated Calf Raise (hantle)', 'Barbell Seated Calf Raise', 'Dumbbell Seated One-Leg Calf Raise'];
type Gear = { rodzaj: string; x0: number; x1: number; top: number };
const podest = (d: PoseData): Gear | undefined => (d.sprzet as Gear[]).find(g => g.rodzaj === 'skrzynia' && g.top < 15);

describe('ACG-020 (31.10.2026): wspięcia w siadzie — podest pod przodostopiem, pięta poniżej palców w dole', () => {
  test.each(SIEDZACE)('%s: jest podest, a w dole (u = 0) pięta ≥ 2 cm poniżej krawędzi, palce na podeście, pięta poza krawędzią', k => {
    const g = podest(CW[k]); expect(g).toBeDefined(); const R = keyframeFrame(CW[k], 0).sk.legs.R;
    expect(R.heel[1]).toBeLessThanOrEqual(g!.top - 2); expect(R.heel[1]).toBeLessThan(R.toe[1] - 2); expect(Math.abs(R.toe[1] - g!.top)).toBeLessThanOrEqual(2);
    expect(R.heel[0]).toBeLessThan(g!.x0); expect(R.toe[0]).toBeGreaterThan(g!.x0);
  });
  test.each(SIEDZACE)('%s: pięta unosi się o ≥ 12 cm między dołem a górą (zakres ruchu zostaje)', k => {
    const a = keyframeFrame(CW[k], 0).sk.legs.R.heel[1], b = keyframeFrame(CW[k], 1).sk.legs.R.heel[1]; expect(b - a).toBeGreaterThanOrEqual(12);
  });
  test('stojące warianty bez zmian: Standing Calf Raise nadal ma podest 6 cm', () => {
    expect(podest(CW['Standing Calf Raise'])?.top).toBe(6);
  });
});
