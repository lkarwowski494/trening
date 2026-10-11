/*
 * Fasada magazynu stanu aplikacji. Podział lib/store.ts na moduły według dziedzin (decyzja właściciela 11.10.2026): zmiana w jednej
 * dziedzinie dotyka jednego modułu w lib/state/, a publiczne API zostaje tutaj bez zmian — `import * as store from '@/lib/store'` i importy
 * nazwane działają jak dawniej. Fasada tylko przepisuje nazwy (właściwości danych, nie gettery — jest.spyOn(store, …) w testach działa).
 * Mapa modułów (warstwy od dołu; moduł importuje tylko moduły z niższych warstw — bez cykli):
 *   util, time (czyste funkcje) → db (plik bazy) → core (stan w pamięci, zapis, subskrypcje) → effort, sets, setvals (seria i ćwiczenie)
 *   → places, history, bands, groups, pause → weekplan, bodymass, templates, exercises → start, live, swap, finish (trening)
 *   → migrate-records, migrate-catalog, migrate (wczytanie i import danych) → settings, boot (start aplikacji, import, reset).
 * Nowa funkcja publiczna: w module dziedziny (export) i jej nazwa w odpowiedniej liście niżej.
 */
import { t, tIn, applyLang, detectLang, fold, isLang, deviceUnit } from './i18n';
import { applyUnit, snapLegacyLb } from './units';
import { applyTheme } from './theme';
import { seedState, uid, defaultModules, defaultSettings, metricFor, loadModeFor, loadMult, blankTimer, musclesFor, hasTime, hasReps, hasWeight, hasDistance, METRICS, DEFAULT_REST, GROUPS, LIB, SCHEMA_VERSION, LOCAL_OWNER, MODULES, SET_KINDS, SINGLE_IMPLEMENT, equipFields, libExercise, LIB_EXTRA_REVS, LIB_EXTRA_REV, LIB_MUSCLE_FIXES, LIB_FIELD_FIXES, LIB_RENAMED, LIB_MERGED, LIB_RETIRED, libExtraRevOf, LIB_BASE_NAMES_V1, IMPLS, own, type State, type Exercise, type Template, type TemplateAlt, type Location, LIB_KEYS, LIB_DISPLAY_NAME, catalogKey, libKeyCandidates, BODY_MASS_MAX, BODY_MASS_LOG_MAX, type LoadMode } from './seed';
import { equipById, blankLoad, fillGym, GYM_FILL, fillOpts, OPT_FILL, fillEquip2, EQUIP_FILL2 } from './equipment';
import { sanitizeLoadSpec } from './loads';
import { CATALOG, CATALOG_REV } from './catalog.generated';
import * as utilMod from './state/util';
import * as timeMod from './state/time';
import * as dbMod from './state/db';
import * as coreMod from './state/core';
import * as effortMod from './state/effort';
import * as setsMod from './state/sets';
import * as setvalsMod from './state/setvals';
import * as placesMod from './state/places';
import * as historyMod from './state/history';
import * as bandsMod from './state/bands';
import * as groupsMod from './state/groups';
import * as pauseMod from './state/pause';
import * as weekplanMod from './state/weekplan';
import * as bodymassMod from './state/bodymass';
import * as templatesMod from './state/templates';
import * as exercisesMod from './state/exercises';
import * as startMod from './state/start';
import * as liveMod from './state/live';
import * as swapMod from './state/swap';
import * as finishMod from './state/finish';
import { S, setDb, db, setNewerSchema, seqAtLeast, setS, setRecovery, recovery, setSavedDrafts, persistNow, bump, emit } from './state/core';
import { openDb } from './state/db';
import { parseNum, kg2, arr, idOf, isObj, intIn, tsOf } from './state/util';
import { cleanNote, cleanFolder, syncItem } from './state/templates';
import { PRE_KEYS } from './state/setvals';
import { setPauses } from './state/pause';
import { realDay, DATE_KEY } from './state/time';

export const { NAME_MAX, REPS_MAX, REST_MAX, clampName } = utilMod;
export const {
  localDateTs, fmtSec, fmtDist, reps, fmtDur, fmtDayKey, fmtDate, fmtTime, localISODate, tzOffsetAt, cleanTz, wallTs, fromWallTs, workoutDay,
  mondayKey
} = timeMod;
export const { dbDirectory, copyKv } = dbMod;
export type { KvDb } from './state/db';
export const {
  CFG_KEYS, applyCfg, flush, DRAFTS_KEY, registerDraftStore, draftsChanged, takeSavedDrafts, getPersistError, getRecovery, clearRecovery,
  getNewerSchema, markDraft, isDraftObj, save, saveCfg, getState, useStore, useTick, usePrefsTick, getHistRev, getRev, refreshViews,
  useForegroundTick, useHistTick, useCfgTick, memoHist, memoHistBy, setTimerState, isReadyForTests, __resetForTests
} = coreMod;
export const { effortScale, effortLabel, RPE_MIN, RPE_MAX, RIR_MAX, RPE_LIGHT, effortOut, effortText, effortIn, effortField } = effortMod;
export const {
  exById, bandById, isBW, repsOf, loadOf, shownLoad, setLoad, loadFieldValue, writeLoad, effectiveLoad, exMult, isWorking, workCount, workSetCount,
  workingSets, setVolume, blockMult, volOf, loadLabelShort, loadLabel, restFor, bandColor, shortBand, bandA11y, setSummary, setScore, setHasValue,
  volume, usesBand
} = setsMod;
export const { copyVals, stripUnused, assistLost } = setvalsMod;
export const {
  locationById, startLocationId, offListAt, prevFromOther, implAtLoc, blockImpl, liveBlockImpl, listLocFor, pinnedImpl, offListNote, srcSetAt,
  stampImpl, setActiveLocation, locationEquipChanged
} = placesMod;
export const {
  finishedWorkouts, blocksOf, workoutsWith, previousFor, previousBlockFor, previousBlockBefore, hintFor, progressionFor, occurrence, occurrences,
  prevOfActiveBlock
} = historyMod;
export type { Progression } from './state/history';
export const { cleanLevels, nextBandId, cycleBand, deleteBand } = bandsMod;
export const { normalizeGroups, groupLabels, linkWithNext, unlink, moveItem, removeItem, blockRanges, moveBlockOf, moveInGroup } = groupsMod;
export type { Grouped } from './state/groups';
export const { pausedTotal, isPaused, workoutDurSec, cleanPauses, pauseWorkout, resumeWorkout } = pauseMod;
export const {
  isDeloadWeek, toggleDeloadWeek, PLAN_NAME_MAX, SAVED_PLANS_MAX, PLAN_HISTORY_MAX, DELOAD_WEEKS_MAX, cleanPlanName, planDays, sameDays,
  normPlanHistory, cleanOverrides, appendPlanSegment, setPlanHintHidden
} = weekplanMod;
export const { bodyMassLog, bodyMassOn, bodyMassFor, latestBodyMass, addBodyMass, removeBodyMass } = bodymassMod;
export const {
  tplRows, tplWorkSets, tplAddRow, tplRemoveRow, tplCycleBand, tplSetRow, tplSetKind, newTemplate, dupTemplate, FOLDER_MAX, templateFolders,
  templateGroups, archivedTemplates, TEMPLATE_NOTE_MAX, setTemplateNote, setTemplateFolder, setTemplateArchived, deleteTemplate
} = templatesMod;
export const {
  useExercisesTick, newExercise, setEquipment, exerciseEdited, restoreExercise, exerciseInHistory, exerciseUsed, deleteExercise, visibleExercises,
  exercisesInUse, inCoreList, libShowAll, setLibShowAll
} = exercisesMod;
export const { prefillSets, startableItem, repeatBlocks, startFromTemplate, startEmpty, repeatLast, deloadTail, addExerciseToActive } = startMod;
export const { addSet, removeSetById, removeSet, removeExercise, findSet, restAfter, roundRest, toggleDone, focusSet } = liveMod;
export const {
  swapBlock, swapImpl, canUndoSwap, undoSwap, canRememberAlt, rememberAlt, altHint, acceptAlt, skipExercise, unskipExercise, skipAlt, rememberRest
} = swapMod;
export const {
  STALE_ASK_MS, STALE_AUTO_MS, lastActivity, staleRef, staleKind, hasWorkDone, staleSince, ackStale, markActivity, resolveColdStopwatch,
  autoFinishStale, finishWorkout, cancelWorkout, deleteWorkout, emptySet, setHasResult, putHistoryWorkout
} = finishMod;
export type { WExercise } from './seed';


