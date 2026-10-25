/*
 * Rozszerzony import CSV (1.0, decyzja właściciela 25.10.2026; docs/monetyzacja.md): układ rozpoznawany po aliasach nagłówków (separator , ; tabulator, BOM, cudzysłowy,
 * lb → kg, typy serii, czas z końca − startu, grupowanie po dacie, superserie, ćwiczenia spoza katalogu jako własne). Dane wyłącznie syntetyczne.
 * Scenariusze CSV-01…07 ze specyfikacji; CSV-08 i MAN-01 (ekran): tests/monetyzacja-ui.test.tsx. Dotychczasowe gwarancje: tests/csv-import-logic.test.ts.
 */
import * as store from '@/lib/store';
import * as FS from 'expo-file-system/legacy';
import { parseImport, parseCsv, detectDelimiter, detectGeneric, parseDurationLoose, analyze, CSV_ALIASES, isImportError, ImportError } from '@/lib/csvparse';
import { clean, mkDate, parseDate, parseDateLoose, setStart, type ParsedSession } from '@/lib/csvcore';
import { parseGeneric } from '@/lib/csvgeneric';
import { commitCsvImport } from '@/lib/csvimport';
import { PAYWALL, canStartLive } from '@/lib/access';
import { accessNow, liveStarts, resetEntitlementsForTests } from '@/lib/entitlement';
import { KG_PER_LB } from '@/lib/units';
import { fresh } from './helpers';

const NOW = new Date(2026, 9, 25, 12).getTime();
const code = (f: () => unknown) => { try { f(); } catch (e) { return isImportError(e) ? e.code : 'inny:' + String(e); } return 'brak błędu'; };

const CLASSIC = ['Date,Workout Name,Duration,Exercise Name,Set Order,Weight (kg),Reps',
  '2026-03-02 18:05:00,Góra A,1h 12m,Bench Press (Barbell),W,40,10',
  '2026-03-02 18:05:00,Góra A,1h 12m,Bench Press (Barbell),1,80,5',
  '2026-03-02 18:05:00,Góra A,1h 12m,Bench Press (Barbell),2,80,5'].join('\n');
const SPLIT = ['title,start_time,end_time,exercise_title,superset_id,set_index,set_type,weight_kg,reps',
  'Nogi,2026-03-03T07:00:00,2026-03-03T08:05:30,Ćwiczenie Alfa,0,0,warmup,20,12',
  'Nogi,2026-03-03T07:00:00,2026-03-03T08:05:30,Ćwiczenie Alfa,0,1,normal,60,8',
  'Nogi,2026-03-03T07:00:00,2026-03-03T08:05:30,Ćwiczenie Beta,0,0,dropset,30,15',
  'Nogi,2026-03-03T07:00:00,2026-03-03T08:05:30,Ćwiczenie Alfa,0,2,failure,60,6',
  'Nogi,2026-03-03T07:00:00,2026-03-03T08:05:30,Ćwiczenie Gamma,,0,normal,50,10'].join('\n');

describe('CSV-01: układ klasyczny (nagłówki z aliasami), seria rozgrzewkowa W i robocza 1', () => {
  test('trening „Góra A”, czas „1h 12m”, serie: rozgrzewka, 2 robocze', () => {
    const f = parseImport(CLASSIC, NOW); expect(f.format).toBe('generic'); expect(f.weightUnit).toBe('kg'); expect(f.sessions).toHaveLength(1);
    const s = f.sessions[0]; expect(s.name).toBe('Góra A'); expect(s.durationSec).toBe(4320);
    expect(s.exercises[0].sets.map(x => [x.kind, x.weight, x.reps])).toEqual([['warmup', 40, 10], ['normal', 80, 5], ['normal', 80, 5]]);
  });
  test('ten sam układ z wielkością liter i spacjami w nagłówku i z aliasami po polsku', () => {
    const csv = ['﻿ DATA ; nazwa treningu ; czas trwania ; ćwiczenie ; seria ; ciężar ; powtórzenia', '2026-03-02 18:05;Plecy;3600;Wiosłowanie testowe;W;30;10', '2026-03-02 18:05;Plecy;3600;Wiosłowanie testowe;1;60;8'].join('\n');
    const f = parseImport(csv, NOW); expect(f.format).toBe('generic'); expect(f.weightUnit).toBeNull(); /* sama kolumna ciężaru: jednostkę wybiera użytkownik */
    expect(f.sessions[0]).toMatchObject({ name: 'Plecy', durationSec: 3600 }); expect(f.sessions[0].exercises[0].sets.map(x => x.kind)).toEqual(['warmup', 'normal']);
  });
});

