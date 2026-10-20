/*
 * M1-audytor-generalny-064 (DEC-18): wybór języka w aplikacji nie obejmuje zgody Zdrowia ani nazwy pod ikoną (to robi iOS z ustawienia „Język” aplikacji w Ustawieniach iOS).
 * Ekran Język ma wiersz „Zmień w ustawieniach iOS” (z jednym zdaniem wyjaśnienia), który otwiera ustawienia aplikacji; wybór w aplikacji zostaje bez zmian.
 */
import { Linking } from 'react-native';
import { LANGS, tIn } from '@/lib/i18n';
import { fresh } from './helpers';
import { renderApp, flushAll, screen, tap } from './app';

jest.setTimeout(60000);
afterEach(() => { jest.restoreAllMocks(); });
const NOTE = 'Nazwa pod ikoną i opis zgody Zdrowia zmienią język dopiero po ustawieniu języka aplikacji w Ustawieniach iOS.';
describe('ekran Język: „Zmień w ustawieniach iOS”', () => {
  test.each([['pl', 'Zmień w ustawieniach iOS'], ['en', 'Change in iOS Settings'], ['de', 'In den iOS-Einstellungen ändern']] as const)('%s: wiersz „%s” z wyjaśnieniem otwiera ustawienia aplikacji (Linking.openSettings); lista języków bez zmian', async (l, title) => {
    const open = jest.spyOn(Linking, 'openSettings').mockResolvedValue(undefined as never); open.mockClear(); /* Linking.openSettings to jest.fn z presetu — licznik trzeba zerować */
    await fresh(undefined, l === 'de' ? 'pl' : l); await renderApp({ url: '/more/language', locale: l as never, saved: l === 'de' ? (() => { const st = require('@/lib/store').getState(); st.settings.language = 'de'; return JSON.parse(JSON.stringify(st)); })() : undefined }); await flushAll(20);
    const row = screen.getByLabelText(new RegExp(`^${title}`)); expect(row.props.accessibilityRole).toBe('button'); expect(screen.getByText(tIn(l, NOTE))).toBeTruthy();
    expect(screen.getAllByRole('button').length).toBeGreaterThanOrEqual(LANGS.length + 1); /* 35 języków + „Jak w telefonie” + wiersz iOS */
    expect(open).not.toHaveBeenCalled(); await tap(row); expect(open).toHaveBeenCalledTimes(1);
  });
  test('wybór języka w aplikacji nadal działa (English) i wiersz iOS jest też po zmianie', async () => {
    jest.spyOn(Linking, 'openSettings').mockResolvedValue(undefined as never); await fresh(); await renderApp({ url: '/more/language' }); await flushAll(20);
    await tap(screen.getByText('English')); await flushAll(10); expect(require('@/lib/store').getState().settings.language).toBe('en');
  });
});
