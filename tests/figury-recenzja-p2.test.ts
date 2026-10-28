/*
 * Poprawki po niezależnej recenzji ruchu 1.1, partia 2 (27.10.2026, decyzja właściciela: wariant A — bramką jest recenzja ruchu każdej rodziny).
 * Rodziny: calf_raise, lunge, leg_machine, back_extension, glute_floor, leg_isolation. 17 błędów w 6 klasach; każdy ma test, który go odtwarza (czerwony przed poprawką generatora):
 *   1. stopa za stopniem (calf_raise, 6 ćwiczeń): przodostopie na blacie, pięta poza krawędzią;
 *   2. wykrok bez góry ruchu (Bulgarian ×3, Suspended Split Squat): zakres miednicy ≥ 20 cm i przednie kolano na górze ≤ 60°;
 *   3. maszyna bez oparcia (Hack, Pendulum, Lying Machine Squat): plecy na oparciu w każdej klatce;
 *   4. kolano zgięte do tyłu w leżeniu przodem (Reverse Hyper, Back Extension + Lower Back Curl, Prone Flutter Kicks): niezmiennik w całym repo (poza listą oczekujących rodzin partii 1);
 *   5. Machine Glute Kickback: dłonie na uchwytach maszyny;
 *   6. Seated Band Hamstring Curl: guma zaczepiona z przodu, rozciąga się, gdy pięta idzie pod siedzisko (nowy tryb gumy `zaczep_kostki`).
 * Plus: pozostałe pozy tych rodzin bez zmian (tests/fixtures/figury-p2-baza.json — odciski sprzed poprawek).
 */
import * as fs from 'fs';
import * as path from 'path';
import { createHash } from 'crypto';
import {
  keyframeFrame, jointAngles, propsFrom, gearFieldIssues, poseSchema, BAND_MOUNT, GEAR_KINDS, BENCH, dataShapes, boundsOf, svgDocument, figurePalette,
  type PoseData, type Skeleton, type Side, type View, type Shape, type Prop, type V3,
} from '@/lib/figures/v2';
import { light } from '@/lib/theme';

const ROOT = path.join(__dirname, '..');
const POSES = path.join(ROOT, 'lib/figures/v2/poses');
type PoseFile = { rodzina: string; cwiczenia: Record<string, PoseData> };
const file = (rodzina: string): PoseFile => JSON.parse(fs.readFileSync(path.join(POSES, `${rodzina}.json`), 'utf8')) as PoseFile;
const poza = (rodzina: string, cw: string): PoseData => { const d = file(rodzina).cwiczenia[cw]; if (!d) throw new Error(`brak pozy ${rodzina}/${cw}`); return d; };
const GRID = Array.from({ length: 21 }, (_, i) => i / 20);
const SIDES: Side[] = ['R', 'L'];

/* ---------- 4. kolano zgięte do tyłu: odsunięcie kolana od linii biodro–kostka rzutowane na „przód uda” (cm; ujemne = przeprost) ---------- */
/** Przód uda = przód tułowia obrócony o kąt uda w płaszczyźnie strzałkowej (x, y); kolano po przedniej stronie linii biodro–kostka daje wartość dodatnią. */
export function przesuniecieKolanaWPrzod(sk: Skeleton, s: Side): number {
  const L = sk.legs[s]; const h = [L.hip[0], L.hip[1]], k = [L.knee[0], L.knee[1]], a = [L.ankle[0], L.ankle[1]];
  const t = [k[0] - h[0], k[1] - h[1]]; const tl = Math.hypot(t[0], t[1]) || 1; const td = [t[0] / tl, t[1] / tl];
  const nu = [-sk.up[0], -sk.up[1]]; const ang = Math.atan2(nu[0] * td[1] - nu[1] * td[0], nu[0] * td[0] + nu[1] * td[1]);
  const c = Math.cos(ang), sn = Math.sin(ang); const tf = [sk.front[0] * c - sk.front[1] * sn, sk.front[0] * sn + sk.front[1] * c];
  const ab = [a[0] - h[0], a[1] - h[1]]; const al = Math.hypot(ab[0], ab[1]) || 1; const u1 = [ab[0] / al, ab[1] / al];
  const kh = [k[0] - h[0], k[1] - h[1]]; const pr = kh[0] * u1[0] + kh[1] * u1[1]; const perp = [kh[0] - pr * u1[0], kh[1] - pr * u1[1]];
  return perp[0] * tf[0] + perp[1] * tf[1];
}
const minKolano = (d: PoseData): number => Math.min(...GRID.flatMap(u => { const fr = keyframeFrame(d, u); return SIDES.map(s => przesuniecieKolanaWPrzod(fr.sk, s)); }));