describe('CSV-02: osobny początek i koniec, czas trwania z różnicy, superserie', () => {
  test('czas = koniec − start; ćwiczenia z tym samym superset_id tworzą grupę, serie na przemian wracają do swojego bloku; typy z kolumny', () => {
    const f = parseImport(SPLIT, NOW); expect(f.format).toBe('generic'); expect(f.weightUnit).toBe('kg'); const s = f.sessions[0];
    expect(s.durationSec).toBe(65 * 60 + 30); expect(s.name).toBe('Nogi');
    expect(s.exercises.map(e => [e.name, e.sets.length])).toEqual([['Ćwiczenie Alfa', 3], ['Ćwiczenie Beta', 1], ['Ćwiczenie Gamma', 1]]);
    expect(s.exercises[0].sets.map(x => x.kind)).toEqual(['warmup', 'normal', 'failure']); expect(s.exercises[1].sets[0].kind).toBe('drop');
  });
  test('po zapisie: Alfa i Beta w jednej superserii (wspólne groupId), Gamma poza grupą (id „0” w pliku to też grupa, puste = brak)', async () => {
    await fresh(); await commitCsvImport(parseImport(SPLIT, NOW), { unit: 'kg' });
    const w = store.getState().workouts.find(x => x.templateName === 'Nogi')!; const ids = w.exercises.map(e => e.groupId);
    expect(ids[0]).toBeTruthy(); expect(ids[0]).toBe(ids[1]); expect(ids[2]).toBeNull(); expect(w.finishedAt! - w.startedAt).toBe((65 * 60 + 30) * 1000);
  });
  test('koniec przed startem albo bez godziny: czas nieznany (null), nie ujemny', () => {
    const rev = SPLIT.replaceAll('2026-03-03T08:05:30', '2026-03-03T06:00:00'); expect(parseImport(rev, NOW).sessions[0].durationSec).toBeNull();
  });
});

describe('CSV-03: separator średnik i brak nazwy treningu', () => {
  const SEMI = ['Date;Exercise;Weight;Reps', '2026-04-01;Ćwiczenie Alfa;50;10', '2026-04-01;Ćwiczenie Alfa;55;8', '2026-04-01;Ćwiczenie Beta;20;12', '2026-04-03;Ćwiczenie Alfa;52,5;9'].join('\n');
  test('wiersze z tą samą datą w jednym treningu, bez nazwy, przecinek dziesiętny, ciężar bez jednostki', () => {
    const f = parseImport(SEMI, NOW); expect(f.format).toBe('generic'); expect(f.sessions).toHaveLength(2);
    expect(f.sessions[0].name).toBe(''); expect(f.sessions[0].dateOnly).toBe(true); expect(f.sessions[0].exercises.map(e => [e.name, e.sets.length])).toEqual([['Ćwiczenie Alfa', 2], ['Ćwiczenie Beta', 1]]);
    expect(f.sessions[1].exercises[0].sets[0].weight).toBe(52.5); expect(f.weightUnit).toBeNull();
  });
  test('zapis: trening bez nazwy w historii pokazuje się jako „Trening” (templateName pusty, jak import sam z dnia)', async () => {
    await fresh(); await commitCsvImport(parseImport(SEMI, NOW), { unit: 'kg' });
    expect(store.getState().workouts.filter(w => w.templateName === '' && w.exercises.some(e => e.sets.length))).toHaveLength(2);
  });
  test('separatory: tabulator i przecinek; średnik w cudzysłowie nie dzieli; wykrycie tylko z pierwszego wiersza', () => {
    expect(detectDelimiter('a\tb\tc\n1,2,3')).toBe('\t'); expect(detectDelimiter('a;b;c')).toBe(';'); expect(detectDelimiter('"a;b";c,d,e')).toBe(',');
    expect(detectDelimiter('\n\na;b')).toBe(';'); expect(detectDelimiter('')).toBe(',');
    expect(parseCsv('a;"b;c";"d\ne"\n1;2;3', ';')).toEqual([['a', 'b;c', 'd\ne'], ['1', '2', '3']]);
    const tab = 'date\texercise\tweight (kg)\treps\n2026-04-01\t"Ćw, z przecinkiem"\t40\t10'; const f = parseImport(tab, NOW);
    expect(f.sessions[0].exercises[0].name).toBe('Ćw, z przecinkiem'); expect(f.weightUnit).toBe('kg');
  });
  test('pole w cudzysłowach z nową linią i podwójnym cudzysłowem w nazwie treningu', () => {
    const csv = 'Date,Title,Exercise,Weight (kg),Reps\n2026-04-01,"Dzień ""A""\nczęść 2",Alfa,40,10'; const s = parseImport(csv, NOW).sessions[0];
    expect(s.name).toBe('Dzień "A"\nczęść 2'.slice(0, 80));
  });
});

