/*
 * Migracja — rekordy: liczby z importu (serie, kg ze starych danych w funtach), serie, treningi, pozycje szablonów (wiersze, zamienniki,
 * pola zamiany E2) i powtórzone identyfikatory. Kroki woła migrate (lib/state/migrate.ts) w ustalonej kolejności.
 * Zależy od: ./util, ./templates, ./setvals, ./pause, ./time, ./groups; zewnętrzne: ../units, ../seed, ../i18n.
 */
import { tIn } from '../i18n';
import { snapLegacyLb } from '../units';
import { uid, DEFAULT_REST, SET_KINDS, IMPLS, type TemplateAlt } from '../seed';
import { isObj, arr, parseNum, idOf, tsOf, intIn, kg2, REPS_MAX } from './util';
import { cleanTz } from './time';
import { PRE_KEYS } from './setvals';
import { normalizeGroups } from './groups';
import { cleanPauses, setPauses } from './pause';
import { syncItem, cleanFolder, cleanNote } from './templates';

/** Runda 55: wartości zapisane przez starą wersję z funtów przyciągamy tylko w danych sprzed schematu 11 — nowsze kg (np. 45,359237) zostają co do cyfry. */
let legacyLb = false;
export function setLegacyLb(v: boolean) { legacyLb = v; }
export const snapL = (v: unknown) => legacyLb ? snapLegacyLb(v) : v;
/** Runda 50: nieujemna liczba z importu (także z tekstu, przecinek dziesiętny) albo ''. */
export const posNum = (v: unknown): number | '' => {
  const n = parseNum(v);
  return n == null ? '' : Math.max(0, n);
}; // runda 57: bez zaokrąglania (waga, sen, asysta)
/** Runda 48/49: wartość serii z importu — liczba (także z tekstu) albo ''. Tylko asysta ±kg bywa ujemna; RPE ≤ 10, powtórzenia całkowite, bez
 * absurdalnych rzędów wielkości. */
const SET_NUM = ['weight', 'reps', 'durationSec', 'distanceM', 'rpe', 'addKg'] as const;
function setNum(k: typeof SET_NUM[number], v: unknown): number | '' {
  if (v === '') return ''; /* runda 74: najczęstszy przypadek przy starcie (puste pola serii) bez parsowania */
  const n = parseNum(v); // runda 50: „62,5” z tekstu
  if (n == null) return '';
  const x = k === 'addKg' ? n : Math.max(0, n);
  const r = k === 'rpe' ? Math.min(10, x) : k === 'reps' ? Math.floor(x)
      : k === 'durationSec' ? Math.min(86400, Math.round(x)) /* runda 61: doba, jak cel stopera */
      : k === 'distanceM' ? Math.round(x) /* runda 57: pełne s i m jak w polach i stoperze */ : x;
  return k === 'weight' || k === 'addKg' ? kg2(snapL(r) as number) : r;
}
/** Schemat 16 (E2, docs/14 pkt 2.2, M1–M4) — pola zamiany bloku; po sanityzacji exerciseId i impl. Istnienia ćwiczenia swappedFrom nie sprawdzamy
 * (jak tplItemId) — ekran znosi brak. splitFrom i altSkip żyją tylko w treningu w toku (historia — jak staleAck). */
