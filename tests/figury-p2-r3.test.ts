/*
 * Poprawki p2, runda 3 (recenzja niezależna 27.10.2026: docs/przekazanie/notatki/recenzje-1-1/ponowne/p2-r2.md, błędy B1 i B2).
 *   1. Strażnik „segmenty nóg się nie przenikają”: udo × udo i goleń × goleń (kapsuły ciała, odstęp powierzchni ≥ −TOL_NOGI_CM) w KAŻDEJ klatce pozy poprawnej i KAŻDEGO wiersza błędu, wszystkie rodziny z poses/.
 *   2. Strażnik „stopa nieruchoma w pozie poprawnej stoi w miejscu w wierszu błędu” (kostka na platformie/podłodze nie jedzie po niej), poza wierszami, których tematem jest stopa (pięty).
 *   3. B1: Leg Press, wiersz „kolana do środka”: stopy nieruchome na platformie, kolana do środka (jak Pendulum).
 *   4. B2: Pendulum, Lying Machine Squat, Belt Squat Machine: kolano do środka w dole −6…−12° (nie −24°), bez przenikania nóg (przy −10…−12° kapsuły ud przenikają się o 5–7 cm, więc −7 i −8).
 *   5. U-L1 (decyzja koordynatora a): widoki na poziomie ćwiczenia; suwnice (Leg Press, Single Leg Press, Calf Press) tylko z boku, reszta rodziny bez zmian.
 *   6. U-L2: Lying Machine Squat z przodu: pręt dźwigni nie przechodzi przez twarz.
 */
import * as fs from 'fs';
import * as path from 'path';
import { keyframeFrame, FAMILIES, FAMILY, dataShapes, bodyColliders, gap, viewsOf, EXERCISE_VIEWS, type PoseData } from '@/lib/figures/v2';
import { distSegSeg } from '@/lib/figures/v2/math';

const POSES = path.join(__dirname, '..', 'lib/figures/v2/poses');
type PoseFile = { rodzina: string; cwiczenia: Record<string, PoseData> };
const pliki = fs.readdirSync(POSES).filter(f => f.endsWith('.json')).sort().map(f => JSON.parse(fs.readFileSync(path.join(POSES, f), 'utf8')) as PoseFile);
const GRID = Array.from({ length: 21 }, (_, i) => i / 20);
const SD = ['R', 'L'] as const;
const dane = (rodzina: string, cw: string): PoseData => pliki.find(f => f.rodzina === rodzina)!.cwiczenia[cw];
const wiersze = (d: PoseData): (number | undefined)[] => [undefined, ...d.bledy.map((_, i) => i)];

/** KONWENCJA (jedno miejsce): najgłębsze dopuszczalne przenikanie segmentów tej samej pary nóg (cm). Kapsuły ciała mają promień uśredniony, a wypukłości mięśni nachodzą na siebie w rysunku w przybliżeniu o 1–1,5 cm. */
export const TOL_NOGI_CM = 1.5;
/** KONWENCJA: stopa, która w pozie poprawnej nie rusza się (≤ STOPA_STOI_CM w całym ruchu), w wierszu błędu nie może odjechać od pozy poprawnej o więcej niż STOPA_BLAD_CM. */
export const STOPA_STOI_CM = 0.5;
export const STOPA_BLAD_CM = 1;

function odstepyNog(d: PoseData, w: number | undefined, u: number): { co: string; gap: number }[] {
  const c = bodyColliders(keyframeFrame(d, u, w).sk); const pick = (id: string) => c.find(x => x.id === id)!;
  return [['thigh', 'udo'], ['shank', 'goleń']].map(([id, nazwa]) => ({ co: nazwa, gap: gap(pick(id + 'R'), pick(id + 'L')) }));
}
function ruchKostki(d: PoseData, w: number | undefined, s: 'R' | 'L'): number { const p = GRID.map(u => keyframeFrame(d, u, w).sk.legs[s].ankle); return Math.max(...p.map(q => Math.hypot(q[0] - p[0][0], q[1] - p[0][1], q[2] - p[0][2]))); }
function odjazdKostki(d: PoseData, i: number, s: 'R' | 'L'): number { return Math.max(...GRID.map(u => { const a = keyframeFrame(d, u).sk.legs[s].ankle, b = keyframeFrame(d, u, i).sk.legs[s].ankle; return Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]); })); }