describe('CSV-04: przeliczenie lb → kg', () => {
  test('kolumna „Weight (lbs)” i „weight_lbs”: 225 lb ≈ 102,06 kg (jak w pozostałych układach), kolumna kg ma pierwszeństwo, gdy niezerowa', () => {
    for (const h of ['Weight (lbs)', 'weight_lbs']) {
      const f = parseImport(`Date,Exercise,${h},Reps\n2026-04-01,Alfa,225,5`, NOW); expect(f.weightUnit).toBe('kg');
      expect(f.sessions[0].exercises[0].sets[0].weight).toBeCloseTo(225 * KG_PER_LB, 0); expect(f.sessions[0].exercises[0].sets[0].weight).toBeCloseTo(102.06, 1);
    }
    const both = parseImport('Date,Exercise,Weight (kg),Weight (lbs),Reps\n2026-04-01,Alfa,100,220.5,5\n2026-04-02,Alfa,0,135,5', NOW);
    expect(both.sessions[0].exercises[0].sets[0].weight).toBe(100); expect(both.sessions[1].exercises[0].sets[0].weight).toBeCloseTo(61.23, 1);
  });
  test('plik z jednostką w nagłówku nie pyta o jednostkę; sama „weight” — pyta (weightUnit null) i wybór lb przelicza przy zapisie', async () => {
    await fresh(); const f = parseImport('Date,Exercise,Weight,Reps\n2026-04-01,Alfa,135,5', NOW); expect(f.weightUnit).toBeNull();
    await commitCsvImport(f, { unit: 'lb' }); expect(store.getState().workouts.find(w => w.exercises.length && w.startedAt === f.sessions[0].startedAt)!.exercises[0].sets[0].weight).toBeCloseTo(61.23, 1);
  });
  test('dystans: jednostka z nagłówka (km, mi) albo metry; sekundy z liczby i z „MM:ss”; RIR → RPE = 10 − RIR', () => {
    const f = parseImport('Date,Exercise,Distance (km),Time,RIR\n2026-04-01,Bieg testowy,5,25:30,2\n2026-04-02,Bieg testowy,3,600,0', NOW);
    expect(f.distanceUnit).toBe('km'); const [a, b] = f.sessions.map(s => s.exercises[0].sets[0]);
    expect(a).toMatchObject({ distanceM: 5000, durationSec: 1530, rpe: 8 }); expect(b).toMatchObject({ distanceM: 3000, durationSec: 600, rpe: 10 });
    expect(parseImport('Date,Exercise,Distance (mi),Reps\n2026-04-01,Bieg testowy,1,1', NOW).sessions[0].exercises[0].sets[0].distanceM).toBeCloseTo(1609.34, 1);
    expect(parseImport('Date,Exercise,Distance,Reps\n2026-04-01,Bieg testowy,100,1', NOW).distanceUnit).toBeUndefined();
  });
});

