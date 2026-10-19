/*
 * Plan tygodnia — liczby i porządkowanie danych w jednym miejscu (nazwa, dni, zmiany dni, historia planu — schemat 18) — oraz
 * oznaczenie tygodnia deload i ukrycie zachęty do planu. Ekrany i reszta logiki planu — lib/plan.ts.
 * Zależy od: ./core, ./time, ./util; zewnętrzne: ../seed.
 */
import { type PlanSegment } from '../seed';
import { isObj, clampName, idOf } from './util';
import { mondayKey, DATE_KEY } from './time';
import { S, save, getState } from './core';

/** Czy tydzień zawierający `ts` jest oznaczony jako deload. */
export const isDeloadWeek = (ts: number) => !!S?.deloadWeeks?.includes(mondayKey(ts));
/** Oznaczenie / zdjęcie oznaczenia tygodnia zawierającego `ts`. */
export function toggleDeloadWeek(ts: number) {
  const st = getState(); const k = mondayKey(ts); const cur = st.deloadWeeks ?? [];
  const next = cur.includes(k) ? cur.filter(x => x !== k) : [...cur, k].sort();
  if (next.length) st.deloadWeeks = next; else delete st.deloadWeeks;
  st.userTouched = true;
  save();
}
/* ---------- plan tygodnia: liczby i porządkowanie danych w jednym miejscu (audyt 0.10: A1, B3, B4 — migrate i lib/plan.ts) ---------- */
/** Nazwa planu (pole „Nazwa planu”, zapisane plany). */
export const PLAN_NAME_MAX = 40;
/** Najwyżej tyle zapisanych planów („Inne plany”) — ten sam limit w migrate i w UI (audyt 0.10 B3 / DAT-03). */
export const SAVED_PLANS_MAX = 50;
/** Najwyżej tyle odcinków historii planu (najstarsze odpadają) — co najmniej kilka lat zmian planu raz w tygodniu. */
export const PLAN_HISTORY_MAX = 520;
/** Najwyżej tyle oznaczonych tygodni deload (najstarsze odpadają) — 10 lat (liczba w jednym miejscu; audyt 0.10 M2 — wcześniej literał w migrate). */
export const DELOAD_WEEKS_MAX = 520;
/** Audyt 0.10 B4 / DAT-06: nazwa planu — spacje złączone, bez spacji na brzegach, ≤ PLAN_NAME_MAX bez rozcinania emoji; idempotentne. */
export const cleanPlanName = (n: string) => clampName(n.replace(/\s+/g, ' ').trim(), PLAN_NAME_MAX);
/** 7 dni planu (id tekstem albo null) z dowolnej wartości. */
export const planDays = (d: unknown): (string | null)[] => Array.from({ length: 7 },
    (_, i) => (Array.isArray(d) && typeof d[i] === 'string' && d[i] ? d[i] : null));
export const sameDays = (a: readonly (string | null)[], b: readonly (string | null)[]) => a.length === b.length && a.every((x, i) => x === b[i]);
/**
 * Historia planu (schemat 18, audyt 0.10 A1): odcinki z poprawną datą, rosnąco; ten sam dzień — wygrywa późniejszy wpis; kolejny odcinek
 * równy poprzedniemu znika (bez zmiany planu); odcinki „bez planu” na początku znikają (przed pierwszym planem i tak nie ma planu);
 * najwyżej PLAN_HISTORY_MAX najnowszych. Idempotentne.
 */
export function normPlanHistory(list: unknown): PlanSegment[] {
  const byFrom = new Map<string, PlanSegment>();
  for (const x of Array.isArray(list) ? list : [])
    if (isObj(x) && typeof x.from === 'string' && DATE_KEY.test(x.from)) byFrom.set(x.from, { from: x.from, days: planDays(x.days) });
  const out: PlanSegment[] = [];
  for (const sg of [...byFrom.values()].sort((a, b) => (a.from < b.from ? -1 : a.from > b.from ? 1 : 0))) {
    if (!out.length && !sg.days.some(Boolean)) continue;
    if (out.length && sameDays(out[out.length - 1].days, sg.days)) continue;
    out.push(sg);
  }
  return out.slice(-PLAN_HISTORY_MAX);
}
/** Zmiany pojedynczych dni: klucze-daty, wartości id tekstem albo null (wolne). */
export const cleanOverrides = (x: unknown): Record<string, string | null> => (isObj(x)
    ? Object.fromEntries(Object.entries(x).filter(([k, v]) => DATE_KEY.test(k)
    && (v === null || (typeof v === 'string' && !!v)))) as Record<string, string | null> : {});
/** Trening zrobiony wcześniej (11.10.2026): dzień → id treningu; zły klucz albo pusta wartość odpada. */
export const cleanDoneEarly = (x: unknown): Record<string, string> => (isObj(x)
    ? Object.fromEntries(Object.entries(x).filter(([k, v]) => DATE_KEY.test(k) && typeof v === 'string' && !!v && v.length <= 80)) as Record<string, string> : {});
/** Najwyżej tyle dni z miejscem w planie (najnowsze zostają) — liczba w jednym miejscu (migrate, ekran, plan). */
export const PLAN_PLACES_MAX = 400;
/** Najdłuższy zakres miejsca w planie (dni, wliczając pierwszy i ostatni) — „Hotel pt–nd”, wyjazd na kilka tygodni; ekran i funkcja planu. */
export const PLAN_PLACE_RANGE_MAX = 31;
/** 0.19 (docs/33 B): miejsca dni planu — klucze-daty (bez `__proto__` i innych: tylko poprawna data), wartości id miejsca tekstem (liczbowe id z ręcznie
 * edytowanej kopii też); `known` — jeśli podane, zostają tylko id istniejących miejsc; najwyżej PLAN_PLACES_MAX najnowszych dni; idempotentne. */
export function cleanPlanPlaces(x: unknown, known?: ReadonlySet<string>): Record<string, string> {
  if (!isObj(x)) return {};
  const e: [string, string][] = [];
  for (const [k, v] of Object.entries(x)) { const id = idOf(v); if (DATE_KEY.test(k) && id && id.length <= 80 && (!known || known.has(id))) e.push([k, id]); }
  e.sort((a, b) => (a[0] < b[0] ? -1 : a[0] > b[0] ? 1 : 0));
  return Object.fromEntries(e.slice(-PLAN_PLACES_MAX));
}
/** Nowy odcinek od dnia `from` (zmiana planu dziś): odcinki od tego dnia i późniejsze ustępują nowemu. */
export const appendPlanSegment = (list: PlanSegment[], from: string,
    days: (string | null)[]): PlanSegment[] => normPlanHistory([...list.filter(x => x.from < from), { from, days: planDays(days) }]);
