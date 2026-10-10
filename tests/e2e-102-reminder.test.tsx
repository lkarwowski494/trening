/**
 * E2E 102 (run 37992276800, 09.10.2026, 17/18): scenariusz 13 — po wyborze pierwszego dnia planu okno „Przypomnienie o treningu z planu”
 * pokazało się DWA razy (zrzut: po „Not now” okno wciąż na ekranie). Przyczyna: app/plan.tsx i PlanReminderSync (X-11) wołają
 * askReminderPermission niemal naraz, a znacznik „pytano w tym uruchomieniu” był ustawiany dopiero po asynchronicznym sprawdzeniu zgody —
 * oba wywołania przechodziły przez warunek. Naprawa: znacznik przed pierwszym `await` (lib/planReminder.ts).
 */
import { askReminderPermission } from '@/lib/planReminder';
import { fresh } from './helpers';

const g = global as any;
beforeEach(async () => { await fresh(); g.__notifPerm = { granted: false, canAskAgain: true, status: 'undetermined' }; global.__alerts.length = 0; });
afterEach(() => { delete g.__notifPerm; });

test('dwa wywołania naraz (ekran planu + PlanReminderSync) — jedno okno zgody', async () => {
  await Promise.all([askReminderPermission(), askReminderPermission()]);
  expect(global.__alerts.filter(a => a.title === 'Przypomnienie o treningu z planu')).toHaveLength(1);
});

test('kolejne wywołanie w tym samym uruchomieniu — bez okna', async () => {
  await askReminderPermission(); global.__alerts.length = 0;
  await askReminderPermission();
  expect(global.__alerts).toHaveLength(0);
});
