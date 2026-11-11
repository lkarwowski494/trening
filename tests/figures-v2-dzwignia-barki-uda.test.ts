/*
 * P1-CALF-1 (W-02 zadanie B, 11.11.2026; recenzja calf_raise r1 W1/W2 z 09.11.2026): punkty mocowania dźwigni maszyny „barki” (Standing Calf Raise: poduszki na barkach)
 * i „uda” (Seated Calf Raise: poduszka na udach tuż nad kolanami). Wcześniej: miednica (pręt poziomo przez biodra) i kostki (pręt przez stopy, odstęp ciężaru do −9,1 cm).
 * Miara: geometria z szkieletu klatki (keyframeFrame), niezależnie od silnika: bark = staw + oś tułowia · GIRTH.uarm[0], udo = punkt na odcinku biodro–kolano + promień kolidera uda.
 * Dwie miary (L-056 A): punkt styku I przenikanie. Przypadek negatywny na danych sprzed poprawki (pręt przy kostkach). Inne ćwiczenia z dźwignią: punkt bez zmian (baza z 11.11.2026).
 */
import * as fs from 'fs';
import * as path from 'path';
import { FAMILIES, hasPoseFile, poseKeys, keyframeFrame, propsFrom, gearFieldIssues, LEVER_POINT, LEVER_PAD, GIRTH, BODY, SIDES, distSegSeg, type PoseData, type Prop, type V3 } from '@/lib/figures/v2';
import { poseFile } from '@/lib/figures/v2/poseData';

type Slide = Extract<Prop, { k: 'slide' }>;
const CALF = poseFile('calf_raise')!.cwiczenia;
const us = Array.from({ length: 21 }, (_, i) => +(i / 20).toFixed(2));
const lever = (d: PoseData) => d.sprzet.find(g => g.rodzaj === 'dzwignia')!;
const slide = (d: PoseData, u: number) => { const f = keyframeFrame(d, u); return { f, s: f.props.find(p => p.k === 'slide') as Slide }; };
const lerp3 = (a: V3, b: V3, t: number): V3 => [0, 1, 2].map(i => a[i] + (b[i] - a[i]) * t) as V3;
const barkiR = (f: ReturnType<typeof keyframeFrame>): V3 => { const s = f.sk.arms.R.shoulder; return [0, 1, 2].map(i => s[i] + f.sk.up[i] * (GIRTH.uarm[0] + LEVER_PAD.padR)) as V3; };
const udoR = (f: ReturnType<typeof keyframeFrame>): V3 => { const L = f.sk.legs.R; const p = lerp3(L.hip, L.knee, LEVER_PAD.udaT); return [p[0], p[1] + (GIRTH.thigh[0] + GIRTH.thigh[2]) / 2 + LEVER_PAD.padR, p[2]]; };
const bliskoSzyny = (s: Slide): number => { const w = [0, 1, 2].map(i => s.to[i] - s.from[i]); const t = Math.max(0, Math.min(s.len, w[0] * s.dir[0] + w[1] * s.dir[1] + w[2] * s.dir[2])); return Math.hypot(...[0, 1, 2].map(i => w[i] - s.dir[i] * t)); };
const szyna = (s: Slide): [V3, V3] => [s.from, [0, 1, 2].map(i => s.from[i] + s.dir[i] * s.len) as V3];
/** Dane sprzed poprawki: pręt przy kostkach (Seated Calf Raise, punkt „kostki”, 11.11.2026 przed zmianą). */
const SEATED_STARE: PoseData = { ...CALF['Seated Calf Raise'], sprzet: CALF['Seated Calf Raise'].sprzet.map(g => g.rodzaj === 'dzwignia' ? { rodzaj: 'dzwignia', tryb: 'prosta', kat: 52.8, punkt: 'kostki', trzyma: 'R', x: 42, y: 11.1, z: 10, dlugosc: 15.8 } : g) };

