/*
 * (10.11.2026, partia 4 linii 1.1) Rodzina back_extension (Back Extension, Reverse Hyperextension, Lower Back Curl) po włączeniu:
 *  - podpory (K7): miednica i uda na podpórce ławki ≤ 1 cm, wnikanie ≤ 1 cm w kadrach co 0,05, łydki/stopy pod wałkami (rzymska), miednica na podłodze (Lower Back Curl); negatywy: dane sprzed poprawki (offN 11,5; dolDeg −42; miednica reverse hyper [19; 9,8]) są wykrywane;
 *  - zakresy z reguł rodziny (figury-sens.json: zgiecie_w_biodrach ≥ 70°, wyprost_na_gorze ≤ 15°, barki_w_gore ≥ 5 cm, miednica_podpora ≤ 3 cm) — progi z danych reguł, nie z bieżących póz (K5);
 *  - prezentacja: fazy i staw (biodro), kierunek u (Back Extension: u 0 → 1 = opuszczanie);
 *  - nakładka: jeden element (bextHipLimb) tylko przy własnej karcie Back Extension; łuk = kąt biodra ±1°; Weighted Ball Hyperextension bez rysunku (wyjątek generatora).
 * Nie jest strażnikiem procesu — przypadek „gałąź z wcześniejszymi zmianami” (L-080) nie dotyczy.
 */
jest.mock('@/lib/figures/data.json', () => require('./figure-gate-open').openFigureGate(jest.requireActual('@/lib/figures/data.json'))); /* bramka 4 otwarta: ten test sprawdza rysowanie, nie recenzję rodziny */
import * as fs from 'fs';
import * as path from 'path';
import { figureSpec, frameAt, keyframeFrame, measuredJoint, measuredAngle, measuredSide, phasesFor, overlayShapes, DATA_UI, poseKeys, type PoseData } from '@/lib/figures/v2';
import { bodyColliders, equipColliders, gap } from '@/lib/figures/v2/colliders';
import { techniquesFor, techniqueGeom, TECHNIQUE } from '@/lib/figures/v2/overlay';
import { BACK_EXTENSION_TECHNIQUE } from '@/lib/figures/v2/overlay/back_extension';
import { techniquesOf, cueIdsOf } from '@/lib/figures/v2/ui';
import { jointAngles } from '@/lib/figures/v2/skeleton';

const ROOT = path.join(__dirname, '..');
const poses = JSON.parse(fs.readFileSync(path.join(ROOT, 'lib/figures/v2/poses/back_extension.json'), 'utf8')).cwiczenia as Record<string, PoseData>;
const reguly = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/zrodla/figury-sens.json'), 'utf8')).rodziny.back_extension.reguly;
const US = Array.from({ length: 21 }, (_, i) => +(i / 20).toFixed(2));
const TOL = 1; /* cm — K7 */

/** Odstępy powierzchni (cm; ujemne = wnikanie) części ciała od elementu sprzętu, minimum po stronach R/L. */
function odstepy(d: PoseData, u: number): Record<string, number> {
  const f = keyframeFrame(d, u); const ec = equipColliders(f.props); const out: Record<string, number> = {};
  for (const b of bodyColliders(f.sk)) for (const e of ec) { const k = b.id.replace(/[RL]$/, '') + '>' + e.id; out[k] = Math.min(out[k] ?? Infinity, gap(b, e)); }
  return out;
}
/** Błędy podpory ławki: [co, u, wartość]; pusta lista = biodra i uda na podpórce (≤ 1 cm), wnikanie ≤ 1 cm. */
function bladPodpory(d: PoseData, opts: { lezaca?: boolean } = {}): unknown[] {
  const out: unknown[] = [];
  for (const u of US) {
    const g = odstepy(d, u);
    for (const k of ['pelvis>hyperPad', 'torso>hyperPad', 'thigh>hyperPad']) { if (g[k] === undefined) continue; if (g[k] < -TOL) out.push([k, u, g[k]]); }
    if (g['pelvis>hyperPad'] === undefined || g['pelvis>hyperPad'] > TOL) out.push(['miednica nie na podpórce', u, g['pelvis>hyperPad']]);
    if (!opts.lezaca && g['thigh>hyperPad'] !== undefined && u === 0 && g['thigh>hyperPad'] > TOL) out.push(['udo nie na podpórce', u, g['thigh>hyperPad']]); /* uda leżą na podpórce tylko w pozycji z nogami w dół (reverse hyper: u 0) albo przez cały ruch (rzymska) */
  }
  return out;
}
const bladWalkow = (d: PoseData): unknown[] => US.flatMap(u => { const g = odstepy(d, u); const m = Math.min(g['shank>hyperRoller'] ?? Infinity, g['foot>hyperRoller'] ?? Infinity); return m > TOL || m < -TOL ? [['wałek', u, m]] : []; });
const klon = (k: string): PoseData => JSON.parse(JSON.stringify(poses[k]));

