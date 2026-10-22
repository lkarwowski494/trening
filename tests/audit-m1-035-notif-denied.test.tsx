/*
 * M1-audytor-generalny-035 (zmiana M3 p2, ZM-02 pkt 4 i wzorzec 30, decyzja STOP 2 z 21.10.2026): brak zgody na powiadomienia był niewidoczny na ekranie treningu (koniec przerwy przy
 * zablokowanym telefonie nie przyjdzie, a nic o tym nie mówiło), a pierwsze pytanie systemowe pojawiało się bez wyjaśnienia. Po M3: wiersz z prośbą pojawia się dopiero przy PIERWSZEJ
 * przerwie, pod tablicą (nie w nagłówku): „Przerwa trwa — powiadomić na koniec?” [Powiadamiaj, Nie teraz] — wyjaśnienie przed pytaniem systemu jako wiersz NA EKRANIE (nie okno modalne:
 * nie blokuje startu treningu ani ~30 scenariuszy E2E na czystej instalacji); po odmowie komunikat z przyciskiem „Otwórz Ustawienia iOS” pojawia się raz, potem zgodę włącza się tylko
 * w Ustawieniach iOS (wcześniej linia była na ekranie zawsze).
 */
import { Linking } from 'react-native';
import * as store from '@/lib/store';
import * as timer from '@/lib/timer';
import { fresh, ex, saved, pressAlert } from './helpers';
import { renderApp, flushAll, screen, tap, act, go } from './app';
import { __resetRestNoticesForTests } from '@/components/ActiveWorkout';

jest.setTimeout(60000);
const G = global as unknown as { __notifPerm?: unknown; __notifPermReq?: unknown; __notifPermAsked?: number; __alerts: { title: string; msg?: string; buttons?: { text: string }[] }[] };
beforeEach(() => { __resetRestNoticesForTests(); });
afterEach(async () => { G.__notifPerm = undefined; G.__notifPermReq = undefined; G.__notifPermAsked = 0; await timer.stop(); await timer.stopSet(); });
async function boot(perm: unknown, locale: 'pl' | 'en' = 'pl') {
  await fresh(undefined, locale); G.__notifPerm = perm; G.__notifPermAsked = 0; store.startEmpty(); store.addExerciseToActive(ex('Back Squat')); Object.assign(store.getState().active!.exercises[0].sets[0], { weight: 100, reps: 5 }); await act(async () => { await store.flush(); });
  await renderApp({ saved: JSON.parse(JSON.stringify(saved())), locale }); await flushAll(20);
}
const DENIED = { granted: false, canAskAgain: false, status: 'denied' }; const UNDETERMINED = { granted: false, canAskAgain: true, status: 'undetermined' };
/** pierwsza przerwa: „Seria zrobiona” na tablicy (z wartościami) startuje przerwę */
const rest = async () => { await tap(screen.getByTestId('focus-done')); await flushAll(20); };
const LINE_PL = 'Brak zgody na powiadomienia — przypomnienia i koniec przerwy nie przyjdą. Zgodę włączysz w Ustawieniach iOS.';

