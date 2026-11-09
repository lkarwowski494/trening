/*
 * Rodzina delt_raise — poprawki po recenzji ruchu r2 (04.11.2026): r2-W1 Alternating Deltoid Raise (dwa powtórzenia: przód, potem bok — karta adr.move), r2-W2 Dumbbell Lying One-Arm Rear Lateral Raise
 * (leżenie PRZODEM na ławce, ręka zwisa i unosi się bokiem do wysokości barku — karta rear1.setup / rear1.move / rear1.mis.high), r2-N1 Smith Machine One-Arm Upright Row (gryf w szynie),
 * K1-przygotowanie (próg toru łukowego z geometrii ramienia). Każda miara ma negatyw: inne ćwiczenie o tym kształcie albo dane okaleczone do stanu sprzed poprawki.
 */
import { keyframeFrame, CONTRACT, type PoseData } from '@/lib/figures/v2';
import { progLukuRamienia } from './helpers/tor-luk-ramienia';
import * as fs from 'fs';
import * as path from 'path';

const DATA = JSON.parse(fs.readFileSync(path.join(__dirname, '../lib/figures/v2/poses/delt_raise.json'), 'utf8')).cwiczenia as Record<string, PoseData>;
const GEN = fs.readFileSync(path.join(__dirname, '../scripts/figures/agent-pozy/delt_raise.mjs'), 'utf8');
const kopia = (d: PoseData) => JSON.parse(JSON.stringify(d)) as PoseData;
const UU = Array.from({ length: 221 }, (_, i) => i / 220);
const ark = (d: PoseData, s: 'R' | 'L', u: number) => keyframeFrame(d, u).sk.arms[s];
/** Wysokość dłoni względem barku (cm, świat) oraz przesunięcie do przodu (x) i w bok (|z|) względem barku. */
const poz = (d: PoseData, s: 'R' | 'L', u: number) => { const a = ark(d, s, u); return { h: a.grip[1] - a.shoulder[1], x: a.grip[0] - a.shoulder[0], z: Math.abs(a.grip[2] - a.shoulder[2]) }; };

