/*
 * Cel serii na partię w tygodniu (decyzje właściciela 12.10.2026, docs/research/32-serie-na-partie.md; rozbicie barków i pleców wycofane
 * tego samego dnia — cel dotyczy CAŁYCH partii). Rodzaje (docs/20): logika (cel automatyczny i ręczny, granice, pół serii), macierz (każda partia),
 * niezmienniki (paski serii = serie per partia), dane (migrate: złe wartości i klucze części, idempotencja, kopia → import, SCHEMA_VERSION bez zmian).
 * Ekrany: tests/set-goals-ui.test.tsx.
 */
import * as store from '@/lib/store';
import { WEEKLY_SETS_MARK, weeklySetsByMuscle, manualSetsGoal, setsGoal, thisMonday } from '@/lib/stats';
import { SET_PARTS, SETS_GOAL_MIN, SETS_GOAL_MAX, normalizeGoals, clampGoal, isSetPart } from '@/lib/setParts';
import { compare } from '@/lib/progress';
import { MUSCLES, SCHEMA_VERSION, uid, type Template, type TRow } from '@/lib/seed';
import { EN } from '@/lib/i18n.en';
import { LANGS } from '@/lib/i18n';
import { LOCALES } from '@/lib/locales';
import { fresh, addWorkout, ex } from './helpers';

const NOW = new Date(2026, 9, 8, 9); /* czwartek; tydzień pon 5 … nd 11 października 2026 */
const at = (d: number, h = 18) => new Date(2026, 9, d, h).getTime();
const sets = (n: number) => Array.from({ length: n }, () => ({ weight: 50, reps: 8 }));
const S = () => store.getState();
beforeEach(async () => { jest.useFakeTimers({ now: NOW }); await fresh(); });
afterEach(() => { jest.useRealTimers(); });

describe('partie celu: stałe i napisy', () => {
  test('SET_PARTS = wszystkie partie (MUSCLES), całe: barki i plecy bez rozbicia na części; bez powtórzeń', () => {
    expect([...SET_PARTS]).toEqual([...MUSCLES]); expect(new Set(SET_PARTS).size).toBe(SET_PARTS.length);
    expect(SET_PARTS).toContain('barki'); expect(SET_PARTS).toContain('plecy');
    for (const p of SET_PARTS) expect(isSetPart(p)).toBe(true);
    for (const x of ['__proto__', 'szyja', 'front_delt', 'side_delt', 'rear_delt', 'upper_back', 'lats', 'lower_back']) expect([x, isSetPart(x)]).toEqual([x, false]);
  });
  test.each([...SET_PARTS])('nazwa partii %s ma tłumaczenie EN (t() po polskim kluczu)', p => { expect(typeof EN[p]).toBe('string'); });
});

describe('serie tygodniowe per partia (główna 1, pomocnicza 0,5)', () => {
  test('barki i plecy liczone jako całe partie; pół serii za partię pomocniczą', () => {
    addWorkout(at(6), [['Bench Press (sztanga)', sets(4)], ['Bent Over Row (sztanga)', sets(3)], ['Lateral Raise (hantle)', sets(5)]]);
    const m = weeklySetsByMuscle(thisMonday(0, NOW));
    expect(m.klatka).toBe(4); expect(m.triceps).toBe(2); expect(m.biceps).toBe(1.5);
    expect(m.barki).toBe(2 + 5); /* wyciskanie: barki pomocnicze 0,5 × 4; unoszenie bokiem: główne 5 */ expect(m.plecy).toBe(3);
    for (const k of Object.keys(m)) expect([k, isSetPart(k)]).toEqual([k, true]);
  });
  test('rozgrzewka poza; drop set razem z serią; trening w innym tygodniu poza zakresem', () => {
    addWorkout(at(6), [['Lateral Raise (hantle)', [{ weight: 5, reps: 10, kind: 'warmup', warmup: true }, { weight: 8, reps: 10 }, { weight: 6, reps: 10, kind: 'drop' }]]]);
    addWorkout(at(1), [['Lateral Raise (hantle)', sets(9)]]);
    expect(weeklySetsByMuscle(thisMonday(0, NOW)).barki).toBe(1);
  });
  test.each([...MUSCLES])('matrix: partia %s — ćwiczenie katalogu z tą partią główną daje jej serie w tygodniu i w wierszu paska z celem automatycznym', m => {
    const e = S().exercises.find(x => x.lib && (x.muscles ?? []).includes(m)); expect(e).toBeTruthy();
    addWorkout(at(6), [[e!.name, sets(3)]]);
    expect(weeklySetsByMuscle(thisMonday(0, NOW))[m]).toBeGreaterThanOrEqual(3);
    const row = compare('week', NOW.getTime()).setRows.find(r => r.part === m); expect(row?.doneSets).toBeGreaterThanOrEqual(3); expect(row?.goal).toBe(WEEKLY_SETS_MARK);
  });
});

