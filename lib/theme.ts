import { Appearance, useColorScheme } from 'react-native';

/*
 * Styl marki „Kreda” (decyzja właściciela 05.10.2026; docs/16-jezyki-i-marka.md). Jedno źródło kolorów i krojów pisma.
 * Pomarańcz marki #E8590C ma na jasnym tle kontrast 3,3:1 (za mało dla tekstu, WCAG 4,5) — w jasnym motywie akcent
 * przyciemniony do #C2410C; w ciemnym jaśniejszy #FF8A3D. Test kontrastu: tests/ux.test.tsx C5.
 */
export const BRAND = { chalk: '#F2F0EB', graphite: '#1E1F22', signal: '#E8590C' } as const;
export const light: Record<'bg' | 'surface' | 'surface2' | 'line' | 'text' | 'muted' | 'accent' | 'accentInk' | 'done' | 'doneLine' | 'danger' | 'band', string> = { bg: BRAND.chalk, surface: '#ffffff', surface2: '#e8e5de', line: '#d3d0c8', text: BRAND.graphite, muted: '#5a5c61', accent: '#c2410c', accentInk: '#ffffff', done: '#e4ead9', doneLine: '#5e7f3a', danger: '#b3261e', band: '#136f75' };
/** Kreda po zmroku („Kreda + ciemna wersja”, 05.10.2026): grafitowe tło, kredowy tekst, ten sam pomarańcz (jaśniejszy). */
export const dark: typeof light = { bg: '#17181b', surface: '#1f2024', surface2: '#2a2b30', line: '#3a3c42', text: BRAND.chalk, muted: '#a3a5ab', accent: '#ff8a3d', accentInk: BRAND.graphite, done: '#26301f', doneLine: '#4b6a2c', danger: '#ec7a72', band: '#5fc3c9' };
export type Theme = typeof dark;
/** Wygląd z ustawień (decyzja 05.10.2026). Nadpisuje tryb systemu dla całej aplikacji — także alerty, klawiaturę i pasek stanu. */
export function applyTheme(x: 'light' | 'dark' | 'auto' | undefined) { try { Appearance.setColorScheme(x === 'dark' ? 'dark' : x === 'auto' ? 'unspecified' : 'light'); } catch { /* bez natywnego modułu (web) — tryb systemu */ } }
export function useTheme(): Theme { return useColorScheme() === 'light' ? light : dark; }

/**
 * Kroje pisma (Google Fonts, licencja OFL): Archivo — tekst i nagłówki, IBM Plex Mono — liczby (ciężary, powtórzenia, czas).
 * Nazwy = klucze w `FONT_FILES` (ładowane w app/_layout.tsx). Z własnym krojem nie ustawiamy fontWeight — grubość wybiera rodzina.
 */
const ARCHIVO = { regular: 'Archivo_400Regular', semibold: 'Archivo_600SemiBold', heavy: 'Archivo_800ExtraBold' } as const;
/** Decyzja właściciela 06.10.2026 (wariant A): Archivo nie ma cyrylicy — dla bg/sr/uk krój tekstu IBM Plex Sans (ta sama rodzina co cyfry
 * IBM Plex Mono; najgrubszy 700 zamiast 800). Znalezisko testu tests/matrix-i18n.test.tsx. */
const PLEX_SANS = { regular: 'IBMPlexSans_400Regular', semibold: 'IBMPlexSans_600SemiBold', heavy: 'IBMPlexSans_700Bold' } as const;
export const CYRILLIC_LANGS = ['bg', 'sr', 'uk'] as const;
type FontSet = { regular: string; semibold: string; heavy: string; mono: string; monoBold: string };
/** Kroje bieżącego języka — obiekt zmieniany przez applyFontsFor (style liczone przy renderze czytają aktualną wartość). */
export const F: FontSet = { ...ARCHIVO, mono: 'IBMPlexMono_500Medium', monoBold: 'IBMPlexMono_600SemiBold' };
export function applyFontsFor(lang: string) { Object.assign(F, (CYRILLIC_LANGS as readonly string[]).includes(lang) ? PLEX_SANS : ARCHIVO); }
/* eslint-disable @typescript-eslint/no-var-requires */
export const FONT_FILES = {
  [ARCHIVO.regular]: require('@expo-google-fonts/archivo/400Regular/Archivo_400Regular.ttf'),
  [ARCHIVO.semibold]: require('@expo-google-fonts/archivo/600SemiBold/Archivo_600SemiBold.ttf'),
  [ARCHIVO.heavy]: require('@expo-google-fonts/archivo/800ExtraBold/Archivo_800ExtraBold.ttf'),
  [PLEX_SANS.regular]: require('@expo-google-fonts/ibm-plex-sans/400Regular/IBMPlexSans_400Regular.ttf'),
  [PLEX_SANS.semibold]: require('@expo-google-fonts/ibm-plex-sans/600SemiBold/IBMPlexSans_600SemiBold.ttf'),
  [PLEX_SANS.heavy]: require('@expo-google-fonts/ibm-plex-sans/700Bold/IBMPlexSans_700Bold.ttf'),
  [F.mono]: require('@expo-google-fonts/ibm-plex-mono/500Medium/IBMPlexMono_500Medium.ttf'),
  [F.monoBold]: require('@expo-google-fonts/ibm-plex-mono/600SemiBold/IBMPlexMono_600SemiBold.ttf'),
};
