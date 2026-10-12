/*
 * „Poprzednio” i indeksy historii: zakończone treningi (cache do zmiany historii), treningi z ćwiczeniem, dobór bloku z ostatniej sesji
 * (pozycja szablonu, k-te wystąpienie, przyrząd — decyzja 8c, zamiennik — E2 pkt 3.6), podpowiedź serii i cicha podpowiedź progresji.
 * Zależy od: ./core, ./sets, ./setvals, ./places; zewnętrzne: ../seed, ../units, ../equipment, ../loads.
 */
import { wu, wOut, wIn } from '../units';
import { type Impl, type Workout, type WSet, type WExercise, type Exercise } from '../seed';
import { loadsFor } from '../equipment';
import { nextHeavier } from '../loads';
import { getState, memoHist, memoHistBy } from './core';
import { isBW, repsOf, setLoad, isWorking, setHasValue } from './sets';
import { assistLost } from './setvals';
import { locationById } from './places';

const finishedCache = memoHist(() => getState().workouts.filter(w => w.finishedAt).sort((a, b) => b.startedAt - a.startedAt));
/** Zakończone treningi od najnowszego (cache do następnej zmiany historii — nie modyfikować zwróconej tablicy). */
export function finishedWorkouts(): Workout[] { return finishedCache(); }
/** Wszystkie bloki danego ćwiczenia w treningu (to samo ćwiczenie może wystąpić dwa razy). */
export const blocksOf = (w: Workout, exId: string) => w.exercises.filter(x => x.exerciseId === exId);
/** Runda 74 (wydajność): zakończone treningi z danym ćwiczeniem (od najnowszego) — indeks budowany jednym przejściem na zmianę historii.
 * Wcześniej każde „poprzednio”, sesje i rekordy przechodziły po CAŁEJ historii osobno dla każdego ćwiczenia. */
