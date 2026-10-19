/*
 * Ekran główny: „Ten tydzień” (4 kafelki, stosy planu, sylwetka i serie na partię: wykonane + zaplanowane vs kreska celu) i „Progresja” (kafelki → ekran
 * szczegółów) — docs/22 krok 3 pkt 4–5, decyzja właściciela 11.10.2026 (P8 B). Logika: tests/progress.test.ts. Rodzaje (docs/20): ekran (kafelki, szczegóły,
 * wiersze partii, legenda, sylwetka), scenariusz (stuknięcie kafelka → właściwe porównanie, przełączanie), niezmienniki (najpierw objętość, tylko ten tydzień
 * w „Ten tydzień”, „+?” tylko przy nieznanej objętości, bez Progresji dla nowej osoby), VoiceOver (etykiety), języki (EN), wąski ekran (320 pt).
 */
import * as store from '@/lib/store';
import * as plan from '@/lib/plan';
import { fmtVol } from '@/lib/units';
import { uid, type Template, type TRow, type SetKind } from '@/lib/seed';
import { fresh, saved, ex, addWorkout } from './helpers';
import { renderApp, flushAll, screen, tap, act, go, openInfo } from './app';
import { within } from '@testing-library/react-native';

jest.setTimeout(60000);
const NOW = new Date(2026, 9, 8, 9, 0); /* czwartek; tydzień pon 5 … nd 11 października 2026 */
const S = () => store.getState();
const row = (reps: number | '', weight: number | '', kind: SetKind = 'normal'): TRow => ({ id: uid(), kind, reps, weight, durationSec: '', distanceM: '' });
function tpl(name: string, ...blocks: [string, TRow[]][]): Template {
  const t = store.newTemplate(); t.name = name;
  t.items = blocks.map(([n, rows]) => ({ id: uid(), exerciseId: ex(n).id, sets: rows.length, repMin: null, repMax: null, restSec: null, startWeight: '', targetSec: '', groupId: null, rows }));
  store.save(); return t;
}
const sq = (m: number, d: number, sets: { weight: number; reps: number }[]) => addWorkout(new Date(2026, m, d, 18).getTime(), [['Back Squat', sets]], 'Przysiad');
/** Scenariusz z liczbami: tydzień bieżący (zrobione 1000 + zaplanowane 300, jedna seria bez wartości), poprzedni 1000, dwa tygodnie temu 500; 1–8.10 vs 1–8.09. */
const scenario = () => {
  const a = tpl('A', ['Back Squat', [row(5, 100), row(5, 100)]]); const b = tpl('B', ['Bench Press (sztanga)', [row(5, 60), row('', '')]]);
  jest.setSystemTime(new Date(2026, 9, 5, 6).getTime()); plan.setWeekDay(1, a.id); plan.setWeekDay(5, b.id); jest.setSystemTime(NOW.getTime());
  sq(9, 6, [{ weight: 100, reps: 5 }, { weight: 100, reps: 5 }]).templateId = a.id; /* wt 6.10 — zrobione */
  sq(8, 30, [{ weight: 100, reps: 5 }, { weight: 100, reps: 5 }]); /* poprzedni tydzień */
  sq(8, 23, [{ weight: 100, reps: 5 }]); /* dwa tygodnie temu */
  sq(8, 3, [{ weight: 100, reps: 4 }]); /* 3.09 — w zakresie 1–8 poprzedniego miesiąca */
  store.save(); return { a, b };
};
const boot = async (fn: () => void = () => {}, url = '/', locale: 'pl' | 'en' = 'pl', width?: number) => {
  jest.useFakeTimers({ now: NOW }); await fresh(undefined, locale); fn();
  await act(async () => { await store.flush(); }); await renderApp({ saved: JSON.parse(JSON.stringify(saved())), locale, url, width }); jest.setSystemTime(NOW.getTime()); await flushAll(10);
};
const order = (...ids: string[]) => { const all = screen.UNSAFE_root.findAll((n: { type: unknown; props: { testID?: string } }) => typeof n.type === 'string' && ids.includes(n.props.testID as string)).map((n: { props: { testID?: string } }) => n.props.testID as string); return ids.map(id => all.indexOf(id)); };
const header = () => screen.UNSAFE_root.findAll((n: { type: unknown }) => n.type === 'RNSScreenStackHeaderConfig').map((n: { props: { title?: string } }) => n.props.title);
/* SegBar i legenda są ukryte przed VoiceOver (liczby czyta etykieta wiersza) — szukamy w drzewie, nie w dostępnych elementach */
const find = (id: string) => screen.UNSAFE_root.findAll((n: { type: unknown; props: { testID?: string } }) => typeof n.type === 'string' && n.props.testID === id);
const has = (id: string) => find(id).length > 0;
/* legenda ma własny kontener — „wykonane” jest też podpisem kafelka Progresji */
const legend = (word: string) => find('seg-legend').flatMap((l: { findAll: (f: (n: { type: unknown; props: { children?: unknown } }) => boolean) => unknown[] }) => l.findAll(n => n.type === 'Text' && n.props.children === word)).length;
/* ekran szczegółów leży na stosie nad ekranem głównym (ten zostaje zamontowany pod spodem) — przeglądamy tylko poddrzewo szczegółów */
const prog = () => screen.getByTestId('progression-screen');
const findP = (id: string) => prog().findAll((n: { type: unknown; props: { testID?: string } }) => typeof n.type === 'string' && n.props.testID === id);
const hasP = (id: string) => findP(id).length > 0;
const legendP = (word: string) => prog().findAll((n: { type: unknown; props: { children?: unknown } }) => n.type === 'Text' && n.props.children === word).length;
const orderP = (...ids: string[]) => { const all = prog().findAll((n: { type: unknown; props: { testID?: string } }) => typeof n.type === 'string' && ids.includes(n.props.testID as string)).map((n: { props: { testID?: string } }) => n.props.testID as string); return ids.map(id => all.indexOf(id)); };

