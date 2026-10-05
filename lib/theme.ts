import { useColorScheme } from 'react-native';

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
export function useTheme(): Theme { return useColorScheme() === 'light' ? light : dark; }

/**
 * Kroje pisma (Google Fonts, licencja OFL): Archivo — tekst i nagłówki, IBM Plex Mono — liczby (ciężary, powtórzenia, czas).
 * Nazwy = klucze w `FONT_FILES` (ładowane w app/_layout.tsx). Z własnym krojem nie ustawiamy fontWeight — grubość wybiera rodzina.
 */
export const F = { regular: 'Archivo_400Regular', semibold: 'Archivo_600SemiBold', heavy: 'Archivo_800ExtraBold', mono: 'IBMPlexMono_500Medium', monoBold: 'IBMPlexMono_600SemiBold' } as const;
/* eslint-disable @typescript-eslint/no-var-requires */
export const FONT_FILES = {
  [F.regular]: require('@expo-google-fonts/archivo/400Regular/Archivo_400Regular.ttf'),
  [F.semibold]: require('@expo-google-fonts/archivo/600SemiBold/Archivo_600SemiBold.ttf'),
  [F.heavy]: require('@expo-google-fonts/archivo/800ExtraBold/Archivo_800ExtraBold.ttf'),
  [F.mono]: require('@expo-google-fonts/ibm-plex-mono/500Medium/IBMPlexMono_500Medium.ttf'),
  [F.monoBold]: require('@expo-google-fonts/ibm-plex-mono/600SemiBold/IBMPlexMono_600SemiBold.ttf'),
};
