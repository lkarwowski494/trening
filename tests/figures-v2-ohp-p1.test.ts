/*
 * Rodzina overhead_press (wyciskanie nad głowę i pionowe; partia 1, linia 1.1, 09.11.2026): tor ciężaru w chwycie (K4/K5), styk ze sprzętem i głową (K7), oś hantla (K6), zakres stawu i położenie chwytu z reguł (K8),
 * nakładka techniki i DATA_UI. Rodzaje (docs/20): logika (miary), dane (21 póz z 23 ćwiczeń), silnik (nakładka), niezmienniki (przypadki negatywne każdej miary), regresja.
 * Progi wynikają z reguł „ustalone” w data/zrodla/figury-sens.json (overhead_press: wyprost_lokci ≤ 20°, start_przy_barkach ≤ 20 cm, ciezar_nad_glowe ≥ 10 cm, ciezar_nad_barkami ≤ 10 cm, lokcie_pod_dlonmi ≤ 10 cm, krotkie_ugiecie 15–60°)
 * i z geometrii (ślad ≤ 3 cm od chwytu), nie z bieżących danych (K5).
 */
jest.mock('@/lib/figures/data.json', () => require('./figure-gate-open').openFigureGate(jest.requireActual('@/lib/figures/data.json'))); /* bramka 4 otwarta: test sprawdza rysunek i nakładkę, nie recenzję rodziny (tests/figure-gate-open.ts) */
import * as fs from 'fs';
import * as path from 'path';
import { assignAll, keyframeFrame, type PoseData, figureSpec, frameAt, jointAngles, poseKeys, DATA_UI, FAMILY, measuredJoint, phaseNames, angleLineShown, equipColliders, bodyColliders, gap, checkFrame, POSE_FAMILIES, type FigureSpec, type V3 } from '@/lib/figures/v2';
import { lowerFirstOf } from '@/lib/figures/v2/poseData';
import { TECHNIQUE, techniquesFor, refGeom2D } from '@/lib/figures/v2/overlay';
import { OHP_TECHNIQUE } from '@/lib/figures/v2/overlay/overhead_press';
import { techniquesOf, cueIdsOf, errorsOf } from '@/lib/figures/v2/ui';
import { proj } from '@/lib/figures/v2';

const ROOT = path.join(__dirname, '..');
const SENS = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/zrodla/figury-sens.json'), 'utf8')).rodziny.overhead_press;
const REGULY = JSON.parse(fs.readFileSync(path.join(ROOT, 'lib/figures/v2/reguly-cwiczen.json'), 'utf8')).overhead_press as Record<string, string[]>;
const POSY = JSON.parse(fs.readFileSync(path.join(ROOT, 'lib/figures/v2/poses/overhead_press.json'), 'utf8')).cwiczenia as Record<string, PoseData>;
const KEYS = poseKeys('overhead_press');
const ALL = assignAll() as Record<string, string>;
const spec = (k: string): FigureSpec => figureSpec(k) as FigureSpec;
const US = Array.from({ length: 41 }, (_, i) => i / 40);
const d3 = (a: readonly number[], b: readonly number[]) => Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);
type Side = 'R' | 'L';
/** Ręce pracujące: ćwiczenie jednorącz — R; reszta (także see-saw, naprzemiennie) — obie. */
const JEDNA = ['Kettlebell Press', 'Kettlebell Seated Press', 'Single Arm Overhead Press (hantel)', 'Kettlebell Arnold Press', 'Single-Arm Linear Jammer'];
const PRAC = (k: string): Side[] => (JEDNA.includes(k) ? ['R'] : ['R', 'L']);
const STOJACE_WYCISKANIE = KEYS.filter(k => (REGULY[k] ?? []).includes('wyprost_lokci'));

function distSeg(p: V3, a: V3, b: V3): number {
  const ab = [b[0] - a[0], b[1] - a[1], b[2] - a[2]]; const l2 = ab[0] ** 2 + ab[1] ** 2 + ab[2] ** 2 || 1e-12;
  const t = Math.max(0, Math.min(1, ((p[0] - a[0]) * ab[0] + (p[1] - a[1]) * ab[1] + (p[2] - a[2]) * ab[2]) / l2));
  return d3(p, [a[0] + ab[0] * t, a[1] + ab[1] * t, a[2] + ab[2] * t]);
}
/** Ślad w chwycie: gryf/landmine oburącz i sztanga → odcinek między chwytami; para hantli, dwa kettlebelle, linki, guma, jedna ręka → chwyt R (W1b; trzyma „R”). Pike Push Up nie ma ciężaru (ślad = miednica). */
const SEGMENT = ['Overhead Press (sztanga)', 'Seated Barbell Military Press', 'Push Press', 'Standing Barbell Press Behind Neck', 'Push Press - Behind the Neck', 'Landmine Press', 'Landmine Linear Jammer'];
const PROG_SLADU = 3;
const sladOdChwytu = (s: FigureSpec, k: string, u: number, przesun = 0): number => {
  const f = frameAt(s, u); const tr = (f.info.trail ?? f.info.load) as V3; const p: V3 = [tr[0], tr[1] + przesun, tr[2]]; const A = f.sk.arms;
  return SEGMENT.includes(k) ? distSeg(p, A.R.grip, A.L.grip) : d3(p, A.R.grip);
};
const BEZ_CIEZARU = ['Pike Push Up'];
const KEYS_CIEZAR = KEYS.filter(k => !BEZ_CIEZARU.includes(k));

