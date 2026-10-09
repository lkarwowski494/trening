/*
 * Cel „Ogólny” w generatorze (decyzja właściciela 09.10.2026 wieczór, docs/18; podstawy: docs/research/30-cel-ogolny.md) — logika i wyrocznie.
 * Rodzaje (docs/20): logika (stałe w jednym miejscu, podział 1–6 dni, przełącznik cardio, granice 3/4 dni), wyrocznie (dni == wybrane, dni siłowe,
 * sesje cardio i minuty, serie, powtórzenia, przerwy, liczba ćwiczeń z budżetu, serie i dni na partię liczone niezależnie, pokrycie partii, pary
 * dzień po dniu minimalne po wszystkich permutacjach, ostrzeżenia), niezmienniki (flaga cardio nie zmienia innych celów), dane (zapis → restart),
 * EN. Ekran: tests/gen-general-ui.test.tsx; E2E: .maestro/14-generator.yaml.
 */
import * as store from '@/lib/store';
import * as plan from '@/lib/plan';
import { addLocation } from '@/lib/locations';
import { LOCATION_PRESETS } from '@/lib/equipment';
import {
  generate, genProposal, genCount, genPlanName, genNote, saveGenerated, previewWarnings, splitFor, cardioCount, cardioSwitch, setsFor, setsBudget, goalLabel,
  GOALS, GEN_SESSIONS, GEN_MINUTES, MAJOR, MIN_DAYS, MIN_EXERCISES, SECONDARY_SHARE, REPS, REST, AVG_REST, SETS_PER_EX, WARMUP_MIN, SET_WORK_SEC,
  GENERAL_SETS, GENERAL_SETS_RANGE, GENERAL_LIFT_MAX, GENERAL_CARDIO_FROM, type GenInput, type GenResult, type Goal,
} from '@/lib/generator';
import { applyLang } from '@/lib/i18n';
import { fresh, saved } from './helpers';

jest.setTimeout(240000);
const S = () => store.getState();
const ex = (id: string) => store.exById(id)!;
const inp = (o: Partial<GenInput> = {}): GenInput => ({ goal: 'general', locationId: null, sessions: 3, minutes: 60, ...o });
beforeEach(async () => { jest.useFakeTimers({ now: new Date(2026, 9, 8, 9).getTime() }); await fresh(); });
afterEach(() => { applyLang('pl'); jest.useRealTimers(); });

const combos = (k: number): number[][] => { const out: number[][] = []; for (let m = 0; m < 128; m++) { const ds = [0, 1, 2, 3, 4, 5, 6].filter(d => (m >> d) & 1); if (ds.length === k) out.push(ds); } return out; };
const permsOf = <T,>(a: T[]): T[][] => (a.length <= 1 ? [a] : a.flatMap((x, i) => permsOf([...a.slice(0, i), ...a.slice(i + 1)]).map(p => [x, ...p])));
const on = (days: (unknown | null)[]) => days.flatMap((x, d) => (x == null ? [] : [d]));
const shares = (a: Set<string>, b: Set<string>) => [...a].some(m => b.has(m));
const pairsOf = (prim: (d: number) => Set<string>) => { const out: [number, number][] = []; for (let d = 0; d < 7; d++) if (shares(prim(d), prim((d + 1) % 7))) out.push([d, (d + 1) % 7]); return out; };
/** Oczekiwana liczba sesji cardio — niezależnie od lib: przełącznik i co najmniej 4 dni → dni powyżej 3. */
const expCardio = (n: number, cardio: boolean) => (cardio && n >= 4 ? n - 3 : 0);
const ONEDAY_GENERAL = '1 dzień siłowy w tygodniu to mniej niż zalecenie WHO 2020 (co najmniej 2 dni). Na początek to dobry krok: wytyczne USA 2018 radzą zacząć od 1 dnia i z czasem dojść do 2 — trochę ruchu jest lepsze niż żaden.';

