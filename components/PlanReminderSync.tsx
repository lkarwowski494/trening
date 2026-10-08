import { useEffect } from 'react';
import { useTick, useForegroundTick } from '@/lib/store';
import { planReminderKey, syncPlanReminders } from '@/lib/planReminder';

/** Przypomnienia o treningu z planu (08.10.2026): synchronizacja przy starcie, powrocie z tła i każdej zmianie planu, ustawienia albo treningu dziś. */
export function PlanReminderSync() {
  useTick(); useForegroundTick(); const key = planReminderKey();
  useEffect(() => { syncPlanReminders().catch(() => {}); }, [key]);
  return null;
}