describe('overhead_press: rodzina podłączona (09.11.2026)', () => {
  test('status ready, plik póz w rejestrze, 21 z 23 ćwiczeń ma rysunek; Bradford Press i Handstand Push Up bez rysunku (OTWARTE: brak źródła ruchu — WYJATKI w agent-pozy/overhead_press.mjs)', () => {
    expect(FAMILY.overhead_press.status).toBe('ready'); expect(POSE_FAMILIES).toContain('overhead_press'); expect(KEYS.length).toBe(21);
    expect(Object.keys(ALL).filter(k => ALL[k] === 'overhead_press').sort()).toEqual([...KEYS, 'Bradford Press', 'Handstand Push Up'].sort());
    for (const k of KEYS) expect([k, spec(k).family]).toEqual([k, 'overhead_press']);
    expect(figureSpec('Bradford Press')).toBeNull(); expect(figureSpec('Handstand Push Up')).toBeNull();
  });
  test('DATA_UI: Wypychanie/Opuszczanie, mierzony łokieć (rusza się > 15° w każdym ćwiczeniu); Pike Push Up odwrócony (najpierw opuszczanie, 2 s)', () => {
    expect(DATA_UI.overhead_press.names).toEqual({ first: 'Wypychanie', second: 'Opuszczanie' }); expect(DATA_UI.overhead_press.joints).toEqual(['elbow']);
    for (const k of KEYS) { expect([k, measuredJoint(spec(k))]).toEqual([k, 'elbow']); expect([k, angleLineShown(spec(k))]).toEqual([k, true]); }
    for (const k of KEYS.filter(x => x !== 'Pike Push Up')) { expect([k, phaseNames(spec(k)).first, lowerFirstOf(DATA_UI.overhead_press, k)]).toEqual([k, 'Wypychanie', false]); }
    expect([phaseNames(spec('Pike Push Up')).first, lowerFirstOf(DATA_UI.overhead_press, 'Pike Push Up')]).toEqual(['Opuszczanie', true]);
    const j = (k: string, u: number) => jointAngles(frameAt(spec(k), u).sk, 'R').elbow;
    expect(j('Pike Push Up', 0)).toBeLessThan(20); expect(j('Pike Push Up', 1)).toBeGreaterThan(90); /* u: 0 → 1 to opuszczanie (ręce proste → zgięte), więc wyjątek lowerFirst jest prawdziwy, a nie dobrany do testu */
  });
});

describe('overhead_press: ślad ciężaru w chwycie (K4/K5)', () => {
  test(`każde ćwiczenie z ciężarem, każda klatka (co 0,025): ślad ≤ ${PROG_SLADU} cm od chwytu (sztanga, landmine oburącz: odcinek między chwytami; hantle, kettlebelle, linki, guma, jednorącz: chwyt R)`, () => {
    for (const k of KEYS_CIEZAR) { const m = Math.max(...US.map(u => sladOdChwytu(spec(k), k, u))); expect([k, m <= PROG_SLADU]).toEqual([k, true]); }
  });
  test('przypadek negatywny: ślad przesunięty o 5 cm od chwytu oblewa miarę w KAŻDYM ćwiczeniu z ciężarem (miara potrafi paść)', () => {
    for (const k of KEYS_CIEZAR) { const m = Math.max(...US.map(u => sladOdChwytu(spec(k), k, u, 5))); expect([k, m > PROG_SLADU]).toEqual([k, true]); }
  });
  test('regresja: Single-Arm Linear Jammer — gryf (20 cm, środek na osi ciała) sięga dłoni, ślad ≤ 3 cm od chwytu R; dłoń 12 cm od osi (stan sprzed poprawki) przekraczała próg', () => {
    for (const u of US) { const f = frameAt(spec('Single-Arm Linear Jammer'), u); expect(Math.abs(f.sk.arms.R.grip[2])).toBeLessThanOrEqual(10); }
    const f = frameAt(spec('Single-Arm Linear Jammer'), 0.5); const stary: V3 = [f.sk.arms.R.grip[0], f.sk.arms.R.grip[1], 12]; expect(Math.abs(stary[2] - 0) > PROG_SLADU).toBe(true);
  });
  test('Pike Push Up nie ma ciężaru: ślad = miednica (znacznik błędu), nie punkt w powietrzu', () => {
    for (const u of [0, 0.5, 1]) { const f = frameAt(spec('Pike Push Up'), u); expect(d3((f.info.trail ?? f.sk.pelvis) as V3, f.sk.pelvis)).toBeLessThan(0.5); }
  });
});

