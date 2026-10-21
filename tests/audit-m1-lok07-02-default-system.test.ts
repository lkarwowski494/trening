/*
 * M2-LOK07-02 (DEC-29, 20.10.2026): domyślny system miar nowej instalacji z regionu telefonu (expo-localization `measurementSystem`):
 * 'us' i 'uk' → imperialny (unit 'lb'), 'metric' → metryczny ('kg'); brak danych → metryczny (region z tagu języka jako zapas, jak dotąd: en-US → lb).
 * Istniejący użytkownicy bez zmian: start z zapisanych danych nie dotyka ustawienia. Reset wszystkiego = jak świeża instalacja.
 */
import * as store from '@/lib/store';
import { deviceUnit } from '@/lib/i18n';
import { fresh } from './helpers';
import { act } from '@testing-library/react-native';

type Loc = { languageCode: string; languageTag: string; measurementSystem?: string | null };
const G = global as unknown as { __locales: Loc[]; __kv: Map<string, string> };
const boot = async (loc: Loc) => { G.__kv.clear(); G.__locales = [loc]; store.__resetForTests(); await store.init(); return store.getState().settings.unit; };

describe('domyślny system miar świeżej instalacji (measurementSystem)', () => {
  test.each([
    ['us', 'en-GB', 'lb'], ['uk', 'en-GB', 'lb'], ['metric', 'en-US', 'kg'], ['metric', 'pl-PL', 'kg'], ['us', 'pl-PL', 'lb'],
  ] as const)('measurementSystem %s przy tagu %s → %s (system wygrywa z regionem tagu)', async (ms, tag, want) => {
    expect(await boot({ languageCode: tag.slice(0, 2), languageTag: tag, measurementSystem: ms })).toBe(want);
  });
  test.each([[null], [undefined]] as const)('brak measurementSystem (%s) i tag bez regionu → metryczny; tag en-US jako zapas → imperialny (jak dotąd)', async ms => {
    expect(await boot({ languageCode: 'pl', languageTag: 'pl-PL', measurementSystem: ms })).toBe('kg');
    expect(await boot({ languageCode: 'en', languageTag: 'en', measurementSystem: ms })).toBe('kg');
    expect(await boot({ languageCode: 'en', languageTag: 'en-US', measurementSystem: ms })).toBe('lb');
  });
  test('deviceUnit z jawnym tagiem działa jak dotąd (region)', () => { expect(deviceUnit('en-US')).toBe('lb'); expect(deviceUnit('pl-PL')).toBe('kg'); });
  test('istniejący użytkownik: zapisane unit kg zostaje, choć telefon jest w regionie imperialnym; zapisane lb zostaje w metrycznym', async () => {
    const s = await fresh(); const raw = JSON.parse(JSON.stringify(s)); raw.settings.unit = 'kg';
    G.__locales = [{ languageCode: 'en', languageTag: 'en-US', measurementSystem: 'us' }]; G.__kv.clear(); G.__kv.set('state', JSON.stringify(raw)); store.__resetForTests(); await store.init();
    expect(store.getState().settings.unit).toBe('kg');
    raw.settings.unit = 'lb'; G.__locales = [{ languageCode: 'pl', languageTag: 'pl-PL', measurementSystem: 'metric' }]; G.__kv.clear(); G.__kv.set('state', JSON.stringify(raw)); store.__resetForTests(); await store.init();
    expect(store.getState().settings.unit).toBe('lb');
  });
  test('reset wszystkiego: system miar z regionu telefonu jak przy świeżej instalacji', async () => {
    await boot({ languageCode: 'pl', languageTag: 'pl-PL', measurementSystem: 'metric' });
    G.__locales = [{ languageCode: 'pl', languageTag: 'pl-PL', measurementSystem: 'us' }];
    await act(async () => { store.resetAll(); }); expect(store.getState().settings.unit).toBe('lb');
  });
});
