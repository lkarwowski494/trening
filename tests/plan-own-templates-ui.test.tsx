/*
 * „Plan z moich szablonów” (decyzja właściciela 09.10.2026, B) — ekrany i scenariusze (docs/20: ekran, scenariusz z restartem, regresja, dane, EN). Logika: tests/plan-own-templates.test.ts;
 * 26 języków i motywy: tests/matrix-dim-langs-routes.test.tsx (trasa /generator?mode=own), dostępność: tests/matrix-a11y.test.tsx, 320 pt:
 * tests/matrix-i18n.test.tsx; E2E: .maestro/18-plan-z-moich-szablonow.yaml.
 */
import * as store from '@/lib/store';
import * as plan from '@/lib/plan';
import * as draft from '@/lib/draft';
import { ownPlan } from '@/lib/generator';
import { applyLang } from '@/lib/i18n';
import { fresh, saved, withDemoTemplates } from './helpers';
import { renderApp, flushAll, screen, tap, act, go } from './app';
import { router } from 'expo-router';

jest.setTimeout(60000);
const NOW = new Date(2026, 9, 8, 9, 0); /* czwartek */
const S = () => store.getState();
afterEach(() => { applyLang('pl'); draft.__resetObjDrafts(); });
const boot = async (url: string, fn: (ids: string[]) => void = () => {}, opts: { demo?: boolean; locale?: 'pl' | 'en' } = {}) => {
  jest.useFakeTimers({ now: NOW }); await fresh(undefined, opts.locale ?? 'pl'); const t = opts.demo === false ? [] : withDemoTemplates(); fn(t.map(x => x.id));
  await act(async () => { await store.flush(); }); await renderApp({ saved: JSON.parse(JSON.stringify(saved())), locale: opts.locale ?? 'pl', url }); jest.setSystemTime(NOW.getTime()); await flushAll(10);
  return t;
};
const restart = async (url: string) => { await act(async () => { await store.flush(); }); await renderApp({ saved: JSON.parse(JSON.stringify(saved())), url }); jest.setSystemTime(NOW.getTime()); await flushAll(10); };
const lastAlert = (title: string) => [...global.__alerts].reverse().find(x => x.title === title);
const press = async (title: string, btn: string) => { const a = lastAlert(title)!; expect(a).toBeTruthy(); await act(async () => { a.buttons!.find(b => b.text === btn)!.onPress?.(); }); await flushAll(10); };
const chip = (name: string) => screen.getByLabelText(`Szablon w planie: ${name}`);

