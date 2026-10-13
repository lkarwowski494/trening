/*
 * Start treningu: z szablonu (także deload), pusty, „Powtórz ostatni”; wartości nowych serii bloku (prefillSets — jedno miejsce dla startu,
 * zamiany i cofnięcia zamiany); brakujące serie skróconego treningu (deloadTail); dodanie ćwiczenia do treningu w toku.
 * Zależy od: ./core, ./time, ./places, ./setvals, ./sets, ./history, ./templates, ./groups; zewnętrzne: ../seed, @/lib/deload-sets, ../equipment.
 */
import { deloadSets } from '@/lib/deload-sets';
import { uid, base, hasTime, hasReps, hasWeight, hasDistance, type Impl, type SetKind, type Workout, type WSet, type WExercise, type Exercise, type Template,
    type TemplateItem, type TRow } from '../seed';
import { implsAt } from '../equipment';
import { tzOffsetAt, localISODate } from './time';
import { armAutoAdapt } from '../adaptPick';
import { flush, save, getState } from './core';
import { exById, bandById, isBW, restFor, usesBand, isRoundSet } from './sets';
import { blankSet, copyVals, markPre, stripUnused, assistLost } from './setvals';
import { locationById, startLocationId, placeOnDay, offListAt, prevFromOther, implAtLoc, pinnedImpl, srcSetAt, stampImpl } from './places';
import { finishedWorkouts, previousBlockFor, occurrence, occurrences } from './history';
import { normalizeGroups } from './groups';
import { tplRows } from './templates';

/* ---------- workout actions ---------- */
const newWorkout = (templateId: string | null, templateName: string, locPref?: string | null): Workout => {
  const st = getState();
  const w: Workout = { ...base(st.ownerId), loggedBy: st.ownerId, sessionMode: 'solo', healthUUID: null, templateId, templateName, startedAt: Date.now(),
      finishedAt: null, note: '', exercises: [] };
  w.tzOffsetMin = tzOffsetAt(w.startedAt); /* J3 */
  w.live = true; /* 0.16.0 (P11 B): start na żywo — jedyne miejsce, które ustawia znacznik (trening wstecz i import CSV tworzą Workout osobno, bez niego) */
  /* 0.19 (docs/33 B, P4 A): miejsce zapisane w planie na dziś bierze pierwszeństwo przed miejscem szablonu (każda droga startu idzie tędy);
   * okno „Dostosuj” otworzy się samo po starcie (ActiveWorkout, gdy są propozycje) — nigdy automatyczna zamiana */
  const dayPlace = placeOnDay(localISODate(new Date(w.startedAt)));
  const loc = startLocationId(dayPlace ?? locPref);
  if (loc) w.locationId = loc;
  if (dayPlace && loc === dayPlace) armAutoAdapt(w.id);
  return w;
};
/**
 * E2 (docs/14 pkt 3.3): wartości nowych serii bloku — JEDNO miejsce dla startu z szablonu, zamiany ćwiczenia i cofnięcia zamiany (bezpiecznik M3 raz).
 * `kinds` — rodzaje nowych serii. Serie robocze (zwykłe, do upadku) dostają serię źródła `prevAll` (bez drop setów) o numerze serii roboczej
 * (srcSetAt — za końcem źródła ostatnia; numeracja od `from`, np. dalej od odhaczonych przy cofnięciu podziału); rozgrzewki i drop sety — puste.
 * Bez źródła: ciężar startowy pozycji szablonu (`startWeight` — tylko start z szablonu i cofnięcie do A; zamiana podaje '', bo to ciężar A).
 * Cel czasu (`targetSec`) — przy metryce z czasem, w seriach poza rozgrzewką.
 */