describe('„Ten tydzień”: tylko ten tydzień — kafelki, sylwetka, serie na partię', () => {
  test('kolejność: kalendarz → start → Ten tydzień (kafelki, stosy planu, sylwetka i serie) — bez sekcji Progresja (14.10.2026); 4 kafelki z Objętością', async () => {
    await boot(scenario);
    const [tp, sp, wt, ws, wm] = order('today-plan', 'start-panel', 'week-tiles', 'week-stacks', 'week-muscles');
    expect([tp, sp, wt, ws, wm].every(i => i >= 0)).toBe(true); expect(tp).toBeLessThan(sp); expect(sp).toBeLessThan(wt); expect(wt).toBeLessThan(ws); expect(ws).toBeLessThan(wm);
    expect(order('progress-tile-week', 'progress-tile-prevWeek', 'progress-tile-month')).toEqual([-1, -1, -1]); /* sekcja „Progresja” zniknęła z ekranu Trening */
    const tiles = screen.getByTestId('week-tiles'); expect(tiles.props.accessibilityLabel).toBe(`Treningi: 1; Serie: 2; Objętość: ${fmtVol(1000)}; Czas: 1 h`);
    expect(screen.queryAllByText(/^poprz\.: /)).toHaveLength(0); /* 11.10.2026: kafelki bez „poprz.” */
  });
  test('sylwetka ze strażnikiem (14.10.2026): jeden obraz z etykietą stanów, legenda, zdanie o brakach, przycisk do Postępów; dawnych pasków serii i objaśnień nie ma', async () => {
    await boot(scenario);
    const m = screen.getByTestId('guard-map'); expect(m.props.accessibilityLabel).toMatch(/^Ten tydzień wobec poprzedniego: /); expect(m.props.accessibilityLabel).toMatch(/tyle samo — czworogłowe/); expect(m.props.accessibilityLabel).toMatch(/bez porównania — klatka/);
    const box = within(screen.getByTestId('week-muscles')); expect(box.getByText(/^Poniżej celu nawet z planem: .+ i jeszcze \d+\.$/)).toBeTruthy(); expect(box.getByTestId('guard-more')).toBeTruthy();
    for (const id of ['pbar-sets-czworogłowe-done', 'pbar-sets-klatka-planned', 'pbar-sets-klatka-mark', 'prow-sets-klatka', 'pprev-sets-klatka', 'seg-legend', 'muscle-map']) expect([id, has(id)]).toEqual([id, false]);
    expect(screen.queryAllByText(/poprz\./).length).toBe(0); /* 11.10.2026: kafelki „Ten tydzień” bez „poprz.” */
    for (const x of ['Sylwetka: serie w tym tygodniu', 'Serie na partię — wykonane i zaplanowane', 'Kolor względem partii z największą liczbą serii w tym tygodniu (wykonane + zaplanowane). Szare — bez serii.']) expect(screen.queryByText(x)).toBeNull();
  });
  test('legenda stanów zamiast legendy „wykonane / zaplanowane”; bez planu zdanie z dopiskiem „(bez planu tygodnia)”', async () => {
    await boot(scenario); expect(has('guard-legend')).toBe(true); expect(legend('zaplanowane')).toBe(0);
    await boot(() => { sq(9, 6, [{ weight: 100, reps: 5 }]); });
    expect(has('guard-legend')).toBe(true); expect(legend('wykonane')).toBe(0); expect(screen.getByTestId('guard-short').props.children).toMatch(/^Poniżej celu \(bez planu tygodnia\): /);
  });
  test('tydzień bez żadnej serii (trening tylko dawniej): bez sylwetki, „Brak serii w tym tygodniu.”, kafelki zerowe', async () => {
    await boot(() => { sq(8, 1, [{ weight: 100, reps: 5 }]); });
    expect(has('guard-map')).toBe(false); expect(screen.getByText('Brak serii w tym tygodniu.')).toBeTruthy(); expect(screen.getByTestId('week-tiles')).toBeTruthy();
  });
  test('w tym tygodniu jeszcze nic, ale był poprzedni: „Brak serii w tym tygodniu.” (poprzedni tydzień nie wraca do „Ten tydzień”)', async () => {
    await boot(() => { sq(8, 30, [{ weight: 100, reps: 5 }]); });
    expect(screen.getByText('Brak serii w tym tygodniu.')).toBeTruthy(); expect(has('guard-map')).toBe(false); expect(find('pbar-sets-czworogłowe')).toHaveLength(0);
  });
});

