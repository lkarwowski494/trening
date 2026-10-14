/*
 * Zamiana ćwiczenia i przyrządu w treningu w toku (E2, docs/14 pkt 3), cofnięcie zamiany, zamienniki per miejsce w szablonie (pkt 4),
 * „Pomiń dziś” i zapamiętanie przerwy.
 * Zależy od: ./core, ./sets, ./places, ./start, ./history, ./templates, ./groups, ./exercises; zewnętrzne: ../seed, ../equipment.
 */
import { uid, type Impl, type Workout, type WSet, type WExercise, type Template, type TemplateItem, type TemplateAlt, type Location } from '../seed';
import { implsAt, availability } from '../equipment';
import { save, getState } from './core';
import { exById, restFor, isRoundSet } from './sets';
import { locationById, stampImpl } from './places';
import { prevOfActiveBlock } from './history';
import { normalizeGroups } from './groups';
import { rowsFor } from './templates';
import { purgeOrphans } from './exercises';
import { prefillSets } from './start';
import type { AdaptChoice } from '../adapt';

/* ---------- E2: zamiana ćwiczenia w treningu w toku (docs/14 pkt 3) ---------- */
/** Pozycja szablonu, z której powstał blok (gdy trening ma szablon, a pozycja wciąż istnieje). */
const tplItemOf = (w: Workout, e: WExercise) => {
  const tpl = w.templateId ? getState().templates.find(x => x.id === w.templateId) : null;
  return tpl && e.tplItemId ? tpl.items.find(x => x.id === e.tplItemId) : undefined;
};
/** Audyt kontrolny 1, LIVE2-03: przy podziale bloku w treningu deload zapamiętana pełna liczba serii (deloadFull — liczba BLOKU) przechodzi na nowy
 * blok: A zostaje z odhaczonymi (bez znacznika), B — reszta pełnej liczby, gdy jego serie (`left`) są od niej mniejsze. Suma łańcucha = pełna liczba. */
function splitDeload(A: WExercise, B: WExercise, left: WSet[]) {
  const full = Number(A.deloadFull) || 0; delete A.deloadFull; if (!full) return;
  const rest = full - A.sets.filter(isRoundSet).length; if (rest > left.filter(isRoundSet).length) B.deloadFull = rest;
}
/**
 * Zamiana ćwiczenia bloku `blockId` na `toExId` „tylko dziś” (W1, tabela docs/14 pkt 3.2). Wartości A NIGDY nie przechodzą do B (docs/10 pkt 4.6):
 *  - blok bez odhaczonych serii — zamiana W MIEJSCU: to samo id bloku, nowe serie (nowe id) tych samych rodzajów i w tej samej liczbie, wartości
 *    z „Poprzednio” B (prefillSets, reguła pkt 3.6); zakres powtórzeń, pozycja szablonu, superset i przerwa bloku (D4 a) bez zmian;
 *  - część serii odhaczona — PODZIAŁ: A zostaje z odhaczonymi seriami, nowy blok B tuż pod A dostaje resztę (splitFrom = A — rundy supersetu, cofnięcie);
 *  - wszystkie odhaczone — nic (przycisk ukryty, D3 a).
 * `swappedFrom` = oryginał (A→B→C zostaje A; powrót do oryginału go usuwa); przyrząd od nowa wg miejsca, bez przypięcia. `restSec` — przerwa
 * zamiennika per miejsce (W3, pkt 4.3), inaczej przerwa bloku. Zwraca id usuniętych serii (ekran zatrzymuje ich stoper) i id bloku B.
 */
