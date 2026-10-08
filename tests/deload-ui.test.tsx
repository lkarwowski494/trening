/*
 * Deload A+B na ekranach (decyzje właściciela 08.10.2026). A: Kalendarz — podpowiedź po 4 tygodniach treningu z rzędu (praktyka, nie wynik badań),
 * „Zaplanuj deload od …”, informacja o oznaczonym tygodniu, „Zdejmij oznaczenie deload”, tło wiersza tygodnia deload + objaśnienie, VoiceOver.
 * B: w tygodniu deload każdy „Start” z szablonu (ekran treningu, „Dziś”, panel dnia, ekran szablonu) pyta: mniej serii / pełny trening / anuluj.
 * Języki: EN. Logika: tests/deload-plan.test.ts. E2E: .maestro/13.
 */
import * as store from '@/lib/store';
import * as plan from '@/lib/plan';
import { deloadKeep } from '@/lib/deload';
import { deloadCounts } from '@/lib/start';
import { applyLang } from '@/lib/i18n';
import { fresh, saved, withDemoTemplates, addWorkout } from './helpers';
import { renderApp, flushAll, screen, tap, act, go } from './app';

const NOW = new Date(2026, 9, 8, 9, 0); /* czwartek; tydzień od 5.10 */
const S = () => store.getState();
afterEach(() => { applyLang('pl'); });
const at = (m: number, d: number) => new Date(2026, m, d, 18).getTime();
const streak4 = () => [[8, 14], [8, 21], [8, 28], [9, 6]].forEach(([m, d]) => addWorkout(at(m, d), [['Back Squat', [{ weight: 100, reps: 5 }]]]));
const boot = async (fn: (ids: string[]) => void, url = '/history', locale: 'pl' | 'en' = 'pl') => {
  jest.useFakeTimers({ now: NOW }); await fresh(undefined, locale); const t = withDemoTemplates(); fn(t.map(x => x.id));
  await act(async () => { await store.flush(); }); await renderApp({ saved: JSON.parse(JSON.stringify(saved())), locale, url }); jest.setSystemTime(NOW.getTime()); await flushAll(10);
  return t;
};
const lastAlert = (title: string) => [...global.__alerts].reverse().find(x => x.title === title);
const press = async (title: string, btn: string) => { const a = lastAlert(title)!; expect(a).toBeTruthy(); await act(async () => { a.buttons!.find(b => b.text === btn)!.onPress?.(); }); await flushAll(5); };

describe('A: Kalendarz', () => {
  test('bez 4 tygodni z rzędu — brak podpowiedzi', async () => {
    await boot(() => { addWorkout(at(9, 6), [['Back Squat', [{ weight: 100, reps: 5 }]]]); }); expect(screen.queryByTestId('deload-hint')).toBeNull();
  });
  test('4 tygodnie z rzędu: podpowiedź (praktyka, nie wynik badań) → „Zaplanuj deload od …” → informacja, tło wiersza, VoiceOver; „Zdejmij oznaczenie deload”', async () => {
    await boot(streak4);
    expect(screen.getByText('Tygodnie treningu z rzędu bez deloadu: 4. Trenerzy zwykle robią deload co 4–6 tygodni — to praktyka, nie wynik badań.')).toBeTruthy();
    await tap(screen.getByText(/^Zaplanuj deload od pon\.,? 12\.10/)); await flushAll(5);
    expect(S().deloadWeeks).toEqual(['2026-10-12']);
    expect(screen.getByText(/^Od pon\.,? 12\.10: tydzień deload\. Przy starcie treningu zaproponuję mniej serii \(około połowy\), ciężary bez zmian\.$/)).toBeTruthy();
    const nx = 'Od {date}: tydzień deload. Przy starcie treningu zaproponuję mniej serii (około połowy), ciężary bez zmian.'; expect(screen.getByText(new RegExp('^' + nx.split('{date}')[0]))).toBeTruthy(); /* tekst z t() — macierz */
    expect(screen.getByTestId('cal-deload-2026-10-12')).toBeTruthy(); expect(screen.queryByTestId('cal-deload-2026-10-05')).toBeNull();
    expect(screen.getByText('Wiersz z tłem — tydzień deload.')).toBeTruthy();
    expect(screen.getByLabelText('14 października 2026, tydzień deload')).toBeTruthy();
    await tap(screen.getByText('Zdejmij oznaczenie deload')); await flushAll(5); expect(S().deloadWeeks).toBeUndefined();
    expect(screen.queryByText('Wiersz z tłem — tydzień deload.')).toBeNull();
  });
  test('bieżący tydzień oznaczony: „Ten tydzień: deload…”; zdjęcie oznaczenia', async () => {
    await boot(() => { store.toggleDeloadWeek(NOW.getTime()); });
    expect(screen.getByText('Ten tydzień: deload. Przy starcie treningu zaproponuję mniej serii (około połowy), ciężary bez zmian.')).toBeTruthy();
    await tap(screen.getByText('Zdejmij oznaczenie deload')); await flushAll(5); expect(S().deloadWeeks).toBeUndefined(); expect(screen.queryByTestId('deload-hint')).toBeNull();
  });
});

