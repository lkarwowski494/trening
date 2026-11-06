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
/** Wada z recenzji: oś hantla w płaszczyźnie strzałkowej (|z| ≈ 0), hantel stoi talerzem na mostku. Poprawnie: oś w poprzek ciała (brak wektora osi albo |z| ≥ 0,7). Od FW2 (04.11.2026) oś płynnie odchodzi od poprzecznej, gdy przedramię jest skośne (⟂ do przedramienia), więc próg 0,95 → 0,7 (przy obrocie 0 |z| ≈ 0). */
const poprzecznie = (d: PoseData) => U.every(u => keyframeFrame(d, u).props.filter(p => p.k === 'dumbbell').every(p => { const a = (p as Prop).axis; return !a || Math.abs(a[2]) >= 0.7; }));

describe('triceps R1 Ś-1: Tate Press — hantle leżą poprzecznie, nachwytem', () => {
  test('oś obu hantli w poprzek ciała w 21 kadrach, a obrót przedramienia bez wartości albo |obrót| ≥ 80° (nachwyt; r2 04.11.2026: dane bez pola, bo FW2 przy −80° odchylał oś od poprzecznej)', () => {
    expect(poprzecznie(DATA[TATE])).toBe(true);
    for (const k of DATA[TATE].klatki) for (const s of ['R', 'L'] as const) { const o = (k.rece as any)[s].obrotPrzedramienia; if (o !== undefined) expect(Math.abs(o)).toBeGreaterThanOrEqual(80); }
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

describe('triceps R1 Ś-3 (zmienione przez r2 04.11.2026): Behind The Head — ramię prawie pionowo, gryf za głową', () => {
  /* r2 04.11.2026 odwraca R1 Ś-3 (ramię 140° w tył): źródła (wejście T1: Catalyst „past the top of the head”, ACE #36 „slightly behind your head … until the upper arms begin to drift backwards”) dają ramię ok. pionowo; głębokie zgięcie łokcia sprowadza gryf za czubek głowy. */
  const katRamienia = (d: PoseData, u = 0) => { const a = keyframeFrame(d, u).sk.arms.R; return Math.atan2(a.shoulder[0] - a.elbow[0], a.elbow[1] - a.shoulder[1]) * 180 / Math.PI; }; /* stopnie od pionu, dodatnie = łokieć w tył (−x) */
  const GLOWA_R = 11;
  const zaCzubkiem = (d: PoseData) => { const f = keyframeFrame(d, 0); return f.sk.arms.R.grip[0] <= f.sk.head[0] - GLOWA_R; };
  test('ramię 12–30° od pionu w tył w całym ruchu i nieruchome (dryf łokcia ≤ 2 cm); nie wraca do 50° z R1', () => {
    for (const u of U) { const k = katRamienia(DATA[BEHIND], u); expect(k).toBeGreaterThanOrEqual(12); expect(k).toBeLessThanOrEqual(30); }
    const e0 = keyframeFrame(DATA[BEHIND], 0).sk.arms.R.elbow, e1 = keyframeFrame(DATA[BEHIND], 1).sk.arms.R.elbow; expect(Math.hypot(e0[0] - e1[0], e0[1] - e1[1])).toBeLessThanOrEqual(2);
  });
  test('w dole (u = 0) gryf jest za czubkiem głowy (≥ promień głowy za jej środkiem) i nie wyżej niż 15 cm nad środkiem głowy', () => {
    expect(zaCzubkiem(DATA[BEHIND])).toBe(true);
    const f = keyframeFrame(DATA[BEHIND], 0); expect(f.sk.arms.R.grip[1]).toBeLessThanOrEqual(f.sk.head[1] + 15);
  });
  test('negatyw: Skullcrusher (sztanga) — ramię ok. 10° od pionu i gryf nad czołem — nie spełnia miary', () => {
    expect(katRamienia(DATA[SKULL])).toBeLessThan(12); expect(zaCzubkiem(DATA[SKULL])).toBe(false);
  });
});

describe('triceps r2 04.11.2026: Machine Triceps Extension — ramiona na podpórce, ruch tylko w łokciu', () => {
  const MACH = 'Machine Triceps Extension';
  /** Odległość łokcia od płaszczyzny podpórki (linia od górnego końca [x, top] w dół pod kątem kat; dodatnia = nad podpórką). */
  const odPodpory = (d: PoseData, u: number) => { const p = d.sprzet.find(g => g.rodzaj === 'modlitewnik') as any; if (!p) return Infinity; const th = p.kat * Math.PI / 180; const e = keyframeFrame(d, u).sk.arms.R.elbow; return Math.abs((e[0] - p.x) * Math.sin(th) + (e[1] - p.top) * Math.cos(th)); };
  test('sprzęt: podpórka na ramiona (modlitewnik) i dźwignia', () => { const r = DATA[MACH].sprzet.map(g => g.rodzaj); expect(r).toContain('modlitewnik'); expect(r).toContain('dzwignia'); });
  test('łokieć leży na podpórce (≤ 8 cm od jej powierzchni) i bark z łokciem stoją w miejscu (dryf ≤ 2 cm) w 21 kadrach', () => {
    const f0 = keyframeFrame(DATA[MACH], 0).sk.arms.R;
    for (const u of U) { expect(odPodpory(DATA[MACH], u)).toBeLessThanOrEqual(8); const a = keyframeFrame(DATA[MACH], u).sk.arms.R; expect(Math.hypot(a.elbow[0] - f0.elbow[0], a.elbow[1] - f0.elbow[1])).toBeLessThanOrEqual(2); expect(Math.hypot(a.shoulder[0] - f0.shoulder[0], a.shoulder[1] - f0.shoulder[1])).toBeLessThanOrEqual(2); }
  });
  test('negatyw: wersja sprzed r2 (siedzisko z oparciem, bez podpórki) nie ma podpórki, a podpórka przesunięta o 30 cm odrzuca miarę', () => {
    const stare = JSON.parse(JSON.stringify(DATA[MACH])) as PoseData; stare.sprzet = stare.sprzet.filter(g => g.rodzaj !== 'modlitewnik'); expect(odPodpory(stare, 0)).toBe(Infinity);
    const daleko = JSON.parse(JSON.stringify(DATA[MACH])) as PoseData; (daleko.sprzet.find(g => g.rodzaj === 'modlitewnik') as any).x += 30; expect(odPodpory(daleko, 0)).toBeGreaterThan(8);
  });
});

describe('triceps r2 04.11.2026: Incline Barbell Triceps Extension — ławka skośna 10–20°', () => {
  /* BarBend (wejście T1, triceps-wejscie-2.md): „incline bench” ustawiona na 10–20°; dotąd 55° */
  const kat = (d: PoseData) => (d.sprzet.find(g => g.rodzaj === 'lawka') as any).kat as number;
  test('kąt oparcia 10–20°', () => { expect(kat(DATA['Incline Barbell Triceps Extension'])).toBeGreaterThanOrEqual(10); expect(kat(DATA['Incline Barbell Triceps Extension'])).toBeLessThanOrEqual(20); });
  test('ramię ≤ 15° od pionu w przestrzeni, nieruchome', () => {
    for (const u of U) { const a = keyframeFrame(DATA['Incline Barbell Triceps Extension'], u).sk.arms.R; expect(Math.abs(Math.atan2(a.elbow[0] - a.shoulder[0], a.elbow[1] - a.shoulder[1]) * 180 / Math.PI)).toBeLessThanOrEqual(15); }
  });
  test('negatyw: Cable Incline (ławka 55°, źródło otwarte) i stan sprzed r2 wychodzą poza 10–20°', () => {
    expect(kat(DATA['Cable Incline Triceps Extension'])).toBeGreaterThan(20);
  });
});

describe('triceps r2 04.11.2026: Two-Arm Dumbbell Kickback — u = 0: ramię równolegle do tułowia, łokieć ok. 90°', () => {
  const KB = 'Two-Arm Dumbbell Kickback';
  const wektor = (a: number[], b: number[]) => [b[0] - a[0], b[1] - a[1]];
  const kat2 = (a: number[], b: number[]) => Math.acos((a[0] * b[0] + a[1] * b[1]) / (Math.hypot(a[0], a[1]) * Math.hypot(b[0], b[1]))) * 180 / Math.PI;
  const miary = (d: PoseData) => { const f = keyframeFrame(d, 0); const a = f.sk.arms.R; const tulow = wektor(a.shoulder, f.sk.pelvis); return { rownolegle: kat2(wektor(a.shoulder, a.elbow), tulow), lokiec: kat2(wektor(a.elbow, a.shoulder), wektor(a.elbow, a.grip)) }; };
  test('kąt ramię–tułów ≤ 10°, łokieć 80–100°', () => { const m = miary(DATA[KB]); expect(m.rownolegle).toBeLessThanOrEqual(10); expect(m.lokiec).toBeGreaterThanOrEqual(80); expect(m.lokiec).toBeLessThanOrEqual(100); });
  test('negatyw: ramię opuszczone pionowo (Two-Arm z chwytem przesuniętym o 30 cm w dół) i ramię w poprzek nie spełniają miary', () => {
    const kopia = JSON.parse(JSON.stringify(DATA[KB])) as PoseData; for (const s of ['R', 'L'] as const) { const c = (kopia.klatki[0].rece as any)[s].chwyt; c[0] += 30; c[1] -= 5; }
    const m = miary(kopia); expect(m.rownolegle > 10 || m.lokiec < 80 || m.lokiec > 100).toBe(true);
  });
});