export function swapBlock(blockId: string, toExId: string, opts: { restSec?: number | null; impl?: Impl } = {}): { goneSetIds: string[];
    blockId: string } | null {
  const a = getState().active; const r = a ? swapBlockIn(a, blockId, toExId, opts) : null; if (a && r) saveSwapped(a); return r;
}
/** Rdzeń swapBlock bez zapisu — zmienia tylko `a` w pamięci (0.18: adaptActive składa kilka zamian w jeden zapis). */
function swapBlockIn(a: Workout, blockId: string, toExId: string, opts: { restSec?: number | null; impl?: Impl }): { goneSetIds: string[];
    blockId: string } | null {
  const ei = a.exercises.findIndex(x => x.id === blockId); if (ei < 0) return null;
  const A = a.exercises[ei]; const B = exById(toExId); if (!B || B.archived || B.id === A.exerciseId) return null;
  const left = A.sets.filter(x => !x.done); if (!left.length) return null;
  const orig = A.swappedFrom ?? A.exerciseId; const it = tplItemOf(a, A);
  let blk: WExercise;
  if (left.length === A.sets.length) { blk = A; A.exerciseId = B.id; delete A.implPinned; }
  else {
    blk = { id: uid(), exerciseId: B.id, restSec: A.restSec, repMin: A.repMin, repMax: A.repMax, groupId: A.groupId, sets: [], splitFrom: A.id,
        ...(A.tplItemId ? { tplItemId: A.tplItemId } : {}) };
    A.sets = A.sets.filter(x => x.done); a.exercises.splice(ei + 1, 0, blk);
    splitDeload(A, blk, left);
  }
  if (orig !== B.id) blk.swappedFrom = orig; else delete blk.swappedFrom;
  stampImpl(blk, a.locationId);
  {
    const loc = locationById(a.locationId);
    if (opts.impl && loc && implsAt(B, loc).includes(opts.impl)) {
      blk.impl = opts.impl;
      blk.implPinned = true;
    }
  } /* W3 P5a: przyrząd z zamiennika per miejsce */
  if (typeof opts.restSec === 'number' && opts.restSec >= 0) blk.restSec = Math.min(1800, Math.round(opts.restSec));
  blk.sets = prefillSets(B, left.map(x => x.kind), prevOfActiveBlock(a, blk), a.locationId, blk.impl, it?.targetSec ?? '', '', 0, !!blk.implPinned);
  return { goneSetIds: left.map(x => x.id), blockId: blk.id };
}
/**
 * E2 D5 (docs/14 pkt 3.7): „ten sam ruch, inny przyrząd” — to samo ćwiczenie, przyrząd `impl` wybrany ręcznie (implPinned), bez swappedFrom.
 * Wartości z „Poprzednio” tym przyrządem (8c) i z listą ciężarów tego przyrządu (M3). Blok z odhaczonymi seriami — podział jak przy zamianie
 * ćwiczenia (P2, odpowiedź właściciela 04.10.2026 w interpretacji z docs/14 pkt 9): odhaczone zostają przy starym przyrządzie, nowy blok dostaje resztę.
 * Przyrząd musi być w miejscu treningu (implsAt) i różny od bieżącego; wszystkie serie odhaczone — nic.
 */
