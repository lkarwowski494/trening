import { getState, save, exById, workCount, tplRows } from '@/lib/store';
import { addPlan, deletePlan, planName as activePlanName, savedPlans, dayKeyOf } from '@/lib/plan';
import { availability, capsOf, capLabel, equipById, implAt, LOCATION_PRESET_LABEL } from '@/lib/equipment';
import { base, uid, LIB_BASE_NAMES, type Exercise, type Location, type Template, type TemplateItem, isLibBase } from '@/lib/seed';
import { WEEKLY_SETS_MARK } from '@/lib/stats';
import { t, tIn, lbl, locale, LANGS } from '@/lib/i18n';
import { fmtNum } from '@/lib/units';
import { loadCapWarning } from './loadcap';

/*
 * Generator szablonów i planu tygodnia (decyzje właściciela 08.10.2026, wariant A pełny; docs/24). Działa tylko na wyraźne polecenie, wynik do
 * przejrzenia przed zapisem (wyjątek od zasady z 03.10 — CLAUDE.md). Reguły z docs/research/22 sekcja 3 ze statusami:
 * - R1 każda główna partia ≥ 2 dni/tydz. (WHO 2020; ACSM 2026 — siła ≥ 2 sesje/tydz.) — sprawdzane (dni na partię, pomocnicza = 0,5 — jedno
 *   źródło) i pokazywane jako ostrzeżenie; podział 2 FBW / 3 FBW A/B/A / 4 góra-dół ×2 / 5 + FBW / 6 góra-dół ×3 = konwencja;
 * - R2 masa: ≥ 10 serii na partię tygodniowo (WEEKLY_SETS_MARK, dolny próg potwierdzony) — braki pokazywane, nie ukrywane;
 * - R3 siła: bój główny na początku, ≥ 80% 1RM ≈ 4–6 powt. — tylko z obciążeniem zewnętrznym (audyt 0.10 MER-01); 3 serie (ACSM: co najmniej 2);
 *   dodatkowe 6–10 = konwencja; bez obciążenia zewnętrznego plan jak „masa w domu” z ostrzeżeniem;
 * - R4 masa: 6–15 powt. na siłowni (tu 8–12), w domu lżej i bliżej upadku (tu 12–20) — zakres potwierdzony, liczby = uproszczenie;
 * - R5 wysiłek zwykle 0–3 RIR (ACSM 2026: blisko upadku albo 2–3; dokładnego RIR nie ustalono);
 * - R6 przerwy „zwykle”: siła 2–3 min, masa 1,5–2 min — uproszczenie (przeglądy niejednoznaczne); R7 baza wielostawowa + jednostawowe;
 * - R8 cardio umiarkowane, osobne sesje; długość = czas sesji (konwencja).
 * Czas sesji → liczba serii: (minuty − rozgrzewka) × 60 / (praca serii + średnia przerwa) — **uproszczenie bez źródła**, nazwane w podglądzie.
 * Ćwiczenia: podstawowa biblioteka (LIB_BASE_NAMES) w jej kolejności, tylko dostępne w wybranym miejscu; wariant B bierze następne z kolei;
 * gdy w podstawowej nie ma nic dla danego wzorca (np. dom bez sprzętu), zapasem jest pierwsze wielostawowe z pełnej biblioteki.
 * Wszystkie liczby generatora są tu (stałe) — teksty ekranu dostają je jako parametry (audyt 0.10 LOG-11, TST-10).
 */
