/*
 * Wykresy „okres vs okres” — dwa słupki na partię (uwagi właściciela z testu na telefonie, 14.10.2026): wyżej okres 1 (np. ten tydzień), niżej okres 2
 * (np. poprzedni tydzień), wspólna skala, okresy rozróżnione nie tylko kolorem (podpis z próbką + wzór: okres 2 ma prążki), liczby przy słupkach, VoiceOver
 * „partia: okres 1 X, okres 2 Y”, jasny i ciemny motyw, wąski ekran i duża czcionka, brak danych w okresie 2 = słupek zerowy z opisem.
 * Miejsca: Postępy (serie i objętość per partia — ten tydzień vs poprzedni) i Progresja (szczegóły: tydzień, poprzedni tydzień, miesiąc).
 * Rodzaje (docs/20): ekran, scenariusz, macierz (3 porównania × 2 miary × 2 motywy), wygląd, a11y, języki (EN), wąski ekran. E2E: .maestro/31.
 */
import * as store from '@/lib/store';
import * as RN from 'react-native';
import { Appearance } from 'react-native';
import { within } from '@testing-library/react-native';
import { light, dark } from '@/lib/theme';
import { contrast, GRAPHIC_MIN } from '@/lib/motif';
import { fmtVolShort } from '@/components/ProgressBars';
import { fresh, saved, addWorkout } from './helpers';
import { renderApp, flushAll, screen, act } from './app';

jest.setTimeout(60000);
const NOW = new Date(2026, 9, 8, 9, 0); /* czwartek; tydzień pon 5 … nd 11 października 2026 */
const S = () => store.getState();
const sets = (n: number, weight = 100) => Array.from({ length: n }, () => ({ weight, reps: 8 }));
/** Ten tydzień: wyciskanie 12 serii po 800 kg (100 × 8) (klatka 12; objętość 9600); poprzedni tydzień: 8 serii (klatka 8); 2 tyg. temu i poprzedni miesiąc: po jednej serii. */
const thisWeek = () => { addWorkout(new Date(2026, 9, 6, 18).getTime(), [['Bench Press (sztanga)', sets(12)]]); };
const both = () => { thisWeek(); addWorkout(new Date(2026, 8, 30, 18).getTime(), [['Bench Press (sztanga)', sets(8)]]); addWorkout(new Date(2026, 8, 23, 18).getTime(), [['Bench Press (sztanga)', sets(4)]]); addWorkout(new Date(2026, 8, 3, 18).getTime(), [['Bench Press (sztanga)', sets(2)]]); };
let scheme: 'light' | 'dark' = 'light';
const boot = async (fn: () => void, url: string, locale: 'pl' | 'en' = 'pl', theme: 'light' | 'dark' = 'light', width?: number) => {
  jest.useFakeTimers({ now: NOW }); await fresh(undefined, locale); fn(); S().settings.theme = theme; store.saveCfg(); scheme = theme;
  await act(async () => { await store.flush(); }); await renderApp({ saved: JSON.parse(JSON.stringify(saved())), locale, url, width }); jest.setSystemTime(NOW.getTime()); await flushAll(10);
};
beforeEach(() => {
  jest.spyOn(Appearance, 'setColorScheme').mockImplementation(((v: string | null | undefined) => { scheme = v === 'dark' ? 'dark' : 'light'; }) as never);
  jest.spyOn(RN, 'useColorScheme').mockImplementation((() => scheme) as never);
});
afterEach(() => { jest.restoreAllMocks(); scheme = 'light'; jest.useRealTimers(); });
const all = (id: string) => screen.queryAllByTestId(id, { includeHiddenElements: true });
const get = (id: string) => { const a = all(id); if (!a.length) throw new Error('brak ' + id); return a[a.length - 1]; };
const has = (id: string) => all(id).length > 0;
const flat = (s: unknown): Record<string, any> => Object.assign({}, ...(Array.isArray(s) ? s.map(flat) : s ? [s] : []));
const style = (id: string) => flat(get(id).props.style);
const idx = (...ids: string[]) => { const ns = screen.UNSAFE_root.findAll((n: { type: unknown; props: { testID?: string } }) => typeof n.type === 'string' && typeof n.props.testID === 'string'); return ids.map(i => ns.findIndex((n: { props: { testID?: string } }) => n.props.testID === i)); };
const texts = (id: string) => within(get(id)).queryAllByText(/./, { includeHiddenElements: true }).map(x => [x.props.children].flat().join(''));

