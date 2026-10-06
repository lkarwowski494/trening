/*
 * Macierz wymiarów (polecenie właściciela 06.10.2026: „pełen matrix możliwości”; bramka: scripts/test-matrix.mjs, sekcja WYMIAR).
 *
 * Testy kombinatoryczne iterują po LISTACH WARTOŚCI Z KODU (METRICS, SET_KINDS, MUSCLES, LANGS, EQUIPMENT, LOCATION_PRESETS, LOAD_PRESETS,
 * katalog ćwiczeń ze stanu startowego) — nowa wartość dopisana w kodzie trafia tu sama. Jednostki (UNITS) i motywy (THEMES) nie mają
 * listy w kodzie (tylko typy `Unit` / `ThemeSetting`), więc listy niżej są zbudowane z obiektu `satisfies Record<typ, 1>` — nowa wartość
 * typu bez wpisu tutaj nie przejdzie typecheck.
 *
 * Wartości oczekiwane liczone NIEZALEŻNIE od kodu aplikacji (wzory z dokumentacji: objętość = ciężar × powtórzenia × mnożnik, e1RM Epley,
 * formaty tekstu serii), a nie przez wołanie tych samych funkcji. Rozbieżność z poprawnym zachowaniem → `test.failing` z komentarzem
 * ZNALEZISKO (kodu aplikacji nie zmieniamy).
 */
import * as RN from 'react-native';
import { Appearance } from 'react-native';
import * as store from '@/lib/store';
import * as edit from '@/lib/edit';
import * as stats from '@/lib/stats';
import { buildBackup, buildCsv, parseBackup } from '@/lib/backup';
import { addLocation, setEquip, setOpt, setLoad, equipOf, activeEquip } from '@/lib/locations';
import {
  EQUIPMENT, LOCATION_PRESETS, LOAD_PRESETS, LOCATION_PRESET_LABEL, CAPABILITIES, CAP_LABEL, equipById, capsOf, availability, loadKindsFor, loadsFor,
  implAt, implsAt, applyLoadPreset, presetEquipment, equipLabel, blankLoad, equipEntry, type EquipItem,
} from '@/lib/equipment';
import { validateSpec, specValues, type LoadSpec } from '@/lib/loads';
import { LANGS, applyLang, exName, t, tIn, lbl, lang, decimalComma, type Lang } from '@/lib/i18n';
import { EN } from '@/lib/i18n.en';
import { LOCALES } from '@/lib/locales';
import { KG_PER_LB, wIn, wOut, wField, wInKeep, applyUnit, wu, type Unit } from '@/lib/units';
import { light, dark } from '@/lib/theme';
import { METRICS, SET_KINDS, MUSCLES, IMPLS, GROUPS, METRIC_LABEL, SET_KIND_LABEL, LOAD_MODE_LABEL, REGION_LABEL, LOAD_SOURCE_BY_EQUIPMENT, hasWeight, hasReps, hasTime, hasDistance, seedState, uid, type Exercise, type MetricType, type SetKind, type ThemeSetting, type WSet, type Workout, type Template } from '@/lib/seed';
import { renderApp, flushAll, screen, go } from './app';
import { fresh } from './helpers';

jest.setTimeout(180000);

/* ---------- wymiary bez listy w kodzie (kompletność wymusza typecheck) ---------- */
const UNITS = Object.keys({ kg: 1, lb: 1 } satisfies Record<Unit, 1>) as Unit[];
const THEMES = Object.keys({ light: 1, dark: 1, auto: 1 } satisfies Record<ThemeSetting, 1>) as ThemeSetting[];

/* ---------- wspólne ---------- */
const S = () => store.getState();
const CATALOG0 = seedState('pl').exercises; /* katalog ze świeżego stanu (nazwy do test.each) */
const isBWx = (e: Pick<Exercise, 'equipment'>) => e.equipment === 'masa ciała';
/** Mnożnik objętości wg dokumentacji (seed.ts LOAD_MODE_LABEL): per hantel / jednostronne ×2, łącznie ×1; masa ciała ×1. */
const multOf = (e: Exercise) => isBWx(e) ? 1 : e.loadMode === 'total' ? 1 : 2;
const epley = (load: number, reps: number) => load > 0 && reps > 0 ? (reps === 1 ? load : load * (1 + reps / 30)) : 0;
const fmtPl = (v: number) => String(v).replace('.', ',');
const secTxt = (s: number) => { const m = Math.floor(s / 60), r = s % 60; return m ? `${m}:${String(r).padStart(2, '0')}` : `${r}s`; };
const distTxt = (m: number) => m >= 1000 ? `${fmtPl(m / 1000)} km` : `${m} m`;
const setUnit = (u: Unit) => { S().settings.unit = u; store.applyPrefs(); store.save(); };
/** Prosty parser CSV (cudzysłowy, przecinki w polach). */
function parseCsv(txt: string): string[][] {
  const rows: string[][] = []; let row: string[] = []; let f = ''; let q = false;
  for (let i = 0; i < txt.length; i++) { const c = txt[i];
    if (q) { if (c === '"') { if (txt[i + 1] === '"') { f += '"'; i++; } else q = false; } else f += c; }
    else if (c === '"') q = true; else if (c === ',') { row.push(f); f = ''; } else if (c === '\n') { row.push(f); rows.push(row); row = []; f = ''; } else f += c; }
  if (f || row.length) { row.push(f); rows.push(row); }
  return rows;
}
const VALS = ['weight', 'reps', 'durationSec', 'distanceM', 'addKg', 'bandId', 'kind', 'warmup', 'done'] as const;
const valsOf = (w: Workout) => w.exercises.map(e => e.sets.map(s => VALS.map(k => s[k])));

/* ---------- reprezentanci metryk: z katalogu, po jednym na (metryka × masa ciała / tryb liczenia) ---------- */
type Rep = { name: string; metric: MetricType; bw: boolean };
const REPS: Rep[] = METRICS.flatMap(m => { const seen = new Set<string>(); const out: Rep[] = [];
  for (const e of CATALOG0) { if (e.metric !== m) continue; const k = isBWx(e) ? 'bw' : e.loadMode; if (seen.has(k)) continue; seen.add(k); out.push({ name: e.name, metric: m, bw: isBWx(e) }); }
  return out; });

/** Wartości serii w jednostce WYŚWIETLANIA (W, N, F, D — tak układa je addSet: rozgrzewka przed roboczymi, drop na końcu). */
const KINDS_ORDER: SetKind[] = ['warmup', 'normal', 'failure', 'drop'];
const W_DISP: Record<Unit, Record<SetKind, number>> = { kg: { warmup: 20, normal: 60, failure: 62.5, drop: 40 }, lb: { warmup: 45, normal: 135, failure: 137.5, drop: 90 } };
const ADD_DISP: Record<Unit, Record<SetKind, number | ''>> = { kg: { warmup: '', normal: 10, failure: 12.5, drop: 0 }, lb: { warmup: '', normal: 20, failure: 25, drop: 0 } };
const REPS_V: Record<SetKind, number> = { warmup: 10, normal: 8, failure: 6, drop: 12 };
const TIME_V: Record<SetKind, number> = { warmup: 20, normal: 60, failure: 75, drop: 30 };
const DIST_V: Record<SetKind, [number, number]> = { warmup: [400, 180], normal: [1000, 300], failure: [1500, 420], drop: [500, 200] };
const loadDisp = (r: Rep, u: Unit, k: SetKind): number | '' => !hasWeight(r.metric) ? '' : r.bw ? ADD_DISP[u][k] : W_DISP[u][k];

/** Wypełnia serię wartościami właściwymi dla metryki (wpis jak w polu: jednostka wyświetlania → wIn). */
function fill(ex: Exercise, r: Rep, u: Unit, s: WSet, k: SetKind) {
  const m = r.metric;
  if (hasWeight(m)) { const v = loadDisp(r, u, k); store.writeLoad(ex, s, v === '' ? '' : wIn(v)); }
  if (hasReps(m)) s.reps = REPS_V[k];
  if (m === 'distance_time') { s.distanceM = DIST_V[k][0]; s.durationSec = DIST_V[k][1]; } else if (hasTime(m)) s.durationSec = TIME_V[k];
}
/** Trening: jedno ćwiczenie, serie o rodzajach `kinds`, wszystkie odhaczone; zwraca zapisany trening. */
function doWorkout(ex: Exercise, r: Rep, u: Unit, kinds: SetKind[], agoMs = 600e3, values = true): Workout {
  store.startEmpty(); store.addExerciseToActive(ex); const a = S().active!; a.startedAt = Date.now() - agoMs;
  while (a.exercises[0].sets.length < kinds.length) store.addSet(0);
  a.exercises[0].sets.forEach((s, i) => { s.kind = kinds[i]; s.warmup = kinds[i] === 'warmup'; if (values) fill(ex, r, u, s, kinds[i]); });
  store.save(a);
  const t0 = a.startedAt + 1000; a.exercises[0].sets.forEach((_, i) => store.toggleDone(0, i, t0 + i * 1000));
  return store.finishWorkout(t0 + kinds.length * 1000)!;
}
/** Oczekiwany opis serii (setSummary, widok historii) — niezależnie od kodu, wg formatów z dokumentacji (pl). */
function expSummary(r: Rep, u: Unit, k: SetKind): string {
  const m = r.metric; const l = loadDisp(r, u, k);
  if (m === 'time') return secTxt(TIME_V[k]);
  if (m === 'distance_time') return `${distTxt(DIST_V[k][0])} ${secTxt(DIST_V[k][1])}`;
  if (m === 'weight_time') return `${fmtPl(Number(l) || 0)}${u}×${secTxt(TIME_V[k])}`;
  if (m === 'reps') return `${REPS_V[k]}`;
  return r.bw ? `${REPS_V[k]}${l ? '@+' + fmtPl(Number(l)) : ''}` : `${fmtPl(Number(l))}×${REPS_V[k]}`;
}

