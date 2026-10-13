/*
 * Wzorce interakcji (właściciel, 13.10.2026; docs/32-wzorce-interakcji.md) — zachowanie (strażniki źródeł: tests/interaction-guards.test.ts, okna: tests/close-button-guard.test.tsx).
 * Rodzaje (docs/20): logika (lib/confirm, lib/announce, lib/notices, workoutInProgressNotice), ekran („+” w nagłówku na pięciu listach, SearchField, Missing, DateField,
 * Segmented, rozwijanie z expanded, wybór z selected, długa akcja, wiersz autozapisu, tytuły błędów), scenariusz (dodaj → edytor / lista presetów / nowa guma / nowy plan),
 * języki (EN etykiety „+”). E2E: .maestro/06, 08, 10, 13, 19.
 */
import React from 'react';
import { AccessibilityInfo } from 'react-native';
import { render, fireEvent, renderHook } from '@testing-library/react-native';
import * as store from '@/lib/store';
import * as plan from '@/lib/plan';
import { applyLang } from '@/lib/i18n';
import { cancelButton, backToEditButton, okButton, confirm, confirmSkipTimedSet } from '@/lib/confirm';
import { announce, useAnnounce } from '@/lib/announce';
import { setAutoSavedNotice, autoSavedNotice, useAutoSavedNotice } from '@/lib/notices';
import { workoutInProgressNotice } from '@/lib/start';
import { Btn, Item } from '@/components/ui';
import { fresh, saved, seedWithDemo, withDemoTemplates } from './helpers';
import { renderApp, flushAll, screen, tap, act, go, type } from './app';

const NOW = new Date(2026, 9, 13, 9);
const S = () => store.getState();
afterEach(() => { applyLang('pl'); jest.restoreAllMocks(); });
const boot = async (url: string, locale: 'pl' | 'en' = 'pl', fn: () => void = () => {}) => {
  jest.useFakeTimers({ now: NOW }); await fresh(seedWithDemo(), locale); fn();
  await act(async () => { await store.flush(); }); await renderApp({ saved: JSON.parse(JSON.stringify(saved())), locale, url }); await flushAll(10);
};
const route = () => { const { store: rs } = require('expo-router/build/global-state/router-store'); let st = rs.navigationRef.getRootState(); while (st.routes[st.index ?? st.routes.length - 1].state) st = st.routes[st.index ?? st.routes.length - 1].state; return st.routes[st.index ?? st.routes.length - 1].name as string; };

describe('lib/confirm: jedno słowo rezygnacji', () => {
  test('cancelButton = „Anuluj” (styl cancel, opcjonalna akcja); backToEditButton = „Wróć do edycji”; okButton = „OK”', () => {
    const fn = jest.fn();
    expect(cancelButton()).toEqual({ text: 'Anuluj', style: 'cancel' }); expect(cancelButton(fn)).toEqual({ text: 'Anuluj', style: 'cancel', onPress: fn });
    expect(backToEditButton()).toEqual({ text: 'Wróć do edycji', style: 'cancel' }); expect(okButton()).toEqual({ text: 'OK', style: 'cancel' });
    applyLang('en'); expect(cancelButton().text).toBe('Cancel'); expect(backToEditButton().text).toBe('Back to editing');
  });
  test('confirm(): Alert [Anuluj, akcja]; destructive tylko na żądanie; onConfirm i onCancel', () => {
    global.__alerts.length = 0; const yes = jest.fn(), no = jest.fn();
    confirm({ title: 'Usunąć?', message: 'opis', action: 'Usuń', destructive: true, onConfirm: yes, onCancel: no });
    const a = global.__alerts[0]; const b = a.buttons as { text: string; style?: string; onPress?: () => void }[];
    expect(a.title).toBe('Usunąć?'); expect(b.map(x => [x.text, x.style])).toEqual([['Anuluj', 'cancel'], ['Usuń', 'destructive']]);
    b[1].onPress!(); b[0].onPress!(); expect(yes).toHaveBeenCalledTimes(1); expect(no).toHaveBeenCalledTimes(1);
    confirm({ title: 'T', action: 'Zrób', onConfirm: yes }); expect((global.__alerts[1].buttons as { style?: string }[])[1].style).toBeUndefined();
  });
  test('confirmSkipTimedSet(): „Trwa pomiar serii” [Anuluj, Pomiń dziś (destructive)] — wspólne dla bloku i okna „Dostosuj”', () => {
    global.__alerts.length = 0; const yes = jest.fn(); confirmSkipTimedSet(yes);
    const a = global.__alerts[0]; const b = a.buttons as { text: string; style?: string; onPress?: () => void }[];
    expect(a.title).toBe('Trwa pomiar serii'); expect(a.msg).toBe('Pominięcie ćwiczenia przerwie pomiar — ten czas się nie zapisze.'); expect(b.map(x => [x.text, x.style])).toEqual([['Anuluj', 'cancel'], ['Pomiń dziś', 'destructive']]);
    expect(yes).not.toHaveBeenCalled(); b[1].onPress!(); expect(yes).toHaveBeenCalledTimes(1);
  });
});

