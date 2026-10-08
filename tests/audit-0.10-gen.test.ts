/*
 * Audyt 0.10.0 (08.10.2026, docs/25 grupa C i B1 — część generatora): testy regresji logiki generatora. Każdy test odtwarza znalezisko
 * (testy dowodowe audytorów zz-audit-mer-gen*, zz-audit-log-e/f, zz-audit-x-qty) i sprawdza zachowanie po naprawie (rekomendacje A, docs/18).
 * Ekran: tests/audit-0.10-gen-ui.test.tsx. Rodzaje (docs/20): logika, macierz (210 konfiguracji), dane (zapis, migrate, eksport/import), regresja.
 */
import * as store from '@/lib/store';
import * as plan from '@/lib/plan';
import { addLocation, setEquip } from '@/lib/locations';
import { presetEquipment, presetHint, LOCATION_PRESETS, type LocationPreset } from '@/lib/equipment';
import { activationNote } from '@/lib/planActivation';
import { workoutActivityType, HK_ACTIVITY } from '@/lib/health';
import {
  generate, saveGenerated, replaceable, previewWarnings, hasExternalLoad, bestDays, genPlanName, genNote, genFolder, splitFor, setsBudget,
  GEN_SESSIONS, GEN_MINUTES, MAJOR, REPS, REST, SETS_PER_EX, MIN_DAYS, SECONDARY_SHARE, RIR, AVG_REST, HELP_EQUIP, PLAN_NAME_MAX, type Goal, type GenInput,
} from '@/lib/generator';
import { WEEKLY_SETS_MARK } from '@/lib/stats';
import { applyLang, t } from '@/lib/i18n';
import { fresh, saved, addWorkout, withDemoTemplates } from './helpers';

const S = () => store.getState();
const exOf = (id: string) => store.exById(id)!;
const inp = (o: Partial<GenInput> = {}): GenInput => ({ goal: 'hypertrophy', locationId: null, sessions: 3, minutes: 60, ...o });
const locOf = (id: string | null) => S().settings.locations.find(l => l.id === id) ?? null;
beforeEach(async () => { jest.useFakeTimers({ now: new Date(2026, 9, 8, 9).getTime() }); await fresh(); });
afterEach(() => applyLang('pl'));

/** Pięć presetów miejsc z audytu (bez miejsca = pełna siłownia) — każda nowa wartość LOCATION_PRESETS wchodzi do macierzy sama. */
const places = (): Record<string, string | null> => ({ none: null, ...Object.fromEntries(LOCATION_PRESETS.map(p => [p, addLocation(p).id])) });

