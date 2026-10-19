/*
 * Miejsca treningu w treningu (P-003): miejsce startu, przyrząd bloku w miejscu (decyzja 8c), lista ciężarów miejsca, bezpiecznik M3
 * („źródło gdzie indziej”, ciężar spoza listy), dopisek „ciężaru X nie ma tutaj”, zmiana miejsca treningu w toku. Edycja samych miejsc — lib/locations.ts.
 * Zależy od: ./core, ./sets, ./setvals; zewnętrzne: ../seed, ../equipment, ../loads.
 */
import { type Impl, type Workout, type WSet, type WExercise, type Exercise, type Location } from '../seed';
import { loadsFor, implAt, implsAt } from '../equipment';
import { hasLoadShown } from '../loads';
import { save, getState } from './core';
import { exById, isBW } from './sets';
import { isEmpty } from './setvals';

/* ---------- P-003: miejsca treningu ---------- */
export const locationById = (id: string | null | undefined): Location | undefined => id ? getState().settings.locations.find(l => l.id === id) : undefined;
/** 0.19 (docs/33 A4, P1 A): miejsca z list (Ustawienia, 📍, generator, edytor szablonu, „Zawsze w”) — bez miejsc jednorazowych. */
export const visibleLocations = (): Location[] => getState().settings.locations.filter(l => !l.oneOff);
/** Miejsce zapisane w planie na dzień `k` (RRRR-MM-DD) — tylko gdy to miejsce wciąż istnieje (0.19, docs/33 B). */
export const placeOnDay = (k: string): string | undefined => { const id = getState().planPlaces?.[k]; return id && locationById(id) ? id : undefined; };
/** Miejsce nowego treningu: miejsce dnia z planu (0.19, docs/33 B: przed miejscem szablonu), miejsce szablonu (gdy istnieje), inaczej główne.
 * Bez miejsc — brak (zachowanie sprzed P-003). Miejsca jednorazowe nie są domyślnym wyborem (tylko jako `preferred` — dzień planu). */
export function startLocationId(preferred?: string | null): string | undefined {
  const s = getState().settings; const vis = visibleLocations(); if (!s.locations.length) return undefined;
  if (preferred && s.locations.some(l => l.id === preferred)) return preferred;
  if (s.mainLocationId && vis.some(l => l.id === s.mainLocationId)) return s.mainLocationId;
  return vis[0]?.id ?? s.locations[0].id;
}
/** Miejsca jednorazowe, do których nic się już nie odwołuje (trening w toku, historia, miejsca dni planu, zapisane plany) — do usunięcia. Czysta funkcja
 * nad `State`-podobnym obiektem (też surowym, przed migracją): migrate i porządki po zmianie planu. */
