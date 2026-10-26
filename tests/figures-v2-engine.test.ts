/*
 * Figury v2 — silnik (grafiki ćwiczeń 1.0, decyzja właściciela 25.10.2026): matematyka 3D i IK, szkielet, rzuty i kształty, kolory z tokenów motywu (kontrast),
 * czas animacji (tempo ilustracyjne 2 s / 1 s), kolidery i sprawdzenia klatki, podświetlenie mięśni (dane z katalogu), dokument i dane generowane (--check).
 * Rodzaje (docs/20): logika, niezmienniki (długości kości, zasięg IK, kontrast), dane (muscleLoad 709/709), języki/wygląd (jasny, ciemny, „Zwiększ kontrast”).
 */
import * as fs from 'fs';
import * as path from 'path';
import { execFileSync } from 'child_process';
import {
  rad, deg, clamp, add, sub, mul, dot, len, dist, norm, sag, sagFront, ik2, distSegSeg,
  BODY, GIRTH, SIDES, solveSkeleton, jointAngles, soleY, legJoints,
  proj, depthOf, capsule2, spineAt, bodyShapes, propShapes, sortShapes, benchPolys, EQUIP,
  pathD, shapePath, boundsOf, svgDocument, svgInner, ellipsePts, mixHex, luminance, contrast, figurePalette,
  TEMPO, uAt, loopLength,
  sdPoly, gap, bodyColliders, equipColliders, checkFrame, holdChecks, TOL,
  muscleShapes, MUSCLES, MUSCLE_MIN_LOAD, MUSCLE_DATA, musclesFor, figureSpec, frameAt, shapeAttrs, TORSO_SIDE, TORSO_FRONT,
  trunkChord, solveRoot, ease, legFK, mkFrame, legChain, kneeForHipHeight, FAMILIES, SQUAT, HINGE,
  type PoseIn, type V3, type Prop, type Frame,
} from '@/lib/figures/v2';
import { CATALOG } from '@/lib/catalog.generated';
import { light, dark, lightHC, darkHC } from '@/lib/theme';

const root = path.join(__dirname, '..');
const STAND: PoseIn = { pelvis: [4, 90, 0], trunkPitch: 6, legs: { R: { ankle: [0, 7, 14] }, L: { ankle: [0, 7, -14] } }, arms: { R: { grip: [20, 90, 24] }, L: { grip: [20, 90, -24] } } };

describe('matematyka 3D', () => {
  test('kąty i wektory: rad/deg, clamp, add/sub/mul/dot/len/dist/norm', () => {
    expect(deg(rad(37))).toBeCloseTo(37, 9); expect(clamp(5, 0, 3)).toBe(3); expect(clamp(-1, 0, 3)).toBe(0);
    expect(add([1, 2, 3], [1, 1, 1])).toEqual([2, 3, 4]); expect(sub([1, 2, 3], [1, 1, 1])).toEqual([0, 1, 2]); expect(mul([1, 2, 3], 2)).toEqual([2, 4, 6]);
    expect(dot([1, 2, 3], [4, 5, 6])).toBe(32); expect(len([3, 4, 0])).toBe(5); expect(dist([0, 0, 0], [0, 3, 4])).toBe(5); expect(len(norm([3, 4, 12]))).toBeCloseTo(1, 9);
  });
  test('sag/sagFront: kierunek w płaszczyźnie strzałkowej od pionu (do przodu dodatni) i normalna „przód”', () => {
    expect(sag(0)).toEqual([0, 1, 0]); expect(sag(90)[0]).toBeCloseTo(1, 9); expect(sagFront(0)[0]).toBeCloseTo(1, 9); expect(sagFront(90)[1]).toBeCloseTo(-1, 9);
  });
  test('ik2: długości kości zachowane, cel osiągnięty, biegun wybiera stronę zgięcia, poza zasięgiem wyprost w stronę celu', () => {
    const a: V3 = [0, 0, 0], b: V3 = [30, 20, 10];
    const r = ik2(a, b, 40, 35, [1, 0, 0]);
    expect(dist(a, r.mid)).toBeCloseTo(40, 6); expect(dist(r.mid, r.end)).toBeCloseTo(35, 6); expect(r.err).toBeLessThan(1e-6);
    expect(ik2(a, b, 40, 35, [1, 0, 0]).mid[0]).toBeGreaterThan(ik2(a, b, 40, 35, [-1, 0, 0]).mid[0]);
    const far = ik2(a, [200, 0, 0], 40, 35, [0, 1, 0]); expect(far.err).toBeGreaterThan(100); expect(far.end[0]).toBeCloseTo(75, 3);
    const par = ik2(a, [0, 50, 0], 40, 35, [0, 1, 0]); expect(Number.isFinite(par.mid[0] + par.mid[1] + par.mid[2])).toBe(true);
  });
  test('distSegSeg: odległość odcinków (równoległe, skośne, przecinające się, zdegenerowane)', () => {
    expect(distSegSeg([0, 0, 0], [10, 0, 0], [0, 5, 0], [10, 5, 0])).toBeCloseTo(5, 9);
    expect(distSegSeg([0, 0, 0], [10, 0, 0], [5, -3, 4], [5, 3, 4])).toBeCloseTo(4, 9);
    expect(distSegSeg([0, 0, 0], [10, 0, 0], [5, -3, 0], [5, 3, 0])).toBeCloseTo(0, 9);
    expect(distSegSeg([0, 0, 0], [0, 0, 0], [3, 4, 0], [3, 4, 0])).toBeCloseTo(5, 9);
  });
});

