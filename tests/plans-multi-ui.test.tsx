/*
 * Ekran Plan tygodnia — kilka planów, jeden aktywny (decyzja właściciela 08.10.2026, docs/24 sekcja 1): nazwa planu, „Zapisz kopię jako nowy plan”,
 * „Inne plany” z opisem i podsumowaniem dni, „Ustaw jako aktywny” z potwierdzeniem (liczba zmian dni od dziś), usuwanie gestem, EN.
 * Logika: tests/plans-multi.test.ts. E2E: .maestro/13.
 */
import * as store from '@/lib/store';
import * as plan from '@/lib/plan';
import { applyLang } from '@/lib/i18n';
import { fresh, saved, withDemoTemplates } from './helpers';
import { renderApp, flushAll, screen, tap, act, swipeDelete } from './app';
import { fireEvent } from '@testing-library/react-native';

const NOW = new Date(2026, 9, 8, 9, 0);
const S = () => store.getState();
afterEach(() => { applyLang('pl'); });
const boot = async (fn: (ids: string[]) => void, locale: 'pl' | 'en' = 'pl') => {
  jest.useFakeTimers({ now: NOW }); await fresh(undefined, locale); const t = withDemoTemplates(); fn(t.map(x => x.id));
  await act(async () => { await store.flush(); }); await renderApp({ saved: JSON.parse(JSON.stringify(saved())), locale, url: '/plan' }); jest.setSystemTime(NOW.getTime()); await flushAll(10);
  return t;
};
const lastAlert = (title: string) => [...global.__alerts].reverse().find(x => x.title === title);
const press = async (title: string, btn: string) => { const a = lastAlert(title)!; expect(a).toBeTruthy(); await act(async () => { a.buttons!.find(b => b.text === btn)!.onPress?.(); }); await flushAll(5); };

