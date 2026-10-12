/*
 * Ekran główny: nagłówek planu nad kalendarzem i przejście z Planowania do szablonów (docs/22 krok 3 pkt 1–2, problem 3; decyzja właściciela 11.10.2026).
 * „Plan: <nazwa>” i obok „Planowanie” (bez planu: „Bez planu tygodnia” i „Ustaw plan”) → ekran planu; dawny przycisk „Plan tygodnia” na karcie „Dziś”,
 * wiersz „Plan: … Planowanie ›” pod „Ten tydzień”, karta Planowania i lista „Zacznij z szablonu” usunięte jako duplikaty; na ekranie planu „Szablony”.
 * Rodzaje (docs/20): ekran (nagłówek, przyciski, kolejność), scenariusz (przejścia), niezmienniki (brak duplikatów, „Następne” raz), języki (EN), wąski ekran.
 */
import * as store from '@/lib/store';
import * as plan from '@/lib/plan';
import { fresh, saved, addWorkout, withDemoTemplates } from './helpers';
import { renderApp, flushAll, screen, tap, act } from './app';
import { within } from '@testing-library/react-native';
import type { Template } from '@/lib/seed';

jest.setTimeout(60000);
const NOW = new Date(2026, 9, 8, 9, 0); /* czwartek */
const S = () => store.getState();
const boot = async (fn: (t: Template[]) => void = () => {}, url = '/', locale: 'pl' | 'en' = 'pl', width?: number) => {
  jest.useFakeTimers({ now: NOW }); await fresh(undefined, locale); const t = withDemoTemplates(locale); fn(t);
  await act(async () => { await store.flush(); }); await renderApp({ saved: JSON.parse(JSON.stringify(saved())), locale, url, width }); jest.setSystemTime(NOW.getTime()); await flushAll(10); return t;
};
const setPlan = (t: Template[], days: Record<number, number>, name = '') => { jest.setSystemTime(new Date(2026, 9, 5, 6).getTime()); for (const [i, k] of Object.entries(days)) plan.setWeekDay(Number(i), t[k].id); if (name) plan.setPlanName(name); jest.setSystemTime(NOW.getTime()); };
const hist = () => addWorkout(new Date(2026, 9, 6, 18).getTime(), [['Back Squat', [{ weight: 100, reps: 5 }]]], 'Nogi');
type Nav = { routes: { name: string; state?: Nav }[] };
const stack = () => { const { store: rs } = require('expo-router/build/global-state/router-store'); let st: Nav = rs.navigationRef.getRootState();
  while (st.routes.length === 1 && st.routes[0].name === '__root' && st.routes[0].state) st = st.routes[0].state; return st.routes.map(r => r.name); };
const order = (...ids: string[]) => { const all = screen.UNSAFE_root.findAll((n: { type: unknown; props: { testID?: string } }) => typeof n.type === 'string' && ids.includes(n.props.testID as string)).map((n: { props: { testID?: string } }) => n.props.testID as string); return ids.map(id => all.indexOf(id)); };
const labels = () => screen.getAllByRole('button').map(b => b.props.accessibilityLabel as string);

