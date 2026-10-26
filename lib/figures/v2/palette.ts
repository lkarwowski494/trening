/*
 * Figury v2 — kolory z motywu. Żadnych kolorów na sztywno: wszystkie role wynikają z tokenów palety aplikacji (lib/tokens przez lib/theme)
 * i z ich mieszania (mixHex). Dzięki temu figura działa w jasnym, ciemnym i „Zwiększ kontrast” bez osobnych wartości.
 */
import type { Role } from './scene';

/** Podzbiór palety aplikacji, którego potrzebuje figura (zgodny z Theme z lib/theme). */
export type FigureTheme = { danger: string; bg: string; surface: string; surface2: string; line: string; ctrlLine: string; text: string; muted: string; accent: string; band: string; doneLine: string; less: string };

const hex = (c: string): [number, number, number] => { const m = /^#([0-9a-f]{6})$/i.exec(c); if (!m) throw new Error('kolor: ' + c); const n = parseInt(m[1], 16); return [(n >> 16) & 255, (n >> 8) & 255, n & 255]; };
/** Mieszanie dwóch kolorów #RRGGBB: k = 0 → a, k = 1 → b. */
export function mixHex(a: string, b: string, k: number): string {
  const A = hex(a), B = hex(b);
  return '#' + [0, 1, 2].map(i => Math.round(A[i] + (B[i] - A[i]) * k).toString(16).padStart(2, '0')).join('').toUpperCase();
}
/** Luminancja względna (WCAG). */
export function luminance(c: string): number {
  const [r, g, b] = hex(c).map(v => { const s = v / 255; return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4); });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}
export const contrast = (a: string, b: string): number => { const la = luminance(a), lb = luminance(b); return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05); };

export type FigurePalette = Record<Role, string>;
/**
 * Role → kolory. Skóra to neutralna „manekinowa” szarość (bez odcieni skóry: decyzja o wariantach tonu — otwarta), ubranie = akcent aplikacji
 * (granat w jasnym, krem w ciemnym), ciężary = barwa pasma (teal). Dalsza strona ciała bliżej tła.
 */
export function figurePalette(th: FigureTheme): FigurePalette {
  const skin = mixHex(th.ctrlLine, th.bg, 0.08);
  const dark = luminance(th.bg) < 0.3;
  const hi = (c: string): string => dark ? mixHex(c, th.text, 0.2) : mixHex(c, th.surface, 0.4);
  return {
    skinHi: hi(skin), clothHi: dark ? mixHex(th.accent, th.bg, 0.22) : mixHex(th.accent, th.surface, 0.22), error: th.danger,
    floor: th.ctrlLine, frame: th.ctrlLine, pad: th.surface2, steel: th.muted, plate: th.band, load: th.band,
    skin, skinFar: mixHex(skin, th.bg, 0.35), cloth: th.accent, clothFar: mixHex(th.accent, th.bg, 0.4),
    shoe: th.text, hair: th.text, guide: th.doneLine, cable: th.ctrlLine, muscleMain: th.less, muscleAux: mixHex(th.less, th.bg, 0.5), contactOk: th.doneLine, contactBad: th.danger,
  };
}
