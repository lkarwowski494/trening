import { hasTime, hasReps, hasWeight, hasDistance, type Exercise, type WExercise, type WSet, type Workout } from '@/lib/seed';
import { exById, bandById, isBW, hintFor, prevOfActiveBlock, prevFromOther, offListAt, listLocFor, pinnedImpl, locationById, assistLost, REPS_MAX, DURATION_MAX_SEC, fmtSec } from '@/lib/store';
import { usedKeys, isEmpty } from '@/lib/state/setvals';
import { loadsFor } from '@/lib/equipment';
import { nextHeavier, LOAD_TOL_KG } from '@/lib/loads';
import { wu, wOut, wIn, fmtW, fmtNum, dOut, dIn, distLabel, unitLabel } from '@/lib/units';
import { SET_FIELDS, SIZE, TEXT_SCALE } from '@/lib/theme';

/*
 * Logika tablicy „teraz” (M3 p2; wzorzec 29 w docs/32, ZM-01; design-spec §1 i §2). Bez interfejsu i bez zapisu danych — zapisuje ekran przez
 * typeSetValue (lib/state/live.ts), więc kaskada w dół, „edited” i zapis są te same co przy wpisie w wierszu serii.
 *
 *  - pola wpisu na tablicy wynikają z metryki ćwiczenia (maks. 2);
 *  - wartości efektywne = wartości serii albo podpowiedź „Poprzednio” — dokładnie to, co zapisze „Seria zrobiona” (lustro `fillFromHints`);
 *    gdy któraś wymagana wartość jest pusta, „Seria zrobiona” nie odhacza serii, tylko przenosi kursor do pola (missingKey);
 *  - krok ±: ta sama reguła co cicha podpowiedź progresji (`progressionFor` w lib/state/history.ts): w miejscu z opisanym sprzętem sąsiedni dostępny ciężar,
 *    inaczej sztanga ±2,5 kg (±5 lb), hantle i ćwiczenia jednostronne ±1 kg (±2,5 lb), masa ciała (asysta / dociążenie) ±2,5 kg (±5 lb);
 *    test tests/m3-p2-board-logic.test.ts pilnuje zgodności. Reguła kroku ± jako taka czeka na badacza ([DO USTALENIA], docs/design/to-be.md ZM-01);
 *  - układ pól serii: do 4 z wynikiem, 5–12 w 1–3 rzędach, powyżej 12 przewijany rząd (SET_FIELDS; limit 12 to projekt, nie limit danych).
 */
export type BoardKey = 'weight' | 'addKg' | 'reps' | 'durationSec' | 'distanceM';
export type Eff = Partial<Record<BoardKey, number | ''>>;

/** Kroki ± dla czasu i dystansu — [DO USTALENIA: badacz]: konwencja robocza (brak źródła w repo); w jednostce wyświetlania (s; m albo yd). */
export const BOARD_STEPS = { timeSec: 5, distDisplay: 50 } as const;
/** Krok ciężaru w jednostce wyświetlania — jak w `progressionFor` (kg / lb). */
const WEIGHT_STEP = { bar: { kg: 2.5, lb: 5 }, small: { kg: 1, lb: 2.5 } } as const;
/** Najmniejsza szerokość pola z wynikiem (np. „100×12”, Barlow 20 pt) — dopasowanie do makiety, przed skalą liczb. */
const RESULT_MIN_WIDTH = 64;

/** Pola wpisu na tablicy w kolejności wyświetlania: ciężar (albo dystans), potem powtórzenia (albo czas). */
export function boardKeys(ex: Exercise | undefined): BoardKey[] {
  if (!ex) return []; const m = ex.metric ?? 'weight_reps'; const out: BoardKey[] = [];
  if (hasWeight(m)) out.push(isBW(ex) ? 'addKg' : 'weight');
  if (hasDistance(m)) out.push('distanceM');
  if (hasReps(m)) out.push('reps');
  if (hasTime(m)) out.push('durationSec');
  return out.slice(0, 2);
}

/**
 * Wartości, które tablica pokazuje i które zapisze „Seria zrobiona”: wartość serii, a gdy jej brak — podpowiedź „Poprzednio” (ta sama seria robocza), a gdy i tej
 * nie ma — dolna granica zakresu powtórzeń z szablonu. Lustro `fillFromHints` (lib/state/live.ts): rozgrzewka bez podpowiedzi; ciężar z innego miejsca spoza listy
 * tego miejsca wstrzymuje podpowiedź całkiem (nigdy „ciężar pusty + powtórzenia z podpowiedzi”). Test równoległy: tests/m3-p2-board-logic.test.ts.
 */
