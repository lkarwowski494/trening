/*
 * Cel serii na partię w tygodniu i rozbicie barków i pleców w statystykach serii (decyzje właściciela 12.10.2026, docs/research/32-serie-na-partie.md).
 * Rodzaje (docs/20): logika (cel automatyczny i ręczny, granice, rozbicie, pół serii), macierz (każde ćwiczenie katalogu, każda część), niezmienniki
 * (serie nie giną; partie bez rozbicia liczą się jak dotąd), dane (migrate: złe wartości, idempotencja, kopia → import, SCHEMA_VERSION bez zmian).
 * Ekrany: tests/set-goals-ui.test.tsx.
 */
import * as store from '@/lib/store';
import { WEEKLY_SETS_MARK, setsByMuscle, setsByPart, weeklySetsByPart, manualSetsGoal, setsGoal, thisMonday } from '@/lib/stats';
import { SET_PARTS, SPLIT_REGIONS, SETS_GOAL_MIN, SETS_GOAL_MAX, partCredits, partLabel, normalizeGoals, clampGoal, isSetPart, type SetPart } from '@/lib/setParts';
import { compare } from '@/lib/progress';
import { MUSCLES, SCHEMA_VERSION, REGION_MUSCLE, uid, type Template, type TRow } from '@/lib/seed';
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

describe('części: stałe i napisy', () => {
  test('SET_PARTS = partie zbiorcze, a barki i plecy zastąpione regionami + wiersz „bez rozbicia”; bez powtórzeń', () => {
    expect(new Set(SET_PARTS).size).toBe(SET_PARTS.length);
    expect(SET_PARTS.length).toBe(MUSCLES.length - 2 + 4 + 4);
    expect(SET_PARTS.slice(SET_PARTS.indexOf('front_delt'), SET_PARTS.indexOf('front_delt') + 4)).toEqual(['front_delt', 'side_delt', 'rear_delt', 'barki']);
    expect(SET_PARTS.slice(SET_PARTS.indexOf('upper_back'), SET_PARTS.indexOf('upper_back') + 4)).toEqual(['upper_back', 'lats', 'lower_back', 'plecy']);
    for (const m of MUSCLES) if (m !== 'barki' && m !== 'plecy') expect(SET_PARTS).toContain(m);
    for (const p of SET_PARTS) expect(isSetPart(p)).toBe(true); expect(isSetPart('__proto__')).toBe(false); expect(isSetPart('szyja')).toBe(false);
  });
  test('regiony rozbicia należą do swojej partii zbiorczej (mapa regionów katalogu)', () => {
    for (const [m, rs] of Object.entries(SPLIT_REGIONS)) for (const r of rs) expect(REGION_MUSCLE[r]).toBe(m);
  });
  test.each([...SET_PARTS])('napis części %s ma tłumaczenie EN (t() po polskim kluczu)', p => {
    const l = partLabel(p); expect(typeof l).toBe('string'); expect(EN[l] ?? (MUSCLES as readonly string[]).includes(l)).toBeTruthy();
  });
  test('napisy: wiersze „bez rozbicia” i regiony z mapy', () => {
    expect(partLabel('barki')).toBe('barki — bez rozbicia'); expect(partLabel('plecy')).toBe('plecy — bez rozbicia');
    expect(partLabel('front_delt')).toBe('barki — przód'); expect(partLabel('lats')).toBe('najszersze grzbietu'); expect(partLabel('upper_back')).toBe('góra pleców'); expect(partLabel('klatka')).toBe('klatka');
  });
});

