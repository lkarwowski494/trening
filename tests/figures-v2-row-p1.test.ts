/*
 * Rodzina row (wiosłowanie; partia 1, linia 1.1, 09.11.2026): tor ciężaru w chwycie (K4/K5), styk ze sprzętem (K7), zakres łokcia z tekstu karty (K8), nakładka techniki i DATA_UI.
 * Rodzaje (docs/20): logika (miary), dane (12 póz z 13 ćwiczeń), silnik (nakładka), niezmienniki (przypadki negatywne każdej miary), regresja.
 * Progi wynikają z karty i geometrii (data/zrodla/figury-sens.json: zakres_lokcia ≥ 70° i ≤ 20°, lokiec_za_tulowiem ≥ 5 cm; wiosło T-bar: łuk dźwigni), nie z bieżących danych (K5).
 */
jest.mock('@/lib/figures/data.json', () => require('./figure-gate-open').openFigureGate(jest.requireActual('@/lib/figures/data.json'))); /* bramka 4 otwarta: test sprawdza rysunek i nakładkę, nie recenzję rodziny (tests/figure-gate-open.ts) */
import * as fs from 'fs';
import * as path from 'path';
import { assignAll, trunkChord, BODY, figureSpec, frameAt, jointAngles, poseKeys, DATA_UI, FAMILY, measuredJoint, phaseNames, angleLineShown, equipColliders, bodyColliders, gap, checkFrame, type FigureSpec, type V3 } from '@/lib/figures/v2';
import { TECHNIQUE, techniquesFor } from '@/lib/figures/v2/overlay';
import { ROW_TECHNIQUE, ROW_SUPPORTED_EXERCISES } from '@/lib/figures/v2/overlay/row';
import { techniquesOf, cueIdsOf, errorText, errorsOf } from '@/lib/figures/v2/ui';

const SENS = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'data/zrodla/figury-sens.json'), 'utf8')).rodziny.row;
const KEYS = poseKeys('row');
const ALL = assignAll() as Record<string, string>;
const spec = (k: string): FigureSpec => figureSpec(k) as FigureSpec;
const US = Array.from({ length: 41 }, (_, i) => i / 40);
const d3 = (a: readonly number[], b: readonly number[]) => Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);

/** Odległość punktu od odcinka a–b (3D). */
function distSeg(p: V3, a: V3, b: V3): number {
  const ab = [b[0] - a[0], b[1] - a[1], b[2] - a[2]]; const l2 = ab[0] ** 2 + ab[1] ** 2 + ab[2] ** 2 || 1e-12;
  const t = Math.max(0, Math.min(1, ((p[0] - a[0]) * ab[0] + (p[1] - a[1]) * ab[1] + (p[2] - a[2]) * ab[2]) / l2));
  return d3(p, [a[0] + ab[0] * t, a[1] + ab[1] * t, a[2] + ab[2] * t]);
}
/** Ślad w chwycie: para hantli / dwie linki / jedna ręka → chwyt R (W1b); jeden przedmiot w obu rękach (gryf, T-bar, dźwignia) → odcinek między chwytami. */
const PARA_RECE = ['Bent Over Row (hantle)', 'Bent Over Row (linki)', 'Chest Supported Row', 'One Arm Row (hantle)'];
const PROG_SLADU = 3;
const sladOdChwytu = (s: FigureSpec, k: string, u: number, przesun = 0): number => {
  const f = frameAt(s, u); const tr = (f.info.trail ?? f.info.load) as V3; const p: V3 = [tr[0], tr[1] + przesun, tr[2]]; const A = f.sk.arms;
  return PARA_RECE.includes(k) ? d3(p, A.R.grip) : distSeg(p, A.R.grip, A.L.grip);
};
/** Kształt toru w rzucie z boku: odchylenie od prostej między końcami (cm) i liczba zawróceń w poziomie. */
function ksztalt(pts: [number, number][]): { odchylenie: number; zawrocenia: number } {
  const [a, b] = [pts[0], pts[pts.length - 1]]; const dx = b[0] - a[0], dy = b[1] - a[1], L = Math.hypot(dx, dy) || 1;
  const odchylenie = Math.max(...pts.map(p => Math.abs((p[0] - a[0]) * dy - (p[1] - a[1]) * dx) / L)); let zawrocenia = 0, sg = 0;
  for (let i = 1; i < pts.length; i++) { const d = pts[i][0] - pts[i - 1][0]; if (Math.abs(d) < 0.05) continue; const s = Math.sign(d); if (sg && s !== sg) zawrocenia++; sg = s; }
  return { odchylenie, zawrocenia };
}
/** Próg odchylenia toru: tor prostoliniowy 4 cm (jak tests/figures-v2-tor.test.ts); dźwignia obrotowa (T-Bar Row, Lying T-Bar Row) — strzałka łuku r·(1 − cos(Δθ/2)) + 2 cm,
 * gdzie r i oś z danych sprzętu (pole „dzwignia” w poses/row.json), a Δθ to kąt między promieniami do chwytu na początku i końcu ruchu. */
