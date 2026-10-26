/* Test na telefonie, build 1030 (23.10.2026): przy jednostkach imperialnych eksport CSV miał kolumny „Weight” i „Distance” bez jednostki (ciężar w lb, dystans w metrach) —
 * plik nie mówił, w czym są liczby. Decyzja: nagłówek 12 kolumn zgodny z popularnymi dziennikami zostaje bez zmian (kg — jak dotąd, plik bajt w bajt), a przy lb/imperialnych
 * dochodzą dwie kolumny na końcu: „Weight Unit” (lb) i „Distance Unit” (m), wartość w każdym wierszu. Import własnego pliku czyta jednostkę z kolumny. */
import * as store from '@/lib/store';
import { buildCsv } from '@/lib/backup';
import { parseImport } from '@/lib/csvparse';
import { applyUnit, snapLb } from '@/lib/units';
import { fresh, addWorkout } from './helpers';

const HEAD12 = 'Date,Workout Name,Duration,Exercise Name,Set Order,Weight,Reps,Distance,Seconds,Notes,Workout Notes,RPE';
afterEach(() => { applyUnit('kg'); });
const NOW = new Date(2026, 9, 23, 12).getTime();
async function withData(unit: 'kg' | 'lb') {
  await fresh(); addWorkout(NOW - 3600e3, [['Back Squat', [{ weight: 100, reps: 5 }, { weight: 61.23, reps: 8 }]]]);
  store.getState().settings.unit = unit; store.applyPrefs();
}

describe('eksport CSV: jednostka ciężaru i dystansu', () => {
  test('kg: nagłówek i wiersze dokładnie jak dotąd (12 kolumn), bez kolumn jednostek', async () => {
    await withData('kg'); const rows = buildCsv().trim().split('\n');
    expect(rows[0]).toBe(HEAD12); for (const r of rows) expect(r.split(',')).toHaveLength(12);
  });
  test('lb: te same 12 kolumn + „Weight Unit”, „Distance Unit”; w każdym wierszu lb i m; ciężar w lb', async () => {
    await withData('lb'); const rows = buildCsv().trim().split('\n');
    expect(rows[0]).toBe(HEAD12 + ',Weight Unit,Distance Unit'); expect(rows).toHaveLength(3);
    for (const r of rows.slice(1)) { const c = r.split(','); expect(c).toHaveLength(14); expect(c[12]).toBe('lb'); expect(c[13]).toBe('m'); }
    expect(rows[1].split(',')[5]).toBe('220.5'); /* 100 kg = 220,5 lb */
  });
  test('import własnego pliku w lb: jednostka z kolumny (picker niepotrzebny), ciężar wraca w kg niezależnie od ustawienia', async () => {
    await withData('lb'); const f = parseImport(buildCsv(), NOW + 1e6);
    expect(f.format).toBe('formatA'); expect(f.weightUnit).toBe('kg'); /* 'kg' = wartości już przeliczone */
    const w = f.sessions[0].exercises.flatMap(e => e.sets.map(s => s.weight)); expect(w).toEqual([snapLb(220.5), snapLb(135)]);
  });
  test('import: plik w kg z kolumnami jednostek bez przeliczenia; bez kolumn jak dotąd (wybór użytkownika, weightUnit null)', async () => {
    const head = HEAD12 + ',Weight Unit,Distance Unit';
    const kg = `${head}\n2026-10-20 10:00:00,T,30m,Back Squat,1,100,5,0,0,,,,kg,m\n`; expect(parseImport(kg, NOW).weightUnit).toBe('kg'); expect(parseImport(kg, NOW).sessions[0].exercises[0].sets[0].weight).toBe(100);
    const plain = `${HEAD12}\n2026-10-20 10:00:00,T,30m,Back Squat,1,100,5,0,0,,,\n`; expect(parseImport(plain, NOW).weightUnit).toBeNull();
  });
  test('import: jednostki mieszane albo nieznane w wierszach — nie zgadujemy: wybór użytkownika (weightUnit null), wartości bez zmian', () => {
    const head = HEAD12 + ',Weight Unit,Distance Unit';
    const mixed = `${head}\n2026-10-20 10:00:00,T,30m,Back Squat,1,100,5,0,0,,,,kg,m\n2026-10-20 10:00:00,T,30m,Back Squat,2,200,5,0,0,,,,lb,m\n`;
    const f = parseImport(mixed, NOW); expect(f.weightUnit).toBeNull(); expect(f.sessions[0].exercises[0].sets.map(s => s.weight)).toEqual([100, 200]);
    const unknown = `${head}\n2026-10-20 10:00:00,T,30m,Back Squat,1,100,5,0,0,,,,stone,m\n`; expect(parseImport(unknown, NOW).weightUnit).toBeNull();
  });
});
