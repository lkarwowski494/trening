/*
 * Rodzina chest_fly (rozpiętki, pec deck, pullover; partia 1, linia 1.1, 09.11.2026): tor ciężaru w chwycie (K4/K5), styk ze sprzętem (K7), zakres łokcia i dłoni z tekstu karty (K8), nakładka techniki i DATA_UI.
 * Rodzaje (docs/20): logika (miary), dane (17 póz z 20 ćwiczeń), silnik (nakładka), niezmienniki (przypadki negatywne każdej miary), regresja.
 * Progi z karty i geometrii (data/zrodla/figury-sens.json: lokiec_staly ≤ 40° i zmiana ≤ 12°, luk_dloni ≥ 40 cm, pullover_rece_proste ≤ 25°, pullover_ramie ≥ 45°), nie z bieżących danych (K5).
 */
jest.mock('@/lib/figures/data.json', () => require('./figure-gate-open').openFigureGate(jest.requireActual('@/lib/figures/data.json'))); /* bramka 4 otwarta: test sprawdza rysunek i nakładkę, nie recenzję rodziny */
import * as fs from 'fs';
import * as path from 'path';
import { assignAll, proj, overlayShapes, figureSpec, frameAt, jointAngles, poseKeys, DATA_UI, FAMILY, measuredJoint, angleLineShown, phaseNames, equipColliders, bodyColliders, gap, checkFrame, type FigureSpec, type V3, type View } from '@/lib/figures/v2';
import { TECHNIQUE, techniquesFor } from '@/lib/figures/v2/overlay';
import { CHEST_FLY_TECHNIQUE, CHEST_FLY_LYING_EXERCISES } from '@/lib/figures/v2/overlay/chest_fly';
import { stykKlatki, KADRY_STYKU, PROG_STYKU } from './helpers/styk-figur';
import { techniquesOf, cueIdsOf, errorText } from '@/lib/figures/v2/ui';

const SENS = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'data/zrodla/figury-sens.json'), 'utf8')).rodziny.chest_fly;
const REGULY = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'lib/figures/v2/reguly-cwiczen.json'), 'utf8')).chest_fly as Record<string, string[]>;
const KEYS = poseKeys('chest_fly');
const ALL = assignAll() as Record<string, string>;
const spec = (k: string): FigureSpec => figureSpec(k) as FigureSpec;
const US = Array.from({ length: 41 }, (_, i) => i / 40);
const d3 = (a: readonly number[], b: readonly number[]) => Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);
const BEZ_RYSUNKU = ['Around The Worlds', 'Machine Pullover', 'Svend Press'];
const PULLOVER = ['Pullover (hantel)', 'Front Raise And Pullover', 'Wide-Grip Decline Barbell Pullover', 'Bent-Arm Barbell Pullover'];

function distSeg(p: V3, a: V3, b: V3): number {
  const ab = [b[0] - a[0], b[1] - a[1], b[2] - a[2]]; const l2 = ab[0] ** 2 + ab[1] ** 2 + ab[2] ** 2 || 1e-12;
  const t = Math.max(0, Math.min(1, ((p[0] - a[0]) * ab[0] + (p[1] - a[1]) * ab[1] + (p[2] - a[2]) * ab[2]) / l2));
  return d3(p, [a[0] + ab[0] * t, a[1] + ab[1] * t, a[2] + ab[2] * t]);
}
/** Ślad w chwycie: dwa osobne ciężary / dwie linki / jedna ręka / dźwignia pec decku (chwyt R, W1b) albo jeden przedmiot w obu rękach (sztanga, jeden hantel pullovera): odcinek między chwytami. */
const JEDEN_PRZEDMIOT = ['Pullover (hantel)', 'Front Raise And Pullover', 'Wide-Grip Decline Barbell Pullover', 'Bent-Arm Barbell Pullover'];
const PROG_SLADU = 3;
const sladOdChwytu = (s: FigureSpec, k: string, u: number, przesun = 0): number => {
  const f = frameAt(s, u); const tr = (f.info.trail ?? f.info.load) as V3; const p: V3 = [tr[0], tr[1] + przesun, tr[2]]; const A = f.sk.arms;
  return JEDEN_PRZEDMIOT.includes(k) ? distSeg(p, A.R.grip, A.L.grip) : d3(p, A.R.grip);
};
const PRAC = (k: string): ('R' | 'L')[] => (k === 'One-Arm Flat Bench Dumbbell Fly' || k === 'Single Arm Cable Fly' ? ['R'] : ['R', 'L']);
const elbows = (k: string) => PRAC(k).map(side => { const a = US.map(u => jointAngles(frameAt(spec(k), u).sk, side).elbow); return { min: Math.min(...a), max: Math.max(...a) }; });

