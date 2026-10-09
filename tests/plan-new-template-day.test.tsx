/*
 * „+ Nowy szablon” w edytorze planu (DayRows — aktywny i zapisany plan) i w panelu dnia Kalendarza (decyzja 09.10.2026, wariant B; docs/18 ok. 14:45):
 * po „Zapisz” nowy szablon trafia na ten dzień tego wariantu planu (lib/plan assignNewTemplate); „Anuluj” nic nie przypisuje, pusty niezapisany
 * szablon znika (draft.dropUnsavedNew). Rodzaje (docs/20): logika (cele, złe dane), ekran, scenariusz z restartem; niezmienniki — akcja
 * tplNewAssign w tests/matrix-invariants.test.ts; regresja „brak skrótu” — tests/b2-plan-own-templates.test.tsx; E2E: .maestro/18.
 */
import * as store from '@/lib/store';
import * as plan from '@/lib/plan';
import * as draft from '@/lib/draft';
import { applyLang } from '@/lib/i18n';
import { fresh, saved, withDemoTemplates } from './helpers';
import { renderApp, flushAll, screen, tap, type, act, go, saveEdit } from './app';
import { router } from 'expo-router';

jest.setTimeout(60000);
const NOW = new Date(2026, 9, 8, 9, 0); /* czwartek */
const S = () => store.getState();
afterEach(() => { applyLang('pl'); draft.__resetObjDrafts(); });
const boot = async (url: string, fn: (ids: string[]) => void = () => {}, opts: { demo?: boolean } = {}) => {
  jest.useFakeTimers({ now: NOW }); await fresh(); const t = opts.demo === false ? [] : withDemoTemplates(); fn(t.map(x => x.id));
  await act(async () => { await store.flush(); }); await renderApp({ saved: JSON.parse(JSON.stringify(saved())), url }); jest.setSystemTime(NOW.getTime()); await flushAll(10);
  return t;
};
const restart = async (url: string) => { await act(async () => { await store.flush(); }); await renderApp({ saved: JSON.parse(JSON.stringify(saved())), url }); jest.setSystemTime(NOW.getTime()); await flushAll(10); };
const lastAlert = (title: string) => [...global.__alerts].reverse().find(x => x.title === title);
const press = async (title: string, btn: string) => { const a = lastAlert(title)!; expect(a).toBeTruthy(); await act(async () => { a.buttons!.find(b => b.text === btn)!.onPress?.(); }); await flushAll(10); };
const addPlank = async () => {
  await tap(screen.getByText('+ Dodaj ćwiczenie')); await flushAll(10);
  await type(screen.getByPlaceholderText('Szukaj ćwiczenia…'), 'Plank'); await flushAll(5); await tap(screen.getAllByText('Plank')[0]); await flushAll(10);
  if (screen.queryByLabelText('Zapisz szablon') == null) { await act(async () => { router.back(); }); await flushAll(10); }
};
/** Logika: świeży stan z czasem NOW (bez ekranu). */
const freshLogic = async () => { jest.useFakeTimers({ now: NOW }); await fresh(); };
const demo = () => withDemoTemplates();

describe('„+ Nowy szablon” z przypisaniem do dnia (assignNewTemplate)', () => {
  beforeEach(freshLogic);
  test('aktywny plan, zapisany plan, pojedynczy dzień od dziś; cel nieważny — false i bez zmian', () => {
    const t = demo(); const x = store.newTemplate(); x.items.push({ ...t[0].items[0], id: 'n1' }); store.save(x);
    expect(plan.assignNewTemplate(plan.assignTarget.week(2), x.id)).toBe(true); expect(plan.weekPlanDays()[2]).toBe(x.id);
    const pid = plan.newPlan('Inny')!; expect(plan.assignNewTemplate(plan.assignTarget.saved(pid, 5), x.id)).toBe(true); expect(plan.savedPlans().find(p => p.id === pid)!.days[5]).toBe(x.id);
    expect(plan.weekPlanDays()[5]).toBeNull();
    expect(plan.assignNewTemplate(plan.assignTarget.day('2026-10-09'), x.id)).toBe(true); expect(S().planOverrides!['2026-10-09']).toBe(x.id); expect(plan.weekPlanDays()[4]).toBeNull();
    expect(plan.assignNewTemplate(plan.assignTarget.day('2026-10-08'), x.id)).toBe(true); /* dziś */
    const snap = JSON.stringify([S().weekPlan, S().savedPlans, S().planOverrides]);
    for (const bad of [plan.assignTarget.day('2026-10-07'), plan.assignTarget.saved('nie-ma', 1), 'week:7', 'week:-1', 'day:jutro', '', 'saved::1', 'cokolwiek']) expect([bad, plan.assignNewTemplate(bad, x.id)]).toEqual([bad, false]);
    expect(plan.assignNewTemplate(plan.assignTarget.week(1), 'nie-ma')).toBe(false);
    store.setTemplateArchived(x, true); expect(plan.assignNewTemplate(plan.assignTarget.week(1), x.id)).toBe(false);
    expect(JSON.stringify([S().weekPlan, S().savedPlans, S().planOverrides])).toBe(snap);
  });
  test('pusty zapisany szablon też trafia na dzień (użytkownik go zapisał)', () => {
    const x = store.newTemplate(); expect(plan.assignNewTemplate(plan.assignTarget.week(0), x.id)).toBe(true); expect(plan.weekPlanDays()[0]).toBe(x.id);
  });
});