describe('zgoda na powiadomienia na ekranie treningu (przy pierwszej przerwie)', () => {
  test('odmowa: przed przerwą nic; w pierwszej przerwie jedna linia z wyjaśnieniem i przyciskiem „Otwórz Ustawienia iOS” (otwiera ustawienia aplikacji); bez okna z pytaniem', async () => {
    const open = jest.spyOn(Linking, 'openSettings').mockResolvedValue(undefined as never);
    await boot(DENIED); expect(screen.queryByTestId('perm-denied-workout')).toBeNull(); await rest();
    const line = screen.getByTestId('perm-denied-workout'); expect(screen.getAllByText(LINE_PL)).toHaveLength(1); expect(line).toBeTruthy();
    expect(G.__alerts.filter(a => /przerwy/.test(a.title))).toEqual([]); expect(G.__notifPermAsked).toBe(0); /* iOS i tak nie zapyta ponownie */
    await tap(screen.getByLabelText('Otwórz Ustawienia iOS')); expect(open).toHaveBeenCalledTimes(1);
  });
  test('odmowa: komunikat tylko raz — po zakończeniu pierwszej przerwy kolejna jest bez komunikatu (zgodę zmienia się w Ustawieniach)', async () => {
    await boot(DENIED); await rest(); expect(screen.getByTestId('perm-denied-workout')).toBeTruthy();
    await tap(screen.getByText('Pomiń')); await flushAll(10); expect(screen.queryByTestId('perm-denied-workout')).toBeNull();
    store.getState().active!.exercises[0].sets[0].done = false; await act(async () => { store.save(); }); await rest(); expect(timer.T.on).toBe(true); expect(screen.queryByTestId('perm-denied-workout')).toBeNull();
  });
  test('zgoda: bez linii i bez okna', async () => {
    await boot({ granted: true }); await rest(); expect(screen.queryByTestId('perm-denied-workout')).toBeNull(); expect(G.__alerts.filter(a => /przerwy/.test(a.title))).toEqual([]);
  });
  test('jeszcze nie pytano: wiersz [Powiadamiaj, Nie teraz] zamiast pytania systemu — dopiero w przerwie; bez okna modalnego; „Powiadamiaj” woła system, odmowa po nim pokazuje linię', async () => {
    await boot(UNDETERMINED); expect(screen.queryByTestId('perm-explain-workout')).toBeNull(); await rest(); expect(screen.getByTestId('perm-explain-workout')).toBeTruthy();
    expect(screen.getByText('Przerwa trwa — powiadomić na koniec?')).toBeTruthy();
    expect(G.__alerts.filter(a => /przerwy/.test(a.title))).toEqual([]); /* żadnego okna modalnego */ expect(G.__notifPermAsked).toBe(0); /* system jeszcze nie pytał */
    expect(screen.queryByTestId('perm-denied-workout')).toBeNull();
    G.__notifPermReq = DENIED; G.__notifPerm = DENIED; /* użytkownik odmawia w oknie systemowym */ await tap(screen.getByText('Powiadamiaj')); await flushAll(10); expect(G.__notifPermAsked).toBe(1);
    expect(screen.queryByTestId('perm-explain-workout')).toBeNull(); expect(screen.getByTestId('perm-denied-workout')).toBeTruthy(); /* po odmowie od razu linia z drogą naprawy */
  });
  test('„Nie teraz”: wiersz znika, system nie pytany; po wyjściu z ekranu i powrocie w tym samym uruchomieniu — nie wraca', async () => {
    await boot(UNDETERMINED); await rest(); await tap(screen.getByText('Nie teraz')); await flushAll(10); expect(screen.queryByTestId('perm-explain-workout')).toBeNull(); expect(G.__notifPermAsked).toBe(0);
    await go('/more'); await flushAll(10); await go('/'); await flushAll(20); expect(screen.queryByTestId('perm-explain-workout')).toBeNull(); expect(screen.queryByTestId('perm-denied-workout')).toBeNull();
  });
  test('zgoda: wiersza wyjaśnienia nie ma', async () => {
    await boot({ granted: true }); await rest(); expect(screen.queryByTestId('perm-explain-workout')).toBeNull();
  });
  test('English: wiersz i linia po angielsku', async () => {
    await boot(UNDETERMINED, 'en'); await rest(); expect(screen.getByText('Resting — notify you when it ends?')).toBeTruthy(); expect(screen.getByText('Notify me')).toBeTruthy(); expect(screen.getByText('Not now')).toBeTruthy();
    await boot(DENIED, 'en'); await rest(); expect(screen.getByText('No notification permission — reminders and end-of-rest alerts will not arrive. You can allow notifications in iOS Settings.')).toBeTruthy(); expect(screen.getByLabelText('Open iOS Settings')).toBeTruthy();
  });
});
