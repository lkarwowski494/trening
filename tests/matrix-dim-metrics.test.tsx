/* Macierz wymiarów — część „metrics” (z podziału tests/matrix-dimensions.test.tsx, 06.10.2026; opis i pomocnicze: tests/matrix-shared.tsx). */
/* eslint-disable @typescript-eslint/no-unused-vars */
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
import { UNITS, THEMES, S, CATALOG0, isBWx, multOf, epley, fmtPl, secTxt, distTxt, setUnit, parseCsv, VALS, valsOf, Rep, REPS, KINDS_ORDER, W_DISP, ADD_DISP, REPS_V, TIME_V, DIST_V, loadDisp, fill, doWorkout, expSummary } from './matrix-shared';

jest.setTimeout(180000);

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
  test.each(UNITS)('%s: objętość sesji, wartości serii i oznaczenia typów (W, 1, 2F, 2D — audyt 0.10 LIVE-14: drop z numerem swojej serii) dla każdej metryki', async (u) => {
    await fresh(); setUnit(u); const exs = REPS.map(r => S().exercises.find(e => e.name === r.name)!);
    store.startEmpty(); const a = S().active!; a.startedAt = Date.now() - 3600e3; exs.forEach(ex => store.addExerciseToActive(ex));
    a.exercises.forEach((b, i) => { store.addSet(i, 'warmup'); store.addSet(i); store.addSet(i, 'drop'); b.sets[2].kind = 'failure'; b.sets.forEach((st, si) => fill(exs[i], REPS[i], u, st, KINDS_ORDER[si])); });
    store.save(a); let n = 0; a.exercises.forEach((b, ei) => b.sets.forEach((_, si) => store.toggleDone(ei, si, a.startedAt + 1000 * ++n)));
    const w = store.finishWorkout(a.startedAt + 1000 * ++n)!; await store.flush();
    const volDisp = REPS.reduce((acc, r, i) => acc + (hasWeight(r.metric) && hasReps(r.metric) ? (['normal', 'failure', 'drop'] as SetKind[]).reduce((x, k) => x + multOf(exs[i]) * Math.max(0, Number(loadDisp(r, u, k)) || 0) * REPS_V[k], 0) : 0), 0);
    await renderApp({ saved: JSON.parse(JSON.stringify(S())), url: `/history/${w.id}` }); await flushAll(10);
    expect(screen.getAllByText(new RegExp(`objętość ${Math.round(volDisp)} ${u}$`)).length).toBe(1);
    const cells = (() => { const out: string[] = []; const walk = (x: any) => { if (!x) return; if (typeof x === 'string') { out.push(x); return; } if (Array.isArray(x)) { x.forEach(walk); return; } if (x.props?.testID === 'week-tiles') return; /* kafelki dashboardu na zakładce Trening (08.10.2026) — inny ekran */ walk(x.children); }; walk(screen.toJSON()); return out; })();
    for (const mark of ['W', '1', '2F', '2D']) expect([mark, cells.filter(c => c === mark).length]).toEqual([mark, REPS.length]);
    for (const [i, r] of REPS.entries()) { if (!hasWeight(r.metric)) continue;
      for (const k of KINDS_ORDER) { const v = loadDisp(r, u, k); const txt = fmtPl(Number(v) || 0); expect([exs[i].name, k, cells.includes(txt)]).toEqual([exs[i].name, k, true]); } }
  });
});

/* ======================================================================================================================== */
