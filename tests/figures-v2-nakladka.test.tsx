/*
 * Figury v2 — nakładka techniki (04.11.2026, decyzja właściciela: rysunek graficznie pokazuje technikę; spec „rysunek pokazuje technikę”, etap 1: wyciskanie leżąc).
 * Rodzaje (docs/20): logika/geometria (łuk = kąt z jointAngles ±1°), niezmienniki (bez liczb i tekstu na rysunku, limit elementów na rzut, element zawsze z wskazówką karty i regułą ze źródłem),
 * dane (id wskazówek elementów = wskazowki_na_reguly), kolor błędu (W2b: danger tylko dla elementu reguły z grupy błędu), VoiceOver (etykieta „Na rysunku: …”), wygląd (kontrast w 4 motywach).
 */
jest.mock('@/lib/figures/data.json', () => require('./figure-gate-open').openFigureGate(jest.requireActual('@/lib/figures/data.json'))); /* bramka 4 otwarta: ten test sprawdza rysowanie, nie recenzję rodziny */
import * as fs from 'fs';
import * as path from 'path';
import React from 'react';
import * as RN from 'react-native';
import { render, screen, act } from '@testing-library/react-native';
import { ExerciseFigureV2, joinCues } from '@/components/ExerciseFigureV2';
import { CATALOG } from '@/lib/catalog.generated';
import {
  figureSpec, frameAt, trailFor, guideShapes, measuredAngle, measuredSide, jointAngles, overlayShapes, errorBreaksRule, GROUP_DATA, figurePalette, contrast, shapesAt, type FigureSpec, type Shape,
} from '@/lib/figures/v2';
import { OVERLAY_ARC_MIN_CHORD, OVERLAY_ARM_MIN_PROJ, OVERLAY_REF_LEN, abductionGeom2D, OVERLAY_ARC_R, OVERLAY_MAX_ARCS, OVERLAY_MAX_LINES, TECHNIQUE, techniqueGeom, techniqueShapes, techniquesFor, techniqueDef, limbTriple, arcPoints3, type TechniqueDef, type TechniqueKind } from '@/lib/figures/v2/overlay';
import { OVERLAY_LINE_W, solid } from '@/lib/figures/v2/overlay/common';
import { BENCH_TECHNIQUE } from '@/lib/figures/v2/overlay/bench_press';
import { SQUAT_GUIDES } from '@/lib/figures/v2/overlay/squat';
import { HINGE_GUIDES } from '@/lib/figures/v2/overlay/hinge';
import { GUIDES } from '@/lib/figures/v2/guides';
import { errorsOf, techniquesOf, onDrawingCues, guidesOf, cueIdsOf, errorText } from '@/lib/figures/v2/ui';
import { proj } from '@/lib/figures/v2/draw';
import { applyLang } from '@/lib/i18n';
import { light, dark, lightHC, darkHC } from '@/lib/theme';

const spec = (k: string): FigureSpec => figureSpec(k) as FigureSpec;
const lib = (key: string) => ({ lib: true as const, libKey: key });
const AI = RN.AccessibilityInfo as unknown as { isReduceMotionEnabled: jest.Mock };
const flush = async () => { await act(async () => { await Promise.resolve(); }); };
const BENCH_KEYS = Object.keys(CATALOG).filter(k => { try { return figureSpec(k)?.family === 'bench_press'; } catch { return false; } });
/** Ćwiczenie z figurą v2, które nie ma żadnej linii ani elementu nakładki (etykieta bez „Na rysunku”). */
const NO_ELEMENTS = Object.keys(CATALOG).find(k => { try { return !!figureSpec(k) && guidesOf(k).length === 0 && techniquesOf(k).length === 0; } catch { return false; } }) as string;
const US = Array.from({ length: 21 }, (_, i) => i / 20);
const isTech = (s: Shape): boolean => /^bench.*(Line|Arc)$/.test(s.id ?? '');

