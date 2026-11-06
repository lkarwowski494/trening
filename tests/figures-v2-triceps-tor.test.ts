/*
 * Rodzina triceps — tor ciężaru (K5 planu recenzji rodzin v2, 04.11.2026): przedramię obraca się wokół nieruchomego łokcia, więc chwyt kreśli łuk o promieniu łokieć–chwyt.
 * Próg kształtu z geometrii każdego ćwiczenia: strzałka łuku r·(1 − cos(Δθ/2)) + dryf łokcia 4 cm + 2 cm zapasu; warunek miejsca (ślad ≤ 3 cm od właściwego chwytu: para hantli = chwyt R,
 * jeden uchwyt/hantel pionowy = środek między chwytami) i stały promień (rozrzut ślad–łokieć ≤ 3 cm). Każdy warunek ma przypadek negatywny.
 */
import { keyframeFrame, type PoseData } from '@/lib/figures/v2';
import { stykKlatki, KADRY_STYKU } from './helpers/styk-figur';
import { jointAngles } from '@/lib/figures/v2/skeleton';
import * as fs from 'fs';
import * as path from 'path';

const DATA = JSON.parse(fs.readFileSync(path.join(__dirname, '../lib/figures/v2/poses/triceps.json'), 'utf8')).cwiczenia as Record<string, PoseData>;
const KEYS = Object.keys(DATA);
const N = 25; const DRYF = 4, ZAPAS = 2, MAX_OD_CHWYTU = 3, MAX_ROZRZUT = 3;
type G = { sprzet: PoseData['sprzet'] };
const nosi = (d: PoseData) => d.sprzet.find(g => g.rodzaj === 'hantel' || g.rodzaj === 'wyciag' || g.rodzaj === 'dzwignia') as (PoseData['sprzet'][number] & { pionowo?: boolean; dwa?: boolean; trzyma?: string }) | undefined;
const dwa = (d: PoseData) => { const g = nosi(d); return !!g && !g.trzyma && ((g.rodzaj === 'hantel' && !g.pionowo) || (g.rodzaj === 'wyciag' && g.dwa === true)); };
const d3 = (a: number[], b: number[]) => Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);
const kl = (d: PoseData) => Array.from({ length: N }, (_, i) => keyframeFrame(d, i / (N - 1)));
/** Najbliższy łokieć do śladu (ręka niosąca ciężar). */
const lokiec = (f: ReturnType<typeof keyframeFrame>, t: number[]) => (['R', 'L'] as const).map(s => f.sk.arms[s].elbow).sort((a, b) => d3(t, a) - d3(t, b))[0];
const slad = (f: ReturnType<typeof keyframeFrame>) => (f.info.trail ?? f.info.load) as number[] | undefined;
/** Strzałka łuku (cm): r = średnia odległość łokieć–ślad, Δθ = kąt między wektorami łokieć→ślad w u = 0 i u = 1 (w płaszczyźnie widoku bocznego x–y). */
function strzalka(d: PoseData) {
  const F = kl(d); const a = F[0], b = F[N - 1]; const ta = slad(a)!, tb = slad(b)!; const ea = lokiec(a, ta), eb = lokiec(b, tb);
  const va = [ta[0] - ea[0], ta[1] - ea[1]], vb = [tb[0] - eb[0], tb[1] - eb[1]];
  const dth = Math.acos(Math.max(-1, Math.min(1, (va[0] * vb[0] + va[1] * vb[1]) / (Math.hypot(...va) * Math.hypot(...vb)))));
  const r = F.map(f => { const t = slad(f)!; return d3(t, lokiec(f, t)); }).reduce((x, y) => x + y, 0) / N;
  return { r, dth, s: r * (1 - Math.cos(dth / 2)) };
}
/** Odchylenie łamanej od prostej między końcami (cm) i liczba zmian kierunku w poziomie — ta sama miara co ksztaltToru w tests/figures-v2-tor.test.ts. */
function ksztaltToru(pts: [number, number][]): { odchylenie: number; zawrocenia: number } {
  const [a, b] = [pts[0], pts[pts.length - 1]]; const dx = b[0] - a[0], dy = b[1] - a[1], L = Math.hypot(dx, dy) || 1;
  const odchylenie = Math.max(...pts.map(p => Math.abs((p[0] - a[0]) * dy - (p[1] - a[1]) * dx) / L));
  let zawrocenia = 0, sg = 0; for (let i = 1; i < pts.length; i++) { const x = pts[i][0] - pts[i - 1][0]; if (Math.abs(x) < 0.05) continue; const q = Math.sign(x); if (sg && q !== sg) zawrocenia++; sg = q; }
  return { odchylenie, zawrocenia };
}
const sideTor = (d: PoseData) => ksztaltToru(kl(d).map(f => slad(f)!).map(p => [p[0], p[1]] as [number, number]));

