/*
 * Migracja do bieżącego schematu (start, import, przywrócenie szkicu): kolejność kroków, ustawienia (biała lista pól), miejsca treningu,
 * wpisy poranne, masa ciała, plan tygodnia i znaczniki jednorazowych uzupełnień. Idempotentna.
 * Zależy od: ./util, ./migrate-records, ./bands, ./migrate-catalog, ./time, ./groups, ./weekplan; zewnętrzne: ../seed, ../i18n, ../equipment, ../loads.
 */
import { tIn, isLang } from '../i18n';
import { uid, defaultModules, defaultSettings, blankTimer, SCHEMA_VERSION, LOCAL_OWNER, MODULES, type State, type Location, BODY_MASS_MAX,
    BODY_MASS_LOG_MAX } from '../seed';
import { equipById, blankLoad, fillGym, GYM_FILL, fillOpts, OPT_FILL, fillEquip2, EQUIP_FILL2 } from '../equipment';
import { sanitizeLoadSpec } from '../loads';
import { isObj, arr, parseNum, idOf, tsOf, intIn, kg2, clampName, REST_MAX, DURATION_MAX_SEC } from './util';
import { localDateTs, localISODate, workoutDay, realDay, DATE_KEY } from './time';
import { cleanLevels } from './bands';
import { normalizeGoals } from '../setParts';
import { normalizeReviewAsked, normalizeIdeaShownAt } from '../review';
import { normalizeGroups } from './groups';
import { SAVED_PLANS_MAX, DELOAD_WEEKS_MAX, cleanPlanName, planDays, sameDays, normPlanHistory, cleanOverrides, cleanDoneEarly, appendPlanSegment, cleanPlanPlaces } from './weekplan';
import { unusedOneOffIds } from './places';
import { setLegacyLb, snapL, posNum, fixTemplates, fixWorkout, freshIds, uniqueIds } from './migrate-records';
import { migrateExercises, retireCatalog } from './migrate-catalog';

/** Pola Settings znane tej wersji — pola domyślne plus opcjonalne (nowe pole opcjonalne dopisz tutaj, inaczej jego zła wartość z importu
 * przejdzie jak nieznane ustawienie); reszta zostaje bez zmian — audyt 0.10 J1. */