describe('Postępy: serie per partia — dwa słupki (ten tydzień wyżej, poprzedni niżej)', () => {
  test('klatka: słupek bieżący nad słupkiem poprzedniego, wspólna skala (oś = max z wartości i celu), kreska celu na osi', async () => {
    await boot(both, '/progress');
    const [a, b] = idx('cbar-klatka', 'cbar-prev-klatka'); expect(a).toBeGreaterThanOrEqual(0); expect(b).toBeGreaterThan(a); /* wyżej okres 1, niżej okres 2 */
    expect(style('cbar-klatka').width).toBe('100%'); expect(style('cbar-prev-klatka-fill').width).toBe('67%'); /* 12 i 8 na jednej osi (max 12; cel 10 mieści się) */
    expect(style('mark-klatka').left).toBe('83%'); /* cel 10 / 12 — ta sama oś */
  });
  test('wspólna skala obejmuje także słupek poprzedniego okresu, gdy jest większy niż bieżący', async () => {
    await boot(() => { addWorkout(new Date(2026, 9, 6, 18).getTime(), [['Bench Press (sztanga)', sets(4)]]); addWorkout(new Date(2026, 8, 30, 18).getTime(), [['Bench Press (sztanga)', sets(16)]]); }, '/progress');
    expect(style('cbar-klatka').width).toBe('25%'); expect(style('cbar-prev-klatka-fill').width).toBe('100%');
  });
  test('podpisy okresów przy każdym słupku (słowami) i liczby: „Ten tydzień 12 … / 10”, „Poprzedni tydzień 8”', async () => {
    await boot(both, '/progress'); const row = within(get('crow-sets-klatka'));
    expect(row.getByText('Ten tydzień')).toBeTruthy(); expect(row.getByText('Poprzedni tydzień')).toBeTruthy();
    expect(row.getByText('12 / 10')).toBeTruthy(); expect(row.getByText('8')).toBeTruthy();
    expect(texts('crow-sets-klatka')).not.toContain('(poprz. 8)'); /* dawny zapis w nawiasie zastąpiony osobnym wierszem okresu 2 */
  });
  test('nie tylko kolor: okres 2 ma prążki (wzór) i własną próbkę w podpisie; okres 1 jest pełny', async () => {
    await boot(both, '/progress');
    expect(has('cbar-prev-klatka-hatch')).toBe(true); expect(has('cbar-klatka-hatch')).toBe(false);
    expect(has('cswatch-1-sets-klatka')).toBe(true); expect(has('cswatch-2-sets-klatka')).toBe(true); expect(has('cswatch-2-sets-klatka-hatch')).toBe(true); expect(has('cswatch-1-sets-klatka-hatch')).toBe(false);
  });
  test('VoiceOver: „partia: okres 1 X, okres 2 Y”, potem cel i „co najmniej”', async () => {
    await boot(both, '/progress');
    expect(get('crow-sets-klatka').props.accessibilityLabel).toBe('klatka: Ten tydzień 12, Poprzedni tydzień 8, cel 10, co najmniej 10');
    expect(get('crow-sets-klatka').props.accessible).toBe(true);
    expect(get('crow-vol-klatka').props.accessibilityLabel).toBe(`klatka: Ten tydzień ${fmtVolShort(9600)}, Poprzedni tydzień ${fmtVolShort(6400)}`);
  });
  test('objętość per partia: ten sam układ (dwa słupki, wspólna skala, liczby, prążki)', async () => {
    await boot(both, '/progress');
    const [a, b] = idx('cvol-klatka', 'cvol-prev-klatka'); expect(a).toBeGreaterThanOrEqual(0); expect(b).toBeGreaterThan(a);
    expect(style('cvol-klatka').width).toBe('100%'); expect(style('cvol-prev-klatka-fill').width).toBe('67%'); expect(has('cvol-prev-klatka-hatch')).toBe(true);
    const row = within(get('crow-vol-klatka')); expect(row.getByText(fmtVolShort(9600))).toBeTruthy(); expect(row.getByText(fmtVolShort(6400))).toBeTruthy();
  });
  test('brak danych w okresie 2: słupek zerowy z opisem (tor i znacznik zera zostają), etykieta czyta „brak danych”', async () => {
    await boot(thisWeek, '/progress'); const row = within(get('crow-sets-klatka'));
    expect(row.getByText('0 (brak danych)')).toBeTruthy(); expect(has('cbar-prev-klatka')).toBe(true); expect(style('cbar-prev-klatka-fill').width).toBe('0%'); expect(has('cbar-prev-klatka-zero')).toBe(true);
    expect(get('crow-sets-klatka').props.accessibilityLabel).toBe('klatka: Ten tydzień 12, Poprzedni tydzień 0 (brak danych), cel 10, co najmniej 10');
    expect(has('cvol-prev-klatka-zero')).toBe(true); expect(within(get('crow-vol-klatka')).getByText('0 (brak danych)')).toBeTruthy();
  });
  test('partia tylko w poprzednim tygodniu: okres 1 = 0 (znacznik zera, bez „brak danych”), okres 2 ma słupek', async () => {
    await boot(() => { thisWeek(); addWorkout(new Date(2026, 8, 30, 18).getTime(), [['Back Squat', sets(6)]]); }, '/progress');
    expect(get('crow-sets-czworogłowe').props.accessibilityLabel).toMatch(/^czworogłowe: Ten tydzień 0, Poprzedni tydzień 6/); expect(has('cbar-czworogłowe-zero')).toBe(true); expect(style('cbar-prev-czworogłowe-fill').width).not.toBe('0%');
  });
  test('English: podpisy okresów i etykieta (nowe teksty czekają na tłumacza)', async () => {
    await boot(both, '/progress', 'en'); expect(get('crow-sets-klatka').props.accessibilityLabel).toBe('chest: This week 12, Last week 8, goal 10, at least 10');
    await boot(thisWeek, '/progress', 'en'); expect(get('crow-sets-klatka').props.accessibilityLabel).toBe('chest: This week 12, Last week 0 (no data), goal 10, at least 10');
  });
  test.each([['light', light], ['dark', dark]] as const)('motyw %s: okres 1 w kolorze akcentu, okres 2 szary z prążkami w kolorze tła; oba widoczne na torze (kontrast grafiki)', async (name, th) => {
    await boot(both, '/progress', 'pl', name);
    expect(style('cbar-klatka-direct').backgroundColor).toBe(th.accent);
    expect(style('cbar-prev-klatka-fill').backgroundColor).toBe(th.muted);
    expect(contrast(th.muted, th.line)).toBeGreaterThanOrEqual(GRAPHIC_MIN); expect(contrast(th.accent, th.line)).toBeGreaterThanOrEqual(GRAPHIC_MIN);
    expect(style('cbar-prev-klatka').backgroundColor).toBe(th.line);
  });
  test('wąski ekran (320 pt) i duża czcionka (2,0): podpisy i liczby zawijają się (bez numberOfLines i przycinania), bez błędów', async () => {
    jest.spyOn(RN.PixelRatio, 'getFontScale').mockReturnValue(2);
    const dims = RN.Dimensions.get; jest.spyOn(RN.Dimensions, 'get').mockImplementation(((k: 'window' | 'screen') => ({ ...dims(k), fontScale: 2 })) as never);
    const errs: string[] = []; jest.spyOn(console, 'error').mockImplementation((...a: unknown[]) => { const m = String(a[0]); if (!/not wrapped in act/.test(m)) errs.push(m.slice(0, 200)); });
    await boot(both, '/progress', 'en', 'light', 320);
    const row = get('crow-sets-klatka'); const tx = row.findAll((n: { type: unknown }) => n.type === 'Text');
    expect(tx.length).toBeGreaterThanOrEqual(5); for (const n of tx) { expect(n.props.numberOfLines).toBeUndefined(); expect(n.props.ellipsizeMode).toBeUndefined(); }
    const line = within(row).getByText('This week').parent!; expect(flat(line.props.style).flexShrink ?? 1).toBe(1); expect(errs).toEqual([]);
  });
});

