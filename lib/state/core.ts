/*
 * Rdzeń magazynu: JEDYNE miejsce stanu w pamięci (S), uchwytu bazy i liczników zmian (rev, histRev, cfgRev, fgRev). Zapis (save, saveCfg,
 * setTimerState) — pamięć od razu, baza z opóźnieniem 300 ms w kolejce zapisów (klucze „state”, „live”, „cfg”); flush; szkice edycji w bazie;
 * komunikaty o błędzie zapisu i o kopii nieczytelnych danych; subskrypcje i hooki odświeżania ekranów; cache zależne od historii (memoHist).
 * Inne moduły zmieniają stan modułu tylko przez funkcje stąd (setS, setDb, seqAtLeast, setRecovery, setSavedDrafts, setNewerSchema).
 * Zależy od: ./util, ./time; zewnętrzne: ../seed, expo-sqlite, react.
 */
import * as SQLite from 'expo-sqlite';
import { useSyncExternalStore } from 'react';
import { blankTimer, type Base, type State, type Template } from '../seed';
import { isObj } from './util';
import { localISODate } from './time';

/*
 * Trwałość: cały stan aplikacji trzymany jako dokument JSON w SQLite (tabela kv).
 * To świadomy wybór dla wersji 0.x — identyczny kształt danych jak backup, więc import/eksport jest 1:1.
 *
 * Audyt 0.8.1 — zasady, których pilnuje ten plik:
 *  - odświeżanie ekranów: licznik `rev` rośnie przy KAŻDEJ zmianie i to on jest migawką useTick (wcześniej był nią
 *    metaUpdatedAt ustawiany dopiero przy zapisie na dysk → ekrany były o jedną zmianę spóźnione);
 *  - `histRev` rośnie tylko przy zmianach poza treningiem w toku — na nim wiszą cache historii (poprzednio, rekordy,
 *    indeks treningów z ćwiczeniem), więc pisanie w treningu nie przelicza całej historii;
 *  - nieczytelny zapis NIGDY nie jest nadpisywany: kopia trafia pod klucz state_corrupt_<czas>;
 *  - błąd zapisu nie jest połykany po cichu (persistError → baner), a przy wyjściu do tła zapis jest wymuszany (flush).
 */

export let S: State | null = null;
export let db: SQLite.SQLiteDatabase | null = null;
const listeners = new Set<() => void>();
let saveTimer: ReturnType<typeof setTimeout> | null = null;
export let rev = 0;
let histRev = 0;
/** Audyt 0.10 PERF-02: licznik zmian konfiguracji (szablony, ustawienia bez wpływu na obliczenia) — NIE unieważnia cache historii ani ekranów,
 * które pokazują tylko historię (Historia, Ćwiczenia, Więcej); szablony słuchają useCfgTick. */
let cfgRev = 0;
/** PERF-03 (wariant A, decyzja 08.10.2026: bez wierszy SQLite): zmiany konfiguracji czekające na zapis (małym kluczem „cfg”) i zapisane tylko
 * w „cfg”, jeszcze nie w pełnym „state” (pełny zapis przy flush — wyjście do tła, koniec treningu, import — i przy każdej zmianie historii). */
let cfgDirty = false; let cfgNotInState = false;
/** Runda 69 (wydajność): czy zmieniło się coś poza treningiem w toku i timerem. Przy 1000 treningów pełny stan ma ~6 MB —
 * zapis go po każdym wpisie w serii był kosztowny; trening w toku i timer idą osobnym, małym kluczem „live”. */
let fullDirty = true;
/** Runda 69 (audyt T1): licznik zapisów zamiast zegara — cofnięty zegar ani awaria między dwoma zapisami nie wskrzeszają starych danych. */
let persistSeq = 0;
let persistError: string | null = null;
export let recovery: { key: string; at: number } | null = null;
/** Podział store (11.10.2026): stan modułu zmieniany tylko tutaj — moduł startu (init, replaceState) woła te funkcje zamiast przypisań. */
export function setS(next: State | null) { S = next; }
export function setDb(next: SQLite.SQLiteDatabase | null) { db = next; }
/** Numer zapisu nie mniejszy niż `n` (start: numery z „state”, „live” i „cfg”). */
export function seqAtLeast(n: number) { persistSeq = Math.max(persistSeq, n); }
export function setRecovery(r: { key: string; at: number } | null) { recovery = r; }