export async function init(): Promise<void> {
  if (S) return;
  setDb(await openDb());
  await db!.execAsync('CREATE TABLE IF NOT EXISTS kv (k TEXT PRIMARY KEY, v TEXT NOT NULL)');
  const row = await db!.getFirstAsync<{ v: string }>('SELECT v FROM kv WHERE k = ?', 'state');
  let needsPersist = false;
  /* Audyt 0.10 J1 (DAT-05): baza zapisana przez nowszą wersję (wyższy schemat) — niczego nie migrujemy ani nie zapisujemy; ekran startu
   * mówi „zaktualizuj aplikację” i pozwala wysłać surowe dane (readRawData). */
  if (row) { let ver = 0; try { ver = Number(JSON.parse(row.v)?.schemaVersion) || 0; } catch {} if (ver > SCHEMA_VERSION) { setNewerSchema(ver); throw Object.assign(new Error(t('Dane z nowszej wersji aplikacji — zaktualizuj aplikację')), { newerSchema: ver }); } }
  if (row) {
    try {
      const raw = JSON.parse(row.v); const before = raw?.schemaVersion;
      // Runda 69: nowszy trening w toku i timer z klucza „live” (zapisywanego przy każdej zmianie serii).
      try { const lv = await db!.getFirstAsync<{ v: string }>('SELECT v FROM kv WHERE k = ?', 'live'); const l = lv ? JSON.parse(lv.v) : null;
        const fresher = l && typeof l === 'object' && (Number.isFinite(l.seq) && Number.isFinite(raw?.saveSeq) ? l.seq >= raw.saveSeq : Number(l.at) >= (Number(raw?.metaUpdatedAt) || 0));
        if (raw && typeof raw === 'object' && fresher && 'active' in l) { raw.active = l.active; if (l.timer && typeof l.timer === 'object') raw.timer = l.timer; }
        seqAtLeast(Math.max(Number(raw?.saveSeq) || 0, Number(l?.seq) || 0)); } catch {}
      // PERF-03 (A): nowsza konfiguracja (szablony, ustawienia, plany) z małego klucza „cfg” — zapisanego bez przepisywania całej historii.
      try { const cr = await db!.getFirstAsync<{ v: string }>('SELECT v FROM kv WHERE k = ?', 'cfg'); const c = cr ? JSON.parse(cr.v) : null;
        if (applyCfg(raw, c)) seqAtLeast(Number(c.seq) || 0); } catch {}
      setS(migrate(raw)); needsPersist = before !== SCHEMA_VERSION;
    } catch {
      // Nie nadpisujemy jedynej kopii danych: odkładamy ją pod osobny klucz i startujemy od czystego stanu.
      const key = `state_corrupt_${Date.now()}`;
      await db!.runAsync('INSERT OR REPLACE INTO kv (k, v) VALUES (?, ?)', key, row.v);
      // Runda 69 (T1): trening w toku z klucza „live” trafia do tej samej kopii (osobny klucz) — wysyłany razem z nią.
      // T1b/T4a: stary „live” nie może nałożyć się na nowy, czysty stan przy następnym starcie — numer zapisu podbijamy najpierw,
      // a kopia i usunięcie mają osobne try (nieudana kopia nie zostawia „live” w bazie).
      let lv: { v: string } | null = null; try { lv = await db!.getFirstAsync<{ v: string }>('SELECT v FROM kv WHERE k = ?', 'live'); } catch {}
      if (lv) { try { seqAtLeast(Number(JSON.parse(lv.v)?.seq) || 0); } catch {}
        try { await db!.runAsync('INSERT OR REPLACE INTO kv (k, v) VALUES (?, ?)', key + '_live', lv.v); } catch {}
        try { await db!.runAsync('DELETE FROM kv WHERE k = ?', 'live'); } catch {} }
      /* PERF-03 (A): tak samo „cfg” — nie może nałożyć się na czysty stan (numer zapisu wyżej, klucz usunięty, kopia obok nieczytelnego zapisu) */
      try { const cv = await db!.getFirstAsync<{ v: string }>('SELECT v FROM kv WHERE k = ?', 'cfg'); if (cv) { try { seqAtLeast(Number(JSON.parse(cv.v)?.seq) || 0); } catch {}
        try { await db!.runAsync('INSERT OR REPLACE INTO kv (k, v) VALUES (?, ?)', key + '_cfg', cv.v); } catch {} try { await db!.runAsync('DELETE FROM kv WHERE k = ?', 'cfg'); } catch {} } } catch {}
      setRecovery({ key, at: Date.now() }); setS(null);
      // Runda 34: znacznik w bazie — komunikat i wysłanie kopii działają także po ponownym uruchomieniu.
      // Runda 35: gdy wcześniejsza kopia wciąż czeka na wysłanie, zostaje ona (zwykle to w niej jest prawdziwa historia).
      try { const old = await db!.getFirstAsync<{ v: string }>('SELECT v FROM kv WHERE k = ?', 'recovery'); const o = old ? JSON.parse(old.v) : null;
        if (o && typeof o.key === 'string' && await db!.getFirstAsync('SELECT k FROM kv WHERE k = ?', o.key)) setRecovery({ key: o.key, at: Number(o.at) || 0 }); } catch {}
      await db!.runAsync('INSERT OR REPLACE INTO kv (k, v) VALUES (?, ?)', 'recovery', JSON.stringify(recovery)).catch(() => {});
    }
  }
  /* UX2-03 = DAT2-06 (audyt kontrolny 1, wariant A): szkice edycji ćwiczenia i szablonu z osobnego klucza — lib/draft.ts przywraca je po starcie */
  setSavedDrafts(null); if (S) { try { const dr = await db!.getFirstAsync<{ v: string }>('SELECT v FROM kv WHERE k = ?', DRAFTS_KEY); setSavedDrafts(dr ? dr.v : null); } catch {} }
  if (!recovery) { try { const m = await db!.getFirstAsync<{ v: string }>('SELECT v FROM kv WHERE k = ?', 'recovery'); const r = m ? JSON.parse(m.v) : null; if (r && typeof r.key === 'string') setRecovery({ key: r.key, at: Number(r.at) || 0 }); } catch {} }
  if (!S) { setS(seedState(detectLang())); S!.settings.unit = deviceUnit(); /* H4 (audyt 0.10 UX-12): świeża instalacja — jednostka z regionu (en-US → lb) */ needsPersist = true; }
  applyPrefs();
  if (needsPersist) await persistNow().catch(() => {});
  bump(true); emit();
}

/** Przenosi język i jednostkę z ustawień do warstwy wyświetlania. Wołane po starcie, imporcie i zmianie ustawień. */
export function applyPrefs() { if (!S) return; applyLang(S.settings.language); applyUnit(S.settings.unit); applyTheme(S.settings.theme); }
const LIB_NAMES = LIB_BASE_NAMES_V1; /* audyt 04.10 (LOW): reguła danych sprzed schematu 10 tylko dla pierwszych 125 nazw (pierwsza wersja — także później scalone i przemianowane) — własne ćwiczenie „Svend Press” z web 0.3 nie staje się biblioteką */

/** Pola Settings znane tej wersji — pola domyślne plus opcjonalne (nowe pole opcjonalne dopisz tutaj, inaczej jego zła wartość z importu
 * przejdzie jak nieznane ustawienie); reszta zostaje bez zmian — audyt 0.10 J1. */
