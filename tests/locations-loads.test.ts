/* P-003 E1 (B): osiągalne ciężary — lista z odznaczaniem, zakres jako skrót edytora, uchwyt/gryf + talerze, stacja elektryczna, kg/lb. */
import fc from 'fast-check';
import { achievable, plateSums, rangeValues, fillRange, nextHeavier, roundDown, hasLoad, sameLoad, toKg, sanitizeLoadSpec, specValues, type LoadSpec, type PlateEntry } from '@/lib/loads';
import { loadsFor, equipEntry } from '@/lib/equipment';
import { applyUnit, wIn } from '@/lib/units';
import { CATALOG } from '@/lib/catalog.generated';
import { userHome, loc, presetSpec } from './locations-fixtures';

const r = (xs: number[]) => xs.map(x => Math.round(x * 1000) / 1000);
/** Pełne przeliczenie (bez optymalizacji) do porównania z plateSums. */
function brute(base: number, plates: PlateEntry[], perStep: number): number[] {
  let sums = [0]; for (const p of plates) { const k = Math.floor(p.n / perStep); const nx: number[] = []; for (const s of sums) for (let i = 0; i <= k; i++) nx.push(s + 2 * i * p.w); sums = nx; }
  return [...new Set(sums.map(s => Math.round((base + s) * 1000)))].sort((a, b) => a - b).map(x => x / 1000);
}

describe('przypadki z dokumentu (sekcja 3.2)', () => {
  const hop: LoadSpec = { kind: 'plates', unit: 'kg', base: 1.5, plates: [{ w: 2.5, n: 4 }, { w: 1.25, n: 4 }, { w: 0.5, n: 4 }] };
  test('Hop-Sport 2×10 kg, para hantli: 1,5; 2,5; 4; 5; 6,5; 7,5; 9; 10', () => {
    expect(achievable(hop, { perStep: 4 })).toEqual([1.5, 2.5, 4, 5, 6.5, 7.5, 9, 10]);
  });
  test('Hop-Sport, jeden hantel (ćwiczenia jednorącz): 21 ciężarów do 18,5 kg', () => {
    const one = achievable(hop, { perStep: 2 }); expect(one).toHaveLength(21); expect(one[0]).toBe(1.5); expect(one[one.length - 1]).toBe(18.5);
  });
  test('sztanga 20 kg + po parze talerzy 25/20/15/10/5/2,5/1,25 = co 2,5 kg od 20 do 177,5', () => {
    const bar: LoadSpec = { kind: 'plates', unit: 'kg', base: 20, plates: [25, 20, 15, 10, 5, 2.5, 1.25].map(w => ({ w, n: 2 })) };
    expect(achievable(bar)).toEqual(r(rangeValues(20, 177.5, 2.5)));
  });
  test('brak talerzy → tylko uchwyt/gryf', () => {
    expect(achievable({ kind: 'plates', unit: 'kg', base: 20, plates: [] })).toEqual([20]);
    expect(achievable({ kind: 'plates', unit: 'kg', base: 20, plates: [{ w: 10, n: 1 }] })).toEqual([20]); /* jeden talerz nie wejdzie na dwie strony */
  });
  test('ViShape SmartGym Pro: 1,5–65 kg na stronę co 0,5 (128 wartości); dwie linki ×2', () => {
    const v = presetSpec('vishape_pro'); const one = achievable(v); expect(one).toHaveLength(128); expect(one[0]).toBe(1.5); expect(one[127]).toBe(65);
    expect(achievable(v, { mult: [2] })[0]).toBe(3); expect(achievable(v, { mult: [2] }).slice(-1)[0]).toBe(130);
  });
});

describe('lista i zakres', () => {
  test('odznaczony ciężar nie jest dostępny („odznaczyć kilogramy, których nie mam”)', () => {
    const l: LoadSpec = { kind: 'list', unit: 'kg', items: [{ w: 2, on: true }, { w: 4, on: false }, { w: 6, on: true }, { w: 6, on: true }] };
    expect(achievable(l)).toEqual([2, 6]);
  });
  test('zakres + krok to skrót edytora zapisywany jako lista; odznaczone zostają odznaczone, spoza zakresu znikają', () => {
    const items = fillRange([{ w: 4, on: false }, { w: 30, on: true }], 2, 24, 2)!;
    expect(items.map(x => x.w)).toEqual([2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24]); expect(items.find(x => x.w === 4)!.on).toBe(false); expect(items.filter(x => !x.on)).toHaveLength(1);
    expect(rangeValues(1.5, 3, 0.5)).toEqual([1.5, 2, 2.5, 3]); expect(rangeValues(0.1, 0.3, 0.1)).toEqual([0.1, 0.2, 0.3]); /* bez szumu 0,30000000000000004 */
    expect(rangeValues(5, 1, 1)).toEqual([]); expect(rangeValues(1, 5, 0)).toEqual([]); expect(rangeValues(1, 5, NaN)).toEqual([]);
  });
  test('najbliższy większy / zaokrąglenie w dół', () => {
    const L = [2, 4, 6, 24];
    expect(nextHeavier(L, 4)).toBe(6); expect(nextHeavier(L, 21)).toBe(24); expect(nextHeavier(L, 24)).toBeNull(); expect(nextHeavier(L, 32)).toBeNull(); expect(nextHeavier(L, 4.005)).toBe(6);
    expect(roundDown(L, 5.9)).toBe(4); expect(roundDown(L, 6.004)).toBe(6); expect(roundDown(L, 1)).toBeNull();
  });
});