afterEach(() => { applyLang('pl'); applyUnit('kg'); });

/* ======================================================================================================================== */
describe('METRICS × SET_KINDS × UNITS — pełna ścieżka serii: trening → historia → statystyki → CSV → backup → edycja', () => {
  /* @matrix METRICS */ /* @matrix SET_KINDS */ /* @matrix UNITS */
  test('każda metryka ma reprezentanta z katalogu (także masa ciała przy metrykach z ciężarem, gdy katalog ją ma)', () => {
    for (const m of METRICS) expect([m, REPS.filter(r => r.metric === m).length > 0]).toEqual([m, true]);
    expect(REPS.some(r => r.metric === 'weight_reps' && r.bw)).toBe(true);
  });

  const CASES = REPS.flatMap(r => UNITS.map(u => [r.metric, r.name, u, r] as const));
  test.each(CASES)('%s · %s · %s: wszystkie typy serii (W, N, F, D) w jednym treningu', async (m, name, u, r) => {
    await fresh(); setUnit(u); const ex = S().exercises.find(e => e.name === name)!;
    const w = doWorkout(ex, r, u, KINDS_ORDER);
    const W = hasWeight(m), R = hasReps(m), T = hasTime(m), D = hasDistance(m);

    /* historia: jeden trening, cztery serie w kolejności, wartości zapisane w kg (jednostka tylko na wejściu) */
    expect(S().workouts).toHaveLength(1); expect(S().active).toBeNull();
    const sets = S().workouts[0].exercises[0].sets;
    expect(sets.map(s => s.kind)).toEqual(KINDS_ORDER); expect(sets.map(s => s.warmup)).toEqual([true, false, false, false]); expect(sets.every(s => s.done)).toBe(true);
    sets.forEach((s, i) => { const k = KINDS_ORDER[i]; const v = loadDisp(r, u, k);
      if (W) { const kg = r.bw ? s.addKg : s.weight; expect([k, v === '' ? '' : wOut(Number(kg))]).toEqual([k, v === '' ? '' : v]); if (v !== '' && u === 'kg') expect(kg).toBe(v); }
      else { expect(s.weight).toBe(''); expect(s.addKg).toBe(''); }
      expect(s.reps).toBe(R ? REPS_V[k] : ''); expect(s.distanceM).toBe(D ? DIST_V[k][0] : ''); expect(s.durationSec).toBe(!T ? '' : D ? DIST_V[k][1] : TIME_V[k]); });

    /* opis serii (historia, „Poprzednio”) */
    sets.forEach((s, i) => expect([KINDS_ORDER[i], store.setSummary(ex, s)]).toEqual([KINDS_ORDER[i], expSummary(r, u, KINDS_ORDER[i])]));

    /* serie robocze = bez rozgrzewki; objętość tylko ciężar×powtórzenia (w jednostce wyświetlania) */
    const work = KINDS_ORDER.filter(k => k !== 'warmup');
    const volDisp = W && R ? work.reduce((a, k) => a + multOf(ex) * Math.max(0, Number(loadDisp(r, u, k)) || 0) * REPS_V[k], 0) : 0;
    const vol = store.volume(w); expect(vol / (u === 'lb' ? KG_PER_LB : 1)).toBeCloseTo(volDisp, 6);
    expect(sets.filter(store.isWorking).map(s => s.kind)).toEqual(work);

    /* tydzień: liczba serii roboczych, treningów, objętość = objętość treningu */
    const wk = stats.weeklyTotals(1)[0]; expect([wk.sets, wk.workouts]).toEqual([3, 1]); expect(wk.volume).toBeCloseTo(vol, 9);
    const mon = stats.thisMonday(); const perM: Record<string, number> = {}; ex.muscles.forEach(mu => { perM[mu] = (perM[mu] ?? 0) + 3; }); ex.secondaryMuscles.forEach(mu => { perM[mu] = (perM[mu] ?? 0) + 1.5; });
    expect(stats.weeklySetsByMuscle(mon)).toEqual(perM);
    const perV: Record<string, number> = {}; if (vol) { ex.muscles.forEach(mu => { perV[mu] = (perV[mu] ?? 0) + vol; }); ex.secondaryMuscles.forEach(mu => { perV[mu] = (perV[mu] ?? 0) + vol * 0.5; }); }
    expect(stats.weeklyVolumeByMuscle(mon)).toEqual(perV);

    /* sesje i rekordy (statystyki z historii): tylko serie robocze; max powtórzeń i e1RM bez drop setu; czas/dystans — maksimum z roboczych */
    const ss = stats.sessionsFor(ex); expect(ss).toHaveLength(1); expect(ss[0].sets.map(s => s.kind)).toEqual(work);
    const kgOf = (k: SetKind) => { const s = sets[KINDS_ORDER.indexOf(k)]; return Number(r.bw ? s.addKg : s.weight) || 0; };
    const sumRepsKind = R && (r.bw || !W);
    const expTotal = sumRepsKind ? work.reduce((a, k) => a + REPS_V[k], 0) : W && R ? vol : D ? work.reduce((a, k) => a + DIST_V[k][0], 0) : T ? work.reduce((a, k) => a + TIME_V[k], 0) : 0;
    expect(ss[0].total).toBeCloseTo(expTotal, 9);
    const rec = stats.recordsFor(ex); expect(rec.any).toBe(true);
    expect(rec.maxReps).toBe(R ? Math.max(REPS_V.normal, REPS_V.failure) : 0);
    expect(rec.maxDuration).toBe(!T ? 0 : D ? Math.max(...work.map(k => DIST_V[k][1])) : Math.max(...work.map(k => TIME_V[k])));
    expect(rec.maxDistance).toBe(D ? Math.max(...work.map(k => DIST_V[k][0])) : 0);
    if (W) expect(rec.maxLoad).toBeCloseTo(Math.max(...work.map(kgOf)), 9); else expect(rec.maxLoad).toBe(0);
    expect(rec.bestE1rm).toBeCloseTo(W && R ? Math.max(epley(kgOf('normal'), REPS_V.normal), epley(kgOf('failure'), REPS_V.failure)) : 0, 5);

    /* „Poprzednio” i podpowiedź progresji (tylko ciężar + powtórzenia; drop set poza warunkiem) */
    const prev = store.previousFor(ex.id)!; expect(prev.sets.map(s => s.kind)).toEqual(work);
    const minWorkReps = Math.min(REPS_V.normal, REPS_V.failure);
    if (m === 'weight_reps') {
      const small = !r.bw && (ex.equipment === 'hantle' || ex.loadMode !== 'total');
      const step = r.bw ? (u === 'lb' ? 5 : 2.5) : small ? (u === 'lb' ? 2.5 : 1) : (u === 'lb' ? 5 : 2.5);
      const top = Math.max(Number(loadDisp(r, u, 'normal')) || 0, Number(loadDisp(r, u, 'failure')) || 0);
      const p = store.progressionFor(ex, minWorkReps, prev.sets);
      expect(p).toEqual({ kind: 'load', kg: wIn(top + step) });
      expect(store.progressionFor(ex, minWorkReps + 1, prev.sets)).toBeNull(); /* seria do upadku poniżej góry zakresu */
    } else expect(store.progressionFor(ex, minWorkReps, prev.sets)).toBeNull();

    /* CSV (układ Strong): rozgrzewka „W”, robocze numerowane; ciężar w jednostce z ustawień; typ serii w Notes */
    const rows = parseCsv(buildCsv()); expect(rows[0]).toEqual(['Date', 'Workout Name', 'Duration', 'Exercise Name', 'Set Order', 'Weight', 'Reps', 'Distance', 'Seconds', 'Notes', 'Workout Notes', 'RPE']);
    const body = rows.slice(1); expect(body).toHaveLength(4);
    body.forEach((row, i) => { const k = KINDS_ORDER[i]; const l = loadDisp(r, u, k);
      expect([k, row[3], row[4], row[5], row[6], row[7], row[8], row[9]]).toEqual([k, ex.name, k === 'warmup' ? 'W' : String(i), String(W ? Number(l) || 0 : 0), String(R ? REPS_V[k] : 0), String(D ? DIST_V[k][0] : 0), String(!T ? 0 : D ? DIST_V[k][1] : TIME_V[k]), k === 'drop' ? 'drop set' : k === 'failure' ? 'do upadku' : '']); });

    /* JSON backup: eksport → import daje te same treningi; statystyki i CSV bez zmian */
    const before = JSON.parse(JSON.stringify(S().workouts)); const csv0 = buildCsv();
    const back = parseBackup(JSON.stringify(buildBackup())); expect(back.workouts).toEqual(before);
    store.replaceState(back); expect(JSON.parse(JSON.stringify(S().workouts))).toEqual(before); expect(buildCsv()).toBe(csv0);
    expect(store.volume(S().workouts[0])).toBeCloseTo(vol, 9);

    /* edycja w historii: zapis bez zmian zostawia wartości 1:1; ponowne wpisanie pokazanego ciężaru (wInKeep) nie zmienia kg; zmiana jednej serii — tylko ona */
    const v0 = valsOf(S().workouts[0]);
    const d = edit.beginEdit(S().workouts[0].id)!; const r1 = edit.commitDraft(d.key); expect('error' in r1 ? r1.error : '').toBe(''); expect(valsOf(S().workouts[0])).toEqual(v0);
    const d2 = edit.beginEdit(S().workouts[0].id)!; const e2 = d2.w.exercises[0];
    for (const s of e2.sets) { const raw = store.loadFieldValue(ex, s); if (W) store.writeLoad(ex, s, wInKeep(wField(raw), raw)); }
    if (R) e2.sets[1].reps = REPS_V.normal + 1; else if (D) e2.sets[1].distanceM = DIST_V.normal[0] + 100; else e2.sets[1].durationSec = TIME_V.normal + 5;
    const r2 = edit.commitDraft(d2.key); expect('error' in r2 ? r2.error : '').toBe('');
    const v1 = valsOf(S().workouts[0]); const exp1 = JSON.parse(JSON.stringify(v0)); const fi = R ? 1 : D ? 3 : 2; exp1[0][1][fi] = R ? REPS_V.normal + 1 : D ? DIST_V.normal[0] + 100 : TIME_V.normal + 5;
    expect(v1).toEqual(exp1);
    if (R) expect(stats.recordsFor(ex).maxReps).toBe(REPS_V.normal + 1);

    /* przełączenie jednostki: zapisane kg bez zmian, widok (CSV) w nowej jednostce */
    const other: Unit = u === 'kg' ? 'lb' : 'kg'; const kg0 = S().workouts[0].exercises[0].sets.map(s => [s.weight, s.addKg]);
    setUnit(other); expect(S().workouts[0].exercises[0].sets.map(s => [s.weight, s.addKg])).toEqual(kg0);
    const rowsO = parseCsv(buildCsv()).slice(1);
    rowsO.forEach((row, i) => { const kg = Number(kg0[i][r.bw ? 1 : 0]) || 0; const exp = other === 'lb' ? Math.round(kg / KG_PER_LB * 10) / 10 : Math.round(kg * 100) / 100; expect(Number(row[5])).toBeCloseTo(exp, 9); });
    setUnit(u); expect(buildCsv()).not.toBe(''); expect(S().workouts[0].exercises[0].sets.map(s => [s.weight, s.addKg])).toEqual(kg0);
  });

  /* „Poprzednio”: drugi trening z PUSTYMI seriami — odhaczenie wpisuje wartości poprzedniej sesji (ta sama rodzina serii: zwykła/do upadku ↔
   * zwykła/do upadku, drop ↔ drop; rozgrzewka bez podpowiedzi); cofnięcie odhaczenia je zdejmuje. Ta sama sesja drugi raz to nie rekord;
   * lepsza (więcej powtórzeń / czasu / dystansu) — rekord sumy treningu, a przy ciężarze z powtórzeniami także e1RM. */
  test.each(CASES)('%s · %s · %s: „Poprzednio” przy odhaczaniu pustych serii, potem rekordy (PR) sesji równej i lepszej', async (m, name, u, r) => {
    await fresh(); setUnit(u); const ex = S().exercises.find(e => e.name === name)!;
    doWorkout(ex, r, u, KINDS_ORDER, 300e3); const prevSets = JSON.parse(JSON.stringify(S().workouts[0].exercises[0].sets)) as WSet[];
    store.startEmpty(); store.addExerciseToActive(ex); const a = S().active!; a.startedAt = Date.now() - 200e3;
    store.addSet(0, 'warmup'); store.addSet(0); store.addSet(0, 'drop'); a.exercises[0].sets[2].kind = 'failure'; store.save(a);
    expect(a.exercises[0].sets.map(s => s.kind)).toEqual(KINDS_ORDER); expect(a.exercises[0].sets.every(s => !store.setHasValue(s))).toBe(true);
    a.exercises[0].sets.forEach((_, i) => store.toggleDone(0, i, a.startedAt + 1000 + i * 1000));
    const VK = ['weight', 'reps', 'durationSec', 'distanceM', 'addKg'] as const;
    const got = a.exercises[0].sets.map(s => VK.map(k => s[k]));
    const exp = KINDS_ORDER.map((k, i) => k === 'warmup' ? VK.map(() => '') : VK.map(kk => prevSets[i][kk]));
    expect(got).toEqual(exp);
    /* cofnięcie odhaczenia zdejmuje wartości z podpowiedzi */
    store.toggleDone(0, 1); expect(store.setHasValue(a.exercises[0].sets[1])).toBe(false); store.toggleDone(0, 1, a.startedAt + 5000);
    const w2 = store.finishWorkout(a.startedAt + 10000)!; expect(valsOf(w2)[0].slice(1)).toEqual(valsOf(S().workouts[0])[0].slice(1)); /* rozgrzewka bez podpowiedzi — pusta */
    expect(stats.workoutPRs(w2)).toEqual([]); expect(stats.prMap(w2).size).toBe(0);
    /* trzecia sesja: każda seria robocza lepsza */
    store.startEmpty(); store.addExerciseToActive(ex); const b = S().active!; b.startedAt = Date.now() - 100e3;
    while (b.exercises[0].sets.length < 4) store.addSet(0); b.exercises[0].sets.forEach((s, i) => { s.kind = KINDS_ORDER[i]; s.warmup = i === 0; fill(ex, r, u, s, KINDS_ORDER[i]);
      if (i) { if (hasReps(m)) s.reps = Number(s.reps) + 1; else if (hasDistance(m)) s.distanceM = Number(s.distanceM) + 100; else s.durationSec = Number(s.durationSec) + 5; } });
    store.save(b); b.exercises[0].sets.forEach((_, i) => store.toggleDone(0, i, b.startedAt + 1000 + i * 1000));
    const w3 = store.finishWorkout(b.startedAt + 10000)!;
    const kinds = stats.workoutPRs(w3).flatMap(x => x.kinds).sort();
    const tk = stats.totalKind(ex)!; const expK = [tk, ...(m === 'weight_reps' ? ['e1RM'] : [])].sort();
    expect(kinds).toEqual(expK);
    expect(stats.sessionsFor(ex)).toHaveLength(3); expect(stats.recordsFor(ex, w3.startedAt).bestTotal).toBeCloseTo(stats.sessionsFor(ex)[0].total, 9);
  });

  /* Każdy typ serii osobno (trening tylko z serii jednego typu) — reguły serii roboczych, rekordów, „Powtórz ostatni” i szablonu. */
  const KCASES = SET_KINDS.flatMap(k => REPS.map(r => [k, r.metric, r.name, r] as const));
  test.each(KCASES)('typ %s · %s · %s: same serie tego typu', async (k, m, name, r) => {
    await fresh(); const ex = S().exercises.find(e => e.name === name)!; const u: Unit = 'kg';
    const w = doWorkout(ex, r, u, [k, k]); const working = k !== 'warmup';
    expect(S().workouts[0].exercises[0].sets.map(s => [s.kind, s.warmup])).toEqual([[k, k === 'warmup'], [k, k === 'warmup']]);
    expect(store.hasWorkDone(w)).toBe(working); expect(store.staleKind(w)).toBe(working ? 'work' : 'warmup');
    expect(stats.weeklyTotals(1)[0].sets).toBe(working ? 2 : 0);
    expect(stats.sessionsFor(ex)).toHaveLength(working ? 1 : 0); expect(stats.hasHistory(ex.id)).toBe(working);
    const vol = store.volume(w); const exp = working && hasWeight(m) && hasReps(m) ? 2 * multOf(ex) * Math.max(0, Number(loadDisp(r, u, k)) || 0) * REPS_V[k] : 0;
    expect(vol).toBeCloseTo(exp, 9);
    const rec = stats.recordsFor(ex);
    if (hasReps(m)) expect(rec.maxReps).toBe(working && k !== 'drop' ? REPS_V[k] : 0); /* drop set to nie „max powtórzeń” */
    if (hasWeight(m) && hasReps(m)) expect(rec.bestE1rm).toBeCloseTo(working && k !== 'drop' ? epley(Number(loadDisp(r, u, k)) || 0, REPS_V[k]) : 0, 5);
    const csv = parseCsv(buildCsv()).slice(1); expect(csv.map(x => x[4])).toEqual(working ? ['1', '2'] : ['W', 'W']);
    expect(csv.map(x => x[9])).toEqual(Array(2).fill(k === 'drop' ? 'drop set' : k === 'failure' ? 'do upadku' : ''));
    /* „Powtórz ostatni”: typ serii przechodzi, poza „do upadku” (upadek to wynik, nie plan) */
    store.repeatLast(); expect(S().active!.exercises[0].sets.map(s => s.kind)).toEqual(Array(2).fill(k === 'failure' ? 'normal' : k)); store.cancelWorkout();
    /* szablon z wierszami tego typu → trening z tymi samymi typami serii */
    const tpl = store.newTemplate(); tpl.items.push({ id: uid(), exerciseId: ex.id, sets: 2, repMin: null, repMax: null, restSec: null, startWeight: '', targetSec: '', groupId: null }); store.save(tpl);
    for (const row of store.tplRows(tpl.items[0]).map(x => x.id)) store.tplSetKind(tpl, tpl.items[0].id, row, k);
    expect(store.tplWorkSets(tpl)).toBe(working ? 2 : 0);
    store.startFromTemplate(tpl); expect(S().active!.exercises[0].sets.map(s => [s.kind, s.warmup])).toEqual(Array(2).fill([k, k === 'warmup']));
    store.cancelWorkout();
  });
});

