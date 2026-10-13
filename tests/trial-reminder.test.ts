/*
 * 0.17.0, przypomnienie przed końcem okresu próbnego (decyzja właściciela 12.10.2026, P5 A: lokalne powiadomienie 2 dni przed końcem; zgoda na powiadomienia ta sama co dla przerw).
 * Rodzaje (docs/20): logika (termin, warunki), integracja z uprawnieniami (zakup → zaplanowane, dożywotni/anulowanie → odwołane), języki (PL/EN), regresja (błąd iOS nie psuje dostępu).
 */
import * as Notifications from 'expo-notifications';
import { PAYWALL, type Entitlement } from '@/lib/access';
import { PAYWALL_MOMENTS } from '@/lib/products';
import { TRIAL_REMINDER_ID, trialReminderAt, syncTrialReminder } from '@/lib/trialReminder';
import { setStoreAdapter, resetStoreAdapterForTests } from '@/lib/store-adapter';
import { createFakeStore } from '@/lib/store-fake';
import * as ent from '@/lib/entitlement';
import { applyLang } from '@/lib/i18n';
import { fmtDate } from '@/lib/store';
import { fresh } from './helpers';

const DAY = 86400e3; const NOW = new Date(2026, 9, 14, 12, 0).getTime();
const trial = (end: number, extra: Partial<Entitlement> = {}): Entitlement => ({ plan: 'monthly', source: 'purchase', expiresAt: end, trial: true, ...extra });
const REM = PAYWALL_MOMENTS.TRIAL_END_REMINDER_DAYS * DAY;
const notes = () => global.__notifications as any[];
beforeEach(() => { global.__notifications.length = 0; global.__cancelled.length = 0; });
afterEach(() => { PAYWALL.ENABLED = false; ent.resetEntitlementsForTests(); resetStoreAdapterForTests(); applyLang('pl'); jest.useRealTimers(); jest.restoreAllMocks(); });

describe('trialReminderAt', () => {
  test('próba kończąca się za 30 dni → przypomnienie 2 dni przed końcem; najpóźniejsza próba wygrywa; null/pusta lista → null', () => {
    expect(PAYWALL_MOMENTS.TRIAL_END_REMINDER_DAYS).toBe(2);
    expect(trialReminderAt([trial(NOW + 30 * DAY)], NOW)).toEqual({ at: NOW + 30 * DAY - REM, end: NOW + 30 * DAY });
    expect(trialReminderAt([trial(NOW + 5 * DAY), trial(NOW + 9 * DAY)], NOW)!.end).toBe(NOW + 9 * DAY);
    expect(trialReminderAt([], NOW)).toBeNull(); expect(trialReminderAt(null, NOW)).toBeNull(); expect(trialReminderAt(undefined, NOW)).toBeNull();
  });
  test.each([
    ['bez znacznika próby', { plan: 'monthly', source: 'purchase', expiresAt: NOW + 30 * DAY } as Entitlement],
    ['wygasła', trial(NOW - DAY)], ['cofnięta (zwrot)', trial(NOW + 30 * DAY, { revokedAt: NOW - 1 })], ['dożywotni', { plan: 'lifetime', source: 'purchase', expiresAt: null, trial: true } as Entitlement],
    ['termin przypomnienia już minął (koniec za 1 dzień)', trial(NOW + DAY)], ['termin za mniej niż minutę', trial(NOW + REM + 30e3)],
  ])('brak przypomnienia: %s', (_n, e) => { expect(trialReminderAt([e], NOW)).toBeNull(); });
  test('granica: koniec dokładnie za 2 dni + 1 minuta → jest; minuta mniej → brak', () => {
    expect(trialReminderAt([trial(NOW + REM + 60e3)], NOW)).not.toBeNull(); expect(trialReminderAt([trial(NOW + REM + 59e3)], NOW)).toBeNull();
  });
});

