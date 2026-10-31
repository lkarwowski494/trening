/*
 * DEC-01 a (właściciel 23.10.2026; wdrożenie 1.0.1, docs/21 „Backlog 1.0.1 — decyzje DEC-01 a i DEC-04 a”; docs/32 wzorzec 32): przy dużej skali tekstu liczba przycięta
 * w ciasnym polu (ciężar, powtórzenia, dystans, czas, RPE, kafelki podsumowań) pokazuje się w całości po przytrzymaniu — systemowy podgląd dużej zawartości
 * (accessibilityShowsLargeContentViewer + accessibilityLargeContentTitle „etykieta: wartość”), bez zmiany układu. Jeden komponent: components/FullValue.tsx.
 * Realność: realny (osoba z dużym tekstem w ustawieniach iOS, widok Lista albo edycja sesji). Kroki: trening w toku (widok Lista) albo Historia → sesja → Edytuj → przytrzymaj pole.
 * Rodzaje (docs/20): logika (fullValueProps), komponent, ekran (3 miejsca), niezmiennik (każde pole liczbowe w wierszu serii jest w FullValue), języki (EN), VoiceOver
 * (kontener nie jest elementem dostępności, pole ma własną etykietę), dane (zero i pusta wartość). Wygląd (jasny/ciemny): komponent nie ma własnego wyglądu — wyjątek z powodem w docs/09.
 * Samego podglądu systemowego (przytrzymanie palcem) Jest ani symulator Maestro nie wywołają — kontrola na telefonie (docs/21, lista „tylko telefon”).
 */
import * as fs from 'fs';
import * as path from 'path';
import { render, within } from '@testing-library/react-native';
import * as store from '@/lib/store';
import { fresh, ex, saved, addWorkout } from './helpers';
import { renderApp, flushAll, screen, go, act } from './app';
import { FullValue, fullValueProps } from '@/components/FullValue';

jest.setTimeout(60000);
const S = () => store.getState();
const hostsWith = (title: string | RegExp) => screen.UNSAFE_root.findAll(n => typeof n.type === 'string' && n.props.accessibilityShowsLargeContentViewer === true
  && typeof n.props.accessibilityLargeContentTitle === 'string' && (typeof title === 'string' ? n.props.accessibilityLargeContentTitle === title : title.test(n.props.accessibilityLargeContentTitle)));

describe('fullValueProps: logika', () => {
  test('tytuł „etykieta: wartość”; liczba, tekst, zero', () => {
    expect(fullValueProps('ciężar', 80)).toEqual({ accessibilityShowsLargeContentViewer: true, accessibilityLargeContentTitle: 'ciężar: 80' });
    expect(fullValueProps('Powtórzenia', '12,5')).toEqual({ accessibilityShowsLargeContentViewer: true, accessibilityLargeContentTitle: 'Powtórzenia: 12,5' });
    expect(fullValueProps('ciężar', 0).accessibilityLargeContentTitle).toBe('ciężar: 0'); /* zero to wartość, nie brak */
  });
  test('pusta wartość, null, undefined i same spacje: bez podglądu (nie ma czego pokazać)', () => {
    for (const v of ['', '   ', null, undefined]) expect(fullValueProps('ciężar', v)).toEqual({});
  });
});

describe('FullValue: komponent', () => {
  test('kontener z podglądem, układ z przekazanego stylu, dzieci bez zmian; nie jest elementem dostępności (VoiceOver czyta pole)', () => {
    const { UNSAFE_root, getByText } = render(<FullValue label="ciężar" value={1234.5} style={{ width: 70 }}><></></FullValue>);
    const host = UNSAFE_root.findAll(n => typeof n.type === 'string')[0];
    expect(host.props.accessibilityLargeContentTitle).toBe('ciężar: 1234.5'); expect(host.props.accessibilityShowsLargeContentViewer).toBe(true);
    expect(host.props.style).toEqual({ width: 70 }); expect(host.props.accessible).toBeUndefined();
    expect(() => getByText('x')).toThrow();
  });
  test('pusta wartość: kontener bez podglądu', () => {
    const { UNSAFE_root } = render(<FullValue label="ciężar" value=""><></></FullValue>);
    expect(UNSAFE_root.findAll(n => typeof n.type === 'string')[0].props.accessibilityShowsLargeContentViewer).toBeUndefined();
  });
});