/* ======================================================================================================================== */
describe('UNITS — kg ↔ lb: dane zawsze w kg, jednostka tylko na wejściu i w widoku', () => {
  /* @matrix UNITS */
  const SAMPLES = [0, 0.5, 1.25, 2.5, 20, 22.5, 61.23, 62.5, 100, 102.06, 137.5, 250, 999.99];
  test.each(UNITS)('%s: wField → wInKeep zachowuje kg; wpis pokazanej liczby (wIn) daje tę samą liczbę na ekranie', (u) => {
    applyUnit(u); expect(wu()).toBe(u);
    for (const kg of SAMPLES) {
      expect(wInKeep(wField(kg), kg)).toBe(kg);
      const shown = wField(kg) as number; expect(wOut(Number(wIn(shown)))).toBe(shown); /* ta sama liczba na ekranie po ponownym wpisie */
      expect(Number(wIn(shown))).toBeCloseTo(kg, u === 'lb' ? 1 : 9); /* lb: siatka 0,1 lb ≈ 0,045 kg */
    }
    expect(wField('')).toBe(''); expect(wIn('')).toBe('');
    const disp = u === 'lb' ? (kg: number) => Math.round(kg / KG_PER_LB * 10) / 10 : (kg: number) => Math.round(kg * 100) / 100;
    for (const kg of SAMPLES) expect(wOut(kg)).toBe(disp(kg));
  });
  test.each(UNITS.flatMap(a => UNITS.map(b => [a, b] as const)))('przełączenie %s → %s w Ustawieniach nie zmienia zapisanych kg (historia, szablon, miejsce)', async (a, b) => {
    await fresh(); setUnit(a); const ex = S().exercises.find(e => e.name === 'Bench Press (sztanga)')!;
    const r: Rep = { name: ex.name, metric: 'weight_reps', bw: false }; doWorkout(ex, r, a, KINDS_ORDER);
    const l = addLocation('gym'); const tpl = store.newTemplate(); tpl.items.push({ id: uid(), exerciseId: ex.id, sets: 1, repMin: null, repMax: null, restSec: null, startWeight: wIn(a === 'lb' ? 135 : 60) as number, targetSec: '', groupId: null }); store.save(tpl);
    const snap = JSON.stringify([S().workouts, S().templates, S().settings.locations]);
    setUnit(b); expect(JSON.stringify([S().workouts, S().templates, S().settings.locations])).toBe(snap); expect(wu()).toBe(b);
    /* opis serii roboczej w nowej jednostce: 60 kg = 132,3 lb; 135 lb = 61,23 kg */
    const s = S().workouts[0].exercises[0].sets[1]; const kg = Number(s.weight);
    expect(store.setSummary(ex, s)).toBe(`${fmtPl(b === 'lb' ? Math.round(kg / KG_PER_LB * 10) / 10 : Math.round(kg * 100) / 100)}×${REPS_V.normal}`);
    /* migracja zapisu (ponowne uruchomienie) też nie rusza kg */
    const re = store.migrate(JSON.parse(JSON.stringify(S()))); expect(JSON.stringify([re.workouts, re.templates, re.settings.locations.map(x => x.equipment)])).toBe(JSON.stringify([S().workouts, S().templates, S().settings.locations.map(x => x.equipment)]));
    void l;
  });
});