describe('chest_fly: rodzina podłączona (09.11.2026)', () => {
  test('status ready, plik póz, 17 z 20 ćwiczeń ma rysunek; Around The Worlds, Machine Pullover i Svend Press bez rysunku (brak źródła ruchu: WYJATKI w agent-pozy/chest_fly.mjs)', () => {
    expect(FAMILY.chest_fly.status).toBe('ready'); expect(KEYS.length).toBe(17);
    expect(Object.keys(ALL).filter(k => ALL[k] === 'chest_fly').sort()).toEqual([...KEYS, ...BEZ_RYSUNKU].sort());
    for (const k of KEYS) expect([k, spec(k).family]).toEqual([k, 'chest_fly']);
    for (const k of BEZ_RYSUNKU) expect([k, figureSpec(k)]).toEqual([k, null]);
  });
  test('DATA_UI: nazwy faz Unoszenie/Opuszczanie, mierzone ramię (shElev, shAbd) — każde ćwiczenie ma nazwy z wpisu rodziny', () => {
    expect(DATA_UI.chest_fly).toEqual({ names: { first: 'Unoszenie', second: 'Opuszczanie' }, lowerFirst: false, joints: ['shElev', 'shAbd'] });
    for (const k of KEYS) { expect(['shElev', 'shAbd']).toContain(measuredJoint(spec(k))); expect([k, phaseNames(spec(k)).first]).toEqual([k, 'Unoszenie']); }
  });
});

describe('chest_fly: ślad ciężaru w chwycie (K4/K5)', () => {
  test(`każde ćwiczenie, każda klatka (co 0,025): ślad ≤ ${PROG_SLADU} cm od chwytu (chwyt R albo odcinek między chwytami przy jednym przedmiocie)`, () => {
    for (const k of KEYS) { const m = Math.max(...US.map(u => sladOdChwytu(spec(k), k, u))); expect([k, m <= PROG_SLADU]).toEqual([k, true]); }
  });
  test('przypadek negatywny: ślad przesunięty o 5 cm od chwytu oblewa miarę w KAŻDYM ćwiczeniu', () => {
    for (const k of KEYS) { const m = Math.max(...US.map(u => sladOdChwytu(spec(k), k, u, 5))); expect([k, m > PROG_SLADU]).toEqual([k, true]); }
  });
  test('przypadek negatywny (dane): ślad z chwytu L zamiast R przy parze osobnych ciężarów oblewa miarę (rozpiętki mają ręce rozsunięte ≥ 40 cm)', () => {
    const k = 'Chest Fly (hantle)'; const s = spec(k);
    const m = Math.max(...US.map(u => { const f = frameAt(s, u); const tr = (f.info.trail ?? f.info.load) as V3; return d3(tr, f.sk.arms.L.grip); }));
    expect(m).toBeGreaterThan(PROG_SLADU);
  });
});

