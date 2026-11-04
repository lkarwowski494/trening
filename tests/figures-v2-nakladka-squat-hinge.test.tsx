/*
 * Figury v2 — nakładka techniki, etap 2: rodziny squat i hinge (04.11.2026; spec „rysunek pokazuje technikę”, decyzje właściciela 04.11.2026: zawsze widoczne, ≤ 3 linie + 1 łuk na rzut
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
import { SQUAT_TECHNIQUE } from '@/lib/figures/v2/overlay/squat';
import { HINGE_TECHNIQUE } from '@/lib/figures/v2/overlay/hinge';
import { GUIDES } from '@/lib/figures/v2/guides';
import { errorsOf, techniquesOf, onDrawingCues, guidesOf, cueIdsOf, errorText } from '@/lib/figures/v2/ui';
import { applyLang } from '@/lib/i18n';

const spec = (k: string): FigureSpec => figureSpec(k) as FigureSpec;
const lib = (key: string) => ({ lib: true as const, libKey: key });
const AI = RN.AccessibilityInfo as unknown as { isReduceMotionEnabled: jest.Mock };
const flush = async () => { await act(async () => { await Promise.resolve(); }); };
const keysOf = (family: string) => Object.keys(CATALOG).filter(k => { try { return figureSpec(k)?.family === family; } catch { return false; } });
const SQUAT_KEYS = keysOf('squat'), HINGE_KEYS = keysOf('hinge');
const US = Array.from({ length: 21 }, (_, i) => i / 20);
const role = (x: Shape): string | undefined => (x.k === 'line' ? x.role : (x as { stroke?: string }).stroke);
const sens = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'data/zrodla/figury-sens.json'), 'utf8')).rodziny;

afterEach(() => { applyLang('pl'); AI.isReduceMotionEnabled.mockImplementation(() => Promise.resolve(false)); });

describe('dane: elementy rodzin squat i hinge ← reguły ze źródłem', () => {
  test('rejestr: squat = squatKneeLimb, hinge = hingeHipLimb; rodzaj limb w stawie mierzonym rodziny (kolano / biodro) i w rzucie z boku', () => {
    expect(SQUAT_TECHNIQUE.map(d => d.id)).toEqual(['squatKneeLimb']); expect(HINGE_TECHNIQUE.map(d => d.id)).toEqual(['hingeHipLimb']);
    expect(TECHNIQUE.squat).toBe(SQUAT_TECHNIQUE); expect(TECHNIQUE.hinge).toBe(HINGE_TECHNIQUE);
    expect([SQUAT_TECHNIQUE[0].kind, SQUAT_TECHNIQUE[0].joint, SQUAT_TECHNIQUE[0].views]).toEqual(['limb', 'knee', ['side']]);
    expect([HINGE_TECHNIQUE[0].kind, HINGE_TECHNIQUE[0].joint, HINGE_TECHNIQUE[0].views]).toEqual(['limb', 'hip', ['side']]);
  });
  test.each([['squat', SQUAT_TECHNIQUE], ['hinge', HINGE_TECHNIQUE]] as const)('%s: reguła elementu istnieje, jest „ustalone” (bez zastrzeżeń), a każda wskazówka elementu należy do wskazowki_na_reguly tej reguły', (fam, defs) => {
    for (const d of defs) {
      const r = sens[fam].reguly[d.rule]; expect(r).toBeTruthy(); expect(r.pewnosc).toMatch(/^ustalone/); expect(d.cue.length).toBeGreaterThan(0);
      for (const c of d.cue) expect([c, sens[fam].wskazowki_na_reguly[c]]).toEqual([c, expect.arrayContaining([d.rule])]);
    }
    expect(defs.map(d => d.rule)).toEqual([fam === 'squat' ? 'zejscie_biodra_i_kolana' : 'wyprost_na_gorze']);
  });
  test('linia pleców (backLine): wskazówki hinge.back, sq.back i wall.back — każda z nich należy do reguły plecy_neutralne (squat/hinge, ustalone) albo tulow_przy_scianie', () => {
    expect(GUIDES.backLine.cue).toEqual(['hinge.back', 'sq.back', 'wall.back']);
    expect(sens.hinge.reguly.plecy_neutralne.pewnosc).toMatch(/^ustalone/); expect(sens.squat.reguly.plecy_neutralne.pewnosc).toMatch(/^ustalone/);
    expect(sens.squat.wskazowki_na_reguly['sq.back']).toContain('plecy_neutralne'); expect(sens.squat.wskazowki_na_reguly['wall.back']).toContain('plecy_neutralne');
  });
});

describe('geometria: łuk = kąt z jointAngles (±1°) w 21 klatkach', () => {
  const cases = (keys: string[], id: string) => keys.filter(k => techniquesOf(k).includes(id));
  test.each([['squat', 'squatKneeLimb', 'knee'], ['hinge', 'hingeHipLimb', 'hip']] as const)('%s: rozwarcie łuku %s = measuredAngle (zgięcie stawu) w każdym ćwiczeniu z elementem', (fam, id, joint) => {
    const keys = cases(fam === 'squat' ? SQUAT_KEYS : HINGE_KEYS, id); expect(keys.length).toBeGreaterThan(10);
    for (const k of keys) { const s = spec(k); const side = measuredSide(s);
      for (const u of US) {
        const f = frameAt(s, u); const g = techniqueGeom('limb', f.sk, side, joint)!; const m = measuredAngle(s, u);
        expect([k, u, m.joint, Math.abs(g.sweepDeg - m.deg) <= 1]).toEqual([k, u, joint, true]);
        const sh = overlayShapes(s, u, 'side', [id]); expect([k, u, sh.filter(x => x.k === 'line').length]).toEqual([k, u, 1]); /* linia jest zawsze, także w wyproście */
        expect([k, u, sh.filter(x => x.k === 'poly').length]).toEqual([k, u, g.arc ? 1 : 0]);
      } }
  });
  test('przysiad: u góry (wyprost kolana) łuk znika, u dołu jest linia i łuk; zawias: łuk biodra rośnie w RDL/Good Morning w dół (od ok. 12–21° do 64–74°) i maleje w martwym ciągu ku wyprostowi (ok. 7–12° na górze — wartość pomiaru rigu, łuk zostaje)', () => {
    const sq = spec('Back Squat');
    const n = (s: FigureSpec, u: number, id: string) => { const sh = overlayShapes(s, u, 'side', [id]); return [sh.filter(x => x.k === 'line').length, sh.filter(x => x.k === 'poly').length]; };
    expect(n(sq, 1, 'squatKneeLimb')).toEqual([1, 1]); expect(n(sq, 0, 'squatKneeLimb')).toEqual([1, 0]);
    const sweep = (k: string, u: number) => { const s = spec(k); return techniqueGeom('limb', frameAt(s, u).sk, measuredSide(s), 'hip')!.sweepDeg; };
    expect(sweep('Deadlift (sztanga)', 0)).toBeGreaterThan(100); expect(sweep('Deadlift (sztanga)', 1)).toBeLessThan(15);
    expect(sweep('RDL (sztanga)', 0)).toBeLessThan(25); expect(sweep('RDL (sztanga)', 1)).toBeGreaterThan(60);
    for (const k of ['Deadlift (sztanga)', 'RDL (sztanga)', 'Good Morning']) for (const u of [0, 1]) expect(n(spec(k), u, 'hingeHipLimb')).toEqual([1, 1]); /* łuk ≥ progu OVERLAY_ARC_MIN_DEG także na szczycie */
  });
  test('rzut z przodu nie dostaje elementu (kolano/biodro są mierzone z boku): overlayShapes(front) puste', () => {
    for (const [k, id] of [['Back Squat', 'squatKneeLimb'], ['Deadlift (sztanga)', 'hingeHipLimb']] as const) for (const u of US) expect(overlayShapes(spec(k), u, 'front', [id])).toEqual([]);
  });
});

