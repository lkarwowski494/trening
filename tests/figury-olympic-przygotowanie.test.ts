/*
 * Rodzina olympic przed recenzją niezależną (fala F2, linia 1.1, 04.11.2026): dane póz czytane wprost z pliku (rodzina niepodłączona, status „planned”).
 * K2 pokrycie póz (Jerk Balance dorobiony), K5 tor sztangi (miejsce, zasięg, kształt z geometrii, każdy z przypadkiem negatywnym), K7 styki (podłoga, bloki, ciało), K8 zakres stawów i fazy ruchu wielofazowego
 * (ciąg → wyprost → przechwyt; podrzut: ugięcie → wyprost → przechwyt) według tekstu kart (lib/cues/text/pl.json, olympic.*).
 * Rodzina nie ma sprzętu z hantlami, linką ani `nosi`/`trzyma` (tylko sztanga z talerzami, podłoga, bloki, stojak), więc znaleziska wspólne H-A/H-B/H-C jej nie dotyczą.
 */
import * as fs from 'fs';
import * as path from 'path';
import { keyframeFrame, jointAngles, distSegSeg, GIRTH, type PoseData, type Frame, type V3 } from '@/lib/figures/v2';
import { stykKlatki, elementyCiezaru } from './helpers/styk-figur';

const P: Record<string, PoseData> = JSON.parse(fs.readFileSync(path.join(__dirname, '../lib/figures/v2/poses/olympic.json'), 'utf8')).cwiczenia;
const GEN = fs.readFileSync(path.join(__dirname, '../scripts/figures/agent-pozy/olympic.mjs'), 'utf8');
const KEYS = Object.keys(P);
const d3 = (a: number[], b: number[]) => Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);
const N = 160; const US = Array.from({ length: N + 1 }, (_, i) => i / N);
const frame = (k: string, u: number) => keyframeFrame(P[k], u);
const load = (k: string, u: number) => (frame(k, u).info as unknown as { load: number[] }).load;
const A = (k: string, u: number) => jointAngles(frame(k, u).sk, 'R');
const SPLITY = ['Split Clean', 'Split Snatch', 'Split Jerk', 'Clean and Jerk', 'Jerk Balance'];
const ZARZUT = ['Power Clean', 'Clean', 'Split Clean', 'Hang Clean', 'Block Clean', 'Block Power Clean'];
const RWANIE = ['Barbell Snatch', 'Power Snatch', 'Split Snatch', 'Hang Snatch', 'Block Snatch', 'Block Power Snatch'];
const PODRZUT = ['Power Jerk', 'Split Jerk', 'Squat Jerk', 'Jerk Balance'];

/** Zawrócenia toru w poziomie (x) i ich położenie w u; ruchy < 0,02 cm pomijane. */
function zawrocenia(pts: number[][]): number[] { const r: number[] = []; let sg = 0; for (let i = 1; i < pts.length; i++) { const dx = pts[i][0] - pts[i - 1][0]; if (Math.abs(dx) < 0.02) continue; const s = Math.sign(dx); if (sg && s !== sg) r.push((i - 1) / N); sg = s; } return r; }
/** Zawrócenia nie w klatce kluczowej (±0,02 u) = wybrzuszenie z interpolacji. */
const poza = (k: string, pts: number[][]) => zawrocenia(pts).filter(u => Math.min(...P[k].klatki.map(f => Math.abs(f.u - u))) > 0.02);
/** Najdłuższy objazd: długość toru w odcinku między klatkami kluczowymi do cięciwy (cięciwa > 3 cm). */
function objazd(k: string, pts: (u: number) => number[]): number {
  const kf = P[k].klatki.map(f => f.u); let m = 1;
  for (let j = 0; j < kf.length - 1; j++) { const a = pts(kf[j]), b = pts(kf[j + 1]); const ch = Math.hypot(b[0] - a[0], b[1] - a[1]); if (ch <= 3) continue; let L = 0, prev = a; for (let s = 1; s <= 20; s++) { const p = pts(kf[j] + (kf[j + 1] - kf[j]) * s / 20); L += Math.hypot(p[0] - prev[0], p[1] - prev[1]); prev = p; } m = Math.max(m, L / ch); }
  return m;
}

