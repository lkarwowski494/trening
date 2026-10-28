/*
 * Walidator figur v1: reguły PODPARCIA i POMPEK (niezależna recenzja figur 3a i pełna, 28.10.2026; decyzja właściciela 28.10.2026 „poprawić przed 1.0”).
 * Luka kryteriów roli 06: mierzyły ślizg i przenikanie, nie podparcie. Reguły (tests/helpers/figury-podparcie.ts, liczby w LIM):
 *  1. gdy stopa krokowa jest w powietrzu, rzut biodra leży nad podstawą podparcia ± 10 j.;
 *  2. w takim odcinku biodro w kierunku animacji nie obniża się o więcej niż LIM.hipDrop;
 *  3. pompki: w dolnej pozycji bark ≤ 10 j. od dłoni w poziomie, tułów nie wchodzi w podłoże ani blat.
 * Uruchamiane na WSZYSTKICH figurach v1 z data/zrodla/figures.json (także ukrytych po recenzji), nie tylko na wyświetlanych.
 * Rodzaje (docs/20): niezmienniki (wszystkie figury), regresja („było” = dane sprzed poprawki, liczby z silnika), logika reguł (figury syntetyczne), dane.
 */
import * as fs from 'fs';
import * as path from 'path';
import { resolveFigure, framePoints, poseBetween, type FigDef, type Figure, type Points } from '../lib/figures/geom';
import { LIM, contacts, base, steppingFeet, podparcie, podparcieMiary, pompki, jestPompka, penetration, surface, transitions } from './helpers/figury-podparcie';

const SRC: { exercises: Record<string, FigDef> } = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/zrodla/figures.json'), 'utf8'));
const fig = (k: string, defs: Record<string, FigDef> = SRC.exercises): Figure => { const f = resolveFigure(defs, k); if (!f) throw new Error(`brak figury ${k}`); return f; };
const KEYS = Object.keys(SRC.exercises).filter(k => resolveFigure(SRC.exercises, k));
const r1 = (v: number) => Math.round(v * 10) / 10;

/** Pięć figur z recenzji niezależnej 28.10.2026: poprawione klatkami (Reverse Lunge — znany wyjątek, zob. niżej). */
const POPRAWIONE = ['Lunges (hantle)', 'Walking Lunges', 'Step Up', 'Incline Push Up'];
/**
 * Znany wyjątek: Reverse Lunge nie da się poprawnie oddać 3 pozycjami silnika v1 (wolna tylna stopa musi przejść łukiem w powietrzu — łuk wymaga pozycji
 * z ugiętym kolanem w połowie zamachu, a poza start → mid → end interpoluje kąty liniowo; każde ułożenie albo sunie palcami po podłodze, albo obniża biodro
 * przy stopie w powietrzu). Wymaga czwartej pozycji w silniku (opis kosztu: docs/18, wpis z 28.10.2026). Test niżej pilnuje, że wyjątek jest nadal prawdziwy.
 */
const WYJATKI = ['Reverse Lunge'];

describe('dane: zbiór figur objętych regułami', () => {
  test('wszystkie figury v1 ze źródeł (≥ 60); figury z krokiem (stopa krokowa) to wykroki, Step Up, Bird Dog, Mountain Climbers; pompki to Push Up i Incline Push Up', () => {
    expect(KEYS.length).toBeGreaterThanOrEqual(60);
    expect(KEYS.filter(k => steppingFeet(fig(k)).length).sort()).toEqual(['Bird Dog', 'Lunges (hantle)', 'Mountain Climbers', 'Reverse Lunge', 'Step Up', 'Walking Lunges']);
    expect(KEYS.filter(k => jestPompka(fig(k))).sort()).toEqual(['Incline Push Up', 'Push Up']);
  });
});

