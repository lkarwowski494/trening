/*
 * Serie na partię: odcinek bezpośredni i pośredni na paskach — EKRANY (decyzja właściciela 13.10.2026, wariant A; docs/18, docs/research/32).
 * Wszystkie miejsca z paskami/liczbami serii na partię: „Ten tydzień” (Trening), Postępy (porównanie tygodni), Progresja (tydzień, miesiąc), podsumowanie okresu
 * (mapa mięśni), generator i plan z własnych szablonów. Logika: tests/set-split.test.ts. Rodzaje (docs/20): ekran, scenariusz (trening z wyciskaniem → triceps
 * pośrednio), wygląd (jasny i ciemny motyw, kontrast), a11y (etykiety), języki (EN — teksty czekają na tłumacza), regresja. E2E: .maestro/05.
 */
import * as store from '@/lib/store';
import * as RN from 'react-native';
import { Appearance } from 'react-native';
import { within } from '@testing-library/react-native';
import { light, dark } from '@/lib/theme';
import { contrast, GRAPHIC_MIN } from '@/lib/motif';
import { fresh, saved, addWorkout, withDemoTemplates } from './helpers';
import { renderApp, flushAll, screen, tap, act, openInfo } from './app';

jest.setTimeout(60000);
const NOW = new Date(2026, 9, 8, 9, 0); /* czwartek; tydzień pon 5 … nd 11 października 2026 */
const S = () => store.getState();
const sets = (n: number) => Array.from({ length: n }, () => ({ weight: 50, reps: 8 }));
const bench = () => { addWorkout(new Date(2026, 9, 6, 18).getTime(), [['Bench Press (sztanga)', sets(12)], ['Lateral Raise (hantle)', sets(5)]]); };
const onlyDirect = () => { addWorkout(new Date(2026, 9, 6, 18).getTime(), [['Lateral Raise (hantle)', sets(5)]]); };
const boot = async (fn: () => void = () => {}, url = '/', locale: 'pl' | 'en' = 'pl', theme: 'light' | 'dark' = 'light') => {
  jest.useFakeTimers({ now: NOW }); await fresh(undefined, locale); fn(); S().settings.theme = theme; store.saveCfg();
  await act(async () => { await store.flush(); }); await renderApp({ saved: JSON.parse(JSON.stringify(saved())), locale, url }); jest.setSystemTime(NOW.getTime()); await flushAll(10);
};
/** Ekran Progresja leży na ekranie Trening (stos) — ten sam testID bywa dwa razy; `el` = czy jest, `get` = ostatni (wierzchni ekran). */
const all = (id: string) => screen.queryAllByTestId(id, { includeHiddenElements: true });
const el = (id: string) => (all(id).length ? all(id)[all(id).length - 1] : null);
const get = (id: string) => { const a = all(id); if (!a.length) throw new Error('brak ' + id); return a[a.length - 1]; };
const flat = (s: unknown): Record<string, any> => Object.assign({}, ...(Array.isArray(s) ? s.map(flat) : s ? [s] : []));
const style = (id: string) => flat(get(id).props.style);
let scheme: 'light' | 'dark' = 'light';
beforeEach(() => {
  jest.spyOn(Appearance, 'setColorScheme').mockImplementation(((v: string | null | undefined) => { scheme = v === 'dark' ? 'dark' : 'light'; }) as never);
  jest.spyOn(RN, 'useColorScheme').mockImplementation((() => scheme) as never);
});
afterEach(() => { jest.restoreAllMocks(); scheme = 'light'; jest.useRealTimers(); });