describe('CSV-05: ćwiczenie spoza katalogu → ćwiczenie własne, żaden wiersz nie ginie', () => {
  test('nazwa spoza katalogu 709 ćwiczeń i brak dopasowania do własnych: powstaje jedno ćwiczenie własne; nazwa z innym zapisem (wielkość liter, myślnik, nawias) dopasowana do tego samego', async () => {
    await fresh(); const before = store.getState().exercises.length;
    const csv = 'Date,Exercise,Weight (kg),Reps\n2026-04-01,Fikcyjny Przyrząd Zeta (Machine),40,10\n2026-04-02,fikcyjny przyrząd zeta - machine,45,10\n2026-04-02,Plank,0,1';
    const r = await commitCsvImport(parseImport(csv, NOW), { unit: 'kg' }); expect(r.workouts).toBe(2);
    const st = store.getState(); const mine = st.exercises.filter(e => /zeta/i.test(e.name)); expect(mine).toHaveLength(1); expect(mine[0].lib).toBeFalsy();
    expect(st.exercises.length).toBe(before + r.exercises);
    const sets = st.workouts.flatMap(w => w.exercises).filter(e => e.exerciseId === mine[0].id).flatMap(e => e.sets); expect(sets).toHaveLength(2);
  });
  test('wiersz bez żadnego wyniku albo ze złą datą jest policzony jako pominięty (widoczny w podglądzie), nie znika po cichu', () => {
    const f = parseImport('Date,Exercise,Weight (kg),Reps\n2026-04-01,Alfa,40,10\n2026-04-01,Alfa,,\njutro,Alfa,40,10\n20.04.2026,Alfa,41,10\n02/03/2026,Alfa,41,10', NOW);
    expect(f.badRows).toBe(3); expect(f.sessions.map(s => s.exercises[0].sets.length)).toEqual([1, 1]);
  });
});

describe('CSV-06: kopia bezpieczeństwa przed zapisem importu', () => {
  beforeEach(async () => { await fresh(); (FS.writeAsStringAsync as jest.Mock).mockClear(); });
  test('układ rozpoznany po aliasach też zapisuje kopię „przed importem” przed zmianą stanu', async () => {
    const st = store.getState(); let during = -1; (FS.writeAsStringAsync as jest.Mock).mockImplementationOnce(async () => { during = st.workouts.length; });
    const n0 = st.workouts.length; await commitCsvImport(parseImport(SPLIT, NOW), { unit: 'kg' });
    const names = (FS.writeAsStringAsync as jest.Mock).mock.calls.map(c => String(c[0])); expect(names.some(n => /Backup\/training-before-import-/.test(n))).toBe(true);
    expect(during).toBe(n0); expect(store.getState().workouts.length).toBe(n0 + 1);
  });
  test('nieudana kopia przerywa import: stan bez zmian', async () => {
    const snap = JSON.stringify(store.getState()); (FS.writeAsStringAsync as jest.Mock).mockRejectedValueOnce(new Error('brak miejsca'));
    await expect(commitCsvImport(parseImport(SPLIT, NOW), { unit: 'kg' })).rejects.toMatchObject({ safety: true }); expect(JSON.stringify(store.getState())).toBe(snap);
  });
  test('ponowny import tego samego pliku w nowym układzie: same duplikaty, zero zmian', async () => {
    await commitCsvImport(parseImport(SPLIT, NOW), { unit: 'kg' }); expect(await commitCsvImport(parseImport(SPLIT, NOW), { unit: 'kg' })).toEqual({ workouts: 0, exercises: 0 });
  });
});

