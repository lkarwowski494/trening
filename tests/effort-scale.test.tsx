/*
 * Skala wysiłku RPE / RIR (pakiet C, 08.10.2026): w danych zawsze RPE (jedno źródło prawdy), RIR = 10 − RPE — Zourdos i in., JSCR 2016,
 * streszczenie: „RPE-10 = 0-RIR, RPE-9 = 1-RIR, and so forth” (docs/21 sekcja 5, B1). Ustawienie Settings.effortScale.
 * Rodzaje (docs/20): logika (przeliczenie, granice), dane (sanityzacja, zapis zawsze w RPE), ekran (ustawienia, trening, historia,
 * edytor), języki (EN), niezmiennik (RPE → RIR → RPE bez zmian). E2E: .maestro/09 (język i wygląd — przełącznik skali).
 */
import * as store from '@/lib/store';
import { applyLang } from '@/lib/i18n';
import { fresh, addWorkout, saved, ex } from './helpers';
import { renderApp, flushAll, screen, tap, type, act } from './app';

const S = () => store.getState();
beforeEach(async () => { await fresh(); });
afterEach(() => { applyLang('pl'); });
const scale = (v: 'rpe' | 'rir', show = true) => { S().settings.showRpe = show; S().settings.effortScale = v; store.save(); };

describe('logika', () => {
  test('RPE: bez zmian; RIR: 10 − RPE w obie strony, z dziesiątymi, w granicach 0–10; puste zostaje puste', () => {
    scale('rpe'); expect([store.effortOut(8), store.effortIn(8), store.effortLabel()]).toEqual([8, 8, 'RPE']);
    scale('rir'); expect([store.effortOut(8), store.effortOut(10), store.effortOut(8.5), store.effortIn(2), store.effortIn(1.5), store.effortLabel()]).toEqual([2, 0, 1.5, 8, 8.5, 'RIR']);
    expect([store.effortIn(12), store.effortIn(-3), store.effortIn(''), store.effortField(''), store.effortField(null), store.effortField(7)]).toEqual([0, 10, '', '', '', 3]);
  });
  test('niezmiennik: RPE → RIR → RPE daje to samo dla całej skali co 0,5', () => {
    scale('rir'); for (let r = 0; r <= 10; r += 0.5) expect(store.effortIn(store.effortOut(r))).toBe(r);
  });
  test('opis serii: RPE „@8”, RIR „RIR 2”', () => {
    const w = addWorkout(Date.now() - 864e5, [['Back Squat', [{ weight: 100, reps: 5, rpe: 8 }]]]); const e = ex('Back Squat'); const s = w.exercises[0].sets[0];
    scale('rpe'); expect(store.setSummary(e, s)).toMatch(/ @8$/); scale('rir'); expect(store.setSummary(e, s)).toMatch(/ RIR 2$/);
  });
});

describe('dane', () => {
  test('domyślnie RPE; zła wartość ustawienia → RPE; RIR przetrwa zapis i odczyt', async () => {
    expect([S().settings.effortScale, store.effortScale()]).toEqual([undefined, 'rpe']);
    (S().settings as any).effortScale = 'borg'; await store.flush(); await fresh(saved()); expect([S().settings.effortScale, store.effortScale()]).toEqual([undefined, 'rpe']);
    scale('rir'); await store.flush(); await fresh(saved()); expect(S().settings.effortScale).toBe('rir');
  });
});

describe('ekran', () => {
  test('Ustawienia: wybór skali tylko przy włączonym polu; RIR z opisem i źródłem; wybór zapisany', async () => {
    await renderApp({ url: '/more/settings' }); await flushAll(10);
    expect(screen.queryByText('Skala wysiłku')).toBeNull();
    await act(async () => { S().settings.showRpe = true; store.save(); }); await flushAll(5);
    expect(screen.getAllByText('Skala wysiłku').length).toBeGreaterThan(0);
    expect(screen.getByText('RIR — powtórzenia w zapasie: RIR = 10 − RPE (RPE 10 = 0 RIR, RPE 9 = 1 RIR; Zourdos i in., JSCR 2016). Zapisane wartości przeliczają się przy zmianie skali.')).toBeTruthy();
    await tap(screen.getByLabelText('RIR')); await flushAll(5); expect(S().settings.effortScale).toBe('rir');
  });
  test('trening: kolumna „RIR”, wpis 2 zapisuje RPE 8; historia i edytor pokazują RIR', async () => {
    await fresh(); scale('rir'); store.startEmpty(); store.addExerciseToActive(ex('Back Squat')); await act(async () => { await store.flush(); });
    await renderApp({ saved: JSON.parse(JSON.stringify(saved())) }); await flushAll(10);
    expect(screen.getAllByText('RIR').length).toBeGreaterThan(0);
    await type(screen.getAllByLabelText('RIR')[0], '2'); await flushAll(5);
    expect(S().active!.exercises[0].sets[0].rpe).toBe(8);
    const w = addWorkout(Date.now() - 864e5, [['Back Squat', [{ weight: 100, reps: 5, rpe: 9 }]]]); await act(async () => { await store.flush(); });
    await renderApp({ saved: JSON.parse(JSON.stringify(saved())), url: `/history/${w.id}` }); await flushAll(10);
    expect(screen.getByLabelText(/RIR: 1(,|$)/)).toBeTruthy();
    await renderApp({ saved: JSON.parse(JSON.stringify(saved())), url: `/history/edit/${w.id}` }); await flushAll(10);
    expect(screen.getAllByLabelText('RIR')[0].props.value).toBe('1');
  });
  test('English: same labels (RPE/RIR are international), explanation translated', async () => {
    await fresh(undefined, 'en'); S().settings.showRpe = true; store.save(); await act(async () => { await store.flush(); });
    await renderApp({ saved: JSON.parse(JSON.stringify(saved())), locale: 'en', url: '/more/settings' }); await flushAll(10);
    expect(screen.getAllByText('Effort scale').length).toBeGreaterThan(0); expect(screen.getByText(/^RIR — reps in reserve: RIR = 10 − RPE/)).toBeTruthy();
  });
});