describe('niezmienniki: bez tekstu i liczb, limit elementów na rzut, element ⇔ wskazówka na karcie', () => {
  test('elementy to wyłącznie linie ciągłe i łuki (poly bez wypełnienia), w warstwie nad ciałem, bez pól tekstowych', () => {
    for (const k of [...SQUAT_KEYS, ...HINGE_KEYS]) { const s = spec(k); const ts = techniquesOf(k); for (const v of s.views) for (const u of [0, 0.5, 1]) for (const x of overlayShapes(s, u, v, ts)) {
      expect(['line', 'poly']).toContain(x.k); expect(x.z).toBeGreaterThan(3000); expect(x.id).toMatch(/^(squatKneeLimb|hingeHipLimb)(Line|Arc)$/);
      if (x.k === 'line') expect(x.dash).toBeUndefined(); else expect((x as { fill?: unknown }).fill).toBeUndefined();
      expect(JSON.stringify(x)).not.toMatch(/"(text|label|value)"/);
    } }
  });
  test('limit (W3): ≤ 3 linie i ≤ 1 łuk na rzut — suma linii odniesienia (GUIDES) i nakładki, w każdym ćwiczeniu squat/hinge, rzucie, klatce i pozie błędu', () => {
    let razem = 0, zNakladka = 0;
    for (const k of [...SQUAT_KEYS, ...HINGE_KEYS]) { const s = spec(k); const g = guidesOf(k), t = techniquesOf(k); const errs = [undefined, ...errorsOf(s).map(e => e.error)];
      for (const v of s.views) for (const u of [0, 0.25, 0.5, 0.75, 1]) for (const e of errs) {
        const all = [...guideShapes(s, u, v, g, e), ...overlayShapes(s, u, v, t, e, g)]; razem++; if (t.length) zNakladka++;
        expect([k, v, u, all.filter(x => x.k === 'line').length <= OVERLAY_MAX_LINES]).toEqual([k, v, u, true]);
        expect([k, v, u, all.filter(x => x.k === 'poly').length <= OVERLAY_MAX_ARCS]).toEqual([k, v, u, true]);
      } }
    expect(razem).toBeGreaterThan(1000); expect(zNakladka).toBeGreaterThan(500);
  });
  test('najgęstszy rzut: przysiad z boku ma dokładnie 3 linie (poziom uda + linia pleców + udo) i 1 łuk; przysiad z przodu — tylko linie palców (bez nakładki); zawias z boku: pion + linia pleców + tułów', () => {
    const cnt = (k: string, v: 'side' | 'front', u: number) => { const s = spec(k); const a = [...guideShapes(s, u, v, guidesOf(k)), ...overlayShapes(s, u, v, techniquesOf(k), undefined, guidesOf(k))]; return [a.filter(x => x.k === 'line').length, a.filter(x => x.k === 'poly').length]; };
    expect(cnt('Back Squat', 'side', 1)).toEqual([3, 1]); expect(cnt('Back Squat', 'front', 1)).toEqual([2, 0]); expect(cnt('Deadlift (sztanga)', 'side', 0.5)).toEqual([3, 1]);
  });
  test('element tylko z wskazówką karty: dla każdego ćwiczenia squat/hinge techniquesOf = elementy, których wskazówka (dowolna z cue) jest na karcie; spoza zestawu → brak', () => {
    for (const [k, fam, defs] of [...SQUAT_KEYS.map(k => [k, 'squat', SQUAT_TECHNIQUE] as const), ...HINGE_KEYS.map(k => [k, 'hinge', HINGE_TECHNIQUE] as const)]) {
      const have = new Set(cueIdsOf(k).ids); const want = defs.filter(d => d.cue.some(c => have.has(c))).map(d => d.id);
      expect([k, techniquesOf(k)]).toEqual([k, want]); expect(techniquesFor(fam, have).map(d => d.id)).toEqual(want);
      for (const id of want) expect(errorText(TECHNIQUE[fam].find(d => d.id === id)!.cue.find(c => have.has(c))!).length).toBeGreaterThan(0); /* zdanie elementu (cue) jest na karcie */
    }
    expect(techniquesOf('Back Squat')).toEqual(['squatKneeLimb']); expect(techniquesOf('Goblet Squat')).toEqual(['squatKneeLimb']); expect(techniquesOf('Box Squat')).toEqual(['squatKneeLimb']);
    expect(techniquesOf('Deadlift (sztanga)')).toEqual(['hingeHipLimb']); expect(techniquesOf('RDL (sztanga)')).toEqual(['hingeHipLimb']); expect(techniquesOf('Good Morning')).toEqual(['hingeHipLimb']);
    expect(techniquesOf('Wall Sit')).toEqual([]); expect(techniquesOf('Single Leg RDL (hantel)')).toEqual([]); expect(techniquesOf('Stiff-Legged Barbell Deadlift')).toEqual([]);
    expect(techniquesFor('squat', ['dl.lift'])).toEqual([]); expect(techniquesFor('hinge', ['sq.down'])).toEqual([]); expect(techniquesFor('olympic', ['sq.down'])).toEqual([]);
  });
  test('linia pleców: przysiad dostaje ją przy sq.back, przysiad przy ścianie przy wall.back; bez wskazówki — brak (guidesOf)', () => {
    expect(guidesOf('Back Squat')).toEqual(['thighParallel', 'kneeToe', 'backLine']); expect(guidesOf('Box Squat')).toEqual(['kneeToe', 'backLine']); expect(guidesOf('Wall Sit')).toEqual(['backLine']);
    expect(guidesOf('Goblet Squat')).toEqual(['thighParallel', 'kneeToe']); expect(guidesOf('Deadlift (sztanga)')).toEqual(['plumbMidfoot', 'backLine']);
  });
  test('ruch bez zmian: nakładka to osobne kształty — id elementów nie ma w kształtach ciała ani linii odniesienia', () => {
    for (const k of ['Back Squat', 'Deadlift (sztanga)']) { const s = spec(k); for (const v of s.views) for (const x of guideShapes(s, 1, v, guidesOf(k))) expect(x.id).not.toMatch(/Limb/); }
  });
});

