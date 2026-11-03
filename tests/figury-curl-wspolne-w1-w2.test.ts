/*
 * Poprawki wspólne po recenzji curl (03.11.2026, W1 i W2; pliki lib/figures/v2/contract.ts i draw.ts — zmieniają skróty rodzin v2, dlatego w osobnym commicie):
 * H1 (WYSOKIE, recenzja r3): oś hantla z obrotu przedramienia (contract.ts withDumbbellAxis, draw.ts) — chwyt młotkowy nie jest rysowany jak podchwyt.
 * W1 ślad toru ćwiczeń z ciężarem w dłoni (hantel, wyciąg, dźwignia, bez sztangi) = chwyt, nie miednica; W2 talerze gryfu krótszego niż 220 cm leżą na jego końcach.
 */
import * as fs from 'fs';
import * as path from 'path';
import { keyframeFrame, plateZs, EQUIP, type PoseData } from '@/lib/figures/v2';
import { propShapes } from '@/lib/figures/v2/draw';
import type { Prop } from '@/lib/figures/v2/scene';

const CURL: Record<string, PoseData> = JSON.parse(fs.readFileSync(path.join(__dirname, '../lib/figures/v2/poses/curl.json'), 'utf8')).cwiczenia;
const dist = (a: number[], b: number[]) => Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);

describe('W1: ślad toru ciężaru w dłoni = chwyt', () => {
  test('hantle obiema rękami: ślad w środku między chwytami, nie w miednicy (Hammer Curl, u = 0 i 0,5)', () => {
    for (const u of [0, 0.5]) { const f = keyframeFrame(CURL['Hammer Curl'], u); const g = [0, 1, 2].map(i => (f.sk.arms.R.grip[i] + f.sk.arms.L.grip[i]) / 2);
      expect([u, dist(f.info.trail!, g) < 1e-6, dist(f.info.trail!, f.sk.pelvis) > 5]).toEqual([u, true, true]); }
  });
  test('jedna ręka z hantlem: ślad = chwyt ręki trzymającej (Cross Body Hammer Curl)', () => {
    const f = keyframeFrame(CURL['Cross Body Hammer Curl'], 0.5); expect(dist(f.info.trail!, f.sk.arms.R.grip)).toBeLessThan(1e-6);
  });
  test('wyciąg i dźwignia maszyny: ślad = chwyt (Cable Curl, Machine Biceps Curl)', () => {
    for (const k of ['Cable Curl', 'Machine Biceps Curl']) { const f = keyframeFrame(CURL[k], 0.5); const g = [0, 1, 2].map(i => (f.sk.arms.R.grip[i] + f.sk.arms.L.grip[i]) / 2); expect([k, dist(f.info.trail!, g) < 1e-6 || dist(f.info.trail!, f.sk.arms.R.grip) < 1e-6]).toEqual([k, true]); }
  });
  test('sztanga: zasada bez zmian (EZ Bar Curl: tor z gryfu, bez śladu nadpisanego chwytem)', () => {
    const f = keyframeFrame(CURL['EZ Bar Curl'], 0.5); expect(f.info.load).toBeDefined(); expect(f.info.trail).toBeUndefined(); /* tor ze sztangi (info.load) jak dotąd, bez śladu miednicy */
  });
});

describe('W2: talerze gryfu łamanego (dlugosc 120) na końcach gryfu', () => {
  test('plateZs: pełny gryf 220 i brak długości bez zmian (EQUIP.plateZ)', () => { expect(plateZs()).toEqual(EQUIP.plateZ); expect(plateZs(220)).toEqual(EQUIP.plateZ); expect(plateZs(250)).toEqual(EQUIP.plateZ); });
  test('plateZs(120): oba talerze wewnątrz gryfu (|z| < 60 − promień połowy grubości), zewnętrzny 7 cm od końca', () => {
    const z = plateZs(120); expect(z[0]).toBeLessThan(z[1]); expect(z[1]).toBeLessThan(60 - EQUIP.plateW / 2); expect(60 - z[1]).toBe(7);
  });
});

