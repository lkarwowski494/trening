/*
 * Ekrany: trening zrobiony wcześniej (docs/18 pkt 4, 11.10.2026) i wyłączenie wszystkich planów (pkt 5).
 * Scenariusz 1: niedziela, plan pon. = Upper A → trening Upper A → linijka na ekranie sesji → Kalendarz pon.: „Zrobiony wcześniej”, ✓ w pasku/kalendarzu
 * → „Cofnij” przywraca dzień. Scenariusz 2: lista planów — ikona wypełniona/pusta, okna potwierdzenia, stany VoiceOver, EN.
 * Logika: tests/plan-wczesniej.test.ts. E2E: .maestro (do dopisania po scaleniu).
 */
import * as store from '@/lib/store';
import * as plan from '@/lib/plan';
import { exName, applyLang } from '@/lib/i18n';
import { fresh, saved, withDemoTemplates, ex, pressAlert, addWorkout } from './helpers';
import { renderApp, flushAll, screen, tap, type, go, act } from './app';
import * as timer from '@/lib/timer';

jest.setTimeout(60000);
const S = () => store.getState();
const NOW = new Date(2026, 9, 11, 10); /* niedziela 11.10.2026 */
afterEach(async () => { applyLang('pl'); await timer.stop(); await timer.stopSet(); });
const lastAlert = (title: string) => [...global.__alerts].reverse().find(x => x.title === title);
const press = async (title: string, btn: string) => { const a = lastAlert(title)!; expect(a).toBeTruthy(); await act(async () => { a.buttons!.find(b => b.text === btn)!.onPress?.(); }); await flushAll(5); };
const boot = async (fn: (t: { id: string; name: string }[]) => void, url: string, locale: 'pl' | 'en' = 'pl') => {
  jest.useFakeTimers({ now: NOW }); await fresh(undefined, locale); const t = withDemoTemplates(); fn(t); await act(async () => { await store.flush(); });
  await renderApp({ saved: JSON.parse(JSON.stringify(saved())), locale, url }); jest.setSystemTime(NOW.getTime()); await flushAll(10); return t;
};

describe('trening zrobiony wcześniej — ekrany', () => {
  test('zakończenie treningu → linijka na ekranie sesji → panel dnia i kalendarz → „Cofnij”', async () => {
    const t = await boot(ts => { plan.setWeekDay(0, ts.find(x => x.name === 'Upper A')!.id); plan.setWeekDay(3, ts.find(x => x.name === 'Upper B')!.id); }, '/');
    const up = t.find(x => x.name === 'Upper A')!; const chin = exName(ex('Chin Up'));
    await tap(screen.getByLabelText('Start: Upper A')); await flushAll(10);
    await type(screen.getAllByLabelText('Powtórzenia').find(x => x.props.accessibilityHint === `Seria 1 — ${chin}`)!, '6'); await tap(screen.getByLabelText(`Seria 1 zrobiona — ${chin}`));
    await tap(screen.getAllByText('Zakończ trening i zapisz')[0]); pressAlert('Zakończyć trening?', 'Zakończ'); await flushAll(500);
    const w = S().workouts[0]; expect(S().doneEarly).toEqual({ '2026-10-12': w.id });
    expect(screen.getByText(/^Policzone jako trening z .*12.* — ten dzień jest wolny\.$/)).toBeTruthy();
    /* panel dnia pon. 12.10 */
    await go('/history?day=2026-10-12'); await flushAll(10);
    expect(screen.getByLabelText('Zrobiony wcześniej: Upper A')).toBeTruthy(); expect(screen.getByText('Trening z tego dnia zrobiony wcześniej — dzień wolny.')).toBeTruthy();
    expect(screen.queryByText('Przesuń albo pomiń')).toBeNull(); expect(screen.queryByText('Zaplanowany: Upper A')).toBeNull();
    expect(screen.getByLabelText(/zrobiony wcześniej: Upper A/)).toBeTruthy(); /* etykieta dnia w kalendarzu */
    expect(screen.getByLabelText('Cofnij: Upper A znów zaplanowany na ten dzień').props.accessibilityHint).toBe('Dzień wraca do planu — trening nie liczy się już jako zrobiony.');
    await tap(screen.getByLabelText('Cofnij: Upper A znów zaplanowany na ten dzień')); await flushAll(10);
    expect(S().doneEarly).toBeUndefined(); expect(screen.getByText('Zaplanowany: Upper A')).toBeTruthy(); expect(screen.queryByLabelText('Zrobiony wcześniej: Upper A')).toBeNull();
    expect(up.id).toBe(plan.plannedOn('2026-10-12'));
  });
  test('karta „Dziś” (poniedziałek): tytuł i etykieta dnia w pasku tygodnia „zrobiony wcześniej”', async () => {
    await boot(ts => { const a = ts.find(x => x.name === 'Upper A')!; plan.setWeekDay(0, a.id); const w = addWorkout(new Date(2026, 9, 11, 9).getTime(), [['Back Squat', [{ weight: 100, reps: 5 }]]]); w.templateId = a.id; w.templateName = a.name; store.save(w); plan.markDoneEarly(w); }, '/');
    jest.setSystemTime(new Date(2026, 9, 12, 8).getTime()); await go('/'); await flushAll(1000);
    expect(screen.getByText('Zrobiony wcześniej: Upper A')).toBeTruthy(); expect(screen.getByLabelText(/poniedziałek.*zrobiony wcześniej: Upper A/)).toBeTruthy();
  });
});