const exIndex = memoHist(() => { const m = new Map<string, Workout[]>();
  for (const w of finishedWorkouts()) {
    let last = '';
    for (const e of w.exercises) {
      if (e.exerciseId === last) continue;
      last = e.exerciseId;
      const a = m.get(last);
      if (!a) m.set(last, [w]); else if (a[a.length - 1] !== w) a.push(w);
    }
  }
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
const splitImpl = (key: string): [string, Impl | undefined] => {
  const i = key.indexOf(IMPL_SEP);
  return i < 0 ? [key, undefined] : [key.slice(0, i), key.slice(i + 1) as Impl];
};
/** Decyzja 8c — reguła: sesja „pasuje” do przyrządu `impl`, gdy któryś jej blok tego ćwiczenia ma ten sam przyrząd ALBO przyrząd nieznany
 * (trening bez miejsca, dane sprzed schematu 15). Sesje zrobione na pewno innym przyrządem (np. RDL na linkach, gdy dziś hantle) są pomijane. */
const implWorkouts = memoHistBy((key: string): Workout[] => {
  const [exId, impl] = splitImpl(key);
  return workoutsWith(exId).filter(w => w.exercises.some(e => e.exerciseId === exId && (e.impl === undefined || e.impl === impl)));
});
/** Treningi z ćwiczeniem od najnowszego: cała historia (impl undefined) albo tylko pasujące do przyrządu `impl`. */
const histOf = (exId: string, impl: Impl | undefined) => impl === undefined ? workoutsWith(exId) : implWorkouts(exId + IMPL_SEP + impl);
/** Audyt f132330/025ee6a (LOW 4): w wybranej sesji tylko bloki tym samym albo nieznanym przyrządem, gdy takie są — sesja z RDL hantlami
 * i na linkach nie miesza wartości obu przyrządów. `impl` tylko przy aktywnym filtrze 8c (są miejsca, blok ma przyrząd); bez niego — wszystkie bloki. */
const implBlocks = (bl: WExercise[], impl: Impl | undefined): WExercise[] => {
  if (!impl) return bl;
  const same = bl.filter(e => e.impl === undefined || e.impl === impl);
  return same.length ? same : bl;
};
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
/** Runda 72 (T5): ostatni blok z tej samej pozycji szablonu (id pozycji jest unikalne) — dla ćwiczenia, które w szablonie występuje kilka razy. */
function byItemScan(hist: readonly Workout[], exId: string, itemId: string, ok: WOk, impl?: Impl): PrevSets | null {
  let dropOnly: PrevSets | null = null; /* T7: blok z samymi drop setami nie zasłania serii roboczych (jak prevScan) */
  for (const w of hist) {
    if (!ok(w)) continue;
    /* LOW 4: blok innym przyrządem — szukamy dalej */
    const b = w.exercises.find(e => e.exerciseId === exId && e.tplItemId === itemId && (!impl || e.impl === undefined || e.impl === impl));
    const sets = b ? b.sets.filter(s => isWorking(s) && setHasValue(s)) : [];
    if (sets.some(s => s.kind !== 'drop')) return { workout: w, sets };
    if (sets.length && !dropOnly) dropOnly = { workout: w, sets };
  }
  return dropOnly;
}
const prevByItem = memoHistBy((key: string): PrevSets | null => {
  const [k0, impl] = splitImpl(key);
  const [exId, itemId] = k0.split('|');
  return byItemScan(histOf(exId, impl), exId, itemId, ALL, impl);
});
/** T6: starsze dane bez id pozycji szablonu — k-ty blok ćwiczenia z ostatniej sesji tego samego szablonu (gdy miała ich kilka). */
function byTplBlockScan(hist: readonly Workout[], exId: string, tplId: string, k: number, ok: WOk, impl?: Impl): PrevSets | null {
  for (const w of hist) {
    if (!ok(w) || w.templateId !== tplId) continue;
    const bl = implBlocks(blocksOf(w, exId), impl).map(e => e.sets.filter(s => isWorking(s) && setHasValue(s)));
    if (bl.filter(b => b.length).length > 1) { const b = bl[Math.min(k, bl.length - 1)]; if (b.some(s => s.kind !== 'drop')) return { workout: w, sets: b }; } }
  return null;
}
const prevByTplBlock = memoHistBy((key: string): PrevSets | null => {
  const [k0, impl] = splitImpl(key);
  const [exId, tplId, ks] = k0.split('|');
  return byTplBlockScan(histOf(exId, impl), exId, tplId, Number(ks), ALL, impl);
});
/**
 * Runda 8: „Poprzednio” dla k-tego wystąpienia ćwiczenia w treningu/szablonie (to samo ćwiczenie dwa razy, np. ciężko
 * i lżej). Gdy poprzednio było kilka bloków, bierzemy blok o tym samym numerze (albo ostatni); gdy jeden — ten jeden.
 */
/** `impl` (decyzja 8c, 03.10.2026): przyrząd bieżącego bloku (WExercise.impl). Gdy są miejsca i przyrząd jest znany — dobór jak niżej, ale tylko
 * z sesji pasujących do przyrządu (ten sam albo nieznany — implWorkouts), gdziekolwiek były, a w wybranej sesji tylko z bloków tym samym albo
 * nieznanym przyrządem (implBlocks — runda 82, LOW 4); gdy takiej sesji nie ma — ostatni trening w ogóle (wtedy bezpiecznik M3 przy wstawianiu:
 * prevFromOther traktuje znany, inny przyrząd jak inne miejsce — LOW 3).
 * Miejsce samo w sobie NIE ma znaczenia. Bez przyrządu (i zawsze bez miejsc) — dokładnie jak przed P-003. */
export function previousBlockFor(exId: string, k: number, n = 2, tplItemId?: string, tplId?: string | null, impl?: Impl | null,
    swapped = false): { workout: Workout; sets: WSet[] } | null {
  const ik = impl && getState().settings.locations.length && prevCache(exId + IMPL_SEP + impl) ? IMPL_SEP + impl : '';
  if (swapped)
    /* E2 pkt 3.6 */
    return (tplItemId ? prevByItem(exId + '|' + tplItemId + ik) : null) ?? selectBlock(prevCache(exId + ik), k, n, undefined, null, () => null, () => null);
  return selectBlock(prevCache(exId + ik), k, n, tplItemId, tplId, it => prevByItem(exId + '|' + it + ik), tp => prevByTplBlock(`${exId}|${tp}|${k}` + ik));
}
/** Docs/12: „Poprzednio” jak previousBlockFor, ale tylko z sesji rozpoczętych PRZED `before` (i bez treningu `excludeId` — edytowanego).
 * `impl` (decyzja 8c jak w previousBlockFor): gdy są miejsca i przyrząd bloku jest znany — dobór tylko z sesji sprzed daty pasujących do przyrządu
 * (histOf(exId, impl) z tym samym filtrem), a gdy takiej nie ma — z całej historii sprzed daty. Bez miejsc (albo bez `impl`) — dokładnie jak
 * przed P-003. */
export function previousBlockBefore(exId: string, before: number, k: number, n = 2, tplItemId?: string, tplId?: string | null, excludeId?: string | null,
    impl?: Impl | null, swapped = false): { workout: Workout; sets: WSet[] } | null {
  const ok: WOk = w => w.startedAt < before && w.id !== excludeId;
  let hist = workoutsWith(exId); let p: Prev | null = null; let fi: Impl | undefined; /* fi: filtr bloków (LOW 4) tylko razem z historią wg przyrządu */
  if (impl && getState().settings.locations.length) { const ih = histOf(exId, impl); p = prevScan(ih, exId, ok, impl); if (p) { hist = ih; fi = impl; } }
  if (!p) p = prevScan(hist, exId, ok);
  if (swapped)
    return (tplItemId ? byItemScan(hist, exId, tplItemId, ok, fi) : null) ?? selectBlock(p, k, n, undefined, null, () => null, () => null); /* E2 pkt 3.6 */
  return selectBlock(p, k, n, tplItemId, tplId, it => byItemScan(hist, exId, it, ok, fi), tp => byTplBlockScan(hist, exId, tp, k, ok, fi));
}
/* E2 (docs/14 pkt 3.6), `swapped` — blok-zamiennik (ma swappedFrom): pozycja szablonu (tplItemId) przechodzi na zamiennik B, więc „Poprzednio”
 * to najpierw ostatni blok B z TEJ pozycji szablonu („ostatnio w Domu zamiast sztangi: hantle”), a gdy go nie ma — zwykły dobór bez kontekstu
 * pozycji (bez reguł rund 11/13: pozycja należy do A, a B bywa też własną pozycją tego szablonu — wtedy reguła „pominięta pozycja” dawała null). */
/** Wybór bloku z ostatniej sesji `p` (wspólny dla previousBlockFor i previousBlockBefore); byItem/byTpl — skany w tej samej historii i z tym samym filtrem. */
function selectBlock(p: Prev | null, k: number, n: number, tplItemId: string | undefined, tplId: string | null | undefined,
    byItem: (itemId: string) => PrevSets | null, byTpl: (tplId: string) => PrevSets | null): PrevSets | null {
  if (!p) return null;
  // Runda 72 (T5): to samo ćwiczenie kilka razy w szablonie (ciężko + lżej) — gdy ostatnia sesja tego ćwiczenia była z innego treningu
  // (jeden blok), blok „lżejszy” dostawał ciężar z tamtej sesji. Najpierw ostatni blok tej samej pozycji szablonu.
  if (n > 1 && tplItemId && !(tplId && p.workout.templateId === tplId) && p.blocks.filter(b => b.length).length <= 1) {
    const own = byItem(tplItemId) ?? (tplId ? byTpl(tplId) : null);
    if (own) return own;
    if (k > 0) return null;
  }
  // Runda 11: blok z tej samej pozycji szablonu wygrywa z numerem bloku (pominięty wtedy blok nie przesuwa podpowiedzi).
  if (tplItemId && tplId && p.workout.templateId === tplId && p.ids.some(Boolean)) {
    const j = p.ids.indexOf(tplItemId);
    if (j >= 0) {
      const b = p.blocks[j];
      return b.length ? { workout: p.workout, sets: b } : null;
    }
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
export function progressionFor(ex: Exercise | undefined, repMax: number | null | undefined, prevSets: WSet[] | null | undefined, locationId?: string | null,
    prefer?: Impl): Progression | null {
  if (!ex || repMax == null || !getState().settings.progressHint || (ex.metric ?? 'weight_reps') !== 'weight_reps') return null;
  /* seria z asystą gumą: obciążenie nieznane — bez podpowiedzi; guma oporowa (przegląd 06.10) — podpowiedź jak zwykle */
  const work = (prevSets ?? []).filter(x => isWorking(x) && x.kind !== 'drop' && !(x.bandId && ex.bandAssistable));
  if (!work.length || work.length !== (prevSets ?? []).filter(x => isWorking(x) && x.kind !== 'drop').length || work.some(x => repsOf(x) < repMax)) return null;
  const top = Math.max(...work.map(x => setLoad(ex, x))); const lb = wu() === 'lb';
  /* P-003 (E1, decyzja 4a; decyzja 7a z 03.10.2026 — bez bramki 10%): w miejscu z opisanym sprzętem „↑” to najbliższy większy DOSTĘPNY ciężar,
   * także przy dużym skoku (10 → 12 kg); bez przyrządu z ciężarem — powtórzenia. */
  const loc = locationById(locationId);
  if (loc && !isBW(ex)) { const L = loadsFor(ex, loc, prefer); /* E2 D5: przypięty przyrząd bloku */
    if (L.kind === 'none') return top <= 0 ? { kind: 'reps', reps: repMax + 1 } : null; /* np. wykroki bez hantli w domu; ciężar z innego miejsca — bez „↑” */
    if (L.kind === 'loads' && top <= 0)
      return { kind: 'reps', reps: repMax + 1 }; /* audyt H2: bez obciążenia (wykroki, russian twist) — powtórzenia, nie „+1 kg”, którego nie ma */
    if (L.kind === 'loads' && top > 0) {
      const nx = nextHeavier(L.loads, top);
      return nx == null ? null /* poprzedni ciężar ≥ największy dostępny */ : { kind: 'load', kg: nx };
    } }
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
/** „Poprzednio” dla bloku treningu w toku (ten sam dobór co na ekranie). */
export function prevOfBlock(e: WExercise) {
  const a = getState().active; return a && a.exercises.includes(e) ? prevOfActiveBlock(a, e) : previousFor(e.exerciseId);
}
/** „Poprzednio” bloku `e` treningu `w` (w toku) — ten sam dobór na ekranie, przy odhaczaniu i przy zamianie: k-te wystąpienie ćwiczenia, pozycja
 * szablonu, przyrząd bloku (decyzja 8c), a dla zamiennika (swappedFrom) — reguła E2 pkt 3.6. */
export function prevOfActiveBlock(w: Workout, e: WExercise): { workout: Workout; sets: WSet[] } | null {
  const ei = w.exercises.indexOf(e);
  return previousBlockFor(e.exerciseId, occurrence(w.exercises, ei), occurrences(w.exercises, e.exerciseId), e.tplItemId, w.templateId, e.impl,
      !!e.swappedFrom);
}