describe('UNITS × METRICS na ekranie sesji w historii', () => {
  /* @matrix UNITS */ /* @matrix METRICS */ /* @matrix SET_KINDS */
  test.each(UNITS)('%s: objętość sesji, wartości serii i oznaczenia typów (W, 1, 2F, 3D) dla każdej metryki', async (u) => {
    await fresh(); setUnit(u); const exs = REPS.map(r => S().exercises.find(e => e.name === r.name)!);
    store.startEmpty(); const a = S().active!; a.startedAt = Date.now() - 3600e3; exs.forEach(ex => store.addExerciseToActive(ex));
    a.exercises.forEach((b, i) => { store.addSet(i, 'warmup'); store.addSet(i); store.addSet(i, 'drop'); b.sets[2].kind = 'failure'; b.sets.forEach((st, si) => fill(exs[i], REPS[i], u, st, KINDS_ORDER[si])); });
    store.save(a); let n = 0; a.exercises.forEach((b, ei) => b.sets.forEach((_, si) => store.toggleDone(ei, si, a.startedAt + 1000 * ++n)));
    const w = store.finishWorkout(a.startedAt + 1000 * ++n)!; await store.flush();
    const volDisp = REPS.reduce((acc, r, i) => acc + (hasWeight(r.metric) && hasReps(r.metric) ? (['normal', 'failure', 'drop'] as SetKind[]).reduce((x, k) => x + multOf(exs[i]) * Math.max(0, Number(loadDisp(r, u, k)) || 0) * REPS_V[k], 0) : 0), 0);
    await renderApp({ saved: JSON.parse(JSON.stringify(S())), url: `/history/${w.id}` }); await flushAll(10);
    expect(screen.getAllByText(new RegExp(`objętość ${Math.round(volDisp)} ${u}$`)).length).toBe(1);
    const cells = (() => { const out: string[] = []; const walk = (x: any) => { if (!x) return; if (typeof x === 'string') { out.push(x); return; } if (Array.isArray(x)) { x.forEach(walk); return; } walk(x.children); }; walk(screen.toJSON()); return out; })();
    for (const mark of ['W', '1', '2F', '3D']) expect([mark, cells.filter(c => c === mark).length]).toEqual([mark, REPS.length]);
    for (const [i, r] of REPS.entries()) { if (!hasWeight(r.metric)) continue;
      for (const k of KINDS_ORDER) { const v = loadDisp(r, u, k); const txt = fmtPl(Number(v) || 0); expect([exs[i].name, k, cells.includes(txt)]).toEqual([exs[i].name, k, true]); } }
  });
});