describe('niezmiennik: podparcie na wszystkich figurach v1', () => {
  test('żadna figura (poza znanym wyjątkiem) nie łamie reguły podparcia w żadnej pozie pośredniej (co 0,05)', () => {
    const bad: string[] = [];
    for (const k of KEYS) if (!WYJATKI.includes(k)) for (const m of podparcie(fig(k))) bad.push(`${k}: ${m}`);
    expect(bad).toEqual([]);
  });
  test('znany wyjątek jest nadal prawdziwy: Reverse Lunge łamie regułę (po poprawce zdjąć z WYJATKI)', () => {
    for (const k of WYJATKI) expect([k, podparcie(fig(k)).length > 0]).toEqual([k, true]);
  });
  test('reguła łapie wyłącznie wykroki z recenzji: poza pięcioma figurami z recenzji nie łapie nic (Bird Dog, Mountain Climbers, Pistol Squat, martwe ciągi, wiosłowania, mostki — czyste)', () => {
    const hit = KEYS.filter(k => podparcie(fig(k)).length > 0);
    expect(hit).toEqual(WYJATKI);
  });
  test('pompki (Push Up, Incline Push Up): bark ≤ 10 j. od dłoni w dolnej pozycji, brak przenikania w podłoże i blat', () => {
    for (const k of KEYS.filter(x => jestPompka(fig(x)))) expect([k, pompki(fig(k))]).toEqual([k, []]);
  });
});

/* ---------- Regresja: dane sprzed poprawki (stan df28c66f, „było”) łamią reguły — reguła naprawdę łapie wady z recenzji ---------- */
const TORSO = { q: 'horiz', a: 'hip', b: 'shoulder', eq: 90, tol: 8, c: 'lunge.torso' } as const;
const LUNGE_OLD: Record<string, FigDef> = {
  L: {
    anchor: 'toe2', props: [{ k: 'db', at: 'hand' }, { k: 'db', at: 'hand2' }],
    frames: [
      { n: 'start', p: { t: 90, hip: 0, knee: 0, sh: 0, el: 0 }, why: [{ q: 'line', pts: ['shoulder', 'hip', 'ankle'], tol: 6, c: 'lunge.dbSetup' }] },
      { n: 'mid', p: { t: 85, hip: [55, 10], knee: [94, 5], ft: [-7, 0], sh: 0, el: 0 }, why: [TORSO] },
      { n: 'end', p: { t: 90, hip: [80, -3], knee: [110, 102], ft: [0, -80], sh: 0, el: 0 }, why: [{ q: 'low', a: 'knee2', y: 0, tol: 8, c: 'lunge.fwd' }, TORSO] },
    ],
  },
  STEP: {
    anchor: 'toe', props: [{ k: 'rect', x: -2, y: 0, w: 34, h: 26 }, { k: 'db', at: 'hand' }, { k: 'db', at: 'hand2' }],
    frames: [
      { n: 'start', p: { t: 90, hip: [90, 12], knee: [110, 13], ft: [0, 0], sh: 0, el: 0 }, why: [TORSO], at: [12, 26] },
      { n: 'mid', p: { t: 90, hip: [62, -8], knee: [61, 59], ft: [0, -48], sh: 0, el: 0 }, why: [TORSO], at: [12, 26] },
      { n: 'end', p: { t: 90, hip: [0, 60], knee: [0, 90], ft: [0, -20], sh: 0, el: 0 }, why: [TORSO], at: [12, 26] },
    ],
  },
  INCLINE: {
    anchor: 'toe', level: 'hand', props: [{ k: 'rect', x: 8, y: 0, w: 16, h: 30 }],
    frames: [
      { n: 'start', p: { t: 49, hip: 0, knee: 0, ft: -43, sh: 39, el: 0 }, why: [TORSO], at: [-30, 0] },
      { n: 'mid', p: { t: 35, hip: 0, knee: 0, ft: -59, sh: -22, el: 82 }, why: [TORSO], at: [-30, 0] },
      { n: 'end', p: { t: 23, hip: 0, knee: 0, ft: -72, sh: -44, el: 76 }, why: [TORSO], at: [-30, 0] },
    ],
  },
};
const maxNadmiar = (f: Figure) => Math.max(0, ...podparcieMiary(f).map(m => m.nadmiar));