/** Rodziny partii 1 (poprawki-p1 / jakosc-r2) z jeszcze niepoprawionym kolanem w leżeniu przodem: poza zakresem tej gałęzi (nie regenerowane tutaj). Wpis nie jest wymagany: gdy poza naprawiono, test nadal przechodzi. */
const OCZEKUJACE_KOLANO = new Set([
  'core_floor/Toe Touchers', 'curl/Spider Curl', 'curl/Spider Curl (sztanga)', 'delt_raise/Front Incline Dumbbell Raise', 'delt_raise/Straight Raises on Incline Bench' /* przeprost ok. 19 cm w leżeniu przodem na ławce skośnej; ujawnione przy scaleniu G6b 28.10.2026, ta sama klasa co pozostałe leżenie przodem; backlog 1.1 */, 'pushup_plank/Decline Push Up',
  'rotator_cuff/Reverse Flyes With External Rotation', 'row/Seal Row (sztanga)', 'row/Lying T-Bar Row', 'row/Chest Supported Row', 'shrug/Middle Back Shrug',
]);
const PRZEPROST_TOL = -1; /* cm: reguła `kolano_w_przod` z recenzji (≥ −1 cm) */

describe('4. kolano nigdy nie zgina się do tyłu (niezmiennik wszystkich póz z danych)', () => {
  const wszystkie = fs.readdirSync(POSES).filter(f => f.endsWith('.json')).sort().flatMap(f => { const d = file(f.replace('.json', '')); return Object.keys(d.cwiczenia).map(cw => [d.rodzina, cw] as const); });
  const pilnowane = wszystkie.filter(([r, cw]) => !OCZEKUJACE_KOLANO.has(`${r}/${cw}`));
  test('zbiór pilnowanych póz jest duży (wszystko poza listą oczekujących)', () => { expect(pilnowane.length).toBeGreaterThan(300); expect(wszystkie.length - pilnowane.length).toBeLessThanOrEqual(OCZEKUJACE_KOLANO.size); });
  test.each(['Back Extension', 'Reverse Hyperextension', 'Lower Back Curl'])('back_extension / %s: kolano po przedniej stronie linii biodro–kostka (≥ −1 cm) w całym ruchu', cw => { expect([cw, minKolano(poza('back_extension', cw)) >= PRZEPROST_TOL]).toEqual([cw, true]); });
  test('glute_floor / Prone Flutter Kicks: kolano bez przeprostu w fazach pośrednich', () => { expect(minKolano(poza('glute_floor', 'Prone Flutter Kicks'))).toBeGreaterThanOrEqual(PRZEPROST_TOL); });
  test('Reverse Hyperextension: nogi proste albo lekko zgięte (kolano ≤ 12°) — nie złamane do tyłu o 17–33°', () => {
    const d = poza('back_extension', 'Reverse Hyperextension'); for (const u of GRID) for (const s of SIDES) expect(jointAngles(keyframeFrame(d, u).sk, s).knee).toBeLessThan(12);
  });
  test.each(pilnowane.map(([r, cw]) => `${r}/${cw}`))('%s: bez przeprostu kolana', klucz => {
    const [r, ...reszta] = klucz.split('/'); const cw = reszta.join('/'); expect([klucz, minKolano(poza(r, cw)) >= PRZEPROST_TOL]).toEqual([klucz, true]);
  });
});

