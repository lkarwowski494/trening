/*
 * Rodzina delt_raise — poprawki po recenzji ruchu R1 (04.11.2026): Ś-1 unoszenie w przód w płaszczyźnie strzałkowej, Ś-2 naprzemienność i obrót w obie strony (cykl_lustro),
 * Ś-3 Cable Seated Lateral Raise (opór od startu), Ś-4 Machine Lateral Raise (dwie dźwignie), N-2/N-3 opisy przybliżeń, Y Raise (hantle) leżąc przodem na ławce skośnej,
 * Kettlebell Halo bez rysunku (decyzja właściciela 04.11.2026). Każda miara ma negatyw odtwarzający wadę (inne ćwiczenie o tym kształcie albo dane okaleczone do stanu sprzed poprawki).
 */
import { keyframeFrame, type PoseData } from '@/lib/figures/v2';
import * as fs from 'fs';
import * as path from 'path';

const DATA = JSON.parse(fs.readFileSync(path.join(__dirname, '../lib/figures/v2/poses/delt_raise.json'), 'utf8')).cwiczenia as Record<string, PoseData>;
const GEN = fs.readFileSync(path.join(__dirname, '../scripts/figures/agent-pozy/delt_raise.mjs'), 'utf8');
const WYJ = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/zrodla/figury-wyjatki.json'), 'utf8')).cwiczenia as Record<string, string>;
const U = Array.from({ length: 21 }, (_, i) => i / 20);
const kopia = (d: PoseData) => JSON.parse(JSON.stringify(d)) as PoseData;

describe('delt_raise R1 Ś-1: unoszenie w przód bez łuku na zewnątrz (front.setup „przed udami”, front.move „przed sobą”)', () => {
  const FRONT = ['Front Raise', 'Cable Front Raise', 'Dumbbell Front Raise to Overhead']; /* r2-W1 04.11.2026: Alternating Deltoid Raise ma drugie powtórzenie bokiem (karta adr.move) — jego pierwsze powtórzenie przodem mierzy tests/figures-v2-delt-raise-p2.test.ts */
  /** Chwyt ręki R stale na szerokości barku (≤ 3 cm od osi barku w poprzek) i na starcie ≥ 15 cm przed barkiem (przed udami, nie obok nich). */
  const wPrzod = (d: PoseData) => U.every(u => { const a = keyframeFrame(d, u).sk.arms.R; return Math.abs(Math.abs(a.grip[2]) - Math.abs(a.shoulder[2])) <= 3; }) && keyframeFrame(d, 0.0001).sk.arms.R.grip[0] - keyframeFrame(d, 0.0001).sk.arms.R.shoulder[0] >= 15;
  test.each(FRONT)('%s: chwyt w płaszczyźnie strzałkowej barku w 21 kadrach, start przed udami', k => { expect([k, wPrzod(DATA[k])]).toEqual([k, true]); });
  test('negatyw: unoszenie w bok (Lateral Raise) i skaptacja nie spełniają miary „w przód”', () => {
    expect(wPrzod(DATA['Lateral Raise (hantle)'])).toBe(false); expect(wPrzod(DATA['Dumbbell Scaption'])).toBe(false);
  });
  test('negatyw: stan sprzed poprawki (chwyt 35–48 cm od osi przy barku 19 cm) — kopia Front Raise z chwytem wyniesionym w bok odpada', () => {
    const stare = kopia(DATA['Front Raise']); for (const k of stare.klatki) { const g = (k.rece as any).R.chwyt as number[]; g[2] += 20 * Math.sin(Math.PI * k.u); }
    expect(wPrzod(stare)).toBe(false);
  });
});

