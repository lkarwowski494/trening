/*
 * M3 p2 — ekran Start (design-spec §10 wiersz 3; W1 c, W3 a, A2; docs/32 wzorce 19 i 28 pkt 4; 04-studio-projektowe-007):
 *  - „Planowanie” (bez planu „Ustaw plan”) w nagłówku ekranu jako PlanningButton — nie w karcie planu;
 *  - tablica „Dziś”: „Dziś: …” wersalikami (upperText), liczba ćwiczeń, 2 pierwsze ćwiczenia i „+ n ćwiczeń”;
 *  - ekran Start: mała ikonka sztangi po tytule (od 22.10.2026; wcześniej sylwetka w rogu);
 *  - arkusz „Inny trening”: „Anuluj” po lewej jak dotąd, dodatkowo gest w dół zamyka arkusz.
 */
import { Dimensions, StyleSheet } from 'react-native';
import { within } from '@testing-library/react-native';
import * as store from '@/lib/store';
import * as plan from '@/lib/plan';
import { setA11yPrefs, __resetA11yPrefsForTests } from '@/lib/a11yPrefs';
import { fresh, saved, addWorkout, withDemoTemplates } from './helpers';
import { renderApp, flushAll, screen, tap, act } from './app';
import type { Template } from '@/lib/seed';

jest.setTimeout(60000);
const NOW = new Date(2026, 9, 8, 9, 0); /* czwartek */
afterEach(() => { __resetA11yPrefsForTests(); jest.restoreAllMocks(); });
/** jest-expo ma fontScale 2 (rozmiary dostępności) — motyw A2 znika od 1,4 (MOTIF.hideFromFontScale), więc test sylwetki ustawia zwykły rozmiar tekstu */
const normalText = () => { const w = Dimensions.get('window'); jest.spyOn(Dimensions, 'get').mockImplementation(((k: string) => (k === 'window' ? { ...w, fontScale: 1 } : Dimensions.get.call(Dimensions, k as never))) as never); };
const boot = async (fn: (t: Template[]) => void = () => {}, locale: 'pl' | 'en' | 'el' = 'pl') => {
  jest.useFakeTimers({ now: NOW }); await fresh(undefined, locale === 'el' ? 'pl' : locale); const t = withDemoTemplates(locale === 'el' ? 'pl' : locale); fn(t);
  await act(async () => { await store.flush(); }); await renderApp({ saved: JSON.parse(JSON.stringify(saved())), ...(locale === 'el' ? { code: 'el', tag: 'el-GR' } : { locale }) }); jest.setSystemTime(NOW.getTime()); await flushAll(10); return t;
};
const setPlan = (t: Template[], days: Record<number, number>, name = '') => { jest.setSystemTime(new Date(2026, 9, 5, 6).getTime()); for (const [i, k] of Object.entries(days)) plan.setWeekDay(Number(i), t[k].id); if (name) plan.setPlanName(name); jest.setSystemTime(NOW.getTime()); };
const hist = () => addWorkout(new Date(2026, 9, 6, 18).getTime(), [['Back Squat', [{ weight: 100, reps: 5 }]]], 'Nogi');
const flat = (el: { props: { style?: unknown } }) => StyleSheet.flatten(el.props.style as never) as Record<string, unknown>;

describe('nagłówek ekranu: „Planowanie” jako PlanningButton (W1 c)', () => {
  test('z planem: przycisk „Planowanie” w nagłówku ekranu (linia tytułu „Trening”), nie w karcie planu; stuknięcie → ekran planu', async () => {
    await boot(t => { setPlan(t, { 3: 0 }, 'Góra / Dół'); hist(); });
    const b = screen.getByTestId('planning-button'); expect(b.props.accessibilityLabel).toBe('Planowanie'); expect(within(screen.getByTestId('plan-header')).queryByText('Planowanie')).toBeNull();
    const ids = screen.UNSAFE_root.findAll((n: { type: unknown; props: { testID?: string; accessibilityRole?: string } }) => typeof n.type === 'string' && (n.props.testID === 'planning-button' || n.props.testID === 'today-plan')).map((n: { props: { testID?: string } }) => n.props.testID);
    expect(ids[0]).toBe('planning-button'); await tap(b); await flushAll(10); expect(screen.getByDisplayValue('Góra / Dół')).toBeTruthy();
  });
  test('bez planu (są treningi): przycisk nazywa się „Ustaw plan”; nowa osoba (bez planu i treningów): przycisku w nagłówku nie ma (są „Pierwsze kroki”)', async () => {
    await boot(() => { hist(); }); expect(screen.getByTestId('planning-button').props.accessibilityLabel).toBe('Ustaw plan');
    await boot(); expect(screen.queryByTestId('planning-button')).toBeNull();
  });
  test('EN: „Planning” i „Set a plan”', async () => {
    await boot(t => { setPlan(t, { 3: 0 }, 'Upper / Lower'); hist(); }, 'en'); expect(screen.getByTestId('planning-button').props.accessibilityLabel).toBe('Planning');
    await boot(() => { hist(); }, 'en'); expect(screen.getByTestId('planning-button').props.accessibilityLabel).toBe('Set a plan');
  });
});

