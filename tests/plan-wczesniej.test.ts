/*
 * Trening zrobiony wcześniej (decyzja właściciela 11.10.2026, docs/18 pkt 4, wariant A) i wyłączenie wszystkich planów (pkt 5, wariant A z potwierdzeniem).
 * Rodzaje (docs/20): logika (reguła „najbliższy dzień z treningiem ma ten szablon”), niezmienniki (jeden stan dnia dla kalendarza, paska, kafelków, miesiąca),
 * reguły sąsiednie (przypomnienie, przesuwanie, propozycje, deload), dane (sanityzacja, zapis i odczyt, idempotencja), „Cofnij”.
 * Ekrany: tests/plan-wczesniej-ui.test.tsx.
 */
import * as store from '@/lib/store';
import * as plan from '@/lib/plan';
import { weekStrip, weekTiles } from '@/lib/dashboard';
import { weekProgress, monthWeeks } from '@/lib/motif';
import { planReminderKey, syncPlanReminders } from '@/lib/planReminder';
import { fresh, saved, withDemoTemplates, addWorkout } from './helpers';

const S = () => store.getState();
const NOW = new Date(2026, 9, 11, 10).getTime(); /* niedziela 11.10.2026 */
let A = '', B = '', C = '';
const at = (k: string, h = 18) => new Date(+k.slice(0, 4), +k.slice(5, 7) - 1, +k.slice(8, 10), h).getTime();
/** Zakończony trening szablonem `tpl` w dniu `k` (jak po „Zakończ”). */
const done = (k: string, tpl: string) => { const w = addWorkout(at(k), [['Back Squat', [{ weight: 100, reps: 5 }]]]); w.templateId = tpl; w.templateName = S().templates.find(x => x.id === tpl)!.name; store.save(w); return w; };
beforeEach(async () => { jest.useFakeTimers({ now: NOW }); await fresh(); [A, B, C] = withDemoTemplates().map(x => x.id); global.__notifications.length = 0; });

