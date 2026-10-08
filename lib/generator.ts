import { getState, save } from '@/lib/store';
import { addPlan } from '@/lib/plan';
import { availability, capsOf } from '@/lib/equipment';
import { base, uid, LIB_BASE_NAMES, type Exercise, type Template, type TemplateItem } from '@/lib/seed';
import { t } from '@/lib/i18n';

/*
 * Generator szablonów i planu tygodnia (decyzje właściciela 08.10.2026, wariant A pełny; docs/24). Działa tylko na wyraźne polecenie, wynik do
 * przejrzenia przed zapisem (wyjątek od zasady z 03.10 — CLAUDE.md). Reguły z docs/research/22 sekcja 3 ze statusami:
 * - R1 każda główna grupa ≥ 2×/tydz. (potwierdzone) — podział 2 FBW / 3 FBW A/B/A / 4 góra-dół ×2 / 5 + FBW / 6 góra-dół ×3 = konwencja;
 * - R2 masa: ≥ 10 serii na partię tygodniowo (dolny próg potwierdzony) — braki pokazywane, nie ukrywane;
 * - R3 siła: bój główny na początku, ≥ 80% 1RM ≈ 4–6 powt., 3 serie (2–3 serie — jedno źródło), dodatkowe 6–10 = konwencja;
 * - R4 masa: 6–15 powt. na siłowni (tu 8–12), w domu lżej i bliżej upadku (tu 12–20) — zakres potwierdzony, liczby = uproszczenie;
 * - R6 przerwy „zwykle”: siła 2–3 min, masa 90–120 s; R7 baza wielostawowa + jednostawowe; R8 cardio umiarkowane, osobne sesje.
 * Czas sesji → liczba serii: (minuty − rozgrzewka) × 60 / (praca serii + średnia przerwa) — **uproszczenie bez źródła**, nazwane w podglądzie.
 * Ćwiczenia: podstawowa biblioteka (LIB_BASE_NAMES) w jej kolejności, tylko dostępne w wybranym miejscu; wariant B bierze następne z kolei;
 * gdy w podstawowej nie ma nic dla danego wzorca (np. dom bez sprzętu), zapasem jest pierwsze wielostawowe z pełnej biblioteki.
 */
export type Goal = 'strength' | 'hypertrophy' | 'cut';
export type GenInput = { goal: Goal; locationId: string | null; sessions: number; minutes: number };
export const GEN_SESSIONS: Record<Goal, number[]> = { strength: [2, 3, 4, 5, 6], hypertrophy: [2, 3, 4, 5, 6], cut: [3, 4, 5, 6] };
export const GEN_MINUTES = [45, 60, 90];
export const WARMUP_MIN = 10;
export const SET_WORK_SEC = 40;
export const AVG_REST: Record<Goal, number> = { strength: 150, hypertrophy: 105, cut: 105 };
/** Partie, dla których masa/redukcja pokazuje braki do 10 serii tygodniowo (R2). */
export const MAJOR = ['klatka', 'plecy', 'barki', 'biceps', 'triceps', 'czworogłowe', 'dwugłowe', 'pośladki'];
export const setsBudget = (goal: Goal, minutes: number) => Math.floor(((minutes - WARMUP_MIN) * 60) / (SET_WORK_SEC + AVG_REST[goal]));

export type SessionKey = 'fbwA' | 'fbwB' | 'upA' | 'upB' | 'loA' | 'loB' | 'cardio';
const STRENGTH_DAYS: Record<number, number[]> = { 2: [0, 3], 3: [0, 2, 4], 4: [0, 1, 3, 4], 5: [0, 1, 3, 4, 5], 6: [0, 1, 2, 3, 4, 5] };
const STRENGTH_KEYS: Record<number, SessionKey[]> = { 2: ['fbwA', 'fbwB'], 3: ['fbwA', 'fbwB', 'fbwA'], 4: ['upA', 'loA', 'upB', 'loB'], 5: ['upA', 'loA', 'upB', 'loB', 'fbwA'], 6: ['upA', 'loA', 'upB', 'loB', 'upA', 'loA'] };
const CARDIO_DAY_PREF = [5, 6, 2, 3, 1, 4, 0];
export function splitFor(goal: Goal, n: number): { keys: SessionKey[]; days: number[] } {
  const strength = goal === 'cut' ? n - 1 : n; const keys = [...STRENGTH_KEYS[strength]]; const days = [...STRENGTH_DAYS[strength]];
  if (goal === 'cut') { keys.push('cardio'); days.push(CARDIO_DAY_PREF.find(d => !days.includes(d))!); }
  return { keys, days };
}