test('nazwa planu: pole z podpowiedzią „Mój plan”, zapis po edycji', async () => {
  await boot(ids => { plan.setWeekDay(0, ids[0]); });
  const f = screen.getByLabelText('Nazwa planu'); expect(f.props.placeholder).toBe('Mój plan');
  await act(async () => { fireEvent(f, 'endEditing', { nativeEvent: { text: 'Rutyna' } }); }); await flushAll(5); expect(plan.planName()).toBe('Rutyna');
});
test('kopia jako nowy plan → „Inne plany” z opisem i dniami; „Ustaw jako aktywny” z potwierdzeniem; „Anuluj” bez zmian', async () => {
  const t = await boot(ids => { plan.setWeekDay(0, ids[0]); plan.setWeekDay(2, ids[1]); });
  expect(screen.queryByText('Inne plany')).toBeNull();
  await tap(screen.getByText('Zapisz kopię jako nowy plan')); await flushAll(5);
  expect(screen.getByText('Inne plany')).toBeTruthy(); expect(screen.getByText('Obowiązuje jeden plan naraz. Po okresie przejściowym wrócisz do poprzedniego jednym przyciskiem.')).toBeTruthy();
  expect(screen.getByText('Kopia: Mój plan')).toBeTruthy(); expect(screen.getByText(new RegExp(`^pon\\. ${t[0].name} · śr\\. ${t[1].name}$`))).toBeTruthy();
  await tap(screen.getByLabelText(`poniedziałek: ${t[2].name}`)); await flushAll(5); /* aktywny różni się od kopii */
  act(() => { plan.setDayPlan('2026-10-09', t[2].id); }); await flushAll(5);
  await tap(screen.getByLabelText('Ustaw jako aktywny: Kopia: Mój plan')); await flushAll(5);
  expect(lastAlert('Ustawić „Kopia: Mój plan” jako aktywny plan?')!.msg).toBe('Obecny plan zostanie zapisany w „Inne plany”. Zmiany pojedynczych dni od dziś zostaną usunięte: 1.');
  await press('Ustawić „Kopia: Mój plan” jako aktywny plan?', 'Anuluj'); expect(plan.weekPlanDays()[0]).toBe(t[2].id);
  await tap(screen.getByLabelText('Ustaw jako aktywny: Kopia: Mój plan')); await flushAll(5); await press('Ustawić „Kopia: Mój plan” jako aktywny plan?', 'Ustaw');
  expect(plan.weekPlanDays()[0]).toBe(t[0].id); expect(plan.planName()).toBe('Kopia: Mój plan'); expect(S().planOverrides).toBeUndefined();
  expect(screen.getByText('Poprzedni plan')).toBeTruthy(); expect(screen.getByLabelText(`poniedziałek: ${t[0].name}`).props.accessibilityState?.selected ?? true).toBeTruthy();
});
test('bez zmian dni od dziś — krótszy komunikat; usuwanie gestem z potwierdzeniem', async () => {
  await boot(ids => { plan.setWeekDay(0, ids[0]); plan.addPlan('Wakacje', [null, ids[1], null, null, null, null, null], false); });
  await tap(screen.getByLabelText('Ustaw jako aktywny: Wakacje')); await flushAll(5);
  expect(lastAlert('Ustawić „Wakacje” jako aktywny plan?')!.msg).toBe('Obecny plan zostanie zapisany w „Inne plany”.'); await press('Ustawić „Wakacje” jako aktywny plan?', 'Anuluj');
  await swipeDelete('Usuń plan: Wakacje'); expect(lastAlert('Usunąć ten plan?')!.msg).toBe('Wakacje');
  const del = lastAlert('Usunąć ten plan?')!.buttons!.find(b => b.style === 'destructive')!; await act(async () => { del.onPress?.(); }); await flushAll(5);
  expect(S().savedPlans).toBeUndefined(); expect(screen.queryByText('Inne plany')).toBeNull();
});
test('plan bez treningów w podsumowaniu — „bez treningów”', async () => {
  await boot(() => { plan.addPlan('Pusty', [null, null, null, null, null, null, null], false); });
  expect(screen.getByText('bez treningów')).toBeTruthy();
});
test('English', async () => {
  await boot(ids => { plan.setWeekDay(0, ids[0]); plan.addPlan('', [ids[1], null, null, null, null, null, null], false); }, 'en');
  expect(screen.getByText('Other plans')).toBeTruthy(); expect(screen.getByText('Previous plan')).toBeTruthy(); expect(screen.getByText('Save a copy as a new plan')).toBeTruthy();
  await tap(screen.getByLabelText('Make active: Previous plan')); await flushAll(5); expect(lastAlert('Make “Previous plan” the active plan?')).toBeTruthy();
});
test('regresja run 37784561635: wiersz „Previous plan” ma etykietę „tytuł, dni” — selektory E2E (.maestro/13) pasują do całej etykiety', async () => {
  await boot(ids => { plan.setWeekDay(0, ids[0]); }, 'en');
  await tap(screen.getByText('Save a copy as a new plan')); await flushAll(5);
  await tap(screen.getByLabelText('Make active: Copy: My plan')); await flushAll(5); await press('Make “Copy: My plan” the active plan?', 'Set');
  const label: string = screen.getByLabelText(/^Previous plan, /).props.accessibilityLabel; expect(label).toMatch(/^Previous plan, Mon /);
  const fs = require('fs'); const path = require('path');
  const yaml = fs.readFileSync(path.join(__dirname, '../.maestro/13-kalendarz-plan.yaml'), 'utf8') as string;
  const sels = [...yaml.matchAll(/visible:\s*"([^"]*Previous plan[^"]*)"/g)].map(m => m[1]); expect(sels.length).toBeGreaterThan(0);
  for (const s of sels) expect(new RegExp(`^(?:${s})$`).test(label)).toBe(true); /* Maestro: textRegex dopasowuje całą etykietę */
});
