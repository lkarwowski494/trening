/*
 * Postępy → Podsumowanie miesiąca: tygodnie jako rząd stosów talerzy (decyzja właściciela 09.10.2026 ok. 17:25, docs/18) — ten sam komponent stosu
 * co postęp tygodnia (components/Motif PlateStack). Pełny stos = tydzień z planem wykonanym w 100%, obwódka = tydzień niepełny, kreska = tydzień
 * bez planu (rozstrzygnięcie agenta). Rodzaje testów (docs/20): logika (lib/motif.monthWeeks: przynależność tygodnia do miesiąca, stany, liczby,
 * granice), ekran (PL jasny, EN ciemny, bez planu, przewijanie miesięcy), VoiceOver (grafika ukryta, liczby w etykiecie), dane (bez zmian zapisu).
 */
import React from 'react';
import * as RN from 'react-native';
import { Appearance } from 'react-native';
import { fireEvent } from '@testing-library/react-native';
import * as store from '@/lib/store';
import * as plan from '@/lib/plan';
import { monthWeeks, MONTH_WEEK_STATES, LOAD_ORDER } from '@/lib/motif';
import { periodRange } from '@/lib/period';
import { PLATE_COLORS } from '@/lib/plates';
import { light, dark } from '@/lib/theme';
import { fresh, addWorkout, saved } from './helpers';
import { renderApp, flushAll, screen, go, act } from './app';

jest.setTimeout(60000);
const at = (m: number, d: number, h = 18) => new Date(2026, m - 1, d, h).getTime();
const NOW = new Date(2026, 9, 30, 12); /* piątek 30 października 2026 */
const S = () => store.getState();
const sets = (n: number) => Array.from({ length: n }, () => ({ weight: 80, reps: 5 }));
let scheme: 'light' | 'dark' = 'light';
beforeEach(() => {
  jest.spyOn(Appearance, 'setColorScheme').mockImplementation(((v: string | null | undefined) => { scheme = v === 'dark' ? 'dark' : 'light'; }) as never);
  jest.spyOn(RN, 'useColorScheme').mockImplementation((() => scheme) as never);
});
afterEach(() => { jest.restoreAllMocks(); scheme = 'light'; });
const mkTpl = (name: string) => { const t = store.newTemplate(); t.name = name; store.save(t); return t; };
/** Plan pon + śr od 28.09 (szablon A); tydzień 19.10 bez planu (oba dni zmienione na wolne); zrobione: 28.09 i 30.09 (pełny), 5.10 (niepełny),
 * 12.10 nic (niepełny), 26.10 i 28.10 (pełny). */
const prep = () => {
  jest.setSystemTime(at(9, 28, 6)); const a = mkTpl('A'); plan.setWeekDay(0, a.id); plan.setWeekDay(2, a.id);
  plan.setDayPlan('2026-10-19', null); plan.setDayPlan('2026-10-21', null);
  for (const [m, d] of [[9, 28], [9, 30], [10, 5], [10, 26], [10, 28]] as const) { const w = addWorkout(at(m, d), [['Back Squat', sets(3)]], 'A'); w.templateId = a.id; }
  addWorkout(at(10, 14), [['Back Squat', sets(3)]], 'inny'); /* środa 14.10 — trening bez szablonu planu nie zalicza dnia */
  store.save(); jest.setSystemTime(NOW);
};
const oct = () => periodRange('month', 0, NOW);

describe('logika: monthWeeks', () => {
  test('tydzień należy do miesiąca, w którym ma czwartek (każdy tydzień w jednym miesiącu); stany pełny / niepełny / bez planu; liczby', async () => {
    jest.useFakeTimers({ now: NOW }); await fresh(); prep();
    const r = monthWeeks(oct().start, oct().end);
    expect(r.weeks.map(w => [w.start, w.state, w.done, w.planned])).toEqual([
      ['2026-09-28', 'full', 2, 2], ['2026-10-05', 'partial', 1, 2], ['2026-10-12', 'partial', 0, 2], ['2026-10-19', 'none', 0, 0], ['2026-10-26', 'full', 2, 2]]);
    expect([r.full, r.planned]).toEqual([2, 4]);
    const nov = periodRange('month', 1, NOW); expect(monthWeeks(nov.start, nov.end, at(12, 15)).weeks[0].start).toBe('2026-11-02'); /* 26.10–1.11 (czwartek 29.10) — październik */
    const sep = periodRange('month', -1, NOW); expect(monthWeeks(sep.start, sep.end).weeks.map(w => w.start)).toEqual(['2026-08-31', '2026-09-07', '2026-09-14', '2026-09-21']); /* 31.08 (czwartek 3.09) — wrzesień */
  });
  test('bieżący miesiąc: tylko tygodnie, które się już zaczęły; bieżący tydzień niepełny, dopóki plan nie jest zrobiony w całości', async () => {
    jest.useFakeTimers({ now: at(10, 8, 12) }); await fresh(); prep(); jest.setSystemTime(at(10, 8, 12));
    const r = monthWeeks(oct().start, oct().end); expect(r.weeks.map(w => [w.start, w.state])).toEqual([['2026-09-28', 'full'], ['2026-10-05', 'partial']]);
    const w = addWorkout(at(10, 7, 9), [['Back Squat', sets(3)]], 'A'); w.templateId = S().templates[0].id; store.save();
    expect(monthWeeks(oct().start, oct().end).weeks[1]).toMatchObject({ state: 'full', done: 2, planned: 2 });
  });
  test('bez planu: wszystkie tygodnie „bez planu”, 0 z 0; puste dane i złe granice — pusta lista', async () => {
    jest.useFakeTimers({ now: NOW }); await fresh(); addWorkout(at(10, 5), [['Back Squat', sets(3)]]);
    const r = monthWeeks(oct().start, oct().end); expect(r.weeks.every(w => w.state === 'none')).toBe(true); expect([r.full, r.planned, r.weeks.length]).toEqual([0, 0, 5]);
    expect(monthWeeks(oct().end, oct().start).weeks).toEqual([]); expect(monthWeeks(Number.NaN, oct().end).weeks).toEqual([]);
    for (const s of MONTH_WEEK_STATES) expect(['full', 'partial', 'none']).toContain(s);
  });
});

