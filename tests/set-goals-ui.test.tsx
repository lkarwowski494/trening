/*
 * Cel serii na partię w tygodniu (Ustawienia) — ekrany (barki i plecy jako całe partie; rozbicie wycofane 12.10.2026) (decyzje właściciela 12.10.2026, docs/research/32).
 * Logika i dane: tests/set-goals.test.ts. Rodzaje (docs/20): ekran (Ustawienia, „Ten tydzień”, Postępy, Progresja), scenariusz (zmiana celu → paski → restart),
 * niezmienniki (kreska każdego wiersza = cel jego partii; miesiąc bez kresek), VoiceOver (etykiety), języki (EN).
 * E2E: .maestro/05 (Postępy — przewinięcie do opisu kreski).
 */
import * as store from '@/lib/store';
import { fresh, saved, addWorkout } from './helpers';
import { renderApp, flushAll, screen, tap, type as typeText, act, openInfo } from './app';
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
  test('sekcja z opisem (automat 10, granice 1–40); lista zwinięta, „Pokaż cele partii” rozwija wiersz dla każdej partii, „Ukryj” zwija', async () => {
    await boot(() => {}, '/more/settings');
    expect(screen.getByText('Cel serii na partię w tygodniu')).toBeTruthy();
    expect(screen.queryByText(/^Kreska w „Ten tydzień”/)).toBeNull(); await openInfo('sets-goal'); /* ⓘ 14.10.2026: opis i źródło (ACSM 2026) pod ⓘ */
    expect(screen.getByText('Kreska w „Ten tydzień” i w Postępach. Automatycznie: 10 serii (stanowisko ACSM 2026). Ręcznie: własna liczba od 1 do 40.')).toBeTruthy();
    expect(goalGroups()).toHaveLength(0); expect(screen.queryByTestId('set-goals')).toBeNull();
    await tap(screen.getByText('Pokaż cele partii')); await flushAll(5);
    expect(goalGroups()).toHaveLength(SET_PARTS.length); expect(screen.getByText('Ukryj cele partii')).toBeTruthy();
    for (const l of ['barki', 'plecy', 'klatka', 'przywodziciele']) expect(screen.getAllByText(l).length).toBeGreaterThan(0);
    for (const l of ['barki — przód', 'barki — bok', 'barki — tył', 'góra pleców', 'najszersze grzbietu', 'prostowniki grzbietu', 'barki — bez rozbicia', 'plecy — bez rozbicia']) expect(screen.queryByText(l)).toBeNull(); /* rozbicie wycofane */
    expect(screen.getAllByLabelText('Automatycznie (10)', { exact: true }).length).toBe(SET_PARTS.length); /* domyślnie wszędzie automat */
    await tap(screen.getByText('Ukryj cele partii')); await flushAll(5); expect(goalGroups()).toHaveLength(0);
  });
  test('Ręcznie → pole z 10; wpis zapisuje tylko odstępstwo; poza 1–40 przycięte; z powrotem Automatycznie kasuje wpis i pole', async () => {
    await boot(() => {}, '/more/settings'); await tap(screen.getByText('Pokaż cele partii')); await flushAll(5);
    const grp = () => grpOf('Cel serii: barki');
    expect(S().settings.weeklySetGoals).toBeUndefined(); expect(screen.queryByTestId('set-goal-barki')).toBeNull();
    await tap(within1(grp(), 'Ręcznie')); await flushAll(5);
    expect(S().settings.weeklySetGoals).toEqual({ barki: 10 }); expect(screen.getByTestId('set-goal-barki').props.value).toBe('10');
    await typeText(screen.getByTestId('set-goal-barki'), '18'); await flushAll(5); expect(S().settings.weeklySetGoals).toEqual({ barki: 18 });
    await typeText(screen.getByTestId('set-goal-barki'), '99'); await flushAll(5); expect(S().settings.weeklySetGoals).toEqual({ barki: 40 });
    await typeText(screen.getByTestId('set-goal-barki'), '0'); await flushAll(5); expect(S().settings.weeklySetGoals).toEqual({ barki: 1 });
    await typeText(screen.getByTestId('set-goal-barki'), ''); await flushAll(5); expect(S().settings.weeklySetGoals).toEqual({ barki: 1 }); /* puste pole nic nie zmienia */
    await tap(within1(grp(), 'Automatycznie (10)')); await flushAll(5);
    expect(S().settings.weeklySetGoals).toBeUndefined(); expect('weeklySetGoals' in S().settings).toBe(false); expect(screen.queryByTestId('set-goal-barki')).toBeNull();
  });
  test('dwie partie niezależnie; restart aplikacji zachowuje cel i pokazuje go w ustawieniach', async () => {
    await boot(() => {}, '/more/settings'); await tap(screen.getByText('Pokaż cele partii')); await flushAll(5);
    await tap(within1(grpOf('Cel serii: klatka'), 'Ręcznie')); await typeText(screen.getByTestId('set-goal-klatka'), '14');
    await tap(within1(grpOf('Cel serii: plecy'), 'Ręcznie')); await typeText(screen.getByTestId('set-goal-plecy'), '8'); await flushAll(5);
    expect(S().settings.weeklySetGoals).toEqual({ klatka: 14, plecy: 8 }); await act(async () => { await store.flush(); });
    await renderApp({ saved: JSON.parse(JSON.stringify(saved())), url: '/more/settings' }); jest.setSystemTime(NOW.getTime()); await flushAll(10);
    await tap(screen.getByText('Pokaż cele partii')); await flushAll(5);
    expect(screen.getByTestId('set-goal-klatka').props.value).toBe('14'); expect(screen.getByTestId('set-goal-plecy').props.value).toBe('8'); expect(screen.queryByTestId('set-goal-biceps')).toBeNull();
  });
  test('English: napisy i nazwy partii', async () => {
    await boot(() => {}, '/more/settings', 'en');
    expect(screen.getByText('Weekly set goal per muscle group')).toBeTruthy();
    await openInfo('sets-goal'); expect(screen.getByText('The line in “This week” and in Progress. Automatic: 10 sets (ACSM 2026 position stand). Manual: your own number from 1 to 40.')).toBeTruthy();
    await tap(screen.getByText('Show muscle group goals')); await flushAll(5);
    expect(grpOf('Set goal: shoulders')).toBeTruthy(); expect(grpOf('Set goal: back')).toBeTruthy();
    expect(screen.getAllByLabelText('Automatic (10)', { exact: true }).length).toBe(SET_PARTS.length);
    await tap(within1(grpOf('Set goal: chest'), 'Manual')); await flushAll(5); expect(S().settings.weeklySetGoals).toEqual({ klatka: 10 });
  });
});

