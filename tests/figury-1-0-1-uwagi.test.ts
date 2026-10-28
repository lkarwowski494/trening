/*
 * Figury v2 w 1.0.1 — uwagi ŚREDNIE/NISKIE z ponownej recenzji 1.0 (27.10.2026; squat, bench_press, hinge) i z recenzji niezależnej po naprawie torów (28.10.2026).
 * Źródła uwag: docs/21 sekcja „Figury v2 — uwagi ŚREDNIE/NISKIE…” i „tory ruchu do oceny”; raporty na gałęzi przekazanie-konta (recenzje-1-1/ponowne).
 * Każdy test odtwarza pomiar z raportu liczbą z silnika (komentarz „było”) i pilnuje poprawki. Kąty tylko z istniejących zapisów (docs/50, docs/research/28,
 * data/zrodla/figury-wyciskanie.json); brak podstawy → otwarte pytanie w docs/21, nie liczba w kodzie.
 */
import { distSegSeg, bodyColliders, sortShapes, EQUIP, FAMILIES, figureSpec, frameAt, shapesAt, trailFor, assignAll, VARIANTS, jointAngles, checkFrame, type Frame, type V3 } from '@/lib/figures/v2';

const spec = (k: string) => figureSpec(k)!;
const fr = (k: string, u: number, e?: 'barAway' | 'kneesBent'): Frame => frameAt(spec(k), u, e);
const U = Array.from({ length: 21 }, (_, i) => i / 20);
const deg = (r: number) => r * 180 / Math.PI;
/** Przedramię od pionu: czołowo (z–y) i strzałkowo (x–y), stopnie. */
const forearm = (f: Frame, s: 'R' | 'L' = 'R') => { const a = f.sk.arms[s]; return { front: deg(Math.atan2(Math.abs(a.grip[2] - a.elbow[2]), Math.abs(a.grip[1] - a.elbow[1]))), sag: deg(Math.atan2(Math.abs(a.grip[0] - a.elbow[0]), Math.abs(a.grip[1] - a.elbow[1]))) }; };
const fam = assignAll();
void FAMILIES; void shapesAt; void jointAngles; void checkFrame; void (null as unknown as V3);

describe('bench_press: wąski chwyt — chwyt nie węższy niż „trochę węziej niż barki”, przedramię pionowo (było: chwyt ±12 przy barkach ±19, przedramię 50° od pionu czołowo; wskazówka cgbp.grip „na szerokość barków lub trochę węziej — nie bardzo wąsko”, reguła przedramion z docs/50)', () => {
  const NARROW = ['Close Grip Bench Press', 'Close-Grip EZ-Bar Press', 'Smith Machine Close-Grip Bench Press', 'Close-Grip Dumbbell Press'];
  const SH = 20.5; /* połowa szerokości barków w wariantach `vert` (BENCH.dims.shHalf) */
  test('te cztery warianty liczą łokieć pod dłonią (`vert`), a połowa rozstawu dłoni mieści się między 0,75 a 1,0 × połowa barków', () => {
    for (const k of NARROW) { const p = (VARIANTS[k] as { p: { vert?: boolean; grip: number } }).p; expect([k, p.vert, p.grip >= 0.75 * SH && p.grip <= SH]).toEqual([k, true, true]); }
  });
  test('na dole: przedramię ≤ 10° od pionu czołowo i ≤ 12° strzałkowo, obie strony; łokieć blisko tułowia (odwiedzenie ≤ 25°)', () => {
    for (const k of NARROW) { const f = fr(k, 1); for (const s of ['R', 'L'] as const) { const t = forearm(f, s); const a = f.sk.arms[s]; const abd = deg(Math.atan2(Math.abs(a.elbow[2] - a.shoulder[2]), Math.abs(a.elbow[0] - a.shoulder[0])));
      expect([k, s, t.front <= 10, t.sag <= 12, abd <= 25]).toEqual([k, s, true, true, true]); } }
  });
  test('w całym ruchu: brak przenikania ciała i sprzętu (kontrola geometrii, jak w teście ogólnym)', () => {
    for (const k of NARROW) for (const u of U) expect([k, u, checkFrame(fr(k, u)).map(i => i.code)]).toEqual([k, u, []]);
  });
});

