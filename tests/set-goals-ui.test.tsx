/*
 * Cel serii na partię w tygodniu (Ustawienia) i rozbicie barków i pleców w paskach serii — ekrany (decyzje właściciela 12.10.2026, docs/research/32).
 * Logika i dane: tests/set-goals.test.ts. Rodzaje (docs/20): ekran (Ustawienia, „Ten tydzień”, Postępy, Progresja), scenariusz (zmiana celu → paski → restart),
 * niezmienniki (kreska każdego wiersza = cel jego części; miesiąc bez kresek), VoiceOver (etykiety), języki (EN).
 * E2E: .maestro/05 (Postępy — przewinięcie do opisu kreski).
 */
import * as store from '@/lib/store';
import { fresh, saved, addWorkout } from './helpers';
import { renderApp, flushAll, screen, tap, type as typeText, act } from './app';
import { within } from '@testing-library/react-native';
import { SET_PARTS } from '@/lib/setParts';

jest.setTimeout(60000);
const NOW = new Date(2026, 9, 8, 9, 0); /* czwartek; tydzień pon 5 … nd 11 października 2026 */
const S = () => store.getState();
const sets = (n: number) => Array.from({ length: n }, () => ({ weight: 50, reps: 8 }));
const week = () => { addWorkout(new Date(2026, 9, 6, 18).getTime(), [['Bench Press (sztanga)', sets(12)], ['Lateral Raise (hantle)', sets(5)], ['Bent Over Row (sztanga)', sets(4)]]); };
const boot = async (fn: () => void = () => {}, url = '/', locale: 'pl' | 'en' = 'pl') => {
  jest.useFakeTimers({ now: NOW }); await fresh(undefined, locale); fn();
  await act(async () => { await store.flush(); }); await renderApp({ saved: JSON.parse(JSON.stringify(saved())), locale, url }); jest.setSystemTime(NOW.getTime()); await flushAll(10);
};
const goalGroups = () => screen.UNSAFE_root.findAll((n: { type: unknown; props: Record<string, unknown> }) => typeof n.type === 'string' && n.props.accessibilityRole === 'radiogroup' && /^(Cel serii|Set goal): /.test(String(n.props.accessibilityLabel)));
const grpOf = (label: string) => screen.getAllByLabelText(label, { exact: true }).find(n => n.props.accessibilityRole === 'radiogroup')!;
/** Paski mają accessibilityElementsHidden (VoiceOver czyta wiersz) — testID szukamy z ukrytymi. */
const bar = (id: string) => screen.getByTestId(id, { includeHiddenElements: true });
const hasBar = (id: string) => screen.queryByTestId(id, { includeHiddenElements: true }) !== null;
const left = (id: string) => bar(id).props.style.left;
afterEach(() => { jest.useRealTimers(); });