const POSY = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'lib/figures/v2/poses/row.json'), 'utf8')).cwiczenia as Record<string, { sprzet: { rodzaj: string; x?: number; y?: number; dlugosc?: number }[] }>;
const dzwignia = (k: string) => POSY[k].sprzet.find(g => g.rodzaj === 'dzwignia');
const progToru = (k: string, tor?: [number, number][]): number => {
  const l = dzwignia(k); if (!l || !tor) return 4; const P: [number, number] = [l.x as number, l.y as number];
  const a0 = Math.atan2(tor[0][1] - P[1], tor[0][0] - P[0]), a1 = Math.atan2(tor[tor.length - 1][1] - P[1], tor[tor.length - 1][0] - P[0]);
  return (l.dlugosc as number) * (1 - Math.cos(Math.abs(a1 - a0) / 2)) + 2;
};

describe('row: rodzina podłączona (09.11.2026)', () => {
  test('status ready, plik póz, 12 z 13 ćwiczeń ma rysunek; Meadows Row bez rysunku (wyjątek z powodem w generatorze: landmine + jedna ręka)', () => {
    expect(FAMILY.row.status).toBe('ready'); expect(KEYS.length).toBe(12);
    expect(Object.keys(ALL).filter(k => ALL[k] === 'row').sort()).toEqual([...KEYS, 'Meadows Row'].sort());
    for (const k of KEYS) expect([k, spec(k).family]).toEqual([k, 'row']);
    expect(figureSpec('Meadows Row')).toBeNull();
  });
  test('DATA_UI: nazwy faz Podciąganie/Opuszczanie, mierzony łokieć; linia kąta pokazana w każdym ćwiczeniu (łokieć rusza się > 15°)', () => {
    expect(DATA_UI.row).toEqual({ names: { first: 'Podciąganie', second: 'Opuszczanie' }, lowerFirst: false, joints: ['elbow'] });
    for (const k of KEYS) { expect([k, measuredJoint(spec(k))]).toEqual([k, 'elbow']); expect([k, angleLineShown(spec(k))]).toEqual([k, true]); expect([k, phaseNames(spec(k)).first]).toEqual([k, 'Podciąganie']); }
  });
});

describe('row: ślad ciężaru w chwycie (K4/K5)', () => {
  test(`każde ćwiczenie, każda klatka (co 0,025): ślad ≤ ${PROG_SLADU} cm od chwytu (hantle/linki/jednorącz: chwyt R; gryf, T-bar, dźwignia: odcinek między chwytami)`, () => {
    for (const k of KEYS) { const m = Math.max(...US.map(u => sladOdChwytu(spec(k), k, u))); expect([k, m <= PROG_SLADU]).toEqual([k, true]); }
  });
  test('przypadek negatywny: ślad przesunięty o 5 cm od chwytu oblewa miarę w KAŻDYM ćwiczeniu (miara potrafi paść)', () => {
    for (const k of KEYS) { const m = Math.max(...US.map(u => sladOdChwytu(spec(k), k, u, 5))); expect([k, m > PROG_SLADU]).toEqual([k, true]); }
  });
  test('kształt toru w rzucie z boku: bez zawróceń „S” i w granicy z geometrii (tor prostoliniowy 4 cm; dźwignia: strzałka łuku + 2 cm)', () => {
    for (const k of KEYS) { const pts = US.map(u => { const p = (frameAt(spec(k), u).info.trail ?? frameAt(spec(k), u).info.load) as V3; return [p[0], p[1]] as [number, number]; }); const t = ksztalt(pts);
      expect([k, t.zawrocenia <= 1, t.odchylenie <= progToru(k, pts)]).toEqual([k, true, true]); }
  });
  test('przypadek negatywny kształtu: tor „S” (4,2 cm, 2 zawrócenia) i łuk 12 cm przy progu 4 cm padają', () => {
    expect(ksztalt([[9.6, 23], [12, 30], [13.6, 49], [11.5, 56], [4.8, 66], [6.5, 72], [8.6, 76]]).zawrocenia).toBeGreaterThan(1);
    expect(ksztalt([[0, 0], [8, 6], [10, 12], [8, 18], [0, 24]]).odchylenie).toBeGreaterThan(progToru('Bent Over Row (sztanga)'));
    const L = dzwignia('T-Bar Row')!; const pts: [number, number][] = [[L.x! + 101.3 * Math.cos(21.2 * Math.PI / 180), L.y! + 101.3 * Math.sin(21.2 * Math.PI / 180)], [L.x! + 101.3 * Math.cos(46 * Math.PI / 180), L.y! + 101.3 * Math.sin(46 * Math.PI / 180)]];
    expect(progToru('T-Bar Row', pts)).toBeCloseTo(101.3 * (1 - Math.cos(12.4 * Math.PI / 180)) + 2, 3); expect(progToru('Pendlay Row', pts)).toBe(4);
  });
});

