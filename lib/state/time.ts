/*
 * Daty i czas: dzień RRRR-MM-DD w strefie telefonu, strefa startu treningu (J3: wallTs/fromWallTs), tydzień (poniedziałek) oraz
 * formatowanie czasu, dystansu, daty i godziny do wyświetlenia. Czyste funkcje — bez stanu.
 * Zależy od: (żadnego modułu store); zewnętrzne: ../i18n, ../units.
 */
import { t, locale } from '../i18n';
import { fmtNum } from '../units';

/** Data RRRR-MM-DD jako lokalna północ (Date.parse traktuje ją jako UTC). */
export function localDateTs(iso: string): number {
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(iso ?? '');
  return m ? new Date(+m[1], +m[2] - 1, +m[3]).getTime() : NaN;
}
export const fmtSec = (sec: number) => {
  sec = Math.max(0, Math.round(sec));
  if (sec >= 3600) return fmtDur(sec); /* runda 12: godzina i więcej jak czas sesji */
  const m = Math.floor(sec / 60), r = sec % 60;
  return m ? `${m}:${String(r).padStart(2, '0')}` : t('{n} s', { n: r }); /* A11-17: jednostka przez t() (uk „с”, el „δευτ.”, hu „mp”, tr „sn”) */
};
export const fmtDist = (m: number) => m >= 1000 ? t('{n} km', { n: fmtNum(m / 1000, 2) }) : t('{n} m', { n: Math.round(m) }); /* A11-17 */
/** Zakres powtórzeń do wyświetlenia: „max”, „8”, „8–10”, a przy braku lub odwróconym „do” — „8+”. */
export const reps = (min: number | null, max: number | null) => min == null ? t('max') /* A11-17 */
    : (max == null || max < min ? `${min}+` : min === max ? `${min}` : `${min}–${max}`);
/** Czas „m:ss”, od godziny „h:mm:ss” (wcześniej 95:00 zamiast 1:35:00). */
export const fmtDur = (sec: number) => {
  sec = Math.max(0, Math.round(sec));
  const h = Math.floor(sec / 3600), m = Math.floor((sec % 3600) / 60), r = sec % 60;
  return h ? `${h}:${String(m).padStart(2, '0')}:${String(r).padStart(2, '0')}` : `${m}:${String(r).padStart(2, '0')}`;
};
/** H3 (audyt 0.10 UI-13): dzień „RRRR-MM-DD” w tym samym formacie co fmtDate („pon., 12 paź”; rok, gdy inny niż bieżący) — panel dnia, podpowiedź
 * deload, „Dziś”, okna planu. */
export const fmtDayKey = (k: string) => { const ts = localDateTs(k); return Number.isFinite(ts) ? fmtDate(ts + 12 * 3600e3) : k; };
/** Data do list. Runda 14: rok, gdy nie bieżący — sesje sprzed roku nie wyglądają jak tegoroczne. */
export const fmtDate = (ts: number) => {
  const d = new Date(ts);
  return d.toLocaleDateString(locale(), { weekday: 'short', day: 'numeric', month: 'short',
      ...(d.getFullYear() !== new Date().getFullYear() ? { year: 'numeric' as const } : {}) });
};
export const fmtTime = (ts: number) => new Date(ts).toLocaleTimeString(locale(), { hour: '2-digit', minute: '2-digit' });
/** Dzisiejsza data w strefie telefonu (RRRR-MM-DD). toISOString() dawało datę UTC — w Polsce po północy „wczoraj”. */
export const localISODate = (d: Date = new Date()) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
/*
 * Audyt 0.10 J3 (DAT-07, decyzja wg zasady właściciela z 08.10.2026 20:20 — wariant B): dzień i tydzień treningu liczone w strefie czasowej, w której
 * trening się zaczął. Trening z niedzieli 23:30 w Warszawie zostaje niedzielnym także po przylocie do Auckland (wcześniej: poniedziałek, a niedziela
 * „opuszczona”). Workout.tzOffsetMin — minuty na wschód od UTC przy starcie (zapisywane przy starcie treningu i treningu wstecz); brak pola (dane
 * sprzed zmiany) = strefa bieżąca, czyli dokładnie jak dotąd. Zmiana czasu (DST) w tej samej strefie nie zmienia dnia (pole = przesunięcie z chwili startu).
 * wallTs zwraca znacznik, który w BIEŻĄCEJ strefie telefonu ma tę samą datę i godzinę na zegarze, co trening w strefie startu — dzięki temu
 * wszystkie funkcje dnia/tygodnia i formatowania (dayKeyOf, mondayKey, fmtDate, fmtTime) działają bez zmian, dostając wallTs zamiast startedAt.
 */
