/*
 * Audyt 0.10 (08.10.2026, docs/25 grupa A, B, I, J) — testy regresji planu tygodnia, kalendarza, kilku planów, przypomnień i danych planu.
 * Każdy test odtwarza znalezisko audytu (ID w nazwie; dowody audytorów: zz-audit-x-plan, zz-audit-log-h, zz-audit-dat-probes) i sprawdza
 * POPRAWNE zachowanie po naprawie. Decyzje właściciela 08.10.2026 (docs/18): A1 wariant B (historia planu, schemat 18), reszta — rekomendacje.
 * Rodzaje (docs/20): logika, dane (migracja, idempotencja, kopia), niezmienniki (statusy minionych dni nie zmieniają się przy zmianie planu).
 * Ekrany: tests/audit-0.10-plan-ui.test.tsx.
 */
import * as store from '@/lib/store';
import * as plan from '@/lib/plan';
import { weekStrip, weekTiles, firstSteps } from '@/lib/dashboard';
import { planReminderKey, syncPlanReminders, PLAN_REMINDER_DAYS, PLAN_REMINDER_HOUR } from '@/lib/planReminder';
import { buildBackup, parseBackup } from '@/lib/backup';
import { applyLang } from '@/lib/i18n';
import { SCHEMA_VERSION } from '@/lib/seed';
import { fresh, saved, withDemoTemplates, addWorkout } from './helpers';

const NOW = new Date(2026, 9, 8, 9, 0).getTime(); /* czwartek 8.10.2026 */
const S = () => store.getState();
let A = '', B = '', C = '', D = '';
const at = (k: string, h = 18) => new Date(+k.slice(0, 4), +k.slice(5, 7) - 1, +k.slice(8, 10), h).getTime();
/** Ustawienie planu w przeszłości (dzień `k`), potem powrót do NOW. */
const since = (k: string, fn: () => void) => { jest.setSystemTime(at(k, 9)); fn(); jest.setSystemTime(NOW); };
const restart = async () => { await store.flush(); await fresh(saved()); };
beforeEach(async () => { jest.useFakeTimers({ now: NOW }); await fresh(); const t = withDemoTemplates(); [A, B, C, D] = t.map(x => x.id); });
afterEach(() => applyLang('pl'));

describe('A1 — plan nie obowiązuje wstecz (historia planu, schemat 18)', () => {
  test('A1 (DAT-01/X-02/UX-02): plan ustawiony w czwartek — miniony poniedziałek, dawne miesiące i lata nie są „opuszczone”; przyszły poniedziałek — zaplanowany', () => {
    plan.setWeekDay(0, A); plan.setWeekDay(2, B);
    expect(['2026-10-05', '2026-10-07', '2025-10-06', '2020-01-06'].map(k => plan.dayStatus(k).status)).toEqual(['rest', 'rest', 'rest', 'rest']);
    expect(plan.dayStatus('2026-10-12')).toMatchObject({ status: 'planned', templateId: A });
    expect(weekStrip(NOW).map(d => d.status)).toEqual(['rest', 'rest', 'rest', 'rest', 'rest', 'rest', 'rest']);
    expect(weekTiles(NOW).planned).toBe(0); /* dawniej „0 / 2” — dni sprzed planu */
    expect(S().planHistory).toEqual([{ from: '2026-10-08', days: [A, null, B, null, null, null, null] }]);
  });
  test('A1 (X-02/DAT-01 P5): aktywacja innego planu w środku tygodnia nie przepisuje minionych dni', () => {
    since('2026-09-28', () => { plan.setWeekDay(0, A); plan.setWeekDay(2, A); });
    addWorkout(at('2026-10-05'), [['Back Squat', [{ weight: 100, reps: 5 }]]], 'Upper A').templateId = A; store.save();
    const before = weekStrip(NOW).map(d => `${d.status}:${d.templateId ?? '-'}`);
    expect(before.slice(0, 4)).toEqual([`done:${A}`, 'rest:-', `missed:${A}`, 'rest:-']);
    const id = plan.addPlan('Nowy', [null, B, null, C, null, null, null], false); plan.activatePlan(id);
    expect(weekStrip(NOW).map(d => `${d.status}:${d.templateId ?? '-'}`).slice(0, 4)).toEqual([`done:${A}`, 'rest:-', `missed:${A}`, `planned:${C}`]);
    expect(plan.dayStatus('2026-09-28').status).toBe('missed'); expect(plan.dayStatus('2026-09-29').status).toBe('rest');
    expect(plan.dayStatus('2026-10-13')).toMatchObject({ status: 'planned', templateId: B });
  });
  test('A1: kilka zmian planu tego samego dnia — jeden odcinek; powrót do poprzedniego planu scala odcinki', () => {
    since('2026-09-01', () => plan.setWeekDay(0, A));
    plan.setWeekDay(0, B); plan.setWeekDay(1, C);
    expect(S().planHistory).toEqual([{ from: '2026-09-01', days: [A, null, null, null, null, null, null] }, { from: '2026-10-08', days: [B, C, null, null, null, null, null] }]);
    plan.setWeekDay(1, null); plan.setWeekDay(0, A);
    expect(S().planHistory).toEqual([{ from: '2026-09-01', days: [A, null, null, null, null, null, null] }]);
    plan.setWeekDay(0, null); /* plan wyczyszczony od dziś — minione poniedziałki nadal wg starego planu */
    expect(S().weekPlan).toBeUndefined(); expect(plan.dayStatus('2026-10-05').status).toBe('missed'); expect(plan.dayStatus('2026-10-12').status).toBe('rest');
  });
  test('A1 (DAT-01 P3/X-02 M3): „wolne” sprzed ponad 60 dni przetrwa zmianę planu (tidy nie kasuje przeszłości)', () => {
    since('2026-08-03', () => { plan.setWeekDay(0, A); plan.setDayPlan('2026-08-03', null); });
    expect(plan.dayStatus('2026-08-03').status).toBe('rest');
    plan.setWeekDay(2, B); plan.applySuggestion({ kind: 'skip', changes: 0, newBackToBack: [], dropped: 0, returns: true, placed: [], ov: { ...(S().planOverrides ?? {}) } });
    expect(plan.dayStatus('2026-08-03').status).toBe('rest'); expect(S().planOverrides).toEqual({ '2026-08-03': null });
    expect(plan.dayStatus('2026-08-10').status).toBe('missed');
  });
  test('A1: przeniesiony i zrobiony trening sprzed 60 dni zostaje w przeszłości (01.07 → 02.07 nie wraca jako „opuszczony”)', () => {
    since('2026-06-29', () => plan.setWeekDay(2, A)); /* śr. 1.07 */
    since('2026-07-01', () => plan.moveOnly('2026-07-01', '2026-07-02'));
    addWorkout(at('2026-07-02'), [['Back Squat', [{ weight: 100, reps: 5 }]]]).templateId = A; store.save();
    plan.setWeekDay(4, B);
    expect([plan.dayStatus('2026-07-01').status, plan.dayStatus('2026-07-02').status]).toEqual(['rest', 'done']);
  });
  test('A1 / A7: usunięcie albo archiwizacja szablonu nie zmienia statusu minionych dni (nazwa usuniętego — „usunięty szablon”)', () => {
    since('2026-09-28', () => plan.setWeekDay(0, A));
    S().templates.find(x => x.id === A)!.archived = true; store.save();
    expect(plan.dayStatus('2026-10-05')).toMatchObject({ status: 'missed', templateId: A }); expect(plan.dayStatus('2026-10-12').status).toBe('rest');
    delete S().templates.find(x => x.id === A)!.archived; plan.removeTemplate(A);
    expect(plan.dayStatus('2026-10-05')).toMatchObject({ status: 'missed', templateId: A }); expect(plan.planTplName(A)).toBe('usunięty szablon');
    expect(plan.dayStatus('2026-10-12').status).toBe('rest'); expect(S().weekPlan).toBeUndefined();
  });
});