describe('„Ten tydzień” (ekran Trening): paski serii z kreską celu każdej partii', () => {
  test('barki i plecy jako całe partie (bez części); kreska = cel partii (domyślnie 10, ręczny cel jednej partii nie rusza pozostałych); VoiceOver „co najmniej”', async () => {
    await boot(() => { week(); S().settings.weeklySetGoals = { klatka: 20, barki: 4 }; store.save(); });
    const rows = () => screen.UNSAFE_root.findAll((n: { type: unknown; props: { testID?: string } }) => typeof n.type === 'string' && /^prow-sets-/.test(String(n.props.testID))).map((n: { props: { testID?: string } }) => String(n.props.testID).replace('prow-sets-', ''));
    expect(rows()).toEqual(expect.arrayContaining(['klatka', 'barki', 'plecy', 'triceps', 'biceps']));
    for (const x of ['side_delt', 'front_delt', 'rear_delt', 'lats', 'upper_back', 'lower_back']) expect(rows()).not.toContain(x);
    /* oś wspólna: max(cel 20, wartości) = 20 */
    expect(left('pbar-sets-klatka-mark')).toBe('100%'); expect(left('pbar-sets-barki-mark')).toBe('20%'); expect(left('pbar-sets-plecy-mark')).toBe('50%');
    expect(screen.getByTestId('prow-sets-klatka').props.accessibilityLabel).toBe('klatka: 12, cel 20'); /* 12 < 20 — bez „co najmniej” */
    expect(screen.getByTestId('prow-sets-barki').props.accessibilityLabel).toBe('barki: 5 bezpośrednio, 6 pośrednio (serie pomocnicze: 12), cel 4, co najmniej 4'); /* wyciskanie: barki pomocnicze 0,5 × 12 + unoszenie 5; 11 ≥ 4 */
    expect(screen.getByTestId('prow-sets-plecy').props.accessibilityLabel).toBe('plecy: 4, cel 10');
  });
  test('kreska celu automatycznego i objaśnienie: cel, zaplanowane, pół serii z dopiskiem o źródle; bez zdania o rozbiciu', async () => {
    await boot(() => { week(); });
    expect(screen.getByTestId('prow-sets-klatka').props.accessibilityLabel).toBe('klatka: 12, cel 10, co najmniej 10'); expect(left('pbar-sets-klatka-mark')).toBe(`${(100 * 10) / 12}%`); /* oś kończy się na 12 (więcej niż cel 10) */
    expect(screen.getByText(/^Kreska = cel serii na partię w tygodniu: 10 automatycznie albo Twoja liczba z Ustawień\. Zaplanowane — z szablonów na pozostałe dni tygodnia\. Uproszczenie: partia pomocnicza ćwiczenia liczy się za pół serii \(główna 1, pomocnicza 0,5; Pelland i in\. 2026 — jedno źródło\)\.$/)).toBeTruthy();
    expect(screen.queryByText(/rozbite|bez rozbicia/)).toBeNull();
  });
  test('ćwiczenie własne z barkami → wiersz „barki” (ta sama partia co z katalogu)', async () => {
    await boot(() => { const e = store.newExercise('Własne barki'); e.muscles = ['barki']; store.save(); addWorkout(new Date(2026, 9, 6, 18).getTime(), [['Własne barki', sets(3)]]); });
    expect(screen.getByTestId('prow-sets-barki').props.accessibilityLabel).toBe('barki: 3, cel 10');
  });
  test('English', async () => {
    await boot(() => { week(); }, '/', 'en');
    expect(screen.getByTestId('prow-sets-barki').props.accessibilityLabel).toMatch(/^shoulders: .*, at least 10$/); expect(screen.getByTestId('prow-sets-plecy').props.accessibilityLabel).toMatch(/^back: 4, .*10$/); /* nowe teksty (bezpośrednio / pośrednio / cel) czekają na tłumacza — docs/18 13.10.2026 */
    expect(screen.getByText(/^Line = weekly goal of sets per muscle group: 10 automatically, or your own number from Settings\. Planned — from templates for the rest of the week\. Simplification: a secondary muscle group of an exercise counts as half a set \(main 1, secondary 0\.5; Pelland et al\. 2026 — a single source\)\./)).toBeTruthy();
  });
});

