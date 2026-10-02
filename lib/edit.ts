import { useSyncExternalStore } from 'react';
import { getState, exById, isBW, restFor, occurrence, occurrences, normalizeGroups, assistLost, emptySet, copyVals, stripUnused, previousBlockBefore, setHasResult, putHistoryWorkout, localISODate, clampName, NAME_MAX } from './store';
import { base, uid, hasTime, hasReps, hasWeight, type Exercise, type Workout, type WExercise, type WSet } from './seed';
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
  /** stan wyjściowy: pytanie „Odrzucić zmiany?”, dokładne znaczniki, gdy pól terminu nie ruszono, i teksty pól z otwarcia */
  orig: string; origStart: number; origEnd: number; oDate: string; oTime: string; oMin: string;
  /** Audyt H1: wartości serii zapisanych wcześniej (id → wartości) — seria nieruszona w edytorze zostaje, nawet bez „wyniku” w dzisiejszej metryce */
  origVals: Record<string, string>;
  /** Audyt M2 / weryfikacja 2 (L2): pola wypełnione przez aplikację (id serii → pole → wstawiona wartość) i data startu, sprzed której
   * je wzięto — po zmianie daty pola wciąż równe wstawionej wartości liczą się od nowa z sesji sprzed nowej daty; pola wpisane ręcznie zostają */
  prefilled: Record<string, Partial<Record<VKey, unknown>>>; prefillAt: number;
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
/** Pola wartości serii (to, co decyduje o wyniku i o tym, czy seria była „ruszona”). */
const VKEYS = ['weight', 'reps', 'durationSec', 'distanceM', 'addKg', 'bandId'] as const;
type VKey = typeof VKEYS[number];
const vals = (s: WSet) => JSON.stringify(VKEYS.map(k => s[k] ?? ''));
const snap = (d: Draft) => JSON.stringify([d.w, d.date, d.time, d.min]);
function make(key: string, sourceId: string | null, w: Workout): Draft {
  const end = w.finishedAt ?? w.startedAt; const date = dateText(w.startedAt), time = timeText(w.startedAt), min = minText(w.startedAt, end);
  const origVals: Record<string, string> = {}; if (sourceId != null) w.exercises.forEach(e => e.sets.forEach(s => { origVals[s.id] = vals(s); }));
  const d: Draft = { key, sourceId, w, date, time, min, orig: '', origStart: w.startedAt, origEnd: end, oDate: date, oTime: time, oMin: min, origVals, prefilled: {}, prefillAt: w.startedAt };
  d.orig = snap(d); drafts.set(key, d); return d; /* bez powiadamiania — nowego szkicu nikt jeszcze nie rysuje (bywa tworzony w trakcie renderu edytora) */
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
 * treningi się nie liczą; dobór bloku jak „Poprzednio” — store.previousBlockBefore), a bez niej — ciężar startowy i cel czasu z szablonu
 * oraz dolna granica powtórzeń (to, co wstawiłoby odhaczenie pustej serii). Bez dotykania treningu w toku, timerów, powiadomień
 * i maszynerii podpowiedzi („pre”, „hinted”).
 */
export function beginPast(tplId: string | null, start: number, end: number): Draft {
  const st = getState(); const tpl = tplId ? st.templates.find(x => x.id === tplId) ?? null : null;
  const w: Workout = { ...base(st.ownerId), loggedBy: st.ownerId, sessionMode: 'solo', healthUUID: null, templateId: tpl?.id ?? null, templateName: tpl?.name ?? '', startedAt: start, finishedAt: end, note: '', exercises: [] };
  tpl?.items.forEach(it => {
    const ex = exById(it.exerciseId); if (!ex || ex.archived) return;
    const n = Math.max(1, Math.min(50, Math.floor(Number(it.sets) || 1)));
    w.exercises.push({ id: uid(), exerciseId: ex.id, restSec: typeof it.restSec === 'number' && it.restSec >= 0 ? it.restSec : restFor(ex), repMin: it.repMin, repMax: it.repMax, groupId: it.groupId ?? null, sets: Array.from({ length: n }, () => ({ ...emptySet(), done: true })), tplItemId: it.id });
  });
  normalizeGroups(w.exercises);
  const d = make('new-' + uid(), null, w); refill(d, start, true); d.orig = snap(d); return d;
}
function prefill(ex: Exercise, p0: WSet | null, startWeight: number | '' = '', targetSec: number | '' = '', repMin: number | null = null): WSet {
  const m = ex.metric ?? 'weight_reps'; const p = assistLost(ex, p0) ? null : p0;
  const s = { ...emptySet(), ...(p ? copyVals(p) : { weight: isBW(ex) || !hasWeight(m) || startWeight === '' ? '' : Math.max(0, Number(startWeight)), addKg: isBW(ex) && hasWeight(m) ? startWeight : '' }), done: true } as WSet;
  if (hasTime(m)) s.durationSec = Number(targetSec) > 0 ? Number(targetSec) : (p && Number(p.durationSec) > 0 ? Number(p.durationSec) : '');
  if (hasReps(m) && s.reps === '' && repMin != null) s.reps = repMin;
  return stripUnused(ex, s);
}
/** Wartości wstawiane w blok przy danej dacie: blok z pozycji szablonu — jak start z szablonu (seria i-ta z bloku „Poprzednio”), blok dodany
 * w edytorze — OSTATNIA seria robocza z „Poprzednio” sprzed tej daty. Edytowany trening nie jest źródłem dla samego siebie. */
