/*
 * Trening w toku: serie (dodanie, usunięcie, odhaczenie z podpowiedziami i przeniesieniem wartości), przerwa po serii i rundy supersetu,
 * seria „teraz” widoku skupionego (focusSet).
 * Zależy od: ./core, ./setvals, ./sets, ./groups, ./exercises, ./history, ./places, ./pause; zewnętrzne: ../seed.
 */
import { hasReps, type Workout, type WSet, type WExercise } from '../seed';
import { S, save, getState } from './core';
import { exById, bandById, restFor, isRoundSet, isBW, loadFieldValue, writeLoad } from './sets';
import { blankSet, copyVals, VAL_KEYS, PRE_KEYS, usedKeys, isEmpty, assistLost, setFam, cascadeDown } from './setvals';
import { offListAt, prevFromOther, listLocFor, pinnedImpl } from './places';
import { hintFor, prevOfBlock } from './history';
import { normalizeGroups } from './groups';
import { resumeWorkout } from './pause';
import { purgeOrphans } from './exercises';

/** „+ rozgrzewka” / „+ drop set” (decyzja 05.10.2026): rozgrzewka pusta, przed seriami roboczymi; drop set na końcu z wartościami ostatniej. */
export function addSet(ei: number, kind?: 'warmup' | 'drop') {
  if (kind === 'warmup') {
    const a = getState().active!;
    const e = a.exercises[ei];
    const i = e.sets.findIndex(s => s.kind !== 'warmup');
    e.sets.splice(i < 0 ? e.sets.length : i, 0, { ...blankSet(), kind: 'warmup', warmup: true });
    save(a);
    return;
  }
  addSetPlain(ei);
  if (kind === 'drop') {
    const a = getState().active!;
    const e = a.exercises[ei];
    const ns = e.sets[e.sets.length - 1];
    ns.kind = 'drop';
    ns.warmup = false;
    save(a);
  }
}
function addSetPlain(ei: number) {
  const a = getState().active!;
  const e = a.exercises[ei];
  const l = e.sets[e.sets.length - 1];
  const fromWarmup = l?.kind === 'warmup';
  e.sets.push({ ...blankSet(), ...(fromWarmup ? {} : copyVals(l)), ...(l?.done ? { durationSec: '' as const } : {}),
      ...(l?.noBand && !fromWarmup ? { noBand: true } : {}), kind: l?.kind === 'drop' ? 'drop'
      : 'normal' /* runda 72: po serii „do upadku” kolejna jest zwykła — upadek to wynik, nie plan */ });
  {
    const ns = e.sets[e.sets.length - 1];
    if (l?.pre && !fromWarmup) {
      const p: NonNullable<WSet['pre']> = {};
      for (const k of PRE_KEYS) if (l.pre[k] !== undefined && ns[k] === l.pre[k]) p[k] = l.pre[k];
      if (Object.keys(p).length) ns.pre = p;
    } /* weryfikacja: dodana seria idzie za zmianą jak pozostałe */
    if (ns.bandId && !usedKeys(exById(e.exerciseId)).bandId) {
      if (Number(ns.addKg) < 0) ns.addKg = '';
      ns.bandId = '';
    }
  } /* runda 65: wyłączona asysta gumą — guma (i jej asysta) nie przechodzi */
  save(a);
} // czas zmierzonej serii nie staje się celem następnej (runda 3) // po rozgrzewce pusta seria: podpowie „Poprzednio”
/** „Usuń serię” z menu serii (przegląd 06.10, jak w szablonie): wybrana seria, nie zawsze ostatnia; ostatnia seria bloku zostaje. */
export function removeSetById(ei: number, setId: string) {
  const a = getState().active!;
  const e = a.exercises[ei];
  const i = e?.sets.findIndex(x => x.id === setId) ?? -1;
  if (i < 0 || e.sets.length <= 1) return;
  e.sets.splice(i, 1);
  save(a);
}
export function removeSet(ei: number) { const a = getState().active!; const e = a.exercises[ei]; if (e.sets.length > 1) { e.sets.pop(); save(a); } }
export function removeExercise(ei: number) {
  const a = getState().active!;
  const gone = a.exercises.splice(ei, 1)[0];
  normalizeGroups(a.exercises);
  const before = getState().exercises.length;
  purgeOrphans();
  if (getState().exercises.length !== before) save(); else save(a);
  void gone;
} // runda 42: usunięte ćwiczenie bez historii znika od razu
/** Pozycja serii w treningu w toku po id (stoper i przerwa trzymają id, nie indeksy). */
export function findSet(setId: string | null): { ei: number; si: number } | null {
  const a = S?.active; if (!a || !setId) return null;
  for (let ei = 0; ei < a.exercises.length; ei++) { const si = a.exercises[ei].sets.findIndex(s => s.id === setId); if (si >= 0) return { ei, si }; }
  return null;
}

