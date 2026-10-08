/*
 * Przypomnienie o treningu z planu (decyzja właściciela 08.10.2026: „rano w dniu treningu”). Jedno lokalne powiadomienie na dzień z planu,
 * o PLAN_REMINDER_HOUR (8:00 — potwierdzona przez właściciela 08.10.2026), na PLAN_REMINDER_DAYS = 28 dni naprzód (audyt 0.10 I1; dawniej 7);
 * bez dnia, w którym zaplanowany trening już jest zrobiony albo trening trwa (audyt 0.10 A5: po innym treningu zaplanowany czeka); wyłączane w Ustawieniach (Settings.planReminder zapisane tylko jako false — dane bez pola 1:1).
 * Rodzaje (docs/20): logika (plan, zmiany dni, wolne, zrobione, godzina minęła, wyłączenie, odwołanie starych), dane (sanityzacja), ekran
 * (Ustawienia; synchronizacja po zmianie planu), języki (EN). E2E: nie — powiadomienia systemowe poza zasięgiem Maestro na symulatorze (docs/09).
 */
import * as store from '@/lib/store';
import * as plan from '@/lib/plan';
import { syncPlanReminders, PLAN_REMINDER_HOUR, PLAN_REMINDER_DAYS, planReminderOn, planReminderKey } from '@/lib/planReminder';
import { applyLang } from '@/lib/i18n';
import { fresh, saved, withDemoTemplates, addWorkout } from './helpers';
import { renderApp, flushAll, screen, act } from './app';
import { fireEvent } from '@testing-library/react-native';

const S = () => store.getState();
const THU9 = new Date(2026, 9, 8, 9, 0).getTime(); const THU7 = new Date(2026, 9, 8, 7, 0).getTime();
const ids = () => (global.__notifications as any[]).map(n => n.identifier);
beforeEach(() => { global.__notifications.length = 0; global.__cancelled.length = 0; });
afterEach(() => { applyLang('pl'); });

describe('logika', () => {
  let t: ReturnType<typeof withDemoTemplates>;
  beforeEach(async () => { jest.useFakeTimers({ now: THU9 }); await fresh(); t = withDemoTemplates(); });
  test('stałe: 8:00, 28 dni (audyt 0.10 I1 — dawniej 7: kto nie otworzył aplikacji przez tydzień, przestawał dostawać przypomnienia)', () => { expect([PLAN_REMINDER_HOUR, PLAN_REMINDER_DAYS]).toEqual([8, 28]); });
  test('dni z planu w 28 dniach od dziś, o 8:00; dziś po 8:00 — bez; treść z nazwą treningu; stare odwołane', async () => {
    plan.setWeekDay(3, t[0].id); plan.setWeekDay(4, t[1].id); /* czw., pt. */
    await syncPlanReminders(THU9);
    expect(ids()).toEqual(['plan-2026-10-09', 'plan-2026-10-15', 'plan-2026-10-16', 'plan-2026-10-22', 'plan-2026-10-23', 'plan-2026-10-29', 'plan-2026-10-30']); /* 28 dni: 8.10–4.11; czw. 8.10 po 8:00, czw. 5.11 poza oknem */
    const n = (global.__notifications as any[])[0];
    expect(n.content.title).toBe(`Dziś: ${t[1].name}`); expect(n.content.body).toBe('Trening z Twojego planu tygodnia. Otwórz aplikację, by zacząć.');
    expect(n.trigger).toEqual({ type: 'date', date: new Date(2026, 9, 9, 8, 0) });
    expect(global.__cancelled).toEqual(expect.arrayContaining(Array.from({ length: PLAN_REMINDER_DAYS + 1 }, (_, i) => plan.addDays('2026-10-07', i)).map(k => `plan-${k}`)));
  });
  test('przed 8:00 — także dziś; trening dziś już zrobiony albo trwa — dziś bez przypomnienia', async () => {
    jest.setSystemTime(THU7); plan.setWeekDay(3, t[0].id);
    await syncPlanReminders(THU7); expect(ids()).toEqual(['plan-2026-10-08', 'plan-2026-10-15', 'plan-2026-10-22', 'plan-2026-10-29']);
    global.__notifications.length = 0; addWorkout(new Date(2026, 9, 8, 6).getTime(), [['Back Squat', [{ weight: 100, reps: 5 }]]]); /* inny trening (A5): zaplanowany czeka */
    await syncPlanReminders(THU7); expect(ids()).toContain('plan-2026-10-08');
    global.__notifications.length = 0; S().workouts[0].templateId = t[0].id; store.save(); /* zaplanowany zrobiony */
    await syncPlanReminders(THU7); expect(ids()).not.toContain('plan-2026-10-08'); expect(ids()).toContain('plan-2026-10-15');
    global.__notifications.length = 0; S().workouts = []; store.startFromTemplate(t[0]);
    await syncPlanReminders(THU7); expect(ids()).not.toContain('plan-2026-10-08');
  });
  test('zmiany dni: wolne i przesunięcie planu', async () => {
    plan.setWeekDay(4, t[1].id); plan.setDayPlan('2026-10-09', null); plan.setDayPlan('2026-10-10', t[0].id);
    await syncPlanReminders(THU9); expect(ids()).toEqual(['plan-2026-10-10', 'plan-2026-10-16', 'plan-2026-10-23', 'plan-2026-10-30']);
  });
  test('wyłączone — nic nie planuje, stare odwołane; bez planu — nic', async () => {
    plan.setWeekDay(4, t[1].id); S().settings.planReminder = false; expect(planReminderOn()).toBe(false);
    await syncPlanReminders(THU9); expect(ids()).toEqual([]); expect(global.__cancelled).toContain('plan-2026-10-09');
    delete S().settings.planReminder; plan.setWeekDay(4, null); await syncPlanReminders(THU9); expect(ids()).toEqual([]);
  });
  test('klucz synchronizacji zmienia się przy zmianie planu, ustawienia, nazwy szablonu i treningu dziś; bez zmian — ten sam', () => {
    plan.setWeekDay(4, t[1].id); const k0 = planReminderKey(THU9); expect(planReminderKey(THU9)).toBe(k0);
    plan.setDayPlan('2026-10-10', t[0].id); const k1 = planReminderKey(THU9); expect(k1).not.toBe(k0);
    S().settings.planReminder = false; const k2 = planReminderKey(THU9); expect(k2).not.toBe(k1); delete S().settings.planReminder;
    t[1].name = 'Inna'; expect(planReminderKey(THU9)).not.toBe(k1);
    const k3 = planReminderKey(THU9); addWorkout(new Date(2026, 9, 8, 8).getTime(), [['Back Squat', [{ weight: 100, reps: 5 }]]]); expect(planReminderKey(THU9)).not.toBe(k3);
  });
  test('dane: planReminder zapisane tylko jako false; inne wartości znikają', async () => {
    for (const [v, keep] of [[false, true], [true, false], ['x', false], [0, false]] as const) {
      (S().settings as any).planReminder = v; store.save(); await store.flush(); await fresh(saved()); expect('planReminder' in S().settings).toBe(keep);
    }
  });
});

