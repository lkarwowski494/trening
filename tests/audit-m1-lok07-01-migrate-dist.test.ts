/*
 * M2-LOK07-01: migracja zapisuje dystans z dokładnością do 2 miejsc (cm) zamiast pełnych metrów — powód: dryf yardów (428 z 5000 wartości yd wracało do pola jako inna liczba
 * przy zaokrągleniu do pełnych metrów). Dane całkowite (wszystkie wydane buildy) bez zmian; ponowna migracja nic nie zmienia (idempotencja).
 */
import * as fs from 'fs';
import * as path from 'path';
import * as store from '@/lib/store';

const DIR = path.join(__dirname, 'fixtures', 'released');
const FILES = fs.readdirSync(DIR).filter(f => f.endsWith('.json')).sort();
const dists = (st: any): unknown[] => [...st.workouts, ...(st.active ? [st.active] : []), ...st.templates.map((t: any) => ({ exercises: [], rows: t.items.flatMap((i: any) => i.rows ?? []) }))]
  .flatMap((w: any) => [...(w.exercises ?? []).flatMap((e: any) => e.sets.map((s: any) => s.distanceM)), ...(w.rows ?? []).map((r: any) => r.distanceM)]);

describe.each(FILES)('wydany zapis %s', f => {
  const fx = JSON.parse(fs.readFileSync(path.join(DIR, f), 'utf8'));
  test('dystanse całkowite bez zmian po migracji; migracja idempotentna', () => {
    const before = dists(fx.state); const m1 = store.migrate(JSON.parse(JSON.stringify(fx.state)));
    expect(dists(m1)).toEqual(before.map(v => v === '' || v == null ? '' : v)); /* puste zostają puste, liczby 1:1 */
    expect(store.migrate(JSON.parse(JSON.stringify(m1)))).toEqual(m1);
  });
});
test('dystans ułamkowy: 91,44 m zostaje (cm), 91,4449 → 91,44; ujemny → 0; tekst „91,44” z importu → 91,44; seria w treningu i w historii', async () => {
  const { fresh, addWorkout } = require('./helpers');
  await fresh(); addWorkout(Date.now() - 864e5, [['Bieg', [{ distanceM: 91.44, durationSec: 30 }, { distanceM: 91.4449, durationSec: 30 }, { distanceM: -5, durationSec: 30 }, { distanceM: '91,44', durationSec: 30 }]]]);
  const m = store.migrate(JSON.parse(JSON.stringify(store.getState()))); const v = m.workouts[m.workouts.length - 1].exercises[0].sets.map((s: any) => s.distanceM);
  expect(v).toEqual([91.44, 91.44, 0, 91.44]); expect(store.migrate(JSON.parse(JSON.stringify(m)))).toEqual(m);
});