describe('przypisanie serii do części (bez zgadywania: tylko z danych ćwiczenia)', () => {
  const credits = (name: string) => Object.fromEntries(partCredits(ex(name)));
  test('partia główna 1, pomocnicza 0,5; barki → region o najwyższym poziomie, plecy → regiony o najwyższym poziomie', async () => {
    expect(credits('Bench Press (sztanga)')).toEqual({ klatka: 1, triceps: 0.5, front_delt: 0.5 }); /* barki pomocnicze → przód 0,5 */
    expect(credits('Overhead Press (sztanga)')).toEqual({ front_delt: 1, triceps: 0.5 }); /* przód 1, bok niżej → nic */
    expect(credits('Lateral Raise (hantle)')).toEqual({ side_delt: 1 });
    expect(credits('Face Pull')).toEqual({ rear_delt: 1, upper_back: 0.5 });
    expect(credits('Bent Over Row (sztanga)')).toEqual({ lats: 1, upper_back: 1, biceps: 0.5 }); /* dwa regiony na tym samym poziomie — oba pełny udział */
    expect(credits('Pull Up')).toEqual({ lats: 1, biceps: 0.5 });
    expect(credits('Deadlift (sztanga)')).toEqual({ 'dwugłowe': 1, 'pośladki': 1, lower_back: 0.5, upper_back: 0.5, 'czworogłowe': 0.5 }); /* plecy pomocnicze: prostowniki i góra pleców po 0,5 */
  });
  test('ćwiczenie własne z barkami / plecami (bez regionów) → wiersz „bez rozbicia”; inne partie bez zmian', () => {
    const e = store.newExercise('Własne'); e.muscles = ['barki']; e.secondaryMuscles = ['plecy', 'triceps']; store.save();
    expect(Object.fromEntries(partCredits(e))).toEqual({ barki: 1, plecy: 0.5, triceps: 0.5 });
  });
  test('ćwiczenie z biblioteki, któremu użytkownik zmienił partie: rozbicie idzie za polami ćwiczenia (jedno źródło prawdy)', () => {
    const e = ex('Bench Press (sztanga)'); e.muscles = ['klatka', 'barki']; e.secondaryMuscles = ['triceps']; store.save();
    expect(Object.fromEntries(partCredits(e))).toEqual({ klatka: 1, front_delt: 1, triceps: 0.5 });
  });
  test('matrix: każde ćwiczenie katalogu — części z listy, serie nie giną (każda partia zbiorcza ćwiczenia ma ≥ swój udział), partie bez rozbicia dokładnie jak setsByMuscle', () => {
    const all = S().exercises.filter(e => e.lib); expect(all.length).toBeGreaterThan(200);
    for (const e of all) {
      const pc = partCredits(e); const by = new Map(pc);
      for (const [p] of pc) expect(SET_PARTS).toContain(p);
      const want = new Map<string, number>(); (e.muscles ?? []).forEach(m => want.set(m, (want.get(m) ?? 0) + 1)); (e.secondaryMuscles ?? []).forEach(m => want.set(m, (want.get(m) ?? 0) + 0.5));
      for (const [m, share] of want) {
        if (m === 'barki' || m === 'plecy') { const got = SET_PARTS.filter(p => p === m || (SPLIT_REGIONS[m] as readonly string[]).includes(p)).reduce((a, p) => a + (by.get(p) ?? 0), 0); expect([e.name, m, got >= share]).toEqual([e.name, m, true]); }
        else expect([e.name, m, by.get(m as SetPart)]).toEqual([e.name, m, share]);
      }
    }
  });
  test('matrix: ćwiczenia katalogu z barkami lub plecami są w całości rozbite (żadne nie ląduje w wierszu „bez rozbicia”) — stan danych katalogu 12.10.2026', () => {
    const lost = S().exercises.filter(e => e.lib && partCredits(e).some(([p]) => p === 'barki' || p === 'plecy')).map(e => e.name);
    expect(lost).toEqual([]);
  });
});