export function unusedOneOffIds(st: { settings?: any; workouts?: any; active?: any; planPlaces?: any; savedPlans?: any }): Set<string> {
  const used = new Set<string>(); const add = (v: unknown) => { if (typeof v === 'string') used.add(v); else if (typeof v === 'number') used.add(String(v)); };
  if (st.active) add(st.active.locationId);
  for (const w of Array.isArray(st.workouts) ? st.workouts : []) if (w) add(w.locationId);
  for (const v of Object.values(st.planPlaces ?? {})) add(v);
  for (const p of Array.isArray(st.savedPlans) ? st.savedPlans : []) for (const v of Object.values(p?.places ?? {})) add(v);
  return new Set((Array.isArray(st.settings?.locations) ? st.settings.locations : []).filter((l: any) => l && l.oneOff === true && !used.has(String(l.id))).map((l: any) => String(l.id)));
}
/** Usuwa miejsca jednorazowe bez odwołań (patrz unusedOneOffIds); zapisuje tylko, gdy coś usunięto. Zwraca, ile usunięto. */
export function pruneOneOff(): number {
  const st = getState(); const gone = unusedOneOffIds(st); if (!gone.size) return 0;
  st.settings.locations = st.settings.locations.filter(l => !gone.has(l.id)); save(); return gone.size;
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
export function prevFromOther(src: { workout: Workout; sets: WSet[] } | null | undefined, exId: string, locationId: string | null | undefined,
    impl: Impl | null | undefined): boolean {
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
export const blockImpl = (e: Pick<WExercise, 'exerciseId' | 'impl'>,
    locationId: string | null | undefined): Impl | undefined => e.impl ?? implAtLoc(exById(e.exerciseId), locationId);
/** Runda 82b (weryfikacja 6ea37a3, LOW 4): przyrząd bloku do etykiet w treningu W TOKU (i w nowym treningu wstecz) — bez miejsc (np. wszystkie
 * usunięte w trakcie) przyrząd się nie liczy: etykiety jak bez miejsc, czyli jak w main („kg/hant.”, „kg”), a nie „kg/str.” z zapisanego `impl`. */
export const liveBlockImpl = (e: Pick<WExercise, 'exerciseId' | 'impl'>,
    locationId: string | null | undefined): Impl | undefined => getState().settings.locations.length ? blockImpl(e, locationId) : undefined;
/** Runda 82b (weryfikacja 6ea37a3, LOW 5): miejsce, którego listy ciężarów dotyczy blok. Blok, który po zmianie miejsca zachował przyrząd
 * (odhaczone serie — runda 82, L5), a tutaj ćwiczenie robi się INNYM przyrządem (albo żadnym), nie korzysta z listy tego miejsca (loadsFor nie
 * patrzy na przyrząd bloku): bez dopisku „nie ma tutaj”, bez „↑ spróbuj X” z tej listy i bez wstrzymywania ciężaru przy odhaczeniu — dla tego
 * bloku jak bez listy ciężarów. Blok bez przyrządu (nieznany) — lista miejsca jak dotąd. Bez miejsca treningu — undefined (jak przed P-003). */
export function listLocFor(e: Pick<WExercise, 'exerciseId' | 'impl' | 'implPinned'>, locationId: string | null | undefined): string | undefined {
  const loc = locationById(locationId); if (!locationId || !loc) return undefined;
  if (e.implPinned && e.impl) {
    const ex = exById(e.exerciseId);
    return ex && implsAt(ex, loc).includes(e.impl) ? locationId : undefined;
  } /* E2 D5: przypięty przyrząd, który jest w miejscu — lista tego przyrządu (loadsFor z prefer) */
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
export function offListNote(e: Pick<WExercise, 'exerciseId' | 'impl' | 'implPinned' | 'sets'>, src: { workout: Workout; sets: WSet[] } | null | undefined,
    locationId: string | null | undefined, srcOf: (i: number) => WSet | null | undefined, live?: (i: number) => boolean): number | null {
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
  a.locationId = id;
  a.exercises.forEach(e => {
    if (!e.sets.some(x => x.done)) delete e.implPinned;
  }); /* E2 D5 (pkt 3.7.4): wybór dotyczył przyrządu w tamtym miejscu */
  restampUntouched(a);
  save(a);
}
/** Reguła L5 (runda 82): przyrząd od nowa tylko dla bloków BEZ odhaczonych serii; blok z odhaczonymi seriami zachowuje przyrząd, którym je zrobiono. */
/** E2 D5: blok z przyrządem wybranym ręcznie (implPinned) zostaje przy nim, dopóki ten przyrząd jest w miejscu; gdy zniknął — przypięcie
 * zdjęte i przyrząd od nowa. */
export function restampUntouched(a: Workout, all = false): boolean {
  const loc = locationById(a.locationId);
  /* all (T-057, nowy trening wstecz w edytorze): wszystkie serie szkicu są „zrobione”, ale nic jeszcze nie zapisano — przyrządy wszystkich bloków od nowa */
  let changed = false; a.exercises.forEach(e => { if (!all && e.sets.some(x => x.done)) return;
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
