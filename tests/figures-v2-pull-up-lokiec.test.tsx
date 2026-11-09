/*
 * Figury v2 — Pull Up: prowadnica prostej ręki obok ręki, tylko z przodu (decyzja właściciela 09.11.2026, wariant B studia projektowego; docs/18 09.11.2026).
 * Rodzaje (docs/20): geometria (przesunięcie 8 cm na zewnątrz, równoległość, nie przecina ręki), faza (widoczność wg zgięcia łokcia, wygaszanie 8°→20°, góra niewidoczna),
 * widok błędu (rola error, dolna część ruchu), zakres ćwiczeń (Pull Up i Chin Up — reguła „ustalone”), niezmienniki (bez liczb i tekstu, limit linii, kolor tokenami nakładki), dane (próg = max_lokiec_deg), VoiceOver (bez powtórzeń), wygląd (oba motywy).
 */
jest.mock('@/lib/figures/data.json', () => require('./figure-gate-open').openFigureGate(jest.requireActual('@/lib/figures/data.json'))); /* bramka 4 otwarta: test sprawdza rysowanie, nie recenzję rodziny */
import * as fs from 'fs';
import * as path from 'path';
import { CATALOG } from '@/lib/catalog.generated';
import { figureSpec, frameAt, guideShapes, measuredAngle, measuredSide, overlayShapes, figurePalette, contrast, type FigureSpec, type Shape } from '@/lib/figures/v2';
import { OVERLAY_ARM_REF, OVERLAY_MAX_LINES, armGuideAlpha, techniqueShapes } from '@/lib/figures/v2/overlay';
import { PULL_UP_STRAIGHT_EXERCISES, PULL_UP_TECHNIQUE } from '@/lib/figures/v2/overlay/pull_up';
import { OVERLAY_LINE_W } from '@/lib/figures/v2/overlay/common';
import { shapeAttrs } from '@/lib/figures/v2/render';
import { errorsOf, techniquesOf, onDrawingCues, guidesOf, cueIdsOf } from '@/lib/figures/v2/ui';
import { proj } from '@/lib/figures/v2/draw';
import REGULY from '@/lib/figures/v2/reguly-cwiczen.json';
import { light, dark, lightHC, darkHC } from '@/lib/theme';

const ID = 'pullArmStraightRef', BR = ID + 'Bracket';
const spec = (k: string): FigureSpec => figureSpec(k) as FigureSpec;
const PULL_KEYS = Object.keys(CATALOG).filter(k => { try { return figureSpec(k)?.family === 'pull_up'; } catch { return false; } });
const sens = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'data/zrodla/figury-sens.json'), 'utf8')).rodziny.pull_up;
const US = Array.from({ length: 21 }, (_, i) => i / 20);
type Poly = Extract<Shape, { k: 'poly' }>;
const bracket = (k: string, u: number, view: 'front' | 'side' | 'top' = 'front', err?: ReturnType<typeof errorsOf>[number]['error']): Poly[] => overlayShapes(spec(k), u, view, [ID], err).filter((x): x is Poly => x.k === 'poly' && x.id === BR);
const errOf = (k: string) => errorsOf(spec(k)).find(e => e.cue === 'pu.partial')!.error;
const elbow = (k: string, u: number, e?: ReturnType<typeof errOf>) => measuredAngle(spec(k), u, e).deg;
/** Odcinek główny prowadnicy (pts: kreska, kreska, początek, koniec, kreska, kreska). */
const seg = (p: Poly): [[number, number], [number, number]] => [p.pts[2], p.pts[3]];
const distToLine = (pt: [number, number], a: [number, number], b: [number, number]): number => { const dx = b[0] - a[0], dy = b[1] - a[1]; return Math.abs((pt[0] - a[0]) * dy - (pt[1] - a[1]) * dx) / Math.hypot(dx, dy); };

