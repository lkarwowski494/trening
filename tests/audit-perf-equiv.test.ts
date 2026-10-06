/*
 * Runda 74 — optymalizacje bez zmiany zachowania. Szybkie ścieżki (indeks treningów z ćwiczeniem, summarize w jednym
 * przejściu, rekordy narastające z wyszukiwaniem binarnym, hasHistory) porównane z wzorcowymi implementacjami sprzed rundy
 * (skopiowanymi tutaj 1:1, wielokrotne przejścia po całej historii) na losowych historiach (fast-check).
 */
import fc from 'fast-check';
import * as store from '@/lib/store';
import * as stats from '@/lib/stats';
import * as units from '@/lib/units';
import { fresh, ex } from './helpers';
import { hasReps, hasWeight, hasTime, hasDistance, type Exercise, type MetricType, type WSet, type Workout } from '@/lib/seed';

jest.setTimeout(300000);
const RUNS = Number(process.env.INV_RUNS || 60);
const NAMES = ['Back Squat', 'Bench Press (hantle)', 'Pull Up', 'Plank', 'Bieg', 'Leg Press', 'Nordic Curl', "Farmer's Walk", 'Suitcase Carry'];

/* ---------- wzorzec: kod sprzed rundy 74 ---------- */
const { repsOf, isWorking, setScore, setLoad, effectiveLoad, setVolume, isBW } = store;
/* Q-026 (decyzja 04.10.2026, zamierzona zmiana dopisana do wzorca): seria tylko z wartością spod innego sprzętu — obciążenie nieznane */
const foreignLoad = (e: Exercise, s: WSet) => hasWeight(e.metric ?? 'weight_reps') && !store.loadOf(e, s).own;
const unknownAssist = (e: Exercise, s: WSet) => (isBW(e) && !!s.bandId && e.bandAssistable && !(Number(s.addKg) < 0)) || foreignLoad(e, s); /* przegląd 06.10: guma oporowa to nie asysta */
const e1rmOf = (s: WSet, load: number) => s.kind === 'drop' || repsOf(s) > stats.E1RM_MAX_REPS ? 0 : stats.e1rm(load, repsOf(s));
const recE1 = (e: Exercise, s: WSet) => unknownAssist(e, s) ? 0 : e1rmOf(s, effectiveLoad(e, s)); /* runda 75: bez masy ciała — bez `at` */
const recVol = (e: Exercise, s: WSet) => unknownAssist(e, s) ? 0 : setVolume(e, s);
const freeOf = (e: Exercise, s: WSet) => { const m = e.metric ?? 'weight_reps'; return !(s.bandId && e.bandAssistable) && !foreignLoad(e, s) && (!hasWeight(m) || (isBW(e) && setLoad(e, s) >= 0)); };
const performed = (m: MetricType, s: WSet) => hasReps(m) ? repsOf(s) > 0 : hasDistance(m) ? Number(s.distanceM) > 0 || Number(s.durationSec) > 0 : hasTime(m) ? Number(s.durationSec) > 0 : true;
function refSummarize(e: Exercise, w: Workout, sets: WSet[]) {
  const m = e.metric ?? 'weight_reps'; const at = w.startedAt;
  const scored = sets.some(s => performed(m, s)) ? sets.filter(s => performed(m, s)) : sets;
  const bestSet = scored.reduce((a, s) => setScore(e, s) > setScore(e, a) ? s : a, scored[0]);
  return {
    workout: w, date: at, sets, bestSet, total: sets.reduce((a, s) => a + stats.setTotal(e, s), 0),
    /* runda 74: Q-008 (guma bez kg nie jest „±0”) i Q-005 (drop set nie jest max powtórzeń) — zamierzone zmiany dopisane do wzorca */
    maxLoad: hasWeight(m) ? (loads => loads.length ? Math.max(...loads) : 0)(sets.filter(s => performed(m, s) && !unknownAssist(e, s)).map(s => setLoad(e, s))) : 0,
    hasLoad: hasWeight(m) && sets.some(s => performed(m, s) && !unknownAssist(e, s)),
    bestE1rm: hasWeight(m) && hasReps(m) ? Math.max(0, ...sets.map(s => recE1(e, s))) : 0,
    volume: sets.reduce((a, s) => a + setVolume(e, s), 0),
    maxReps: hasReps(m) ? Math.max(0, ...sets.filter(s => s.kind !== 'drop').map(repsOf)) : 0,
    maxDuration: hasTime(m) ? Math.max(0, ...sets.map(s => Number(s.durationSec) || 0)) : 0,
    maxDistance: hasDistance(m) ? Math.max(0, ...sets.map(s => Number(s.distanceM) || 0)) : 0,
  };
}
function refSessions(e: Exercise, before?: number) {
  const out = [];
  for (const w of store.finishedWorkouts()) { const sets = store.blocksOf(w, e.id).flatMap(b => b.sets.filter(isWorking)); if (!sets.length) continue; out.push(refSummarize(e, w, sets)); }
  out.reverse(); return before == null ? out : out.filter(s => s.date < before);
}
function refRecords(e: Exercise, before?: number) {
  const r = stats.emptyRecords();
  for (const s of refSessions(e, before)) {
    r.any = true; r.bestTotal = Math.max(r.bestTotal, s.total); r.maxLoad = Math.max(r.maxLoad, s.maxLoad); r.bestE1rm = Math.max(r.bestE1rm, s.bestE1rm); if (s.bestE1rm > 0) r.e1rmAny = true; if (s.total > 0) r.totalAny = true; /* Q-026 (audyt 04.10): zamierzona zmiana */ r.maxReps = Math.max(r.maxReps, s.maxReps);
    r.maxDuration = Math.max(r.maxDuration, s.maxDuration); r.maxDistance = Math.max(r.maxDistance, s.maxDistance);
    s.sets.forEach(set => { r.bestSetVolume = Math.max(r.bestSetVolume, recVol(e, set)); if (freeOf(e, set) && set.kind !== 'drop') r.maxRepsFree = Math.max(r.maxRepsFree, repsOf(set)); });
  }
  return r;
}