describe('Ekran Trening bez sekcji „Progresja” (właściciel 14.10.2026: „jest już w postępach”)', () => {
  test('po treningach: brak nagłówka „Progresja”, brak trzech kart, ale „Ten tydzień” zostaje', async () => {
    await boot(scenario); expect(screen.queryByText('Progresja')).toBeNull(); expect(screen.queryByRole('header', { name: 'Progresja' })).toBeNull();
    for (const k of ['week', 'prevWeek', 'month']) expect(screen.queryByTestId(`progress-tile-${k}`)).toBeNull();
    for (const x of ['Ten tydzień vs poprzedni', 'Poprzedni tydzień vs 2 tyg. temu', 'Miesiąc do miesiąca']) expect(screen.queryByText(x)).toBeNull();
    expect(screen.getByTestId('week-tiles')).toBeTruthy(); expect(screen.getByTestId('week-muscles')).toBeTruthy();
  });
  test('EN: też bez „Progression”', async () => { await boot(scenario, '/', 'en'); expect(screen.queryByText('Progression')).toBeNull(); expect(screen.queryByTestId('progress-tile-week')).toBeNull(); });
});

describe('„Progresja”: kafelki w Postępach', () => {
  test('trzy kafelki z objętością (najpierw), serią i różnicą; tydzień bieżący z „≥” (co najmniej) przy nieznanej objętości; oba w procentach (14.10.2026)', async () => {
    await boot(scenario, '/progress'); expect(screen.getByText('Progresja')).toBeTruthy();
    expect(screen.getByTestId('progress-tile-week').props.accessibilityLabel).toBe(`Ten tydzień vs poprzedni (wykonane + zaplanowane): objętość co najmniej ${fmtVol(1300)} (część zaplanowanych serii nie ma ciężaru), +30%; serie 4, +100%`);
    expect(screen.getByTestId('progress-tile-prevWeek').props.accessibilityLabel).toBe(`Poprzedni tydzień vs 2 tyg. temu (wykonane): objętość ${fmtVol(1000)}, +100%; serie 2, +100%`);
    expect(screen.getByTestId('progress-tile-month').props.accessibilityLabel).toBe(`Miesiąc do miesiąca (dni 1–8 miesiąca vs poprzedni miesiąc): objętość ${fmtVol(1000)}, +150%; serie 2, +100%`);
    expect(order('progress-tile-week', 'progress-tile-prevWeek', 'progress-tile-month')).toEqual([0, 1, 2]);
    expect(screen.getByTestId('progress-tile-week').props.accessibilityHint).toBe('Otwiera szczegóły Progresji.');
    expect(within(screen.getByTestId('progress-tile-week')).getByText(`≥ ${fmtVol(1300)}`)).toBeTruthy(); expect(within(screen.getByTestId('progress-tile-week')).getByText('+100%')).toBeTruthy(); /* na kafelku „≥”, nie „+?”; serie w %, nie w sztukach */
    expect(screen.queryAllByText(/\+\?/)).toHaveLength(0);
  });
  test('bez „≥”, gdy każda zaplanowana seria ma wartości; pusty poprzedni okres — przy objętości i seriach to samo „brak poprzedniego okresu” (nie „—” ani „+N”)', async () => {
    await boot(() => { const b = tpl('B', ['Bench Press (sztanga)', [row(5, 60)]]); jest.setSystemTime(new Date(2026, 9, 5, 6).getTime()); plan.setWeekDay(5, b.id); jest.setSystemTime(NOW.getTime()); sq(9, 6, [{ weight: 100, reps: 5 }]); }, '/progress');
    const l = screen.getByTestId('progress-tile-week').props.accessibilityLabel as string; expect(l).toContain(`objętość ${fmtVol(800)},`); expect(l).not.toContain('co najmniej'); expect(l).not.toContain('—'); expect(l).toBe(`Ten tydzień vs poprzedni (wykonane + zaplanowane): objętość ${fmtVol(800)}, brak poprzedniego okresu; serie 2, brak poprzedniego okresu`); /* poprzedni tydzień pusty */
    expect(within(screen.getByTestId('progress-tile-week')).getAllByText('brak poprzedniego okresu')).toHaveLength(2);
  });
  test('nowa osoba (bez zakończonego treningu): bez Progresji i bez „Ten tydzień”', async () => {
    await boot(); await go('/progress'); await flushAll(10); expect(screen.queryByText('Progresja')).toBeNull(); expect(screen.queryByTestId('progress-tile-week')).toBeNull(); expect(screen.queryByTestId('week-tiles')).toBeNull();
  });
  test('stuknięcie kafelka otwiera ekran „Progresja” z właściwym porównaniem (tydzień / poprzedni tydzień / miesiąc)', async () => {
    for (const [kind, chip, h2] of [['week', 'Ten tydzień', 'Ten tydzień vs poprzedni'], ['prevWeek', 'Poprzedni tydzień', 'Poprzedni tydzień vs 2 tyg. temu'], ['month', 'Miesiąc', 'Miesiąc do miesiąca']] as const) {
      await boot(scenario, '/progress'); await tap(screen.getByTestId(`progress-tile-${kind}`)); await flushAll(10);
      expect(header()).toContain('Progresja'); expect(screen.getByLabelText(`Porównanie: ${chip}`).props.accessibilityState.selected).toBe(true); expect(screen.getByText(h2)).toBeTruthy();
    }
  });
});