describe('lista planów — ikona aktywny/nieaktywny i wyłączenie (pkt 5)', () => {
  const two = (ts: { id: string }[]) => { plan.setWeekDay(0, ts[0].id); plan.setPlanName('Rutyna'); plan.addPlan('Urlop', [ts[1].id, null, null, null, null, null, null], false); };
  test('ikona: aktywny — wypełniona (wartość „aktywny”), pozostałe — puste („nieaktywny”); najwyżej jeden aktywny', async () => {
    await boot(two, '/plan');
    expect(screen.getAllByTestId('plan-toggle-on')).toHaveLength(1); expect(screen.getAllByTestId('plan-toggle-off')).toHaveLength(1);
    const on = screen.getByLabelText('Wyłącz plan: Rutyna'); expect(on.props.accessibilityValue).toEqual({ text: 'aktywny' }); expect(on.props.accessibilityRole).toBe('button');
    const off = screen.getByLabelText('Ustaw jako aktywny: Urlop'); expect(off.props.accessibilityValue).toEqual({ text: 'nieaktywny' });
    expect(off.props.accessibilityHint).toBe('Pyta o potwierdzenie.'); expect(on.props.accessibilityHint).toBe('Kalendarz od dziś będzie pusty.'); expect(screen.getByText('Aktywny plan')).toBeTruthy();
  });
  test('wypełniona → okno „Wyłączyć plan?”; „Anuluj” nic nie zmienia; „Wyłącz” → kalendarz pusty, plan w „Inne plany”, ikona aktywnego znika, obie pozostałe puste', async () => {
    await boot(two, '/plan');
    await tap(screen.getByLabelText('Wyłącz plan: Rutyna')); const a = lastAlert('Wyłączyć plan?')!; expect(a.msg).toContain('Kalendarz od dziś będzie pusty.'); expect(a.buttons!.map(b => b.text)).toEqual(['Anuluj', 'Wyłącz']);
    await press('Wyłączyć plan?', 'Anuluj'); expect(plan.hasPlan()).toBe(true);
    await tap(screen.getByLabelText('Wyłącz plan: Rutyna')); await press('Wyłączyć plan?', 'Wyłącz');
    expect(plan.hasPlan()).toBe(false); expect(plan.savedPlans().map(p => p.name).sort()).toEqual(['Rutyna', 'Urlop']);
    expect(screen.queryAllByTestId('plan-toggle-on')).toHaveLength(0); expect(screen.getAllByTestId('plan-toggle-off')).toHaveLength(2);
    expect(screen.queryByTestId('active-plan-row')).toBeNull();
  });
  test('pusta → okno jak dotąd „Ustawić … jako aktywny plan?”; „Ustaw” zamienia aktywny', async () => {
    await boot(two, '/plan');
    await tap(screen.getByLabelText('Ustaw jako aktywny: Urlop')); expect(lastAlert('Ustawić „Urlop” jako aktywny plan?')).toBeTruthy(); await press('Ustawić „Urlop” jako aktywny plan?', 'Ustaw');
    expect(plan.planName()).toBe('Urlop'); expect(screen.getAllByTestId('plan-toggle-on')).toHaveLength(1); expect(screen.getByLabelText('Wyłącz plan: Urlop')).toBeTruthy(); expect(screen.getByLabelText('Ustaw jako aktywny: Rutyna')).toBeTruthy();
  });
  test('„Inne plany” pełne — wyłączenie pokazuje wyjaśnienie zamiast potwierdzenia', async () => {
    await boot(ts => { plan.setWeekDay(0, ts[0].id); for (let i = 0; i < store.SAVED_PLANS_MAX; i++) plan.addPlan(`P${i}`, [ts[1].id, null, null, null, null, null, null], false); }, '/plan');
    await tap(screen.getByLabelText('Wyłącz plan: Mój plan')); expect(lastAlert('Wyłączyć plan?')).toBeUndefined(); expect(lastAlert('Nie można wyłączyć planu')!.msg).toBe(`W „Inne plany” jest już ${store.SAVED_PLANS_MAX} planów — usuń któryś, by wyłączyć obecny.`); expect(plan.hasPlan()).toBe(true);
  });
  test('EN: etykiety, wartości i okno', async () => {
    await boot(two, '/plan', 'en');
    const on = screen.getByLabelText('Turn off plan: Rutyna'); expect(on.props.accessibilityValue).toEqual({ text: 'active' }); expect(screen.getByLabelText('Make active: Urlop').props.accessibilityValue).toEqual({ text: 'inactive' });
    await tap(on); const a = lastAlert('Turn off the plan?')!; expect(a.msg).toContain('From today the calendar will be empty.');
  });
});
