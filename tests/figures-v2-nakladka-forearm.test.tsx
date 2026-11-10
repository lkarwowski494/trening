/*
 * Figury v2 — nakładka techniki rodziny forearm (10.11.2026, partia 5; decyzja właściciela docs/18: „żadna rodzina nie wychodzi bez nakładki”). Rodzaje (docs/20): dane (reguły „ustalone” ze źródłem,
 * element ⇔ wskazówka karty), geometria (łuk nadgarstka = measuredAngle ±1°), niezmienniki (≤ 3 linie + 1 łuk na rzut, tylko rzut z boku), kolor błędu, wybór elementu per ćwiczenie. Wzór: tests/figures-v2-nakladka-cable-row.test.tsx.
 */
jest.mock('@/lib/figures/data.json', () => require('./figure-gate-open').openFigureGate(jest.requireActual('@/lib/figures/data.json'))); /* bramka 4 otwarta: test sprawdza rysowanie, nie recenzję rodziny */
import * as fs from 'fs';
import * as path from 'path';
import { figureSpec, frameAt, measuredAngle, measuredSide, overlayShapes, type FigureSpec, type Shape } from '@/lib/figures/v2';
import { OVERLAY_MAX_ARCS, OVERLAY_MAX_LINES, TECHNIQUE, techniqueGeom, techniquesFor } from '@/lib/figures/v2/overlay';
import { errorsOf } from '@/lib/figures/v2/ui';
import { FOREARM_TECHNIQUE } from '@/lib/figures/v2/overlay/forearm';

const spec = (k: string): FigureSpec => figureSpec(k) as FigureSpec;
const sens = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'data/zrodla/figury-sens.json'), 'utf8')).rodziny.forearm;
const W = 'forearmWristLimb', P = 'forearmElbowPlumb';
const WRIST = ['Barbell Wrist Curl', 'Barbell Reverse Wrist Curl', 'Wrist Curl (hantle)', 'Reverse Wrist Curl (hantle)', 'One-Arm Dumbbell Wrist Curl', 'One-Arm Dumbbell Reverse Wrist Curl', 'Cable Wrist Curl', 'Behind-the-Back Barbell Wrist Curl'];
const US = Array.from({ length: 21 }, (_, i) => i / 20);
const ids = (k: string, cues: string[]) => techniquesFor('forearm', cues, k).map(d => d.id);
const lines = (s: Shape[]) => s.filter(x => x.k === 'line' || (x.k === 'poly' && !String(x.id).endsWith('Arc'))).length;
const arcs = (s: Shape[]) => s.filter(x => x.k === 'poly' && String(x.id).endsWith('Arc')).length;

describe('dane: elementy forearm ← reguły „ustalone” ze źródłem', () => {
  test('rejestr: TECHNIQUE.forearm = nadgarstek (limb, wristFlex) i pion łokcia (ref), tylko rzut z boku', () => {
    expect(TECHNIQUE.forearm).toBe(FOREARM_TECHNIQUE); expect(FOREARM_TECHNIQUE.map(d => d.id)).toEqual([W, P]);
    expect(FOREARM_TECHNIQUE.map(d => [d.kind, d.joint, d.ref, d.views])).toEqual([['limb', 'wristFlex', undefined, ['side']], ['ref', undefined, { shape: 'vertical', through: 'shoulder', dir: 'down', until: 'pelvis' }, ['side']]]);
  });
  test('reguła każdego elementu istnieje i jest „ustalone”; każda wskazówka elementu należy do wskazowki_na_reguly tej reguły', () => {
    for (const d of FOREARM_TECHNIQUE) { const r = sens.reguly[d.rule]; expect(r).toBeTruthy(); expect(r.pewnosc).toMatch(/^ustalone/); for (const c of d.cue) expect([c, sens.wskazowki_na_reguly[c]]).toEqual([c, expect.arrayContaining([d.rule])]); }
    expect(FOREARM_TECHNIQUE.map(d => d.rule)).toEqual(['nadgarstek_zakres', 'lokiec_przy_tulowiu']);
  });
  test('wybór elementu per ćwiczenie: nadgarstek przy wr.range (8 uginań), pion łokcia tylko Reverse Plate Curls przy curl.elbows; obrót i izometria bez elementu', () => {
    for (const k of WRIST) { expect([k, ids(k, ['wr.range'])]).toEqual([k, [W]]); expect([k, ids(k, ['curl.elbows'])]).toEqual([k, []]); }
    expect(ids('Reverse Plate Curls', ['curl.elbows', 'curl.noSwing', 'curl.control'])).toEqual([P]); expect(ids('Reverse Plate Curls', ['wr.range'])).toEqual([]);
    for (const k of ['Dumbbell Lying Pronation', 'Dumbbell Lying Supination', 'Plate Pinch', 'Wrist Roller']) expect([k, ids(k, ['wr.range', 'wr.forearms', 'curl.elbows'])]).toEqual([k, []]);
    for (const k of WRIST) expect([k, ids(k, ['wr.forearms'])]).toEqual([k, []]); /* podparcie przedramienia: bez elementu (powód w nagłówku overlay/forearm.ts) */
  });
});

describe('geometria i niezmienniki', () => {
  test.each(WRIST)('%s: łuk nadgarstka = zgięcie w nadgarstku (measuredAngle ±1°), element tylko w rzucie z boku, w granicach limitów', k => {
    const s = spec(k); const side = measuredSide(s);
    for (const u of US) {
      const a = Math.abs(measuredAngle(s, u).deg); const g = techniqueGeom('limb', frameAt(s, u).sk, side, 'wristFlex');
      expect(g).toBeTruthy(); expect(Math.abs((g as { sweepDeg: number }).sweepDeg - a)).toBeLessThan(1);
      const sh = overlayShapes(s, u, 'side', [W]); expect(lines(sh)).toBeLessThanOrEqual(OVERLAY_MAX_LINES); expect(arcs(sh)).toBeLessThanOrEqual(OVERLAY_MAX_ARCS);
      if (a >= 3) expect(arcs(sh)).toBe(1); expect(JSON.stringify(sh)).not.toMatch(/"text"/);
    }
    expect(s.views.filter(v => v !== 'side').every(v => US.every(u => overlayShapes(s, u, v, [W]).length === 0))).toBe(true);
  });
  test('Reverse Plate Curls: pion od barku rysuje się w rzucie z boku w każdej klatce; nakładka nadgarstka nie rysuje się (mierzony staw: łokieć)', () => {
    const s = spec('Reverse Plate Curls'); for (const u of US) { expect(overlayShapes(s, u, 'side', [P]).length).toBeGreaterThan(0); expect(overlayShapes(s, u, 'side', [W])).toEqual([]); }
  });
  test('kolor błędu: odwrotne uginanie z talerzem z błędem curl.mis.elbows koloruje pion łokcia (grupa lokcie) jako error', () => {
    const s = spec('Reverse Plate Curls'); const err = errorsOf(s, ['curl.mis.elbows'])[0]?.error;
    expect(err).toBeTruthy();
    expect(JSON.stringify(overlayShapes(s, 1, 'side', [P]))).not.toMatch(/error/); expect(JSON.stringify(overlayShapes(s, 1, 'side', [P], err))).toMatch(/error/);
  });
});