export function swapImpl(blockId: string, impl: Impl): { goneSetIds: string[]; blockId: string } | null {
  const a = getState().active; const r = a ? swapImplIn(a, blockId, impl) : null; if (a && r) save(a); return r;
}
/** Rdzeń swapImpl bez zapisu (0.18). */
function swapImplIn(a: Workout, blockId: string, impl: Impl): { goneSetIds: string[]; blockId: string } | null {
  const ei = a.exercises.findIndex(x => x.id === blockId); if (ei < 0) return null;
  const A = a.exercises[ei]; const ex = exById(A.exerciseId); const loc = locationById(a.locationId);
  if (!ex || !loc || impl === A.impl || !implsAt(ex, loc).includes(impl)) return null;
  const left = A.sets.filter(x => !x.done); if (!left.length) return null; const it = tplItemOf(a, A);
  let blk: WExercise;
  if (left.length === A.sets.length) blk = A;
  else {
    blk = { id: uid(), exerciseId: A.exerciseId, restSec: A.restSec, repMin: A.repMin, repMax: A.repMax, groupId: A.groupId, sets: [], splitFrom: A.id,
        ...(A.tplItemId ? { tplItemId: A.tplItemId } : {}), ...(A.swappedFrom ? { swappedFrom: A.swappedFrom } : {}) };
    A.sets = A.sets.filter(x => x.done); a.exercises.splice(ei + 1, 0, blk);
    splitDeload(A, blk, left);
  }
  blk.impl = impl; blk.implPinned = true;
  const own = it && it.exerciseId === ex.id && !blk.swappedFrom ? it : undefined;
  blk.sets = prefillSets(ex, left.map(x => x.kind), prevOfActiveBlock(a, blk), a.locationId, impl, it?.targetSec ?? '', blk === A ? own?.startWeight ?? '' : '',
      0 /* numeracja jak „Poprzednio” na ekranie (hintFor — od początku bloku) */, true, blk === A ? rowsFor(own, left.map(x => x.kind)) : undefined);
  return { goneSetIds: left.map(x => x.id), blockId: blk.id };
}
/** „↺ cofnij zamianę” (pkt 3.4): blok-zamiennik bez odhaczonych serii, a oryginał wciąż istnieje (nieusunięty). */
export const canUndoSwap = (e: WExercise) => {
  const A = e.swappedFrom ? exById(e.swappedFrom) : undefined;
  return !!A && !A.archived && !e.sets.some(x => x.done);
};
/** Cofnięcie zamiany (pkt 3.4). Po podziale (blok A wciąż w treningu) serie B wracają na koniec A jako nowe serie A (numeracja serii roboczych dalej
 * od odhaczonych), B znika. Inaczej — w miejscu: wraca oryginał z wartościami jak przy starcie (przerwa pozycji szablonu, gdy blok z niej powstał). */
export function undoSwap(blockId: string): { goneSetIds: string[] } | null {
  const a = getState().active; const r = a ? undoSwapIn(a, blockId) : null; if (a && r) saveSwapped(a); return r;
}
/** Rdzeń undoSwap bez zapisu (0.18). */
function undoSwapIn(a: Workout, blockId: string): { goneSetIds: string[] } | null {
  const ei = a.exercises.findIndex(x => x.id === blockId); if (ei < 0) return null;
  const B = a.exercises[ei]; if (!canUndoSwap(B)) return null;
  const gone = B.sets.map(x => x.id); const kinds = B.sets.map(x => x.kind);
  /* audyt L1: scalenie z blokiem podziału tylko, gdy to oryginał (A) — po A→B w miejscu i B→C z podziałem C wraca do A, jak obiecuje „zamiast: A” */
  const P = B.splitFrom ? a.exercises.find(x => x.id === B.splitFrom && x.id !== B.id && x.exerciseId === B.swappedFrom) : undefined;
  const exP = P ? exById(P.exerciseId) : undefined;
  if (P && exP) {
    a.exercises.splice(ei, 1); normalizeGroups(a.exercises);
    const from = P.sets.filter(x => x.kind !== 'warmup' && x.kind !== 'drop').length;
    if (B.deloadFull) P.deloadFull = P.sets.filter(isRoundSet).length + B.deloadFull; /* LIVE2-03: pełna liczba wraca do scalonego bloku */
    P.sets.push(...prefillSets(exP, kinds, prevOfActiveBlock(a, P), a.locationId, P.impl, tplItemOf(a, P)?.targetSec ?? '', '', from));
  } else {
    const A = exById(B.swappedFrom!)!; B.exerciseId = A.id; delete B.swappedFrom; delete B.implPinned; delete B.splitFrom; stampImpl(B, a.locationId);
    const it = tplItemOf(a, B); const own = it && it.exerciseId === A.id ? it : undefined;
    if (own) B.restSec = typeof own.restSec === 'number' && own.restSec >= 0 ? own.restSec : restFor(A);
    B.sets = prefillSets(A, kinds, prevOfActiveBlock(a, B), a.locationId, B.impl, own?.targetSec ?? '', own?.startWeight ?? '', 0, false, rowsFor(own, kinds));
  }
  return { goneSetIds: gone };
}
/** TST2-03 (audyt kontrolny 1, wariant A): po zamianie albo jej cofnięciu ćwiczenie usunięte w trakcie treningu (archiwum) bez ostatniego odwołania
 * znika od razu — jak removeExercise i jak migrate przy starcie (stan w pamięci = migrate(stan)). */
