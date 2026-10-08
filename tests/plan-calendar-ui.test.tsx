/*
 * Kalendarz z planem tygodnia — ekrany (decyzje właściciela 08.10.2026: 1A zakładka Kalendarz, 2A plan tygodnia + dwa tryby przesuwania).
 * Rodzaje (docs/20): ekran (plan tygodnia, panel dnia, przesuwanie, konflikt i „Zamień miejscami”, wolne/inny/dodaj/przywróć, opuszczony →
 * na dziś, start), scenariusz (plan → kalendarz → start z ekranu treningu), języki (EN), VoiceOver (etykiety dni). E2E: .maestro/13.
 */
import * as store from '@/lib/store';
import * as plan from '@/lib/plan';
import { applyLang } from '@/lib/i18n';
import { fresh, saved, withDemoTemplates, addWorkout } from './helpers';
import { renderApp, flushAll, screen, tap, act, go } from './app';

const NOW = new Date(2026, 9, 8, 9, 0); /* czwartek */
const S = () => store.getState();
afterEach(() => { applyLang('pl'); });
const boot = async (fn: (ids: string[]) => void, url = '/history', locale: 'pl' | 'en' = 'pl') => {
  jest.useFakeTimers({ now: NOW }); await fresh(undefined, locale); const t = withDemoTemplates(); fn(t.map(x => x.id));
  await act(async () => { await store.flush(); }); await renderApp({ saved: JSON.parse(JSON.stringify(saved())), locale, url }); jest.setSystemTime(NOW.getTime()); await flushAll(10);
  return t;
};
const alertBtn = async (title: string, btn: string) => { const a = [...global.__alerts].reverse().find(x => x.title === title)!; expect(a).toBeTruthy(); await act(async () => { a.buttons!.find(b => b.text === btn)!.onPress?.(); }); await flushAll(5); };

describe('plan tygodnia (/plan)', () => {
  test('wybór szablonu na dzień i „Wolne”; opis; zapis', async () => {
    const t = await boot(() => {}, '/plan');
    expect(screen.getByText('Plan powtarza się co tydzień. Pojedyncze dni zmienisz w Kalendarzu.')).toBeTruthy();
    await tap(screen.getByLabelText(`poniedziałek: ${t[0].name}`)); await flushAll(5);
    expect(plan.weekPlanDays()[0]).toBe(t[0].id);
    await tap(screen.getByLabelText('poniedziałek: Wolne')); await flushAll(5); expect(S().weekPlan).toBeUndefined();
  });
});

describe('plan tygodnia bez szablonów', () => {
  test('„Nie masz jeszcze szablonów.”', async () => {
    jest.useFakeTimers({ now: NOW }); await fresh(); await act(async () => { await store.flush(); }); await renderApp({ saved: JSON.parse(JSON.stringify(saved())), url: '/plan' }); await flushAll(10);
    expect(screen.getByText('Nie masz jeszcze szablonów.')).toBeTruthy();
  });
});

