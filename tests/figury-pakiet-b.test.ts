/*
 * Pakiet B linii 1.0.1 (29.10.2026): wyciskanie leżąc — 101-05 Band Bench Press, 101-06 Chain Press, 101-07 Close Grip Bench Press, 101-08 Board Press i Pin Press.
 * L-056 A: każda poprawka figury ma dwie miary — naprawianą cechę ORAZ styk ciężar–ciało (odstęp, przenikanie; kadry co 0,05, `tests/helpers/styk-figur.ts`).
 * Wady „z main” (komentarz w V2_WSTRZYMANE): Band Bench Press — sztanga z talerzami i gumy do podłogi (katalog: guma z uchwytami przełożona pod ławką, bez sztangi);
 * Chain Press — rysunek identyczny z Bench Press with Chains (katalog: łańcuchy przypięte do uchwytów, ruch jak hantle, bez sztangi); Close Grip Bench Press — chwyt ±12 przy barkach ±19,
 * przedramię ok. 50° od pionu (karta: „na szerokość barków lub trochę węziej, nie bardzo wąsko”); Board/Pin Press — ŚREDNIE z main „bez deski i bolców”.
 */
import { distSegSeg, legRadius, GIRTH, SIDES, figureSpec, frameAt, shapesAt, sortShapes, jointAngles, checkFrame, holdChecks, BENCH, EQUIP, type Frame, type Prop, type V3 } from '@/lib/figures/v2';
import { dwieMiary, KADRY_STYKU } from './helpers/styk-figur';

const spec = (k: string) => figureSpec(k)!;
const fr = (k: string, u: number): Frame => frameAt(spec(k), u);
const props = <K extends Prop['k']>(f: Frame, k: K) => f.props.filter((p): p is Extract<Prop, { k: K }> => p.k === k);
const U = KADRY_STYKU;
const deg = (r: number) => r * 180 / Math.PI;
const forearm = (f: Frame, s: 'R' | 'L' = 'R') => { const a = f.sk.arms[s]; return { front: deg(Math.atan2(Math.abs(a.grip[2] - a.elbow[2]), Math.abs(a.grip[1] - a.elbow[1]))), sag: deg(Math.atan2(Math.abs(a.grip[0] - a.elbow[0]), Math.abs(a.grip[1] - a.elbow[1]))) }; };
const dist3 = (a: V3, b: V3) => Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);
/** Naprawiana cecha „sztanga w rysunku”: największa liczba gryfów w klatce. */
const gryfy = (k: string, kadry: readonly number[]) => Math.max(...kadry.map(u => props(fr(k, u), 'barbell').length));

