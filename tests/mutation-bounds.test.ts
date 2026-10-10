/*
 * Testy granic po testach mutacyjnych (audyt 0.10, fala 2, obszar TESTY — M2 / TST-02): lib/planReminder, lib/period, lib/dashboard, lib/whatsnew,
 * lib/deload(-sets) i limit tygodni deload w migrate. Każdy przypadek zabija mutanta, który przeżył Strykera 09.10.2026 (raport i pozostałe
 * mutanty z powodem — docs/09). Logika była dotąd sprawdzana głównie testami ekranów (poza zestawem mutacyjnym) i bez granic: termin
 * powiadomienia dokładnie 60 s przed, trening dokładnie o północy poniedziałku, szablon w archiwum w „Pierwszych krokach”, 520 tygodni.
 */
import * as store from '@/lib/store';
import * as plan from '@/lib/plan';
import { syncPlanReminders, planReminderKey, reminderPermission, askReminderPermission, PLAN_REMINDER_DAYS, PLAN_REMINDER_HOUR } from '@/lib/planReminder';
import { periodRange, periodSummary, periodTitle } from '@/lib/period';
import { weekStrip, weekTiles, lastWorkout, firstSteps } from '@/lib/dashboard';
import { WHATS_NEW, whatsNewUnseen, markWhatsNewSeen } from '@/lib/whatsnew';
import { trainingStreakWeeks, deloadHint, nextMonday, deloadKeep, deloadSets } from '@/lib/deload';
import { applyLang } from '@/lib/i18n';
import { fresh, withDemoTemplates, addWorkout, set } from './helpers';

const NOW = new Date(2026, 9, 8, 7, 0).getTime(); /* czwartek 8.10.2026, 7:00 (przed przypomnieniem o 8:00) */
const TODAY = '2026-10-08';
const S = () => store.getState();
const at = (k: string, h = 18, m = 0) => new Date(+k.slice(0, 4), +k.slice(5, 7) - 1, +k.slice(8, 10), h, m).getTime();
type N = { identifier: string; content: { title: string; body: string; sound: boolean }; trigger: { type: string; date: Date } };
const notes = () => global.__notifications as N[];
const G = global as unknown as Record<string, unknown>;
let A = '', B = '';
beforeEach(async () => { jest.useFakeTimers({ now: NOW }); await fresh(); const t = withDemoTemplates(); [A, B] = [t[0].id, t[1].id]; global.__notifications.length = 0; (global.__cancelled as string[]).length = 0; });
afterEach(() => { jest.useRealTimers(); applyLang('pl'); delete G.__notifPerm; });

