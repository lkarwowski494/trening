/*
 * cable_press (10.11.2026, partia 4 linii 1.1, K4/K6/K7): każda dłoń pracująca leży przy końcu własnego uchwytu linki w każdym kadrze (≤ 1 cm), linka biegnie od bloczka za plecami
 * do dłoni po tej samej stronie, a na ławce (siedzący, skośna) bark i miednica leżą na oparciu (odstęp od płaszczyzny oparcia = głębokość tułowia ± 1 cm).
 * Jednorącz: tylko ręka pracująca ma linkę, wolna ręka jej nie ma. Test ma negatywy: przesunięta dłoń, brak jednej linki i tułów odsunięty od oparcia są wykrywane.
 * Nie jest strażnikiem procesu — przypadek „gałąź z wcześniejszymi zmianami” (L-080) nie dotyczy.
 */
import * as fs from 'fs';
import * as path from 'path';
import { keyframeFrame, type PoseData } from '@/lib/figures/v2';
import { GIRTH } from '@/lib/figures/v2/skeleton';

const poses = JSON.parse(fs.readFileSync(path.join(__dirname, '../lib/figures/v2/poses/cable_press.json'), 'utf8')).cwiczenia as Record<string, PoseData>;
const NAMES = ['Wyciskanie na linkach (stojąc)', 'Single Arm Cable Chest Press', 'Seated Cable Chest Press', 'Incline Cable Chest Press'];
const US = [0, 0.125, 0.25, 0.5, 0.75, 0.875, 1];
const TOL = 1; /* cm */
const dist = (a: number[], b: number[]) => Math.hypot(...a.map((x, i) => x - b[i]));
const JEDNORECZ = 'Single Arm Cable Chest Press';

/** Błędy podpory: [opis, u, strona, wartość] — pusta lista = każda dłoń pracująca przy swoim uchwycie, linka od bloczka z tyłu po tej samej stronie. */
function bladUchwytu(d: PoseData, praca: ('R' | 'L')[]): unknown[] {
  const out: unknown[] = [];
  for (const u of US) {
    const f = keyframeFrame(d, u); const cab = (f.props as any[]).filter(p => p.k === 'cable');
    for (const s of praca) {
      const g = f.sk.arms[s].grip as number[]; const own = cab.filter(c => Math.sign(c.to[2]) === Math.sign(g[2]));
      if (own.length !== 1) { out.push(['brak linki strony', u, s, own.length]); continue; }
      const e = dist(g, own[0].to); if (e > TOL) out.push(['dłoń poza uchwytem', u, s, e]);
      if (!(own[0].from[0] < own[0].to[0])) out.push(['linka nie od bloczka z tyłu', u, s, own[0].from[0]]);
      if (Math.sign(own[0].from[2]) !== Math.sign(g[2])) out.push(['bloczek po drugiej stronie', u, s, own[0].from[2]]);
    }
    if (cab.length !== praca.length) out.push(['liczba linek', u, '-', cab.length]);
  }
  return out;
}
/** Odstęp barku i miednicy od płaszczyzny oparcia ławki minus głębokość tułowia (cm); ławka z pozy: zawias + kąt. */
function bladOparcia(d: PoseData): unknown[] {
  const out: unknown[] = []; const b = (d.sprzet as any[]).find(x => x.rodzaj === 'lawka'); const a = (b.kat * Math.PI) / 180;
  const dir = [-Math.cos(a), Math.sin(a)]; /* oparcie od zawiasu w górę i do tyłu */
  for (const u of US) {
    const f = keyframeFrame(d, u);
    for (const [n, p] of [['bark', f.sk.shoulderC], ['miednica', f.sk.pelvis]] as const) {
      const rel = [p[0] - b.x, p[1] - b.top]; const e = rel[0] * dir[1] - rel[1] * dir[0]; const dev = Math.abs(Math.abs(e) - GIRTH.trunkDepth);
      if (dev > TOL) out.push([n, u, dev]);
    }
  }
  return out;
}

describe('cable_press: dłoń przy swoim uchwycie linki w każdym kadrze (10.11.2026, K4/K6/K7)', () => {
  test.each(NAMES.filter(k => k !== JEDNORECZ))('%s: obie dłonie przy końcach własnych linek (≤ 1 cm), linka od bloczka z tyłu', (k) => { expect(bladUchwytu(poses[k], ['R', 'L'])).toEqual([]); });
  test('Single Arm Cable Chest Press: ręka pracująca R przy uchwycie, jedna linka; wolna ręka L bez linki i poza uchwytem', () => {
    expect(bladUchwytu(poses[JEDNORECZ], ['R'])).toEqual([]);
    for (const u of US) { const f = keyframeFrame(poses[JEDNORECZ], u); expect((f.props as any[]).filter(p => p.k === 'cable')).toHaveLength(1); expect(dist(f.sk.arms.L.grip as number[], (f.props as any[]).find(p => p.k === 'cable').to)).toBeGreaterThan(20); }
  });
  test.each(['Seated Cable Chest Press', 'Incline Cable Chest Press'])('%s: bark i miednica na oparciu (odstęp = głębokość tułowia ± 1 cm)', (k) => { expect(bladOparcia(poses[k])).toEqual([]); });
  describe('negatywy (test wykrywa błąd)', () => {
    const kopia = (k: string) => JSON.parse(JSON.stringify(poses[k])) as PoseData;
    test('dłoń przesunięta o 5 cm od uchwytu → wykryta', () => {
      const d = kopia(NAMES[0]); for (const kf of (d as any).klatki) kf.rece.R.chwyt[0] += 5; expect(bladUchwytu(d, ['R', 'L']).length).toBeGreaterThan(0);
    });
    test('tylko jedna linka na dwie dłonie → brak linki lewej ręki', () => {
      const d = kopia(NAMES[0]); (d as any).sprzet = (d.sprzet as any[]).map(g => (g.rodzaj === 'wyciag' ? { ...g, dwa: undefined, trzyma: 'R' } : g)); expect(bladUchwytu(d, ['R', 'L']).some((e: any) => e[2] === 'L')).toBe(true);
    });
    test('oparcie ławki o 5° bardziej pochylone niż tułów → odstęp barku i miednicy poza tolerancją', () => {
      const d = kopia('Incline Cable Chest Press'); (d.sprzet as any[]).find(g => g.rodzaj === 'lawka').kat += 5; expect(bladOparcia(d).length).toBeGreaterThan(0);
    });
  });
});
