import { Appearance, useColorScheme } from 'react-native';

/*
 * Styl marki „Tuleja” (decyzja właściciela 07.10.2026: „Podoba mi się grafika B”; docs/16, docs/21 pkt 6). Jedno źródło kolorów i krojów pisma.
 * Zastępuje „Kredę” (05.10.2026). Papier i atrament jako tło i tekst; akcent = niebieski talerza 20 kg (kolory talerzy: lib/plates.ts).
 * Kontrast (WCAG): tests/ux.test.tsx C5 — akcent #1F5FD1 na papierze 5,3:1, w ciemnym motywie jaśniejszy #6F9BF2.
 */
export const BRAND = { paper: '#F4F3EF', ink: '#15171A', signal: '#1F5FD1' } as const;
export const light: Record<'bg' | 'surface' | 'surface2' | 'line' | 'text' | 'muted' | 'accent' | 'accentInk' | 'done' | 'doneLine' | 'danger' | 'band', string> = { bg: BRAND.paper, surface: '#ffffff', surface2: '#e9e7e1', line: '#d6d3cb', text: BRAND.ink, muted: '#4a4d53', accent: BRAND.signal, accentInk: '#ffffff', done: '#e2ece0', doneLine: '#2e7d4f', danger: '#b3261e', band: '#136f75' };
/** Ciemna wersja: grafitowe tło, papierowy tekst, ten sam niebieski (jaśniejszy). */
export const dark: typeof light = { bg: '#121316', surface: '#1b1d21', surface2: '#26282d', line: '#3a3d43', text: '#eceae4', muted: '#a6a9af', accent: '#6f9bf2', accentInk: '#121316', done: '#1f2e24', doneLine: '#4e9a6a', danger: '#ec7a72', band: '#5fc3c9' };
export type Theme = typeof dark;
/** Wygląd z ustawień (decyzja 05.10.2026, domyślnie jasny — potwierdzone 07.10.2026). Nadpisuje tryb systemu dla całej aplikacji. */
export function applyTheme(x: 'light' | 'dark' | 'auto' | undefined) { try { Appearance.setColorScheme(x === 'dark' ? 'dark' : x === 'auto' ? 'unspecified' : 'light'); } catch { /* bez natywnego modułu (web) — tryb systemu */ } }
export function useTheme(): Theme { return useColorScheme() === 'light' ? light : dark; }

/**
 * Kroje pisma (Google Fonts, licencja OFL) — decyzje właściciela 07.10.2026 (rano wariant A „mieszany”, wieczorem bez Tektur — docs/18):
 *  - IBM Plex Sans — zwykły tekst (regular, semibold), nagłówki (heavy) i duże liczby w widoku skupionym (display) — Bold 700;
 *  - IBM Plex Mono — liczby w tabelach i timery (mono, monoBold).
 * heavy i display to dziś ten sam plik — dwie nazwy zostają, żeby rolę dało się zmienić w jednym miejscu. Oba kroje mają polskie znaki i cyrylicę (test: tests/matrix-i18n.test.tsx) — jeden zestaw dla każdego języka.
 * Nazwy = klucze w `FONT_FILES` (ładowane w app/_layout.tsx). Z własnym krojem nie ustawiamy fontWeight — grubość wybiera rodzina.
 */
export const F = {
  regular: 'IBMPlexSans_400Regular', semibold: 'IBMPlexSans_600SemiBold', heavy: 'IBMPlexSans_700Bold', display: 'IBMPlexSans_700Bold',
  mono: 'IBMPlexMono_500Medium', monoBold: 'IBMPlexMono_600SemiBold',
} as const;
/* eslint-disable @typescript-eslint/no-var-requires */
export const FONT_FILES = {
  [F.regular]: require('@expo-google-fonts/ibm-plex-sans/400Regular/IBMPlexSans_400Regular.ttf'),
  [F.semibold]: require('@expo-google-fonts/ibm-plex-sans/600SemiBold/IBMPlexSans_600SemiBold.ttf'),
  [F.heavy]: require('@expo-google-fonts/ibm-plex-sans/700Bold/IBMPlexSans_700Bold.ttf'), /* = F.display */
  [F.mono]: require('@expo-google-fonts/ibm-plex-mono/500Medium/IBMPlexMono_500Medium.ttf'),
  [F.monoBold]: require('@expo-google-fonts/ibm-plex-mono/600SemiBold/IBMPlexMono_600SemiBold.ttf'),
};
