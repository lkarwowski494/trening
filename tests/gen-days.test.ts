/*
 * Wybór dni treningowych w generatorze i w „Planie z moich szablonów” (decyzja właściciela 09.10.2026 wieczór, wariant B; docs/18) — logika.
 * Rodzaje (docs/20): logika (zwykły przypadek, puste i złe dane, granice), wyrocznie (dni planu == wybrane, liczba == sesje, pary dzień po dniu
 * policzone niezależnie, minimalność par względem WSZYSTKICH permutacji przydziału), bez `days` — dokładnie jak dotąd, dane (zapisany plan ma
 * wybrane dni, restart), EN. Ekran: tests/gen-days-ui.test.tsx; E2E: .maestro/14-generator.yaml, .maestro/18-plan-z-moich-szablonow.yaml.
 */
import * as store from '@/lib/store';
import * as plan from '@/lib/plan';
import {
  generate, genProposal, genCount, genPlanName, saveGenerated, previewWarnings, pickDays, assignDays, ownPlan, ownProposal, ownSessionsFor, ownWarnings,
  GEN_SESSIONS, type GenInput, type Goal,
} from '@/lib/generator';
import { weekdayNames, weekdayLabels } from '@/lib/calendar';
import { applyLang } from '@/lib/i18n';
import { fresh, withDemoTemplates, saved } from './helpers';

jest.setTimeout(240000);
const S = () => store.getState();
const ex = (id: string) => store.exById(id)!;
const inp = (o: Partial<GenInput> = {}): GenInput => ({ goal: 'hypertrophy', locationId: null, sessions: 3, minutes: 60, ...o });
beforeEach(async () => { jest.useFakeTimers({ now: new Date(2026, 9, 8, 9).getTime() }); await fresh(); });
afterEach(() => { applyLang('pl'); jest.useRealTimers(); });

/** Wszystkie podzbiory {0..6} o danej liczbie elementów (rosnąco). */
const combos = (k: number): number[][] => { const out: number[][] = []; for (let m = 0; m < 128; m++) { const ds = [0, 1, 2, 3, 4, 5, 6].filter(d => (m >> d) & 1); if (ds.length === k) out.push(ds); } return out; };
const permsOf = <T,>(a: T[]): T[][] => (a.length <= 1 ? [a] : a.flatMap((x, i) => permsOf([...a.slice(0, i), ...a.slice(i + 1)]).map(p => [x, ...p])));
const shares = (a: Set<string>, b: Set<string>) => [...a].some(m => b.has(m));
/** Pary (d, d+1 mod 7) ze wspólną partią główną — liczone niezależnie od lib (`prim` dnia z jego sesji). */
const pairsOf = (prim: (d: number) => Set<string>) => { const out: [number, number][] = []; for (let d = 0; d < 7; d++) if (shares(prim(d), prim((d + 1) % 7))) out.push([d, (d + 1) % 7]); return out; };
const on = (days: (unknown | null)[]) => days.flatMap((x, d) => (x == null ? [] : [d]));

describe('pickDays i assignDays', () => {
  test('pickDays: bez powtórzeń, tylko liczby całkowite 0–6, rosnąco; liczba spoza dozwolonych albo brak — null', () => {
    expect(pickDays([4, 0, 2, 2], [2, 3])).toEqual([0, 2, 4]);
    expect(pickDays([6, 0, 7, -1, 1.5, Number.NaN], [2])).toEqual([0, 6]);
    expect(pickDays([0], [2, 3])).toBeNull(); expect(pickDays([], [2, 3])).toBeNull(); expect(pickDays(undefined, [2, 3])).toBeNull();
    expect(pickDays([0, 1, 2, 3, 4, 5, 6], GEN_SESSIONS.hypertrophy)).toBeNull(); /* 7 dni — poza GEN_SESSIONS */
  });
  test('assignDays: bez par — kolejność bez zmian; para do uniknięcia — usunięta; nie do uniknięcia — pierwsza (obrót 0)', () => {
    const A = new Set(['klatka']), B = new Set(['czworogłowe']);
    expect(assignDays([A, B, A], [0, 2, 4])).toEqual([0, 1, 2]);
    expect(assignDays([A, A, B], [0, 1, 3])).toEqual([1, 2, 0]); /* obrót 1: A(1) pon, B(2) wt, A(0) czw — bez par */
    expect(assignDays([A, A], [0, 1])).toEqual([0, 1]);
    expect(assignDays([], [])).toEqual([]);
  });
  test('weekdayNames / weekdayLabels: 7 dni od poniedziałku (pl, en)', () => {
    expect(weekdayNames()[0]).toBe('poniedziałek'); expect(weekdayNames()[6]).toBe('niedziela'); expect(weekdayLabels()).toHaveLength(7);
    applyLang('en'); expect([weekdayNames()[0], weekdayNames()[6]]).toEqual(['Monday', 'Sunday']);
  });
});