afterEach(() => { applyLang('pl'); AI.isReduceMotionEnabled.mockImplementation(() => Promise.resolve(false)); });

describe('geometria: łuk = kąt z jointAngles (±1°)', () => {
  test.each(['Bench Press (sztanga)', 'Bench Press (hantle)', 'Close Grip Bench Press', 'Decline Bench Press'])('%s: rozwarcie łuku łokcia = measuredAngle (zgięcie łokcia) w 21 klatkach', key => {
    const s = spec(key);
    for (const u of US) {
      const f = frameAt(s, u); const g = techniqueGeom('limb', f.sk, 'R', 'elbow')!; const m = measuredAngle(s, u);
      expect([key, u, Math.abs(g.sweepDeg - m.deg) <= 1]).toEqual([key, u, true]);
      if (g.arc) { /* kąt między pierwszym a ostatnim punktem łuku widziany ze środka (łokcia) = rozwarcie; punkty leżą na promieniu OVERLAY_ARC_R */
        const c = f.sk.arms.R.elbow; const a = g.arc[0].map((x, i) => x - c[i]), b = g.arc[g.arc.length - 1].map((x, i) => x - c[i]);
        const cos = (a[0] * b[0] + a[1] * b[1] + a[2] * b[2]) / (Math.hypot(...a) * Math.hypot(...b)); expect(Math.abs(Math.acos(cos) * 180 / Math.PI - g.sweepDeg)).toBeLessThanOrEqual(1);
        for (const p of g.arc) expect(Math.abs(Math.hypot(p[0] - c[0], p[1] - c[1], p[2] - c[2]) - OVERLAY_ARC_R)).toBeLessThan(1e-6);
      }
    }
  });
  test('odwiedzenie ramienia (W2): liczone w 2D na płaszczyźnie rzutu — rozwarcie łuku = kąt między rzutem osi tułowia a rzutem ramienia (±1°), stały promień łuku i stała długość linii, w 21 klatkach wszystkich ćwiczeń wyciskania', () => {
    let n = 0;
    for (const k of BENCH_KEYS) { const s = spec(k); for (const u of US) {
      const f = frameAt(s, u); const g = abductionGeom2D(f.sk, 'R', 'top'); if (!g) continue; n++;
      const S = proj(f.sk.arms.R.shoulder, 'top'), E = proj(f.sk.arms.R.elbow, 'top'), P = proj(f.sk.pelvis, 'top'), C = proj(f.sk.shoulderC, 'top');
      const t = [P[0] - C[0], P[1] - C[1]], e = [E[0] - S[0], E[1] - S[1]];
      const exp = Math.acos(Math.max(-1, Math.min(1, (t[0] * e[0] + t[1] * e[1]) / (Math.hypot(...t) * Math.hypot(...e))))) * 180 / Math.PI;
      expect([k, u, Math.abs(g.sweepDeg - exp) <= 1]).toEqual([k, u, true]);
      expect(Math.hypot(g.line[1][0] - g.line[0][0], g.line[1][1] - g.line[0][1])).toBeCloseTo(OVERLAY_REF_LEN, 6);
      if (g.arc) for (const p of g.arc) expect(Math.abs(Math.hypot(p[0] - S[0], p[1] - S[1]) - OVERLAY_ARC_R)).toBeLessThan(1e-6);
    } }
    expect(n).toBeGreaterThan(300);
  });
  test('odwiedzenie ramienia (W2): minimalny rozmiar łuku w rzucie — każdy narysowany łuk ma cięciwę ≥ OVERLAY_ARC_MIN_CHORD (próg w jednym miejscu), a rozwarcie powyżej progu zawsze daje łuk', () => {
    const minDeg = 2 * Math.asin(OVERLAY_ARC_MIN_CHORD / (2 * OVERLAY_ARC_R)) * 180 / Math.PI;
    let arcs = 0;
    for (const k of BENCH_KEYS) { const s = spec(k); for (const u of US) {
      const g = abductionGeom2D(frameAt(s, u).sk, 'R', 'top'); if (!g) continue;
      if (g.sweepDeg > minDeg + 1e-6) expect([k, u, !!g.arc]).toEqual([k, u, true]);
      if (g.arc) { arcs++; const a = g.arc[0], b = g.arc[g.arc.length - 1]; expect(Math.hypot(a[0] - b[0], a[1] - b[1])).toBeGreaterThanOrEqual(OVERLAY_ARC_MIN_CHORD - 1e-6); }
      else expect(g.sweepDeg).toBeLessThanOrEqual(minDeg + 1e-6);
    } }
    expect(arcs).toBeGreaterThan(200); expect(OVERLAY_ARM_MIN_PROJ).toBeGreaterThan(0);
    const sk = frameAt(spec('Decline Bench Press'), 1).sk; expect(abductionGeom2D({ ...sk, arms: { ...sk.arms, R: { ...sk.arms.R, elbow: sk.arms.R.shoulder } } }, 'R', 'top')).toBeNull(); /* ramię punktem w rzucie → brak elementu */
    expect(techniqueGeom('abduction', sk, 'R', 'elbow')).toBeNull(); /* odwiedzenie nie ma geometrii 3D — tylko rzut */
  });
  test('W6: linia elementu nakładki jest CIĄGŁA i grubsza niż ślad toru i linie odniesienia (kreskowane) — ta sama rola, inna kreska/grubość, nie nowy kolor', () => {
    const s = spec('Bench Press (sztanga)'); const line = overlayShapes(s, 1, 'side', ['benchElbowLimb']).find(x => x.k === 'line') as Extract<Shape, { k: 'line' }>;
    expect(line.dash).toBeUndefined(); expect(line.w).toBe(OVERLAY_LINE_W); expect(line.role).toBe('guide');
    const trail = trailFor(s, 'side').find(x => x.k === 'line') as Extract<Shape, { k: 'line' }>; expect(trail.dash).toBeTruthy(); expect(line.w).toBeGreaterThan(trail.w!);
    expect(solid([0, 0], [1, 1], 'x', 'error')).toMatchObject({ role: 'error', w: OVERLAY_LINE_W, id: 'x' });
  });
  test('łuk jest w każdej klatce, gdy zgięcie ≥ progu: u dołu (zgięte) jest łuk i linia, u góry (wyprost) łuk znika, linia zostaje', () => {
    const s = spec('Bench Press (sztanga)'); const down = frameAt(s, 1), up = frameAt(s, 0);
    const bottom = techniqueShapes(down.sk, 'side', TECH_BENCH, ctx()), top = techniqueShapes(up.sk, 'side', TECH_BENCH, ctx());
    expect([bottom.filter(x => x.k === 'line').length, bottom.filter(x => x.k === 'poly').length]).toEqual([1, 1]);
    expect(top.filter(x => x.k === 'line').length).toBe(1);
  });
});
const TECH_BENCH: TechniqueDef[] = TECHNIQUE.bench_press;
const ctx = (danger: (r: string) => boolean = () => false) => ({ joint: 'elbow' as const, side: 'R' as const, limbShown: true, danger });