export function prefillSets(ex: Exercise, kinds: readonly SetKind[], prevAll: { workout: Workout; sets: WSet[] } | null, locationId: string | null | undefined,
    impl: Impl | null | undefined, targetSec: number | '', startWeight: number | '' = '', from = 0, pinned = false, rows?: readonly TRow[]): WSet[] {
  const src = prevAll ? prevAll.sets.filter(x => x.kind !== 'drop') : []; const m = ex.metric ?? 'weight_reps';
  const away = !!prevAll && prevFromOther(prevAll, ex.id, locationId, impl); let j = from;
  return kinds.map((kind, k) => {
    const work = kind !== 'warmup' && kind !== 'drop'; const row = rows?.[k];
    const p0 = work ? srcSetAt(src, j++) : null;
    const p = assistLost(ex, p0) ? null : p0; /* runda 72: jak przy odhaczaniu; runda 82c: wspólne mapowanie serii źródła (srcSetAt) */
    const s = { ...blankSet(), kind, warmup: kind === 'warmup',
        ...(p ? copyVals(p) : work ? { weight: (isBW(ex) || !hasWeight(m)) ? '' : (startWeight === '' ? '' : Math.max(0, Number(startWeight))), /* runda 48 */
        addKg: isBW(ex) && hasWeight(m) ? startWeight : '' } : {}) } as WSet;
    // Cel czasu z szablonu wygrywa z czasem z poprzedniej sesji — inaczej stoper ucinał serię na starym wyniku (runda 2).
    // Czas z poprzedniej sesji zostaje tylko podpowiedzią („Poprzednio”) — jako wartość stawałby się celem stopera (runda 4).
    if (hasTime(m)) s.durationSec = kind !== 'warmup' && Number(targetSec) > 0 ? Number(targetSec) : ''; // runda 30: cel 0 = bez celu (jak w repeatLast)
    /* schemat 17: bez „ostatnio” — plan z wiersza szablonu (także rozgrzewki i drop sety); cel czasu z wiersza */
    if (row) {
      if (!p) {
        if (hasWeight(m)) {
          if (isBW(ex)) s.addKg = row.weight; else s.weight = row.weight === '' ? '' : Math.max(0, Number(row.weight));
        }
        if (hasReps(m)) s.reps = row.reps;
        if (hasDistance(m)) s.distanceM = row.distanceM;
        if (row.bandId && usesBand(ex) && bandById(row.bandId)) s.bandId = row.bandId;
      }
      if (hasTime(m))
        s.durationSec = Number(row.durationSec) > 0 ? Number(row.durationSec) : ''; } /* audyt 85364ad L3: czas tylko z wiersza (także rozgrzewki) */
    /* audyt M3 + weryfikacja 2: tylko źródło „gdzie indziej” (prevFromOther: inne, znane miejsce albo — LOW 3 — znany, inny przyrząd; treningi sprzed
     * miejsc — jak M8 — nie); wtedy bez ciężaru nie przepisujemy też powtórzeń — seria zostaje pusta, a nie „ciężar pusty + powtórzenia” */
    if (p && away && offListAt(ex, locationId, s.weight, pinned && impl ? impl : undefined)) { s.weight = ''; if (p.reps === s.reps) s.reps = ''; }
    return markPre(stripUnused(ex, s));
  });
}
/** Pozycja szablonu, która trafi do treningu przy starcie (runda 42: usunięte ćwiczenie, np. z importu, nie wraca do treningu). Audyt 0.10 (LOG-17):
 * ten sam filtr liczy serie w pytaniu deload (lib/start.ts deloadCounts). */
export const startableItem = (it: TemplateItem) => { const ex = exById(it.exerciseId); return !!ex && !ex.archived; };
/** Bloki ostatniego treningu, które wstawi „Powtórz ostatni” (ćwiczenie istnieje i nie jest usunięte) — także dla pytania deload (audyt 0.10, D1). */
export const repeatBlocks = (w: Workout) => w.exercises.filter(e => { const ex = exById(e.exerciseId); return !!ex && !ex.archived; });
/** `deload` (decyzja 08.10.2026, B): mniej serii roboczych na ćwiczenie (deloadKeep: o około 1/3–1/2), ciężary bez zmian, szablon bez zmian (lib/deload-sets).
 * Audyt 0.10 (LIVE-12): przy treningu w toku nic nie robi i zwraca false — drugi start (podwójne tapnięcie, drugie okno deload) nie nadpisuje treningu. */