function fixSwapFields(e: any, live: boolean) {
  { const v = idOf(e.swappedFrom); if (v && v !== e.exerciseId) e.swappedFrom = v; else delete e.swappedFrom; } /* M1 */
  if (e.implPinned !== true || e.impl === undefined) delete e.implPinned; /* M2 */
  { const v = live ? idOf(e.splitFrom) : null; if (v) e.splitFrom = v; else delete e.splitFrom; } /* M3 */
  if (!live || e.altSkip !== true) delete e.altSkip; /* M4 */
  if (!live || !(Number.isInteger(e.occ) && e.occ >= 0)) delete e.occ; /* Q-016: znacznik kolejności bloku — tylko trening w toku */
  if (!live || e.skipped !== true) delete e.skipped; /* 07.10.2026 wieczór: „Pomiń dziś” — jak altSkip, tylko trening w toku */
}
/** Schemat 16 (E2 W3, docs/14 pkt 2.2, M5; M6 — po filtrze ćwiczeń, M7 — usunięte miejsce zostaje): zamienniki pozycji szablonu z importu —
 * biała lista pól, id tekstem, przerwa jak pozycji, przyrząd tylko znany; jeden wpis na miejsce (pierwszy); zamiennik = ćwiczenie pozycji bez
 * przyrządu odpada. */
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
/** Krok migracji: szablony (pola pozycji, wiersze, zamienniki, notatka, nazwa, miejsce, folder, archiwum). */
export function fixTemplates(raw: any, stamp: (o: any, fallbackTs?: number) => void) {
  raw.templates = arr(raw.templates);
  raw.templates.forEach((t: any) => {
    stamp(t);
    if (typeof t.name !== 'string') t.name = '';
    t.items = arr(t.items);
    t.items = t.items.filter((it: any) => idOf(it.exerciseId) != null);
    t.items.forEach((it: any) => {
      it.id = idOf(it.id) ?? uid();
      it.exerciseId = idOf(it.exerciseId);
      {
        const v = parseNum(it.targetSec);
        it.targetSec = v == null || v < 0 ? '' : Math.min(86400, Math.round(v));
      } /* runda 51 */
      it.groupId = idOf(it.groupId);
      it.sets = intIn(it.sets, 1, 50) ?? 1; /* runda 15: liczba, nie tekst z importu */
      if (it.startWeight === undefined) it.startWeight = '';
      for (const k of ['repMin', 'repMax']) it[k] = intIn(it[k], 1, 100);
      {
        const v = parseNum(it.restSec);
        it.restSec = v == null || v < 0 ? null : Math.min(1800, Math.round(v));
      } /* runda 49: także tekst, jak przerwa ćwiczenia */ /* runda 17: limit 1800 */
      {
        const v = parseNum(it.startWeight);
        it.startWeight = v == null ? '' : kg2(snapL(v) as number);
      }
      fixAlternates(it);
      fixRows(it);
    });
  });
  raw.templates.forEach((x: any) => {
    const n = typeof x.note === 'string' ? cleanNote(x.note) : '';
    if (n) x.note = n; else delete x.note;
  }); /* audyt 0.10 UX-10: notatka szablonu */
  raw.templates.forEach((x: any) => {
    const n = x.name.replace(/\s+/g, ' ').trim();
    x.name = n || tIn(raw.settings?.language, 'Nowy szablon');
    {
      const l = idOf(x.locationId);
      if (l) x.locationId = l; else delete x.locationId;
    } /* P-003 */
    {
      const f = typeof x.folder === 'string' ? cleanFolder(x.folder) : '';
      if (f) x.folder = f; else delete x.folder;
    }
    if (x.archived !== true) delete x.archived; /* 07.10.2026 wieczór: folder i archiwum */
  }); // runda 35: jak nazwy ćwiczeń
  /* Decyzja właściciela 03.10.2026 (08:11): aplikacja nie zmienia ciężarów ani treści szablonów użytkownika — także przy przejściu na schemat 15
   * (wcześniejsza jednorazowa zmiana 48 → 24 kg z P-004 usunięta: 48 zostaje 48). Zostaje tylko dotychczasowa normalizacja, ta sama co w main:
   * pola pozycji wyżej (liczby, zakresy, siatka kg), a niżej usunięcie pozycji, których ćwiczenia nie ma albo jest usunięte (runda 82b — docs/10). */
}
const fixSet = (s: any) => {
  s.id = idOf(s.id) ?? uid(); s.bandId = idOf(s.bandId) ?? ''; // runda 51
  // Runda 48: wartości serii to liczba albo '' (import/ręczna edycja: tekst, tablica, obiekt, NaN); tylko asysta ±kg może być ujemna.
  /* runda 74: brak (undefined/null) też daje '' — przez setNum, bez osobnej pętli */ for (const k of SET_NUM) s[k] = setNum(k, s[k]);
  // runda 27: stare wpisy z funtów — snapLegacyLb w setNum
  if (typeof s.bandId !== 'string') s.bandId = '';
  if (s.noBand !== true || s.bandId) delete s.noBand;
  if (s.completedAt != null) s.completedAt = tsOf(s.completedAt);
  {
    const v = parseNum(s.actualRest);
    s.actualRest = v == null || v < 0 ? null : Math.min(3600, Math.round(v));
  } /* runda 52: jak przy odhaczeniu (< 1 h) */
  if (typeof s.note !== 'string') s.note = '';
  if (s.toFill !== true || !s.done) delete s.toFill; /* 0.20: znacznik „do uzupełnienia” (zegarek) — tylko true i tylko przy odhaczonej serii */
  if (!(SET_KINDS as readonly string[]).includes(s.kind)) s.kind = s.warmup ? 'warmup' : 'normal';
  s.warmup = s.kind === 'warmup'; // runda 15: nieznany typ z importu
  s.done = !!s.done; if (s.completedAt === undefined) s.completedAt = null; if (s.actualRest === undefined) s.actualRest = null;
  // Runda 5: hinted to mapa {pole: wstawiona wartość}; stary format (lista) albo śmieci → brak podpowiedzi.
  if (s.hinted != null && (typeof s.hinted !== 'object' || Array.isArray(s.hinted))) s.hinted = undefined;
  // Runda 49: podpowiedź tylko dla pól wartości (id/kind nie mogą zostać wyczyszczone przy cofnięciu) i w tej samej postaci co wartości.
  if (s.hinted) {
    const h: any = {};
    for (const k of SET_NUM) if (k in s.hinted) {
      const v = setNum(k, s.hinted[k]);
      if (v !== '') h[k] = v;
    }
    if (idOf(s.hinted.bandId)) h.bandId = idOf(s.hinted.bandId);
    s.hinted = Object.keys(h).length ? h : undefined;
  }
  if (s.pre != null) {
    const h: any = {};
    if (typeof s.pre === 'object' && !Array.isArray(s.pre)) for (const k of PRE_KEYS) if (k in s.pre) {
      const v = setNum(k, s.pre[k]);
      if (v !== '') h[k] = v;
    }
    if (Object.keys(h).length) s.pre = h; else delete s.pre;
  } /* decyzja 02.10 (audyt B2) */
};
export const fixWorkout = (raw: any, owner: string, w: any) => {
  if (typeof w.loggedBy !== 'string' || !w.loggedBy) w.loggedBy = owner;
  if (typeof w.sessionMode !== 'string' || !w.sessionMode) w.sessionMode = 'solo';
  if (typeof w.healthUUID !== 'string' || !w.healthUUID) w.healthUUID = null; /* runda 52 */
  delete w.bodyWeightKg; /* schemat 13 (Q-001): bez zamrożonej masy ciała */
  w.startedAt = tsOf(w.startedAt);
  w.finishedAt = w === raw.active ? null : (tsOf(w.finishedAt) ?? w.startedAt);
  if (w !== raw.active || tsOf(w.staleAck) == null)
    delete w.staleAck;
  else
    /* 08.10.2026: pauza — przedziały uporządkowane w granicach treningu (cleanPauses), pausedAt tylko w treningu w toku i nie przed startem */
    w.staleAck = tsOf(w.staleAck);
  {
    if (w.startedAt != null) setPauses(w, cleanPauses(w.pauses, w.startedAt, w.finishedAt)); else delete w.pauses;
    delete w.pausedMs;
    const pa = tsOf(w.pausedAt);
    if (w === raw.active && pa != null && w.startedAt != null && pa >= w.startedAt) w.pausedAt = pa; else delete w.pausedAt;
  /* runda 69 */
  /* runda 49/51: trening z historii zawsze zakończony; trening w toku — nie */
  /* runda 49: zakończony (choć nieczytelny) trening zostaje w historii */
  }
  if (w.finishedAt != null && w.finishedAt < w.startedAt) w.finishedAt = w.startedAt; /* runda 48 */
  if (typeof w.templateName !== 'string') w.templateName = '';
  if (typeof w.note !== 'string') w.note = '';
  w.templateId = idOf(w.templateId);
  {
    const l = idOf(w.locationId);
    if (l) w.locationId = l; else delete w.locationId;
  } /* P-003: miejsce zostaje także po usunięciu miejsca („(usunięte miejsce)”) */
  if (w.live !== true) delete w.live; /* 0.16.0 (P11 B): znacznik treningu na żywo — tylko true */
  if (w.deload !== true) delete w.deload; /* audyt 0.10 (D1+): znacznik treningu deload — tylko true */
  if (w.healthPending !== true || w.healthUUID || w === raw.active) delete w.healthPending; /* J2 (fala 2): tylko zakończony, niezapisany w Zdrowiu */
  {
    const z = cleanTz(w.tzOffsetMin);
    if (z === undefined) delete w.tzOffsetMin; else w.tzOffsetMin = z;
  } /* J3: strefa startu — zła wartość odpada (= strefa bieżąca, jak dotąd) */
  /* 0.20 (docs/35): zdarzenia z zegarka i sesja zegarka — pola opcjonalne bez zmiany schematu. Dziennik zdarzeń tylko w treningu w toku (lista krótkich id);
   * sesja zegarka (`watch`) w treningu w toku albo zakończonym, który czeka na Zdrowie, i tylko z poprawnymi liczbami. */
  if (w === raw.active && Array.isArray(w.watchEvents)) w.watchEvents = w.watchEvents.filter((x: unknown) => typeof x === 'string' && x.length > 0 && x.length <= 64).slice(-200); else delete w.watchEvents;
  if (w.watchEvents?.length === 0) delete w.watchEvents;
  if (!w.watchEvents || !Number.isFinite(w.watchLastAt)) delete w.watchLastAt; /* M1-005: godzina najnowszego zdarzenia — tylko z dziennikiem i jako liczba */
  {
    const k = w.watch; const keep = isObj(k) && (w === raw.active || (w.healthPending === true && !w.healthUUID)) && (k.client === 'apple' || k.client === 'garmin') && tsOf(k.startedAt) != null;
    if (!keep) delete w.watch; else {
      const o: any = { client: k.client, startedAt: tsOf(k.startedAt) };
      if (tsOf(k.endedAt) != null) o.endedAt = tsOf(k.endedAt);
      if (k.saved === true || k.saved === false) o.saved = k.saved;
      w.watch = o;
    }
  }
  w.exercises = arr(w.exercises).filter((e: any) => idOf(e.exerciseId) != null); /* runda 50/51 */
  if (w !== raw.active) {
    w.exercises.forEach((e: any) => {
      e.sets = arr(e.sets).filter((s: any) => !!s.done);
      e.sets.forEach((s: any) => {
        delete s.pre;
        delete s.toFill; /* 0.20: „do uzupełnienia” tylko w treningu w toku */
      });
    });
    w.exercises = w.exercises.filter((e: any) => e.sets.length);
  } /* runda 59: historia = tylko odhaczone serie, jak po „Zakończ” */
  w.exercises.forEach((e: any) => {
    e.exerciseId = idOf(e.exerciseId);
    e.id = idOf(e.id) ?? uid();
    if (e.tplItemId != null) e.tplItemId = idOf(e.tplItemId) ?? undefined;
    if (!(IMPLS as readonly unknown[]).includes(e.impl)) delete e.impl; /* schemat 15 (decyzja 8c): tylko znany przyrząd */
    fixSwapFields(e, w === raw.active); /* schemat 16 (E2) */
    {
      const n = w.deload === true ? parseNum(e.deloadFull) : null;
      if (n != null && n >= 1) e.deloadFull = Math.min(50, Math.round(n)); else delete e.deloadFull;
    } /* audyt 0.10 (D1+): pole opcjonalne bez zmiany schematu */
    for (const k of ['repMin', 'repMax']) e[k] = intIn(e[k], 1, 100); /* runda 49: jak w szablonie */
    e.groupId = idOf(e.groupId);
    {
      const v = parseNum(e.restSec);
      e.restSec = v == null || v < 0 ? DEFAULT_REST : Math.min(1800, Math.round(v));
    }
    e.sets = arr(e.sets);
    e.sets.forEach(fixSet);
  });
  normalizeGroups(w.exercises);
};
/** Powtórzone id w liście → nowe id deterministyczne („<id>~2”, „~3”…; pierwszy wpis zachowuje id): dwa wczytania tych samych danych dają ten sam
 * wynik (porównania eksport → import, restart). Jedna reguła dla wszystkich list z id (także miejsca i zapisane plany — DAT2-04). */
