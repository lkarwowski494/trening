/*
 * „Plan z moich szablonów” — logika (decyzja właściciela 09.10.2026, wariant B; docs/18 ok. 14:55).
 * Rodzaje (docs/20): logika (zwykły przypadek, puste dane, granice, złe dane), niezmienniki rozkładu (każdy wybrany szablon użyty, liczba dni zgodna,
 * rotacja po kolei, układ dni = najmniej par dzień po dniu jak w generatorze — bestDays), dane (szablony bez zmian, zapis planu, aktywacja ze
 * zmianami dni — activatePlan), EN. Ekran i scenariusze: tests/plan-own-templates-ui.test.tsx; E2E: .maestro/18-plan-z-moich-szablonow.yaml.
 */
import * as store from '@/lib/store';
import * as plan from '@/lib/plan';
import { ownTemplates, ownSessionsFor, ownPlan, ownWarnings, ownCounts, ownPlanName, saveOwnPlan, weekLoad, bestDays, OWN_SESSIONS, OWN_MAX, GEN_SESSIONS, MAJOR, MIN_DAYS, type OwnResult } from '@/lib/generator';
import { WEEKLY_SETS_MARK } from '@/lib/stats';
import { applyLang } from '@/lib/i18n';
import { fresh, withDemoTemplates, ex } from './helpers';

const NOW = new Date(2026, 9, 8, 9, 0); /* czwartek */
const S = () => store.getState();
beforeEach(async () => { jest.useFakeTimers({ now: NOW }); await fresh(); });
afterEach(() => { applyLang('pl'); jest.useRealTimers(); });
/** Demo: [Upper A, Upper B, Legs — siłownia, Legs — dom]. */
const demo = () => withDemoTemplates();
const subsets = <T,>(a: T[]): T[][] => a.reduce<T[][]>((acc, x) => [...acc, ...acc.map(s => [...s, x])], [[]]).filter(s => s.length);
const shares = (a: Set<string>, b: Set<string>) => [...a].some(m => b.has(m));
const prim = (id: string | null) => (id ? plan.templateMuscles(id) : new Set<string>());
/** Najmniejsza liczba par dzień po dniu (także nd → pon) ze wspólną partią główną po wszystkich układach n dni przy tej samej kolejności sesji. */
function minPairs(seq: string[]): number {
  let best = Infinity;
  for (let mask = 0; mask < 128; mask++) {
    const ds = [0, 1, 2, 3, 4, 5, 6].filter(d => (mask >> d) & 1); if (ds.length !== seq.length) continue;
    const days: (string | null)[] = Array(7).fill(null); ds.forEach((d, i) => { days[d] = seq[i]; });
    let n = 0; for (let d = 0; d < 7; d++) if (shares(prim(days[d]), prim(days[(d + 1) % 7]))) n++; best = Math.min(best, n);
  }
  return best;
}

