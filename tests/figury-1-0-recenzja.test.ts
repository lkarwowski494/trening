/*
 * Figury v2 w 1.0 — naprawy po niezależnej recenzji ruchu (27.10.2026; squat, bench_press, hinge). Każdy test odtwarza błąd potwierdzony NA MAIN 4b77c9f liczbą z silnika
 * (komentarz „było”) i pilnuje poprawki. Rodzaje (docs/20): niezmienniki geometrii (położenie ciężaru, kąty), zgodność rysunku ze wskazówką, wiersze błędów (kontrast z pozą poprawną).
 * Liczby progów: uproszczenie ilustracyjne zgodne ze wskazówkami (dl.feet, fsq.rack, rdl.knees: docs/research/28) — bez nowych twierdzeń w interfejsie.
 */
import { figureSpec, frameAt, shapesAt, assignAll, bodyColliders, equipColliders, gap, jointAngles, VARIANTS, ERRORS, type Frame, type V3 } from '@/lib/figures/v2';

const KEYS = Object.entries(assignAll()).filter(([, f]) => ['squat', 'bench_press', 'hinge'].includes(f)).map(([k]) => k);
const spec = (k: string) => figureSpec(k)!;
const fr = (k: string, u: number, e?: 'barAway' | 'kneesBent'): Frame => frameAt(spec(k), u, e);
const U = Array.from({ length: 21 }, (_, i) => i / 20);
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

describe('squat: Front Squat — łokcie w przód na wysokości barku, nie pionowo w górę (było: łokieć 28,6 cm nad barkiem, ramię 67° w górę; wskazówka fsq.rack „ramiona mniej więcej poziomo”)', () => {
  test('w każdej klatce: łokieć ≤ 18 cm nad barkiem (było 28,6) i ≥ 10 cm przed nim, uniesienie ramienia nad poziom ≤ 40°, łokieć poniżej czubka głowy', () => {
    for (const u of U) { const f = fr('Front Squat', u); for (const s of ['R', 'L'] as const) { const a = f.sk.arms[s]; const dy = a.elbow[1] - a.shoulder[1]; const dx = a.elbow[0] - a.shoulder[0]; const dz = a.elbow[2] - a.shoulder[2]; const elev = Math.atan2(dy, Math.hypot(dx, dz)) * 180 / Math.PI;
      expect([u, s, dy <= 18, dx >= 10, elev <= 40, a.elbow[1] < f.sk.head[1] - 5]).toEqual([u, s, true, true, true, true]); } }
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
  test('wszystkie warianty „with Bands”, „Reverse Band”, Band Bench Press, Band Good Morning mają gumę z flagą bar; Band Squat (ręce) nie', () => {
    expect(BANDED).toEqual(expect.arrayContaining(['Squat with Bands', 'Box Squat with Bands', 'Reverse Band Box Squat', 'Reverse Band Power Squat', 'Band Bench Press', 'Reverse Band Bench Press', 'Deadlift with Bands', 'Rack Pull with Bands', 'Reverse Band Deadlift', 'Band Good Morning', 'Sumo Deadlift with Bands', 'Reverse Band Sumo Deadlift']));
    expect(BANDED).not.toContain('Band Squat');
  });
  test('widok z przodu: dwie linie gumy po obu stronach (|x| > 60 cm), nie przez oś ciała; z boku jedna', () => {
    for (const k of BANDED) { const front = shapesAt(spec(k), 1, 'front').filter(s => s.id === 'band'); expect([k, front.length]).toEqual([k, 2]); for (const s of front) expect(s.k === 'line' && Math.abs(s.a[0]) > 60).toBe(true);
      expect([k, shapesAt(spec(k), 1, 'side').filter(s => s.id === 'band').length]).toEqual([k, 1]); }
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
  test('warianty z założenia inne zostają bez zmian (wąski chwyt, Squeeze, JM, Guillotine, Skull Crusher: bez `vert`)', () => {
    for (const k of ['Close Grip Bench Press', 'Squeeze Press (hantle)', 'JM Press', 'Barbell Guillotine Bench Press', 'Close-Grip Dumbbell Press', 'Close-Grip EZ-Bar Press', 'Smith Machine Close-Grip Bench Press', 'Decline Close-Grip Bench To Skull Crusher']) expect([k, (VARIANTS[k] as { p: { vert?: boolean } }).p.vert]).toEqual([k, undefined]);
  });
  test('floor press: łokieć dotyka podłogi, ale nie przenika maty (kolizje ciała i maty ≤ 1,5 cm)', () => {
    for (const k of ['Floor Press (sztanga)', 'Floor Press (hantle)', 'One-Arm Kettlebell Floor Press', 'Floor Press with Chains']) for (const u of U) { const f = fr(k, u); const B = bodyColliders(f.sk).filter(b => /^uarm/.test(b.id)); const E = equipColliders(f.props).filter(e => e.id === 'mat'); for (const b of B) for (const e of E) expect([k, u, gap(b, e) > -1.5]).toEqual([k, u, true]); }
  });
});