describe('macierz 210 konfiguracji: cel × sesje × czas × 5 miejsc (MER-01, MER-02, LOG-03, X-10)', () => {
  test('bez 4–6 przy sile bez obciążenia; każda partia z 0 serii albo < 2 dni w ostrzeżeniu; bez pustych szablonów; core/izolacja bez 2 min przy sile', () => {
    const locs = places(); let n = 0;
    for (const goal of ['strength', 'hypertrophy', 'cut'] as Goal[]) for (const sessions of GEN_SESSIONS[goal]) for (const minutes of GEN_MINUTES) for (const [ln, lid] of Object.entries(locs)) {
      const i = inp({ goal, locationId: lid, sessions, minutes }); const r = generate(i); n++; const where = `${goal} ${sessions}× ${minutes} min ${ln}`;
      const items = r.templates.flatMap(tp => tp.items.filter(it => !it.targetSec));
      /* MER-01: ciężkie serie (górna granica ≤ REPS.heavy) tylko z obciążeniem zewnętrznym obecnym w miejscu */
      expect([where, items.filter(it => it.repMax != null && it.repMax <= REPS.heavy[1] && !hasExternalLoad(exOf(it.exerciseId), locOf(lid))).map(it => exOf(it.exerciseId).name)]).toEqual([where, []]);
      /* MER-01: przy sile ćwiczenia core i jednostawowe — przerwa jak przy izolacji, nie 2 min */
      if (goal === 'strength') expect([where, items.filter(it => { const e = exOf(it.exerciseId); return (e.pattern === 'isolation' || e.muscles[0] === 'core') && it.restSec > REST.iso; }).length]).toEqual([where, 0]);
      /* MER-02 / LOG-03: dni na partię (główna 1, tylko pomocnicza SECONDARY_SHARE) — każda główna partia z 0 serii albo < MIN_DAYS w widocznym ostrzeżeniu */
      const freq: Record<string, number> = {};
      r.days.forEach(ti => { if (ti == null) return; const its = r.templates[ti].items.filter(it => !it.targetSec); const P = new Set(its.flatMap(it => exOf(it.exerciseId).muscles)); const A = new Set(its.flatMap(it => exOf(it.exerciseId).secondaryMuscles));
        new Set([...P, ...A]).forEach(m => { freq[m] = (freq[m] ?? 0) + (P.has(m) ? 1 : SECONDARY_SHARE); }); });
      expect([where, r.freq]).toEqual([where, freq]);
      const low = MAJOR.filter(m => !(r.weeklySets[m] > 0) || (freq[m] ?? 0) < MIN_DAYS); const w = previewWarnings(r, i).map(x => x.text).join('\n');
      expect([where, low.filter(m => !w.includes(t(m)))]).toEqual([where, []]);
      expect([where, [...r.missing, ...r.rare].sort()]).toEqual([where, [...low].sort()]);
      /* X-10: żaden szablon nie jest pusty; siła w miejscu bez obciążenia — ostrzeżenie */
      expect([where, r.templates.filter(tp => !tp.items.length).map(tp => tp.key)]).toEqual([where, []]);
      if (goal === 'strength' && r.unloaded) expect(w).toContain(t('Siła bez obciążenia zewnętrznego'));
      expect([where, r.unloaded]).toEqual([where, ln === 'home' || ln === 'bodyweight']);
    }
    expect(n).toBe(210);
  });
});

describe('C1 / MER-01: cel „Siła” bez obciążenia zewnętrznego', () => {
  test.each(['home', 'bodyweight'] as LocationPreset[])('%s: zakresy jak masa w domu (12–20), przerwy jak masa, ostrzeżenie; budżet z przerw masy', p => {
    const l = addLocation(p); const r = generate(inp({ goal: 'strength', locationId: l.id }));
    expect(r.unloaded).toBe(true); expect(r.budget).toBe(setsBudget('hypertrophy', 60)); expect(r.avgRest).toBe(AVG_REST.hypertrophy);
    r.templates.flatMap(tp => tp.items).forEach(it => { expect(it).toMatchObject({ sets: SETS_PER_EX, repMin: REPS.home[0], repMax: REPS.home[1] }); expect(it.restSec).toBeLessThanOrEqual(REST.multi); });
    const dead = r.templates.flatMap(tp => tp.items).find(it => exOf(it.exerciseId).name === 'Dead Bug'); expect(dead?.restSec).toBe(REST.iso); /* było 120 s (MER-01) */
    const w = previewWarnings(r, inp({ goal: 'strength', locationId: l.id })).map(x => x.text).join('\n');
    expect(w).toContain(t('Siła bez obciążenia zewnętrznego')); expect(w).not.toMatch(/80% maksimum i więcej/);
  });
  test('hotel (hantle): siła ciężko tylko z hantlami — bój główny 4–6, dodatkowe 6–10, izolacja 90 s; bez ostrzeżenia', () => {
    const l = addLocation('hotel'); const r = generate(inp({ goal: 'strength', locationId: l.id })); expect(r.unloaded).toBe(false);
    for (const tp of r.templates) { expect(tp.items[0]).toMatchObject({ repMin: REPS.heavy[0], repMax: REPS.heavy[1], restSec: REST.heavy }); expect(hasExternalLoad(exOf(tp.items[0].exerciseId), l)).toBe(true); }
    expect(previewWarnings(r, inp({ goal: 'strength', locationId: l.id })).map(x => x.text).join('\n')).not.toContain(t('Siła bez obciążenia zewnętrznego'));
  });
  test('hasExternalLoad: masa ciała i guma — nie; hantle tylko zalecane, a w miejscu ich nie ma — nie; bez miejsca sztanga — tak', () => {
    const bw = addLocation('bodyweight'); const ex = (n: string) => S().exercises.find(e => e.name === n)!;
    expect(hasExternalLoad(ex('Push Up'), null)).toBe(false); expect(hasExternalLoad(ex('Back Squat'), null)).toBe(true);
    expect(hasExternalLoad(ex('Walking Lunges'), bw)).toBe(false); expect(hasExternalLoad(ex('Walking Lunges'), addLocation('hotel'))).toBe(true);
  });
});