export function effectiveValues(w: Workout, e: WExercise, si: number): Eff {
  const ex = exById(e.exerciseId); const s = e.sets[si]; if (!ex || !s) return {};
  const keys = boardKeys(ex); const uses = usedKeys(ex); const out: Eff = {};
  for (const k of keys) out[k] = isEmpty(s[k]) ? '' : (s[k] as number);
  if (s.kind === 'warmup') return out;
  const pb = prevOfActiveBlock(w, e); const p = hintFor(pb?.sets, e.sets, si, ex);
  const offW = !!(p && prevFromOther(pb, e.exerciseId, w.locationId, e.impl) && offListAt(ex, listLocFor(e, w.locationId), p.weight, pinnedImpl(e)));
  if (offW && uses.weight && isEmpty(s.weight)) return out;
  if (p && !assistLost(ex, p)) for (const k of keys)
    if (uses[k] && isEmpty(s[k]) && !isEmpty(p[k]) && !(k === 'weight' && offW)
        && !(k === 'addKg' && ((uses.bandId && s.bandId && s.bandId !== p.bandId) || (s.noBand && p.bandId) || (p.bandId && (!uses.bandId || !bandById(p.bandId))))))
      out[k] = p[k] as number;
  if (keys.includes('reps') && out.reps === '' && e.repMin != null) out.reps = e.repMin;
  return out;
}

/** Pierwsze brakujące pole (ciężar, dystans, powtórzenia, czas); dociążenie masy ciała (addKg) nie jest wymagane. Null = „Seria zrobiona” może odhaczyć serię. */
export function missingKey(w: Workout, e: WExercise, si: number): BoardKey | null {
  const eff = effectiveValues(w, e, si);
  return boardKeys(exById(e.exerciseId)).find(k => k !== 'addKg' && eff[k] === '') ?? null;
}

/**
 * Krok ± pola `key` od wartości `base` (jednostka zapisu: kg, powtórzenia, sekundy, metry). `to` = nowa wartość do zapisu albo null, gdy nie ma ruchu
 * (koniec listy ciężarów, zero, REPS_MAX); `amount` = opis kroku z jednostką do etykiety VoiceOver („2,5 kg”, „1”, „5 s”, „50 m”).
 */
export function stepOf(w: Workout, e: WExercise, key: BoardKey, dir: 1 | -1, base: number | ''): { to: number | null; amount: string } {
  const cur = base === '' ? 0 : base;
  if (key === 'reps') { const to = cur + dir; return { to: to < 0 || to > REPS_MAX || (base === '' && dir < 0) ? null : to, amount: '1' }; }
  if (key === 'durationSec') {
    const st = BOARD_STEPS.timeSec; const to = Math.min(DURATION_MAX_SEC, Math.max(0, cur + dir * st));
    return { to: (dir < 0 && cur <= 0) || to === cur ? null : to, amount: fmtSec(Math.abs(to - cur) || st) };
  }
  if (key === 'distanceM') {
    const st = BOARD_STEPS.distDisplay; const d = Number(dOut(cur)) || 0; const nd = Math.max(0, d + dir * st); const to = Number(dIn(nd));
    return { to: (dir < 0 && cur <= 0) || to === cur ? null : to, amount: `${fmtNum(Math.abs(nd - d) || st, 0)} ${distLabel()}` };
  }
  const ex = exById(e.exerciseId); if (!ex) return { to: null, amount: '' };
  const lb = wu() === 'lb'; const bw = isBW(ex);
  /* miejsce z opisanym sprzętem: sąsiedni DOSTĘPNY ciężar (jak „↑ spróbuj” w progressionFor); lista dotyczy bloku tylko, gdy to przyrząd tego miejsca (listLocFor) */
  const loc = bw ? undefined : locationById(listLocFor(e, w.locationId));
  if (loc) { const L = loadsFor(ex, loc, pinnedImpl(e));
    if (L.kind === 'loads') {
      const to = dir > 0 ? nextHeavier(L.loads, cur) : cur <= 0 ? null : ([...L.loads].reverse().find(v => v < cur - LOAD_TOL_KG) ?? 0);
      return { to, amount: fmtW(to == null ? 0 : Math.abs(to - cur)) };
    } }
  const small = ex.equipment === 'hantle' || ex.loadMode === 'per_dumbbell' || ex.loadMode === 'unilateral';
  const step = (bw ? WEIGHT_STEP.bar : small ? WEIGHT_STEP.small : WEIGHT_STEP.bar)[lb ? 'lb' : 'kg']; /* w jednostce wyświetlania */
  const amount = `${fmtNum(step, 1)} ${unitLabel()}`;
  if (!bw && dir < 0 && cur <= 0) return { to: null, amount };
  let disp = Math.round((wOut(cur) + dir * step) * 100) / 100; if (!bw && disp < 0) disp = 0;
  return { to: Number(wIn(disp)), amount };
}

