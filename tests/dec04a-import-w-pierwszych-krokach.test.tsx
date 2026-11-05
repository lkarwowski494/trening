/*
 * DEC-04 a (właściciel 23.10.2026; wdrożenie 1.0.1, docs/21 „Backlog 1.0.1 — decyzje DEC-01 a i DEC-04 a”): w „Pierwszych krokach” czwarty, pomijalny krok
 * „Masz historię w innej aplikacji?” z przyciskiem „Importuj historię z pliku CSV” — tylko wejście do istniejącego importu (/more/import), bez zmian w samym imporcie.
 * Od 05.11.2026 (docs/18, ekran nowej osoby 1.1) wejście to kafelek „Historia z CSV” (testID first-steps-import) w „Przygotuj się do pierwszej serii”: ten sam cel, ten sam opis, bez numeru i statusu „do zrobienia”.
 * Realność: realny (nowa osoba przychodzi z innego dziennika). Kroki: pierwsze uruchomienie → ekran Trening → karta „Pierwsze kroki” → krok 4 → przycisk → ekran importu.
 * Wzorzec docs/32 nr 18 (przycisk drugorzędny jak w krokach 1–3), nr 17 (przejście na inny ekran), nr 23 (etykieta/rola).
 */
import { StyleSheet } from 'react-native';
import { within } from '@testing-library/react-native';
import * as store from '@/lib/store';
import { applyLang } from '@/lib/i18n';
import { fresh, saved, withDemoTemplates } from './helpers';
import { renderApp, flushAll, screen, tap, act } from './app';

jest.setTimeout(60000);
const NOW = new Date(2026, 9, 8, 9, 0);
afterEach(() => { applyLang('pl'); });
const boot = async (fn: () => void = () => {}, locale: 'pl' | 'en' = 'pl') => {
  jest.useFakeTimers({ now: NOW }); await fresh(undefined, locale); fn();
  await act(async () => { await store.flush(); }); await renderApp({ saved: JSON.parse(JSON.stringify(saved())), locale, url: '/' }); jest.setSystemTime(NOW.getTime()); await flushAll(10);
};
const box = () => within(screen.getByTestId('first-steps'));
const flat = (el: { props: { style?: unknown } }) => StyleSheet.flatten((typeof el.props.style === 'function' ? (el.props.style as (s: { pressed: boolean }) => unknown)({ pressed: false }) : el.props.style) as never) as Record<string, unknown>;
const STEP4 = 'Masz historię w innej aplikacji? Możesz ją dopisać z pliku CSV.';

describe('DEC-04 a: krok „zaimportuj historię” w Pierwszych krokach', () => {
  test('nowa osoba: kafelek „Historia z CSV” jest na ekranie, jeden, z opisem; etykieta VoiceOver „tytuł. opis” bez numeru i stanu', async () => {
    await boot();
    expect(screen.getByLabelText(`Historia z CSV. ${STEP4}`)).toBeTruthy(); expect(screen.queryByLabelText(/^4\. /)).toBeNull();
    expect(box().getByText(STEP4)).toBeTruthy(); expect(box().getAllByText('Historia z CSV')).toHaveLength(1);
    expect(box().getAllByRole('button', { name: `Historia z CSV. ${STEP4}` })).toHaveLength(1);
  });
  test('kafelek prowadzi do istniejącego ekranu importu CSV (bez zmian w imporcie)', async () => {
    await boot();
    await tap(screen.getByTestId('first-steps-import')); await flushAll(10);
    expect(screen.getByText('Wybierz plik CSV')).toBeTruthy();
    expect(screen.getByText('Dopisuje treningi z CSV. Obecnych danych nie zmienia. Przed zapisem — podgląd.')).toBeTruthy();
  });
  test('kafelek jest też przy gotowym szablonie (pomijalny); tego samego rodzaju co „Przewodnik”', async () => {
    await boot(() => { withDemoTemplates(); });
    expect(screen.getByLabelText(`Historia z CSV. ${STEP4}`)).toBeTruthy();
    const imp = flat(screen.getByTestId('first-steps-import')); const ref = flat(screen.getByTestId('first-tile-guide'));
    expect([imp.backgroundColor, imp.borderColor, imp.borderRadius]).toEqual([ref.backgroundColor, ref.borderColor, ref.borderRadius]);
  });
  test('EN: tekst i kafelek po angielsku', async () => {
    await boot(() => {}, 'en');
    expect(box().getByText('Already logging workouts in another app? You can add your history from a CSV file.')).toBeTruthy();
    expect(box().getByRole('button', { name: 'History from CSV. Already logging workouts in another app? You can add your history from a CSV file.' })).toBeTruthy();
  });
});