/* Decyzja 21.10.2026 (STOP 3 M3: „Planowanie” w tym samym miejscu na starcie i w zakładce Plan) i DEC-07 K3 (a), właściciel 23.10.2026 (docs/18): „Planowanie” w linii tytułu także na ekranie Trening — jak w zakładce Plan (docs/32 wzorzec 19 c);
 * M1-audytor-generalny-024 (04-studio-projektowe-005): przycisk stał w osobnym wierszu nad tytułem. */
describe('K3 (23.10.2026): „Planowanie” w linii tytułu, jak w zakładce Plan', () => {
  const fontScale = (s: number) => { const w = Dimensions.get('window'); jest.spyOn(Dimensions, 'get').mockImplementation(((k: string) => (k === 'window' ? { ...w, fontScale: s } : Dimensions.get.call(Dimensions, k as never))) as never); };
  test.each([[1, 390], [2, 320]])('skala tekstu %s, szerokość %s: przycisk w wierszu tytułu po napisie „Trening”; wiersz się zawija (przycisk przechodzi pod tytuł zamiast ucinać)', async (fs, width) => {
    fontScale(fs); jest.useFakeTimers({ now: NOW }); await fresh(); const t = withDemoTemplates('pl'); setPlan(t, { 3: 0 }, 'Góra / Dół'); hist();
    await act(async () => { await store.flush(); }); await renderApp({ saved: JSON.parse(JSON.stringify(saved())), locale: 'pl', width }); jest.setSystemTime(NOW.getTime()); await flushAll(10);
    const row = screen.getByTestId('title-row');
    expect(within(row).getByTestId('planning-button').props.accessibilityLabel).toBe('Planowanie');
    const order = row.findAll((n: { type: unknown; props: { testID?: string; accessibilityRole?: string } }) => typeof n.type === 'string' && (n.props.accessibilityRole === 'header' || n.props.testID === 'planning-button')).map((n: { props: { testID?: string } }) => n.props.testID ?? 'header');
    expect(order).toEqual(['header', 'planning-button']);
    expect(flat(row).flexWrap).toBe('wrap');
    const h = screen.getByRole('header', { name: 'Trening' }); expect(h.props.numberOfLines).toBeUndefined();
  });
});

describe('tablica „Dziś” (W3 a)', () => {
  test('„Dziś: {szablon}” wersalikami (styl wersalików w pl), liczba ćwiczeń, dwa pierwsze ćwiczenia z „serie × powtórzenia” i „+ n ćwiczeń”', async () => {
    const t = await boot(tt => { setPlan(tt, { 3: 0 }, 'Plan'); hist(); }); const n = t[0].items.length; expect(n).toBeGreaterThan(2);
    const b = within(screen.getByTestId('today-board')); const title = b.getByText('Dziś: Upper A'); expect(flat(title).textTransform).toBe('uppercase'); expect(title.props.accessibilityRole).toBe('header');
    expect(b.getByText(`${n} ćw.`)).toBeTruthy(); expect(b.getAllByTestId('today-item')).toHaveLength(2); expect(b.getAllByText('4 × 6–8').length).toBeGreaterThan(0);
    expect(b.getByTestId('today-more').props.children).toBe(`+ ${n - 2} ${n - 2 === 1 ? 'ćwiczenie' : n - 2 < 5 ? 'ćwiczenia' : 'ćwiczeń'}`.replace(/ /g, ' '));
  });
  test('greka (reguły języka): tytuł tablicy zapisany wersalikami, nie samym stylem', async () => {
    await boot(t => { setPlan(t, { 3: 0 }, 'Plan'); hist(); }, 'el');
    const title = within(screen.getByTestId('today-board')).getAllByRole('header')[0]; expect(String(title.props.children)).toBe(String(title.props.children).toUpperCase()); expect(title.props.accessibilityLabel).not.toBe(String(title.props.children));
  });
  test('dzień po treningu: „Dziś zrobione: …” na tablicy; dzień wolny: „Dziś wolne” (bez listy ćwiczeń)', async () => {
    await boot(t => { setPlan(t, { 4: 0 }, 'Plan'); hist(); }); const b = within(screen.getByTestId('today-board')); expect(b.getByText('Dziś wolne')).toBeTruthy(); expect(b.queryAllByTestId('today-item')).toHaveLength(0);
  });
  test('kolejność na ekranie: nazwa planu → pasek tygodnia → tablica „Dziś” → przycisk startu', async () => {
    await boot(t => { setPlan(t, { 3: 0 }, 'Plan'); hist(); });
    const ids = screen.UNSAFE_root.findAll((n: { type: unknown; props: { testID?: string } }) => typeof n.type === 'string' && ['plan-header', 'week-strip', 'today-board', 'start-panel'].includes(n.props.testID as string)).map((n: { props: { testID?: string } }) => n.props.testID);
    expect(ids).toEqual(['plan-header', 'week-strip', 'today-board', 'start-panel']);
  });
});