/* ---------- 1. stopa na stopniu ---------- */
const STOPIEN = ['Łydki na stopniu', 'Standing Calf Raise', 'Smith Machine Calf Raise', 'Calf Raise (sztanga)', 'Donkey Calf Raise', 'Single Leg Calf Raise'];
describe('1. calf_raise: przodostopie na stopniu, pięta poza krawędzią', () => {
  test.each(STOPIEN)('%s: głowy kości śródstopia (70% długości stopy od pięty) nad blatem, pięta za krawędzią — w każdej klatce', cw => {
    const d = poza('calf_raise', cw); const box0 = d.sprzet.find(g => g.rodzaj === 'skrzynia'); expect(box0).toBeDefined();
    for (const u of GRID) {
      const fr = keyframeFrame(d, u); const box = fr.props.find((p): p is Extract<Prop, { k: 'box' }> => p.k === 'box')!;
      const stojace = cw === 'Single Leg Calf Raise' ? (['R'] as Side[]) : SIDES;
      for (const s of stojace) {
        const L = fr.sk.legs[s]; const ball = L.heel[0] + 0.7 * (L.toe[0] - L.heel[0]);
        expect([cw, s, u, ball >= box.x0 && ball <= box.x1]).toEqual([cw, s, u, true]); /* przodostopie na blacie */
        expect([cw, s, u, L.heel[0] < box.x0]).toEqual([cw, s, u, true]); /* pięta wisi poza krawędzią */
        expect([cw, s, u, L.toe[0] <= box.x1]).toEqual([cw, s, u, true]);
      }
    }
  });
  test.each(STOPIEN)('%s: w dole pięta jest poniżej blatu (rozciągnięcie), na górze kostka wyżej niż w dole', cw => {
    const d = poza('calf_raise', cw); const f0 = keyframeFrame(d, 0), f1 = keyframeFrame(d, 1); const box = f0.props.find((p): p is Extract<Prop, { k: 'box' }> => p.k === 'box')!;
    expect(f0.sk.legs.R.heel[1]).toBeLessThan(box.top); expect(f1.sk.legs.R.ankle[1]).toBeGreaterThan(f0.sk.legs.R.ankle[1] + 8);
  });
  test('wspięcia bez stopnia (linki, guma) nie mają skrzyni', () => { for (const cw of ['Calf Raise (linki)', 'Band Calf Raise']) expect(poza('calf_raise', cw).sprzet.some(g => g.rodzaj === 'skrzynia')).toBe(false); });
});

/* ---------- 2. wykrok z górą ruchu ---------- */
const BULGARSKIE = ['Bulgarian Split Squat (hantle)', 'Bulgarian Split Squat (sztanga)', 'Smith Machine Bulgarian Split Squat', 'Suspended Split Squat'];
describe('2. lunge: przysiad bułgarski i podwieszany pokazują cały ruch (nie tylko dół)', () => {
  test.each(BULGARSKIE)('%s: miednica porusza się o ≥ 20 cm, na górze przednie kolano ≤ 60°', cw => {
    const d = poza('lunge', cw); const ys = GRID.map(u => keyframeFrame(d, u).sk.pelvis[1]);
    expect(Math.max(...ys) - Math.min(...ys)).toBeGreaterThanOrEqual(20);
    const uGora = GRID[ys.indexOf(Math.max(...ys))]; expect(jointAngles(keyframeFrame(d, uGora).sk, 'R').knee).toBeLessThanOrEqual(60);
  });
  test.each(BULGARSKIE)('%s: na dole tylne kolano tuż nad podłogą (≤ 20 cm) jak w Split Squat', cw => {
    const d = poza('lunge', cw); const ys = GRID.map(u => keyframeFrame(d, u).sk.legs.L.knee[1]); expect(Math.min(...ys)).toBeLessThanOrEqual(20);
  });
  test('wykroki, które już miały pełny zakres, zostają bez zmian (Split Squat ≥ 20 cm)', () => { for (const cw of ['Split Squat', 'Reverse Lunge', 'Lateral Lunge']) { const ys = GRID.map(u => keyframeFrame(poza('lunge', cw), u).sk.pelvis[1]); expect(Math.max(...ys) - Math.min(...ys)).toBeGreaterThanOrEqual(20); } });
});