describe('trening zrobiony wcześniej (pkt 4, wariant A)', () => {
  test('niedziela: trening A, plan pon. A — poniedziałek „zrobiony wcześniej”; reszta planu bez zmian', () => {
    plan.setWeekDay(0, A); plan.setWeekDay(2, B);
    const w = done('2026-10-11', A); expect(plan.markDoneEarly(w)).toBe('2026-10-12');
    expect(S().doneEarly).toEqual({ '2026-10-12': w.id });
    expect(plan.dayStatus('2026-10-12')).toEqual({ status: 'done', templateId: A, workoutIds: [w.id], early: true });
    expect(plan.plannedOn('2026-10-12')).toBe(A); expect(plan.plannedOn('2026-10-14')).toBe(B); expect(plan.weekPlanDays()).toEqual([A, null, B, null, null, null, null]); expect(S().planOverrides).toBeUndefined();
    expect(plan.dayStatus('2026-10-14').status).toBe('planned'); expect(plan.pending(plan.dayStatus('2026-10-12'))).toBe(false);
  });
  test('earlyTarget: czysta reguła bez zapisu (pon. A: niedziela A → pon.; sobota/niedziela inny szablon → null; dzień zajęty → null)', () => {
    plan.setWeekDay(0, A); const w = done('2026-10-11', A); expect(plan.earlyTarget(w)).toBe('2026-10-12'); expect(S().doneEarly).toBeUndefined();
    done('2026-10-12', A); jest.setSystemTime(new Date(2026, 9, 12, 20).getTime()); expect(plan.earlyTarget(done('2026-10-11', A))).toBeNull(); /* pon. ma już zrobiony trening — zajęty */
  });
  test('trening w dniu, który ma X w planie — bez zmian (zwykłe „zrobione”)', () => {
    plan.setWeekDay(6, A); plan.setWeekDay(0, A); const w = done('2026-10-11', A); expect(plan.markDoneEarly(w)).toBeNull(); expect(S().doneEarly).toBeUndefined();
    expect(plan.dayStatus('2026-10-11').early).toBeUndefined(); expect(plan.dayStatus('2026-10-12').status).toBe('planned');
  });
  test('najbliższy dzień z treningiem ma INNY szablon — nic się nie dzieje (nie szukamy dalej)', () => {
    plan.setWeekDay(0, B); plan.setWeekDay(2, A); const w = done('2026-10-11', A); expect(plan.markDoneEarly(w)).toBeNull(); expect(plan.dayStatus('2026-10-14').status).toBe('planned');
  });
  test('trening bez szablonu albo z usuniętego szablonu — bez zmian', () => {
    plan.setWeekDay(0, A); const w = addWorkout(at('2026-10-11'), [['Back Squat', [{ weight: 100, reps: 5 }]]]); expect(plan.markDoneEarly(w)).toBeNull();
    const x = done('2026-10-11', C); expect(plan.markDoneEarly(x)).toBeNull();
  });
  test('zmiana pojedynczego dnia (zmiana planu) też liczy się jako „dzień z treningiem”; wolne dni po drodze są pomijane', () => {
    plan.setWeekDay(3, C); plan.setDayPlan('2026-10-14', A); /* śr. A (zmiana dnia), czw. C */
    const w = done('2026-10-11', A); expect(plan.markDoneEarly(w)).toBe('2026-10-14');
  });
  test('drugi trening tego samego szablonu nie nakłada się na ten sam dzień', () => {
    plan.setWeekDay(0, A); const w1 = done('2026-10-11', A); expect(plan.markDoneEarly(w1)).toBe('2026-10-12'); const w2 = done('2026-10-11', A); expect(plan.markDoneEarly(w2)).toBeNull();
    expect(S().doneEarly).toEqual({ '2026-10-12': w1.id });
  });
  test('liczy się do celu SWOJEGO tygodnia: niedziela (tydzień 5–11.10) nie dostaje zaliczenia, tydzień 12–18.10 tak (weekTiles, weekProgress, monthWeeks)', () => {
    plan.setWeekDay(0, A); plan.setWeekDay(2, B); const w = done('2026-10-11', A); plan.markDoneEarly(w);
    /* tydzień bieżący (poprzedni poniedziałek 5.10): plan jest, A w pon. 5.10 był przed planem (plan od dziś) — brak planu w dniach przed 11.10 */
    jest.setSystemTime(new Date(2026, 9, 12, 7).getTime()); /* pon. 12.10 rano */
    const wt = weekTiles(); expect(wt.planned).toBe(2); expect(wt.planDone).toBe(1);
    expect(weekProgress()).toMatchObject({ done: 1, total: 2, stacks: [true, false] });
    expect(weekStrip().find(d => d.date === '2026-10-12')).toMatchObject({ status: 'done', early: true });
    jest.setSystemTime(new Date(2026, 9, 19, 7).getTime()); /* kolejny tydzień: bez zaliczeń z poprzedniego */
    expect(weekTiles().planDone).toBe(0);
    const m = monthWeeks(new Date(2026, 9, 1).getTime(), new Date(2026, 10, 1).getTime(), new Date(2026, 9, 19, 12).getTime());
    expect(m.weeks.find(x => x.start === '2026-10-12')).toMatchObject({ planned: 2, done: 1, state: 'partial' });
  });
  test('tydzień pełny: „zrobiony wcześniej” + drugi trening = 100% (monthWeeks: full)', () => {
    plan.setWeekDay(0, A); plan.setWeekDay(2, B); plan.markDoneEarly(done('2026-10-11', A)); done('2026-10-14', B);
    const m = monthWeeks(new Date(2026, 9, 1).getTime(), new Date(2026, 10, 1).getTime(), new Date(2026, 9, 15, 12).getTime());
    expect(m.weeks.find(x => x.start === '2026-10-12')).toMatchObject({ planned: 2, done: 2, state: 'full' });
  });
  test('„Cofnij”: dzień wraca do planu (zaplanowany; po terminie — opuszczony); undo nieznanego dnia nic nie robi', () => {
    plan.setWeekDay(0, A); plan.markDoneEarly(done('2026-10-11', A));
    plan.undoDoneEarly('2026-10-13'); expect(S().doneEarly).toBeDefined();
    plan.undoDoneEarly('2026-10-12'); expect(S().doneEarly).toBeUndefined(); expect(plan.dayStatus('2026-10-12')).toEqual({ status: 'planned', templateId: A, workoutIds: [] });
    jest.setSystemTime(new Date(2026, 9, 14, 7).getTime()); expect(plan.dayStatus('2026-10-12').status).toBe('missed');
  });
  test('znacznik traci ważność, gdy dzień przestaje mieć ten szablon (zmiana planu) albo trening zostaje usunięty', () => {
    plan.setWeekDay(0, A); const w = done('2026-10-11', A); plan.markDoneEarly(w);
    plan.setDayPlan('2026-10-12', B); expect(plan.dayStatus('2026-10-12')).toMatchObject({ status: 'planned', templateId: B }); expect(plan.dayStatus('2026-10-12').early).toBeUndefined();
    plan.resetDay('2026-10-12'); expect(plan.dayStatus('2026-10-12').early).toBe(true);
    store.deleteWorkout(w.id); expect(plan.dayStatus('2026-10-12').status).toBe('planned');
  });
  test('trening faktycznie zrobiony w tym dniu ma pierwszeństwo przed znacznikiem', () => {
    plan.setWeekDay(0, A); plan.markDoneEarly(done('2026-10-11', A)); jest.setSystemTime(new Date(2026, 9, 12, 18).getTime()); const w2 = done('2026-10-12', A);
    expect(plan.dayStatus('2026-10-12')).toEqual({ status: 'done', templateId: A, workoutIds: [w2.id] });
  });
  test('linijka po treningu: earlyNote / earlyFor; trening zwykły — pusta', () => {
    plan.setWeekDay(0, A); const w = done('2026-10-11', A); expect(plan.earlyNote(w.id)).toBe(''); plan.markDoneEarly(w);
    expect(plan.earlyWorkout('2026-10-12')?.id).toBe(w.id); expect(plan.earlyWorkout('2026-10-13')).toBeUndefined();
    expect(plan.earlyFor(w.id)).toEqual({ day: '2026-10-12', from: '2026-10-11' }); expect(plan.earlyNote(w.id)).toMatch(/^Policzone jako trening z .*12.* — ten dzień jest wolny\.$/);
    plan.undoDoneEarly('2026-10-12'); expect(plan.earlyNote(w.id)).toBe('');
  });
  test('dzień „zrobiony wcześniej” jest zajęty: przesunięcie planu go omija, przeniesienie na niego daje konflikt „zrobiony”', () => {
    plan.setWeekDay(0, A); plan.setWeekDay(1, C); plan.markDoneEarly(done('2026-10-11', A));
    expect(plan.busyDays().has('2026-10-12')).toBe(true);
    const r = plan.moveOnly('2026-10-13', '2026-10-12'); expect(r).toMatchObject({ ok: false, done: true }); expect(plan.plannedOn('2026-10-13')).toBe(C);
  });
  test('„Przesuń plan” z innego dnia: łańcuch omija dzień „zrobiony wcześniej” i nie zjada znacznika', () => {
    plan.setWeekDay(0, A); plan.setWeekDay(6, B); plan.markDoneEarly(done('2026-10-11', A)); /* pon. 12.10 zrobiony wcześniej */
    jest.setSystemTime(new Date(2026, 9, 11, 12).getTime()); plan.setDayPlan('2026-10-11', C); /* dziś C zaplanowany (nie zrobiony) */
    const r = plan.shiftPlan('2026-10-11'); expect(r.moved.map(m => m.to)).toEqual(['2026-10-13']); /* 12.10 pominięty */
    expect(plan.dayStatus('2026-10-12')).toMatchObject({ status: 'done', early: true });
  });
  test('propozycje zmian nie traktują dnia „zrobiony wcześniej” jako opuszczonego/oczekującego (panel nie pokazuje dla niego przesuwania — pending=false); dla innych dni nie wliczają go do utraconych sesji', () => {
    plan.setWeekDay(0, A); plan.setWeekDay(2, B); plan.markDoneEarly(done('2026-10-11', A));
    const s = plan.suggest('2026-10-14'); expect(s.length).toBeGreaterThan(0); expect(s.every(x => x.ov['2026-10-12'] === undefined)).toBe(true);
    const info = plan.doneInfo('2026-10-11', 5); expect(info.tpls.get('2026-10-12')?.has(A)).toBe(true); expect(info.muscles.get('2026-10-12')).toBeUndefined();
  });
  test('przypomnienie rano (lib/planReminder): nie przychodzi na dzień „zrobiony wcześniej”; po „Cofnij” wraca; klucz synchronizacji się zmienia', async () => {
    plan.setWeekDay(0, A); plan.setWeekDay(2, B); jest.setSystemTime(new Date(2026, 9, 11, 6).getTime());
    const w = done('2026-10-11', A); const k0 = planReminderKey(); plan.markDoneEarly(w); const k1 = planReminderKey(); expect(k1).not.toBe(k0);
    await syncPlanReminders(); const ids = () => (global.__notifications as any[]).map(n => n.identifier);
    expect(ids()).not.toContain('plan-2026-10-12'); expect(ids()).toContain('plan-2026-10-14');
    plan.undoDoneEarly('2026-10-12'); expect(planReminderKey()).not.toBe(k1); global.__notifications.length = 0; await syncPlanReminders(); expect(ids()).toContain('plan-2026-10-12');
  });
  test('deload bez zmian: tydzień oznaczony deload nadal tylko etykieta; „zrobiony wcześniej” liczy się w nim jak zwykły', () => {
    plan.setWeekDay(0, A); plan.markDoneEarly(done('2026-10-11', A)); store.toggleDeloadWeek(at('2026-10-12', 12));
    expect(store.isDeloadWeek(at('2026-10-12', 12))).toBe(true); expect(plan.dayStatus('2026-10-12')).toMatchObject({ status: 'done', early: true });
  });
  test('dane: zapis i odczyt zachowują znacznik; migracja czyści złe klucze i znaczniki bez treningu; idempotentna', async () => {
    plan.setWeekDay(0, A); const w = done('2026-10-11', A); plan.markDoneEarly(w); await store.flush();
    (S() as any).doneEarly = { '2026-10-12': w.id, 'zły': w.id, '2026-10-13': 5, '2026-10-14': 'nie-ma-takiego', '2026-10-15': '' };
    store.save(); await store.flush(); await fresh(saved());
    expect(S().doneEarly).toEqual({ '2026-10-12': w.id }); const m1 = JSON.stringify(store.migrate(JSON.parse(JSON.stringify(S())))); expect(JSON.stringify(store.migrate(JSON.parse(m1)))).toBe(m1);
    expect(plan.dayStatus('2026-10-12').early).toBe(true);
    (S() as any).doneEarly = 'x'; expect(store.migrate(JSON.parse(JSON.stringify(S()))).doneEarly).toBeUndefined();
  });
});

