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

describe('ekran karty: bez rysunku znika też zestaw ogólny wskazówek („Łokcie blisko tułowia” nie pasuje do JM Press — badacz linii 1.0.1, 28.10.2026)', () => {
  const React = require('react') as typeof import('react');
  const { render } = require('@testing-library/react-native') as typeof import('@testing-library/react-native');
  const { ExerciseCues } = require('@/components/ExerciseCues') as typeof import('@/components/ExerciseCues');
  const { applyLang } = require('@/lib/i18n') as typeof import('@/lib/i18n');
  const ELBOWS = 'Łokcie blisko tułowia przez cały ruch.';
  beforeAll(() => applyLang('pl'));
  test.each(KLUCZE)('%s: bez sekcji „Technika”: ani rysunku, ani zdania o łokciach', k => {
    const r = render(React.createElement(ExerciseCues, { exercise: { lib: true, libKey: k }, initialOpen: true }));
    expect(r.queryByText(ELBOWS)).toBeNull(); expect(r.queryByTestId('exercise-cues')).toBeNull(); /* bez karty i rysunku — sekcja „Technika” znika */
  });
  test('kontrast: wyciskanie wąskim chwytem na maszynie Smitha nadal z sekcją „Technika” (rysunek v2)', () => {
    const r = render(React.createElement(ExerciseCues, { exercise: { lib: true, libKey: 'Smith Machine Close-Grip Bench Press' }, initialOpen: true }));
    expect(r.getByTestId('exercise-cues')).toBeTruthy();
  });
});

describe('reaudyt pętli 2 (06-tresci-701, 28.10.2026): „Technika ›” nie prowadzi do pustego podglądu przy wstrzymanych figurach', () => {
  const { hasTechnique } = require('@/lib/figures/v2/ui') as typeof import('@/lib/figures/v2/ui');
  test.each(KLUCZE)('%s: hasTechnique = false (brak własnej karty i rysunku)', k => {
    expect(hasTechnique({ lib: true, libKey: k })).toBe(false);
  });
  test('kontrast: Smith Machine Close-Grip Bench Press — hasTechnique = true', () => {
    expect(hasTechnique({ lib: true, libKey: 'Smith Machine Close-Grip Bench Press' })).toBe(true);
  });
});

describe('martwe ciągi z podłogi wstrzymane w 1.0 (decyzja agenta w nocy 29.10.2026, do weta właściciela; recenzja 1.1 hinge B1 WYSOKIE)', () => {
  const DL = ['Deadlift (sztanga)', 'Axle Deadlift', 'Deadlift with Bands', 'Deadlift with Chains', 'Deficit Deadlift', 'Rack Pull', 'Rack Pull with Bands', 'Reverse Band Deadlift', 'Cable Deadlift', 'Clean Deadlift', 'Snatch Deadlift'];
  const React = require('react') as typeof import('react');
  const { render } = require('@testing-library/react-native') as typeof import('@testing-library/react-native');
  const { ExerciseCues } = require('@/components/ExerciseCues') as typeof import('@/components/ExerciseCues');
  const { hasTechnique } = require('@/lib/figures/v2/ui') as typeof import('@/lib/figures/v2/ui');
  const { applyLang } = require('@/lib/i18n') as typeof import('@/lib/i18n');
  beforeAll(() => applyLang('pl'));
  test('wszystkie 11 bez rysunku (shownFigureSpec), z powodem; silnik zostaje dla poprawki w 1.0.1', () => {
    for (const k of DL) {
      expect([k, shownFigureSpec(k)]).toEqual([k, null]); expect([k, figureSpec(k) !== null]).toEqual([k, true]);
      expect([k, (V2_WSTRZYMANE[k] ?? '').length > 20]).toEqual([k, true]);
    }
  });
  test('karta zostaje z wskazówkami tekstowymi (sekcja „Technika” bez rysunku)', () => {
    expect(hasTechnique({ lib: true, libKey: 'Deadlift (sztanga)' })).toBe(true);
    const r = render(React.createElement(ExerciseCues, { exercise: { lib: true, libKey: 'Deadlift (sztanga)' }, initialOpen: true }));
    expect(r.getByTestId('exercise-cues')).toBeTruthy(); expect(r.queryByTestId('exercise-figure-v2')).toBeNull(); expect(r.queryByTestId('exercise-figure')).toBeNull();
  });
  test('kontrast: martwy ciąg rumuński i sumo nadal z rysunkiem', () => {
    expect(shownFigureSpec('RDL (sztanga)')).not.toBeNull(); expect(shownFigureSpec('Sumo Deadlift')).not.toBeNull();
  });
});

describe('wyciskania i przysiady wstrzymane w 1.0 (decyzja agenta w nocy 29.10.2026, do weta właściciela; recenzje bench_press i squat 1.1 — WYSOKIE)', () => {
  const K = ['Band Bench Press', 'Chain Press', 'Close Grip Bench Press', 'Zercher Squat', 'Sumo Squat (hantel)'];
  test('wszystkie bez rysunku (shownFigureSpec), z powodem; silnik zostaje', () => {
    for (const k of K) {
      expect([k, shownFigureSpec(k)]).toEqual([k, null]); expect([k, figureSpec(k) !== null]).toEqual([k, true]);
      expect([k, (V2_WSTRZYMANE[k] ?? '').length > 20]).toEqual([k, true]);
    }
  });
  test('odtworzenie wad (silnik na main 9b76ed2): Chain Press = Bench Press with Chains; Zercher na dole ≥ 15 cm od łokcia; Sumo Squat (hantel) ≥ 20 cm w poziomie', () => {
    expect(JSON.stringify(frameAt(figureSpec('Chain Press')!, 0.5))).toBe(JSON.stringify(frameAt(figureSpec('Bench Press with Chains')!, 0.5)));
    const z = frameAt(figureSpec('Zercher Squat')!, 1); const el = z.sk.arms.R.elbow;
    expect(Math.hypot(z.info.load[0] - el[0], z.info.load[1] - el[1])).toBeGreaterThan(15);
    const a = frameAt(figureSpec('Sumo Squat (hantel)')!, 0).info.load, b = frameAt(figureSpec('Sumo Squat (hantel)')!, 1).info.load;
    expect(Math.abs(a[0] - b[0])).toBeGreaterThan(20);
  });
  test('kontrast: Back Squat (zrzut sklepu „ćwiczenie”) i Bench Press (sztanga) nadal z rysunkiem', () => {
    expect(shownFigureSpec('Back Squat')).not.toBeNull(); expect(shownFigureSpec('Bench Press (sztanga)')).not.toBeNull();
  });
});
