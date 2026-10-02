import { useSyncExternalStore } from 'react';
import { getState, exById, isBW, restFor, occurrence, occurrences, normalizeGroups, assistLost, emptySet, copyVals, stripUnused, previousSetsBefore, setHasResult, putHistoryWorkout, localISODate, clampName, NAME_MAX } from './store';
import { base, uid, hasTime, hasReps, hasWeight, type Exercise, type Workout, type WSet } from './seed';
import { t } from './i18n';

/*
 * Edycja zakończonego treningu i trening wstecz (docs/12-edycja-treningow.md).
 * Edytor pracuje na SZKICU — głębokiej kopii treningu trzymanej tylko w pamięci (poza stanem aplikacji). Wpisywanie w szkicu
 * nie rusza historii ani jej cache (histRev); „Zapisz” podmienia trening jednym zapisem (store.putHistoryWorkout), „Anuluj” szkic wyrzuca.
 * Szkic nie przeżywa zamknięcia aplikacji (świadome uproszczenie — zapis jest jednym ruchem, jak w Strong i Hevy).
 */
export interface Draft {
  key: string;
  /** id edytowanego treningu z historii; null = nowy trening wstecz */
  sourceId: string | null;
  w: Workout;
  /** pola daty w edytorze: RRRR-MM-DD, GG:MM, minuty (tekst — walidacja przy zapisie) */
  date: string; time: string; min: string;
  /** stan wyjściowy do pytania „Odrzucić zmiany?” i do zachowania dokładnych znaczników, gdy daty nie ruszono */
  orig: string; origWhen: string; origStart: number; origEnd: number;
}

const drafts = new Map<string, Draft>();
let rev = 0; const listeners = new Set<() => void>();
const subscribe = (cb: () => void) => { listeners.add(cb); return () => { listeners.delete(cb); }; };
/** Odświeżenie edytora po zmianie szkicu (zmiany w szkicu nie przechodzą przez store.save). */
export function touchDraft() { rev++; listeners.forEach(l => l()); }
export const useDraftTick = () => useSyncExternalStore(subscribe, () => rev, () => rev);
export const draftOf = (key: string): Draft | undefined => drafts.get(key);
export function discardDraft(key: string) { if (drafts.delete(key)) touchDraft(); }

const pad = (n: number) => String(n).padStart(2, '0');
export const dateText = (ts: number) => localISODate(new Date(ts));
export const timeText = (ts: number) => { const d = new Date(ts); return `${pad(d.getHours())}:${pad(d.getMinutes())}`; };
export const minText = (start: number, end: number) => String(Math.max(1, Math.round((end - start) / 60000)));
const snap = (d: Draft) => JSON.stringify([d.w, d.date, d.time, d.min]);
const whenKey = (d: { date: string; time: string; min: string }) => `${d.date.trim()}|${d.time.trim()}|${d.min.trim()}`;
function make(key: string, sourceId: string | null, w: Workout): Draft {
  const end = w.finishedAt ?? w.startedAt;
  const d: Draft = { key, sourceId, w, date: dateText(w.startedAt), time: timeText(w.startedAt), min: minText(w.startedAt, end), orig: '', origWhen: '', origStart: w.startedAt, origEnd: end };
  d.orig = snap(d); d.origWhen = whenKey(d); drafts.set(key, d); return d; /* bez powiadamiania — nowego szkicu nikt jeszcze nie rysuje (bywa tworzony w trakcie renderu edytora) */
}
/** Czy w szkicu coś zmieniono (pytanie przy „Anuluj”). */
export const isDirty = (d: Draft) => snap(d) !== d.orig;

/** Nowy szkic edycji treningu z historii (zawsze od świeżej kopii — porzucony wcześniej szkic nie wraca). null = nie ma takiego treningu. */
export function beginEdit(id: string): Draft | null {
  const src = getState().workouts.find(x => x.id === id); if (!src) return null;
  const w: Workout = JSON.parse(JSON.stringify(src));
  w.exercises.forEach(e => e.sets.forEach(s => { delete s.pre; delete s.hinted; delete s.edited; }));
  return make(id, id, w);
}

/** Domyślny termin treningu wstecz: wczoraj o 18:00, 60 minut. */
export function defaultPastWhen(now = new Date()) { const s = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1, 18, 0).getTime(); return { date: dateText(s), time: '18:00', min: '60' }; }