describe('kg / lb', () => {
  afterEach(() => applyUnit('kg'));
  test('talerz 45 lb przechodzi przez to samo przyciąganie co wpis w polu (tolerancja 0,01 kg)', () => {
    applyUnit('lb');
    const bar: LoadSpec = { kind: 'plates', unit: 'lb', base: 45, plates: [{ w: 45, n: 2 }, { w: 25, n: 2 }] };
    const L = achievable(bar); expect(L).toEqual([45, 95, 135, 185].map(v => wIn(v) as number));
    for (const v of [45, 95, 135, 185]) expect(hasLoad(L, wIn(v) as number)).toBe(true);
    expect(toKg(45, 'lb')).toBe(wIn(45)); expect(toKg(20, 'kg')).toBe(20); expect(sameLoad(20.41, 20.415)).toBe(true); expect(sameLoad(20.41, 20.43)).toBe(false);
  });
});

describe('właściwości (fast-check)', () => {
  const plate = fc.record({ w: fc.constantFrom(0.5, 1, 1.25, 2, 2.5, 5, 10, 15, 20, 25), n: fc.integer({ min: 0, max: 6 }) });
  test('każdy wynik da się złożyć z talerzy (para na strony) — dokładnie zbiór z pełnego przeliczenia; posortowany, bez powtórzeń', () => {
    fc.assert(fc.property(fc.constantFrom(0, 1.5, 2, 3, 10, 20), fc.array(plate, { maxLength: 5 }), fc.constantFrom(2 as const, 4 as const), (base, plates, step) => {
      const got = plateSums(base, plates, step); expect(got).toEqual(brute(base, plates, step));
      for (let i = 1; i < got.length; i++) expect(got[i]).toBeGreaterThan(got[i - 1]);
      expect(got[0]).toBe(base);
    }), { numRuns: 300 });
  });
  test('para hantli (4 sztuki na krok) ⊆ jeden hantel (2 sztuki na krok)', () => {
    fc.assert(fc.property(fc.constantFrom(1.5, 2, 3), fc.array(plate, { maxLength: 4 }), (base, plates) => {
      const pair = plateSums(base, plates, 4), one = new Set(plateSums(base, plates, 2)); for (const v of pair) expect(one.has(v)).toBe(true);
    }), { numRuns: 200 });
  });
  test('achievable: rosnąco, odstępy > 0,01 kg; podpowiedź „najbliższy większy” ∈ dostępne i > obecny', () => {
    fc.assert(fc.property(fc.array(fc.record({ w: fc.double({ min: 0.5, max: 80, noNaN: true }), on: fc.boolean() }), { maxLength: 30 }), fc.constantFrom<'kg' | 'lb'>('kg', 'lb'), fc.double({ min: 0, max: 100, noNaN: true }), (items, unit, x) => {
      const L = achievable({ kind: 'list', unit, items });
      for (let i = 1; i < L.length; i++) expect(L[i] - L[i - 1]).toBeGreaterThan(0.01);
      const n = nextHeavier(L, x); if (n != null) { expect(hasLoad(L, n)).toBe(true); expect(n).toBeGreaterThan(x + 0.01); } else expect(L.every(v => v <= x + 0.0100001)).toBe(true);
      const d = roundDown(L, x); if (d != null) { expect(hasLoad(L, d)).toBe(true); expect(d).toBeLessThanOrEqual(x + 0.0100001); }
      expect(L.length).toBeLessThanOrEqual(new Set(items.filter(i => i.on).map(i => Math.round(i.w * 1000))).size);
    }), { numRuns: 300 });
  });
  test('zakres: pierwsza = min, każda ≤ max, krok stały; fillRange zapisuje listę o tej samej długości', () => {
    fc.assert(fc.property(fc.integer({ min: 1, max: 100 }), fc.integer({ min: 1, max: 100 }), fc.constantFrom(0.25, 0.5, 1, 1.25, 2, 2.5), (a, b, step) => { /* weryfikacja 2: wartości od 0,001 (0 kg odrzucane jak przy wczytaniu) */
      const min = Math.min(a, b) / 2, max = Math.max(a, b) / 2; const v = rangeValues(min, max, step);
      expect(v[0]).toBe(min); expect(v.every(x => x <= max + 1e-9)).toBe(true); for (let i = 1; i < v.length; i++) expect(Math.abs(v[i] - v[i - 1] - step)).toBeLessThan(1e-9);
      expect(fillRange([], min, max, step)).toHaveLength(v.length);
    }), { numRuns: 200 });
  });
  test('sanitizeLoadSpec: śmieci z importu → poprawny kształt albo undefined; poprawny opis bez zmian', () => {
    fc.assert(fc.property(fc.anything(), x => { const s = sanitizeLoadSpec(x); if (s) expect(() => specValues(s)).not.toThrow(); }), { numRuns: 300 });
    for (const s of [presetSpec('hopsport2x10'), presetSpec('gymtek24'), presetSpec('vishape_pro')]) expect(sanitizeLoadSpec(JSON.parse(JSON.stringify(s)))).toEqual(s);
    expect(sanitizeLoadSpec({ kind: 'list', items: [{ w: '12,5' }, { w: -1 }, null] })).toEqual({ kind: 'list', unit: 'kg', items: [{ w: 12.5, on: true }] });
  });
});

