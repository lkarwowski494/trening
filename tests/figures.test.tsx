/*
 * Figury ruchu, etap 2–3 (decyzja właściciela 08.10.2026 ok. 23:50; dane lib/figures, dokument docs/research/28 z scripts/figures/gen.mjs).
 * Rodzaje (docs/20): dane (pokrycie ćwiczeń ze wskazówkami, odwołania póz do zdań wskazówek, sprawdzenia geometrii każdej pozy),
 * niezmienniki (zakres stawów w każdej pozie i w pozach pośrednich animacji, figura nie wchodzi pod podłogę, bez migania),
 * logika (geometria, pętla, interpolacja, dziedziczenie „like”), ekran (oba motywy, Ogranicz ruch → statycznie, zmiana ustawienia,
 * pauza WCAG 2.2.2, etykieta VoiceOver), języki (etykiety w 26 językach), zrzut SVG kilku ćwiczeń, dokument (--check, verify).
 */
import * as fs from 'fs';
import * as path from 'path';
import { execFileSync } from 'child_process';
import React from 'react';
import * as RN from 'react-native';
import { render, screen, fireEvent, act } from '@testing-library/react-native';
import { FIG_DATA, figureFor, figureByKey, figureLabel, frameLabel, figureFrames, figureAt, toSvg, svgPath } from '@/lib/figures';
import {
  SEG, ANIM, STROKE, PROP_R, side, norm, rawPoints, posePoints, jointAngles, toHorizontal, angleAt, lerpPose, lerpPt, loopAt, loopMs,
  resolveFigure, framePoints, evalCheck, shapes, bounds, poseBetween, type Figure, type SidePose, type Pose, type Points, type Check, type Shape,
} from '@/lib/figures/geom';
import { CUE_DATA, CUE_SECTIONS, cueText } from '@/lib/cues';
import { ExerciseFigure, useReduceMotion } from '@/components/ExerciseFigure';
import { ExerciseCues } from '@/components/ExerciseCues';
import { LANGS, applyLang, t } from '@/lib/i18n';
import { light, dark } from '@/lib/theme';

const root = path.join(__dirname, '..');
const lib = (key: string) => ({ lib: true as const, libKey: key });
const KEYS = Object.keys(FIG_DATA.exercises);
const fig = (k: string) => figureByKey(k) as Figure;
const cueIdsOf = (k: string) => new Set(CUE_SECTIONS.flatMap(s => (CUE_DATA.exercises[k][s] ?? []).map(r => r.c)));
const ST: SidePose = { t: 90, hip: 0, knee: 0, sh: 0, el: 0 };
const AI = RN.AccessibilityInfo as unknown as { isReduceMotionEnabled: jest.Mock; addEventListener: jest.Mock };
const setReduce = (v: boolean | 'never') => { AI.isReduceMotionEnabled.mockImplementation(() => v === 'never' ? new Promise(() => {}) : Promise.resolve(v)); };
const flush = async () => { await act(async () => { await Promise.resolve(); }); };
afterEach(() => { applyLang('pl'); jest.useRealTimers(); AI.isReduceMotionEnabled.mockImplementation(() => Promise.resolve(false)); jest.restoreAllMocks(); });

/** Pozy do sprawdzenia: każda klatka oraz pozy pośrednie animacji (co 1/8 przejścia). */
function posesOf(f: Figure): { p: Pose; P: Points; tag: string }[] {
  const out: { p: Pose; P: Points; tag: string }[] = f.frames.map((fr, i) => ({ p: fr.p, P: framePoints(f, i), tag: fr.n }));
  for (let i = 0; i + 1 < f.frames.length; i++) for (let s = 1; s < 8; s++) { const k = s / 8; out.push({ ...poseBetween(f, i, i + 1, k), tag: `${f.frames[i].n}→${f.frames[i + 1].n}@${k}` }); }
  return out;
}

