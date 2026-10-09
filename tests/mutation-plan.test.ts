/*
 * lib/plan.ts — testy granic po testach mutacyjnych (audyt 0.10, fala 2, obszar TESTY — M2 / TST-02). Każdy test zabija mutanty, które przeżyły
 * Strykera 09.10.2026 (raport w docs/09): granice „od dziś” (< vs <=), historia planu bez odcinków i z kilkoma, nazwy bez powtórzeń, limity dni
 * (0…6), zmiany dni wędrujące z planem, porządek zmian po usunięciu szablonu, okna propozycji (6 dni, RETURN_DAYS), pary dzień po dniu.
 */
import * as store from '@/lib/store';
import * as plan from '@/lib/plan';
import { fresh, withDemoTemplates, addWorkout } from './helpers';

const NOW = new Date(2026, 9, 8, 9, 0).getTime(); /* czwartek 8.10.2026 */
const TODAY = '2026-10-08', YEST = '2026-10-07', TOMO = '2026-10-09';
const S = () => store.getState();
let A = '', B = '', C = '', D = '';
const at = (k: string, h = 18) => new Date(+k.slice(0, 4), +k.slice(5, 7) - 1, +k.slice(8, 10), h).getTime();
const since = (k: string, fn: () => void) => { jest.setSystemTime(at(k, 9)); fn(); jest.setSystemTime(NOW); };
beforeEach(async () => { jest.useFakeTimers({ now: NOW }); await fresh(); const t = withDemoTemplates(); [A, B, C, D] = t.map(x => x.id); delete S().userTouched; });
afterEach(() => jest.useRealTimers());
const archive = (id: string) => store.setTemplateArchived(S().templates.find(t => t.id === id)!, true);

describe('plan w dniu: historia, minione dni, szablony w archiwum', () => {
  test('baseRaw bez historii (dane sprzed schematu 18): dziś i dalej — plan tygodnia; wczoraj — brak planu', () => {
    S().weekPlan = { days: [A, A, A, A, A, A, A] }; delete S().planHistory;
    expect([plan.baseRaw(YEST, TODAY), plan.baseRaw(TODAY, TODAY), plan.baseRaw(TOMO, TODAY)]).toEqual([null, A, A]);
  });
  test('baseRaw z trzema odcinkami: dzień w środkowym — środkowy; w pierwszym — pierwszy; przed pierwszym — brak', () => {
    since('2026-09-01', () => plan.setWeekDay(1, A)); since('2026-09-15', () => plan.setWeekDay(1, B)); plan.setWeekDay(1, C);
    expect(plan.planHistory().map(h => h.from)).toEqual(['2026-09-01', '2026-09-15', TODAY]);
    /* wtorki: 8.09 (pierwszy), 22.09 (środkowy), 25.08 (przed), 13.10 (od dziś) */
    expect(['2026-09-08', '2026-09-22', '2026-08-25', '2026-10-13'].map(k => plan.baseRaw(k, TODAY))).toEqual([A, B, null, C]);
    expect(plan.baseRaw('2026-09-15', TODAY)).toBe(B); /* dzień początku odcinka należy do niego (from <= k) */
  });
  test('miniony dzień czyta surowe id (szablon potem w archiwum), dziś — tylko żywy szablon', () => {
    since('2026-10-01', () => { plan.setWeekDay(2, A); plan.setWeekDay(3, A); }); archive(A);
    expect([plan.plannedOn(YEST, TODAY), plan.plannedOn(TODAY, TODAY)]).toEqual([A, null]);
  });
  test('isChanged: zmiana dnia, która po rozstrzygnięciu równa się planowi (szablon w archiwum od dziś = wolne), nie jest zmianą', () => {
    plan.setWeekDay(4, B); S().planOverrides = { [TOMO]: A }; expect(plan.isChanged(TOMO, TODAY)).toBe(true);
    S().planOverrides = { [TOMO]: B }; expect(plan.isChanged(TOMO, TODAY)).toBe(false);
    plan.setWeekDay(4, null); S().planOverrides = { [TOMO]: A }; archive(A); expect(plan.isChanged(TOMO, TODAY)).toBe(false);
  });
  test('hasPlan: zmiana dnia od dziś z żywym szablonem — tak (także dziś); tylko miniona — nie; tylko „wolne” — nie', () => {
    S().planOverrides = { [YEST]: A }; expect(plan.hasPlan(TODAY)).toBe(false);
    S().planOverrides = { [TODAY]: A }; expect(plan.hasPlan(TODAY)).toBe(true);
    S().planOverrides = { [TOMO]: null }; expect(plan.hasPlan(TODAY)).toBe(false);
    S().planOverrides = { [TOMO]: 'nie-ma' }; expect(plan.hasPlan(TODAY)).toBe(false);
  });
});