describe('Ustawienia: cel serii na partię', () => {
  test('sekcja z opisem (automat 10, granice 1–40); lista zwinięta, „Pokaż cele partii” rozwija wiersz dla każdej części, „Ukryj” zwija', async () => {
    await boot(() => {}, '/more/settings');
    expect(screen.getByText('Cel serii na partię w tygodniu')).toBeTruthy();
    expect(screen.getByText('Kreska w „Ten tydzień” i w Postępach. Automatycznie: 10 serii (stanowisko ACSM 2026). Ręcznie: własna liczba od 1 do 40.')).toBeTruthy();
    expect(goalGroups()).toHaveLength(0); expect(screen.queryByTestId('set-goals')).toBeNull();
    await tap(screen.getByText('Pokaż cele partii')); await flushAll(5);
    expect(goalGroups()).toHaveLength(SET_PARTS.length); expect(screen.getByText('Ukryj cele partii')).toBeTruthy();
    for (const l of ['barki — przód', 'barki — bok', 'barki — tył', 'góra pleców', 'najszersze grzbietu', 'prostowniki grzbietu', 'barki — bez rozbicia', 'plecy — bez rozbicia', 'klatka', 'przywodziciele']) expect(screen.getAllByText(l).length).toBeGreaterThan(0);
    expect(screen.getAllByLabelText('Automatycznie (10)', { exact: true }).length).toBe(SET_PARTS.length); /* domyślnie wszędzie automat */
    await tap(screen.getByText('Ukryj cele partii')); await flushAll(5); expect(goalGroups()).toHaveLength(0);
  });
  test('Ręcznie → pole z 10; wpis zapisuje tylko odstępstwo; poza 1–40 przycięte; z powrotem Automatycznie kasuje wpis i pole', async () => {
    await boot(() => {}, '/more/settings'); await tap(screen.getByText('Pokaż cele partii')); await flushAll(5);
    const grp = () => grpOf('Cel serii: barki — bok');
    expect(S().settings.weeklySetGoals).toBeUndefined(); expect(screen.queryByTestId('set-goal-side_delt')).toBeNull();
    await tap(within1(grp(), 'Ręcznie')); await flushAll(5);
    expect(S().settings.weeklySetGoals).toEqual({ side_delt: 10 }); expect(screen.getByTestId('set-goal-side_delt').props.value).toBe('10');
    await typeText(screen.getByTestId('set-goal-side_delt'), '18'); await flushAll(5); expect(S().settings.weeklySetGoals).toEqual({ side_delt: 18 });
    await typeText(screen.getByTestId('set-goal-side_delt'), '99'); await flushAll(5); expect(S().settings.weeklySetGoals).toEqual({ side_delt: 40 });
    await typeText(screen.getByTestId('set-goal-side_delt'), '0'); await flushAll(5); expect(S().settings.weeklySetGoals).toEqual({ side_delt: 1 });
    await typeText(screen.getByTestId('set-goal-side_delt'), ''); await flushAll(5); expect(S().settings.weeklySetGoals).toEqual({ side_delt: 1 }); /* puste pole nic nie zmienia */
    await tap(within1(grp(), 'Automatycznie (10)')); await flushAll(5);
    expect(S().settings.weeklySetGoals).toBeUndefined(); expect('weeklySetGoals' in S().settings).toBe(false); expect(screen.queryByTestId('set-goal-side_delt')).toBeNull();
  });
  test('dwie części niezależnie; restart aplikacji zachowuje cel i pokazuje go w ustawieniach', async () => {
    await boot(() => {}, '/more/settings'); await tap(screen.getByText('Pokaż cele partii')); await flushAll(5);
    await tap(within1(grpOf('Cel serii: klatka'), 'Ręcznie')); await typeText(screen.getByTestId('set-goal-klatka'), '14');
    await tap(within1(grpOf('Cel serii: najszersze grzbietu'), 'Ręcznie')); await typeText(screen.getByTestId('set-goal-lats'), '8'); await flushAll(5);
    expect(S().settings.weeklySetGoals).toEqual({ klatka: 14, lats: 8 }); await act(async () => { await store.flush(); });
    await renderApp({ saved: JSON.parse(JSON.stringify(saved())), url: '/more/settings' }); jest.setSystemTime(NOW.getTime()); await flushAll(10);
    await tap(screen.getByText('Pokaż cele partii')); await flushAll(5);
    expect(screen.getByTestId('set-goal-klatka').props.value).toBe('14'); expect(screen.getByTestId('set-goal-lats').props.value).toBe('8'); expect(screen.queryByTestId('set-goal-biceps')).toBeNull();
  });
  test('English: napisy i nazwy części', async () => {
    await boot(() => {}, '/more/settings', 'en');
    expect(screen.getByText('Weekly set goal per muscle group')).toBeTruthy();
    expect(screen.getByText('The line in “This week” and in Progress. Automatic: 10 sets (ACSM 2026 position stand). Manual: your own number from 1 to 40.')).toBeTruthy();
    await tap(screen.getByText('Show muscle group goals')); await flushAll(5);
    expect(grpOf('Set goal: side delts')).toBeTruthy(); expect(grpOf('Set goal: shoulders — no split')).toBeTruthy();
    expect(screen.getAllByLabelText('Automatic (10)', { exact: true }).length).toBe(SET_PARTS.length);
    await tap(within1(grpOf('Set goal: chest'), 'Manual')); await flushAll(5); expect(S().settings.weeklySetGoals).toEqual({ klatka: 10 });
  });
});

