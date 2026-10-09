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
import { applyLang, lang, tIn, LANGS } from '@/lib/i18n';
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
    await pickDays([6]); expect(screen.queryByTestId('day-picker-range')).toBeNull(); /* 1 dzień — dozwolony (09.10.2026): sesja FBW i ostrzeżenie „oneday” */
    expect(screen.getByText(header(generate(inp({ days: [6] }))))).toBeTruthy(); expect(screen.getByText(/^niedz?\.? FBW$/)).toBeTruthy(); expect(screen.getByTestId('gen-fbw')).toBeTruthy();
    expect(screen.getByText(/^Jeden trening w tygodniu też daje postępy, ale zwykle trochę mniejsze/)).toBeTruthy(); expect(screen.getByText(/^Rzadziej niż 2 dni w tygodniu: /)).toBeTruthy();
    await pickDays([]); expect(screen.getByText('Wybierz dni treningowe: od 1 do 6.')).toBeTruthy();
    expect(screen.queryByText('Podgląd')).toBeNull(); expect(screen.queryByText('Zapisz szablony i plan')).toBeNull();
    await pickDays([0, 1, 2, 3, 4, 5, 6]); expect(screen.getByText('Wybierz dni treningowe: od 1 do 6.')).toBeTruthy(); expect(screen.queryByText('Zapisz szablony i plan')).toBeNull();
    await tap(day(6)); await flushAll(5); expect(screen.queryByTestId('day-picker-range')).toBeNull(); expect(screen.getByText('Podgląd')).toBeTruthy(); expect(screen.getByText('Zapisz szablony i plan')).toBeTruthy();
    expect(screen.getByText(header(generate(inp({ days: [0, 1, 2, 3, 4, 5] }))))).toBeTruthy();
  });
  test('wybór wymuszający pary — istniejące ostrzeżenie „Dzień po dniu…” z dniami', async () => {
    await boot('/generator', () => { for (const e of S().exercises) if (e.lib) e.muscles = ['klatka']; });
    await pickDays([0, 1]); expect(screen.getByText(/^Dzień po dniu te same główne partie: pon\.?–wt\.?\. Zwykle lepiej z dniem przerwy/)).toBeTruthy();
    await pickDays([0, 3]); expect(screen.queryByText(/^Dzień po dniu te same główne partie/)).toBeNull();
  });
  test('zmiana celu: w zakresie (1–6 dla każdego celu) wybór zostaje; redukcja przy 2 dniach — bez cardio; 0 dni → propozycja; czas i miejsce nie zmieniają wyboru', async () => {
    await boot('/generator');
    await pickDays([1, 3, 5, 6]); await tap(screen.getByText('Siła')); await flushAll(5); expect(checkedDays()).toEqual([1, 3, 5, 6]);
    await tap(screen.getByText('45 min')); await tap(screen.getByText('Bez ograniczeń sprzętu')); await flushAll(5); expect(checkedDays()).toEqual([1, 3, 5, 6]);
    await tap(screen.getByText('Redukcja')); await flushAll(5); expect(checkedDays()).toEqual([1, 3, 5, 6]); expect(screen.getByText('Dni treningowe w tygodniu (w tym 1 cardio)')).toBeTruthy();
    expect(screen.getByTestId('gen-cardio')).toBeTruthy();
    await pickDays([1, 3]); expect(screen.queryByTestId('day-picker-range')).toBeNull(); expect(screen.getByText('Dni treningowe w tygodniu')).toBeTruthy(); expect(screen.queryByTestId('gen-cardio')).toBeNull(); /* opcja A */
    await tap(screen.getByText('Masa')); await flushAll(5); expect(checkedDays()).toEqual([1, 3]);
    await tap(screen.getByText('Redukcja')); await flushAll(5); expect(checkedDays()).toEqual([1, 3]);
    await pickDays([]); await tap(screen.getByText('Siła')); await flushAll(5); expect(checkedDays()).toEqual(genProposal(inp({ goal: 'strength', sessions: 1, minutes: 45 }))); /* 0 dni — poza zakresem: propozycja dla najbliższej dozwolonej (1) */
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
    await pickDays([]); expect(screen.getByText('Choose training days: 1 to 6.')).toBeTruthy();
    await pickDays([2]); expect(screen.getByText(/^One workout a week still brings progress/)).toBeTruthy(); expect(screen.getByTestId('gen-fbw')).toBeTruthy();
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

/* 1 dzień w tygodniu (09.10.2026, docs/research/29): każdy język z LANGS na ekranie 320 pt — redukcja z 1 dniem: nazwa sesji FBW w nagłówku podglądu,
 * ostrzeżenie „oneday”, opis celu bez sesji cardio, „Cardio poza planem” (z liczbami WHO) i punkt „Na czym to oparte” w tym języku; bez tych tekstów
 * po polsku (poza pl). Słownik (komplet, parametry, fr/tr) — tests/i18n-locales.test.ts, tests/matrix-i18n.test.tsx. */
describe('1 dzień — każdy język na 320 pt', () => {
  const KEYS = ['Jeden trening w tygodniu też daje postępy, ale zwykle trochę mniejsze niż częstszy trening — głównie dlatego, że w jednej sesji mieści się mniej serii. Przy tej samej liczbie serii w tygodniu różnica w przyroście mięśni znika, a w sile maleje.'];
  test.each([...LANGS])('%s', async l => {
    jest.useFakeTimers({ now: NOW }); await fresh(undefined, l === 'pl' ? 'pl' : 'en'); S().settings.language = l; store.save(); await act(async () => { await store.flush(); });
    await renderApp({ saved: JSON.parse(JSON.stringify(saved())), locale: l === 'pl' ? 'pl' : 'en', url: '/generator', width: 320 }); jest.setSystemTime(NOW.getTime()); await flushAll(10);
    expect(lang()).toBe(l);
    await tap(screen.getByText(tIn(l, 'Redukcja'))); await flushAll(5); await pickDays([2]);
    const all = (screen.toJSON() ? JSON.stringify(screen.toJSON()) : '');
    const goal = tIn(l, 'Redukcja: trening jak na masę (chroni mięśnie); sesja cardio w planie od {k} dni w tygodniu.').replace('{k}', '3');
    const out = tIn(l, 'Cardio poza planem: sesja cardio jest w planie od {k} dni w tygodniu, przy mniejszej liczbie wszystkie dni są siłowe. Zalecenie WHO: co najmniej {a}–{b} min umiarkowanego wysiłku tygodniowo (albo {c}–{d} min intensywnego); liczy się też umiarkowany ruch w ciągu dnia, np. szybki marsz, nawet krótki.')
      .replace('{k}', '3').replace('{a}', '150').replace('{b}', '300').replace('{c}', '75').replace('{d}', '150');
    const basis = `• ${tIn(l, 'Cardio: od {k} dni w tygodniu jedna sesja w osobny dzień; przy mniejszej liczbie dni wszystkie są siłowe, żeby cardio nie zabierało dni treningowi siłowemu (każda główna partia co najmniej {n} dni) — konwencja.').replace('{k}', '3').replace('{n}', '2')}`;
    for (const x of [tIn(l, KEYS[0]), goal, out, basis]) expect([l, screen.queryAllByText(x).length]).toEqual([l, 1]);
    expect([l, screen.getByText(new RegExp(` ${tIn(l, 'FBW')}$`)).props.accessibilityRole]).toEqual([l, 'header']); expect(screen.getByTestId('gen-fbw')).toBeTruthy();
    if (l !== 'pl') expect([l, [KEYS[0], 'Cardio poza planem', 'sesja cardio w planie od'].filter(k => all.includes(k))]).toEqual([l, []]);
  });
});