describe('bench_press: JM Press i Skull Crusher — zgięcie łokcia w granicy kontraktu (było: 152° i 154° przy limicie 149°; docs/research/28: CDC zgięcie łokcia 150°/145°)', () => {
  test('łokieć ≤ 149° w każdej klatce, obie strony; gryf nie wchodzi w głowę (kontrola geometrii)', () => {
    for (const k of ['JM Press', 'Decline Close-Grip Bench To Skull Crusher']) for (const u of U) { const f = fr(k, u); for (const s of ['R', 'L'] as const) expect([k, u, s, jointAngles(f.sk, s).elbow <= 149]).toEqual([k, u, s, true]); expect([k, u, checkFrame(f).map(i => i.code)]).toEqual([k, u, []]); }
  });
});

describe('bench_press: ławka ujemna — przedramię ≤ 10° od pionu także strzałkowo (było: 11,8° / 11,8° / 13,1°; decyzja właściciela 26.10.2026 ±10°, docs/18)', () => {
  test('Decline Bench Press, Decline (hantle), Smith Machine Decline Press: na dole przedramię ≤ 10° czołowo i strzałkowo, obie strony', () => {
    for (const k of ['Decline Bench Press', 'Decline Bench Press (hantle)', 'Smith Machine Decline Press']) for (const s of ['R', 'L'] as const) { const t = forearm(fr(k, 1), s); expect([k, s, t.front <= 10, t.sag <= 10]).toEqual([k, s, true, true]); }
  });
  test('gryf nadal dotyka klatki: kontrola geometrii bez błędów w całym ruchu', () => {
    for (const k of ['Decline Bench Press', 'Decline Bench Press (hantle)', 'Smith Machine Decline Press']) for (const u of U) expect([k, u, checkFrame(fr(k, u)).map(i => i.code)]).toEqual([k, u, []]);
  });
  test('rodzina to bench_press (dla porządku testu)', () => { expect(fam['Decline Bench Press']).toBe('bench_press'); });
});

describe('bench_press: Board Press i Pin Press — deska na klatce i bolce w stojaku, które tłumaczą zatrzymanie gryfu (było: gryf 4 cm / 5,5 cm nad punktem dotyku bez żadnego sprzętu; wygląda jak niepełne powtórzenie)', () => {
  const bar = (f: Frame) => f.info.bar as V3;
  const props = (f: Frame) => f.props as unknown as { k: string; x: number; y: number; h: number }[];
  test('Board Press: deska o grubości 4 cm leży na klatce, a gryf spoczywa na jej górze (dno gryfu = góra deski ± 0,05 cm) w dolnym punkcie; ruch gryfu bez zmian (dotyk 4 cm nad zwykłym wyciskaniem)', () => {
    const f = fr('Board Press', 1); const b = props(f).find(p => p.k === 'board')!; expect(b).toBeDefined();
    expect(b.h).toBe(4); expect(Math.abs(b.y + b.h - (bar(f)[1] - 1.6))).toBeLessThan(0.05); expect(Math.abs(b.x - bar(f)[0])).toBeLessThan(0.05);
    expect(+(bar(f)[1] - fr('Bench Press (sztanga)', 1).info.bar[1]).toFixed(1)).toBe(4);
  });
  test('Board Press: deska widoczna w widokach rodziny (bok, góra) jako kształt „board”; reszta wyciskań jej nie ma', () => {
    for (const v of ['side', 'top'] as const) expect([v, shapesAt(spec('Board Press'), 1, v).some(s => s.id === 'board')]).toEqual([v, true]);
    const bez = Object.entries(fam).filter(([k, f]) => f === 'bench_press' && k !== 'Board Press' && props(fr(k, 1)).some(p => p.k === 'board')).map(([k]) => k); expect(bez).toEqual([]);
  });
  test('Pin Press: stojak z bolcem pod gryfem w dolnym punkcie (góra bolca = dno gryfu), słupek w x gryfu; gryf nigdy niżej niż bolec; widoczny z boku i z góry', () => {
    const f = fr('Pin Press', 1); const r = props(f).find(p => p.k === 'rack')!; expect(r).toBeDefined();
    expect(Math.abs(r.y - (bar(f)[1] - 1.6))).toBeLessThan(0.05); expect(Math.abs(r.x - bar(f)[0])).toBeLessThan(0.05); expect(r.h).toBeGreaterThan(bar(f)[1] + 30);
    for (const u of U) expect([u, bar(fr('Pin Press', u))[1] - 1.6 >= r.y - 0.05]).toEqual([u, true]);
    for (const v of ['side', 'top'] as const) { const ids = shapesAt(spec('Pin Press'), 1, v).map(s => s.id); expect([v, ids.includes('rackPost'), ids.includes('rackPin')]).toEqual([v, true, true]); }
    expect(Object.entries(fam).filter(([k, f]) => f === 'bench_press' && k !== 'Pin Press' && props(fr(k, 1)).some(p => p.k === 'rack')).map(([k]) => k)).toEqual([]);
  });
});