export type Goal = 'strength' | 'hypertrophy' | 'cut';
export type GenInput = { goal: Goal; locationId: string | null; sessions: number; minutes: number };
export const GEN_SESSIONS: Record<Goal, number[]> = { strength: [2, 3, 4, 5, 6], hypertrophy: [2, 3, 4, 5, 6], cut: [3, 4, 5, 6] };
export const GEN_MINUTES = [45, 60, 90];
export const WARMUP_MIN = 10;
export const SET_WORK_SEC = 40;
/** Średnia przerwa do budżetu serii (s): siła — bój główny 180 i dodatkowe 120; masa — wielostawowe 120 i izolacja 90. */
export const AVG_REST: Record<Goal, number> = { strength: 150, hypertrophy: 105, cut: 105 };
/** Serie na ćwiczenie — ACSM 2026: „healthy adults are advised to complete at least two sets per exercise” (ACSM_MIN_SETS; siła: 2–3); 3 = uproszczenie. */
export const SETS_PER_EX = 3;
export const ACSM_MIN_SETS = 2;
/** Sesje cardio przy redukcji (reszta sesji — siłowe; R8: osobne dni) — konwencja. */
export const CARDIO_SESSIONS = 1;
/** Najmniej ćwiczeń w sesji, gdy budżet serii jest mały — konwencja. */
export const MIN_EXERCISES = 3;
/** Zakresy powtórzeń [od, do]: ciężki bój główny (≈ ≥ HEAVY_PCT% 1RM), dodatkowe przy sile, masa na siłowni, masa w domu / bez obciążenia (R3, R4). */
export const REPS: Readonly<Record<'heavy' | 'strength' | 'gym' | 'home', readonly [number, number]>> = { heavy: [4, 6], strength: [6, 10], gym: [8, 12], home: [12, 20] };
/** Przerwy (s): bój główny przy sile, wielostawowe (i dodatkowe przy sile), jednostawowe i core (R6 — uproszczenie). */
export const REST = { heavy: 180, multi: 120, iso: 90 } as const;
/** ACSM 2026 tab. 6 (siła): „Intensity: ≥80% 1RM (dose-response)”. */
export const HEAVY_PCT = 80;
/** Wysiłek: zwykle RIR[0]–RIR[1] powtórzeń w zapasie; ACSM 2026: „near-failure” albo RIR_ACSM (2–3); „insufficient evidence to quantify exact RIR”. */
export const RIR: readonly [number, number] = [0, 3];
export const RIR_ACSM: readonly [number, number] = [2, 3];
/** Główna partia co najmniej MIN_DAYS dni w tygodniu: WHO 2020 („all major muscle groups on 2 or more days a week”); ACSM 2026 — siła ≥ 2 sesje/tydz. */
export const MIN_DAYS = 2;
/** Partia pomocnicza liczona jako SECONDARY_SHARE serii i dnia — Pelland 2026, metoda „fractional” (jedno źródło; jak kreska serii w Postępach). */
export const SECONDARY_SHARE = 0.5;
/** WHO 2020: „at least 150–300 min of moderate-intensity … or at least 75–150 min of vigorous-intensity aerobic physical activity”. */
export const WHO_MODERATE: readonly [number, number] = [150, 300];
export const WHO_VIGOROUS: readonly [number, number] = [75, 150];
/** Sprzęt podpowiadany przy brakującej partii — od najtańszego (drążek, gumy, hantle, kettle); liczy się, gdy po jego dodaniu jest ćwiczenie na tę partię. */
export const HELP_EQUIP = ['pullup_bar', 'bands', 'db_fixed', 'kettlebell'] as const;
/** Partie sprawdzane w podglądzie (braki do kreski serii, dni w tygodniu). */
export const MAJOR = ['klatka', 'plecy', 'barki', 'biceps', 'triceps', 'czworogłowe', 'dwugłowe', 'pośladki'];
export const setsBudget = (goal: Goal, minutes: number) => Math.floor(((minutes - WARMUP_MIN) * 60) / (SET_WORK_SEC + AVG_REST[goal]));

export type SessionKey = 'fbwA' | 'fbwB' | 'upA' | 'upB' | 'loA' | 'loB' | 'cardio';
/** Układ domyślny dni (pon = 0); generate() wybiera spośród wszystkich układów ten z najmniejszą liczbą par dzień po dniu (bestDays). */
const STRENGTH_DAYS: Record<number, number[]> = { 2: [0, 3], 3: [0, 2, 4], 4: [0, 1, 3, 4], 5: [0, 1, 3, 4, 5], 6: [0, 1, 2, 3, 4, 5] };
const STRENGTH_KEYS: Record<number, SessionKey[]> = { 2: ['fbwA', 'fbwB'], 3: ['fbwA', 'fbwB', 'fbwA'], 4: ['upA', 'loA', 'upB', 'loB'], 5: ['upA', 'loA', 'upB', 'loB', 'fbwA'], 6: ['upA', 'loA', 'upB', 'loB', 'upA', 'loA'] };
const CARDIO_DAY_PREF = [5, 6, 2, 3, 1, 4, 0];
export function splitFor(goal: Goal, n: number): { keys: SessionKey[]; days: number[] } {
  const strength = goal === 'cut' ? n - CARDIO_SESSIONS : n; const keys = [...STRENGTH_KEYS[strength]]; const days = [...STRENGTH_DAYS[strength]];
  if (goal === 'cut') for (let i = 0; i < CARDIO_SESSIONS; i++) { keys.push('cardio'); days.push(CARDIO_DAY_PREF.find(d => !days.includes(d))!); }
  return { keys, days };
}
const shares = (a: ReadonlySet<string>, b: ReadonlySet<string>) => [...a].some(m => b.has(m));
/**
 * Audyt 0.10 LOG-10 (docs/24 „Dni”: z dniem przerwy między sesjami z tymi samymi głównymi partiami, gdy się da): spośród wszystkich układów
 * n dni w tygodniu (kolejność sesji bez zmian) wybiera ten z najmniejszą liczbą par dzień po dniu ze wspólną partią główną; dalej — mniej dni
 * treningowych pod rząd, bez niedzieli, najmniej zmian względem układu domyślnego; przy pełnym remisie zostaje układ domyślny.
 */
export function bestDays(prims: ReadonlySet<string>[], def: number[]): number[] {
  const cost = (ds: number[]) => { let same = 0, near = 0; ds.forEach((d, i) => { const j = ds.indexOf((d + 1) % 7); if (j < 0) return; near++; if (shares(prims[i], prims[j])) same++; }); return [same, near, ds.includes(6) ? 1 : 0, ds.filter(d => !def.includes(d)).length]; };
  const less = (a: number[], b: number[]) => { for (let i = 0; i < a.length; i++) if (a[i] !== b[i]) return a[i] < b[i]; return false; };
  let best = def; let bc = cost(def);
  for (let mask = 0; mask < 1 << 7; mask++) { const ds = [0, 1, 2, 3, 4, 5, 6].filter(d => (mask >> d) & 1); if (ds.length !== prims.length) continue; const c = cost(ds); if (less(c, bc)) { best = ds; bc = c; } }
  return best;
}