const TZ_MAX_MIN = 14 * 60; /* najdalsze strefy: UTC−12 … UTC+14 */
/** Przesunięcie strefy telefonu w chwili `ts` (minuty na wschód od UTC). */
export const tzOffsetAt = (ts: number = Date.now()) => -new Date(ts).getTimezoneOffset() || 0;
/** Poprawne przesunięcie strefy z danych (import) albo undefined. */
export const cleanTz = (v: unknown): number | undefined => {
  const n = typeof v === 'number' ? v : typeof v === 'string' && v.trim() !== '' ? Number(v) : NaN;
  return Number.isFinite(n) && Math.abs(n) <= TZ_MAX_MIN ? Math.round(n) + 0 : undefined;
};
/** Czas na zegarze strefy startu treningu jako znacznik w strefie bieżącej (patrz wyżej); `ts` — inna chwila tego treningu (np. koniec). */
export function wallTs(w: { startedAt: number; tzOffsetMin?: number }, ts: number = w.startedAt): number {
  const tz = w.tzOffsetMin; if (typeof tz !== 'number' || !Number.isFinite(ts)) return ts;
  const u = new Date(ts + tz * 60000);
  const d = new Date(2000, 0, 1);
  d.setFullYear(u.getUTCFullYear(), u.getUTCMonth(), u.getUTCDate());
  d.setHours(u.getUTCHours(), u.getUTCMinutes(), u.getUTCSeconds(), u.getUTCMilliseconds());
  return d.getTime();
}
/** Odwrotność wallTs: data i godzina wpisane na zegarze strefy `tz` (podane jako znacznik w strefie bieżącej) → prawdziwa chwila. */
export function fromWallTs(wall: number, tz: number | undefined): number {
  if (typeof tz !== 'number') return wall; const d = new Date(wall);
  return Date.UTC(d.getFullYear(), d.getMonth(), d.getDate(), d.getHours(), d.getMinutes(), d.getSeconds(), d.getMilliseconds()) - tz * 60000;
}
/** Dzień treningu RRRR-MM-DD w strefie startu (J3). */
export const workoutDay = (w: { startedAt: number; tzOffsetMin?: number }) => localISODate(new Date(wallTs(w)));
/** Istniejący dzień kalendarza RRRR-MM-DD (bez „2026-02-30”). */
export const realDay = (k: string) => {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(k);
  if (!m) return false;
  const d = new Date(+m[1], +m[2] - 1, +m[3]);
  return d.getFullYear() === +m[1] && d.getMonth() === +m[2] - 1 && d.getDate() === +m[3];
};
/* ---------- tydzień deload (pakiet C, 08.10.2026): etykieta tygodnia ustawiana przez użytkownika — bez automatycznego oznaczania z danych (brak walidacji,
 * docs/research/22); od decyzji A+B (08.10.2026) podpowiedź „zwykle co 4–6 tyg.” i mniej serii przy starcie — lib/deload.ts ---------- */
export const mondayKey = (ts: number) => {
  const d = new Date(ts);
  return localISODate(new Date(d.getFullYear(), d.getMonth(), d.getDate() - (d.getDay() + 6) % 7));
};
export const DATE_KEY = /^\d{4}-\d{2}-\d{2}$/;
