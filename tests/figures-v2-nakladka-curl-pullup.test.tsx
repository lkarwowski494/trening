/*
 * Figury v2 — nakładka techniki, etap 2: rodziny curl i pull_up (04.11.2026; spec „rysunek pokazuje technikę”, decyzje właściciela 04.11.2026: zawsze widoczne, ≤ 3 linie + 1 łuk na rzut
 * łącznie ze starymi liniami odniesienia, liczba kąta tylko w podpisie, złamana reguła w kolorze błędu, element tylko dla reguły „ustalone” ze zdaniem na karcie wariantu).
 * Rodzaje (docs/20): geometria (łuk = measuredAngle ±1°), niezmienniki (bez tekstu i liczb, limit na rzut, element ⇔ wskazówka na karcie), dane (reguła ze źródłem), kolor błędu, VoiceOver, wygląd.
 * Wzór: tests/figures-v2-nakladka.test.tsx (bench_press).
 */
jest.mock('@/lib/figures/data.json', () => require('./figure-gate-open').openFigureGate(jest.requireActual('@/lib/figures/data.json'))); /* bramka 4 otwarta: ten test sprawdza rysowanie, nie recenzję rodziny */
import * as fs from 'fs';
import * as path from 'path';
import React from 'react';
import * as RN from 'react-native';
import { render, screen, act } from '@testing-library/react-native';
import { ExerciseFigureV2 } from '@/components/ExerciseFigureV2';
import { CATALOG } from '@/lib/catalog.generated';
import { figureSpec, frameAt, guideShapes, measuredAngle, measuredSide, overlayShapes, errorBreaksRule, type FigureSpec, type Shape } from '@/lib/figures/v2';
import { OVERLAY_MAX_ARCS, OVERLAY_MAX_LINES, TECHNIQUE, techniqueGeom, techniqueShapes, techniquesFor } from '@/lib/figures/v2/overlay';
import { CURL_TECHNIQUE } from '@/lib/figures/v2/overlay/curl';
import { PULL_UP_TECHNIQUE } from '@/lib/figures/v2/overlay/pull_up';
import { errorsOf, techniquesOf, onDrawingCues, guidesOf, cueIdsOf, errorText } from '@/lib/figures/v2/ui';
import { applyLang } from '@/lib/i18n';

const spec = (k: string): FigureSpec => figureSpec(k) as FigureSpec;
const lib = (key: string) => ({ lib: true as const, libKey: key });
const AI = RN.AccessibilityInfo as unknown as { isReduceMotionEnabled: jest.Mock };
const flush = async () => { await act(async () => { await Promise.resolve(); }); };
const keysOf = (family: string) => Object.keys(CATALOG).filter(k => { try { return figureSpec(k)?.family === family; } catch { return false; } });
const CURL_KEYS = keysOf('curl'), PULL_KEYS = keysOf('pull_up');
const US = Array.from({ length: 21 }, (_, i) => i / 20);
const role = (x: Shape): string | undefined => (x.k === 'line' ? x.role : (x as { stroke?: string }).stroke);
const sens = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'data/zrodla/figury-sens.json'), 'utf8')).rodziny;

afterEach(() => { applyLang('pl'); AI.isReduceMotionEnabled.mockImplementation(() => Promise.resolve(false)); });

