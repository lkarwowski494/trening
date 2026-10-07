import { locale } from './i18n';
import type { Workout } from './seed';

/*
 * Kalendarz w Historii (docs/21 pkt 4a, kolejność zatwierdzona przez właściciela 07.10.2026 wieczór): miesiąc, dni z treningiem.
 * Tydzień od poniedziałku — tak jak tygodnie w statystykach (lib/stats.ts, thisMonday). Dni liczone w czasie lokalnym telefonu.
 */
export type Cell = { y: number; m: number; d: number; key: string; inMonth: boolean };

/** Klucz dnia w czasie lokalnym: „RRRR-MM-DD”. */
export const dayKey = (ts: number) => { const x = new Date(ts); return keyOf(x.getFullYear(), x.getMonth(), x.getDate()); };
const keyOf = (y: number, m: number, d: number) => `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;

/** Siatka miesiąca `m` (0–11): pełne tygodnie od poniedziałku; dni sąsiednich miesięcy z inMonth = false. 4–6 tygodni. */
export function monthGrid(y: number, m: number): Cell[][] {
  const first = new Date(y, m, 1); const lead = (first.getDay() + 6) % 7; const days = new Date(y, m + 1, 0).getDate();
  const weeks = Math.ceil((lead + days) / 7); const out: Cell[][] = [];
  for (let w = 0; w < weeks; w++) out.push(Array.from({ length: 7 }, (_, i) => { const x = new Date(y, m, 1 - lead + w * 7 + i); return { y: x.getFullYear(), m: x.getMonth(), d: x.getDate(), key: keyOf(x.getFullYear(), x.getMonth(), x.getDate()), inMonth: x.getMonth() === m }; }));
  return out;
}

/** Zakończone treningi pogrupowane po dniu rozpoczęcia (czas lokalny). */
export function workoutsByDay(ws: readonly Workout[]): Map<string, Workout[]> {
  const out = new Map<string, Workout[]>();
  for (const w of ws) { if (!w.finishedAt) continue; const k = dayKey(w.startedAt); const a = out.get(k); if (a) a.push(w); else out.set(k, [w]); }
  return out;
}

/** Miesiąc przesunięty o `delta` (np. −1 — poprzedni). */
export const shiftMonth = (y: number, m: number, delta: number) => { const x = new Date(y, m + delta, 1); return { y: x.getFullYear(), m: x.getMonth() }; };

/** Skróty dni tygodnia od poniedziałku w języku aplikacji (Intl). 2024-01-01 to poniedziałek. */
export const weekdayLabels = (): string[] => Array.from({ length: 7 }, (_, i) => new Date(2024, 0, 1 + i).toLocaleDateString(locale(), { weekday: 'short' }));
/** Tytuł miesiąca, np. „październik 2026”. */
export const monthTitle = (y: number, m: number) => new Date(y, m, 1).toLocaleDateString(locale(), { month: 'long', year: 'numeric' });
/** Pełna data dnia dla VoiceOver, np. „7 października 2026”. */
export const dayTitle = (c: Pick<Cell, 'y' | 'm' | 'd'>) => new Date(c.y, c.m, c.d).toLocaleDateString(locale(), { day: 'numeric', month: 'long', year: 'numeric' });
