/*
 * Kilka planów tygodnia, jeden aktywny (decyzja właściciela 08.10.2026: „aktywny plan i wybór, który ma obowiązywać” — powrót do starej rutyny
 * po okresie przejściowym; docs/24 sekcja 1). Aktywny = State.weekPlan (+ opcjonalna nazwa), pozostałe = State.savedPlans.
 * Rodzaje (docs/20): logika (kopia, aktywacja z zamianą, zmiany dni od dziś usuwane, przeszłe zostają, nazwa, usuwanie, nowy plan z generatora),
 * dane (sanityzacja, dane sprzed zmiany 1:1, zapis/odczyt). Ekran: tests/plans-multi-ui.test.tsx.
 */
import * as store from '@/lib/store';
import * as plan from '@/lib/plan';
import { fresh, saved, withDemoTemplates } from './helpers';

const S = () => store.getState();
const NOW = new Date(2026, 9, 8, 9).getTime(); /* czw. 8.10 */
let A = '', B = '', C = '';
beforeEach(async () => { jest.useFakeTimers({ now: NOW }); await fresh(); const t = withDemoTemplates(); [A, B, C] = t.map(x => x.id); });

describe('kilka planów', () => {
  test('nazwa aktywnego planu; domyślnie brak (ekran pokazuje „Mój plan”)', () => {
    expect(plan.planName()).toBe(''); plan.setWeekDay(0, A); plan.setPlanName('  Rutyna  '); expect(plan.planName()).toBe('Rutyna');
    expect(S().weekPlan).toEqual({ days: [A, null, null, null, null, null, null], name: 'Rutyna' });
    plan.setPlanName('x'.repeat(60)); expect(plan.planName().length).toBe(40); plan.setPlanName(''); expect('name' in S().weekPlan!).toBe(false);
  });
  test('nowy plan (osobny wpis); aktywacja zamienia miejscami; zmiany dni od dziś wędrują z planem (audyt 0.10 B1/B2 A — dawniej kopia i kasowanie zmian)', () => {
    plan.setWeekDay(0, A); plan.setWeekDay(2, B); plan.setPlanName('Rutyna');
    const id = plan.newPlan('Przejściowy')!; expect(plan.savedPlans()).toEqual([{ id, name: 'Przejściowy', days: [A, null, B, null, null, null, null] }]);
    plan.setDayPlan('2026-10-06', C); plan.setDayPlan('2026-10-09', C); /* wt. (przeszłość), pt. (przyszłość) */
    expect(plan.futureChanges()).toBe(1);
    plan.activatePlan(id);
    expect(plan.planName()).toBe('Przejściowy'); expect(plan.savedPlans().map(p => p.name)).toEqual(['Rutyna']);
    expect(S().planOverrides).toEqual({ '2026-10-06': C }); expect(plan.savedPlans()[0].overrides).toEqual({ '2026-10-09': C });
    plan.setWeekDay(4, C); const back = plan.savedPlans()[0].id; plan.activatePlan(back);
    expect(plan.planName()).toBe('Rutyna'); expect(plan.weekPlanDays()).toEqual([A, null, B, null, null, null, null]); expect(S().planOverrides).toEqual({ '2026-10-06': C, '2026-10-09': C });
    expect(plan.savedPlans()[0]).toMatchObject({ name: 'Przejściowy', days: [A, null, B, null, C, null, null] });
  });
  test('aktywacja przy braku aktywnego planu — nic nie trafia do zapisanych', () => {
    const id = plan.addPlan('Nowy', [A, null, null, null, null, null, null], false); expect(plan.hasPlan()).toBe(false);
    plan.activatePlan(id); expect(plan.weekPlanDays()[0]).toBe(A); expect(plan.savedPlans()).toEqual([]);
  });
  test('addPlan z aktywacją (generator): poprzedni aktywny trafia do zapisanych pod swoją nazwą albo — bez nazwy — „Plan do <data>” (audyt 0.10 B2 A; dawniej pusta nazwa → „Poprzedni plan”)', () => {
    plan.setWeekDay(1, B); plan.addPlan('Wygenerowany', [A, null, A, null, A, null, null], true);
    expect(plan.planName()).toBe('Wygenerowany'); expect(plan.savedPlans()).toEqual([expect.objectContaining({ name: 'Plan do 8.10', days: [null, B, null, null, null, null, null] })]);
  });
  test('zmiana nazwy i usuwanie zapisanego planu; nieznane id — bez zmian', () => {
    const id = plan.addPlan('A', [A, null, null, null, null, null, null], false); plan.renamePlan(id, 'B'); expect(plan.savedPlans()[0].name).toBe('B');
    plan.activatePlan('nie-ma'); plan.deletePlan('nie-ma'); expect(plan.savedPlans().length).toBe(1);
    plan.deletePlan(id); expect(S().savedPlans).toBeUndefined();
  });
  test('dane: sanityzacja zapisanych planów (7 dni, id tekstem, nazwa ≤ 40, powtórzone id → „~n” — DAT2-04), nazwa aktywnego; zapis i odczyt', async () => {
    plan.setWeekDay(0, A); plan.setPlanName('R');
    (S() as any).savedPlans = [{ id: 'p1', name: 'X'.repeat(50), days: [A, 5, null] }, { id: 'p1', name: 'dup', days: [] }, 'zły', { name: 'bez id', days: [] }, { id: 'p2', name: 7, days: 'x' }];
    store.save(); await store.flush(); await fresh(saved());
    expect(S().savedPlans).toEqual([{ id: 'p1', name: 'X'.repeat(40), days: [A, null, null, null, null, null, null] }, { id: 'p1~2', name: 'dup', days: [null, null, null, null, null, null, null] } /* DAT2-04: drugi wpis nie ginie */, { id: 'p2', name: '', days: [null, null, null, null, null, null, null] }]);
    expect(S().weekPlan).toEqual({ days: [A, null, null, null, null, null, null], name: 'R' });
  });
  test('dane sprzed zmiany (bez nazwy, bez zapisanych planów) przechodzą 1:1', async () => {
    plan.setWeekDay(0, A); store.save(); await store.flush(); await fresh(saved());
    expect(S().weekPlan).toEqual({ days: [A, null, null, null, null, null, null] }); expect('savedPlans' in S()).toBe(false);
  });
});