describe('dane figur', () => {
  test('każde ćwiczenie ze wskazówkami etapu 1 ma figurę albo powód na liście otwartej; figury tylko dla ćwiczeń ze wskazówkami', () => {
    for (const k of Object.keys(CUE_DATA.exercises)) expect([k, !!FIG_DATA.exercises[k] !== !!FIG_DATA.open[k]]).toEqual([k, true]);
    for (const k of [...KEYS, ...Object.keys(FIG_DATA.open)]) expect([k, !!CUE_DATA.exercises[k]]).toEqual([k, true]);
    for (const [k, why] of Object.entries(FIG_DATA.open)) expect([k, why.length > 40]).toEqual([k, true]);
    expect(KEYS.length).toBeGreaterThanOrEqual(60);
  });
  test('najczęstsze wzorce mają figurę (przysiad, martwy ciąg, wyciskania, wiosłowanie, podciąganie, wykrok, hip thrust, uginania, prostowania)', () => {
    for (const k of ['Back Squat', 'Deadlift (sztanga)', 'Bench Press (sztanga)', 'Overhead Press (sztanga)', 'Bent Over Row (sztanga)', 'Pull Up', 'Lunges (hantle)', 'Hip Thrust (sztanga)', 'Barbell Curl', 'Triceps Pushdown']) expect([k, figureByKey(k) !== null]).toEqual([k, true]);
  });
  test('każda poza ma 1–3 klatki w kolejności start → (mid) → end i co najmniej jedno odwołanie do zdania wskazówki TEGO ćwiczenia', () => {
    for (const k of KEYS) {
      const f = fig(k); expect([k, f.frames.length >= 1 && f.frames.length <= 3]).toEqual([k, true]);
      expect([k, f.frames.map(x => x.n)]).toEqual([k, (({ 1: ['start'], 2: ['start', 'end'], 3: ['start', 'mid', 'end'] }) as Record<number, string[]>)[f.frames.length]]);
      const ids = cueIdsOf(k);
      for (const fr of f.frames) { expect([k, fr.n, fr.why.length > 0]).toEqual([k, fr.n, true]); for (const w of fr.why) expect([k, fr.n, w.c, ids.has(w.c)]).toEqual([k, fr.n, w.c, true]); }
    }
  });
  test('każda poza spełnia swoje sprawdzenia (geometria liczona z kątów — np. „uda równolegle”, „barki nad sztangą”, „łokcie pod nadgarstkami”)', () => {
    const bad: string[] = [];
    for (const k of KEYS) { const f = fig(k); f.frames.forEach((fr, i) => { const P = framePoints(f, i); for (const w of fr.why) { const r = evalCheck(w, fr.p, f.view, P); if (!r.ok) bad.push(`${k}.${fr.n}.${w.q}.${w.c}=${r.v}`); } }); }
    expect(bad).toEqual([]);
  });
  test('zakres stawów: każda poza i każda poza pośrednia animacji w granicach anatomicznych (rom w data.json, ze źródłami)', () => {
    const bad: string[] = [];
    for (const k of KEYS) {
      const f = fig(k), R = FIG_DATA.rom[f.view];
      for (const { p, tag } of posesOf(f)) for (const [j, v] of Object.entries(jointAngles(p, f.view))) {
        const r = R[j.replace(/2$/, '')]; if (!r) { bad.push(`${k}.${tag}: brak granicy ${j}`); continue; }
        if (f.armProj && f.view === 'side' && /^(sh|el)/.test(j)) continue;
        if (v < r.min - 0.5 || v > r.max + 0.5) bad.push(`${k}.${tag}.${j}=${v.toFixed(1)} poza [${r.min}, ${r.max}]`);
      }
    }
    expect(bad).toEqual([]);
    for (const v of ['side', 'front'] as const) for (const r of Object.values(FIG_DATA.rom[v])) { expect(r.min).toBeLessThan(r.max); expect(r.src.length).toBeGreaterThan(20); }
  });
  test('figura nie wchodzi pod podłogę (w żadnej klatce ani pozie pośredniej) i ma skończone współrzędne', () => {
    const bad: string[] = [];
    for (const k of KEYS) {
      const f = fig(k); if (!f.floor) continue;
      for (const { P, tag } of posesOf(f)) {
        for (const [n, q] of Object.entries(P)) { if (!Number.isFinite(q[0]) || !Number.isFinite(q[1])) bad.push(`${k}.${tag}.${n} NaN`); else if (q[1] < -1.5) bad.push(`${k}.${tag}.${n} y=${q[1].toFixed(1)}`); }
      }
    }
    expect(bad).toEqual([]);
  });
  test('bez migania: w pętli zmienia się tylko położenie — liczba kształtów, role (kolory) i wypełnienia są stałe', () => {
    for (const k of KEYS) {
      const f = fig(k), sig = (l: Shape[]) => l.map(s => `${s.s}:${s.role}:${'fill' in s ? s.fill : ''}`).join('|');
      const ref = sig(figureAt(f, 0));
      for (let ms = 0; ms < loopMs(f.frames.length) + 1; ms += 250) expect([k, ms, sig(figureAt(f, ms))]).toEqual([k, ms, ref]);
    }
  });
});

