/*
 * M1-audytor-generalny-035: brak zgody na powiadomienia był niewidoczny na ekranie treningu (koniec przerwy przy zablokowanym telefonie nie przyjdzie, a nic o tym
 * nie mówiło), a pierwsze pytanie systemowe pojawiało się bez wyjaśnienia. Po naprawie: przy „denied” ekran treningu pokazuje jedną linię z przyciskiem „Otwórz
 * Ustawienia iOS”; przy „jeszcze nie pytano” — krótkie wyjaśnienie (jak przypomnienie z planu) przed pytaniem systemu, raz na uruchomienie.
 */
import { Linking } from 'react-native';
import * as store from '@/lib/store';
import * as timer from '@/lib/timer';
import { fresh, ex, saved, pressAlert } from './helpers';
import { renderApp, flushAll, screen, tap, act, go } from './app';

jest.setTimeout(60000);
const G = global as unknown as { __notifPerm?: unknown; __notifPermAsked?: number; __alerts: { title: string; msg?: string; buttons?: { text: string }[] }[] };
afterEach(async () => { G.__notifPerm = undefined; G.__notifPermAsked = 0; await timer.stop(); await timer.stopSet(); });
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
  test('jeszcze nie pytano: najpierw krótkie wyjaśnienie [Nie teraz, Dalej]; „Nie teraz” nie woła systemu, „Dalej” tak; raz na uruchomienie', async () => {
    await boot(UNDETERMINED); const a = G.__alerts.find(x => x.title === 'Powiadomienie na koniec przerwy'); expect(a).toBeTruthy();
    expect(a!.msg).toBe('Na koniec przerwy telefon wyśle powiadomienie — także przy zablokowanym ekranie. Potrzebna jest zgoda na powiadomienia — iOS zapyta o nią po „Dalej”.');
    expect(a!.buttons!.map(b => b.text)).toEqual(['Nie teraz', 'Dalej']); expect(G.__notifPermAsked).toBe(0); /* system jeszcze nie pytał */
    pressAlert('Powiadomienie na koniec przerwy', 'Dalej'); await flushAll(10); expect(G.__notifPermAsked).toBe(1);
  });
  test('„Nie teraz” — bez pytania systemu, bez drugiego okna przy ponownym wejściu na ekran treningu w tym samym uruchomieniu', async () => {
    await boot(UNDETERMINED); pressAlert('Powiadomienie na koniec przerwy', 'Nie teraz'); await flushAll(10); expect(G.__notifPermAsked).toBe(0);
    const n = G.__alerts.filter(x => x.title === 'Powiadomienie na koniec przerwy').length;
    await go('/more'); await flushAll(10); await go('/'); await flushAll(20); expect(G.__alerts.filter(x => x.title === 'Powiadomienie na koniec przerwy').length).toBe(n); /* ten sam przebieg aplikacji — bez drugiego okna */
  });
  test('English: linia i okno po angielsku', async () => {
    await boot(DENIED, 'en'); expect(screen.getByText('No notification permission — reminders and end-of-rest alerts will not arrive. You can allow notifications in iOS Settings.')).toBeTruthy(); expect(screen.getByLabelText('Open iOS Settings')).toBeTruthy();
  });
});
