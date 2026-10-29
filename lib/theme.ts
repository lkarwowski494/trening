/*
 * Wygląd aplikacji — system M3 (kierunek A „tablica podejść”, wariant A2), zatwierdzony na STOP E3 (właściciel, 21.10.2026; docs/18). Partia p1 przeniosła tu
 * propozycję z docs/design/theme.ts; tokeny (barwy, pismo, promienie, odstępy, rozmiary, ruch, haptyka, pola serii, ikony) są w lib/tokens.ts
 * (kopia docs/design/tokeny.ts) i opisane w docs/design/design-spec.md. Ten plik: palety pod starymi nazwami (`light`, `dark`, `lightHC`, `darkHC`, `useTheme`),
 * `font(rola)`, `maxScale(rola)`, `boardDigitSize()`, `titleMaxScale()`, kroje (`FONT_FILES`) i `FW` (waga kroju systemowego).
 * Ekrany przechodzą z liczbowych fontSize / borderRadius na font(rola) i RADIUS w partiach p2–p5 (tests/m3-token-guard.test.ts pilnuje, żeby literałów nie przybywało).
 * Obejmuje M1-036 (pismo TYPE, promienie RADIUS), M1-031 („Zwiększ kontrast”), M1-024 („Pogrubiony tekst”) i mapę haptyki HAPTICS (ZM-07; wibracje wdrażają p2 i p5).
 */
import { Appearance, useColorScheme, type TextStyle } from 'react-native';
import { useA11yPrefs, boldTextOn } from './a11yPrefs';
import {
  light as L, dark as D, lightHC as LHC, darkHC as DHC, TYPE, FONT, TEXT_SCALE, type Palette, type TypeRole,
} from './tokens';

export { TYPE, FONT, TEXT_SCALE, TEXT_SIZE, RADIUS, SPACE, HEADER, SIZE, MOTION, HAPTICS, MOTIF, SET_FIELDS, ICON } from './tokens';
export type { Palette, PaletteKey, TypeRole, TypeToken, HapticEvent } from './tokens';

/*
 * Ikona aplikacji, intro (rysunek) i Live Activity zostają przy rysunku „Tuleja” (decyzja STOP E2, 21.10.2026): papier i tusz ikony. To NIE są barwy interfejsu.
 * Tło ekranu startowego i intro = bg z palety (decyzja STOP E3, 21.10.2026) — lib/brandIcon.ts iconColors().bg zwraca light.bg / dark.bg,
 * a sama ikona (assets/icon*.png) zostaje na papierze. `signal` (niebieski talerza 20 kg) zostaje tylko jako barwa talerza ikony.
 */
export const BRAND = { paper: '#F4F3EF', ink: '#15171A', signal: '#1F5FD1' } as const;

/** Palety (klucze jak dotąd + tablica i motyw A2). Pochodzenie barw i pary kontrastu: komentarze w lib/tokens.ts, docs/design/design-spec.md §1. */
export const light: Palette = L;
export const dark: Palette = D;
export type Theme = Palette;
/** „Zwiększ kontrast” (M1-031): tekst pomocniczy i akcent ≥ 7:1, elementy ≥ 4,5:1; motyw talerzy równy tłu. Test: tests/audit-m1-031-contrast.test.tsx, tests/m3-contrast.test.ts. */
export const lightHC: Theme = LHC;
export const darkHC: Theme = DHC;

/** DEC-10 / A11-07: limity Dynamic Type — te same wartości co dotąd (opisy 200%, liczby w kolumnach 130%); pasek zakładek i tygodnia: TEXT_SCALE.bar. */
export const TEXT_SCALE_MAX = TEXT_SCALE.text;
export const NUM_SCALE_MAX = TEXT_SCALE.num;
/** Znaki-ikony w tekście (strzałki, znaczek zaznaczenia, krzyżyk…): limit powiększenia 1,4 (jak przyciski nagłówka — S2). Bez limitu rosną do 310% („Większe rozmiary dostępności”) i wychodzą poza pole albo są ucinane (T-04, telefon 27.10.2026). Strażnik: tests/matrix-a11y.test.tsx. */
export const GLYPH_SCALE_MAX = 1.4;

