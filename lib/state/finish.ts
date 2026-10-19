/*
 * Koniec treningu: porzucony trening (pytanie po 2 h, ciche zakończenie po 6 h), stoper serii po zimnym starcie, zakończenie, anulowanie,
 * usunięcie z historii oraz zapis treningu z edytora historii i treningu wstecz (docs/12).
 * Zależy od: ./core, ./pause, ./live, ./groups, ./exercises, ./setvals, ./sets; zewnętrzne: ../seed.
 */
import { hasTime, hasReps, hasDistance, type Workout, type WSet, type Exercise } from '../seed';
import { S, flush, save, getState, setTimerState } from './core';
import { setHasValue } from './sets';
import { blankSet } from './setvals';
import { normalizeGroups } from './groups';
import { closePause, resumeWorkout } from './pause';
import { purgeOrphans } from './exercises';
import { findSet, toggleDone } from './live';

/** Runda 69: porzucony trening. Pytanie po 2 h bez odhaczonej serii, ciche zakończenie po 6 h. */
export const STALE_ASK_MS = 2 * 3600e3, STALE_AUTO_MS = 6 * 3600e3;
/** Ostatnia aktywność treningu: godzina ostatniej odhaczonej serii (albo start). */
export function lastActivity(w: Workout): number {
  let t = w.startedAt;
  for (const e of w.exercises) for (const s of e.sets) if (s.done && typeof s.completedAt === 'number' && s.completedAt > t) t = s.completedAt;
  return t;
}
/** Aktywność łącznie z trwającym stoperem serii (runda 69, T1): mierzona seria to nie porzucony trening. */
export const staleRef = (w: Workout, now = Date.now()) => {
  const tm = S?.timer;
  const sw = tm?.setStartAt && tm.setId && w.exercises.some(e => e.sets.some(s => s.id === tm.setId)) ? tm.setStartAt : 0;
  /* T4a: znaczniki z przyszłości (import, „Kontynuuj” przy zegarze do przodu, potem poprawionym) pomijamy — inaczej blokowałyby pytanie i zapis na zawsze */
  /* T6: także start — gdy zegar był do przodu przez cały trening, żaden znacznik nie jest wiarygodny: -∞ = zapytaj od razu, ale nie zapisuj sam */
  const ok = (x: unknown) => typeof x === 'number' && Number.isFinite(x) && x <= now + 10 * 60e3 ? x : -Infinity;
  let r = ok(w.startedAt); for (const e of w.exercises) for (const s of e.sets) if (s.done) r = Math.max(r, ok(s.completedAt));
  return Math.max(r, ok(w.staleAck), sw ? ok(sw) : -Infinity); };
/** Runda 72 (T4a): wariant pytania/przypomnienia — jedno źródło dla obu. */
export const staleKind = (w: Workout): 'work' | 'warmup' | 'none' => hasWorkDone(w) ? 'work'
    : w.exercises.some(e => e.sets.some(s => s.done)) ? 'warmup' : 'none';
export const hasWorkDone = (w: Workout) => w.exercises.some(e => e.sets.some(s => s.done && s.kind !== 'warmup'));
/** Gdy trening w toku jest „porzucony” (≥ 2 h od ostatniej serii i od ostatniego „Kontynuuj”) — godzina ostatniej serii; inaczej null. */
export function staleSince(now = Date.now()): number | null {
  const a = S?.active;
  if (!a) return null;
  const last = lastActivity(a);
  return now - staleRef(a, now) >= STALE_ASK_MS ? last : null;
}
export function ackStale() { const a = S?.active; if (!a) return; a.staleAck = Date.now(); save(a); }
/** Q-010: ponowny pomiar odhaczonej serii to aktywność — przesuwa znacznik jak „Kontynuuj” (pytanie o porzucony trening liczy od niego). */
function touchStale(a: Workout, at: number) { if (Number.isFinite(at) && at > (Number(a.staleAck) || 0)) a.staleAck = Math.min(at, Date.now()); }
export function markActivity(a: Workout, at: number) {
  touchStale(a, at);
  if (a.pausedAt != null && Number.isFinite(at)) resumeWorkout(at, a); /* 08.10.2026: odhaczenie serii kończy pauzę */
}
/** Runda 75 (Q-002, decyzja 02.10.2026): po zamknięciu aplikacji stoper serii BEZ celu nie wraca. Seria odhacza się z czasem
 * z pola serii (wpisanym albo wstawionym z „Poprzednio”), a gdy pole jest puste — zostaje nieodhaczona do ręcznego wpisu.
 * Ponowny pomiar odhaczonej serii zostawia jej poprzedni czas. Stoper z celem kończy się jak dotąd (start + cel). Wołane raz przy starcie aplikacji. */
