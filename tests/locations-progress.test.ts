/* P-003 E1 (F): podpowiedź progresji z ciężarów dostępnych w miejscu + bramka 10% (decyzja 7b), wykroki bez hantli (4a). */
import fc from 'fast-check';
import * as store from '@/lib/store';
import { loadsFor, equipEntry } from '@/lib/equipment';
import { hasLoad } from '@/lib/loads';
import { applyUnit, wIn } from '@/lib/units';
import { fresh, ex, set } from './helpers';
import { userHome, loc } from './locations-fixtures';

/** Miejsce w store (główne). */
function place(l = userHome([2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24])) { const s = store.getState().settings; s.locations = [l]; s.mainLocationId = l.id; store.save(); return l; }
const sets = (w: number, reps: number[], bw = false) => reps.map(r => set(bw ? { addKg: w, reps: r } : { weight: w, reps: r }));

describe('bez miejsc — jak przed P-003', () => {
  test('hantle +1 kg, sztanga +2,5 kg; locationId nieistniejącego miejsca niczego nie zmienia', async () => {
    await fresh();
    expect(store.progressionFor(ex('Bench Press (hantle)'), 8, sets(24, [8, 8, 8]))).toEqual({ kind: 'load', kg: 25 });
    expect(store.progressionFor(ex('Back Squat'), 5, sets(60, [5, 5]), 'nope')).toEqual({ kind: 'load', kg: 62.5 });
  });
});