/** Wygląd z ustawień (decyzja 05.10.2026, domyślnie jasny). Bez zmian. */
export function applyTheme(x: 'light' | 'dark' | 'auto' | undefined) { try { Appearance.setColorScheme(x === 'dark' ? 'dark' : x === 'auto' ? 'unspecified' : 'light'); } catch { /* bez natywnego modułu (web) */ } }
export function useTheme(): Theme {
  const { contrast } = useA11yPrefs();
  const lightScheme = useColorScheme() === 'light'; return contrast ? (lightScheme ? lightHC : darkHC) : lightScheme ? light : dark;
}

/*
 * Pismo. Tytuły, tablica i liczby: Barlow Condensed 600/700 (OFL; assets/fonts). Treść, przyciski, listy: krój systemowy (SF Pro) — fontFamily 'System' + fontWeight,
 * więc Dynamic Type obsługuje system. „Pogrubiony tekst” (M1-024): własny krój nie dziedziczy wagi od systemu, a iOS nie pogrubia 'System' z jawnym fontWeight
 * `[DO USTALENIA, lista „tylko telefon”]`, więc waga przesuwa się o stopień także dla kroju systemowego (400 → 600, 600 → 700) — jak dotąd dla Plex.
 * Barlow nie ma greki ani cyrylicy (sprawdzone na plikach TTF: brak U+03B1 i U+0430) — litery idą krojem zastępczym systemu (Core Text cascade list),
 * cyfry i „×” zostają w Barlow (decyzja STOP E3, 21.10.2026). Cyfry Barlow są domyślnie proporcjonalne (cecha `pnum`); `tnum` jest w obu plikach,
 * więc role z `tabular` dostają fontVariant: ['tabular-nums'] (liczniki i kolumny się nie przesuwają).
 */
type Weight = '400' | '600' | '700';
/** M1-024: waga kroju systemowego o stopień wyżej przy „Pogrubiony tekst” (700 to najgrubsza używana). */
function weight(w: Weight): Weight { return boldTextOn() ? (w === '400' ? '600' : '700') : w; }
/** M1-024: własny krój (Barlow) — 600 → 700 (700 to najgrubszy załadowany plik). */
const barlow = (f: 'title600' | 'title700'): string => (boldTextOn() && f === 'title600' ? FONT.title700 : FONT[f]);

/**
 * Styl tekstu dla roli z TYPE (rozmiar, interlinia, krój, waga, cyfry tabelaryczne, rozstrzelenie). Limit powiększenia to osobny prop Text:
 * maxFontSizeMultiplier={maxScale(rola)} — RN nie przyjmuje go w stylu. Wersaliki (`upper`) robi upperText() z components/ui.tsx, nie styl.
 */