/**
 * Wpis wartości w wierszu serii treningu w toku (oba widoki — „Lista” i skupiony — używają tych samych pól) z kaskadą w dół (decyzja 11.10.2026,
 * pkt 6A; cascadeDown): wartość przechodzi do kolejnych nieodhaczonych serii tej samej rodziny, które mają pole puste albo jeszcze poprzednią
 * wartość tej serii. `field` 'load' = pole ciężaru właściwe dla sprzętu (kg albo ±kg; zapis jak writeLoad), v — już przycięta wartość w kg.
 * Oznacza serię jako wpisaną ręcznie (edited); serie, do których przeszła kaskada, nie dostają znacznika (to nie ich wpis). Zwraca liczbę serii
 * uzupełnionych kaskadą.
 */
export type LiveField = 'load' | 'reps' | 'durationSec' | 'distanceM';
export function typeSetValue(ei: number, si: number, field: LiveField, v: number | ''): number {
  const a = getState().active; const e = a?.exercises[ei]; const s = e?.sets[si]; if (!a || !e || !s) return 0;
  const ex = exById(e.exerciseId); const load = field === 'load';
  const get = (r: WSet): number | '' => load ? loadFieldValue(ex, r) : r[field];
  const put = (r: WSet, nv: number | '') => { if (load) writeLoad(ex, r, nv); else (r as any)[field] = nv; };
  const old = get(s); put(s, v); s.edited = true;
  /* ±kg z gumą: asysta należy do gumy serii (jak w carryPrefill) — wiersz z inną gumą jej nie dostaje */
  const n = cascadeDown(e.sets, si, old, get, put, load && !!ex && isBW(ex));
  save(a); return n;
}
/** Ostatnie odhaczenie w treningu w toku — liczone z danych, więc przeżywa restart i cofnięcie odhaczenia. */
function lastCompletedAt(a: Workout, except?: WSet): number | null {
  let m: number | null = null;
  a.exercises.forEach(e => e.sets.forEach(s => {
    if (s !== except && s.done && s.completedAt && (m == null || s.completedAt > m)) m = s.completedAt;
  }));
  return m;
}
function carryPrefill(e: WExercise, si: number) {
  const s = e.sets[si]; if (!s?.pre) return;
  for (const k of PRE_KEYS) { const old = s.pre[k]; const v = s[k]; if (old === undefined || typeof v !== 'number' || v === old) continue;
    for (let j = si + 1; j < e.sets.length; j++) { const x = e.sets[j];
      if (x.done || x.edited || setFam(x.kind) !== setFam(s.kind) || x.pre?.[k] !== old || x[k] !== old || (k === 'addKg' && x.bandId !== s.bandId)) continue;
      x[k] = v; x.pre![k] = v; }
    s.pre[k] = v; /* weryfikacja: poprawka literówki (625 → 62,5) po ponownym ✓ też przechodzi dalej */ }
}
/**
 * Odhaczenie pustej serii (audyt r1, jak w popularnych dziennikach): puste pola bierze z tego, co widać jako podpowiedź —
 * wynik z „Poprzednio” (ta sama seria robocza), a gdy podpowiedzi nie ma — powtórzenia z dolnej granicy zakresu szablonu (runda 4).
 * Dzięki temu „24×0” nie trafia do historii tylko dlatego, że użytkownik odhaczył bez wpisywania.
 */
