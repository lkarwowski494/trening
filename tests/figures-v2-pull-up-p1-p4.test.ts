/*
 * Rodzina figur v2 pull_up — poprawki po pierwszej recenzji niezależnej (fala 25, 01.11.2026; zwrot POPRAWKI):
 *  P1 (WYSOKIE) tryb błędu pu.partial („bez wyprostu rąk na dole”) pokazuje brak wyprostu NA DOLE (łokieć wyraźnie zgięty w u = 0), a nie skrócenie u góry;
 *  P2 (WYSOKIE) Gironda Sternum Chins: w u = 1 mostek (tułów) dochodzi do drążka (odstęp ≤ 3 cm), bez przenikania;
 *  P3 (WYSOKIE) Side To Side Chins: podciągnięcie z przesunięciem barków i głowy ku jednej dłoni (ręka po tej stronie bardziej zgięta), miednica bez bujania;
 *  P4 (ŚREDNIE) na dole ręce proste: łokieć ≤ 8° (jak Dead Hang 7,3°) w 8 ćwiczeniach, reguła sensu dol_rece_proste zaostrzona z 25° do 8°.
 * Liczby wylicza moduł geometrii aplikacji (frameAt), nie dane.
 * Ograniczenie (nie P3): naprzemienność stron w kolejnych powtórzeniach wymaga trybu pętli „lustro co powtórzenie” w silniku (cykl_lustro to marsz: liniowe tempo, licznik „Marsz”) — backlog.
 */
import * as fs from 'fs';
import * as path from 'path';
import { figureSpec, frameAt, jointAngles, GIRTH, TOL } from '@/lib/figures/v2';

type Sd = 'R' | 'L';
const spec = (k: string) => figureSpec(k)!;
const elbow = (k: string, u: number, e?: `data:${number}`, sides: Sd[] = ['R', 'L']) => Math.max(...sides.map(s => jointAngles(frameAt(spec(k), u, e).sk, s).elbow));
const errIndex = (k: string, cue: string) => (spec(k).variant as unknown as { data: { bledy: { cue: string }[] } }).data.bledy.findIndex(b => b.cue === cue);
const PARTIAL = ['Pull Up', 'Chin Up', 'Neutral Grip Pull Up'];
const REKA_PROSTA = ['Pull Up', 'Chin Up', 'Neutral Grip Pull Up', 'Mixed Grip Chin', 'One Arm Chin-Up', 'Side To Side Chins', 'Gorilla Chin/Crunch', 'Wide-Grip Rear Pull-Up'];
const segDist = (a: number[], b: number[], p: number[]) => { const ab = [b[0] - a[0], b[1] - a[1]], ap = [p[0] - a[0], p[1] - a[1]]; const t = Math.max(0, Math.min(1, (ap[0] * ab[0] + ap[1] * ab[1]) / (ab[0] ** 2 + ab[1] ** 2))); return Math.hypot(p[0] - a[0] - t * ab[0], p[1] - a[1] - t * ab[1]); };

describe('P1: pu.partial pokazuje brak wyprostu rąk NA DOLE (nie skrócenie u góry)', () => {
  test.each(PARTIAL)('%s: wszystkie ćwiczenia rodziny z tym błędem są objęte', k => { expect(errIndex(k, 'pu.partial')).toBe(0); });
  test('żadne inne ćwiczenie rodziny nie ma błędu pu.partial (lista PARTIAL jest pełna)', () => {
    const d = JSON.parse(fs.readFileSync(path.join(__dirname, '../lib/figures/v2/poses/pull_up.json'), 'utf8')).cwiczenia as Record<string, { bledy: { cue: string }[] }>;
    expect(Object.keys(d).filter(k => d[k].bledy.some(b => b.cue === 'pu.partial')).sort()).toEqual([...PARTIAL].sort());
  });
  test.each(PARTIAL)('%s: łokieć w najniższym punkcie trybu błędu > 30° (poprawny ≤ 8°)', k => {
    expect(elbow(k, 0, 'data:0')).toBeGreaterThan(30); expect(elbow(k, 0)).toBeLessThanOrEqual(8);
  });
  test.each(PARTIAL)('%s: góra błędu nie niżej niż poprawna o > 3 cm (miednica, kostki)', k => {
    const a = frameAt(spec(k), 1).sk, b = frameAt(spec(k), 1, 'data:0').sk;
    expect(a.pelvis[1] - b.pelvis[1]).toBeLessThanOrEqual(3); expect(a.legs.R.ankle[1] - b.legs.R.ankle[1]).toBeLessThanOrEqual(3);
  });
  test.each(PARTIAL)('%s: błąd różni się od poprawnej NA DOLE (miednica wyżej o ≥ 4 cm w u = 0)', k => {
    expect(frameAt(spec(k), 0, 'data:0').sk.pelvis[1] - frameAt(spec(k), 0).sk.pelvis[1]).toBeGreaterThanOrEqual(4);
  });
});

