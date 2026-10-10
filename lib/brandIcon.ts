import { PLATE_COLORS, type PlateColor } from './plates';
import { BRAND, dark } from './theme';

/*
 * Ikona aplikacji (styl „Tuleja”, 07.10.2026) jako dane — jedno źródło geometrii dla animacji startowej (components/Intro.tsx).
 * Jednostki = viewBox 0 0 120 120 plików assets/brand/icon*.svg i splash*.svg; tests/intro.test.tsx sprawdza, że pliki SVG mają dokładnie te
 * prostokąty i kolory (pliki rysują ikonę i ekran startowy iOS — scripts/brand/icon.mjs → assets/*.png).
 * Kolory talerzy: lib/plates.ts PLATE_COLORS (IWF). Wariant ciemny ikony iOS (assets/brand/icon-dark.svg) ma rozjaśnioną czerwień, niebieski
 * i zieleń na ciemnym tle systemu — te trzy odcienie są tylko tutaj; gryf i zacisk w ciemnym = kolor tekstu motywu ciemnego.
 */
export const ICON_VIEWBOX = 120;
export type IconRect = { x: number; y: number; w: number; h: number; rx: number };
/** Gryf (koniec sztangi) — jedyny element ekranu startowego (assets/brand/splash*.svg): talerze wsuwają się na niego w animacji. */
export const ICON_BAR: IconRect = { x: 10, y: 56, w: 98, h: 8, rx: 2 };
/** Talerze od najcięższego (25, 20, 15, 10 kg) — kolejność ładowania i kolejność w animacji. */
export const ICON_PLATES: readonly (IconRect & { color: PlateColor })[] = [
  { x: 30, y: 16, w: 15, h: 88, rx: 4, color: 'red' },
  { x: 48, y: 23, w: 14, h: 74, rx: 4, color: 'blue' },
  { x: 65, y: 31, w: 12, h: 58, rx: 4, color: 'yellow' },
  { x: 80, y: 38, w: 10, h: 44, rx: 3, color: 'green' },
];
/** Zacisk — zamyka ładowanie (w kolorze gryfu). */
export const ICON_COLLAR: IconRect = { x: 93, y: 49, w: 7, h: 22, rx: 2 };

export const ICON_SCHEMES = ['light', 'dark'] as const;
export type IconScheme = (typeof ICON_SCHEMES)[number];
/** Odcienie talerzy wariantu ciemnego ikony iOS (assets/brand/icon-dark.svg); żółty i biały bez zmian. */
const DARK_PLATES: Readonly<Record<PlateColor, string>> = { red: '#E8414F', blue: '#4A82F0', yellow: PLATE_COLORS.yellow, green: '#3FBE72', white: PLATE_COLORS.white };
/** Kolory ikony i ekranu startowego: tło (= tło ekranu startowego w app.json i tło motywu), gryf/zacisk, talerze. */
export function iconColors(s: IconScheme): { bg: string; ink: string; plate: Readonly<Record<PlateColor, string>> } {
  return s === 'dark' ? { bg: dark.bg, ink: dark.text, plate: DARK_PLATES } : { bg: BRAND.paper, ink: BRAND.ink, plate: PLATE_COLORS };
}