/* ======================================================================================================================== */
describe('LANGS × THEMES — główne ekrany w każdym języku i motywie', () => {
  /* @matrix LANGS */ /* @matrix THEMES */
  /* Motyw: w Jest Appearance.setColorScheme nie zmienia useColorScheme — odtwarzamy telefon: wybór aplikacji ('light'/'dark')
   * albo — przy 'auto' („Jak w telefonie”, setColorScheme('unspecified')) — tryb systemu. */
  let scheme: 'light' | 'dark' | null = 'light'; let system: 'light' | 'dark' = 'dark';
  beforeAll(() => {
    jest.spyOn(Appearance, 'setColorScheme').mockImplementation(((v: string | null | undefined) => { scheme = v === 'unspecified' || v == null ? system : v as 'light' | 'dark'; }) as never);
    jest.spyOn(RN, 'useColorScheme').mockImplementation((() => scheme) as never);
  });
  afterAll(() => jest.restoreAllMocks());
  const ROUTES: [string, string][] = [
    ['/', 'Pusty trening'], ['/exercises', '+ Nowe'], ['/templates', 'Brak szablonów — dodaj pierwszy.'], ['/history', '+ Dodaj trening wstecz'], ['/more', 'Miejsca i sprzęt'],
    ['/more/settings', 'Dźwięk i wibracja na koniec przerwy'], ['/more/progress', 'Wykresy pojawią się po pierwszym zakończonym treningu.'], ['/more/locations', '+ Dodaj miejsce'],
    ['/more/backup', 'Eksport tworzy plik JSON z całą historią i szablonami — zapisz go w Plikach/iCloud albo wyślij sobie. Import przyjmuje ten sam format, także backup z wersji webowej.'],
    ['/more/language', 'Nazwy ćwiczeń z biblioteki są po angielsku we wszystkich językach poza polskim.'], ['/more/bands', '+ Guma'],
  ];
  const TABS = ['Trening', 'Szablony', 'Ćwiczenia', 'Historia', 'Więcej'];
  /** Polskie teksty, które w innym języku nie mogą zostać na ekranie (wszystkie mają tłumaczenia w słownikach; bez „+ Guma” — „guma” to też
   * słowo czeskie, słowackie i litewskie). */
  const PL_SENTINELS = ['Zacznij z szablonu', 'Ustawienia', 'Pusty trening', 'Postępy', 'Szablony', 'Ćwiczenia', 'Więcej', 'Historia', '+ Dodaj miejsce', '+ Dodaj trening wstecz', 'Dźwięk i wibracja na koniec przerwy', 'Jednostka ciężaru', 'Wygląd'];
  const texts = () => { const out: string[] = []; const walk = (n: any) => { if (!n) return; if (typeof n === 'string') { out.push(n); return; } if (Array.isArray(n)) { n.forEach(walk); return; } walk(n.children); }; walk(screen.toJSON()); return out; };
  const bgs = () => { const out = new Set<string>(); const walk = (n: any) => { if (!n || typeof n === 'string') return; if (Array.isArray(n)) { n.forEach(walk); return; } for (const x of [n.props?.style].flat(9)) if (x && x.backgroundColor) out.add(String(x.backgroundColor)); walk(n.children); }; walk(screen.toJSON()); return out; };
  const palette = (th: ThemeSetting) => (th === 'auto' ? system : th) === 'light' ? light : dark;

  test.each(LANGS.map((l, i) => [l, THEMES[i % THEMES.length]] as const))('%s (motyw %s): każdy ekran przetłumaczony, bez polskich tekstów, w kolorach motywu', async (l, th) => {
    const s = seedState(l); s.settings.language = l; s.settings.theme = th;
    await renderApp({ saved: s }); await flushAll(10);
    expect(lang()).toBe(l); expect(S().settings.language).toBe(l);
    for (const tab of TABS) expect([l, tab, screen.queryAllByText(t(tab)).length > 0]).toEqual([l, tab, true]);
    for (const [route, sentinel] of ROUTES) { await go(route); await flushAll(10); expect([l, route, screen.queryAllByText(t(sentinel)).length > 0]).toEqual([l, route, true]); }
    const all = texts();
    if (l !== 'pl') {
      for (const pl of PL_SENTINELS) expect([l, pl, t(pl) !== pl, all.includes(pl)]).toEqual([l, pl, true, false]);
      /* litery tylko polskie (ł, ś, ź, ż) — żaden tekst ekranu nie powinien ich mieć poza nazwą języka „Polski” */
      expect([l, all.filter(x => /[łśźżŁŚŹŻ]/.test(x))]).toEqual([l, []]);
    }
    const bg = bgs(); const pal = palette(th), other = pal === light ? dark : light;
    expect([l, th, bg.has(pal.bg), bg.has(pal.surface)]).toEqual([l, th, true, true]);
    expect([l, th, [other.bg, other.surface, other.surface2].filter(c => bg.has(c))]).toEqual([l, th, []]);
  });

  /** Stan z danymi: zakończony trening ze wszystkimi reprezentantami metryk (wszystkie typy serii), szablon z nimi i trening w toku. */
  async function richState(l: Lang, th: ThemeSetting) {
    await fresh(); const exs = REPS.map(r => S().exercises.find(e => e.name === r.name)!);
    store.startEmpty(); const a = S().active!; a.startedAt = Date.now() - 7200e3; exs.forEach(ex => store.addExerciseToActive(ex));
    a.exercises.forEach((b, i) => { store.addSet(i, 'warmup'); store.addSet(i); store.addSet(i, 'drop'); b.sets[2].kind = 'failure'; b.sets.forEach((st, si) => fill(exs[i], REPS[i], 'kg', st, KINDS_ORDER[si])); });
    store.save(a); let n = 0; a.exercises.forEach((b, ei) => b.sets.forEach((_, si) => store.toggleDone(ei, si, a.startedAt + 1000 * ++n)));
    const w = store.finishWorkout(a.startedAt + 1000 * ++n)!;
    const tpl = store.newTemplate(); tpl.name = 'Tpl A'; exs.forEach(ex => tpl.items.push({ id: uid(), exerciseId: ex.id, sets: 2, repMin: 6, repMax: 8, restSec: null, startWeight: '', targetSec: '', groupId: null })); store.save(tpl);
    store.startFromTemplate(tpl); store.toggleDone(0, 0);
    const s = JSON.parse(JSON.stringify(S())); s.settings.language = l; s.settings.theme = th; return { s, w, tpl, exs };
  }
  test.each(LANGS.map((l, i) => [l, THEMES[(i + 1) % THEMES.length]] as const))('%s (motyw %s) z danymi: trening w toku, historia, szablon, ćwiczenie każdej metryki, postępy — przetłumaczone', async (l, th) => {
    const { s, w, tpl, exs } = await richState(l, th);
    await renderApp({ saved: s }); await flushAll(10); expect(lang()).toBe(l);
    expect(screen.queryAllByText(t('+ Dodaj ćwiczenie')).length).toBeGreaterThan(0);
    for (const ex of exs) expect([l, ex.name, screen.queryAllByText(exName(ex)).length > 0]).toEqual([l, ex.name, true]);
    await go(`/history/${w.id}`); await flushAll(10); expect([l, 'historia', screen.queryAllByText(t('Edytuj')).length > 0]).toEqual([l, 'historia', true]);
    await go(`/template/${tpl.id}`); await flushAll(10); expect([l, 'szablon', screen.queryAllByDisplayValue('Tpl A').length > 0]).toEqual([l, 'szablon', true]);
    for (const ex of exs) { await go(`/exercise/${ex.id}`); await flushAll(10); expect([l, ex.name, screen.queryAllByText(t('Co logujesz w serii')).length > 0]).toEqual([l, ex.name, true]); }
    await go('/more/progress'); await flushAll(10); await go('/history'); await flushAll(10);
    const all = texts();
    if (l !== 'pl') {
      for (const pl of [...PL_SENTINELS, '+ Dodaj ćwiczenie', 'Poprzednio', 'Co logujesz w serii', 'Edytuj', 'do upadku', 'rozgrzewkowa']) expect([l, pl, all.includes(pl)]).toEqual([l, pl, false]);
      expect([l, all.filter(x => /[łśźżŁŚŹŻ]/.test(x))]).toEqual([l, []]);
    }
    const bg = bgs(); const pal = palette(th), other = pal === light ? dark : light;
    expect([l, th, bg.has(pal.bg), [other.bg, other.surface, other.surface2].filter(c => bg.has(c))]).toEqual([l, th, true, []]);
  });

  test.each(LANGS)('%s: wartości domenowe (partie, grupy, sprzęt, metryki, typy serii, tryby liczenia, regiony) mają wpis w słowniku języka', (l) => {
    const keys = [...MUSCLES, ...GROUPS, ...Object.keys(LOAD_SOURCE_BY_EQUIPMENT), ...Object.values(METRIC_LABEL), ...Object.values(SET_KIND_LABEL), ...Object.values(LOAD_MODE_LABEL), ...Object.values(REGION_LABEL)];
    const d = l === 'pl' ? null : l === 'en' ? EN : LOCALES[l]!;
    expect(d === null || typeof d === 'object').toBe(true);
    if (d) expect([l, keys.filter(k => !Object.prototype.hasOwnProperty.call(d, k) || !String(d[k]).trim())]).toEqual([l, []]);
  });
  test.each(LANGS)('%s: liczby w opisie serii, ciężarze i CSV — separator dziesiętny języka na ekranie, kropka w CSV; typ serii w CSV po tłumaczeniu', async (l) => {
    await fresh(); const ex = S().exercises.find(e => e.name === 'Bench Press (sztanga)')!; doWorkout(ex, { name: ex.name, metric: 'weight_reps', bw: false }, 'kg', KINDS_ORDER);
    applyLang(l); const sep = decimalComma() ? ',' : '.';
    const s = S().workouts[0].exercises[0].sets[2]; expect(store.setSummary(ex, s)).toBe(`62${sep}5×6`);
    const rows = parseCsv(buildCsv()).slice(1); expect(rows[2][5]).toBe('62.5'); expect(rows[2][9]).toBe(t('do upadku')); expect(rows[3][9]).toBe('drop set'); expect(rows[2][3]).toBe(exName(ex)); expect(rows[2][1]).toBe(t('Trening'));
  });

  test.each(THEMES.flatMap(th => (['light', 'dark'] as const).map(sys => [th, sys] as const)))('motyw %s przy telefonie w trybie %s: kolory z właściwej palety na wszystkich ekranach', async (th, sys) => {
    system = sys; const s = seedState('pl'); s.settings.theme = th; s.settings.language = 'pl';
    await renderApp({ saved: s }); await flushAll(10);
    expect(Appearance.setColorScheme).toHaveBeenLastCalledWith(th === 'auto' ? 'unspecified' : th);
    for (const [route] of ROUTES) { await go(route); await flushAll(10); }
    const bg = bgs(); const pal = (th === 'auto' ? sys : th) === 'light' ? light : dark; const other = pal === light ? dark : light;
    expect([bg.has(pal.bg), bg.has(pal.surface)]).toEqual([true, true]);
    expect([other.bg, other.surface, other.surface2].filter(c => bg.has(c))).toEqual([]);
    system = 'dark';
  });
});