/** PERF-03 (A): pola stanu zapisywane małym kluczem „cfg”, gdy zmieniła się tylko konfiguracja (save(szablon), saveCfg). */
export const CFG_KEYS = ['settings', 'templates', 'weekPlan', 'savedPlans', 'planOverrides', 'planPlaces', 'planHistory', 'deloadWeeks', 'deloadSnooze', 'whatsNewSeen',
    'guideSeen'] as const;
/** Nakłada nowszy klucz „cfg” na wczytany stan (przed migrate): tylko gdy jego numer zapisu jest wyższy niż pełnego „state” — wtedy pola
 * z „cfg” są nowsze (brak pola w „cfg” = pole usunięte). Zwraca, czy nałożono. Wspólne dla startu i importu kopii odzysku. */
export function applyCfg(raw: unknown, c: unknown): boolean {
  if (!isObj(raw) || !isObj(c) || !isObj(c.data) || !Number.isFinite(c.seq) || !(c.seq > (Number(raw.saveSeq) || 0))) return false;
  for (const k of CFG_KEYS) { if (k in c.data) raw[k] = c.data[k]; else delete raw[k]; }
  return true;
}
/** Runda 71 (audyt T1b): zapisy idą po kolei. Wcześniej zapis timera (setTimerState) mógł wejść między nieudany pełny zapis
 * a jego ponowienie: „live” z wyższym numerem i active = null (już zakończony trening) lądował w bazie, choć historia nie —
 * po restarcie trening znikał z obu miejsc, a baner błędu gasł. */
let persistQueue: Promise<void> = Promise.resolve();
export function persistNow(force = false): Promise<void> { const p = persistQueue.then(() => persistRun(force)); persistQueue = p.catch(() => {}); return p; }
async function persistRun(force = false) {
  if (!db || !S) return;
  if (saveTimer) { clearTimeout(saveTimer); saveTimer = null; }
  /* PERF-03 (A): sama konfiguracja — mały klucz „cfg” (bez historii); flush (force) i każda zmiana historii — pełny „state” razem z konfiguracją */
  const now = Date.now();
  const full = fullDirty || (force && (cfgDirty || cfgNotInState));
  const cfgOnly = !full && cfgDirty;
  fullDirty = false;
  const wasCfg = cfgDirty, wasNotIn = cfgNotInState;
  cfgDirty = false;
  const seq = ++persistSeq;
  try {
    // Runda 72 (T4a): oba teksty z jednej, tej samej chwili — zmiana stanu w trakcie zapisu „state” (zakończenie treningu,
    // import) nie może trafić do „live” z tym samym numerem, bo po awarii nadpisałaby treningiem/null stan, którego nie ma w historii.
    if (full) { S.metaUpdatedAt = now; (S as any).saveSeq = seq; }
    const stateJson = full ? JSON.stringify(S) : null; const liveJson = JSON.stringify({ seq, at: now, active: S.active, timer: S.timer });
    const cfgJson = cfgOnly ? JSON.stringify({ seq, at: now, data: Object.fromEntries(CFG_KEYS.filter(k => S![k] !== undefined).map(k => [k, S![k]])) }) : null;
    if (stateJson != null) await db.runAsync('INSERT OR REPLACE INTO kv (k, v) VALUES (?, ?)', 'state', stateJson);
    if (cfgJson != null) await db.runAsync('INSERT OR REPLACE INTO kv (k, v) VALUES (?, ?)', 'cfg', cfgJson);
    if (full) cfgNotInState = false; else if (cfgOnly) cfgNotInState = true;
    await db.runAsync('INSERT OR REPLACE INTO kv (k, v) VALUES (?, ?)', 'live', liveJson);
    if (persistError && !fullDirty) { persistError = null; rev++; emit(); } /* T1b: baner gaśnie dopiero, gdy nic nie czeka na zapis */
  } catch (e) {
    if (full) fullDirty = true; /* nieudany pełny zapis — ponowimy */ if (wasCfg) cfgDirty = true; cfgNotInState = wasNotIn;
    persistError = e instanceof Error ? e.message : String(e); rev++; emit();
    throw e;
  }
}
/** Wymusza natychmiastowy zapis (wyjście do tła, koniec treningu, import, reset). */
export async function flush(): Promise<void> { await persistNow(true).catch(() => {}); await writeDrafts(); }
/** M1-audytor-generalny-006: jak `flush`, ale błąd zapisu stanu NIE jest połykany — import musi wiedzieć, czy dane trafiły do bazy, zanim powie „Zaimportowano”. */
export async function flushStrict(): Promise<void> { await persistNow(true); await writeDrafts(); }
/* ---------- UX2-03 = DAT2-06 (audyt kontrolny 1, wariant A — zasada właściciela z 20:20): szkice edycji ćwiczenia i szablonu w bazie ----------
 * Osobny klucz kv (nie część stanu: bez zmiany schematu, poza kopią i „cfg”; starsza wersja go nie czyta). Treść daje lib/draft.ts (rejestracja),
 * zapis z opóźnieniem jak stan i natychmiast przy wyjściu do tła (flush). Przy starcie surowy tekst czeka na lib/draft.ts (takeSavedDrafts). */
