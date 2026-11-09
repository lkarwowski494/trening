/*
 * RDL (sztanga) i RDL (hantle/linki): gryf/hantle na dole tuż pod kolanem (decyzja właściciela 09.11.2026, opcja A; docs/research/28, sekcja RDL; badanie glebokosc-rdl 09.11.2026).
 * Było: ciężar na dole 55 cm, czyli ok. 7 cm NAD środkiem stawu kolanowego (48 cm) — płycej niż przedział źródeł (okolica kolana – połowa piszczeli; praktyka, szczebel 4).
 * Punkt „tuż pod kolanem” to konwencja rysunku (uproszczenie ilustracyjne). Pozostałe warianty zawiasu na prostych nogach zostają bez zmian (jawnie przypięte niżej).
 */
import { figureSpec, frameAt, jointAngles, VARIANTS, type Frame } from '@/lib/figures/v2';

const TWO = ['RDL (sztanga)', 'RDL (hantle/linki)'];
const fr = (k: string, u: number): Frame => frameAt(figureSpec(k)!, u);
const U = Array.from({ length: 21 }, (_, i) => i / 20);

describe('RDL: ciężar na dole tuż pod kolanem (09.11.2026; było 55 cm = 7 cm nad kolanem)', () => {
  test.each(TWO)('%s: na dole ciężar niżej niż środek stawu kolanowego i nie niżej niż połowa piszczeli', (k) => {
    const f = fr(k, 1); const L = f.sk.legs.R; const load = f.info.load[1]; const mid = (L.knee[1] + L.ankle[1]) / 2;
    expect([k, load < L.knee[1], load >= mid, +load.toFixed(1), +L.knee[1].toFixed(1)]).toEqual([k, true, true, +load.toFixed(1), +L.knee[1].toFixed(1)]);
  });
  test.each(TWO)('%s: tuż pod kolanem — 2–8 cm poniżej środka stawu (konwencja rysunku)', (k) => {
    const f = fr(k, 1); const d = f.sk.legs.R.knee[1] - f.info.load[1]; expect([k, d >= 2 && d <= 8, +d.toFixed(1)]).toEqual([k, true, +d.toFixed(1)]);
  });
  test.each(TWO)('%s: nadal kolano ≤ 27°, tułów ≤ 80° od pionu (50–80°), gryf ≤ 15 cm przed środkiem stopy, błąd „kolana jak w przysiadzie” ≥ 25° więcej', (k) => {
    for (const u of U) { expect([k, u, jointAngles(fr(k, u).sk, 'R').knee <= 27]).toEqual([k, u, true]); expect([k, u, fr(k, u).info.load[0] - 6.5 <= 15]).toEqual([k, u, true]); }
    const t = fr(k, 1).pose!.trunkPitch; expect([k, t >= 50 && t <= 80, +t.toFixed(0)]).toEqual([k, true, +t.toFixed(0)]);
    const e = frameAt(figureSpec(k)!, 1, 'kneesBent'); expect(jointAngles(e.sk, 'R').knee - jointAngles(fr(k, 1).sk, 'R').knee).toBeGreaterThanOrEqual(25);
  });
  test('RDL (sztanga): ramiona ok. 17° od pionu na dole zostają (decyzja właściciela 29.10.2026, ±3°)', () => {
    const a = fr('RDL (sztanga)', 1).sk.arms.R; const tilt = Math.atan2(a.shoulder[0] - a.grip[0], a.shoulder[1] - a.grip[1]) * 180 / Math.PI;
    expect([Math.abs(tilt - 17) <= 3, +tilt.toFixed(1)]).toEqual([true, +tilt.toFixed(1)]);
  });
  test('pozostałe warianty zawiasu na prostych nogach zostają jak były (jawnie: wysokość ciężaru na dole, cm)', () => {
    const was: Record<string, number> = { 'Single Leg RDL (hantel)': 55, 'Single Leg RDL (linki)': 55, 'Cable Pull Through': 55, 'Single Arm RDL (hantel/linka)': 55, 'Smith Machine Stiff-Legged Deadlift': 48, 'Stiff-Legged Barbell Deadlift': 48 };
    for (const [k, y] of Object.entries(was)) { expect(VARIANTS[k]).toBeDefined(); expect([k, +fr(k, 1).info.load[1].toFixed(1)]).toEqual([k, y]); }
  });
});
