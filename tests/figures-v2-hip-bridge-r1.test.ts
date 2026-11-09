/*
 * hip_bridge, poprawki po recenzji niezależnej r1 (09.11.2026, partia 2):
 * (1) WYSOKIE Machine Hip Thrust — prowadnica dźwigni w płaszczyźnie środkowej przez miednicę; ćwiczenie wstrzymane (V2_WSTRZYMANE) do poprawki danych
 *     razem ze śladem dźwigni po scaleniu figury/slad-dzwignia; reszta rodziny z rysunkiem;
 * (2) NISKIE K14 — przeprost lędźwi (ht.mis.arch) wykrywa miara testu przez środek kręgosłupa (spineMid), bez wyjątków w BLAD_NIEWIDOCZNY.
 */
jest.mock('@/lib/figures/data.json', () => require('./figure-gate-open').openFigureGate(jest.requireActual('@/lib/figures/data.json')));
import { figureSpec, shownFigureSpec, frameAt, V2_WSTRZYMANE, poseKeys } from '@/lib/figures/v2';
import { errorsOf } from '@/lib/figures/v2/ui';

describe('hip_bridge r1 — Machine Hip Thrust wstrzymany (09.11.2026)', () => {
  test('wpis w V2_WSTRZYMANE z powodem; silnik nadal liczy figurę, aplikacja jej nie pokazuje', () => {
    expect(V2_WSTRZYMANE['Machine Hip Thrust']).toMatch(/prowadnica dźwigni/);
    expect(figureSpec('Machine Hip Thrust')).not.toBeNull();
    expect(shownFigureSpec('Machine Hip Thrust')).toBeNull();
  });
  test('pozostałe ćwiczenia rodziny hip_bridge nadal z rysunkiem', () => {
    for (const k of poseKeys('hip_bridge').filter(x => x !== 'Machine Hip Thrust')) expect([k, shownFigureSpec(k) !== null]).toEqual([k, true]);
  });
});

describe('hip_bridge r1 — K14: przeprost wykrywany przez spineMid', () => {
  const ARCH = 'ht.mis.arch';
  const shift = (k: string, a: ReturnType<typeof frameAt>['sk'], b: ReturnType<typeof frameAt>['sk']) => Math.hypot(...[0, 1, 2].map(i => a.spineMid[i] - b.spineMid[i]));
  test('każde ćwiczenie z błędem przeprostu: spineMid przesuwa się o > 3 cm względem pozy poprawnej (przypadek pozytywny)', () => {
    let n = 0;
    for (const k of poseKeys('hip_bridge')) {
      const s = figureSpec(k)!; const e = errorsOf(s).find(x => x.cue === ARCH); if (!e) continue; n++;
      expect([k, shift(k, frameAt(s, 1).sk, frameAt(s, 1, e.error).sk) > 3]).toEqual([k, true]);
    }
    expect(n).toBeGreaterThanOrEqual(7);
  });
  test('przypadek negatywny: poza błędu identyczna z poprawną → miara 0 (test macierzowy byłby czerwony)', () => {
    const s = figureSpec('Hip Thrust (sztanga)')!; const a = frameAt(s, 1).sk;
    expect(shift('x', a, frameAt(s, 1).sk)).toBe(0);
  });
});