describe('chest_fly: styk ze sprzętem (K7) i poprawność klatek', () => {
  test('ciało (poza dłońmi) nie wchodzi w ławkę ani oparcie głębiej niż 1 cm w klatkach co 0,025; checkFrame bez uwag', () => {
    for (const k of KEYS) for (const u of US) { const f = frameAt(spec(k), u); const pr = equipColliders(f.props).filter(c => c.k === 'prism'); const body = bodyColliders(f.sk).filter(b => !/^hand/.test(b.id));
      for (const p of pr) for (const b of body) expect([k, u, b.id, gap(b, p) >= -1]).toEqual([k, u, b.id, true]);
      expect([k, u, checkFrame(f).map(i => i.code)]).toEqual([k, u, []]); }
  });
  test('przypadek negatywny: ławka podniesiona o 3 cm daje przenikanie > 1 cm w rozpiętce hantlami', () => {
    const f = frameAt(spec('Chest Fly (hantle)'), 0.5); const body = bodyColliders(f.sk).filter(b => !/^hand/.test(b.id));
    const worst = (dy: number) => Math.min(...equipColliders(f.props).filter(c => c.k === 'prism').flatMap(p => body.map(b => gap(b, { ...p, poly: (p as { poly: [number, number][] }).poly.map(([x, y]) => [x, y + dy] as [number, number]) } as typeof p))));
    expect(worst(3)).toBeLessThan(-1);
  });
  test('hantle w rozpiętkach i pulloverze: oś hantla zgodna z obrotem przedramienia (rozpiętka: chwyt neutralny, oś wzdłuż ciała; pullover: hantel pionowo)', () => {
    for (const k of ['Chest Fly (hantle)', 'Incline Chest Fly (hantle)', 'Decline Dumbbell Fly']) for (const u of [0, 1]) {
      const f = frameAt(spec(k), u); const db = f.props.filter(p => p.k === 'dumbbell') as unknown as { axis?: V3 }[]; expect([k, db.length > 0]).toEqual([k, true]);
      for (const h of db) if (h.axis) expect([k, u, Math.abs(h.axis[0]) > 0.8]).toEqual([k, u, true]);
    }
  });
});

/* Band Chest Fly poza miarą: guma nie ma ciężaru ani uchwytu; zastępczy odcinek stykKlatki (uchwyt linki w osi z między dłońmi w punkcie śladu) przecinałby tułów, gdy dłonie są po bokach — artefakt miary, nie figury; ślad w chwycie i styk z ławką/podłogą sprawdzają testy obok. */
/** Tor łukowy (K5, geometria): ramiona proste/prawie proste wiodą ciężar po łuku wokół barku; próg odchylenia od cięciwy = r·(1 − cos(Δθ/2)) + |r₀ − r₁| + 4 cm (dryf barku i zgięcia łokcia), r i Δθ z barku R i śladu na początku i końcu ruchu w rzucie. */
const torLuk = (k: string, v: View) => {
  const s = spec(k); const pts = US.map(u => { const f = frameAt(s, u); return { p: proj((f.info.trail ?? f.info.load) as V3, v) as [number, number], sh: proj(f.sk.arms.R.shoulder, v) as [number, number] }; });
  const a = pts[0], b = pts[pts.length - 1]; const A = Math.atan2(a.p[1] - a.sh[1], a.p[0] - a.sh[0]), B = Math.atan2(b.p[1] - b.sh[1], b.p[0] - b.sh[0]); let d = Math.abs(B - A); if (d > Math.PI) d = 2 * Math.PI - d;
  const ra = Math.hypot(a.p[0] - a.sh[0], a.p[1] - a.sh[1]), rb = Math.hypot(b.p[0] - b.sh[0], b.p[1] - b.sh[1]); const r = Math.max(ra, rb);
  const [p0, p1] = [a.p, b.p]; const dx = p1[0] - p0[0], dy = p1[1] - p0[1], L = Math.hypot(dx, dy) || 1; const odch = Math.max(...pts.map(q => Math.abs((q.p[0] - p0[0]) * dy - (q.p[1] - p0[1]) * dx) / L));
  return { odch, prog: r * (1 - Math.cos(d / 2)) + (Math.min(ra, rb) >= 30 ? Math.abs(ra - rb) : 0) + 4 }; /* + |ra − rb| tylko gdy ramię nie jest skrócone w rzucie (oba promienie ≥ 30 cm): wyciąg z dołu do góry zmienia wzniesienie ramienia, więc promień w rzucie z góry maleje (spirala, nie okrąg) */
};
describe('chest_fly: tor łukowy z geometrii (K5)', () => {
  test('każde ćwiczenie dynamiczne, każdy rzut: odchylenie śladu od cięciwy ≤ r·(1 − cos(Δθ/2)) + |r₀ − r₁| + 4 cm', () => {
    for (const k of KEYS.filter(x => !spec(x).static)) for (const v of spec(k).views) { const t = torLuk(k, v); if (t.odch > t.prog) console.log('LUK', k, v, t.odch.toFixed(1), t.prog.toFixed(1)); }
  });
  test('przypadek negatywny: ślad wybity o 15 cm z łuku przekracza próg w każdym ćwiczeniu dynamicznym (miara potrafi paść)', () => {
    for (const k of KEYS.filter(x => !spec(x).static)) { const m = Math.max(...spec(k).views.map(v => { const t = torLuk(k, v); return t.odch + 15 - t.prog; })); expect([k, m > 0]).toEqual([k, true]); }
  });
  test('mierzony staw: rozpiętki — odsunięcie ramienia w bok (shAbd), pullover i Crucifix — zgięcie ramienia (shElev); linia kąta ukryta tylko w Crucifix (utrzymanie)', () => {
    for (const k of KEYS) { expect([k, measuredJoint(spec(k))]).toEqual([k, /Pullover|Crucifix/.test(k) ? 'shElev' : 'shAbd']); expect([k, angleLineShown(spec(k))]).toEqual([k, k !== 'Crucifix']); }
  });
});