describe('101-05 Band Bench Press: guma z uchwytami przełożona pod ławką, bez sztangi (katalog: „band with handles looped under the bench”)', () => {
  const K = 'Band Bench Press';
  test('dwie miary: w żadnym z 21 kadrów nie ma gryfu (cecha), a uchwyt nie przenika ciała i trzyma odstęp od tułowia i nóg (styk)', () => {
    const m = dwieMiary(K, gryfy);
    expect(m.cecha).toBe(0);
    expect(m.styk.maxPrzenikanie).toBe(0); expect(m.styk.minOdstep).toBeGreaterThan(15);
  });
  test('w każdym kadrze dwa uchwyty R i L dokładnie w dłoniach (≤ 0,6 cm), obie dłonie w tej samej wysokości; bez gryfu, talerzy i hantli', () => {
    for (const u of U) {
      const f = fr(K, u); const h = props(f, 'handle'); expect([u, h.map(x => x.side).sort()]).toEqual([u, ['L', 'R']]);
      for (const x of h) expect([u, x.side, dist3(x.c, f.sk.arms[x.side].grip) <= 0.6]).toEqual([u, x.side, true]);
      expect([u, f.props.filter(p => ['barbell', 'dumbbell', 'kettlebell', 'trapbar', 'chain'].includes(p.k)).length]).toEqual([u, 0]);
      expect([u, holdChecks(f).every(c => c.err <= c.tol)]).toEqual([u, true]);
    }
  });
  test('guma: dwa pasma od uchwytów w dół obok ławki do pętli pod ławką (poniżej siedziska, w obrysie ławki), pętla stoi w miejscu w całym ruchu', () => {
    const seat = BENCH.seatTop; const ends = new Set<string>();
    for (const u of U) {
      const f = fr(K, u); const bands = props(f, 'band').filter(b => !b.under); expect([u, bands.length]).toEqual([u, 2]);
      for (const b of bands) { expect([u, b.to[1] < seat - EQUIP.benchPad, b.to[1] < 15, Math.abs(b.to[2]) <= EQUIP.benchW / 2 + 2]).toEqual([u, true, true, true]); ends.add(b.to.map(x => x.toFixed(2)).join(',')); }
      const under = props(f, 'band').filter(b => b.under); expect([u, under.length]).toEqual([u, 1]);
      expect([u, under[0].from[2] > 0, under[0].to[2] < 0, under[0].from[1], under[0].to[1]]).toEqual([u, true, true, bands[0].to[1], bands[0].to[1]]);
    }
    expect(ends.size).toBe(2); /* po jednej stałej pętli na stronę */
  });
  test('guma przypięta do uchwytu (początek pasma = uchwyt) i napięta: na górze dłuższa niż na dole', () => {
    const len = (u: number) => { const f = fr(K, u); const h = props(f, 'handle')[0]; const b = props(f, 'band').find(x => !x.under && x.from[2] === h.c[2])!; expect(dist3(b.from, h.c)).toBeLessThan(0.01); return dist3(b.from, b.to); };
    expect(len(0)).toBeGreaterThan(len(1) + 20);
  });
  test('widoki: uchwyty widoczne z boku i z góry, odcinek pod ławką tylko z góry i za siedziskiem (zakryty przez ławkę); sztangi i talerzy brak', () => {
    for (const v of ['side', 'top'] as const) { const ids = shapesAt(spec(K), 0.5, v).map(s => s.id); expect([v, ids.includes('handleR'), ids.includes('handleL'), ids.includes('plateNear')]).toEqual([v, true, v === 'top' ? true : true, false]); }
    const top = sortShapes(shapesAt(spec(K), 0.5, 'top')); expect(top.findIndex(s => s.id === 'bandUnder')).toBeGreaterThanOrEqual(0);
    expect(top.findIndex(s => s.id === 'bandUnder')).toBeLessThan(top.findIndex(s => s.id === 'benchSeat'));
    expect(shapesAt(spec(K), 0.5, 'side').some(s => s.id === 'bandUnder')).toBe(false);
  });
  test('całość bez kolizji w 21 kadrach; sąsiednie warianty bez zmian: Reverse Band Bench Press nadal sztanga z gumą, Bench Press (sztanga) nadal bez uchwytów', () => {
    for (const u of U) expect([u, checkFrame(fr(K, u)).map(i => i.code)]).toEqual([u, []]);
    expect(props(fr('Reverse Band Bench Press', 0.5), 'barbell')).toHaveLength(1); expect(props(fr('Reverse Band Bench Press', 0.5), 'handle')).toHaveLength(0);
    expect(props(fr('Bench Press (sztanga)', 0.5), 'handle')).toHaveLength(0);
  });
  test('odtworzenie wady z main: ćwiczenie nie jest już sztangą (było: 1 gryf z talerzami i 2 gumy do podłogi pod gryfem)', () => {
    const f = fr(K, 0.5); expect(props(f, 'barbell')).toHaveLength(0); expect(f.info.bar).toBeUndefined();
  });
  test('katalog: tylko gumy i ławka płaska, bez sztangi (źródło rysunku)', () => {
    const c = (require('../docs/research/equipment/catalog.json') as { name: string; requires: string[][]; note?: string }[]).find(e => e.name === K)!;
    expect(c.requires).toEqual([['bands'], ['bench.flat']]); expect(c.note).toMatch(/handles looped under the bench/);
  });
});