function saveSwapped(a: Workout) {
  const before = getState().exercises.length;
  purgeOrphans();
  if (getState().exercises.length !== before) save(); else save(a);
}
/* ---------- E2 W3: zamienniki per miejsce w szablonie (docs/14 pkt 4) ---------- */
/** Pozycja szablonu bloku (tylko z szablonu treningu) i miejsce treningu (tylko istniejące). */
function altCtx(w: Workout, e: WExercise): { tpl: Template; item: TemplateItem; loc: Location } | null {
  const tpl = w.templateId ? getState().templates.find(x => x.id === w.templateId) : undefined;
  const item = tpl && e.tplItemId ? tpl.items.find(x => x.id === e.tplItemId) : undefined;
  const loc = locationById(w.locationId); return tpl && item && loc ? { tpl, item, loc } : null;
}
/** Wpis, który zapisałby „Zawsze w” dla bloku: zamiennik B pozycji A (swappedFrom = ćwiczenie pozycji) albo A z przyrządem wybranym ręcznie (P5a). */
function altOfBlock(c: { item: TemplateItem; loc: Location }, e: WExercise): TemplateAlt | null {
  const pin = e.implPinned && e.impl ? { impl: e.impl } : {};
  if (e.swappedFrom === c.item.exerciseId && e.exerciseId !== c.item.exerciseId)
    return { locationId: c.loc.id, exerciseId: e.exerciseId, restSec: null, ...pin };
  if (!e.swappedFrom && e.exerciseId === c.item.exerciseId && e.implPinned && e.impl)
    return { locationId: c.loc.id, exerciseId: e.exerciseId, restSec: null, impl: e.impl };
  return null;
}
const sameAlt = (x: TemplateAlt | undefined, y: TemplateAlt) => !!x && x.exerciseId === y.exerciseId && (x.impl ?? null) === (y.impl ?? null);
/** „Zawsze w: <Miejsce>” (pkt 4.1, P1 a, P5a a): trening ma istniejące miejsce i szablon z pozycją bloku, blok zastępuje ćwiczenie pozycji (albo ma
 * przypięty przyrząd), a takiego wpisu dla tego miejsca jeszcze nie ma. */
export function canRememberAlt(w: Workout, e: WExercise): boolean {
  const c = altCtx(w, e); const n = c ? altOfBlock(c, e) : null; if (!c || !n) return false;
  /* audyt 0.10 TST-01 (nocne losowe sekwencje 08.10): zamiennik usunięty w trakcie treningu (archiwum) nie trafia do szablonu */
  const x = exById(n.exerciseId); if (!x || x.archived) return false;
  return !sameAlt(c.item.alternates?.find(z => z.locationId === c.loc.id), n);
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
  const alt = c.item.alternates?.find(x => x.locationId === c.loc.id);
  const B = alt ? exById(alt.exerciseId) : undefined;
  if (!alt || !B || B.archived) return undefined;
  if (alt.exerciseId === e.exerciseId) return alt.impl && alt.impl !== e.impl && implsAt(B, c.loc).includes(alt.impl) ? alt : undefined;
  return availability(B, c.loc).ok ? alt : undefined;
}
/** „Zamień” z podpowiedzi (pkt 4.3): zamiana w miejscu z przerwą wpisu (pusta — przerwa bloku, D4 a) i przyrządem wpisu (P5a). */
export function acceptAlt(blockId: string): { goneSetIds: string[]; blockId: string } | null {
  const w = getState().active;
  const e = w?.exercises.find(x => x.id === blockId);
  const alt = w && e ? altHint(w, e) : undefined;
  if (!w || !e || !alt) return null;
  if (alt.exerciseId !== e.exerciseId) return swapBlock(blockId, alt.exerciseId, { restSec: alt.restSec, impl: alt.impl });
  const r = swapImpl(blockId, alt.impl!);
  if (r && alt.restSec != null) {
    const b = w.exercises.find(x => x.id === r.blockId);
    if (b) {
      b.restSec = alt.restSec;
      save(w);
    }
  }
  return r;
}
/** „Pomiń dziś” (docs/21 4a, 07.10.2026 wieczór): reszta bloku pominięta w tym treningu — szablon bez zmian; odhaczone serie zostają.
 * Timery serii bloku zatrzymuje ekran (jak przy usunięciu ćwiczenia — store nie zależy od lib/timer). */