describe('overhead_press: styk ze sprzętem i głową (K7) i poprawność klatek', () => {
  const BEZ_RAMION = /^(hand|farm)/; /* chwyt: ciężar leży w dłoni, więc dłoń i przedramię z definicji dotykają ciężaru */
  test('ciężar (sztanga, hantel, kettlebell, linka) nie wchodzi w głowę, tułów ani ramię w żadnej klatce (co 0,025): odstęp ≥ 0 cm (najmniejszy ok. 0,7 cm: kettlebell przy głowie w Arnoldzie)', () => {
    for (const k of KEYS) for (const u of US) { const f = frameAt(spec(k), u); const body = bodyColliders(f.sk).filter(b => !BEZ_RAMION.test(b.id));
      for (const c of equipColliders(f.props).filter(x => x.k !== 'prism')) for (const b of body) { if (k.includes('Behind the Neck') || k.includes('Behind Neck')) continue; expect([k, u, c.id, b.id, gap(b, c) >= 0]).toEqual([k, u, c.id, b.id, true]); } }
  });
  test('zza karku: gryf nie wchodzi w głowę ani szyję (odstęp ≥ 0 cm; najmniejszy ok. 1,9 cm)', () => {
    for (const k of ['Standing Barbell Press Behind Neck', 'Push Press - Behind the Neck']) for (const u of US) { const f = frameAt(spec(k), u); const bar = equipColliders(f.props).find(c => c.id === 'bar')!;
      for (const b of bodyColliders(f.sk).filter(x => x.id === 'head' || x.id === 'neck')) expect([k, u, b.id, gap(b, bar) >= 0]).toEqual([k, u, b.id, true]); }
  });
  test('ciało (poza dłońmi) nie wchodzi w ławkę ani słupek głębiej niż 1 cm; checkFrame bez uwag w każdej klatce', () => {
    for (const k of KEYS) for (const u of US) { const f = frameAt(spec(k), u); const pr = equipColliders(f.props).filter(c => c.k === 'prism'); const body = bodyColliders(f.sk).filter(b => !/^hand/.test(b.id));
      for (const p of pr) for (const b of body) expect([k, u, p.id, b.id, gap(b, p) >= -1]).toEqual([k, u, p.id, b.id, true]);
      expect([k, u, checkFrame(f).map(i => i.code)]).toEqual([k, u, []]); }
  });
  test('przypadek negatywny: gryf przeniesiony na środek głowy daje przenikanie (miara odstępu potrafi paść); ławka podniesiona o 6 cm wchodzi w udo głębiej niż 1 cm', () => {
    const f = frameAt(spec('Overhead Press (sztanga)'), 0.5); const bar = equipColliders(f.props).find(c => c.id === 'bar')!; const head = bodyColliders(f.sk).find(b => b.id === 'head')!;
    expect(gap(head, bar)).toBeGreaterThan(0); expect(gap(head, { ...bar, a: f.sk.head, b: f.sk.head } as typeof bar)).toBeLessThan(0);
    const g = frameAt(spec('Seated Shoulder Press (hantle)'), 0); const thigh = bodyColliders(g.sk).find(b => b.id === 'thighR')!; const seat = equipColliders(g.props).find(c => c.id === 'benchSeat')!;
    const lift = (dy: number) => gap(thigh, { ...seat, poly: (seat as { poly: [number, number][] }).poly.map(([x, y]) => [x, y + dy] as [number, number]) } as typeof seat);
    expect(lift(0)).toBeGreaterThanOrEqual(-1); expect(lift(6)).toBeLessThan(-1);
  });
});

describe('overhead_press: oś hantla przy chwycie nachwytem (K6, recenzja własna 09.11.2026)', () => {
  const HANTLE = ['Overhead Press (hantle)', 'Seated Shoulder Press (hantle)', 'Single Arm Overhead Press (hantel)', 'See-Saw Press (Alternating Side Press)'];
  const odchylenieOsi = (frames: ReturnType<typeof frameAt>[]) => Math.max(...frames.flatMap(f => f.props.filter(p => p.k === 'dumbbell').map(p => { const ax = (p as unknown as { axis?: V3 }).axis; return ax ? Math.acos(Math.min(1, Math.abs(ax[2]))) * 180 / Math.PI : 0; })));
  test('oś hantla stale w poprzek ciała (odchylenie od osi z ≤ 15° w każdej klatce co 0,025): dłonie do przodu, hantel się nie obraca', () => {
    for (const k of HANTLE) expect([k, odchylenieOsi(US.map(u => frameAt(spec(k), u))) <= 15]).toEqual([k, true]);
  });
  test('przypadek negatywny: te same pozy z obrotem przedramienia 0 (chwyt młotkowy, stan sprzed poprawki) mają oś odchyloną o > 30° od osi z — miara potrafi paść', () => {
    for (const k of HANTLE) { const stara = { ...POSY[k], klatki: POSY[k].klatki.map(kl => ({ ...kl, rece: Object.fromEntries(Object.entries(kl.rece ?? {}).map(([s, r]) => [s, { ...(r as object), obrotPrzedramienia: 0 }])) })) } as PoseData;
      const fr = stara.klatki.map((_, i) => keyframeFrame(stara, i)); expect([k, odchylenieOsi(fr as unknown as ReturnType<typeof frameAt>[]) > 30]).toEqual([k, true]); }
  });
  test('dane: obrót przedramienia −80° (granica zakresu kontraktu) w pozach czterech ćwiczeń z hantlami nachwytem; Arnold zachowuje obrót od 80° do −75°', () => {
    for (const k of HANTLE) for (const kl of POSY[k].klatki) for (const r of Object.values(kl.rece ?? {})) if ((r as { obrotPrzedramienia?: number }).obrotPrzedramienia !== undefined) expect([k, (r as { obrotPrzedramienia: number }).obrotPrzedramienia]).toEqual([k, -80]);
    const ar = POSY['Arnold Press'].klatki.map(kl => (kl.rece?.R as { obrotPrzedramienia?: number }).obrotPrzedramienia); expect([ar[0], ar[ar.length - 1]]).toEqual([80, -75]);
  });
});