export function font(role: TypeRole): TextStyle {
  const x = TYPE[role];
  const s: TextStyle = { fontSize: x.size, lineHeight: x.lineHeight };
  if (x.font === 'body') { s.fontFamily = 'System'; s.fontWeight = weight(x.weight ?? '400'); } else s.fontFamily = barlow(x.font);
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
 * Duży tytuł (design-spec §1 „Skala”): rośnie z tekstem systemu najwyżej do 13% szerokości ekranu (uproszczenie zamiast adjustsFontSizeToFit — przy AX5 słowo
 * „Προπόνηση” łamało się w środku) i nie więcej niż do 200% (DEC-10). Wynik to maxFontSizeMultiplier dla roli `largeTitle`.
 */
export function titleMaxScale(width: number): number {
  return Math.max(1, Math.min(TEXT_SCALE.text, +((width * 0.13) / TYPE.largeTitle.size).toFixed(4)));
}
/**
 * Cyfry tablicy dopasowane do szerokości (design-spec §1 „Skala”): najmniejsze z — rozmiar roli × min(skala tekstu, 1,3), szerokość × fitWidth,
 * 105% szerokości miejsca / liczba znaków (żeby „187,5 lb × 12” mieściło się w jednym wierszu przy 320 pt). `fontScale` = PixelRatio.getFontScale().
 * `avail` (04-studio-projektowe-001) = szerokość miejsca na wiersz liczb (ekran bez marginesów); domyślnie `width`. Udział szerokości ekranu (fitWidth) liczy się od `width`, jak w makiecie.
 */
export function boardDigitSize(role: 'boardNumber' | 'boardClock', width: number, chars: number, fontScale: number, avail: number = width): number {
  const x = TYPE[role];
  return Math.floor(Math.min(x.size * Math.min(fontScale, TEXT_SCALE.num), width * (x.fitWidth ?? 1), (avail * 1.05) / Math.max(1, chars)));
}

/**
 * Waga kroju systemowego jako fragment stylu: `...FW.regular` / `...FW.semibold` / `...FW.bold` zamiast dawnych `fontFamily: F.regular` / `F.semibold`
 * (kroj 'System' sam nie niesie wagi). Getter — wartość zależy od „Pogrubiony tekst” w chwili renderu (useTheme() odświeża komponent przy zmianie).
 */
export const FW = {
  get regular(): TextStyle { return { fontFamily: 'System', fontWeight: weight('400') }; },
  get semibold(): TextStyle { return { fontFamily: 'System', fontWeight: weight('600') }; },
  get bold(): TextStyle { return { fontFamily: 'System', fontWeight: weight('700') }; },
};

/**
 * Zgodność wsteczna (dawne role IBM Plex → system M3): heavy/display → Barlow 700, mono/monoBold (liczby w kolumnach, zegary) → Barlow 600/700
 * (cyfry tabelaryczne ustawia font(rola) albo NUM_FONT). regular/semibold → 'System' BEZ wagi — w kodzie aplikacji zastępuje je FW (strażnik:
 * tests/m3-token-guard.test.ts); zostają, żeby stare odwołania w testach i narzędziach nie rzucały błędu.
 */
export const F = {
  get regular() { return 'System'; }, get semibold() { return 'System'; },
  get heavy() { return barlow('title700'); }, get display() { return barlow('title700'); },
  get mono() { return barlow('title600'); }, get monoBold() { return barlow('title700'); },
};

/*
 * Pisma idące celowo krojem zastępczym systemu: dotąd CJK (Fala 4, 09.10.2026); od M3 także grecki i cyrylica (STOP E3, 21.10.2026),
 * bo Barlow ich nie ma. Zakresy wprost (bez \p{scx=…} — pewne w Hermesie): grecki (U+0370–03FF), cyrylica (U+0400–052F), grecki rozszerzony (U+1F00–1FFF),
 * Jamo, interpunkcja CJK, hiragana, katakana, bopomofo, CJK Ext A, ideogramy, hangul, ideogramy zgodności, formy pełnej szerokości.
 * Testy tests/matrix-i18n i tests/i18n-wave4 sprawdzają, że każda inna litera jest w kroju Barlow.
 */
export const FALLBACK_SCRIPTS = /[Ͱ-ϿЀ-ԯἀ-῿ᄀ-ᇿ　-〿぀-ヿ㄰-㆏ㇰ-ㇿ㐀-䶿一-鿿가-힯豈-﫿＀-￯]/;

/** Pliki krojów ładowane w app/_layout.tsx (useFonts). */
export const FONT_FILES = {
  [FONT.title600]: require('../assets/fonts/BarlowCondensed-SemiBold.ttf'),
  [FONT.title700]: require('../assets/fonts/BarlowCondensed-Bold.ttf'),
};
