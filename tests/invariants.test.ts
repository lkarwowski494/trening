/*
 * Niezmienniki (testy właściwości, fast-check). Zamiast pojedynczych przykładów z rund audytu: losowe sekwencje
 * działań użytkownika (te same przekształcenia co pola na ekranie) i po każdym kroku sprawdzenie reguł, które
 * zawsze muszą być prawdziwe. Błąd → fast-check zmniejsza sekwencję do najkrótszej, która go odtwarza.
 */
import fc from 'fast-check';
import * as store from '@/lib/store';
import * as stats from '@/lib/stats';
import * as units from '@/lib/units';
import { fresh } from './helpers';

jest.setTimeout(600000);
const RUNS = Number(process.env.INV_RUNS || 60);

type A =
  | { t: 'startTpl'; i: number } | { t: 'startEmpty' } | { t: 'repeat' } | { t: 'addEx'; i: number }
  | { t: 'addSet'; e: number } | { t: 'rmSet'; e: number } | { t: 'rmEx'; e: number }
  | { t: 'type'; e: number; s: number; k: 'weight' | 'reps' | 'durationSec' | 'distanceM' | 'rpe'; v: number | '' }
  | { t: 'tick'; e: number; s: number } | { t: 'tickUntick'; e: number; s: number } | { t: 'band'; e: number; s: number }
  | { t: 'kind'; e: number; s: number; k: 'normal' | 'warmup' | 'drop' | 'failure' } | { t: 'link'; e: number } | { t: 'unlink'; e: number }
  | { t: 'unit' } | { t: 'finish' } | { t: 'cancel' } | { t: 'delW'; i: number } | { t: 'equip'; i: number; q: number }
  | { t: 'bandOff'; i: number } | { t: 'nominal'; b: number; v: number | '' } | { t: 'delBand'; b: number } | { t: 'bodyweight'; v: number | '' };

const num = fc.oneof(fc.constantFrom<number | ''>('', 0, 1, 2.5, 5, 8, 10, 12.345, 20, 62.555, 100, 100.004, -5, -15, -20, 1e6), fc.double({ min: -50, max: 300, noNaN: true }));
const idx = fc.nat(12);
const action: fc.Arbitrary<A> = fc.oneof(
  { weight: 2, arbitrary: fc.record({ t: fc.constant('startTpl' as const), i: idx }) },
  { weight: 1, arbitrary: fc.constant({ t: 'startEmpty' as const }) },
  { weight: 1, arbitrary: fc.constant({ t: 'repeat' as const }) },
  { weight: 2, arbitrary: fc.record({ t: fc.constant('addEx' as const), i: fc.nat(130) }) },
  { weight: 2, arbitrary: fc.record({ t: fc.constant('addSet' as const), e: idx }) },
  { weight: 1, arbitrary: fc.record({ t: fc.constant('rmSet' as const), e: idx }) },
  { weight: 1, arbitrary: fc.record({ t: fc.constant('rmEx' as const), e: idx }) },
  { weight: 6, arbitrary: fc.record({ t: fc.constant('type' as const), e: idx, s: idx, k: fc.constantFrom('weight' as const, 'reps' as const, 'durationSec' as const, 'distanceM' as const, 'rpe' as const), v: num }) },
  { weight: 6, arbitrary: fc.record({ t: fc.constant('tick' as const), e: idx, s: idx }) },
  { weight: 2, arbitrary: fc.record({ t: fc.constant('tickUntick' as const), e: idx, s: idx }) },
  { weight: 3, arbitrary: fc.record({ t: fc.constant('band' as const), e: idx, s: idx }) },
  { weight: 1, arbitrary: fc.record({ t: fc.constant('kind' as const), e: idx, s: idx, k: fc.constantFrom('normal' as const, 'warmup' as const, 'drop' as const, 'failure' as const) }) },
  { weight: 1, arbitrary: fc.record({ t: fc.constant('link' as const), e: idx }) },
  { weight: 1, arbitrary: fc.record({ t: fc.constant('unlink' as const), e: idx }) },
  { weight: 1, arbitrary: fc.constant({ t: 'unit' as const }) },
  { weight: 2, arbitrary: fc.constant({ t: 'finish' as const }) },
  { weight: 1, arbitrary: fc.constant({ t: 'cancel' as const }) },
  { weight: 1, arbitrary: fc.record({ t: fc.constant('delW' as const), i: idx }) },
  { weight: 1, arbitrary: fc.record({ t: fc.constant('equip' as const), i: fc.nat(130), q: fc.nat(5) }) },
  { weight: 1, arbitrary: fc.record({ t: fc.constant('bandOff' as const), i: fc.nat(130) }) },
  { weight: 1, arbitrary: fc.record({ t: fc.constant('nominal' as const), b: fc.nat(3), v: fc.constantFrom<number | ''>('', 0, 10, 15, 20, 2.125, 25) }) },
  { weight: 1, arbitrary: fc.record({ t: fc.constant('delBand' as const), b: fc.nat(3) }) },
  { weight: 1, arbitrary: fc.record({ t: fc.constant('bodyweight' as const), v: fc.constantFrom<number | ''>('', 0, 0.004, 80, 81.25, 1200) }) },
);
const EQ = ['hantle', 'sztanga', 'masa ciała', 'maszyna', 'linki', 'inne'] as const;