describe('logika pomocnicza: trójka stawu, łuk, rejestr, strona mierzona', () => {
  test('limbTriple: łokieć (bark–łokieć–nadgarstek/chwyt), kolano, biodro; staw bez nakładki → null; arcPoints3: n+1 punktów na promieniu, końce w kierunkach u i v', () => {
    const sk = frameAt(spec('Bench Press (sztanga)'), 1).sk;
    expect(limbTriple(sk, 'R', 'elbow')![1]).toEqual(sk.arms.R.elbow); expect(limbTriple(sk, 'R', 'knee')![1]).toEqual(sk.legs.R.knee); expect(limbTriple(sk, 'L', 'hip')![0]).toEqual(sk.shoulderC); expect(limbTriple(sk, 'R', 'shrug')).toBeNull();
    const a = arcPoints3([0, 0, 0], [1, 0, 0], [0, 1, 0], 5, 8); expect(a).toHaveLength(9); expect(a[0][0]).toBeCloseTo(5, 6); expect(a[8][1]).toBeCloseTo(5, 6); for (const p of a) expect(Math.hypot(...p)).toBeCloseTo(5, 6);
  });
  test('techniqueDef znajduje element po id; measuredSide: wyciskanie — strona R (rzut z boku z prawej)', () => {
    expect(techniqueDef('benchElbowLimb')!.kind).toBe('limb'); expect(techniqueDef('nie-ma')).toBeUndefined(); expect(measuredSide(spec('Bench Press (sztanga)'))).toBe('R');
    BENCH_TECHNIQUE.forEach(d => expect(TECHNIQUE.bench_press).toContain(d)); expect(BENCH_TECHNIQUE).toHaveLength(3);
    for (const k of ['limb', 'abduction'] as TechniqueKind[]) expect(TECHNIQUE.bench_press.some(d => d.kind === k)).toBe(true);
  });
  test('dane linii rodzin: przysiad i zawias — każda linia ma wskazówkę, rzut i budowę', () => {
    for (const g of [...SQUAT_GUIDES, ...HINGE_GUIDES]) { expect([g.id, g.cue.length > 0, g.views.length > 0, typeof g.build]).toEqual([g.id, true, true, 'function']); }
    expect([SQUAT_GUIDES.length, HINGE_GUIDES.length]).toEqual([2, 2]);
  });
});