describe('A1 — dane: migracja do schematu 18, idempotencja, kopia', () => {
  const v17 = () => { const st = JSON.parse(JSON.stringify(S())); st.schemaVersion = 17; st.weekPlan = { days: [A, null, B, null, null, null, null], name: 'Rutyna' }; st.planOverrides = { '2026-10-06': C, '2026-10-16': null }; delete st.planHistory; return st; };
  test('A1: dane sprzed 18 — plan obowiązuje od dnia migracji (żaden wcześniejszy dzień nie jest „opuszczony” z planu tygodnia); zmiany dni zostają', async () => {
    await fresh(v17());
    expect(S().schemaVersion).toBe(SCHEMA_VERSION); expect(SCHEMA_VERSION).toBe(18);
    expect(S().planHistory).toEqual([{ from: '2026-10-08', days: [A, null, B, null, null, null, null] }]);
    expect(S().weekPlan).toEqual({ days: [A, null, B, null, null, null, null], name: 'Rutyna' }); /* pole czytane przez starsze wersje */
    expect([plan.dayStatus('2026-10-05').status, plan.dayStatus('2026-10-07').status, plan.dayStatus('2026-09-28').status]).toEqual(['rest', 'rest', 'rest']);
    expect(plan.dayStatus('2026-10-06')).toMatchObject({ status: 'missed', templateId: C }); /* jawna zmiana dnia — zaplanowana przez użytkownika */
    expect(plan.dayStatus('2026-10-12').status).toBe('planned'); expect(plan.plannedOn('2026-10-16')).toBeNull();
  });
  test('A1: migrate idempotentne; restart następnego dnia nie przesuwa początku planu', async () => {
    await fresh(v17()); const once = JSON.parse(JSON.stringify(S())); const twice = store.migrate(JSON.parse(JSON.stringify(once)));
    expect(twice.planHistory).toEqual(once.planHistory); expect(twice.weekPlan).toEqual(once.weekPlan); expect(twice.planOverrides).toEqual(once.planOverrides);
    jest.setSystemTime(NOW + 86400e3); await restart();
    expect(S().planHistory).toEqual([{ from: '2026-10-08', days: [A, null, B, null, null, null, null] }]);
  });
  test('A1: plan zmieniony w starszej wersji (weekPlan ≠ ostatni odcinek) — odcinek od dziś, przeszłość wg historii', async () => {
    const st = v17(); st.schemaVersion = 18; st.planHistory = [{ from: '2026-09-01', days: [A, null, null, null, null, null, null] }]; st.weekPlan = { days: [null, B, null, null, null, null, null] };
    await fresh(st);
    expect(S().planHistory).toEqual([{ from: '2026-09-01', days: [A, null, null, null, null, null, null] }, { from: '2026-10-08', days: [null, B, null, null, null, null, null] }]);
    expect([plan.dayStatus('2026-10-05').status, plan.dayStatus('2026-10-06').templateId, plan.dayStatus('2026-10-13').templateId]).toEqual(['missed', C, B]);
    st.weekPlan = undefined; await fresh(st); /* plan wyczyszczony w starszej wersji */
    expect(S().planHistory!.map(x => x.from)).toEqual(['2026-09-01', '2026-10-08']); expect(S().planHistory![1].days.every(x => x === null)).toBe(true);
  });
  test('A1: sanityzacja historii — złe daty i wpisy odpadają, ten sam dzień: późniejszy wpis, równe sąsiednie scalone, „bez planu” na początku znika', async () => {
    const st = v17(); st.weekPlan = { days: [B, null, null, null, null, null, null] };
    st.planHistory = ['x', null, { from: 'zła', days: [A] }, { from: '2026-08-01', days: [] }, { from: '2026-09-01', days: [A, 5, null] }, { from: '2026-09-01', days: [B] }, { from: '2026-09-10', days: [B, null] }, { from: '2026-09-20', days: [C] }, { from: '2026-10-01', days: [B, null, null, null, null, null, null, 'ósmy'] }];
    await fresh(st);
    expect(S().planHistory).toEqual([{ from: '2026-09-01', days: [B, null, null, null, null, null, null] }, { from: '2026-09-20', days: [C, null, null, null, null, null, null] }, { from: '2026-10-01', days: [B, null, null, null, null, null, null] }]);
    const again = store.migrate(JSON.parse(JSON.stringify(S()))); expect(again.planHistory).toEqual(S().planHistory);
  });
  test('A1: kopia — eksport → import → restart: historia planu bez zmian', async () => {
    since('2026-09-01', () => plan.setWeekDay(0, A)); plan.setWeekDay(3, B);
    const want = JSON.parse(JSON.stringify(S().planHistory));
    const imported = parseBackup(JSON.stringify(buildBackup())); expect(imported.planHistory).toEqual(want);
    store.replaceState(imported); await restart(); expect(S().planHistory).toEqual(want);
    expect(plan.dayStatus('2026-10-05').status).toBe('missed'); expect(plan.dayStatus('2026-10-08').templateId).toBe(B);
  });
  test('D4: „Nie teraz” przy podpowiedzi deload — pole sanityzowane (data albo brak)', async () => {
    const st = v17(); st.deloadSnooze = '2026-10-12'; await fresh(st); expect(S().deloadSnooze).toBe('2026-10-12');
    st.deloadSnooze = 7; await fresh(st); expect('deloadSnooze' in S()).toBe(false);
  });
});