/** Te same przekształcenia co pola na ekranie (NumInput przycina do ±1e6; ActiveWorkout: ciężar ≥ 0, powt. całkowite, czas/dystans całkowite, RPE 0,1). */
function typeValue(e: any, set: any, k: string, raw: number | '') {
  const v = raw === '' ? '' : Math.max(-1e6, Math.min(1e6, raw));
  const ex = store.exById(e.exerciseId)!; const bw = store.isBW(ex);
  if (k === 'weight') { if (bw) set.addKg = units.wIn(v); else set.weight = v === '' ? '' : units.wIn(Math.max(0, v)); }
  else if (k === 'reps') set.reps = v === '' ? '' : Math.max(0, Math.floor(v));
  else if (k === 'durationSec') set.durationSec = v === '' ? '' : Math.min(86400, Math.max(0, Math.round(v)));
  else if (k === 'distanceM') set.distanceM = v === '' ? '' : Math.max(0, Math.round(v));
  else if (k === 'rpe') set.rpe = v === '' ? '' : Math.min(10, Math.max(0, Math.round(v * 10) / 10));
  set.edited = true;
}
/** Jak cycleBand na ekranie. */
function cycleBand(e: any, set: any) {
  const ex = store.exById(e.exerciseId)!; if (!ex.bandAssistable) return;
  const bands = [...store.getState().bands].sort((a, b) => a.level - b.level); const i = bands.findIndex(b => b.id === set.bandId); const prev = set.bandId;
  set.bandId = i < 0 ? (bands[0]?.id ?? '') : (i + 1 < bands.length ? bands[i + 1].id : ''); if (set.bandId) delete set.noBand; else set.noBand = true;
  store.applyBandAssist(set, prev); if (!(store.isBW(ex) && (ex.metric ?? 'weight_reps').includes('weight'))) set.addKg = '';
}
/** Jak usuwanie gumy na ekranie Gumy. */
function deleteBand(id: string) {
  const st = store.getState(); st.bands = st.bands.filter(b => b.id !== id);
  st.active?.exercises.forEach(e => e.sets.forEach(s => { if (s.bandId === id) { if (Number(s.addKg) < 0) s.addKg = ''; s.bandId = ''; } })); store.save();
}

