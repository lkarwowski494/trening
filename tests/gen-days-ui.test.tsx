/*
 * Wybór dni treningowych (decyzja właściciela 09.10.2026 wieczór, wariant B; docs/18) — ekran generatora i „Plan z moich szablonów”
 * (components/DayPicker.tsx). Rodzaje (docs/20): ekran (7 przycisków od poniedziałku, rola i stan dla VoiceOver, pełne nazwy dni, pole dotyku
 * ≥ 44 pt w układzie 7 i 4 + 3), komunikat zakresu, podgląd = wybrane dni, ostrzeżenie o parach, zmiana celu, scenariusz z zapisem i restartem
 * (dane: zapisany plan ma wybrane dni), EN. Logika: tests/gen-days.test.ts; E2E: .maestro/14-generator.yaml, .maestro/18-plan-z-moich-szablonow.yaml.
 */
import { StyleSheet } from 'react-native';
import * as store from '@/lib/store';
import * as plan from '@/lib/plan';
import { generate, genProposal, ownProposal, ownPlan, type GenInput } from '@/lib/generator';
import { DAY_TOUCH, dayCols, daysOk, daysRangeText } from '@/components/DayPicker';
import { applyLang } from '@/lib/i18n';
import { fresh, saved, withDemoTemplates } from './helpers';
import { renderApp, flushAll, screen, tap, act } from './app';

jest.setTimeout(60000);
const NOW = new Date(2026, 9, 8, 9, 0);
const S = () => store.getState();
afterEach(() => { applyLang('pl'); });
const boot = async (url: string, fn: () => void = () => {}, locale: 'pl' | 'en' = 'pl') => {
  jest.useFakeTimers({ now: NOW }); await fresh(undefined, locale); fn();
  await act(async () => { await store.flush(); }); await renderApp({ saved: JSON.parse(JSON.stringify(saved())), locale, url }); jest.setSystemTime(NOW.getTime()); await flushAll(10);
};
const restart = async (url: string) => { await act(async () => { await store.flush(); }); await renderApp({ saved: JSON.parse(JSON.stringify(saved())), url }); jest.setSystemTime(NOW.getTime()); await flushAll(10); };
const lastAlert = (title: string) => [...global.__alerts].reverse().find(x => x.title === title);
const press = async (title: string, btn: string) => { const a = lastAlert(title)!; expect(a).toBeTruthy(); await act(async () => { a.buttons!.find(b => b.text === btn)!.onPress?.(); }); await flushAll(10); };
const day = (d: number) => screen.getByTestId(`day-${d}`);
const checkedDays = () => [0, 1, 2, 3, 4, 5, 6].filter(d => day(d).props.accessibilityState.checked);
const pickDays = async (ds: number[]) => { const cur = checkedDays(); for (let d = 0; d < 7; d++) if (cur.includes(d) !== ds.includes(d)) await tap(day(d)); await flushAll(5); };
const inp = (o: Partial<GenInput> = {}): GenInput => ({ goal: 'hypertrophy', locationId: null, sessions: 3, minutes: 60, ...o });
const wd = (i: number, l = 'pl-PL') => new Date(2024, 0, 1 + i).toLocaleDateString(l, { weekday: 'short' });
const header = (r: ReturnType<typeof generate>, l = 'pl-PL') => r.days.map((ti, i) => (ti == null ? null : `${wd(i, l)} ${r.templates[ti].name}`)).filter(Boolean).join(' · ');
const PL_DAYS = ['poniedziałek', 'wtorek', 'środa', 'czwartek', 'piątek', 'sobota', 'niedziela'];

describe('DayPicker — stałe i pomocnicze', () => {
  test('pole dotyku 44 pt; 7 kolumn tylko gdy każdy przycisk ma ≥ 44 pt, inaczej 4 (320 pt: 292 pt na treść → 4 + 3)', () => {
    expect(DAY_TOUCH).toBe(44); expect(dayCols(292)).toBe(4); expect(dayCols(347)).toBe(7); expect(dayCols(7 * 44 + 6 * 4)).toBe(7); expect(dayCols(7 * 44 + 6 * 4 - 1)).toBe(4);
    for (const w of [292, 347, 400]) { const c = dayCols(w); expect((w - (c - 1) * 4) / c).toBeGreaterThanOrEqual(44); }
  });
  test('daysOk i daysRangeText (zakres i jedna liczba), EN', () => {
    expect([daysOk([], 2, 6), daysOk([0, 1], 2, 6), daysOk([0, 1, 2, 3, 4, 5, 6], 2, 6), daysOk([0, 1, 2, 3, 4, 5], 6, 6)]).toEqual([false, true, false, true]);
    expect(daysRangeText(2, 6)).toBe('Wybierz dni treningowe: od 2 do 6.'); expect(daysRangeText(6, 6)).toBe('Wybierz dni treningowe: 6.');
    applyLang('en'); expect([daysRangeText(3, 6), daysRangeText(6, 6)]).toEqual(['Choose training days: 3 to 6.', 'Choose training days: 6.']);
  });
});

