/* Karta „teraz”: miejsce na grafikę nie rośnie przy przeliczaniu układu (E2E 39410740673; wcześniej 39399241275 — pola serii pod klawiaturą, „Set done” poza ekranem).
 * Mechanizm: onLayout podaje wysokość z szumem float (minHeight + 1e-5); Math.ceil dawał +1 pt na każde przeliczenie. */
import { readFileSync } from 'fs';
import { join } from 'path';
import { slotHeight } from '@/lib/equipvis';

/** Model pętli: kontener ma minHeight = zapamiętana wysokość; silnik układu raportuje ją z szumem; aplikacja zapamiętuje większą. */
function loop(measure: (h: number) => number, content: number, noise: number, passes: number) {
  let slot = 0;
  for (let i = 0; i < passes; i++) { const layout = Math.max(slot, content) + noise; const h = measure(layout); if (h > slot) slot = h; }
  return slot;
}

test('stara miara (Math.ceil) rośnie przy szumie układu — odtworzenie błędu', () => {
  expect(loop(h => Math.ceil(h), 60, 1e-5, 50)).toBeGreaterThan(100);
});
test('slotHeight jest stabilny wobec szumu układu: wysokość zawartości, nie rosnąca', () => {
  expect(loop(slotHeight, 60, 1e-5, 50)).toBe(60);
  expect(loop(slotHeight, 60.33, 1e-5, 50)).toBe(61);
  expect(loop(slotHeight, 101, 0.0000076, 500)).toBe(101);
});
test('slotHeight: wartości graniczne', () => {
  expect(slotHeight(0)).toBe(0); expect(slotHeight(-3)).toBe(0); expect(slotHeight(100)).toBe(100); expect(slotHeight(100.2)).toBe(101);
});
test('tablica „teraz” (NowBoard, dawniej karta w ActiveWorkout) używa slotHeight (nie Math.ceil) przy zapamiętywaniu miejsca na grafikę', () => {
  const src = readFileSync(join(__dirname, '..', 'components', 'NowBoard.tsx'), 'utf8');
  expect(src).toMatch(/const h = slotHeight\(ev\.nativeEvent\.layout\.height\)/);
});
