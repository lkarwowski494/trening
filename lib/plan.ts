import { getState, save, finishedWorkouts, localISODate } from './store';

/*
 * Plan tygodnia i kalendarz (priorytet właściciela 08.10.2026, docs/18; docs/21 „Priorytet”). Same dane użytkownika — bez twierdzeń dziedzinowych
 * (reguły regeneracji partii dojdą osobno, ze źródłami: docs/research/23).
 *
 * Model: stały plan tygodnia `State.weekPlan.days` (pon…nd: id szablonu albo null = dzień wolny) + zmiany pojedynczych dni
 * `State.planOverrides` (data RRRR-MM-DD → id szablonu albo null). Trening zaplanowany na dzień = zmiana tego dnia, a bez niej — plan tygodnia.
 * Zmiana równa planowi tygodnia jest usuwana — po wyrównaniu kalendarz sam wraca do rutyny.
 *
 * Przesuwanie (decyzja właściciela 08.10.2026):
 * - „przesuń plan o 1 dzień” (shiftPlan): trening idzie na następny dzień, a trening, który tam był, o jeden dalej — i tak tylko do pierwszego
 *   dnia wolnego (np. dziś FBW A, jutro FBW B, potem wolne → A jutro, B pojutrze, nic więcej);
 * - „przesuń tylko ten trening” (moveOnly): na wskazany dzień, ale nigdy na dzień z innym treningiem bez wyraźnego polecenia
 *   (wynik `conflict` — ekran pyta; `swapDays` zamienia miejscami na wyraźne polecenie).
 */
export type PlanDays = (string | null)[];
/** Najdłuższe przesunięcie łańcuchowe — plan bez dni wolnych nie przesuwa się w nieskończoność. */
export const SHIFT_MAX_DAYS = 14;

export const dayKeyOf = (ts: number) => localISODate(new Date(ts));
const parseKey = (k: string) => new Date(+k.slice(0, 4), +k.slice(5, 7) - 1, +k.slice(8, 10));
export const addDays = (k: string, n: number) => { const d = parseKey(k); return localISODate(new Date(d.getFullYear(), d.getMonth(), d.getDate() + n)); };
/** Indeks dnia tygodnia od poniedziałku (0 = pon., 6 = nd.). */
export const weekdayIdx = (k: string) => (parseKey(k).getDay() + 6) % 7;

const liveTemplate = (id: string | null | undefined) => !!id && getState().templates.some(t => t.id === id && !t.archived);
export const weekPlanDays = (): PlanDays => { const d = getState().weekPlan?.days; return Array.from({ length: 7 }, (_, i) => (d && typeof d[i] === 'string' ? d[i] : null)); };
export const hasPlan = () => weekPlanDays().some(liveTemplate) || Object.keys(getState().planOverrides ?? {}).length > 0;

/** Trening zaplanowany na dzień (id szablonu; null — dzień wolny albo szablon usunięty / w archiwum). */
export function plannedOn(k: string): string | null {
  const ov = getState().planOverrides; const id = ov && k in ov ? ov[k] : weekPlanDays()[weekdayIdx(k)];
  return liveTemplate(id) ? id : null;
}
const baseOn = (k: string) => { const id = weekPlanDays()[weekdayIdx(k)]; return liveTemplate(id) ? id : null; };
/** Czy dzień ma zmianę względem planu tygodnia. */
export const isChanged = (k: string) => !!getState().planOverrides && k in getState().planOverrides! && getState().planOverrides![k] !== baseOn(k);

function setDay(k: string, id: string | null) {
  const st = getState(); const ov = { ...(st.planOverrides ?? {}) };
  if (id === baseOn(k)) delete ov[k]; else ov[k] = id;
  if (Object.keys(ov).length) st.planOverrides = ov; else delete st.planOverrides;
}
const commit = () => { getState().userTouched = true; save(); };

