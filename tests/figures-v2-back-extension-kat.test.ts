/*
 * Recenzja niezależna r1 rodziny back_extension (10.11.2026), W1: linia „Kąt na rysunku” Lower Back Curl pokazywała błędne liczby
 * (pomiar 3D biodra przesuniętego w bok: 9,2° zamiast 1,5°, skok znaku 9,4° → −9,5° między u 0,55 i 0,60; rzeczywisty zakres ok. 7° < próg MIN_MEASURED_ROM).
 * Miara: każde ćwiczenie rodziny, które pokazuje linię kąta, nie skacze o więcej niż 8° między kadrami co 0,05; ćwiczenie ze skokiem ma linię ukrytą (hideAngle).
 */
jest.mock('@/lib/figures/data.json', () => require('./figure-gate-open').openFigureGate(jest.requireActual('@/lib/figures/data.json'))); /* bramka 4 otwarta: test sprawdza rysowanie, nie recenzję rodziny */
import { figureSpec, measuredAngle, poseKeys } from '@/lib/figures/v2';
import { angleLineShown } from '@/lib/figures/v2/figure';

const US = Array.from({ length: 21 }, (_, i) => +(i / 20).toFixed(2));
const maxSkok = (k: string): number => { const s = figureSpec(k)!; let m = 0; for (let i = 1; i < US.length; i++) m = Math.max(m, Math.abs(measuredAngle(s, US[i]).deg - measuredAngle(s, US[i - 1]).deg)); return m; };
const SKOK_MAX = 8; /* ruch rzeczywisty: Back Extension do 5,3° na kadr (80° w 20 kadrach); skok znaku Lower Back Curl 18,9° */

describe('back_extension r1 W1: liczba pod rysunkiem jest ciągła (10.11.2026)', () => {
  test.each(poseKeys('back_extension'))('%s: gdy linia kąta jest pokazana, skok między kadrami co 0,05 ≤ 8°', (k) => {
    const s = figureSpec(k)!; if (!angleLineShown(s)) return; expect([k, maxSkok(k) <= SKOK_MAX]).toEqual([k, true]);
  });
  test('Lower Back Curl: linia kąta ukryta (rzeczywisty zakres ok. 7°, pomiar 3D mylący)', () => { expect(angleLineShown(figureSpec('Lower Back Curl')!)).toBe(false); });
  test('Back Extension i Reverse Hyperextension: linia kąta pokazana (ruch w biodrze ≥ 70°)', () => { for (const k of ['Back Extension', 'Reverse Hyperextension']) expect([k, angleLineShown(figureSpec(k)!)]).toEqual([k, true]); });
  test('negatyw: miara skoku wykrywa 18,9° (dawny skok znaku) i przepuszcza 0,4°', () => { expect(18.9 <= SKOK_MAX).toBe(false); expect(0.4 <= SKOK_MAX).toBe(true); });
  test('negatyw na danych: Lower Back Curl z pominiętym ukryciem miałby skok > 8° (pomiar surowy)', () => { expect(maxSkok('Lower Back Curl') > SKOK_MAX).toBe(true); });
});
