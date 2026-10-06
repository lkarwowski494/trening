/* Macierz wymiarów — część „equipment” (z podziału tests/matrix-dimensions.test.tsx, 06.10.2026; opis i pomocnicze: tests/matrix-shared.tsx). */
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
