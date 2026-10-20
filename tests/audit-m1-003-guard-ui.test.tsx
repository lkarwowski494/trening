/* M1-audytor-generalny-003: ekran startu po pętli awarii — wysłanie danych, ponowienie, „kamień” strażnika; żadna akcja nie zmienia bazy. Czerwone na 8273448. */
import * as Sharing from 'expo-sharing';
import * as FS from 'expo-file-system/legacy';
import * as store from '@/lib/store';
import { t } from '@/lib/i18n';
import { BOOT_GUARD_KEY, BOOT_STABLE_MS } from '@/lib/state/crashguard';
import { seedState } from './helpers';
import { renderApp, flushAll, screen, tap } from './app';

jest.setTimeout(60000);

const snapshot = () => new Map([...global.__kv].filter(([k]) => k !== BOOT_GUARD_KEY));

describe('M1-003: pętla awarii przy starcie', () => {
  test('drugi start z rzędu bez „kamienia”: ekran awaryjny z wysłaniem danych; „Spróbuj ponownie” otwiera aplikację; po BOOT_STABLE_MS licznik wraca do 0', async () => {
    const state = seedState('pl'); state.settings.defaultRest = 77;
    await renderApp({ saved: state, navTimers: false, kv: { [BOOT_GUARD_KEY]: JSON.stringify({ starts: 1 }) } }); await flushAll(50); /* navTimers: false — zegar testu nie przeskakuje BOOT_STABLE_MS przy nawigacji */
    expect(screen.getByText(t('Aplikacja zamknęła się nieoczekiwanie przy ostatnich uruchomieniach.'))).toBeTruthy();
    expect(screen.getByText(t('Dane w telefonie nie zostały zmienione — możesz je wysłać jako plik.'))).toBeTruthy();
    expect(store.isReadyForTests()).toBe(false); /* dane nie zostały załadowane */
    const kv = snapshot(); (FS.writeAsStringAsync as jest.Mock).mockClear(); (Sharing.shareAsync as jest.Mock).mockClear();
    await tap(screen.getByText(t('Wyślij dane'))); await flushAll(20);
    expect(Sharing.shareAsync).toHaveBeenCalledTimes(1); const written = (FS.writeAsStringAsync as jest.Mock).mock.calls.find(c => /training-data-/.test(String(c[0])));
    expect(JSON.parse(written![1]).state.settings.defaultRest).toBe(77); expect(snapshot()).toEqual(kv);
    await tap(screen.getByText(t('Spróbuj ponownie'))); await flushAll(50);
    expect(store.isReadyForTests()).toBe(true); expect(screen.queryByText(t('Aplikacja zamknęła się nieoczekiwanie przy ostatnich uruchomieniach.'))).toBeNull();
    expect(JSON.parse(global.__kv.get(BOOT_GUARD_KEY)!)).toEqual({ starts: 1 });
    await flushAll(BOOT_STABLE_MS + 100); expect(JSON.parse(global.__kv.get(BOOT_GUARD_KEY)!)).toEqual({ starts: 0 }); /* „kamień”: pierwszy ekran działa */
  });
  test('zwykły start: normalna aplikacja, licznik 1 -> po „kamieniu” 0', async () => {
    await renderApp({ saved: seedState('pl'), navTimers: false }); await flushAll(50);
    expect(store.isReadyForTests()).toBe(true); expect(JSON.parse(global.__kv.get(BOOT_GUARD_KEY)!)).toEqual({ starts: 1 });
    await flushAll(BOOT_STABLE_MS + 100); expect(JSON.parse(global.__kv.get(BOOT_GUARD_KEY)!)).toEqual({ starts: 0 });
  });
});