const HAMMER = ['Hammer Curl', 'Cross Body Hammer Curl', 'Incline Hammer Curl', 'Preacher Hammer Dumbbell Curl'];
const hantle = (k: string, u: number) => keyframeFrame(CURL[k], u).props.filter((p): p is Extract<Prop, { k: 'dumbbell' }> => p.k === 'dumbbell');
const szer = (sh: { k: string; pts?: number[][]; c?: number[]; r?: number; a?: number[]; b?: number[] }[], id: string) => {
  const x = sh.filter(q => [id, id + 'B'].includes((q as { id?: string }).id ?? '')).flatMap(q => q.pts ? q.pts.map(p => p[0]) : q.c ? [q.c[0] - (q.r ?? 0), q.c[0] + (q.r ?? 0)] : [q.a![0], q.b![0]]);
  return x.length ? Math.max(...x) - Math.min(...x) : 0;
};
describe('H1: orientacja hantla z obrotu przedramienia (chwyt neutralny)', () => {
  test.each(HAMMER)('%s: obrotPrzedramienia 0 → oś hantla prostopadła do przedramienia w płaszczyźnie strzałkowej (nie w poprzek ciała) w całym ruchu', k => {
    for (const u of [0, 0.25, 0.5, 0.75, 1]) { const f = keyframeFrame(CURL[k], u); const ds = f.props.filter(p => p.k === 'dumbbell');
      expect([k, ds.length > 0]).toEqual([k, true]);
      for (const d of ds) { if (d.k !== 'dumbbell') continue; const A = f.sk.arms[d.side]; const ax = d.axis!; expect([k, u, !!ax]).toEqual([k, u, true]);
        expect([k, u, Math.abs(ax[2]) < 0.2]).toEqual([k, u, true]);
        const fo = [A.wrist[0] - A.elbow[0], A.wrist[1] - A.elbow[1], A.wrist[2] - A.elbow[2]]; const fl = Math.hypot(fo[0], fo[1], fo[2]);
        expect([k, u, Math.abs(ax[0] * fo[0] + ax[1] * fo[1] + ax[2] * fo[2]) / fl < 0.15]).toEqual([k, u, true]); } }
  });
  test('Hammer Curl: u = 0 (zwis) oś przód–tył: z boku poprzeczka z dwiema główkami, z przodu jedno koło; w połowie ruchu (przedramię poziomo) hantel stoi pionowo', () => {
    const f0 = keyframeFrame(CURL['Hammer Curl'], 0); const d0 = hantle('Hammer Curl', 0)[0];
    expect(Math.abs(d0.axis![0])).toBeGreaterThan(0.95);
    const side = propShapes(f0.props, 'side'), front = propShapes(f0.props, 'front');
    expect(szer(side as never, 'dbR')).toBeGreaterThan(E_DB.handle); expect(side.some(q => q.k === 'poly' && (q as { id?: string }).id === 'dbRB')).toBe(true);
    expect(szer(front as never, 'dbR')).toBeLessThanOrEqual(2 * EQUIP.dbHeadR + 1e-6); /* z przodu hantel widać wzdłuż osi: bez poprzeczki w poprzek ciała (szerokość = średnica główki); przedramię lekko przed ciałem pochyla oś, więc główki są przesunięte w pionie, nie w poziomie */
    const dm = hantle('Hammer Curl', 0.5)[0]; expect(Math.abs(dm.axis![1])).toBeGreaterThan(0.7);
  });
  test('Biceps Curl (hantle) (podchwyt u szczytu, obrót 70°): oś prawie w poprzek ciała; w u = 0 (obrót 0) — chwyt neutralny; Standing Dumbbell Reverse Curl (nachwyt −70°) — oś prawie w poprzek', () => {
    expect(Math.abs(hantle('Biceps Curl (hantle)', 1)[0].axis![2])).toBeGreaterThan(0.9); expect(Math.abs(hantle('Biceps Curl (hantle)', 0)[0].axis![0])).toBeGreaterThan(0.95);
    expect(Math.abs(hantle('Standing Dumbbell Reverse Curl', 0.5)[0].axis![2])).toBeGreaterThan(0.85);
    const front = propShapes(keyframeFrame(CURL['Biceps Curl (hantle)'], 1).props, 'front'); expect(szer(front as never, 'dbR')).toBeGreaterThan(EQUIP.dbHandle);
  });
  test('hantel bez jawnego obrotPrzedramienia albo |obrót| ≥ 80° — bez osi (rysunek jak dotąd)', () => {
    const d = JSON.parse(JSON.stringify(CURL['Hammer Curl'])) as PoseData; for (const k of d.klatki) for (const sd of ['R', 'L'] as const) if (k.rece?.[sd]) delete (k.rece[sd] as { obrotPrzedramienia?: number }).obrotPrzedramienia;
    for (const p of keyframeFrame(d, 0.5).props) if (p.k === 'dumbbell') expect(p.axis).toBeUndefined();
    const e = JSON.parse(JSON.stringify(CURL['Hammer Curl'])) as PoseData; for (const k of e.klatki) for (const sd of ['R', 'L'] as const) if (k.rece?.[sd]) (k.rece[sd] as { obrotPrzedramienia?: number }).obrotPrzedramienia = 90;
    for (const p of keyframeFrame(e, 0.5).props) if (p.k === 'dumbbell') expect(p.axis).toBeUndefined();
  });
});
const E_DB = { handle: EQUIP.dbHandle };
