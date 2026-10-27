/* Audyt 1.0, A-1 (dane): w imporcie CSV po nagłówkach kolumna „Time” w formacie godziny (gg:mm[:ss]) przy osobnej kolumnie daty jest godziną treningu,
 * nie czasem serii. Wcześniej „18:30” dawało 1110 s w każdej serii, a sesja traciła godzinę (dateOnly, południe, duplikaty po dniu). */
import { parseImport } from '@/lib/csvparse';

const NOW = new Date(2026, 9, 11, 12).getTime();
const H = 'Date,Time,Exercise,Weight,Reps';

describe('A-1: kolumna Time jako godzina treningu', () => {
  test('„Date,Time,Exercise,Weight,Reps” z godziną gg:mm — start sesji = data + godzina, serie bez czasu', () => {
    const f = parseImport(`${H}\n2026-10-01,18:30,Squat,100,5\n2026-10-01,18:30,Squat,100,5\n2026-10-02,07:05,Bench Press,60,8\n`, NOW);
    expect(f.sessions).toHaveLength(2);
    const [a, b] = f.sessions;
    expect(a.dateOnly).toBe(false); expect(a.startedAt).toBe(new Date(2026, 9, 1, 18, 30, 0).getTime());
    expect(b.dateOnly).toBe(false); expect(b.startedAt).toBe(new Date(2026, 9, 2, 7, 5, 0).getTime());
    expect(a.exercises[0].sets.map(s => s.durationSec)).toEqual([0, 0]);
    expect(a.exercises[0].sets).toHaveLength(2);
  });
  test('godzina gg:mm:ss', () => {
    const f = parseImport(`${H}\n2026-10-01,18:30:45,Squat,100,5\n2026-10-01,18:30:45,Squat,100,5\n`, NOW);
    expect(f.sessions[0].startedAt).toBe(new Date(2026, 9, 1, 18, 30, 45).getTime()); expect(f.sessions[0].exercises[0].sets[0].durationSec).toBe(0);
  });
  test('kolumna Time czasem serii (data z godziną, wartości różne w dniu, liczby) zostaje czasem serii', () => {
    /* data zawiera godzinę -> Time to czas trwania */
    const a = parseImport('Date,Exercise,Time\n2026-10-01 18:30,Plank,01:30\n', NOW);
    expect(a.sessions[0].exercises[0].sets[0].durationSec).toBe(90); expect(a.sessions[0].startedAt).toBe(new Date(2026, 9, 1, 18, 30).getTime());
    /* różne wartości tego samego dnia -> czasy serii */
    const b = parseImport('Date,Exercise,Time\n2026-10-01,Plank,00:45\n2026-10-01,Plank,01:10\n', NOW);
    expect(b.sessions[0].exercises[0].sets.map(s => s.durationSec)).toEqual([45, 70]); expect(b.sessions[0].dateOnly).toBe(true);
    /* sekundy jako liczby */
    const c = parseImport('Date,Exercise,Time\n2026-10-01,Plank,60\n', NOW);
    expect(c.sessions[0].exercises[0].sets[0].durationSec).toBe(60);
    /* kolumna „Seconds” nie jest godziną nawet gdy wygląda jak godzina */
    const d = parseImport('Date,Exercise,Seconds\n2026-10-01,Plank,01:30\n2026-10-01,Plank,01:30\n', NOW);
    expect(d.sessions[0].exercises[0].sets[0].durationSec).toBe(90);
  });
  test('jeden wiersz na dzień bez powtórzeń godziny jest niejednoznaczny — zostaje czas serii (jak dotąd)', () => {
    const f = parseImport(`${H}\n2026-10-01,18:30,Squat,100,5\n`, NOW);
    expect(f.sessions[0].dateOnly).toBe(true); expect(f.sessions[0].exercises[0].sets[0].durationSec).toBe(1110);
  });
  test('dwa treningi tego samego dnia o różnych godzinach — osobne sesje', () => {
    const f = parseImport(`${H}\n2026-10-01,07:00,Squat,100,5\n2026-10-01,07:00,Squat,100,5\n2026-10-01,19:00,Bench Press,60,8\n2026-10-01,19:00,Bench Press,60,8\n`, NOW);
    expect(f.sessions.map(s => s.startedAt)).toEqual([new Date(2026, 9, 1, 7).getTime(), new Date(2026, 9, 1, 19).getTime()]);
  });
});