describe('P1-CALF-1: LEVER_POINT „barki” i „uda” (silnik)', () => {
  test('lista punktów zawiera barki i uda; pola dźwigni z tymi punktami są poprawne w obu trybach (nie jak „podeszwy”)', () => {
    expect(LEVER_POINT).toEqual(expect.arrayContaining(['barki', 'uda']));
    for (const punkt of ['barki', 'uda'] as const) for (const tryb of ['prosta', 'obrot'] as const) expect([punkt, tryb, gearFieldIssues({ rodzaj: 'dzwignia', tryb, punkt, trzyma: 'R', x: 0, y: 50, z: 0, dlugosc: 40 })]).toEqual([punkt, tryb, []]);
  });
  test('propsFrom: punkt „barki” = góra barku strony trzyma, „uda” = środek udo-poduszka; bez ciała (stare wywołanie) — miednica, nie dłonie', () => {
    const G = { R: [12, 85, 20] as V3, L: [14, 90, -20] as V3 }; const A = { R: [5, 20, 9] as V3, L: [6, 22, -9] as V3 }; const P: V3 = [1, 2, 3];
    const body = { shoulders: { R: [7, 70, 19] as V3, L: [7, 70, -19] as V3 }, thighs: { R: [20, 50, 9] as V3, L: [20, 50, -9] as V3 } };
    const to = (punkt: string, trzyma: string, b?: typeof body) => (propsFrom([{ rodzaj: 'dzwignia', tryb: 'prosta', kat: 90, dlugosc: 20, punkt, trzyma } as never], G, A, P, b)[0] as Slide).to;
    expect(to('barki', 'R', body)).toEqual(body.shoulders.R); expect(to('barki', 'L', body)).toEqual(body.shoulders.L); expect(to('uda', 'R', body)).toEqual(body.thighs.R);
    expect(to('uda', 'obie', body)).toEqual([20, 50, 0]); expect(to('barki', 'R')).toEqual(P);
  });
});

describe('P1-CALF-1: Standing Calf Raise — poduszki na barkach (W1)', () => {
  const d = CALF['Standing Calf Raise'];
  test('dane: dźwignia prosta z punktem „barki” (nie miednica), nadal strona R', () => { expect([lever(d).punkt, lever(d).tryb, lever(d).trzyma]).toEqual(['barki', 'prosta', 'R']); });
  test('punkt styku: poduszka leży na barku R (góra barku) w każdej klatce, na prowadnicy (≤ 3 cm), ślad toru = poduszka', () => {
    for (const u of us) { const { f, s } = slide(d, u); const w = barkiR(f); for (let i = 0; i < 3; i++) expect([u, i, s.to[i]]).toEqual([u, i, expect.closeTo(w[i], 6)]); expect([u, bliskoSzyny(s) <= 3]).toEqual([u, true]); for (let i = 0; i < 3; i++) expect(f.info.trail![i]).toBeCloseTo(w[i], 6); }
  });
  test('ślad rośnie razem z wspięciem (poduszka jedzie w górę ≥ 10 cm), a nie stoi w miednicy', () => {
    const y = us.map(u => keyframeFrame(d, u).info.trail![1]); expect(Math.max(...y) - Math.min(...y)).toBeGreaterThanOrEqual(10); for (let i = 1; i < y.length; i++) expect(y[i]).toBeGreaterThanOrEqual(y[i - 1] - 1e-6);
    const f = keyframeFrame(d, 0.5); expect(Math.hypot(...[0, 1, 2].map(i => f.info.trail![i] - f.sk.pelvis[i]))).toBeGreaterThan(30);
  });
  test('prowadnica nie przechodzi przez tułów ani głowę (z boku barku, ≥ 0 cm od kolidera tułowia i głowy)', () => {
    for (const u of us) { const { f, s } = slide(d, u); const [a, b] = szyna(s); expect([u, distSegSeg(a, b, f.sk.pelvis, f.sk.shoulderC) - GIRTH.trunkCollide >= 0]).toEqual([u, true]); expect([u, distSegSeg(a, b, f.sk.head, f.sk.head) - BODY.headR >= 0]).toEqual([u, true]); }
  });
  test('przypadek negatywny na danych sprzed poprawki: punkt „miednica” leży ≥ 30 cm od barku', () => {
    const stare: PoseData = { ...d, sprzet: d.sprzet.map(g => g.rodzaj === 'dzwignia' ? { ...g, punkt: 'miednica' } : g) }; const f = keyframeFrame(stare, 0.5); const s = f.props.find(p => p.k === 'slide') as Slide;
    expect(Math.hypot(...[0, 1, 2].map(i => s.to[i] - barkiR(f)[i]))).toBeGreaterThan(30);
  });
});