type Slot = { m: (e: Exercise) => boolean; nth: 0 | 1 };
const P = (pattern: string, muscle?: string) => (e: Exercise) => e.pattern === pattern && (!muscle || e.muscles[0] === muscle);
const iso = (muscle: string) => P('isolation', muscle);
const core = (e: Exercise) => e.muscles[0] === 'core' && !!e.pattern?.startsWith('core');
const S = (m: (e: Exercise) => boolean, nth: 0 | 1 = 0): Slot => ({ m, nth });
/* research biblioteki (docs/research/24 pkt 2.3 i 5.3, wdrożenie 09.10.2026): martwy ciąg ma główne dwugłowe + pośladki (nie „plecy”) — slot martwego
 * ciągu = zawias z dwugłowymi na pierwszym miejscu i pośladkami wśród głównych; RDL = zawias z dwugłowymi bez pośladków głównych. Bez tej
 * poprawki pierwszym bojem FBW B / Dół B zostałby wyprost tułowia (jedyny zawias z „plecy” na początku), a slot RDL wybrałby martwy ciąg. */
const hingeDL = (e: Exercise) => P('hinge', 'dwugłowe')(e) && e.muscles.includes('pośladki');
const squat = P('squat'), hingeHam = (e: Exercise) => P('hinge', 'dwugłowe')(e) && !e.muscles.includes('pośladki'), hingeGlute = P('hinge', 'pośladki'), lunge = P('lunge_single_leg');
const hpush = P('h_push', 'klatka'), hpull = P('h_pull', 'plecy'), vpush = P('v_push', 'barki'), vpull = P('v_pull');
/** Kolejność = priorytet: przy krótszej sesji odpadają ostatnie (najpierw wielostawowe — R7). Pierwsze ćwiczenie = bój główny (siła, R3). */
const SESSIONS: Record<Exclude<SessionKey, 'cardio'>, Slot[]> = {
  fbwA: [S(squat), S(hpush), S(hpull), S(vpush), S(vpull), S(iso('klatka')), S(iso('barki')), S(iso('biceps')), S(iso('triceps')), S(iso('łydki')), S(core)],
  fbwB: [S(hingeDL), S(hpush, 1), S(vpull, 1), S(lunge), S(hpull, 1), S(vpush, 1), S(iso('dwugłowe')), S(iso('barki'), 1), S(iso('triceps'), 1), S(iso('biceps'), 1), S(core, 1)],
  upA: [S(hpush), S(hpull), S(vpush), S(vpull), S(iso('klatka')), S(iso('barki')), S(iso('triceps')), S(iso('biceps'))],
  upB: [S(hpush, 1), S(vpull, 1), S(hpull, 1), S(vpush, 1), S(iso('klatka'), 1), S(iso('barki'), 1), S(iso('biceps'), 1), S(iso('triceps'), 1)],
  loA: [S(squat), S(hingeHam), S(lunge), S(iso('czworogłowe')), S(iso('dwugłowe')), S(iso('łydki')), S(core)],
  loB: [S(hingeDL), S(squat, 1), S(hingeGlute), S(lunge, 1), S(iso('dwugłowe'), 1), S(iso('łydki'), 1), S(core, 1)],
};
const GYM_SOURCES = new Set(['barbell', 'cable', 'machine_stack', 'plate_loaded_machine', 'smith']);
/** Obciążenie zewnętrzne (audyt 0.10 MER-01): sztanga (też EZ, trap bar), hantle, kettlebell, maszyny, wyciągi (i stacje), suwnica Smitha. */
const LOADED = new Set(['barbell', 'ez_bar', 'trap_bar', 'dumbbell', 'kettlebell', 'cable', 'machine_stack', 'plate_loaded_machine', 'smith']);
/** Czy ćwiczenie ma w miejscu obciążenie zewnętrzne: źródło ciężaru z LOADED i przyrząd obecny w miejscu (bez miejsca = pełna siłownia).
 * Masa ciała i gumy — nie; wykroki z hantlami tylko zalecanymi w miejscu bez hantli — nie. */
export function hasExternalLoad(e: Exercise, loc: Location | null): boolean {
  if (!e.loadSource || !LOADED.has(e.loadSource)) return false;
  if (!loc) return true;
  if (!availability(e, loc).ok) return false;
  return e.loadSource === 'smith' || implAt(e, loc) !== undefined;
}

export type GenItem = { exerciseId: string; sets: number; repMin: number | null; repMax: number | null; restSec: number; targetSec?: number };
export type GenTemplate = { key: SessionKey; name: string; items: GenItem[] };
export type GenResult = {
  templates: GenTemplate[]; days: (number | null)[]; weeklySets: Record<string, number>; below10: string[]; backToBack: [number, number][]; cardioMin: number; budget: number; home: boolean;
  /** średnia przerwa użyta w budżecie serii (s) */ avgRest: number;
  /** brak jakiegokolwiek ćwiczenia z obciążeniem zewnętrznym w miejscu (MER-01) */ unloaded: boolean;
  /** dni w tygodniu na partię: główna 1, tylko pomocnicza SECONDARY_SHARE (MER-02) */ freq: Record<string, number>;
  /** MAJOR bez żadnej serii */ missing: string[]; /** MAJOR z seriami, ale < MIN_DAYS dni */ rare: string[];
  /** etykiety sprzętu, który dałby ćwiczenia na brakujące partie */ helps: string[];
};

export const sessionName = (k: SessionKey) => ({ fbwA: t('FBW A'), fbwB: t('FBW B'), upA: t('Góra A'), upB: t('Góra B'), loA: t('Dół A'), loB: t('Dół B'), cardio: t('Cardio') })[k];
export const goalLabel = (g: Goal) => ({ strength: t('Siła'), hypertrophy: t('Masa'), cut: t('Redukcja') })[g];
const locById = (id: string | null): Location | null => getState().settings.locations.find(l => l.id === id) ?? null;