/* ======================================================================================================================== */
describe('EQUIPMENT — każda pozycja sprzętu sama w nowym miejscu', () => {
  /* @matrix EQUIPMENT */
  const OPTS_GIVE = (x: EquipItem, ids: string[]) => (x.options ?? []).filter(o => ids.includes(o.id)).flatMap(o => o.gives);
  const IMPL_OF = (x: EquipItem) => x.load === 'cable' && x.id === 'electric' ? 'electric' : x.load;
  /** Opis ciężarów z wartościami (do sprawdzenia doboru ciężarów), w rodzaju domyślnego opisu pozycji. */
  const filled = (spec: LoadSpec): LoadSpec => spec.kind === 'list' ? { ...spec, items: [5, 10, 15, 20].map(w => ({ w, on: true })) } : spec.kind === 'plates' ? { ...spec, plates: [{ w: 5, n: 4 }, { w: 2.5, n: 4 }] } : { ...spec, min: 1, max: 20, step: 1 };

  test('słownik: id unikalne, każda możliwość pozycji i opcji jest znana (CAPABILITIES), etykiety w każdym języku', () => {
    expect(new Set(EQUIPMENT.map(x => x.id)).size).toBe(EQUIPMENT.length);
    const caps = new Set(CAPABILITIES);
    const unknown = EQUIPMENT.flatMap(x => [...x.gives, ...(x.options ?? []).flatMap(o => o.gives), ...(x.secondary ?? [])].filter(c => !caps.has(c)).map(c => `${x.id}:${c}`));
    expect(unknown).toEqual([]);
    for (const x of EQUIPMENT) { expect([x.id, (x.secondary ?? []).every(c => x.gives.includes(c))]).toEqual([x.id, true]); expect([x.id, new Set((x.options ?? []).map(o => o.id)).size]).toEqual([x.id, (x.options ?? []).length]); }
    for (const l of LANGS) { applyLang(l); for (const x of EQUIPMENT) { const n = equipLabel(x); expect([l, x.id, typeof n === 'string' && n.trim().length > 0, l === 'pl' ? n === x.pl : true]).toEqual([l, x.id, true, true]); } }
  });

  test.each(EQUIPMENT.map(x => [x.id, x] as const))('%s: możliwości, opcje, opis ciężarów i dostępność ćwiczeń są spójne', async (id, x) => {
    await fresh(); const l = addLocation('home'); expect(l.equipment).toEqual([]); expect(capsOf(l).size).toBe(0);
    setEquip(l, id, true); const e = equipOf(l, id)!; expect(e).toBeTruthy();
    const defOn = (x.options ?? []).filter(o => o.defaultOn).map(o => o.id); expect([...e.opts].sort()).toEqual([...defOn].sort());
    const capsExp = new Set([...x.gives, ...OPTS_GIVE(x, e.opts)]); expect(capsOf(l)).toEqual(capsExp);
    /* opis ciężarów: tylko sprzęt z ciężarami; domyślny pusty i poprawny (validateSpec), w jednostce aplikacji */
    if (x.load) { expect(e.load).toBeTruthy(); expect(validateSpec(e.load!)).toBeNull(); expect(e.load!.unit).toBe('kg'); expect(e.load!.kind).toBe(x.defaultLoad ?? 'list'); expect(specValues(e.load!)).toEqual(e.load!.kind === 'plates' && e.load!.base > 0 ? [e.load!.base] : [] /* sam gryf to ciężar (tests/locations-loads) */); expect(blankLoad(x, 'lb')!.unit).toBe('lb'); }
    else expect(e.load).toBeUndefined();
    /* dostępność każdego ćwiczenia katalogu = każda grupa wymagań ma możliwość z tego miejsca (liczone niezależnie) */
    const caps = capsOf(l); const bad: string[] = [];
    for (const ex of S().exercises) { const ok = (ex.requires ?? []).every(g => g.some(c => caps.has(c))); const a = availability(ex, l); if (a.ok !== ok || a.missing.length !== (ex.requires ?? []).filter(g => !g.some(c => caps.has(c))).length) bad.push(ex.name); }
    expect(bad).toEqual([]);
    /* przyrząd i ciężary: dobór przyrządu tylko z tej pozycji (rodzaj ciężaru zgodny z loadKindsFor); bez wpisanych ciężarów — brak listy */
    const wrong: string[] = [];
    for (const ex of S().exercises) { const im = implAt(ex, l); const ims = implsAt(ex, l);
      if (im && (!x.load || im !== IMPL_OF(x) || !loadKindsFor(ex).includes(x.load))) wrong.push(`${ex.name}: implAt ${im}`);
      if (ims.some(i => i !== IMPL_OF(x))) wrong.push(`${ex.name}: implsAt ${ims}`);
      if (!specValues(e.load ?? { kind: 'list', unit: 'kg', items: [] }).length && loadsFor(ex, l).kind === 'loads') wrong.push(`${ex.name}: loads bez wpisanych ciężarów`); }
    expect(wrong).toEqual([]);
    if (x.load) {
      setLoad(l, id, filled(e.load!)); expect(validateSpec(activeEquip(l, id)!.load!)).toBeNull();
      const bad2: string[] = [];
      for (const ex of S().exercises) { const im = implAt(ex, l); if (!im) continue; const L = loadsFor(ex, l);
        if (L.kind !== 'loads') { bad2.push(`${ex.name}: ${L.kind}`); continue; }
        if (L.item !== id || !L.loads.length || L.loads.some((v, i) => v <= 0 || (i > 0 && v <= L.loads[i - 1]))) bad2.push(`${ex.name}: ${JSON.stringify(L)}`); }
      expect(bad2).toEqual([]);
    }
    /* każda opcja osobno: włączona dodaje swoje możliwości, wyłączona zabiera (chyba że daje je pozycja albo inna włączona opcja) */
    for (const o of x.options ?? []) {
      setOpt(l, id, o.id, true); for (const c of o.gives) expect([o.id, c, capsOf(l).has(c)]).toEqual([o.id, c, true]);
      setOpt(l, id, o.id, false); const rest = new Set([...x.gives, ...OPTS_GIVE(x, equipOf(l, id)!.opts)]); expect(capsOf(l)).toEqual(rest);
      setOpt(l, id, o.id, defOn.includes(o.id));
    }
    /* odznaczenie: pozycja zostaje z opcjami i ciężarami (off), możliwości znikają; ponowne zaznaczenie przywraca */
    const keep = JSON.stringify({ ...equipOf(l, id) }); setEquip(l, id, false); expect(equipOf(l, id)!.off).toBe(true); expect(capsOf(l).size).toBe(0);
    setEquip(l, id, true); expect(JSON.stringify({ ...equipOf(l, id) })).toBe(keep); expect(capsOf(l)).toEqual(capsExp);
    /* trening w tym miejscu: blok dostaje przyrząd jak implAt */
    const any = S().exercises.find(ex => implAt(ex, l)); store.startEmpty(); expect(S().active!.locationId).toBe(l.id);
    if (any) { store.addExerciseToActive(any); expect(S().active!.exercises[0].impl).toBe(implAt(any, l)); expect(IMPLS).toContain(S().active!.exercises[0].impl); }
    store.cancelWorkout();
  });
});