describe('regresja: wady z recenzji niezależnej 28.10.2026 odtworzone na danych sprzed poprawki (czerwone przed, zielone po)', () => {
  test('Lunges (hantle) / Walking Lunges — było: ciało opada do wykroku przy przedniej stopie w powietrzu (biodro 24 j. przed jedyną podporą, opadanie 11+ j.)', () => {
    const f = fig('L', LUNGE_OLD); const m = podparcieMiary(f);
    expect(m.some(x => /poza podporą/.test(x.opis))).toBe(true);
    const far = Math.max(...transitions(f)[1].map(s => s.P.hip[0] - base(f, s.P)![1]));
    expect(r1(far)).toBeGreaterThan(20); /* było 24,2 j. */
    for (const k of ['Lunges (hantle)', 'Walking Lunges']) expect([k, podparcie(fig(k))]).toEqual([k, []]);
  });
  test('Step Up — było: biodro 19,5 j. za piętą jedynej podpory (skrzynia), tylna noga w powietrzu od k = 0,1', () => {
    const f = fig('STEP', LUNGE_OLD); const m = podparcieMiary(f);
    expect(Math.max(...m.map(x => x.nadmiar))).toBeGreaterThan(5);
    const behind = Math.max(...transitions(f)[0].map(s => (framePoints(f, 0).heel[0]) - s.P.hip[0]));
    expect(r1(behind)).toBeGreaterThan(17); /* było 19,5 j. za piętą */
    expect(podparcie(fig('Step Up'))).toEqual([]);
  });
  test('Reverse Lunge — było i jest: biodro opada ok. 20 j. przy tylnej stopie w powietrzu (znany wyjątek, wymaga czwartej pozycji)', () => {
    const f = fig('Reverse Lunge'); const m = podparcieMiary(f);
    expect(m.some(x => /biodro opada o 2\d/.test(x.opis))).toBe(true);
  });
  test('Incline Push Up — było: bark 28 j. przed dłonią w dolnej pozycji i tułów 2,3 j. w blacie; jest: bark ≤ 10 j., bez przenikania', () => {
    const old = fig('INCLINE', LUNGE_OLD); const P = framePoints(old, 2);
    expect(r1(Math.abs(P.shoulder[0] - P.hand[0]))).toBeGreaterThan(25);
    expect(pompki(old).length).toBeGreaterThan(0);
    const now = fig('Incline Push Up'); const Q = framePoints(now, 2);
    expect(Math.abs(Q.shoulder[0] - Q.hand[0])).toBeLessThanOrEqual(LIM.shoulderHand);
    expect(pompki(now)).toEqual([]);
  });
});

/* ---------- Scenariusze nowych póz (to, co widzi użytkownik) ---------- */
describe('scenariusz: wykrok — krok postawiony, potem opuszczenie; Step Up — ciężar na nodze ze skrzyni; Incline Push Up — klatka do krawędzi', () => {
  test.each(['Lunges (hantle)', 'Walking Lunges'])('%s: w pozycji „w trakcie” przednia stopa płasko na podłodze, biodra wysoko (≥ 40 j.), tylne palce na podłodze; w dolnej pozycji tylne kolano tuż nad podłogą', k => {
    const f = fig(k); const M = framePoints(f, 1), E = framePoints(f, 2);
    expect([k, Math.abs(M.heel[1]) <= 1, Math.abs(M.toe[1]) <= 1, M.hip[1] >= 40, Math.abs(M.toe2[1]) <= 1]).toEqual([k, true, true, true, true]);
    expect(E.knee2[1]).toBeLessThanOrEqual(8);
    expect(Math.abs(M.toe[0] - E.toe[0])).toBeLessThanOrEqual(2); /* przednia stopa stoi w miejscu między „w trakcie” a końcem */
  });
  test('Step Up: w pozycji „w trakcie” noga zakroczna oderwana od podłogi, biodro wysoko, stopa na skrzyni; przejście start → mid: biodro rośnie', () => {
    const f = fig('Step Up'); const M = framePoints(f, 1);
    expect(Math.min(M.heel2[1], M.toe2[1])).toBeGreaterThan(LIM.airborne);
    expect(M.heel[1]).toBeCloseTo(26, 0);
    const ys = transitions(f)[0].map(s => s.P.hip[1]); expect(ys[ys.length - 1]).toBeGreaterThan(ys[0] + 15);
  });
  test('Incline Push Up: dłoń na wierzchu podwyższenia w całym ruchu (±1,5 j.), w dolnej pozycji ramię zgięte ≥ 80°, klatka (bark) nie wyżej niż 14 j. nad blatem', () => {
    const f = fig('Incline Push Up'); const rect = f.props.find(p => p.k === 'rect') as { x: number; y: number; w: number; h: number };
    for (const row of transitions(f)) for (const s of row) { expect(Math.abs(s.P.hand[1] - (rect.y + rect.h))).toBeLessThanOrEqual(1.5); expect(s.P.hand[0]).toBeGreaterThanOrEqual(rect.x); expect(s.P.hand[0]).toBeLessThanOrEqual(rect.x + rect.w); }
    const E = framePoints(f, 2); expect(E.shoulder[1] - (rect.y + rect.h)).toBeLessThanOrEqual(14);
    expect((f.frames[2].p as { el: number }).el).toBeGreaterThanOrEqual(80);
  });
});