describe('cel serii: automatyczny i ręczny', () => {
  test('automat = WEEKLY_SETS_MARK (jedno źródło liczby), dla każdej partii; bez pola w Settings', () => {
    expect(WEEKLY_SETS_MARK).toBe(10); expect(S().settings.weeklySetGoals).toBeUndefined();
    for (const p of SET_PARTS) { expect(manualSetsGoal(p)).toBeUndefined(); expect(setsGoal(p)).toBe(WEEKLY_SETS_MARK); }
    expect(setsGoal('nie-ma-takiej')).toBe(WEEKLY_SETS_MARK);
  });
  test('ręczny cel jednej partii nie zmienia pozostałych', () => {
    S().settings.weeklySetGoals = { barki: 16, klatka: 12 };
    expect(setsGoal('barki')).toBe(16); expect(setsGoal('klatka')).toBe(12); expect(manualSetsGoal('klatka')).toBe(12);
    for (const p of SET_PARTS) if (p !== 'barki' && p !== 'klatka') expect(setsGoal(p)).toBe(WEEKLY_SETS_MARK);
  });
  test('granice interfejsu: 1–40 (nie zalecenie); wartość poza zakresem, nie-liczba i klucz nie-partii w danych = automat', () => {
    expect([SETS_GOAL_MIN, SETS_GOAL_MAX]).toEqual([1, 40]);
    S().settings.weeklySetGoals = { klatka: SETS_GOAL_MIN, plecy: SETS_GOAL_MAX, biceps: 0, triceps: 41, barki: NaN as unknown as number, core: '12' as unknown as number, 'pośladki': Infinity, lats: 15 };
    expect(setsGoal('klatka')).toBe(1); expect(setsGoal('plecy')).toBe(40);
    for (const p of ['biceps', 'triceps', 'barki', 'core', 'pośladki', 'lats']) expect([p, setsGoal(p)]).toEqual([p, WEEKLY_SETS_MARK]);
  });
  test('clampGoal: zaokrągla i przycina', () => { expect([clampGoal(0), clampGoal(-5), clampGoal(12.4), clampGoal(12.5), clampGoal(99)]).toEqual([1, 1, 12, 13, 40]); });
  test('compare(): wiersze serii niosą cel swojej partii (ręczny / automatyczny); barki i plecy jako całe partie; zgodne z wierszami partii', () => {
    addWorkout(at(6), [['Bench Press (sztanga)', sets(4)], ['Lateral Raise (hantle)', sets(5)], ['Bent Over Row (sztanga)', sets(3)]]);
    S().settings.weeklySetGoals = { barki: 20, plecy: 6 };
    const c = compare('week', NOW.getTime()); const goal = Object.fromEntries(c.setRows.map(r => [r.part, r.goal]));
    expect(goal).toMatchObject({ klatka: 10, barki: 20, plecy: 6, triceps: 10, biceps: 10 });
    expect(c.setRows[0].part).toBe('barki'); /* najwięcej serii (7) */
    for (const r of c.setRows) { expect(isSetPart(r.part)).toBe(true); expect(r.doneSets).toBe(c.rows.find(x => x.muscle === r.part)?.doneSets); }
  });
  test('compare(): zaplanowane z szablonu i poprzedni tydzień liczą się per partia', () => {
    addWorkout(at(1), [['Lateral Raise (hantle)', sets(2)]]); /* poprzedni tydzień */
    const t: Template = store.newTemplate(); t.name = 'Plan';
    const rows: TRow[] = Array.from({ length: 3 }, () => ({ id: uid(), kind: 'normal', reps: 10, weight: 40, durationSec: '', distanceM: '' }));
    t.items = [{ id: uid(), exerciseId: ex('Overhead Press (sztanga)').id, sets: 3, repMin: null, repMax: null, restSec: null, startWeight: '', targetSec: '', groupId: null, rows }]; store.save();
    require('@/lib/plan').setWeekDay(4, t.id); /* piątek 9.10 — jeszcze przed nami */
    const c = compare('week', NOW.getTime()); const b = c.setRows.find(r => r.part === 'barki')!;
    expect([b.doneSets, b.plannedSets, b.prevSets]).toEqual([0, 3, 2]);
    expect(c.planned!.bySets.triceps).toBe(1.5); expect(c.planned!.bySets.barki).toBe(3);
  });
});