describe('zmiany planu: znacznik, historia, szablony w archiwum', () => {
  test('każda zmiana planu oznacza dane jako zmienione przez użytkownika (userTouched)', () => {
    plan.setWeekDay(0, A); expect(S().userTouched).toBe(true);
  });
  test('setWeekDay: szablon w archiwum — dzień wolny; nazwa planu bez zmiany dni nie dopisuje odcinka historii', () => {
    archive(B); plan.setWeekDay(0, B); expect(plan.weekPlanDays()[0]).toBeNull();
    plan.setWeekDay(0, A); const h = JSON.stringify(plan.planHistory()); plan.setPlanName('Rutyna'); expect(JSON.stringify(plan.planHistory())).toBe(h);
    delete S().weekPlan; delete S().planHistory; plan.setPlanName('Tylko nazwa'); expect(plan.planHistory()).toEqual([]); expect(plan.planName()).toBe('Tylko nazwa');
  });
});

describe('nazwy planów bez powtórzeń', () => {
  test('„X (2)” zajęte → „X (3)” (nie „X (2) (2)”); długa nazwa skrócona tak, by z dopiskiem mieściła się w limicie', () => {
    plan.setWeekDay(0, A); plan.setPlanName('Plan');
    expect(plan.savedPlans().length).toBe(0); plan.newPlan('Plan'); plan.newPlan('Plan'); plan.newPlan('Plan (2)');
    expect(plan.savedPlans().map(p => p.name)).toEqual(['Plan (2)', 'Plan (3)', 'Plan (4)']);
    const long = 'A'.repeat(store.PLAN_NAME_MAX); plan.setPlanName(long); plan.newPlan(long);
    const n = plan.savedPlans()[3].name; expect(n).toBe('A'.repeat(store.PLAN_NAME_MAX - 4) + ' (2)'); expect(n.length).toBe(store.PLAN_NAME_MAX);
  });
  test('setPlanName: aktywny plan może zostać przy swojej nazwie (bez „(2)”), ale nie wziąć nazwy zapisanego planu', () => {
    plan.setWeekDay(0, A); plan.setPlanName('Mój'); plan.setPlanName('Mój'); expect(plan.planName()).toBe('Mój');
    plan.newPlan('Inny'); plan.setPlanName('Inny'); expect(plan.planName()).toBe('Inny (2)');
    plan.setPlanName('   '); expect(plan.planName()).toBe('');
  });
  test('typePlanName: obcięcie do limitu nie zostawia połowy emoji', () => {
    plan.typePlanName('A'.repeat(store.PLAN_NAME_MAX - 1) + '💪'); expect(plan.planName()).toBe('A'.repeat(store.PLAN_NAME_MAX - 1));
    plan.typePlanName('A'.repeat(store.PLAN_NAME_MAX - 2) + '💪'); expect(plan.planName()).toBe('A'.repeat(store.PLAN_NAME_MAX - 2) + '💪');
  });
  test('renamePlan: zapisany plan nie bierze nazwy aktywnego; własna nazwa zostaje; pusta — poprzednia; nieznany plan — bez zmian', () => {
    plan.setWeekDay(0, A); plan.setPlanName('Aktywny'); const id = plan.newPlan('Zapisany')!; const id2 = plan.newPlan('Drugi')!; delete S().userTouched;
    plan.renamePlan(id, 'Aktywny'); expect(plan.savedPlans().find(p => p.id === id)!.name).toBe('Aktywny (2)');
    plan.renamePlan(id2, 'Drugi'); expect(plan.savedPlans().find(p => p.id === id2)!.name).toBe('Drugi');
    plan.renamePlan(id2, '  ', 'Poprzednia'); expect(plan.savedPlans().find(p => p.id === id2)!.name).toBe('Poprzednia');
    delete S().userTouched; const before = JSON.stringify(plan.savedPlans()); plan.renamePlan('nie-ma', 'X'); plan.renamePlan(id, '', '');
    expect(JSON.stringify(plan.savedPlans())).toBe(before); expect(S().userTouched).toBeUndefined();
  });
  test('typeSavedName zmienia tylko wskazany plan', () => {
    plan.setWeekDay(0, A); const a = plan.newPlan('A1')!; plan.newPlan('B1'); plan.typeSavedName(a, 'Nowa');
    expect(plan.savedPlans().map(p => p.name)).toEqual(['Nowa', 'B1']);
  });
});