describe('Kalendarz', () => {
  test('bez planu: podpowiedź i przycisk „Plan tygodnia”; tytuł i zakładka „Kalendarz”', async () => {
    await boot(() => {});
    expect(screen.getByText('Ustaw plan tygodnia, by widzieć zaplanowane treningi i przesuwać je w kalendarzu.')).toBeTruthy();
    expect(screen.getByRole('header', { name: 'Kalendarz' })).toBeTruthy(); expect(screen.getByText('Plan tygodnia')).toBeTruthy();
  });
  test('dni z planem: etykiety VoiceOver „zaplanowany” / „opuszczony”; panel dnia', async () => {
    const t = await boot(ids => { plan.setWeekDay(0, ids[0]); plan.setWeekDay(3, ids[1]); });
    expect(screen.getByLabelText(`8 października 2026, zaplanowany: ${t[1].name}`)).toBeTruthy();
    expect(screen.getByLabelText(`5 października 2026, opuszczony: ${t[0].name}`)).toBeTruthy();
    await tap(screen.getByTestId('cal-2026-10-08')); await flushAll(5);
    expect(screen.getByTestId('day-panel')).toBeTruthy(); expect(screen.getByText(`Zaplanowany: ${t[1].name}`)).toBeTruthy();
    await tap(screen.getByTestId('cal-2026-10-05')); await flushAll(5); expect(screen.getByText(`Opuszczony: ${t[0].name}`)).toBeTruthy();
    await tap(screen.getByText('Przenieś na dziś')); await flushAll(5);
    await alertBtn('Ten dzień jest zajęty', 'Zamień miejscami');
    expect([plan.plannedOn('2026-10-05'), plan.plannedOn('2026-10-08')]).toEqual([t[1].id, t[0].id]);
  });
  test('„Przesuń plan o 1 dzień”: łańcuch do pierwszego wolnego dnia, komunikat z listą przesunięć', async () => {
    const t = await boot(ids => { plan.setWeekDay(3, ids[0]); plan.setWeekDay(4, ids[1]); });
    await tap(screen.getByTestId('cal-2026-10-08')); await flushAll(5); await tap(screen.getByText('Przesuń plan o 1 dzień')); await flushAll(5);
    const a = global.__alerts.find(x => x.title === 'Plan przesunięty')!; expect(a.msg).toMatch(new RegExp(`^${t[0].name} → .*9\\.10.*, ${t[1].name} → .*10\\.10`));
    expect([plan.plannedOn('2026-10-08'), plan.plannedOn('2026-10-09'), plan.plannedOn('2026-10-10')]).toEqual([null, t[0].id, t[1].id]);
  });
  test('„Przesuń tylko ten trening”: wolny dzień — od razu; zajęty — pytanie, „Anuluj” nic nie zmienia', async () => {
    const t = await boot(ids => { plan.setWeekDay(3, ids[0]); plan.setWeekDay(4, ids[1]); });
    await tap(screen.getByTestId('cal-2026-10-08')); await flushAll(5); await tap(screen.getByText('Przesuń tylko ten trening')); await flushAll(5);
    expect(screen.getByText('Na który dzień? Zajęte dni są oznaczone nazwą treningu.')).toBeTruthy();
    await tap(screen.getByLabelText(new RegExp(`^piątek, 9 października, zajęty: ${t[1].name}$`))); await flushAll(5);
    const a = [...global.__alerts].reverse().find(x => x.title === 'Ten dzień jest zajęty')!; expect(a.msg).toBe(`piątek, 9 października: ${t[1].name}. Bez Twojej zgody nie przesuwam na dzień z innym treningiem.`);
    await alertBtn('Ten dzień jest zajęty', 'Anuluj'); expect(plan.plannedOn('2026-10-08')).toBe(t[0].id);
    await tap(screen.getByText('Przesuń tylko ten trening')); await flushAll(5); await tap(screen.getByLabelText('sobota, 10 października')); await flushAll(5);
    expect([plan.plannedOn('2026-10-08'), plan.plannedOn('2026-10-10')]).toEqual([null, t[0].id]);
  });
  test('inny trening / wolne w tym dniu / przywróć z planu / dodaj trening na wolny dzień', async () => {
    const t = await boot(ids => { plan.setWeekDay(3, ids[0]); });
    await tap(screen.getByTestId('cal-2026-10-08')); await flushAll(5);
    await tap(screen.getByText('Inny trening')); await flushAll(5); await tap(screen.getByText(t[2].name)); await flushAll(5);
    expect(plan.plannedOn('2026-10-08')).toBe(t[2].id); expect(screen.getByText(`Zaplanowany: ${t[2].name} · zmiana planu`)).toBeTruthy();
    await tap(screen.getByText('Przywróć z planu')); await flushAll(5); expect(plan.plannedOn('2026-10-08')).toBe(t[0].id);
    await tap(screen.getByText('Wolne w tym dniu')); await flushAll(5); expect(plan.plannedOn('2026-10-08')).toBeNull(); expect(screen.getByText('Wolne · zmiana planu')).toBeTruthy();
    await tap(screen.getByTestId('cal-2026-10-10')); await flushAll(5); await tap(screen.getByText('Dodaj trening')); await flushAll(5); await tap(screen.getByText(t[1].name)); await flushAll(5);
    expect(plan.plannedOn('2026-10-10')).toBe(t[1].id);
  });
  test('start zaplanowanego treningu z panelu dziś', async () => {
    const t = await boot(ids => { plan.setWeekDay(3, ids[0]); });
    await tap(screen.getByTestId('cal-2026-10-08')); await flushAll(5); await tap(screen.getByLabelText(`Start zaplanowanego treningu: ${t[0].name}`)); await flushAll(10);
    expect(S().active?.templateId).toBe(t[0].id);
  });
});

