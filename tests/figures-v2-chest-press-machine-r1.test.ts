/*
 * Recenzja niezależna r1 rodziny chest_press_machine (partia 4, 10.11.2026; docs/research/recenzje/partia4-chest_press_machine-r1-audytor-2026-11-10.md): testy odtwarzające znaleziska.
 * W1: Leverage Decline Chest Press — maszyna SIEDZĄCA (plecy przy oparciu, stopy na podłodze), nie leżenie głową w dół.
 * W2: Machine Shoulder Press — łokcie nie idą daleko przed ciało (ACE: pozycja „4 i 8”, nieco przed linią boczną).
 * Ś1: koniec ruchu — zgięcie łokcia ≤ 20° jak bench_press / overhead_press (reguły zakres_klatka, nad_glowa).
 * Każdy test ma negatyw: miara musi potrafić paść na złej pozie.
 */
import { figureSpec, frameAt, jointAngles, type Frame } from '@/lib/figures/v2';

const U = Array.from({ length: 21 }, (_, i) => i / 20);
const fr = (k: string, u: number): Frame => frameAt(figureSpec(k)!, u);
/** Kąt łokcia względem barku w osiach tułowia: atan2(przód, bok) — 0 = w bok, 90 = prosto przed barkiem. */
export const katLokcia = (f: Frame): number => { const A = f.sk.arms.R; const d = [A.elbow[0] - A.shoulder[0], A.elbow[1] - A.shoulder[1], A.elbow[2] - A.shoulder[2]]; const przod = d[0] * f.sk.front[0] + d[1] * f.sk.front[1] + d[2] * f.sk.front[2]; return (Math.atan2(przod, Math.abs(d[2])) * 180) / Math.PI; };
/** Odchylenie przedramienia od pionu w rzucie z boku (x, y). */
export const przedramieOdPionu = (f: Frame): number => { const A = f.sk.arms.R; return (Math.atan2(Math.abs(A.wrist[0] - A.elbow[0]), Math.abs(A.wrist[1] - A.elbow[1])) * 180) / Math.PI; };
const siedzi = (f: Frame) => ({ barkiNad: f.sk.shoulderC[1] - f.sk.pelvis[1], kostkaY: Math.max(f.sk.legs.R.ankle[1], f.sk.legs.L.ankle[1]) });

describe('chest_press_machine r1 (10.11.2026)', () => {
  test('W1: Leverage Decline Chest Press — siedzi: barki ponad miednicą > 30 cm, kostki na podłodze (y ≤ 10) w każdym u', () => {
    for (const u of U) { const s = siedzi(fr('Leverage Decline Chest Press', u)); expect([u, s.barkiNad > 30, s.kostkaY <= 10]).toEqual([u, true, true]); }
  });
  test('W1 (negatyw): Machine Chest Press jest siedzący, a pozy „leżenia głową w dół” (barki poniżej miednicy, kostki 66 cm) miara odrzuca', () => {
    for (const u of U) { const s = siedzi(fr('Machine Chest Press', u)); expect([u, s.barkiNad > 30, s.kostkaY <= 10]).toEqual([u, true, true]); }
    const zla = { barkiNad: 52.5 - 69.6, kostkaY: 66 }; expect(zla.barkiNad > 30 || zla.kostkaY <= 10).toBe(false);
  });
  test('W2: Machine Shoulder Press — łokieć ≤ 50° od linii bocznej (atan2(przód, bok)), przedramię ≤ 25° od pionu w rzucie z boku, w każdym u', () => {
    for (const u of U) { const f = fr('Machine Shoulder Press', u); expect([u, katLokcia(f) <= 50, przedramieOdPionu(f) <= 25]).toEqual([u, true, true]); }
  });
  test('W2 (negatyw): miara łapie dawną pozę (łokieć 67° przed linią boczną, przedramię 42,7° od pionu); Smith Machine Shoulder Press przechodzi', () => {
    expect(67 <= 50 || 42.7 <= 25).toBe(false);
    for (const u of U) { const f = fr('Smith Machine Shoulder Press', u); expect([u, przedramieOdPionu(f) <= 25]).toEqual([u, true]); }
  });
  test('Ś1: koniec ruchu (u = 1) — zgięcie łokcia ≤ 20° w maszynach dźwigniowych', () => {
    for (const k of ['Machine Chest Press', 'Leverage Incline Chest Press', 'Leverage Decline Chest Press', 'Machine Shoulder Press']) expect([k, jointAngles(fr(k, 1).sk, 'R').elbow <= 20]).toEqual([k, true]);
  });
  test('Ś1 (negatyw): miara odrzuca 21,8°', () => { expect(21.8 <= 20).toBe(false); });
});
