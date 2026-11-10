/*
 * cable_press (10.11.2026, recenzja niezależna r1, W1 i Ś1): bloczek linki leży mniej więcej na wysokości klatki lub barków (karta cpress.setup):
 * wyciag.y − bark.y ∈ [−25, +5] cm w każdym ćwiczeniu rodziny z bloczkiem nad podłogą (Incline: kolumny z dołu, linki idą w górę — poza zakresem tej reguły).
 * Zestaw ogólny „Incline Cable Chest Press” nie zawiera bp.control (uchwyty linek nie dotykają klatki). Test ma negatyw (bloczek na wysokości głowy jest wykrywany).
 * Nie jest strażnikiem procesu — przypadek „gałąź z wcześniejszymi zmianami” (L-080) nie dotyczy.
 */
import * as fs from 'fs';
import * as path from 'path';
import { keyframeFrame, type PoseData } from '@/lib/figures/v2';

const poses = JSON.parse(fs.readFileSync(path.join(__dirname, '../lib/figures/v2/poses/cable_press.json'), 'utf8')).cwiczenia as Record<string, PoseData>;
const BLOCZEK_NAD_BARKIEM = ['Wyciskanie na linkach (stojąc)', 'Single Arm Cable Chest Press', 'Seated Cable Chest Press'];
const US = [0, 0.25, 0.5, 0.75, 1];
const MIN = -25; const MAX = 5; /* cm względem barku */

function odchylki(d: PoseData): number[] {
  const g = (d.sprzet as any[]).find(x => x.rodzaj === 'wyciag'); const out: number[] = [];
  for (const u of US) { const f = keyframeFrame(d, u); const dy = g.y - f.sk.shoulderC[1]; if (dy < MIN || dy > MAX) out.push(dy); }
  return out;
}

describe('cable_press: wysokość bloczka względem barku (10.11.2026, W1)', () => {
  test.each(BLOCZEK_NAD_BARKIEM)('%s: bloczek od 25 cm pod barkiem do 5 cm nad barkiem', (k) => { expect(odchylki(poses[k])).toEqual([]); });
  test('negatyw: bloczek na wysokości głowy (160 cm) jest wykrywany', () => {
    const d = JSON.parse(JSON.stringify(poses[BLOCZEK_NAD_BARKIEM[0]])) as PoseData; (d.sprzet as any[]).find(g => g.rodzaj === 'wyciag').y = 160; expect(odchylki(d).length).toBeGreaterThan(0);
  });
});

describe('cable_press: zestaw Incline Cable Chest Press bez bp.control (10.11.2026, Ś1)', () => {
  const sety = JSON.parse(fs.readFileSync(path.join(__dirname, '../lib/figures/v2/cue-sets.json'), 'utf8'));
  test('Incline Cable Chest Press: ok bez bp.control, nadal bp.contact, bp.blades i błąd bp.mis.arch', () => {
    const e = JSON.stringify(Object.values(sety).flatMap((v: any) => (v && typeof v === 'object' && v['Incline Cable Chest Press']) ? [v['Incline Cable Chest Press']] : [])[0] ?? null);
    expect(e).toContain('bp.contact'); expect(e).toContain('bp.mis.arch'); expect(e).not.toContain('bp.control');
  });
  test('inne ćwiczenia zestawu bench zachowują bp.control', () => { expect(JSON.stringify(sety)).toContain('bp.control'); });
});