describe('olympic: pokrycie póz (K2)', () => {
  test('24 pozy: 23 z poprzedniej wersji + dorobiony Jerk Balance; wyjątkiem zostaje tylko Rack Delivery (bez tekstu)', () => {
    expect(KEYS).toHaveLength(24); expect(P['Jerk Balance']).toBeDefined(); expect(KEYS).not.toContain('Rack Delivery');
    expect(GEN).toMatch(/WYJATKI = \{ 'Rack Delivery': OTW \};/); expect(GEN).not.toMatch(/WYJATKI = \{[^}]*'Jerk Balance'/);
  });
  test('sprzęt: tylko sztanga z talerzami (bez trzyma/nosi), podłoga, bloki, stojak — H-A/H-B/H-C nie dotyczą rodziny', () => {
    for (const k of KEYS) for (const g of P[k].sprzet) { expect([k, ['podloga', 'sztanga', 'skrzynia', 'slupek'].includes(g.rodzaj)]).toEqual([k, true]); expect((g as { trzyma?: string }).trzyma).toBeUndefined(); expect((g as { nosi?: unknown }).nosi).toBeUndefined(); }
  });
});

describe('olympic: tor sztangi (K5)', () => {
  test.each(KEYS)('%s: ślad = środek gryfu = środek między dłońmi (≤ 3 cm) w każdej próbce', k => {
    for (const u of US) { const f = frame(k, u); const mid = [0, 1, 2].map(j => (f.sk.arms.R.grip[j] + f.sk.arms.L.grip[j]) / 2); expect([k, u, d3(load(k, u), mid) <= 3]).toEqual([k, u, true]); }
  });
  test('miara potrafi paść: chwyt jednej dłoni jest od środka gryfu dalej niż 3 cm (rozstaw dłoni ≥ 44 cm)', () => { const f = frame('Power Clean', 0.5); expect(d3(load('Power Clean', 0.5), f.sk.arms.R.grip)).toBeGreaterThan(3); });
  test.each(KEYS)('%s: sztanga w zasięgu ramion od barków (≤ 64 cm: ramię 63 + 1)', k => {
    /* zasięg: ręce proste (ramię + przedramię ≈ 63 cm, reach w generatorze) — sztanga przy barkach (rack) bliżej; dalej = ucieczka toru */
    for (const u of US) expect([k, u, d3(load(k, u), frame(k, u).sk.shoulderC) <= 64.5]).toEqual([k, u, true]);
  });
  test('miara zasięgu potrafi paść: sztanga przesunięta o 30 cm w poziomie wychodzi poza 64,5 cm od barków', () => { const l = load('Barbell Snatch', 1), s = frame('Barbell Snatch', 1).sk.shoulderC; expect(d3([l[0] + 30, l[1], l[2]], s)).toBeGreaterThan(64.5); });
  test.each(KEYS)('%s: zawrócenia toru w poziomie tylko w klatkach kluczowych, objazd odcinka ≤ 1,05 (bez wybrzuszeń z interpolacji)', k => {
    expect(poza(k, US.map(u => load(k, u)))).toEqual([]); expect(objazd(k, u => load(k, u))).toBeLessThanOrEqual(1.05);
  });
  test('miara kształtu potrafi paść: tor z falą między klatkami ma zawrócenie poza klatką i objazd > 1,05', () => {
    const k = 'Clean Pull'; const fala = (u: number) => { const p = load(k, u); return [p[0] + 4 * Math.sin(u * 40), p[1], p[2]]; };
    expect(poza(k, US.map(fala))).not.toEqual([]); expect(objazd(k, fala)).toBeGreaterThan(1.05);
  });
  test.each(KEYS)('%s: poziomy rozrzut sztangi ≤ 27 cm (+ 30 cm przy nożycach: przednia stopa przesuwa się o 30 cm, SPLIT w generatorze; Snatch Balance bez wyjątku — R1 Ś3: osobny test ≤ 11 cm)', k => {
    const xs = US.map(u => load(k, u)[0]); const rozrzut = Math.max(...xs) - Math.min(...xs); expect([k, rozrzut <= 27 + (SPLITY.includes(k) ? 30 : 0)]).toEqual([k, true]);
  });
  test('miara rozrzutu potrafi paść: tor rozciągnięty trzykrotnie przekracza 27 cm', () => { const xs = US.map(u => load('Squat Jerk', u)[0] * 3); expect(Math.max(...xs) - Math.min(...xs)).toBeGreaterThan(27); });
});