describe('serie tygodniowe per część', () => {
  test('setsByPart: sumy zgodne z setsByMuscle dla partii bez rozbicia; barki i plecy rozbite; pół serii za partię pomocniczą', () => {
    addWorkout(at(6), [['Bench Press (sztanga)', sets(4)], ['Bent Over Row (sztanga)', sets(3)], ['Lateral Raise (hantle)', sets(5)]]);
    const mon = thisMonday(0, NOW); const end = thisMonday(1, NOW); const p = setsByPart(mon, end); const m = setsByMuscle(mon, end);
    expect(p.klatka).toBe(4); expect(p.triceps).toBe(2); expect(p.biceps).toBe(1.5); expect(p.klatka).toBe(m.klatka); expect(p.triceps).toBe(m.triceps); expect(p.biceps).toBe(m.biceps);
    expect(p.front_delt).toBe(2); /* wyciskanie: barki pomocnicze 0,5 × 4 */ expect(p.side_delt).toBe(5);
    expect(p.lats).toBe(3); expect(p.upper_back).toBe(3);
    expect(m.barki).toBe(2 + 5); expect(m.plecy).toBe(3 /* główne: 1 */); /* partie zbiorcze bez zmian (generator, mapa, regeneracja) */
    expect(weeklySetsByPart(mon)).toEqual(p);
  });
  test('rozgrzewka poza; drop set razem z serią (jak setsByMuscle); trening w innym tygodniu poza zakresem', () => {
    addWorkout(at(6), [['Lateral Raise (hantle)', [{ weight: 5, reps: 10, kind: 'warmup', warmup: true }, { weight: 8, reps: 10 }, { weight: 6, reps: 10, kind: 'drop' }]]]);
    addWorkout(at(1), [['Lateral Raise (hantle)', sets(9)]]);
    expect(weeklySetsByPart(thisMonday(0, NOW)).side_delt).toBe(1);
  });
  test('ćwiczenie własne z barkami → wiersz „barki” (bez rozbicia) i w setsByMuscle jako „barki”', () => {
    const e = store.newExercise('Własne barki'); e.muscles = ['barki']; store.save(); addWorkout(at(6), [['Własne barki', sets(3)]]);
    expect(weeklySetsByPart(thisMonday(0, NOW))).toEqual({ barki: 3 });
  });
});

describe('cel serii: automatyczny i ręczny', () => {
  test('automat = WEEKLY_SETS_MARK (jedno źródło liczby), dla każdej części; bez pola w Settings', () => {
    expect(WEEKLY_SETS_MARK).toBe(10); expect(S().settings.weeklySetGoals).toBeUndefined();
    for (const p of SET_PARTS) { expect(manualSetsGoal(p)).toBeUndefined(); expect(setsGoal(p)).toBe(WEEKLY_SETS_MARK); }
    expect(setsGoal('nie-ma-takiej')).toBe(WEEKLY_SETS_MARK);
  });
  test('ręczny cel jednej części nie zmienia pozostałych', () => {
    S().settings.weeklySetGoals = { side_delt: 16, klatka: 12 };
    expect(setsGoal('side_delt')).toBe(16); expect(setsGoal('klatka')).toBe(12); expect(manualSetsGoal('klatka')).toBe(12);
    for (const p of SET_PARTS) if (p !== 'side_delt' && p !== 'klatka') expect(setsGoal(p)).toBe(WEEKLY_SETS_MARK);
  });
  test('granice interfejsu: 1–40 (nie zalecenie); wartość poza zakresem albo nie-liczba w danych = automat', () => {
    expect([SETS_GOAL_MIN, SETS_GOAL_MAX]).toEqual([1, 40]);
    S().settings.weeklySetGoals = { klatka: SETS_GOAL_MIN, plecy: SETS_GOAL_MAX, biceps: 0, triceps: 41, lats: NaN as unknown as number, rear_delt: '12' as unknown as number, front_delt: Infinity };
    expect(setsGoal('klatka')).toBe(1); expect(setsGoal('plecy')).toBe(40);
    for (const p of ['biceps', 'triceps', 'lats', 'rear_delt', 'front_delt']) expect([p, setsGoal(p)]).toEqual([p, WEEKLY_SETS_MARK]);
  });
  test('clampGoal: zaokrągla i przycina', () => { expect([clampGoal(0), clampGoal(-5), clampGoal(12.4), clampGoal(12.5), clampGoal(99)]).toEqual([1, 1, 12, 13, 40]); });
  test('compare(): wiersze serii niosą cel swojej części (ręczny / automatyczny); wiersze objętości zostają per partia zbiorcza', () => {
    addWorkout(at(6), [['Bench Press (sztanga)', sets(4)], ['Lateral Raise (hantle)', sets(5)], ['Bent Over Row (sztanga)', sets(3)]]);
    S().settings.weeklySetGoals = { side_delt: 20, lats: 6 };
    const c = compare('week', NOW.getTime()); const goal = Object.fromEntries(c.setRows.map(r => [r.part, r.goal]));
    expect(goal).toMatchObject({ klatka: 10, side_delt: 20, lats: 6, upper_back: 10, front_delt: 10 });
    expect(c.setRows.map(r => r.part)).toEqual(expect.arrayContaining(['klatka', 'side_delt', 'front_delt', 'lats', 'upper_back', 'triceps', 'biceps']));
    expect(c.setRows[0].part).toBe('side_delt'); /* najwięcej serii (5) */ expect(c.rows.map(r => r.muscle)).toEqual(expect.arrayContaining(['barki', 'plecy'])); /* mapa i objętość: partie zbiorcze */
    expect(c.rows.map(r => r.muscle as string)).not.toContain('side_delt');
  });
  test('compare(): zaplanowane z szablonu liczą się per część (barki i plecy rozbite), poprzedni tydzień w setRows', () => {
    addWorkout(at(1), [['Lateral Raise (hantle)', sets(2)]]); /* poprzedni tydzień */
    const t: Template = store.newTemplate(); t.name = 'Plan';
    const rows: TRow[] = Array.from({ length: 3 }, () => ({ id: uid(), kind: 'normal', reps: 10, weight: 40, durationSec: '', distanceM: '' }));
    t.items = [{ id: uid(), exerciseId: ex('Overhead Press (sztanga)').id, sets: 3, repMin: null, repMax: null, restSec: null, startWeight: '', targetSec: '', groupId: null, rows }]; store.save();
    require('@/lib/plan').setWeekDay(4, t.id); /* piątek 9.10 — jeszcze przed nami */
    const c = compare('week', NOW.getTime()); const f = c.setRows.find(r => r.part === 'front_delt')!; const s = c.setRows.find(r => r.part === 'side_delt')!;
    expect([f.doneSets, f.plannedSets, f.prevSets]).toEqual([0, 3, 0]); expect([s.doneSets, s.plannedSets, s.prevSets]).toEqual([0, 0, 2]);
    expect(c.planned!.byParts.triceps).toBe(1.5); expect(c.planned!.bySets.barki).toBe(3);
  });
});