describe('row: styk ze sprzętem (K7) i poprawność klatek', () => {
  test('ciało (poza dłońmi) nie wchodzi w ławkę ani podpórkę głębiej niż 1 cm w klatkach co 0,025; checkFrame bez uwag', () => {
    for (const k of KEYS) for (const u of US) { const f = frameAt(spec(k), u); const pr = equipColliders(f.props).filter(c => c.k === 'prism'); const body = bodyColliders(f.sk).filter(b => !/^hand/.test(b.id));
      for (const p of pr) for (const b of body) expect([k, u, b.id, gap(b, p) >= -1]).toEqual([k, u, b.id, true]);
      expect([k, u, checkFrame(f).map(i => i.code)]).toEqual([k, u, []]); }
  });
  test('przypadek negatywny: ławka podniesiona o 3 cm daje przenikanie > 1 cm w wiosłowaniu z podparciem', () => {
    const f = frameAt(spec('Chest Supported Row'), 0.5); const body = bodyColliders(f.sk).filter(b => !/^hand/.test(b.id));
    const worst = (dy: number) => Math.min(...equipColliders(f.props).filter(c => c.k === 'prism').flatMap(p => body.map(b => gap(b, { ...p, poly: (p as { poly: [number, number][] }).poly.map(([x, y]) => [x, y + dy] as [number, number]) } as typeof p))));
    expect(worst(3)).toBeLessThan(-1);
  });
  test('hantle trzymane osią wzdłuż ruchu (chwyt neutralny, obrot 0): oś hantla równoległa do osi x w klatce 0 i 1', () => {
    for (const k of ['Bent Over Row (hantle)', 'One Arm Row (hantle)', 'Chest Supported Row']) for (const u of [0, 1]) {
      const f = frameAt(spec(k), u); const db = f.props.filter(p => p.k === 'dumbbell') as unknown as { axis?: V3; c: V3 }[]; expect([k, db.length > 0]).toEqual([k, true]);
      for (const h of db) if (h.axis) expect([k, u, Math.abs(h.axis[2]) < 0.35]).toEqual([k, u, true]);
    }
  });
});

describe('row: zakres łokcia z tekstu karty (K8: zakres_lokcia ≥ 70° i ≤ 20°; lokiec_za_tulowiem ≥ 5 cm)', () => {
  const PRAC = (k: string): ('R' | 'L')[] => (k === 'One Arm Row (hantle)' ? ['R'] : ['R', 'L']);
  const zakres = (s: FigureSpec, k: string) => PRAC(k).map(side => { const a = US.map(u => jointAngles(frameAt(s, u).sk, side).elbow); return { min: Math.min(...a), max: Math.max(...a) }; });
  test('próg z danych reguły = karta (70° i 20°, 5 cm)', () => { expect(SENS.reguly.zakres_lokcia.parametry).toEqual({ min_max_deg: 70, max_min_deg: 20 }); expect(SENS.reguly.lokiec_za_plecami.parametry).toEqual({ min_cm: 5 }); });
  test('każde ćwiczenie, każda pracująca ręka: łokieć ≤ 20° na dole i ≥ 70° na górze', () => {
    for (const k of KEYS) for (const z of zakres(spec(k), k)) expect([k, z.min <= 20, z.max >= 70]).toEqual([k, true, true]);
  });
  test('łokieć mija linię barku ≥ 5 cm w stronę pleców w każdym ćwiczeniu (dot z sk.front, jak v2-sens lokiec_za_tulowiem)', () => {
    for (const k of KEYS) { const best = Math.max(...PRAC(k).flatMap(side => US.map(u => { const sk = frameAt(spec(k), u).sk; const e = sk.arms[side].elbow, sh = sk.arms[side].shoulder; return -(((e[0] - sh[0]) * sk.front[0]) + ((e[1] - sh[1]) * sk.front[1]) + ((e[2] - sh[2]) * sk.front[2])); }))); expect([k, best >= 5]).toEqual([k, true]); }
  });
  test('przypadek negatywny: łokieć o stałym zgięciu 45° nie spełnia zakresu (min > 20°)', () => { const a = [45, 45, 45]; expect(Math.min(...a) <= 20).toBe(false); expect(Math.max(...a) >= 70).toBe(false); });
});

