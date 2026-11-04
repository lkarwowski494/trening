/*
 * Rodzina olympic przed recenzją niezależną (fala F2, linia 1.1, 04.11.2026): dane póz czytane wprost z pliku (rodzina niepodłączona, status „planned”).
 * K2 pokrycie póz (Jerk Balance dorobiony), K5 tor sztangi (miejsce, zasięg, kształt z geometrii, każdy z przypadkiem negatywnym), K7 styki (podłoga, bloki, ciało), K8 zakres stawów i fazy ruchu wielofazowego
 * (ciąg → wyprost → przechwyt; podrzut: ugięcie → wyprost → przechwyt) według tekstu kart (lib/cues/text/pl.json, olympic.*).
 * Rodzina nie ma sprzętu z hantlami, linką ani `nosi`/`trzyma` (tylko sztanga z talerzami, podłoga, bloki, stojak), więc znaleziska wspólne H-A/H-B/H-C jej nie dotyczą.
 */
import * as fs from 'fs';
import * as path from 'path';
import { keyframeFrame, jointAngles, type PoseData } from '@/lib/figures/v2';
import { stykKlatki } from './helpers/styk-figur';

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
  test.each(KEYS)('%s: poziomy rozrzut sztangi ≤ 27 cm (+ 30 cm przy nożycach: przednia stopa przesuwa się o 30 cm, SPLIT w generatorze; + 12 cm w Snatch Balance: start za karkiem, ok. 12–15 cm za barkami)', k => {
    const xs = US.map(u => load(k, u)[0]); const rozrzut = Math.max(...xs) - Math.min(...xs); expect([k, rozrzut <= 27 + (SPLITY.includes(k) ? 30 : 0) + (k === 'Snatch Balance' ? 12 : 0)]).toEqual([k, true]);
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
  const uWyprost = (k: string) => US.filter(u => u <= 0.7).reduce((b, u) => (A(k, u).knee < A(k, b).knee ? u : b), 0.35);
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
  test('miara fazy potrafi paść: w Jerk Dip Squat sztanga nie wychodzi nad głowę (brak przechwytu), więc warunek ramię nad głową (≥ 150°) nie jest spełniony', () => { expect(A('Jerk Dip Squat', 1).shSag).toBeLessThan(150); });
});