describe('prowadnica prostej ręki — dane i zakres (09.11.2026)', () => {
  test('rejestr: element rodzaju ref „parallel” bark → chwyt, tylko przód, reguła dol_rece_proste, zdanie pu.pull (Pull Up) / cu.pull (Chin Up); lista ćwiczeń = Pull Up, Chin Up', () => {
    const d = PULL_UP_TECHNIQUE.find(x => x.id === ID)!;
    expect([d.kind, d.ref, d.views, d.rule, d.cue, d.exercises]).toEqual(['ref', { shape: 'parallel', from: 'shoulder', to: 'grip' }, ['front'], 'dol_rece_proste', ['pu.pull', 'cu.pull'], ['Pull Up', 'Chin Up']]);
    expect(PULL_UP_STRAIGHT_EXERCISES).toEqual(['Pull Up', 'Chin Up']);
  });
  test('zakres = ćwiczenia, dla których reguła ma status „ustalone” (figury-sens.json pewnosc), a reguła jest przypisana wariantowi (reguly-cwiczen.json); pozostałe odmiany bez elementu', () => {
    const m = /^ustalone \(([^)]*)\)/.exec(sens.reguly.dol_rece_proste.pewnosc as string)!; expect(m[1].split(', ')).toEqual(PULL_UP_STRAIGHT_EXERCISES);
    const R = REGULY as Record<string, Record<string, string[]>>;
    for (const k of PULL_KEYS) { const ma = techniquesOf(k).includes(ID); expect([k, ma]).toEqual([k, PULL_UP_STRAIGHT_EXERCISES.includes(k) && R.pull_up[k].includes('dol_rece_proste')]); }
    expect(PULL_KEYS.filter(k => techniquesOf(k).includes(ID)).sort()).toEqual(['Chin Up', 'Pull Up']);
    /* reguła „dol_rece_proste” przypisana 10 odmianom, element tylko dla 2 „ustalone” — pozostałe 8 (analogia) czekają na badacza (docs/research/figury-recenzja.json, wpis pull_up) */
    expect(Object.keys(R.pull_up).filter(k => R.pull_up[k].includes('dol_rece_proste')).length).toBe(10);
  });
  test('wskazówka elementu istnieje na karcie ćwiczenia i należy do reguły (wskazowki_na_reguly)', () => {
    for (const k of ['Pull Up', 'Chin Up']) { const c = PULL_UP_TECHNIQUE.find(x => x.id === ID)!.cue.find(x => cueIdsOf(k).ids.includes(x))!; expect([k, !!c]).toEqual([k, true]); expect(sens.wskazowki_na_reguly[c]).toContain('dol_rece_proste'); }
  });
  test('progi: przesunięcie 8 cm, pełna widoczność do max_lokiec_deg reguły (jedno miejsce), zero przy 20°', () => {
    expect(sens.reguly.dol_rece_proste.parametry.max_lokiec_deg).toBe(OVERLAY_ARM_REF.fullDeg); expect(OVERLAY_ARM_REF.fullDeg).toBe(8);
    expect([OVERLAY_ARM_REF.offset, OVERLAY_ARM_REF.errorOffset, OVERLAY_ARM_REF.zeroDeg, OVERLAY_ARM_REF.errorUBelow]).toEqual([8, 0, 20, 0.5]);
  });
});

describe('prowadnica prostej ręki — faza i widoczność', () => {
  test.each([[0, 1], [4, 1], [8, 1], [11, 0.75], [14, 0.5], [17, 0.25], [20, 0], [21, 0], [143, 0]])('armGuideAlpha(łokieć %i°) = %f (bez błędu: pełna ≤ 8°, liniowo do 0 przy 20°)', (deg, a) => { expect(armGuideAlpha(deg, false, 0)).toBeCloseTo(a, 9); expect(armGuideAlpha(deg, false, undefined)).toBeCloseTo(a, 9); });
  test.each([[0, 51, 1], [0.25, 107, 1], [0.49, 143, 1], [0.5, 143, 0], [1, 143, 0], [1, 5, 1]])('armGuideAlpha w widoku błędu: u = %f, łokieć %i° → %f (pełna w dolnej części ruchu; wyżej obowiązuje wygaszanie)', (u, deg, a) => { expect(armGuideAlpha(deg, true, u)).toBe(a); });
  test('Pull Up i Chin Up z przodu: na dole (łokieć ≤ 8°) element jest, z pełną widocznością w roli guide; na górze (łokieć ≥ 100°) go nie ma', () => {
    for (const k of ['Pull Up', 'Chin Up']) { const lo = bracket(k, 0); expect([k, lo.length, elbow(k, 0) <= OVERLAY_ARM_REF.fullDeg]).toEqual([k, 1, true]);
      expect([k, lo[0].stroke, lo[0].w, lo[0].a]).toEqual([k, 'guide', OVERLAY_LINE_W, 1 / 2.2]);
      expect([k, bracket(k, 1).length, elbow(k, 1) > 100]).toEqual([k, 0, true]); }
  });
  test('wygaszanie wzdłuż ruchu: przezroczystość = armGuideAlpha(zgięcie w tej klatce) w każdej klatce; zero ⇒ brak kształtu; w ruchu element gaśnie monotonicznie z podnoszeniem', () => {
    for (const k of ['Pull Up', 'Chin Up']) { let prev = 2; for (const u of US) { const a = armGuideAlpha(elbow(k, u), false, u), b = bracket(k, u);
      if (a <= 0.02) expect([k, u, b.length]).toEqual([k, u, 0]); else expect([k, u, b.length, b[0].a! * 2.2]).toEqual([k, u, 1, expect.closeTo(a, 9)]);
      expect(elbow(k, u) <= OVERLAY_ARM_REF.zeroDeg || b.length === 0).toBe(true); if (u <= 0.15) { expect(a).toBeLessThanOrEqual(prev + 1e-9); prev = a; } } }
  });
  test('tylko rzut z przodu: z boku i z góry nic', () => { for (const k of ['Pull Up', 'Chin Up']) for (const v of ['side', 'top'] as const) for (const u of US) expect([k, v, u, overlayShapes(spec(k), u, v, [ID])]).toEqual([k, v, u, []]); });
});

