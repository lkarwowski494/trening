import { useSyncExternalStore } from 'react';
import { getState, exById, isBW, restFor, occurrence, occurrences, normalizeGroups, assistLost, emptySet, copyVals, stripUnused, previousBlockBefore, offListAt, offListNote, srcSetAt, prevFromOther, startLocationId, stampImpl, setHasResult, putHistoryWorkout, loadOf, writeLoad, pinnedImpl, localISODate, clampName, NAME_MAX, locationById, tplRows } from './store';
import { implsAt, loadKindsFor } from './equipment';
import { base, uid, hasTime, hasReps, hasWeight, hasDistance, type TRow, type Exercise, type Impl, type Workout, type WExercise, type WSet } from './seed';
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
  /** E2 D6 (H8): ćwiczenie i pola zamiany bloków z otwarcia szkicu (id bloku → stan) — „↺ przywróć: A” */
  origEx: Record<string, Pick<WExercise, 'exerciseId' | 'swappedFrom' | 'impl' | 'implPinned'>>;
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
  const origEx: Draft['origEx'] = {}; w.exercises.forEach(e => { origEx[e.id] = { exerciseId: e.exerciseId, swappedFrom: e.swappedFrom, impl: e.impl, implPinned: e.implPinned }; });
  const d: Draft = { key, sourceId, w, date, time, min, orig: '', origStart: w.startedAt, origEnd: end, oDate: date, oTime: time, oMin: min, origVals, prefilled: {}, prefillAt: w.startedAt, origEx };
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
 * oraz dolna granica powtórzeń (to, co wstawiłoby odhaczenie pustej serii). Gdy są miejsca — miejsce szablonu albo główne (jak start treningu),
 * przyrząd bloku wg tego miejsca i dobór „Poprzednio” wg przyrządu (decyzja 8c). Bez dotykania treningu w toku, timerów, powiadomień
 * i maszynerii podpowiedzi („pre”, „hinted”).
 */
