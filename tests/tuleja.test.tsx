/*
 * Styl „Tuleja” (decyzja właściciela 07.10.2026: grafika B, „wszystko naraz”, krój mieszany, domyślnie jasny; docs/16, docs/21 pkt 3 i 6):
 * widok skupiony na bieżącej serii z przełącznikiem w ustawieniach. 20.10.2026 (DEC-06, audyt M1): pasek talerzy „na każdą stronę” i kalkulator usunięte —
 * testy ich logiki (platesPerSide, plateSpecFor, kolory IWF na talerzach) zniknęły razem z funkcją; zostaje test braku (niżej).
 * Rodzaje testów (docs/20): logika (focusSet), ekran (karta „teraz”, ustawienie, brak paska talerzy), dane (migracja, restart), języki (en).
 * Macierz wymiarów: tests/matrix-tuleja.test.tsx. E2E: .maestro/11-widok-skupiony.yaml.
 */
import * as store from '@/lib/store';
import * as timer from '@/lib/timer';
import { addLocation } from '@/lib/locations';
import { applyUnit } from '@/lib/units';
import { applyLang } from '@/lib/i18n';
import { fresh, ex, saved } from './helpers';
import { renderApp, tap, flushAll, screen, act, fireEvent, openInfo } from './app';

jest.setTimeout(60000);
const S = () => store.getState();
beforeEach(async () => { await fresh(); });
afterEach(async () => { applyUnit('kg'); applyLang('pl'); await timer.stop(); await timer.stopSet(); });

describe('seria „teraz” (store.focusSet)', () => {
  beforeEach(async () => { await fresh(); store.startEmpty(); });
  test('pierwsza nieodhaczona seria w kolejności treningu; wszystko odhaczone → null; pusty trening → null', () => {
    expect(store.focusSet(S().active)).toBeNull();
    store.addExerciseToActive(ex('Back Squat')); store.addSet(0); store.addExerciseToActive(ex('Bench Press (sztanga)'));
    expect(store.focusSet(S().active)).toEqual({ ei: 0, si: 0 });
    store.toggleDone(0, 0); expect(store.focusSet(S().active)).toEqual({ ei: 0, si: 1 });
    store.toggleDone(0, 1); expect(store.focusSet(S().active)).toEqual({ ei: 1, si: 0 });
    store.toggleDone(1, 0); expect(store.focusSet(S().active)).toBeNull();
    store.toggleDone(0, 0); expect(store.focusSet(S().active)).toEqual({ ei: 0, si: 0 }); /* cofnięcie odhaczenia wraca do tej serii */
    expect(store.focusSet(null)).toBeNull();
  });
  test('superset: naprzemiennie A1, B1, A2, B2', () => {
    store.addExerciseToActive(ex('Back Squat')); store.addSet(0); store.addExerciseToActive(ex('Bench Press (sztanga)')); store.addSet(1);
    const a = S().active!; store.linkWithNext(a.exercises, 0, a);
    const seq: string[] = []; for (let i = 0; i < 4; i++) { const p = store.focusSet(S().active)!; seq.push(`${p.ei}:${p.si}`); store.toggleDone(p.ei, p.si); }
    expect(seq).toEqual(['0:0', '1:0', '0:1', '1:1']);
  });
  test('blok usuniętego ćwiczenia jest pomijany', () => {
    store.addExerciseToActive(ex('Back Squat')); store.addExerciseToActive(ex('Bench Press (sztanga)'));
    S().active!.exercises[0].exerciseId = 'nie-ma'; expect(store.focusSet(S().active)).toEqual({ ei: 1, si: 0 });
  });
});

describe('ustawienie „Widok treningu” (dane)', () => {
  test('domyślnie skupiony — także dla starszych danych i złych wartości; „lista” zostaje po restarcie', async () => {
    await fresh(); expect(S().settings.workoutView).toBe('focus');
    const s = JSON.parse(JSON.stringify(S())); delete s.settings.workoutView; await fresh(s); expect(S().settings.workoutView).toBe('focus');
    s.settings.workoutView = 'cokolwiek'; await fresh(s); expect(S().settings.workoutView).toBe('focus');
    s.settings.workoutView = 'list'; await fresh(s); expect(S().settings.workoutView).toBe('list');
    await act(async () => { await store.flush(); }); expect(saved().settings.workoutView).toBe('list');
    const again = JSON.parse(JSON.stringify(saved())); await fresh(again); expect(store.getState().settings.workoutView).toBe('list'); /* migrate idempotentne */
  });
});