describe('„+ Nowy szablon” w edytorze planu i panelu dnia (B) — po „Zapisz” na ten dzień', () => {
  test('aktywny plan, brak szablonów: „+ Nowy szablon” → edycja → ćwiczenie → „Zapisz” → szablon na wtorku; po restarcie też', async () => {
    await boot('/plan', () => {}, { demo: false });
    await tap(screen.getByLabelText('wtorek, Wolne')); await flushAll(5); expect(screen.getByText('Nie masz jeszcze szablonów.')).toBeTruthy();
    expect(screen.getByLabelText('wtorek: + Nowy szablon').props.accessibilityHint).toBe('Po zapisie szablon trafi na ten dzień.');
    await tap(screen.getByLabelText('wtorek: + Nowy szablon')); await flushAll(10);
    await type(screen.getByLabelText('Nazwa'), 'Nogi'); await addPlank(); expect(plan.weekPlanDays()[1]).toBeNull(); /* przed „Zapisz” — nic */
    await saveEdit(); await flushAll(10); const id = S().templates.find(x => x.name === 'Nogi')!.id; expect(plan.weekPlanDays()).toEqual([null, id, null, null, null, null, null]);
    await act(async () => { router.back(); }); await flushAll(10); expect(screen.getByLabelText('wtorek, Nogi')).toBeTruthy();
    await restart('/plan'); expect(plan.weekPlanDays()[1]).toBe(id); expect(S().templates.length).toBe(1);
  });
  test('„Anuluj” niczego nie przypisuje, a pusty, niezapisany szablon znika (dropUnsavedNew); zapis pustego z nazwą — przypisany i zostaje', async () => {
    const t = await boot('/plan', ids => { plan.setWeekDay(0, ids[0]); });
    await tap(screen.getByLabelText(`środa, Wolne`)); await flushAll(5); await tap(screen.getByLabelText('środa: + Nowy szablon')); await flushAll(10);
    expect(S().templates.length).toBe(5); await tap(screen.getByLabelText('Anuluj edycję szablonu')); await flushAll(10);
    expect(S().templates.length).toBe(4); expect(plan.weekPlanDays()[2]).toBeNull();
    await tap(screen.getByLabelText(`środa, Wolne`)); await flushAll(5); await tap(screen.getByLabelText('środa: + Nowy szablon')); await flushAll(10);
    await type(screen.getByLabelText('Nazwa'), 'Rozruch'); await tap(screen.getByLabelText('Anuluj edycję szablonu')); await flushAll(5); await press('Odrzucić zmiany?', 'Odrzuć zmiany');
    expect(S().templates.length).toBe(4); expect(plan.weekPlanDays()[2]).toBeNull();
    await tap(screen.getByLabelText(`środa, Wolne`)); await flushAll(5); await tap(screen.getByLabelText('środa: + Nowy szablon')); await flushAll(10);
    await type(screen.getByLabelText('Nazwa'), 'Rozruch'); await saveEdit(); await act(async () => { router.back(); }); await flushAll(10);
    const id = S().templates.find(x => x.name === 'Rozruch')!.id; expect(plan.weekPlanDays()[2]).toBe(id); expect(plan.weekPlanDays()[0]).toBe(t[0].id);
  });
  test('zapisany plan („Inne plany”): nowy szablon trafia na dzień TEGO planu, aktywny bez zmian', async () => {
    const t = await boot('/plan', ids => { plan.setWeekDay(0, ids[0]); });
    const pid = plan.newPlan('Zapas')!; await go(`/plan?id=${pid}`); await flushAll(10);
    await tap(screen.getByLabelText('piątek, Wolne')); await flushAll(5); await tap(screen.getByLabelText('piątek: + Nowy szablon')); await flushAll(10);
    await type(screen.getByLabelText('Nazwa'), 'Piątek'); await addPlank(); await saveEdit(); await flushAll(10);
    const id = S().templates.find(x => x.name === 'Piątek')!.id;
    expect(plan.savedPlans().find(p => p.id === pid)!.days[4]).toBe(id); expect(plan.weekPlanDays()).toEqual([t[0].id, null, null, null, null, null, null]);
  });
  test('panel dnia w Kalendarzu: „+ Nowy szablon” → zmiana tylko tej daty (plan tygodnia bez zmian); „Anuluj” — nic', async () => {
    const t = await boot('/history', ids => { plan.setWeekDay(4, ids[0]); });
    await tap(screen.getByTestId('cal-2026-10-09')); await flushAll(5); await tap(screen.getByText('Inny trening')); await flushAll(5);
    expect(screen.getByLabelText('+ Nowy szablon').props.accessibilityHint).toBe('Po zapisie szablon trafi na ten dzień.');
    await tap(screen.getByText('+ Nowy szablon')); await flushAll(10); await tap(screen.getByLabelText('Anuluj edycję szablonu')); await flushAll(10);
    expect(S().planOverrides).toBeUndefined(); expect(S().templates.length).toBe(4);
    await tap(screen.getByText('Inny trening')); await flushAll(5); /* po „Anuluj” wracamy do tego samego panelu dnia */
    await tap(screen.getByText('+ Nowy szablon')); await flushAll(10); await type(screen.getByLabelText('Nazwa'), 'Jednorazowy'); await addPlank(); await saveEdit(); await flushAll(10);
    const id = S().templates.find(x => x.name === 'Jednorazowy')!.id;
    expect(plan.plannedOn('2026-10-09')).toBe(id); expect(plan.plannedOn('2026-10-16')).toBe(t[0].id); expect(plan.weekPlanDays()[4]).toBe(t[0].id);
  });
});