describe('geometria (lib/figures/geom)', () => {
  test('rawPoints: stojąca figura — głowa najwyżej, stopa na dole, długości segmentów z SEG', () => {
    const P = rawPoints(ST, 'side');
    expect(P.hip).toEqual([0, 0]);
    expect(P.shoulder[1]).toBeCloseTo(SEG.trunk); expect(P.head[1]).toBeCloseTo(SEG.trunk + SEG.neck);
    expect(P.knee[1]).toBeCloseTo(-SEG.thigh); expect(P.ankle[1]).toBeCloseTo(-SEG.thigh - SEG.shank);
    expect(P.hand[1]).toBeCloseTo(SEG.trunk - SEG.uarm - SEG.farm);
    expect(P.toe[0]).toBeCloseTo(SEG.toe[0]); expect(P.heel[0]).toBeCloseTo(SEG.heel[0]);
    const F = rawPoints({ sh: 90, el: 0 }, 'front');
    expect(F.hand[1]).toBeCloseTo(SEG.trunk); expect(F.hand[0]).toBeCloseTo(SEG.shW + SEG.uarm + SEG.farm); expect(F.hand2[0]).toBeCloseTo(-(SEG.shW + SEG.uarm + SEG.farm));
    expect(rawPoints({ sh: 0, elev: 4 }, 'front').shoulder[1]).toBeCloseTo(SEG.trunk + 4);
  });
  test('ap/fp skracają rzut ramienia i przedramienia; para [bliższa, dalsza] rozdziela strony; side() z domyślną', () => {
    const P = rawPoints({ ...ST, ap: 0.5, fp: 0.5 }, 'side');
    expect(P.hand[1]).toBeCloseTo(SEG.trunk - (SEG.uarm + SEG.farm) / 2);
    const Q = rawPoints({ ...ST, sh: [90, 0] }, 'side');
    expect(Q.hand[0]).toBeGreaterThan(30); expect(Q.hand2[0]).toBeCloseTo(0);
    expect(side(undefined, 1, 7)).toBe(7); expect(side([1, 2], 1)).toBe(2); expect(side(3, 1)).toBe(3);
  });
  test('posePoints: kotwica trafia w zadany punkt', () => {
    const P = posePoints(ST, 'side', 'toe', [5, 0]);
    expect(P.toe[0]).toBeCloseTo(5); expect(P.toe[1]).toBeCloseTo(0); expect(P.heel[1]).toBeCloseTo(0);
    expect(posePoints(ST, 'side', 'nie-ma', [1, 1]).hip).toEqual([1, 1]);
  });
  test('jointAngles: zgięcie grzbietowe stopy z kierunku stopy i podudzia; norm do (-180, 180]', () => {
    expect(jointAngles(ST, 'side').ankle).toBeCloseTo(0);
    expect(jointAngles({ ...ST, ft: 20 }, 'side').ankle).toBeCloseTo(20);
    expect(jointAngles({ ...ST, el: -150 }, 'side').el).toBe(-150);
    expect(jointAngles({ sh: 90, elev: 3 }, 'front')).toMatchObject({ abd: 90, el: 0, elev: 3 });
    expect(norm(270)).toBe(-90); expect(norm(-190)).toBe(170); expect(norm(180)).toBe(180);
  });
  test('toHorizontal i angleAt', () => {
    expect(toHorizontal([0, 0], [10, 0])).toBeCloseTo(0); expect(toHorizontal([0, 0], [-10, 0])).toBeCloseTo(0);
    expect(toHorizontal([0, 0], [0, -5])).toBeCloseTo(90); expect(toHorizontal([0, 0], [-1, 1])).toBeCloseTo(45);
    expect(angleAt([0, 0], [1, 0], [2, 0])).toBeCloseTo(180); expect(angleAt([0, 1], [0, 0], [1, 0])).toBeCloseTo(90);
  });
  test('lerpPose: kąty liniowo, tułów najkrótszą drogą, brakujący skrót rzutu = 1 (regresja: ramię nie znika na początku przejścia)', () => {
    const m = lerpPose({ ...ST, t: 350 }, { ...ST, t: 10, sh: [20, 40], ap: 0.5 }, 0.5);
    expect(m.t).toBeCloseTo(360); expect(m.sh).toEqual([10, 20]); expect(m.ap).toBeCloseTo(0.75);
    expect(lerpPose(ST, { ...ST, ap: 0.6 }, 0).ap).toBe(1);
    expect(lerpPt([0, 0], [10, 20], 0.25)).toEqual([2.5, 5]);
  });
  test('loopAt / loopMs: ping-pong z zatrzymaniem w pozycjach kluczowych; jedna klatka — bez ruchu', () => {
    const seg = ANIM.moveMs + ANIM.holdMs;
    expect(loopMs(2)).toBe(2 * seg); expect(loopMs(3)).toBe(4 * seg); expect(loopMs(1)).toBe(0);
    expect(loopAt(0, 2)).toEqual({ from: 0, to: 1, k: 0 });
    expect(loopAt(ANIM.holdMs - 1, 2).k).toBe(0);
    expect(loopAt(ANIM.holdMs + ANIM.moveMs / 2, 2).k).toBeCloseTo(0.5);
    expect(loopAt(seg, 2)).toEqual({ from: 1, to: 0, k: 0 });
    expect(loopAt(2 * seg, 2)).toEqual({ from: 0, to: 1, k: 0 });
    expect([0, 1, 2, 3].map(i => loopAt(i * seg, 3).from)).toEqual([0, 1, 2, 1]);
    expect(loopAt(12345, 1)).toEqual({ from: 0, to: 0, k: 0 });
    expect(loopAt(-seg, 2).from).toBe(1);
  });
  test('resolveFigure: „like” dziedziczy, własne pola nadpisują; brak, cykl i pusta figura → null', () => {
    const defs = { A: { anchor: 'hip', props: [{ k: 'bar' as const, x: 0, y: 0 }], frames: [{ n: 'start' as const, p: ST, why: [] }], note: 'a' }, B: { like: 'A', anchor: 'toe' }, C: { like: 'D' }, D: { like: 'C' }, E: {}, F: { like: 'X' } };
    const b = resolveFigure(defs, 'B')!; expect(b.anchor).toBe('toe'); expect(b.props).toEqual(defs.A.props); expect(b.note).toBe('a'); expect(b.view).toBe('side'); expect(b.floor).toBe(true); expect(b.armProj).toBe(false);
    expect(resolveFigure(defs, 'C')).toBeNull(); expect(resolveFigure(defs, 'E')).toBeNull(); expect(resolveFigure(defs, 'F')).toBeNull(); expect(resolveFigure(defs, 'Z')).toBeNull();
    expect(resolveFigure(defs, 'toString')).toBeNull();
  });
  test('evalCheck: każdy rodzaj sprawdzenia — spełniony i niespełniony', () => {
    const P = rawPoints(ST, 'side'), ok = (c: Partial<Check>, p: SidePose = ST, Q = P) => evalCheck({ c: 'x', ...c } as Check, p, 'side', Q).ok;
    expect(ok({ q: 'horiz', a: 'hip', b: 'shoulder', eq: 90, tol: 1 })).toBe(true); expect(ok({ q: 'horiz', a: 'hip', b: 'shoulder', eq: 0, tol: 10 })).toBe(false);
    expect(ok({ q: 'horiz', a: 'nie', b: 'hip', eq: 0, tol: 1 })).toBe(false);
    expect(ok({ q: 'joint', j: 'knee', eq: 0, tol: 1 })).toBe(true); expect(ok({ q: 'joint', j: 'nie', eq: 0, tol: 1 })).toBe(false);
    expect(ok({ q: 'alignX', a: 'hip', b: 'shoulder', tol: 0.1 })).toBe(true); expect(ok({ q: 'alignX', a: 'hip', b: 'toe', tol: 1 })).toBe(false);
    expect(ok({ q: 'line', pts: ['shoulder', 'hip', 'ankle'], tol: 1 })).toBe(true); expect(ok({ q: 'line', pts: ['shoulder', 'hip'], tol: 1 })).toBe(false);
    const S = rawPoints({ ...ST, hip: 90 }, 'side'); expect(ok({ q: 'line', pts: ['shoulder', 'hip', 'knee'], tol: 10 }, { ...ST, hip: 90 }, S)).toBe(false);
    const A = posePoints(ST, 'side', 'toe');
    expect(ok({ q: 'low', a: 'heel', y: 0, tol: 1 }, ST, A)).toBe(true); expect(ok({ q: 'low', a: 'hip', y: 0, tol: 5 }, ST, A)).toBe(false); expect(ok({ q: 'low', a: 'nie', y: 0, tol: 5 })).toBe(false);
    expect(ok({ q: 'above', a: 'head', b: 'hip' })).toBe(true); expect(ok({ q: 'above', a: 'hip', b: 'head' })).toBe(false); expect(ok({ q: 'above', a: 'head', y: 1000 })).toBe(false); expect(ok({ q: 'above', a: 'head' })).toBe(false);
    expect(ok({ q: 'ahead', a: 'toe', b: 'heel' })).toBe(true); expect(ok({ q: 'ahead', a: 'heel', b: 'toe' })).toBe(false); expect(ok({ q: 'ahead', a: 'heel' })).toBe(false);
    const bent: SidePose = { ...ST, sh: -40, el: 90 }; const B = rawPoints(bent, 'side');
    expect(ok({ q: 'behind', a: 'elbow', tol: 1 }, bent, B)).toBe(true); expect(ok({ q: 'behind', a: 'hand', tol: 1 }, { ...ST, sh: 90 }, rawPoints({ ...ST, sh: 90 }, 'side'))).toBe(false);
    expect(evalCheck({ q: 'behind', a: 'elbow', c: 'x' }, { sh: 0 }, 'front', rawPoints({ sh: 0 }, 'front')).ok).toBe(false);
    expect(ok({ q: 'touch', a: 'shoulder', b: 'hip', tb: [SEG.trunk, 0], tol: 0.01 })).toBe(true); expect(ok({ q: 'touch', a: 'hand', b: 'hip', tol: 1 })).toBe(false); expect(ok({ q: 'touch', a: 'hand', tol: 1 })).toBe(false);
    expect(ok({ q: 'nieznane' as Check['q'] })).toBe(false);
  });
  test('shapes: kolejność warstw, dalsze kończyny tylko z boku, przyrządy przypięte do punktów i stałe w świecie', () => {
    const props = [{ k: 'rect' as const, x: 0, y: 0, w: 2, h: 2 }, { k: 'line' as const, pts: [[0, 0], [1, 1]] as [number, number][] }, { k: 'bar' as const, x: 3, y: 3 },
      { k: 'cable' as const, at: 'hand', from: [9, 9] as [number, number] }, { k: 'rod' as const, a: 'hand', b: [0, 0] as [number, number], ext: 2 }, { k: 'plank' as const, at: 'toe', ang: 90, len: 10 },
      { k: 'plate' as const, at: 'hand' }, { k: 'db' as const, at: 'hand2' }, { k: 'kb' as const, at: 'hand' }, { k: 'grip' as const, at: 'shoulder', tb: [0, 5] as [number, number] }];
    const P = rawPoints(ST, 'side'); const s = shapes(ST, 'side', P, props);
    expect(s[0]).toMatchObject({ role: 'pad', close: true }); expect(s[1].role).toBe('fixed');
    expect(s.filter(x => x.role === 'far').length).toBe(3); /* noga, ręka, hantel dalszej dłoni */
    const plate = s.find(x => x.s === 'circle' && x.r === PROP_R.plate)!; expect(plate.s === 'circle' && plate.c).toEqual(P.hand);
    const grip = s.find(x => x.s === 'circle' && x.r === PROP_R.grip)!; expect(grip.s === 'circle' && grip.c[0]).toBeCloseTo(P.shoulder[0] + 5);
    const kb = s.find(x => x.s === 'circle' && x.r === PROP_R.kb)!; expect(kb.s === 'circle' && kb.c[1]).toBeLessThan(P.hand[1]);
    const plank = s.find(x => x.s === 'poly' && x.role === 'fixed' && Math.abs(x.pts[0][1] - x.pts[1][1]) === 10); expect(plank).toBeDefined();
    expect(s.some(x => x.role === 'cable')).toBe(true); expect(s.some(x => x.role === 'load' && x.s === 'poly')).toBe(true);
    const F = shapes({ sh: 10 }, 'front', rawPoints({ sh: 10 }, 'front'), [{ k: 'db', at: 'hand2' }]);
    expect(F.some(x => x.role === 'far')).toBe(false); expect(F.filter(x => x.role === 'load').length).toBe(1);
    expect(STROKE.trunk).toBeGreaterThan(STROKE.limb);
  });
  test('bounds: wspólny kadr obejmuje kształty z grubością kresek; podłoga w kadrze tylko z floor', () => {
    const s: Shape[][] = [[{ s: 'circle', c: [10, 50], r: 5, role: 'body', fill: true }], [{ s: 'poly', pts: [[-10, 20], [0, 30]], w: 4, role: 'body' }]];
    expect(bounds(s, 0)).toEqual({ x: -12, y: 0, w: 27, h: 55 });
    expect(bounds(s, 0, false)).toEqual({ x: -12, y: 18, w: 27, h: 37 });
    expect(bounds([], 0)).toEqual({ x: 0, y: 0, w: 0, h: 0 });
  });
});

