/* M3 p4, ZM-03 (docs/design/to-be.md, wz. 14): generator bez przełącznika trybu; „Zapisz szablony i plan” bez okien, gdy nie ma aktywnego planu —
 * plan staje się aktywny bez pytania, przejście do Planowania z jednym zdaniem „Plan „{name}” jest teraz aktywny.” (bez okna „Zapisano”);
 * gdy aktywny plan jest — pytanie o zastąpienie zostaje (okna „Ustawić nowy plan jako aktywny?” i „Zapisano” bez zmian). „Plan z moich szablonów”
 * to osobne wejście (/generator?mode=own z Planowania), bez przełącznika w generatorze; ten sam zapis co generator. Zgoda na przypomnienie:
 * components/PlanReminderSync pyta przy pierwszym zaplanowanym dniu (jedno okno systemowe, bez własnego okna generatora).
 * Rodzaje: ekran, scenariusz (stos nawigacji), macierz (z planem / bez planu × generator / własne szablony), języki (en), regresja (zdanie tylko raz). */
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
const titles = () => global.__alerts.map(a => a.title);
const lastAlert = (title: string) => [...global.__alerts].reverse().find(x => x.title === title);
const press = async (title: string, btn: string) => { const a = lastAlert(title)!; expect(a).toBeTruthy(); await act(async () => { a.buttons!.find(b => b.text === btn)!.onPress?.(); }); await flushAll(10); };
type Nav = { routes: { name: string; state?: Nav }[] };
const stack = () => { const { store: rs } = require('expo-router/build/global-state/router-store'); let st: Nav = rs.navigationRef.getRootState();
  while (st.routes.length === 1 && st.routes[0].name === '__root' && st.routes[0].state) st = st.routes[0].state; return st.routes.map(r => r.name); };
const activePlanWithDay = () => { withDemoTemplates(); const tp = store.getState().templates[0]; plan.setWeekDay(0, tp.id); plan.setPlanName('Mój obecny'); };

describe('generator: bez przełącznika trybu (04-studio-projektowe-001)', () => {
  test('na /generator nie ma kontrolki „Nowe szablony i plan” / „Plan z moich szablonów”; Cel, Miejsce, Czas sesji i zapis są', async () => {
    await boot('/generator');
    expect(screen.queryByText('Nowe szablony i plan')).toBeNull(); expect(screen.queryByLabelText('Generator szablonów i planu')).toBeNull();
    expect(screen.getByText('Cel')).toBeTruthy(); expect(screen.getByText('Zapisz szablony i plan')).toBeTruthy();
  });
  test('/generator?mode=own: ekran „Plan z moich szablonów” bez przełącznika', async () => {
    await boot('/generator?mode=own', () => { withDemoTemplates(); });
    expect(screen.queryByText('Nowe szablony i plan')).toBeNull(); expect(screen.getByText('Zapisz plan')).toBeTruthy();
  });
});

