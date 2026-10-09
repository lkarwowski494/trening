/*
 * lib/generator.ts — testy granic i wyrocznie po testach mutacyjnych (audyt 0.10, fala 2, obszar TESTY — M2 / TST-02). Przeżyły m.in.: wybór dni
 * (koszt zmian względem układu domyślnego), sloty bojów (martwy ciąg / RDL, core), wykrywanie siłowni i domu, przerwy siły bez obciążenia,
 * zapas z pełnej biblioteki, kreska 10 serii (< vs <=), pary dzień po dniu z niedzielą i poniedziałkiem, minuty cardio, ostrzeżenia,
 * skracanie nazwy planu, zastępowanie wygenerowanych. Wyrocznie liczą wynik niezależnie dla wszystkich celów × sesji × minut × miejsc.
 */
import * as store from '@/lib/store';
import * as plan from '@/lib/plan';
import { addLocation, setEquip } from '@/lib/locations';
import { LOCATION_PRESETS, implAt, availability } from '@/lib/equipment';
import { WEEKLY_SETS_MARK } from '@/lib/stats';
import {
  generate, saveGenerated, replaceable, previewWarnings, genPlanName, bestDays, splitFor, hasExternalLoad, GEN_SESSIONS, GEN_MINUTES, MAJOR, MIN_DAYS,
  RIR_ACSM, WHO_MODERATE, WHO_VIGOROUS, SECONDARY_SHARE, type GenInput, type Goal,
} from '@/lib/generator';
import { fresh, addWorkout } from './helpers';

jest.setTimeout(120000);
const S = () => store.getState();
const ex = (id: string) => store.exById(id)!;
const inp = (o: Partial<GenInput> = {}): GenInput => ({ goal: 'hypertrophy', locationId: null, sessions: 3, minutes: 60, ...o });
beforeEach(async () => { jest.useFakeTimers({ now: new Date(2026, 9, 8, 9).getTime() }); await fresh(); });
afterEach(() => jest.useRealTimers());

test('stałe ze źródeł pokazywane w opisie generatora: RIR wg ACSM 2–3, WHO 150–300 min umiarkowanego / 75–150 intensywnego', () => {
  expect([RIR_ACSM, WHO_MODERATE, WHO_VIGOROUS]).toEqual([[2, 3], [150, 300], [75, 150]]);
});

describe('dni treningowe', () => {
  test('układ domyślny siły: 2 sesje pon/czw, 3 — pon/śr/pt', () => {
    expect([splitFor('strength', 2).days, splitFor('strength', 3).days]).toEqual([[0, 3], [0, 2, 4]]);
  });
  test('bestDays: bez par dzień po dniu, potem najmniej zmian względem układu domyślnego (pierwszy taki w kolejności), przy remisie — domyślny', () => {
    const same = [new Set(['klatka']), new Set(['klatka'])];
    expect(bestDays(same, [3, 4])).toEqual([0, 3]); /* [0,2] ma 2 zmiany, [0,3] — 1 */
    expect(bestDays(same, [0, 1])).toEqual([0, 2]);
    expect(bestDays([new Set(['a']), new Set(['b'])], [0, 1])).toEqual([0, 2]); /* bez wspólnych partii: dalej mniej dni pod rząd (drugie kryterium) */
    expect(bestDays([new Set(['a']), new Set(['b'])], [0, 2])).toEqual([0, 2]); /* remis z domyślnym — domyślny */
  });
});

