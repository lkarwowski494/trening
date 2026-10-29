/*
 * A1 (zadanie 1.0.1 pakiet A, 29.10.2026; L-056 A, decyzja właściciela): miara styku ciężar–ciało (odstęp i przenikanie) na kadrach co 0,05 oraz pomocnik „dwie miary”
 * (tests/helpers/styk-figur.ts) — dla rodzin squat, bench_press i hinge. Ten plik NIE zmienia rigu: pokazuje, że miara odtwarza problem z L-056 na stanie sprzed 101-02
 * (martwe ciągi z podłogi: gryf nad kolanem do kilku cm przed udami przy wskazówce dl.close „Prowadź sztangę blisko nóg”).
 */
import { figureSpec, frameAt, EQUIP } from '@/lib/figures/v2';
import { KADRY_STYKU, stykKlatki, stykTora, podsumujStyk, dwieMiary, elementyCiezaru } from './helpers/styk-figur';

/** 11 martwych ciągów wstrzymanych w 1.0 (DL_ODSTEP w lib/figures/v2/figure.ts). */
const DL_ODSTEP_KLUCZE = ['Deadlift (sztanga)', 'Axle Deadlift', 'Deadlift with Bands', 'Deadlift with Chains', 'Deficit Deadlift', 'Rack Pull', 'Rack Pull with Bands',
  'Reverse Band Deadlift', 'Cable Deadlift', 'Clean Deadlift', 'Snatch Deadlift'];

describe('A1: kadry i miara potrafi paść', () => {
  test('kadry co 0,05: 21 wartości od 0 do 1', () => {
    expect(KADRY_STYKU).toHaveLength(21); expect(KADRY_STYKU[0]).toBe(0); expect(KADRY_STYKU[1]).toBe(0.05); expect(KADRY_STYKU[20]).toBe(1);
  });
  test('gryf odsunięty od nóg o X cm zwiększa odstęp o X, a wsunięty w nogę daje przenikanie równe wsunięciu', () => {
    const f = frameAt(figureSpec('Deadlift (sztanga)')!, 0); const s0 = stykKlatki(f);
    expect(s0.przenikanie).toBe(0); expect(s0.odstep).toBeGreaterThan(0); expect(s0.czesc).toMatch(/podudzie/);
    const przesun = (dx: number) => ({ ...f, props: f.props.map(p => p.k === 'barbell' ? { ...p, c: [p.c[0] + dx, p.c[1], p.c[2]] as [number, number, number] } : p) });
    expect(stykKlatki(przesun(10)).odstep - s0.odstep).toBeCloseTo(10, 0);
    const wsuniety = stykKlatki(przesun(-(s0.odstep + 3)));
    expect(wsuniety.przenikanie).toBeCloseTo(3, 0); expect(wsuniety.odstep).toBeLessThan(0);
  });
  test('elementy ciężaru: gryf = 1 kapsuła o promieniu gryfu, hantle = 2, kettlebell = 1, linka (uchwyt) = punkt 2 cm', () => {
    const el = (k: string) => elementyCiezaru(frameAt(figureSpec(k)!, 0.5));
    expect(el('Deadlift (sztanga)')).toHaveLength(1); expect(el('Deadlift (sztanga)')[0].r).toBe(EQUIP.barR);
    expect(el('Deadlift (hantle)')).toHaveLength(2); expect(el('Sumo Deadlift (kettlebell)')).toHaveLength(1);
    expect(el('Single Leg RDL (linki)')).toEqual([{ a: expect.any(Array), b: expect.any(Array), r: expect.any(Number) }]);
  });
});

describe('A1: pomocnik działa dla wszystkich trzech gotowych rodzin (squat, bench_press, hinge), bez zależności od rigu hinge', () => {
  test.each([['Back Squat', 'squat'], ['Bench Press (sztanga)', 'bench_press'], ['Deadlift (sztanga)', 'hinge']])('%s (%s): 21 kadrów, skończone liczby, przenikanie ≤ 0,5 cm', k => {
    const s = stykTora(k); expect(s).toHaveLength(21);
    for (const x of s) expect([k, x.u, Number.isFinite(x.odstep)]).toEqual([k, x.u, true]);
    expect(podsumujStyk(s).maxPrzenikanie).toBeLessThanOrEqual(0.5);
  });
  test('dwieMiary: zwraca naprawianą cechę i styk razem (cecha = wysokość gryfu na końcu)', () => {
    const m = dwieMiary('Back Squat', (k, kadry) => frameAt(figureSpec(k)!, kadry[kadry.length - 1]).info.load[1]);
    expect(m.cecha).toBeGreaterThan(0); expect(m.styk.maxOdstep).toBeGreaterThanOrEqual(m.styk.minOdstep); expect(m.styk.maxPrzenikanie).toBeGreaterThanOrEqual(0);
  });
});

describe('A1: odtworzenie L-056 na stanie sprzed 101-02 — martwe ciągi z podłogi (liczby pomiaru, powierzchnia nogi jak na rysunku)', () => {
  const POM = DL_ODSTEP_KLUCZE.map(k => ({ k, ...podsumujStyk(stykTora(k)) }));
  test('11 ćwiczeń: gryf odchodzi od nóg do ponad 6 cm (wskazówka dl.close: „blisko nóg”), a największy odstęp wypada między kadrami 0,5 a 0,9 (nad kolanem)', () => {
    expect(POM).toHaveLength(11);
    for (const p of POM) { expect([p.k, p.maxOdstep > 6]).toEqual([p.k, true]); expect([p.k, p.uMaxOdstep >= 0.5 && p.uMaxOdstep <= 0.9]).toEqual([p.k, true]); }
  });
  test('Deadlift (sztanga): największy odstęp 7,2 cm przy u = 0,75 (arkusz L-050 miał 5 kadrów u = 0 / 0,25 / 0,5 / 0,75 / 1; maksimum wypada u = 0,75 i kadry co 0,05 je łapią)', () => {
    const s = stykTora('Deadlift (sztanga)'); const p = podsumujStyk(s);
    expect(+p.maxOdstep.toFixed(1)).toBe(7.2); expect(p.uMaxOdstep).toBe(0.75);
    expect(p.maxPrzenikanie).toBe(0);
  });
});