function fillFromHints(e: WExercise, si: number) {
  const s = e.sets[si]; if (s.kind === 'warmup') return;
  // Ta sama seria robocza co w podpowiedzi „Poprzednio” (bez „dociągania” do ostatniej — ekran pokazuje wtedy „—”).
  const pb = prevOfBlock(e); const p = hintFor(pb?.sets, e.sets, si, exById(e.exerciseId));
  const act = getState().active;
  /* audyt M3 (weryfikacja 2: tylko znane, inne miejsce; LOW 3: albo znany, inny przyrząd); runda 82b (LOW 5): lista miejsca tylko dla bloku tym
   * przyrządem, którym robi się tu ćwiczenie (listLocFor) */
  const offW = !!(p && prevFromOther(pb, e.exerciseId, act?.locationId, e.impl)
      && offListAt(exById(e.exerciseId), listLocFor(e, act?.locationId), p.weight, pinnedImpl(e)));
  // Guma z podpowiedzi tylko razem z jej asystą — gdy ±kg wpisano ręcznie (np. dociążenie), gumy nie dokładamy (runda 3).
  const hinted: Record<string, unknown> = {};
  // Runda 10: tylko pola, których używa bieżąca metryka ćwiczenia (metrykę mogła zmienić edycja ćwiczenia).
  const ex = exById(e.exerciseId); const m = ex?.metric ?? 'weight_reps'; const uses = usedKeys(ex);
  /* weryfikacja 2 (siatka bezpieczeństwa): ciężar z podpowiedzi wstrzymany, a pole ciężaru puste — nie wstawiamy nic (ani powtórzeń z podpowiedzi,
   * ani dolnej granicy zakresu); nigdy „ciężar pusty + powtórzenia z podpowiedzi”. Puste pola zostają dla zwykłej kontroli przy ✓ i „Zakończ”. */
  if (offW && uses.weight && isEmpty(s.weight)) { s.hinted = undefined; return; }
  if (p && !assistLost(ex, p)) {
    const kgEmpty = isEmpty(s.addKg);
    for (const k of VAL_KEYS)
      /* runda 47: guma zdjęta ręcznie — bez jej asysty */
      /* runda 46: asysta innej gumy nie trafia do tej serii */
      if (uses[k] && isEmpty(s[k]) && !isEmpty(p[k]) && !(k === 'weight' && offW)
          && !(k === 'addKg' && ((uses.bandId && s.bandId && s.bandId !== p.bandId) /* runda 66: ukryta guma nie blokuje +kg */ || (s.noBand && p.bandId)
          || (p.bandId && (!uses.bandId || !bandById(p.bandId)))))) {
        (s as any)[k] = p[k];
        hinted[k] = p[k];
      }
    if (uses.bandId && !s.bandId && !s.noBand && p.bandId && bandById(p.bandId) && kgEmpty) {
      s.bandId = p.bandId;
      hinted.bandId = p.bandId;
    } /* P-001/T-055: guma z podpowiedzi przychodzi bez kg */
  }
  // Brak podpowiedzi i brak wpisu: dolna granica zakresu z szablonu (runda 4: pierwszy trening zapisywał „24×0”).
  if (hasReps(m) && isEmpty(s.reps) && e.repMin != null) { s.reps = e.repMin; hinted.reps = e.repMin; }
  s.hinted = Object.keys(hinted).length ? hinted : undefined;
}
/** E2 (docs/14 pkt 3.5): bloki rozdzielone zamianą (łańcuch splitFrom: A z odhaczonymi + zamiennik B) to JEDEN członek grupy — runda liczona
 * sumą ich serii; bez tego B1 po podziale A liczyło rundę 1 i odpalało przerwę w środku rundy 2. Bez podziałów członek = blok (jak dotąd).
 * Wspólne dla przerw (restAfter) i karty „teraz” (focusSet, audyt 0.10 LIVE-02). */