describe('lib/announce i lib/notices', () => {
  test('announce() woła VoiceOver; useAnnounce tylko dla niepustego, zmienionego tekstu', () => {
    const spy = jest.spyOn(AccessibilityInfo, 'announceForAccessibility').mockImplementation(() => {});
    announce('Zapisano'); expect(spy).toHaveBeenCalledWith('Zapisano');
    const h = renderHook(({ t }: { t: string | null }) => useAnnounce(t), { initialProps: { t: null as string | null } });
    expect(spy).toHaveBeenCalledTimes(1); h.rerender({ t: 'Błąd pola' }); expect(spy).toHaveBeenLastCalledWith('Błąd pola'); h.rerender({ t: 'Błąd pola' }); expect(spy).toHaveBeenCalledTimes(2); h.rerender({ t: null }); expect(spy).toHaveBeenCalledTimes(2);
  });
  test('notices: ustawienie i zdjęcie komunikatu autozapisu; hook useAutoSavedNotice reaguje na zmianę', () => {
    setAutoSavedNotice('x'); expect(autoSavedNotice()).toBe('x'); setAutoSavedNotice(null); expect(autoSavedNotice()).toBeNull();
    const h = renderHook(() => useAutoSavedNotice()); expect(h.result.current).toBeNull(); act(() => { setAutoSavedNotice('y'); }); expect(h.result.current).toBe('y'); act(() => { setAutoSavedNotice(null); }); expect(h.result.current).toBeNull();
  });
  test('tytuły błędów mówią, co się nie udało (PL i EN): zakup', () => {
    const { t } = require('@/lib/i18n'); expect(t('Nie udało się dokończyć zakupu')).toBe('Nie udało się dokończyć zakupu'); applyLang('en'); expect(t('Nie udało się dokończyć zakupu')).toBe('Couldn\'t complete the purchase');
  });
  test('workoutInProgressNotice: „Trening w toku” / „Najpierw zakończ albo odrzuć bieżący trening.”', () => {
    global.__alerts.length = 0; workoutInProgressNotice(); expect(global.__alerts[0]).toMatchObject({ title: 'Trening w toku', msg: 'Najpierw zakończ albo odrzuć bieżący trening.' });
    applyLang('en'); workoutInProgressNotice(); expect(global.__alerts[1]).toMatchObject({ title: 'Workout in progress', msg: 'Finish or discard the current workout first.' });
  });
});