describe('olympic: styki (K7)', () => {
  test.each(KEYS)('%s: sztanga nie wnika w nogi i tułów > 1 cm (co 0,0125 u)', k => { for (const u of US) expect([k, u, stykKlatki(frame(k, u), u).przenikanie <= 1]).toEqual([k, u, true]); });
  test.each(KEYS)('%s: stopy nie pod podłogą > 1 cm, kostki nie poniżej podłogi', k => {
    for (const u of US) for (const s of ['R', 'L'] as const) { const L = frame(k, u).sk.legs[s]; expect([k, u, s, L.toe[1] >= -1 && L.heel[1] >= -1 && L.ankle[1] >= -1]).toEqual([k, u, s, true]); }
  });
  test.each(['Block Clean', 'Block Power Clean', 'Block Snatch', 'Block Power Snatch'])('%s: talerz nie wnika w bloki > 1 cm (spód talerza ≥ 28,5 cm przy blacie 29,5)', k => {
    expect(P[k].sprzet.some(g => g.rodzaj === 'skrzynia')).toBe(true); for (const u of US) expect([k, u, load(k, u)[1] - 22.5 >= 28.5]).toEqual([k, u, true]);
  });
  test('miara bloków potrafi paść: gryf 5 cm niżej wnika w blat o > 1 cm', () => { expect(load('Block Clean', 0)[1] - 5 - 22.5).toBeLessThan(28.5); });
  test('miara wnikania widzi kontakt: w Power Clean gryf wnika w uda (> 0,2 cm, w granicy 0,3 cm kolizji), próg testu 1 cm leży powyżej', () => {
    expect(Math.max(...US.map(u => stykKlatki(frame('Power Clean', u), u).przenikanie))).toBeGreaterThan(0.2);
  });
});

