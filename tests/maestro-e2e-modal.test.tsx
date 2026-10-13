/*
 * Regresja przebiegu E2E 38324474808 (13.10.2026, f017-sklep): scenariusz 21 padł na `tapOn "Back"` po „Restore purchases”. Ekran zakupu otwarty
 * z Ustawień to okno modalne (app/_layout.tsx: presentation 'modal') — bez przycisku „Back”; z Ustawień nie ma też „Not now” (reason=settings).
 * Interpreter pokazywał „Back” na każdym ekranie z historią, więc błąd wyszedł dopiero na symulatorze. Od 13.10.2026 okno modalne zamyka przycisk „Close” z nagłówka (components/CloseButton.tsx), a gest w dół z paska nagłówka działa dodatkowo.
 * Klasa: scenariusz nieaktualny (aplikacja zgodna z projektem — tests/subscription-ui.test.tsx: settings bez „Nie teraz”).
 */
import { join } from 'path';
import { Runner, DIR, load } from './maestro-runner';

jest.setTimeout(240000);
const f = '21-subskrypcja.yaml';
const OLD_BACK = { tapOn: 'Back' };
const CLOSE = { tapOn: { id: 'close-modal' } };
const SWIPE = { swipe: { start: '50%, 10%', end: '50%, 90%', duration: 400 } };
const same = (a: unknown, b: unknown) => JSON.stringify(a) === JSON.stringify(b);

async function runWith(mutate: (c: any[]) => any[]) {
  const { resetStoreAdapterForTests } = require('@/lib/store-adapter'); const { resetEntitlementsForTests } = require('@/lib/entitlement');
  process.env.EXPO_PUBLIC_STORE_FAKE = '1'; resetStoreAdapterForTests(); resetEntitlementsForTests();
  try { const r = new Runner(f); await r.run(mutate(load(join(DIR, f)) as any[]), f); } finally { delete process.env.EXPO_PUBLIC_STORE_FAKE; resetStoreAdapterForTests(); resetEntitlementsForTests(); }
}

describe('okno modalne: ekran zakupu z Ustawień (E2E 38324474808)', () => {
  test('scenariusz 21 zamyka okno przyciskiem „Close” z nagłówka i przechodzi', async () => {
    await runWith(c => { expect(c.some(x => same(x, CLOSE))).toBe(true); return c; });
  });
  test('gest w dół z paska nagłówka nadal zamyka okno (dodatkowy sposób)', async () => {
    await runWith(c => { const i = c.findIndex(x => same(x, CLOSE)); const d = [...c]; d.splice(i - 1, 2, SWIPE); return d; });
  });
  test('„Back” na oknie modalnym nie istnieje — krok z przebiegu pada w tym samym miejscu', async () => {
    await expect(runWith(c => { const i = c.findIndex(x => same(x, CLOSE)); const d = [...c]; d.splice(i - 1, 2, OLD_BACK); return d; })).rejects.toThrow(/Back/);
  });
});