describe('lib/figures', () => {
  test('figureFor: ćwiczenie biblioteki po kluczu katalogu; przemianowane zachowuje; własne, otwarte, bez wskazówek, nieznane → null', () => {
    expect(figureFor(lib('Back Squat'))!.key).toBe('Back Squat');
    expect(figureFor({ lib: true, libKey: 'Back Squat' })).not.toBeNull();
    expect(figureFor({ lib: false, libKey: 'Back Squat' })).toBeNull();
    expect(figureFor(lib('Crunch'))).toBeNull();
    expect(figureFor(lib('Nie ma'))).toBeNull(); expect(figureFor(null)).toBeNull();
    const noCue = Object.keys(CUE_DATA.open)[0]; if (noCue) expect(figureFor(lib(noCue))).toBeNull();
    expect(figureByKey('Pendlay Row')!.frames).toEqual(figureByKey('Bent Over Row (sztanga)')!.frames);
  });
  test('figureLabel: szablon + zdania „Ruch” wskazówek; frameLabel: podpisy klatek', () => {
    const mv = CUE_DATA.exercises['Back Squat'].move.map(r => cueText(r.c, 'pl')).join(' ');
    expect(figureLabel('Back Squat', 'pl')).toBe(`Rysunek ruchu: ${mv}`);
    expect(figureLabel('Nie ma', 'pl')).toBe('Rysunek ruchu: ');
    expect([frameLabel('start'), frameLabel('mid'), frameLabel('end')]).toEqual(['Pozycja wyjściowa', 'W trakcie', 'Pozycja końcowa']);
  });
  test('etykiety VoiceOver w 26 językach: przetłumaczony szablon i zdania ruchu w języku interfejsu', () => {
    for (const l of LANGS) {
      applyLang(l);
      const prefix = t('Rysunek ruchu: {opis}', { opis: '' }).trim();
      if (l !== 'pl') expect([l, prefix]).not.toEqual([l, 'Rysunek ruchu:']);
      for (const k of ['Back Squat', 'Lateral Raise (hantle)', 'Plank']) {
        const lab = figureLabel(k, l);
        expect([l, k, lab.startsWith(prefix)]).toEqual([l, k, true]);
        for (const r of CUE_DATA.exercises[k].move) expect([l, k, lab.includes(cueText(r.c, l))]).toEqual([l, k, true]);
      }
      for (const n of ['start', 'mid', 'end'] as const) if (l !== 'pl') expect([l, frameLabel(n)]).not.toEqual([l, ({ start: 'Pozycja wyjściowa', mid: 'W trakcie', end: 'Pozycja końcowa' })[n]]);
      if (l !== 'pl') for (const k of ['Zatrzymaj animację', 'Wznów animację', 'Rysunek schematyczny — pozycje orientacyjne.']) expect([l, t(k)]).not.toEqual([l, k]);
    }
  });
  test('poseBetween: druga podpora (level) — dłonie przy pompkach zostają przy podłodze w pozach pośrednich; na klatkach bez poprawki', () => {
    const f = fig('Push Up'); expect(f.level).toBe('hand');
    for (let s = 1; s < 8; s++) expect(Math.abs(poseBetween(f, 0, 1, s / 8).P.hand[1] - framePoints(f, 0).hand[1])).toBeLessThan(1.5);
    expect(poseBetween(f, 0, 1, 0).P).toEqual(framePoints(f, 0));
    const noLevel = { ...f, level: undefined }; expect(poseBetween(noLevel, 0, 1, 0.5).p).toEqual(lerpPose(f.frames[0].p, f.frames[1].p, 0.5));
  });
  test('poseBetween: lift — przy wykroku w tył figura unosi się zamiast wchodzić stopą pod podłogę; bez lift punkt schodzi poniżej', () => {
    const f = fig('Reverse Lunge'); expect(f.lift).toBe(true);
    const lows = (g: Figure) => [1, 2, 3].map(s => Math.min(...Object.values(poseBetween(g, 0, 1, s / 8).P).map(q => q[1])));
    for (const v of lows(f)) expect(v).toBeGreaterThanOrEqual(-1e-9);
    expect(Math.min(...lows({ ...f, lift: false }))).toBeLessThan(0);
  });
  test('figureFrames, figureAt, toSvg, svgPath', () => {
    const f = fig('Back Squat'); const { shapes: S, box } = figureFrames(f);
    expect(S.length).toBe(2); expect(box.w).toBeGreaterThan(0);
    expect(figureAt(f, 0)).toEqual(S[0]);
    expect(figureAt(f, ANIM.moveMs + ANIM.holdMs)).toEqual(S[1]);
    expect(toSvg([box.x, box.y], box)).toEqual([0, Math.round(box.h * 10) / 10]);
    expect(svgPath([[box.x, box.y + box.h], [box.x + 1, box.y + box.h]], box, true)).toBe('M0 0 L1 0 Z');
  });
});