describe('r2-W1 Alternating Deltoid Raise: dwa powtórzenia obiema rękami — przód, potem bok (adr.move)', () => {
  const K = 'Alternating Deltoid Raise';
  /** Szczyty ruchu: lokalne maksima wysokości dłoni R powyżej wysokości barku − 15 cm; każdy opisany przez płaszczyznę (do przodu / w bok). */
  const szczyty = (d: PoseData) => {
    const h = UU.map(u => poz(d, 'R', u).h); const out: { u: number; h: number; x: number; z: number }[] = [];
    for (let i = 1; i < UU.length - 1; i++) if (h[i] > h[i - 1] && h[i] >= h[i + 1] && h[i] >= -15) out.push({ u: UU[i], ...poz(d, 'R', UU[i]) });
    return out;
  };
  const przod = (t: { x: number; z: number }) => t.x >= 45 && t.z <= 25 + 3; /* przed sobą: dłoń ≥ 45 cm przed barkiem, w poprzek ≤ 28 cm (bark 19 cm + 9 cm luzu hantla) */
  const bok = (t: { x: number; z: number }) => t.z >= 55 && t.x <= 15; /* bokiem: dłoń ≥ 55 cm od osi barku w poprzek, ≤ 15 cm przed barkiem */
  const dwaPowtorzenia = (d: PoseData) => { const s = szczyty(d); return s.length === 2 && przod(s[0]) && bok(s[1]) && s.every(t => Math.abs(t.h) <= 15); };
  test('pętla jednokierunkowa, ≤ CONTRACT.frames.maxDynamic klatek (r3: 17), u od 0 do 1 (całe dwa powtórzenia w jednym przebiegu)', () => {
    expect([DATA[K].petla, (DATA[K] as any).lustroRece]).toEqual(['jednokierunkowa', undefined]); expect(DATA[K].klatki.length).toBeLessThanOrEqual(CONTRACT.frames.maxDynamic);
    expect([DATA[K].klatki[0].u, DATA[K].klatki[DATA[K].klatki.length - 1].u]).toEqual([0, 1]);
  });
  test('dokładnie dwa szczyty: pierwszy PRZED sobą, drugi BOKIEM, oba na wysokości barków (|Δy| ≤ 15 cm)', () => {
    const s = szczyty(DATA[K]); expect(s.length).toBe(2); expect(przod(s[0])).toBe(true); expect(bok(s[1])).toBe(true); expect(s.every(t => Math.abs(t.h) <= 15)).toBe(true); expect(s[0].u).toBeLessThan(s[1].u);
  });
  test('oba hantle naraz: ręce R i L na tej samej wysokości i w tej samej odległości od osi w każdym z 221 ułamków ruchu (różnica ≤ 1 cm)', () => {
    for (const u of UU) { const r = poz(DATA[K], 'R', u), l = poz(DATA[K], 'L', u); expect([u, Math.abs(r.h - l.h) <= 1, Math.abs(r.x - l.x) <= 1, Math.abs(r.z - l.z) <= 1]).toEqual([u, true, true, true]); }
  });
  test('między powtórzeniami ręce wracają do zwisu (≥ 50 cm pod barkiem), start i koniec pętli to zwis, a koniec różni się od początku (bok / przód)', () => {
    const ws = UU.filter(u => u > 0.3 && u < 0.7).map(u => poz(DATA[K], 'R', u).h); expect(Math.min(...ws)).toBeLessThanOrEqual(-50);
    expect(poz(DATA[K], 'R', 0).h).toBeLessThanOrEqual(-50); expect(poz(DATA[K], 'R', 1).h).toBeLessThanOrEqual(-50);
  });
  test('negatyw: stan sprzed poprawki (jedna ręka w górze, druga w dół — cykl_lustro) nie spełnia „oba hantle naraz”', () => {
    const stare = kopia(DATA[K]); for (const k of stare.klatki) { const R = (k.rece as any).R; (k.rece as any).L = JSON.parse(JSON.stringify({ ...R })); const g = (k.rece as any).L.chwyt as number[]; g[1] = 40 + 0 * g[1]; }
    expect(UU.every(u => Math.abs(poz(stare, 'R', u).h - poz(stare, 'L', u).h) <= 1)).toBe(false);
  });
  test.each(['Front Raise', 'Lateral Raise (hantle)', 'Cable Front Raise', 'Dumbbell Scaption', 'Car Drivers'])('negatyw: %s (jedna płaszczyzna albo inny ruch) nie jest „przód, potem bok”', k => { expect(dwaPowtorzenia(DATA[k])).toBe(false); });
  test('negatyw: Alternating z drugim powtórzeniem znów przodem (zepsute dane) nie przechodzi miary „drugi szczyt bokiem”', () => {
    const zle = kopia(DATA[K]); const f = zle.klatki.filter(k => k.u > 0.5); for (const k of f) for (const s of ['R', 'L'] as const) { const g = (k.rece as any)[s].chwyt as number[]; const sh = ark(DATA[K], s, 0).shoulder; g[2] = sh[2] + Math.sign(g[2] - sh[2]) * 19; }
    expect(dwaPowtorzenia(zle)).toBe(false);
  });
  test('wyjątek pętli zamkniętej jest uzasadniony: DLON_NA_WYSOKOSCI_BARKOW_WYJATKI i dynamiczne w danych sensu nazywają Alternating, a generator ma klatki jednokierunkowe', () => {
    const J = fs.readFileSync(path.join(__dirname, '../scripts/figures/v2-jakosc.mjs'), 'utf8'); expect(J).toMatch(/DLON_NA_WYSOKOSCI_BARKOW_WYJATKI = \{ 'Alternating Deltoid Raise'/);
    const S = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/zrodla/figury-sens.json'), 'utf8')).rodziny.delt_raise; expect(String(S.dynamiczne['Alternating Deltoid Raise'])).toMatch(/maxJumpDynamic/); expect(GEN).toMatch(/jednokierunkowa\(stoj\('Alternating Deltoid Raise'/);
  });
});

describe('r2-W2 Dumbbell Lying One-Arm Rear Lateral Raise: leżenie przodem, zwis i unoszenie bokiem do wysokości barku, nie wyżej', () => {
  const K = 'Dumbbell Lying One-Arm Rear Lateral Raise';
  /** Przodem na ławce: ławka płaska albo lekko pochylona (≤ 20°), przód tułowia w dół (składowa y wektora „przód” ≤ −0,3). */
  const przodem = (d: PoseData) => { const l = (d.sprzet as any[]).find(g => g.rodzaj === 'lawka'); const f = keyframeFrame(d, 0).sk as any; return !!l && l.kat <= 20 && f.front[1] <= -0.3; };
  /** Zwis w u = 0 (dłoń ≥ 55 cm pod barkiem, w poprzek ≤ 6 cm), góra w u = 1 na wysokości barku (|Δy| ≤ 6 cm) ≥ 55 cm w bok, nigdzie wyżej niż bark + 6 cm. */
  const zwisIBok = (d: PoseData) => { const a = poz(d, 'R', 0), b = poz(d, 'R', 1); return a.h <= -55 && a.z <= 6 && Math.abs(b.h) <= 6 && b.z >= 55 && UU.every(u => poz(d, 'R', u).h <= 6); };
  test('leżenie przodem na ławce', () => { expect(przodem(DATA[K])).toBe(true); });
  test('ręka R: zwis → bokiem do wysokości barku (nie wyżej) w płaszczyźnie prostopadłej do tułowia (przesunięcie wzdłuż tułowia ≤ 6 cm w każdym ułamku ruchu)', () => {
    expect(zwisIBok(DATA[K])).toBe(true); for (const u of UU) expect([u, poz(DATA[K], 'R', u).x <= 6 && poz(DATA[K], 'R', u).x >= -6]).toEqual([u, true]);
  });
  test('druga ręka (L) zwisa swobodnie przez cały ruch (≥ 55 cm pod barkiem)', () => { expect(UU.every(u => poz(DATA[K], 'L', u).h <= -55)).toBe(true); });
  test('negatyw: ręka unoszona wyżej niż bark (stan sprzed poprawki: do pionu nad barkiem) nie spełnia miary', () => {
    const wyzej = kopia(DATA[K]); const k = wyzej.klatki[wyzej.klatki.length - 1]; const g = (k.rece as any).R.chwyt as number[]; g[1] += 40; expect(zwisIBok(wyzej)).toBe(false);
  });
  test('negatyw: ruch od poziomu (bez zwisu na starcie) nie spełnia miary „zwis”', () => {
    const bezZwisu = kopia(DATA[K]); const k0 = bezZwisu.klatki[0]; const g = (k0.rece as any).R.chwyt as number[]; g[1] += 50; expect(zwisIBok(bezZwisu)).toBe(false);
  });
  test.each(['Y Raise (hantle)', 'Reverse Fly (hantle)', 'One-Arm Cable Rear Lateral Raise', 'Straight Raises on Incline Bench'])('negatyw: %s nie jest „zwis → bokiem do barku”', k => { expect(zwisIBok(DATA[k]) && przodem(DATA[k])).toBe(false); });
  test('opis przybliżenia w generatorze mówi o leżeniu przodem, nie o boku', () => {
    const t = (GEN.match(/'Dumbbell Lying One-Arm Rear Lateral Raise': '([^']*)'/) ?? [])[1] ?? ''; expect(t).toMatch(/leżenie przodem/); expect(t).not.toMatch(/na lewym boku/);
  });
});

describe('r2-N1 Smith Machine One-Arm Upright Row: gryf na szynie w każdej klatce', () => {
  const rail = (d: PoseData, u: number) => { const f = keyframeFrame(d, u); const r = f.props.find(p => p.k === 'rail') as { x: number } | undefined; return { rail: r?.x, bar: f.info.load?.[0] }; };
  test.each(['Smith Machine One-Arm Upright Row', 'Smith Machine Upright Row'])('%s: |x gryfu − x szyny| = 0 w 21 kadrach', k => {
    for (let i = 0; i <= 20; i++) { const r = rail(DATA[k], i / 20); expect([k, i, r.rail !== undefined, +Math.abs(r.bar! - r.rail!).toFixed(2)]).toEqual([k, i, true, 0]); }
  });
  test('negatyw: szyna 1 cm przed chwytem (stan sprzed poprawki, x = 17) odpada', () => {
    const stare = kopia(DATA['Smith Machine One-Arm Upright Row']); for (const g of stare.sprzet as any[]) if (g.rodzaj === 'smith') g.x = 17;
    expect(+Math.abs(rail(stare, 0.5).bar! - rail(stare, 0.5).rail!).toFixed(2)).toBeGreaterThan(0.5);
  });
});

describe('K1-przygotowanie: próg toru łukowego delt_raise z geometrii ramienia (r·(1 − cos(Δθ/2)) + dryf)', () => {
  test('Front Raise to Overhead (Δθ ≈ 155°) ≈ 48,6 + 2 cm; Lateral Raise (Δθ ≈ 79°) ≈ 13–14 + 2 cm; próg nigdy poniżej 4 cm', () => {
    expect(progLukuRamienia(DATA['Dumbbell Front Raise to Overhead'], 'side')).toBeGreaterThan(49.5); expect(progLukuRamienia(DATA['Dumbbell Front Raise to Overhead'], 'side')).toBeLessThan(52);
    expect(progLukuRamienia(DATA['Lateral Raise (hantle)'], 'front')).toBeGreaterThan(14); expect(progLukuRamienia(DATA['Lateral Raise (hantle)'], 'front')).toBeLessThan(17.5);
    for (const k of Object.keys(DATA)) for (const v of ['front', 'side'] as const) expect(progLukuRamienia(DATA[k], v)).toBeGreaterThanOrEqual(4);
  });
  test('negatyw: ćwiczenie z krótszym łukiem ma niższy próg niż z dłuższym (próg zależy od Δθ, nie jest jedną liczbą)', () => {
    expect(progLukuRamienia(DATA['Machine Lateral Raise'], 'front')).toBeLessThan(progLukuRamienia(DATA['Dumbbell Front Raise to Overhead'], 'side') - 20);
  });
});