/** Wyjątki strażników: klucz `rodzina/ćwiczenie/wiersz` (wiersz = „ok” albo cue). Wpis wymaga powodu; test pilnuje, że wyjątek jest nadal potrzebny (zapadka). */
const POZA_P2 = 'trafienie prawdziwe, poza zakresem poprawek p2 (inna rodzina/ćwiczenie niż leg_machine i przysiad bułgarski); naprawa w backlogu 1.1 (docs/21)';
const WYJATKI_NOGI: Record<string, string> = {
  'core_floor/Tuck Crunch/ok': `${POZA_P2}: golenie zbliżone o ok. 4 cm bardziej niż stykające się kostki`,
  'lunge/Barbell Step Up/lunge.mis.kneeIn': `${POZA_P2}: wiersz kneeIn przesadzony (przenikanie ud ok. 6 cm)`,
  'lunge/Pistol Squat/sq.mis.kneesIn': `${POZA_P2}: wiersz kneesIn przesadzony (uda przecinają się)`,
  'lunge/Smith Machine Pistol Squat/lunge.mis.kneeIn': `${POZA_P2}: wiersz kneeIn przesadzony (uda przecinają się)`,
  'lunge/Single-Leg High Box Squat/lunge.mis.kneeIn': `${POZA_P2}: wiersz kneeIn przesadzony (przenikanie ud ok. 3,4 cm)`,
  'pushup_plank/Mountain Climbers/ok': `${POZA_P2}: w pozie poprawnej nogi przecinają się (rodzina pushup_plank)`,
  'sled_throw/Wall Ball/sq.mis.kneesIn': `${POZA_P2}: wiersz kneesIn przesadzony (przenikanie ud ok. 9,6 cm)`,
};
const WYJATKI_STOPA: Record<string, string> = {};

describe('1. segmenty nóg się nie przenikają (udo × udo, goleń × goleń) — wszystkie pozy i wiersze błędów', () => {
  const przypadki = pliki.flatMap(f => Object.entries(f.cwiczenia).flatMap(([cw, d]) => wiersze(d).map(w => ({ klucz: `${f.rodzina}/${cw}/${w === undefined ? 'ok' : d.bledy[w].cue}`, d, w }))));
  test('zbiór sprawdzanych przypadków jest duży', () => { expect(przypadki.length).toBeGreaterThan(400); });
  test.each(przypadki.filter(p => !(p.klucz in WYJATKI_NOGI)).map(p => [p.klucz, p] as const))('%s: odstęp ≥ −TOL_NOGI_CM we wszystkich klatkach', (_k, p) => {
    let najgorszy = Infinity; for (const u of GRID) for (const o of odstepyNog(p.d, p.w, u)) najgorszy = Math.min(najgorszy, o.gap);
    expect([p.klucz, najgorszy >= -TOL_NOGI_CM]).toEqual([p.klucz, true]);
  });
  test('zapadka: wyjątek jest nadal potrzebny', () => {
    for (const k of Object.keys(WYJATKI_NOGI)) { const p = przypadki.find(x => x.klucz === k); expect([k, !!p]).toEqual([k, true]); let n = Infinity; for (const u of GRID) for (const o of odstepyNog(p!.d, p!.w, u)) n = Math.min(n, o.gap); expect([k, n < -TOL_NOGI_CM]).toEqual([k, true]); }
  });
});

