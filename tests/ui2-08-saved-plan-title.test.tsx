/* Audyt kontrolny 1, UI2-08 (NISKA): zapisany, nieaktywny plan (/plan?id=…, B2 A) miał nagłówek „Plan tygodnia”, jak plan aktywny — a zmiany zapisują się
 * od razu. Naprawa (propozycja audytora): tytuł = nazwa planu, a gdy jej brak — „Inny plan”; tytuł idzie za wpisywaną nazwą.
 * Aktywny plan zostaje pod „Plan tygodnia”. Rodzaje: ekran (tytuł nagłówka), scenariusz (zmiana nazwy, pusta nazwa, aktywacja), EN. */
import * as store from '@/lib/store';
import * as plan from '@/lib/plan';
import { fresh, saved, withDemoTemplates } from './helpers';
import { renderApp, flushAll, screen, act, go, type, tap } from './app';

jest.setTimeout(120000);
const boot = async (url: string, fn: () => void = () => {}, locale: 'pl' | 'en' = 'pl') => {
  await fresh(undefined, locale); fn(); await act(async () => { await store.flush(); }); await renderApp({ saved: JSON.parse(JSON.stringify(saved())), locale, url }); await flushAll(10);
};
/** Tytuł nagłówka ekranu na wierzchu stosu. */
const title = () => { const t = screen.UNSAFE_root.findAll((n: { type: unknown }) => n.type === 'RNSScreenStackHeaderConfig').map((n: { props: { title?: string } }) => n.props.title); return t[t.length - 1]; };

describe('UI2-08 — tytuł zapisanego planu', () => {
  test('„+ Nowy plan” → nagłówek z nazwą planu, nie „Plan tygodnia”; idzie za wpisaną nazwą; aktywny plan — „Plan tygodnia”', async () => {
    await boot('/plan', () => { const t = withDemoTemplates(); plan.setWeekDay(0, t[0].id); plan.setPlanName('Siłownia'); });
    expect(title()).toBe('Plan tygodnia');
    await tap(screen.getByText('+ Nowy plan')); await flushAll(1100);
    const p = plan.savedPlans()[0]; expect(p.name).toBeTruthy(); expect(title()).toBe(p.name);
    await type(screen.getByLabelText('Nazwa planu'), 'Wakacje'); await flushAll(5); expect(title()).toBe('Wakacje');
    await type(screen.getByLabelText('Nazwa planu'), ''); await flushAll(5); expect(title()).toBe('Inny plan');
  });
  test('plan bez nazwy otwarty z listy — „Inny plan”', async () => {
    let id = ''; await boot('/', () => { const t = withDemoTemplates(); id = plan.addPlan('', [t[0].id, null, null, null, null, null, null], false); store.getState().savedPlans!.find(x => x.id === id)!.name = ''; store.save(); });
    await go(`/plan?id=${id}`); await flushAll(10); expect(title()).toBe('Inny plan');
  });
  test('English: saved plan title is its name, or “Other plan”', async () => {
    let id = ''; await boot('/', () => { const t = withDemoTemplates(); id = plan.addPlan('Holiday', [t[0].id, null, null, null, null, null, null], false); }, 'en');
    await go(`/plan?id=${id}`); await flushAll(10); expect(title()).toBe('Holiday');
    await type(screen.getByLabelText('Plan name'), ''); await flushAll(5); expect(title()).toBe('Other plan');
  });
});