describe('wybór szablonów i liczby dni', () => {
  test('do wyboru: niezarchiwizowane z ćwiczeniami; liczby dni = GEN_SESSIONS (jak generator), co najmniej tyle, ile szablonów', () => {
    const t = demo(); const empty = store.newTemplate(); store.setTemplateArchived(t[3], true);
    expect(ownTemplates().map(x => x.id)).toEqual([t[0].id, t[1].id, t[2].id]); expect(ownTemplates().some(x => x.id === empty.id)).toBe(false);
    expect(OWN_SESSIONS).toEqual(GEN_SESSIONS.hypertrophy); expect(OWN_MAX).toBe(6);
    expect(ownSessionsFor(1)).toEqual([2, 3, 4, 5, 6]); expect(ownSessionsFor(4)).toEqual([4, 5, 6]); expect(ownSessionsFor(6)).toEqual([6]); expect(ownSessionsFor(7)).toEqual([]);
  });
  test('puste i złe dane: brak wyboru, nieznane id, pusty szablon, szablon w archiwum, więcej niż OWN_MAX → null; powtórzone id liczone raz', () => {
    const t = demo(); const empty = store.newTemplate();
    expect(ownPlan({ templateIds: [], sessions: 3 })).toBeNull(); expect(ownPlan({ templateIds: ['nie-ma'], sessions: 3 })).toBeNull();
    expect(ownPlan({ templateIds: [empty.id], sessions: 3 })).toBeNull();
    store.setTemplateArchived(t[0], true); expect(ownPlan({ templateIds: [t[0].id], sessions: 3 })).toBeNull(); store.setTemplateArchived(t[0], false);
    const many = Array.from({ length: 7 }, (_, i) => store.dupTemplate(t[i % 4].id).id); expect(ownPlan({ templateIds: many, sessions: 6 })).toBeNull();
    expect(ownPlan({ templateIds: many.slice(0, 6), sessions: 6 })!.seq).toEqual(many.slice(0, 6));
    expect(ownPlan({ templateIds: [t[0].id, t[0].id, 'nie-ma'], sessions: 2 })!.seq).toEqual([t[0].id, t[0].id]);
  });
  test('granice liczby dni: mniej niż szablonów albo spoza listy → najbliższa dozwolona nie mniejsza (2, k, 6)', () => {
    const t = demo();
    expect(ownPlan({ templateIds: [t[0].id], sessions: 1 })!.sessions).toBe(2); expect(ownPlan({ templateIds: [t[0].id], sessions: 0 })!.sessions).toBe(2);
    expect(ownPlan({ templateIds: t.map(x => x.id), sessions: 3 })!.sessions).toBe(4); expect(ownPlan({ templateIds: [t[0].id], sessions: 9 })!.sessions).toBe(6);
    expect(ownPlan({ templateIds: [t[0].id], sessions: Number.NaN })!.sessions).toBe(6);
  });
});

describe('rozkład na tydzień — niezmienniki (reguły generatora)', () => {
  test('każdy podzbiór szablonów × każda liczba dni: każdy wybrany użyty, dni = n, rotacja po kolei A/B/A…, najmniej par dzień po dniu (bestDays)', () => {
    const t = demo(); let cases = 0;
    for (const sub of subsets(t.map(x => x.id))) for (const n of ownSessionsFor(sub.length)) {
      const r = ownPlan({ templateIds: sub, sessions: n })!; cases++;
      expect(r.sessions).toBe(n); expect(r.days.length).toBe(7); expect(r.days.filter(Boolean).length).toBe(n);
      expect(new Set(r.days.filter(Boolean))).toEqual(new Set(sub)); /* każdy wybrany szablon użyty, żaden inny */
      expect(r.seq).toEqual(Array.from({ length: n }, (_, i) => sub[i % sub.length])); /* rotacja po kolei */
      expect(r.days.filter(Boolean)).toEqual(r.seq); /* kolejność sesji w tygodniu bez zmian (jak generator: „kolejność sesji bez zmian”) */
      const counts = ownCounts(r); expect(counts.reduce((a, c) => a + c.n, 0)).toBe(n); expect(Math.max(...counts.map(c => c.n)) - Math.min(...counts.map(c => c.n))).toBeLessThanOrEqual(1); /* równo, ±1 */
      expect(r.backToBack.length).toBe(minPairs(r.seq)); /* docs/research/23 reguła 1: z dniem przerwy, gdy się da */
      for (const [a, b] of r.backToBack) expect(shares(prim(r.days[a]), prim(r.days[b]))).toBe(true);
    }
    expect(cases).toBe(4 * 5 + 6 * 5 + 4 * 4 + 1 * 3);
  });
  test('układ domyślny generatora przy remisie: 1 szablon × 2 → pon., czw.; × 3 → pon., śr., pt.; góra + nogi × 4 → bez par (pon., wt., czw., sob.)', () => {
    const t = demo();
    expect(ownPlan({ templateIds: [t[0].id], sessions: 2 })!.days).toEqual([t[0].id, null, null, t[0].id, null, null, null]);
    expect(ownPlan({ templateIds: [t[0].id], sessions: 3 })!.days).toEqual([t[0].id, null, t[0].id, null, t[0].id, null, null]);
    const r = ownPlan({ templateIds: [t[0].id, t[2].id], sessions: 4 })!;
    expect(r.days).toEqual([t[0].id, t[2].id, null, t[0].id, null, t[2].id, null]); expect(r.backToBack).toEqual([]); /* docs/24: 4 sesje → pon/wt/czw/sob, 0 par */
    expect(bestDays([prim(t[0].id), prim(t[2].id), prim(t[0].id), prim(t[2].id)], [0, 1, 3, 4])).toEqual([0, 1, 3, 5]);
  });
  test('przykład właściciela A/B/A/B: Upper A i Upper B (te same partie) × 4 — jedna para nie do uniknięcia (pokazana jako ostrzeżenie, nie blokada)', () => {
    const t = demo(); const r = ownPlan({ templateIds: [t[0].id, t[1].id], sessions: 4 })!;
    expect(r.seq).toEqual([t[0].id, t[1].id, t[0].id, t[1].id]); expect(r.backToBack.length).toBe(1);
    expect(ownWarnings(r).find(w => w.kind === 'pairs')!.text).toMatch(/^Dzień po dniu te same główne partie: .+\. Zwykle lepiej z dniem przerwy;/);
  });
});