export function skipExercise(blockId: string) {
  const w = getState().active;
  if (w && skipIn(w, blockId)) save(w);
}
/** Rdzeń skipExercise bez zapisu (0.18). */
function skipIn(w: Workout, blockId: string): boolean {
  const e = w.exercises.find(x => x.id === blockId);
  if (!e) return false;
  e.skipped = true;
  return true;
}
export function unskipExercise(blockId: string) {
  const w = getState().active;
  const e = w?.exercises.find(x => x.id === blockId);
  if (!w || !e) return;
  delete e.skipped;
  save(w);
}
/**
 * 0.18 „Dostosuj do miejsca” (docs/33): wszystkie wybory z okna naraz — w pamięci kolejno swapBlock / swapImpl / undoSwap / skipExercise,
 * potem JEDEN zapis (restart w trakcie = nic nie zastosowano; w pamięci zmiana jest wszystko albo nic). Szablony i plan nie są dotykane
 * (zamiany tylko w tym treningu). Blok bez wyboru zostaje bez zmian. Wybór nieprawidłowy (brak bloku, brak aktywnego treningu, ten sam blok dwa razy,
 * odrzucona zamiana) cofa całość i zwraca null — nic się nie zmienia.
 * Zwraca: `goneSetIds` — serie, które zniknęły z treningu (ekran: afterSwap zatrzymuje ich stopery); `skippedSetIds` — nieodhaczone serie
 * pominiętych bloków (stoper serii; jak „Pomiń dziś”); `swapped`/`restored`/`skipped` — liczby do komunikatu „Zamieniono N ćwiczeń”.
 * Po wywołaniu ekran woła afterSwap([...goneSetIds, ...skippedSetIds]) (relabelRest).
 */
export function adaptActive(choices: readonly AdaptChoice[]): { goneSetIds: string[]; skippedSetIds: string[]; swapped: number; restored: number;
    skipped: number } | null {
  const a = getState().active; if (!a || !choices.length) return null;
  const ids = choices.map(c => c.blockId); if (new Set(ids).size !== ids.length) return null;
  const before = JSON.parse(JSON.stringify(a.exercises)) as Workout['exercises'];
  const out = { goneSetIds: [] as string[], skippedSetIds: [] as string[], swapped: 0, restored: 0, skipped: 0 };
  for (const c of choices) {
    const blk = a.exercises.find(x => x.id === c.blockId); let ok = !!blk;
    if (blk && c.kind === 'swap') { const r = swapBlockIn(a, c.blockId, c.toExId, { restSec: c.restSec, impl: c.impl }); ok = !!r; if (r) { out.goneSetIds.push(...r.goneSetIds); out.swapped++; } }
    else if (blk && c.kind === 'impl') { const r = swapImplIn(a, c.blockId, c.impl); ok = !!r; if (r) { out.goneSetIds.push(...r.goneSetIds); out.swapped++; } }
    else if (blk && c.kind === 'restore') { const r = undoSwapIn(a, c.blockId); ok = !!r; if (r) { out.goneSetIds.push(...r.goneSetIds); out.restored++; } }
    else if (blk && c.kind === 'skip') { const ids = blk.sets.filter(x => !x.done).map(x => x.id); ok = !blk.skipped && skipIn(a, c.blockId); if (ok) { out.skippedSetIds.push(...ids); out.skipped++; } }
    if (!ok) { a.exercises = before; return null; } /* wszystko albo nic */
  }
  saveSwapped(a); return out;
}
/** „✕” przy podpowiedzi: tylko ten blok, tylko ten trening (M4). */
export function skipAlt(blockId: string) {
  const w = getState().active;
  const e = w?.exercises.find(x => x.id === blockId);
  if (!w || !e) return;
  e.altSkip = true;
  save(w);
}
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