/**
 * Szkic treningu wstecz. Z szablonu: pozycje jak przy starcie treningu, wartości z ostatniej sesji ćwiczenia PRZED tą datą (późniejsze
 * treningi się nie liczą), a bez niej — ciężar startowy i cel czasu z szablonu oraz dolna granica powtórzeń (to, co wstawiłoby odhaczenie
 * pustej serii). Bez dotykania treningu w toku, timerów, powiadomień i maszynerii podpowiedzi („pre”, „hinted”).
 */
export function beginPast(tplId: string | null, start: number, end: number): Draft {
  const st = getState(); const tpl = tplId ? st.templates.find(x => x.id === tplId) ?? null : null;
  const w: Workout = { ...base(st.ownerId), loggedBy: st.ownerId, sessionMode: 'solo', healthUUID: null, templateId: tpl?.id ?? null, templateName: tpl?.name ?? '', startedAt: start, finishedAt: end, note: '', exercises: [] };
  tpl?.items.forEach((it, ii) => {
    const ex = exById(it.exerciseId); if (!ex || ex.archived) return;
    const prev = previousSetsBefore(ex.id, start, occurrence(tpl.items, ii), occurrences(tpl.items, ex.id), it.id);
    const n = Math.max(1, Math.min(50, Math.floor(Number(it.sets) || 1)));
    const sets: WSet[] = [];
    for (let i = 0; i < n; i++) sets.push(prefill(ex, prev ? prev[Math.min(i, prev.length - 1)] : null, it.startWeight, it.targetSec, it.repMin));
    w.exercises.push({ id: uid(), exerciseId: ex.id, restSec: typeof it.restSec === 'number' && it.restSec >= 0 ? it.restSec : restFor(ex), repMin: it.repMin, repMax: it.repMax, groupId: it.groupId ?? null, sets, tplItemId: it.id });
  });
  normalizeGroups(w.exercises);
  return make('new-' + uid(), null, w);
}
function prefill(ex: Exercise, p0: WSet | null, startWeight: number | '' = '', targetSec: number | '' = '', repMin: number | null = null): WSet {
  const m = ex.metric ?? 'weight_reps'; const p = assistLost(ex, p0) ? null : p0;
  const s = { ...emptySet(), ...(p ? copyVals(p) : { weight: isBW(ex) || !hasWeight(m) || startWeight === '' ? '' : Math.max(0, Number(startWeight)), addKg: isBW(ex) && hasWeight(m) ? startWeight : '' }), done: true } as WSet;
  if (hasTime(m)) s.durationSec = Number(targetSec) > 0 ? Number(targetSec) : (p && Number(p.durationSec) > 0 ? Number(p.durationSec) : '');
  if (hasReps(m) && s.reps === '' && repMin != null) s.reps = repMin;
  return stripUnused(ex, s);
}

/* ---------- zmiany szkicu ---------- */
/** Ćwiczenie z wyboru (picker, target 'edit:<klucz>'): jedna seria z wartościami ostatniej sesji przed datą treningu. */
export function draftAddExercise(key: string, ex: Exercise) {
  const d = drafts.get(key); if (!d) return;
  const prev = previousSetsBefore(ex.id, d.w.startedAt);
  d.w.exercises.push({ id: uid(), exerciseId: ex.id, restSec: restFor(ex), repMin: null, repMax: null, groupId: null, sets: [prefill(ex, prev?.[0] ?? null)] });
  touchDraft();
}
/** Nowa seria = kopia ostatniej (po rozgrzewce pusta seria zwykła, po drop secie drop set — jak „+ seria” w treningu). */
export function draftAddSet(key: string, ei: number) {
  const d = drafts.get(key); const e = d?.w.exercises[ei]; if (!d || !e) return;
  const l = e.sets[e.sets.length - 1]; const fromWarmup = !l || l.kind === 'warmup';
  const s: WSet = { ...emptySet(), ...(fromWarmup ? {} : copyVals(l)), rpe: !fromWarmup && l ? l.rpe : '', kind: l?.kind === 'drop' ? 'drop' : 'normal', done: true };
  e.sets.push(stripUnused(exById(e.exerciseId), s)); touchDraft();
}
export function draftRemoveSet(key: string, ei: number, setId: string) {
  const e = drafts.get(key)?.w.exercises[ei]; if (!e) return; const i = e.sets.findIndex(s => s.id === setId); if (i < 0) return; e.sets.splice(i, 1); touchDraft();
}
export function draftRemoveExercise(key: string, blockId: string) {
  const d = drafts.get(key); if (!d) return; const i = d.w.exercises.findIndex(e => e.id === blockId); if (i < 0) return;
  d.w.exercises.splice(i, 1); normalizeGroups(d.w.exercises); touchDraft();
}
/** Przesunięcie daty o dzień (przyciski ‹ ›). Nieczytelna data zostaje bez zmian. */
export function shiftDate(date: string, days: number): string {
  const m = /^(\d{4})-(\d{1,2})-(\d{1,2})$/.exec(date.trim()); if (!m) return date;
  return dateText(new Date(+m[1], +m[2] - 1, +m[3] + days).getTime());
}

