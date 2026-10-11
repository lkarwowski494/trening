/*
 * Karta rekordów po treningu (decyzja właściciela 11.10.2026, pkt 7, wariant A: bez grafiki sztangi). Rodzaje (docs/20): logika (workoutPRs.stats / recordCards —
 * przyrost z tych samych „poprzednich rekordów” co prMap), ekran (karta w szczegółach sesji), VoiceOver (jedna etykieta na ćwiczenie), języki (EN),
 * jednostki (lb), masa ciała (e1RM z masą ciała), niezmiennik (liczba rekordów = prCountOf), długie nazwy (zawijanie).
 */
import * as store from '@/lib/store';
import { applyLang } from '@/lib/i18n';
import { applyUnit } from '@/lib/units';
import { workoutPRs, recordCards, recordDelta, prCountOf, prMap, recordsFor } from '@/lib/stats';
import { statLine, cardLabel } from '@/components/RecordsCard';
import { fresh, saved, addWorkout, ex, setBodyMass } from './helpers';
import { renderApp, flushAll, screen, go, act } from './app';

jest.setTimeout(30000);
const NOW = new Date(2026, 9, 11, 18).getTime();
const at = (m: number, d: number, h = 18) => new Date(2026, m, d, h).getTime();
const boot = async (fn: () => void = () => {}, url?: string, locale: 'pl' | 'en' = 'pl') => {
  jest.useFakeTimers({ now: NOW }); await fresh(undefined, locale); fn(); store.save(); await act(async () => { await store.flush(); });
  await renderApp({ saved: JSON.parse(JSON.stringify(saved())), url, locale }); await flushAll(10);
};
afterEach(() => { applyLang('pl'); applyUnit('kg'); });
const nb = (s: string) => s.replace(/[  ]/g, ' ');

describe('logika: przyrost względem poprzedniego rekordu', () => {
  test('przysiad 100×5 → 110×5: objętość +50 kg i e1RM z przyrostem; kolejność: suma, potem e1RM; najlepsza seria', async () => {
    await fresh(); addWorkout(at(9, 1), [['Back Squat', [{ weight: 100, reps: 5 }]]]); const w = addWorkout(at(9, 3), [['Back Squat', [{ weight: 110, reps: 5 }]]]);
    const c = recordCards(workoutPRs(w)); expect(c).toHaveLength(1); const s = c[0].stats;
    expect(s.map(x => x.kind)).toEqual(['objętość treningu', 'e1RM']); expect(s.every(x => !x.first)).toBe(true);
    expect(nb(s[0].value)).toBe('550 kg'); expect(nb(s[0].delta!)).toBe('+50 kg');
    const prev = recordsFor(ex('Back Squat'), w.startedAt); expect(prev.bestE1rm).toBeGreaterThan(0); /* jedno źródło: te same rekordy co prMap */
    expect(nb(s[1].value)).toBe('128,33 kg'); expect(nb(s[1].delta!)).toBe('+11,67 kg');
    expect(nb(c[0].bestSet)).toBe('110 kg × 5'); expect(nb(statLine(s[0]))).toBe('↑ Objętość 550 kg (+50 kg)');
    expect(prCountOf(workoutPRs(w))).toBe(2); expect(s).toHaveLength(prCountOf(workoutPRs(w))); expect(prMap(w).size).toBeGreaterThan(0);
  });
  test('tylko pobita statystyka: więcej serii o tym samym e1RM — sama objętość', async () => {
    await fresh(); addWorkout(at(9, 1), [['Back Squat', [{ weight: 100, reps: 5 }]]]); const w = addWorkout(at(9, 3), [['Back Squat', [{ weight: 100, reps: 5 }, { weight: 100, reps: 5 }]]]);
    const c = recordCards(workoutPRs(w)); expect(c[0].stats.map(x => x.kind)).toEqual(['objętość treningu']); expect(nb(c[0].stats[0].delta!)).toBe('+500 kg');
  });
  test('dwa ćwiczenia → dwie karty; ćwiczenie bez rekordu nie występuje', async () => {
    await fresh(); addWorkout(at(9, 1), [['Back Squat', [{ weight: 100, reps: 5 }]], ['Bench Press (hantle)', [{ weight: 40, reps: 5 }]]]);
    const w = addWorkout(at(9, 3), [['Back Squat', [{ weight: 110, reps: 5 }]], ['Bench Press (hantle)', [{ weight: 30, reps: 5 }]]]);
    expect(recordCards(workoutPRs(w)).map(x => x.exercise.name)).toEqual(['Back Squat']);
  });
  test('powtórzenia (masa ciała) i czas: przyrost w jednostkach rodzaju sumy', async () => {
    await fresh(); addWorkout(at(9, 1), [['Pull Up', [{ reps: 5 }]], ['Plank', [{ durationSec: 60 }]]]); const w = addWorkout(at(9, 3), [['Pull Up', [{ reps: 8 }]], ['Plank', [{ durationSec: 90 }]]]);
    const c = recordCards(workoutPRs(w)); const by = (n: string) => c.find(x => x.exercise.name === n)!.stats;
    expect(by('Pull Up')[0]).toMatchObject({ kind: 'suma powtórzeń', label: 'Suma powtórzeń', first: false }); expect(by('Pull Up')[0].delta).toMatch(/^\+3 /);
    expect(by('Plank')[0]).toMatchObject({ kind: 'łączny czas', first: false }); expect(by('Plank')[0].delta).toMatch(/^\+/);
  });
  test('pierwszy wynik (brak poprzedniego rekordu): bez przyrostu, dopisek; zerowy przyrost też bez „+0”', () => {
    expect(recordDelta(5, 0, v => String(v))).toBeNull(); expect(recordDelta(0, 10, v => String(v))).toBeNull(); expect(recordDelta(2.5, 100, v => `${v} kg`)).toBe('+2.5 kg');
    expect(statLine({ kind: 'e1RM', label: 'e1RM', value: '100 kg', delta: null, first: true })).toBe('↑ e1RM 100 kg (pierwszy wynik)');
    const l = cardLabel({ exercise: ex('Back Squat'), stats: [{ kind: 'e1RM', label: 'e1RM', value: '100 kg', delta: null, first: true }], bestSet: '' });
    expect(l).toBe('Back Squat. e1RM 100 kg, pierwszy wynik');
  });
  test('masa ciała: e1RM z opisem „masa ciała + X” i przyrost względem poprzedniego e1RM', async () => {
    await fresh(); setBodyMass(80); addWorkout(at(9, 1), [['Pull Up', [{ addKg: 10, reps: 5 }]]]); const w = addWorkout(at(9, 3), [['Pull Up', [{ addKg: 15, reps: 5 }]]]);
    const e = recordCards(workoutPRs(w))[0].stats.find(x => x.kind === 'e1RM')!; expect(e.value).toMatch(/masa ciała \+/); expect(nb(e.delta!)).toMatch(/^\+\d/);
  });
  test('lb: wartości i przyrost w funtach', async () => {
    await fresh(); applyUnit('lb'); addWorkout(at(9, 1), [['Back Squat', [{ weight: 100, reps: 5 }]]]); const w = addWorkout(at(9, 3), [['Back Squat', [{ weight: 110, reps: 5 }]]]);
    const s = recordCards(workoutPRs(w))[0]; expect(s.stats.every(x => /lb/.test(x.value) && /lb/.test(x.delta!) && !/kg/.test(x.value + x.delta!))).toBe(true); expect(s.bestSet).toMatch(/lb × 5$/);
  });
  test('EN: etykiety i linie po angielsku', async () => {
    await fresh(undefined, 'en'); addWorkout(at(9, 1), [['Back Squat', [{ weight: 100, reps: 5 }]]]); const w = addWorkout(at(9, 3), [['Back Squat', [{ weight: 110, reps: 5 }]]]);
    const c = recordCards(workoutPRs(w))[0]; expect(nb(statLine(c.stats[0]))).toBe('↑ Volume 550 kg (+50 kg)'); expect(statLine(c.stats[1])).toMatch(/^↑ e1RM 128[.,]33 kg \(\+11[.,]67 kg\)$/);
    expect(cardLabel(c)).toMatch(/^Back Squat\. Volume 550 kg, up \+50 kg\. e1RM .*, up \+.*\. Best set: 110 kg × 5$/);
  });
});