/**
 * Układ pól serii na tablicy (SET_FIELDS, design-spec §1): do `resultUpTo` pól z wynikiem w jednym rzędzie; 5–12 bez wyniku w 1–`maxRows` rzędach
 * (ile pól mieści się w rzędzie — z szerokości wnętrza tablicy i skali liczb, najwyżej 130%); powyżej 12 — jeden przewijany rząd (tryb zapasowy, dane bez limitu).
 */
export function fieldLayout(n: number, width: number, numScale: number): { rows: number; perRow: number; scroll: boolean; showResult: boolean } {
  const sc = Math.min(Math.max(numScale, 1), TEXT_SCALE.num); const gap = SIZE.boardFieldGap;
  const fit = (min: number) => Math.max(1, Math.floor((width + gap) / (min * sc + gap)));
  if (n <= SET_FIELDS.resultUpTo) { const rows = Math.min(SET_FIELDS.maxRows, Math.ceil(n / fit(RESULT_MIN_WIDTH))); return { rows, perRow: Math.ceil(n / rows), scroll: false, showResult: true }; }
  const rows = Math.ceil(n / fit(SIZE.boardFieldMinWidth));
  if (n > SET_FIELDS.scrollAbove || rows > SET_FIELDS.maxRows) return { rows: 1, perRow: n, scroll: true, showResult: false };
  return { rows, perRow: Math.ceil(n / rows), scroll: false, showResult: false };
}

/** Wynik serii w polu tablicy: „80×6”, „+10×8”, „8” (masa ciała), „1:30”, „62,5×5”; seria bez wartości — „—” (nie „0”, 04-studio-projektowe-010). */
export function compactResult(ex: Exercise, s: Pick<WSet, 'weight' | 'addKg' | 'reps' | 'durationSec' | 'distanceM'>): string {
  const m = ex.metric ?? 'weight_reps'; const dig = wu() === 'lb' ? 1 : 2; const n = (v: unknown) => !isEmpty(v);
  const load = hasWeight(m) ? (isBW(ex) ? (n(s.addKg) && Number(s.addKg) ? `${Number(s.addKg) > 0 ? '+' : ''}${fmtNum(wOut(Number(s.addKg)), dig)}` : '') : n(s.weight) ? fmtNum(wOut(Number(s.weight)), dig) : '—') : '';
  const parts: string[] = [];
  if (hasWeight(m) && load) parts.push(load);
  if (hasDistance(m)) parts.push(n(s.distanceM) ? `${fmtNum(Number(dOut(s.distanceM)), 0)}${distLabel()}` : '—');
  if (hasReps(m)) parts.push(n(s.reps) ? String(s.reps) : '—');
  if (hasTime(m)) parts.push(n(s.durationSec) ? fmtSec(Number(s.durationSec)) : '—');
  if (parts.every(p => p === '—')) return '—';
  if (isBW(ex) && hasReps(m) && !load) return parts.join('×');
  return parts.join(hasDistance(m) && hasTime(m) ? ' ' : '×');
}

/** Liczba „znaków cyfrowych” wiersza liczb tablicy (04-studio-projektowe-001): cyfry i znaki jak „—” liczą się za 1, separator dziesiętny i dwukropek za pół; „×” i jednostki nie wchodzą (makieta liczy same cyfry). */
export const boardDigitChars = (shown: readonly string[]): number => shown.reduce((a, s) => a + (/\d|^—$/.test(s) ? [...s].reduce((b, c) => b + (/[.,:]/.test(c) ? 0.5 : 1), 0) : 3), 0); /* słowo („masa ciała”) ma mniejszy krój — liczy się jak 3 cyfry */