describe('J1 — dane z nowszej wersji (DAT-05)', () => {
  test('J1 (DAT-05 P7): nieznane ustawienie zostaje po restarcie i imporcie; klucze zatruwające prototyp — nie', async () => {
    const st = JSON.parse(JSON.stringify(S())); st.settings.futureSetting = { a: 7 }; st.settings.effortScale = 'rir';
    Object.defineProperty(st.settings, '__proto__', { value: { polluted: 1 }, enumerable: true, configurable: true, writable: true });
    await fresh(JSON.parse(JSON.stringify(st)));
    expect((S().settings as any).futureSetting).toEqual({ a: 7 }); expect(S().settings.effortScale).toBe('rir');
    expect(Object.prototype.hasOwnProperty.call(S().settings, '__proto__')).toBe(false); expect(({} as any).polluted).toBeUndefined();
    await restart(); expect((S().settings as any).futureSetting).toEqual({ a: 7 });
    expect((parseBackup(JSON.stringify(buildBackup())).settings as any).futureSetting).toEqual({ a: 7 });
  });
  test('J1 (DAT-05 P10): baza ze schematem wyższym niż obsługiwany — start zatrzymany, zapis nietknięty, surowe dane do wysłania', async () => {
    const st = JSON.parse(JSON.stringify(S())); st.schemaVersion = SCHEMA_VERSION + 1; st.settings.newIn19 = 'x'; const txt = JSON.stringify(st);
    await expect(fresh(txt)).rejects.toThrow('Dane z nowszej wersji aplikacji — zaktualizuj aplikację');
    expect(store.getNewerSchema()).toBe(SCHEMA_VERSION + 1); expect(global.__kv.get('state')).toBe(txt); expect(store.isReadyForTests()).toBe(false);
    const raw = JSON.parse((await store.readRawData())!); expect(raw).toMatchObject({ format: 'trening-recovery', state: { schemaVersion: SCHEMA_VERSION + 1, settings: { newIn19: 'x' } } });
    expect(() => parseBackup(JSON.stringify(raw))).toThrow(`Plik ma schemat ${SCHEMA_VERSION + 1}, a ta wersja obsługuje do ${SCHEMA_VERSION}. Zaktualizuj aplikację.`);
  });
  test('J1: migrate nie obniża numeru schematu', () => {
    const st = JSON.parse(JSON.stringify(S())); st.schemaVersion = 99; expect(store.migrate(st).schemaVersion).toBe(99);
    const old = JSON.parse(JSON.stringify(S())); old.schemaVersion = 12; expect(store.migrate(old).schemaVersion).toBe(SCHEMA_VERSION);
  });
});

