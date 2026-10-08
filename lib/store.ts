import { deloadSets } from '@/lib/deload-sets';
import * as SQLite from 'expo-sqlite';
import * as FileSystem from 'expo-file-system/legacy';
import { useSyncExternalStore } from 'react';
import { t, t as tr, tIn, applyLang, detectLang, locale, fold, isLang, lang } from './i18n';
import { applyUnit, wu, wOut, wIn, KG_PER_LB, fmtW, fmtNum, snapLegacyLb } from './units';
import { applyTheme } from './theme';
import { seedState, uid, base, defaultModules, defaultSettings, metricFor, loadModeFor, loadMult, blankTimer, musclesFor, hasTime, hasReps, hasWeight, hasDistance, METRICS, DEFAULT_REST, GROUPS, LIB, SCHEMA_VERSION, LOCAL_OWNER, MODULES, SET_KINDS, SINGLE_IMPLEMENT, equipFields, libExercise, LIB_EXTRA_REVS, LIB_EXTRA_REV, LIB_MUSCLE_FIXES, libExtraRevOf, LIB_BASE_NAMES, LOAD_SOURCE_BY_EQUIPMENT, IMPLS, own, type Impl, type SetKind, type Base, type State, type Workout, type WSet, type WExercise, type Exercise, type Template, type TemplateItem, type TemplateAlt, type TRow, type Morning, type Location, type PlanSegment } from './seed';
import { equipById, loadsFor, implAt, implsAt, blankLoad, availability, fillGym, GYM_FILL, fillOpts, OPT_FILL } from './equipment';
import { sanitizeLoadSpec, nextHeavier, hasLoadShown } from './loads';
import { CATALOG, CATALOG_REV, CABLES } from './catalog.generated';

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
  /* Audyt 0.10 J1 (DAT-05): baza zapisana przez nowszą wersję (wyższy schemat) — niczego nie migrujemy ani nie zapisujemy; ekran startu
   * mówi „zaktualizuj aplikację” i pozwala wysłać surowe dane (readRawData). */
  if (row) { let ver = 0; try { ver = Number(JSON.parse(row.v)?.schemaVersion) || 0; } catch {} if (ver > SCHEMA_VERSION) { newerSchema = ver; throw Object.assign(new Error(t('Dane z nowszej wersji aplikacji — zaktualizuj aplikację')), { newerSchema: ver }); } }
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
export function applyPrefs() { if (!S) return; applyLang(S.settings.language); applyUnit(S.settings.unit); applyTheme(S.settings.theme); }

const isObj = (x: unknown): x is Record<string, any> => !!x && typeof x === 'object' && !Array.isArray(x);
const arr = (x: unknown): any[] => Array.isArray(x) ? x.filter(isObj) : [];
const LIB_NAMES = LIB_BASE_NAMES; /* audyt 04.10 (LOW): reguła danych sprzed schematu 10 tylko dla pierwszych 125 nazw — własne ćwiczenie „Svend Press” z web 0.3 nie staje się biblioteką */

/**
 * Migracja do bieżącego schematu. Przyjmuje backupy web 0.3, natywnej 0.1.0 i każdą późniejszą wersję;
 * dopisuje brakujące pola, pomija uszkodzone wpisy (null, nie-obiekty) zamiast się wywracać.
 * Idempotentna — można ją wołać na stanie już zmigrowanym.
 */
/** Pola Settings znane tej wersji — pola domyślne plus opcjonalne (nowe pole opcjonalne dopisz tutaj, inaczej jego zła wartość z importu
 * przejdzie jak nieznane ustawienie); reszta zostaje bez zmian — audyt 0.10 J1. */
const SETTINGS_KEYS = new Set([...Object.keys(defaultSettings()), 'effortScale', 'planReminder']);
const PROTO_KEYS = new Set(['__proto__', 'constructor', 'prototype']);
/** Ustawienia usunięte w schemacie 13 (runda 75, Q-001: masa ciała poza obliczeniami) — w danych sprzed 13 odpadają jak dotąd. */
const LEGACY_SETTINGS_13 = new Set(['bodyWeightKg']);
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
/** P-003 (schemat 14): pola sprzętowe ćwiczenia. Brak (dane sprzed 14) → z katalogu dla biblioteki (flaga lib + nazwa kanoniczna), dla własnych
 * bez wymagań (zawsze dostępne) ze źródłem obciążenia ze zgrubnego sprzętu. Istniejące — tylko poprawiane (idempotentnie; edycja zostaje). */
const LOAD_SOURCES = ['barbell', 'dumbbell', 'cable', 'machine_stack', 'bodyweight', 'trap_bar', 'ez_bar', 'plate_loaded_machine', 'kettlebell', 'smith', 'band', 'none'];
const PATTERNS = new Set(Object.values(CATALOG).map(c => c.pattern as string).concat('other'));
function fixEquipFields(e: any) {
  /* audyt M6: ćwiczenie z biblioteki z wymaganiami z innej wersji katalogu (i nieedytowane: catalogRev ≠ 'user') dostaje aktualne */
  const fromCatalog = e.lib === true && Object.prototype.hasOwnProperty.call(CATALOG, e.name);
  if (!Array.isArray(e.requires) || (fromCatalog && e.catalogRev !== 'user' && e.catalogRev !== CATALOG_REV)) { const f = equipFields(e.name, e.equipment, e.lib === true); delete e.implements; delete e.pattern; delete e.catalogRev; Object.assign(e, f); return; }
  if (!fromCatalog && e.catalogRev !== 'user') delete e.catalogRev;
  const strs = (a: unknown): string[] => Array.isArray(a) ? [...new Set(a.filter((x: unknown): x is string => typeof x === 'string' && !!x))] : [];
  /* audyt (LOW): uszkodzona grupa wymagań czyni ćwiczenie MNIEJ dostępnym — grupa bez żadnej poprawnej możliwości = „?” (niespełnialna) */
  e.requires = e.requires.map((g: unknown) => { const v = strs(g); return v.length ? v : ['?']; }); e.recommended = strs(e.recommended);
  if (!LOAD_SOURCES.includes(e.loadSource)) e.loadSource = equipFields(e.name, e.equipment, e.lib === true).loadSource;
  if (!PATTERNS.has(e.pattern)) delete e.pattern; if (e.implements !== 1 && e.implements !== 2) delete e.implements;
}
/** P-003: miejsca treningu z importu — znane pozycje sprzętu i opcje, poprawne opisy ciężarów; miejsce główne zawsze istnieje, gdy są miejsca. */
function fixLocations(s: any, stamp: (o: any) => void, language: unknown): { locations: Location[]; mainLocationId: string | null; pickerShowAll: boolean } {
  const seen = new Set<string>(); const locations: Location[] = [];
  for (const l of arr(s.locations)) {
    stamp(l); if (seen.has(l.id)) continue; seen.add(l.id);
    const n = typeof l.name === 'string' ? clampName(l.name.replace(/\s+/g, ' ').trim()) : ''; l.name = n || tIn(language, 'Miejsce'); /* audyt (LOW): limit nazwy jak w polu */
    const items = new Set<string>();
    l.equipment = arr(l.equipment).filter((e: any) => { const x = typeof e.item === 'string' ? equipById(e.item) : undefined; if (!x || items.has(e.item)) return false; items.add(e.item);
      const ok = new Set((x.options ?? []).map(o => o.id)); e.opts = Array.isArray(e.opts) ? [...new Set(e.opts.filter((o: unknown) => typeof o === 'string' && ok.has(o)))] : [];
      const ld = x.load ? sanitizeLoadSpec(e.load) ?? blankLoad(x, e.load?.unit === 'lb' ? 'lb' : 'kg') : undefined; if (ld) e.load = ld; else delete e.load; /* weryfikacja 2: zły opis → pusty domyślny (edytor zostaje), nie usunięcie */ if (e.off !== true) delete e.off; /* audyt M5: odznaczona pozycja z zachowanymi ciężarami */ const lv = cleanLevels(e.item, e.levels); if (lv) e.levels = lv; else delete e.levels; for (const k of Object.keys(e)) if (!['item', 'opts', 'load', 'off', 'levels'].includes(k)) delete e[k]; return true; });
    locations.push(l as Location);
  }
  const main = idOf(s.mainLocationId);
  return { locations, mainLocationId: main && seen.has(main) ? main : locations[0]?.id ?? null, pickerShowAll: s.pickerShowAll === true };
}
/** Schemat 16 (E2, docs/14 pkt 2.2, M1–M4) — pola zamiany bloku; po sanityzacji exerciseId i impl. Istnienia ćwiczenia swappedFrom nie sprawdzamy
 * (jak tplItemId) — ekran znosi brak. splitFrom i altSkip żyją tylko w treningu w toku (historia — jak staleAck). */
function fixSwapFields(e: any, live: boolean) {
  { const v = idOf(e.swappedFrom); if (v && v !== e.exerciseId) e.swappedFrom = v; else delete e.swappedFrom; } /* M1 */
  if (e.implPinned !== true || e.impl === undefined) delete e.implPinned; /* M2 */
  { const v = live ? idOf(e.splitFrom) : null; if (v) e.splitFrom = v; else delete e.splitFrom; } /* M3 */
  if (!live || e.altSkip !== true) delete e.altSkip; /* M4 */
  if (!live || e.skipped !== true) delete e.skipped; /* 07.10.2026 wieczór: „Pomiń dziś” — jak altSkip, tylko trening w toku */
}
/** Schemat 16 (E2 W3, docs/14 pkt 2.2, M5; M6 — po filtrze ćwiczeń, M7 — usunięte miejsce zostaje): zamienniki pozycji szablonu z importu —
 * biała lista pól, id tekstem, przerwa jak pozycji, przyrząd tylko znany; jeden wpis na miejsce (pierwszy); zamiennik = ćwiczenie pozycji bez przyrządu odpada. */