describe('„Ten tydzień” (ekran Trening): paski serii z rozbiciem i kreską celu każdej części', () => {
  test('barki i plecy w częściach; kreska = cel części (domyślnie 10, ręczny cel jednej części nie rusza pozostałych); VoiceOver „co najmniej”', async () => {
    await boot(() => { week(); S().settings.weeklySetGoals = { klatka: 20, side_delt: 4 }; store.save(); });
    const rows = () => screen.UNSAFE_root.findAll((n: { type: unknown; props: { testID?: string } }) => typeof n.type === 'string' && /^prow-sets-/.test(String(n.props.testID))).map((n: { props: { testID?: string } }) => String(n.props.testID).replace('prow-sets-', ''));
    expect(rows()).toEqual(expect.arrayContaining(['klatka', 'side_delt', 'front_delt', 'lats', 'upper_back', 'triceps', 'biceps'])); expect(rows()).not.toContain('barki'); expect(rows()).not.toContain('plecy');
    /* oś wspólna: max(cel 20, wartości) = 20 */
    expect(left('pbar-sets-klatka-mark')).toBe('100%'); expect(left('pbar-sets-side_delt-mark')).toBe('20%'); expect(left('pbar-sets-lats-mark')).toBe('50%');
    expect(screen.getByTestId('prow-sets-klatka').props.accessibilityLabel).toBe('klatka: 12'); /* 12 < 20 — bez dopisku */
    expect(screen.getByTestId('prow-sets-side_delt').props.accessibilityLabel).toBe('barki — bok: 5, co najmniej 4'); /* 5 ≥ 4 */
    expect(screen.getByTestId('prow-sets-lats').props.accessibilityLabel).toBe('najszersze grzbietu: 4'); expect(screen.getByTestId('prow-sets-front_delt').props.accessibilityLabel).toBe('barki — przód: 6'); /* wyciskanie: barki pomocnicze 0,5 × 12 */
  });
  test('zmiana celu w danych przesuwa kreskę i etykietę; objaśnienie: automat, pół serii, rozbicie', async () => {
    await boot(() => { week(); });
    expect(screen.getByTestId('prow-sets-klatka').props.accessibilityLabel).toBe('klatka: 12, co najmniej 10'); expect(left('pbar-sets-klatka-mark')).toBe(`${(100 * 10) / 12}%`); /* oś kończy się na 12 (więcej niż cel 10) */
    expect(screen.getByText(/^Kreska = cel serii na partię w tygodniu: 10 automatycznie albo Twoja liczba z Ustawień\. Zaplanowane — z szablonów na pozostałe dni tygodnia\. Uproszczenie: partia pomocnicza ćwiczenia liczy się za pół serii \(główna 1, pomocnicza 0,5; Pelland i in\. 2026 — jedno źródło\)\. Barki i plecy są rozbite/)).toBeTruthy();
  });
  test('ćwiczenie własne z barkami → wiersz „barki — bez rozbicia”', async () => {
    await boot(() => { const e = store.newExercise('Własne barki'); e.muscles = ['barki']; store.save(); addWorkout(new Date(2026, 9, 6, 18).getTime(), [['Własne barki', sets(3)]]); });
    expect(screen.getByTestId('prow-sets-barki').props.accessibilityLabel).toBe('barki — bez rozbicia: 3');
    expect(screen.getAllByText('barki — bez rozbicia').length).toBeGreaterThan(0);
  });
  test('English', async () => {
    await boot(() => { week(); }, '/', 'en');
    expect(screen.getByTestId('prow-sets-side_delt').props.accessibilityLabel).toBe('side delts: 5'); expect(screen.getByTestId('prow-sets-lats').props.accessibilityLabel).toBe('lats: 4');
    expect(screen.getByText(/^Line = weekly goal of sets per muscle group: 10 automatically, or your own number from Settings\. Planned — from templates for the rest of the week\. Simplification: a secondary muscle group of an exercise counts as half a set \(main 1, secondary 0\.5; Pelland et al\. 2026 — a single source\)\./)).toBeTruthy();
  });
});