function run(a: A) {
  const st = store.getState(); const act = st.active; const exs = st.exercises.filter(e => !e.archived);
  const blk = (e: number) => act && act.exercises.length ? act.exercises[e % act.exercises.length] : null;
  switch (a.t) {
    case 'startTpl': if (!act && st.templates.length) store.startFromTemplate(st.templates[a.i % st.templates.length]); break;
    case 'startEmpty': if (!act) store.startEmpty(); break;
    case 'repeat': if (!act) store.repeatLast(); break;
    case 'addEx': if (act && exs.length) store.addExerciseToActive(exs[a.i % exs.length]); break;
    case 'addSet': if (act?.exercises.length) store.addSet(a.e % act.exercises.length); break;
    case 'rmSet': if (act?.exercises.length) store.removeSet(a.e % act.exercises.length); break;
    case 'rmEx': if (act?.exercises.length) store.removeExercise(a.e % act.exercises.length); break;
    case 'type': { const e = blk(a.e); if (e) { const s = e.sets[a.s % e.sets.length]; if (!s.done) typeValue(e, s, a.k, a.v); store.save(act); } break; }
    case 'tick': { const e = blk(a.e); if (e) store.toggleDone(act!.exercises.indexOf(e), a.s % e.sets.length); break; }
    case 'tickUntick': {
      const e = blk(a.e); if (!e) break; const si = a.s % e.sets.length; const s = e.sets[si]; if (s.done) break;
      const before = JSON.stringify({ ...s, hinted: undefined }); const ei = act!.exercises.indexOf(e);
      const nxt = e.sets[si + 1] ? JSON.stringify(e.sets[si + 1]) : null;
      store.toggleDone(ei, si); store.toggleDone(ei, si);
      const after = JSON.stringify({ ...s, hinted: undefined, completedAt: null, actualRest: null, edited: s.edited });
      const norm = (x: string) => { const o = JSON.parse(x); delete o.completedAt; delete o.actualRest; delete o.hinted; return o; };
      // Niezmiennik: odhaczenie + cofnięcie przywraca serię (wartości wstawione z podpowiedzi znikają).
      expect(norm(after)).toEqual(norm(before)); void nxt; break;
    }
    case 'band': { const e = blk(a.e); if (e) { const s = e.sets[a.s % e.sets.length]; if (!s.done) cycleBand(e, s); store.save(act); } break; }
    case 'kind': { const e = blk(a.e); if (e) { const s = e.sets[a.s % e.sets.length]; s.kind = a.k; s.warmup = a.k === 'warmup'; store.save(act); } break; }
    case 'link': if (act && act.exercises.length > 1) { store.linkWithNext(act.exercises, a.e % (act.exercises.length - 1), act); } break;
    case 'unlink': if (act?.exercises.length) store.unlink(act.exercises, a.e % act.exercises.length, act); break;
    case 'unit': st.settings.unit = st.settings.unit === 'lb' ? 'kg' : 'lb'; store.applyPrefs(); store.save(); break;
    case 'finish': if (act) { if (act.exercises.some(e => e.sets.some(s => s.done))) store.finishWorkout(); else store.cancelWorkout(); } break;
    case 'cancel': if (act) store.cancelWorkout(); break;
    case 'delW': if (st.workouts.length) store.deleteWorkout(st.workouts[a.i % st.workouts.length].id); break;
    case 'equip': if (exs.length) store.setEquipment(exs[a.i % exs.length], EQ[a.q % EQ.length]); break;
    case 'bandOff': if (exs.length) { const x = exs[a.i % exs.length]; x.bandAssistable = !x.bandAssistable; store.save(x); } break;
    case 'nominal': if (st.bands.length) { const b = st.bands[a.b % st.bands.length]; b.nominalKg = a.v === '' ? '' : units.wIn(Math.max(0, a.v)) as number; store.save(b); } break;
    case 'delBand': if (st.bands.length) deleteBand(st.bands[a.b % st.bands.length].id); break;
    case 'bodyweight': { /* runda 75 (Q-001): masa ciała tylko w porannym wpisie, poza obliczeniami */ const kg = a.v === '' ? 0 : Number(units.wIn(a.v)); const d = store.localISODate(); let m = st.mornings.find((x: any) => x.date === d); if (!m) { m = { id: 'm' + st.mornings.length, ownerId: 'local', createdAt: Date.now(), updatedAt: Date.now(), date: d, bb: '', sleepScore: '', sleepH: '', weight: '' } as any; st.mornings.push(m!); } m!.weight = kg > 0 && kg <= 1000 ? Math.round(kg * 100) / 100 : ''; store.save(); break; }
  }
}