describe('dni zapisanego planu i zmiany dni wędrujące z planem', () => {
  test('setSavedDay: dni 0…6 (−1 i 7 pomijane), tylko wskazany plan, szablon w archiwum — wolne', () => {
    plan.setWeekDay(0, A); const p = plan.newPlan('P')!; const q = plan.newPlan('Q')!;
    plan.setSavedDay(p, 6, B); plan.setSavedDay(p, 0, B); plan.setSavedDay(p, -1, C); plan.setSavedDay(p, 7, C);
    const days = (id: string) => plan.savedPlans().find(x => x.id === id)!.days;
    expect(days(p)).toEqual([B, null, null, null, null, null, B]); expect(days(q)).toEqual([A, null, null, null, null, null, null]);
    archive(C); plan.setSavedDay(p, 1, C); expect(days(p)[1]).toBeNull();
  });
  test('futureChanges i savedChanges liczą od dziś (dziś też), bez minionych; nieznany plan — 0', () => {
    plan.setWeekDay(0, A); S().planOverrides = { [YEST]: B, [TODAY]: B, [TOMO]: B };
    expect(plan.futureChanges(TODAY)).toBe(2);
    S().savedPlans = [{ id: 'p', name: 'P', days: [A, null, null, null, null, null, null], overrides: { [YEST]: B, [TODAY]: C, [TOMO]: null } }];
    expect([plan.savedChanges('p', TODAY), plan.savedChanges('nie-ma', TODAY)]).toEqual([2, 0]);
  });
  test('activationNote: plan z samą nazwą też „zostanie w Inne plany”; pusty plan bez nazwy i zmian — bez tekstu o obecnym planie', () => {
    S().savedPlans = [{ id: 'p', name: 'P', days: [B, null, null, null, null, null, null] }];
    expect(plan.activationNote('p', TODAY)).toBe('');
    plan.setPlanName('Tylko nazwa'); expect(plan.activationNote('p', TODAY)).toBe('Obecny plan zostanie w „Inne plany” — wrócisz do niego jednym przyciskiem.');
  });
  test('activatePlan: dzisiejsza zmiana dnia idzie z poprzednim planem i wraca z nim; miniona zostaje; nowy plan przynosi swoje zmiany od dziś', () => {
    plan.setWeekDay(3, A); S().planOverrides = { [YEST]: C, [TODAY]: B }; plan.newPlan('Nowy');
    const id = plan.savedPlans()[0].id; S().savedPlans![0].overrides = { [TODAY]: D, '2026-10-01': D }; delete S().userTouched;
    plan.activatePlan(id);
    expect(S().planOverrides).toEqual({ [YEST]: C, [TODAY]: D });
    const back = plan.savedPlans().find(p => p.id !== id)!; expect(back.overrides).toEqual({ [TODAY]: B }); expect(back.name).toBe('Plan do 8.10');
    plan.activatePlan(back.id); expect(S().planOverrides).toEqual({ [YEST]: C, [TODAY]: B });
  });
  test('activatePlan: plan bez nazwy dostaje nazwę z datą bez powtórzeń wśród zapisanych', () => {
    plan.setWeekDay(0, A); S().savedPlans = [{ id: 'x', name: 'Plan do 8.10', days: [C, null, null, null, null, null, null] }, { id: 'p', name: 'P', days: [B, null, null, null, null, null, null] }];
    plan.activatePlan('p'); expect(plan.savedPlans().map(p => p.name)).toEqual(['Plan do 8.10', 'Plan do 8.10 (2)']);
    plan.activatePlan('nie-ma'); expect(plan.planName()).toBe('P');
  });
  test('deletePlan: tylko wskazany; nieznany — bez zmian i bez znacznika', () => {
    plan.setWeekDay(0, A); plan.newPlan('P'); plan.newPlan('Q'); delete S().userTouched;
    plan.deletePlan('nie-ma'); expect(plan.savedPlans().length).toBe(2); expect(S().userTouched).toBeUndefined();
    plan.deletePlan(plan.savedPlans()[0].id); expect(plan.savedPlans().map(p => p.name)).toEqual(['Q']); expect(S().userTouched).toBe(true);
  });
});