export function resolveColdStopwatch(now = Date.now()) {
  const tm = S?.timer; if (!tm?.setStartAt || !tm.setId || Number(tm.setTarget) > 0) return;
  const a = S?.active; const pos = a ? findSet(tm.setId) : null; const st = pos && a ? a.exercises[pos.ei].sets[pos.si] : null;
  if (pos && st && !st.done && Number(st.durationSec) > 0) toggleDone(pos.ei, pos.si, Math.min(now, tm.setStartAt + Number(st.durationSec) * 1000));
  /* Q-013: zdjęty ze stanu stoper był aktywnością — start liczy się jak „Kontynuuj” (staleAck), inaczej trening sprzed ≥ 6 h zapisałby się po cichu */
  else if (a && pos && Number.isFinite(tm.setStartAt) && tm.setStartAt <= now + 10 * 60e3) { touchStale(a, Math.min(tm.setStartAt, now)); save(a); /* audyt 0.14.0: sam znacznik — odhaczenie serii wznawia pauzę, a start stopera przed pauzą ją kasował */ }
  setTimerState({ setStartAt: null, setTarget: 0, setId: null });
}
/** Ciche zakończenie po 6 h bez aktywności (przy starcie i powrocie z tła). Bez odhaczonych serii roboczych trening czeka na decyzję. */
export function autoFinishStale(now = Date.now()): Workout | null {
  const a = S?.active; if (!a) return null;
  const ref = staleRef(a, now); if (!Number.isFinite(ref) || now - ref < STALE_AUTO_MS) return null; /* T6: bez wiarygodnej godziny nie kończymy po cichu */
  // T9: seria czasowa z celem, trwająca przy zamknięciu aplikacji, skończyła się o starcie + cel — jak na ekranie przy 2–6 h; nie przepada.
  const tm = S?.timer; let changed = false;
  if (tm?.setStartAt && tm.setId && !(Number(tm.setTarget) > 0))
    /* Q-011: stoper bez celu sprzed ≥ 6 h i tak nie wraca (timer.restore) — nie zostaje w zapisie */
    setTimerState({ setStartAt: null, setTarget: 0, setId: null });
  if (tm?.setStartAt && Number(tm.setTarget) > 0 && tm.setId) { const pos = findSet(tm.setId); const st = pos ? a.exercises[pos.ei].sets[pos.si] : null;
    const dur = Math.max(1, Math.min(Number(tm.setTarget), Math.floor((now - tm.setStartAt) / 1000))); /* T11: nie dłużej niż faktycznie minęło */
    if (st && !st.done && pos) {
      st.durationSec = dur;
      /* T10: ta sama ścieżka co na ekranie — podpowiedzi i rzeczywista przerwa */
      toggleDone(pos.ei, pos.si, Math.min(now, tm.setStartAt + Number(tm.setTarget) * 1000));
      changed = true;
    }
    else if (st && st.done) {
      st.durationSec = dur;
      markActivity(a, Math.min(now, tm.setStartAt + dur * 1000));
      changed = true;
    } /* T11: ponowny pomiar — jak finishTimedSet na ekranie */
    setTimerState({ setStartAt: null, setTarget: 0, setId: null }); }
  if (!hasWorkDone(a)) { if (changed) save(a); return null; }
  return finishWorkout(lastActivity(a));
}
/** Zakończenie treningu; `at` — godzina końca (po czasie: ostatnia seria, nie chwila kliknięcia). */
export function finishWorkout(at?: number): Workout | null {
  const st = getState(); const w = st.active; if (!w) return null;
  /* T4a: cofnięty zegar nie daje końca przed startem */
  w.finishedAt = Math.max(w.startedAt, at != null && Number.isFinite(at) ? Math.min(at, Date.now()) : Date.now());
  delete w.staleAck; delete w.watchEvents; delete w.watchLastAt; /* 0.20: dziennik zdarzeń zegarka tylko w treningu w toku (sesja zegarka `watch` zostaje do rozstrzygnięcia zapisu w Zdrowiu) */
  /* 08.10.2026: pauza trwająca przy „Zakończ” kończy się z treningiem; pauza po końcu (auto-zapis na ostatniej serii) nie liczy się */
  closePause(w, w.finishedAt);
  w.exercises = w.exercises.map(e => {
    const o = { ...e, sets: e.sets.filter(s => s.done).map(s => {
      delete s.pre;
      delete s.toFill; /* 0.20: „Zakończ mimo to” — wartości z planu zostają, znacznik „do uzupełnienia” znika */
      return s;
    }) };
    delete o.splitFrom;
    delete o.altSkip;
    delete o.skipped; /* E2: tylko trening w toku (jak migrate M3/M4) */
    delete o.occ; /* Q-016 */
    return o;
  }).filter(e => e.sets.length);
  normalizeGroups(w.exercises);
  st.workouts.push(w); st.active = null; st.userTouched = true; purgeOrphans(); save(w); flush();
  return w;
}
export function cancelWorkout() { getState().active = null; purgeOrphans(); save(); flush(); }
export function deleteWorkout(id: string) { const st = getState(); st.workouts = st.workouts.filter(w => w.id !== id); purgeOrphans(); save(); flush(); }