describe('planReminder', () => {
  test('stałe: 8:00, 28 dni; przypomnienie dziś przed 8:00 — z treścią, o 8:00, bez dźwięku wyłączonego', async () => {
    expect([PLAN_REMINDER_HOUR, PLAN_REMINDER_DAYS]).toEqual([8, 28]);
    plan.setWeekDay(3, A); await syncPlanReminders(NOW);
    const n = notes().find(x => x.identifier === `plan-${TODAY}`)!;
    expect(n).toEqual({ identifier: `plan-${TODAY}`, content: { title: 'Dziś: Upper A', body: 'Trening z Twojego planu tygodnia. Otwórz aplikację, by zacząć.', sound: true }, trigger: { type: 'date', date: new Date(at(TODAY, 8)) } });
    expect(notes().map(x => x.identifier)).toEqual(Array.from({ length: 4 }, (_, i) => `plan-${plan.addDays(TODAY, 7 * i)}`)); /* 28 dni: 4 czwartki */
  });
  test('odwołuje od wczoraj do 27 dni naprzód (PLAN_REMINDER_DAYS + 1 identyfikatorów), nie dalej', async () => {
    plan.setWeekDay(3, A); await syncPlanReminders(NOW);
    const c = global.__cancelled as string[]; expect(c[0]).toBe(`plan-${plan.addDays(TODAY, -1)}`); expect(c).toHaveLength(PLAN_REMINDER_DAYS + 1);
    expect(c).not.toContain(`plan-${plan.addDays(TODAY, PLAN_REMINDER_DAYS)}`);
  });
  test('termin za mniej niż 60 s — iOS go nie przyjmie: dziś pominięty; dokładnie 60 s — planowany', async () => {
    plan.setWeekDay(3, A);
    await syncPlanReminders(at(TODAY, 8) - 60e3); expect(notes().some(x => x.identifier === `plan-${TODAY}`)).toBe(true); global.__notifications.length = 0;
    await syncPlanReminders(at(TODAY, 8) - 59e3); expect(notes().some(x => x.identifier === `plan-${TODAY}`)).toBe(false);
    await syncPlanReminders(at(TODAY, 8) + 60e3); expect(notes().some(x => x.identifier === `plan-${TODAY}`)).toBe(false);
  });
  test('w ostatniej minucie przed 8:00 dzisiejsze przypomnienie nie jest odwoływane (jest potrzebne); poza tą minutą — odwoływane', async () => {
    plan.setWeekDay(3, A); const c = global.__cancelled as string[];
    await syncPlanReminders(at(TODAY, 8) - 30e3); expect(c).not.toContain(`plan-${TODAY}`); c.length = 0;
    await syncPlanReminders(at(TODAY, 8) - 60e3); expect(c).toContain(`plan-${TODAY}`); c.length = 0; /* równo 60 s — już nie „ostatnia minuta” */
    await syncPlanReminders(at(TODAY, 8)); expect(c).toContain(`plan-${TODAY}`); c.length = 0; /* o 8:00 — termin minął */
    plan.setWeekDay(3, null); plan.setWeekDay(4, A); await syncPlanReminders(at(TODAY, 8) - 30e3); expect(c).toContain(`plan-${TODAY}`); /* dziś już bez treningu — odwołane */
  });
  test('wyłączone przypomnienie albo brak planu — nic nie planuje (stare odwołane)', async () => {
    plan.setWeekDay(3, A); S().settings.planReminder = false; await syncPlanReminders(NOW); expect(notes()).toEqual([]); expect((global.__cancelled as string[]).length).toBeGreaterThan(0);
    delete S().settings.planReminder; plan.setWeekDay(3, null); await syncPlanReminders(NOW); expect(notes()).toEqual([]);
  });
  test('dzień z treningiem w toku — bez przypomnienia; trening zrobiony — bez; inny trening — przypomnienie zostaje (A5)', async () => {
    plan.setWeekDay(3, A); plan.setWeekDay(4, B); store.startFromTemplate(S().templates.find(x => x.id === A)!);
    await syncPlanReminders(NOW); expect(notes().map(x => x.identifier)).not.toContain(`plan-${TODAY}`); expect(notes().map(x => x.identifier)).toContain('plan-2026-10-09');
    store.cancelWorkout(); global.__notifications.length = 0; addWorkout(at(TODAY, 6), [['Back Squat', [{ weight: 100, reps: 5 }]]]);
    await syncPlanReminders(NOW); expect(notes().map(x => x.identifier)).toContain(`plan-${TODAY}`);
  });
  test('planReminderKey: zmienia się z planem dnia, nazwą szablonu, pustym szablonem, treningiem w toku i ustawieniem', () => {
    plan.setWeekDay(3, A); const k0 = planReminderKey(NOW);
    expect(k0).toContain(`|${TODAY}|planned||`); expect(k0.split('|')[5].split(',')).toHaveLength(PLAN_REMINDER_DAYS); expect(k0.split('|')[5].split(',')[0]).toBe(A); expect(k0.split('|')[5].split(',')[1]).toBe('-');
    const t = S().templates.find(x => x.id === A)!; t.name = 'Zmiana'; const k1 = planReminderKey(NOW); expect(k1).not.toBe(k0); expect(k1).toContain(`${A}Zmiana`);
    const items = t.items; t.items = []; expect(planReminderKey(NOW)).toContain(`${A}Zmiana∅`); t.items = items;
    store.startEmpty(); expect(planReminderKey(NOW)).toContain(`|${TODAY}|planned|${TODAY}|`);
  });
  test('reminderPermission: zgoda / odmowa (bez ponownego pytania albo status denied) / jeszcze nie pytano; błąd — nie pytano', async () => {
    G.__notifPerm = { granted: true }; expect(await reminderPermission()).toBe('granted');
    G.__notifPerm = { granted: false, canAskAgain: false, status: 'undetermined' }; expect(await reminderPermission()).toBe('denied');
    G.__notifPerm = { granted: false, canAskAgain: true, status: 'denied' }; expect(await reminderPermission()).toBe('denied');
    G.__notifPerm = { granted: false, canAskAgain: true, status: 'undetermined' }; expect(await reminderPermission()).toBe('undetermined');
    G.__notifPerm = { get granted() { throw new Error('moduł'); } }; expect(await reminderPermission()).toBe('undetermined');
  });
  test('askReminderPermission: okno z „Nie teraz” (anuluj) i „Dalej” (prośba iOS) tylko, gdy iOS jeszcze nie pytał i przypomnienie włączone', async () => {
    G.__notifPerm = { granted: false, canAskAgain: true, status: 'undetermined' }; G.__notifPermAsked = 0; global.__alerts.length = 0;
    await askReminderPermission(); const a = global.__alerts[0];
    expect(a.title).toBe('Przypomnienie o treningu z planu'); expect(a.buttons!.map(b => [b.text, b.style])).toEqual([['Nie teraz', 'cancel'], ['Dalej', undefined]]);
    a.buttons![1].onPress!(); await Promise.resolve(); expect(G.__notifPermAsked).toBe(1);
    global.__alerts.length = 0; S().settings.planReminder = false; await askReminderPermission(); expect(global.__alerts).toEqual([]);
    delete S().settings.planReminder; G.__notifPerm = { granted: true }; await askReminderPermission(); expect(global.__alerts).toEqual([]);
  });
});