describe('Postępy i Progresja: kreski celu i objaśnienie', () => {
  test('Postępy: wiersze per partia z kreską celu partii; jedno zdanie o półserii przy kresce; bez zdania o rozbiciu', async () => {
    await boot(() => { week(); S().settings.weeklySetGoals = { barki: 20 }; store.save(); }, '/progress');
    expect(left('mark-barki')).toBe('100%'); expect(left('mark-klatka')).toBe('50%'); /* oś: max(20, 12) */
    expect(screen.getByLabelText(/^barki: 5 bezpośrednio, 6 pośrednio \(serie pomocnicze: 12\) \(poprz\. 0\), cel 20$/)).toBeTruthy(); expect(screen.getByLabelText(/^klatka: 12 \(poprz\. 0\), cel 10, co najmniej 10$/)).toBeTruthy();
    expect(screen.getByLabelText(/^plecy: 4 \(poprz\. 0\), cel 10$/)).toBeTruthy();
    expect(screen.getByText(/Uproszczenie: partia pomocnicza ćwiczenia liczy się za pół serii \(główna 1, pomocnicza 0,5; Pelland i in\. 2026 — jedno źródło\)\./)).toBeTruthy();
    expect(screen.queryByText(/rozbite|bez rozbicia/)).toBeNull();
    expect(screen.getByText(/^Kreska = cel serii na partię w tygodniu: 10 automatycznie albo Twoja liczba z Ustawień\. Stanowisko ACSM 2026:/)).toBeTruthy();
  });
  test('Progresja: tydzień — paski z kreskami celu partii; miesiąc — bez kresek i bez zdania o kresce', async () => {
    await boot(() => { week(); S().settings.weeklySetGoals = { klatka: 15 }; store.save(); }, '/progression?c=week');
    const P = () => within(screen.getByTestId('progression-screen')); const mark = (id: string) => P().queryByTestId(id, { includeHiddenElements: true });
    expect(mark('pbar-sets-klatka-mark')!.props.style.left).toBe('100%'); expect(mark('pbar-sets-barki-mark')).not.toBeNull(); expect(mark('pbar-sets-plecy-mark')!.props.style.left).toBe(`${(100 * 10) / 15}%`);
    expect(P().getByText(/^Kreska = cel serii na partię w tygodniu: 10 automatycznie albo Twoja liczba z Ustawień\.$/)).toBeTruthy();
    await tap(screen.getByLabelText('Porównanie: Miesiąc')); await flushAll(5);
    expect(mark('pbar-sets-klatka-mark')).toBeNull(); expect(P().queryByText(/^Kreska = /)).toBeNull(); expect(P().queryByText(/rozbite/)).toBeNull();
    expect(P().getByTestId('prow-volume-barki')).toBeTruthy(); expect(P().getByTestId('prow-sets-barki')).toBeTruthy(); expect(P().queryByTestId('prow-sets-side_delt')).toBeNull();
  });
});

/** Przycisk opcji wewnątrz grupy Segmented (etykieta przycisku = tekst opcji). */
function within1(group: ReturnType<typeof screen.getByLabelText>, option: string) { return within(group).getByLabelText(option, { exact: true }); }