/** Stopa „na podporze” w pozie poprawnej: kostka stoi w miejscu (≤ STOPA_STOI_CM) albo jedzie razem z platformą maszyny (sprzęt „dzwignia” z punktem „kostki”: suwnica). */
const naPodporze = (d: PoseData, s: 'R' | 'L'): boolean => ruchKostki(d, undefined, s) <= STOPA_STOI_CM || d.sprzet.some(g => g.rodzaj === 'dzwignia' && g.punkt === 'kostki');
/** Wiersz, którego tematem jest sama stopa (pięty w górę, niepełne wspięcie): stopa ma w nim ruszać się z podpory. */
const TEMAT_STOPA = /heels|^calf\./;
describe('2. stopa na podporze (podłoga, platforma) w pozie poprawnej stoi na niej w wierszu błędu', () => {
  const przypadki = pliki.flatMap(f => Object.entries(f.cwiczenia).flatMap(([cw, d]) => SD.flatMap(s => d.bledy.map((b, i) => ({ klucz: `${f.rodzina}/${cw}/${b.cue}/${s}`, d, i, s, stoi: naPodporze(d, s), temat: TEMAT_STOPA.test(b.cue) })))));
  test('zbiór jest duży i obejmuje stopy na podporze oraz wiersze o stopie', () => { expect(przypadki.length).toBeGreaterThan(150); expect(przypadki.filter(p => p.stoi && !p.temat).length).toBeGreaterThan(50); expect(przypadki.filter(p => p.temat).length).toBeGreaterThan(5); });
  test.each(przypadki.filter(p => p.stoi && !p.temat && !(p.klucz in WYJATKI_STOPA)).map(p => [p.klucz, p] as const))('%s: kostka odjeżdża ≤ STOPA_BLAD_CM', (_k, p) => {
    expect([p.klucz, odjazdKostki(p.d, p.i, p.s) <= STOPA_BLAD_CM]).toEqual([p.klucz, true]);
  });
  test('zapadka: wyjątek jest nadal potrzebny', () => {
    for (const k of Object.keys(WYJATKI_STOPA)) { const p = przypadki.find(x => x.klucz === k); expect([k, !!p]).toEqual([k, true]); expect([k, odjazdKostki(p!.d, p!.i, p!.s) > STOPA_BLAD_CM]).toEqual([k, true]); }
  });
});

describe('3. B1 Leg Press: „kolana do środka” — stopy nieruchome na platformie, kolana do środka', () => {
  const d = dane('leg_machine', 'Leg Press'); const i = d.bledy.findIndex(b => b.cue === 'sq.mis.kneesIn');
  test('wiersz istnieje', () => { expect(i).toBeGreaterThanOrEqual(0); });
  test.each(SD)('kostka %s identyczna jak w pozie poprawnej w każdej klatce (≤ 0,3 cm)', s => { expect(odjazdKostki(d, i, s)).toBeLessThanOrEqual(0.3); });
  test.each(SD)('kolano %s przesuwa się do środka (|z| maleje o ≥ 3 cm), nie przechodzi osi ciała', s => {
    const z = (w?: number) => GRID.map(u => Math.abs(keyframeFrame(d, u, w).sk.legs[s].knee[2])); const ok = z(), bl = z(i);
    expect(Math.max(...ok.map((v, j) => v - bl[j]))).toBeGreaterThanOrEqual(3);
    for (const u of GRID) { const k = keyframeFrame(d, u, i).sk.legs[s].knee[2]; expect(s === 'R' ? k : -k).toBeGreaterThan(2); }
  });
  test('wiersz widoczny z przodu (≥ 5 cm różnicy w rzucie) — mimo że rodzina pokazuje Leg Press tylko z boku', () => {
    let m = 0; for (const u of GRID) for (const s of SD) { const a = keyframeFrame(d, u).sk.legs[s].knee, b = keyframeFrame(d, u, i).sk.legs[s].knee; m = Math.max(m, Math.hypot(a[2] - b[2], a[1] - b[1])); }
    expect(m).toBeGreaterThanOrEqual(5);
  });
});

