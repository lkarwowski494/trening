/*
 * Ekran Plan tygodnia — kilka planów, jeden aktywny (decyzja właściciela 08.10.2026, docs/24 sekcja 1): nazwa planu, „+ Nowy plan”,
 * „Inne plany” z opisem i podsumowaniem dni, „Ustaw jako aktywny” z potwierdzeniem, usuwanie gestem, EN.
 * Audyt 0.10 (decyzje właściciela 08.10.2026 wieczór): B2 A — „+ Nowy plan” to osobny wpis edytowany przed aktywacją (dawniej „Zapisz kopię jako
 * nowy plan” i odwrócone nazwy po powrocie); plan bez nazwy po wyłączeniu — „Mój plan (<data>)” (dawniej „Poprzedni plan”); B1 — okno aktywacji mówi,
 * ile zmian dni przejdzie z obecnym planem (dawniej „zostaną usunięte”); B4 — nazwa zapisywana przy każdej zmianie pola.
 * Logika: tests/plans-multi.test.ts, tests/audit-0.10-plan.test.ts. E2E: .maestro/13.
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

test('nazwa planu: pole z podpowiedzią „Mój plan”, zapis przy każdej zmianie i porządek przy końcu edycji (B4)', async () => {
  await boot(ids => { plan.setWeekDay(0, ids[0]); });
  const f = screen.getByLabelText('Nazwa planu'); expect(f.props.placeholder).toBe('Mój plan');
  await act(async () => { fireEvent.changeText(f, ' Rutyna '); }); await flushAll(5); expect(plan.planName()).toBe(' Rutyna ');
  await act(async () => { fireEvent(f, 'endEditing', { nativeEvent: { text: ' Rutyna ' } }); }); await flushAll(5); expect(plan.planName()).toBe('Rutyna');
});
test('„+ Nowy plan” → edycja przed aktywacją → „Inne plany” z opisem i dniami; „Ustaw jako aktywny” z potwierdzeniem; „Anuluj” bez zmian', async () => {
  const t = await boot(ids => { plan.setWeekDay(0, ids[0]); plan.setWeekDay(2, ids[1]); });
  expect(screen.queryByText('Inne plany')).toBeNull();
  await tap(screen.getByText('+ Nowy plan')); await flushAll(10);
  expect(screen.getByText('Ten plan jeszcze nie obowiązuje. Zmień nazwę i dni, potem „Ustaw jako aktywny”.')).toBeTruthy();
  await tap(screen.getByLabelText(`poniedziałek, ${t[0].name}`)); await flushAll(5); await tap(screen.getByLabelText(`poniedziałek: ${t[2].name}`)); await flushAll(5); /* nowy plan różni się od aktywnego */
  expect(plan.weekPlanDays()[0]).toBe(t[0].id);
  await act(async () => { const { router } = require('expo-router'); router.back(); }); await flushAll(10);
  expect(screen.getByText('Inne plany')).toBeTruthy(); expect(screen.getByText('Obowiązuje jeden plan naraz. Po okresie przejściowym wrócisz do poprzedniego jednym przyciskiem. Tapnij plan, by zmienić jego nazwę i dni.')).toBeTruthy();
  expect(screen.getByText('Nowy plan')).toBeTruthy(); expect(screen.getByText(new RegExp(`^pon\\. ${t[2].name} · śr\\. ${t[1].name}$`))).toBeTruthy();
  act(() => { plan.setDayPlan('2026-10-09', t[2].id); }); await flushAll(5);
  await tap(screen.getByLabelText('Ustaw jako aktywny: Nowy plan')); await flushAll(5);
  expect(lastAlert('Ustawić „Nowy plan” jako aktywny plan?')!.msg).toBe('Obecny plan zostanie w „Inne plany” razem ze zmianami pojedynczych dni od dziś (1) — wrócą, gdy znów go ustawisz.');
  await press('Ustawić „Nowy plan” jako aktywny plan?', 'Anuluj'); expect(plan.weekPlanDays()[0]).toBe(t[0].id);
  await tap(screen.getByLabelText('Ustaw jako aktywny: Nowy plan')); await flushAll(5); await press('Ustawić „Nowy plan” jako aktywny plan?', 'Ustaw');
  expect(plan.weekPlanDays()[0]).toBe(t[2].id); expect(plan.planName()).toBe('Nowy plan'); expect(S().planOverrides).toBeUndefined();
  expect(screen.getByText('Mój plan (8.10)')).toBeTruthy(); expect(screen.getByLabelText(`poniedziałek, ${t[2].name}`)).toBeTruthy();
});
test('bez zmian dni od dziś — krótszy komunikat; usuwanie gestem z potwierdzeniem', async () => {
  await boot(ids => { plan.setWeekDay(0, ids[0]); plan.addPlan('Wakacje', [null, ids[1], null, null, null, null, null], false); });
  await tap(screen.getByLabelText('Ustaw jako aktywny: Wakacje')); await flushAll(5);
  expect(lastAlert('Ustawić „Wakacje” jako aktywny plan?')!.msg).toBe('Obecny plan zostanie w „Inne plany” — wrócisz do niego jednym przyciskiem.'); await press('Ustawić „Wakacje” jako aktywny plan?', 'Anuluj');
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
  expect(screen.getByText('Other plans')).toBeTruthy(); expect(screen.getByText('New plan')).toBeTruthy(); expect(screen.getByText('+ New plan')).toBeTruthy();
  await tap(screen.getByLabelText('Make active: New plan')); await flushAll(5); expect(lastAlert('Make “New plan” the active plan?')).toBeTruthy();
});
test('regresja run 37784561635: wiersz zapisanego planu ma etykietę „tytuł, dni” — selektory E2E (.maestro/13) pasują do całej etykiety („My plan (…)”, audyt 0.10 B2 A)', async () => {
  await boot(ids => { plan.setWeekDay(0, ids[0]); }, 'en');
  await tap(screen.getByText('+ New plan')); await flushAll(10);
  await tap(screen.getByLabelText('Make active: New plan')); await flushAll(5); await press('Make “New plan” the active plan?', 'Set'); await flushAll(10);
  const label: string = screen.getByLabelText(/^My plan \(/).props.accessibilityLabel; expect(label).toMatch(/^My plan \(.*, Mon /);
  const fs = require('fs'); const path = require('path');
  const yaml = fs.readFileSync(path.join(__dirname, '../.maestro/13-kalendarz-plan.yaml'), 'utf8') as string;
  const sels = [...yaml.matchAll(/visible:\s*"([^"]*My plan[^"]*)"/g)].map(m => m[1].replace(/\\\\/g, "\\")) /* YAML w cudzysłowie: \\ → \ */; expect(sels.length).toBeGreaterThan(0);
  for (const s of sels) expect(new RegExp(`^(?:${s})$`).test(label)).toBe(true); /* Maestro: textRegex dopasowuje całą etykietę */
  const rows = [...yaml.matchAll(/tapOn:\s*"((?:Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday), Rest)"/g)].map(m => m[1]); expect(rows).toHaveLength(7); /* UX-15 A: wiersze dni */
});
