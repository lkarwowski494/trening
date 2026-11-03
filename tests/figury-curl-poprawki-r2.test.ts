/*
 * Runda poprawek pilotażu curl po recenzji niezależnej (03.11.2026, linia 1.1): każda poprawiona wada ma test odtwarzający (przed poprawką padał).
 * W5 ramię leży na podpórce modlitewnika, W7 zgięcie łokcia ku głowie (leżenie, wyciąg górny), W3 gryf Drag Curl przy tułowiu, W6 łokcie Inner-Biceps przy bokach,
 * W4 dół ruchu: prawie pełny wyprost, W8 Zottman bez rysunku (wyjątek z powodem), N1 wolna ręka Concentration Curl na udzie.
 */
import * as fs from 'fs';
import * as path from 'path';
import { keyframeFrame, preacherPolys, type PoseData } from '@/lib/figures/v2';
import { sdPoly } from '@/lib/figures/v2/colliders';
import { stykPozy } from './helpers/styk-figur';

const CURL: Record<string, PoseData> = JSON.parse(fs.readFileSync(path.join(__dirname, '../lib/figures/v2/poses/curl.json'), 'utf8')).cwiczenia;
const WYJ = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/zrodla/figury-wyjatki.json'), 'utf8'));
type V = number[];
const sub = (a: V, b: V) => a.map((x, i) => x - b[i]); const len = (a: V) => Math.hypot(...a);
const kat = (a: V, b: V) => Math.acos(Math.max(-1, Math.min(1, (a[0] * b[0] + a[1] * b[1] + (a[2] ?? 0) * (b[2] ?? 0)) / (len(a) * len(b))))) * 180 / Math.PI;
/** Zgięcie łokcia R (0° = ręka prosta). */
const zgiecie = (k: string, u: number) => { const A = keyframeFrame(CURL[k], u).sk.arms.R; return 180 - kat(sub(A.shoulder, A.elbow), sub(A.grip, A.elbow)); };
const MODL = ['Barbell Preacher Curl', 'Preacher Curl (EZ)', 'Reverse EZ-Bar Preacher Curl', 'Preacher Curl', 'Preacher Hammer Dumbbell Curl', 'Cable Preacher Curl', 'Machine Biceps Curl', 'One Arm Dumbbell Preacher Curl'];

describe('W5: ramię leży na podpórce modlitewnika (9 ćwiczeń, 8 z rysunkiem)', () => {
  test.each(MODL)('%s: oś ramienia równoległa do powierzchni (≤ 10°), łokieć ≤ 2 cm od powierzchni ramienia, bez wnikania', k => {
    for (const u of [0, 0.5, 1]) {
      const f = keyframeFrame(CURL[k], u); const pr = f.props.find(p => p.k === 'preacher')!; if (pr.k !== 'preacher') throw new Error('brak podpórki');
      const pp = preacherPolys(pr); const A = f.sk.arms.R; const r = 4.5;
      const d = sub(pr.bottom, pr.top); const a2 = [A.elbow[0] - A.shoulder[0], A.elbow[1] - A.shoulder[1]];
      expect(Math.abs(kat(d, a2))).toBeLessThanOrEqual(10);
      const odl = sdPoly([A.elbow[0], A.elbow[1]], pp.pad) - r; expect([k, u, odl <= 2 && odl >= -0.3]).toEqual([k, u, true]);
    }
  });
});

describe('W7: Lying Close-Grip Bar Curl On High Pulley — przedramię zgina się ku głowie', () => {
  test('dłoń w u = 1 po stronie głowy względem łokcia (x mniejsze), w u = 0 przedramię wyprostowane w górę', () => {
    const A0 = keyframeFrame(CURL['Lying Close-Grip Bar Curl On High Pulley'], 0).sk.arms.R; const A1 = keyframeFrame(CURL['Lying Close-Grip Bar Curl On High Pulley'], 1).sk.arms.R;
    expect(A1.grip[0]).toBeLessThan(A1.elbow[0] - 10); expect(A0.grip[1]).toBeGreaterThan(A0.elbow[1]);
    expect(zgiecie('Lying Close-Grip Bar Curl On High Pulley', 1)).toBeGreaterThanOrEqual(100);
  });
});

describe('W3: Drag Curl — gryf prowadzony po przodzie tułowia', () => {
  test('odstęp gryfu od tułowia i nóg ≤ 3 cm i ≥ 0 we wszystkich 21 kadrach', () => {
    for (const x of stykPozy(CURL['Drag Curl'])) expect([x.u, x.odstep >= 0 && x.odstep <= 3]).toEqual([x.u, true]);
  });
  test('łokcie cofają się za linię tułowia (ramię ≥ 25° do tyłu u szczytu)', () => {
    const A = keyframeFrame(CURL['Drag Curl'], 1).sk.arms.R; expect(A.elbow[0]).toBeLessThan(A.shoulder[0] - 12);
  });
});

