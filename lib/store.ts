import * as SQLite from 'expo-sqlite';
import * as FileSystem from 'expo-file-system';
import { useSyncExternalStore } from 'react';
import { t, t as tr, tIn, applyLang, detectLang, locale } from './i18n';
import { applyUnit, wu, wOut, wIn, KG_PER_LB, fmtW, fmtNum, snapLegacyLb } from './units';
import { seedState, uid, base, defaultModules, defaultSettings, metricFor, loadModeFor, loadMult, blankTimer, musclesFor, hasTime, hasReps, hasWeight, hasDistance, METRICS, DEFAULT_REST, GROUPS, LIB, SCHEMA_VERSION, LOCAL_OWNER, MODULES, SET_KINDS, SINGLE_IMPLEMENT, type Base, type State, type Workout, type WSet, type WExercise, type Exercise, type Template, type Morning } from './seed';

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

let S: State | null = null;
let db: SQLite.SQLiteDatabase | null = null;
const listeners = new Set<() => void>();
let saveTimer: ReturnType<typeof setTimeout> | null = null;
let rev = 0;
let histRev = 0;
/** Runda 69 (wydajność): czy zmieniło się coś poza treningiem w toku i timerem. Przy 1000 treningów pełny stan ma ~6 MB —
 * zapis go po każdym wpisie w serii był kosztowny; trening w toku i timer idą osobnym, małym kluczem „live”. */
let fullDirty = true;
/** Runda 69 (audyt T1): licznik zapisów zamiast zegara — cofnięty zegar ani awaria między dwoma zapisami nie wskrzeszają starych danych. */
let persistSeq = 0;
let persistError: string | null = null;
let recovery: { key: string; at: number } | null = null;

/** Runda 75 (audyt T14): baza poza katalogiem Dokumenty. Dokumenty są widoczne w Plikach (kopie automatyczne, T-012), a bazy w toku
 * nie wolno dać do usunięcia ani podmiany. Library/SQLite jest prywatne dla aplikacji i wchodzi do kopii telefonu. Bez ścieżki
 * domyślnej (web, testy) — baza zostaje tam, gdzie chce expo-sqlite. */
export function dbDirectory(def: string | null | undefined = SQLite.defaultDatabaseDirectory): string | undefined {
  return def && /\/Documents\/SQLite\/?$/.test(def) ? def.replace(/\/Documents\/SQLite\/?$/, '/Library/SQLite') : undefined;
}
/** Minimalny interfejs bazy do przeniesienia wierszy (testowalny bez natywnego SQLite). */
export type KvDb = { getFirstAsync<T>(q: string, ...p: unknown[]): Promise<T | null>; getAllAsync<T>(q: string, ...p: unknown[]): Promise<T[]>; runAsync(q: string, ...p: unknown[]): Promise<unknown>; withTransactionAsync(f: () => Promise<void>): Promise<void>; closeAsync(): Promise<void> };
/** Przenosi wiersze kv ze starej bazy (Dokumenty, wersje sprzed rundy 75) do nowej — w jednej transakcji; stara baza kasowana dopiero
 * po udanym zapisie. Przez SQLite, nie przez expo-file-system: ten pozwala pisać tylko do Dokumentów, Caches i Application Support
 * (audyt T14b). Przerwanie w dowolnym momencie nie gubi danych: bez zatwierdzonej transakcji stara baza zostaje i przeniesienie
 * powtarza się przy następnym starcie; po zatwierdzonej — nowa ma już „state” i stara jest tylko sprzątana. Zwraca liczbę wierszy. */
export async function copyKv(old: KvDb, next: KvDb): Promise<number> {
  const t = await old.getFirstAsync<{ name: string }>("SELECT name FROM sqlite_master WHERE type = 'table' AND name = 'kv'");
  const rows = t ? await old.getAllAsync<{ k: string; v: string }>('SELECT k, v FROM kv') : [];
  if (rows.length) await next.withTransactionAsync(async () => { for (const r of rows) await next.runAsync('INSERT OR REPLACE INTO kv (k, v) VALUES (?, ?)', r.k, r.v); });
  return rows.length;
}
async function openDb(): Promise<SQLite.SQLiteDatabase> {
  const def: string | null | undefined = SQLite.defaultDatabaseDirectory; const dir = dbDirectory(def);
  if (!dir) return SQLite.openDatabaseAsync('trening.db');
  const KV = 'CREATE TABLE IF NOT EXISTS kv (k TEXT PRIMARY KEY, v TEXT NOT NULL)';
  let next: SQLite.SQLiteDatabase | null = null; let hasState = false;
  try { next = await SQLite.openDatabaseAsync('trening.db', undefined, dir); await next.execAsync(KV); hasState = !!(await next.getFirstAsync('SELECT k FROM kv WHERE k = ?', 'state')); }
  catch (e) { /* nowa baza nieczytelna: stara w Dokumentach tylko wtedy, gdy naprawdę ma dane (jeszcze nieprzeniesione) — inaczej błąd startu
               z ponowieniem, a nie pusta aplikacja nad prawdziwymi danymi (audyt T14c) */
    try { await next?.closeAsync(); } catch {}
    const old = await SQLite.openDatabaseAsync('trening.db'); let ok = false;
    try { ok = !!(await old.getFirstAsync("SELECT name FROM sqlite_master WHERE type = 'table' AND name = 'kv'")) && !!(await old.getFirstAsync('SELECT k FROM kv WHERE k = ?', 'state')); } catch {}
    if (ok) return old;
    await old.closeAsync().catch(() => {}); throw e;
  }
  if (hasState) return next;
  /* pierwszy start w nowym miejscu: przeniesienie ze starej bazy (albo nic — nowa instalacja) */
  const old = await SQLite.openDatabaseAsync('trening.db');
  try { await copyKv(old, next); }
  catch { await next.closeAsync().catch(() => {}); return old; /* przeniesienie się nie udało — dane zostają w starej bazie, ponowienie przy następnym starcie */ }
  await old.closeAsync().catch(() => {}); /* błąd zamknięcia nie cofa udanego przeniesienia */
  void cleanupLegacy(def!);
  return next;
}
/** Sprząta starą bazę i pusty katalog Dokumenty/SQLite (widoczny w Plikach). Tylko po przeniesieniu; błędy bez znaczenia. */
async function cleanupLegacy(def: string) {
  try { await SQLite.deleteDatabaseAsync('trening.db'); } catch {}
  try { const uri = 'file://' + def.replace(/\/$/, ''); const left = await FileSystem.readDirectoryAsync(uri); if (left.every(f => /^trening\.db-(journal|wal|shm)$/.test(f))) await FileSystem.deleteAsync(uri, { idempotent: true }); /* tylko resztki dziennika — bez samej bazy */ } catch {}
}

export async function init(): Promise<void> {
  if (S) return;
  db = await openDb();
  await db.execAsync('CREATE TABLE IF NOT EXISTS kv (k TEXT PRIMARY KEY, v TEXT NOT NULL)');
  const row = await db.getFirstAsync<{ v: string }>('SELECT v FROM kv WHERE k = ?', 'state');
  let needsPersist = false;
  if (row) {
    try {
      const raw = JSON.parse(row.v); const before = raw?.schemaVersion;
      // Runda 69: nowszy trening w toku i timer z klucza „live” (zapisywanego przy każdej zmianie serii).
      try { const lv = await db.getFirstAsync<{ v: string }>('SELECT v FROM kv WHERE k = ?', 'live'); const l = lv ? JSON.parse(lv.v) : null;
        const fresher = l && typeof l === 'object' && (Number.isFinite(l.seq) && Number.isFinite(raw?.saveSeq) ? l.seq >= raw.saveSeq : Number(l.at) >= (Number(raw?.metaUpdatedAt) || 0));
        if (raw && typeof raw === 'object' && fresher && 'active' in l) { raw.active = l.active; if (l.timer && typeof l.timer === 'object') raw.timer = l.timer; }
        persistSeq = Math.max(persistSeq, Number(raw?.saveSeq) || 0, Number(l?.seq) || 0); } catch {}
      S = migrate(raw); needsPersist = before !== SCHEMA_VERSION;
    } catch {
      // Nie nadpisujemy jedynej kopii danych: odkładamy ją pod osobny klucz i startujemy od czystego stanu.
      const key = `state_corrupt_${Date.now()}`;
      await db.runAsync('INSERT OR REPLACE INTO kv (k, v) VALUES (?, ?)', key, row.v);
      // Runda 69 (T1): trening w toku z klucza „live” trafia do tej samej kopii (osobny klucz) — wysyłany razem z nią.
      // T1b/T4a: stary „live” nie może nałożyć się na nowy, czysty stan przy następnym starcie — numer zapisu podbijamy najpierw,
      // a kopia i usunięcie mają osobne try (nieudana kopia nie zostawia „live” w bazie).
      let lv: { v: string } | null = null; try { lv = await db.getFirstAsync<{ v: string }>('SELECT v FROM kv WHERE k = ?', 'live'); } catch {}
      if (lv) { try { persistSeq = Math.max(persistSeq, Number(JSON.parse(lv.v)?.seq) || 0); } catch {}
        try { await db.runAsync('INSERT OR REPLACE INTO kv (k, v) VALUES (?, ?)', key + '_live', lv.v); } catch {}
        try { await db.runAsync('DELETE FROM kv WHERE k = ?', 'live'); } catch {} }
      recovery = { key, at: Date.now() }; S = null;
      // Runda 34: znacznik w bazie — komunikat i wysłanie kopii działają także po ponownym uruchomieniu.
      // Runda 35: gdy wcześniejsza kopia wciąż czeka na wysłanie, zostaje ona (zwykle to w niej jest prawdziwa historia).
      try { const old = await db.getFirstAsync<{ v: string }>('SELECT v FROM kv WHERE k = ?', 'recovery'); const o = old ? JSON.parse(old.v) : null;
        if (o && typeof o.key === 'string' && await db.getFirstAsync('SELECT k FROM kv WHERE k = ?', o.key)) recovery = { key: o.key, at: Number(o.at) || 0 }; } catch {}
      await db.runAsync('INSERT OR REPLACE INTO kv (k, v) VALUES (?, ?)', 'recovery', JSON.stringify(recovery)).catch(() => {});
    }
  }
  if (!recovery) { try { const m = await db.getFirstAsync<{ v: string }>('SELECT v FROM kv WHERE k = ?', 'recovery'); const r = m ? JSON.parse(m.v) : null; if (r && typeof r.key === 'string') recovery = { key: r.key, at: Number(r.at) || 0 }; } catch {} }
  if (!S) { S = seedState(detectLang()); needsPersist = true; }
  applyPrefs();
  if (needsPersist) await persistNow().catch(() => {});
  bump(true); emit();
}

/** Przenosi język i jednostkę z ustawień do warstwy wyświetlania. Wołane po starcie, imporcie i zmianie ustawień. */
export function applyPrefs() { if (!S) return; applyLang(S.settings.language); applyUnit(S.settings.unit); }

const isObj = (x: unknown): x is Record<string, any> => !!x && typeof x === 'object' && !Array.isArray(x);
const arr = (x: unknown): any[] => Array.isArray(x) ? x.filter(isObj) : [];
const LIB_NAMES = new Set(LIB.map(l => l[0]));

/**
 * Migracja do bieżącego schematu. Przyjmuje backupy web 0.3, natywnej 0.1.0 i każdą późniejszą wersję;
 * dopisuje brakujące pola, pomija uszkodzone wpisy (null, nie-obiekty) zamiast się wywracać.
 * Idempotentna — można ją wołać na stanie już zmigrowanym.
 */