describe('back_extension: podpory ławki (K7)', () => {
  test('Back Extension: miednica, tułów i uda na podpórce (≤ 1 cm w obie strony), uda przez cały ruch; łydki/stopy pod wałkami (≤ 1 cm)', () => {
    expect(bladPodpory(poses['Back Extension'])).toEqual([]); expect(bladWalkow(poses['Back Extension'])).toEqual([]);
    for (const u of US) expect([u, odstepy(poses['Back Extension'], u)['thigh>hyperPad'] <= TOL]).toEqual([u, true]);
  });
  test('Reverse Hyperextension: miednica na podpórce ≤ 1 cm, wnikanie uda i tułowia ≤ 1 cm w kadrach co 0,05', () => { expect(bladPodpory(poses['Reverse Hyperextension'])).toEqual([]); });
  test('Reverse Hyperextension: nogi wolne — brak wałków w sprzęcie i brak styku goleni ze sprzętem', () => {
    expect((poses['Reverse Hyperextension'].sprzet as { rodzaj: string; walki?: boolean }[]).find(s => s.rodzaj === 'rzymska')!.walki).toBe(false);
    for (const u of US) { const g = odstepy(poses['Reverse Hyperextension'], u); expect([u, g['shank>hyperRoller']]).toEqual([u, undefined]); }
  });
  test('Lower Back Curl: miednica na podłodze (środek miednicy na wysokości jej promienia ± 1 cm), nie unosi się w żadnym kadrze', () => {
    for (const u of US) { const f = keyframeFrame(poses['Lower Back Curl'], u); expect([u, Math.abs(f.sk.pelvis[1] - 9.5) <= TOL]).toEqual([u, true]); }
  });
  describe('negatywy (test wykrywa błąd)', () => {
    test('Back Extension sprzed poprawki: miednica 4,5 cm nad podpórką (offN 11,5) → wykryte', () => {
      const d = klon('Back Extension'); for (const kf of (d as any).klatki) { kf.miednica[0] -= 0; } /* przesunięcie miednicy wzdłuż normalnej podpórki (kat 45°): +4,6 cm */
      for (const kf of (d as any).klatki) { kf.miednica[0] += 4.6 * Math.sin(Math.PI / 4); kf.miednica[1] += 4.6 * Math.cos(Math.PI / 4); }
      expect(bladPodpory(d).length).toBeGreaterThan(0);
    });
    test('Reverse Hyperextension: miednica przesunięta w głąb podpórki o 2 cm → wnikanie wykryte', () => {
      const d = klon('Reverse Hyperextension'); for (const kf of (d as any).klatki) { kf.miednica[1] -= 2; }
      expect(bladPodpory(d).length).toBeGreaterThan(0);
    });
    test('Back Extension: stopy przesunięte o 5 cm od wałków → wykryte', () => {
      const d = klon('Back Extension'); for (const kf of (d as any).klatki) for (const n of ['R', 'L']) { kf.nogi[n].kostka[0] += 5; }
      expect(bladWalkow(d).length).toBeGreaterThan(0);
    });
    test('Lower Back Curl: miednica 4 cm nad podłogą → wykryte', () => {
      const d = klon('Lower Back Curl'); for (const kf of (d as any).klatki) kf.miednica[1] += 4;
      expect(US.some(u => Math.abs(keyframeFrame(d, u).sk.pelvis[1] - 9.5) > TOL)).toBe(true);
    });
  });
});

describe('back_extension: zakresy z reguł rodziny (K5: progi z danych reguł)', () => {
  const hip = (k: string, u: number): number => measuredAngle(figureSpec(k)!, u).deg;
  test('Back Extension: biodro na dole ≥ min_biodro_deg (zgiecie_w_biodrach), na górze ≤ max_biodro_deg (wyprost_na_gorze); kolano ≤ 20° (potrójny wyprost)', () => {
    const s = figureSpec('Back Extension')!; expect(hip('Back Extension', 1)).toBeGreaterThanOrEqual(reguly.zgiecie_w_biodrach.parametry.min_biodro_deg);
    expect(hip('Back Extension', 0)).toBeLessThanOrEqual(reguly.wyprost_na_gorze.parametry.max_biodro_deg);
    for (const u of US) expect([u, jointAngles(frameAt(s, u).sk, 'R').knee <= reguly.wyprost_na_gorze.parametry.max_kolano_deg]).toEqual([u, true]);
  });
  test('Reverse Hyperextension: biodro ≥ 70° z nogami w dół (u 0), ≤ 15° z nogami w linii z tułowiem (u 1)', () => {
    expect(hip('Reverse Hyperextension', 0)).toBeGreaterThanOrEqual(reguly.zgiecie_w_biodrach.parametry.min_biodro_deg); expect(hip('Reverse Hyperextension', 1)).toBeLessThanOrEqual(reguly.wyprost_na_gorze.parametry.max_biodro_deg);
  });
  test('Lower Back Curl: barki ≥ 5 cm wyżej na szczycie niż na początku, miednica nieruchoma (≤ 3 cm)', () => {
    const y = (u: number) => keyframeFrame(poses['Lower Back Curl'], u).sk.shoulderC[1]; const p = (u: number) => keyframeFrame(poses['Lower Back Curl'], u).sk.pelvis[1];
    expect(y(1) - y(0)).toBeGreaterThanOrEqual(reguly.barki_w_gore.parametry.min_cm);
    for (const u of US) expect([u, Math.abs(p(u) - p(0)) <= reguly.miednica_podpora.parametry.max_cm]).toEqual([u, true]);
  });
});