describe('period', () => {
  test('granice tygodnia: trening dokładnie o północy poniedziałku należy do nowego tygodnia, minutę wcześniej — do poprzedniego', () => {
    const mon = at('2026-10-05', 0); addWorkout(mon, [['Back Squat', [{ weight: 100, reps: 5 }]]]); addWorkout(mon - 60e3, [['Back Squat', [{ weight: 90, reps: 5 }]]]);
    const s = periodSummary('week', 0, new Date(NOW)); expect([s.workouts, s.prev.workouts]).toEqual([1, 1]);
    expect(periodRange('week', 0, new Date(NOW))).toEqual({ start: mon, end: at('2026-10-12', 0) });
    expect(periodRange('week', -1, new Date(NOW))).toEqual({ start: at('2026-09-28', 0), end: mon });
  });
  test('granice miesiąca: 1. dzień o północy — nowy miesiąc; poprzedni miesiąc obok; tytuł tygodnia i miesiąca', () => {
    addWorkout(at('2026-10-01', 0), [['Back Squat', [{ weight: 100, reps: 5 }]]]); addWorkout(at('2026-09-30', 23, 59), [['Back Squat', [{ weight: 100, reps: 5 }]]]);
    const s = periodSummary('month', 0, new Date(NOW)); expect([s.kind, s.workouts, s.prev.workouts, s.start, s.end]).toEqual(['month', 1, 1, at('2026-10-01', 0), at('2026-11-01', 0)]);
    expect(periodRange('month', -1, new Date(NOW))).toEqual({ start: at('2026-09-01', 0), end: at('2026-10-01', 0) });
    expect(periodTitle('month', at('2026-10-01', 0))).toBe('październik 2026');
    expect(periodTitle('week', at('2026-10-05', 0))).toBe('5 paź – 11 paź 2026');
  });
  test('sumy: objętość i czas dodawane (bez pauz), serie robocze; rekordy z okresu w kolejności startu', () => {
    addWorkout(at('2026-09-20', 18), [['Back Squat', [{ weight: 70, reps: 5 }]]]); /* wcześniejszy trening — rekordy w okresie są względem niego */
    const w1 = addWorkout(at('2026-10-06', 18), [['Back Squat', [{ weight: 100, reps: 5 }]]]); const w2 = addWorkout(at('2026-10-05', 18), [['Back Squat', [{ weight: 80, reps: 5 }, { kind: 'warmup', weight: 40, reps: 5 }]]]);
    w1.pauses = [[w1.startedAt + 60e3, w1.startedAt + 660e3]]; store.save(w1);
    const s = periodSummary('week', 0, new Date(NOW));
    expect([s.workouts, s.sets, s.volume, s.durationSec]).toEqual([2, 2, 100 * 5 + 80 * 5, 3600 - 600 + 3600]); /* sztanga — ciężar całkowity (store.volume); rozgrzewka poza objętością */
    const ids = s.prs.map(p => p.workoutId); expect(ids.length).toBeGreaterThan(1); expect(ids[0]).toBe(w2.id); expect(ids[ids.length - 1]).toBe(w1.id); /* rekordy po kolejności startu, nie dodania */
    expect(s.prs[0].at).toBe(w2.startedAt); expect(s.prs.every(p => p.pr && p.pr.details.length)).toBe(true);
  });
});

