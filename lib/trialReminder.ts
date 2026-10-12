/*
 * Przypomnienie przed końcem okresu próbnego (decyzja właściciela 12.10.2026, P5 A): jedno lokalne powiadomienie PAYWALL_MOMENTS.TRIAL_END_REMINDER_DAYS dni
 * przed końcem próby; zgoda na powiadomienia ta sama co dla przerw i planu (aplikacja o nią tu nie pyta). Identyfikator stały — każda synchronizacja
 * odwołuje poprzednie. Brak próby (kupiony plan, dożywotni, wygasły, zwrot) → powiadomienie odwołane.
 */
import * as Notifications from 'expo-notifications';
import { entitlementActive, entitlementEnd, type Entitlement } from '@/lib/access';
import { PAYWALL_MOMENTS } from '@/lib/products';
import { fmtDate } from '@/lib/store';
import { t } from '@/lib/i18n';

export const TRIAL_REMINDER_ID = 'trial-end';
const DAY_MS = 86400e3;
/** Chwila przypomnienia (ms) dla listy uprawnień albo null, gdy nie ma aktywnej próby / termin już minął / iOS nie przyjmie terminu (< 1 min). */
export function trialReminderAt(list: readonly Entitlement[] | null | undefined, now: number): { at: number; end: number } | null {
  let best: { at: number; end: number } | null = null;
  for (const e of list ?? []) {
    if (!e.trial || !entitlementActive(e, now)) continue; const end = entitlementEnd(e); if (end == null || end === Infinity) continue;
    const at = end - PAYWALL_MOMENTS.TRIAL_END_REMINDER_DAYS * DAY_MS; if (at - now < 60e3) continue;
    if (!best || end > best.end) best = { at, end };
  }
  return best;
}
export async function syncTrialReminder(list: readonly Entitlement[] | null | undefined, now: number = Date.now()): Promise<void> {
  if (list == null) return; /* brak odpowiedzi sklepu — niczego nie zmieniamy */
  try { await Notifications.cancelScheduledNotificationAsync(TRIAL_REMINDER_ID); } catch {}
  const r = trialReminderAt(list, now); if (!r) return;
  try {
    await Notifications.scheduleNotificationAsync({ identifier: TRIAL_REMINDER_ID, content: { title: t('Okres próbny dobiega końca'),
      body: t('Okres próbny kończy się {date}. Jeśli nie chcesz subskrypcji, anuluj ją w ustawieniach konta Apple.', { date: fmtDate(r.end) }), sound: true },
      trigger: { type: Notifications.SchedulableTriggerInputTypes.DATE, date: new Date(r.at) } });
  } catch { /* brak zgody / błąd iOS: bez przypomnienia, dostęp bez zmian */ }
}
