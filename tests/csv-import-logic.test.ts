/*
 * Import historii z CSV (11.10.2026): parser formatA/formatB, błędy, jednostki, dopasowanie nazw, duplikaty, zapis przez migrate,
 * idempotencja, bezpieczeństwo danych i wydajność dużego pliku. Pliki testowe: tests/fixtures/import-*.csv (własne, fikcyjne dane).
 */
import * as fs from 'fs';
import * as path from 'path';
import * as store from '@/lib/store';
import * as FS from 'expo-file-system/legacy';
import { parseCsv, parseImport, detectFormat, parseDurationA, parseTimeB, normName, matchExercise, indexExercises, analyze, buildImport, isImportError,
  IMPORT_MAX_ROWS, IMPORT_MAX_CHARS, ImportError, isDuplicate } from '@/lib/csvparse';
import { commitCsvImport, pickCsv } from '@/lib/csvimport';
import { localISODate } from '@/lib/store';
import { KG_PER_LB } from '@/lib/units';
import { fresh, addWorkout } from './helpers';

const fx = (n: string) => fs.readFileSync(path.join(__dirname, 'fixtures', n), 'utf8');
const A = fx('import-formatA.csv'), B = fx('import-formatB.csv');
const HA = 'Date,Workout Name,Duration,Exercise Name,Set Order,Weight,Reps,Distance,Seconds,Notes,Workout Notes,RPE';
const NOW = new Date(2026, 9, 11, 12).getTime();
const code = (f: () => unknown) => { try { f(); } catch (e) { return isImportError(e) ? e.code : 'inny:' + String(e); } return 'brak błędu'; };