describe('overhead_press: zakres stawu i położenie chwytu z reguł karty (K8)', () => {
  const P = SENS.reguly;
  const elbowMin = (k: string, side: Side) => Math.min(...US.map(u => jointAngles(frameAt(spec(k), u).sk, side).elbow));
  const elbowMax = (k: string, side: Side) => Math.max(...US.map(u => jointAngles(frameAt(spec(k), u).sk, side).elbow));
  /** Klatka najwyższego chwytu danej ręki (szczyt ruchu tej ręki: w see-saw ręce są w przeciwfazie). */
  const szczyt = (k: string, side: Side) => US.map(u => frameAt(spec(k), u)).reduce((b, f) => (f.sk.arms[side].grip[1] > b.sk.arms[side].grip[1] ? f : b));
  const dno = (k: string, side: Side) => US.map(u => frameAt(spec(k), u)).reduce((b, f) => (f.sk.arms[side].grip[1] < b.sk.arms[side].grip[1] ? f : b));
  test('progi reguł = karta (łokieć ≤ 20°, chwyt ≤ 20 cm nad barkami na dole, ≥ 10 cm nad głową na górze, ≤ 10 cm przed/za barkiem, łokieć ≤ 10 cm od pionu pod chwytem)', () => {
    expect(P.wyprost_lokci.parametry).toEqual({ max_min_deg: 20 }); expect(P.start_przy_barkach.parametry).toEqual({ max_cm: 20 }); expect(P.ciezar_nad_glowe.parametry).toEqual({ min_cm: 10 });
    expect(P.ciezar_nad_barkami.parametry).toEqual({ max_cm: 10 }); expect(P.lokcie_pod_dlonmi.parametry).toEqual({ osie: ['x', 'z'], max_cm: 10 }); expect(P.krotkie_ugiecie.parametry).toEqual({ min_deg: 15, max_deg: 60 });
  });
  test('wyprost_lokci: łokieć każdej pracującej ręki ≤ 20° na szczycie w każdym wyciskaniu z regułą (nad głową: 9–16°)', () => {
    expect(STOJACE_WYCISKANIE.length).toBe(16); /* 12 wariantów _wyciskanie + 2 _arnold + Push Press + Standing Barbell Press Behind Neck (reguly-cwiczen.json); Push Press zza karku, landmine i pike nie mają reguły wyprostu „ustalone” */
    for (const k of STOJACE_WYCISKANIE) for (const s of PRAC(k)) expect([k, s, elbowMin(k, s) <= P.wyprost_lokci.parametry.max_min_deg]).toEqual([k, s, true]);
  });
  test('start_przy_barkach i ciezar_nad_glowe: na dole chwyt ≤ 20 cm nad barkami (reguła „ustalone”), na górze ≥ 10 cm nad głową i ≤ 10 cm przed/za barkiem', () => {
    for (const k of STOJACE_WYCISKANIE) for (const s of PRAC(k)) {
      const lo = dno(k, s).sk; const hi = szczyt(k, s).sk;
      if ((REGULY[k] ?? []).includes('start_przy_barkach')) expect([k, s, lo.arms[s].grip[1] - lo.shoulderC[1] <= P.start_przy_barkach.parametry.max_cm]).toEqual([k, s, true]);
      if ((REGULY[k] ?? []).includes('ciezar_nad_glowe')) expect([k, s, hi.arms[s].grip[1] - hi.head[1] >= P.ciezar_nad_glowe.parametry.min_cm]).toEqual([k, s, true]);
      if ((REGULY[k] ?? []).includes('ciezar_nad_barkami')) expect([k, s, Math.abs(hi.arms[s].grip[0] - hi.shoulderC[0]) <= P.ciezar_nad_barkami.parametry.max_cm]).toEqual([k, s, true]);
    }
  });
  test('lokcie_pod_dlonmi: poziomy odstęp łokcia od NADGARSTKA i od chwytu ≤ 10 cm w każdej klatce (wyciskanie obustronne z regułą; nadgarstek, bo element nakładki prowadzi pion przez nadgarstek)', () => {
    const z_regula = KEYS.filter(k => (REGULY[k] ?? []).includes('lokcie_pod_dlonmi')); expect(z_regula.length).toBeGreaterThanOrEqual(10);
    for (const k of z_regula) for (const s of PRAC(k)) { const m = (p: 'wrist' | 'grip') => Math.max(...US.map(u => { const a = frameAt(spec(k), u).sk.arms[s]; return Math.hypot(a[p][0] - a.elbow[0], a[p][2] - a.elbow[2]); }));
      expect([k, s, m('wrist') <= 10, m('grip') <= 10]).toEqual([k, s, true, true]); }
  });
  test('krotkie_ugiecie (Push Press): zgięcie kolana ≤ 60° i ≥ 15° w ugięciu, nogi prostują się na górze (kolano na szczycie ≥ 10° mniej niż w ugięciu)', () => {
    for (const k of ['Push Press']) { const kn = US.map(u => jointAngles(frameAt(spec(k), u).sk, 'R').knee); expect([k, Math.max(...kn) >= 15, Math.max(...kn) <= 60, kn[kn.length - 1] <= Math.max(...kn) - 10]).toEqual([k, true, true, true]); }
  });
  test('landmine: łokieć na dole ≥ 70° i na górze ≤ 20° (analogia: zakres bez źródła toru; stały zakres wyciskania), Pike Push Up: ręce proste ≤ 20° na górze i ≥ 70° na dole', () => {
    for (const k of ['Landmine Press', 'Landmine Linear Jammer', 'Single-Arm Linear Jammer']) for (const s of PRAC(k)) expect([k, s, elbowMin(k, s) <= 20, elbowMax(k, s) >= 70]).toEqual([k, s, true, true]);
    expect([elbowMin('Pike Push Up', 'R') <= 20, elbowMax('Pike Push Up', 'R') >= 70]).toEqual([true, true]);
  });
  test('przypadki negatywne: łokieć stale 45° nie spełnia wyprostu (min > 20°); chwyt 15 cm za barkiem przekracza 10 cm; łokieć 14 cm od pionu pod nadgarstkiem przekracza 10 cm; chwyt 8 cm nad głową nie spełnia ≥ 10 cm', () => {
    expect(Math.min(45, 45, 45) <= P.wyprost_lokci.parametry.max_min_deg).toBe(false); expect(15 <= P.ciezar_nad_barkami.parametry.max_cm).toBe(false);
    expect(14 <= P.lokcie_pod_dlonmi.parametry.max_cm).toBe(false); expect(8 >= P.ciezar_nad_glowe.parametry.min_cm).toBe(false);
  });
});

