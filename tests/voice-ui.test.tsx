/*
 * Ustawienia → głos (0.20, docs/36): przełącznik „Głos także przez głośnik telefonu” (domyślnie wyłączony, zapis tylko true), „Posłuchaj przykładu”, wskazówka przy braku głosu
 * w telefonie, EN. Rodzaje (docs/20): ekran, dane (restart), języki. Mowa w trakcie treningu: tests/voice.test.ts; E2E Maestro (dźwięku na symulatorze nie słychać): przełącznik.
 */
import * as store from '@/lib/store';
import { applyLang } from '@/lib/i18n';
import { __setScreenReaderForTests } from '@/lib/voice';
import { fresh, saved } from './helpers';
import { renderApp, flushAll, screen, tap, act, fireEvent } from './app';

jest.setTimeout(60000);
const S = () => store.getState();
const V = () => global.__voice;
const LONG = 'W słuchawkach zapowiedź następnego ćwiczenia pada na początku przerwy (gdy dźwięk jest włączony); przez głośnik telefonu tylko po włączeniu tego przełącznika.';
beforeEach(() => { V().spoken.length = 0; V().hasVoice = true; __setScreenReaderForTests(false); });
afterEach(() => { applyLang('pl'); });
const boot = async (locale: 'pl' | 'en' = 'pl', fn: () => void = () => {}) => { await fresh(undefined, locale); fn(); store.save(); await act(async () => { await store.flush(); }); await renderApp({ saved: JSON.parse(JSON.stringify(saved())), locale, url: '/more/settings' }); await flushAll(10); };
const sw = async (label: string, v: boolean) => { await act(async () => { fireEvent(screen.getByLabelText(label), 'valueChange', v); }); await flushAll(10); };

test('domyślnie wyłączony, z opisem; nie ma wskazówki o braku głosu, gdy głos jest', async () => {
  await boot(); expect(screen.getByText('Głos także przez głośnik telefonu')).toBeTruthy(); expect(screen.getByText(LONG)).toBeTruthy();
  expect(screen.getByLabelText('Głos także przez głośnik telefonu').props.value).toBe(false); expect('voiceSpeaker' in S().settings).toBe(false);
  expect(screen.queryByText(/^Brak głosu dla języka aplikacji/)).toBeNull();
});
test('włączenie zapisuje tylko true i przeżywa restart; wyłączenie usuwa pole', async () => {
  await boot(); await sw('Głos także przez głośnik telefonu', true); expect(S().settings.voiceSpeaker).toBe(true);
  await act(async () => { await store.flush(); }); await renderApp({ saved: JSON.parse(JSON.stringify(saved())), url: '/more/settings' }); await flushAll(10);
  expect(screen.getByLabelText('Głos także przez głośnik telefonu').props.value).toBe(true);
  await sw('Głos także przez głośnik telefonu', false); expect('voiceSpeaker' in S().settings).toBe(false);
});
test('„Posłuchaj przykładu” mówi przykładową zapowiedź w języku aplikacji', async () => {
  await boot(); await tap(screen.getByText('Posłuchaj przykładu')); await flushAll(10); expect(V().spoken).toEqual([['dalej: Bench Press, 80 kilogramów, 8 powtórzeń', 'pl-PL']]);
});
test('brak głosu dla języka w telefonie: wskazówka z instrukcją pobrania (przełącznik i przykład dalej dostępne)', async () => {
  V().hasVoice = false; await boot(); expect(screen.getByText('Brak głosu dla języka aplikacji w tym telefonie. Pobierz go w Ustawieniach iOS (Dostępność → Treści mówione → Głosy).')).toBeTruthy();
  expect(screen.getByText('Posłuchaj przykładu')).toBeTruthy();
});
test('EN: etykiety, wskazówka i przykład po angielsku', async () => {
  V().hasVoice = false; await boot('en'); expect(screen.getByText('Voice also through the phone speaker')).toBeTruthy(); expect(screen.getByText('Listen to an example')).toBeTruthy();
  expect(screen.getByText('This phone has no voice for the app language. Download one in iOS Settings (Accessibility → Spoken Content → Voices).')).toBeTruthy();
  await tap(screen.getByText('Listen to an example')); await flushAll(10); expect(V().spoken[0][0]).toBe('next: Bench Press, 80 kilograms, 8 reps');
});