describe('niezmienniki: bez liczb i tekstu na rysunku, limit elementów na rzut', () => {
  test('elementy to wyłącznie linie ciągłe (W6) i łuki (poly bez wypełnienia), bez kształtów z tekstem; w warstwie nad ciałem', () => {
    for (const k of BENCH_KEYS) { const s = spec(k); for (const v of s.views) for (const u of US) for (const x of overlayShapes(s, u, v, techniquesOf(k))) {
      expect(['line', 'poly']).toContain(x.k); expect(x.z).toBeGreaterThan(3000);
      if (x.k === 'line') expect(x.dash).toBeUndefined(); else expect((x as { fill?: unknown }).fill).toBeUndefined();
      expect(JSON.stringify(x)).not.toMatch(/"(text|label|value)"/);
    } }
  });
  test('limit: ≤ OVERLAY_MAX_LINES linii i OVERLAY_MAX_ARCS łuk na rzut — także przy większej liczbie elementów w danych (obcięcie w kolejności danych)', () => {
    expect([OVERLAY_MAX_LINES, OVERLAY_MAX_ARCS]).toEqual([3, 1]);
    for (const k of BENCH_KEYS) { const s = spec(k); for (const v of s.views) for (const u of US) { const sh = overlayShapes(s, u, v, techniquesOf(k)); expect(sh.filter(x => x.k === 'line').length).toBeLessThanOrEqual(3); expect(sh.filter(x => x.k === 'poly').length).toBeLessThanOrEqual(1); } }
    const many: TechniqueDef[] = Array.from({ length: 6 }, (_, i) => ({ ...TECH_BENCH[0], id: 'bench' + i })); const sh = techniqueShapes(frameAt(spec('Bench Press (sztanga)'), 1).sk, 'side', many, ctx());
    expect([sh.filter(x => x.k === 'line').length, sh.filter(x => x.k === 'poly').length]).toEqual([3, 1]);
  });
  test('limit (W3): ≤ OVERLAY_MAX_LINES linii na rzut liczy też stare linie odniesienia (GUIDES) — suma guideShapes + overlayShapes dla każdego ćwiczenia z figurą v2, w każdym rzucie i klatce; łuk ≤ 1', () => {
    const sk = frameAt(spec('Bench Press (sztanga)'), 1).sk;
    const sh = techniqueShapes(sk, 'side', TECH_BENCH, { ...ctx(), guideLines: 2 }); expect(sh.filter(x => x.k === 'line').length).toBe(1);
    expect(techniqueShapes(sk, 'side', TECH_BENCH, { ...ctx(), guideLines: 3 }).filter(x => x.k === 'line').length).toBe(0);
    let razem = 0;
    for (const k of Object.keys(CATALOG)) { let s: FigureSpec | null | undefined; try { s = figureSpec(k); } catch { continue; } if (!s) continue;
      const g = guidesOf(k), t = techniquesOf(k); if (!g.length || !t.length) continue;
      for (const v of s.views) for (const u of [0, 0.5, 1]) { const all = [...guideShapes(s, u, v, g), ...overlayShapes(s, u, v, t, undefined, g)]; razem++;
        expect([k, v, u, all.filter(x => x.k === 'line').length <= OVERLAY_MAX_LINES]).toEqual([k, v, u, true]); expect(all.filter(x => x.k === 'poly' && /Arc$/.test(x.id ?? '')).length).toBeLessThanOrEqual(OVERLAY_MAX_ARCS); }
    }
    expect(razem).toBeGreaterThanOrEqual(0); /* dziś żadne ćwiczenie nie ma obu naraz (squat/hinge bez elementów nakładki) — pętla pilnuje etapu 2, część syntetyczna wyżej pilnuje już teraz */
  });
  test('element tylko z wskazówką karty: Bench Press (sztanga) — łokieć z boku (bp.move), z góry odwiedzenie ramienia (bp.elbowsMid od scalenia spójności 04.11.2026); Close Grip — z góry odwiedzenie ramienia (cgbp.elbows); wskazówka spoza zestawu → brak elementu', () => {
    expect(techniquesOf('Bench Press (sztanga)')).toEqual(['benchElbowLimb', 'benchShoulderAbduction']); expect(techniquesOf('Bench Press (hantle)')).toEqual(['benchElbowLimb', 'benchShoulderAbduction']); /* 04.11.2026: karta ma bp.elbowsMid po scaleniu spójności */
    expect(techniquesOf('Close Grip Bench Press')).toEqual(['benchElbowLimb', 'benchShoulderAbductionClose']); expect(techniquesOf('Decline Bench Press')).toContain('benchShoulderAbduction'); expect(techniquesOf('Wall Sit')).toEqual([]); /* etap 2: Back Squat ma już element (tests/figures-v2-nakladka-squat-hinge.test.tsx) */ expect(techniquesOf('Nie ma takiego')).toEqual([]);
    const s = spec('Bench Press (sztanga)'); expect(overlayShapes(s, 1, 'top', techniquesOf('Bench Press (sztanga)')).length).toBe(2); /* 04.11.2026: z góry odwiedzenie ramienia (bp.elbowsMid na karcie): linia + łuk */ expect(overlayShapes(s, 1, 'side', techniquesOf('Bench Press (sztanga)')).length).toBe(2);
    expect(overlayShapes(s, 1, 'side', ['benchElbowLimb', 'nie-ma']).length).toBe(2); expect(techniquesFor('squat', ['bp.move'])).toEqual([]);
    const cg = spec('Close Grip Bench Press'); expect(overlayShapes(cg, 1, 'top', techniquesOf('Close Grip Bench Press')).some(x => x.k === 'line')).toBe(true);
  });
  test('ciało i sprzęt bez zmian: nakładka to osobne kształty — shapesAt nie zawiera elementów nakładki', () => {
    for (const k of BENCH_KEYS.slice(0, 6)) { const s = spec(k); for (const v of s.views) expect(shapesAt(s, 1, v, true).some(isTech)).toBe(false); }
  });
  test('rozbicie GUIDES na dane rodzin: te same cztery linie, te same wskazówki i rzuty', () => {
    expect(Object.keys(GUIDES)).toEqual(['thighParallel', 'plumbMidfoot', 'kneeToe', 'backLine']);
    expect(GUIDES.thighParallel.cue).toEqual(['sq.depth']); expect(GUIDES.kneeToe.views).toEqual(['front']); expect(GUIDES.plumbMidfoot.cue).toEqual(['dl.feet']); expect(GUIDES.backLine.cue).toEqual(['hinge.back', 'sq.back', 'wall.back']); /* etap 2 (04.11.2026): linia pleców także w przysiadzie */
    for (const f of ['squat', 'hinge']) expect(fs.existsSync(path.join(__dirname, '..', 'lib/figures/v2/overlay', f + '.ts'))).toBe(true);
  });
});

