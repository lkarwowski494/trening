/*
 * M1-audytor-generalny-042 (regresja od M1-013, reaudyt 28.10.2026; 12-niezawodnosc-601): po wyjątku migracji ekran błędu startu nie zerował licznika
 * strażnika startu, więc następny zimny start trafiał w tryb awaryjny pętli awarii z komunikatem „Aplikacja zamknęła się nieoczekiwanie…”, choć aplikacja
 * się nie zamknęła — użytkownik widział na zmianę dwa różne opisy tej samej przyczyny.
 * Test: start z wyjątkiem migracji → licznik startów 0 (obsłużony błąd, nie awaria); drugi zimny start na tych samych danych → znowu ekran błędu migracji,
 * bez komunikatu pętli awarii; „state” bez zmian w obu startach (dane: kv przed i po).
 */
import { t } from '@/lib/i18n';
import { seedState } from './helpers';
import { renderApp, flushAll, screen } from './app';

jest.setTimeout(60000);
const spies: jest.SpyInstance[] = [];
afterEach(() => { spies.splice(0).forEach((s) => s.mockRestore()); });
const LOOP = 'Aplikacja zamknęła się nieoczekiwanie przy ostatnich uruchomieniach.';

describe('M1-042: drugi start po wyjątku migracji — bez komunikatu pętli awarii', () => {
  test('dwa zimne starty z wyjątkiem migracji: za każdym razem ekran błędu migracji, licznik 0, „state” bez zmian', async () => {
    const state = seedState('pl'); state.settings.defaultRest = 77;
    spies.push(jest.spyOn(require('@/lib/state/migrate'), 'migrate').mockImplementation(() => { throw new Error('boom-migracja'); }));
    await renderApp({ saved: state }); await flushAll(50);
    expect(screen.getByText('Nie udało się otworzyć danych.')).toBeTruthy(); expect(screen.getByText('boom-migracja')).toBeTruthy();
    const kv = Object.fromEntries(global.__kv.entries()) as Record<string, string>;
    const firstStarts = JSON.parse(kv.bootguard).starts; /* lib/state/crashguard.ts BOOT_GUARD_KEY */
    const stateBefore = kv.state;
    await renderApp({ kv }); await flushAll(50); /* drugi zimny start: te same dane w bazie */
    expect(screen.queryByText(t(LOOP))).toBeNull();
    expect(screen.getByText('Nie udało się otworzyć danych.')).toBeTruthy(); expect(screen.getByText('boom-migracja')).toBeTruthy();
    expect(global.__kv.get('state')).toBe(stateBefore);
    expect(firstStarts).toBe(0);
  });
});
