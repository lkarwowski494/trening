/* Audyt kontrolny 1, UI2-06 (NISKA): Kalendarz → Plan tygodnia → generator → „Ustaw jako aktywny” → „Zapisano” → „Plan tygodnia” kładło drugi
 * ekran planu na stos (`["(tabs)","plan","plan"]`), „Wróć” prowadziło do tego samego ekranu; okno „Zapisano” nie pozwalało zostać na generatorze.
 * Naprawa: gdy pod generatorem jest ekran Plan tygodnia (aktywny plan, bez ?id) — powrót do niego (router.back), inaczej replace('/plan');
 * w oknie „Zapisano” dodatkowo „OK” (zostaje na generatorze). To samo w trybie „Plan z moich szablonów”.
 * Rodzaje: ekran (przyciski okna), scenariusz (stos nawigacji z Kalendarza, z ekranu głównego, „OK”), EN. */
import * as store from '@/lib/store';
import * as plan from '@/lib/plan';
import { fresh, saved, withDemoTemplates } from './helpers';
import { renderApp, flushAll, screen, tap, act, go } from './app';

jest.setTimeout(120000);
const NOW = new Date(2026, 9, 8, 9, 0);
const boot = async (url: string, fn: () => void = () => {}, locale: 'pl' | 'en' = 'pl') => {
  jest.useFakeTimers({ now: NOW }); await fresh(undefined, locale); fn();
  await act(async () => { await store.flush(); }); await renderApp({ saved: JSON.parse(JSON.stringify(saved())), locale, url }); jest.setSystemTime(NOW.getTime()); await flushAll(10);
};
const lastAlert = (title: string) => [...global.__alerts].reverse().find(x => x.title === title);
const press = async (title: string, btn: string) => { const a = lastAlert(title)!; expect(a).toBeTruthy(); await act(async () => { a.buttons!.find(b => b.text === btn)!.onPress?.(); }); await flushAll(10); };
/** Stos głównego Stacka (nazwy ekranów, bez zakładek). */
type Nav = { routes: { name: string; state?: Nav }[] };
const stack = () => { const { store: rs } = require('expo-router/build/global-state/router-store'); let st: Nav = rs.navigationRef.getRootState();
  while (st.routes.length === 1 && st.routes[0].name === '__root' && st.routes[0].state) st = st.routes[0].state; /* expo-router: korzeń „__root” z głównym Stackiem w środku */
  return st.routes.map(r => r.name); };
const plans = () => stack().filter(x => x === 'plan').length;

describe('UI2-06 — „Plan tygodnia” po zapisie nie dubluje ekranu planu', () => {
  test('generator z Planu tygodnia: „Ustaw jako aktywny” → „Plan tygodnia” wraca do tego samego ekranu planu (jeden na stosie)', async () => {
    await boot('/history'); await tap(screen.getByText('Plan tygodnia')); await flushAll(1100);
    await tap(screen.getByText('Wygeneruj szablony i plan')); await flushAll(1100); expect(stack()).toEqual(['(tabs)', 'plan', 'generator']);
    await tap(screen.getByText('Zapisz szablony i plan')); await flushAll(5); await press('Ustawić nowy plan jako aktywny?', 'Ustaw jako aktywny');
    const btns = lastAlert('Zapisano')!.buttons!.map(b => b.text);
    await press('Zapisano', 'Plan tygodnia'); expect(stack()).toEqual(['(tabs)', 'plan']); expect(plans()).toBe(1); /* przed naprawą: ['(tabs)', 'plan', 'plan'] */
    expect(btns).toEqual(['Pokaż szablony', 'Plan tygodnia', 'OK']);
    expect(screen.getByDisplayValue('Masa, 3× w tygodniu · Pełna siłownia')).toBeTruthy(); /* ekran planu pokazuje nowy aktywny plan */
  });
  test('generator otwarty bez planu pod spodem (np. z ekranu głównego): „Plan tygodnia” zastępuje generator', async () => {
    await boot('/'); await go('/generator'); await flushAll(10); expect(stack()).toEqual(['(tabs)', 'generator']);
    await tap(screen.getByText('Zapisz szablony i plan')); await flushAll(5); await press('Ustawić nowy plan jako aktywny?', 'Tylko zapisz');
    await press('Zapisano', 'Plan tygodnia'); expect(stack()).toEqual(['(tabs)', 'plan']); expect(screen.getByText('Inne plany')).toBeTruthy();
  });
  test('„OK” zostawia na generatorze (bez zmiany stosu)', async () => {
    await boot('/plan'); await tap(screen.getByText('Wygeneruj szablony i plan')); await flushAll(1100);
    await tap(screen.getByText('Zapisz szablony i plan')); await flushAll(5); await press('Ustawić nowy plan jako aktywny?', 'Tylko zapisz');
    await press('Zapisano', 'OK'); expect(stack().slice(-2)).toEqual(['plan', 'generator']); expect(screen.getByText('Zapisz szablony i plan')).toBeTruthy();
  });
  test('„Plan z moich szablonów” z Planu tygodnia: „Plan tygodnia” wraca, „OK” zostaje; z ekranu głównego — zastępuje', async () => {
    const setup = () => { withDemoTemplates(); };
    await boot('/plan', setup); await tap(screen.getByText('Plan z moich szablonów')); await flushAll(1100); expect(stack().slice(-2)).toEqual(['plan', 'generator']);
    await tap(screen.getByText('Zapisz plan')); await flushAll(5); await press('Ustawić nowy plan jako aktywny?', 'Ustaw jako aktywny');
    expect(lastAlert('Zapisano')!.buttons!.map(b => b.text)).toEqual(['Plan tygodnia', 'OK']);
    await press('Zapisano', 'OK'); expect(stack().slice(-2)).toEqual(['plan', 'generator']);
    await tap(screen.getByText('Zapisz plan')); await flushAll(5); await press('Ustawić nowy plan jako aktywny?', 'Tylko zapisz');
    await press('Zapisano', 'Plan tygodnia'); expect(plans()).toBe(1); expect(stack()).toEqual(['(tabs)', 'plan']);
    await boot('/', setup); await go('/generator?mode=own'); await flushAll(10);
    await tap(screen.getByText('Zapisz plan')); await flushAll(5); await press('Ustawić nowy plan jako aktywny?', 'Tylko zapisz');
    await press('Zapisano', 'Plan tygodnia'); expect(stack()).toEqual(['(tabs)', 'plan']); expect(plan.savedPlans()).toHaveLength(1);
  });
  test('English: buttons “Show templates”, “Weekly plan”, “OK”', async () => {
    await boot('/plan', () => {}, 'en'); await tap(screen.getByText('Generate templates and plan')); await flushAll(1100);
    await tap(screen.getByText('Save templates and plan')); await flushAll(5); await press('Make the new plan active?', 'Save only');
    expect(lastAlert('Saved')!.buttons!.map(b => b.text)).toEqual(['Show templates', 'Weekly plan', 'OK']);
    await press('Saved', 'Weekly plan'); expect(plans()).toBe(1);
  });
});