describe('C2 / MER-02 / LOG-03: częstotliwość partii dla każdego celu, braki ze sprzętem, atrybucja', () => {
  test('masa ciała, każdy cel: plecy i biceps „Brak ćwiczeń na” z podpowiedzią sprzętu (drążek, gumy); po dodaniu drążka plecy > 0', () => {
    const l = addLocation('bodyweight');
    for (const goal of ['strength', 'hypertrophy', 'cut'] as Goal[]) {
      const i = inp({ goal, locationId: l.id, sessions: 4 }); const r = generate(i);
      expect(r.missing).toEqual(expect.arrayContaining(['plecy', 'biceps'])); expect(r.helps.length).toBeGreaterThan(0);
      const w = previewWarnings(r, i).map(x => x.text).join('\n'); expect(w).toContain(t('Brak ćwiczeń na: {list}.', { list: r.missing.map(m => t(m)).join(', ') }));
      expect(w).toContain(t('Przyda się: {list}.', { list: r.helps.join(', ') })); expect(r.helps[0]).toBe('drążek');
    }
    setEquip(l, HELP_EQUIP[0], true); const r2 = generate(inp({ locationId: l.id, sessions: 4 })); expect(r2.weeklySets.plecy).toBeGreaterThan(0); expect(r2.missing).not.toContain('plecy');
  });
  test('siła na siłowni 3×: biceps i triceps tylko jako pomocnicze (3 × 0,5 = 1,5 dnia) → „Rzadziej niż 2 dni”; plecy, barki — nie', () => {
    const r = generate(inp({ goal: 'strength' })); expect(r.freq.biceps).toBe(1.5); expect(r.rare).toEqual(expect.arrayContaining(['biceps', 'triceps']));
    expect(r.rare).not.toContain('plecy'); expect(r.below10).toEqual([]); /* kreska serii tylko dla masy i redukcji (R2) */
    expect(previewWarnings(r, inp({ goal: 'strength' })).map(x => x.text).join('\n')).toMatch(/^Rzadziej niż 2 dni w tygodniu: .*biceps \(1,5\)/m);
  });
  test('kreska serii z WEEKLY_SETS_MARK (nie literał 10); partia bez serii nie dubluje się w „Poniżej”', () => {
    const bw = addLocation('bodyweight'); const r = generate(inp({ locationId: bw.id }));
    expect(r.below10).toEqual(MAJOR.filter(m => (r.weeklySets[m] ?? 0) < WEEKLY_SETS_MARK));
    const below = previewWarnings(r, inp({ locationId: bw.id })).find(x => x.kind === 'below')!.text;
    expect(below).toMatch(/^Poniżej 10 serii tygodniowo: /); for (const m of r.missing) expect(below).not.toContain(t(m));
  });
});

describe('C5 / LOG-10: dni z najmniejszą liczbą par dzień po dniu', () => {
  test('4 sesje (góra/dół): pon/wt/czw/sob — 0 par (było czw–pt: Góra B → Dół B, wspólne plecy)', () => {
    for (const goal of ['strength', 'hypertrophy'] as Goal[]) { const r = generate(inp({ goal, sessions: 4 })); expect(r.backToBack).toEqual([]); expect(r.days.map((d, i) => (d == null ? null : i)).filter(x => x != null)).toEqual([0, 1, 3, 5]); }
  });
  test('5 i 6 sesji: nie więcej par niż w układzie domyślnym; bestDays przy remisie zostawia układ domyślny', () => {
    for (const n of [5, 6]) { const r = generate(inp({ sessions: n })); expect(r.backToBack.length).toBeLessThan(2); }
    const none = new Set<string>(); expect(bestDays([none, none, none], splitFor('hypertrophy', 3).days)).toEqual([0, 2, 4]);
    const a = new Set(['plecy']); expect(bestDays([a, a], [0, 1])).toEqual([0, 2]); /* wspólna partia — nie dzień po dniu (pierwszy układ bez pary, najbliżej domyślnego) */
  });
});