const onGrid = (v: unknown) => v === '' || v == null || Math.abs(Number(v) * 100 - Math.round(Number(v) * 100)) < 1e-6;
function groupsOk(list: { groupId?: string | null }[]) {
  const seen = new Set<string>(); let prev: string | null = null; let run = 0;
  for (const it of list) {
    const g = it.groupId ?? null;
    if (g !== prev) { if (prev && run < 2) return false; if (g && seen.has(g)) return false; if (g) seen.add(g); run = 1; prev = g; } else run++;
  }
  return !(prev && run < 2);
}
function check(where: string) {
  const st = store.getState(); const json = JSON.parse(JSON.stringify(st)); delete json.metaUpdatedAt;
  // I1: wczytanie danych zapisanych przez aplikację niczego nie zmienia.
  const m: any = store.migrate(JSON.parse(JSON.stringify(st))); delete m.metaUpdatedAt;
  expect([where, m]).toEqual([where, json]);
  const bandIds = new Set(st.bands.map(b => b.id));
  for (const w of [...st.workouts, ...(st.active ? [st.active] : [])]) {
    // I2: supersety sąsiadują i mają co najmniej dwa ćwiczenia.
    expect([where, 'groups', groupsOk(w.exercises)]).toEqual([where, 'groups', true]);
    for (const e of w.exercises) for (const s of e.sets) {
      // I3: kg na siatce 0,01; brak „bez gumy” razem z gumą.
      expect([where, 'grid', onGrid(s.weight), onGrid(s.addKg)]).toEqual([where, 'grid', true, true]);
      expect([where, 'noBand+band', !!(s.noBand && s.bandId)]).toEqual([where, 'noBand+band', false]);
      // I4: w treningu w toku żadna seria nie wskazuje usuniętej gumy.
      if (w === st.active) expect([where, 'deleted band', !!s.bandId && !bandIds.has(s.bandId)]).toEqual([where, 'deleted band', false]);
    }
  }
  for (const w of st.workouts) {
    // I5: historia = tylko odhaczone serie, bez pustych bloków i sesji; koniec ≥ start; objętość skończona i ≥ 0.
    expect([where, 'hist', w.exercises.length > 0, w.exercises.every(e => e.sets.length > 0 && e.sets.every(s => s.done)), (w.finishedAt ?? 0) >= w.startedAt]).toEqual([where, 'hist', true, true, true]);
    const v = store.volume(w); expect([where, 'vol', Number.isFinite(v) && v >= 0]).toEqual([where, 'vol', true]);
  }
  for (const t of st.templates) expect([where, 'tplgroups', groupsOk(t.items)]).toEqual([where, 'tplgroups', true]);
  // I6: rekordy i statystyki zawsze skończone.
  for (const e of st.exercises.slice(0, 200)) { const r = stats.recordsFor(e); for (const v of Object.values(r)) if (typeof v === 'number') expect([where, e.name, Number.isFinite(v)]).toEqual([where, e.name, true]); }
  if (st.active) stats.prMap(st.active);
}

describe('niezmienniki — losowe sekwencje działań (fast-check)', () => {
  test('po każdym kroku: wczytanie bez zmian, supersety, siatka kg, guma, historia, objętość, rekordy; odhacz+cofnij przywraca serię', async () => {
    await fc.assert(fc.asyncProperty(fc.array(action, { minLength: 5, maxLength: 70 }), fc.boolean(), async (acts, lb) => {
      await fresh(); if (lb) { store.getState().settings.unit = 'lb'; store.applyPrefs(); }
      try { acts.forEach((a, i) => { run(a); check(`krok ${i}: ${JSON.stringify(a)}`); }); }
      finally { units.applyUnit('kg'); }
    }), { numRuns: RUNS, seed: process.env.INV_SEED ? Number(process.env.INV_SEED) : undefined });
  });
});

