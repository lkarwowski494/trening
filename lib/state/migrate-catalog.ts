/*
 * Migracja — ćwiczenia i katalog biblioteki: nazwy, metryka, pola sprzętowe (P-003), klucz katalogu (E2), kroki katalogu (libExtra),
 * ćwiczenia wycofane z katalogu (scalone i usunięte, research biblioteki 09.10.2026).
 * Zależy od: ./util; zewnętrzne: ../seed, ../catalog.generated, ../i18n.
 */
import { tIn, fold } from '../i18n';
import { metricFor, loadModeFor, loadMult, musclesFor, hasTime, hasReps, hasWeight, hasDistance, METRICS, GROUPS, LIB, SINGLE_IMPLEMENT, equipFields,
    libExercise, LIB_EXTRA_REVS, LIB_EXTRA_REV, LIB_MUSCLE_FIXES, LIB_FIELD_FIXES, LIB_RENAMED, LIB_MERGED, LIB_RETIRED, libExtraRevOf, LIB_BASE_NAMES_V1, own,
    type Exercise, LIB_KEYS, LIB_DISPLAY_NAME, catalogKey, libKeyCandidates, type LoadMode } from '../seed';
import { CATALOG, CATALOG_REV } from '../catalog.generated';
import { isObj, arr, parseNum, idOf, REST_MAX } from './util';

/* audyt 04.10 (LOW): reguła danych sprzed schematu 10 tylko dla pierwszych 125 nazw (pierwsza wersja — także później scalone i przemianowane) —
 * własne ćwiczenie „Svend Press” z web 0.3 nie staje się biblioteką */
const LIB_NAMES = LIB_BASE_NAMES_V1;
/** P-003 (schemat 14): pola sprzętowe ćwiczenia. Brak (dane sprzed 14) → z katalogu dla biblioteki (flaga lib + nazwa kanoniczna), dla własnych
 * bez wymagań (zawsze dostępne) ze źródłem obciążenia ze zgrubnego sprzętu. Istniejące — tylko poprawiane (idempotentnie; edycja zostaje). */
const LOAD_SOURCES = ['barbell', 'dumbbell', 'cable', 'machine_stack', 'bodyweight', 'trap_bar', 'ez_bar', 'plate_loaded_machine', 'kettlebell', 'smith',
    'band', 'none'];
