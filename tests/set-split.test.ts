/*
 * Serie na partię: odcinek bezpośredni i pośredni — LOGIKA (decyzja właściciela 13.10.2026, wariant A; docs/18, docs/research/32).
 * Jedna funkcja liczenia {direct, indirectSets, indirectWeighted, total} dla pasków, Postępów, podsumowania, mapy i generatora.
 * Rodzaje (docs/20): logika funkcji, macierz (cała biblioteka ćwiczeń × liczba serii), niezmienniki, scenariusz (trening z wyciskaniem → triceps pośrednio),
 * generator z własnym celem (Ustawienia), regresja (generator ignorował cel z Ustawień). Ekrany i wygląd: tests/set-split-ui.test.tsx.
 */
import * as store from '@/lib/store';
import { SECONDARY_SHARE, emptySplit, makeSplit, sumSplit, addSplitSets, splitTotals, mergeSplits, splitText, splitLabel } from '@/lib/setSplit';
import { SECONDARY_SHARE as GEN_SHARE, generate, weekLoad, previewWarnings, weeklySetsList, ownPlan, ownWarnings, MAJOR, type GenInput } from '@/lib/generator';
import { setsSplitByMuscle, setsByMuscle, weeklySetsByMuscle, weeklySplitByMuscle, setsGoal, thisMonday, WEEKLY_SETS_MARK } from '@/lib/stats';
import { compare } from '@/lib/progress';
import { applyLang } from '@/lib/i18n';
import { fresh, addWorkout, withDemoTemplates } from './helpers';

const NOW = new Date(2026, 9, 8, 9, 0); /* czwartek; tydzień pon 5 … nd 11 października 2026 */
const S = () => store.getState();
const sets = (n: number) => Array.from({ length: n }, () => ({ weight: 50, reps: 8 }));
const inp = (o: Partial<GenInput> = {}): GenInput => ({ goal: 'hypertrophy', locationId: null, sessions: 3, minutes: 60, ...o });
beforeEach(async () => { jest.useFakeTimers({ now: NOW }); await fresh(); });
afterEach(() => { applyLang('pl'); jest.useRealTimers(); });

describe('lib/setSplit: funkcje', () => {
  test('SECONDARY_SHARE = 0,5 w jednym miejscu (generator tylko go re-eksportuje)', () => { expect(SECONDARY_SHARE).toBe(0.5); expect(GEN_SHARE).toBe(SECONDARY_SHARE); });
  test('makeSplit / emptySplit / sumSplit: total = direct + indirectSets × 0,5', () => {
    expect(emptySplit()).toEqual({ direct: 0, indirectSets: 0, indirectWeighted: 0, total: 0 });
    expect(makeSplit(6, 3)).toEqual({ direct: 6, indirectSets: 3, indirectWeighted: 1.5, total: 7.5 });
    expect(sumSplit(makeSplit(6, 3), makeSplit(2, 1))).toEqual({ direct: 8, indirectSets: 4, indirectWeighted: 2, total: 10 });
  });
  test('addSplitSets: główne bezpośrednio, pomocnicze pośrednio; kolejne ćwiczenia sumują się; pusta lista nic nie dodaje', () => {
    const acc: Record<string, ReturnType<typeof emptySplit>> = {};
    addSplitSets(acc, ['klatka'], ['triceps', 'barki'], 3); addSplitSets(acc, ['barki'], ['triceps'], 2); addSplitSets(acc, [], [], 5);
    expect(acc).toEqual({ klatka: makeSplit(3, 0), triceps: makeSplit(0, 5), barki: makeSplit(2, 3) });
    expect(splitTotals(acc)).toEqual({ klatka: 3, triceps: 2.5, barki: 3.5 });
    expect(mergeSplits(acc, { klatka: makeSplit(1, 1), plecy: makeSplit(4, 0) })).toEqual({ klatka: makeSplit(4, 1), triceps: makeSplit(0, 5), barki: makeSplit(2, 3), plecy: makeSplit(4, 0) });
  });
  test('splitText: „6 + 1,5 pośrednio (3 serie) / 10”; bez pośrednich — sama liczba (bez dopisku); odmiana „serii”', () => {
    expect(splitText(makeSplit(6, 3), 10)).toBe('6 + 1,5 pośrednio (3 serie) / 10');
    expect(splitText(makeSplit(6, 3))).toBe('6 + 1,5 pośrednio (3 serie)');
    expect(splitText(makeSplit(6, 0), 10)).toBe('6 / 10'); expect(splitText(makeSplit(6, 0))).toBe('6');
    expect(splitText(makeSplit(0, 1))).toBe('0 + 0,5 pośrednio (1 seria)'); expect(splitText(makeSplit(2, 12))).toBe('2 + 6 pośrednio (12 serii)');
    expect(splitText(makeSplit(2, 2))).toBe('2 + 1 pośrednio (2 serie)'); expect(splitText(emptySplit(), 10)).toBe('0 / 10');
  });
  test('splitLabel (VoiceOver): obie wartości i cel; bez pośrednich — liczba i cel', () => {
    expect(splitLabel(makeSplit(6, 3), 10)).toBe('6 bezpośrednio, 1,5 pośrednio (serie pomocnicze: 3), cel 10');
    expect(splitLabel(makeSplit(6, 3))).toBe('6 bezpośrednio, 1,5 pośrednio (serie pomocnicze: 3)');
    expect(splitLabel(makeSplit(6, 0), 10)).toBe('6, cel 10'); expect(splitLabel(makeSplit(6, 0))).toBe('6');
  });
});