describe('dane: elementy związane z regułami ze źródłem', () => {
  const sens = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'data/zrodla/figury-sens.json'), 'utf8')).rodziny;
  test.each(Object.entries(TECHNIQUE).flatMap(([fam, defs]) => defs.map(d => [fam, d] as const)))('%s: %o — reguła istnieje, a wskazówki elementu należą do wskazowki_na_reguly tej reguły', (fam, d) => {
    const r = sens[fam]; expect(r.reguly[d.rule]).toBeTruthy(); expect(d.cue.length).toBeGreaterThan(0);
    for (const c of d.cue) expect([c, r.wskazowki_na_reguly[c]]).toEqual([c, expect.arrayContaining([d.rule])]);
    expect(r.reguly[d.rule].pewnosc).toMatch(/^ustalone/);
  });
  test('reguła bez wskazówki (przedramie_pod_sztanga, cue: null) nie ma elementu — nie wymyślamy tekstu; strefy liczbowe (E5) nie istnieją', () => {
    expect(sens.bench_press.reguly.przedramie_pod_sztanga.cue).toBeNull(); expect(TECHNIQUE.bench_press.some(d => d.rule === 'przedramie_pod_sztanga')).toBe(false);
    expect(TECHNIQUE.bench_press.every(d => d.kind === 'limb' || d.kind === 'abduction')).toBe(true);
  });
  test('grupy.json = grupy z figury-sens.json (reguły i błędy)', () => {
    for (const [fam, g] of Object.entries(GROUP_DATA)) { for (const [id, grp] of Object.entries(g.reguly)) expect(sens[fam].reguly[id].grupa).toBe(grp); expect(g.bledy).toEqual(sens[fam].grupy_bledow ?? {}); }
  });
});