const SETTINGS_KEYS = new Set([...Object.keys(defaultSettings()), 'effortScale', 'planReminder', 'libShowAll']);
/** Ustawienia przeniesione poza Settings — nie zostają jako „nieznane” (J1): masa ciała bez daty → State.bodyMassLog (fala 2 audytu 0.10). */
const MOVED_SETTINGS = new Set(['bodyMass']);
const PROTO_KEYS = new Set(['__proto__', 'constructor', 'prototype']);
/** Ustawienia usunięte w schemacie 13 (runda 75, Q-001: masa ciała poza obliczeniami) — w danych sprzed 13 odpadają jak dotąd. */
const LEGACY_SETTINGS_13 = new Set(['bodyWeightKg']);
/** Runda 55: wartości zapisane przez starą wersję z funtów przyciągamy tylko w danych sprzed schematu 11 — nowsze kg (np. 45,359237) zostają co do cyfry. */
let legacyLb = false;
function setLegacyLb(v: boolean) { legacyLb = v; }
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
  const key: string = catalogKey(e) ?? e.name; /* E2 (audyt 0.10): katalog po kluczu — przemianowane ćwiczenie biblioteki dalej dostaje odświeżone wymagania */
  const fromCatalog = e.lib === true && Object.prototype.hasOwnProperty.call(CATALOG, key);
  if (!Array.isArray(e.requires) || (fromCatalog && e.catalogRev !== 'user' && e.catalogRev !== CATALOG_REV)) { const f = equipFields(key, e.equipment, e.lib === true); delete e.implements; delete e.pattern; delete e.catalogRev; Object.assign(e, f); return; }
  if (!fromCatalog && e.catalogRev !== 'user') delete e.catalogRev;
  const strs = (a: unknown): string[] => Array.isArray(a) ? [...new Set(a.filter((x: unknown): x is string => typeof x === 'string' && !!x))] : [];
  /* audyt (LOW): uszkodzona grupa wymagań czyni ćwiczenie MNIEJ dostępnym — grupa bez żadnej poprawnej możliwości = „?” (niespełnialna) */
  e.requires = e.requires.map((g: unknown) => { const v = strs(g); return v.length ? v : ['?']; }); e.recommended = strs(e.recommended);
  if (!LOAD_SOURCES.includes(e.loadSource)) e.loadSource = equipFields(key, e.equipment, e.lib === true).loadSource;
  if (!PATTERNS.has(e.pattern)) delete e.pattern; if (e.implements !== 1 && e.implements !== 2) delete e.implements;
}
/** P-003: miejsca treningu z importu — znane pozycje sprzętu i opcje, poprawne opisy ciężarów; miejsce główne zawsze istnieje, gdy są miejsca. */
function fixLocations(s: any, stamp: (o: any) => void, language: unknown): { locations: Location[]; mainLocationId: string | null; pickerShowAll: boolean } {
  const seen = new Set<string>(); const locations: Location[] = [];
  const list = arr(s.locations); list.forEach(l => stamp(l)); freshIds(list); /* DAT2-04 (= DAT-08): powtórzone id → „~n” (jak uniqueIds), bez gubienia drugiego miejsca */
  for (const l of list) {
    seen.add(l.id);
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
/** Krok migracji: ćwiczenia (nazwy, metryka, pola, klucz katalogu, kroki katalogu). Kolejność i treść jak w migrate. */
function migrateExercises(raw: any, owner: string, stamp: (o: any, fallbackTs?: number) => void) {
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
    const nm: string = e.lib === true && typeof e.libKey === 'string' && LIB_KEYS.has(e.libKey) ? e.libKey : e.name; /* E2: wartości z katalogu po kluczu */
    // Runda 16: wartości spoza słownika / nieliczbowe (np. z ręcznie edytowanego backupu) wracają do domyślnych.
    if (!(METRICS as readonly string[]).includes(e.metric)) { const lib = metricFor(nm); const g = logged.get(idOf(e.id) ?? ''); e.metric = g && ((g.w && !hasWeight(lib)) || (g.r && !hasReps(lib))) ? (g.w ? 'weight_reps' : 'reps') : lib; }
    if (!['per_dumbbell', 'total', 'unilateral'].includes(e.loadMode)) e.loadMode = loadModeFor(e.equipment, nm);
    for (const k of ['restSec', 'restWarmupSec']) { const v = parseNum(e[k]); e[k] = v == null || v < 0 ? null : Math.min(1800, Math.round(v)); }
    if (!Array.isArray(e.muscles)) { const [a, b] = musclesFor(nm, e.group); e.muscles = a; e.secondaryMuscles = b; }
    if (!Array.isArray(e.secondaryMuscles)) e.secondaryMuscles = []; e.muscles = e.muscles.filter((x: unknown) => typeof x === 'string'); e.secondaryMuscles = e.secondaryMuscles.filter((x: unknown) => typeof x === 'string');
    delete e.bodyweightPct; /* schemat 13 (runda 75, Q-001): masa ciała nie wchodzi do obliczeń — udział % usunięty */
    if (e.lib === undefined && LIB_NAMES.has(e.name) && (Number(raw.schemaVersion) || 0) < 10) e.lib = true; /* runda 52/56: tylko dane sprzed schematu 10 — stała granica, nie ruchome SCHEMA_VERSION (podbicie do 11 cofało poprawkę) */ if (e.lib !== true) delete e.lib;
    /* E2 (audyt 0.10, X-03): klucz katalogu — prawidłowy zostaje; brak → nazwa kanoniczna, gdy nazwa jest w katalogu (dane sprzed klucza);
     * przemianowane przed poprawką — odzyskiwane niżej (libKeyFromFields), inaczej bez klucza. Ćwiczenia własne nie mają klucza. */
    /* Research biblioteki (09.10.2026): klucz przemianowany → nowy (nazwa równa dawnemu kluczowi też — wyniki wstecz bez zmian, E2); klucz scalony
     * albo usunięty zostaje do retireCatalog niżej (przenosi dane i znika). Idempotentne: nowy klucz nie jest już dawnym. */
    if (e.lib === true) { const k0 = typeof e.libKey === 'string' && (LIB_KEYS.has(e.libKey) || LIB_RETIRED.has(e.libKey) || own(LIB_RENAMED, e.libKey)) ? e.libKey : LIB_KEYS.has(e.name) || LIB_RETIRED.has(e.name) || own(LIB_RENAMED, e.name) ? e.name : undefined;
      const k = k0 !== undefined ? own(LIB_RENAMED, k0) ?? k0 : undefined; if (k0 !== undefined && k !== k0 && e.name === k0) e.name = k;
      if (k !== undefined) e.libKey = k; else delete e.libKey; } else delete e.libKey;
    /* SEC2-01: nazwa ze znakiem towarowym, nieprzemianowana (równa kluczowi) → nazwa ogólna; klucz zostaje, idempotentnie */
    if (e.lib === true && typeof e.libKey === 'string' && e.name === e.libKey) { const d = own(LIB_DISPLAY_NAME, e.libKey); if (d) e.name = d; }
    if (typeof e.tempo !== 'string') e.tempo = ''; if (typeof e.notes !== 'string') e.notes = '';
    e.bandAssistable = !!e.bandAssistable;
    // Runda 41: tylko prawdziwe true archiwizuje; partia i sprzęt spoza słownika → „inne”.
    if (e.archived !== true) delete e.archived; if (!(GROUPS as readonly string[]).includes(e.group)) e.group = 'inne'; if (!['hantle', 'sztanga', 'masa ciała', 'maszyna', 'linki', 'inne'].includes(e.equipment)) e.equipment = 'inne';
    // Schemat 10: ćwiczenia jednym hantlem z biblioteki liczone ×1 (poprzednio ×2 — zawyżona objętość).
    if (e.lib && SINGLE_IMPLEMENT.has(e.libKey ?? e.name) && e.loadMode === 'per_dumbbell' && (Number(raw.schemaVersion) || 0) < 10) e.loadMode = 'total';
    fixEquipFields(e);
  });
  /* E2 (audyt 0.10): przemianowane ćwiczenie biblioteki bez klucza — klucz z jednoznacznego zestawu pól katalogu (seed.libKeyFromFields), tylko gdy
   * żadne inne ćwiczenie go nie ma i pasuje dokładnie jedno ćwiczenie; pola są wtedy z bieżącego katalogu (znacznik wersji — idempotentnie). */
  /* DAT2-02 (audyt kontrolny 1): kandydaci z katalogu buildów 1001/1002 (stamtąd pola takich danych) i z wariantów o tych samych polach
   * (Bench Press = Board Press) — klucze zajęte przez inne ćwiczenia odpadają; klucz tylko przy jednym kandydacie i jednym ćwiczeniu. Pola katalogu
   * (wymagania, wzorzec, źródło obciążenia) odświeżane z bieżącego katalogu, jak u ćwiczenia z kluczem (fixEquipFields). */
  { const taken = new Set(raw.exercises.map((e: any) => e.libKey).filter(Boolean)); const cand = new Map<string, any[]>();
    for (const e of raw.exercises) if (e.lib === true && e.libKey === undefined) { const ks = libKeyCandidates(e).filter(k => !taken.has(k)); if (ks.length === 1) cand.set(ks[0], [...(cand.get(ks[0]) ?? []), e]); }
    for (const [k, list] of cand) if (list.length === 1 && LIB_KEYS.has(k)) { const e = list[0]; e.libKey = k; if (e.catalogRev !== 'user') { delete e.catalogRev; fixEquipFields(e); } } }
  /* Katalog 04.10.2026 (decyzja właściciela: rozbudowa katalogu): dane bez znacznika katalogu dostają nowe ćwiczenia biblioteki RAZ (znacznik
   * State.libExtra — ćwiczenie usunięte później przez użytkownika nie wraca); pomijane, gdy istnieje ćwiczenie o tej samej nazwie (także własne).
   * Audyt 04.10 (HIGH): znacznik zamiast granicy schematu — build 01f2bee miał już schemat 16 bez katalogu. */
  const sameList = (a: unknown, b: readonly string[]) => Array.isArray(a) && a.length === b.length && a.every((x, i) => x === b[i]);
  /* Krok b (04.10 wieczór): kroki kolejno od zapisanego znacznika; nieznany (nowszy) znacznik — bez zmian. */
  /* Audyt kroku b (MEDIUM): libExtra zostaje wartością pierwszego kroku (build 643cba7 porównuje ją dosłownie i przy innej dopisałby usunięte
   * ćwiczenia po powrocie do starszej wersji); kolejne kroki — w libExtraStep. */
  { const mark = typeof raw.libExtraStep === 'string' ? raw.libExtraStep : raw.libExtra; const done = typeof mark === 'string' ? LIB_EXTRA_REVS.indexOf(mark) : -1;
    if (done >= 0 || typeof mark !== 'string') { const have = new Set(raw.exercises.flatMap((e: any) => [fold(e.name), ...(e.libKey ? [fold(e.libKey)] : [])])); /* E2: przemianowane ćwiczenie z kluczem nie wraca pod starą nazwą */
      for (const rev of LIB_EXTRA_REVS.slice(done + 1)) {
        for (const row of LIB) if (libExtraRevOf(row[0]) === rev && !have.has(fold(row[0]))) { raw.exercises.push(libExercise(row, owner)); have.add(fold(row[0])); }
        for (const f of LIB_MUSCLE_FIXES) if (f.rev === rev) for (const e of raw.exercises) if (e.lib === true && e.libKey === f.name && sameList(e.muscles, f.from[0]) && sameList(e.secondaryMuscles, f.from[1])) { const [a, b] = musclesFor(f.name, e.group); /* E2: po kluczu */ e.muscles = a; e.secondaryMuscles = b; }
        /* research biblioteki (09.10.2026): poprawki pól — tylko wartość równa dawnej domyślnej; miara tylko ćwiczenia bez serii i pozycji szablonu (nic nie znika z widoku);
         * audyt kontrolny 1 (X2-01): tryb ciężaru z innym mnożnikiem objętości (np. total ×1 → unilateral ×2) też tylko bez serii i pozycji szablonu — inaczej
         * zapisane ciężary zmieniłyby sens (objętość, rekordy sumy dawnych sesji); ten sam mnożnik — tylko etykieta, stosowana zawsze (jak okW w retireCatalog) */
        { const fixes = LIB_FIELD_FIXES.filter(f => f.rev === rev); if (fixes.length) { const inUse = usedIds(raw);
          /* DAT2-01: asysta gumą (asysta ↔ opór) — tylko gdy ćwiczenie nie ma serii z gumą (dawne serie z gumą zmieniłyby znaczenie i rekordy) */
          const banded = new Set<string>(); for (const w of [...arr(raw.workouts), ...(isObj(raw.active) ? [raw.active] : [])]) for (const x of arr(w.exercises)) if (arr(x.sets).some((z: any) => typeof z?.bandId === 'string' && z.bandId)) { const id = idOf(x.exerciseId); if (id) banded.add(id); }
          const allowed = (f: typeof fixes[number], id: string) => f.field === 'metric' ? !inUse.has(id) : f.field === 'loadMode' ? loadMult(f.from as LoadMode) === loadMult(f.to as LoadMode) || !inUse.has(id) : f.field === 'bandAssistable' ? !banded.has(id) : true;
          for (const f of fixes) for (const e of raw.exercises) if (e.lib === true && e.libKey === f.name && JSON.stringify(e[f.field]) === JSON.stringify(f.from) && allowed(f, e.id)) e[f.field] = JSON.parse(JSON.stringify(f.to)); } }
      }
      raw.libExtra = LIB_EXTRA_REVS[0]; raw.libExtraStep = LIB_EXTRA_REV; } }
}
/** Krok migracji: szablony (pola pozycji, wiersze, zamienniki, notatka, nazwa, miejsce, folder, archiwum). */
function fixTemplates(raw: any, stamp: (o: any, fallbackTs?: number) => void) {
  raw.templates = arr(raw.templates);
  raw.templates.forEach((t: any) => { stamp(t); if (typeof t.name !== 'string') t.name = ''; t.items = arr(t.items); t.items = t.items.filter((it: any) => idOf(it.exerciseId) != null); t.items.forEach((it: any) => { it.id = idOf(it.id) ?? uid(); it.exerciseId = idOf(it.exerciseId); { const v = parseNum(it.targetSec); it.targetSec = v == null || v < 0 ? '' : Math.min(86400, Math.round(v)); } /* runda 51 */ it.groupId = idOf(it.groupId); it.sets = intIn(it.sets, 1, 50) ?? 1; /* runda 15: liczba, nie tekst z importu */ if (it.startWeight === undefined) it.startWeight = ''; for (const k of ['repMin', 'repMax']) it[k] = intIn(it[k], 1, 100); { const v = parseNum(it.restSec); it.restSec = v == null || v < 0 ? null : Math.min(1800, Math.round(v)); } /* runda 49: także tekst, jak przerwa ćwiczenia */ /* runda 17: limit 1800 */ { const v = parseNum(it.startWeight); it.startWeight = v == null ? '' : kg2(snapL(v) as number); } fixAlternates(it); fixRows(it); }); });
  raw.templates.forEach((x: any) => { const n = typeof x.note === 'string' ? cleanNote(x.note) : ''; if (n) x.note = n; else delete x.note; }); /* audyt 0.10 UX-10: notatka szablonu */
  raw.templates.forEach((x: any) => { const n = x.name.replace(/\s+/g, ' ').trim(); x.name = n || tIn(raw.settings?.language, 'Nowy szablon'); { const l = idOf(x.locationId); if (l) x.locationId = l; else delete x.locationId; } /* P-003 */ { const f = typeof x.folder === 'string' ? cleanFolder(x.folder) : ''; if (f) x.folder = f; else delete x.folder; } if (x.archived !== true) delete x.archived; /* 07.10.2026 wieczór: folder i archiwum */ }); // runda 35: jak nazwy ćwiczeń
  /* Decyzja właściciela 03.10.2026 (08:11): aplikacja nie zmienia ciężarów ani treści szablonów użytkownika — także przy przejściu na schemat 15
   * (wcześniejsza jednorazowa zmiana 48 → 24 kg z P-004 usunięta: 48 zostaje 48). Zostaje tylko dotychczasowa normalizacja, ta sama co w main:
   * pola pozycji wyżej (liczby, zakresy, siatka kg), a niżej usunięcie pozycji, których ćwiczenia nie ma albo jest usunięte (runda 82b — docs/10). */
}
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
const fixWorkout = (raw: any, owner: string, w: any) => {
  if (typeof w.loggedBy !== 'string' || !w.loggedBy) w.loggedBy = owner; if (typeof w.sessionMode !== 'string' || !w.sessionMode) w.sessionMode = 'solo'; if (typeof w.healthUUID !== 'string' || !w.healthUUID) w.healthUUID = null; /* runda 52 */ delete w.bodyWeightKg; /* schemat 13 (Q-001): bez zamrożonej masy ciała */
  w.startedAt = tsOf(w.startedAt); w.finishedAt = w === raw.active ? null : (tsOf(w.finishedAt) ?? w.startedAt); if (w !== raw.active || tsOf(w.staleAck) == null) delete w.staleAck; else w.staleAck = tsOf(w.staleAck); /* 08.10.2026: pauza — przedziały uporządkowane w granicach treningu (cleanPauses), pausedAt tylko w treningu w toku i nie przed startem */ { if (w.startedAt != null) setPauses(w, cleanPauses(w.pauses, w.startedAt, w.finishedAt)); else delete w.pauses; delete w.pausedMs; const pa = tsOf(w.pausedAt); if (w === raw.active && pa != null && w.startedAt != null && pa >= w.startedAt) w.pausedAt = pa; else delete w.pausedAt; } /* runda 69 */ /* runda 49/51: trening z historii zawsze zakończony; trening w toku — nie */ /* runda 49: zakończony (choć nieczytelny) trening zostaje w historii */ if (w.finishedAt != null && w.finishedAt < w.startedAt) w.finishedAt = w.startedAt; /* runda 48 */ if (typeof w.templateName !== 'string') w.templateName = ''; if (typeof w.note !== 'string') w.note = ''; w.templateId = idOf(w.templateId); { const l = idOf(w.locationId); if (l) w.locationId = l; else delete w.locationId; } /* P-003: miejsce zostaje także po usunięciu miejsca („(usunięte miejsce)”) */
  if (w.deload !== true) delete w.deload; /* audyt 0.10 (D1+): znacznik treningu deload — tylko true */
  if (w.healthPending !== true || w.healthUUID || w === raw.active) delete w.healthPending; /* J2 (fala 2): tylko zakończony, niezapisany w Zdrowiu */
  { const z = cleanTz(w.tzOffsetMin); if (z === undefined) delete w.tzOffsetMin; else w.tzOffsetMin = z; } /* J3: strefa startu — zła wartość odpada (= strefa bieżąca, jak dotąd) */
  w.exercises = arr(w.exercises).filter((e: any) => idOf(e.exerciseId) != null); /* runda 50/51 */ if (w !== raw.active) { w.exercises.forEach((e: any) => { e.sets = arr(e.sets).filter((s: any) => !!s.done); e.sets.forEach((s: any) => { delete s.pre; }); }); w.exercises = w.exercises.filter((e: any) => e.sets.length); } /* runda 59: historia = tylko odhaczone serie, jak po „Zakończ” */ w.exercises.forEach((e: any) => { e.exerciseId = idOf(e.exerciseId); e.id = idOf(e.id) ?? uid(); if (e.tplItemId != null) e.tplItemId = idOf(e.tplItemId) ?? undefined; if (!(IMPLS as readonly unknown[]).includes(e.impl)) delete e.impl; /* schemat 15 (decyzja 8c): tylko znany przyrząd */ fixSwapFields(e, w === raw.active); /* schemat 16 (E2) */ { const n = w.deload === true ? parseNum(e.deloadFull) : null; if (n != null && n >= 1) e.deloadFull = Math.min(50, Math.round(n)); else delete e.deloadFull; } /* audyt 0.10 (D1+): pole opcjonalne bez zmiany schematu */ for (const k of ['repMin', 'repMax']) e[k] = intIn(e[k], 1, 100); /* runda 49: jak w szablonie */ e.groupId = idOf(e.groupId); { const v = parseNum(e.restSec); e.restSec = v == null || v < 0 ? DEFAULT_REST : Math.min(1800, Math.round(v)); } e.sets = arr(e.sets); e.sets.forEach(fixSet); }); normalizeGroups(w.exercises);
};
/**
 * Migracja do bieżącego schematu. Przyjmuje backupy web 0.3, natywnej 0.1.0 i każdą późniejszą wersję;
 * dopisuje brakujące pola, pomija uszkodzone wpisy (null, nie-obiekty) zamiast się wywracać.
 * Idempotentna — można ją wołać na stanie już zmigrowanym.
 */
