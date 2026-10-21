/*
 * Propozycja nowego lib/theme.ts — system M3 zatwierdzony na STOP E3 (właściciel, 21.10.2026; docs/18). Przekazanie E4 roli 04 dla roli 08 (partia p1).
 * NIE jest importowany przez aplikację. Przeniesienie (rola 08, partia p1):
 *   1. docs/design/tokeny.ts → lib/tokens.ts (bez zmian treści), ten plik → lib/theme.ts; import niżej: './tokeny' → './tokens';
 *   2. kroje: docs/design/fonty/barlow-condensed/BarlowCondensed-{SemiBold,Bold}.ttf + OFL.txt → assets/fonts/ (bez nowej zależności npm;
 *      paczka @expo-google-fonts/barlow-condensed tylko za zgodą właściciela — zasada „bez nowych zależności”);
 *   3. stare API (light, dark, lightHC, darkHC, Theme, useTheme, applyTheme, F, FONT_FILES, FALLBACK_SCRIPTS, TEXT_SCALE_MAX, NUM_SCALE_MAX, BRAND) zostaje,
 *      więc p1 może podmienić plik bez ruszania 50 ekranów naraz; nowe API: font(), RADIUS, SPACE, SIZE, MOTION, HAPTICS, MOTIF, SET_FIELDS, ICON;
 *   4. potem ekrany przechodzą z F.* i liczbowych fontSize/borderRadius na font(rola) i RADIUS (M1-036, znalezisko 04-011: 15 wielkości, 18 promieni)
 *      — strażnik w Jest (wymóg 04-011): zakaz liczbowych fontSize i borderRadius poza lib/theme.ts i lib/tokens.ts, z listą wyjątków z powodem.
 *
 * Co obejmuje (sprawdzone w E4): M1-036 — pismo (TYPE: 18 ról, skala DEC-10) i promienie (RADIUS: 12 › 8 › 4 › 3, okrągłe);
 * M1-031 — warianty „Zwiększ kontrast” (lightHC, darkHC, motyw A2 znika); ZM-07 — mapa haptyki (HAPTICS) z dwoma przełącznikami;
 * M1-024 — „Pogrubiony tekst” dla własnego kroju (Barlow 600 → 700). Kontrast par: docs/design/tokeny-kontrast.txt (210/210, kod 0).
 */
import { Appearance, useColorScheme, type TextStyle } from 'react-native';
import { useA11yPrefs, boldTextOn } from '@/lib/a11yPrefs';
import {
  light as L, dark as D, lightHC as LHC, darkHC as DHC, TYPE, FONT, TEXT_SCALE, type Palette, type TypeRole,
} from './tokeny';

export { TYPE, FONT, TEXT_SCALE, RADIUS, SPACE, SIZE, MOTION, HAPTICS, MOTIF, SET_FIELDS, ICON } from './tokeny';
export type { Palette, PaletteKey, TypeRole, TypeToken, HapticEvent } from './tokeny';

/*
 * Ikona aplikacji, intro (rysunek) i Live Activity zostają przy rysunku „Tuleja” (decyzja STOP E2, 21.10.2026): papier i tusz ikony. To NIE są barwy interfejsu.
 * Tło ekranu startowego i intro = bg z palety (decyzja STOP E3, 21.10.2026) — lib/brandIcon.ts iconColors().bg ma zwracać light.bg / dark.bg,
 * a sama ikona (assets/icon*.png) zostaje na papierze. `signal` (niebieski talerza 20 kg) zostaje tylko jako barwa talerza ikony.
 */
export const BRAND = { paper: '#F4F3EF', ink: '#15171A', signal: '#1F5FD1' } as const;

/** Palety (klucze jak dotąd + tablica i motyw A2). Pochodzenie barw i pary kontrastu: komentarze w lib/tokens.ts, docs/design/design-spec.md §1. */
export const light: Palette = L;
export const dark: Palette = D;
export type Theme = Palette;
/** „Zwiększ kontrast” (M1-031): tekst pomocniczy i akcent ≥ 7:1, elementy ≥ 4,5:1; motyw talerzy równy tłu. Test: tests/audit-m1-031-contrast.test.tsx. */
export const lightHC: Theme = LHC;
export const darkHC: Theme = DHC;

/** DEC-10 / A11-07: limity Dynamic Type — te same wartości co dotąd (opisy 200%, liczby w kolumnach 130%); pasek zakładek i tygodnia: TEXT_SCALE.bar. */
export const TEXT_SCALE_MAX = TEXT_SCALE.text;
export const NUM_SCALE_MAX = TEXT_SCALE.num;

/** Wygląd z ustawień (decyzja 05.10.2026, domyślnie jasny). Bez zmian. */
export function applyTheme(x: 'light' | 'dark' | 'auto' | undefined) { try { Appearance.setColorScheme(x === 'dark' ? 'dark' : x === 'auto' ? 'unspecified' : 'light'); } catch { /* bez natywnego modułu (web) */ } }
export function useTheme(): Theme {
  const { contrast } = useA11yPrefs();
  const lightScheme = useColorScheme() === 'light'; return contrast ? (lightScheme ? lightHC : darkHC) : lightScheme ? light : dark;
}