describe('kolor błędu (W2b): element w roli error tylko wtedy, gdy błąd łamie jego regułę', () => {
  test('silnik z danymi rodzin: reguła złamana → linia i łuk w roli error; inna reguła → guide (pozytyw i negatyw)', () => {
    for (const [k, defs, rule] of [['Back Squat', SQUAT_TECHNIQUE, 'zejscie_biodra_i_kolana'], ['Deadlift (sztanga)', HINGE_TECHNIQUE, 'wyprost_na_gorze']] as const) {
      const sk = frameAt(spec(k), 1).sk; const side = measuredSide(spec(k)); const ctx = (danger: (r: string) => boolean) => ({ joint: defs[0].joint!, side, limbShown: true, danger });
      const red = techniqueShapes(sk, 'side', defs, ctx(r => r === rule)), ok = techniqueShapes(sk, 'side', defs, ctx(r => r === 'plecy_neutralne'));
      expect(red.length).toBeGreaterThanOrEqual(1); for (const x of red) expect(role(x)).toBe('error'); for (const x of ok) expect(role(x)).toBe('guide');
    }
  });
  test('prawdziwe błędy ćwiczeń: kolor elementu = errorBreaksRule(błąd, reguła elementu) w każdej pozie błędu (dziś żaden błąd squat/hinge nie łamie reguły „zejście”/„wyprost” — grupy plecy, kolana, pięty, tor)', () => {
    let par = 0;
    for (const k of [...SQUAT_KEYS, ...HINGE_KEYS]) { const s = spec(k); const ts = techniquesOf(k); if (!ts.length) continue;
      for (const { error } of errorsOf(s)) for (const id of ts) { const d = TECHNIQUE[s.family].find(x => x.id === id)!; const broken = errorBreaksRule(s, error, d.rule); par++;
        for (const u of [0.5, 1]) for (const x of overlayShapes(s, u, 'side', [id], error)) expect([k, error, id, role(x)]).toEqual([k, error, id, broken ? 'error' : 'guide']); } }
    expect(par).toBeGreaterThan(20);
    /* mapowanie błąd → reguła działa dla reguł bez elementu (luka silnika: pion/linia pleców jako element z regułą — raport etapu 2) */
    const sq = spec('Back Squat'); const kneesIn = errorsOf(sq).find(e => e.cue === 'sq.mis.kneesIn')!.error;
    expect([errorBreaksRule(sq, kneesIn, 'kolana_nad_stopami'), errorBreaksRule(sq, kneesIn, 'zejscie_biodra_i_kolana')]).toEqual([true, false]);
    const dl = spec('Deadlift (sztanga)'); const round = errorsOf(dl).find(e => e.cue === 'mis.roundBack')!.error;
    expect([errorBreaksRule(dl, round, 'plecy_neutralne'), errorBreaksRule(dl, round, 'wyprost_na_gorze')]).toEqual([true, false]);
  });
});

