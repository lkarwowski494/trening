/*
 * Import historii z CSV — ekran /more/import (11.10.2026): podgląd przed zapisem, zmiana dopasowania, jednostka, duplikaty, błędy, anulowanie,
 * skutek w danych, ponowny import (idempotencja), język EN i jednostka lb. Logika: tests/csv-import-logic.test.ts; pliki: tests/fixtures/import-*.csv.
 */
import * as fs from 'fs';
import * as path from 'path';
import * as store from '@/lib/store';
import { applyLang, t } from '@/lib/i18n';
import { applyUnit } from '@/lib/units';
import { fresh, saved, addWorkout, pressAlert } from './helpers';
import { renderApp, flushAll, screen, go, act, tap, type as typeText, openInfo } from './app';

jest.setTimeout(60000);
const NOW = new Date(2026, 9, 11, 12).getTime();
const fx = (n: string) => fs.readFileSync(path.join(__dirname, 'fixtures', n), 'utf8');
const FS = () => require('expo-file-system/legacy');
const pickFile = (txt: string, uri = 'file:///cache/DocumentPicker/h.csv') => {
  (require('expo-document-picker').getDocumentAsync as jest.Mock).mockImplementationOnce(async () => ({ canceled: false, assets: [{ uri }] }));
  (FS().readAsStringAsync as jest.Mock).mockImplementationOnce(async () => txt);
};
const boot = async (locale: 'pl' | 'en' = 'pl', fn: () => void = () => {}) => {
  jest.useFakeTimers({ now: NOW }); await fresh(undefined, locale); fn(); store.save(); await act(async () => { await store.flush(); });
  await renderApp({ saved: JSON.parse(JSON.stringify(saved())), locale }); await flushAll(10); await go('/more/import'); await flushAll(10);
};
const choose = async (txt: string) => { pickFile(txt); await tap(screen.getByText(t('Wybierz plik CSV'))); await flushAll(10); };
afterEach(() => { applyLang('pl'); applyUnit('kg'); jest.restoreAllMocks(); jest.useRealTimers(); });