describe('squat: Band Squat — guma od stóp do rąk przy barkach, nie do rąk wyciągniętych w przód (było: guma z podłogi do dłoni na wysokości barków 54 cm przed nimi; ręce wyciągnięte przy gumie ciągnącej w dół)', () => {
  test('w każdej klatce, obie ręce: dłoń ≤ 20 cm od wysokości barku i ≤ 30 cm przed barkiem (łokieć zgięty ≥ 60°); Bodyweight Squat nadal z rękami w przód (> 40 cm od barku)', () => {
    for (const u of U) { const f = fr('Band Squat', u); for (const s of ['R', 'L'] as const) { const a = f.sk.arms[s]; const dx = a.grip[0] - a.shoulder[0], dy = a.grip[1] - a.shoulder[1];
      expect([u, s, Math.abs(dy) <= 20, dx <= 30, jointAngles(f.sk, s).elbow >= 60]).toEqual([u, s, true, true, true]); }
      const b = fr('Bodyweight Squat', u).sk.arms.R; expect(b.grip[0] - b.shoulder[0]).toBeGreaterThan(40); }
  });
  test('dwie gumy (po jednej na rękę): jeden koniec na podłodze pod stopą (x środka stopy, |z| = rozstaw − 8: pod wewnętrzną częścią stopy, między kolanami), drugi w dłoni (≤ 0,1 cm); widoczne w obu widokach (bok, przód)', () => {
    for (const u of U) { const f = fr('Band Squat', u); const bands = f.props.filter(p => p.k === 'band') as { from: V3; to: V3 }[]; expect([u, bands.length]).toEqual([u, 2]);
      for (const b of bands) { const s = b.to[2] > 0 ? 'R' : 'L'; const g = f.sk.arms[s].grip; expect([u, b.from[1], Math.abs(b.from[0] - f.info.midfoot[0]) < 1e-6, Math.abs(Math.abs(b.from[2]) - 12) < 1e-6, Math.hypot(b.to[0] - g[0], b.to[1] - g[1], b.to[2] - g[2]) <= 0.1]).toEqual([u, 0, true, true, true]); } }
    for (const v of ['side', 'front'] as const) expect([v, shapesAt(spec('Band Squat'), 0.5, v).filter(s => s.id === 'band').length]).toEqual([v, 2]);
  });
});