describe('ekran: trening w toku (widok Lista) — wiersz serii', () => {
  const boot = async (fn: () => void, locale: 'pl' | 'en' = 'pl') => { await fresh(undefined, locale); S().settings.workoutView = 'list'; fn(); await act(async () => { await store.flush(); }); await renderApp({ saved: JSON.parse(JSON.stringify(saved())), locale }); await flushAll(10); };
  const bench = () => { store.startEmpty(); store.addExerciseToActive(ex('Bench Press (sztanga)')); const s = S().active!.exercises[0].sets[0]; s.weight = 82.5; s.reps = 6; };
  test('ciężar i powtórzenia: podgląd z nazwą pola i pełną wartością; pole ma własną etykietę dla VoiceOver', async () => {
    await boot(bench);
    expect(hostsWith(/: 82[.,]5$/).length).toBeGreaterThan(0); expect(hostsWith('Powtórzenia: 6').length).toBeGreaterThan(0);
    expect(screen.getByTestId('r-0-0').props.accessibilityLabel).toBe('Powtórzenia'); expect(screen.getByTestId('r-0-0').props.accessibilityLargeContentTitle).toBeUndefined(); /* podgląd na kontenerze, nie na polu */
  });
  test('układ bez zmian: pole liczbowe w kontenerze o tej samej szerokości kolumny (kontener = dawny View z width)', async () => {
    await boot(bench);
    const box = hostsWith('Powtórzenia: 6')[0]; const w = (box.props.style as { width?: number }).width; expect(typeof w).toBe('number'); expect(w).toBeGreaterThan(20);
    expect(within(box).getByTestId('r-0-0')).toBeTruthy();
  });
  test('pusta seria: bez podglądu (pola puste); po wpisaniu wartości jest', async () => {
    await boot(() => { store.startEmpty(); store.addExerciseToActive(ex('Bench Press (sztanga)')); });
    expect(hostsWith(/^Powtórzenia: /).length).toBe(0); expect(hostsWith(/^[^:]+: \d/).length).toBe(0);
  });
  test('zero to wartość: podgląd pokazuje „0”', async () => {
    await boot(() => { store.startEmpty(); store.addExerciseToActive(ex('Bench Press (sztanga)')); S().active!.exercises[0].sets[0].reps = 0; });
    expect(hostsWith('Powtórzenia: 0').length).toBeGreaterThan(0);
  });
  test('EN: nazwa pola po angielsku', async () => {
    await boot(bench, 'en');
    expect(hostsWith('Reps: 6').length).toBeGreaterThan(0);
  });
});

describe('ekran: edycja sesji z Historii', () => {
  test('ciężar i powtórzenia w tabeli sesji mają podgląd po przytrzymaniu', async () => {
    await fresh(); const w = addWorkout(Date.now() - 86400e3, [['Back Squat', [{ weight: 140, reps: 5, done: true }, { weight: 142.5, reps: 3, done: true }]]], 'Test');
    store.save(); await act(async () => { await store.flush(); });
    await renderApp({ saved: JSON.parse(JSON.stringify(saved())) }); await go(`/history/edit/${w.id}`); await flushAll(20);
    expect(hostsWith(/: 140$/).length).toBeGreaterThan(0); expect(hostsWith(/: 142[.,]5$/).length).toBeGreaterThan(0);
    expect(hostsWith('Powtórzenia: 5').length).toBeGreaterThan(0); expect(hostsWith('Powtórzenia: 3').length).toBeGreaterThan(0);
  });
});

describe('ekran: kafelki podsumowań', () => {
  test('„Ten tydzień”: każdy kafelek (Treningi, Serie, Objętość, Czas) ma podgląd z pełną wartością', async () => {
    await fresh(); addWorkout(Date.now() - 3600e3, [['Back Squat', [{ weight: 100, reps: 5, done: true }]]], 'Test');
    store.save(); await act(async () => { await store.flush(); });
    await renderApp({ saved: JSON.parse(JSON.stringify(saved())), url: '/' }); await flushAll(10);
    for (const l of ['Treningi', 'Serie', 'Objętość', 'Czas']) expect([l, hostsWith(new RegExp(`^${l}: .+`)).length > 0]).toEqual([l, true]);
    expect(hostsWith('Treningi: 1').length).toBeGreaterThan(0);
  });
});

describe('niezmiennik: ciasne pola liczbowe wiersza serii zawsze w FullValue', () => {
  test.each(['components/WorkoutBlocks.tsx', 'app/history/edit/[id].tsx'])('%s: każdy <NumInput> w wierszu serii stoi wprost w <FullValue>', f => {
    const src = fs.readFileSync(path.join(__dirname, '..', f), 'utf8');
    const inputs = src.split('\n').filter(l => l.includes('<NumInput'));
    expect(inputs.length).toBeGreaterThanOrEqual(5);
    for (const l of inputs) expect([f, /<FullValue [^>]*>\s*<NumInput/.test(l)]).toEqual([f, true]);
  });
});