describe('B: start w tygodniu deload', () => {
  test('ekran treningu: pytanie z liczbą serii; „Mniej serii” — około połowy, ciężary bez zmian; „Pełny trening”; „Anuluj”', async () => {
    const t = await boot(() => { store.toggleDeloadWeek(NOW.getTime()); }, '/');
    const c = deloadCounts(t[0]); expect(c.less).toBeLessThan(c.full);
    await tap(screen.getByLabelText(`Start: ${t[0].name}`)); await flushAll(5);
    expect(lastAlert('Tydzień deload')!.msg).toBe(`Zacząć z mniejszą liczbą serii: ${c.less} zamiast ${c.full} serii roboczych? Ciężary bez zmian, szablon się nie zmienia.`);
    await press('Tydzień deload', 'Anuluj'); expect(S().active).toBeNull();
    await tap(screen.getByLabelText(`Start: ${t[0].name}`)); await flushAll(5); await press('Tydzień deload', 'Pełny trening');
    const full = S().active!.exercises.map(e => e.sets.filter(s => s.kind !== 'warmup').length); const w0 = S().active!.exercises.map(e => e.sets.map(s => s.weight));
    act(() => { S().active = null; store.save(); }); await flushAll(5);
    await tap(screen.getByLabelText(`Start: ${t[0].name}`)); await flushAll(5); await press('Tydzień deload', 'Mniej serii');
    expect(S().active!.exercises.map(e => e.sets.filter(s => s.kind !== 'warmup').length)).toEqual(full.map(deloadKeep));
    S().active!.exercises.forEach((e, i) => e.sets.forEach((s, j) => expect(s.weight).toBe(w0[i][j])));
  });
  test('poza tygodniem deload — start od razu, bez pytania', async () => {
    const t = await boot(() => {}, '/'); await tap(screen.getByLabelText(`Start: ${t[0].name}`)); await flushAll(5);
    expect(lastAlert('Tydzień deload')).toBeUndefined(); expect(S().active?.templateId).toBe(t[0].id);
  });
  test('„Dziś” na ekranie treningu, panel dnia w Kalendarzu i ekran szablonu też pytają', async () => {
    let t = await boot(ids => { store.toggleDeloadWeek(NOW.getTime()); plan.setWeekDay(3, ids[0]); }, '/');
    await tap(screen.getByLabelText(`Start zaplanowanego treningu: ${t[0].name}`)); await flushAll(5); expect(lastAlert('Tydzień deload')).toBeTruthy(); await press('Tydzień deload', 'Mniej serii'); expect(S().active?.templateId).toBe(t[0].id);
    global.__alerts.length = 0;
    t = await boot(ids => { store.toggleDeloadWeek(NOW.getTime()); plan.setWeekDay(3, ids[0]); });
    await tap(screen.getByTestId('cal-2026-10-08')); await flushAll(5); await tap(screen.getByLabelText(`Start zaplanowanego treningu: ${t[0].name}`)); await flushAll(5);
    expect(lastAlert('Tydzień deload')).toBeTruthy(); await press('Tydzień deload', 'Pełny trening'); expect(S().active?.templateId).toBe(t[0].id);
    global.__alerts.length = 0;
    t = await boot(() => { store.toggleDeloadWeek(NOW.getTime()); }, '/'); const id = t[1].id; await go(`/template/${id}`); await flushAll(10);
    await tap(screen.getByText('Start')); await flushAll(5); expect(lastAlert('Tydzień deload')).toBeTruthy(); await press('Tydzień deload', 'Mniej serii'); expect(S().active?.templateId).toBe(id);
  });
});

describe('English', () => {
  test('hint and start question', async () => {
    const t = await boot(streak4, '/history', 'en');
    expect(screen.getByText('Training weeks in a row without a deload: 4. Coaches usually deload every 4–6 weeks — this is practice, not a research finding.')).toBeTruthy();
    expect(screen.getByText(/^Plan a deload from /)).toBeTruthy();
    act(() => { store.toggleDeloadWeek(NOW.getTime()); }); await flushAll(5);
    expect(screen.getByText('This week: deload. When you start a workout I will suggest fewer sets (about half), same weights.')).toBeTruthy();
    expect(screen.getByText('Row with background — deload week.')).toBeTruthy();
    expect(t.length).toBeGreaterThan(0);
  });
});