describe('dane: elementy rodzin curl i pull_up ← reguły ze źródłem', () => {
  test('rejestr: curl = curlElbowLimb (limb, łokieć, rzut z boku); pull_up = brak elementów (żadna reguła rodziny nie ma statusu „ustalone”)', () => {
    expect(CURL_TECHNIQUE.map(d => d.id)).toEqual(['curlElbowLimb']); expect(TECHNIQUE.curl).toBe(CURL_TECHNIQUE); expect(TECHNIQUE.pull_up).toBe(PULL_UP_TECHNIQUE);
    expect([CURL_TECHNIQUE[0].kind, CURL_TECHNIQUE[0].joint, CURL_TECHNIQUE[0].views]).toEqual(['limb', 'elbow', ['side']]);
    expect(PULL_UP_TECHNIQUE).toEqual([]); expect(fs.existsSync(path.join(__dirname, '..', 'lib/figures/v2/overlay/pull_up.ts'))).toBe(true);
  });
  test.each([['curl', CURL_TECHNIQUE], ['pull_up', PULL_UP_TECHNIQUE]] as const)('%s: reguła każdego elementu istnieje i jest „ustalone”; każda wskazówka elementu należy do wskazowki_na_reguly reguły', (fam, defs) => {
    for (const d of defs) {
      const r = sens[fam].reguly[d.rule]; expect(r).toBeTruthy(); expect(r.pewnosc).toMatch(/^ustalone/); expect(d.cue.length).toBeGreaterThan(0);
      for (const c of d.cue) expect([c, sens[fam].wskazowki_na_reguly[c]]).toEqual([c, expect.arrayContaining([d.rule])]);
    }
    expect(defs.map(d => d.rule)).toEqual(fam === 'curl' ? ['lokiec_zgina_sie'] : []);
  });
  test('pull_up: żadna reguła nie ma pola pewnosc — dlatego brak elementów; po uzupełnieniu statusu przez badacza ten test przypomina o dodaniu elementu', () => {
    for (const r of Object.values(sens.pull_up.reguly) as { pewnosc?: string }[]) expect(r.pewnosc).toBeUndefined();
  });
});

describe('geometria: łuk = kąt z jointAngles (±1°) w 21 klatkach', () => {
  const withEl = CURL_KEYS.filter(k => techniquesOf(k).includes('curlElbowLimb'));
  test('curl: rozwarcie łuku = measuredAngle (zgięcie łokcia) w każdym ćwiczeniu z elementem; linia zawsze, łuk gdy zgięcie ≥ progu', () => {
    expect(withEl.length).toBeGreaterThan(8);
    for (const k of withEl) { const s = spec(k); const side = measuredSide(s);
      for (const u of US) {
        const f = frameAt(s, u); const g = techniqueGeom('limb', f.sk, side, 'elbow')!; const m = measuredAngle(s, u);
        expect([k, u, m.joint, Math.abs(g.sweepDeg - m.deg) <= 1]).toEqual([k, u, 'elbow', true]);
        const sh = overlayShapes(s, u, 'side', ['curlElbowLimb']); expect([k, u, sh.filter(x => x.k === 'line').length]).toEqual([k, u, 1]);
        expect([k, u, sh.filter(x => x.k === 'poly').length]).toEqual([k, u, g.arc ? 1 : 0]);
      } }
  });
  test('u dołu (wyprost) łuk jest mały lub znika, u góry zgięcie duże: Barbell Curl', () => {
    const s = spec('Barbell Curl'); const sw = (u: number) => techniqueGeom('limb', frameAt(s, u).sk, measuredSide(s), 'elbow')!.sweepDeg;
    expect(sw(0)).toBeLessThan(35); expect(sw(1)).toBeGreaterThan(90);
    expect(overlayShapes(s, 1, 'side', ['curlElbowLimb']).filter(x => x.k === 'poly').length).toBe(1);
  });
  test('rzut z przodu nie dostaje elementu: overlayShapes(front) puste', () => { for (const u of US) expect(overlayShapes(spec('Barbell Curl'), u, 'front', ['curlElbowLimb'])).toEqual([]); });
});