/* ---------- ekran ---------- */
async function gymWorkout(view: 'focus' | 'list' = 'focus') {
  await fresh(); addLocation('gym'); S().settings.workoutView = view; store.startEmpty(); store.addExerciseToActive(ex('Bench Press (sztanga)')); store.addSet(0);
  const a = S().active!; a.exercises[0].sets[0].weight = 80; a.exercises[0].sets[0].reps = 8; a.exercises[0].sets[1].weight = 100; a.exercises[0].sets[1].reps = 5;
  store.save(a); await act(async () => { await store.flush(); });
  await renderApp({ saved: JSON.parse(JSON.stringify(saved())) }); await flushAll(10);
}
describe('ekran treningu: karta „teraz”', () => {
  test('ćwiczenie, numer serii, duże „80 kg × 8” (audyt 0.10, UI-10: jednostka przy ciężarze), bez paska talerzy; „Seria zrobiona” odhacza serię i startuje przerwę, karta przechodzi dalej', async () => {
    await gymWorkout();
    expect(screen.getByText('seria 1 z 2')).toBeTruthy();
    expect(screen.getByLabelText('Teraz: 80 kg × 8')).toBeTruthy();
    expect(screen.queryByLabelText(/Na każdą stronę/)).toBeNull(); expect(screen.queryByText(/Na każdą stronę|sam gryf/)).toBeNull(); /* DEC-06: bez paska talerzy */
    await tap(screen.getByText('Seria zrobiona')); await flushAll(10);
    expect(S().active!.exercises[0].sets[0].done).toBe(true); expect(timer.T.on).toBe(true);
    expect(screen.getByText('seria 2 z 2')).toBeTruthy(); expect(screen.getByLabelText('Teraz: 100 kg × 5')).toBeTruthy();
    await tap(screen.getByText('Seria zrobiona')); await flushAll(10);
    expect(screen.getByText('Wszystkie serie odhaczone')).toBeTruthy();
    await tap(screen.getByText('Zakończ trening')); await flushAll(10);
    expect(global.__alerts[global.__alerts.length - 1].title).toBe('Zakończyć trening?'); /* to samo potwierdzenie co „Zakończ” */
  });
  test('przycisk karty ma własną etykietę VoiceOver (inna niż ✓ w wierszu — dwa przyciski o tej samej nazwie mylą); „↑” tylko w nagłówku ćwiczenia', async () => {
    await gymWorkout();
    expect(screen.getAllByLabelText('Seria zrobiona: Bench Press (sztanga), seria 1')).toHaveLength(1);
    expect(screen.getAllByLabelText('Seria 1 zrobiona — Bench Press (sztanga)')).toHaveLength(1); /* pole wyboru w wierszu */
  });
  test('ciężar wpisany w wierszu zmienia kartę (wartości tylko w wierszu)', async () => {
    await gymWorkout();
    await act(async () => { const a = S().active!; a.exercises[0].sets[0].weight = 60; store.save(a); }); await flushAll(10);
    await act(async () => { fireEvent(screen.getAllByLabelText('kg')[0], 'endEditing'); }); await flushAll(5);
    expect(screen.getByLabelText('Teraz: 60 kg × 8')).toBeTruthy(); /* audyt 0.10 (UI-10) */
  });
  test('widok listy (ustawienie): jak w poprzednich wersjach — bez karty (decyzja właściciela 07.10.2026: jedyna różnica to karta)', async () => {
    await gymWorkout('list');
    expect(screen.queryByText('Seria zrobiona')).toBeNull();
  });
  test('English: karta po angielsku, bez paska talerzy (Each side)', async () => {
    await fresh(undefined, 'en'); addLocation('gym'); store.startEmpty(); store.addExerciseToActive(ex('Bench Press (sztanga)'));
    const a = S().active!; a.exercises[0].sets[0].weight = 45; a.exercises[0].sets[0].reps = 5; store.save(a); await act(async () => { await store.flush(); });
    await renderApp({ saved: JSON.parse(JSON.stringify(saved())), locale: 'en' }); await flushAll(10);
    expect(screen.getByText('set 1 of 1')).toBeTruthy(); expect(screen.getByText('Set done')).toBeTruthy();
    expect(screen.queryByLabelText(/Each side/)).toBeNull(); expect(screen.queryByText(/empty bar/)).toBeNull();
  });
});

describe('ekran Ustawień: „Widok treningu”', () => {
  test('kontrolka Skupiony / Lista z opisem; zmiana zapisuje się i zmienia ekran treningu', async () => {
    await fresh(); await renderApp({ url: '/more/settings' }); await flushAll(10);
    expect(screen.queryByText(/^Skupiony: bieżąca seria/)).toBeNull(); await openInfo('workout-view'); /* ⓘ 14.10.2026: opis widoku pod ⓘ przy polu */
    expect(screen.getByText('Skupiony: bieżąca seria dużymi cyframi nad listą ćwiczeń.')).toBeTruthy();
    expect(screen.getByText('Skupiony')).toBeTruthy();
    await tap(screen.getByText('Lista')); await flushAll(5);
    expect(screen.getByText('Lista: ćwiczenia i serie jak w poprzednich wersjach, bez karty.')).toBeTruthy(); /* opis zmienia się z wyborem */
    expect(S().settings.workoutView).toBe('list'); await act(async () => { await store.flush(); }); expect(saved().settings.workoutView).toBe('list');
    await tap(screen.getByText('Skupiony')); await flushAll(5); expect(S().settings.workoutView).toBe('focus');
  });
  test('karta pokazuje wskazówkę, gdzie zmienić wartości', async () => {
    await gymWorkout(); expect(screen.getByText('Wartości zmienisz w wierszu serii poniżej.')).toBeTruthy();
  });
});