/*
 * Pismo. Tytuły, tablica i liczby: Barlow Condensed 600/700 (OFL). Treść, przyciski, listy: krój systemowy (SF Pro) — fontFamily 'System' + fontWeight,
 * więc Dynamic Type i „Pogrubiony tekst” obsługuje system. [DO USTALENIA, lista „tylko telefon”]: czy iOS sam pogrubia 'System' z jawnym fontWeight przy
 * „Pogrubiony tekst” — jeśli nie, przesunąć wagę jak dla Barlow (400→600, 600→700).
 * Barlow nie ma greki ani cyrylicy (sprawdzone na plikach TTF: brak U+03B1 i U+0430) — litery idą krojem zastępczym systemu (Core Text cascade list),
 * cyfry i „×” zostają w Barlow (decyzja STOP E3, 21.10.2026). Cyfry Barlow są domyślnie proporcjonalne (cecha `pnum`); `tnum` jest w obu plikach,
 * więc role z `tabular` dostają fontVariant: ['tabular-nums'] (liczniki i kolumny się nie przesuwają).
 */
const BARLOW: Record<'title600' | 'title700', string> = { title600: FONT.title600, title700: FONT.title700 };
/** M1-024: własny krój nie dziedziczy wagi od systemu — przy „Pogrubiony tekst” 600 → 700 (700 to najgrubszy załadowany plik). */
const barlow = (f: 'title600' | 'title700'): string => (boldTextOn() && f === 'title600' ? BARLOW.title700 : BARLOW[f]);

/**
 * Styl tekstu dla roli z TYPE (rozmiar, interlinia, krój, waga, cyfry tabelaryczne, rozstrzelenie). Limit powiększenia to osobny prop Text:
 * maxFontSizeMultiplier={maxScale(rola)} — RN nie przyjmuje go w stylu. Wersaliki (`upper`) robi upperText() z components/ui.tsx, nie styl.
 */
export function font(role: TypeRole): TextStyle {
  const x = TYPE[role];
  const s: TextStyle = { fontSize: x.size, lineHeight: x.lineHeight };
  if (x.font === 'body') { s.fontFamily = 'System'; s.fontWeight = x.weight ?? '400'; } else s.fontFamily = barlow(x.font);
  if (x.tabular) s.fontVariant = ['tabular-nums'];
  if (x.tracking) s.letterSpacing = +(x.tracking * x.size).toFixed(2);
  return s;
}
/** maxFontSizeMultiplier dla roli (DEC-10): opis 2, liczba 1,3, pasek 1,25; 'stala' — cyfry tablicy liczone z szerokości (boardDigitSize), bez skalowania. */
export function maxScale(role: TypeRole): number {
  const sc = TYPE[role].scale;
  return sc === 'opis' ? TEXT_SCALE.text : sc === 'liczba' ? TEXT_SCALE.num : sc === 'pasek' ? TEXT_SCALE.bar : 1;
}
/**
 * Cyfry tablicy dopasowane do szerokości (design-spec §1 „Skala”): najmniejsze z — rozmiar roli × min(skala tekstu, 1,3), szerokość × fitWidth,
 * 105% szerokości / liczba znaków (żeby „187,5 lb × 12” mieściło się w jednym wierszu przy 320 pt). `fontScale` = PixelRatio.getFontScale().
 */
export function boardDigitSize(role: 'boardNumber' | 'boardClock', width: number, chars: number, fontScale: number): number {
  const x = TYPE[role];
  return Math.floor(Math.min(x.size * Math.min(fontScale, TEXT_SCALE.num), width * (x.fitWidth ?? 1), (width * 1.05) / Math.max(1, chars)));
}

/**
 * Zgodność wsteczna dla p1 (do usunięcia, gdy ekrany przejdą na font()): dawne role IBM Plex → nowy system.
 * regular/semibold → systemowy (waga z font(); przy samym F.* waga ginie — dlatego F zostaje tylko na czas migracji), heavy/display → Barlow 700,
 * mono/monoBold (liczby w kolumnach, zegary) → Barlow 600/700 z fontVariant tabular-nums przez font('boardField'|'stat'|…).
 */
export const F = {
  get regular() { return 'System'; }, get semibold() { return 'System'; },
  get heavy() { return barlow('title700'); }, get display() { return barlow('title700'); },
  get mono() { return barlow('title600'); }, get monoBold() { return barlow('title700'); },
};

/*
 * Pisma idące celowo krojem zastępczym systemu: dotąd CJK (Fala 4, 09.10.2026); od M3 także grecki i cyrylica (STOP E3, 21.10.2026),
 * bo Barlow ich nie ma. Testy tests/matrix-i18n i tests/i18n-wave4 sprawdzają, że każda inna litera jest w kroju — rola 08 rozszerza je o nowe zakresy.
 */
export const FALLBACK_SCRIPTS = /[Ͱ-ϿЀ-ԯἀ-῿ᄀ-ᇿ　-〿぀-ヿ㄰-㆏ㇰ-ㇿ㐀-䶿一-鿿가-힯豈-﫿＀-￯]/;

/** Pliki krojów ładowane w app/_layout.tsx (useFonts). Ścieżka docelowa w lib/ (po przeniesieniu plików do assets/fonts/). */
export const FONT_FILES = {
  [FONT.title600]: require('../assets/fonts/BarlowCondensed-SemiBold.ttf'),
  [FONT.title700]: require('../assets/fonts/BarlowCondensed-Bold.ttf'),
};