describe('C3 / UX-10: zapis — nazwa planu z miejscem, notatka wysiłku, zastąpienie nieużywanych, puste szablony', () => {
  test('nazwa planu z miejscem (bez miejsca — pełna siłownia); notatka RIR w każdym szablonie siłowym; folder i nazwy w języku z chwili zapisu', () => {
    const dom = addLocation('home', 'Dom'); const i = inp({ locationId: dom.id });
    expect(genPlanName(i)).toBe('Masa, 3× w tygodniu · Dom'); expect(genPlanName(inp())).toBe('Masa, 3× w tygodniu · Pełna siłownia');
    /* długa nazwa miejsca: skrócone miejsce z „…”, całość mieści się w limicie nazwy planu (ten sam co w lib/plan.ts) */
    const far = addLocation('hotel', 'Siłownia w pracy, Mokotów 🏋️ piętro 2'); const long = genPlanName(inp({ locationId: far.id }));
    expect(long.length).toBeLessThanOrEqual(PLAN_NAME_MAX); expect(long).toMatch(/^Masa, 3× w tygodniu · Siłownia w pracy.*…$/);
    const xid = plan.addPlan('x'.repeat(PLAN_NAME_MAX + 5), [], false); expect(plan.savedPlans().find(p => p.id === xid)!.name).toHaveLength(PLAN_NAME_MAX); plan.deletePlan(xid);
    const res = saveGenerated(generate(i), i, false); const tpls = res.templateIds.map(id => S().templates.find(x => x.id === id)!);
    expect(tpls.map(x => x.note)).toEqual(tpls.map(() => t('Wysiłek: zwykle {a}–{b} powtórzenia w zapasie (RIR); do upadku nie trzeba.', { a: RIR[0], b: RIR[1] })));
    expect(tpls[0].note).toBe('Wysiłek: zwykle 0–3 powtórzenia w zapasie (RIR); do upadku nie trzeba.'); expect(tpls[0].note).toBe(genNote()); expect(tpls.map(x => x.folder)).toEqual([genFolder(), genFolder()]);
    expect(plan.savedPlans().find(p => p.id === res.planId)!.name).toBe('Masa, 3× w tygodniu · Dom');
    applyLang('en'); const c = inp({ goal: 'cut', sessions: 4 }); const r2 = saveGenerated(generate(c), c, false); const t2 = r2.templateIds.map(id => S().templates.find(x => x.id === id)!);
    expect(t2.map(x => [x.name, x.folder])).toEqual([['Full Body A', 'Generated'], ['Full Body B', 'Generated'], ['Cardio', 'Generated']]);
    expect(t2[2].note).toBeUndefined(); /* cardio: RIR nie dotyczy */ expect(plan.savedPlans().find(p => p.id === r2.planId)!.name).toBe('Fat loss, 4× per week · Full gym');
  });
  test('ponowne generowanie: zastąpienie nieużywanych (szablony + plan zrobiony tylko z nich) — bez „(2)”; użyte w treningu, w aktywnym planie i zmianie dnia zostają', () => {
    const i = inp(); const first = saveGenerated(generate(i), i, false); expect(replaceable()).toEqual({ templateIds: first.templateIds, planIds: [first.planId] });
    const second = saveGenerated(generate(i), i, false, true);
    expect(S().templates.map(x => x.name)).toEqual(['FBW A', 'FBW B']); expect(plan.savedPlans().map(p => p.id)).toEqual([second.planId]);
    /* trening z szablonu → szablon i plan zostają; drugi szablon trzyma plan */
    addWorkout(Date.now() - 864e5, [['Back Squat', [{ weight: 100, reps: 5 }]]]).templateId = second.templateIds[0]; store.save();
    expect(replaceable()).toEqual({ templateIds: [], planIds: [] });
    /* aktywny plan i zmiana dnia też trzymają szablon */
    const third = saveGenerated(generate(i), i, true); expect(replaceable().templateIds).not.toContain(third.templateIds[0]);
    plan.activatePlan(second.planId); plan.setDayPlan('2026-10-12', third.templateIds[1]); expect(replaceable().templateIds).toEqual([]);
  });
  test('ręczny szablon w folderze „Wygenerowane” bez użycia też jest do zastąpienia (folder w dowolnym języku), ale tylko gdy nie w aktywnym planie', () => {
    const tpl = store.newTemplate(); tpl.folder = 'Generated'; store.save(); expect(replaceable().templateIds).toEqual([tpl.id]);
    plan.setWeekDay(2, tpl.id); expect(replaceable().templateIds).toEqual([]);
  });
  test('X-10: pusty szablon nie trafia do zapisu ani do planu (dzień wolny)', () => {
    const i = inp(); const r = generate(i); r.templates[1].items = []; const res = saveGenerated(r, i, true);
    expect(res.templateIds).toHaveLength(1); expect(plan.weekPlanDays().filter(Boolean)).toHaveLength(2);
  });
  test('dane: notatka szablonu — migrate przycina i usuwa złe wartości, eksport → import → restart bez strat, duplikat ją kopiuje', async () => {
    const i = inp(); saveGenerated(generate(i), i, false); const a = S().templates[0];
    const dup = store.dupTemplate(a.id); expect(dup.note).toBe(a.note);
    store.setTemplateNote(a, '  x  ' + 'y'.repeat(500)); expect(a.note!.length).toBe(store.TEMPLATE_NOTE_MAX);
    store.setTemplateNote(a, '😀'.repeat(store.TEMPLATE_NOTE_MAX + 3)); expect(Array.from(a.note!)).toHaveLength(store.TEMPLATE_NOTE_MAX); expect(a.note).toBe('😀'.repeat(store.TEMPLATE_NOTE_MAX)); /* bez przeciętych emoji */
    store.setTemplateNote(a, '   '); expect(a.note).toBeUndefined(); store.setTemplateNote(a, 'RIR 2'); await store.flush();
    const raw = saved(); (raw.templates[1] as any).note = 42; (raw.templates[2] as any).note = '  a  ';
    const m = store.migrate(JSON.parse(JSON.stringify(raw))); expect(m.templates.map(x => x.note)).toEqual(['RIR 2', undefined, 'a']);
    expect(store.migrate(JSON.parse(JSON.stringify(m)))).toEqual(m); /* idempotentne */
    await fresh(JSON.parse(JSON.stringify(saved()))); expect(S().templates[0].note).toBe('RIR 2');
  });
});