/* ---------- edycja historii i trening wstecz (docs/12) ---------- */
/** Pusta seria (do edytora historii). */
export const emptySet = blankSet;
/** Seria historii ma wynik w metryce ćwiczenia: powtórzenia (kg × powt., powt.), czas (czas, kg × czas) albo dystans/czas (bieg).
 * Seria bez wyniku (np. plank bez czasu, 100 kg × 0) przy zapisie edycji odpada — jak nieodhaczona seria przy „Zakończ”. */
export function setHasResult(ex: Exercise | undefined, s: WSet): boolean {
  if (!ex) return setHasValue(s); const m = ex.metric ?? 'weight_reps';
  if (hasReps(m)) return Number(s.reps) > 0;
  if (hasDistance(m)) return Number(s.distanceM) > 0 || Number(s.durationSec) > 0;
  if (hasTime(m)) return Number(s.durationSec) > 0;
  return setHasValue(s);
}
/**
 * Zapis treningu z edytora historii: podmienia trening o id `replaceId` (edycja) albo dodaje nowy (trening wstecz) — w miejscu
 * zgodnym z datą startu. Jedna zmiana stanu: save() podbija histRev, więc rekordy, „Poprzednio”, wykresy, objętość tygodnia i CSV
 * liczą się od nowa. Trening w toku i timery nie są ruszane. false = edytowanego treningu już nie ma (usunięty w międzyczasie).
 */
export function putHistoryWorkout(w: Workout, replaceId: string | null): boolean {
  const st = getState();
  if (replaceId != null) { const i = st.workouts.findIndex(x => x.id === replaceId); if (i < 0) return false;
    /* weryfikacja 2 (L3): znacznik Apple Health i data utworzenia z treningu ZAPISANEGO teraz, nie ze szkicu — zapis do Zdrowia mógł skończyć się w
     * trakcie edycji */
    w.healthUUID = st.workouts[i].healthUUID; w.createdAt = st.workouts[i].createdAt; st.workouts.splice(i, 1); }
  w.exercises.forEach(e => e.sets.forEach(s => {
    s.done = true;
    s.warmup = s.kind === 'warmup';
    delete s.pre;
    delete s.hinted;
    delete s.edited;
    delete s.toFill;
    if (s.noBand !== true || s.bandId) delete s.noBand; /* jak migrate — kopia wraca 1:1 */
  }));
  w.exercises = w.exercises.filter(e => e.sets.length);
  w.exercises.forEach(e => {
    delete e.splitFrom;
    delete e.altSkip;
    delete e.skipped;
    delete e.occ; /* Q-016 */
  }); /* E2: tylko trening w toku */
  normalizeGroups(w.exercises);
  delete w.staleAck; delete w.watchEvents; delete w.watchLastAt; delete w.watch;
  /* Audyt M4: start w tej samej milisekundzie co inna sesja (albo trening w toku) — rekordy liczą się „przed startem” (<), więc obie
   * dostałyby PR, a „Poprzednio” zależałoby od kolejności wstawienia. Przesuwamy start, koniec i godziny serii o 1 s, aż start jest unikalny. */
  {
    const taken = new Set([...st.workouts, ...(st.active ? [st.active] : [])].map(x => x.startedAt));
    let bump = 0;
    while (taken.has(w.startedAt + bump)) bump += 1000;
    if (bump) {
      w.startedAt += bump;
      if (w.finishedAt != null) w.finishedAt += bump;
      if (w.pauses) w.pauses = w.pauses.map(([f, t]) => [f + bump, t + bump]);
      w.exercises.forEach(e => e.sets.forEach(s => {
        if (typeof s.completedAt === 'number') s.completedAt += bump;
      }));
    } }
  const j = st.workouts.findIndex(x => x.startedAt > w.startedAt); st.workouts.splice(j < 0 ? st.workouts.length : j, 0, w);
  st.userTouched = true; purgeOrphans(); save(w); flush();
  return true;
}