describe('kolor błędu (W2b): danger tylko dla elementu reguły złamanej przez błąd', () => {
  test('mapowanie: błąd bp.mis.arch (grupa lawka) łamie lawka_kontakt, nie łamie pelny_zakres ani lokcie_nie_szeroko; bez błędu — nic', () => {
    const s = spec('Bench Press (sztanga)'); const err = errorsOf(s)[0].error;
    expect([errorBreaksRule(s, err, 'lawka_kontakt'), errorBreaksRule(s, err, 'pelny_zakres'), errorBreaksRule(s, err, 'lokcie_nie_szeroko'), errorBreaksRule(s, undefined, 'lawka_kontakt'), errorBreaksRule(s, err, 'nie_ma')]).toEqual([true, false, false, false, false]);
  });
  test('silnik: element reguły złamanej ma rolę error (linia i łuk), pozostałe guide; negatyw: błąd z innej grupy nie zmienia koloru elementów ławki', () => {
    const sk = frameAt(spec('Bench Press (sztanga)'), 1).sk;
    const red = techniqueShapes(sk, 'side', TECH_BENCH, ctx(r => r === 'pelny_zakres')); const ok = techniqueShapes(sk, 'side', TECH_BENCH, ctx());
    for (const x of red) expect(x.k === 'line' ? x.role : (x as { stroke?: string }).stroke).toBe('error'); for (const x of ok) expect(x.k === 'line' ? x.role : (x as { stroke?: string }).stroke).toBe('guide');
    const s = spec('Bench Press (sztanga)'); const err = errorsOf(s)[0].error;
    expect(overlayShapes(s, 1, 'side', ['benchElbowLimb'], err).every(x => (x.k === 'line' ? x.role : (x as { stroke?: string }).stroke) === 'guide')).toBe(true);
  });
});

