import { useEffect, useRef } from 'react';
import { useTick, useForegroundTick } from '@/lib/store';
import { planReminderKey, syncPlanReminders, askReminderPermission } from '@/lib/planReminder';
import { hasPlan } from '@/lib/plan';

/** Przypomnienia o treningu z planu (08.10.2026): synchronizacja przy starcie, powrocie z tła i każdej zmianie planu, ustawienia albo treningu dziś. */
export function PlanReminderSync() {
  useTick(); useForegroundTick(); const key = planReminderKey();
  useEffect(() => { syncPlanReminders().catch(() => {}); }, [key]);
  /* X-11 (audyt kontrolny 1): prośba o zgodę przy KAŻDEJ drodze powstania pierwszego planu (dzień w planie, panel dnia, generator „Ustaw jako
   * aktywny”, „Ustaw jako aktywny” zapisanego planu, plan z własnych szablonów) — przejście hasPlan false → true w czasie działania aplikacji
   * (nie przy starcie); askReminderPermission pyta najwyżej raz na uruchomienie, więc drogi z własnym wywołaniem nie dają drugiego okna. */
  const had = useRef<boolean | null>(null); const now = hasPlan();
  useEffect(() => { if (had.current === false && now) askReminderPermission().catch(() => {}); had.current = now; }, [now]);
  return null;
}