export function beginPast(tplId: string | null, start: number, end: number): Draft {
  const st = getState(); const tpl = tplId ? st.templates.find(x => x.id === tplId) ?? null : null;
  const w: Workout = { ...base(st.ownerId), loggedBy: st.ownerId, sessionMode: 'solo', healthUUID: null, templateId: tpl?.id ?? null, templateName: tpl?.name ?? '', startedAt: start, finishedAt: end, note: '', exercises: [] };
  /* integracja 0.9.0 (decyzja 1a, jak start treningu): miejsce szablonu, inaczej główne — tylko gdy są miejsca; w edytorze tylko do odczytu */
  const loc = startLocationId(tpl?.locationId); if (loc) w.locationId = loc;
  tpl?.items.forEach(it => {
    const ex = exById(it.exerciseId); if (!ex || ex.archived) return;
    const rows = tplRows(it); /* schemat 17: liczba i typy serii z wierszy szablonu */
    w.exercises.push(stampImpl({ id: uid(), exerciseId: ex.id, restSec: typeof it.restSec === 'number' && it.restSec >= 0 ? it.restSec : restFor(ex), repMin: it.repMin, repMax: it.repMax, groupId: it.groupId ?? null, sets: rows.map(r => ({ ...emptySet(), kind: r.kind, warmup: r.kind === 'warmup', done: true })), tplItemId: it.id }, w.locationId)); /* decyzja 8c */
  });
  normalizeGroups(w.exercises);
  const d = make('new-' + uid(), null, w); refill(d, start, true); d.orig = snap(d); return d;
}
function prefill(ex: Exercise, p0: WSet | null, startWeight: number | '' = '', targetSec: number | '' = '', repMin: number | null = null, row?: TRow): WSet {
  const m = ex.metric ?? 'weight_reps'; const p = assistLost(ex, p0) ? null : p0; const sw = row ? row.weight : startWeight; /* schemat 17: plan z wiersza szablonu, jak start treningu */
  const s = { ...emptySet(), ...(p ? copyVals(p) : { weight: isBW(ex) || !hasWeight(m) || sw === '' ? '' : Math.max(0, Number(sw)), addKg: isBW(ex) && hasWeight(m) ? sw : '', ...(row && hasReps(m) ? { reps: row.reps } : {}), ...(row && hasDistance(m) ? { distanceM: row.distanceM } : {}), ...(row?.bandId ? { bandId: row.bandId } : {}) }), done: true } as WSet;
  if (row) targetSec = Number(row.durationSec) > 0 ? Number(row.durationSec) : '';
  if (hasTime(m)) s.durationSec = Number(targetSec) > 0 ? Number(targetSec) : (p && Number(p.durationSec) > 0 ? Number(p.durationSec) : '');
  if (hasReps(m) && s.reps === '' && repMin != null) s.reps = repMin;
  return stripUnused(ex, s);
}
/** Wartości wstawiane w blok przy danej dacie: blok z pozycji szablonu — jak start z szablonu (seria i-ta z bloku „Poprzednio”), blok dodany
 * w edytorze — OSTATNIA seria robocza z „Poprzednio” sprzed tej daty. Edytowany trening nie jest źródłem dla samego siebie.
 * Decyzja 8c (03.10.2026): blok z przyrządem (WExercise.impl) bierze najpierw sesje tym samym albo nieznanym przyrządem, gdziekolwiek były
 * (previousBlockBefore z `impl`; miejsce samo w sobie nie ma znaczenia), a ciężar z sesji „gdzie indziej” (store.prevFromOther: INNE, ZNANE
 * miejsce albo — audyt LOW 3 — znany, inny przyrząd bloku) spoza listy dostępnych tutaj (offListAt) nie jest wstawiany — jak startFromTemplate,
 * tyle że razem z ciężarem puste zostają też powtórzenia (nigdy „ciężar pusty + powtórzenia”). Z sesji bez miejsca (0.8.5, web 0.3) wartość
 * zostaje — edytor pokazuje wtedy dopisek „ciężaru … nie ma tutaj” (prefilledOffList; audyt MEDIUM 1). Zwraca wartości ze źródła i `off` (ciężar do wstrzymania) — samo
 * wstrzymanie robi refill, bo zależy od tego, które pola są jeszcze wypełniane przez aplikację (weryfikacja integracji, LOW1). */
function prefillFor(d: Draft, e: WExercise, before: number): ((i: number) => { s: WSet; off: boolean }) | null {
  const r = prefillSrc(d, e, before); if (!r) return null; const { ex, p, src, it, srcOf } = r; const loc = d.w.locationId;
  /* tylko źródło „gdzie indziej” (znane, inne miejsce albo znany, inny przyrząd; treningi bez miejsca — nie); weryfikacja integracji (LOW2): i tylko,
   * gdy sesja daje wartości — sesja z samymi drop setami nie jest źródłem, więc nie wstrzymuje ciężaru startowego szablonu (jak startFromTemplate) */
  const away = !!(src.length && prevFromOther(p, ex.id, loc, e.impl));
  const at = (s: WSet) => ({ s, off: away && offListAt(ex, loc, s.weight, pinnedImpl(e)) }); /* E2 (audyt L2): przyrząd wybrany ręcznie (P5b) */
  /* przegląd 06.10.2026 (WYSOKIE): rozgrzewki i drop sety bez źródła, serie robocze numerowane bez nich — jak store.prefillSets przy starcie */
  const kinds = e.sets.map(x => x.kind); const work = (k: string) => k !== 'warmup' && k !== 'drop';
  const srcAt = (i: number) => work(kinds[i]) ? srcOf(kinds.slice(0, i).filter(work).length) : null;
  return it ? (i => at(prefill(ex, srcAt(i), it.startWeight, it.targetSec, it.repMin, it.rows?.[i]))) : (i => at(prefill(ex, srcAt(i))));
}
/** Źródło wartości bloku przy danej dacie (wspólne dla prefillFor i dopisku prefilledOffList — runda 82b): sesja „Poprzednio” `p`, jej serie bez
 * drop setów `src` i `srcOf(i)` — seria źródła dla serii i bloku (pozycja szablonu: i-ta, dalej ostatnia; blok dodany w edytorze: ostatnia). */