/* ======================================================================================================================== */
describe('LOCATION_PRESETS — każdy preset miejsca', () => {
  /* @matrix LOCATION_PRESETS */
  test.each(LOCATION_PRESETS.flatMap(p => UNITS.map(u => [p, u] as const)))('%s (%s): poprawne miejsce, sprzęt ze słownika, ciężary w jednostce aplikacji, trening startuje w nim', async (p, u) => {
    await fresh(); setUnit(u); const first = S().settings.locations.length === 0;
    const l = addLocation(p); expect(S().settings.locations).toContain(l); if (first) expect(S().settings.mainLocationId).toBe(l.id);
    expect(l.name).toBe(lbl(LOCATION_PRESET_LABEL[p])); expect(l.id).toMatch(/^[0-9a-f-]{36}$/);
    const ids = l.equipment.map(e => e.item); expect(new Set(ids).size).toBe(ids.length);
    for (const e of l.equipment) { const x = equipById(e.item); expect([e.item, !!x]).toEqual([e.item, true]);
      expect([e.item, e.opts.filter(o => !(x!.options ?? []).some(oo => oo.id === o))]).toEqual([e.item, []]);
      if (x!.load) { expect([e.item, !!e.load, e.load && validateSpec(e.load)]).toEqual([e.item, true, null]); expect([e.item, e.load!.unit]).toEqual([e.item, u]); } else expect([e.item, e.load]).toEqual([e.item, undefined]); }
    expect(presetEquipment(p, u).map(e => e.item)).toEqual(ids);
    expect(presetEquipment(p, 'kg').map(e => e.item)).toEqual(presetEquipment(p, 'lb').map(e => e.item)); /* jednostka zmienia tylko ciężary */
    store.startEmpty(); expect(S().active!.locationId).toBe(l.id); store.cancelWorkout();
    /* ciężary presetu (siłownia, hotel): hantle dostępne dla wyciskania hantlami */
    if (p === 'gym' || p === 'hotel') { const L = loadsFor(S().exercises.find(e => e.name === 'Bench Press (hantle)')!, l); expect(L.kind).toBe('loads'); }
  });
  test('presety są zagnieżdżone: dom ⊂ masa ciała ⊂ hotel ⊂ siłownia (możliwości i dostępne ćwiczenia)', async () => {
    await fresh(); const capsP = Object.fromEntries(LOCATION_PRESETS.map(p => [p, capsOf({ equipment: presetEquipment(p) } as never)])) as Record<string, Set<string>>;
    const sub = (a: Set<string>, b: Set<string>) => [...a].filter(c => !b.has(c));
    expect(sub(capsP.home, capsP.bodyweight)).toEqual([]); expect(sub(capsP.bodyweight, capsP.hotel)).toEqual([]); expect(sub(capsP.hotel, capsP.gym)).toEqual([]);
    const avail = (p: string) => S().exercises.filter(e => availability(e, null, capsP[p]).ok).length;
    expect(avail('home')).toBeLessThanOrEqual(avail('bodyweight')); expect(avail('bodyweight')).toBeLessThanOrEqual(avail('hotel')); expect(avail('hotel')).toBeLessThanOrEqual(avail('gym'));
    expect(avail('gym')).toBeGreaterThan(avail('home'));
  });
});

/* ======================================================================================================================== */
describe('LOAD_PRESETS — każdy preset modelu ciężarów', () => {
  /* @matrix LOAD_PRESETS */
  test.each(LOAD_PRESETS.map(p => [p.id, p] as const))('%s: poprawny opis dla swojej pozycji, opcje i ciężary w treningu', async (id, p) => {
    const x = equipById(p.item)!; expect(x).toBeTruthy(); expect(x.load).toBeTruthy();
    const spec = p.spec(); expect(validateSpec(spec)).toBeNull(); expect(spec.kind).toBe(x.defaultLoad ?? 'list'); expect(specValues(spec).length).toBeGreaterThan(0);
    expect(p.spec()).not.toBe(spec); expect(p.spec()).toEqual(spec); /* świeży obiekt — edytor mutuje opis */
    for (const o of p.optsOff ?? []) expect((x.options ?? []).map(oo => oo.id)).toContain(o);
    for (const l of LANGS) { applyLang(l); expect(lbl(p.label).trim().length).toBeGreaterThan(0); } applyLang('pl');
    await fresh(); const l = addLocation('home'); setEquip(l, p.item, true); const e = activeEquip(l, p.item)!;
    applyLoadPreset(e, p); store.save(); expect(e.load).toEqual(spec); for (const o of p.optsOff ?? []) expect(e.opts).not.toContain(o);
    const exs = S().exercises.filter(ex => implAt(ex, l)); expect(exs.length).toBeGreaterThan(0);
    for (const ex of exs) { const L = loadsFor(ex, l); expect([ex.name, L.kind]).toEqual([ex.name, 'loads']);
      if (L.kind === 'loads') { expect(L.item).toBe(p.item); if (spec.kind === 'electric') { const lo = spec.unit === 'lb' ? spec.min * KG_PER_LB : spec.min, hi = spec.unit === 'lb' ? spec.max * KG_PER_LB : spec.max; expect([ex.name, L.loads[0] >= lo - 0.06, L.loads[L.loads.length - 1] <= hi + 0.06]).toEqual([ex.name, true, true]); } } }
  });
  test.each(LOAD_PRESETS.flatMap(p => UNITS.map(u => [p.id, u, p] as const)))('%s w aplikacji w %s: ciężary na ekranie = wartości modelu (ta sama jednostka — dokładnie; inna — w jednostce modelu bez straty)', async (id, u, p) => {
    await fresh(); setUnit(u); const l = addLocation('home'); setEquip(l, p.item, true); const e = activeEquip(l, p.item)!; applyLoadPreset(e, p); store.save();
    const ex = S().exercises.find(x => implAt(x, l) && (x.loadMode === 'total' || p.spec().kind === 'electric') && (x.implements ?? 1) === 1)
      ?? S().exercises.find(x => implAt(x, l))!;
    const L = loadsFor(ex, l); expect(L.kind).toBe('loads'); if (L.kind !== 'loads') return;
    const spec = p.spec(); const shown = L.loads.map(wOut);
    if (spec.kind !== 'plates') {
      const vals = specValues(spec); const exp = spec.unit === u ? vals : vals.map(v => u === 'lb' ? Math.round(v / KG_PER_LB * 10) / 10 : Math.round(v * KG_PER_LB * 100) / 100);
      if (spec.unit === u) expect([ex.name, shown]).toEqual([ex.name, exp]);
      else if (spec.unit === 'lb') expect(L.loads.map(kg => Math.round(kg / KG_PER_LB * 10) / 10)).toEqual(vals); /* model w lb: kg „okrągłe” (snapLb), ale w lb dokładnie wartości urządzenia */
      else shown.forEach((v, i) => expect(Math.abs(v - exp[i])).toBeLessThanOrEqual(0.1 + 1e-9));
    } else expect(shown.every(v => v > 0)).toBe(true);
  });
});