describe('prowadnica prostej ręki — geometria (cm rysunku)', () => {
  test('odcinek główny równoległy do odcinka bark → chwyt, przesunięty o 8 cm na zewnątrz ciała (dalej od osi miednicy niż ręka), tej samej długości', () => {
    for (const k of ['Pull Up', 'Chin Up']) { const s = spec(k), side = measuredSide(s); for (const u of US.filter(x => bracket(k, x).length)) { const A = frameAt(s, u).sk, a = proj(A.arms[side].shoulder, 'front'), b = proj(A.arms[side].grip, 'front'), c = proj(A.pelvis, 'front');
      const [p, q] = seg(bracket(k, u)[0]); expect([k, u, distToLine(p, a, b), distToLine(q, a, b)].map(x => typeof x === 'number' ? Math.round(x * 1e6) / 1e6 : x)).toEqual([k, u, OVERLAY_ARM_REF.offset, OVERLAY_ARM_REF.offset]);
      expect([k, u, Math.hypot(q[0] - p[0], q[1] - p[1])]).toEqual([k, u, expect.closeTo(Math.hypot(b[0] - a[0], b[1] - a[1]), 9)]);
      const mid = [(p[0] + q[0]) / 2, (p[1] + q[1]) / 2], mid0 = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
      expect([k, u, Math.abs(mid[0] - c[0]) > Math.abs(mid0[0] - c[0])]).toEqual([k, u, true]); } }
  });
  test('kreski na końcach: prostopadłe do odcinka, długość 2 × 1,8 cm, wyśrodkowane na końcach', () => {
    const [p, q] = seg(bracket('Pull Up', 0)[0]); const P = bracket('Pull Up', 0)[0].pts; const dx = q[0] - p[0], dy = q[1] - p[1];
    for (const [i, j, e] of [[0, 1, p], [4, 5, q]] as const) { const tx = P[j][0] - P[i][0], ty = P[j][1] - P[i][1]; expect(Math.abs(tx * dx + ty * dy)).toBeLessThan(1e-9); expect(Math.hypot(tx, ty)).toBeCloseTo(2 * OVERLAY_ARM_REF.tick, 9); expect([(P[i][0] + P[j][0]) / 2, (P[i][1] + P[j][1]) / 2]).toEqual([expect.closeTo(e[0], 9), expect.closeTo(e[1], 9)]); }
  });
  test('nie przecina ręki: na dole (łokieć ≤ 8°) i w całym zakresie widoczności bez błędu staw łokciowy i nadgarstek leżą od odcinka dalej niż 3 cm i po stronie ręki', () => {
    for (const k of ['Pull Up', 'Chin Up']) { const s = spec(k), side = measuredSide(s); let n = 0; for (const u of US.filter(x => bracket(k, x).length)) { n++; const A = frameAt(s, u).sk.arms[side], [p, q] = seg(bracket(k, u)[0]);
      const a = proj(A.shoulder, 'front'), b = proj(A.grip, 'front'); const sgn = (pt: [number, number]) => Math.sign((q[0] - p[0]) * (pt[1] - p[1]) - (q[1] - p[1]) * (pt[0] - p[0]));
      for (const j of [A.elbow, A.wrist, A.grip]) { const pt = proj(j, 'front'); expect([k, u, distToLine(pt, p, q) > 3, sgn(pt) === sgn(a) && sgn(a) === sgn(b)]).toEqual([k, u, true, true]); } }
      expect(n).toBeGreaterThan(1); }
  });
  test('lewa i prawa strona: element rysowany przy ręce mierzonej (measuredSide); odbicie nie zmienia przesunięcia', () => {
    const s = spec('Pull Up'); const f = frameAt(s, 0); const g = techniqueShapes(f.sk, 'front', PULL_UP_TECHNIQUE.filter(d => d.id === ID), { joint: 'elbow', side: 'L', limbShown: true, danger: () => false, u: 0 }) as Poly[];
    expect(g.length).toBe(1); const [p, q] = seg(g[0]); const a = proj(f.sk.arms.L.shoulder, 'front'), b = proj(f.sk.arms.L.grip, 'front'); expect([distToLine(p, a, b), distToLine(q, a, b)]).toEqual([expect.closeTo(8, 9), expect.closeTo(8, 9)]);
    const cx = proj(f.sk.pelvis, 'front')[0]; expect(Math.abs((p[0] + q[0]) / 2 - cx)).toBeGreaterThan(Math.abs((a[0] + b[0]) / 2 - cx)); /* po stronie lewej też na zewnątrz ciała */
  });
});