export function freshIds(list: any[]) { const seen = new Set<string>(list.map(o => o?.id).filter((x: unknown) => typeof x === 'string'));
  const first = new Set<string>(); for (const o of list) { if (typeof o?.id !== 'string') continue; if (!first.has(o.id)) { first.add(o.id); continue; }
    let n = 2; while (seen.has(`${o.id}~${n}`)) n++; o.id = `${o.id}~${n}`; seen.add(o.id); first.add(o.id); } }
/** Decyzja właściciela 06.10.2026 (wariant A): powtórzony identyfikator w danych (np. kopia sklejona ręcznie z dwóch plików) dostaje nowy —
 * nic nie ginie (dotąd usunięcie jednego treningu kasowało oba, drugie ćwiczenie/guma było nieosiągalne). Pierwsze wystąpienie zachowuje id,
 * więc odwołania (pozycje szablonów, bloki, gumy serii) wskazują to samo co przedtem. Idempotentne: przy unikalnych id nic nie zmienia.
 * Znalezisko tests/matrix-data-fuzz.test.ts. */
export function uniqueIds(raw: any) {
  const fresh = freshIds;
  /* ten sam obiekt w kilku miejscach (dane z pamięci, nie z pliku) — osobne kopie, żeby zmiana id jednej nie zmieniała wszystkich */
  const objs = new Set<object>();
  const own = (list: any[]) => list.map(o => {
    if (!isObj(o)) return o;
    if (objs.has(o)) return JSON.parse(JSON.stringify(o));
    objs.add(o);
    return o;
  });
  raw.exercises = own(raw.exercises); raw.bands = own(raw.bands); raw.templates = own(raw.templates); raw.workouts = own(raw.workouts);
  for (const t of raw.templates) if (Array.isArray(t.items)) {
    t.items = own(t.items);
    for (const it of t.items) if (Array.isArray(it?.rows)) it.rows = own(it.rows);
  }
  for (const w of [...raw.workouts, ...(isObj(raw.active) ? [raw.active] : [])]) if (Array.isArray(w.exercises)) {
    w.exercises = own(w.exercises);
    for (const e of w.exercises) if (Array.isArray(e?.sets)) e.sets = own(e.sets);
  }
  fresh(raw.exercises); fresh(raw.bands); fresh(raw.templates);
  fresh(raw.templates.flatMap((t: any) => arr(t.items)));
  for (const it of raw.templates.flatMap((t: any) => arr(t.items))) if (Array.isArray(it.rows)) fresh(it.rows);
  const ws = [...raw.workouts, ...(isObj(raw.active) ? [raw.active] : [])];
  fresh(ws); const blocks = ws.flatMap((w: any) => arr(w.exercises)); fresh(blocks); fresh(blocks.flatMap((e: any) => arr(e.sets)));
}
/** Wczytanie/import: wiersze poprawne albo brak (pozycja wraca do `sets` + `startWeight`). */
function fixRows(it: any) {
  if (!Array.isArray(it.rows)) { delete it.rows; return; }
  const num = (v: unknown, min: number, max: number, int = true) => {
    const x = parseNum(v);
    return x == null ? '' : Math.min(max, Math.max(min, int ? Math.round(x) : x));
  };
  it.rows = it.rows.filter(isObj).slice(0, 50).map((r: any) => ({ id: typeof r.id === 'string' && r.id ? r.id : uid(),
      kind: (SET_KINDS as readonly string[]).includes(r.kind) ? r.kind : 'normal',
    reps: num(r.reps, 0, REPS_MAX), weight: (v => v == null ? '' : kg2(snapL(v) as number))(parseNum(r.weight)), durationSec: num(r.durationSec, 0, 86400),
        distanceM: num(r.distanceM, 0, 1e6), ...(typeof r.bandId === 'string' && r.bandId ? { bandId: r.bandId } : {}) }));
  syncItem(it);
}