describe('W6: Standing Inner-Biceps Curl — łokcie przy bokach (kartą: curl.elbows)', () => {
  test.each([0, 0.5, 1])('u = %s: ramię odchylone od tułowia ≤ 8° w płaszczyźnie czołowej', u => {
    const A = keyframeFrame(CURL['Standing Inner-Biceps Curl'], u).sk.arms.R; const v = sub(A.elbow, A.shoulder);
    expect(Math.abs(Math.atan2(Math.abs(v[2]), -v[1]) * 180 / Math.PI)).toBeLessThanOrEqual(8);
  });
});

describe('W4: dół ruchu — ręka prawie wyprostowana (karty: „do pełnego wyprostu rąk”)', () => {
  test.each(['Barbell Curl', 'EZ Bar Curl', 'Reverse Curl', 'Drag Curl', 'Biceps Curl (hantle)', 'Hammer Curl', 'Standing Dumbbell Reverse Curl', 'Standing Inner-Biceps Curl', 'Cross Body Hammer Curl', 'Cable Curl', 'Reverse Cable Curl', 'Hammer Curl (linki)', 'Standing One-Arm Cable Curl', 'Cable Curl (dwie linki)'])('%s: zgięcie łokcia w u = 0 ≤ 16,5° (było 18–26°; EZ z obrotem przedramienia 25° najwięcej)', k => {
    expect(zgiecie(k, 0)).toBeLessThanOrEqual(16.5);
  });
});

describe('W8: Zottman Curl i Zottman Preacher Curl — wyjątek bez rysunku (decyzja właściciela 03.11.2026, wariant b)', () => {
  test.each(['Zottman Curl', 'Zottman Preacher Curl'])('%s: wpis wyjątku z powodem w figury-wyjatki.json i brak póz w curl.json', k => {
    expect(String(WYJ.cwiczenia[k]).length).toBeGreaterThan(40); expect(CURL[k]).toBeUndefined();
  });
});

describe('H1 (recenzja r3, 03.11.2026, WYSOKIE): chwyt młotkowy — hantel rysowany poprzecznie niezależnie od obrotu przedramienia (draw.ts:426–433)', () => {
  const HAMMER = ['Hammer Curl', 'Cross Body Hammer Curl', 'Incline Hammer Curl', 'Preacher Hammer Dumbbell Curl'];
  const rec = JSON.parse(fs.readFileSync(path.join(__dirname, '../docs/research/figury-recenzja.json'), 'utf8')).v2.curl;
  const fam = fs.readFileSync(path.join(__dirname, '../lib/figures/v2/families.ts'), 'utf8');
  const poseData = fs.readFileSync(path.join(__dirname, '../lib/figures/v2/poseData.ts'), 'utf8');
  const draw = fs.readFileSync(path.join(__dirname, '../lib/figures/v2/draw.ts'), 'utf8');
  test('wpis recenzji r3 opisuje wadę H1 i 4 ćwiczenia; autor ≠ recenzent', () => {
    expect(rec.werdykt).toBe('wyswietlana'); expect(rec.autor).not.toBe(rec.recenzent);
    for (const k of HAMMER) expect([k, rec.uwagi.includes(k)]).toEqual([k, true]);
    expect(rec.uwagi).toMatch(/H1 \(WYSOKIE\)/);
  });
  test('rodzina curl nie jest podłączona (planned, bez pliku póz w poseData), dopóki hantel nie zależy od obrotu przedramienia i 4 hammer nie przejdą ponownej recenzji', () => {
    const podlaczona = /id: 'curl', status: 'ready'/.test(fam) || /curl: \(\) => require\('\.\/poses\/curl\.json'\)/.test(poseData);
    const naprawione = /pr\.axis/.test(draw.slice(draw.indexOf("case 'dumbbell'"), draw.indexOf("case 'handle'"))); /* oś hantla z obrotu przedramienia (H1, partia wspólna) */
    expect([podlaczona, podlaczona ? naprawione : true]).toEqual([podlaczona, true]);
  });
});

describe('N1: Concentration Curl (hantle) — wolna ręka przy udzie, łokieć w dół', () => {
  test('wolna ręka L: łokieć poniżej barku o ≥ 15 cm w całym ruchu', () => {
    for (const u of [0, 0.5, 1]) { const A = keyframeFrame(CURL['Concentration Curl (hantle)'], u).sk.arms.L; expect(A.shoulder[1] - A.elbow[1]).toBeGreaterThanOrEqual(15); }
  });
});
