/* DEC-03 (c), właściciel 23.10.2026: przywrócenie przełącznika trybu w generatorze przed 1.0 (wyjątek od zamrożenia zakresu); odwraca punkt 5 ZM-03
 * (docs/design/to-be.md), reszta ZM-03 zostaje (zapis bez okien, gdy nie ma aktywnego planu). Przełącznik: Segmented „Generator szablonów i planu”
 * z opcjami „Nowe szablony i plan” / „Plan z moich szablonów” na górze ekranu /generator; ?mode=own otwiera od razu drugi tryb; przycisk
 * „Plan z moich szablonów” w Planowaniu zostaje jako skrót.
 * Rodzaje: ekran, scenariusz (przełączanie tam i z powrotem, zapis z obu trybów), macierz (wejście × tryb), niezmienniki (jeden zaznaczony), języki (en), a11y. */
import * as store from '@/lib/store';
import * as plan from '@/lib/plan';
import { fresh, saved, withDemoTemplates } from './helpers';
import { renderApp, flushAll, screen, tap, act } from './app';

jest.setTimeout(120000);
const NOW = new Date(2026, 9, 8, 9, 0);
const boot = async (url: string, fn: () => void = () => {}, locale: 'pl' | 'en' = 'pl') => {
  jest.useFakeTimers({ now: NOW }); await fresh(undefined, locale); fn();
  await act(async () => { await store.flush(); }); await renderApp({ saved: JSON.parse(JSON.stringify(saved())), locale, url }); jest.setSystemTime(NOW.getTime()); await flushAll(10);
};
const NEW = ['Nowe szablony i plan', 'New templates and plan'], OWN = ['Plan z moich szablonów', 'Plan from my templates'];
const sel = (label: string) => screen.getByLabelText(label).props.accessibilityState.selected;

describe('DEC-03: przełącznik trybu w generatorze', () => {
  test('/generator: kontrolka radiogroup „Generator szablonów i planu”, „Nowe szablony i plan” zaznaczone, formularz generatora widoczny', async () => {
    await boot('/generator');
    expect(screen.getByLabelText('Generator szablonów i planu').props.accessibilityRole).toBe('radiogroup');
    expect(sel(NEW[0])).toBe(true); expect(sel(OWN[0])).toBe(false);
    expect(screen.getByText('Cel')).toBeTruthy(); expect(screen.getByText('Zapisz szablony i plan')).toBeTruthy();
  });
  test('przełączanie: „Plan z moich szablonów” → ekran własnych szablonów, z powrotem → generator; zaznaczony zawsze dokładnie jeden', async () => {
    await boot('/generator', () => { withDemoTemplates(); });
    await tap(screen.getByLabelText(OWN[0])); await flushAll(10);
    expect(sel(OWN[0])).toBe(true); expect(sel(NEW[0])).toBe(false); expect(screen.getByText('Zapisz plan')).toBeTruthy(); expect(screen.queryByText('Zapisz szablony i plan')).toBeNull();
    await tap(screen.getByLabelText(NEW[0])); await flushAll(10);
    expect(sel(NEW[0])).toBe(true); expect(sel(OWN[0])).toBe(false); expect(screen.getByText('Zapisz szablony i plan')).toBeTruthy(); expect(screen.queryByText('Zapisz plan')).toBeNull();
  });
  test('/generator?mode=own: przełącznik jest, zaznaczony „Plan z moich szablonów”; wybór „Nowe szablony i plan” wraca do generatora', async () => {
    await boot('/generator?mode=own', () => { withDemoTemplates(); });
    expect(screen.getByLabelText('Generator szablonów i planu')).toBeTruthy(); expect(sel(OWN[0])).toBe(true);
    await tap(screen.getByLabelText(NEW[0])); await flushAll(10); expect(screen.getByText('Cel')).toBeTruthy();
  });
  test('z Planowania przycisk „Plan z moich szablonów” otwiera ten sam ekran z przełącznikiem (skrót zostaje)', async () => {
    await boot('/plan', () => { withDemoTemplates(); }); await tap(screen.getByText('Plan z moich szablonów')); await flushAll(1100);
    expect(sel(OWN[0])).toBe(true); expect(sel(NEW[0])).toBe(false);
  });
  test('zapis po przełączeniu trybu: obie drogi, bez aktywnego planu — aktywny bez pytania (ZM-03 zostaje)', async () => {
    await boot('/generator', () => { withDemoTemplates(); });
    await tap(screen.getByLabelText(OWN[0])); await flushAll(10); await tap(screen.getByText('Zapisz plan')); await flushAll(1100);
    expect(global.__alerts.map(a => a.title)).toEqual([]); expect(plan.hasActivePlan()).toBe(true); expect(screen.getByTestId('plan-notice')).toBeTruthy();
  });
  test('English: etykiety przełącznika', async () => {
    await boot('/generator', () => {}, 'en');
    expect(screen.getByLabelText('Template and plan generator').props.accessibilityRole).toBe('radiogroup'); expect(sel(NEW[1])).toBe(true); expect(screen.getByLabelText(OWN[1])).toBeTruthy();
  });
  test('brak szablonów z ćwiczeniami: komunikat odsyła do przełącznika „Nowe szablony i plan”', async () => {
    await boot('/generator?mode=own', () => {}, 'pl');
    expect(screen.getByText('Nie masz szablonów z ćwiczeniami. Utwórz szablon albo wybierz „Nowe szablony i plan”.')).toBeTruthy();
  });
});