describe('sloty ćwiczeń', () => {
  test('FBW B zaczyna martwy ciąg (zawias: dwugłowe pierwsze + pośladki), Dół A ma RDL (zawias: dwugłowe bez pośladków głównych); core — tylko core', () => {
    const fb = generate(inp({ sessions: 2, minutes: 90 })).templates.find(t => t.key === 'fbwB')!; const dl = ex(fb.items[0].exerciseId);
    expect([dl.pattern, dl.muscles[0], dl.muscles.includes('pośladki')]).toEqual(['hinge', 'dwugłowe', true]);
    const lo = generate(inp({ sessions: 4, minutes: 90 })).templates.find(t => t.key === 'loA')!; const rdl = ex(lo.items[1].exerciseId);
    expect([rdl.pattern, rdl.muscles[0], rdl.muscles.includes('pośladki')]).toEqual(['hinge', 'dwugłowe', false]);
    const fa = generate(inp({ sessions: 2, minutes: 90 })).templates.find(t => t.key === 'fbwA')!; const c = ex(fa.items[fa.items.length - 1].exerciseId);
    expect([c.muscles[0], c.pattern?.startsWith('core')]).toEqual(['core', true]);
  });
  test('ćwiczenia w archiwum i własne (spoza biblioteki) nie trafiają do szablonów', () => {
    const r0 = generate(inp()); const first = r0.templates[0].items[0].exerciseId; ex(first).archived = true; store.save(ex(first));
    const own = store.newExercise('Mój przysiad'); Object.assign(own, { pattern: 'squat', muscles: ['czworogłowe'], metric: 'weight_reps' }); store.save(own);
    const r = generate(inp()); const used = r.templates.flatMap(t => t.items.map(i => i.exerciseId));
    expect(used).not.toContain(first); expect(used).not.toContain(own.id);
  });
  test('masa ciała: zapas z pełnej biblioteki bez powtórzeń w szablonie; każdy slot zajęty, gdy jest choć jeden kandydat', () => {
    const l = addLocation('bodyweight');
    for (const s of [2, 3, 4, 5, 6]) for (const t of generate(inp({ locationId: l.id, sessions: s, minutes: 90 })).templates) { const ids = t.items.map(i => i.exerciseId); expect([t.key, new Set(ids).size]).toEqual([t.key, ids.length]); }
  });
});

describe('miejsce: siłownia, dom, obciążenie zewnętrzne', () => {
  test('hasExternalLoad: niedostępne w miejscu — nie; suwnica Smitha w miejscu ze Smithem — tak', () => {
    const gym = addLocation('gym'); const home = addLocation('bodyweight');
    const lp = S().exercises.find(e => e.name === 'Leg Press')!; expect([hasExternalLoad(lp, gym), hasExternalLoad(lp, home), availability(lp, home).ok]).toEqual([true, false, false]);
    const sm = S().exercises.find(e => e.lib && e.loadSource === 'smith' && availability(e, gym).ok);
    if (sm) { expect(hasExternalLoad(sm, gym)).toBe(true); expect(implAt(sm, gym) === undefined || hasExternalLoad(sm, gym)).toBe(true); }
    expect(!!sm).toBe(true);
  });
  test('dom = brak siłowego sprzętu (sztanga, wyciąg, maszyny) w miejscu: hotel z hantlami — dom; siłownia — nie; przerwy siły bez obciążenia jak przy masie', () => {
    const gym = addLocation('gym'); const hotel = addLocation('hotel'); const bw = addLocation('bodyweight');
    expect([generate(inp({ locationId: gym.id })).home, generate(inp({ locationId: hotel.id })).home, generate(inp({ locationId: null })).home]).toEqual([false, true, false]);
    expect([generate(inp({ goal: 'strength', locationId: gym.id })).avgRest, generate(inp({ goal: 'strength', locationId: bw.id })).avgRest, generate(inp({ goal: 'hypertrophy', locationId: gym.id })).avgRest]).toEqual([150, 105, 105]);
  });
  test('podpowiedź sprzętu: tylko sprzęt, którego w miejscu nie ma (wyłączony się nie liczy), kolejność od najtańszego, bez powtórzeń', () => {
    const bw = addLocation('bodyweight'); const r = generate(inp({ locationId: bw.id }));
    expect(r.missing.length).toBeGreaterThan(0); expect(r.helps.length).toBeGreaterThan(0); expect(new Set(r.helps).size).toBe(r.helps.length);
    const first = r.helps[0]; setEquip(bw, 'pullup_bar', true); const r2 = generate(inp({ locationId: bw.id })); expect(r2.helps).not.toContain(first);
    const e = bw.equipment.find(x => x.item === 'pullup_bar')!; e.off = true; store.save(); const r3 = generate(inp({ locationId: bw.id })); expect(r3.helps[0]).toBe(first);
    expect(generate(inp({ locationId: null })).helps).toEqual([]); /* bez miejsca — pełna siłownia, bez podpowiedzi */
  });
});

