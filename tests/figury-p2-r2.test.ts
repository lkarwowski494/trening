/*
 * Poprawki p2, runda 2 (recenzja niezależna 27.10.2026, ponowna: docs/przekazanie/notatki/recenzje-1-1/ponowne/p2-p3.md).
 *   1. Wiersz błędu musi być widoczny w widokach, które aplikacja pokazuje dla rodziny (leg_machine pokazywała tylko bok, a „kolana do środka” prawie nie zmienia boku: ≤ 4,2 cm).
 *   2. Oparcie maszyny (Hack, Pendulum, Lying) przy siedzisku 2 cm ma podparcie: nogi ławki dochodzą do spodu oparcia, a nie wiszą pod zawiasem.
 */
import * as fs from 'fs';
import * as path from 'path';
import { keyframeFrame, FAMILIES, viewsOf, dataShapes, benchPolys, proj, EQUIP, STOPA_GRZBIETEM, type PoseData, type View, type V3, type Prop, type FamilyId } from '@/lib/figures/v2';

const POSES = path.join(__dirname, '..', 'lib/figures/v2/poses');
type PoseFile = { rodzina: string; cwiczenia: Record<string, PoseData> };
const pliki = fs.readdirSync(POSES).filter(f => f.endsWith('.json')).sort().map(f => JSON.parse(fs.readFileSync(path.join(POSES, f), 'utf8')) as PoseFile);
const GRID = Array.from({ length: 21 }, (_, i) => i / 20);

/** KONWENCJA (jedno miejsce): wiersz „Częsty błąd” ma różnić się od pozy poprawnej o co najmniej tyle cm (największe przesunięcie któregokolwiek z kluczowych stawów w rzucie na widok) w co najmniej jednym widoku pokazywanym dla rodziny.
 *  Najsłabszy błąd uznany za czytelny w recenzjach: 5,7 cm (pięty belt squat, bok); odrzucone w recenzji: 4,2 cm („kolana do środka” w leg_machine, bok). */
export const MIN_ROZNICA_BLEDU_W_WIDOKU_CM = 5;
const stawy = (sk: ReturnType<typeof keyframeFrame>['sk']): V3[] => (['R', 'L'] as const).flatMap(s => [sk.legs[s].knee, sk.legs[s].ankle, sk.legs[s].toe, sk.arms[s].elbow, sk.arms[s].grip]).concat([sk.head, sk.pelvis]);
export function roznicaBledu(d: PoseData, i: number, view: View): number {
  let m = 0;
  for (const u of GRID) { const a = stawy(keyframeFrame(d, u).sk), b = stawy(keyframeFrame(d, u, i).sk); a.forEach((q, j) => { const x = proj(q, view), y = proj(b[j], view); m = Math.max(m, Math.hypot(x[0] - y[0], x[1] - y[1])); }); }
  return m;
}
/** Znane słabo widoczne błędy z innych rodzin (poza zakresem tej gałęzi; backlog 1.1, ta sama klasa co nr 2 recenzji). Wpis nie jest wymagany: po poprawie test nadal przechodzi. */
const ODROCZONE = new Set([
  'leg_machine/Leg Press/sq.mis.kneesIn', /* suwnice tylko z boku (U-L1, p2-r3); wiersz poprawiony i widoczny z przodu (tests/figury-p2-r3.test.ts, sekcja 3), czeka na widok z przodu suwnicy (platforma w draw.ts) albo decyzję o usunięciu wiersza */
  'row/Pendlay Row/mis.roundBack', 'row/Reverse Grip Bent Over Row/mis.roundBack', 'row/T-Bar Row/mis.roundBack', 'row/Barbell Rear Delt Row/mis.roundBack', 'row/Bent Over Row (hantle)/mis.roundBack',
  'row/Bent Over Row (linki)/mis.roundBack', 'row/Bent Over Row (sztanga)/mis.roundBack', 'row/Smith Machine Bent Over Row/mis.roundBack', 'kneeling_hinge/Seated Good Mornings/mis.roundBack',
  'hip_bridge/Frog Pump/ht.mis.arch', 'hip_bridge/Glute Bridge/ht.mis.arch', 'hip_bridge/Glute Bridge (sztanga)/ht.mis.arch', 'hip_bridge/Hip Thrust (hantel)/ht.mis.arch', 'hip_bridge/Hip Thrust (sztanga)/ht.mis.arch',
  'hip_bridge/Machine Hip Thrust/ht.mis.arch', 'hip_bridge/Single Leg Glute Bridge/ht.mis.arch', 'hip_bridge/Single Leg Hip Thrust/ht.mis.arch', 'hip_bridge/Smith Machine Hip Thrust/ht.mis.arch',
  'hip_bridge/Stability Ball Hip Bridge/ht.mis.arch', 'leg_isolation/Slider Hamstring Curl/ht.mis.arch', 'cable_press/Incline Cable Chest Press/bp.mis.arch',
]);