describe('Serie pośrednie: ekran Trening ich nie pokazuje (strażnik progresji, 14.10.2026) — są w rozwinięciu partii w Postępach', () => {
  const open = async (part: string) => { await tap(within(screen.getByTestId(`grow-${part}`)).getByRole('button')); await flushAll(5); return within(screen.getByTestId(`gdet-${part}`)); };
  test('Trening: żadnego podziału bezpośrednio / pośrednio ani dawnych pasków (pbar, legenda odcinków)', async () => {
    await boot(bench); expect(screen.queryByText(/pośrednio/)).toBeNull(); expect(el('seg-legend-indirect')).toBeNull(); expect(el('pbar-sets-triceps-done-indirect')).toBeNull(); expect(el('prow-sets-triceps')).toBeNull();
  });
  test('Postępy, rozwinięcie: triceps tylko pośrednio (0 + 6 z 12 serii po 0,5), klatka tylko bezpośrednio (12), barki oba (5 + 6)', async () => {
    await boot(bench, '/progress');
    expect((await open('triceps')).getByText('Wykonane: 0 + 6 pośrednio (12 serii po 0,5)')).toBeTruthy();
    expect((await open('klatka')).getByText('Wykonane: 12')).toBeTruthy();
    expect((await open('barki')).getByText('Wykonane: 5 + 6 pośrednio (12 serii po 0,5)')).toBeTruthy();
  });
  test('wiersz: „n / cel serii” z sumą ważoną i etykieta ze słowem stanu; bez serii pośrednich — samo „5”', async () => {
    await boot(bench, '/progress'); expect(within(screen.getByTestId('grow-triceps')).getByText('6 / 10 serii')).toBeTruthy(); expect(within(screen.getByTestId('grow-barki')).getByText('11 / 10 serii')).toBeTruthy();
    await boot(onlyDirect, '/progress'); expect((await open('barki')).getByText('Wykonane: 5')).toBeTruthy(); expect(screen.queryByText(/pośrednio/)).toBeNull();
  });
  test('cel z Ustawień w wierszu (klatka 20)', async () => {
    await boot(() => { bench(); S().settings.weeklySetGoals = { klatka: 20 }; store.save(); }, '/progress'); expect(within(screen.getByTestId('grow-klatka')).getByText('12 / 20 serii')).toBeTruthy();
  });
  test('kontrast obrysu odcinka pośredniego z tłem paska (tor) w obu motywach ≥ próg grafiki (odcinki pośrednie dalej na paskach Postępów)', () => {
    for (const [n, th] of [['light', light], ['dark', dark]] as const) { expect([n, contrast(th.accent, th.line) >= GRAPHIC_MIN]).toEqual([n, true]); expect([n, contrast(th.accent, th.surface) >= GRAPHIC_MIN]).toEqual([n, true]); expect([n, contrast(th.band, th.line) >= 1.5]).toEqual([n, true]); }
  });
  test('legenda odcinków („bezpośrednie” / „pośrednie (pomocnicze, po 0,5)”) w Postępach tylko gdy są serie pośrednie', async () => {
    await boot(bench, '/progress'); expect(el('seg-legend-indirect')).not.toBeNull();
    const lg = within(get('seg-legend-indirect')); expect(lg.getByText('bezpośrednie', { includeHiddenElements: true })).toBeTruthy(); expect(lg.getByText('pośrednie (pomocnicze, po 0,5)', { includeHiddenElements: true })).toBeTruthy();
    await boot(onlyDirect, '/progress'); expect(el('seg-legend-indirect')).toBeNull();
  });
  test('English: rozwinięcie po angielsku', async () => {
    await boot(bench, '/progress', 'en'); expect((await open('triceps')).getByText(/^Done: 0 \+ 6 indirect \(12 sets at 0\.5 each\)$/)).toBeTruthy();
  });
});

describe('Postępy: porównanie tygodni (ten vs poprzedni) — odcinki, podpis, etykieta, legenda', () => {
  test('triceps: odcinek pośredni, podpis z celem, etykieta; klatka: tylko bezpośredni; legenda', async () => {
    await boot(bench, '/progress');
    expect(el('cbar-triceps-indirect')).not.toBeNull(); expect(el('cbar-triceps-direct')).toBeNull(); expect(el('cbar-klatka-direct')).not.toBeNull(); expect(el('cbar-klatka-indirect')).toBeNull();
    expect(el('cbar-barki-direct')).not.toBeNull(); expect(el('cbar-barki-indirect')).not.toBeNull();
    expect(screen.getByLabelText('triceps: Ten tydzień 0 bezpośrednio, 6 pośrednio (serie pomocnicze: 12), Poprzedni tydzień 0 (brak danych), cel 10')).toBeTruthy();
    expect(screen.getByLabelText('klatka: Ten tydzień 12, Poprzedni tydzień 0 (brak danych), cel 10, co najmniej 10')).toBeTruthy();
    expect(screen.getByText(/^0 \+ 6 pośrednio \(12 serii\) \/ 10$/)).toBeTruthy(); expect(screen.getByText(/^5 \+ 6 pośrednio \(12 serii\) \/ 10$/)).toBeTruthy();
    expect(el('seg-legend-indirect')).not.toBeNull();
    expect(style('cbar-barki-direct').width).toBe(`${(100 * 5) / 11}%`); expect(style('cbar-barki-indirect').borderColor).toBe(light.accent);
  });
  test('bez serii pośrednich: brak legendy i odcinka pośredniego', async () => {
    await boot(onlyDirect, '/progress'); expect(el('seg-legend-indirect')).toBeNull(); expect(el('cbar-barki-indirect')).toBeNull(); expect(el('cbar-barki-direct')).not.toBeNull();
    expect(screen.getByLabelText('barki: Ten tydzień 5, Poprzedni tydzień 0 (brak danych), cel 10')).toBeTruthy();
  });
  test('podsumowanie okresu: mapa mięśni opisuje obie wartości (kolor wg sumy ważonej)', async () => {
    await boot(bench, '/progress'); const lbl = screen.getAllByTestId('muscle-map').map(n => n.props.accessibilityLabel as string).join(' | ');
    expect(lbl).toContain('klatka 12'); expect(lbl).toContain('triceps 0 bezpośrednio, 6 pośrednio (serie pomocnicze: 12)'); expect(lbl).toContain('barki 5 bezpośrednio, 6 pośrednio (serie pomocnicze: 12)');
  });
});