describe('B — kilka planów', () => {
  test('B3 (DAT-03): limit 50 zapisanych planów także w UI — 51. nowy plan i plan z generatora nie powstają, restart niczego nie gubi', async () => {
    plan.setWeekDay(0, A); plan.setPlanName('Mój');
    for (let i = 1; i <= 50; i++) expect(plan.newPlan('Kopia ' + i)).toBeTruthy();
    expect(plan.plansFull()).toBe(true); expect(plan.newPlan('Kopia 51')).toBeNull(); expect(plan.addPlan('Z generatora', [A], false)).toBe('');
    const before = plan.savedPlans().map(p => p.name); expect(before).toHaveLength(store.SAVED_PLANS_MAX);
    await restart(); expect(plan.savedPlans().map(p => p.name)).toEqual(before);
  });
  test('B4 (DAT-06): nazwa planu — spacje, długość i emoji porządkowane idempotentnie (także w migrate)', async () => {
    plan.setWeekDay(0, A); plan.setPlanName('A'.repeat(39) + '💪'); expect(plan.planName()).toBe('A'.repeat(39));
    plan.setPlanName('  Plan   na  jesień  '); expect(plan.planName()).toBe('Plan na jesień');
    plan.setPlanName('A'.repeat(32) + ' ' + 'B'.repeat(7)); plan.newPlan(`Kopia: ${plan.planName()}`);
    const names = [plan.planName(), ...plan.savedPlans().map(p => p.name)]; expect(names.every(n => n === store.cleanPlanName(n))).toBe(true);
    await restart(); expect([plan.planName(), ...plan.savedPlans().map(p => p.name)]).toEqual(names);
    const st = JSON.parse(JSON.stringify(S())); st.weekPlan.name = ' x'.repeat(30) + '💪'; st.savedPlans = [{ id: 'p', name: 'B'.repeat(39) + '💪 ', days: [] }];
    const m1 = store.migrate(JSON.parse(JSON.stringify(st))); const m2 = store.migrate(JSON.parse(JSON.stringify(m1)));
    expect([m2.weekPlan!.name, m2.savedPlans![0].name]).toEqual([m1.weekPlan!.name, m1.savedPlans![0].name]); expect(m1.savedPlans![0].name).toBe('B'.repeat(39));
  });
  test('B4 (UI-05): nazwa zapisywana przy każdej zmianie pola (bez porządkowania w trakcie pisania), porządkowana przy końcu edycji', () => {
    plan.setWeekDay(0, A); plan.typePlanName('Redukcja '); expect(plan.planName()).toBe('Redukcja ');
    plan.typePlanName('x'.repeat(39) + '💪'); expect(plan.planName()).toBe('x'.repeat(39));
    plan.setPlanName('Redukcja  jesień '); expect(plan.planName()).toBe('Redukcja jesień');
    const id = plan.newPlan()!; plan.typeSavedName(id, 'Urlop '); expect(plan.savedPlans()[0].name).toBe('Urlop ');
    plan.renamePlan(id, '', 'Urlop '); expect(plan.savedPlans()[0].name).toBe('Urlop'); /* pusta nazwa przy wyjściu — poprzednia */
  });
  test('B2 A (UX-04): „Nowy plan” — osobny wpis edytowany przed aktywacją; oryginał bez zmian i pod swoją nazwą; plan bez nazwy dostaje datę; powrót bez odwróconych nazw i bez mnożenia wpisów', () => {
    plan.setWeekDay(0, A); plan.setWeekDay(2, B); /* plan bez nazwy („Mój plan”) */
    const urlop = plan.newPlan('Urlop')!;
    expect(plan.planName()).toBe(''); expect(plan.savedPlans()).toEqual([{ id: urlop, name: 'Urlop', days: [A, null, B, null, null, null, null] }]);
    plan.setSavedDay(urlop, 0, C); plan.setSavedDay(urlop, 2, null); /* edycja przed aktywacją — aktywny plan bez zmian */
    expect(plan.weekPlanDays()).toEqual([A, null, B, null, null, null, null]); expect(plan.savedPlans()[0].days).toEqual([C, null, null, null, null, null, null]);
    plan.activatePlan(urlop);
    expect(plan.planName()).toBe('Urlop'); expect(plan.savedPlans().map(p => [p.name, p.days[0]])).toEqual([['Mój plan (8.10)', A]]);
    const back = plan.savedPlans()[0].id; plan.activatePlan(back); expect(plan.planName()).toBe('Mój plan (8.10)');
    plan.activatePlan(plan.savedPlans()[0].id); plan.activatePlan(plan.savedPlans()[0].id);
    expect(plan.savedPlans().map(p => p.name)).toEqual(['Urlop']); expect(plan.planName()).toBe('Mój plan (8.10)');
  });
  test('B1 (DAT-02 B): zmiany pojedynczych dni od dziś wędrują z planem — zapisane przy wyłączeniu, wracają przy ponownej aktywacji; przeszłe zostają', async () => {
    plan.setWeekDay(0, A); plan.setWeekDay(2, B); plan.setPlanName('Rutyna'); const tmp = plan.newPlan('Przejściowy')!;
    plan.setDayPlan('2026-10-06', C); plan.setDayPlan('2026-10-09', C); plan.setDayPlan('2026-10-14', null); /* wt. (przeszłość), pt., śr. */
    expect(plan.futureChanges()).toBe(2);
    expect(plan.activationNote(tmp)).toBe('Obecny plan zostanie w „Inne plany” razem ze zmianami pojedynczych dni od dziś (2) — wrócą, gdy znów go ustawisz.');
    plan.activatePlan(tmp);
    expect(S().planOverrides).toEqual({ '2026-10-06': C }); const rut = plan.savedPlans().find(p => p.name === 'Rutyna')!;
    expect(rut.overrides).toEqual({ '2026-10-09': C, '2026-10-14': null }); expect(plan.savedChanges(rut.id)).toBe(2);
    plan.setDayPlan('2026-10-10', A); /* zmiana w planie przejściowym */
    expect(plan.activationNote(rut.id)).toBe('Obecny plan zostanie w „Inne plany” razem ze zmianami pojedynczych dni od dziś (1) — wrócą, gdy znów go ustawisz. Wrócą zmiany pojedynczych dni zapisane z tym planem: 2.');
    await restart(); plan.activatePlan(rut.id);
    expect(S().planOverrides).toEqual({ '2026-10-06': C, '2026-10-09': C, '2026-10-14': null });
    expect([plan.plannedOn('2026-10-09'), plan.plannedOn('2026-10-14'), plan.plannedOn('2026-10-10')]).toEqual([C, null, null]);
    expect(plan.savedPlans().find(p => p.name === 'Przejściowy')!.overrides).toEqual({ '2026-10-10': A });
    jest.setSystemTime(at('2026-10-12', 9)); plan.activatePlan(plan.savedPlans().find(p => p.name === 'Przejściowy')!.id);
    expect(S().planOverrides!['2026-10-10']).toBeUndefined(); /* zapisana zmiana z minionego dnia nie wraca */
  });
  test('B1: okno aktywacji — bez obecnego planu nie obiecuje zapisu; bez zmian dni — krótszy tekst', () => {
    const id = plan.addPlan('Nowy', [A], false); expect(plan.activationNote(id)).toBe('');
    plan.activatePlan(id); const id2 = plan.newPlan()!; expect(plan.activationNote(id2)).toBe('Obecny plan zostanie w „Inne plany” — wrócisz do niego jednym przyciskiem.');
  });
  test('B2 (X-14): nazwy planów bez powtórzeń — generator 2× ta sama nazwa, zmiana nazwy w „Inne plany” (pusta — bez zmiany), nazwa aktywnego', () => {
    plan.setWeekDay(0, A); plan.setPlanName('Masa, 3× w tygodniu');
    const p1 = plan.addPlan('Masa, 3× w tygodniu', [B], false); const p2 = plan.addPlan('Masa, 3× w tygodniu', [C], false);
    expect(plan.savedPlans().map(p => p.name)).toEqual(['Masa, 3× w tygodniu (2)', 'Masa, 3× w tygodniu (3)']);
    plan.renamePlan(p2, 'Masa, 3× w tygodniu (2)'); expect(plan.savedPlans().find(p => p.id === p2)!.name).toBe('Masa, 3× w tygodniu (3)');
    plan.renamePlan(p1, '  Jesień '); plan.renamePlan(p2, '   '); expect(plan.savedPlans().map(p => p.name)).toEqual(['Jesień', 'Masa, 3× w tygodniu (3)']);
    plan.setPlanName('Jesień'); expect(plan.planName()).toBe('Jesień (2)');
  });
});