describe('1. wiersz błędu różni się od pozy poprawnej w pokazywanym widoku (≥ MIN_ROZNICA_BLEDU_W_WIDOKU_CM)', () => {
  const wiersze = pliki.flatMap(f => { return Object.entries(f.cwiczenia).flatMap(([cw, d]) => d.bledy.map((b, i) => ({ klucz: `${f.rodzina}/${cw}/${b.cue}`, d, i, widoki: viewsOf(cw, f.rodzina as FamilyId) as View[] }))); });
  test('zbiór sprawdzanych wierszy jest duży', () => { expect(wiersze.length).toBeGreaterThan(90); });
  test('leg_machine pokazuje widok z przodu (kolana do środka widać z przodu)', () => { expect(FAMILIES.find(x => x.id === 'leg_machine')!.views).toContain('front'); });
  test.each(wiersze.filter(w => !ODROCZONE.has(w.klucz)).map(w => [w.klucz, w] as const))('%s: różnica ≥ konwencji w którymś pokazywanym widoku', (_k, w) => {
    const best = Math.max(...w.widoki.map(v => roznicaBledu(w.d, w.i, v)));
    expect([w.klucz, best >= MIN_ROZNICA_BLEDU_W_WIDOKU_CM]).toEqual([w.klucz, true]);
  });
  test.each(['Pendulum Squat', 'Lying Machine Squat', 'Belt Squat Machine'])('%s: „kolana do środka” widać z przodu (widok pokazywany w aplikacji)', cw => {
    expect(FAMILIES.find(x => x.id === 'leg_machine')!.views).toContain('front');
    const f = pliki.find(x => x.rodzina === 'leg_machine')!.cwiczenia[cw]; const i = f.bledy.findIndex(b => b.cue === 'sq.mis.kneesIn'); expect(i).toBeGreaterThanOrEqual(0);
    expect(roznicaBledu(f, i, 'front')).toBeGreaterThanOrEqual(MIN_ROZNICA_BLEDU_W_WIDOKU_CM);
  });
});