describe('prowadnica prostej ręki — widok „Pokaż częsty błąd” (pu.partial, skrócony zakres)', () => {
  /* recenzja niezależna 09.11.2026 (audytor, ŚREDNIE) i decyzja właściciela 09.11.2026 (A — poprawka teraz): w widoku błędu czerwona prowadnica przesunięta o 8 cm
     przecinała zgiętą rękę (u = 0,25 i 0,45; przy u = 0 dotykała łokcia). Teraz w widoku błędu to cięciwa bark–chwyt (OVERLAY_ARM_REF.errorOffset = 0 — tam leżałaby prosta ręka),
     a zgięta ręka wygina się od niej na zewnątrz: łokieć i nadgarstek po jednej stronie odcinka, łokieć wyraźnie od niego odstaje. */
  test('nie przecina ręki także w widoku błędu (09.11.2026): w każdej klatce z widoczną prowadnicą łokieć i nadgarstek leżą po jednej stronie odcinka, łokieć dalej niż 3 cm', () => {
    for (const k of ['Pull Up', 'Chin Up']) { const e = errOf(k), s = spec(k), side = measuredSide(s); let n = 0;
      for (const u of US.filter(x => bracket(k, x, 'front', e).length)) { n++; const A = frameAt(s, u, e).sk.arms[side], [p, q] = seg(bracket(k, u, 'front', e)[0]);
        const sgn = (pt: [number, number]) => Math.sign((q[0] - p[0]) * (pt[1] - p[1]) - (q[1] - p[1]) * (pt[0] - p[0]));
        const el = proj(A.elbow, 'front'), wr = proj(A.wrist, 'front');
        expect([k, u, distToLine(el, p, q) > 3, sgn(el) !== 0 && sgn(el) === sgn(wr)]).toEqual([k, u, true, true]); }
      expect(n).toBeGreaterThan(1); }
  });
  test('Pull Up i Chin Up: błąd łamie regułę ⇒ element w roli error na dole (u < 0,5) mimo zgiętego łokcia; na górze go nie ma; zgięta ręka odstaje od prostej (łokieć dalej od odcinka niż w normie)', () => {
    for (const k of ['Pull Up', 'Chin Up']) { const e = errOf(k);
      for (const u of US) { const b = bracket(k, u, 'front', e); if (u < OVERLAY_ARM_REF.errorUBelow) expect([k, u, b.length, b[0]?.stroke, b[0]?.a]).toEqual([k, u, 1, 'error', 1 / 2.2]); else expect([k, u, b.length]).toEqual([k, u, 0]); }
      expect(elbow(k, 0, e)).toBeGreaterThan(OVERLAY_ARM_REF.zeroDeg); /* bez reguły błędu element by tu zgasł — widoczny wyłącznie dzięki trybowi błędu */
      expect(bracket(k, 0, 'front').length).toBe(1); expect(bracket(k, 0, 'front', e)[0].stroke).not.toBe(bracket(k, 0)[0].stroke);
      /* 09.11.2026: w widoku błędu odcinek to cięciwa bark–chwyt (errorOffset 0 — miejsce prostej ręki), zgięty łokieć odstaje od niej (było: odcinek przesunięty o 8 cm, przecinał rękę) */
      const A = frameAt(spec(k), 0, e).sk.arms[measuredSide(spec(k))], [p, q] = seg(bracket(k, 0, 'front', e)[0]);
      expect([k, +distToLine(proj(A.shoulder, 'front'), p, q).toFixed(6), +distToLine(proj(A.grip, 'front'), p, q).toFixed(6), distToLine(proj(A.elbow, 'front'), p, q) > 3]).toEqual([k, 0, 0, true]); }
  });
  test('błąd, który nie łamie reguły dol_rece_proste (np. bujanie), nie zapala koloru ani nie pokazuje elementu przy zgiętej ręce', () => {
    const s = spec('Pull Up'); const f = frameAt(s, 0, errOf('Pull Up')).sk;
    const sh = techniqueShapes(f, 'front', PULL_UP_TECHNIQUE.filter(d => d.id === ID), { joint: 'elbow', side: measuredSide(s), limbShown: true, danger: () => false, u: 0 }); expect(sh).toEqual([]);
  });
});

