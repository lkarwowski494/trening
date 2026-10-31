/*
 * Figury v2, rodzina curl (planned) — ACG-012 (audyt ćwiczeń 31.10.2026, zadanie ACG-T-014).
 * Karty Barbell Curl, EZ Bar Curl i Hammer Curl: „Zginaj łokcie, aż przedramiona będą pionowo” (curl.bbMove, curl.hammerMove). Figury v1 mierzą to z tolerancją 20° (`why` „horiz elbow→hand eq 90 tol 20”),
 * a v2 kończyło ruch z przedramieniem ok. 40° od pionu (łokieć ok. 135°). Miara: keyframeFrame, klatka u = 1, kąt wektora łokieć → nadgarstek względem pionu (oś y); ramię (bark → łokieć) względem osi tułowia ≤ 15° (zadanie ACG-T-014).
 */
import * as fs from 'fs';
import * as path from 'path';
import { SIDES, keyframeFrame, type PoseData } from '@/lib/figures/v2';

const CW: Record<string, PoseData> = JSON.parse(fs.readFileSync(path.join(__dirname, '../lib/figures/v2/poses/curl.json'), 'utf8')).cwiczenia;
const KARTY = ['Barbell Curl', 'EZ Bar Curl', 'Hammer Curl'];
const TOL_PRZEDRAMIE = 20, TOL_RAMIE = 15;
const vec = (a: number[], b: number[]): number[] => [b[0] - a[0], b[1] - a[1], b[2] - a[2]];
/** Kąt między wektorami (stopnie). */
const miedzy = (u: number[], v: number[]): number => Math.acos((u[0] * v[0] + u[1] * v[1] + u[2] * v[2]) / (Math.hypot(...u) * Math.hypot(...v))) * 180 / Math.PI;
/** Kąt przedramienia (łokieć → nadgarstek) od pionu w górę (oś y); 180° = zwisa w dół. */
const kat = (a: number[], b: number[]): number => miedzy(vec(a, b), [0, 1, 0]);

describe('ACG-012 (31.10.2026): curl — w górze ruchu przedramię blisko pionu', () => {
  test.each(KARTY)('%s: klatka u = 1, przedramię ≤ 20° od pionu', k => {
    const sk = keyframeFrame(CW[k], 1).sk;
    for (const s of SIDES) expect(kat(sk.arms[s].elbow, sk.arms[s].wrist)).toBeLessThanOrEqual(TOL_PRZEDRAMIE);
  });
  test.each(KARTY)('%s: ramię ≤ 15° od osi tułowia w górze ruchu (łokcie przy bokach)', k => {
    const sk = keyframeFrame(CW[k], 1).sk;
    for (const s of SIDES) { expect(miedzy(vec(sk.arms[s].shoulder, sk.arms[s].elbow), vec(sk.shoulderC, sk.pelvis))).toBeLessThanOrEqual(TOL_RAMIE); }
  });
  test('ruch zaczyna się od wyprostowanego łokcia (u = 0) i kończy zgiętym (u = 1) — pełny zakres zostaje', () => {
    for (const k of KARTY) { const a = keyframeFrame(CW[k], 0).sk, b = keyframeFrame(CW[k], 1).sk; for (const s of SIDES) { expect(kat(a.arms[s].elbow, a.arms[s].wrist)).toBeGreaterThan(150); expect(b.arms[s].wrist[1]).toBeGreaterThan(a.arms[s].wrist[1] + 30); } }
  });
});
