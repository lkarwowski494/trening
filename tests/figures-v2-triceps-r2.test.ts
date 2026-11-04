/*
 * Rodzina triceps — poprawki po recenzji ruchu R1 (04.11.2026): Ś-1 Tate Press (hantle poprzecznie, nachwyt), Ś-2 Kneeling Cable Triceps Extension (ławka podpiera),
 * Ś-3 Lying Close-Grip Barbell Triceps Extension Behind The Head (gryf za głową). Każda miara ma negatyw odtwarzający wadę z recenzji (stare dane / ćwiczenie o tym samym kształcie).
 */
import { keyframeFrame, type PoseData } from '@/lib/figures/v2';
import * as fs from 'fs';
import * as path from 'path';

const DATA = JSON.parse(fs.readFileSync(path.join(__dirname, '../lib/figures/v2/poses/triceps.json'), 'utf8')).cwiczenia as Record<string, PoseData>;
const U = Array.from({ length: 21 }, (_, i) => i / 20);
const TATE = 'Tate Press', KNEEL = 'Kneeling Cable Triceps Extension', BEHIND = 'Lying Close-Grip Barbell Triceps Extension Behind The Head', SKULL = 'Skullcrusher (sztanga)';
type Prop = { k: string; axis?: number[] };
/** Wada z recenzji: oś hantla w płaszczyźnie strzałkowej (|z| ≈ 0), hantel stoi talerzem na mostku. Poprawnie: oś w poprzek ciała (brak wektora osi albo |z| ≥ 0,95). */
const poprzecznie = (d: PoseData) => U.every(u => keyframeFrame(d, u).props.filter(p => p.k === 'dumbbell').every(p => { const a = (p as Prop).axis; return !a || Math.abs(a[2]) >= 0.95; }));

describe('triceps R1 Ś-1: Tate Press — hantle leżą poprzecznie, nachwytem', () => {
  test('oś obu hantli w poprzek ciała w 21 kadrach, a obrót przedramienia |obrót| ≥ 80° (nachwyt)', () => {
    expect(poprzecznie(DATA[TATE])).toBe(true);
    for (const k of DATA[TATE].klatki) for (const s of ['R', 'L'] as const) expect(Math.abs((k.rece as any)[s].obrotPrzedramienia)).toBeGreaterThanOrEqual(80);
  });
  test('końce hantli przy mostku (u = 0): środki chwytów ±12 cm od osi ciała, hantle nie wnikają w siebie głębiej niż 6 cm', () => {
    const f = keyframeFrame(DATA[TATE], 0); const z = [f.sk.arms.R.grip[2], f.sk.arms.L.grip[2]].map(Math.abs);
    expect(Math.max(...z)).toBeLessThanOrEqual(14); expect(Math.min(...z)).toBeGreaterThanOrEqual(10);
  });
  test('negatyw: stare dane (obrotPrzedramienia 0) stawiają hantel wzdłuż ciała — miara je odrzuca', () => {
    const stare = JSON.parse(JSON.stringify(DATA[TATE])) as PoseData; for (const k of stare.klatki) for (const s of ['R', 'L'] as const) (k.rece as any)[s].obrotPrzedramienia = 0;
    expect(poprzecznie(stare)).toBe(false);
  });
});

describe('triceps R1 Ś-2: każda ławka w rodzinie podpiera postać', () => {
  /* ławki płaskie i ujemne (|kąt| ≤ 20°): skośne i oparcie maszyny mają inny obrys (x od dolnego końca), poza zakresem tej miary */
  const zLawka = Object.keys(DATA).filter(k => DATA[k].sprzet.some(g => g.rodzaj === 'lawka' && Math.abs((g as any).kat) <= 20));
  /** Ławka obejmuje [x − długość, x]; postać (miednica albo kostka) ma być nad nią w zakresie x (±5 cm). */
  const podpiera = (d: PoseData) => { const l = d.sprzet.find(g => g.rodzaj === 'lawka') as any; return U.every(u => { const f = keyframeFrame(d, u); return [f.sk.pelvis[0], f.sk.legs.R.ankle[0], f.sk.legs.L.ankle[0]].some(x => x <= l.x + 5 && x >= l.x - l.dlugosc - 5); }); };
  test.each(zLawka)('%s: ławka pod postacią', k => { expect([k, podpiera(DATA[k])]).toEqual([k, true]); });
  test('Kneeling Cable Triceps Extension: kostki i kolana spoczywają na siedzisku (kostka nad blatem ławki), a nie 1 m obok', () => {
    const l = DATA[KNEEL].sprzet.find(g => g.rodzaj === 'lawka') as any; expect(l).toBeTruthy();
    for (const u of U) { const f = keyframeFrame(DATA[KNEEL], u); expect(f.sk.legs.R.ankle[1]).toBeGreaterThanOrEqual(l.top); expect(Math.abs(f.sk.legs.R.ankle[0] - l.x)).toBeLessThan(l.dlugosc); }
  });
  test('negatyw: ławka 130 cm przed postacią (stan sprzed poprawki) nie podpiera', () => {
    const stare = JSON.parse(JSON.stringify(DATA[KNEEL])) as PoseData; (stare.sprzet.find(g => g.rodzaj === 'lawka') as any).x = 130;
    expect(podpiera(stare)).toBe(false);
  });
});

describe('triceps R1 Ś-3: Behind The Head — gryf schodzi za głowę, inaczej niż Skullcrusher', () => {
  /** „Za głową”: chwyt dalej w tył niż środek głowy o promień głowy (ok. 11 cm) + 7 cm zapasu, w każdym z 21 kadrów. */
  const ZA = 18;
  const zaGlowa = (d: PoseData) => U.every(u => { const f = keyframeFrame(d, u); return f.sk.arms.R.grip[0] <= f.sk.head[0] - ZA; });
  test('gryf ≥ 18 cm za środkiem głowy w całym ruchu; w dole (u = 0) poniżej górnej krawędzi głowy', () => {
    expect(zaGlowa(DATA[BEHIND])).toBe(true);
    const f = keyframeFrame(DATA[BEHIND], 0); expect(f.sk.arms.R.grip[1]).toBeLessThanOrEqual(f.sk.head[1] + 11);
  });
  test('ramię odchylone w tył wyraźnie dalej niż w Skullcrusher: łokieć dalej w tył o ≥ 10 cm', () => {
    const e = (k: string) => keyframeFrame(DATA[k], 0).sk.arms.R.elbow[0]; expect(e(SKULL) - e(BEHIND)).toBeGreaterThanOrEqual(10);
  });
  test('negatyw: Skullcrusher (sztanga) — gryf nad czołem, ten sam kształt co wada z recenzji — nie spełnia miary „za głową”', () => {
    expect(zaGlowa(DATA[SKULL])).toBe(false);
  });
});