describe('generator z wybranymi dniami — wyrocznie', () => {
  test('bez `days` i z `days` spoza dozwolonych — wynik identyczny jak dotąd (sessions); propozycja = dni wyniku bez wyboru', () => {
    for (const goal of ['strength', 'hypertrophy', 'cut'] as Goal[]) for (const sessions of GEN_SESSIONS[goal]) {
      const base = generate(inp({ goal, sessions }));
      expect(generate(inp({ goal, sessions, days: undefined }))).toEqual(base);
      expect(generate(inp({ goal, sessions, days: [0] }))).toEqual(base); /* 1 dzień — poza zakresem: wybór pominięty */
      expect(genProposal(inp({ goal, sessions, days: [1, 2] }))).toEqual(on(base.days));
      expect(genCount(inp({ goal, sessions, days: [0] }))).toBe(sessions);
    }
    expect(generate(inp({ goal: 'cut', days: [0, 2] }))).toEqual(generate(inp({ goal: 'cut' }))); /* redukcja: co najmniej 3 */
  });
  test('każdy cel × każdy dozwolony wybór dni: dni planu == wybrane, sesje == liczba dni, pary == niezależnie policzone, najmniej par po wszystkich permutacjach', () => {
    let cases = 0, withPairs = 0, permChecked = 0;
    for (const goal of ['strength', 'hypertrophy', 'cut'] as Goal[]) for (const k of GEN_SESSIONS[goal]) for (const ds of combos(k)) {
      const i = inp({ goal, days: ds, sessions: 2 }); const r = generate(i); const where = JSON.stringify(i);
      expect([where, on(r.days)]).toEqual([where, ds]); expect(genCount(i)).toBe(k);
      const ref = generate(inp({ goal, sessions: k })); /* te same szablony co bez wyboru dni (split zależy tylko od liczby sesji) */
      expect([where, r.templates]).toEqual([where, ref.templates]);
      expect([where, r.days.filter(x => x != null).sort()]).toEqual([where, ref.days.filter(x => x != null).sort()]); /* ten sam zestaw sesji */
      const primT = (ti: number | null) => new Set(ti == null ? [] : r.templates[ti].items.filter(it => !it.targetSec).flatMap(it => ex(it.exerciseId).muscles));
      expect([where, r.backToBack]).toEqual([where, pairsOf(d => primT(r.days[d]))]);
      if (k <= 6) { /* minimalność: każda permutacja sesji po wybranych dniach ma co najmniej tyle par */
        const sess = ds.map(d => r.days[d]!); let min = Infinity;
        for (const p of permsOf(sess)) { const m = new Map(ds.map((d, j) => [d, p[j]])); min = Math.min(min, pairsOf(d => primT(m.get(d) ?? null)).length); permChecked++; }
        expect([where, r.backToBack.length]).toEqual([where, min]);
      }
      if (r.backToBack.length) { withPairs++; expect(previewWarnings(r, i).map(w => w.kind)).toContain('pairs'); } else expect(previewWarnings(r, i).map(w => w.kind)).not.toContain('pairs');
      if (goal === 'cut') expect(r.days.filter(ti => ti != null && r.templates[ti].key === 'cardio')).toHaveLength(1);
      cases++;
    }
    expect(cases).toBe(119 * 2 + 98); /* 2–6 z 7 dni: 21+35+35+21+7 = 119 (siła, masa); redukcja 3–6: 98 */
    expect(withPairs).toBeGreaterThan(0); expect(permChecked).toBeGreaterThan(1000);
  });
  test('wybór wymuszający pary (wszystkie ćwiczenia na tę samą partię): ostrzeżenie „pairs” z dniami tygodnia', () => {
    for (const e of S().exercises) if (e.lib) e.muscles = ['klatka'];
    const i = inp({ days: [0, 1, 4] }); const r = generate(i);
    expect(r.backToBack).toEqual([[0, 1]]); expect(previewWarnings(r, i).find(w => w.kind === 'pairs')!.text).toMatch(/^Dzień po dniu te same główne partie: pon\.?–wt\.?\./);
  });
  test('przydział omija parę, gdy się da: 4 sesje góra/dół na pon–czw bez par dzień po dniu', () => {
    const r = generate(inp({ days: [0, 1, 2, 3], sessions: 4 }));
    expect(on(r.days)).toEqual([0, 1, 2, 3]); expect(r.backToBack).toEqual([]);
  });
});