describe('hinge: trap bar / Leverage / Rickshaw — tułów na górze bez odchylenia do tyłu (było: −6,4° przy kolanie 0°, klasyczny „przeprost” na wyproście)', () => {
  test('na wyproście (u = 1) tułów od pionu ∈ [0°, 6°]; w całym ruchu nie niżej niż −1° (nie odchyla się do tyłu)', () => {
    for (const k of ['Trap Bar Deadlift', 'Leverage Deadlift', 'Rickshaw Deadlift']) { const t = U.map(u => fr(k, u).pose!.trunkPitch);
      expect([k, t[20] >= 0 && t[20] <= 6, Math.min(...t) >= -1]).toEqual([k, true, true]); }
  });
  test('żaden martwy ciąg z podłogi nie kończy się odchylony do tyłu (tułów na wyproście ∈ [−1°, 6°])', () => {
    for (const [k, v] of Object.entries(VARIANTS)) if (v.family === 'hinge' && v.p.style === 'floor') { const t = fr(k, 1).pose!.trunkPitch; expect([k, t >= -1 && t <= 6, +t.toFixed(1)]).toEqual([k, true, +t.toFixed(1)]); }
  });
});

describe('widok z przodu i z góry: ślad toru biegnie przy hantlu, nie w osi ciała (było: info.load w z = 0 przy hantlach po bokach — tor między nogami, a hantle po bokach)', () => {
  test('ćwiczenia z hantlami: z środka ciężaru = z hantla prawej ręki (± 0,01 cm), w każdej klatce; ćwiczenia z jednym środkiem (sztanga, goblet, kettlebell) bez zmian: z = 0', () => {
    const withDb = Object.keys(VARIANTS).filter(k => fr(k, 0.5).props.some(p => p.k === 'dumbbell' && Math.abs(p.c[2]) > 1));
    expect(withDb.length).toBeGreaterThanOrEqual(8);
    for (const k of withDb) for (const u of U) { const f = fr(k, u); const r = f.props.find(p => p.k === 'dumbbell' && p.side === 'R'); expect([k, u, r && Math.abs((f.info.load as V3)[2] - (r as { c: V3 }).c[2]) < 0.01]).toEqual([k, u, true]); }
    for (const k of ['Back Squat', 'Goblet Squat', 'Deadlift (sztanga)', 'Double Kettlebell Front Squat']) expect([k, (fr(k, 0.5).info.load as V3)[2]]).toEqual([k, 0]);
  });
  test('w widoku z przodu ślad toru Deadlift (hantle) leży po stronie hantla (|x rysunku| ≈ 30 cm), nie przy osi', () => {
    const tr = trailFor(spec('Deadlift (hantle)'), 'front').filter(s => s.id === 'trail' && s.k === 'line'); expect(tr.length).toBeGreaterThan(0);
    for (const s of tr) if (s.k === 'line') expect(Math.abs(Math.abs(s.a[0]) - 30)).toBeLessThan(1);
  });
});

