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
import { ExerciseFigureV2, joinCues } from '@/components/ExerciseFigureV2';
import { CATALOG } from '@/lib/catalog.generated';
import { figureSpec, frameAt, guideShapes, measuredAngle, measuredSide, overlayShapes, errorBreaksRule, type FigureSpec, type Shape } from '@/lib/figures/v2';
import { OVERLAY_MAX_ARCS, OVERLAY_MAX_LINES, TECHNIQUE, techniqueGeom, techniqueShapes, techniquesFor } from '@/lib/figures/v2/overlay';
import { SQUAT_TECHNIQUE } from '@/lib/figures/v2/overlay/squat';
import { HINGE_TECHNIQUE } from '@/lib/figures/v2/overlay/hinge';
import { GUIDES } from '@/lib/figures/v2/guides';
import { proj } from '@/lib/figures/v2/draw';
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
  test('rejestr: squat = squatKneeLimb (limb, kolano), hinge = hingeUprightRef (E3: pion przez kostkę w górę); oba w rzucie z boku', () => {
    expect(SQUAT_TECHNIQUE.map(d => d.id)).toEqual(['squatKneeLimb']); expect(HINGE_TECHNIQUE.map(d => d.id)).toEqual(['hingeUprightRef']);
    expect(TECHNIQUE.squat).toBe(SQUAT_TECHNIQUE); expect(TECHNIQUE.hinge).toBe(HINGE_TECHNIQUE);
    expect([SQUAT_TECHNIQUE[0].kind, SQUAT_TECHNIQUE[0].joint, SQUAT_TECHNIQUE[0].views]).toEqual(['limb', 'knee', ['side']]);
    expect([HINGE_TECHNIQUE[0].kind, HINGE_TECHNIQUE[0].ref, HINGE_TECHNIQUE[0].views]).toEqual(['ref', { shape: 'vertical', through: 'ankle', dir: 'up' }, ['side']]);
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
  test.each([['squat', 'squatKneeLimb', 'knee']] as const)('%s: rozwarcie łuku %s = measuredAngle (zgięcie stawu) w każdym ćwiczeniu z elementem', (fam, id, joint) => {
    const keys = cases(SQUAT_KEYS, id); expect(keys.length).toBeGreaterThan(10);
    for (const k of keys) { const s = spec(k); const side = measuredSide(s);
      for (const u of US) {
        const f = frameAt(s, u); const g = techniqueGeom('limb', f.sk, side, joint)!; const m = measuredAngle(s, u);
        expect([k, u, m.joint, Math.abs(g.sweepDeg - m.deg) <= 1]).toEqual([k, u, joint, true]);
        const sh = overlayShapes(s, u, 'side', [id]); expect([k, u, sh.filter(x => x.k === 'line').length]).toEqual([k, u, 1]); /* linia jest zawsze, także w wyproście */
        expect([k, u, sh.filter(x => x.k === 'poly').length]).toEqual([k, u, g.arc ? 1 : 0]);
      } }
  });
  test('przysiad: u góry (wyprost kolana) łuk znika, u dołu jest linia i łuk', () => {
    const sq = spec('Back Squat');
    const n = (s: FigureSpec, u: number, id: string) => { const sh = overlayShapes(s, u, 'side', [id]); return [sh.filter(x => x.k === 'line').length, sh.filter(x => x.k === 'poly').length]; };
    expect(n(sq, 1, 'squatKneeLimb')).toEqual([1, 1]); expect(n(sq, 0, 'squatKneeLimb')).toEqual([1, 0]);
  });
  test('zawias (E3): pion przez kostkę — jedna linia ciągła, bez łuku, dokładnie pionowa i na x kostki w każdej klatce; na szczycie martwego ciągu bark, biodro, kolano i kostka leżą na tym pionie (±8 cm)', () => {
    const keys = HINGE_KEYS.filter(k => techniquesOf(k).includes('hingeUprightRef')); expect(keys.length).toBeGreaterThan(8);
    for (const k of keys) { const s = spec(k); const side = measuredSide(s);
      for (const u of US) { const sh = overlayShapes(s, u, 'side', ['hingeUprightRef']); const ln = sh.filter(x => x.k === 'line') as { a: [number, number]; b: [number, number] }[];
        expect([k, u, ln.length, sh.length]).toEqual([k, u, 1, 1]); const ank = proj(frameAt(s, u).sk.legs[side].ankle, 'side');
        expect([k, u, ln[0].a[0] === ln[0].b[0], Math.abs(ln[0].a[0] - ank[0]) < 1e-9]).toEqual([k, u, true, true]); } }
    const dl = frameAt(spec('Deadlift (sztanga)'), 1).sk, side = measuredSide(spec('Deadlift (sztanga)')), ax = proj(dl.legs[side].ankle, 'side')[0];
    for (const p of [dl.shoulderC, dl.legs[side].hip, dl.legs[side].knee]) expect(Math.abs(proj(p, 'side')[0] - ax)).toBeLessThan(8);
  });
  test('rzut z przodu nie dostaje elementu (kolano/biodro są mierzone z boku): overlayShapes(front) puste', () => {
    for (const [k, id] of [['Back Squat', 'squatKneeLimb'], ['Deadlift (sztanga)', 'hingeUprightRef']] as const) for (const u of US) expect(overlayShapes(spec(k), u, 'front', [id])).toEqual([]);
  });
});