describe('niezmienniki: bez tekstu i liczb, limit elementów na rzut, element ⇔ wskazówka na karcie', () => {
  test('elementy to wyłącznie linie ciągłe i łuki (poly bez wypełnienia), w warstwie nad ciałem, bez pól tekstowych', () => {
    for (const k of [...CURL_KEYS, ...PULL_KEYS]) { const s = spec(k); const ts = techniquesOf(k); for (const v of s.views) for (const u of [0, 0.5, 1]) for (const x of overlayShapes(s, u, v, ts)) {
      expect(['line', 'poly']).toContain(x.k); expect(x.z).toBeGreaterThan(3000); expect(x.id).toMatch(/^curlElbowLimb(Line|Arc)$/);
      if (x.k === 'line') expect(x.dash).toBeUndefined(); else expect((x as { fill?: unknown }).fill).toBeUndefined();
      expect(JSON.stringify(x)).not.toMatch(/"(text|label|value)"/);
    } }
  });
  test('limit (W3): ≤ 3 linie i ≤ 1 łuk na rzut — suma linii odniesienia (GUIDES) i nakładki, w każdym ćwiczeniu curl/pull_up, rzucie, klatce i pozie błędu', () => {
    let razem = 0, zNakladka = 0;
    for (const k of [...CURL_KEYS, ...PULL_KEYS]) { const s = spec(k); const g = guidesOf(k), t = techniquesOf(k); const errs = [undefined, ...errorsOf(s).map(e => e.error)];
      for (const v of s.views) for (const u of [0, 0.25, 0.5, 0.75, 1]) for (const e of errs) {
        const all = [...guideShapes(s, u, v, g, e), ...overlayShapes(s, u, v, t, e, g)]; razem++; if (t.length) zNakladka++;
        expect([k, v, u, all.filter(x => x.k === 'line').length <= OVERLAY_MAX_LINES]).toEqual([k, v, u, true]);
        expect([k, v, u, all.filter(x => x.k === 'poly').length <= OVERLAY_MAX_ARCS]).toEqual([k, v, u, true]);
      } }
    expect(razem).toBeGreaterThan(300); expect(zNakladka).toBeGreaterThan(100);
  });
  test('element ⇔ wskazówka na karcie: dla KAŻDEGO ćwiczenia curl/pull_up techniquesOf = elementy, których wskazówka (dowolna z cue) jest na karcie; zdanie elementu istnieje', () => {
    for (const [k, fam, defs] of [...CURL_KEYS.map(k => [k, 'curl', CURL_TECHNIQUE] as const), ...PULL_KEYS.map(k => [k, 'pull_up', PULL_UP_TECHNIQUE] as const)]) {
      const have = new Set(cueIdsOf(k).ids); const want = defs.filter(d => d.cue.some(c => have.has(c))).map(d => d.id);
      expect([k, techniquesOf(k)]).toEqual([k, want]); expect(techniquesFor(fam, have).map(d => d.id)).toEqual(want);
      for (const id of want) expect(errorText(TECHNIQUE[fam].find(d => d.id === id)!.cue.find(c => have.has(c))!).length).toBeGreaterThan(0);
    }
    for (const k of ['Biceps Curl (hantle)', 'Barbell Curl', 'EZ Bar Curl', 'Hammer Curl', 'Preacher Curl', 'Spider Curl', 'Cable Curl']) expect([k, techniquesOf(k)]).toEqual([k, ['curlElbowLimb']]);
    for (const k of ['Incline Curl (hantle)', 'Concentration Curl (hantle)', 'Bayesian Curl', 'High Cable Curl', 'Drag Curl', 'Reverse Curl', 'Nie ma takiego']) expect([k, techniquesOf(k)]).toEqual([k, []]);
    for (const k of ['Pull Up', 'Chin Up', 'Dead Hang']) expect(techniquesOf(k)).toEqual([]);
    expect(techniquesFor('curl', ['dl.lift'])).toEqual([]); expect(techniquesFor('pull_up', ['pu.pull', 'pu.partial'])).toEqual([]); expect(techniquesFor('squat', ['curl.dbMove'])).toEqual([]);
  });
  test('ruch bez zmian: id elementów nie występuje w liniach odniesienia', () => {
    for (const k of ['Barbell Curl', 'Pull Up']) { const s = spec(k); for (const v of s.views) for (const x of guideShapes(s, 1, v, guidesOf(k))) expect(x.id).not.toMatch(/Limb/); }
  });
});

