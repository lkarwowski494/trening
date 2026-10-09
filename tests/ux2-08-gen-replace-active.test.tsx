/* Audyt kontrolny 1, UX2-08 (NISKA, resztka UX-10): wygeneruj → „Ustaw jako aktywny” → wygeneruj jeszcze raz → nie było pytania „Zastąpić…?”
 * (replaceable() pomijał szablony aktywnego planu), wynik „FBW A, FBW B, FBW A (2), FBW B (2)” i plan „… (2)”.
 * Naprawa (propozycja audytora): aktywny plan zrobiony wyłącznie z nieużywanych szablonów z „Wygenerowane”, który jeszcze nie obowiązywał
 * w żadnym minionym dniu (odcinek historii od dziś) i nie ma zmian dni od dziś, też jest do zastąpienia; okno mówi wprost, że zastąpi aktywny plan,
 * a nowy plan staje się aktywny w jego miejsce (bez pytania „Tylko zapisz”, po którym nie byłoby aktywnego planu).
 * Rodzaje: logika (replaceable/saveGenerated), ekran (okno i przyciski), scenariusz (dwa generowania), dane (zapis/restart), EN. */
import * as store from '@/lib/store';
import * as plan from '@/lib/plan';
import { generate, saveGenerated, replaceable, type GenInput } from '@/lib/generator';
import { applyLang } from '@/lib/i18n';
import { fresh, saved, addWorkout, withDemoTemplates } from './helpers';
import { renderApp, flushAll, screen, tap, act, go } from './app';

jest.setTimeout(120000);
const NOW = new Date(2026, 9, 8, 9, 0); /* czwartek */
const S = () => store.getState();
const inp = (o: Partial<GenInput> = {}): GenInput => ({ goal: 'hypertrophy', locationId: null, sessions: 3, minutes: 60, ...o });
afterEach(() => { applyLang('pl'); });

describe('UX2-08 — logika: aktywny plan z samych nieużywanych wygenerowanych szablonów', () => {
  beforeEach(async () => { jest.useFakeTimers({ now: NOW.getTime() }); await fresh(); });
  test('zaraz po aktywacji: szablony aktywnego planu do zastąpienia, activePlan = true; zastąpienie bez „(2)”, nowy plan aktywny', () => {
    const i = inp(); const first = saveGenerated(generate(i), i, true);
    expect(replaceable()).toEqual({ templateIds: first.templateIds, planIds: [], activePlan: true });
    const second = saveGenerated(generate(i), i, false, true); /* „Zastąp” — nowy plan zajmuje miejsce aktywnego, także przy activate = false */
    expect(S().templates.map(x => x.name)).toEqual(['FBW A', 'FBW B']); expect(second.templateIds).not.toEqual(first.templateIds);
    expect(plan.planName()).toBe('Masa, 3× w tygodniu · Pełna siłownia'); expect(plan.weekPlanDays().filter(Boolean).every(id => second.templateIds.includes(id!))).toBe(true);
    expect(plan.savedPlans()).toEqual([]); /* zastąpiony plan nie trafia do „Inne plany” z pustymi dniami */
    expect(S().planHistory!.flatMap(s => s.days).filter(Boolean).every(id => second.templateIds.includes(id!))).toBe(true); /* odcinek od dziś nadpisany */
    expect(second.planName).toBe('Masa, 3× w tygodniu · Pełna siłownia');
  });
  test('poprzedni plan użytkownika zostaje w „Inne plany”; zastąpiony jest tylko plan z generatora', () => {
    const t = withDemoTemplates(); plan.setWeekDay(0, t[0].id); plan.setPlanName('Mój');
    const i = inp(); saveGenerated(generate(i), i, true); expect(plan.savedPlans().map(p => p.name)).toEqual(['Mój']);
    expect(replaceable().activePlan).toBe(true); saveGenerated(generate(i), i, true, true);
    expect(plan.savedPlans().map(p => p.name)).toEqual(['Mój']); expect(S().templates.filter(x => x.folder === 'Wygenerowane').map(x => x.name)).toEqual(['FBW A', 'FBW B']);
  });
  test('nie: trening z szablonu, zmiana dnia od dziś, plan obowiązywał wczoraj, szablon spoza folderu w planie, szablon trzymany przez inny plan', () => {
    const i = inp();
    const a = saveGenerated(generate(i), i, true); addWorkout(NOW.getTime() - 3600e3, [['Back Squat', [{ weight: 100, reps: 5 }]]]).templateId = a.templateIds[0]; store.save();
    expect(replaceable().activePlan).toBe(false); expect(replaceable().templateIds).toEqual([]);
    S().workouts.length = 0; store.save(); expect(replaceable().activePlan).toBe(true);
    const k = plan.upcoming(7).find(x => x.templateId)!.date; /* dzień z treningiem od dziś → „Wolne” */
    plan.setDayPlan(k, null); expect(plan.futureChanges()).toBe(1); expect(replaceable().activePlan).toBe(false); plan.resetDay(k); expect(replaceable().activePlan).toBe(true);
    const own = withDemoTemplates()[0]; plan.setWeekDay(6, own.id); expect(replaceable().activePlan).toBe(false); plan.setWeekDay(6, null); expect(replaceable().activePlan).toBe(true);
    S().savedPlans = [{ id: 'inny', name: 'Inny', days: [a.templateIds[1], own.id, null, null, null, null, null] }]; store.save();
    expect(replaceable().activePlan).toBe(false); expect(replaceable().templateIds).toEqual([]); /* aktywny plan zostaje, więc i jego szablony */ delete S().savedPlans;
    /* plan obowiązywał już wczoraj (odcinek historii sprzed dziś) — minione dni planu zostają jak były */
    jest.setSystemTime(new Date(2026, 9, 9, 9).getTime()); expect(replaceable().activePlan).toBe(false); expect(replaceable().templateIds).toEqual([]);
  });
  test('dane: po zastąpieniu zapis → restart (migrate) bez zmian, bez osieroconych id', async () => {
    const i = inp(); saveGenerated(generate(i), i, true); saveGenerated(generate(i), i, true, true); await act(async () => { await store.flush(); });
    const before = JSON.stringify({ t: S().templates.map(x => x.id), w: S().weekPlan, h: S().planHistory });
    await fresh(saved() as never); expect(JSON.stringify({ t: S().templates.map(x => x.id), w: S().weekPlan, h: S().planHistory })).toBe(before);
    const ids = new Set(S().templates.map(x => x.id)); expect(plan.weekPlanDays().filter(Boolean).every(id => ids.has(id!))).toBe(true);
  });
});