describe('szkielet', () => {
  test('stała długość kości w każdej pozie, stopy na podłodze, ręka w zasięgu', () => {
    const sk = solveSkeleton(STAND);
    for (const s of SIDES) {
      expect(dist(sk.legs[s].hip, sk.legs[s].knee)).toBeCloseTo(BODY.thigh, 6); expect(dist(sk.legs[s].knee, sk.legs[s].ankle)).toBeCloseTo(BODY.shank, 6);
      expect(dist(sk.arms[s].shoulder, sk.arms[s].elbow)).toBeCloseTo(BODY.uarm, 6); expect(dist(sk.arms[s].elbow, sk.arms[s].grip)).toBeCloseTo(BODY.farm + BODY.hand, 6);
      expect(Math.abs(soleY(sk.legs[s]))).toBeLessThan(0.01);
    }
    expect(checkFrame({ sk, props: [], info: {}, contacts: [] })).toEqual([]);
  });
  test('tułów: pochylenie od pionu, zgięcie kręgosłupa skraca cięciwę i cofa środek kręgosłupa', () => {
    const a = solveSkeleton({ ...STAND, trunkPitch: 0 }), b = solveSkeleton({ ...STAND, trunkPitch: 0, spineBend: 40 });
    expect(a.shoulderC[1] - a.pelvis[1]).toBeCloseTo(BODY.trunk, 6); expect(b.shoulderC[1] - b.pelvis[1]).toBeLessThan(BODY.trunk); expect(b.spineMid[0]).toBeLessThan(a.spineMid[0]);
    expect(solveSkeleton({ ...STAND, trunkPitch: 90 }).shoulderC[0] - 4).toBeCloseTo(BODY.trunk, 6);
    expect(trunkChord(0)).toBe(1); expect(trunkChord(40)).toBeLessThan(1); expect(b.shoulderC[1] - b.pelvis[1]).toBeCloseTo(BODY.trunk * trunkChord(40), 6);
  });
  test('kolano idzie w stronę palców (kneeOut), biodro, kolano i kostka zgodne z legJoints', () => {
    const p: PoseIn = { ...STAND, pelvis: [-10, 55, 0], legs: { R: { ankle: [0, 7, 20], toeOut: 20 }, L: { ankle: [0, 7, -20], toeOut: 20 } } };
    const sk = solveSkeleton(p); const j = legJoints(p.pelvis, 'R', p.legs.R);
    expect(j.knee).toEqual(sk.legs.R.knee); expect(sk.legs.R.knee[2]).toBeGreaterThan(sk.legs.R.hip[2]); expect(sk.legs.L.knee[2]).toBeLessThan(sk.legs.L.hip[2]);
  });
  test('kąty stawów: stojąc ~0 (biodro, kolano), zgięcie dodatnie w przysiadzie', () => {
    const st = jointAngles(solveSkeleton({ ...STAND, trunkPitch: 0, pelvis: [0, 90, 0] }), 'R'); expect(Math.abs(st.hip)).toBeLessThan(8); expect(st.knee).toBeLessThan(3);
    const sq = squatSample(); expect(sq.knee).toBeGreaterThan(90); expect(sq.hip).toBeGreaterThan(60);
  });
});
function squatSample() { const f = frameAt(figureSpec('Back Squat')!, 1); return jointAngles(f.sk, 'R'); }