describe('wyrocznie dla wszystkich celów × sesji × minut × miejsc', () => {
  const all = () => { const locs: (string | null)[] = [null, ...LOCATION_PRESETS.map(p => addLocation(p).id)]; const out: GenInput[] = [];
    for (const goal of ['strength', 'hypertrophy', 'cut'] as Goal[]) for (const sessions of GEN_SESSIONS[goal]) for (const minutes of GEN_MINUTES) for (const locationId of locs) out.push({ goal, sessions, minutes, locationId });
    return out; };
  test('pary dzień po dniu wykrywane, gdy się nie da ich uniknąć (wszystkie ćwiczenia na tę samą partię): każda para sąsiednich dni', () => {
    for (const e of S().exercises) if (e.lib) e.muscles = ['klatka', ...e.muscles.filter(m => m !== 'klatka')];
    let pairs = 0;
    for (const sessions of [4, 5, 6]) { const r = generate(inp({ sessions, minutes: 45 }));
      const on = (d: number) => r.days[d] != null && r.templates[r.days[d]!].items.some(it => !it.targetSec);
      const exp: [number, number][] = []; for (let d = 0; d < 7; d++) if (on(d) && on((d + 1) % 7)) exp.push([d, (d + 1) % 7]);
      expect([sessions, r.backToBack]).toEqual([sessions, exp]); pairs += exp.length;
      if (exp.length) expect(previewWarnings(r, inp({ sessions })).map(w => w.kind)).toContain('pairs'); }
    expect(pairs).toBeGreaterThan(2);
  });
  test('pary dzień po dniu (z niedzielą → poniedziałkiem), serie, dni na partię, kreska 10 serii (< nie <=), minuty cardio, ostrzeżenia — zgodne z niezależnym liczeniem', () => {
    let eq10 = 0, pairs = 0, wrap = 0;
    for (const i of all()) {
      const r = generate(i); const where = JSON.stringify(i);
      const prim = (d: number) => { const ti = r.days[d]; return new Set(ti == null ? [] : r.templates[ti].items.filter(it => !it.targetSec).flatMap(it => ex(it.exerciseId).muscles)); };
      const exp: [number, number][] = []; for (let d = 0; d < 7; d++) { const n = (d + 1) % 7; const a = prim(d), b = prim(n); if ([...a].some(m => b.has(m))) exp.push([d, n]); }
      expect([where, r.backToBack]).toEqual([where, exp]); pairs += exp.length; wrap += exp.filter(([d]) => d === 6).length;
      const ws: Record<string, number> = {}; const fq: Record<string, number> = {};
      r.days.forEach(ti => { if (ti == null) return; const its = r.templates[ti].items.filter(it => !it.targetSec); const pri = new Set<string>(), sec = new Set<string>();
        for (const it of its) { const e = ex(it.exerciseId); e.muscles.forEach(m => { ws[m] = (ws[m] ?? 0) + it.sets; pri.add(m); }); e.secondaryMuscles.forEach(m => { ws[m] = (ws[m] ?? 0) + it.sets * SECONDARY_SHARE; sec.add(m); }); }
        new Set([...pri, ...sec]).forEach(m => { fq[m] = (fq[m] ?? 0) + (pri.has(m) ? 1 : SECONDARY_SHARE); }); });
      expect([where, r.weeklySets, r.freq]).toEqual([where, ws, fq]);
      expect([where, r.below10]).toEqual([where, i.goal === 'strength' ? [] : MAJOR.filter(m => (ws[m] ?? 0) < WEEKLY_SETS_MARK)]);
      eq10 += MAJOR.filter(m => ws[m] === WEEKLY_SETS_MARK).length;
      expect([where, r.missing, r.rare]).toEqual([where, MAJOR.filter(m => !(ws[m] > 0)), MAJOR.filter(m => ws[m] > 0 && (fq[m] ?? 0) < MIN_DAYS)]);
      const cardioDays = r.days.filter(ti => ti != null && r.templates[ti].key === 'cardio').length;
      expect([where, r.cardioMin]).toEqual([where, i.goal === 'cut' && cardioDays ? i.minutes * cardioDays : 0]);
      const kinds = previewWarnings(r, i).map(w => w.kind);
      const ek = [i.goal === 'strength' && r.unloaded ? 'unloaded' : '', r.missing.length ? 'missing' : '', r.rare.length ? 'rare' : '', r.below10.some(m => !r.missing.includes(m)) ? 'below' : '', r.backToBack.length ? 'pairs' : ''].filter(Boolean);
      expect([where, kinds]).toEqual([where, ek]);
      if (i.goal === 'cut') { const c = r.templates.find(t => t.key === 'cardio')!; const e = ex(c.items[0].exerciseId); expect([e.pattern, e.loadSource, ['distance_time', 'time'].includes(e.metric), c.items[0].targetSec]).toEqual(['cardio', 'none', true, i.minutes * 60]); }
    }
    /* po researchu partii (09.10.2026) układ dni nie ma par dla żadnej konfiguracji (pary — test wyżej); niedziela nie bywa dniem siłowym
     * (bestDays: koszt niedzieli), więc para niedziela → poniedziałek jest nieosiągalna — zostaje w wyroczni na przyszłość */
    expect([pairs, wrap, eq10]).toEqual([0, 0, 0]);
    /* kreska 10 serii: serie partii to wielokrotność 1,5 (SETS_PER_EX 3 × SECONDARY_SHARE 0,5), a 10 nią nie jest — granica „< vs <=” nieosiągalna
     * z generatora (mutant równoważny, docs/09); wyrocznia below10 wyżej i tak porównuje każdą wartość */
  });
  test('ostrzeżenia: brakujące partie z podpowiedzią sprzętu w jednym tekście; pary z dniami tygodnia', () => {
    const bw = addLocation('bodyweight'); const i = inp({ locationId: bw.id }); const r = generate(i); const w = previewWarnings(r, i);
    const miss = w.find(x => x.kind === 'missing')!; expect(miss.text).toMatch(/^Brak ćwiczeń na: .+\. Przyda się: .+\.$/);
    for (const e of S().exercises) if (e.lib) e.muscles = ['klatka']; const i5 = inp({ sessions: 6, minutes: 45 }); expect(previewWarnings(generate(i5), i5).find(x => x.kind === 'pairs')!.text).toMatch(/^Dzień po dniu te same główne partie: pon\.–wt\./);
  });
});