/** Ćwiczenia biblioteki dostępne w miejscu (bez miejsca — wszystkie): najpierw podstawowa biblioteka, potem pełna jako zapas (np. przysiad bez sprzętu). */
function pool(locationId: string | null): { base: Exercise[]; full: Exercise[] } {
  const loc = getState().settings.locations.find(l => l.id === locationId) ?? null; const caps = capsOf(loc);
  const full = getState().exercises.filter(e => !e.archived && e.lib && (!loc || availability(e, loc, caps).ok));
  return { base: full.filter(isLibBase), full }; /* E2 (audyt 0.10, X-03): katalog bazowy po kluczu — zmiana nazwy nie zmienia wyboru */
}

const isLift = (e: Exercise) => e.metric === 'weight_reps' || e.metric === 'reps';
/** MER-02: sprzęt z HELP_EQUIP (zachłannie, w tej kolejności), po którego dodaniu w miejscu jest ćwiczenie podstawowej biblioteki z brakującą partią jako główną. */
function helpFor(missing: string[], loc: Location | null): string[] {
  if (!loc || !missing.length) return [];
  const caps = capsOf(loc); const cands = pool(null).base.filter(isLift); const left = new Set(missing); const out: string[] = [];
  for (const id of HELP_EQUIP) {
    const x = equipById(id); if (!x || loc.equipment.some(e => e.item === id && !e.off)) continue;
    const c2 = new Set([...caps, ...x.gives]); const hit = [...left].filter(m => cands.some(e => (e.muscles as string[]).includes(m) && availability(e, loc, c2).ok));
    if (!hit.length) continue; hit.forEach(m => left.delete(m)); const l = capLabel(x.gives[0]); if (!out.includes(l)) out.push(l);
    if (!left.size) break;
  }
  return out;
}

type LoadItem = { exerciseId: string; sets: number };
type MuscleEx = Pick<Exercise, 'muscles' | 'secondaryMuscles'>;
/**
 * Obciążenie tygodnia z dni (pon = 0; null — wolne): serie na partię (pomocnicza = SECONDARY_SHARE), dni na partię (R1: główna 1, tylko pomocnicza
 * SECONDARY_SHARE), partie MAJOR bez serii, rzadziej niż MIN_DAYS, poniżej WEEKLY_SETS_MARK (R2) i pary dzień po dniu ze wspólną partią główną
 * (docs/research/23, reguła 1–2: ostrzeżenie, nie blokada). Jedna funkcja dla generatora i planu z własnych szablonów (09.10.2026).
 */
export function weekLoad(dayItems: (readonly LoadItem[] | null)[], exOf: (id: string) => MuscleEx | undefined) {
  const weeklySets: Record<string, number> = {}; const freq: Record<string, number> = {};
  const prim = (its: readonly LoadItem[] | null) => new Set((its ?? []).flatMap(it => exOf(it.exerciseId)?.muscles ?? []));
  dayItems.forEach(its => {
    if (!its) return;
    its.forEach(it => { const e = exOf(it.exerciseId); if (!e) return; e.muscles.forEach(m => { weeklySets[m] = (weeklySets[m] ?? 0) + it.sets; }); e.secondaryMuscles.forEach(m => { weeklySets[m] = (weeklySets[m] ?? 0) + it.sets * SECONDARY_SHARE; }); });
    const pri = prim(its); const sec = new Set(its.flatMap(it => exOf(it.exerciseId)?.secondaryMuscles ?? []));
    new Set([...pri, ...sec]).forEach(m => { freq[m] = (freq[m] ?? 0) + (pri.has(m) ? 1 : SECONDARY_SHARE); });
  });
  const below10 = MAJOR.filter(m => (weeklySets[m] ?? 0) < WEEKLY_SETS_MARK);
  const missing = MAJOR.filter(m => !((weeklySets[m] ?? 0) > 0)); const rare = MAJOR.filter(m => (weeklySets[m] ?? 0) > 0 && (freq[m] ?? 0) < MIN_DAYS);
  const backToBack: [number, number][] = [];
  for (let d = 0; d < 7; d++) { const n = (d + 1) % 7; if (shares(prim(dayItems[d] ?? null), prim(dayItems[n] ?? null))) backToBack.push([d, n]); }
  return { weeklySets, freq, below10, missing, rare, backToBack };
}