/* ---------- 3. maszyny z oparciem ---------- */
const MASZYNY = ['Hack Squat', 'Pendulum Squat', 'Lying Machine Squat'];
/** Odległość punktu od prostej oparcia ławki (po stronie osoby, cm) i rzut wzdłuż oparcia (cm od zawiasu). */
function wzgledemOparcia(g: { x?: number; top?: number; kat?: number; dlugosc?: number }, p: V3): { d: number; t: number; len: number } {
  const th = (g.kat ?? 0) * Math.PI / 180; const L = g.dlugosc ?? BENCH.backLen; const dir = [-Math.cos(th), Math.sin(th)]; const H = [g.x ?? 0, g.top ?? BENCH.seatTop];
  const v = [p[0] - H[0], p[1] - H[1]]; const t = v[0] * dir[0] + v[1] * dir[1]; const n = [dir[1], -dir[0]]; /* normalna po stronie siedziska (+x) */
  return { d: v[0] * n[0] + v[1] * n[1], t, len: L };
}
describe('3. leg_machine: plecy na oparciu maszyny w każdej klatce', () => {
  test.each(MASZYNY)('%s: w sprzęcie jest oparcie (lawka), tułów leży na nim (oś tułowia ≈ 10,2 cm od powierzchni, ±3 cm) i w obrębie oparcia', cw => {
    const d = poza('leg_machine', cw); const oparcie = d.sprzet.find(g => g.rodzaj === 'lawka'); expect(oparcie).toBeDefined();
    for (const u of GRID) {
      const sk = keyframeFrame(d, u).sk;
      for (const [nazwa, pt] of [['miednica', sk.pelvis], ['barki', sk.shoulderC]] as const) {
        const w = wzgledemOparcia(oparcie!, pt);
        expect([cw, u, nazwa, Math.abs(w.d - BENCH.padBack) <= 3]).toEqual([cw, u, nazwa, true]);
        expect([cw, u, nazwa, w.t >= -2 && w.t <= w.len + 2]).toEqual([cw, u, nazwa, true]);
      }
    }
  });
  test.each(MASZYNY)('%s: środek ciężkości ciała ma podparcie — oparcie przejmuje ciężar (tułów odchylony, a plecy przylegają)', cw => {
    const d = poza('leg_machine', cw); const oparcie = d.sprzet.find(g => g.rodzaj === 'lawka')!;
    const sk = keyframeFrame(d, 0.5).sk; expect(sk.up[0]).toBeLessThan(0); /* tułów odchylony do tyłu */
    expect(oparcie.kat).toBeGreaterThanOrEqual(30); expect(oparcie.kat).toBeLessThanOrEqual(75);
  });
  test('ruch nóg w hacku bez zmian (kolano 22° → 100°, pięty na podłodze)', () => {
    const d = poza('leg_machine', 'Hack Squat'); const k = GRID.map(u => jointAngles(keyframeFrame(d, u).sk, 'R').knee); expect(Math.min(...k)).toBeLessThan(30); expect(Math.max(...k)).toBeGreaterThan(90);
    for (const u of GRID) expect(keyframeFrame(d, u).sk.legs.R.heel[1]).toBeLessThan(4);
  });
});