export function startFromTemplate(tpl: Template, opts?: { deload?: boolean }): boolean {
  const st = getState(); if (st.active) return false; const w = newWorkout(tpl.id, tpl.name, tpl.locationId);
  tpl.items.forEach((it, ii) => {
    if (!startableItem(it)) return; const ex = exById(it.exerciseId)!;
    // Runda 7: drop sety poprzedniej sesji nie są źródłem wartości dla zwykłych serii szablonu (jak przy odhaczaniu, runda 6).
    const impl = implAtLoc(ex, w.locationId); /* decyzja 8c: „Poprzednio” = ostatni raz tym samym przyrządem */
    const prevAll = previousBlockFor(it.exerciseId, occurrence(tpl.items, ii), occurrences(tpl.items, it.exerciseId), it.id, tpl.id, impl);
    const rows = tplRows(it); /* schemat 17: typy i plan z wierszy szablonu */
    const sets = prefillSets(ex, rows.map(r => r.kind), prevAll, w.locationId, impl, it.targetSec, it.startWeight, 0, false, rows);
    // Przerwa: ustawiona w pozycji szablonu wygrywa; puste pole w szablonie (null) = przerwa z ćwiczenia albo domyślna.
    const cut = opts?.deload ? deloadSets(sets) : sets;
    const nFull = sets.filter(isRoundSet).length; /* audyt 0.10 (D1+): pełna liczba serii roboczych przyciętego bloku */
    w.exercises.push({ id: uid(), exerciseId: ex.id, restSec: typeof it.restSec === 'number' && it.restSec >= 0 ? it.restSec
        : restFor(ex), /* null w szablonie = przerwa z ćwiczenia */ repMin: it.repMin, repMax: it.repMax, groupId: it.groupId ?? null, sets: cut,
        tplItemId: it.id, ...(impl ? { impl } : {}), ...(cut.filter(isRoundSet).length < nFull ? { deloadFull: nFull } : {}) });
  });
  normalizeGroups(w.exercises); if (opts?.deload) w.deload = true; /* audyt 0.10 (D1+): znacznik treningu deload */
  st.active = w; save(); flush(); return true;
}
export function startEmpty(): boolean {
  if (getState().active) return false; /* audyt 0.10 (LIVE-12) */
  getState().active = newWorkout(null, '');
  save();
  flush();
  return true;
}
/** „Powtórz ostatni”. `deload` (audyt 0.10, D1 / MER-05) — wynik ma być lżejszy: zwykły trening dostaje to samo cięcie co start z szablonu
 * (deloadSets na blok), a trening już skrócony (Workout.deload) powtarza się jak jest — NIGDY drugiego cięcia (D1+, decyzja 08.10.2026).
 * Bez `deload` — pełny trening: skrócony wraca do pełnego (deloadTail: wiersze szablonu albo zapamiętana liczba serii). */
export function repeatLast(opts?: { deload?: boolean }): boolean {
  const last = finishedWorkouts()[0]; if (!last || getState().active) return false; /* audyt 0.10 (LIVE-12): trening w toku zostaje */
  // Powtarza to, co faktycznie zrobiono (także ćwiczenia dodane/usunięte w trakcie), a nie szablon, z którego wystartowano (runda 2).
  /* Integracja 0.9.0: ostatni trening bez locationId (sprzed miejsc, z importu), choć miejsca są — to „nieznane miejsce”, nie „inne miejsce”:
   * nowy trening dostaje miejsce główne, a wartości kopiujemy bez wstrzymywania ciężarów spoza listy (jak treningi sprzed miejsc
   * w startFromTemplate i przy odhaczaniu; docs/10, docs/12). Świadomie bez zmian — ekran treningu pokazuje wtedy dopisek „ciężaru … nie ma tutaj”
   * (runda 82, MEDIUM 1). Wstrzymanie tylko dla źródła „gdzie indziej” (prevFromOther: inne, znane miejsce albo znany, inny przyrząd — LOW 3). */
  const w = newWorkout(last.templateId, last.templateName, last.locationId);
  // Runda 22: cel czasu z pozycji szablonu, z której powstał blok (stary wynik nie staje się celem — runda 4).
  const tplOf = last.templateId ? getState().templates.find(x => x.id === last.templateId) : null;
  const tgt = (e: WExercise): number | '' => {
    const it = tplOf && e.tplItemId ? tplOf.items.find(x => x.id === e.tplItemId && x.exerciseId === e.exerciseId) : null;
    return it && Number(it.targetSec) > 0 ? Number(it.targetSec) : '';
  };
  const keepPin = (e: WExercise) => {
    const ex = exById(e.exerciseId);
    const loc = locationById(w.locationId);
    return !!(e.implPinned && e.impl && ex && loc && last.locationId === w.locationId && implsAt(ex, loc).includes(e.impl));
  };
  w.exercises = repeatBlocks(last).map(e => {
    const nw: WExercise = keepPin(e) ? { ...e, id: uid(), sets: [] } : stampImpl({ ...e, id: uid(), sets: [] }, w.locationId);
    if (!keepPin(e))
      /* decyzja 8c: przyrząd w miejscu NOWEGO treningu (nie kopiowany z poprzedniego); E2 D5 (pkt 3.7.5): przyrząd wybrany ręcznie zostaje w tym
       * samym miejscu, gdy wciąż tam jest */
      delete nw.implPinned;
    /* weryfikacja 3 (L2) + LOW 3: jak przy starcie z szablonu — inne, znane miejsce albo znany, inny przyrząd */
    const away = prevFromOther({ workout: last, sets: e.sets }, e.exerciseId, w.locationId, nw.impl);
    nw.sets = e.sets.map(s => ({ ...blankSet(), ...(assistLost(exById(e.exerciseId), s) ? {} : copyVals(s)), durationSec: s.kind === 'warmup' ? '' : tgt(e),
        kind: s.kind === 'failure' ? 'normal' : s.kind ?? (s.warmup ? 'warmup' : 'normal') /* T11: upadek to wynik, nie plan (jak addSet i szablon) */,
        warmup: s.warmup })).map(s => {
      const ex = exById(e.exerciseId); /* ciężar spoza listy tutaj z sesji „gdzie indziej” nie jest wstawiany (ani same powtórzenia) */
      if (away && offListAt(ex, w.locationId, s.weight, pinnedImpl(nw))) { s.weight = ''; s.reps = ''; }
      return markPre(stripUnused(ex, s)); });
    /* audyt 0.10 (D1+): skrócony — „jak ostatnio” albo przywrócenie pełnego; zwykły — cięcie z zapamiętaniem pełnej liczby */
    const nNow = nw.sets.filter(isRoundSet).length; delete nw.deloadFull;
    if (last.deload) { const tail = deloadTail(last, e); const nFull = nNow + tail.filter(x => x.kind !== 'drop').length;
      if (opts?.deload) { if (nFull > nNow) nw.deloadFull = nFull; }
      else {
        const ex = exById(e.exerciseId);
        const lastWork = [...nw.sets].reverse().find(isRoundSet);
        const lastDrop = [...nw.sets].reverse().find(x => x.kind === 'drop');
        nw.sets.push(...tail.map(({ kind, row }) => markPre(stripUnused(ex,
            { ...blankSet(), ...copyVals(kind === 'drop' ? lastDrop ?? row : lastWork ?? row), kind, warmup: false })))); } }
    else if (opts?.deload) { nw.sets = deloadSets(nw.sets); if (nw.sets.filter(isRoundSet).length < nNow) nw.deloadFull = nNow; }
    return nw; });
  normalizeGroups(w.exercises); if (opts?.deload) w.deload = true; /* audyt 0.10 (D1+) */
  getState().active = w; save(); flush(); return true;
}
/**
 * Audyt 0.10 (D1+, decyzja 08.10.2026): czego brakuje skróconemu treningowi (Workout.deload) do pełnego — rodzaje serii do dołożenia na końcu bloku:
 * gdy szablon wciąż ma pozycję bloku z tym samym ćwiczeniem — jego wiersze po k-tej serii roboczej (k = serie robocze bloku; drop sety należą do
 * serii, po której są), inaczej brakujące serie robocze do zapamiętanej liczby `deloadFull`. Zwykły trening (albo brak informacji) — nic.
 */
