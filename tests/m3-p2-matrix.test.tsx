/*
 * M3 p2 — pozycje macierzy testów dla tablicy „teraz” (komunikaty VoiceOver, nagłówek sekcji, haptyka): każdy tekst i funkcja z tablicy ma tu scenariusz
 * na prawdziwym ekranie (nie tylko wzmiankę). Reszta: tests/m3-p2-board-ui.test.tsx (UI), tests/m3-p2-board-logic.test.ts (logika), tests/m3-p2-haptics.test.ts.
 */
import { AccessibilityInfo } from 'react-native';
import * as store from '@/lib/store';
import * as timer from '@/lib/timer';
import { t as tr } from '@/lib/i18n';
import { hapticsOn } from '@/lib/haptics';
import { applyUnit } from '@/lib/units';
import { __resetRestNoticesForTests } from '@/components/ActiveWorkout';
import { fresh, ex, saved } from './helpers';
import { renderApp, tap, flushAll, screen, act } from './app';

jest.setTimeout(120000);
const S = () => store.getState(); const A = () => S().active!;
const G = global as unknown as { __haptics: string[] };
afterEach(async () => { applyUnit('kg'); jest.restoreAllMocks(); try { S(); } catch { return; } await timer.stop(); await timer.stopSet(); });
beforeEach(() => { __resetRestNoticesForTests(); G.__haptics.length = 0; });
const boot = async () => { await act(async () => { await store.flush(); }); await renderApp({ saved: JSON.parse(JSON.stringify(saved())), locale: 'pl' }); await flushAll(20); };
const label = () => screen.getByTestId('board-desc').props.accessibilityLabel as string;

describe('M3 p2: komunikaty i funkcje tablicy „teraz”', () => {
  test('„Zakończ serię: {ex}, seria {n}” — przycisk tablicy podczas stopera serii na czas ma pełną etykietę i kończy serię', async () => {
    await fresh(); store.startEmpty(); store.addExerciseToActive(ex('Plank')); A().exercises[0].sets[0].durationSec = 30; await boot();
    await tap(screen.getByTestId('focus-start')); await flushAll(20);
    expect(screen.getByTestId('focus-finish-set').props.accessibilityLabel).toBe(tr('Zakończ serię: {ex}, seria {n}', { ex: 'Plank', n: 1 }));
    await tap(screen.getByTestId('focus-finish-set')); await flushAll(30); expect(A().exercises[0].sets[0].done).toBe(true);
  });
  test('„lista serii przewijana” — powyżej 12 serii opis tablicy mówi, że lista pól się przewija', async () => {
    await fresh(); store.startEmpty(); store.addExerciseToActive(ex('Back Squat')); for (let i = 1; i < 14; i++) store.addSet(0); await boot();
    expect(label()).toContain(tr('lista serii przewijana')); expect(label()).toContain('lista serii przewijana');
  });
  test('„Rozgrzewki: {d} z {n} zrobione” — opis tablicy liczy rozgrzewki osobno od serii roboczych', async () => {
    await fresh(); store.startEmpty(); store.addExerciseToActive(ex('Back Squat')); store.addSet(0); A().exercises[0].sets[0].kind = 'warmup'; await boot();
    expect(label()).toContain(tr('Rozgrzewki: {d} z {n} zrobione', { d: 0, n: 1 })); expect(label()).toContain('Rozgrzewki: 0 z 1 zrobione');
  });
  test('„Przerwa. Pozostały czas: {t}. Cała przerwa: {all}.” — zegar na tablicy w przerwie czytany jako ile zostało i ile trwa całość (09-lokalizacja-001: bez przyimka przed liczbą)', async () => {
    await fresh(); store.startEmpty(); store.addExerciseToActive(ex('Back Squat')); A().exercises[0].sets[0].weight = 100; A().exercises[0].sets[0].reps = 5; await boot();
    await tap(screen.getByTestId('focus-done')); await flushAll(30);
    const rest = screen.getByTestId('board-rest').props.accessibilityLabel as string; expect(rest.startsWith('Przerwa. Pozostały czas: ')).toBe(true); expect(rest).toMatch(/^Przerwa\. Pozostały czas: .+\. Cała przerwa: .+\./); expect(rest).not.toMatch(/ z \d+ (minut|sekund)/); /* dawniej „z 2 minuty” (zły przypadek) */
  });
  test('„Wpisz {co}, żeby zapisać serię.” — „Seria zrobiona” bez wartości ogłasza brakujące pole i wibruje ostrzegawczo; hapticsOn() zależy od przełącznika dźwięku', async () => {
    await fresh(); store.startEmpty(); store.addExerciseToActive(ex('Back Squat')); await boot();
    const spy = jest.spyOn(AccessibilityInfo, 'announceForAccessibility').mockImplementation(() => {});
    expect(hapticsOn()).toBe(true); await tap(screen.getByTestId('focus-done')); await flushAll(10);
    expect(spy).toHaveBeenCalledWith(tr('Wpisz {co}, żeby zapisać serię.', { co: tr('ciężar') })); expect(G.__haptics).toEqual(['notification:warning']);
    await act(async () => { S().settings.sound = false; }); expect(hapticsOn()).toBe(false);
  });
  test('„Następne ćwiczenia” — nagłówek sekcji nad blokami kolejnych ćwiczeń (po bieżącym)', async () => {
    await fresh(); store.startEmpty(); store.addExerciseToActive(ex('Back Squat')); store.addExerciseToActive(ex('Bench Press (sztanga)')); await boot();
    expect(screen.getByText('Następne ćwiczenia')).toBeTruthy();
  });
});