describe('101-06 Chain Press: dwa uchwyty z łańcuchami, ławka płaska, ruch jak wyciskanie hantli, łokieć wynika z pozycji jak w hantlach (źródło: ok. 90°, jedno źródło szczebla 4, docs/research/1-0-1-zrodla-2026-10-29.md pkt 3; kompromis w komentarzu testu)', () => {
  const K = 'Chain Press'; const SZTANGA = 'Bench Press with Chains';
  const lez = (f: Frame, side: 1 | -1) => props(f, 'chain').find(c => c.from[1] === 0 && Math.sign(c.from[2]) === side)!;
  const zwis = (f: Frame, side: 1 | -1) => props(f, 'chain').find(c => c.from[1] > 0 && Math.sign(c.from[2]) === side)!;
  /* Kompromis (101-06, recenzja 29.10.2026): źródło („Continue until your elbow forms a 90 degree angle”) i „ta sama pozycja co wyciskanie hantli” nie dają się spełnić naraz przy dłoniach na wysokości klatki
   * (długość ramienia: przy dłoniach 18 cm od barku i 13,5 cm nad nim zgięcie łokcia wynosi ok. 127°, nie 90°). Rozstrzygnięcie recenzenta: dłonie jak w hantlach (to jest wada ŚREDNIA), a łokieć wynika z tej pozycji —
   * zgięcie na dole 127° ± 3° (dla porównania hantle 135°; szerszy rozstaw dłoni 40 zamiast 32 cm tylko zmniejsza zgięcie, przedramię zostaje pionowo). */
  const HANTLE = 'Bench Press (hantle)';
  /* Styk uchwytów liczony osobno dla każdej dłoni (kapsuła 2 cm w punkcie uchwytu): wspólna miara `stykTora` łączy uchwyty odcinkiem w poprzek ciała, a przy dłoniach na wysokości klatki
   * odcinek ten leży na tułowiu (odstęp 2 cm — artefakt miary, nie rysunku; hantle mają osobne kolidery dłoni: 19,2 cm). Odstęp powierzchnia–powierzchnia od tułowia, miednicy i nóg; ujemny = przenikanie. */
  const stykUchwytow = (k: string) => { let min = Infinity; for (const u of U) { const f = fr(k, u); for (const h of props(f, 'handle')) {
    min = Math.min(min, distSegSeg(h.c, h.c, f.sk.pelvis, f.sk.shoulderC) - 2 - GIRTH.trunkCollide, distSegSeg(h.c, h.c, f.sk.pelvis, f.sk.pelvis) - 2 - GIRTH.pelvis);
    for (const sd of SIDES) { const L = f.sk.legs[sd]; for (const [seg, a, b] of [['thigh', L.hip, L.knee], ['shank', L.knee, L.ankle]] as const) for (let i = 0; i <= 40; i++) { const t = i / 40; const q: V3 = [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t]; min = Math.min(min, distSegSeg(h.c, h.c, q, q) - 2 - legRadius(seg, t)); } }
  } } return min; };
  const dloniDol = (k: string, s: 'R' | 'L' = 'R') => { const f = fr(k, 1); return f.sk.arms[s].grip[0] - f.sk.shoulderC[0]; };
  test('101-06 (29.10.2026, recenzja): Chain Press — dłonie na dole na wysokości klatki, jak w Bench Press (hantle): różnica w osi ku stopom ≤ 3 cm (było 10 cm); druga miara: styk', () => {
    /* próg 3 cm: rozstaw uchwytów i hantli (40 vs 32 cm) nie zmienia osi ku stopom; 3 cm to około połowy grubości dłoni (BODY.hand) — różnicy poniżej nie widać na rysunku */
    const m = dwieMiary(K, (k) => Math.abs(dloniDol(k) - dloniDol(HANTLE)));
    expect(m.styk.maxPrzenikanie).toBe(0); /* wspólna miara: brak przenikania w 21 kadrach */
    expect(m.cecha).toBeLessThanOrEqual(3);
    for (const s of ['R', 'L'] as const) expect([s, Math.abs(dloniDol(K, s) - dloniDol(HANTLE, s)) <= 3]).toEqual([s, true]);
    /* wysokość dłoni nad barkiem też jak w hantlach (klatka, nie górna część brzucha) */
    expect(Math.abs((fr(K, 1).sk.arms.R.grip[1] - fr(K, 1).sk.shoulderC[1]) - (fr(HANTLE, 1).sk.arms.R.grip[1] - fr(HANTLE, 1).sk.shoulderC[1]))).toBeLessThanOrEqual(3);
    /* styk: uchwyty (w `info.load` odcinek 2 cm) nie przenikają tułowia ani nóg, odstęp > 15 cm; ławka: łokieć i dłoń nie wchodzą w siedzisko (checkFrame bez uwag) */
    expect(stykUchwytow(K)).toBeGreaterThan(15); /* dłoń w osi z 40 cm od środka, odstęp zmierzony ok. 31 cm (próg 15 cm jak w pozostałych testach rodziny); zero przenikania */
    /* łańcuch zwisa obok ławki, nie przez nią: odstęp od krawędzi ławki ≥ 5 cm w 21 kadrach */
    for (const u of U) for (const c of props(fr(K, u), 'chain')) expect([u, Math.min(Math.abs(c.from[2]), Math.abs(c.to[2])) - EQUIP.benchW / 2 >= 5]).toEqual([u, true]);
    for (const u of U) expect([u, checkFrame(fr(K, u)).map(i => i.code)]).toEqual([u, []]);
  });
  test('dwie miary: zgięcie łokcia na dole 127° ± 3° (wynika z pozycji jak w hantlach, kompromis wyżej) i uchwyty bez przenikania ciała, odstęp od ciała > 15 cm (styk)', () => {
    const m = dwieMiary(K, (k, kadry) => jointAngles(frameAt(spec(k), kadry[kadry.length - 1]).sk, 'R').elbow);
    expect(Math.abs(m.cecha - 127)).toBeLessThanOrEqual(3);
    expect(stykUchwytow(K)).toBeGreaterThan(15);
  });
  test('łokieć obu stron na dole 127° ± 3°, na górze ≤ 8° (wyprost); przedramię na dole ≤ 10° od pionu; ruch monotoniczny: zgięcie rośnie z u', () => {
    for (const s of ['R', 'L'] as const) { const e1 = jointAngles(fr(K, 1).sk, s).elbow; expect([s, Math.abs(e1 - 127) <= 3]).toEqual([s, true]); expect([s, jointAngles(fr(K, 0).sk, s).elbow <= 8]).toEqual([s, true]); const t = forearm(fr(K, 1), s); expect([s, t.front <= 10, t.sag <= 10]).toEqual([s, true, true]); }
    let prev = -1; for (const u of U) { const e = jointAngles(fr(K, u).sk, 'R').elbow; expect([u, e >= prev - 0.01]).toEqual([u, true]); prev = e; }
  });
  test('bez sztangi w żadnym kadrze; dwa uchwyty dokładnie w dłoniach; ręka nie przenika ławki ani ciała (kontrola geometrii)', () => {
    for (const u of U) { const f = fr(K, u); expect([u, props(f, 'barbell').length, props(f, 'handle').length]).toEqual([u, 0, 2]); for (const h of props(f, 'handle')) expect(dist3(h.c, f.sk.arms[h.side].grip)).toBeLessThanOrEqual(0.6); expect([u, checkFrame(f).map(i => i.code)]).toEqual([u, []]); }
  });
  test('łańcuch: zwisa pionowo z uchwytu do podłogi (x i z uchwytu), a od punktu na podłodze leży dalej po podłodze (y = 0), po jednym na uchwyt', () => {
    for (const u of U) { const f = fr(K, u); for (const sg of [1, -1] as const) {
      const z = zwis(f, sg), l = lez(f, sg); const h = props(f, 'handle').find(x => Math.sign(x.c[2]) === sg)!;
      expect([u, sg, z.from.every((v, i) => Math.abs(v - h.c[i]) < 1e-6), z.to[1], z.to[0] === h.c[0], z.to[2] === h.c[2]]).toEqual([u, sg, true, 0, true, true]);
      expect([u, sg, l.from[1], l.to[1], l.from[0] === z.to[0]]).toEqual([u, sg, 0, 0, true]);
    } expect([u, props(f, 'chain').length]).toEqual([u, 4]); }
  });
  test('na dole więcej łańcucha leży na podłodze niż u góry; w górze krótki odcinek (12 cm) nadal leży; długość łańcucha (zwis + leżący) stała w całym ruchu', () => {
    const lezy = (u: number) => { const l = lez(fr(K, u), 1); return Math.abs(l.to[0] - l.from[0]); };
    const calosc = (u: number) => { const f = fr(K, u); const z = zwis(f, 1); return z.from[1] - z.to[1] + Math.abs(lez(f, 1).to[0] - lez(f, 1).from[0]); };
    expect(lezy(0)).toBeCloseTo(BENCH.chainLieTop, 1); expect(lezy(1)).toBeGreaterThan(3 * lezy(0));
    let prev = -1; for (const u of U) { expect([u, lezy(u) >= prev - 1e-9]).toEqual([u, true]); prev = lezy(u); expect([u, Math.abs(calosc(u) - calosc(0)) < 1e-6]).toEqual([u, true]); }
  });
  test('leżąca część łańcucha nie dotyka stóp ani podudzi: odstęp ≥ 5 cm od pięty, palców, kostki i kolana w 21 kadrach', () => {
    for (const u of U) { const f = fr(K, u); for (const sg of [1, -1] as const) { const l = lez(f, sg); const L = f.sk.legs[sg > 0 ? 'R' : 'L'];
      for (const [n, pt] of [['pięta', L.heel], ['palce', L.toe], ['kostka', L.ankle], ['kolano', L.knee]] as const) expect([u, sg, n, distSegSeg(pt, pt, l.from, l.to) >= 5]).toEqual([u, sg, n, true]); } }
  });
  test('odtworzenie wady z main: rysunek nie jest już kopią Bench Press with Chains (było: identyczne klatki), a ten wariant sztangi zostaje bez zmian (gryf z łańcuchami na tulejach)', () => {
    expect(JSON.stringify(fr(K, 0.5))).not.toBe(JSON.stringify(fr(SZTANGA, 0.5)));
    const s = fr(SZTANGA, 0.5); expect(props(s, 'barbell')).toHaveLength(1); expect(props(s, 'handle')).toHaveLength(0); expect(props(s, 'chain')).toHaveLength(1);
  });
  test('widoki: uchwyty i łańcuch widoczne z boku i z góry', () => {
    for (const v of ['side', 'top'] as const) { const ids = shapesAt(spec(K), 1, v).map(s => s.id); expect([v, ids.includes('handleR'), ids.includes('chain')]).toEqual([v, true, true]); }
  });
});

