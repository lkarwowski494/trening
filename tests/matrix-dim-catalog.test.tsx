/* Macierz wymiarów — część „catalog” (z podziału tests/matrix-dimensions.test.tsx, 06.10.2026; opis i pomocnicze: tests/matrix-shared.tsx). */
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