describe('B1 / UI-02 / X-07 / DAT-02 / LOG-05: tekst aktywacji (wspólny z ekranem Plan)', () => {
  test('liczba zmian dni od dziś; obietnica „Obecny plan zostanie zapisany” tylko, gdy activatePlan go naprawdę zapisze', () => {
    expect(activationNote()).toBe(''); /* pusty plan, bez zmian */
    const [A] = withDemoTemplates(); plan.setDayPlan('2026-10-10', A.id); plan.setDayPlan('2026-10-12', A.id); plan.setDayPlan('2026-10-01', A.id); /* 2 od dziś + 1 przeszła */
    expect(plan.weekPlanDays().some(Boolean)).toBe(false); expect(activationNote()).toBe('Zmiany pojedynczych dni od dziś zostaną usunięte: 2.');
    const before = plan.savedPlans().length; const i = inp(); saveGenerated(generate(i), i, true);
    expect(plan.savedPlans().length).toBe(before); /* pusty plan nie trafił do „Inne plany” — tekst niczego nie obiecywał */ expect(plan.futureChanges()).toBe(0);
    expect(activationNote()).toBe('Obecny plan zostanie zapisany w „Inne plany”.');
    plan.setDayPlan('2026-10-14', null); expect(activationNote()).toBe('Obecny plan zostanie zapisany w „Inne plany”. Zmiany pojedynczych dni od dziś zostaną usunięte: 1.');
    /* obietnica prawdziwa: po aktywacji innego planu obecny jest w „Inne plany” */
    const p2 = saveGenerated(generate(i), i, false).planId; const cur = JSON.stringify(plan.weekPlanDays()); expect(activationNote()).toMatch(/^Obecny plan zostanie zapisany/);
    plan.activatePlan(p2); expect(plan.savedPlans().some(p => JSON.stringify(p.days) === cur)).toBe(true);
  });
});