describe('dane: migrate, kopia, import', () => {
  test('normalizeGoals: tylko znane części i liczby skończone (zaokrąglone, w granicach); reszta odpada; pusty → undefined', () => {
    expect(normalizeGoals(undefined)).toBeUndefined(); expect(normalizeGoals(null)).toBeUndefined(); expect(normalizeGoals('x')).toBeUndefined(); expect(normalizeGoals([12])).toBeUndefined(); expect(normalizeGoals({})).toBeUndefined();
    expect(normalizeGoals({ klatka: 12, side_delt: 25.6, lats: 0, plecy: 99, nieznana: 5, szyja: 4, biceps: '10', triceps: NaN, rear_delt: null, __proto__: { core: 7 } })).toEqual({ klatka: 12, side_delt: 26, lats: 1, plecy: 40 });
    expect(normalizeGoals({ nieznana: 5, biceps: 'x' })).toBeUndefined();
  });
  test('migrate: pole zapisane tylko z odstępstwami; zła wartość nie psuje reszty ustawień; idempotentne; SCHEMA_VERSION bez zmian', () => {
    expect(SCHEMA_VERSION).toBe(18);
    const raw = JSON.parse(JSON.stringify(S())); raw.settings.weeklySetGoals = { klatka: 14, lats: 'dużo', front_delt: 1000, obca: 3 };
    const m1 = store.migrate(raw); expect(m1.settings.weeklySetGoals).toEqual({ klatka: 14, front_delt: 40 }); expect(m1.schemaVersion).toBe(SCHEMA_VERSION);
    expect(m1.settings.defaultRest).toBe(S().settings.defaultRest);
    const m2 = store.migrate(JSON.parse(JSON.stringify(m1))); expect(m2).toEqual(m1);
    for (const bad of [5, 'x', [1, 2], { a: 1 }, null]) { const r2 = JSON.parse(JSON.stringify(S())); r2.settings.weeklySetGoals = bad; expect('weeklySetGoals' in store.migrate(r2).settings).toBe(false); }
    expect('weeklySetGoals' in store.migrate(JSON.parse(JSON.stringify(S()))).settings).toBe(false); /* dane bez pola przechodzą 1:1 */
  });
  test('zapis → restart → ten sam cel; kopia → import bez strat (przez migrate)', async () => {
    S().settings.weeklySetGoals = { side_delt: 18, klatka: 12 }; store.save(); await store.flush();
    const saved = JSON.parse(global.__kv.get('state')!); expect(saved.settings.weeklySetGoals).toEqual({ side_delt: 18, klatka: 12 });
    await fresh(saved); expect(setsGoal('side_delt')).toBe(18); expect(setsGoal('klatka')).toBe(12); expect(setsGoal('biceps')).toBe(10);
    const copy = JSON.stringify(S()); await fresh(); expect(setsGoal('side_delt')).toBe(10);
    const imported = store.migrate(JSON.parse(copy)); expect(imported.settings.weeklySetGoals).toEqual({ side_delt: 18, klatka: 12 });
  });
});

