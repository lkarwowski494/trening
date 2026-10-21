/*
 * M3 — poprawki po przebiegu E2E 39676394005 (21.10.2026): E2E-11 (tablica „teraz”: pole wpisu pod rodzicem `accessible` — ukryte przed VoiceOver i XCTest),
 * E2E-05 (Postępy: ScrollView z contentOffset ustawianym przy każdym renderze — ⓘ przewijało na górę), E2E-35 (skala wysiłku RIR w Ustawieniach → trening).
 * Rodzaje (docs/20): scenariusz, niezmiennik (strażnik dostępności tablicy), regresja. Teksty 09-lokalizacja-001…003: tests/m3-fix-e2e-teksty.test.ts.
 */
import * as store from '@/lib/store';
import * as timer from '@/lib/timer';
import { fresh, ex, saved, addWorkout, set } from './helpers';
import { renderApp, tap, flushAll, screen, act, fireEvent, openInfo } from './app';

jest.setTimeout(120000);
const S = () => store.getState();
afterEach(async () => { jest.restoreAllMocks(); try { S(); } catch { return; } await timer.stop(); await timer.stopSet(); });

/** Czy któryś przodek elementu jest grupą `accessible` (iOS chowa wtedy potomków przed VoiceOver i XCTest). */
const accessibleAncestor = (el: { parent: any; props: any }): string | null => { for (let p = el.parent; p; p = p.parent) if (p.props?.accessible === true && !(el.props.testID && p.props.testID === el.props.testID)) return String(p.props.testID ?? p.props.accessibilityLabel ?? p.type); return null; };

describe('E2E-11: tablica „teraz” — pola wpisu i przyciski poza grupą accessible', () => {
  const boot = async () => { await act(async () => { await store.flush(); }); await renderApp({ saved: JSON.parse(JSON.stringify(saved())) }); await flushAll(20); };
  test('pole wpisu ciężaru (po „Seria zrobiona” bez ciężaru), przyciski ± i wartość nie leżą pod rodzicem accessible; opis tablicy zostaje elementem accessible', async () => {
    await fresh(); store.startEmpty(); store.addExerciseToActive(ex('Bench Press (sztanga)')); await boot();
    await tap(screen.getByTestId('focus-done')); await flushAll(10);
    const input = screen.getByTestId('board-input-weight'); expect(accessibleAncestor(input)).toBeNull();
    for (const id of ['step-weight-down', 'step-weight-up', 'step-reps-down', 'step-reps-up']) expect([id, accessibleAncestor(screen.getByTestId(id))]).toEqual([id, null]);
    const d = screen.getByTestId('board-desc'); expect(d.props.accessible).toBe(true); expect(d.props.accessibilityLabel).toContain('Bench Press');
  });
  test('pole wpisu nie jest też ukryte przed VoiceOver przez rodzica (accessibilityElementsHidden)', async () => {
    await fresh(); store.startEmpty(); store.addExerciseToActive(ex('Bench Press (sztanga)')); await boot();
    await tap(screen.getByTestId('focus-done')); await flushAll(10);
    for (let p = screen.getByTestId('board-input-weight').parent; p; p = p.parent) { expect(p.props?.accessibilityElementsHidden).not.toBe(true); expect(p.props?.importantForAccessibility).not.toBe('no-hide-descendants'); }
  });
});

describe('E2E-05: Postępy — ⓘ nie zmienia przewinięcia', () => {
  const seed = () => { addWorkout(Date.now() - 3 * 864e5, [['Back Squat', [{ weight: 80, reps: 5 }]]], 'Góra A'); addWorkout(Date.now() - 2 * 864e5, [['Back Squat', [{ weight: 90, reps: 5 }]]], 'Góra A'); addWorkout(Date.now() - 864e5, [['Bench Press (sztanga)', [set({ weight: 60, reps: 8 })]]], 'Góra B'); };
  const boot = async () => { await fresh(); seed(); await act(async () => { await store.flush(); }); await renderApp({ saved: JSON.parse(JSON.stringify(saved())), url: '/progress' }); await flushAll(10); };
  const offset = () => JSON.stringify(screen.getByTestId('progress-scroll').props.contentOffset);
  test('stuknięcie ⓘ po przewinięciu: objaśnienie widoczne, a contentOffset ScrollView nie jest ustawiany z pozycji przewinięcia (skok na górę)', async () => {
    await boot(); const before = offset();
    await act(async () => { fireEvent.scroll(screen.getByTestId('progress-scroll'), { nativeEvent: { contentOffset: { x: 0, y: 1400 }, contentSize: { width: 390, height: 4000 }, layoutMeasurement: { width: 390, height: 800 } } }); });
    await act(async () => { store.save(); }); await flushAll(10); /* zmiana stanu (useTick) renderuje Postępy ponownie — jak ogłoszenie, zegar albo zapis w tle */
    await openInfo('sets-part'); await flushAll(10);
    expect(screen.getByTestId('info-text-sets-part')).toBeTruthy(); expect(offset()).toBe(before);
  });
  test('wybór chipa ćwiczenia nadal pokazuje wykres tego ćwiczenia', async () => {
    await boot(); await tap(screen.getByLabelText('Bench Press (sztanga)')); await flushAll(10);
    expect(screen.getByTestId('progress-chooser')).toBeTruthy(); expect(screen.getAllByText(/Bench Press/).length).toBeGreaterThan(0);
  });
});

describe('E2E-35: skala wysiłku RIR z Ustawień trafia do treningu', () => {
  test('stuknięcie „RIR” (testID effort-scale-rir) zapisuje effortScale i trening w widoku listy ma kolumnę RIR', async () => {
    await fresh(); S().settings.showRpe = true; S().settings.workoutView = 'list'; store.save(); store.startEmpty(); store.addExerciseToActive(ex('Bench Press (sztanga)'));
    await act(async () => { await store.flush(); }); await renderApp({ saved: JSON.parse(JSON.stringify(saved())), url: '/more/settings' }); await flushAll(10);
    await tap(screen.getByTestId('effort-scale-rir')); await flushAll(10);
    expect(S().settings.effortScale).toBe('rir');
    await act(async () => { await store.flush(); }); await renderApp({ saved: JSON.parse(JSON.stringify(saved())), url: '/' }); await flushAll(20); /* nowe uruchomienie: ustawienie przetrwało zapis */
    const hid = { includeHiddenElements: true }; expect(screen.getAllByText('RIR', hid).length).toBeGreaterThan(0); expect(screen.queryAllByText('RPE', hid)).toHaveLength(0); /* nagłówek kolumny jest ukryty przed VoiceOver (A11-18) */
  });
});