describe('CSV: parser', () => {
  test('parseCsv: cudzysłowy, przecinek i "" w polu, nowa linia w polu, CRLF, brak końcowej nowej linii, BOM w parseImport', () => {
    expect(parseCsv('a,"b,c","d ""x"""\r\n1,"l1\nl2",3')).toEqual([['a', 'b,c', 'd "x"'], ['1', 'l1\nl2', '3']]);
    expect(parseCsv('')).toEqual([]); expect(parseCsv('\n\n')).toEqual([]);
    expect(parseImport('﻿' + A, NOW).format).toBe('formatA');
  });
  test('detectFormat: oba nagłówki, obcy i pusty', () => {
    expect(detectFormat(HA.split(','))).toBe('formatA'); expect(detectFormat(fx('import-formatB.csv').split('\n')[0].split(','))).toBe('formatB');
    expect(detectFormat(['Imię', 'Nazwisko'])).toBeNull(); expect(detectFormat([])).toBeNull();
  });
  test('parseDurationA / parseTimeB: formaty z dokumentacji, błędne = null', () => {
    expect(parseDurationA('52m')).toBe(3120); expect(parseDurationA('1h 5m')).toBe(3900); expect(parseDurationA('1h')).toBe(3600); expect(parseDurationA('')).toBeNull(); expect(parseDurationA('abc')).toBeNull();
    expect(parseTimeB('01:01:01')).toBe(3661); expect(parseTimeB('23:59')).toBe(23 * 60 + 59); expect(parseTimeB('')).toBe(0); expect(parseTimeB('xx')).toBeNull();
  });
  test('formatA (plik testowy): 3 treningi, grupowanie po (data, nazwa), serie robocze/drop/do upadku, wiersz przerwy pominięty, cudzysłowy w nazwie', () => {
    const f = parseImport(A, NOW); expect(f.format).toBe('formatA'); expect(f.weightUnit).toBeNull(); expect(f.badRows).toBe(0); expect(f.sessions).toHaveLength(3);
    const [s1, s2, s3] = f.sessions;
    expect(s1.name).toBe('Push A'); expect(s1.durationSec).toBe(3120); expect(s1.note).toBe('Dobry dzień'); expect(s1.dateOnly).toBe(false);
    expect(s1.startedAt).toBe(new Date(2026, 2, 2, 18, 5, 0).getTime());
    expect(s1.exercises.map(e => [e.name, e.sets.length])).toEqual([['Bench Press (Barbell)', 3], ['Fikcyjny Wyciąg Testowy', 1], ['Plank', 1]]); /* Rest Timer nie jest serią */
    expect(s1.exercises[0].sets.map(s => s.kind)).toEqual(['normal', 'normal', 'drop']);
    expect(s1.exercises[0].sets[1]).toMatchObject({ weight: 62.5, reps: 6, rpe: 8, note: 'ciężko, ale ok' });
    expect(s1.exercises[2].sets[0]).toMatchObject({ durationSec: 60, reps: 0 });
    expect(s2.name).toBe('Nogi, "B"'); expect(s2.durationSec).toBe(3900); expect(s2.exercises[0].sets.map(s => s.kind)).toEqual(['normal', 'failure']);
    expect(s3.durationSec).toBe(3600);
  });
  test('formatB (plik testowy): dzień = trening, kg i lbs, dystans z jednostką, czas, sam dzień bez godziny', () => {
    const f = parseImport(B, NOW); expect(f.format).toBe('formatB'); expect(f.weightUnit).toBe('kg'); expect(f.sessions).toHaveLength(2);
    const [d1, d2] = f.sessions; expect(d1.dateOnly).toBe(true); expect(d1.startedAt).toBe(new Date(2025, 10, 3, 12).getTime());
    expect(d1.exercises[0].sets.map(s => s.weight)).toEqual([80, 82.5]); expect(d1.exercises[0].sets[1].note).toBe('seria, z przecinkiem');
    expect(d1.exercises[1].sets[0]).toMatchObject({ distanceM: 5000, durationSec: 1530 });
    expect(d2.exercises[0].sets[0].weight).toBeCloseTo(225 * KG_PER_LB, 0); expect(d2.exercises[0].sets[0].weight).toBeCloseTo(102.06, 1); /* funty → kg (snapLb) */
    expect(d2.exercises[1].sets[0].durationSec).toBe(3661);
  });
  test('błędy: pusty, obcy nagłówek, sam nagłówek, wszystkie wiersze złe, za duży plik/za dużo wierszy', () => {
    expect(code(() => parseImport('', NOW))).toBe('empty'); expect(code(() => parseImport(fx('import-obcy.csv'), NOW))).toBe('format');
    expect(code(() => parseImport(HA, NOW))).toBe('rows'); expect(code(() => parseImport(HA + '\nzła data,X,,Y,1,1,1,0,0,,,', NOW))).toBe('rows');
    expect(code(() => parseImport('x'.repeat(IMPORT_MAX_CHARS + 1), NOW))).toBe('toolarge');
    expect(code(() => parseImport(HA + '\n'.repeat(1) + (',\n').repeat(0) + Array(IMPORT_MAX_ROWS + 2).fill('a,b').join('\n'), NOW))).toBe('toolarge');
    expect(code(() => parseImport('{"format":"trening-backup"}', NOW))).toBe('format');
  });
  test('złe wiersze są pomijane i liczone: zła data, data z przyszłości, 30 lutego, godzina 25, ujemne powtórzenia, tekst zamiast liczby, pusta nazwa ćwiczenia, ciężar 99999', () => {
    const rows = ['2026-03-02 10:00:00,T,,Ok,1,50,5,0,0,,,', 'jutro,T,,X,1,50,5,0,0,,,', '2027-12-01 10:00:00,T,,X,1,50,5,0,0,,,', '2026-02-30 10:00:00,T,,X,1,50,5,0,0,,,',
      '2026-03-02 25:00:00,T,,X,1,50,5,0,0,,,', '2026-03-02 10:00:00,T,,X,1,50,-5,0,0,,,', '2026-03-02 10:00:00,T,,X,1,abc,5,0,0,,,', '2026-03-02 10:00:00,T,,,1,50,5,0,0,,,',
      '2026-03-02 10:00:00,T,,X,1,99999,5,0,0,,,', '2026-03-02 10:00:00,T,,X,Z,50,5,0,0,,,', '1980-01-01 10:00:00,T,,X,1,50,5,0,0,,,'];
    const f = parseImport([HA, ...rows].join('\n'), NOW); expect(f.sessions).toHaveLength(1); expect(f.sessions[0].exercises.map(e => e.name)).toEqual(['Ok']); expect(f.badRows).toBe(10);
  });
  test('liczby: przecinek dziesiętny, puste pola; formuły z eksportu (apostrof) odwrócone; nazwa treningu przycięta', () => {
    const f = parseImport([HA, "2026-03-02 10:00:00,T,,Ex,1,\"52,5\",5,0,0,'=cmd,,", `2026-03-03 10:00:00,${'N'.repeat(200)},,Ex,1,,5,0,0,,,`].join('\n'), NOW);
    expect(f.sessions[0].exercises[0].sets[0]).toMatchObject({ weight: 52.5, note: '=cmd' }); expect(f.sessions[1].name.length).toBeLessThanOrEqual(80); expect(f.sessions[1].exercises[0].sets[0].weight).toBeNull();
  });
  test('formatB: jednostki dystansu (m, km, cm, in, ft, yd, mi) i nieznana jednostka = wiersz pominięty', () => {
    const h = 'Date,Exercise,Category,Weight (kg),Weight (lbs),Reps,Distance,Distance Unit,Time,Notes,Kind';
    const f = parseImport([h, ...['m', 'km', 'cm', 'in', 'ft', 'yd', 'mi', 'xx'].map((u, i) => `2025-01-0${i + 1},E${u},C,,,,10,${u},,,d`)].join('\n'), NOW);
    expect(f.badRows).toBe(1); expect(f.sessions.map(s => s.exercises[0].sets[0].distanceM)).toEqual([10, 10000, 0.1, 0.25, 3.05, 9.14, 16093.44]);
  });
});

