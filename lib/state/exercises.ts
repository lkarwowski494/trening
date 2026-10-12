/*
 * Ćwiczenia: nowe, zmiana sprzętu, przywrócenie, usunięcie (archiwum, gdy ma historię), sprzątanie usuniętych bez historii, listy
 * widoczne i domyślne (filtr „Podstawowe”) oraz odświeżanie zakładki Ćwiczenia (useExercisesTick).
 * Zależy od: ./core, ./sets, ./util, ./places, ./groups; zewnętrzne: ../seed, ../i18n, react.
 */
import { useSyncExternalStore } from 'react';
import { t, lang } from '../i18n';
import { base, loadModeFor, equipFields, LOAD_SOURCE_BY_EQUIPMENT, type State, type Exercise, catalogKey, isNiche } from '../seed';
import { clampName } from './util';
import { S, rev, flush, save, getState, subscribe } from './core';
import { exById, usesBand } from './sets';
import { restampUntouched } from './places';
import { normalizeGroups } from './groups';

/** N3 / PERF-01: zakładka Ćwiczenia — odświeżenie tylko, gdy zmieni się to, co pokazuje lista (id, nazwa, grupa, sprzęt, tempo, guma, usunięcie);
 * podpis liczony raz na zmianę stanu (rev). Znak w notatce ćwiczenia, szablonie albo serii treningu nie przerysowuje ukrytej listy 854+ wierszy. */
let exSig: { rev: number; s: State | null; v: string } = { rev: -1, s: null, v: '' };
const exSnap = () => {
  if (exSig.rev !== rev || exSig.s !== S)
    exSig = { rev, s: S, v: lang() + "\u0003" + (S?.exercises ?? []).map(
        e => `${e.id}\u0001${e.name}\u0001${e.group}\u0001${e.equipment}\u0001${e.tempo ?? ''}\u0001${e.archived ? 1 : 0}${usesBand(e) ? 1 : 0}`).join(
        '\u0002') };
  return exSig.v;
};
export const useExercisesTick = () => useSyncExternalStore(subscribe, exSnap, exSnap);
export function newExercise(name = t('Nowe ćwiczenie')): Exercise {
  const e: Exercise = { ...base(getState().ownerId), name: clampName(name), group: 'inne', equipment: 'inne', metric: 'weight_reps', loadMode: 'total',
      restSec: null, restWarmupSec: null, muscles: [], secondaryMuscles: [], bandAssistable: false, tempo: '', notes: '', ...equipFields('', 'inne', false) };
  getState().exercises.push(e);
  save();
  return e;
}
/** Zmiana sprzętu ustawia domyślny tryb liczenia (wcześniej zostawał stary — np. ×2 dla masy ciała). */
export function setEquipment(e: Exercise, eq: Exercise['equipment']) {
  if (e.equipment === eq) return; /* runda 40: ten sam chip nie resetuje ustawień */
  e.equipment = eq;
  e.loadMode = loadModeFor(eq, catalogKey(e) ?? e.name);
  e.loadSource = LOAD_SOURCE_BY_EQUIPMENT[eq]; /* P-003: źródło obciążenia za sprzętem */
  /* weryfikacja 3 (L5): ćwiczenie z biblioteki po zmianie sprzętu nie trzyma wymagań katalogu (np. hantle przy ruchu na linkach) — bez wymagań
   * (zawsze dostępne),
   * catalogRev 'user' (start aplikacji go nie nadpisze katalogiem) */
  if (e.lib) { e.requires = []; e.recommended = []; delete e.implements; e.catalogRev = 'user'; }
  /* macierz niezmienników 06.10 (L5): bloki tego ćwiczenia w treningu w toku bez odhaczonych serii dostają przyrząd wg nowego sprzętu — jak przy
   * zmianie sprzętu miejsca */
  exerciseEdited(e.id); save(e); }
/** Po zmianie ćwiczenia (sprzęt, źródło obciążenia, wymagania): bloki tego ćwiczenia w treningu w toku bez odhaczonych serii dostają przyrząd
 * wg ćwiczenia — reguła L5. Wspólne dla setEquipment i „Zapisz” szkicu ćwiczenia (lib/draft.ts; audyt kontrolny 1, UI2-01: przyrząd decyduje
 * o mnożniku stacji ×2 w objętości i rekordach). */