describe('zapis i nazwa planu', () => {
  test('saveGenerated: zapisany plan ma dokładnie wybrane dni; nazwa z liczbą wybranych dni; po restarcie te same dni', async () => {
    const i = inp({ days: [1, 3, 5, 6], sessions: 3 }); const r = generate(i);
    expect(genPlanName(i)).toBe('Masa, 4× w tygodniu · Pełna siłownia');
    const res = saveGenerated(r, i, true); expect(plan.planName()).toBe(res.planName);
    const days = S().weekPlan!.days; expect(on(days)).toEqual([1, 3, 5, 6]);
    await store.flush(); const snap = JSON.parse(JSON.stringify(saved()));
    await fresh(snap); expect(on(S().weekPlan!.days)).toEqual([1, 3, 5, 6]); expect(S().weekPlan!.days).toEqual(days);
  });
  test('EN: nazwa planu z liczbą wybranych dni', () => {
    applyLang('en'); expect(genPlanName(inp({ goal: 'strength', days: [0, 2] }))).toBe('Strength, 2× per week · Full gym');
  });
});

describe('Plan z moich szablonów — wybrane dni', () => {
  test('każdy podzbiór szablonów × każdy dozwolony wybór dni: dni == wybrane, każdy szablon użyty, pary == niezależnie, minimum po permutacjach', () => {
    const t = withDemoTemplates(); const prim = (id: string | null) => (id ? plan.templateMuscles(id) : new Set<string>()); let cases = 0;
    for (const ids of [[t[0].id], [t[0].id, t[2].id], [t[0].id, t[1].id, t[2].id], t.map(x => x.id)]) for (const k of ownSessionsFor(ids.length)) for (const ds of combos(k).filter((_, j) => j % 3 === 0)) {
      const r = ownPlan({ templateIds: ids, sessions: 2, days: ds })!; const where = JSON.stringify([ids.length, ds]);
      expect([where, on(r.days), r.sessions, r.seq.length]).toEqual([where, ds, k, k]);
      expect([where, new Set(r.seq)]).toEqual([where, new Set(ids)]);
      expect([where, ds.map(d => r.days[d])]).toEqual([where, r.seq]); /* seq w kolejności tygodnia */
      expect([where, r.backToBack]).toEqual([where, pairsOf(d => prim(r.days[d]))]);
      let min = Infinity; for (const p of permsOf(r.seq)) { const m = new Map(ds.map((d, j) => [d, p[j]])); min = Math.min(min, pairsOf(d => prim(m.get(d) ?? null)).length); }
      expect([where, r.backToBack.length]).toEqual([where, min]);
      if (r.backToBack.length) expect(ownWarnings(r).map(w => w.kind)).toContain('pairs');
      cases++;
    }
    expect(cases).toBeGreaterThan(40);
  });
  test('bez `days` albo z liczbą dni spoza dozwolonych (mniej niż szablonów, 7) — jak dotąd; propozycja = dni wyniku bez wyboru', () => {
    const t = withDemoTemplates(); const ids = t.map(x => x.id);
    const base = ownPlan({ templateIds: ids, sessions: 4 })!;
    expect(ownPlan({ templateIds: ids, sessions: 4, days: [0, 2, 4] })).toEqual(base); /* 3 dni < 4 szablony */
    expect(ownPlan({ templateIds: ids, sessions: 4, days: [0, 1, 2, 3, 4, 5, 6] })).toEqual(base);
    expect(ownProposal({ templateIds: ids, sessions: 4, days: [0, 1] })).toEqual(on(base.days));
    expect(ownProposal({ templateIds: [], sessions: 3 })).toEqual([]);
    expect(ownPlan({ templateIds: [], sessions: 3, days: [0, 2] })).toBeNull();
  });
});