describe('overhead_press: nakładka techniki', () => {
  test('rejestr: overhead_press = ohpElbowLimb (limb, łokieć, z boku) + ohpElbowsUnderRef (pion przez nadgarstek w dół do łokcia, z boku i z przodu) + ohpBarOverShoulderRef (pion przez bark w górę, z boku)', () => {
    expect(TECHNIQUE.overhead_press).toBe(OHP_TECHNIQUE); expect(OHP_TECHNIQUE.map(d => d.id)).toEqual(['ohpElbowLimb', 'ohpElbowsUnderRef', 'ohpBarOverShoulderRef']);
    expect([OHP_TECHNIQUE[0].kind, OHP_TECHNIQUE[0].joint, OHP_TECHNIQUE[0].views, OHP_TECHNIQUE[0].rule]).toEqual(['limb', 'elbow', ['side'], 'wyprost_lokci']);
    expect([OHP_TECHNIQUE[1].kind, OHP_TECHNIQUE[1].ref, OHP_TECHNIQUE[1].views, OHP_TECHNIQUE[1].rule]).toEqual(['ref', { shape: 'vertical', through: 'wrist', dir: 'down', until: 'elbow' }, ['side', 'front'], 'lokcie_pod_dlonmi']);
    expect([OHP_TECHNIQUE[2].kind, OHP_TECHNIQUE[2].ref, OHP_TECHNIQUE[2].views, OHP_TECHNIQUE[2].rule]).toEqual(['ref', { shape: 'vertical', through: 'shoulder', dir: 'up' }, ['side'], 'ciezar_nad_barkami']);
    for (const d of OHP_TECHNIQUE) { expect(SENS.reguly[d.rule].pewnosc).toMatch(/^ustalone/); for (const c of d.cue) expect(SENS.wskazowki_na_reguly[c]).toContain(d.rule); }
  });
  test('element ⇔ wskazówka na karcie i reguła „ustalone” wariantu: techniquesOf = filtr definicji; ćwiczenia bez wskazówki powiązanej z regułą (Arnold, Landmine, Pike, jednorącz) bez elementu', () => {
    for (const k of KEYS) { const have = new Set(cueIdsOf(k).ids); const want = OHP_TECHNIQUE.filter(d => d.cue.some(c => have.has(c)) && (REGULY[k] ?? []).includes(d.rule)).map(d => d.id);
      expect([k, techniquesOf(k)]).toEqual([k, want]); expect(techniquesFor('overhead_press', have, k).map(d => d.id)).toEqual(want); }
    for (const k of ['Arnold Press', 'Landmine Press', 'Landmine Linear Jammer', 'Single-Arm Linear Jammer', 'Pike Push Up', 'Single Arm Overhead Press (hantel)', 'Kettlebell Press']) expect([k, techniquesOf(k)]).toEqual([k, []]);
    expect(techniquesFor('overhead_press', ['ohp.tall'], 'Overhead Press (sztanga)').map(d => d.id)).toEqual(['ohpBarOverShoulderRef']);
    expect(techniquesFor('overhead_press', ['ohp.elbowsUnder'], 'Overhead Press (hantle)').map(d => d.id)).toEqual(['ohpElbowsUnderRef']);
    expect(techniquesFor('overhead_press', ['ohp.elbowsUnder'], 'Arnold Press')).toEqual([]); /* wariant _arnold: reguły lokcie_pod_dlonmi nie stosujemy (figury-sens.json otwarte_czesciowo) */
    expect(techniquesFor('overhead_press', ['ohp.move'], 'Landmine Press')).toEqual([]); /* landmine_wyprost to analogia, nie „ustalone” */
    expect(techniquesFor('overhead_press', ['dl.lift'])).toEqual([]);
  });
  const REF = (id: string) => OHP_TECHNIQUE.find(d => d.id === id)!.ref!;
  test('pion „łokcie pod nadgarstkami”: stoi na nadgarstku w obu rzutach, kończy się na wysokości łokcia; łokieć leży na nim (odstęp w osi rzutu ≤ 10 cm, ta sama miara co reguła) w każdej klatce', () => {
    for (const k of ['Overhead Press (hantle)', 'Seated Shoulder Press (hantle)', 'Wyciskanie nad głowę (linki)']) for (const side of ['R', 'L'] as Side[]) for (const view of ['side', 'front'] as const) for (const u of US) {
      const sk = frameAt(spec(k), u).sk; const g = refGeom2D(sk, side, view, REF('ohpElbowsUnderRef'))!; const w = proj(sk.arms[side].wrist, view), e = proj(sk.arms[side].elbow, view);
      expect([k, view, u, g[0][0] === w[0] && g[1][0] === w[0], Math.abs(Math.max(g[0][1], g[1][1]) - Math.max(w[1], e[1])) < 1e-6 || Math.min(g[0][1], g[1][1]) === e[1], Math.abs(e[0] - g[0][0]) <= 10]).toEqual([k, view, u, true, true, true]);
    }
  });
  test('pion „ciężar nad barkami”: stoi na barku (rzut z boku), a na szczycie chwyt leży w ≤ 10 cm od niego — ta sama miara co reguła ciezar_nad_barkami; przypadek negatywny: chwyt 15 cm od linii oblewa', () => {
    for (const k of ['Overhead Press (sztanga)', 'Overhead Press (hantle)', 'Wyciskanie nad głowę (linki)', 'Band Shoulder Press']) { const f = frameAt(spec(k), 1); const g = refGeom2D(f.sk, 'R', 'side', REF('ohpBarOverShoulderRef'))!; const gr = proj(f.sk.arms.R.grip, 'side');
      expect([k, g[0][0] === proj(f.sk.arms.R.shoulder, 'side')[0], Math.abs(gr[0] - g[0][0]) <= 10, g[1][1] > g[0][1]]).toEqual([k, true, true, true]); expect(Math.abs(gr[0] + 15 - g[0][0]) > 10).toBe(true); }
  });
  test('widok z góry i z przodu bez pionu barku (rzut z przodu nie niesie osi x); limb tylko z boku', () => {
    expect(refGeom2D(frameAt(spec('Overhead Press (sztanga)'), 0.5).sk, 'R', 'top', REF('ohpBarOverShoulderRef'))).toBeNull();
    for (const d of OHP_TECHNIQUE) expect(d.views).not.toContain('top');
    expect(OHP_TECHNIQUE[2].views).toEqual(['side']); expect(OHP_TECHNIQUE[0].views).toEqual(['side']);
  });
});