describe('triceps: tor ciężaru po łuku wokół łokcia (K5)', () => {
  test('rodzina ma 29 ćwiczeń z danymi (3 bez rysunku: Body-Up, Bodyweight Triceps Extension, Sled Overhead Triceps Extension — wyjątki OTWARTE)', () => {
    expect(KEYS.length).toBe(29);
  });
  test.each(KEYS)('%s: odchylenie od cięciwy ≤ strzałka łuku + dryf + zapas, najwyżej jedno zawrócenie', k => {
    const t = sideTor(DATA[k]); const { s } = strzalka(DATA[k]);
    expect([k, +t.odchylenie.toFixed(1), t.odchylenie <= s + DRYF + ZAPAS, t.zawrocenia <= 1]).toEqual([k, +t.odchylenie.toFixed(1), true, true]);
  });
  /* ślad ≤ 3 cm od chwytu dotyczy ciężaru w dłoni (hantel, wyciąg, dźwignia); kettlebell (środek kuli pod uchwytem), guma i łańcuchy mają ślad w innym punkcie niż dłoń */
  const W_DLONI = KEYS.filter(k => !!nosi(DATA[k]));
  test('zestaw „ciężar w dłoni” obejmuje większość rodziny', () => { expect(W_DLONI.length).toBeGreaterThanOrEqual(15); });
  test.each(W_DLONI)('%s: ślad ≤ 3 cm od właściwego chwytu (para hantli = chwyt R/L, jeden uchwyt = także środek)', k => {
    const d = DATA[k]; const dw = dwa(d);
    for (const f of kl(d)) { const t = slad(f); if (!t) continue; const R = f.sk.arms.R.grip, L = f.sk.arms.L.grip; const m = [0, 1, 2].map(i => (R[i] + L[i]) / 2);
      expect([k, Math.min(d3(t, R), d3(t, L), dw ? Infinity : d3(t, m)) <= MAX_OD_CHWYTU]).toEqual([k, true]); }
  });
  test.each(KEYS)('%s: stały promień łuku (rozrzut ślad–łokieć ≤ 3 cm)', k => {
    const r = kl(DATA[k]).map(f => { const t = slad(f)!; return d3(t, lokiec(f, t)); });
    expect([k, Math.max(...r) - Math.min(...r) <= MAX_ROZRZUT]).toEqual([k, true]);
  });
  test('miara potrafi paść: ślad w osi ciała przy parze hantli (Skullcrusher (hantle)) leży dalej niż 3 cm od chwytu; prosta cięciwa nie mieści łuku', () => {
    const d = DATA['Skullcrusher (hantle)']; expect(dwa(d)).toBe(true);
    const f = keyframeFrame(d, 0.5); const R = f.sk.arms.R.grip, L = f.sk.arms.L.grip; const m = [0, 1, 2].map(i => (R[i] + L[i]) / 2);
    expect(Math.min(d3(m, R), d3(m, L))).toBeGreaterThan(MAX_OD_CHWYTU);
    const prosta = ksztaltToru([[0, 0], [0, 25], [0, 50]]); const luk = sideTor(DATA['Skullcrusher (sztanga)']);
    expect(prosta.odchylenie).toBe(0); expect(luk.odchylenie).toBeGreaterThan(5); /* tor sztangi w skullcrusherze nie jest prostą — próg 4 cm byłby zły dla rodziny */
    expect(strzalka(d).s + DRYF + ZAPAS).toBeLessThan(26); /* próg z geometrii jest ciaśniejszy niż stały próg łuku curl */
  });
  test('próg z geometrii potrafi paść: tor z wybrzuszeniem „S” (2 zawrócenia) i łuk dwa razy za duży są odrzucane', () => {
    expect(ksztaltToru([[9.6, 23], [12, 30], [13.6, 49], [11.5, 56], [4.8, 66], [6.5, 72], [8.6, 76]]).zawrocenia).toBeGreaterThan(1);
    const { s } = strzalka(DATA['Skullcrusher (sztanga)']); expect(2 * s > s + DRYF + ZAPAS).toBe(true);
  });
});

describe('triceps: styk ciężaru z ciałem i zakres łokcia (K7, K8)', () => {
  /* K7: w żadnym z 21 kadrów ciężar nie wnika w nogę ani tułów głębiej niż 1 cm (pushdown: uchwyt wnikał w udo do 1,5 cm — poprawka 04.11.2026, f1 = 9°); guma i łańcuchy nie mają ciężaru w info.load */
  const MAX_WNIKANIE = 1;
  const Z_CIEZAREM = KEYS.filter(k => !/^(Band |Chain )/.test(k));
  test.each(Z_CIEZAREM)('%s: ciężar nie wnika w ciało głębiej niż 1 cm (kadry co 0,05)', k => {
    const min = Math.min(...KADRY_STYKU.map(u => stykKlatki(keyframeFrame(DATA[k], u), u).odstep));
    expect([k, min >= -MAX_WNIKANIE]).toEqual([k, true]);
  });
  test('miara styku potrafi paść: uchwyt wciśnięty w udo (przesunięcie dłoni o 6 cm do uda) daje przenikanie > 1 cm', () => {
    const d = DATA['Triceps Pushdown']; const f = keyframeFrame(d, 1); const cof = JSON.parse(JSON.stringify(d)) as PoseData;
    for (const k of cof.klatki) for (const s of ['R', 'L'] as const) k.rece[s]!.chwyt = [k.rece[s]!.chwyt[0] - 6, k.rece[s]!.chwyt[1], k.rece[s]!.chwyt[2]];
    const bylo = stykKlatki(f, 1).odstep; const jest = stykKlatki(keyframeFrame(cof, 1), 1).odstep;
    expect(jest).toBeLessThan(bylo - 3);
  });
  /* K8: zakres łokcia zgodny z kartą: start w zgięciu ≥ 70°, koniec w wyproście ≤ 25° (reguła lokiec_prostuje_sie generatora) — liczby z measuredAngle (frameAt), nie z oka */
  test.each(KEYS)('%s: łokieć u = 0 zgięty ≥ 70°, u = 1 wyprostowany ≤ 25°', k => {
    /* ręka robocza = R (jednorącz: trzyma R; pary: obie takie same); rodzina niepodłączona, więc bez figureSpec — wolna ręka jednorącz ma inny kąt i nie dotyczy karty */
    const el = (u: number) => { const f = keyframeFrame(DATA[k], u); return jointAngles(f.sk, 'R').elbow; };
    expect([k, el(0) >= 70, el(1) <= 25]).toEqual([k, true, true]);
  });
});