describe('rzut i kształty', () => {
  test('rzut z boku, z przodu i z góry; głębokość', () => {
    const p: V3 = [3, 4, 5];
    expect(proj(p, 'side')).toEqual([3, 4]); expect(proj(p, 'front')).toEqual([-5, 4]); expect(proj(p, 'top')).toEqual([-5, -3]);
    expect([depthOf(p, 'side'), depthOf(p, 'front'), depthOf(p, 'top')]).toEqual([5, 3, 4]);
  });
  test('capsule2: kapsuła stożkowa obejmuje oba okręgi; zdegenerowana = okrąg', () => {
    const pts = capsule2([0, 0], 5, [20, 0], 3);
    expect(Math.min(...pts.map(q => q[0]))).toBeCloseTo(-5, 6); expect(Math.max(...pts.map(q => q[0]))).toBeCloseTo(23, 6);
    expect(capsule2([0, 0], 5, [0, 0], 5).length).toBeGreaterThan(8);
    expect(capsule2([0, 0], 9, [1, 0], 2).every(q => Math.hypot(q[0], q[1]) <= 9.0001)).toBe(true);
  });
  test('spineAt: punkt na kręgosłupie od miednicy do barków', () => {
    const sk = solveSkeleton({ ...STAND, trunkPitch: 0 }); expect(spineAt(sk, 0).p[1]).toBeCloseTo(90, 6); expect(spineAt(sk, BODY.trunk).p[1]).toBeCloseTo(90 + BODY.trunk, 6);
  });
  test('bodyShapes: części ciała z identyfikatorami w obu widokach; głowa, tułów, uda, stopy', () => {
    const sk = solveSkeleton(STAND);
    for (const v of ['side', 'front', 'top'] as const) { const ids = new Set(bodyShapes(sk, v).map(s => s.id)); for (const id of ['head', 'torso', 'thighR', 'thighL', 'shankR', 'footL', 'uarmR', 'farmL', 'hair']) expect([v, id, ids.has(id)]).toEqual([v, id, true]); }
  });
  test('propShapes: gryf z talerzami, hantle, kettlebell, ławka, skrzynia, ściana, linka — każdy rekwizyt daje kształty z identyfikatorem', () => {
    const props: Prop[] = [{ k: 'floor', x0: -50, x1: 50 }, { k: 'barbell', c: [0, 100, 0] }, { k: 'dumbbell', c: [0, 50, 20], side: 'R' }, { k: 'dumbbell', c: [0, 60, 0], side: 'R', vertical: true }, { k: 'kettlebell', c: [0, 40, 0], side: 'C' },
      { k: 'bench', seatFrom: [50, 43], hinge: [0, 43], backTo: [-60, 43], legH: 43 }, { k: 'box', x0: 0, x1: 40, top: 45 }, { k: 'wall', x: 0, h: 190 }, { k: 'rail', x: 0, h: 190 }, { k: 'post', x: 0, h: 130, hook: 100 },
      { k: 'cable', from: [60, 10, 0], to: [0, 100, 0] }, { k: 'band', from: [0, 100, 0], to: [0, 0, 0] }, { k: 'chain', from: [0, 100, 0], to: [0, 0, 0] }, { k: 'pivot', from: [150, 0, 0], to: [0, 100, 0] }, { k: 'trapbar', c: [0, 30, 0] }, { k: 'mat', x0: -50, x1: 50, h: 2 }];
    for (const v of ['side', 'front', 'top'] as const) expect([v, propShapes(props, v).length]).toEqual([v, expect.any(Number)]);
    const ids = new Set(propShapes(props, 'side').map(s => s.id)); for (const id of ['floor', 'bar', 'plateNear', 'dbR', 'kb', 'benchSeat', 'box', 'wall', 'rail', 'post', 'cable', 'band', 'chain', 'landmine', 'mat']) expect([id, ids.has(id!)]).toEqual([id, true]);
  });
  test('tabela ławki: siedzisko i oparcie z normalną w górę (górna krawędź oparcia = powierzchnia), nogi', () => {
    const bp = benchPolys({ k: 'bench', seatFrom: [50, 43], hinge: [0, 43], backTo: [-60, 43], legH: 43 });
    expect(bp.back.every(q => q[1] <= 43.0001)).toBe(true); expect(bp.seat.length).toBe(4); expect(bp.legs.length).toBe(2);
  });
  test('sortShapes: rosnąca kolejność z, stabilna', () => {
    const s = sortShapes([{ k: 'circle', c: [0, 0], r: 1, z: 5 }, { k: 'circle', c: [0, 0], r: 2, z: 1 }, { k: 'circle', c: [0, 0], r: 3, z: 5 }]);
    expect(s.map(x => (x as { r: number }).r)).toEqual([2, 1, 3]);
  });
  test('pathD / shapePath / ellipsePts / boundsOf: ścieżki liniowe i gładkie, elipsa, kadr obejmuje kształty i podłogę', () => {
    expect(pathD([[0, 0], [1, 1]])).toBe('M0 0L1 1'); expect(pathD([[0, 0], [1, 1], [2, 0]], true, true)).toMatch(/^M0 0C.*Z$/);
    expect(shapePath({ k: 'line', a: [0, 0], b: [2, 2], w: 1, role: 'floor', z: 0 })).toBe('M0 0L2 2');
    expect(ellipsePts([0, 0], 4, 2, 0).length).toBe(28); expect(Math.max(...ellipsePts([0, 0], 4, 2, 90).map(q => q[1]))).toBeCloseTo(4, 6);
    const b = boundsOf([[{ k: 'circle', c: [10, 50], r: 5, z: 0 }]], 2); expect(b.x).toBeCloseTo(3, 6); expect(b.y).toBeLessThanOrEqual(-2); expect(b.y + b.h).toBeCloseTo(57, 6);
  });
  test('svgDocument: poprawny dokument z odbiciem osi y, kolejność wg z, kolory z palety', () => {
    const pal = figurePalette(light); const sk = solveSkeleton(STAND); const sh = [...bodyShapes(sk, 'side'), ...propShapes([{ k: 'floor', x0: -50, x1: 50 }], 'side')];
    const svg = svgDocument(sh, boundsOf([sh]), pal);
    expect(svg).toMatch(/^<svg [^>]*viewBox="0 0 [\d.]+ [\d.]+"/); expect(svg).toContain('matrix(1 0 0 -1'); expect(svg).toContain(pal.skin); expect(svg).not.toContain('NaN');
  });
  test('svgInner: wnętrze grupy z kształtami w kolejności rysowania; svgDocument = nagłówek + svgInner + zamknięcie (strona z biblioteką ćwiczeń używa tej samej funkcji)', () => {
    const pal = figurePalette(light); const sh = [...bodyShapes(solveSkeleton(STAND), 'side'), ...propShapes([{ k: 'floor', x0: -50, x1: 50 }], 'side')]; const inner = svgInner(sh, pal);
    expect(inner.split('\n')).toHaveLength(sh.length); expect(inner).not.toContain('<svg'); expect(svgDocument(sh, boundsOf([sh]), pal)).toContain(inner); expect(svgInner([], pal)).toBe('');
  });
});