describe('Postępy i Progresja: kreski celu i objaśnienie', () => {
  test('Postępy: wiersze per część z kreską celu części; jedno zdanie o półserii przy kresce; rozbicie opisane', async () => {
    await boot(() => { week(); S().settings.weeklySetGoals = { side_delt: 20 }; store.save(); }, '/progress');
    expect(left('mark-side_delt')).toBe('100%'); expect(left('mark-klatka')).toBe('50%'); /* oś: max(20, 12) */
    expect(screen.getByLabelText(/^barki — bok: 5 \(poprz\. 0\)$/)).toBeTruthy(); expect(screen.getByLabelText(/^klatka: 12 \(poprz\. 0\), co najmniej 10$/)).toBeTruthy();
    expect(screen.getByLabelText(/^najszersze grzbietu: 4 \(poprz\. 0\)$/)).toBeTruthy(); expect(screen.getByLabelText(/^góra pleców: 4 \(poprz\. 0\)$/)).toBeTruthy();
    expect(screen.getByText(/Uproszczenie: partia pomocnicza ćwiczenia liczy się za pół serii \(główna 1, pomocnicza 0,5; Pelland i in\. 2026 — jedno źródło\)\./)).toBeTruthy();
    expect(screen.getByText(/Barki i plecy są rozbite według katalogu ćwiczeń: przód, bok i tył barków; góra pleców, najszersze i prostowniki\./)).toBeTruthy();
    expect(screen.getByText(/^Kreska = cel serii na partię w tygodniu: 10 automatycznie albo Twoja liczba z Ustawień\. Stanowisko ACSM 2026:/)).toBeTruthy();
  });
  test('Progresja: tydzień — paski z kreskami celu części; miesiąc — bez kresek, z napisem o rozbiciu', async () => {
    await boot(() => { week(); S().settings.weeklySetGoals = { klatka: 15 }; store.save(); }, '/progression?c=week');
    const P = () => within(screen.getByTestId('progression-screen')); const mark = (id: string) => P().queryByTestId(id, { includeHiddenElements: true });
    expect(mark('pbar-sets-klatka-mark')!.props.style.left).toBe('100%'); expect(mark('pbar-sets-side_delt-mark')).not.toBeNull(); expect(mark('pbar-sets-lats-mark')!.props.style.left).toBe(`${(100 * 10) / 15}%`);
    expect(P().getByText(/^Kreska = cel serii na partię w tygodniu: 10 automatycznie albo Twoja liczba z Ustawień\. Barki i plecy są rozbite/)).toBeTruthy();
    await tap(screen.getByLabelText('Porównanie: Miesiąc')); await flushAll(5);
    expect(mark('pbar-sets-klatka-mark')).toBeNull(); expect(P().queryByText(/^Kreska = /)).toBeNull(); expect(P().getByText(/^Barki i plecy są rozbite/)).toBeTruthy();
    expect(P().getByTestId('prow-volume-barki')).toBeTruthy(); expect(P().queryByTestId('prow-volume-side_delt')).toBeNull(); /* objętość: partie zbiorcze, bez rozbicia */
    expect(P().getByTestId('prow-sets-side_delt')).toBeTruthy();
  });
});

/** Przycisk opcji wewnątrz grupy Segmented (etykieta przycisku = tekst opcji). */
function within1(group: ReturnType<typeof screen.getByLabelText>, option: string) { return within(group).getByLabelText(option, { exact: true }); }