describe('A2–A8 — logika stanu dnia i przesuwania', () => {
  test('A3 (LOG-01 przypadek 1): opuszczony poniedziałek, w środę zrobiony trening spoza planu — „Przesuń plan” i „Przenieś na dziś” nie gubią sesji', () => {
    const wed = '2026-10-07'; jest.setSystemTime(at(wed, 9));
    since('2026-09-28', () => plan.setWeekDay(0, A)); jest.setSystemTime(at(wed, 9));
    const w = addWorkout(at(wed, 7), [['Pull Up', [{ reps: 8 }]]], 'C'); w.templateId = C; store.save();
    expect(plan.moveOnly('2026-10-05', wed, wed)).toEqual({ ok: false, conflict: '', done: true }); /* „Przenieś na dziś” — dziś zajęte */
    const sg = plan.suggest('2026-10-05', wed); const sh = sg.find(x => x.kind === 'shift')!;
    expect(sh.dropped).toBe(0); expect(sg.every(x => x.ov[wed] === undefined)).toBe(true); /* środa zajęta — żadna propozycja jej nie zmienia */
    plan.applySuggestion(sh);
    expect(plan.dayStatus('2026-10-08', wed)).toMatchObject({ status: 'planned', templateId: A }); expect(plan.dayStatus(wed, wed).status).toBe('done');
  });
  test('A3 (LOG-01 przypadek 2): B zrobione w środę, poniedziałek A opuszczony — przesunięcie nie planuje B drugi raz i nie gubi A', () => {
    const wed = '2026-10-07';
    since('2026-09-28', () => { plan.setWeekDay(0, A); plan.setWeekDay(2, B); }); jest.setSystemTime(at(wed, 20));
    const w = addWorkout(at(wed, 7), [['Pull Up', [{ reps: 8 }]]], 'B'); w.templateId = B; store.save();
    const r = plan.shiftPlan('2026-10-05', wed);
    expect(r).toEqual({ moved: [{ from: '2026-10-05', to: '2026-10-08', id: A }] });
    expect([2, 3, 4].map(i => plan.dayStatus(plan.addDays('2026-10-05', i), wed)).map(d => `${d.status}:${d.templateId === A ? 'A' : d.templateId === B ? 'B' : '-'}`)).toEqual(['done:B', 'planned:A', 'rest:-']);
  });
  test('A3: łańcuch omija dzień z treningiem w toku', () => {
    since('2026-09-28', () => { plan.setWeekDay(2, A); plan.setWeekDay(3, B); plan.setWeekDay(4, C); });
    store.startEmpty();
    expect(plan.shiftPlan('2026-10-07').moved.map(m => m.to)).toEqual(['2026-10-09', '2026-10-10']); /* środa (miniona) → pt., pt. C → sob.; dziś w toku */
  });
  test('A4 (UX-03/X-09): miniony dzień — „Przesuń plan od dziś” łańcuchem; zamiana z przeszłością niemożliwa', () => {
    since('2026-09-28', () => { plan.setWeekDay(0, A); plan.setWeekDay(3, B); });
    plan.swapDays('2026-10-05', '2026-10-08'); expect([plan.plannedOn('2026-10-05'), plan.plannedOn('2026-10-08')]).toEqual([A, B]);
    const r = plan.shiftPlan('2026-10-05');
    expect(r.moved).toEqual([{ from: '2026-10-05', to: '2026-10-08', id: A }, { from: '2026-10-08', to: '2026-10-09', id: B }]);
    expect(['2026-10-05', '2026-10-08', '2026-10-09', '2026-10-10'].map(k => plan.dayStatus(k).status)).toEqual(['rest', 'planned', 'planned', 'rest']);
    expect(plan.suggest('2026-10-05').some(x => x.kind === 'swap')).toBe(false);
  });
  test('A5 (X-04, decyzja 08.10 wieczór — dopasowanie po szablonie): inny trening niż w planie — „zrobiony inny”, zaplanowany czeka; zaplanowany zrobiony — „zrobione”', () => {
    plan.setWeekDay(3, A); const w = addWorkout(at('2026-10-08', 7), [['Back Squat', [{ weight: 100, reps: 5 }]]], 'Legs — dom'); w.templateId = D; store.save();
    expect(plan.dayStatus('2026-10-08')).toMatchObject({ status: 'other', templateId: A }); expect(plan.doneOn('2026-10-08').map(x => x.templateName)).toEqual(['Legs — dom']);
    expect(plan.pending(plan.dayStatus('2026-10-08'))).toBe(true); expect(weekTiles(NOW)).toMatchObject({ workouts: 1, planned: 1, planDone: 0 });
    const w2 = addWorkout(at('2026-10-08', 8), [['Back Squat', [{ weight: 100, reps: 5 }]]], 'Upper A'); w2.templateId = A; store.save();
    expect(plan.dayStatus('2026-10-08').status).toBe('done'); expect(weekTiles(NOW)).toMatchObject({ workouts: 2, planned: 1, planDone: 1 });
    plan.setDayPlan('2026-10-08', null); expect(plan.dayStatus('2026-10-08')).toMatchObject({ status: 'done', templateId: null }); /* trening w dniu bez planu */
  });
  test('A5: miniony dzień — zrobiony inny trening, zaplanowany nie zrobiony; przeniesienie zaplanowanego od dziś', () => {
    since('2026-09-28', () => plan.setWeekDay(1, A)); const w = addWorkout(at('2026-10-06'), [['Back Squat', [{ weight: 100, reps: 5 }]]], 'Legs'); w.templateId = D; store.save();
    expect(plan.dayStatus('2026-10-06').status).toBe('other');
    const s = plan.suggest('2026-10-06'); expect(s[0]).toMatchObject({ kind: 'shift', dropped: 0 });
    expect(s.find(x => x.kind === 'skip')).toMatchObject({ dropped: 1 }); /* pominięcie gubi zaplanowany trening (zrobiony inny się liczy osobno) */
    plan.shiftPlan('2026-10-06'); expect([plan.dayStatus('2026-10-06').status, plan.plannedOn('2026-10-08')]).toEqual(['done', A]);
  });
  test('A6 (X-05): hasPlan — same „wolne” i martwe id to nie plan; zmiany równe nowemu planowi znikają', () => {
    plan.setWeekDay(4, A); plan.setDayPlan('2026-10-09', null); plan.setWeekDay(4, null);
    expect(plan.hasPlan()).toBe(false); expect(S().planOverrides).toBeUndefined(); expect(weekTiles(NOW).planned).toBeNull(); expect(firstSteps()!.plan).toBe(false);
    plan.setWeekDay(0, B); plan.setDayPlan('2026-10-06', C); plan.setDayPlan('2026-10-13', C);
    plan.removeTemplate(B); plan.removeTemplate(C);
    expect(plan.hasPlan()).toBe(false); expect(S().planOverrides).toEqual({ '2026-10-06': C }); /* miniona zmiana zostaje (przeszłość) */
    expect(plan.futureChanges()).toBe(0);
    plan.setDayPlan('2026-10-14', A); expect(plan.hasPlan()).toBe(true); /* „Dodaj trening” bez planu tygodnia */
    plan.setWeekDay(2, A); expect(S().planOverrides).toEqual({ '2026-10-06': C }); /* zmiana równa nowej bazie (śr. A) znika */
  });
  test('A7 (X-06): usunięcie szablonu — znika z planu, zapisanych planów i przyszłych zmian dni; aktywacja planu z usuniętym szablonem bez martwego id', () => {
    plan.setWeekDay(0, A); plan.setWeekDay(3, B); const sp = plan.newPlan('kopia')!; plan.setDayPlan('2026-10-09', A); plan.setDayPlan('2026-10-06', A);
    const ghost = plan.addPlan('Z usuniętym', [null, 'nie-ma-takiego', null, null, null, null, null], false);
    plan.removeTemplate(A);
    expect(plan.weekPlanDays()).toEqual([null, null, null, B, null, null, null]); expect(plan.savedPlans().find(p => p.id === sp)!.days[0]).toBeNull();
    expect(S().planOverrides).toEqual({ '2026-10-06': A });
    plan.activatePlan(ghost); expect(plan.weekPlanDays()).toEqual([null, null, null, null, null, null, null]);
  });
  test('A7 (UX-07/UI-06): skutki usunięcia / archiwizacji szablonu dla planu — dni planu, zmiany dni, zapisane plany, trening w toku', () => {
    plan.setWeekDay(0, A); plan.setWeekDay(3, A); plan.newPlan('Urlop'); plan.setDayPlan('2026-10-10', A);
    const tpl = S().templates.find(x => x.id === A)!; store.startFromTemplate(tpl);
    expect(plan.templateUsageText(A).split('\n')).toEqual(['W planie tygodnia: pon., czw. — te dni będą wolne.', 'Zaplanowany też na: sob., 10.10 — te dni będą wolne.', 'W zapisanych planach: Urlop.', 'Trwa trening z tego szablonu — zostanie bez zmian.']);
    expect(plan.templateUsageText(A, true)).toContain('Po przywróceniu z archiwum szablon wróci do planu.');
    expect(plan.templateUsageText(B)).toBe('');
  });
  test('A7 (X-06): „wolne” na dniu, którego szablon jest w archiwum, zostaje po przywróceniu szablonu', () => {
    plan.setWeekDay(4, A); const tpl = S().templates.find(x => x.id === A)!; store.setTemplateArchived(tpl, true);
    plan.setDayPlan('2026-10-16', null); store.setTemplateArchived(tpl, false);
    expect([plan.plannedOn('2026-10-16'), plan.plannedOn('2026-10-23')]).toEqual([null, A]);
  });
});