describe('ZM-03: zapis bez aktywnego planu — jeden krok, bez okien', () => {
  test('generator: plan aktywny bez pytania, Planowanie ze zdaniem potwierdzenia, bez okna „Zapisano”', async () => {
    await boot('/history'); await tap(screen.getByText('Planowanie')); await flushAll(1100);
    await tap(screen.getByText('Wygeneruj szablony i plan')); await flushAll(1100); expect(stack()).toEqual(['(tabs)', 'plan', 'generator']);
    await tap(screen.getByText('Zapisz szablony i plan')); await flushAll(1100);
    expect(titles()).not.toContain('Ustawić nowy plan jako aktywny?'); expect(titles()).not.toContain('Zapisano');
    expect(plan.hasActivePlan()).toBe(true); expect(stack()).toEqual(['(tabs)', 'plan']);
    expect(screen.getByTestId('plan-notice')).toBeTruthy(); expect(screen.getByText('Plan „Masa, 3× w tygodniu · Pełna siłownia” jest teraz aktywny.')).toBeTruthy();
    expect(store.getState().templates.length).toBeGreaterThan(0);
  });
  test('generator otwarty z ekranu głównego (bez planu pod spodem): Planowanie zastępuje generator, zdanie widoczne', async () => {
    await boot('/'); await go('/generator'); await flushAll(10); expect(stack()).toEqual(['(tabs)', 'generator']);
    await tap(screen.getByText('Zapisz szablony i plan')); await flushAll(1100);
    expect(stack()).toEqual(['(tabs)', 'plan']); expect(screen.getByTestId('plan-notice')).toBeTruthy(); expect(titles()).toEqual([]);
  });
  test('zdanie jest jedno i znika po opuszczeniu ekranu (nie wraca przy kolejnym wejściu)', async () => {
    await boot('/plan'); await tap(screen.getByText('Wygeneruj szablony i plan')); await flushAll(1100);
    await tap(screen.getByText('Zapisz szablony i plan')); await flushAll(1100); expect(screen.getAllByTestId('plan-notice')).toHaveLength(1);
    await tap(screen.getByText('Szablony')); await flushAll(1100); await act(async () => { require('expo-router').router.back(); }); await flushAll(1100);
    expect(screen.queryByTestId('plan-notice')).toBeNull();
  });
  test('„Plan z moich szablonów” bez aktywnego planu: ten sam zapis — aktywny bez pytania, zdanie na ekranie planu', async () => {
    await boot('/plan', () => { withDemoTemplates(); }); await tap(screen.getByText('Plan z moich szablonów')); await flushAll(1100);
    await tap(screen.getByText('Zapisz plan')); await flushAll(1100);
    expect(titles()).toEqual([]); expect(plan.hasActivePlan()).toBe(true); expect(stack()).toEqual(['(tabs)', 'plan']); expect(screen.getByTestId('plan-notice')).toBeTruthy();
  });
  test('zgoda na przypomnienie: dokładnie jedno okno zgody (z PlanReminderSync przy pierwszym zaplanowanym dniu), mimo że okna generatora zniknęły', async () => {
    const g = global as any; await boot('/generator'); g.__notifPerm = { granted: false, canAskAgain: true, status: 'undetermined' }; g.__notifPermReq = { granted: true }; g.__notifPermAsked = 0; global.__alerts.length = 0;
    await tap(screen.getByText('Zapisz szablony i plan')); await flushAll(1100);
    expect(global.__alerts.filter(a => a.title === 'Przypomnienie o treningu z planu')).toHaveLength(1); expect(titles()).not.toContain('Zapisano'); delete g.__notifPerm; delete g.__notifPermReq; delete g.__notifPermAsked;
  });
  test('English: zdanie „Plan “…” is now active.” i brak okien', async () => {
    await boot('/plan', () => {}, 'en'); await tap(screen.getByText('Generate templates and plan')); await flushAll(1100);
    await tap(screen.getByText('Save templates and plan')); await flushAll(1100);
    expect(titles()).toEqual([]); expect(screen.getByTestId('plan-notice').props.children).toMatch(/^The plan “.+” is now active\.$/);
  });
});

describe('ZM-03: aktywny plan jest — pytanie o zastąpienie zostaje', () => {
  test('generator: „Ustawić nowy plan jako aktywny?” z „Tylko zapisz” i „Ustaw jako aktywny”, potem okno „Zapisano” jak dotąd', async () => {
    await boot('/plan', activePlanWithDay); await tap(screen.getByText('Wygeneruj szablony i plan')); await flushAll(1100);
    await tap(screen.getByText('Zapisz szablony i plan')); await flushAll(5);
    expect(lastAlert('Ustawić nowy plan jako aktywny?')!.buttons!.map(b => b.text)).toEqual(['Anuluj', 'Tylko zapisz', 'Ustaw jako aktywny']);
    await press('Ustawić nowy plan jako aktywny?', 'Tylko zapisz'); expect(lastAlert('Zapisano')!.buttons!.map(b => b.text)).toEqual(['Pokaż szablony', 'Planowanie', 'OK']);
    expect(screen.queryByTestId('plan-notice')).toBeNull(); expect(plan.savedPlans()).toHaveLength(1);
  });
  test('„Plan z moich szablonów” z aktywnym planem: to samo pytanie i okno „Zapisano”', async () => {
    await boot('/plan', activePlanWithDay); await tap(screen.getByText('Plan z moich szablonów')); await flushAll(1100);
    await tap(screen.getByText('Zapisz plan')); await flushAll(5);
    await press('Ustawić nowy plan jako aktywny?', 'Ustaw jako aktywny'); expect(lastAlert('Zapisano')!.buttons!.map(b => b.text)).toEqual(['Planowanie', 'OK']);
  });
});
