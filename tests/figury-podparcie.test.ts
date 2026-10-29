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
import { resolveFigure, framePoints, poseBetween, jointAngles, type FigDef, type Figure, type Points } from '../lib/figures/geom';
import { FIG_DATA } from '../lib/figures';
import { LIM, contacts, base, steppingFeet, podparcie, podparcieMiary, jednaPodpora, srodekCiezkosci, pompki, jestPompka, penetration, surface, transitions } from './helpers/figury-podparcie';

const SRC: { exercises: Record<string, FigDef> } = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/zrodla/figures.json'), 'utf8'));
const fig = (k: string, defs: Record<string, FigDef> = SRC.exercises): Figure => { const f = resolveFigure(defs, k); if (!f) throw new Error(`brak figury ${k}`); return f; };
const KEYS = Object.keys(SRC.exercises).filter(k => resolveFigure(SRC.exercises, k));
const r1 = (v: number) => Math.round(v * 10) / 10;

/** Figury poprawione klatkami po recenzji niezależnej 28.10.2026 i w 1.0.1 (Reverse Lunge — czwarta pozycja silnika v1, 29.10.2026). */
const POPRAWIONE = ['Lunges (hantle)', 'Walking Lunges', 'Step Up', 'Incline Push Up', 'Reverse Lunge'];
/**
 * Figury łamiące regułę podparcia MUSZĄ być ukryte w docs/research/figury-recenzja.json. Po poprawce w 1.0.1 (czwarta pozycja: łuk tylnej stopy) lista jest pusta:
 * Reverse Lunge spełnia regułę, ale zostaje ukryty do niezależnej recenzji bramki 4 (L-047) — zob. test „poprawione w 1.0.1” niżej.
 */
const UKRYTE_Z_WADA: string[] = [];
const REC: { v1: Record<string, { werdykt: string; stan?: string }> } = JSON.parse(fs.readFileSync(path.join(__dirname, '../docs/research/figury-recenzja.json'), 'utf8'));


describe('dane: zbiór figur objętych regułami', () => {
  test('wszystkie figury v1 ze źródeł (≥ 60); figury z krokiem (stopa krokowa) to wykroki, Step Up, Bird Dog, Mountain Climbers; pompki to Push Up i Incline Push Up', () => {
    expect(KEYS.length).toBeGreaterThanOrEqual(60);
    expect(KEYS.filter(k => steppingFeet(fig(k)).length).sort()).toEqual(['Bird Dog', 'Lunges (hantle)', 'Mountain Climbers', 'Reverse Lunge', 'Step Up', 'Walking Lunges']);
    expect(KEYS.filter(k => jestPompka(fig(k))).sort()).toEqual(['Incline Push Up', 'Push Up']);
  });
});