describe('overhead_press: błąd animowany tylko tam, gdzie jest tekst (K15)', () => {
  test('Pike Push Up: błąd „skracanie ruchu” (push.mis.partial) przesuwa miednicę/łokieć o ≥ 3 cm na dole; pozostałe ćwiczenia rodziny nie mają animowanego błędu (ohp.mis.* to cechy tempa i postawy bez osobnej pozy)', () => {
    const e = errorsOf(spec('Pike Push Up')); expect(e.length).toBe(1); expect(e[0].cue).toBe('push.mis.partial');
    const a = frameAt(spec('Pike Push Up'), 1).sk, b = frameAt(spec('Pike Push Up'), 1, e[0].error).sk; expect(Math.max(d3(a.pelvis, b.pelvis), d3(a.arms.R.elbow, b.arms.R.elbow), d3(a.shoulderC, b.shoulderC))).toBeGreaterThanOrEqual(3);
    /* N1 (r2, 09.11.2026): trzy ćwiczenia landmine mają z zestawu ogólnego `press` błąd tempa mis.jerk (cecha tempa, lib/figures/v2/ui.ts; wyświetlany od początku) — oczekujemy dokładnie tego jednego błędu, nie zera; reszta rodziny: zero */
    const TEMPO = ['Landmine Press', 'Landmine Linear Jammer', 'Single-Arm Linear Jammer'];
    for (const k of KEYS.filter(x => x !== 'Pike Push Up')) expect([k, errorsOf(spec(k)).map(x => x.cue)]).toEqual([k, TEMPO.includes(k) ? ['mis.jerk'] : []]);
  });
});

