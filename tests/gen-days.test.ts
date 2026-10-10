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
  GEN_SESSIONS, MAJOR, cardioCount, type GenInput, type Goal,
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
    expect(pickDays([3], GEN_SESSIONS.cut)).toEqual([3]); expect(pickDays([], GEN_SESSIONS.strength)).toBeNull(); /* 1 dzień — dozwolony (09.10.2026), 0 — nie */
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
      expect(generate(inp({ goal, sessions, days: [] }))).toEqual(base); /* 0 dni — poza zakresem: wybór pominięty */
      expect(generate(inp({ goal, sessions, days: [0, 1, 2, 3, 4, 5, 6] }))).toEqual(base); /* 7 dni — poza zakresem */
      expect(genProposal(inp({ goal, sessions, days: [1, 2] }))).toEqual(on(base.days));
      expect(genCount(inp({ goal, sessions, days: [] }))).toBe(sessions);
    }
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
      if (goal === 'cut') expect([where, r.days.filter(ti => ti != null && r.templates[ti].key === 'cardio').length]).toEqual([where, cardioCount('cut', k)]);
      cases++;
    }
    expect(cases).toBe(126 * 3); /* 1–6 z 7 dni: 7+21+35+35+21+7 = 126 dla każdego celu (09.10.2026: 1–6 dla każdego celu) */
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

/*
 * 1 dzień w tygodniu (decyzja właściciela 09.10.2026, docs/18; research docs/research/29): sesja FBW, ostrzeżenie „oneday” (bez „utrzymania” —
 * niepotwierdzone w źródłach), redukcja przy 1–2 dniach bez sesji cardio (opcja A). Wyrocznie: dzień planu == wybrany, jedna sesja „fbw”,
 * dni siłowe == 1, „oneday” dokładnie raz; pokrycie partii niezależnie z ćwiczeń; zapis i restart; EN; plan z moich szablonów.
 */
