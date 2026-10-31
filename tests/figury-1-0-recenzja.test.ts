/*
 * Figury v2 w 1.0 — naprawy po niezależnej recenzji ruchu (27.10.2026; squat, bench_press, hinge). Każdy test odtwarza błąd potwierdzony NA MAIN 4b77c9f liczbą z silnika
 * (komentarz „było”) i pilnuje poprawki. Rodzaje (docs/20): niezmienniki geometrii (położenie ciężaru, kąty), zgodność rysunku ze wskazówką, wiersze błędów (kontrast z pozą poprawną).
 * Liczby progów: uproszczenie ilustracyjne zgodne ze wskazówkami (dl.feet, fsq.rack, rdl.knees: docs/research/28) — bez nowych twierdzeń w interfejsie.
 */
import { FAMILIES, figureSpec, frameAt, shapesAt, assignAll, bodyColliders, equipColliders, gap, jointAngles, VARIANTS, ERRORS, type Frame, type V3 } from '@/lib/figures/v2';

const KEYS = Object.entries(assignAll()).filter(([, f]) => ['squat', 'bench_press', 'hinge'].includes(f)).map(([k]) => k);
const spec = (k: string) => figureSpec(k)!;
const fr = (k: string, u: number, e?: 'barAway' | 'kneesBent'): Frame => frameAt(spec(k), u, e);
const U = Array.from({ length: 21 }, (_, i) => i / 20);
const viewsOf = (k: string): ('side' | 'front' | 'top')[] => FAMILIES.find(f => f.id === VARIANTS[k].family)!.views; /* widoki, które rodzina faktycznie pokazuje (families.ts) */
const MID = 6.5; /* środek stopy (x, cm): kostka 0, pięta −6, palce 19 */

/* martwy ciąg klasyczny z podłogi/podwyższenia (gryf lub hantle przed nogami), bez sumo i drążka sześciokątnego */
const CONV = KEYS.filter(k => { const v = VARIANTS[k]; return v.family === 'hinge' && v.p.style === 'floor' && v.p.impl !== 'trapbar' && !(v.p.stance > 20) && !(v.p.impl === 'kb'); });

describe('hinge: martwy ciąg klasyczny — ciężar nad środkiem stopy (było: gryf 10 cm przed środkiem na starcie, 21 cm w połowie ruchu; wskazówka dl.feet „nad środkiem stopy”)', () => {
  test('zbiór wariantów obejmuje sztangę, hantle, Rack Pull, Deficit, Snatch, linkę (13 + Cable)', () => {
    expect(CONV).toEqual(expect.arrayContaining(['Deadlift (sztanga)', 'Deadlift (hantle)', 'Rack Pull', 'Deficit Deadlift', 'Snatch Deadlift', 'Cable Deadlift', 'One-Arm Side Deadlift', 'Axle Deadlift', 'Clean Deadlift', 'Deadlift with Bands', 'Deadlift with Chains', 'Reverse Band Deadlift', 'Rack Pull with Bands']));
    expect(CONV.length).toBeGreaterThanOrEqual(13);
  });
  test('start z podłogi: środek ciężaru ≤ 5 cm od środka stopy (Rack Pull z wysokości kolan ≤ 8 cm); w każdej klatce ≤ 8 cm przed środkiem i ≤ 3 cm za nim', () => {
    for (const k of CONV) {
      const x0 = fr(k, 0).info.load[0] - MID; const lim = VARIANTS[k].family === 'hinge' && (VARIANTS[k] as { p: { yStart?: number } }).p.yStart && (VARIANTS[k] as { p: { yStart?: number } }).p.yStart! > 30 ? 8 : 5;
      expect([k, Math.abs(x0) <= lim, +x0.toFixed(1)]).toEqual([k, true, +x0.toFixed(1)]);
      for (const u of U) { const x = fr(k, u).info.load[0] - MID; expect([k, u, x <= 8 && x >= -3, +x.toFixed(1)]).toEqual([k, u, true, +x.toFixed(1)]); }
    }
  });
  test('tor ciężaru prawie pionowy: rozrzut x w całym ruchu ≤ 10 cm (było 20 cm)', () => {
    for (const k of CONV) { const xs = U.map(u => fr(k, u).info.load[0]); const spread = Math.max(...xs) - Math.min(...xs); expect([k, spread <= 10, +spread.toFixed(1)]).toEqual([k, true, +spread.toFixed(1)]); }
  });
  test('wiersz błędu „sztanga odjeżdża od ciała” wyraźnie odstaje: na starcie ≥ 14 cm przed środkiem stopy i ≥ 10 cm dalej niż poza poprawna (było +12 od pozy już 10 cm przed środkiem)', () => {
    for (const k of ['Deadlift (sztanga)', 'Cable Deadlift', 'Rack Pull']) { const c = fr(k, 0), f = fr(k, 0, 'barAway'); expect(f.info.load[0] - MID).toBeGreaterThanOrEqual(14); expect(f.info.load[0] - c.info.load[0]).toBeGreaterThanOrEqual(10); }
  });
  test('sumo i drążek sześciokątny bez zmian: ciężar nad środkiem stopy (±5 cm)', () => {
    for (const k of ['Sumo Deadlift', 'Trap Bar Deadlift', 'Leverage Deadlift', 'Rickshaw Deadlift']) expect([k, Math.abs(fr(k, 0).info.load[0] - MID) <= 5]).toEqual([k, true]);
  });
});

