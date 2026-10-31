/*
 * 29.10.2026: WSZYSTKIE wpisy V2_WSTRZYMANE zdjęto (18 figur) po poprawionych rigach i niezależnych recenzjach (v2.hinge, v2.bench_press, v2.squat w figury-recenzja.json;
 * JM Press i Skull Crusher — recenzja r2 z 28.10 + geometria 101-01 niżej). Poniższe opisy wstrzymań to historia; asercje o wstrzymaniu odwrócono (stan pilnowany testem
 * zmienia test w tym samym commicie). Mechanizm V2_WSTRZYMANE zostaje (pusty) dla przyszłych wstrzymań.
 *
 * Historia — figury v2 wstrzymane w 1.0 (decyzja agenta w nocy 28/29.10.2026 w trybie nocnym właściciela — do zatwierdzenia/weta rano; docs/18): JM Press
 * i Decline Close-Grip Bench To Skull Crusher — rysunek przeczy karcie („Łokcie blisko tułowia przez cały ruch”, cgbp.elbows): na dole łokieć ok. 25 cm za barkiem
 * w stronę głowy, w połowie ruchu łokcie odchodzą na boki (z ≈ 41 przy barku 17). Znalezisko WYSOKIE z niezależnej recenzji figur v2 linii 1.0.1.
 * Karta bez rysunku (wskazówki tekstowe zostają), jak Push Press i Pendlay Row; poprawka rigu w 1.0.1. Wariant zostaje w variants.ts (praca 1.0.1).
 */
jest.mock('@/lib/figures/data.json', () => require('./figure-gate-open').openFigureGate(jest.requireActual('@/lib/figures/data.json'))); /* bramka 4 otwarta: ten test sprawdza rysowanie, nie recenzję rodziny (tests/figure-gate-open.ts) */
import { figureSpec, shownFigureSpec, frameAt, VARIANTS, V2_WSTRZYMANE } from '@/lib/figures/v2';

const KLUCZE = ['JM Press', 'Decline Close-Grip Bench To Skull Crusher'];