describe('VoiceOver: etykieta obrazu „Na rysunku: …” z elementami squat/hinge', () => {
  test('onDrawingCues: przysiad — poziom uda, linie palców, linia pleców i zejście (wskazówka elementu); zawias — pion, linia pleców i wyprost; bez powtórzeń', () => {
    const sq = onDrawingCues(spec('Back Squat'), guidesOf('Back Squat'), techniquesOf('Back Squat')); expect(sq).toEqual(['sq.depth', 'sq.kneesToes', 'sq.back', 'sq.down']);
    expect(onDrawingCues(spec('Deadlift (sztanga)'), guidesOf('Deadlift (sztanga)'), techniquesOf('Deadlift (sztanga)'))).toEqual(['dl.feet', 'hinge.back', 'dl.lift']);
    expect(onDrawingCues(spec('Goblet Squat'), guidesOf('Goblet Squat'), techniquesOf('Goblet Squat'))).toEqual(['sq.depth', 'sq.kneesToes', 'gob.move']);
    expect(onDrawingCues(spec('Wall Sit'), guidesOf('Wall Sit'), techniquesOf('Wall Sit'))).toEqual(['wall.back']);
  });
  test('komponent: etykieta = „Rysunek ruchu: …. Na rysunku: {zdania}” w PL i EN (przysiad i martwy ciąg)', async () => {
    AI.isReduceMotionEnabled.mockImplementation(() => Promise.resolve(true));
    await render(<ExerciseFigureV2 exercise={lib('Back Squat')} name="Przysiad" />); await flush();
    expect(screen.getAllByTestId('exercise-figure-v2-image').pop()!.props.accessibilityLabel).toBe(`Rysunek ruchu: Przysiad. Na rysunku: ${['sq.depth', 'sq.kneesToes', 'sq.back', 'sq.down'].map(errorText).join('; ')}`);
    await render(<ExerciseFigureV2 exercise={lib('Deadlift (sztanga)')} name="Martwy ciąg" />); await flush();
    expect(screen.getAllByTestId('exercise-figure-v2-image').pop()!.props.accessibilityLabel).toBe(`Rysunek ruchu: Martwy ciąg. Na rysunku: ${['dl.feet', 'hinge.back', 'dl.lift'].map(errorText).join('; ')}`);
    applyLang('en'); await render(<ExerciseFigureV2 exercise={lib('Back Squat')} name="Squat" />); await flush();
    expect((screen.getAllByTestId('exercise-figure-v2-image').pop()!.props.accessibilityLabel as string).startsWith('Movement drawing: Squat. On the drawing: ')).toBe(true);
  });
});