export const DRAFTS_KEY = 'drafts';
let savedDrafts: string | null = null;
let draftsSrc: (() => string | null) | null = null;
let draftsDirty = false;
let draftsTimer: ReturnType<typeof setTimeout> | null = null;
export function setSavedDrafts(v: string | null) { savedDrafts = v; }
export function registerDraftStore(src: () => string | null) { draftsSrc = src; }
/** Szkic zmieniony (początek, zmiana, zapis, odrzucenie) — zapis do bazy z opóźnieniem 300 ms. */
export function draftsChanged() {
  draftsDirty = true;
  if (draftsTimer) clearTimeout(draftsTimer);
  draftsTimer = setTimeout(() => {
    draftsTimer = null;
    void writeDrafts();
  }, 300);
}
async function writeDrafts() {
  if (draftsTimer) { clearTimeout(draftsTimer); draftsTimer = null; } if (!db || !S || !draftsDirty || !draftsSrc) return; draftsDirty = false;
  const j = draftsSrc();
  try {
    if (j == null)
      await db.runAsync('DELETE FROM kv WHERE k = ?', DRAFTS_KEY);
    else
      await db.runAsync('INSERT OR REPLACE INTO kv (k, v) VALUES (?, ?)', DRAFTS_KEY, j);
  } catch {
    draftsDirty = true;
  }
}
/** Surowe szkice odczytane przy starcie (jednorazowo). */
export function takeSavedDrafts(): string | null { const v = savedDrafts; savedDrafts = null; return v; }
export const getPersistError = () => persistError;
export const getRecovery = () => recovery;
/** Runda 33: po imporcie backupu albo wyczyszczeniu danych komunikat o nieczytelnych danych znika (kopia w bazie zostaje). */
export function clearRecovery() {
  if (!recovery) return;
  recovery = null;
  rev++;
  emit();
  db?.runAsync('DELETE FROM kv WHERE k = ?', 'recovery').catch(() => {});
}
/** Audyt 0.10 J1: schemat danych z nowszej wersji, które zatrzymały start (null — brak). */
let newerSchema: number | null = null;
export function setNewerSchema(v: number | null) { newerSchema = v; }
export const getNewerSchema = () => newerSchema;

export function emit() { listeners.forEach(l => l()); }
export function bump(hist: boolean) { rev++; if (hist) histRev++; }

/** Edycja na żądanie (decyzja właściciela 08.10.2026, docs/18): szkice ćwiczenia i szablonu (lib/draft.ts) to kopie poza stanem — `save(szkic)`
 * tylko odświeża ekran (bez zapisu do bazy, bez znacznika zmiany i bez unieważniania cache historii); dane zmienia dopiero „Zapisz”. */
const draftObjs = new WeakSet<object>();
export function markDraft<T extends object>(x: T): T { draftObjs.add(x); return x; }
export const isDraftObj = (x: unknown): boolean => !!x && typeof x === 'object' && draftObjs.has(x as object);
/**
 * Zapis: natychmiast w pamięci + zdebouncowany zapis do SQLite (300 ms). Przekazane encje dostają updatedAt = teraz.
 * Zmiana samego treningu w toku (save(active)) nie unieważnia cache historii.
 */
export function save(...touched: (Base | null | undefined)[]) {
  if (touched.length && touched.every(x => x && draftObjs.has(x))) { rev++; draftsChanged(); /* UX2-03: szkic do bazy */ emit(); return; }
  touched = touched.filter(x => !x || !draftObjs.has(x));
  const now = Date.now(); touched.forEach(x => { if (x) x.updatedAt = now; });
  const onlyActive = touched.length > 0 && touched.every(x => x && S && x === S.active);
  /* PERF-02: zmiana samych szablonów (np. znak w nazwie) nie unieważnia cache historii i nie przerysowuje zakładek historii; zapis małym kluczem „cfg” */
  const onlyCfg = !onlyActive && touched.length > 0 && touched.every(x => x && S && S.templates.includes(x as Template));
  if (onlyCfg) { rev++; cfgRev++; cfgDirty = true; } else { bump(!onlyActive); if (!onlyActive) fullDirty = true; }
  emit();
  if (saveTimer) clearTimeout(saveTimer);
  saveTimer = setTimeout(() => { persistNow().catch(() => {}); }, 300);
}