describe('LOG-08: opis presetów miejsc z danych presetEquipment (kg i lb)', () => {
  test('siłownia i hotel: liczby z presetu w jednostce; dom i masa ciała bez liczb', () => {
    expect(presetHint('gym', 'kg')).toBe('cały sprzęt; sztanga 20 kg + talerze 25…1,25 kg; hantle 2,5–50 kg co 2,5');
    expect(presetHint('gym', 'lb')).toBe('cały sprzęt; sztanga 45 lb + talerze 45…2,5 lb; hantle 5–100 lb co 5');
    expect(presetHint('hotel', 'kg')).toBe('hantle 2,5–25 kg, ławka regulowana, mata, bieżnia, rower');
    expect(presetHint('hotel', 'lb')).toBe('hantle 5–50 lb, ławka regulowana, mata, bieżnia, rower');
    expect(presetHint('home', 'lb')).toBe('pusto — zaznaczysz, co masz'); expect(presetHint('bodyweight', 'kg')).toBe('tylko mata');
    /* każda pozycja hotelu nazwana w opisie (lista z danych) */ expect(presetHint('hotel').split(', ')).toHaveLength(presetEquipment('hotel').length);
  });
});

describe('C5 / MER-18: trening cardio w Zdrowiu nie jako siłowy', () => {
  test('rodzaj treningu HealthKit z ćwiczeń: bieg → running, kilka cardio → mixedCardio, siłowy bez zmian', () => {
    const w = addWorkout(Date.now(), [['Bieg', [{ durationSec: 1800 }]]]); expect(workoutActivityType(w)).toBe(HK_ACTIVITY.running);
    const m = addWorkout(Date.now(), [['Bieg', [{ durationSec: 600 }]], ['Rower', [{ durationSec: 600 }]]]); expect(workoutActivityType(m)).toBe(HK_ACTIVITY.mixedCardio);
    expect(workoutActivityType(addWorkout(Date.now(), [['Back Squat', [{ weight: 100, reps: 5 }]]]))).toBe(HK_ACTIVITY.traditionalStrength);
    expect(workoutActivityType(addWorkout(Date.now(), [['Push Up', [{ reps: 10 }]]]))).toBe(HK_ACTIVITY.functionalStrength);
    const c = saveGenerated(generate(inp({ goal: 'cut', sessions: 4 })), inp({ goal: 'cut', sessions: 4 }), false); const card = S().templates.find(x => x.id === c.templateIds[2])!;
    const cw = addWorkout(Date.now(), [[exOf(card.items[0].exerciseId).name, [{ durationSec: 2700 }]]]); expect(workoutActivityType(cw)).not.toBe(HK_ACTIVITY.traditionalStrength);
  });
});

describe('C5 / LOG-11 / TST-10: liczby generatora tylko w stałych lib/generator.ts', () => {
  test('teksty generatora (ekran i lib) bez liczb wpisanych na sztywno — poza nazwami źródeł (WHO 2020, ACSM 2026) i przeliczeniem „× 60”', () => {
    const fs = require('fs'); const path = require('path');
    const keys = ['app/generator.tsx', 'lib/generator.ts', 'lib/planActivation.ts'].flatMap(f => [...String(fs.readFileSync(path.join(__dirname, '..', f), 'utf8')).matchAll(/\bt\(\s*'((?:[^'\\]|\\.)*)'/g)].map(m => m[1]));
    expect(keys.length).toBeGreaterThan(30);
    expect(keys.map(k => k.replace(/\{\w+\}|WHO 2020|ACSM 2026|× 60/g, '')).filter(k => /\d/.test(k))).toEqual([]);
  });
});