/* ======================================================================================================================== */
describe('katalog — każde ćwiczenie ze świeżego stanu', () => {
  /* @matrix katalog */
  const KNOWN_CAPS = new Set(EQUIPMENT.flatMap(x => [...x.gives, ...(x.options ?? []).flatMap(o => o.gives)]));
  test('metryka ∈ METRICS, partie ⊂ MUSCLES, wymagania i zalecenia — możliwości, które daje jakiś sprzęt', () => {
    const bad: string[] = [];
    for (const e of CATALOG0) {
      if (!(METRICS as readonly string[]).includes(e.metric)) bad.push(`${e.name}: metryka ${e.metric}`);
      for (const mu of [...e.muscles, ...e.secondaryMuscles]) if (!(MUSCLES as readonly string[]).includes(mu)) bad.push(`${e.name}: partia ${mu}`);
      if (e.muscles.some(mu => e.secondaryMuscles.includes(mu))) bad.push(`${e.name}: partia główna i pomocnicza naraz`);
      for (const c of [...(e.requires ?? []).flat(), ...(e.recommended ?? [])]) if (!KNOWN_CAPS.has(c)) bad.push(`${e.name}: możliwość ${c}`);
      if ((e.requires ?? []).some(g => !g.length)) bad.push(`${e.name}: pusta grupa wymagań`);
    }
    expect(bad).toEqual([]);
  });
  test('każda możliwość z wymagań ćwiczeń ma nazwę do dopisku „brak: …”', () => {
    const caps = new Set(CATALOG0.flatMap(e => (e.requires ?? []).flat())); expect([...caps].filter(c => !CAP_LABEL[c])).toEqual([]);
  });
  test('MUSCLES: każda partia jest główną partią co najmniej jednego ćwiczenia', () => {
    /* @matrix MUSCLES */
    for (const mu of MUSCLES) expect([mu, CATALOG0.some(e => e.muscles.includes(mu))]).toEqual([mu, true]);
  });
  test('nazwa każdego ćwiczenia w każdym języku: po polsku — kanoniczna, w innych bez polskich słów i liter, unikalna', () => {
    const bad: string[] = [];
    for (const l of LANGS) { applyLang(l); const names = CATALOG0.map(e => exName(e));
      if (l === 'pl') names.forEach((n, i) => { if (n !== CATALOG0[i].name) bad.push(`pl: ${n}`); });
      else names.forEach(n => { if (/[ąćęłńóśźżĄĆĘŁŃÓŚŹŻ]|\((sztanga|hantle|hantel|linki|linka|ławka|bieżnia|dwie linki|stojąc|siedząc)[)/]/.test(n)) bad.push(`${l}: ${n}`); });
      if (new Set(names.map(n => n.toLowerCase())).size !== names.length) bad.push(`${l}: nazwy nieunikalne`); }
    applyLang('pl'); expect(bad).toEqual([]);
  });
  test('guma: ćwiczenie z asystą gumą jest ćwiczeniem z masą ciała; ćwiczenie wymagające/zalecające gumy ma pole gumy (usesBand)', () => {
    const bad: string[] = [];
    for (const e of CATALOG0) {
      const needs = (e.requires ?? []).some(g => g.includes('bands')) || (e.recommended ?? []).includes('bands');
      if (e.bandAssistable && !isBWx(e)) bad.push(`${e.name}: asysta gumą bez masy ciała`);
      if (store.usesBand(e) !== (e.bandAssistable || needs)) bad.push(`${e.name}: usesBand`);
      if ((e.requires ?? []).some(g => g.length === 1 && g[0] === 'bands') && e.bandAssistable) bad.push(`${e.name}: guma wymagana i asysta naraz`);
    }
    expect(bad).toEqual([]);
  });
  test('każde ćwiczenie: do szablonu → trening z szablonu → wartości wg metryki → zapis → historia, statystyki i kopia', async () => {
    await fresh(); const all = S().exercises.filter(e => !e.archived); expect(all.length).toBe(CATALOG0.length);
    const tpl: Template = store.newTemplate(); for (const ex of all) tpl.items.push({ id: uid(), exerciseId: ex.id, sets: 2, repMin: null, repMax: null, restSec: null, startWeight: '', targetSec: '', groupId: null }); store.save(tpl);
    store.startFromTemplate(tpl); const a = S().active!; expect(a.exercises.map(e => e.exerciseId)).toEqual(all.map(e => e.id));
    a.exercises.forEach((b, i) => { const ex = all[i]; const r: Rep = { name: ex.name, metric: ex.metric, bw: isBWx(ex) }; b.sets.forEach((s, si) => fill(ex, r, 'kg', s, si ? 'failure' : 'normal')); });
    store.save(a); const t0 = Date.now() - 3600e3; let n = 0; a.exercises.forEach((b, ei) => b.sets.forEach((_, si) => store.toggleDone(ei, si, t0 + n++ * 1000)));
    const w = store.finishWorkout()!; expect(w.exercises).toHaveLength(all.length);
    const bad: string[] = [];
    w.exercises.forEach((b, i) => { const ex = all[i]; if (b.sets.length !== 2 || !b.sets.every(s => store.setHasResult(ex, s))) bad.push(`${ex.name}: serie`);
      if (stats.sessionsFor(ex).length !== 1) bad.push(`${ex.name}: sesje`); if (!stats.hasHistory(ex.id)) bad.push(`${ex.name}: historia`);
      const sum = store.setSummary(ex, b.sets[0]); if (sum !== expSummary({ name: ex.name, metric: ex.metric, bw: isBWx(ex) }, 'kg', 'normal')) bad.push(`${ex.name}: opis ${sum}`); });
    expect(bad).toEqual([]);
    expect(stats.weeklyTotals(1)[0].sets).toBe(2 * all.length);
    expect(parseCsv(buildCsv()).length - 1).toBe(2 * all.length);
    const back = parseBackup(JSON.stringify(buildBackup())); expect(back.workouts).toEqual(JSON.parse(JSON.stringify(S().workouts))); expect(back.templates).toEqual(JSON.parse(JSON.stringify(S().templates)));
    expect(back.exercises.map(e => [e.name, e.metric, e.muscles, e.requires])).toEqual(S().exercises.map(e => [e.name, e.metric, e.muscles, e.requires]));
  });
  test('miejsce ze WSZYSTKIM sprzętem i wszystkimi opcjami: każde ćwiczenie dostępne; ćwiczenie z rodzajem ciężaru ma przyrząd; z wpisanymi ciężarami — lista ciężarów', async () => {
    await fresh(); const l = addLocation('home'); l.equipment = EQUIPMENT.map(x => equipEntry(x.id, 'kg', true)); store.save();
    const caps = capsOf(l); expect([...caps].sort()).toEqual([...KNOWN_CAPS].sort());
    expect(S().exercises.filter(e => !availability(e, l, caps).ok).map(e => e.name)).toEqual([]);
    expect(S().exercises.filter(e => loadKindsFor(e).length && !implAt(e, l)).map(e => e.name)).toEqual([]);
    for (const e of l.equipment) if (e.load) e.load = e.load.kind === 'list' ? { ...e.load, items: [5, 10, 20].map(w => ({ w, on: true })) } : e.load.kind === 'plates' ? { ...e.load, plates: [{ w: 5, n: 4 }] } : { ...e.load, min: 1, max: 20, step: 1 };
    store.save(); expect(S().exercises.filter(e => loadKindsFor(e).length && loadsFor(e, l).kind !== 'loads').map(e => e.name)).toEqual([]);
    expect(S().exercises.filter(e => !loadKindsFor(e).length && implAt(e, l)).map(e => e.name)).toEqual([]); /* masa ciała / bez obciążenia — bez przyrządu */
  });
  test('świeży stan w każdym języku ma ten sam katalog (nazwy kanoniczne, metryki, partie, wymagania)', () => {
    const ref = JSON.stringify(CATALOG0.map(e => [e.name, e.metric, e.loadMode, e.muscles, e.secondaryMuscles, e.requires, e.recommended, e.bandAssistable]));
    for (const l of LANGS) expect([l, JSON.stringify(seedState(l).exercises.map(e => [e.name, e.metric, e.loadMode, e.muscles, e.secondaryMuscles, e.requires, e.recommended, e.bandAssistable]))]).toEqual([l, ref]);
    for (const l of LANGS) for (const b of seedState(l).bands) expect([l, b.color, tIn(l, b.color) === b.color]).toEqual([l, b.color, true]);
  });
});

/* ======================================================================================================================== */
describe('MUSCLES — serie i objętość per partia tygodniowo', () => {
  /* @matrix MUSCLES */
  test.each(UNITS)('trening dotykający każdej partii (%s): weeklySetsByMuscle i weeklyVolumeByMuscle = przeliczenie ręczne', async (u) => {
    await fresh(); setUnit(u);
    /* dla każdej partii ćwiczenie z ciężarem i powtórzeniami (nie masa ciała), w którym jest partią główną */
    const picks = MUSCLES.map(mu => S().exercises.find(e => e.muscles.includes(mu) && e.metric === 'weight_reps' && !isBWx(e)) ?? S().exercises.find(e => e.muscles.includes(mu))!);
    expect(picks.every(Boolean)).toBe(true);
    store.startEmpty(); picks.forEach(ex => store.addExerciseToActive(ex)); const a = S().active!;
    a.exercises.forEach((b, i) => { const ex = picks[i]; const r: Rep = { name: ex.name, metric: ex.metric, bw: isBWx(ex) };
      store.addSet(i); store.addSet(i, 'warmup'); b.sets.forEach((s, si) => fill(ex, r, u, s, si === 0 ? 'warmup' : si === 1 ? 'normal' : 'failure')); });
    store.save(a); const t0 = Date.now() - 3600e3; let n = 0; a.exercises.forEach((b, ei) => b.sets.forEach((_, si) => store.toggleDone(ei, si, t0 + n++ * 1000)));
    const w = store.finishWorkout()!;
    const expSets: Record<string, number> = {}; const expVol: Record<string, number> = {}; const add = (o: Record<string, number>, k: string, v: number) => { o[k] = (o[k] ?? 0) + v; };
    const toKg = u === 'lb' ? KG_PER_LB : 1;
    picks.forEach(ex => { const r: Rep = { name: ex.name, metric: ex.metric, bw: isBWx(ex) };
      const v = hasWeight(ex.metric) && hasReps(ex.metric) ? (['normal', 'failure'] as SetKind[]).reduce((acc, k) => acc + multOf(ex) * Math.max(0, Number(loadDisp(r, u, k)) || 0) * REPS_V[k], 0) * toKg : 0;
      ex.muscles.forEach(mu => { add(expSets, mu, 2); if (v) add(expVol, mu, v); }); ex.secondaryMuscles.forEach(mu => { add(expSets, mu, 1); if (v) add(expVol, mu, v / 2); }); });
    const mon = stats.thisMonday(); const gotS = stats.weeklySetsByMuscle(mon); const gotV = stats.weeklyVolumeByMuscle(mon);
    expect(gotS).toEqual(expSets); for (const mu of MUSCLES) expect([mu, (gotS[mu] ?? 0) >= 2]).toEqual([mu, true]);
    expect(Object.keys(gotV).sort()).toEqual(Object.keys(expVol).sort()); for (const k of Object.keys(expVol)) expect([k, gotV[k]]).toEqual([k, expect.closeTo(expVol[k], 6)]);
    /* suma po partiach = Σ objętość ćwiczenia × (liczba partii głównych + 0,5 × pomocniczych); poprzedni tydzień pusty */
    expect(stats.weeklySetsByMuscle(stats.thisMonday(-1))).toEqual({}); expect(stats.weeklyVolumeByMuscle(stats.thisMonday(-1))).toEqual({});
    const totalPrimary = picks.reduce((acc, ex, i) => acc + w.exercises[i].sets.reduce((b, s) => b + store.setVolume(ex, s, w.exercises[i].impl), 0) * ex.muscles.length, 0);
    const sumPrimary = Object.values(gotV).reduce((x, y) => x + y, 0) - picks.reduce((acc, ex, i) => acc + w.exercises[i].sets.reduce((b, s) => b + store.setVolume(ex, s, w.exercises[i].impl), 0) * ex.secondaryMuscles.length * 0.5, 0);
    expect(sumPrimary).toBeCloseTo(totalPrimary, 6);
    expect(Object.values(gotS).reduce((x, y) => x + y, 0)).toBe(picks.reduce((acc, ex) => acc + 2 * ex.muscles.length + ex.secondaryMuscles.length, 0));
  });
});
