import { Appearance, useColorScheme } from 'react-native';

/*
 * Styl marki „Tuleja” (decyzja właściciela 07.10.2026: „Podoba mi się grafika B”; docs/16, docs/21 pkt 6). Jedno źródło kolorów i krojów pisma.
 * Zastępuje „Kredę” (05.10.2026). Papier i atrament jako tło i tekst; akcent = niebieski talerza 20 kg (kolory talerzy: lib/plates.ts).
 * Kontrast (WCAG): tests/ux.test.tsx C5 — akcent #1F5FD1 na papierze 5,3:1, w ciemnym motywie jaśniejszy #6F9BF2.
 */
export const BRAND = { paper: '#F4F3EF', ink: '#15171A', signal: '#1F5FD1' } as const;
/* Audyt 0.10 (A11-04, A11-06): dangerInk — tekst na tle danger (przycisk „Usuń” pod wierszem; dawniej #FFFFFF: 2,77:1 w ciemnym);
 * ctrlLine — granica elementu sterującego (ramka pola, puste pole ✓, tor wyłączonego przełącznika): ≥ 3:1 do bg, surface i surface2 (WCAG 1.4.11);
 * line zostaje dla linii dekoracyjnych (separatory, karty). Test: tests/matrix-a11y (paleta), tests/audit-0.10-lang-ui. */
export const light: Record<'bg' | 'surface' | 'surface2' | 'line' | 'ctrlLine' | 'text' | 'muted' | 'accent' | 'accentInk' | 'done' | 'doneLine' | 'danger' | 'dangerInk' | 'band', string> = { bg: BRAND.paper, surface: '#ffffff', surface2: '#e9e7e1', line: '#d6d3cb', ctrlLine: '#767a80', text: BRAND.ink, muted: '#4a4d53', accent: BRAND.signal, accentInk: '#ffffff', done: '#e2ece0', doneLine: '#2e7d4f', danger: '#7f1d1d', dangerInk: '#ffffff', band: '#136f75' };
/** Ciemna wersja: grafitowe tło, papierowy tekst, ten sam niebieski (jaśniejszy). */
export const dark: typeof light = { bg: '#121316', surface: '#1b1d21', surface2: '#26282d', line: '#3a3d43', ctrlLine: '#74777e', text: '#eceae4', muted: '#a6a9af', accent: '#6f9bf2', accentInk: '#121316', done: '#1f2e24', doneLine: '#4e9a6a', danger: '#ec7a72', dangerInk: '#121316', band: '#5fc3c9' };
export type Theme = typeof dark;
/* Motyw z ikony (decyzja właściciela 09.10.2026): czerwień talerza 25 kg (lib/plates.ts PLATE_COLORS.red #D7263D, IWF) nie może mylić się z „Usuń”.
 * Jasny danger przesunięty z #b3261e (ΔE2000 9,7 do talerza, kontrast luminancji 1,32:1) na ciemną cegłę #7f1d1d (ΔE2000 17,9; 2,02:1); ciemny
 * #ec7a72 (łososiowy) — ΔE2000 17,3; 1,79:1. Do tego kształt: talerz zawsze jako zaokrąglony prostokąt przy gryfie z liczbą obok, danger tylko
 * jako tekst i przycisk ze słowem. Test: tests/motyw.test.tsx. */
/**
 * Audyt 0.10 (A11-07, WCAG 1.4.4): limity powiększenia tekstu (Dynamic Type) — jedno źródło. Teksty, które się zawijają (opisy, przyciski,
 * wiersze ustawień, nagłówki sekcji): do 200%. Kolumny liczb o stałej szerokości (wiersz serii, nagłówki kolumn, pola): 130%.
 */
export const TEXT_SCALE_MAX = 2;
export const NUM_SCALE_MAX = 1.3;
/** Wygląd z ustawień (decyzja 05.10.2026, domyślnie jasny — potwierdzone 07.10.2026). Nadpisuje tryb systemu dla całej aplikacji. */
export function applyTheme(x: 'light' | 'dark' | 'auto' | undefined) { try { Appearance.setColorScheme(x === 'dark' ? 'dark' : x === 'auto' ? 'unspecified' : 'light'); } catch { /* bez natywnego modułu (web) — tryb systemu */ } }
export function useTheme(): Theme { return useColorScheme() === 'light' ? light : dark; }