function prefillFor(d: Draft, e: WExercise, before: number): ((i: number) => WSet) | null {
  const ex = exById(e.exerciseId); if (!ex) return null; const w = d.w;
  const tpl = w.templateId ? getState().templates.find(x => x.id === w.templateId) ?? null : null;
  const it = tpl && e.tplItemId ? tpl.items.find(x => x.id === e.tplItemId && x.exerciseId === e.exerciseId) : undefined;
  const ii = it && tpl ? tpl.items.indexOf(it) : -1; const ei = w.exercises.indexOf(e);
  const p = it && tpl ? previousBlockBefore(ex.id, before, occurrence(tpl.items, ii), occurrences(tpl.items, ex.id), it.id, tpl.id, d.sourceId)
    : previousBlockBefore(ex.id, before, occurrence(w.exercises, ei), occurrences(w.exercises, ex.id), e.tplItemId, w.templateId, d.sourceId);
  const src = p ? p.sets.filter(x => x.kind !== 'drop') : []; /* jak startFromTemplate: drop sety nie są źródłem zwykłych serii */
  return it ? (i => prefill(ex, src.length ? src[Math.min(i, src.length - 1)] : null, it.startWeight, it.targetSec, it.repMin)) : (() => prefill(ex, src.length ? src[src.length - 1] : null));
}
/** Pola serii wciąż równe wartości wstawionej przez aplikację (pole zmienione ręcznie wypada). */
const liveKeys = (d: Draft, s: WSet): VKey[] => { const r = d.prefilled[s.id]; return r ? (Object.keys(r) as VKey[]).filter(k => s[k] === r[k]) : []; };
/** Wypełnia serie wartościami sprzed `before`. force — wszystkie pola serii bloku (nowy szkic, nowe ćwiczenie); inaczej tylko pola
 * wypełnione wcześniej przez aplikację i od tamtej pory nieruszone (weryfikacja 2, L2: per pole — wpisane powtórzenia nie blokują
 * przeliczenia ciężaru). */
function refill(d: Draft, before: number, force: boolean, only?: WExercise) {
  for (const e of only ? [only] : d.w.exercises) {
    if (!force && !e.sets.some(s => liveKeys(d, s).length)) continue;
    const f = prefillFor(d, e, before); if (!f) continue;
    e.sets.forEach((s, i) => {
      const keys = force ? [...VKEYS] : liveKeys(d, s); if (!keys.length) { delete d.prefilled[s.id]; return; }
      const n = f(i); const rec: Partial<Record<VKey, unknown>> = {};
      for (const k of keys) { (s as any)[k] = n[k]; rec[k] = n[k]; }
      d.prefilled[s.id] = rec;
    });
  }
  d.prefillAt = before;
}
/** Start z bieżących pól daty i godziny (bez czasu trwania); pola nieruszone — start z otwarcia szkicu; niedokończone (w trakcie pisania) — null. */
function currentStart(d: Draft): number | null {
  if (d.date.trim() === d.oDate && d.time.trim() === d.oTime) return d.origStart;
  const r = parseStart(d.date, d.time); return typeof r === 'number' ? r : null;
}
/** Zmiana pól terminu w edytorze. Audyt M2: gdy zmienia się start, nieruszone wartości wstawione przez aplikację liczą się od nowa
 * z sesji sprzed NOWEJ daty (trening przesunięty wcześniej nie zostaje z ciężarami z późniejszych treningów). */
export function draftSetWhen(key: string, p: Partial<{ date: string; time: string; min: string }>) {
  const d = drafts.get(key); if (!d) return; Object.assign(d, p);
  const s = currentStart(d); if (s != null && s !== d.prefillAt) refill(d, s, false); /* niedokończona data: wartości zostają do czasu poprawnej */
  touchDraft();
}