describe('hinge: Deadlift (hantle) — tor hantli prawie pionowy nad środkiem stopy w KAŻDEJ klatce (było po rundzie 1: kształt „S” przy kolanach, do 5,8 cm przed środkiem stopy; zgłoszenie właściciela z TestFlight)', () => {
  test('x hantli ∈ [−3, +2,5] cm od środka stopy w każdej z 21 klatek, rozrzut toru ≤ 3 cm; hantle nie przenikają nóg (kolizje, tolerancja 0,3 cm)', () => {
    const xs = U.map(u => fr('Deadlift (hantle)', u).info.load[0] - MID); for (const x of xs) expect([x >= -3 && x <= 2.5, +x.toFixed(1)]).toEqual([true, +x.toFixed(1)]);
    expect(Math.max(...xs) - Math.min(...xs)).toBeLessThanOrEqual(3);
    for (const u of U) { const f = fr('Deadlift (hantle)', u); const B = bodyColliders(f.sk).filter(b => !/^(uarm|farm|hand)/.test(b.id)); const E = equipColliders(f.props).filter(e => /^db/.test(e.id)); for (const b of B) for (const e of E) expect([u, b.id, gap(b, e) > -0.3]).toEqual([u, b.id, true]); }
  });
  test('ręce przy hantlach: chwyt nad hantlem (|z| = 30), ramię odchylone od pionu ≤ 15° w płaszczyźnie czołowej', () => {
    for (const u of U) { const f = fr('Deadlift (hantle)', u); const a = f.sk.arms.R; expect(Math.abs(a.grip[2] - 30)).toBeLessThan(0.7); const t = Math.atan2(Math.abs(a.grip[2] - a.shoulder[2]), Math.abs(a.shoulder[1] - a.grip[1])) * 180 / Math.PI; expect([u, t <= 15]).toEqual([u, true]); }
  });
});

describe('hinge: One-Arm Side Deadlift — gryf z boku ciała, wzdłuż osi przód–tył, dłoń na środku (było: gryf w poprzek przed nogami, 4,8 cm w goleniach, dłoń 10 cm od gryfu)', () => {
  test('rekwizyt barbell ma oś x, dłoń prawej ręki na gryfie ≤ 1 cm', () => {
    for (const u of U) { const f = fr('One-Arm Side Deadlift', u); const b = f.props.find(p => p.k === 'barbell')!; expect(b.k === 'barbell' && b.axis).toBe('x');
      const c = f.info.load; expect(Math.abs(f.sk.arms.R.grip[2] - c[2])).toBeLessThan(1); expect(Math.abs(f.sk.arms.R.grip[0] - c[0])).toBeLessThan(1); }
  });
  test('gryf nie przenika nóg ani tułowia w żadnej klatce (kolizje ciała i sprzętu, tolerancja 0,3 cm), widok z boku: linia wzdłuż x, z przodu: koło', () => {
    for (const u of U) { const f = fr('One-Arm Side Deadlift', u); const B = bodyColliders(f.sk).filter(b => !/^(uarm|farm|hand)/.test(b.id)); const E = equipColliders(f.props).filter(e => e.id === 'bar');
      for (const b of B) for (const e of E) expect([u, b.id, gap(b, e) > -0.3]).toEqual([u, b.id, true]); }
    const side = shapesAt(spec('One-Arm Side Deadlift'), 0.5, 'side').filter(s => s.id === 'bar'); const w = side.map(s => s.k === 'line' ? Math.abs(s.b[0] - s.a[0]) : 0); expect(Math.max(...w)).toBeGreaterThan(150);
    const front = shapesAt(spec('One-Arm Side Deadlift'), 0.5, 'front').filter(s => s.id === 'bar'); expect(front.every(s => s.k === 'circle')).toBe(true);
  });
  test('pozostałe sztangi (oś z) bez zmian: tylko ten wariant ma oś x', () => {
    const ax = KEYS.filter(k => [0, 1].some(u => fr(k, u).props.some(p => p.k === 'barbell' && p.axis === 'x'))); expect(ax).toEqual(['One-Arm Side Deadlift']);
  });
});

