/*
 * M1-audytor-generalny-024: własny krój (IBM Plex) nie reagował na „Pogrubiony tekst” z ustawień iOS. Po naprawie: przy włączonym ustawieniu każda rola kroju
 * (lib/theme.ts F) jest o stopień grubsza (400→600, 600→700, Mono 500→600), zmiana w trakcie działania aplikacji odświeża ekrany (useTheme), a stan czyta
 * AccessibilityInfo.isBoldTextEnabled / zdarzenie boldTextChanged (lib/a11yPrefs.ts, app/_layout.tsx).
 */
import React from 'react';
import { Text, AccessibilityInfo, StyleSheet } from 'react-native';
import { render } from '@testing-library/react-native';
import * as store from '@/lib/store';
import { F, FONT_FILES, useTheme } from '@/lib/theme';
import { fresh, ex, saved } from './helpers';
import { renderApp, flushAll, screen, act } from './app';

jest.setTimeout(60000);
const prefs = (): { setA11yPrefs: (p: { bold?: boolean }) => void; initA11yPrefs: () => () => void; a11yPrefs: () => { bold: boolean }; __resetA11yPrefsForTests: () => void } => require('@/lib/a11yPrefs');
const ROLES = ['regular', 'semibold', 'heavy', 'display', 'mono', 'monoBold'] as const;
const family = (el: { props: { style?: unknown } }) => (StyleSheet.flatten(el.props.style as never) as { fontFamily?: string }).fontFamily;
let handlers: Record<string, (v: boolean) => void> = {};
beforeEach(() => {
  handlers = {}; jest.restoreAllMocks();
  try { prefs().__resetA11yPrefsForTests(); } catch { /* przed naprawą modułu nie ma */ }
  jest.spyOn(AccessibilityInfo, 'isBoldTextEnabled').mockResolvedValue(false);
  jest.spyOn(AccessibilityInfo, 'addEventListener').mockImplementation(((n: string, h: (v: boolean) => void) => { handlers[n] = h; return { remove: () => {} }; }) as never);
});

describe('F: kroje według „Pogrubiony tekst”', () => {
  test('bez ustawienia: kroje bazowe (Plex Sans 400/600/700/700, Mono 500/600)', () => {
    expect(ROLES.map(r => F[r])).toEqual(['IBMPlexSans_400Regular', 'IBMPlexSans_600SemiBold', 'IBMPlexSans_700Bold', 'IBMPlexSans_700Bold', 'IBMPlexMono_500Medium', 'IBMPlexMono_600SemiBold']);
  });
  test('z ustawieniem: każda rola o stopień (400→600, 600→700, Mono 500→600), najgrubsze zostają; każdy krój jest załadowany (FONT_FILES)', () => {
    prefs().setA11yPrefs({ bold: true });
    expect(ROLES.map(r => F[r])).toEqual(['IBMPlexSans_600SemiBold', 'IBMPlexSans_700Bold', 'IBMPlexSans_700Bold', 'IBMPlexSans_700Bold', 'IBMPlexMono_600SemiBold', 'IBMPlexMono_600SemiBold']);
    for (const r of ROLES) expect([r, !!(FONT_FILES as Record<string, unknown>)[F[r]]]).toEqual([r, true]);
  });
  test('komponent z useTheme() odświeża krój po zmianie ustawienia w trakcie działania — i wraca po wyłączeniu', () => {
    const Probe = () => { useTheme(); return <Text testID="p" style={{ fontFamily: F.regular }}>x</Text>; };
    const r = render(<Probe />); expect(family(r.getByTestId('p'))).toBe('IBMPlexSans_400Regular');
    act(() => { prefs().setA11yPrefs({ bold: true }); }); expect(family(r.getByTestId('p'))).toBe('IBMPlexSans_600SemiBold');
    act(() => { prefs().setA11yPrefs({ bold: false }); }); expect(family(r.getByTestId('p'))).toBe('IBMPlexSans_400Regular');
  });
});

describe('aplikacja: ustawienie iOS → ekran treningu', () => {
  const gymWorkout = async () => {
    await fresh(); store.startEmpty(); store.addExerciseToActive(ex('Back Squat')); const a = store.getState().active!; a.exercises[0].sets[0].weight = 80; a.exercises[0].sets[0].reps = 5; store.save(a);
    await act(async () => { await store.flush(); }); await renderApp({ saved: JSON.parse(JSON.stringify(saved())) }); await flushAll(10);
  };
  test('start z włączonym „Pogrubiony tekst”: opis zegara sesji (Plex Sans 400) jest półgruby; zdarzenie systemowe przełącza krój bez restartu', async () => {
    (AccessibilityInfo.isBoldTextEnabled as jest.Mock).mockResolvedValue(true);
    await gymWorkout(); await flushAll(10);
    const clock = () => screen.getByText(/^start \d/); expect(family(clock())).toBe('IBMPlexSans_600SemiBold');
    expect(typeof handlers.boldTextChanged).toBe('function');
    await act(async () => { handlers.boldTextChanged(false); }); await flushAll(5); expect(family(clock())).toBe('IBMPlexSans_400Regular');
    await act(async () => { handlers.boldTextChanged(true); }); await flushAll(5); expect(family(clock())).toBe('IBMPlexSans_600SemiBold');
  });
  test('bez ustawienia: krój bazowy', async () => {
    await gymWorkout(); expect(family(screen.getByText(/^start \d/))).toBe('IBMPlexSans_400Regular');
  });
});