describe('ekran treningu: „Dziś” i podgląd tygodnia', () => {
  test('bez planu — brak karty; z planem — „Dziś: X”, start, podgląd 7 dni dla VoiceOver; dzień wolny; po treningu „zrobione”', async () => {
    await boot(() => {}, '/'); expect(screen.queryByTestId('today-plan')).toBeNull();
    const t = await boot(ids => { plan.setWeekDay(3, ids[0]); plan.setWeekDay(4, ids[1]); }, '/');
    expect(screen.getByText(`Dziś: ${t[0].name}`)).toBeTruthy();
    expect(screen.getByLabelText(new RegExp(`^Plan na 7 dni: czw\\. ${t[0].name}, pt\\. ${t[1].name}, sob\\. wolne, .*Tapnij, by otworzyć Kalendarz\\.$`))).toBeTruthy();
    const strip = 'Plan na 7 dni: {list}. Tapnij, by otworzyć Kalendarz.'; expect(screen.getByLabelText(new RegExp('^' + strip.split('{list}')[0]))).toBeTruthy(); /* tekst z t() — macierz */
    await tap(screen.getByLabelText(new RegExp('^Plan na 7 dni:'))); await flushAll(10); expect(screen.getByRole('header', { name: 'Kalendarz' })).toBeTruthy(); await go('/'); await flushAll(10);
    await tap(screen.getByLabelText(`Start zaplanowanego treningu: ${t[0].name}`)); await flushAll(10); expect(S().active?.templateId).toBe(t[0].id);
    await boot(ids => { plan.setWeekDay(4, ids[1]); }, '/'); expect(screen.getByText('Dziś wolne')).toBeTruthy();
    const t3 = await boot(ids => { plan.setWeekDay(3, ids[0]); addWorkout(new Date(2026, 9, 8, 7).getTime(), [['Back Squat', [{ weight: 100, reps: 5 }]]]); }, '/');
    expect(screen.getByText(`Dziś: ${t3[0].name} · zrobione`)).toBeTruthy(); expect(screen.queryByLabelText(`Start zaplanowanego treningu: ${t3[0].name}`)).toBeNull();
  });
  test('lista sesji w Kalendarzu pokazuje czas bez pauz', async () => {
    await boot(() => { const w = addWorkout(new Date(2026, 9, 7, 18).getTime(), [['Back Squat', [{ weight: 100, reps: 5 }]]]); w.pauses = [[w.startedAt + 60e3, w.startedAt + 16 * 60e3]]; store.save(); });
    expect(screen.getAllByText(/ · 45:00 · /).length).toBeGreaterThan(0);
  });
  test('English', async () => {
    const t = await boot(ids => { plan.setWeekDay(3, ids[0]); }, '/', 'en');
    expect(screen.getByText(`Today: ${t[0].name}`)).toBeTruthy();
    await go('/history'); await flushAll(10); expect(screen.getByRole('header', { name: 'Calendar' })).toBeTruthy(); expect(screen.getByText('Weekly plan')).toBeTruthy();
    await tap(screen.getByTestId('cal-2026-10-08')); await flushAll(5); expect(screen.getByText('Move plan by 1 day')).toBeTruthy(); expect(screen.getByText('Move only this workout')).toBeTruthy();
  });
});