/* ---------- Logika reguł na figurach syntetycznych (każdy przypadek: spełniona i niespełniona) ---------- */
describe('logika reguł (figury syntetyczne)', () => {
  test('powierzchnia i styki: podłoga, wierzch skrzyni, punkt nad skrzynią poza zasięgiem; podstawa = przedział x styków; zwis bez styku → null', () => {
    const f = fig('Step Up'); const P = framePoints(f, 0);
    expect(surface(f, [10, 40])).toBe(26); expect(surface(f, [-10, 40])).toBe(0); expect(surface(f, [10, 5])).toBe(0 + 0); /* punkt poniżej wierzchu skrzyni: podłoga */
    expect(contacts(f, P).sort()).toEqual(expect.arrayContaining(['heel', 'toe', 'heel2', 'toe2']));
    expect(base(f, P)![0]).toBeLessThan(base(f, P)![1]);
    const hang = fig('Pull Up'); expect(base(hang, framePoints(hang, 0))).toBeNull();
  });
  test('stopa krokowa: dotyka podłoża w pozie kluczowej i bywa w powietrzu; wolna noga w całym ruchu (Pistol Squat) i stopa na maszynie (Leg Press) — nie', () => {
    expect(steppingFeet(fig('Lunges (hantle)')).length).toBe(1);
    expect(steppingFeet(fig('Pistol Squat')).length).toBe(0);
    expect(steppingFeet(fig('Leg Press')).length).toBe(0);
  });
  test('penetration: punkt wewnątrz prostokąta i pod podłogą liczy się; poza — 0', () => {
    const f = fig('Step Up'); const P = poseBetween(f, 0, 1, 0).P;
    const inside: Points = { ...P, hip: [10, 13], shoulder: [10, 14] };
    expect(penetration(f, inside)).toBeGreaterThan(5);
    const clear: Points = { ...P, hip: [-30, 40], shoulder: [-30, 70], knee: [-20, 20], ankle: [-30, 4], toe: [-20, 0], heel: [-33, 0], head: [-30, 80], elbow: [-30, 50], hand: [-30, 40] };
    expect(penetration(f, clear)).toBeLessThan(1e-9);
  });
  test('LIM: liczby reguł w jednym miejscu (tolerancja podparcia 10 j., bark–dłoń 10 j., styk 1,5 j., stopa w powietrzu 2 j.)', () => {
    expect([LIM.comTol, LIM.shoulderHand, LIM.contact, LIM.airborne, LIM.penetration, LIM.step]).toEqual([10, 10, 1.5, 2, 1, 0.05]);
    expect(LIM.hipDrop).toBeGreaterThanOrEqual(3); expect(LIM.hipDrop).toBeLessThanOrEqual(8);
  });
  test('maxNadmiar poprawionych figur = 0, wyjątku > 0', () => {
    for (const k of POPRAWIONE) expect([k, maxNadmiar(fig(k))]).toEqual([k, 0]);
    expect(maxNadmiar(fig('Reverse Lunge'))).toBeGreaterThan(0);
  });
});