describe('hinge: kolana „lekko ugięte” w RDL i dzień dobry (było: 40–44° w RDL, wskazówki rdl.move/rdl.knees/gm.setup; docs/research/28: 15° ± 12°)', () => {
  const SOFT = KEYS.filter(k => { const v = VARIANTS[k]; return v.family === 'hinge' && (v.p.style === 'rdl' || v.p.style === 'singleLeg' || v.p.style === 'goodMorning'); });
  test('wszystkie warianty RDL / na jednej nodze / dzień dobry: kolano ≤ 27° w każdej klatce (martwy na prostych nogach także)', () => {
    expect(SOFT.length).toBeGreaterThanOrEqual(10);
    for (const k of SOFT) for (const u of U) { const f = fr(k, u); for (const s of ['R', 'L'] as const) { if (s === 'L' && VARIANTS[k].family === 'hinge' && (VARIANTS[k] as { p: { style: string } }).p.style === 'singleLeg') continue; const K = jointAngles(f.sk, s).knee; expect([k, u, s, K <= 27]).toEqual([k, u, s, true]); } }
  });
  test('RDL: tułów na dole 50–80° od pionu (ruch w biodrze), gryf blisko nóg (≤ 15 cm przed środkiem stopy)', () => {
    for (const k of ['RDL (sztanga)', 'RDL (hantle/linki)', 'Stiff-Legged Barbell Deadlift']) { const f = fr(k, 1); expect([k, f.pose!.trunkPitch >= 50 && f.pose!.trunkPitch <= 80]).toEqual([k, true]); for (const u of U) expect(fr(k, u).info.load[0] - MID).toBeLessThanOrEqual(15); }
  });
  test('wiersz błędu „kolana jak w przysiadzie” (rdl.knees) wyraźnie odstaje: ≥ 25° więcej niż poza poprawna na dole (było +14°)', () => {
    for (const k of ['RDL (sztanga)', 'RDL (hantle/linki)', 'Single Leg RDL (hantel)', 'Stiff-Legged Barbell Deadlift']) { const d = jointAngles(fr(k, 1, 'kneesBent').sk, 'R').knee - jointAngles(fr(k, 1).sk, 'R').knee; expect([k, d >= 25, +d.toFixed(0)]).toEqual([k, true, +d.toFixed(0)]); }
    expect(ERRORS.kneesBent.affects).toEqual(expect.arrayContaining(['knee', 'hip']));
  });
});

describe('squat: Front Squat — łokcie w przód na wysokości barku, nie w górę i na boki (było po rundzie 1: łokieć 14–17 cm nad barkiem, 13,5 cm przed nim, 24 cm na zewnątrz, odwiedzenie 39–61°; wskazówka fsq.rack „ramiona mniej więcej poziomo”)', () => {
  const ARM = 31; /* długość ramienia (BODY.uarm) */
  test('w każdej klatce, obie strony: łokieć ±12 cm od wysokości barku, przed barkiem ≥ 0,6 × długość ramienia, odwiedzenie od kierunku „w przód” ≤ 30°, poniżej czubka głowy', () => {
    for (const u of U) { const f = fr('Front Squat', u); for (const s of ['R', 'L'] as const) { const a = f.sk.arms[s]; const dy = a.elbow[1] - a.shoulder[1]; const dx = a.elbow[0] - a.shoulder[0]; const dz = Math.abs(a.elbow[2] - a.shoulder[2]); const abd = Math.atan2(dz, dx) * 180 / Math.PI;
      expect([u, s, Math.abs(dy) <= 12, dx >= 0.6 * ARM, abd <= 30, a.elbow[1] < f.sk.head[1] - 5]).toEqual([u, s, true, true, true, true]); } }
  });
  test('chwyt nadal na gryfie (≤ 0,6 cm) i łokieć w zakresie stawu (≤ 165°)', () => {
    for (const u of U) { const f = fr('Front Squat', u); const bar = f.info.bar as V3; for (const s of ['R', 'L'] as const) { expect(Math.abs(f.sk.arms[s].grip[0] - bar[0])).toBeLessThan(0.7); expect(jointAngles(f.sk, s).elbow).toBeLessThanOrEqual(165); } }
  });
});

