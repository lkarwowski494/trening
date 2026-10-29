/*
 * Pakiet B linii 1.0.1 (29.10.2026), część 2: 101-07 Close Grip Bench Press, 101-08 Board Press i Pin Press.
 * L-056 A: każda poprawka figury ma dwie miary — naprawianą cechę ORAZ styk ciężar–ciało (odstęp, przenikanie; kadry co 0,05, `tests/helpers/styk-figur.ts`).
 * Wady „z main” (komentarz w V2_WSTRZYMANE): Band Bench Press — sztanga z talerzami i gumy do podłogi (katalog: guma z uchwytami przełożona pod ławką, bez sztangi);
 * Chain Press — rysunek identyczny z Bench Press with Chains (katalog: łańcuchy przypięte do uchwytów, ruch jak hantle, bez sztangi); Close Grip Bench Press — chwyt ±12 przy barkach ±19,
 * przedramię ok. 50° od pionu (karta: „na szerokość barków lub trochę węziej, nie bardzo wąsko”); Board/Pin Press — ŚREDNIE z main „bez deski i bolców”.
 */
import { distSegSeg, figureSpec, frameAt, shapesAt, sortShapes, jointAngles, checkFrame, holdChecks, BENCH, EQUIP, type Frame, type Prop, type V3 } from '@/lib/figures/v2';
import { dwieMiary, KADRY_STYKU } from './helpers/styk-figur';

const spec = (k: string) => figureSpec(k)!;
const fr = (k: string, u: number): Frame => frameAt(spec(k), u);
const props = <K extends Prop['k']>(f: Frame, k: K) => f.props.filter((p): p is Extract<Prop, { k: K }> => p.k === k);
const U = KADRY_STYKU;
const deg = (r: number) => r * 180 / Math.PI;
const forearm = (f: Frame, s: 'R' | 'L' = 'R') => { const a = f.sk.arms[s]; return { front: deg(Math.atan2(Math.abs(a.grip[2] - a.elbow[2]), Math.abs(a.grip[1] - a.elbow[1]))), sag: deg(Math.atan2(Math.abs(a.grip[0] - a.elbow[0]), Math.abs(a.grip[1] - a.elbow[1]))) }; };
const dist3 = (a: V3, b: V3) => Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);
/** Naprawiana cecha „sztanga w rysunku”: największa liczba gryfów w klatce. */
const gryfy = (k: string, kadry: readonly number[]) => Math.max(...kadry.map(u => props(fr(k, u), 'barbell').length));

describe('101-07 Close Grip Bench Press: chwyt wobec karty „na szerokość barków lub trochę węziej, nie bardzo wąsko” (na main: ±12 przy barkach ±19, przedramię ok. 50° od pionu)', () => {
  const K = 'Close Grip Bench Press'; const SH = BENCH.dims.shHalf;
  test('dwie miary: połowa rozstawu dłoni = 0,75–1,0 × połowa barków w każdym kadrze (cecha) oraz gryf nie przenika ciała, na dole dotyka klatki (styk: odstęp ≤ 3 cm)', () => {
    const m = dwieMiary(K, (k, kadry) => Math.min(...kadry.map(u => Math.abs(frameAt(spec(k), u).sk.arms.R.grip[2])))); /* najwęższy chwyt */
    expect(m.cecha / SH).toBeGreaterThanOrEqual(0.75); const wide = Math.max(...U.map(u => Math.abs(fr(K, u).sk.arms.R.grip[2]))); expect(wide / SH).toBeLessThanOrEqual(1.0);
    expect(m.styk.maxPrzenikanie).toBe(0); expect(m.styk.minOdstep).toBeLessThanOrEqual(3); expect(m.styk.minOdstep).toBeGreaterThanOrEqual(0);
  });
  test('chwyt: rozstaw dłoni węższy niż w zwykłym wyciskaniu, ale szerszy niż 0,9 × połowa barków (nie „bardzo wąsko”: na main 12/19 = 0,63)', () => {
    const z = (k: string) => Math.abs(fr(k, 1).sk.arms.R.grip[2]);
    expect(z(K)).toBeLessThan(z('Bench Press (sztanga)')); expect(z(K) / SH).toBeGreaterThan(0.9);
  });
  test('na dole przedramię ≤ 10° od pionu czołowo i strzałkowo, obie strony (na main ok. 50°); łokcie blisko tułowia (odwiedzenie ≤ 25°)', () => {
    for (const s of ['R', 'L'] as const) { const f = fr(K, 1); const t = forearm(f, s); const a = f.sk.arms[s]; const abd = deg(Math.atan2(Math.abs(a.elbow[2] - a.shoulder[2]), Math.abs(a.elbow[0] - a.shoulder[0])));
      expect([s, t.front <= 10, t.sag <= 12, abd <= 25]).toEqual([s, true, true, true]); }
  });
  test('w całym ruchu: chwyt stały (dłonie nie suną po gryfie: różnica ≤ 0,05 cm) i brak kolizji', () => {
    const z0 = Math.abs(fr(K, 0).sk.arms.R.grip[2]); for (const u of U) { expect([u, Math.abs(Math.abs(fr(K, u).sk.arms.R.grip[2]) - z0) <= 0.05]).toEqual([u, true]); expect([u, checkFrame(fr(K, u)).map(i => i.code)]).toEqual([u, []]); }
  });
});