/* ---------- walidacja i zapis ---------- */
/** Termin z pól edytora. Koniec = start + czas trwania; koniec po starcie (≥ 1 min) i nie w przyszłości. */
export function parseWhen(date: string, time: string, min: string, now = Date.now()): { start: number; end: number } | { error: string } {
  const dm = /^(\d{4})-(\d{1,2})-(\d{1,2})$/.exec(date.trim());
  const day = dm ? new Date(+dm[1], +dm[2] - 1, +dm[3]) : null;
  if (!dm || !day || day.getFullYear() !== +dm[1] || day.getMonth() !== +dm[2] - 1 || day.getDate() !== +dm[3] || +dm[1] < 1970) return { error: t('Nieprawidłowa data. Wpisz RRRR-MM-DD, np. {d}.', { d: dateText(now) }) };
  const tm = /^(\d{1,2})[:.](\d{2})$/.exec(time.trim());
  if (!tm || +tm[1] > 23 || +tm[2] > 59) return { error: t('Nieprawidłowa godzina. Wpisz GG:MM, np. 18:00.') };
  const mins = Number(min.trim().replace(',', '.'));
  if (!Number.isInteger(mins) || mins < 1 || mins > 1440) return { error: t('Czas trwania: od 1 do 1440 minut.') };
  const start = new Date(+dm[1], +dm[2] - 1, +dm[3], +tm[1], +tm[2]).getTime(); const end = start + mins * 60000;
  if (end > now) return { error: t('Koniec treningu ({t}) jest w przyszłości. Zmień datę, godzinę albo czas trwania.', { t: `${dateText(end)} ${timeText(end)}` }) };
  return { start, end };
}
export type DraftCheck = { error: string } | { w: Workout; dropped: number; empty: boolean };
/**
 * Gotowy do zapisu trening ze szkicu (kopia — szkic zostaje do ewentualnego „Wróć”). Serie bez wyniku w metryce ćwiczenia odpadają
 * (liczba w `dropped` do ostrzeżenia), ćwiczenia bez serii też; `empty` = nie zostało nic do zapisania.
 */
export function checkDraft(key: string, now = Date.now()): DraftCheck {
  const d = drafts.get(key); if (!d) return { error: t('Brak sesji.') };
  let start = d.origStart, end = d.origEnd;
  if (whenKey(d) !== d.origWhen || d.sourceId == null) { const r = parseWhen(d.date, d.time, d.min, now); if ('error' in r) return r; start = r.start; end = r.end; } /* bez zmian w polach: dokładne znaczniki (sekundy) zostają */
  const w: Workout = JSON.parse(JSON.stringify(d.w)); const delta = start - d.origStart;
  w.startedAt = start; w.finishedAt = end; w.templateName = clampName(w.templateName.replace(/\s+/g, ' ').trim(), NAME_MAX);
  let dropped = 0;
  w.exercises.forEach(e => { const ex = exById(e.exerciseId); const keep = e.sets.filter(s => setHasResult(ex, s)); dropped += e.sets.length - keep.length; e.sets = keep; });
  w.exercises = w.exercises.filter(e => e.sets.length);
  /* godziny serii: przesunięte razem ze startem; nowe serie (bez godziny) zaraz po poprzedniej — kolejność PR jak na liście */
  let last = start;
  w.exercises.forEach(e => e.sets.forEach(s => { if (typeof s.completedAt === 'number') { s.completedAt += delta; last = s.completedAt; } else { last += 1000; s.completedAt = last; s.actualRest = null; } }));
  return { w, dropped, empty: !w.exercises.length };
}
/** Zapis szkicu do historii. Zwraca zapisany trening albo błąd (np. trening usunięty w międzyczasie). */
export function commitDraft(key: string, now = Date.now()): { w: Workout } | { error: string } {
  const d = drafts.get(key); const c = checkDraft(key, now); if ('error' in c) return c;
  if (c.empty) return { error: t('Nie ma żadnej serii z wynikiem.') };
  if (!putHistoryWorkout(c.w, d!.sourceId)) return { error: t('Tej sesji nie ma już w historii.') };
  drafts.delete(key); touchDraft();
  return { w: c.w };
}
/** Tylko dla testów. */
export function __resetDrafts() { drafts.clear(); rev++; }