describe('A10, I — propozycje i przypomnienia', () => {
  test('A10 (LOG-13): propozycje bez duplikatów (przesunięcie o jeden dzień = przeniesienie na następny dzień)', () => {
    plan.setWeekDay(3, A); const s = plan.suggest('2026-10-08');
    const keys = s.map(x => JSON.stringify(Object.entries(x.ov).sort())); expect(new Set(keys).size).toBe(keys.length);
    expect(s[0].kind).toBe('shift'); expect(s.some(x => x.kind === 'move' && x.to === '2026-10-09')).toBe(false);
  });
  test('A8 (X-10): pusty szablon w planie — bez przypomnienia', async () => {
    jest.setSystemTime(new Date(2026, 9, 8, 6).getTime());
    const tpl = S().templates.find(x => x.id === A)!; tpl.items = []; store.save(tpl); plan.setWeekDay(3, A); plan.setWeekDay(4, B);
    global.__notifications.length = 0; await syncPlanReminders();
    expect((global.__notifications as any[]).map(n => n.identifier)).toEqual(Array.from({ length: PLAN_REMINDER_DAYS }, (_, i) => plan.addDays('2026-10-08', i)).filter(k => plan.weekdayIdx(k) === 4).map(k => `plan-${k}`));
  });
  test('I1 (UX-05): horyzont przypomnień ok. 28 dni (jedna stała) — kto nie otworzy aplikacji przez tydzień, dalej dostaje przypomnienia', async () => {
    expect(PLAN_REMINDER_DAYS).toBe(28); expect(PLAN_REMINDER_HOUR).toBe(8);
    jest.setSystemTime(new Date(2026, 9, 8, 6).getTime()); for (let i = 0; i < 7; i++) plan.setWeekDay(i, B);
    global.__notifications.length = 0; await syncPlanReminders(); expect(global.__notifications).toHaveLength(28);
  });
  test('I2 (X-12/LOG-12): klucz przypomnień zależy od języka — po zmianie języka przypomnienia planują się od nowa', () => {
    plan.setWeekDay(4, A); const k1 = planReminderKey(NOW);
    S().settings.language = 'en'; store.applyPrefs(); store.save(); expect(planReminderKey(NOW)).not.toBe(k1);
  });
  test('I2 (LOG-12): synchronizacja o 7:59:30 nie odwołuje dzisiejszego przypomnienia (odwołuje, gdy dziś już nie trzeba)', async () => {
    const t0 = new Date(2026, 9, 8, 7, 59, 30).getTime(); jest.setSystemTime(t0); plan.setWeekDay(3, A);
    global.__cancelled.length = 0; await syncPlanReminders(t0); expect(global.__cancelled).not.toContain('plan-2026-10-08');
    plan.setDayPlan('2026-10-08', null); global.__cancelled.length = 0; await syncPlanReminders(t0); expect(global.__cancelled).toContain('plan-2026-10-08');
  });
});