describe('kolor błędu: element w roli error tylko wtedy, gdy błąd łamie jego regułę', () => {
  test('silnik z danymi rodziny: reguła złamana → linia i łuk w roli error; inna reguła → guide (pozytyw i negatyw)', () => {
    const sk = frameAt(spec('Barbell Curl'), 1).sk; const side = measuredSide(spec('Barbell Curl')); const ctx = (danger: (r: string) => boolean) => ({ joint: 'elbow' as const, side, limbShown: true, danger });
    const red = techniqueShapes(sk, 'side', CURL_TECHNIQUE, ctx(r => r === 'lokiec_zgina_sie')), ok = techniqueShapes(sk, 'side', CURL_TECHNIQUE, ctx(r => r === 'lokiec_przy_tulowiu'));
    expect(red.length).toBe(2); for (const x of red) expect(role(x)).toBe('error'); for (const x of ok) expect(role(x)).toBe('guide');
  });
  test('prawdziwe błędy ćwiczeń: kolor elementu = errorBreaksRule(błąd, lokiec_zgina_sie) w każdej pozie błędu (grupa „zakres” — dziś żaden błąd curl jej nie łamie; curl.mis.elbows to grupa „lokcie”)', () => {
    let par = 0;
    for (const k of CURL_KEYS) { const s = spec(k); if (!techniquesOf(k).length) continue;
      for (const { error } of errorsOf(s)) { const broken = errorBreaksRule(s, error, 'lokiec_zgina_sie'); par++;
        for (const u of [0.5, 1]) for (const x of overlayShapes(s, u, 'side', ['curlElbowLimb'], error)) expect([k, error, role(x)]).toEqual([k, error, broken ? 'error' : 'guide']); } }
    expect(par).toBeGreaterThan(5);
    const bb = spec('Barbell Curl'); const el = errorsOf(bb).find(e => e.cue === 'curl.mis.elbows')!.error;
    expect([errorBreaksRule(bb, el, 'lokiec_przy_tulowiu'), errorBreaksRule(bb, el, 'lokiec_zgina_sie')]).toEqual([true, false]);
  });
});

describe('VoiceOver: etykieta obrazu „Na rysunku: …” z elementem curl', () => {
  test('onDrawingCues: uginanie — zdanie ruchu (curlElbowLimb); podciąganie — nic (brak elementów i linii)', () => {
    expect(onDrawingCues(spec('Barbell Curl'), guidesOf('Barbell Curl'), techniquesOf('Barbell Curl'))).toEqual(['curl.bbMove']);
    expect(onDrawingCues(spec('Hammer Curl'), guidesOf('Hammer Curl'), techniquesOf('Hammer Curl'))).toEqual(['curl.hammerMove']);
    expect(onDrawingCues(spec('Pull Up'), guidesOf('Pull Up'), techniquesOf('Pull Up'))).toEqual([]);
  });
  test('komponent: etykieta = „Rysunek ruchu: …. Na rysunku: {zdanie}” w PL i EN; podciąganie bez „Na rysunku”', async () => {
    AI.isReduceMotionEnabled.mockImplementation(() => Promise.resolve(true));
    await render(<ExerciseFigureV2 exercise={lib('Barbell Curl')} name="Uginanie ze sztangą" />); await flush();
    expect(screen.getAllByTestId('exercise-figure-v2-image').pop()!.props.accessibilityLabel).toBe(`Rysunek ruchu: Uginanie ze sztangą. Na rysunku: ${errorText('curl.bbMove')}`);
    await render(<ExerciseFigureV2 exercise={lib('Pull Up')} name="Podciąganie" />); await flush();
    expect(screen.getAllByTestId('exercise-figure-v2-image').pop()!.props.accessibilityLabel as string).not.toContain('Na rysunku');
    applyLang('en'); await render(<ExerciseFigureV2 exercise={lib('Barbell Curl')} name="Barbell curl" />); await flush();
    expect((screen.getAllByTestId('exercise-figure-v2-image').pop()!.props.accessibilityLabel as string).startsWith('Movement drawing: Barbell curl. On the drawing: ')).toBe(true);
  });
});
