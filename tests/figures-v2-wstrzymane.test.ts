/*
 * Figury v2 wstrzymane w 1.0 (decyzja agenta w nocy 28/29.10.2026 w trybie nocnym właściciela — do zatwierdzenia/weta rano; docs/18): JM Press
 * i Decline Close-Grip Bench To Skull Crusher — rysunek przeczy karcie („Łokcie blisko tułowia przez cały ruch”, cgbp.elbows): na dole łokieć ok. 25 cm za barkiem
 * w stronę głowy, w połowie ruchu łokcie odchodzą na boki (z ≈ 41 przy barku 17). Znalezisko WYSOKIE z niezależnej recenzji figur v2 linii 1.0.1.
 * Karta bez rysunku (wskazówki tekstowe zostają), jak Push Press i Pendlay Row; poprawka rigu w 1.0.1. Wariant zostaje w variants.ts (praca 1.0.1).
 */
import { figureSpec, shownFigureSpec, frameAt, VARIANTS, V2_WSTRZYMANE } from '@/lib/figures/v2';

const KLUCZE = ['JM Press', 'Decline Close-Grip Bench To Skull Crusher'];

describe('figury v2 wstrzymane w 1.0 (28.10.2026)', () => {
  test('oba ćwiczenia bez rysunku w aplikacji (shownFigureSpec), z powodem; silnik i wariant zostają dla poprawki', () => {
    for (const k of KLUCZE) {
      expect([k, shownFigureSpec(k)]).toEqual([k, null]); expect([k, figureSpec(k) !== null]).toEqual([k, true]);
      expect([k, (V2_WSTRZYMANE[k] ?? '').length > 20]).toEqual([k, true]);
      expect([k, !!VARIANTS[k]]).toEqual([k, true]);
    }
  });
  test('lista wstrzymanych tylko z ćwiczeniami, które mają wariant (bez martwych wpisów)', () => {
    for (const k of Object.keys(V2_WSTRZYMANE)) expect([k, !!VARIANTS[k]]).toEqual([k, true]);
  });
  test('sąsiednie wyciskania wąskim chwytem nadal z rysunkiem', () => {
    expect(shownFigureSpec('Smith Machine Close-Grip Bench Press')).not.toBeNull();
    expect(frameAt(figureSpec('Smith Machine Close-Grip Bench Press')!, 0.5)).toBeTruthy();
  });
});

describe('ekran: komponenty pokazują tylko figury z shownFigureSpec', () => {
  test('ExerciseCues i ExerciseFigureV2 nie wołają figureSpec bezpośrednio', () => {
    const fs = require('fs') as typeof import('fs'); const path = require('path') as typeof import('path');
    for (const f of ['components/ExerciseCues.tsx', 'components/ExerciseFigureV2.tsx']) {
      const t = fs.readFileSync(path.join(__dirname, '..', f), 'utf8');
      expect([f, /\bfigureSpec\(/.test(t), /shownFigureSpec\(/.test(t)]).toEqual([f, false, true]);
    }
  });
});
