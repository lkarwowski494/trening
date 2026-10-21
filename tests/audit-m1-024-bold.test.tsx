/*
 * M1-audytor-generalny-024: własny krój (IBM Plex) nie reagował na „Pogrubiony tekst” z ustawień iOS. Po naprawie: przy włączonym ustawieniu każda rola kroju
 * (lib/theme.ts F) jest o stopień grubsza (400→600, 600→700, Mono 500→600), zmiana w trakcie działania aplikacji odświeża ekrany (useTheme), a stan czyta
 * AccessibilityInfo.isBoldTextEnabled / zdarzenie boldTextChanged (lib/a11yPrefs.ts, app/_layout.tsx).
 */
import React from 'react';
import { Text, AccessibilityInfo, StyleSheet } from 'react-native';
import { render } from '@testing-library/react-native';
import * as store from '@/lib/store';
import { F, FW, FONT_FILES, useTheme } from '@/lib/theme';
import { fresh, ex, saved } from './helpers';
import { renderApp, flushAll, screen, act } from './app';

jest.setTimeout(60000);
const prefs = (): { setA11yPrefs: (p: { bold?: boolean }) => void; initA11yPrefs: () => () => void; a11yPrefs: () => { bold: boolean }; __resetA11yPrefsForTests: () => void } => require('@/lib/a11yPrefs');
const ROLES = ['regular', 'semibold', 'heavy', 'display', 'mono', 'monoBold'] as const;
const weightOf = (el: { props: { style?: unknown } }) => (StyleSheet.flatten(el.props.style as never) as { fontWeight?: string }).fontWeight;
let handlers: Record<string, (v: boolean) => void> = {};
beforeEach(() => {
  handlers = {}; jest.restoreAllMocks();
  try { prefs().__resetA11yPrefsForTests(); } catch { /* przed naprawą modułu nie ma */ }
  jest.spyOn(AccessibilityInfo, 'isBoldTextEnabled').mockResolvedValue(false);
  jest.spyOn(AccessibilityInfo, 'addEventListener').mockImplementation(((n: string, h: (v: boolean) => void) => { handlers[n] = h; return { remove: () => {} }; }) as never);
});

/* M3 (STOP E3, docs/18): krój treści to systemowy ('System' + fontWeight), tytuły i liczby — Barlow Condensed 600/700. „Pogrubiony tekst” nadal przesuwa każdą rolę o stopień:
 * własny krój 600 → 700, system 400 → 600 i 600 → 700 (FW.*, font(rola)); dawny test sprawdzał nazwy plików IBM Plex tą samą regułą. */
const fam = (el: { props: { style?: unknown } }) => (StyleSheet.flatten(el.props.style as never) as { fontFamily?: string; fontWeight?: string });
describe('F / FW: kroje i wagi według „Pogrubiony tekst”', () => {
  test('bez ustawienia: Barlow 700 (heavy, display), Barlow 600/700 (mono, monoBold); system 400/600/700 (FW)', () => {
    expect(ROLES.map(r => F[r])).toEqual(['System', 'System', 'BarlowCondensed_700Bold', 'BarlowCondensed_700Bold', 'BarlowCondensed_600SemiBold', 'BarlowCondensed_700Bold']);
    expect([FW.regular.fontWeight, FW.semibold.fontWeight, FW.bold.fontWeight]).toEqual(['400', '600', '700']);
  });
  test('z ustawieniem: każda rola o stopień (system 400→600, 600→700; Barlow 600→700), najgrubsze zostają; każdy własny krój jest załadowany (FONT_FILES)', () => {
    prefs().setA11yPrefs({ bold: true });
    expect(ROLES.map(r => F[r])).toEqual(['System', 'System', 'BarlowCondensed_700Bold', 'BarlowCondensed_700Bold', 'BarlowCondensed_700Bold', 'BarlowCondensed_700Bold']);
    expect([FW.regular.fontWeight, FW.semibold.fontWeight, FW.bold.fontWeight]).toEqual(['600', '700', '700']);
    for (const r of ROLES) if (F[r] !== 'System') expect([r, !!(FONT_FILES as Record<string, unknown>)[F[r]]]).toEqual([r, true]);
  });
  test('komponent z useTheme() odświeża wagę po zmianie ustawienia w trakcie działania — i wraca po wyłączeniu', () => {
    const Probe = () => { useTheme(); return <Text testID="p" style={{ ...FW.regular }}>x</Text>; };
    const r = render(<Probe />); expect(fam(r.getByTestId('p'))).toEqual({ fontFamily: 'System', fontWeight: '400' });
    act(() => { prefs().setA11yPrefs({ bold: true }); }); expect(fam(r.getByTestId('p')).fontWeight).toBe('600');
    act(() => { prefs().setA11yPrefs({ bold: false }); }); expect(fam(r.getByTestId('p')).fontWeight).toBe('400');
  });
});

describe('aplikacja: ustawienie iOS → ekran treningu', () => {
  const gymWorkout = async () => {
    await fresh(); store.startEmpty(); store.addExerciseToActive(ex('Back Squat')); const a = store.getState().active!; a.exercises[0].sets[0].weight = 80; a.exercises[0].sets[0].reps = 5; store.save(a);
    await act(async () => { await store.flush(); }); await renderApp({ saved: JSON.parse(JSON.stringify(saved())) }); await flushAll(10);
  };
  test('start z włączonym „Pogrubiony tekst”: opis zegara sesji (system 400) jest półgruby (600); zdarzenie systemowe przełącza wagę bez restartu', async () => {
    (AccessibilityInfo.isBoldTextEnabled as jest.Mock).mockResolvedValue(true);
    await gymWorkout(); await flushAll(10);
    const clock = () => screen.getByTestId('workout-clock'); expect(weightOf(clock())).toBe('600');
    expect(typeof handlers.boldTextChanged).toBe('function');
    await act(async () => { handlers.boldTextChanged(false); }); await flushAll(5); expect(weightOf(clock())).toBe('400');
    await act(async () => { handlers.boldTextChanged(true); }); await flushAll(5); expect(weightOf(clock())).toBe('600');
  });
  test('bez ustawienia: krój bazowy', async () => {
    await gymWorkout(); expect(weightOf(screen.getByTestId('workout-clock'))).toBe('400');
  });
});