describe('4. B2: Pendulum, Lying Machine Squat, Belt Squat Machine — kolano do środka w dole −6…−12° (nie −24°), bez przenikania', () => {
  test.each(['Pendulum Squat', 'Lying Machine Squat', 'Belt Squat Machine'])('%s', cw => {
    const d = dane('leg_machine', cw); const i = d.bledy.findIndex(b => b.cue === 'sq.mis.kneesIn'); expect(i).toBeGreaterThanOrEqual(0);
    const last = d.bledy[i].klatki.find(k => k.u === 1)!;
    for (const s of SD) { const o = last.nogi![s]!.odchylenieKolana!; expect(o).toBeLessThanOrEqual(-6); expect(o).toBeGreaterThanOrEqual(-12); }
    for (const u of GRID) for (const o of odstepyNog(d, i, u)) expect([cw, u, o.co, o.gap >= -TOL_NOGI_CM]).toEqual([cw, u, o.co, true]);
  });
});

describe('5. U-L1: widoki na poziomie ćwiczenia (suwnice tylko z boku), zgodnie wstecz', () => {
  const SUWNICE = ['Leg Press', 'Single Leg Press', 'Calf Press (leg press)'];
  test.each(SUWNICE)('%s: tylko bok', cw => { expect(viewsOf(cw, 'leg_machine')).toEqual(['side']); });
  test('reszta rodziny leg_machine i inne rodziny: widoki rodziny (bez zmian)', () => {
    expect(viewsOf('Hack Squat', 'leg_machine')).toEqual(['side', 'front']); expect(viewsOf('Pendulum Squat', 'leg_machine')).toEqual(['side', 'front']);
    for (const f of FAMILIES) expect(viewsOf('Nieistniejące ćwiczenie', f.id)).toEqual(f.views);
  });
  test('wyjątki widoków ćwiczeń są jawne: tylko suwnice, z powodem, i tylko podzbiór widoków rodziny', () => {
    expect(Object.keys(EXERCISE_VIEWS).sort()).toEqual([...SUWNICE].sort());
    for (const [cw, v] of Object.entries(EXERCISE_VIEWS)) { expect(v.reason.length).toBeGreaterThan(20); for (const x of v.views) expect(FAMILY[v.family].views).toContain(x); expect(cw.length).toBeGreaterThan(0); }
  });
});

describe('6. U-L2: Lying Machine Squat z przodu — pręt dźwigni nie przechodzi przez twarz', () => {
  const d = dane('leg_machine', 'Lying Machine Squat');
  test('żaden odcinek dźwigni (ani punkt obrotu) w widoku z przodu nie dotyka głowy w żadnej klatce ani wierszu', () => {
    for (const w of wiersze(d)) for (const u of GRID) {
      const sh = dataShapes(d, u, 'front', w); const glowa = sh.find(s => s.id === 'head' && s.k === 'ellipse') as unknown as { c: [number, number]; ry: number };
      expect(glowa).toBeTruthy();
      for (const s of sh.filter(x => x.k === 'line' && x.id === 'landmine')) { const l = s as unknown as { a: [number, number]; b: [number, number] }; const dd = distSegSeg([l.a[0], l.a[1], 0], [l.b[0], l.b[1], 0], [glowa.c[0], glowa.c[1], 0], [glowa.c[0], glowa.c[1], 0]); expect([w, u, dd > glowa.ry]).toEqual([w, u, true]); }
    }
  });
  test('w widoku z boku dźwignia nadal jest rysowana (zmiana dotyczy tylko rzutu przez głowę)', () => { expect(dataShapes(d, 0.5, 'side').some(s => s.id === 'landmine')).toBe(true); });
  test('ramka widoku z przodu nie rośnie o pręt nad głową: kształty z przodu mają mniej niż 80 cm wysokości całkowitej ponad podłogą + zapas', () => {
    const ys = dataShapes(d, 0, 'front').flatMap(s => s.k === 'line' ? [s.a[1], s.b[1]] : s.k === 'circle' ? [s.c[1] + s.r] : []); expect(Math.max(...ys)).toBeLessThan(150);
  });
});