describe('zaczepy stałe: górny zaczep gumy „Reverse Band” i bloczek linki przy podłodze stoją w miejscu, nie jadą z ciężarem (było: 3,4 i 8 cm w martwych ciągach; w Reverse Band Bench Press kotwica jechała z gryfem)', () => {
  const stale = (k: string, kind: 'band' | 'cable'): [number[], number[]] | null => { const a = U.map(u => fr(k, u).props.find(p => p.k === kind && (kind === 'cable' || (p as { hang?: boolean }).hang)) as { from: V3 } | undefined); if (a.some(x => !x)) return null; const xs = a.map(x => x!.from); return [xs.map(p => p[0]), xs.map(p => p[1])]; };
  test('każda guma z kotwicą nad gryfem (hang) ma kotwicę w tym samym miejscu we wszystkich klatkach; to samo każda linka (bloczek)', () => {
    const rev = Object.keys(VARIANTS).filter(k => stale(k, 'band')); expect(rev.sort()).toEqual(['Reverse Band Bench Press', 'Reverse Band Box Squat', 'Reverse Band Deadlift', 'Reverse Band Power Squat', 'Reverse Band Sumo Deadlift']);
    const cab = Object.keys(VARIANTS).filter(k => stale(k, 'cable')); expect(cab.length).toBeGreaterThanOrEqual(5); expect(cab).toEqual(expect.arrayContaining(['Cable Deadlift', 'Cable Pull Through', 'Cable Squat']));
    for (const [k, kind] of [...rev.map(x => [x, 'band'] as const), ...cab.map(x => [x, 'cable'] as const)]) { const [xs, ys] = stale(k, kind)!; expect([k, kind, +(Math.max(...xs) - Math.min(...xs)).toFixed(2), +(Math.max(...ys) - Math.min(...ys)).toFixed(2)]).toEqual([k, kind, 0, 0]); }
  });
  test('guma „Reverse” nadal łączy kotwicę z gryfem (koniec `to` na gryfie) i kotwica jest ≥ 30 cm nad gryfem w najwyższej klatce', () => {
    for (const k of ['Reverse Band Deadlift', 'Reverse Band Sumo Deadlift', 'Reverse Band Bench Press', 'Reverse Band Box Squat', 'Reverse Band Power Squat']) for (const u of U) { const f = fr(k, u); const b = f.props.find(p => p.k === 'band') as { from: V3; to: V3 }; const bar = f.info.bar as V3;
      expect([k, u, b.to[0] === bar[0] && b.to[1] === bar[1], b.from[1] >= Math.max(...U.map(v => (fr(k, v).info.bar as V3)[1])) + 30 - 1e-6]).toEqual([k, u, true, true]); }
  });
});

describe('hinge: Cable Pull Through — zawias w biodrach, nie półprzysiad (było: kolano 41,5°, tułów 30° od pionu na dole; wskazówka rdl.depth, docs/research/28: kolana „lekko ugięte” 15° ± 12°)', () => {
  test('kolano ≤ 27° w każdej klatce (jak RDL i dzień dobry), tułów na dole 50–80° od pionu, linka nie przenika nóg (kontrola geometrii)', () => {
    for (const u of U) { const f = fr('Cable Pull Through', u); for (const s of ['R', 'L'] as const) expect([u, s, jointAngles(f.sk, s).knee <= 27]).toEqual([u, s, true]); expect([u, checkFrame(f).map(i => i.code)]).toEqual([u, []]); }
    const t = fr('Cable Pull Through', 1).pose!.trunkPitch; expect([t >= 50 && t <= 80, +t.toFixed(0)]).toEqual([true, +t.toFixed(0)]);
  });
});