describe('niezmiennik: podparcie na wszystkich figurach v1', () => {
  test('żadna figura (poza ukrytą z wadą) nie łamie reguły podparcia w żadnej pozie pośredniej (co 0,05)', () => {
    const bad: string[] = [];
    for (const k of KEYS) if (!UKRYTE_Z_WADA.includes(k)) for (const m of podparcie(fig(k))) bad.push(`${k}: ${m}`);
    expect(bad).toEqual([]);
  });
  test('jedna podpora (stopa podporowa stoi całą podeszwą, druga w powietrzu): rzut środka ciężkości w obrębie stopy ± 2,5 j. w każdej pozie — wszystkie figury poza ukrytą z wadą', () => {
    const bad: string[] = [];
    for (const k of KEYS) if (!UKRYTE_Z_WADA.includes(k)) for (const m of jednaPodpora(fig(k))) bad.push(`${k}: ${m.opis}`);
    expect(bad).toEqual([]);
  });
  test('każda figura łamiąca regułę podparcia jest ukryta (werdykt „ukryta”, poza plikiem runtime); poprawione w 1.0.1 są albo ukryte do recenzji, albo mają recenzję niezależną (autor ≠ recenzent)', () => {
    for (const k of UKRYTE_Z_WADA) expect([k, podparcie(fig(k)).length > 0, REC.v1[k].werdykt, k in FIG_DATA.exercises, FIG_DATA.open.includes(k)]).toEqual([k, true, 'ukryta', false, true]);
    for (const k of KEYS) if (podparcie(fig(k)).length > 0) expect([k, REC.v1[k]?.werdykt]).toEqual([k, 'ukryta']);
    for (const k of POPRAWIONE) {
      const e = REC.v1[k] as { werdykt: string; autor?: string; recenzent?: string };
      if (e.werdykt === 'ukryta') expect([k, k in FIG_DATA.exercises, FIG_DATA.open.includes(k)]).toEqual([k, false, true]);
      else expect([k, e.werdykt, !!e.recenzent && e.recenzent !== e.autor]).toEqual([k, 'wyswietlana', true]);
    }
  });
  test('reguła nie łapie nic na aktualnych danych (Bird Dog, Mountain Climbers, Pistol Squat, martwe ciągi, wiosłowania, mostki, wykroki po poprawkach — czyste)', () => {
    const hit = KEYS.filter(k => podparcie(fig(k)).length > 0);
    expect(hit).toEqual([]);
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
  STEP1: {
    anchor: 'toe', props: [{ k: 'rect', x: -2, y: 0, w: 34, h: 26 }, { k: 'db', at: 'hand' }, { k: 'db', at: 'hand2' }],
    frames: [
      { n: 'start', p: { t: 87, hip: [89, -3], knee: [117.4, 8.7], ft: [0, 0], sh: 0, el: 0 }, why: [TORSO], at: [12, 26] },
      { n: 'mid', p: { t: 84, hip: [3, -1.3], knee: [3.6, 61], ft: [0, -83], sh: 0, el: 0 }, why: [TORSO], at: [12, 26] },
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
const REVERSE_OLD: Record<string, FigDef> = {
  R: { anchor: 'toe', lift: true, frames: [
    { n: 'start', p: { t: 90, hip: 0, knee: 0, sh: 0, el: 0 }, why: [] },
    { n: 'mid', p: { t: 90, hip: [12, -12], knee: [12, 75], ft: [0, -117], sh: 0, el: 0 }, why: [] },
    { n: 'end', p: { t: 90, hip: [80, -3], knee: [110, 102], ft: [0, -80], sh: 0, el: 0 }, why: [] }] },
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
  test('Step Up (poprawka 1 z 28.10.2026, odrzucona przez recenzję po poprawce) — było: środek ciężkości 6,5–7,4 j. za piętą stopy na skrzyni aż do k ≈ 0,7, biodro cofa się; walidator z tolerancją 10 j. dla biodra przepuszczał', () => {
    const f = fig('STEP1', LUNGE_OLD); expect(podparcie(f)).toEqual([]); /* stara reguła (biodro ±10 j.) przepuszcza */
    const m = jednaPodpora(f); expect(m.length).toBeGreaterThan(5);
    const heel = framePoints(f, 0).heel[0], behind = Math.max(...transitions(f)[0].map(x => heel - srodekCiezkosci(x.P)[0]));
    expect(r1(behind)).toBeGreaterThan(6.5);
  });
  test('Reverse Lunge — było: biodro opada ok. 20 j. przy tylnej stopie w powietrzu (3 pozycje); jest: 4 pozycje, stopa łukiem w powietrzu, reguła spełniona', () => {
    const f = fig('R', REVERSE_OLD); const m = podparcieMiary(f);
    expect(m.some(x => /biodro opada o 2\d/.test(x.opis))).toBe(true);
    expect(podparcie(fig('Reverse Lunge'))).toEqual([]); expect(fig('Reverse Lunge').frames.length).toBe(4);
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
  test.each(['Lunges (hantle)'])('%s: w pozycji „w trakcie” przednia stopa płasko na podłodze, biodra wysoko (≥ 40 j.), tylne palce na podłodze; w dolnej pozycji tylne kolano tuż nad podłogą', k => {
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
    expect((f.frames[1].p as { t: number }).t).toBeLessThanOrEqual(70); /* tułów pochylony ≥ 20° w pozycji „w trakcie” (recenzja po poprawce) */
    for (const row of transitions(f)) for (const x of row) if (Math.min(x.P.heel2[1], x.P.toe2[1]) > LIM.airborne) expect(srodekCiezkosci(x.P)[0]).toBeGreaterThanOrEqual(framePoints(f, 0).heel[0] - LIM.comSingle);
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
    expect([LIM.comTol, LIM.shoulderHand, LIM.contact, LIM.airborne, LIM.penetration, LIM.step, LIM.comSingle, LIM.loadMass]).toEqual([10, 10, 1.5, 2, 1, 0.05, 2.5, 0.1]);
    expect(LIM.hipDrop).toBeGreaterThanOrEqual(3); expect(LIM.hipDrop).toBeLessThanOrEqual(8);
  });
  test('maxNadmiar poprawionych figur = 0, wyjątku > 0', () => {
    for (const k of POPRAWIONE) expect([k, maxNadmiar(fig(k))]).toEqual([k, 0]);
    expect(maxNadmiar(fig('R', REVERSE_OLD))).toBeGreaterThan(0);
  });
});

/* ---------- Wersja 1.0.1 (29.10.2026): czwarta pozycja i uwagi NISKIE z recenzji 28.10.2026 — niezmienniki z pomiarów, nie z oceny na oko ---------- */
const poses = (f: Figure) => transitions(f).flat();
const keyPts = (f: Figure) => f.frames.map((_, i) => framePoints(f, i));

describe('Reverse Lunge (4 pozycje): tylna stopa łukiem w powietrzu, potem lądowanie palców, dopiero potem opuszczenie', () => {
  const f = fig('Reverse Lunge'), K = keyPts(f);
  test('pozycje start → mid → mid2 → end; w „mid” stopa uniesiona ≥ 5 j. (oba punkty), w „mid2” palce tylnej stopy na podłodze (≤ 1,5 j.), w końcu palce na podłodze i kolano tuż nad nią', () => {
    expect(f.frames.map(x => x.n)).toEqual(['start', 'mid', 'mid2', 'end']);
    expect(Math.min(K[1].toe2[1], K[1].heel2[1])).toBeGreaterThanOrEqual(5);
    expect(K[2].toe2[1]).toBeLessThanOrEqual(LIM.contact); expect(K[3].toe2[1]).toBeLessThanOrEqual(LIM.contact); expect(K[3].knee2[1]).toBeLessThanOrEqual(8);
  });
  test('stopa idzie łukiem: wysokość stopy w powietrzu rośnie, potem maleje do podłoża (szczyt ≥ 8 j.), a jej x cofa się monotonicznie (bez ruchu w przód > 0,5 j.)', () => {
    const tr = transitions(f).slice(0, 2).flat(); const hs = tr.map(s => Math.min(s.P.toe2[1], s.P.heel2[1])), xs = tr.map(s => s.P.toe2[0]);
    expect(Math.max(...hs)).toBeGreaterThanOrEqual(8);
    for (let i = 1; i < xs.length; i++) expect(xs[i]).toBeLessThanOrEqual(xs[i - 1] + 0.5);
  });
  test('palce tylnej stopy po lądowaniu stoją w miejscu (mid2 → end: dryf ≤ 3 j. — ograniczenie interpolacji kątów, do oceny recenzenta), przednia stopa nie rusza się (≤ 0,5 j.)', () => {
    const row = transitions(f)[2]; const A = row[0].P;
    for (const s of row) { expect(Math.abs(s.P.toe2[0] - A.toe2[0])).toBeLessThanOrEqual(3); expect(Math.abs(s.P.toe[0] - A.toe[0])).toBeLessThanOrEqual(0.5); }
  });
  test('w całym ruchu biodro nie opada o więcej niż LIM.hipDrop, dopóki stopa jest w powietrzu (reguła) i figura nie wchodzi pod podłogę', () => {
    expect(podparcie(f)).toEqual([]); expect(jednaPodpora(f)).toEqual([]);
    for (const s of poses(f)) expect(penetration(f, s.P)).toBeLessThanOrEqual(LIM.penetration);
  });
});

describe('Walking Lunges (4 pozycje): krok drugą nogą', () => {
  const f = fig('Walking Lunges'), K = keyPts(f);
  test('na początku przednia jest noga bliższa (jej palce dalej w przód od dalszej), na końcu dalsza — nogi zamieniają role; stopa bliższa stoi w miejscu cały ruch (palce przy podłożu ±1 j.)', () => {
    expect(f.frames.map(x => x.n)).toEqual(['start', 'mid', 'mid2', 'end']);
    expect(K[0].toe[0] - K[0].toe2[0]).toBeGreaterThanOrEqual(35); expect(K[3].toe2[0] - K[3].toe[0]).toBeGreaterThanOrEqual(35);
    for (const s of poses(f)) if (s.P.toe[1] <= LIM.contact) expect(Math.abs(s.P.toe[0] - K[0].toe[0])).toBeLessThanOrEqual(1);
  });
  test('dalsza stopa przechodzi do przodu: w „mid” w powietrzu (≥ 5 j.) obok bliższej (|Δx| ≤ 20), w „mid2” stoi na podłodze przed nią (pięta ≤ 1 j., ≥ 25 j. dalej); podparcie i jedna podpora spełnione', () => {
    expect(Math.min(K[1].toe2[1], K[1].heel2[1])).toBeGreaterThanOrEqual(5); expect(Math.abs(K[1].toe2[0] - K[1].toe[0])).toBeLessThanOrEqual(20);
    expect(K[2].heel2[1]).toBeLessThanOrEqual(1); expect(K[2].heel2[0] - K[2].toe[0]).toBeGreaterThanOrEqual(25);
    expect(podparcie(f)).toEqual([]); expect(jednaPodpora(f)).toEqual([]);
  });
  test('w pozycji końcowej i początkowej tylne kolano tuż nad podłogą (≤ 8 j.) i tylna stopa nie pionowo (kąt ≤ 72°)', () => {
    expect(K[0].knee2[1]).toBeLessThanOrEqual(8); expect(K[3].knee[1]).toBeLessThanOrEqual(8);
    expect(Math.abs((f.frames[3].p as { ft: number[] }).ft[0])).toBeLessThanOrEqual(72); expect(Math.abs((f.frames[0].p as { ft: number[] }).ft[1])).toBeLessThanOrEqual(72);
  });
});

describe('Lunges (hantle): uwagi NISKIE — tylna stopa nie pionowo, przednia stopa bez ślizgu', () => {
  const f = fig('Lunges (hantle)');
  test('w „w trakcie” tylna stopa pod kątem ≤ 72° od poziomu (było 95°, pionowo), przednia stopa przesuwa się między „w trakcie” a końcem o ≤ 1 j. (było 2,1)', () => {
    expect(Math.abs((f.frames[1].p as { ft: number[] }).ft[1])).toBeLessThanOrEqual(72);
    const row = transitions(f)[1]; const A = row[0].P; let drift = 0;
    for (const s of row) for (const n of ['toe', 'heel']) drift = Math.max(drift, Math.abs(s.P[n][0] - A[n][0]));
    expect(drift).toBeLessThanOrEqual(1);
  });
});

describe('Step Up: uwagi NISKIE — ręce z hantlami, krawędź skrzyni, ciężar w dłoniach w regule środka ciężkości', () => {
  const f = fig('Step Up'), R = f.props.find(p => p.k === 'rect') as { x: number; y: number; w: number; h: number };
  test('hantle wiszą pionowo: dłoń w poziomie ≤ 2 j. od barku w każdej pozycji kluczowej i pośredniej (było 19 j. za barkiem)', () => {
    for (const s of poses(f)) expect(Math.abs(s.P.hand[0] - s.P.shoulder[0])).toBeLessThanOrEqual(2);
  });
  test('stopa nogi zakrocznej mija krawędź skrzyni w odległości ≥ 3 j. (było 0,9 j.) i żaden odcinek nogi nie wchodzi w skrzynię', () => {
    let md = Infinity;
    for (const s of poses(f)) for (const [a, b] of [['ankle2', 'toe2'], ['ankle2', 'heel2'], ['heel2', 'toe2']] as const) for (let u = 0; u <= 1.0001; u += 0.1) {
      const q = [s.P[a][0] + (s.P[b][0] - s.P[a][0]) * u, s.P[a][1] + (s.P[b][1] - s.P[a][1]) * u]; if (q[1] <= 1) continue;
      md = Math.min(md, Math.hypot(Math.max(R.x - q[0], 0, q[0] - R.x - R.w), Math.max(R.y - q[1], 0, q[1] - R.y - R.h)));
    }
    expect(md).toBeGreaterThanOrEqual(3);
    for (const s of poses(f)) expect(penetration(f, s.P)).toBeLessThanOrEqual(LIM.penetration);
  });
  test('środek ciężkości liczy ciężar w dłoniach: z hantlami leży dalej w stronę dłoni niż bez, a reguła jednej podpory jest spełniona z tym ciężarem', () => {
    const P = keyPts(f)[1]; const bez = srodekCiezkosci(P)[0], z = srodekCiezkosci(P, f)[0];
    expect(z).not.toBeCloseTo(bez, 3); expect(Math.sign(z - bez)).toBe(Math.sign(P.hand[0] - bez));
    expect(jednaPodpora(f)).toEqual([]);
    const bezHantli = { ...f, props: f.props.filter(p => p.k === 'rect') }; expect(srodekCiezkosci(P, bezHantli)).toEqual(srodekCiezkosci(P));
  });
});

describe('Incline Push Up: uwagi NISKIE — dłoń na blacie w miejscu i przy krawędzi', () => {
  const f = fig('Incline Push Up'), R = f.props.find(p => p.k === 'rect') as { x: number; y: number; w: number; h: number };
  test('dłoń przesuwa się po blacie o ≤ 2,5 j. w całym ruchu (było 3,2) i leży ≤ 4,5 j. od krawędzi (było ok. 7), na blacie', () => {
    const xs = poses(f).map(s => s.P.hand[0]);
    expect(Math.max(...xs) - Math.min(...xs)).toBeLessThanOrEqual(2.5);
    for (const x of xs) { expect(x).toBeGreaterThanOrEqual(R.x); expect(x - R.x).toBeLessThanOrEqual(4.5); }
    expect(pompki(f)).toEqual([]);
  });
});

describe('Push Press (4 pozycje): nogi kończą wybicie, zanim ręce wyciskają; tor sztangi bez łuku', () => {
  const f = fig('Push Press'), K = keyPts(f);
  test('w „mid2” nogi wyprostowane (kolano ≤ 4°), a ręce jeszcze zgięte (łokieć ≥ 90°) — siła z nóg, ręce kończą ruch; w końcu łokcie proste', () => {
    expect(f.frames.map(x => x.n)).toEqual(['start', 'mid', 'mid2', 'end']);
    expect(Math.abs(jointAngles(f.frames[2].p, f.view).knee)).toBeLessThanOrEqual(4); expect(jointAngles(f.frames[2].p, f.view).el).toBeGreaterThanOrEqual(90);
    expect(jointAngles(f.frames[3].p, f.view).el).toBeLessThanOrEqual(4);
  });
  test('sztanga (dłoń) po ugięciu tylko wznosi się (y nie maleje > 0,5 j.) odchyla od odcinka mid2 → end o ≤ 3,5 j. w poziomie i nigdzie nie wysuwa się przed pozycję startową o więcej niż 1,5 j. (było 6,8 j. — łuk przed twarzą)', () => {
    const tr = transitions(f).slice(1).flat(); const hs = tr.map(s => s.P.hand[1]);
    for (let i = 1; i < hs.length; i++) expect(hs[i]).toBeGreaterThanOrEqual(hs[i - 1] - 0.5);
    const a = K[2].hand, b = K[3].hand; let dev = 0;
    for (const s of transitions(f)[2]) { const c = a[0] + (b[0] - a[0]) * ((s.P.hand[1] - a[1]) / (b[1] - a[1])); dev = Math.max(dev, Math.abs(s.P.hand[0] - c)); }
    expect(dev).toBeLessThanOrEqual(3.5);
    expect(Math.max(...transitions(f).flat().map(s => s.P.hand[0]))).toBeLessThanOrEqual(K[0].hand[0] + 1.5);
  });
});
