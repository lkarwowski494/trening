import type { PlateColor } from './plates';
import { weekTiles } from './dashboard';
import { workingSets } from './store';
import type { Workout } from './seed';

/*
 * Motyw z ikony w aplikacji (decyzja właściciela 09.10.2026, „zestaw pełny”; docs/18): gryf i talerze w kolorach IWF (lib/plates.ts PLATE_COLORS —
 * jedno źródło dla ikony, PlateBar i tych grafik). Tu tylko liczby i reguły; rysunki — components/Motif.tsx.
 * To grafika i podsumowanie danych użytkownika, nie zalecenie treningowe — progi niżej są umowne (uproszczenie wizualne), bez twierdzeń merytorycznych.
 * Kolor nigdy nie jest jedyną informacją (WCAG 1.4.1): obok sztangi liczba „x z y”, talerz w kalendarzu ma też wysokość i opis dla VoiceOver.
 */

/** Kolejność ładowania talerzy — jak na ikonie (assets/brand/icon.svg) i jak kod barw IWF od najcięższego: 25 czerwony, 20 niebieski, 15 żółty, 10 zielony. */
export const LOAD_ORDER: readonly PlateColor[] = ['red', 'blue', 'yellow', 'green'];
/** Wysokość talerza względem największego (ikona: 88, 74, 58, 44 jednostek). */
export const PLATE_HEIGHT: Readonly<Record<PlateColor, number>> = { red: 1, blue: 0.84, yellow: 0.66, green: 0.5, white: 0.4 };
/** Kolor kolejnego talerza (po zielonym znów czerwony). */
export const plateAt = (i: number): PlateColor => LOAD_ORDER[((Math.floor(i) % LOAD_ORDER.length) + LOAD_ORDER.length) % LOAD_ORDER.length];

/** Najwięcej talerzy na sztandze tygodnia (7 dni); więcej treningów — liczba obok mówi resztę. */
export const WEEK_PLATES_MAX = 7;
export type WeekBar = {
  /** 'plan' — talerze = dni treningowe w planie tego tygodnia, załadowane = zrobione z planu; 'free' — bez planu: talerz za każdy trening tygodnia */
  mode: 'plan' | 'free'; done: number; total: number; plates: { color: PlateColor; loaded: boolean }[];
};
/**
 * Postęp tygodnia jako ładowana sztanga. Z planem: talerzy tyle, ile dni z treningiem w planie bieżącego tygodnia (z jednodniowymi zmianami —
 * ten sam pasek co karta „Dziś”), załadowane = dni zrobione zaplanowanym szablonem (weekTiles.planDone — ta sama liczba co „Z planu w tym
 * tygodniu: zrobione x z n”). Bez planu (albo plan bez dni w tym tygodniu): aplikacja nie wyznacza celu (decyzja 03.10.2026: plan ustawia
 * użytkownik), więc talerz za każdy zakończony trening tygodnia, bez pustych miejsc.
 */
export function weekBar(now = Date.now()): WeekBar {
  const w = weekTiles(now);
  const plan = (w.planned ?? 0) > 0;
  const done = plan ? Math.min(w.planDone ?? 0, w.planned!) : w.workouts; const total = plan ? w.planned! : w.workouts;
  const shown = Math.min(total, WEEK_PLATES_MAX);
  return { mode: plan ? 'plan' : 'free', done, total, plates: Array.from({ length: shown }, (_, i) => ({ color: plateAt(i), loaded: i < done })) };
}

/** Kontrast WCAG 2.x dwóch kolorów #RRGGBB (1–21). */
export function contrast(a: string, b: string): number {
  const lum = (h: string) => { const m = /^#?([0-9a-f]{6})$/i.exec(h.trim()); if (!m) return NaN; const v = [0, 2, 4].map(i => parseInt(m[1].slice(i, i + 2), 16) / 255).map(c => c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4); return 0.2126 * v[0] + 0.7152 * v[1] + 0.0722 * v[2]; };
  const x = lum(a), y = lum(b); if (!Number.isFinite(x) || !Number.isFinite(y)) return 1;
  return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05);
}
/** Minimalny kontrast grafiki niosącej informację (WCAG 1.4.11). */
export const GRAPHIC_MIN = 3;
/** Talerz dostaje obwódkę w kolorze tekstu, gdy sam kolor ma do tła mniej niż 3:1 (np. żółty na jasnym, niebieski na ciemnej karcie). */
export const needsEdge = (fill: string, bg: string): boolean => contrast(fill, bg) < GRAPHIC_MIN;

/** Kalendarz: talerz pod dniem z treningiem — serie robocze dnia względem średniej z dni treningowych oglądanego miesiąca. */
export const DAY_LEVELS = ['light', 'usual', 'heavy'] as const;
export type DayLevel = (typeof DAY_LEVELS)[number];
/** Granice „mniej / jak zwykle / więcej” jako ułamek średniej (umowne, ±25%). */
export const DAY_LEVEL_BAND = { low: 0.75, high: 1.25 } as const;
/** Większy dzień = cięższy talerz: kolor i wysokość razem (kolor nie jest jedyną informacją). Żółty pominięty — na jasnym tle < 3:1. */
export const DAY_LEVEL_PLATE: Readonly<Record<DayLevel, PlateColor>> = { light: 'green', usual: 'blue', heavy: 'red' };
/** Serie robocze dnia (D3 — ta sama definicja co kafelki i Postępy). */
export const daySets = (ws: readonly Workout[]): number => ws.reduce((a, w) => a + workingSets(w), 0);
/** Poziom każdego dnia z serii (dni bez serii roboczych — „light”); średnia tylko z dni z seriami; jeden dzień albo równe dni — „usual”. */
export function dayLevels(sets: ReadonlyMap<string, number>): Map<string, DayLevel> {
  const vals = [...sets.values()].filter(v => Number.isFinite(v) && v > 0); const mean = vals.length ? vals.reduce((a, b) => a + b, 0) / vals.length : 0;
  const out = new Map<string, DayLevel>();
  for (const [k, v] of sets) out.set(k, !(Number.isFinite(v) && v > 0) ? 'light' : v < mean * DAY_LEVEL_BAND.low ? 'light' : v > mean * DAY_LEVEL_BAND.high ? 'heavy' : 'usual');
  return out;
}

/** Animacja „dokładania talerza” przy rekordzie: tylko świeżo po treningu (do 10 min od końca) i raz na sesję w tym uruchomieniu aplikacji. */
export const RECORD_FRESH_MS = 10 * 60 * 1000;
/** Czas wsunięcia talerza (ms). */
export const RECORD_ANIM_MS = 600;
const animated = new Set<string>();
export function shouldAnimateRecord(id: string, finishedAt: number | null | undefined, now = Date.now()): boolean {
  if (!finishedAt || !Number.isFinite(finishedAt) || now - finishedAt < 0 || now - finishedAt > RECORD_FRESH_MS || animated.has(id)) return false;
  animated.add(id); return true;
}
/** Tylko testy: zapomina, które rekordy były już animowane. */
export const __resetRecordAnim = () => animated.clear();