/** Runda 51: liczba z importu — także z tekstu (przecinek dziesiętny); null dla nieskończoności, NaN, obiektów i absurdalnych rzędów wielkości. */
function parseNum(v: unknown): number | null { const n = typeof v === 'number' ? v : typeof v === 'string' && v.trim() !== '' ? Number(v.trim().replace(/^(-?\d*),(\d+)$/, '$1.$2')) : NaN; return Number.isFinite(n) && Math.abs(n) <= 1e7 ? n : null; }
/** Runda 51: identyfikator jako tekst (liczbowe id z ręcznie edytowanych backupów), inaczej null. */
const idOf = (v: unknown): string | null => typeof v === 'string' && v ? v : typeof v === 'number' && Number.isFinite(v) ? String(v) : null;
/** Runda 51: znacznik czasu w zakresie Date (inaczej „Invalid Date”); tekst daty też. */
const tsOf = (v: unknown): number | null => { const x = typeof v === 'string' ? v.trim() : v; const n = typeof x === 'number' ? x : typeof x !== 'string' || !x ? NaN : /^-?\d+(\.\d+)?$/.test(x) ? Number(x) /* runda 52: liczba tekstem */ : /^\d{4}-\d{2}-\d{2}$/.test(x) ? localDateTs(x) /* sama data: lokalna północ, nie UTC */ : Date.parse(x); return Number.isFinite(n) && Math.abs(n) <= 8.64e15 ? n : null; };
const intIn = (v: unknown, min: number, max: number): number | null => { const n = parseNum(v); return n == null || Math.floor(n) < min ? null : Math.min(max, Math.floor(n)); };
/** Runda 55: wartości zapisane przez starą wersję z funtów przyciągamy tylko w danych sprzed schematu 11 — nowsze kg (np. 45,359237) zostają co do cyfry. */
let legacyLb = false;
/** Runda 60: kg w danych na siatce 0,01 — jak wpis w polu (wIn) i wyświetlanie; 100,006 z importu nie daje „rekordu” nad wpisanym 100,01. */
const kg2 = (v: number) => Math.sign(v) * Math.round(Math.abs(v) * 100) / 100 + 0; // runda 61: połówki od zera jak units.round (asysta lustrzana)
const snapL = (v: unknown) => legacyLb ? snapLegacyLb(v) : v;
/** Runda 50: nieujemna liczba z importu (także z tekstu, przecinek dziesiętny) albo ''. */
const posNum = (v: unknown): number | '' => { const n = parseNum(v); return n == null ? '' : Math.max(0, n); }; // runda 57: bez zaokrąglania (waga, sen, asysta)
/** Runda 48/49: wartość serii z importu — liczba (także z tekstu) albo ''. Tylko asysta ±kg bywa ujemna; RPE ≤ 10, powtórzenia całkowite, bez absurdalnych rzędów wielkości. */
const SET_NUM = ['weight', 'reps', 'durationSec', 'distanceM', 'rpe', 'addKg'] as const;
function setNum(k: typeof SET_NUM[number], v: unknown): number | '' {
  if (v === '') return ''; /* runda 74: najczęstszy przypadek przy starcie (puste pola serii) bez parsowania */
  const n = parseNum(v); // runda 50: „62,5” z tekstu
  if (n == null) return '';
  const x = k === 'addKg' ? n : Math.max(0, n);
  const r = k === 'rpe' ? Math.min(10, x) : k === 'reps' ? Math.floor(x) : k === 'durationSec' ? Math.min(86400, Math.round(x)) /* runda 61: doba, jak cel stopera */ : k === 'distanceM' ? Math.round(x) /* runda 57: pełne s i m jak w polach i stoperze */ : x;
  return k === 'weight' || k === 'addKg' ? kg2(snapL(r) as number) : r;
}
export function migrate(raw: any): State {
  if (!isObj(raw) || !Array.isArray(raw.exercises) || !Array.isArray(raw.templates)) throw new Error('bad state');
  legacyLb = !((Number(raw.schemaVersion) || 0) >= 11);
  const owner: string = typeof raw.ownerId === 'string' && raw.ownerId ? raw.ownerId : LOCAL_OWNER;
  const stamp = (o: any, fallbackTs?: number) => {
    o.id = idOf(o.id) ?? uid(); // runda 51: id zawsze tekstem
    if (typeof o.ownerId !== 'string' || !o.ownerId) o.ownerId = owner;
    const ts = typeof fallbackTs === 'number' && fallbackTs > 0 && tsOf(fallbackTs) != null ? fallbackTs : Date.now();
    const c = tsOf(o.createdAt); o.createdAt = c != null && c > 0 ? c : ts; // runda 52: zawsze liczba
    const u = tsOf(o.updatedAt); o.updatedAt = u != null && u > 0 ? u : o.createdAt;
  };
  raw.exercises = arr(raw.exercises).filter(e => typeof e.name === 'string');
  raw.exercises.forEach((e: any) => { const n = e.name.replace(/\s+/g, ' ').trim(); e.name = n || tIn(raw.settings?.language, 'Nowe ćwiczenie'); }); // runda 36: w języku z ustawień danych // runda 34/35: spacje na brzegach; pusta nazwa (wyjście bez zatwierdzenia) → domyślna
  /* Audyt przed telefonem (A1, decyzja 02.10 „zabezpiecz”): stare dane bez metryki (web 0.3 znała tylko kg × powt.) — gdy metryka
   * z biblioteki ukryłaby zapisane kg/powtórzenia (np. plank → czas), ćwiczenie zostaje w formie kg × powt.; zmiana w edycji ćwiczenia. */
  const logged = new Map<string, { w: boolean; r: boolean }>();
  if (raw.exercises.some((e: any) => !(METRICS as readonly string[]).includes(e.metric))) for (const w of [...arr(raw.workouts), ...(isObj(raw.active) ? [raw.active] : [])]) for (const x of arr(w?.exercises)) {
    const id = idOf(x?.exerciseId); if (id == null) continue; const o = logged.get(id) ?? { w: false, r: false };
    for (const st of arr(x.sets)) { if (w !== raw.active && !st.done) continue; if ((parseNum(st?.weight) ?? 0) > 0 || (parseNum(st?.addKg) ?? 0) !== 0) o.w = true; if ((parseNum(st?.reps) ?? 0) > 0) o.r = true; } logged.set(id, o); }
  raw.exercises.forEach((e: any) => {
    stamp(e);
    // Runda 16: wartości spoza słownika / nieliczbowe (np. z ręcznie edytowanego backupu) wracają do domyślnych.
    if (!(METRICS as readonly string[]).includes(e.metric)) { const lib = metricFor(e.name); const g = logged.get(idOf(e.id) ?? ''); e.metric = g && ((g.w && !hasWeight(lib)) || (g.r && !hasReps(lib))) ? (g.w ? 'weight_reps' : 'reps') : lib; }
    if (!['per_dumbbell', 'total', 'unilateral'].includes(e.loadMode)) e.loadMode = loadModeFor(e.equipment, e.name);
    for (const k of ['restSec', 'restWarmupSec']) { const v = parseNum(e[k]); e[k] = v == null || v < 0 ? null : Math.min(1800, Math.round(v)); }
    if (!Array.isArray(e.muscles)) { const [a, b] = musclesFor(e.name, e.group); e.muscles = a; e.secondaryMuscles = b; }
    if (!Array.isArray(e.secondaryMuscles)) e.secondaryMuscles = []; e.muscles = e.muscles.filter((x: unknown) => typeof x === 'string'); e.secondaryMuscles = e.secondaryMuscles.filter((x: unknown) => typeof x === 'string');
    delete e.bodyweightPct; /* schemat 13 (runda 75, Q-001): masa ciała nie wchodzi do obliczeń — udział % usunięty */
    if (e.lib === undefined && LIB_NAMES.has(e.name) && (Number(raw.schemaVersion) || 0) < 10) e.lib = true; /* runda 52/56: tylko dane sprzed schematu 10 — stała granica, nie ruchome SCHEMA_VERSION (podbicie do 11 cofało poprawkę) */ if (e.lib !== true) delete e.lib;
    if (typeof e.tempo !== 'string') e.tempo = ''; if (typeof e.notes !== 'string') e.notes = '';
    e.bandAssistable = !!e.bandAssistable;
    // Runda 41: tylko prawdziwe true archiwizuje; partia i sprzęt spoza słownika → „inne”.
    if (e.archived !== true) delete e.archived; if (!(GROUPS as readonly string[]).includes(e.group)) e.group = 'inne'; if (!['hantle', 'sztanga', 'masa ciała', 'maszyna', 'linki', 'inne'].includes(e.equipment)) e.equipment = 'inne';
    // Schemat 10: ćwiczenia jednym hantlem z biblioteki liczone ×1 (poprzednio ×2 — zawyżona objętość).
    if (e.lib && SINGLE_IMPLEMENT.has(e.name) && e.loadMode === 'per_dumbbell' && (Number(raw.schemaVersion) || 0) < 10) e.loadMode = 'total';
  });
  raw.templates = arr(raw.templates);
  raw.templates.forEach((t: any) => { stamp(t); if (typeof t.name !== 'string') t.name = ''; t.items = arr(t.items); t.items = t.items.filter((it: any) => idOf(it.exerciseId) != null); t.items.forEach((it: any) => { it.id = idOf(it.id) ?? uid(); it.exerciseId = idOf(it.exerciseId); { const v = parseNum(it.targetSec); it.targetSec = v == null || v < 0 ? '' : Math.min(86400, Math.round(v)); } /* runda 51 */ it.groupId = idOf(it.groupId); it.sets = intIn(it.sets, 1, 50) ?? 1; /* runda 15: liczba, nie tekst z importu */ if (it.startWeight === undefined) it.startWeight = ''; for (const k of ['repMin', 'repMax']) it[k] = intIn(it[k], 1, 100); { const v = parseNum(it.restSec); it.restSec = v == null || v < 0 ? null : Math.min(1800, Math.round(v)); } /* runda 49: także tekst, jak przerwa ćwiczenia */ /* runda 17: limit 1800 */ { const v = parseNum(it.startWeight); it.startWeight = v == null ? '' : kg2(snapL(v) as number); } }); });
  raw.templates.forEach((x: any) => { const n = x.name.replace(/\s+/g, ' ').trim(); x.name = n || tIn(raw.settings?.language, 'Nowy szablon'); }); // runda 35: jak nazwy ćwiczeń
  const fixSet = (s: any) => {
    s.id = idOf(s.id) ?? uid(); s.bandId = idOf(s.bandId) ?? ''; // runda 51
    // Runda 48: wartości serii to liczba albo '' (import/ręczna edycja: tekst, tablica, obiekt, NaN); tylko asysta ±kg może być ujemna.
    /* runda 74: brak (undefined/null) też daje '' — przez setNum, bez osobnej pętli */ for (const k of SET_NUM) s[k] = setNum(k, s[k]);
    // runda 27: stare wpisy z funtów — snapLegacyLb w setNum
    if (typeof s.bandId !== 'string') s.bandId = ''; if (s.noBand !== true || s.bandId) delete s.noBand; if (s.completedAt != null) s.completedAt = tsOf(s.completedAt); { const v = parseNum(s.actualRest); s.actualRest = v == null || v < 0 ? null : Math.min(3600, Math.round(v)); } /* runda 52: jak przy odhaczeniu (< 1 h) */ if (typeof s.note !== 'string') s.note = '';
    if (!(SET_KINDS as readonly string[]).includes(s.kind)) s.kind = s.warmup ? 'warmup' : 'normal'; s.warmup = s.kind === 'warmup'; // runda 15: nieznany typ z importu
    s.done = !!s.done; if (s.completedAt === undefined) s.completedAt = null; if (s.actualRest === undefined) s.actualRest = null;
    // Runda 5: hinted to mapa {pole: wstawiona wartość}; stary format (lista) albo śmieci → brak podpowiedzi.
    if (s.hinted != null && (typeof s.hinted !== 'object' || Array.isArray(s.hinted))) s.hinted = undefined;
    // Runda 49: podpowiedź tylko dla pól wartości (id/kind nie mogą zostać wyczyszczone przy cofnięciu) i w tej samej postaci co wartości.
    if (s.hinted) { const h: any = {}; for (const k of SET_NUM) if (k in s.hinted) { const v = setNum(k, s.hinted[k]); if (v !== '') h[k] = v; } if (idOf(s.hinted.bandId)) h.bandId = idOf(s.hinted.bandId); s.hinted = Object.keys(h).length ? h : undefined; }
    if (s.pre != null) { const h: any = {}; if (typeof s.pre === 'object' && !Array.isArray(s.pre)) for (const k of PRE_KEYS) if (k in s.pre) { const v = setNum(k, s.pre[k]); if (v !== '') h[k] = v; } if (Object.keys(h).length) s.pre = h; else delete s.pre; } /* decyzja 02.10 (audyt B2) */
  };
  const fixWorkout = (w: any) => {
    if (typeof w.loggedBy !== 'string' || !w.loggedBy) w.loggedBy = owner; if (typeof w.sessionMode !== 'string' || !w.sessionMode) w.sessionMode = 'solo'; if (typeof w.healthUUID !== 'string' || !w.healthUUID) w.healthUUID = null; /* runda 52 */ delete w.bodyWeightKg; /* schemat 13 (Q-001): bez zamrożonej masy ciała */
    w.startedAt = tsOf(w.startedAt); w.finishedAt = w === raw.active ? null : (tsOf(w.finishedAt) ?? w.startedAt); if (w !== raw.active || tsOf(w.staleAck) == null) delete w.staleAck; else w.staleAck = tsOf(w.staleAck); /* runda 69 */ /* runda 49/51: trening z historii zawsze zakończony; trening w toku — nie */ /* runda 49: zakończony (choć nieczytelny) trening zostaje w historii */ if (w.finishedAt != null && w.finishedAt < w.startedAt) w.finishedAt = w.startedAt; /* runda 48 */ if (typeof w.templateName !== 'string') w.templateName = ''; if (typeof w.note !== 'string') w.note = ''; w.templateId = idOf(w.templateId);
    w.exercises = arr(w.exercises).filter((e: any) => idOf(e.exerciseId) != null); /* runda 50/51 */ if (w !== raw.active) { w.exercises.forEach((e: any) => { e.sets = arr(e.sets).filter((s: any) => !!s.done); e.sets.forEach((s: any) => { delete s.pre; }); }); w.exercises = w.exercises.filter((e: any) => e.sets.length); } /* runda 59: historia = tylko odhaczone serie, jak po „Zakończ” */ w.exercises.forEach((e: any) => { e.exerciseId = idOf(e.exerciseId); e.id = idOf(e.id) ?? uid(); if (e.tplItemId != null) e.tplItemId = idOf(e.tplItemId) ?? undefined; for (const k of ['repMin', 'repMax']) e[k] = intIn(e[k], 1, 100); /* runda 49: jak w szablonie */ e.groupId = idOf(e.groupId); { const v = parseNum(e.restSec); e.restSec = v == null || v < 0 ? DEFAULT_REST : Math.min(1800, Math.round(v)); } e.sets = arr(e.sets); e.sets.forEach(fixSet); }); normalizeGroups(w.exercises);
  };
  raw.bands = arr(raw.bands); raw.bands.forEach((b: any) => { stamp(b); if (b.nominalKg === undefined) b.nominalKg = ''; b.nominalKg = posNum(b.nominalKg) === '' ? '' : kg2(snapL(posNum(b.nominalKg)) as number); /* runda 50 */ if (typeof b.color !== 'string' || !b.color.trim()) b.color = '?'; b.color = b.color.replace(/\s+/g, ' ').trim(); b.level = intIn(b.level, 1, 7) ?? 1; /* runda 51 */ });
  raw.workouts = arr(raw.workouts).filter(w => tsOf(w.startedAt) != null); raw.workouts.forEach((w: any) => { w.startedAt = tsOf(w.startedAt); }); raw.workouts.forEach((w: any) => { stamp(w, w.finishedAt || w.startedAt); fixWorkout(w); }); raw.workouts = raw.workouts.filter((w: any) => w.exercises.length); /* runda 60: bez pustych sesji w historii (jak po „Zakończ”, B9) */
  // Runda 16: data poranna w formacie RRRR-MM-DD (np. „2026-9-1” z ręcznej edycji → „2026-09-01”); nieczytelne odpadają.
  raw.mornings = arr(raw.mornings).filter(m => typeof m.date === 'string' && /^\d{4}-\d{1,2}-\d{1,2}/.test(m.date)).map((m: any) => { const [y, mo, d] = m.date.slice(0, 10).split(/[-T]/); m.date = `${y}-${mo.padStart(2, '0')}-${d.padStart(2, '0')}`; return m; })
    // Runda 17: tylko istniejące daty (bez „2026-13-45”) i jeden wpis na dzień (zostaje nowszy).
    .filter((m: any) => { const [y, mo, d] = m.date.split('-').map(Number); const x = new Date(y, mo - 1, d); return x.getFullYear() === y && x.getMonth() === mo - 1 && x.getDate() === d; });
  { const byDate = new Map<string, any>(); for (const m of raw.mornings) { const o = byDate.get(m.date); if (!o || (tsOf(m.updatedAt) ?? 0) > (tsOf(o.updatedAt) ?? 0)) byDate.set(m.date, m); } raw.mornings = [...byDate.values()]; }
  raw.mornings.forEach((m: any) => { stamp(m, localDateTs(m.date)); for (const k of ['bb', 'sleepScore', 'sleepH', 'weight']) m[k] = posNum(m[k]); /* runda 50: liczba albo '' (obiekt z importu wywracał ekran) */ if (m.bb !== '') m.bb = Math.min(100, Math.round(m.bb)); if (m.sleepScore !== '') m.sleepScore = Math.min(100, Math.round(m.sleepScore)); if (m.sleepH !== '') m.sleepH = Math.min(24, Math.round(m.sleepH * 100) / 100); if (m.weight !== '') { const w = kg2(snapL(m.weight) as number); m.weight = w > 0 && w <= 1000 ? w : ''; } /* runda 61: najpierw zaokrąglenie, potem zakres */ /* runda 51: 0 = brak wpisu */ });
  if (isObj(raw.active) && tsOf(raw.active.startedAt) != null) { stamp(raw.active, raw.active.startedAt); fixWorkout(raw.active); } else raw.active = null;
  // Runda 41: jak purgeOrphans — usunięte ćwiczenia bez żadnego treningu znikają także przy starcie i imporcie.
  { const used = new Set<string>(); for (const w of [...raw.workouts, ...(raw.active ? [raw.active] : [])]) for (const x of w.exercises) used.add(x.exerciseId); raw.exercises = raw.exercises.filter((e: any) => e.archived !== true || used.has(e.id)); }
  // Runda 43: pozycje szablonów wskazujące brakujące lub usunięte ćwiczenie odpadają (jak przy usuwaniu ćwiczenia w aplikacji).
  { const ok = new Set<string>(raw.exercises.filter((e: any) => e.archived !== true).map((e: any) => e.id)); raw.templates.forEach((tp: any) => { const n = tp.items.length; tp.items = tp.items.filter((it: any) => ok.has(it.exerciseId)); void n; normalizeGroups(tp.items); /* T-010 (audyt): zawsze — rozerwana grupa z importu dzieliłaby klucz bloku przy przeciąganiu */ }); }
  raw.timer = { ...blankTimer(), ...(isObj(raw.timer) ? raw.timer : {}) };
  delete raw.timer.setEi; delete raw.timer.setSi;
  { const T = raw.timer, b = blankTimer() as any; for (const k of ['restEndAt', 'setStartAt']) if (T[k] != null) T[k] = tsOf(T[k]); for (const k of ['restTotal', 'setTarget']) T[k] = intIn(T[k], 0, 86400) ?? b[k]; /* runda 52: doba to i tak koniec */ for (const k of ['restSetId', 'setId']) if (T[k] != null && typeof T[k] !== 'string') T[k] = null; } // runda 49
  raw.relations = arr(raw.relations); raw.feedback = arr(raw.feedback); raw.instructions = arr(raw.instructions);
  // Ustawienia: pole po polu na domyślnych, żeby częściowy obiekt nie dał undefined (np. przerwa → „NaNs”).
  const d = defaultSettings(); const s = isObj(raw.settings) ? raw.settings : {};
  raw.settings = {
    defaultRest: (v => v != null && v >= 0 ? Math.min(1800, Math.round(v)) : d.defaultRest)(parseNum(s.defaultRest)), // runda 17: ten sam limit co wszędzie
    sound: typeof s.sound === 'boolean' ? s.sound : d.sound,
    wakeLock: typeof s.wakeLock === 'boolean' ? s.wakeLock : d.wakeLock,
    showRpe: typeof s.showRpe === 'boolean' ? s.showRpe : d.showRpe,
    healthSync: typeof s.healthSync === 'boolean' ? s.healthSync : d.healthSync,
    progressHint: typeof s.progressHint === 'boolean' ? s.progressHint : d.progressHint, autoBackup: typeof s.autoBackup === 'boolean' ? s.autoBackup : d.autoBackup, weighReminder: typeof s.weighReminder === 'boolean' ? s.weighReminder : d.weighReminder, /* runda 75 */
    modules: (() => { const mods = { ...defaultModules(), ...(isObj(s.modules) ? s.modules : {}) }; MODULES.forEach(m => { if (typeof mods[m] !== 'boolean') mods[m] = false; }); mods.training = true; return mods; })(),
    language: ['auto', 'pl', 'en'].includes(s.language) ? s.language : d.language,
    unit: s.unit === 'lb' ? 'lb' : 'kg',
  };
  raw.ownerId = owner;
  if (!Number.isFinite(raw.v)) raw.v = 2; if (raw.metaUpdatedAt != null && tsOf(raw.metaUpdatedAt) == null) delete raw.metaUpdatedAt; /* runda 53 */
  raw.schemaVersion = SCHEMA_VERSION;
  return raw as State;
}