describe('„+” w nagłówku list (S4)', () => {
  test('Szablony: „Dodaj szablon” → edytor nowego szablonu', async () => {
    await boot('/templates'); const b = screen.getByLabelText('Dodaj szablon'); expect(b.props.accessibilityRole).toBe('button'); expect(screen.getByTestId('add-button')).toBeTruthy();
    expect(screen.queryByText('+ Nowy')).toBeNull(); await tap(b); await flushAll(10); expect(route()).toBe('template/[id]');
  });
  test('Ćwiczenia: „Dodaj ćwiczenie” → edytor nowego ćwiczenia; pole wyszukiwania ma przycisk czyszczenia i limit', async () => {
    await boot('/exercises'); await tap(screen.getByLabelText('Dodaj ćwiczenie')); await flushAll(10); expect(route()).toBe('exercise/[id]');
  });
  test('Miejsca: „Dodaj miejsce” otwiera listę presetów (bez blokady drugiego tapnięcia — idempotentne)', async () => {
    await boot('/more/locations'); await tap(screen.getByLabelText('Dodaj miejsce')); expect(screen.getByText('Nowe miejsce')).toBeTruthy(); await tap(screen.getByLabelText('Dodaj miejsce')); expect(screen.getByText('Nowe miejsce')).toBeTruthy();
  });
  test('Gumy: „Dodaj gumę” dodaje od razu; drugie tapnięcie w ciągu chwili nie dodaje drugiej', async () => {
    await boot('/more/bands'); const n = S().bands.length; const b = screen.getByLabelText('Dodaj gumę'); await tap(b); await tap(b); expect(S().bands.length).toBe(n + 1);
  });
  test('Plan: „Dodaj plan” (z podpowiedzią) tworzy kopię i otwiera ją; po pełnej liście planów przycisku nie ma', async () => {
    await boot('/plan', 'pl', () => { const t = withDemoTemplates('pl'); plan.setWeekDay(0, S().templates[0].id); void t; });
    const b = screen.getByLabelText('Dodaj plan'); expect(b.props.accessibilityHint).toBe('Kopia obecnego planu w „Inne plany” — zmienisz ją przed ustawieniem jako aktywny.');
    const n = plan.savedPlans().length; await tap(b); await flushAll(10); expect(plan.savedPlans().length).toBe(n + 1); expect(route()).toBe('plan');
  });
  test('EN: etykiety „Add template / exercise / place / band / plan”', async () => {
    for (const [url, label] of [['/templates', 'Add template'], ['/exercises', 'Add exercise'], ['/more/locations', 'Add place'], ['/more/bands', 'Add band'], ['/plan', 'Add plan']] as const) {
      await boot(url, 'en'); expect(screen.getByLabelText(label)).toBeTruthy();
    }
  });
});

describe('wspólne komponenty ekranów', () => {
  test('SearchField: „Szukaj ćwiczenia…”, przycisk czyszczenia i limit 80 znaków (Ćwiczenia)', async () => {
    await boot('/exercises'); const f = screen.getByPlaceholderText('Szukaj ćwiczenia…'); expect(f.props.clearButtonMode).toBe('while-editing'); expect(f.props.maxLength).toBe(80); expect(f.props.accessibilityLabel).toBe('Szukaj ćwiczenia…');
    await type(f, 'Squat'); expect(screen.getByPlaceholderText('Szukaj ćwiczenia…').props.value).toBe('Squat');
  });
  test('Missing: „Nie ma takiego szablonu.” z grafiką i „Wróć” (wraca na ekran pod spodem)', async () => {
    await boot('/templates'); await go('/template/nie-ma'); await flushAll(10); expect(screen.getByText('Nie ma takiego szablonu.')).toBeTruthy(); await tap(screen.getByText('Wróć')); await flushAll(10); expect(route()).toBe('templates');
  });
  test('DateField: pole daty masy ciała ma strzałki „Dzień wcześniej / później” (jak trening wstecz)', async () => {
    await boot('/more/bodymass'); const d = screen.getByLabelText('Data pomiaru (RRRR-MM-DD)'); expect(d.props.value).toBe('2026-10-13');
    await tap(screen.getByLabelText('Dzień wcześniej')); expect(screen.getByLabelText('Data pomiaru (RRRR-MM-DD)').props.value).toBe('2026-10-12'); await tap(screen.getByLabelText('Dzień później')); await tap(screen.getByLabelText('Dzień później')); expect(screen.getByLabelText('Data pomiaru (RRRR-MM-DD)').props.value).toBe('2026-10-14');
  });
  test('masa ciała: pusta lista to <Empty> „Brak pomiarów.”', async () => { await boot('/more/bodymass'); expect(screen.getByText('Brak pomiarów.')).toBeTruthy(); });
  test('Segmented zamiast dwóch chipów: tryb generatora („Generator szablonów i planu”) przełącza i zaznacza wybór', async () => {
    await boot('/generator'); const g = screen.getByLabelText('Generator szablonów i planu'); expect(g.props.accessibilityRole).toBe('radiogroup');
    expect(screen.getByLabelText('Nowe szablony i plan').props.accessibilityState.selected).toBe(true); await tap(screen.getByLabelText('Plan z moich szablonów')); expect(screen.getByLabelText('Plan z moich szablonów').props.accessibilityState.selected).toBe(true);
  });
  test('Btn loading: wskaźnik, stan busy+disabled VoiceOver, brak wywołania onPress; Btn expanded', () => {
    const fn = jest.fn(); const r = render(<><Btn title="Eksport" loading onPress={fn} /><Btn title="Więcej" expanded onPress={fn} /></>);
    fireEvent.press(r.getByText('Eksport')); expect(fn).not.toHaveBeenCalled(); expect(r.getByLabelText('Eksport').props.accessibilityState).toMatchObject({ busy: true, disabled: true }); expect(r.UNSAFE_queryByType(require('react-native').ActivityIndicator)).toBeTruthy();
    expect(r.getByLabelText('Więcej').props.accessibilityState).toMatchObject({ expanded: true });
  });
  test('Item expanded / selected → accessibilityState', () => {
    const r = render(<><Item title="A" expanded={false} onPress={() => {}} /><Item title="B" selected onPress={() => {}} /><Item title="C" onPress={() => {}} /></>);
    expect(r.getByLabelText('A').props.accessibilityState).toMatchObject({ expanded: false }); expect(r.getByLabelText('B').props.accessibilityState).toMatchObject({ selected: true }); expect(r.getByLabelText('C').props.accessibilityState?.expanded).toBeUndefined(); expect(r.getByLabelText('C').props.accessibilityState?.selected).toBeUndefined();
  });
  test('Ustawienia: „Cele partii” — stała etykieta, stan expanded zmienia się po stuknięciu', async () => {
    await boot('/more/settings'); expect(screen.getByLabelText('Cele partii').props.accessibilityState).toEqual({ expanded: false }); await tap(screen.getByLabelText('Cele partii')); expect(screen.getByLabelText('Cele partii').props.accessibilityState).toEqual({ expanded: true }); expect(screen.getByTestId('set-goals')).toBeTruthy();
  });
});