const SETTINGS_KEYS = new Set([...Object.keys(defaultSettings()), 'effortScale', 'planReminder', 'libShowAll', 'weeklySetGoals', 'healthRead', 'reviewAsked', 'voice', 'voiceSpeaker' /* 0.20, zastąpione przez voice (19.10.2026) — znane, więc nie zostaje jako nieznane */, 'ideaShownAt']);
/** Ustawienia przeniesione poza Settings — nie zostają jako „nieznane” (J1): masa ciała bez daty → State.bodyMassLog (fala 2 audytu 0.10). */
const MOVED_SETTINGS = new Set(['bodyMass']);
const PROTO_KEYS = new Set(['__proto__', 'constructor', 'prototype']);
/** Ustawienia usunięte w schemacie 13 (runda 75, Q-001: masa ciała poza obliczeniami) — w danych sprzed 13 odpadają jak dotąd. */
const LEGACY_SETTINGS_13 = new Set(['bodyWeightKg']);
/** P-003: miejsca treningu z importu — znane pozycje sprzętu i opcje, poprawne opisy ciężarów; miejsce główne zawsze istnieje, gdy są miejsca. */
function fixLocations(s: any, stamp: (o: any) => void, language: unknown): { locations: Location[]; mainLocationId: string | null; pickerShowAll: boolean } {
  const seen = new Set<string>(); const locations: Location[] = [];
  const list = arr(s.locations);
  list.forEach(l => stamp(l));
  freshIds(list); /* DAT2-04 (= DAT-08): powtórzone id → „~n” (jak uniqueIds), bez gubienia drugiego miejsca */
  for (const l of list) {
    seen.add(l.id);
    const n = typeof l.name === 'string' ? clampName(l.name.replace(/\s+/g, ' ').trim()) : '';
    l.name = n || tIn(language, 'Miejsce'); /* audyt (LOW): limit nazwy jak w polu */
    if (l.oneOff !== true) delete l.oneOff; /* schemat 19 (docs/33 A4): miejsce jednorazowe — tylko true */
    const items = new Set<string>();
    l.equipment = arr(l.equipment).filter((e: any) => {
      const x = typeof e.item === 'string' ? equipById(e.item) : undefined;
      if (!x || items.has(e.item)) return false;
      items.add(e.item);
      const ok = new Set((x.options ?? []).map(o => o.id));
      e.opts = Array.isArray(e.opts) ? [...new Set(e.opts.filter((o: unknown) => typeof o === 'string' && ok.has(o)))] : [];
      const ld = x.load ? sanitizeLoadSpec(e.load) ?? blankLoad(x, e.load?.unit === 'lb' ? 'lb' : 'kg') : undefined;
      if (ld) e.load = ld; else delete e.load; /* weryfikacja 2: zły opis → pusty domyślny (edytor zostaje), nie usunięcie */
      if (e.off !== true) delete e.off; /* audyt M5: odznaczona pozycja z zachowanymi ciężarami */
      const lv = cleanLevels(e.item, e.levels);
      if (lv) e.levels = lv; else delete e.levels;
      for (const k of Object.keys(e)) if (!['item', 'opts', 'load', 'off', 'levels'].includes(k)) delete e[k];
      return true; });
    locations.push(l as Location);
  }
  const main = idOf(s.mainLocationId); const listed = locations.filter(l => !l.oneOff); /* schemat 19: miejscem głównym nie bywa miejsce jednorazowe */
  return { locations, mainLocationId: main && listed.some(l => l.id === main) ? main : listed[0]?.id ?? null, pickerShowAll: s.pickerShowAll === true };
}
/**
 * Migracja do bieżącego schematu. Przyjmuje backupy web 0.3, natywnej 0.1.0 i każdą późniejszą wersję;
 * dopisuje brakujące pola, pomija uszkodzone wpisy (null, nie-obiekty) zamiast się wywracać.
 * Idempotentna — można ją wołać na stanie już zmigrowanym.
 */
