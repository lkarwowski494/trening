/*
 * Ekran główny — układ B „najpierw trening” (decyzja właściciela 09.10.2026 ok. 15:20, doprecyzowanie ok. 15:30; docs/18).
 * Rodzaje testów (docs/20): logika (lib/home.ts: reguła dużego przycisku, arkusz „Inny trening”, wiersz planu), ekran (StartPanel, arkusz,
 * karta Planowania, kolejność sekcji), scenariusz z restartem, języki (EN), deload (to samo pytanie co Start), strażnik treningu w toku.
 */
import * as store from '@/lib/store';
import * as plan from '@/lib/plan';
import { mainStart, otherStarts, planSummary, startableTemplates, NEXT_PLAN_DAYS } from '@/lib/home';
import type { Template } from '@/lib/seed';
import { fresh, addWorkout, saved, withDemoTemplates, pressAlert } from './helpers';
import { renderApp, flushAll, screen, tap, act, fromHome, go } from './app';

jest.setTimeout(60000);
const NOW = new Date(2026, 9, 8, 9); /* czwartek; tydzień pon 5 … nd 11 października 2026 */
const at = (d: number, h = 18) => new Date(2026, 9, d, h).getTime();
const S = () => store.getState();
const boot = async (prep: (t: Template[]) => void = () => {}, locale: 'pl' | 'en' = 'pl', demo = true) => {
  jest.useFakeTimers({ now: NOW }); await fresh(undefined, locale); const t = demo ? withDemoTemplates(locale) : []; prep(t); await act(async () => { await store.flush(); });
  await renderApp({ saved: JSON.parse(JSON.stringify(saved())), locale }); await flushAll(10); return t;
};
/** plan ustawiony w poniedziałek 5.10 (historia planu) — `days`: indeks dnia (pon = 0) → indeks szablonu */
const setPlan = (t: Template[], days: Record<number, number>) => { jest.setSystemTime(at(5, 6)); for (const [i, k] of Object.entries(days)) plan.setWeekDay(Number(i), t[k].id); jest.setSystemTime(NOW); };
const labels = () => screen.getAllByRole('button').map(b => b.props.accessibilityLabel as string);
const order = (...ids: string[]) => { const all = screen.UNSAFE_root.findAll(n => typeof n.type === 'string' && ids.includes(n.props.testID)).map(n => n.props.testID as string); return ids.map(id => all.indexOf(id)); };

