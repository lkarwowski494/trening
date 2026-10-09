/*
 * Scenariusze z restartem aplikacji dla funkcji z 07–09.10 (audyt 0.10, fala 2, obszar TESTY — M3 / TST-03, docs/20 rodzaj 3). Wcześniej ekrany planu,
 * kilku planów, generatora, deloadu i filtra „Podstawowe” miały testy ekranów i logiki z restartem, ale żaden przepływ użytkownika nie przechodził
 * przez ponowne uruchomienie aplikacji w trakcie. Tu: przepływ na ekranach → zapis → restart (nowe wczytanie z „bazy”) → dalszy ciąg na ekranach.
 */
import * as store from '@/lib/store';
import * as plan from '@/lib/plan';
import { deloadCounts } from '@/lib/start';
import { applyLang } from '@/lib/i18n';
import { fresh, saved, withDemoTemplates, addWorkout } from './helpers';
import { renderApp, flushAll, screen, tap, act, go } from './app';

jest.setTimeout(120000);
const NOW = new Date(2026, 9, 8, 9, 0); /* czwartek 8.10.2026 */
const S = () => store.getState();
afterEach(() => { applyLang('pl'); });
const boot = async (url: string, fn: (ids: string[]) => void = () => {}) => {
  jest.useFakeTimers({ now: NOW }); await fresh(); const t = withDemoTemplates(); fn(t.map(x => x.id));
  await act(async () => { await store.flush(); }); await renderApp({ saved: JSON.parse(JSON.stringify(saved())), url }); jest.setSystemTime(NOW.getTime()); await flushAll(10);
  return t;
};
/** Restart aplikacji: zapis do „bazy”, nowe wczytanie stanu (migrate) i nowy ekran pod `url`. */
const restart = async (url: string) => { await act(async () => { await store.flush(); }); const s = saved(); await renderApp({ saved: JSON.parse(JSON.stringify(s)), url }); jest.setSystemTime(NOW.getTime()); await flushAll(10); };
const lastAlert = (title: string) => [...global.__alerts].reverse().find(x => x.title === title);
const press = async (title: string, btn: string) => { const a = lastAlert(title)!; expect(a).toBeTruthy(); await act(async () => { a.buttons!.find(b => b.text === btn)!.onPress?.(); }); await flushAll(10); };

test('plan tygodnia → restart → Kalendarz i ekran Trening: plan obowiązuje, dzisiejszy trening startuje z karty „Dziś”', async () => {
  const t = await boot('/plan');
  await tap(screen.getByLabelText('czwartek, Wolne')); await flushAll(5); await tap(screen.getByLabelText(`czwartek: ${t[0].name}`)); await flushAll(5);
  await tap(screen.getByLabelText('sobota, Wolne')); await flushAll(5); await tap(screen.getByLabelText(`sobota: ${t[1].name}`)); await flushAll(5);
  await restart('/plan');
  expect(plan.weekPlanDays()).toEqual([null, null, null, t[0].id, null, t[1].id, null]);
  expect(screen.getByLabelText(`czwartek, ${t[0].name}`)).toBeTruthy(); expect(screen.getByLabelText(`sobota, ${t[1].name}`)).toBeTruthy();
  expect(S().planHistory?.map(h => h.from)).toEqual(['2026-10-08']); /* historia planu (A1) przeżyła restart — od dziś */
  await go('/'); await flushAll(10);
  expect(plan.dayStatus('2026-10-08').status).toBe('planned');
  await tap(screen.getByLabelText(`Start: ${t[0].name}`)); await flushAll(10); expect(S().active?.templateId).toBe(t[0].id);
  await restart('/'); expect(S().active?.templateId).toBe(t[0].id); /* trening z planu w toku przeżywa restart */
});