describe('VoiceOver: etykieta obrazu „Na rysunku: …”', () => {
  test('onDrawingCues: wskazówki widocznych elementów (nakładka i linie), bez powtórzeń; ćwiczenie bez elementów — pusta lista', () => {
    expect(onDrawingCues(spec('Bench Press (sztanga)'), guidesOf('Bench Press (sztanga)'), techniquesOf('Bench Press (sztanga)'))).toEqual(['bp.move', 'bp.elbowsMid']);
    expect(onDrawingCues(spec('Back Squat'), guidesOf('Back Squat'), techniquesOf('Back Squat')).length).toBeGreaterThan(0); expect(onDrawingCues(spec('Sumo Deadlift'), guidesOf('Sumo Deadlift'), [])).toEqual(['hinge.back']); expect(onDrawingCues(spec(NO_ELEMENTS), guidesOf(NO_ELEMENTS), techniquesOf(NO_ELEMENTS))).toEqual([]);
  });
  test('komponent: etykieta = „Rysunek ruchu: …. Na rysunku: {tekst wskazówki}” w PL i EN; brak elementów — sama etykieta', async () => {
    AI.isReduceMotionEnabled.mockImplementation(() => Promise.resolve(true));
    await render(<ExerciseFigureV2 exercise={lib('Bench Press (sztanga)')} name="Wyciskanie" />); await flush();
    const label = screen.getByTestId('exercise-figure-v2-image').props.accessibilityLabel as string;
    expect(label).toBe(`Rysunek ruchu: Wyciskanie. Na rysunku: ${joinCues(['bp.move', 'bp.elbowsMid'].map(errorText))}`);
    applyLang('en'); await render(<ExerciseFigureV2 exercise={lib('Bench Press (sztanga)')} name="Bench" />); await flush();
    expect((screen.getAllByTestId('exercise-figure-v2-image').pop()!.props.accessibilityLabel as string).startsWith('Movement drawing: Bench. On the drawing: ')).toBe(true);
    applyLang('pl'); await render(<ExerciseFigureV2 exercise={lib(NO_ELEMENTS)} name="Martwy ciąg" />); await flush();
    expect(screen.getAllByTestId('exercise-figure-v2-image').pop()!.props.accessibilityLabel).toBe('Rysunek ruchu: Martwy ciąg');
  });
  test('komponent: elementy nakładki w SVG ławki (z boku — kreska i łuk, bez tekstu z liczbami)', async () => {
    AI.isReduceMotionEnabled.mockImplementation(() => Promise.resolve(true));
    await render(<ExerciseFigureV2 exercise={lib('Bench Press (sztanga)')} name="Wyciskanie" />); await flush();
    expect(cueIdsOf('Bench Press (sztanga)').ids).toContain('bp.move'); expect(screen.getByTestId('exercise-figure-v2-end-side')).toBeTruthy();
  });
});

describe('wygląd: kontrast elementów w obu motywach (także Zwiększ kontrast)', () => {
  const themes = { jasny: light, ciemny: dark, 'jasny HC': lightHC, 'ciemny HC': darkHC };
  test.each(Object.entries(themes))('%s: linia/łuk (guide = doneLine) i element błędu (error = danger) ≥ 3:1 do tła ekranu i karty (WCAG 1.4.11)', (_n, th) => {
    const pal = figurePalette(th); for (const bg of [th.bg, th.surface]) for (const role of ['guide', 'error'] as const) expect([_n, role, contrast(pal[role], bg) >= 3]).toEqual([_n, role, true]);
  });
});
