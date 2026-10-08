import { getState, save, finishedWorkouts, localISODate, exById } from './store';

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

/* ---------- sugestie z regeneracją partii (decyzja właściciela 08.10.2026; reguły i źródła: docs/research/23) ----------
 * Uproszczenie (nazwane): sesje z tymi samymi głównymi partiami dzień po dniu — ostrzeżenie, nie blokada. Podstawa: przebieg regeneracji 24–48 h
 * (Morán-Navarro 2017 / Pareja-Blanco 2019–2020 — jeden zespół; Soares 2015; Paulsen 2012), ACSM „48 h” tylko z cytatu wtórnego (Cuthbert 2021);
 * dzień po dniu przy równej objętości tygodnia nie szkodzi (Schoenfeld 2019, Grgic 2018, Cuthbert 2021, Pedersen 2024) — dlatego ostrzeżenie.
 * Priorytet: zachować liczbę sesji, najmniej zmienionych dni, powrót do rutyny w RETURN_DAYS dni. */
/** Okno powrotu do rutyny (decyzja właściciela: „po 7–10 dniach wrócić do pierwotnej rutyny”). */
export const RETURN_DAYS = 10;
/** Główne partie szablonu (ćwiczenia z biblioteki: pole muscles). */
export function templateMuscles(id: string | null): Set<string> {
  const tpl = id ? getState().templates.find(x => x.id === id) : undefined; const out = new Set<string>();
  tpl?.items.forEach(it => (exById(it.exerciseId)?.muscles ?? []).forEach(m => out.add(m)));
  return out;
}
const overlap = (a: string | null, b: string | null) => { if (!a || !b) return false; const A = templateMuscles(a); for (const m of templateMuscles(b)) if (A.has(m)) return true; return false; };
/** Pary dni pod rząd z tymi samymi głównymi partiami w oknie [from, from + n). */
export function backToBack(from: string, n = RETURN_DAYS, on: (k: string) => string | null = plannedOn): { a: string; b: string }[] {
  const out: { a: string; b: string }[] = [];
  for (let i = -1; i < n; i++) { const a = addDays(from, i), b = addDays(from, i + 1); if (overlap(on(a), on(b))) out.push({ a, b }); }
  return out;
}

type Ov = Record<string, string | null>;
type Sim = { ov: Ov };
const simOn = (sim: Sim) => (k: string): string | null => { const id = k in sim.ov ? sim.ov[k] : weekPlanDays()[weekdayIdx(k)]; return liveTemplate(id) ? id : null; };
const simSet = (sim: Sim, k: string, id: string | null) => { if (id === baseOn(k)) delete sim.ov[k]; else sim.ov[k] = id; };

export type Suggestion = {
  kind: 'shift' | 'move' | 'swap' | 'skip'; to?: string;
  /** zmienione dni względem planu tygodnia w oknie powrotu */ changes: number;
  /** pary pod rząd z tymi samymi partiami, których nie ma w planie tygodnia */ newBackToBack: { a: string; b: string }[];
  /** sesje, które wypadają w oknie */ dropped: number;
  /** czy wszystkie zmiany mieszczą się w oknie powrotu */ returns: boolean;
  ov: Ov;
};
/**
 * Propozycje dla treningu z dnia `from` (przesunięty, opuszczony albo „nie dam rady”): przesunięcie planu, przeniesienie na wolny dzień,
 * zamiana z najbliższym treningiem, pominięcie. Kolejność: zmiany w oknie powrotu → bez utraty sesji → bez nowych par pod rząd z tymi samymi partiami → najmniej zmian
 * (zmiany poza oknem powrotu — na końcu). Dzień startu: `from`, a dla dnia sprzed dzisiaj — dziś (przeszłości nie przestawiamy).
 */
export function suggest(from: string, today = dayKeyOf(Date.now())): Suggestion[] {
  const id = plannedOn(from); if (!id) return [];
  const start = from < today ? today : from; const base0 = { ...(getState().planOverrides ?? {}) };
  const winFrom = from < today ? from : start; const win = Array.from({ length: RETURN_DAYS + 1 }, (_, i) => addDays(winFrom, i));
  const baseOnly = (k: string) => baseOn(k);
  const baseB2B = new Set(backToBack(winFrom, RETURN_DAYS, baseOnly).map(p => p.a + p.b));
  const count = (on: (k: string) => string | null) => win.filter(k => !!on(k)).length;
  const baseCount = count(baseOnly);
  const make = (kind: Suggestion['kind'], sim: Sim, to?: string): Suggestion => {
    const on = simOn(sim); const changed = win.filter(k => on(k) !== baseOnly(k));
    const lastChange = Object.keys(sim.ov).filter(k => k >= winFrom).sort().pop();
    return { kind, to, changes: changed.length, newBackToBack: backToBack(winFrom, RETURN_DAYS, on).filter(p => !baseB2B.has(p.a + p.b)), dropped: Math.max(0, baseCount - count(on)),
      returns: !lastChange || lastChange <= addDays(winFrom, RETURN_DAYS - 1), ov: sim.ov };
  };
  const out: Suggestion[] = [];
  /* 1. przesunięcie planu (łańcuch do pierwszego wolnego dnia) — od dnia startu */
  { const sim: Sim = { ov: { ...base0 } }; const on = simOn(sim); let carry: string | null = id; if (from !== start) simSet(sim, from, null);
    let d = start; if (from === start) simSet(sim, start, null); else { const there = on(start); simSet(sim, start, carry); carry = there; }
    for (let i = 0; i < SHIFT_MAX_DAYS && carry; i++) { const next = addDays(d, 1); const there = on(next); simSet(sim, next, carry); carry = there; d = next; }
    out.push(make('shift', sim)); }
  /* 2. przeniesienie tylko tego treningu na wolny dzień (najbliższe 6 dni) */
  for (let i = from === start ? 1 : 0; i <= 6; i++) { const k = addDays(start, i); const sim: Sim = { ov: { ...base0 } }; if (simOn(sim)(k)) continue; simSet(sim, from, null); simSet(sim, k, id); out.push(make('move', sim, k)); }
  /* 3. zamiana z najbliższym innym treningiem */
  if (from > today) for (let i = 1; i <= 6; i++) { const k = addDays(from, i); const sim: Sim = { ov: { ...base0 } }; const there = simOn(sim)(k); if (!there) continue; simSet(sim, from, there); simSet(sim, k, id); out.push(make('swap', sim, k)); break; } /* tylko dla dni przyszłych — „dziś nie dam rady” nie wstawia innego treningu na dziś */
  /* 4. pominięcie */
  { const sim: Sim = { ov: { ...base0 } }; simSet(sim, from, null); out.push(make('skip', sim)); }
  /* docs/research/23 reguła 4: najpierw zachować sesje (objętość tygodnia), potem unikać nowych par pod rząd (reguła 1–2: ostrzeżenie), potem najmniej zmian */
  const score = (x: Suggestion) => [x.returns ? 0 : 1, x.dropped, x.newBackToBack.length, x.changes];
  return out.sort((a, b) => { const sa = score(a), sb = score(b); for (let i = 0; i < sa.length; i++) if (sa[i] !== sb[i]) return sa[i] - sb[i]; return 0; });
}
/** Zastosowanie propozycji (na polecenie użytkownika). */
export function applySuggestion(sg: Suggestion) { const st = getState(); if (Object.keys(sg.ov).length) st.planOverrides = { ...sg.ov }; else delete st.planOverrides; tidy(); commit(); }