describe('wyłączenie wszystkich planów (pkt 5, wariant A z potwierdzeniem)', () => {
  test('deactivatePlan: plan z nazwą i zmianami dni trafia do „Inne plany”; aktywny pusty; minione dni bez zmian w historii; hasPlan false', () => {
    plan.setWeekDay(0, A); plan.setWeekDay(2, B); plan.setPlanName('Rutyna');
    jest.setSystemTime(new Date(2026, 9, 12, 9).getTime()); /* pon. 12.10 — plan od 11.10 (odcinek historii) */
    plan.setDayPlan('2026-10-16', C); plan.setDayPlan('2026-10-13', C);
    expect(plan.hasActivePlan()).toBe(true); expect(plan.deactivatePlan()).toBe('ok');
    expect(plan.hasPlan()).toBe(false); expect(plan.weekPlanDays()).toEqual(Array(7).fill(null)); expect(plan.planName()).toBe(''); expect(S().weekPlan).toBeUndefined();
    expect(plan.savedPlans()).toEqual([expect.objectContaining({ name: 'Rutyna', days: [A, null, B, null, null, null, null], overrides: { '2026-10-13': C, '2026-10-16': C } })]);
    expect(S().planOverrides).toBeUndefined();
    expect(plan.plannedOn('2026-10-14')).toBeNull(); expect(plan.dayStatus('2026-10-14').status).toBe('rest');
    expect(plan.hasActivePlan()).toBe(false); expect(plan.deactivatePlan()).toBe('none');
  });
  test('minione dni zachowują status (historia planu): opuszczony z planu sprzed wyłączenia nadal „opuszczony”', () => {
    plan.setWeekDay(0, A); jest.setSystemTime(new Date(2026, 9, 14, 9).getTime()); /* śr. 14.10; pon. 12.10 minął bez treningu */
    expect(plan.dayStatus('2026-10-12').status).toBe('missed'); plan.deactivatePlan();
    expect(plan.dayStatus('2026-10-12')).toMatchObject({ status: 'missed', templateId: A }); expect(plan.dayStatus('2026-10-19').status).toBe('rest');
  });
  test('plan bez nazwy dostaje „Mój plan (<data>)”; wyłączenie i ponowna aktywacja przywraca dni i zmiany dni od dziś', () => {
    plan.setWeekDay(1, A); plan.setDayPlan('2026-10-15', B); plan.deactivatePlan();
    const id = plan.savedPlans()[0].id; expect(plan.savedPlans()[0].name).toBe('Mój plan (11.10)');
    plan.activatePlan(id); expect(plan.weekPlanDays()).toEqual([null, A, null, null, null, null, null]); expect(S().planOverrides).toEqual({ '2026-10-15': B }); expect(plan.savedPlans()).toEqual([]);
  });
  test('„Inne plany” pełne — wyłączenie odmawia i niczego nie zmienia', () => {
    plan.setWeekDay(0, A); for (let i = 0; i < store.SAVED_PLANS_MAX; i++) plan.addPlan(`P${i}`, [B, null, null, null, null, null, null], false);
    expect(plan.deactivatePlan()).toBe('full'); expect(plan.weekPlanDays()[0]).toBe(A); expect(plan.savedPlans()).toHaveLength(store.SAVED_PLANS_MAX);
  });
  test('przypomnienia po wyłączeniu: wszystkie odwołane, żadne nowe; klucz synchronizacji się zmienia', async () => {
    jest.setSystemTime(new Date(2026, 9, 11, 6).getTime()); for (let i = 0; i < 7; i++) plan.setWeekDay(i, B);
    await syncPlanReminders(); expect((global.__notifications as any[]).length).toBeGreaterThan(20); const k = planReminderKey();
    plan.deactivatePlan(); expect(planReminderKey()).not.toBe(k); global.__notifications.length = 0; global.__cancelled.length = 0; await syncPlanReminders();
    expect(global.__notifications).toHaveLength(0); expect(global.__cancelled).toContain('plan-2026-10-12');
  });
  test('ekran Trening bez planu jak przed pierwszym planem: firstSteps.plan false, weekTiles.planned null', () => {
    plan.setWeekDay(0, A); plan.deactivatePlan(); expect(weekTiles().planned).toBeNull(); expect(weekProgress()).toBeNull();
  });
  test('najwyżej jeden aktywny: po wyłączeniu i aktywacji innego aktywny jest dokładnie jeden, poprzedni w „Inne plany”', () => {
    plan.setWeekDay(0, A); plan.deactivatePlan(); const other = plan.addPlan('Drugi', [B, null, null, null, null, null, null], false);
    plan.activatePlan(plan.savedPlans()[0].id); plan.deactivatePlan(); plan.activatePlan(other);
    expect(plan.weekPlanDays()[0]).toBe(B); expect(plan.savedPlans().map(p => p.name)).toEqual(['Mój plan (11.10)']);
  });
  test('dane: zapis i odczyt po wyłączeniu (historia z pustym odcinkiem, idempotentna migracja)', async () => {
    plan.setWeekDay(0, A); jest.setSystemTime(new Date(2026, 9, 12, 9).getTime()); plan.deactivatePlan(); await store.flush(); await fresh(saved());
    expect(plan.hasPlan()).toBe(false); expect(plan.savedPlans()).toHaveLength(1); const m1 = JSON.stringify(store.migrate(JSON.parse(JSON.stringify(S())))); expect(JSON.stringify(store.migrate(JSON.parse(m1)))).toBe(m1);
  });
});