describe('dashboard', () => {
  test('weekStrip: pamięć do zmiany stanu albo dnia; nowy stan (import) — liczy od nowa; dzień „dziś” tylko jeden', () => {
    plan.setWeekDay(3, A); const a = weekStrip(NOW); expect(weekStrip(NOW)).toBe(a);
    expect(a.filter(d => d.today).map(d => d.date)).toEqual([TODAY]); expect(a.map(d => d.date)[0]).toBe('2026-10-05');
    expect(a.find(d => d.date === TODAY)).toEqual({ date: TODAY, status: 'planned', templateId: A, today: true, inPlan: true });
    expect(a.find(d => d.date === '2026-10-05')!.inPlan).toBe(false); /* plan od dziś — poniedziałek sprzed planu bez odpoczynku */
    store.replaceState(JSON.parse(JSON.stringify(S()))); expect(weekStrip(NOW)).not.toBe(a); /* ten sam licznik, inny stan */
    expect(weekStrip(NOW + 86400e3)).not.toBe(weekStrip(NOW));
  });
  test('weekTiles: plan tylko w zmianie dnia też liczy się jako plan; bez planu — null', () => {
    expect(weekTiles(NOW)).toMatchObject({ planned: null, planDone: null });
    plan.setDayPlan('2026-10-09', A); const t = weekTiles(NOW); expect([t.planned, t.planDone]).toEqual([1, 0]);
  });
  test('lastWorkout: brak treningów — null; firstSteps: szablon w archiwum albo pusty nie zalicza kroku; po treningu — null', () => {
    expect(lastWorkout()).toBeNull();
    for (const t of S().templates) store.setTemplateArchived(t, true); expect(firstSteps()).toEqual({ template: false, plan: false });
    store.setTemplateArchived(S().templates[0], false); expect(firstSteps()!.template).toBe(true);
    for (const t of S().templates) t.items = []; expect(firstSteps()!.template).toBe(false);
    addWorkout(at('2026-10-06'), [['Back Squat', [{ weight: 100, reps: 5 }]]]); expect(firstSteps()).toBeNull(); expect(lastWorkout()!.sets).toBe(1);
  });
});

describe('whatsnew', () => {
  test('wpisy od najnowszego, każdy z tekstami; kropka tylko u kogoś z treningiem; otwarcie — przeczytane, bez zbędnego zapisu', () => {
    expect(WHATS_NEW.map(w => w.id)).toEqual(['2026-10-09', '2026-10-08', '2026-10-07', '2026-10-06']); expect(WHATS_NEW.map(w => w.build)).toEqual([1005, 1004, 1002, 1001]);
    expect(WHATS_NEW.map(w => w.items().length)).toEqual([10, 9, 3, 2]); expect(WHATS_NEW.every(w => w.items().every(x => typeof x === 'string' && x.length > 10))).toBe(true);
    expect(whatsNewUnseen()).toBe(false); /* nowa osoba */
    addWorkout(at('2026-10-06'), [['Back Squat', [{ weight: 100, reps: 5 }]]]); expect(whatsNewUnseen()).toBe(true);
    markWhatsNewSeen(); expect(S().whatsNewSeen).toBe(WHATS_NEW[0].id); expect(whatsNewUnseen()).toBe(false);
    const rev = store.getRev(); markWhatsNewSeen(); expect(store.getRev()).toBe(rev);
    S().whatsNewSeen = WHATS_NEW[1].id; expect(whatsNewUnseen()).toBe(true);
  });
});

