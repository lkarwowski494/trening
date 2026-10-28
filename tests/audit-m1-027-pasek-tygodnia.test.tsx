/*
 * M1-audytor-generalny-027 (04-studio-projektowe-010, audyt M1 27.10.2026): pasek tygodnia na ekranie Trening przy 320 pt i dużym tekście — skróty dni
 * („SOB.”, „NIEDZ.”) nie mieściły się w kolumnach i zlewały się („SOB.NIEDZ.”). Siedem kolumn flex 1, skrót z limitem NUM_SCALE_MAX (1,3).
 * Po poprawce: skrót ma jedną linię i może się zmniejszyć (adjustsFontSizeToFit, najmniej 70 % — jak nagłówki kolumn, A11-19); gdy najdłuższy skrót
 * nie zmieściłby się w kolumnie nawet po zmniejszeniu, pasek pokazuje skróty jednoliterowe z Intl (weekday: 'narrow'; data dnia jest pod spodem,
 * pełna nazwa w etykiecie VoiceOver). Reguła: lib/calendar stripLabelsFit (szerokość skrótu szacowana zachowawczo: 0,62 em na znak — przybliżenie).
 */
import { Dimensions, StyleSheet, Text } from 'react-native';
import * as store from '@/lib/store';
import * as plan from '@/lib/plan';
import { stripLabelsFit, stripColumnPt, weekdayLabels, fmtWeekdayNarrow, STRIP_CHAR_EM, STRIP_MIN_SHRINK } from '@/lib/calendar';
import { applyLang, LANGS, type Lang } from '@/lib/i18n';
import { font, NUM_SCALE_MAX } from '@/lib/theme';
import { fresh, saved, addWorkout, withDemoTemplates } from './helpers';
import { renderApp, flushAll, screen, act } from './app';
import type { Template } from '@/lib/seed';

jest.setTimeout(60000);
const NOW = new Date(2026, 9, 8, 9, 0);
afterEach(() => { applyLang('pl'); jest.restoreAllMocks(); });
const win = (width: number, fontScale: number) => { const w = Dimensions.get('window'); jest.spyOn(Dimensions, 'get').mockImplementation(((k: string) => (k === 'window' ? { ...w, width, fontScale } : Dimensions.get.call(Dimensions, k as never))) as never); };
const boot = async (width: number, fontScale: number) => {
  win(width, fontScale); jest.useFakeTimers({ now: NOW }); await fresh(); const t: Template[] = withDemoTemplates('pl');
  jest.setSystemTime(new Date(2026, 9, 5, 6).getTime()); plan.setWeekDay(3, t[0].id); jest.setSystemTime(NOW.getTime());
  addWorkout(new Date(2026, 9, 6, 18).getTime(), [['Back Squat', [{ weight: 100, reps: 5 }]]], 'Nogi');
  await act(async () => { await store.flush(); }); await renderApp({ saved: JSON.parse(JSON.stringify(saved())), locale: 'pl', width }); jest.setSystemTime(NOW.getTime()); await flushAll(10);
};
/** Skróty dni w pasku (pierwszy tekst w kolumnie dnia). */
const stripLabels = () => Array.from({ length: 7 }, (_, i) => { const k = `2026-10-${String(5 + i).padStart(2, '0')}`; return screen.getByTestId(`strip-${k}`).findAll(x => x.type === Text)[0]; });
const capPt = (scale: number) => (font('caption').fontSize as number) * Math.min(scale, NUM_SCALE_MAX);

describe('reguła stripLabelsFit (lib/calendar)', () => {
  test('przypadki: szacowana szerokość = znaki × 0,62 em × rozmiar × 0,7 (najmniejsze zmniejszenie) ≤ szerokość kolumny', () => {
    expect(STRIP_CHAR_EM).toBe(0.62); expect(STRIP_MIN_SHRINK).toBe(0.7);
    expect(stripLabelsFit(['pon.', 'niedz.'], 40, 11)).toBe(true); /* 6 × 0,62 × 11 × 0,7 = 28,6 */
    expect(stripLabelsFit(['pon.', 'niedz.'], 28, 11)).toBe(false);
    expect(stripLabelsFit(['P', 'N'], 10, 14.3)).toBe(true); expect(stripLabelsFit([], 0, 11)).toBe(true);
  });
  test('szerokość kolumny paska: (pasek − 2 × 8 pt wcięcia − 6 × 2 pt odstępu) / 7 − 2 × 2 pt ramki', () => {
    expect(stripColumnPt(288)).toBeCloseTo((288 - 16 - 12) / 7 - 4, 5); expect(stripColumnPt(0)).toBe(0);
  });
  test('własność: przy 320 pt i tekście 130 % wybrany zestaw skrótów (zwykłe albo jednoliterowe) mieści się w kolumnie we wszystkich 35 językach', () => {
    const col = stripColumnPt(320 - 32); const size = capPt(1.3);
    for (const l of LANGS as readonly Lang[]) {
      applyLang(l); const short = weekdayLabels(); const narrow = Array.from({ length: 7 }, (_, i) => fmtWeekdayNarrow(new Date(2024, 0, 1 + i)));
      const shown = stripLabelsFit(short, col, size) ? short : narrow; expect([l, stripLabelsFit(shown, col, size)]).toEqual([l, true]);
    }
  });
});

describe('pasek tygodnia na ekranie', () => {
  test('320 pt, tekst 130 %: skróty jednoliterowe (polski „NIEDZ.” by się nie zmieścił), jedna linia, zmniejszanie zamiast zawijania', async () => {
    await boot(320, 1.3); const ls = stripLabels();
    expect(ls.map(x => String(x.props.children))).toEqual(['P', 'W', 'Ś', 'C', 'P', 'S', 'N']);
    for (const x of ls) { expect(x.props.numberOfLines).toBe(1); expect(x.props.adjustsFontSizeToFit).toBe(true); }
    expect(screen.getByTestId('strip-2026-10-11').props.accessibilityLabel).toMatch(/^niedziela, 11 października/); /* pełna nazwa dla VoiceOver bez zmian */
  });
  test('390 pt, zwykły tekst: zwykłe skróty („pon.” … „niedz.”, wersaliki stylem), jedna linia', async () => {
    await boot(390, 1); const ls = stripLabels();
    expect(ls.map(x => String(x.props.children))).toEqual(['pon.', 'wt.', 'śr.', 'czw.', 'pt.', 'sob.', 'niedz.']);
    expect((StyleSheet.flatten(ls[0].props.style) as { textTransform?: string }).textTransform).toBe('uppercase');
    for (const x of ls) expect(x.props.numberOfLines).toBe(1);
  });
});