type Node = ReturnType<typeof screen.getByTestId>;
const rects = (n: Node) => n.findAll(x => typeof x.type !== 'string' && typeof x.props.fill === 'string' && 'width' in x.props).map(x => ({ fill: String(x.props.fill), stroke: x.props.stroke as string | undefined }));
const hidden = (n: Node) => { for (let x: Node | null = n; x; x = x.parent as Node | null) if (x.props.accessibilityElementsHidden === true && x.props.importantForAccessibility === 'no-hide-descendants') return true; return false; };
const boot = async (p: () => void, locale: 'pl' | 'en' = 'pl', theme: 'light' | 'dark' = 'light') => {
  jest.useFakeTimers({ now: NOW }); await fresh(undefined, locale); p(); S().settings.theme = theme; store.saveCfg(); await act(async () => { await store.flush(); });
  await renderApp({ saved: JSON.parse(JSON.stringify(saved())), locale }); await flushAll(10); await go('/more/progress'); await flushAll(10);
};
const month = async (label: string) => { await act(async () => { fireEvent.press(screen.getByLabelText(label)); }); await flushAll(5); };

describe('ekran: Postępy → Podsumowanie → Miesiąc', () => {
  test.each([['pl', 'light', 'Miesiąc', 'Tygodnie z wykonanym planem: 2 z 4'], ['en', 'dark', 'Month', 'Weeks with the plan done: 2 of 4']] as const)('%s, %s: stosy tygodni, kreska bez planu, podpis z liczbą; grafika ukryta, liczby w etykiecie', async (l, theme, chip, caption) => {
    const th = theme === 'light' ? light : dark; await boot(prep, l, theme);
    expect(screen.queryByTestId('month-weeks')).toBeNull(); /* widok tygodnia — bez stosów miesiąca */
    await month(chip);
    const box = screen.getByTestId('month-weeks'); expect(box.props.accessibilityLabel).toBe(caption); expect(screen.getByText(caption)).toBeTruthy();
    const fills = LOAD_ORDER.map(c => PLATE_COLORS[c] as string);
    for (const i of [0, 4]) { const n = screen.getByTestId(`month-week-${i}`, { includeHiddenElements: true }); expect(rects(n).map(x => x.fill)).toEqual(fills); expect(hidden(n)).toBe(true); }
    for (const i of [1, 2]) expect(rects(screen.getByTestId(`month-week-${i}`, { includeHiddenElements: true })).every(x => x.fill === 'none' && x.stroke === th.text)).toBe(true);
    const dash = screen.getByTestId('month-week-3', { includeHiddenElements: true }); expect(rects(dash)).toEqual([]); expect(hidden(dash)).toBe(true);
    expect(JSON.stringify(dash.props.style)).toContain(th.ctrlLine);
  });
  test('przewinięcie do poprzedniego miesiąca: inne tygodnie; miesiąc bez planu — bez stosów i podpisu', async () => {
    await boot(prep); await month('Miesiąc');
    await act(async () => { fireEvent.press(screen.getByLabelText('Poprzedni okres')); }); await flushAll(5);
    expect(screen.queryByTestId('month-weeks')).toBeNull(); /* wrzesień: tydzień 28.09 należy do października, plan od 28.09 — we wrześniu brak planu */
  });
  test('bez planu w ogóle: bez stosów; zapis po obejrzeniu = przed (motyw nic nie dopisuje)', async () => {
    await boot(() => { addWorkout(at(10, 5), [['Back Squat', sets(3)]]); }); await act(async () => { await store.flush(); }); const before = JSON.stringify(saved());
    await month('Miesiąc'); expect(screen.queryByTestId('month-weeks')).toBeNull();
    await act(async () => { await store.flush(); }); expect(JSON.stringify(saved())).toBe(before);
  });
});