type Slot = { m: (e: Exercise) => boolean; nth: 0 | 1 };
const P = (pattern: string, muscle?: string) => (e: Exercise) => e.pattern === pattern && (!muscle || e.muscles[0] === muscle);
const iso = (muscle: string) => P('isolation', muscle);
const core = (e: Exercise) => e.muscles[0] === 'core' && !!e.pattern?.startsWith('core');
const S = (m: (e: Exercise) => boolean, nth: 0 | 1 = 0): Slot => ({ m, nth });
const squat = P('squat'), hingeBack = P('hinge', 'plecy'), hingeHam = P('hinge', 'dwugłowe'), hingeGlute = P('hinge', 'pośladki'), lunge = P('lunge_single_leg');
const hpush = P('h_push', 'klatka'), hpull = P('h_pull', 'plecy'), vpush = P('v_push', 'barki'), vpull = P('v_pull');
/** Kolejność = priorytet: przy krótszej sesji odpadają ostatnie (najpierw wielostawowe — R7). Pierwsze ćwiczenie = bój główny (siła, R3). */
const SESSIONS: Record<Exclude<SessionKey, 'cardio'>, Slot[]> = {
  fbwA: [S(squat), S(hpush), S(hpull), S(vpush), S(vpull), S(iso('klatka')), S(iso('barki')), S(iso('biceps')), S(iso('triceps')), S(iso('łydki')), S(core)],
  fbwB: [S(hingeBack), S(hpush, 1), S(vpull, 1), S(lunge), S(hpull, 1), S(vpush, 1), S(iso('dwugłowe')), S(iso('barki'), 1), S(iso('triceps'), 1), S(iso('biceps'), 1), S(core, 1)],
  upA: [S(hpush), S(hpull), S(vpush), S(vpull), S(iso('klatka')), S(iso('barki')), S(iso('triceps')), S(iso('biceps'))],
  upB: [S(hpush, 1), S(vpull, 1), S(hpull, 1), S(vpush, 1), S(iso('klatka'), 1), S(iso('barki'), 1), S(iso('biceps'), 1), S(iso('triceps'), 1)],
  loA: [S(squat), S(hingeHam), S(lunge), S(iso('czworogłowe')), S(iso('dwugłowe')), S(iso('łydki')), S(core)],
  loB: [S(hingeBack), S(squat, 1), S(hingeGlute), S(lunge, 1), S(iso('dwugłowe'), 1), S(iso('łydki'), 1), S(core, 1)],
};
const GYM_SOURCES = new Set(['barbell', 'cable', 'machine_stack', 'plate_loaded_machine', 'smith']);

export type GenItem = { exerciseId: string; sets: number; repMin: number | null; repMax: number | null; restSec: number; targetSec?: number };
export type GenTemplate = { key: SessionKey; name: string; items: GenItem[] };
export type GenResult = { templates: GenTemplate[]; days: (number | null)[]; weeklySets: Record<string, number>; below10: string[]; backToBack: [number, number][]; cardioMin: number; budget: number; home: boolean };

export const sessionName = (k: SessionKey) => ({ fbwA: t('FBW A'), fbwB: t('FBW B'), upA: t('Góra A'), upB: t('Góra B'), loA: t('Dół A'), loB: t('Dół B'), cardio: t('Cardio') })[k];
export const goalLabel = (g: Goal) => ({ strength: t('Siła'), hypertrophy: t('Masa'), cut: t('Redukcja') })[g];

/** Ćwiczenia biblioteki dostępne w miejscu (bez miejsca — wszystkie): najpierw podstawowa biblioteka, potem pełna jako zapas (np. przysiad bez sprzętu). */
function pool(locationId: string | null): { base: Exercise[]; full: Exercise[] } {
  const loc = getState().settings.locations.find(l => l.id === locationId) ?? null; const caps = capsOf(loc);
  const full = getState().exercises.filter(e => !e.archived && e.lib && (!loc || availability(e, loc, caps).ok));
  return { base: full.filter(e => LIB_BASE_NAMES.has(e.name)), full };
}

