/*
 * forearm (10.11.2026, partia 5, samokontrola ruchu K4–K8): regresja wady z arkusza śladu — w „Behind-the-Back Barbell Wrist Curl” sztanga za plecami wchodziła w udo pod koniec zgięcia nadgarstka
 * (odstęp −0,9 cm przy ramieniu odchylonym o 22°); poprawka w generatorze: ramię odchylone w tył o 28°. Dla całej rodziny: ciężar nie przenika nóg ani tułowia powyżej progu PROG_STYKU,
 * a zakres nadgarstka (zgięcie ≥ 50° między skrajnymi klatkami, reguła nadgarstek_zakres) jest zachowany.
 */
import { stykTora, podsumujStyk, PROG_STYKU } from './helpers/styk-figur';
import { figureSpec, measuredAngle, poseKeys, type FigureSpec } from '@/lib/figures/v2';

const UGINANIA = poseKeys('forearm').filter(k => /Wrist Curl/.test(k));
describe('forearm: styk ciężaru i zakres nadgarstka', () => {
  test('jest 8 uginań nadgarstków z rysunkiem', () => { expect(UGINANIA).toHaveLength(8); });
  test.each(UGINANIA)('%s: ciężar nie przenika ciała (≤ PROG_STYKU.przenikanieCm), zakres nadgarstka ≥ 50°', k => {
    expect(podsumujStyk(stykTora(k)).maxPrzenikanie).toBeLessThanOrEqual(PROG_STYKU.przenikanieCm);
    const s = figureSpec(k) as FigureSpec; const a = Array.from({ length: 21 }, (_, i) => measuredAngle(s, i / 20).deg);
    expect(Math.max(...a) - Math.min(...a)).toBeGreaterThanOrEqual(50);
  });
  test('Behind-the-Back Barbell Wrist Curl: odstęp sztangi od nóg przez cały ruch ≥ 1 cm (przed poprawką −0,9 cm)', () => {
    expect(podsumujStyk(stykTora('Behind-the-Back Barbell Wrist Curl')).minOdstep).toBeGreaterThanOrEqual(1);
  });
});
