/*
 * Prymitywy porządkowania danych z importu i z bazy (obiekt, lista, liczba, id, znacznik czasu, kg na siatce 0,01) oraz wspólne limity
 * długości nazw, powtórzeń i przerwy. Czyste funkcje — bez stanu.
 * Zależy od: ./time; zewnętrzne: —.
 */
import { localDateTs } from './time';

export const isObj = (x: unknown): x is Record<string, any> => !!x && typeof x === 'object' && !Array.isArray(x);
export const arr = (x: unknown): any[] => Array.isArray(x) ? x.filter(isObj) : [];
/** Runda 51: liczba z importu — także z tekstu (przecinek dziesiętny); null dla nieskończoności, NaN, obiektów i absurdalnych rzędów wielkości. */
export function parseNum(v: unknown): number | null {
  const n = typeof v === 'number' ? v : typeof v === 'string' && v.trim() !== '' ? Number(v.trim().replace(/^(-?\d*),(\d+)$/, '$1.$2')) : NaN;
  return Number.isFinite(n) && Math.abs(n) <= 1e7 ? n : null;
}
/** Runda 51: identyfikator jako tekst (liczbowe id z ręcznie edytowanych backupów), inaczej null. */
export const idOf = (v: unknown): string | null => typeof v === 'string' && v ? v : typeof v === 'number' && Number.isFinite(v) ? String(v) : null;
/** Runda 51: znacznik czasu w zakresie Date (inaczej „Invalid Date”); tekst daty też. */
export const tsOf = (v: unknown): number | null => {
  const x = typeof v === 'string' ? v.trim() : v;
  const n = typeof x === 'number' ? x : typeof x !== 'string' || !x ? NaN
      : /^-?\d+(\.\d+)?$/.test(x) ? Number(x) /* runda 52: liczba tekstem */
      : /^\d{4}-\d{2}-\d{2}$/.test(x) ? localDateTs(x) /* sama data: lokalna północ, nie UTC */ : Date.parse(x);
  return Number.isFinite(n) && Math.abs(n) <= 8.64e15 ? n : null;
};
export const intIn = (v: unknown, min: number, max: number): number | null => {
  const n = parseNum(v);
  return n == null || Math.floor(n) < min ? null : Math.min(max, Math.floor(n));
};
/** Runda 60: kg w danych na siatce 0,01 — jak wpis w polu (wIn) i wyświetlanie; 100,006 z importu nie daje „rekordu” nad wpisanym 100,01. */
export const kg2 = (v: number) => Math.sign(v) * Math.round(Math.abs(v) * 100) / 100 + 0; // runda 61: połówki od zera jak units.round (asysta lustrzana)

/* ---------- misc ---------- */
/** Runda 39: wspólny limit długości nazw (pola edycji mają maxLength = NAME_MAX). */
export const NAME_MAX = 80;
/** UI-16 (audyt 0.10): jedna górna granica powtórzeń serii — trening, szablon, edycja historii i wczytanie (fixRows). */
export const REPS_MAX = 1000;
/** Najdłuższa przerwa ustawiana ręcznie (s) — ćwiczenie, pozycja szablonu, zamiennik, trening. */
export const REST_MAX = 1800;
/** M1-audytor-generalny-002: jak długo (ms) kopia surowego zapisu sprzed migracji schematu czeka w bazie (30 dni — liczba produktowa, nie merytoryczna). */
export const PREMIGRATE_KEEP_MS = 30 * 24 * 3600e3;
/** Runda 40: przycięcie do n jednostek UTF-16 bez rozcinania emoji (pary zastępczej) i bez spacji na końcu. */
export const clampName = (s: string, n = NAME_MAX) => {
  let r = s.slice(0, Math.max(0, n));
  if (/[\uD800-\uDBFF]$/.test(r)) r = r.slice(0, -1);
  return r.trimEnd();
};