describe('dane: migrate, kopia, import', () => {
  test('normalizeGoals: tylko partie całe i liczby skończone (zaokrąglone, w granicach); reszta (też klucze części) odpada; pusty → undefined', () => {
    expect(normalizeGoals(undefined)).toBeUndefined(); expect(normalizeGoals(null)).toBeUndefined(); expect(normalizeGoals('x')).toBeUndefined(); expect(normalizeGoals([12])).toBeUndefined(); expect(normalizeGoals({})).toBeUndefined();
    expect(normalizeGoals({ klatka: 12, barki: 25.6, core: 0, plecy: 99, side_delt: 8, lats: 14, front_delt: 9, nieznana: 5, szyja: 4, biceps: '10', triceps: NaN, 'pośladki': null, __proto__: { 'łydki': 7 } })).toEqual({ klatka: 12, barki: 26, core: 1, plecy: 40 });
    expect(normalizeGoals({ nieznana: 5, biceps: 'x', lats: 12, rear_delt: 10, upper_back: 9, lower_back: 8 })).toBeUndefined();
  });
  test('migrate: pole zapisane tylko z odstępstwami; klucze części z wersji roboczej odpadają; idempotentne; SCHEMA_VERSION = 19 (0.19)', () => {
    expect(SCHEMA_VERSION).toBe(19);
    const raw = JSON.parse(JSON.stringify(S())); raw.settings.weeklySetGoals = { klatka: 14, plecy: 'dużo', barki: 1000, lats: 12, front_delt: 9, obca: 3 };
    const m1 = store.migrate(raw); expect(m1.settings.weeklySetGoals).toEqual({ klatka: 14, barki: 40 }); expect(m1.schemaVersion).toBe(SCHEMA_VERSION);
    expect(m1.settings.defaultRest).toBe(S().settings.defaultRest);
    const m2 = store.migrate(JSON.parse(JSON.stringify(m1))); expect(m2).toEqual(m1);
    for (const bad of [5, 'x', [1, 2], { a: 1 }, { lats: 12, upper_back: 10 }, null]) { const r2 = JSON.parse(JSON.stringify(S())); r2.settings.weeklySetGoals = bad; expect('weeklySetGoals' in store.migrate(r2).settings).toBe(false); }
    expect('weeklySetGoals' in store.migrate(JSON.parse(JSON.stringify(S()))).settings).toBe(false); /* dane bez pola przechodzą 1:1 */
  });
  test('zapis → restart → ten sam cel; kopia → import bez strat (przez migrate)', async () => {
    S().settings.weeklySetGoals = { barki: 18, klatka: 12 }; store.save(); await store.flush();
    const saved = JSON.parse(global.__kv.get('state')!); expect(saved.settings.weeklySetGoals).toEqual({ barki: 18, klatka: 12 });
    await fresh(saved); expect(setsGoal('barki')).toBe(18); expect(setsGoal('klatka')).toBe(12); expect(setsGoal('biceps')).toBe(10);
    const copy = JSON.stringify(S()); await fresh(); expect(setsGoal('barki')).toBe(10);
    const imported = store.migrate(JSON.parse(copy)); expect(imported.settings.weeklySetGoals).toEqual({ barki: 18, klatka: 12 });
  });
});

/* Języki (docs/20 rodzaj 7): nowe teksty tego wdrożenia mają tłumaczenie w każdym języku (kompletność i parametry: tests/i18n-locales.test.ts). */
const NEW_TEXTS = ['Kreska = cel serii na partię w tygodniu: {n} automatycznie albo Twoja liczba z Ustawień.', 'Uproszczenie: partia pomocnicza ćwiczenia liczy się za pół serii (główna 1, pomocnicza 0,5).',
  'Cel serii na partię w tygodniu', 'Pokaż cele partii', 'Ukryj cele partii', 'Cel serii: {part}', 'Automatycznie ({n})', 'Ręcznie',
  'Przy co najmniej {n} seriach na partię tygodniowo mięśnie rosły w badaniach bardziej niż przy mniejszej liczbie serii; trening siłowy w różnych formach daje przyrost w porównaniu z brakiem treningu.',
  'Kreska w „Ten tydzień” i w Postępach. Automatycznie: {n} serii. Ręcznie: własna liczba od {min} do {max}.'];
describe.each(LANGS.filter(l => l !== 'pl' && l !== 'en'))('języki: nowe teksty celu serii (%s)', l => {
  test('każdy tekst przetłumaczony (inny niż polski), z tymi samymi parametrami', () => {
    const d = LOCALES[l]!; const params = (x: string) => (x.match(/\{\w+\}/g) ?? []).sort().join(',');
    for (const k of NEW_TEXTS) { expect([l, k, typeof d[k]]).toEqual([l, k, 'string']); expect([l, k, d[k] !== k]).toEqual([l, k, true]); expect(params(d[k])).toBe(params(k)); }
  });
});
test('EN: nowe teksty w słowniku angielskim', () => { for (const k of NEW_TEXTS) expect([k, typeof EN[k]]).toEqual([k, 'string']); });
test('fr: dwukropek z twardą spacją w nowych zdaniach (typografia francuska)', () => {
  const d = LOCALES.fr!; for (const k of NEW_TEXTS) if (/:/.test(d[k]) && !/\{part\}/.test(k)) expect([k, / :/.test(d[k]) ? /\u00a0:/.test(d[k]) : true]).toEqual([k, true]);
  expect(d['Cel serii: {part}']).toBe('Objectif de séries\u00a0: {part}');
});