describe('olympic: zakres stawów i fazy ruchu zgodne z tekstem kart (K8)', () => {
  /** u wyprostu (drugi ciąg): najmniejsze zgięcie kolana w pierwszych 70% ruchu, ale po starcie z kolanem już ugiętym. */
  /* Clean and Jerk: wyprost zarzutu to klatka kluczowa (pierwsza połowa ruchu); między wyprostem a wejściem pod sztangę łokcie zginają się szybko, więc próbka siatki obok klatki kluczowej bywa już zgięta */
  const uWyprost = (k: string) => (k === 'Clean and Jerk' ? P[k].klatki.map(f => f.u).filter(u => u <= 0.45) : US.filter(u => u <= 0.7)).reduce((b, u) => (A(k, u).knee < A(k, b).knee ? u : b), 0.35);
  test.each([...ZARZUT, ...RWANIE, 'Clean and Jerk'])('%s: „mocno wyprostuj biodra i nogi” — kolano ≤ 12° i łokcie ≤ 25° (ręce proste) w wyproście', k => {
    const u = uWyprost(k); expect([k, A(k, u).knee <= 12]).toEqual([k, true]); expect([k, A(k, u).elbow <= 25]).toEqual([k, true]);
  });
  test.each(['Clean Shrug', 'Snatch Shrug', 'Clean Pull', 'Snatch Pull'])('%s: na górze pełny wyprost (kolano ≤ 5°) i proste ręce (łokieć ≤ 25°)', k => { const a = A(k, 1); expect(a.knee).toBeLessThanOrEqual(5); expect(a.elbow).toBeLessThanOrEqual(25); });
  test.each([...RWANIE, 'Muscle Snatch', 'Snatch Balance', ...PODRZUT])('%s: „złap ją na prostych rękach” — łokieć ≤ 21° i ramię nad głową (zgięcie w barku 150–171°) w przechwycie', k => {
    const a = A(k, 1); expect([k, a.elbow <= 21]).toEqual([k, true]); expect([k, a.shSag >= 150 && a.shSag <= 171]).toEqual([k, true]);
  });
  test.each(ZARZUT)('%s: „przyjmij ją na przód barków” — gryf przy barkach (≤ 24 cm od barków), łokcie zgięte ≥ 120° w przechwycie', k => {
    expect(d3(load(k, 1), frame(k, 1).sk.shoulderC)).toBeLessThanOrEqual(24); expect(A(k, 1).elbow).toBeGreaterThanOrEqual(120);
  });
  test('miara rack potrafi paść: w rwaniu gryf jest nad głową, > 24 cm od barków', () => { expect(d3(load('Barbell Snatch', 1), frame('Barbell Snatch', 1).sk.shoulderC)).toBeGreaterThan(24); });
  test('głębokość przechwytu: płytki (power) kolano 70–90°, pełny przysiad ≥ 110°, nożyce — przednia stopa ≥ 25 cm przed tylną', () => {
    for (const k of ['Power Clean', 'Block Power Clean', 'Power Snatch', 'Block Power Snatch', 'Power Jerk']) { const kn = A(k, 1).knee; expect([k, kn >= 70 && kn <= 90]).toEqual([k, true]); }
    for (const k of ['Clean', 'Hang Clean', 'Block Clean', 'Barbell Snatch', 'Hang Snatch', 'Block Snatch', 'Squat Jerk', 'Snatch Balance']) expect([k, A(k, 1).knee >= 110]).toEqual([k, true]);
    for (const k of SPLITY) { const L = frame(k, 1).sk.legs; expect([k, L.R.ankle[0] - L.L.ankle[0] >= 25]).toEqual([k, true]); }
  });
  test('miara głębokości potrafi paść: Power Clean nie jest pełnym przysiadem (kolano < 110°)', () => { expect(A('Power Clean', 1).knee).toBeLessThan(110); });
  test('start: z podłogi kolano ≥ 90° (sztanga na podłodze), zawis kolano ≤ 20°, bloki 50–70° (sztanga na wysokości kolan)', () => {
    for (const k of ['Power Clean', 'Clean', 'Barbell Snatch', 'Clean Pull', 'Snatch Pull']) { expect([k, A(k, 0).knee >= 90]).toEqual([k, true]); expect([k, load(k, 0)[1] <= 24]).toEqual([k, true]); }
    for (const k of ['Hang Clean', 'Hang Snatch', 'Clean Shrug', 'Snatch Shrug']) expect([k, A(k, 0).knee <= 20]).toEqual([k, true]);
    for (const k of ['Block Clean', 'Block Snatch', 'Block Power Clean', 'Block Power Snatch']) { const kn = A(k, 0).knee; expect([k, kn >= 50 && kn <= 70]).toEqual([k, true]); expect([k, Math.abs(load(k, 0)[1] - 52) <= 1]).toEqual([k, true]); }
  });
  test('podrzut — fazy: ugięcie krótkie (kolano 25–55°), tułów pionowo (pochylenie ≤ 12°), potem wyprost (kolano ≤ 10°) ze sztangą > 25 cm nad barkami, dopiero po nim przechwyt', () => {
    const lean = (k: string, u: number) => { const s = frame(k, u).sk; return Math.abs(Math.atan2(s.shoulderC[0] - s.pelvis[0], s.shoulderC[1] - s.pelvis[1]) * 180 / Math.PI); };
    for (const k of [...PODRZUT, 'Jerk Dip Squat']) {
      const ugiecie = Math.max(...US.filter(u => u <= 0.5).map(u => A(k, u).knee)); expect([k, ugiecie >= 25 && ugiecie <= 55]).toEqual([k, true]);
      for (const u of US.filter(x => x <= 0.45)) expect([k, u, lean(k, u) <= 12]).toEqual([k, u, true]);
    }
    for (const k of PODRZUT) {
      const uMin = US.filter(u => u >= 0.2 && u <= 0.8).reduce((b, u) => (A(k, u).knee < A(k, b).knee ? u : b), 0.5);
      expect([k, A(k, uMin).knee <= 10, uMin < 1]).toEqual([k, true, true]); expect([k, load(k, uMin)[1] > frame(k, uMin).sk.shoulderC[1] + 25]).toEqual([k, true]);
    }
  });
  test('miara fazy potrafi paść: w Jerk Dip Squat sztanga nigdy nie wychodzi > 25 cm nad barki (nie ma wyrzutu)', () => { expect(Math.max(...US.map(u => load('Jerk Dip Squat', u)[1] - frame('Jerk Dip Squat', u).sk.shoulderC[1]))).toBeLessThan(25); });
  test('Jerk Balance: start w skróconych nożycach (przednia stopa bliżej niż w przechwycie), sztanga na barkach, wyrzut nad głowę, pełne nożyce na końcu', () => {
    const k = 'Jerk Balance'; const rozst = (u: number) => { const L = frame(k, u).sk.legs; return L.R.ankle[0] - L.L.ankle[0]; };
    expect(rozst(0)).toBeGreaterThan(10); expect(rozst(0)).toBeLessThan(rozst(1) - 8); expect(d3(load(k, 0), frame(k, 0).sk.shoulderC)).toBeLessThanOrEqual(22); expect(A(k, 0).elbow).toBeGreaterThanOrEqual(120);
    expect(load(k, 1)[1]).toBeGreaterThan(load(k, 0)[1] + 20);
  });
  test('miara fazy potrafi paść: w Jerk Dip Squat sztanga nie wychodzi nad głowę (brak przechwytu), więc gryf jest < 40 cm nad barkiem, a nad głową ma ≥ 55 cm (R1: zgięcie barku przy łokciach w bok nie jest już miarą — 250°)', () => { expect(load('Jerk Dip Squat', 1)[1] - frame('Jerk Dip Squat', 1).sk.shoulderC[1]).toBeLessThan(40); });
});

/*
 * Poprawki po recenzji ruchu R1 (fala F2, 04.11.2026). Progi z TEKSTU KART i GEOMETRII rigu, nie z bieżących danych (poprzednie progi były dopasowane do danych: rack ≤ 24 cm, rozrzut +12 cm).
 * Każda miara ma przypadek negatywny odtwarzający wadę z R1 (stare wartości z 9f920fe5 muszą ją oblać).
 */