describe('generator: wybór dni', () => {
  test('7 przycisków od poniedziałku: skróty z Intl, pełne nazwy dla VoiceOver, rola switch ze stanem, podpowiedź = pole; zaznaczona propozycja; ≥ 44 pt', async () => {
    await boot('/generator');
    expect(screen.getByText('Dni treningowe w tygodniu')).toBeTruthy(); expect(screen.queryByText('Sesje w tygodniu')).toBeNull();
    for (let d = 0; d < 7; d++) {
      const b = day(d); expect([b.props.accessibilityRole, b.props.accessibilityLabel, b.props.accessibilityHint]).toEqual(['switch', PL_DAYS[d], 'Dni treningowe w tygodniu']);
      expect(screen.getByLabelText(PL_DAYS[d])).toBe(b); expect(screen.getAllByText(wd(d)).length).toBeGreaterThan(0);
      const st = StyleSheet.flatten(typeof b.props.style === 'function' ? b.props.style({ pressed: false }) : b.props.style);
      expect(st.minHeight).toBeGreaterThanOrEqual(44); expect(st.width).toBeGreaterThanOrEqual(44);
    }
    expect(checkedDays()).toEqual(genProposal(inp())); expect(checkedDays()).toEqual([0, 2, 4]);
    expect(screen.queryByTestId('day-picker-range')).toBeNull();
  });
  test('zaznacz / odznacz: podgląd ma dokładnie wybrane dni; liczba dni = sesje (4 → góra/dół); poza zakresem — komunikat, bez podglądu i zapisu', async () => {
    await boot('/generator');
    await tap(day(2)); await flushAll(5); expect(checkedDays()).toEqual([0, 4]);
    expect(screen.getByText(header(generate(inp({ days: [0, 4] }))))).toBeTruthy(); expect(screen.getByText(/^pon\.? FBW [AB] · pt\.? FBW [AB]$/)).toBeTruthy();
    await tap(day(1)); await tap(day(3)); await flushAll(5); expect(checkedDays()).toEqual([0, 1, 3, 4]);
    const r4 = generate(inp({ days: [0, 1, 3, 4] })); expect(screen.getByText(header(r4))).toBeTruthy(); expect(r4.templates.map(x => x.key)).toEqual(['upA', 'loA', 'upB', 'loB']);
    await pickDays([6]); expect(screen.getByText('Wybierz dni treningowe: od 2 do 6.')).toBeTruthy();
    expect(screen.queryByText('Podgląd')).toBeNull(); expect(screen.queryByText('Zapisz szablony i plan')).toBeNull();
    await pickDays([0, 1, 2, 3, 4, 5, 6]); expect(screen.getByText('Wybierz dni treningowe: od 2 do 6.')).toBeTruthy(); expect(screen.queryByText('Zapisz szablony i plan')).toBeNull();
    await tap(day(6)); await flushAll(5); expect(screen.queryByTestId('day-picker-range')).toBeNull(); expect(screen.getByText('Podgląd')).toBeTruthy(); expect(screen.getByText('Zapisz szablony i plan')).toBeTruthy();
    expect(screen.getByText(header(generate(inp({ days: [0, 1, 2, 3, 4, 5] }))))).toBeTruthy();
  });
  test('wybór wymuszający pary — istniejące ostrzeżenie „Dzień po dniu…” z dniami', async () => {
    await boot('/generator', () => { for (const e of S().exercises) if (e.lib) e.muscles = ['klatka']; });
    await pickDays([0, 1]); expect(screen.getByText(/^Dzień po dniu te same główne partie: pon\.?–wt\.?\. Zwykle lepiej z dniem przerwy/)).toBeTruthy();
    await pickDays([0, 3]); expect(screen.queryByText(/^Dzień po dniu te same główne partie/)).toBeNull();
  });
  test('zmiana celu: w zakresie wybór zostaje; redukcja przy 2 dniach — propozycja na 3 (z cardio); czas i miejsce nie zmieniają wyboru', async () => {
    await boot('/generator');
    await pickDays([1, 3, 5, 6]); await tap(screen.getByText('Siła')); await flushAll(5); expect(checkedDays()).toEqual([1, 3, 5, 6]);
    await tap(screen.getByText('45 min')); await tap(screen.getByText('Bez ograniczeń sprzętu')); await flushAll(5); expect(checkedDays()).toEqual([1, 3, 5, 6]);
    await tap(screen.getByText('Redukcja')); await flushAll(5); expect(checkedDays()).toEqual([1, 3, 5, 6]); expect(screen.getByText('Dni treningowe w tygodniu (w tym 1 cardio)')).toBeTruthy();
    await pickDays([1, 3]); expect(screen.getByText('Wybierz dni treningowe: od 3 do 6.')).toBeTruthy(); /* redukcja: od 3 — komunikat przy własnym wyborze */
    await tap(screen.getByText('Masa')); await flushAll(5); expect(checkedDays()).toEqual([1, 3]);
    await tap(screen.getByText('Redukcja')); await flushAll(5); expect(checkedDays()).toEqual(genProposal(inp({ goal: 'cut', sessions: 3, minutes: 45 })));
    expect(screen.getByTestId('gen-cardio')).toBeTruthy();
  });
  test('scenariusz: wybór dni → zapis „Ustaw jako aktywny” → plan ma dokładnie te dni → restart → te same dni; nazwa z liczbą dni', async () => {
    await boot('/generator');
    await pickDays([1, 3, 5, 6]); await tap(screen.getByText('Zapisz szablony i plan')); await flushAll(5); await press('Ustawić nowy plan jako aktywny?', 'Ustaw jako aktywny');
    expect(plan.planName()).toBe('Masa, 4× w tygodniu · Pełna siłownia');
    const days = plan.weekPlanDays(); expect(days.flatMap((x, d) => (x ? [d] : []))).toEqual([1, 3, 5, 6]);
    expect(days.map(id => (id ? S().templates.find(x => x.id === id)!.name : null))).toEqual(generate(inp({ days: [1, 3, 5, 6] })).days.map(ti => (ti == null ? null : generate(inp({ days: [1, 3, 5, 6] })).templates[ti].name)));
    await restart('/plan'); expect(plan.weekPlanDays()).toEqual(days); expect(plan.planName()).toBe('Masa, 4× w tygodniu · Pełna siłownia');
  });
  test('EN: pełne nazwy dni, etykieta, komunikat', async () => {
    await boot('/generator', () => {}, 'en');
    expect(screen.getByText('Training days per week')).toBeTruthy(); expect(day(0).props.accessibilityLabel).toBe('Monday'); expect(day(6).props.accessibilityLabel).toBe('Sunday');
    await pickDays([2]); expect(screen.getByText('Choose training days: 2 to 6.')).toBeTruthy();
    await pickDays([0, 2, 4]); await tap(screen.getByText('Fat loss')); await flushAll(5); expect(screen.getByText('Training days per week (incl. 1 cardio)')).toBeTruthy();
  });
});

