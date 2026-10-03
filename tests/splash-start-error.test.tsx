/* T-051 (audyt aktualizacji SDK 52 → 57, MEDIUM): błąd otwarcia danych przy starcie nie może zostać pod ekranem powitalnym. */
import * as SplashScreen from 'expo-splash-screen';
import { renderApp, flushAll, screen } from './app';

jest.mock('expo-splash-screen', () => ({ ...jest.requireActual('expo-splash-screen'), hideAsync: jest.fn(async () => true) }));
jest.setTimeout(30000);

test('błąd startu: ekran powitalny schowany, widać komunikat i „Spróbuj ponownie”', async () => {
  const hide = SplashScreen.hideAsync as jest.Mock; hide.mockClear();
  try {
    (global as any).__dbOpenFail = true; await renderApp(); await flushAll(10);
    expect(screen.getByText('Nie udało się otworzyć danych.')).toBeTruthy();
    expect(screen.getByText('Spróbuj ponownie')).toBeTruthy();
    expect(hide).toHaveBeenCalled();
  } finally { (global as any).__dbOpenFail = false; }
});