describe('pojedyncze dni, przesuwanie, zamiana', () => {
  test('setDayPlan: szablon w archiwum — wolne; resetDay usuwa tylko ten dzień; bez zmian dni — nic', () => {
    archive(B); plan.setWeekDay(4, A); plan.setDayPlan(TOMO, B); expect(S().planOverrides).toEqual({ [TOMO]: null });
    plan.setDayPlan('2026-10-10', C); plan.resetDay(TOMO); expect(S().planOverrides).toEqual({ '2026-10-10': C });
    delete S().planOverrides; delete S().userTouched; plan.resetDay(TOMO); expect(S().userTouched).toBeUndefined();
  });
  test('shiftPlan: dzień bez treningu albo z szablonem w archiwum — nic się nie przesuwa i nic nie zapisuje', () => {
    plan.setWeekDay(4, A); delete S().userTouched;
    expect(plan.shiftPlan(TODAY, TODAY)).toEqual({ moved: [] }); expect(S().userTouched).toBeUndefined();
    archive(A); expect(plan.shiftPlan(TOMO, TODAY)).toEqual({ moved: [] }); expect(S().planOverrides).toBeUndefined();
  });
  test('shiftPlan: plan bez dni wolnych przesuwa się najwyżej o SHIFT_MAX_DAYS dni, dalej trening wypada', () => {
    for (let i = 0; i < 7; i++) plan.setWeekDay(i, i % 2 ? A : B);
    const r = plan.shiftPlan(TODAY, TODAY); expect(r.moved).toHaveLength(plan.SHIFT_MAX_DAYS); expect(r.dropped).toBeTruthy();
    expect(r.moved[r.moved.length - 1].to).toBe(plan.addDays(TODAY, plan.SHIFT_MAX_DAYS));
  });
  test('moveOnly: na ten sam dzień, na miniony, z dnia bez treningu albo z szablonem w archiwum — {ok: true} bez zmian', () => {
    plan.setWeekDay(3, A); const before = JSON.stringify(S().planOverrides ?? null);
    expect(plan.moveOnly(TODAY, TODAY, TODAY)).toEqual({ ok: true }); expect(plan.moveOnly(TODAY, YEST, TODAY)).toEqual({ ok: true });
    expect(plan.moveOnly(TOMO, '2026-10-10', TODAY)).toEqual({ ok: true }); expect(JSON.stringify(S().planOverrides ?? null)).toBe(before);
    expect(plan.moveOnly(TODAY, TOMO, TODAY)).toEqual({ ok: true }); expect([plan.plannedOn(TODAY, TODAY), plan.plannedOn(TOMO, TODAY)]).toEqual([null, A]);
    archive(A); expect(plan.moveOnly(TOMO, '2026-10-10', TODAY)).toEqual({ ok: true }); expect(S().planOverrides![('2026-10-10')]).toBeUndefined();
  });
  test('swapDays: drugi dzień miniony albo jeden z dni zajęty — bez zmian', () => {
    plan.setWeekDay(3, A); plan.setWeekDay(4, B);
    plan.swapDays(TODAY, YEST, TODAY); expect(S().planOverrides).toBeUndefined();
    addWorkout(at(TOMO, 7), [['Back Squat', [{ weight: 100, reps: 5 }]]]); jest.setSystemTime(at(TOMO, 9));
    plan.swapDays(TOMO, '2026-10-10', TOMO); expect(S().planOverrides).toBeUndefined();
    plan.swapDays('2026-10-10', TOMO, TOMO); expect(S().planOverrides).toBeUndefined();
  });
});

