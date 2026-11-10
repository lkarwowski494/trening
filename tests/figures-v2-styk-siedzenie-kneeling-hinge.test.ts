/*
 * Recenzja r1 (10.11.2026, S1): Seated Good Mornings — miednica wisiała 2,3 cm nad skrzynią (próg styku 1,5 cm), więc styk „seat” nie świecił.
 * Wzorzec: Box Squat (tests/figures-v2-styk-skrzynia.test.ts).
 */
import { figureSpec, frameAt, contactsOf } from '@/lib/figures/v2';

const K = 'Seated Good Mornings';
const US = Array.from({ length: 21 }, (_, i) => i * 0.05);

describe('Seated Good Mornings: styk siedzenia na skrzyni (10.11.2026)', () => {
  test.each(US)('u=%s: contactsOf zawiera seat', (u) => {
    expect([u, contactsOf(frameAt(figureSpec(K)!, u)).map(c => c.id).includes('seat')]).toEqual([u, true]);
  });
  test('miednica nie wisi nad skrzynią: odstęp ≤ 1 cm w każdej klatce (środek miednicy a górna płaszczyzna skrzyni, kolider 0 → 11,8 − promień)', () => {
    for (const u of US) {
      const f = frameAt(figureSpec(K)!, u); const box = f.props.find(p => p.k === 'box') as { top: number };
      const seat = contactsOf(f).find(c => c.id === 'seat'); expect(seat).toBeTruthy();
      expect(Math.abs(seat!.p[1] - box.top)).toBeLessThanOrEqual(12);
    }
  });
});
