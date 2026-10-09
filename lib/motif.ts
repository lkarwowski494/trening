import type { PlateColor } from './plates';
import { weekTiles } from './dashboard';
import type { DayStatus } from './plan';

/*
 * Motyw z ikony w aplikacji (decyzja właściciela 09.10.2026, „zestaw pełny”; docs/18): gryf i talerze w kolorach IWF (lib/plates.ts PLATE_COLORS —
 * jedno źródło dla ikony, PlateBar i tych grafik). Tu tylko liczby i reguły; rysunki — components/Motif.tsx.
 * To grafika i podsumowanie danych użytkownika, nie zalecenie treningowe — progi niżej są umowne (uproszczenie wizualne), bez twierdzeń merytorycznych.
 * Kolor nigdy nie jest jedyną informacją (WCAG 1.4.1): zrobione = wypełnienie, zaplanowane = obwódka (kształt), obok stosów procent i „x z y”,
 * stan dnia w etykiecie i wartości VoiceOver.
 */

/** Kolejność ładowania talerzy — jak na ikonie (assets/brand/icon.svg) i jak kod barw IWF od najcięższego: 25 czerwony, 20 niebieski, 15 żółty, 10 zielony. */
export const LOAD_ORDER: readonly PlateColor[] = ['red', 'blue', 'yellow', 'green'];
/** Wysokość talerza względem największego (ikona: 88, 74, 58, 44 jednostek). */
export const PLATE_HEIGHT: Readonly<Record<PlateColor, number>> = { red: 1, blue: 0.84, yellow: 0.66, green: 0.5, white: 0.4 };
/** Kolor kolejnego talerza (po zielonym znów czerwony). */
export const plateAt = (i: number): PlateColor => LOAD_ORDER[((Math.floor(i) % LOAD_ORDER.length) + LOAD_ORDER.length) % LOAD_ORDER.length];

/*
 * Korekta właściciela 09.10.2026 ok. 17:00 (docs/18): kolor talerzy nic nie koduje (odrzucone: kolor = serie względem średniej, kolor po kolei).
 * Jedyny kod „zrobione / zaplanowane” to mała ikona aplikacji pod dniem (wypełniona) albo sama jej obwódka; postęp tygodnia — stosy talerzy.
 */
/** Talerze ikony aplikacji (assets/brand/icon.svg, viewBox 120): szerokość = grubość talerza, wysokość = średnica — od lewej, jak kod barw IWF. */
export const ICON_PLATES: readonly { color: PlateColor; w: number; h: number }[] = [{ color: 'red', w: 15, h: 88 }, { color: 'blue', w: 14, h: 74 }, { color: 'yellow', w: 12, h: 58 }, { color: 'green', w: 10, h: 44 }];
/** Zacisk na końcu tulei (ikona: 7 × 22) i gryf (wysokość 8). */
export const ICON_COLLAR = { w: 7, h: 22 } as const; export const ICON_BAR_H = 8;

/** Stan znacznika dnia (pasek tygodnia na karcie „Dziś” i kalendarz): zrobione — pełna ikona; zaplanowane — obwódka; opuszczone — obwódka wyszarzona. */
export const DAY_MARKS = ['done', 'planned', 'missed'] as const;
export type DayMark = (typeof DAY_MARKS)[number];
/** Ze stanu dnia (lib/plan.dayStatusFrom — jedna funkcja dla paska, kalendarza i liczników): zrobiony inny trening też jest treningiem wykonanym
 * (pełna ikona; że zaplanowany czeka, mówi etykieta VoiceOver i karta „Dziś”), dzień bez planu i bez treningu — bez znacznika. */
export const dayMark = (s: DayStatus): DayMark | null => s === 'done' || s === 'other' ? 'done' : s === 'planned' ? 'planned' : s === 'missed' ? 'missed' : null;
/** Kolor obwódki (klucz motywu): zaplanowany — kolor tekstu; opuszczony — ctrlLine (wyszarzony, nadal ≥ 3:1 do tła w obu motywach — test). */
export const MARK_STROKE: Readonly<Record<Exclude<DayMark, 'done'>, 'text' | 'ctrlLine'>> = { planned: 'text', missed: 'ctrlLine' };

