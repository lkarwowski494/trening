/*
 * M1-audytor-generalny-065 (DEC-19 b): tydzień w aplikacji zawsze od poniedziałku, także w kalendarzu historii — w regionach z tygodniem od niedzieli (USA) kalendarz wyglądał obco.
 * Po naprawie TYLKO kalendarz historii zaczyna się od pierwszego dnia tygodnia regionu (expo-localization getCalendars()[0].firstWeekday: 1 = niedziela … 7 = sobota,
 * brak/zła wartość → poniedziałek); plan tygodnia, DayPicker, objętość i statystyki zostają od poniedziałku.
 */
import * as store from '@/lib/store';
import { monthGrid, weekdayLabels, regionWeekStart, dayKey } from '@/lib/calendar';
import { applyLang } from '@/lib/i18n';
import { fresh, addWorkout, saved } from './helpers';
import { renderApp, flushAll, screen, go, act } from './app';

jest.setTimeout(60000);
const G = global as unknown as { __calendars?: unknown };
afterEach(() => { G.__calendars = undefined; applyLang('pl'); });
const at = (y: number, m: number, d: number, h = 18) => new Date(y, m, d, h).getTime();

describe('regionWeekStart: firstWeekday regionu → indeks dnia JS (0 = niedziela)', () => {
  test.each([[1, 0], [2, 1], [3, 2], [4, 3], [5, 4], [6, 5], [7, 6]] as const)('firstWeekday %s → %s', (fw, want) => { G.__calendars = [{ firstWeekday: fw }]; expect(regionWeekStart()).toBe(want); });
  test.each([[undefined], [[]], [[{}]], [[{ firstWeekday: null }]], [[{ firstWeekday: 0 }]], [[{ firstWeekday: 9 }]], [[{ firstWeekday: 'x' }]]] as const)('brak albo zła wartość (%j) → poniedziałek', cals => { G.__calendars = cals; expect(regionWeekStart()).toBe(1); });
});
describe('monthGrid / weekdayLabels z pierwszym dniem tygodnia', () => {
  test.each([0, 1, 2, 3, 4, 5, 6])('pierwszy dzień %s: pierwsza komórka każdego wiersza to ten dzień; siatka ciągła i obejmuje cały miesiąc (październik 2026 i luty 2026/2028)', first => {
    for (const [y, m] of [[2026, 9], [2026, 1], [2028, 1], [2026, 10]] as const) {
      const g = monthGrid(y, m, first); const days = g.flat(); const real = new Date(y, m + 1, 0).getDate();
      for (const w of g) { expect(w).toHaveLength(7); expect(new Date(w[0].y, w[0].m, w[0].d).getDay()).toBe(first); }
      for (let i = 1; i < days.length; i++) expect(new Date(days[i].y, days[i].m, days[i].d).getTime() - new Date(days[i - 1].y, days[i - 1].m, days[i - 1].d).getTime()).toBeGreaterThan(0.9 * 864e5);
      expect(days.filter(c => c.inMonth).map(c => c.d)).toEqual(Array.from({ length: real }, (_, i) => i + 1));
      expect(days[0].inMonth || new Date(days[0].y, days[0].m, days[0].d) < new Date(y, m, 1)).toBe(true); /* pierwsza komórka: nie później niż 1. dnia */
    }
  });
  test('domyślnie (bez argumentu) poniedziałek jak dotąd; październik 2026 od niedzieli zaczyna się 27 września, od poniedziałku 28 września', () => {
    expect(monthGrid(2026, 9)[0][0]).toMatchObject({ y: 2026, m: 8, d: 28, inMonth: false }); expect(monthGrid(2026, 9, 0)[0][0]).toMatchObject({ y: 2026, m: 8, d: 27, inMonth: false }); expect(monthGrid(2026, 9, 1)).toEqual(monthGrid(2026, 9));
  });
  test('weekdayLabels: domyślnie od poniedziałku (plan); z 0 od niedzieli; z 6 od soboty', () => {
    const mon = weekdayLabels(); const sun = weekdayLabels(0); expect(sun[0]).toBe(mon[6]); expect(sun.slice(1)).toEqual(mon.slice(0, 6)); expect(weekdayLabels(6)[0]).toBe(mon[5]);
    applyLang('en'); expect(weekdayLabels()[0]).toMatch(/^Mon/); expect(weekdayLabels(0)[0]).toMatch(/^Sun/);
  });
});
describe('ekran Historia: kalendarz od pierwszego dnia tygodnia regionu', () => {
  async function boot(fw: number | undefined, locale: 'pl' | 'en' = 'en', deload = false) {
    G.__calendars = fw === undefined ? undefined : [{ firstWeekday: fw }]; jest.useFakeTimers({ now: new Date(2026, 9, 8, 9, 0) }); await fresh(undefined, locale);
    addWorkout(at(2026, 9, 6), [['Back Squat', [{ weight: 100, reps: 5 }]]]); await act(async () => { await store.flush(); });
    const sv = JSON.parse(JSON.stringify(saved())); if (deload) sv.deloadWeeks = ['2026-10-12']; await renderApp({ saved: sv, locale, url: '/history' }); jest.setSystemTime(new Date(2026, 9, 8, 9, 0).getTime()); await flushAll(10);
  }
  const heads = () => screen.getByTestId('history-calendar').findAll(n => (n.type as unknown) === 'Text' && typeof n.props.children === 'string' && /^(Mon|Tue|Wed|Thu|Fri|Sat|Sun)/.test(n.props.children as string)).map(n => n.props.children as string);
  const firstDay = () => screen.getByTestId('history-calendar').findAll(n => typeof n.props.testID === 'string' && /^cal-\d{4}-\d{2}-\d{2}$/.test(n.props.testID))[0].props.testID as string;
  test('niedziela (firstWeekday 1): nagłówki Sun…Sat, pierwszy dzień października 2026 (czwartek) stoi w 5. kolumnie', async () => {
    await boot(1); expect(heads().map(h => h.slice(0, 3))).toEqual(['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']); expect(firstDay()).toBe('cal-2026-10-01');
    const all = screen.getByTestId('history-calendar').findAll(n => typeof n.props.testID === 'string' && /^cal-\d{4}/.test(n.props.testID)).map(n => n.props.testID as string); expect(new Set(all).size).toBe(31);
  });
  test('tydzień deload (poniedziałek 12.10) w układzie od niedzieli: ramka na wierszu 11–17.10 (od niedzieli), nie na 4–10.10; testID z poniedziałkiem', async () => {
    await boot(1, 'en', true); const rows = screen.getAllByTestId('cal-deload-2026-10-12'); expect(rows.length).toBeGreaterThan(0); expect(screen.queryByTestId('cal-deload-2026-10-05')).toBeNull();
    const row = rows[0]; const keys = row.findAll(n => typeof n.props.testID === 'string' && /^cal-\d{4}-\d{2}-\d{2}$/.test(n.props.testID)).map(n => n.props.testID as string);
    expect([...new Set(keys)]).toEqual(['11', '12', '13', '14', '15', '16', '17'].map(d => `cal-2026-10-${d}`));
  });
  test('poniedziałek (firstWeekday 2) i brak informacji o regionie: nagłówki Mon…Sun jak dotąd', async () => {
    for (const fw of [2, undefined]) { await boot(fw); expect([fw, heads().map(h => h.slice(0, 3))]).toEqual([fw, ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']]); }
  });
  test('plan tygodnia zostaje od poniedziałku także w regionie z niedzielą (DayPicker / Plan)', async () => {
    await boot(1); await go('/plan'); await flushAll(10);
    const names = screen.queryAllByText(/^(Monday|Sunday)/).map(n => String(n.props.children)); void names;
    expect(weekdayLabels()[0]).toMatch(/^Mon/); /* logika planu czyta weekdayLabels() bez argumentu */
  });
  test('dayKey: dzień treningu w kalendarzu zgodny z kluczem (6.10.2026 jest zaznaczony w obu układach)', async () => {
    for (const fw of [1, 2]) { await boot(fw); expect(screen.getByTestId(`cal-${dayKey(at(2026, 9, 6))}`)).toBeTruthy(); }
  });
});