describe('delt_raise R1 Ś-2: obrót Car Drivers w obie strony (Alternating — zob. r2-W1)', () => {
  const ALT = 'Alternating Deltoid Raise', CD = 'Car Drivers';
  const yR = (d: PoseData, u: number) => keyframeFrame(d, u).sk.arms.R.grip[1], yL = (d: PoseData, u: number) => keyframeFrame(d, u).sk.arms.L.grip[1];
  /* r2-W1 04.11.2026: Alternating Deltoid Raise nie jest już naprzemienną pętlą rąk (cykl_lustro: prawa w górę, lewa w dół) — karta adr.move mówi o DWÓCH powtórzeniach obiema rękami (przód, potem bok);
     pętla jednokierunkowa, miary w tests/figures-v2-delt-raise-p2.test.ts. Zostaje pętla lustrzana Car Drivers. */
  test('Car Drivers w wahadle (od 08.11.2026, r5-W1: pętla lustrzana miała cykl 2 s przy pasku faz 4 s), bez zamiany rąk w danych; Alternating Deltoid Raise w pętli jednokierunkowej (r2-W1)', () => { expect([DATA[CD].petla, (DATA[CD] as any).lustroRece]).toEqual([undefined, undefined]); expect([DATA[ALT].petla, (DATA[ALT] as any).lustroRece]).toEqual(['jednokierunkowa', undefined]); });
  test('Car Drivers: talerz obraca się w obie strony — różnica wysokości chwytów R i L zmienia znak (każdy znak ≥ 10 cm) w pętli', () => {
    const roz = (d: PoseData) => { const r = Array.from({ length: 21 }, (_, i) => yR(d, i / 20) - yL(d, i / 20)); /* wahadło: u 0 → 1 obejmuje obrót z +30° do −30° (08.11.2026), powrót to ten sam przebieg wstecz */ return [Math.min(...r), Math.max(...r)]; };
    const [mn, mx] = roz(DATA[CD]); expect(mn).toBeLessThanOrEqual(-10); expect(mx).toBeGreaterThanOrEqual(10);
  });
  test('negatyw: obrót w jedną stronę (stan sprzed poprawki) nie zmienia znaku; Front Raise nie jest naprzemienny', () => {
    const jedna = kopia(DATA[CD]); jedna.klatki = jedna.klatki.filter(k => k.u <= 0.5); delete (jedna as any).petla;
    const r = Array.from({ length: 21 }, (_, i) => yR(jedna, i / 20) - yL(jedna, i / 20)); expect(Math.min(...r)).toBeGreaterThan(-10);
    expect(Math.max(...U.map(u => Math.abs(yR(DATA['Front Raise'], u) - yL(DATA['Front Raise'], u))))).toBeLessThan(5); expect(DATA['Front Raise'].petla).toBeUndefined();
  });
});

describe('delt_raise R1 Ś-3: Cable Seated Lateral Raise — linka stawia opór od startu', () => {
  const K = 'Cable Seated Lateral Raise';
  /** Kolumna bliżej osi ciała niż chwyt (|z| kolumny < |z| dłoni) w każdym kadrze: linka ciągnie dłoń do środka, a nie w bok razem z ruchem. */
  const opor = (d: PoseData) => U.every(u => { const f = keyframeFrame(d, u); const c = f.props.filter(p => p.k === 'cable') as any[]; return c.length === 2 && c.every(x => Math.abs(x.from[2]) < Math.abs(x.to[2]) - 5); });
  test('21 kadrów: obie linki od kolumn leżących wewnątrz dłoni', () => { expect(opor(DATA[K])).toBe(true); });
  test('negatyw: kolumny na zewnątrz dłoni (z = ±60, stan sprzed poprawki) — linka pomaga na starcie', () => {
    const stare = kopia(DATA[K]); for (const g of stare.sprzet as any[]) if (g.rodzaj === 'wyciag') { g.z = 60; g.x = 0; }
    expect(opor(stare)).toBe(false);
  });
});

describe('delt_raise R1 Ś-4: Machine Lateral Raise — dźwignia przy każdej ręce', () => {
  const dzw = (d: PoseData) => (d.sprzet as any[]).filter(g => g.rodzaj === 'dzwignia').map(g => g.trzyma).sort().join(',');
  test('dwie dźwignie (R i L) o osiach po obu stronach ciała', () => {
    expect(dzw(DATA['Machine Lateral Raise'])).toBe('L,R'); const z = (DATA['Machine Lateral Raise'].sprzet as any[]).filter(g => g.rodzaj === 'dzwignia').map(g => g.z); expect(z[0] * z[1]).toBeLessThan(0);
  });
  test('negatyw: dźwignia tylko po stronie R (stan sprzed poprawki)', () => {
    const stare = kopia(DATA['Machine Lateral Raise']); stare.sprzet = (stare.sprzet as any[]).filter(g => !(g.rodzaj === 'dzwignia' && g.trzyma === 'L')); expect(dzw(stare)).toBe('R');
  });
});