describe('ciężary ćwiczenia w miejscu (loadsFor)', () => {
  const ex = (n: string, loadMode: 'per_dumbbell' | 'total' | 'unilateral' = 'per_dumbbell') => ({ ...CATALOG[n], loadMode });
  test('hantle na talerze: ćwiczenie parą bierze listę pary, jednorącz — listę jednego hantla', () => {
    const e = equipEntry('db_plate'); e.load = presetSpec('hopsport2x10'); const L = loc('x', [e, equipEntry('bench_flat')]);
    expect(loadsFor(ex('Bench Press (hantle)'), L)).toEqual({ kind: 'loads', loads: [1.5, 2.5, 4, 5, 6.5, 7.5, 9, 10], item: 'db_plate' });
    const one = loadsFor(ex('One Arm Row (hantle)'), L); expect(one.kind === 'loads' && one.loads.length).toBe(21);
    const sum = loadsFor(ex('Deadlift (hantle)', 'total'), L); expect(sum.kind === 'loads' && sum.loads).toEqual([3, 5, 8, 10, 13, 15, 18, 20]); /* tryb „łącznie” + para = suma dwóch */
  });
  test('stacja elektryczna — decyzja 03.10.2026 „ViShape na stronę”: każde ćwiczenie (przysiad z pasem, dwie linki, jednorącz) — ciężary NA STRONĘ', () => {
    const h = userHome(); const perSide = achievable(presetSpec('vishape_pro'));
    for (const [n, m] of [['Przysiad z pasem (linki)', 'total'], ['Cable Fly', 'total'], ['Cable Lateral Raise', 'total'], ['RDL (hantle/linki)', 'per_dumbbell']] as const) {
      const r = loadsFor(ex(n, m), loc('vs', h.equipment.filter(e => e.item !== 'db_fixed'))); expect(r).toEqual({ kind: 'loads', loads: perSide, item: 'electric' }); }
    const belt = loadsFor(ex('Przysiad z pasem (linki)', 'total'), h); expect(belt.kind === 'loads' && [belt.loads[0], belt.loads.slice(-1)[0], hasLoad(belt.loads, 45)]).toEqual([1.5, 65, true]);
  });
  test('RDL (hantle/linki): w domu z hantlami — hantle; bez hantli — linki stacji', () => {
    const h = userHome([4, 8, 12, 16, 20, 24]);
    expect(loadsFor(ex('RDL (hantle/linki)'), h)).toEqual({ kind: 'loads', loads: [4, 8, 12, 16, 20, 24], item: 'db_fixed' });
    const noDb = loc('x', h.equipment.filter(e => e.item !== 'db_fixed')); const r2 = loadsFor(ex('RDL (hantle/linki)'), noDb); expect(r2.kind === 'loads' && r2.item).toBe('electric');
  });
  test('przyrząd bez wpisanych ciężarów → „nieznane”; brak przyrządu → „brak”; maszyna bierze stos pozycji spełniającej wymaganie', () => {
    expect(loadsFor(ex('Bench Press (hantle)'), userHome([])).kind).toBe('unknown');
    expect(loadsFor(ex('Walking Lunges'), loc('pusto', [])).kind).toBe('none');
    expect(loadsFor(ex('Pull Up'), userHome()).kind).toBe('unknown'); /* masa ciała — bez listy */
    const lp = equipEntry('leg_press'); lp.load = { kind: 'list', unit: 'kg', items: [100, 120, 140].map(w => ({ w, on: true })) };
    const le = equipEntry('leg_ext'); le.load = { kind: 'list', unit: 'kg', items: [5, 10].map(w => ({ w, on: true })) };
    expect(loadsFor(ex('Leg Press', 'total'), loc('g', [le, lp]))).toEqual({ kind: 'loads', loads: [100, 120, 140], item: 'leg_press' });
    expect(loadsFor(ex('Leg Extension', 'total'), loc('g', [le, lp]))).toEqual({ kind: 'loads', loads: [5, 10], item: 'leg_ext' });
  });
});
