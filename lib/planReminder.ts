import * as Notifications from 'expo-notifications';
import { Alert } from 'react-native';
import { workoutDay, getState } from '@/lib/store';
import { hasPlan, plannedOn, addDays, dayKeyOf, dayStatus, pending } from '@/lib/plan';
import { t, lang } from '@/lib/i18n';

/*
 * Przypomnienie o treningu z planu (decyzja właściciela 08.10.2026: „rano w dniu treningu”, jedno lokalne powiadomienie). Godzina 8:00 —
 * potwierdzona przez właściciela 08.10.2026. Planujemy PLAN_REMINDER_DAYS dni naprzód (limit iOS: 64 zaplanowane powiadomienia); każda
 * synchronizacja odwołuje poprzednie (identyfikatory `plan-RRRR-MM-DD`). Bez dnia, w którym zaplanowany trening już zrobiony albo trening trwa,
 * i bez pustego szablonu (audyt 0.10 A8); po innym treningu zaplanowany czeka — przypomnienie zostaje (A5). Wyłączenie: Settings.planReminder = false. Zgoda na powiadomienia: prośba przy pierwszym dniu w planie (audyt 0.10 I1).
 */
export const PLAN_REMINDER_HOUR = 8;
/** Audyt 0.10 I1 (UX-05): ok. 4 tygodnie naprzód (1 powiadomienie dziennie, daleko od limitu 64 w iOS) — kto nie otworzy aplikacji przez
 * tydzień, nadal dostaje przypomnienia (przy 7 dniach przestawał właśnie wtedy). */
export const PLAN_REMINDER_DAYS = 28;
export const planReminderOn = () => getState().settings.planReminder !== false;
const idOf = (k: string) => `plan-${k}`;
const whenOf = (k: string) => new Date(+k.slice(0, 4), +k.slice(5, 7) - 1, +k.slice(8, 10), PLAN_REMINDER_HOUR, 0).getTime();
/** Dzień z treningiem w toku — bez przypomnienia. */
const activeDay = () => { const a = getState().active; return a ? workoutDay(a) : null; };
/** Nazwa treningu do przypomnienia w dniu `k` albo null. Ta sama funkcja stanu dnia co kalendarz (audyt 0.10 A5): zaplanowany czeka
 * (bez treningu albo po innym treningu); nie — gdy zrobiony, w toku albo szablon pusty (A8). */
function reminderName(k: string, active: string | null): string | null {
  const st = dayStatus(k); if (!pending(st) || k === active) return null;
  const tpl = getState().templates.find(x => x.id === st.templateId); return tpl && tpl.items.length ? tpl.name : null;
}

export async function syncPlanReminders(now = Date.now()) {
  const today = dayKeyOf(now); const on = planReminderOn() && hasPlan(); const done = activeDay();
  /* audyt 0.10 I2 (LOG-12): w ostatniej minucie przed godziną przypomnienia nie odwołujemy dzisiejszego — nowego terminu iOS już nie przyjmie;
   * odwołujemy, gdy dziś przypomnienie przestało być potrzebne (trening zrobiony, zmiana planu, wyłączenie) */
  const keepToday = on && whenOf(today) > now && whenOf(today) - now < 60e3 && !!reminderName(today, done);
  try { for (let i = -1; i < PLAN_REMINDER_DAYS; i++) { if (i === 0 && keepToday) continue; await Notifications.cancelScheduledNotificationAsync(idOf(addDays(today, i))); } } catch {}
  if (!on) return;
  for (let i = 0; i < PLAN_REMINDER_DAYS; i++) {
    const k = addDays(today, i); const name = reminderName(k, done); if (!name) continue;
    const when = new Date(whenOf(k)); if (when.getTime() - now < 60e3) continue; /* iOS nie przyjmuje terminu w przeszłości */
    try { await Notifications.scheduleNotificationAsync({ identifier: idOf(k), content: { title: t('Dziś: {name}', { name }), body: t('Trening z Twojego planu tygodnia. Otwórz aplikację, by zacząć.'), sound: true }, trigger: { type: Notifications.SchedulableTriggerInputTypes.DATE, date: when } }); } catch {}
  }
}

/** Klucz stanu, od którego zależą przypomnienia — synchronizacja tylko przy zmianie (komponent PlanReminderSync). Z językiem (audyt 0.10 I2:
 * po zmianie języka przypomnienia planują się od nowa w nowym języku) i z pustymi szablonami (A8). */
export function planReminderKey(now = Date.now()) {
  const today = dayKeyOf(now); const st = getState();
  const days = Array.from({ length: PLAN_REMINDER_DAYS }, (_, i) => plannedOn(addDays(today, i)) ?? '-');
  return `${planReminderOn()}|${lang()}|${today}|${dayStatus(today).status}|${activeDay() ?? ''}|${days.join(',')}|${st.templates.map(x => x.id + x.name + (x.items.length ? '' : '∅')).join(',')}`;
}

export type ReminderPermission = 'granted' | 'denied' | 'undetermined';
/** Stan zgody na powiadomienia (Ustawienia, audyt 0.10 I1): odmowa — iOS już nie zapyta, zgodę zmienia się w Ustawieniach iOS. */
export async function reminderPermission(): Promise<ReminderPermission> {
  try { const p = await Notifications.getPermissionsAsync(); return p.granted ? 'granted' : p.canAskAgain === false || p.status === 'denied' ? 'denied' : 'undetermined'; } catch { return 'undetermined'; }
}
/** Audyt 0.10 I1 (UX-05, X-11): przy pierwszym dniu w planie — wyjaśnienie i prośba o zgodę (tylko gdy iOS jeszcze nie pytał i przypomnienie
 * jest włączone). Odmowa wcześniej — bez okna; stan widać przy przełączniku w Ustawieniach. */
export async function askReminderPermission(): Promise<void> {
  if (!planReminderOn() || (await reminderPermission()) !== 'undetermined') return;
  Alert.alert(t('Przypomnienie o treningu z planu'), t('Rano o {h}:00 w dniu zaplanowanego treningu przyjdzie powiadomienie. Potrzebna jest zgoda na powiadomienia — iOS zapyta o nią po „Dalej”.', { h: PLAN_REMINDER_HOUR }), [
    { text: t('Nie teraz'), style: 'cancel' }, { text: t('Dalej'), onPress: () => { Notifications.requestPermissionsAsync().catch(() => {}); } },
  ]);
}