describe('komponent ExerciseFigure', () => {
  const pathsOf = () => screen.UNSAFE_root.findAll((n: { props: Record<string, unknown> }) => typeof n.props.d === 'string' && n.props.strokeLinecap === 'round').map((n: { props: Record<string, unknown> }) => n.props.d as string);
  test('animacja: pętla zmienia rysunek; pauza zatrzymuje (statyczne pozycje z podpisami), wznowienie wraca — WCAG 2.2.2', async () => {
    jest.useFakeTimers(); setReduce(false);
    render(<ExerciseFigure exercise={lib('Back Squat')} />); await flush();
    expect(screen.getByTestId('exercise-figure-anim')).toBeTruthy();
    const d0 = pathsOf().join();
    await act(async () => { jest.advanceTimersByTime(ANIM.holdMs + ANIM.moveMs / 2); });
    expect(pathsOf().join()).not.toBe(d0);
    const btn = screen.getByRole('button', { name: 'Zatrzymaj animację' });
    expect(btn).toBeTruthy(); fireEvent.press(btn);
    expect(screen.queryByTestId('exercise-figure-anim')).toBeNull();
    expect(screen.getByTestId('exercise-figure-static')).toBeTruthy();
    expect(screen.getByText('Pozycja wyjściowa')).toBeTruthy(); expect(screen.getByText('Pozycja końcowa')).toBeTruthy();
    const dp = pathsOf().join(); await act(async () => { jest.advanceTimersByTime(3000); }); expect(pathsOf().join()).toBe(dp);
    fireEvent.press(screen.getByRole('button', { name: 'Wznów animację' }));
    expect(screen.getByTestId('exercise-figure-anim')).toBeTruthy();
    expect(loopMs(2)).toBeGreaterThan(0); /* pętla trwa w nieskończoność (> 5 s) — dlatego przycisk pauzy jest zawsze przy animacji */
  });
  test('Ogranicz ruch włączone → statyczne pozycje obok siebie, bez animacji i bez przycisku pauzy', async () => {
    jest.useFakeTimers(); setReduce(true);
    render(<ExerciseFigure exercise={lib('Push Press')} />); await flush();
    expect(screen.queryByTestId('exercise-figure-anim')).toBeNull();
    for (const n of ['start', 'mid', 'end']) expect(screen.getByTestId(`exercise-figure-frame-${n}`)).toBeTruthy();
    expect(screen.getByText('W trakcie')).toBeTruthy();
    expect(screen.queryByRole('button', { name: 'Zatrzymaj animację' })).toBeNull();
    const d = pathsOf().join(); await act(async () => { jest.advanceTimersByTime(5000); }); expect(pathsOf().join()).toBe(d);
  });
  test('zmiana ustawienia „Ogranicz ruch” w trakcie — animacja się zatrzymuje; przed odczytem ustawienia — statycznie', async () => {
    setReduce('never');
    const { unmount } = render(<ExerciseFigure exercise={lib('Back Squat')} />); await flush();
    expect(screen.getByTestId('exercise-figure-static')).toBeTruthy(); unmount();
    setReduce(false);
    render(<ExerciseFigure exercise={lib('Back Squat')} />); await flush();
    expect(screen.getByTestId('exercise-figure-anim')).toBeTruthy();
    const call = AI.addEventListener.mock.calls.filter((c: unknown[]) => c[0] === 'reduceMotionChanged').pop();
    await act(async () => { (call![1] as (v: boolean) => void)(true); });
    expect(screen.queryByTestId('exercise-figure-anim')).toBeNull();
    expect(screen.getByTestId('exercise-figure-static')).toBeTruthy();
  });
  test('błąd odczytu ustawienia — animacja z przyciskiem pauzy; odpięcie słuchacza przy odmontowaniu', async () => {
    AI.isReduceMotionEnabled.mockImplementation(() => Promise.reject(new Error('x')));
    const remove = jest.fn(); AI.addEventListener.mockImplementation(() => ({ remove }));
    const { unmount } = render(<ExerciseFigure exercise={lib('Back Squat')} />); await flush();
    expect(screen.getByRole('button', { name: 'Zatrzymaj animację' })).toBeTruthy();
    unmount(); expect(remove).toHaveBeenCalled();
  });
  test('pozycja statyczna jednej klatki (deska) — bez podpisu klatki i bez pauzy; ćwiczenie bez figury → nic', async () => {
    setReduce(false);
    render(<ExerciseFigure exercise={lib('Plank')} />); await flush();
    expect(screen.getByTestId('exercise-figure-frame-start')).toBeTruthy();
    expect(screen.queryByText('Pozycja wyjściowa')).toBeNull();
    expect(screen.queryByRole('button', { name: 'Zatrzymaj animację' })).toBeNull();
    expect(screen.getByText('Rysunek schematyczny — pozycje orientacyjne.')).toBeTruthy();
    render(<ExerciseFigure exercise={lib('Crunch')} />);
    expect(screen.toJSON()).toBeNull();
    render(<ExerciseFigure exercise={{ lib: false }} />);
    expect(screen.toJSON()).toBeNull();
  });
  test('VoiceOver: jeden obraz z opisem ruchu; po angielsku etykiety w języku interfejsu', async () => {
    setReduce(true);
    render(<ExerciseFigure exercise={lib('Deadlift (sztanga)')} />); await flush();
    const img = screen.getByTestId('exercise-figure-image');
    expect(img.props.accessibilityRole).toBe('image'); expect(img.props.accessible).toBe(true);
    expect(img.props.accessibilityLabel).toBe(figureLabel('Deadlift (sztanga)', 'pl'));
    applyLang('en'); setReduce(false);
    render(<ExerciseFigure exercise={lib('Deadlift (sztanga)')} />); await flush();
    expect(screen.getAllByTestId('exercise-figure-image').pop()!.props.accessibilityLabel).toMatch(/^Movement drawing: /);
    expect(screen.getByRole('button', { name: 'Pause animation' })).toBeTruthy();
  });
  test.each([['light', light], ['dark', dark]] as const)('kolory z motywu (%s): ciało = tekst, dalsza strona = muted, ciężar = akcent, podłoga = linia', async (mode, th) => {
    jest.spyOn(RN, 'useColorScheme').mockImplementation((() => mode) as never); setReduce(true);
    render(<ExerciseFigure exercise={lib('Deadlift (sztanga)')} />); await flush();
    const strokes = new Set(screen.UNSAFE_root.findAll((n: { props: Record<string, unknown> }) => typeof n.props.stroke === 'string').map((n: { props: Record<string, unknown> }) => n.props.stroke as string));
    for (const c of [th.text, th.muted, th.accent, th.line]) expect([mode, c, strokes.has(c)]).toEqual([mode, c, true]);
    expect(screen.getByText('Pozycja wyjściowa').props.style.color).toBe(th.muted);
  });
  test.each(['Back Squat', 'Bench Press (sztanga)', 'Lateral Raise (hantle)', 'Pull Up', 'Plank'])('zrzut SVG (statycznie, jasny motyw): %s', async k => {
    jest.spyOn(RN, 'useColorScheme').mockImplementation((() => 'light') as never); setReduce(true);
    render(<ExerciseFigure exercise={lib(k)} />); await flush();
    expect(screen.toJSON()).toMatchSnapshot();
  });
  test('useReduceMotion: null przed odczytem, potem wartość systemu', async () => {
    setReduce(true); let seen: (boolean | null)[] = [];
    function Probe() { seen.push(useReduceMotion()); return null; }
    render(<Probe />); expect(seen[0]).toBeNull(); await flush(); expect(seen[seen.length - 1]).toBe(true);
    seen = [];
  });
});