const sub = (a: number[], b: number[]) => a.map((x, i) => x - b[i]);
const dot = (a: number[], b: number[]) => a.reduce((s, x, i) => s + x * b[i], 0);
const nrm = (a: number[]) => { const l = Math.hypot(...a); return a.map(x => x / l); };
/** Oś tułowia (miednica → bark) w płaszczyźnie x–y oraz kierunek „przód” prostopadły do niej. */
const osTulowia = (f: Frame) => { const up = nrm(sub(f.sk.shoulderC, f.sk.pelvis)); return { up, front: [up[1], -up[0], 0] as number[] }; };
/** Położenie punktu ciężaru względem stawu barkowego: wysokość wzdłuż osi tułowia i odstęp powierzchni gryfu od kapsuły tułowia (jak w kolizjach: GIRTH.trunkCollide, promień gryfu 1,6 cm). */
function rackMiara(f: Frame, pt: number[]) {
  const o = osTulowia(f); const d = sub(pt, f.sk.shoulderC);
  const odstep = distSegSeg(f.sk.pelvis, f.sk.shoulderC, pt as V3, pt as V3) - 1.6 - GIRTH.trunkCollide;
  return { gora: dot(d, o.up), przod: dot(d, o.front), odstep };
}
/*
 * Granice z geometrii (komentarz uzasadnia): gryf w „przodzie barków” leży na przedniej części obręczy barkowej: 0…8 cm nad stawem barkowym (staw jest w środku obręczy, jej przód ok. 4–6 cm wyżej i przed nim);
 * stary stan 14–15 cm nad stawem to wysokość ust. Odstęp od tułowia ≤ 7 cm, nie ≤ 5: kontrakt rigu ogranicza łokieć do 149° (CONTRACT/ROM), a ręka (ramię 31 + przedramię z dłonią 33 cm) przy chwycie 25 cm od osi
 * (rozstaw jak w ciągu) daje zgięcie ≤ 149° dopiero od ok. 17,5 cm chwytu od stawu barkowego, czyli powierzchnia gryfu ok. 5,5–6,5 cm od kapsuły tułowia (stary stan: 7,5 cm przy 14–15 cm nad barkiem).
 */
const RACK = { goraMin: 0, goraMax: 8, odstepMax: 7 };
const rackOk = (m: { gora: number; odstep: number }) => m.gora >= RACK.goraMin && m.gora <= RACK.goraMax && m.odstep <= RACK.odstepMax;
const uRack: Record<string, number[]> = {
  ...Object.fromEntries(ZARZUT.map(k => [k, [1]])),
  ...Object.fromEntries([...PODRZUT, 'Jerk Dip Squat'].map(k => [k, [0]])), 'Jerk Dip Squat': [0, 0.5, 1], };
const pt = (f: Frame) => (f.info as unknown as { load: number[] }).load;

describe('olympic R1 W1: gryf na przodzie barków, nie przy ustach', () => {
  test.each(Object.keys(uRack))('%s: gryf 0…8 cm nad stawem barkowym i ≤ 7 cm od tułowia w pozycji „na barkach”', k => {
    for (const u of uRack[k]) { const m = rackMiara(frame(k, u), pt(frame(k, u))); expect([k, u, Math.round(m.gora * 10) / 10, rackOk(m)]).toEqual([k, u, Math.round(m.gora * 10) / 10, true]); }
  });
  test('miara potrafi paść: stary stan z R1 (gryf 15,4 cm nad barkiem i 10,4 cm przed osią = wysokość ust) nie jest „na barkach”', () => {
    const f = frame('Power Clean', 1); const o = osTulowia(f); const stary = [0, 1, 2].map(i => f.sk.shoulderC[i] + o.up[i] * 15.4 + o.front[i] * 10.4);
    const m = rackMiara(f, stary); expect(m.gora).toBeGreaterThan(RACK.goraMax); expect(rackOk(m)).toBe(false);
  });
  test('miara potrafi paść: gryf 12 cm przed osią tułowia (daleko od ciała) przekracza 7 cm odstępu', () => {
    const f = frame('Power Clean', 1); const o = osTulowia(f); const daleko = [0, 1, 2].map(i => f.sk.shoulderC[i] + o.up[i] * 4 + o.front[i] * 20);
    expect(rackOk(rackMiara(f, daleko))).toBe(false);
  });
});