describe('statystyki: setsSplitByMuscle (jedno źródło liczenia)', () => {
  test('scenariusz: wyciskanie 12 serii → klatka bezpośrednio 12, triceps i barki wyłącznie pośrednio (12 serii pomocniczych = 6)', () => {
    addWorkout(new Date(2026, 9, 6, 18).getTime(), [['Bench Press (sztanga)', sets(12)], ['Lateral Raise (hantle)', sets(5)]]);
    const sp = setsSplitByMuscle(thisMonday(), thisMonday(1));
    expect(sp.klatka).toEqual(makeSplit(12, 0)); expect(sp.triceps).toEqual(makeSplit(0, 12)); expect(sp.triceps.total).toBe(6);
    expect(sp.barki).toEqual(makeSplit(5, 12)); expect(sp.barki.total).toBe(11);
    expect(weeklySplitByMuscle(thisMonday())).toEqual(sp); expect(weeklySetsByMuscle(thisMonday())).toEqual(splitTotals(sp));
  });
  test('niezmiennik: setsByMuscle = suma ważona; total = direct + indirectWeighted; rozgrzewka poza; trening spoza okresu poza', () => {
    addWorkout(new Date(2026, 9, 6, 18).getTime(), [['Bench Press (sztanga)', [...sets(3), { weight: 20, reps: 10, warmup: true, kind: 'warmup' }]]]);
    addWorkout(new Date(2026, 8, 20, 18).getTime(), [['Bench Press (sztanga)', sets(9)]]);
    const sp = setsSplitByMuscle(thisMonday(), thisMonday(1)); expect(sp.klatka.direct).toBe(3);
    for (const [m, v] of Object.entries(sp)) { expect(v.total).toBe(v.direct + v.indirectWeighted); expect(v.indirectWeighted).toBe(v.indirectSets * SECONDARY_SHARE); expect(setsByMuscle(thisMonday(), thisMonday(1))[m]).toBe(v.total); }
  });
  test('macierz: każde ćwiczenie biblioteki × 1–3 serie — podział zgodny z partiami głównymi i pomocniczymi (stara reguła n i n × 0,5)', () => {
    let n = 0;
    for (const e of S().exercises.filter(x => x.lib && x.metric === 'weight_reps')) for (const k of [1, 2, 3]) {
      const acc: Record<string, ReturnType<typeof emptySplit>> = {}; addSplitSets(acc, e.muscles, e.secondaryMuscles, k);
      const old: Record<string, number> = {}; e.muscles.forEach(m => { old[m] = (old[m] ?? 0) + k; }); e.secondaryMuscles.forEach(m => { old[m] = (old[m] ?? 0) + k * 0.5; });
      expect([e.name, k, splitTotals(acc)]).toEqual([e.name, k, old]); n++;
    }
    expect(n).toBeGreaterThan(300);
  });
  test('compare(): wiersze serii niosą podział wykonanych i zaplanowanych; doneSets = doneSplit.total', () => {
    addWorkout(new Date(2026, 9, 6, 18).getTime(), [['Bench Press (sztanga)', sets(4)]]);
    const c = compare('week', NOW.getTime()); const tr = c.setRows.find(r => r.part === 'triceps')!;
    expect(tr.doneSplit).toEqual(makeSplit(0, 4)); expect(tr.doneSets).toBe(2); expect(tr.plannedSplit).toEqual(emptySplit());
    for (const r of c.setRows) { expect(r.doneSets).toBe(r.doneSplit.total); expect(r.plannedSets).toBe(r.plannedSplit.total); }
  });
});