describe('sekcja „Technika” z figurą', () => {
  test('po rozwinięciu figura jest nad tekstem wskazówek; ćwiczenie z listy otwartej figur — same wskazówki', async () => {
    setReduce(true);
    render(<ExerciseCues exercise={lib('Back Squat')} />);
    expect(screen.queryByTestId('exercise-figure')).toBeNull();
    fireEvent.press(screen.getByRole('button', { name: 'Technika' })); await flush();
    expect(screen.getByTestId('exercise-figure')).toBeTruthy();
    const json = JSON.stringify(screen.toJSON());
    expect(json.indexOf('exercise-figure')).toBeLessThan(json.indexOf('["Ustawienie"]'));
    expect(json.indexOf('["Ustawienie"]')).toBeGreaterThan(0);
    render(<ExerciseCues exercise={lib('Crunch')} />);
    fireEvent.press(screen.getByRole('button', { name: 'Technika' })); await flush();
    expect(screen.queryByTestId('exercise-figure')).toBeNull();
    expect(screen.getByRole('header', { name: 'Ruch' })).toBeTruthy();
  });
});

describe('dokument figur (generowany)', () => {
  test('docs/research/28-figury.md aktualny i dane poprawne (scripts/figures/gen.mjs --check)', () => {
    expect(() => execFileSync('node', [path.join(root, 'scripts/figures/gen.mjs'), '--check'], { stdio: 'pipe' })).not.toThrow();
    const doc = fs.readFileSync(path.join(root, 'docs/research/28-figury.md'), 'utf8');
    for (const k of KEYS) expect(doc).toContain(`### ${k}`);
    for (const k of Object.keys(FIG_DATA.open)) expect(doc).toContain(`| ${k} |`);
    expect(doc).toContain('Uproszczenie ilustracyjne');
  });
  test('verify uruchamia sprawdzenie dokumentu figur', () => {
    const pkg = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));
    expect(pkg.scripts['check:figures']).toBe('node scripts/figures/gen.mjs --check');
    expect(pkg.scripts.verify).toContain('npm run check:figures');
  });
});