describe('1 dzień w tygodniu', () => {
  const ONEDAY_PL = 'Jeden trening w tygodniu też daje postępy, ale zwykle trochę mniejsze niż częstszy trening — głównie dlatego, że w jednej sesji mieści się mniej serii. Przy tej samej liczbie serii w tygodniu różnica w przyroście mięśni znika, a w sile maleje.';
  test('każdy cel × czas × dzień tygodnia: dokładnie ten dzień, sesja FBW, bez cardio, ostrzeżenie „oneday” (i „rare”), bez par', () => {
    let n = 0;
    for (const goal of ['strength', 'hypertrophy', 'cut'] as Goal[]) for (const minutes of [45, 60, 90]) for (let d = 0; d < 7; d++) {
      const i = inp({ goal, minutes, days: [d] }); const r = generate(i); const where = JSON.stringify(i);
      expect([where, on(r.days), r.templates.map(x => x.key), r.liftDays, r.cardioMin, r.backToBack]).toEqual([where, [d], ['fbw'], 1, 0, []]);
      const w = previewWarnings(r, i); const kinds = w.map(x => x.kind);
      expect([where, kinds.filter(k => k === 'oneday').length, kinds.includes('rare')]).toEqual([where, 1, true]); /* każda partia z seriami ma < 2 dni */
      expect([where, w.find(x => x.kind === 'oneday')!.text]).toEqual([where, ONEDAY_PL]);
      expect([where, w.filter(x => /utrzym/i.test(x.text)).length]).toEqual([where, 0]); /* „raczej utrzymanie” — niepotwierdzone (docs/research/29) */
      expect([where, genCount(i), genPlanName(i)]).toEqual([where, 1, `${({ strength: 'Siła', hypertrophy: 'Masa', cut: 'Redukcja' } as Record<string, string>)[goal]}, 1× w tygodniu · Pełna siłownia`]);
      n++;
    }
    expect(n).toBe(3 * 3 * 7);
  });
  test('FBW (1 dzień, pełna siłownia): przy 90 min każda główna partia ma ćwiczenie jako partia główna; krócej — braki widoczne w ostrzeżeniach, nie ukryte', () => {
    const prim = (r: ReturnType<typeof generate>) => new Set<string>(r.templates[0].items.flatMap(it => ex(it.exerciseId).muscles));
    for (const goal of ['strength', 'hypertrophy'] as Goal[]) { const r = generate(inp({ goal, minutes: 90, days: [2] })); expect([goal, MAJOR.filter(m => !prim(r).has(m))]).toEqual([goal, []]); expect(r.missing).toEqual([]); }
    const h45 = generate(inp({ minutes: 45, days: [0] })); /* 4 ćwiczenia: przysiad, wyciskanie, wiosłowanie, martwy ciąg */
    expect(h45.templates[0].items.map(it => ex(it.exerciseId).pattern)).toEqual(['squat', 'h_push', 'h_pull', 'hinge']); expect(h45.missing).toEqual([]);
    const s45i = inp({ goal: 'strength', minutes: 45, days: [0] }); const s45 = generate(s45i); /* 3 ćwiczenia (budżet siły) — partie bez serii */
    expect(s45.missing).toEqual(MAJOR.filter(m => !(s45.weeklySets[m] > 0))); expect(s45.missing.length).toBeGreaterThan(0); expect(previewWarnings(s45, s45i).map(w => w.kind)).toContain('missing');
    expect(h45.below10).toEqual(MAJOR.filter(m => (h45.weeklySets[m] ?? 0) < 10)); expect(h45.below10.length).toBe(MAJOR.length); /* jedna sesja 45 min < 10 serii na każdą partię */
  });
  test('redukcja: 1–2 dni — same dni siłowe (bez sesji cardio); od 3 dni — jedna sesja cardio; ostrzeżenie „oneday” tylko przy 1 dniu', () => {
    const c1 = generate(inp({ goal: 'cut', days: [4] })); const c2 = generate(inp({ goal: 'cut', days: [1, 4] })); const c3 = generate(inp({ goal: 'cut', days: [0, 2, 4] }));
    expect([c1.templates.map(x => x.key), c2.templates.map(x => x.key), c3.templates.map(x => x.key)]).toEqual([['fbw'], ['fbwA', 'fbwB'], ['fbwA', 'fbwB', 'cardio']]);
    expect([c1.cardioMin, c2.cardioMin, c3.cardioMin, c2.liftDays, c3.liftDays]).toEqual([0, 0, 60, 2, 2]);
    /* 2 dni siłowe — partie jak przy masie na 2 dni (część z ≥ 2 dniami, R1); przy 1 dniu siłowym (wariant B: 1 siłowy + 1 cardio) — żadna */
    expect(c2.rare).toEqual(generate(inp({ days: [1, 4] })).rare); expect(c2.rare.length).toBeLessThan(c1.rare.length); expect(c1.rare.length).toBe(MAJOR.length);
    expect(previewWarnings(c2, inp({ goal: 'cut', days: [1, 4] })).map(w => w.kind)).not.toContain('oneday');
    expect(previewWarnings(c3, inp({ goal: 'cut', days: [0, 2, 4] })).map(w => w.kind)).not.toContain('oneday');
  });
  test('propozycja dla 1 dnia: poniedziałek (układ domyślny); zapis — plan z jednym dniem i szablonem „FBW”, po restarcie bez zmian', async () => {
    expect(genProposal(inp({ sessions: 1 }))).toEqual([0]);
    const i = inp({ days: [3] }); const r = generate(i); const res = saveGenerated(r, i, true);
    expect(res.templateIds.map(id => S().templates.find(x => x.id === id)!.name)).toEqual(['FBW']); expect(plan.planName()).toBe('Masa, 1× w tygodniu · Pełna siłownia');
    expect(on(S().weekPlan!.days)).toEqual([3]); expect(S().weekPlan!.days[3]).toBe(res.templateIds[0]);
    await store.flush(); const snap = JSON.parse(JSON.stringify(saved())); await fresh(snap);
    expect(on(S().weekPlan!.days)).toEqual([3]); expect(S().templates.find(x => x.id === res.templateIds[0])!.name).toBe('FBW');
  });
  test('EN: nazwa sesji, ostrzeżenie i nazwa planu', () => {
    applyLang('en'); const i = inp({ goal: 'strength', days: [0] }); const r = generate(i);
    expect(r.templates[0].name).toBe('Full Body'); expect(genPlanName(i)).toBe('Strength, 1× per week · Full gym');
    expect(previewWarnings(r, i).find(w => w.kind === 'oneday')!.text).toBe('One workout a week still brings progress, but usually a little less than training more often — mainly because fewer sets fit into one session. With the same number of sets per week, the difference in muscle growth disappears and the difference in strength shrinks.');
  });
  test('Plan z moich szablonów: 1 szablon — 1 dzień dozwolony, ostrzeżenie „oneday”; 2 dni — bez niego; szablon tylko z cardio nie jest dniem siłowym', () => {
    const t = withDemoTemplates(); expect(ownSessionsFor(1)).toEqual([1, 2, 3, 4, 5, 6]);
    const r1 = ownPlan({ templateIds: [t[0].id], sessions: 1, days: [5] })!; expect([on(r1.days), r1.sessions, r1.liftDays]).toEqual([[5], 1, 1]);
    expect(ownWarnings(r1).find(w => w.kind === 'oneday')!.text).toBe(ONEDAY_PL);
    const r2 = ownPlan({ templateIds: [t[0].id], sessions: 1, days: [1, 4] })!; expect(r2.liftDays).toBe(2); expect(ownWarnings(r2).map(w => w.kind)).not.toContain('oneday');
    expect(ownProposal({ templateIds: [t[0].id], sessions: 1 })).toEqual([0]);
    const cardio = S().exercises.find(e => e.lib && e.pattern === 'cardio')!; const c = store.newTemplate(); c.name = 'Bieg'; c.items = [{ ...t[0].items[0], id: 'c1', exerciseId: cardio.id }]; store.save();
    const r3 = ownPlan({ templateIds: [t[0].id, c.id], sessions: 2, days: [0, 3] })!; expect(r3.liftDays).toBe(1); expect(ownWarnings(r3).map(w => w.kind)).toContain('oneday');
  });
});