describe('back_extension: prezentacja (fazy, staw)', () => {
  test('3 ćwiczenia z rysunkiem (Weighted Ball Hyperextension — wyjątek generatora, bez rysunku); staw mierzony = biodro', () => {
    expect(poseKeys('back_extension').sort()).toEqual(['Back Extension', 'Lower Back Curl', 'Reverse Hyperextension']); expect(figureSpec('Weighted Ball Hyperextension')).toBeNull();
    for (const k of poseKeys('back_extension')) expect([k, measuredJoint(figureSpec(k)!)]).toEqual([k, 'hip']);
  });
  test('fazy: Back Extension u 0 → 1 = Opuszczanie 2 s (wyjątek lowerFirst), potem Unoszenie 1 s; Reverse Hyperextension i Lower Back Curl: Unoszenie 1 s, Opuszczanie 2 s', () => {
    const f = (k: string) => phasesFor(figureSpec(k)!).map(p => [p.name, p.ms]);
    expect(f('Back Extension')).toEqual([['Opuszczanie', 2000], ['Pauza', 500], ['Unoszenie', 1000], ['Pauza', 500]]);
    for (const k of ['Reverse Hyperextension', 'Lower Back Curl']) expect([k, f(k)]).toEqual([k, [['Unoszenie', 1000], ['Pauza', 500], ['Opuszczanie', 2000], ['Pauza', 500]]]);
    expect(DATA_UI.back_extension.exceptions).toEqual({ 'Back Extension': { names: { first: 'Opuszczanie', second: 'Unoszenie' }, lowerFirst: true } });
  });
  test('kierunek u zgodny z fazą: Back Extension u 0 = góra (biodro mniejsze), reverse hyper u 0 = nogi w dół (biodro większe)', () => {
    expect(measuredAngle(figureSpec('Back Extension')!, 0).deg).toBeLessThan(measuredAngle(figureSpec('Back Extension')!, 1).deg);
    expect(measuredAngle(figureSpec('Reverse Hyperextension')!, 0).deg).toBeGreaterThan(measuredAngle(figureSpec('Reverse Hyperextension')!, 1).deg);
  });
});

describe('back_extension: nakładka techniki', () => {
  test('element bextHipLimb (limb, biodro, zgiecie_w_biodrach) tylko przy własnej karcie Back Extension (bext.move); Reverse Hyperextension, Lower Back Curl bez elementu (zestawy ogólne bez bext.move, reguły „analogia”)', () => {
    expect(TECHNIQUE.back_extension).toBe(BACK_EXTENSION_TECHNIQUE); expect(BACK_EXTENSION_TECHNIQUE.map(d => [d.id, d.kind, d.joint, d.rule, d.cue])).toEqual([['bextHipLimb', 'limb', 'hip', 'zgiecie_w_biodrach', ['bext.move']]]);
    expect(techniquesOf('Back Extension')).toEqual(['bextHipLimb']); expect(techniquesOf('Reverse Hyperextension')).toEqual([]); expect(techniquesOf('Lower Back Curl')).toEqual([]);
    for (const d of BACK_EXTENSION_TECHNIQUE) expect([d.id, d.views]).toEqual([d.id, ['side']]); /* element tylko w rzucie z boku (rodzina ma jeden widok) */
    expect(reguly.zgiecie_w_biodrach.pewnosc).toBe('ustalone'); expect(cueIdsOf('Back Extension').ids).toContain('bext.move');
  });
  test('element tylko przy wskazówce: bez bext.move brak (techniquesFor), z bext.move jest', () => {
    expect(techniquesFor('back_extension', ['hinge.back'], 'Back Extension')).toEqual([]); expect(techniquesFor('back_extension', ['bext.move'], 'Back Extension').map(d => d.id)).toEqual(['bextHipLimb']);
  });
  test('geometria: łuk biodra = mierzony kąt ±1° w każdym kadrze (Back Extension), 1 linia + łuk na rzut z boku, brak elementu w innych widokach', () => {
    const s = figureSpec('Back Extension')!;
    for (const u of US) { const m = measuredAngle(s, u); const g = techniqueGeom('limb', frameAt(s, u).sk, measuredSide(s), 'hip')!; expect([u, Math.abs(g.sweepDeg - m.deg) <= 1]).toEqual([u, true]); const sh = overlayShapes(s, u, 'side', ['bextHipLimb']); expect([u, sh.filter(x => x.k === 'line').length]).toEqual([u, 1]); expect(overlayShapes(s, u, 'front', ['bextHipLimb'])).toEqual([]); }
  });
});