/** Wspólna wyrocznia jednego wyniku celu „Ogólny” (liczona niezależnie od lib, poza budżetem serii — wzór sprawdzany osobno). */
function oracle(i: GenInput, r: GenResult, n: number) {
  const where = JSON.stringify(i); const cardio = expCardio(n, !!i.cardio); const lift = n - cardio;
  const cardioDays = r.days.filter(ti => ti != null && r.templates[ti].key === 'cardio').length;
  expect([where, cardioDays, r.cardioMin, r.liftDays]).toEqual([where, cardio, cardio * i.minutes, lift]);
  /* podział: 1–3 dni siłowe — pełne FBW (ta sama sesja), 4–6 — góra/dół jak masa */
  const liftKeys = r.days.filter((ti): ti is number => ti != null && r.templates[ti].key !== 'cardio').map(ti => r.templates[ti].key);
  if (lift <= 3) expect([where, liftKeys]).toEqual([where, Array(lift).fill('fbw')]);
  else expect([where, [...liftKeys].sort()]).toEqual([where, generate({ ...i, goal: 'hypertrophy', cardio: undefined, days: undefined, sessions: lift }).days.filter((ti): ti is number => ti != null).map(ti => generate({ ...i, goal: 'hypertrophy', cardio: undefined, days: undefined, sessions: lift }).templates[ti].key).sort()]);
  /* serie, powtórzenia, przerwy: 2 serie; 8–12 (dom: 12–20); bez boju 4–6; wielostawowe 120 s, jednostawowe i core 90 s */
  const budget = Math.floor(((i.minutes - 10) * 60) / (40 + 105)); expect([where, r.budget, r.avgRest]).toEqual([where, budget, 105]);
  for (const tp of r.templates) {
    if (tp.key === 'cardio') { const e = ex(tp.items[0].exerciseId); expect([where, tp.items.length, e.pattern, e.loadSource, tp.items[0].targetSec]).toEqual([where, 1, 'cardio', 'none', i.minutes * 60]); continue; }
    expect([where, tp.key, tp.items.length <= Math.max(3, Math.floor(budget / 2))]).toEqual([where, tp.key, true]);
    for (const it of tp.items) {
      const e = ex(it.exerciseId); const isoOrCore = e.pattern === 'isolation' || (e.muscles[0] === 'core' && !!e.pattern?.startsWith('core'));
      expect([where, e.name, it.sets, [it.repMin, it.repMax], it.restSec]).toEqual([where, e.name, 2, r.home ? [12, 20] : [8, 12], isoOrCore ? 90 : 120]);
    }
  }
  /* serie i dni na partię, braki, rzadziej niż 2 dni — niezależnie; kreska 10 serii nie dotyczy celu „Ogólny” */
  const ws: Record<string, number> = {}; const fq: Record<string, number> = {};
  r.days.forEach(ti => { if (ti == null) return; const its = r.templates[ti].items.filter(it => !it.targetSec); const pri = new Set<string>(), sec = new Set<string>();
    for (const it of its) { const e = ex(it.exerciseId); e.muscles.forEach(m => { ws[m] = (ws[m] ?? 0) + it.sets; pri.add(m); }); e.secondaryMuscles.forEach(m => { ws[m] = (ws[m] ?? 0) + it.sets * 0.5; sec.add(m); }); }
    new Set([...pri, ...sec]).forEach(m => { fq[m] = (fq[m] ?? 0) + (pri.has(m) ? 1 : 0.5); }); });
  expect([where, r.weeklySets, r.freq, r.below10]).toEqual([where, ws, fq, []]);
  expect([where, r.missing, r.rare]).toEqual([where, MAJOR.filter(m => !(ws[m] > 0)), MAJOR.filter(m => ws[m] > 0 && (fq[m] ?? 0) < 2)]);
  const prim = (d: number) => { const ti = r.days[d]; return new Set(ti == null ? [] : r.templates[ti].items.filter(it => !it.targetSec).flatMap(it => ex(it.exerciseId).muscles)); };
  expect([where, r.backToBack]).toEqual([where, pairsOf(prim)]);
  /* ostrzeżenia: bez „unloaded”, „loadcap”, „below” (siła / masa); „oneday” z tekstem dla zdrowia */
  const w = previewWarnings(r, i); const kinds = w.map(x => x.kind);
  expect([where, kinds]).toEqual([where, [r.missing.length ? 'missing' : '', r.rare.length ? 'rare' : '', lift === 1 ? 'oneday' : '', r.backToBack.length ? 'pairs' : ''].filter(Boolean)]);
  if (lift === 1) expect([where, w.find(x => x.kind === 'oneday')!.text]).toEqual([where, ONEDAY_GENERAL]);
}