const PATTERNS = new Set(Object.values(CATALOG).map(c => c.pattern as string).concat('other'));
function fixEquipFields(e: any) {
  /* audyt M6: ćwiczenie z biblioteki z wymaganiami z innej wersji katalogu (i nieedytowane: catalogRev ≠ 'user') dostaje aktualne */
  const key: string = catalogKey(e) ?? e.name; /* E2 (audyt 0.10): katalog po kluczu — przemianowane ćwiczenie biblioteki dalej dostaje odświeżone wymagania */
  const fromCatalog = e.lib === true && Object.prototype.hasOwnProperty.call(CATALOG, key);
  if (!Array.isArray(e.requires) || (fromCatalog && e.catalogRev !== 'user' && e.catalogRev !== CATALOG_REV)) {
    const f = equipFields(key, e.equipment, e.lib === true);
    delete e.implements;
    delete e.pattern;
    delete e.catalogRev;
    Object.assign(e, f);
    return;
  }
  if (!fromCatalog && e.catalogRev !== 'user') delete e.catalogRev;
  const strs = (a: unknown): string[] => Array.isArray(a) ? [...new Set(a.filter((x: unknown): x is string => typeof x === 'string' && !!x))] : [];
  /* audyt (LOW): uszkodzona grupa wymagań czyni ćwiczenie MNIEJ dostępnym — grupa bez żadnej poprawnej możliwości = „?” (niespełnialna) */
  e.requires = e.requires.map((g: unknown) => { const v = strs(g); return v.length ? v : ['?']; }); e.recommended = strs(e.recommended);
  if (!LOAD_SOURCES.includes(e.loadSource)) e.loadSource = equipFields(key, e.equipment, e.lib === true).loadSource;
  if (!PATTERNS.has(e.pattern)) delete e.pattern; if (e.implements !== 1 && e.implements !== 2) delete e.implements;
}
/** Krok migracji: ćwiczenia (nazwy, metryka, pola, klucz katalogu, kroki katalogu). Kolejność i treść jak w migrate. */
export function migrateExercises(raw: any, owner: string, stamp: (o: any, fallbackTs?: number) => void) {
  raw.exercises = arr(raw.exercises).filter(e => typeof e.name === 'string');
  raw.exercises.forEach((e: any) => {
    const n = e.name.replace(/\s+/g, ' ').trim();
    e.name = n || tIn(raw.settings?.language, 'Nowe ćwiczenie');
  }); // runda 36: w języku z ustawień danych // runda 34/35: spacje na brzegach; pusta nazwa (wyjście bez zatwierdzenia) → domyślna
  /* Audyt przed telefonem (A1, decyzja 02.10 „zabezpiecz”): stare dane bez metryki (web 0.3 znała tylko kg × powt.) — gdy metryka
   * z biblioteki ukryłaby zapisane kg/powtórzenia (np. plank → czas), ćwiczenie zostaje w formie kg × powt.; zmiana w edycji ćwiczenia. */
  const logged = new Map<string, { w: boolean; r: boolean }>();
  if (raw.exercises.some((e: any) => !(METRICS as readonly string[]).includes(e.metric)))
    for (const w of [...arr(raw.workouts), ...(isObj(raw.active) ? [raw.active] : [])]) for (const x of arr(w?.exercises)) {
      const id = idOf(x?.exerciseId); if (id == null) continue; const o = logged.get(id) ?? { w: false, r: false };
      for (const st of arr(x.sets)) {
        if (w !== raw.active && !st.done) continue;
        if ((parseNum(st?.weight) ?? 0) > 0 || (parseNum(st?.addKg) ?? 0) !== 0) o.w = true;
        if ((parseNum(st?.reps) ?? 0) > 0) o.r = true;
      }
      logged.set(id, o); }
  raw.exercises.forEach((e: any) => {
    stamp(e);
    const nm: string = e.lib === true && typeof e.libKey === 'string' && LIB_KEYS.has(e.libKey) ? e.libKey : e.name; /* E2: wartości z katalogu po kluczu */
    // Runda 16: wartości spoza słownika / nieliczbowe (np. z ręcznie edytowanego backupu) wracają do domyślnych.
    if (!(METRICS as readonly string[]).includes(e.metric)) {
      const lib = metricFor(nm);
      const g = logged.get(idOf(e.id) ?? '');
      e.metric = g && ((g.w && !hasWeight(lib)) || (g.r && !hasReps(lib))) ? (g.w ? 'weight_reps' : 'reps') : lib;
    }
    if (!['per_dumbbell', 'total', 'unilateral'].includes(e.loadMode)) e.loadMode = loadModeFor(e.equipment, nm);
    for (const k of ['restSec', 'restWarmupSec']) { const v = parseNum(e[k]); e[k] = v == null || v < 0 ? null : Math.min(REST_MAX, Math.round(v)); }
    if (!Array.isArray(e.muscles)) { const [a, b] = musclesFor(nm, e.group); e.muscles = a; e.secondaryMuscles = b; }
    if (!Array.isArray(e.secondaryMuscles)) e.secondaryMuscles = [];
    e.muscles = e.muscles.filter((x: unknown) => typeof x === 'string');
    e.secondaryMuscles = e.secondaryMuscles.filter((x: unknown) => typeof x === 'string');
    delete e.bodyweightPct; /* schemat 13 (runda 75, Q-001): masa ciała nie wchodzi do obliczeń — udział % usunięty */
    if (e.lib === undefined && LIB_NAMES.has(e.name) && (Number(raw.schemaVersion) || 0) < 10)
      e.lib = true; /* runda 52/56: tylko dane sprzed schematu 10 — stała granica, nie ruchome SCHEMA_VERSION (podbicie do 11 cofało poprawkę) */
    if (e.lib !== true) delete e.lib;
    /* E2 (audyt 0.10, X-03): klucz katalogu — prawidłowy zostaje; brak → nazwa kanoniczna, gdy nazwa jest w katalogu (dane sprzed klucza);
     * przemianowane przed poprawką — odzyskiwane niżej (libKeyFromFields), inaczej bez klucza. Ćwiczenia własne nie mają klucza. */
    /* Research biblioteki (09.10.2026): klucz przemianowany → nowy (nazwa równa dawnemu kluczowi też — wyniki wstecz bez zmian, E2); klucz scalony
     * albo usunięty zostaje do retireCatalog niżej (przenosi dane i znika). Idempotentne: nowy klucz nie jest już dawnym. */
    if (e.lib === true) {
      const k0 = typeof e.libKey === 'string' && (LIB_KEYS.has(e.libKey) || LIB_RETIRED.has(e.libKey) || own(LIB_RENAMED, e.libKey)) ? e.libKey
          : LIB_KEYS.has(e.name) || LIB_RETIRED.has(e.name) || own(LIB_RENAMED, e.name) ? e.name : undefined;
      const k = k0 !== undefined ? own(LIB_RENAMED, k0) ?? k0 : undefined; if (k0 !== undefined && k !== k0 && e.name === k0) e.name = k;
      if (k !== undefined) e.libKey = k; else delete e.libKey; } else delete e.libKey;
    /* SEC2-01: nazwa ze znakiem towarowym, nieprzemianowana (równa kluczowi) → nazwa ogólna; klucz zostaje, idempotentnie */
    if (e.lib === true && typeof e.libKey === 'string' && e.name === e.libKey) { const d = own(LIB_DISPLAY_NAME, e.libKey); if (d) e.name = d; }
    if (typeof e.tempo !== 'string') e.tempo = ''; if (typeof e.notes !== 'string') e.notes = '';
    e.bandAssistable = !!e.bandAssistable;
    // Runda 41: tylko prawdziwe true archiwizuje; partia i sprzęt spoza słownika → „inne”.
    if (e.archived !== true) delete e.archived;
    if (!(GROUPS as readonly string[]).includes(e.group)) e.group = 'inne';
    if (!['hantle', 'sztanga', 'masa ciała', 'maszyna', 'linki', 'inne'].includes(e.equipment)) e.equipment = 'inne';
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
    for (const e of raw.exercises) if (e.lib === true && e.libKey === undefined) {
      const ks = libKeyCandidates(e).filter(k => !taken.has(k));
      if (ks.length === 1) cand.set(ks[0], [...(cand.get(ks[0]) ?? []), e]);
    }
    for (const [k, list] of cand) if (list.length === 1 && LIB_KEYS.has(k)) {
      const e = list[0];
      e.libKey = k;
      if (e.catalogRev !== 'user') {
        delete e.catalogRev;
        fixEquipFields(e);
      }
    } }
  /* Katalog 04.10.2026 (decyzja właściciela: rozbudowa katalogu): dane bez znacznika katalogu dostają nowe ćwiczenia biblioteki RAZ (znacznik
   * State.libExtra — ćwiczenie usunięte później przez użytkownika nie wraca); pomijane, gdy istnieje ćwiczenie o tej samej nazwie (także własne).
   * Audyt 04.10 (HIGH): znacznik zamiast granicy schematu — build 01f2bee miał już schemat 16 bez katalogu. */
  const sameList = (a: unknown, b: readonly string[]) => Array.isArray(a) && a.length === b.length && a.every((x, i) => x === b[i]);
  /* Krok b (04.10 wieczór): kroki kolejno od zapisanego znacznika; nieznany (nowszy) znacznik — bez zmian. */
  /* Audyt kroku b (MEDIUM): libExtra zostaje wartością pierwszego kroku (build 643cba7 porównuje ją dosłownie i przy innej dopisałby usunięte
   * ćwiczenia po powrocie do starszej wersji); kolejne kroki — w libExtraStep. */
  {
    const mark = typeof raw.libExtraStep === 'string' ? raw.libExtraStep : raw.libExtra;
    const done = typeof mark === 'string' ? LIB_EXTRA_REVS.indexOf(mark) : -1;
    if (done >= 0 || typeof mark !== 'string') {
      /* E2: przemianowane ćwiczenie z kluczem nie wraca pod starą nazwą */
      const have = new Set(raw.exercises.flatMap((e: any) => [fold(e.name), ...(e.libKey ? [fold(e.libKey)] : [])]));
      for (const rev of LIB_EXTRA_REVS.slice(done + 1)) {
        for (const row of LIB) if (libExtraRevOf(row[0]) === rev && !have.has(fold(row[0]))) {
          raw.exercises.push(libExercise(row, owner));
          have.add(fold(row[0]));
        }
        for (const f of LIB_MUSCLE_FIXES)
          if (f.rev === rev)
            for (const e of raw.exercises)
              if (e.lib === true && e.libKey === f.name && sameList(e.muscles, f.from[0]) && sameList(e.secondaryMuscles, f.from[1])) {
                const [a, b] = musclesFor(f.name, e.group); /* E2: po kluczu */
                e.muscles = a;
                e.secondaryMuscles = b;
              }
        /* research biblioteki (09.10.2026): poprawki pól — tylko wartość równa dawnej domyślnej; miara tylko ćwiczenia bez serii i pozycji szablonu
         * (nic nie znika z widoku);
         * audyt kontrolny 1 (X2-01): tryb ciężaru z innym mnożnikiem objętości (np. total ×1 → unilateral ×2) też tylko bez serii i pozycji szablonu — inaczej
         * zapisane ciężary zmieniłyby sens (objętość, rekordy sumy dawnych sesji); ten sam mnożnik — tylko etykieta, stosowana zawsze (jak okW w
         * retireCatalog) */
        { const fixes = LIB_FIELD_FIXES.filter(f => f.rev === rev); if (fixes.length) { const inUse = usedIds(raw);
          /* DAT2-01: asysta gumą (asysta ↔ opór) — tylko gdy ćwiczenie nie ma serii z gumą (dawne serie z gumą zmieniłyby znaczenie i rekordy) */
          const banded = new Set<string>();
          for (const w of [...arr(raw.workouts), ...(isObj(raw.active) ? [raw.active] : [])])
            for (const x of arr(w.exercises)) if (arr(x.sets).some((z: any) => typeof z?.bandId === 'string' && z.bandId)) {
              const id = idOf(x.exerciseId);
              if (id) banded.add(id);
            }
          const allowed = (f: typeof fixes[number], id: string) => f.field === 'metric' ? !inUse.has(id)
              : f.field === 'loadMode' ? loadMult(f.from as LoadMode) === loadMult(f.to as LoadMode) || !inUse.has(id)
              : f.field === 'bandAssistable' ? !banded.has(id) : true;
          for (const f of fixes)
            for (const e of raw.exercises)
              if (e.lib === true && e.libKey === f.name && JSON.stringify(e[f.field]) === JSON.stringify(f.from) && allowed(f, e.id))
                e[f.field] = JSON.parse(JSON.stringify(f.to)); } }
      }
      raw.libExtra = LIB_EXTRA_REVS[0]; raw.libExtraStep = LIB_EXTRA_REV; } }
}
/** Id ćwiczeń użytych w treningach (historia, trening w toku) i szablonach (pozycje, zamienniki) — na surowych danych (przed sanityzacją też). */
function usedIds(raw: any): Set<string> {
  const out = new Set<string>(); const add = (v: unknown) => { const id = idOf(v); if (id != null) out.add(id); };
  for (const w of [...arr(raw.workouts), ...(isObj(raw.active) ? [raw.active] : [])]) for (const x of arr(w.exercises)) {
    add(x.exerciseId);
    add(x.swappedFrom);
  }
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
export function retireCatalog(raw: any) {
  const retired = raw.exercises.filter((e: any) => e.lib === true && typeof e.libKey === 'string' && LIB_RETIRED.has(e.libKey)); if (!retired.length) return;
  const ws: any[] = [...raw.workouts, ...(raw.active ? [raw.active] : [])]; const used = usedIds(raw); const drop = new Set<string>();
  const personal = (e: any) => !!e.notes || e.restSec != null || e.restWarmupSec != null || !!e.tempo;
  const detach = (e: any) => { delete e.lib; delete e.libKey; if (e.catalogRev !== 'user') delete e.catalogRev; };
  const nz = (v: unknown) => v !== '' && v != null && Number(v) !== 0;
  for (const x of retired) {
    const key: string = x.libKey; const target = own(LIB_MERGED, key);
    if (!target) { if (used.has(x.id) || personal(x) || x.name !== key) detach(x); else drop.add(x.id); continue; }
    const T = raw.exercises.find((e: any) => e !== x && !drop.has(e.id) && e.lib === true && e.libKey === target && e.archived !== true)
        ?? raw.exercises.find((e: any) => e !== x && !drop.has(e.id) && e.lib === true && e.libKey === target);
    const row = LIB.find(r => r[0] === target); const def: Exercise | undefined = row ? libExercise(row, x.ownerId) : undefined;
    const to: any = T ?? def; if (!to || x.name !== key) { detach(x); continue; }
    /* dane zapisane przy scalanym ćwiczeniu (serie treningów i wiersze szablonów) — czy docelowe pokaże je z tym samym sensem */
    const blocks = ws.flatMap(w => w.exercises.filter((b: any) => b.exerciseId === x.id));
    const rows = raw.templates.flatMap((tp: any) => tp.items.filter((it: any) => it.exerciseId === x.id).flatMap((it: any) => arr(it.rows)));
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
    if (toAdd) {
      for (const st of sets) {
        if (nz(st.weight)) {
          st.addKg = st.weight;
          st.weight = '';
        }
        if (st.pre && 'weight' in st.pre) {
          st.pre.addKg = st.pre.weight;
          delete st.pre.weight;
        }
      }
      for (const b of blocks) for (const st of b.sets) if (st.hinted && 'weight' in st.hinted) {
        st.hinted.addKg = st.hinted.weight;
        delete st.hinted.weight;
      }
    }
    if (!T) { /* docelowego nie ma — scalany wpis przejmuje jego klucz i pola z katalogu (id, notatka, przerwy, archiwum bez zmian) */
      x.libKey = target;
      x.name = target;
      for (const k of ['group', 'equipment', 'metric', 'loadMode', 'bandAssistable', 'muscles', 'secondaryMuscles', 'requires', 'recommended', 'pattern',
          'loadSource', 'catalogRev'])
        x[k] = (def as any)[k];
      delete x.implements; if (def!.implements) x.implements = def!.implements; continue; }
    for (const w of ws) for (const b of w.exercises) {
      if (b.exerciseId === x.id) b.exerciseId = T.id;
      if (b.swappedFrom === x.id) b.swappedFrom = T.id;
      if (b.swappedFrom === b.exerciseId) delete b.swappedFrom;
    }
    for (const tp of raw.templates) for (const it of tp.items) { if (it.exerciseId === x.id) it.exerciseId = T.id;
      if (it.alternates) {
        for (const a of it.alternates) if (a.exerciseId === x.id) a.exerciseId = T.id;
        it.alternates = it.alternates.filter((a: any) => a.exerciseId !== it.exerciseId || a.impl);
        if (!it.alternates.length) delete it.alternates;
      } }
    if (x.notes && x.notes !== T.notes) T.notes = T.notes ? `${T.notes}\n${x.notes}` : x.notes;
    if (T.restSec == null && x.restSec != null) T.restSec = x.restSec;
    if (T.restWarmupSec == null && x.restWarmupSec != null) T.restWarmupSec = x.restWarmupSec;
    if (!T.tempo && x.tempo) T.tempo = x.tempo;
    if (T.archived === true && x.archived !== true) delete T.archived;
    drop.add(x.id);
  }
  if (drop.size) raw.exercises = raw.exercises.filter((e: any) => !drop.has(e.id));
}