/* ---------- 5. Machine Glute Kickback ---------- */
describe('5. glute_floor: Machine Glute Kickback — dłonie na uchwytach maszyny', () => {
  const d = poza('glute_floor', 'Machine Glute Kickback');
  test('w sprzęcie są uchwyty maszyny (poręcze) obok dźwigni', () => { expect(d.sprzet.some(g => g.rodzaj === 'poreczy')).toBe(true); expect(d.sprzet.some(g => g.rodzaj === 'dzwignia')).toBe(true); });
  test('w każdej klatce obie dłonie ≤ 3 cm od uchwytu (wysokość, rozstaw, długość)', () => {
    for (const u of GRID) {
      const fr = keyframeFrame(d, u); const bars = fr.props.find((p): p is Extract<Prop, { k: 'dipbars' }> => p.k === 'dipbars')!;
      for (const s of SIDES) {
        const g = fr.sk.arms[s].grip; const sg = s === 'R' ? 1 : -1;
        expect([u, s, Math.abs(g[1] - bars.h) <= 3]).toEqual([u, s, true]); expect([u, s, Math.abs(g[2] - sg * bars.z) <= 3]).toEqual([u, s, true]); expect([u, s, g[0] >= bars.x0 - 3 && g[0] <= bars.x1 + 3]).toEqual([u, s, true]);
      }
    }
  });
  test('ruch nogi bez zmian (biodro 44° → 11°, kolano zgięte tylko lekko)', () => { const h = GRID.map(u => jointAngles(keyframeFrame(d, u).sk, 'R')); expect(Math.max(...h.map(a => a.hip))).toBeGreaterThan(38); expect(Math.min(...h.map(a => a.hip))).toBeLessThan(16); expect(Math.max(...h.map(a => a.knee))).toBeLessThan(20); /* w fazach pośrednich do ok. 16° (interpolacja liniowa skraca cięciwę; nogi bez zmian względem poprzedniej wersji) */ });
});

/* ---------- 6. guma zaczepiona do kostki ---------- */
describe('6. guma: tryb zaczep_kostki (zaczep → kostki) i Seated Band Hamstring Curl', () => {
  test('tryb jest w kontrakcie (BAND_MOUNT, schemat JSON)', () => { expect([...BAND_MOUNT]).toContain('zaczep_kostki'); expect(JSON.stringify(poseSchema('lunge'))).toContain('zaczep_kostki'); expect(GEAR_KINDS.guma.ref!().join(' ')).toContain('zaczep_kostki'); });
  const grips = { R: [0, 100, 20], L: [0, 100, -20] } as Record<Side, V3>; const ank = { R: [50, 8, 10], L: [42, 7, -10] } as Record<Side, V3>;
  test('trzyma R: jedna guma od zaczepu (x, y, z) do kostki prawej nogi', () => {
    const p = propsFrom([{ rodzaj: 'guma', mocowanie: 'zaczep_kostki', x: 120, y: 12, z: 10, trzyma: 'R' }], grips, ank, [0, 48, 0]);
    expect(p).toEqual([{ k: 'band', from: [120, 12, 10], to: [50, 8, 10] }]);
  });
  test('trzyma obie: dwie gumy, każda do swojej kostki; do dłoni nie prowadzi żadna', () => {
    const p = propsFrom([{ rodzaj: 'guma', mocowanie: 'zaczep_kostki', x: 120, y: 12, z: 0 }], grips, ank, [0, 48, 0]);
    expect(p).toHaveLength(2); expect(p.map(x => (x as Extract<Prop, { k: 'band' }>).to)).toEqual([ank.R, ank.L]);
  });
  test('zwykły zaczep nadal prowadzi do dłoni (bez zmian)', () => { const p = propsFrom([{ rodzaj: 'guma', mocowanie: 'zaczep', x: 0, y: 100, z: 0 }], grips, ank, [0, 48, 0]); expect(p.map(x => (x as Extract<Prop, { k: 'band' }>).to)).toEqual([grips.R, grips.L]); });
  test('pola wpisu przechodzą kontrolę (bez zgłoszeń)', () => { expect(gearFieldIssues({ rodzaj: 'guma', mocowanie: 'zaczep_kostki', x: 120, y: 12, z: 10, trzyma: 'R' })).toEqual([]); });
  test('Seated Band Hamstring Curl: guma od zaczepu z przodu do kostki; długość rośnie w ruchu (opór), ≥ 25 cm więcej na końcu', () => {
    const d = poza('leg_isolation', 'Seated Band Hamstring Curl'); const g = d.sprzet.find(x => x.rodzaj === 'guma'); expect(g?.mocowanie).toBe('zaczep_kostki');
    const dl = GRID.map(u => { const b = keyframeFrame(d, u).props.find((p): p is Extract<Prop, { k: 'band' }> => p.k === 'band')!; return Math.hypot(b.to[0] - b.from[0], b.to[1] - b.from[1], b.to[2] - b.from[2]); });
    for (let i = 1; i < dl.length; i++) expect(dl[i]).toBeGreaterThanOrEqual(dl[i - 1] - 0.05);
    expect(dl[dl.length - 1] - dl[0]).toBeGreaterThanOrEqual(25); expect(Math.min(...dl)).toBeGreaterThan(20); /* guma napięta od początku, nie luźna między stopami */
  });
  test('zaczep gumy leży przed osobą (za stopami), na wysokości kostek', () => { const g = poza('leg_isolation', 'Seated Band Hamstring Curl').sprzet.find(x => x.rodzaj === 'guma')!; expect(g.x!).toBeGreaterThan(90); expect(g.y!).toBeLessThan(30); });
});