/* ---------- losowa historia ---------- */
const val = fc.constantFrom<number | ''>('', 0, 1, 3, 5, 8, 10, 11, 12, 15, 20, 45.35, 60, 62.5, 100, 140, 3000, -10, -25);
const set = fc.record({ weight: val, reps: fc.constantFrom<number | ''>('', 0, 1, 3, 5, 8, 10, 11, 15, 25), durationSec: val, distanceM: val, addKg: val, band: fc.boolean(),
  kind: fc.constantFrom('normal', 'normal', 'warmup', 'drop', 'failure'), done: fc.constantFrom(true, true, true, false) });
const block = fc.record({ n: fc.nat(NAMES.length - 1), sets: fc.array(set, { minLength: 0, maxLength: 4 }) });
const workout = fc.record({ day: fc.nat(40), blocks: fc.array(block, { minLength: 1, maxLength: 4 }), bw: fc.constantFrom(0, 0, 75, 82.5) });
const history = fc.record({ ws: fc.array(workout, { minLength: 0, maxLength: 14 }), lb: fc.boolean(), morning: fc.constantFrom<number | ''>('', 70, 90) });

async function load(h: { ws: { day: number; blocks: { n: number; sets: any[] }[]; bw: number }[]; lb: boolean; morning: number | '' }) {
  await fresh(); const st = store.getState(); const base = new Date(2026, 0, 1, 18).getTime();
  const band = st.bands[0]?.id ?? '';
  if (h.morning !== '') st.mornings.push({ id: 'm1', ownerId: 'local', createdAt: base, updatedAt: base, date: '2026-01-15', weight: h.morning, bb: '', sleepScore: '', sleepH: '' } as never);
  h.ws.forEach((w, i) => { const at = base + w.day * 86400e3; /* ten sam dzień dwa razy = remis dat */
    st.workouts.push({ id: `w${i}`, ownerId: 'local', createdAt: at, updatedAt: at, loggedBy: 'local', sessionMode: 'solo', healthUUID: null, templateId: null, templateName: 'T', startedAt: at, finishedAt: at + 3600e3, note: '',
      exercises: w.blocks.map((b, k) => ({ id: `e${i}_${k}`, exerciseId: ex(NAMES[b.n]).id, restSec: 90, repMin: null, repMax: null, groupId: null,
        sets: b.sets.map((s, j) => ({ id: `s${i}_${k}_${j}`, weight: s.weight === '' ? '' : Math.abs(s.weight), reps: s.reps, durationSec: s.durationSec === '' ? '' : Math.abs(s.durationSec), distanceM: s.distanceM === '' ? '' : Math.abs(s.distanceM), rpe: '', bandId: s.band ? band : '', addKg: s.addKg, kind: s.kind, warmup: s.kind === 'warmup', note: '', done: s.done, completedAt: at + j * 1000, actualRest: null })) })) } as Workout);
  });
  units.applyUnit(h.lb ? 'lb' : 'kg'); store.save();
}
const strip = (x: any) => { const { bestSetVolume: _a, maxRepsFree: _b, ...rest } = x; return rest; };

afterEach(() => units.applyUnit('kg'));

describe('R74 — szybkie ścieżki = wzorzec sprzed optymalizacji', () => {
  test('sesje, rekordy (dowolne „before”), hasHistory i indeks treningów z ćwiczeniem (źródło „poprzednio”) na losowych historiach', async () => {
    await fc.assert(fc.asyncProperty(history, fc.array(fc.integer({ min: -2, max: 45 }), { minLength: 1, maxLength: 4 }), async (h, days) => {
      await load(h); const base = new Date(2026, 0, 1, 18).getTime();
      for (const name of NAMES) {
        const e = ex(name);
        expect(stats.sessionsFor(e).map(strip)).toEqual(refSessions(e));
        expect(stats.recordsFor(e)).toEqual(refRecords(e));
        for (const d of days) { const before = base + d * 86400e3 + (d % 2 ? 0 : 1); /* dokładnie na starcie i tuż po */
          expect(stats.sessionsFor(e, before).map(strip)).toEqual(refSessions(e, before));
          expect(stats.recordsFor(e, before)).toEqual(refRecords(e, before)); }
        expect(stats.hasHistory(e.id)).toBe(refSessions(e).length > 0);
        expect(store.workoutsWith(e.id)).toEqual(store.finishedWorkouts().filter(w => w.exercises.some(x => x.exerciseId === e.id)));
      }
    }), { numRuns: RUNS });
  });
  test('recordsFor zwraca kopię — prMap podnoszący poprzeczkę nie psuje rekordów narastających', async () => {
    await load({ ws: [{ day: 1, blocks: [{ n: 0, sets: [{ weight: 100, reps: 5, durationSec: '', distanceM: '', addKg: '', band: false, kind: 'normal', done: true }] }], bw: 0 }], lb: false, morning: '' });
    const r = stats.recordsFor(ex('Back Squat')); r.bestE1rm = 9999; r.bestTotal = 9999;
    expect(stats.recordsFor(ex('Back Squat')).bestE1rm).toBeLessThan(200); expect(stats.recordsFor(ex('Back Squat')).bestTotal).toBe(500);
  });
});