function fixAlternates(it: any) {
  if (it.alternates === undefined) return; if (!Array.isArray(it.alternates)) { delete it.alternates; return; }
  const seen = new Set<string>(); const out: TemplateAlt[] = [];
  for (const x of arr(it.alternates)) {
    const locationId = idOf(x.locationId), exerciseId = idOf(x.exerciseId); if (!locationId || !exerciseId || seen.has(locationId)) continue;
    const v = parseNum(x.restSec); const restSec = v == null || v < 0 ? null : Math.min(1800, Math.round(v));
    const a: TemplateAlt = { locationId, exerciseId, restSec }; if ((IMPLS as readonly unknown[]).includes(x.impl)) a.impl = x.impl;
    if (exerciseId === it.exerciseId && !a.impl) continue; seen.add(locationId); out.push(a);
  }
  if (out.length) it.alternates = out; else delete it.alternates;
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
    fixEquipFields(e);
  });
  /* Katalog 04.10.2026 (decyzja właściciela: rozbudowa katalogu): dane bez znacznika katalogu dostają nowe ćwiczenia biblioteki RAZ (znacznik
   * State.libExtra — ćwiczenie usunięte później przez użytkownika nie wraca); pomijane, gdy istnieje ćwiczenie o tej samej nazwie (także własne).
   * Audyt 04.10 (HIGH): znacznik zamiast granicy schematu — build 01f2bee miał już schemat 16 bez katalogu. */
  const sameList = (a: unknown, b: readonly string[]) => Array.isArray(a) && a.length === b.length && a.every((x, i) => x === b[i]);
  /* Krok b (04.10 wieczór): kroki kolejno od zapisanego znacznika; nieznany (nowszy) znacznik — bez zmian. */
  /* Audyt kroku b (MEDIUM): libExtra zostaje wartością pierwszego kroku (build 643cba7 porównuje ją dosłownie i przy innej dopisałby usunięte
   * ćwiczenia po powrocie do starszej wersji); kolejne kroki — w libExtraStep. */
  { const mark = typeof raw.libExtraStep === 'string' ? raw.libExtraStep : raw.libExtra; const done = typeof mark === 'string' ? LIB_EXTRA_REVS.indexOf(mark) : -1;
    if (done >= 0 || typeof mark !== 'string') { const have = new Set(raw.exercises.map((e: any) => fold(e.name)));
      for (const rev of LIB_EXTRA_REVS.slice(done + 1)) {
        for (const row of LIB) if (libExtraRevOf(row[0]) === rev && !have.has(fold(row[0]))) { raw.exercises.push(libExercise(row, owner)); have.add(fold(row[0])); }
        for (const f of LIB_MUSCLE_FIXES) if (f.rev === rev) for (const e of raw.exercises) if (e.lib === true && e.name === f.name && sameList(e.muscles, f.from[0]) && sameList(e.secondaryMuscles, f.from[1])) { const [a, b] = musclesFor(e.name, e.group); e.muscles = a; e.secondaryMuscles = b; }
      }
      raw.libExtra = LIB_EXTRA_REVS[0]; raw.libExtraStep = LIB_EXTRA_REV; } }
  raw.templates = arr(raw.templates);
  raw.templates.forEach((t: any) => { stamp(t); if (typeof t.name !== 'string') t.name = ''; t.items = arr(t.items); t.items = t.items.filter((it: any) => idOf(it.exerciseId) != null); t.items.forEach((it: any) => { it.id = idOf(it.id) ?? uid(); it.exerciseId = idOf(it.exerciseId); { const v = parseNum(it.targetSec); it.targetSec = v == null || v < 0 ? '' : Math.min(86400, Math.round(v)); } /* runda 51 */ it.groupId = idOf(it.groupId); it.sets = intIn(it.sets, 1, 50) ?? 1; /* runda 15: liczba, nie tekst z importu */ if (it.startWeight === undefined) it.startWeight = ''; for (const k of ['repMin', 'repMax']) it[k] = intIn(it[k], 1, 100); { const v = parseNum(it.restSec); it.restSec = v == null || v < 0 ? null : Math.min(1800, Math.round(v)); } /* runda 49: także tekst, jak przerwa ćwiczenia */ /* runda 17: limit 1800 */ { const v = parseNum(it.startWeight); it.startWeight = v == null ? '' : kg2(snapL(v) as number); } fixAlternates(it); fixRows(it); }); });
  raw.templates.forEach((x: any) => { const n = typeof x.note === 'string' ? cleanNote(x.note) : ''; if (n) x.note = n; else delete x.note; }); /* audyt 0.10 UX-10: notatka szablonu */
  raw.templates.forEach((x: any) => { const n = x.name.replace(/\s+/g, ' ').trim(); x.name = n || tIn(raw.settings?.language, 'Nowy szablon'); { const l = idOf(x.locationId); if (l) x.locationId = l; else delete x.locationId; } /* P-003 */ { const f = typeof x.folder === 'string' ? cleanFolder(x.folder) : ''; if (f) x.folder = f; else delete x.folder; } if (x.archived !== true) delete x.archived; /* 07.10.2026 wieczór: folder i archiwum */ }); // runda 35: jak nazwy ćwiczeń
  /* Decyzja właściciela 03.10.2026 (08:11): aplikacja nie zmienia ciężarów ani treści szablonów użytkownika — także przy przejściu na schemat 15
   * (wcześniejsza jednorazowa zmiana 48 → 24 kg z P-004 usunięta: 48 zostaje 48). Zostaje tylko dotychczasowa normalizacja, ta sama co w main:
   * pola pozycji wyżej (liczby, zakresy, siatka kg), a niżej usunięcie pozycji, których ćwiczenia nie ma albo jest usunięte (runda 82b — docs/10). */
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
    w.startedAt = tsOf(w.startedAt); w.finishedAt = w === raw.active ? null : (tsOf(w.finishedAt) ?? w.startedAt); if (w !== raw.active || tsOf(w.staleAck) == null) delete w.staleAck; else w.staleAck = tsOf(w.staleAck); /* 08.10.2026: pauza — przedziały uporządkowane w granicach treningu (cleanPauses), pausedAt tylko w treningu w toku i nie przed startem */ { if (w.startedAt != null) setPauses(w, cleanPauses(w.pauses, w.startedAt, w.finishedAt)); else delete w.pauses; delete w.pausedMs; const pa = tsOf(w.pausedAt); if (w === raw.active && pa != null && w.startedAt != null && pa >= w.startedAt) w.pausedAt = pa; else delete w.pausedAt; } /* runda 69 */ /* runda 49/51: trening z historii zawsze zakończony; trening w toku — nie */ /* runda 49: zakończony (choć nieczytelny) trening zostaje w historii */ if (w.finishedAt != null && w.finishedAt < w.startedAt) w.finishedAt = w.startedAt; /* runda 48 */ if (typeof w.templateName !== 'string') w.templateName = ''; if (typeof w.note !== 'string') w.note = ''; w.templateId = idOf(w.templateId); { const l = idOf(w.locationId); if (l) w.locationId = l; else delete w.locationId; } /* P-003: miejsce zostaje także po usunięciu miejsca („(usunięte miejsce)”) */
    w.exercises = arr(w.exercises).filter((e: any) => idOf(e.exerciseId) != null); /* runda 50/51 */ if (w !== raw.active) { w.exercises.forEach((e: any) => { e.sets = arr(e.sets).filter((s: any) => !!s.done); e.sets.forEach((s: any) => { delete s.pre; }); }); w.exercises = w.exercises.filter((e: any) => e.sets.length); } /* runda 59: historia = tylko odhaczone serie, jak po „Zakończ” */ w.exercises.forEach((e: any) => { e.exerciseId = idOf(e.exerciseId); e.id = idOf(e.id) ?? uid(); if (e.tplItemId != null) e.tplItemId = idOf(e.tplItemId) ?? undefined; if (!(IMPLS as readonly unknown[]).includes(e.impl)) delete e.impl; /* schemat 15 (decyzja 8c): tylko znany przyrząd */ fixSwapFields(e, w === raw.active); /* schemat 16 (E2) */ for (const k of ['repMin', 'repMax']) e[k] = intIn(e[k], 1, 100); /* runda 49: jak w szablonie */ e.groupId = idOf(e.groupId); { const v = parseNum(e.restSec); e.restSec = v == null || v < 0 ? DEFAULT_REST : Math.min(1800, Math.round(v)); } e.sets = arr(e.sets); e.sets.forEach(fixSet); }); normalizeGroups(w.exercises);
  };
  raw.bands = arr(raw.bands); raw.bands.forEach((b: any) => { stamp(b); delete b.nominalKg; /* T-055: dawna asysta kg gumy (przed P-001) — stara kopia się importuje, pole odpada; starsze wersje aplikacji czytają brak pola jako „bez kg” */ if (typeof b.color !== 'string' || !b.color.trim()) b.color = '?'; b.color = b.color.replace(/\s+/g, ' ').trim(); b.level = intIn(b.level, 1, 7) ?? 1; /* runda 51 */ });
  raw.workouts = arr(raw.workouts).filter(w => tsOf(w.startedAt) != null); raw.workouts.forEach((w: any) => { w.startedAt = tsOf(w.startedAt); }); raw.workouts.forEach((w: any) => { stamp(w, w.finishedAt || w.startedAt); fixWorkout(w); }); raw.workouts = raw.workouts.filter((w: any) => w.exercises.length); /* runda 60: bez pustych sesji w historii (jak po „Zakończ”, B9) */
  // Runda 16: data poranna w formacie RRRR-MM-DD (np. „2026-9-1” z ręcznej edycji → „2026-09-01”); nieczytelne odpadają.
  raw.mornings = arr(raw.mornings).filter(m => typeof m.date === 'string' && /^\d{4}-\d{1,2}-\d{1,2}/.test(m.date)).map((m: any) => { const [y, mo, d] = m.date.slice(0, 10).split(/[-T]/); m.date = `${y}-${mo.padStart(2, '0')}-${d.padStart(2, '0')}`; return m; })
    // Runda 17: tylko istniejące daty (bez „2026-13-45”) i jeden wpis na dzień (zostaje nowszy).
    .filter((m: any) => { const [y, mo, d] = m.date.split('-').map(Number); const x = new Date(y, mo - 1, d); return x.getFullYear() === y && x.getMonth() === mo - 1 && x.getDate() === d; });
  { const byDate = new Map<string, any>(); for (const m of raw.mornings) { const o = byDate.get(m.date); if (!o || (tsOf(m.updatedAt) ?? 0) > (tsOf(o.updatedAt) ?? 0)) byDate.set(m.date, m); } raw.mornings = [...byDate.values()]; }
  raw.mornings.forEach((m: any) => { stamp(m, localDateTs(m.date)); for (const k of ['bb', 'sleepScore', 'sleepH', 'weight']) m[k] = posNum(m[k]); /* runda 50: liczba albo '' (obiekt z importu wywracał ekran) */ if (m.bb !== '') m.bb = Math.min(100, Math.round(m.bb)); if (m.sleepScore !== '') m.sleepScore = Math.min(100, Math.round(m.sleepScore)); if (m.sleepH !== '') m.sleepH = Math.min(24, Math.round(m.sleepH * 100) / 100); if (m.weight !== '') { const w = kg2(snapL(m.weight) as number); m.weight = w > 0 && w <= 1000 ? w : ''; } /* runda 61: najpierw zaokrąglenie, potem zakres */ /* runda 51: 0 = brak wpisu */ });
  if (isObj(raw.active) && tsOf(raw.active.startedAt) != null) { stamp(raw.active, raw.active.startedAt); fixWorkout(raw.active); } else raw.active = null;
  uniqueIds(raw); /* przed porządkowaniem nieużywanych ćwiczeń — inaczej drugie wczytanie zmieniałoby dane (migrate-idem) */
  // Runda 41: jak purgeOrphans — usunięte ćwiczenia bez żadnego treningu znikają także przy starcie i imporcie.
  { const used = new Set<string>(); for (const w of [...raw.workouts, ...(raw.active ? [raw.active] : [])]) for (const x of w.exercises) used.add(x.exerciseId); raw.exercises = raw.exercises.filter((e: any) => e.archived !== true || used.has(e.id)); }
  // Runda 43: pozycje szablonów wskazujące brakujące lub usunięte ćwiczenie odpadają (jak przy usuwaniu ćwiczenia w aplikacji).
  { const ok = new Set<string>(raw.exercises.filter((e: any) => e.archived !== true).map((e: any) => e.id)); raw.templates.forEach((tp: any) => { const n = tp.items.length; tp.items = tp.items.filter((it: any) => ok.has(it.exerciseId)); void n;
    tp.items.forEach((it: any) => { if (!it.alternates) return; it.alternates = it.alternates.filter((x: any) => ok.has(x.exerciseId)); if (!it.alternates.length) delete it.alternates; }); /* E2 M6: zamiennik z brakującym / usuniętym ćwiczeniem odpada */ normalizeGroups(tp.items); /* T-010 (audyt): zawsze — rozerwana grupa z importu dzieliłaby klucz bloku przy przeciąganiu */ }); }
  raw.timer = { ...blankTimer(), ...(isObj(raw.timer) ? raw.timer : {}) };
  delete raw.timer.setEi; delete raw.timer.setSi;
  { const T = raw.timer, b = blankTimer() as any; for (const k of ['restEndAt', 'setStartAt']) if (T[k] != null) T[k] = tsOf(T[k]); for (const k of ['restTotal', 'setTarget']) T[k] = intIn(T[k], 0, 86400) ?? b[k]; /* runda 52: doba to i tak koniec */ for (const k of ['restSetId', 'setId']) if (T[k] != null && typeof T[k] !== 'string') T[k] = null; } // runda 49
  raw.relations = arr(raw.relations); raw.feedback = arr(raw.feedback); raw.instructions = arr(raw.instructions);
  // Ustawienia: pole po polu na domyślnych, żeby częściowy obiekt nie dał undefined (np. przerwa → „NaNs”).
  const d = defaultSettings(); const s = isObj(raw.settings) ? raw.settings : {};
  /* Audyt 0.10 J1 (DAT-05): ustawienia, których ta wersja nie zna (zapisała je nowsza), zostają — powrót do nowszej wersji ich nie gubi;
   * bez kluczy, które mogłyby zatruć prototyp. Znane pola niżej — jak dotąd, pole po polu. */
  const legacy = (Number(raw.schemaVersion) || 0) < 13 ? LEGACY_SETTINGS_13 : new Set<string>(); /* pola usunięte w 13 (Q-001) — nie wracają z dawnych danych */
  const unknownSettings = Object.fromEntries(Object.keys(s).filter(k => !SETTINGS_KEYS.has(k) && !PROTO_KEYS.has(k) && !legacy.has(k)).map(k => [k, s[k]]));
  raw.settings = { ...unknownSettings,
    defaultRest: (v => v != null && v >= 0 ? Math.min(1800, Math.round(v)) : d.defaultRest)(parseNum(s.defaultRest)), // runda 17: ten sam limit co wszędzie
    sound: typeof s.sound === 'boolean' ? s.sound : d.sound,
    wakeLock: typeof s.wakeLock === 'boolean' ? s.wakeLock : d.wakeLock,
    showRpe: typeof s.showRpe === 'boolean' ? s.showRpe : d.showRpe,
    ...(s.effortScale === 'rir' ? { effortScale: 'rir' as const } : {}), ...(s.planReminder === false ? { planReminder: false as const } : {}), /* przypomnienie z planu (08.10.2026): tylko wyłączenie zapisane */ /* pakiet C: tylko wybór RIR zapisany — dane sprzed zmiany przechodzą 1:1 (swap-schema16) */
    healthSync: typeof s.healthSync === 'boolean' ? s.healthSync : d.healthSync,
    progressHint: typeof s.progressHint === 'boolean' ? s.progressHint : d.progressHint, autoBackup: typeof s.autoBackup === 'boolean' ? s.autoBackup : d.autoBackup, weighReminder: typeof s.weighReminder === 'boolean' ? s.weighReminder : d.weighReminder, /* runda 75 */
    modules: (() => { const mods = { ...defaultModules(), ...(isObj(s.modules) ? s.modules : {}) }; MODULES.forEach(m => { if (typeof mods[m] !== 'boolean') mods[m] = false; }); mods.training = true; return mods; })(),
    language: s.language === 'auto' || isLang(s.language) ? s.language : d.language,
    unit: s.unit === 'lb' ? 'lb' : 'kg',
    theme: s.theme === 'dark' || s.theme === 'auto' ? s.theme : 'light', /* decyzja 05.10.2026: domyślnie jasny, także dla starszych danych (potwierdzone 07.10.2026) */
    workoutView: s.workoutView === 'list' ? 'list' : 'focus', /* 07.10.2026: widok skupiony domyślnie, także dla starszych danych (bez zmiany schematu) */
    ...fixLocations(s, stamp, raw.settings?.language), /* P-003 (schemat 14): bez tego biała lista gubiła miejsca przy każdym starcie i imporcie */
  };
  if (raw.equipFill !== GYM_FILL.rev) { for (const l of raw.settings.locations) fillGym(l, raw.settings.unit); raw.equipFill = GYM_FILL.rev; } /* decyzja 05.10.2026 (1.a): raz */
  /* pakiet C: tygodnie deload — daty poniedziałków, bez powtórzeń, posortowane, najwyżej 10 lat; pusta lista znika (dane sprzed zmiany 1:1); nie `arr` — ta przepuszcza tylko obiekty */
  { const u = [...new Set((Array.isArray(raw.deloadWeeks) ? raw.deloadWeeks : []).filter((x: unknown) => typeof x === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(x) && new Date(+x.slice(0, 4), +x.slice(5, 7) - 1, +x.slice(8, 10)).getDay() === 1))].sort().slice(-520) as string[]; if (u.length) raw.deloadWeeks = u; else delete raw.deloadWeeks; }
  /* kalendarz (08.10.2026): plan tygodnia — 7 pozycji (id tekstem albo null), pusty znika; zmiany dni — klucze-daty, wartości id albo null */
  { const days = planDays(isObj(raw.weekPlan) ? raw.weekPlan.days : null);
    const nm = isObj(raw.weekPlan) && typeof raw.weekPlan.name === 'string' ? cleanPlanName(raw.weekPlan.name) : ''; /* audyt 0.10 B4 (DAT-06): idempotentnie, bez rozcinania emoji */
    if (days.some(Boolean) || nm) raw.weekPlan = { days, ...(nm ? { name: nm } : {}) }; else delete raw.weekPlan;
    /* 08.10.2026 (docs/24): zapisane plany — id tekstem bez powtórzeń, nazwa ≤ 40, 7 dni; pusta lista znika; najwyżej SAVED_PLANS_MAX (ten sam limit w UI — audyt 0.10 B3) */
    { const seen = new Set<string>(); const sp = (Array.isArray(raw.savedPlans) ? raw.savedPlans : []).filter((p: any) => isObj(p) && typeof p.id === 'string' && p.id && !seen.has(p.id) && (seen.add(p.id), true))
        .map((p: any) => { const ov = cleanOverrides(p.overrides); return { id: p.id, name: typeof p.name === 'string' ? cleanPlanName(p.name) : '', days: planDays(p.days), ...(Object.keys(ov).length ? { overrides: ov } : {}) }; }); /* audyt 0.10 B1: zmiany dni zapisane z planem */
      if (sp.length) raw.savedPlans = sp.slice(0, SAVED_PLANS_MAX); else delete raw.savedPlans; }
    const ov = cleanOverrides(raw.planOverrides);
    if (Object.keys(ov).length) raw.planOverrides = ov; else delete raw.planOverrides;
    /* Schemat 18 (audyt 0.10 A1, decyzja właściciela 08.10.2026 — wariant B): historia planu. Dane bez historii (≤ 17): plan tygodnia obowiązuje
     * od dnia migracji — nie wiemy, od kiedy był ustawiony, więc żaden wcześniejszy dzień nie staje się „opuszczony”. Ostatni odcinek = weekPlan:
     * gdy się różnią (plan zmieniony w starszej wersji, która historii nie zna), dochodzi odcinek od dziś. Po zgodzie — bez zmian (idempotentne). */
    { const today = localISODate(); let h = normPlanHistory(raw.planHistory); const last = h[h.length - 1];
      if (last ? !sameDays(last.days, days) : days.some(Boolean)) h = appendPlanSegment(h, today, days);
      if (h.length) raw.planHistory = h; else delete raw.planHistory; }
    /* audyt 0.10 D4: „Nie teraz” przy podpowiedzi deload — data poniedziałku albo brak */
    if (typeof raw.deloadSnooze !== 'string' || !DATE_KEY.test(raw.deloadSnooze)) delete raw.deloadSnooze; }
  { const g = [...new Set((Array.isArray(raw.guideSeen) ? raw.guideSeen : []).filter((x: unknown) => typeof x === 'string' && x && x.length <= 40))].slice(0, 50); if (g.length) raw.guideSeen = g; else delete raw.guideSeen; } /* przewodnik (08.10.2026) */
  if (typeof raw.whatsNewSeen !== 'string' || !raw.whatsNewSeen || raw.whatsNewSeen.length > 40) delete raw.whatsNewSeen; /* „Co nowego” (08.10.2026) */
  if (raw.optFill !== OPT_FILL.rev) { for (const l of raw.settings.locations) fillOpts(l); raw.optFill = OPT_FILL.rev; } /* bieżnia: nachylenie (05.10.2026), raz */
  raw.ownerId = owner;
  if (!Number.isFinite(raw.v)) raw.v = 2; if (raw.metaUpdatedAt != null && tsOf(raw.metaUpdatedAt) == null) delete raw.metaUpdatedAt; /* runda 53 */
  raw.schemaVersion = Math.max(SCHEMA_VERSION, Number(raw.schemaVersion) || 0); /* audyt 0.10 J1: numer schematu nigdy w dół (dane z nowszej wersji zatrzymuje init i import) */
  return raw as State;
}
/** Decyzja właściciela 06.10.2026 (wariant A): powtórzony identyfikator w danych (np. kopia sklejona ręcznie z dwóch plików) dostaje nowy —
 * nic nie ginie (dotąd usunięcie jednego treningu kasowało oba, drugie ćwiczenie/guma było nieosiągalne). Pierwsze wystąpienie zachowuje id,
 * więc odwołania (pozycje szablonów, bloki, gumy serii) wskazują to samo co przedtem. Idempotentne: przy unikalnych id nic nie zmienia.
 * Znalezisko tests/matrix-data-fuzz.test.ts. */