test('kilka planów: „+ Nowy plan” → dzień → „Ustaw jako aktywny” → restart → aktywny nowy, poprzedni w „Inne plany” — i z powrotem', async () => {
  const t = await boot('/plan', ids => { plan.setWeekDay(0, ids[0]); plan.setPlanName('Rutyna'); });
  await tap(screen.getByText('+ Nowy plan')); await flushAll(10);
  const id = plan.savedPlans()[0].id; plan.setSavedDay(id, 2, t[1].id); /* edycja zapisanego planu (ten sam ekran z ?id=) — dzień środy */
  await restart(`/plan?id=${id}`);
  await tap(screen.getAllByText('Ustaw jako aktywny')[0]); await flushAll(5); await press(`Ustawić „${plan.savedPlans().find(p => p.id === id)!.name}” jako aktywny plan?`, 'Ustaw');
  await restart('/plan');
  expect(plan.weekPlanDays()).toEqual([t[0].id, null, t[1].id, null, null, null, null]);
  expect(plan.savedPlans().map(p => p.name)).toEqual(['Rutyna']); expect(screen.getByText('Inne plany')).toBeTruthy();
  await tap(screen.getByLabelText('Ustaw jako aktywny: Rutyna')); await flushAll(5); await press('Ustawić „Rutyna” jako aktywny plan?', 'Ustaw');
  await restart('/plan'); expect(plan.planName()).toBe('Rutyna'); expect(plan.weekPlanDays()[0]).toBe(t[0].id); expect(plan.weekPlanDays()[2]).toBeNull();
});

test('generator: zapis i aktywacja → restart → szablony w „Wygenerowane”, plan aktywny w Kalendarzu', async () => {
  await boot('/generator', () => { S().templates.length = 0; store.save(); });
  await tap(screen.getByText('Zapisz szablony i plan')); await flushAll(5); await press('Ustawić nowy plan jako aktywny?', 'Ustaw jako aktywny');
  const names = S().templates.map(x => [x.name, x.folder]); const days = plan.weekPlanDays();
  expect(names.length).toBeGreaterThan(1); expect(days.filter(Boolean).length).toBe(3);
  await restart('/templates');
  expect(S().templates.map(x => [x.name, x.folder])).toEqual(names); expect(plan.weekPlanDays()).toEqual(days);
  expect(screen.getAllByText('Wygenerowane').length).toBeGreaterThan(0);
  await go('/history'); await flushAll(10); expect(plan.hasPlan()).toBe(true);
});

test('deload: oznaczenie tygodnia w Postępach → restart → start z szablonu pyta o mniej serii; po zdjęciu oznaczenia i restarcie — bez pytania', async () => {
  const t = await boot('/more/progress', () => { [[8, 14], [8, 21], [8, 28], [9, 6]].forEach(([m, d]) => addWorkout(new Date(2026, m, d, 18).getTime(), [['Back Squat', [{ weight: 100, reps: 5 }]]])); });
  store.toggleDeloadWeek(NOW.getTime()); await flushAll(5); /* „Ten tydzień: deload” (ten sam przycisk co w Kalendarzu — test ekranu: deload-ui) */
  await restart('/'); expect(store.isDeloadWeek(NOW.getTime())).toBe(true);
  const c = deloadCounts(t[0]); await tap(screen.getByLabelText(`Start: ${t[0].name}`)); await flushAll(5); await press('Tydzień deload', 'Mniej serii');
  expect(S().active!.exercises.reduce((a, e) => a + e.sets.filter(s => s.kind !== 'warmup').length, 0)).toBe(c.less); expect(S().active!.deload).toBe(true);
  await restart('/'); expect(S().active!.deload).toBe(true);
  act(() => { store.cancelWorkout(); store.toggleDeloadWeek(NOW.getTime()); }); await restart('/'); expect(store.isDeloadWeek(NOW.getTime())).toBe(false);
  await tap(screen.getByLabelText(`Start: ${t[0].name}`)); await flushAll(5); expect(lastAlert('Tydzień deload')).toBeUndefined(); expect(S().active?.templateId).toBe(t[0].id);
});

test('filtr „Podstawowe” na liście Ćwiczeń: zdjęcie → restart → zapamiętany, i z powrotem', async () => {
  await boot('/exercises');
  await tap(screen.getByText('Podstawowe ✕')); await flushAll(5); expect(store.libShowAll()).toBe(true);
  await restart('/exercises'); expect(screen.getByText('+ Podstawowe')).toBeTruthy();
  await tap(screen.getByText('+ Podstawowe')); await flushAll(5); await restart('/exercises'); expect(screen.getByText('Podstawowe ✕')).toBeTruthy(); expect(store.libShowAll()).toBe(false);
});