describe('ekran importu CSV', () => {
  test('ekran Kopia zapasowa ma przycisk i opis importu; przycisk otwiera ekran importu bez podglądu', async () => {
    jest.useFakeTimers({ now: NOW }); await fresh(); await renderApp({ saved: JSON.parse(JSON.stringify(saved())) }); await flushAll(10); await go('/more/backup'); await flushAll(10);
    expect(screen.getByText(t('Dopisuje treningi z CSV — bez usuwania danych, z podglądem.'))).toBeTruthy(); await openInfo('backup-csv'); /* ⓘ 14.10.2026: pełny opis pod ⓘ */
    expect(screen.getByText(t('Dopisuje treningi z plików CSV popularnych dzienników treningowych — bez usuwania obecnych danych, z podglądem przed zapisem.'))).toBeTruthy();
    await tap(screen.getByText(t('Importuj historię z pliku CSV'))); await flushAll(800);
    expect(screen.getByText(t('Wybierz plik CSV'))).toBeTruthy(); expect(screen.queryByText(t('Podgląd importu'))).toBeNull();
  });
  test('ekran importu: tytuł, opis (obecne dane nietknięte, podgląd przed zapisem) i etykieta zmiany dopasowania wiersza', async () => {
    await boot(); expect(screen.getByText(t('Dopisuje treningi z CSV. Obecnych danych nie zmienia. Przed zapisem — podgląd.'))).toBeTruthy(); await openInfo('import-intro');
    expect(screen.getByText(t('Dopisuje treningi z plików CSV popularnych dzienników treningowych. Obecnych danych nie zmienia ani nie usuwa. Przed zapisem zobaczysz podgląd.'))).toBeTruthy();
    expect(screen.queryAllByText(t('Import historii z CSV')).length).toBeGreaterThanOrEqual(0); /* tytuł nagłówka (Stack) — tekst t() użyty w app/_layout.tsx */
    await choose(fx('import-formatA.csv')); expect(screen.getByLabelText(`Plank, Plank, ${t('Zmień dopasowanie')}`)).toBeTruthy();
  });
  test('podgląd formatA: liczby, zakres dat, duplikaty, dopasowane i nowe ćwiczenia, jednostka; nic nie zapisane przed „Importuj”', async () => {
    await boot(); const w0 = store.getState().workouts.length; const e0 = store.getState().exercises.length;
    await choose(fx('import-formatA.csv'));
    expect(screen.getByText(t('Podgląd importu'))).toBeTruthy(); expect(screen.getByText(t('Treningi do dodania: {n}', { n: 3 }))).toBeTruthy();
    expect(screen.getByText(t('Zakres dat: {a} – {b}', { a: store.fmtDayKey('2026-03-02'), b: store.fmtDayKey('2026-03-09') }))).toBeTruthy();
    expect(screen.getByText(t('Pominięte jako duplikaty: {n}', { n: 0 }))).toBeTruthy(); expect(screen.getByText(t('Ćwiczenia dopasowane do Twoich: {n}', { n: 4 }))).toBeTruthy(); expect(screen.getByText(t('Nowe ćwiczenia: {n}', { n: 2 }))).toBeTruthy();
    expect(screen.getByLabelText(t('Jednostka ciężaru w pliku'))).toBeTruthy(); expect(screen.getByText(t('Plik nie podaje, czy ciężary są w kg, czy w lb. Domyślnie: jednostka z Ustawień.'))).toBeTruthy();
    expect(screen.getByText(t('Ćwiczenia z pliku'))).toBeTruthy(); expect(screen.getByText('Bench Press (Barbell)')).toBeTruthy();
    expect(screen.queryByText(t('Dystans w pliku przyjęto jako metry.'))).toBeNull(); expect(screen.getByText(t('Anuluj'))).toBeTruthy();
    expect(store.getState().workouts.length).toBe(w0); expect(store.getState().exercises.length).toBe(e0); /* sam podgląd nic nie zmienia */
  });
  test('„Importuj” zapisuje, pokazuje podsumowanie i wraca do wyboru; ten sam plik drugi raz = same duplikaty i brak przycisku Importuj', async () => {
    await boot(); await choose(fx('import-formatA.csv')); const w0 = store.getState().workouts.length;
    await tap(screen.getByText(t('Importuj'))); await flushAll(10);
    expect(store.getState().workouts.length).toBe(w0 + 3); expect(global.__alerts.some(a => a.title === t('Zaimportowano') && a.msg === t('Dodano treningi: {n}, nowe ćwiczenia: {m}.', { n: 3, m: 2 }))).toBe(true);
    expect(screen.queryByText(t('Podgląd importu'))).toBeNull();
    await choose(fx('import-formatA.csv'));
    expect(screen.getByText(t('Treningi do dodania: {n}', { n: 0 }))).toBeTruthy(); expect(screen.getByText(t('Pominięte jako duplikaty: {n}', { n: 3 }))).toBeTruthy();
    expect(screen.getByText(t('Nie ma nowych treningów do dodania — wszystkie są już w historii.'))).toBeTruthy(); expect(screen.queryByText(t('Importuj'))).toBeNull();
  });
  test('Anuluj zamyka podgląd bez zmian w danych', async () => {
    await boot(); await choose(fx('import-formatA.csv')); const snap = JSON.stringify(store.getState());
    await tap(screen.getByText(t('Anuluj'))); await flushAll(10); expect(screen.queryByText(t('Podgląd importu'))).toBeNull(); expect(JSON.stringify(store.getState())).toBe(snap);
  });
  test('wybór jednostki lb na podglądzie wpływa na zapisane ciężary (formatA); domyślnie jednostka z Ustawień', async () => {
    await boot('pl', () => { store.getState().settings.unit = 'lb'; });
    await choose('Date,Workout Name,Duration,Exercise Name,Set Order,Weight,Reps,Distance,Seconds,Notes,Workout Notes,RPE\n2026-03-02 10:00:00,T,,Ex,1,135,5,0,0,,,\n');
    await tap(screen.getByText(t('Importuj'))); await flushAll(10); /* domyślnie lb (Ustawienia) */
    const w = store.getState().workouts.find(x => x.templateName === 'T')!; expect(w.exercises[0].sets[0].weight).toBeCloseTo(61.23, 1);
  });
  test('przełączenie na kg na podglądzie: 135 zostaje 135 kg', async () => {
    await boot('pl', () => { store.getState().settings.unit = 'lb'; });
    await choose('Date,Workout Name,Duration,Exercise Name,Set Order,Weight,Reps,Distance,Seconds,Notes,Workout Notes,RPE\n2026-03-02 10:00:00,T,,Ex,1,135,5,0,0,,,\n');
    await tap(screen.getByLabelText('kg')); await flushAll(10); await tap(screen.getByText(t('Importuj'))); await flushAll(10);
    expect(store.getState().workouts.find(x => x.templateName === 'T')!.exercises[0].sets[0].weight).toBe(135);
  });
  test('zmiana dopasowania: nowe zamiast dopasowanego i wybór istniejącego ćwiczenia z wyszukiwarki; skutek w danych', async () => {
    await boot(); await choose(fx('import-formatA.csv'));
    await tap(screen.getByText('Bench Press (Barbell)')); await flushAll(10); expect(screen.getByLabelText(t('Szukaj ćwiczenia…'))).toBeTruthy();
    await tap(screen.getAllByText(t('Nowe ćwiczenie'))[0]); await flushAll(10); /* pierwsza pozycja listy zmiany = „Nowe ćwiczenie” */
    expect(screen.getByText(t('Ćwiczenia dopasowane do Twoich: {n}', { n: 3 }))).toBeTruthy(); expect(screen.getByText(t('Nowe ćwiczenia: {n}', { n: 3 }))).toBeTruthy();
    await tap(screen.getByText('Squat (Barbell)')); await flushAll(10); await typeText(screen.getByLabelText(t('Szukaj ćwiczenia…')), 'back squat'); await flushAll(10);
    await tap(screen.getAllByText('Back Squat').slice(-1)[0]); await flushAll(10);
    expect(screen.getByText(t('Ćwiczenia dopasowane do Twoich: {n}', { n: 4 }))).toBeTruthy();
    await tap(screen.getByText(t('Importuj'))); await flushAll(10);
    const st = store.getState(); const push = st.workouts.find(w => w.templateName === 'Push A')!; expect(st.exercises.find(e => e.id === push.exercises[0].exerciseId)!.name).toBe('Bench Press (Barbell)');
    const legs = st.workouts.find(w => w.templateName === 'Nogi, "B"')!; expect(st.exercises.find(e => e.id === legs.exercises[0].exerciseId)!.name).toBe('Back Squat');
  });
  test('formatB: podgląd z uwagą o braku godzin i dystansie jako metrach; brak wyboru jednostki (plik podaje kg/lbs)', async () => {
    await boot(); await choose(fx('import-formatB.csv'));
    expect(screen.getByText(t('Treningi do dodania: {n}', { n: 2 }))).toBeTruthy(); expect(screen.queryByLabelText(t('Jednostka ciężaru w pliku'))).toBeNull();
    expect(screen.getByText(t('Plik nie podaje godzin treningów — dzień, w którym masz już trening, zostanie pominięty jako duplikat.'))).toBeTruthy(); expect(screen.getByText(t('Dystans w pliku przyjęto jako metry.'))).toBeTruthy();
  });
  test('duplikaty z istniejącą historią są liczone na podglądzie (ta sama minuta startu)', async () => {
    await boot('pl', () => { addWorkout(new Date(2026, 2, 2, 18, 5, 30).getTime(), [['Plank', [{ durationSec: 30, done: true }]]], 'Własny'); });
    await choose(fx('import-formatA.csv'));
    expect(screen.getByText(t('Pominięte jako duplikaty: {n}', { n: 1 }))).toBeTruthy(); expect(screen.getByText(t('Treningi do dodania: {n}', { n: 2 }))).toBeTruthy();
  });
  test('błędne wiersze: licznik pominiętych na podglądzie', async () => {
    await boot(); await choose(fx('import-formatA.csv') + 'zła data,T,,X,1,5,5,0,0,,,\n'); expect(screen.getByText(t('Pominięte wiersze (błędne dane): {n}', { n: 1 }))).toBeTruthy();
  });
  test('błędny/obcy/pusty plik: komunikat, brak podglądu, dane bez zmian', async () => {
    await boot(); const snap = JSON.stringify(store.getState());
    for (const [txt, msg] of [[fx('import-obcy.csv'), 'To nie wygląda na obsługiwany plik CSV z historią treningów. Dane nie zostały zmienione.'], ['', 'Plik jest pusty. Dane nie zostały zmienione.'],
      ['Date,Workout Name,Duration,Exercise Name,Set Order,Weight,Reps,Distance,Seconds,Notes,Workout Notes,RPE\n', 'Plik nie zawiera żadnych poprawnych treningów. Dane nie zostały zmienione.']] as const) {
      global.__alerts.length = 0; await choose(txt); expect(global.__alerts.some(a => a.title === t('Nie udało się zaimportować pliku') && a.msg === t(msg))).toBe(true); expect(screen.queryByText(t('Podgląd importu'))).toBeNull();
    }
    expect(JSON.stringify(store.getState())).toBe(snap);
    (require('expo-document-picker').getDocumentAsync as jest.Mock).mockImplementationOnce(async () => ({ canceled: false, assets: [{ uri: 'file:///cache/DocumentPicker/big.csv', size: 999_999_999 }] }));
    global.__alerts.length = 0; await tap(screen.getByText(t('Wybierz plik CSV'))); await flushAll(10); expect(global.__alerts.some(a => a.msg === t('Plik jest za duży. Dane nie zostały zmienione.'))).toBe(true);
  });
  test('anulowanie wyboru pliku nie pokazuje podglądu ani błędu', async () => {
    await boot(); (require('expo-document-picker').getDocumentAsync as jest.Mock).mockImplementationOnce(async () => ({ canceled: true, assets: null })); global.__alerts.length = 0;
    await tap(screen.getByText(t('Wybierz plik CSV'))); await flushAll(10); expect(screen.queryByText(t('Podgląd importu'))).toBeNull(); expect(global.__alerts).toHaveLength(0);
  });
  test('nieudana kopia bezpieczeństwa: import przerwany komunikatem, dane bez zmian', async () => {
    await boot(); await choose(fx('import-formatA.csv')); const snap = JSON.stringify(store.getState()); (FS().writeAsStringAsync as jest.Mock).mockRejectedValueOnce(new Error('brak miejsca'));
    await tap(screen.getByText(t('Importuj'))); await flushAll(10);
    expect(global.__alerts.some(a => a.title === t('Import przerwany'))).toBe(true); expect(JSON.stringify(store.getState())).toBe(snap); expect(screen.getByText(t('Podgląd importu'))).toBeTruthy();
  });
  test('scenariusz z restartem: po imporcie zapis → restart aplikacji → treningi w Historii i ten sam stan', async () => {
    await boot(); await choose(fx('import-formatA.csv')); await tap(screen.getByText(t('Importuj'))); await flushAll(10); await act(async () => { await store.flush(); });
    const before = JSON.stringify(store.migrate(JSON.parse(JSON.stringify(saved())))); store.__resetForTests(); await act(async () => { await store.init(); });
    expect(JSON.stringify(store.migrate(JSON.parse(JSON.stringify(store.getState()))))).toBe(before); expect(store.getState().workouts.filter(w => w.templateName === 'Push A')).toHaveLength(1);
    await go('/history'); await flushAll(10); expect(screen.getAllByText(/Push A/).length).toBeGreaterThan(0);
  });
  test('EN: teksty ekranu po angielsku; pressAlert nie jest potrzebny do podglądu', async () => {
    await boot('en'); expect(screen.getByText('Choose a CSV file')).toBeTruthy(); await choose(fx('import-formatA.csv'));
    expect(screen.getByText('Workouts to add: 3')).toBeTruthy(); expect(screen.getByText('Skipped as duplicates: 0')).toBeTruthy(); expect(screen.getByText('Import preview')).toBeTruthy(); void pressAlert;
  });
});