/** Runda 71 (audyt T1b): zapisy idą po kolei. Wcześniej zapis timera (setTimerState) mógł wejść między nieudany pełny zapis
 * a jego ponowienie: „live” z wyższym numerem i active = null (już zakończony trening) lądował w bazie, choć historia nie —
 * po restarcie trening znikał z obu miejsc, a baner błędu gasł. */
let persistQueue: Promise<void> = Promise.resolve();
function persistNow(): Promise<void> { const p = persistQueue.then(persistRun); persistQueue = p.catch(() => {}); return p; }
async function persistRun() {
  if (!db || !S) return;
  if (saveTimer) { clearTimeout(saveTimer); saveTimer = null; }
  const now = Date.now(); const full = fullDirty; fullDirty = false; const seq = ++persistSeq;
  try {
    // Runda 72 (T4a): oba teksty z jednej, tej samej chwili — zmiana stanu w trakcie zapisu „state” (zakończenie treningu,
    // import) nie może trafić do „live” z tym samym numerem, bo po awarii nadpisałaby treningiem/null stan, którego nie ma w historii.
    if (full) { S.metaUpdatedAt = now; (S as any).saveSeq = seq; }
    const stateJson = full ? JSON.stringify(S) : null; const liveJson = JSON.stringify({ seq, at: now, active: S.active, timer: S.timer });
    if (stateJson != null) await db.runAsync('INSERT OR REPLACE INTO kv (k, v) VALUES (?, ?)', 'state', stateJson);
    await db.runAsync('INSERT OR REPLACE INTO kv (k, v) VALUES (?, ?)', 'live', liveJson);
    if (persistError && !fullDirty) { persistError = null; rev++; emit(); } /* T1b: baner gaśnie dopiero, gdy nic nie czeka na zapis */
  } catch (e) {
    if (full) fullDirty = true; /* nieudany pełny zapis — ponowimy */
    persistError = e instanceof Error ? e.message : String(e); rev++; emit();
    throw e;
  }
}
/** Wymusza natychmiastowy zapis (wyjście do tła, koniec treningu, import, reset). */
export async function flush(): Promise<void> { await persistNow().catch(() => {}); }
export const getPersistError = () => persistError;
export const getRecovery = () => recovery;
/** Runda 33: po imporcie backupu albo wyczyszczeniu danych komunikat o nieczytelnych danych znika (kopia w bazie zostaje). */
export function clearRecovery() { if (!recovery) return; recovery = null; rev++; emit(); db?.runAsync('DELETE FROM kv WHERE k = ?', 'recovery').catch(() => {}); }
/** Surowy tekst odłożonego, nieczytelnego zapisu — do wysłania sobie i ręcznego odzyskania. */
export async function readRecovery(): Promise<string | null> { if (!db || !recovery) return null; const r = await db.getFirstAsync<{ v: string }>('SELECT v FROM kv WHERE k = ?', recovery.key); const l = await db.getFirstAsync<{ v: string }>('SELECT v FROM kv WHERE k = ?', recovery.key + '_live').catch(() => null); if (!r) return null; if (!l) return r.v;
  /* T4b: koperta JSON zamiast dopisku po stanie — plik da się po poprawce wczytać importem (parseBackup); stan jako obiekt, gdy jest poprawnym JSON-em, inaczej jako tekst */
  const js = (x: string) => { try { return JSON.parse(x); } catch { return x; } };
  return JSON.stringify({ format: 'trening-recovery', note: 'state = nieczytelny zapis, live = trening w toku', state: js(r.v), live: js(l.v) }); }

function emit() { listeners.forEach(l => l()); }
function bump(hist: boolean) { rev++; if (hist) histRev++; }

/**
 * Zapis: natychmiast w pamięci + zdebouncowany zapis do SQLite (300 ms). Przekazane encje dostają updatedAt = teraz.
 * Zmiana samego treningu w toku (save(active)) nie unieważnia cache historii.
 */
export function save(...touched: (Base | null | undefined)[]) {
  const now = Date.now(); touched.forEach(x => { if (x) x.updatedAt = now; });
  const onlyActive = touched.length > 0 && touched.every(x => x && S && x === S.active);
  bump(!onlyActive); if (!onlyActive) fullDirty = true;
  emit();
  if (saveTimer) clearTimeout(saveTimer);
  saveTimer = setTimeout(() => { persistNow().catch(() => {}); }, 300);
}

export function getState(): State { if (!S) throw new Error('store not initialised'); return S; }
export function replaceState(next: State) { S = migrate(next); applyPrefs(); save(); }

const subscribe = (cb: () => void) => { listeners.add(cb); return () => { listeners.delete(cb); }; };
export function useStore<T>(selector: (s: State) => T): T {
  return useSyncExternalStore(subscribe, () => selector(getState()), () => selector(getState()));
}
/** Odświeżenie ekranu po każdej zmianie stanu. */
export const useTick = () => useSyncExternalStore(subscribe, () => rev, () => rev);
/** Tylko zmiana języka/jednostki — dla layoutów, które nie muszą się przerysowywać przy każdym wpisie. */
export const usePrefsTick = () => useStore(s => `${s.settings.language}|${s.settings.unit}`);
export const getHistRev = () => histRev;
/** Runda 30: powrót aplikacji na pierwszy plan — ekrany z datą „dziś” (ekran główny, poranny wpis, baner podpisu) liczą się od nowa. */
let fgRev = 0;
export function refreshViews() { rev++; fgRev++; emit(); }
export const useForegroundTick = () => useSyncExternalStore(subscribe, () => fgRev, () => fgRev);
/**
 * Runda 14: odświeżenie tylko po zmianach poza treningiem w toku (historia, szablony, ćwiczenia, ustawienia).
 * Zakładki bez treningu nie przerysowują się przy każdym wpisie serii (runda 13: 400 wierszy historii na znak).
 */
// Runda 31/46: także po zmianie dnia (daty, rok, ważność podpisu) — ale nie przy każdym powrocie z tła (lista 1000 sesji to ~0,5 s).
const histSnap = () => `${histRev}:${localISODate()}`;
export const useHistTick = () => useSyncExternalStore(subscribe, histSnap, histSnap);

/** Prosty cache zależny od histRev. */
export function memoHist<T>(fn: () => T): () => T { let r = -1; let v: T; return () => { if (r !== histRev) { v = fn(); r = histRev; } return v; }; }
export function memoHistBy<K, T>(fn: (k: K) => T): (k: K) => T { let r = -1; const m = new Map<K, T>(); return (k: K) => { if (r !== histRev) { m.clear(); r = histRev; } if (!m.has(k)) m.set(k, fn(k)); return m.get(k)!; }; }