describe('row: nakładka techniki', () => {
  test('rejestr: row = rowElbowLimb (limb, łokieć, z boku) + rowElbowPastBackRef (pion przez bark, tylko z podparciem)', () => {
    expect(TECHNIQUE.row).toBe(ROW_TECHNIQUE); expect(ROW_TECHNIQUE.map(d => d.id)).toEqual(['rowElbowLimb', 'rowElbowPastBackRef']);
    expect([ROW_TECHNIQUE[0].kind, ROW_TECHNIQUE[0].joint, ROW_TECHNIQUE[0].views, ROW_TECHNIQUE[0].rule]).toEqual(['limb', 'elbow', ['side'], 'zakres_lokcia']);
    expect([ROW_TECHNIQUE[1].kind, ROW_TECHNIQUE[1].ref, ROW_TECHNIQUE[1].views, ROW_TECHNIQUE[1].exercises, ROW_TECHNIQUE[1].rule]).toEqual(['ref', { shape: 'vertical', through: 'shoulder', dir: 'both' }, ['side'], ROW_SUPPORTED_EXERCISES, 'lokiec_za_plecami']);
    for (const d of ROW_TECHNIQUE) { expect(SENS.reguly[d.rule].pewnosc).toMatch(/^ustalone/); for (const c of d.cue) expect(Object.keys(SENS.wskazowki_na_reguly)).toContain(c); expect(SENS.wskazowki_na_reguly[d.cue[0]]).toContain(d.rule); }
  });
  test('element ⇔ wskazówka na karcie i reguła „ustalone” wariantu: techniquesOf = filtr definicji; zdanie elementu istnieje; pion barku tylko przy wiosłowaniu z podparciem', () => {
    for (const k of KEYS) { const have = new Set(cueIdsOf(k).ids); const want = ROW_TECHNIQUE.filter(d => d.cue.some(c => have.has(c)) && (!d.exercises || d.exercises.includes(k)) && (JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'lib/figures/v2/reguly-cwiczen.json'), 'utf8')).row[k] ?? []).includes(d.rule)).map(d => d.id);
      expect([k, techniquesOf(k)]).toEqual([k, want]); expect(techniquesFor('row', have, k).map(d => d.id)).toEqual(want);
      for (const id of want) expect(errorText(ROW_TECHNIQUE.find(d => d.id === id)!.cue.find(c => have.has(c))!).length).toBeGreaterThan(0);
      expect([k, want.includes('rowElbowPastBackRef')]).toEqual([k, ROW_SUPPORTED_EXERCISES.includes(k) && have.size > 0 && techniquesOf(k).includes('rowElbowPastBackRef')]); }
    expect(techniquesFor('row', ['row.fullStretch'], 'Bent Over Row (sztanga)').map(d => d.id)).toEqual(['rowElbowLimb']);
    expect(techniquesFor('row', ['csr.pull'], 'Chest Supported Row').map(d => d.id)).toEqual(['rowElbowLimb', 'rowElbowPastBackRef']);
    expect(techniquesFor('row', ['csr.pull'], 'Bent Over Row (sztanga)').map(d => d.id)).toEqual(['rowElbowLimb']);
    expect(techniquesFor('row', ['dl.lift'])).toEqual([]);
  });
});

describe('row: błąd „zaokrąglone plecy” widoczny (09.11.2026: zgięcie 32° → 40°)', () => {
  const OBNIZENIE = (bendDeg: number) => BODY.trunk * (1 - trunkChord(bendDeg));
  test('na końcu ruchu bark, głowa i łokieć przesuwają się o ≥ 3 cm (CONTRACT.visibleCm) w każdym ćwiczeniu z błędem; zgięcie 32° (poprzednie, 2,3 cm) tego nie spełniało', () => {
    expect(OBNIZENIE(32)).toBeLessThan(3); expect(OBNIZENIE(40)).toBeGreaterThanOrEqual(3);
    const z = KEYS.filter(k => errorsOf(spec(k)).length > 0); expect(z.length).toBeGreaterThanOrEqual(5);
    for (const k of z) for (const e of errorsOf(spec(k))) { const a = frameAt(spec(k), 1).sk, b = frameAt(spec(k), 1, e.error).sk; const dd = Math.max(d3(a.shoulderC, b.shoulderC), d3(a.head, b.head), d3(a.arms.R.elbow, b.arms.R.elbow)); expect([k, e.cue, dd >= 3]).toEqual([k, 'mis.roundBack', true]); }
  });
});