describe('nagłówek planu nad kalendarzem', () => {
  test('z planem: „Plan: nazwa” (nagłówek) i „Planowanie” w jednej karcie nad paskiem tygodnia; stuknięcie → ekran planu', async () => {
    await boot(t => { setPlan(t, { 3: 0, 5: 1 }, 'Góra / Dół'); hist(); });
    const h = within(screen.getByTestId('plan-header')); expect(h.getByText('Plan: Góra / Dół')).toBeTruthy(); expect(h.getByText('Planowanie')).toBeTruthy();
    expect(h.getByText('Plan: Góra / Dół').props.accessibilityRole).toBe('header'); expect(screen.getByLabelText('Planowanie').props.accessibilityHint).toBe('Otwiera plan tygodnia, szablony i generator.');
    const [hd, strip, start] = order('plan-header', 'week-strip', 'start-panel'); expect(hd).toBeGreaterThanOrEqual(0); expect(hd).toBeLessThan(strip); expect(strip).toBeLessThan(start);
    await tap(screen.getByLabelText('Planowanie')); await flushAll(10); expect(stack()).toEqual(['(tabs)', 'plan']); expect(screen.getByDisplayValue('Góra / Dół')).toBeTruthy();
  });
  test('plan bez nazwy: „Plan: Plan tygodnia”', async () => {
    await boot(t => { setPlan(t, { 3: 0 }); hist(); }); expect(within(screen.getByTestId('plan-header')).getByText('Plan: Plan tygodnia')).toBeTruthy();
  });
  test('bez planu (są treningi): „Bez planu tygodnia” i „Ustaw plan” → ekran planu; nagłówek jest stałą zachętą — bez osobnego tekstu i „Ukryj” (11.10.2026)', async () => {
    await boot(() => { hist(); });
    const h = within(screen.getByTestId('plan-header')); expect(h.getByText('Bez planu tygodnia')).toBeTruthy(); expect(h.getByText('Ustaw plan')).toBeTruthy(); expect(screen.queryByLabelText('Planowanie')).toBeNull();
    expect(screen.queryByText('Ukryj')).toBeNull(); expect(screen.queryByLabelText('Ukryj zachętę do planu tygodnia')).toBeNull(); expect(screen.queryByText(/^Ustaw plan tygodnia, by widzieć/)).toBeNull();
    await tap(screen.getByLabelText('Ustaw plan')); await flushAll(10); expect(stack()).toEqual(['(tabs)', 'plan']);
  });
  test('duplikaty usunięte: brak „Plan tygodnia” na karcie, wiersza „Plan: … Planowanie ›”, karty Planowania, listy „Zacznij z szablonu”; „Następne” tylko raz; akcje planowania tylko na ekranie planu', async () => {
    await boot(t => { setPlan(t, { 3: 0, 4: 1, 5: 2 }, 'Trójpodział'); hist(); });
    expect(screen.queryByText('Plan tygodnia')).toBeNull(); expect(screen.queryByTestId('planning-row')).toBeNull(); expect(screen.queryByTestId('planning-card')).toBeNull(); expect(screen.queryByText('Zacznij z szablonu')).toBeNull();
    expect(screen.queryAllByText(/^Następne: /)).toHaveLength(1); expect(screen.queryByText(/ · \d+ dni · następny:/)).toBeNull(); expect(screen.queryAllByText(/^Plan: /)).toHaveLength(1);
    for (const l of ['+ Nowy szablon', 'Plan z moich szablonów', 'Wygeneruj szablony i plan']) expect(labels()).not.toContain(l);
    expect(screen.queryAllByLabelText(/^Start: /)).toHaveLength(0); /* start szablonu tylko przez „Inny trening” */
  });
  test('nowa osoba (bez planu i treningów): bez karty „Dziś”/nagłówka — są „Pierwsze kroki” z „Planowaniem”', async () => {
    await boot(); /* withDemoTemplates dokłada szablony, ale nie trening ani plan */
    expect(screen.queryByTestId('plan-header')).toBeNull(); expect(screen.getByTestId('first-steps')).toBeTruthy(); expect(within(screen.getByTestId('first-steps')).getAllByText('Planowanie')).toHaveLength(1); /* szablony demonstracyjne zaliczają krok 1 — zostaje przycisk kroku 2 */
  });
  test('EN: „Plan: …”, „Planning”, „No weekly plan”, „Set a plan”', async () => {
    await boot(t => { setPlan(t, { 3: 0 }, 'Upper / Lower'); hist(); }, '/', 'en'); expect(within(screen.getByTestId('plan-header')).getByText('Plan: Upper / Lower')).toBeTruthy(); expect(screen.getByLabelText('Planning')).toBeTruthy();
    await boot(() => { hist(); }, '/', 'en'); expect(within(screen.getByTestId('plan-header')).getByText('No weekly plan')).toBeTruthy(); expect(screen.getByLabelText('Set a plan')).toBeTruthy();
  });
  test('320 pt: długa nazwa planu zawija się obok przycisku „Planowanie”', async () => {
    await boot(t => { setPlan(t, { 3: 0 }, 'Bardzo długa nazwa planu na wąskim'); hist(); }, '/', 'pl', 320);
    expect(within(screen.getByTestId('plan-header')).getByText('Plan: Bardzo długa nazwa planu na wąskim')).toBeTruthy(); expect(screen.getByLabelText('Planowanie')).toBeTruthy();
  });
});

describe('Planowanie → szablony (docs/22 problem 3)', () => {
  test('aktywny plan: przycisk „Szablony” zamyka stos i otwiera zakładkę Szablony z listą', async () => {
    const t = await boot(tt => { setPlan(tt, { 3: 0 }); hist(); });
    await tap(screen.getByLabelText('Planowanie')); await flushAll(10); expect(stack()).toEqual(['(tabs)', 'plan']);
    await tap(screen.getByText('Szablony')); await flushAll(10); expect(stack()).toEqual(['(tabs)']); expect(screen.getByText('+ Nowy')).toBeTruthy(); expect(screen.getByText(t[0].name)).toBeTruthy();
  });
  test('rozwinięty dzień: „Szablony ›” obok „+ Nowy szablon” prowadzi do listy; etykieta VoiceOver z dniem', async () => {
    await boot(t => { setPlan(t, { 3: 0 }); hist(); }, '/plan');
    await tap(screen.getAllByLabelText(/^poniedziałek, /)[0]); await flushAll(5); expect(screen.getByLabelText('poniedziałek: + Nowy szablon')).toBeTruthy();
    expect(screen.getByText('Szablony ›')).toBeTruthy(); const b = screen.getByLabelText('poniedziałek: Szablony'); expect(b.props.accessibilityHint).toBe('Otwiera listę szablonów.');
    await tap(b); await flushAll(10); expect(stack()).toEqual(['(tabs)']); expect(screen.getByText('+ Nowy')).toBeTruthy();
  });
  test('zapisany (nieaktywny) plan: „Szablony” też jest; EN: „Templates”', async () => {
    let id = ''; await boot(t => { setPlan(t, { 3: 0 }); hist(); id = plan.newPlan('Zapas')!; }, '/');
    await act(async () => { require('expo-router').router.push(`/plan?id=${id}`); }); await flushAll(10); expect(stack()).toEqual(['(tabs)', 'plan']);
    await tap(screen.getByText('Szablony')); await flushAll(10); expect(stack()).toEqual(['(tabs)']); expect(screen.getByText('+ Nowy')).toBeTruthy();
    await boot(t => { setPlan(t, { 3: 0 }); hist(); }, '/plan', 'en'); expect(screen.getByText('Templates')).toBeTruthy(); await tap(screen.getByText('Templates')); await flushAll(10); expect(screen.getByText('+ New')).toBeTruthy();
  });
});