export function generate(inp: GenInput): GenResult {
  const pl = pool(inp.locationId); const all = pl.base; const lifts = all.filter(isLift); const spare = pl.full.filter(isLift);
  const loc = locById(inp.locationId); const loaded = (e: Exercise) => hasExternalLoad(e, loc);
  const home = !pl.full.some(e => e.loadSource && GYM_SOURCES.has(e.loadSource) && loaded(e)); const unloaded = !spare.some(loaded);
  /* MER-01: siła bez obciążenia zewnętrznego = plan jak masa w domu (te same przerwy, więc i budżet serii) */
  const restGoal: Goal = inp.goal === 'strength' && unloaded ? 'hypertrophy' : inp.goal; const budget = setsBudget(restGoal, inp.minutes);
  const { keys, days: defDays } = splitFor(inp.goal, inp.sessions); const order = [...new Set(keys)];
  const scheme = (e: Exercise, first: boolean): Omit<GenItem, 'exerciseId'> => {
    const rest = e.pattern === 'isolation' || core(e) ? REST.iso : REST.multi;
    if (restGoal === 'strength') return first && loaded(e) ? { sets: SETS_PER_EX, repMin: REPS.heavy[0], repMax: REPS.heavy[1], restSec: REST.heavy } : { sets: SETS_PER_EX, repMin: REPS.strength[0], repMax: REPS.strength[1], restSec: rest };
    const r = home ? REPS.home : REPS.gym; return { sets: SETS_PER_EX, repMin: r[0], repMax: r[1], restSec: rest };
  };
  const build = (k: SessionKey): GenItem[] => {
    if (k === 'cardio') { const c = [...all, ...pl.full].find(e => e.pattern === 'cardio' && e.loadSource === 'none' && (e.metric === 'distance_time' || e.metric === 'time')); return c ? [{ exerciseId: c.id, sets: 1, repMin: null, repMax: null, restSec: 0, targetSec: inp.minutes * 60 }] : []; }
    const used = new Set<string>(); const out: GenItem[] = []; const max = Math.max(MIN_EXERCISES, Math.floor(budget / SETS_PER_EX));
    for (const sl of SESSIONS[k]) {
      if (out.length >= max) break;
      /* zapas z pełnej biblioteki: tylko pierwszy kandydat i tylko wielostawowe (jednostawowe spoza podstawowej bywają nietypowe — np. z partnerem) */
      let cands = lifts.filter(sl.m).filter(e => !used.has(e.id)); let nth: number = sl.nth;
      if (!cands.length) { cands = spare.filter(sl.m).filter(e => e.pattern !== 'isolation' && !used.has(e.id)); nth = 0; }
      const e = cands[Math.min(nth, cands.length - 1)]; if (!e) continue; used.add(e.id);
      out.push({ exerciseId: e.id, ...scheme(e, out.length === 0) });
    }
    return out;
  };
  const templates: GenTemplate[] = order.map(k => ({ key: k, name: sessionName(k), items: build(k) }));
  const exOf = (id: string) => pl.full.find(e => e.id === id)!;
  const lifted = (ti: number) => templates[ti].items.filter(it => !it.targetSec);
  const primOf = (ti: number | null) => new Set(ti == null ? [] : lifted(ti).flatMap(it => exOf(it.exerciseId).muscles));
  /* LOG-10: dni siłowe z najmniejszą liczbą par dzień po dniu; cardio (redukcja) — pierwszy wolny dzień z CARDIO_DAY_PREF */
  const sKeys = keys.filter(k => k !== 'cardio'); const sDays = bestDays(sKeys.map(k => primOf(order.indexOf(k))), defDays.slice(0, sKeys.length));
  const dayIdx = [...sDays]; keys.slice(sKeys.length).forEach(() => dayIdx.push(CARDIO_DAY_PREF.find(d => !dayIdx.includes(d))!));
  const days: (number | null)[] = Array(7).fill(null); keys.forEach((k, i) => { days[dayIdx[i]] = order.indexOf(k); });
  const { weeklySets, freq, below10: low, missing, rare, backToBack } = weekLoad(days.map(ti => (ti == null ? null : lifted(ti))), exOf);
  const below10 = inp.goal === 'strength' ? [] : low;
  const cardioMin = templates.filter(x => x.key === 'cardio').reduce((s, x) => s + x.items.reduce((a, it) => a + (it.targetSec ?? 0) / 60, 0) * days.filter(ti => ti === templates.indexOf(x)).length, 0);
  return { templates, days, weeklySets, below10, backToBack, cardioMin, budget, home, avgRest: AVG_REST[restGoal], unloaded, freq, missing, rare, helps: helpFor(missing, loc) };
}

const wd = (i: number) => new Date(2024, 0, 1 + i).toLocaleDateString(locale(), { weekday: 'short' }); /* 1.01.2024 = poniedziałek */
const list = (ms: string[]) => ms.map(m => t(m)).join(', ');
export type GenWarning = { kind: 'unloaded' | 'missing' | 'rare' | 'below' | 'pairs' | 'loadcap'; text: string };
/** Ostrzeżenia podglądu (audyt 0.10 MER-01, MER-02, LOG-03): siła bez obciążenia, partie bez ćwiczeń (z podpowiedzią sprzętu), partie rzadziej niż
 * MIN_DAYS dni, braki do kreski serii (masa, redukcja), pary dzień po dniu. Każda partia z `missing` i `rare` jest w którymś z tekstów. */
export function previewWarnings(r: GenResult, inp: GenInput): GenWarning[] {
  const out: GenWarning[] = [];
  if (inp.goal === 'strength' && r.unloaded) out.push({ kind: 'unloaded', text: t('Siła bez obciążenia zewnętrznego (sztanga, hantle, kettlebell, maszyny, wyciągi): ciężkich serii (ok. {p}% maksimum) tu nie zrobisz, więc plan jest jak na masę w domu — {s} × {a}–{b} powtórzeń blisko upadku. Siła też wtedy rośnie, ale zwykle mniej niż przy dużym ciężarze.', { p: HEAVY_PCT, s: SETS_PER_EX, a: REPS.home[0], b: REPS.home[1] }) });
  const cap = loadCapWarning(r, inp); if (cap) out.push(cap); /* MER2-02 / A11-2 (audyt 0.11): najcięższy ciężar w miejscu przy celu „Siła” */
  return [...out, ...loadWarnings(r, false)];
}
/** Ostrzeżenia obciążenia tygodnia (wspólne dla generatora i planu z własnych szablonów): braki partii, rzadziej niż MIN_DAYS, poniżej
 * WEEKLY_SETS_MARK, pary dzień po dniu. `own` — plan z własnych szablonów: próg serii opisany jako próg dla masy (bez celu i bez rad o czasie i sprzęcie). */