export function generate(inp: GenInput): GenResult {
  const pl = pool(inp.locationId); const all = pl.base; const lift = (e: Exercise) => e.metric === 'weight_reps' || e.metric === 'reps'; const lifts = all.filter(lift); const spare = pl.full.filter(lift);
  const home = !pl.full.some(e => e.loadSource && GYM_SOURCES.has(e.loadSource)); const budget = setsBudget(inp.goal, inp.minutes);
  const { keys, days: dayIdx } = splitFor(inp.goal, inp.sessions); const order = [...new Set(keys)];
  const build = (k: SessionKey): GenItem[] => {
    if (k === 'cardio') { const c = [...all, ...pl.full].find(e => e.pattern === 'cardio' && e.loadSource === 'none' && (e.metric === 'distance_time' || e.metric === 'time')); return c ? [{ exerciseId: c.id, sets: 1, repMin: null, repMax: null, restSec: 0, targetSec: inp.minutes * 60 }] : []; }
    const used = new Set<string>(); const out: GenItem[] = []; const max = Math.max(3, Math.floor(budget / 3));
    for (const sl of SESSIONS[k]) {
      if (out.length >= max) break;
      /* zapas z pełnej biblioteki: tylko pierwszy kandydat i tylko wielostawowe (jednostawowe spoza podstawowej bywają nietypowe — np. z partnerem) */
      let cands = lifts.filter(sl.m).filter(e => !used.has(e.id)); let nth: number = sl.nth;
      if (!cands.length) { cands = spare.filter(sl.m).filter(e => e.pattern !== 'isolation' && !used.has(e.id)); nth = 0; }
      const e = cands[Math.min(nth, cands.length - 1)]; if (!e) continue; used.add(e.id);
      const first = out.length === 0; const isIso = e.pattern === 'isolation' || core(e);
      const it: GenItem = inp.goal === 'strength'
        ? (first ? { exerciseId: e.id, sets: 3, repMin: 4, repMax: 6, restSec: 180 } : { exerciseId: e.id, sets: 3, repMin: 6, repMax: 10, restSec: 120 })
        : { exerciseId: e.id, sets: 3, repMin: home ? 12 : 8, repMax: home ? 20 : 12, restSec: isIso ? 90 : 120 };
      out.push(it);
    }
    return out;
  };
  const templates: GenTemplate[] = order.map(k => ({ key: k, name: sessionName(k), items: build(k) }));
  const days: (number | null)[] = Array(7).fill(null); keys.forEach((k, i) => { days[dayIdx[i]] = order.indexOf(k); });
  const exOf = (id: string) => pl.full.find(e => e.id === id)!;
  const weeklySets: Record<string, number> = {};
  days.forEach(ti => { if (ti == null) return; templates[ti].items.forEach(it => { if (it.targetSec) return; const e = exOf(it.exerciseId); e.muscles.forEach(m => { weeklySets[m] = (weeklySets[m] ?? 0) + it.sets; }); e.secondaryMuscles.forEach(m => { weeklySets[m] = (weeklySets[m] ?? 0) + it.sets * 0.5; }); }); });
  const below10 = inp.goal === 'strength' ? [] : MAJOR.filter(m => (weeklySets[m] ?? 0) < 10);
  const prim = (ti: number | null) => new Set(ti == null ? [] : templates[ti].items.filter(it => !it.targetSec).flatMap(it => exOf(it.exerciseId).muscles));
  const backToBack: [number, number][] = [];
  for (let d = 0; d < 7; d++) { const n = (d + 1) % 7; const a = prim(days[d]), b = prim(days[n]); if ([...a].some(m => b.has(m))) backToBack.push([d, n]); }
  const cardioMin = templates.filter(x => x.key === 'cardio').reduce((s, x) => s + x.items.reduce((a, it) => a + (it.targetSec ?? 0) / 60, 0) * days.filter(ti => ti === templates.indexOf(x)).length, 0);
  return { templates, days, weeklySets, below10, backToBack, cardioMin, budget, home };
}

/** Zapis po zatwierdzeniu: szablony w folderze „Wygenerowane” (nazwy bez kolizji), plan obok innych; `activate` — od razu obowiązuje. */
export function saveGenerated(r: GenResult, inp: GenInput, activate: boolean): { templateIds: string[]; planId: string } {
  const st = getState(); const names = new Set(st.templates.map(x => x.name));
  const uniq = (n: string) => { if (!names.has(n)) { names.add(n); return n; } for (let i = 2; ; i++) { const c = `${n} (${i})`; if (!names.has(c)) { names.add(c); return c; } } };
  const folder = t('Wygenerowane');
  const tpls: Template[] = r.templates.map(g => ({ ...base(st.ownerId), name: uniq(g.name), folder, ...(inp.locationId ? { locationId: inp.locationId } : {}),
    items: g.items.map((it): TemplateItem => ({ id: uid(), exerciseId: it.exerciseId, sets: it.sets, repMin: it.repMin, repMax: it.repMax, restSec: it.restSec, startWeight: '', targetSec: it.targetSec ?? '', groupId: null })) }));
  st.templates.push(...tpls); st.userTouched = true; save();
  const planId = addPlan(t('{goal}, {n}× w tygodniu', { goal: goalLabel(inp.goal), n: inp.sessions }), r.days.map(ti => (ti == null ? null : tpls[ti].id)), activate);
  return { templateIds: tpls.map(x => x.id), planId };
}