describe('ekrany', () => {
  const boot = async (fn: (ids: string[]) => void, url: string, locale: 'pl' | 'en' = 'pl') => {
    jest.useFakeTimers({ now: THU9 }); await fresh(undefined, locale); const t = withDemoTemplates(); fn(t.map(x => x.id));
    await act(async () => { await store.flush(); }); await renderApp({ saved: JSON.parse(JSON.stringify(saved())), locale, url }); jest.setSystemTime(THU9); await flushAll(10);
    return t;
  };
  test('aplikacja planuje przypomnienia po starcie i po zmianie planu', async () => {
    const t = await boot(ids => { plan.setWeekDay(4, ids[1]); }, '/');
    expect(ids()).toContain('plan-2026-10-09');
    global.__notifications.length = 0; act(() => { plan.setDayPlan('2026-10-10', t[0].id); }); await flushAll(10);
    expect(ids()).toEqual(['plan-2026-10-09', 'plan-2026-10-10', 'plan-2026-10-16', 'plan-2026-10-23', 'plan-2026-10-30']);
  });
  test('Ustawienia: przełącznik z opisem; wyłączenie zapisuje false i odwołuje', async () => {
    await boot(ids => { plan.setWeekDay(4, ids[1]); }, '/more/settings');
    expect(screen.getByText('rano o 8:00 w dniu zaplanowanego treningu')).toBeTruthy();
    const sw = screen.getByLabelText('Przypomnienie o treningu z planu'); expect(sw.props.accessibilityState.checked).toBe(true);
    global.__notifications.length = 0; await act(async () => { fireEvent(sw, 'valueChange', false); }); await flushAll(10);
    expect(S().settings.planReminder).toBe(false); expect(ids()).toEqual([]); expect(global.__cancelled).toContain('plan-2026-10-09');
    await act(async () => { fireEvent(screen.getByLabelText('Przypomnienie o treningu z planu'), 'valueChange', true); }); await flushAll(10); expect('planReminder' in S().settings).toBe(false); expect(ids()).toContain('plan-2026-10-09');
  });
  test('English', async () => {
    await boot(ids => { plan.setWeekDay(4, ids[1]); }, '/more/settings', 'en');
    expect(screen.getByText('Reminder for planned workouts')).toBeTruthy(); expect(screen.getByText('in the morning at 8:00 on a planned workout day')).toBeTruthy();
    const n = (global.__notifications as any[]).find(x => x.identifier === 'plan-2026-10-09'); expect(n.content.body).toBe('Workout from your weekly plan. Open the app to start.');
  });
});