describe('nazwa planu i zapis', () => {
  test('genPlanName: długa nazwa miejsca skrócona z „…” do limitu 40; mieszcząca się — bez skracania', () => {
    const l = addLocation('gym'); l.name = 'Siłownia przy ulicy Długiej w centrum miasta'; store.save();
    const n = genPlanName(inp({ locationId: l.id })); expect(n.length).toBeLessThanOrEqual(40); expect(n.endsWith('…')).toBe(true); expect(n.startsWith('Masa, 3× w tygodniu · Siłownia')).toBe(true);
    l.name = 'Dom'; expect(genPlanName(inp({ locationId: l.id }))).toBe('Masa, 3× w tygodniu · Dom');
    l.name = 'X'.repeat(40 - 'Masa, 3× w tygodniu · '.length); expect(genPlanName(inp({ locationId: l.id })).endsWith('…')).toBe(false); /* dokładnie 40 */
    l.name = 'X'.repeat(41 - 'Masa, 3× w tygodniu · '.length); const m = genPlanName(inp({ locationId: l.id })); expect([m.length, m.endsWith('X…')]).toEqual([40, true]);
  });
  test('saveGenerated: domyślnie bez zastępowania; zapis oznacza dane jako zmienione; bez aktywacji — nazwa planu z „Inne plany”', () => {
    const i = inp(); const a = saveGenerated(generate(i), i, false); expect(S().userTouched).toBe(true); expect(a.planName).toBe(plan.savedPlans().find(p => p.id === a.planId)!.name);
    const b = saveGenerated(generate(i), i, false); expect(S().templates.length).toBe(a.templateIds.length * 2); expect(b.planName).toBe(`${a.planName} (2)`);
    expect(plan.savedPlans().find(p => p.id === b.planId)!.days.filter(Boolean).length).toBe(3);
  });
  test('replaceable: szablon bez folderu albo w innym folderze — nie; użyty w treningu, w toku albo trzymany przez inny zapisany plan — nie', () => {
    const i = inp(); const a = saveGenerated(generate(i), i, false); const [t1, t2] = a.templateIds;
    expect(replaceable().templateIds.sort()).toEqual([...a.templateIds].sort()); expect(replaceable().planIds).toEqual([a.planId]);
    S().templates.find(t => t.id === t1)!.folder = 'Moje'; S().templates.push({ ...S().templates.find(t => t.id === t2)!, id: 'bez-folderu', folder: undefined } as never);
    expect(replaceable().templateIds).not.toContain(t1); expect(replaceable().templateIds).not.toContain('bez-folderu');
    S().templates.find(t => t.id === t1)!.folder = a.folder; addWorkout(Date.now() - 86400e3, [['Back Squat', [{ weight: 100, reps: 5 }]]]); S().workouts[0].templateId = t1;
    expect(replaceable().templateIds).not.toContain(t1); S().workouts[0].templateId = null;
    store.startFromTemplate(S().templates.find(t => t.id === t2)!); expect(replaceable().templateIds).not.toContain(t2); store.cancelWorkout();
    S().savedPlans!.push({ id: 'inny', name: 'Inny', days: [t2, 'cudzy', null, null, null, null, null] }); expect(replaceable().templateIds).not.toContain(t2); expect(replaceable().templateIds).toContain(t1);
  });
});