describe('CSV-07: import nie zwiększa licznika darmowych dni (freeUsed), także z datami bieżącego miesiąca', () => {
  afterEach(() => { PAYWALL.ENABLED = false; resetEntitlementsForTests(); jest.useRealTimers(); });
  test('użytkownik free: po imporcie treningów z bieżącego miesiąca nadal 0 użytych i 5 z 5 darmowych dni, liveDays bez zmian, start dozwolony', async () => {
    jest.useFakeTimers({ now: new Date(2026, 9, 25, 12) }); await fresh(); PAYWALL.ENABLED = true; resetEntitlementsForTests();
    const rows = ['Date,Workout Name,Exercise,Weight (kg),Reps']; for (let d = 1; d <= 8; d++) rows.push(`2026-10-0${d} 18:00:00,T${d},Alfa,50,10`);
    const live0 = JSON.stringify(liveStarts()); const r = await commitCsvImport(parseImport(rows.join('\n'), Date.now()), { unit: 'kg' }); expect(r.workouts).toBe(8);
    const v = accessNow(); expect(v.level).toBe('free'); expect(v.decision.used).toBe(0); expect(v.decision.remaining).toBe(PAYWALL.FREE_TRAINING_DAYS_PER_MONTH); expect(v.decision.allowed).toBe(true);
    expect(JSON.stringify(liveStarts())).toBe(live0); expect(store.getState().workouts.filter(w => w.live === true)).toHaveLength(0);
    /* kontrola odwrotna: gdyby importowane treningi były „na żywo”, limit byłby wyczerpany */
    const asLive = store.getState().workouts.filter(w => /^T\d$/.test(w.templateName)).map(w => ({ startedAt: w.startedAt, tzOffsetMin: w.tzOffsetMin }));
    expect(canStartLive({}, [], asLive, Date.now(), 0, { ...PAYWALL, ENABLED: true }).used).toBe(asLive.length);
  });
});

describe('rozpoznawanie układu: aliasy, błędy, zabezpieczenia', () => {
  test('wymagane kolumny daty i ćwiczenia; każdy alias z CSV_ALIASES jest rozpoznany (małe litery, spacje)', () => {
    expect(detectGeneric(['x', 'y'])).toBeNull(); expect(detectGeneric(['Date', 'Workout Name'])).toBeNull(); expect(detectGeneric(['Exercise', 'Reps'])).toBeNull();
    for (const d of CSV_ALIASES.workoutDate) for (const e of CSV_ALIASES.exerciseName) expect(detectGeneric(['  ' + d.toUpperCase() + ' ', e])).toEqual({ workoutDate: 0, exerciseName: 1 });
    for (const [k, list] of Object.entries(CSV_ALIASES)) if (!['workoutDate', 'exerciseName'].includes(k)) for (const a of list) expect(detectGeneric(['date', 'exercise', a])).toMatchObject({ [k]: 2 });
  });
  test('błędy jak dotąd: obcy plik, tylko nagłówek, wszystkie wiersze złe; BOM i CRLF', () => {
    expect(code(() => parseImport('Imię;Nazwisko\nJan;Kowalski', NOW))).toBe('format'); expect(code(() => parseImport('Date;Exercise;Reps', NOW))).toBe('rows');
    expect(code(() => parseImport('Date;Exercise;Reps\nzła;Alfa;5', NOW))).toBe('rows');
    const f = parseImport('﻿Date;Exercise;Reps\r\n2026-04-01;Alfa;5\r\n', NOW); expect(f.sessions).toHaveLength(1); expect(new ImportError('rows').code).toBe('rows');
  });
  test('formaty daty: ISO ze strefą, z ułamkiem sekundy, DD.MM.RRRR, „D Mon RRRR, GG:MM”; dwuznaczne z ukośnikiem odrzucone; przyszłość odrzucona', () => {
    const d = (s: string) => parseImport(`Date,Exercise,Reps\n"${s}",Alfa,5`, NOW).sessions[0];
    expect(d('2026-04-01T10:15:30.250').startedAt).toBe(new Date(2026, 3, 1, 10, 15, 30).getTime());
    expect(d('2026-04-01T10:00:00Z').startedAt).toBe(new Date('2026-04-01T10:00:00Z').getTime()); expect(d('2026-04-01 10:00:00+02:00').startedAt).toBe(new Date('2026-04-01T10:00:00+02:00').getTime());
    expect(d('05.04.2026').dateOnly).toBe(true); expect(d('05.04.2026 07:30').startedAt).toBe(new Date(2026, 3, 5, 7, 30).getTime());
    expect(d('5 Apr 2026, 07:30').startedAt).toBe(new Date(2026, 3, 5, 7, 30).getTime()); expect(d('12 Dec 2025').dateOnly).toBe(true);
    expect(code(() => d('04/05/2026'))).toBe('rows'); expect(code(() => d('2027-12-01'))).toBe('rows');
  });
  test('typy serii: kolumna ma pierwszeństwo przed literą; nieznany typ = zwykła; litery W/D/F w numerze serii', () => {
    const f = parseImport('Date,Exercise,Set Order,Set Type,Weight (kg),Reps\n2026-04-01,A,W,,20,10\n2026-04-01,A,D,,20,10\n2026-04-01,A,F,,20,10\n2026-04-01,A,1,warmup,20,10\n2026-04-01,A,2,dziwny,20,10\n2026-04-01,A,W,normal,20,10', NOW);
    expect(f.sessions[0].exercises[0].sets.map(s => s.kind)).toEqual(['warmup', 'drop', 'failure', 'warmup', 'normal', 'normal']);
  });
  test('parseDurationLoose: liczba sekund, „HH:MM:ss”, „MM:ss”, tekst z h/m/s, błędne i puste = null', () => {
    expect(parseDurationLoose('3600')).toBe(3600); expect(parseDurationLoose('1:12:30')).toBe(4350); expect(parseDurationLoose('45:30')).toBe(2730);
    expect(parseDurationLoose('1h 12m')).toBe(4320); expect(parseDurationLoose('45m 30s')).toBe(2730); expect(parseDurationLoose('1H')).toBe(3600);
    expect(parseDurationLoose('')).toBeNull(); expect(parseDurationLoose('abc')).toBeNull();
  });
  test('analiza (podgląd) działa dla układu generic: liczby treningów i ćwiczeń', async () => {
    await fresh(); const a = analyze(parseImport(SPLIT, NOW), store.getState()); expect(a).toMatchObject({ total: 1, duplicates: 0, created: 3 });
  });
});