describe('porządek zmian dni po usunięciu szablonu (tidy) i użycie szablonu', () => {
  test('zmiana dnia od dziś (także dziś) na usunięty szablon: gdy plan ma tam trening — „wolne”; gdy plan ma wolne — znika; miniona zostaje', () => {
    plan.setWeekDay(3, A); plan.setWeekDay(4, null); S().planOverrides = { [YEST]: C, [TODAY]: C, [TOMO]: C };
    plan.removeTemplate(C);
    expect(S().planOverrides).toEqual({ [YEST]: C, [TODAY]: null });
  });
  test('templateUsage: dni od dziś (z dzisiejszym) rosnąco; zapisane plany także przez zmiany dni od dziś; miniona zmiana — nie', () => {
    S().planOverrides = { '2026-10-12': A, [TODAY]: A, [YEST]: A };
    S().savedPlans = [{ id: 'p', name: 'P', days: [null, null, null, null, null, null, null], overrides: { [TOMO]: A } }, { id: 'q', name: 'Q', days: [null, null, null, null, null, null, null], overrides: { [YEST]: A } }, { id: 'r', name: '', days: [A, null, null, null, null, null, null] }];
    const u = plan.templateUsage(A, TODAY);
    expect(u.dates).toEqual([TODAY, '2026-10-12']); expect(u.saved).toEqual(['P', 'Poprzedni plan']);
  });
  test('removeTemplate: zapisane zmiany dni z tym szablonem — „wolne”, gdy plan ma tam trening, inaczej znikają; inne zostają', () => {
    plan.setWeekDay(0, B); S().savedPlans = [{ id: 'p', name: 'P', days: [B, null, null, null, null, null, null], overrides: { '2026-10-12': C, '2026-10-13': C, '2026-10-14': A } }];
    plan.removeTemplate(C);
    expect(plan.savedPlans()[0].overrides).toEqual({ '2026-10-12': null, '2026-10-14': A });
    plan.removeTemplate(A); expect(plan.savedPlans()[0]).toEqual({ id: 'p', name: 'P', days: [B, null, null, null, null, null, null], overrides: { '2026-10-12': null } });
  });
});

describe('stan dnia i pary dzień po dniu', () => {
  test('dayStatusFrom: id treningów dnia; bez treningu — pusta lista; pending tylko dla planned/other', () => {
    plan.setWeekDay(3, A); const w = addWorkout(at(TODAY, 7), [['Back Squat', [{ weight: 100, reps: 5 }]]]);
    expect(plan.dayStatus(TODAY, TODAY)).toEqual({ status: 'other', templateId: A, workoutIds: [w.id] });
    expect(plan.dayStatus(TOMO, TODAY)).toEqual({ status: 'rest', templateId: null, workoutIds: [] });
    plan.setWeekDay(4, B); expect(plan.dayStatus(TOMO, TODAY)).toEqual({ status: 'planned', templateId: B, workoutIds: [] });
    expect((['done', 'other', 'planned', 'missed', 'rest'] as const).map(s => plan.pending({ status: s }))).toEqual([false, true, true, false, false]);
  });
  test('templateMuscles: brak szablonu — pusty zbiór; ćwiczenie usunięte z biblioteki — pomijane', () => {
    expect(plan.templateMuscles(null).size).toBe(0); expect(plan.templateMuscles('nie-ma').size).toBe(0);
    const t = S().templates.find(x => x.id === A)!; t.items = [{ ...t.items[0], exerciseId: 'nie-ma' }]; expect(plan.templateMuscles(A).size).toBe(0);
  });
  test('backToBack (domyślne okno treningów): zrobiony wczoraj trening + dzisiejszy plan z tą samą partią = para; trening w ostatnim dniu okna też się liczy', () => {
    plan.setWeekDay(3, C); /* Legs — siłownia na dziś */ addWorkout(at(YEST), [['Back Squat', [{ weight: 100, reps: 5 }]]]);
    expect(plan.backToBack(TODAY, 3)).toEqual([{ a: YEST, b: TODAY }]);
    const end = plan.addDays(TODAY, 3); addWorkout(at(end), [['Leg Press', [{ weight: 100, reps: 5 }]]]); plan.setWeekDay(plan.weekdayIdx(plan.addDays(TODAY, 2)), D);
    expect(plan.backToBack(TODAY, 3)).toContainEqual({ a: plan.addDays(TODAY, 2), b: end });
  });
});