function prefillSrc(d: Draft, e: WExercise, before: number) {
  const ex = exById(e.exerciseId); if (!ex) return null; const w = d.w; const impl = e.impl;
  const tpl = w.templateId ? getState().templates.find(x => x.id === w.templateId) ?? null : null;
  const it = tpl && e.tplItemId ? tpl.items.find(x => x.id === e.tplItemId && x.exerciseId === e.exerciseId) : undefined;
  const ii = it && tpl ? tpl.items.indexOf(it) : -1; const ei = w.exercises.indexOf(e);
  const p = it && tpl ? previousBlockBefore(ex.id, before, occurrence(tpl.items, ii), occurrences(tpl.items, ex.id), it.id, tpl.id, d.sourceId, impl)
    : previousBlockBefore(ex.id, before, occurrence(w.exercises, ei), occurrences(w.exercises, ex.id), e.tplItemId, w.templateId, d.sourceId, impl, !!e.swappedFrom); /* E2 pkt 3.6 (audyt M1): zamiennik — najpierw B z tej pozycji szablonu */
  const src = p ? p.sets.filter(x => x.kind !== 'drop') : []; /* jak startFromTemplate: drop sety nie są źródłem zwykłych serii */
  const srcOf = (i: number): WSet | null => srcSetAt(src, i, !!it); /* runda 82c: to samo mapowanie co start z szablonu i ekran treningu */
  return { ex, p, src, it, srcOf };
}
/** Pola serii wciąż równe wartości wstawionej przez aplikację (pole zmienione ręcznie wypada). */
const liveKeys = (d: Draft, s: WSet): VKey[] => { const r = d.prefilled[s.id]; return r ? (Object.keys(r) as VKey[]).filter(k => s[k] === r[k]) : []; };
/** Audyt f132330/025ee6a (MEDIUM 1): dopisek „ciężaru … nie ma tutaj — wpisz ciężar” w edytorze — np. 32 kg z sesji bez miejsca (0.8.5 / web 0.3),
 * w domu max 24: wartość zostaje (wstrzymanie dawało serie bez ciężaru — HIGH z weryfikacji 2). Runda 82b (weryfikacja 6ea37a3): ta sama reguła
 * co na ekranie treningu (store.offListNote — źródło „gdzie indziej” albo bez miejsca, seria robocza > 0 spoza listy wg jednostki, pole puste
 * albo wciąż z tą wartością) i tylko dla pól ciężaru wciąż wypełnionych przez aplikację (ciężar wpisany ręcznie — bez dopisku; edycja zapisanego
 * treningu bez dodanych serii — bez dopisku). Pokazuje się więc też przy wartości wstrzymanej (źródło z innego miejsca — pole puste), jak w treningu.
 * Bez miejsca szkicu — null. */
export function prefilledOffList(d: Draft, e: WExercise): number | null {
  if (!d.w.locationId) return null;
  const live = (i: number) => liveKeys(d, e.sets[i]).includes('weight'); if (!e.sets.some((_, i) => live(i))) return null; /* bez skanu historii przy każdym wpisie */
  const r = prefillSrc(d, e, d.prefillAt); if (!r) return null;
  return offListNote(e, r.p, d.w.locationId, r.srcOf, live);
}
/** Wypełnia serie wartościami sprzed `before`. force — wszystkie pola serii bloku (nowy szkic, nowe ćwiczenie); inaczej tylko pola
 * wypełnione wcześniej przez aplikację i od tamtej pory nieruszone (weryfikacja 2, L2: per pole — wpisane powtórzenia nie blokują
 * przeliczenia ciężaru). */