describe('csvcore / csvgeneric: składniki bezpośrednio', () => {
  test('clean: odwraca ochronę przed formułą (apostrof) i przycina; parseDate/mkDate: ISO, nieistniejące dni, rok przed 1990 i przyszłość = null', () => {
    expect(clean("'=SUMA(A1)")).toBe('=SUMA(A1)'); expect(clean('  tekst  ')).toBe('tekst'); expect(clean(undefined)).toBe('');
    expect(parseDate('2026-04-01 10:15', NOW)).toEqual({ wall: new Date(2026, 3, 1, 10, 15).getTime(), dateOnly: false }); expect(parseDate('2026-04-01', NOW)?.dateOnly).toBe(true);
    expect(parseDate('2026-02-30', NOW)).toBeNull(); expect(parseDate('1980-01-01', NOW)).toBeNull(); expect(parseDate('2027-01-01', NOW)).toBeNull();
    expect(mkDate(2026, 4, 1, 25, 0, 0, false, NOW)).toBeNull(); expect(mkDate(2026, 4, 1, 12, 0, 0, true, NOW)).toEqual({ wall: new Date(2026, 3, 1, 12).getTime(), dateOnly: true });
  });
  test('parseDateLoose: format ISO przechodzi przez parseDate, obce formaty i śmieci = null', () => {
    expect(parseDateLoose('2026-04-01', NOW)).toEqual(parseDate('2026-04-01', NOW)); expect(parseDateLoose('1 Foo 2026', NOW)).toBeNull(); expect(parseDateLoose('', NOW)).toBeNull();
  });
  test('setStart: ustawia przesunięcie strefy i znacznik startu z czasu ściennego', () => {
    const s = { startedAt: 0, tzOffsetMin: 0 } as ParsedSession; const wall = new Date(2026, 3, 1, 10).getTime(); setStart(s, wall);
    expect(s.startedAt).toBe(wall); expect(s.tzOffsetMin).toBe(-new Date(wall).getTimezoneOffset() || 0);
  });
  test('parseGeneric: wywołanie wprost z wierszami i kolumnami; ta sama odpowiedź co parseImport', () => {
    const rows = [['Date', 'Exercise', 'Reps'], ['2026-04-01', 'Alfa', '5']]; const f = parseGeneric(rows, detectGeneric(rows[0])!, NOW);
    expect(f).toEqual(parseImport(rows.map(r => r.join(',')).join('\n'), NOW)); expect(f.sessions[0].exercises[0].sets[0].reps).toBe(5);
  });
});