export function exerciseEdited(exId: string) {
  const a = getState().active;
  if (a && a.exercises.some(x => x.exerciseId === exId)) {
    restampUntouched(a);
    save(a);
  }
}
/** „Przywróć …” (lista ćwiczeń, wybór, zamiana): bez pola archived — tak samo jak po wczytaniu danych (migrate usuwa archived ≠ true; macierz
 * niezmienników 06.10). */
export function restoreExercise(e: Exercise) { delete e.archived; save(e); }
/** Runda 40: czy ćwiczenie jest w zakończonych treningach (historia — nie sam trening w toku). */
export const exerciseInHistory = (id: string) => getState().workouts.some(w => w.exercises.some(x => x.exerciseId === id));
/** Runda 40: usunięte (zarchiwizowane) ćwiczenia bez historii i spoza treningu w toku znikają na dobre. */
export function purgeOrphans() { const st = getState(); st.exercises = st.exercises.filter(e => !e.archived || exerciseUsed(e.id)); }
/** Czy ćwiczenie występuje w historii lub w treningu w toku. */
export const exerciseUsed = (id: string) => {
  const st = getState();
  return [...st.workouts, ...(st.active ? [st.active] : [])].some(w => w.exercises.some(x => x.exerciseId === id));
};
/**
 * Usunięcie ćwiczenia: znika z listy, wyboru i szablonów. Jeśli ma historię (albo jest w treningu w toku) — jest tylko
 * archiwizowane, żeby historia, CSV i objętość dalej je znały („Historia zostanie”). Bez historii — usuwane na stałe.
 */
export function deleteExercise(id: string) {
  const st = getState(); const e = exById(id); if (!e) return;
  st.templates.forEach(tpl => { tpl.items = tpl.items.filter(i => i.exerciseId !== id); normalizeGroups(tpl.items);
    tpl.items.forEach(i => {
      if (!i.alternates) return;
      i.alternates = i.alternates.filter(x => x.exerciseId !== id);
      if (!i.alternates.length) delete i.alternates;
    }); }); /* E2 W3: zamiennik z usuniętym ćwiczeniem znika (jak M6) */
  if (exerciseUsed(id)) e.archived = true; else st.exercises = st.exercises.filter(x => x.id !== id);
  save(e); flush();
}
/** Ćwiczenia widoczne na listach i w wyborze (bez zarchiwizowanych). */
export const visibleExercises = () => getState().exercises.filter(e => !e.archived);
/** Research biblioteki (decyzja właściciela 09.10.2026, wariant B): id ćwiczeń już użytych — treningi (historia, w toku, „zamienione z”) i szablony
 * (pozycje i zamienniki; plan tygodnia wskazuje szablony). Takie ćwiczenie jest na liście domyślnej, nawet gdy jest niszowe. */
export function exercisesInUse(): Set<string> {
  const st = getState(); const out = new Set<string>();
  for (const w of [...st.workouts, ...(st.active ? [st.active] : [])]) for (const x of w.exercises) {
    out.add(x.exerciseId);
    if (x.swappedFrom) out.add(x.swappedFrom);
  }
  for (const tp of st.templates) for (const it of tp.items) { out.add(it.exerciseId); for (const a of it.alternates ?? []) out.add(a.exerciseId); }
  return out;
}
/** Lista domyślna (Ćwiczenia, wybór ćwiczenia, „Inne” w zamianie): ćwiczenia ZOSTAJE, własne i już użyte; niszowe — wyszukiwaniem albo po zdjęciu filtra. */
export const inCoreList = (e: Exercise, used: ReadonlySet<string>) => !isNiche(e) || used.has(e.id);
/** Filtr „Podstawowe” zdjęty (zapamiętane, wspólne dla listy Ćwiczeń, wyboru i zamiany — jak filtr miejsca). */
export const libShowAll = () => getState().settings.libShowAll === true;
export function setLibShowAll(on: boolean) { const st = getState(); if (on) st.settings.libShowAll = true; else delete st.settings.libShowAll; save(); }