/* ---------- helpers ---------- */
export const exById = (id: string) => getState().exercises.find(e => e.id === id);
export const bandById = (id: string) => getState().bands.find(b => b.id === id);
export const isBW = (e: Exercise) => e.equipment === 'masa ciała';
/** Liczba powtórzeń do obliczeń: nieujemna liczba całkowita. */
export const repsOf = (s: WSet) => Math.max(0, Math.floor(Number(s.reps) || 0));
/** Obciążenie zewnętrzne serii: kg (ciężar) albo ±kg przy masie ciała (dodatnie = dociążenie, ujemne = asysta gumą/maszyną — 0.5, wzór Alpha Progression). */
export const setLoad = (ex: Exercise, s: WSet) => isBW(ex) ? (Number(s.addKg) || 0) : Math.max(0, Number(s.weight) || 0); // runda 48: ujemny ciężar (np. asysta z szablonu po zmianie sprzętu) nie daje ujemnej objętości
/** Data RRRR-MM-DD jako lokalna północ (Date.parse traktuje ją jako UTC). */
export function localDateTs(iso: string): number { const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(iso ?? ''); return m ? new Date(+m[1], +m[2] - 1, +m[3]).getTime() : NaN; }
/** Obciążenie efektywne: dla ćwiczeń z masą ciała tylko ±kg (dociążenie; asysta = 0), dla reszty ciężar.
 * Runda 75 (Q-001, decyzja 02.10.2026): masa ciała nie wchodzi do żadnych obliczeń — rekord to „moja masa ciała” albo „masa ciała + 10 kg”. */
export function effectiveLoad(ex: Exercise, s: WSet): number { return isBW(ex) ? Math.max(0, Number(s.addKg) || 0) : setLoad(ex, s); }
/** Mnożnik objętości: per hantel / jednostronne ×2, łącznie ×1; ćwiczenia z masą ciała zawsze ×1. */
export const exMult = (ex: Exercise) => isBW(ex) ? 1 : loadMult(ex.loadMode ?? loadModeFor(ex.equipment, ex.name));
/** Seria robocza = odhaczona i nie rozgrzewkowa. */
export const isWorking = (s: WSet) => s.done && s.kind !== 'warmup' && !s.warmup;
/** Objętość jednej serii — JEDYNA definicja, używana w historii, Postępach, rekordach i PR (audyt 0.8.1). */
export function setVolume(ex: Exercise, s: WSet): number {
  const m = ex.metric ?? 'weight_reps'; if (!isWorking(s) || !hasWeight(m) || !hasReps(m)) return 0;
  return volOf(ex, effectiveLoad(ex, s), repsOf(s));
}
/** Rdzeń setVolume dla znanego obciążenia efektywnego i powtórzeń (runda 74: statystyki liczą je raz na serię). */
export const volOf = (ex: Exercise, load: number, reps: number) => exMult(ex) * dispKg(load) * reps;
/** Runda 73 (T13): w lb ciężar serii liczony tak, jak go widać (0,1 lb) — wpis 100 lb zapisany jako 45,35 kg dawał objętość 2999 lb zamiast 3000.
 * Zwraca kg odpowiadające dokładnie wyświetlanej liczbie funtów; w kg bez zmian. */
const dispKg = (kg: number) => wu() === 'lb' ? wOut(kg) * KG_PER_LB : kg;
/** Etykieta kolumny ciężaru zależna od trybu liczenia. */
/** Runda 69 (zrzuty): krótka etykieta kolumny tabeli — pełna zostaje dla VoiceOver. */
export const loadLabelShort = (ex: Exercise) => isBW(ex) ? `±${wu()}` : (ex.loadMode === 'per_dumbbell' ? t('{u}/hant.', { u: wu() }) : ex.loadMode === 'unilateral' ? t('{u}/str.', { u: wu() }) : wu());
export const loadLabel = (ex: Exercise) => isBW(ex) ? `±${wu()}` : (ex.loadMode === 'per_dumbbell' ? t('{u}/hantel', { u: wu() }) : ex.loadMode === 'unilateral' ? t('{u}/strona', { u: wu() }) : wu());
/** Domyślna przerwa dla ćwiczenia: zapamiętana w ćwiczeniu albo globalna. */
export const restFor = (ex: Exercise | undefined, warmup = false): number => { const s = getState().settings; const def = typeof s.defaultRest === 'number' && s.defaultRest >= 0 ? s.defaultRest : 90; if (!ex) return def; if (warmup && ex.restWarmupSec != null) return ex.restWarmupSec; return ex.restSec ?? def; };
export const fmtSec = (sec: number) => { sec = Math.max(0, Math.round(sec)); if (sec >= 3600) return fmtDur(sec); /* runda 12: godzina i więcej jak czas sesji */ const m = Math.floor(sec / 60), r = sec % 60; return m ? `${m}:${String(r).padStart(2, '0')}` : `${r}s`; };
export const fmtDist = (m: number) => m >= 1000 ? `${fmtNum(m / 1000, 2)} km` : `${Math.round(m)} m`;
/** Zakres powtórzeń do wyświetlenia: „max”, „8”, „8–10”, a przy braku lub odwróconym „do” — „8+”. */
export const reps = (min: number | null, max: number | null) => min == null ? 'max' : (max == null || max < min ? `${min}+` : min === max ? `${min}` : `${min}–${max}`);
/** Czas „m:ss”, od godziny „h:mm:ss” (wcześniej 95:00 zamiast 1:35:00). */
export const fmtDur = (sec: number) => { sec = Math.max(0, Math.round(sec)); const h = Math.floor(sec / 3600), m = Math.floor((sec % 3600) / 60), r = sec % 60; return h ? `${h}:${String(m).padStart(2, '0')}:${String(r).padStart(2, '0')}` : `${m}:${String(r).padStart(2, '0')}`; };
/** Data do list. Runda 14: rok, gdy nie bieżący — sesje sprzed roku nie wyglądają jak tegoroczne. */
export const fmtDate = (ts: number) => { const d = new Date(ts); return d.toLocaleDateString(locale(), { weekday: 'short', day: 'numeric', month: 'short', ...(d.getFullYear() !== new Date().getFullYear() ? { year: 'numeric' as const } : {}) }); };
export const fmtTime = (ts: number) => new Date(ts).toLocaleTimeString(locale(), { hour: '2-digit', minute: '2-digit' });
/** Dzisiejsza data w strefie telefonu (RRRR-MM-DD). toISOString() dawało datę UTC — w Polsce po północy „wczoraj”. */
export const localISODate = (d: Date = new Date()) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
/** Skrót gumy do wąskiej kolumny: pierwsza litera koloru (po tłumaczeniu) + poziom; odporne na pusty kolor. */
/** Nazwa koloru gumy w języku interfejsu (kolory z zestawu startowego tłumaczone jak nazwy ćwiczeń z biblioteki) — runda 51: ta sama na ekranie Gumy, w treningu, historii i CSV. */
export const bandColor = (b: { color: string }) => t(b.color || '?');
export const shortBand = (b?: { color: string; level: number } | null) => b ? ((Array.from(bandColor(b))[0] ?? '?').toUpperCase() || '?') + b.level : '—'; // runda 52: emoji całe
/** Pełna nazwa gumy dla VoiceOver (litera z poziomem nic nie mówi). */
export const bandA11y = (b?: { color: string; level: number } | null) => b ? t('{c}, poziom {n}', { c: bandColor(b), n: b.level }) : t('brak');

const finishedCache = memoHist(() => getState().workouts.filter(w => w.finishedAt).sort((a, b) => b.startedAt - a.startedAt));
/** Zakończone treningi od najnowszego (cache do następnej zmiany historii — nie modyfikować zwróconej tablicy). */
export function finishedWorkouts(): Workout[] { return finishedCache(); }
/** Wszystkie bloki danego ćwiczenia w treningu (to samo ćwiczenie może wystąpić dwa razy). */
export const blocksOf = (w: Workout, exId: string) => w.exercises.filter(x => x.exerciseId === exId);
/** Runda 74 (wydajność): zakończone treningi z danym ćwiczeniem (od najnowszego) — indeks budowany jednym przejściem na zmianę historii.
 * Wcześniej każde „poprzednio”, sesje i rekordy przechodziły po CAŁEJ historii osobno dla każdego ćwiczenia. */
const exIndex = memoHist(() => { const m = new Map<string, Workout[]>();
  for (const w of finishedWorkouts()) { let last = ''; for (const e of w.exercises) { if (e.exerciseId === last) continue; last = e.exerciseId; const a = m.get(last); if (!a) m.set(last, [w]); else if (a[a.length - 1] !== w) a.push(w); } }
  return m; });
export function workoutsWith(exId: string): Workout[] { return exIndex().get(exId) ?? []; }
const prevCache = memoHistBy((exId: string): { workout: Workout; sets: WSet[]; blocks: WSet[][]; ids: (string | undefined)[] } | null => {
  let dropOnly: { workout: Workout; sets: WSet[]; blocks: WSet[][]; ids: (string | undefined)[] } | null = null;
  for (const w of workoutsWith(exId)) {
    // Runda 9: puste bloki (np. sama rozgrzewka) zostają na swoich miejscach — numeracja bloków się nie przesuwa.
    const bl = blocksOf(w, exId); const blocks = bl.map(e => e.sets.filter(s => isWorking(s) && setHasValue(s)));
    // Runda 72 (T5): sesja z samymi drop setami nie zasłania ostatniego ciężaru roboczego — szukamy dalej (zapamiętując ją na wypadek braku innych).
    if (blocks.some(b => b.some(s => s.kind !== 'drop'))) return { workout: w, sets: blocks.flat(), blocks, ids: bl.map(e => e.tplItemId) };
    if (!dropOnly && blocks.some(b => b.length)) dropOnly = { workout: w, sets: blocks.flat(), blocks, ids: bl.map(e => e.tplItemId) };
  }
  return dropOnly;
});
/** Serie robocze z ostatniego treningu z tym ćwiczeniem (wszystkie bloki razem). */
export function previousFor(exId: string): { workout: Workout; sets: WSet[] } | null { return prevCache(exId); }
/**
 * Runda 8: „Poprzednio” dla k-tego wystąpienia ćwiczenia w treningu/szablonie (to samo ćwiczenie dwa razy, np. ciężko
 * i lżej). Gdy poprzednio było kilka bloków, bierzemy blok o tym samym numerze (albo ostatni); gdy jeden — ten jeden.
 */
/** Runda 72 (T5): ostatni blok z tej samej pozycji szablonu (id pozycji jest unikalne) — dla ćwiczenia, które w szablonie występuje kilka razy. */
const prevByItem = memoHistBy((key: string): { workout: Workout; sets: WSet[] } | null => {
  const [exId, itemId] = key.split('|');
  let dropOnly: { workout: Workout; sets: WSet[] } | null = null; /* T7: blok z samymi drop setami nie zasłania serii roboczych (jak prevCache) */
  for (const w of workoutsWith(exId)) { const b = w.exercises.find(e => e.exerciseId === exId && e.tplItemId === itemId); const sets = b ? b.sets.filter(s => isWorking(s) && setHasValue(s)) : []; if (sets.some(s => s.kind !== 'drop')) return { workout: w, sets }; if (sets.length && !dropOnly) dropOnly = { workout: w, sets }; }
  return dropOnly;
});
/** T6: starsze dane bez id pozycji szablonu — k-ty blok ćwiczenia z ostatniej sesji tego samego szablonu (gdy miała ich kilka). */
const prevByTplBlock = memoHistBy((key: string): { workout: Workout; sets: WSet[] } | null => {
  const [exId, tplId, ks] = key.split('|'); const k = Number(ks);
  for (const w of workoutsWith(exId)) { if (w.templateId !== tplId) continue; const bl = blocksOf(w, exId).map(e => e.sets.filter(s => isWorking(s) && setHasValue(s)));
    if (bl.filter(b => b.length).length > 1) { const b = bl[Math.min(k, bl.length - 1)]; if (b.some(s => s.kind !== 'drop')) return { workout: w, sets: b }; } }
  return null;
});
export function previousBlockFor(exId: string, k: number, n = 2, tplItemId?: string, tplId?: string | null): { workout: Workout; sets: WSet[] } | null {
  const p = prevCache(exId); if (!p) return null;
  // Runda 72 (T5): to samo ćwiczenie kilka razy w szablonie (ciężko + lżej) — gdy ostatnia sesja tego ćwiczenia była z innego treningu
  // (jeden blok), blok „lżejszy” dostawał ciężar z tamtej sesji. Najpierw ostatni blok tej samej pozycji szablonu.
  if (n > 1 && tplItemId && !(tplId && p.workout.templateId === tplId) && p.blocks.filter(b => b.length).length <= 1) { const own = prevByItem(exId + '|' + tplItemId) ?? (tplId ? prevByTplBlock(`${exId}|${tplId}|${k}`) : null); if (own) return own; if (k > 0) return null; }
  // Runda 11: blok z tej samej pozycji szablonu wygrywa z numerem bloku (pominięty wtedy blok nie przesuwa podpowiedzi).
  if (tplItemId && tplId && p.workout.templateId === tplId && p.ids.some(Boolean)) { const j = p.ids.indexOf(tplItemId); if (j >= 0) { const b = p.blocks[j]; return b.length ? { workout: p.workout, sets: b } : null; }
    // Runda 13: pozycji nie ma w tamtej sesji. Jeśli wszystkie tamte pozycje wciąż są w szablonie — tę pominięto → bez
    // podpowiedzi (runda 11). Jeśli którejś już nie ma (np. ćwiczenie usunięte i dodane na nowo) — dopasowanie jak niżej.
    const cur = new Set((getState().templates.find(x => x.id === tplId)?.items ?? []).map(x => x.id));
    if (p.ids.every(id => !id || cur.has(id))) return null; }
  // Runda 10: dopasowanie blok↔blok tylko, gdy po obu stronach jest kilka bloków z seriami; inaczej wszystkie serie razem.
  if (n <= 1 || p.blocks.filter(b => b.length).length <= 1) return p;
  const b = p.blocks[Math.min(k, p.blocks.length - 1)]; return b.length ? { workout: p.workout, sets: b } : null;
}
/**
 * Runda 9: podpowiedź „Poprzednio” dla serii si w ramach rodziny: zwykła/do upadku bierze n-tą nie-drop serię
 * z poprzedniej sesji, drop set — n-ty drop set. Rozgrzewka nie ma podpowiedzi. Jedno miejsce dla ekranu i odhaczania.
 */