function refill(d: Draft, before: number, force: boolean, only?: WExercise) {
  for (const e of only ? [only] : d.w.exercises) {
    if (!force && !e.sets.some(s => liveKeys(d, s).length)) continue;
    const f = prefillFor(d, e, before); if (!f) continue;
    e.sets.forEach((s, i) => {
      const keys = force ? [...VKEYS] : liveKeys(d, s); if (!keys.length) { delete d.prefilled[s.id]; return; }
      const { s: n, off } = f(i); const rec: Partial<Record<VKey, unknown>> = {};
      /* LOW1: ciężar spoza listy wstrzymujemy tylko w polu ciężaru wciąż wypełnianym przez aplikację — wtedy pusty jest też wstawiany ciężar
       * i wstawiane powtórzenia (nigdy „ciężar pusty + powtórzenia ze źródła”); powtórzenia wpisane ręcznie zostają (ostrzeżenie przy zapisie).
       * Ciężar wpisany ręcznie: nic nie wstrzymujemy — wstawiane powtórzenia idą ze źródła. */
      if (off && keys.includes('weight')) { n.weight = ''; n.reps = ''; }
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
  const e: WExercise = stampImpl({ id: uid(), exerciseId: ex.id, restSec: restFor(ex), repMin: null, repMax: null, groupId: null, sets: [{ ...emptySet(), done: true }] }, d.w.locationId); /* decyzja 8c: przyrząd wg miejsca szkicu */
  const at = currentStart(d) ?? d.prefillAt; if (at !== d.prefillAt) refill(d, at, false); /* reszta szkicu na tę samą datę */
  d.w.exercises.push(e); refill(d, at, true, e);
  touchDraft();
}
/** Nowa seria = kopia ostatniej (po rozgrzewce pusta seria zwykła, po drop secie drop set — jak „+ seria” w treningu). */
/** „+ seria” / „+ rozgrzewka” / „+ drop set” (przegląd 06.10 — jak w treningu, store.addSet): rozgrzewka pusta przed seriami roboczymi,
 * drop set na końcu z wartościami ostatniej. RPE się nie kopiuje (jak w treningu — to ocena tej jednej serii). */
export function draftAddSet(key: string, ei: number, kind?: 'warmup' | 'drop') {
  const d = drafts.get(key); const e = d?.w.exercises[ei]; if (!d || !e) return;
  if (kind === 'warmup') { const i = e.sets.findIndex(x => x.kind !== 'warmup'); e.sets.splice(i < 0 ? e.sets.length : i, 0, stripUnused(exById(e.exerciseId), { ...emptySet(), kind: 'warmup', warmup: true, done: true })); touchDraft(); return; }
  const l = e.sets[e.sets.length - 1]; const fromWarmup = !l || l.kind === 'warmup';
  const s: WSet = stripUnused(exById(e.exerciseId), { ...emptySet(), ...(fromWarmup ? {} : copyVals(l)), rpe: '', kind: kind === 'drop' || l?.kind === 'drop' ? 'drop' : 'normal', done: true });
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
/* ---------- E2 D6: zamiana w edytorze historii — poprawka „zapisałem serie pod złym ćwiczeniem” (docs/14 pkt 5) ---------- */
/** H3: tylko ta sama miara (pola serii muszą pasować); blok usuniętego ćwiczenia — dowolne. Zarchiwizowane i to samo ćwiczenie — nie. */
export function swapTargetOk(_d: Draft, e: WExercise, b: Exercise | undefined, allowArchived = false): boolean {
  const a = exById(e.exerciseId); return !!b && (allowArchived || !b.archived) && b.id !== e.exerciseId && (!a || (a.metric ?? 'weight_reps') === (b.metric ?? 'weight_reps'));
}
const lastAt = (d: Draft) => currentStart(d) ?? d.prefillAt;
/**
 * Przepięcie CAŁEGO bloku pod ćwiczenie `toId` (P3 a). H2: serie i wartości bez zmian (A-002), pozycja szablonu, superset, przerwa i zakres bez zmian.
 * H4 (P4 a): masa ciała ↔ ciężar — wpisany ciężar trafia do pola właściwego B (writeLoad), ujemna asysta przy ćwiczeniu z ciężarem → pole puste
 * (zapis ostrzeże „Serie bez ciężaru”). H5: przyrząd wg miejsca szkicu, bez przypięcia. H6: swappedFrom zostaje, a gdy go nie było i blok jest
 * z pozycji szablonu — A; powrót do swappedFrom go usuwa. H7: wartości wstawione przez aplikację (trening wstecz) i nieruszone liczą się od nowa
 * z historii B sprzed daty. Zwraca false, gdy przepięcie niedozwolone.
 */
export function draftSwapExercise(key: string, blockId: string, toId: string, allowArchived = false): boolean {
  const d = drafts.get(key); const e = d?.w.exercises.find(x => x.id === blockId); const b = exById(toId); if (!d || !e || !b || !swapTargetOk(d, e, b, allowArchived)) return false;
  const a = exById(e.exerciseId); const from = e.exerciseId;
  if (a && isBW(a) !== isBW(b)) for (const s of e.sets) {
    const raw = loadOf(a, s).raw; const v = raw !== '' && !isBW(b) && raw < 0 ? '' : raw; writeLoad(b, s, v); if (!isBW(b) && v === '') s.weight = '';
    const r = d.prefilled[s.id]; if (r) { const [ka, kb] = isBW(a) ? ['addKg', 'weight'] as const : ['weight', 'addKg'] as const; if (ka in r) { r[kb] = s[kb]; delete r[ka]; } } /* pole wypełnione przez aplikację wędruje razem z wartością */
  }
  e.exerciseId = b.id; delete e.implPinned; stampImpl(e, d.w.locationId);
  const orig = e.swappedFrom ?? (e.tplItemId ? from : undefined); if (orig && orig !== b.id) e.swappedFrom = orig; else delete e.swappedFrom;
  refill(d, lastAt(d), false, e); touchDraft(); return true;
}
/** H8: „↺ przywróć: A” — blok z otwarcia szkicu ma dziś inne ćwiczenie (albo przyrząd), a oryginał wciąż istnieje. */
export function canRestoreExercise(d: Draft, e: WExercise): boolean {
  const o = d.origEx[e.id]; return !!o && (o.exerciseId !== e.exerciseId || o.impl !== e.impl) && !!exById(o.exerciseId);
}
export function draftRestoreExercise(key: string, blockId: string) {
  const d = drafts.get(key); const e = d?.w.exercises.find(x => x.id === blockId); const o = d && e ? d.origEx[e.id] : undefined; if (!d || !e || !o || !canRestoreExercise(d, e)) return;
  if (o.exerciseId !== e.exerciseId && !draftSwapExercise(key, blockId, o.exerciseId, true /* audyt M2: oryginał bywa zarchiwizowany (H11) */)) return;
  for (const k of ['swappedFrom', 'impl', 'implPinned'] as const) { if (o[k] === undefined) delete e[k]; else (e as any)[k] = o[k]; }
  refill(d, lastAt(d), false, e); touchDraft();
}
/** P5b (a): przyrządy do poprawki samego przyrządu bloku — w miejscu szkicu (implsAt), a bez miejsca — z rodzajów ciężaru ćwiczenia
 * (wyciąg: zwykły albo stacja); bez bieżącego. */
export function draftImplChoices(d: Draft, e: WExercise): Impl[] {
  const ex = exById(e.exerciseId); if (!ex) return []; const loc = locationById(d.w.locationId);
  const all: Impl[] = loc ? implsAt(ex, loc) : loadKindsFor(ex).flatMap(k => k === 'cable' ? ['cable', 'electric'] as Impl[] : [k as Impl]);
  return all.filter((i, n) => all.indexOf(i) === n && i !== e.impl);
}
/** P5b: poprawka samego przyrządu (dawne treningi RDL zapisane jako hantle) — przyrząd przypięty, „Poprzednio” 8c liczy się od nowa po zapisie. */
export function draftSetImpl(key: string, blockId: string, impl: Impl) {
  const d = drafts.get(key); const e = d?.w.exercises.find(x => x.id === blockId); if (!d || !e || !draftImplChoices(d, e).includes(impl)) return;
  e.impl = impl; e.implPinned = true; refill(d, lastAt(d), false, e); touchDraft();
}
/** Przesunięcie daty o dzień (przyciski ‹ ›). Nieczytelna data zostaje bez zmian. */
export function shiftDate(date: string, days: number): string {
  const m = /^(\d{4})-(\d{1,2})-(\d{1,2})$/.exec(date.trim()); if (!m) return date;
  const d0 = new Date(+m[1], +m[2] - 1, +m[3]); if (d0.getFullYear() !== +m[1] || d0.getMonth() !== +m[2] - 1 || d0.getDate() !== +m[3]) return date; /* niemożliwa data (30.02) — bez cichej „poprawki”; parseStart pokaże błąd (macierz czasu 06.10) */
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
export type DraftCheck = { error: string } | { w: Workout; dropped: number; noWeight: number; empty: boolean; overlap: Workout | null };
/**
 * Gotowy do zapisu trening ze szkicu (kopia — szkic zostaje do ewentualnego „Wróć”). Audyt H1: serie NOWE albo ZMIENIONE w edytorze bez
 * wyniku w metryce ćwiczenia odpadają (liczba w `dropped` do ostrzeżenia); serie zapisane wcześniej i nieruszone zostają zawsze (historia
 * może mieć odhaczone serie bez powtórzeń albo serie z dawnej metryki ćwiczenia). Ćwiczenia bez serii odpadają; `empty` = nic do zapisania.
 * `overlap` — inna sesja z historii w tym samym czasie (do potwierdzenia); nachodzenie na trening w toku to błąd. `noWeight` — zapisywane serie
 * robocze nowe albo zmienione ćwiczeń z ciężarem (nie masa ciała) z pustym ciężarem (np. wpisane powtórzenia przy ciężarze wstrzymanym jako
 * spoza listy) — zostają, ale z ostrzeżeniem jak „Odhaczone serie bez ciężaru” przy „Zakończ” (weryfikacja integracji, LOW1).
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
  const noWeight = w.exercises.reduce((a, e) => { const ex = exById(e.exerciseId); return a + (ex && !isBW(ex) && hasWeight(ex.metric ?? 'weight_reps') ? e.sets.filter(s => s.kind !== 'warmup' && loadOf(ex, s).raw === '' && d.origVals[s.id] !== vals(s)).length /* audyt 83b-2 (LOW 2): jak pole w edytorze (loadOf) — bez ostrzeżenia, gdy pole pokazuje ciężar spod innego sprzętu */ : 0); }, 0);
  /* godziny serii: przy zmianie terminu przesunięte razem ze startem i w granicach [start, koniec] (skrócony trening); serie nowe
   * i zmienione bez godziny dostają ją zaraz po poprzedniej (kolejność PR jak na liście). Weryfikacja 2 (L4): seria nieruszona bez godziny
   * (stare dane) zostaje bez godziny i z dawną przerwą — kopia wraca 1:1. */
  const clamp = (x: number) => Math.min(end, Math.max(start, x)); let last = start; const touched = (s: WSet) => d.origVals[s.id] !== vals(s);
  w.exercises.forEach(e => e.sets.forEach(s => {
    if (typeof s.completedAt === 'number') { if (changed) s.completedAt = clamp(s.completedAt + delta); last = s.completedAt; }
    else if (touched(s)) { last = clamp(last + 1000); s.completedAt = last; s.actualRest = null; }
  }));
  const overlap = changed ? getState().workouts.find(x => x.id !== d.sourceId && x.startedAt < end && (x.finishedAt ?? x.startedAt) > start) ?? null : null;
  return { w, dropped, noWeight, empty: !w.exercises.length, overlap };
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