function ssRoot(list: WExercise[], x: WExercise): string {
  let c = x;
  const seen = new Set<string>();
  while (c.splitFrom && !seen.has(c.id)) {
    seen.add(c.id);
    const p = list.find(y => y.id === c.splitFrom && y.groupId === x.groupId);
    if (!p) break;
    c = p;
  }
  return c.id;
}
function ssMembers(list: WExercise[], pick: (x: WExercise) => boolean): Map<string, WExercise[]> {
  const m = new Map<string, WExercise[]>();
  for (const x of list) if (pick(x)) {
    const k = ssRoot(list, x);
    const l = m.get(k);
    if (l) l.push(x); else m.set(k, [x]);
  }
  return m;
}
/** Przerwa po serii (ei, si) treningu w toku; null = superset bez przerwy. Wspólne dla odhaczenia i ponownego pomiaru (runda 19). */
export function restAfter(ei: number, si: number): number | null {
  const a = getState().active; const e = a?.exercises[ei]; const s = e?.sets[si]; if (!a || !e || !s) return null; const ex = exById(e.exerciseId);
  // Superset (0.4; od rundy 72): bez przerwy, dopóki runda nie jest zamknięta — liczy się liczba serii, nie kolejność na liście.
  // Runda 72 (T5): runda liczona serią, nie kolejnością na liście — odhaczenie B1 przed A1 nie odpala przerwy w środku rundy.
  // Runda 72 (T6): drop set to część serii, po której następuje — bez przerwy przed nim, a w supersecie nie liczy się jako osobna runda.
  if (s.kind !== 'warmup') { const nx = e.sets[si + 1]; if (nx && nx.kind === 'drop' && !nx.done) return null; }
  if (e.groupId) {
    /* Audyt 0.10 (LIVE-01): blok „Pomiń dziś” nie jest członkiem rundy — inaczej jego zaległe serie wstrzymywały przerwy drugiego ćwiczenia do końca. */
    const inGroup = (x: WExercise) => x.groupId === e.groupId && (x === e || !x.skipped);
    const members = ssMembers(a.exercises, inGroup); const mineK = ssRoot(a.exercises, e); const mine = members.get(mineK)!;
    const work = (xs: WExercise[]) => xs.flatMap(x => x.sets.filter(isRoundSet)); const r = work(mine).filter(y => y.done).length;
    const others = [...members].filter(([k]) => k !== mineK).map(([, v]) => v);
    /* Runda 75 (Q-006): ostatnia seria ostatniego ćwiczenia grupy zamyka rundę, także gdy wcześniejsze ćwiczenie ma pominiętą serię.
     * Warunek: każde zaległe ćwiczenie ma już choć jedną zrobioną serię — inaczej B1 przed A1 (także przy jednej serii) odpalałoby przerwę. */
    const closesGroup = !a.exercises.some((x, j) => j > ei && inGroup(x) && !mine.includes(x)) && !work(mine).some(y => !y.done)
        && others.every(x => work(x).some(y => y.done) || !work(x).some(y => !y.done));
    /* Q-006: rozgrzewka w trwającej rundzie — bez przerwy */
    if (s.kind === 'warmup' ? a.exercises.some((x, j) => j > ei && inGroup(x) && !mine.includes(x) && x.sets.some(y => !y.done))
        || others.some(x => work(x).filter(y => y.done).length > r)
      /* T9: pominięty drop set nie blokuje przerwy po ostatniej rundzie */
      : !closesGroup && others.some(x => work(x).filter(y => y.done).length < r && work(x).some(y => !y.done))) return null; }
  if (s.kind === 'warmup' && ex?.restWarmupSec != null) return ex.restWarmupSec;
  if (e.groupId && s.kind !== 'warmup') return roundRest(ei); /* runda 72: koniec rundy poza kolejnością — przerwa rundy (ostatniego ćwiczenia grupy) */
  return e.restSec ?? restFor(ex);
}
/** Przerwa rundy supersetu (ostatniego ćwiczenia grupy) albo własna przerwa ćwiczenia — dla ponownego pomiaru (runda 21).
 * Audyt 0.10 (LIVE-01): ostatni NIEPOMINIĘTY członek grupy („Pomiń dziś”). */