describe('„Plan z moich szablonów”: ten sam wybór dni', () => {
  test('propozycja na starcie; własny wybór → podgląd i zapis z tymi dniami; 6 szablonów — komunikat z jedną liczbą', async () => {
    let t: ReturnType<typeof withDemoTemplates> = [];
    await boot('/generator?mode=own', () => { t = withDemoTemplates(); });
    const ids = t.map(x => x.id); expect(checkedDays()).toEqual(ownProposal({ templateIds: ids, sessions: 4 }));
    expect(day(0).props.accessibilityHint).toBe('Dni treningowe w tygodniu');
    await pickDays([0, 2, 3, 5, 6]); const r = ownPlan({ templateIds: ids, sessions: 5, days: [0, 2, 3, 5, 6] })!;
    expect(r.days.flatMap((x, d) => (x ? [d] : []))).toEqual([0, 2, 3, 5, 6]);
    expect(screen.getByText(r.days.map((id, i) => (id ? `${wd(i)} ${S().templates.find(x => x.id === id)!.name}` : null)).filter(Boolean).join(' · '))).toBeTruthy();
    await tap(screen.getByText('Zapisz plan')); await flushAll(5); await press('Ustawić nowy plan jako aktywny?', 'Ustaw jako aktywny');
    expect(plan.weekPlanDays()).toEqual(r.days); expect(plan.planName()).toBe('Moje szablony, 5× w tygodniu');
    await restart('/plan'); expect(plan.weekPlanDays()).toEqual(r.days);
  });
  test('6 szablonów i 5 dni — komunikat „Wybierz dni treningowe: 6.” (zmiana szablonów dopasowuje dni do propozycji)', async () => {
    await boot('/generator?mode=own', () => { const t = withDemoTemplates(); store.dupTemplate(t[0].id); store.dupTemplate(t[2].id); });
    expect(checkedDays()).toHaveLength(6); /* 6 szablonów — propozycja na 6 dni */
    await tap(day(checkedDays()[0])); await flushAll(5); expect(screen.getByText('Wybierz dni treningowe: 6.')).toBeTruthy(); expect(screen.queryByText('Zapisz plan')).toBeNull();
  });
});
