/*
 * M1-audytor-generalny-035: brak zgody na powiadomienia był niewidoczny na ekranie treningu (koniec przerwy przy zablokowanym telefonie nie przyjdzie, a nic o tym
 * nie mówiło), a pierwsze pytanie systemowe pojawiało się bez wyjaśnienia. Po naprawie: przy „denied” ekran treningu pokazuje jedną linię z przyciskiem „Otwórz
 * Ustawienia iOS”; przy „jeszcze nie pytano” — krótkie wyjaśnienie przed pytaniem systemu jako karta NA EKRANIE (nie okno modalne: nie blokuje startu treningu ani ~30 scenariuszy E2E
 * na czystej instalacji, gdzie zgoda jest nieustalona) z przyciskami „Dalej” (pytanie systemu) i „Nie teraz” (chowa kartę do końca uruchomienia).
 */
import { Linking } from 'react-native';
import * as store from '@/lib/store';
import * as timer from '@/lib/timer';
import { fresh, ex, saved, pressAlert } from './helpers';
import { renderApp, flushAll, screen, tap, act, go } from './app';

jest.setTimeout(60000);
const G = global as unknown as { __notifPerm?: unknown; __notifPermReq?: unknown; __notifPermAsked?: number; __alerts: { title: string; msg?: string; buttons?: { text: string }[] }[] };
afterEach(async () => { G.__notifPerm = undefined; G.__notifPermReq = undefined; G.__notifPermAsked = 0; await timer.stop(); await timer.stopSet(); });
async function boot(perm: unknown, locale: 'pl' | 'en' = 'pl') {
  await fresh(undefined, locale); G.__notifPerm = perm; G.__notifPermAsked = 0; store.startEmpty(); store.addExerciseToActive(ex('Back Squat')); await act(async () => { await store.flush(); });
  await renderApp({ saved: JSON.parse(JSON.stringify(saved())), locale }); await flushAll(20);
}
const DENIED = { granted: false, canAskAgain: false, status: 'denied' }; const UNDETERMINED = { granted: false, canAskAgain: true, status: 'undetermined' };
const LINE_PL = 'Brak zgody na powiadomienia — przypomnienia i koniec przerwy nie przyjdą. Zgodę włączysz w Ustawieniach iOS.';

describe('zgoda na powiadomienia na ekranie treningu', () => {
  test('odmowa: jedna linia z wyjaśnieniem i przyciskiem „Otwórz Ustawienia iOS” (otwiera ustawienia aplikacji); bez okna z pytaniem', async () => {
    const open = jest.spyOn(Linking, 'openSettings').mockResolvedValue(undefined as never);
    await boot(DENIED); const line = screen.getByTestId('perm-denied-workout'); expect(screen.getAllByText(LINE_PL)).toHaveLength(1); expect(line).toBeTruthy();
    expect(G.__alerts.filter(a => /Powiadomienie na koniec przerwy/.test(a.title))).toEqual([]); expect(G.__notifPermAsked).toBe(0); /* iOS i tak nie zapyta ponownie */
    await tap(screen.getByLabelText('Otwórz Ustawienia iOS')); expect(open).toHaveBeenCalledTimes(1);
  });
  test('zgoda: bez linii i bez okna', async () => {
    await boot({ granted: true }); expect(screen.queryByTestId('perm-denied-workout')).toBeNull(); expect(G.__alerts.filter(a => /przerwy/.test(a.title))).toEqual([]);
  });
  test('jeszcze nie pytano: karta z wyjaśnieniem [Dalej, Nie teraz] zamiast pytania systemu; bez okna modalnego; „Dalej” woła system, odmowa po nim pokazuje linię', async () => {
    await boot(UNDETERMINED); expect(screen.getByTestId('perm-explain-workout')).toBeTruthy();
    expect(screen.getByText('Powiadomienie na koniec przerwy')).toBeTruthy();
    expect(screen.getByText('Na koniec przerwy telefon wyśle powiadomienie — także przy zablokowanym ekranie. Potrzebna jest zgoda na powiadomienia — iOS zapyta o nią po „Dalej”.')).toBeTruthy();
    expect(G.__alerts.filter(a => /przerwy/.test(a.title))).toEqual([]); /* żadnego okna modalnego */ expect(G.__notifPermAsked).toBe(0); /* system jeszcze nie pytał */
    expect(screen.queryByTestId('perm-denied-workout')).toBeNull();
    G.__notifPermReq = DENIED; G.__notifPerm = DENIED; /* użytkownik odmawia w oknie systemowym */ await tap(screen.getByText('Dalej')); await flushAll(10); expect(G.__notifPermAsked).toBe(1);
    expect(screen.queryByTestId('perm-explain-workout')).toBeNull(); expect(screen.getByTestId('perm-denied-workout')).toBeTruthy(); /* po odmowie od razu linia z drogą naprawy */
  });
  test('„Nie teraz”: karta znika, system nie pytany; po wyjściu z ekranu i powrocie w tym samym uruchomieniu — nie wraca', async () => {
    await boot(UNDETERMINED); await tap(screen.getByText('Nie teraz')); await flushAll(10); expect(screen.queryByTestId('perm-explain-workout')).toBeNull(); expect(G.__notifPermAsked).toBe(0);
    await go('/more'); await flushAll(10); await go('/'); await flushAll(20); expect(screen.queryByTestId('perm-explain-workout')).toBeNull(); expect(screen.queryByTestId('perm-denied-workout')).toBeNull();
  });
  test('zgoda: karty wyjaśnienia nie ma', async () => {
    await boot({ granted: true }); expect(screen.queryByTestId('perm-explain-workout')).toBeNull();
  });
  test('English: karta i linia po angielsku', async () => {
    await boot(UNDETERMINED, 'en'); expect(screen.getByText('Notification at the end of rest')).toBeTruthy(); expect(screen.getByText('Continue')).toBeTruthy(); expect(screen.getByText('Not now')).toBeTruthy();
    await boot(DENIED, 'en'); expect(screen.getByText('No notification permission — reminders and end-of-rest alerts will not arrive. You can allow notifications in iOS Settings.')).toBeTruthy(); expect(screen.getByLabelText('Open iOS Settings')).toBeTruthy();
  });
});