const famOf = (k: WSet['kind'] | undefined) => k === 'drop' ? 'd' : 'n';
export function hintFor(prevSets: WSet[] | null | undefined, sets: WSet[], si: number, ex?: Exercise): WSet | null {
  const s = sets[si]; if (!prevSets || !s || s.kind === 'warmup') return null; const f = famOf(s.kind);
  const idx = sets.slice(0, si).filter(x => x.kind !== 'warmup' && famOf(x.kind) === f).length;
  const h = prevSets.filter(x => famOf(x.kind) === f)[idx] ?? null;
  return h && ex && assistLost(ex, h) ? null : h; /* T6: podpowiedź z gumą, której już nie ma — ekran pokazuje „—”, jak odhaczenie (nic nie przepisuje) */
}
/** Runda 75 (T-017, decyzja 02.10.2026): cicha podpowiedź progresji (podwójna progresja). Gdy w poprzedniej sesji tej pozycji wszystkie
 * serie robocze (zwykłe i do upadku, bez drop setów) miały co najmniej górę zakresu powtórzeń, proponujemy kolejny krok: ciężar +2,5 kg
 * (w lb +5 lb), hantle i ćwiczenia jednostronne +1 kg (+2,5 lb); masa ciała: z asystą 2,5 kg mniej asysty (najwyżej do 0), z dociążeniem
 * +2,5 kg, bez obciążenia — jedno powtórzenie więcej. Bez okienek i bez zmiany wpisanych wartości (A-002); wyłączana w Ustawieniach. */
export type Progression = { kind: 'load'; kg: number } | { kind: 'reps'; reps: number };
export function progressionFor(ex: Exercise | undefined, repMax: number | null | undefined, prevSets: WSet[] | null | undefined): Progression | null {
  if (!ex || repMax == null || !getState().settings.progressHint || (ex.metric ?? 'weight_reps') !== 'weight_reps') return null;
  const work = (prevSets ?? []).filter(x => isWorking(x) && x.kind !== 'drop' && !x.bandId); /* seria z gumą: obciążenie nieznane — bez podpowiedzi */
  if (!work.length || work.length !== (prevSets ?? []).filter(x => isWorking(x) && x.kind !== 'drop').length || work.some(x => repsOf(x) < repMax)) return null;
  const top = Math.max(...work.map(x => setLoad(ex, x))); const lb = wu() === 'lb';
  const small = ex.equipment === 'hantle' || ex.loadMode === 'per_dumbbell' || ex.loadMode === 'unilateral';
  const step = isBW(ex) ? (lb ? 5 : 2.5) : small ? (lb ? 2.5 : 1) : (lb ? 5 : 2.5); /* w jednostce wyświetlania */
  if (isBW(ex) && top === 0) return { kind: 'reps', reps: repMax + 1 };
  const disp = Math.round((wOut(top) + step) * 100) / 100;
  if (isBW(ex) && top < 0 && disp > -step / 2) return { kind: 'load', kg: 0 }; /* resztka asysty poniżej pół kroku (np. −0,1 lb) — „bez asysty” */
  return { kind: 'load', kg: Number(wIn(disp)) };
}
/** Które to wystąpienie tego samego ćwiczenia (0 = pierwsze) wśród pozycji przed indeksem i. */
export const occurrence = (items: { exerciseId: string }[], i: number) => items.slice(0, i).filter(x => x.exerciseId === items[i].exerciseId).length;
/** Ile razy ćwiczenie występuje w treningu/szablonie. */
export const occurrences = (items: { exerciseId: string }[], exId: string) => items.filter(x => x.exerciseId === exId).length;
export function setSummary(ex: Exercise, s: WSet): string {
  const b = s.bandId ? bandById(s.bandId) : null;
  const m = ex.metric ?? 'weight_reps';
  let core: string;
  if (m === 'time') core = fmtSec(Number(s.durationSec) || 0);
  else if (m === 'distance_time') core = `${fmtDist(Number(s.distanceM) || 0)} ${fmtSec(Number(s.durationSec) || 0)}`;
  else if (m === 'weight_time') core = `${fmtW(setLoad(ex, s), false)}${wu()}×${fmtSec(Number(s.durationSec) || 0)}`;
  else if (m === 'reps') core = `${s.reps || 0}`;
  else core = isBW(ex) ? `${s.reps || 0}${Number(s.addKg) ? '@' + (Number(s.addKg) > 0 ? '+' : '') + fmtW(Number(s.addKg), false) : ''}` : `${fmtW(Number(s.weight) || 0, false)}×${s.reps || 0}`;
  return core + (b ? ` (${shortBand(b)})` : '') + (s.rpe !== '' && s.rpe != null ? ` @${fmtNum(Number(s.rpe), 1)}` : '');
}
/** Wynik serii do porównań „najlepsza seria”: ciężar×1000+pow. / czas / dystans (przy równym dystansie krótszy czas lepszy). */
export function setScore(ex: Exercise, s: WSet): number {
  const m = ex.metric ?? 'weight_reps';
  if (m === 'time') return Number(s.durationSec) || 0;
  if (m === 'distance_time') { const d = Number(s.durationSec) || 0; return (Number(s.distanceM) || 0) * 1e6 - (d > 0 ? d : 999999); } // runda 60: ten sam dystans bez czasu — na końcu
  if (m === 'weight_time') return setLoad(ex, s) * 10000 + (Number(s.durationSec) || 0);
  if (m === 'reps') return repsOf(s);
  return setLoad(ex, s) * 1000 + repsOf(s);
}
/** Czy seria ma jakikolwiek wpisany wynik (do autouzupełniania i podsumowań). */
export const setHasValue = (s: WSet) => [s.weight, s.reps, s.durationSec, s.distanceM, s.addKg].some(v => v !== '' && v != null);
export function volume(w: Workout): number {
  let v = 0;
  w.exercises.forEach(e => { const ex = exById(e.exerciseId); if (!ex) return; e.sets.forEach(s => { v += setVolume(ex, s); }); });
  return v; // runda 6: bez zaokrąglania w kg — zaokrągla dopiero fmtVol w jednostce wyświetlania (w lb było ±1 lb)
}
const blankSet = (): WSet => ({ id: uid(), weight: '', reps: '', durationSec: '', distanceM: '', rpe: '', bandId: '', addKg: '', kind: 'normal', warmup: false, note: '', done: false, completedAt: null, actualRest: null });
/** Kopiuje wartości serii (bez statusu) — używane przy autouzupełnianiu z „poprzednio” i z poprzedniej serii. */
const copyVals = (from: Partial<WSet> | null | undefined): Partial<WSet> => from ? { weight: from.weight ?? '', reps: from.reps ?? '', durationSec: from.durationSec ?? '', distanceM: from.distanceM ?? '', bandId: from.bandId ?? '', addKg: from.addKg ?? '' } : {};

/* ---------- workout actions ---------- */
const newWorkout = (templateId: string | null, templateName: string): Workout => { const st = getState(); return { ...base(st.ownerId), loggedBy: st.ownerId, sessionMode: 'solo', healthUUID: null, templateId, templateName, startedAt: Date.now(), finishedAt: null, note: '', exercises: [] }; };
export function startFromTemplate(tpl: Template) {
  const st = getState(); const w = newWorkout(tpl.id, tpl.name);
  tpl.items.forEach((it, ii) => {
    const ex = exById(it.exerciseId); if (!ex || ex.archived) return; // runda 42: usunięte ćwiczenie (np. z importu) nie wraca do treningu
    // Runda 7: drop sety poprzedniej sesji nie są źródłem wartości dla zwykłych serii szablonu (jak przy odhaczaniu, runda 6).
    const prevAll = previousBlockFor(it.exerciseId, occurrence(tpl.items, ii), occurrences(tpl.items, it.exerciseId), it.id, tpl.id); const src = prevAll ? prevAll.sets.filter(x => x.kind !== 'drop') : [];
    const prev = src.length ? { sets: src } : null;
    const sets: WSet[] = [];
    const n = Math.max(1, Math.min(50, Math.floor(Number(it.sets) || 1)));
    for (let i = 0; i < n; i++) {
      const p0 = prev ? prev.sets[Math.min(i, prev.sets.length - 1)] : null; const p = assistLost(ex, p0) ? null : p0; /* runda 72: jak przy odhaczaniu */
      const m = ex.metric ?? 'weight_reps';
      const s = { ...blankSet(), ...(p ? copyVals(p) : { weight: (isBW(ex) || !hasWeight(m)) ? '' : (it.startWeight === '' ? '' : Math.max(0, Number(it.startWeight))), /* runda 48 */ addKg: isBW(ex) && hasWeight(m) ? it.startWeight : '', durationSec: hasTime(m) ? it.targetSec : '' }) } as WSet;
      // Cel czasu z szablonu wygrywa z czasem z poprzedniej sesji — inaczej stoper ucinał serię na starym wyniku (runda 2).
      // Czas z poprzedniej sesji zostaje tylko podpowiedzią („Poprzednio”) — jako wartość stawałby się celem stopera (runda 4).
      if (hasTime(m)) s.durationSec = Number(it.targetSec) > 0 ? Number(it.targetSec) : ''; // runda 30: cel 0 = bez celu (jak w repeatLast)
      sets.push(markPre(stripUnused(ex, s)));
    }
    // Przerwa: ustawiona w pozycji szablonu wygrywa; puste pole w szablonie (null) = przerwa z ćwiczenia albo domyślna.
    w.exercises.push({ id: uid(), exerciseId: ex.id, restSec: typeof it.restSec === 'number' && it.restSec >= 0 ? it.restSec : restFor(ex), /* null w szablonie = przerwa z ćwiczenia */ repMin: it.repMin, repMax: it.repMax, groupId: it.groupId ?? null, sets, tplItemId: it.id });
  });
  normalizeGroups(w.exercises);
  st.active = w; save(); flush();
}
export function startEmpty() { getState().active = newWorkout(null, ''); save(); flush(); }
export function repeatLast() {
  const last = finishedWorkouts()[0]; if (!last) return;
  // Powtarza to, co faktycznie zrobiono (także ćwiczenia dodane/usunięte w trakcie), a nie szablon, z którego wystartowano (runda 2).
  const w = newWorkout(last.templateId, last.templateName);
  // Runda 22: cel czasu z pozycji szablonu, z której powstał blok (stary wynik nie staje się celem — runda 4).
  const tplOf = last.templateId ? getState().templates.find(x => x.id === last.templateId) : null;
  const tgt = (e: WExercise): number | '' => { const it = tplOf && e.tplItemId ? tplOf.items.find(x => x.id === e.tplItemId && x.exerciseId === e.exerciseId) : null; return it && Number(it.targetSec) > 0 ? Number(it.targetSec) : ''; };
  w.exercises = last.exercises.filter(e => { const ex = exById(e.exerciseId); return ex && !ex.archived; }).map(e => ({ ...e, id: uid(), sets: e.sets.map(s => ({ ...blankSet(), ...(assistLost(exById(e.exerciseId), s) ? {} : copyVals(s)), durationSec: s.kind === 'warmup' ? '' : tgt(e), kind: s.kind === 'failure' ? 'normal' : s.kind ?? (s.warmup ? 'warmup' : 'normal') /* T11: upadek to wynik, nie plan (jak addSet i szablon) */, warmup: s.warmup })).map(s => markPre(stripUnused(exById(e.exerciseId), s))) }));
  normalizeGroups(w.exercises);
  getState().active = w; save(); flush();
}
export function addExerciseToActive(ex: Exercise) {
  const a = getState().active; if (!a) return;
  a.exercises.push({ id: uid(), exerciseId: ex.id, restSec: restFor(ex), repMin: null, repMax: null, groupId: null, sets: [blankSet()] }); save(a);
}
export function addSet(ei: number) { const a = getState().active!; const e = a.exercises[ei]; const l = e.sets[e.sets.length - 1]; const fromWarmup = l?.kind === 'warmup'; e.sets.push({ ...blankSet(), ...(fromWarmup ? {} : copyVals(l)), ...(l?.done ? { durationSec: '' as const } : {}), ...(l?.noBand && !fromWarmup ? { noBand: true } : {}), kind: l?.kind === 'drop' ? 'drop' : 'normal' /* runda 72: po serii „do upadku” kolejna jest zwykła — upadek to wynik, nie plan */ }); { const ns = e.sets[e.sets.length - 1]; if (l?.pre && !fromWarmup) { const p: NonNullable<WSet['pre']> = {}; for (const k of PRE_KEYS) if (l.pre[k] !== undefined && ns[k] === l.pre[k]) p[k] = l.pre[k]; if (Object.keys(p).length) ns.pre = p; } /* weryfikacja: dodana seria idzie za zmianą jak pozostałe */ if (ns.bandId && !usedKeys(exById(e.exerciseId)).bandId) { if (Number(ns.addKg) < 0) ns.addKg = ''; ns.bandId = ''; } } /* runda 65: wyłączona asysta gumą — guma (i jej asysta) nie przechodzi */ save(a); } // czas zmierzonej serii nie staje się celem następnej (runda 3) // po rozgrzewce pusta seria: podpowie „Poprzednio”
export function removeSet(ei: number) { const a = getState().active!; const e = a.exercises[ei]; if (e.sets.length > 1) { e.sets.pop(); save(a); } }
export function removeExercise(ei: number) { const a = getState().active!; const gone = a.exercises.splice(ei, 1)[0]; normalizeGroups(a.exercises); const before = getState().exercises.length; purgeOrphans(); if (getState().exercises.length !== before) save(); else save(a); void gone; } // runda 42: usunięte ćwiczenie bez historii znika od razu
/** Pozycja serii w treningu w toku po id (stoper i przerwa trzymają id, nie indeksy). */
export function findSet(setId: string | null): { ei: number; si: number } | null {
  const a = S?.active; if (!a || !setId) return null;
  for (let ei = 0; ei < a.exercises.length; ei++) { const si = a.exercises[ei].sets.findIndex(s => s.id === setId); if (si >= 0) return { ei, si }; }
  return null;
}