/** PERF-02/03: zapis zmiany konfiguracji bez wpływu na obliczenia z historii (Ustawienia: wygląd, dźwięk, widok, przerwa domyślna, skala wysiłku…). */
export function saveCfg() {
  rev++; cfgRev++; cfgDirty = true; emit();
  if (saveTimer) clearTimeout(saveTimer);
  saveTimer = setTimeout(() => { persistNow().catch(() => {}); }, 300);
}
export function getState(): State { if (!S) throw new Error('store not initialised'); return S; }

export const subscribe = (cb: () => void) => { listeners.add(cb); return () => { listeners.delete(cb); }; };
export function useStore<T>(selector: (s: State) => T): T {
  return useSyncExternalStore(subscribe, () => selector(getState()), () => selector(getState()));
}
/** Odświeżenie ekranu po każdej zmianie stanu. */
export const useTick = () => useSyncExternalStore(subscribe, () => rev, () => rev);
/** Tylko zmiana języka/jednostki — dla layoutów, które nie muszą się przerysowywać przy każdym wpisie. */
export const usePrefsTick = () => useStore(s => `${s.settings.language}|${s.settings.unit}|${s.settings.theme}`);
export const getHistRev = () => histRev;
/** Licznik każdej zmiany stanu (jak useTick) — klucz krótkich cache ekranów (PERF-04). */
export const getRev = () => rev;
/** Runda 30: powrót aplikacji na pierwszy plan — ekrany z datą „dziś” (ekran główny, poranny wpis) liczą się od nowa. */
let fgRev = 0;
export function refreshViews() { rev++; fgRev++; emit(); }
export const useForegroundTick = () => useSyncExternalStore(subscribe, () => fgRev, () => fgRev);
/**
 * Runda 14: odświeżenie tylko po zmianach poza treningiem w toku (historia, szablony, ćwiczenia, ustawienia).
 * Zakładki bez treningu nie przerysowują się przy każdym wpisie serii (runda 13: 400 wierszy historii na znak).
 */
// Runda 31/46: także po zmianie dnia (daty, rok) — ale nie przy każdym powrocie z tła (lista 1000 sesji to ~0,5 s).
const histSnap = () => `${histRev}:${localISODate()}`;
export const useHistTick = () => useSyncExternalStore(subscribe, histSnap, histSnap);
/** PERF-02: historia ALBO konfiguracja (szablony) — dla ekranów, które pokazują szablony (zakładka Szablony). */
const cfgSnap = () => `${histRev}:${cfgRev}:${localISODate()}`;
export const useCfgTick = () => useSyncExternalStore(subscribe, cfgSnap, cfgSnap);

/** Prosty cache zależny od histRev. */
export function memoHist<T>(fn: () => T): () => T { let r = -1; let v: T; return () => { if (r !== histRev) { v = fn(); r = histRev; } return v; }; }
export function memoHistBy<K, T>(fn: (k: K) => T): (k: K) => T {
  let r = -1;
  const m = new Map<K, T>();
  return (k: K) => {
    if (r !== histRev) {
      m.clear();
      r = histRev;
    }
    if (!m.has(k)) m.set(k, fn(k));
    return m.get(k)!;
  };
}

/** Trwały stan timera — zapisywany natychmiast (bez debounce), bo chodzi o przeżycie zabicia aplikacji. */
export function setTimerState(patch: Partial<State['timer']>) {
  const st = getState();
  st.timer = { ...(st.timer ?? blankTimer()), ...patch };
  rev++;
  emit();
  persistNow().catch(() => {});
}
/** Tylko dla testów: czy store jest zainicjowany. */
export const isReadyForTests = () => !!S;
/** Tylko dla testów: czyści stan modułu (bez dotykania bazy). */
export function __resetForTests() {
  savedDrafts = null;
  draftsDirty = false;
  if (draftsTimer) clearTimeout(draftsTimer);
  draftsTimer = null;
  newerSchema = null;
  persistQueue = Promise.resolve();
  fullDirty = true;
  cfgDirty = false;
  cfgNotInState = false;
  persistSeq = 0;
  S = null;
  db = null;
  rev = 0;
  histRev += 1;
  persistError = null;
  recovery = null;
  if (saveTimer) clearTimeout(saveTimer);
  saveTimer = null;
  listeners.clear();
}
