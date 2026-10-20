/* M1-audytor-generalny-003: wyjątek w pierwszym ekranie nie zamyka aplikacji — ekran zastępczy z eksportem danych (granica błędu). Czerwone na 8273448. */
import * as Sharing from 'expo-sharing';
import * as FS from 'expo-file-system/legacy';
import { t } from '@/lib/i18n';
import { seedState } from './helpers';
import { renderApp, flushAll, screen, tap } from './app';

jest.mock('@/components/TodayPlan', () => ({ TodayPlan: () => { throw new Error('boom-first-screen'); } }));
jest.setTimeout(60000);

test('wyjątek przy rysowaniu pierwszego ekranu: ekran zastępczy z „Wyślij dane” i „Spróbuj ponownie”; wysłanie niesie dane z bazy', async () => {
  const spy = jest.spyOn(console, 'error').mockImplementation(() => {});
  try {
    const state = seedState('pl'); state.settings.defaultRest = 77;
    await renderApp({ saved: state }); await flushAll(50);
    expect(screen.getByText(t('Ekran nie mógł się wyświetlić.'))).toBeTruthy();
    expect(screen.getByText(t('Dane w telefonie nie zostały zmienione — możesz je wysłać jako plik.'))).toBeTruthy();
    expect(screen.getByText(t('Spróbuj ponownie'))).toBeTruthy();
    const kv = new Map(global.__kv);
    (FS.writeAsStringAsync as jest.Mock).mockClear(); (Sharing.shareAsync as jest.Mock).mockClear();
    await tap(screen.getByText(t('Wyślij dane'))); await flushAll(20);
    expect(Sharing.shareAsync).toHaveBeenCalledTimes(1);
    const written = (FS.writeAsStringAsync as jest.Mock).mock.calls.find(c => /training-data-/.test(String(c[0])));
    expect(written).toBeTruthy(); const env = JSON.parse(written![1]); expect(env.format).toBe('trening-recovery'); expect(env.state.settings.defaultRest).toBe(77);
    expect(new Map(global.__kv)).toEqual(kv); /* żadna akcja nie zmienia bazy */
  } finally { spy.mockRestore(); }
});