describe('delt_raise R1: Y Raise (hantle) — leżenie przodem na ławce skośnej (decyzja 04.11.2026; oba źródła i katalog: chest-down on an incline bench)', () => {
  const K = 'Y Raise (hantle)';
  /** Przodem: przód tułowia skierowany w dół (iloczyn z pionem ≥ 0,3), ławka skośna 30–60°, głowa nad miednicą nie wyżej niż barki. */
  const przodem = (d: PoseData) => { const l = (d.sprzet as any[]).find(g => g.rodzaj === 'lawka'); const f = keyframeFrame(d, 0).sk as any; return !!l && l.kat >= 30 && l.kat <= 60 && f.front[1] <= -0.3; };
  test('ławka skośna i tułów leży przodem', () => { expect(przodem(DATA[K])).toBe(true); });
  test('ramiona rozwarte w literę Y: w górze odwiedzenie względem osi ciała ≥ 25 cm od płaszczyzny barku, zwis na starcie', () => {
    const f1 = keyframeFrame(DATA[K], 1).sk.arms.R, f0 = keyframeFrame(DATA[K], 0).sk.arms.R;
    expect(Math.abs(f1.grip[2]) - Math.abs(f1.shoulder[2])).toBeGreaterThanOrEqual(25); expect(f0.shoulder[1] - f0.grip[1]).toBeGreaterThanOrEqual(55);
  });
  test('negatyw: Cable Y Raise (stojąc) i Reverse Fly (w skłonie bez ławki) nie są leżeniem przodem na ławce', () => { expect(przodem(DATA['Cable Y Raise'])).toBe(false); expect(przodem(DATA['Reverse Fly (hantle)'])).toBe(false); });
});

describe('delt_raise R1: Kettlebell Halo bez rysunku w 1.1 (decyzja właściciela 04.11.2026)', () => {
  test('brak pozy w pliku, wyjątek z powodem w figury-wyjatki.json i w WYJATKI generatora', () => {
    expect(DATA['Kettlebell Halo']).toBeUndefined();
    expect(WYJ['Kettlebell Halo']).toMatch(/contract\.ts:509/); expect(WYJ['Kettlebell Halo']).toMatch(/04\.11\.2026/);
    expect(GEN).toMatch(/WYJATKI = \{\s*'Kettlebell Halo'/);
  });
});

describe('delt_raise R1 N-2/N-3: opisy przybliżeń zgodne z rysunkiem', () => {
  const opis = (k: string) => (GEN.match(new RegExp(`'${k.replace(/[()]/g, '\\$&')}': '([^']*)'`, 'g')) ?? []).join(' ');
  test('Lying One-Arm Rear Lateral Raise: ławka w opisie i w danych, nie „na podłodze zamiast na ławce” (r2-W2 04.11.2026: leżenie przodem na ławce lekko pochylonej, ≤ 20°, zamiast płaskiej na boku)', () => {
    const t = opis('Dumbbell Lying One-Arm Rear Lateral Raise'); expect(t).toMatch(/na ławce lekko pochylonej/); expect(t).not.toMatch(/na podłodze zamiast/);
    expect((DATA['Dumbbell Lying One-Arm Rear Lateral Raise'].sprzet as any[]).some(g => g.rodzaj === 'lawka' && g.kat <= 20)).toBe(true);
  });
  test.each(['Cable Lateral Raise', 'Cable Reverse Fly', 'Cable Seated Lateral Raise', 'Machine Lateral Raise', 'Car Drivers'])('%s ma nazwane przybliżenie', k => { expect(opis(k).length).toBeGreaterThan(60); });
  test('Machine Lateral Raise i Car Drivers: opis zgodny z nowym rysunkiem (dwie dźwignie; obrót w obie strony)', () => {
    expect(opis('Machine Lateral Raise')).toMatch(/dwie dźwignie/); expect(opis('Car Drivers')).toMatch(/obie strony/);
  });
});