describe('hinge: Rack Pull, Rack Pull with Bands, Good Morning off Pins — stojak z bolcami (było: gryf startuje w powietrzu, bez żadnego sprzętu)', () => {
  const bar = (f: Frame) => f.info.bar as V3;
  const rack = (f: Frame) => (f.props as unknown as { k: string; x: number; y: number; h: number }[]).find(p => p.k === 'rack');
  test('Rack Pull (oba): bolec pod gryfem na starcie (góra bolca = dno gryfu), gryf w całym ruchu nie niżej niż bolec, słupek w x gryfu na starcie; stojak stały w całym ruchu', () => {
    for (const k of ['Rack Pull', 'Rack Pull with Bands']) { const r0 = rack(fr(k, 0))!; expect([k, !!r0]).toEqual([k, true]);
      expect([k, Math.abs(r0.y - (bar(fr(k, 0))[1] - 1.6)) < 0.05, Math.abs(r0.x - bar(fr(k, 0))[0]) < 0.05]).toEqual([k, true, true]);
      for (const u of U) { const f = fr(k, u); expect([k, u, bar(f)[1] - 1.6 >= r0.y - 0.05, rack(f)!.x === r0.x, rack(f)!.y === r0.y]).toEqual([k, u, true, true, true]); } }
  });
  test('Good Morning off Pins: bolec pod gryfem w dolnym punkcie (u = 1), gryf nie niżej niż bolec w całym ruchu; Good Morning i Band Good Morning bez stojaka', () => {
    const r = rack(fr('Good Morning off Pins', 1))!; expect(r).toBeDefined(); expect(Math.abs(r.y - (bar(fr('Good Morning off Pins', 1))[1] - 1.6))).toBeLessThan(0.05);
    for (const u of U) expect([u, bar(fr('Good Morning off Pins', u))[1] - 1.6 >= r.y - 0.05]).toEqual([u, true]);
    for (const k of ['Good Morning', 'Band Good Morning']) expect([k, rack(fr(k, 1))]).toEqual([k, undefined]);
  });
  test('stojak tylko w tych trzech ćwiczeniach; widoczny z boku i z przodu (słupki po obu stronach)', () => {
    expect(Object.entries(fam).filter(([k, f]) => f === 'hinge' && rack(fr(k, 0))).map(([k]) => k).sort()).toEqual(['Good Morning off Pins', 'Rack Pull', 'Rack Pull with Bands']);
    for (const k of ['Rack Pull', 'Good Morning off Pins']) { expect(shapesAt(spec(k), 1, 'side').filter(s => s.id === 'rackPost').length).toBe(1); expect(shapesAt(spec(k), 1, 'front').filter(s => s.id === 'rackPost').length).toBe(2); }
  });
});

describe('recenzja niezależna 28.10.2026 — F2: stojak wewnątrz talerzy (było: słupki w |z| = 76 na zewnątrz talerzy 64,6–72,4, bolce pod talerzami)', () => {
  const RACK = ['Rack Pull', 'Rack Pull with Bands', 'Good Morning off Pins', 'Pin Press'];
  test('słupki stojaka (|z| + połowa grubości) leżą wewnątrz wewnętrznej krawędzi talerzy; bolec sięga ku środkowi i leży pod gryfem między talerzami', () => {
    expect(EQUIP.rackZ + EQUIP.postW / 2).toBeLessThan(EQUIP.plateZ[0] - EQUIP.plateW / 2);
    expect(EQUIP.rackZ - EQUIP.pinLen).toBeGreaterThan(0);
    for (const k of RACK) for (const v of spec(k).views) { if (v === 'side') continue; const sh = shapesAt(spec(k), 1, v);
      const posts = sh.filter(s => s.id === 'rackPost'); const pins = sh.filter(s => s.id === 'rackPin' && s.k === 'line');
      expect([k, v, posts.length, pins.length]).toEqual([k, v, 2, 2]);
      for (const p of pins) if (p.k === 'line') expect([k, v, Math.max(Math.abs(p.a[0]), Math.abs(p.b[0])) < EQUIP.plateZ[0] - EQUIP.plateW / 2]).toEqual([k, v, true]); }
  });
  test('gryf rysowany nad słupkami (kolejność rysowania: gryf wyżej niż słupek)', () => {
    for (const k of RACK) for (const v of spec(k).views) { const sh = sortShapes(shapesAt(spec(k), 1, v)); const iBar = sh.findIndex(s => s.id === 'bar'); const iPost = sh.findIndex(s => s.id === 'rackPost'); expect([k, v, iBar > iPost]).toEqual([k, v, true]); }
  });
});

describe('recenzja niezależna 28.10.2026 — N2: deska Board Press widoczna z góry (było: zasłonięta tułowiem)', () => {
  test('w widoku z góry deska rysowana nad tułowiem; z boku nadal jest', () => {
    const sh = sortShapes(shapesAt(spec('Board Press'), 1, 'top')); expect(sh.findIndex(s => s.id === 'board')).toBeGreaterThan(sh.findIndex(s => s.id === 'torso'));
    expect(shapesAt(spec('Board Press'), 1, 'side').some(s => s.id === 'board')).toBe(true);
  });
});