/**
 * Kroje pisma (Google Fonts, licencja OFL) — decyzje właściciela 07.10.2026 (rano wariant A „mieszany”, wieczorem bez Tektur — docs/18):
 *  - IBM Plex Sans — zwykły tekst (regular, semibold), nagłówki (heavy) i duże liczby w widoku skupionym (display) — Bold 700;
 *  - IBM Plex Mono — liczby w tabelach i timery (mono, monoBold).
 * heavy i display to dziś ten sam plik — dwie nazwy zostają, żeby rolę dało się zmienić w jednym miejscu. Oba kroje mają polskie znaki i cyrylicę (test: tests/matrix-i18n.test.tsx) — jeden zestaw dla każdego języka; Plex Mono nie ma liter greckich (A11-11: components/ui.tsx monoSafe).
 * Nazwy = klucze w `FONT_FILES` (ładowane w app/_layout.tsx). Z własnym krojem nie ustawiamy fontWeight — grubość wybiera rodzina.
 */
export const F = {
  regular: 'IBMPlexSans_400Regular', semibold: 'IBMPlexSans_600SemiBold', heavy: 'IBMPlexSans_700Bold', display: 'IBMPlexSans_700Bold',
  mono: 'IBMPlexMono_500Medium', monoBold: 'IBMPlexMono_600SemiBold',
} as const;
/**
 * Fala 4 (09.10.2026, docs/16 „Fala 4”, wariant A): japoński, koreański i chiński tradycyjny zostają przy IBM Plex — Plex nie ma kana, kanji
 * ani hangula, więc te znaki iOS rysuje krojem zastępczym z systemowej listy kaskadowej (Core Text; React Native rysuje tekst przez NSTextStorage,
 * która przypisuje znakom bez glifu krój zastępczy). Apple, CTFontCopyDefaultCascadeListForLanguages: „When the original font used for text layout
 * and rendering does not support a certain Unicode character from the provided text, the system follows this list to pick a fallback font that
 * includes the character. The font alternatives in the cascade list match the original font’s style, weight, and width.” — więc grubość (400/600/700)
 * zostaje, a łacina i cyfry (liczby, timery) dalej w Plex. To jedyne pisma, które celowo idą krojem zastępczym (test: tests/matrix-i18n,
 * tests/i18n-wave4); w każdym innym języku każda litera musi być w Plex.
 */
/* Zakresy wprost (bez \p{scx=…} — pewne w Hermesie): interpunkcja CJK, hiragana, katakana, Jamo, hangul, CJK Ext A, ideogramy, ideogramy zgodności,
 * formy pełnej szerokości (？！（）：). */
export const FALLBACK_SCRIPTS = /[\u1100-\u11FF\u3000-\u303F\u3040-\u30FF\u3130-\u318F\u31F0-\u31FF\u3400-\u4DBF\u4E00-\u9FFF\uAC00-\uD7AF\uF900-\uFAFF\uFF00-\uFFEF]/;
/* eslint-disable @typescript-eslint/no-var-requires */
export const FONT_FILES = {
  [F.regular]: require('@expo-google-fonts/ibm-plex-sans/400Regular/IBMPlexSans_400Regular.ttf'),
  [F.semibold]: require('@expo-google-fonts/ibm-plex-sans/600SemiBold/IBMPlexSans_600SemiBold.ttf'),
  [F.heavy]: require('@expo-google-fonts/ibm-plex-sans/700Bold/IBMPlexSans_700Bold.ttf'), /* = F.display */
  [F.mono]: require('@expo-google-fonts/ibm-plex-mono/500Medium/IBMPlexMono_500Medium.ttf'),
  [F.monoBold]: require('@expo-google-fonts/ibm-plex-mono/600SemiBold/IBMPlexMono_600SemiBold.ttf'),
};