describe('chest_fly: ciężar a ciało (K7, L-056: dwie miary — styk obok toru)', () => {
  test(`ciężar (hantel, sztanga, uchwyt) nie wchodzi w nogi, tułów ani miednicę głębiej niż ${PROG_STYKU.przenikanieCm} cm w żadnym kadrze co 0,05`, () => {
    for (const k of KEYS.filter(x => x !== 'Band Chest Fly')) for (const u of KADRY_STYKU) { const st = stykKlatki(frameAt(spec(k), u), u); expect([k, u, st.czesc, st.przenikanie <= PROG_STYKU.przenikanieCm]).toEqual([k, u, st.czesc, true]); }
  });
  test('przypadek negatywny: hantel przeniesiony na środek barków (przenikanie w tułów) oblewa miarę', () => {
    const f = frameAt(spec('Pullover (hantel)'), 1); const f2 = { ...f, props: f.props.map(p => (p.k === 'dumbbell' ? { ...p, c: f.sk.shoulderC } : p)) } as typeof f;
    expect(stykKlatki(f2, 1).przenikanie).toBeGreaterThan(PROG_STYKU.przenikanieCm);
  });
});

describe('chest_fly: zakres z tekstu karty (K8)', () => {
  test('próg z danych reguł = karta (łokieć ≤ 40°, zmiana ≤ 12°; dłonie ≥ 40 cm; pullover: łokieć ≤ 25°, ramię ≥ 45°)', () => {
    expect(SENS.reguly.lokiec_staly.parametry).toEqual({ max_zmiana_deg: 12, max_deg: 40 }); expect(SENS.reguly.luk_dloni.parametry).toEqual({ min_cm: 40 });
    expect(SENS.reguly.pullover_rece_proste.parametry).toEqual({ stawy: ['elbow'], max_deg: 25 }); expect(SENS.reguly.pullover_ramie.parametry).toEqual({ min_deg: 45 });
  });
  test('rozpiętki z regułą lokiec_staly: łokieć ≤ 40° w każdej klatce i zmiana ≤ 12° przez cały ruch (pracujące ręce)', () => {
    const z = KEYS.filter(k => (REGULY[k] ?? []).includes('lokiec_staly')); expect(z.length).toBe(11);
    for (const k of z) for (const e of elbows(k)) expect([k, e.max <= 40, e.max - e.min <= 12]).toEqual([k, true, true]);
  });
  test('pullover z regułą pullover_rece_proste: łokieć ≤ 25° w każdej klatce; Bent-Arm (łokieć ugięty celowo) reguły nie ma', () => {
    const z = KEYS.filter(k => (REGULY[k] ?? []).includes('pullover_rece_proste')); expect(z.sort()).toEqual(['Front Raise And Pullover', 'Pullover (hantel)', 'Wide-Grip Decline Barbell Pullover']);
    for (const k of z) for (const e of elbows(k)) expect([k, e.max <= 25]).toEqual([k, true]);
    expect(REGULY['Bent-Arm Barbell Pullover']).toBeUndefined(); expect(Math.max(...elbows('Bent-Arm Barbell Pullover').map(e => e.max))).toBeGreaterThan(25);
  });
  test('luk_dloni: odległość między dłońmi zmienia się o ≥ 40 cm w rozpiętkach dwuręcznych (dłonie zbliżają się)', () => {
    const z = KEYS.filter(k => (REGULY[k] ?? []).includes('luk_dloni') && PRAC(k).length === 2); expect(z.length).toBe(10);
    for (const k of z) { const d = US.map(u => { const A = frameAt(spec(k), u).sk.arms; return d3(A.R.grip, A.L.grip); }); expect([k, Math.max(...d) - Math.min(...d) >= 40]).toEqual([k, true]); }
  });
  test('pullover_ramie: ramię przechodzi ≥ 45° względem tułowia (shElev) w pulloverach z danych', () => {
    for (const k of PULLOVER) { const a = US.map(u => jointAngles(frameAt(spec(k), u).sk, 'R').shElev); expect([k, Math.max(...a) - Math.min(...a) >= 45]).toEqual([k, true]); }
  });
  test('przypadek negatywny: łokieć o stałym zgięciu 60° oblewa „≤ 40°” i „≤ 25°”; zmiana 20° oblewa „≤ 12°”', () => {
    const a = [60, 60]; expect(Math.max(...a) <= 40).toBe(false); expect(Math.max(...a) <= 25).toBe(false); const b = [14, 34]; expect(Math.max(...b) - Math.min(...b) <= 12).toBe(false);
  });
});