describe('syncTrialReminder', () => {
  test('planuje jedno powiadomienie z datą wyzwalacza, stałym identyfikatorem i tekstem z datą końca (PL i EN); poprzednie odwołane', async () => {
    jest.useFakeTimers({ now: NOW }); await fresh(); const end = NOW + 30 * DAY;
    await syncTrialReminder([trial(end)], NOW); expect(global.__cancelled).toEqual([TRIAL_REMINDER_ID]); expect(global.__notifications).toHaveLength(1);
    const n = notes()[0]; expect(n.identifier).toBe(TRIAL_REMINDER_ID); expect(n.trigger).toEqual({ type: 'date', date: new Date(end - REM) }); expect(n.content.title).toBe('Okres próbny dobiega końca');
    expect(n.content.body).toBe(`Okres próbny kończy się ${fmtDate(end)}. Jeśli nie chcesz subskrypcji, anuluj ją w ustawieniach konta Apple.`);
    global.__notifications.length = 0; applyLang('en'); await syncTrialReminder([trial(end)], NOW);
    expect(notes()[0].content.title).toBe('Your free trial is ending'); expect(notes()[0].content.body).toBe(`Your free trial ends on ${fmtDate(end)}. If you don't want the subscription, cancel it in your Apple account settings.`);
  });
  test('brak próby → tylko odwołanie; brak odpowiedzi sklepu (null) → niczego nie zmienia; błąd iOS przy planowaniu/odwoływaniu jest połykany', async () => {
    jest.useFakeTimers({ now: NOW }); await fresh(); await syncTrialReminder([], NOW); expect(global.__cancelled).toEqual([TRIAL_REMINDER_ID]); expect(global.__notifications).toEqual([]);
    global.__cancelled.length = 0; await syncTrialReminder(null, NOW); expect(global.__cancelled).toEqual([]); expect(global.__notifications).toEqual([]);
    jest.spyOn(Notifications, 'scheduleNotificationAsync').mockRejectedValue(new Error('brak zgody')); jest.spyOn(Notifications, 'cancelScheduledNotificationAsync').mockRejectedValue(new Error('x'));
    await expect(syncTrialReminder([trial(NOW + 30 * DAY)], NOW)).resolves.toBeUndefined();
  });
});

describe('integracja z uprawnieniami', () => {
  async function boot(entitlements: Entitlement[] | null, on = true) { jest.useFakeTimers({ now: NOW }); await fresh(); ent.resetEntitlementsForTests(); PAYWALL.ENABLED = on; const f = createFakeStore(entitlements); setStoreAdapter(f); await ent.initEntitlements(); for (let i = 0; i < 8; i++) await Promise.resolve(); return f; }
  test('zakup z miesiącem za darmo planuje przypomnienie na koniec próby − 2 dni; dożywotni sam (bez próby) je odwołuje; zwrot — też', async () => {
    const f = await boot([]); global.__notifications.length = 0; await ent.purchasePlan('monthly'); for (let i = 0; i < 8; i++) await Promise.resolve();
    expect(global.__notifications).toHaveLength(1); expect(notes()[0].trigger.date.getTime()).toBe(NOW + 30 * DAY - REM);
    global.__notifications.length = 0; global.__cancelled.length = 0; await ent.purchasePlan('lifetime'); for (let i = 0; i < 8; i++) await Promise.resolve(); expect(global.__notifications).toHaveLength(1); /* próba subskrypcji trwa obok dożywotniego — przypomnienie pozwala ją anulować (R8) */
    global.__notifications.length = 0; global.__cancelled.length = 0; f.setEntitlements([{ plan: 'lifetime', source: 'purchase', expiresAt: null }]); for (let i = 0; i < 8; i++) await Promise.resolve(); expect(global.__notifications).toEqual([]); expect(global.__cancelled).toContain(TRIAL_REMINDER_ID);
    f.setEntitlements([trial(NOW + 30 * DAY, { revokedAt: NOW - 1 })]); for (let i = 0; i < 8; i++) await Promise.resolve(); expect(global.__notifications).toEqual([]);
  });
  test('start aplikacji z trwającą próbą odtwarza przypomnienie; błąd odczytu uprawnień go nie rusza; przełącznik wyłączony — brak powiadomień i odwołań', async () => {
    await boot([trial(NOW + 30 * DAY)]); expect(global.__notifications).toHaveLength(1);
    global.__notifications.length = 0; global.__cancelled.length = 0; const f = await boot(null); expect(global.__notifications).toEqual([]); expect(global.__cancelled).toEqual([]); void f;
    global.__cancelled.length = 0; await boot([trial(NOW + 30 * DAY)], false); expect(global.__notifications).toEqual([]); expect(global.__cancelled).toEqual([]);
  });
  test('próba kupiona już po terminie przypomnienia (koniec za < 2 dni): bez powiadomienia', async () => { await boot([trial(NOW + DAY)]); expect(global.__notifications).toEqual([]); });
});