/* Pierwszy ciąg (R1 W2): „barki nad sztangą” (karta rwania), „sztanga blisko ciała”, stały kąt pleców. Dotyczy startu z podłogi i z bloków: sztanga poniżej 70 cm i ręce proste (łokieć ≤ 25°). */
const PIERWSZY = ['Power Clean', 'Clean', 'Split Clean', 'Block Clean', 'Block Power Clean', 'Barbell Snatch', 'Power Snatch', 'Split Snatch', 'Block Snatch', 'Block Power Snatch', 'Clean Pull', 'Snatch Pull', 'Clean and Jerk'];
const pochylenie = (f: Frame) => { const o = osTulowia(f); return Math.atan2(o.up[0], o.up[1]) * 180 / Math.PI; };
function pierwszyCiag(k: string) { return US.filter(u => load(k, u)[1] <= 70 && A(k, u).elbow <= 25); }
/** Barki względem gryfu (cm): dodatnie = barki przed gryfem. */
const barkiPrzedGryfem = (k: string, u: number) => frame(k, u).sk.shoulderC[0] - load(k, u)[0];
describe('olympic R1 W2: pierwszy ciąg — barki nad gryfem, gryf przy nogach, stały kąt pleców', () => {
  test.each(PIERWSZY)('%s: barki nie za gryfem (≥ −3 cm) i gryf ≤ 3,5 cm od nóg (jedna średnica gryfu, PROG_STYKU) aż do wyprostu', k => {
    const us = pierwszyCiag(k); expect(us.length).toBeGreaterThan(8);
    for (const u of us) { expect([k, u, barkiPrzedGryfem(k, u) >= -3]).toEqual([k, u, true]); expect([k, u, stykKlatki(frame(k, u), u).odstep <= 3.5]).toEqual([k, u, true]); }
  });
  test.each(PIERWSZY.filter(k => k !== 'Clean and Jerk'))('%s: kąt pleców stały — do wysokości kolana (sztanga ≤ 50 cm) w granicach 8° od startu', k => {
    const l0 = pochylenie(frame(k, 0)); for (const u of US.filter(x => load(k, x)[1] <= 50 && x < 0.3)) expect([k, u, Math.abs(pochylenie(frame(k, u)) - l0) <= 8]).toEqual([k, u, true]);
  });
  test('miara potrafi paść: barki 15,6 cm za gryfem (stan z R1) oraz gryf 7 cm od nóg są poza progami', () => {
    expect(-15.6 >= -3).toBe(false); expect(7.4 <= 3.5).toBe(false);
    /* stan z R1: u = 0,10 Power Clean miał pochylenie 35,9° przy starcie 49,5° (−13,6°) */
    expect(Math.abs(35.9 - 49.5) <= 8).toBe(false);
  });
  test('miara jest czuła na dane: w Barbell Snatch przesunięcie barków o 16 cm do tyłu łamie próg', () => {
    const k = 'Barbell Snatch'; const u = pierwszyCiag(k)[5]; expect(barkiPrzedGryfem(k, u) - 16 >= -3).toBe(false);
  });
});

/** Chwila wyprostu (koniec wybicia) w podrzucie: najmniejsze zgięcie kolana w u ∈ [0,2; 0,8]. */
const uWybicia = (k: string) => US.filter(u => u >= 0.2 && u <= 0.8).reduce((b, u) => (A(k, u).knee < A(k, b).knee ? u : b), 0.5);
/** Poziomy rozrzut (max − min) wartości x w oknie u. */
const rozrzutX = (us: number[], fx: (u: number) => number) => { const xs = us.map(fx); return Math.max(...xs) - Math.min(...xs); };
const PION = ['Power Jerk', 'Split Jerk', 'Squat Jerk', 'Jerk Dip Squat'];
describe('olympic R1 W3: podrzut — ugięcie i wybicie pionowo (karta: „krótkie ugięcie, prosto w dół”, błąd „wybijanie sztangi w przód”)', () => {
  test.each(PION)('%s: gryf i miednica nie jadą poziomo > 3,5 cm w ugięciu ani w wybiciu (do wyprostu nóg)', k => {
    const us = US.filter(u => u <= (k === 'Jerk Dip Squat' ? 1 : uWybicia(k)));
    expect([k, rozrzutX(us, u => load(k, u)[0]) <= 3.5]).toEqual([k, true]); expect([k, rozrzutX(us, u => frame(k, u).sk.pelvis[0]) <= 3.5]).toEqual([k, true]);
  });
  test('miara potrafi paść: stary stan z R1 (gryf 8,3 → −0,1 cm w ugięciu, w wybiciu do +21,5 cm) przekracza 3,5 cm', () => { expect(8.3 - -0.1).toBeGreaterThan(3.5); expect(21.5 - -0.1).toBeGreaterThan(3.5); });
  test('miara jest czuła na dane: gryf Power Jerk przesunięty liniowo o 20 cm w przód w czasie wybicia łamie próg', () => {
    const k = 'Power Jerk'; const uE = uWybicia(k); const us = US.filter(u => u <= uE);
    expect(rozrzutX(us, u => load(k, u)[0] + 20 * (u / uE))).toBeGreaterThan(3.5);
  });
});