export function roundRest(ei: number): number | null {
  const a = getState().active; const e = a?.exercises[ei]; if (!a || !e) return null;
  const last = e.groupId ? [...a.exercises].reverse().find(x => x.groupId === e.groupId && (x === e || !x.skipped)) ?? e : e;
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
    s.completedAt = now;
    s.actualRest = prev && now > prev && now - prev < 3600e3 ? Math.round((now - prev) / 1000) : null; // runda 30: cofnięty zegar → brak przerwy, nie ujemna
    if (a.pausedAt != null) resumeWorkout(now, a); /* 08.10.2026: odhaczenie serii w trakcie pauzy kończy pauzę (od godziny serii) */
    // Autouzupełnianie: tylko puste pola następnej, nieodhaczonej serii tego samego rodzaju (rozgrzewka nie nadpisuje roboczej).
    const nxt = e.sets[si + 1];
    // Runda 6: rodziny serii — rozgrzewka, drop set, reszta (zwykła/do upadku). Ciężar dropu nie trafia do serii roboczej i odwrotnie.
    const sameKind = nxt && setFam(nxt.kind) === setFam(s.kind);
    // Czas NIE przechodzi na następną serię: w serii czasowej to cel stopera (przejęcie ucinało kolejną serię — runda 2).
    if (nxt && !nxt.done && sameKind) {
      for (const k of VAL_KEYS)
        if (k !== 'durationSec' && !(k === 'addKg' && s.bandId && (usedKeys(exById(e.exerciseId)).bandId
            || Number(s.addKg) < 0)) /* runda 66: ukryta guma blokuje tylko swoją asystę */ && typed.has(k) && isEmpty(nxt[k]))
          (nxt as any)[k] = s[k];
      /* Runda 47: guma przechodzi na następną serię razem z wpisanym ±kg (P-001: guma sama nie wnosi kg), gdy:
         „Poprzednio” nic nie mówi o tej serii, guma nie została w niej zdjęta ręcznie, a seria nie ma własnego, innego obciążenia. */
      const nKg = isEmpty(nxt.addKg) || Number(nxt.addKg) === 0;
      if (s.bandId && usedKeys(exById(e.exerciseId)).bandId /* runda 65 */ && !nxt.noBand
          && !hintFor(prevOfBlock(e)?.sets, e.sets, si + 1, exById(e.exerciseId)) /* T7: ta sama podpowiedź co na ekranie */
          && ((!nxt.bandId && nKg) || nxt.bandId === s.bandId)) {
        nxt.bandId = s.bandId; if (nKg && !isEmpty(s.addKg)) nxt.addKg = s.addKg;
      }
    }
    save(a);
    return restAfter(ei, si);
  }
  // Cofnięcie odhaczenia zdejmuje wartości wstawione z podpowiedzi — ponowne odhaczenie nie traktuje ich jak wpisanych
  // ręcznie (runda 4). Runda 5: czyszczone tylko pola, których wartość wciąż równa się wstawionej; pole zmienione ręcznie
  // (albo guma przełączona) zostaje, a edycja innego pola nie blokuje czyszczenia pozostałych.
  if (s.hinted && typeof s.hinted === 'object') {
    const hb = (s.hinted as any).bandId;
    const band0 = s.bandId; /* runda 52: stan gumy sprzed czyszczenia */
    for (const [k, v] of Object.entries(s.hinted))
      if ((s as any)[k] === v && !(k === 'addKg' && hb && band0 !== hb))
        (s as any)[k] = ''; /* P-001: zdjęcie gumy z podpowiedzi nie rusza ±kg (dawniej runda 53) */
  } // runda 48: po zmianie gumy asysta należy już do nowej gumy
  s.hinted = undefined; s.completedAt = null; s.actualRest = null; save(a); return null;
}
/**
 * Widok skupiony (styl „Tuleja”, decyzja właściciela 07.10.2026; docs/21 pkt 3): seria „teraz” = pierwsza nieodhaczona seria w kolejności treningu.
 * Superset — rundami (audyt 0.10, LIVE-02): spośród członków grupy z nieodhaczoną serią ten, który ma NAJMNIEJ odhaczonych serii roboczych (remis —
 * wcześniejsze ćwiczenie); w nim pierwsza nieodhaczona seria — więc rozgrzewka członka idzie tuż przed jego pierwszą serią roboczą (AW, A1, B1… /
 * A1, BW, B1…), a drop set tuż po serii, do której należy. Członek = blok albo łańcuch bloków rozdzielonych zamianą (ssRoot, jak w restAfter).
 * Bloki usuniętych ćwiczeń (bez wpisu w bibliotece) i „Pomiń dziś” są pomijane. null = wszystko odhaczone (albo pusty trening).
 * `assumeDone` — id serii traktowanej jak odhaczona: stan PO odhaczeniu, wspólny z podpisem przerwy (lib/live.ts restLabel, audyt 0.10 LIVE-04).
 */
export function focusSet(w: Workout | null | undefined, assumeDone?: string | null): { ei: number; si: number } | null {
  if (!w) return null; const list = w.exercises; const isDone = (s: WSet) => s.done || (assumeDone != null && s.id === assumeDone);
  /* „Pomiń dziś” — blok poza kartą */
  const firstOpen = (i: number) => exById(list[i].exerciseId) && !list[i].skipped ? list[i].sets.findIndex(s => !isDone(s)) : -1;
  for (let ei = 0; ei < list.length; ei++) {
    const si = firstOpen(ei); if (si < 0) continue; const g = list[ei].groupId; if (!g) return { ei, si };
    const members = ssMembers(list, x => x.groupId === g); let best = { ei, si }; let bestKey = Infinity;
    for (let j = ei; j < list.length; j++) {
      const x = list[j]; if (x.groupId !== g) continue; const k = firstOpen(j); if (k < 0) continue;
      const done = members.get(ssRoot(list, x))!.reduce((n, b) => n + b.sets.filter(y => isDone(y) && isRoundSet(y)).length, 0);
      const key = done - (x.sets[k].kind === 'drop' && k > 0 && isDone(x.sets[k - 1]) ? 1 : 0); /* drop set w rundzie swojej serii */
      if (key < bestKey) { bestKey = key; best = { ei: j, si: k }; }
    }
    return best;
  }
  return null;
}