/* Języki (docs/20 rodzaj 7): nowe teksty tego wdrożenia mają tłumaczenie w każdym języku (kompletność i parametry: tests/i18n-locales.test.ts). */
const NEW_TEXTS = ['Kreska = cel serii na partię w tygodniu: {n} automatycznie albo Twoja liczba z Ustawień.', 'Uproszczenie: partia pomocnicza ćwiczenia liczy się za pół serii (główna 1, pomocnicza 0,5; Pelland i in. 2026 — jedno źródło).', 'Zaplanowane — z szablonów na pozostałe dni tygodnia.',
  'Barki i plecy są rozbite według katalogu ćwiczeń: przód, bok i tył barków; góra pleców, najszersze i prostowniki. Ćwiczenie bez takiego rozbicia (np. własne) liczy się w wierszu „bez rozbicia”.',
  'barki — bez rozbicia', 'plecy — bez rozbicia', 'Cel serii na partię w tygodniu', 'Pokaż cele partii', 'Ukryj cele partii', 'Cel serii: {part}', 'Automatycznie ({n})', 'Ręcznie',
  'Stanowisko ACSM 2026: przy co najmniej {n} seriach na partię tygodniowo przyrost mięśni był większy niż przy mniejszej objętości; każdy trening siłowy daje przyrost w porównaniu z brakiem treningu.',
  'Kreska w „Ten tydzień” i w Postępach. Automatycznie: {n} serii (stanowisko ACSM 2026). Ręcznie: własna liczba od {min} do {max}.'];
describe.each(LANGS.filter(l => l !== 'pl' && l !== 'en'))('języki: nowe teksty celu serii (%s)', l => {
  test('każdy tekst przetłumaczony (inny niż polski), z tymi samymi parametrami; nazwy 2 części „bez rozbicia” różne od siebie', () => {
    const d = LOCALES[l]!; const params = (x: string) => (x.match(/\{\w+\}/g) ?? []).sort().join(',');
    for (const k of NEW_TEXTS) { expect([l, k, typeof d[k]]).toEqual([l, k, 'string']); expect([l, k, d[k] !== k]).toEqual([l, k, true]); expect(params(d[k])).toBe(params(k)); }
    expect(d['barki — bez rozbicia']).not.toBe(d['plecy — bez rozbicia']);
  });
});
test('EN: nowe teksty w słowniku angielskim', () => { for (const k of NEW_TEXTS) expect([k, typeof EN[k]]).toEqual([k, 'string']); });
test('fr: dwukropek z twardą spacją w nowych zdaniach (typografia francuska)', () => {
  const d = LOCALES.fr!; for (const k of NEW_TEXTS) if (/:/.test(d[k]) && !/\{part\}/.test(k)) expect([k, / :/.test(d[k]) ? /\u00a0:/.test(d[k]) : true]).toEqual([k, true]);
  expect(d['Cel serii: {part}']).toBe('Objectif de séries\u00a0: {part}');
});