describe('cel „Ogólny” — stałe, podział, przełącznik', () => {
  test('stałe w jednym miejscu: 2 serie (część wspólna źródeł 2–3), najwyżej 3 dni siłowe z przełącznikiem, przełącznik od 4 dni, 1–6 dni, przerwy jak masa', () => {
    expect([GENERAL_SETS_RANGE, GENERAL_SETS, GENERAL_LIFT_MAX, GENERAL_CARDIO_FROM, AVG_REST.general, GEN_SESSIONS.general]).toEqual([[2, 3], 2, 3, 4, 105, [1, 2, 3, 4, 5, 6]]);
    expect(GOALS).toEqual(['strength', 'hypertrophy', 'cut', 'general']);
    expect(GOALS.map(setsFor)).toEqual([SETS_PER_EX, SETS_PER_EX, SETS_PER_EX, 2]);
    expect(setsBudget('general', 60)).toBe(Math.floor(((60 - WARMUP_MIN) * 60) / (SET_WORK_SEC + 105)));
    expect(GOALS.map(goalLabel)).toEqual(['Siła', 'Masa', 'Redukcja', 'Ogólny']); applyLang('en'); expect(goalLabel('general')).toBe('General fitness');
  });
  test('cardioCount i cardioSwitch: „Ogólny” — 0 bez przełącznika; z przełącznikiem 4/5/6 dni → 1/2/3 cardio, 1–3 dni → 0; inne cele pomijają przełącznik', () => {
    const ns = [1, 2, 3, 4, 5, 6];
    expect(ns.map(n => cardioCount('general', n))).toEqual([0, 0, 0, 0, 0, 0]); expect(ns.map(n => cardioCount('general', n, false))).toEqual([0, 0, 0, 0, 0, 0]);
    expect(ns.map(n => cardioCount('general', n, true))).toEqual([0, 0, 0, 1, 2, 3]);
    for (const g of ['strength', 'hypertrophy', 'cut'] as Goal[]) expect([g, ns.map(n => cardioCount(g, n, true))]).toEqual([g, ns.map(n => cardioCount(g, n))]);
    expect(ns.map(n => cardioSwitch('general', n))).toEqual([false, false, false, true, true, true]);
    for (const g of ['strength', 'hypertrophy', 'cut'] as Goal[]) expect([g, ns.map(n => cardioSwitch(g, n))]).toEqual([g, ns.map(() => false)]);
  });
  test('splitFor: 1–3 dni — pełne FBW na każdy dzień; 4–6 — jak masa; z przełącznikiem — 3 × FBW + cardio', () => {
    expect([1, 2, 3].map(n => splitFor('general', n).keys)).toEqual([['fbw'], ['fbw', 'fbw'], ['fbw', 'fbw', 'fbw']]);
    for (const n of [4, 5, 6]) { expect([n, splitFor('general', n).keys]).toEqual([n, splitFor('hypertrophy', n).keys]); expect([n, splitFor('general', n, true).keys]).toEqual([n, [...Array(3).fill('fbw'), ...Array(n - 3).fill('cardio')]]); }
    expect([1, 2, 3].map(n => splitFor('general', n, true).keys)).toEqual([1, 2, 3].map(n => splitFor('general', n).keys));
  });
  test('flaga cardio nie zmienia wyniku innych celów (siła, masa, redukcja × 1–6 dni)', () => {
    for (const goal of ['strength', 'hypertrophy', 'cut'] as Goal[]) for (const sessions of GEN_SESSIONS[goal]) expect([goal, sessions, generate({ ...inp({ goal, sessions }), cardio: true })]).toEqual([goal, sessions, generate(inp({ goal, sessions }))]);
  });
});