describe('macierz — funkcje pomocnicze planu i danych (audyt 0.10, każdy przypadek wprost)', () => {
  test('store.planDays / store.normPlanHistory / store.cleanOverrides: 7 dni, poprawne daty, porządek, scalanie, śmieci odrzucone', () => {
    expect(store.planDays([A, '', 5, null, B])).toEqual([A, null, null, null, B, null, null]); expect(store.planDays('x')).toEqual(Array(7).fill(null));
    const d = (x: string | null) => [x, null, null, null, null, null, null];
    expect(store.normPlanHistory([{ from: '2026-09-10', days: d(B) }, { from: '2026-09-01', days: d(A) }, { from: '2026-09-05', days: d(A) }, { from: 'zła', days: d(C) }, 7]))
      .toEqual([{ from: '2026-09-01', days: d(A) }, { from: '2026-09-10', days: d(B) }]); /* rosnąco, równe sąsiednie scalone */
    expect(store.normPlanHistory([{ from: '2026-09-01', days: d(null) }, { from: '2026-09-02', days: d(A) }])).toEqual([{ from: '2026-09-02', days: d(A) }]); /* bez pustego początku */
    expect(store.normPlanHistory(null)).toEqual([]);
    expect(store.cleanOverrides({ '2026-10-09': A, '2026-10-10': null, 'zły': A, '2026-10-11': '', '2026-10-12': 3 })).toEqual({ '2026-10-09': A, '2026-10-10': null }); expect(store.cleanOverrides([])).toEqual({});
  });
  test('plan.dayStatusFrom: wolne, opuszczony, zaplanowany, zrobione (zaplanowany szablon albo dzień bez planu), zrobiony inny (A5)', () => {
    since('2026-09-01', () => { plan.setWeekDay(0, A); plan.setWeekDay(4, A); });
    const w = (tpl?: string) => ({ ...addWorkout(at('2026-10-05'), [['Back Squat', [{ weight: 100, reps: 5 }]]]), templateId: tpl ?? null });
    expect(plan.dayStatusFrom('2026-10-06', []).status).toBe('rest'); expect(plan.dayStatusFrom('2026-10-05', []).status).toBe('missed'); expect(plan.dayStatusFrom('2026-10-09', []).status).toBe('planned');
    expect(plan.dayStatusFrom('2026-10-05', [w(A)])).toMatchObject({ status: 'done', templateId: A }); expect(plan.dayStatusFrom('2026-10-05', [w(B)]).status).toBe('other');
    expect(plan.dayStatusFrom('2026-10-06', [w(B)]).status).toBe('done'); expect(plan.pending(plan.dayStatusFrom('2026-10-05', [w(B)]))).toBe(true);
  });
  test('plan.doneInfo: partie i szablony zrobionych treningów i treningu w toku w oknie; poza oknem — nic', () => {
    const w = addWorkout(at('2026-10-06'), [['Back Squat', [{ weight: 100, reps: 5 }]]]); w.templateId = A; addWorkout(at('2026-09-20'), [['Back Squat', [{ weight: 100, reps: 5 }]]]);
    const i = plan.doneInfo('2026-10-05', 7); expect([...i.tpls.get('2026-10-06')!]).toEqual([A]); expect(i.muscles.get('2026-10-06')!.size).toBeGreaterThan(0); expect(i.tpls.has('2026-09-20')).toBe(false);
    store.startFromTemplate(S().templates.find(x => x.id === B)!); expect(plan.doneInfo('2026-10-05', 7).tpls.get('2026-10-08')!.has(B)).toBe(true);
  });
  test('plan.templateUsage: dni planu, zmiany od dziś (bez minionych), zapisane plany, trening w toku', () => {
    plan.setWeekDay(1, A); plan.setDayPlan('2026-10-10', A); S().planOverrides!['2026-10-01'] = A; plan.addPlan('Wakacje', [null, null, A, null, null, null, null], false);
    expect(plan.templateUsage(A)).toEqual({ weekDays: [1], dates: ['2026-10-10'], saved: ['Wakacje'], active: false });
    store.startFromTemplate(S().templates.find(x => x.id === A)!); expect(plan.templateUsage(A).active).toBe(true); expect(plan.templateUsage(C)).toEqual({ weekDays: [], dates: [], saved: [], active: false });
  });
  test('deload.snoozeDeloadHint (D4): „Nie teraz” chowa podpowiedź dla tego tygodnia i przetrwa restart', async () => {
    const { snoozeDeloadHint, deloadHint } = require('@/lib/deload');
    ['2026-09-14', '2026-09-21', '2026-09-28', '2026-10-06'].forEach(k => addWorkout(at(k), [['Back Squat', [{ weight: 100, reps: 5 }]]]));
    const h = deloadHint(NOW); expect(h.kind).toBe('suggest'); snoozeDeloadHint(h.from); expect(deloadHint(NOW).kind).toBe('none');
    await restart(); expect(S().deloadSnooze).toBe(h.from); expect(require('@/lib/deload').deloadHint(NOW).kind).toBe('none');
  });
  test('planReminder.reminderPermission / askReminderPermission (I1): stan zgody; okno tylko przy „nie pytano” i włączonym przypomnieniu', async () => {
    const { reminderPermission, askReminderPermission } = require('@/lib/planReminder'); const g = global as any;
    try {
      g.__notifPerm = { granted: true }; expect(await reminderPermission()).toBe('granted');
      g.__notifPerm = { granted: false, canAskAgain: false, status: 'denied' }; expect(await reminderPermission()).toBe('denied');
      g.__notifPerm = { granted: false, canAskAgain: true, status: 'undetermined' }; expect(await reminderPermission()).toBe('undetermined');
      global.__alerts.length = 0; S().settings.planReminder = false; await askReminderPermission(); expect(global.__alerts).toHaveLength(0);
      delete S().settings.planReminder; g.__notifPermAsked = 0; await askReminderPermission(); const a = global.__alerts.at(-1)!;
      expect(a.title).toBe('Przypomnienie o treningu z planu'); expect(a.buttons!.map(b => b.text)).toEqual(['Nie teraz', 'Dalej']);
      a.buttons![1].onPress?.(); await Promise.resolve(); expect(g.__notifPermAsked).toBe(1);
      g.__notifPerm = { granted: false, canAskAgain: false, status: 'denied' }; global.__alerts.length = 0; await askReminderPermission(); expect(global.__alerts).toHaveLength(0);
    } finally { delete g.__notifPerm; delete g.__notifPermAsked; }
  });
  test('backup.exportRawData (J1): surowe dane do pliku „trening-dane-<data>.json” i udostępnienie; brak danych — false', async () => {
    const { exportRawData } = require('@/lib/backup'); const fs = require('expo-file-system/legacy'); const sh = require('expo-sharing');
    await store.flush(); fs.writeAsStringAsync.mockClear(); sh.shareAsync.mockClear();
    expect(await exportRawData()).toBe(true); expect(fs.writeAsStringAsync.mock.calls[0][0]).toBe('file:///cache/trening-dane-2026-10-08.json');
    expect(JSON.parse(fs.writeAsStringAsync.mock.calls[0][1]).format).toBe('trening-recovery'); expect(sh.shareAsync).toHaveBeenCalledTimes(1);
    global.__kv.clear(); expect(await exportRawData()).toBe(false);
  });
});