describe('prowadnica prostej ręki — niezmienniki, wygląd, VoiceOver', () => {
  test('bez liczb i tekstu na rysunku; id i rola z nakładki; kształt nad ciałem (z > 3000); bez wypełnienia; kolor tylko guide/error (tokeny nakładki)', () => {
    for (const k of ['Pull Up', 'Chin Up']) for (const e of [undefined, errOf(k)]) for (const u of US) for (const x of bracket(k, u, 'front', e)) {
      expect(JSON.stringify(x)).not.toMatch(/"(text|label|value)"/); expect([x.id, x.z > 3000, (x as { fill?: unknown }).fill, x.close, ['guide', 'error'].includes(x.stroke!)]).toEqual([BR, true, undefined, false, true]); }
  });
  test('limit: z przodu w Pull Up i Chin Up razem z liniami odniesienia ≤ OVERLAY_MAX_LINES linii, a prowadnica nie leży pod żadną inną linią (poza ręką)', () => {
    for (const k of ['Pull Up', 'Chin Up']) for (const e of [undefined, errOf(k)]) for (const u of US) { const all = [...guideShapes(spec(k), u, 'front', guidesOf(k), e), ...overlayShapes(spec(k), u, 'front', techniquesOf(k), e, guidesOf(k))];
      expect([k, u, all.filter(x => x.k === 'line').length + all.filter(x => x.k === 'poly').length <= OVERLAY_MAX_LINES]).toEqual([k, u, true]); }
  });
  test('stroke-opacity w SVG = przezroczystość elementu (poly: min(1, 2,2·a)), kolor z palety motywu: guide = doneLine, error = danger', () => {
    for (const th of [light, dark, lightHC, darkHC]) { const pal = figurePalette(th); const g = bracket('Pull Up', 0)[0], r = bracket('Pull Up', 0, 'front', errOf('Pull Up'))[0];
      expect([shapeAttrs(g, pal).stroke, shapeAttrs(r, pal).stroke]).toEqual([th.doneLine, th.danger]); expect(shapeAttrs(g, pal).strokeOpacity).toBeCloseTo(1, 9);
      const half = { ...g, a: 0.5 / 2.2 }; expect(shapeAttrs(half, pal).strokeOpacity).toBeCloseTo(0.5, 9); }
  });
  test.each([['jasny', light], ['ciemny', dark], ['jasny kontrast', lightHC], ['ciemny kontrast', darkHC]])('motyw %s: element (guide = doneLine) i element błędu (error = danger) ≥ 3:1 do tła ekranu i karty (WCAG 1.4.11)', (_n, th) => {
    for (const c of [th.doneLine, th.danger]) for (const bg of [th.bg, th.surface]) expect(contrast(c, bg)).toBeGreaterThanOrEqual(3);
  });
  test('VoiceOver: „Na rysunku” — Pull Up bez powtórzeń (pu.pull raz), Chin Up dostaje zdanie cu.pull; zdanie jest na karcie; Dead Hang bez elementu', () => {
    expect(onDrawingCues(spec('Pull Up'), guidesOf('Pull Up'), techniquesOf('Pull Up'))).toEqual(['pu.pull', 'pu.noSwing']);
    expect(onDrawingCues(spec('Chin Up'), guidesOf('Chin Up'), techniquesOf('Chin Up'))).toEqual(['pu.noSwing', 'cu.pull']);
    expect(onDrawingCues(spec('Dead Hang'), guidesOf('Dead Hang'), techniquesOf('Dead Hang'))).toEqual([]);
  });
});