describe('recenzja niezależna 28.10.2026 — N5: guma Band Squat nie wchodzi w nogi (było: 3 cm w udzie przy u ≈ 0,375)', () => {
  test('odstęp gumy (odcinek stopa–dłoń) od kapsuł ud i podudzi ≥ 0 w każdej klatce', () => {
    for (const u of U) { const f = fr('Band Squat', u); const legs = bodyColliders(f.sk).filter(b => /^(thigh|shank)/.test(b.id));
      for (const b of f.props.filter(p => p.k === 'band') as unknown as { from: V3; to: V3 }[]) for (const l of legs) if (l.k === 'capsule') expect([u, l.id, distSegSeg(b.from, b.to, l.a, l.b) - l.r >= 0]).toEqual([u, l.id, true]); }
  });
});

describe('F1 (badacz 28.10.2026, JM Press): łokcie wysoko, ramię ku stopom, odwiedzenie stałe ok. 45°, sztanga w dół ku szyi (było: łokieć 26 cm za barkiem ku głowie i 10 cm poniżej barku, ramię 110° od pionu; w połowie ruchu odwiedzenie 57°, łokcie do z = 41)', () => {
  const K = 'JM Press';
  const up = (f: Frame, s: 'R' | 'L') => { const a = f.sk.arms[s]; return { dx: a.elbow[0] - a.shoulder[0], dy: a.elbow[1] - a.shoulder[1], dz: Math.abs(a.elbow[2] - a.shoulder[2]) }; };
  test('na dole ramię nie wskazuje ku głowie: 0–20° od pionu w stronę stóp (+x), łokieć ≥ 25 cm nad barkiem, obie strony', () => {
    for (const s of ['R', 'L'] as const) { const t = up(fr(K, 1), s); const a = deg(Math.atan2(t.dx, t.dy)); expect([s, a >= 0 && a <= 20, t.dy >= 25]).toEqual([s, true, true]); }
  });
  test('w całym ruchu łokieć nad barkiem lub nie niżej niż 5 cm pod nim i nigdy za barkiem ku głowie (dx ≥ −1)', () => {
    for (const u of U) for (const s of ['R', 'L'] as const) { const t = up(fr(K, u), s); expect([u, s, t.dy >= -5, t.dx >= -1]).toEqual([u, s, true, true]); }
  });
  test('odwiedzenie z góry stałe ok. 45° (± 8°) w klatkach, gdzie ramię jest odchylone od pionu o ≥ 3 cm (u ≥ 0,3)', () => {
    for (const u of U.filter(x => x >= 0.3)) for (const s of ['R', 'L'] as const) { const t = up(fr(K, u), s); const ab = deg(Math.atan2(t.dz, Math.abs(t.dx))); expect([u, s, Math.hypot(t.dx, t.dz) >= 3, ab >= 37 && ab <= 53, +ab.toFixed(0)]).toEqual([u, s, true, true, +ab.toFixed(0)]); }
  });
  test('sztanga schodzi prawie pionowo ku szyi/podbródkowi: na dole 6–18 cm za barkiem (ku głowie), 0–15 cm nad osią barków; tor od prostej ≤ 4 cm; łokieć 130–149°', () => {
    const f = fr(K, 1); const sh = f.sk.arms.R.shoulder; const b = f.info.load as V3; expect([b[0] - sh[0] <= -6 && b[0] - sh[0] >= -18, b[1] - sh[1] >= 0 && b[1] - sh[1] <= 15]).toEqual([true, true]);
    const e = jointAngles(f.sk, 'R').elbow; expect([e >= 130 && e <= 149, +e.toFixed(0)]).toEqual([true, +e.toFixed(0)]);
    for (const u of U) expect([u, checkFrame(fr(K, u)).map(i => i.code)]).toEqual([u, []]);
  });
});
