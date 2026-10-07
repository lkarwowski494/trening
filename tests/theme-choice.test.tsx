/* Decyzja właściciela 05.10.2026 (po instalacji, zrzut „Nie ma wyglądu kredy” — telefon w trybie ciemnym):
 * „Wybór motywu, domyślnie jasna Kreda” (od 07.10.2026 styl „Tuleja” — domyślnie nadal jasny) — Ustawienia → Wygląd: Jasny (domyślnie) / Ciemny / Jak w telefonie. */
import { Appearance } from 'react-native';
import { renderApp, flushAll, screen, go, tap } from './app';
import * as store from '@/lib/store';
import { defaultSettings } from '@/lib/seed';

jest.setTimeout(60000);
const set = jest.spyOn(Appearance, 'setColorScheme');
beforeEach(() => set.mockClear());

test('domyślnie jasna Kreda — także dla danych sprzed tego ustawienia (wymusza jasny wygląd mimo trybu ciemnego telefonu)', async () => {
  expect(defaultSettings().theme).toBe('light');
  await renderApp({ saved: { settings: { language: 'pl' } } }); await flushAll(10);
  expect(store.getState().settings.theme).toBe('light');
  expect(set).toHaveBeenLastCalledWith('light');
});

test('Ustawienia → Wygląd: Ciemny i Jak w telefonie; wybór zapisany i stosowany', async () => {
  await renderApp(); await go('/more/settings'); await flushAll(10);
  expect(screen.getByText('Wygląd')).toBeTruthy();
  await tap(screen.getByLabelText('Ciemny')); expect(store.getState().settings.theme).toBe('dark'); expect(set).toHaveBeenLastCalledWith('dark');
  await tap(screen.getByLabelText('Jak w telefonie')); expect(store.getState().settings.theme).toBe('auto'); expect(set).toHaveBeenLastCalledWith('unspecified');
  await tap(screen.getByLabelText('Jasny')); expect(store.getState().settings.theme).toBe('light');
});

test('nieznana wartość w danych → jasny', async () => {
  await renderApp({ saved: { settings: { theme: 'neon' } } }); await flushAll(10);
  expect(store.getState().settings.theme).toBe('light');
});