/** Ostatnie odhaczenie w treningu w toku — liczone z danych, więc przeżywa restart i cofnięcie odhaczenia. */
function lastCompletedAt(a: Workout, except?: WSet): number | null {
  let m: number | null = null; a.exercises.forEach(e => e.sets.forEach(s => { if (s !== except && s.done && s.completedAt && (m == null || s.completedAt > m)) m = s.completedAt; })); return m;
}
/**
 * Odhaczenie pustej serii (audyt r1, jak w Strong): puste pola bierze z tego, co widać jako podpowiedź —
 * wynik z „Poprzednio” (ta sama seria robocza), a gdy podpowiedzi nie ma — powtórzenia z dolnej granicy zakresu szablonu (runda 4).
 * Dzięki temu „24×0” nie trafia do historii tylko dlatego, że użytkownik odhaczył bez wpisywania.
 */
const VAL_KEYS = ['weight', 'reps', 'durationSec', 'distanceM', 'addKg'] as const;
/* Decyzja 02.10.2026 (audyt B2, „przenieś na nieruszone”): wartości wstawione przez aplikację na starcie zapamiętane w s.pre.
 * Gdy odhaczona seria ma wartość inną niż jej wstępna, dalsze nieodhaczone serie tej samej rodziny, nietknięte ręcznie
 * i wciąż z tą samą wartością wstępną, dostają nową wartość (24 → 25 kg na wszystkich). Piramidy (różne wartości) zostają. */
const PRE_KEYS = ['weight', 'reps', 'distanceM', 'addKg'] as const;
function markPre(s: WSet): WSet { const p: NonNullable<WSet['pre']> = {}; for (const k of PRE_KEYS) if (typeof s[k] === 'number') p[k] = s[k] as number; if (Object.keys(p).length) s.pre = p; else delete s.pre; return s; }
const setFam = (k: WSet['kind']) => k === 'warmup' ? 'w' : k === 'drop' ? 'd' : 'n';
function carryPrefill(e: WExercise, si: number) {
  const s = e.sets[si]; if (!s?.pre) return;
  for (const k of PRE_KEYS) { const old = s.pre[k]; const v = s[k]; if (old === undefined || typeof v !== 'number' || v === old) continue;
    for (let j = si + 1; j < e.sets.length; j++) { const x = e.sets[j];
      if (x.done || x.edited || setFam(x.kind) !== setFam(s.kind) || x.pre?.[k] !== old || x[k] !== old || (k === 'addKg' && x.bandId !== s.bandId)) continue;
      x[k] = v; x.pre![k] = v; }
    s.pre[k] = v; /* weryfikacja: poprawka literówki (625 → 62,5) po ponownym ✓ też przechodzi dalej */ }
}
/** Runda 10: pola wartości używane przez bieżącą metrykę ćwiczenia (metrykę można zmienić po treningach). */
function usedKeys(ex: Exercise | undefined): Record<typeof VAL_KEYS[number] | 'bandId', boolean> {
  const m = ex?.metric ?? 'weight_reps'; const bw = !!ex && isBW(ex);
  return { weight: hasWeight(m) && !bw, addKg: hasWeight(m) && bw, reps: hasReps(m), durationSec: hasTime(m), distanceM: hasDistance(m), bandId: !!ex?.bandAssistable /* runda 11: guma tylko przy asyście gumą */ };
}
/** Runda 52: guma wstawiona bez asysty (z podpowiedzi, szablonu, poprzedniej serii) dostaje swoją znaną asystę — guma i asysta to para. */
function pairAssist(_s: WSet) { /* P-001 (02.10.2026): gumy bez kilogramów — guma nie wstawia już asysty kg (dawne nominalKg zostaje w danych tylko dla zgodności kopii; do usunięcia: T-055) */ }
/** Czyści w serii pola, których metryka nie używa (wartości skopiowane ze starszej sesji). */
function stripUnused(ex: Exercise | undefined, s: WSet): WSet { const u = usedKeys(ex); for (const k of VAL_KEYS) if (!u[k]) (s as any)[k] = ''; /* P-001: zdjęta guma nie zabiera już ±kg (dawniej runda 49) */ if (!u.bandId || (s.bandId && !bandById(s.bandId))) s.bandId = ''; /* runda 16: usunięta guma nie wraca */ if (u.addKg) pairAssist(s); /* runda 53: tylko gdy ćwiczenie używa ±kg */ return s; }
const isEmpty = (v: unknown) => v === '' || v == null;
/** Runda 72 (T5): seria z asystą gumy, której nie da się odtworzyć (guma usunięta albo asysta gumą wyłączona) — jej powtórzenia bez asysty
 * zapisałyby trudniejsze ćwiczenie (fałszywy rekord), więc z takiej serii nie przepisujemy żadnych wartości. */
export const assistLost = (ex: Exercise | undefined, p: Partial<WSet> | null | undefined) => !!ex && isBW(ex) && !!p?.bandId && (!ex.bandAssistable || !bandById(p.bandId)); /* T6: także guma bez wpisanej asysty (kg); T7: tylko ćwiczenia z masą ciała — tam guma zmienia obciążenie */
/** „Poprzednio” dla bloku treningu w toku (ten sam dobór co na ekranie). */
function prevOfBlock(e: WExercise) {
  const a = getState().active; const ei = a ? a.exercises.indexOf(e) : -1;
  return ei >= 0 ? previousBlockFor(e.exerciseId, occurrence(a!.exercises, ei), occurrences(a!.exercises, e.exerciseId), e.tplItemId, a!.templateId) : previousFor(e.exerciseId);
}
function fillFromHints(e: WExercise, si: number) {
  const s = e.sets[si]; if (s.kind === 'warmup') return;
  // Ta sama seria robocza co w podpowiedzi „Poprzednio” (bez „dociągania” do ostatniej — ekran pokazuje wtedy „—”).
  const p = hintFor(prevOfBlock(e)?.sets, e.sets, si, exById(e.exerciseId));
  // Guma z podpowiedzi tylko razem z jej asystą — gdy ±kg wpisano ręcznie (np. dociążenie), gumy nie dokładamy (runda 3).
  const hinted: Record<string, unknown> = {};
  // Runda 10: tylko pola, których używa bieżąca metryka ćwiczenia (metrykę mogła zmienić edycja ćwiczenia).
  const ex = exById(e.exerciseId); const m = ex?.metric ?? 'weight_reps'; const uses = usedKeys(ex);
  if (p && !assistLost(ex, p)) { const kgEmpty = isEmpty(s.addKg); for (const k of VAL_KEYS) if (uses[k] && isEmpty(s[k]) && !isEmpty(p[k]) && !(k === 'addKg' && ((uses.bandId && s.bandId && s.bandId !== p.bandId) /* runda 66: ukryta guma nie blokuje +kg */ || (s.noBand && p.bandId) || (p.bandId && (!uses.bandId || !bandById(p.bandId)))))) { /* runda 47: guma zdjęta ręcznie — bez jej asysty */ /* runda 46: asysta innej gumy nie trafia do tej serii */ (s as any)[k] = p[k]; hinted[k] = p[k]; } if (uses.bandId && !s.bandId && !s.noBand && p.bandId && bandById(p.bandId) && kgEmpty) { s.bandId = p.bandId; hinted.bandId = p.bandId; } if (hinted.bandId && uses.addKg && isEmpty(s.addKg)) { pairAssist(s); if (!isEmpty(s.addKg)) hinted.addKg = s.addKg; } }
  // Brak podpowiedzi i brak wpisu: dolna granica zakresu z szablonu (runda 4: pierwszy trening zapisywał „24×0”).
  if (hasReps(m) && isEmpty(s.reps) && e.repMin != null) { s.reps = e.repMin; hinted.reps = e.repMin; }
  s.hinted = Object.keys(hinted).length ? hinted : undefined;
}
/** Przerwa po serii (ei, si) treningu w toku; null = superset bez przerwy. Wspólne dla odhaczenia i ponownego pomiaru (runda 19). */
export function restAfter(ei: number, si: number): number | null {
  const a = getState().active; const e = a?.exercises[ei]; const s = e?.sets[si]; if (!a || !e || !s) return null; const ex = exById(e.exerciseId);
  // Superset (0.4; od rundy 72): bez przerwy, dopóki runda nie jest zamknięta — liczy się liczba serii, nie kolejność na liście.
  // Runda 72 (T5): runda liczona serią, nie kolejnością na liście — odhaczenie B1 przed A1 nie odpala przerwy w środku rundy.
  // Runda 72 (T6): drop set to część serii, po której następuje — bez przerwy przed nim, a w supersecie nie liczy się jako osobna runda.
  if (s.kind !== 'warmup') { const nx = e.sets[si + 1]; if (nx && nx.kind === 'drop' && !nx.done) return null; }
  if (e.groupId) { const work = (x: WExercise) => x.sets.filter(y => y.kind !== 'warmup' && y.kind !== 'drop'); const r = work(e).filter(y => y.done).length;
    const others = a.exercises.filter((x, j) => j !== ei && x.groupId === e.groupId);
    /* Runda 75 (Q-006): ostatnia seria ostatniego ćwiczenia grupy zamyka rundę, także gdy wcześniejsze ćwiczenie ma pominiętą serię.
     * Warunek: każde zaległe ćwiczenie ma już choć jedną zrobioną serię — inaczej B1 przed A1 (także przy jednej serii) odpalałoby przerwę. */
    const closesGroup = !a.exercises.some((x, j) => j > ei && x.groupId === e.groupId) && !work(e).some(y => !y.done) && others.every(x => work(x).some(y => y.done) || !work(x).some(y => !y.done));
    if (s.kind === 'warmup' ? a.exercises.some((x, j) => j > ei && x.groupId === e.groupId && x.sets.some(y => !y.done)) || others.some(x => work(x).filter(y => y.done).length > r) /* Q-006: rozgrzewka w trwającej rundzie — bez przerwy */
      : !closesGroup && others.some(x => work(x).filter(y => y.done).length < r && work(x).some(y => !y.done))) return null; } /* T9: pominięty drop set nie blokuje przerwy po ostatniej rundzie */
  if (s.kind === 'warmup' && ex?.restWarmupSec != null) return ex.restWarmupSec;
  if (e.groupId && s.kind !== 'warmup') return roundRest(ei); /* runda 72: koniec rundy poza kolejnością — przerwa rundy (ostatniego ćwiczenia grupy) */
  return e.restSec ?? restFor(ex);
}
/** Przerwa rundy supersetu (ostatniego ćwiczenia grupy) albo własna przerwa ćwiczenia — dla ponownego pomiaru (runda 21). */
export function roundRest(ei: number): number | null {
  const a = getState().active; const e = a?.exercises[ei]; if (!a || !e) return null;
  const last = e.groupId ? [...a.exercises].reverse().find(x => x.groupId === e.groupId) ?? e : e;
  return last.restSec ?? restFor(exById(last.exerciseId));
}
/** Odhacza serię; zwraca długość przerwy do odpalenia (lub null: odznaczono albo superset bez przerwy). */
/** `at` — godzina odhaczenia, gdy znana z danych (stoper z celem kończy się o starcie + cel, nawet gdy aplikacja wstała później — T8). */
export function toggleDone(ei: number, si: number, at?: number): number | null {
  const a = getState().active; if (!a) return null; const e = a.exercises[ei]; const s = e?.sets[si];
  if (!e || !s) return null;
  s.done = !s.done;
  if (s.done) {
    // Pola wpisane ręcznie PRZED uzupełnieniem z podpowiedzi — tylko one przechodzą na następną serię (runda 2: piramidy).
    const typed = new Set(VAL_KEYS.filter(k => !isEmpty(s[k])));
    carryPrefill(e, si);
    fillFromHints(e, si);
    const now = at != null && Number.isFinite(at) ? Math.min(at, Date.now()) : Date.now(); const prev = lastCompletedAt(a, s);
    s.completedAt = now; s.actualRest = prev && now > prev && now - prev < 3600e3 ? Math.round((now - prev) / 1000) : null; // runda 30: cofnięty zegar → brak przerwy, nie ujemna
    // Autouzupełnianie: tylko puste pola następnej, nieodhaczonej serii tego samego rodzaju (rozgrzewka nie nadpisuje roboczej).
    const nxt = e.sets[si + 1];
    // Runda 6: rodziny serii — rozgrzewka, drop set, reszta (zwykła/do upadku). Ciężar dropu nie trafia do serii roboczej i odwrotnie.
    const sameKind = nxt && setFam(nxt.kind) === setFam(s.kind);
    // Czas NIE przechodzi na następną serię: w serii czasowej to cel stopera (przejęcie ucinało kolejną serię — runda 2).
    if (nxt && !nxt.done && sameKind) {
      for (const k of VAL_KEYS) if (k !== 'durationSec' && !(k === 'addKg' && s.bandId && (usedKeys(exById(e.exerciseId)).bandId || Number(s.addKg) < 0)) /* runda 66: ukryta guma blokuje tylko swoją asystę */ && typed.has(k) && isEmpty(nxt[k])) (nxt as any)[k] = s[k];
      /* Runda 47: guma i jej asysta to para. Przechodzi na następną serię razem (asysta wpisana albo z podpowiedzi), gdy:
         „Poprzednio” nic nie mówi o tej serii, guma nie została w niej zdjęta ręcznie, a seria nie ma własnego, innego obciążenia. */
      const nKg = isEmpty(nxt.addKg) || Number(nxt.addKg) === 0;
      if (s.bandId && usedKeys(exById(e.exerciseId)).bandId /* runda 65 */ && !nxt.noBand && !hintFor(prevOfBlock(e)?.sets, e.sets, si + 1, exById(e.exerciseId)) /* T7: ta sama podpowiedź co na ekranie */ && ((!nxt.bandId && nKg) || nxt.bandId === s.bandId)) {
        nxt.bandId = s.bandId; if (nKg && !isEmpty(s.addKg)) nxt.addKg = s.addKg; if (usedKeys(exById(e.exerciseId)).addKg) pairAssist(nxt);
      }
    }
    save(a);
    return restAfter(ei, si);
  }
  // Cofnięcie odhaczenia zdejmuje wartości wstawione z podpowiedzi — ponowne odhaczenie nie traktuje ich jak wpisanych
  // ręcznie (runda 4). Runda 5: czyszczone tylko pola, których wartość wciąż równa się wstawionej; pole zmienione ręcznie
  // (albo guma przełączona) zostaje, a edycja innego pola nie blokuje czyszczenia pozostałych.
  if (s.hinted && typeof s.hinted === 'object') { const hb = (s.hinted as any).bandId; const band0 = s.bandId; /* runda 52: stan gumy sprzed czyszczenia */ for (const [k, v] of Object.entries(s.hinted)) if ((s as any)[k] === v && !(k === 'addKg' && hb && band0 !== hb)) (s as any)[k] = ''; /* P-001: zdjęcie gumy z podpowiedzi nie rusza ±kg (dawniej runda 53) */ } // runda 48: po zmianie gumy asysta należy już do nowej gumy
  s.hinted = undefined; s.completedAt = null; s.actualRest = null; save(a); return null;
}
/** Runda 69: porzucony trening. Pytanie po 2 h bez odhaczonej serii, ciche zakończenie po 6 h. */
export const STALE_ASK_MS = 2 * 3600e3, STALE_AUTO_MS = 6 * 3600e3;
/** Ostatnia aktywność treningu: godzina ostatniej odhaczonej serii (albo start). */
export function lastActivity(w: Workout): number { let t = w.startedAt; for (const e of w.exercises) for (const s of e.sets) if (s.done && typeof s.completedAt === 'number' && s.completedAt > t) t = s.completedAt; return t; }
/** Aktywność łącznie z trwającym stoperem serii (runda 69, T1): mierzona seria to nie porzucony trening. */
export const staleRef = (w: Workout, now = Date.now()) => { const tm = S?.timer; const sw = tm?.setStartAt && tm.setId && w.exercises.some(e => e.sets.some(s => s.id === tm.setId)) ? tm.setStartAt : 0;
  /* T4a: znaczniki z przyszłości (import, „Kontynuuj” przy zegarze do przodu, potem poprawionym) pomijamy — inaczej blokowałyby pytanie i zapis na zawsze */
  /* T6: także start — gdy zegar był do przodu przez cały trening, żaden znacznik nie jest wiarygodny: -∞ = zapytaj od razu, ale nie zapisuj sam */
  const ok = (x: unknown) => typeof x === 'number' && Number.isFinite(x) && x <= now + 10 * 60e3 ? x : -Infinity;
  let r = ok(w.startedAt); for (const e of w.exercises) for (const s of e.sets) if (s.done) r = Math.max(r, ok(s.completedAt));
  return Math.max(r, ok(w.staleAck), sw ? ok(sw) : -Infinity); };