describe('obciążenie tygodnia i ostrzeżenia — te same co w generatorze', () => {
  test('serie robocze jak w treningu (bez rozgrzewek), pomocnicza = 0,5; partie bez ćwiczeń — „Brak ćwiczeń na” (bez podpowiedzi sprzętu)', () => {
    const t = demo(); const r = ownPlan({ templateIds: [t[0].id], sessions: 2 })!;
    expect(r.missing).toEqual(['czworogłowe', 'dwugłowe', 'pośladki']);
    expect(ownWarnings(r).find(w => w.kind === 'missing')!.text).toBe('Brak ćwiczeń na: czworogłowe, dwugłowe, pośladki.');
    const before = r.weeklySets.klatka;
    const it = S().templates[0].items.find(i => store.exById(i.exerciseId)!.muscles[0] === 'klatka')!;
    store.tplSetKind(S().templates[0], it.id, store.tplRows(it)[0].id, 'warmup'); /* pierwsza seria jako rozgrzewka — nie liczy się */
    expect(ownPlan({ templateIds: [t[0].id], sessions: 2 })!.weeklySets.klatka).toBe(before - 2); /* 2 dni × 1 seria mniej */
  });
  test('rzadziej niż MIN_DAYS dni i poniżej WEEKLY_SETS_MARK serii — tekst progu dla masy (bez rad o czasie i sprzęcie generatora)', () => {
    const t = demo(); const r = ownPlan({ templateIds: [t[0].id, t[2].id], sessions: 2 })!;
    expect(r.rare.length).toBeGreaterThan(0); for (const m of r.rare) expect(r.freq[m]).toBeLessThan(MIN_DAYS);
    expect(ownWarnings(r).find(w => w.kind === 'rare')!.text).toMatch(/^Rzadziej niż 2 dni w tygodniu: /);
    const low = MAJOR.filter(m => (r.weeklySets[m] ?? 0) < WEEKLY_SETS_MARK && !r.missing.includes(m)); expect(low.length).toBeGreaterThan(0);
    expect(ownWarnings(r).find(w => w.kind === 'below')!.text).toBe(`Poniżej 10 serii tygodniowo: ${low.join(', ')}. To dolny próg zalecany przy budowie masy; serie dodasz w szablonach.`);
    const full = ownPlan({ templateIds: [t[0].id, t[2].id], sessions: 6 })!; expect(full.rare).toEqual([]); expect(ownWarnings(full).some(w => w.kind === 'rare')).toBe(false);
  });
  test('ćwiczenie cardio w szablonie nie liczy się do partii (jak sesja cardio generatora); weekLoad = jedna funkcja z generatorem', () => {
    const t = demo(); const run = S().exercises.find(e => e.lib && e.pattern === 'cardio')!;
    const before = ownPlan({ templateIds: [t[2].id], sessions: 2 })!;
    S().templates[2].items.push({ id: 'cardio-1', exerciseId: run.id, sets: 1, repMin: null, repMax: null, restSec: 0, startWeight: '', targetSec: 600, groupId: null }); store.save();
    const after = ownPlan({ templateIds: [t[2].id], sessions: 2 })!; expect(after.weeklySets).toEqual(before.weeklySets); expect(after.freq).toEqual(before.freq);
    const w = weekLoad([[{ exerciseId: ex('Back Squat').id, sets: 3 }], null, null, null, null, null, [{ exerciseId: ex('Back Squat').id, sets: 3 }]], id => store.exById(id));
    expect(w.backToBack).toEqual([[6, 0]]); expect(w.freq.czworogłowe).toBe(2); expect(w.weeklySets.czworogłowe).toBe(6);
    expect(weekLoad(Array(7).fill(null), () => undefined).missing).toEqual(MAJOR);
  });
});