describe('squat: Dip Belt Squat — pas z łańcuchem i zwisającym ciężarem, bez linki do podłogi (było: dodatkowa linka od kotwy na podłodze do pasa)', () => {
  test('Dip Belt Squat nie ma rekwizytu „cable”; Przysiad z pasem (linki) ma jedną linkę', () => {
    for (const u of U) { expect(fr('Dip Belt Squat', u).props.some(p => p.k === 'cable')).toBe(false); expect(fr('Dip Belt Squat', u).props.some(p => p.k === 'chain')).toBe(true); expect(fr('Przysiad z pasem (linki)', u).props.filter(p => p.k === 'cable').length).toBe(1); }
  });
});

describe('guma sztangi: dwie gumy przy końcach gryfu (było: jedna guma pionowo przez środek ciała — tułów, miednicę, ławkę)', () => {
  const BANDED = KEYS.filter(k => [0, 1].some(u => fr(k, u).props.some(p => p.k === 'band' && p.bar)));
  test('wszystkie warianty „with Bands”, „Reverse Band”, Band Good Morning mają gumę z flagą bar; Band Squat (ręce) i Band Bench Press (od 101-05: guma przy uchwytach, bez sztangi) nie', () => {
    expect(BANDED).toEqual(expect.arrayContaining(['Squat with Bands', 'Box Squat with Bands', 'Reverse Band Box Squat', 'Reverse Band Power Squat', 'Reverse Band Bench Press', 'Deadlift with Bands', 'Rack Pull with Bands', 'Reverse Band Deadlift', 'Band Good Morning', 'Sumo Deadlift with Bands', 'Reverse Band Sumo Deadlift']));
    expect(BANDED).not.toContain('Band Squat'); expect(BANDED).not.toContain('Band Bench Press');
  });
  /* widoki, które rodzina faktycznie pokazuje (families.ts): przysiad i zawias — bok i przód, wyciskanie — bok i góra */
  test('w widokach rodziny: bok — jedna linia gumy; przód (przysiad, zawias) i góra (wyciskanie) — dwie, po obu stronach (|z| > 60 cm), nie przez oś ciała', () => {
    for (const k of BANDED) for (const v of viewsOf(k)) { const n = shapesAt(spec(k), 1, v).filter(s => s.id === 'band'); expect([k, v, n.length]).toEqual([k, v, v === 'side' ? 1 : 2]);
      if (v === 'front') for (const s of n) expect(s.k === 'line' && Math.abs(s.a[0]) > 60).toBe(true); }
    expect(viewsOf('Band Bench Press')).toEqual(['side', 'top']);
  });
});

describe('guma „Reverse Band”: zwisa z góry stojaka do gryfu, nie od gryfu do podłogi (było po rundzie 1: guma od gryfu do podłogi, jak w „with Bands” — 5 ćwiczeń; odciążenie na dole to cecha odmiany)', () => {
  const REV = ['Reverse Band Box Squat', 'Reverse Band Power Squat', 'Reverse Band Bench Press', 'Reverse Band Deadlift', 'Reverse Band Sumo Deadlift'];
  const bandOf = (f: Frame) => f.props.filter((p): p is Extract<typeof p, { k: 'band' }> => p.k === 'band' && !!p.bar);
  test('w każdej klatce: kotwica gumy ≥ 30 cm nad gryfem (nie na podłodze), drugi koniec na gryfie; wszystkie 5 wersji z „Reverse Band” (przysiad, wyciskanie, martwy ciąg) objęte', () => {
    expect(KEYS.filter(k => /Reverse Band/.test(k)).sort()).toEqual([...REV].sort());
    for (const k of REV) for (const u of U) { const f = fr(k, u); const b = bandOf(f); expect([k, u, b.length]).toEqual([k, u, 1]); const bar = f.info.bar as V3;
      expect([k, u, b[0].to[1] === bar[1] && b[0].to[0] === bar[0], b[0].from[1] >= bar[1] + 30]).toEqual([k, u, true, true]); }
  });
  test('inne gumy sztangi (with Bands, Deadlift with Bands) bez zmian: od gryfu do podłogi', () => {
    for (const k of ['Squat with Bands', 'Box Squat with Bands', 'Deadlift with Bands', 'Sumo Deadlift with Bands']) for (const u of U) { const f = fr(k, u); const b = bandOf(f)[0]; expect([k, u, b.to[1]]).toEqual([k, u, 0]); expect(b.from[1]).toBe((f.info.bar as V3)[1]); }
  });
  test('w widoku z boku i z przodu/góry guma „Reverse” biegnie ku górze od gryfu (koniec rysunku wyżej niż gryf), nie ku podłodze', () => {
    for (const k of REV) for (const v of viewsOf(k)) { if (v === 'top') continue; const sh = shapesAt(spec(k), 1, v); const bar = sh.find(s => s.id === 'bar')!; const by = bar.k === 'circle' ? bar.c[1] : bar.k === 'line' ? bar.a[1] : 0;
      for (const s of sh.filter(x => x.id === 'band')) expect([k, v, s.k === 'line' && Math.max(s.a[1], s.b[1]) > by + 25 && Math.min(s.a[1], s.b[1]) > by - 1]).toEqual([k, v, true]); }
  });
});

