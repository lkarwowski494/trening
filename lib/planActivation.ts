import { futureChanges, planName, weekPlanDays } from './plan';
import { t } from './i18n';

/*
 * Audyt 0.10.0 B1 (UI-02, X-07, DAT-02, LOG-05): jeden tekst potwierdzenia zmiany aktywnego planu — ekran Plan („Ustaw jako aktywny” w „Inne plany”)
 * i generator („Ustaw jako aktywny”). Mówi tylko to, co activatePlan (lib/plan.ts) naprawdę zrobi:
 *  - „Obecny plan zostanie zapisany w »Inne plany«” — tylko, gdy obecny plan ma jakiś dzień albo nazwę (pusty plan bez nazwy nie jest zapisywany);
 *  - liczba zmian pojedynczych dni od dziś, które zostaną usunięte (futureChanges).
 * Pusty tekst — nic do powiedzenia (pusty plan, bez zmian dni).
 */
export function activationNote(): string {
  const keep = weekPlanDays().some(Boolean) || !!planName(); const n = futureChanges();
  if (keep && n) return t('Obecny plan zostanie zapisany w „Inne plany”. Zmiany pojedynczych dni od dziś zostaną usunięte: {n}.', { n });
  if (keep) return t('Obecny plan zostanie zapisany w „Inne plany”.');
  return n ? t('Zmiany pojedynczych dni od dziś zostaną usunięte: {n}.', { n }) : '';
}