describe('cel „Ogólny” — wyrocznie', () => {
  test('każdy wybór dni (1–6 z 7) × przełącznik: dni == wybrane, dni siłowe, cardio i minuty, serie, powtórzenia, przerwy, partie, ostrzeżenia; pary minimalne po permutacjach', () => {
    let cases = 0, withCardio = 0, perm = 0;
    for (const n of GEN_SESSIONS.general) for (const ds of combos(n)) for (const cardio of [false, true]) {
      const i = inp({ days: ds, sessions: 2, cardio }); const r = generate(i); const where = JSON.stringify(i);
      expect([where, on(r.days), genCount(i)]).toEqual([where, ds, n]);
      oracle(i, r, n); if (expCardio(n, cardio)) withCardio++;
      const primT = (ti: number | null) => new Set(ti == null ? [] : r.templates[ti].items.filter(it => !it.targetSec).flatMap(it => ex(it.exerciseId).muscles));
      let min = Infinity; for (const p of permsOf(ds.map(d => r.days[d]!))) { const m = new Map(ds.map((d, j) => [d, p[j]])); min = Math.min(min, pairsOf(d => primT(m.get(d) ?? null)).length); perm++; }
      expect([where, r.backToBack.length]).toEqual([where, min]); /* FBW nie dzień po dniu, gdy się da; cardio w dni między nimi */
      cases++;
    }
    expect(cases).toBe(126 * 2); expect(withCardio).toBe(35 + 21 + 7); expect(perm).toBeGreaterThan(1000);
  });
  test('każde miejsce × czas × liczba dni × przełącznik (bez wyboru dni): wyrocznia; dom — 12–20 jak masa; pełna siłownia 60/90 min — każda partia co najmniej 2 dni od 2 dni', () => {
    const locs: (string | null)[] = [null, ...LOCATION_PRESETS.map(p => addLocation(p).id)]; let n = 0;
    for (const locationId of locs) for (const minutes of GEN_MINUTES) for (const sessions of GEN_SESSIONS.general) for (const cardio of [false, true]) {
      const i = inp({ locationId, minutes, sessions, cardio }); const r = generate(i); oracle(i, r, sessions); n++;
      expect([JSON.stringify(i), r.home]).toEqual([JSON.stringify(i), generate({ ...i, goal: 'hypertrophy' }).home]); /* ta sama reguła domu co przy masie */
      if (locationId === null && minutes >= 60 && sessions >= 2) expect([JSON.stringify(i), r.missing, r.rare]).toEqual([JSON.stringify(i), [], []]); /* WHO 2020: każda główna partia ≥ 2 dni */
    }
    expect(n).toBe(locs.length * 3 * 6 * 2);
  });
  test('1 dzień: pełne FBW ze wszystkimi głównymi partiami (60/90 min), ostrzeżenie dla zdrowia (WHO/PAG), bez „utrzymania”; pozostałe dni — bez niego', () => {
    for (const minutes of [60, 90]) { const r = generate(inp({ minutes, days: [2] })); expect(new Set(r.templates[0].items.flatMap(it => ex(it.exerciseId).muscles)).size).toBeGreaterThan(0);
      expect([minutes, MAJOR.filter(m => !r.templates[0].items.some(it => (ex(it.exerciseId).muscles as string[]).includes(m)))]).toEqual([minutes, []]); }
    const i = inp({ days: [4] }); const w = previewWarnings(generate(i), i);
    expect(w.find(x => x.kind === 'oneday')!.text).toBe(ONEDAY_GENERAL); expect(w.filter(x => /utrzym/i.test(x.text))).toEqual([]);
    expect(previewWarnings(generate(inp({ days: [0, 3] })), inp({ days: [0, 3] })).map(x => x.kind)).not.toContain('oneday');
  });
  test('więcej ćwiczeń niż przy masie w tym samym czasie (2 serie zamiast 3) — z budżetu, nie z nowej liczby', () => {
    for (const minutes of GEN_MINUTES) { const g = generate(inp({ minutes, sessions: 4 })); const h = generate(inp({ goal: 'hypertrophy', minutes, sessions: 4 }));
      for (const k of ['upA', 'loA']) { const gi = g.templates.find(x => x.key === k)!.items.length, hi = h.templates.find(x => x.key === k)!.items.length; expect([minutes, k, gi >= hi]).toEqual([minutes, k, true]); }
      expect(Math.max(MIN_EXERCISES, Math.floor(setsBudget('general', minutes) / 2))).toBeGreaterThanOrEqual(Math.floor(setsBudget('hypertrophy', minutes) / 3)); }
  });
  test('propozycja dni: 1–3 — układ domyślny bez dni pod rząd; 4–6 z przełącznikiem — 3 dni FBW bez par', () => {
    expect([1, 2, 3].map(sessions => genProposal(inp({ sessions })))).toEqual([[0], [0, 3], [0, 2, 4]]);
    for (const sessions of [4, 5, 6]) { const r = generate(inp({ sessions, cardio: true })); expect([sessions, on(r.days).length, r.backToBack]).toEqual([sessions, sessions, []]); }
    expect(SECONDARY_SHARE).toBe(0.5); expect(MIN_DAYS).toBe(2); expect(REPS.gym).toEqual([8, 12]); expect(REST.multi).toBe(120);
  });
});