describe('propozycje (suggest)', () => {
  const ids = (xs: plan.Suggestion[]) => xs.map(x => `${x.kind}${x.to ? ':' + x.to : ''}`);
  test('przeniesienie tylko tego treningu: najbliższe 6 dni od następnego (z dniem +6), bez dni z treningiem z planu', () => {
    plan.setWeekDay(3, A); const s = plan.suggest(TODAY, TODAY);
    const moves = s.filter(x => x.kind === 'move').map(x => x.to).sort();
    expect(moves).toEqual([2, 3, 4, 5, 6].map(i => plan.addDays(TODAY, i))); /* +1 = przesunięcie łańcuchem (te same zmiany dni — jedna pozycja) */
    expect(s.find(x => x.kind === 'shift')!.placed).toEqual([{ id: A, to: TOMO }]);
    expect(s.filter(x => x.kind === 'skip')).toHaveLength(1);
  });
  test('opuszczony trening (wczoraj): start od dziś — przeniesienie także na dziś, bez zamiany (przeszłości nie zamieniamy)', () => {
    since('2026-10-01', () => { plan.setWeekDay(2, A); plan.setWeekDay(4, B); });
    const s = plan.suggest(YEST, TODAY);
    expect(s.flatMap(x => x.placed.map(p => p.to))).toContain(TODAY); expect(s.find(x => x.kind === 'shift')!.placed[0]).toEqual({ id: A, to: TODAY });
    expect(s.filter(x => x.kind === 'move').map(x => x.to).sort()).toEqual(['2026-10-10', '2026-10-11', '2026-10-12', '2026-10-13']); /* +1 (pt) z treningiem, +6 (śr.) z treningiem z planu */
    expect(s.filter(x => x.kind === 'swap')).toEqual([]);
    const skip = s.find(x => x.kind === 'skip')!; expect(skip.ov).toEqual({ [YEST]: null });
  });
  test('zamiana z treningiem do 6 dni naprzód (z +6); dzień z treningiem zrobionym — bez zamiany', () => {
    plan.setWeekDay(3, A); plan.setWeekDay(2, B); /* środa = +6 */
    expect(ids(plan.suggest(TODAY, TODAY))).toContain('swap:2026-10-14');
    addWorkout(at(TODAY, 7), [['Plank', [{ durationSec: 30 }]]]);
    expect(plan.suggest(TODAY, TODAY).filter(x => x.kind === 'swap')).toEqual([]);
  });
  test('powrót do rutyny: przesunięcie łańcuchem do pierwszego wolnego dnia mieści się w oknie; plan bez dni wolnych wychodzi poza okno', () => {
    plan.setWeekDay(3, A); expect(plan.suggest(TODAY, TODAY).find(x => x.kind === 'shift')!.returns).toBe(true);
    for (let i = 0; i < 7; i++) plan.setWeekDay(i, i % 2 ? A : B);
    expect(plan.suggest(TODAY, TODAY).find(x => x.kind === 'shift')!.returns).toBe(false);
  });
  test('kolejność: najpierw wracające i bez utraty sesji; pominięcie traci sesję (dropped 1); te same zmiany tylko raz', () => {
    plan.setWeekDay(3, A); const s = plan.suggest(TODAY, TODAY);
    const skip = s.find(x => x.kind === 'skip')!; expect(skip.dropped).toBe(1); expect(s[s.length - 1].kind).toBe('skip');
    expect(s[0].dropped).toBe(0); const keys = s.map(x => JSON.stringify(Object.entries(x.ov).sort())); expect(new Set(keys).size).toBe(keys.length);
    const sh = s.find(x => x.kind === 'shift'); const mv = s.find(x => x.kind === 'move' && x.to === TOMO); expect(!(sh && mv)).toBe(true); /* łańcuch na jutro = przeniesienie na jutro — jedna pozycja */
  });
  test('placed: trening na nowym dniu; changes: liczba zmienionych dni w oknie', () => {
    plan.setWeekDay(3, A); const mv = plan.suggest(TODAY, TODAY).find(x => x.kind === 'move' && x.to === '2026-10-10')!;
    expect(mv.placed).toEqual([{ id: A, to: '2026-10-10' }]); expect(mv.changes).toBe(2); expect(mv.ov).toEqual({ [TODAY]: null, '2026-10-10': A });
  });
});