describe('CSV: dopasowanie nazw', () => {
  beforeEach(async () => { await fresh(); });
  test('normName / matchExercise: dokładne, bez wielkości liter i nawiasów, zamiana dopisku (Barbell → sztanga), brak = null', () => {
    expect(normName(' Bench-Press (Barbell) ')).toBe('benchpressbarbell');
    const ix = indexExercises(store.getState().exercises);
    expect(matchExercise('Bench Press (sztanga)', ix)?.name).toBe('Bench Press (sztanga)'); expect(matchExercise('bench press (Barbell)', ix)?.name).toBe('Bench Press (sztanga)');
    expect(matchExercise('PULL  UP', ix)?.name).toBe('Pull Up'); expect(matchExercise('Bench Press (Dumbbell)', ix)?.name).toBe('Bench Press (hantle)');
    expect(matchExercise('Fikcyjny Wyciąg Testowy', ix)).toBeNull(); expect(matchExercise('', ix)).toBeNull();
  });
  test('analyze: liczby podglądu, zakres dat, lista ćwiczeń z dopasowaniem i zmiana przez mapping', () => {
    const f = parseImport(A, NOW); const a = analyze(f, store.getState());
    expect(a).toMatchObject({ total: 3, duplicates: 0, firstDay: '2026-03-02', lastDay: '2026-03-09', badRows: 0 }); expect(a.fresh).toHaveLength(3);
    const byName = Object.fromEntries(a.names.map(r => [r.name, r.auto?.name ?? null]));
    expect(byName).toMatchObject({ 'Bench Press (Barbell)': 'Bench Press (sztanga)', 'pull up': 'Pull Up', Plank: 'Plank', 'Fikcyjny Wyciąg Testowy': null, 'Squat (Barbell)': null });
    expect(a.names).toHaveLength(6); expect(a.matched).toBe(4); expect(a.created).toBe(2); /* Pull Up i pull up to dwie nazwy w pliku */
    const sq = store.getState().exercises.find(e => e.name === 'Back Squat')!;
    const b = analyze(f, store.getState(), { 'Squat (Barbell)': sq.id, Plank: 'new' }); expect(b.matched).toBe(4); expect(b.created).toBe(2); /* Squat → istniejące, Plank → nowe */
  });
});