export function migrate(raw: unknown): State {
  if (!isObj(raw) || !Array.isArray(raw.exercises) || !Array.isArray(raw.templates)) throw new Error('bad state');
  setLegacyLb(!((Number(raw.schemaVersion) || 0) >= 11));
  const owner: string = typeof raw.ownerId === 'string' && raw.ownerId ? raw.ownerId : LOCAL_OWNER;
  const stamp = (o: any, fallbackTs?: number) => {
    o.id = idOf(o.id) ?? uid(); // runda 51: id zawsze tekstem
    if (typeof o.ownerId !== 'string' || !o.ownerId) o.ownerId = owner;
    const ts = typeof fallbackTs === 'number' && fallbackTs > 0 && tsOf(fallbackTs) != null ? fallbackTs : Date.now();
    const c = tsOf(o.createdAt); o.createdAt = c != null && c > 0 ? c : ts; // runda 52: zawsze liczba
    const u = tsOf(o.updatedAt); o.updatedAt = u != null && u > 0 ? u : o.createdAt;
  };
  migrateExercises(raw, owner, stamp);
  fixTemplates(raw, stamp);
  raw.bands = arr(raw.bands);
  raw.bands.forEach((b: any) => {
    stamp(b);
    /* T-055: dawna asysta kg gumy (przed P-001) — stara kopia się importuje, pole odpada; starsze wersje aplikacji czytają brak pola jako „bez kg” */
    delete b.nominalKg;
    if (typeof b.color !== 'string' || !b.color.trim()) b.color = '?';
    b.color = b.color.replace(/\s+/g, ' ').trim();
    b.level = intIn(b.level, 1, 7) ?? 1; /* runda 51 */
  });
  raw.workouts = arr(raw.workouts).filter(w => tsOf(w.startedAt) != null);
  raw.workouts.forEach((w: any) => {
    w.startedAt = tsOf(w.startedAt);
  });
  raw.workouts.forEach((w: any) => {
    stamp(w, w.finishedAt || w.startedAt);
    fixWorkout(raw, owner, w);
  });
  raw.workouts = raw.workouts.filter((w: any) => w.exercises.length); /* runda 60: bez pustych sesji w historii (jak po „Zakończ”, B9) */
  // Runda 16: data poranna w formacie RRRR-MM-DD (np. „2026-9-1” z ręcznej edycji → „2026-09-01”); nieczytelne odpadają.
  raw.mornings = arr(raw.mornings).filter(m => typeof m.date === 'string' && /^\d{4}-\d{1,2}-\d{1,2}/.test(m.date)).map((m: any) => {
    const [y, mo, d] = m.date.slice(0, 10).split(/[-T]/);
    m.date = `${y}-${mo.padStart(2, '0')}-${d.padStart(2, '0')}`;
    return m;
  })
    // Runda 17: tylko istniejące daty (bez „2026-13-45”) i jeden wpis na dzień (zostaje nowszy).
    .filter((m: any) => {
      const [y, mo, d] = m.date.split('-').map(Number);
      const x = new Date(y, mo - 1, d);
      return x.getFullYear() === y && x.getMonth() === mo - 1 && x.getDate() === d;
    });
  {
    const byDate = new Map<string, any>();
    for (const m of raw.mornings) {
      const o = byDate.get(m.date);
      if (!o || (tsOf(m.updatedAt) ?? 0) > (tsOf(o.updatedAt) ?? 0)) byDate.set(m.date, m);
    }
    raw.mornings = [...byDate.values()];
  }
  raw.mornings.forEach((m: any) => {
    stamp(m, localDateTs(m.date));
    for (const k of ['bb', 'sleepScore', 'sleepH', 'weight']) m[k] = posNum(m[k]); /* runda 50: liczba albo '' (obiekt z importu wywracał ekran) */
    if (m.bb !== '') m.bb = Math.min(100, Math.round(m.bb));
    if (m.sleepScore !== '') m.sleepScore = Math.min(100, Math.round(m.sleepScore));
    if (m.sleepH !== '') m.sleepH = Math.min(24, Math.round(m.sleepH * 100) / 100);
    if (m.weight !== '') {
      const w = kg2(snapL(m.weight) as number);
      m.weight = w > 0 && w <= 1000 ? w : '';
    } /* runda 61: najpierw zaokrąglenie, potem zakres */ /* runda 51: 0 = brak wpisu */
  });
  if (isObj(raw.active) && tsOf(raw.active.startedAt) != null) {
    stamp(raw.active, raw.active.startedAt);
    fixWorkout(raw, owner, raw.active);
  } else raw.active = null;
  uniqueIds(raw); /* przed porządkowaniem nieużywanych ćwiczeń — inaczej drugie wczytanie zmieniałoby dane (migrate-idem) */
  retireCatalog(raw); /* research biblioteki (09.10.2026): scalone → ćwiczenie docelowe, usunięte → własne albo znikają */
  // Runda 41: jak purgeOrphans — usunięte ćwiczenia bez żadnego treningu znikają także przy starcie i imporcie.
  {
    const used = new Set<string>();
    for (const w of [...raw.workouts, ...(raw.active ? [raw.active] : [])]) for (const x of w.exercises) used.add(x.exerciseId);
    raw.exercises = raw.exercises.filter((e: any) => e.archived !== true || used.has(e.id));
  }
  // Runda 43: pozycje szablonów wskazujące brakujące lub usunięte ćwiczenie odpadają (jak przy usuwaniu ćwiczenia w aplikacji).
  {
    const ok = new Set<string>(raw.exercises.filter((e: any) => e.archived !== true).map((e: any) => e.id));
    raw.templates.forEach((tp: any) => {
      const n = tp.items.length;
      tp.items = tp.items.filter((it: any) => ok.has(it.exerciseId));
      void n;
      tp.items.forEach((it: any) => {
        if (!it.alternates) return;
        it.alternates = it.alternates.filter((x: any) => ok.has(x.exerciseId));
        if (!it.alternates.length) delete it.alternates;
      }); /* E2 M6: zamiennik z brakującym / usuniętym ćwiczeniem odpada */
      normalizeGroups(tp.items); /* T-010 (audyt): zawsze — rozerwana grupa z importu dzieliłaby klucz bloku przy przeciąganiu */
    });
  }
  raw.timer = { ...blankTimer(), ...(isObj(raw.timer) ? raw.timer : {}) };
  delete raw.timer.setEi; delete raw.timer.setSi;
  {
    const T = raw.timer, b = blankTimer() as any;
    for (const k of ['restEndAt', 'setStartAt']) if (T[k] != null) T[k] = tsOf(T[k]);
    for (const k of ['restTotal', 'setTarget']) T[k] = intIn(T[k], 0, DURATION_MAX_SEC) ?? b[k]; /* runda 52: doba to i tak koniec */
    for (const k of ['restSetId', 'setId']) if (T[k] != null && typeof T[k] !== 'string') T[k] = null;
  } // runda 49
  raw.relations = arr(raw.relations); raw.feedback = arr(raw.feedback); raw.instructions = arr(raw.instructions);
  // Ustawienia: pole po polu na domyślnych, żeby częściowy obiekt nie dał undefined (np. przerwa → „NaNs”).
  const d = defaultSettings(); const s = isObj(raw.settings) ? raw.settings : {};
  /* Audyt 0.10 J1 (DAT-05): ustawienia, których ta wersja nie zna (zapisała je nowsza), zostają — powrót do nowszej wersji ich nie gubi;
   * bez kluczy, które mogłyby zatruć prototyp. Znane pola niżej — jak dotąd, pole po polu. */
  const legacy = (Number(raw.schemaVersion) || 0) < 13 ? LEGACY_SETTINGS_13 : new Set<string>(); /* pola usunięte w 13 (Q-001) — nie wracają z dawnych danych */
  const unknownSettings = Object.fromEntries(Object.keys(s).filter(
      k => !SETTINGS_KEYS.has(k) && !PROTO_KEYS.has(k) && !legacy.has(k) && !MOVED_SETTINGS.has(k)).map(k => [k, s[k]]));
  raw.settings = { ...unknownSettings,
    defaultRest: (v => v != null && v >= 0 ? Math.min(REST_MAX, Math.round(v)) : d.defaultRest)(parseNum(s.defaultRest)), // runda 17: ten sam limit co wszędzie
    sound: typeof s.sound === 'boolean' ? s.sound : d.sound,
    wakeLock: typeof s.wakeLock === 'boolean' ? s.wakeLock : d.wakeLock,
    showRpe: typeof s.showRpe === 'boolean' ? s.showRpe : d.showRpe,
    /* przypomnienie z planu (08.10.2026): tylko wyłączenie zapisane */
    /* pakiet C: tylko wybór RIR zapisany — dane sprzed zmiany przechodzą 1:1 (swap-schema16) */
    ...(s.effortScale === 'rir' ? { effortScale: 'rir' as const } : {}),
        ...(s.libShowAll === true ? { libShowAll: true as const } : {}), /* research biblioteki (09.10.2026): tylko zdjęty filtr zapisany */
        ...(s.planReminder === false ? { planReminder: false as const } : {}),
        ...((g => g ? { weeklySetGoals: g } : {})(normalizeGoals(s.weeklySetGoals))), /* 12.10.2026: ręczny cel serii na partię — tylko znane części, liczby w granicach */
    healthSync: typeof s.healthSync === 'boolean' ? s.healthSync : d.healthSync,
    ...((r => r ? { reviewAsked: r } : {})(normalizeReviewAsked(s.reviewAsked))), /* 0.17.0 (docs/26): tylko poprawna para {at, version}; przyszła data (zegar cofnięty, uszkodzone dane) = brak pola */
    ...((n => n != null ? { ideaShownAt: n } : {})(normalizeIdeaShownAt(s.ideaShownAt))), /* 0.20 (docs/34): tylko nieujemna liczba całkowita */
    /* 19.10.2026 „Zapowiedzi głosowe”; dane 0.20 bez pola `voice`: voiceSpeaker true → „Także przez głośnik”, inaczej brak pola.
     * 20.10.2026 (DEC-05): poprawna wartość (off, headphones, speaker) zostaje jawnie; BRAK pola nadal znaczy „W słuchawkach” (lib/voice.ts VOICE_DEFAULT) — użytkownik,
     * który ustawienia nie ruszał, nie traci zachowania; „Wyłączone” dla nowej instalacji zapisuje seed. Zła wartość = brak pola. Dawne `voiceSpeaker` znika — idempotentne. */
    ...((v => v === 'off' || v === 'speaker' || v === 'headphones' ? { voice: v } : {})(s.voice !== undefined ? s.voice : s.voiceSpeaker === true ? 'speaker' : undefined)),
    ...(s.healthRead === true ? { healthRead: true as const } : {}), /* 0.16.0 (P2 A): tylko włączenie zapisane; zła wartość = wyłączony */
    /* runda 75 */
    progressHint: typeof s.progressHint === 'boolean' ? s.progressHint : d.progressHint,
        autoBackup: typeof s.autoBackup === 'boolean' ? s.autoBackup : d.autoBackup,
        weighReminder: typeof s.weighReminder === 'boolean' ? s.weighReminder : d.weighReminder,
    modules: (() => {
      const mods = { ...defaultModules(), ...(isObj(s.modules) ? s.modules : {}) };
      MODULES.forEach(m => {
        if (typeof mods[m] !== 'boolean') mods[m] = false;
      });
      mods.training = true;
      return mods;
    })(),
    language: s.language === 'auto' || isLang(s.language) ? s.language : d.language,
    unit: s.unit === 'lb' ? 'lb' : 'kg',
    /* decyzja 05.10.2026: domyślnie jasny, także dla starszych danych (potwierdzone 07.10.2026) */
    theme: s.theme === 'dark' || s.theme === 'auto' ? s.theme : 'light',
    workoutView: s.workoutView === 'list' ? 'list' : 'focus', /* 07.10.2026: widok skupiony domyślnie, także dla starszych danych (bez zmiany schematu) */
    ...fixLocations(s, stamp, raw.settings?.language), /* P-003 (schemat 14): bez tego biała lista gubiła miejsca przy każdym starcie i imporcie */
  };
  /* Fala 2 audytu 0.10 (masa ciała z datą): pomiary — dzień RRRR-MM-DD (istniejący), kg > 0 i ≤ BODY_MASS_MAX na siatce 0,01; jeden na dzień (późniejszy wpis
   * wygrywa), rosnąco, najwyżej BODY_MASS_LOG_MAX najnowszych; pusta lista znika. Dawne Settings.bodyMass (E1, bez daty) → pierwszy wpis z dniem najstarszego
   * treningu (dziś, gdy historii nie ma) — e1RM dawnych sesji bez zmian; tylko gdy pomiarów jeszcze nie ma. Idempotentne: pole w ustawieniach znika. */
  { const okKg = (v: unknown) => { const n = parseNum(v); return n != null && kg2(n) > 0 && n <= BODY_MASS_MAX ? kg2(n) : null; };
    const byDay = new Map<string, number>();
    for (const x of arr(raw.bodyMassLog)) {
      const kg = okKg(x.kg);
      if (kg != null && typeof x.date === 'string' && realDay(x.date)) byDay.set(x.date, kg);
    }
    const legacyKg = okKg(s.bodyMass);
    if (!byDay.size && legacyKg != null) {
      const first = raw.workouts.reduce((a: any, w: any) => (!a || w.startedAt < a.startedAt ? w : a), null);
      byDay.set(first ? workoutDay(first) : localISODate(), legacyKg);
    }
    const log = [...byDay].sort((a, b) => (a[0] < b[0] ? -1 : a[0] > b[0] ? 1 : 0)).slice(-BODY_MASS_LOG_MAX).map(([date, kg]) => ({ date, kg }));
    if (log.length) raw.bodyMassLog = log; else delete raw.bodyMassLog; }
  if (raw.equipFill !== GYM_FILL.rev) {
    for (const l of raw.settings.locations) fillGym(l, raw.settings.unit);
    raw.equipFill = GYM_FILL.rev;
  } /* decyzja 05.10.2026 (1.a): raz */
  if (raw.equipFill2 !== EQUIP_FILL2.rev) {
    for (const l of raw.settings.locations) fillEquip2(l, raw.settings.unit);
    raw.equipFill2 = EQUIP_FILL2.rev;
  } /* research biblioteki (L5 Q7, 09.10.2026): ściana, maszyna do dipów — raz */
  /* pakiet C: tygodnie deload — daty poniedziałków, bez powtórzeń, posortowane, najwyżej 10 lat; pusta lista znika (dane sprzed zmiany 1:1); nie
   * `arr` — ta przepuszcza tylko obiekty */
  {
    const u = [...new Set((Array.isArray(raw.deloadWeeks) ? raw.deloadWeeks : []).filter(
        (x: unknown) => typeof x === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(x)
        && new Date(+x.slice(0, 4), +x.slice(5, 7) - 1, +x.slice(8, 10)).getDay() === 1))].sort().slice(-DELOAD_WEEKS_MAX) as string[];
    if (u.length) raw.deloadWeeks = u; else delete raw.deloadWeeks;
  }
  /* kalendarz (08.10.2026): plan tygodnia — 7 pozycji (id tekstem albo null), pusty znika; zmiany dni — klucze-daty, wartości id albo null */
  { const days = planDays(isObj(raw.weekPlan) ? raw.weekPlan.days : null);
    /* audyt 0.10 B4 (DAT-06): idempotentnie, bez rozcinania emoji */
    const nm = isObj(raw.weekPlan) && typeof raw.weekPlan.name === 'string' ? cleanPlanName(raw.weekPlan.name) : '';
    if (days.some(Boolean) || nm) raw.weekPlan = { days, ...(nm ? { name: nm } : {}) }; else delete raw.weekPlan;
    /* 08.10.2026 (docs/24): zapisane plany — id tekstem bez powtórzeń, nazwa ≤ 40, 7 dni; pusta lista znika; najwyżej SAVED_PLANS_MAX (ten sam limit
     * w UI — audyt 0.10 B3) */
    {
      const sp0 = (Array.isArray(raw.savedPlans) ? raw.savedPlans : []).filter((p: any) => isObj(p) && typeof p.id === 'string' && p.id);
      freshIds(sp0); /* DAT2-04: powtórzone id → „~n” */
      const sp = sp0.map((p: any) => {
        const ov = cleanOverrides(p.overrides); const pl = cleanPlanPlaces(p.places);
        return { id: p.id, name: typeof p.name === 'string' ? cleanPlanName(p.name) : '', days: planDays(p.days),
            ...(Object.keys(ov).length ? { overrides: ov } : {}), ...(Object.keys(pl).length ? { places: pl } : {}) };
      }); /* audyt 0.10 B1: zmiany dni zapisane z planem; schemat 19: miejsca dni (id istniejących miejsc sprawdzane niżej, po wczytaniu miejsc) */
      if (sp.length) raw.savedPlans = sp.slice(0, SAVED_PLANS_MAX); else delete raw.savedPlans; }
    const ov = cleanOverrides(raw.planOverrides);
    if (Object.keys(ov).length) raw.planOverrides = ov; else delete raw.planOverrides;
    /* 11.10.2026 (docs/18 pkt 4): trening zrobiony wcześniej — tylko dla istniejących zakończonych treningów; idempotentne */
    { const wids = new Set((Array.isArray(raw.workouts) ? raw.workouts : []).filter((w: any) => isObj(w) && typeof w.id === 'string').map((w: any) => w.id));
      const de = Object.fromEntries(Object.entries(cleanDoneEarly(raw.doneEarly)).filter(([, v]) => wids.has(v)));
      if (Object.keys(de).length) raw.doneEarly = de; else delete raw.doneEarly; }
    /* Schemat 18 (audyt 0.10 A1, decyzja właściciela 08.10.2026 — wariant B): historia planu. Dane bez historii (≤ 17): plan tygodnia obowiązuje
     * od dnia migracji — nie wiemy, od kiedy był ustawiony, więc żaden wcześniejszy dzień nie staje się „opuszczony”. Ostatni odcinek = weekPlan:
     * gdy się różnią (plan zmieniony w starszej wersji, która historii nie zna), dochodzi odcinek od dziś. Po zgodzie — bez zmian (idempotentne). */
    { const today = localISODate(); let h = normPlanHistory(raw.planHistory); const last = h[h.length - 1];
      if (last ? !sameDays(last.days, days) : days.some(Boolean)) h = appendPlanSegment(h, today, days);
      if (h.length) raw.planHistory = h; else delete raw.planHistory; }
    /* audyt 0.10 D4: „Nie teraz” przy podpowiedzi deload — data poniedziałku albo brak */
    if (typeof raw.deloadSnooze !== 'string' || !DATE_KEY.test(raw.deloadSnooze)) delete raw.deloadSnooze; }
  /* Schemat 19 (0.19, docs/33 B): miejsca dni planu — klucze-daty, id istniejących miejsc (usunięte odpadają), także w zapisanych planach; potem miejsca
   * jednorazowe bez odwołań znikają (trening w toku, historia, plan). Idempotentne; dane sprzed 19 bez pól — bez zmian. */
  { const known = new Set<string>(raw.settings.locations.map((l: Location) => l.id));
    const pp = cleanPlanPlaces(raw.planPlaces, known); if (Object.keys(pp).length) raw.planPlaces = pp; else delete raw.planPlaces;
    if (Array.isArray(raw.savedPlans)) for (const p of raw.savedPlans) { const pl = cleanPlanPlaces(p.places, known); if (Object.keys(pl).length) p.places = pl; else delete p.places; }
    const gone = unusedOneOffIds(raw); if (gone.size) raw.settings.locations = raw.settings.locations.filter((l: Location) => !gone.has(l.id)); }
  {
    const g = [...new Set((Array.isArray(raw.guideSeen) ? raw.guideSeen : []).filter((x: unknown) => typeof x === 'string' && x && x.length <= 40))].slice(0,
        50);
    if (g.length) raw.guideSeen = g; else delete raw.guideSeen;
  } /* przewodnik (08.10.2026) */
  if (typeof raw.whatsNewSeen !== 'string' || !raw.whatsNewSeen || raw.whatsNewSeen.length > 40) delete raw.whatsNewSeen; /* „Co nowego” (08.10.2026) */
  if (raw.planHintHidden !== true) delete raw.planHintHidden; /* audyt 0.10 UX-16 A: tylko true (pole opcjonalne schematu 18) */
  if (raw.optFill !== OPT_FILL.rev) {
    for (const l of raw.settings.locations) fillOpts(l);
    raw.optFill = OPT_FILL.rev;
  } /* bieżnia: nachylenie (05.10.2026), raz */
  raw.ownerId = owner;
  if (!Number.isFinite(raw.v)) raw.v = 2; if (raw.metaUpdatedAt != null && tsOf(raw.metaUpdatedAt) == null) delete raw.metaUpdatedAt; /* runda 53 */
  /* audyt 0.10 J1: numer schematu nigdy w dół (dane z nowszej wersji zatrzymuje init i import) */
  raw.schemaVersion = Math.max(SCHEMA_VERSION, Number(raw.schemaVersion) || 0);
  return raw as State;
}