describe('informacja i błędy', () => {
  test('wiersz „Trening zapisał się sam” na ekranie Trening: tytuł, opis, etykieta VoiceOver z „Tapnij, by ukryć.”; stuknięcie ukrywa', async () => {
    await boot('/'); await act(async () => { setAutoSavedNotice('Trening z pon. zapisał się sam.'); }); await flushAll(5);
    expect(screen.getByText('Trening zapisał się sam')).toBeTruthy(); expect(screen.getByLabelText('Trening zapisał się sam, Trening z pon. zapisał się sam.. Tapnij, by ukryć.')).toBeTruthy();
    await tap(screen.getByText('Trening zapisał się sam')); await flushAll(5); expect(screen.queryByText('Trening zapisał się sam')).toBeNull(); expect(autoSavedNotice()).toBeNull();
  });
  test('eksport kopii nieudany: tytuł mówi, co się nie udało („Nie udało się wyeksportować kopii”)', async () => {
    await boot('/more/backup'); jest.spyOn(require('expo-file-system/legacy'), 'writeAsStringAsync').mockRejectedValue(new Error('disk full')); global.__alerts.length = 0;
    await tap(screen.getByText('Eksportuj backup (plik JSON)')); await flushAll(10); expect(global.__alerts.at(-1)).toMatchObject({ title: 'Nie udało się wyeksportować kopii', msg: 'Spróbuj ponownie.' });
  });
  test('dane z nowszej wersji: nieudane „Wyślij dane” → „Nie udało się wysłać danych”', async () => {
    jest.useFakeTimers({ now: NOW }); await fresh(); const st = JSON.parse(JSON.stringify(S())); st.schemaVersion = require('@/lib/seed').SCHEMA_VERSION + 1;
    await renderApp({ saved: JSON.stringify(st) }); await flushAll(10); jest.spyOn(require('expo-file-system/legacy'), 'writeAsStringAsync').mockRejectedValue(new Error('disk full')); global.__alerts.length = 0;
    await tap(screen.getByText('Wyślij dane')); await flushAll(10); expect(global.__alerts.at(-1)).toMatchObject({ title: 'Nie udało się wysłać danych', msg: 'Spróbuj ponownie.' });
  });
});