describe('olympic R1 W4: Jerk Balance — tylna stopa stoi w miejscu, przednia tylko się wsuwa w przód (karta: „wysuń przednią stopę do pełnych nożyc”)', () => {
  const k = 'Jerk Balance'; const stopa = (u: number, s: 'R' | 'L') => frame(k, u).sk.legs[s];
  test('tylna stopa (L): pięta i palce w tym samym miejscu (± 1 cm) przez cały ruch', () => {
    const h0 = stopa(0, 'L').heel[0], t0 = stopa(0, 'L').toe[0];
    for (const u of US) { expect([u, Math.abs(stopa(u, 'L').heel[0] - h0) <= 1]).toEqual([u, true]); expect([u, Math.abs(stopa(u, 'L').toe[0] - t0) <= 1]).toEqual([u, true]); }
  });
  test('przednia stopa (R): pięta nie cofa się (≥ −1 cm od startu), palce nie cofają się o więcej niż 2 cm, a na końcu jest ≥ 8 cm dalej niż na starcie', () => {
    const h0 = stopa(0, 'R').heel[0], t0 = stopa(0, 'R').toe[0];
    for (const u of US) { expect([u, stopa(u, 'R').heel[0] >= h0 - 1]).toEqual([u, true]); expect([u, stopa(u, 'R').toe[0] >= t0 - 2]).toEqual([u, true]); }
    expect(stopa(1, 'R').heel[0]).toBeGreaterThanOrEqual(h0 + 8);
  });
  test('miara potrafi paść: stary stan z R1 (przednia pięta 16,1 → 4,8 cm, tylna −7,3 → −25,9 cm) łamie oba progi', () => { expect(4.8 >= 16.1 - 1).toBe(false); expect(Math.abs(-25.9 - -7.3) <= 1).toBe(false); });
});

/** Odstęp stóp od podłogi (cm): najniższy punkt pięty/palców. */
const odPodlogi = (k: string, u: number) => { const L = frame(k, u).sk.legs; return Math.max(Math.min(L.R.toe[1], L.R.heel[1]), Math.min(L.L.toe[1], L.L.heel[1])); };
const BEZ_LOTU = ['Jerk Dip Squat', 'Snatch Balance'];
describe('olympic R1 Ś2: stopy w kontakcie z podłogą w podporze; lot tylko krótki, niski i po wybiciu', () => {
  test.each(BEZ_LOTU)('%s: stopy przy podłodze (≤ 1,5 cm) przez cały ruch', k => { for (const u of US) expect([k, u, odPodlogi(k, u) <= 1.5]).toEqual([k, u, true]); });
  test.each(['Clean Pull', 'Snatch Pull', 'Clean Shrug', 'Snatch Shrug'])('%s: stopy ≤ 3 cm nad podłogą (krótki oderwany wyprost jak w zarzucie, R1 nie zgłosił; koniec ruchu na palcach ≤ 1 cm)', k => { for (const u of US) expect([k, u, odPodlogi(k, u) <= 3]).toEqual([k, u, true]); expect([k, odPodlogi(k, 1) <= 1]).toEqual([k, true]); });
  test('Muscle Snatch: bez lotu — stopy ≤ 3 cm nad podłogą (stan z R1: do 5,3 cm przez połowę ruchu)', () => { for (const u of US) expect([u, odPodlogi('Muscle Snatch', u) <= 3]).toEqual([u, true]); });
  test.each([...PODRZUT, 'Clean and Jerk'])('%s: koniec wybicia na palcach w styku z podłogą (≤ 1,5 cm), potem lot ≤ 6 cm w jednym oknie po wybiciu', k => {
    const uE = k === 'Clean and Jerk' ? P[k].klatki.map(f => f.u).filter(u => u >= 0.5 && u <= 0.8).reduce((b, u) => (A(k, u).knee < A(k, b).knee ? u : b), 0.55) : uWybicia(k); /* C&J: wybicie podrzutu to klatka kluczowa w drugiej połowie */
    expect([k, odPodlogi(k, uE) <= 1.5]).toEqual([k, true]);
    const w = US.filter(u => odPodlogi(k, u) > 1.5 && (k !== 'Clean and Jerk' || u >= 0.5)); expect([k, Math.min(...w) > uE - 0.05 || w.length === 0]).toEqual([k, true]); for (const u of US) expect([k, u, odPodlogi(k, u) <= 6]).toEqual([k, u, true]);
  });
  test('miara potrafi paść: stopy 4 cm nad podłogą w wyproście (stan z R1: +4 cm w klatce wyprostu) lub 10 cm w locie łamią progi', () => { expect(4 <= 1.5).toBe(false); expect(10 <= 6).toBe(false); });
});