describe('niezmienniki: bez tekstu i liczb, limit elementów na rzut, element ⇔ wskazówka na karcie', () => {
  test('elementy to wyłącznie linie ciągłe i łuki (poly bez wypełnienia), w warstwie nad ciałem, bez pól tekstowych', () => {
    for (const k of [...SQUAT_KEYS, ...HINGE_KEYS]) { const s = spec(k); const ts = techniquesOf(k); for (const v of s.views) for (const u of [0, 0.5, 1]) for (const x of overlayShapes(s, u, v, ts)) {
      expect(['line', 'poly']).toContain(x.k); expect(x.z).toBeGreaterThan(3000); expect(x.id).toMatch(/^(squatKneeLimb|hingeUprightRef)(Line|Arc)$/);
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
    expect(cnt('Back Squat', 'side', 1)).toEqual([3, 1]); expect(cnt('Back Squat', 'front', 1)).toEqual([2, 0]); expect(cnt('Deadlift (sztanga)', 'side', 0.5)).toEqual([3, 0]);
  });
  test('element tylko z wskazówką karty: dla każdego ćwiczenia squat/hinge techniquesOf = elementy, których wskazówka (dowolna z cue) jest na karcie; spoza zestawu → brak', () => {
    for (const [k, fam, defs] of [...SQUAT_KEYS.map(k => [k, 'squat', SQUAT_TECHNIQUE] as const), ...HINGE_KEYS.map(k => [k, 'hinge', HINGE_TECHNIQUE] as const)]) {
      const have = new Set(cueIdsOf(k).ids); const want = defs.filter(d => d.cue.some(c => have.has(c))).map(d => d.id);
      const zRegula = want.filter(id => techniquesFor(fam, have, k).some(d => d.id === id)); /* fix4 R1 (04.11.2026): element tylko z regułą „ustalone” wariantu (reguly-cwiczen.json) — szczegóły: figures-v2-nakladka-fix4.test.tsx */
      expect([k, techniquesOf(k)]).toEqual([k, zRegula]); expect(zRegula.length === want.length || /^Single Leg RDL/.test(k)).toBe(true); expect(techniquesFor(fam, have).map(d => d.id)).toEqual(want);
      for (const id of want) expect(errorText(TECHNIQUE[fam].find(d => d.id === id)!.cue.find(c => have.has(c))!).length).toBeGreaterThan(0); /* zdanie elementu (cue) jest na karcie */
    }
    expect(techniquesOf('Back Squat')).toEqual(['squatKneeLimb']); expect(techniquesOf('Goblet Squat')).toEqual(['squatKneeLimb']); expect(techniquesOf('Box Squat')).toEqual(['squatKneeLimb']);
    expect(techniquesOf('Deadlift (sztanga)')).toEqual(['hingeUprightRef']); expect(techniquesOf('RDL (sztanga)')).toEqual(['hingeUprightRef']); expect(techniquesOf('Good Morning')).toEqual(['hingeUprightRef']);
    expect(techniquesOf('Wall Sit')).toEqual([]); expect(techniquesOf('Single Leg RDL (hantel)')).toEqual([]); expect(techniquesOf('Stiff-Legged Barbell Deadlift')).toEqual(['hingeUprightRef']); /* 04.11.2026: karta ma rdl.dbMove, ale wariant jednonóż ma wyprost na górze tylko jako „analogia” → bez pionu (fix4 R1, wariant A′; recenzja różnicy elementów) */
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
    expect(screen.getAllByTestId('exercise-figure-v2-image').pop()!.props.accessibilityLabel).toBe(`Rysunek ruchu: Przysiad. Na rysunku: ${joinCues(['sq.depth', 'sq.kneesToes', 'sq.back', 'sq.down'].map(errorText))}`);
    await render(<ExerciseFigureV2 exercise={lib('Deadlift (sztanga)')} name="Martwy ciąg" />); await flush();
    expect(screen.getAllByTestId('exercise-figure-v2-image').pop()!.props.accessibilityLabel).toBe(`Rysunek ruchu: Martwy ciąg. Na rysunku: ${joinCues(['dl.feet', 'hinge.back', 'dl.lift'].map(errorText))}`);
    applyLang('en'); await render(<ExerciseFigureV2 exercise={lib('Back Squat')} name="Squat" />); await flush();
    expect((screen.getAllByTestId('exercise-figure-v2-image').pop()!.props.accessibilityLabel as string).startsWith('Movement drawing: Squat. On the drawing: ')).toBe(true);
  });
});

type Ln = Extract<Shape, { k: 'line' }>;
/** Czy dwa odcinki leżą w tym samym miejscu: oba końce krótszego w ≤ 1,2 cm od prostej dłuższego, a rzuty odcinków na jego oś pokrywają ≥ 50% krótszego (linia pod linią). */
const sameSpot = (p: Ln, q: Ln): boolean => {
  const [s1, l1] = Math.hypot(p.b[0] - p.a[0], p.b[1] - p.a[1]) <= Math.hypot(q.b[0] - q.a[0], q.b[1] - q.a[1]) ? [p, q] : [q, p];
  const dx = l1.b[0] - l1.a[0], dy = l1.b[1] - l1.a[1], L = Math.hypot(dx, dy) || 1; const ux = dx / L, uy = dy / L;
  const dist = (pt: [number, number]) => Math.abs((pt[0] - l1.a[0]) * uy - (pt[1] - l1.a[1]) * ux), along = (pt: [number, number]) => (pt[0] - l1.a[0]) * ux + (pt[1] - l1.a[1]) * uy;
  if (dist(s1.a) > 1.2 || dist(s1.b) > 1.2) return false;
  const lo = Math.max(0, Math.min(along(s1.a), along(s1.b))), hi = Math.min(L, Math.max(along(s1.a), along(s1.b))), ls = Math.hypot(s1.b[0] - s1.a[0], s1.b[1] - s1.a[1]) || 1;
  return (hi - lo) / ls >= 0.5;
};

describe('etap 2 po scaleniu E3: kolor błędu linii odniesienia i brak dwóch linii w tym samym miejscu (recenzja 2R P1: W4\', S1)', () => {
  test('W4\': linia pleców (backLine) jest w kolorze błędu przy mis.roundBack w martwym ciągu, RDL i przysiadzie Hack, a kneeToe (z przodu) przy sq.mis.kneesIn; bez błędu — guide', () => {
    const roleOf = (k: string, view: 'side' | 'front', cue: string | undefined, id: string) => { const s = spec(k); const e = cue ? errorsOf(s).find(x => x.cue === cue)?.error : undefined; if (cue) expect([k, cue, !!e]).toEqual([k, cue, true]);
      const g = guideShapes(s, 1, view, guidesOf(k), e).filter(x => x.k === 'line' && x.id === id) as Ln[]; expect([k, id, g.length]).toEqual([k, id, 1]); return g[0].role; };
    for (const k of ['Deadlift (sztanga)', 'RDL (sztanga)', 'Good Morning', 'Barbell Hack Squat']) {
      expect([k, roleOf(k, 'side', 'mis.roundBack', 'guideBack')]).toEqual([k, 'error']); expect([k, roleOf(k, 'side', undefined, 'guideBack')]).toEqual([k, 'guide']);
    }
    expect(roleOf('Back Squat', 'front', 'sq.mis.kneesIn', 'guideKneeL')).toBe('error'); expect(roleOf('Back Squat', 'front', undefined, 'guideKneeL')).toBe('guide');
  });
  test('S1: w żadnej klatce, żadnym rzucie i żadnej pozie błędu squat/hinge dwie linie (odniesienia + nakładka) nie leżą jedna pod drugą — wyjątek tylko poziom uda i linia uda przysiadu przy udzie poziomo', () => {
    let pary = 0, kadry = 0; const bad: string[] = [];
    for (const k of [...SQUAT_KEYS, ...HINGE_KEYS]) { const s = spec(k); const g = guidesOf(k), t = techniquesOf(k);
      for (const v of s.views) for (const u of US) for (const e of [undefined, ...errorsOf(s).map(x => x.error)]) { const ls = [...guideShapes(s, u, v, g, e), ...overlayShapes(s, u, v, t, e, g)].filter(x => x.k === 'line') as Ln[]; kadry++;
        for (let i = 0; i < ls.length; i++) for (let j = i + 1; j < ls.length; j++) { pary++; if (sameSpot(ls[i], ls[j])) bad.push(`${k} ${v} u=${u} ${ls[i].id}+${ls[j].id}`); } }
    }
    expect(kadry).toBeGreaterThan(3000); expect(pary).toBeGreaterThan(3000);
    /* martwy ciąg na szczycie: pion kostki i linia pleców/pion środka stopy mogą się pokryć tylko wtedy, gdy rysunek jest w idealnym wyproście — liczymy ułamek klatek */
    expect(bad.length / kadry).toBeLessThan(0.02);
    /* jedyny dozwolony wyjątek: poziom uda (guideThigh) i linia uda przysiadu, gdy udo jest poziomo — cel głębokości osiągnięty (linia odniesienia zgodna z ciałem z definicji) */
    expect(bad.filter(b => !/guideThigh\+squatKneeLimbLine$/.test(b))).toEqual([]);
  });
});