describe('P1-CALF-1: Seated Calf Raise — poduszka na udach nad kolanami (W2)', () => {
  const d = CALF['Seated Calf Raise'];
  test('dane: dźwignia prosta z punktem „uda” (nie kostki)', () => { expect([lever(d).punkt, lever(d).tryb]).toEqual(['uda', 'prosta']); });
  test('punkt styku: poduszka na górze uda R (nad kolanem, promień kolidera uda) w każdej klatce, na prowadnicy (≤ 3 cm), ślad toru = poduszka', () => {
    for (const u of us) { const { f, s } = slide(d, u); const w = udoR(f); for (let i = 0; i < 3; i++) expect([u, i, s.to[i]]).toEqual([u, i, expect.closeTo(w[i], 6)]); expect([u, bliskoSzyny(s) <= 3]).toEqual([u, true]); for (let i = 0; i < 3; i++) expect(f.info.trail![i]).toBeCloseTo(w[i], 6); }
    expect(LEVER_PAD.udaT).toBeGreaterThan(0.6); expect(LEVER_PAD.udaT).toBeLessThan(0.95);
  });
  test('przenikanie stóp: prowadnica nie zbliża się do stóp (kostka, pięta, palce obu nóg) bliżej niż 8 cm w żadnej klatce', () => {
    for (const u of us) { const { f, s } = slide(d, u); const [a, b] = szyna(s); for (const sd of SIDES) for (const p of [f.sk.legs[sd].ankle, f.sk.legs[sd].heel, f.sk.legs[sd].toe]) expect([u, sd, distSegSeg(a, b, p, p) >= 8]).toEqual([u, sd, true]); }
  });
  test('przypadek negatywny na danych sprzed poprawki: pręt przy kostkach zbliża się do stopy o < 3 cm (miara potrafi paść)', () => {
    const m = Math.min(...us.flatMap(u => { const { f, s } = slide(SEATED_STARE, u); const [a, b] = szyna(s); return SIDES.flatMap(sd => [f.sk.legs[sd].ankle, f.sk.legs[sd].heel, f.sk.legs[sd].toe].map(p => distSegSeg(a, b, p, p))); }));
    expect(m).toBeLessThan(3);
  });
});

describe('P1-CALF-1: pozostałe ćwiczenia z dźwignią bez zmian (baza z 11.11.2026, przed poprawką)', () => {
  const baza = JSON.parse(fs.readFileSync(path.join(__dirname, 'dane/dzwignia-punkty-bazowe.json'), 'utf8')) as Record<string, { punkt: string; tryb: string; u: { from?: number[]; to?: number[]; len?: number; trail: number[] | null }[] }>;
  const ZMIENIONE = ['calf_raise|Standing Calf Raise', 'calf_raise|Seated Calf Raise'];
  const klucze = Object.keys(baza).filter(k => !ZMIENIONE.includes(k));
  test('baza obejmuje wszystkie ćwiczenia z dźwignią w paczce póz (34); zmienione tylko dwa maszynowe', () => {
    const teraz: string[] = []; for (const fam of FAMILIES) { if (!hasPoseFile(fam.id)) continue; const pf = poseFile(fam.id)!; for (const k of poseKeys(fam.id)) if (pf.cwiczenia[k].sprzet.some(g => g.rodzaj === 'dzwignia')) teraz.push(`${fam.id}|${k}`); }
    expect(teraz.sort()).toEqual(Object.keys(baza).sort()); expect(klucze.length).toBe(32);
  });
  test.each(klucze)('%s: punkt mocowania, ślad i prowadnica jak w bazie (u = 0, 0,5, 1)', klucz => {
    const [fam, cw] = klucz.split('|'); const d = poseFile(fam)!.cwiczenia[cw]; const b = baza[klucz];
    expect([lever(d).punkt ?? 'dlonie', lever(d).tryb ?? 'obrot']).toEqual([b.punkt, b.tryb]);
    [0, 0.5, 1].forEach((u, i) => { const f = keyframeFrame(d, u); const p = f.props.find(q => q.k === 'slide' || q.k === 'pivot') as { from: number[]; to: number[]; len?: number }; const e = b.u[i];
      for (let j = 0; j < 3; j++) { expect(p.to[j]).toBeCloseTo(e.to![j], 9); expect(p.from[j]).toBeCloseTo(e.from![j], 9); if (e.trail) expect(f.info.trail![j]).toBeCloseTo(e.trail[j], 9); } expect(p.len).toEqual(e.len); if (!e.trail) expect(f.info.trail ?? null).toBeNull(); });
  });
});