describe('logika (lib/home.ts)', () => {
  beforeEach(() => { jest.useFakeTimers({ now: NOW }); });
  test('puste dane: „Pusty trening”, arkusz bez dubla; startableTemplates pomija puste i zarchiwizowane', async () => {
    await fresh(); expect(mainStart()).toEqual({ kind: 'empty' }); expect(otherStarts()).toEqual([]); expect(planSummary()).toBeNull();
    const e = store.newTemplate(); expect(startableTemplates()).toEqual([]); void e;
    const t = withDemoTemplates(); t[1].archived = true; store.save(); expect(startableTemplates().map(x => x.id)).toEqual([t[0].id, t[2].id, t[3].id]);
  });
  test('bez planu: następny szablon po ostatnio zrobionym, w kółko; bez historii — pierwszy; trening bez szablonu się nie liczy', async () => {
    await fresh(); const t = withDemoTemplates();
    expect(mainStart()).toEqual({ kind: 'next', tpl: t[0] });
    addWorkout(at(5), [['Back Squat', [{ weight: 100, reps: 5 }]]], t[1].name).templateId = t[1].id; store.save();
    expect(mainStart()).toEqual({ kind: 'next', tpl: t[2], after: t[1].name });
    addWorkout(at(6), [['Back Squat', [{ weight: 100, reps: 5 }]]], 'wolny'); /* bez szablonu — pomijany */ expect(mainStart()).toMatchObject({ tpl: t[2] });
    addWorkout(at(7), [['Back Squat', [{ weight: 100, reps: 5 }]]], t[3].name).templateId = t[3].id; store.save();
    expect(mainStart()).toEqual({ kind: 'next', tpl: t[0], after: t[3].name }); /* granica: ostatni na liście → pierwszy */
    store.deleteTemplate(t[3].id); expect(mainStart()).toEqual({ kind: 'next', tpl: t[2], after: t[1].name }); /* szablon ostatniego usunięty — liczy się wcześniejszy trening z szablonem */
  });
  test('z planem: dziś zaplanowany → „plan”; dziś zrobione/wolne → najbliższy z planu (14 dni); trening w toku → „resume”', async () => {
    await fresh(); const t = withDemoTemplates(); setPlan(t, { 3: 0, 5: 1 });
    expect(mainStart()).toEqual({ kind: 'plan', tpl: t[0] });
    const w = addWorkout(at(8, 7), [['Back Squat', [{ weight: 100, reps: 5 }]]], t[0].name); w.templateId = t[0].id; store.save();
    expect(mainStart()).toEqual({ kind: 'planNext', tpl: t[1], date: '2026-10-10' });
    expect(NEXT_PLAN_DAYS).toBe(14);
    store.startEmpty(); expect(mainStart()).toEqual({ kind: 'resume' }); expect(otherStarts(mainStart()).map(o => o.kind)).toEqual(['planOther', 'repeat', 'template', 'empty']);
  });
  test('plan z samym pustym szablonem — reguła bez planu', async () => {
    await fresh(); const t = withDemoTemplates(); const e = store.newTemplate(); jest.setSystemTime(at(5, 6)); plan.setWeekDay(3, e.id); jest.setSystemTime(NOW);
    expect(mainStart()).toEqual({ kind: 'next', tpl: t[0] });
  });
  test('arkusz: inny z planu (inny niż duży przycisk), powtórz ostatni, z szablonu (liczba), pusty — w tej kolejności', async () => {
    await fresh(); const t = withDemoTemplates(); setPlan(t, { 3: 0, 4: 2 });
    addWorkout(at(6), [['Back Squat', [{ weight: 100, reps: 5 }]]], 'Nogi');
    const m = mainStart(); expect(m).toEqual({ kind: 'plan', tpl: t[0] });
    expect(otherStarts(m)).toEqual([{ kind: 'planOther', tpl: t[2], date: '2026-10-09' }, { kind: 'repeat', name: 'Nogi', date: at(6) }, { kind: 'template', count: 4 }, { kind: 'empty' }]);
  });
  test('wiersz planu: nazwa, dni z treningiem w tygodniu planu, najbliższy po dziś', async () => {
    await fresh(); const t = withDemoTemplates(); setPlan(t, { 3: 0, 5: 1, 6: 2 }); plan.setPlanName('Góra / Dół');
    expect(planSummary()).toEqual({ name: 'Góra / Dół', days: 3, next: { date: '2026-10-10', templateId: t[1].id } });
  });
});