describe('kolory z motywu (tokeny, kontrast)', () => {
  const themes = { jasny: light, ciemny: dark, 'jasny + Zwiększ kontrast': lightHC, 'ciemny + Zwiększ kontrast': darkHC };
  test('mixHex, luminance, contrast: mieszanie, skrajne wartości, symetria', () => {
    expect(mixHex('#000000', '#FFFFFF', 0.5)).toBe('#808080'); expect(mixHex('#102030', '#102030', 0.3)).toBe('#102030');
    expect(luminance('#000000')).toBe(0); expect(luminance('#FFFFFF')).toBeCloseTo(1, 6); expect(contrast('#000000', '#FFFFFF')).toBeCloseTo(21, 6); expect(contrast('#123456', '#FEDCBA')).toBeCloseTo(contrast('#FEDCBA', '#123456'), 9);
  });
  test.each(Object.entries(themes))('paleta figury (%s): wszystkie role z tokenów; skóra, ubranie i ramy sprzętu mają kontrast ≥ 3:1 do tła karty (1.4.11)', (_n, th) => {
    const pal = figurePalette(th);
    for (const v of Object.values(pal)) expect(v).toMatch(/^#[0-9A-F]{6}$/);
    for (const bg of [th.bg, th.surface]) for (const role of ['skin', 'cloth', 'frame', 'steel', 'load', 'contactOk', 'contactBad'] as const) expect([_n, role, contrast(pal[role], bg) >= 3]).toEqual([_n, role, true]);
    expect(contrast(pal.cloth, pal.skin)).toBeGreaterThanOrEqual(1.5); expect(pal.skin).not.toBe(pal.skinFar);
  });
});

describe('czas animacji (tempo ilustracyjne)', () => {
  test('TEMPO: 2 s w dół, 1 s w górę (ACSM 2009: 1–2 s na fazę), pauzy na końcach; długość pętli to suma', () => {
    expect(TEMPO.downMs).toBe(2000); expect(TEMPO.upMs).toBe(1000); expect(loopLength(true)).toBe(2 * TEMPO.holdMs + 3000); expect(loopLength(false)).toBe(loopLength(true));
  });
  test('uAt: start w 0, opuszczanie 0→1 w 2 s (ruch zaczynający się od opuszczania), pauza, powrót w 1 s; odwrotnie dla podnoszenia z podłogi; okresowość', () => {
    const h = TEMPO.holdMs; expect(uAt(0, true)).toBe(0); expect(uAt(h, true)).toBe(0); expect(uAt(h + TEMPO.downMs / 2, true)).toBeCloseTo(0.5, 6); expect(uAt(h + TEMPO.downMs, true)).toBeCloseTo(1, 6);
    expect(uAt(h + TEMPO.downMs + h, true)).toBeCloseTo(1, 6); expect(uAt(h + TEMPO.downMs + h + TEMPO.upMs / 2, true)).toBeCloseTo(0.5, 6);
    expect(uAt(h + TEMPO.upMs, false)).toBeCloseTo(1, 6);
    expect(uAt(123456, true)).toBeCloseTo(uAt(123456 + loopLength(true), true), 9); expect(uAt(-50, true)).toBeGreaterThanOrEqual(0);
    for (let ms = 0; ms < 2 * loopLength(true); ms += 37) { const u = uAt(ms, true); expect(u >= 0 && u <= 1).toBe(true); }
  });
});

describe('kolidery i sprawdzenia klatki', () => {
  test('sdPoly: odległość ze znakiem od wielokąta (wewnątrz ujemna)', () => {
    const sq: [number, number][] = [[0, 0], [10, 0], [10, 10], [0, 10]];
    expect(sdPoly([5, 5], sq)).toBeCloseTo(-5, 9); expect(sdPoly([13, 5], sq)).toBeCloseTo(3, 9); expect(sdPoly([13, 14], sq)).toBeCloseTo(5, 9);
  });
  test('gap: kapsuła–kapsuła i kapsuła–graniastosłup (z zakresem z), ujemny = przenikanie', () => {
    const a = { k: 'capsule' as const, id: 'a', a: [0, 0, 0] as V3, b: [0, 10, 0] as V3, r: 2 }, b = { k: 'capsule' as const, id: 'b', a: [5, 0, 0] as V3, b: [5, 10, 0] as V3, r: 2 };
    expect(gap(a, b)).toBeCloseTo(1, 9);
    const box = { k: 'prism' as const, id: 'box', poly: [[10, 0], [20, 0], [20, 10], [10, 10]] as [number, number][], z0: -5, z1: 5 };
    expect(gap(a, box)).toBeCloseTo(8, 6); expect(gap({ ...a, a: [9, 5, 0], b: [9, 5, 0] }, box)).toBeCloseTo(-1, 6); expect(gap({ ...a, a: [12, 5, 20], b: [12, 5, 20] }, box)).toBeGreaterThan(10);
  });
  test('checkFrame wykrywa: przenikanie gryfu z udem, ręce poza zasięgiem, stopę pod podłogą, dłoń poza gryfem', () => {
    const f = frameAt(figureSpec('Back Squat')!, 0.5);
    expect(checkFrame(f)).toEqual([]);
    const thigh = f.sk.legs.R.hip; const bad: Frame = { ...f, props: [{ k: 'barbell', c: [thigh[0], thigh[1], 0] }], contacts: [] };
    const codes = checkFrame(bad).map(i => i.code); expect(codes).toEqual(expect.arrayContaining(['pen', 'grip']));
    const far = solveSkeleton({ ...STAND, arms: { R: { grip: [200, 90, 24] }, L: { grip: [20, 90, -24] } } }); expect(checkFrame({ sk: far, props: [], info: {}, contacts: [] }).map(i => i.code)).toContain('reach');
    const low = solveSkeleton({ ...STAND, legs: { R: { ankle: [0, 1, 14] }, L: { ankle: [0, 7, -14] } } }); expect(checkFrame({ sk: low, props: [], info: {}, contacts: [] }).map(i => i.code)).toContain('floor');
  });
  test('holdChecks: odległość chwytu od gryfu, uchwytów, hantli i kettlebell; TOL ma wartości dodatnie', () => {
    const f = frameAt(figureSpec('Bench Press (sztanga)')!, 0.5); const h = holdChecks(f); expect(h.length).toBe(2); expect(Math.max(...h.map(x => x.err))).toBeLessThan(0.1);
    expect(TOL.pen).toBeGreaterThan(0); expect(TOL.reach).toBeGreaterThan(0); expect(TOL.floor).toBeGreaterThan(0); expect(TOL.bone).toBeGreaterThan(0);
    const t = frameAt(figureSpec('Trap Bar Deadlift')!, 0); expect(holdChecks(t).length).toBe(2); expect(holdChecks(frameAt(figureSpec('Goblet Squat')!, 0)).length).toBe(2);
  });
  test('kolidery ciała i sprzętu: id kapsuł, ławka jako dwa graniastosłupy, skrzynia, ściana, słupek', () => {
    const f = frameAt(figureSpec('Bench Press (sztanga)')!, 0); expect(equipColliders(f.props).map(c => c.id)).toEqual(expect.arrayContaining(['bar', 'benchSeat', 'benchBack']));
    expect(equipColliders([{ k: 'box', x0: 0, x1: 40, top: 45 }, { k: 'wall', x: 0, h: 190 }, { k: 'post', x: 0, h: 130 }, { k: 'rail', x: 0, h: 190 }, { k: 'mat', x0: 0, x1: 10, h: 2 }, { k: 'trapbar', c: [0, 20, 0] }]).map(c => c.id)).toEqual(['box', 'wall', 'post', 'post', 'rail', 'rail', 'mat', 'bar', 'bar']);
    expect(bodyColliders(f.sk).length).toBe(2 * 5 + 3);
    expect(GIRTH.thigh.length).toBe(3); expect(EQUIP.barR).toBeLessThan(2);
  });
});

describe('podświetlenie mięśni (dane z katalogu, nie z makiety)', () => {
  test('muscleLoad dla wszystkich 709 ćwiczeń z pewnością; Back Squat: czworogłowe główne, pośladki pomocnicze (przeczy makiecie, która dawała pośladki jako główne)', () => {
    expect(Object.keys(MUSCLE_DATA).length).toBe(709); for (const k of Object.keys(CATALOG)) expect([k, !!musclesFor(k)]).toEqual([k, true]);
    expect(musclesFor('Back Squat')!.load.quads).toBe(1); expect(musclesFor('Back Squat')!.load.glutes).toBe(0.5); expect(musclesFor('Bench Press (sztanga)')!.load.chest).toBe(1); expect(musclesFor('Bench Press (sztanga)')!.load.triceps).toBe(0.5);
    expect(musclesFor('Nie ma takiego')).toBeNull(); for (const e of Object.values(MUSCLE_DATA)) expect(e.confidence.length).toBeGreaterThan(3);
  });
  test('muscleShapes: kształty tylko dla mięśni z udziałem ≥ 0,5; główny mocniejszy od pomocniczego; stałe (bez zależności od czasu); wartości 0,25 pomijane', () => {
    const sk = frameAt(figureSpec('Back Squat')!, 0.5).sk;
    for (const v of ['side', 'front'] as const) {
      const s = muscleShapes(sk, v, { quads: 1, glutes: 0.5, calves: 0.25 }); const ids = new Set(s.map(x => x.id));
      expect(ids.has('muscle-quads')).toBe(true); expect(ids.has('muscle-calves')).toBe(false);
      const q = s.find(x => x.id === 'muscle-quads') as { a?: number }, g = s.find(x => x.id === 'muscle-glutes') as { a?: number } | undefined; if (g) expect(g.a!).toBeLessThan(q.a!);
      expect(JSON.stringify(muscleShapes(sk, v, { quads: 1 }))).toBe(JSON.stringify(muscleShapes(sk, v, { quads: 1 })));
    }
    expect(MUSCLE_MIN_LOAD).toBe(0.5); expect(MUSCLES.length).toBe(19);
  });
  test('wszystkie regiony mięśni dają skończone wielokąty w obu widokach', () => {
    const sk = frameAt(figureSpec('Deadlift (sztanga)')!, 0.5).sk; const all = Object.fromEntries(MUSCLES.map(m => [m, 1]));
    for (const v of ['side', 'front'] as const) for (const s of muscleShapes(sk, v, all)) if (s.k === 'poly') for (const p of s.pts) expect(Number.isFinite(p[0] + p[1])).toBe(true);
  });
});

describe('dane i dokument generowane', () => {
  test('node scripts/figures/v2-gen.mjs --check: muscles.generated.ts i docs/51 aktualne (część npm run check:figures-v2)', () => {
    expect(() => execFileSync('node', [path.join(root, 'scripts/figures/v2-gen.mjs'), '--check'], { cwd: root, stdio: 'pipe' })).not.toThrow();
  });
  test('katalog narzędzi: v2-build.mjs i podglad-v2.mjs istnieją (narzędzia dla agentów rodzin)', () => {
    for (const f of ['scripts/figures/v2-build.mjs', 'scripts/figures/podglad-v2.mjs', 'scripts/figures/v2-gen.mjs']) expect(fs.existsSync(path.join(root, f))).toBe(true);
  });
});

describe('wspólne elementy rigów i słowniki wartości', () => {
  test('solveRoot, ease, legFK, mkFrame: bisekcja, tempo 0–1, łańcuch nogi (pochylenie podudzia ≤ granica stopy), klatka z szkieletem', () => {
    expect(solveRoot(x => x - 3, 0, 10)).toBeCloseTo(3, 6); expect(solveRoot(x => x + 5, 0, 10)).toBe(0); expect(solveRoot(x => x, 0, 10)).toBe(0);
    expect(ease(0)).toBe(0); expect(ease(1)).toBe(1); expect(ease(0.5)).toBeCloseTo(0.5, 9); expect(ease(2)).toBe(1);
    const c = legFK(120, { stand: 4, perKnee: 0.3, max: 36 }, [0, 7, 0]); expect(c.sigma).toBe(36); expect(c.hip[1]).toBeLessThan(60);
    expect(legFK(0, { stand: 0, perKnee: 0, max: 0 }, [0, 7, 0]).hip[1]).toBeCloseTo(7 + BODY.shank + BODY.thigh, 6); expect(legFK(0, { stand: 0, perKnee: 0, max: 0 }, [0, 7, 0], 20).hip[1]).toBeLessThan(7 + BODY.shank + BODY.thigh);
    expect(legChain(0).hip[1]).toBeGreaterThan(85); expect(kneeForHipHeight(54)).toBeGreaterThan(80); expect(kneeForHipHeight(54)).toBeLessThan(141);
    const f = mkFrame(STAND, [], { x: [1, 2, 3] }); expect(f.sk.pelvis).toEqual(STAND.pelvis); expect(f.info.x).toEqual([1, 2, 3]); expect(f.contacts).toEqual([]);
    expect(SQUAT.shinMax).toBeLessThanOrEqual(37); expect(HINGE.arm).toBeCloseTo(BODY.uarm + BODY.farm + BODY.hand, 1);
  });
  test('shapeAttrs: kolor z palety, grubość, przezroczystość; obrys tylko przy stroke', () => {
    const pal = figurePalette(light);
    expect(shapeAttrs({ k: 'line', a: [0, 0], b: [1, 1], w: 2, role: 'floor', z: 0 }, pal)).toMatchObject({ stroke: pal.floor, strokeWidth: 2 });
    expect(shapeAttrs({ k: 'circle', c: [0, 0], r: 1, fill: 'plate', stroke: 'plate', w: 1, a: 0.3, z: 0 }, pal)).toMatchObject({ fill: pal.plate, stroke: pal.plate, fillOpacity: 0.3 });
    expect(shapeAttrs({ k: 'circle', c: [0, 0], r: 1, fill: 'skin', z: 0 }, pal).stroke).toBeUndefined();
  });
  test('profile tułowia (z boku i z przodu) rosną od miednicy do barków i mają dodatnie wymiary', () => {
    expect(TORSO_SIDE.length).toBe(9); expect(TORSO_FRONT.length).toBe(8);
    for (let i = 1; i < TORSO_SIDE.length; i++) expect(TORSO_SIDE[i][0]).toBeGreaterThan(TORSO_SIDE[i - 1][0]);
    for (const [, back, front] of TORSO_SIDE) { expect(back).toBeLessThan(0); expect(front).toBeGreaterThan(0); }
    for (const [, w] of TORSO_FRONT) expect(w).toBeGreaterThan(8);
  });
  test('słowniki wartości: rodziny (43), mięśnie (19), role kolorów (21), style zawiasu (5), rodzaje obciążenia przysiadu (13) — każda wartość ma wpis', () => {
    const FAMILY_IDS = ['squat', 'bench_press', 'hinge', 'pushup_plank', 'dip', 'overhead_press', 'row', 'cable_row', 'pull_up', 'pulldown', 'lunge', 'leg_machine', 'leg_isolation', 'calf_raise', 'hip_bridge', 'kb_ballistic', 'olympic', 'back_extension', 'curl', 'triceps', 'delt_raise', 'chest_fly', 'shrug', 'rotator_cuff', 'core_floor', 'core_hang', 'core_standing', 'carry', 'cardio', 'plyo', 'sled_throw', 'strongman', 'glute_floor', 'hip_abd_add', 'mobility_stand', 'mobility_floor', 'foam_roll', 'neck', 'forearm', 'thruster', 'chest_press_machine', 'cable_press', 'kneeling_hinge'];
    expect(FAMILIES.map(f => f.id)).toEqual(FAMILY_IDS);
    const MUSCLE_IDS = ['chest', 'triceps', 'front_delt', 'biceps', 'abs', 'lower_back', 'hamstrings', 'glutes', 'quads', 'upper_back', 'forearms', 'lats', 'adductors', 'rear_delt', 'obliques', 'side_delt', 'calves', 'abductors', 'neck'];
    expect([...MUSCLES]).toEqual(MUSCLE_IDS);
    const ROLES = ['floor', 'frame', 'pad', 'steel', 'plate', 'load', 'skin', 'skinFar', 'skinHi', 'cloth', 'clothFar', 'clothHi', 'error', 'shoe', 'hair', 'guide', 'cable', 'muscleMain', 'muscleAux', 'contactOk', 'contactBad'];
    expect(Object.keys(figurePalette(light))).toEqual(expect.arrayContaining(ROLES)); expect(Object.keys(figurePalette(dark)).length).toBe(ROLES.length);
    const STYLES = ['floor', 'rdl', 'goodMorning', 'pullThrough', 'singleLeg']; const LOADS = ['highBar', 'frontBar', 'zercher', 'overhead', 'goblet', 'dbSides', 'dbSumo', 'bodyweight', 'belt', 'landmine', 'behind', 'kbRack', 'kbOverhead1'];
    const used = new Set<string>(Object.values(VARIANTS_FOR_TEST()).map(v => v.family === 'hinge' ? v.p.style : v.family === 'squat' ? v.p.load : ''));
    for (const x of [...STYLES, ...LOADS]) expect([x, used.has(x)]).toEqual([x, true]);
  });
});
function VARIANTS_FOR_TEST() { return require('@/lib/figures/v2').VARIANTS as Record<string, import('@/lib/figures/v2').Variant>; }