function loadWarnings(r: Pick<GenResult, 'missing' | 'helps' | 'rare' | 'freq' | 'below10' | 'backToBack'>, own: boolean): GenWarning[] {
  const out: GenWarning[] = []; const add = (kind: GenWarning['kind'], text: string) => out.push({ kind, text });
  if (r.missing.length) add('missing', [t('Brak ćwiczeń na: {list}.', { list: list(r.missing) }), r.helps.length ? t('Przyda się: {list}.', { list: r.helps.join(', ') }) : ''].filter(Boolean).join(' '));
  if (r.rare.length) add('rare', t('Rzadziej niż {n} dni w tygodniu: {list} (dzień tylko z pracą pomocniczą = {h}).', { n: MIN_DAYS, list: r.rare.map(m => `${t(m)} (${fmtNum(r.freq[m] ?? 0, 1)})`).join(', '), h: fmtNum(SECONDARY_SHARE, 1) }));
  const low = r.below10.filter(m => !r.missing.includes(m));
  if (low.length) add('below', own ? t('Poniżej {n} serii tygodniowo: {list}. To dolny próg zalecany przy budowie masy; serie dodasz w szablonach.', { n: WEEKLY_SETS_MARK, list: list(low) })
    : t('Poniżej {n} serii tygodniowo: {list}. Pomoże więcej sesji, dłuższy czas albo więcej sprzętu w miejscu.', { n: WEEKLY_SETS_MARK, list: list(low) }));
  if (r.backToBack.length) add('pairs', t('Dzień po dniu te same główne partie: {list}. Zwykle lepiej z dniem przerwy; przy tej samej liczbie serii w tygodniu to też jest w porządku.', { list: r.backToBack.map(([a, b]) => `${wd(a)}–${wd(b)}`).join(', ') }));
  return out;
}

/** Najdłuższa nazwa planu, jaką zapisuje lib/plan.ts (cleanName obcina dłuższe) — test pilnuje zgodności (tests/audit-0.10-gen.test.ts). */
export const PLAN_NAME_MAX = 40;
/** Nazwa planu z generatora (UX-10): cel, sesje i miejsce (bez miejsca — „Pełna siłownia”); w języku z chwili zapisu (potem to dane użytkownika).
 * Za długa nazwa skraca miejsce z „…” zamiast ucinać całość w środku słowa. */
export function genPlanName(inp: GenInput): string {
  const name = (place: string) => t('{goal}, {n}× w tygodniu · {place}', { goal: goalLabel(inp.goal), n: inp.sessions, place });
  const place = Array.from(locById(inp.locationId)?.name ?? lbl(LOCATION_PRESET_LABEL.gym)); let out = name(place.join(''));
  for (let k = place.length - 1; out.length > PLAN_NAME_MAX && k > 0; k--) out = name(place.slice(0, k).join('').trimEnd() + '…');
  return out;
}
/** Jedna linijka wysiłku (RIR) w notatce każdego szablonu siłowego (UX-10: opis wysiłku nie ginie po zapisie). */
export const genNote = () => t('Wysiłek: zwykle {a}–{b} powtórzenia w zapasie (RIR); do upadku nie trzeba.', { a: RIR[0], b: RIR[1] });
/** Folder szablonów z generatora w bieżącym języku; rozpoznawany w każdym języku aplikacji (nazwa zostaje w języku z chwili zapisu). */
export const genFolder = () => t('Wygenerowane');
const genFolders = () => new Set<string>(LANGS.map(l => tIn(l, 'Wygenerowane')));

/**
 * UX-10: poprzednio wygenerowane, nieużywane szablony (folder „Wygenerowane” w dowolnym języku) — bez treningu w historii ani w toku, poza aktywnym
 * planem, zmianami dni i każdym innym miejscem stanu, które je wskazuje (szukane po id w całym stanie poza szablonami, ćwiczeniami i treningami —
 * także w przyszłych polach planu). Zapisany plan, którego wszystkie dni to takie szablony (plan z poprzedniego generowania), też jest do zastąpienia;
 * szablon trzymany przez inny zapisany plan — nie.
 * UX2-08 (audyt kontrolny 1): aktywny plan zrobiony wyłącznie z takich szablonów (zwykle: wygeneruj → „Ustaw jako aktywny” → wygeneruj jeszcze raz)
 * też jest do zastąpienia (`activePlan`), o ile jeszcze nie obowiązywał w żadnym minionym dniu (w historii planu tylko odcinek od dziś) i nie ma
 * zmian dni od dziś — wtedy minione dni Kalendarza zostają bez zmian. Nowy plan zajmuje wtedy jego miejsce (saveGenerated).
 */