describe('101-08 Board Press i Pin Press: deska na klatce i bolce w stojaku zamykają ŚREDNIE z main („bez deski i bolców”)', () => {
  test('Board Press — dwie miary: gryf na dole oparty na desce 4 cm (cecha: dno gryfu = góra deski ± 0,05) i odstęp gryfu od klatki o grubość deski większy niż w zwykłym wyciskaniu, bez przenikania (styk)', () => {
    const m = dwieMiary('Board Press', (k, kadry) => { const f = frameAt(spec(k), kadry[kadry.length - 1]); const b = props(f, 'board')[0]; return Math.abs(f.info.bar[1] - EQUIP.barR - (b.y + b.h)); });
    expect(m.cecha).toBeLessThanOrEqual(0.05);
    const zwykly = dwieMiary('Bench Press (sztanga)', gryfy).styk;
    expect(m.styk.maxPrzenikanie).toBe(0); expect(m.styk.minOdstep - zwykly.minOdstep).toBeGreaterThan(3.5); expect(m.styk.minOdstep - zwykly.minOdstep).toBeLessThan(4.5);
  });
  test('Pin Press — dwie miary: gryf nigdy niżej niż bolec i na dole na nim (cecha: dno gryfu − góra bolca ∈ [0; 0,05]) oraz bez przenikania ciała (styk)', () => {
    const m = dwieMiary('Pin Press', (k, kadry) => { const f = frameAt(spec(k), kadry[kadry.length - 1]); const r = props(f, 'rack')[0]; return f.info.bar[1] - EQUIP.barR - r.y; });
    expect(m.cecha).toBeGreaterThanOrEqual(0); expect(m.cecha).toBeLessThanOrEqual(0.05); expect(m.styk.maxPrzenikanie).toBe(0);
    for (const u of U) { const f = fr('Pin Press', u); expect([u, f.info.bar[1] - EQUIP.barR >= props(f, 'rack')[0].y - 0.05]).toEqual([u, true]); }
  });
  test('deska i bolce widoczne z boku i z góry; żadne inne wyciskanie ich nie ma (rysunek zamyka uwagę, nie zmienia innych ćwiczeń)', () => {
    for (const v of ['side', 'top'] as const) { expect([v, shapesAt(spec('Board Press'), 1, v).some(s => s.id === 'board')]).toEqual([v, true]); const ids = shapesAt(spec('Pin Press'), 1, v).map(s => s.id); expect([v, ids.includes('rackPost'), ids.includes('rackPin')]).toEqual([v, true, true]); }
    for (const k of ['Bench Press (sztanga)', 'Close Grip Bench Press', 'Reverse Band Bench Press', 'Chain Press']) { const f = fr(k, 1); expect([k, props(f, 'board').length, props(f, 'rack').length]).toEqual([k, 0, 0]); }
  });
});