describe('CSV: zapis', () => {
  beforeEach(async () => { await fresh(); (FS.writeAsStringAsync as jest.Mock).mockClear(); });
  const counts = () => { const s = store.getState(); return { w: s.workouts.length, e: s.exercises.length }; };
  test('import formatA (kg): treningi, serie, ćwiczenia dopasowane i nowe, przez migrate; kopia bezpieczeństwa przed zapisem', async () => {
    const before = counts(); const f = parseImport(A, NOW);
    const r = await commitCsvImport(f, { unit: 'kg' }); expect(r).toEqual({ workouts: 3, exercises: 2 });
    const st = store.getState(); expect(st.workouts).toHaveLength(before.w + 3); expect(st.exercises).toHaveLength(before.e + 2);
    const w = st.workouts.find(x => x.templateName === 'Push A')!; const bp = st.exercises.find(e => e.name === 'Bench Press (sztanga)')!;
    expect(w.exercises[0].exerciseId).toBe(bp.id); expect(w.finishedAt! - w.startedAt).toBe(3120_000); expect(w.tzOffsetMin).toBe(-new Date(w.startedAt).getTimezoneOffset());
    expect(w.exercises[0].sets.map(s => [s.weight, s.reps, s.kind, s.done])).toEqual([[60, 8, 'normal', true], [62.5, 6, 'normal', true], [40, 10, 'drop', true]]); expect(w.exercises[0].sets[1].rpe).toBe(8);
    const nw = st.exercises.find(e => e.name === 'Fikcyjny Wyciąg Testowy')!; expect(nw).toMatchObject({ metric: 'weight_reps', equipment: 'inne', group: 'inne' }); expect(nw.lib).toBeFalsy();
    expect(st.exercises.find(e => e.name === 'Squat (Barbell)')).toBeTruthy(); expect(st.workouts.map(x => x.startedAt)).toEqual([...st.workouts.map(x => x.startedAt)].sort((x, y) => x - y));
    const plank = w.exercises[2].sets[0]; expect(plank).toMatchObject({ durationSec: 60, reps: '' });
    const names = (FS.writeAsStringAsync as jest.Mock).mock.calls.map(c => String(c[0])); expect(names.some(n => /Backup\/trening-przed-importem-/.test(n))).toBe(true);
    expect(JSON.stringify(store.migrate(JSON.parse(JSON.stringify(st))))).toBe(JSON.stringify(store.migrate(JSON.parse(JSON.stringify(store.migrate(JSON.parse(JSON.stringify(st)))))))); /* migrate idempotentne po imporcie */
  });
  test('jednostka lb dla formatA: 135 lb → 61,23 kg (snapLb); kg bez zmian; formatB ignoruje wybór jednostki', async () => {
    const h = HA; const csv = [h, '2026-03-02 10:00:00,T,,Ex,1,135,5,0,0,,,'].join('\n');
    await commitCsvImport(parseImport(csv, NOW), { unit: 'lb' }); const w = store.getState().workouts.find(x => x.templateName === 'T')!; expect(w.exercises[0].sets[0].weight).toBeCloseTo(61.23, 1);
    await commitCsvImport(parseImport(B, NOW), { unit: 'lb' }); const d1 = store.getState().workouts.find(x => x.startedAt === new Date(2025, 10, 3, 12).getTime())!; expect(d1.exercises[0].sets[0].weight).toBe(80);
  });
  test('idempotencja: ten sam plik drugi raz = 0 treningów, 0 ćwiczeń, stan i pliki bez zmian (także formatB)', async () => {
    for (const txt of [A, B]) {
      await commitCsvImport(parseImport(txt, NOW), { unit: 'kg' }); const snap = JSON.stringify(store.getState()); (FS.writeAsStringAsync as jest.Mock).mockClear();
      expect(await commitCsvImport(parseImport(txt, NOW), { unit: 'kg' })).toEqual({ workouts: 0, exercises: 0 });
      expect(JSON.stringify(store.getState())).toBe(snap); expect(FS.writeAsStringAsync).not.toHaveBeenCalled();
      expect(analyze(parseImport(txt, NOW), store.getState()).duplicates).toBe(parseImport(txt, NOW).sessions.length);
    }
  });
  test('duplikaty: ta sama minuta startu co istniejący trening = pomijany (liczba widoczna w analizie); formatB — ten sam dzień; inna minuta = nowy', async () => {
    addWorkout(new Date(2026, 2, 2, 18, 5, 40).getTime(), [['Plank', [{ durationSec: 30, done: true }]]], 'Własny'); /* ta sama minuta co 18:05:00 w pliku */
    addWorkout(new Date(2025, 10, 3, 6, 0).getTime(), [['Plank', [{ durationSec: 30, done: true }]]], 'Rano'); /* ten sam dzień co pierwszy dzień formatB */
    addWorkout(new Date(2026, 2, 5, 7, 31).getTime(), [['Plank', [{ durationSec: 30, done: true }]]], 'Minutę później'); /* 07:31 ≠ 07:30 */
    const a = analyze(parseImport(A, NOW), store.getState()); expect(a.duplicates).toBe(1); expect(a.fresh).toHaveLength(2); expect(a.total).toBe(3);
    const b = analyze(parseImport(B, NOW), store.getState()); expect(b.duplicates).toBe(1); expect(b.fresh).toHaveLength(1);
    expect(await commitCsvImport(parseImport(A, NOW), { unit: 'kg' })).toMatchObject({ workouts: 2 });
    expect(store.getState().workouts.filter(w => w.templateName === 'Push A')).toHaveLength(0);
  });
  test('isDuplicate: minuta (z godziną) i dzień (bez godziny)', () => {
    const f = parseImport(A, NOW); const s0 = f.sessions[0]; const wall = new Date(2026, 2, 2, 18, 5, 59).getTime();
    expect(isDuplicate(s0, new Set([Math.floor(wall / 60000)]), new Set())).toBe(true); expect(isDuplicate(s0, new Set([Math.floor(wall / 60000) + 1]), new Set(['2026-03-02']))).toBe(false);
    expect(isDuplicate(parseImport(B, NOW).sessions[0], new Set(), new Set(['2025-11-03']))).toBe(true);
  });
  test('ćwiczenia powstają tylko dla treningów nie będących duplikatami; ponowny import nie dubluje ćwiczeń (dopasowanie do wcześniej utworzonych)', async () => {
    await commitCsvImport(parseImport(A, NOW), { unit: 'kg' }); const n = store.getState().exercises.length;
    const more = A + '2026-04-01 10:00:00,Nowy,30m,Fikcyjny Wyciąg Testowy,1,35,10,0,0,,,\n';
    expect(await commitCsvImport(parseImport(more, NOW), { unit: 'kg' })).toEqual({ workouts: 1, exercises: 0 }); expect(store.getState().exercises).toHaveLength(n);
  });
  test('mapping z podglądu: wybór istniejącego ćwiczenia zamiast nowego i „nowe” zamiast dopasowanego', async () => {
    const sq = store.getState().exercises.find(e => e.name === 'Back Squat')!; const bp = store.getState().exercises.find(e => e.name === 'Bench Press (sztanga)')!;
    const r = await commitCsvImport(parseImport(A, NOW), { unit: 'kg', mapping: { 'Squat (Barbell)': sq.id, 'Bench Press (Barbell)': 'new' } });
    expect(r.exercises).toBe(2); /* Fikcyjny + nowe Bench Press (Barbell); Squat → Back Squat */
    const st = store.getState(); const w = st.workouts.find(x => x.templateName === 'Nogi, "B"')!; expect(w.exercises[0].exerciseId).toBe(sq.id);
    const p = st.workouts.find(x => x.templateName === 'Push A')!; expect(p.exercises[0].exerciseId).not.toBe(bp.id); expect(st.exercises.find(e => e.id === p.exercises[0].exerciseId)!.name).toBe('Bench Press (Barbell)');
  });
  test('metryki nowych ćwiczeń: dystans+czas (bieg), czas, tylko powtórzenia; grupa cardio dla dystansu', async () => {
    await commitCsvImport(parseImport(B, NOW), { unit: 'kg' }); const ex = (n: string) => store.getState().exercises.find(e => e.name === n)!;
    expect(ex('Fikcyjny Bieg Testowy')).toMatchObject({ metric: 'distance_time', group: 'cardio' }); expect(ex('Bench Press').metric).toBe('weight_reps');
    await commitCsvImport(parseImport([HA, '2026-05-01 10:00:00,T,,Tylko Powt,1,,12,0,0,,,'].join('\n'), NOW), { unit: 'kg' }); expect(ex('Tylko Powt').metric).toBe('reps');
  });
  test('bezpieczeństwo: nieudana kopia bezpieczeństwa przerywa import — stan bez zmian; trening w toku i dane istniejące nietknięte', async () => {
    const st0 = store.getState(); const snap = JSON.stringify(st0); (FS.writeAsStringAsync as jest.Mock).mockRejectedValueOnce(new Error('brak miejsca'));
    await expect(commitCsvImport(parseImport(A, NOW), { unit: 'kg' })).rejects.toMatchObject({ safety: true }); expect(JSON.stringify(store.getState())).toBe(snap);
  });
  test('bezpieczeństwo: błędny/obcy plik → ImportError i zero zmian (nie dochodzi do commit)', async () => {
    const snap = JSON.stringify(store.getState());
    for (const bad of [fx('import-obcy.csv'), '', 'Date,Workout Name\n1,2', '\u0000\u0001binarne']) expect(() => parseImport(bad, NOW)).toThrow(ImportError);
    expect(JSON.stringify(store.getState())).toBe(snap);
  });
  test('trening w toku zostaje nietknięty podczas importu', async () => {
    const tpl = store.getState().exercises[0]; void tpl; const before = JSON.stringify(store.getState().active);
    await commitCsvImport(parseImport(A, NOW), { unit: 'kg' }); expect(JSON.stringify(store.getState().active)).toBe(before);
  });
  test('pickCsv: anulowanie = null; plik sprzątany z Caches po odczycie; za duży plik = toolarge; obcy = format', async () => {
    const pick = require('expo-document-picker').getDocumentAsync as jest.Mock; const del = FS.deleteAsync as jest.Mock; del.mockClear();
    pick.mockImplementationOnce(async () => ({ canceled: true, assets: null })); expect(await pickCsv()).toBeNull();
    pick.mockImplementationOnce(async () => ({ canceled: false, assets: [{ uri: 'file:///cache/DocumentPicker/a.csv' }] })); (FS.readAsStringAsync as jest.Mock).mockResolvedValueOnce(A);
    expect((await pickCsv())!.sessions).toHaveLength(3); expect(del).toHaveBeenCalledWith('file:///cache/DocumentPicker/a.csv', { idempotent: true });
    pick.mockImplementationOnce(async () => ({ canceled: false, assets: [{ uri: 'file:///cache/DocumentPicker/b.csv', size: IMPORT_MAX_CHARS * 3 }] })); await expect(pickCsv()).rejects.toMatchObject({ code: 'toolarge' });
    pick.mockImplementationOnce(async () => ({ canceled: false, assets: [{ uri: 'file:///cache/DocumentPicker/c.csv' }] })); (FS.readAsStringAsync as jest.Mock).mockResolvedValueOnce(fx('import-obcy.csv'));
    await expect(pickCsv()).rejects.toMatchObject({ code: 'format' }); expect(del).toHaveBeenCalledWith('file:///cache/DocumentPicker/c.csv', { idempotent: true });
  });
  test('wydajność: 10 lat historii (1560 treningów, ok. 42 tys. wierszy) — parsowanie, analiza i zapis w rozsądnym czasie; drugi import = 0', async () => {
    const lines = [HA]; const ex = ['Squat (Barbell)', 'Bench Press (Barbell)', 'Deadlift (Barbell)', 'Pull Up', 'Fikcyjny Wyciąg Testowy'];
    for (let i = 0; i < 1560; i++) { const d = new Date(2016, 9, 11 + Math.floor(i * 2.3), 7 + (i % 12), (i * 7) % 60, 0); const ts = `${localISODate(d)} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}:00`;
      for (const e of ex) for (let s = 1; s <= 5; s++) lines.push(`${ts},Trening ${i % 4},60m,${e},${s},${50 + s * 2.5},${10 - s},0,0,,,`); }
    const txt = lines.join('\n') + '\n'; const t0 = Date.now(); const f = parseImport(txt, NOW); expect(f.sessions).toHaveLength(1560); expect(lines.length).toBeGreaterThan(7800);
    const r = await commitCsvImport(f, { unit: 'kg' }); expect(r.workouts).toBeGreaterThan(1500); expect(Date.now() - t0).toBeLessThan(30000);
    expect(await commitCsvImport(parseImport(txt, NOW), { unit: 'kg' })).toEqual({ workouts: 0, exercises: 0 });
  }, 60000);
  test('buildImport: nie zmienia stanu (czysta funkcja)', () => {
    const snap = JSON.stringify(store.getState()); const p = buildImport(parseImport(A, NOW), store.getState(), { unit: 'kg' }); expect(p.workouts).toHaveLength(3); expect(JSON.stringify(store.getState())).toBe(snap);
  });
});