/** Ustawienie planu tygodnia (pon…nd). */
export function setWeekDay(i: number, id: string | null) {
  const st = getState(); const days = weekPlanDays(); days[i] = id && liveTemplate(id) ? id : null;
  if (days.some(Boolean)) st.weekPlan = { days }; else delete st.weekPlan; tidy(); commit();
}
/** Pojedynczy dzień: inny trening albo wolne (null). */
export function setDayPlan(k: string, id: string | null) { setDay(k, id && liveTemplate(id) ? id : null); commit(); }
/** Powrót dnia do planu tygodnia. */
export function resetDay(k: string) { const st = getState(); if (st.planOverrides && k in st.planOverrides) { const ov = { ...st.planOverrides }; delete ov[k]; if (Object.keys(ov).length) st.planOverrides = ov; else delete st.planOverrides; commit(); } }

export type ShiftResult = { moved: { from: string; to: string; id: string }[]; dropped?: string };
/** Przesunięcie planu o 1 dzień od dnia `k`: łańcuch tylko do pierwszego dnia wolnego (najwyżej SHIFT_MAX_DAYS — dalej trening wypada). */
export function shiftPlan(k: string): ShiftResult {
  let carry = plannedOn(k); const moved: ShiftResult['moved'] = []; if (!carry) return { moved };
  setDay(k, null); let d = k;
  for (let i = 0; i < SHIFT_MAX_DAYS && carry; i++) {
    const next = addDays(d, 1); const there = plannedOn(next); setDay(next, carry); moved.push({ from: d, to: next, id: carry }); carry = there; d = next;
  }
  commit(); return carry ? { moved, dropped: carry } : { moved };
}

export type MoveResult = { ok: true } | { ok: false; conflict: string };
/** Przesunięcie tylko tego treningu na dzień `to` — bez wyraźnego polecenia nigdy na dzień z innym treningiem. */
export function moveOnly(from: string, to: string): MoveResult {
  const id = plannedOn(from); if (!id || from === to) return { ok: true };
  const there = plannedOn(to); if (there) return { ok: false, conflict: there };
  setDay(from, null); setDay(to, id); commit(); return { ok: true };
}
/** Wyraźne polecenie: zamiana treningów dwóch dni miejscami. */
export function swapDays(a: string, b: string) { const x = plannedOn(a), y = plannedOn(b); setDay(a, y); setDay(b, x); commit(); }

/** Zmiany sprzed dzisiaj nie są już potrzebne do planowania — sprzątanie przy każdej zmianie planu (najwyżej 60 dni wstecz zostaje do podglądu). */
function tidy() { const st = getState(); if (!st.planOverrides) return; const min = addDays(dayKeyOf(Date.now()), -60); const ov = Object.fromEntries(Object.entries(st.planOverrides).filter(([k]) => k >= min)); if (Object.keys(ov).length) st.planOverrides = ov; else delete st.planOverrides; }

export type DayStatus = 'done' | 'planned' | 'missed' | 'rest';
/** Stan dnia w kalendarzu: zrobiony (sesja tego dnia), zaplanowany (dziś i dalej), opuszczony (wcześniej, bez sesji), wolny. */
export function dayStatus(k: string, today = dayKeyOf(Date.now())): { status: DayStatus; templateId: string | null; workoutIds: string[] } {
  const ws = finishedWorkouts().filter(w => dayKeyOf(w.startedAt) === k).map(w => w.id); const id = plannedOn(k);
  if (ws.length) return { status: 'done', templateId: id, workoutIds: ws };
  if (!id) return { status: 'rest', templateId: null, workoutIds: [] };
  return { status: k < today ? 'missed' : 'planned', templateId: id, workoutIds: [] };
}
/** Najbliższe dni z planem (dziś i dalej) — do podglądu tygodnia na ekranie treningu. */
export const upcoming = (days = 7, today = dayKeyOf(Date.now())) => Array.from({ length: days }, (_, i) => addDays(today, i)).map(k => ({ date: k, templateId: plannedOn(k) }));