describe('z miejscem (decyzja 7b)', () => {
  test('↑ = najbliższy większy DOSTĘPNY ciężar (skok ≤ 10%)', async () => {
    await fresh(); const h = place();
    expect(store.progressionFor(ex('Bench Press (hantle)'), 8, sets(22, [8, 8, 8]), h.id)).toEqual({ kind: 'load', kg: 24 }); /* 9,1% */
    expect(store.progressionFor(ex('Bench Press (hantle)'), 8, sets(21, [8, 8]), h.id)).toEqual({ kind: 'load', kg: 22 }); /* wpisane 21 spoza listy — do najbliższego większego */
  });
  test('skok > 10%: najpierw „ten sam ciężar, górna granica + 2”, po zrobieniu na wszystkich seriach — ↑ ciężar', async () => {
    await fresh(); const h = place(); const db = ex('Biceps Curl (hantle)');
    expect(store.progressionFor(db, 12, sets(10, [12, 12, 12]), h.id)).toEqual({ kind: 'reps', reps: 14, gate: true }); /* 10 → 12 = 20% */
    expect(store.progressionFor(db, 12, sets(10, [14, 13, 14]), h.id)).toEqual({ kind: 'reps', reps: 14, gate: true }); /* R = najmniejsza */
    expect(store.progressionFor(db, 12, sets(10, [14, 14, 15]), h.id)).toEqual({ kind: 'load', kg: 12 });
  });
  test('lekkie hantle i zakres o równych granicach (15–15): 4 → 6 kg to 50% — cel 17 powt., nie 38 (odrzucona bramka Epleya)', async () => {
    await fresh(); const h = place();
    expect(store.progressionFor(ex('Lateral Raise (hantle)'), 15, sets(4, [15, 15, 15]), h.id)).toEqual({ kind: 'reps', reps: 17, gate: true });
    expect(store.progressionFor(ex('Lateral Raise (hantle)'), 15, sets(4, [17, 17, 17]), h.id)).toEqual({ kind: 'load', kg: 6 });
  });
  test('sztanga 60 → 62,5 (4,2%) od razu', async () => {
    await fresh(); const bar = equipEntry('barbell'); bar.load = { kind: 'plates', unit: 'kg', base: 20, plates: [25, 20, 15, 10, 5, 2.5, 1.25].map(w => ({ w, n: 2 })) }; const g = place(loc('Siłownia', [bar, equipEntry('rack')]));
    expect(store.progressionFor(ex('Back Squat'), 5, sets(60, [5, 5, 5]), g.id)).toEqual({ kind: 'load', kg: 62.5 });
  });
  test('poprzedni ciężar ≥ największy dostępny (32 kg z siłowni, w domu max 24) → bez „↑”', async () => {
    await fresh(); const h = place();
    expect(store.progressionFor(ex('Bench Press (hantle)'), 8, sets(32, [8, 8]), h.id)).toBeNull();
    expect(store.progressionFor(ex('Bench Press (hantle)'), 8, sets(24, [8, 8]), h.id)).toBeNull();
  });
  test('4a: wykroki w miejscu bez hantli — podpowiedź w powtórzeniach; ciężar z innego miejsca — bez „↑”', async () => {
    await fresh(); const bw = place(loc('Park', []));
    expect(store.progressionFor(ex('Walking Lunges'), 12, sets(0, [12, 12]), bw.id)).toEqual({ kind: 'reps', reps: 13 });
    expect(store.progressionFor(ex('Walking Lunges'), 12, sets(10, [12, 12]), bw.id)).toBeNull();
  });
  test('przyrząd bez wpisanych ciężarów → podpowiedź jak przed P-003 (+1 kg)', async () => {
    await fresh(); const h = place(userHome([]));
    expect(store.progressionFor(ex('Bench Press (hantle)'), 8, sets(24, [8, 8]), h.id)).toEqual({ kind: 'load', kg: 25 });
  });
  test('masa ciała (dociążenie) — bez zmian; przysiad z pasem na ViShape: 45 → 45,5 (krok 0,5 na stronę, jedna lub dwie linki)', async () => {
    await fresh(); const h = place();
    expect(store.progressionFor(ex('Pull Up'), 8, sets(5, [8, 8], true), h.id)).toEqual({ kind: 'load', kg: 7.5 });
    expect(store.progressionFor(ex('Przysiad z pasem (linki)'), 8, sets(45, [8, 8, 8, 8]), h.id)).toEqual({ kind: 'load', kg: 45.5 });
  });
  test('wyłączona podpowiedź progresji w Ustawieniach — nic', async () => {
    await fresh(); const h = place(); store.getState().settings.progressHint = false;
    expect(store.progressionFor(ex('Bench Press (hantle)'), 8, sets(22, [8, 8]), h.id)).toBeNull();
  });
  test('niezmiennik: podpowiedziany ciężar ∈ dostępne ciężary miejsca (także w lb, tolerancja 0,01 kg)', async () => {
    await fresh();
    fc.assert(fc.property(fc.uniqueArray(fc.integer({ min: 1, max: 120 }), { minLength: 1, maxLength: 20 }), fc.integer({ min: 1, max: 130 }), fc.integer({ min: 5, max: 15 }), fc.constantFrom<'kg' | 'lb'>('kg', 'lb'), (raw, prev, repMax, unit) => {
      applyUnit(unit); store.getState().settings.unit = unit;
      const list = raw.map(x => x / 2); const db = equipEntry('db_fixed'); db.load = { kind: 'list', unit, items: list.map(w => ({ w, on: true })) };
      const l = place(loc('X', [db, equipEntry('bench_flat')])); const e = ex('Bench Press (hantle)'); const L = loadsFor(e, l); if (L.kind !== 'loads') throw new Error('loads');
      const top = unit === 'lb' ? wIn(prev / 2) as number : prev / 2;
      const p = store.progressionFor(e, repMax, sets(top, [repMax + 2, repMax + 2]), l.id);
      if (p?.kind === 'load') { expect(hasLoad(L.loads, p.kg)).toBe(true); expect(p.kg).toBeGreaterThan(top); }
      else if (p) expect(p).toEqual({ kind: 'reps', reps: repMax + 2, gate: true });
      else expect(L.loads.every(v => v <= top + 0.0100001)).toBe(true);
    }), { numRuns: 150 });
    applyUnit('kg'); store.getState().settings.unit = 'kg';
  });
});