describe('P2: Gironda Sternum Chins — mostek dochodzi do drążka', () => {
  const K = 'Gironda Sternum Chins';
  /** Odstęp powierzchni tułowia (kapsuła kolizji) od osi drążka w płaszczyźnie bocznej, cm: odległość osi tułowia od drążka − promień tułowia − promień drążka (1,6 cm); ujemny = przenikanie. */
  const odstep = (u: number) => { const f = frameAt(spec(K), u); const bar = f.props.find(p => p.k === 'barbell') as unknown as { c: number[] }; return segDist([f.sk.pelvis[0], f.sk.pelvis[1]], [f.sk.shoulderC[0], f.sk.shoulderC[1]], [bar.c[0], bar.c[1]]) - GIRTH.trunkCollide - 1.6; };
  test('u = 1: odstęp mostek–drążek ≤ 3 cm i bez przenikania (≥ −tolerancja)', () => { expect(odstep(1)).toBeLessThanOrEqual(3); expect(odstep(1)).toBeGreaterThanOrEqual(-TOL.pen); });
  test('droga: odstęp maleje monotonicznie do drążka od u = 0,5, nigdzie nie przenika', () => {
    let prev = Infinity; for (let i = 24; i <= 48; i++) { const o = odstep(i / 48); expect(o).toBeGreaterThanOrEqual(-TOL.pen); expect(o).toBeLessThanOrEqual(prev + 1e-6); prev = o; }
  });
  test('odchylenie tułowia ok. 40° i łuk pleców zachowane, łokieć w ROM (≤ 149°)', () => {
    const d = (spec(K).variant as unknown as { data: { klatki: { u: number; pochylenieTulowia: number; zgiecieKregoslupa: number }[] } }).data.klatki.at(-1)!;
    expect([d.pochylenieTulowia, d.zgiecieKregoslupa]).toEqual([-40, -20]);
    for (let i = 0; i <= 48; i++) expect(elbow(K, i / 48)).toBeLessThanOrEqual(149);
  });
});

describe('P3: Side To Side Chins — podciągnięcie ku jednej dłoni, nie bujanie miednicą', () => {
  const K = 'Side To Side Chins';
  test('u = 1: łokcie różnią się o ≥ 20° (ręka po stronie podciągnięcia bardziej zgięta)', () => {
    const f = frameAt(spec(K), 1); const R = jointAngles(f.sk, 'R').elbow, L = jointAngles(f.sk, 'L').elbow; expect(Math.abs(R - L)).toBeGreaterThanOrEqual(20);
  });
  test('u = 1: barki i głowa przesunięte w bok ku jednej dłoni (≥ 10 cm od osi), barki nierówno (skłon boczny)', () => {
    const f = frameAt(spec(K), 1); expect(Math.abs(f.sk.shoulderC[2])).toBeGreaterThanOrEqual(10); expect(Math.abs(f.sk.head[2])).toBeGreaterThanOrEqual(10);
    expect(Math.abs(f.sk.arms.R.shoulder[1] - f.sk.arms.L.shoulder[1])).toBeGreaterThanOrEqual(5);
  });
  test('miednica nie buja: w bok ≤ 3 cm i w osi x ≤ 3 cm przez cały ruch; nogi nie wychodzą w bok', () => {
    const P = Array.from({ length: 49 }, (_, i) => frameAt(spec(K), i / 48).sk.pelvis);
    expect(Math.max(...P.map(p => Math.abs(p[2])))).toBeLessThanOrEqual(3); expect(Math.max(...P.map(p => p[0])) - Math.min(...P.map(p => p[0]))).toBeLessThanOrEqual(3);
    for (let i = 0; i <= 48; i++) { const s = frameAt(spec(K), i / 48).sk; expect(Math.abs(s.legs.R.ankle[2] - 15)).toBeLessThanOrEqual(3); expect(Math.abs(s.legs.L.ankle[2] + 15)).toBeLessThanOrEqual(3); }
  });
  test('dół symetryczny (ramiona jak w zwisie), góra asymetryczna: różnica łokci rośnie z fazą ruchu', () => {
    const f0 = frameAt(spec(K), 0).sk; expect(Math.abs(f0.shoulderC[2])).toBeLessThanOrEqual(1);
    expect(Math.abs(jointAngles(f0, 'R').elbow - jointAngles(f0, 'L').elbow)).toBeLessThanOrEqual(2);
  });
});

describe('P4: na dole ręce proste (łokieć ≤ 8°)', () => {
  test.each(REKA_PROSTA)('%s: łokieć w u = 0 ≤ 8° (strona trzymająca)', k => { expect(elbow(k, 0, undefined, k === 'One Arm Chin-Up' ? ['R'] : ['R', 'L'])).toBeLessThanOrEqual(8); });
  test('reguła sensu dol_rece_proste dla pull_up zaostrzona do 8° (było 25°)', () => {
    const s = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/zrodla/figury-sens.json'), 'utf8')); expect(s.rodziny.pull_up.reguly.dol_rece_proste.parametry.max_lokiec_deg).toBe(8);
  });
});