/** Runda 72 (T4a): wariant pytania/przypomnienia — jedno źródło dla obu. */
export const staleKind = (w: Workout): 'work' | 'warmup' | 'none' => hasWorkDone(w) ? 'work' : w.exercises.some(e => e.sets.some(s => s.done)) ? 'warmup' : 'none';
export const hasWorkDone = (w: Workout) => w.exercises.some(e => e.sets.some(s => s.done && s.kind !== 'warmup'));
/** Gdy trening w toku jest „porzucony” (≥ 2 h od ostatniej serii i od ostatniego „Kontynuuj”) — godzina ostatniej serii; inaczej null. */
export function staleSince(now = Date.now()): number | null { const a = S?.active; if (!a) return null; const last = lastActivity(a); return now - staleRef(a, now) >= STALE_ASK_MS ? last : null; }
export function ackStale() { const a = S?.active; if (!a) return; a.staleAck = Date.now(); save(a); }
/** Q-010: ponowny pomiar odhaczonej serii to aktywność — przesuwa znacznik jak „Kontynuuj” (pytanie o porzucony trening liczy od niego). */
export function markActivity(a: Workout, at: number) { if (Number.isFinite(at) && at > (Number(a.staleAck) || 0)) a.staleAck = Math.min(at, Date.now()); }
/** Runda 75 (Q-002, decyzja 02.10.2026): po zamknięciu aplikacji stoper serii BEZ celu nie wraca. Seria odhacza się z czasem
 * z pola serii (wpisanym albo wstawionym z „Poprzednio”), a gdy pole jest puste — zostaje nieodhaczona do ręcznego wpisu.
 * Ponowny pomiar odhaczonej serii zostawia jej poprzedni czas. Stoper z celem kończy się jak dotąd (start + cel). Wołane raz przy starcie aplikacji. */
export function resolveColdStopwatch(now = Date.now()) {
  const tm = S?.timer; if (!tm?.setStartAt || !tm.setId || Number(tm.setTarget) > 0) return;
  const a = S?.active; const pos = a ? findSet(tm.setId) : null; const st = pos && a ? a.exercises[pos.ei].sets[pos.si] : null;
  if (pos && st && !st.done && Number(st.durationSec) > 0) toggleDone(pos.ei, pos.si, Math.min(now, tm.setStartAt + Number(st.durationSec) * 1000));
  setTimerState({ setStartAt: null, setTarget: 0, setId: null });
}
/** Ciche zakończenie po 6 h bez aktywności (przy starcie i powrocie z tła). Bez odhaczonych serii roboczych trening czeka na decyzję. */
export function autoFinishStale(now = Date.now()): Workout | null {
  const a = S?.active; if (!a) return null;
  const ref = staleRef(a, now); if (!Number.isFinite(ref) || now - ref < STALE_AUTO_MS) return null; /* T6: bez wiarygodnej godziny nie kończymy po cichu */
  // T9: seria czasowa z celem, trwająca przy zamknięciu aplikacji, skończyła się o starcie + cel — jak na ekranie przy 2–6 h; nie przepada.
  const tm = S?.timer; let changed = false;
  if (tm?.setStartAt && tm.setId && !(Number(tm.setTarget) > 0)) setTimerState({ setStartAt: null, setTarget: 0, setId: null }); /* Q-011: stoper bez celu sprzed ≥ 6 h i tak nie wraca (timer.restore) — nie zostaje w zapisie */
  if (tm?.setStartAt && Number(tm.setTarget) > 0 && tm.setId) { const pos = findSet(tm.setId); const st = pos ? a.exercises[pos.ei].sets[pos.si] : null;
    const dur = Math.max(1, Math.min(Number(tm.setTarget), Math.floor((now - tm.setStartAt) / 1000))); /* T11: nie dłużej niż faktycznie minęło */
    if (st && !st.done && pos) { st.durationSec = dur; toggleDone(pos.ei, pos.si, Math.min(now, tm.setStartAt + Number(tm.setTarget) * 1000)); /* T10: ta sama ścieżka co na ekranie — podpowiedzi i rzeczywista przerwa */ changed = true; }
    else if (st && st.done) { st.durationSec = dur; markActivity(a, Math.min(now, tm.setStartAt + dur * 1000)); changed = true; } /* T11: ponowny pomiar — jak finishTimedSet na ekranie */
    setTimerState({ setStartAt: null, setTarget: 0, setId: null }); }
  if (!hasWorkDone(a)) { if (changed) save(a); return null; }
  return finishWorkout(lastActivity(a));
}
/** Zakończenie treningu; `at` — godzina końca (po czasie: ostatnia seria, nie chwila kliknięcia). */
export function finishWorkout(at?: number): Workout | null {
  const st = getState(); const w = st.active; if (!w) return null;
  w.finishedAt = Math.max(w.startedAt, at != null && Number.isFinite(at) ? Math.min(at, Date.now()) : Date.now()); /* T4a: cofnięty zegar nie daje końca przed startem */ delete w.staleAck;
  w.exercises = w.exercises.map(e => ({ ...e, sets: e.sets.filter(s => s.done).map(s => { delete s.pre; return s; }) })).filter(e => e.sets.length);
  normalizeGroups(w.exercises);
  st.workouts.push(w); st.active = null; st.userTouched = true; purgeOrphans(); save(w); flush();
  return w;
}
export function cancelWorkout() { getState().active = null; purgeOrphans(); save(); flush(); }
export function deleteWorkout(id: string) { const st = getState(); st.workouts = st.workouts.filter(w => w.id !== id); purgeOrphans(); save(); flush(); }

/* ---------- edycja historii i trening wstecz (docs/12) ---------- */
/** Pusta seria (do edytora historii). */
export const emptySet = blankSet;
export { copyVals, stripUnused };
/** Seria historii ma wynik w metryce ćwiczenia: powtórzenia (kg × powt., powt.), czas (czas, kg × czas) albo dystans/czas (bieg).
 * Seria bez wyniku (np. plank bez czasu, 100 kg × 0) przy zapisie edycji odpada — jak nieodhaczona seria przy „Zakończ”. */
export function setHasResult(ex: Exercise | undefined, s: WSet): boolean {
  if (!ex) return setHasValue(s); const m = ex.metric ?? 'weight_reps';
  if (hasReps(m)) return Number(s.reps) > 0;
  if (hasDistance(m)) return Number(s.distanceM) > 0 || Number(s.durationSec) > 0;
  if (hasTime(m)) return Number(s.durationSec) > 0;
  return setHasValue(s);
}
/** Serie robocze (bez drop setów) z ostatniej sesji ćwiczenia rozpoczętej PRZED `before` — źródło wartości dla treningu wstecz.
 * Dobór bloku jak w „Poprzednio”: najpierw ta sama pozycja szablonu, przy kilku blokach k-ty blok, inaczej wszystkie serie razem.
 * Sesje późniejsze niż data treningu wstecz nie są brane pod uwagę (nie było ich jeszcze tego dnia). */
export function previousSetsBefore(exId: string, before: number, k = 0, n = 1, tplItemId?: string): WSet[] | null {
  for (const w of workoutsWith(exId)) {
    if (w.startedAt >= before) continue;
    const bl = blocksOf(w, exId); const blocks = bl.map(e => e.sets.filter(s => isWorking(s) && setHasValue(s) && s.kind !== 'drop'));
    if (!blocks.some(b => b.length)) continue;
    if (tplItemId) { const j = bl.findIndex(e => e.tplItemId === tplItemId); if (j >= 0 && blocks[j].length) return blocks[j]; }
    const full = blocks.filter(b => b.length);
    return n > 1 && full.length > 1 ? full[Math.min(k, full.length - 1)] : full.flat();
  }
  return null;
}
/**
 * Zapis treningu z edytora historii: podmienia trening o id `replaceId` (edycja) albo dodaje nowy (trening wstecz) — w miejscu
 * zgodnym z datą startu. Jedna zmiana stanu: save() podbija histRev, więc rekordy, „Poprzednio”, wykresy, objętość tygodnia i CSV
 * liczą się od nowa. Trening w toku i timery nie są ruszane. false = edytowanego treningu już nie ma (usunięty w międzyczasie).
 */