describe('ekran', () => {
  test('bez planu: duży przycisk = następny szablon (osobna etykieta od listy), podpis „następny po”, start; karta Planowania rozwinięta pod startem', async () => {
    const t = await boot(t => { addWorkout(at(6), [['Back Squat', [{ weight: 100, reps: 5 }]]], t[0].name).templateId = t[0].id; store.save(); });
    const b = screen.getByTestId('start-main'); expect(b.props.accessibilityLabel).toBe(`Start następnego treningu: ${t[1].name}`);
    expect(screen.getByText(`Start: ${t[1].name}`)).toBeTruthy(); expect(screen.getByText(`następny po: ${t[0].name} · ${t[1].items.length} ćw.`)).toBeTruthy();
    expect(screen.getAllByLabelText(`Start: ${t[1].name}`)).toHaveLength(1); /* lista szablonów zostaje — bez dubla etykiety */
    const [tp, sp, pc, ws] = order('today-plan', 'start-panel', 'planning-card', 'week-tiles'); expect(tp).toBeLessThan(sp); expect(sp).toBeLessThan(pc); expect(pc).toBeLessThan(ws);
    for (const l of ['+ Nowy szablon', 'Plan z moich szablonów', 'Wygeneruj szablony i plan']) expect(labels()).toContain(l);
    expect(screen.getByText('Planowanie')).toBeTruthy(); /* nagłówek karty (wersaliki wg języka — textTransform) */ expect(screen.getByLabelText('Inny trening').props.accessibilityHint).toBe('Inny z planu, powtórz ostatni, z szablonu albo pusty.');
    expect(screen.queryByText('Ustawienia')).toBeNull(); /* Ustawienia tylko w „Więcej” */
    await tap(b); await flushAll(10); expect(S().active?.templateId).toBe(t[1].id);
  });
  test('„Plan z moich szablonów” → generator w trybie własnych szablonów (?mode=own)', async () => {
    await boot(t => { addWorkout(at(6), [['Back Squat', [{ weight: 100, reps: 5 }]]], t[0].name); });
    await tap(screen.getByLabelText('Plan z moich szablonów')); await flushAll(10);
    expect(screen.UNSAFE_root.findAll(n => (n.type as unknown) === 'RNSScreenStackHeaderConfig').map(n => n.props.title)).toContain('Generator szablonów i planu');
  });
  test('z planem: „Start: <dzisiejszy>” z podpisem, arkusz z „Inny z planu”, Planowanie zwinięte do wiersza niżej (rozwija się)', async () => {
    const t = await boot(t => { setPlan(t, { 3: 0, 4: 2 }); plan.setPlanName('Góra / Dół'); addWorkout(at(6), [['Back Squat', [{ weight: 100, reps: 5 }]]], 'Nogi'); });
    const b = screen.getByTestId('start-main'); expect(b.props.accessibilityLabel).toBe(`Start zaplanowanego treningu: ${t[0].name}`);
    expect(screen.getByText(`dziś w planie · ${t[0].items.length} ćw.`)).toBeTruthy();
    const [sp, ws, pc] = order('start-panel', 'week-tiles', 'planning-card'); expect(sp).toBeLessThan(ws); expect(ws).toBeLessThan(pc);
    const row = screen.getByTestId('planning-row'); expect(row.props.accessibilityHint).toBe('Rozwija planowanie.'); expect(row.props.accessibilityLabel).toBe(`Plan: Góra / Dół · 2 dni · następny: ${store.fmtDayKey('2026-10-09')} ${t[2].name}`);
    expect(labels()).not.toContain('Plan z moich szablonów'); await tap(row); await flushAll(5); expect(labels()).toContain('Plan z moich szablonów'); expect(screen.getByTestId('planning-row').props.accessibilityState).toEqual({ expanded: true });
    await tap(screen.getByLabelText('Inny trening')); await flushAll(5);
    const l = labels(); const idx = [`Inny z planu: ${t[2].name}`, 'Powtórz ostatni (Nogi)', 'Z szablonu', 'Pusty trening'].map(x => l.indexOf(x));
    expect(idx.every(i => i >= 0)).toBe(true); expect([...idx].sort((a, b) => a - b)).toEqual(idx);
    expect(screen.getByText(`${t[2].name} · w planie na: jutro`)).toBeTruthy(); expect(screen.getByText('4 szablony')).toBeTruthy();
    await tap(screen.getByLabelText(`Inny z planu: ${t[2].name}`)); await flushAll(10); expect(S().active?.templateId).toBe(t[2].id);
  });
  test('arkusz: „Z szablonu” → Szablony, „Anuluj” zamyka, „Pusty trening” startuje pusty', async () => {
    await boot(t => { addWorkout(at(6), [['Back Squat', [{ weight: 100, reps: 5 }]]], t[0].name); });
    await tap(screen.getByLabelText('Inny trening')); await flushAll(5); expect(screen.getByTestId('other-sheet')).toBeTruthy();
    await tap(screen.getByLabelText('Anuluj')); await flushAll(5); expect(screen.queryByTestId('other-sheet')).toBeNull();
    await tap(screen.getByLabelText('Inny trening')); await flushAll(5); await tap(screen.getByLabelText('Z szablonu')); await flushAll(10);
    expect(screen.queryByTestId('other-sheet')).toBeNull(); expect(S().active).toBeNull();
    await go('/'); await flushAll(10); await fromHome('Pusty trening'); await flushAll(10); expect(S().active?.exercises).toEqual([]);
  });
  test('bez szablonów (po pierwszym treningu): duży „Pusty trening”, w arkuszu tylko powtórz ostatni', async () => {
    await boot(() => { addWorkout(at(6), [['Back Squat', [{ weight: 100, reps: 5 }]]], 'Nogi'); }, 'pl', false);
    expect(screen.getByTestId('start-main').props.accessibilityLabel).toBe('Pusty trening'); expect(screen.getByText('ćwiczenia dodasz w trakcie')).toBeTruthy();
    await tap(screen.getByLabelText('Inny trening')); await flushAll(5);
    expect(labels()).not.toContain('Pusty trening'); /* arkusz bez dubla dużego przycisku (tło arkusza ukryte przed VoiceOver) */ expect(labels()).toContain('Powtórz ostatni (Nogi)'); expect(labels()).not.toContain('Z szablonu');
  });
  test('nowa osoba: „Pierwsze kroki” zamiast karty Planowania; duży przycisk startu też jest', async () => {
    await boot(() => {}, 'pl', false);
    expect(screen.getByTestId('first-steps')).toBeTruthy(); expect(screen.queryByTestId('planning-card')).toBeNull(); expect(screen.getByTestId('start-main')).toBeTruthy();
  });
  test('tydzień deload: duży przycisk pyta jak Start (to samo pytanie i liczby)', async () => {
    await boot(t => { store.toggleDeloadWeek(NOW.getTime()); addWorkout(at(6), [['Back Squat', [{ weight: 100, reps: 5 }]]], t[3].name).templateId = t[3].id; store.save(); });
    await tap(screen.getByTestId('start-main')); await flushAll(5);
    expect(global.__alerts.filter(x => x.title === 'Tydzień deload')).toHaveLength(1); await act(async () => { pressAlert('Tydzień deload', 'Anuluj'); }); expect(S().active).toBeNull();
  });
  test('EN: etykiety i podpisy po angielsku', async () => {
    const t = await boot(t => { setPlan(t, { 3: 0 }); addWorkout(at(6), [['Back Squat', [{ weight: 100, reps: 5 }]]], 'Legs'); }, 'en');
    expect(screen.getByTestId('start-main').props.accessibilityLabel).toMatch(new RegExp(`^.+: ${t[0].name}$`)); expect(screen.getByText(`planned for today · ${t[0].items.length} ex.`)).toBeTruthy();
    expect(screen.getByLabelText('Other workout')).toBeTruthy(); expect(screen.getByTestId('planning-row').props.accessibilityLabel).toMatch(/^Plan: .* · 1 day · next: /);
  });
  test('restart: duży przycisk liczony z zapisanych danych (ten sam), arkusz zamknięty', async () => {
    const t = await boot(t => { addWorkout(at(6), [['Back Squat', [{ weight: 100, reps: 5 }]]], t[2].name).templateId = t[2].id; store.save(); });
    await tap(screen.getByLabelText('Inny trening')); await flushAll(5);
    await renderApp({ saved: JSON.parse(JSON.stringify(saved())) }); await flushAll(10);
    expect(screen.queryByTestId('other-sheet')).toBeNull(); expect(screen.getByTestId('start-main').props.accessibilityLabel).toBe(`Start następnego treningu: ${t[3].name}`);
  });
});