describe('bench_press: przedramiona pionowo na dole we wszystkich wariantach ze zwykłym chwytem (było: 20–42° od pionu, odwiedzenie 49–84°; decyzja właściciela 26.10.2026 „rzeczywistość nadrzędna”, docs/18)', () => {
  const ORDINARY = ['Bench Press (sztanga)', 'Bench Press (hantle)', 'Incline Bench Press (sztanga)', 'Incline Bench Press (hantle)', 'Decline Bench Press', 'Decline Bench Press (hantle)', 'Floor Press (hantle)', 'Floor Press (sztanga)', 'Smith Machine Bench Press', 'Smith Machine Incline Press', 'One-Arm Kettlebell Floor Press', 'One Arm Dumbbell Bench Press', 'Wide-Grip Barbell Bench Press', 'Smith Machine Decline Press', 'Band Bench Press', 'Chain Press', 'Bench Press with Chains', 'Floor Press with Chains', 'Reverse Band Bench Press', 'Board Press', 'Pin Press', 'Reverse Grip Bench Press'];
  const frontal = (f: Frame, s: 'R' | 'L'): number => { const a = f.sk.arms[s]; return Math.atan2(Math.abs(a.grip[2] - a.elbow[2]), Math.abs(a.grip[1] - a.elbow[1])) * 180 / Math.PI; };
  const abd = (f: Frame, s: 'R' | 'L'): number => { const a = f.sk.arms[s]; return Math.atan2(Math.abs(a.elbow[2] - a.shoulder[2]), Math.abs(a.elbow[0] - a.shoulder[0])) * 180 / Math.PI; };
  test('przedramię ≤ 10° od pionu w płaszczyźnie czołowej na dole (z podłogi — łokieć opiera się o podłogę: ≤ 13°), obie strony', () => {
    for (const k of ORDINARY) { const f = fr(k, 1); const lim = /Floor/.test(k) ? 13 : 10; for (const s of (/One/.test(k) ? ['R'] as const : ['R', 'L'] as const)) { const t = frontal(f, s); expect([k, s, t <= lim, +t.toFixed(1)]).toEqual([k, s, true, +t.toFixed(1)]); } }
  });
  test('odwiedzenie łokcia w widoku z góry 25–65° (sztanga) i 25–50° (hantle, kettlebell) — poza przedziałem były szeroko rozłożone łokcie', () => {
    for (const k of ORDINARY) { const a = abd(fr(k, 1), 'R'); const hi = /hantle|Dumbbell|Kettlebell/.test(k) ? 50 : 65; expect([k, a >= 25 && a <= hi, +a.toFixed(0)]).toEqual([k, true, +a.toFixed(0)]); }
  });
  test('warianty z założenia inne zostają bez zmian (Squeeze, JM, Guillotine: bez `vert`); wąski chwyt dostał `vert` w 1.0.1 (tests/figury-1-0-1-uwagi.test.ts)', () => {
    for (const k of ['Squeeze Press (hantle)', 'JM Press', 'Barbell Guillotine Bench Press']) expect([k, (VARIANTS[k] as { p: { vert?: boolean } }).p.vert]).toEqual([k, undefined]);
  });
  test('floor press: łokieć dotyka podłogi, ale nie przenika maty (kolizje ciała i maty ≤ 1,5 cm)', () => {
    for (const k of ['Floor Press (sztanga)', 'Floor Press (hantle)', 'One-Arm Kettlebell Floor Press', 'Floor Press with Chains']) for (const u of U) { const f = fr(k, u); const B = bodyColliders(f.sk).filter(b => /^uarm/.test(b.id)); const E = equipColliders(f.props).filter(e => e.id === 'mat'); for (const b of B) for (const e of E) expect([k, u, gap(b, e) > -1.5]).toEqual([k, u, true]); }
  });
});
