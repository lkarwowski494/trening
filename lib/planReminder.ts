import * as Notifications from 'expo-notifications';
import { getState, finishedWorkouts } from '@/lib/store';
import { hasPlan, plannedOn, addDays, dayKeyOf } from '@/lib/plan';
import { t } from '@/lib/i18n';

/*
 * Przypomnienie o treningu z planu (decyzja właściciela 08.10.2026: „rano w dniu treningu”, jedno lokalne powiadomienie). Godzina 8:00 — wybór
 * agenta dla „rano”, do potwierdzenia przez właściciela. Planujemy 7 dni naprzód (limit iOS: 64 zaplanowane powiadomienia); każda synchronizacja
 * odwołuje poprzednie (identyfikatory `plan-RRRR-MM-DD`). Bez dnia, w którym trening już zrobiony albo trwa. Wyłączenie: Settings.planReminder = false.
 */
export const PLAN_REMINDER_HOUR = 8;
export const PLAN_REMINDER_DAYS = 7;
export const planReminderOn = () => getState().settings.planReminder !== false;
const idOf = (k: string) => `plan-${k}`;

export async function syncPlanReminders(now = Date.now()) {
  const today = dayKeyOf(now);
  try { for (let i = -1; i < PLAN_REMINDER_DAYS; i++) await Notifications.cancelScheduledNotificationAsync(idOf(addDays(today, i))); } catch {}
  if (!planReminderOn() || !hasPlan()) return;
  const st = getState(); const done = new Set(finishedWorkouts().map(w => dayKeyOf(w.startedAt))); if (st.active) done.add(dayKeyOf(st.active.startedAt));
  for (let i = 0; i < PLAN_REMINDER_DAYS; i++) {
    const k = addDays(today, i); const id = plannedOn(k); if (!id || done.has(k)) continue;
    const name = st.templates.find(x => x.id === id)?.name; if (!name) continue;
    const when = new Date(+k.slice(0, 4), +k.slice(5, 7) - 1, +k.slice(8, 10), PLAN_REMINDER_HOUR, 0); if (when.getTime() - now < 60e3) continue; /* iOS nie przyjmuje terminu w przeszłości */
    try { await Notifications.scheduleNotificationAsync({ identifier: idOf(k), content: { title: t('Dziś: {name}', { name }), body: t('Trening z Twojego planu tygodnia. Otwórz aplikację, by zacząć.'), sound: true }, trigger: { type: Notifications.SchedulableTriggerInputTypes.DATE, date: when } }); } catch {}
  }
}

/** Klucz stanu, od którego zależą przypomnienia — synchronizacja tylko przy zmianie (komponent PlanReminderSync). */
export function planReminderKey(now = Date.now()) {
  const today = dayKeyOf(now); const st = getState();
  const days = Array.from({ length: PLAN_REMINDER_DAYS }, (_, i) => plannedOn(addDays(today, i)) ?? '-');
  const done = finishedWorkouts().some(w => dayKeyOf(w.startedAt) === today) || !!st.active;
  return `${planReminderOn()}|${today}|${done}|${days.join(',')}|${st.templates.map(x => x.id + x.name).join(',')}`;
}