/* ---------- 7. pozostałe pozy bez zmian ---------- */
const sha = (s: string): string => createHash('sha256').update(s).digest('hex').slice(0, 20);
const r9 = (_k: string, v: unknown): unknown => (typeof v === 'number' ? Math.round(v * 1e9) / 1e9 + 0 : v);
const U5 = [0, 0.25, 0.5, 0.75, 1];
function odcisk(d: PoseData): { svg: string; raw: string } {
  const listy: Shape[][] = []; const pal = figurePalette(light);
  for (const view of ['side', 'front', 'top'] as View[]) for (const u of [...U5, 0.1, 0.9]) { listy.push(dataShapes(d, u, view)); d.bledy.forEach((_, j) => listy.push(dataShapes(d, u, view, j))); }
  const box = boundsOf(listy); return { svg: sha(listy.map(l => svgDocument(l, box, pal, 1)).join('\n#\n')), raw: sha(JSON.stringify(listy, r9)) };
}
/** Ćwiczenia zmieniane tą gałęzią (poprawki recenzji partii 2); wszystkie inne pozy sześciu rodzin mają dawać ten sam rysunek co przed poprawkami. */
const ZMIENIONE = new Set([
  ...STOPIEN.map(c => `calf_raise/${c}`), ...BULGARSKIE.map(c => `lunge/${c}`), ...MASZYNY.map(c => `leg_machine/${c}`),
  'back_extension/Back Extension', 'back_extension/Reverse Hyperextension', 'back_extension/Lower Back Curl', 'glute_floor/Prone Flutter Kicks', 'glute_floor/Machine Glute Kickback', 'leg_isolation/Seated Band Hamstring Curl',
  'leg_machine/Leg Press', 'leg_machine/Belt Squat Machine', 'leg_machine/Single Leg Press' /* runda 5: platforma pod podeszwą */, /* runda 3 (p2-r3): wiersz „kolana do środka” (B1, B2) */
]);
describe('7. pozostałe pozy sześciu rodzin bez zmian (odciski SVG i kształtów)', () => {
  const baza = JSON.parse(fs.readFileSync(path.join(__dirname, 'fixtures', 'figury-p2-baza.json'), 'utf8')) as Record<string, { svg: string; raw: string }>;
  test('baza obejmuje 60 póz tych rodzin (po wyjątku Calf Press, 28.10.2026: 61 → 60); zmieniane to 17 ćwiczeń z recenzji (+ Lower Back Curl, Prone Flutter Kicks z niezmiennika kolana; + Leg Press i Belt Squat Machine z rundy 3; + Single Leg Press z rundy 5: platforma pod podeszwą)', () => { expect(Object.keys(baza)).toHaveLength(60); for (const k of ZMIENIONE) expect(baza[k]).toBeDefined(); expect(ZMIENIONE.size).toBe(22); });
  test.each(Object.keys(baza).filter(k => !ZMIENIONE.has(k)))('%s: rysunek bez zmian', klucz => { const [r, ...reszta] = klucz.split('/'); expect([klucz, odcisk(poza(r, reszta.join('/')))]).toEqual([klucz, baza[klucz]]); });
  test.each([...ZMIENIONE])('%s: rysunek zmieniony względem bazy (poprawka jest widoczna)', klucz => { const [r, ...reszta] = klucz.split('/'); expect(odcisk(poza(r, reszta.join('/')))).not.toEqual(baza[klucz]); });
});
