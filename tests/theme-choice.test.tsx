/* Decyzja właściciela 05.10.2026 (po instalacji, zrzut „Nie ma wyglądu kredy” — telefon w trybie ciemnym):
 * „Wybór motywu, domyślnie jasna Kreda” (od 07.10.2026 styl „Tuleja” — domyślnie nadal jasny) — Ustawienia → Wygląd: Jasny (domyślnie) / Ciemny / Jak w telefonie. */
import { Appearance } from 'react-native';
import { renderApp, flushAll, screen, go, tap } from './app';
import * as store from '@/lib/store';
import { defaultSettings } from '@/lib/seed';

import { seedState } from '@/lib/seed';
jest.setTimeout(60000);
const set = jest.spyOn(Appearance, 'setColorScheme');
beforeEach(() => set.mockClear());

test('domyślnie ciemny (zmiana 23.10.2026, test na telefonie 1030; wcześniej jasna Kreda) — także dla danych bez tego ustawienia; wymusza wygląd mimo trybu telefonu', async () => {
  expect(defaultSettings().theme).toBe('dark');
  await renderApp({ saved: { settings: { language: 'pl' } } }); await flushAll(10);
  expect(store.getState().settings.theme).toBe('dark');
  expect(set).toHaveBeenLastCalledWith('dark');
});

test('Ustawienia → Wygląd: Ciemny i Jak w telefonie; wybór zapisany i stosowany', async () => {
  await renderApp(); await go('/more/settings'); await flushAll(10);
  expect(screen.getByText('Wygląd')).toBeTruthy();
  await tap(screen.getByLabelText('Ciemny')); expect(store.getState().settings.theme).toBe('dark'); expect(set).toHaveBeenLastCalledWith('dark');
  await tap(screen.getByLabelText('Jak w telefonie')); expect(store.getState().settings.theme).toBe('auto'); expect(set).toHaveBeenLastCalledWith('unspecified');
  await tap(screen.getByLabelText('Jasny')); expect(store.getState().settings.theme).toBe('light');
});

test('nieznana wartość w danych → jasny', async () => {
  const base = seedState('pl'); await renderApp({ saved: { ...base, settings: { ...base.settings, theme: 'neon' } } }); /* pełny zapis (częściowy odrzuca wczytanie → nowa instalacja → ciemny) */ await flushAll(10);
  expect(store.getState().settings.theme).toBe('light');
});