describe('ekran: karta w szczegółach sesji', () => {
  test('nagłówek z liczbą, ćwiczenie, pobite statystyki ze strzałką, najlepsza seria; jedna etykieta VoiceOver na ćwiczenie; bez talerzy', async () => {
    let id = ''; await boot(() => { addWorkout(at(9, 1), [['Back Squat', [{ weight: 100, reps: 5 }]]]); id = addWorkout(at(9, 3), [['Back Squat', [{ weight: 110, reps: 5 }]]]).id; });
    await go(`/history/${id}`); await flushAll(10);
    expect(screen.getByTestId('record-banner').props.accessibilityLabel).toBe('Nowe rekordy: 2');
    const card = screen.getByTestId(`record-ex-${ex('Back Squat').id}`); expect(card.props.accessible).toBe(true);
    expect(nb(card.props.accessibilityLabel)).toBe('Back Squat. Objętość 550 kg, przyrost +50 kg. e1RM 128,33 kg, przyrost +11,67 kg. Najlepsza seria: 110 kg × 5');
    expect(nb(screen.getByText(/^↑ Objętość/).props.children)).toBe('↑ Objętość 550 kg (+50 kg)'); expect(screen.getByText(/^↑ e1RM/)).toBeTruthy(); expect(screen.getByText(/^Najlepsza seria: 110/)).toBeTruthy();
    expect(screen.queryByTestId('record-plate-new', { includeHiddenElements: true })).toBeNull();
  });
  test('EN + długa nazwa ćwiczenia: tekst nie jest ucinany (brak numberOfLines)', async () => {
    let id = '', long = { id: '' }; await boot(() => {
      const e = store.newExercise('Bardzo długa nazwa ćwiczenia z wieloma słowami, która nie mieści się w jednej linii na wąskim ekranie'); store.save(); long = e;
      addWorkout(at(9, 1), [[e.name, [{ weight: 50, reps: 5 }]]]); id = addWorkout(at(9, 3), [[e.name, [{ weight: 60, reps: 5 }]]]).id;
    }, undefined, 'en');
    await go(`/history/${id}`); await flushAll(10);
    screen.getAllByText(/Bardzo długa nazwa/).forEach(l => expect(l.props.numberOfLines).toBeUndefined()); expect(screen.getByTestId(`record-ex-${long.id}`)).toBeTruthy(); expect(screen.getByText(/^↑ Volume/).props.numberOfLines).toBeUndefined();
    expect(screen.getByTestId('record-banner').props.accessibilityLabel).toBe('New records: 2');
  });
  test('sesja bez rekordu: bez karty', async () => {
    let id = ''; await boot(() => { addWorkout(at(9, 1), [['Back Squat', [{ weight: 100, reps: 5 }]]]); id = addWorkout(at(9, 3), [['Back Squat', [{ weight: 50, reps: 5 }]]]).id; });
    await go(`/history/${id}`); await flushAll(10); expect(screen.queryByTestId('record-card')).toBeNull();
  });
});