describe('Progresja: paski serii per partia (tydzień — z celem, miesiąc — bez celu)', () => {
  test('tydzień: odcinki, podpisy z celem, legenda; miesiąc: odcinki i podpis bez celu', async () => {
    await boot(bench, '/progression?c=week');
    expect(el('pbar-sets-triceps-done-indirect')).not.toBeNull(); expect(el('pbar-sets-triceps-done-direct')).toBeNull(); expect(el('seg-legend-indirect')).not.toBeNull();
    expect(within(screen.getByTestId('prow-sets-triceps')).getByText(/^0 \+ 6 pośrednio \(12 serii\) \/ 10$/)).toBeTruthy();
    expect(screen.getByTestId('prow-sets-triceps').props.accessibilityLabel).toMatch(/^triceps: Ten tydzień 0 bezpośrednio, 6 pośrednio \(serie pomocnicze: 12\), Poprzedni tydzień 0 \(brak danych\), cel 10/);
    await boot(bench, '/progression?c=month');
    expect(el('pbar-sets-triceps-done-indirect')).not.toBeNull(); expect(within(get('prow-sets-triceps')).queryByTestId('pbar-sets-triceps-mark', { includeHiddenElements: true })).toBeNull(); /* miesiąc: bez kresek celu */
    expect(within(screen.getByTestId('prow-sets-triceps')).getByText(/^0 \+ 6 pośrednio \(12 serii\)$/)).toBeTruthy();
    expect(screen.getByTestId('prow-sets-triceps').props.accessibilityLabel).toMatch(/^triceps: Ten miesiąc 0 bezpośrednio, 6 pośrednio \(serie pomocnicze: 12\), Poprzedni miesiąc 0 \(brak danych\)/); /* bez celu */
  });
  test('ciemny motyw: ten sam układ i kolory z palety ciemnej', async () => {
    await boot(bench, '/progression?c=week', 'pl', 'dark');
    expect(style('pbar-sets-klatka-done-direct').backgroundColor).toBe(dark.accent); expect(style('pbar-sets-triceps-done-indirect').borderColor).toBe(dark.accent);
  });
});

describe('Generator i plan z moich szablonów: cel z Ustawień per partia, ten sam podpis co paski', () => {
  test('generator (masa): lista serii z podziałem i celem; ostrzeżenie „Poniżej celu” z listą „partia (x/cel)” dla różnych celów; „Ogólny” bez celu', async () => {
    await boot(() => { S().settings.weeklySetGoals = { klatka: 25, plecy: 2 }; store.save(); }, '/generator');
    expect(screen.getByText(/^Serie na partię w tygodniu \(pomocnicza = 0,5 serii — uproszczenie, jedno źródło\): .*klatka [\d,]+( \+ [\d,]+ pośrednio \(\d+ serii?e?\))? \/ 25; .*plecy .* \/ 2;/)).toBeTruthy();
    const w = screen.getByText(/^Poniżej celu serii tygodniowo: /); expect(w.props.children).toMatch(/klatka \([\d,]+\/25\)/); expect(w.props.children).not.toMatch(/plecy \(/);
    await openInfo('gen-goal'); expect(screen.getByText('Masa: serie na partię w tygodniu do celu z Ustawień (automatycznie 10), 8–12 powtórzeń (w domu 12–20), zwykle 0–3 powtórzenia w zapasie.')).toBeTruthy();
    await tap(screen.getByText('Ogólny')); await flushAll(5);
    expect(screen.queryByText(/^Poniżej celu serii/)).toBeNull(); const list = screen.getByText(/^Serie na partię w tygodniu \(pomocnicza/); expect(String(list.props.children)).not.toMatch(/ \/ \d/);
  });
  test('plan z moich szablonów: lista z celem każdej partii i ostrzeżenie z listą', async () => {
    await boot(() => { withDemoTemplates(); S().settings.weeklySetGoals = { klatka: 3, plecy: 30 }; store.save(); }, '/generator?mode=own');
    expect(screen.getByText(/^Serie na partię w tygodniu \(pomocnicza = 0,5 serii — uproszczenie, jedno źródło\): .*klatka .* \/ 3; .*plecy .* \/ 30;/)).toBeTruthy();
    expect(screen.getByText(/^Poniżej celu serii tygodniowo: .*plecy \([\d,]+\/30\)/)).toBeTruthy();
  });
});