/* ---------- zmiany szkicu ---------- */
/** Ćwiczenie z wyboru (picker, target 'edit:<klucz>'): jedna seria z wartościami ostatniej serii roboczej sprzed bieżącej daty w edytorze. */
export function draftAddExercise(key: string, ex: Exercise) {
  const d = drafts.get(key); if (!d) return;
  const e: WExercise = { id: uid(), exerciseId: ex.id, restSec: restFor(ex), repMin: null, repMax: null, groupId: null, sets: [{ ...emptySet(), done: true }] };
  const at = currentStart(d) ?? d.prefillAt; if (at !== d.prefillAt) refill(d, at, false); /* reszta szkicu na tę samą datę */
  d.w.exercises.push(e); refill(d, at, true, e);
  touchDraft();
}
/** Nowa seria = kopia ostatniej (po rozgrzewce pusta seria zwykła, po drop secie drop set — jak „+ seria” w treningu). */
export function draftAddSet(key: string, ei: number) {
  const d = drafts.get(key); const e = d?.w.exercises[ei]; if (!d || !e) return;
  const l = e.sets[e.sets.length - 1]; const fromWarmup = !l || l.kind === 'warmup';
  const s: WSet = stripUnused(exById(e.exerciseId), { ...emptySet(), ...(fromWarmup ? {} : copyVals(l)), rpe: !fromWarmup && l ? l.rpe : '', kind: l?.kind === 'drop' ? 'drop' : 'normal', done: true });
  /* weryfikacja 2 (L1): kopia pól wypełnionych przez aplikację i nieruszonych też jest „wypełniona przez aplikację” — po zmianie daty liczy się od nowa */
  if (!fromWarmup && l) { const rec: Partial<Record<VKey, unknown>> = {}; for (const k of liveKeys(d, l)) if (s[k] === l[k]) rec[k] = s[k]; if (Object.keys(rec).length) d.prefilled[s.id] = rec; }
  e.sets.push(s); touchDraft();
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
/** Start z pól daty i godziny albo komunikat błędu. Audyt (LOW): godzina nieistniejąca przez zmianę czasu (np. 02:30 w marcu) — błąd, nie cicha zmiana. */
function parseStart(date: string, time: string, now = Date.now()): number | string {
  const dm = /^(\d{4})-(\d{1,2})-(\d{1,2})$/.exec(date.trim());
  const day = dm ? new Date(+dm[1], +dm[2] - 1, +dm[3]) : null;
  if (!dm || !day || day.getFullYear() !== +dm[1] || day.getMonth() !== +dm[2] - 1 || day.getDate() !== +dm[3] || +dm[1] < 1970) return t('Nieprawidłowa data. Wpisz RRRR-MM-DD, np. {d}.', { d: dateText(now) });
  const tm = /^(\d{1,2})[:.](\d{2})$/.exec(time.trim());
  if (!tm || +tm[1] > 23 || +tm[2] > 59) return t('Nieprawidłowa godzina. Wpisz GG:MM, np. 18:00.');
  const s = new Date(+dm[1], +dm[2] - 1, +dm[3], +tm[1], +tm[2]);
  if (s.getDate() !== +dm[3] || s.getHours() !== +tm[1] || s.getMinutes() !== +tm[2]) return t('Godzina {t} nie istnieje tego dnia (zmiana czasu). Wpisz inną.', { t: `${pad(+tm[1])}:${tm[2]}` });
  return s.getTime();
}
/** Czas trwania w minutach: liczba całkowita 1–1440 (bez ułamków, znaków i wykładników). */
function parseMin(min: string): number | string { const m = min.trim(); return /^\d{1,4}$/.test(m) && +m >= 1 && +m <= 1440 ? +m : t('Czas trwania: od 1 do 1440 minut.'); }
const futureError = (end: number) => t('Koniec treningu ({t}) jest w przyszłości. Zmień datę, godzinę albo czas trwania.', { t: `${dateText(end)} ${timeText(end)}` });
/** Termin z pól (ekran treningu wstecz). Koniec = start + czas trwania; koniec po starcie (≥ 1 min) i nie w przyszłości. */
export function parseWhen(date: string, time: string, min: string, now = Date.now()): { start: number; end: number } | { error: string } {
  const start = parseStart(date, time, now); if (typeof start === 'string') return { error: start };
  const mins = parseMin(min); if (typeof mins === 'string') return { error: mins };
  const end = start + mins * 60000; if (end > now) return { error: futureError(end) };
  return { start, end };
}
/** Audyt M5: trening wstecz / przesunięta sesja nie może nachodzić na trening w toku (trwa od startu do teraz). */
export function activeOverlapError(start: number, end: number): string | null {
  const a = getState().active; if (!a || end <= a.startedAt) return null; void start;
  return t('Ten termin nachodzi na trening w toku (start {t}). Wybierz wcześniejszy.', { t: `${dateText(a.startedAt)} ${timeText(a.startedAt)}` });
}
/** Termin szkicu. Pola nieruszone zostają co do sekundy: sama zmiana czasu trwania nie przesuwa startu, sama zmiana daty/godziny
 * zachowuje dawny czas trwania (także > 24 h z importu). `changed` — termin inny niż przy otwarciu (albo nowy trening). */
function resolveWhen(d: Draft, now: number): { start: number; end: number; changed: boolean } | { error: string } {
  const startSame = d.date.trim() === d.oDate && d.time.trim() === d.oTime, minSame = d.min.trim() === d.oMin;
  if (d.sourceId != null && startSame && minSame) return { start: d.origStart, end: d.origEnd, changed: false };
  let start = d.origStart; if (!startSame) { const r = parseStart(d.date, d.time, now); if (typeof r === 'string') return { error: r }; start = r; }
  let dur = d.origEnd - d.origStart; if (!minSame) { const m = parseMin(d.min); if (typeof m === 'string') return { error: m }; dur = m * 60000; }
  const end = start + dur; if (end > now) return { error: futureError(end) };
  return { start, end, changed: true };
}
export type DraftCheck = { error: string } | { w: Workout; dropped: number; empty: boolean; overlap: Workout | null };
/**
 * Gotowy do zapisu trening ze szkicu (kopia — szkic zostaje do ewentualnego „Wróć”). Audyt H1: serie NOWE albo ZMIENIONE w edytorze bez
 * wyniku w metryce ćwiczenia odpadają (liczba w `dropped` do ostrzeżenia); serie zapisane wcześniej i nieruszone zostają zawsze (historia
 * może mieć odhaczone serie bez powtórzeń albo serie z dawnej metryki ćwiczenia). Ćwiczenia bez serii odpadają; `empty` = nic do zapisania.
 * `overlap` — inna sesja z historii w tym samym czasie (do potwierdzenia); nachodzenie na trening w toku to błąd.
 */
export function checkDraft(key: string, now = Date.now()): DraftCheck {
  const d = drafts.get(key); if (!d) return { error: t('Brak sesji.') };
  const r = resolveWhen(d, now); if ('error' in r) return r; const { start, end, changed } = r;
  if (changed) { const e = activeOverlapError(start, end); if (e) return { error: e }; }
  const w: Workout = JSON.parse(JSON.stringify(d.w)); const delta = start - d.origStart;
  w.startedAt = start; w.finishedAt = end; w.templateName = clampName(w.templateName.replace(/\s+/g, ' ').trim(), NAME_MAX);
  let dropped = 0;
  w.exercises.forEach(e => { const ex = exById(e.exerciseId); const keep = e.sets.filter(s => d.origVals[s.id] === vals(s) || setHasResult(ex, s)); dropped += e.sets.length - keep.length; e.sets = keep; });
  w.exercises = w.exercises.filter(e => e.sets.length);
  /* godziny serii: przy zmianie terminu przesunięte razem ze startem i w granicach [start, koniec] (skrócony trening); serie nowe
   * i zmienione bez godziny dostają ją zaraz po poprzedniej (kolejność PR jak na liście). Weryfikacja 2 (L4): seria nieruszona bez godziny
   * (stare dane) zostaje bez godziny i z dawną przerwą — kopia wraca 1:1. */
  const clamp = (x: number) => Math.min(end, Math.max(start, x)); let last = start; const touched = (s: WSet) => d.origVals[s.id] !== vals(s);
  w.exercises.forEach(e => e.sets.forEach(s => {
    if (typeof s.completedAt === 'number') { if (changed) s.completedAt = clamp(s.completedAt + delta); last = s.completedAt; }
    else if (touched(s)) { last = clamp(last + 1000); s.completedAt = last; s.actualRest = null; }
  }));
  const overlap = changed ? getState().workouts.find(x => x.id !== d.sourceId && x.startedAt < end && (x.finishedAt ?? x.startedAt) > start) ?? null : null;
  return { w, dropped, empty: !w.exercises.length, overlap };
}
/** Zapis szkicu do historii. Zwraca zapisany trening albo błąd (np. trening usunięty w międzyczasie). */
export function commitDraft(key: string, now = Date.now()): { w: Workout } | { error: string } {
  const d = drafts.get(key); if (d) { const s = currentStart(d); if (s != null && s !== d.prefillAt) refill(d, s, false); }
  const c = checkDraft(key, now); if ('error' in c) return c;
  if (c.empty) return { error: t('Nie ma żadnej serii z wynikiem.') };
  if (!putHistoryWorkout(c.w, d!.sourceId)) return { error: t('Tej sesji nie ma już w historii.') };
  drafts.delete(key); touchDraft();
  return { w: c.w };
}
/** Tylko dla testów. */
export function __resetDrafts() { drafts.clear(); rev++; }