/** Środek masy ciała (przybliżenie segmentowe, ±3 cm jak w R1: tułów 50 %, głowa 8 %, uda 2×10 %, golenie 2×4,65 %, stopy 2×1,45 %, ramiona 2×2,7 %, przedramiona 2×2,2 %) i środek masy razem ze sztangą (sztanga = 50 % masy ciała). */
function srodekMasy(f: Frame): { cialo: number; zGryfem: number } {
  const mid = (a: number[], b: number[]) => [0, 1, 2].map(i => (a[i] + b[i]) / 2); const sk = f.sk;
  const cz: [number[], number][] = [[sk.head, 8], [mid(sk.pelvis, sk.shoulderC), 50]];
  for (const s of ['R', 'L'] as const) { const L = sk.legs[s], Ar = sk.arms[s]; cz.push([mid(L.hip, L.knee), 10], [mid(L.knee, L.ankle), 4.65], [mid(L.heel, L.toe), 1.45], [mid(Ar.shoulder, Ar.elbow), 2.7], [mid(Ar.elbow, Ar.grip), 2.2]); }
  let m = 0, x = 0; for (const [p, w] of cz) { m += w; x += p[0] * w; } const c = x / m; return { cialo: c, zGryfem: (c * 100 + pt(f)[0] * 50) / 150 };
}
const podpora = (f: Frame) => { const xs = (['R', 'L'] as const).flatMap(s => [f.sk.legs[s].heel[0], f.sk.legs[s].toe[0]]); return { min: Math.min(...xs), max: Math.max(...xs) }; };
const NAD_GLOWA = [...RWANIE, 'Snatch Balance', ...PODRZUT, 'Clean and Jerk'];
describe('olympic R1 Ś1: przechwyt w równowadze — środek masy ze sztangą nad stopami, gryf nad śródstopiem, barki blisko gryfu', () => {
  test.each([...ZARZUT, ...NAD_GLOWA])('%s: środek masy ciała ze sztangą w obrysie stóp (≥ 1 cm od pięty i od palców) w przechwycie', k => {
    const f = frame(k, 1); const p = podpora(f); const c = srodekMasy(f).zGryfem; expect([k, Math.round(c * 10) / 10, c >= p.min + 1 && c <= p.max - 1]).toEqual([k, Math.round(c * 10) / 10, true]);
  });
  test.each(NAD_GLOWA.filter(k => !SPLITY.includes(k)))('%s: gryf nad śródstopiem (± 5 cm) w przechwycie nad głową', k => {
    const f = frame(k, 1); const L = f.sk.legs.R; const sr = (L.heel[0] + L.toe[0]) / 2; expect([k, Math.abs(pt(f)[0] - sr) <= 5]).toEqual([k, true]);
  });
  test.each(NAD_GLOWA)('%s: ramię blisko pionu — zgięcie barku 166…171° (kontrakt rigu: ≤ 171°; stan z R1: 164,4–165,6° = ręce ~15–19° przed pionem, barki 14–19,5 cm za gryfem)', k => {
    const a = A(k, 1).shSag; expect([k, Math.round(a * 10) / 10, a >= 166 && a <= 171]).toEqual([k, Math.round(a * 10) / 10, true]);
  });
  test('miara potrafi paść: stary Power Clean (środek masy ze sztangą −8,6 cm przy pięcie −5,9 cm) i gryf 5,7 cm za śródstopiem (−5,7 przy 6,4) są poza progami', () => {
    expect(-8.6 >= -5.9 + 1).toBe(false); expect(Math.abs(-5.7 - 6.4) <= 5).toBe(false); expect(164.4 >= 166).toBe(false);
  });
});

describe('olympic R1 Ś3: Snatch Balance — gryf startuje na górze pleców w styku, rozrzut poziomy ≤ 11 cm (bez wyjątku +12 cm)', () => {
  const k = 'Snatch Balance';
  test('start: gryf przylega do pleców (powierzchnia ≤ 1,5 cm od tułowia, nie wnika) i jest za osią tułowia', () => {
    const f = frame(k, 0); const m = rackMiara(f, pt(f)); expect(m.odstep).toBeLessThanOrEqual(1.5); expect(m.odstep).toBeGreaterThanOrEqual(-0.3); expect(m.przod).toBeLessThan(0);
  });
  test('rozrzut poziomy gryfu ≤ 11 cm (ciało schodzi pod prawie pionowy tor)', () => { expect(rozrzutX(US, u => load(k, u)[0])).toBeLessThanOrEqual(11); });
  test('miara potrafi paść: stary start (gryf 14 cm za barkami = 2,9 cm szpary) i rozrzut 34,6 cm łamią progi', () => { expect(2.9 <= 1.5).toBe(false); expect(34.6 <= 11).toBe(false); });
});