export function replaceable(): { templateIds: string[]; planIds: string[]; activePlan: boolean } {
  const st = getState(); const folders = genFolders(); const today = dayKeyOf(Date.now());
  const inW = new Set<string>(st.workouts.map(w => w.templateId ?? '').filter(Boolean)); if (st.active?.templateId) inW.add(st.active.templateId);
  const { templates: _t, workouts: _w, exercises: _e, active: _a, savedPlans: _s, weekPlan: _p, planHistory: hist, ...rest } = st; void _t; void _w; void _e; void _a; void _s; void _p;
  const other = JSON.stringify(rest); const past = JSON.stringify((hist ?? []).filter(x => x.from < today)); /* odcinek od dziś = aktywny plan (UX2-08) */
  const free = (id: string) => { const x = st.templates.find(y => y.id === id); return !!x && !!x.folder && folders.has(x.folder) && !inW.has(id) && !other.includes(id) && !past.includes(id); };
  const act = (st.weekPlan?.days ?? []).filter((d): d is string => !!d);
  const actFree = act.length > 0 && act.every(free) && !Object.keys(st.planOverrides ?? {}).some(k => k >= today);
  const calc = (withActive: boolean) => {
    const cand = new Set(st.templates.filter(x => free(x.id) && (withActive || !act.includes(x.id))).map(x => x.id));
    const planIds = (st.savedPlans ?? []).filter(p => p.days.some(Boolean) && p.days.every(d => !d || cand.has(d))).map(p => p.id);
    const held = new Set((st.savedPlans ?? []).filter(p => !planIds.includes(p.id)).flatMap(p => [...p.days, ...Object.values(p.overrides ?? {})]).filter(Boolean)); /* A11-1 (audyt 0.11): także zmiany dni zapisanych planów */
    return { templateIds: [...cand].filter(id => !held.has(id)), planIds, activePlan: withActive };
  };
  const all = actFree ? calc(true) : null; /* szablon aktywnego planu trzymany przez inny zapisany plan — aktywny plan zostaje (bez niego) */
  return all && act.every(id => all.templateIds.includes(id)) ? all : calc(false);
}

/** Zapis po zatwierdzeniu: szablony w folderze „Wygenerowane” (nazwy bez kolizji, z notatką wysiłku; puste pomijane — dzień wolny), plan obok innych;
 * `activate` — od razu obowiązuje; `replace` — najpierw usuwa poprzednio wygenerowane, nieużywane szablony i plany (replaceable); gdy wśród nich jest
 * aktywny plan (UX2-08), nowy plan zajmuje jego miejsce — jest aktywny, a zastąpiony nie trafia do „Inne plany” (odcinek historii od dziś nadpisany). */
export function saveGenerated(r: GenResult, inp: GenInput, activate: boolean, replace = false): { templateIds: string[]; planId: string; planName: string; folder: string } {
  const st = getState();
  if (replace) { const old = replaceable(); const ids = new Set(old.templateIds); st.templates = st.templates.filter(x => !ids.has(x.id)); old.planIds.forEach(deletePlan); if (old.activePlan) { delete st.weekPlan; activate = true; } }
  const names = new Set(st.templates.map(x => x.name));
  const uniq = (n: string) => { if (!names.has(n)) { names.add(n); return n; } for (let i = 2; ; i++) { const c = `${n} (${i})`; if (!names.has(c)) { names.add(c); return c; } } };
  const folder = genFolder(); const note = genNote();
  const kept = r.templates.map((g, i) => ({ g, i })).filter(x => x.g.items.length); const idOf = new Map<number, string>();
  const tpls: Template[] = kept.map(({ g, i }) => { const tpl: Template = { ...base(st.ownerId), name: uniq(g.name), folder, ...(inp.locationId ? { locationId: inp.locationId } : {}), ...(g.key === 'cardio' ? {} : { note }),
    items: g.items.map((it): TemplateItem => ({ id: uid(), exerciseId: it.exerciseId, sets: it.sets, repMin: it.repMin, repMax: it.repMax, restSec: it.restSec, startWeight: '', targetSec: it.targetSec ?? '', groupId: null })) }; idOf.set(i, tpl.id); return tpl; });
  st.templates.push(...tpls); st.userTouched = true; save();
  const planId = addPlan(genPlanName(inp), r.days.map(ti => (ti == null ? null : idOf.get(ti) ?? null)), activate);
  const planName = (activate ? activePlanName() : savedPlans().find(p => p.id === planId)?.name) ?? genPlanName(inp); /* nazwa tak, jak zapisał ją plan (np. unikalna) */
  return { templateIds: tpls.map(x => x.id), planId, planName, folder };
}