describe('UX2-08 — ekran generatora', () => {
  const boot = async (fn: () => void = () => {}, locale: 'pl' | 'en' = 'pl') => {
    jest.useFakeTimers({ now: NOW }); await fresh(undefined, locale); fn();
    await act(async () => { await store.flush(); }); await renderApp({ saved: JSON.parse(JSON.stringify(saved())), locale, url: '/generator' }); jest.setSystemTime(NOW.getTime()); await flushAll(10);
  };
  const lastAlert = (title: string) => [...global.__alerts].reverse().find(x => x.title === title);
  const press = async (title: string, btn: string) => { const a = lastAlert(title)!; expect(a).toBeTruthy(); await act(async () => { a.buttons!.find(b => b.text === btn)!.onPress?.(); }); await flushAll(10); };
  const saveBtn = async (label = 'Zapisz szablony i plan') => { await tap(screen.getByText(label)); await flushAll(5); };
  const Q = 'Zastąpić poprzednio wygenerowane, nieużywane szablony?';

  test('wygeneruj → „Ustaw jako aktywny” → wygeneruj znowu: pytanie mówi o aktywnym planie; „Zastąp” — bez „(2)”, nowy plan aktywny od razu', async () => {
    await boot(); await saveBtn(); await press('Ustawić nowy plan jako aktywny?', 'Ustaw jako aktywny');
    await go('/generator'); await flushAll(10); await tap(screen.getByText('Siła')); await flushAll(5); global.__alerts.length = 0; await saveBtn();
    const a = lastAlert(Q)!; expect(a).toBeTruthy();
    expect(a.msg).toBe('Bez treningów: FBW A, FBW B. To zastąpi też aktywny plan „Masa, 3× w tygodniu · Pełna siłownia”, zrobiony tylko z tych szablonów — „Zastąp” je usunie i ustawi nowy plan jako aktywny w jego miejsce, „Zostaw” doda nowe obok.');
    expect(a.buttons!.map(b => [b.text, b.style])).toEqual([['Anuluj', 'cancel'], ['Zostaw', undefined], ['Zastąp', 'destructive']]);
    await press(Q, 'Zastąp');
    expect(lastAlert('Ustawić nowy plan jako aktywny?')).toBeUndefined(); /* plan zastępuje aktywny — bez „Tylko zapisz” */
    expect(S().templates.map(x => x.name)).toEqual(['FBW A', 'FBW B']); expect(plan.planName()).toBe('Siła, 3× w tygodniu · Pełna siłownia'); expect(plan.savedPlans()).toEqual([]);
    expect(lastAlert('Zapisano')!.msg).toBe('Szablony: FBW A, FBW B — w folderze „Wygenerowane” na liście Szablony.\nPlan „Siła, 3× w tygodniu · Pełna siłownia” jest teraz aktywny.');
  });
  test('„Zostaw” — jak dotąd: pytanie o aktywację, nowe szablony obok', async () => {
    await boot(); await saveBtn(); await press('Ustawić nowy plan jako aktywny?', 'Ustaw jako aktywny'); await go('/generator'); await flushAll(10); await saveBtn();
    await press(Q, 'Zostaw'); await press('Ustawić nowy plan jako aktywny?', 'Tylko zapisz');
    expect(S().templates.map(x => x.name)).toEqual(['FBW A', 'FBW B', 'FBW A (2)', 'FBW B (2)']); expect(plan.planName()).toBe('Masa, 3× w tygodniu · Pełna siłownia');
  });
  test('bez aktywnego planu do zastąpienia — dawny tekst („poza aktywnym planem”)', async () => {
    await boot(() => { const i = inp(); saveGenerated(generate(i), i, false); }); await saveBtn();
    expect(lastAlert(Q)!.msg).toBe('Bez treningów i poza aktywnym planem: FBW A, FBW B, Masa, 3× w tygodniu · Pełna siłownia. „Zastąp” je usunie, „Zostaw” doda nowe obok.');
  });
  test('English: the message names the active plan', async () => {
    await boot(() => { const i = inp(); saveGenerated(generate(i), i, true); }, 'en'); await saveBtn('Save templates and plan');
    expect(lastAlert('Replace previously generated, unused templates?')!.msg).toBe('Not used in any workout: Full Body A, Full Body B. This also replaces the active plan “Muscle, 3× per week · Full gym”, made only of these templates — “Replace” deletes them and makes the new plan active in its place, “Keep” adds the new ones alongside.');
  });
});