/**
 * Mała ikona dnia (ok. 24 × 18 pt). Uproszczenie ikony (nazwane): proporcje wysokości talerzy, kolejność kolorów i kształt gryfu z zaciskiem jak
 * na icon.svg, ale talerze i odstępy pogrubione, gryf grubszy i krótszy — w skali 1:1 odstęp 3 jednostek to 0,6 pt, a talerz 10 jednostek to 2 pt,
 * czyli przy 24 pt talerze zlewają się w plamę. Tu każdy talerz ≥ 2,5 pt, odstęp ≥ 1 pt (tests/motyw.test.tsx).
 */
export const MINI_ICON = { w: 24, h: 18, bar: 2.5, stub: 2.2, gap: 1.2, k: 0.28 } as const;
export type IconRect = { part: 'bar' | 'plate' | 'collar'; color?: PlateColor; x: number; y: number; w: number; h: number; rx: number };
const r2 = (v: number) => Math.round(v * 100) / 100;
export function miniIcon(): IconRect[] {
  const { w, h, bar, stub, gap, k } = MINI_ICON; const s = h / ICON_PLATES[0].h; const out: IconRect[] = [{ part: 'bar', x: 0, y: r2((h - bar) / 2), w, h: bar, rx: 0.8 }];
  let x = stub;
  for (const p of ICON_PLATES) { const pw = r2(p.w * k), ph = r2(p.h * s); out.push({ part: 'plate', color: p.color, x: r2(x), y: r2((h - ph) / 2), w: pw, h: ph, rx: r2(Math.min(1, pw / 3)) }); x += pw + gap; }
  const cw = r2(ICON_COLLAR.w * k), ch = r2(ICON_COLLAR.h * s); out.push({ part: 'collar', x: r2(x), y: r2((h - ch) / 2), w: cw, h: ch, rx: 0.5 });
  return out;
}
/**
 * Stos talerzy (postęp tygodnia): te same talerze co na ikonie, położone płasko jeden na drugim i widziane z boku — szerokość = średnica,
 * wysokość = grubość (proporcje z icon.svg), na dole największy (czerwony). Rysunek od dołu do góry; y liczone od góry.
 */
export const PLATE_STACK = { w: 26, thick: 5, gap: 1 } as const;
export function plateStack(): IconRect[] {
  const { w, thick, gap } = PLATE_STACK; const s = w / ICON_PLATES[0].h; const t = thick / ICON_PLATES[0].w;
  const hs = ICON_PLATES.map(p => r2(p.w * t)); const H = r2(hs.reduce((a, b) => a + b, 0) + gap * (hs.length - 1));
  let y = H; return ICON_PLATES.map((p, i) => { const pw = r2(p.h * s); y = r2(y - hs[i]); const rect: IconRect = { part: 'plate', color: p.color, x: r2((w - pw) / 2), y, w: pw, h: hs[i], rx: r2(Math.min(1.5, hs[i] / 3)) }; y -= gap; return rect; });
}
export const plateStackHeight = (): number => { const r = plateStack(); return r2(Math.max(...r.map(x => x.y + x.h))); };

/** Procent wykonania planu tygodnia, zaokrąglony do całości; 100 tylko gdy zrobione wszystkie, 0 tylko gdy nic (zaokrąglenie nie udaje końca). */
export function planPct(done: number, total: number): number {
  if (!Number.isFinite(done) || !Number.isFinite(total) || total <= 0 || done <= 0) return 0;
  if (done >= total) return 100;
  return Math.min(99, Math.max(1, Math.round((done / total) * 100)));
}
export type WeekProgress = { done: number; total: number; pct: number; stacks: boolean[] };
/**
 * Postęp tygodnia jako N stosów talerzy (tylko przy aktywnym planie; bez planu null — aplikacja nie wyznacza celu, decyzja 03.10.2026).
 * N = dni z treningiem w planie bieżącego tygodnia (z jednodniowymi zmianami — ten sam pasek co karta „Dziś”); pełne stosy = dni zrobione
 * zaplanowanym szablonem (weekTiles.planDone — ta sama liczba co kalendarz i pasek), od lewej.
 */
export function weekProgress(now = Date.now()): WeekProgress | null {
  const w = weekTiles(now); const total = w.planned ?? 0; if (total <= 0) return null;
  const done = Math.max(0, Math.min(w.planDone ?? 0, total));
  return { done, total, pct: planPct(done, total), stacks: Array.from({ length: total }, (_, i) => i < done) };
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