describe('overhead_press: dół ruchu przy przedniej części barków, zza karku prosto w górę (poprawki r1, 09.11.2026: W1, Ś1, Ś2)', () => {
  /* W1: 13 ćwiczeń z wyciskanie() w generatorze (sztanga, hantle, kettlebell, linki, guma; stojąc i siedząc; push press, see-saw). Arnold i zza karku mają własny tor. */
  const W1 = ['Overhead Press (sztanga)', 'Overhead Press (hantle)', 'Seated Shoulder Press (hantle)', 'Push Press', 'Wyciskanie nad głowę (linki)', 'Single Arm Overhead Press (hantel)', 'Kettlebell Press', 'Seated Barbell Military Press',
    'See-Saw Press (Alternating Side Press)', 'Band Shoulder Press', 'Seated Cable Shoulder Press', 'Kettlebell Seated Press', 'Double Kettlebell Press'];
  const SZTANGA = ['Overhead Press (sztanga)', 'Seated Barbell Military Press', 'Push Press'];
  const KETTLEBELL = ['Kettlebell Press', 'Kettlebell Seated Press', 'Double Kettlebell Press'];
  /* progi z recenzji r1: sztanga ≤ ok. 3–5 cm od tułowia (z zapasem 1 cm, mierzone 5,0), chwyt przed barkiem ≤ 17 cm (było 22) i nad barkiem ≤ 15 cm (było 14; kettlebell 14, bo dzwon za rączką niżej przenika ramię), zgięcie łokcia ≤ 149° (limit silnika) */
  const PROG = { sztangaTulow: 6, chwytPrzod: 17, chwytGora: 15 };
  const dolR = (k: string, dx = 0) => {
    const f = frameAt(spec(k), 0); const sh = f.sk.shoulderC; const g = f.sk.arms.R.grip;
    const bar = equipColliders(f.props).find(c => c.id === 'bar'); const torso = bodyColliders(f.sk).find(b => b.id === 'torso');
    const przesun = bar && 'a' in bar && 'b' in bar ? ({ ...bar, a: [bar.a[0] + dx, bar.a[1], bar.a[2]], b: [bar.b[0] + dx, bar.b[1], bar.b[2]] } as typeof bar) : null; /* 09.11.2026: Collider ma też kształt „prism” (ślad dźwigni, integracja 55c9f206) — gryf to odcinek a–b */
    return { x: g[0] + dx - sh[0], y: g[1] - sh[1], gapTulow: bar && torso && przesun ? gap(torso, przesun) : null, lokiec: jointAngles(f.sk, 'R').elbow };
  };
  test('dół ruchu (u = 0): chwyt ≤ 17 cm przed środkiem barków i ≤ 15 cm nad nim, łokieć ≤ 149° — w 13 ćwiczeniach (przed poprawką: 22 cm przed, 14 cm nad, kettlebell 11,5 cm od tułowia)', () => {
    expect(W1.length).toBe(13);
    for (const k of W1) { const m = dolR(k); expect([k, m.x <= PROG.chwytPrzod, m.y <= PROG.chwytGora, m.lokiec <= 149]).toEqual([k, true, true, true]); }
  });
  test('sztanga na dole ≤ 6 cm od tułowia (mierzone ok. 5 cm; przed poprawką 15 cm) w trzech ćwiczeniach ze sztangą', () => {
    for (const k of SZTANGA) { const m = dolR(k); expect([k, m.gapTulow !== null && m.gapTulow <= PROG.sztangaTulow]).toEqual([k, true]); }
  });
  test('łokcie pod nadgarstkami: poziomy odstęp łokcia od chwytu ≤ 8 cm (reguła dopuszcza 10) w każdej klatce co 0,025 w 13 ćwiczeniach', () => {
    for (const k of W1) for (const s of PRAC(k)) { const m = Math.max(...US.map(u => { const a = frameAt(spec(k), u).sk.arms[s]; return Math.hypot(a.grip[0] - a.elbow[0], a.grip[2] - a.elbow[2]); })); expect([k, s, m <= 8]).toEqual([k, s, true]); }
  });
  /* W2-r2 (recenzja 09.11.2026): rack — łokieć bliżej tułowia niż 23,2 cm przed barkiem (karta kbp.setup „łokieć blisko żeber”). Miara: łokieć przed środkiem barków i zgięcie barku (shSag) na dole. Poprawne wg walidatora geometrii (dzwon 'tyl' nie wchodzi w ramię) są tylko
   * starty z rączką ≥ 16 cm przed barkiem i |z| 30 (przeszukanie siatki, decyzja w docs/18 z 10.11.2026), więc zgięcie barku spada z 52° do ok. 35° (cel recenzenta ≤ 25° wymagałby w silniku dzwonu na zewnętrznej stronie przedramienia — nie ma takiego trybu). */
  const lokiecDol = (k: string, pose?: PoseData) => { const f = pose ? keyframeFrame(pose, 0) : frameAt(spec(k), 0); return { x: f.sk.arms.R.elbow[0] - f.sk.shoulderC[0], sag: jointAngles(f.sk, 'R').shSag }; };
  test('W2-r2 kettlebell: rack — łokieć ≤ 18 cm przed środkiem barków i zgięcie barku ≤ 38° (było 23,2 cm i 52°), dzwon za rączką nie wchodzi w ramię (K7: odstęp ≥ 0), chwyt ≤ 17 cm przed barkiem', () => {
    for (const k of KETTLEBELL) { const m = dolR(k); const e = lokiecDol(k); expect([k, e.x <= 18, e.sag <= 38, m.x <= PROG.chwytPrzod]).toEqual([k, true, true, true]); }
  });
  test('W2-r2 przypadek negatywny (dane sprzed poprawki: rączka 16,5 cm przed i 14 cm nad barkiem, |z| 26): łokieć > 18 cm przed barkiem i zgięcie barku > 38° — miary potrafią paść', () => {
    for (const k of KETTLEBELL) { const stara = JSON.parse(JSON.stringify(POSY[k])) as PoseData; const k0 = stara.klatki[0] as unknown as { rece: { R: { chwyt: number[]; biegunLokcia: number[] } } };
      const sh = keyframeFrame(stara, 0).sk.shoulderC; k0.rece.R.chwyt = [sh[0] + 16.5, sh[1] + 14, 26]; k0.rece.R.biegunLokcia = [2.2, -1.7, 0.6];
      const e = lokiecDol(k, stara); expect([k, e.x > 18, e.sag > 38]).toEqual([k, true, true]); }
  });
  test('przypadek negatywny (dane sprzed poprawki, x0 = 22): chwyt i sztanga 8,7 cm dalej od tułowia niż dziś dają odstęp > 6 cm i chwyt > 17 cm przed barkiem — miary potrafią paść', () => {
    for (const k of SZTANGA) { const m = dolR(k, 8.7); expect([k, m.gapTulow! > PROG.sztangaTulow, m.x > PROG.chwytPrzod]).toEqual([k, true, true]); }
    for (const k of W1.filter(x => !SZTANGA.includes(x))) { const m = dolR(k, 8.7); expect([k, m.x > PROG.chwytPrzod]).toEqual([k, true]); }
  });
  test('Ś2 zza karku: gryf idzie prosto w górę — chwyt względem barków zmienia x w całym ruchu o ≤ 10 cm (przed poprawką ok. 21 cm: gryf kończył nad czołem), na szczycie nad barkami lub za nimi (x ≤ 0); przypadek negatywny: szczyt 8 cm przed barkiem', () => {
    for (const k of ['Standing Barbell Press Behind Neck', 'Push Press - Behind the Neck']) {
      const xs = US.map(u => { const f = frameAt(spec(k), u); return f.sk.arms.R.grip[0] - f.sk.shoulderC[0]; });
      expect([k, Math.max(...xs) - Math.min(...xs) <= 10, xs[xs.length - 1] <= 0]).toEqual([k, true, true]);
      /* N2 (r2): przypadek negatywny na danych — ostatnia klatka z chwytem 8 cm przed barkiem (xTop sprzed poprawki) przechodzi przez tę samą miarę */
      const stara = JSON.parse(JSON.stringify(POSY[k])) as PoseData; const ost = stara.klatki.length - 1; const sx = keyframeFrame(stara, stara.klatki[ost].u).sk.shoulderC[0];
      (stara.klatki[ost] as unknown as { rece: { R: { chwyt: number[] } } }).rece.R.chwyt[0] = sx + 8;
      const xsS = stara.klatki.map((_, i) => { const f = keyframeFrame(stara, stara.klatki[i].u); return f.sk.arms.R.grip[0] - f.sk.shoulderC[0]; });
      expect([k, Math.max(...xsS) - Math.min(...xsS) > 10, xsS[xsS.length - 1] <= 0]).toEqual([k, true, false]);
    }
  });
  /* W1-r2 (recenzja r2, 09.11.2026): w drodze w górę ciężar idzie prosto w górę (tor w świecie, widok z boku). Łokieć pod chwytem (reguła ≤ 10 cm) wymusza przy twarzy chwyt ok. 22 cm przed barkami (xMinPodLokciem) — stojąc tułów odchyla się więc w tył o tyle,
   * ile chwyt wychodzi przed barki, a na górze wraca (generator: odchył tułowia). Siedząc oparcie ławki nie pozwala na odchył: te cztery ćwiczenia mają wyjątek w tests/tor-wyjatki.json z pomiarem. */
  const STOJACE = W1.filter(k => !/Seated/.test(k)); const SIEDZACE = W1.filter(k => /Seated/.test(k));
  const tor = (k: string, kor?: (x: number, i: number) => number) => { const pts = Array.from({ length: 25 }, (_, i) => { const f = frameAt(spec(k), i / 24); return proj((f.info.load ?? f.info.trail) as V3, "side") as [number, number]; });
    const [a, b] = [pts[0], pts[24]]; const dx = b[0] - a[0], dy = b[1] - a[1], L = Math.hypot(dx, dy) || 1; void kor;
    return { odch: Math.max(...pts.map(q => Math.abs((q[0] - a[0]) * dy - (q[1] - a[1]) * dx) / L)), poz: pts }; };
  test('W1-r2: tor ciężaru w widoku z boku ≤ 4 cm od prostej w 9 ćwiczeniach stojących i klatka tułowia w granicach reguły tulow_wysoko (−15…10°)', () => {
    expect(STOJACE.length).toBe(9);
    for (const k of STOJACE) { const t = tor(k); expect([k, t.odch <= 4]).toEqual([k, true]);
      for (const u of US) { const f = frameAt(spec(k), u); const lean = Math.atan2(f.sk.shoulderC[0] - f.sk.pelvis[0], f.sk.shoulderC[1] - f.sk.pelvis[1]) * 180 / Math.PI; expect([k, u, lean >= -15 && lean <= 10]).toEqual([k, u, true]); } }
  });
  test('W1-r2 przypadek negatywny (dane sprzed poprawki: bark nie cofa się, chwyt w świecie idzie łukiem): chwyty przesunięte o położenie barków dają tor > 8 cm w każdym z 9 ćwiczeń — miara potrafi paść', () => {
    for (const k of STOJACE) { const stara = JSON.parse(JSON.stringify(POSY[k])) as PoseData;
      stara.klatki.forEach((kl, i) => { const sx = keyframeFrame(stara, stara.klatki[i].u).sk.shoulderC[0]; const r = (kl as unknown as { rece: Record<string, { chwyt: number[] }> }).rece; for (const sd of ['R', 'L']) r[sd].chwyt[0] += -sx; });
      const pts = stara.klatki.map((_, i) => { const f = keyframeFrame(stara, stara.klatki[i].u); return f.sk.arms.R.grip; }); const a = pts[0], b = pts[pts.length - 1]; const dx = b[0] - a[0], dy = b[1] - a[1], L = Math.hypot(dx, dy) || 1;
      const odch = Math.max(...pts.map(q => Math.abs((q[0] - a[0]) * dy - (q[1] - a[1]) * dx) / L)); expect([k, odch > 8]).toEqual([k, true]); }
  });
  test('W1-r2 siedzące (oparcie ławki, bez odchyłu tułowia): tor 9–13 cm, czyli tyle, ile wymusza reguła łokcia pod chwytem — jawny wyjątek w tor-wyjatki.json z górną granicą 13 cm', () => {
    const WYJ = JSON.parse(fs.readFileSync(path.join(ROOT, 'tests/tor-wyjatki.json'), 'utf8')) as Record<string, string>;
    for (const k of SIEDZACE) { const t = tor(k); expect([k, t.odch > 4 && t.odch <= 13, typeof WYJ[`${k}|side`]]).toEqual([k, true, 'string']); }
  });
  test('N3 Push Press - Behind the Neck: w ugięciu nóg gryf idzie pionowo (x chwytu zmienia się o ≤ 4,5 cm w całym ruchu); przypadek negatywny: miednica i chwyt przesunięte o 6 cm do przodu w ugięciu — zmiana > 4,5 cm', () => {
    const k = 'Push Press - Behind the Neck'; const x = (pose: PoseData) => pose.klatki.map((kl) => keyframeFrame(pose, kl.u).sk.arms.R.grip[0]); const zakres = (v: number[]) => Math.max(...v) - Math.min(...v);
    expect([k, zakres(x(POSY[k])) <= 4.5]).toEqual([k, true]);
    const stara = JSON.parse(JSON.stringify(POSY[k])) as PoseData; const dno = stara.klatki.reduce((b, kl, i) => ((kl as unknown as { miednica: number[] }).miednica[1] < (stara.klatki[b] as unknown as { miednica: number[] }).miednica[1] ? i : b), 0);
    const mk = stara.klatki[dno] as unknown as { miednica: number[]; rece: Record<string, { chwyt: number[] }> }; mk.miednica[0] += 6; for (const sd of ["R", "L"]) mk.rece[sd].chwyt[0] += 6;
    expect([k, zakres(x(stara)) > 4.5]).toEqual([k, true]);
  });
  test('Ś1 Seated Cable Shoulder Press: zestaw ogólny bez zdania „hantle przy barkach” (ohp.seat; ćwiczenie z linkami, więc czytamy dane zestawu — karta pokazuje zestaw dopiero po recenzji treści); siedzące z hantlami je zachowują', () => {
    const items = JSON.parse(fs.readFileSync(path.join(ROOT, 'lib/figures/v2/cue-sets.json'), 'utf8')).items as Record<string, { ok?: string[] }>;
    expect(items['Seated Cable Shoulder Press'].ok).not.toContain('ohp.seat'); expect(items['Seated Cable Shoulder Press'].ok).toEqual(['ohp.move', 'ohp.fullExt']);
    expect(items['Seated Shoulder Press (hantle)']?.ok ?? cueIdsOf('Seated Shoulder Press (hantle)').ids).toContain('ohp.seat');
  });
});