describe('generator: dwa tryby i „Plan z moich szablonów”', () => {
  test('wybór trybu na ekranie generatora; ?mode=own otwiera od razu drugi tryb; tytuł ekranu', async () => {
    await boot('/generator');
    expect(screen.getByText('Nowe szablony i plan').parent).toBeTruthy(); expect(screen.getByRole('button', { name: 'Nowe szablony i plan' }).props.accessibilityState.selected).toBe(true);
    expect(screen.getByText(/^Propozycja według Twoich założeń/)).toBeTruthy();
    await tap(screen.getByRole('button', { name: 'Plan z moich szablonów' })); await flushAll(10);
    expect(screen.getByText('Plan tygodnia z Twoich szablonów według tych samych reguł co generator — przejrzysz go przed zapisem. Szablony zostają bez zmian.')).toBeTruthy();
    expect(screen.queryByText(/^Propozycja według Twoich założeń/)).toBeNull();
    await tap(screen.getByRole('button', { name: 'Nowe szablony i plan' })); await flushAll(10); expect(screen.getByText(/^Propozycja według Twoich założeń/)).toBeTruthy();
    await go('/generator?mode=own'); await flushAll(10); expect(screen.getByText('Dni treningowe w tygodniu')).toBeTruthy();
  });
  test('domyślnie wszystkie szablony z ćwiczeniami (pusty i z archiwum — nie); dni od liczby szablonów; podgląd zgodny z logiką; rotacja; ostrzeżenia; źródła', async () => {
    const t = await boot('/generator?mode=own', () => { const e = store.newTemplate(); e.name = 'Pusty'; store.save(e); });
    for (const x of t) expect(chip(x.name).props.accessibilityState.checked).toBe(true); expect(screen.queryByLabelText('Szablon w planie: Pusty')).toBeNull();
    expect(screen.queryByLabelText('Dni treningowe w tygodniu: 3')).toBeNull(); expect(screen.getByLabelText('Dni treningowe w tygodniu: 4').props.accessibilityState.selected).toBe(true);
    expect(screen.getByText('Dni co najmniej tyle, ile wybranych szablonów.')).toBeTruthy();
    /* zostaw Upper A i Legs — siłownia, 3 dni → A, L, A */
    await tap(chip(t[1].name)); await tap(chip(t[3].name)); await flushAll(5);
    expect(screen.getByLabelText('Dni treningowe w tygodniu: 2')).toBeTruthy(); expect(screen.getByLabelText('Dni treningowe w tygodniu: 3').props.accessibilityState.selected).toBe(true);
    const r = ownPlan({ templateIds: [t[0].id, t[2].id], sessions: 3 })!;
    const wd = (i: number) => new Date(2024, 0, 1 + i).toLocaleDateString('pl-PL', { weekday: 'short' });
    expect(screen.getByText(r.days.map((id, i) => (id ? `${wd(i)} ${S().templates.find(x => x.id === id)!.name}` : null)).filter(Boolean).join(' · '))).toBeTruthy();
    expect(screen.getByText(`Dni: 3, szablony: 2 — szablony powtarzają się po kolei: ${t[0].name} → ${t[2].name} → ${t[0].name}. Co tydzień od początku.`)).toBeTruthy();
    expect(screen.getByText(`${t[0].name}: 2× w tygodniu`)).toBeTruthy(); expect(screen.getByText(`${t[2].name}: 1× w tygodniu`)).toBeTruthy();
    expect(screen.getByText(/^Rzadziej niż 2 dni w tygodniu: /)).toBeTruthy(); expect(screen.getByText(/^Poniżej 10 serii tygodniowo: .+\. To dolny próg zalecany przy budowie masy; serie dodasz w szablonach\.$/)).toBeTruthy();
    expect(screen.getByText(/^Serie na partię w tygodniu \(pomocnicza = 0,5 serii/)).toBeTruthy();
    expect(screen.getByText(/^• Uproszczenie: zwykle dzień przerwy między sesjami z tymi samymi głównymi partiami/)).toBeTruthy();
    expect(screen.getByText(/^• Każda główna partia co najmniej 2 dni w tygodniu \(WHO 2020/)).toBeTruthy();
    expect(screen.getByText('• Więcej dni niż szablonów: szablony po kolei (A, B, A…), jak w generatorze — konwencja.')).toBeTruthy();
    /* bez wyboru — komunikat, bez zapisu */
    await tap(chip(t[0].name)); await tap(chip(t[2].name)); await flushAll(5);
    expect(screen.getByText('Wybierz co najmniej jeden szablon.')).toBeTruthy(); expect(screen.queryByText('Zapisz plan')).toBeNull();
  });
  test('najwyżej OWN_MAX szablonów — 7. nie da się zaznaczyć; opis limitu', async () => {
    const t = await boot('/generator?mode=own', ids => { for (let i = 0; i < 3; i++) store.dupTemplate(ids[i]); });
    expect(screen.getByText('Najwyżej 6 szablonów — każdy dostaje co najmniej jeden dzień.')).toBeTruthy();
    const names = S().templates.map(x => x.name); for (const n of names) expect(chip(n).props.accessibilityState.checked).toBe(false); /* > 6 — bez domyślnego wyboru */
    for (const n of names) await tap(chip(n)); await flushAll(5);
    expect(names.filter(n => chip(n).props.accessibilityState.checked).length).toBe(6); expect(chip(names[6]).props.accessibilityState.checked).toBe(false);
    expect(screen.getByLabelText('Dni treningowe w tygodniu: 6').props.accessibilityState.selected).toBe(true); void t;
  });
  test('bez szablonów z ćwiczeniami: komunikat i „+ Nowy szablon” (edycja nowego szablonu)', async () => {
    await boot('/generator?mode=own', () => {}, { demo: false });
    expect(screen.getByText('Nie masz szablonów z ćwiczeniami. Utwórz szablon albo wybierz „Nowe szablony i plan”.')).toBeTruthy();
    await tap(screen.getByText('+ Nowy szablon')); await flushAll(10); expect(S().templates.length).toBe(1); expect(screen.getByLabelText('Zapisz szablon')).toBeTruthy();
  });
  test('zapis: pytanie jak w generatorze (activationNote); „Anuluj” nic nie zapisuje; „Tylko zapisz” → „Inne plany”; „Ustaw jako aktywny” → plan aktywny, „Plan tygodnia”; szablony bez zmian; po restarcie to samo', async () => {
    const t = await boot('/generator?mode=own', ids => { plan.setWeekDay(0, ids[1]); });
    const snap = JSON.stringify(S().templates);
    await tap(chip(t[1].name)); await tap(chip(t[3].name)); await flushAll(5);
    await tap(screen.getByText('Zapisz plan')); await flushAll(5);
    expect(lastAlert('Ustawić nowy plan jako aktywny?')!.msg).toBe('Szablony zostają bez zmian. Plan trafi do „Inne plany” albo od razu jako aktywny.\n\nObecny plan zostanie w „Inne plany” — wrócisz do niego jednym przyciskiem.');
    await press('Ustawić nowy plan jako aktywny?', 'Anuluj'); expect(plan.savedPlans()).toEqual([]);
    await tap(screen.getByText('Zapisz plan')); await flushAll(5); await press('Ustawić nowy plan jako aktywny?', 'Tylko zapisz');
    expect(lastAlert('Zapisano')!.msg).toBe('Plan „Moje szablony, 3× w tygodniu” jest w „Inne plany”.'); expect(plan.weekPlanDays()[0]).toBe(t[1].id);
    await tap(screen.getByText('Zapisz plan')); await flushAll(5); await press('Ustawić nowy plan jako aktywny?', 'Ustaw jako aktywny');
    expect(lastAlert('Zapisano')!.msg).toBe('Plan „Moje szablony, 3× w tygodniu (2)” jest teraz aktywny.');
    const r = ownPlan({ templateIds: [t[0].id, t[2].id], sessions: 3 })!; expect(plan.weekPlanDays()).toEqual(r.days);
    expect(plan.savedPlans().map(p => p.name).sort()).toEqual(['Moje szablony, 3× w tygodniu', 'Mój plan (8.10)']);
    expect(JSON.stringify(S().templates)).toBe(snap);
    await press('Zapisano', 'Plan tygodnia'); expect(screen.getByLabelText(new RegExp(`^poniedziałek, ${t[0].name}$`))).toBeTruthy();
    await restart('/plan'); expect(plan.weekPlanDays()).toEqual(r.days); expect(plan.planName()).toBe('Moje szablony, 3× w tygodniu (2)'); expect(JSON.stringify(S().templates)).toBe(snap);
  });
  test('„Inne plany” pełne — komunikat zamiast pytania', async () => {
    await boot('/generator?mode=own', () => { S().savedPlans = Array.from({ length: store.SAVED_PLANS_MAX }, (_, i) => ({ id: `p${i}`, name: `P${i}`, days: [null, null, null, null, null, null, null] })); store.save(); });
    await tap(screen.getByText('Zapisz plan')); await flushAll(5); expect(lastAlert('Za dużo zapisanych planów')).toBeTruthy(); expect(lastAlert('Ustawić nowy plan jako aktywny?')).toBeUndefined();
  });
  test('EN: tryby, podgląd i zapis po angielsku', async () => {
    await boot('/generator?mode=own', () => {}, { locale: 'en' });
    expect(screen.getByText('Plan from my templates')).toBeTruthy(); expect(screen.getByText('New templates and plan')).toBeTruthy(); expect(screen.getByText('Training days per week')).toBeTruthy();
    await tap(screen.getByText('Save plan')); await flushAll(5); await press('Make the new plan active?', 'Make active');
    expect(lastAlert('Saved')!.msg).toBe('The plan “My templates, 4× a week” is now active.');
  });
});

describe('wejścia: edytor planu i „Pierwsze kroki”', () => {
  test('edytor planu: „Plan z moich szablonów” (tylko gdy jest szablon z ćwiczeniami) → tryb własnych szablonów', async () => {
    await boot('/plan'); await tap(screen.getByText('Plan z moich szablonów')); await flushAll(10); expect(screen.getByText('Dni treningowe w tygodniu')).toBeTruthy();
    await boot('/plan', () => {}, { demo: false }); expect(screen.queryByText('Plan z moich szablonów')).toBeNull();
  });
  test('„Pierwsze kroki”: szablon z ćwiczeniami bez planu → „Plan tygodnia” i „Plan z moich szablonów”', async () => {
    await boot('/'); expect(screen.getByTestId('first-steps')).toBeTruthy(); expect(screen.getByText('Plan tygodnia')).toBeTruthy();
    await tap(screen.getByText('Plan z moich szablonów')); await flushAll(10); expect(screen.getByText('Dni treningowe w tygodniu')).toBeTruthy();
  });
});

describe('scenariusz (polecenie koordynatora 09.10.2026): plan A/B/A/B z „Plan z moich szablonów” i jednorazowe zmiany dni', () => {
  test('ABAB → jednorazowo B→A tylko w jednej dacie (stały plan zostaje ABAB) → „Przywróć z planu” → „Przesuń plan o 1 dzień” → restart → nowy plan z moich szablonów pyta o zmiany dni i ich nie gubi', async () => {
    const t = await boot('/generator?mode=own'); const A = t[0], B = t[2];
    await tap(chip(t[1].name)); await tap(chip(t[3].name)); await flushAll(5); await tap(screen.getByLabelText('Dni treningowe w tygodniu: 4')); await flushAll(5);
    await tap(screen.getByText('Zapisz plan')); await flushAll(5); await press('Ustawić nowy plan jako aktywny?', 'Ustaw jako aktywny');
    const abab = plan.weekPlanDays(); expect(abab.filter(Boolean)).toEqual([A.id, B.id, A.id, B.id]); /* pon A, wt B, czw A, sob B */
    expect(abab).toEqual([A.id, B.id, null, A.id, null, B.id, null]);
    /* wtorek 13.10 (następny tydzień): jednorazowo B → A — w tym tygodniu A, A, A, B; stały plan dalej A, B, A, B */
    const wk = (from: number) => [0, 1, 3, 5].map(d => plan.plannedOn(`2026-10-${String(from + d).padStart(2, '0')}`));
    await go('/history'); await flushAll(10); await tap(screen.getByTestId('cal-2026-10-13')); await flushAll(5);
    expect(screen.getByText(`Zaplanowany: ${B.name}`)).toBeTruthy(); await tap(screen.getByText('Inny trening')); await flushAll(5); await tap(screen.getByText(A.name)); await flushAll(5);
    expect(wk(12)).toEqual([A.id, A.id, A.id, B.id]); expect(S().planOverrides).toEqual({ '2026-10-13': A.id }); /* zmiana tylko tej daty */
    expect(plan.weekPlanDays()).toEqual(abab); expect(wk(19)).toEqual([A.id, B.id, A.id, B.id]); /* kolejny tydzień — znów A, B, A, B */
    expect(screen.getByText(`Zaplanowany: ${A.name} · zmiana planu`)).toBeTruthy();
    /* „Przywróć z planu” */
    await tap(screen.getByText('Więcej opcji')); await flushAll(5); await tap(screen.getByText('Przywróć z planu')); await flushAll(5);
    expect(wk(12)).toEqual([A.id, B.id, A.id, B.id]); expect(S().planOverrides ?? {}).toEqual({});
    /* „Przesuń albo pomiń” → „Przesuń plan o 1 dzień” z dzisiejszego (czw. A) */
    await tap(screen.getByTestId('cal-2026-10-08')); await flushAll(5); await tap(screen.getByText('Przesuń albo pomiń')); await flushAll(5);
    const more = screen.queryByText(/^Więcej możliwości/); if (more) { await tap(more); await flushAll(5); }
    await tap(screen.getByLabelText('Zastosuj: Przesuń plan o 1 dzień')); await flushAll(5);
    expect(plan.plannedOn('2026-10-08')).toBeNull(); expect(plan.plannedOn('2026-10-09')).toBe(A.id); expect(plan.weekPlanDays()).toEqual(abab);
    const ov = { ...S().planOverrides }; expect(Object.keys(ov).length).toBeGreaterThan(0);
    await restart('/history'); expect(S().planOverrides).toEqual(ov); expect(plan.weekPlanDays()).toEqual(abab);
    /* zamiana planu przez „Plan z moich szablonów” — pytanie mówi o zmianach dni; po zmianie zostają z poprzednim planem i wracają przy jego aktywacji */
    await go('/generator?mode=own'); await flushAll(10); await tap(chip(t[1].name)); await tap(chip(t[3].name)); await flushAll(5);
    const n = plan.futureChanges(); expect(n).toBeGreaterThan(0);
    await tap(screen.getByText('Zapisz plan')); await flushAll(5);
    expect(lastAlert('Ustawić nowy plan jako aktywny?')!.msg).toContain(`Obecny plan zostanie w „Inne plany” razem ze zmianami pojedynczych dni od dziś (${n}) — wrócą, gdy znów go ustawisz.`);
    await press('Ustawić nowy plan jako aktywny?', 'Ustaw jako aktywny');
    const old = plan.savedPlans().find(p => p.name === 'Moje szablony, 4× w tygodniu')!; expect(Object.keys(old.overrides ?? {}).length).toBe(n);
    plan.activatePlan(old.id); expect(plan.weekPlanDays()).toEqual(abab); expect(plan.plannedOn('2026-10-09')).toBe(A.id); expect(plan.plannedOn('2026-10-08')).toBeNull();
  });
});