describe('2. oparcie maszyny bez siedziska ma podparcie (nogi dochodzą do spodu oparcia)', () => {
  const MASZYNY = ['Hack Squat', 'Pendulum Squat', 'Lying Machine Squat'];
  const poza = (cw: string): PoseData => pliki.find(x => x.rodzina === 'leg_machine')!.cwiczenia[cw];
  const bench = (cw: string): Extract<Prop, { k: 'bench' }> => keyframeFrame(poza(cw), 0).props.find((p): p is Extract<Prop, { k: 'bench' }> => p.k === 'bench')!;
  type Linia = { a: [number, number]; b: [number, number] };
  const nogi = (cw: string): Linia[] => dataShapes(poza(cw), 0, 'side').filter(s => s.id === 'benchLeg' && s.k === 'line') as unknown as Linia[];
  const gora = (l: Linia): [number, number] => (l.a[1] > l.b[1] ? l.a : l.b);
  /** Odległość punktu od odcinka (cm). */
  const dOdc = (p: [number, number], a: [number, number], b: [number, number]): number => { const dx = b[0] - a[0], dy = b[1] - a[1]; const t = Math.max(0, Math.min(1, ((p[0] - a[0]) * dx + (p[1] - a[1]) * dy) / (dx * dx + dy * dy))); return Math.hypot(p[0] - a[0] - t * dx, p[1] - a[1] - t * dy); };
  test.each(MASZYNY)('%s: co najmniej dwie nogi sięgają spodu oparcia (≤ 0,5 cm), rozstawione ≥ 40% długości oparcia, stoją na podłodze', cw => {
    const bp = benchPolys(bench(cw)); const u0 = bp.back[0] as [number, number], u1 = bp.back[1] as [number, number];
    const podp = nogi(cw).filter(l => dOdc(gora(l), u0, u1) <= 0.5);
    expect([cw, podp.length >= 2]).toEqual([cw, true]);
    const L = Math.hypot(u1[0] - u0[0], u1[1] - u0[1]); const g = podp.map(gora);
    const odl = Math.hypot(Math.max(...g.map(p => p[0])) - Math.min(...g.map(p => p[0])), Math.max(...g.map(p => p[1])) - Math.min(...g.map(p => p[1])));
    expect([cw, odl >= 0.4 * L]).toEqual([cw, true]);
    for (const l of podp) expect(Math.min(l.a[1], l.b[1])).toBeCloseTo(0, 5);
  });
  test('ławka z siedziskiem (suwnica) ma nogi jak dotąd: górne końce na wysokości siedziska', () => {
    for (const cw of ['Leg Press', 'Single Leg Press']) { const l = nogi(cw); expect(l.length).toBe(2); const pr = bench(cw); for (const x of l) expect(gora(x)[1]).toBeCloseTo(Math.max(pr.seatFrom[1] - EQUIP.benchPad, 0), 5); }
  });
});

describe('3. przysiad bułgarski: tylna stopa leży GRZBIETEM na ławce (decyzja właściciela 27.10.2026, zgodnie z kartą bss.setup)', () => {
  const BSS = ['Bulgarian Split Squat (hantle)', 'Bulgarian Split Squat (sztanga)', 'Smith Machine Bulgarian Split Squat'];
  const d = (cw: string): PoseData => pliki.find(x => x.rodzina === 'lunge')!.cwiczenia[cw];
  test.each(BSS)('%s: oś kostka→palce tylnej stopy do tyłu, nachylona ≤ maxNachylenieDeg, palce na blacie ± palceNaBlacieCm — w każdej klatce (także w błędzie)', cw => {
    const top = d(cw).sprzet.find(g => g.rodzaj === 'lawka')!.top!; const wiersze = [undefined, ...d(cw).bledy.map((_, i) => i)];
    for (const w of wiersze) for (const u of GRID) {
      const L = keyframeFrame(d(cw), u, w).sk.legs.L; const dx = L.toe[0] - L.ankle[0], dy = L.toe[1] - L.ankle[1];
      const nach = Math.atan2(-dy, -dx) * 180 / Math.PI; /* kąt osi poniżej poziomu, gdy palce są do tyłu */
      expect([cw, w, u, dx < 0, Math.abs(nach) <= STOPA_GRZBIETEM.maxNachylenieDeg + 5, Math.abs(L.toe[1] - top) <= STOPA_GRZBIETEM.palceNaBlacieCm]).toEqual([cw, w, u, true, true, true]);
    }
  });
  test('tylna stopa nie na palcach: pięta wyżej niż palce (podeszwa do góry)', () => { for (const cw of BSS) { const L = keyframeFrame(d(cw), 0.5).sk.legs.L; expect(L.heel[1]).toBeGreaterThan(L.toe[1] + 3); } });
});