/* ---------- Plan z moich szablonów (decyzja właściciela 09.10.2026, wariant B — wyjątek od zamrożenia, docs/18 ok. 14:55) ----------
 * Użytkownik wybiera swoje szablony (niezarchiwizowane, z ćwiczeniami) i liczbę dni; aplikacja rozkłada je na tydzień według TYCH SAMYCH reguł co
 * generator — bez nowych liczb i reguł:
 * - liczba dni: GEN_SESSIONS (2–6, jak przy masie i sile) — konwencja generatora (docs/24 sekcja 3 „Podział”);
 * - powtarzanie szablonów, gdy dni jest więcej niż szablonów: po kolei A/B/A… — jak generator przy 3 FBW (A/B/A) i 6 góra/dół (A/B/C/D/A/B),
 *   kolejność sesji bez zmian, plan powtarza się co tydzień (konwencja, docs/24 „Podział”);
 * - dni tygodnia: bestDays — układ domyślny generatora dla n dni, a spośród wszystkich układów ten z najmniejszą liczbą par dzień po dniu ze wspólną
 *   partią główną (docs/research/23, „Reguły dla aplikacji” 1: „Domyślnie co najmniej 1 dzień przerwy (≈ 48 h) między sesjami z tymi samymi głównymi
 *   partiami” — uproszczenie; reguła 2: dwa dni pod rząd — „ostrzeżenie, nie blokada”);
 * - ostrzeżenia (weekLoad + loadWarnings): partia < MIN_DAYS dni (R1: WHO 2020 7a „all major muscle groups on 2 or more days a week”; ACSM 2026 7b
 *   „Frequency: ≥2 sessions/wk”), pomocnicza = SECONDARY_SHARE (Pelland 2026 7c, jedno źródło), < WEEKLY_SETS_MARK serii (R2: dolny próg 10 —
 *   ACSM, Schoenfeld 2017, Baz-Valle 2022 — docs/research/22 sekcja 3), brak ćwiczeń na partię, pary dzień po dniu;
 * - serie szablonu: serie robocze jak w treningu (store.workCount — bez rozgrzewek, drop z poprzednią); ćwiczenia cardio (pattern „cardio”) nie liczą
 *   się do partii — jak sesja cardio generatora.
 * Szablonów nie zmienia (zasada 03.10.2026): zapis tworzy tylko plan (addPlan), aktywacja przez activatePlan — zmiany pojedynczych dni od dziś idą
 * z poprzednim planem do „Inne plany”, okno pyta tekstem activationNote (audyt 0.10 B1).
 */
export const OWN_SESSIONS = GEN_SESSIONS.hypertrophy;
/** Najwięcej wybranych szablonów: każdy musi dostać co najmniej jeden dzień, więc tyle, ile najwięcej dni. */
export const OWN_MAX = Math.max(...OWN_SESSIONS);
export type OwnInput = { templateIds: string[]; sessions: number };
export type OwnResult = {
  /** szablon każdej sesji po kolei (rotacja) */ seq: string[]; /** pon…nd: id szablonu albo null */ days: (string | null)[]; sessions: number;
  weeklySets: Record<string, number>; freq: Record<string, number>; below10: string[]; missing: string[]; rare: string[]; backToBack: [number, number][];
};
/** Szablony do wyboru: niezarchiwizowane, z ćwiczeniami (kolejność jak na liście stanu). */
export const ownTemplates = (): Template[] => getState().templates.filter(x => !x.archived && x.items.length > 0);
/** Liczba dni do wyboru przy k szablonach: co najmniej k (każdy szablon użyty). */
export const ownSessionsFor = (k: number) => OWN_SESSIONS.filter(n => n >= k);
/** Rozkład wybranych szablonów na tydzień; null — nic do rozłożenia (brak szablonów albo więcej niż OWN_MAX). Liczba dni spoza listy → najbliższa
 * dozwolona nie mniejsza (co najmniej tyle, ile szablonów). */
export function ownPlan(inp: OwnInput): OwnResult | null {
  const ok = new Set(ownTemplates().map(x => x.id)); const ids = [...new Set(inp.templateIds)].filter(id => ok.has(id));
  if (!ids.length || ids.length > OWN_MAX) return null;
  const allowed = ownSessionsFor(ids.length); const n = allowed.find(x => x >= inp.sessions) ?? allowed[allowed.length - 1];
  const seq = Array.from({ length: n }, (_, i) => ids[i % ids.length]);
  const tpl = (id: string) => getState().templates.find(x => x.id === id)!;
  const items = (id: string) => tpl(id).items.filter(it => exById(it.exerciseId)?.pattern !== 'cardio').map(it => ({ exerciseId: it.exerciseId, sets: workCount(tplRows(it).map(r => r.kind)) }));
  const exOf = (id: string) => exById(id);
  const prims = seq.map(id => new Set(items(id).flatMap(it => exOf(it.exerciseId)?.muscles ?? [])));
  const dayIdx = bestDays(prims, STRENGTH_DAYS[n]);
  const days: (string | null)[] = Array(7).fill(null); seq.forEach((id, i) => { days[dayIdx[i]] = id; });
  return { seq, days, sessions: n, ...weekLoad(days.map(id => (id ? items(id) : null)), exOf) };
}
/** Ostrzeżenia podglądu planu z własnych szablonów — te same co w generatorze (bez podpowiedzi sprzętu: plan nie dobiera ćwiczeń). */
export const ownWarnings = (r: OwnResult): GenWarning[] => loadWarnings({ ...r, helps: [] }, true);
/** Ile razy w tygodniu każdy wybrany szablon (podgląd rotacji). */
export const ownCounts = (r: OwnResult): { id: string; n: number }[] => [...new Set(r.seq)].map(id => ({ id, n: r.seq.filter(x => x === id).length }));
/** Nazwa planu: „Moje szablony, 3× w tygodniu” (w języku z chwili zapisu; potem dane użytkownika; lib/plan skraca do PLAN_NAME_MAX). */
export const ownPlanName = (r: OwnResult) => t('Moje szablony, {n}× w tygodniu', { n: r.sessions });
/** Zapis po zatwierdzeniu: tylko plan (szablony bez zmian); `activate` — od razu obowiązuje (activatePlan). '' w planId — „Inne plany” pełne. */
export function saveOwnPlan(r: OwnResult, activate: boolean): { planId: string; planName: string } {
  const planId = addPlan(ownPlanName(r), r.days, activate);
  const planName = (activate ? activePlanName() : savedPlans().find(p => p.id === planId)?.name) ?? ownPlanName(r);
  return { planId, planName };
}