describe('generator: cel serii z Ustawień (per partia), liczenie jak na paskach', () => {
  test('weekLoad: weeklySets = suma ważona splits; cel każdej partii z setsGoal (automat 10 dla wszystkich)', () => {
    const r = generate(inp());
    for (const m of MAJOR) { expect(r.weeklySets[m] ?? 0).toBe(r.splits[m]?.total ?? 0); expect(r.goals[m]).toBe(WEEKLY_SETS_MARK); expect(setsGoal(m)).toBe(WEEKLY_SETS_MARK); }
    expect(r.below10).toEqual(MAJOR.filter(m => (r.weeklySets[m] ?? 0) < WEEKLY_SETS_MARK));
  });
  test('regresja: cel jednej partii inny niż 10 zmienia próg tylko tej partii (niższy — wychodzi z braków; wyższy — wchodzi)', () => {
    const base = generate(inp()); const ok = MAJOR.filter(m => (base.weeklySets[m] ?? 0) >= WEEKLY_SETS_MARK); const low = MAJOR.filter(m => (base.weeklySets[m] ?? 0) > 0 && (base.weeklySets[m] ?? 0) < WEEKLY_SETS_MARK);
    expect(ok.length).toBeGreaterThan(0); expect(low.length).toBeGreaterThan(0);
    const up = ok[0], down = low[0]; const w = (m: string) => base.weeklySets[m]!;
    S().settings.weeklySetGoals = { [up]: Math.floor(w(up)) + 1, [down]: Math.max(1, Math.floor(w(down))) };
    const r = generate(inp());
    expect(r.goals[up]).toBe(Math.floor(w(up)) + 1); expect(r.goals[down]).toBe(Math.max(1, Math.floor(w(down)))); expect(r.below10).toContain(up); expect(r.below10).not.toContain(down);
    for (const m of MAJOR) if (m !== up && m !== down) { expect(r.goals[m]).toBe(10); expect(r.below10.includes(m)).toBe(base.below10.includes(m)); }
    expect(r.weeklySets).toEqual(base.weeklySets); /* cel nie zmienia doboru ćwiczeń ani liczby serii */
  });
  test('ostrzeżenie „Poniżej celu…” — lista „partia (x/cel)” z celem każdej partii; siła i „Ogólny” bez progu', () => {
    const base = generate(inp()); const low = base.below10.filter(m => !base.missing.includes(m)); expect(low.length).toBeGreaterThan(1);
    S().settings.weeklySetGoals = { [low[0]]: 25 };
    const r = generate(inp()); const txt = previewWarnings(r, inp()).find(x => x.kind === 'below')!.text;
    const f = (m: string) => `${m} (${String(r.weeklySets[m]).replace('.', ',')}/${r.goals[m]})`;
    expect(txt).toContain(f(low[0])); expect(txt).toContain('/25)'); expect(txt).toContain(f(low[1])); expect(txt).toContain('/10)');
    expect(txt).toMatch(/^Poniżej celu serii tygodniowo: /);
    for (const goal of ['strength', 'general'] as const) { const g = generate(inp({ goal })); expect(g.below10).toEqual([]); expect(previewWarnings(g, inp({ goal })).some(x => x.kind === 'below')).toBe(false); }
  });
  test('lista serii w podglądzie: ta sama funkcja podpisu co paski; cel tylko tam, gdzie obowiązuje', () => {
    const r = generate(inp()); S().settings.weeklySetGoals = { klatka: 14 };
    const r2 = generate(inp()); const withGoal = weeklySetsList(r2, true); const noGoal = weeklySetsList(r2, false);
    expect(withGoal).toContain(`klatka ${splitText(r2.splits.klatka, 14)}`); expect(withGoal).toContain('/ 14'); expect(noGoal).not.toContain('/ 14'); expect(noGoal).toContain(`klatka ${splitText(r2.splits.klatka)}`);
    expect(r.weeklySets).toEqual(r2.weeklySets);
  });
  test('plan z własnych szablonów: te same cele i podpisy (weekLoad), ostrzeżenie z listą „partia (x/cel)”', () => {
    const t = withDemoTemplates(); S().settings.weeklySetGoals = { klatka: 3, plecy: 30 };
    const r = ownPlan({ templateIds: [t[0].id, t[2].id], sessions: 2 })!;
    expect(r.goals.klatka).toBe(3); expect(r.goals.plecy).toBe(30); expect(r.below10).not.toContain('klatka'); expect(r.below10).toContain('plecy');
    const w = ownWarnings(r).find(x => x.kind === 'below')!.text; expect(w).toMatch(/plecy \([\d,]+\/30\)/); expect(w).not.toContain('klatka (');
    for (const m of MAJOR) expect(r.weeklySets[m] ?? 0).toBe(r.splits[m]?.total ?? 0);
  });
  test('weekLoad ze wstrzykniętym celem (goalOf) — niezależny od Ustawień', () => {
    const exOf = (id: string) => (id === 'a' ? { muscles: ['klatka'], secondaryMuscles: ['triceps'] } : undefined) as never;
    const r = weekLoad([[{ exerciseId: 'a', sets: 8 }], null, null, null, null, null, null], exOf, m => (m === 'klatka' ? 8 : 100));
    expect(r.splits.klatka).toEqual(makeSplit(8, 0)); expect(r.splits.triceps).toEqual(makeSplit(0, 8)); expect(r.below10).not.toContain('klatka'); expect(r.below10).toContain('triceps');
  });
});