function uniqueIds(raw: any) {
  /* nowe id deterministyczne („<id>~2”, „~3”…): dwa wczytania tych samych danych dają ten sam wynik (porównania eksport → import, restart) */
  const fresh = (list: any[]) => { const seen = new Set<string>(list.map(o => o?.id).filter((x: unknown) => typeof x === 'string'));
    const first = new Set<string>(); for (const o of list) { if (typeof o?.id !== 'string') continue; if (!first.has(o.id)) { first.add(o.id); continue; }
      let n = 2; while (seen.has(`${o.id}~${n}`)) n++; o.id = `${o.id}~${n}`; seen.add(o.id); first.add(o.id); } };
  /* ten sam obiekt w kilku miejscach (dane z pamięci, nie z pliku) — osobne kopie, żeby zmiana id jednej nie zmieniała wszystkich */
  const objs = new Set<object>(); const own = (list: any[]) => list.map(o => { if (!isObj(o)) return o; if (objs.has(o)) return JSON.parse(JSON.stringify(o)); objs.add(o); return o; });
  raw.exercises = own(raw.exercises); raw.bands = own(raw.bands); raw.templates = own(raw.templates); raw.workouts = own(raw.workouts);
  for (const t of raw.templates) if (Array.isArray(t.items)) { t.items = own(t.items); for (const it of t.items) if (Array.isArray(it?.rows)) it.rows = own(it.rows); }
  for (const w of [...raw.workouts, ...(isObj(raw.active) ? [raw.active] : [])]) if (Array.isArray(w.exercises)) { w.exercises = own(w.exercises); for (const e of w.exercises) if (Array.isArray(e?.sets)) e.sets = own(e.sets); }
  fresh(raw.exercises); fresh(raw.bands); fresh(raw.templates);
  fresh(raw.templates.flatMap((t: any) => arr(t.items)));
  for (const it of raw.templates.flatMap((t: any) => arr(t.items))) if (Array.isArray(it.rows)) fresh(it.rows);
  const ws = [...raw.workouts, ...(isObj(raw.active) ? [raw.active] : [])];
  fresh(ws); const blocks = ws.flatMap((w: any) => arr(w.exercises)); fresh(blocks); fresh(blocks.flatMap((e: any) => arr(e.sets)));
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
/** Audyt 0.10 J1: schemat danych z nowszej wersji, które zatrzymały start (null — brak). */
let newerSchema: number | null = null;
export const getNewerSchema = () => newerSchema;
/** Audyt 0.10 J1: surowy zapis (stan + trening w toku) do wysłania z ekranu „Dane z nowszej wersji” — koperta jak kopia nieczytelnych danych
 * (nowsza wersja wczyta ją importem). */
export async function readRawData(): Promise<string | null> {
  if (!db) return null; const r = await db.getFirstAsync<{ v: string }>('SELECT v FROM kv WHERE k = ?', 'state'); if (!r) return null;
  const l = await db.getFirstAsync<{ v: string }>('SELECT v FROM kv WHERE k = ?', 'live').catch(() => null);
  const js = (x: string) => { try { return JSON.parse(x); } catch { return x; } };
  return JSON.stringify({ format: 'trening-recovery', note: 'state = zapis z nowszej wersji aplikacji, live = trening w toku', state: js(r.v), ...(l ? { live: js(l.v) } : {}) });
}
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
export const usePrefsTick = () => useStore(s => `${s.settings.language}|${s.settings.unit}|${s.settings.theme}`);
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
/**
 * Ciężar serii — JEDNO źródło (Q-018, runda 83b). Seria ma dwa pola: `weight` (kg — sprzęt z ciężarem) i `addKg` (±kg — masa ciała:
 * + dociążenie, − asysta). Pole „własne” to to, które pasuje do OBECNEGO sprzętu ćwiczenia; drugie („obce”) zostaje w seriach zapisanych
 * przed zmianą sprzętu (np. „inne” 42,5 kg → masa ciała).
 * Reguła (decyzja rundy 83b):
 *  - WIDOK (historia: ekran sesji, edytor, opisy serii „Ostatnio”/Postępy, CSV) pokazuje wartość własnego pola, a gdy puste — obcego
 *    (`shownLoad`), żeby historia mówiła, co wpisano (Q-018: bez „0 kg”);
 *  - OBLICZENIA i trening w toku (objętość, rekordy max/e1RM, PR, „najlepsza seria”, podpowiedź progresji, „Poprzednio”, wpisywanie
 *    podpowiedzi) biorą WYŁĄCZNIE własne pole (`setLoad`): 42,5 kg maszyny to nie „+42,5 kg dociążenia”, a asysta −20 to nie ciężar sztangi
 *    — runda 83 (Q-018) liczyła je do rekordów i progresji (audyt 83b, MEDIUM 1). Obca wartość zacznie się liczyć, gdy użytkownik wpisze ją
 *    w edytorze historii (zapis `writeLoad` przenosi ją do własnego pola).
 * Ujemna wartość ma sens tylko przy masie ciała (asysta): poza nią widok i obliczenia dają ≥ 0 (runda 48; audyt 83b, LOW 1).
 * Wpisane 0 jest wartością (bez sięgania do drugiego pola). Usunięte ćwiczenie (ex brak) = pole kg własne.
 */
export function loadOf(ex: Exercise | undefined, s: Pick<WSet, 'weight' | 'addKg'>): { kg: number; own: boolean; raw: number | '' } {
  const bw = !!ex && isBW(ex); const a = bw ? s.addKg : s.weight, b = bw ? s.weight : s.addKg; const has = (v: unknown) => v !== '' && v != null;
  const own = has(a) || !has(b); const raw: number | '' = has(a) ? (Number(a) || 0) : has(b) ? (Number(b) || 0) : '';
  const v = raw === '' ? '' : bw ? raw : Math.max(0, raw);
  return { kg: v === '' ? 0 : v, own, raw: v };
}
/** Ciężar do WYŚWIETLENIA (historia, edytor historii, opisy serii, CSV) — patrz loadOf. */
export const shownLoad = (ex: Exercise | undefined, s: Pick<WSet, 'weight' | 'addKg'>) => loadOf(ex, s).kg;
/** Obciążenie zewnętrzne serii do OBLICZEŃ: tylko pole właściwe dla obecnego sprzętu — kg (≥ 0) albo ±kg przy masie ciała (dodatnie = dociążenie,
 * ujemne = asysta gumą/maszyną — 0.5, wzór Alpha Progression). Seria zapisana pod innym sprzętem = 0 (patrz loadOf). */
export const setLoad = (ex: Exercise, s: Pick<WSet, 'weight' | 'addKg'>) => { const l = loadOf(ex, s); return l.own ? l.kg : 0; }; // runda 48: ujemny ciężar (np. asysta z szablonu po zmianie sprzętu) nie daje ujemnej objętości
/** Pole ciężaru w formularzu edytora historii: wartość, którą pokazuje ekran sesji (shownLoad), jako zapisane kg (lub '' gdy brak). */
export const loadFieldValue = (ex: Exercise | undefined, s: Pick<WSet, 'weight' | 'addKg'>): number | '' => loadOf(ex, s).raw;
/** Zapis ciężaru wpisanego w pole serii (trening w toku i edytor historii): do pola właściwego dla obecnego sprzętu; obce pole jest czyszczone —
 * wpis określa obciążenie w obecnym sprzęcie (runda 83b; dzięki temu da się też wyczyścić pole pokazujące obcą wartość). */
export function writeLoad(ex: Exercise | undefined, s: Pick<WSet, 'weight' | 'addKg'>, kg: number | '') {
  if (ex && isBW(ex)) { s.addKg = kg; s.weight = ''; } else { s.weight = kg === '' ? '' : Math.max(0, kg); s.addKg = ''; } /* runda 54: ciężar nieujemny */
}
/** Data RRRR-MM-DD jako lokalna północ (Date.parse traktuje ją jako UTC). */
export function localDateTs(iso: string): number { const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(iso ?? ''); return m ? new Date(+m[1], +m[2] - 1, +m[3]).getTime() : NaN; }
/** Obciążenie efektywne: dla ćwiczeń z masą ciała tylko ±kg (dociążenie; asysta = 0), dla reszty ciężar.
 * Runda 75 (Q-001, decyzja 02.10.2026): masa ciała nie wchodzi do żadnych obliczeń — rekord to „moja masa ciała” albo „masa ciała + 10 kg”. */
export function effectiveLoad(ex: Exercise, s: Pick<WSet, 'weight' | 'addKg'>): number { return Math.max(0, setLoad(ex, s)); }
/** Mnożnik objętości: per hantel / jednostronne ×2, łącznie ×1; ćwiczenia z masą ciała zawsze ×1. */
export const exMult = (ex: Exercise) => isBW(ex) ? 1 : loadMult(ex.loadMode ?? loadModeFor(ex.equipment, ex.name));
/** Seria robocza = odhaczona i nie rozgrzewkowa. */
export const isWorking = (s: WSet) => s.done && s.kind !== 'warmup' && !s.warmup;
/** Objętość jednej serii — JEDYNA definicja, używana w historii, Postępach, rekordach i PR (audyt 0.8.1). */
export function setVolume(ex: Exercise, s: WSet, impl?: Impl | null): number {
  const m = ex.metric ?? 'weight_reps'; if (!isWorking(s) || !hasWeight(m) || !hasReps(m)) return 0;
  return volOf(ex, effectiveLoad(ex, s), repsOf(s), impl);
}
/** Q-024 (decyzja właściciela 04.10.2026: „×2 dla dwóch linek”): blok na stacji (`impl` 'electric' — ciężar wpisywany NA STRONĘ) przy ćwiczeniu
 * biblioteki na dwie linki (katalog: CABLES 2) liczy objętość ×2 zamiast mnożnika trybu liczenia (RDL „na hantel” zostaje ×2, nie ×4). Wyciąg siłowni,
 * hantle, jedna linka, ćwiczenia własne i bloki bez zapisanego przyrządu — bez zmian. */
export const blockMult = (ex: Exercise, impl?: Impl | null) => !isBW(ex) && impl === 'electric' && ex.lib === true && own(CABLES as Record<string, 1 | 2>, ex.name) === 2 ? 2 : exMult(ex);
/** Rdzeń setVolume dla znanego obciążenia efektywnego i powtórzeń (runda 74: statystyki liczą je raz na serię). */
export const volOf = (ex: Exercise, load: number, reps: number, impl?: Impl | null) => blockMult(ex, impl) * dispKg(load) * reps;
/** Runda 73 (T13): w lb ciężar serii liczony tak, jak go widać (0,1 lb) — wpis 100 lb zapisany jako 45,35 kg dawał objętość 2999 lb zamiast 3000.
 * Zwraca kg odpowiadające dokładnie wyświetlanej liczbie funtów; w kg bez zmian. */
const dispKg = (kg: number) => wu() === 'lb' ? wOut(kg) * KG_PER_LB : kg;
/** Etykieta kolumny ciężaru zależna od trybu liczenia — a dla bloku na stacji z oporem elektrycznym/magnetycznym (`impl` 'electric') zawsze
 * NA STRONĘ (decyzja 03.10.2026 „ViShape na stronę”; audyt f132330/025ee6a, MEDIUM 2: wcześniej zmieniała się tylko lista ciężarów, a kolumna
 * mówiła „kg” / „kg/hantel”). Dotyczy każdego ćwiczenia na stacji, także „Przysiad z pasem (linki)”, „Cable Fly”, „RDL (hantle/linki)”.
 * `impl` — przyrząd bloku (WExercise.impl; blockImpl dopowiada go z miejsca, gdy blok go nie ma); bez przyrządu — jak przed P-003.
 * Objętość: Q-024 (blockMult) — ×2 na stacji przy ćwiczeniach na dwie linki. */
const perSide = (impl: Impl | null | undefined) => impl === 'electric';
/** Runda 69 (zrzuty): krótka etykieta kolumny tabeli — pełna zostaje dla VoiceOver. */
export const loadLabelShort = (ex: Exercise, impl?: Impl | null) => isBW(ex) ? `±${wu()}` : perSide(impl) ? t('{u}/str.', { u: wu() }) : (ex.loadMode === 'per_dumbbell' ? t('{u}/hant.', { u: wu() }) : ex.loadMode === 'unilateral' ? t('{u}/str.', { u: wu() }) : wu());
export const loadLabel = (ex: Exercise, impl?: Impl | null) => isBW(ex) ? `±${wu()}` : perSide(impl) ? t('{u}/stronę', { u: wu() }) : (ex.loadMode === 'per_dumbbell' ? t('{u}/hantel', { u: wu() }) : ex.loadMode === 'unilateral' ? t('{u}/strona', { u: wu() }) : wu());
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
type Prev = { workout: Workout; sets: WSet[]; blocks: WSet[][]; ids: (string | undefined)[] };
type PrevSets = { workout: Workout; sets: WSet[] };
/* Integracja 0.9.0 — JEDNA implementacja doboru „Poprzednio” dla trzech przypadków:
 *  - treningu w toku i startu z szablonu: cała historia ćwiczenia (previousFor/previousBlockFor),
 *  - decyzja 8c (03.10.2026, zastępuje 8a „najpierw to samo miejsce”): „Poprzednio” = ostatni raz TYM SAMYM PRZYRZĄDEM, gdziekolwiek
 *    (previousBlockFor z `impl` bloku),
 *  - docs/12 (audyt M3): trening wstecz i edycja — tylko sesje sprzed daty, bez edytowanej (previousBlockBefore; z `impl` — jak 8c).
 * Skanery (prevScan/byItemScan/byTplBlockScan) dostają listę treningów z ćwiczeniem (od najnowszego: cała historia albo zgodna z przyrządem)
 * i filtr sesji `ok`; selectBlock wybiera blok. Cache (memoHistBy, klucz: id ćwiczenia [+ IMPL_SEP + przyrząd]) tylko dla pełnej
 * historii (ok = ALL) — filtr daty zmienia się z każdym szkicem, więc skan „przed datą” idzie bez cache. */
type WOk = (w: Workout) => boolean;
const ALL: WOk = () => true;
/* Decyzja 8c: klucz cache = id ćwiczenia, opcjonalnie + IMPL_SEP + przyrząd. Bez przyrządu (zawsze, gdy nie ma miejsc) klucze i wyniki są dokładnie
 * takie jak przed P-003. */
const IMPL_SEP = '\u0001';
const splitImpl = (key: string): [string, Impl | undefined] => { const i = key.indexOf(IMPL_SEP); return i < 0 ? [key, undefined] : [key.slice(0, i), key.slice(i + 1) as Impl]; };
/** Decyzja 8c — reguła: sesja „pasuje” do przyrządu `impl`, gdy któryś jej blok tego ćwiczenia ma ten sam przyrząd ALBO przyrząd nieznany
 * (trening bez miejsca, dane sprzed schematu 15). Sesje zrobione na pewno innym przyrządem (np. RDL na linkach, gdy dziś hantle) są pomijane. */
const implWorkouts = memoHistBy((key: string): Workout[] => { const [exId, impl] = splitImpl(key); return workoutsWith(exId).filter(w => w.exercises.some(e => e.exerciseId === exId && (e.impl === undefined || e.impl === impl))); });
/** Treningi z ćwiczeniem od najnowszego: cała historia (impl undefined) albo tylko pasujące do przyrządu `impl`. */
const histOf = (exId: string, impl: Impl | undefined) => impl === undefined ? workoutsWith(exId) : implWorkouts(exId + IMPL_SEP + impl);
/** Audyt f132330/025ee6a (LOW 4): w wybranej sesji tylko bloki tym samym albo nieznanym przyrządem, gdy takie są — sesja z RDL hantlami
 * i na linkach nie miesza wartości obu przyrządów. `impl` tylko przy aktywnym filtrze 8c (są miejsca, blok ma przyrząd); bez niego — wszystkie bloki. */
const implBlocks = (bl: WExercise[], impl: Impl | undefined): WExercise[] => { if (!impl) return bl; const same = bl.filter(e => e.impl === undefined || e.impl === impl); return same.length ? same : bl; };
function prevScan(hist: readonly Workout[], exId: string, ok: WOk, impl?: Impl): Prev | null {
  let dropOnly: Prev | null = null;
  for (const w of hist) {
    if (!ok(w)) continue;
    // Runda 9: puste bloki (np. sama rozgrzewka) zostają na swoich miejscach — numeracja bloków się nie przesuwa.
    const bl = implBlocks(blocksOf(w, exId), impl); const blocks = bl.map(e => e.sets.filter(s => isWorking(s) && setHasValue(s)));
    // Runda 72 (T5): sesja z samymi drop setami nie zasłania ostatniego ciężaru roboczego — szukamy dalej (zapamiętując ją na wypadek braku innych).
    if (blocks.some(b => b.some(s => s.kind !== 'drop'))) return { workout: w, sets: blocks.flat(), blocks, ids: bl.map(e => e.tplItemId) };
    if (!dropOnly && blocks.some(b => b.length)) dropOnly = { workout: w, sets: blocks.flat(), blocks, ids: bl.map(e => e.tplItemId) };
  }
  return dropOnly;
}
const prevCache = memoHistBy((key: string): Prev | null => { const [exId, impl] = splitImpl(key); return prevScan(histOf(exId, impl), exId, ALL, impl); });
/** Serie robocze z ostatniego treningu z tym ćwiczeniem (wszystkie bloki razem). */
export function previousFor(exId: string): { workout: Workout; sets: WSet[] } | null { return prevCache(exId); }
/**
 * Runda 8: „Poprzednio” dla k-tego wystąpienia ćwiczenia w treningu/szablonie (to samo ćwiczenie dwa razy, np. ciężko
 * i lżej). Gdy poprzednio było kilka bloków, bierzemy blok o tym samym numerze (albo ostatni); gdy jeden — ten jeden.
 */
/** Runda 72 (T5): ostatni blok z tej samej pozycji szablonu (id pozycji jest unikalne) — dla ćwiczenia, które w szablonie występuje kilka razy. */
function byItemScan(hist: readonly Workout[], exId: string, itemId: string, ok: WOk, impl?: Impl): PrevSets | null {
  let dropOnly: PrevSets | null = null; /* T7: blok z samymi drop setami nie zasłania serii roboczych (jak prevScan) */
  for (const w of hist) { if (!ok(w)) continue; const b = w.exercises.find(e => e.exerciseId === exId && e.tplItemId === itemId && (!impl || e.impl === undefined || e.impl === impl)); /* LOW 4: blok innym przyrządem — szukamy dalej */ const sets = b ? b.sets.filter(s => isWorking(s) && setHasValue(s)) : []; if (sets.some(s => s.kind !== 'drop')) return { workout: w, sets }; if (sets.length && !dropOnly) dropOnly = { workout: w, sets }; }
  return dropOnly;
}
const prevByItem = memoHistBy((key: string): PrevSets | null => { const [k0, impl] = splitImpl(key); const [exId, itemId] = k0.split('|'); return byItemScan(histOf(exId, impl), exId, itemId, ALL, impl); });
/** T6: starsze dane bez id pozycji szablonu — k-ty blok ćwiczenia z ostatniej sesji tego samego szablonu (gdy miała ich kilka). */
function byTplBlockScan(hist: readonly Workout[], exId: string, tplId: string, k: number, ok: WOk, impl?: Impl): PrevSets | null {
  for (const w of hist) { if (!ok(w) || w.templateId !== tplId) continue; const bl = implBlocks(blocksOf(w, exId), impl).map(e => e.sets.filter(s => isWorking(s) && setHasValue(s)));
    if (bl.filter(b => b.length).length > 1) { const b = bl[Math.min(k, bl.length - 1)]; if (b.some(s => s.kind !== 'drop')) return { workout: w, sets: b }; } }
  return null;
}
const prevByTplBlock = memoHistBy((key: string): PrevSets | null => { const [k0, impl] = splitImpl(key); const [exId, tplId, ks] = k0.split('|'); return byTplBlockScan(histOf(exId, impl), exId, tplId, Number(ks), ALL, impl); });
/** `impl` (decyzja 8c, 03.10.2026): przyrząd bieżącego bloku (WExercise.impl). Gdy są miejsca i przyrząd jest znany — dobór jak niżej, ale tylko
 * z sesji pasujących do przyrządu (ten sam albo nieznany — implWorkouts), gdziekolwiek były, a w wybranej sesji tylko z bloków tym samym albo
 * nieznanym przyrządem (implBlocks — runda 82, LOW 4); gdy takiej sesji nie ma — ostatni trening w ogóle (wtedy bezpiecznik M3 przy wstawianiu:
 * prevFromOther traktuje znany, inny przyrząd jak inne miejsce — LOW 3).
 * Miejsce samo w sobie NIE ma znaczenia. Bez przyrządu (i zawsze bez miejsc) — dokładnie jak przed P-003. */
export function previousBlockFor(exId: string, k: number, n = 2, tplItemId?: string, tplId?: string | null, impl?: Impl | null, swapped = false): { workout: Workout; sets: WSet[] } | null {
  const ik = impl && getState().settings.locations.length && prevCache(exId + IMPL_SEP + impl) ? IMPL_SEP + impl : '';
  if (swapped) return (tplItemId ? prevByItem(exId + '|' + tplItemId + ik) : null) ?? selectBlock(prevCache(exId + ik), k, n, undefined, null, () => null, () => null); /* E2 pkt 3.6 */
  return selectBlock(prevCache(exId + ik), k, n, tplItemId, tplId, it => prevByItem(exId + '|' + it + ik), tp => prevByTplBlock(`${exId}|${tp}|${k}` + ik));
}
/** Docs/12: „Poprzednio” jak previousBlockFor, ale tylko z sesji rozpoczętych PRZED `before` (i bez treningu `excludeId` — edytowanego).
 * `impl` (decyzja 8c jak w previousBlockFor): gdy są miejsca i przyrząd bloku jest znany — dobór tylko z sesji sprzed daty pasujących do przyrządu
 * (histOf(exId, impl) z tym samym filtrem), a gdy takiej nie ma — z całej historii sprzed daty. Bez miejsc (albo bez `impl`) — dokładnie jak
 * przed P-003. */
export function previousBlockBefore(exId: string, before: number, k: number, n = 2, tplItemId?: string, tplId?: string | null, excludeId?: string | null, impl?: Impl | null, swapped = false): { workout: Workout; sets: WSet[] } | null {
  const ok: WOk = w => w.startedAt < before && w.id !== excludeId;
  let hist = workoutsWith(exId); let p: Prev | null = null; let fi: Impl | undefined; /* fi: filtr bloków (LOW 4) tylko razem z historią wg przyrządu */
  if (impl && getState().settings.locations.length) { const ih = histOf(exId, impl); p = prevScan(ih, exId, ok, impl); if (p) { hist = ih; fi = impl; } }
  if (!p) p = prevScan(hist, exId, ok);
  if (swapped) return (tplItemId ? byItemScan(hist, exId, tplItemId, ok, fi) : null) ?? selectBlock(p, k, n, undefined, null, () => null, () => null); /* E2 pkt 3.6 */
  return selectBlock(p, k, n, tplItemId, tplId, it => byItemScan(hist, exId, it, ok, fi), tp => byTplBlockScan(hist, exId, tp, k, ok, fi));
}
/* E2 (docs/14 pkt 3.6), `swapped` — blok-zamiennik (ma swappedFrom): pozycja szablonu (tplItemId) przechodzi na zamiennik B, więc „Poprzednio”
 * to najpierw ostatni blok B z TEJ pozycji szablonu („ostatnio w Domu zamiast sztangi: hantle”), a gdy go nie ma — zwykły dobór bez kontekstu
 * pozycji (bez reguł rund 11/13: pozycja należy do A, a B bywa też własną pozycją tego szablonu — wtedy reguła „pominięta pozycja” dawała null). */
/** Wybór bloku z ostatniej sesji `p` (wspólny dla previousBlockFor i previousBlockBefore); byItem/byTpl — skany w tej samej historii i z tym samym filtrem. */
function selectBlock(p: Prev | null, k: number, n: number, tplItemId: string | undefined, tplId: string | null | undefined, byItem: (itemId: string) => PrevSets | null, byTpl: (tplId: string) => PrevSets | null): PrevSets | null {
  if (!p) return null;
  // Runda 72 (T5): to samo ćwiczenie kilka razy w szablonie (ciężko + lżej) — gdy ostatnia sesja tego ćwiczenia była z innego treningu
  // (jeden blok), blok „lżejszy” dostawał ciężar z tamtej sesji. Najpierw ostatni blok tej samej pozycji szablonu.
  if (n > 1 && tplItemId && !(tplId && p.workout.templateId === tplId) && p.blocks.filter(b => b.length).length <= 1) { const own = byItem(tplItemId) ?? (tplId ? byTpl(tplId) : null); if (own) return own; if (k > 0) return null; }
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
export function progressionFor(ex: Exercise | undefined, repMax: number | null | undefined, prevSets: WSet[] | null | undefined, locationId?: string | null, prefer?: Impl): Progression | null {
  if (!ex || repMax == null || !getState().settings.progressHint || (ex.metric ?? 'weight_reps') !== 'weight_reps') return null;
  const work = (prevSets ?? []).filter(x => isWorking(x) && x.kind !== 'drop' && !(x.bandId && ex.bandAssistable)); /* seria z asystą gumą: obciążenie nieznane — bez podpowiedzi; guma oporowa (przegląd 06.10) — podpowiedź jak zwykle */
  if (!work.length || work.length !== (prevSets ?? []).filter(x => isWorking(x) && x.kind !== 'drop').length || work.some(x => repsOf(x) < repMax)) return null;
  const top = Math.max(...work.map(x => setLoad(ex, x))); const lb = wu() === 'lb';
  /* P-003 (E1, decyzja 4a; decyzja 7a z 03.10.2026 — bez bramki 10%): w miejscu z opisanym sprzętem „↑” to najbliższy większy DOSTĘPNY ciężar,
   * także przy dużym skoku (10 → 12 kg); bez przyrządu z ciężarem — powtórzenia. */
  const loc = locationById(locationId);
  if (loc && !isBW(ex)) { const L = loadsFor(ex, loc, prefer); /* E2 D5: przypięty przyrząd bloku */
    if (L.kind === 'none') return top <= 0 ? { kind: 'reps', reps: repMax + 1 } : null; /* np. wykroki bez hantli w domu; ciężar z innego miejsca — bez „↑” */
    if (L.kind === 'loads' && top <= 0) return { kind: 'reps', reps: repMax + 1 }; /* audyt H2: bez obciążenia (wykroki, russian twist) — powtórzenia, nie „+1 kg”, którego nie ma */
    if (L.kind === 'loads' && top > 0) { const nx = nextHeavier(L.loads, top); return nx == null ? null /* poprzedni ciężar ≥ największy dostępny */ : { kind: 'load', kg: nx }; } }
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
/** Opis serii („8@+10”, „100×5”). `calc` = ciężar do obliczeń (setLoad) — podpowiedź „Poprzednio” w treningu w toku, bo wpisanie podpowiedzi
 * przenosi tylko pole właściwe dla obecnego sprzętu (audyt 83b, MEDIUM 1b: „8@+42,5” przy pustym ±kg po wpisaniu); domyślnie widok historii
 * (shownLoad — jak ekran sesji i CSV). Jedna reguła w loadOf. */
export function setSummary(ex: Exercise, s: WSet, load: 'shown' | 'calc' = 'shown'): string {
  const b = s.bandId ? bandById(s.bandId) : null; const l = load === 'calc' ? setLoad(ex, s) : shownLoad(ex, s);
  const m = ex.metric ?? 'weight_reps';
  let core: string;
  if (m === 'time') core = fmtSec(Number(s.durationSec) || 0);
  else if (m === 'distance_time') core = `${fmtDist(Number(s.distanceM) || 0)} ${fmtSec(Number(s.durationSec) || 0)}`;
  else if (m === 'weight_time') core = `${fmtW(l, false)}${wu()}×${fmtSec(Number(s.durationSec) || 0)}`;
  else if (m === 'reps') core = `${s.reps || 0}`;
  else { core = isBW(ex) ? `${s.reps || 0}${l ? '@' + (l > 0 ? '+' : '') + fmtW(l, false) : ''}` : `${fmtW(l, false)}×${s.reps || 0}`; }
  return core + (b ? ` (${shortBand(b)})` : '') + (s.rpe !== '' && s.rpe != null ? (effortScale() === 'rir' ? ` RIR ${fmtNum(effortOut(Number(s.rpe)), 1)}` : ` @${fmtNum(Number(s.rpe), 1)}`) : '');
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
/* ---------- skala wysiłku (pakiet C, 08.10.2026): w danych zawsze RPE; RIR = 10 − RPE (Zourdos i in., JSCR 2016: „RPE-10 = 0-RIR, RPE-9 = 1-RIR”) ---------- */
export const effortScale = (): 'rpe' | 'rir' => (S?.settings.effortScale === 'rir' ? 'rir' : 'rpe');
export const effortLabel = () => (effortScale() === 'rir' ? 'RIR' : 'RPE');
const clamp10 = (v: number) => Math.min(10, Math.max(0, Math.round(v * 10) / 10));
/** Zapisane RPE → wartość pokazywana w bieżącej skali. */
export const effortOut = (rpe: number) => (effortScale() === 'rir' ? clamp10(10 - rpe) : rpe);
/** Wpisana wartość w bieżącej skali → RPE do zapisu ('' = puste). */
export const effortIn = (v: number | ''): number | '' => (v === '' ? '' : clamp10(effortScale() === 'rir' ? 10 - v : v));
/** Wartość pola wysiłku do wyświetlenia w polu edycji. */
export const effortField = (rpe: number | '' | null | undefined): number | '' => (rpe === '' || rpe == null ? '' : effortOut(Number(rpe)));
export const setHasValue = (s: WSet) => [s.weight, s.reps, s.durationSec, s.distanceM, s.addKg].some(v => v !== '' && v != null);
export function volume(w: Workout): number {
  let v = 0;
  w.exercises.forEach(e => { const ex = exById(e.exerciseId); if (!ex) return; e.sets.forEach(s => { v += setVolume(ex, s, e.impl); }); }); /* Q-024: przyrząd bloku */
  return v; // runda 6: bez zaokrąglania w kg — zaokrągla dopiero fmtVol w jednostce wyświetlania (w lb było ±1 lb)
}
const blankSet = (): WSet => ({ id: uid(), weight: '', reps: '', durationSec: '', distanceM: '', rpe: '', bandId: '', addKg: '', kind: 'normal', warmup: false, note: '', done: false, completedAt: null, actualRest: null });
/** Kopiuje wartości serii (bez statusu) — używane przy autouzupełnianiu z „poprzednio” i z poprzedniej serii. */
const copyVals = (from: Partial<WSet> | null | undefined): Partial<WSet> => from ? { weight: from.weight ?? '', reps: from.reps ?? '', durationSec: from.durationSec ?? '', distanceM: from.distanceM ?? '', bandId: from.bandId ?? '', addKg: from.addKg ?? '' } : {};

/* ---------- P-003: miejsca treningu ---------- */
export const locationById = (id: string | null | undefined): Location | undefined => id ? getState().settings.locations.find(l => l.id === id) : undefined;
/** Miejsce nowego treningu: miejsce szablonu (gdy istnieje), inaczej główne. Bez miejsc — brak (zachowanie sprzed P-003). */
export function startLocationId(preferred?: string | null): string | undefined {
  const s = getState().settings; if (!s.locations.length) return undefined;
  if (preferred && s.locations.some(l => l.id === preferred)) return preferred;
  return s.mainLocationId && s.locations.some(l => l.id === s.mainLocationId) ? s.mainLocationId : s.locations[0].id;
}
/** Audyt M3: ciężar spoza listy dostępnych w miejscu (np. 32 kg z siłowni, w domu max 24) — nie wstawiamy go do pól, zostaje w „Poprzednio”
 * (tylko gdy źródło jest „gdzie indziej” — prevFromOther; z sesji bez miejsca wartość zostaje, a ekran pokazuje dopisek — offListNote).
 * Runda 82b (MEDIUM 1d): porównanie wg jednostki wyświetlania (hasLoadShown) — w lb ciężar, który na ekranie jest pozycją z listy, jest na liście. */
export function offListAt(ex: Exercise | undefined, locationId: string | null | undefined, kg: unknown, prefer?: Impl): boolean {
  if (!ex || isBW(ex) || typeof kg !== 'number') return false; const loc = locationById(locationId); if (!loc) return false;
  const L = loadsFor(ex, loc, prefer); /* E2 D5: `prefer` — przypięty przyrząd bloku (pinnedImpl) */ return L.kind === 'loads' && !hasLoadShown(L.loads, kg);
}
/** Bezpiecznik M3 — JEDNA reguła „źródło wartości jest gdzie indziej” (start z szablonu, „Powtórz ostatni”, odhaczenie pustej serii, edytor historii):
 * sesja źródłowa w INNYM, ZNANYM miejscu niż trening (weryfikacja 2: sesje bez miejsca — nie) ALBO — audyt f132330/025ee6a (LOW 3) — blok źródłowy
 * zrobiony ZNANYM, INNYM przyrządem niż bieżący blok (np. „Poprzednio” z fallbacku 8c: RDL na stacji, dziś hantle w tym samym miejscu).
 * Wtedy ciężar spoza listy tego miejsca (offListAt) nie trafia do pól — puste ciężar i powtórzenia (kontrakt M3). Bez miejsca treningu — nigdy.
 * Sesja bez miejsca i bez przyrządu (0.8.5, web 0.3) to NIE „gdzie indziej” (HIGH z weryfikacji 2: wstrzymanie dawało serie bez ciężaru) —
 * jej wartość zostaje, a ekran treningu i edytor historii pokazują dopisek „ciężaru … nie ma tutaj” (audyt MEDIUM 1). */
export function prevFromOther(src: { workout: Workout; sets: WSet[] } | null | undefined, exId: string, locationId: string | null | undefined, impl: Impl | null | undefined): boolean {
  if (!src || !locationId) return false;
  if (src.workout.locationId && src.workout.locationId !== locationId) return true;
  return !!impl && src.workout.exercises.some(e => e.exerciseId === exId && e.impl !== undefined && e.impl !== impl && e.sets.some(x => src.sets.includes(x)));
}
/** Decyzja 8c: przyrząd ćwiczenia w miejscu treningu (lib/equipment.ts implAt) — zapisywany w bloku przy dodaniu/starcie; bez miejsca — brak. */
export function implAtLoc(ex: Exercise | undefined, locationId: string | null | undefined): Impl | undefined {
  const loc = locationById(locationId); return ex && loc ? implAt(ex, loc) : undefined;
}
/** Przyrząd bloku do etykiet (MEDIUM 2): zapisany w bloku, a gdy go nie ma — rozstrzygnięty dla miejsca treningu (bez miejsca — brak).
 * Tak liczy zakończona historia (szczegóły sesji, edycja zapisanego treningu): zapisany przyrząd to prawdziwy zapis, np. „kg/str.” na stacji,
 * także gdy miejsc już nie ma (docs/10, runda 82b). Trening w toku i nowy trening wstecz — liveBlockImpl. */
export const blockImpl = (e: Pick<WExercise, 'exerciseId' | 'impl'>, locationId: string | null | undefined): Impl | undefined => e.impl ?? implAtLoc(exById(e.exerciseId), locationId);
/** Runda 82b (weryfikacja 6ea37a3, LOW 4): przyrząd bloku do etykiet w treningu W TOKU (i w nowym treningu wstecz) — bez miejsc (np. wszystkie
 * usunięte w trakcie) przyrząd się nie liczy: etykiety jak bez miejsc, czyli jak w main („kg/hant.”, „kg”), a nie „kg/str.” z zapisanego `impl`. */
export const liveBlockImpl = (e: Pick<WExercise, 'exerciseId' | 'impl'>, locationId: string | null | undefined): Impl | undefined => getState().settings.locations.length ? blockImpl(e, locationId) : undefined;
/** Runda 82b (weryfikacja 6ea37a3, LOW 5): miejsce, którego listy ciężarów dotyczy blok. Blok, który po zmianie miejsca zachował przyrząd
 * (odhaczone serie — runda 82, L5), a tutaj ćwiczenie robi się INNYM przyrządem (albo żadnym), nie korzysta z listy tego miejsca (loadsFor nie
 * patrzy na przyrząd bloku): bez dopisku „nie ma tutaj”, bez „↑ spróbuj X” z tej listy i bez wstrzymywania ciężaru przy odhaczeniu — dla tego
 * bloku jak bez listy ciężarów. Blok bez przyrządu (nieznany) — lista miejsca jak dotąd. Bez miejsca treningu — undefined (jak przed P-003). */
export function listLocFor(e: Pick<WExercise, 'exerciseId' | 'impl' | 'implPinned'>, locationId: string | null | undefined): string | undefined {
  const loc = locationById(locationId); if (!locationId || !loc) return undefined;
  if (e.implPinned && e.impl) { const ex = exById(e.exerciseId); return ex && implsAt(ex, loc).includes(e.impl) ? locationId : undefined; } /* E2 D5: przypięty przyrząd, który jest w miejscu — lista tego przyrządu (loadsFor z prefer) */
  return e.impl !== undefined && e.impl !== implAtLoc(exById(e.exerciseId), locationId) ? undefined : locationId;
}
/** E2 D5: przyrząd wybrany ręcznie (implPinned) — `prefer` dla loadsFor/offListAt/progressionFor; bez przypięcia — undefined (dobór jak dotąd). */
export const pinnedImpl = (e: Pick<WExercise, 'impl' | 'implPinned'>): Impl | undefined => e.implPinned ? e.impl : undefined;
/** Runda 82b (weryfikacja 6ea37a3: MEDIUM 1 + LOW 3) — JEDNA reguła dopisku „ciężaru X nie ma tutaj — wpisz ciężar” dla ekranu treningu
 * i edytora historii (edit.prefilledOffList). Dopisek tylko, gdy:
 *  (i) trening ma miejsce, a blok korzysta z jego listy ciężarów (listLocFor — LOW 5);
 *  (ii) źródło „Poprzednio” jest „gdzie indziej” (prevFromOther: inne, znane miejsce albo znany, inny przyrząd — tam wartość jest wstrzymana,
 *       kontrakt M3) ALBO to sesja bez miejsca (0.8.5 / web 0.3 — wartość zostaje). To samo, znane miejsce tym samym / nieznanym przyrządem —
 *       nigdy (użytkownik zrobił tam ten ciężar, np. 23 kg przy liście samych parzystych);
 *  (iii) wartość KONKRETNEJ serii roboczej źródła (`srcOf(i)` dla serii i bloku — runda 82c: na obu ekranach srcSetAt, to samo mapowanie co
 *       wartości wstawiane przy starcie z szablonu; bez rozgrzewek i drop setów, > 0) nie jest osiągalna tutaj
 *       (offListAt — porównanie wg jednostki, hasLoadShown), a pole tej serii jest puste albo wciąż pokazuje tę wartość: wpisany ciężar
 *       (dostępny albo świadomie inny) chowa dopisek — liczone z bieżących pól, przy każdym wpisie.
 * `live(i)` — dodatkowy warunek (edytor: pole ciężaru wciąż wypełnione przez aplikację). Zwraca ciężar (kg) do dopisku albo null. */
export function offListNote(e: Pick<WExercise, 'exerciseId' | 'impl' | 'implPinned' | 'sets'>, src: { workout: Workout; sets: WSet[] } | null | undefined, locationId: string | null | undefined, srcOf: (i: number) => WSet | null | undefined, live?: (i: number) => boolean): number | null {
  const ex = exById(e.exerciseId); const loc = listLocFor(e, locationId); if (!ex || !src || !loc || isBW(ex)) return null;
  if (src.workout.locationId && !prevFromOther(src, ex.id, loc, e.impl)) return null;
  for (let i = 0; i < e.sets.length; i++) {
    const s = e.sets[i]; if (s.kind === 'warmup' || s.kind === 'drop' || (live && !live(i))) continue;
    const h = srcOf(i); const v = h && h.kind !== 'warmup' && h.kind !== 'drop' ? h.weight : '';
    if (typeof v !== 'number' || !(v > 0) || !offListAt(ex, loc, v, pinnedImpl(e))) continue;
    if (isEmpty(s.weight) || (typeof s.weight === 'number' && hasLoadShown([v], s.weight))) return v;
  }
  return null;
}
/** Runda 82c (weryfikacja 82a8a16, LOW 1): seria źródła dla serii `i` bloku — JEDNO mapowanie dla wartości wstawianych przez aplikację (start
 * z szablonu, edytor historii — prefillSrc) i dopisku „ciężaru X nie ma tutaj” (ekran treningu, edytor — offListNote): i-ta seria źródła bez drop
 * setów, a za końcem źródła — OSTATNIA (szablon 4 serie, poprzednio 2 → serie 3–4 dostają wartość serii 2). Wcześniej ekran treningu porównywał
 * serię i tylko z i-tą serią „Poprzednio” (hintFor), więc dopisek znikał po wpisaniu ciężaru w serie 1–2, choć serie 3–4 wciąż miały 32 kg spoza
 * listy. `perSet` false — zawsze ostatnia seria źródła (blok dodany w edytorze historii, prefillFor). Bez źródła — null. */
export function srcSetAt(sets: readonly WSet[] | null | undefined, i: number, perSet = true): WSet | null {
  const src = (sets ?? []).filter(x => x.kind !== 'drop'); return src.length ? src[perSet ? Math.min(Math.max(0, i), src.length - 1) : src.length - 1] : null;
}
/** Ustawia (albo usuwa) przyrząd bloku wg miejsca treningu. Bez miejsca pole nie powstaje — dane jak przed schematem 15. */
export function stampImpl(e: WExercise, locationId: string | null | undefined): WExercise {
  const i = implAtLoc(exById(e.exerciseId), locationId); if (i) e.impl = i; else delete e.impl; return e;
}
/** Zmiana miejsca treningu w toku (chip „📍”): tylko ta sesja; przyrządy bloków BEZ odhaczonych serii liczone od nowa dla nowego miejsca
 * (decyzja 8c) — blok z odhaczonymi seriami zachowuje przyrząd, którym je zrobiono (audyt f132330/025ee6a, LOW 5: wcześniej przemianowywało się
 * także zrobione serie, np. RDL na hantlach zapisywał się jako stacja). Wpisane wartości zostają (A-002), zmienia się filtr wyboru ćwiczeń,
 * plakietki braku sprzętu, podpowiedzi i „Poprzednio”. */
export function setActiveLocation(id: string) {
  const a = getState().active; if (!a || !locationById(id) || a.locationId === id) return;
  a.locationId = id; a.exercises.forEach(e => { if (!e.sets.some(x => x.done)) delete e.implPinned; }); /* E2 D5 (pkt 3.7.4): wybór dotyczył przyrządu w tamtym miejscu */ restampUntouched(a); save(a);
}
/** Reguła L5 (runda 82): przyrząd od nowa tylko dla bloków BEZ odhaczonych serii; blok z odhaczonymi seriami zachowuje przyrząd, którym je zrobiono. */
/** E2 D5: blok z przyrządem wybranym ręcznie (implPinned) zostaje przy nim, dopóki ten przyrząd jest w miejscu; gdy zniknął — przypięcie
 * zdjęte i przyrząd od nowa. */
function restampUntouched(a: Workout): boolean {
  const loc = locationById(a.locationId);
  let changed = false; a.exercises.forEach(e => { if (e.sets.some(x => x.done)) return;
    if (e.implPinned) { const ex = exById(e.exerciseId); if (e.impl && ex && loc && implsAt(ex, loc).includes(e.impl)) return; delete e.implPinned; }
    const before = e.impl; stampImpl(e, a.locationId); if (e.impl !== before) changed = true; }); return changed;
}
/** Runda 82c (weryfikacja 82a8a16, LOW 2): zmiana sprzętu (pozycja, opcja, ciężary) miejsca treningu W TOKU albo usunięcie tego miejsca — przyrządy
 * bloków bez odhaczonych serii liczone od nowa (ta sama reguła co setActiveLocation, L5). Wcześniej blok zostawał przy przyrządzie, do którego
 * miejsce już się nie rozstrzyga (np. RDL na stacji, a po wpisaniu ciężarów hantli — hantle), a listLocFor wyłączał wtedy dla niego listę
 * miejsca (bez „↑ spróbuj X” z listy, bez dopisku, etykieta „kg/str.”). Usunięte miejsce — blok bez przyrządu (jak bez miejsca). Wołane przez
 * lib/locations.ts (setEquip, setOpt, setLoad, deleteLocation, locationEdited — edytor ciężarów) PRZED zapisem; inne miejsce niż miejsce treningu
 * (albo trening bez miejsca, w tym zero miejsc) — nic. Zwraca, czy zmienił się przyrząd któregoś bloku. */
export function locationEquipChanged(locationId: string): boolean {
  const a = getState().active; if (!a || !a.locationId || a.locationId !== locationId) return false;
  return restampUntouched(a);
}
/* ---------- workout actions ---------- */
const newWorkout = (templateId: string | null, templateName: string, locPref?: string | null): Workout => { const st = getState(); const w: Workout = { ...base(st.ownerId), loggedBy: st.ownerId, sessionMode: 'solo', healthUUID: null, templateId, templateName, startedAt: Date.now(), finishedAt: null, note: '', exercises: [] }; const loc = startLocationId(locPref); if (loc) w.locationId = loc; return w; };
/**
 * E2 (docs/14 pkt 3.3): wartości nowych serii bloku — JEDNO miejsce dla startu z szablonu, zamiany ćwiczenia i cofnięcia zamiany (bezpiecznik M3 raz).
 * `kinds` — rodzaje nowych serii. Serie robocze (zwykłe, do upadku) dostają serię źródła `prevAll` (bez drop setów) o numerze serii roboczej
 * (srcSetAt — za końcem źródła ostatnia; numeracja od `from`, np. dalej od odhaczonych przy cofnięciu podziału); rozgrzewki i drop sety — puste.
 * Bez źródła: ciężar startowy pozycji szablonu (`startWeight` — tylko start z szablonu i cofnięcie do A; zamiana podaje '', bo to ciężar A).
 * Cel czasu (`targetSec`) — przy metryce z czasem, w seriach poza rozgrzewką.
 */
export function prefillSets(ex: Exercise, kinds: readonly SetKind[], prevAll: { workout: Workout; sets: WSet[] } | null, locationId: string | null | undefined, impl: Impl | null | undefined, targetSec: number | '', startWeight: number | '' = '', from = 0, pinned = false, rows?: readonly TRow[]): WSet[] {
  const src = prevAll ? prevAll.sets.filter(x => x.kind !== 'drop') : []; const m = ex.metric ?? 'weight_reps';
  const away = !!prevAll && prevFromOther(prevAll, ex.id, locationId, impl); let j = from;
  return kinds.map((kind, k) => {
    const work = kind !== 'warmup' && kind !== 'drop'; const row = rows?.[k];
    const p0 = work ? srcSetAt(src, j++) : null; const p = assistLost(ex, p0) ? null : p0; /* runda 72: jak przy odhaczaniu; runda 82c: wspólne mapowanie serii źródła (srcSetAt) */
    const s = { ...blankSet(), kind, warmup: kind === 'warmup', ...(p ? copyVals(p) : work ? { weight: (isBW(ex) || !hasWeight(m)) ? '' : (startWeight === '' ? '' : Math.max(0, Number(startWeight))), /* runda 48 */ addKg: isBW(ex) && hasWeight(m) ? startWeight : '' } : {}) } as WSet;
    // Cel czasu z szablonu wygrywa z czasem z poprzedniej sesji — inaczej stoper ucinał serię na starym wyniku (runda 2).
    // Czas z poprzedniej sesji zostaje tylko podpowiedzią („Poprzednio”) — jako wartość stawałby się celem stopera (runda 4).
    if (hasTime(m)) s.durationSec = kind !== 'warmup' && Number(targetSec) > 0 ? Number(targetSec) : ''; // runda 30: cel 0 = bez celu (jak w repeatLast)
    /* schemat 17: bez „ostatnio” — plan z wiersza szablonu (także rozgrzewki i drop sety); cel czasu z wiersza */
    if (row) { if (!p) { if (hasWeight(m)) { if (isBW(ex)) s.addKg = row.weight; else s.weight = row.weight === '' ? '' : Math.max(0, Number(row.weight)); } if (hasReps(m)) s.reps = row.reps; if (hasDistance(m)) s.distanceM = row.distanceM; if (row.bandId && usesBand(ex) && bandById(row.bandId)) s.bandId = row.bandId; }
      if (hasTime(m)) s.durationSec = Number(row.durationSec) > 0 ? Number(row.durationSec) : ''; } /* audyt 85364ad L3: czas tylko z wiersza (także rozgrzewki) */
    /* audyt M3 + weryfikacja 2: tylko źródło „gdzie indziej” (prevFromOther: inne, znane miejsce albo — LOW 3 — znany, inny przyrząd; treningi sprzed
     * miejsc — jak M8 — nie); wtedy bez ciężaru nie przepisujemy też powtórzeń — seria zostaje pusta, a nie „ciężar pusty + powtórzenia” */
    if (p && away && offListAt(ex, locationId, s.weight, pinned && impl ? impl : undefined)) { s.weight = ''; if (p.reps === s.reps) s.reps = ''; }
    return markPre(stripUnused(ex, s));
  });
}
/* ---------- szablon = nieaktywny trening (schemat 17, docs/17) ---------- */
/** Wiersze serii pozycji: zapisane albo — dla danych sprzed 17 — `sets` zwykłych serii z ciężarem startowym i celem czasu. */
export function tplRows(it: TemplateItem): TRow[] {
  if (it.rows?.length) return it.rows;
  const n = Math.max(1, Math.min(50, Math.floor(Number(it.sets) || 1)));
  return Array.from({ length: n }, (_, k) => ({ id: `${it.id}:${k}`, kind: 'normal' as SetKind, reps: '' as const, weight: it.startWeight ?? '', durationSec: Number(it.targetSec) > 0 ? Number(it.targetSec) : '' as const, distanceM: '' as const }));
}
const isWork = (k: SetKind) => k === 'normal' || k === 'failure';
/** Serie szablonu bez rozgrzewek — jedna reguła dla ekranu głównego, „Dodaj trening wstecz”, karty szablonu i listy Historii (scenariusz 06.10, krok 05b). */
export const tplWorkSets = (tpl: { items: TemplateItem[] }) => tpl.items.reduce((a, i) => a + tplRows(i).filter(r => r.kind !== 'warmup').length, 0);
/** Wiersze pozycji, gdy rodzaje serii bloku wciąż się z nimi zgadzają (cofnięcie zamiany — „wartości jak przy starcie”, audyt 85364ad M2). */
const rowsFor = (it: TemplateItem | undefined, kinds: readonly SetKind[]) => { if (!it) return undefined; const r = tplRows(it); return r.length === kinds.length && r.every((x, i) => x.kind === kinds[i]) ? r : undefined; };
/** Liczba serii, ciężar startowy i cel czasu z wierszy (reszta kodu — zamiana, trening wstecz — czyta te pola). */
function syncItem(it: TemplateItem) { if (!it.rows?.length) { delete it.rows; return; } it.sets = it.rows.length; const w = it.rows.find(r => isWork(r.kind)); it.startWeight = w ? w.weight : ''; it.targetSec = w && Number(w.durationSec) > 0 ? Number(w.durationSec) : ''; }
function rowsOf(it: TemplateItem): TRow[] { if (!it.rows?.length) it.rows = tplRows(it).map(r => ({ ...r })); /* audyt 85364ad M1: id wyliczone zostają — pola nie montują się od nowa */ return it.rows; }
const tplItem = (tpl: Template, itemId: string) => tpl.items.find(x => x.id === itemId);
/** „+ seria / + rozgrzewka / + drop set” w szablonie — jak w treningu (addSet): rozgrzewka pusta przed roboczymi; seria — wartości ostatniej. */
export function tplAddRow(tpl: Template, itemId: string, kind?: 'warmup' | 'drop') {
  const it = tplItem(tpl, itemId); if (!it) return; const rows = rowsOf(it); if (rows.length >= 50) return;
  if (kind === 'warmup') { const i = rows.findIndex(r => r.kind !== 'warmup'); rows.splice(i < 0 ? rows.length : i, 0, { id: uid(), kind: 'warmup', reps: '', weight: '', durationSec: '', distanceM: '' }); }
  else { const l = rows[rows.length - 1]; rows.push({ ...(l ?? { reps: '', weight: '', durationSec: '', distanceM: '' }), id: uid(), kind: kind ?? (l?.kind === 'drop' ? 'drop' : 'normal') }); }
  syncItem(it); save(tpl);
}
export function tplRemoveRow(tpl: Template, itemId: string, rowId?: string) {
  const it = tplItem(tpl, itemId); if (!it) return; const rows = rowsOf(it); if (rows.length <= 1) return;
  const i = rowId ? rows.findIndex(r => r.id === rowId) : rows.length - 1; if (i < 0) return; /* audyt 85364ad L4: tylko po id (id wyliczone zostają po zapisie — M1) */ rows.splice(i, 1); syncItem(it); save(tpl);
}
/** Guma wiersza szablonu — ten sam cykl co w treningu (poziomy z miejsca szablonu). */
export function tplCycleBand(tpl: Template, itemId: string, rowId: string) { const it = tplItem(tpl, itemId); if (!it) return; const r = rowsOf(it).find(x => x.id === rowId); if (!r) return; const n = nextBandId(r.bandId ?? '', startLocationId(tpl.locationId)); if (n) r.bandId = n; else delete r.bandId; syncItem(it); save(tpl); }
export function tplSetRow(tpl: Template, itemId: string, rowId: string, patch: Partial<Omit<TRow, 'id' | 'kind'>>) {
  const it = tplItem(tpl, itemId); if (!it) return; const r = rowsOf(it).find(x => x.id === rowId); if (!r) return; Object.assign(r, patch); syncItem(it); save(tpl);
}
export function tplSetKind(tpl: Template, itemId: string, rowId: string, kind: SetKind) {
  const it = tplItem(tpl, itemId); if (!it) return; const r = rowsOf(it).find(x => x.id === rowId); if (!r) return; r.kind = kind; syncItem(it); save(tpl);
}
/** Wczytanie/import: wiersze poprawne albo brak (pozycja wraca do `sets` + `startWeight`). */
function fixRows(it: any) {
  if (!Array.isArray(it.rows)) { delete it.rows; return; }
  const num = (v: unknown, min: number, max: number, int = true) => { const x = parseNum(v); return x == null ? '' : Math.min(max, Math.max(min, int ? Math.round(x) : x)); };
  it.rows = it.rows.filter(isObj).slice(0, 50).map((r: any) => ({ id: typeof r.id === 'string' && r.id ? r.id : uid(), kind: (SET_KINDS as readonly string[]).includes(r.kind) ? r.kind : 'normal',
    reps: num(r.reps, 0, 1000), weight: (v => v == null ? '' : kg2(snapL(v) as number))(parseNum(r.weight)), durationSec: num(r.durationSec, 0, 86400), distanceM: num(r.distanceM, 0, 1e6), ...(typeof r.bandId === 'string' && r.bandId ? { bandId: r.bandId } : {}) }));
  syncItem(it);
}
/** `deload` (decyzja 08.10.2026, B): około połowy serii roboczych na ćwiczenie, ciężary bez zmian, szablon bez zmian (lib/deload-sets). */
export function startFromTemplate(tpl: Template, opts?: { deload?: boolean }) {
  const st = getState(); const w = newWorkout(tpl.id, tpl.name, tpl.locationId);
  tpl.items.forEach((it, ii) => {
    const ex = exById(it.exerciseId); if (!ex || ex.archived) return; // runda 42: usunięte ćwiczenie (np. z importu) nie wraca do treningu
    // Runda 7: drop sety poprzedniej sesji nie są źródłem wartości dla zwykłych serii szablonu (jak przy odhaczaniu, runda 6).
    const impl = implAtLoc(ex, w.locationId); /* decyzja 8c: „Poprzednio” = ostatni raz tym samym przyrządem */
    const prevAll = previousBlockFor(it.exerciseId, occurrence(tpl.items, ii), occurrences(tpl.items, it.exerciseId), it.id, tpl.id, impl);
    const rows = tplRows(it); /* schemat 17: typy i plan z wierszy szablonu */
    const sets = prefillSets(ex, rows.map(r => r.kind), prevAll, w.locationId, impl, it.targetSec, it.startWeight, 0, false, rows);
    // Przerwa: ustawiona w pozycji szablonu wygrywa; puste pole w szablonie (null) = przerwa z ćwiczenia albo domyślna.
    w.exercises.push({ id: uid(), exerciseId: ex.id, restSec: typeof it.restSec === 'number' && it.restSec >= 0 ? it.restSec : restFor(ex), /* null w szablonie = przerwa z ćwiczenia */ repMin: it.repMin, repMax: it.repMax, groupId: it.groupId ?? null, sets: opts?.deload ? deloadSets(sets) : sets, tplItemId: it.id, ...(impl ? { impl } : {}) });
  });
  normalizeGroups(w.exercises);
  st.active = w; save(); flush();
}
export function startEmpty() { getState().active = newWorkout(null, ''); save(); flush(); }
export function repeatLast() {
  const last = finishedWorkouts()[0]; if (!last) return;
  // Powtarza to, co faktycznie zrobiono (także ćwiczenia dodane/usunięte w trakcie), a nie szablon, z którego wystartowano (runda 2).
  /* Integracja 0.9.0: ostatni trening bez locationId (sprzed miejsc, z importu), choć miejsca są — to „nieznane miejsce”, nie „inne miejsce”:
   * nowy trening dostaje miejsce główne, a wartości kopiujemy bez wstrzymywania ciężarów spoza listy (jak treningi sprzed miejsc
   * w startFromTemplate i przy odhaczaniu; docs/10, docs/12). Świadomie bez zmian — ekran treningu pokazuje wtedy dopisek „ciężaru … nie ma tutaj”
   * (runda 82, MEDIUM 1). Wstrzymanie tylko dla źródła „gdzie indziej” (prevFromOther: inne, znane miejsce albo znany, inny przyrząd — LOW 3). */
  const w = newWorkout(last.templateId, last.templateName, last.locationId);
  // Runda 22: cel czasu z pozycji szablonu, z której powstał blok (stary wynik nie staje się celem — runda 4).
  const tplOf = last.templateId ? getState().templates.find(x => x.id === last.templateId) : null;
  const tgt = (e: WExercise): number | '' => { const it = tplOf && e.tplItemId ? tplOf.items.find(x => x.id === e.tplItemId && x.exerciseId === e.exerciseId) : null; return it && Number(it.targetSec) > 0 ? Number(it.targetSec) : ''; };
  const keepPin = (e: WExercise) => { const ex = exById(e.exerciseId); const loc = locationById(w.locationId); return !!(e.implPinned && e.impl && ex && loc && last.locationId === w.locationId && implsAt(ex, loc).includes(e.impl)); };
  w.exercises = last.exercises.filter(e => { const ex = exById(e.exerciseId); return ex && !ex.archived; }).map(e => { const nw: WExercise = keepPin(e) ? { ...e, id: uid(), sets: [] } : stampImpl({ ...e, id: uid(), sets: [] }, w.locationId); if (!keepPin(e)) delete nw.implPinned; /* decyzja 8c: przyrząd w miejscu NOWEGO treningu (nie kopiowany z poprzedniego); E2 D5 (pkt 3.7.5): przyrząd wybrany ręcznie zostaje w tym samym miejscu, gdy wciąż tam jest */
    const away = prevFromOther({ workout: last, sets: e.sets }, e.exerciseId, w.locationId, nw.impl); /* weryfikacja 3 (L2) + LOW 3: jak przy starcie z szablonu — inne, znane miejsce albo znany, inny przyrząd */
    nw.sets = e.sets.map(s => ({ ...blankSet(), ...(assistLost(exById(e.exerciseId), s) ? {} : copyVals(s)), durationSec: s.kind === 'warmup' ? '' : tgt(e), kind: s.kind === 'failure' ? 'normal' : s.kind ?? (s.warmup ? 'warmup' : 'normal') /* T11: upadek to wynik, nie plan (jak addSet i szablon) */, warmup: s.warmup })).map(s => { const ex = exById(e.exerciseId); /* ciężar spoza listy tutaj z sesji „gdzie indziej” nie jest wstawiany (ani same powtórzenia) */
      if (away && offListAt(ex, w.locationId, s.weight, pinnedImpl(nw))) { s.weight = ''; s.reps = ''; }
      return markPre(stripUnused(ex, s)); });
    return nw; });
  normalizeGroups(w.exercises);
  getState().active = w; save(); flush();
}
export function addExerciseToActive(ex: Exercise) {
  const a = getState().active; if (!a) return;
  a.exercises.push(stampImpl({ id: uid(), exerciseId: ex.id, restSec: restFor(ex), repMin: null, repMax: null, groupId: null, sets: [blankSet()] }, a.locationId)); save(a);
}
/* ---------- E2: zamiana ćwiczenia w treningu w toku (docs/14 pkt 3) ---------- */
/** Pozycja szablonu, z której powstał blok (gdy trening ma szablon, a pozycja wciąż istnieje). */
const tplItemOf = (w: Workout, e: WExercise) => { const tpl = w.templateId ? getState().templates.find(x => x.id === w.templateId) : null; return tpl && e.tplItemId ? tpl.items.find(x => x.id === e.tplItemId) : undefined; };
/**
 * Zamiana ćwiczenia bloku `blockId` na `toExId` „tylko dziś” (W1, tabela docs/14 pkt 3.2). Wartości A NIGDY nie przechodzą do B (docs/10 pkt 4.6):
 *  - blok bez odhaczonych serii — zamiana W MIEJSCU: to samo id bloku, nowe serie (nowe id) tych samych rodzajów i w tej samej liczbie, wartości
 *    z „Poprzednio” B (prefillSets, reguła pkt 3.6); zakres powtórzeń, pozycja szablonu, superset i przerwa bloku (D4 a) bez zmian;
 *  - część serii odhaczona — PODZIAŁ: A zostaje z odhaczonymi seriami, nowy blok B tuż pod A dostaje resztę (splitFrom = A — rundy supersetu, cofnięcie);
 *  - wszystkie odhaczone — nic (przycisk ukryty, D3 a).
 * `swappedFrom` = oryginał (A→B→C zostaje A; powrót do oryginału go usuwa); przyrząd od nowa wg miejsca, bez przypięcia. `restSec` — przerwa
 * zamiennika per miejsce (W3, pkt 4.3), inaczej przerwa bloku. Zwraca id usuniętych serii (ekran zatrzymuje ich stoper) i id bloku B.
 */
export function swapBlock(blockId: string, toExId: string, opts: { restSec?: number | null; impl?: Impl } = {}): { goneSetIds: string[]; blockId: string } | null {
  const a = getState().active; const ei = a ? a.exercises.findIndex(x => x.id === blockId) : -1; if (!a || ei < 0) return null;
  const A = a.exercises[ei]; const B = exById(toExId); if (!B || B.archived || B.id === A.exerciseId) return null;
  const left = A.sets.filter(x => !x.done); if (!left.length) return null;
  const orig = A.swappedFrom ?? A.exerciseId; const it = tplItemOf(a, A);
  let blk: WExercise;
  if (left.length === A.sets.length) { blk = A; A.exerciseId = B.id; delete A.implPinned; }
  else {
    blk = { id: uid(), exerciseId: B.id, restSec: A.restSec, repMin: A.repMin, repMax: A.repMax, groupId: A.groupId, sets: [], splitFrom: A.id, ...(A.tplItemId ? { tplItemId: A.tplItemId } : {}) };
    A.sets = A.sets.filter(x => x.done); a.exercises.splice(ei + 1, 0, blk);
  }
  if (orig !== B.id) blk.swappedFrom = orig; else delete blk.swappedFrom;
  stampImpl(blk, a.locationId);
  { const loc = locationById(a.locationId); if (opts.impl && loc && implsAt(B, loc).includes(opts.impl)) { blk.impl = opts.impl; blk.implPinned = true; } } /* W3 P5a: przyrząd z zamiennika per miejsce */
  if (typeof opts.restSec === 'number' && opts.restSec >= 0) blk.restSec = Math.min(1800, Math.round(opts.restSec));
  blk.sets = prefillSets(B, left.map(x => x.kind), prevOfActiveBlock(a, blk), a.locationId, blk.impl, it?.targetSec ?? '', '', 0, !!blk.implPinned);
  save(a); return { goneSetIds: left.map(x => x.id), blockId: blk.id };
}
/**
 * E2 D5 (docs/14 pkt 3.7): „ten sam ruch, inny przyrząd” — to samo ćwiczenie, przyrząd `impl` wybrany ręcznie (implPinned), bez swappedFrom.
 * Wartości z „Poprzednio” tym przyrządem (8c) i z listą ciężarów tego przyrządu (M3). Blok z odhaczonymi seriami — podział jak przy zamianie
 * ćwiczenia (P2, odpowiedź właściciela 04.10.2026 w interpretacji z docs/14 pkt 9): odhaczone zostają przy starym przyrządzie, nowy blok dostaje resztę.
 * Przyrząd musi być w miejscu treningu (implsAt) i różny od bieżącego; wszystkie serie odhaczone — nic.
 */
export function swapImpl(blockId: string, impl: Impl): { goneSetIds: string[]; blockId: string } | null {
  const a = getState().active; const ei = a ? a.exercises.findIndex(x => x.id === blockId) : -1; if (!a || ei < 0) return null;
  const A = a.exercises[ei]; const ex = exById(A.exerciseId); const loc = locationById(a.locationId);
  if (!ex || !loc || impl === A.impl || !implsAt(ex, loc).includes(impl)) return null;
  const left = A.sets.filter(x => !x.done); if (!left.length) return null; const it = tplItemOf(a, A);
  let blk: WExercise;
  if (left.length === A.sets.length) blk = A;
  else {
    blk = { id: uid(), exerciseId: A.exerciseId, restSec: A.restSec, repMin: A.repMin, repMax: A.repMax, groupId: A.groupId, sets: [], splitFrom: A.id, ...(A.tplItemId ? { tplItemId: A.tplItemId } : {}), ...(A.swappedFrom ? { swappedFrom: A.swappedFrom } : {}) };
    A.sets = A.sets.filter(x => x.done); a.exercises.splice(ei + 1, 0, blk);
  }
  blk.impl = impl; blk.implPinned = true;
  const own = it && it.exerciseId === ex.id && !blk.swappedFrom ? it : undefined;
  blk.sets = prefillSets(ex, left.map(x => x.kind), prevOfActiveBlock(a, blk), a.locationId, impl, it?.targetSec ?? '', blk === A ? own?.startWeight ?? '' : '', 0 /* numeracja jak „Poprzednio” na ekranie (hintFor — od początku bloku) */, true, blk === A ? rowsFor(own, left.map(x => x.kind)) : undefined);
  save(a); return { goneSetIds: left.map(x => x.id), blockId: blk.id };
}
/** „↺ cofnij zamianę” (pkt 3.4): blok-zamiennik bez odhaczonych serii, a oryginał wciąż istnieje (nieusunięty). */
export const canUndoSwap = (e: WExercise) => { const A = e.swappedFrom ? exById(e.swappedFrom) : undefined; return !!A && !A.archived && !e.sets.some(x => x.done); };
/** Cofnięcie zamiany (pkt 3.4). Po podziale (blok A wciąż w treningu) serie B wracają na koniec A jako nowe serie A (numeracja serii roboczych dalej
 * od odhaczonych), B znika. Inaczej — w miejscu: wraca oryginał z wartościami jak przy starcie (przerwa pozycji szablonu, gdy blok z niej powstał). */
export function undoSwap(blockId: string): { goneSetIds: string[] } | null {
  const a = getState().active; const ei = a ? a.exercises.findIndex(x => x.id === blockId) : -1; if (!a || ei < 0) return null;
  const B = a.exercises[ei]; if (!canUndoSwap(B)) return null;
  const gone = B.sets.map(x => x.id); const kinds = B.sets.map(x => x.kind);
  /* audyt L1: scalenie z blokiem podziału tylko, gdy to oryginał (A) — po A→B w miejscu i B→C z podziałem C wraca do A, jak obiecuje „zamiast: A” */
  const P = B.splitFrom ? a.exercises.find(x => x.id === B.splitFrom && x.id !== B.id && x.exerciseId === B.swappedFrom) : undefined; const exP = P ? exById(P.exerciseId) : undefined;
  if (P && exP) {
    a.exercises.splice(ei, 1); normalizeGroups(a.exercises);
    const from = P.sets.filter(x => x.kind !== 'warmup' && x.kind !== 'drop').length;
    P.sets.push(...prefillSets(exP, kinds, prevOfActiveBlock(a, P), a.locationId, P.impl, tplItemOf(a, P)?.targetSec ?? '', '', from));
  } else {
    const A = exById(B.swappedFrom!)!; B.exerciseId = A.id; delete B.swappedFrom; delete B.implPinned; delete B.splitFrom; stampImpl(B, a.locationId);
    const it = tplItemOf(a, B); const own = it && it.exerciseId === A.id ? it : undefined;
    if (own) B.restSec = typeof own.restSec === 'number' && own.restSec >= 0 ? own.restSec : restFor(A);
    B.sets = prefillSets(A, kinds, prevOfActiveBlock(a, B), a.locationId, B.impl, own?.targetSec ?? '', own?.startWeight ?? '', 0, false, rowsFor(own, kinds));
  }
  save(a); return { goneSetIds: gone };
}
/* ---------- E2 W3: zamienniki per miejsce w szablonie (docs/14 pkt 4) ---------- */
/** Pozycja szablonu bloku (tylko z szablonu treningu) i miejsce treningu (tylko istniejące). */
function altCtx(w: Workout, e: WExercise): { tpl: Template; item: TemplateItem; loc: Location } | null {
  const tpl = w.templateId ? getState().templates.find(x => x.id === w.templateId) : undefined; const item = tpl && e.tplItemId ? tpl.items.find(x => x.id === e.tplItemId) : undefined;
  const loc = locationById(w.locationId); return tpl && item && loc ? { tpl, item, loc } : null;
}
/** Wpis, który zapisałby „Zawsze w” dla bloku: zamiennik B pozycji A (swappedFrom = ćwiczenie pozycji) albo A z przyrządem wybranym ręcznie (P5a). */
function altOfBlock(c: { item: TemplateItem; loc: Location }, e: WExercise): TemplateAlt | null {
  const pin = e.implPinned && e.impl ? { impl: e.impl } : {};
  if (e.swappedFrom === c.item.exerciseId && e.exerciseId !== c.item.exerciseId) return { locationId: c.loc.id, exerciseId: e.exerciseId, restSec: null, ...pin };
  if (!e.swappedFrom && e.exerciseId === c.item.exerciseId && e.implPinned && e.impl) return { locationId: c.loc.id, exerciseId: e.exerciseId, restSec: null, impl: e.impl };
  return null;
}
const sameAlt = (x: TemplateAlt | undefined, y: TemplateAlt) => !!x && x.exerciseId === y.exerciseId && (x.impl ?? null) === (y.impl ?? null);
/** „Zawsze w: <Miejsce>” (pkt 4.1, P1 a, P5a a): trening ma istniejące miejsce i szablon z pozycją bloku, blok zastępuje ćwiczenie pozycji (albo ma
 * przypięty przyrząd), a takiego wpisu dla tego miejsca jeszcze nie ma. */
export function canRememberAlt(w: Workout, e: WExercise): boolean {
  const c = altCtx(w, e); const n = c ? altOfBlock(c, e) : null; return !!c && !!n && !sameAlt(c.item.alternates?.find(x => x.locationId === c.loc.id), n);
}
/** Zapis zamiennika w pozycji szablonu bloku — tylko na wyraźne stuknięcie (decyzja 08:11 zachowana); wpis tego miejsca jest zastępowany (z przerwą). */
export function rememberAlt(blockId: string): boolean {
  const w = getState().active; const e = w?.exercises.find(x => x.id === blockId); if (!w || !e || !canRememberAlt(w, e)) return false;
  const c = altCtx(w, e)!; const n = altOfBlock(c, e)!; c.item.alternates = [...(c.item.alternates ?? []).filter(x => x.locationId !== c.loc.id), n];
  save(c.tpl); return true;
}
/** Podpowiedź zamiennika (pkt 4.2) — liczona przy renderze, nigdy nie zmienia bloku sama: blok z pozycji szablonu, jeszcze nie zamieniony, bez
 * odhaczonych serii i bez „✕”; wpis dla miejsca treningu z widocznym ćwiczeniem dostępnym w miejscu (przyrząd — obecny w miejscu i inny niż bloku). */
export function altHint(w: Workout, e: WExercise): TemplateAlt | undefined {
  const c = altCtx(w, e); if (!c || e.altSkip || e.swappedFrom || e.exerciseId !== c.item.exerciseId || e.sets.some(x => x.done)) return undefined;
  const alt = c.item.alternates?.find(x => x.locationId === c.loc.id); const B = alt ? exById(alt.exerciseId) : undefined; if (!alt || !B || B.archived) return undefined;
  if (alt.exerciseId === e.exerciseId) return alt.impl && alt.impl !== e.impl && implsAt(B, c.loc).includes(alt.impl) ? alt : undefined;
  return availability(B, c.loc).ok ? alt : undefined;
}
/** „Zamień” z podpowiedzi (pkt 4.3): zamiana w miejscu z przerwą wpisu (pusta — przerwa bloku, D4 a) i przyrządem wpisu (P5a). */
export function acceptAlt(blockId: string): { goneSetIds: string[]; blockId: string } | null {
  const w = getState().active; const e = w?.exercises.find(x => x.id === blockId); const alt = w && e ? altHint(w, e) : undefined; if (!w || !e || !alt) return null;
  if (alt.exerciseId !== e.exerciseId) return swapBlock(blockId, alt.exerciseId, { restSec: alt.restSec, impl: alt.impl });
  const r = swapImpl(blockId, alt.impl!); if (r && alt.restSec != null) { const b = w.exercises.find(x => x.id === r.blockId); if (b) { b.restSec = alt.restSec; save(w); } } return r;
}
/** „✕” przy podpowiedzi: tylko ten blok, tylko ten trening (M4). */
/** „Pomiń dziś” (docs/21 4a, 07.10.2026 wieczór): reszta bloku pominięta w tym treningu — szablon bez zmian; odhaczone serie zostają.
 * Timery serii bloku zatrzymuje ekran (jak przy usunięciu ćwiczenia — store nie zależy od lib/timer). */
export function skipExercise(blockId: string) { const w = getState().active; const e = w?.exercises.find(x => x.id === blockId); if (!w || !e) return; e.skipped = true; save(w); }
export function unskipExercise(blockId: string) { const w = getState().active; const e = w?.exercises.find(x => x.id === blockId); if (!w || !e) return; delete e.skipped; save(w); }
export function skipAlt(blockId: string) { const w = getState().active; const e = w?.exercises.find(x => x.id === blockId); if (!w || !e) return; e.altSkip = true; save(w); }
/** „Zapamiętaj” przerwę (⏱ w bloku): w bloku, który jest zamiennikiem tego miejsca — do wpisu zamiennika (dopisek właściciela do D4);
 * inaczej jak dotąd: pozycja szablonu, z której powstał blok (runda 10), i ćwiczenie. */
export function rememberRest(w: Workout, e: WExercise, n: number) {
  const ex = exById(e.exerciseId); if (!ex) return; e.restSec = n; ex.restSec = n;
  const c = altCtx(w, e); const mine = c ? altOfBlock(c, e) : null; const alt = c && mine ? c.item.alternates?.find(x => x.locationId === c.loc.id) : undefined;
  const tpl = w.templateId ? getState().templates.find(x => x.id === w.templateId) : null;
  if (alt && sameAlt(alt, mine!)) alt.restSec = n;
  else { const it = tpl && e.tplItemId ? tpl.items.find(x => x.id === e.tplItemId && x.exerciseId === ex.id) : undefined; if (it) it.restSec = n; }
  save(w, ex, tpl);
}
/** „+ rozgrzewka” / „+ drop set” (decyzja 05.10.2026): rozgrzewka pusta, przed seriami roboczymi; drop set na końcu z wartościami ostatniej. */
export function addSet(ei: number, kind?: 'warmup' | 'drop') {
  if (kind === 'warmup') { const a = getState().active!; const e = a.exercises[ei]; const i = e.sets.findIndex(s => s.kind !== 'warmup'); e.sets.splice(i < 0 ? e.sets.length : i, 0, { ...blankSet(), kind: 'warmup', warmup: true }); save(a); return; }
  addSetPlain(ei); if (kind === 'drop') { const a = getState().active!; const e = a.exercises[ei]; const ns = e.sets[e.sets.length - 1]; ns.kind = 'drop'; ns.warmup = false; save(a); }
}
function addSetPlain(ei: number) { const a = getState().active!; const e = a.exercises[ei]; const l = e.sets[e.sets.length - 1]; const fromWarmup = l?.kind === 'warmup'; e.sets.push({ ...blankSet(), ...(fromWarmup ? {} : copyVals(l)), ...(l?.done ? { durationSec: '' as const } : {}), ...(l?.noBand && !fromWarmup ? { noBand: true } : {}), kind: l?.kind === 'drop' ? 'drop' : 'normal' /* runda 72: po serii „do upadku” kolejna jest zwykła — upadek to wynik, nie plan */ }); { const ns = e.sets[e.sets.length - 1]; if (l?.pre && !fromWarmup) { const p: NonNullable<WSet['pre']> = {}; for (const k of PRE_KEYS) if (l.pre[k] !== undefined && ns[k] === l.pre[k]) p[k] = l.pre[k]; if (Object.keys(p).length) ns.pre = p; } /* weryfikacja: dodana seria idzie za zmianą jak pozostałe */ if (ns.bandId && !usedKeys(exById(e.exerciseId)).bandId) { if (Number(ns.addKg) < 0) ns.addKg = ''; ns.bandId = ''; } } /* runda 65: wyłączona asysta gumą — guma (i jej asysta) nie przechodzi */ save(a); } // czas zmierzonej serii nie staje się celem następnej (runda 3) // po rozgrzewce pusta seria: podpowie „Poprzednio”
/** „Usuń serię” z menu serii (przegląd 06.10, jak w szablonie): wybrana seria, nie zawsze ostatnia; ostatnia seria bloku zostaje. */
export function removeSetById(ei: number, setId: string) { const a = getState().active!; const e = a.exercises[ei]; const i = e?.sets.findIndex(x => x.id === setId) ?? -1; if (i < 0 || e.sets.length <= 1) return; e.sets.splice(i, 1); save(a); }
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
/** Ćwiczenie z gumą: asysta (bandAssistable) albo opór gumy (wymaganie sprzętu „bands”) — uwaga właściciela 06.10.2026. */
export const usesBand = (ex: Exercise | undefined | null): boolean => !!ex && (!!ex.bandAssistable || (ex.requires ?? []).some(g => g.includes('bands')) || (ex.recommended ?? []).includes('bands')); /* przegląd 06.10: także guma „zalecana” */
function usedKeys(ex: Exercise | undefined): Record<typeof VAL_KEYS[number] | 'bandId', boolean> {
  const m = ex?.metric ?? 'weight_reps'; const bw = !!ex && isBW(ex);
  return { weight: hasWeight(m) && !bw, addKg: hasWeight(m) && bw, reps: hasReps(m), durationSec: hasTime(m), distanceM: hasDistance(m), bandId: usesBand(ex) /* runda 11: guma tylko przy gumach; 06.10.2026: także opór gumy */ };
}
/** Czyści w serii pola, których metryka nie używa (wartości skopiowane ze starszej sesji). */
function stripUnused(ex: Exercise | undefined, s: WSet): WSet { const u = usedKeys(ex); for (const k of VAL_KEYS) if (!u[k]) (s as any)[k] = ''; /* P-001: zdjęta guma nie zabiera już ±kg (dawniej runda 49) */ if (!u.bandId || (s.bandId && !bandById(s.bandId))) s.bandId = ''; /* runda 16: usunięta guma nie wraca */ return s; }
const isEmpty = (v: unknown) => v === '' || v == null;
/** Runda 72 (T5): seria z asystą gumy, której nie da się odtworzyć (guma usunięta albo asysta gumą wyłączona) — jej powtórzenia bez asysty
 * zapisałyby trudniejsze ćwiczenie (fałszywy rekord), więc z takiej serii nie przepisujemy żadnych wartości. */
export const assistLost = (ex: Exercise | undefined, p: Partial<WSet> | null | undefined) => !!ex && isBW(ex) && !!p?.bandId && (!ex.bandAssistable || !bandById(p.bandId)); /* T6: także guma bez wpisanej asysty (kg); T7: tylko ćwiczenia z masą ciała — tam guma zmienia obciążenie */
/** „Poprzednio” dla bloku treningu w toku (ten sam dobór co na ekranie). */
function prevOfBlock(e: WExercise) {
  const a = getState().active; return a && a.exercises.includes(e) ? prevOfActiveBlock(a, e) : previousFor(e.exerciseId);
}
/** „Poprzednio” bloku `e` treningu `w` (w toku) — ten sam dobór na ekranie, przy odhaczaniu i przy zamianie: k-te wystąpienie ćwiczenia, pozycja
 * szablonu, przyrząd bloku (decyzja 8c), a dla zamiennika (swappedFrom) — reguła E2 pkt 3.6. */
export function prevOfActiveBlock(w: Workout, e: WExercise): { workout: Workout; sets: WSet[] } | null {
  const ei = w.exercises.indexOf(e); return previousBlockFor(e.exerciseId, occurrence(w.exercises, ei), occurrences(w.exercises, e.exerciseId), e.tplItemId, w.templateId, e.impl, !!e.swappedFrom);
}
function fillFromHints(e: WExercise, si: number) {
  const s = e.sets[si]; if (s.kind === 'warmup') return;
  // Ta sama seria robocza co w podpowiedzi „Poprzednio” (bez „dociągania” do ostatniej — ekran pokazuje wtedy „—”).
  const pb = prevOfBlock(e); const p = hintFor(pb?.sets, e.sets, si, exById(e.exerciseId));
  const act = getState().active; const offW = !!(p && prevFromOther(pb, e.exerciseId, act?.locationId, e.impl) && offListAt(exById(e.exerciseId), listLocFor(e, act?.locationId), p.weight, pinnedImpl(e))); /* audyt M3 (weryfikacja 2: tylko znane, inne miejsce; LOW 3: albo znany, inny przyrząd); runda 82b (LOW 5): lista miejsca tylko dla bloku tym przyrządem, którym robi się tu ćwiczenie (listLocFor) */
  // Guma z podpowiedzi tylko razem z jej asystą — gdy ±kg wpisano ręcznie (np. dociążenie), gumy nie dokładamy (runda 3).
  const hinted: Record<string, unknown> = {};
  // Runda 10: tylko pola, których używa bieżąca metryka ćwiczenia (metrykę mogła zmienić edycja ćwiczenia).
  const ex = exById(e.exerciseId); const m = ex?.metric ?? 'weight_reps'; const uses = usedKeys(ex);
  /* weryfikacja 2 (siatka bezpieczeństwa): ciężar z podpowiedzi wstrzymany, a pole ciężaru puste — nie wstawiamy nic (ani powtórzeń z podpowiedzi,
   * ani dolnej granicy zakresu); nigdy „ciężar pusty + powtórzenia z podpowiedzi”. Puste pola zostają dla zwykłej kontroli przy ✓ i „Zakończ”. */
  if (offW && uses.weight && isEmpty(s.weight)) { s.hinted = undefined; return; }
  if (p && !assistLost(ex, p)) { const kgEmpty = isEmpty(s.addKg); for (const k of VAL_KEYS) if (uses[k] && isEmpty(s[k]) && !isEmpty(p[k]) && !(k === 'weight' && offW) && !(k === 'addKg' && ((uses.bandId && s.bandId && s.bandId !== p.bandId) /* runda 66: ukryta guma nie blokuje +kg */ || (s.noBand && p.bandId) || (p.bandId && (!uses.bandId || !bandById(p.bandId)))))) { /* runda 47: guma zdjęta ręcznie — bez jej asysty */ /* runda 46: asysta innej gumy nie trafia do tej serii */ (s as any)[k] = p[k]; hinted[k] = p[k]; } if (uses.bandId && !s.bandId && !s.noBand && p.bandId && bandById(p.bandId) && kgEmpty) { s.bandId = p.bandId; hinted.bandId = p.bandId; } /* P-001/T-055: guma z podpowiedzi przychodzi bez kg */ }
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
  if (e.groupId) {
    /* E2 (docs/14 pkt 3.5): bloki rozdzielone zamianą (łańcuch splitFrom: A z odhaczonymi + zamiennik B) to JEDEN członek grupy — runda liczona
     * sumą ich serii; bez tego B1 po podziale A liczyło rundę 1 i odpalało przerwę w środku rundy 2. Bez podziałów członek = blok (jak dotąd). */
    const root = (x: WExercise) => { let c = x; const seen = new Set<string>(); while (c.splitFrom && !seen.has(c.id)) { seen.add(c.id); const p = a.exercises.find(y => y.id === c.splitFrom && y.groupId === x.groupId); if (!p) break; c = p; } return c.id; };
    const members = new Map<string, WExercise[]>(); for (const x of a.exercises) if (x.groupId === e.groupId) { const k = root(x); const l = members.get(k); if (l) l.push(x); else members.set(k, [x]); }
    const mineK = root(e); const mine = members.get(mineK)!;
    const work = (xs: WExercise[]) => xs.flatMap(x => x.sets.filter(y => y.kind !== 'warmup' && y.kind !== 'drop')); const r = work(mine).filter(y => y.done).length;
    const others = [...members].filter(([k]) => k !== mineK).map(([, v]) => v);
    /* Runda 75 (Q-006): ostatnia seria ostatniego ćwiczenia grupy zamyka rundę, także gdy wcześniejsze ćwiczenie ma pominiętą serię.
     * Warunek: każde zaległe ćwiczenie ma już choć jedną zrobioną serię — inaczej B1 przed A1 (także przy jednej serii) odpalałoby przerwę. */
    const closesGroup = !a.exercises.some((x, j) => j > ei && x.groupId === e.groupId && !mine.includes(x)) && !work(mine).some(y => !y.done) && others.every(x => work(x).some(y => y.done) || !work(x).some(y => !y.done));
    if (s.kind === 'warmup' ? a.exercises.some((x, j) => j > ei && x.groupId === e.groupId && !mine.includes(x) && x.sets.some(y => !y.done)) || others.some(x => work(x).filter(y => y.done).length > r) /* Q-006: rozgrzewka w trwającej rundzie — bez przerwy */
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
    if (a.pausedAt != null) resumeWorkout(now, a); /* 08.10.2026: odhaczenie serii w trakcie pauzy kończy pauzę (od godziny serii) */
    // Autouzupełnianie: tylko puste pola następnej, nieodhaczonej serii tego samego rodzaju (rozgrzewka nie nadpisuje roboczej).
    const nxt = e.sets[si + 1];
    // Runda 6: rodziny serii — rozgrzewka, drop set, reszta (zwykła/do upadku). Ciężar dropu nie trafia do serii roboczej i odwrotnie.
    const sameKind = nxt && setFam(nxt.kind) === setFam(s.kind);
    // Czas NIE przechodzi na następną serię: w serii czasowej to cel stopera (przejęcie ucinało kolejną serię — runda 2).
    if (nxt && !nxt.done && sameKind) {
      for (const k of VAL_KEYS) if (k !== 'durationSec' && !(k === 'addKg' && s.bandId && (usedKeys(exById(e.exerciseId)).bandId || Number(s.addKg) < 0)) /* runda 66: ukryta guma blokuje tylko swoją asystę */ && typed.has(k) && isEmpty(nxt[k])) (nxt as any)[k] = s[k];
      /* Runda 47: guma przechodzi na następną serię razem z wpisanym ±kg (P-001: guma sama nie wnosi kg), gdy:
         „Poprzednio” nic nie mówi o tej serii, guma nie została w niej zdjęta ręcznie, a seria nie ma własnego, innego obciążenia. */
      const nKg = isEmpty(nxt.addKg) || Number(nxt.addKg) === 0;
      if (s.bandId && usedKeys(exById(e.exerciseId)).bandId /* runda 65 */ && !nxt.noBand && !hintFor(prevOfBlock(e)?.sets, e.sets, si + 1, exById(e.exerciseId)) /* T7: ta sama podpowiedź co na ekranie */ && ((!nxt.bandId && nKg) || nxt.bandId === s.bandId)) {
        nxt.bandId = s.bandId; if (nKg && !isEmpty(s.addKg)) nxt.addKg = s.addKg;
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
export function markActivity(a: Workout, at: number) { if (Number.isFinite(at) && at > (Number(a.staleAck) || 0)) a.staleAck = Math.min(at, Date.now()); if (a.pausedAt != null && Number.isFinite(at)) resumeWorkout(at, a); /* 08.10.2026: odhaczenie serii kończy pauzę */ }
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
  closePause(w, w.finishedAt); /* 08.10.2026: pauza trwająca przy „Zakończ” kończy się z treningiem; pauza po końcu (auto-zapis na ostatniej serii) nie liczy się */
  w.exercises = w.exercises.map(e => { const o = { ...e, sets: e.sets.filter(s => s.done).map(s => { delete s.pre; return s; }) }; delete o.splitFrom; delete o.altSkip; delete o.skipped; /* E2: tylko trening w toku (jak migrate M3/M4) */ return o; }).filter(e => e.sets.length);
  normalizeGroups(w.exercises);
  st.workouts.push(w); st.active = null; st.userTouched = true; purgeOrphans(); save(w); flush();
  return w;
}
/* ---------- tydzień deload (pakiet C, 08.10.2026): etykieta tygodnia ustawiana przez użytkownika — bez automatycznego oznaczania z danych (brak walidacji,
 * docs/research/22); od decyzji A+B (08.10.2026) podpowiedź „zwykle co 4–6 tyg.” i mniej serii przy starcie — lib/deload.ts ---------- */
export const mondayKey = (ts: number) => { const d = new Date(ts); return localISODate(new Date(d.getFullYear(), d.getMonth(), d.getDate() - (d.getDay() + 6) % 7)); };
/** Czy tydzień zawierający `ts` jest oznaczony jako deload. */
export const isDeloadWeek = (ts: number) => !!S?.deloadWeeks?.includes(mondayKey(ts));
/** Oznaczenie / zdjęcie oznaczenia tygodnia zawierającego `ts`. */
export function toggleDeloadWeek(ts: number) {
  const st = getState(); const k = mondayKey(ts); const cur = st.deloadWeeks ?? [];
  const next = cur.includes(k) ? cur.filter(x => x !== k) : [...cur, k].sort(); if (next.length) st.deloadWeeks = next; else delete st.deloadWeeks; st.userTouched = true; save();
}
/* ---------- pauza treningu (decyzja właściciela 08.10.2026: czas pauzy odejmuje się od czasu trwania) ---------- */
/** Suma pauz w ms, łącznie z trwającą (do `now`). */
export const pausedTotal = (w: Workout, now = Date.now()) => (w.pauses ?? []).reduce((acc, [f, t]) => acc + Math.max(0, t - f), 0) + (w.pausedAt != null ? Math.max(0, now - w.pausedAt) : 0);
export const isPaused = (w: Workout | null | undefined) => w?.pausedAt != null;
/** Czas trwania bez pauz (s): zakończony — koniec − start − pauzy; w toku — do `now`. */
export const workoutDurSec = (w: Workout, now = Date.now()) => Math.max(0, ((w.finishedAt ?? now) - w.startedAt - pausedTotal(w, w.finishedAt ?? now)) / 1000);
/** Pauzy uporządkowane: liczby skończone, od < do, w granicach [start, koniec], scalone, gdy nachodzą (sanityzacja, edycja, koniec treningu). */
export function cleanPauses(raw: unknown, start: number, end: number | null): [number, number][] {
  const hi = end ?? Infinity; const out: [number, number][] = [];
  const list = (Array.isArray(raw) ? raw : []).map(p => Array.isArray(p) ? [Number(p[0]), Number(p[1])] : [NaN, NaN]).filter(([f, t]) => Number.isFinite(f) && Number.isFinite(t))
    .map(([f, t]) => [Math.max(start, f), Math.min(hi, t)] as [number, number]).filter(([f, t]) => t > f).sort((x, y) => x[0] - y[0]);
  for (const p of list) { const last = out[out.length - 1]; if (last && p[0] <= last[1]) last[1] = Math.max(last[1], p[1]); else out.push([Math.round(p[0]), Math.round(p[1])]); }
  return out;
}
const setPauses = (w: Workout, p: [number, number][]) => { if (p.length) w.pauses = p; else delete w.pauses; };
function closePause(w: Workout, end: number) {
  const p = [...(w.pauses ?? [])]; if (w.pausedAt != null) { if (end > w.pausedAt) p.push([w.pausedAt, end]); delete w.pausedAt; }
  setPauses(w, cleanPauses(p, w.startedAt, w.finishedAt));
}
/** Pauza treningu w toku (zegar treningu stoi; przerwa i stoper serii działają dalej). */
export function pauseWorkout(now = Date.now()) { const w = S?.active; if (!w || w.pausedAt != null) return; w.pausedAt = Math.max(w.startedAt, Math.min(now, Date.now())); save(w); }
/** Wznowienie: pauza [od, teraz] dopisana do listy. `at` — chwila wznowienia (odhaczenie serii w trakcie pauzy wznawia od godziny serii). */
export function resumeWorkout(at = Date.now(), w: Workout | null | undefined = S?.active) { if (!w || w.pausedAt == null) return; closePause(w, Math.max(w.pausedAt, Math.min(at, Date.now()))); save(w); }
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
/**
 * Zapis treningu z edytora historii: podmienia trening o id `replaceId` (edycja) albo dodaje nowy (trening wstecz) — w miejscu
 * zgodnym z datą startu. Jedna zmiana stanu: save() podbija histRev, więc rekordy, „Poprzednio”, wykresy, objętość tygodnia i CSV
 * liczą się od nowa. Trening w toku i timery nie są ruszane. false = edytowanego treningu już nie ma (usunięty w międzyczasie).
 */
export function putHistoryWorkout(w: Workout, replaceId: string | null): boolean {
  const st = getState();
  if (replaceId != null) { const i = st.workouts.findIndex(x => x.id === replaceId); if (i < 0) return false;
    /* weryfikacja 2 (L3): znacznik Apple Health i data utworzenia z treningu ZAPISANEGO teraz, nie ze szkicu — zapis do Zdrowia mógł skończyć się w trakcie edycji */
    w.healthUUID = st.workouts[i].healthUUID; w.createdAt = st.workouts[i].createdAt; st.workouts.splice(i, 1); }
  w.exercises.forEach(e => e.sets.forEach(s => { s.done = true; s.warmup = s.kind === 'warmup'; delete s.pre; delete s.hinted; delete s.edited; if (s.noBand !== true || s.bandId) delete s.noBand; /* jak migrate — kopia wraca 1:1 */ }));
  w.exercises = w.exercises.filter(e => e.sets.length); w.exercises.forEach(e => { delete e.splitFrom; delete e.altSkip; delete e.skipped; }); /* E2: tylko trening w toku */ normalizeGroups(w.exercises); delete w.staleAck;
  /* Audyt M4: start w tej samej milisekundzie co inna sesja (albo trening w toku) — rekordy liczą się „przed startem” (<), więc obie
   * dostałyby PR, a „Poprzednio” zależałoby od kolejności wstawienia. Przesuwamy start, koniec i godziny serii o 1 s, aż start jest unikalny. */
  { const taken = new Set([...st.workouts, ...(st.active ? [st.active] : [])].map(x => x.startedAt)); let bump = 0; while (taken.has(w.startedAt + bump)) bump += 1000;
    if (bump) { w.startedAt += bump; if (w.finishedAt != null) w.finishedAt += bump; if (w.pauses) w.pauses = w.pauses.map(([f, t]) => [f + bump, t + bump]); w.exercises.forEach(e => e.sets.forEach(s => { if (typeof s.completedAt === 'number') s.completedAt += bump; })); } }
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

/** Następna guma w cyklu przycisku gumy: brak → najcieńsza → … → najgrubsza → brak (wg poziomu). Jedno źródło dla treningu i edytora historii. */
/** Gumy (decyzja właściciela 05.10.2026): posiadane poziomy 1–7 w miejscu — lista jak ciężary hantli; zły zapis → poprawne wartości albo brak. */
export function cleanLevels(item: unknown, v: unknown): number[] | undefined {
  if (item !== 'bands' || !Array.isArray(v)) return undefined;
  return [...new Set(v.filter((x): x is number => typeof x === 'number' && Number.isInteger(x) && x >= 1 && x <= 7))].sort((p, q) => p - q);
}
/** Następna guma w cyklu przycisku serii. `locId` — miejsce treningu (audyt 7651f64 MEDIUM: edytor historii podaje miejsce edytowanego treningu). */
export function nextBandId(cur: string, locId: string | null | undefined = getState().active?.locationId): string {
  const st = getState(); const loc = locId ? locationById(locId) : undefined; const lv = loc?.equipment.find(e => e.item === 'bands' && !e.off)?.levels;
  const all = [...st.bands].sort((a, b) => a.level - b.level); const inRange = lv ? all.filter(b => lv.includes(b.level)) : all; const sorted = lv && !lv.length ? [] : inRange.length ? inRange : all; /* przegląd 06.10: wszystkie poziomy odznaczone = brak gum w miejscu */
  const cl = all.find(b => b.id === cur); const i = sorted.findIndex(b => b.id === cur);
  if (i < 0 && cl) { const nx = sorted.find(b => b.level > cl.level); return nx?.id ?? ''; } /* guma spoza miejsca → następna z miejsca */
  return i < 0 ? (sorted[0]?.id ?? '') : (i + 1 < sorted.length ? sorted[i + 1].id : '');
}
/**
 * Przycisk gumy w serii treningu w toku. P-001/T-055: guma = kolor + poziom 1–7 — wybór, zmiana ani zdjęcie gumy nie zmienia ±kg
 * (dawna automatyczna asysta −kg gumy usunięta). Zdjęcie gumy zapamiętuje „bez gumy” (runda 47: nie wraca z podpowiedzi).
 * usesKg = false (ćwiczenie bez pola ±kg): bez ukrytej wartości ±kg (runda 54).
 */
export function cycleBand(s: WSet, usesKg = true) {
  s.bandId = nextBandId(s.bandId); if (s.bandId) delete s.noBand; else s.noBand = true;
  if (!usesKg) s.addKg = ''; save(getState().active);
}
/** Usunięcie gumy (ekran Gumy). Runda 48: trening w toku nie trzyma usuniętej gumy w nieodhaczonych seriach; T13: odhaczone zostają
 * z gumą (pokażą „?”, jak w historii); P-001: ±kg zostaje — guma nie ma kilogramów. */
export function deleteBand(id: string) {
  const st = getState(); st.bands = st.bands.filter(x => x.id !== id);
  st.active?.exercises.forEach(e => e.sets.forEach(s => { if (s.bandId === id && !s.done) s.bandId = ''; })); save();
}

/** Trwały stan timera — zapisywany natychmiast (bez debounce), bo chodzi o przeżycie zabicia aplikacji. */
export function setTimerState(patch: Partial<State['timer']>) { const st = getState(); st.timer = { ...(st.timer ?? blankTimer()), ...patch }; rev++; emit(); persistNow().catch(() => {}); }

/* ---------- misc ---------- */
/** Runda 39: wspólny limit długości nazw (pola edycji mają maxLength = NAME_MAX). */
export const NAME_MAX = 80;
/** Runda 40: przycięcie do n jednostek UTF-16 bez rozcinania emoji (pary zastępczej) i bez spacji na końcu. */
export const clampName = (s: string, n = NAME_MAX) => { let r = s.slice(0, Math.max(0, n)); if (/[\uD800-\uDBFF]$/.test(r)) r = r.slice(0, -1); return r.trimEnd(); };
/* ---------- plan tygodnia: liczby i porządkowanie danych w jednym miejscu (audyt 0.10: A1, B3, B4 — migrate i lib/plan.ts) ---------- */
/** Nazwa planu (pole „Nazwa planu”, zapisane plany). */
export const PLAN_NAME_MAX = 40;
/** Najwyżej tyle zapisanych planów („Inne plany”) — ten sam limit w migrate i w UI (audyt 0.10 B3 / DAT-03). */
export const SAVED_PLANS_MAX = 50;
/** Najwyżej tyle odcinków historii planu (najstarsze odpadają) — co najmniej kilka lat zmian planu raz w tygodniu. */
export const PLAN_HISTORY_MAX = 520;
/** Audyt 0.10 B4 / DAT-06: nazwa planu — spacje złączone, bez spacji na brzegach, ≤ PLAN_NAME_MAX bez rozcinania emoji; idempotentne. */
export const cleanPlanName = (n: string) => clampName(n.replace(/\s+/g, ' ').trim(), PLAN_NAME_MAX);
const DATE_KEY = /^\d{4}-\d{2}-\d{2}$/;
/** 7 dni planu (id tekstem albo null) z dowolnej wartości. */
export const planDays = (d: unknown): (string | null)[] => Array.from({ length: 7 }, (_, i) => (Array.isArray(d) && typeof d[i] === 'string' && d[i] ? d[i] : null));
export const sameDays = (a: readonly (string | null)[], b: readonly (string | null)[]) => a.length === b.length && a.every((x, i) => x === b[i]);
/**
 * Historia planu (schemat 18, audyt 0.10 A1): odcinki z poprawną datą, rosnąco; ten sam dzień — wygrywa późniejszy wpis; kolejny odcinek
 * równy poprzedniemu znika (bez zmiany planu); odcinki „bez planu” na początku znikają (przed pierwszym planem i tak nie ma planu);
 * najwyżej PLAN_HISTORY_MAX najnowszych. Idempotentne.
 */
export function normPlanHistory(list: unknown): PlanSegment[] {
  const byFrom = new Map<string, PlanSegment>();
  for (const x of Array.isArray(list) ? list : []) if (isObj(x) && typeof x.from === 'string' && DATE_KEY.test(x.from)) byFrom.set(x.from, { from: x.from, days: planDays(x.days) });
  const out: PlanSegment[] = [];
  for (const sg of [...byFrom.values()].sort((a, b) => (a.from < b.from ? -1 : a.from > b.from ? 1 : 0))) {
    if (!out.length && !sg.days.some(Boolean)) continue;
    if (out.length && sameDays(out[out.length - 1].days, sg.days)) continue;
    out.push(sg);
  }
  return out.slice(-PLAN_HISTORY_MAX);
}
/** Zmiany pojedynczych dni: klucze-daty, wartości id tekstem albo null (wolne). */
export const cleanOverrides = (x: unknown): Record<string, string | null> => (isObj(x) ? Object.fromEntries(Object.entries(x).filter(([k, v]) => DATE_KEY.test(k) && (v === null || (typeof v === 'string' && !!v)))) as Record<string, string | null> : {});
/** Nowy odcinek od dnia `from` (zmiana planu dziś): odcinki od tego dnia i późniejsze ustępują nowemu. */
export const appendPlanSegment = (list: PlanSegment[], from: string, days: (string | null)[]): PlanSegment[] => normPlanHistory([...list.filter(x => x.from < from), { from, days: planDays(days) }]);
export function newExercise(name = t('Nowe ćwiczenie')): Exercise { const e: Exercise = { ...base(getState().ownerId), name: clampName(name), group: 'inne', equipment: 'inne', metric: 'weight_reps', loadMode: 'total', restSec: null, restWarmupSec: null, muscles: [], secondaryMuscles: [], bandAssistable: false, tempo: '', notes: '', ...equipFields('', 'inne', false) }; getState().exercises.push(e); save(); return e; }
/** Zmiana sprzętu ustawia domyślny tryb liczenia (wcześniej zostawał stary — np. ×2 dla masy ciała). */
export function setEquipment(e: Exercise, eq: Exercise['equipment']) { if (e.equipment === eq) return; /* runda 40: ten sam chip nie resetuje ustawień */ e.equipment = eq; e.loadMode = loadModeFor(eq, e.name); e.loadSource = LOAD_SOURCE_BY_EQUIPMENT[eq]; /* P-003: źródło obciążenia za sprzętem */
  /* weryfikacja 3 (L5): ćwiczenie z biblioteki po zmianie sprzętu nie trzyma wymagań katalogu (np. hantle przy ruchu na linkach) — bez wymagań (zawsze dostępne),
   * catalogRev 'user' (start aplikacji go nie nadpisze katalogiem) */
  if (e.lib) { e.requires = []; e.recommended = []; delete e.implements; e.catalogRev = 'user'; }
  /* macierz niezmienników 06.10 (L5): bloki tego ćwiczenia w treningu w toku bez odhaczonych serii dostają przyrząd wg nowego sprzętu — jak przy zmianie sprzętu miejsca */
  const a = getState().active; if (a && a.exercises.some(x => x.exerciseId === e.id)) { restampUntouched(a); save(a); }
  save(e); }
/** „Przywróć …” (lista ćwiczeń, wybór, zamiana): bez pola archived — tak samo jak po wczytaniu danych (migrate usuwa archived ≠ true; macierz niezmienników 06.10). */
export function restoreExercise(e: Exercise) { delete e.archived; save(e); }
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
  st.templates.forEach(tpl => { tpl.items = tpl.items.filter(i => i.exerciseId !== id); normalizeGroups(tpl.items);
    tpl.items.forEach(i => { if (!i.alternates) return; i.alternates = i.alternates.filter(x => x.exerciseId !== id); if (!i.alternates.length) delete i.alternates; }); }); /* E2 W3: zamiennik z usuniętym ćwiczeniem znika (jak M6) */
  if (exerciseUsed(id)) e.archived = true; else st.exercises = st.exercises.filter(x => x.id !== id);
  save(e); flush();
}
/** Ćwiczenia widoczne na listach i w wyborze (bez zarchiwizowanych). */
export const visibleExercises = () => getState().exercises.filter(e => !e.archived);
export function newTemplate(): Template { const tpl: Template = { ...base(getState().ownerId), name: tr('Nowy szablon'), items: [] }; getState().templates.push(tpl); save(); return tpl; }
export function dupTemplate(id: string): Template { const src = getState().templates.find(x => x.id === id)!; const c: Template = JSON.parse(JSON.stringify(src)); Object.assign(c, base(getState().ownerId)); delete c.archived; /* kopia z archiwum trafia na listę */ const suf = ' ' + tr('(kopia)'); c.name = clampName(src.name, NAME_MAX - suf.length) + suf; /* runda 39: limit nazwy */ const ids = new Map<string, string>(); c.items.forEach(i => { i.id = uid(); if (i.groupId) { if (!ids.has(i.groupId)) ids.set(i.groupId, uid()); i.groupId = ids.get(i.groupId)!; } }); getState().templates.push(c); save(); return c; }
/* ---------- foldery i archiwum szablonów (docs/21 4a, 07.10.2026 wieczór) — zmienia tylko użytkownik ---------- */
export const FOLDER_MAX = 40;
function cleanFolder(v: string) { return v.replace(/\s+/g, ' ').trim().slice(0, FOLDER_MAX).trim(); }
const byName = (a: string, b: string) => a.localeCompare(b, locale());
/** Foldery użyte w szablonach (także zarchiwizowanych), alfabetycznie wg języka aplikacji. */
export function templateFolders(): string[] { return [...new Set(getState().templates.map(t => t.folder).filter((f): f is string => !!f))].sort(byName); }
/** Lista startu i ekranu Szablony: najpierw bez folderu (kolejność dodania), potem foldery alfabetycznie; bez zarchiwizowanych. */
export function templateGroups(): { folder: string | null; items: Template[] }[] {
  const live = getState().templates.filter(t => !t.archived); const out: { folder: string | null; items: Template[] }[] = [];
  const loose = live.filter(t => !t.folder); if (loose.length) out.push({ folder: null, items: loose });
  for (const f of [...new Set(live.map(t => t.folder).filter((x): x is string => !!x))].sort(byName)) out.push({ folder: f, items: live.filter(t => t.folder === f) });
  return out;
}
export function archivedTemplates(): Template[] { return getState().templates.filter(t => t.archived); }
/** Audyt 0.10 UX-10: notatka szablonu (np. linijka wysiłku z generatora) — jedna linia tekstu, ≤ TEMPLATE_NOTE_MAX; pusta = brak. */
export const TEMPLATE_NOTE_MAX = 200;
function cleanNote(v: string) { return Array.from(v.replace(/\s+/g, ' ').trim()).slice(0, TEMPLATE_NOTE_MAX).join('').trim(); } /* po znakach — bez przecinania emoji (DAT-06) */
export function setTemplateNote(tpl: Template, v: string) { const n = cleanNote(v); if (n) tpl.note = n; else delete tpl.note; save(tpl); }
export function setTemplateFolder(tpl: Template, name: string | null) { const f = name ? cleanFolder(name) : ''; if (f) tpl.folder = f; else delete tpl.folder; save(tpl); }
export function setTemplateArchived(tpl: Template, on: boolean) { if (on) tpl.archived = true; else delete tpl.archived; save(tpl); }
export function deleteTemplate(id: string) { const st = getState(); st.templates = st.templates.filter(x => x.id !== id); save(); flush(); }
/** Włączanie/wyłączanie modułu (ADR-011). 'training' jest zawsze włączony. */
export function setModule(m: keyof State['settings']['modules'], on: boolean) { const s = getState().settings; s.modules[m] = m === 'training' ? true : on; save(); }
/** Reset: nowe dane startowe w języku, który będzie widoczny po resecie (ustawienie wraca na „auto” = język telefonu). */
export function resetAll() { replaceState(seedState(detectLang())); clearRecovery(); flush(); }
export type { WExercise };
/** Tylko dla testów: czy store jest zainicjowany. */
export const isReadyForTests = () => !!S;
/** Tylko dla testów: czyści stan modułu (bez dotykania bazy). */
export function __resetForTests() { newerSchema = null; persistQueue = Promise.resolve(); fullDirty = true; persistSeq = 0; S = null; db = null; rev = 0; histRev += 1; persistError = null; recovery = null; if (saveTimer) clearTimeout(saveTimer); saveTimer = null; listeners.clear(); }
/**
 * Widok skupiony (styl „Tuleja”, decyzja właściciela 07.10.2026; docs/21 pkt 3): seria „teraz” = pierwsza nieodhaczona seria w kolejności treningu.
 * Superset — naprzemiennie: spośród ćwiczeń grupy to, którego pierwsza nieodhaczona seria ma najniższy numer (remis — wcześniejsze ćwiczenie),
 * czyli A1, B1, A2, B2… Bloki usuniętych ćwiczeń (bez wpisu w bibliotece) są pomijane. null = wszystko odhaczone (albo pusty trening).
 */
export function focusSet(w: Workout | null | undefined): { ei: number; si: number } | null {
  if (!w) return null; const firstOpen = (i: number) => exById(w.exercises[i].exerciseId) && !w.exercises[i].skipped ? w.exercises[i].sets.findIndex(s => !s.done) : -1; /* „Pomiń dziś” — blok poza kartą */
  for (let ei = 0; ei < w.exercises.length; ei++) {
    const si = firstOpen(ei); if (si < 0) continue; const g = w.exercises[ei].groupId; if (!g) return { ei, si };
    let best = { ei, si };
    for (let j = ei + 1; j < w.exercises.length; j++) { if (w.exercises[j].groupId !== g) continue; const k = firstOpen(j); if (k >= 0 && k < best.si) best = { ei: j, si: k }; }
    return best;
  }
  return null;
}
