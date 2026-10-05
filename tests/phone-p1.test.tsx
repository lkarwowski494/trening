/* Zgłoszenia z pierwszego testu na iPhonie (02.10.2026): P-001 gumy bez kilogramów, P-002 ustawienia z przełącznikami iOS. */
import * as store from '@/lib/store';
import * as timer from '@/lib/timer';
import { fireEvent } from '@testing-library/react-native';
import { fresh, ex, legacyBandKg } from './helpers';
import { renderApp, flushAll, screen, go, tap, act } from './app';

jest.setTimeout(30000);
afterEach(async () => { try { store.getState(); } catch { return; } await timer.stop(); await timer.stopSet(); });

describe('P-001 gumy: tylko kolor i poziom 1–7', () => {
  test('ekran gum: bez pola kg, opis mówi o poziomie; poziom dalej ograniczony do 1–7', async () => {
    await renderApp(); await go('/more/bands'); await flushAll(10);
    expect(screen.queryAllByLabelText(/^Asysta/)).toHaveLength(0); expect(screen.queryByPlaceholderText('kg')).toBeNull();
    expect(screen.getByText(/Gumy nie mają kilogramów/)).toBeTruthy();
    const lvl = screen.getAllByLabelText('Poziom (1–7)')[0]; await act(async () => { fireEvent.changeText(lvl, '9'); }); await flushAll(400);
    expect(Math.max(...store.getState().bands.map(b => b.level))).toBe(7);
  });
  test('stare dane z asystą kg gumy: wybór gumy w treningu nie wpisuje ujemnych kg; ręczne ±kg zostaje przy zmianie i zdjęciu gumy', async () => {
    await fresh(); const st = store.getState(); st.bands.forEach(b => { legacyBandKg(b, 20); }); const pu = ex('Pull Up'); pu.bandAssistable = true;
    store.startEmpty(); store.addExerciseToActive(pu); await store.flush();
    await renderApp({ saved: JSON.parse(JSON.stringify(store.getState())) }); await flushAll(20);
    const s0 = () => store.getState().active!.exercises[0].sets[0];
    await tap(screen.getAllByLabelText(/^Guma: /)[0]); await flushAll(5); expect(s0().bandId).not.toBe(''); expect(s0().addKg).toBe('');
    await act(async () => { s0().addKg = -10; store.save(store.getState().active); });
    await tap(screen.getAllByLabelText(/^Guma: /)[0]); await flushAll(5); expect(s0().addKg).toBe(-10);
  });
});

describe('P-002 ustawienia: przełączniki iOS, segmenty, grupy', () => {
  const SWITCHES = ['Dźwięk i wibracja na koniec przerwy', 'Ekran włączony podczas treningu', 'RPE / RIR przy serii', 'Podpowiedź progresji', 'Zapisuj zakończone treningi do Apple Health', 'Automatyczna kopia po każdym treningu'];
  test('każda opcja wł./wył. to przełącznik z nazwą i stanem; brak dawnych przycisków „włączone/wyłączone”', async () => {
    await renderApp(); await go('/more/settings'); await flushAll(10);
    const sw = screen.getAllByRole('switch').map(x => x.props.accessibilityLabel);
    expect(sw).toEqual(expect.arrayContaining(SWITCHES)); expect(screen.queryByText('włączone')).toBeNull(); expect(screen.queryByText('wyłączone')).toBeNull();
    for (const h of ['Ogólne', 'Trening', 'Dane i kopie', 'Powiadomienia', 'Moduły']) expect(screen.getAllByText(h).length).toBeGreaterThan(0);
  });
  test('przełączenie zmienia ustawienie i stan VoiceOver (dźwięk, ekran, RPE, podpowiedź, kopia)', async () => {
    await renderApp(); await go('/more/settings'); await flushAll(10); const s = store.getState().settings;
    const cases: [string, () => boolean][] = [['Dźwięk i wibracja na koniec przerwy', () => s.sound], ['Ekran włączony podczas treningu', () => s.wakeLock], ['RPE / RIR przy serii', () => s.showRpe], ['Podpowiedź progresji', () => s.progressHint], ['Automatyczna kopia po każdym treningu', () => s.autoBackup]];
    for (const [label, get] of cases) {
      const before = get(); await act(async () => { fireEvent(screen.getByLabelText(label), 'valueChange', !before); }); await flushAll(5);
      expect(get()).toBe(!before); expect(screen.getByLabelText(label).props.accessibilityState.checked).toBe(!before);
    }
  });
  test('język i jednostka jako segmenty: zaznaczony segment ma stan „wybrany”, zmiana działa jednym stuknięciem', async () => {
    await renderApp(); await go('/more/settings'); await flushAll(10);
    expect(screen.getByLabelText('kg').props.accessibilityState.selected).toBe(true);
    await tap(screen.getByText('lb')); expect(store.getState().settings.unit).toBe('lb'); expect(screen.getByLabelText('lb').props.accessibilityState.selected).toBe(true);
    await tap(screen.getByText('English')); expect(await screen.findByText('Language')).toBeTruthy(); expect(screen.getByText('General')).toBeTruthy();
    await tap(screen.getByText('kg')); expect(store.getState().settings.unit).toBe('kg');
  });
});