describe('zapis — szablony bez zmian, plan nowy albo aktywny (activatePlan)', () => {
  const tplSnap = () => JSON.stringify(S().templates);
  test('„Tylko zapisz”: plan w „Inne plany” z nazwą „Moje szablony, n× w tygodniu”; drugi raz — nazwa bez powtórzeń; szablony nietknięte', () => {
    const t = demo(); const snap = tplSnap(); const r = ownPlan({ templateIds: [t[0].id, t[2].id], sessions: 3 })!;
    const a = saveOwnPlan(r, false); expect(a.planName).toBe('Moje szablony, 3× w tygodniu');
    expect(plan.savedPlans().find(p => p.id === a.planId)!.days).toEqual(r.days); expect(S().weekPlan).toBeUndefined();
    const b = saveOwnPlan(r, false); expect(b.planName).toBe('Moje szablony, 3× w tygodniu (2)');
    expect(tplSnap()).toBe(snap); expect(S().templates.length).toBe(4);
  });
  test('„Ustaw jako aktywny”: plan obowiązuje od dziś; poprzedni z jednorazową zmianą dnia trafia do „Inne plany” RAZEM z tą zmianą (B1) i wraca po ponownej aktywacji', () => {
    const t = demo(); plan.setWeekDay(0, t[1].id); plan.setDayPlan('2026-10-10', t[3].id); /* sobota: jednorazowo Legs — dom */
    expect(plan.activationNote()).toBe('Obecny plan zostanie w „Inne plany” razem ze zmianami pojedynczych dni od dziś (1) — wrócą, gdy znów go ustawisz.');
    const snap = tplSnap(); const r = ownPlan({ templateIds: [t[0].id, t[2].id], sessions: 4 })!; const res = saveOwnPlan(r, true);
    expect(plan.weekPlanDays()).toEqual(r.days); expect(plan.planName()).toBe(res.planName); expect(S().planOverrides ?? {}).toEqual({});
    const old = plan.savedPlans().find(p => p.days[0] === t[1].id)!; expect(old.overrides).toEqual({ '2026-10-10': t[3].id });
    plan.activatePlan(old.id); expect(plan.plannedOn('2026-10-10')).toBe(t[3].id); expect(plan.weekPlanDays()[0]).toBe(t[1].id);
    expect(tplSnap()).toBe(snap);
  });
  test('„Inne plany” pełne: zapis nie dodaje planu (planId pusty)', () => {
    const t = demo(); const r = ownPlan({ templateIds: [t[0].id], sessions: 2 })!;
    S().savedPlans = Array.from({ length: store.SAVED_PLANS_MAX }, (_, i) => ({ id: `p${i}`, name: `P${i}`, days: [null, null, null, null, null, null, null] })); store.save();
    expect(saveOwnPlan(r, false).planId).toBe(''); expect(plan.savedPlans().length).toBe(store.SAVED_PLANS_MAX);
  });
  test('EN: nazwa planu w języku z chwili zapisu', () => {
    const t = demo(); applyLang('en'); const r = ownPlan({ templateIds: [t[0].id], sessions: 2 }) as OwnResult;
    expect(ownPlanName(r)).toBe('My templates, 2× a week'); expect(ownWarnings(r).find(w => w.kind === 'missing')!.text).toMatch(/^No exercises for: /);
  });
});