export function putHistoryWorkout(w: Workout, replaceId: string | null): boolean {
  const st = getState();
  if (replaceId != null) { const i = st.workouts.findIndex(x => x.id === replaceId); if (i < 0) return false; st.workouts.splice(i, 1); }
  w.exercises.forEach(e => e.sets.forEach(s => { s.done = true; s.warmup = s.kind === 'warmup'; delete s.pre; delete s.hinted; delete s.edited; if (s.noBand !== true || s.bandId) delete s.noBand; /* jak migrate — kopia wraca 1:1 */ }));
  w.exercises = w.exercises.filter(e => e.sets.length); normalizeGroups(w.exercises); delete w.staleAck;
  const j = st.workouts.findIndex(x => x.startedAt > w.startedAt); st.workouts.splice(j < 0 ? st.workouts.length : j, 0, w);
  st.userTouched = true; purgeOrphans(); save(w); flush();
  return true;
}

/* ---------- supersety (0.4) ---------- */
export type Grouped = { groupId: string | null };
/**
 * Porządkuje grupy po każdej zmianie listy: grupa musi być ciągła i mieć ≥2 elementy.
 * Rozerwana grupa dzieli się na ciągłe odcinki (każdy z nowym id), pojedyncze elementy wychodzą z grupy.
 */
export function normalizeGroups(list: Grouped[]) {
  let i = 0;
  while (i < list.length) {
    const g = list[i].groupId; if (!g) { i++; continue; }
    let j = i; while (j + 1 < list.length && list[j + 1].groupId === g) j++;
    const seenBefore = list.slice(0, i).some(x => x.groupId === g);
    if (j === i) list[i].groupId = null; else if (seenBefore) { const n = uid(); for (let k = i; k <= j; k++) list[k].groupId = n; }
    i = j + 1;
  }
}
/** Etykieta grupy (A, B, C…) w kolejności pierwszego wystąpienia. */
export function groupLabels(list: Grouped[]): Record<string, string> { const out: Record<string, string> = {}; let n = 0; list.forEach(x => { if (x.groupId && !out[x.groupId]) out[x.groupId] = String.fromCharCode(65 + (n++ % 26)); }); return out; }
/** Łączy ćwiczenie i z następnym w superset; gdy oba są w różnych grupach — scala je w jedną. */
export function linkWithNext(list: Grouped[], i: number, touched?: Base | null) {
  const a = list[i], b = list[i + 1]; if (!a || !b) return;
  const g = a.groupId ?? b.groupId ?? uid(); const old = b.groupId && b.groupId !== g ? b.groupId : null;
  a.groupId = g; b.groupId = g; if (old) list.forEach(x => { if (x.groupId === old) x.groupId = g; });
  normalizeGroups(list); save(touched);
}
/** Wyjmuje ćwiczenie z supersetu; grupa rozerwana w środku dzieli się, pojedyncze elementy wychodzą. */
export function unlink(list: Grouped[], i: number, touched?: Base | null) { if (!list[i]?.groupId) return; list[i].groupId = null; normalizeGroups(list); save(touched); }
/** Przesuwa element listy (szablon) i porządkuje grupy. */
export function moveItem<T extends Grouped>(list: T[], i: number, d: number, touched?: Base | null) { const j = i + d; if (j < 0 || j >= list.length) return; [list[i], list[j]] = [list[j], list[i]]; normalizeGroups(list); save(touched); }
export function removeItem<T extends Grouped>(list: T[], i: number, touched?: Base | null) { list.splice(i, 1); normalizeGroups(list); save(touched); }

/* T-010 (02.10.2026): kolejność przeciąganiem. Przeciąga się bloki — pojedyncze ćwiczenie albo cały superset — a wewnątrz
 * supersetu jego ćwiczenia. Przesuwanie nigdy nie zmienia członkostwa w supersetach (od tego są „⇅ SS” i „✂”), więc
 * upuszczenie ćwiczenia „w środek” cudzej grupy jej nie rozrywa. Pozycje wskazywane po id — lista mogła się zmienić od rysowania. */
/** Bloki listy: [pierwszy, ostatni] indeks (włącznie) — ciągła grupa albo pojedyncza pozycja. */
export function blockRanges(list: Grouped[]): [number, number][] {
  const out: [number, number][] = [];
  for (let i = 0; i < list.length;) { const g = list[i].groupId; let j = i; if (g) while (j + 1 < list.length && list[j + 1].groupId === g) j++; out.push([i, j]); i = j + 1; }
  return out;
}
/** Przesuwa blok zawierający pozycję `id` na miejsce `to` w kolejności bloków. Zwraca, czy coś się zmieniło. */
export function moveBlockOf<T extends Grouped & { id: string }>(list: T[], id: string, to: number, touched?: Base | null): boolean {
  const i = list.findIndex(x => x.id === id); if (i < 0) return false;
  const b = blockRanges(list); const from = b.findIndex(([s, e]) => i >= s && i <= e);
  const dest = Math.max(0, Math.min(b.length - 1, Math.round(to))); if (!Number.isFinite(to) || dest === from) return false;
  const [s, e] = b[from]; const chunk = list.splice(s, e - s + 1); const rest = blockRanges(list);
  list.splice(dest >= rest.length ? list.length : rest[dest][0], 0, ...chunk); normalizeGroups(list); save(touched); return true;
}
/** Przesuwa pozycję `id` na miejsce `to` w obrębie jej supersetu. Zwraca, czy coś się zmieniło. */
export function moveInGroup<T extends Grouped & { id: string }>(list: T[], id: string, to: number, touched?: Base | null): boolean {
  const i = list.findIndex(x => x.id === id); const g = list[i]?.groupId; if (!g || !Number.isFinite(to)) return false;
  const [s, e] = blockRanges(list).find(([a, b]) => i >= a && i <= b)!; const dest = s + Math.max(0, Math.min(e - s, Math.round(to)));
  if (dest === i) return false; const [x] = list.splice(i, 1); list.splice(dest, 0, x); save(touched); return true;
}

/**
 * Po wyborze gumy z podaną asystą: jeśli pole ±kg jest puste lub było asystą, wpisz −nominalKg (0.5).
 * Zdjęcie gumy czyści ±kg tylko wtedy, gdy wartość pochodziła z poprzedniej gumy — ręcznie wpisana asysta zostaje.
 */
export function applyBandAssist(s: WSet, prevBandId?: string) {
  // Runda 51: ujemna asysta należy zawsze do bieżącej gumy. Nowa guma ze znaną asystą ją wstawia (gdy nie ma dociążenia);
  // zmiana lub zdjęcie gumy zabiera asystę poprzedniej (wpisaną albo wstawioną). Dociążenie (+kg) zostaje.
  const b = s.bandId ? bandById(s.bandId) : null; const prev = prevBandId && prevBandId !== s.bandId ? bandById(prevBandId) : null; const cur = Number(s.addKg) || 0;
  void b; void prev; void cur; /* P-001: wybór/zdjęcie gumy nie zmienia już pola ±kg (guma = tylko poziom 1–7) */
}

/** Trwały stan timera — zapisywany natychmiast (bez debounce), bo chodzi o przeżycie zabicia aplikacji. */
export function setTimerState(patch: Partial<State['timer']>) { const st = getState(); st.timer = { ...(st.timer ?? blankTimer()), ...patch }; rev++; emit(); persistNow().catch(() => {}); }
/** Czy dziś jest poranny wpis z jakąkolwiek wartością. */
export function todayReadiness(at?: number) { const d = localISODate(at != null ? new Date(at) : undefined); // runda 31: dzień treningu, nie „dziś” po północy
  const m = getState().mornings.find(x => x.date === d); return m && (m.bb !== '' || m.sleepScore !== '' || m.sleepH !== '') ? m : null; }

/* ---------- misc ---------- */
/** Runda 39: wspólny limit długości nazw (pola edycji mają maxLength = NAME_MAX). */
export const NAME_MAX = 80;
/** Runda 40: przycięcie do n jednostek UTF-16 bez rozcinania emoji (pary zastępczej) i bez spacji na końcu. */
export const clampName = (s: string, n = NAME_MAX) => { let r = s.slice(0, Math.max(0, n)); if (/[\uD800-\uDBFF]$/.test(r)) r = r.slice(0, -1); return r.trimEnd(); };
export function newExercise(name = t('Nowe ćwiczenie')): Exercise { const e: Exercise = { ...base(getState().ownerId), name: clampName(name), group: 'inne', equipment: 'inne', metric: 'weight_reps', loadMode: 'total', restSec: null, restWarmupSec: null, muscles: [], secondaryMuscles: [], bandAssistable: false, tempo: '', notes: '' }; getState().exercises.push(e); save(); return e; }
/** Zmiana sprzętu ustawia domyślny tryb liczenia (wcześniej zostawał stary — np. ×2 dla masy ciała). */
export function setEquipment(e: Exercise, eq: Exercise['equipment']) { if (e.equipment === eq) return; /* runda 40: ten sam chip nie resetuje ustawień */ e.equipment = eq; e.loadMode = loadModeFor(eq, e.name); save(e); }
/** Czy ćwiczenie występuje w historii lub w treningu w toku. */
/** Runda 40: czy ćwiczenie jest w zakończonych treningach (historia — nie sam trening w toku). */
export const exerciseInHistory = (id: string) => getState().workouts.some(w => w.exercises.some(x => x.exerciseId === id));
/** Runda 40: usunięte (zarchiwizowane) ćwiczenia bez historii i spoza treningu w toku znikają na dobre. */
function purgeOrphans() { const st = getState(); st.exercises = st.exercises.filter(e => !e.archived || exerciseUsed(e.id)); }
export const exerciseUsed = (id: string) => { const st = getState(); return [...st.workouts, ...(st.active ? [st.active] : [])].some(w => w.exercises.some(x => x.exerciseId === id)); };
/**
 * Usunięcie ćwiczenia: znika z listy, wyboru i szablonów. Jeśli ma historię (albo jest w treningu w toku) — jest tylko
 * archiwizowane, żeby historia, CSV i objętość dalej je znały („Historia zostanie”). Bez historii — usuwane na stałe.
 */
export function deleteExercise(id: string) {
  const st = getState(); const e = exById(id); if (!e) return;
  st.templates.forEach(tpl => { tpl.items = tpl.items.filter(i => i.exerciseId !== id); normalizeGroups(tpl.items); });
  if (exerciseUsed(id)) e.archived = true; else st.exercises = st.exercises.filter(x => x.id !== id);
  save(e); flush();
}
/** Ćwiczenia widoczne na listach i w wyborze (bez zarchiwizowanych). */
export const visibleExercises = () => getState().exercises.filter(e => !e.archived);
export function newTemplate(): Template { const tpl: Template = { ...base(getState().ownerId), name: tr('Nowy szablon'), items: [] }; getState().templates.push(tpl); save(); return tpl; }
export function dupTemplate(id: string): Template { const src = getState().templates.find(x => x.id === id)!; const c: Template = JSON.parse(JSON.stringify(src)); Object.assign(c, base(getState().ownerId)); const suf = ' ' + tr('(kopia)'); c.name = clampName(src.name, NAME_MAX - suf.length) + suf; /* runda 39: limit nazwy */ const ids = new Map<string, string>(); c.items.forEach(i => { i.id = uid(); if (i.groupId) { if (!ids.has(i.groupId)) ids.set(i.groupId, uid()); i.groupId = ids.get(i.groupId)!; } }); getState().templates.push(c); save(); return c; }
export function deleteTemplate(id: string) { const st = getState(); st.templates = st.templates.filter(x => x.id !== id); save(); flush(); }
/** Włączanie/wyłączanie modułu (ADR-011). 'training' jest zawsze włączony. */
export function setModule(m: keyof State['settings']['modules'], on: boolean) { const s = getState().settings; s.modules[m] = m === 'training' ? true : on; save(); }
/** Dzisiejszy poranny wpis bez tworzenia go (do wyświetlania). */
export function peekTodayMorning(): Morning | undefined { const d = localISODate(); return getState().mornings.find(x => x.date === d); }
/** Dzisiejszy wpis — tworzony dopiero przy pierwszej edycji (wcześniej powstawał pusty już przy wejściu na ekran). */
export function todayMorning(): Morning { const st = getState(); const d = localISODate(); let m = st.mornings.find(x => x.date === d); if (!m) { m = { ...base(st.ownerId), date: d, bb: '', sleepScore: '', sleepH: '', weight: '' }; st.mornings.push(m); } return m; }
/** Reset: nowe dane startowe w języku, który będzie widoczny po resecie (ustawienie wraca na „auto” = język telefonu). */
export function resetAll() { replaceState(seedState(detectLang())); clearRecovery(); flush(); }
export type { WExercise };
/** Tylko dla testów: czy store jest zainicjowany. */
export const isReadyForTests = () => !!S;
/** Tylko dla testów: czyści stan modułu (bez dotykania bazy). */
export function __resetForTests() { persistQueue = Promise.resolve(); fullDirty = true; persistSeq = 0; S = null; db = null; rev = 0; histRev += 1; persistError = null; recovery = null; if (saveTimer) clearTimeout(saveTimer); saveTimer = null; listeners.clear(); }