describe('„Progresja”: szczegóły', () => {
  test('tydzień: wykonane + zaplanowane vs poprzedni — objętość przed seriami, dwukolorowe słupki z legendą, nota o „≥”; procent z różnicą bezwzględną', async () => {
    await boot(scenario, '/progression?c=week');
    expect(screen.getByTestId('progress-periods')).toBeTruthy(); expect(within(screen.getByTestId('progress-periods')).getByText(/ wobec /)).toBeTruthy();
    expect(screen.getByLabelText(`Objętość: co najmniej ${fmtVol(1300)}, część zaplanowanych serii nie ma ciężaru (${fmtVol(1000)} + ≥ ${fmtVol(300)}), poprzednio ${fmtVol(1000)}, +30% (+${fmtVol(300)})`)).toBeTruthy();
    expect(screen.getByLabelText('Serie robocze: 4 (2 + 2), poprzednio 2, +100% (+2)')).toBeTruthy(); expect(screen.getByLabelText('Treningi: 2 (1 + 1), poprzednio 1, +100%')).toBeTruthy();
    const [v, s] = orderP('prow-volume-czworogłowe', 'prow-sets-czworogłowe'); expect(v).toBeGreaterThanOrEqual(0); expect(v).toBeLessThan(s); /* najpierw objętość, potem serie */
    expect(hasP('total-volume-cur-planned')).toBe(true); expect(hasP('total-volume-cur-done')).toBe(true); expect(hasP('total-sets-prev')).toBe(true);
    expect(hasP('pbar-volume-klatka-planned')).toBe(true); expect(hasP('pbar-volume-czworogłowe-planned')).toBe(false); expect(hasP('pprev-volume-czworogłowe')).toBe(true);
    expect(legendP('zaplanowane')).toBe(1);
    expect(screen.getByTestId('progress-unknown')).toBeTruthy(); expect(within(screen.getByTestId('progress-unknown')).getByText('„≥” — w zaplanowanych szablonach 1 seria nie ma ciężaru ani powtórzeń (i nie ma „Poprzednio”): liczą się do serii, ale nie do objętości.')).toBeTruthy();
    await openInfo('prog-sets'); expect(screen.getByText('Zaplanowane = szablony z planu na pozostałe dni tygodnia, policzone z wartości w szablonie (brakujące — z „Poprzednio”). To rachunek z Twojego planu, nie prognoza. Partia główna liczy 1 serię, pomocnicza 0,5.')).toBeTruthy();
    expect(screen.getByText('Zaznaczone partie, w których objętość jest większa niż w okresie porównawczym; im ciemniej, tym większy wzrost. Szare — bez wzrostu.')).toBeTruthy();
    expect(screen.queryAllByText(/^Ten okres: /, { includeHiddenElements: true })).toHaveLength(2); /* podpisy słupków objętości i serii: „Ten okres: …” / „Poprzedni okres: …” */
  });
  test('pusty poprzedni okres: w szczegółach przy objętości i seriach „brak poprzedniego okresu” (bez różnicy bezwzględnej i bez „—”)', async () => {
    await boot(() => { sq(9, 6, [{ weight: 100, reps: 5 }, { weight: 100, reps: 5 }]); }, '/progression?c=week');
    expect(screen.getByLabelText(`Objętość: ${fmtVol(1000)} (${fmtVol(1000)} + ${fmtVol(0)}), poprzednio ${fmtVol(0)}, brak poprzedniego okresu`)).toBeTruthy(); expect(screen.getByLabelText('Serie robocze: 2 (2 + 0), poprzednio 0, brak poprzedniego okresu')).toBeTruthy();
    expect(screen.getByLabelText('Treningi: 1 (1 + 0), poprzednio 0, brak poprzedniego okresu')).toBeTruthy(); expect(screen.queryAllByLabelText(/poprzednio 0.*, —$/)).toHaveLength(0); expect(screen.queryAllByLabelText(/\(\+\d+/)).toHaveLength(0); /* bez różnicy bezwzględnej przy pustym poprzednim */
  });
  test('sylwetka zaznacza partie z większą objętością (▲ i opis), partia bez wzrostu nie jest zaznaczona', async () => {
    await boot(scenario, '/progression?c=week');
    const m = screen.getByTestId('muscle-map'); expect(m.props.accessibilityLabel).toMatch(/^Partie z większą objętością niż poprzednio: /); expect(m.props.accessibilityLabel).toContain('klatka'); expect(m.props.accessibilityLabel).not.toContain('czworogłowe');
    expect(screen.getByTestId('prow-volume-klatka').props.accessibilityLabel).toContain('więcej niż poprzednio'); expect(screen.getByTestId('prow-volume-czworogłowe').props.accessibilityLabel).not.toContain('więcej niż poprzednio');
    expect(within(screen.getByTestId('prow-volume-klatka')).getByText(/^▲ klatka$/)).toBeTruthy(); expect(screen.getByText('Partie z większą objętością')).toBeTruthy();
  });
  test('przełączanie: poprzedni tydzień (tylko wykonane — bez legendy „zaplanowane”, bez „≥”), miesiąc (te same dni miesiąca)', async () => {
    await boot(scenario, '/progression?c=week'); await tap(screen.getByLabelText('Porównanie: Poprzedni tydzień')); await flushAll(5);
    expect(screen.getByText('Poprzedni tydzień vs 2 tyg. temu')).toBeTruthy(); expect(screen.getByLabelText(`Objętość: ${fmtVol(1000)}, poprzednio ${fmtVol(500)}, +100% (+${fmtVol(500)})`)).toBeTruthy();
    expect(hasP('seg-legend')).toBe(false); expect(hasP('progress-unknown')).toBe(false); expect(hasP('pbar-volume-klatka-planned')).toBe(false);
    await tap(screen.getByLabelText('Porównanie: Miesiąc')); await flushAll(5);
    expect(screen.getByText('Porównanie tych samych dni miesiąca: 1–8.')).toBeTruthy(); expect(screen.getByLabelText(`Objętość: ${fmtVol(1000)}, poprzednio ${fmtVol(400)}, +150% (+${fmtVol(600)})`)).toBeTruthy();
    expect(screen.queryByText(/^Kreska = /)).toBeNull(); expect(hasP('pbar-sets-czworogłowe-mark')).toBe(false); /* miesiąc: kreska tygodniowego celu nie ma sensu */
    await openInfo('prog-sets'); expect(screen.getByText('Objętość = ciężar × powtórzenia × mnożnik ćwiczenia (jak w Postępach); rozgrzewka poza. Partia główna liczy całość, pomocnicza połowę.')).toBeTruthy();
  });
  test('puste okresy: komunikat zamiast tabel; deload: informacja o oznaczeniu tygodnia', async () => {
    await boot(() => { sq(7, 1, [{ weight: 100, reps: 5 }]); store.toggleDeloadWeek(new Date(2026, 8, 28).getTime()); }, '/progression?c=prevWeek');
    expect(screen.getByTestId('progress-empty')).toBeTruthy(); expect(screen.getByText('Brak treningów w tym i poprzednim okresie.')).toBeTruthy(); expect(screen.queryByTestId('muscle-map')).toBeNull();
    await tap(screen.getByLabelText('Porównanie: Ten tydzień')); await flushAll(5); expect(screen.getByText('Poprzedni tydzień jest oznaczony jako deload.')).toBeTruthy();
    await act(async () => { store.toggleDeloadWeek(new Date(2026, 9, 5).getTime()); }); await flushAll(5); expect(screen.getByText('Ten tydzień jest oznaczony jako deload. Poprzedni tydzień jest oznaczony jako deload.')).toBeTruthy(); /* obie informacje w jednym zdaniu */
  });
  test('nic nie wzrosło (jest tylko poprzedni tydzień): opis sylwetki „Żadna partia…”, wiersze partii z poprzednim; ćwiczenie bez partii — „Brak serii w tym i poprzednim okresie.”', async () => {
    await boot(() => { sq(8, 30, [{ weight: 100, reps: 5 }]); }, '/progression?c=week');
    expect(screen.getByTestId('muscle-map').props.accessibilityLabel).toBe('Żadna partia nie ma większej objętości niż poprzednio.'); expect(screen.getByTestId('prow-volume-czworogłowe').props.accessibilityLabel).toBe('czworogłowe: Ten tydzień 0, Poprzedni tydzień 500');
    await boot(() => { const e = store.newExercise('Własne bez partii'); e.muscles = []; e.secondaryMuscles = []; store.save(e); addWorkout(new Date(2026, 9, 6, 18).getTime(), [['Własne bez partii', [{ weight: 50, reps: 5 }]]], 'W'); }, '/progression?c=week');
    expect(screen.getAllByText('Brak serii w tym i poprzednim okresie.')).toHaveLength(2); /* objętość i serie per partia */
  });
  test('EN: tytuły, etykiety, legenda i opisy po angielsku', async () => {
    await boot(scenario, '/progression?c=week', 'en');
    expect(header()).toContain('Progression'); expect(screen.getByText('This week vs last week')).toBeTruthy(); expect(screen.getByLabelText('Comparison: This week')).toBeTruthy();
    expect(legendP('planned')).toBe(1); expect(screen.getByLabelText(`Volume: at least ${fmtVol(1300)}, some planned sets have no weight (${fmtVol(1000)} + ≥ ${fmtVol(300)}), before ${fmtVol(1000)}, +30% (+${fmtVol(300)})`)).toBeTruthy();
    await go('/progress'); await flushAll(10); expect(screen.getByText('Progression')).toBeTruthy(); expect(screen.getByTestId('progress-tile-month').props.accessibilityLabel).toContain('days 1–8 of the month vs last month');
  });
  test('regresja (test 0.20): długa wartość („22240 kg (poprz. 5760 kg) +286% (+16480 kg)”) nie łamie etykiety „Objętość” w środku słowa — etykieta się nie kurczy, wartość zawija się pod spodem', async () => {
    await boot(() => { sq(8, 30, [{ weight: 160, reps: 36 }]); sq(9, 6, [{ weight: 160, reps: 139 }]); }, '/progression?c=week', 'pl', 320);
    expect(screen.getByLabelText(/^Objętość: 22240 kg .*poprzednio 5760 kg, \+286% \(\+16480 kg\)$/)).toBeTruthy();
    const flat = (st: unknown): Record<string, unknown> => Object.assign({}, ...[st].flat(9).filter(Boolean)) as Record<string, unknown>;
    for (const id of ['volume', 'sets', 'workouts']) {
      const r = flat((findP(`psum-${id}`)[0] as unknown as { props: { style: unknown } }).props.style); const l = flat((findP(`psum-${id}-label`)[0] as unknown as { props: { style: unknown } }).props.style); const v = flat((findP(`psum-${id}-value`)[0] as unknown as { props: { style: unknown } }).props.style);
      expect([id, r.flexWrap, l.flexShrink, v.flexShrink, v.flexGrow]).toEqual([id, 'wrap', 0, 1, 1]); /* etykieta nigdy nie kurczy się poniżej własnej szerokości; wartość ma resztę wiersza albo nową linię */
      expect([id, l.maxWidth]).toEqual([id, '100%']); /* bardzo długie tłumaczenie etykiety zawija się po słowach w całej szerokości, nie wychodzi poza ekran */
    }
    expect((findP('psum-volume-label')[0] as unknown as { props: { children: unknown } }).props.children).toBe('Objętość');
  });
  test('320 pt: ekran główny (kafelki, sylwetka, słupki) i szczegóły renderują się bez wyjątków przy długich tłumaczeniach', async () => {
    await boot(scenario, '/', 'en', 320); expect(screen.getByTestId('week-muscles')).toBeTruthy(); expect(screen.queryByTestId('progress-tile-week')).toBeNull();
    await boot(scenario, '/progress', 'en', 320); expect(screen.getByTestId('progress-tile-week')).toBeTruthy();
    await tap(screen.getByTestId('progress-tile-week')); await flushAll(10); expect(screen.getByTestId('muscle-map')).toBeTruthy(); expect(hasP('total-volume')).toBe(true);
    await boot(scenario, '/progression?c=month', 'pl', 320); expect(screen.getByText('Porównanie tych samych dni miesiąca: 1–8.')).toBeTruthy();
  });
});