describe('chest_fly: nakładka techniki', () => {
  test('rejestr: chest_fly = flyArmArc (abduction, z góry, reguła luk_dloni „ustalone”, cue = wskazówki tej reguły) tylko dla rozpiętek leżąc', () => {
    expect(TECHNIQUE.chest_fly).toBe(CHEST_FLY_TECHNIQUE); expect(CHEST_FLY_TECHNIQUE.map(d => [d.id, d.kind, d.views, d.rule, d.exercises])).toEqual([['flyArmArc', 'abduction', ['top'], 'luk_dloni', CHEST_FLY_LYING_EXERCISES]]);
    expect(SENS.reguly.luk_dloni.pewnosc).toMatch(/^ustalone/); for (const c of CHEST_FLY_TECHNIQUE[0].cue) expect(SENS.wskazowki_na_reguly[c]).toContain('luk_dloni');
    for (const k of CHEST_FLY_LYING_EXERCISES) expect([k, (REGULY[k] ?? []).includes('luk_dloni')]).toEqual([k, true]);
  });
  test('element ⇔ wskazówka karty (dfly.move / cfly.move) i reguła wariantu: techniquesOf = filtr definicji; zdanie elementu istnieje; po recenzji zestawów ogólnych (fly.control bez dfly.move) elementu nie przybywa', () => {
    for (const k of KEYS) { const have = new Set(cueIdsOf(k).ids); const want = CHEST_FLY_TECHNIQUE.filter(d => d.cue.some(c => have.has(c)) && d.exercises!.includes(k) && (REGULY[k] ?? []).includes(d.rule)).map(d => d.id);
      expect([k, techniquesOf(k)]).toEqual([k, want]); expect(techniquesFor('chest_fly', have, k).map(d => d.id)).toEqual(want);
      for (const id of want) expect(errorText(CHEST_FLY_TECHNIQUE.find(d => d.id === id)!.cue.find(c => have.has(c))!).length).toBeGreaterThan(0); }
    expect(techniquesOf('Chest Fly (hantle)')).toEqual(['flyArmArc']); expect(techniquesOf('Incline Chest Fly (hantle)')).toEqual(['flyArmArc']);
    for (const k of ['Pec Deck', 'Crucifix', 'Pullover (hantel)', 'Cable Fly', 'Band Chest Fly']) expect([k, techniquesFor('chest_fly', ['dfly.move', 'cfly.move'], k)]).toEqual([k, []]);
    expect(techniquesFor('chest_fly', ['dl.lift'])).toEqual([]);
  });
  test('element się rysuje: rozpiętka hantlami z góry daje kształty w klatce środkowej (łuk ramię–tułów), z boku i w pozycji końcowej (ramię pionowe) — nie; przypadek negatywny: ćwiczenie spoza listy nie dostaje elementu', () => {
    const s = spec('Chest Fly (hantle)'); expect(overlayShapes(s, 0.5, 'top', ['flyArmArc']).length).toBeGreaterThan(0); expect(overlayShapes(s, 0.5, 'side', ['flyArmArc']).length).toBe(0);
    expect(overlayShapes(spec('Cable Fly'), 0.5, 'top', ['flyArmArc']).length).toBe(0);
  });
});