describe('motyw A2 na starcie (22.10.2026: duża sylwetka usunięta, mała ikonka po tytule)', () => {
  test('nie ma sylwetki w rogu; ikonka po tytule jest i ukryta dla VoiceOver także przy „Zwiększ kontrast” (szczegóły: tests/trening-naglowek.test.tsx)', async () => {
    normalText(); await boot(t => { setPlan(t, { 3: 0 }); hist(); }); expect(screen.queryByTestId('start-motif', { includeHiddenElements: true })).toBeNull();
    const m = screen.getByTestId('title-barbell', { includeHiddenElements: true }); expect(m.props.accessibilityElementsHidden).toBe(true);
    await act(async () => { setA11yPrefs({ contrast: true }); }); await flushAll(10); expect(screen.getByTestId('title-barbell', { includeHiddenElements: true })).toBeTruthy();
  });
});

describe('arkusz „Inny trening”: gest w dół (04-studio-projektowe-007)', () => {
  const open = async () => { await tap(screen.getByLabelText('Inny trening')); await flushAll(5); return screen.getByTestId('other-sheet'); };
  /** Gest: PanResponder liczy dy z touchHistory zdarzenia — budujemy je jak natywny moduł dotyku (jak tests/reorder-t010.test.tsx). */
  let ts = 1000;
  const touch = (y: number, prevY: number) => { ts += 16; return { touchHistory: { numberActiveTouches: 1, indexOfSingleActiveTouch: 0, mostRecentTimeStamp: ts, touchBank: [{ touchActive: true, startPageX: 10, startPageY: 300, startTimeStamp: ts, currentPageX: 10, currentPageY: y, currentTimeStamp: ts, previousPageX: 10, previousPageY: prevY, previousTimeStamp: ts - 16 }] }, nativeEvent: { pageX: 10, pageY: y, timestamp: ts, touches: [] } }; };
  const drag = async (sheet: { props: Record<string, (e: unknown) => unknown> }, dy: number) => {
    let y = 300; await act(async () => { sheet.props.onResponderGrant(touch(y, y)); });
    for (let k = 0; k < 5; k++) { const ny = y + dy / 5; await act(async () => { sheet.props.onResponderMove(touch(ny, y)); }); y = ny; }
    await act(async () => { sheet.props.onResponderRelease(touch(y, y)); }); await flushAll(50);
  };
  test('„Anuluj” po lewej zamyka jak dotąd; przeciągnięcie w dół o ≥ 90 pt zamyka; krótkie przeciągnięcie — arkusz zostaje', async () => {
    await boot(t => { setPlan(t, { 3: 0 }); hist(); });
    let sh = await open(); expect(sh.props.onResponderMove).toBeDefined(); expect(screen.getByLabelText('Anuluj')).toBeTruthy();
    await drag(sh as never, 30); expect(screen.queryByTestId('other-sheet')).not.toBeNull();
    await drag(screen.getByTestId('other-sheet') as never, 160); expect(screen.queryByTestId('other-sheet')).toBeNull();
    sh = await open(); await tap(screen.getByLabelText('Anuluj')); await flushAll(5); expect(screen.queryByTestId('other-sheet')).toBeNull();
  });
});
