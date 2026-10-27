/*
 * M1-audytor-generalny-013 (audyt 1.0, 27.10.2026; 12-niezawodnosc-001): wyjątek w migracji (błąd kodu na CZYTELNYCH danych) przy starcie nie może dawać
 * pustej aplikacji — tryb awaryjny (ekran błędu startu: „Wyślij dane”, „Spróbuj ponownie”, „Napisz do nas”), „state” bajt w bajt bez zmian, bez odkładania
 * pod state_corrupt_* i bez zapisu czystego stanu. Nieczytelny JSON — jak dotąd (odłożenie i pusty start z komunikatem).
 * Rodzaje (docs/20): dane (kv przed i po), scenariusz (start aplikacji), regresja.
 */
import * as Sharing from 'expo-sharing';
import * as FS from 'expo-file-system/legacy';
import { t } from '@/lib/i18n';
import { seedState } from './helpers';
import { renderApp, flushAll, screen, tap } from './app';

jest.setTimeout(60000);
const spies: jest.SpyInstance[] = [];
afterEach(() => { spies.splice(0).forEach(s => s.mockRestore()); });
const corruptKeys = () => [...global.__kv.keys()].filter(k => k.startsWith('state_corrupt_'));

describe('M1-013: wyjątek migracji przy starcie → tryb awaryjny, dane nietknięte', () => {
  test('migrate rzuca na czytelnych danych: ekran błędu startu, „state” bez zmian, brak state_corrupt_*, „Wyślij dane” daje dane z bazy', async () => {
    const state = seedState('pl'); state.settings.defaultRest = 77;
    spies.push(jest.spyOn(require('@/lib/state/migrate'), 'migrate').mockImplementation(() => { throw new Error('boom-migracja'); }));
    await renderApp({ saved: state }); await flushAll(50);
    expect(screen.getByText('Nie udało się otworzyć danych.')).toBeTruthy(); expect(screen.getByText('boom-migracja')).toBeTruthy();
    expect(corruptKeys()).toEqual([]); expect(global.__kv.has('recovery')).toBe(false);
    expect(JSON.parse(global.__kv.get('state')!).settings.defaultRest).toBe(77);
    const before = global.__kv.get('state'); (FS.writeAsStringAsync as jest.Mock).mockClear(); (Sharing.shareAsync as jest.Mock).mockClear();
    await tap(screen.getByText(t('Wyślij dane'))); await flushAll(20);
    const written = (FS.writeAsStringAsync as jest.Mock).mock.calls.find(c => /training-data-/.test(String(c[0])));
    expect(JSON.parse(written![1]).state.settings.defaultRest).toBe(77); expect(global.__kv.get('state')).toBe(before);
  });
  test('nieczytelny JSON: jak dotąd — odłożenie pod state_corrupt_* i start z komunikatem (bez ekranu błędu startu)', async () => {
    await renderApp({ saved: '{nie-json' as unknown }); await flushAll(50);
    expect(screen.queryByText('Nie udało się otworzyć danych.')).toBeNull(); expect(corruptKeys().length).toBe(1);
  });
  test('zły kształt zapisu (poprawny JSON, migrate: „bad state”) — jak nieczytelny: odłożenie, bez ekranu błędu startu', async () => {
    const st = seedState('pl') as any; st.exercises = { broken: true };
    await renderApp({ saved: st }); await flushAll(50);
    expect(screen.queryByText('Nie udało się otworzyć danych.')).toBeNull(); expect(corruptKeys().length).toBe(1);
  });
});
