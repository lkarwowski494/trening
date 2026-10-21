/*
 * M1-audytor-generalny-031: brak wariantu kolorów dla „Zwiększ kontrast” (iOS: Ułatwienia dostępu → Wyświetlanie i rozmiar tekstu; w RN
 * AccessibilityInfo.isDarkerSystemColorsEnabled / zdarzenie darkerSystemColorsChanged). Wariant: lib/theme.ts lightHC / darkHC; stan: lib/a11yPrefs.ts.
 * Progi (do zatwierdzenia przez właściciela — zapisane w docs/32): tekst (muted, accent, band) ≥ 7:1 (WCAG 1.4.6), elementy (line, ctrlLine, doneLine, less) ≥ 4,5:1.
 * Tory pasków (SegBar/HatchBar) używają `line`, więc wariant podnosi je razem z liniami.
 */
import React from 'react';
import { Text, AccessibilityInfo } from 'react-native';
import { render } from '@testing-library/react-native';
import * as RN from 'react-native';
import * as store from '@/lib/store';
import * as theme from '@/lib/theme';
import { fresh, ex, saved } from './helpers';
import { renderApp, flushAll, screen, act } from './app';

jest.setTimeout(60000);
const { light, dark, useTheme } = theme;
const lightHC = (theme as unknown as { lightHC: theme.Theme }).lightHC; const darkHC = (theme as unknown as { darkHC: theme.Theme }).darkHC;
const prefs = (): { setA11yPrefs: (p: { contrast?: boolean }) => void; __resetA11yPrefsForTests: () => void } => require('@/lib/a11yPrefs');
let handlers: Record<string, (v: boolean) => void> = {}; let scheme: 'light' | 'dark' = 'light';
beforeEach(() => {
  handlers = {}; scheme = 'light'; jest.restoreAllMocks();
  try { prefs().__resetA11yPrefsForTests(); } catch { /* */ }
  jest.spyOn(RN, 'useColorScheme').mockImplementation((() => scheme) as never);
  jest.spyOn(AccessibilityInfo, 'isBoldTextEnabled').mockResolvedValue(false); jest.spyOn(AccessibilityInfo, 'isDarkerSystemColorsEnabled').mockResolvedValue(false);
  jest.spyOn(AccessibilityInfo, 'addEventListener').mockImplementation(((n: string, h: (v: boolean) => void) => { handlers[n] = h; return { remove: () => {} }; }) as never);
});

const lum = (h: string) => { const c = h.slice(1).match(/../g)!.map(x => parseInt(x, 16) / 255).map(v => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4)); return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2]; };
const ratio = (a: string, b: string) => { const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05); };
const TEXT_TOKENS = ['muted', 'accent', 'band'] as const; const ELEMENT_TOKENS = ['line', 'ctrlLine', 'doneLine', 'less'] as const;

describe('palety wysokiego kontrastu', () => {
  test.each([['jasna', light, lightHC], ['ciemna', dark, darkHC]] as const)('%s: tekst (muted, accent, band) ≥ 7:1, elementy (line, ctrlLine, doneLine, less) ≥ 4,5:1 do bg, surface i surface2; lepiej niż wariant zwykły', (_n, base, hc) => {
    expect(hc).toBeDefined();
    for (const bg of ['bg', 'surface', 'surface2'] as const) {
      for (const k of TEXT_TOKENS) expect([k, bg, ratio(hc[k], hc[bg]) >= 7]).toEqual([k, bg, true]);
      for (const k of ELEMENT_TOKENS) expect([k, bg, ratio(hc[k], hc[bg]) >= 4.5]).toEqual([k, bg, true]);
    }
    for (const k of ['muted', 'line', 'ctrlLine'] as const) expect(ratio(hc[k], hc.bg)).toBeGreaterThan(ratio(base[k], base.bg));
    expect([hc.bg, hc.surface, hc.surface2, hc.text]).toEqual([base.bg, base.surface, base.surface2, base.text]); /* tła i tekst główny bez zmian */
    expect(Object.keys(hc).sort()).toEqual(Object.keys(base).sort());
  });
  test('przycisk główny i tekst na nim: accentInk na accent ≥ 7:1 także w wariancie HC', () => {
    for (const hc of [lightHC, darkHC]) expect(ratio(hc.accentInk, hc.accent)).toBeGreaterThanOrEqual(7);
  });
});

describe('useTheme + ustawienie systemu', () => {
  const Probe = () => { const t = useTheme(); return <Text testID="c">{t.line}</Text>; };
  test('wariant HC po włączeniu w trakcie działania (jasny i ciemny schemat) i powrót po wyłączeniu', () => {
    for (const sc of ['light', 'dark'] as const) {
      scheme = sc; const base = sc === 'light' ? light : dark; const hc = sc === 'light' ? lightHC : darkHC;
      const r = render(<Probe />); expect(r.getByTestId('c').props.children).toBe(base.line);
      act(() => { prefs().setA11yPrefs({ contrast: true }); }); expect(r.getByTestId('c').props.children).toBe(hc.line);
      act(() => { prefs().setA11yPrefs({ contrast: false }); }); expect(r.getByTestId('c').props.children).toBe(base.line); r.unmount();
    }
  });
  test('aplikacja: start z „Zwiększ kontrast” i zdarzenie darkerSystemColorsChanged zmieniają tło kart bez restartu', async () => {
    (AccessibilityInfo.isDarkerSystemColorsEnabled as jest.Mock).mockResolvedValue(true);
    await fresh(); store.startEmpty(); store.addExerciseToActive(ex('Back Squat')); await act(async () => { await store.flush(); });
    await renderApp({ saved: JSON.parse(JSON.stringify(saved())) }); await flushAll(10);
    const muted = () => { const el = screen.getByText(/^start \d/); const st = (RN.StyleSheet.flatten(el.props.style as never) as { color?: string }); return st.color; };
    expect(muted()).toBe(lightHC.muted);
    expect(typeof handlers.darkerSystemColorsChanged).toBe('function');
    await act(async () => { handlers.darkerSystemColorsChanged(false); }); await flushAll(5); expect(muted()).toBe(light.muted);
    await act(async () => { handlers.darkerSystemColorsChanged(true); }); await flushAll(5); expect(muted()).toBe(lightHC.muted);
  });
});