describe('niezmienniki — jednostki', () => {
  test('lb: wpis → kg na siatce 0,01, a wyświetlenie wraca do tej samej liczby; ponowny wpis daje te same kg', () => {
    units.applyUnit('lb');
    try {
      fc.assert(fc.property(fc.integer({ min: -20000, max: 30000 }), n => {
        const lb = n / 10; const kg = units.wIn(lb) as number;
        expect(onGrid(kg)).toBe(true); const shown = units.wOut(kg); expect(units.wIn(shown)).toBe(kg);
      }), { numRuns: 3000 });
    } finally { units.applyUnit('kg'); }
  });
  test('kg: wpis zaokrąglony do 0,01, połówki symetrycznie od zera', () => {
    fc.assert(fc.property(fc.double({ min: -1e5, max: 1e5, noNaN: true }), x => {
      const kg = units.wIn(x) as number; expect(onGrid(kg)).toBe(true); expect(Math.abs(kg - x)).toBeLessThanOrEqual(0.005 + 1e-9);
      expect(units.wIn(-x)).toBe(kg === 0 ? 0 : -kg);
    }), { numRuns: 3000 });
  });
});

describe('niezmienniki — oś wykresu', () => {
  const { axisTicks, TIME_STEPS } = require('@/components/Chart');
  test('podziałki: rosnące, obejmują wszystkie punkty, etykiety bez powtórzeń (kg, lb, objętość, powtórzenia)', () => {
    fc.assert(fc.property(fc.array(fc.double({ min: -60, max: 400, noNaN: true }), { minLength: 2, maxLength: 30 }), fc.constantFrom('kg', 'lb', 'vol', 'reps', 'time'), (vals, kind) => {
      const lb = kind === 'lb'; const v = kind === 'time' ? vals.map(x => Math.abs(Math.round(x * 30))) : kind === 'reps' ? vals.map(x => Math.abs(Math.round(x))) : kind === 'vol' ? vals.map(x => Math.abs(x) * 20) : vals.map(x => Math.round(x * 100) / 100);
      units.applyUnit(lb ? 'lb' : 'kg');
      try {
        const opt = kind === 'reps' || kind === 'time' ? [1, 0, true] : kind === 'vol' ? [1, 1, true] : [lb ? 1 / units.KG_PER_LB : 1, lb ? 0.1 : 0.01, false];
        const { ticks, yMin, yMax } = axisTicks(v, opt[0], opt[1], opt[2], kind === 'time' ? TIME_STEPS : undefined);
        const fmt = kind === 'time' ? (x: number) => store.fmtSec(x) : kind === 'reps' ? (x: number) => String(Math.round(x)) : kind === 'vol' ? units.fmtVol : (x: number) => units.fmtW(x);
        for (let i = 1; i < ticks.length; i++) expect(ticks[i]).toBeGreaterThan(ticks[i - 1]);
        expect(Math.min(...v)).toBeGreaterThanOrEqual(yMin - 1e-9); expect(Math.max(...v)).toBeLessThanOrEqual(yMax + 1e-9);
        const labels = ticks.map(fmt); expect(new Set(labels).size).toBe(labels.length);
        if (kind === 'reps') for (const t of ticks) expect(Number.isInteger(Math.round(t * 1e9) / 1e9)).toBe(true);
        if (kind === 'time' && ticks.length > 1) { const st = ticks[1] - ticks[0]; expect(TIME_STEPS.includes(st) || st % 3600 === 0).toBe(true); } /* runda 71: kroki zegarowe */
      } finally { units.applyUnit('kg'); }
    }), { numRuns: Math.max(200, RUNS * 33) });
  });
});
