import { MUSCLES, type Muscle } from './seed';

/*
 * Cel serii na partię w tygodniu (decyzje właściciela 12.10.2026, docs/research/32-serie-na-partie.md).
 * Rozbicie barków i pleców na części zostało WYCOFANE tego samego dnia (bloker audytu 0.14: kreska 10 dla każdej części nie ma źródła —
 * źródła mówią o 10 seriach na partię). Cel dotyczy całych partii (MUSCLES), tak jak statystyki serii, objętość, mapa mięśni, generator i regeneracja.
 */
/** Id partii w statystykach serii i w celu — partie całe, w kolejności wyświetlania. */
export type SetPart = Muscle;
/** Wszystkie partie, dla których można ustawić cel serii. */
export const SET_PARTS: readonly SetPart[] = MUSCLES;
export const isSetPart = (k: string): k is SetPart => (SET_PARTS as readonly string[]).includes(k);

/* Cel serii na partię w tygodniu (Ustawienia). Granice to granice pola w interfejsie (zabezpieczenie przed pomyłką wpisu), NIE zalecenie
 * dawkowania — zalecenie to wartość automatyczna (stats.WEEKLY_SETS_MARK, ze źródłami). */
export const SETS_GOAL_MIN = 1;
export const SETS_GOAL_MAX = 40;
export const clampGoal = (n: number): number => Math.min(SETS_GOAL_MAX, Math.max(SETS_GOAL_MIN, Math.round(n)));
/** Migracja/import: zostają tylko znane części z liczbą skończoną (zaokrągloną i przyciętą do granic); wszystko inne odpada. Pusty wynik → undefined. */
export function normalizeGoals(raw: unknown): Record<string, number> | undefined {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return undefined;
  const out: Record<string, number> = {};
  for (const p of SET_PARTS) { const v = Object.prototype.hasOwnProperty.call(raw, p) ? (raw as Record<string, unknown>)[p] : undefined; if (typeof v === 'number' && Number.isFinite(v)) out[p] = clampGoal(v); }
  return Object.keys(out).length ? out : undefined;
}
