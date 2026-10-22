/*
 * Ekran Trening — nagłówek i przewijanie (uwagi właściciela z telefonu, 22.10.2026, docs/18; docs/32 wzorzec 31, strażnik S18):
 *  1. brak dużego motywu sztangi w nagłówku (nachodził na „Plan: …”); zamiast niego mała ikonka zaraz po napisie „Trening” — dekoracyjna, ukryta dla VoiceOver;
 *  2. nagłówek zakładki (wspólny TabHeader) zaczyna się tuż pod bezpiecznym obszarem — ten sam odstęp na wszystkich czterech zakładkach;
 *  3. pionowa kreska przy prawej krawędzi = wskaźnik przewijania (ScrollView): ukryty we wszystkich przewijanych ekranach (wspólne ScrollView/FlatList z components/Scroll);
 *  4. dwa szare kółka nad paskiem zakładek = głowy sylwetki „Przód / Tył” (mapa partii w „Ten tydzień”), zamierzony element, nie artefakt.
 */
import { Dimensions, StyleSheet, ScrollView, FlatList } from 'react-native';
import * as store from '@/lib/store';
import * as plan from '@/lib/plan';
import { HEADER, SPACE } from '@/lib/theme';
import { PARTS } from '@/lib/musclemap';
import { setA11yPrefs, __resetA11yPrefsForTests } from '@/lib/a11yPrefs';
import { fresh, saved, addWorkout, withDemoTemplates } from './helpers';
import { renderApp, flushAll, screen, tap, act } from './app';
import type { Template } from '@/lib/seed';

jest.setTimeout(60000);
const NOW = new Date(2026, 9, 8, 9, 0);
afterEach(() => { __resetA11yPrefsForTests(); jest.restoreAllMocks(); });
const fontScale = (s: number) => { const w = Dimensions.get('window'); jest.spyOn(Dimensions, 'get').mockImplementation(((k: string) => (k === 'window' ? { ...w, fontScale: s } : Dimensions.get.call(Dimensions, k as never))) as never); };
const flat = (el: { props: { style?: unknown } }) => StyleSheet.flatten(el.props.style as never) as Record<string, unknown>;
const boot = async (width?: number) => {
  jest.useFakeTimers({ now: NOW }); await fresh(); const t: Template[] = withDemoTemplates('pl');
  jest.setSystemTime(new Date(2026, 9, 5, 6).getTime()); plan.setWeekDay(3, t[0].id); plan.setPlanName('Masa'); jest.setSystemTime(NOW.getTime());
  addWorkout(new Date(2026, 9, 6, 18).getTime(), [['Back Squat', [{ weight: 100, reps: 5 }]]], 'Nogi');
  await act(async () => { await store.flush(); }); await renderApp({ saved: JSON.parse(JSON.stringify(saved())), locale: 'pl', ...(width ? { width } : {}) }); jest.setSystemTime(NOW.getTime()); await flushAll(10);
};

describe('1. ikonka sztangi po tytule zamiast dużej grafiki', () => {
  test.each([[1, 390], [1, 320], [2, 390], [2, 320]])('skala tekstu %s, szerokość %s: nie ma start-motif ani bar-motif; ikonka w wierszu tytułu, po napisie, bez pozycji absolutnej, ukryta dla VoiceOver', async (fs, w) => {
    fontScale(fs); await boot(w);
    expect(screen.queryByTestId('start-motif', { includeHiddenElements: true })).toBeNull(); expect(screen.queryByTestId('bar-motif', { includeHiddenElements: true })).toBeNull();
    const icon = screen.getByTestId('title-barbell', { includeHiddenElements: true }); expect(icon.props.accessibilityElementsHidden).toBe(true); expect(icon.props.importantForAccessibility).toBe('no-hide-descendants');
    expect(flat(icon).position).not.toBe('absolute');
    const row = screen.getByTestId('title-row'); const order = row.findAll(n => typeof n.type === 'string' && (n.props.accessibilityRole === 'header' || n.props.testID === 'title-barbell')).map(n => n.props.testID ?? 'header');
    expect(order).toEqual(['header', 'title-barbell']);
  });
  test('etykieta nagłówka „Trening” bez zmian (ikona nie dodaje tekstu); ikona jest też przy „Zwiększ kontrast”', async () => {
    fontScale(1); await boot(); await act(async () => { setA11yPrefs({ contrast: true }); }); await flushAll(10);
    expect(screen.getByRole('header', { name: 'Trening' })).toBeTruthy(); expect(screen.getByTestId('title-barbell', { includeHiddenElements: true })).toBeTruthy();
  });
});

describe('2. wspólny nagłówek zakładek', () => {
  test('Trening, Plan, Postępy, Więcej: ten sam TabHeader (odstęp u góry HEADER.top, u dołu HEADER.bottom)', async () => {
    fontScale(1); await boot();
    for (const name of ['Trening', 'Plan', 'Postępy', 'Więcej']) {
      await tap(screen.getByLabelText(new RegExp(`^${name}, .*zakładka`))); await flushAll(10);
      const hs = screen.getAllByTestId('tab-header'); expect(hs.length).toBe(1); const s = flat(hs[0]); expect(s.marginTop).toBe(HEADER.top); expect(s.marginBottom).toBe(HEADER.bottom);
    }
    expect(HEADER.top).toBeLessThan(10); /* wcześniej 10 pt nad tytułem */ expect(HEADER.bottom).toBeLessThanOrEqual(SPACE.s);
  });
});

describe('3. wskaźnik przewijania (kreska przy prawej krawędzi)', () => {
  test('ScrollView i listy na zakładkach ukrywają wskaźnik (pionowy i poziomy)', async () => {
    fontScale(1); await boot();
    const sv = screen.UNSAFE_root.findAllByType(ScrollView); expect(sv.length).toBeGreaterThan(0);
    for (const s of sv) { expect(s.props.showsVerticalScrollIndicator).toBe(false); expect(s.props.showsHorizontalScrollIndicator).toBe(false); }
    await tap(screen.getByLabelText(/^Plan, .*zakładka/)); await flushAll(10);
    const ls = screen.UNSAFE_root.findAllByType(FlatList); expect(ls.length).toBeGreaterThan(0);
    for (const l of ls) expect(l.props.showsVerticalScrollIndicator).toBe(false);
  });
});

describe('4. dwa szare kółka nad paskiem zakładek', () => {
  test('to głowy sylwetki „Przód / Tył” mapy partii w „Ten tydzień” (element zamierzony; opis dla VoiceOver na całej mapie)', async () => {
    fontScale(1); await boot();
    const map = screen.getByTestId('guard-map'); expect(map.props.accessibilityRole).toBe('image');
    for (const view of ['front', 'back'] as const) expect(PARTS.some(p => p.view === view && p.muscle == null && p.shapes.some(sh => 'e' in sh))).toBe(true);
  });
});