describe('Progresja (szczegóły): serie i objętość per partia — dwa słupki, podpisy zależne od porównania', () => {
  test.each([
    ['week', 'Ten tydzień', 'Poprzedni tydzień'], ['prevWeek', 'Poprzedni tydzień', '2 tyg. temu'], ['month', 'Ten miesiąc', 'Poprzedni miesiąc'],
  ] as const)('%s: okres 1 nad okresem 2, podpisy „%s” / „%s”, wspólna skala, liczby i etykieta „partia: okres 1 X, okres 2 Y”', async (kind, n1, n2) => {
    await boot(both, `/progression?c=${kind}`); const cur = kind === 'week' ? 12 : kind === 'prevWeek' ? 8 : 12; const prev = kind === 'week' ? 8 : kind === 'prevWeek' ? 4 : 2;
    for (const m of ['sets', 'volume'] as const) {
      const [a, b] = idx(`pbar-${m}-klatka`, `pprev-${m}-klatka`); expect(a).toBeGreaterThanOrEqual(0); expect(b).toBeGreaterThan(a);
      const row = within(screen.getByTestId(`prow-${m}-klatka`)); expect(row.getByText(n1)).toBeTruthy(); expect(row.getByText(n2)).toBeTruthy();
      const w = (v: number) => `${(100 * v) / Math.max(cur, prev, m === 'sets' && kind !== 'month' ? 10 : 0)}%`; expect(style(`pprev-${m}-klatka-fill`).width).toBe(w(prev));
      expect(has(`pprev-${m}-klatka-hatch`)).toBe(true); expect(has(`pbar-${m}-klatka-hatch`)).toBe(false);
      const lbl = screen.getByTestId(`prow-${m}-klatka`).props.accessibilityLabel as string; expect(lbl.startsWith(`klatka: ${n1} `)).toBe(true); expect(lbl).toContain(`, ${n2} `);
    }
  });
  test('tydzień: okres 1 = wykonane + zaplanowane (liczby „x + y”), okres 2 — poprzedni; zerowy poprzedni: „0 (brak danych)” i znacznik zera', async () => {
    await boot(thisWeek, '/progression?c=week');
    expect(screen.getByTestId('prow-sets-klatka').props.accessibilityLabel).toMatch(/^klatka: Ten tydzień 12, .*Poprzedni tydzień 0 \(brak danych\)/); expect(has('pprev-sets-klatka-zero')).toBe(true);
    expect(within(screen.getByTestId('prow-sets-klatka')).getByText('0 (brak danych)')).toBeTruthy(); expect(style('pprev-sets-klatka-fill').width).toBe('0%');
  });
  test('„Ten tydzień” na ekranie Trening zostaje jednosłupkowy (tylko ten tydzień — bez okresu 2)', async () => {
    await boot(thisWeek, '/');
    expect(has('pbar-sets-klatka')).toBe(true); expect(has('pprev-sets-klatka')).toBe(false); expect(has('pprev-sets-klatka-hatch')).toBe(false);
    expect(screen.getByTestId('prow-sets-klatka').props.accessibilityLabel).toBe('klatka: 12, cel 10, co najmniej 10');
  });
  test.each([['light', light], ['dark', dark]] as const)('motyw %s: okres 2 w kolorze „muted” z prążkami, okres 1 w akcencie', async (name, th) => {
    await boot(both, '/progression?c=week', 'pl', name);
    expect(style('pprev-sets-klatka-fill').backgroundColor).toBe(th.muted); expect(style('pprev-sets-klatka').backgroundColor).toBe(th.line);
    expect(contrast(th.muted, th.line)).toBeGreaterThanOrEqual(GRAPHIC_MIN);
  });
  test('English: podpisy okresów (miesiąc, poprzedni tydzień) po angielsku', async () => {
    await boot(both, '/progression?c=month', 'en'); expect(screen.getByTestId('prow-sets-klatka').props.accessibilityLabel).toMatch(/^chest: This month 12.*, Previous month 2/);
    await boot(both, '/progression?c=prevWeek', 'en'); expect(within(screen.getByTestId('prow-sets-klatka')).getByText('2 weeks ago')).toBeTruthy();
  });
  test('320 pt i skala tekstu 2,0: wiersze partii bez przycinania', async () => {
    jest.spyOn(RN.PixelRatio, 'getFontScale').mockReturnValue(2);
    const dims = RN.Dimensions.get; jest.spyOn(RN.Dimensions, 'get').mockImplementation(((k: 'window' | 'screen') => ({ ...dims(k), fontScale: 2 })) as never);
    await boot(both, '/progression?c=week', 'en', 'dark', 320);
    for (const n of screen.getByTestId('prow-sets-klatka').findAll((x: { type: unknown }) => x.type === 'Text')) { expect(n.props.numberOfLines).toBeUndefined(); }
  });
});
