/*
 * Figury v2 cable_row — poprawki po recenzji niezależnej r1 (09.11.2026, audytor; W1, W2, S2). Progi z karty i decyzji właściciela, nie z danych (K5):
 * - W1: Seated Cable Row i Wiosłowanie na linkach (siedząc): linka ≤ 5° od poziomu w całym ruchu (decyzja właściciela 27.10.2026, pkt 7a; v1: tests/figury-recenzja.test.tsx, „linka poziomo”).
 * - W2: Standing Cable Row, Single Arm Cable Row: bloczek na wysokości klatki (karta scrow.setup: „wyciąg mniej więcej na wysokości klatki”), linka ≤ 5° od poziomu.
 * - S2 → backlog 1.1.x (docs/21): oś u góry przenika głowę (test niżej utrwala stan znany i powód).
 * Przypadek negatywny: dane sprzed poprawki (bloczek 55/100 cm, uchwyt 84,8/136,5 cm → 26,4°/32,4°) oblewają te testy.
 */
import { figureSpec, frameAt, type FigureSpec } from '@/lib/figures/v2';
import { poseDataFor } from '@/lib/figures/v2/poseData';

const spec = (k: string): FigureSpec => figureSpec(k) as FigureSpec;
const US = Array.from({ length: 21 }, (_, i) => i / 20);
const ZAKRES_CHWYTU = (k: string) => (poseDataFor(k, 'cable_row') as { sprzet: Array<Record<string, number | string>> }).sprzet.find(g => g.rodzaj === 'wyciag') as { x: number; y: number; z: number };
const kat = (k: string, u: number) => { const w = ZAKRES_CHWYTU(k); const g = frameAt(spec(k), u).sk.arms; const c = k === 'Single Arm Cable Row' ? g.R.grip : [0, 1, 2].map(i => (g.R.grip[i] + g.L.grip[i]) / 2);
  return Math.abs(Math.atan2(c[1] - w.y, w.x - c[0]) * 180 / Math.PI); };
const SIEDZACE = ['Seated Cable Row', 'Wiosłowanie na linkach (siedząc)'], STOJACE = ['Standing Cable Row', 'Single Arm Cable Row'];

describe('W1/W2: linka od bloczka do uchwytu blisko poziomu w całym ruchu (≤ 5°)', () => {
  test.each([...SIEDZACE, ...STOJACE])('%s — kąt linki od poziomu ≤ 5° w 21 punktach ruchu', k => {
    const m = US.map(u => kat(k, u)); const max = Math.max(...m); expect([k, max <= 5, Math.round(max * 10) / 10]).toEqual([k, true, Math.round(max * 10) / 10]);
  });
  test.each(SIEDZACE)('%s — bloczek w zakresie niskim (cable.row_seat, y ≤ 60 cm), dłonie nad kolanami nie wchodzą w nogi (odstęp ≥ 3 cm)', k => {
    expect(ZAKRES_CHWYTU(k).y).toBeLessThanOrEqual(60);
    for (const u of US) { const a = frameAt(spec(k), u).sk; const g = a.arms.R.grip; const kn = a.legs.R.knee; const d = Math.hypot(g[0] - kn[0], g[1] - kn[1]); expect([k, u, d >= 3]).toEqual([k, u, true]); }
  });
  test.each(STOJACE)('%s — bloczek na wysokości klatki (karta): między środkiem miednicy a barkiem, dłonie na starcie i na końcu na wysokości klatki (±12 cm od środka klatki)', k => {
    const w = ZAKRES_CHWYTU(k); const sk = frameAt(spec(k), 0).sk; const bark = sk.shoulderC[1], miedn = sk.pelvis[1]; const klatka = miedn + 0.75 * (bark - miedn);
    expect([k, Math.abs(w.y - klatka) <= 8, Math.round(w.y)]).toEqual([k, true, Math.round(w.y)]);
    for (const u of [0, 1]) { const g = frameAt(spec(k), u).sk.arms.R.grip[1]; expect([k, u, Math.abs(g - klatka) <= 12]).toEqual([k, u, true]); }
  });
});

describe('S2 (backlog 1.1.x): Leverage High Row — oś dźwigni u góry nie mieści się w danych rodziny', () => {
  test('stan znany: oś dźwigni z przodu i na dole, jak w Machine Row (oś u góry za ramieniem przenika głowę: head × barPivot 0,67–1,37 cm przy r 70–100 cm, dopuszczalne 0,3) — do czasu poprawki silnika dźwignia pozostaje schematem', () => {
    for (const k of ['Machine Row', 'Leverage High Row']) { const d = poseDataFor(k, 'cable_row') as { sprzet: Array<Record<string, number | string>> }; const lv = d.sprzet.find(g => g.rodzaj === 'dzwignia') as { x: number; y: number };
      expect([k, lv.x > 60, lv.y < 60]).toEqual([k, true, true]); }
  });
});