describe('figury v2 (JM Press, Skull Crusher) — wstrzymanie zdjęte 29.10.2026', () => {
  test('oba ćwiczenia z rysunkiem w aplikacji (shownFigureSpec = figureSpec), poza V2_WSTRZYMANE; wariant istnieje', () => {
    for (const k of KLUCZE) {
      expect([k, shownFigureSpec(k) !== null, shownFigureSpec(k)?.key]).toEqual([k, true, k]); expect([k, k in V2_WSTRZYMANE]).toEqual([k, false]);
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

describe('ekran karty (29.10.2026, wstrzymanie zdjęte): JM Press i Skull Crusher mają sekcję „Technika” z rysunkiem; zdanie „Łokcie blisko tułowia” nadal się nie pojawia (nie pasuje do JM Press — badacz linii 1.0.1, 28.10.2026)', () => {
  const React = require('react') as typeof import('react');
  const { render } = require('@testing-library/react-native') as typeof import('@testing-library/react-native');
  const { ExerciseCues } = require('@/components/ExerciseCues') as typeof import('@/components/ExerciseCues');
  const { applyLang } = require('@/lib/i18n') as typeof import('@/lib/i18n');
  const ELBOWS = 'Łokcie blisko tułowia przez cały ruch.';
  beforeAll(() => applyLang('pl'));
  test.each(KLUCZE)('%s: sekcja „Technika” widoczna z rysunkiem v2, bez zdania o łokciach', k => {
    const r = render(React.createElement(ExerciseCues, { exercise: { lib: true, libKey: k }, initialOpen: true }));
    expect(r.queryByText(ELBOWS)).toBeNull(); expect(r.getByTestId('exercise-cues')).toBeTruthy(); expect(r.queryByTestId('exercise-figure-v2')).not.toBeNull(); r.unmount();
  });
  test('kontrast: wyciskanie wąskim chwytem na maszynie Smitha nadal z sekcją „Technika” (rysunek v2)', () => {
    const r = render(React.createElement(ExerciseCues, { exercise: { lib: true, libKey: 'Smith Machine Close-Grip Bench Press' }, initialOpen: true }));
    expect(r.getByTestId('exercise-cues')).toBeTruthy();
  });
});

describe('reaudyt pętli 2 (06-tresci-701, 28.10.2026), odwrócone 29.10.2026: po zdjęciu wstrzymań „Technika ›” prowadzi do podglądu z rysunkiem', () => {
  const { hasTechnique } = require('@/lib/figures/v2/ui') as typeof import('@/lib/figures/v2/ui');
  test.each(KLUCZE)('%s: hasTechnique = true (rysunek v2)', k => {
    expect(hasTechnique({ lib: true, libKey: k })).toBe(true);
  });
  test('kontrast: Smith Machine Close-Grip Bench Press — hasTechnique = true', () => {
    expect(hasTechnique({ lib: true, libKey: 'Smith Machine Close-Grip Bench Press' })).toBe(true);
  });
});

describe('martwe ciągi z podłogi — wstrzymanie zdjęte 29.10.2026 (wcześniej: decyzja agenta w nocy 29.10.2026; recenzja 1.1 hinge B1 WYSOKIE; teraz recenzja niezależna v2.hinge)', () => {
  const DL = ['Deadlift (sztanga)', 'Axle Deadlift', 'Deadlift with Bands', 'Deadlift with Chains', 'Deficit Deadlift', 'Rack Pull', 'Rack Pull with Bands', 'Reverse Band Deadlift', 'Cable Deadlift', 'Clean Deadlift', 'Snatch Deadlift'];
  const React = require('react') as typeof import('react');
  const { render } = require('@testing-library/react-native') as typeof import('@testing-library/react-native');
  const { ExerciseCues } = require('@/components/ExerciseCues') as typeof import('@/components/ExerciseCues');
  const { hasTechnique } = require('@/lib/figures/v2/ui') as typeof import('@/lib/figures/v2/ui');
  const { applyLang } = require('@/lib/i18n') as typeof import('@/lib/i18n');
  beforeAll(() => applyLang('pl'));
  test('wszystkie 11 z rysunkiem (shownFigureSpec), poza V2_WSTRZYMANE', () => {
    for (const k of DL) { expect([k, shownFigureSpec(k) !== null]).toEqual([k, true]); expect([k, k in V2_WSTRZYMANE]).toEqual([k, false]); }
  });
  test('karta: sekcja „Technika” z rysunkiem v2 (i wskazówkami tekstowymi)', () => {
    expect(hasTechnique({ lib: true, libKey: 'Deadlift (sztanga)' })).toBe(true);
    const r = render(React.createElement(ExerciseCues, { exercise: { lib: true, libKey: 'Deadlift (sztanga)' }, initialOpen: true }));
    expect(r.getByTestId('exercise-cues')).toBeTruthy(); expect(r.queryByTestId('exercise-figure-v2')).not.toBeNull(); expect(r.queryByTestId('exercise-figure')).toBeNull(); r.unmount();
  });
  test('kontrast: martwy ciąg rumuński i sumo nadal z rysunkiem', () => {
    expect(shownFigureSpec('RDL (sztanga)')).not.toBeNull(); expect(shownFigureSpec('Sumo Deadlift')).not.toBeNull();
  });
});

describe('wyciskania i przysiady — wstrzymanie zdjęte 29.10.2026 (wcześniej: recenzje bench_press i squat 1.1 — WYSOKIE; teraz recenzje niezależne v2.bench_press i v2.squat)', () => {
  const K = ['Band Bench Press', 'Chain Press', 'Close Grip Bench Press', 'Zercher Squat', 'Sumo Squat (hantel)'];
  test('wszystkie z rysunkiem (shownFigureSpec), poza V2_WSTRZYMANE', () => {
    for (const k of K) { expect([k, shownFigureSpec(k) !== null]).toEqual([k, true]); expect([k, k in V2_WSTRZYMANE]).toEqual([k, false]); }
  });
  test('odtworzenie wad (silnik na main 9b76ed2): Zercher (naprawiony 29.10.2026, 101-09: na dole gryf ≤ 9 cm od łokcia — dawny rig 18,5 cm); Sumo Squat (naprawiony 29.10.2026, 101-10: ≤ 6 cm w poziomie — dawny rig ≥ 20 cm)', () => {
    /* Chain Press = Bench Press with Chains: poprawione w 101-06 (29.10.2026; uchwyty z łańcuchami zamiast sztangi) — test pilnujący poprawki: tests/figury-pakiet-b.test.ts */
    const z = frameAt(figureSpec('Zercher Squat')!, 1); const el = z.sk.arms.R.elbow;
    expect(Math.hypot(z.info.load[0] - el[0], z.info.load[1] - el[1])).toBeLessThanOrEqual(9); /* 101-09: pilnuje tests/figury-101-squat.test.ts; stan wady (> 15 cm) odwrócony */
    const a = frameAt(figureSpec('Sumo Squat (hantel)')!, 0).info.load, b = frameAt(figureSpec('Sumo Squat (hantel)')!, 1).info.load;
    expect(Math.abs(a[0] - b[0])).toBeLessThanOrEqual(6); /* 101-10: pilnuje tests/figury-101-squat.test.ts; stan wady (> 20 cm) odwrócony */
  });
  test('kontrast: Back Squat (zrzut sklepu „ćwiczenie”) i Bench Press (sztanga) nadal z rysunkiem', () => {
    expect(shownFigureSpec('Back Squat')).not.toBeNull(); expect(shownFigureSpec('Bench Press (sztanga)')).not.toBeNull();
  });
});

describe('101-01 (29.10.2026): JM Press i Decline Close-Grip Bench To Skull Crusher — rig r2 spełnia kartę r2 (jm.elbows, dcgsk.elbows) na kadrach co 0,05; rig z main nie (wstrzymanie zdjęte 29.10.2026)', () => {
  /* Pomiar jak na main (komentarz na górze pliku: łokieć na dole ok. 25 cm za barkiem ku głowie, w połowie ruchu na boki do z ≈ 41 przy barku ≈ 19). Kryterium to karta r2, nie cgbp.elbows:
   * JM — „łokcie cały czas wysoko i pod skosem od tułowia — nie opadają w dół ani nie uciekają na boki” (ramię ku stopom, odwiedzenie stałe ok. 45°);
   * Skull Crusher — „łokcie wąsko przez cały ruch … przy prostowaniu nad barkami — nie rozchodzą się na boki” (faza prostowania). Na main: JM dx −27, z do 41,8; Skull Crusher dx −25, z do 43,5. */
  const U = Array.from({ length: 21 }, (_, i) => i / 20);
  const pom = (k: string) => U.flatMap(u => { const f = frameAt(figureSpec(k)!, u); return (['R', 'L'] as const).map(s => { const a = f.sk.arms[s]; const sg = s === 'R' ? 1 : -1;
    return { u, s, dx: a.elbow[0] - a.shoulder[0], dy: a.elbow[1] - a.shoulder[1], dzOut: sg * (a.elbow[2] - a.shoulder[2]), zOut: Math.abs(a.elbow[2]), zSh: Math.abs(a.shoulder[2]) }; }); });
  const deg = (r: number) => r * 180 / Math.PI;
  test('JM Press: łokieć nigdy za barkiem ku głowie (dx ≥ −1) ani poniżej barku o więcej niż 5 cm — w 21 kadrach, obie strony; na dole ramię ku stopom (dx > 0)', () => {
    const m = pom('JM Press'); expect(m).toHaveLength(42);
    for (const p of m) expect([p.u, p.s, p.dx >= -1, p.dy >= -5]).toEqual([p.u, p.s, true, true]);
    expect(m.filter(p => p.u === 1).every(p => p.dx > 0)).toBe(true);
  });
  test('JM Press: łokcie nie uciekają na boki — odległość od osi nigdy większa niż 2 × połowa barków (było 2,2×) i odwiedzenie stałe 37–53° (tam, gdzie wychylenie ≥ 3 cm)', () => {
    for (const p of pom('JM Press')) { const ab = deg(Math.atan2(p.dzOut, Math.abs(p.dx)));
      expect([p.u, p.s, p.zOut <= 2 * p.zSh, p.dzOut >= -3, Math.hypot(p.dx, p.dzOut) < 3 || (ab >= 37 && ab <= 53)]).toEqual([p.u, p.s, true, true, true]); }
  });
  test('Skull Crusher (faza prostowania): łokcie na szerokość barków (|Δz od barku| ≤ 1 cm), nad barkami (|dx| ≤ 5 cm, dy ≥ 25 cm) w 21 kadrach, obie strony', () => {
    const m = pom('Decline Close-Grip Bench To Skull Crusher'); expect(m).toHaveLength(42);
    for (const p of m) expect([p.u, p.s, Math.abs(p.zOut - p.zSh) <= 1, Math.abs(p.dx) <= 5, p.dy >= 25]).toEqual([p.u, p.s, true, true, true]);
  });
  test('pomiar na dole (u = 1) i w połowie ruchu: położenie łokcia względem barku — liczby r2 (JM: dx +15, dy +22; Skull Crusher: dx −1,7) zamiast main (dx −26/−25)', () => {
    const jm = pom('JM Press').filter(p => p.s === 'R'), sk = pom('Decline Close-Grip Bench To Skull Crusher').filter(p => p.s === 'R');
    const d1 = jm.find(p => p.u === 1)!, s1 = sk.find(p => p.u === 1)!;
    expect([d1.dx > 10 && d1.dx < 20, d1.dy > 18, s1.dx > -3 && s1.dx < 0]).toEqual([true, true, true]);
    expect(Math.max(...jm.map(p => p.zOut))).toBeLessThan(38); expect(Math.max(...sk.map(p => p.zOut))).toBeLessThan(22);
  });
  test('29.10.2026: wpisy zdjęte z V2_WSTRZYMANE (JM Press, Decline Close-Grip Bench To Skull Crusher) — rig r2 spełnia kartę r2, więc rysunek jest pokazywany', () => {
    for (const k of KLUCZE) expect([k, k in V2_WSTRZYMANE, shownFigureSpec(k) !== null]).toEqual([k, false, true]);
  });
});

describe('29.10.2026: 18 figur v2 zdjętych z V2_WSTRZYMANE po recenzjach niezależnych — wszystkie z rysunkiem (shownFigureSpec) i sekcją Technika', () => {
  const { hasTechnique } = require('@/lib/figures/v2/ui') as typeof import('@/lib/figures/v2/ui');
  const OSIEMNASCIE = [...KLUCZE,
    'Deadlift (sztanga)', 'Axle Deadlift', 'Deadlift with Bands', 'Deadlift with Chains', 'Deficit Deadlift', 'Rack Pull', 'Rack Pull with Bands', 'Reverse Band Deadlift', 'Cable Deadlift', 'Clean Deadlift', 'Snatch Deadlift',
    'Band Bench Press', 'Chain Press', 'Close Grip Bench Press', 'Zercher Squat', 'Sumo Squat (hantel)'];
  test('18 różnych kluczy; V2_WSTRZYMANE puste', () => {
    expect(new Set(OSIEMNASCIE).size).toBe(18); expect(Object.keys(V2_WSTRZYMANE)).toEqual([]);
  });
  test.each(OSIEMNASCIE)('%s: shownFigureSpec nie null, hasTechnique true, poza V2_WSTRZYMANE', k => {
    expect(shownFigureSpec(k)).not.toBeNull(); expect(hasTechnique({ lib: true, libKey: k })).toBe(true); expect(k in V2_WSTRZYMANE).toBe(false);
  });
  test.each(OSIEMNASCIE)('%s: karta pokazuje sekcję „Technika” z rysunkiem v2', k => {
    const React = require('react') as typeof import('react'); const { render } = require('@testing-library/react-native') as typeof import('@testing-library/react-native');
    const { ExerciseCues } = require('@/components/ExerciseCues') as typeof import('@/components/ExerciseCues');
    const r = render(React.createElement(ExerciseCues, { exercise: { lib: true, libKey: k }, initialOpen: true }));
    expect(r.getByTestId('exercise-cues')).toBeTruthy(); expect(r.queryByTestId('exercise-figure-v2')).not.toBeNull(); r.unmount();
  });
});