export function deloadTail(last: Workout, e: WExercise): { kind: SetKind; row?: TRow }[] {
  if (!last.deload) return [];
  const tpl = last.templateId ? getState().templates.find(x => x.id === last.templateId) : null;
  /* audyt kontrolny 1, LIVE2-03: łańcuch podziału (zamiana w trakcie — bloki z tą samą pozycją szablonu) to jedna pozycja: serie robocze liczone
   * w całym łańcuchu, brakujące dochodzą tylko do ostatniego powtarzanego bloku; wartości wiersza szablonu tylko, gdy to ćwiczenie pozycji */
  const chain = e.tplItemId ? repeatBlocks(last).filter(x => x.tplItemId === e.tplItemId) : [e]; if (!chain.includes(e)) chain.push(e);
  /* pozycja wciąż z ćwiczeniem bloku łańcucha */
  const it = tpl && e.tplItemId ? tpl.items.find(x => x.id === e.tplItemId && chain.some(b => x.exerciseId === b.exerciseId)) : null;
  if (it) { if (chain[chain.length - 1] !== e) return [];
    const now = chain.reduce((n, b) => n + b.sets.filter(isRoundSet).length, 0); const own = it.exerciseId === e.exerciseId;
    const rows = tplRows(it).filter(r => r.kind !== 'warmup');
    let seen = 0, i = 0;
    for (; i < rows.length; i++) if (rows[i].kind !== 'drop') {
      if (seen === now) break;
      seen++;
    }
    return rows.slice(i).map(r => ({ kind: r.kind === 'failure' ? 'normal' : r.kind, ...(own ? { row: r } : {}) })); }
  const now = e.sets.filter(isRoundSet).length;
  return Array.from({ length: Math.max(0, (Number(e.deloadFull) || 0) - now) }, () => ({ kind: 'normal' as SetKind }));
}
export function addExerciseToActive(ex: Exercise) {
  const a = getState().active; if (!a) return;
  a.exercises.push(stampImpl({ id: uid(), exerciseId: ex.id, restSec: restFor(ex), repMin: null, repMax: null, groupId: null, sets: [blankSet()] },
      a.locationId));
  save(a);
}