export function migrate(raw: any): State {
  if (!isObj(raw) || !Array.isArray(raw.exercises) || !Array.isArray(raw.templates)) throw new Error('bad state');
  setLegacyLb(!((Number(raw.schemaVersion) || 0) >= 11));
  const owner: string = typeof raw.ownerId === 'string' && raw.ownerId ? raw.ownerId : LOCAL_OWNER;
  const stamp = (o: any, fallbackTs?: number) => {
    o.id = idOf(o.id) ?? uid(); // runda 51: id zawsze tekstem
    if (typeof o.ownerId !== 'string' || !o.ownerId) o.ownerId = owner;
    const ts = typeof fallbackTs === 'number' && fallbackTs > 0 && tsOf(fallbackTs) != null ? fallbackTs : Date.now();
    const c = tsOf(o.createdAt); o.createdAt = c != null && c > 0 ? c : ts; // runda 52: zawsze liczba
    const u = tsOf(o.updatedAt); o.updatedAt = u != null && u > 0 ? u : o.createdAt;
  };
  migrateExercises(raw, owner, stamp);
  fixTemplates(raw, stamp);
  raw.bands = arr(raw.bands); raw.bands.forEach((b: any) => { stamp(b); delete b.nominalKg; /* T-055: dawna asysta kg gumy (przed P-001) — stara kopia się importuje, pole odpada; starsze wersje aplikacji czytają brak pola jako „bez kg” */ if (typeof b.color !== 'string' || !b.color.trim()) b.color = '?'; b.color = b.color.replace(/\s+/g, ' ').trim(); b.level = intIn(b.level, 1, 7) ?? 1; /* runda 51 */ });
  raw.workouts = arr(raw.workouts).filter(w => tsOf(w.startedAt) != null); raw.workouts.forEach((w: any) => { w.startedAt = tsOf(w.startedAt); }); raw.workouts.forEach((w: any) => { stamp(w, w.finishedAt || w.startedAt); fixWorkout(raw, owner, w); }); raw.workouts = raw.workouts.filter((w: any) => w.exercises.length); /* runda 60: bez pustych sesji w historii (jak po „Zakończ”, B9) */
  // Runda 16: data poranna w formacie RRRR-MM-DD (np. „2026-9-1” z ręcznej edycji → „2026-09-01”); nieczytelne odpadają.
  raw.mornings = arr(raw.mornings).filter(m => typeof m.date === 'string' && /^\d{4}-\d{1,2}-\d{1,2}/.test(m.date)).map((m: any) => { const [y, mo, d] = m.date.slice(0, 10).split(/[-T]/); m.date = `${y}-${mo.padStart(2, '0')}-${d.padStart(2, '0')}`; return m; })
    // Runda 17: tylko istniejące daty (bez „2026-13-45”) i jeden wpis na dzień (zostaje nowszy).
    .filter((m: any) => { const [y, mo, d] = m.date.split('-').map(Number); const x = new Date(y, mo - 1, d); return x.getFullYear() === y && x.getMonth() === mo - 1 && x.getDate() === d; });
  { const byDate = new Map<string, any>(); for (const m of raw.mornings) { const o = byDate.get(m.date); if (!o || (tsOf(m.updatedAt) ?? 0) > (tsOf(o.updatedAt) ?? 0)) byDate.set(m.date, m); } raw.mornings = [...byDate.values()]; }
  raw.mornings.forEach((m: any) => { stamp(m, localDateTs(m.date)); for (const k of ['bb', 'sleepScore', 'sleepH', 'weight']) m[k] = posNum(m[k]); /* runda 50: liczba albo '' (obiekt z importu wywracał ekran) */ if (m.bb !== '') m.bb = Math.min(100, Math.round(m.bb)); if (m.sleepScore !== '') m.sleepScore = Math.min(100, Math.round(m.sleepScore)); if (m.sleepH !== '') m.sleepH = Math.min(24, Math.round(m.sleepH * 100) / 100); if (m.weight !== '') { const w = kg2(snapL(m.weight) as number); m.weight = w > 0 && w <= 1000 ? w : ''; } /* runda 61: najpierw zaokrąglenie, potem zakres */ /* runda 51: 0 = brak wpisu */ });
  if (isObj(raw.active) && tsOf(raw.active.startedAt) != null) { stamp(raw.active, raw.active.startedAt); fixWorkout(raw, owner, raw.active); } else raw.active = null;
  uniqueIds(raw); /* przed porządkowaniem nieużywanych ćwiczeń — inaczej drugie wczytanie zmieniałoby dane (migrate-idem) */
  retireCatalog(raw); /* research biblioteki (09.10.2026): scalone → ćwiczenie docelowe, usunięte → własne albo znikają */
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
  const unknownSettings = Object.fromEntries(Object.keys(s).filter(k => !SETTINGS_KEYS.has(k) && !PROTO_KEYS.has(k) && !legacy.has(k) && !MOVED_SETTINGS.has(k)).map(k => [k, s[k]]));
  raw.settings = { ...unknownSettings,
    defaultRest: (v => v != null && v >= 0 ? Math.min(1800, Math.round(v)) : d.defaultRest)(parseNum(s.defaultRest)), // runda 17: ten sam limit co wszędzie
    sound: typeof s.sound === 'boolean' ? s.sound : d.sound,
    wakeLock: typeof s.wakeLock === 'boolean' ? s.wakeLock : d.wakeLock,
    showRpe: typeof s.showRpe === 'boolean' ? s.showRpe : d.showRpe,
    ...(s.effortScale === 'rir' ? { effortScale: 'rir' as const } : {}), ...(s.libShowAll === true ? { libShowAll: true as const } : {}), /* research biblioteki (09.10.2026): tylko zdjęty filtr zapisany */ ...(s.planReminder === false ? { planReminder: false as const } : {}), /* przypomnienie z planu (08.10.2026): tylko wyłączenie zapisane */ /* pakiet C: tylko wybór RIR zapisany — dane sprzed zmiany przechodzą 1:1 (swap-schema16) */
    healthSync: typeof s.healthSync === 'boolean' ? s.healthSync : d.healthSync,
    progressHint: typeof s.progressHint === 'boolean' ? s.progressHint : d.progressHint, autoBackup: typeof s.autoBackup === 'boolean' ? s.autoBackup : d.autoBackup, weighReminder: typeof s.weighReminder === 'boolean' ? s.weighReminder : d.weighReminder, /* runda 75 */
    modules: (() => { const mods = { ...defaultModules(), ...(isObj(s.modules) ? s.modules : {}) }; MODULES.forEach(m => { if (typeof mods[m] !== 'boolean') mods[m] = false; }); mods.training = true; return mods; })(),
    language: s.language === 'auto' || isLang(s.language) ? s.language : d.language,
    unit: s.unit === 'lb' ? 'lb' : 'kg',
    theme: s.theme === 'dark' || s.theme === 'auto' ? s.theme : 'light', /* decyzja 05.10.2026: domyślnie jasny, także dla starszych danych (potwierdzone 07.10.2026) */
    workoutView: s.workoutView === 'list' ? 'list' : 'focus', /* 07.10.2026: widok skupiony domyślnie, także dla starszych danych (bez zmiany schematu) */
    ...fixLocations(s, stamp, raw.settings?.language), /* P-003 (schemat 14): bez tego biała lista gubiła miejsca przy każdym starcie i imporcie */
  };
  /* Fala 2 audytu 0.10 (masa ciała z datą): pomiary — dzień RRRR-MM-DD (istniejący), kg > 0 i ≤ BODY_MASS_MAX na siatce 0,01; jeden na dzień (późniejszy wpis
   * wygrywa), rosnąco, najwyżej BODY_MASS_LOG_MAX najnowszych; pusta lista znika. Dawne Settings.bodyMass (E1, bez daty) → pierwszy wpis z dniem najstarszego
   * treningu (dziś, gdy historii nie ma) — e1RM dawnych sesji bez zmian; tylko gdy pomiarów jeszcze nie ma. Idempotentne: pole w ustawieniach znika. */
  { const okKg = (v: unknown) => { const n = parseNum(v); return n != null && kg2(n) > 0 && n <= BODY_MASS_MAX ? kg2(n) : null; };
    const byDay = new Map<string, number>(); for (const x of arr(raw.bodyMassLog)) { const kg = okKg(x.kg); if (kg != null && typeof x.date === 'string' && realDay(x.date)) byDay.set(x.date, kg); }
    const legacyKg = okKg(s.bodyMass);
    if (!byDay.size && legacyKg != null) { const first = raw.workouts.reduce((a: any, w: any) => (!a || w.startedAt < a.startedAt ? w : a), null); byDay.set(first ? workoutDay(first) : localISODate(), legacyKg); }
    const log = [...byDay].sort((a, b) => (a[0] < b[0] ? -1 : a[0] > b[0] ? 1 : 0)).slice(-BODY_MASS_LOG_MAX).map(([date, kg]) => ({ date, kg }));
    if (log.length) raw.bodyMassLog = log; else delete raw.bodyMassLog; }
  if (raw.equipFill !== GYM_FILL.rev) { for (const l of raw.settings.locations) fillGym(l, raw.settings.unit); raw.equipFill = GYM_FILL.rev; } /* decyzja 05.10.2026 (1.a): raz */
  if (raw.equipFill2 !== EQUIP_FILL2.rev) { for (const l of raw.settings.locations) fillEquip2(l, raw.settings.unit); raw.equipFill2 = EQUIP_FILL2.rev; } /* research biblioteki (L5 Q7, 09.10.2026): ściana, maszyna do dipów — raz */
  /* pakiet C: tygodnie deload — daty poniedziałków, bez powtórzeń, posortowane, najwyżej 10 lat; pusta lista znika (dane sprzed zmiany 1:1); nie `arr` — ta przepuszcza tylko obiekty */
  { const u = [...new Set((Array.isArray(raw.deloadWeeks) ? raw.deloadWeeks : []).filter((x: unknown) => typeof x === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(x) && new Date(+x.slice(0, 4), +x.slice(5, 7) - 1, +x.slice(8, 10)).getDay() === 1))].sort().slice(-DELOAD_WEEKS_MAX) as string[]; if (u.length) raw.deloadWeeks = u; else delete raw.deloadWeeks; }
  /* kalendarz (08.10.2026): plan tygodnia — 7 pozycji (id tekstem albo null), pusty znika; zmiany dni — klucze-daty, wartości id albo null */
  { const days = planDays(isObj(raw.weekPlan) ? raw.weekPlan.days : null);
    const nm = isObj(raw.weekPlan) && typeof raw.weekPlan.name === 'string' ? cleanPlanName(raw.weekPlan.name) : ''; /* audyt 0.10 B4 (DAT-06): idempotentnie, bez rozcinania emoji */
    if (days.some(Boolean) || nm) raw.weekPlan = { days, ...(nm ? { name: nm } : {}) }; else delete raw.weekPlan;
    /* 08.10.2026 (docs/24): zapisane plany — id tekstem bez powtórzeń, nazwa ≤ 40, 7 dni; pusta lista znika; najwyżej SAVED_PLANS_MAX (ten sam limit w UI — audyt 0.10 B3) */
    { const sp0 = (Array.isArray(raw.savedPlans) ? raw.savedPlans : []).filter((p: any) => isObj(p) && typeof p.id === 'string' && p.id); freshIds(sp0); /* DAT2-04: powtórzone id → „~n” */
      const sp = sp0.map((p: any) => { const ov = cleanOverrides(p.overrides); return { id: p.id, name: typeof p.name === 'string' ? cleanPlanName(p.name) : '', days: planDays(p.days), ...(Object.keys(ov).length ? { overrides: ov } : {}) }; }); /* audyt 0.10 B1: zmiany dni zapisane z planem */
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
  if (raw.planHintHidden !== true) delete raw.planHintHidden; /* audyt 0.10 UX-16 A: tylko true (pole opcjonalne schematu 18) */
  if (raw.optFill !== OPT_FILL.rev) { for (const l of raw.settings.locations) fillOpts(l); raw.optFill = OPT_FILL.rev; } /* bieżnia: nachylenie (05.10.2026), raz */
  raw.ownerId = owner;
  if (!Number.isFinite(raw.v)) raw.v = 2; if (raw.metaUpdatedAt != null && tsOf(raw.metaUpdatedAt) == null) delete raw.metaUpdatedAt; /* runda 53 */
  raw.schemaVersion = Math.max(SCHEMA_VERSION, Number(raw.schemaVersion) || 0); /* audyt 0.10 J1: numer schematu nigdy w dół (dane z nowszej wersji zatrzymuje init i import) */
  return raw as State;
}
/** Id ćwiczeń użytych w treningach (historia, trening w toku) i szablonach (pozycje, zamienniki) — na surowych danych (przed sanityzacją też). */
function usedIds(raw: any): Set<string> {
  const out = new Set<string>(); const add = (v: unknown) => { const id = idOf(v); if (id != null) out.add(id); };
  for (const w of [...arr(raw.workouts), ...(isObj(raw.active) ? [raw.active] : [])]) for (const x of arr(w.exercises)) { add(x.exerciseId); add(x.swappedFrom); }
  for (const tp of arr(raw.templates)) for (const it of arr(tp.items)) { add(it.exerciseId); for (const a of arr(it.alternates)) add(a.exerciseId); }
  return out;
}
/**
 * Research biblioteki (decyzja właściciela 09.10.2026, wariant B — docs/18): ćwiczenia wycofane z katalogu.
 *  - SCALIĆ: treningi (historia i w toku, także „zamienione z”), szablony (pozycje i zamienniki) przechodzą na ćwiczenie docelowe; notatka, przerwy
 *    i tempo scalanego wpisu dopisują się do docelowego, gdy tam pusto (notatki — obie); wpis znika. Brak docelowego (usunięte na stałe) — scalany
 *    wpis sam staje się docelowym (to samo id, historia bez zmian). Gdy przeniesienie zmieniłoby sens zapisanych wartości (inne pola miary,
 *    masa ciała ↔ ciężar zewnętrzny z dociążeniem, inny mnożnik objętości, guma) albo użytkownik zmienił nazwę — wpis zostaje jako ćwiczenie własne.
 *    Ciężar zewnętrzny → ćwiczenie z masą ciała (Kettlebell Pistol Squat → Pistol Squat): zapisany ciężar staje się dociążeniem.
 *  - USUNĄĆ: znika z biblioteki; użyte w treningu albo szablonie (albo z notatką, przerwą, tempem, inną nazwą) — zostaje jako ćwiczenie własne.
 * Idempotentne: po pierwszym przebiegu żaden wpis nie ma wycofanego klucza.
 */
function retireCatalog(raw: any) {
  const retired = raw.exercises.filter((e: any) => e.lib === true && typeof e.libKey === 'string' && LIB_RETIRED.has(e.libKey)); if (!retired.length) return;
  const ws: any[] = [...raw.workouts, ...(raw.active ? [raw.active] : [])]; const used = usedIds(raw); const drop = new Set<string>();
  const personal = (e: any) => !!e.notes || e.restSec != null || e.restWarmupSec != null || !!e.tempo;
  const detach = (e: any) => { delete e.lib; delete e.libKey; if (e.catalogRev !== 'user') delete e.catalogRev; };
  const nz = (v: unknown) => v !== '' && v != null && Number(v) !== 0;
  for (const x of retired) {
    const key: string = x.libKey; const target = own(LIB_MERGED, key);
    if (!target) { if (used.has(x.id) || personal(x) || x.name !== key) detach(x); else drop.add(x.id); continue; }
    const T = raw.exercises.find((e: any) => e !== x && !drop.has(e.id) && e.lib === true && e.libKey === target && e.archived !== true) ?? raw.exercises.find((e: any) => e !== x && !drop.has(e.id) && e.lib === true && e.libKey === target);
    const row = LIB.find(r => r[0] === target); const def: Exercise | undefined = row ? libExercise(row, x.ownerId) : undefined;
    const to: any = T ?? def; if (!to || x.name !== key) { detach(x); continue; }
    /* dane zapisane przy scalanym ćwiczeniu (serie treningów i wiersze szablonów) — czy docelowe pokaże je z tym samym sensem */
    const blocks = ws.flatMap(w => w.exercises.filter((b: any) => b.exerciseId === x.id)); const rows = raw.templates.flatMap((tp: any) => tp.items.filter((it: any) => it.exerciseId === x.id).flatMap((it: any) => arr(it.rows)));
    const sets = blocks.flatMap((b: any) => b.sets); const m = (to.metric ?? 'weight_reps') as Exercise['metric'];
    const hasW = sets.some((st: any) => nz(st.weight) || nz(st.addKg)) || rows.some((r: any) => nz(r.weight));
    const ok = !(sets.some((st: any) => nz(st.reps)) || rows.some((r: any) => nz(r.reps))) || hasReps(m);
    const okT = !(sets.some((st: any) => nz(st.durationSec)) || rows.some((r: any) => nz(r.durationSec))) || hasTime(m);
    const okD = !(sets.some((st: any) => nz(st.distanceM)) || rows.some((r: any) => nz(r.distanceM))) || hasDistance(m);
    const xBW = x.equipment === 'masa ciała', tBW = to.equipment === 'masa ciała';
    const okW = !hasW || (hasWeight(m) && (xBW === tBW ? (tBW || loadMult(x.loadMode) === loadMult(to.loadMode)) : !xBW));
    const okB = !sets.some((st: any) => !!st.bandId) || !!x.bandAssistable === !!to.bandAssistable;
    if (!(ok && okT && okD && okW && okB)) { detach(x); continue; }
    const toAdd = hasW && !xBW && tBW; /* ciężar zewnętrzny → dociążenie przy ćwiczeniu z masą ciała */
    if (toAdd) { for (const st of sets) { if (nz(st.weight)) { st.addKg = st.weight; st.weight = ''; } if (st.pre && 'weight' in st.pre) { st.pre.addKg = st.pre.weight; delete st.pre.weight; } } for (const b of blocks) for (const st of b.sets) if (st.hinted && 'weight' in st.hinted) { st.hinted.addKg = st.hinted.weight; delete st.hinted.weight; } }
    if (!T) { /* docelowego nie ma — scalany wpis przejmuje jego klucz i pola z katalogu (id, notatka, przerwy, archiwum bez zmian) */
      x.libKey = target; x.name = target; for (const k of ['group', 'equipment', 'metric', 'loadMode', 'bandAssistable', 'muscles', 'secondaryMuscles', 'requires', 'recommended', 'pattern', 'loadSource', 'catalogRev']) x[k] = (def as any)[k];
      delete x.implements; if (def!.implements) x.implements = def!.implements; continue; }
    for (const w of ws) for (const b of w.exercises) { if (b.exerciseId === x.id) b.exerciseId = T.id; if (b.swappedFrom === x.id) b.swappedFrom = T.id; if (b.swappedFrom === b.exerciseId) delete b.swappedFrom; }
    for (const tp of raw.templates) for (const it of tp.items) { if (it.exerciseId === x.id) it.exerciseId = T.id;
      if (it.alternates) { for (const a of it.alternates) if (a.exerciseId === x.id) a.exerciseId = T.id; it.alternates = it.alternates.filter((a: any) => a.exerciseId !== it.exerciseId || a.impl); if (!it.alternates.length) delete it.alternates; } }
    if (x.notes && x.notes !== T.notes) T.notes = T.notes ? `${T.notes}\n${x.notes}` : x.notes;
    if (T.restSec == null && x.restSec != null) T.restSec = x.restSec; if (T.restWarmupSec == null && x.restWarmupSec != null) T.restWarmupSec = x.restWarmupSec; if (!T.tempo && x.tempo) T.tempo = x.tempo;
    if (T.archived === true && x.archived !== true) delete T.archived;
    drop.add(x.id);
  }
  if (drop.size) raw.exercises = raw.exercises.filter((e: any) => !drop.has(e.id));
}
/** Powtórzone id w liście → nowe id deterministyczne („<id>~2”, „~3”…; pierwszy wpis zachowuje id): dwa wczytania tych samych danych dają ten sam
 * wynik (porównania eksport → import, restart). Jedna reguła dla wszystkich list z id (także miejsca i zapisane plany — DAT2-04). */
function freshIds(list: any[]) { const seen = new Set<string>(list.map(o => o?.id).filter((x: unknown) => typeof x === 'string'));
  const first = new Set<string>(); for (const o of list) { if (typeof o?.id !== 'string') continue; if (!first.has(o.id)) { first.add(o.id); continue; }
    let n = 2; while (seen.has(`${o.id}~${n}`)) n++; o.id = `${o.id}~${n}`; seen.add(o.id); first.add(o.id); } }
/** Decyzja właściciela 06.10.2026 (wariant A): powtórzony identyfikator w danych (np. kopia sklejona ręcznie z dwóch plików) dostaje nowy —
 * nic nie ginie (dotąd usunięcie jednego treningu kasowało oba, drugie ćwiczenie/guma było nieosiągalne). Pierwsze wystąpienie zachowuje id,
 * więc odwołania (pozycje szablonów, bloki, gumy serii) wskazują to samo co przedtem. Idempotentne: przy unikalnych id nic nie zmienia.
 * Znalezisko tests/matrix-data-fuzz.test.ts. */
function uniqueIds(raw: any) {
  const fresh = freshIds;
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
/** Przywracany szkic przechodzi to samo porządkowanie co dane z bazy i importu (migrate na kopii stanu z obiektem szkicu); null — obiektu już nie ma. */
export function sanitizeDraftObj(kind: 'exercise' | 'template', obj: unknown): Exercise | Template | null {
  if (!S || !isObj(obj) || typeof (obj as any).id !== 'string') return null; const id = (obj as any).id as string; const key = kind === 'exercise' ? 'exercises' : 'templates';
  const raw: any = JSON.parse(JSON.stringify(S)); const i = raw[key].findIndex((x: any) => x.id === id); if (i < 0) return null; raw[key][i] = JSON.parse(JSON.stringify(obj));
  try { return (migrate(raw)[key] as (Exercise | Template)[]).find(x => x.id === id) ?? null; } catch { return null; }
}
/** Audyt 0.10 J1: surowy zapis (stan + trening w toku) do wysłania z ekranu „Dane z nowszej wersji” — koperta jak kopia nieczytelnych danych
 * (nowsza wersja wczyta ją importem). */
export async function readRawData(): Promise<string | null> {
  if (!db) return null; const r = await db.getFirstAsync<{ v: string }>('SELECT v FROM kv WHERE k = ?', 'state'); if (!r) return null;
  const l = await db.getFirstAsync<{ v: string }>('SELECT v FROM kv WHERE k = ?', 'live').catch(() => null);
  const c = await db.getFirstAsync<{ v: string }>('SELECT v FROM kv WHERE k = ?', 'cfg').catch(() => null); /* PERF-03 (A) */
  const js = (x: string) => { try { return JSON.parse(x); } catch { return x; } };
  return JSON.stringify({ format: 'trening-recovery', note: 'state = zapis z nowszej wersji aplikacji, live = trening w toku, cfg = nowsza konfiguracja', state: js(r.v), ...(l ? { live: js(l.v) } : {}), ...(c ? { cfg: js(c.v) } : {}) });
}
/** Surowy tekst odłożonego, nieczytelnego zapisu — do wysłania sobie i ręcznego odzyskania. */
export async function readRecovery(): Promise<string | null> { if (!db || !recovery) return null; const r = await db.getFirstAsync<{ v: string }>('SELECT v FROM kv WHERE k = ?', recovery.key); const l = await db.getFirstAsync<{ v: string }>('SELECT v FROM kv WHERE k = ?', recovery.key + '_live').catch(() => null); if (!r) return null; if (!l) return r.v;
  /* T4b: koperta JSON zamiast dopisku po stanie — plik da się po poprawce wczytać importem (parseBackup); stan jako obiekt, gdy jest poprawnym JSON-em, inaczej jako tekst */
  const js = (x: string) => { try { return JSON.parse(x); } catch { return x; } };
  return JSON.stringify({ format: 'trening-recovery', note: 'state = nieczytelny zapis, live = trening w toku', state: js(r.v), live: js(l.v) }); }
/** A11B-1 (audyt zmian 0.11, część 2, wariant A): import i „Wyczyść wszystkie dane” zastępują wszystko — także szkice edycji (ćwiczeń i szablonów
 * w pamięci i w bazie, lib/draft.ts; edycji historii, lib/edit.ts). Szkic sprzed zastąpienia dotyczy starych danych: po „Edytuj → Zapisz” nadpisałby
 * dane z kopii. Moduły szkiców rejestrują tu czyszczenie (store ich nie importuje). */
const stateReplacedHooks = new Set<() => void>();
export function onStateReplaced(cb: () => void) { stateReplacedHooks.add(cb); }
export function replaceState(next: State) { setS(migrate(next)); setSavedDrafts(null); stateReplacedHooks.forEach(h => h()); applyPrefs(); save(); }
/** Wczytanie/import: wiersze poprawne albo brak (pozycja wraca do `sets` + `startWeight`). */
function fixRows(it: any) {
  if (!Array.isArray(it.rows)) { delete it.rows; return; }
  const num = (v: unknown, min: number, max: number, int = true) => { const x = parseNum(v); return x == null ? '' : Math.min(max, Math.max(min, int ? Math.round(x) : x)); };
  it.rows = it.rows.filter(isObj).slice(0, 50).map((r: any) => ({ id: typeof r.id === 'string' && r.id ? r.id : uid(), kind: (SET_KINDS as readonly string[]).includes(r.kind) ? r.kind : 'normal',
    reps: num(r.reps, 0, REPS_MAX), weight: (v => v == null ? '' : kg2(snapL(v) as number))(parseNum(r.weight)), durationSec: num(r.durationSec, 0, 86400), distanceM: num(r.distanceM, 0, 1e6), ...(typeof r.bandId === 'string' && r.bandId ? { bandId: r.bandId } : {}) }));
  syncItem(it);
}
/** Włączanie/wyłączanie modułu (ADR-011). 'training' jest zawsze włączony. */
export function setModule(m: keyof State['settings']['modules'], on: boolean) { const s = getState().settings; s.modules[m] = m === 'training' ? true : on; save(); }
/** Reset: nowe dane startowe w języku, który będzie widoczny po resecie (ustawienie wraca na „auto” = język telefonu). */
export function resetAll() { const s = seedState(detectLang()); s.settings.unit = deviceUnit(); /* jak świeża instalacja (UX-12) */ replaceState(s); clearRecovery(); flush(); }