describe('cel „Ogólny” — zapis i dane', () => {
  test('zapis 5 dni z cardio: szablony FBW (notatka wysiłku słowna) i Cardio, plan z wybranymi dniami i nazwą celu; restart — bez zmian', async () => {
    const i = inp({ days: [0, 1, 2, 4, 5], cardio: true }); const r = generate(i); const res = saveGenerated(r, i, true);
    const tpls = res.templateIds.map(id => S().templates.find(x => x.id === id)!);
    expect(tpls.map(x => x.name)).toEqual(['FBW', 'Cardio']); expect(tpls[0].note).toBe('Wysiłek: do chwili, gdy kolejne powtórzenie byłoby trudne; do upadku nie trzeba.'); expect(tpls[1].note).toBeUndefined();
    expect(tpls[0].items.every(it => it.sets === 2)).toBe(true); expect(tpls[1].items[0].targetSec).toBe(60 * 60);
    expect(plan.planName()).toBe('Ogólny, 5× w tygodniu · Pełna siłownia');
    const days = S().weekPlan!.days; expect(on(days)).toEqual([0, 1, 2, 4, 5]); expect(days.filter(d => d === tpls[1].id)).toHaveLength(2); expect(days.filter(d => d === tpls[0].id)).toHaveLength(3);
    await store.flush(); const snap = JSON.parse(JSON.stringify(saved()));
    expect(JSON.stringify(snap)).not.toMatch(/"goal"\s*:/); expect(snap.settings.modules.cardio).toBe(false); /* cel i przełącznik nie trafiają do danych (moduł „cardio” ustawień bez zmian) — bez zmiany schematu, migracji i importu */
    await fresh(snap);
    expect(S().weekPlan!.days).toEqual(days); expect(S().templates.find(x => x.id === tpls[0].id)!.note).toBe(tpls[0].note);
  });
  test('genNote: „Ogólny” — opis słowny; inne cele — RIR jak dotąd; EN', () => {
    expect(genNote()).toBe('Wysiłek: zwykle 0–3 powtórzenia w zapasie (RIR); do upadku nie trzeba.'); expect(genNote('hypertrophy')).toBe(genNote());
    applyLang('en'); expect(genNote('general')).toBe('Effort: until another repetition would be hard; you do not need to go to failure.');
    expect(genPlanName(inp({ days: [0, 3] }))).toBe('General fitness, 2× per week · Full gym');
    const i = inp({ days: [1] }); expect(previewWarnings(generate(i), i).find(x => x.kind === 'oneday')!.text).toBe('1 strength day a week is less than the WHO 2020 recommendation (at least 2 days). It is a good first step: the US guidelines 2018 suggest starting with 1 day and building up to 2 over time — some activity is better than none.');
  });
});