describe('deload', () => {
  const weekly = (n: number, last = '2026-10-01') => { for (let i = 0; i < n; i++) addWorkout(at(last) - i * 7 * 86400e3, [['Back Squat', [{ weight: 100, reps: 5 }]]]); };
  test('seria tygodni: bieżący tydzień bez treningu — liczy do poprzedniego; z treningiem — od bieżącego; deload przerywa', () => {
    weekly(4); expect(trainingStreakWeeks(NOW)).toBe(4);
    addWorkout(at('2026-10-06'), [['Back Squat', [{ weight: 100, reps: 5 }]]]); expect(trainingStreakWeeks(NOW)).toBe(5);
    store.toggleDeloadWeek(at('2026-09-23')); expect(trainingStreakWeeks(NOW)).toBe(2);
  });
  test('bieżący tydzień oznaczony jako deload (bez treningu) — seria 0; podpowiedź „current”; następny tydzień — „next”', () => {
    weekly(4); store.toggleDeloadWeek(NOW); expect(trainingStreakWeeks(NOW)).toBe(0); expect(deloadHint(NOW)).toEqual({ kind: 'current' });
    store.toggleDeloadWeek(NOW); store.toggleDeloadWeek(at('2026-10-12')); expect(deloadHint(NOW)).toEqual({ kind: 'next', from: '2026-10-12' });
    expect(nextMonday(NOW)).toBe('2026-10-12');
  });
  test('seria liczona najwyżej 520 tygodni (10 lat)', () => {
    weekly(521, '2026-10-01'); expect(trainingStreakWeeks(NOW)).toBe(520);
  });
  test('deloadKeep / deloadSets: 0 i 1 seria bez zmian, 2 → 1, 3 → 2; rozgrzewki zostają, drop z serią', () => {
    expect([0, 1, 2, 3, 4, 5].map(deloadKeep)).toEqual([0, 1, 1, 2, 2, 3]);
    const s = [set({ kind: 'warmup' }), set(), set({ kind: 'drop' }), set(), set({ kind: 'drop' }), set()];
    expect(deloadSets(s).map(x => x.kind)).toEqual(['warmup', 'normal', 'drop', 'normal', 'drop']);
  });
});

describe('backup: czas treningu w CSV (audyt TST-02 — mutant round → floor przeżył)', () => {
  test('30 min 40 s → „31m” (zaokrąglenie, nie obcięcie); 30 min 20 s → „30m”', () => {
    const { buildCsv } = require('@/lib/backup');
    const w = addWorkout(at('2026-10-06', 18), [['Back Squat', [{ weight: 100, reps: 5 }]]]); w.finishedAt = w.startedAt + (30 * 60 + 40) * 1000; store.save(w);
    expect(buildCsv().split('\n')[1].split(',')[2]).toBe('31m');
    w.finishedAt = w.startedAt + (30 * 60 + 20) * 1000; store.save(w); expect(buildCsv().split('\n')[1].split(',')[2]).toBe('30m');
  });
});

describe('store: limit tygodni deload w migrate', () => {
  test('najwyżej DELOAD_WEEKS_MAX (520) — najstarsze odpadają; tylko poniedziałki', () => {
    const mondays = Array.from({ length: store.DELOAD_WEEKS_MAX + 1 }, (_, i) => store.mondayKey(at('2026-10-05', 12) - i * 7 * 86400e3)).sort();
    const m = store.migrate({ ...JSON.parse(JSON.stringify(S())), deloadWeeks: [...mondays, '2026-10-06'] });
    expect(m.deloadWeeks).toHaveLength(store.DELOAD_WEEKS_MAX); expect(m.deloadWeeks![0]).toBe(mondays[1]); expect(m.deloadWeeks).not.toContain('2026-10-06');
  });
});
