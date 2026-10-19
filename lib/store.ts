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
import * as migrateMod from './state/migrate';
import * as settingsMod from './state/settings';
import * as bootMod from './state/boot';
import * as crashMod from './state/crashguard';

export const { NAME_MAX, REPS_MAX, REST_MAX, clampName, PREMIGRATE_KEEP_MS } = utilMod;
export const {
  localDateTs, fmtSec, fmtDist, reps, fmtDur, fmtDayKey, fmtDate, fmtTime, localISODate, tzOffsetAt, cleanTz, wallTs, fromWallTs, workoutDay,
  mondayKey
} = timeMod;
export const { dbDirectory, copyKv } = dbMod;
export type { KvDb } from './state/db';
export const {
  CFG_KEYS, applyCfg, flush, flushStrict, DRAFTS_KEY, registerDraftStore, draftsChanged, takeSavedDrafts, getPersistError, getRecovery, clearRecovery,
  getNewerSchema, markDraft, isDraftObj, save, saveCfg, getState, useStore, useTick, usePrefsTick, getHistRev, getRev, refreshViews,
  useForegroundTick, useHistTick, useCfgTick, memoHist, memoHistBy, setTimerState, isReadyForTests, __resetForTests
} = coreMod;
export const { effortScale, effortLabel, RPE_MIN, RPE_MAX, RIR_MAX, RPE_LIGHT, effortOut, effortText, effortIn, effortField } = effortMod;
export const {
  exById, bandById, isBW, repsOf, loadOf, shownLoad, setLoad, loadFieldValue, writeLoad, effectiveLoad, exMult, isWorking, workCount, workSetCount,
  workingSets, setVolume, blockMult, volOf, loadLabelShort, loadLabel, restFor, bandColor, shortBand, bandA11y, setSummary, setScore, setHasValue,
  volume, usesBand
} = setsMod;
export const { copyVals, stripUnused, assistLost, cascadeDown } = setvalsMod;
export const {
  locationById, startLocationId, offListAt, prevFromOther, implAtLoc, blockImpl, liveBlockImpl, listLocFor, pinnedImpl, offListNote, srcSetAt,
  stampImpl, setActiveLocation, locationEquipChanged, restampUntouched, visibleLocations, placeOnDay, unusedOneOffIds, pruneOneOff
} = placesMod;
export const {
  finishedWorkouts, blocksOf, workoutsWith, previousFor, previousBlockFor, previousBlockBefore, hintFor, progressionFor, occurrence, occurrences,
  prevOfActiveBlock
} = historyMod;
export type { Progression } from './state/history';
export const { cleanLevels, nextBandId, cycleBand, deleteBand } = bandsMod;
export const { normalizeGroups, groupLabels, linkWithNext, unlink, moveItem, removeItem, blockRanges, moveBlockOf, moveInGroup } = groupsMod;
export type { Grouped } from './state/groups';
export const { pausedTotal, isPaused, workoutDurSec, noClock, whenText, cleanPauses, pauseWorkout, resumeWorkout } = pauseMod;
export const {
  isDeloadWeek, toggleDeloadWeek, PLAN_NAME_MAX, SAVED_PLANS_MAX, PLAN_HISTORY_MAX, DELOAD_WEEKS_MAX, cleanPlanName, planDays, sameDays,
  normPlanHistory, cleanOverrides, appendPlanSegment, PLAN_PLACES_MAX, PLAN_PLACE_RANGE_MAX, cleanPlanPlaces
} = weekplanMod;
export const { bodyMassLog, bodyMassOn, bodyMassFor, latestBodyMass, addBodyMass, removeBodyMass } = bodymassMod;
export const {
  tplRows, tplWorkSets, tplAddRow, tplRemoveRow, tplCycleBand, tplSetRow, tplEditRow, tplSetKind, newTemplate, dupTemplate, FOLDER_MAX, templateFolders,
  templateGroups, archivedTemplates, TEMPLATE_NOTE_MAX, setTemplateNote, setTemplateFolder, setTemplateArchived, deleteTemplate
} = templatesMod;
export const {
  useExercisesTick, newExercise, setEquipment, exerciseEdited, restoreExercise, exerciseInHistory, exerciseUsed, deleteExercise, visibleExercises,
  exercisesInUse, inCoreList, libShowAll, setLibShowAll
} = exercisesMod;
export const { prefillSets, startableItem, repeatBlocks, startFromTemplate, startEmpty, repeatLast, deloadTail, addExerciseToActive } = startMod;
export const { addSet, removeSetById, removeSet, removeExercise, findSet, restAfter, roundRest, toggleDone, focusSet, typeSetValue } = liveMod;
export const {
  swapBlock, swapImpl, canUndoSwap, undoSwap, canRememberAlt, rememberAlt, altHint, acceptAlt, adaptActive, skipExercise, unskipExercise, skipAlt, rememberRest
} = swapMod;
export const {
  STALE_ASK_MS, STALE_AUTO_MS, lastActivity, staleRef, staleKind, hasWorkDone, staleSince, ackStale, markActivity, resolveColdStopwatch,
  autoFinishStale, finishWorkout, cancelWorkout, deleteWorkout, emptySet, setHasResult, putHistoryWorkout
} = finishMod;
export const { migrate } = migrateMod;
export const { applyPrefs, setModule } = settingsMod;
export const { init, sanitizeDraftObj, readRawData, readRecovery, readPreMigrate, markBootStable, onStateReplaced, replaceState, resetAll } = bootMod;
export const { CRASH_LOOP_THRESHOLD, BOOT_STABLE_MS, BOOT_GUARD_KEY, parseBootGuard, decideBoot } = crashMod;
export type { WExercise } from './seed';
